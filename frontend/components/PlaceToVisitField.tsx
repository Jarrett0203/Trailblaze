import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { IoniconsGlyphs } from '../types/IoniconGlyphs'

type PlaceToVisitFieldProps = {
  field: string
  iconName: IoniconsGlyphs
  children: ReactNode
}

const PlaceToVisitField = (props: PlaceToVisitFieldProps) => {
  const { field, iconName, children } = props;

  return (
    <View className="mb-4">
      <View className="flex-row items-center">
        <Ionicons name={`${iconName}`} size={16} color={"#485563"} />
        <Text className="text-sm font-semibold text-gray-700 ml-1">{field}</Text>
      </View>
      {children}
    </View>
  )
}

export default PlaceToVisitField

const styles = StyleSheet.create({})