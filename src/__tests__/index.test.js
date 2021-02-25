import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EDSCTimeline from '../index'
import { TimelineTools } from '../components/TimelineTools/TimelineTools'
import { TimelineList } from '../components/TimelineList/TimelineList'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    rows: [],
    show: true,
    onTemporalSet: jest.fn(),
    onFocusedTemporalSet: jest.fn(),
    onTimelineMove: jest.fn()
  }

  const enzymeWrapper = shallow(<EDSCTimeline {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
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
      1533081600000, 1535760000000, 1538352000000, 1541030400000,
      1543622400000, 1546300800000, 1548979200000, 1551398400000,
      1554076800000, 1556668800000, 1559347200000, 1561939200000,
      1564617600000, 1567296000000, 1569888000000, 1572566400000,
      1575158400000, 1577836800000, 1580515200000, 1583020800000,
      1585699200000, 1588291200000, 1590969600000, 1593561600000,
      1596240000000, 1598918400000, 1601510400000, 1604188800000,
      1606780800000, 1609459200000, 1612137600000, 1614556800000,
      1617235200000, 1619827200000, 1622505600000, 1625097600000,
      1627776000000, 1630454400000, 1633046400000, 1635724800000,
      1638316800000, 1640995200000, 1643673600000, 1646092800000,
      1648771200000, 1651363200000, 1654041600000, 1656633600000,
      1659312000000, 1661990400000, 1664582400000, 1667260800000,
      1669852800000, 1672531200000, 1675209600000, 1677628800000,
      1680307200000, 1682899200000, 1685577600000, 1688169600000,
      1690848000000
    ])
  })

  describe('Show prop', () => {
    test('hides the timeline when false', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({ show: false })

      expect(enzymeWrapper.find('.timeline').length).toBe(0)
    })
  })
})
