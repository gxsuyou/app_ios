var val;
$(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
	});
	$('body').on("tap", ".search_img", function() {
		var val = $(".search_bar").val()
		if(val != "") {
			$(".search_bar").blur();
			mui.openWindow({
				url: "game_search_result_list.html",
				id: "game_search_result_list.html",
				extras: {
					val: val
				}
			})
		} else {
			//$(".search_bar").blur();
		}
	});

	$("body").on("input", ".search_bar", function() {
		search();
	});

	$("body").on("tap", ".search_close", function() {
		$(".search_bar").val("");
	})

	function search() {
		val = $('.search_bar').val().replace(/[&\|\\\*^%$#@\-]/g, "");
		$('.search_lists').children().remove();
		if(val) {
			pages = 1
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
					$('.error').html("");
					if(data.state) {
						var div = '';
						var g = data.game;
						if(g.length > 0) {
							for(var i = 0; i < g.length; i++) {
								div +=
									"<div class='search_list font_12 simHei' data-id='" + g[i].id + "'>" +
									"<span class='search_liastImg fl' style='background-image:url(" + config.img + encodeURI(g[i].icon) + ")'></span>" +
									"<div class='fl' style='margin-left: 1rem;'>" + g[i].game_name + "</div>" +
									"</div>"
							}
							$('.search_lists').empty().append(div);
						} else {

						}

					} else {
						var no_content = "<div class='no_content tac '>没有搜到任何内容</div>";
						$('.search_lists').empty().append(no_content);
					}
				},
				error: function() {
					var errorHTML = "<div style='margin-top:11rem'><img style='width:138px;height:180px;display:block;margin:0 auto;' src='../../Public/image/notonline.png' /></div>";
					$('.error').html(errorHTML);
				}
			});
		}
	}

	$('body').on('tap', '.search_list', function() {

		$(".search_bar").blur();
		mui.openWindow({
			url: "game_detail.html",
			id: "game_detail.html",
			extras: {
				gameId: $(this).attr('data-id')
			}
		})
	})
})