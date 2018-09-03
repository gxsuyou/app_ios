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
			} else {
				$(".nav").children("div:nth-child(2)").html("资讯");
			}

			if(data.num2 != 0) {
				if(data.num2 > 99) {
					data.num2 = 99
				}
				$(".nav").children("div:nth-child(3)").html("攻略<div class='sign_num' >" + data.num2 + "</div>");
			} else {
				$(".nav").children("div:nth-child(3)").html("攻略");
			}

			if(data.num3 != 0) {
				if(data.num3 > 99) {
					data.num3 = 99
				}
				$(".nav").children("div:nth-child(4)").html("游戏<div class='sign_num' >" + data.num3 + "</div>");
			} else {
				$(".nav").children("div:nth-child(4)").html("游戏");
			}

		}
	});
}

/* 已读 */
function readed(sort) {
	$.ajax({
		type: "get",
		url: config.data + "users/getReading",
		async: true,
		data: {
			uid: userId,
			type: sort
		},
		success: function(data) {
			getSigns()
		}
	})
}

function center_info() {
	var info_arr = [];
	for(n = 4; n < 8; n++) {
		$.ajax({
			type: "get",
			url: config.data + "users/notice",
			async: true,
			data: {
				uid: userId,
				type: n
			},
			success: function(data) {
//				alert(JSON.stringify(data))
//				return false;
				info_arr.push({
					type: n,
					time: data.last.add_time,
					content: data.last.detail,
					state: data.last.state,
					id:data.last.tip_id,
					num:data.num,
				})
			}
		})
	}

	//		$.ajax({
	//			type: "get",
	//			url: config.data + "users/noticeAdd",
	//			async: true,
	//			data: {
	//				uid: userId,
	//				type: sort
	//			},
	//			success: function(data) {
	//				getSigns()
	//			}
	//		})

	var content = "<div class='centerInfo ofh'>" +
		"<div class='center_icon' style='background-image:url(../../Public/image/center_info_fuli.png)'></div>" +
		"<div class='center_info'>" +
		"<div>ONE福利</div>" +
		"<div>颜值超高的月饼你pick了【中秋佳节】</div>" +
		"</div>" +
		"<div class='center_time'>" +
		"<div>9月20日</div>" +
		"<div class='sign_num'>11</div>" +
		"</div>" +
		"</div>";
	$('.notice_lists').append(content);
	mui('.news_center').pullRefresh().endPullupToRefresh(true);
}

$("body").on("tap", ".centerInfo", function() {
	mui.openWindow({
		url: "new_center_info.html",
		id: "new_center_info.html",
		extras: {
			//			infoName:infoName,
			//			infoId:infoId
			infoName: "ONE福利"
		}
	})
})