import { determineTooltipPosition } from '../determineTooltipPosition'

const mockIntervals = [
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
]

describe('determineTooltipPosition', () => {
  describe('when passed a valid values', () => {
    it('returns the correct value', () => {
      const value = determineTooltipPosition({
        timestamp: 1617235200000,
        timeIntervals: mockIntervals,
        timelinePosition: { left: -600 },
        tooltipWidth: 50,
        wrapperWidth: 1200,
        zoomLevel: 3
      })

      expect(value).toEqual({ left: 1170 })
    })
  })

  describe('when the tooltip would be positioned outside the container', () => {
    describe('on the left side', () => {
      it('returns the value with a 5px margin', () => {
        const value = determineTooltipPosition({
          timestamp: 1530403200000,
          timeIntervals: mockIntervals,
          timelinePosition: { left: -600 },
          tooltipWidth: 200,
          wrapperWidth: 1200,
          zoomLevel: 3
        })

        expect(value).toEqual({ left: 105 })
      })
    })

    describe('on the right side', () => {
      it('returns the value with a 5px margin', () => {
        const value = determineTooltipPosition({
          timestamp: 1688169600000,
          timeIntervals: mockIntervals,
          timelinePosition: { left: -600 },
          tooltipWidth: 200,
          wrapperWidth: 1200,
          zoomLevel: 3
        })

        expect(value).toEqual({ left: 1095 })
      })
    })
  })
})
