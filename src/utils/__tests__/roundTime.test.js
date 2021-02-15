import { ZOOM_LEVELS } from '../../constants'
import { roundTime } from '../roundTime'

describe('roundTime', () => {
  describe('rounding to decade', () => {
    test('returns the first day of the decade', () => {
      const input = new Date('2021-03-15T10:42:11.000Z')

      const expectedResult = new Date('2020-01-01T00:00:00.000Z')

      const result = roundTime(input.getTime(), ZOOM_LEVELS.decade)

      expect(new Date(result)).toEqual(expectedResult)
    })
  })

  describe('rounding to year', () => {
    test('returns the first day of the year', () => {
      const input = new Date('2021-03-15T10:42:11.000Z')

      const expectedResult = new Date('2021-01-01T00:00:00.000Z')

      const result = roundTime(input.getTime(), ZOOM_LEVELS.year)

      expect(new Date(result)).toEqual(expectedResult)
    })
  })

  describe('rounding to month', () => {
    test('returns the first day of the month', () => {
      const input = new Date('2021-03-15T10:42:11.000Z')

      const expectedResult = new Date('2021-03-01T00:00:00.000Z')

      const result = roundTime(input.getTime(), ZOOM_LEVELS.month)

      expect(new Date(result)).toEqual(expectedResult)
    })
  })

  describe('rounding to day', () => {
    test('returns the beginning of the day', () => {
      const input = new Date('2021-03-15T10:42:11.000Z')

      const expectedResult = new Date('2021-03-15T00:00:00.000Z')

      const result = roundTime(input.getTime(), ZOOM_LEVELS.day)

      expect(new Date(result)).toEqual(expectedResult)
    })
  })

  describe('rounding to hour', () => {
    test('returns the beginning of the hour', () => {
      const input = new Date('2021-03-15T10:42:11.000Z')

      const expectedResult = new Date('2021-03-15T10:00:00.000Z')

      const result = roundTime(input.getTime(), ZOOM_LEVELS.hour)

      expect(new Date(result)).toEqual(expectedResult)
    })
  })

  describe('rounding to minute', () => {
    test('returns the beginning of the minute', () => {
      const input = new Date('2021-03-15T10:42:11.000Z')

      const expectedResult = new Date('2021-03-15T10:42:00.000Z')

      const result = roundTime(input.getTime(), ZOOM_LEVELS.minute)

      expect(new Date(result)).toEqual(expectedResult)
    })
  })
})
