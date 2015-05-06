(function($) {
    $.addressExtend = function(opts) {
    	opts = $.extend({
    		provinceUrl:'/address/data/province/list',
    		cityUrl: '/address/data/city/list?province_code={:code}',
    		areaUrl: '/address/data/county/list?city_code={:code}',
    		onFinish: null
    	}, opts);

    	

        var AddressBox = function() {
        	var box = this;

        	//初始化
            function getStart(data){
            	if($('#addressPlug').length){
            		box.addressPlug = $('#addressPlug').show();

            		return;
            	}
            	var htmls = template('addressBoxTemp', data.result);
            	box.addressPlug = $(htmls).appendTo('body');
            	box.addressPlug.show();
                box.addressPlug.find('.address-tab').hide().eq(0).show();

		        box.addressToolbarTag = box.addressPlug.find('.address-toolbar').find('a');
		        box.forProvence = $('#forProvence');
		        box.forCity = $('#forCity');
		        box.forArea = $('#forArea');

		        box.forProvence.find('.d-currend').removeClass('d-currend');
            	box.addressToolbarTag.eq(0).text('选择省').data('id', null);
		        bindEvent();
            }

            //绑定事件
        	function bindEvent(){
        		box.forProvence.on('tap', 'li', function() {
	            	var provenceId = $(this).data('id');
	            	$(this).addClass('d-current').siblings().removeClass('d-current');
	            	box.addressToolbarTag.eq(0).text($(this).text()).data('id', $(this).data('id'));
	                cityCheck(provenceId);
	            });

	            box.forCity.on('tap', 'li', function() {
	            	var cityId = $(this).data('id');
	            	box.addressToolbarTag.eq(1).text($(this).text()).data('id', $(this).data('id'));
	            	$(this).addClass('d-current').siblings().removeClass('d-current');
	                areaCheck(cityId);
	            });

	            box.forArea.on('tap', 'li', function() {
	            	var areaId = $(this).data('id');
	            	box.addressToolbarTag.eq(2).text($(this).text()).data('id', $(this).data('id'));
	            	$(this).addClass('d-current').siblings().removeClass('d-current');
	            	finish();
	            });

	            box.addressToolbarTag.on('tap', function(){
	            	if($(this).hasClass('t-current')) return false;
	            	var id = $(this).attr('href');
	            	$(id).show().siblings('.address-tab').hide();
	            	$(this).addClass('t-current').siblings().removeClass('t-current');
	            	return false;
	            });
        	}
            

        	//绑定城市check
            function cityCheck(provenceId) {
            	$.ajaxBind({
            		url: opts.cityUrl.replace('{:code}', provenceId)
            	}, {
            		onSuccess: function(data){
            			console.log(data);
            			var html = '';
            			for(var i = 0; i < data.result.cities.length; i ++){
            				html += '<li data-id="'+data.result.cities[i].code+'">'+data.result.cities[i].name+'</li>'
            			}

            			box.addressToolbarTag.removeClass('t-current').eq(1).addClass('t-current');
		            	box.forProvence.hide();
		                box.forCity.html(html).show();
            		}
            	});
            	
            }

            //绑定地区check
            function areaCheck(cityId) {
            	$.ajaxBind({
            		url: opts.areaUrl.replace('{:code}', cityId)
            	}, {
            		onSuccess: function(data){
            			console.log(data);
            			var html = '';
            			for(var i = 0; i < data.result.counties.length; i ++){
            				html += '<li data-id="'+data.result.counties[i].code+'">'+data.result.counties[i].name+'</li>'
            			}
		            	box.addressToolbarTag.removeClass('t-current').eq(2).addClass('t-current');
		            	box.forCity.hide();
		            	box.forArea.html(html).show();
		            }
            	});
            }

            function finish() {
            	box.addressPlug.hide();
            	if(opts.onFinish){
            		opts.onFinish({
            			province:{
            				code: box.addressToolbarTag.eq(0).data('id'),
            				name: box.addressToolbarTag.eq(0).text()
            			},
            			city:{
            				code: box.addressToolbarTag.eq(1).data('id'),
            				name: box.addressToolbarTag.eq(1).text()
            			},
            			county:{
            				code: box.addressToolbarTag.eq(2).data('id'),
            				name: box.addressToolbarTag.eq(2).text()
            			}
            		});
            	}
            }

            return {
            	Init: function(){
            		$.ajaxBind({
            			url: opts.provinceUrl
            		},{
            			onSuccess: function(data){
            				getStart(data);
            			}
            		});
            	},
            	box: box
            }
        };

        var Box = new AddressBox();
        Box.Init();

        return {
            cancel: function() {
            	Box.box.addressPlug.hide();
            }
        };
    };



})(Zepto);