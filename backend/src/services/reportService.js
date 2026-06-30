import Transaction from "../models/Transaction.js";
import { getMonthDateRange } from "../utils/dateRange.js";
import { getMonthName } from "../utils/formatDate.js";
import { generateMonthlyReportPdf } from "../utils/pdfGenerator.js";

const normalizeTransaction = (transaction) => ({
  id: transaction.id,
  date: transaction.date,
  type: transaction.type,
  description: transaction.description,
  category: transaction.category,
  amount: transaction.amount,
});

const buildCategorySummary = (transactions) => {
  const categoryMap = new Map();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const currentTotal = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentTotal + transaction.amount);
    });

  return Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
};

export const getMonthlyReport = async (user, query) => {
  const month = Number(query.month);
  const year = Number(query.year);
  const { startDate, endDate } = getMonthDateRange(month, year);
  const transactions = await Transaction.find({
    user: user.id,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  }).sort({ date: -1, createdAt: -1 });
  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenseTotal = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  return {
    user: {
      name: user.name,
      email: user.email,
    },
    period: {
      month,
      year,
      label: `${getMonthName(month)} ${year}`,
    },
    summary: {
      incomeTotal,
      expenseTotal,
      balance: incomeTotal - expenseTotal,
      transactionCount: transactions.length,
    },
    categorySummary: buildCategorySummary(transactions),
    transactions: transactions.map(normalizeTransaction),
    printedAt: new Date(),
  };
};

export const getMonthlyReportPdf = async (user, query) => {
  const report = await getMonthlyReport(user, query);
  const buffer = await generateMonthlyReportPdf(report);
  const filename = `sadar-uang-${report.period.year}-${String(
    report.period.month,
  ).padStart(2, "0")}.pdf`;

  return {
    filename,
    buffer,
  };
};
