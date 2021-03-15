import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'

import { TimelineList } from './components/TimelineList/TimelineList'
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
  FOCUSED_SELECTION_HEIGHT,
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

  // Ref for the timeline to access the tools DOM element
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

  // The focused interval
  const [focusedInterval, setFocusedInterval] = useState(propsFocusedInterval)

  // const [wrapperWidth, setWrapperWidth] = useState(0)
  const [toolsWidth, setToolsWidth] = useState(0)

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

  /**
   * Move the timeline to the new center position
   * @param {Integer} center Timestamp to move the timeline to
   * @param {Array} intervals Optional - New timeIntervals to use
   * @param {Integer} zoom Optional - New zoomLevel to use
   */
  const moveTimeline = (center, intervals = timeIntervals, zoom = zoomLevel) => {
    // console.log('🚀 ~ file: index.js ~ line 668 ~ moveTimeline ~ timelineWrapperRef.current.getBoundingClientRect()', timelineWrapperRef.current.getBoundingClientRect())
    // console.log('🚀 ~ file: index.js ~ line 668 ~ moveTimeline ~ timelineToolsRef.current.getBoundingClientRect()', timelineToolsRef.current.getBoundingClientRect())
    const timelineToolsWidth = timelineToolsRef.current.getBoundingClientRect().width
    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    const left = -(
      getPositionByTimestamp({
        timestamp: center,
        timeIntervals: intervals,
        timelineToolsWidth,
        zoomLevel: zoom,
        wrapperWidth: timelineWrapperWidth
      }) - (timelineWrapperWidth / 2)
    )

    setTimelinePosition({
      ...timelinePosition,
      left
    })
    // console.log('🚀 ~ file: index.js ~ line 166 ~ moveTimeline ~ left', left)
    // console.log('🚀 ~ file: index.js ~ line 166 ~ moveTimeline ~ center', center)
    // console.log('🚀 ~ file: index.js ~ line 173 ~ moveTimeline ~ zoom', zoom)
    if (onTimelineMove) onTimelineMove({ center, interval: zoom })
  }

  useEffect(() => {
    const timelineToolsWidth = timelineToolsRef.current.getBoundingClientRect().width
    const centeredDate = getCenterTimestamp({
      intervalListWidthInPixels,
      timeIntervals,
      timelinePosition,
      timelineToolsWidth,
      timelineWrapperRef,
      zoomLevel
    })
    console.log('🚀 ~ file: index.js ~ line 180 ~ useEffect ~ centeredDate', centeredDate)
    console.log('🚀 ~ file: index.js ~ line 179 ~ useEffect ~ centeredDate', new Date(centeredDate))

    if (centeredDate) moveTimeline(centeredDate)
  }, [intervalListWidthInPixels])

  useEffect(() => {
    // const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    const timelineToolsWidth = timelineToolsRef.current.getBoundingClientRect().width
    // const width = timelineWrapperWidth - timelineToolsWidth
    // console.log('🚀 ~ file: index.js ~ line 144 ~ useEffect ~ width', width)
    // setWrapperWidth(width)
    setToolsWidth(timelineToolsWidth)
  }, [focusedInterval])

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
      const timelineToolsWidth = timelineToolsRef.current.getBoundingClientRect().width
      const centeredDate = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition,
        timelineToolsWidth,
        timelineWrapperRef,
        zoomLevel
      })

      onTimelineMove({ center: centeredDate, interval: zoomLevel })
    }
  }

  useEffect(() => {
    // Anytime new time intervals are calcualted update the pixel width of their container
    const duration = getIntervalsDuration(timeIntervals, zoomLevel)

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const width = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)
    console.log('🚀 ~ file: index.js ~ line 230 ~ useEffect ~ width', width)

    setIntervalListWidthInPixels(width)
  }, [timeIntervals])

  useEffect(() => {
    if (timelineWrapperRef.current && !isLoaded && intervalsCenterInPixels) {
      // Center the timeline on load
      const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
      const timelineToolsWidth = timelineToolsRef.current.getBoundingClientRect().width

      const left = -(
        getPositionByTimestamp({
          timestamp: center,
          timeIntervals,
          timelineToolsWidth,
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
        timelineToolsWidth,
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

    if ((start && !end) || (!start && end)) {
      if (onTemporalSet) onTemporalSet(temporalRange)
      return
    }

    // Only report the temporal values if start and end exist, and are different
    if (start && end && start !== end && amountDragged !== 0) {
      // Reverse start and end if needed
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
  const scrollBackward = (offset = 0) => {
    console.log('🚀 ~ file: index.js ~ line 321 ~ scrollBackward ~ scrollBackward')
    // If the underlying dataset has grown larger than desired, trim off 1 buffers
    // worth of data from opposite of the array
    let currentTimeIntervals = timeIntervals
    if (timeIntervals.length > MAX_INTERVAL_BUFFER) {
      console.log('REMOVING INTERVALS')
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
      if (timelineStartPosition) {
        setTimelineStartPosition({
          ...timelineStartPosition,
          left: timelineStartPosition.left - intervalsWidth
        })
      }

      // TODO doesn't account for width of interval when using left arrow
      const leftPosition = -(intervalsWidth - timelinePosition.left)
      console.log('🚀 ~ file: index.js ~ line 397 ~ scrollBackward ~ timelinePosition', timelinePosition)
      console.log('🚀 ~ file: index.js ~ line 397 ~ scrollBackward ~ intervalsWidth', intervalsWidth)
      console.log('🚀 ~ file: index.js ~ line 394 ~ scrollBackward ~ leftPosition', leftPosition)
      console.log('🚀 ~ file: index.js ~ line 398 ~ scrollBackward ~ offset', offset)
      setTimelinePosition({
        ...timelinePosition,
        left: leftPosition + offset
      })
    }
  }

  /**
   * Scroll the timeline forward (down, or to the right)
   */
  const scrollForward = (offset = 0) => {
    let shouldMove = true
    // TODO skips ahead a bunch when scrolling with arrows, doesn't happen with dragging
    // jumps one click after the scroll is called
    console.log('🚀 ~ file: index.js ~ line 370 ~ scrollForward ~ scrollForward')
    let translationAdjustment = 0

    // If the underlying dataset has grown larger than desired, trim off 1 buffers
    // worth of data from opposite of the array
    let currentTimeIntervals = timeIntervals
    if (timeIntervals.length > MAX_INTERVAL_BUFFER) {
      shouldMove = false
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
      console.log('🚀 ~ file: index.js ~ line 354 ~ scrollForward ~ currentTimeIntervals.length', currentTimeIntervals.length)

      const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

      translationAdjustment = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)
      console.log('🚀 ~ file: index.js ~ line 360 ~ scrollForward ~ translationAdjustment', translationAdjustment)

      if (timelineStartPosition) {
        setTimelineStartPosition({
          ...timelineStartPosition,
          left: timelineStartPosition.left + translationAdjustment
        })
      }

      console.log('🚀 ~ file: index.js ~ line 364 ~ scrollForward ~ setTimelinePosition', translationAdjustment + timelinePosition.left)
      const leftPosition = translationAdjustment + timelinePosition.left - offset
      console.log('🚀 ~ file: index.js ~ line 449 ~ scrollForward ~ timelinePosition', timelinePosition)
      console.log('🚀 ~ file: index.js ~ line 378 ~ scrollForward ~ leftPosition', leftPosition)
      console.log('🚀 ~ file: index.js ~ line 449 ~ scrollForward ~ offset', offset)
      setTimelinePosition({
        ...timelinePosition,
        left: leftPosition
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

    return shouldMove
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

        const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

        const scrollDirectionIsForward = timelineStartPosition.left - timelinePosition.left > 0

        let scrollDirection
        if (scrollDirectionIsForward && scrollDirection !== 'forward') {
          scrollDirection = 'forward'
        }

        if (!scrollDirectionIsForward && scrollDirection !== 'backward') {
          scrollDirection = 'backward'
        }

        const loadMoreWindow = timelineWrapperWidth / 3

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
            timelineWrapperWidth - (timelineStartPosition.left + listWidth)
          )
          const distanceFromEdge = -(timelineWrapperWidth - (timelinePosition.left + listWidth))

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
   * Sets or unsets the focusedInterval as the interval where the user clicked
   */
  const onFocusedClick = (e) => {
    // Find the selected interval
    const { pageX: mouseX } = e

    const { x: listX } = timelineListRef.current.getBoundingClientRect()
    const startPosition = mouseX - listX

    // Find the timestamp where the user clicked
    const timestamp = getTimestampByPosition({
      intervalListWidthInPixels,
      position: startPosition,
      timeIntervals,
      zoomLevel
    })

    // Find the beginning and end of the interval where the timestamp sits
    const {
      end: newEnd,
      start: newStart
    } = getIntervalBounds(timeIntervals, timestamp)

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

    const focused = {
      end: newEnd,
      start: newStart
    }

    // Set the selected interval as focused
    if (onFocusedSet) onFocusedSet(focused)
    setFocusedInterval(focused)
  }

  /**
   * Click handler for the timeline.
   */
  const onTimelineClick = (e) => {
    const { pageY: mouseY } = e
    const { top, height } = timelineWrapperRef.current.getBoundingClientRect()

    const clickHeight = mouseY - top

    // If the user clicks on the bottom FOCUSED_SELECTION_HEIGHT pixels of the timeline, call onFocusedClick
    if (clickHeight >= height - FOCUSED_SELECTION_HEIGHT) {
      onFocusedClick(e)
    }
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

    // Update the focusedInterval state
    // call onFocusedSet
    if (onFocusedSet) onFocusedSet(newFocused)
    setFocusedInterval(newFocused)

    const {
      end: newEnd,
      start: newStart
    } = newFocused

    const timelineToolsWidth = timelineToolsRef.current.getBoundingClientRect().width
    // The focused interval might not be at the start, need to keep the focused interval in the same spot as the timeline scrolls
    const currentCenterTime = getCenterTimestamp({
      intervalListWidthInPixels,
      timeIntervals,
      timelinePosition,
      timelineToolsWidth,
      timelineWrapperRef,
      zoomLevel
    })
    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const currentCenterPosition = getPositionByTimestamp({
      timestamp: currentCenterTime,
      timeIntervals,
      timelineToolsWidth,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    })
    const newStartPosition = getPositionByTimestamp({
      timestamp: newStart,
      timeIntervals,
      timelineToolsWidth,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    })
    const newEndPosition = getPositionByTimestamp({
      timestamp: newEnd,
      timeIntervals,
      timelineToolsWidth,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    })

    // Find the offset of the current timeline center and the current focused interval start
    const offset = currentCenterTime - currentStart

    // this needs to be the width of an interval, not the offset from center, the scroll methods are only looking at the left position and keeping that
    const offsetInPx = newEndPosition - newStartPosition
    // console.log('🚀 ~ file: index.js ~ line 753 ~ onChangeFocusedInterval ~ currentCenterTime', new Date(currentCenterTime).toISOString())

    // // Move the timeline to newStart + offset
    // const offsetStart = newStart + offset
    // console.log('🚀 ~ file: index.js ~ line 747 ~ onChangeFocusedInterval ~ offsetStart', offsetStart)
    // moveTimeline(offsetStart)


    let shouldMove = true
    const startIndex = timeIntervals.findIndex((interval) => interval >= newStart) - 1
    console.log('🚀 ~ file: index.js ~ line 725 ~ onChangeFocusedInterval ~ startIndex', startIndex)
    if (direction === 'previous' && startIndex < INTERVAL_BUFFER / 3) {
      scrollBackward(offsetInPx)
      shouldMove = false
      // backwards is working, except not scrolling with the new interval when it adds intervals
    } else if (direction === 'next' && startIndex > timeIntervals.length - (INTERVAL_BUFFER / 3)) {
      shouldMove = scrollForward(offsetInPx)
      // forwards is skipping a bunch the change after it adds intervals
    } //else {

    // don't do this if scollBackward() happens
    // do this scollForward() happens
    // do this is neither happens
    // don't? do this if scrollForward() removes intervals
    if (shouldMove) {
      // Move the timeline to newStart + offset
      const offsetStart = newStart + offset
      console.log('🚀 ~ file: index.js ~ line 747 ~ onChangeFocusedInterval ~ offsetStart', offsetStart)
      moveTimeline(offsetStart)
    }
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

  /**
   * Move move event handler for the whole window. Handles updating the dragging state if dragging is happening
   */
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
    window.addEventListener('mouseup', onWindowMouseUp)
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('keydown', onWindowKeydown)

    return () => {
      window.removeEventListener('mouseup', onWindowMouseUp)
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('keydown', onWindowKeydown)
    }
  }, [
    dragging,
    focusedInterval,
    timeIntervals,
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
      const timelineToolsWidth = timelineToolsRef.current.getBoundingClientRect().width

      const centeredDate = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition,
        timelineToolsWidth,
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

  // if (timelineWrapperRef.current) console.log('[DEBUG]: timelineWrapperRef width', timelineWrapperRef.current.getBoundingClientRect().width)

  return (
    <div
      className="timeline"
      ref={timelineWrapperRef}
    >
      <TimelineTools
        focusedInterval={focusedInterval}
        minZoom={minZoom}
        maxZoom={maxZoom}
        temporalRange={temporalRange}
        ref={timelineToolsRef}
        zoomLevel={zoomLevel}
        onChangeFocusedInterval={onChangeFocusedInterval}
        onChangeZoomLevel={onChangeZoomLevel}
      />
      <div className="timeline__outer-wrapper">
        <div
          className="timeline__wrapper"
        >
          {/* <div className="timeline__center" /> */}
          {
            timeIntervals.length > 0 && (
              <TimelineList
                focusedInterval={focusedInterval}
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
                onTimelineClick={onTimelineClick}
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
  focusedInterval: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }),
  maxDate: PropTypes.number, // maximum date timeline will allow scrolling
  minDate: PropTypes.number, // minimum date timeline will allow scrolling
  onFocusedSet: PropTypes.func,
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
