import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { FixedSizeList as List } from 'react-window'
import { startCase } from 'lodash'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'

import { calculateTimeIntervals } from './utils/calculateTimeIntervals'
import { determineIntervalLabel } from './utils/determineIntervalLabel'

import { RESOLUTIONS } from './constants'

import './index.scss'

export const TimelineList = ({
  autoSizerRef,
  height,
  isItemLoaded,
  onItemsRendered,
  timeIntervals,
  width,
  zoomLevel
}) => {
  const listRef = useRef(null)

  useEffect(() => {
    console.log('listRef useEffect', listRef)
    if (listRef.current) {
      listRef.current.scrollToItem(20, 'center')
    }
  }, [listRef.current])

  const TimeInterval = ({ index, style }) => {
    let content
    if (!isItemLoaded(index)) {
      content = 'Loading...'
    } else {
      content = determineIntervalLabel(timeIntervals, index, zoomLevel)
    }

    return (
      <div style={style}>
        {content}
      </div>
    )
  }

  return (
    <List
      ref={(list) => {
        autoSizerRef(list)
        listRef.current = list
      }}
      className="timeline__list"
      height={height}
      itemCount={1000}
      itemSize={100}
      layout="horizontal"
      width={width}
    >
      {TimeInterval}
    </List>
  )
}

export const EDSCTimeline = ({
  maxDate,
  minDate,
  show,
  zoom
}) => {
  const infiniteLoaderRef = useRef(null)

  const [zoomLevel, setZoomLevel] = useState(zoom)
  const [timeIntervals, setTimeIntervals] = useState(
    calculateTimeIntervals(minDate, maxDate, zoomLevel)
  )

  // Update the internal state when/if the prop changes
  useEffect(() => {
    setZoomLevel(zoom)
  }, [zoom])

  const onChangeZoomLevel = (newZoomLevel) => {
    if (newZoomLevel > -1 && zoomLevel <= RESOLUTIONS.length - 1) {
      setZoomLevel(newZoomLevel)
      setTimeIntervals(calculateTimeIntervals(minDate, maxDate, newZoomLevel))
    }
  }

  const hasNextPage = true
  const isNextPageLoading = timeIntervals.length === 0

  const isItemLoaded = (index) => !hasNextPage || index < timeIntervals.length

  const loadMoreItems = (startIndex, stopIndex) => {
    console.log('startIndex', startIndex)
    console.log('stopIndex', stopIndex)

    return isNextPageLoading ? () => { } : loadNextPage
  }

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
            <AutoSizer className="timeline__wrapper">
              {({ height, width }) => (
                <InfiniteLoader
                  ref={infiniteLoaderRef}
                  itemCount={1000}
                  isItemLoaded={isItemLoaded}
                  loadMoreItems={loadMoreItems}
                >
                  {
                    ({ onItemsRendered, ref }) => (
                      <TimelineList 
                        autoSizerRef={ref}
                        height={height}
                        isItemLoaded={isItemLoaded}
                        onItemsRendered={onItemsRendered}
                        timeIntervals={timeIntervals}
                        width={width}
                        zoomLevel={zoomLevel}
                      />
                    )
                  }
                </InfiniteLoader>
              )}
            </AutoSizer>
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
