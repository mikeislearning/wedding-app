import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ELEMENT_COUNT = 14;
const SYMBOLS = ['\uD83C\uDF38', '\uD83C\uDF3C', '\uD83C\uDF3A', '\u2728', '\uD83C\uDF3B', '\u2764', '\uD83E\uDEB7'];
const COLORS = [colors.gold, colors.goldLight, colors.maroonLight, '#F8B4D9', '#A8D8EA'];

interface FloatingElement {
  symbol: string;
  color: string;
  size: number;
  startX: number;
  opacity: number;
  duration: number;
  delay: number;
  swayAmount: number;
}

function createElements(): FloatingElement[] {
  return Array.from({ length: ELEMENT_COUNT }, () => ({
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 14 + Math.random() * 14,
    startX: Math.random() * SCREEN_WIDTH,
    opacity: 0.15 + Math.random() * 0.25,
    duration: 6000 + Math.random() * 6000,
    delay: Math.random() * 5000,
    swayAmount: 20 + Math.random() * 30,
  }));
}

function FloatingItem({ element }: { element: FloatingElement }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      translateY.setValue(0);
      translateX.setValue(0);

      Animated.loop(
        Animated.sequence([
          Animated.delay(element.delay),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -(SCREEN_HEIGHT + 40),
              duration: element.duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(translateX, {
                toValue: element.swayAmount,
                duration: element.duration / 4,
                useNativeDriver: true,
              }),
              Animated.timing(translateX, {
                toValue: -element.swayAmount,
                duration: element.duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(translateX, {
                toValue: 0,
                duration: element.duration / 4,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      ).start();
    };

    startAnimation();
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        bottom: -30,
        left: element.startX,
        fontSize: element.size,
        color: element.color,
        opacity: element.opacity,
        transform: [{ translateY }, { translateX }],
      }}
    >
      {element.symbol}
    </Animated.Text>
  );
}

export default function FloatingHearts() {
  const elements = useRef(createElements()).current;

  return (
    <View style={styles.container} pointerEvents="none">
      {elements.map((element, index) => (
        <FloatingItem key={index} element={element} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
