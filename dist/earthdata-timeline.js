(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AXIS_HEIGHT, Draggable, LABELS, MAX_X, MAX_Y, MIN_X, MIN_Y, MONTHS, MS_PER_DAY, MS_PER_DECADE, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_MONTH, MS_PER_YEAR, OFFSET_X, RESOLUTIONS, ROW_FONT_HEIGHT, ROW_HEIGHT, ROW_PADDING, ROW_TEXT_OFFSET, TOP_HEIGHT, TemporalFencepost, TemporalSelection, Timeline, ZOOM_LEVELS, addContext, dateUtil, formatDate, formatDay, formatMonth, formatTime, formatYear, pluginUtil, stringUtil, svgUtil,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

stringUtil = require('./util/string');

pluginUtil = require('./util/plugin');

dateUtil = require('./util/date');

svgUtil = require('./util/svg');

Draggable = require('./timeline/draggable');

TemporalFencepost = require('./timeline/fencepost');

TOP_HEIGHT = 19;

ROW_HEIGHT = 26;

ROW_FONT_HEIGHT = 14;

ROW_PADDING = 5;

OFFSET_X = 48;

ROW_TEXT_OFFSET = TOP_HEIGHT + ROW_FONT_HEIGHT + ROW_PADDING;

AXIS_HEIGHT = 40;

MS_PER_MINUTE = 60000;

MS_PER_HOUR = MS_PER_MINUTE * 60;

MS_PER_DAY = MS_PER_HOUR * 24;

MS_PER_MONTH = MS_PER_DAY * 31;

MS_PER_YEAR = MS_PER_DAY * 366;

MS_PER_DECADE = MS_PER_YEAR * 10;

MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

MIN_X = -100000;

MIN_Y = -1000;

MAX_X = 100000;

MAX_Y = 1000;

formatTime = function(date) {
  return stringUtil.padLeft(date.getUTCHours(), '0', 2) + ':' + stringUtil.padLeft(date.getUTCMinutes(), '0', 2);
};

formatDay = function(date) {
  return stringUtil.padLeft(date.getUTCDate(), '0', 2);
};

formatMonth = function(date) {
  return MONTHS[date.getUTCMonth()];
};

formatDate = function(date) {
  return formatMonth(date) + ' ' + formatDay(date);
};

formatYear = function(date) {
  return date.getUTCFullYear();
};

addContext = function(dateStr, contextMatch, contextFn) {
  var result;
  result = [dateStr];
  if (dateStr === contextMatch) {
    result.push(contextFn());
  }
  return result;
};

LABELS = [
  (function(date) {
    return addContext(formatTime(date), '00:00', function() {
      return formatDate(date);
    });
  }), (function(date) {
    return addContext(formatTime(date), '00:00', function() {
      return formatDay(date) + ' ' + formatMonth(date) + ' ' + formatYear(date);
    });
  }), (function(date) {
    return addContext(formatDay(date), '01', function() {
      return formatMonth(date) + ' ' + formatYear(date);
    });
  }), (function(date) {
    return addContext(formatMonth(date), 'Jan', function() {
      return formatYear(date);
    });
  }), (function(date) {
    return [formatYear(date)];
  }), (function(date) {
    return [formatYear(date)];
  }), (function(date) {
    return [formatYear(date)];
  })
];

RESOLUTIONS = ['minute', 'hour', 'day', 'month', 'year', 'year', 'year'];

ZOOM_LEVELS = [MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY, MS_PER_MONTH, MS_PER_YEAR, MS_PER_DECADE, MS_PER_DECADE * 5];

TemporalSelection = (function() {
  function TemporalSelection(parent, left1, right1, attrs) {
    this.left = left1;
    this.right = right1;
    this.left.on('update', this.update, this);
    this.right.on('update', this.update, this);
    this.rect = svgUtil.buildSvgElement('rect', attrs);
    parent.appendChild(this.rect);
    this.update();
  }

  TemporalSelection.prototype.dispose = function() {
    var left, rect, right, update;
    left = this.left, right = this.right, update = this.update, rect = this.rect;
    left.off('update', update, this);
    right.off('update', update, this);
    rect.parentNode.removeChild(rect);
    return this.rect = null;
  };

  TemporalSelection.prototype.update = function(attrs) {
    var width, x;
    x = Math.min(this.left.x, this.right.x);
    width = Math.abs(this.right.x - this.left.x);
    svgUtil.updateSvgElement(this.rect, $.extend({}, attrs, {
      x: x,
      width: width
    }));
    return this;
  };

  return TemporalSelection;

})();

Timeline = (function(superClass) {
  extend(Timeline, superClass);

  function Timeline(root, namespace, options) {
    var ref;
    if (options == null) {
      options = {};
    }
    this._finishPan = bind(this._finishPan, this);
    this._onLabelMouseout = bind(this._onLabelMouseout, this);
    this._onLabelMouseover = bind(this._onLabelMouseover, this);
    this._onLabelClick = bind(this._onLabelClick, this);
    this._onKeydown = bind(this._onKeydown, this);
    this._onDataMouseout = bind(this._onDataMouseout, this);
    this._onDataMouseover = bind(this._onDataMouseover, this);
    this.data = bind(this.data, this);
    Timeline.__super__.constructor.call(this, root, namespace, options);
    this._rows = [];
    this.root.addClass('timeline');
    this.root.attr('tabindex', '1');
    this.root.append(this._buildDom());
    this.root.append(this._createDisplay());
    this._data = {};
    this.animate = (ref = options.animate) != null ? ref : true;
    this._zoom = 4;
    this.end = (options.end || new Date()) - 0;
    this.start = this.end - ZOOM_LEVELS[this._zoom];
    this.originPx = 0;
    this._loadedRange = [];
    this._updateTimeline();
    this.root.on('click.timeline', this.scope('.date-label'), this._onLabelClick);
    this.root.on('mouseover.timeline', this.scope('.date-label'), this._onLabelMouseover);
    this.root.on('mouseout.timeline', this.scope('.date-label'), this._onLabelMouseout);
    this.root.on('mouseover.timeline', this.scope('.data'), this._onDataMouseover);
    this.root.on('mouseout.timeline', this.scope('.data'), this._onDataMouseout);
    this.root.on('keydown.timeline', this._onKeydown);
    this.root.on('focusout.timeline', (function(_this) {
      return function(e) {
        _this.root.removeClass('hasfocus');
        _this._hasFocus = false;
        return _this._forceRedraw();
      };
    })(this));
    this.root.on('focusin.timeline', (function(_this) {
      return function(e) {
        var hovered;
        hovered = document.querySelector((_this.scope('.date-label')) + ":hover");
        if (hovered != null) {
          _this._onLabelClick({
            currentTarget: hovered
          });
        }
        _this.root.addClass('hasfocus');
        _this._forceRedraw();
        return setTimeout((function() {
          return _this._hasFocus = true;
        }), 500);
      };
    })(this));
  }

  Timeline.prototype.destroy = function() {
    this.root.find('svg').remove();
    this.root.off('.timeline');
    return Timeline.__super__.destroy.call(this);
  };

  Timeline.prototype.range = function() {
    var end, span, start;
    start = this.start, end = this.end;
    span = end - start;
    return [start - span, end + span, RESOLUTIONS[this._zoom - 2]];
  };

  Timeline.prototype.startTime = function() {
    return this.start;
  };

  Timeline.prototype.endTime = function() {
    return this.end;
  };

  Timeline.prototype.show = function() {
    this.root.show();
    this._setHeight();
    return null;
  };

  Timeline.prototype.hide = function() {
    this.root.hide();
    this._setHeight();
    this.focus();
    return null;
  };

  Timeline.prototype.loadstart = function(id, start, end, resolution) {
    var match;
    match = this.root[0].getElementsByClassName(id);
    if (match.length > 0) {
      match[0].setAttribute('class', (match[0].getAttribute('class')) + " " + (this.scope('loading')));
      return this._empty(match[0]);
    }
  };

  Timeline.prototype.data = function(id, data) {
    var row;
    row = this._getRow(id);
    this._loadedRange = [data.start, data.end, data.resolution];
    this._data[id] = [data.start, data.end, data.resolution, data.intervals, row.color];
    this._drawData(id);
    this._drawIndicators(id);
    this._drawData(id);
    return this._drawIndicators(id);
  };

  Timeline.prototype._drawIndicators = function(id) {
    var _, after_color, after_end, before_color, before_start, color, intervals, j, len, ref, ref1, row, row_max, row_min;
    row = null;
    ref = this._rows;
    for (j = 0, len = ref.length; j < len; j++) {
      row = ref[j];
      if (row.id === id) {
        break;
      }
    }
    if (row == null) {
      return;
    }
    ref1 = this._data[id], _ = ref1[0], _ = ref1[1], _ = ref1[2], intervals = ref1[3], color = ref1[4];
    color = color != null ? color : '#25c85b';
    row_min = row.min ? new Date(row.min * 1000) : new Date(0);
    row_max = row.max ? new Date(row.max * 1000) : new Date();
    before_start = row_max < this.start || intervals.length > 0 && intervals[intervals.length - 1][1] * 1000 < this.start;
    after_end = row_min > this.end || intervals.length > 0 && intervals[0][0] * 1000 > this.end;
    before_color = before_start ? color : 'transparent';
    after_color = after_end ? color : 'transparent';
    document.getElementById("arrow-left-" + id).setAttribute('style', "fill: " + before_color);
    document.getElementById("arrow-right-" + id).setAttribute('style', "fill: " + after_color);
    return null;
  };

  Timeline.prototype._drawData = function(id) {
    var _, attrs, color, el, end, endPos, endTime, i, index, intervals, j, l, len, len1, match, rect, ref, ref1, ref2, ref3, resolution, row, start, startPos, startTime, zoom;
    index = -1;
    ref = this._rows;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      row = ref[i];
      if (row.id === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      return;
    }
    zoom = this._zoom;
    ref2 = (ref1 = this._data[id]) != null ? ref1 : [this.start - 1, this.end + 1, RESOLUTIONS[zoom - 2], [], null], start = ref2[0], end = ref2[1], resolution = ref2[2], intervals = ref2[3], color = ref2[4];
    match = this.root[0].getElementsByClassName(id);
    el = null;
    if (match.length > 0) {
      el = match[0];
      this._empty(el);
      el.parentNode.removeChild(el);
    } else {
      el = this._buildSvgElement('g');
      if (index > 0) {
        this._translate(el, 0, ROW_HEIGHT * index);
      }
    }
    for (l = 0, len1 = intervals.length; l < len1; l++) {
      ref3 = intervals[l], startTime = ref3[0], endTime = ref3[1], _ = ref3[2];
      startPos = this.timeToPosition(startTime * 1000);
      endPos = this.timeToPosition(endTime * 1000);
      attrs = {
        x: startPos,
        y: 5,
        width: endPos - startPos,
        height: ROW_HEIGHT - 7,
        rx: 10,
        ry: 10
      };
      if (resolution !== RESOLUTIONS[zoom - 2]) {
        attrs['class'] = this.scope('imprecise');
      }
      rect = this._buildSvgElement('rect', attrs);
      if (color != null) {
        rect.setAttribute('style', "fill: " + color);
      }
      el.appendChild(rect);
    }
    el.setAttribute('class', id + " " + (this.scope('data')));
    this.tlRows.appendChild(el);
    this._drawIndicators(id);
    return null;
  };

  Timeline.prototype._onDataMouseover = function(e) {
    var data, dataTop, id, interval, intervals, leftEdge, matrix, nodes, resolution, rightEdge, start, stop, timelineTop, tooltip;
    tooltip = $('.timeline-tooltip');
    data = e.target;
    id = data.parentNode.className.baseVal.split(' ')[0];
    resolution = this._data[id][2];
    intervals = this._data[id][3];
    nodes = $(e.currentTarget.childNodes);
    interval = intervals[nodes.index(data)];
    start = interval[0] * 1000;
    stop = interval[1] * 1000;
    tooltip.find('.inner').text((this._dateWithResolution(start, resolution)) + " to " + (this._dateWithResolution(stop, resolution)));
    matrix = data.getScreenCTM();
    leftEdge = matrix.e + data.x.baseVal.value;
    rightEdge = leftEdge + data.width.baseVal.value;
    if (leftEdge < 0) {
      leftEdge = 0;
    }
    if (rightEdge > window.innerWidth) {
      rightEdge = window.innerWidth;
    }
    tooltip.css("left", ((leftEdge + rightEdge) / 2 - tooltip.width() / 2) + "px");
    dataTop = matrix.f;
    timelineTop = $('.timeline').offset().top;
    tooltip.css("top", (dataTop - timelineTop - 33) + "px");
    return tooltip.show();
  };

  Timeline.prototype._onDataMouseout = function(e) {
    return $('.timeline-tooltip').hide();
  };

  Timeline.prototype._dateWithResolution = function(date, resolution) {
    var index, str;
    str = dateUtil.dateToHumanUTC(date).split(' ');
    index = RESOLUTIONS.indexOf(resolution);
    if (index > 1) {
      str[3] = '';
      str[4] = '';
    }
    if (index > 2) {
      str[0] = '';
    }
    if (index > 3) {
      str[1] = '';
    }
    return str.join(' ');
  };

  Timeline.prototype._forceRedraw = function() {
    var callback, rect, svg;
    rect = this._buildRect({
      stroke: 'none',
      fill: 'none'
    });
    svg = this.svg;
    svg.appendChild(rect);
    callback = function() {
      return svg.removeChild(rect);
    };
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(callback);
    } else {
      return setTimeout(callback);
    }
  };

  Timeline.prototype.refresh = function() {
    return this.rows(this._rows);
  };

  Timeline.prototype.rows = function(rows) {
    var row;
    if ((rows != null ? rows.length : void 0) > 0) {
      this._rows = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = rows.length; j < len; j++) {
          row = rows[j];
          results.push($.extend({}, row));
        }
        return results;
      })();
      this._updateRowNames();
      this._drawTemporalBounds();
      this._empty(this.tlRows);
      this._data = {};
      this.show();
    } else {
      this.hide();
    }
    return this._rows;
  };

  Timeline.prototype.timeSpanToPx = function(t) {
    return t / this.scale;
  };

  Timeline.prototype.pxToTimeSpan = function(p) {
    return this.scale / p;
  };

  Timeline.prototype.timeToPosition = function(t) {
    var originPx, scale, start;
    originPx = this.originPx, start = this.start, scale = this.scale;
    return originPx + (t - start) / scale;
  };

  Timeline.prototype.positionToTime = function(p) {
    var originPx, scale, start;
    originPx = this.originPx, start = this.start, scale = this.scale;
    return Math.floor((p - originPx) * scale + start);
  };

  Timeline.prototype.zoomIn = function() {
    this.root.trigger('buttonzoom');
    return this._deltaZoom(-1);
  };

  Timeline.prototype.zoomOut = function() {
    this.root.trigger('buttonzoom');
    return this._deltaZoom(1);
  };

  Timeline.prototype.zoom = function(arg) {
    if (arg != null) {
      this._deltaZoom(arg - this._zoom);
      return null;
    } else {
      return this._zoom;
    }
  };

  Timeline.prototype.center = function(arg) {
    if (arg != null) {
      this.panToTime(arg + (this.end - this.start) / 2);
      return null;
    } else {
      return Math.round((this.end + this.start) / 2);
    }
  };

  Timeline.prototype._deltaZoom = function(levels, center_t) {
    var scale, timeSpan, x;
    if (center_t == null) {
      center_t = this.center();
    }
    this._zoom = Math.min(Math.max(this._zoom + levels, 2), ZOOM_LEVELS.length - 1);
    this.root.toggleClass(this.scope('max-zoom'), this._zoom === ZOOM_LEVELS.length - 1);
    this.root.toggleClass(this.scope('min-zoom'), this._zoom === 2);
    x = this.timeToPosition(center_t);
    timeSpan = ZOOM_LEVELS[this._zoom];
    scale = timeSpan / this.width;
    this.start = center_t - (scale * (x - this.originPx));
    this.end = this.start + timeSpan;
    this.scale = scale;
    this.focus();
    this._updateTimeline();
    return this._drawTemporalBounds();
  };

  Timeline.prototype.focus = function(t0, t1) {
    var left, overlay, right, root, startPt, stopPt;
    if (Math.abs(t0 - this._focus) < 1000) {
      if (!this._hasFocus) {
        return;
      }
      t0 = null;
    }
    this._focus = t0;
    root = this.root;
    overlay = this.focusOverlay;
    this._empty(overlay);
    if (t0 != null) {
      root.trigger(this.scopedEventName('focusset'), [t0, t1, RESOLUTIONS[this._zoom - 1]]);
      startPt = this.timeToPosition(t0);
      stopPt = this.timeToPosition(t1);
      left = this._buildRect({
        "class": this.scope('unfocused'),
        x1: startPt
      });
      overlay.appendChild(left);
      right = this._buildRect({
        "class": this.scope('unfocused'),
        x: stopPt
      });
      overlay.appendChild(right);
    } else {
      root.trigger(this.scopedEventName('focusremove'));
    }
    this._forceRedraw();
    return null;
  };

  Timeline.prototype.panToTime = function(time) {
    return this._pan(this.timeSpanToPx(this.end - time));
  };

  Timeline.prototype._getTransformX = svgUtil.getTransformX;

  Timeline.prototype._onKeydown = function(e) {
    var down, dx, focus, focusEnd, key, left, right, t0, t1, up, zoom;
    focus = this._focus;
    key = e.keyCode;
    left = 37;
    up = 38;
    right = 39;
    down = 40;
    if (focus && (key === left || key === right)) {
      this.root.trigger('arrowpan');
      zoom = this._zoom - 1;
      focusEnd = this._roundTime(focus, zoom, 1);
      if (key === left) {
        t0 = this._roundTime(focus, zoom, -1);
        t1 = focus - 1;
        dx = this.timeSpanToPx(focusEnd - focus);
      } else {
        t0 = focusEnd;
        t1 = this._roundTime(focus, zoom, 2) - 1;
        dx = -this.timeSpanToPx(t1 - t0);
      }
      if (this._canFocusTimespan(t0, t1)) {
        this._pan(dx);
        return this.focus(t0, t1);
      }
    }
  };

  Timeline.prototype._canFocusTimespan = function(start, stop) {
    var j, len, ref, row;
    ref = this._rows;
    for (j = 0, len = ref.length; j < len; j++) {
      row = ref[j];
      if (!row.canFocusTimespan || row.canFocusTimespan(start, stop)) {
        return true;
      }
    }
    return false;
  };

  Timeline.prototype._timespanForLabel = function(group) {
    var next, x0, x1;
    next = group.previousSibling;
    x0 = this._getTransformX(group);
    x1 = this._getTransformX(next, x0);
    return [this.positionToTime(x0), this.positionToTime(x1) - 1];
  };

  Timeline.prototype._onLabelClick = function(e) {
    var label, ref, start, stop;
    if (this._dragging) {
      return;
    }
    this.root.trigger('clicklabel');
    label = e.currentTarget;
    ref = this._timespanForLabel(label), start = ref[0], stop = ref[1];
    if (this._canFocusTimespan(start, stop)) {
      return this.focus(start, stop);
    }
  };

  Timeline.prototype._onLabelMouseover = function(e) {
    var label, ref, start, stop;
    label = e.currentTarget;
    ref = this._timespanForLabel(label), start = ref[0], stop = ref[1];
    if (!this._canFocusTimespan(start, stop)) {
      return label.setAttribute('class', (this.scope('date-label')) + " " + (this.scope('nofocus')));
    }
  };

  Timeline.prototype._onLabelMouseout = function(e) {
    var label;
    label = e.currentTarget;
    return label.setAttribute('class', this.scope('date-label'));
  };

  Timeline.prototype._contains = function(start0, end0, start1, end1) {
    return (start0 < start1 && start1 < end0) && (start0 < end1 && end1 < end0);
  };

  Timeline.prototype._empty = function(node) {
    return $(node).empty();
  };

  Timeline.prototype._buildSvgElement = svgUtil.buildSvgElement;

  Timeline.prototype._translate = function(el, x, y) {
    el.setAttribute('transform', "translate(" + x + ", " + y + ")");
    return el;
  };

  Timeline.prototype._buildDom = function() {
    return $('<div class="timeline-tools"> <h1></h1> <div class="timeline-tools-zoom"> <a class="timeline-zoom-in" href="#">+</a> <a class="timeline-zoom-out" href="#">&#8722;</a> </div> </div> <div class="timeline-tooltip top"> <div class="tooltip-arrow"></div> <div class="inner"></div> </div>');
  };

  Timeline.prototype._createDisplay = function() {
    var focus, offset, overlay, selection, svg, timeline, top;
    this.svg = svg = this._buildSvgElement('svg', {
      "class": this.scope('display')
    });
    offset = this.root.find(this.scope('.tools')).width();
    selection = this._createSelectionOverlay(svg);
    this._translate(selection, offset, 0);
    top = this._buildRect({
      "class": this.scope('display-top'),
      y: 0,
      y1: TOP_HEIGHT
    });
    this._setupTemporalSelection(top);
    this._translate(top, offset, 0);
    focus = this._createFocusOverlay(svg);
    this._translate(focus, offset, 0);
    overlay = this._createFixedOverlay(svg);
    this._translate(overlay, offset, 0);
    timeline = this._createTimeline(svg);
    this._translate(timeline, offset, 0);
    svg.appendChild(timeline);
    svg.appendChild(top);
    svg.appendChild(overlay);
    svg.appendChild(selection);
    svg.appendChild(focus);
    this._setupDragBehavior(svg);
    this._setupScrollBehavior(svg);
    return svg;
  };

  Timeline.prototype._setupTemporalSelection = function(el) {
    var draggable, left, right, root, self;
    self = this;
    root = this.root;
    $(el).on('click', (function(_this) {
      return function() {
        return root.trigger(_this.scopedEventName('temporalchange'), []);
      };
    })(this));
    draggable = new Draggable(el, this.animate);
    left = null;
    right = null;
    draggable.on('dragstart', (function(_this) {
      return function(arg1) {
        var cursor, j, overlay, ref, ref1, results;
        cursor = arg1.cursor;
        overlay = _this.selectionOverlay;
        _this._empty(overlay);
        return ref1 = _this._createSelectionRegion(overlay, cursor.x, cursor.x, (function() {
          results = [];
          for (var j = 0, ref = _this._rows.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
          return results;
        }).apply(this)), left = ref1[0], right = ref1[1], ref1;
      };
    })(this));
    draggable.on('dragmove', function(e) {
      return right._onUpdate(e);
    });
    return draggable.on('dragend', function(e) {
      root.trigger('createdtemporal');
      return right._onEnd(e);
    });
  };

  Timeline.prototype._setupScrollBehavior = function(svg) {
    var allowWheel, doScroll, getTime, onWheel, rateLimit, touchCenter, touchSeparation;
    allowWheel = true;
    rateLimit = function() {
      allowWheel = false;
      return setTimeout((function() {
        return allowWheel = true;
      }), 300);
    };
    getTime = (function(_this) {
      return function(e) {
        var draggable, origin, time, x;
        draggable = _this.root.find(_this.scope('.draggable'))[0];
        origin = _this._getTransformX(draggable);
        x = e.clientX - svg.clientLeft - origin;
        return time = _this.positionToTime(x);
      };
    })(this);
    doScroll = (function(_this) {
      return function(deltaX, deltaY, time) {
        var levels;
        if (!allowWheel) {
          return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          levels = deltaY > 0 ? -1 : 1;
          _this.root.trigger('scrollzoom');
          _this._deltaZoom(levels, time);
          return rateLimit();
        } else if (deltaX !== 0) {
          _this.root.trigger('scrollpan');
          return _this._pan(deltaX);
        }
      };
    })(this);
    onWheel = function(e) {
      var deltaX, deltaY;
      deltaX = e.wheelDeltaX;
      deltaY = e.wheelDeltaY;
      doScroll(deltaX, deltaY, getTime(e));
      return e.preventDefault();
    };
    svg.addEventListener('mousewheel', onWheel);
    svg.addEventListener('DOMMouseScroll', onWheel);
    svg.addEventListener('wheel', function(e) {
      var deltaX, deltaY;
      if (e.type === "mousewheel") {
        return;
      }
      deltaX = -e.deltaX;
      deltaY = -e.deltaY;
      doScroll(deltaX, deltaY, getTime(e));
      return e.preventDefault();
    });
    touchSeparation = 0;
    touchCenter = 0;
    svg.addEventListener('touchstart', function(e) {
      var center, time;
      if (!(e.touches && e.touches.length === 2)) {
        return;
      }
      center = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      time = getTime({
        clientX: center
      });
      touchSeparation = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      return e.preventDefault();
    });
    return svg.addEventListener('touchmove', function(e) {
      var deltaY;
      if (!(e.touches && e.touches.length === 2)) {
        return;
      }
      deltaY = Math.abs(e.touches[0].clientX - e.touches[1].clientX) - touchSeparation;
      return doScroll(0, -deltaY, touchCenter);
    });
  };

  Timeline.prototype._setupDragBehavior = function(svg) {
    var draggable, dx, el;
    el = svg.querySelector(this.scope('.draggable'));
    draggable = new Draggable(el, this.animate);
    dx = 0;
    draggable.on('dragmove', (function(_this) {
      return function(e) {
        dx = e.offset.x;
        if (Math.abs(dx) > 5) {
          _this._dragging = true;
        }
        return _this._pan(dx, false);
      };
    })(this));
    return draggable.on('dragend', (function(_this) {
      return function(e) {
        dx = e.offset.x;
        _this.root.trigger('draggingpan');
        _this._dragging = false;
        return _this._pan(dx);
      };
    })(this));
  };

  Timeline.prototype._pan = function(dx, commit) {
    var draggables, end, span, start;
    if (commit == null) {
      commit = true;
    }
    if (this._panStart == null) {
      this._startPan();
    }
    start = this._panStart;
    end = this._panEnd;
    span = end - start;
    this.start = start - dx * this.scale;
    this.end = this.start + span;
    this.originPx = -(this._panStartX + dx);
    draggables = this.root.find([this.scope('.draggable'), this.scope('.selection'), this.scope('.display-top'), this.scope('.focus')].join(', '));
    draggables.attr('transform', "translate(" + (-this.originPx + OFFSET_X) + ",0)");
    this._forceRedraw();
    if (commit) {
      return this._finishPan();
    }
  };

  Timeline.prototype._startPan = function() {
    var draggable;
    draggable = this.root.find(this.scope('.draggable'))[0];
    this._panStartX = this._getTransformX(draggable, OFFSET_X) - OFFSET_X;
    this._panStart = this.start;
    return this._panEnd = this.end;
  };

  Timeline.prototype._finishPan = function() {
    this._updateTimeline();
    return this._panStartX = this._panStart = this._panEnd = null;
  };

  Timeline.prototype._createSelectionOverlay = function(svg) {
    return this.selectionOverlay = this._buildSvgElement('g', {
      "class": this.scope('selection')
    });
  };

  Timeline.prototype._createFocusOverlay = function(svg) {
    return this.focusOverlay = this._buildSvgElement('g', {
      "class": this.scope('focus')
    });
  };

  Timeline.prototype._createFixedOverlay = function(svg) {
    var overlay, rows;
    this.overlay = overlay = this._buildSvgElement('g', {
      "class": this.scope('overlay')
    });
    this.olRows = rows = this._buildSvgElement('g', {
      "class": this.scope('row')
    });
    this._translate(rows, 5, ROW_TEXT_OFFSET);
    overlay.appendChild(rows);
    return overlay;
  };

  Timeline.prototype._createTimeline = function(svg) {
    var axis, background, rows, timeline;
    this.timeline = timeline = this._buildSvgElement('g', {
      "class": this.scope('draggable')
    });
    background = this._buildSvgElement('rect', {
      "class": this.scope('background'),
      x: MIN_X,
      y: MIN_Y,
      width: MAX_X - MIN_X,
      height: MAX_Y - MIN_Y
    });
    this.tlRows = rows = this._buildSvgElement('g');
    this._translate(rows, 0, TOP_HEIGHT);
    this.axis = axis = this._buildSvgElement('g');
    this._translate(axis, 0, TOP_HEIGHT);
    timeline.appendChild(background);
    timeline.appendChild(axis);
    timeline.appendChild(rows);
    return timeline;
  };

  Timeline.prototype._buildIndicatorArrow = function(id, transform) {
    var g;
    g = this._buildSvgElement('g', {
      "class": this.scope('indicator'),
      id: id,
      transform: transform
    });
    g.appendChild(this._buildSvgElement('path', {
      d: 'M 0 -5 L 6 1 L 8 -1 L 4 -5 L 8 -9 L 6 -11 z'
    }));
    g.appendChild(this._buildSvgElement('path', {
      d: 'M 5 -5 L 11 1 L 13 -1 L 9 -5 L 13 -9 L 11 -11 z'
    }));
    return g;
  };

  Timeline.prototype._updateRowNames = function() {
    var fn, j, len, overlay, row, rows, textGroup, txt, y;
    rows = this._rows;
    overlay = this.olRows;
    this._empty(overlay);
    y = 0;
    textGroup = this._buildSvgElement('g');
    for (j = 0, len = rows.length; j < len; j++) {
      row = rows[j];
      overlay.appendChild(this._buildIndicatorArrow("arrow-left-" + row.id, "translate(0, " + y + ")"));
      overlay.appendChild(this._buildIndicatorArrow("arrow-right-" + row.id, "translate(" + (this.width - 20) + ", " + (y - 10) + ") rotate(180)"));
      txt = this._buildSvgElement('text', {
        x: 15,
        y: y
      });
      txt.textContent = row.title;
      textGroup.appendChild(txt);
      y += ROW_HEIGHT;
    }
    overlay.appendChild(textGroup);
    fn = (function(_this) {
      return function() {
        var bbox, rect;
        bbox = textGroup.getBBox();
        rect = _this._buildSvgElement('rect', {
          x: bbox.x,
          y: -ROW_FONT_HEIGHT - ROW_PADDING,
          width: bbox.width,
          height: y,
          "class": _this.scope('shadow')
        });
        if (overlay.firstChild) {
          return overlay.insertBefore(rect, overlay.firstChild);
        }
      };
    })(this);
    setTimeout(fn, 0);
    return null;
  };

  Timeline.prototype._updateTimeline = function() {
    var _, axis, elWidth, end, j, k, len, line, loadedEnd, loadedResolution, loadedStart, node, range, ref, ref1, ref2, resolution, root, start, timeline, width, zoom;
    axis = this.axis, timeline = this.timeline, start = this.start, end = this.end, root = this.root;
    zoom = this._zoom;
    this._empty(axis);
    root.find('h1').text(RESOLUTIONS[zoom - 1]);
    line = this._buildSvgElement('line', {
      "class": this.scope('timeline'),
      x1: MIN_X,
      y1: 0,
      x2: MAX_X,
      y2: 0
    });
    axis.appendChild(line);
    elWidth = root.width();
    if (elWidth === 0) {
      elWidth = $(window).width();
    }
    this.width = width = elWidth - root.find(this.scope('.tools')).width();
    this.scale = (end - start) / width;
    range = this.range();
    this._drawIntervals(range[0], range[1], zoom - 1);
    ref = this._data;
    for (k in ref) {
      if (!hasProp.call(ref, k)) continue;
      _ = ref[k];
      this._drawData(k);
    }
    resolution = range[2];
    ref1 = this._loadedRange, loadedStart = ref1[0], loadedEnd = ref1[1], loadedResolution = ref1[2];
    if (!(loadedResolution === resolution && this._contains(loadedStart, loadedEnd, start, end))) {
      ref2 = this.tlRows.childNodes;
      for (j = 0, len = ref2.length; j < len; j++) {
        node = ref2[j];
        node.setAttribute('class', (node.getAttribute('class')) + " " + (this.scope('loading')));
      }
    }
    return root.trigger(this.scopedEventName('rangechange'), range);
  };

  Timeline.prototype.setTemporal = function(ranges) {
    return this._globalTemporal = ranges;
  };

  Timeline.prototype.setRowTemporal = function(id, ranges) {
    var row;
    row = this._getRow(id);
    if (row) {
      return row.temporal = ranges;
    }
  };

  Timeline.prototype._getRow = function(id) {
    var j, len, ref, row;
    ref = this._rows;
    for (j = 0, len = ref.length; j < len; j++) {
      row = ref[j];
      if (row.id === id) {
        return row;
      }
    }
    return null;
  };

  Timeline.prototype._drawTemporalBounds = function() {
    var globalIndexes, index, j, len, overlay, row, rows;
    overlay = this.selectionOverlay;
    rows = this._rows;
    this._empty(overlay);
    if (!(rows.length > 0)) {
      return;
    }
    globalIndexes = [];
    for (index = j = 0, len = rows.length; j < len; index = ++j) {
      row = rows[index];
      if (row.temporal) {
        this._createTemporalRegion(overlay, row.temporal, [index]);
      } else {
        globalIndexes.push(index);
      }
    }
    if (this._globalTemporal) {
      return this._createTemporalRegion(overlay, this._globalTemporal, globalIndexes);
    }
  };

  Timeline.prototype._createSelectionRegion = function(overlay, x0, x1, indexes) {
    var index, j, left, len, right, update;
    left = new TemporalFencepost(overlay, x0, MAX_Y);
    right = new TemporalFencepost(overlay, x1, MAX_Y);
    update = function() {
      var leftX, rightX, start, stop;
      leftX = Math.min(left.x, right.x);
      rightX = Math.max(left.x, right.x);
      start = new Date(this.positionToTime(leftX));
      stop = new Date(this.positionToTime(rightX));
      this.root.trigger(this.scopedEventName('temporalchange'), start, stop);
      return null;
    };
    left.on('commit', update, this);
    right.on('commit', update, this);
    left.on('update', this._forceRedraw, this);
    right.on('update', this._forceRedraw, this);
    for (j = 0, len = indexes.length; j < len; j++) {
      index = indexes[j];
      new TemporalSelection(overlay, left, right, {
        "class": this.scope('selection-region'),
        y: TOP_HEIGHT + ROW_HEIGHT * index,
        height: ROW_HEIGHT
      });
    }
    return [left, right];
  };

  Timeline.prototype._createTemporalRegion = function(overlay, temporal, indexes) {
    var j, len, ref, results, start, stop;
    results = [];
    for (j = 0, len = temporal.length; j < len; j++) {
      ref = temporal[j], start = ref[0], stop = ref[1];
      results.push(this._createSelectionRegion(overlay, this.timeToPosition(start), this.timeToPosition(stop), indexes));
    }
    return results;
  };

  Timeline.prototype._buildRect = function(attrs) {
    attrs = $.extend({
      x: MIN_X,
      x1: MAX_X,
      y: MIN_Y,
      y1: MAX_Y
    }, attrs);
    if (attrs['width'] == null) {
      attrs['width'] = (attrs.x1 - attrs.x) | 0;
    }
    if (attrs['height'] == null) {
      attrs['height'] = (attrs.y1 - attrs.y) | 0;
    }
    delete attrs.x1;
    delete attrs.y1;
    return this._buildSvgElement('rect', attrs);
  };

  Timeline.prototype._roundTime = function(time, zoom, increment) {
    var c, components, date;
    if (increment == null) {
      increment = 0;
    }
    time = Math.round(time / 1000) * 1000;
    date = new Date(time);
    components = (function() {
      var j, len, ref, results;
      ref = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes'];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        results.push(date["getUTC" + c]());
      }
      return results;
    })();
    components = components.slice(0, Math.max(components.length - zoom, 1));
    if (zoom === ZOOM_LEVELS.length - 2) {
      components[0] = Math.floor(components[0] / 10) * 10;
      increment *= 10;
    }
    components[components.length - 1] += increment;
    if (components.length === 1) {
      components.push(0);
    }
    return Date.UTC.apply(Date, components);
  };

  Timeline.prototype._drawIntervals = function(start, end, zoom) {
    var axis, date, interval, next, prev, results, time;
    axis = this.axis;
    start = this._roundTime(start, zoom);
    end = this._roundTime(end, zoom);
    time = end;
    results = [];
    while (time >= start) {
      date = new Date(time);
      prev = this._roundTime(time, zoom, -1);
      next = this._roundTime(time, zoom, 1);
      interval = this._buildIntervalDisplay.apply(this, [this.timeToPosition(time), this.timeToPosition(next)].concat(slice.call(LABELS[zoom](date))));
      axis.appendChild(interval);
      results.push(time = prev);
    }
    return results;
  };

  Timeline.prototype._buildIntervalDisplay = function(x0, x1, text, subText) {
    var bg, circle, g, label, line, lineClass, subLabel, width;
    g = this._buildSvgElement('g', {
      "class": this.scope('date-label')
    });
    this._translate(g, x0, 0);
    width = x1 - x0;
    if (x1 != null) {
      bg = this._buildSvgElement('rect', {
        x: 0,
        y: 0,
        width: width,
        height: MAX_Y - MIN_Y
      });
      g.appendChild(bg);
    }
    label = this._buildSvgElement('text', {
      x: 5,
      y: 20,
      "class": (this.scope('axis-label')) + " " + (this.scope('axis-super-label'))
    });
    label.textContent = text;
    lineClass = this.scope('tick');
    if (subText) {
      lineClass += ' ' + this.scope('interval-start');
    }
    line = this._buildSvgElement('line', {
      "class": lineClass,
      x1: 0,
      y1: MIN_Y,
      x2: 0,
      y2: MAX_Y
    });
    circle = this._buildSvgElement('circle', {
      "class": this.scope('tick-crossing'),
      r: 6,
      cx: width
    });
    g.appendChild(line);
    g.appendChild(circle);
    g.appendChild(label);
    if (subText) {
      subLabel = this._buildSvgElement('text', {
        x: 5,
        y: 34,
        "class": (this.scope('axis-label')) + " " + (this.scope('axis-sub-label'))
      });
      subLabel.textContent = subText;
      g.appendChild(subLabel);
    }
    return g;
  };

  Timeline.prototype._setHeight = function() {
    var ref, rowsHeight, totalHeight;
    if (((ref = this._rows) != null ? ref.length : void 0) > 0) {
      rowsHeight = this._rows.length * ROW_HEIGHT + 2 * ROW_PADDING;
      this._translate(this.axis, 0, TOP_HEIGHT + rowsHeight);
      totalHeight = Math.max(TOP_HEIGHT + rowsHeight + AXIS_HEIGHT, 100);
      this.root.height(totalHeight);
      return $(this.svg).height(totalHeight);
    }
  };

  return Timeline;

})(pluginUtil.Base);

pluginUtil.create('timeline', Timeline);

},{"./timeline/draggable":2,"./timeline/fencepost":3,"./util/date":4,"./util/plugin":5,"./util/string":6,"./util/svg":7}],2:[function(require,module,exports){
var Draggable, browserPrefix, cancelAnimFrame, getOffset, requestAnimFrame, svgUtil,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

svgUtil = require('../util/svg');

browserPrefix = function(name) {
  return window['webkit' + name] || window['moz' + name] || window['ms' + name];
};

requestAnimFrame = window.requestAnimationFrame || browserPrefix('RequestAnimationFrame') || function(fn) {
  return window.setTimeout(fn);
};

cancelAnimFrame = window.cancelAnimationFrame || browserPrefix('CancelAnimationFrame') || browserPrefix('CancelRequestAnimationFrame') || function(id) {
  return window.clearTimeout(id);
};

getOffset = function(e) {
  var el, x, y;
  el = e.target;
  x = y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  x = e.clientX - x;
  y = e.clientY - y;
  return {
    x: x,
    y: y
  };
};

module.exports = Draggable = (function() {
  function Draggable(element, animate) {
    this.animate = animate != null ? animate : true;
    this._mouseup = bind(this._mouseup, this);
    this._mousemove = bind(this._mousemove, this);
    this._mousedown = bind(this._mousedown, this);
    this._dragging = false;
    this._element = element;
    this.enable();
  }

  Draggable.prototype.dispose = function() {
    return this.disable();
  };

  Draggable.prototype.enable = function() {
    var el;
    el = this._element;
    el.addEventListener("mousedown", this._mousedown);
    return el.addEventListener("touchstart", this._mousedown);
  };

  Draggable.prototype.disable = function() {
    var el;
    el = this._element;
    el.removeEventListener("mousedown", this._mousedown);
    return el.removeEventListener("touchstart", this._mousedown);
  };

  Draggable.prototype.on = function(events, fn, context) {
    var base, event, j, len, ref;
    if (this._listeners == null) {
      this._listeners = {};
    }
    if (context == null) {
      context = this;
    }
    ref = events.split(' ');
    for (j = 0, len = ref.length; j < len; j++) {
      event = ref[j];
      if ((base = this._listeners)[event] == null) {
        base[event] = [];
      }
      this._listeners[event].push([fn, context]);
    }
    return this;
  };

  Draggable.prototype.off = function(events, fn, context) {
    var event, i, j, len, listeners, ref;
    if (this._listeners == null) {
      this._listeners = {};
    }
    ref = events.split(' ');
    for (j = 0, len = ref.length; j < len; j++) {
      event = ref[j];
      listeners = this._listeners[event];
      if (listeners != null) {
        i = 0;
        while (i < listeners.length) {
          if (listeners[i][0] === fn && listeners[i][1] === context) {
            listeners.splice(i, 1);
          } else {
            i++;
          }
        }
        if (listeners.length === 0) {
          delete this._listeners[event];
        }
      }
    }
    return this;
  };

  Draggable.prototype.fire = function(event, data) {
    var context, e, fn, j, len, listeners, ref, ref1;
    console.log(event, JSON.stringify(data));
    listeners = (ref = this._listeners) != null ? ref[event] : void 0;
    if (listeners == null) {
      return this;
    }
    e = $.extend({}, data != null ? data : {}, {
      type: event,
      target: this
    });
    for (j = 0, len = listeners.length; j < len; j++) {
      ref1 = listeners[j], fn = ref1[0], context = ref1[1];
      fn.call(context, e);
    }
    return this;
  };

  Draggable.prototype._mousedown = function(e) {
    var ref;
    if (e.shiftKey || (e.which !== 1 && e.button !== 1 && !e.touches)) {
      return;
    }
    e.stopPropagation();
    if (this._dragging) {
      return;
    }
    e = ((ref = e.touches) != null ? ref[0] : void 0) || e;
    this._preStartCursor = getOffset(e);
    document.addEventListener("mousemove", this._mousemove);
    document.addEventListener("touchmove", this._mousemove);
    document.addEventListener("mouseup", this._mouseup);
    return document.addEventListener("touchend", this._mouseup);
  };

  Draggable.prototype._mousemove = function(e) {
    var cursor, offset, ref, ref1;
    if (((ref = e.touches) != null ? ref.length : void 0) > 1) {
      return;
    }
    e = ((ref1 = e.touches) != null ? ref1[0] : void 0) || e;
    cursor = getOffset(e);
    offset = {
      x: cursor.x - this._preStartCursor.x,
      y: cursor.y - this._preStartCursor.y
    };
    if (Math.abs(offset.x) + Math.abs(offset.y) < 3) {
      return;
    }
    e.preventDefault();
    if (!this._dragging) {
      this._startCursor = cursor;
      this._startLoc = this._currentLoc = this._getLoc();
    }
    this._currentOffset = offset = {
      x: cursor.x - this._startCursor.x,
      y: cursor.y - this._startCursor.y
    };
    this._currentLoc = {
      x: this._startLoc.x + offset.x,
      y: this._startLoc.y + offset.y
    };
    this._currentCursor = {
      x: -this._startLoc.x + this._startCursor.x + offset.x,
      y: -this._startLoc.y + this._startCursor.y + offset.y
    };
    if (!this._dragging) {
      this._start();
    }
    if (this.animate) {
      cancelAnimFrame(this._frameId);
      return this._frameId = requestAnimFrame((function(_this) {
        return function() {
          return _this._move();
        };
      })(this));
    } else {
      return this._move();
    }
  };

  Draggable.prototype._mouseup = function(e) {
    document.removeEventListener("mousemove", this._mousemove);
    document.removeEventListener("touchmove", this._mousemove);
    document.removeEventListener("mouseup", this._mouseup);
    document.removeEventListener("touchend", this._mouseup);
    if (this.animate) {
      cancelAnimFrame(this._frameId);
    }
    return this._end();
  };

  Draggable.prototype._start = function() {
    this._dragging = true;
    this._positions = [];
    this._times = [];
    return this.fire('dragstart', this._state());
  };

  Draggable.prototype._move = function() {
    var time;
    this.fire('predragmove', this._state());
    time = +new Date();
    this._positions.push(this._currentLoc.x);
    this._times.push(time);
    if (time - this._times[0] > 200) {
      this._positions.shift();
      this._times.shift();
    }
    return this.fire('dragmove', this._state());
  };

  Draggable.prototype._animateEnd = function() {
    var dt, dx, v;
    dx = this._currentLoc.x - this._positions[0];
    dt = +new Date() - this._times[0];
    v = dx / dt;
    return this._animateFling(v, .01, +new Date());
  };

  Draggable.prototype._end = function() {
    var ref;
    if (this.animate && ((ref = this._positions) != null ? ref.length : void 0) > 0) {
      return this._animateEnd();
    } else {
      return this._staticEnd();
    }
  };

  Draggable.prototype._animateFling = function(v, a, t) {
    var dt, dv, now;
    now = +new Date();
    dt = now - t;
    dv = a * dt;
    if (v < 0) {
      v += dv;
    } else {
      v -= dv;
    }
    if (dv < Math.abs(v)) {
      this._currentLoc.x += v * dt;
      this._currentOffset.x += v * dt;
      this._move();
      return requestAnimFrame((function(_this) {
        return function() {
          return _this._animateFling(v, a, now);
        };
      })(this));
    } else {
      return this._staticEnd();
    }
  };

  Draggable.prototype._staticEnd = function() {
    this._dragging = false;
    return this.fire('dragEnd', this._state());
  };

  Draggable.prototype._getLoc = function() {
    return {
      x: svgUtil.getTransformX(this._element),
      y: 0
    };
  };

  Draggable.prototype._state = function() {
    return {
      start: this._startLoc,
      offset: this._currentOffset,
      cursor: this._currentCursor
    };
  };

  return Draggable;

})();

},{"../util/svg":7}],3:[function(require,module,exports){
var Draggable, TemporalFencepost, svgUtil,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Draggable = require('./draggable');

svgUtil = require('../util/svg');

module.exports = TemporalFencepost = (function(superClass) {
  extend(TemporalFencepost, superClass);

  function TemporalFencepost(parent, x, height) {
    this.height = height;
    this.line = svgUtil.buildSvgElement('line');
    this.triangle = svgUtil.buildSvgElement('path');
    this.update(x);
    parent.appendChild(this.line);
    parent.appendChild(this.triangle);
    TemporalFencepost.__super__.constructor.call(this, this.triangle, true);
    this.on('dragend', this._onEnd, this);
    this.on('predrag', this._onUpdate, this);
  }

  TemporalFencepost.prototype.dispose = function() {
    var line, triangle;
    line = this.line, triangle = this.triangle;
    this.line = this.triangle = null;
    line.parentNode.removeChild(line);
    triangle.parentNode.removeChild(triangle);
    return this.disable();
  };

  TemporalFencepost.prototype.update = function(x) {
    var h, half_w, y;
    this.x = x;
    y = 0;
    half_w = 10;
    h = 10;
    svgUtil.updateSvgElement(this.line, {
      x1: x,
      y1: y + h,
      x2: x,
      y2: this.height
    });
    svgUtil.updateSvgElement(this.triangle, {
      d: "m" + (x - half_w) + " " + y + " l " + half_w + " " + h + " l " + half_w + " " + (-h) + " z"
    });
    this.fire('update', {
      x: x
    });
    return this;
  };

  TemporalFencepost.prototype._onUpdate = function(e) {
    return this.update(e.cursor.x);
  };

  TemporalFencepost.prototype._onEnd = function(e) {
    this._onUpdate(e.cursor.x);
    this.fire('commit', {
      x: e.cursor.x
    });
    return this._startX = null;
  };

  return TemporalFencepost;

})(Draggable);

},{"../util/svg":7,"./draggable":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var Base, clickHandler, create, setupClickHandlers, stringUtil,
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  slice = [].slice;

stringUtil = require('./string');

clickHandler = function(pluginName, method, rootSelector, dataArg) {
  return function(e) {
    var $root, $this, href;
    $this = $(this);
    if ($this.is('a') || $(e.target).closest('a').length === 0) {
      $root = $this.closest(rootSelector);
      if ($root.length === 0) {
        href = $this.attr('href');
        if ((href != null) && href.length > 1) {
          $root = $(href);
        }
      }
      $root[pluginName](method, $this.attr(dataArg));
    }
    return false;
  };
};

setupClickHandlers = function(pluginName, Class) {
  var $document, classname, fn, handler, method, prefix, ref, results, rootSelector, selector, specialMethods;
  specialMethods = ['constructor', 'destroy'];
  $document = $(document);
  prefix = stringUtil.dasherize(pluginName);
  rootSelector = "." + prefix;
  ref = Class.prototype;
  results = [];
  for (method in ref) {
    if (!hasProp.call(ref, method)) continue;
    fn = ref[method];
    if (!(indexOf.call(specialMethods, method) >= 0 || method.indexOf('_') === 0)) {
      classname = prefix + "-" + (stringUtil.dasherize(method));
      selector = "." + classname;
      handler = clickHandler(pluginName, method, rootSelector, "data-" + classname);
      results.push($document.on('click', selector, handler));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

create = function(pluginName, Class) {
  if (!Class.noClickHandlers) {
    setupClickHandlers(pluginName, Class);
  }
  return $.fn[pluginName] = function() {
    var args, attr, el, instance, method, ref, result, x;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (args.length > 0 && typeof args[0] === 'string') {
      ref = args, method = ref[0], args = 2 <= ref.length ? slice.call(ref, 1) : [];
      result = (function() {
        var i, len, ref1, results;
        results = [];
        for (i = 0, len = this.length; i < len; i++) {
          el = this[i];
          instance = $.data(el, pluginName);
          if (!instance) {
            console.warn(pluginName + " not found on element");
            results.push(el);
          } else if (/^debug_/.test(method)) {
            ref1 = method.split('_'), x = ref1[0], attr = 2 <= ref1.length ? slice.call(ref1, 1) : [];
            results.push(instance[attr.join('_')]);
          } else if (method === 'destroy') {
            $.removeData(el, pluginName);
            if (typeof (instance != null ? instance.destroy : void 0) === 'function') {
              results.push(instance.destroy());
            } else {
              results.push(void 0);
            }
          } else if (!/^_/.test(method) && typeof (instance != null ? instance[method] : void 0) === 'function') {
            results.push(instance[method].apply(instance, args));
          } else {
            console.error("Could not call " + method + " on " + pluginName + " instance:", el);
            results.push(null);
          }
        }
        return results;
      }).call(this);
      return result[0];
    } else if (args.length < 2) {
      return this.each(function() {
        var obj, options;
        options = args[0];
        if ($.data(this, pluginName) == null) {
          obj = new Class($(this), pluginName, options);
          return $.data(this, pluginName, obj);
        }
      });
    } else {
      console.error("Bad arguments to " + pluginName + ":", args);
      return this;
    }
  };
};

Base = (function() {
  function Base(root, namespace, _options) {
    this.root = root;
    this.namespace = namespace;
    this._options = _options;
    this.cssScope = stringUtil.dasherize(this.namespace);
  }

  Base.prototype.destroy = function() {};

  Base.prototype.scope = function(name, options) {
    var before, i, len, prefix, prefixes;
    if (options == null) {
      options = {};
    }
    prefixes = ['.', 'is-'];
    before = "";
    for (i = 0, len = prefixes.length; i < len; i++) {
      prefix = prefixes[i];
      if (!(name.indexOf(prefix) === 0)) {
        continue;
      }
      before += prefix;
      name = name.substring(prefix.length);
    }
    return "" + before + this.cssScope + "-" + name;
  };

  Base.prototype.scopedEventName = function(name) {
    return name + "." + this.namespace;
  };

  return Base;

})();

exports.create = create;

exports.Base = Base;

},{"./string":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var getTransformAttr = function(el) {
  return el.getAttribute('transform')
    || el.parentNode.getAttribute('transform')
    || '';
};

var getLeftAttr = function(el) {
  return el.getAttribute('left')
    || el.parentNode.getAttribute('left')
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

exports.updateSvgElement = updateSvgElement;

exports.buildSvgElement = function(name, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);
  return updateSvgElement(el, attrs);
};

exports.getTransformX = function(el, defaultValue) {
  var re, match, result, left;
  result = defaultValue || 0;
  if (el) {
    match = /^[^\d\-]*(-?[\d\.]+)/.exec(getTransformAttr(el));
    if (match && match[1]) {
      result = parseFloat(match[1]);
    }
  }
  return result;
};

},{}]},{},[1]);
