'use strict';

const Animate = (function () {

    const _animOptions = {
        offset: 75
    }

    // private functions

    function _get_offset_top(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return rect.top + scrollTop;
    }

    // public functions

    function evaluate(element) {

        const top = _get_offset_top(element);
        const height = window.innerHeight - _animOptions.offset;

        if ((top - height) <= 0 && !element.classList.contains('in')) {
            setTimeout( () => {
                element.classList.add('in');
            },
                Number(element.dataset.animDelay)
            );
        }
    }

    // 'module' exports
    return {
        evaluate: evaluate,
    }
})();