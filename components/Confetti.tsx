import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

const CONFETTI_COUNT = 80;
const COLORS = ['#FFD93D', '#F8B4D9', '#A8D8EA', '#FF6B6B', '#C3AED6', '#7AACCE', '#FFFFFF', '#F5E6A3', '#90E0AB'];
const SHAPES = ['rect', 'rect', 'rect', 'circle', 'circle'];
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Piece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  startX: number;
  shape: string;
}

export default function Confetti({ active }: { active: boolean }) {
  const pieces = useRef<Piece[]>(
    Array.from({ length: CONFETTI_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 10,
      startX: Math.random() * SCREEN_W,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }))
  ).current;
  const runningAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!active) {
      // Halt any in-flight animation when the parent toggles confetti off
      // (e.g. when the user taps Next). Without this, the underlying
      // Animated.Values keep ticking even after the views unmount.
      runningAnim.current?.stop();
      runningAnim.current = null;
      return;
    }

    const animations = pieces.map((p) => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.rotate.setValue(0);
      p.opacity.setValue(1);
      p.startX = Math.random() * SCREEN_W;

      const drift = (Math.random() - 0.5) * 300;
      const duration = 2200 + Math.random() * 2000;
      const delay = Math.random() * 800;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: SCREEN_H + 80,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.x, {
            toValue: drift,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.rotate, {
            toValue: 4 + Math.random() * 8,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(duration * 0.65),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: duration * 0.35,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    const composite = Animated.parallel(animations);
    runningAnim.current = composite;
    composite.start(() => {
      if (runningAnim.current === composite) runningAnim.current = null;
    });

    return () => {
      runningAnim.current?.stop();
      runningAnim.current = null;
    };
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
                height: p.shape === 'circle' ? p.size : p.size * 0.55,
                borderRadius: p.shape === 'circle' ? p.size / 2 : 2,
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
    zIndex: 1000,
  },
});
