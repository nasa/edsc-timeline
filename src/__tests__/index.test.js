import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'

import EDSCTimeline from '../index'
import { TimelineTools } from '../components/TimelineTools/TimelineTools'
import { TimelineList } from '../components/TimelineList/TimelineList'

import * as getPositionByTimestamp from '../utils/getPositionByTimestamp'
import * as determineScaledWidth from '../utils/determineScaledWidth'
import * as constants from '../constants'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    center: new Date('2021').getTime(),
    minZoom: 1,
    maxZoom: 5,
    zoom: 3,
    rows: [],
    onTemporalSet: jest.fn(),
    onFocusedSet: jest.fn(),
    onTimelineMove: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = mount(<EDSCTimeline {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

const windowEventMap = {}

beforeEach(() => {
  jest.clearAllMocks()

  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })
  window.removeEventListener = jest.fn()

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
})

afterEach(() => {
  window.requestAnimationFrame.mockRestore()
})

describe('EDSCTimeline component', () => {
  test('renders TimelineTools', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(TimelineTools).length).toBe(1)
    expect(enzymeWrapper.find(TimelineTools).props().maxZoom).toEqual(5)
    expect(enzymeWrapper.find(TimelineTools).props().minZoom).toEqual(1)
    expect(enzymeWrapper.find(TimelineTools).props().zoomLevel).toEqual(3)
  })

  test('renders TimelineList', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(TimelineList).length).toBe(1)
    expect(enzymeWrapper.find(TimelineList).props().zoomLevel).toEqual(3)
    expect(enzymeWrapper.find(TimelineList).props().timeIntervals).toEqual([
      1530403200000, 1533081600000, 1535760000000, 1538352000000,
      1541030400000, 1543622400000, 1546300800000, 1548979200000,
      1551398400000, 1554076800000, 1556668800000, 1559347200000,
      1561939200000, 1564617600000, 1567296000000, 1569888000000,
      1572566400000, 1575158400000, 1577836800000, 1580515200000,
      1583020800000, 1585699200000, 1588291200000, 1590969600000,
      1593561600000, 1596240000000, 1598918400000, 1601510400000,
      1604188800000, 1606780800000, 1609459200000, 1612137600000,
      1614556800000, 1617235200000, 1619827200000, 1622505600000,
      1625097600000, 1627776000000, 1630454400000, 1633046400000,
      1635724800000, 1638316800000, 1640995200000, 1643673600000,
      1646092800000, 1648771200000, 1651363200000, 1654041600000,
      1656633600000, 1659312000000, 1661990400000, 1664582400000,
      1667260800000, 1669852800000, 1672531200000, 1675209600000,
      1677628800000, 1680307200000, 1682899200000, 1685577600000,
      1688169600000
    ])
  })

  describe('onChangeZoomLevel', () => {
    test('does not zoom below the minZoom', () => {
      const { enzymeWrapper, props } = setup()

      const tools = enzymeWrapper.find(TimelineTools)

      tools.invoke('onChangeZoomLevel')(0)

      expect(props.onTimelineMove).toHaveBeenCalledTimes(0)
    })

    test('does not zoom above the maxZoom', () => {
      const { enzymeWrapper, props } = setup()

      const tools = enzymeWrapper.find(TimelineTools)

      tools.invoke('onChangeZoomLevel')(9)

      expect(props.onTimelineMove).toHaveBeenCalledTimes(0)
    })

    // This test shows that zooming does not change the center point, but the center point (and intervals)
    // tested are non what we expect because the timelineWrapperRef doesn't play nice in jest/enzyme.
    // Ideally both values used as `center` in the onTimelineMove check should be `new Date('2021').getTime()`
    // because that matches the `center` prop used in setup
    test('calls onTimelineMove', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2073.0753424657532)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 5255.564383561644)

      const { enzymeWrapper, props } = setup()

      const tools = enzymeWrapper.find(TimelineTools)

      tools.invoke('onChangeZoomLevel')(2)

      expect(props.onTimelineMove).toHaveBeenCalledTimes(3)
      expect(props.onTimelineMove.mock.calls).toEqual([
        [{ center: 1530403200000, interval: 3 }],
        [{ center: 1593691200000, interval: 3 }],
        [{ center: 1593691200000, interval: 2 }]
      ])
      expect(enzymeWrapper.find(TimelineList).props().zoomLevel).toEqual(2)

      // New intervals get passed into TimelineList
      expect(enzymeWrapper.find(TimelineList).props().timeIntervals).toEqual([
        1591056000000, 1591142400000, 1591228800000, 1591315200000,
        1591401600000, 1591488000000, 1591574400000, 1591660800000,
        1591747200000, 1591833600000, 1591920000000, 1592006400000,
        1592092800000, 1592179200000, 1592265600000, 1592352000000,
        1592438400000, 1592524800000, 1592611200000, 1592697600000,
        1592784000000, 1592870400000, 1592956800000, 1593043200000,
        1593129600000, 1593216000000, 1593302400000, 1593388800000,
        1593475200000, 1593561600000, 1593648000000, 1593734400000,
        1593820800000, 1593907200000, 1593993600000, 1594080000000,
        1594166400000, 1594252800000, 1594339200000, 1594425600000,
        1594512000000, 1594598400000, 1594684800000, 1594771200000,
        1594857600000, 1594944000000, 1595030400000, 1595116800000,
        1595203200000, 1595289600000, 1595376000000, 1595462400000,
        1595548800000, 1595635200000, 1595721600000, 1595808000000,
        1595894400000, 1595980800000, 1596067200000, 1596153600000,
        1596240000000
      ])
    })
  })

  describe('onTimelineDrag', () => {
    describe('when dragging backwards', () => {
      test('new intervals and position are passed to TimelineList', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))

        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        list.invoke('onTimelineMouseDown')({
          pageX: 500
        })

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 2250
          })
        })
        // Drag the mouse again
        act(() => {
          windowEventMap.mousemove({
            pageX: 2251
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup()
        })

        enzymeWrapper.update()

        expect(props.onTimelineMove).toHaveBeenCalledTimes(4)
        expect(props.onTimelineMove.mock.calls).toEqual([
          [{ center: 1530403200000, interval: 3 }],
          [{ center: 1610625600000, interval: 3 }],
          [{ center: 1634692320000, interval: 3 }],
          [{ center: 1564497720000, interval: 3 }]
        ])

        expect(enzymeWrapper.find(TimelineList).props().timelinePosition).toEqual({
          left: -4250,
          top: 0
        })
        expect(enzymeWrapper.find(TimelineList).props().timeIntervals).toEqual([
          1451606400000, 1454284800000, 1456790400000, 1459468800000,
          1462060800000, 1464739200000, 1467331200000, 1470009600000,
          1472688000000, 1475280000000, 1477958400000, 1480550400000,
          1483228800000, 1485907200000, 1488326400000, 1491004800000,
          1493596800000, 1496275200000, 1498867200000, 1501545600000,
          1504224000000, 1506816000000, 1509494400000, 1512086400000,
          1514764800000, 1517443200000, 1519862400000, 1522540800000,
          1525132800000, 1527811200000, 1530403200000, 1533081600000,
          1535760000000, 1538352000000, 1541030400000, 1543622400000,
          1546300800000, 1548979200000, 1551398400000, 1554076800000,
          1556668800000, 1559347200000, 1561939200000, 1564617600000,
          1567296000000, 1569888000000, 1572566400000, 1575158400000,
          1577836800000, 1580515200000, 1583020800000, 1585699200000,
          1588291200000, 1590969600000, 1593561600000, 1596240000000,
          1598918400000, 1601510400000, 1604188800000, 1606780800000,
          1609459200000, 1612137600000, 1614556800000, 1617235200000,
          1619827200000, 1622505600000, 1625097600000, 1627776000000,
          1630454400000, 1633046400000, 1635724800000, 1638316800000,
          1640995200000, 1643673600000, 1646092800000, 1648771200000,
          1651363200000, 1654041600000, 1656633600000, 1659312000000,
          1661990400000, 1664582400000, 1667260800000, 1669852800000,
          1672531200000, 1675209600000, 1677628800000, 1680307200000,
          1682899200000, 1685577600000, 1688169600000
        ])
      })

      test('trims the intervals after they exceed MAX_INTERVAL_BUFFER', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))
        constants.MAX_INTERVAL_BUFFER = constants.INTERVAL_BUFFER * 3

        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        list.invoke('onTimelineMouseDown')({
          pageX: 500
        })

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 2250
          })
        })
        // Drag the mouse again
        act(() => {
          windowEventMap.mousemove({
            pageX: 2251
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup()
        })

        enzymeWrapper.update()

        // Clicks on the timeline
        list.invoke('onTimelineMouseDown')({
          pageX: 500
        })

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 2250
          })
        })
        // Drag the mouse again
        act(() => {
          windowEventMap.mousemove({
            pageX: 2251
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup()
        })

        enzymeWrapper.update()

        expect(props.onTimelineMove).toHaveBeenCalledTimes(6)
        expect(props.onTimelineMove.mock.calls).toEqual([
          [{ center: 1530403200000, interval: 3 }],
          [{ center: 1610625600000, interval: 3 }],
          [{ center: 1634692320000, interval: 3 }],
          [{ center: 1564497720000, interval: 3 }],
          [{ center: 1741686840000, interval: 3 }],
          [{ center: 1502445240000, interval: 3 }]
        ])

        expect(enzymeWrapper.find(TimelineList).props().timelinePosition).toEqual({
          left: -4250,
          top: 0
        })
        expect(enzymeWrapper.find(TimelineList).props().timeIntervals).toEqual([
          1372636800000, 1375315200000, 1377993600000, 1380585600000,
          1383264000000, 1385856000000, 1388534400000, 1391212800000,
          1393632000000, 1396310400000, 1398902400000, 1401580800000,
          1404172800000, 1406851200000, 1409529600000, 1412121600000,
          1414800000000, 1417392000000, 1420070400000, 1422748800000,
          1425168000000, 1427846400000, 1430438400000, 1433116800000,
          1435708800000, 1438387200000, 1441065600000, 1443657600000,
          1446336000000, 1448928000000, 1451606400000, 1454284800000,
          1456790400000, 1459468800000, 1462060800000, 1464739200000,
          1467331200000, 1470009600000, 1472688000000, 1475280000000,
          1477958400000, 1480550400000, 1483228800000, 1485907200000,
          1488326400000, 1491004800000, 1493596800000, 1496275200000,
          1498867200000, 1501545600000, 1504224000000, 1506816000000,
          1509494400000, 1512086400000, 1514764800000, 1517443200000,
          1519862400000, 1522540800000, 1525132800000, 1527811200000,
          1530403200000, 1533081600000, 1535760000000, 1538352000000,
          1541030400000, 1543622400000, 1546300800000, 1548979200000,
          1551398400000, 1554076800000, 1556668800000, 1559347200000,
          1561939200000, 1564617600000, 1567296000000, 1569888000000,
          1572566400000, 1575158400000, 1577836800000, 1580515200000,
          1583020800000, 1585699200000, 1588291200000, 1590969600000,
          1593561600000, 1596240000000, 1598918400000, 1601510400000,
          1604188800000, 1606780800000, 1609459200000
        ])
      })
    })

    describe('when dragging forwards', () => {
      test('new intervals and position are passed to TimelineList', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))
        const getListBoundingClientRectMock = jest.fn(() => ({ width: 4000 }))

        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        list.invoke('onTimelineMouseDown')({
          pageX: 500
        })

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 0
          })
        })
        // Drag the mouse again
        act(() => {
          windowEventMap.mousemove({
            pageX: -1
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup()
        })

        enzymeWrapper.update()

        expect(props.onTimelineMove).toHaveBeenCalledTimes(4)
        expect(props.onTimelineMove.mock.calls).toEqual([
          [{ center: 1530403200000, interval: 3 }],
          [{ center: 1610625600000, interval: 3 }],
          [{ center: 1634692320000, interval: 3 }],
          [{ center: 1654747920000, interval: 3 }]
        ])

        expect(enzymeWrapper.find(TimelineList).props().timelinePosition).toEqual({
          left: -2501,
          top: 0
        })
        expect(enzymeWrapper.find(TimelineList).props().timeIntervals).toEqual([
          1530403200000, 1533081600000, 1535760000000, 1538352000000,
          1541030400000, 1543622400000, 1546300800000, 1548979200000,
          1551398400000, 1554076800000, 1556668800000, 1559347200000,
          1561939200000, 1564617600000, 1567296000000, 1569888000000,
          1572566400000, 1575158400000, 1577836800000, 1580515200000,
          1583020800000, 1585699200000, 1588291200000, 1590969600000,
          1593561600000, 1596240000000, 1598918400000, 1601510400000,
          1604188800000, 1606780800000, 1609459200000, 1612137600000,
          1614556800000, 1617235200000, 1619827200000, 1622505600000,
          1625097600000, 1627776000000, 1630454400000, 1633046400000,
          1635724800000, 1638316800000, 1640995200000, 1643673600000,
          1646092800000, 1648771200000, 1651363200000, 1654041600000,
          1656633600000, 1659312000000, 1661990400000, 1664582400000,
          1667260800000, 1669852800000, 1672531200000, 1675209600000,
          1677628800000, 1680307200000, 1682899200000, 1685577600000,
          1688169600000, 1690848000000, 1693526400000, 1696118400000,
          1698796800000, 1701388800000, 1704067200000, 1706745600000,
          1709251200000, 1711929600000, 1714521600000, 1717200000000,
          1719792000000, 1722470400000, 1725148800000, 1727740800000,
          1730419200000, 1733011200000, 1735689600000, 1738368000000,
          1740787200000, 1743465600000, 1746057600000, 1748736000000,
          1751328000000, 1754006400000, 1756684800000, 1759276800000,
          1761955200000, 1764547200000, 1767225600000
        ])
      })

      test('trims the intervals after they exceed MAX_INTERVAL_BUFFER', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))
        const getListBoundingClientRectMock = jest.fn(() => ({ width: 4000 }))
        constants.MAX_INTERVAL_BUFFER = constants.INTERVAL_BUFFER * 3

        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        list.invoke('onTimelineMouseDown')({
          pageX: 500
        })

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 0
          })
        })
        // Drag the mouse again
        act(() => {
          windowEventMap.mousemove({
            pageX: -1
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup()
        })

        enzymeWrapper.update()

        // Clicks on the timeline
        list.invoke('onTimelineMouseDown')({
          pageX: 500
        })

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 0
          })
        })
        // Drag the mouse again
        act(() => {
          windowEventMap.mousemove({
            pageX: -1
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup()
        })

        enzymeWrapper.update()

        expect(props.onTimelineMove).toHaveBeenCalledTimes(6)
        expect(props.onTimelineMove.mock.calls).toEqual([
          [{ center: 1530403200000, interval: 3 }],
          [{ center: 1610625600000, interval: 3 }],
          [{ center: 1634692320000, interval: 3 }],
          [{ center: 1654747920000, interval: 3 }],
          [{ center: 1716076195200, interval: 3 }],
          [{ center: 1555689650400, interval: 3 }]
        ])

        expect(enzymeWrapper.find(TimelineList).props().timelinePosition).toEqual({
          left: 1499,
          top: 0
        })
        expect(enzymeWrapper.find(TimelineList).props().timeIntervals).toEqual([
          1609459200000, 1612137600000, 1614556800000, 1617235200000,
          1619827200000, 1622505600000, 1625097600000, 1627776000000,
          1630454400000, 1633046400000, 1635724800000, 1638316800000,
          1640995200000, 1643673600000, 1646092800000, 1648771200000,
          1651363200000, 1654041600000, 1656633600000, 1659312000000,
          1661990400000, 1664582400000, 1667260800000, 1669852800000,
          1672531200000, 1675209600000, 1677628800000, 1680307200000,
          1682899200000, 1685577600000, 1688169600000, 1690848000000,
          1693526400000, 1696118400000, 1698796800000, 1701388800000,
          1704067200000, 1706745600000, 1709251200000, 1711929600000,
          1714521600000, 1717200000000, 1719792000000, 1722470400000,
          1725148800000, 1727740800000, 1730419200000, 1733011200000,
          1735689600000, 1738368000000, 1740787200000, 1743465600000,
          1746057600000, 1748736000000, 1751328000000, 1754006400000,
          1756684800000, 1759276800000, 1761955200000, 1764547200000,
          1767225600000, 1769904000000, 1772323200000, 1775001600000,
          1777593600000, 1780272000000, 1782864000000, 1785542400000,
          1788220800000, 1790812800000, 1793491200000, 1796083200000,
          1798761600000, 1801440000000, 1803859200000, 1806537600000,
          1809129600000, 1811808000000, 1814400000000, 1817078400000,
          1819756800000, 1822348800000, 1825027200000, 1827619200000,
          1830297600000, 1832976000000, 1835481600000, 1838160000000,
          1840752000000, 1843430400000, 1846022400000
        ])
      })
    })
  })

  describe('Temporal Range', () => {
    test('loading with temporalRange set renders markers on the list', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper } = setup({
        temporalRange: {
          end: 1630681200000,
          start: 1626670080000
        }
      })

      enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1630681200000,
        start: 1626670080000
      })
    })

    test('changing the temporalRange props renders the new range on the list', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper } = setup({
        temporalRange: {
          end: 1630681200000,
          start: 1626670080000
        }
      })

      enzymeWrapper.setProps({
        temporalRange: {
          end: 2630681200000,
          start: 2626670080000
        }
      })

      enzymeWrapper.update()

      enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 2630681200000,
        start: 2626670080000
      })
    })

    test('dragging a temporal range saves temporalRange and calls onTemporalSet', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      list.invoke('onTimelineMouseDown')({
        pageX: 500,
        pageY: 63
      })

      // Drags the mouse
      act(() => {
        windowEventMap.mousemove({
          pageX: 600
        })
      })
      // Let go of the mouse button
      act(() => {
        windowEventMap.mouseup({
          pageX: 600
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1634692320000,
        start: 1630681200000
      })

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith({
        end: 1634692320000,
        start: 1630681200000
      })
    })

    test('dragging a temporal range in reverse saves temporalRange and calls onTemporalSet', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      list.invoke('onTimelineMouseDown')({
        pageX: 500,
        pageY: 63
      })

      // Drags the mouse
      act(() => {
        windowEventMap.mousemove({
          pageX: 400
        })
      })
      // Let go of the mouse button
      act(() => {
        windowEventMap.mouseup({
          pageX: 400
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1630681200000,
        start: 1626670080000
      })

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith({
        end: 1630681200000,
        start: 1626670080000
      })
    })

    test('clicking in the temporal range zone clears existing temporal range and calls on TemporalSet', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper, props } = setup({
        temporalRange: {
          end: 1630681200000,
          start: 1626670080000
        }
      })

      enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      list.invoke('onTimelineMouseDown')({
        pageX: 500,
        pageY: 63
      })

      // Let go of the mouse button
      act(() => {
        windowEventMap.mouseup({
          pageX: 500
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({})

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith({})
    })
  })

  describe('onTimelineMouseMove', () => {
    describe('when hovering outside the temporal range selection area', () => {
      test('does not display the indicator', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectWrapperMock = jest.fn(() => ({
          top: 50
        }))

        const getBoundingClientRectListMock = jest.fn(() => ({
          x: 400
        }))

        const { enzymeWrapper } = setup()

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectWrapperMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectListMock

        const list = enzymeWrapper.find(TimelineList)

        // Mousemove on the timeline
        list.invoke('onTimelineMouseMove')({
          pageY: 100,
          pageX: 500
        })

        const updatedList = enzymeWrapper.find(TimelineList)

        enzymeWrapper.update()

        expect(updatedList.props().temporalRangeMouseOverPosition).toEqual(null)
      })
    })

    describe('when hovering over the temporal range selection area', () => {
      test('displays the indicator in the correct position', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectWrapperMock = jest.fn(() => ({
          top: 50
        }))

        const getBoundingClientRectListMock = jest.fn(() => ({
          x: 400
        }))

        const { enzymeWrapper } = setup()

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectWrapperMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectListMock

        const list = enzymeWrapper.find(TimelineList)

        // Mousemove on the timeline
        list.invoke('onTimelineMouseMove')({
          pageY: 55,
          pageX: 500
        })

        const updatedList = enzymeWrapper.find(TimelineList)

        enzymeWrapper.update()

        expect(updatedList.props().temporalRangeMouseOverPosition).toEqual(100)
      })
    })
  })

  describe('dragging temporal markers', () => {
    test('dragging the start marker changes the temporal range', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper, props } = setup({
        temporalRange: {
          end: 1634692320000,
          start: 1630681200000
        }
      })

      enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      list.invoke('onTemporalMarkerMouseDown')({
        pageX: 500,
        pageY: 63,
        stopPropagation: jest.fn()
      }, 'start')

      // Drags the mouse
      act(() => {
        windowEventMap.mousemove({
          pageX: 400
        })
      })
      // Let go of the mouse button
      act(() => {
        windowEventMap.mouseup({
          pageX: 400
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1634692320000,
        start: 1626670080000
      })

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith({
        end: 1634692320000,
        start: 1626670080000
      })
    })

    test('dragging the end marker changes the temporal range', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper, props } = setup({
        temporalRange: {
          end: 1634692320000,
          start: 1630681200000
        }
      })

      enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      list.invoke('onTemporalMarkerMouseDown')({
        pageX: 600,
        pageY: 63,
        stopPropagation: jest.fn()
      }, 'end')

      // Drags the mouse
      act(() => {
        windowEventMap.mousemove({
          pageX: 700
        })
      })
      // Let go of the mouse button
      act(() => {
        windowEventMap.mouseup({
          pageX: 700
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1638703440000,
        start: 1630681200000
      })

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith({
        end: 1638703440000,
        start: 1630681200000
      })
    })

    describe('when there is only one temporal marker', () => {
      test('dragging the start marker changes the temporal range', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          top: 56,
          width: 1200
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -2000
        }))

        const { enzymeWrapper, props } = setup({
          temporalRange: {
            start: 1630681200000
          }
        })

        enzymeWrapper.find('.timeline__wrapper').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        list.invoke('onTemporalMarkerMouseDown')({
          pageX: 500,
          pageY: 63,
          stopPropagation: jest.fn()
        }, 'start')

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 400
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup({
            pageX: 400
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
          start: 1626670080000
        })

        expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
        expect(props.onTemporalSet).toHaveBeenCalledWith({
          start: 1626670080000
        })
      })

      test('dragging the end marker changes the temporal range', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          top: 56,
          width: 1200
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -2000
        }))

        const { enzymeWrapper, props } = setup({
          temporalRange: {
            end: 1634692320000
          }
        })

        enzymeWrapper.find('.timeline__wrapper').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        list.invoke('onTemporalMarkerMouseDown')({
          pageX: 600,
          pageY: 63,
          stopPropagation: jest.fn()
        }, 'end')

        // Drags the mouse
        act(() => {
          windowEventMap.mousemove({
            pageX: 700
          })
        })
        // Let go of the mouse button
        act(() => {
          windowEventMap.mouseup({
            pageX: 700
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
          end: 1638703440000
        })

        expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
        expect(props.onTemporalSet).toHaveBeenCalledWith({
          end: 1638703440000
        })
      })
    })
  })

  describe('Focused intervals', () => {
    describe('onFocusedClick', () => {
      test('sets the focusedInterval', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          width: 1200,
          top: 80,
          height: 68.375
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -1848.62451171875
        }))

        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        list.invoke('onFocusedClick')({
          pageY: 133,
          pageX: 616
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          end: 1630454399999,
          start: 1627776000000
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith({
          end: 1630454399999,
          start: 1627776000000
        })
      })

      test('removes the focusedInterval', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          width: 1200,
          top: 80,
          height: 68.375
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -1848.62451171875
        }))

        const { enzymeWrapper, props } = setup({
          focusedInterval: {
            end: 1630454399999,
            start: 1627776000000
          }
        })

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        list.invoke('onFocusedClick')({
          pageY: 133,
          pageX: 616
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({})
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith({})
      })

      test('does not set the focusedInterval outside of the temporalRange', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          width: 1200,
          top: 80,
          height: 68.375
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -1848.62451171875
        }))

        const { enzymeWrapper, props } = setup({
          temporalRange: {
            start: new Date('2021-02-03').getTime(),
            end: new Date('2021-05').getTime()
          }
        })

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Click after the end of temporalRange
        list.invoke('onFocusedClick')({
          pageY: 133,
          pageX: 616
        })

        // Click before the start of temporalRange
        list.invoke('onFocusedClick')({
          pageY: 133,
          pageX: 100
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({})
        expect(props.onFocusedSet).toHaveBeenCalledTimes(0)
      })
    })

    describe('onChangeFocusedInterval', () => {
      test('does not change the focusedInterval if there is no focusedInterval', () => {
        const { enzymeWrapper, props } = setup()

        act(() => {
          windowEventMap.keydown({
            key: 'ArrowLeft'
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({})
        expect(props.onFocusedSet).toHaveBeenCalledTimes(0)
      })

      test('does not change the focusedInterval if the temporalStart is within the focusedInterval', () => {
        const { enzymeWrapper, props } = setup({
          focusedInterval: {
            start: new Date('2021-02').getTime(),
            end: new Date('2021-03').getTime()
          },
          temporalRange: {
            start: new Date('2021-02-03').getTime(),
            end: new Date('2021-05').getTime()
          }
        })

        act(() => {
          windowEventMap.keydown({
            key: 'ArrowLeft'
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(0)
      })

      test('does not change the focusedInterval if the temporalEnd is within the focusedInterval', () => {
        const { enzymeWrapper, props } = setup({
          focusedInterval: {
            start: new Date('2021-02').getTime(),
            end: new Date('2021-03').getTime()
          },
          temporalRange: {
            start: new Date('2021-01').getTime(),
            end: new Date('2021-02-15').getTime()
          }
        })

        act(() => {
          windowEventMap.keydown({
            key: 'ArrowRight'
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(0)
      })

      test('changes the focusedInterval with left arrow keypress', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          width: 1200,
          top: 80,
          height: 68.375
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -1848.62451171875
        }))

        const { enzymeWrapper, props } = setup({
          focusedInterval: {
            end: 1630454399999,
            start: 1627776000000
          }
        })

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        act(() => {
          windowEventMap.keydown({
            key: 'ArrowLeft'
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          end: 1627775999999,
          start: 1625097600000
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith({
          end: 1627775999999,
          start: 1625097600000
        })
      })

      test('changes the focusedInterval with right arrow keypress', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          width: 1200,
          top: 80,
          height: 68.375
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -1848.62451171875
        }))

        const { enzymeWrapper, props } = setup({
          focusedInterval: {
            end: 1630454399999,
            start: 1627776000000
          }
        })

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        act(() => {
          windowEventMap.keydown({
            key: 'ArrowRight'
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          end: 1633046399999,
          start: 1630454400000
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith({
          end: 1633046399999,
          start: 1630454400000
        })
      })

      test('changes the focusedInterval with TimelineTools', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
        const getBoundingClientRectMock = jest.fn(() => ({
          width: 1200,
          top: 80,
          height: 68.375
        }))
        const getListBoundingClientRectMock = jest.fn(() => ({
          width: 4000,
          x: -1848.62451171875
        }))

        const { enzymeWrapper, props } = setup({
          focusedInterval: {
            end: 1630454399999,
            start: 1627776000000
          }
        })

        enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        enzymeWrapper.find(TimelineTools).invoke('onChangeFocusedInterval')('next')

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          end: 1633046399999,
          start: 1630454400000
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith({
          end: 1633046399999,
          start: 1630454400000
        })
      })

      describe('loading more intervals', () => {
        test('loads more intervals when changing the focusedInterval backwards', () => {
          jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
          jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
          constants.MAX_INTERVAL_BUFFER = constants.INTERVAL_BUFFER * 3
          const getBoundingClientRectMock = jest.fn(() => ({
            width: 1200,
            top: 80,
            height: 68.375
          }))
          const getListBoundingClientRectMock = jest.fn(() => ({
            width: 4000,
            x: -1848.62451171875
          }))

          const { enzymeWrapper, props } = setup({
            focusedInterval: {
              end: new Date('2021-03').getTime(),
              start: new Date('2021-02').getTime()
            }
          })

          enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
          enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock
          expect(enzymeWrapper.find(TimelineList).props().timeIntervals.length).toEqual(61)

          // Click the array 21 times to load more intervals
          Array.from(Array(21)).forEach(() => {
            act(() => {
              windowEventMap.keydown({
                key: 'ArrowLeft'
              })
            })
          })

          enzymeWrapper.update()

          expect(enzymeWrapper.find(TimelineList).props().timeIntervals.length).toEqual(91)

          expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
            end: new Date('2019-05-31T23:59:59.999Z').getTime(),
            start: new Date('2019-05-01').getTime()
          })

          expect(props.onFocusedSet).toHaveBeenCalledTimes(21)
          expect(props.onTimelineMove).toHaveBeenCalledTimes(22)
        })

        test('loads more intervals when changing the focusedInterval forwards', () => {
          jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
          jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
          constants.MAX_INTERVAL_BUFFER = constants.INTERVAL_BUFFER * 3
          const getBoundingClientRectMock = jest.fn(() => ({
            width: 1200,
            top: 80,
            height: 68.375
          }))
          const getListBoundingClientRectMock = jest.fn(() => ({
            width: 4000,
            x: -1848.62451171875
          }))

          const { enzymeWrapper, props } = setup({
            focusedInterval: {
              end: new Date('2021-03').getTime(),
              start: new Date('2021-02').getTime()
            }
          })

          enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
          enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock
          expect(enzymeWrapper.find(TimelineList).props().timeIntervals.length).toEqual(61)

          // Click the array 22 times to load more intervals
          Array.from(Array(22)).forEach(() => {
            act(() => {
              windowEventMap.keydown({
                key: 'ArrowRight'
              })
            })
          })

          enzymeWrapper.update()

          expect(enzymeWrapper.find(TimelineList).props().timeIntervals.length).toEqual(91)

          expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
            end: new Date('2022-12-31T23:59:59.999Z').getTime(),
            start: new Date('2022-12-01').getTime()
          })

          expect(props.onFocusedSet).toHaveBeenCalledTimes(22)
          expect(props.onTimelineMove).toHaveBeenCalledTimes(24)
        })

        test('loads more intervals when changing the focusedInterval forwards and removes extra intervals', () => {
          jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
          jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 4000)
          constants.MAX_INTERVAL_BUFFER = constants.INTERVAL_BUFFER * 3
          const getBoundingClientRectMock = jest.fn(() => ({
            width: 1200,
            top: 80,
            height: 68.375
          }))
          const getListBoundingClientRectMock = jest.fn(() => ({
            width: 4000,
            x: -1848.62451171875
          }))

          const { enzymeWrapper, props } = setup({
            focusedInterval: {
              end: new Date('2021-03').getTime(),
              start: new Date('2021-02').getTime()
            }
          })

          enzymeWrapper.find('.timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
          enzymeWrapper.find('.timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock
          expect(enzymeWrapper.find(TimelineList).props().timeIntervals.length).toEqual(61)

          // Click the array 52 times to load more intervals
          Array.from(Array(52)).forEach(() => {
            act(() => {
              windowEventMap.keydown({
                key: 'ArrowRight'
              })
            })
          })

          enzymeWrapper.update()

          expect(enzymeWrapper.find(TimelineList).props().timeIntervals.length).toEqual(91)

          expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
            end: new Date('2025-06-30T23:59:59.999Z').getTime(),
            start: new Date('2025-06-01').getTime()
          })

          expect(props.onFocusedSet).toHaveBeenCalledTimes(52)
          expect(props.onTimelineMove).toHaveBeenCalledTimes(53)
        })
      })
    })
  })
})
