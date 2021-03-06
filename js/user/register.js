$(function() {
	var checked;	
	mui.plusReady(function(){
		plus.webview.currentWebview().setStyle({
            softinputMode: "adjustResize"  // 弹出软键盘时自动改变webview的高度
        });
	});
	$('#agree').change(function(){	
		checked = this.checked
	})

	$('body').on("tap","#register-get",function () {
		var username = $.trim($('#register-phone').val());
		var code = $('#register-code').val();
		var password = $('#register-password').val();

		var InterValObj; //timer变量，控制时间
		var count = 60; //间隔函数，1秒执行
		var curCount; //当前剩余秒数
		if(/^1[34578]\d{9}$/.test(username)) {
			(function sendMessage() {
				curCount = count;
				// 设置button效果，开始计时
				document.getElementById("register-get").classList.add("disabled");
//				document.getElementById("register-get").setAttribute("disabled", "true"); //设置按钮为禁用状态
				document.getElementById("register-get").innerHTML = curCount + "s后获取"; //更改按钮文字
				InterValObj = window.setInterval(SetRemainTime, 1000);
				//			 启动计时器timer处理函数，1秒执行一次
				// 向后台发送处理数据
				$.ajax({
					type: "get", // 用get方式传输
					url: config.data + "users/verify", // 目标地址
					data: {
						"tel": username
					},
					success: function(data) {
						if(data.state == "1") {
							mui.toast("短信验证码已发到您的手机,请查收");

						} else if(data.state == "0") {
							mui.toast("短信验证码发送失败，请重新发送");

							return false
						}
					}
				});

				function SetRemainTime() {
					if(curCount == 0) {
						window.clearInterval(InterValObj); // 停止计时器
//						document.getElementById("register-get").removeAttribute("disabled"); //移除禁用状态改为可用
						document.getElementById("register-get").classList.remove("disabled");
						document.getElementById("register-get").innerHTML = "重发验证码";
					} else {
						curCount--;
						document.getElementById("register-get").innerHTML = curCount + "s后获取";

					}
				}
			}());
			//timer处理函数
		} else {
			mui.toast("请输入正确的手机号");
			return false
		}
	})
	$('body').on("tap","#register-button",function() {
		var username = $.trim($('#register-phone').val());
		var code = $('#register-code').val();
		var password = $('#register-password').val();
        var recommend=$.trim($("#recommend-user").val())
		if(/^1[34578]\d{9}$/.test(username) && password.length >= 6 && code.length == 6  && /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/.test(password) && checked) {			
				$.ajax({
					type: "post",
					url: config.data + "users/reg", // 目标地址
					data: {
						"tel": username,
						"verify": code,
						"password": password,
						 only_id:recommend
					},
					success: function(data) {

						switch(data.state) {
							case 0:
								mui.toast(data.info);			
								break;
							case 1:
								mui.toast("注册成功");
								//$('.register').addClass("hidden").siblings().removeClass("hidden");
								mui.openWindow({
									url: "personal_data.html",
									id:"personal_data.html",
									extras:{
										userId: data.id
									}
									
								})
								break;

						}
					}

				})
			
		} else {
			mui.toast("请检查您的输入");
			return false
		}
	})

	$('body').on("tap",".protocol",function(){
		mui.openWindow({
			url:'agreement.html',
			id:'agreement.html'
		})
	})
})
