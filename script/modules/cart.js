(function($) {
	var shoppingCart = BASE.shoppingCart;
    var cartData = shoppingCart.get();
    var ajaxBackData;

    //购物车商铺列表
    (function() {
        var shoppingCartList = $('#shoppingCartList');
        var cartCount = $('#cartCount');
        if(!shoppingCartList.length) return;

        //获取购物车商铺列表
        var url = (function(){
            var u = [];
            for(var i = 0; i < cartData.length; i ++){
                u.push(cartData[i].id);
            }
            return u.length ? u.join(',') : false;
        })();



        if(url){
            $.ajaxBind({
                url: '/api/cart/market/goods/by/ids?goods_ids=' + url
            },{
                onSuccess: function(data){
                    var mktArray = data.result.cartMarkets;
                    for(var i = 0; i < mktArray.length; i ++){
                        var totalPrice = 0;
                        var totalNumber = 0;
                        for(var j = 0; j < mktArray[i].goods.length; j ++){
                            var getCartData = shoppingCart.get(mktArray[i].goods[j].id);
                            totalPrice += getCartData.number * mktArray[i].goods[j].price;
                            totalNumber += getCartData.number;
                        }
                        mktArray[i].totalNumber = totalNumber;
                        mktArray[i].totalPrice = totalPrice;
                    }
                    var htmls = template('shoppingCartTemp', mktArray);
                    shoppingCartList.html(htmls);
                    ajaxBackData = mktArray;
                    getCount();
                }
            });
        } else {
            var htmls = template('shoppingCartTemp', []);
            shoppingCartList.html(htmls);
            getCount();
        }
        
        

        //清空单个超市
        shoppingCartList.on('tap', '.del_btn', function() {
            var item = $(this).closest('.cart_item');
            var id = item.data('id');
            shoppingCart.remove(id);
            item.addClass('fadeOut');
            setTimeout(function() {
                item.remove();
            }, 400);
        });

        //清空购物车
        cartCount.find('.del_btn').on('tap', function(){
            $.confirm('确认清空购物车？', function(boolen){
                if(boolen){
                    shoppingCart.remove();
                    window.location.reload();
                }
            });
        });

        //全部结算
        cartCount.find('.buy_btn').on('tap', function(){
            var idString = [];
            var submitCartData = shoppingCart.get();
            for(var i = 0; i < submitCartData.length; i ++){
                idString.push(submitCartData[i].id);
            }
            submitOrder(idString.join(','));
            return false;
        });

        //得到总数
        function getCount() {
            var totalPrice = 0,
                totalNumber = 0;

            $.each(ajaxBackData, function(i, val) {
                totalPrice += val.totalPrice;
                totalNumber += val.totalNumber;
            });

            cartCount.find('.totalNumber').text(totalNumber);
            cartCount.find('.totalPrice').text(totalPrice);
        }
    })();


    //购物车详情
    (function(){
        var goodsAjaxData;
    	var marketId = location.hash.replace('#?id=', '');
        var listData = getPrdListDataByMktId(marketId);
    	var shoppingDtList = $('#shoppingDtList');

    	var mktCount = $('#mktCount');
    	if(!shoppingDtList.length) return;

        $.ajaxBind({
            url: '/api/cart/market/goods/by/ids?goods_ids=' + listData.idStr
        },{
            onSuccess: function(data){
                console.log(data);
                var goodsData = data.result.cartMarkets[0].goods;
                for(var i = 0; i < goodsData.length; i ++){
                    goodsData[i].number = shoppingCart.get(goodsData[i].id).number;
                }
                var htmls = template('prdItemTemp', goodsData);
                shoppingDtList.html(htmls);
                goodsAjaxData = goodsData;
                setCount();
            }
        });
    	


        //绑定选择
        shoppingDtList.on('tap', '.prd_item', function(e){
        	var target = $(e.target);
        	if(target.closest('.cpt-plug').length) return;
        	if($(this).hasClass('prd_selected')) {
        		$(this).removeClass('prd_selected');
        	} else {
        		$(this).addClass('prd_selected');
        	}
        });

        //绑定加
        shoppingDtList.on('tap', '.cpt-add', function(){
        	var input = $(this).next();
        	var number = parseInt(input.val());
        	var max = input.data('max');
        	var item = input.closest('.prd_item');
        	number ++;
        	if(number > max) number = max;
        	input.val(number);
        	numberChange(number, input, item);
        	return false;
        });

        //绑定减
        shoppingDtList.on('tap', '.cpt-sub', function(){
        	var input = $(this).prev();
        	var number = parseInt(input.val());
        	var min = input.data('min');
        	var item = input.closest('.prd_item');
        	if(number <= 0){
				return false;
			} else {
				number = (number - 1) < min ? 0 : (number - 1);
				input.val(number);
			}
        	input.val(number);
        	numberChange(number, input, item);
        	return false;
        });

        //绑定删除
        mktCount.find('.del_btn').on('tap', function(){
        	var getSelect = shoppingDtList.find('.prd_selected');
        	if(!getSelect.length) return;
        	getSelect.each(function(){
                var me = $(this);
        		var id = me.find('.cpt-num').data('id');
        		var index = getIndexInAjaxData(id);
                shoppingCart.remove(id);
                goodsAjaxData.remove(index);
                me.addClass('fadeOut');
                setTimeout(function(){
                    me.remove();
                    setCount();
                }, 400);
        	});
        });



        //
        var numberChange = function(number, input, item){
            var index = getIndexInAjaxData(input.data('id'));
        	if(number <= 0){
                shoppingCart.remove(input.data('id'));
                goodsAjaxData.remove(index);
                item.addClass('fadeOut');
                setTimeout(function(){
                    item.remove();
                    setCount();
                }, 400);
			} else {
				//添加
                var oData = shoppingCart.get(input.data('id'));
                oData.number = number;
                goodsAjaxData[index].number = number;
                shoppingCart.set(oData)
				setCount();
			}
        };

        //得到商品在ajax数据的索引
        var getIndexInAjaxData = function(id){
            for(var i = 0; i < goodsAjaxData.length; i ++){
                if(goodsAjaxData[i].id === id){
                    return i;
                }
            }
        }




        //得到统计数
        var setCount = function(){
        	var totalPrice = 0;
        	var totalNumber = 0;
        	$.each(goodsAjaxData, function(i, val){
        		totalPrice += val.number * val.price;
        		totalNumber += val.number;
        	});
        	mktCount.find('.totalNumber').text(totalNumber);
        	mktCount.find('.totalPrice').text(totalPrice);
        };
        

        function getPrdListDataByMktId(mktId){
            var prdIdList = [];
            var totalNumber = 0;
            for(var i = 0; i < cartData.length; i ++){
                if(cartData[i].marketId === mktId){
                    prdIdList.push(cartData[i].id);
                    totalNumber += cartData[i].number;
                }
            }
            return {
                idStr: prdIdList.join(','),
                totalNumber: totalNumber
            };
        }
    })();


})(Zepto);