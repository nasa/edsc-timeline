import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'

import { startCase } from 'lodash'

import { calculateTimeIntervals } from './utils/calculateTimeIntervals'
import { determineIntervalLabel } from './utils/determineIntervalLabel'

import {
  RESOLUTIONS,
  INTERVAL_BUFFER,
  INTERVAL_THRESHOLD
} from './constants'

import './index.scss'

export const EDSCTimeline = ({
  intervalWidth,
  maxDate,
  show,
  minZoom,
  maxZoom,
  onTimelineMove,
  zoom
}) => {
  // Ref for the timeline to access the DOM element
  const timelineListRef = useRef(null)

  // Ref for the timeline to access the DOM element
  const timelineWrapperRef = useRef(null)

  // Store scroll position to help determine the direction a user is scrolling
  const [scrollPosition, setScrollPosition] = useState(null)

  // Combine scroll positions state with scroll position from a scroll event to determine the scroll direction
  const [scrollDirection, setScrollDirection] = useState(null)

  // Store the zoom level and allow for changing props to modify the state
  const [zoomLevel, setZoomLevel] = useState(zoom)

  // Store the pixel width of the list of intervals
  const [intervalListWidthInPixels, setIntervalListWidthInPixels] = useState(null)

  // Store the pixel value of the center of the list of intervals
  const [timelineCenterInPixels, setTimelineCenterInPixels] = useState(null)

  // Store calculated time intervals that power the display of the timeline dates
  const [timeIntervals, setTimeIntervals] = useState([
    ...calculateTimeIntervals(maxDate, zoomLevel, INTERVAL_BUFFER, true),
    ...calculateTimeIntervals(maxDate, zoomLevel, INTERVAL_BUFFER, false)
  ])

  /**
   * DEBUG USEEFFECTS
   */

  useEffect(() => {
    console.log('[DEBUG]: TIME_INTERVALS.LENGTH', timeIntervals.length)
  }, [timeIntervals])

  useEffect(() => {
    console.log('[DEBUG]: SCROLL_DIRECTION ', scrollDirection)
  }, [scrollDirection])

  /**
   * END DEBUG USEEFFECTS
   */

  useLayoutEffect(() => {
    if (timelineWrapperRef.current) {
      // When the timeline wrapper DOM element is available determine
      // the center value of the element in pixels
      const timelineListWidth = timelineWrapperRef.current.getBoundingClientRect().width

      setTimelineCenterInPixels((intervalListWidthInPixels / 2) - (timelineListWidth / 2))
    }
  }, [intervalListWidthInPixels, timelineWrapperRef])

  useEffect(() => {
    // Anytime new time intervals are calcualted update the pixel width of their container
    setIntervalListWidthInPixels((intervalWidth * timeIntervals.length))
  }, [timeIntervals])

  useEffect(() => {
    if (timelineWrapperRef.current) {
      // Center the timeline on load
      timelineWrapperRef.current.scrollTo(timelineCenterInPixels, 0)
    }
  }, [timelineCenterInPixels])

  // Update the internal state when/if the prop changes
  useEffect(() => {
    setZoomLevel(zoom)
  }, [zoom])

  /**
   * Callback to change the current zoom level and recalculate timeIntervals
   * @param {Integer} newZoomLevel New desired zoom level
   */
  const onChangeZoomLevel = (newZoomLevel) => {
    if (newZoomLevel >= minZoom && zoomLevel <= maxZoom) {
      setZoomLevel(newZoomLevel)

      setTimeIntervals([
        ...calculateTimeIntervals(maxDate, newZoomLevel, INTERVAL_BUFFER, true),
        ...calculateTimeIntervals(maxDate, newZoomLevel, INTERVAL_BUFFER, false)
      ])
    }
  }

  /**
   * Scroll the timeline backward (up, or to the left)
   */
  const scrollBackward = () => {
    // If the underlying dataset has grown larger than desired, trim off 1 buffers
    // worth of data from opposite of the array
    let currentTimeIntervals = timeIntervals
    if (timeIntervals.length > (INTERVAL_BUFFER * 10)) {
      currentTimeIntervals = currentTimeIntervals.slice(
        0, (currentTimeIntervals.length - INTERVAL_BUFFER)
      )
    }

    setTimeIntervals([
      ...calculateTimeIntervals(timeIntervals[0], zoomLevel, INTERVAL_BUFFER, true),
      ...currentTimeIntervals
    ])

    if (timelineWrapperRef.current) {
      // Appending data to the beginning of the underlying dataset requires us to scroll the user
      // to back to the right, outside of the window that triggers another page to be loaded
      timelineWrapperRef.current.scrollTo(
        scrollPosition + (intervalWidth * INTERVAL_BUFFER), 0
      )
    }
  }

  /**
   * Scroll the timeline forward (down, or to the right)
   */
  const scrollForward = (loadMoreWindow) => {
    // If the underlying dataset has grown larger than desired, trim off 1 buffers
    // worth of data from opposite of the array
    let currentTimeIntervals = timeIntervals
    if (timeIntervals.length > (INTERVAL_BUFFER * 10)) {
      currentTimeIntervals = currentTimeIntervals.slice(
        INTERVAL_BUFFER, (currentTimeIntervals.length - INTERVAL_BUFFER)
      )
    }

    setTimeIntervals([
      ...currentTimeIntervals,
      ...calculateTimeIntervals(
        timeIntervals[timeIntervals.length - 1], zoomLevel, INTERVAL_BUFFER, false
      )
    ])

    if (timelineWrapperRef.current) {
      // Appending data to the end of the underlying dataset requires us to scroll the user
      // to back to the left, outside of the window that triggers another page to be loaded
      timelineWrapperRef.current.scrollTo(
        scrollPosition - (intervalWidth * INTERVAL_BUFFER) - loadMoreWindow, 0
      )
    }
  }

  /**
   * Callback to update internal state when a scroll event is triggered
   * @param {Object} event JavaScript event object associated with the scroll event
   */
  const onWrapperScroll = (event) => {
    const { target } = event
    const {
      offsetWidth: containerWidth,
      scrollLeft: scrollLeftPos,
      scrollWidth
    } = target

    if ((scrollPosition !== scrollLeftPos) && (scrollPosition - scrollLeftPos < 0)) {
      setScrollDirection('forward')
    } else {
      setScrollDirection('backward')
    }

    const loadMoreWindow = intervalWidth * INTERVAL_THRESHOLD

    if (scrollDirection === 'backward') {
      // If the previous scroll position is outside of the window to trigger another page and
      // the scroll position attached to the event is within the window
      if (scrollPosition > loadMoreWindow && scrollLeftPos <= loadMoreWindow) {
        scrollBackward()
      }
    }

    if (scrollDirection === 'forward') {
      // Determine the previous pixel position of the right edge of the timeline
      const previousScrollRightPos = (scrollPosition + containerWidth + loadMoreWindow)

      // Determine the current pixel position of the right edge of the timeline
      const scrollRightPos = (scrollLeftPos + containerWidth + loadMoreWindow)

      // If the previous scroll position is outside of the window to trigger another page and
      // the scroll position attached to the event is within the window
      if (previousScrollRightPos < scrollWidth && scrollRightPos >= scrollWidth) {
        scrollForward(loadMoreWindow)
      }
    }

    if (onTimelineMove) onTimelineMove()

    // Update the scroll position
    setScrollPosition(scrollLeftPos)
  }

  return (
    <>
      {
        show && (
          <div className="timeline">
            <section>
              <button
                type="button"
                disabled={zoomLevel === maxZoom}
                onClick={() => onChangeZoomLevel(zoomLevel + 1)}
              >
                -
              </button>
              <span>
                {startCase(RESOLUTIONS[zoomLevel])}
                {zoomLevel}
              </span>
              <button
                type="button"
                disabled={zoomLevel === minZoom}
                onClick={() => onChangeZoomLevel(zoomLevel - 1)}
              >
                +
              </button>
            </section>

            <div
              ref={timelineWrapperRef}
              className="timeline__wrapper"
              onScroll={onWrapperScroll}
            >
              <div
                ref={timelineListRef}
                className="timeline__list"
                style={{
                  width: `${intervalListWidthInPixels}px`
                }}
              >
                {
                  timeIntervals && timeIntervals.map((interval) => {
                    const [text, ...subText] = determineIntervalLabel(interval, zoomLevel)

                    return (
                      <div key={interval} className="timeline__interval">
                        {text}
                        <br />
                        {subText}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

EDSCTimeline.defaultProps = {
  intervalWidth: 100,
  maxDate: new Date().getTime(),
  minDate: 0,
  onFocusedTemporalSet: null,
  onTemporalSet: null,
  onTimelineMove: null,
  show: true,
  minZoom: 1,
  maxZoom: 5,
  zoom: 3
}

EDSCTimeline.propTypes = {
  intervalWidth: PropTypes.number,
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
      ).isRequired,
    })
  ).isRequired,
  show: PropTypes.bool,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoom: PropTypes.number
}

export default EDSCTimeline
