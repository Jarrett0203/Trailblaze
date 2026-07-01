export type SplitOption = "Don't Split" | "Everyone";

export type Expense = ExpenseForm & {
  _id: string,
  price: number,
  date: string
}

export type ExpenseForm = {
  description: string;
  category: string;
  amount: string;
  paidBy: string;
  splitOption: SplitOption;
};
