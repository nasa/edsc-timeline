var getTransformAttr = function(el) {
  return el.getAttribute('transform')
    || el.parentNode.getAttribute('transform')
    || '';
};

var updateSvgElement = function(el, attrs) {
  var attr;
  if (attrs != null) {
    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr) && attrs[attr] != null) {
        el.setAttribute(attr, attrs[attr]);
      }
    }
  }
  return el;
};

var buildSvgElement = function(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);
  return updateSvgElement(el, attrs);
};

exports.updateSvgElement = updateSvgElement;
exports.buildSvgElement = buildSvgElement;

exports.addDef = function(svg, def) {
  var defs = svg.getElementsByTagName('defs')[0];
  if (!defs) {
    defs = buildSvgElement('defs');
    svg.insertBefore(defs, svg.firstChild);
  }
  defs.appendChild(def);
};

exports.getTransformX = function(el, defaultValue) {
  var match, result;
  result = defaultValue || 0;
  if (el) {
    match = /^[^\d\-]*(-?[\d\.]+)/.exec(getTransformAttr(el));
    if (match && match[1]) {
      result = parseFloat(match[1]);
    }
  }
  return result;
};
