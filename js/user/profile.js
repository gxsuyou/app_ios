var id = userInfojson.id || 0;
$(function() {
	var dataURLup;
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
	});
	$.ajax({
		type: "get",
		url: config.data + "users/getUserMsgById",
		async: true,
		data: {
			id: id
		},
		success: function(data) {
			if(data.state) {
				var u = data.user;
				var sex_art;
				if(u.sex == "0") {
					sex_art = "保密"
				} else if(u.sex == "1") {
					sex_art = "男"
				} else {
					sex_art = "女"
				}
				$('.personal_id').val(u.only_id);
				$('.personal_name').val(u.nick_name);
				$('.sexArt').text(sex_art);
				$('.personal_bir').text(u.birthday);

				if(u.portrait != 0) {
					$('.profile_header').css('background-image', 'url(' + u.portrait + ')');
				} else {
					$('.profile_header').css('background-image', 'url(../../Public/image/morentouxiang.png)');
				}
			} else {

			}
		}
	});

	//	头像
	var pc = new PhotoClip('#clipArea', {
		size: 260,
		outputSize: 640,
		//adaptive: ['60%', '80%'],
		file: '#file',
		ok: '#clipBtn',
		//img: 'img/mm.jpg',
		loadStart: function() {
			console.log('开始读取照片');
			$('.head_cuts').removeClass('hidden')
		},
		loadComplete: function() {
			console.log('照片读取完成');

		},
		done: function(dataURL) {
			dataURLup = dataURL
			console.log(dataURL.length);
			$('#profile_header').css('background-image', 'url(' + dataURL + ')')
			$('.head_cuts').addClass('hidden')

		},
		fail: function(msg) {
			alert(msg);
		}
	});

	$("body").on("tap", ".personal_bir", function() {
		var dDate = new Date(); //设置当前日期（不设置默认当前日期）
		var oYear = dDate.getFullYear();
		var oMonth = dDate.getMonth();
		var oDate = dDate.getDate();
		dDate.setFullYear(2018, 7, 16);
		var minDate = new Date(); //最小时间  
		minDate.setFullYear(1970, 0, 1);
		var maxDate = new Date(); //最大时间

		maxDate.setFullYear(oYear, oMonth, oDate);

		plus.nativeUI.pickDate(function(e) {
			var d = e.date;
			var Month = d.getMonth() + 1;

			if(10 > Month) {
				Month = "0" + Month;
			}

			var brith = d.getFullYear() + "/" + Month + "/" + d.getDate();

			$('.personal_bir').text(brith);

		}, function(e) {
			//      mui.toast("您没有选择日期");
		}, {
			title: '请选择日期',
			date: dDate,
			minDate: minDate,
			maxDate: maxDate
		});
	})

	//头像结束
	$('body').on('tap', '.mui-table-view.mui-table-view-radio a', function() {

		var sexnum = $(this).text();
		var sex;
		$('.sexArt').text(sexnum);

		if(sexnum == "保密") {
			sex = "0";
		} else if(sexnum == "男") {
			sex = "1";
		} else if(sexnum == "女") {
			sex = "2";
		}

		$.ajax({
			type: "get",
			url: config.data + "users/updateSex",
			async: true,
			data: {
				"id": id,
				"sex": sex
			},
			success: function(data) {}
		});

		mui('.mui-popover').popover('toggle', document.getElementById("Popover"));
	});

	$('body').on("tap", ".sex", function() {
		mui('.mui-popover').popover('toggle', document.getElementById("Popover"));
		var list = document.querySelector('.mui-table-view.mui-table-view-radio');
		var sexnum;

	})

	//	填写性别结束

	$('body').on("tap", "#profile_header", function() {
		$('#file').click();
	});

	$('body').on("tap", ".cancel_button", function() {
		$('.head_cuts').addClass('hidden')
	});

	$('body').on("tap",".publish", function() {
		
		$(this).addClass("move")
		setTimeout(function() {
			$(".publish").removeClass("move")
		}, 400)
		var name = $('.personal_name').val().trim();
		var bir = $('.personal_bir').text(); /* 先验证昵称 */

		$.ajax({
			type: "get",
			url: config.data + "users/updateNickName",
			async: true,
			data: {
				id:id,
				nickName: name
			},
			success: function(data) {
				if(data.state) {
					/* 修改生日  */
					$.ajax({
						type: "get",
						url: config.data + "users/updateBirthday",
						async: true,
						data: {
							id: id,
							birthday: bir
						},
						success: function(data) {}
					});
					/*上传头图*/
					
					if(dataURLup) {
						uploadHead(id, dataURLup, function() {
							mui.back()
						});
					} else {
						mui.back()
					}

                    var me=plus.webview.getWebviewById("html/user/me.html")
                    mui.fire(me,"reload")
				} else {
					mui.toast('昵称不能重名');
					return false;
				}
			}
		});
	});
});

function uploadHead(id, dataURL, callBack) {
	$.ajax({
		type: "post",
		url: config.data + "users/updateHead",
		async: true,
		data: {
			head: dataURL,
			id: id
		},
		success: function(data) {
			if(data.state) {
				return callBack()
			} else {

			}
		}
	});

}