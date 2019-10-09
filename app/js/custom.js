'use strict';

var viewport = $('.viewport');

var set_header = function set_header() {
  var nav = $('header');
  var top = 100;
  var menuOpen = $('.navbar-collapse').hasClass('show') ? true : false;
  var homeIsActive = viewport[0].id == 'home' ? true : false;
  var position = viewport.scrollTop();

  if (homeIsActive) {
    if (position >= top && !menuOpen) {
      nav.removeClass('expanded');
    } else {
      nav.addClass('expanded');
    }
  } else {
    if (position >= top && !menuOpen) {
      nav.removeClass('compact');
    } else {
      nav.addClass('compact');
    }
  }
};

set_header(); // custom events

viewport.scroll(_.debounce(set_header, 100));
$('#scrollDown').on('click', function () {
  var target = document.querySelector('.content-sections');
  var navbar = document.querySelector('.navbar-nav');
  var rect = target.getBoundingClientRect();
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var position = rect.top + scrollTop - navbar.offsetHeight;
  console.log(navbar.offsetHeight);
  viewport.scrollTop(position);
});
$('#scrollUp').on('click', function () {
  viewport.scrollTop(0, 0);
});
/********** Charts **************/

var calc_radians = function calc_radians(angle) {
  return angle * Math.PI / 180;
};

var calc_percentages = function calc_percentages(values) {
  var sum = values.reduce(function (sum, val) {
    return sum += val;
  });
  return values.map(function (val) {
    return Math.round(val / sum * 100);
  });
};

var calc_points = function calc_points(cx, cy, cradius, radians) {
  return {
    'x': cx + cradius * Math.cos(radians),
    'y': cy + cradius * Math.sin(radians)
  };
};

var c_anchors = function c_anchors(cx, cy, cradius) {
  return {
    'x0': cx + cradius,
    'y0': cy,
    'x1': cx,
    'y1': cy + cradius,
    'x2': cx - cradius,
    'y2': cy,
    'x3': cx,
    'y3': cy - cradius
  };
};

var calc_mid = function calc_mid(cx, cy, cradius, val) {
  if (val > 50) {} else {
    return [];
  }
};

var calc_coordinates = function calc_coordinates(values, cx, cy, cradius) {
  var obj = values.map(function (val, index) {
    if (index == 0) {
      return {
        'start': {
          'x': cx + cradius,
          'y': cy
        },
        'mid': [],
        'end': calc_points(cx, cy, cradius, calc_radians(val * 360 / 100))
      };
    } else if (index < values.length - 1) {
      return {
        'start': calc_points(cx, cy, cradius, calc_radians(values[index - 1] * 360 / 100)),
        'mid': [],
        'end': calc_points(cx, cy, cradius, calc_radians(val * 360 / 100))
      };
    } else {
      return {
        'start': calc_points(cx, cy, cradius, calc_radians(values[index - 1] * 360 / 100)),
        'mid': [],
        'end': {
          'x': cx + cradius,
          'y': cy
        }
      };
    }
  });
  return obj;
};

var build_chart = function build_chart(chart) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var classes = ['secondary', 'info'];
  var values = chart.dataset.values.split(';').map(function (val) {
    return Number(val);
  });
  var svgContent = "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">"; // calculate coordinates

  var coordinates = values.map(function (val, index) {
    var obj = [];

    if (index == 0) {
      if (val <= 50) {
        var radians = val * 360 / 100 * (Math.PI / 180);
        obj = [{
          'xs': 380,
          'ys': 200,
          'xe': 200 + 180 * Math.cos(radians),
          'ye': 200 + 180 * Math.sin(radians)
        }];
      } else {
        var _radians = val * 360 / 100 * (Math.PI / 180);

        obj = [{
          'xs': 380,
          'ys': 200,
          'xe': 20,
          'ye': 200
        }, {
          'xs': 20,
          'ys': 200,
          'xe': 200 + 180 * Math.cos(_radians),
          'ye': 200 + 180 * Math.sin(_radians)
        }];
      }
    } else {
      if (val <= 50) {
        var _radians2 = values[index - 1] * 360 / 100 * (Math.PI / 180);

        obj = [{
          'xs': 200 + 180 * Math.cos(_radians2),
          'ys': 200 + 180 * Math.sin(_radians2),
          'xe': 380,
          'ye': 200
        }];
      } else {
        var _radians3 = values[index - 1] * 360 / 100 * (Math.PI / 180);

        obj = [{
          'xs': 200 + 180 * Math.cos(_radians3),
          'ys': 200 + 180 * Math.sin(_radians3),
          'xe': 200,
          'ye': 20
        }, {
          'xs': 200,
          'ys': 20,
          'xe': 380,
          'ye': 200
        }];
      }
    }

    return {
      'set': obj,
      'class': classes[index]
    };
  }); // draw paths

  coordinates.forEach(function (obj) {
    svgContent += "<path class=\"".concat(obj["class"], "\" d=\"");
    obj.set.forEach(function (pair) {
      svgContent += "M".concat(pair.xs, ",").concat(pair.ys, " A 180 180 0 0 1 ").concat(pair.xe, " ").concat(pair.ye, " ");
    });
    svgContent += "\" fill=\"none\" />";
  });
  svgContent += "</svg>";
  svg.innerHTML = svgContent;
  chart.appendChild(svg);
};

var make_charts = function make_charts() {
  // get charts on page
  var charts = document.querySelectorAll('.chart');

  var init_chart = function init_chart(chart) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var svgContent = "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">";
    var classes = ['secondary', 'info'];
    var initValues = chart.dataset.values.split(';').map(function (val) {
      return Number(val);
    });
    var values = calc_percentages(initValues);
    var coordinates = values.map(function (val, index) {
      var obj = [];

      if (index == 0) {
        if (val <= 50) {
          var radians = val * 360 / 100 * (Math.PI / 180);
          obj = [{
            'xs': 380,
            'ys': 200,
            'xe': 200 + 180 * Math.cos(radians),
            'ye': 200 + 180 * Math.sin(radians)
          }];
        } else {
          var _radians4 = val * 360 / 100 * (Math.PI / 180);

          obj = [{
            'xs': 380,
            'ys': 200,
            'xe': 20,
            'ye': 200
          }, {
            'xs': 20,
            'ys': 200,
            'xe': 200 + 180 * Math.cos(_radians4),
            'ye': 200 + 180 * Math.sin(_radians4)
          }];
        }
      } else {
        if (val <= 50) {
          var _radians5 = values[index - 1] * 360 / 100 * (Math.PI / 180);

          obj = [{
            'xs': 200 + 180 * Math.cos(_radians5),
            'ys': 200 + 180 * Math.sin(_radians5),
            'xe': 380,
            'ye': 200
          }];
        } else {
          var _radians6 = values[index - 1] * 360 / 100 * (Math.PI / 180);

          obj = [{
            'xs': 200 + 180 * Math.cos(_radians6),
            'ys': 200 + 180 * Math.sin(_radians6),
            'xe': 200,
            'ye': 20
          }, {
            'xs': 200,
            'ys': 20,
            'xe': 380,
            'ye': 200
          }];
        }
      }

      return {
        'set': obj,
        'class': classes[index]
      };
    });
    coordinates.forEach(function (obj) {
      svgContent += "<path class=\"".concat(obj["class"], "\" d=\"M").concat(obj.set[0].xs, ",").concat(obj.set[0].ys, " ");
      obj.set.forEach(function (pair) {
        svgContent += "A 180 180 0 0 1 ".concat(pair.xe, " ").concat(pair.ye, " ");
      });
      svgContent += "\" fill=\"none\" />";
    });
    var totalVal = (initValues[0] + initValues[1]).toFixed(1);
    svgContent += "\n            <text class=\"total\" transform=\"matrix(1 0 0 1 190 200), rotate(90)\">\u20AC".concat(totalVal, "m</text>\n            <text class=\"label_1\" transform=\"matrix(1 0 0 1 20 360), rotate(90)\">").concat(values[0], "%</text>\n            <text class=\"label_2\" transform=\"matrix(1 0 0 1 360 40), rotate(90)\">").concat(values[1], "%</text>");
    svgContent += "</svg>";
    svg.innerHTML = svgContent;
    chart.appendChild(svg);
    var paths = svg.querySelectorAll('path');
    paths.forEach(function (path) {
      path.setAttribute('stroke-dasharray', path.getTotalLength());
      path.setAttribute('stroke-dashoffset', path.getTotalLength());
    });
  };

  charts.forEach(function (chart) {
    init_chart(chart);
  });
};

make_charts();