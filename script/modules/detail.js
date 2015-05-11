wxConfigLoad(function() {
	var urlData = getUrlData();
	var mainContent = $('#mainContent');
	wx.checkJsApi({
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo'
      ],
      success: function (res) {
        alert(JSON.stringify(res));
      }
    });

	$.ajaxBind({
		url: Root + ApiBox.detailApi,
		data: urlData
	}, {
		onSuccess: function(data) {
			console.log(data);
			data.img_root = img_root;
			var htmls = template('contentTemp', data);
			mainContent.html(htmls);
			var img = mainContent.find('img');
			var loadImgNumber = 0;
			mainContent.find('img').each(function() {
				$(this).on('load', function() {
					loadImgNumber++;
					if (loadImgNumber === img.length) {
						new IScroll('#mainContent', {
							preventDefault: false,
							scrollbars: true,
							fadeScrollbars: true
						});
						loadImgNumber = null;
						MainLoadingBox.close();
					}
				}).on('error', function(){
					loadImgNumber++;
					if (loadImgNumber === img.length) {
						new IScroll('#mainContent', {
							preventDefault: false
						});
						loadImgNumber = null;
						MainLoadingBox.close();
					}
				});
			});

			$('#addressJumpBtn').on('tap', function() {
				wx.openLocation({
					latitude: data.placeLatitude,
					longitude: data.placeLongitude,
					name: data.title,
					address: data.placeAddres,
					scale: 14,
					infoUrl: Root
				});
				bindShareFunction({});
			});

			$('#shareBtnsBox').on('tap', 'a', function() {
				bindShareFunction($(this).data('tag'));
				return false;
			});

			$('#shareNoteMask').on('tap', function(){
				$(this).hide();
			});

			$('#showFav').on('tap', function(){
				$('#shareNoteMask').show();
			});

			function bindShareFunction(tag) {
				var shareObject = {
					title: data.title,
					link: location.href,
					imgUrl: img_root + data.image,
					trigger: function(res) {
						alert('开始分享');
					},
					success: function(res) {
						alert('已分享');
					},
					cancel: function(res) {
						alert('已取消');
					},
					fail: function(res) {
						alert('分享失败');
					}
				};
				switch (tag) {
					case 'pyq':
						wx.onMenuShareTimeline(shareObject);
						refreshReadTime({
							type: 'share'
						});
						break;
					case 'wx':
						wx.onMenuShareTimeline(shareObject);
						refreshReadTime({
							type: 'share'
						});
						break;
					case 'qq':
						wx.onMenuShareQQ(shareObject);
						refreshReadTime({
							type: 'share'
						});
						break;
					case 'wb':
						wx.onMenuShareWeibo(shareObject);
						refreshReadTime({
							type: 'share'
						});
						break;
				}
			}

		}
	});
	
	refreshReadTime({});
	function refreshReadTime(data){
        data = $.extend({
            id: urlData.id,
            type: 'read'
        }, data);
        $.ajaxBind({
            type:'post',
            data: data,
            url: Root + ApiBox.refreshReadTimeApi
        },{
            onSuccess: function(data){

            }
        });
    }
});