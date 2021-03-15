/**
 * Find the beginning and end of the interval where `timestamp` sits
 * @param {Array} intervals Timeline intervals
 * @param {Integer} timestamp Timestamp to find within the intervals
 * @param {Integer} offset Optional - Adjust the found interval +/- this amount of intervals
 */
export const getIntervalBounds = (intervals, timestamp, offset = 0) => {
  // Find the start index by finding the first interval greater than the timestamp, then subtract 1 to get the beginning of the interval
  const startIndex = intervals.findIndex((interval) => interval >= timestamp) - 1

  // Offset the startIndex by the offset
  const offsetStartIndex = startIndex + offset

  const start = intervals[offsetStartIndex]

  // Subtract 1 millisecond from the end to be the last value of the previous interval
  const end = intervals[offsetStartIndex + 1] - 1

  return { end, start }
}
