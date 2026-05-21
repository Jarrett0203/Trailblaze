import mongoose from "mongoose";

export const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  splitBy: {
    type: String,
    required: true
  },
  paidBy: {
    type: String,
    required: true
  }
})

export default mongoose.model("Expense", expenseSchema)