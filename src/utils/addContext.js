/**
 * Adds additional context to a date string for display on the timeline
 * @param {String} dateStr The data to consider adding context to
 * @param {String} contextMatch A string to compare the current interval to, to determine if we should add additional context
 * @param {Function} contextFn The function to call to create the additional context
 */
export const addContext = (dateStr, contextMatch, contextFn) => {
  // Initialize the context array to just the date string
  const result = [dateStr]

  // If the current date string matches the contextMatch, add the additional context
  if (dateStr === contextMatch) {
    result.push(contextFn())
  }

  return result
}
