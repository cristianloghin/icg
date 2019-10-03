"use strict";

var charts = document.querySelectorAll('.new-chart');
charts.forEach(function (chart) {
  Chart.draw(chart);
});