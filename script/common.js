var BASE = {};
(function($) {
    BASE.rootMask = $('#lightMask');
    BASE.boxMask = $('#boxMask');
    BASE.mainMask = $('#mainMask');

    var loading = document.getElementById('sysLoading');
    window.submitOrder = function(idString){
        var form = $('<form action="/order/confirm" method="post"></form>');
        form.append('<input value="'+idString+'" name="goods_ids"></div>');
        form.submit();
    };
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
            rootHmtl.css('font-size', fontSize);
            window.ROOTFONTSIZE = fontSize;
        };
        rootResize();

        $(window).on('resize', function() {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                rootResize();
            }, 200);
        });
    })();

    //header
    (function() {
        var mainHeader = $('#mainHeader');
        var loginWrap = $('#loginWrap');
        var dragObj;
        if (store.get('userBtnLocation')) {
            var location = store.get('userBtnLocation');
            loginWrap.css({
                left: location.left,
                top: location.top
            });
        } else {
            loginWrap.css({
                left: ROOTFONTSIZE * 12
            });
        }
        dragObj = loginWrap.touchDrag({
            dragEnd: function(dom) {
                var left = dom.data('left');
                var top = dom.data('top');
                left = ROOTFONTSIZE * 12;
                dom.css('left', left).data('left', left);
                dragObj.destroy();
                loginWrap.removeClass('drag-enable');
                // store.set('userBtnLocation', {
                //     top: dom.data('top'),
                //     left: left
                // });
            }
        });
        loginWrap.on('longTap', function() {
            if (loginWrap.hasClass('menu-show')) return;
            loginWrap.addClass('drag-enable');
            dragObj.init();
        });

        $('#menuIcon').on('tap', function() {
            if (mainHeader.hasClass('menu-show')) {
                mainHeader.removeClass('menu-show').css('z-index', '');
                BASE.rootMask.hide().off('tab.menu');
            } else {
                mainHeader.addClass('menu-show').css('z-index', 1000);
                BASE.rootMask.show();
                BASE.rootMask.on('tap.menu', function() {
                    mainHeader.removeClass('menu-show').css('z-index', '');
                    BASE.rootMask.hide();
                    return false;
                });
            }
        });

        $('#loginBtn').on('tap', function() {
            if (loginWrap.hasClass('login-menu-show')) {
                loginWrap.removeClass('login-menu-show').css('z-index', '');
                BASE.rootMask.hide().off('tap.login');
            } else {
                loginWrap.addClass('login-menu-show').css('z-index', 1000);
                BASE.rootMask.show();
                BASE.rootMask.on('tap.login', function() {
                    BASE.rootMask.hide();
                    loginWrap.removeClass('login-menu-show');
                    return false;
                });
            }
        });

    })();

    //购物车
    BASE.shoppingCart = (function(){
        var shoppingCart = store.get('shoppingCart')|| [];
        return {
            get: function(id){
                if(id){
                    for(var i = 0; i < shoppingCart.length; i ++){
                        if(shoppingCart[i].id === id){
                            return shoppingCart[i];
                        }
                    }
                    return null;
                } else {
                    return shoppingCart;
                }
            },
            getInMarket: function(marketId){
                var goods = [];
                for(var i = 0; i < shoppingCart.length; i ++){
                    if(shoppingCart[i].marketId === marketId){
                        goods.push(shoppingCart[i]);
                    }
                }
                return goods;
            },
            remove: function(id){
                if(id){
                    for(var i = 0; i < shoppingCart.length; i ++){
                        if(shoppingCart[i].id === id){
                            shoppingCart.remove(i);
                            return store.set('shoppingCart', shoppingCart);
                        }
                    }
                } else{
                    store.remove('shoppingCart');
                    return;
                }
            },
            set: function(obj){
                var goodsId = obj.id;
                for(var i = 0; i < shoppingCart.length; i ++){
                    //如果存在
                    if(shoppingCart[i].id === goodsId){
                        shoppingCart[i] = obj;
                        return store.set('shoppingCart', shoppingCart);
                    }
                }
                //如果不存在
                shoppingCart.push(obj);
                store.set('shoppingCart', shoppingCart);
                return shoppingCart;
            }
        }
    })();

    //获取位置信息
    (function(){
        BASE.getRange = function(lat, lng){
            var location = BASE.getLocation.location;
            var range = getFlatternDistance(lat, lng, location.lat, location.lng);

            if(range > 1000){
                range = (range / 1000).toFixed(1) + 'km';
            } else {
                range = parseInt(range/ 50) * 50 + 'm';
            }
            return range
        };

        var PI = Math.PI;
        var EARTH_RADIUS = 6378137.0;    //单位M
        function getRad(d){
            return d*PI/180.0;
        }
        /**
         * approx distance between two points on earth ellipsoid
         * @param {Object} lat1
         * @param {Object} lng1
         * @param {Object} lat2
         * @param {Object} lng2
         */
        function getFlatternDistance(lat1,lng1,lat2,lng2){
            var f = getRad((lat1 + lat2)/2);
            var g = getRad((lat1 - lat2)/2);
            var l = getRad((lng1 - lng2)/2);
            
            var sg = Math.sin(g);
            var sl = Math.sin(l);
            var sf = Math.sin(f);
            
            var s,c,w,r,d,h1,h2;
            var a = EARTH_RADIUS;
            var fl = 1/298.257;
            
            sg = sg*sg;
            sl = sl*sl;
            sf = sf*sf;
            
            s = sg*(1-sl) + (1-sf)*sl;
            c = (1-sg)*(1-sl) + sf*sl;
            
            w = Math.atan(Math.sqrt(s/c));
            r = Math.sqrt(s*c)/w;
            d = 2*w*a;
            h1 = (3*r -1)/2/c;
            h2 = (3*r +1)/2/s;
            
            return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
        }

        BASE.getLocation = (function(){
            var loading;
            return {
                location: {
                    lat: 30.557488,
                    lng: 104.072405
                }
            }
            function getLocation() {
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                    //loading = loadingBox();
                } else {
                    $.alert('您的浏览器不支持获取位置信息');
                }
            }

            function showPosition(position) {
                console.log(position);
                store.set('position',{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                //loading();
            }
            getLocation();
        })();
        
        
    })();

})(Zepto);