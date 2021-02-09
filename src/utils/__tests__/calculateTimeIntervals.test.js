import MockDate from 'mockdate'

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


describe('calculateTimelineIntervals', () => {
  // describe('when zoon level is 0', () => {
  //   test('creates 26824921 intervals', () => {
  //     const timeIntervals = calculateTimeIntervals(0, new Date().getTime(), 0)

  //     expect(timeIntervals.length).toEqual(26824921)
  //   })
  // })

  describe('when zoon level is 0', () => {
    test('creates 447083 intervals', () => {
      const timeIntervals = calculateTimeIntervals(0, new Date().getTime(), 1)

      expect(timeIntervals.length).toEqual(447083)
    })
  })

  describe('when zoon level is 0', () => {
    test('creates 18629 intervals', () => {
      const timeIntervals = calculateTimeIntervals(0, new Date().getTime(), 2)

      expect(timeIntervals.length).toEqual(18629)
    })
  })

  describe('when zoon level is 0', () => {
    test('creates 601 intervals', () => {
      const timeIntervals = calculateTimeIntervals(0, new Date().getTime(), 3)

      expect(timeIntervals.length).toEqual(601)
    })
  })

  describe('when zoon level is 0', () => {
    test('creates 51 intervals', () => {
      const timeIntervals = calculateTimeIntervals(0, new Date().getTime(), 4)

      expect(timeIntervals.length).toEqual(51)
    })
  })
})
