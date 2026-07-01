import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const USER_STATUSES = ["active", "inactive"];

const normalizeUser = (user, metrics = {}) => ({
  id: user.id || user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role || "user",
  status: user.status || "active",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLoginAt: user.lastLoginAt || null,
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
  const conditions = [];

  if (query.search) {
    conditions.push({
      $or: [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ],
    });
  }

  if (query.role === "user") {
    conditions.push({
      $or: [
        { role: "user" },
        { role: { $exists: false } },
      ],
    });
  } else if (query.role) {
    conditions.push({ role: query.role });
  }

  if (query.status === "active") {
    conditions.push({
      $or: [
        { status: "active" },
        { status: { $exists: false } },
      ],
    });
  } else if (query.status) {
    conditions.push({ status: query.status });
  }

  return conditions.length > 0 ? { $and: conditions } : {};
};

const buildUserSort = (query) => {
  const direction = query.sortDirection === "asc" ? 1 : -1;

  if (query.sortBy === "name") {
    return {
      sortName: direction,
      createdAt: -1,
      _id: 1,
    };
  }

  if (query.sortBy === "activity") {
    return {
      hasActivity: -1,
      sortActivity: direction,
      createdAt: -1,
      _id: 1,
    };
  }

  return {
    createdAt: -1,
    _id: 1,
  };
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
  const startOfLast30Days = new Date();
  startOfLast30Days.setUTCDate(startOfLast30Days.getUTCDate() - 30);
  startOfLast30Days.setUTCHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    adminUsers,
    newUsersThisMonth,
    totalTransactions,
    usersWithTransactions,
    activeUsersLast30Days,
    transactionTotals,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({
      $or: [
        { status: "active" },
        { status: { $exists: false } },
      ],
    }),
    User.countDocuments({ status: "inactive" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Transaction.countDocuments(),
    Transaction.distinct("user"),
    Transaction.distinct("user", { createdAt: { $gte: startOfLast30Days } }),
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
    usersWithTransactions: usersWithTransactions.length,
    activeUsersLast30Days: activeUsersLast30Days.length,
    incomeTotal: totalsByType.get("income") || 0,
    expenseTotal: totalsByType.get("expense") || 0,
  };
};

export const getAdminUsers = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const skip = (page - 1) * limit;
  const filter = buildUserFilter(query);
  const sort = buildUserSort(query);

  const [users, total] = await Promise.all([
    User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "user",
          as: "transactions",
        },
      },
      {
        $addFields: {
          transactionCount: { $size: "$transactions" },
          incomeTotal: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$transactions",
                    as: "transaction",
                    cond: { $eq: ["$$transaction.type", "income"] },
                  },
                },
                as: "transaction",
                in: "$$transaction.amount",
              },
            },
          },
          expenseTotal: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$transactions",
                    as: "transaction",
                    cond: { $eq: ["$$transaction.type", "expense"] },
                  },
                },
                as: "transaction",
                in: "$$transaction.amount",
              },
            },
          },
          lastTransactionAt: { $max: "$transactions.createdAt" },
          hasActivity: {
            $cond: [
              { $gt: [{ $size: "$transactions" }, 0] },
              1,
              0,
            ],
          },
          sortActivity: {
            $ifNull: [
              { $max: "$transactions.createdAt" },
              new Date(0),
            ],
          },
          sortName: { $toLower: "$name" },
        },
      },
      {
        $project: {
          passwordHash: 0,
          transactions: 0,
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]),
    User.countDocuments(filter),
  ]);

  return {
    items: users.map((user) => normalizeUser(user, user)),
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
