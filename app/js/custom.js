'use strict';

var viewport = $('.viewport');

var offset_top = function offset_top(el) {
  var rect = el.getBoundingClientRect();
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop;
};

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

var animateElements = document.getElementsByClassName('animate');
var animOptions = {
  offset: 50
};

var animate = function animate() {
  var height = window.innerHeight - animOptions.offset;
  Array.from(animateElements).forEach(function (el) {
    var el_top = offset_top(el);

    if (el_top - height <= 0 && !$(el).hasClass('in')) {
      setTimeout(function () {
        $(this).addClass('in');
      }.bind(el), Number($(el).data("anim-delay")));
    }

    if (el_top - height > 0 && $(el).hasClass('in')) {
      $(el).removeClass('in');
    }
  });
};

set_header(); // custom events

viewport.scroll(_.debounce(set_header, 100));
viewport.scroll(_.throttle(animate, 100));