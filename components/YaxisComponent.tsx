import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { GraphPoint } from 'react-native-graph'
import { GraphPathRange } from 'react-native-graph/src/CreateGraphPath'

interface YAxisProps {
  data: GraphPoint[]
  range: GraphPathRange
  width: number
  height: number
  tickCount?: number
}

const YAxisComponent: React.FC<YAxisProps> = ({ data, range, width, height, tickCount = 5 }) => {
  const yAxisTicks = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    const { min: minY, max: maxY } = range.y
    const yRange = maxY - minY
    const tickInterval = yRange / (tickCount - 1)

    return Array.from({ length: tickCount }, (_, i) => {
      const value = maxY - i * tickInterval
      const pixel = (height ) * (1 - (value - minY) / yRange) + 20 // Adjust for top and bottom padding
      return { value, pixel }
    })
  }, [data, range.y, height, tickCount])

  if (yAxisTicks.length === 0) {
    return null
  }

  return (
    <View style={[styles.yAxis, { width, height }]}>
      <View style={styles.yAxisLine} />
      {yAxisTicks.map((tick, index) => (
        <View key={index} style={[styles.tick, { top: tick.pixel }]}>
          <Text style={styles.tickLabel}>{tick.value.toFixed(0)}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  yAxisLine: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 20,
    // right: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tick: {
    position: 'absolute',
    left: 0,
    // right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tickLabel: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'left',
    marginRight: 5,
    width: 20,
  },
})

export default YAxisComponent