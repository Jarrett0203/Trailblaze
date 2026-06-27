import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Expense, ExpenseForm, SplitOption } from "../types/Expense";
import { useUser } from "@clerk/expo";
import { categories, splitOptions } from "../common/Expense";
import ExpenseTextInput from "./ExpenseTextInput";
import { ModalMode } from "../screens/PlanTripScreen";
import dayjs from "dayjs";

type AddExpenseProps = {
  modalMode: ModalMode;
  expenseForm: ExpenseForm;
  editingExpense: Expense | null;
  setModalMode: (modalMode: ModalMode) => void;
  setModalVisible: (modalVisible: boolean) => void;
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
  setExpenseForm: (expenseForm: ExpenseForm) => void;
  setError: (error: string) => void;
};

const AddExpense = (props: AddExpenseProps) => {
  const {
    modalMode,
    expenseForm,
    editingExpense,
    setModalMode,
    setModalVisible,
    setExpenses,
    setExpenseForm,
    setError,
  } = props;
  const { user: expoUser } = useUser();
  const username = expoUser?.fullName || "User";

  const handleAddExpense = () => {
    if (
      !expenseForm.description ||
      !expenseForm.category ||
      !expenseForm.amount
    ) {
      setError("Please fill in all expense fields");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      ...expenseForm,
      price: parseFloat(expenseForm.amount),
      date: dayjs().format("YYYY-MM-DD"),
    };

    setExpenses((prev) => [...prev, newExpense]);
    setExpenseForm({
      description: "",
      category: "",
      amount: "",
      paidBy: username,
      splitOption: "Don't Split",
    });
    setModalVisible(false);
    setModalMode("place");
  };

  const handleEditExpense = () => {
    if (
      !expenseForm.description ||
      !expenseForm.category ||
      !expenseForm.amount ||
      !editingExpense
    ) {
      setError("Please fill in all expense fields");
      return;
    }

    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === editingExpense.id
          ? {
              ...expense,
              ...expenseForm,
              price: parseFloat(expenseForm.amount),
            }
          : expense,
      ),
    );

    setExpenseForm({
      description: "",
      category: "",
      amount: "",
      paidBy: username,
      splitOption: "Don't Split",
    });
  };

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
          setExpenseForm({ ...expenseForm, amount: text.replace(/[^0-9.]/g, "").replace(/^(\d+\.?\d{0,2}).*/g, "$1") })
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
