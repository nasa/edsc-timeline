import { MS_PER_HOUR } from '../constants'

// Detirmines an interval width given a duration and zoomLevel
export const determineScaledSize = (intervalDurationInMs, zoomLevel) => {
  let intervalWidth = 1

  // console.log('pxPerMs', pxPerMs)

  if (zoomLevel === 1) {
    intervalWidth = intervalDurationInMs / 10000
  } else if (zoomLevel === 2) {
    intervalWidth = intervalDurationInMs / (MS_PER_HOUR / 4)
  } else if (zoomLevel === 3) {
    intervalWidth = intervalDurationInMs / 10000000
  } else if (zoomLevel === 4) {
    intervalWidth = intervalDurationInMs / 1000000
  } else if (zoomLevel === 5) {
    intervalWidth = intervalDurationInMs / 100000
  } else if (zoomLevel === 6) {
    intervalWidth = intervalDurationInMs / 10000
  }

  return intervalWidth
}
