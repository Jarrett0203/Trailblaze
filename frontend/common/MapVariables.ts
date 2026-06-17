import { Dimensions, Platform } from "react-native";

export const { width } = Dimensions.get("window");
const NATIVE_CARD_WIDTH = width * 0.8;
const WEB_CARD_WIDTH = width * 0.4;
export const CARD_WIDTH = Platform.OS === 'web' ? WEB_CARD_WIDTH : NATIVE_CARD_WIDTH; 
export const SPACING = 12;
