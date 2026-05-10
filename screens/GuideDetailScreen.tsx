import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RouteProp } from '@react-navigation/native'
import { GuideStackParamList } from '../navigation/GuideStack'
import { itineraries } from '../types/Itinerary';
import { additionalAttributes } from '../types/AdditionalAttributes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Attribute, { AttributeIcon } from '../components/Attribute';

type GuideDetailScreenRouteProp = RouteProp<GuideStackParamList, 'GuideDetail'>;

type GuideDetailScreenProps = {
  route: GuideDetailScreenRouteProp,
  navigation: any
}

const GuideDetailScreen = (props: GuideDetailScreenProps) => {
  const {route, navigation} = props;
  const {guide} = route?.params;
  const itinerary = itineraries[guide.name] || [];
  const extraAttributes = additionalAttributes[guide.name] || {entryFee: "N/A", travelTips:[]}
  
  return (
    <SafeAreaView>
      <ScrollView>
        <ImageBackground className='w-full h-80' source={{uri: guide.image}}>
          <TouchableOpacity className='absolute top-4 left-4 p-2 bg-white/80 rounded-full z-10' onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={24} color="#FF5722" />
          </TouchableOpacity>

          <View className="p-4 flex-1 justify-end">
            <Text className="text-white text-2xl font-bold">
              {guide.name}
            </Text>
          </View>
        </ImageBackground>

        <View className='p-4'>
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">About</Text>
            <Text className="text-base font-medium text-gray-800">{guide.description}</Text>
          </View>

          <View className="border-t border-gray-200 pt-4 mb-6">
            <Text className="text-lg font-semibold text-gray">Details</Text>
            <Attribute attribute={guide.attributes.location} attributeIcon={AttributeIcon.Location} />
            <Attribute attribute={guide.attributes.type} attributeIcon={AttributeIcon.Type} />
            <Attribute attribute={guide.attributes.bestTime} attributeIcon={AttributeIcon.BestTime} />
            <Attribute attribute={guide.attributes.attractions.join(", ")} attributeIcon={AttributeIcon.Attractions} />
            <Attribute attribute={extraAttributes.entryFee} attributeIcon={AttributeIcon.EntryFee} />
          </View>

          {itinerary.length > 0 && (
            <View className="border-t border-gray-200 pt-4 mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Suggested Itinerary
              </Text>
              {itinerary.map((item) => (
                <View className="flex-row items-start mb-2" key={item}>
                  <Text className="text-gray-800 text-base font-medium">• {item}</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default GuideDetailScreen

const styles = StyleSheet.create({})