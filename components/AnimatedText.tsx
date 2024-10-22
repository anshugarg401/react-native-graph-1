import {useWindowDimensions, View} from 'react-native';  
import React from 'react';  
import Animated, {SharedValue, useDerivedValue} from 'react-native-reanimated';  
import {Canvas, SkFont, Text} from '@shopify/react-native-skia';  

type Props = {  
  selectedValue: SharedValue<number>;  
  font: SkFont;  
  color: string;  
};  

const AnimatedText = ({selectedValue, font, color}: Props) => {  
  const {width} = useWindowDimensions();  
  const MARGIN_VERTICAL = 8;  

  const animatedText = useDerivedValue(() => {  
    return `${Math.round(selectedValue.value)}`;  
  }, [selectedValue.value]);  

  const textX = useDerivedValue(() => {  
    const _fontSize = font?.measureText(animatedText.value) ?? {width:0, height:0}; 
    return width / 2 - _fontSize.width / 2;  
  }, [width, animatedText, font]); 

  const fontSize = useDerivedValue(() => {  
    const _fontSize = font?.measureText(animatedText.value) ?? {width:0, height:0}; 
    return   _fontSize!.height / 2 + MARGIN_VERTICAL;
  }, [animatedText, font]);  


  return (  
    <Animated.View style={{width: width, height: fontSize.value+10, zIndex: 100}}>
      <Canvas style={{ flex: 1, height: fontSize.value+10  }}>  
        <Text  
          text={animatedText}  
          font={font}  
          color={color}  
          x={textX}  
          y={fontSize}
        />  
      </Canvas>  
    </Animated.View>  
  );  
};  

export default AnimatedText;