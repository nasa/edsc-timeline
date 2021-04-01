import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useGesture } from 'react-use-gesture'

import { TimelineList } from './components/TimelineList/TimelineList'
import { TimelinePrimarySection } from './components/TimelinePrimarySection/TimelinePrimarySection'
import { TimelineTools } from './components/TimelineTools/TimelineTools'

import { calculateTimeIntervals } from './utils/calculateTimeIntervals'
import { determineScaledWidth } from './utils/determineScaledWidth'
import { generateEndTime } from './utils/generateEndTime'
import { getCenterTimestamp } from './utils/getCenterTimestamp'
import { getIntervalBounds } from './utils/getIntervalBounds'
import { getIntervalsDuration } from './utils/getIntervalsDuration'
import { getPositionByTimestamp } from './utils/getPositionByTimestamp'
import { getTimestampByPosition } from './utils/getTimestampByPosition'
import { roundTime } from './utils/roundTime'

import {
  INTERVAL_BUFFER,
  MAX_DATA_ROWS,
  MAX_INTERVAL_BUFFER,
  TEMPORAL_SELECTION_HEIGHT
} from './constants'

import './index.scss'

/**
 * Renders the EDSC Timeline
 * @param {Object} param0
 * @param {Integer} param0.center Center timestamp of the timeline
 * @param {Object} param0.focusedInterval Focused date range to display on the timeline
 * @param {Integer} param0.minZoom Min zoom allowed
 * @param {Integer} param0.maxZoom Max zoom allowed
 * @param {Object} param0.temporalRange Temporal range to display on the timeline
 * @param {Integer} param0.zoom Current zoom level of the timeline
 * @param {Function} param0.onFocusedSet Callback that returns focused interval values
 * @param {Function} param0.onTimelineMove Callback that returns timeline center and interval values
 * @param {Function} param0.onTemporalSet Callback that returns temporal start and end values
 */
export const EDSCTimeline = ({
  center,
  data,
  focusedInterval: propsFocusedInterval,
  minZoom,
  maxZoom,
  temporalRange: propsTemporalRange,
  zoom,
  onFocusedSet,
  onTimelineMove,
  onTemporalSet
}) => {
  // Ref for the timeline to access the list DOM element
  const timelineListRef = useRef(null)

  // Ref for the timeline to access the wrapper DOM element
  const timelineWrapperRef = useRef(null)

  // Ref for the timeline to access the wrapper DOM element
  const timelineToolsRef = useRef(null)

  // Store the zoom level and allow for changing props to modify the state
  const [zoomLevel, setZoomLevel] = useState(zoom)

  // Store the pixel width of the list of intervals
  const [intervalListWidthInPixels, setIntervalListWidthInPixels] = useState(null)

  // Store the pixel value of the center of the list of intervals
  const [intervalsCenterInPixels, setIntervalsCenterInPixels] = useState(null)

  // Flag for the initial loading state of the timeline
  const [isLoaded, setIsLoaded] = useState(false)

  // Flag for if the timeline is currently in a dragging state
  const [draggingTimeline, setDraggingTimeline] = useState(false)
  const [draggingTemporal, setDraggingTemporal] = useState(false)
  const [draggingTemporalMarker, setDraggingTemporalMarker] = useState(null)

  // The current position of the timeline
  const [timelinePosition, setTimelinePosition] = useState({ top: 0, left: 0 })

  // The current position of the mouse when mouseover is triggered on the temporal selection area
  const [temporalRangeMouseOverPosition, setTemporalRangeMouseOverPosition] = useState(null)

  // The temporal range (markers) displayed on the timeline
  const [temporalRange, setTemporalRange] = useState(propsTemporalRange)

  // The focused interval
  const [focusedInterval, setFocusedInterval] = useState(propsFocusedInterval)

  // The visible start and end time for the current timeline position
  const [visibleTemporalRange, setVisibleTemporalRange] = useState({
    start: null,
    end: null
  })

  // Store calculated time intervals that power the display of the timeline dates
  const [timeIntervals, setTimeIntervals] = useState(() => [
    ...calculateTimeIntervals({
      timeAnchor: center,
      zoomLevel,
      numIntervals: INTERVAL_BUFFER,
      reverse: true
    }),
    roundTime(center, zoomLevel),
    ...calculateTimeIntervals({
      timeAnchor: center,
      zoomLevel,
      numIntervals: INTERVAL_BUFFER,
      reverse: false
    })
  ])

  useEffect(() => {
    // Anytime new time intervals are calcualted update the pixel width of their container
    const duration = getIntervalsDuration(timeIntervals, zoomLevel)

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const width = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)

    setIntervalListWidthInPixels(width)
  }, [])

  const updateTimeIntervals = (newIntervals) => {
    setTimeIntervals(newIntervals)
    const duration = getIntervalsDuration(newIntervals, zoomLevel)

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const width = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)

    setIntervalListWidthInPixels(width)
  }

  /**
   * Scroll the timeline backward (up, or to the left)
   */
  const scrollBackward = () => {
    let translationAdjustment = 0

    // If the underlying dataset has grown larger than desired, trim off 1 buffers
    // worth of data from opposite of the array
    let currentTimeIntervals = timeIntervals

    if (timeIntervals.length > MAX_INTERVAL_BUFFER) {
      currentTimeIntervals = currentTimeIntervals.slice(
        0, (currentTimeIntervals.length - INTERVAL_BUFFER)
      )
    }

    const nextIntervals = calculateTimeIntervals({
      timeAnchor: timeIntervals[0],
      zoomLevel,
      numIntervals: INTERVAL_BUFFER,
      reverse: true
    })

    const allIntervals = [
      ...nextIntervals,
      ...currentTimeIntervals
    ]

    updateTimeIntervals(allIntervals)

    const startTime = nextIntervals[0]
    const endTime = generateEndTime(nextIntervals, zoomLevel)

    const duration = endTime - startTime

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    translationAdjustment = -determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)

    return {
      left: translationAdjustment
    }
  }

  /**
   * Scroll the timeline forward (down, or to the right)
   */
  const scrollForward = () => {
    // let shouldMove = true
    let translationAdjustment = 0

    // If the underlying dataset has grown larger than desired, trim off 1 buffers
    // worth of data from opposite of the array
    let currentTimeIntervals = timeIntervals
    if (timeIntervals.length > MAX_INTERVAL_BUFFER) {
      // shouldMove = false
      const startTime = currentTimeIntervals[0]
      const endTime = generateEndTime(
        currentTimeIntervals,
        zoomLevel,
        currentTimeIntervals[INTERVAL_BUFFER - 1]
      )

      const duration = endTime - startTime

      currentTimeIntervals = currentTimeIntervals.slice(
        INTERVAL_BUFFER, currentTimeIntervals.length
      )

      const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

      translationAdjustment = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)
    }

    updateTimeIntervals([
      ...currentTimeIntervals,
      ...calculateTimeIntervals({
        timeAnchor: timeIntervals[timeIntervals.length - 1],
        zoomLevel,
        numIntervals: INTERVAL_BUFFER,
        reverse: false
      })
    ])

    return {
      left: translationAdjustment
    }
  }

  const clearTemporalRange = () => {
    setTemporalRange({})

    if (onTemporalSet) onTemporalSet({})
  }

  const handleMoveTimeline = (newTimelinePosition) => {
    if (onTimelineMove) {
      const centeredDate = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition: newTimelinePosition || timelinePosition,
        timelineWrapperRef,
        zoomLevel
      })

      onTimelineMove({ center: centeredDate, interval: zoomLevel })
    }
  }

  /**
   * Handles panning the timeline side to side
   * @param {Object} state useGesture state
   */
  const handlePanTimeline = (state) => {
    const {
      active,
      delta: [deltaX],
      direction: [directionX],
      offset: [offsetX]
    } = state

    let positionOffset = {
      top: 0,
      left: 0
    }

    const newTimelinePosition = {}
    newTimelinePosition.left = timelinePosition.left + deltaX

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    const timelineListWidth = timelineListRef.current.getBoundingClientRect().width

    const scrollDirection = directionX !== 1 ? 'forward' : 'backward'

    const loadMoreWindow = timelineWrapperWidth / 3

    const originalDistanceFromLeftEdge = -newTimelinePosition.left + offsetX
    const distanceFromLeftEdge = -newTimelinePosition.left

    const originalDistanceFromRightEdge = timelineListWidth
      - (-newTimelinePosition.left + offsetX + timelineWrapperWidth)
    const distanceFromRightEdge = timelineListWidth
      - (-newTimelinePosition.left + timelineWrapperWidth)

    if (scrollDirection === 'backward') {
      // If the previous scroll position is outside of the window to trigger another page and
      // the scroll position attached to the event is within the window
      if (
        originalDistanceFromLeftEdge > loadMoreWindow
        && distanceFromLeftEdge <= loadMoreWindow
      ) {
        positionOffset = {
          ...positionOffset,
          ...scrollBackward()
        }
      }
    }

    if (scrollDirection === 'forward') {
      // If the previous scroll position is outside of the window to trigger another page and
      // the scroll position attached to the event is within the window
      if (
        originalDistanceFromRightEdge > loadMoreWindow
        && distanceFromRightEdge <= loadMoreWindow
      ) {
        positionOffset = {
          ...positionOffset,
          ...scrollForward()
        }
      }
    }

    setTimelinePosition({
      top: 0,
      left: newTimelinePosition.left + positionOffset.left
    })

    handleMoveTimeline({ left: newTimelinePosition.left + positionOffset.left })

    setDraggingTimeline(active)
  }

  /**
   * Handles setting a new temporal range on the timeline
   * @param {Object} state useGesture state
   */
  const handleSetTemporal = (state) => {
    const {
      active,
      initial: [initialMouseX],
      movement: [movementX]
    } = state
    const amountDragged = movementX

    const { x: listX } = timelineListRef.current.getBoundingClientRect()
    const startPosition = initialMouseX - listX

    const endPosition = startPosition + amountDragged

    const start = getTimestampByPosition({
      intervalListWidthInPixels,
      position: startPosition,
      timeIntervals,
      zoomLevel
    })

    const end = getTimestampByPosition({
      intervalListWidthInPixels,
      position: endPosition,
      timeIntervals,
      zoomLevel
    })

    let range = { end, start }

    if (start > end) {
      range = {
        start: end,
        end: start
      }
    }

    setTemporalRange(range)

    setDraggingTemporal(active)

    if (!active) {
      if (onTemporalSet) onTemporalSet(range)
    }
  }

  /**
   * Handles scroll wheel behavior
   * @param {Object} state useGesture state
   */
  const handleWheel = (state) => {
    const { axis } = state
    if (axis === 'y') {
      // TODO: EDSC-3101: Implement zoom behavior here
    } else {
      handlePanTimeline(state)
    }
  }

  const [hasReversedTemporalMarkers, setHasReversedTemporalMarkers] = useState(false)

  /**
   * Handles editing a single temporal marker
   * @param {Object} state useGesture state
   */
  const handleEditTemporal = (state, markerType) => {
    const {
      active,
      initial: [initialMouseX],
      movement: [movementX]
    } = state
    const amountDragged = movementX

    const { x: listX } = timelineListRef.current.getBoundingClientRect()
    const startPosition = initialMouseX - listX

    const newPosition = startPosition + amountDragged

    const newTemporalMarkerPosition = getTimestampByPosition({
      intervalListWidthInPixels,
      position: newPosition,
      timeIntervals,
      zoomLevel
    })

    let newMarkerType = markerType

    if (hasReversedTemporalMarkers) {
      if (markerType === 'end') {
        newMarkerType = 'start'
      } else {
        newMarkerType = 'end'
      }
    }

    setDraggingTemporalMarker(newMarkerType)

    let range = {
      ...temporalRange,
      [newMarkerType]: newTemporalMarkerPosition
    }

    const { start, end } = range

    if (start > end) {
      setHasReversedTemporalMarkers(!hasReversedTemporalMarkers)
      range = {
        start: end,
        end: start
      }
    }

    setTemporalRange(range)

    if (!active) {
      setHasReversedTemporalMarkers(false)
      setDraggingTemporalMarker(null)
      if (onTemporalSet) onTemporalSet(range)
    }
  }

  /**
   * Handles the different dragging that can happen on the timeline
   * @param {Object} state useGesture state
   */
  const handlePan = (state) => {
    const {
      event,
      initial: [, mouseY]
    } = state

    const { target } = event
    const { dataset = {} } = target
    const { markerType = '' } = dataset

    const { top } = timelineWrapperRef.current.getBoundingClientRect()

    const clickHeight = mouseY - top

    if (markerType) {
      handleEditTemporal(state, markerType)
    } else if (clickHeight <= TEMPORAL_SELECTION_HEIGHT) {
      handleSetTemporal(state)
    } else {
      handlePanTimeline(state)
    }
  }

  /**
   * Handles clicking on the timeline
   * @param {Object} state useGesture state
   */
  const handleTap = (state) => {
    const {
      xy: [, mouseY]
    } = state

    const { top } = timelineWrapperRef.current.getBoundingClientRect()

    const clickHeight = mouseY - top

    if (clickHeight <= TEMPORAL_SELECTION_HEIGHT) {
      clearTemporalRange()
    }
  }

  /**
   * Handles the drag gesture of useGesture
   * @param {Object} state useGesture state
   */
  const handleDrag = (state) => {
    const { tap } = state
    if (tap) {
      handleTap(state)
    } else {
      handlePan(state)
    }
  }

  /**
   * Handles the move gesture of useGesture
   * @param {Object} state useGesture state
   */
  const handleMove = (state) => {
    const {
      xy: [mouseX, mouseY]
    } = state

    const {
      end,
      start
    } = temporalRange

    const { top } = timelineWrapperRef.current.getBoundingClientRect()

    const mouseOverHeight = mouseY - top

    // Sets the temporalRangeMouseOverPosition if at the correct height and no temporalRange exists
    if (mouseOverHeight <= TEMPORAL_SELECTION_HEIGHT && !start && !end) {
      const { x: listX } = timelineListRef.current.getBoundingClientRect()
      const startPosition = mouseX - listX

      setTemporalRangeMouseOverPosition(startPosition)
    } else {
      setTemporalRangeMouseOverPosition(null)
    }
  }

  /**
   * Handles the hover gesture of useGesture
   * @param {Object} state useGesture state
   */
  const handleHover = (state) => {
    const { hovering } = state

    // If no longer hovering over the timeline, remove the temporalRangeMouseOverPosition
    if (!hovering) setTemporalRangeMouseOverPosition(null)
  }

  /**
   * Sets up useGesture handlers
   */
  const bindTimelineGestures = useGesture({
    onDrag: handleDrag,
    onMove: handleMove,
    onHover: handleHover,
    onWheel: handleWheel
  }, {
    drag: {
      filterTaps: true
    }
  })

  // When the timeline position or focused interval changes, update the calculate and update
  // the visible temporal range
  useEffect(() => {
    const wrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    const toolsWidth = timelineToolsRef.current.getBoundingClientRect().width

    // Add the current tools container width to the timeline position to get the current start position
    const visibleStartPosition = -timelinePosition.left + toolsWidth
    const visibleStartTimestamp = getTimestampByPosition({
      intervalListWidthInPixels,
      position: visibleStartPosition,
      timeIntervals,
      zoomLevel
    })

    // Add the current wrapper width to the timeline position to get the current end position
    const visibleEndPosition = -timelinePosition.left + wrapperWidth
    const visibleEndTimestamp = getTimestampByPosition({
      intervalListWidthInPixels,
      position: visibleEndPosition,
      timeIntervals,
      zoomLevel
    })

    // Set the visible start range
    setVisibleTemporalRange({
      end: visibleEndTimestamp,
      start: visibleStartTimestamp
    })
  }, [timelinePosition, focusedInterval.start])

  /**
   * Move the timeline to the new center position
   * @param {Integer} center Timestamp to move the timeline to
   * @param {Array} intervals Optional - New timeIntervals to use
   * @param {Integer} zoom Optional - New zoomLevel to use
   */
  const moveTimeline = (center, intervals = timeIntervals, zoom = zoomLevel) => {
    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    const left = -(
      getPositionByTimestamp({
        timestamp: center,
        timeIntervals: intervals,
        zoomLevel: zoom,
        wrapperWidth: timelineWrapperWidth
      }) - (timelineWrapperWidth / 2)
    )

    setTimelinePosition({
      ...timelinePosition,
      left
    })

    if (onTimelineMove) onTimelineMove({ center, interval: zoom })
  }

  // If the propsTemporalRange changes, use those values as the temporalRange
  useEffect(() => {
    setTemporalRange(propsTemporalRange)
  }, [propsTemporalRange])

  useLayoutEffect(() => {
    const newWidth = intervalListWidthInPixels / 2
    if (timelineWrapperRef.current && intervalsCenterInPixels !== newWidth) {
      // When the timeline wrapper DOM element is available determine
      // the center value of the element in pixels
      setIntervalsCenterInPixels(intervalListWidthInPixels / 2)
    }
  }, [intervalListWidthInPixels, timelineWrapperRef])

  useEffect(() => {
    if (timelineWrapperRef.current && !isLoaded && intervalsCenterInPixels) {
      // Center the timeline on load
      const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
      const left = -(
        getPositionByTimestamp({
          timestamp: center,
          timeIntervals,
          zoomLevel,
          wrapperWidth: timelineWrapperWidth
        }) - (timelineWrapperWidth / 2)
      )

      setTimelinePosition({
        ...timelinePosition,
        left
      })

      const centeredDate = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition: {
          left
        },
        timelineWrapperRef,
        zoomLevel
      })

      onTimelineMove({ center: centeredDate, interval: zoomLevel })

      setIsLoaded(true)
    }
  }, [intervalsCenterInPixels, center])

  // Update the internal state when/if the prop changes
  useEffect(() => {
    setZoomLevel(zoom)
  }, [zoom])

  /**
   * Sets or unsets the focusedInterval as the interval where the user clicked
   */
  const onFocusedClick = (newFocusedInterval) => {
    const {
      end: newEnd,
      start: newStart
    } = newFocusedInterval

    const {
      end,
      start
    } = focusedInterval

    // If the selected interval is already focused, remove the focus
    if (start === newStart && end === newEnd) {
      if (onFocusedSet) onFocusedSet({})
      setFocusedInterval({})

      return
    }

    // Set the selected interval as focused
    if (onFocusedSet) onFocusedSet(newFocusedInterval)
    setFocusedInterval(newFocusedInterval)
  }

  /**
   * Moves the focusedInterval to the next or previous interval in timeIntervals
   * @param {String} direction 'next' or 'previous' interval to change the focusedInterval to
   */
  const onChangeFocusedInterval = (direction) => {
    // Change the focused interval
    let delta = 1
    if (direction === 'previous') delta = -1

    const {
      end: currentEnd,
      start: currentStart
    } = focusedInterval

    // Focused intervals shouldn't be outside of the temporalRange, don't allow scrolling past the interval that contains the temporal markers
    const {
      end: temporalEnd,
      start: temporalStart
    } = temporalRange
    if (temporalStart && temporalEnd) {
      if (direction === 'previous' && temporalStart >= currentStart) return
      if (direction === 'next' && temporalEnd <= currentEnd) return
    }

    // `end` is within the intervals of timeIntervals, use it with getIntervalBounds to find the bounds that include it
    const newFocused = getIntervalBounds(timeIntervals, currentEnd, delta)

    // Update the focusedInterval state and call onFocusedSet
    if (onFocusedSet) onFocusedSet(newFocused)
    setFocusedInterval(newFocused)

    const {
      end: newEnd,
      start: newStart
    } = newFocused

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    const newStartPosition = getPositionByTimestamp({
      timestamp: newStart,
      timeIntervals,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    })
    const newEndPosition = getPositionByTimestamp({
      timestamp: newEnd,
      timeIntervals,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    })

    // Find the width of the new focusedInterval so the scroll methods can keep the focusedInterval in the same position
    let offsetInPx = newEndPosition - newStartPosition

    let offsetPosition = {
      top: 0,
      left: 0
    }
    const startIndex = timeIntervals.findIndex((interval) => interval >= newStart) - 1

    if (direction === 'previous' && startIndex < INTERVAL_BUFFER) {
      offsetPosition = {
        ...offsetPosition,
        ...scrollBackward()
      }
    } else if (direction === 'next' && startIndex > timeIntervals.length - (INTERVAL_BUFFER)) {
      offsetPosition = {
        ...offsetPosition,
        ...scrollForward()
      }
    }

    if (direction === 'next') {
      offsetInPx = -offsetInPx
    }

    const newTimelinePosition = timelinePosition.left + offsetPosition.left + offsetInPx
    setTimelinePosition({
      ...timelinePosition,
      left: newTimelinePosition
    })

    handleMoveTimeline({ left: newTimelinePosition })
  }

  /**
   * Key down event handler to handle arrow keys for the focusedInterval
   */
  const onWindowKeydown = (e) => {
    const { start } = focusedInterval
    if (!start) return

    const { key } = e

    if (key === 'ArrowLeft') onChangeFocusedInterval('previous')
    if (key === 'ArrowRight') onChangeFocusedInterval('next')
  }

  useEffect(() => {
    window.addEventListener('keydown', onWindowKeydown)

    return () => {
      window.removeEventListener('keydown', onWindowKeydown)
    }
  }, [
    focusedInterval,
    timeIntervals,
    timelinePosition,
    temporalRange,
    temporalRangeMouseOverPosition
  ])

  /**
   * Callback to change the current zoom level and recalculate timeIntervals
   * @param {Integer} newZoomLevel New desired zoom level
   */
  const onChangeZoomLevel = (newZoomLevel) => {
    if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
      // Get the current (zoomLevel) centeredDate to use as the new center with the newZoomLevel
      const centeredDate = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition,
        timelineWrapperRef,
        zoomLevel
      })

      const newIntervals = [
        ...calculateTimeIntervals({
          timeAnchor: centeredDate,
          zoomLevel: newZoomLevel,
          numIntervals: INTERVAL_BUFFER,
          reverse: true
        }),
        roundTime(centeredDate, newZoomLevel),
        ...calculateTimeIntervals({
          timeAnchor: centeredDate,
          zoomLevel: newZoomLevel,
          numIntervals: INTERVAL_BUFFER,
          reverse: false
        })
      ]

      setTimeIntervals(newIntervals)
      setZoomLevel(newZoomLevel)
      setFocusedInterval({})
      if (onFocusedSet) onFocusedSet({})

      moveTimeline(centeredDate, newIntervals, newZoomLevel)
    }
  }

  // Trim the data to MAX_DATA_ROWS if needed
  let trimmedData = data

  if (data.length >= MAX_DATA_ROWS) {
    trimmedData = data.slice(0, MAX_DATA_ROWS)
  }

  return (
    <div
      className="timeline"
      ref={timelineWrapperRef}
    >
      <TimelineTools
        ref={timelineToolsRef}
        focusedInterval={focusedInterval}
        minZoom={minZoom}
        maxZoom={maxZoom}
        temporalRange={temporalRange}
        zoomLevel={zoomLevel}
        onChangeFocusedInterval={onChangeFocusedInterval}
        onChangeZoomLevel={onChangeZoomLevel}
      />
      <TimelinePrimarySection
        data={trimmedData}
        visibleTemporalRange={visibleTemporalRange}
      />
      <div className="timeline__outer-wrapper">
        <div
          className="timeline__wrapper"
        >
          {
            timeIntervals.length > 0 && (
              <TimelineList
                ref={timelineListRef}
                bindTimelineGestures={bindTimelineGestures}
                data={trimmedData}
                draggingTimeline={draggingTimeline}
                draggingTemporal={draggingTemporal}
                draggingTemporalMarker={draggingTemporalMarker}
                focusedInterval={focusedInterval}
                intervalListWidthInPixels={intervalListWidthInPixels}
                temporalRange={temporalRange}
                temporalRangeMouseOverPosition={temporalRangeMouseOverPosition}
                timeIntervals={timeIntervals}
                timelinePosition={timelinePosition}
                timelineWrapperRef={timelineWrapperRef}
                zoomLevel={zoomLevel}
                onFocusedClick={onFocusedClick}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

EDSCTimeline.defaultProps = {
  center: new Date().getTime(),
  focusedInterval: {},
  maxDate: new Date().getTime(),
  minDate: 0,
  onFocusedSet: null,
  onTemporalSet: null,
  onTimelineMove: null,
  minZoom: 1,
  maxZoom: 5,
  temporalRange: {},
  zoom: 3
}

EDSCTimeline.propTypes = {
  center: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      color: PropTypes.string,
      intervals: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.number
        ) // [start, end, number of items in interval]
      ).isRequired
    })
  ).isRequired,
  focusedInterval: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }),
  maxDate: PropTypes.number, // maximum date timeline will allow scrolling
  minDate: PropTypes.number, // minimum date timeline will allow scrolling
  onFocusedSet: PropTypes.func,
  onTemporalSet: PropTypes.func,
  onTimelineMove: PropTypes.func,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  temporalRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }),
  zoom: PropTypes.number
}

export default EDSCTimeline
