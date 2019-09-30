
const viewport = $('.viewport');

function offset_top(el) {
    const rect = el.getBoundingClientRect();
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop
}

const set_header = () => {

    const nav = $('header');
    const top = 100;
    const menuOpen = $('.navbar-collapse').hasClass('show') ? true : false;
    const position = viewport.scrollTop();

    if (position >= top && !menuOpen) {
        nav.removeClass('expanded');
    } else {
        nav.addClass('expanded');
    }
}

const animateElements = document.getElementsByClassName('animate');
const animOptions = {
    offset: 50
}

const animate = () => {
    const height = window.innerHeight - animOptions.offset;
    Array.from(animateElements).forEach( el => {
        
        const el_top = offset_top(el);

        if ((el_top - height) <= 0 && !$(el).hasClass('in')) {
            setTimeout( function() {
                $(this).addClass('in');
            }
                .bind(el),
                Number($(el).data("anim-delay"))
            );
        }

        if ((el_top - height) > 0 && $(el).hasClass('in')) {
            $(el).removeClass('in');
         }
    });
}
set_header();
// custom events
viewport.scroll(_.debounce(set_header, 100));
viewport.scroll(_.throttle(animate, 100));