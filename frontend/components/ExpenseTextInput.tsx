import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

type ExpenseTextInputProps = {
  subtitle: string,
  value: string,
  onChangeText: (text: string) => void,
  placeholder: string,
};

const ExpenseTextInput = (props: ExpenseTextInputProps) => {
  const {subtitle, value, onChangeText, placeholder} = props;
  
  return (
    <>
      <Text className="text-sm font-medium mb-2">{subtitle}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="bg-gray-100 p-3 rounded-lg mb-4"
      />
    </>
  );
};

export default ExpenseTextInput;

const styles = StyleSheet.create({});
