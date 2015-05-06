(function($, win, doc){
	var seachForm = $('#seachForm');
	var searchEndWrap = $('#searchEndWrap');
	var nowPage = 1;
	var pageSize = 10;
	var type = true;
	var location = BASE.getLocation.location;
	var scrollHeight;
	var winHeight = win.height();
	var appending = false;
	var isEnd = false;
	//搜索处理
	seachForm.find('[type="button"]').on('tap', function(){
		type = $(this).hasClass('shop');
		nowPage = 1;
		isEnd = false;
		if(type){
			//搜商店
			getData('/api/market/near');
		} else {
			//搜商品
			getData('/api/goods/search');
		}

		
	});
	getData('/api/market/near');

	//获取数据
	function getData(action){
		appending = true;
		if(isEnd) return;
		seachForm.ajaxBind({
			type:'get',
			url: action,
			data: function(){
				var data = seachForm.formParams();
				data.page_size = pageSize;
				data.page = nowPage;
				data.lat = location.lat;
				data.lng = location.lng;
				return data;
			}
		},{
			type:'auto',
			onSuccess: function(data){
				
				var mkt;
				var tempId = '';
				if(type){
					mkt = data.result.markets;
					tempId = 'searchMkTemp';
				} else {
					mkt = data.result.goodsList;
					tempId = 'searchPrdTemp';
				}

				if(!mkt.length){
					isEnd = true;
					return;
				}	
				for(var i = 0; i < mkt.length; i++){
					mkt[i].range = BASE.getRange(mkt[i].lat, mkt[i].lng);
				}

				var html = template(tempId, mkt);
				if(nowPage === 1){
					searchEndWrap.html(html);
				} else {
					searchEndWrap.find('ul').append($(html).find('li'));
				}
				
				nowPage ++ ;
				scrollHeight = doc.height() - 3 * ROOTFONTSIZE;

				appending = false;
			}
		});
	}

	//绑定展开列表
	searchEndWrap.on('tap','.info', function(){
		var item = $(this).closest('li');
		if(item.hasClass('item_open')){
			item.removeClass('item_open');
		} else {
			if(item.siblings('.item_open').length){
				item.siblings('.item_open').removeClass('item_open');
				item.addClass('item_open');
				return false;
			}

			item.addClass('item_open');
		}
	});

	//绑定滚动底部事件
	win.on('scroll', function(){
		if(appending) return false;
		var top = win.scrollTop() + winHeight;
		//console.log(top);
		if(top > scrollHeight){
			if(type){
				//搜商店
				getData('/api/market/near');
			} else {
				//搜商品
				getData('/api/goods/search');
			}
		}
	});

	//收藏
	searchEndWrap.on('tap', '.faveContr', function(){
		var me = $(this);
		var id = me.data('id');
		var isAdd = !me.hasClass('icon-star');
		$.ajaxBind({
			url: isAdd ? '/api/delete/favourite/market' :'/api/new/favourite/market',
			type: isAdd? 'delete':'post',
			data: {
				market_id: id
			}
		}, {
			onSuccess: function(data){
				isAdd ? me.attr('class', 'faveContr iconfont icon-star') : me.attr('class', 'faveContr iconfont icon-ue62ddel');
				$.alert(data.message);
			}
		});
		return false;
	});

	//加入购物车
	(function(){
		var shoppingCart = BASE.shoppingCart;
		searchEndWrap.on('tap', '.icon-shopping', function(){
			var me = $(this);
			var marketId = me.data('mktid');
			var prdId = me.data('id');
			var thisObject = shoppingCart.get(prdId);
			if(thisObject){
				thisObject.number++;
			} else {
				thisObject = {
					id: prdId,
					marketId: marketId,
					number: 1
				};
			}
			
			shoppingCart.set(thisObject);
			$.alert('加入购物车成功！');
		});
	})();

})(Zepto, $(window), $(document));