import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";
import { getMonthDateRange } from "../utils/dateRange.js";

const notFoundError = () => {
  const error = new Error("Transaksi tidak ditemukan.");
  error.statusCode = 404;
  return error;
};

const normalizeTransaction = (transaction) => ({
  id: transaction.id,
  date: transaction.date,
  type: transaction.type,
  description: transaction.description,
  category: transaction.category,
  amount: transaction.amount,
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

const ensureValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw notFoundError();
  }
};

const buildTransactionFilter = (userId, query) => {
  const filter = { user: userId };
  const { type, category, month, year, search } = query;

  if (type) {
    filter.type = type;
  }

  if (category) {
    filter.category = category;
  }

  if (month && year) {
    const { startDate, endDate } = getMonthDateRange(Number(month), Number(year));
    filter.date = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  if (search) {
    filter.description = {
      $regex: search,
      $options: "i",
    };
  }

  return filter;
};

export const getTransactions = async (userId, query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const skip = (page - 1) * limit;
  const filter = buildTransactionFilter(userId, query);

  const [items, total] = await Promise.all([
    Transaction.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ]);

  return {
    items: items.map(normalizeTransaction),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createTransaction = async (userId, payload) => {
  const transaction = await Transaction.create({
    user: userId,
    date: payload.date,
    type: payload.type,
    description: payload.description,
    category: payload.category,
    amount: payload.amount,
  });

  return normalizeTransaction(transaction);
};

export const getTransactionById = async (userId, transactionId) => {
  ensureValidObjectId(transactionId);

  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  });

  if (!transaction) {
    throw notFoundError();
  }

  return normalizeTransaction(transaction);
};

export const updateTransaction = async (userId, transactionId, payload) => {
  ensureValidObjectId(transactionId);

  const transaction = await Transaction.findOneAndUpdate(
    {
      _id: transactionId,
      user: userId,
    },
    {
      date: payload.date,
      type: payload.type,
      description: payload.description,
      category: payload.category,
      amount: payload.amount,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!transaction) {
    throw notFoundError();
  }

  return normalizeTransaction(transaction);
};

export const deleteTransaction = async (userId, transactionId) => {
  ensureValidObjectId(transactionId);

  const transaction = await Transaction.findOneAndDelete({
    _id: transactionId,
    user: userId,
  });

  if (!transaction) {
    throw notFoundError();
  }
};
