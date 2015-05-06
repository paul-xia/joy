(function($){
	var faveListCont = $('#faveListCont');
	var timeFunc;
	faveListCont.on('tap', '.info', function(){
		var me = $(this).closest('.fave_item');
		if(me.hasClass('fave_item_open')){
			me.removeClass('fave_item_open');
			clearTimeout(this.timer);
		} else {
			if(me.siblings('.fave_item_open').length){
				var si = me.siblings('.fave_item_open');
				si.removeClass('fave_item_open');
				clearTimeout(si[0].timer);
				return ;
			}
			me.addClass('fave_item_open');
			this.timer = setTimeout(function(){
				me.removeClass('fave_item_open');
			}, 1500);
		}
	});

	//删除收藏
	faveListCont.on('tap', '.remove', function(){
		var id = $(this).data('id');
		var item = $(this).closest('.fave_item');
		$.ajaxBind({
			type:'delete',
			url: '/api/delete/favourite/market',
			data: {
				market_id: id
			}
		},{
			onSuccess: function(data){
				item.addClass('fadeOut');
				setTimeout(function(){
					item.remove();
				}, 400);
			}
		});
	});

	//获取距离
	faveListCont.find('.lcation').each(function(){
		var lat = $(this).data('lat'),
			lng = $(this).data('lng');
		$(this).text(BASE.getRange(lat, lng));
	});
})(Zepto);