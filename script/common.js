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

    window.getUrlData = function(){
        var a = window.location.hash;
        if (a.indexOf("#") < 0 || a.indexOf("=") < 0)
            return {};
        for (var b = a.split("?")[1], c = b.split("&"), d = new Object, e = 0; e < c.length; e++) {
            var f = c[e].split("=");
            d[f[0]] = f[1]
        }
        return d
    };

})(Zepto);