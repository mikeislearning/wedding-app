import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface PulseRingProps {
  size: number;
  color: string;
  delay?: number;
}

const PulseRing: React.FC<PulseRingProps> = ({ size, color, delay = 0 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      scale.setValue(1);
      opacity.setValue(1);

      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1.5,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animate();
  }, [scale, opacity, delay]);

  const half = size / 2;

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: half,
          borderColor: color,
          marginLeft: -half,
          marginTop: -half,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    left: "50%",
    top: "50%",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
});

export default PulseRing;
