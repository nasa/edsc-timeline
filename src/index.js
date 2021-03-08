import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { TimelineList } from './components/TimelineList/TimelineList'
import { TimelineTools } from './components/TimelineTools/TimelineTools'

import { calculateTimeIntervals } from './utils/calculateTimeIntervals'
import { determineScaledWidth } from './utils/determineScaledWidth'
import { generateEndTime } from './utils/generateEndTime'
import { getCenterTimestamp } from './utils/getCenterTimestamp'
import { getIntervalsDuration } from './utils/getIntervalsDuration'
import { getPositionByTimestamp } from './utils/getPositionByTimestamp'
import { getTimestampByPosition } from './utils/getTimestampByPosition'
import { roundTime } from './utils/roundTime'

import {
  INTERVAL_BUFFER,
  MAX_INTERVAL_BUFFER,
  TEMPORAL_SELECTION_HEIGHT
} from './constants'

import './index.scss'

/**
 * Renders the EDSC Timeline
 * @param {Object} param0
 * @param {Integer} param0.center Center timestamp of the timeline
 * @param {Integer} param0.minZoom Min zoom allowed
 * @param {Integer} param0.maxZoom Max zoom allowed
 * @param {Object} param0.temporalRange Temporal range to display on the timeline
 * @param {Integer} param0.zoom Current zoom level of the timeline
 * @param {Function} param0.onTimelineMove Callback that returns timeline center and interval values
 * @param {Function} param0.onTemporalSet Callback that returns temporal start and end values
 */
export const EDSCTimeline = ({
  center,
  minZoom,
  maxZoom,
  temporalRange: propsTemporalRange,
  zoom,
  onTimelineMove,
  onTemporalSet
}) => {
  // Ref for the timeline to access the list DOM element
  const timelineListRef = useRef(null)

  // Ref for the timeline to access the wrapper DOM element
  const timelineWrapperRef = useRef(null)

  // Store the zoom level and allow for changing props to modify the state
  const [zoomLevel, setZoomLevel] = useState(zoom)

  // Store the pixel width of the list of intervals
  const [intervalListWidthInPixels, setIntervalListWidthInPixels] = useState(null)

  // Store the pixel value of the center of the list of intervals
  const [intervalsCenterInPixels, setIntervalsCenterInPixels] = useState(null)

  // Flag for the initial loading state of the timeline
  const [isLoaded, setIsLoaded] = useState(false)

  // Flag for if the timeline is currently in a dragging state
  const [dragging, setDragging] = useState(false)
  const [draggingTemporal, setDraggingTemporal] = useState(false)
  const [draggingTemporalStart, setDraggingTemporalStart] = useState(false)
  const [draggingTemporalEnd, setDraggingTemporalEnd] = useState(false)

  // Track the position of the timeline at the start of a drag event
  const [timelineStartPosition, setTimelineStartPosition] = useState(null)

  // The position of the cursor at the start of a drag event
  const [timelineDragStartPosition, setTimelineDragStartPosition] = useState(null)

  // The current position of the timeline
  const [timelinePosition, setTimelinePosition] = useState({ top: 0, left: 0 })

  // The position of the beginning of the temporal drag within the timeline list
  const [temporalStartPosition, setTemporalStartPosition] = useState(null)

  // The current position of the mouse when mouseover is triggered on the temporal selection area
  const [temporalRangeMouseOverPosition, setTemporalRangeMouseOverPosition] = useState(null)

  // The temporal range (markers) displayed on the timeline
  const [temporalRange, setTemporalRange] = useState(propsTemporalRange)

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

  /**
   * DEBUG USEEFFECTS
   */

  // useEffect(() => {
  //   console.log('[DEBUG]: TIME_INTERVALS.LENGTH', timeIntervals.length)
  // }, [timeIntervals])

  // useEffect(() => {
  //   console.log('[DEBUG]: SCROLL_DIRECTION ', scrollDirection)
  // }, [scrollDirection])

  // useEffect(() => {
  //   console.log('[DEBUG]: SCROLL_POSITION ', scrollPosition)
  // }, [scrollPosition])

  /**
   * END DEBUG USEEFFECTS
   */

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

  const handleMove = () => {
    if (onTimelineMove) {
      const centeredDate = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition,
        timelineWrapperRef,
        zoomLevel
      })

      onTimelineMove({ center: centeredDate, interval: zoomLevel })
    }
  }

  useLayoutEffect(() => {
    // Anytime new time intervals are calcualted update the pixel width of their container
    const duration = getIntervalsDuration(timeIntervals, zoomLevel)

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const width = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)

    setIntervalListWidthInPixels(width)
  }, [timeIntervals])

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
   * Set the start position for timeline dragging
   */
  const onTimelineDragStart = (e) => {
    const { pageX: mouseX } = e
    setDragging(true)
    setTimelineStartPosition(timelinePosition)
    setTimelineDragStartPosition(mouseX)
  }

  /**
   * Set the start position for temporal dragging
   */
  const onTemporalDragStart = (e) => {
    const { pageX: mouseX } = e

    setTimelineStartPosition(timelinePosition)
    setTimelineDragStartPosition(mouseX)
    setTemporalRangeMouseOverPosition(null)

    const { x: listX } = timelineListRef.current.getBoundingClientRect()
    const startPosition = mouseX - listX
    setTemporalStartPosition(startPosition)
  }

  /**
   * Sort the start and end of the temporal range.
   * Report the temporal range with onTemporalSet or clear the values
   */
  const onTimelineTemporalDragEnd = (e) => {
    const { pageX: mouseX } = e
    const amountDragged = mouseX - timelineDragStartPosition

    const { end, start } = temporalRange

    // Only report the temporal values if start and end exist, and are different
    if (start && end && start !== end && amountDragged !== 0) {
      // Reverse start and end if needed
      const { start } = temporalRange
      let range = {
        end,
        start
      }

      if (start > end) {
        range = {
          start: end,
          end: start
        }
      }

      if (onTemporalSet) onTemporalSet(range)
      setTemporalRange(range)
      return
    }

    // If start and end are equal or no dragging has happened, clear the temporal values
    if (onTemporalSet) onTemporalSet({})
    setTemporalRange({})
  }

  /**
   * Scroll the timeline backward (up, or to the left)
   */
  const scrollBackward = () => {
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

    setTimeIntervals(allIntervals)

    const startTime = nextIntervals[0]
    const endTime = generateEndTime(nextIntervals, zoomLevel)

    const duration = endTime - startTime

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const intervalsWidth = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)

    if (timelineWrapperRef.current) {
      // Appending data to the beginning of the underlying dataset requires us to scroll the user
      // to back to the right, outside of the window that triggers another page to be loaded
      // timelineListRef.current.style.transform = `translateX(${timelineStartPosition.left - intervalsWidth}px)`
      setTimelineStartPosition({
        ...timelineStartPosition,
        left: timelineStartPosition.left - intervalsWidth
      })
    }
  }

  /**
   * Scroll the timeline forward (down, or to the right)
   */
  const scrollForward = () => {
    let translationAdjustment = 0

    // If the underlying dataset has grown larger than desired, trim off 1 buffers
    // worth of data from opposite of the array
    let currentTimeIntervals = timeIntervals
    if (timeIntervals.length > MAX_INTERVAL_BUFFER) {
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

      setTimelineStartPosition({
        ...timelineStartPosition,
        left: timelineStartPosition.left + translationAdjustment
      })
    }

    setTimeIntervals([
      ...currentTimeIntervals,
      ...calculateTimeIntervals({
        timeAnchor: timeIntervals[timeIntervals.length - 1],
        zoomLevel,
        numIntervals: INTERVAL_BUFFER,
        reverse: false
      })
    ])
  }

  /**
   * Calculate the start and end temporal of the current temporal drag
   */
  const onTimelineTemporalDrag = (e) => {
    requestAnimationFrame(() => {
      const { pageX: mouseX } = e
      const amountDragged = mouseX - timelineDragStartPosition
      const endPosition = temporalStartPosition + amountDragged

      const start = getTimestampByPosition({
        intervalListWidthInPixels,
        position: temporalStartPosition,
        timeIntervals,
        zoomLevel
      })

      const end = getTimestampByPosition({
        intervalListWidthInPixels,
        position: endPosition,
        timeIntervals,
        zoomLevel
      })

      setTemporalRange({
        start,
        end
      })
    })
  }

  /**
   * Calculate the temporal start position during the marker drag
   */
  const onTemporalMarkerStartDrag = (e) => {
    requestAnimationFrame(() => {
      const { pageX: mouseX } = e
      const amountDragged = mouseX - timelineDragStartPosition
      const newPosition = temporalStartPosition + amountDragged

      const start = getTimestampByPosition({
        intervalListWidthInPixels,
        position: newPosition,
        timeIntervals,
        zoomLevel
      })

      setTemporalRange({
        ...temporalRange,
        start
      })
    })
  }

  /**
   * Calculate the temporal end position during the marker drag
   */
  const onTemporalMarkerEndDrag = (e) => {
    requestAnimationFrame(() => {
      const { pageX: mouseX } = e
      const amountDragged = mouseX - timelineDragStartPosition
      const newPosition = temporalStartPosition + amountDragged

      const end = getTimestampByPosition({
        intervalListWidthInPixels,
        position: newPosition,
        timeIntervals,
        zoomLevel
      })

      setTemporalRange({
        ...temporalRange,
        end
      })
    })
  }

  /**
   * Determine if the timeline was being dragged forward or backwards and scroll that direction if needed
   */
  const onTimelineDrag = (e) => {
    requestAnimationFrame(() => {
      if (dragging) {
        const { pageX: mouseX } = e
        const amountDragged = mouseX - timelineDragStartPosition
        const left = timelineStartPosition.left + amountDragged
        setTimelinePosition({
          ...timelinePosition,
          left
        })

        const wrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

        const scrollDirectionIsForward = timelineStartPosition.left - timelinePosition.left > 0

        let scrollDirection
        if (scrollDirectionIsForward && scrollDirection !== 'forward') {
          scrollDirection = 'forward'
        }

        if (!scrollDirectionIsForward && scrollDirection !== 'backward') {
          scrollDirection = 'backward'
        }

        const loadMoreWindow = wrapperWidth / 3

        if (scrollDirection === 'backward') {
          // If the previous scroll position is outside of the window to trigger another page and
          // the scroll position attached to the event is within the window
          const originalDistanceFromEdge = -timelineStartPosition.left
          const distanceFromEdge = -timelinePosition.left

          if (originalDistanceFromEdge > loadMoreWindow && distanceFromEdge <= loadMoreWindow) {
            scrollBackward()
          }
        }

        if (scrollDirection === 'forward') {
          const listWidth = timelineListRef.current.getBoundingClientRect().width

          // Determine the previous pixel position of the right edge of the timeline
          const originalDistanceFromEdge = -(
            wrapperWidth - (timelineStartPosition.left + listWidth)
          )
          const distanceFromEdge = -(wrapperWidth - (timelinePosition.left + listWidth))

          // If the previous scroll position is outside of the window to trigger another page and
          // the scroll position attached to the event is within the window
          if (originalDistanceFromEdge > loadMoreWindow && distanceFromEdge <= loadMoreWindow) {
            scrollForward()
          }
        }

        handleMove()
      }
    })
  }

  /**
   * Mouse move event handler for the TimelineList.
   */
  const onTimelineMouseMove = (e) => {
    const {
      end,
      start
    } = temporalRange

    const {
      pageY: mouseY,
      pageX: mouseX
    } = e

    const { top } = timelineWrapperRef.current.getBoundingClientRect()

    const mouseOverHeight = mouseY - top

    // If the user hovers on the top 20 pixels of the timeline, show the hover state
    if (mouseOverHeight <= TEMPORAL_SELECTION_HEIGHT && !start && !end) {
      const { x: listX } = timelineListRef.current.getBoundingClientRect()
      const startPosition = mouseX - listX

      setTemporalRangeMouseOverPosition(startPosition)
    } else {
      setTemporalRangeMouseOverPosition(null)
    }
  }

  /**
   * Mouse down event handler for the TimelineList. Depending on where the mouse down happened, different handlers are executed
   */
  const onTimelineMouseDown = (e) => {
    const { pageY: mouseY } = e
    const { top } = timelineWrapperRef.current.getBoundingClientRect()

    const clickHeight = mouseY - top

    // If the user clicks on the top TEMPORAL_SELECTION_HEIGHT pixels of the timeline, start a temporal drag
    // else start a timeline drag
    // TODO: EDSC-3028: Focused dates look for clicking on the bottom of the timeline
    if (clickHeight <= TEMPORAL_SELECTION_HEIGHT) {
      onTemporalDragStart(e)
      setDraggingTemporal(true)
    } else {
      onTimelineDragStart(e)
    }
  }

  /**
   * Mouse down event handler for the temporal markers in TimelineList
   */
  const onTemporalMarkerMouseDown = (e, type) => {
    if (type === 'start') {
      setDraggingTemporalStart(true)
    } else if (type === 'end') {
      setDraggingTemporalEnd(true)
    }
    onTemporalDragStart(e)

    e.stopPropagation()
  }

  /**
   * Mouse up event handler for the whole window. If any dragging was happening, call cleanup and/or additional handlers
   */
  const onWindowMouseUp = (e) => {
    if (draggingTemporal
      || draggingTemporalEnd
      || draggingTemporalStart
    ) onTimelineTemporalDragEnd(e)

    if (dragging
      || draggingTemporal
      || draggingTemporalEnd
      || draggingTemporalStart
    ) {
      setDragging(false)
      setDraggingTemporal(false)
      setDraggingTemporalEnd(false)
      setDraggingTemporalStart(false)
      setTimelineStartPosition(null)
      setTimelineDragStartPosition(null)
    }
  }

  const onWindowMouseMove = (e) => {
    if (dragging) onTimelineDrag(e)
    if (draggingTemporal) onTimelineTemporalDrag(e)
    if (draggingTemporalStart) onTemporalMarkerStartDrag(e)
    if (draggingTemporalEnd) onTemporalMarkerEndDrag(e)

    // If the mousemove happens outside of the timeline wrapper, clear the temporal selection mouseover indicator
    if (!timelineWrapperRef.current.contains(e.target)) {
      setTemporalRangeMouseOverPosition(null)
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', onWindowMouseUp)
    window.addEventListener('mousemove', onWindowMouseMove)

    return () => {
      window.removeEventListener('mouseup', onWindowMouseUp)
      window.removeEventListener('mousemove', onWindowMouseMove)
    }
  }, [
    dragging,
    timelinePosition,
    timelineDragStartPosition,
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

      const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
      const left = -(
        getPositionByTimestamp({
          timestamp: centeredDate,
          timeIntervals: newIntervals,
          zoomLevel: newZoomLevel,
          wrapperWidth: timelineWrapperWidth
        }) - (timelineWrapperWidth / 2)
      )

      setTimelinePosition({
        ...timelinePosition,
        left
      })

      onTimelineMove({ center: centeredDate, interval: newZoomLevel })
    }
  }

  return (
    <div className="timeline">
      <TimelineTools
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomLevel={zoomLevel}
        onChangeZoomLevel={onChangeZoomLevel}
      />
      <div className="timeline__outer-wrapper">
        <div
          ref={timelineWrapperRef}
          className="timeline__wrapper"
        >
          {
            timeIntervals.length > 0 && (
              <TimelineList
                intervalListWidthInPixels={intervalListWidthInPixels}
                temporalRange={temporalRange}
                temporalRangeMouseOverPosition={temporalRangeMouseOverPosition}
                timeIntervals={timeIntervals}
                timelineListRef={timelineListRef}
                timelinePosition={timelinePosition}
                timelineWrapperRef={timelineWrapperRef}
                zoomLevel={zoomLevel}
                dragging={dragging}
                draggingTemporalStart={draggingTemporalStart}
                draggingTemporalEnd={draggingTemporalEnd}
                onTimelineMouseDown={onTimelineMouseDown}
                onTimelineMouseMove={onTimelineMouseMove}
                onTemporalMarkerMouseDown={onTemporalMarkerMouseDown}
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
  maxDate: new Date().getTime(),
  minDate: 0,
  onFocusedTemporalSet: null,
  onTemporalSet: null,
  onTimelineMove: null,
  minZoom: 1,
  maxZoom: 5,
  temporalRange: {},
  zoom: 3
}

EDSCTimeline.propTypes = {
  center: PropTypes.number,
  maxDate: PropTypes.number, // maximum date timeline will allow scrolling
  minDate: PropTypes.number, // minimum date timeline will allow scrolling
  onFocusedTemporalSet: PropTypes.func,
  onTemporalSet: PropTypes.func,
  onTimelineMove: PropTypes.func,
  resolution: PropTypes.string, // resolution of timeline day/month/etc.
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // ?
      title: PropTypes.string,
      color: PropTypes.string,
      intervals: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.number
        ) // [start, end, number of items in interval]
      ).isRequired
    })
  ).isRequired,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  temporalRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }),
  zoom: PropTypes.number
}

export default EDSCTimeline
