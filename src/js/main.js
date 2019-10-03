"use strict";

const charts = document.querySelectorAll('.new-chart');

charts.forEach( chart => {
    Chart.draw(chart);
});