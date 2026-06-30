import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const USER_STATUSES = ["active", "inactive"];

const normalizeUser = (user, metrics = {}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  transactionCount: metrics.transactionCount || 0,
  incomeTotal: metrics.incomeTotal || 0,
  expenseTotal: metrics.expenseTotal || 0,
  balance: (metrics.incomeTotal || 0) - (metrics.expenseTotal || 0),
  lastTransactionAt: metrics.lastTransactionAt || null,
});

const getUserNotFoundError = () => {
  const error = new Error("User tidak ditemukan.");
  error.statusCode = 404;
  return error;
};

const ensureValidUserId = (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw getUserNotFoundError();
  }
};

const buildUserFilter = (query) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
};

const getUserMetrics = async (userIds) => {
  if (userIds.length === 0) {
    return new Map();
  }

  const rows = await Transaction.aggregate([
    {
      $match: {
        user: {
          $in: userIds.map((userId) => new mongoose.Types.ObjectId(userId)),
        },
      },
    },
    {
      $group: {
        _id: "$user",
        transactionCount: { $sum: 1 },
        incomeTotal: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expenseTotal: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
        lastTransactionAt: { $max: "$createdAt" },
      },
    },
  ]);

  return new Map(rows.map((row) => [row._id.toString(), row]));
};

export const getAdminSummary = async () => {
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    adminUsers,
    newUsersThisMonth,
    totalTransactions,
    activeUsersWithTransactions,
    transactionTotals,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    User.countDocuments({ status: "inactive" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Transaction.countDocuments(),
    Transaction.distinct("user"),
    Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const totalsByType = new Map(transactionTotals.map((row) => [row._id, row.total]));

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    adminUsers,
    newUsersThisMonth,
    totalTransactions,
    usersWithTransactions: activeUsersWithTransactions.length,
    incomeTotal: totalsByType.get("income") || 0,
    expenseTotal: totalsByType.get("expense") || 0,
  };
};

export const getAdminUsers = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const skip = (page - 1) * limit;
  const filter = buildUserFilter(query);

  const [users, total] = await Promise.all([
    User.find(filter).select("-passwordHash").sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  const metricsByUserId = await getUserMetrics(users.map((user) => user.id));

  return {
    items: users.map((user) => normalizeUser(user, metricsByUserId.get(user.id))),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAdminUserDetail = async (userId) => {
  ensureValidUserId(userId);

  const user = await User.findById(userId).select("-passwordHash");

  if (!user) {
    throw getUserNotFoundError();
  }

  const metricsByUserId = await getUserMetrics([user.id]);

  return normalizeUser(user, metricsByUserId.get(user.id));
};

export const updateAdminUserStatus = async (adminId, userId, status) => {
  ensureValidUserId(userId);

  if (!USER_STATUSES.includes(status)) {
    const error = new Error("Status user tidak valid.");
    error.statusCode = 422;
    throw error;
  }

  if (adminId === userId) {
    const error = new Error("Admin tidak bisa mengubah status akunnya sendiri.");
    error.statusCode = 422;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    {
      new: true,
      runValidators: true,
    },
  ).select("-passwordHash");

  if (!user) {
    throw getUserNotFoundError();
  }

  const metricsByUserId = await getUserMetrics([user.id]);

  return normalizeUser(user, metricsByUserId.get(user.id));
};
