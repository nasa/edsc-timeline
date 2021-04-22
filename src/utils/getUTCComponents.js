/**
 * Create an array of values that are accepted by Date.UTC that contains all the individual values of the timestamp
 * @param {Date} date Date to process
 */
export const getUTCComponents = (date) => ['FullYear', 'Month', 'Date', 'Hours', 'Minutes'].map((component) => date[`getUTC${component}`]())
