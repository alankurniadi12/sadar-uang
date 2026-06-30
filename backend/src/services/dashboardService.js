import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";
import { getMonthDateRange, getYearDateRange } from "../utils/dateRange.js";

const normalizeTransaction = (transaction) => ({
  id: transaction.id,
  date: transaction.date,
  type: transaction.type,
  description: transaction.description,
  category: transaction.category,
  amount: transaction.amount,
});

const sumByType = (transactions, type) => {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

const getMonthDays = (month, year) => {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

export const getDashboardSummary = async (userId, query) => {
  const { startDate, endDate } = getMonthDateRange(
    Number(query.month),
    Number(query.year),
  );
  const transactions = await Transaction.find({
    user: userId,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  });
  const incomeTotal = sumByType(transactions, "income");
  const expenseTotal = sumByType(transactions, "expense");

  return {
    incomeTotal,
    expenseTotal,
    balance: incomeTotal - expenseTotal,
    transactionCount: transactions.length,
  };
};

export const getDailyData = async (userId, query) => {
  const month = Number(query.month);
  const year = Number(query.year);
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const { startDate, endDate } = getMonthDateRange(month, year);
  const rows = await Transaction.aggregate([
    {
      $match: {
        user: userObjectId,
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
  ]);
  const totalsByDay = new Map();

  rows.forEach((row) => {
    const day = row._id.day;
    const current = totalsByDay.get(day) || { income: 0, expense: 0 };
    current[row._id.type] = row.total;
    totalsByDay.set(day, current);
  });

  return Array.from({ length: getMonthDays(month, year) }, (_, index) => {
    const day = index + 1;
    const totals = totalsByDay.get(day) || { income: 0, expense: 0 };
    const date = new Date(Date.UTC(year, month - 1, day))
      .toISOString()
      .slice(0, 10);

    return {
      date,
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense,
    };
  });
};

export const getMonthlyData = async (userId, query) => {
  const year = Number(query.year);
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const { startDate, endDate } = getYearDateRange(year);
  const rows = await Transaction.aggregate([
    {
      $match: {
        user: userObjectId,
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
  ]);
  const totalsByMonth = new Map();

  rows.forEach((row) => {
    const month = row._id.month;
    const current = totalsByMonth.get(month) || { income: 0, expense: 0 };
    current[row._id.type] = row.total;
    totalsByMonth.set(month, current);
  });

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const totals = totalsByMonth.get(month) || { income: 0, expense: 0 };

    return {
      month,
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense,
    };
  });
};

export const getCategoryData = async (userId, query) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const { startDate, endDate } = getMonthDateRange(
    Number(query.month),
    Number(query.year),
  );
  const rows = await Transaction.aggregate([
    {
      $match: {
        user: userObjectId,
        type: "expense",
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);

  return rows.map((row) => ({
    category: row._id,
    total: row.total,
  }));
};

export const getRecentTransactions = async (userId) => {
  const transactions = await Transaction.find({ user: userId })
    .sort({ date: -1, createdAt: -1 })
    .limit(5);

  return transactions.map(normalizeTransaction);
};
