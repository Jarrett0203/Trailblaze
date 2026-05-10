import { ScrollView, StyleSheet, Image, Text, View } from 'react-native'
import React from 'react'
import { guides } from '../types/Guide'

const FeaturedGuides = () => {


  return (
    <View>
      <ScrollView className='p-2' horizontal showsHorizontalScrollIndicator={false}>
        {guides?.map((guide, index) => (
          <View className="w-64 mr-4 rounded-2xl overflow-hidden bg-white shadow-lg">
            <Image className="w-full h-40" resizeMode="cover" source={{ uri: guide.image }} />
            <View className="ml-2 mr-2 py-3">
              <Text className=" text-base font-bold text-gray-900">{guide.place}</Text>
              <Text className="text-xs text-gray-600 bg-gray-100 rounded-lg px-2 py-1 mt-2">{guide.description}</Text>
              <View className='flex-row items-center mt-4'>
                <Image className="w-8 h-8 rounded-full mr-2" source={{ uri: guide.user.avatar }}/>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800">{guide.user.name}</Text>
                  <Text className="text-gray-500 text-[11px]">{guide.user.views} views</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default FeaturedGuides

const styles = StyleSheet.create({})