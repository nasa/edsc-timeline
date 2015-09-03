// Pad the given str (string) by prepending the given padChar (string) until it
// is at least len (int) characters long
exports.padLeft = function(str, padChar, len) {
  str = "" + str;
  padChar = "" + padChar;
  while (str.length < len) {
    str = padChar + str;
  }
  return str;
};

// Convert the string to one which uses dashes instead of spaces and underscores
// and has dashes between CapWords.
exports.dasherize = function(str) {
  return str
    .replace(/[_\s]+/g, '-')    // Replace runs of spaces and underscores with dashes
    .replace(/([A-Z])/g, '-$1') // Insert dashes before capital letters
    .replace(/-+/g, '-')        // Replace runs of dashes with single dashes
    .replace(/\A-/g, '')        // Get rid of leading dashes
    .replace(/-\Z/g, '')        // Get rid of trailing dashes
    .toLowerCase();             // Lowercase
};

// Capitalize the first letter of the string
exports.capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
