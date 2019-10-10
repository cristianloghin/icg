"use strict";

(function () {
  var viewport2 = document.querySelector('.viewport'); // Initialize Animations (on Scroll)

  try {
    var animateElements = document.getElementsByClassName('animate');

    var animate = function animate() {
      Array.from(animateElements).forEach(function (element) {
        Animate.evaluate(element);
      });
    }; // call animate function on page load


    animate(); // Update element animations on scroll

    viewport2.addEventListener('scroll', _.throttle(animate, 100));
  } catch (err) {
    console.error("Animations on Scroll Error:", err);
  } // Initialize SVG maps (if present)


  try {
    var map = document.querySelector('.svg-map');
    var paths = map.querySelectorAll('.borders path, .routes path');
    paths.forEach(function (path) {
      path.setAttribute('stroke-dasharray', path.getTotalLength());
      path.setAttribute('stroke-dashoffset', path.getTotalLength());
    });
  } catch (err) {
    console.error("SVG Maps Error:", err);
  } // Initialize Charts (if present)


  try {
    var charts = document.querySelectorAll('.chart');
    charts.forEach(function (chart) {
      Chart.draw(chart);
    });
  } catch (err) {
    console.error("There are no charts on the page:", err);
  } // toggle search button


  var toggleSearch = document.querySelector('#toggleSearch');
  toggleSearch.addEventListener('click', function () {
    var searchForm = document.querySelector('#searchForm');
    searchForm.classList.toggle('show');
    searchForm.querySelector('input').focus();
  });
})();