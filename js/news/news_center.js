$(function() {
	mui.plusReady(function() {
		getSigns()

		$('.nav').css('top', total_height);
		$('body').on("tap", ".nav > div", function() {
			if(ajaxToggle) {
				return false;
			}

			var selfSort = $(this).attr('data-sort');
			$(this).addClass('active').siblings('div').removeClass('active');
			$('.notice_lists').children().remove();
			mui('.news_center').pullRefresh().refresh(true);
			page = 0;
			sort = selfSort;
			readed(sort)
			up();
		});

		$('body').on('tap', '.notice_list', function() {
			var type = $(this).attr("data-type");
			var commentId = $(this).attr("data-id");
			var gameId = $(this).attr("data-game");
			var url;
			if(type == 1) {
				url = "news_allComments.html"
			} else if(type == 2) {
				url = "../strategy/strategy_allComments.html"
			} else {
				url = "../game/game_allComments.html"
			}

			mui.openWindow({
				url: url,
				id: url,
				extras: {
					commentId: commentId,
					gameId: gameId
				}
			})
		})
	})
})

/* 
 获取红点
 * */
function getSigns() {
	$.ajax({
		type: "get",
		url: config.data + "users/getMassage",
		async: true,
		data: {
			uid: userId
		},
		success: function(data) {
			if(data.num1 != 0) {
				if(data.num1 > 99) {
					data.num1 = 99
				}
				$(".nav").children("div:nth-child(2)").html("资讯<div class='sign_num' >" + data.num1 + "</div>");
			}else{
				$(".nav").children("div:nth-child(2)").html("资讯");
			}

			if(data.num2 != 0) {
				if(data.num2 > 99) {
					data.num2 = 99
				}
				$(".nav").children("div:nth-child(3)").html("攻略<div class='sign_num' >" + data.num2 + "</div>");
			}else{
				$(".nav").children("div:nth-child(3)").html("攻略");
			}

			if(data.num3 != 0) {
				if(data.num3 > 99) {
					data.num3 = 99
				}
				$(".nav").children("div:nth-child(4)").html("游戏<div class='sign_num' >" + data.num3 + "</div>");
			}else{
				$(".nav").children("div:nth-child(4)").html("游戏");
			}

		}
	});
}

/* 已读 */
function readed(sort){
	$.ajax({
		type: "get",
		url: config.data + "users/getReading",
		async: true,
		data: {
			uid:userId,
			type:sort
		},
		success: function(data){
			getSigns()
		}
	})
}
