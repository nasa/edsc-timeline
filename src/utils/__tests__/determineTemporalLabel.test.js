import { determineTemporalLabel } from '../determineTemporalLabel'

describe('determineTemporalLabel', () => {
  describe('when passed a valid timestamp', () => {
    it('returns the correct value', () => {
      const value = determineTemporalLabel(1530403200000)

      expect(value).toEqual('01 Jul 2018 00:00:00')
    })
  })

  describe('when passed an invalid timestamp', () => {
    it('returns the correct value', () => {
      const value = determineTemporalLabel()

      expect(value).toEqual('')
    })

    it('returns the correct value', () => {
      const value = determineTemporalLabel('abc')

      expect(value).toEqual('')
    })
  })
})
