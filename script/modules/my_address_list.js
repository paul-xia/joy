(function($){
	var myAddressList = $('#myAddressList');
	//设置默认
	myAddressList.on('tap', '.info', function(){
		var me = $(this).closest('li');
		if(!me.hasClass('default_address')){
			
			var id = me.data('id');
			$.confirm('是否设置该收货地址为默认地址？', function(bool){
				if(bool){
					$.ajaxBind({
						url: '/delivery/address/default',
						data:{id: id},
						type:'put'
					},{
						onSuccess: function(data){
							me.insertBefore('.default_address').addClass('default_address').next().removeClass('default_address');
						}
					})
					
				}
			});
		}
	});

	//删除地址
	myAddressList.on('tap', '.btn_delete', function(){
		var me = $(this).closest('li');
		var isDefault = me.hasClass('default_address');
		var id = me.data('id');
		$.confirm('是否删除地址？', function(bool){
			if(bool){
				$.ajaxBind({
					url: '/delivery/address',
					data:{id: id},
					type:'delete'
				},{
					onSuccess: function(data){
						
						if(isDefault){
							var newDefault = myAddressList.find('li:not(.default_address):not(.no_gps_address):not(.address_add)').first();
							newDefault.addClass('default_address').insertBefore(me);
						}

						me.remove();
					}
				})
				
			}
		});
	});
})(Zepto);