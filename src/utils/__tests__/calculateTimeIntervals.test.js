import MockDate from 'mockdate'
import { ZOOM_LEVELS } from '../../constants'

import { calculateTimeIntervals } from '../calculateTimeIntervals'

beforeEach(() => {
  jest.clearAllMocks()

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('2021-01-01T10:00:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

const BUFFER = 15

describe('calculateTimelineIntervals', () => {
  describe('when zoom level is minute', () => {
    test('returns the correct intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.minute,
        numIntervals: BUFFER,
        reverse: false
      })

      const expectedResult = [
        new Date('2021-01-01T10:01:00.000Z').getTime(),
        new Date('2021-01-01T10:02:00.000Z').getTime(),
        new Date('2021-01-01T10:03:00.000Z').getTime(),
        new Date('2021-01-01T10:04:00.000Z').getTime(),
        new Date('2021-01-01T10:05:00.000Z').getTime(),
        new Date('2021-01-01T10:06:00.000Z').getTime(),
        new Date('2021-01-01T10:07:00.000Z').getTime(),
        new Date('2021-01-01T10:08:00.000Z').getTime(),
        new Date('2021-01-01T10:09:00.000Z').getTime(),
        new Date('2021-01-01T10:10:00.000Z').getTime(),
        new Date('2021-01-01T10:11:00.000Z').getTime(),
        new Date('2021-01-01T10:12:00.000Z').getTime(),
        new Date('2021-01-01T10:13:00.000Z').getTime(),
        new Date('2021-01-01T10:14:00.000Z').getTime(),
        new Date('2021-01-01T10:15:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })

    test('returns the correct reversed intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.minute,
        numIntervals: BUFFER,
        reverse: true
      })

      const expectedResult = [
        new Date('2021-01-01T09:45:00.000Z').getTime(),
        new Date('2021-01-01T09:46:00.000Z').getTime(),
        new Date('2021-01-01T09:47:00.000Z').getTime(),
        new Date('2021-01-01T09:48:00.000Z').getTime(),
        new Date('2021-01-01T09:49:00.000Z').getTime(),
        new Date('2021-01-01T09:50:00.000Z').getTime(),
        new Date('2021-01-01T09:51:00.000Z').getTime(),
        new Date('2021-01-01T09:52:00.000Z').getTime(),
        new Date('2021-01-01T09:53:00.000Z').getTime(),
        new Date('2021-01-01T09:54:00.000Z').getTime(),
        new Date('2021-01-01T09:55:00.000Z').getTime(),
        new Date('2021-01-01T09:56:00.000Z').getTime(),
        new Date('2021-01-01T09:57:00.000Z').getTime(),
        new Date('2021-01-01T09:58:00.000Z').getTime(),
        new Date('2021-01-01T09:59:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when zoom level is hour', () => {
    test('returns the correct intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.hour,
        numIntervals: BUFFER,
        reverse: false
      })

      const expectedResult = [
        new Date('2021-01-01T11:00:00.000Z').getTime(),
        new Date('2021-01-01T12:00:00.000Z').getTime(),
        new Date('2021-01-01T13:00:00.000Z').getTime(),
        new Date('2021-01-01T14:00:00.000Z').getTime(),
        new Date('2021-01-01T15:00:00.000Z').getTime(),
        new Date('2021-01-01T16:00:00.000Z').getTime(),
        new Date('2021-01-01T17:00:00.000Z').getTime(),
        new Date('2021-01-01T18:00:00.000Z').getTime(),
        new Date('2021-01-01T19:00:00.000Z').getTime(),
        new Date('2021-01-01T20:00:00.000Z').getTime(),
        new Date('2021-01-01T21:00:00.000Z').getTime(),
        new Date('2021-01-01T22:00:00.000Z').getTime(),
        new Date('2021-01-01T23:00:00.000Z').getTime(),
        new Date('2021-01-02T00:00:00.000Z').getTime(),
        new Date('2021-01-02T01:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })

    test('returns the correct reversed intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.hour,
        numIntervals: BUFFER,
        reverse: true
      })

      const expectedResult = [
        new Date('2020-12-31T19:00:00.000Z').getTime(),
        new Date('2020-12-31T20:00:00.000Z').getTime(),
        new Date('2020-12-31T21:00:00.000Z').getTime(),
        new Date('2020-12-31T22:00:00.000Z').getTime(),
        new Date('2020-12-31T23:00:00.000Z').getTime(),
        new Date('2021-01-01T00:00:00.000Z').getTime(),
        new Date('2021-01-01T01:00:00.000Z').getTime(),
        new Date('2021-01-01T02:00:00.000Z').getTime(),
        new Date('2021-01-01T03:00:00.000Z').getTime(),
        new Date('2021-01-01T04:00:00.000Z').getTime(),
        new Date('2021-01-01T05:00:00.000Z').getTime(),
        new Date('2021-01-01T06:00:00.000Z').getTime(),
        new Date('2021-01-01T07:00:00.000Z').getTime(),
        new Date('2021-01-01T08:00:00.000Z').getTime(),
        new Date('2021-01-01T09:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when zoom level is day', () => {
    test('returns the correct intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.day,
        numIntervals: BUFFER,
        reverse: false
      })

      const expectedResult = [
        new Date('2021-01-02T00:00:00.000Z').getTime(),
        new Date('2021-01-03T00:00:00.000Z').getTime(),
        new Date('2021-01-04T00:00:00.000Z').getTime(),
        new Date('2021-01-05T00:00:00.000Z').getTime(),
        new Date('2021-01-06T00:00:00.000Z').getTime(),
        new Date('2021-01-07T00:00:00.000Z').getTime(),
        new Date('2021-01-08T00:00:00.000Z').getTime(),
        new Date('2021-01-09T00:00:00.000Z').getTime(),
        new Date('2021-01-10T00:00:00.000Z').getTime(),
        new Date('2021-01-11T00:00:00.000Z').getTime(),
        new Date('2021-01-12T00:00:00.000Z').getTime(),
        new Date('2021-01-13T00:00:00.000Z').getTime(),
        new Date('2021-01-14T00:00:00.000Z').getTime(),
        new Date('2021-01-15T00:00:00.000Z').getTime(),
        new Date('2021-01-16T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })

    test('returns the correct reversed intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.day,
        numIntervals: BUFFER,
        reverse: true
      })

      const expectedResult = [
        new Date('2020-12-17T00:00:00.000Z').getTime(),
        new Date('2020-12-18T00:00:00.000Z').getTime(),
        new Date('2020-12-19T00:00:00.000Z').getTime(),
        new Date('2020-12-20T00:00:00.000Z').getTime(),
        new Date('2020-12-21T00:00:00.000Z').getTime(),
        new Date('2020-12-22T00:00:00.000Z').getTime(),
        new Date('2020-12-23T00:00:00.000Z').getTime(),
        new Date('2020-12-24T00:00:00.000Z').getTime(),
        new Date('2020-12-25T00:00:00.000Z').getTime(),
        new Date('2020-12-26T00:00:00.000Z').getTime(),
        new Date('2020-12-27T00:00:00.000Z').getTime(),
        new Date('2020-12-28T00:00:00.000Z').getTime(),
        new Date('2020-12-29T00:00:00.000Z').getTime(),
        new Date('2020-12-30T00:00:00.000Z').getTime(),
        new Date('2020-12-31T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when zoom level is month', () => {
    test('returns the correct intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.month,
        numIntervals: BUFFER,
        reverse: false
      })

      const expectedResult = [
        new Date('2021-02-01T00:00:00.000Z').getTime(),
        new Date('2021-03-01T00:00:00.000Z').getTime(),
        new Date('2021-04-01T00:00:00.000Z').getTime(),
        new Date('2021-05-01T00:00:00.000Z').getTime(),
        new Date('2021-06-01T00:00:00.000Z').getTime(),
        new Date('2021-07-01T00:00:00.000Z').getTime(),
        new Date('2021-08-01T00:00:00.000Z').getTime(),
        new Date('2021-09-01T00:00:00.000Z').getTime(),
        new Date('2021-10-01T00:00:00.000Z').getTime(),
        new Date('2021-11-01T00:00:00.000Z').getTime(),
        new Date('2021-12-01T00:00:00.000Z').getTime(),
        new Date('2022-01-01T00:00:00.000Z').getTime(),
        new Date('2022-02-01T00:00:00.000Z').getTime(),
        new Date('2022-03-01T00:00:00.000Z').getTime(),
        new Date('2022-04-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })

    test('returns the correct reversed intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.month,
        numIntervals: BUFFER,
        reverse: true
      })

      const expectedResult = [
        new Date('2019-10-01T00:00:00.000Z').getTime(),
        new Date('2019-11-01T00:00:00.000Z').getTime(),
        new Date('2019-12-01T00:00:00.000Z').getTime(),
        new Date('2020-01-01T00:00:00.000Z').getTime(),
        new Date('2020-02-01T00:00:00.000Z').getTime(),
        new Date('2020-03-01T00:00:00.000Z').getTime(),
        new Date('2020-04-01T00:00:00.000Z').getTime(),
        new Date('2020-05-01T00:00:00.000Z').getTime(),
        new Date('2020-06-01T00:00:00.000Z').getTime(),
        new Date('2020-07-01T00:00:00.000Z').getTime(),
        new Date('2020-08-01T00:00:00.000Z').getTime(),
        new Date('2020-09-01T00:00:00.000Z').getTime(),
        new Date('2020-10-01T00:00:00.000Z').getTime(),
        new Date('2020-11-01T00:00:00.000Z').getTime(),
        new Date('2020-12-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when zoom level is year', () => {
    test('returns the correct intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.year,
        numIntervals: BUFFER,
        reverse: false
      })

      const expectedResult = [
        new Date('2022-01-01T00:00:00.000Z').getTime(),
        new Date('2023-01-01T00:00:00.000Z').getTime(),
        new Date('2024-01-01T00:00:00.000Z').getTime(),
        new Date('2025-01-01T00:00:00.000Z').getTime(),
        new Date('2026-01-01T00:00:00.000Z').getTime(),
        new Date('2027-01-01T00:00:00.000Z').getTime(),
        new Date('2028-01-01T00:00:00.000Z').getTime(),
        new Date('2029-01-01T00:00:00.000Z').getTime(),
        new Date('2030-01-01T00:00:00.000Z').getTime(),
        new Date('2031-01-01T00:00:00.000Z').getTime(),
        new Date('2032-01-01T00:00:00.000Z').getTime(),
        new Date('2033-01-01T00:00:00.000Z').getTime(),
        new Date('2034-01-01T00:00:00.000Z').getTime(),
        new Date('2035-01-01T00:00:00.000Z').getTime(),
        new Date('2036-01-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })

    test('returns the correct reversed intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.year,
        numIntervals: BUFFER,
        reverse: true
      })

      const expectedResult = [
        new Date('2006-01-01T00:00:00.000Z').getTime(),
        new Date('2007-01-01T00:00:00.000Z').getTime(),
        new Date('2008-01-01T00:00:00.000Z').getTime(),
        new Date('2009-01-01T00:00:00.000Z').getTime(),
        new Date('2010-01-01T00:00:00.000Z').getTime(),
        new Date('2011-01-01T00:00:00.000Z').getTime(),
        new Date('2012-01-01T00:00:00.000Z').getTime(),
        new Date('2013-01-01T00:00:00.000Z').getTime(),
        new Date('2014-01-01T00:00:00.000Z').getTime(),
        new Date('2015-01-01T00:00:00.000Z').getTime(),
        new Date('2016-01-01T00:00:00.000Z').getTime(),
        new Date('2017-01-01T00:00:00.000Z').getTime(),
        new Date('2018-01-01T00:00:00.000Z').getTime(),
        new Date('2019-01-01T00:00:00.000Z').getTime(),
        new Date('2020-01-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when zoom level is decade', () => {
    test('returns the correct intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.decade,
        numIntervals: BUFFER,
        reverse: false
      })

      const expectedResult = [
        new Date('2030-01-01T00:00:00.000Z').getTime(),
        new Date('2040-01-01T00:00:00.000Z').getTime(),
        new Date('2050-01-01T00:00:00.000Z').getTime(),
        new Date('2060-01-01T00:00:00.000Z').getTime(),
        new Date('2070-01-01T00:00:00.000Z').getTime(),
        new Date('2080-01-01T00:00:00.000Z').getTime(),
        new Date('2090-01-01T00:00:00.000Z').getTime(),
        new Date('2100-01-01T00:00:00.000Z').getTime(),
        new Date('2110-01-01T00:00:00.000Z').getTime(),
        new Date('2120-01-01T00:00:00.000Z').getTime(),
        new Date('2130-01-01T00:00:00.000Z').getTime(),
        new Date('2140-01-01T00:00:00.000Z').getTime(),
        new Date('2150-01-01T00:00:00.000Z').getTime(),
        new Date('2160-01-01T00:00:00.000Z').getTime(),
        new Date('2170-01-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })

    test('returns the correct reversed intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.decade,
        numIntervals: BUFFER,
        reverse: true
      })

      const expectedResult = [
        new Date('1870-01-01T00:00:00.000Z').getTime(),
        new Date('1880-01-01T00:00:00.000Z').getTime(),
        new Date('1890-01-01T00:00:00.000Z').getTime(),
        new Date('1900-01-01T00:00:00.000Z').getTime(),
        new Date('1910-01-01T00:00:00.000Z').getTime(),
        new Date('1920-01-01T00:00:00.000Z').getTime(),
        new Date('1930-01-01T00:00:00.000Z').getTime(),
        new Date('1940-01-01T00:00:00.000Z').getTime(),
        new Date('1950-01-01T00:00:00.000Z').getTime(),
        new Date('1960-01-01T00:00:00.000Z').getTime(),
        new Date('1970-01-01T00:00:00.000Z').getTime(),
        new Date('1980-01-01T00:00:00.000Z').getTime(),
        new Date('1990-01-01T00:00:00.000Z').getTime(),
        new Date('2000-01-01T00:00:00.000Z').getTime(),
        new Date('2010-01-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when zoom level is 5 decades', () => {
    test('returns the correct intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.fiftyYears,
        numIntervals: BUFFER,
        reverse: false
      })

      const expectedResult = [
        new Date('2071-01-01T00:00:00.000Z').getTime(),
        new Date('2121-01-01T00:00:00.000Z').getTime(),
        new Date('2171-01-01T00:00:00.000Z').getTime(),
        new Date('2221-01-01T00:00:00.000Z').getTime(),
        new Date('2271-01-01T00:00:00.000Z').getTime(),
        new Date('2321-01-01T00:00:00.000Z').getTime(),
        new Date('2371-01-01T00:00:00.000Z').getTime(),
        new Date('2421-01-01T00:00:00.000Z').getTime(),
        new Date('2471-01-01T00:00:00.000Z').getTime(),
        new Date('2521-01-01T00:00:00.000Z').getTime(),
        new Date('2571-01-01T00:00:00.000Z').getTime(),
        new Date('2621-01-01T00:00:00.000Z').getTime(),
        new Date('2671-01-01T00:00:00.000Z').getTime(),
        new Date('2721-01-01T00:00:00.000Z').getTime(),
        new Date('2771-01-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })

    test('returns the correct reversed intervals', () => {
      const result = calculateTimeIntervals({
        timeAnchor: new Date().getTime(),
        zoomLevel: ZOOM_LEVELS.fiftyYears,
        numIntervals: BUFFER,
        reverse: true
      })

      const expectedResult = [
        new Date('1271-01-01T00:00:00.000Z').getTime(),
        new Date('1321-01-01T00:00:00.000Z').getTime(),
        new Date('1371-01-01T00:00:00.000Z').getTime(),
        new Date('1421-01-01T00:00:00.000Z').getTime(),
        new Date('1471-01-01T00:00:00.000Z').getTime(),
        new Date('1521-01-01T00:00:00.000Z').getTime(),
        new Date('1571-01-01T00:00:00.000Z').getTime(),
        new Date('1621-01-01T00:00:00.000Z').getTime(),
        new Date('1671-01-01T00:00:00.000Z').getTime(),
        new Date('1721-01-01T00:00:00.000Z').getTime(),
        new Date('1771-01-01T00:00:00.000Z').getTime(),
        new Date('1821-01-01T00:00:00.000Z').getTime(),
        new Date('1871-01-01T00:00:00.000Z').getTime(),
        new Date('1921-01-01T00:00:00.000Z').getTime(),
        new Date('1971-01-01T00:00:00.000Z').getTime()
      ]

      expect(result).toEqual(expectedResult)
    })
  })
})
