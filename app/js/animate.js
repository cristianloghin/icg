'use strict';

var Animate = function () {
  var _animOptions = {
    offset: 0,
    delay: 0
  }; // private functions

  function _set_options(element) {
    if (element.dataset.animOffset) {
      _animOptions.offset = Number(element.dataset.animOffset);
    } else {
      _animOptions.offset = 0;
    }

    if (element.dataset.animDelay) {
      _animOptions.delay = Number(element.dataset.animDelay);
    } else {
      _animOptions.delay = 0;
    }
  }

  function _get_offset_top(element) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  } // public functions


  function evaluate(element) {
    _set_options(element);

    var top = _get_offset_top(element);

    var height = window.innerHeight - _animOptions.offset;

    if (top - height <= 0 && !element.classList.contains('in')) {
      if (element.dataset.anim != 'play') {
        element.classList.add('in');
        element.setAttribute('style', "transition-delay: ".concat(_animOptions.delay / 1000, "s"));
      } else {
        setTimeout(function () {
          element.classList.add('in');
        }, _animOptions.delay);
      }
    }
  } // 'module' exports


  return {
    evaluate: evaluate
  };
}();