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
        const pageId = document.querySelector('.viewport').id;
        let options;

        if ( pageId == 'at_a_glance' ) {
            options = {
                'viewbox'       :
                {
                    'width'     : 600,
                    'height'    : 400
                },
                'barsArea'         : 
                {
                    'width'     : 570,
                    'height'    : 370,
                    'spacerX'   : 15,
                    'spacerY'   : 15
                },
                'radius'    : 160
            }
        }

        if ( pageId == 'investment_case' ) {
            options = {
                'viewbox'       :
                {
                    'width'     : 600,
                    'height'    : 400
                },
                'barsArea'         : 
                {
                    'width'     : 570,
                    'height'    : 370,
                    'spacerX'   : 15,
                    'spacerY'   : 15
                },
                'radius'    : 160
            }
        }

        if ( pageId == 'financial_highlights' ) {
            options = {
                'viewbox'       :
                {
                    'width'     : 600,
                    'height'    : 500
                },
                'barsArea'         : 
                {
                    'width'     : 570,
                    'height'    : 300,
                    'spacerX'   : 15,
                    'spacerY'   : 100
                },
                'radius'    : 160
            }
        }
        
        const charts = document.querySelectorAll('.chart');
        charts.forEach( chart => {
            Chart.insert(chart, options);
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
