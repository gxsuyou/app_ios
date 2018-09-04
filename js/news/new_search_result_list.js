var val;
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	val = self.val;
	$.ajax({
		type: "get",
		url: config.data + "news/searchNewsByGameName",
		async: true,
		data: {
			sys: 1,
			msg: val,
			page: 1
		},
		success: function(data) {
			var div="";
			var n = data.newsList;
			for(var i = 0; i < n.length; i++) {
				if(n[i].game_id) {
					div +=
						"<div class='news_art ofh' style='margin-top: 0.75rem;margin-bottom: 0.2rem;' data-id = '" + n[i].id + "' data-gameId = '" + n[i].game_id + "'>" +
						"<div class='news_img' style='background-image:url(" + config.img + encodeURI(n[i].img) + ")'>" +
						"<div class='news_img_content color_white'>" +
						"<div class='news_img_header fl' style='background-image:url(" + config.img + encodeURI(n[i].icon) + ")'></div>" +
						"<div class='fl  new_art_name font_14 overflow'>" + n[i].game_name + "</div>" +
						"<div class='fr font_12' style='margin-top: 1.75rem;'>" +
						"<div class='fr news_art_viewNum' style='width: 1.8rem;'>" + n[i].browse + "</div>" +
						"<div class='fr news_art_view'></div>" +
						"</div>" +
						"</div>" +
						"</div>" +
						"<div class='news_art_content'>" +
						"<div class='news_art_art font_14 font_bold fl ofh'>" +
						n[i].title +
						"</div>" +
						"</div>" +
						"<div class='news_art_time font_12'>" +
						n[i].add_time +
						"</div>" +
						"</div>"
				} else {
					div +=
						"<div class='news_art ofh' style='margin-top: 0.75rem;margin-bottom: 0.2rem;' data-id = '" + n[i].id + "' data-gameId = '" + n[i].game_id + "'>" +
						"<div class='news_img' style='background-image:url(" + config.img + encodeURI(n[i].img) + ")'>" +
						"<div class='news_img_content color_white'>" +
						"<div class='news_img_header fl' style='background-image:url(" + config.img + encodeURI(n[i].icon) + ")'></div>" +
						"<div class='fr font_12' style='margin-top: 1.75rem;'>" +
						"<div class='fr news_art_viewNum' style='width: 1.8rem;'>" + n[i].browse + "</div>" +
						"<div class='fr news_art_view'></div>" +
						"</div>" +
						"</div>" +
						"</div>" +
						"<div class='news_art_content'>" +
						"<div class='news_art_art font_14 font_bold fl ofh'>" +
						n[i].title +
						"</div>" +
						"</div>" +
						"<div class='news_art_time font_12'>" +
						n[i].add_time +
						"</div>" +
						"</div>"
				}
			}
			$(".new_lists").append(div)

		}
	});
	
	
	
	
	$('body').on('tap','.news_art',function(){
		$(".search_bar").blur();
		mui.openWindow({
			url:"news_post.html",
			id:"news_post.html",
			extras:{
				newsId:$(this).attr('data-id')
			}
		})
	})

})