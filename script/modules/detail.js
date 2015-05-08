
var urlData = getUrlData();
var mainContent = $('#mainContent').css('visibility', 'hidden');

$.ajaxBind({
	url: Root + ApiBox.detailApi,
	data: urlData
},{
	onSuccess: function(data){
		console.log(data);
		data.img_root = Root;
		var htmls = template('contentTemp', data);
		mainContent.html(htmls);
		var img = mainContent.find('img');
		var loadImgNumber = 0;
		var loading = loadingBox();
		mainContent.find('img').each(function(){
			$(this).on('load', function(){
				loadImgNumber ++ ;
				if(loadImgNumber === img.length){
					new IScroll('#mainContent', {
						preventDefault: false
					});
					loadImgNumber = null;
					mainContent.css('visibility','visible');
					loading.close();
				}
			});
		});
		
	}
})
