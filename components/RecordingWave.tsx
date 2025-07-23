import { Dimensions, View } from 'react-native'
import Svg, { Path } from 'react-native-svg';
import React, { useEffect, useImperativeHandle, memo } from 'react';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';


//  function getWavePath(amplitude: number, phase: number, freqfactor: number, width: number, height: number, points: number) {
//   'worklet';
//   const freq = freqfactor* 2 * Math.PI / width;
//   let path = '';
//  for (let x = 0; x <= width; x += width / points) {
//   const y = height / 2 + amplitude * Math.sin(freq * x + phase);
//   if (x === 0) {
//     path = `M${x},${y}`; // Start at the first wave point
//   } else {
//     path += ` L${x},${y}`;
//   }
// }
// //   path += ` L${width},${height} L0,${height} Z`;
//   return path;
// }

function getWavePath(amplitude: number, phase: number, freqfactor: number, width: number, height: number, points: number) {
  'worklet';
  const freq = freqfactor * 2 * Math.PI / width;
  let path = '';
  for (let x = 0; x <= width; x += width / points) {
    const envelope = x / width;
    const y = height / 2 + amplitude * envelope * Math.sin(freq * x + phase);
    if (x === 0) {
      path = `M${x},${y}`;
    } else {
      path += ` L${x},${y}`;
    }
  }
  return path;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get("window"); // Get screen width dynamically

const WaveComponent = ({ref}:{ref:any}) => {
  console.log("Rendering Wave")
  const height = 240;
//   const amplitude =30;
  const points = 60;
//   const [db, setDb] = useState(-50);

  const phase = useSharedValue(0);
   const amplitude = useSharedValue(0);

  useEffect(() => {
    phase.value = 0; 
    phase.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 400, easing: Easing.linear }),
      -1,
      false
    );
  }, []);


   useImperativeHandle(ref, () => ({
      animateAmp(targetAmp: number) {
        amplitude.value = withTiming(targetAmp, { duration: 400 });
      },
    }));

  const animatedProps = useAnimatedProps(() => ({
    d: getWavePath(amplitude.value, phase.value, 2, width, height, points),
  }));

  return (
   
    <View style={{flexGrow:1, justifyContent:"center"}}>
      <Svg height={height} width={width}>
        <AnimatedPath animatedProps={animatedProps}   
        fill="none"
        stroke="rgb(143, 143, 143)"
        strokeWidth={3} />
      </Svg>
    </View>
  );
}

export default memo(WaveComponent);
    
  
