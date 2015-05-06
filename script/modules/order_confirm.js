(function($){
	var submitData = {
		marketOrders: []
	};
	var addressListBox = $('#addressListBox');
	submitData.deliveryAddressId = addressListBox.find('.current').find('.addressHiddenId').val();
	addressListBox.on('tap', '.order_man', function(){
		var me = $(this);
		var showMark = addressListBox.hasClass('listShow');
		var tagMark = me.hasClass('current');
		if(showMark){
			addressListBox.removeClass('listShow');
			if(!tagMark){
				me.prependTo(addressListBox).addClass('current').siblings().removeClass('current');
				submitData.deliveryAddressId = me.find('.addressHiddenId').val();
			}
		} else {
			addressListBox.addClass('listShow');
		}
	});

	//获取信息
	var shop_item = $('.shop_item');
	var orderCount = $('#orderCount');
	var shoppingCart = BASE.shoppingCart;
	var pCont = {
		tPrice: 0,
		tNumber: 0
	};
	var submitOrderList = [];
	shop_item.each(function(e){
		var totalNumber = 0;
		var totalPrice = 0;
		var thisShop = $(this);
		var marketId = thisShop.find('.mktId').val();
		submitData.marketOrders.push({
			marketId: marketId,
			goods:[]
		});
		thisShop.find('.prd_item').each(function(k){
			var goodsInput = $(this).find('input.goodsId');
			var goodsId = goodsInput.val();
			var goodsPrice = goodsInput.data('price');
			var number = shoppingCart.get(goodsId).number;
			var tPrice = number * goodsPrice;
			submitOrderList.push(goodsId);
			$(this).find('.n').text(number);
			totalPrice += tPrice;
			totalNumber += number;
			submitData.marketOrders[e].goods.push({
				goodsId: goodsId,
				buyCount: number
			});
		});
		pCont.tPrice += totalPrice;
		pCont.tNumber += totalNumber;
		thisShop.find('.s_number').text(totalNumber).siblings('.s_price').text(totalPrice);
	});

	orderCount.find('.n').text(pCont.tNumber);
	orderCount.find('.c').text(pCont.tPrice);
	//结算
	orderCount.find('.buy_btn').on('tap', function(){
		console.log(submitData);
		$.ajaxBind({
			url: '/api/order/place',
			type: 'post',
			contentType:'text/html; charset=utf-8',
			data: JSON.stringify(submitData)
		},{
			onSuccess: function(data){
				$.alert('下单成功！');
				for(var i = 0; i < data.result.marketOrderStateList.length; i++){
					submitOrderList.removevalue(data.result.marketOrderStateList.failGoodsId);
				}
				for(var j = 0; j < submitOrderList.length; j ++){
					shoppingCart.remove(submitOrderList[j]);
				}
				setTimeout(function(){
					location.href = '/my/order';
				}, 3000);
				console.log(data);
			}
		});
		return false;
	});
})(Zepto);