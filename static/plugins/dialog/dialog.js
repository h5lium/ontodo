(function(){
    /* jQuery dialog plugin */
    // depends on: underscore.js
    $.fn.dialog = function(command){
        return $(this).each(function(i, el){
            var $el = $(el);
            if (command === 'open') {
                $el.addClass('dialog-open');
            } else if (command === 'close') {
                $el.removeClass('dialog-open');
                $el.find('form').trigger('reset');
            } else if (command === 'toggle') {
                $el.toggleClass('dialog-open');
            }
        });
    }

    function onScroll(){
        var $window = $(this);
        var windowHeight = $window.height();
        $('.dialog').each(function(i, el){
            var $dialog = $(el);
            $dialog.stop().animate({
                'top': windowHeight * 0.4 + getScrollTop() - $dialog.height() / 2
            }, 500);
        });
    }
    $(window).on('scroll resize', debounce(onScroll, 100)).trigger('scroll');

    $(function(){
        $('body').delegate('[rel="dialog-toggle"]', 'click', function(){
            var href = $(this).attr('href');    // eg. href="#user-dialog"
            $(href).dialog('toggle');
            return false;
        }).delegate('[rel="dialog-open"]', 'click', function(){
            var href = $(this).attr('href');
                $(href).dialog('open');
            return false;
        }).delegate('[rel="dialog-close"]', 'click', function(){
            var href = $(this).attr('href');
            if (href) {
                $(href).dialog('close');
            } else {
                $(this).closest('.dialog').dialog('close');
            }
            return false;
        });
    });

    function getScrollTop(){
        var scrollTop;
        if (typeof window.scrollY !== 'undefined') {
            scrollTop = window.scrollY;
        } else if (typeof window.pageYOffset !== 'undefined') {
            scrollTop = window.pageYOffset; //Netscape
        } else if (typeof document.compatMode !== 'undefined' &&
            document.compatMode !== 'BackCompat') {
            scrollTop = document.documentElement.scrollTop; //Firefox、Chrome
        } else if (typeof document.body !== 'undefined') {
            scrollTop = document.body.scrollTop; //IE
        }
        return scrollTop;
    }

    // from UnderscoreJS framework
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
})();