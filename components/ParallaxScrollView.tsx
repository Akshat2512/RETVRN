import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';


type Props = PropsWithChildren<{
  headerComponent: ReactElement;
  HEADER_HEIGHT: number;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerComponent,
  HEADER_HEIGHT,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const bottom = useBottomTabOverflow();
 
 const headerAnimatedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT/2, 0, HEADER_HEIGHT ],
          [-HEADER_HEIGHT/2, 0, HEADER_HEIGHT * 0.75],
          // 'clamp'
        ),
      },
       {
        translateX: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT/2, 0, HEADER_HEIGHT ],
          [-10, 1, -50],
          // 'clamp'
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [1.5, 1, 0.8],
          // 'clamp'
        ),
      },
    ],
  };
});
  return (
    <ThemedView style={[styles.container, {backgroundColor: headerBackgroundColor[colorScheme]}]}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
        >
        <Animated.View
          style={[
            styles.header,
            headerAnimatedStyle,
            {height: HEADER_HEIGHT}
          ]}>
          {headerComponent}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:"100%",

  },
  header: {
    overflow: 'visible',
    // width:  "220%"
    // alignItems:"flex-start"
  },
  content: {
    // flex: 1,
    height:1000,
    gap: 16,
    boxShadow: "0 -4px 18px rgba(0, 0, 0, 0.85)",
    overflow: 'hidden',
  },
});
