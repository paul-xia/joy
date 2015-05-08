//(function($) {
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	
	

	var ajaxOption = $.extend({
		page: 1,
		condition: 'all',
		word: '',
		sort: 'read',
		sortExt: 'time',
		sortRange: true,
		longitude: 104.072174,
		latitude: 30.558323
	}, getUrlData());

	var isLoadMark = false;
	var isOver = false;
	var sliders;



	var indexContent = $('#indexContent');
	var drapDownNote = $('#drapDownNote');
	var showMenuBtn = $('#showMenuBtn');
	var mainContent = $('#mainContent');
	var mainMask = $('#mainMask');
	var mainHeader = $('#mainHeader');
	var mainNavigation = $('#mainNavigation');
	

	//页面方法
	(function(){
		(function(){
			ajaxListen();
		})();

		mainNavigation.find('li').eq(ajaxOption.curtag).addClass('current').siblings().removeClass('current');

		// mainNavigation.on('tap', 'a', function(){
		// 	location.reload();
		// });

		
	})();

	//菜单点击
	showMenuBtn.on('tap', function() {
		mainContent.addClass('navigation-show');
		mainMask.show();
		mainMask.one('tap', function() {
			mainContent.removeClass('navigation-show');
			setTimeout(function() {
				mainMask.hide();
			}, 300);
			return false;
		});
	});	

	function ajaxListen(){
		if(isLoadMark || isOver) return;
		isLoadMark = true;
		$.ajaxBind({
			url: Root + ApiBox.listApi,
			data: ajaxOption
		},{
			onSuccess: function(data){
				console.log(data);
				if(!data.items.length){
					isOver = true;
					if(!indexContent.find('li.noMoreNote').length) {
						indexContent.find('ul').append('<li class="noMoreNote">没有更多了...</li>');
						sliders.refresh();
					}
					return;
				}
				data.root = SiteRoot;
				var temp = template('listItemTemp', data);
				indexContent.find('ul').append(temp);
				
				loadImgs(data.items, function(){
					if(sliders){
						sliders.refresh();
					} else {
						sliders = creatIscroll();
					}
					
				});
				ajaxOption.page ++ ;
				setTimeout(function(){
					isLoadMark = false;
				}, 1000);
				
			}
		});
	}

	//加载图片组
	function loadImgs(list, callback){
		var success = 0;
		for(var i = 0; i < list.length; i ++){
			loadImg(Root + list[i].image, function(){
				success ++ ;
				if(success === list.length){
					callback();
				}
			});
		}
		
	}
	//创建iscroll
	function creatIscroll() {
		var slider = new IScroll('#indexContent', {
			scrollbars:false,
	        fadeScrollbars:true,
	        bounceLock:false,
	        momentum:false,
			mouseWheel: true,
			preventDefault: false
		});
		var refreshSize = 3 * FontSize;
		var freshObject = {};
		slider.on('scrollMove', function() {
			if (drapDownNote.data('nofresh')) return;
			if (this.y > refreshSize && !freshObject.refresh) {
				freshObject = {
					refresh: true
				};
				drapDownNote.text('释放后刷新').addClass('refresh-on');
				loadingBox()
			}
			if (this.y < this.startY && this.y < 0) {
				mainHeader.css('transform', 'translate3d(0,-2rem,0)');
			} else if (this.y > this.startY) {
				mainHeader.css('transform', 'translate3d(0,0,0)');
			}

			if(this.wrapperHeight - this.y + 4 * FontSize > this.scrollerHeight){
				ajaxListen();
			}
		});
		slider.on('scrollEnd', function() {
			
			if (drapDownNote.hasClass('refresh-on')) {
				ajaxOption.page = 1;
				isLoadMark = false;
				isOver = false;
				sliders.destroy();
				sliders = null;
				drapDownNote.text('下拉刷新').removeClass('refresh-on');
				ajaxListen();
			}
		});

		return slider;
	}
//})(Zepto);