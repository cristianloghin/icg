
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



