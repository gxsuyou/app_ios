$(function() {
	var h = $(window).height()
	$(window).resize(function() {
		var changeHeight = $(window).height()
		if(changeHeight < h) {
			$('.show_imgs,.img_num').addClass('hidden')
			$('.choose_img').css('bottom', '0')
			$('.choose_game').css('bottom', '2.625rem')
		} else {
			$('.show_imgs,.img_num').removeClass('hidden')
			$('.choose_img').css('bottom', '10.625rem')
			$('.choose_game').css('bottom', '13.25rem')
		}
	});

	toface()

	function toface() {
		var face = [{
				src: "a_what.png",
				id: "<好奇怪>"
			}, {
				src: "alas.png",
				id: "<哎呀>"
			}, {
				src: "angry.png",
				id: "<怒>"
			},
			{
				src: "ass.png",
				id: "<屎>"
			}, {
				src: "bad_smile.png",
				id: "<坏笑>"
			}, {
				src: "beer_brown.png",
				id: "<棕啤>"
			}, {
				src: "beer_yellow.png",
				id: "<黄啤>"
			},
			{
				src: "black.png",
				id: "<黑头>"
			}, {
				src: "but.png",
				id: "<无奈>"
			}, {
				src: "butcry.png",
				id: "<无奈哭>"
			}, {
				src: "bye.png",
				id: "<再见>"
			}, {
				src: "cool.png",
				id: "<酷>"
			}, {
				src: "cry.png",
				id: "<哭>"
			}, {
				src: "cry_hand.png",
				id: "<手扶脸>"
			}, {
				src: "cry_smile.png",
				id: "<哭笑>"
			}, {
				src: "cut.png",
				id: "<可爱>"
			},
			{
				src: "dog.png",
				id: "<狗>"
			}, {
				src: "doughnut.png",
				id: "<甜甜圈>"
			}, {
				src: "duck.png",
				id: "<鸭子>"
			}, {
				src: "eat_wat.png",
				id: "<吃西瓜>"
			}, {
				src: "eee.png",
				id: "<额>"
			}, {
				src: "halo.png",
				id: "<晕>"
			}, {
				src: "heart.png",
				id: "<心>"
			}, {
				src: "heart_break.png",
				id: "<心碎>"
			}, {
				src: "impatine.png",
				id: "<不耐烦>"
			}, {
				src: "kiss.png",
				id: "<亲亲>"
			}, {
				src: "laugl.png",
				id: "<偷笑>"
			}, {
				src: "leaf.png",
				id: "<树叶>"
			}, {
				src: "lemon.png",
				id: "<柠檬>"
			}, {
				src: "notsobad.png",
				id: "<好无奈>"
			}, {
				src: "ooo.png",
				id: "<噢噢>"
			}, {
				src: "pig.png",
				id: "<猪>"
			}, {
				src: "punch_face.png",
				id: "<打脸>"
			}, {
				src: "rigid.png",
				id: "<僵硬>"
			}, {
				src: "see_smile.png",
				id: "<看坏笑>"
			}, {
				src: "she.png",
				id: "<喜欢>"
			},
			{
				src: "shine.png",
				id: "<闪耀>"
			}, {
				src: "shock.png",
				id: "<惊呆>"
			}, {
				src: "shutup.png",
				id: "<闭嘴>"
			}, {
				src: "shy.png",
				id: "<害羞>"
			}, {
				src: "sleep.png",
				id: "<睡觉>"
			}, {
				src: "slience.png",
				id: "<沉默>"
			}, {
				src: "split.png",
				id: "<吐>"
			}, {
				src: "strange.png",
				id: "<奇怪>"
			}, {
				src: "smile_big.png",
				id: "<大笑>"
			}, {
				src: "smile_little.png",
				id: "<害羞无奈>"
			}, {
				src: "soangry.png",
				id: "<超生气>"
			}, {
				src: "surprised.png",
				id: "<惊讶>"
			}, {
				src: "unhappy.png",
				id: "<不高兴>"
			}, {
				src: "wa.png",
				id: "<青蛙>"
			}, {
				src: "watermelon.png",
				id: "<西瓜>"
			}, {
				src: "what.png",
				id: "<啥>"
			}, {
				src: "wired.png",
				id: "<奇怪咯>"
			}, {
				src: "yes.png",
				id: "<好的>"
			}
		]
		var faceContent = ""
		face.forEach(function(item) {
			faceContent += "<img src='" + "../../Public/image/face/" + item.src + "' data-id='" + item.id + "' />"
		})
		$(".faceContent").append(faceContent)
	}

	$("body").on("tap", ".face", function() {
		$(".faceContent").css("display", "block")
		$(".show_imgs").css("display", "none")
		$(".choose_img").css("bottom", "2.425rem")

	})

	$("body").on("blur", "textarea", function() {
		if($('.faceContent').css('display') == "block") {
			$(".choose_img").css("bottom", "2.425rem")
		}
	})

	$('body').on('tap', '.delete_img', function() {
		$(this).parent().parent('.show_imgcontent').remove();
	});

	$("body").on("tap", ".faceContent>img", function() {
		var str = $(this).attr("data-id")
		var tc = document.querySelector("#strategy_textarea")
		var tclen = tc.value.length;
		tc.focus();
		if(typeof document.selection != "undefined") {
			document.selection.createRange().text = str;
		} else {
			tc.value = tc.value.substr(0, tc.selectionStart) + str + tc.value.substring(tc.selectionStart, tclen);
		}
	})

	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
		var self = plus.webview.currentWebview();
		var strategyId = self.strategyId;
		var proId = self.proId;
		var old_back = mui.back;
		var target_img = self.target_img;
		var target_title = self.target_title;

		$('body').on('tap', '.choose', function() {
			$(".faceContent").css("display", "none")
			$(".show_imgs").css("display", "block")
			$(".choose_img").css("bottom", "10.625rem")
			setTimeout(function() {
				if(mui.os.plus) {
					var buttonTit = [{
						title: "从手机相册选择"
					}];

					plus.nativeUI.actionSheet({
						title: "上传图片",
						cancel: "取消",
						buttons: buttonTit
					}, function(b) { /*actionSheet 按钮点击事件*/
						switch(b.index) {
							case 0:
								break;
							case 1:
								galleryImgs(); /*打开相册*/
								break;
							default:
								break;
						}
					})
				}
			}, 500);
		});

		$('body').on("tap", ".publish", function() {
			var content = $('#strategy_textarea').val()
			if(content) {
				mui.toast("正在发送，请稍候")
				$.ajax({
					type: "get",
					url: config.data + "strategy/strategyComment",
					async: true,
					data: {
						userId: userId,
						content: content,
						targetCommentId: strategyId,
						targetUserId: proId,
						series: 1,
						target_img: target_img,
						targetid: strategyId,
						target_title: target_title
					},
					success: function(data) {
						if(data.state) {
							var commentId = data.commentId;
							if($('.show_imgs').find('.show_imgcontent').length >= 1) {

								$('.show_imgcontent').each(function(index) {

									var imgPath = $(this).attr('data-src');

									// 上传图片
									upLoad(commentId, 'startegyComment/commentId' + commentId + '/img' + index, imgPath)

								});
							} else {

								mui.back()
							}

						} else {

						}
					}
				});
			} else {
				mui.toast("内容不能为空")
			}
		})

	})

})
// 从相册中选择图片   
function galleryImgs() {
	// 从相册中选择图片  
	plus.gallery.pick(function(path) {
		var token;
		if($('.show_imgs > .show_imgcontent').length < 1) {
			var div =
				"<div class='show_imgcontent' data-src = '" + path + "'>" +
				"<div class='img_box'>" +
				"<img class='show_img'  data-preview-group='2' data-preview-src='' src='" + path + "'>" +
				"</img>" +
				"<div class='delete_img'></div>" +
				"</div>" +
				"</div>";
			$('.show_imgs').append(div)

		} else {
			mui.toast("只能发送一张图片，请确认您要发的图片")
		}

	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		system: false,

	});
}

//	选择图片结束

//上传图片
function upLoad(commentId, key, path) {
	getUpToken('img', key, function(token) {
		var url = "http://upload-z2.qiniup.com/";
		var uploader = plus.uploader.createUpload(url, {
			method: "post"
		}, function(t, status) {
			if(status == 200) {
				console.log(JSON.parse(t.responseText).key)
				$.ajax({
					type: "get",
					url: config.data + "strategy/updateCommentImg",
					async: true,
					data: {
						commentId: commentId,
						img: JSON.parse(t.responseText).key
					},
					success: function(data) {
						$('.show_imgs').children().remove();
						$('textarea').val("");
						mui.back();
					}
				});
			} else {
				console.log("上传失败 - ", status);
				mui.toast("上传图片失败")
			}

		});

		uploader.addData("key", key);
		uploader.addData("token", token);
		uploader.addFile(path, {
			"key": "file"
		}); // 固定值，千万不要改！！！！！！
		uploader.start();
	})
}

function getUpToken(scope, key, callback) {
	$.ajax({
		type: "get",
		url: config.data + "users/getUptokenByMsg",
		async: true,
		data: {
			scope: scope,
			key: key
		},
		success: function(data) {
			token = data.upToken;
			return callback(token)
		}
	});
}
//上传到七牛的function结束