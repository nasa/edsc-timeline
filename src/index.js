import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'

import { startCase } from 'lodash'

import { calculateTimeIntervals } from './utils/calculateTimeIntervals'
import { determineIntervalLabel } from './utils/determineIntervalLabel'

import { RESOLUTIONS, INTERVAL_BUFFER, INTERVAL_THRESHOLD } from './constants';

import './index.scss'

export const EDSCTimeline = ({
  maxDate,
  show,
  zoom
}) => {
  const [scrollPosition, setScrollPosition] = useState(null)
  const [scrollDirection, setScrollDirection] = useState(null)

  const [zoomLevel, setZoomLevel] = useState(zoom)
  const [timeIntervals, setTimeIntervals] = useState([
    ...calculateTimeIntervals(maxDate, zoomLevel, INTERVAL_BUFFER, true),
    ...calculateTimeIntervals(maxDate, zoomLevel, INTERVAL_BUFFER, false)
  ])

  // Update the internal state when/if the prop changes
  useEffect(() => {
    setZoomLevel(zoom)
  }, [zoom])

  useEffect(() => {
    console.log('[DEBUG]: TIME_INTERVALS.LENGTH', timeIntervals.length)
  }, [timeIntervals])

  useEffect(() => {
    console.log('[DEBUG]: SCROLL_POSTION ', scrollDirection)
  }, [scrollDirection])

  const onChangeZoomLevel = (newZoomLevel) => {
    if (newZoomLevel > -1 && zoomLevel <= RESOLUTIONS.length - 1) {
      setZoomLevel(newZoomLevel)
      setTimeIntervals(calculateTimeIntervals(maxDate, newZoomLevel, INTERVAL_BUFFER))
    }
  }

  const intervalWidth = 100
  const listWidth = (intervalWidth * timeIntervals.length)
  const centerPx = listWidth / 2

  const timelineWrapperRef = useRef(null)

  const onWrapperScroll = useCallback((event) => {
    const { target } = event
    const { offsetWidth: containerWidth, scrollLeft: scrollLeftPos, scrollWidth } = target

    if ((scrollPosition !== scrollLeftPos) && (scrollPosition - scrollLeftPos < 0)) {
      setScrollDirection('right')
    } else {
      setScrollDirection('left')
    }

    const loadMoreWindow = intervalWidth * INTERVAL_THRESHOLD

    if (scrollDirection === 'left') {
      if (scrollPosition > loadMoreWindow && scrollLeftPos <= loadMoreWindow) {
        console.log('[LOAD] LEFT <---')

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
          timelineWrapperRef.current.scrollTo(scrollPosition + (intervalWidth * INTERVAL_BUFFER), 0)
        }
      }
    }

    if (scrollDirection === 'right') {
      const previousScrollRightPos = (scrollPosition + containerWidth + loadMoreWindow)
      const scrollRightPos = (scrollLeftPos + containerWidth + loadMoreWindow)

      if (previousScrollRightPos < scrollWidth && scrollRightPos >= scrollWidth) {
        console.log('[LOAD] RIGHT --->')

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
          timelineWrapperRef.current.scrollTo(
            scrollPosition - (intervalWidth * INTERVAL_BUFFER) - loadMoreWindow, 0
          )
        }
      }
    }

    setScrollPosition(scrollLeftPos)
  }, [timeIntervals, scrollPosition, scrollDirection])

  useLayoutEffect(() => {
    // Center the timeline on load
    timelineWrapperRef.current.scrollTo(centerPx, 0)

    // timelineWrapperRef.current.addEventListener('scroll', onWrapperScroll)

    // return (() => {
    //   timelineWrapperRef.removeEventListener('scroll', onWrapperScroll)
    // })
  }, [timelineWrapperRef])

  return (
    <>
      {
        show && (
          <div className="timeline">
            <section>
              <button
                type="button"
                disabled={zoomLevel === RESOLUTIONS.length - 1}
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
                disabled={zoomLevel === 0}
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
                className="timeline__list"
                style={{
                  width: `${listWidth}px`
                }}
              >
                {
                  timeIntervals.map((interval) => {
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
  show: true,
  onTemporalSet: null,
  onFocusedTemporalSet: null,
  onTimelineMove: null,
  minDate: 0,
  maxDate: new Date().getTime(),
  zoom: 3
}

EDSCTimeline.propTypes = {
  minDate: PropTypes.number, // minimum date timeline will allow scrolling
  maxDate: PropTypes.number, // maximum date timeline will allow scrolling
  resolution: PropTypes.string, // resolution of timeline day/month/etc.
  zoom: PropTypes.number,
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
  onTemporalSet: PropTypes.func,
  onFocusedTemporalSet: PropTypes.func,
  onTimelineMove: PropTypes.func
}

export default EDSCTimeline
