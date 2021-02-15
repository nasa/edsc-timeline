import { getUTCComponents } from '../getUTCComponents'

describe('getUTCComponents', () => {
  test('returns UTC components of the date', () => {
    expect(getUTCComponents(new Date('2021-02-15T16:10:14.000Z'))).toEqual([
      2021,
      1, // months are 0 indexed
      15,
      16,
      10
    ])
  })
})
