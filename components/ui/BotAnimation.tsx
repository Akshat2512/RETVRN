import { useEffect, useRef, useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet, View, Animated, StyleProp, ViewStyle } from 'react-native';
import BotSVG from '@/components/ui/BotSvgData';
import { RetvrnScreen } from '../ChatScreen';



export default function AnimatedBot({animation}: {animation: boolean}){
const keyframes = [
      
        0, -65, -130, -195, -260, -325, -390, -455, -520, -585, -650,
      -715, -780, -845, -910, -975, -1040, -1105, -1170, -1235,
      -1300, -1365, -1430, -1495, -1560, -1625, -1690, -1755,
      -1820, -1885, -1950, -2015, -2080, -2145, -2210, -2275,
      -2340, -2405, -2470, -2535, -2600, -2665, -2730, -2795,-2860,-2925, -2990,-3055, -3120,-3185, -3250, -3315,
      -3380, -3445, 
    ];
  const translateY = useRef(new Animated.Value(keyframes[2])).current;
  const loop = useRef<any>(null);
  useEffect(() => {

    const durationPerStep = (Platform.OS == 'web' ? 1500 : 16) / keyframes.length;

   if(loop.current){
    loop?.current.reset()
    translateY.setValue(keyframes[2]);
   }
    loop.current = Animated.loop(
      Animated.sequence(
        keyframes.map((y, index) =>{ 
            const step = Animated.timing(translateY, {
                toValue:y,
                duration: 0,
                delay: durationPerStep,
                useNativeDriver: true,
            })
            
             if (index === 20) {
                return Animated.sequence([
                  step,
                  Animated.delay(2000) // ⏸️ Pause for 4 seconds
                ]);
              }
            if (index === 30) {
                return Animated.sequence([
                  step,
                  Animated.delay(2000) // ⏸️ Pause for 4 seconds
                ]);
              } 
             if (index === 53) {
                return Animated.sequence([
                  step,
                  Animated.delay(6000) // ⏸️ Pause for 4 seconds
                ]);
              }
            return step; 
        }
        )
      )
    );
    if(animation)
        setTimeout(()=> loop.current.start(), 1000)
  }, []);

  return (
    <>     
     <Animated.View style={{ transform: [{ translateY }] }}>
          <BotSVG/>
     </Animated.View> 
     </>
  )
}

