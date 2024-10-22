import React from 'react';
import {Text, useFont} from '@shopify/react-native-skia';
import { useAnimatedProps } from 'react-native-reanimated';

type Props = {
  x: number;
  y: number;
  text: string;
};

const XAxisText = ({x, y, text}: Props) => {
  const fontsLoaded = useFont(require('../assets/fonts/Poppins-Bold.ttf'), 16);
    if (!fontsLoaded) {
      return null;
    }

  const fontSize = fontsLoaded.measureText(text);

  return (
    <Text
      font={fontsLoaded}
      x={x - fontSize.width / 2}
      y={y}
      text={text}
      color={'white'}
    />
  );
};

export default XAxisText;
