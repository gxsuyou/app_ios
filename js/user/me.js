$(function() {
	if(!window.localStorage.getItem("rememberUser")) {
		var img = "../../Public/image/morentouxiang.png";
		$(".me_img").css("background-image", "url(" + img + ")");
		$('.me_username').text("未登录");

		$(document.body).on('tap', function() {
			mui.openWindow({
				url: 'login.html',
				id: 'login.html'
			})
		})
	} else {
		$('.me_share').click(function() {
			openShare()
		})

		var userInfostr = window.localStorage.getItem("userInfo");
		var userInfojson = eval('(' + userInfostr + ')');
		var id = userInfojson.id;
		$.ajax({
			type: "get",
			url: config.data + "users/getUserMsgById",
			async: true,
			data: {
				"id": id
			},
			success: function(data) {

				if(data.state) {
                    
					$(".me_getgold").text(data.user.coin)
					only_id = data.user.only_id;
					$('.onlyId').text("ID:" + only_id);
					if(data.user.portrait != 0) {
						img = data.user.portrait;
					} else {
						img = "../../Public/image/morentouxiang.png";
					}

					$(".me_img").css("background-image", "url(" + img + ")")
					$('.me_username').text(data.user.nick_name);
					$(".to_qiandao").removeClass("hidden")
				} else {

				}
			}
		});

		$('body').on("tap", ".me_img", function() {
			mui.openWindow({
				url: 'profile.html',
				id: 'profile.html'
			})
		})

		$('.me_newscenter').children("li").eq(0).click(function() {
			mui.openWindow({
				url: "../news/news_center.html",
				id: "../news/news_center.html",

			})
		})
		$('.me_play').children("li").eq(0).click(function() {
			mui.openWindow({
				url: "me_game.html",
				id: "me_game.html"
			})
		})
		$('.me_play').children("li").eq(1).click(function() {
			mui.openWindow({
				url: "me_works.html",
				id: "me_works.html"
			})
		})
		$('.me_play').children("li").eq(2).click(function() {
			mui.openWindow({
				url: "me_collection.html",
				id: "me_collection.html"
			})
		})

		$('.me_us').children("li").eq(1).click(function() {
			mui.openWindow({
				url: "about_us.html",
				id: "about_us.html"
			})
		})
		$('.me_us').children("li").eq(0).click(function() {
			mui.openWindow({
				url: "me_feedBack.html",
				id: "me_feedBack.html"
			})
		})
		$('.me_headerset').click(function() {
			$(this).addClass("move")
			setTimeout(function() {
				$(".me_headerset").removeClass("move")
			}, 400)
			mui.openWindow({
				url: "set_list.html",
				id: "set_list.html"
			})
		})

		$("body").on("tap", ".me_gold", function() {
			mui.openWindow({
				url: "me_pocket.html",
				id: "me_pocket.html"
			})
		})
		
		
		$("body").on("tap",".me_friend",function(){
			openShare()
		})
		
		

	}

})
$('.me_share').click(function() {
	$(this).addClass("move")
	setTimeout(function() {
		$(".me_share").removeClass("move")
	}, 400)
})

$('.me_headerset').click(function() {
	$(this).addClass("move")
	setTimeout(function() {
		$(".me_headerset").removeClass("move")
	}, 400)
})

$('.me_voucher').click(function() {
	if(userId) {
		mui.openWindow({
			url: "me_voucher.html",
			id: "me_voucher.html"
		})
	}
})

$(".to_qiandao").click(function() {
	if(userId) {
		mui.openWindow({
			url: "me_signin.html",
			id: "me_signin.html"
		})
	} else {
		mui.toast("请登录")
	}
})

window.addEventListener("showShare", function() {
	shareWebview()
})
window.addEventListener("getNowMoney", function(e) {
	$(".me_getgold").text(e.detail.coin)
})