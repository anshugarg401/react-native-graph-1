import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AnimatedText from './AnimatedText';
import { getXInRange, getYInRange, GraphPathRange } from 'react-native-graph/src/CreateGraphPath';
import { PathCommand, useFont } from '@shopify/react-native-skia';
import { useGraphPath } from '../hooks/GraphPathGenerator';

interface HoverBoxProps {
  translationX: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  points: { date: Date; value: number }[];
  range: GraphPathRange;
  color: string;
  isActive: Animated.SharedValue<boolean>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const drawingHeight = 250;
const DEBOUNCE_DELAY = 16; // ~60fps

const HoverBox: React.FC<HoverBoxProps> = ({ translationX, translationY, points, range, color, isActive }) => {
  const commands = useSharedValue<PathCommand[]>([]);
  const selectedYValue = useSharedValue<number>(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const font = useFont(require('../assets/fonts/Poppins-Bold.ttf'), 13);
  const { Path } = useGraphPath({ enableRange: true, Points: points });

  useEffect(() => {
    commands.value = Path.toCmds();
  }, [Path]);

  const debouncedFindYValue = useCallback((x: number) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const startX = getXInRange(SCREEN_WIDTH-40, points[0]!.date, range.x) + 20;
    const endX = getXInRange(SCREEN_WIDTH-40, points[points.length - 1]!.date, range.x) + 20;

    const getGraphDataIndex = (pixel: number) =>
      Math.round(((pixel - startX) / (endX - startX)) * (points.length - 1));

    const index = getGraphDataIndex(translationX.value);
    const value = points[index]?.value;

    debounceTimer.current = setTimeout(() => {
      const y = drawingHeight - getYInRange(drawingHeight, value, range.y) - 20;
      if (y != null) {
        selectedYValue.value = y;
      }
    }, DEBOUNCE_DELAY);
  }, [commands, selectedYValue, points, range]);

  useDerivedValue(() => {
    runOnJS(debouncedFindYValue)(translationX.value);
  }, [translationX, debouncedFindYValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive.value ? 1 : 0, { duration: 300, easing: Easing.ease }),
    transform: [
      { translateX: translationX.value - SCREEN_WIDTH + 70 }, // Adjusted for centering
      { translateY: 0 }, // Lift the box above the cursor
    ] as const,
  }), [translationX, isActive]);

  if (!font) {
    return null;
  }

  return (
    <Animated.View style={[styles.hoverBox, animatedStyle]}>
      <View style={styles.dataContainer}>
        <AnimatedText selectedValue={selectedYValue} font={font} color={color} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hoverBox: {
    position: 'relative',
    width: 40,
    height: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default HoverBox;
