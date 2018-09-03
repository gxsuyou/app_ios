//mui.pulseReady(function() {
page = 0

function up() {
	page++
	$.ajax({
		type: "get",
		url: config.data + "game/getGameByMsg",
		async: true,
		data: {
			sys: 1,
			page: page,
			type: "",
			sort: "sort3",
		},
		success: function(data) {
			//			alert(JSON.stringify(data))
			mui('.list_game').pullRefresh().endPullupToRefresh(true);
			//mui('.list_game').pullRefresh().endPullupToRefresh(false);
			return;
			var g = data.game;
			if(data.state) {
				var list = '';
				for(var i = 0; i < g.length; i++) {
					if(i < 3) {
						$('.first').attr('data-id', g[0].id)
						$('.first .y_listImg').css('background-image', 'url(' + config.img + encodeURI(g[0].icon) + ')')
						$('.first .y_listName').text(g[0].game_name)
						$('.first .game_recommend_starScore').text(g[0].grade)
						$('.second').attr('data-id', g[1].id)
						$('.second .y_listImg').css('background-image', 'url(' + config.img + encodeURI(g[1].icon) + ')')
						$('.second .y_listName').text(g[1].game_name)
						$('.second .game_recommend_starScore').text(g[1].grade)
						$('.third ').attr('data-id', g[2].id)
						$('.third  .y_listImg').css('background-image', 'url(' + config.img + encodeURI(g[2].icon) + ')')
						$('.third  .y_listName').text(g[2].game_name)
						$('.third  .game_recommend_starScore').text(g[2].grade)
						$(".first_three").css("display", "flex");
					} else {
						var signs = '';
						if(g[i].tagList && g[i].tagList !== "null") {
							var result = g[i].tagList.split(",");
							var tagId = g[i].tagId.split(",");
							if(result.length > 2) {
								for(var j = 0; j < 3; j++) {
									signs +=
										"<div  class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
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
							"<div class='color_9e9e9e fl game_listScore'>" + (i + 1) + "</div>" +
							"<div class='game_listImg fl' style='background-image: url(" + config.img + encodeURI(g[i].icon) + ");'></div>" +
							"<div class='fl' style='margin-top: 1.25rem;margin-left: 0.875rem;'>" +
							"<div class='font_14 overflow'>" + g[i].game_name + "</div>" +
							"<div class='font_12'>" +
							"<div class='ofh game_recommend_stars'>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_starScore fl color_green' >" + g[i].grade + "</div>" +
							"</div>" +
							"</div>" +
							"<div class='font_12 color_green all_signs'>" +
							signs +
							"</div>" +
							"</div>" +
							"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>" +
							"</li>"
					}
				}

				$('.game_lists').append(list);
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
			rankToggle = false;
		},
		error: function() {
			$(".nav_cls_contains").css("display", "none");
			var errorHTML = "<div style='margin-top:14rem'><img style='width:138px;height:180px;display:block;margin:0 auto;' src='../../Public/image/notonline.png' /></div>";
			$('.error').html(errorHTML);
			rankToggle = false;
		}
	});
}

function down() {
	location.reload()
}
//})