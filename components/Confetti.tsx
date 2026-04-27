import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../constants/theme';

const CONFETTI_COUNT = 40;
const COLORS = [colors.gold, colors.goldLight, colors.maroon, colors.white, '#E8A0BF', '#FF6B6B'];
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Piece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  startX: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const pieces = useRef<Piece[]>(
    Array.from({ length: CONFETTI_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      startX: Math.random() * SCREEN_W,
    }))
  ).current;

  useEffect(() => {
    if (!active) return;

    const animations = pieces.map((p) => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.rotate.setValue(0);
      p.opacity.setValue(1);
      p.startX = Math.random() * SCREEN_W;

      const drift = (Math.random() - 0.5) * 200;
      const duration = 1800 + Math.random() * 1200;
      const delay = Math.random() * 400;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: SCREEN_H + 50,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.x, {
            toValue: drift,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.rotate, {
            toValue: 3 + Math.random() * 5,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(duration * 0.6),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    Animated.parallel(animations).start();
  }, [active]);

  if (!active) return null;

  return (
    <>
      {pieces.map((p, i) => {
        const spin = p.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                width: p.size,
                height: p.size * 0.6,
                backgroundColor: p.color,
                left: p.startX,
                top: -20,
                opacity: p.opacity,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { rotate: spin },
                ],
              },
            ]}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    borderRadius: 2,
    zIndex: 1000,
  },
});
