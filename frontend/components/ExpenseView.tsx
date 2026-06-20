import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";
import { Expense, ExpenseForm } from "../types/Expense";
import { ModalMode } from "../screens/PlanTripScreen";
import { Ionicons } from "@expo/vector-icons";

type ExpenseViewProps = {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
  setEditingExpense: (expense: Expense) => void;
  setExpenseForm: (expenseForm: ExpenseForm) => void;
  setModalMode: (modalMode: ModalMode) => void;
  setModalVisible: (modalVisible: boolean) => void;
};

const ExpenseView = (props: ExpenseViewProps) => {
  const {
    expenses,
    setExpenses,
    setEditingExpense,
    setExpenseForm,
    setModalMode,
    setModalVisible,
  } = props;

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.price ?? expense.amount ?? 0),
    0,
  );

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    const amount = Number(expense.price ?? expense.amount ?? 0);
    setExpenseForm({
      description: expense.description,
      category: expense.category,
      amount: amount.toString(),
      paidBy: expense.paidBy,
      splitOption: expense.splitOption,
    });
    setModalMode("editExpense");
    setModalVisible(true);
  }

  function handleDeleteExpense(expenseId: string) {
    setExpenses((prev: Expense[]) =>
      prev.filter((expense) => expense.id !== expenseId),
    );
  }

  return (
    <ScrollView className="px-4 pt-4 bg-white">
      <View className="mb-6">
        <Text className="text-2xl font-extrabold">Budget</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Track your expenses for this trip
        </Text>
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold">
            Total: ${total.toFixed(2)}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setModalMode("expense");
            setModalVisible(true);
          }}
          className="bg-blue-500 p-3 rounded-lg items-center"
        >
          <Text className="text-white font-medium">Add New Expense</Text>
        </Pressable>
      </View>

      {expenses.map((expense, index) => {
        const amount = Number(expense.price ?? expense.amount ?? 0);
        return (
          <View key={index} className="mb-4 bg-gray-50 rounded-lg p-3 shadow">
            <View className="flex-row justify-between">
              <View>
                <Text className="text-sm font-semibold">{expense.description}</Text>
                <Text className="text-xs text-gray-500">{expense.category}</Text>
                <Text className="text-xs text-gray-500">Paid By: {expense.paidBy}</Text>
                <Text className="text-xs text-gray-500">Split: {expense.splitOption}</Text>
              </View>

              <View className="items-end">
                <Text className="text-sm font-semibold">${amount.toFixed(2)}</Text>
                <Text className="text-xs text-gray-400">{dayjs(expense.date).format("MMM D, YYYY")}</Text>
              </View>
            </View>

            <View className="flex-row justify-end mt-2 space-x-2">
              <Pressable
                onPress={() => handleEditExpense(expense)}
                className="bg-blue-100 p-2 rounded"
              >
                <Ionicons name="pencil" size={16} color={"#2563eb"} />
              </Pressable>
              <Pressable
                onPress={() => handleDeleteExpense(expense.id)}
                className="bg-red-100 p-2 rounded"
              >
                <Ionicons name="trash" size={16} color={"#dc2626"} />
              </Pressable>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ExpenseView;

const styles = StyleSheet.create({});
