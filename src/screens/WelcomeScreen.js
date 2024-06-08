import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return(
    <View className="bg-[#f64e32] flex-1 justify-end items-center space-y-10 relative">
        <Image
            source={require("../../assets/images/welcome.png")}
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
            }}
            resizeMode="cover"
        />

        <StatusBar style="light"/>
        
        {/*Title and button*/}
        <View className="flex items-center justify-center py-28 max-w-[80%]"> 

            <View className="my-4 mb-20">
                <TouchableOpacity 
                    className="px-12 py-3 rounded-lg bg-violet-700"
                    onPress={() => navigation.navigate("HomeTab")}
                >
                    <Text className="text-white text-lg font-medium">Explore</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-violet-700 tracking-widest mb-3 text-lg text-center font-medium">
                Browse and save movies with IMBD
            </Text>

        </View>
    </View>
);
}
