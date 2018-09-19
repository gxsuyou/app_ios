var msg;

$(function(){
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		msg = self.msg; 
		$('.header_title').text(msg)
	})
//	d导航栏点击
	$('.strategy_nav').children().eq(0).click(function(){
		sort = "comment_num "
	})
	$('.strategy_nav').children().eq(1).click(function(){
		sort = "add_time"
	})
	$('.strategy_nav').children().eq(2).click(function(){
		sort = "essence"
	})
	$('.strategy_nav').children().click(function(){
		$('.strategy_contents').children().remove();
		$(this).addClass('color_green border_bottom').siblings().removeClass('color_green border_bottom');
		page = 0;
		mui('.strategy').pullRefresh().refresh(true);
		up()
		
	})
	
//	d导航栏点击结束

	$('body').on('tap','.strategy_content',function(){
		var strategyId = $(this).attr('data-id');
		add("browse_num");
		mui.openWindow({
			url:"strategy_details.html",
			id:"strategy_details.html",
			extras:{
				strategyId:strategyId,
				anchor: true
			}
		})
	})
	



//	评论
	$('body').on('tap','.comment_img',function(event){
		event.preventDefault();
		var strategyId = $(this).attr('data-id');
		add(commnet_num);
		mui.openWindow({
			url:"strategy_details.html",
			id:"strategy_details.html",
			extras:{
				strategyId:strategyId,
				anchor: false
			}
		})
	})
	
//	评论end
	$('body').on("tap",".search",function(){
		mui.openWindow({
			url:"strategy_search.html",
			id:"strategy_search.html"
		})
	});
	
	$('body').on("tap",".bell",function(){
		mui.openWindow({
			url:"../news/news_center.html",
			id:"../news/news_center.html"
		})
	})
	
	
	
	
	$('.pen').click(function(){
		mui.openWindow({
			url:"strategy_add.html",
			id:"strategy_add.html"
		})
	})
})

//添加浏览,点赞,评论数
function add(numType){
	var strategyId = $(this).attr('data-id');
	$.ajax({
		type:"get",
		url:config.data+ "strategy/addNum",
		async:true,
		data:{
			strategyId:strategyId,
			numType:numType
		},
		success:function(data){
			if (data.state) {
				
			} else{
				
			}
		}
	});
}

//添加浏览,点赞,评论数结束

//	游戏攻略点赞

	$('body').on('tap', '.thumb,.thumb_num', function(e) {
		e.stopPropagation();
		if(userId) {
			var ts = $(this);
			if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {
				ts.css('background-image', 'url("../../Public/image/good.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) - 1)
				ts.attr('data-state', 'null');
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
						strategyId: ts.attr('data-id'),
						user_id: userId
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