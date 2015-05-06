(function($){
	var goodsListWrap = $('#goodsListWrap');
	var prdPopTemp = $('#prdPopTemp').html();
	var body = $('body');
	//显示详情
	goodsListWrap.on('tap', 'img', function(){
		popShow($(this));
	});
	//减少
	goodsListWrap.on('tap', '.sub', function(e){
		e.stopPropagation();
		var numBox = $(this).closest('li').find('.n');
		var num = Number(numBox.text());
		num--;
		num = num < 0 ? 0 : num;
		if(!num){
			numBox.hide();
		}
		numBox.text(num);
		console.log(num);
		return false;
	});
	//添加
	goodsListWrap.on('tap', '.add', function(e){
		e.stopPropagation();
		var numBox = $(this).closest('li').find('.n');
		var num = Number(numBox.text());
		numBox.show();
		num++;
		numBox.text(num);
		return false;
	});


	//显示弹出层
	function popShow(item){
		body.append(prdPopTemp);

		var popBox = body.find('#popPrdBox');
		loadImg('http://192.168.10.151:9529/images/banner01.png', function(img){
	    var slider = popBox.find('.slider');
	    var wWidth = slider.width();
	    var sHeight =  wWidth * img.height / img.width;
	    slider.height(sHeight);
	    var islider = new iSlider({
	        data: [{
	            width: wWidth,
	            height: sHeight,
	            content: '<a href=""><img src="http://192.168.10.151:9529/images/banner01.png"></a>'
	        }, {
	            width: wWidth,
	            height: sHeight,
	            content: '<a href=""><img src="http://192.168.10.151:9529/images/banner01.png"></a>'
	        }, {
	            width: wWidth,
	            height: sHeight,
	            content: '<a href=""><img src="http://192.168.10.151:9529/images/banner01.png"></a>'
	        }],
	        dom: slider[0],
	        type: 'dom',
	        isVertical: false,
	        isLooping: true,
	        //isAutoplay: true
	    });
	    islider.addDot();
	    var close = function(){
	    	BASE.rootMask.addClass('fadeOut').off('tap');
			popBox.addClass('fadeOutBottom');
			setTimeout(function(){
				popBox.remove();
				BASE.rootMask.hide().removeClass('fadeOut');
			}, 200);
	    }
	    BASE.rootMask.show().on('tap', function(){
			close();
		});
		popBox.find('.closeBtn').on('tap', function(){
			close();
			return false;
		});
	});
	}
})(Zepto);