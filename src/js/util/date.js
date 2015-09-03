exports.dateToHumanUTC = function(date) {
  var result, dateTime, tz, utcStr;
  if (date !== null && typeof(date) !== 'undefined') {
    utcStr = new Date(date).toUTCString();
    tz = utcStr.substring(utcStr.length-3);

    dateTime = utcStr
      .replace(/^\S+\s/, '')   // Remove leading word (day of week)
      .replace(/:[^:]*$/, ''); // Remove everything after the minutes
    // Tack on the time zone code
    result = dateTime + ' ' + tz;
    }
  else {
    result = 'Unknown';
  }
  return result;
};
