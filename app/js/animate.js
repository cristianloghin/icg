'use strict';

var Animate = function () {
  var _animOptions = {
    offset: 75
  }; // private functions

  function _get_offset_top(element) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  } // public functions


  function evaluate(element) {
    var top = _get_offset_top(element);

    var height = window.innerHeight - _animOptions.offset;

    if (top - height <= 0 && !element.classList.contains('in')) {
      setTimeout(function () {
        element.classList.add('in');
      }, Number(element.dataset.animDelay));
    }
  } // 'module' exports


  return {
    evaluate: evaluate
  };
}();