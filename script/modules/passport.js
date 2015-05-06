
//登陆表单提交
$('#loginForm').ajaxBind({
	beforeSend: function(){
		console.log(123);
	}
}, {
    type: 'submit',
    onSuccess: function(data) {
        window.location.href = "/";
        console.log(data);
    }
});

var registForm = $('#registForm');

//注册发送验证码
var sendCodeBtn = $('#sendCodeBtn');
sendCodeBtn.on('tap', function(){
	var reg = /^(1(3|4|5|8)[0-9]{9})$/;
	var phone = $('#account').val();
	if(reg.test($.trim(phone))){
		$.ajaxBind({
			url: '/app_api/register/verification/code?tel=' + phone
		},{
			onSuccess: function(data){
				$('#validationCode').val(data.result.code);
				$('#password, #repassword').val(123456)
			}
		});
	}
});

//注册表单提交
registForm.ajaxBind({}, {
    type: 'submit',
    onSuccess: function(data) {
        window.location.href = "/";
        console.log(data);
    }
});

//密码找回发送验证码
var forgotSendCode = $('#forgotSendCode');
forgotSendCode.on('tap', function(){
	var reg = /^(1(3|4|5|8)[0-9]{9})$/;
	var phone = $('#telNumber').val();
	if(!reg.test($.trim(phone))) return;

	$.ajaxBind({
		url: '/app_api/reset/password/verification/code?tel=' + phone
	},{
		onSuccess: function(data){
			$.alert(data.message);
			$('#valiCode').val(data.result.code);
			$('#password, #rePassword').val(123457)
		}
	});
});

//密码找回表单提交
var forgotForm = $('#forgotForm');
forgotForm.ajaxBind({}, {
    type: 'submit',
    onSuccess: function(data) {
    	$.alert(data.message);
        window.location.href = "/login";
        console.log(data);
    }
});

