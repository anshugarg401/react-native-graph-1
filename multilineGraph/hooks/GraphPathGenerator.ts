import { SkPath } from '@shopify/react-native-skia'
import { useMemo } from 'react'
import { Gesture, PanGesture } from 'react-native-gesture-handler'
import { GraphPoint } from 'react-native-graph'
import { GraphPathRange } from 'react-native-graph/lib/typescript/CreateGraphPath'
import { createGraphPath, getGraphPathRange, getPointsInRange } from 'react-native-graph/src/CreateGraphPath'
import { GraphRange } from 'react-native-graph/src/LineGraphProps'
import Reanimated, { useSharedValue } from 'react-native-reanimated'

const CHART_HPADDING = 10; // Define the horizontal padding
const CHART_VPADDING = 10; // Define the vertical padding
const CHART_HEIGHT = 200;  // Define the canvas height
const CHART_WIDTH = 300;   // Define the canvas width

interface Config {
  enableRange: boolean
  Points: GraphPoint[]

}

export interface Result {
Path?:SkPath
range?:GraphPathRange
pathRange?:GraphPathRange
pointsInRange?:GraphPoint[]
}

export function useGraphPath({enableRange, Points}:Config): Result {
    const highestDate = useMemo(
        () =>
            Points.length !== 0 && Points[Points.length - 1] != null
            ? Points[Points.length - 1]!.date
            : undefined,
        [Points]
      )
      const range: GraphRange | undefined = useMemo(() => {
        // if range is disabled, default to infinite range (undefined)
        if (!enableRange) return undefined
    
      if (Points.length !== 0 && highestDate != null) {
        // console.log(getGraphPathRange(selectedPoint, range))
        return {
          x: {
            // min: Math.min(...Points.map(item => item.date.getTime())), 
            // max: Math.max(...Points.map(item => item.date.getTime())), 
            min: Points[0]!.date,
            max: new Date(highestDate.getTime() ), //+ 10 * 1000 * 60 * 60 * 24
          },
          y: {
            min: Math.min(...Points.map(item => item.value)), 
            max: Math.max(...Points.map(item => item.value)), 
          },
        }
      } else {
        return {
          y: {
            min: Math.min(...Points.map(item => item.value)), 
            max: Math.max(...Points.map(item => item.value)), 
          },
        }
      }
    }, [enableRange, highestDate,Points])

    const pathRange: GraphPathRange = useMemo(
        () => getGraphPathRange(Points, range),
        [Points, range]
      )
      const pointsInRange = useMemo(
        () => getPointsInRange(Points, pathRange),
        [Points, range]
      )
      const createGraphPathProps = {
        pointsInRange,
        range: pathRange,
        horizontalPadding:CHART_HPADDING,
        verticalPadding:CHART_VPADDING,
        canvasHeight: CHART_HEIGHT,
        canvasWidth: CHART_WIDTH,
      }
      const pathG =  createGraphPath(createGraphPathProps)
  return useMemo(
    () => ({
      Path: pathG,
      range: pathRange,
      pathRange: pathRange,
      pointsInRange: pointsInRange,
    }),
    [pathG]
  )
}