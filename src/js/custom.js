
'use strict';

const viewport = $('.viewport');

const set_header = () => {

    const nav = $('header');
    const top = 100;
    const menuOpen = $('.navbar-collapse').hasClass('show') ? true : false;
    const homeIsActive = viewport[0].id == 'home' ? true : false;
    const position = viewport.scrollTop();

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
    
}

set_header();


// custom events
viewport.scroll(_.debounce(set_header, 100));

$('#scrollDown').on('click', () => {

    const target = document.querySelector('.content-sections');
    const navbar = document.querySelector('.navbar-nav');


    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const position = rect.top + scrollTop - navbar.offsetHeight;

    console.log(navbar.offsetHeight);

    viewport.scrollTop(position);
});

$('#scrollUp').on('click', () => {
    viewport.scrollTop(0, 0);
});


/********** Charts **************/

const calc_radians = angle => angle * Math.PI / 180;

const calc_percentages = values => {
    let sum = values.reduce( (sum, val) => sum += val );
    return values.map( val => Math.round(val / sum * 100) );
}

const calc_points = (cx, cy, cradius, radians) => {
    return {
        'x'     : cx + cradius * Math.cos(radians),
        'y'     : cy + cradius * Math.sin(radians)
    }
};

const c_anchors = (cx, cy, cradius) => {
    return {
        'x0' : cx + cradius,    'y0' : cy,
        'x1' : cx,              'y1' : cy + cradius,
        'x2' : cx - cradius,    'y2' : cy,
        'x3' : cx,              'y3' : cy - cradius 
    }
}

const calc_mid = (cx, cy, cradius, val) => {
    if (val > 50) {

    } else {
        return []
    }
}

const calc_coordinates = (values, cx, cy, cradius) => {
    
    let obj = values.map( (val, index) => {
        if (index == 0) {
            return {
                'start' : { 'x': cx + cradius, 'y': cy},
                'mid'   : [],
                'end'   : calc_points(cx, cy, cradius, calc_radians( val * 360 / 100 ) )
            }
        } else if (index < (values.length - 1)) {
            return {
                'start' : calc_points(cx, cy, cradius, calc_radians( values[index - 1] * 360 / 100 ) ),
                'mid'   : [],
                'end'   : calc_points(cx, cy, cradius, calc_radians( val * 360 / 100 ) )
            }
        } else {
            return {
                'start' : calc_points(cx, cy, cradius, calc_radians( values[index - 1] * 360 / 100 ) ),
                'mid'   : [],
                'end'   : { 'x': cx + cradius, 'y': cy}
            }
        }
    });

    return obj; 
}



const build_chart = (chart) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const classes = ['secondary', 'info'];
    const values = chart.dataset.values.split(';').map( val => Number(val));

    
    
    let svgContent = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" version="1.1">`;
    
    // calculate coordinates
    const coordinates = values.map( (val, index) => {
        
        let obj = [];

        if ( index == 0 ) {
            if (val <= 50) {
                const radians = ( val * 360 / 100 ) * ( Math.PI / 180 );
                obj = [
                {
                    'xs' : 380,
                    'ys' : 200,
                    'xe' : 200 + 180 * Math.cos(radians),
                    'ye' : 200 + 180 * Math.sin(radians)
                }];
            } else {
                const radians = ( val * 360 / 100 ) * ( Math.PI / 180 );
                obj = [
                {
                    'xs' : 380,
                    'ys' : 200,
                    'xe' : 20,
                    'ye' : 200
                },
                {
                    'xs' : 20,
                    'ys' : 200,
                    'xe' : 200 + 180 * Math.cos(radians),
                    'ye' : 200 + 180 * Math.sin(radians)
                }];
            }
        } else {
            if (val <= 50) {
                const radians = ( values[index-1] * 360 / 100 ) * ( Math.PI / 180 );
                obj = [
                {
                    'xs' : 200 + 180 * Math.cos(radians),
                    'ys' : 200 + 180 * Math.sin(radians),
                    'xe' : 380,
                    'ye' : 200
                }];
            } else {
                const radians = ( values[index-1] * 360 / 100 ) * ( Math.PI / 180 );
                obj = [
                {
                    'xs' : 200 + 180 * Math.cos(radians),
                    'ys' : 200 + 180 * Math.sin(radians),
                    'xe' : 200,
                    'ye' : 20
                },
                {
                    'xs' : 200,
                    'ys' : 20,
                    'xe' : 380,
                    'ye' : 200
                }];
            }
        }
        return {'set' : obj, 'class' : classes[index] };
    });

    // draw paths
    coordinates.forEach( obj => {
        svgContent += `<path class="${obj.class}" d="`;
        obj.set.forEach( pair => {
            svgContent += `M${pair.xs},${pair.ys} A 180 180 0 0 1 ${pair.xe} ${pair.ye} `;
        });
        svgContent += `" fill="none" />`;
    });

    svgContent += "</svg>";
    svg.innerHTML = svgContent;
    chart.appendChild(svg);
}

const make_charts = () => {
    
    // get charts on page
    const charts = document.querySelectorAll('.chart');

    const init_chart = (chart) => {

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let svgContent = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" version="1.1">`;
        

        const classes = ['secondary', 'info'];
        const initValues = chart.dataset.values.split(';').map( val => Number(val));

        const values = calc_percentages(initValues);

        const coordinates = values.map( (val, index) => {
            
            let obj = [];

            if ( index == 0 ) {
                if (val <= 50) {
                    const radians = ( val * 360 / 100 ) * ( Math.PI / 180 );
                    obj = [
                    {
                        'xs' : 380,
                        'ys' : 200,
                        'xe' : 200 + 180 * Math.cos(radians),
                        'ye' : 200 + 180 * Math.sin(radians)
                    }];
                } else {
                    const radians = ( val * 360 / 100 ) * ( Math.PI / 180 );
                    obj = [
                    {
                        'xs' : 380,
                        'ys' : 200,
                        'xe' : 20,
                        'ye' : 200
                    },
                    {
                        'xs' : 20,
                        'ys' : 200,
                        'xe' : 200 + 180 * Math.cos(radians),
                        'ye' : 200 + 180 * Math.sin(radians)
                    }];
                }
            } else {
                if (val <= 50) {
                    const radians = ( values[index-1] * 360 / 100 ) * ( Math.PI / 180 );
                    obj = [
                    {
                        'xs' : 200 + 180 * Math.cos(radians),
                        'ys' : 200 + 180 * Math.sin(radians),
                        'xe' : 380,
                        'ye' : 200
                    }];
                } else {
                    const radians = ( values[index-1] * 360 / 100 ) * ( Math.PI / 180 );
                    obj = [
                    {
                        'xs' : 200 + 180 * Math.cos(radians),
                        'ys' : 200 + 180 * Math.sin(radians),
                        'xe' : 200,
                        'ye' : 20
                    },
                    {
                        'xs' : 200,
                        'ys' : 20,
                        'xe' : 380,
                        'ye' : 200
                    }];
                }
            }
            return {'set' : obj, 'class' : classes[index] };
        });
        
        coordinates.forEach( obj => {
            svgContent += `<path class="${obj.class}" d="M${obj.set[0].xs},${obj.set[0].ys} `;
            obj.set.forEach( pair => {
                svgContent += `A 180 180 0 0 1 ${pair.xe} ${pair.ye} `;
            });
            svgContent += `" fill="none" />`;
        });

        const totalVal = (initValues[0] + initValues[1]).toFixed(1);

        svgContent += `
            <text class="total" transform="matrix(1 0 0 1 190 200), rotate(90)">€${totalVal}m</text>
            <text class="label_1" transform="matrix(1 0 0 1 20 360), rotate(90)">${values[0]}%</text>
            <text class="label_2" transform="matrix(1 0 0 1 360 40), rotate(90)">${values[1]}%</text>`;

        svgContent += "</svg>";
        svg.innerHTML = svgContent;
        chart.appendChild(svg);

        const paths = svg.querySelectorAll('path');
        
        paths.forEach( path => {
            path.setAttribute('stroke-dasharray', path.getTotalLength());
            path.setAttribute('stroke-dashoffset', path.getTotalLength());
        });
    }

    charts.forEach( chart => {
        init_chart(chart);
    });

    
}

make_charts();
