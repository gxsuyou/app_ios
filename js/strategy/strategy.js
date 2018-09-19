$(function() {
	window.addEventListener('refresh', function(event) {
		down()
	});
	//	获取顶部搜索
	$.ajax({
		type: "get",
		url: config.data + "strategy/getSearchGame",
		async: true,
		data: {
			sys: 2
		},
		success: function(data) {
			if(data.state) {
				var li = "";
				var gl = data.gameList;
				for(var i = 0; i < gl.length; i++) {
					li +=
						"<li class='tacI'>" +
						"<div  style='width: 3rem;'>" +
						"<div class='strategy_headImg' style='background-image: url(" + config.img + encodeURI(gl[i].icon) + ");' ></div>" +
						"<div class='font_12 color_282828 strategy_headImgart'>" + gl[i].game_name + "</div>" +
						"</div>" +
						"</li>"
				}
				$('.strategy_headImgs').append(li)
			} else {

			}
		}
	});

	//头部游戏导航条点击
	$('body').on('tap', '.tacI', function() {
		var msg = $(this).find('.strategy_headImgart').text();
		mui.openWindow({
			url: "strategy_search_result.html",
			id: "strategy_search_result.html",
			extras: {
				msg: msg
			}
		})
	})

	var startX, startY;
	$("body").on("touchstart", function(e) {
		startX = e.originalEvent.changedTouches[0].pageX,
			startY = e.originalEvent.changedTouches[0].pageY;
	})

	$("body").on("touchmove", function(e) {
		moveEndX = e.originalEvent.changedTouches[0].pageX,
			moveEndY = e.originalEvent.changedTouches[0].pageY,
			X = moveEndX - startX,
			Y = moveEndY - startY;

		if(X > 0 && X > 160) {

			if(sort == "comment_num") {
				return false;
//				sort = "add_time"
//				$(".strategy_nav>div:first-child").removeClass('color_green border_bottom');
//				$(".strategy_nav>div:nth-child(2)").addClass('color_green border_bottom')
			}else if(sort == "add_time"){
				sort = "comment_num"
				$(".strategy_nav>div:nth-child(2)").removeClass('color_green border_bottom');
				$(".strategy_nav>div:first-child").addClass('color_green border_bottom')
			}else if(sort == "essence"){
				sort = "add_time"
				$(".strategy_nav>div:nth-child(3)").removeClass('color_green border_bottom');
				$(".strategy_nav>div:nth-child(2)").addClass('color_green border_bottom')
			}else {
				return false;
			}
			$('.strategy_contents').children().remove();
			page = 0;
			mui('.strategy').pullRefresh().refresh(true);
			up()
		} else if(X < 0 && 160 < -(X)) {
			//向右
			if(sort == "comment_num") {
				sort = "add_time"
				$(".strategy_nav>div:first-child").removeClass('color_green border_bottom');
				$(".strategy_nav>div:nth-child(2)").addClass('color_green border_bottom')
			}else if(sort == "add_time"){
				sort = "essence"
				$(".strategy_nav>div:nth-child(2)").removeClass('color_green border_bottom');
				$(".strategy_nav>div:nth-child(3)").addClass('color_green border_bottom')
			}else {
				return false;
			}
			$('.strategy_contents').children().remove();
			page = 0;
			mui('.strategy').pullRefresh().refresh(true);
			up()
	
		}
	});

	//	获取顶部搜索结束

	$('body').on('tap', '.strategy_content_classify', function(e) {
		e.stopPropagation()
		var msg = $(this).text();
		mui.openWindow({
			url: "strategy_search_result.html",
			id: "strategy_search_result.html",
			extras: {
				msg: msg
			}
		})
	})

	//	d导航栏点击
	$('.strategy_nav').children().eq(0).click(function() {
		sort = "comment_num"
	})
	$('.strategy_nav').children().eq(1).click(function() {
		sort = "add_time"
	})
	$('.strategy_nav').children().eq(2).click(function() {
		sort = "essence"
	})

	$('.strategy_nav').children().click(function() {

		$(this).addClass('color_green border_bottom').siblings().removeClass('color_green border_bottom');
		$('.strategy_contents').children().remove();
		page = 0;
		mui('.strategy').pullRefresh().refresh(true);
		up()

	})

	/* 进入攻略详情 */
	$('body').on('tap', '.strategy_content', function() {
		var strategyId = $(this).attr('data-id');
		var browseNum = $(this).find('.browseNum').eq(0).text();
		$(this).find('.browseNum').eq(0).text(parseInt(browseNum) + 1)
		mui.openWindow({
			url: "strategy_details.html",
			id: "strategy_details.html",
			extras: {
				strategyId: strategyId,
				anchor: true
			}
		})
	})

	//	评论
	$('body').on('tap', '.comment_img', function(event) {
		event.preventDefault();
		var strategyId = $(this).attr('data-id');

		mui.openWindow({
			url: "strategy_details.html",
			id: "strategy_details.html",
			extras: {
				strategyId: strategyId,
				anchor: false
			}
		})
	})

	//	评论end
	$('.search').click(function() {
		mui.openWindow({
			url: "strategy_search.html",
			id: "strategy_search.html"
		})
	});

	$('body').on("tap", ".bell", function() {
		if(userId) {
			mui.openWindow({
				url: "../news/news_center.html",
				id: "news_center.html"
			});
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html"
			});
		}
	});

	$('.pen').click(function() {
		if(window.localStorage.getItem("rememberUser")) {
			mui.openWindow({
				url: "strategy_add.html",
				id: "strategy_add.html"
			})
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html"
			})
		}

	})
})



//添加浏览,点赞,评论数结束


	//	游戏攻略点赞

	$('body').on('tap', '.thumb,.thumb_num', function(e) {
		e.stopPropagation();
		if(userId) {
			var ts = $(this);
			if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {
				ts.css('background-image', 'url("../../Public/image/good.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) - 1)
				ts.attr('data-state', 'null');
				$.ajax({
					type: "get",
					url: config.data + "strategy/unLikeNum",
					async: true,
					data: {
						strategyId: ts.attr('data-id'),
						user_id: userId
					},
					success: function(data) {
						if(data.state) {
							mui.toast("取消点赞成功")
						} else {
							mui.toast("取消点赞失败，请重试")
						}
					}
				});
			} else {
				ts.css('background-image', 'url("../../Public/image/diangoodone.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) + 1)
				ts.attr('data-state', 1)
				$.ajax({
					type: "get",
					url: config.data + "strategy/addNum",
					async: true,
					data: {
						strategyId: ts.attr('data-id'),
						user_id: userId
					},
					success: function(data) {

						if(data.state) {
							mui.toast("点赞成功")

						} else {
							mui.toast("点赞失败，请重试")
						}
					}
				});
			}
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html",

			})
		}

	})

	//	游戏点赞结束