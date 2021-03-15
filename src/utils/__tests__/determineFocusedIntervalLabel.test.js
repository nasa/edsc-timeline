import MockDate from 'mockdate'
import { ZOOM_LEVELS } from '../../constants'

import { determineFocusedIntervalLabel } from '../determineFocusedIntervalLabel'

beforeEach(() => {
  jest.clearAllMocks()

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('2021-02-15T10:35:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('determineFocusedIntervalLabel', () => {
  describe('when zoom level is minute', () => {
    test('returns the correct label', () => {
      expect(determineFocusedIntervalLabel(new Date('2021').getTime(), ZOOM_LEVELS.minute)).toEqual('00:00 Jan 01')
    })
  })

  describe('when zoom level is hour', () => {
    test('returns the correct label', () => {
      // We don't have a formatter for hours, only times (hour::minute), so this is returning 10:35.
      // Other places round the time before it hits the formatters so the value looks right
      expect(determineFocusedIntervalLabel(new Date('2021').getTime(), ZOOM_LEVELS.hour)).toEqual('00:00 01 Jan 2021')
    })
  })

  describe('when zoom level is day', () => {
    test('returns the correct label', () => {
      expect(determineFocusedIntervalLabel(new Date('2021').getTime(), ZOOM_LEVELS.day)).toEqual('01 Jan 2021')
    })
  })

  describe('when zoom level is month', () => {
    test('returns the correct label', () => {
      expect(determineFocusedIntervalLabel(new Date('2021').getTime(), ZOOM_LEVELS.month)).toEqual('Jan 2021')
    })
  })

  describe('when zoom level is year', () => {
    test('returns the correct label', () => {
      expect(determineFocusedIntervalLabel(new Date().getTime(), ZOOM_LEVELS.year)).toEqual('2021')
    })
  })

  describe('when zoom level is decade', () => {
    test('returns the correct label', () => {
      expect(determineFocusedIntervalLabel(new Date().getTime(), ZOOM_LEVELS.decade)).toEqual('2021')
    })
  })

  describe('when zoom level is 5 decades', () => {
    test('returns the correct label', () => {
      expect(determineFocusedIntervalLabel(new Date().getTime(), ZOOM_LEVELS.fiftyYears)).toEqual('2021')
    })
  })
})
