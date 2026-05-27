import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

type AccordionProps = {
  header: string;
  description: ReactNode;
}

const Accordion = (props: AccordionProps) => {
  const {header, description} = props;
  const [showAccordion, setShowAccordion] = useState(false);

  return (
    <View className='border-t border-gray-200 bg-white'>
      <Pressable onPress={() => setShowAccordion(!showAccordion)} className='p-4 flex-row justify-between items-center'>
        <Text>{header}</Text>
        <Ionicons name={showAccordion ? 'chevron-up': 'chevron-down'} color={'gray'} size={20} />
      </Pressable>
      {
        showAccordion && (
          <View className="px-4 pb-4">
            {description}
          </View>
        )
      }
    </View>
  )
}

export default Accordion

const styles = StyleSheet.create({})