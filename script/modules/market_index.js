(function($, win, doc){
	var marketId = $('#marketId').val();
	var ajaxData = {
		page_size: 10,
		page: 2,
		goods_type:'',
		market_id: marketId
	};

	var isSearch = $('#mktGoodsSearch').length;
	var shoppingCart = BASE.shoppingCart;
	var cartData = shoppingCart.getInMarket(marketId);

	template.helper('formartJson', function(value){
		return JSON.stringify(value);
	});



	var goodsListContent = $('#goodsListContent');
	var goodsTypeBar = $('#goodsTypeBar');

	var scrollHeight = doc.height() - 6 * ROOTFONTSIZE;
	var appending = false;
	var winHeight = win.height();
	var isEnd = false;


	//轮播
	(function(){
		var slider = $('#slider');
		if(slider.length && slider.find('img').length){
			var sliderArr = [];
			slider.height(8 * ROOTFONTSIZE);
			slider.find('img').each(function(){
				var src = $(this).attr('src');
				sliderArr.push({
					width: 16 * ROOTFONTSIZE,
					height: 8 * ROOTFONTSIZE,
					content: '<img src="'+ src + '" width="'+16 * ROOTFONTSIZE+'" height="'+8 * ROOTFONTSIZE+'">'
				});
			});
			slider.empty();

			var islider = new iSlider({
				data: sliderArr,
				dom: slider[0],
		        isVertical: false,
		        isLooping: true,
		        type: 'dom'
			});
			 islider.addDot();
		 }
	})();

	//获取数据
	function getAjaxData(){
		if(appending || isEnd) return;
		appending = true;
		$.ajaxBind({
			data: ajaxData,
			url: '/market/goods'
		},{
			onSuccess: function(data){
				var goods = data.result.goods;
				for(var i = 0; i < goods.length; i ++){
					
					if(goods[i].ifDistrGoods === 1){
						//分销商品
						goods[i].max = goods[i].maxBuyCount;
					} else {
						//非分销商品
						goods[i].max = goods[i].maxBuyCount > goods[i].remain || goods[i].maxBuyCount === 0 ? goods[i].remain : goods[i].maxBuyCount;
					}
				}
				var html = template('goodsItemTemp', goods);
				if(ajaxData.page === 1){
					goodsListContent.html(html);
				} else {
					goodsListContent.append(html);
				}

				scrollHeight = doc.height() - 3 * ROOTFONTSIZE;

				ajaxData.page ++;
				appending = false;

				if(data.result.goods.length < ajaxData.page_size){
					isEnd = true;
				}

				cogradientNumber();
			}
		});
	}

	//点击
	goodsTypeBar.on('tap', 'a', function(){
		if($(this).hasClass('current')) return false;
		$(this).addClass('current').siblings().removeClass('current');
		var type = $(this).data('id');
		ajaxData.goods_type = type;
		ajaxData.page = 1;
		isEnd = false;
		getAjaxData();
		return false;
	});

	if(!isSearch){
		//滚动
		win.on('scroll', function(){
			if(appending) return false;
			var top = win.scrollTop() + winHeight;
			//console.log(top);
			if(top > scrollHeight){
				getAjaxData();
			}
		});
	}
	


	//搜索
	if(isSearch){
		(function(){
			var mktSearchForm = $('#mktSearchForm');
			var dftData = mktSearchForm.formParams();
			dftData.page = 1;
			dftData.page_size = 10000;
			
			var getSearchData = function(){
				$.ajaxBind({
					type: 'get',
					url: '/market/api/search',
					data: dftData
				},{
					onSuccess: function(data){
						var html = template('goodsItemTemp', data.result.goods);
						goodsListContent.html(html);
						cogradientNumber();
						//shoppingCartSetDefault();
					}
				})
			};

			getSearchData();
		})();
	}

	//购物车
	(function(){
		var cartWrap = $('#cartWrap');
		

		if(cartData.length){
			//url
			var url = (function(){
				var ids = [];
				for(var i = 0; i < cartData.length; i ++){
					ids.push(cartData[i].id);
				}

				return '/api/cart/market/goods/by/ids?goods_ids=' + ids.join(',');
			})();

			//调用同步
			cogradientNumber();

			//获取数据
			$.ajaxBind({
				url: url
			},{
				onSuccess: function(data){
					var marketData = data.result.cartMarkets[0];
					for(var i = 0; i < marketData.goods.length; i ++){
						for(var j = 0; j < cartData.length; j++){
							if(marketData.goods[i].id === cartData[j].id){
								marketData.goods[i].number = cartData[j].number;
							}
						}
					}
					var htmls = template('shopingCartTemp', data.result.cartMarkets[0]);
					cartWrap.html(htmls);
					countShoppingCart();
				}
			});
		} else {
			var htmls = template('shopingCartTemp', cartData);
			cartWrap.html(htmls);
		}


		//添加绑定
		goodsListContent.on('tap', '.add', function(){
			var input = $(this).prev();
			var number = parseInt(input.val());
			var min = input.data('min');
			var max = input.data('max');
			var item = $(this).closest('li');
			if(number === 0){
				number = min;
				input.val(number);
			} else {
				number = (number + 1) > max ? max : (number + 1);
				input.val(number);
			}

			numberChange(number, input);
		});

		//减少绑定
		goodsListContent.on('tap', '.sub', function(){
			var input = $(this).next();
			var number = parseInt(input.val());
			var min = input.data('min');
			var max = input.data('max');
			var item = $(this).closest('li');
			if(number <= 0){
				return false;
			} else {
				number = (number - 1) < min ? 0 : (number - 1);
				
			}

			if(number === 0){
				$.confirm('确认删除购物车中此商品？', function(bool){
					if(bool){
						number = 0;
						numberChange(number, input);
					} else {
						input.val(min);
					}
				});
			} else {
				input.val(number);
				numberChange(number, input);
			}
		});


		//购物车开关
		cartWrap.on('tap', '#shoppingCartTog', function(){
			var me = this;
			if(!me.open){
				cartWrap.find('.cart_list').show().addClass('bounceIn');
				setTimeout(function(){
					cartWrap.find('.cart_list').removeClass('bounceIn')
				}, 400);
				BASE.rootMask.show().on('tap.cart', function(){
					cartWrap.find('.cart_list').addClass('bounceOut');
					setTimeout(function(){
						cartWrap.find('.cart_list').hide().removeClass('bounceOut');
						me.open = false;
					}, 400);
					BASE.rootMask.off('tap.cart').hide();
				});
				me.open = true;
			}
		});

		//购物车加法
		cartWrap.on('tap', '.add', function(){
			var input = $(this).prev();
			var number = parseInt(input.val());
			var min = input.data('min');
			var max = input.data('max');
			var price = input.data('tprice') / number;
			var item = $(this).closest('li');
			var listInput = $('#input_' + input.data('id'));
			if(number === 0){
				number = min;
				input.val(number);
			} else {
				number = (number + 1) > max ? max : (number + 1);
				input.val(number);
			}

			listInput.val(number);
			numberChange(number, input);
			return false;
		});

		//购物车减法
		cartWrap.on('tap', '.sub', function(){
			var input = $(this).next();
			var number = parseInt(input.val());
			var min = input.data('min');
			var max = input.data('max');
			var item = $(this).closest('li');
			var listInput = $('#input_' + input.data('id'));
			if(number === 0){
				return;
			} else {
				number = (number - 1) < min ? 0 : (number - 1);
			}
			if(number === 0){
				if(confirm('确认删除购物车中此商品？')){
					number = 0;
					numberChange(number, input);
				} else {
					input.val(min);
				}
			} else {
				input.val(number);
				numberChange(number, input);
			}
			return false;
		});


		//弹出商品信息
		goodsListContent.on('tap', '.b_wp', function(){
			var item = $(this).closest('li');
			var id = item.data('id');
			$.ajaxBind({
				url: '/api/goods/details?goods_id=' + id
			}, {
				onSuccess: function(data){
					showLight(item, data.result.goods);
					console.log(data);
				}
			});
		});

		//结算
		cartWrap.on('tap', '.to_sub_or', function(){
			var idList =  [];
			for(var i = 0; i < cartData.length; i ++){
				idList.push(cartData[i].id);
			}
			console.log(idList);
			submitOrder(idList.join(','));
			return false;
		});

		function showLight(item, jsonData){
			var lightMark = $.lightbox({
				isTitle: false,
				afterShow: function(stage){
					if(jsonData.ifDistrGoods === 1){
						//分销商品
						jsonData.max = jsonData.maxBuyCount;
					} else {
						//非分销商品
						jsonData.max = jsonData.maxBuyCount > jsonData.remain || jsonData.maxBuyCount === 0 ? jsonData.remain : jsonData.maxBuyCount;
					}
					var htmls = template('prdItemDetailTemp', jsonData);
					stage.append(htmls);
					var addToCartBtn = stage.find('.add_to_cart');
					//轮播
					var slider = stage.find('.slider');
					var sliderArr = [];
					slider.height(8 * ROOTFONTSIZE);

					// slider.find('img').each(function(){
					// 	var src = $(this).attr('src');
					// 	sliderArr.push({
					// 		width: 16 * ROOTFONTSIZE,
					// 		height: 8 * ROOTFONTSIZE,
					// 		content: '<img src="'+ src + '" width="'+16 * ROOTFONTSIZE+'" height="'+8 * ROOTFONTSIZE+'">'
					// 	});
					// });
					for(var i = 0; i < jsonData.images.length; i ++){
						sliderArr.push({
							width: 16*ROOTFONTSIZE,
							height: 8 * ROOTFONTSIZE,
							content: '<img src="'+ jsonData.images[i] +'" width="'+16 * ROOTFONTSIZE+'" height="'+8 * ROOTFONTSIZE+'">'
						});
					}
					slider.empty();

					var islider = new iSlider({
						data: sliderArr,
						dom: slider[0],
				        isVertical: false,
				        isLooping: true,
				        type: 'dom'
					});
					islider.addDot();

					//加法
					stage.find('.add').on('tap', function(){
						var input = $(this).prev();
						var number = parseInt(input.val());
						number = number + 1 > input.data('max') ? number : number + 1;
						addToCartBtn.removeClass('disabled').data('number', number);
						input.val(number);
					});

					//减法
					stage.find('.sub').on('tap', function(){
						var input = $(this).next();
						var number = parseInt(input.val());
						number = number - 1 < 0 ? number : number - 1;
						if(number === 0){
							addToCartBtn.addClass('disabled');
						}
						addToCartBtn.data('number', number);
						input.val(number);
					});

					//加入购物车
					addToCartBtn.on('tap', function(){
						if($(this).hasClass('disabled')) return;

						var data = $(this).data();
						var dev = shoppingCart.get(data.id);
						if(dev){
							data.number = data.number + dev.number;
						}
						numberChange(data.number, stage.find('input'));
						lightMark.close();
					});

				}
			});
		}

		//重置数据
		function resetCartData(){
			cartData = shoppingCart.getInMarket(marketId);
		}

		//购物车number变化
		function numberChange(number, input){
			var id = input.data('id');
			var cartItem = $('#inCart_' + id);

			if(number === 0){
				cartItem.addClass('fadeOut');
				setTimeout(function(){
					cartItem.remove();
					shoppingCart.remove(id);
					resetCartData();
					countShoppingCart();
					return;
				}, 400);
			}

			if(!shoppingCart.get(id)){
				cartItem = $(template('shoppingCartItem', {
					goods:[{
						id: id,
						name: input.data('name'),
						price: input.data('price'),
						number: number,
						maxBuyCount: input.data('max'),
						minBuyCount: input.data('min')
					}]
				})).appendTo(cartWrap.find('ul'));
			} else {
				cartItem.find('.num').val(number).data('tprice', number * input.data('price'));
			}
			//设置
			shoppingCart.set({
				number: number,
				id: id,
				marketId: marketId
			});
			//重置
			resetCartData();
			countShoppingCart();
			cogradientNumber();
		}

		//购物车统计
		function countShoppingCart(){
			var totalNumber = 0;
			var totalPrice = 0;
			cartWrap.find('.num').each(function(){
				totalNumber += parseInt($(this).val());
				totalPrice += $(this).data('tprice');
				console.log($(this).data());
			});
			cartWrap.find('.number').text(totalNumber).show();
			cartWrap.find('.t_price').text('共 ￥' + totalPrice);
		}
	})();


	
	//同步购物车-页面视图
	function cogradientNumber(){
		for(var i = 0; i < cartData.length; i++){
			var getInput = $('#input_' + cartData[i].id);
			getInput.val(cartData[i].number);
		}
	}
})(Zepto, $(window), $(document));