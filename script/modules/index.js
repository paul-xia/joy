(function($) {
	var drapDownNote = $('#drapDownNote');
	var showMenuBtn = $('#showMenuBtn');
	var mainContent = $('#mainContent');
	var mainMask = $('#mainMask');
	var slider = new IScroll('#indexContent', {
		scrollbars: true,
		fadeScrollbars: true,
		bounceLock: false,
		probeType: 3
	});
	var refreshSize = 3 * FontSize;
	var freshObject = {};
	var time = 0;
	slider.on('scrollMove', function() {
		if(drapDownNote.data('nofresh')) return;
		if (this.y > refreshSize && !freshObject.refresh) {
			freshObject = {
				refresh: true,
				enfresh: false
			};
			drapDownNote.text('释放后刷新').addClass('refresh-on');
			time ++ ;

			console.log(time);
		} else if(this.y > 0 && this.y <= refreshSize && !freshObject.enfresh){
			drapDownNote.text('下拉刷新').removeClass('refresh-on'); 
			freshObject = {
				refresh: false,
				enfresh: true
			};
			time ++ ;

			console.log(time);
		}
	});
	slider.on('scrollEnd', function(){
		if(drapDownNote.hasClass('refresh-on')){
			slider.refresh();
		}
		time = 0;
	});

	showMenuBtn.on('tap', function(){
		mainContent.addClass('navigation-show');
		mainMask.one('tap.menuShow', function(){
			mainContent.removeClass('navigation-show')
		});
	});
})(Zepto);