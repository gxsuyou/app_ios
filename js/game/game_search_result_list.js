mui.plusReady(function() {
	var self = plus.webview.currentWebview()
	val = self.val
	$.ajax({
		type: "get",
		url: config.data + "game/searchGameByMsg",
		async: true,
		data: {
			sys: 1,
			msg: val,
			sort: "sort",
			page: 1
		},
		success: function(data) {
			var g = data.game;
			var list = "";
			for(var i = 0; i < g.length; i++) {
				var signs = '';
				if(g[i].tagList && g[i].tagList !== "null") {
					var result = g[i].tagList.split(",");
					var tagId = g[i].tagIdList.split(",");
					if(result.length > 2) {
						for(var j = 0; j < 3; j++) {
							signs +=
								"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
						}
					} else {
						for(var j = 0; j < result.length; j++) {
							signs +=
								"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
						}
					}

				} else {

				}

				list +=
					"<li class='game_list ofh' data-id='" + g[i].id + "'>" +
					"<div class='game_listImg fl' style='background-image: url(" + config.img + encodeURI(g[i].icon) + ");'></div>" +
					"<div class='fl' style='margin-top: 1.25rem;margin-left: 0.875rem;'>" +
					"<div class='font_14'>" + g[i].game_name + "</div>" +
					"<div class='font_12'>" +
					"<div class='ofh game_recommend_stars'>" +
					"<div class='game_recommend_star fl'></div>" +
					"<div class='game_recommend_star fl'></div>" +
					"<div class='game_recommend_star fl'></div>" +
					"<div class='game_recommend_star fl'></div>" +
					"<div class='game_recommend_star fl'></div>" +
					"<div class='game_recommend_starScore fl color_green'>" + g[i].grade + "</div>" +
					"</div>" +
					"</div>" +
					"<div class='font_12 color_green'>" +
					signs +
					"</div>" +
					"</div>" +
					"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>" +
					"</li>";

			}
			$(".game_lists").append(list)

			$('.game_recommend_stars').each(function() {

				var score = $(this).find('.game_recommend_starScore').eq(0).text()
				var starNum = Math.round(score)

				if(starNum % 2 == 0) {

					var starFinal = (starNum / 2 - 1);
					$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_active')
					$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
				} else {
					var starFinal = ((starNum - 1) / 2)
					$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
					$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_half')
				}
			})
		}
	})
	$('body').on('tap', '.game_list', function() {
		mui.openWindow({
			url: "game_detail.html",
			id: "game_detail.html",
			extras: {
				gameId: $(this).attr('data-id')
			}
		});
	})
	$('body').on('tap', '.tag', function(event) {
		event.stopPropagation();
		var tagId = $(this).attr("data-id");
		var tagName = $(this).text();
		mui.openWindow({
			url: "game_classify_list.html",
			id: "game_classify_list.html",
			extras: {
				tagId: tagId,
				tagName: tagName
			}
		})
	})
})