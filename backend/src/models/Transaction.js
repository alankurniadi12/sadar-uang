import mongoose from "mongoose";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
} from "../constants/transactionConstants.js";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPES,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES],
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
