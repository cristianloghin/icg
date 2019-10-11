'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Chart = function () {
  var options = {
    'viewbox': {
      'width': 600,
      'height': 400
    },
    'barsArea': {
      'width': 570,
      'height': 370,
      'spacerX': 15,
      'spacerY': 15
    },
    'radius': 160
  }; // chart map

  var _chart = {
    'type': '',
    'unit': '',
    'values': [],
    'total': 0,
    'max': 0,
    'min': 0,
    'slices': [],
    'bars': [],
    'base': {}
  }; // init

  function _init(chart) {
    _chart.type = chart.dataset.type;
    _chart.unit = chart.dataset.unit;

    _set_values(chart.dataset.values);

    _set_total_min_max();

    _set_base();

    _set_slices();

    _chart.slices.forEach(function (slice, index) {
      slice.points = _get_points(index);
    });

    _set_bars();

    _chart.bars.forEach(function (bar, index) {
      bar.points = _get_bar_points(bar, index);
    });
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

  function _set_total_min_max() {
    var values = _chart.values.map(function (value) {
      return value[1];
    }); // calculate total


    _chart.total = values.reduce(function (total, val) {
      return total += Math.abs(val);
    }, 0); // calculate max

    _chart.min = Math.min.apply(Math, _toConsumableArray(values)); // calculate max

    _chart.max = Math.max.apply(Math, _toConsumableArray(values));
  }

  function _set_base() {
    _chart.base = {
      'v_x': options.barsArea.width / (_chart.values.length + 1),
      'h_y': options.barsArea.height / (_chart.values.length + 1)
    };

    if (_chart.min < 0) {
      _chart.base.v_y = options.barsArea.height - Math.abs(_chart.min) * options.barsArea.height / (Math.abs(_chart.min) + _chart.max);
      _chart.base.h_x = Math.abs(_chart.min) * options.barsArea.width / (Math.abs(_chart.min) + _chart.max);
    } else {
      _chart.base.v_y = options.barsArea.height;
      _chart.base.h_x = 0;
    }
  }

  function _set_slices() {
    var values = _chart.values.map(function (value) {
      return value[1];
    });

    _chart.slices = values.map(function (val) {
      return {
        'value': val,
        'percent': Math.round(val / _chart.total * 100),
        'pie': _get_slice(val),
        'angle': _get_angle(val),
        'radians': _get_radians(val)
      };
    });
  }

  function _set_bars() {
    _chart.bars = _chart.values.map(function (val) {
      if (_chart.min >= 0) {
        return {
          'value': val[1],
          'label': val[0],
          'size': Math.abs(val[1]) / _chart.max
        };
      } else {
        return {
          'value': val[1],
          'label': val[0],
          'size': Math.abs(val[1]) / _chart.total
        };
      }
    });
  } // private methods
  // Slices for pie charts


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
        'x': options.viewbox.width - (options.viewbox.width - 2 * options.radius) / 2,
        'y': options.viewbox.height / 2
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
        'x': options.viewbox.width / 2 + options.radius * Math.cos(Math.PI),
        'y': options.viewbox.height / 2 + options.radius * Math.sin(Math.PI)
      };
    } else {
      var radians = _get_total_radians(index - 1) + Math.PI;
      point = {
        'x': options.viewbox.width / 2 + options.radius * Math.cos(radians),
        'y': options.viewbox.height / 2 + options.radius * Math.sin(radians)
      };
    }

    return point;
  }

  function _get_end_point(index) {
    var point = {};

    if (index == _chart.slices.length - 1) {
      point = {
        'x': options.viewbox.width - (options.viewbox.width - 2 * options.radius) / 2,
        'y': options.viewbox.height / 2
      };
    } else {
      var radians = _get_total_radians(index);

      point = {
        'x': options.viewbox.width / 2 + options.radius * Math.cos(radians),
        'y': options.viewbox.height / 2 + options.radius * Math.sin(radians)
      };
    }

    return point;
  } // Bar functionn


  function _get_bar_points(bar, index) {
    if (bar.value >= 0) {
      return {
        'vertical': {
          'xs': _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
          'ys': _chart.base.v_y + options.barsArea.spacerY,
          'xe': _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
          'ye': _chart.base.v_y + bar.size * options.barsArea.height + options.barsArea.spacerY
        },
        'horizontal': {
          'xs': _chart.base.h_x + options.barsArea.spacerX,
          'ys': _chart.base.h_y * (index + 1) + options.barsArea.spacerY,
          'xe': _chart.base.h_x + bar.size * options.barsArea.width + options.barsArea.spacerX,
          'ye': _chart.base.h_y * (index + 1) + options.barsArea.spacerY
        }
      };
    } else {
      return {
        'vertical': {
          'xs': _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
          'ys': _chart.base.v_y + options.barsArea.spacerY,
          'xe': _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
          'ye': _chart.base.v_y - bar.size * options.barsArea.height + options.barsArea.spacerY
        },
        'horizontal': {
          'xs': _chart.base.h_x + options.barsArea.spacerX,
          'ys': _chart.base.h_y * (index + 1) + options.barsArea.spacerY,
          'xe': _chart.base.h_x - bar.size * options.barsArea.width + options.barsArea.spacerX,
          'ye': _chart.base.h_y * (index + 1) + options.barsArea.spacerY
        }
      };
    }
  }

  function _get_label_position(slice, index) {
    var radians = _chart.slices[index].radians / 2;

    for (var i = index - 1; i >= 0; i--) {
      radians += _chart.slices[i].radians;
    }

    return {
      'x': options.viewbox.width / 2 + (options.radius + 40) * Math.cos(radians),
      'y': options.viewbox.height / 2 + (options.radius + 40) * Math.sin(radians)
    };
  } // helper function


  function _trim(value) {
    return value.toFixed(2);
  } // drawing functions
  // draw piechart


  function _draw_pie() {
    var content = '<g>';

    _chart.slices.forEach(function (slice, index) {
      content += "<path class=\"stroke-".concat(index, "\" d=\"M").concat(_trim(slice.points[0].x), ",").concat(_trim(slice.points[0].y), " ");

      for (var i = 1; i < slice.points.length; i++) {
        content += "A ".concat(options.radius, " ").concat(options.radius, " 0 0 1 ").concat(_trim(slice.points[i].x), " ").concat(_trim(slice.points[i].y), " ");
      }

      content += "\" fill=\"none\" />";

      var labelPosition = _get_label_position(slice, index);

      content += "<text class=\"label fill-".concat(index, "\" transform=\"matrix(1 0 0 1 ").concat(labelPosition.x, " ").concat(labelPosition.y, "), rotate(90)\">").concat(slice.percent, "%</text>");
    });

    content += "<text class=\"total\" transform=\"matrix(1 0 0 1 ".concat(options.viewbox.width / 2 - 20, " ").concat(options.viewbox.height / 2, "), rotate(90)\">\u20AC").concat(_chart.total.toFixed(1), "m</text></g>");
    return content;
  } // draw simple stats


  function _draw_stat() {
    var content = '';

    _chart.bars.forEach(function (bar) {
      var xs = Math.floor(bar.points.horizontal.xs);
      var ys = Math.floor(bar.points.horizontal.ys);
      var xe = Math.floor(bar.points.horizontal.xe);
      var ye = Math.floor(bar.points.horizontal.ye);
      var edgeRightX = options.barsArea.width + options.barsArea.spacerX;
      var textOffsetY = ys - 40;
      var textValue = '';

      if (bar.value < 0) {
        if (_chart.unit.includes(':')) {
          var textUnit = _chart.unit.split(':');

          textValue = textUnit[0] + '(' + Math.abs(bar.value) + ')' + textUnit[1];
        } else {
          textValue = '(' + Math.abs(bar.value) + ')' + _chart.unit;
        }
      } else {
        if (_chart.unit.includes(':')) {
          var _textUnit = _chart.unit.split(':');

          textValue = _textUnit[0] + bar.value + _textUnit[1];
        } else {
          textValue = bar.value + _chart.unit;
        }
      }

      content += "<text class=\"value\" x=\"0\" y=\"".concat(textOffsetY, "\">").concat(textValue, "</text>");
      content += "<text class=\"label\" x=\"".concat(edgeRightX, "\" y=\"").concat(textOffsetY, "\">").concat(bar.label, "</text>");
      content += "<path class=\"stroke-0\" d=\"M".concat(options.barsArea.spacerX, " ").concat(ys, " L").concat(edgeRightX, " ").concat(ye, "\" fill=\"none\" />");
      content += "<path class=\"stroke-1\" d=\"M".concat(xs, " ").concat(ys, " L").concat(xe, " ").concat(ye, "\" fill=\"none\" />");
    });

    return content;
  } // public methods


  function insert(chart) {
    _init(chart); // create SVG node


    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("viewBox", "0 0 ".concat(options.viewbox.width, " ").concat(options.viewbox.height));
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    var svgContent;

    if (_chart.type == 'pie') {
      svgContent = _draw_pie();
    }

    if (_chart.type == 'bars-stat') {
      svgContent = _draw_stat();
    }

    svg.innerHTML = svgContent;
    chart.appendChild(svg);
    var paths = chart.querySelectorAll('path');
    paths.forEach(function (path) {
      path.setAttribute('stroke-dasharray', path.getTotalLength());
      path.setAttribute('stroke-dashoffset', path.getTotalLength());
    });
  } // 'module' exports


  return {
    insert: insert
  };
}();
/*
svgContent += `
            <text class="total" transform="matrix(1 0 0 1 190 200), rotate(90)">€${totalVal}m</text>
            <text class="label_1" transform="matrix(1 0 0 1 20 360), rotate(90)">${values[0]}%</text>
            <text class="label_2" transform="matrix(1 0 0 1 360 40), rotate(90)">${values[1]}%</text>`;

        svgContent += "</svg>";
        svg.innerHTML = svgContent;
        chart.appendChild(svg);

        const paths = svg.querySelectorAll('path');
        
        paths.forEach( path => {
            path.setAttribute('stroke-dasharray', path.getTotalLength());
            path.setAttribute('stroke-dashoffset', path.getTotalLength());
        });

        */