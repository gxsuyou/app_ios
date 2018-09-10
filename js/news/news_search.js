var val = "";
var show = true;
$(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
	});
	$('body').on("tap", ".search_img", function() {
		var val = $(".search_bar").val()
		if(val != "") {
			addLog(val) /*添加历史信息*/
			$(".search_bar").blur();
			mui.openWindow({
				url: "new_search_result_list.html",
				id: "new_search_result_list.html",
				extras: {
					val: val
				}
			})
		}

	})
	$("body").on("input", ".search_bar", function() {
		val = $('.search_bar').val().replace(/[&\|\\\*^%$#@\-]/g, "");
		$('.search_lists').children().remove();
		search(val);
	});

	$("body").on("tap", ".search_close", function() {
		$(".search_bar").val("")
		$('.search_lists').empty()
	})

	function search(val) {	
		if(val) {			
			pages = 1
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
					$('.error').html("");
					if(data.state) {
						var div = '';
						var g = data.newsList;

						if(g.length > 0) {
							for(var i = 0; i < g.length; i++) {
								div +=
									"<div class='search_list font_12 simHei' data-id='" + g[i].id + "'>" +
									"<div class='fl overflow' style='margin-left: 0.2rem; width: 100%;'>" + g[i].title + "</div>" +
									"</div>"
							}
							$('.search_lists').empty().append(div)

						} else {
							var no_content = "<div class='no_content tac'>没有搜到任何内容</div>";
							$('.search_lists').append(no_content)
						}
					} else {
						if(show) {

							var no_content = "<div class='no_content tac'>没有搜到任何内容</div>";
							$('.search_lists').empty().append(no_content);

						}
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
		var val = $(this).text()
		addLog(val) /*添加历史信息*/
		$(".search_bar").blur();
		mui.openWindow({
			url: "news_post.html",
			id: "news_post.html",
			extras: {
				newsId: $(this).attr('data-id')
			}
		})
	})

	function addLog(val) {
		if(userId && val) {
			$.ajax({
				type: "get",
				url: config.data + "users/searchLogAdd",
				async: true,
				data: {
					uid: userId,
					keyword: val,
					type: 1,
					sys:1,
				},
				success: function(data) {}
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
					type: 1,
					sys: 1,
				},
				success: function(data) {
					if(data.length != 0) {
						if(data.length < 6 || val == "all") {
							data.forEach(function(item) {
								content += "<div class='search_log font_12 simHei'  >" +
									"<div class='fl overflow nb' style='margin-left: 0.2rem; width: 100%;'>" + item.title + "<div class='fr delLog' data-id='" + item.id + "'>×</div>" + "</div>" +
									"</div>"
							})
							content += "<div class='search_log  font_12 simHei clear_log'  style='text-align:center;color:#bfbfbf;font-weight:600;'>" +
								"清空搜索记录" +
								"</div>"
						} else {

							for(var n = 0; n < 6; n++) {
								content += "<div class='search_log font_12 simHei'  >" +
									"<div class='fl overflow nb' style='margin-left: 0.2rem; width: 100%;'>" + data[n].title + "<div class='fr delLog' data-id='" + data[n].id + "'>×</div>" + "</div>" +
									"</div>";
							}
							content += "<div class='search_log  font_12 simHei more_log'  style='text-align:center;color:#bfbfbf;font-weight:600;'>" +
								"全部搜索记录" +
								"</div>"
						}

						$('.search_lists').empty().append(content)
					}
				}
			})

		}
	}

	$("body").on("tap", ".nb", function() {
         var val=$(this).text()
         val=val.replace(/×/g,"")
         $(".search_bar").val(val)
         search(val) 
	})

	$("body").on("tap", ".more_log", function() {
		LogInit("all")
	})

	/*清除单个记录*/
	$("body").on("tap", ".delLog", function() {
		var id = $(this).attr("data-id");
		delLog(id)
	})

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
				type: 1,
				sys: 1,
				id: id
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