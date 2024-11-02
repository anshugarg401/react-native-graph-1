import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SystemBars } from 'react-native-bars'
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { useFont } from '@shopify/react-native-skia'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'

import { generateRandomGraphData,generateSinusGraphData } from '../data/GraphData'
import { useColors } from '../hooks/useColor'
import { useGraphPath } from '@/hooks/GraphPathGenerator'
import XAxisComponent from '@/components/XaxisComponent'
import YAxisComponent from '@/components/YaxisComponent'
import { GraphPoint } from 'react-native-graph'
import { usePanGesture } from 'react-native-graph/src/hooks/usePanGesture'
import OverlappingGraphs from '@/components/OverlappingGraphs'
import SelectionDot from '@/components/SelectionDot'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
export const CHART_HEIGHT = 250
export const CHART_PADDING = 10
export const CHART_WIDTH = SCREEN_WIDTH - 40 
export const BACKGROUND_COLOR = '#8e7cc3'

export interface Graphs {
  G1: GraphPoint[]
  G2: GraphPoint[]
  G3: GraphPoint[]
}

export default function InteractiveGraph() {
  const colors = useColors()
  const font = useFont(require('../assets/fonts/Poppins-Bold.ttf'), 16)
  const LINE_COLORS = {
    PINK: '#FF69B1',
    CYAN: '#00FFFF',
    GREEN: '#00FF7F',
  }

  const [multiGraphs, setMultiGraphs] = useState<Graphs>({
    G1: generateRandomGraphData(20),
    G2: generateRandomGraphData(20),
    G3: generateRandomGraphData(20),
  })
  const pathG = useGraphPath({ enableRange: true, Points: multiGraphs.G1 })
  const pathG2 = useGraphPath({ enableRange: true, Points: multiGraphs.G2 })
  const pathG3 = useGraphPath({ enableRange: true, Points: multiGraphs.G3 })
  const { gesture, isActive, x,y } = usePanGesture({
    enabled: true,
    holdDuration: 300,
  })

  const graphConfigs = [
    {
      points: pathG.pointsInRange,
      color: LINE_COLORS.PINK,
      isActive,
      x,
      y,
      gesture,
      lineThickness: 5,
      SelectionDot: SelectionDot,
      range: pathG.range,
      enableIndicator: true,  
      horizontalPadding: 20,
      verticalPadding: 20,
    },
    {
      points: multiGraphs.G2,
      color: LINE_COLORS.CYAN,
      isActive,
      x,
      y,
      gesture,
      lineThickness: 5,
      SelectionDot: SelectionDot,
      range: pathG2.range,
      enableIndicator: true,  
      horizontalPadding:20,
      verticalPadding: 20,
    },
    {
      points: multiGraphs.G3,
      color: LINE_COLORS.GREEN,
      isActive,
      x,
      y,
      gesture,
      lineThickness: 5,
      SelectionDot: SelectionDot,
      range: pathG3.range,
      enableIndicator: true,  
      horizontalPadding: 20,
      verticalPadding: 20,
    },
  ]

  const refreshData = useCallback(() => {
    setMultiGraphs({
      G1: generateRandomGraphData(50),
      G2: generateRandomGraphData(50),
      G3: generateRandomGraphData(50),
    })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }, [])

  if (!font) {
    return null
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <SystemBars animated={true} barStyle="light-content" />
        <Text style={styles.title}>Unfold Shop 2018</Text>
        <Text style={styles.subtitle}>Monthly Sales</Text>
        <View style={styles.graphContainer}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={styles.graph}>
              <LinearGradient
                colors={['#8e7cc3', '#674ea7']}
                style={StyleSheet.absoluteFill}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 2 }}
              />
              <OverlappingGraphs graphs={graphConfigs} width={CHART_WIDTH} height={CHART_HEIGHT}/>
              <XAxisComponent data={multiGraphs.G1} range={pathG.pathRange} width={CHART_WIDTH} height={CHART_HEIGHT } />
              <YAxisComponent data={multiGraphs.G1} range={pathG.pathRange} width={CHART_WIDTH} height={CHART_HEIGHT } />
            </Animated.View>
          </GestureDetector>
        </View>
        <Button title="Refresh" onPress={refreshData} color={colors.primary} />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Roboto',
    marginTop: 20,
  },
  subtitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
    marginVertical: 10,
  },
  graphContainer: {
    height: CHART_HEIGHT + 2 * CHART_PADDING,
    width: CHART_WIDTH + 2 * CHART_PADDING,
    position: 'relative',
    marginVertical: 0,
  },
  graph: {
    height: CHART_HEIGHT,
    width: CHART_WIDTH,
    overflow: 'hidden',
  },
  graphMode: {
    width: CHART_WIDTH,
    height: 40,
    marginVertical: 20,
  },
})