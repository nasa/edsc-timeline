import MockDate from 'mockdate'
import { ZOOM_LEVELS } from '../../constants'

import { determineIntervalLabel } from '../determineIntervalLabel'

beforeEach(() => {
  jest.clearAllMocks()

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('2021-02-15T10:35:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('determineIntervalLabel', () => {
  describe('when zoom level is minute', () => {
    test('returns the correct label', () => {
      expect(determineIntervalLabel(new Date().getTime(), ZOOM_LEVELS.minute)).toEqual(['10:35'])
    })
  })

  describe('when zoom level is hour', () => {
    test('returns the correct label', () => {
      // TODO, we don't have a formatter for hours, only times (hour::minute), so this is returning 10:35. Other places round the time before it hits the formatters so the value looks right
      expect(determineIntervalLabel(new Date().getTime(), ZOOM_LEVELS.hour)).toEqual(['10:00'])
    })
  })

  describe('when zoom level is day', () => {
    test('returns the correct label', () => {
      expect(determineIntervalLabel(new Date().getTime(), ZOOM_LEVELS.day)).toEqual(['15'])
    })
  })

  describe('when zoom level is month', () => {
    test('returns the correct label', () => {
      expect(determineIntervalLabel(new Date().getTime(), ZOOM_LEVELS.month)).toEqual(['Feb'])
    })
  })

  describe('when zoom level is year', () => {
    test('returns the correct label', () => {
      expect(determineIntervalLabel(new Date().getTime(), ZOOM_LEVELS.year)).toEqual([2021])
    })
  })
})
