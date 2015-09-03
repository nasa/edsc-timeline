/*
 The 'draggable' section extracted from Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
 (c) 2010-2013, Vladimir Agafonkin
 (c) 2010-2011, CloudMade
 */
(function (window, document, undefined) {
  var oldLD = window.LD,
    LD = {};

  LD.version = '0.7';

// define Leaflet Draggable for Node module pattern loaders, including Browserify
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = LD;

// define Leaflet Draggable as an AMD module
  } else if (typeof define === 'function' && define.amd) {
    define(LD);
  }

// define Leaflet Draggable as a global LD variable, saving the original LD to restore later if needed

  LD.noConflict = function () {
    window.LD = oldLD;
    return this;
  };

  window.LD = LD;


  /*
   * LD.Util contains various utility functions used throughout Leaflet Draggable code.
   */

  LD.Util = {
    extend: function (dest) { // (Object[, Object, ...]) ->
      var sources = Array.prototype.slice.call(arguments, 1),
        i, j, len, src;

      for (j = 0, len = sources.length; j < len; j++) {
        src = sources[j] || {};
        for (i in src) {
          if (src.hasOwnProperty(i)) {
            dest[i] = src[i];
          }
        }
      }
      return dest;
    },

    bind: function (fn, obj) { // (Function, Object) -> Function
      var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
      return function () {
        return fn.apply(obj, args || arguments);
      };
    },

    stamp: (function () {
      var lastId = 0,
        key = '_leaflet_id';
      return function (obj) {
        obj[key] = obj[key] || ++lastId;
        return obj[key];
      };
    }()),

    invokeEach: function (obj, method, context) {
      var i, args;

      if (typeof obj === 'object') {
        args = Array.prototype.slice.call(arguments, 3);

        for (i in obj) {
          method.apply(context, [i, obj[i]].concat(args));
        }
        return true;
      }

      return false;
    },

    limitExecByInterval: function (fn, time, context) {
      var lock, execOnUnlock;

      return function wrapperFn() {
        var args = arguments;

        if (lock) {
          execOnUnlock = true;
          return;
        }

        lock = true;

        setTimeout(function () {
          lock = false;

          if (execOnUnlock) {
            wrapperFn.apply(context, args);
            execOnUnlock = false;
          }
        }, time);

        fn.apply(context, args);
      };
    },

    falseFn: function () {
      return false;
    },

    formatNum: function (num, digits) {
      var pow = Math.pow(10, digits || 5);
      return Math.round(num * pow) / pow;
    },

    trim: function (str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },

    splitWords: function (str) {
      return LD.Util.trim(str).split(/\s+/);
    },

    setOptions: function (obj, options) {
      obj.options = LD.extend({}, obj.options, options);
      return obj.options;
    },

    getParamString: function (obj, existingUrl, uppercase) {
      var params = [];
      for (var i in obj) {
        params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
      }
      return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
    },

    compileTemplate: function (str, data) {
      // based on https://gist.github.com/padolsey/6008842
      str = str.replace(/"/g, '\\\"');
      str = str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
        return '" + o["' + key + '"]' + (typeof data[key] === 'function' ? '(o)' : '') + ' + "';
      });
      // jshint evil: true
      return new Function('o', 'return "' + str + '";');
    },

    template: function (str, data) {
      var cache = LD.Util._templateCache = LD.Util._templateCache || {};
      cache[str] = cache[str] || LD.Util.compileTemplate(str, data);
      return cache[str](data);
    },

    isArray: Array.isArray || function (obj) {
      return (Object.prototype.toString.call(obj) === '[object Array]');
    },

    emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
  };

  (function () {

    // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

    function getPrefixed(name) {
      var i, fn,
        prefixes = ['webkit', 'moz', 'o', 'ms'];

      for (i = 0; i < prefixes.length && !fn; i++) {
        fn = window[prefixes[i] + name];
      }

      return fn;
    }

    var lastTime = 0;

    function timeoutDefer(fn) {
      var time = +new Date(),
        timeToCall = Math.max(0, 16 - (time - lastTime));

      lastTime = time + timeToCall;
      return window.setTimeout(fn, timeToCall);
    }

    var requestFn = window.requestAnimationFrame ||
      getPrefixed('RequestAnimationFrame') || timeoutDefer;

    var cancelFn = window.cancelAnimationFrame ||
      getPrefixed('CancelAnimationFrame') ||
      getPrefixed('CancelRequestAnimationFrame') ||
      function (id) { window.clearTimeout(id); };


    LD.Util.requestAnimFrame = function (fn, context, immediate, element) {
      fn = LD.bind(fn, context);

      if (immediate && requestFn === timeoutDefer) {
        fn();
      } else {
        return requestFn.call(window, fn, element);
      }
    };

    LD.Util.cancelAnimFrame = function (id) {
      if (id) {
        cancelFn.call(window, id);
      }
    };

  }());

// shortcuts for most used utility functions
  LD.extend = LD.Util.extend;
  LD.bind = LD.Util.bind;
  LD.stamp = LD.Util.stamp;
  LD.setOptions = LD.Util.setOptions;


  /*
   * LD.Class powers the OOP facilities of the library.
   * Thanks to John Resig and Dean Edwards for inspiration!
   */

  LD.Class = function () {};

  LD.Class.extend = function (props) {

    // extended class with the new prototype
    var NewClass = function () {

      // call the constructor
      if (this.initialize) {
        this.initialize.apply(this, arguments);
      }

      // call all constructor hooks
      if (this._initHooks) {
        this.callInitHooks();
      }
    };

    // instantiate class without calling constructor
    var F = function () {};
    F.prototype = this.prototype;

    var proto = new F();
    proto.constructor = NewClass;

    NewClass.prototype = proto;

    //inherit parent's statics
    for (var i in this) {
      if (this.hasOwnProperty(i) && i !== 'prototype') {
        NewClass[i] = this[i];
      }
    }

    // mix static properties into the class
    if (props.statics) {
      LD.extend(NewClass, props.statics);
      delete props.statics;
    }

    // mix includes into the prototype
    if (props.includes) {
      LD.Util.extend.apply(null, [proto].concat(props.includes));
      delete props.includes;
    }

    // merge options
    if (props.options && proto.options) {
      props.options = LD.extend({}, proto.options, props.options);
    }

    // mix given properties into the prototype
    LD.extend(proto, props);

    proto._initHooks = [];

    var parent = this;
    // jshint camelcase: false
    NewClass.__super__ = parent.prototype;

    // add method for calling all hooks
    proto.callInitHooks = function () {

      if (this._initHooksCalled) { return; }

      if (parent.prototype.callInitHooks) {
        parent.prototype.callInitHooks.call(this);
      }

      this._initHooksCalled = true;

      for (var i = 0, len = proto._initHooks.length; i < len; i++) {
        proto._initHooks[i].call(this);
      }
    };

    return NewClass;
  };


// method for adding properties to prototype
  LD.Class.include = function (props) {
    LD.extend(this.prototype, props);
  };

// merge new default options to the Class
  LD.Class.mergeOptions = function (options) {
    LD.extend(this.prototype.options, options);
  };

// add a constructor hook
  LD.Class.addInitHook = function (fn) { // (Function) || (String, args...)
    var args = Array.prototype.slice.call(arguments, 1);

    var init = typeof fn === 'function' ? fn : function () {
      this[fn].apply(this, args);
    };

    this.prototype._initHooks = this.prototype._initHooks || [];
    this.prototype._initHooks.push(init);
  };


  /*
   * LD.Mixin.Events is used to add custom events functionality to Leaflet classes.
   */

  var eventsKey = '_leaflet_events';

  LD.Mixin = {};

  LD.Mixin.Events = {

    addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

      // types can be a map of types/handlers
      if (LD.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

      var events = this[eventsKey] = this[eventsKey] || {},
        contextId = context && context !== this && LD.stamp(context),
        i, len, event, type, indexKey, indexLenKey, typeIndex;

      // types can be a string of space-separated words
      types = LD.Util.splitWords(types);

      for (i = 0, len = types.length; i < len; i++) {
        event = {
          action: fn,
          context: context || this
        };
        type = types[i];

        if (contextId) {
          // store listeners of a particular context in a separate hash (if it has an id)
          // gives a major performance boost when removing thousands of map layers

          indexKey = type + '_idx';
          indexLenKey = indexKey + '_len';

          typeIndex = events[indexKey] = events[indexKey] || {};

          if (!typeIndex[contextId]) {
            typeIndex[contextId] = [];

            // keep track of the number of keys in the index to quickly check if it's empty
            events[indexLenKey] = (events[indexLenKey] || 0) + 1;
          }

          typeIndex[contextId].push(event);


        } else {
          events[type] = events[type] || [];
          events[type].push(event);
        }
      }

      return this;
    },

    hasEventListeners: function (type) { // (String) -> Boolean
      var events = this[eventsKey];
      return !!events && ((type in events && events[type].length > 0) ||
        (type + '_idx' in events && events[type + '_idx_len'] > 0));
    },

    removeEventListener: function (types, fn, context) { // ([String, Function, Object]) or (Object[, Object])

      if (!this[eventsKey]) {
        return this;
      }

      if (!types) {
        return this.clearAllEventListeners();
      }

      if (LD.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }

      var events = this[eventsKey],
        contextId = context && context !== this && LD.stamp(context),
        i, len, type, listeners, j, indexKey, indexLenKey, typeIndex, removed;

      types = LD.Util.splitWords(types);

      for (i = 0, len = types.length; i < len; i++) {
        type = types[i];
        indexKey = type + '_idx';
        indexLenKey = indexKey + '_len';

        typeIndex = events[indexKey];

        if (!fn) {
          // clear all listeners for a type if function isn't specified
          delete events[type];
          delete events[indexKey];
          delete events[indexLenKey];

        } else {
          listeners = contextId && typeIndex ? typeIndex[contextId] : events[type];

          if (listeners) {
            for (j = listeners.length - 1; j >= 0; j--) {
              if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
                removed = listeners.splice(j, 1);
                // set the old action to a no-op, because it is possible
                // that the listener is being iterated over as part of a dispatch
                removed[0].action = LD.Util.falseFn;
              }
            }

            if (context && typeIndex && (listeners.length === 0)) {
              delete typeIndex[contextId];
              events[indexLenKey]--;
            }
          }
        }
      }

      return this;
    },

    clearAllEventListeners: function () {
      delete this[eventsKey];
      return this;
    },

    fireEvent: function (type, data) { // (String[, Object])
      if (!this.hasEventListeners(type)) {
        return this;
      }

      var event = LD.Util.extend({}, data, { type: type, target: this });

      var events = this[eventsKey],
        listeners, i, len, typeIndex, contextId;

      if (events[type]) {
        // make sure adding/removing listeners inside other listeners won't cause infinite loop
        listeners = events[type].slice();

        for (i = 0, len = listeners.length; i < len; i++) {
          listeners[i].action.call(listeners[i].context, event);
        }
      }

      // fire event for the context-indexed listeners as well
      typeIndex = events[type + '_idx'];

      for (contextId in typeIndex) {
        listeners = typeIndex[contextId].slice();

        if (listeners) {
          for (i = 0, len = listeners.length; i < len; i++) {
            listeners[i].action.call(listeners[i].context, event);
          }
        }
      }

      return this;
    },

    addOneTimeEventListener: function (types, fn, context) {

      if (LD.Util.invokeEach(types, this.addOneTimeEventListener, this, fn, context)) { return this; }

      var handler = LD.bind(function () {
        this
          .removeEventListener(types, fn, context)
          .removeEventListener(types, handler, context);
      }, this);

      return this
        .addEventListener(types, fn, context)
        .addEventListener(types, handler, context);
    }
  };

  LD.Mixin.Events.on = LD.Mixin.Events.addEventListener;
  LD.Mixin.Events.off = LD.Mixin.Events.removeEventListener;
  LD.Mixin.Events.once = LD.Mixin.Events.addOneTimeEventListener;
  LD.Mixin.Events.fire = LD.Mixin.Events.fireEvent;


  /*
   * LD.Browser handles different browser and feature detections for internal Leaflet use.
   */

  (function () {

    var ie = 'ActiveXObject' in window,
      ielt9 = ie && !document.addEventListener,

    // terrible browser detection to work around Safari / iOS / Android browser bugs
      ua = navigator.userAgent.toLowerCase(),
      webkit = ua.indexOf('webkit') !== -1,
      chrome = ua.indexOf('chrome') !== -1,
      phantomjs = ua.indexOf('phantom') !== -1,
      android = ua.indexOf('android') !== -1,
      android23 = ua.search('android [23]') !== -1,
      gecko = ua.indexOf('gecko') !== -1,

      mobile = typeof orientation !== undefined + '',
      msPointer = window.navigator && window.navigator.msPointerEnabled &&
        window.navigator.msMaxTouchPoints && !window.PointerEvent,
      pointer = (window.PointerEvent && window.navigator.pointerEnabled && window.navigator.maxTouchPoints) ||
        msPointer,
      retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1) ||
        ('matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') &&
        window.matchMedia('(min-resolution:144dpi)').matches),

      doc = document.documentElement,
      ie3d = ie && ('transition' in doc.style),
      webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()),
      gecko3d = 'MozPerspective' in doc.style,
      opera3d = 'OTransition' in doc.style,
      any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs;


    // PhantomJS has 'ontouchstart' in document.documentElement, but doesn't actually support touch.
    // https://github.com/Leaflet/Leaflet/pull/1434#issuecomment-13843151

    var touch = !window.L_NO_TOUCH && !phantomjs && (function () {

        var startName = 'ontouchstart';

        // IE10+ (We simulate these into touch* events in LD.DomEvent and LD.DomEvent.Pointer) or WebKit, etc.
        if (pointer || (startName in doc)) {
          return true;
        }

        // Firefox/Gecko
        var div = document.createElement('div'),
          supported = false;

        if (!div.setAttribute) {
          return false;
        }
        div.setAttribute(startName, 'return;');

        if (typeof div[startName] === 'function') {
          supported = true;
        }

        div.removeAttribute(startName);
        div = null;

        return supported;
      }());


    LD.Browser = {
      ie: ie,
      ielt9: ielt9,
      webkit: webkit,
      gecko: gecko && !webkit && !window.opera && !ie,

      android: android,
      android23: android23,

      chrome: chrome,

      ie3d: ie3d,
      webkit3d: webkit3d,
      gecko3d: gecko3d,
      opera3d: opera3d,
      any3d: any3d,

      mobile: mobile,
      mobileWebkit: mobile && webkit,
      mobileWebkit3d: mobile && webkit3d,
      mobileOpera: mobile && window.opera,

      touch: touch,
      msPointer: msPointer,
      pointer: pointer,

      retina: retina
    };

  }());

  LD.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
    this.x = (round ? Math.round(x) : x);
    this.y = (round ? Math.round(y) : y);
  };

  LD.Point.prototype = {

    clone: function () {
      return new LD.Point(this.x, this.y);
    },

    // non-destructive, returns a new point
    add: function (point) {
      return this.clone()._add(LD.point(point));
    },

    // destructive, used directly for performance in situations where it's safe to modify existing point
    _add: function (point) {
      this.x += point.x;
      this.y += point.y;
      return this;
    },

    subtract: function (point) {
      return this.clone()._subtract(LD.point(point));
    },

    _subtract: function (point) {
      this.x -= point.x;
      this.y -= point.y;
      return this;
    },

    divideBy: function (num) {
      return this.clone()._divideBy(num);
    },

    _divideBy: function (num) {
      this.x /= num;
      this.y /= num;
      return this;
    },

    multiplyBy: function (num) {
      return this.clone()._multiplyBy(num);
    },

    _multiplyBy: function (num) {
      this.x *= num;
      this.y *= num;
      return this;
    },

    round: function () {
      return this.clone()._round();
    },

    _round: function () {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    },

    floor: function () {
      return this.clone()._floor();
    },

    _floor: function () {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      return this;
    },

    distanceTo: function (point) {
      point = LD.point(point);

      var x = point.x - this.x,
        y = point.y - this.y;

      return Math.sqrt(x * x + y * y);
    },

    equals: function (point) {
      point = LD.point(point);

      return point.x === this.x &&
        point.y === this.y;
    },

    contains: function (point) {
      point = LD.point(point);

      return Math.abs(point.x) <= Math.abs(this.x) &&
        Math.abs(point.y) <= Math.abs(this.y);
    },

    toString: function () {
      return 'Point(' +
        LD.Util.formatNum(this.x) + ', ' +
        LD.Util.formatNum(this.y) + ')';
    }
  };

  LD.point = function (x, y, round) {
    if (x instanceof LD.Point) {
      return x;
    }
    if (LD.Util.isArray(x)) {
      return new LD.Point(x[0], x[1]);
    }
    if (x === undefined || x === null) {
      return x;
    }
    return new LD.Point(x, y, round);
  };

  /*
   * LD.DomUtil contains various utility functions for working with DOM.
   */

  LD.DomUtil = {
    get: function (id) {
      return (typeof id === 'string' ? document.getElementById(id) : id);
    },

    getStyle: function (el, style) {

      var value = el.style[style];

      if (!value && el.currentStyle) {
        value = el.currentStyle[style];
      }

      if ((!value || value === 'auto') && document.defaultView) {
        var css = document.defaultView.getComputedStyle(el, null);
        value = css ? css[style] : null;
      }

      return value === 'auto' ? null : value;
    },

    getViewportOffset: function (element) {

      var top = 0,
        left = 0,
        el = element,
        docBody = document.body,
        docEl = document.documentElement,
        pos;

      do {
        top  += el.offsetTop  || 0;
        left += el.offsetLeft || 0;

        //add borders
        top += parseInt(LD.DomUtil.getStyle(el, 'borderTopWidth'), 10) || 0;
        left += parseInt(LD.DomUtil.getStyle(el, 'borderLeftWidth'), 10) || 0;

        pos = LD.DomUtil.getStyle(el, 'position');

        if (el.offsetParent === docBody && pos === 'absolute') { break; }

        if (pos === 'fixed') {
          top  += docBody.scrollTop  || docEl.scrollTop  || 0;
          left += docBody.scrollLeft || docEl.scrollLeft || 0;
          break;
        }

        if (pos === 'relative' && !el.offsetLeft) {
          var width = LD.DomUtil.getStyle(el, 'width'),
            maxWidth = LD.DomUtil.getStyle(el, 'max-width'),
            r = el.getBoundingClientRect();

          if (width !== 'none' || maxWidth !== 'none') {
            left += r.left + el.clientLeft;
          }

          //calculate full y offset since we're breaking out of the loop
          top += r.top + (docBody.scrollTop  || docEl.scrollTop  || 0);

          break;
        }

        el = el.offsetParent;

      } while (el);

      el = element;

      do {
        if (el === docBody) { break; }

        top  -= el.scrollTop  || 0;
        left -= el.scrollLeft || 0;

        el = el.parentNode;
      } while (el);

      return new LD.Point(left, top);
    },

    documentIsLtr: function () {
      if (!LD.DomUtil._docIsLtrCached) {
        LD.DomUtil._docIsLtrCached = true;
        LD.DomUtil._docIsLtr = LD.DomUtil.getStyle(document.body, 'direction') === 'ltr';
      }
      return LD.DomUtil._docIsLtr;
    },

    create: function (tagName, className, container) {

      var el = document.createElement(tagName);
      el.className = className;

      if (container) {
        container.appendChild(el);
      }

      return el;
    },

    hasClass: function (el, name) {
      if (el.classList !== undefined) {
        return el.classList.contains(name);
      }
      var className = LD.DomUtil._getClass(el);
      return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
    },

    addClass: function (el, name) {
      if (el.classList !== undefined) {
        var classes = LD.Util.splitWords(name);
        for (var i = 0, len = classes.length; i < len; i++) {
          el.classList.add(classes[i]);
        }
      } else if (!LD.DomUtil.hasClass(el, name)) {
        var className = LD.DomUtil._getClass(el);
        LD.DomUtil._setClass(el, (className ? className + ' ' : '') + name);
      }
    },

    removeClass: function (el, name) {
      if (el.classList !== undefined) {
        el.classList.remove(name);
      } else {
        LD.DomUtil._setClass(el, LD.Util.trim((' ' + LD.DomUtil._getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
      }
    },

    _setClass: function (el, name) {
      if (el.className.baseVal === undefined) {
        el.className = name;
      } else {
        // in case of SVG element
        el.className.baseVal = name;
      }
    },

    _getClass: function (el) {
      return el.className.baseVal === undefined ? el.className : el.className.baseVal;
    },

    setOpacity: function (el, value) {

      if ('opacity' in el.style) {
        el.style.opacity = value;

      } else if ('filter' in el.style) {

        var filter = false,
          filterName = 'DXImageTransform.Microsoft.Alpha';

        // filters collection throws an error if we try to retrieve a filter that doesn't exist
        try {
          filter = el.filters.item(filterName);
        } catch (e) {
          // don't set opacity to 1 if we haven't already set an opacity,
          // it isn't needed and breaks transparent pngs.
          if (value === 1) { return; }
        }

        value = Math.round(value * 100);

        if (filter) {
          filter.Enabled = (value !== 100);
          filter.Opacity = value;
        } else {
          el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
        }
      }
    },

    testProp: function (props) {

      var style = document.documentElement.style;

      for (var i = 0; i < props.length; i++) {
        if (props[i] in style) {
          return props[i];
        }
      }
      return false;
    },

    getTranslateString: function (point) {
      // on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
      // makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
      // (same speed either way), Opera 12 doesn't support translate3d

      var is3d = LD.Browser.webkit3d,
        open = 'translate' + (is3d ? '3d' : '') + '(',
        close = (is3d ? ',0' : '') + ')';

      return open + point.x + 'px,' + point.y + 'px' + close;
    },

    getScaleString: function (scale, origin) {

      var preTranslateStr = LD.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),
        scaleStr = ' scale(' + scale + ') ';

      return preTranslateStr + scaleStr;
    },

    setPosition: function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])

      // jshint camelcase: false
      el._leaflet_pos = point;

      if (!disable3D && LD.Browser.any3d) {
        el.style[LD.DomUtil.TRANSFORM] =  LD.DomUtil.getTranslateString(point);

        // workaround for Android 2/3 stability (https://github.com/CloudMade/Leaflet/issues/69)
        if (LD.Browser.mobileWebkit3d) {
          el.style.WebkitBackfaceVisibility = 'hidden';
        }
      } else {
        el.style.left = point.x + 'px';
        el.style.top = point.y + 'px';
      }
    },

    getPosition: function (el) {
      // this method is only used for elements previously positioned using setPosition,
      // so it's safe to cache the position for performance

      // jshint camelcase: false
      return el._leaflet_pos;
    }
  };


// prefix style property names

  LD.DomUtil.TRANSFORM = LD.DomUtil.testProp(
    ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

// webkitTransition comes first because some browser versions that drop vendor prefix don't do
// the same for the transitionend event, in particular the Android 4.1 stock browser

  LD.DomUtil.TRANSITION = LD.DomUtil.testProp(
    ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

  LD.DomUtil.TRANSITION_END =
    LD.DomUtil.TRANSITION === 'webkitTransition' || LD.DomUtil.TRANSITION === 'OTransition' ?
    LD.DomUtil.TRANSITION + 'End' : 'transitionend';

  (function () {
    if ('onselectstart' in document) {
      LD.extend(LD.DomUtil, {
        disableTextSelection: function () {
          LD.DomEvent.on(window, 'selectstart', LD.DomEvent.preventDefault);
        },

        enableTextSelection: function () {
          LD.DomEvent.off(window, 'selectstart', LD.DomEvent.preventDefault);
        }
      });
    } else {
      var userSelectProperty = LD.DomUtil.testProp(
        ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

      LD.extend(LD.DomUtil, {
        disableTextSelection: function () {
          if (userSelectProperty) {
            var style = document.documentElement.style;
            this._userSelect = style[userSelectProperty];
            style[userSelectProperty] = 'none';
          }
        },

        enableTextSelection: function () {
          if (userSelectProperty) {
            document.documentElement.style[userSelectProperty] = this._userSelect;
            delete this._userSelect;
          }
        }
      });
    }

    LD.extend(LD.DomUtil, {
      disableImageDrag: function () {
        LD.DomEvent.on(window, 'dragstart', LD.DomEvent.preventDefault);
      },

      enableImageDrag: function () {
        LD.DomEvent.off(window, 'dragstart', LD.DomEvent.preventDefault);
      }
    });
  })();



  /*
   * LD.DomEvent contains functions for working with DOM events.
   */

  LD.DomEvent = {
    /* inspired by John Resig, Dean Edwards and YUI addEvent implementations */
    addListener: function (obj, type, fn, context) { // (HTMLElement, String, Function[, Object])

      var id = LD.stamp(fn),
        key = '_leaflet_' + type + id,
        handler, originalHandler, newType;

      if (obj[key]) { return this; }

      handler = function (e) {
        return fn.call(context || obj, e || LD.DomEvent._getEvent());
      };

      if (LD.Browser.pointer && type.indexOf('touch') === 0) {
        return this.addPointerListener(obj, type, handler, id);
      }
      if (LD.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
        this.addDoubleTapListener(obj, handler, id);
      }

      if ('addEventListener' in obj) {

        if (type === 'mousewheel') {
          obj.addEventListener('DOMMouseScroll', handler, false);
          obj.addEventListener(type, handler, false);

        } else if ((type === 'mouseenter') || (type === 'mouseleave')) {

          originalHandler = handler;
          newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');

          handler = function (e) {
            if (!LD.DomEvent._checkMouse(obj, e)) { return; }
            return originalHandler(e);
          };

          obj.addEventListener(newType, handler, false);

        } else if (type === 'click' && LD.Browser.android) {
          originalHandler = handler;
          handler = function (e) {
            return LD.DomEvent._filterClick(e, originalHandler);
          };

          obj.addEventListener(type, handler, false);
        } else {
          obj.addEventListener(type, handler, false);
        }

      } else if ('attachEvent' in obj) {
        obj.attachEvent('on' + type, handler);
      }

      obj[key] = handler;

      return this;
    },

    removeListener: function (obj, type, fn) {  // (HTMLElement, String, Function)

      var id = LD.stamp(fn),
        key = '_leaflet_' + type + id,
        handler = obj[key];

      if (!handler) { return this; }

      if (LD.Browser.pointer && type.indexOf('touch') === 0) {
        this.removePointerListener(obj, type, id);
      } else if (LD.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
        this.removeDoubleTapListener(obj, id);

      } else if ('removeEventListener' in obj) {

        if (type === 'mousewheel') {
          obj.removeEventListener('DOMMouseScroll', handler, false);
          obj.removeEventListener(type, handler, false);

        } else if ((type === 'mouseenter') || (type === 'mouseleave')) {
          obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
        } else {
          obj.removeEventListener(type, handler, false);
        }
      } else if ('detachEvent' in obj) {
        obj.detachEvent('on' + type, handler);
      }

      obj[key] = null;

      return this;
    },

    stopPropagation: function (e) {

      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      LD.DomEvent._skipped(e);

      return this;
    },

    disableScrollPropagation: function (el) {
      var stop = LD.DomEvent.stopPropagation;

      return LD.DomEvent
        .on(el, 'mousewheel', stop)
        .on(el, 'MozMousePixelScroll', stop);
    },

    disableClickPropagation: function (el) {
      var stop = LD.DomEvent.stopPropagation;

      for (var i = LD.Draggable.START.length - 1; i >= 0; i--) {
        LD.DomEvent.on(el, LD.Draggable.START[i], stop);
      }

      return LD.DomEvent
        .on(el, 'click', LD.DomEvent._fakeStop)
        .on(el, 'dblclick', stop);
    },

    preventDefault: function (e) {

      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      return this;
    },

    stop: function (e) {
      return LD.DomEvent
        .preventDefault(e)
        .stopPropagation(e);
    },

    getMousePosition: function (e, container) {
      var body = document.body,
        docEl = document.documentElement,
      //gecko makes scrollLeft more negative as you scroll in rtl, other browsers don't
      //ref: https://code.google.com/p/closure-library/source/browse/closure/goog/style/bidi.js
        x = LD.DomUtil.documentIsLtr() ?
          (e.pageX ? e.pageX - body.scrollLeft - docEl.scrollLeft : e.clientX) :
          (LD.Browser.gecko ? e.pageX - body.scrollLeft - docEl.scrollLeft :
            e.pageX ? e.pageX - body.scrollLeft + docEl.scrollLeft : e.clientX),
        y = e.pageY ? e.pageY - body.scrollTop - docEl.scrollTop: e.clientY,
        pos = new LD.Point(x, y);

      if (!container) {
        return pos;
      }

      var rect = container.getBoundingClientRect(),
        left = rect.left - container.clientLeft,
        top = rect.top - container.clientTop;

      return pos._subtract(new LD.Point(left, top));
    },

    getWheelDelta: function (e) {

      var delta = 0;

      if (e.wheelDelta) {
        delta = e.wheelDelta / 120;
      }
      if (e.detail) {
        delta = -e.detail / 3;
      }
      return delta;
    },

    _skipEvents: {},

    _fakeStop: function (e) {
      // fakes stopPropagation by setting a special event flag, checked/reset with LD.DomEvent._skipped(e)
      LD.DomEvent._skipEvents[e.type] = true;
    },

    _skipped: function (e) {
      var skipped = this._skipEvents[e.type];
      // reset when checking, as it's only used in map container and propagates outside of the map
      this._skipEvents[e.type] = false;
      return skipped;
    },

    // check if element really left/entered the event target (for mouseenter/mouseleave)
    _checkMouse: function (el, e) {

      var related = e.relatedTarget;

      if (!related) { return true; }

      try {
        while (related && (related !== el)) {
          related = related.parentNode;
        }
      } catch (err) {
        return false;
      }
      return (related !== el);
    },

    _getEvent: function () { // evil magic for IE
      /*jshint noarg:false */
      var e = window.event;
      if (!e) {
        var caller = arguments.callee.caller;
        while (caller) {
          e = caller['arguments'][0];
          if (e && window.Event === e.constructor) {
            break;
          }
          caller = caller.caller;
        }
      }
      return e;
    },

    // this is a horrible workaround for a bug in Android where a single touch triggers two click events
    _filterClick: function (e, handler) {
      var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
        elapsed = LD.DomEvent._lastClick && (timeStamp - LD.DomEvent._lastClick);

      // are they closer together than 1000ms yet more than 100ms?
      // Android typically triggers them ~300ms apart while multiple listeners
      // on the same event should be triggered far faster;
      // or check if click is simulated on the element, and if it is, reject any non-simulated events

      if ((elapsed && elapsed > 100 && elapsed < 1000) || (e.target._simulatedClick && !e._simulated)) {
        LD.DomEvent.stop(e);
        return;
      }
      LD.DomEvent._lastClick = timeStamp;

      return handler(e);
    }
  };

  LD.DomEvent.on = LD.DomEvent.addListener;
  LD.DomEvent.off = LD.DomEvent.removeListener;


  /*
   * LD.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
   */

  LD.Draggable = LD.Class.extend({
    includes: LD.Mixin.Events,

    statics: {
      START: LD.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
      END: {
        mousedown: 'mouseup',
        touchstart: 'touchend',
        pointerdown: 'touchend',
        MSPointerDown: 'touchend'
      },
      MOVE: {
        mousedown: 'mousemove',
        touchstart: 'touchmove',
        pointerdown: 'touchmove',
        MSPointerDown: 'touchmove'
      }
    },

    initialize: function (element, dragStartTarget) {
      this._element = element;
      this._dragStartTarget = dragStartTarget || element;
    },

    enable: function () {
      if (this._enabled) { return; }

      for (var i = LD.Draggable.START.length - 1; i >= 0; i--) {
        LD.DomEvent.on(this._dragStartTarget, LD.Draggable.START[i], this._onDown, this);
      }

      this._enabled = true;
    },

    disable: function () {
      if (!this._enabled) { return; }

      for (var i = LD.Draggable.START.length - 1; i >= 0; i--) {
        LD.DomEvent.off(this._dragStartTarget, LD.Draggable.START[i], this._onDown, this);
      }

      this._enabled = false;
      this._moved = false;
    },

    _onDown: function (e) {
      this._moved = false;

      if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

      LD.DomEvent.stopPropagation(e);

      if (LD.Draggable._disabled) { return; }

      LD.DomUtil.disableImageDrag();
      LD.DomUtil.disableTextSelection();

      if (this._moving) { return; }

      var first = e.touches ? e.touches[0] : e;

      this._startPoint = new LD.Point(first.clientX, first.clientY);
      this._startPos = this._newPos = LD.DomUtil.getPosition(this._element);

      LD.DomEvent
        .on(document, LD.Draggable.MOVE[e.type], this._onMove, this)
        .on(document, LD.Draggable.END[e.type], this._onUp, this);
    },

    _onMove: function (e) {
      if (e.touches && e.touches.length > 1) {
        this._moved = true;
        return;
      }

      var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
        newPoint = new LD.Point(first.clientX, first.clientY),
        offset = newPoint.subtract(this._startPoint);

      if (!offset.x && !offset.y) { return; }

      LD.DomEvent.preventDefault(e);

      if (!this._moved) {
        this.fire('dragstart');

        this._moved = true;
        this._startPos = LD.DomUtil.getPosition(this._element).subtract(offset);

        LD.DomUtil.addClass(document.body, 'leaflet-dragging');
        LD.DomUtil.addClass((e.target || e.srcElement), 'leaflet-drag-target');
      }

      this._newPos = this._startPos.add(offset);
      this._moving = true;

      LD.Util.cancelAnimFrame(this._animRequest);
      this._animRequest = LD.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
    },

    _updatePosition: function () {
      this.fire('predrag');
      LD.DomUtil.setPosition(this._element, this._newPos);
      this.fire('drag');
    },

    _onUp: function (e) {
      LD.DomUtil.removeClass(document.body, 'leaflet-dragging');
      LD.DomUtil.removeClass((e.target || e.srcElement), 'leaflet-drag-target');

      for (var i in LD.Draggable.MOVE) {
        LD.DomEvent
          .off(document, LD.Draggable.MOVE[i], this._onMove)
          .off(document, LD.Draggable.END[i], this._onUp);
      }

      LD.DomUtil.enableImageDrag();
      LD.DomUtil.enableTextSelection();

      if (this._moved) {
        // ensure drag is not fired after dragend
        LD.Util.cancelAnimFrame(this._animRequest);

        this.fire('dragend', {
          distance: this._newPos.distanceTo(this._startPos)
        });
      }

      this._moving = false;
    }
  });


}(window, document));
