import mongoose from "mongoose";

export const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  splitOption: {
    type: String,
    required: true
  },
  paidBy: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

export default mongoose.model("Expense", expenseSchema)