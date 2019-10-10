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