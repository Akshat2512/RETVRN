import React, { useImperativeHandle, forwardRef } from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import AnimatedBot from './BotAnimation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width } = Dimensions.get('window');
const height = 540;

export const ConcentricCircles = forwardRef((props, ref) => {
  const amplitude = useSharedValue(0);

  // All circles start at this base radius
  const baseRadius = 60;
  // How much each circle's radius increases per amplitude
  const multipliers = [0.5, 1, 1.5, 2];

  useImperativeHandle(ref, () => ({
    animateAmp(targetAmp: number) {
      amplitude.value = withTiming(targetAmp/2, { duration: 200 });
    },
  }));

  // Animated props for each circle
  const animatedPropsArray = multipliers.map((mult, idx) =>
    useAnimatedProps(() => ({
      // When amplitude is 0, all radii are baseRadius
      // As amplitude increases, each circle grows by a different multiplier
      r: baseRadius + amplitude.value * mult,
    }))
  );

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{position:"absolute", height: 64, overflow:"hidden"}}>
        <AnimatedBot animation={true} />
      </View>
      <Svg height={height} width={width} style={{ borderColor: 'white', borderWidth:1, justifyContent: "center"}}>
        {multipliers.map((_, idx) => (
          <AnimatedCircle
            key={idx}
            cx={centerX}
            cy={centerY}
            animatedProps={animatedPropsArray[idx]}
            stroke={`rgba(143,143,143,${0.7 - idx * 0.15})`}
            strokeWidth={3}
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
});