import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useGesture } from 'react-use-gesture'
import { animated, useSpring } from 'react-spring'
import { isEmpty } from 'lodash'
import { Lethargy } from 'lethargy'
import { ResizeObserver } from '@juggle/resize-observer'

import { TimelineList } from './components/TimelineList/TimelineList'
import { TimelinePrimarySection } from './components/TimelinePrimarySection/TimelinePrimarySection'
import { TimelineTools } from './components/TimelineTools/TimelineTools'

import { calculateTimeIntervals } from './utils/calculateTimeIntervals'
import { determineTemporalLabel } from './utils/determineTemporalLabel'
import { determineTooltipPosition } from './utils/determineTooltipPosition'
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

const lethargy = new Lethargy()

/**
 * Renders the EDSC Timeline
 * @param {Object} param0
 * @param {Integer} param0.center Center timestamp of the timeline
 * @param {Object} param0.data Data to be displayed on the timeline
 * @param {Object} param0.focusedInterval Focused date range to display on the timeline
 * @param {Integer} param0.minZoom Min zoom allowed
 * @param {Integer} param0.maxZoom Max zoom allowed
 * @param {Object} param0.temporalRange Temporal range to display on the timeline
 * @param {Integer} param0.zoom Current zoom level of the timeline
 * @param {Function} param0.onFocusedSet Callback function that returns the focused interval when it is set
 * @param {Function} param0.onTemporalSet Callback function that returns the temporal range when it is set
 * @param {Function} param0.onTimelineMove Callback function called when the timeline is moved
 * @param {Function} param0.onTimelineMoveEnd Callback function called when the timeline is finished moving
 * @param {Function} param0.onArrowKeyPan Callback function called when arrow keys are used to change the focused interval
 * @param {Function} param0.onButtonPan Callback function called when buttons are used to change the focused interval
 * @param {Function} param0.onButtonZoom Callback function called when buttons are used to change the zoom level
 * @param {Function} param0.onDragPan Callback function called when the timeline is panned using dragging
 * @param {Function} param0.onFocusedIntervalClick Callback function called when a focused interval is clicked
 * @param {Function} param0.onScrollPan Callback function called when the mouse wheel is used to pan the timeline
 * @param {Function} param0.onScrollZoom Callback function called when the mouse wheel is used to change the zoom level

 */
export const EDSCTimeline = ({
  center: propsCenter,
  data,
  focusedInterval: propsFocusedInterval,
  minZoom,
  maxZoom,
  temporalRange: propsTemporalRange,
  zoom,
  onArrowKeyPan,
  onButtonPan,
  onButtonZoom,
  onDragPan,
  onFocusedIntervalClick,
  onFocusedSet,
  onScrollPan,
  onScrollZoom,
  onTemporalSet,
  onTimelineMove,
  onTimelineMoveEnd
}) => {
  // Ref for the timeline to access the list DOM element
  const timelineListRef = useRef(null)

  // Ref for the timeline to access the wrapper DOM element
  const timelineWrapperRef = useRef(null)

  // Ref for the timeline to access the timeline tools DOM element
  const timelineToolsRef = useRef(null)

  // Ref for the timeline to access the temporal range DOM element
  const temporalRangeTooltipRef = useRef(null)

  const [center, setCenter] = useState(propsCenter)

  // Store the zoom level and allow for changing props to modify the state
  const [zoomLevel, setZoomLevel] = useState(zoom)

  // Update the internal state when/if the prop changes
  useEffect(() => {
    setZoomLevel(zoom)
  }, [zoom])

  // Store the pixel width of the list of intervals
  const [intervalListWidthInPixels, setIntervalListWidthInPixels] = useState(null)

  // Store the pixel value of the center of the list of intervals
  const [intervalsCenterInPixels, setIntervalsCenterInPixels] = useState(null)

  // Flag for the initial loading state of the timeline
  const [isLoaded, setIsLoaded] = useState(false)

  // Tracks when the timeline is currently in a dragging state
  const [draggingTimeline, setDraggingTimeline] = useState(false)

  // Tracks when a temporal marker is dragging
  const [draggingTemporalMarker, setDraggingTemporalMarker] = useState('')

  // The current position of the timeline
  const [timelinePosition, setTimelinePosition] = useState({ top: 0, left: 0 })

  // The current position of the mouse when mouseover is triggered on the temporal selection area
  const [temporalRangeMouseOverPosition, setTemporalRangeMouseOverPosition] = useState(null)

  // The temporal range (markers) displayed on the timeline
  const [temporalRange, setTemporalRange] = useState(propsTemporalRange)

  // If the propsTemporalRange changes, use those values as the temporalRange
  useEffect(() => {
    setTemporalRange(propsTemporalRange)
  }, [propsTemporalRange])

  // The focused interval
  const [focusedInterval, setFocusedInterval] = useState(propsFocusedInterval)

  // Tracks when the temporal range is hovered
  const [hoveringTemporalRange, setHoveringTemporalRange] = useState(false)

  // Tracks when a temporal marker is hovered
  const [hoveringTemporalMarker, setHoveringTemporalMarker] = useState('')

  // Tracks when an action will cancel the current temporal selection
  const [willCancelTemporalSelection, setWillCancelTemporalSelection] = useState(false)

  // Tracks when hovering the temporal selection should be prevented
  const [preventTemporalSelectionHover, setPreventTemporalSelectionHover] = useState(false)

  // The visible start and end time for the current timeline position
  const [visibleTemporalRange, setVisibleTemporalRange] = useState({
    start: null,
    end: null
  })

  // The visible start and end time for the current timeline position
  const [totalTemporalRange, setTotalTemporalRange] = useState({
    start: null,
    end: null
  })

  const [timelineWrapperWidth, setTimelineWrapperWidth] = useState(null)
  const [temporalRangeTooltipWidth, setTemporalRangeTooltipWidth] = useState(null)
  const [temporalTooltipStyle, setTemporalTooltipStyle] = useState({ left: 'auto', right: 'auto' })
  const [temporalTooltipText, setTemporalTooltipText] = useState(null)

  /**
   * Creates a full list of new timeIntervals based on the given center and zoom
   * @param {Integer} center Center timestamp of the new interval list
   * @param {Integer} zoom Optional - Zoom level to create the intervals at, defaults to zoomLevel
   */
  const generateNewTimeIntervals = (center, zoom = zoomLevel) => {
    const centerInterval = roundTime(center, zoom)
    const leftIntervals = calculateTimeIntervals({
      timeAnchor: center,
      zoomLevel: zoom,
      numIntervals: INTERVAL_BUFFER,
      reverse: true
    })
    const rightIntervals = calculateTimeIntervals({
      timeAnchor: center,
      zoomLevel: zoom,
      numIntervals: INTERVAL_BUFFER,
      reverse: false
    })

    return [
      ...leftIntervals,
      centerInterval,
      ...rightIntervals
    ]
  }

  // Store calculated time intervals that power the display of the timeline dates
  const [timeIntervals, setTimeIntervals] = useState(() => generateNewTimeIntervals(center))

  /**
   * Build an object with all current timeline values to return in callback functions
   */
  const buildReturnObject = ({
    newCenter = center,
    newFocusedInterval = focusedInterval,
    newTemporalRange = temporalRange,
    newTimeIntervals = timeIntervals,
    newZoom = zoomLevel
  }) => {
    const {
      end: focusedEnd,
      start: focusedStart
    } = newFocusedInterval

    const {
      end: temporalEnd,
      start: temporalStart
    } = newTemporalRange

    return {
      center: newCenter,
      focusedEnd,
      focusedStart,
      temporalEnd,
      temporalStart,
      timelineEnd: newTimeIntervals[newTimeIntervals.length - 1],
      timelineStart: newTimeIntervals[0],
      zoom: newZoom
    }
  }

  /**
   * Calculates the new intervals list width
   */
  const calculateNewIntervalListWidth = () => {
    // Anytime new time intervals are calcualted update the pixel width of their container
    const duration = getIntervalsDuration(timeIntervals, zoomLevel)

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const width = determineScaledWidth(duration, zoomLevel, timelineWrapperWidth)

    return width
  }

  // On page load, set the interval list width
  useEffect(() => {
    setIntervalListWidthInPixels(calculateNewIntervalListWidth())
  }, [])

  /**
   * Sets new timeIntervals, and determines the new width of the interval list
   * @param {Object} newIntervals New timeIntervals to set
   * @param {Integer} zoom Zoom level used in the newIntervals
   */
  const updateTimeIntervals = (newIntervals, zoom = zoomLevel) => {
    setTimeIntervals(newIntervals)
    const duration = getIntervalsDuration(newIntervals, zoom)

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const width = determineScaledWidth(duration, zoom, timelineWrapperWidth)

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
        0,
        (currentTimeIntervals.length - INTERVAL_BUFFER)
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
        INTERVAL_BUFFER,
        currentTimeIntervals.length
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

  /**
   * Clear the current temporalRange value
   */
  const clearTemporalRange = () => {
    if (!isEmpty(temporalRange)) {
      setTemporalRange({})

      if (onTemporalSet) onTemporalSet(buildReturnObject({ newTemporalRange: {} }))
    }
  }

  /**
   * Moves the timeline to the given position
   * @param {Object} position Position to move the timeline to
   */
  const handleMoveTimeline = (position, active) => {
    if (!onTimelineMove && !onTimelineMoveEnd) return

    const centeredTimestamp = getCenterTimestamp({
      intervalListWidthInPixels,
      timeIntervals,
      timelinePosition: position || timelinePosition,
      timelineWrapperRef,
      zoomLevel
    })
    setCenter(centeredTimestamp)

    if (onTimelineMove) {
      onTimelineMove(buildReturnObject({ newCenter: centeredTimestamp }))
    }

    if (!active && onTimelineMoveEnd) {
      onTimelineMoveEnd(buildReturnObject({ newCenter: centeredTimestamp }))
    }
  }

  /**
   * Move the timeline to the new center position
   * @param {Integer} center Timestamp to move the timeline to
   * @param {Array} intervals Optional - New timeIntervals to use
   * @param {Integer} zoom Optional - New zoomLevel to use
   * @param {Integer} offset Optional - Offset the timestamp position by this many pixels
   */
  const centerTimelineToTimestamp = ({
    timestamp,
    intervals = timeIntervals,
    zoom = zoomLevel,
    offset = 0
  }) => {
    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

    const timestampPosition = getPositionByTimestamp({
      timestamp,
      timeIntervals: intervals,
      zoomLevel: zoom,
      wrapperWidth: timelineWrapperWidth
    })

    // Move the timeline to the timestampPosition - offset, then subtract half the wrapper width to center that value in the timeline wrapper
    const left = -((timestampPosition - offset) - (timelineWrapperWidth / 2))

    setTimelinePosition({
      ...timelinePosition,
      left
    })

    if (onTimelineMove) {
      onTimelineMove(buildReturnObject({ newCenter: timestamp, newZoom: zoom }))
    }

    if (onTimelineMoveEnd) {
      onTimelineMoveEnd(buildReturnObject({ newCenter: timestamp, newZoom: zoom }))
    }
  }

  // When the zoom level changes, this useEffect will find the new center value and move the timeline to that timestamp
  useEffect(() => {
    const centeredTimestamp = getCenterTimestamp({
      intervalListWidthInPixels,
      timeIntervals,
      timelinePosition,
      timelineWrapperRef,
      zoomLevel
    })
    setCenter(centeredTimestamp)

    if (centeredTimestamp) centerTimelineToTimestamp({ timestamp: centeredTimestamp })
  }, [zoomLevel])

  /**
   * Calculate a new interval list width and center the timeline on window resize
   */
  const onWindowResize = () => {
    const newIntervalListWidth = calculateNewIntervalListWidth()
    setIntervalListWidthInPixels(newIntervalListWidth)

    if (timelineWrapperRef.current) {
      setTimelineWrapperWidth(timelineWrapperRef.current.getBoundingClientRect().width)
    }

    centerTimelineToTimestamp({ timestamp: center })
  }

  // Setup handles for window resizing
  useEffect(() => {
    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [center, timeIntervals, timelinePosition, zoomLevel])

  /**
   * Handles panning the timeline side to side
   * @param {Object} state useGesture state
   * @param {Boolean} reverseDirection Optional - Reverse the direction of the pan
   */
  const handlePanTimeline = (state, reverseDirection = false) => {
    const {
      active,
      delta: [deltaX],
      direction: [directionX]
    } = state

    let positionOffset = {
      top: 0,
      left: 0
    }

    // Reverse the direction of the pan if reverseDirection is true (for wheel scrolling)
    const reverseX = reverseDirection ? -1 : 1

    const newTimelinePosition = {}
    newTimelinePosition.left = timelinePosition.left + (deltaX * reverseX)

    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    const timelineListWidth = timelineListRef.current.getBoundingClientRect().width

    const scrollDirection = directionX !== 1 ? 'forward' : 'backward'

    const loadMoreWindow = timelineWrapperWidth / 3
    const distanceFromLeftEdge = -newTimelinePosition.left
    const distanceFromRightEdge = timelineListWidth
      - (-newTimelinePosition.left + timelineWrapperWidth)

    if (scrollDirection === 'backward') {
      // If the scroll position is within the window to load another page
      if (distanceFromLeftEdge <= loadMoreWindow) {
        positionOffset = {
          ...positionOffset,
          ...scrollBackward()
        }
      }
    }

    if (scrollDirection === 'forward') {
      // If the scroll position is within the window to load another page
      if (distanceFromRightEdge <= loadMoreWindow) {
        positionOffset = {
          ...positionOffset,
          ...scrollForward()
        }
      }
    }

    const newLeft = newTimelinePosition.left + positionOffset.left

    setTimelinePosition({
      top: 0,
      left: newLeft
    })

    handleMoveTimeline({ left: newLeft }, active)

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

    // If the movementX is positive, we can assume the user has moved the end marker
    const markerType = movementX > 0 ? 'end' : 'start'

    const { x: listX } = timelineListRef.current.getBoundingClientRect()
    const startPosition = initialMouseX - listX

    const endPosition = startPosition + movementX

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
    setDraggingTemporalMarker(markerType)

    if (!active) {
      if (onTemporalSet) onTemporalSet(buildReturnObject({ newTemporalRange: range }))
      setDraggingTemporalMarker('')
    }
  }

  /**
   * Generates new timeIntervals at the given zoom and moves the timeline to the given timestamp
   * @param {Integer} timestamp Timestamp to zoom to
   * @param {Integer} zoom Zoom level to zoom to
   * @param {Integer} offset Optional: offset the timeline position by this offset value
   */
  const zoomToTimestamp = (timestamp, zoom, offset = 0) => {
    const newIntervals = generateNewTimeIntervals(timestamp, zoom)

    updateTimeIntervals(newIntervals, zoom)
    setZoomLevel(zoom)
    setFocusedInterval({})
    if (onFocusedSet) onFocusedSet(buildReturnObject({ newFocusedInterval: {} }))

    centerTimelineToTimestamp({
      timestamp,
      intervals: newIntervals,
      zoom,
      offset
    })
  }

  // Flag to allow for a cooldown period when wheel zooming
  const [isWheelZooming, setIsWheelZooming] = useState(false)
  useEffect(() => {
    // If isWheelZooming is true, turn it back to false after a short period
    if (isWheelZooming) {
      setTimeout(() => {
        setIsWheelZooming(false)
      }, 300)
    }
  }, [isWheelZooming])

  /**
   * Handles wheel zooming
   * @param {Object} state useGesture state
   */
  const handleWheelZoom = (state) => {
    const { event } = state
    event.persist()

    // If the timeline from the last zoom hasn't ended yet, don't continue zooming
    if (isWheelZooming) return

    const wheelDirection = lethargy.check(event)
    if (!wheelDirection) return

    setIsWheelZooming(true)

    const newZoomLevel = zoomLevel + wheelDirection

    if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
      const { x: listX } = timelineListRef.current.getBoundingClientRect()
      const { clientX: mouseX } = event

      // Find the position of the mouse within the list
      const mousePosition = mouseX - listX

      // Find the current center position of the timeline
      const currentCenterTimestamp = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition,
        timelineWrapperRef,
        zoomLevel
      })

      const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
      const currentCenterPosition = getPositionByTimestamp({
        timestamp: currentCenterTimestamp,
        timeIntervals,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth
      })

      // Determine the offset of the mouse position and the current center
      const offset = mousePosition - currentCenterPosition

      // Find the new center based on the mousePosition
      const newCenteredTimestamp = getTimestampByPosition({
        intervalListWidthInPixels,
        position: mousePosition,
        timeIntervals,
        zoomLevel
      })
      setCenter(newCenteredTimestamp)

      zoomToTimestamp(newCenteredTimestamp, newZoomLevel, offset)
      if (onScrollZoom) onScrollZoom(buildReturnObject({ newZoom: newZoomLevel }))
    }
  }

  /**
   * Handles scroll wheel behavior
   * @param {Object} state useGesture state
   */
  const handleWheel = (state) => {
    const { axis, last } = state

    if (axis === 'y') {
      handleWheelZoom(state)
    } else {
      handlePanTimeline(state, true)
      if (last && onScrollPan) onScrollPan(buildReturnObject({}))
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
      setDraggingTemporalMarker('')
      if (onTemporalSet) onTemporalSet(buildReturnObject({ newTemporalRange: range }))
    }
  }

  /**
   * Handles the different dragging that can happen on the timeline
   * @param {Object} state useGesture state
   */
  const handlePan = (state) => {
    const {
      event,
      initial: [, mouseY],
      last
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
      if (last && onDragPan) onDragPan(buildReturnObject({}))
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
    // Get a list of all elements currently under the cursor
    const elements = document.elementsFromPoint(mouseX, mouseY) || []

    // Check to see if the user is hovering an interval bottom div. We cant use hover/mouseover
    // due to the fact that in its default state, the temporal selection div captures the hover/mouseover.
    const intervalBottomHovered = !!elements.find((element) => element.classList.contains('edsc-timeline-interval__interval-bottom'))

    const { top } = timelineWrapperRef.current.getBoundingClientRect()

    const mouseOverHeight = mouseY - top

    // Sets the temporalRangeMouseOverPosition when following conditions are met
    //  - users cursor is at the correct height
    //  - user is not dragging the timeline
    //  - user is not dragging a temporal marker
    //  - user is not hovering a temporal marker
    if (
      mouseOverHeight <= TEMPORAL_SELECTION_HEIGHT
      && !draggingTimeline
      && !draggingTemporalMarker
      && !hoveringTemporalMarker
    ) {
      const { x: listX } = timelineListRef.current.getBoundingClientRect()
      const startPosition = mouseX - listX

      setTemporalRangeMouseOverPosition(startPosition)
      setWillCancelTemporalSelection(true)
    } else {
      setTemporalRangeMouseOverPosition(null)
      setWillCancelTemporalSelection(false)
    }

    // If the users cursor is over an interval bottom div, we prevent pointer events on
    // the temporal selection element via a conditional classname.
    setPreventTemporalSelectionHover(intervalBottomHovered)
  }

  /**
   * Handles the hover gesture of useGesture
   * @param {Object} param0.hovering useGesture hovering state
   */
  const handleHover = ({ hovering }) => {
    // If no longer hovering over the timeline, remove the temporalRangeMouseOverPosition
    if (!hovering) {
      setWillCancelTemporalSelection(false)
      setTemporalRangeMouseOverPosition(null)
    }
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

    // Get the timestamp at the left most edge of the timeline
    const totalStartPosition = -timelinePosition.left
    const totalStartTimestamp = getTimestampByPosition({
      intervalListWidthInPixels,
      position: totalStartPosition,
      timeIntervals,
      zoomLevel
    })

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
    setTotalTemporalRange({
      end: visibleEndTimestamp,
      start: totalStartTimestamp
    })

    // Set the visible start range
    setVisibleTemporalRange({
      end: visibleEndTimestamp,
      start: visibleStartTimestamp
    })
  }, [timelinePosition, focusedInterval.start])

  useEffect(() => {
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

      // Move the timeline to the center's position, then subtract half the wrapper width to center that value in the timeline wrapper
      const left = -(
        getPositionByTimestamp({
          timestamp: propsCenter,
          timeIntervals,
          zoomLevel,
          wrapperWidth: timelineWrapperWidth
        }) - (timelineWrapperWidth / 2)
      )

      setTimelinePosition({
        ...timelinePosition,
        left
      })

      const centeredTimestamp = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition: {
          left
        },
        timelineWrapperRef,
        zoomLevel
      })
      setCenter(centeredTimestamp)

      if (onTimelineMove) {
        onTimelineMove(buildReturnObject({ newCenter: centeredTimestamp }))
      }

      if (onTimelineMoveEnd) {
        onTimelineMoveEnd(buildReturnObject({ newCenter: centeredTimestamp }))
      }

      setIsLoaded(true)
    }
  }, [intervalsCenterInPixels, center])

  /**
   * Sets or unsets the focusedInterval as the interval where the user clicked
   */
  const onFocusedClick = (newFocusedInterval) => {
    if (onFocusedIntervalClick) onFocusedIntervalClick(buildReturnObject({ newFocusedInterval }))

    const {
      end: newEnd,
      start: newStart
    } = newFocusedInterval

    const {
      end,
      start
    } = focusedInterval

    // If the selected interval is already focused, remove the focus
    // Convert milliseconds to seconds before compairing the previous focused interval to the new focused interval
    const startRounded = Math.floor(start / 1000)
    const newStartRounded = Math.floor(newStart / 1000)
    const endRounded = Math.floor(end / 1000)
    const newEndRounded = Math.floor(newEnd / 1000)
    if (startRounded === newStartRounded && endRounded === newEndRounded) {
      if (onFocusedSet) onFocusedSet(buildReturnObject({ newFocusedInterval: {} }))
      setFocusedInterval({})

      return
    }

    // Set the selected interval as focused
    if (onFocusedSet) onFocusedSet(buildReturnObject({ newFocusedInterval }))
    setFocusedInterval(newFocusedInterval)
  }

  /**
   * Moves the focusedInterval to the next or previous interval in timeIntervals
   * @param {String} direction 'next' or 'previous' interval to change the focusedInterval to
   */
  const onChangeFocusedInterval = (direction, withArrowKeys) => {
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
    if (onFocusedSet) onFocusedSet(buildReturnObject({ newFocusedInterval: newFocused }))
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

    handleMoveTimeline({ left: newTimelinePosition }, false)
    if (onArrowKeyPan && withArrowKeys) onArrowKeyPan(buildReturnObject({}))
    if (onButtonPan && !withArrowKeys) onButtonPan(buildReturnObject({}))
  }

  /**
   * Handles the temporal range hover for useGesture
   * @param {Object} param0.hovering useGesture hovering state
   */
  const onTemporalRangeHover = ({ hovering }) => {
    setHoveringTemporalRange(hovering)
  }

  /**
   * Handles the temporal range hover for useGesture
   * @param {Object} param0.marker The marker being hovered
   * @param {Object} param1.hovering useGesture hovering state
   */
  const onTemporalMarkerHover = ({ marker, hovering }) => {
    if (hovering) {
      setHoveringTemporalMarker(marker)
    } else {
      setHoveringTemporalMarker(false)
    }
  }

  /**
   * Key down event handler to handle arrow keys for the focusedInterval
   */
  const onWindowKeydown = (e) => {
    const { start } = focusedInterval
    if (!start) return

    const { key } = e

    if (key === 'ArrowLeft') onChangeFocusedInterval('previous', true)
    if (key === 'ArrowRight') onChangeFocusedInterval('next', true)
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
      const centeredTimestamp = getCenterTimestamp({
        intervalListWidthInPixels,
        timeIntervals,
        timelinePosition,
        timelineWrapperRef,
        zoomLevel
      })
      setCenter(centeredTimestamp)

      zoomToTimestamp(centeredTimestamp, newZoomLevel)
      if (onButtonZoom) {
        onButtonZoom(buildReturnObject({
          newCenter: centeredTimestamp,
          newZoom: newZoomLevel
        }))
      }
    }
  }

  // Trim the data to MAX_DATA_ROWS if needed
  let trimmedData = data

  if (data.length >= MAX_DATA_ROWS) {
    trimmedData = data.slice(0, MAX_DATA_ROWS)
  }

  const { end: endTemporal, start: startTemporal } = temporalRange

  // Set the tooltip text based on the current state
  useEffect(() => {
    let text = ''

    if (startTemporal && !endTemporal) {
      text = `${determineTemporalLabel(startTemporal, 1)} ongoing`
    }

    if (endTemporal && !startTemporal) {
      text = `Up to ${determineTemporalLabel(endTemporal, 1)}`
    }

    if (startTemporal && endTemporal && hoveringTemporalRange) {
      text = `${determineTemporalLabel(startTemporal, 1)} to ${determineTemporalLabel(endTemporal, 1)}`
    }

    if (hoveringTemporalMarker) {
      if (hoveringTemporalMarker === 'start') {
        text = determineTemporalLabel(startTemporal, 1)
      }

      if (hoveringTemporalMarker === 'end') {
        text = determineTemporalLabel(endTemporal, 1)
      }
    }

    if (draggingTemporalMarker) {
      if (draggingTemporalMarker === 'start') {
        text = determineTemporalLabel(startTemporal, 1)
      }

      if (draggingTemporalMarker === 'end') {
        text = determineTemporalLabel(endTemporal, 1)
      }
    }

    setTemporalTooltipText(text)
  }, [
    hoveringTemporalRange,
    hoveringTemporalMarker,
    draggingTemporalMarker,
    startTemporal,
    endTemporal
  ])

  // Track the width of the timeline wrapper
  useEffect(() => {
    // Setup a ResizeObserver to handle updating the intervalListWidthInPixels and timelineWrapperWidth
    // when the timelineWrapperRef is changed
    const resizeObserver = new ResizeObserver(() => {
      const newIntervalListWidth = calculateNewIntervalListWidth()
      setIntervalListWidthInPixels(newIntervalListWidth)

      setTimelineWrapperWidth(timelineWrapperRef.current.getBoundingClientRect().width)
    })

    resizeObserver.observe(timelineWrapperRef.current)

    return () => resizeObserver.unobserve(timelineWrapperRef.current)
  }, [timelineWrapperRef.current, zoomLevel])

  // Track the width of the timeline tooltip
  useEffect(() => {
    if (temporalRangeTooltipRef.current) {
      setTemporalRangeTooltipWidth(temporalRangeTooltipRef.current.getBoundingClientRect().width)
    }
  }, [temporalRangeTooltipRef.current, temporalTooltipText, hoveringTemporalRange])

  // Set the position of the tooltip
  useEffect(() => {
    let tooltipPosition
    let startTooltipPosition
    let endTooltipPosition
    let middleTooltipPosition

    // Calculate the tooltip position of the start marker
    if (startTemporal) {
      startTooltipPosition = determineTooltipPosition({
        timestamp: startTemporal,
        timeIntervals,
        timelinePosition,
        tooltipWidth: temporalRangeTooltipWidth,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth,
        tooltip: temporalRangeTooltipRef.current
      })
    }

    // Calculate the tooltip position of the start marker
    if (endTemporal) {
      endTooltipPosition = determineTooltipPosition({
        timestamp: endTemporal,
        timeIntervals,
        timelinePosition,
        tooltipWidth: temporalRangeTooltipWidth,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth,
        tooltip: temporalRangeTooltipRef.current
      })
    }

    // Calculate the tooltip position of the range
    if (startTemporal || endTemporal) {
      // If the start time is undefined or outside the current visible area, use the total temporal range start tiem
      const start = Math.max(
        totalTemporalRange.start,
        startTemporal || timeIntervals[0]
      )

      // If the end time is undefined or outside the current visible area, use the visible end time
      const end = Math.min(
        visibleTemporalRange.end,
        endTemporal || timeIntervals[timeIntervals.length - 1]
      )

      // Find the middle temporal value of the range
      const middleTemporal = start + ((end - start) / 2)

      // Set the tooltip position to the middle value
      middleTooltipPosition = determineTooltipPosition({
        timestamp: middleTemporal,
        timeIntervals,
        timelinePosition,
        tooltipWidth: temporalRangeTooltipWidth,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth,
        tooltip: temporalRangeTooltipRef.current
      })
    }

    // If hovering a temporal marker, show the tooltip over the marker
    if (hoveringTemporalMarker) {
      if (hoveringTemporalMarker === 'start') {
        tooltipPosition = startTooltipPosition
      }

      if (hoveringTemporalMarker === 'end') {
        tooltipPosition = endTooltipPosition
      }
    }

    // If dragging a temporal marker, so the tooltip over the marker
    if (draggingTemporalMarker) {
      if (draggingTemporalMarker === 'start') {
        tooltipPosition = startTooltipPosition
      }

      if (draggingTemporalMarker === 'end') {
        tooltipPosition = endTooltipPosition
      }
    }

    // If hovering the range and not dragging, show the temporal range tooltip
    if (hoveringTemporalRange && !draggingTemporalMarker) {
      tooltipPosition = middleTooltipPosition
    }

    setTemporalTooltipStyle(tooltipPosition)
  }, [
    hoveringTemporalRange,
    hoveringTemporalMarker,
    startTemporal,
    endTemporal,
    timelinePosition,
    temporalRangeTooltipWidth
  ])

  // Show the tooltip in the following cases
  //  - when the user is dragging a temporal marker
  //  - when the user is hovering a temporal marker
  //  - when the user is hovering the temporal range
  //  - when the temporal selection will not be canceled
  const temporalTooltipVisible = (
    (
      (draggingTemporalMarker === 'start' || draggingTemporalMarker === 'end')
      || (hoveringTemporalMarker === 'start' || hoveringTemporalMarker === 'end')
      || hoveringTemporalRange
    )
  )
  && temporalTooltipText
  && !willCancelTemporalSelection

  const tooltipSpringStyle = useSpring(
    {
      config: (property) => {
        // Set the opacity to fade out
        if (property === 'opacity') return { duration: 100 }
        return {}
      },
      // Prevent spring animation when dragging a marker or the timeline
      immediate: () => !!draggingTemporalMarker || draggingTimeline,
      // Animate the opacity when the tooltip is visible and not dragging the timeline
      opacity: temporalTooltipVisible && !draggingTimeline ? 1 : 0,
      // Animate the bottom when the tooltip is visible
      bottom: temporalTooltipVisible ? '0.125rem' : '-0.125rem',
      // Animate the tooltip position
      ...temporalTooltipStyle
    }
  )

  return (
    <div
      className="edsc-timeline"
      ref={timelineWrapperRef}
    >
      <div
        className="edsc-timeline__tooltips"
      >
        <animated.div
          className="edsc-timeline__tooltip"
          ref={temporalRangeTooltipRef}
          style={{
            ...tooltipSpringStyle
          }}
          data-test-id="tooltip"
        >
          {temporalTooltipText}
        </animated.div>
      </div>
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
      <div className="edsc-timeline__outer-wrapper">
        <div
          className="edsc-timeline__wrapper"
        >
          {
            timeIntervals.length > 0 && (
              <TimelineList
                ref={timelineListRef}
                bindTimelineGestures={bindTimelineGestures}
                data={trimmedData}
                draggingTimeline={draggingTimeline}
                draggingTemporalMarker={draggingTemporalMarker}
                focusedInterval={focusedInterval}
                intervalListWidthInPixels={intervalListWidthInPixels}
                temporalRange={temporalRange}
                temporalRangeMouseOverPosition={temporalRangeMouseOverPosition}
                timeIntervals={timeIntervals}
                timelinePosition={timelinePosition}
                timelineWrapperRef={timelineWrapperRef}
                zoomLevel={zoomLevel}
                onTemporalMarkerHover={onTemporalMarkerHover}
                onTemporalRangeHover={onTemporalRangeHover}
                willCancelTemporalSelection={willCancelTemporalSelection}
                preventTemporalSelectionHover={preventTemporalSelectionHover}
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
  // maxDate: new Date().getTime(),
  // minDate: 0,
  onArrowKeyPan: null,
  onButtonPan: null,
  onButtonZoom: null,
  onDragPan: null,
  onFocusedIntervalClick: null,
  onFocusedSet: null,
  onScrollPan: null,
  onScrollZoom: null,
  onTemporalSet: null,
  onTimelineMove: null,
  onTimelineMoveEnd: null,
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
  // maxDate: PropTypes.number, // maximum date timeline will allow scrolling
  // minDate: PropTypes.number, // minimum date timeline will allow scrolling
  onArrowKeyPan: PropTypes.func,
  onButtonPan: PropTypes.func,
  onButtonZoom: PropTypes.func,
  onDragPan: PropTypes.func,
  onFocusedIntervalClick: PropTypes.func,
  onFocusedSet: PropTypes.func,
  onScrollPan: PropTypes.func,
  onScrollZoom: PropTypes.func,
  onTemporalSet: PropTypes.func,
  onTimelineMove: PropTypes.func,
  onTimelineMoveEnd: PropTypes.func,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  temporalRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }),
  zoom: PropTypes.number
}

export default EDSCTimeline
