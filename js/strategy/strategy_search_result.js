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