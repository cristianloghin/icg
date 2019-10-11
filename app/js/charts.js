'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Chart = function () {
  var options = {
    'width': 400,
    'height': 400,
    'radius': 180
  }; // chart map

  var _chart = {
    'type': '',
    'unit': '',
    'values': [],
    'total': 0,
    'max': 0,
    'slices': [],
    'bars': []
  }; // private methods
  // get

  function _get_slice(value) {
    return value / _chart.total * 100;
  }

  function _get_angle(value) {
    return value / _chart.total * 360;
  }

  function _get_radians(value) {
    return value / _chart.total * 360 * (Math.PI / 180);
  }

  function _get_total_radians(index) {
    var total = _chart.slices[index].radians;

    for (var i = index - 1; i >= 0; i--) {
      total += _chart.slices[i].radians;
    }

    return total;
  }

  function _get_points(index) {
    var points = [];
    points.push(_get_start_point(index));

    if (_chart.slices[index].angle > 180) {
      points.push(_get_mid_point(index));
    }

    points.push(_get_end_point(index));
    return points;
  }

  function _get_start_point(index) {
    var point = {};

    if (index == 0) {
      point = {
        'x': options.width - (options.width - 2 * options.radius) / 2,
        'y': options.width / 2
      };
    } else {
      point = _get_end_point(index - 1);
    }

    return point;
  }

  function _get_mid_point(index) {
    var point = {};

    if (index == 0) {
      point = {
        'x': options.width / 2 + options.radius * Math.cos(Math.PI),
        'y': options.width / 2 + options.radius * Math.sin(Math.PI)
      };
    } else {
      var radians = _get_total_radians(index - 1) + Math.PI;
      point = {
        'x': options.width / 2 + options.radius * Math.cos(radians),
        'y': options.width / 2 + options.radius * Math.sin(radians)
      };
    }

    return point;
  }

  function _get_end_point(index) {
    var point = {};

    if (index == _chart.slices.length - 1) {
      point = {
        'x': options.width - (options.width - 2 * options.radius) / 2,
        'y': options.width / 2
      };
    } else {
      var radians = _get_total_radians(index);

      point = {
        'x': options.width / 2 + options.radius * Math.cos(radians),
        'y': options.width / 2 + options.radius * Math.sin(radians)
      };
    }

    return point;
  } // set


  function _set_values(string) {
    _chart.values = string.split(';').map(function (val) {
      var pair = val.split(':');

      if (pair.length == 1) {
        pair.push('');
        pair.reverse();
      }

      pair[1] = Number(pair[1]);
      return pair;
    });
  }

  function _set_total_max() {
    var values = _chart.values.map(function (value) {
      return value[1];
    }); // calculate total


    _chart.total = values.reduce(function (total, val) {
      return total += Math.abs(val);
    }, 0); // calculate max

    _chart.max = Math.max.apply(Math, _toConsumableArray(values));
  }

  function _set_slices() {
    var values = _chart.values.map(function (value) {
      return value[1];
    });

    _chart.slices = values.map(function (val) {
      return {
        'value': val,
        'pie': _get_slice(val),
        'angle': _get_angle(val),
        'radians': _get_radians(val)
      };
    });
  } // init


  function _init(chart) {
    _chart.type = chart.dataset.type;
    _chart.unit = chart.dataset.unit;

    _set_values(chart.dataset.values);

    _set_total_max();

    _set_slices();

    _chart.slices.forEach(function (slice, index) {
      slice.points = _get_points(index);
    });
  }

  function _trim(value) {
    return value.toFixed(2);
  } // public methods


  function insert(chart) {
    _init(chart); // create SVG none


    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("viewBox", "0 0 ".concat(options.width, " ").concat(options.height));
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    var svgContent = "";

    _chart.slices.forEach(function (slice, index) {
      svgContent += "<path d=\"M".concat(_trim(slice.points[0].x), ",").concat(_trim(slice.points[0].y), " ");

      for (var i = 1; i < slice.points.length; i++) {
        svgContent += "A ".concat(options.radius, " ").concat(options.radius, " 0 0 1 ").concat(_trim(slice.points[i].x), " ").concat(_trim(slice.points[i].y), " ");
      }

      svgContent += "\" fill=\"none\" />";
      return;
    });

    svg.innerHTML = svgContent;
    chart.appendChild(svg);
  } // 'module' exports


  return {
    insert: insert
  };
}();