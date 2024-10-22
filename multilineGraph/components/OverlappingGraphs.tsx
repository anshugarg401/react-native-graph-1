import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AnimatedLineGraph, AnimatedLineGraphProps } from './AnimatedLineGraph'
import { point, SkPath } from '@shopify/react-native-skia'
import HoverBox from './HoverBox'
import { createGraphPath, createGraphPathWithGradient } from 'react-native-graph/src/CreateGraphPath'

interface OverlappingGraphsProps {
  graphs: AnimatedLineGraphProps[]
  width: number
  height: number
}

const OverlappingGraphs: React.FC<OverlappingGraphsProps> = ({ graphs, width, height }) => {

  
  return (
    <View style={[styles.container, { width, height }]}>
      {graphs.map((graphProps, index) => (
        <View key={index} style={StyleSheet.absoluteFill}>
          <AnimatedLineGraph
            {...graphProps}
            width={width}
            height={height}
          />
        </View>
      ))}
            <View style={styles.hoverBoxesContainer}>
        {graphs.map((graphProps, index) => (
          <HoverBox
            key={index}
            translationX={graphProps.x}
            translationY={graphProps.y}
            points = {graphProps.points}
        isActive={graphProps.isActive}
            // commands={graphProps.commands}
            // path={graphProps.path}
            range={graphProps.range}
            color={graphProps.color}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  hoverBoxesContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 100,

  },
})

export default OverlappingGraphs