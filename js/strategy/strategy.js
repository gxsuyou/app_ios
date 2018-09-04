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
		$('.strategy_contents').children().remove();
		$(this).addClass('color_green border_bottom').siblings().removeClass('color_green border_bottom');
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
				id: "../news/news_center.html"
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

//添加浏览,点赞,评论数
//function add(strategyId,numType){
//	$.ajax({
//		type:"get",
//		url:config.data+ "strategy/addNum",
//		async:true,
//		data:{
//			strategyId:strategyId,
//			numType:numType,
//			num:0
//		},
//		success:function(data){
//			if (data.state) {
//				
//
//			} else{
//				
//			}
//		}
//	});
//}

//添加浏览,点赞,评论数结束