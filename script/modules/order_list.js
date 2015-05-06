(function($, win) {
	var sliderNav = $('#sliderNav');
	var slideContent = $('#slideContent');
	var navCur = $('#navCur');
	var slideBody = $('#slideBody');
   	var pageTag = 'all';
   	var slideToMark;
   	var loadMark = false;
   	var pageSize = 8;
	var load = function(tag){
		var box = $('#tagId_' + tag).show();
		if(box.data('isEnd')){
			return;
		}
		loadMark = true;
		var page = box.data('page') || 0;
		page++;
		$.ajaxBind({
			url: '/api/order/list',
			data: {
				page: page,
				page_size: pageSize,
				str_order_state: tag
			}
		},{
			loading: false,
			onSuccess: function(data){
				var htmls = template('orderItemTemp', data.result);
				var isEnd = data.result.orders.length !== pageSize ;
				//判断是否是初始化
				if(page === 1){
					box.html(htmls);
					slideToMark = $('<div class="loadNote">加载中...</div>').appendTo(box);
					win.scrollTop(0);
				} else {
					slideToMark = box.find('.loadNote').before(htmls);
				}
				//显示没有更多
				if(isEnd){
					box.find('.loadNote').text('没有更多了....');
				}
				//存储数据进
				box.data({
					load: true,
					page: page,
					isEnd: isEnd
				});
				loadMark = false;
			}
		});
	};

   	load(pageTag);

   	//菜单导航
   	sliderNav.on('tap', 'a', function(e) {
        var tag = $(this).data('state');
        $('#tagId_' + tag).show().siblings().hide().data({
        	page: 0
        });
        var index = $(this).index();
        pageTag = tag;
        win.scrollTop(0);
        
        load(tag);
        navCur.css({
        	'left': index * 4 * ROOTFONTSIZE,
        	'transition': 'all .2s ease-in-out'
        });

    });

   	//滚动加载
    win.on('scroll', function(){
    	if(loadMark) return;
    	var top = win.scrollTop();
    	if(top + win.height() + 4 * ROOTFONTSIZE > slideToMark.offset().top){
    		load(pageTag);
    	}
    	console.log(top);
    	if(top > 2 * ROOTFONTSIZE){
    		slideContent.addClass('orderFixedHead');
    	} else {
    		slideContent.removeClass('orderFixedHead');
    	}
    });

    //删除订单
    slideBody.on('tap', '.delete', function(){
    	var orderNo = $(this).data('orderno');
    	var item = $(this).closest('.order_item');
    	$.confirm('确认删除订单？（删除后，订单不可恢复！）', function(boolen){
    		if(boolen){
    			$.ajaxBind({
		    		url: '/api/order',
		    		type: 'delete',
		    		data:{
		    			orderNo: orderNo
		    		}
		    	},{
		    		onSuccess: function(data){
		    			item.addClass('fadeOut');
		    			setTimeout(function(){
		    				item.remove();
		    			}, 400);
		    		}
		    	});
    		}
    	});
    	
    });

})(Zepto, $(window));