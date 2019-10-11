"use strict";

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
    
        paths.forEach(path => {
            path.setAttribute('stroke-dasharray', path.getTotalLength());
            path.setAttribute('stroke-dashoffset', path.getTotalLength());
        });
    
    } catch (err) { 
        console.error("SVG Maps Error:", err);
    }

    // Initialize Charts (if present)
    try {
        const charts = document.querySelectorAll('.chart');
        charts.forEach( chart => {
            Chart.insert(chart);
        });
    } catch (err) { 
        console.error("There are no charts on the page:", err);
    }

    // toggle search button

    const toggleSearch = document.querySelector('#toggleSearch');
    toggleSearch.addEventListener('click', () => {
        const searchForm = document.querySelector('#searchForm');
        searchForm.classList.toggle('show');
        searchForm.querySelector('input').focus();
    });

})();
