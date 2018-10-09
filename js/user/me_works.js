var msg;
$(function() {
	window.addEventListener('reload', function() {
		// mui.fire()传过来的额外的参数，在event.detail中；
		window.location.reload();
		// var param = detail.param;
		// 执行相应的ajax或者操作DOM等操作
	});

	$('body').on('tap', '.strategy_content', function() {
		var strategyId = $(this).attr('data-id');
		mui.openWindow({
			url: "../strategy/strategy_details.html",
			id: "strategy_details.html",
			extras: {
				strategyId: strategyId,
				anchor: true
			}
		})
	})
	$('body').on('tap', '.strategy_content_classify', function(e) {
		e.stopPropagation()
		var msg = $(this).text();
		mui.openWindow({
			url: "../strategy/strategy_search_result.html",
			id: "strategy_search_result.html",
			extras: {
				msg: msg
			}
		})
	})

	$('body').on('longtap', '.strategy_content', function() {
		var strategyId = $(this).attr('data-id');
		var btnarr = ["确定", "取消"];
		mui.confirm("你确定删除这条攻略吗？", "操作提示", btnarr, function(e) {
			if(e.index == 0) {
				$.ajax({
					type: "get",
					url: config.data + "strategy/strategyDelete",
					async: true,
					data: {
						strategyId: strategyId
					},
					success: function(data) {
						if(data.state) {
							mui.alert("删除成功！", "操作提示", "确定");
							location.reload()
						} else {
							mui.alert("删除失败！", "操作提示", "确定");
						}
					}
				});

			} else {

			}
		});
	})
	
	
	
	//添加浏览,点赞,评论数
	$('body').on('tap', '.thumb,.thumb_num', function(e) {
		e.stopPropagation();
		if(userId) {
			var ts = $(this);
			if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {

				$.ajax({
					type: "get",
					url: config.data + "strategy/unLikeNum",
					async: true,
					data: {
						strategyId: ts.attr('data-id'),
						user_id: userId
					},
					success: function(data) {
						if(data.state) {
							mui.toast("取消点赞成功")
							ts.css('background-image', 'url("../../Public/image/good.png")')
							ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) - 1)
							ts.attr('data-state', 'null')
						} else {
							mui.toast("取消点赞失败，请重试")
						}
					}
				});
			} else {
				$.ajax({
					type: "get",
					url: config.data + "strategy/addNum",
					async: true,
					data: {
						strategyId: ts.attr('data-id'),
						user_id: userId
					},
					success: function(data) {
						if(data.state) {
							mui.toast("点赞成功")
							ts.css('background-image', 'url("../../Public/image/diangoodone.png")')
							ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) + 1)
							ts.attr('data-state', 1)

						} else {
							mui.toast("点赞失败，请重试")
						}
					}
				});
			}
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "login.html",

			})
		}
	})
	//添加浏览,点赞,评论数结束

})