import { SplashScreen, Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider, useSelector } from 'react-redux';
import { store } from '@/store/store';
import { ActivityIndicator, View, Text, StyleSheet, Platform } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { StateProp } from "@/store/Reducers/stateReducer";

export default function RootLayout() {
  
  const [loaded] = useFonts({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
  
    useEffect(() => {
      if (loaded) {
        SplashScreen.hideAsync();
      }
    }, [loaded]);
  
    if (!loaded) {
      return null;
    }
  

  return (
    <Provider store ={store}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <MainComponent/>
      </View>
    </Provider>
  );
}


function MainComponent(){
   const colorScheme = useColorScheme();

  const connected = useSelector((state: StateProp) => state.states.connection);

  return (<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <View style={{ height: 30, width: "100%", position:"absolute", backgroundColor: connected ? "transparent": "rgba(233, 106, 106, 0.72)" }}>{Platform.OS == "web" && !connected && <Text style={{alignSelf: "center"}}> Connecting ... </Text>}</View>
             
            <StatusBar style={colorScheme === 'dark' ? "light" : "dark"} animated />
      </ThemeProvider>
      )
}
