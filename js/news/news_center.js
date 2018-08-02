$(function(){
	mui.plusReady(function() {
		$.ajax({
			type: "get",
			url: config.data + "news/cancelMessage",
			async: true,
			data: {
				userId: userId
			},
			success: function(data) {
				if(data.state) {
		
				} else {
		
				}
			}
		});
		
		$('.nav').css('top',total_height);	
		$('body').on("tap",".nav > div",function(){
			var selfSort = $(this).attr('data-sort');
			$(this).addClass('active').siblings('div').removeClass('active');
			$('.notice_lists').children().remove();
			mui('.news_center').pullRefresh().refresh(true);
			page = 0;
			sort = selfSort;
			up();		
		});
		
		
		$('body').on('tap','.notice_list',function(){
			var type = $(this).attr("data-type");
			var commentId = $(this).attr("data-id");
			var url;
			alert(type);
//			return false;
			if (type == 1) {
				url = "news_allComments.html"
			}
			else if(type == 2){
				url = "../strategy/strategy_allComments.html"
			}
			else{
				url = "../game/game_allComments.html"
			}
			
			mui.openWindow({
				url:url,
				id:url,
				extras:{
					commentId:commentId
				}
			})
		})
	})
})
