var BASE = {};
(function($) {
    BASE.rootMask = $('#lightMask');
    BASE.boxMask = $('#boxMask');
    BASE.mainMask = $('#mainMask');

    var loading = document.getElementById('sysLoading');
    
    /*
    window.addEventListener('DOMContentLoaded', function () {
    loading.style.display = 'none';
    });
    */
    window.addEventListener('beforeunload', function() {
        if (loading != undefined) {
            loading.style.display = 'block';
            BASE.rootMask.show();
        }
    });

    //layout
    (function() {
        var resizeTimer;
        var rootHmtl = $(':root');
        var rootResize = function() {
            var fontSize = $(window).width() / 16;
            if (fontSize > 67.6) fontSize = 67.5;
            rootHmtl.css('font-size', fontSize).show();
            window.FontSize = fontSize;
        };
        rootResize();

        $(window).on('resize', function() {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                rootResize();
            }, 200);
        });
    })();

})(Zepto);