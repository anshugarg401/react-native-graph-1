import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AnimatedLineGraph, AnimatedLineGraphProps } from './AnimatedLineGraph'

import HoverBox from './HoverBox'


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