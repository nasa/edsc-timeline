import MockDate from 'mockdate'

import {
  formatDate,
  formatDay,
  formatMonth,
  formatTime,
  formatYear
} from '../formatters'

beforeEach(() => {
  jest.clearAllMocks()

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('2021-01-01T10:11:12.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('formatTime', () => {
  test('returns the time in the correct format', () => {
    expect(formatTime(new Date())).toEqual('10:11')
  })
})

describe('formatDay', () => {
  test('returns the time in the correct format', () => {
    expect(formatDay(new Date())).toEqual('01')
  })
})

describe('formatMonth', () => {
  test('returns the time in the correct format', () => {
    expect(formatMonth(new Date())).toEqual('Jan')
  })
})

describe('formatDate', () => {
  test('returns the time in the correct format', () => {
    expect(formatDate(new Date())).toEqual('Jan 01')
  })
})

describe('formatYear', () => {
  test('returns the time in the correct format', () => {
    expect(formatYear(new Date())).toEqual('2021')
  })
})
