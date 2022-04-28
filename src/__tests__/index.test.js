/* eslint-disable no-import-assign */

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'

import EDSCTimeline from '../index'
import { TimelinePrimarySection } from '../components/TimelinePrimarySection/TimelinePrimarySection'
import { TimelineTools } from '../components/TimelineTools/TimelineTools'
import { TimelineList } from '../components/TimelineList/TimelineList'

import * as getPositionByTimestamp from '../utils/getPositionByTimestamp'
import * as determineScaledWidth from '../utils/determineScaledWidth'
import * as constants from '../constants'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    center: new Date('2021').getTime(),
    data: [],
    minZoom: 1,
    maxZoom: 5,
    zoom: 3,
    rows: [],
    onTemporalSet: jest.fn(),
    onFocusedSet: jest.fn(),
    onTimelineMove: jest.fn(),
    onTimelineMoveEnd: jest.fn(),
    ...overrideProps
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
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
  document.elementsFromPoint = jest.fn()

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
})

afterEach(() => {
  window.requestAnimationFrame.mockRestore()
  document.elementsFromPoint.mockRestore()
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
      expect(props.onTimelineMoveEnd).toHaveBeenCalledTimes(0)
    })

    test('does not zoom above the maxZoom', () => {
      const { enzymeWrapper, props } = setup()

      const tools = enzymeWrapper.find(TimelineTools)

      tools.invoke('onChangeZoomLevel')(9)

      expect(props.onTimelineMove).toHaveBeenCalledTimes(0)
      expect(props.onTimelineMoveEnd).toHaveBeenCalledTimes(0)
    })
  })

  describe('onTimelineDrag', () => {
    describe('when dragging backwards', () => {
      test('new intervals are passed to TimelineList', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))

        const { enzymeWrapper } = setup()

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList).find('.edsc-timeline-list')

        // Clicks on the timeline
        act(() => {
          list.simulate('pointerdown', {
            pointerId: 1,
            clientX: 500
          })
        })

        // Drag the mouse again
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: 2251
          })
        })
        // Let go of the mouse button
        act(() => {
          list.simulate('pointerup', { pointerId: 1 })
        })

        enzymeWrapper.update()

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
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))
        constants.MAX_INTERVAL_BUFFER = constants.INTERVAL_BUFFER * 3

        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList).find('.edsc-timeline-list')

        // Clicks on the timeline
        act(() => {
          list.simulate('pointerdown', {
            pointerId: 1,
            clientX: 500
          })
        })

        // Drag the mouse again
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: 2251
          })
        })

        // Let go of the mouse button
        act(() => {
          list.simulate('pointerup', { pointerId: 1 })
        })

        enzymeWrapper.update()

        act(() => {
          list.simulate('pointerdown', {
            pointerId: 1,
            clientX: 500
          })
        })

        // Drag the mouse again
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: 5000
          })
        })
        // Let go of the mouse button
        act(() => {
          list.simulate('pointerup', { pointerId: 1 })
        })

        enzymeWrapper.update()

        expect(props.onTimelineMove).toHaveBeenCalledTimes(3)
        expect(props.onTimelineMoveEnd).toHaveBeenCalledTimes(1)

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
      test('new intervals are passed to TimelineList', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))
        const getListBoundingClientRectMock = jest.fn(() => ({ width: 4000 }))

        const { enzymeWrapper } = setup()

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        act(() => {
          list.simulate('pointerdown', {
            pointerId: 1,
            clientX: 500
          })
        })

        // Drag the mouse again
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: -1
          })
        })

        // Let go of the mouse button
        act(() => {
          list.simulate('pointerup', { pointerId: 1 })
        })

        enzymeWrapper.update()

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
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
        const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))
        const getListBoundingClientRectMock = jest.fn()
          .mockReturnValueOnce({ width: 4000 })
          .mockReturnValueOnce({ width: 6500 })
        constants.MAX_INTERVAL_BUFFER = constants.INTERVAL_BUFFER * 3

        const { enzymeWrapper } = setup()

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        const list = enzymeWrapper.find(TimelineList)

        // Clicks on the timeline
        act(() => {
          list.simulate('pointerdown', {
            pointerId: 1,
            clientX: 500
          })
        })

        // Drag the mouse again
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: -1
          })
        })

        // Let go of the mouse button
        act(() => {
          list.simulate('pointerup', { pointerId: 1 })
        })

        enzymeWrapper.update()

        // Clicks on the timeline
        act(() => {
          list.simulate('pointerdown', {
            pointerId: 1,
            clientX: 500
          })
        })

        // Drag the mouse again
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: -2001
          })
        })

        // Let go of the mouse button
        act(() => {
          list.simulate('pointerup', { pointerId: 1 })
        })

        enzymeWrapper.update()

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
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1630681200000,
        start: 1626670080000
      })
    })

    test('changing the temporalRange props renders the new range on the list', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 2630681200000,
        start: 2626670080000
      })
    })

    test('dragging a temporal range saves temporalRange and calls onTemporalSet', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      act(() => {
        list.simulate('pointerdown', {
          pointerId: 1,
          clientX: 500,
          clientY: 63
        })
      })

      // Drag the mouse again
      act(() => {
        list.simulate('pointermove', {
          pointerId: 1,
          clientX: 603,
          clientY: 63
        })
      })

      // Let go of the mouse button
      act(() => {
        list.simulate('pointerup', { pointerId: 1 })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1697265792000,
        start: 1690848000000
      })

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith(expect.objectContaining({
        temporalEnd: 1697265792000,
        temporalStart: 1690848000000
      }))
    })

    test('dragging a temporal range in reverse saves temporalRange and calls onTemporalSet', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
      const getBoundingClientRectMock = jest.fn(() => ({
        top: 56,
        width: 1200
      }))
      const getListBoundingClientRectMock = jest.fn(() => ({
        width: 4000,
        x: -2000
      }))

      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      act(() => {
        list.simulate('pointerdown', {
          pointerId: 1,
          clientX: 500,
          clientY: 63
        })
      })

      // Drag the mouse again
      act(() => {
        list.simulate('pointermove', {
          pointerId: 1,
          clientX: 397,
          clientY: 63
        })
      })

      // Let go of the mouse button
      act(() => {
        list.simulate('pointerup', { pointerId: 1 })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({
        end: 1690848000000,
        start: 1684430208000
      })

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith(expect.objectContaining({
        temporalEnd: 1690848000000,
        temporalStart: 1684430208000
      }))
    })

    test('when onTemporalSet is not defined, clicking in the temporal range zone clears existing temporal range and does not call on TemporalSet', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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
        },
        onTemporalSet: null
      })

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      act(() => {
        list.simulate('pointerdown', {
          pointerId: 1,
          clientX: 500,
          clientY: 63
        })
      })

      // Let go of the mouse button
      act(() => {
        list.simulate('pointerup', { pointerId: 1 })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({})

      expect(props.onTemporalSet).toEqual(null)
    })

    test('clicking in the temporal range zone clears existing temporal range and calls on TemporalSet', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      act(() => {
        list.simulate('pointerdown', {
          pointerId: 1,
          clientX: 500,
          clientY: 63
        })
      })

      // Let go of the mouse button
      act(() => {
        list.simulate('pointerup', { pointerId: 1 })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRange).toEqual({})

      expect(props.onTemporalSet).toHaveBeenCalledTimes(1)
      expect(props.onTemporalSet).toHaveBeenCalledWith(expect.objectContaining({
        temporalEnd: undefined,
        temporalStart: undefined
      }))
    })

    test('hovering the start marker displays the tooltip', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const startMarker = enzymeWrapper.find('.edsc-timeline-list__temporal-start')

      startMarker.simulate('pointerenter', {
        pointerId: 1
      })

      expect(enzymeWrapper.find('.edsc-timeline__tooltip').at(0).childAt(0).text()).toEqual('19 Jul 2021 04:48:00')
    })

    test('hovering the start marker displays the tooltip', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const endMarker = enzymeWrapper.find('.edsc-timeline-list__temporal-end')

      endMarker.simulate('pointerenter', {
        pointerId: 1
      })

      expect(enzymeWrapper.find('.edsc-timeline__tooltip').at(0).childAt(0).text()).toEqual('03 Sep 2021 15:00:00')
    })

    test('mousing out hides the tooltip', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

      const endMarker = enzymeWrapper.find('.edsc-timeline-list__temporal-end')

      endMarker.simulate('pointerenter', {
        pointerId: 1
      })

      endMarker.simulate('pointerleave', {
        pointerId: 1
      })

      expect(enzymeWrapper.find('.edsc-timeline__tooltip').at(0).childAt(0).text()).toEqual('')
    })
  })

  describe('onTimelineMouseMove', () => {
    describe('when hovering outside the temporal range selection area', () => {
      test('does not display the indicator', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
        const getBoundingClientRectWrapperMock = jest.fn(() => ({
          top: 50,
          width: 1000
        }))

        const getBoundingClientRectListMock = jest.fn(() => ({
          x: 400
        }))

        const { enzymeWrapper } = setup()

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectWrapperMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectListMock

        const list = enzymeWrapper.find(TimelineList)

        // Mousemove on the timeline
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: 500,
            clientY: 100
          })
        })

        const updatedList = enzymeWrapper.find(TimelineList)

        enzymeWrapper.update()

        expect(updatedList.props().temporalRangeMouseOverPosition).toEqual(null)
      })
    })

    describe('when hovering over the temporal range selection area', () => {
      test('displays the indicator in the correct position', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
        const getBoundingClientRectWrapperMock = jest.fn(() => ({
          top: 50,
          width: 1000
        }))

        const getBoundingClientRectListMock = jest.fn(() => ({
          x: 400
        }))

        const { enzymeWrapper } = setup()

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectWrapperMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectListMock

        const list = enzymeWrapper.find(TimelineList)

        // Mousemove on the timeline
        act(() => {
          list.simulate('pointermove', {
            pointerId: 1,
            clientX: 500,
            clientY: 55
          })
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().temporalRangeMouseOverPosition).toEqual(100)
      })
    })

    test('does not display the indicator when the timeline is moving', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
      const getBoundingClientRectWrapperMock = jest.fn(() => ({
        top: 50,
        width: 1000
      }))

      const getBoundingClientRectListMock = jest.fn(() => ({
        x: 400
      }))

      const { enzymeWrapper } = setup()

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectWrapperMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectListMock

      const list = enzymeWrapper.find(TimelineList)

      // Clicks on the timeline
      act(() => {
        list.simulate('pointerdown', {
          pointerId: 1,
          clientX: 500,
          clientY: 80
        })
      })

      // Drag the mouse again
      act(() => {
        list.simulate('pointermove', {
          pointerId: 1,
          clientX: 603,
          clientY: 80
        })
      })

      act(() => {
        list.simulate('pointermove', {
          pointerId: 1,
          clientX: 700,
          clientY: 80
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().temporalRangeMouseOverPosition).toEqual(null)
    })
  })

  describe('on mouse out', () => {
    test('resets the correct state values', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
      const getBoundingClientRectWrapperMock = jest.fn(() => ({
        top: 50,
        width: 1000
      }))

      const getBoundingClientRectListMock = jest.fn(() => ({
        x: 400
      }))

      const { enzymeWrapper } = setup()

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectWrapperMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectListMock

      const list = enzymeWrapper.find(TimelineList)

      // Drag the mouse again
      act(() => {
        list.simulate('pointerenter', {
          pointerId: 1,
          clientX: 603,
          clientY: 30
        })
      })

      act(() => {
        list.simulate('pointermove', {
          pointerId: 1,
          clientX: 603,
          clientY: 30
        })
      })

      expect(enzymeWrapper.find(TimelineList).props().willCancelTemporalSelection).toEqual(true)

      // Drag the mouse again
      act(() => {
        list.simulate('pointerleave', {
          pointerId: 1,
          clientX: 603,
          clientY: 0
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().willCancelTemporalSelection).toEqual(false)
    })
  })

  describe('Focused intervals', () => {
    describe('onFocusedClick', () => {
      test('sets the focusedInterval', () => {
        const { enzymeWrapper, props } = setup()

        const list = enzymeWrapper.find(TimelineList)

        list.invoke('onFocusedClick')({
          end: 1630454399999,
          start: 1627776000000
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          end: 1630454399999,
          start: 1627776000000
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith(expect.objectContaining({
          focusedEnd: 1630454399999,
          focusedStart: 1627776000000
        }))
      })

      test('removes the focusedInterval', () => {
        const { enzymeWrapper, props } = setup({
          focusedInterval: {
            end: 1630454399999,
            start: 1627776000000
          }
        })

        const list = enzymeWrapper.find(TimelineList)

        list.invoke('onFocusedClick')({
          end: 1630454399999,
          start: 1627776000000
        })

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({})
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith(expect.objectContaining({
          focusedEnd: undefined,
          focusedStart: undefined
        }))
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
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

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
        expect(props.onFocusedSet).toHaveBeenCalledWith(expect.objectContaining({
          focusedEnd: 1627775999999,
          focusedStart: 1625097600000
        }))
      })

      test('changes the focusedInterval with right arrow keypress', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

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
        expect(props.onFocusedSet).toHaveBeenCalledWith(expect.objectContaining({
          focusedEnd: 1633046399999,
          focusedStart: 1630454400000
        }))
      })

      test('changes the focusedInterval with TimelineTools', () => {
        jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
        jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

        enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
        enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock

        enzymeWrapper.find(TimelineTools).invoke('onChangeFocusedInterval')('next')

        enzymeWrapper.update()

        expect(enzymeWrapper.find(TimelineList).props().focusedInterval).toEqual({
          end: 1633046399999,
          start: 1630454400000
        })
        expect(props.onFocusedSet).toHaveBeenCalledTimes(1)
        expect(props.onFocusedSet).toHaveBeenCalledWith(expect.objectContaining({
          focusedEnd: 1633046399999,
          focusedStart: 1630454400000
        }))
      })

      describe('loading more intervals', () => {
        test('loads more intervals when changing the focusedInterval backwards', () => {
          jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
          jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

          enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
          enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock
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
          expect(props.onTimelineMoveEnd).toHaveBeenCalledTimes(22)
        })

        test('loads more intervals when changing the focusedInterval forwards', () => {
          jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
          jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

          enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
          enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock
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
          expect(props.onTimelineMove).toHaveBeenCalledTimes(23)
          expect(props.onTimelineMoveEnd).toHaveBeenCalledTimes(23)
        })

        test('loads more intervals when changing the focusedInterval forwards and removes extra intervals', () => {
          jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
          jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
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

          enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
          enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getListBoundingClientRectMock
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
          expect(props.onTimelineMoveEnd).toHaveBeenCalledTimes(53)
        })
      })
    })
  })

  describe('Visible Temporal Range', () => {
    test('sets the visible temporal range', () => {
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2224.9691647640793)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 5647.315068493151)
      const getBoundingClientRectWrapperMock = jest.fn(() => ({
        top: 50,
        width: 1110
      }))

      const getBoundingClientRectToolsMock = jest.fn(() => ({
        width: 77
      }))

      const { enzymeWrapper } = setup({
        focusedInterval: {
          end: new Date('2021-03').getTime(),
          start: new Date('2021-02').getTime()
        }
      })

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectWrapperMock
      enzymeWrapper.find('.edsc-timeline-tools').getElement().ref.current.getBoundingClientRect = getBoundingClientRectToolsMock

      enzymeWrapper.find(TimelineTools).invoke('onChangeFocusedInterval')('next')

      enzymeWrapper.update()

      const primarySection = enzymeWrapper.find(TimelinePrimarySection)

      expect(primarySection.props().visibleTemporalRange).toEqual(
        {
          end: 1625152378000,
          start: 1595804010432
        }
      )
    })
  })

  describe('When more than 3 data rows are provided', () => {
    test('trims the data rows', () => {
      const { enzymeWrapper } = setup({
        data: [
          {
            id: 'row1',
            title: 'Test Data Row 1',
            intervals: []
          },
          {
            id: 'row2',
            title: 'Test Data Row 2',
            intervals: []
          },
          {
            id: 'row3',
            title: 'Test Data Row 3',
            intervals: []
          },
          {
            id: 'row4',
            title: 'Test Data Row 4',
            intervals: []
          },
          {
            id: 'row5',
            title: 'Test Data Row 5',
            intervals: []
          }
        ]
      })

      expect(enzymeWrapper.find(TimelineList).props().data.length).toBe(3)
    })
  })

  describe('on mouse move', () => {
    test('does not prevent temporal selection hover when the interval bottom is not hovered', () => {
      document.elementsFromPoint = jest.fn(() => [
        {
          classList: {
            contains: () => false
          }
        }
      ])
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
      const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))

      const { enzymeWrapper } = setup()

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList).find('.edsc-timeline-list')

      // Drag the mouse again
      act(() => {
        list.simulate('pointermove', {
          pointerId: 1,
          clientX: 2251
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().preventTemporalSelectionHover).toBe(false)
    })

    test('prevent temporal selection hover when the interval bottom is hovered', () => {
      document.elementsFromPoint = jest.fn(() => [
        {
          classList: {
            contains: () => false
          }
        },
        {
          classList: {
            contains: () => true
          }
        }
      ])
      jest.spyOn(getPositionByTimestamp, 'getPositionByTimestamp').mockImplementation(() => 2000)
      jest.spyOn(determineScaledWidth, 'determineScaledWidth').mockImplementation(() => 2500)
      const getBoundingClientRectMock = jest.fn(() => ({ width: 1200 }))

      const { enzymeWrapper } = setup()

      enzymeWrapper.find('.edsc-timeline').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock
      enzymeWrapper.find('.edsc-timeline-list').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock

      const list = enzymeWrapper.find(TimelineList).find('.edsc-timeline-list')

      // Drag the mouse again
      act(() => {
        list.simulate('pointermove', {
          pointerId: 1,
          clientX: 2251
        })
      })

      enzymeWrapper.update()

      expect(enzymeWrapper.find(TimelineList).props().preventTemporalSelectionHover).toBe(true)
    })
  })
})
