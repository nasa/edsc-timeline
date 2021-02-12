import MockDate from 'mockdate'

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
  describe('when zoon level is 0', () => {
    expect(determineIntervalLabel(new Date().getTime(), 0)).toEqual(['05:35'])
  })

  describe('when zoon level is 1', () => {
    expect(determineIntervalLabel(new Date().getTime(), 1)).toEqual(['05:00'])
  })

  describe('when zoon level is 2', () => {
    expect(determineIntervalLabel(new Date().getTime(), 2)).toEqual(['12'])
  })

  describe('when zoon level is 3', () => {
    expect(determineIntervalLabel(new Date().getTime(), 3)).toEqual(['Feb'])
  })

  describe('when zoon level is 4', () => {
    expect(determineIntervalLabel(new Date().getTime(), 4)).toEqual([2021])
  })
})
