import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import React from "react";
import { Expense, ExpenseForm, SplitOption } from "../types/Expense";
import { useAuth, useUser } from "@clerk/expo";
import { categories, splitOptions } from "../common/Expense";
import ExpenseTextInput from "./ExpenseTextInput";
import { ModalMode } from "../screens/PlanTripScreen";
import dayjs from "dayjs";
import axios from "axios";

type AddExpenseProps = {
  modalMode: ModalMode;
  expenseForm: ExpenseForm;
  editingExpense: Expense | null;
  tripId: string;
  onMutate: () => Promise<void>;
  setModalMode: (modalMode: ModalMode) => void;
  setModalVisible: (modalVisible: boolean) => void;
  setExpenseForm: (expenseForm: ExpenseForm) => void;
  setError: (error: string) => void;
};

const AddExpense = (props: AddExpenseProps) => {
  const {
    modalMode,
    expenseForm,
    editingExpense,
    tripId,
    onMutate,
    setModalMode,
    setModalVisible,
    setExpenseForm,
    setError,
  } = props;
  const { user: expoUser } = useUser();
  const username = expoUser?.fullName || "User";
  const { getToken } = useAuth();

  const resetForm = () => {
    setExpenseForm({
      description: "",
      category: "",
      amount: "",
      paidBy: username,
      splitOption: "Don't Split",
    });
  };

  const handleAddExpense = async () => {
    if (
      !expenseForm.description ||
      !expenseForm.category ||
      !expenseForm.amount
    ) {
      setError("Please fill in all expense fields");
      return;
    }

    const newExpense = {
      ...expenseForm,
      splitBy: expenseForm.splitOption,
      price: parseFloat(expenseForm.amount),
      date: dayjs().format("YYYY-MM-DD"),
    };

    try {
      const token = await getToken();
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/trips/${tripId}/expenses`,
        newExpense,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await onMutate();
      resetForm();
      setModalVisible(false);
      setModalMode("place");
    } catch (error) {
      setError("Failed to save expense");
    }
  };

  const handleEditExpense = async () => {
    if (
      !expenseForm.description ||
      !expenseForm.category ||
      !expenseForm.amount ||
      !editingExpense
    ) {
      setError("Please fill in all expense fields");
      return;
    }

    const newExpense = {
      ...expenseForm,
      description: expenseForm.description,
      category: expenseForm.category,
      price: parseFloat(expenseForm.amount),
      splitBy: expenseForm.splitOption,
      paidBy: expenseForm.paidBy,
      date: dayjs().format("YYYY-MM-DD"),
    };

    console.log(newExpense);

    try {
      const token = await getToken();
      await axios.patch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/trips/${tripId}/expenses/${editingExpense._id}`, newExpense, {
        headers: { Authorization: `Bearer ${token}`}
      })

      await onMutate();
      resetForm();
      setModalVisible(false);
      setModalMode("place");
    } catch (error) {
      setError("Failed to save expense");
    }
  }

  return (
    <ScrollView>
      <ExpenseTextInput
        subtitle="Description"
        value={expenseForm.description}
        onChangeText={(text) =>
          setExpenseForm({ ...expenseForm, description: text })
        }
        placeholder="Enter description"
      />
      <Text className="text-sm font-medium mb-2">Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {categories.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => setExpenseForm({ ...expenseForm, category })}
            className={`px-4 py-2 mr-2 rounded-lg ${expenseForm.category === category ? "bg-blue-500" : "bg-gray-100"}`}
          >
            <Text
              className={`px-4 py-2 mr-2 rounded-lg ${expenseForm.category === category ? "text-white" : "text-gray-700"}`}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ExpenseTextInput
        subtitle="Amount"
        value={expenseForm.amount}
        onChangeText={(text) =>
          setExpenseForm({
            ...expenseForm,
            amount: text
              .replace(/[^0-9.]/g, "")
              .replace(/^(\d+\.?\d{0,2}).*/g, "$1"),
          })
        }
        placeholder="Enter amount"
        numeric
      />
      <ExpenseTextInput
        subtitle="Paid By"
        value={expenseForm.paidBy}
        onChangeText={(text) =>
          setExpenseForm({ ...expenseForm, paidBy: text })
        }
        placeholder="Enter name"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {splitOptions.map((option, index) => (
          <Pressable
            key={index}
            onPress={() =>
              setExpenseForm({
                ...expenseForm,
                splitOption: option.value as SplitOption,
              })
            }
            className={`px-4 py-2 mr-2 rounded-lg ${expenseForm.splitOption === option.value ? "bg-blue-500" : "bg-gray-100"}`}
          >
            <Text
              className={`px-4 py-2 mr-2 rounded-lg ${expenseForm.splitOption === option.value ? "text-white" : "text-gray-700"}`}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={() =>
          modalMode === "editExpense" ? handleEditExpense() : handleAddExpense()
        }
        className="bg-blue-500 p-3 rounded-lg items-center"
      >
        <Text className="text-white font-medium">
          {modalMode === "editExpense" ? "Save Changes" : "Add Expense"}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({});
