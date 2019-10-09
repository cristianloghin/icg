"use strict";

const charts = document.querySelectorAll('.new-chart');

charts.forEach( chart => {
    Chart.draw(chart);
});

(function () {

    const viewport2 = document.querySelector('.viewport');

    // Initialize Animations (on Scroll)
    try {
        const animateElements = document.getElementsByClassName('animate');
        const animate = () => {
            Array.from(animateElements).forEach( element => {
                Animate.evaluate(element);
            });
        }

        // call animate function on page load
        animate();
        // Update element animations on scroll
        viewport2.addEventListener('scroll', _.throttle(animate, 100));

    } catch (err) { console.error("Animations on Scroll Error:", err) }

    // Initialize SVG maps (if present)
    try {
        const map = document.querySelector('.svg-map');
        const paths = map.querySelectorAll('.borders path, .routes path');
    
        Array.from(paths).forEach(path => {
            path.setAttribute('stroke-dasharray', path.getTotalLength());
            path.setAttribute('stroke-dashoffset', path.getTotalLength());
        });
    
    } catch (err) { 
        console.error("SVG Maps Error:", err);
    }

    // toggle search button

    const toggleSearch = document.querySelector('#toggleSearch');
    toggleSearch.addEventListener('click', () => {
        const searchForm = document.querySelector('#searchForm');
        searchForm.classList.toggle('show');
        searchForm.querySelector('input').focus();
    });

})();
