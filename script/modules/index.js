//(function($) {
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	var SiteRoot = 'http://www.joyqz.com/';
	var Root = SiteRoot + 'dev';
	var ApiBox = {
		wxConfigApi: '/wxconfig',
		listApi: '/m/list'
	};

	var ajaxOption = {
		page: 1,
		condition: getUrlData.condition || 'all',
		word: '',
		sortRange: true,
		longitude: 104.072174,
		latitude: 30.558323
	};

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
			ajaxListen(function(data){
				data.root = SiteRoot;
				var temp = template('listItemTemp', data);
				indexContent.find('ul').html(temp);
				loadImgs(data.items, function(){
					window.sliders = creatIscroll();
				});
				
			});
		})();

		mainNavigation.on('tap', 'a', function(){
			location.reload();
		});

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

	function ajaxListen(callback){
		$.ajaxBind({
			url: Root + ApiBox.listApi
			// data: ajaxOption
		},{
			onSuccess: function(data){
				console.log(data);
				callback(data);
			}
		});
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
			}
			if (this.y < this.startY && this.y < 0) {
				mainHeader.hide();
			} else if (this.y > this.startY) {
				mainHeader.show();
			}
		});
		slider.on('scrollEnd', function() {
			
			if (drapDownNote.hasClass('refresh-on')) {
				//location.reload();
			}
		});

		return slider;
	}
//})(Zepto);