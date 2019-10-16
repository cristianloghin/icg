'use strict';

const Chart = (function () {

    let options;

    // chart map

    let _chart = {
        'type'   : '',
        'unit'   : '',
        'values' : [],
        'total'  : 0,
        'max'    : 0,
        'min'    : 0,
        'slices' : [],
        'bars'   : [],
        'base'   : {}
    }

    // init

    function _init( chart ) {
        _chart.type = chart.dataset.type;
        _chart.unit = chart.dataset.unit;
        _set_values(chart.dataset.values);
        _set_total_min_max();
        _set_base();
        _set_slices();
        _chart.slices.forEach( (slice, index) => {
            slice.points = _get_points(index);
        });
        _set_bars();
        _chart.bars.forEach( (bar, index) => {
            bar.points = _get_bar_points(bar, index);
        });
    }

    // set
    
    function _set_values(string) {
        _chart.values = string.split(';').map( val => {
            let pair = val.split(':');
            if (pair.length == 1) {
                pair.push('');
                pair.reverse();
            }
            pair[1] = Number(pair[1]);
            return pair;
        });
    }

    function _set_total_min_max() {
        const values = _chart.values.map( value => value[1] );
        // calculate total
        _chart.total = values.reduce( (total, val) => {
            return total += Math.abs(val);
        }, 0);
        // calculate max
        _chart.min = Math.min(...values);
        // calculate max
        _chart.max = Math.max(...values);
    }

    function _set_base() {
        _chart.base = {
            'v_x' : options.barsArea.width / (_chart.values.length + 1),
            'h_y' : options.barsArea.height / (_chart.values.length + 1)
        }
        if (_chart.min < 0) {
            _chart.base.v_y = options.barsArea.height - Math.abs(_chart.min) * options.barsArea.height / (Math.abs(_chart.min) + _chart.max);
            _chart.base.h_x = Math.abs(_chart.min) * options.barsArea.width / (Math.abs(_chart.min) + _chart.max);
        } else {
            _chart.base.v_y = options.barsArea.height;
            _chart.base.h_x = 0;
        }
    }

    function _set_slices() {
        const values = _chart.values.map( value => value[1] );
        _chart.slices = values.map( val => {
            return {
                'value'     : val,
                'percent'   : Math.round(val / _chart.total * 100),
                'pie'       : _get_slice(val),
                'angle'     : _get_angle(val),
                'radians'   : _get_radians(val)
            }
        });
    }

    function _set_bars() {
        _chart.bars = _chart.values.map( val => {
            if (_chart.min >= 0) {
                return {
                    'value'   : val[1],
                    'label'   : val[0],
                    'size'    : Math.abs(val[1]) / _chart.max
                }
            } else {
                return {
                    'value'   : val[1],
                    'label'   : val[0],
                    'size'    : Math.abs(val[1]) / _chart.total
                }
            }
        });
    }

    // private methods

        // Slices for pie charts

    function _get_slice(value) {
        return value / _chart.total * 100;
    }

    function _get_angle(value) {
        return value / _chart.total * 360;
    }
    
    function _get_radians(value) {
        return (value / _chart.total * 360) * ( Math.PI / 180 );
    }
    
    function _get_total_radians(index) {
        let total = _chart.slices[index].radians;
        for (let i = index - 1; i >= 0; i--) {
            total += _chart.slices[i].radians;
        }
        return total;
    }

    function _get_points(index) {
        let points = [];
        points.push(_get_start_point(index));
        if(_chart.slices[index].angle > 180) {
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
                'x' : options.viewbox.width - (options.viewbox.width - 2 * options.radius)/2,
                'y' : options.viewbox.height / 2
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
                'x' : (options.viewbox.width / 2) + (options.radius * Math.cos(Math.PI)),
                'y' : (options.viewbox.height / 2) + (options.radius * Math.sin(Math.PI))
            }
        } else {
            const radians = _get_total_radians(index-1) + Math.PI;
            point = 
            {
                'x' : (options.viewbox.width / 2) + (options.radius * Math.cos(radians)),
                'y' : (options.viewbox.height / 2) + (options.radius * Math.sin(radians))
            }
        }
        return point;
    }

    function _get_end_point(index) {
        let point = {};
        if ( index == _chart.slices.length - 1) {
            point =
            {
                'x' : options.viewbox.width - (options.viewbox.width - 2 * options.radius)/2,
                'y' : options.viewbox.height / 2
            }
        } else {
            const radians = _get_total_radians(index);
            point = 
            {
                'x' : (options.viewbox.width / 2) + (options.radius * Math.cos(radians)),
                'y' : (options.viewbox.height / 2) + (options.radius * Math.sin(radians))
            }
        }
        return point;
    }

    // Bar functionn

    function _get_bar_points(bar, index) {

        if( bar.value >= 0 ) {
            return {
                'vertical' : {
                    'xs' : _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
                    'ys' : _chart.base.v_y + options.barsArea.spacerY,
                    'xe' : _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
                    'ye' : _chart.base.v_y - (bar.size * options.barsArea.height) + options.barsArea.spacerY
                },
                'horizontal' : {
                    'xs' : _chart.base.h_x + options.barsArea.spacerX,
                    'ys' : _chart.base.h_y * (index + 1) + options.barsArea.spacerY,
                    'xe' : _chart.base.h_x + (bar.size * options.barsArea.width) + options.barsArea.spacerX,
                    'ye' : _chart.base.h_y * (index + 1) + options.barsArea.spacerY
                }
            }
        } else {
            return {
                'vertical' : {
                    'xs' : _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
                    'ys' : _chart.base.v_y + options.barsArea.spacerY,
                    'xe' : _chart.base.v_x * (index + 1) + options.barsArea.spacerX,
                    'ye' : _chart.base.v_y + (bar.size * options.barsArea.height) + options.barsArea.spacerY
                },
                'horizontal' : {
                    'xs' : _chart.base.h_x + options.barsArea.spacerX,
                    'ys' : _chart.base.h_y * (index + 1) + options.barsArea.spacerY,
                    'xe' : _chart.base.h_x - (bar.size * options.barsArea.width) + options.barsArea.spacerX,
                    'ye' : _chart.base.h_y * (index + 1) + options.barsArea.spacerY
                }
            }
        }
    }

    function _get_label_position(slice, index) {
        
        let radians = _chart.slices[index].radians / 2;
        for (let i = index - 1; i >= 0; i--) {
            radians += _chart.slices[i].radians;
        }
        return {
            'x' : (options.viewbox.width / 2) + ((options.radius + 40) * Math.cos(radians)),
            'y' : (options.viewbox.height / 2) + ((options.radius + 40) * Math.sin(radians))
        }
        
    }

    // helper function

    function _trim( value ) {
        return value.toFixed(2);
    }
    
    // drawing functions
    // draw piechart
    function _draw_pie() {
        let content = '<g>';
        _chart.slices.forEach( (slice, index) => {
            content += `<path class="stroke-${index}" d="M${_trim(slice.points[0].x)},${_trim(slice.points[0].y)} `;
            for ( let i = 1; i < slice.points.length; i++) {
                content += `A ${options.radius} ${options.radius} 0 0 1 ${_trim(slice.points[i].x)} ${_trim(slice.points[i].y)} `;
            }
            content += `" fill="none" />`;
            const labelPosition = _get_label_position(slice, index);
            content += `<text class="label fill-${index}" transform="matrix(1 0 0 1 ${labelPosition.x} ${labelPosition.y}), rotate(90)">${slice.percent}%</text>`;
        });

        content += `<text class="total" transform="matrix(1 0 0 1 ${options.viewbox.width/2 - 20} ${options.viewbox.height/2}), rotate(90)">€${_chart.total.toFixed(1)}m</text></g>`;

        return content;
    }

    // draw simple stats
    function _draw_stat() {
        let content = '';
        _chart.bars.forEach( bar => {

            const xs = Math.floor(bar.points.horizontal.xs);
            const ys = Math.floor(bar.points.horizontal.ys);
            const xe = Math.floor(bar.points.horizontal.xe);
            const ye = Math.floor(bar.points.horizontal.ye);

            const edgeRightX = options.barsArea.width + options.barsArea.spacerX;

            const textOffsetY = ys - 40;
            let textValue = '';

            if(bar.value < 0) {
                if(_chart.unit.includes(':')) {
                    const textUnit = _chart.unit.split(':');
                    textValue = textUnit[0] + '(' + Math.abs(bar.value) + ')' + textUnit[1];
                } else {
                    textValue = '(' + Math.abs(bar.value) + ')' + _chart.unit;
                }
            } else {
                if(_chart.unit.includes(':')) {
                    const textUnit = _chart.unit.split(':');
                    textValue = textUnit[0] + bar.value + textUnit[1];
                } else {
                    textValue = bar.value + _chart.unit;
                }
            }

            content += `<text class="value" x="0" y="${textOffsetY}">${textValue}</text>`;
            content += `<text class="label" x="${edgeRightX}" y="${textOffsetY}">${bar.label}</text>`;
            content += `<path class="stroke-0" d="M${options.barsArea.spacerX} ${ys} L${edgeRightX} ${ye}" fill="none" />`
            content += `<path class="stroke-1" d="M${xs} ${ys} L${xe} ${ye}" fill="none" />`;
        });
        return content;
    }

    // draw vertical bar chart

    function _draw_vertical_bars() {
        let content = '';

        content += `<text class="unit" x="${options.viewbox.width/2 + options.barsArea.spacerY/2}" y="-20" transform="rotate(270)">${_chart.unit}</text>`;
        // draw chart max, base and min chart lines
        content += `<path class="stroke-thin" d="M2 2 L${options.viewbox.width - 2} 2" fill="none" />`;
        content += `<path class="stroke-thin" d="M2 ${_chart.base.v_y + options.barsArea.spacerY} L${options.viewbox.width - 2} ${_chart.base.v_y + options.barsArea.spacerY}" fill="none" />`;

        _chart.bars.forEach( bar => {

            const xs = Math.floor(bar.points.vertical.xs);
            const ys = Math.floor(bar.points.vertical.ys);
            const xe = Math.floor(bar.points.vertical.xe);
            const ye = Math.floor(bar.points.vertical.ye);
            
            content += `<text class="value" x="${xs}" y="${ye - 30}">${bar.value}</text>`;
            content += `<text class="label" x="${xs}" y="${ys + 60}">${bar.label}</text>`;
            
            content += `<path class="stroke-1" d="M${xs} ${ys} L${xe} ${ye}" fill="none" />`;
        });

        return content;
    }

    // draw line chart

    function _draw_line() {
        let content = '';

        content += `<text class="unit" x="${options.viewbox.width/2 + options.barsArea.spacerY/2}" y="-140" transform="rotate(270)">${_chart.unit}</text>`;
        // draw chart max, base and min chart lines
        content += `<path class="stroke-thin" d="M2 ${_chart.base.v_y + options.barsArea.spacerY} L${options.viewbox.width - 2} ${_chart.base.v_y + options.barsArea.spacerY}" fill="none" />`;

        
        _chart.bars.forEach( (bar, index) => {

            const xs = Math.floor(bar.points.vertical.xs);
            const ys = Math.floor(bar.points.vertical.ys);
            const xe = Math.floor(bar.points.vertical.xe);
            const ye = Math.floor(bar.points.vertical.ye);

            if (index == 0) {
                content += `<path class="stroke-1" d="M${xe} ${ye}`;
            } else {
                content += `L${xe} ${ye}`;
            }
        });

        content += `" fill="none" />`;

        _chart.bars.forEach( (bar, index) => {

            const xs = Math.floor(bar.points.vertical.xs);
            const ys = Math.floor(bar.points.vertical.ys);
            const xe = Math.floor(bar.points.vertical.xe);
            const ye = Math.floor(bar.points.vertical.ye);
            
            content += `<text class="value" x="${xs}" y="${ye - 20}">${bar.value}</text>`;
            content += `<text class="label" x="${xs}" y="${ys + 20}">${bar.label}</text>`;
            
            content += `<circle class="circle-${index}" cx=${xe} cy=${ye} r="7" style="transform-origin:${xe}px ${ye}px" />`;
        });

        return content;
    }

    // public methods

    function insert(chart, optionsMap) {

        options = optionsMap;

        _init(chart);
        // create SVG node
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewBox", `0 0 ${options.viewbox.width} ${options.viewbox.height}`);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");

        let svgContent;
        if (_chart.type == 'pie') {
            svgContent = _draw_pie();
        }

        if (_chart.type == 'bars-stat') {
            svgContent = _draw_stat();
        }

        if (_chart.type == 'bars-vertical') {
            svgContent = _draw_vertical_bars();
        }

        if (_chart.type == 'line') {
            svgContent = _draw_line();
        }

        svg.innerHTML = svgContent;
        chart.appendChild(svg);

        const paths = chart.querySelectorAll('path');

        paths.forEach( path => {
            path.setAttribute('stroke-dasharray', path.getTotalLength());
            path.setAttribute('stroke-dashoffset', path.getTotalLength());
        });
    }

    // 'module' exports
    return {
        insert: insert   
    }
})();