import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet, View, Animated, Easing } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { RetvrnScreen } from '@/components/ChatScreen';
import WebView from 'react-native-webview';
import AnimatedBot from '@/components/ui/BotAnimation';



export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [botScreen, setBotScreen] = useState(false);
  
  return (
    <View style={{flex:1}}>
                       
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          
        }}
      />
       <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="0.circle" color={color} />,
          
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear.circle.fill" color={color} />,
        }}
      />
    </Tabs>

    {botScreen && <RetvrnScreen screen={botScreen} setScreen={setBotScreen} />}
    
    { !botScreen && 
     <TouchableOpacity style={[styles.bot]} onPress={() => setBotScreen(!botScreen)}>
      <AnimatedBot animation={false}/>
     </TouchableOpacity>}

    </View>

  );
}

const styles = StyleSheet.create({
bot: {
    // flex:1,
    position: 'absolute',
    width: Platform.OS == 'android' ? "20%": null,
    bottom: Platform.OS == 'android' ? 100 : 50,
    maxHeight: 64,
    overflow:"hidden",
    // backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignSelf: "center",
    alignItems: 'center', 
    // padding: 30,
    // top:50
    transform:[{ scale: 0.7 }]
    // textAlign: "center",
  }
})
