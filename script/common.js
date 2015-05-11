var BASE = {};
var img_root = 'http://m.joyqz.com';
var Root = SiteRoot + '';
var ApiBox = {
    wxMenuCreat: '/wechat/menu/create',
    wxConfigApi: '/wxconfig',
    listApi: '/m/list',
    detailApi: '/m/detail',
    refreshReadTimeApi: '/m/detail/interact'
};

var MainLoadingBox = loadingBox();

function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function wxConfigLoad(callback) {
    $.ajaxBind({
        url: Root + ApiBox.wxConfigApi
    }, {
        onSuccess: function(data) {
            
            wx.config(data);
            if(is_weixin()){
                //如果是微信
                wx.ready(function(){
                    wx.getLocation({
                        success: function(res) {
                            reCall();
                            Base.locationData = res;
                            Base.sortRange = true;
                        },
                        cancel: function(res) {
                            Base.sortRange = false;
                            reCall();
                        }
                    });
                    
                });
            } else {
                //直接访问
                reCall();
            }
            
        }
    });

    function reCall(){
        $.ajaxBind({
            url: Root + ApiBox.wxMenuCreat
        }, {});
        callback();
    }
}


(function($) {
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);


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

    window.getUrlData = function() {
        var a = location.search;
        if (a.indexOf("?") < 0 || a.indexOf("=") < 0)
            return {};
        for (var b = a.split("?")[1], c = b.split("&"), d = new Object, e = 0; e < c.length; e++) {
            var f = c[e].split("=");
            d[f[0]] = f[1]
        }
        return d
    };

})(Zepto);