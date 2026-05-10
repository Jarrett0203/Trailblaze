import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { guides } from "../types/Guide";
import Attribute, { AttributeIcon } from "../components/Attribute";
import { useNavigation } from "@react-navigation/native";
import { GuideStackParamList } from "../navigation/GuideStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const GuideScreen = () => {
  const [cardWidth, setCardWidth] = useState(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<GuideStackParamList>>();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">
            Explore Japan
          </Text>
          <Text className="text-sm font-medium text-gray-700 mt-1">
            Discover the best places to visit in Japan
          </Text>
        </View>

        <View
          className="p-4"
          onLayout={(e) => setCardWidth(e.nativeEvent.layout.width - 32)}
        >
          {guides?.map((guide) => (
            <Pressable
              key={guide.name}
              onPress={() => navigation.navigate("GuideDetail", { guide })}
              className="mt-4 rounded-xl overflow-hidden shadow-sm mx-auto w-full max-w-[1200px]"
            >
              <ImageBackground
                source={{ uri: guide.image }}
                resizeMode="cover"
                style={[
                  styles.image,
                  {
                    height:
                      cardWidth * (9 / 16) > 300 ? 300 : cardWidth * (9 / 16),
                  },
                ]}
              />

              <View className="p-4 border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-800">
                  {guide.name}
                </Text>
                <Text className="text-sm font-medium text-gray-700 mt-1">
                  {guide.description}
                </Text>
              </View>

              <View className="bg-white p-4">
                <Attribute
                  attribute={guide.attributes.location}
                  attributeIcon={AttributeIcon.Location}
                />
                <Attribute
                  attribute={guide.attributes.type}
                  attributeIcon={AttributeIcon.Type}
                />
                <Attribute
                  attribute={guide.attributes.bestTime}
                  attributeIcon={AttributeIcon.BestTime}
                />
                <Attribute
                  attribute={guide.attributes.attractions.join(", ")}
                  attributeIcon={AttributeIcon.Attractions}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuideScreen;

const styles = StyleSheet.create({
  image: {
    width: "100%",
  },
});
