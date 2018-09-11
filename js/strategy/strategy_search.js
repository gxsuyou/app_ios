$(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
	});
	$('body').on('input', 'input[type=text]', function() {
		$('.search_lists').children().remove()
		var val = $('.search_bar').val()
		if(val) {
			search(val)
		}
	})

	function search(val) {
		$.ajax({
			type: "get",
			url: config.data + "strategy/getStrategyGameNameByMsg",
			async: true,
			data: {
				msg:val
			},
			success: function(data) {
				$('.error').html("");
				if(data.state) {
					var gn = data.gameName;
					var div = '';
					if(gn.length == 0) {
						var no_content = "<div class='no_content tac '>没有搜到任何内容</div>";
						$('.search_lists').empty().append(no_content);
						return false;
					}
					for(var i = 0; i < gn.length; i++) {
						div +=
							"<div class='search_list font_12 simHei' data-id='" + gn[i].id + "'>" +
							"<img class='fl' style='margin:1.2rem 0rem 0 0.8rem' src='../../Public/image/strategy_search_icon.png' />" +
							"<div class='fl' style='margin:0 0.5rem 0 1rem;'>" + gn[i].game_name + " :" + "</div>" +
							"<div class='fl searchTitle' >" + gn[i].title + "</div>" +
							"</div>"
					}
					$('.search_lists').empty().append(div);
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


	$("body").on('tap', '.search_list', function() {
		$(".search_bar").blur();
		var val = $(this).children('.searchTitle').text();
		var id = $(this).attr("data-id");
		addLog(val)
		mui.openWindow({
			url: "strategy_details.html",
			id: "strategy_details.html",
			extras: {
				strategyId: id
			}
		});

	})

	$("body").on("tap", ".search_close", function() {
		$(".search_bar").val("");
		$('.search_lists').empty()
	})

	$('body').on("tap", ".search_img", function() {
		var val = $(".search_bar").val()
		if(val != "") {
			addLog(val)
			$(".search_bar").blur();
			
			mui.openWindow({
				url: "strategy_search_result_list.html",
				id: "strategy_search_result_list.html",
				extras: {
					val: val
				}
			})
		}
	})

	/* 添加历史记录 */
	function addLog(val) {
		if(userId && val) {
			$.ajax({
				type: "get",
				url: config.data + "users/searchLogAdd",
				async: true,
				data: {
					uid: userId,
					keyword: val,
					type: 3,
					sys: 1,
				},
				success: function(data){}
			})
		}
	}

	LogInit("part")

	function LogInit(val) {
		if(userId) {
			var content = ""
			$.ajax({
				type: "get",
				url: config.data + "users/searchLog",
				async: true,
				data: {
					uid: userId,
					type: 3,
					sys: 1,
				},
				success: function(data) {
					if(data.length != 0) {
						if(data.length < 6 || val == "all") {
							data.forEach(function(item) {
								content += "<div class='search_log font_12 simHei'  >" +
									"<div class='fl nb searchTitle' style='margin-left: 0.2rem; width: 100%;'><div class='searchTitle fl' style='width:80%;'>" + item.title + "</div><div class='fr delLog' data-id='" + item.id + "'>×</div>" + "</div>" +
									"</div>"
							})
							content += "<div class='search_log  font_12 simHei clear_log'  style='text-align:center;color:#bfbfbf;font-weight:600;'>" +
								"清空搜索记录" +
								"</div>"
						} else {

							for(var n = 0; n < 6; n++) {
								content += "<div class='search_log font_12 simHei'  >" +
									"<div class='fl nb ' style='margin-left: 0.2rem; width: 100%;'><div class='searchTitle fl' style='width:80%;'>" + data[n].title + "</div><div class='fr delLog' data-id='" + data[n].id + "'>×</div>" + "</div>" +
									"</div>";
							}
							content += "<div class='search_log  font_12 simHei more_log'  style='text-align:center;color:#bfbfbf;font-weight:600;'>" +
								"全部搜索记录" +
								"</div>"
						}					
					}
					$('.search_lists').empty().append(content)
				}
			})

		}
	}
	
	 /*点击*/
	$("body").on("tap", ".nb", function() {
		var val = $(this).text()
		val = val.replace(/×/g, "")
		$(".search_bar").val(val)
		search(val)
	})
	

	/*更多记录*/
	$("body").on("tap", ".more_log", function() {
		LogInit("all")
	})
	
	/*清除单个记录*/
	$("body").on("tap", ".delLog", function(e) {
		e.stopPropagation()
		var id = $(this).attr("data-id");
		delLog(id)
	})
	/*清除所有记录*/
	$("body").on("tap", ".clear_log", function() {
		delLog("0")
		$('.search_lists').empty()
	})
	
	function delLog(id) {
		$.ajax({
			type: "get",
			url: config.data + "users/clearSearchLog",
			async: true,
			data: {
				uid: userId,
				type:3,
				sys:1,
				id:id
			},
			success: function(data) {
				if(data.state = 1) {
					LogInit("part")
				} else {
					mui.toast("删除记录失败")
				}
			}
		})
	}
})