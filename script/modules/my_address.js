(function($){
	var reciveForm = $('#reciveForm');
	var reciveArea = $('#reciveArea');
	var reciveGps = $('#reciveGps');
	var reciveAddress = $('#reciveAddress');
	var latitude = $('#latitude');
	var longitude = $('#longitude');
	var addObject;
	var mapInit = false;
	var myGeo;
	var map;
	var addressData;
	reciveArea.select().on('tap', function(){
		BASE.rootMask.show();
		addObject = $.addressExtend({
			onFinish: function(data){
				addressData = data;
				console.log(data);
				reciveArea.find('.text').val(data.province.name + data.city.name + data.county.name);
				BASE.rootMask.hide();
				$('#hideProvince').val(data.province.code);
				$('#hideCity').val(data.city.code);
				$('#hideCounty').val(data.county.code);
				reciveAddress.val('');
			}
		});
		BASE.rootMask.on('tap.address', function(){
			addObject.cancel();
			BASE.rootMask.hide();
		});
	});

	reciveGps.on('tap', function(){
		// 百度地图API功能
		if(!mapInit){
			map = new BMap.Map('mapBox');
			map.addControl(new BMap.ScaleControl());
			myGeo = new BMap.Geocoder();



			map.addEventListener('dragend', function showInfo(){
				var cp = map.getCenter();
				latitude.val(cp.lat);
				longitude.val(cp.lng);
			});

			myGeo.getPoint(reciveArea.find('.text').val() + reciveAddress.val(), function(point){
				if (point) {
					map.centerAndZoom(point, 16);
					map.addOverlay(new BMap.Marker(point));
				}

				if(latitude.val() != 0) {
					map.centerAndZoom(new BMap.Point(longitude.val(), latitude.val()), 11);
				} else {
					var cp = map.getCenter();
					latitude.val(cp.lat);
					longitude.val(cp.lng);
				}
			}, addressData ? addressData.city.name : reciveArea.data('city'));



			mapInit = true;

			reciveGps.val('重新定位');
			$('#mapBox').show();
		} else {
			myGeo.getPoint(reciveArea.find('.text').val() + reciveAddress.val(), function(point){
				if (point) {
					map.centerAndZoom(point, 16);
					map.addOverlay(new BMap.Marker(point));
				}
			}, addressData ? addressData.city.name : reciveArea.data('city'));
			$('#mapBox').show();
		}
	});

	reciveForm.ajaxBind({},{
		type:'submit',
		onSuccess: function(data){
			// if($('#setDefaule').is(':checked')){
			// 	setIsDefaultAddress(data);
			// } else {
				$.alert(data.message);
				window.location.href = '/my/address';
			//}
		}
	});

	// function setIsDefaultAddress(odata){
	// 	$.ajaxBind({
	// 		url: '/delivery/address/default',
	// 		data:{
	// 			id: odata.result.addressId
	// 		},
	// 		type:'put'
	// 	},{
	// 		onSuccess: function(data){
	// 			$.alert('修改收货地址信息成功！');
	// 			window.location.href = '/my/address';
	// 			console.log(data)
	// 		}
	// 	})
		
	// }

})(Zepto);
