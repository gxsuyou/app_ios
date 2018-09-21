mui.plusReady(function() {
	var self = plus.webview.currentWebview()
	val = self.val	
	$.ajax({
		type: "get",
		url: config.data + "strategy/getStrategyGameNameByMsg",
		async: true,
		data: {
			msg: val,
			user_id:userId
		},
		success: function(data) {
			var str = data.gameName,
				imgToggle, portrait, div = "",
				imgSrc;
			for(var i = 0; i < str.length; i++) {
				if(str[i].src) {
					src = "src"
				} else {
					src = "hidden"
				}
				if(str[i].top_img_src == "" || str[i].top_img_src == null) {
					imgSrc = "";
					imgToggle = "none";
				} else {
					imgSrc = str[i].top_img_src;
					imgToggle = "block";
				}
				var detail = $(str[i].detail).text();
				if(str[i].portrait == 0 || str[i].portrait == null) {
					portrait = "../../Public/image/morentouxiang.png";
				} else {
					portrait = str[i].portrait;
				}

				if(str[i].essence == 1) {
					var essence_image = "<img class='fl' style='width:2rem;margin-top:0.1rem;margin-right:0.15rem;' src='../../Public/image/essence.png'>"
				} else {
					var essence_image = "&nbsp;"
				}
				
				if(str[i].strategy_id == null) {
					var dianz = "<span class='thumb' data-state='null' data-id='" + str[i].id + "'></span>"
				} else {
					var dianz = "<span class='thumb' data-state='1'  data-id='" + str[i].id + "' style='background-image:url(../../Public/image/diangoodone.png)'></span>"
				}
				

				div +=
					"<div class='strategy_content' data-id='" + str[i].id + "' data-userId='" + str[i].user_id + "'>" +
					"<div class='strategy_content_head'>" +
					"<div class='strategy_content_headImg fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
					"<div class='fl' style='margin-left: 1rem;margin-top: 0.3rem;'>" +
					"<div class='font_14 color_282828'>" + str[i].nike_name + "</div>" +
					"<div class='font_12 color_9e9e9e'>" + str[i].add_time + "</div>" +
					"</div>" +
					"<div class='fr' style='margin-top: 1.5rem;margin-right:0.8rem;display:flex;align-items:center'>" +
					"<span class='icon_read'></span>" +
					"<span class='font_12 browseNum' style='font-size:12px;color:#7a7a7a;'>" + str[i].browse_num + "</span>" +
					"</div>" +
					"</div>" +
					"<div class='strategy_content_img " + src + "' style='background-image: url(" + config.img + encodeURI(str[i].src) + ");'></div>" +
					"<div class='strategy_content_art font_14 color_7a7a7a'>" +
					"<div style='width:100%;max-height:14.6rem;overflow:hidden;'>" +
					"<img style='width:100%;display:" + imgToggle + "' src=" + imgSrc + " />" +
					"</div>" +
					"<div class='strategy_content_titles'>" +
					essence_image +
					"<div class='strategy_content_title font_bold color_282828'>" + str[i].title + "</div>" +
					"</div>" +
					"<div class='strategy_content_z'>" + detail + "</div>" +
					"</div>" +
					"<div class='strategy_content_classifys ofh'>" +
					"<div class='backgroundColor_gray border_radius_twenty strategy_content_classify tac font_14 color_7a7a7a fl'>" + str[i].game_name + "</div>" +
					"<div class='fr color_9e9e9e comment_imgs fr'>" +
					dianz +
					"<span class='thumb_num font_14' data-id='" + str[i].id + "'>" + str[i].agree_num + "</span>" +
					"<span class='comment_img' data-id='" + str[i].id + "' data-userId='" + str[i].user_id + "'></span>" +
					"<span class='comment_num font_14' style='margin-left:0.4rem;'>" + str[i].comment_num + "</span>" +
					"</div>" +
					"</div>" +
					"<div class='cut_line backgroundColor_gray'></div>" +
					"</div>"

			}

			$('.strategy_lists').append(div);
		}
	})
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
	
		//	游戏点赞
	$('body').on('tap', '.thumb,.thumb_num', function(e) {
		e.stopPropagation();
		if(userId) {
			var ts = $(this);
			if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {
				ts.css('background-image', 'url("../../Public/image/good.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) - 1)
				ts.attr('data-state', 'null')
				$.ajax({
					type: "get",
					url: config.data + "strategy/unLikeNum",
					async: true,
					data: {
						strategyId:ts.attr('data-id'),
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
						strategyId:ts.attr('data-id'),
						user_id:userId
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
})