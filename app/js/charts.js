'use strict';

var Chart = function () {
  var options = {
    'size': 400,
    'radius': 180,
    'colors': ['red', 'blue', 'yellow', 'green']
  }; // private variables

  var _values = [];
  var _total = 0;
  var _slices = []; // private methods

  function _get_slice(value) {
    return value / _total * 100;
  }

  function _get_angle(value) {
    return value / _total * 360;
  }

  function _get_radians(value) {
    return value / _total * 360 * (Math.PI / 180);
  }

  function _get_total_radians(index) {
    var total = _slices[index].radians;

    for (var i = index - 1; i >= 0; i--) {
      total += _slices[i].radians;
    }

    return total;
  }

  function _get_points(index) {
    var points = [];
    points.push(_get_start_point(index));

    if (_slices[index].angle > 180) {
      points.push(_get_mid_point(index));
    }

    points.push(_get_end_point(index));
    return points;
  }

  function _get_start_point(index) {
    var point = {};

    if (index == 0) {
      point = {
        'x': options.size - (options.size - 2 * options.radius) / 2,
        'y': options.size / 2
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
        'x': options.size / 2 + options.radius * Math.cos(Math.PI),
        'y': options.size / 2 + options.radius * Math.sin(Math.PI)
      };
    } else {
      var radians = _get_total_radians(index - 1) + Math.PI;
      point = {
        'x': options.size / 2 + options.radius * Math.cos(radians),
        'y': options.size / 2 + options.radius * Math.sin(radians)
      };
    }

    return point;
  }

  function _get_end_point(index) {
    var point = {};

    if (index == _slices.length - 1) {
      point = {
        'x': options.size - (options.size - 2 * options.radius) / 2,
        'y': options.size / 2
      };
    } else {
      var radians = _get_total_radians(index);

      point = {
        'x': options.size / 2 + options.radius * Math.cos(radians),
        'y': options.size / 2 + options.radius * Math.sin(radians)
      };
    }

    return point;
  }

  function _set_values(string) {
    _values = string.split(';').map(function (v) {
      return Number(v);
    });
  }

  function _set_total() {
    _total = _values.reduce(function (t, v) {
      return t += v;
    });
  }

  function _set_slices() {
    _slices = _values.map(function (val) {
      return {
        'value': val,
        'pie': _get_slice(val),
        'angle': _get_angle(val),
        'radians': _get_radians(val)
      };
    });
  }

  function _init(chart) {
    _set_values(chart.dataset.values);

    _set_total();

    _set_slices();

    _slices.forEach(function (slice, index) {
      slice.points = _get_points(index);
      return;
    });

    console.log('Slices', _slices);
  } // public methods


  function draw(chart) {
    _init(chart); // create SVG none


    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("viewBox", "0 0 ".concat(options.size, " ").concat(options.size));
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    var svgContent = "";

    _slices.forEach(function (slice, index) {
      svgContent += "<path d=\"M".concat(slice.points[0].x, ",").concat(slice.points[0].y, " ");

      for (var i = 1; i < slice.points.length; i++) {
        svgContent += "A ".concat(options.radius, " ").concat(options.radius, " 0 0 1 ").concat(slice.points[i].x, " ").concat(slice.points[i].y, " ");
      }

      svgContent += "\" fill=\"none\" stroke=\"".concat(options.colors[index], "\" stroke-width=\"40\" opacity=\".5\" />");
      return;
    });

    svg.innerHTML = svgContent;
    chart.appendChild(svg);
  } // 'module' exports


  return {
    draw: draw
  };
}();