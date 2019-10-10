'use strict';

const Chart = (function () {

    const options = {
        'size'      : 400,
        'radius'    : 180,
        'colors'    : ['red', 'blue', 'yellow', 'green']
    }

    // private variables

    let _values = [];
    let _total = 0;
    let _slices = [];

    // private methods

    function _get_slice(value) {
        return value / _total * 100;
    }

    function _get_angle(value) {
        return value / _total * 360;
    }
    
    function _get_radians(value) {
        return (value / _total * 360) * ( Math.PI / 180 );
    }
    
    function _get_total_radians(index) {
        let total = _slices[index].radians;
        for (let i = index - 1; i >= 0; i--) {
            total += _slices[i].radians;
        }
        return total;
    }

    function _get_points(index) {
        let points = [];
        points.push(_get_start_point(index));
        if(_slices[index].angle > 180) {
            points.push(_get_mid_point(index));
        }
        points.push(_get_end_point(index));
        return points;
    }

    function _get_start_point(index) {
        let point = {};
        if (index == 0) {
            point =
            {
                'x' : options.size - (options.size - 2 * options.radius)/2,
                'y' : options.size / 2
            }
        } else {
            point = _get_end_point(index - 1);
        }
        return point;
    }

    function _get_mid_point(index) {
        let point = {};
        if ( index == 0 ) {
            point = 
            {
                'x' : (options.size / 2) + (options.radius * Math.cos(Math.PI)),
                'y' : (options.size / 2) + (options.radius * Math.sin(Math.PI))
            }
        } else {
            const radians = _get_total_radians(index-1) + Math.PI;
            point = 
            {
                'x' : (options.size / 2) + (options.radius * Math.cos(radians)),
                'y' : (options.size / 2) + (options.radius * Math.sin(radians))
            }
        }
        return point;
    }

    function _get_end_point(index) {
        let point = {};
        if ( index == _slices.length - 1) {
            point =
            {
                'x' : options.size - (options.size - 2 * options.radius)/2,
                'y' : options.size / 2
            }
        } else {
            const radians = _get_total_radians(index);
            point = 
            {
                'x' : (options.size / 2) + (options.radius * Math.cos(radians)),
                'y' : (options.size / 2) + (options.radius * Math.sin(radians))
            }
        }
        return point;
    }

    function _set_values(string) {
        _values = string.split(';').map( v => Number(v) )
    }

    function _set_total() {
        _total = _values.reduce( (t, v) => t += v );
    }

    function _set_slices() {
        _slices = _values.map( val => {
            return {
                'value'     : val,
                'pie'       : _get_slice(val),
                'angle'     : _get_angle(val),
                'radians'   : _get_radians(val)
            }
        });
    }

    function _init( chart ) {
        
        _set_values(chart.dataset.values);
        _set_total();
        _set_slices();
        _slices.forEach( (slice, index) => {
            slice.points = _get_points(index);
            return;
        });
    }

    // public methods

    function draw(chart) {
        _init(chart);
        // create SVG none
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewBox", `0 0 ${options.size} ${options.size}`);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");

        let svgContent = "";
        _slices.forEach( (slice, index) => {
            svgContent += `<path d="M${slice.points[0].x},${slice.points[0].y} `;
            for ( let i = 1; i < slice.points.length; i++) {
                svgContent += `A ${options.radius} ${options.radius} 0 0 1 ${slice.points[i].x} ${slice.points[i].y} `;
            }
            svgContent += `" fill="none" stroke="${options.colors[index]}" stroke-width="40" opacity=".5" />`;
            return;
        })
        svg.innerHTML = svgContent;
        chart.appendChild(svg);
    }

    // 'module' exports
    return {
        draw: draw,
    }
})();