import React, { useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { Circle, Group, Path, Shadow, Skia, useFont } from '@shopify/react-native-skia'
import {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { SelectionDotProps } from 'react-native-graph'
import {CHART_HEIGHT} from '../app/index'

export const CIRCLE_RADIUS = 8
export const CIRCLE_RADIUS_MULTIPLIER = 3

const SelectionDot: React.FC<SelectionDotProps> = ({ circleX: cx, circleY: cy, isActive, color }) => {
  const { width, height } = useWindowDimensions()
  const circleRadius = useSharedValue(0)
  const circleStrokeRadius = useDerivedValue(() => circleRadius.value * CIRCLE_RADIUS_MULTIPLIER)

  const path = useDerivedValue(() => {
    if (!isActive.value) return Skia.Path.Make()

    const dottedLine = Skia.Path.Make()
    dottedLine.moveTo(cx.value, cy.value)
    dottedLine.lineTo(cx.value, CHART_HEIGHT - 22 )
    dottedLine.dash(10, 10, 0)

    return dottedLine
  }, [isActive, cx, cy, height])
console.log(height)
  const setIsActive = useCallback(
    (active: boolean) => {
      circleRadius.value = withSpring(active ? CIRCLE_RADIUS : 0, {
        mass: 1,
        stiffness: 1000,
        damping: 50,
        velocity: 0,
      })
    },
    [circleRadius]
  )

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      runOnJS(setIsActive)(active)
    },
    [isActive, setIsActive]
  )

  return (
    <Group>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeJoin="round"
        strokeWidth={3}
      />
      <Circle
        opacity={0.05}
        cx={cx}
        cy={cy}
        r={circleStrokeRadius}
        color="#333333"
      />
      <Circle cx={cx} cy={cy} r={circleRadius} color={color}>
        <Shadow dx={0} dy={0} color="rgba(0,0,0,0.5)" blur={4} />
      </Circle>
    </Group>
  )
}

export default SelectionDot