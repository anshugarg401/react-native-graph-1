import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { GraphPoint } from 'react-native-graph'
import { GraphPathRange } from 'react-native-graph/src/CreateGraphPath'

interface XAxisProps {
  data: GraphPoint[]
  range: GraphPathRange
  width: number
  height: number
  tickCount?: number
}

const XAxisComponent: React.FC<XAxisProps> = ({ data, range, width, height, tickCount = 4 }) => {
  const xAxisTicks = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    const { min: minX, max: maxX } = range.x
    const xRange = maxX.getTime() - minX.getTime()
    const tickInterval = xRange / (tickCount - 1)

    return Array.from({ length: tickCount }, (_, i) => {
      const tickTime = new Date(minX.getTime() + i * tickInterval)
      const xPosition = (i / (tickCount - 1)) * (width - 60) + 20 // Adjust for left padding
      return { date: tickTime, x: xPosition }
    })
  }, [data, range.x, width, tickCount])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (xAxisTicks.length === 0) {
    return null
  }

  return (
    <View style={[styles.xAxis, { width, height }]}>
      <View style={styles.xAxisLine} />
      {xAxisTicks.map((tick, index) => (
        <View key={index} style={[styles.tick, { left: tick.x }]}>
          <Text style={styles.tickLabel}>{formatDate(tick.date)}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  xAxis: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
  },
  xAxisLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tick: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  tickLabel: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    marginBottom: 5,
  },
})

export default XAxisComponent