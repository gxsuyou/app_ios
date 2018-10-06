page = 0

function up() {
	page++
	$.ajax({
		type: "get",
		url: config.data + "game/getActivityGame",
		async: true,
		data: {
			sys: 1,
			page: page,
		},
		success: function(data) {
			var g = data;

				var list = '';
				for(var i = 0; i < g.length; i++) {

					if(g[i].game_download_ios2) {
						var urlDownload = g[i].game_download_ios2
					} else {
						var urlDownload = g[i].game_download_ios
					}
//                 alert(JSON.stringify(g[i]))

					list +=
							"<li class='game_list ofh' data-id='" + g[i].game_id + "'>" +
						"<div class='color_9e9e9e fl game_listScore'>" + (i + 1 + (page - 1) * 20) + "</div>" +
						"<div class='game_listImg fl' style='background-image: url(" + config.img + encodeURI(g[i].icon) + ");'></div>" +
						"<div class='fl' style='margin-top: 1.25rem;margin-left: 0.875rem;'>" +
						"<div class='font_14 overflow'>" + g[i].game_name + "</div>" +
						"<div class='font_12'>" +
						"</div>" +
						"<div class='font_12 color_green all_voucher_show'  data-name='" + g[i].game_name + "'  data-id='" + g[i].game_id + "'>" +
						"<img style='width:6.5rem;' src='../../Public/image/voucher_icon.png'  />" +
						"<div class='open_voucher'>领取更多抵用券<span>></span></div>" +
						"</div>" +
						"</div>" +
						"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac' data-url='" + urlDownload + "'>下载</div>" +
						"</li>"
					//					}
				}
        
				$('.game_lists').append(list);

				if(g.length < 20) {

					mui('.list_game').pullRefresh().endPullupToRefresh(true);

				} else {
					mui('.list_game').pullRefresh().endPullupToRefresh(false);
				}


		}
	})

	$("body").on("tap", ".game_listDownload", function(e) {
		e.stopPropagation()
		var downloadUrl = $(this).attr("data-url")
		location.href = downloadUrl
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
}

function down() {
	location.reload()
}