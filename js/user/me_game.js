var game = 1;
$(function(){
	$('body').on("tap",".me_gameNav > span",function(){
		var t =$(this)
		t.css('border-bottom','2px solid #7fddde').addClass('color_green').siblings('span').css('border-bottom','1px solid #E6EBEC').removeClass('color_green')
		
		$("."+t.attr("data-class")).removeClass('hidden')
		$("."+t.siblings('span').attr("data-class")).addClass('hidden')
		
	})
	
	$('.me_gameNav').children('span').eq(0).click(function(){
		$('.game_lists').removeClass('hidden');
		$('.now_game').addClass('hidden').children().remove();
		page = 0;
		game = 1;
		mui('.me_gameContents').pullRefresh().refresh(true);
		up();		
	})
	
	$('.me_gameNav').children('span').eq(1).click(function(){
		$('.now_game').removeClass('hidden');
		$('.game_lists').addClass('hidden').children().remove();
		page = 0;
		game = 0;
		mui('.me_gameContents').pullRefresh().refresh(true);
		up();		
	})
	
	$('body').on('tap','.game_list',function(){
		mui.openWindow({
			url:"../game/game_detail.html",
			id:"../game/game_detail.html",
			extras:{
				gameId:$(this).attr('data-id')
			}
		})
	})
	

	$('body').on('longtap','.me_li',function() {
		var id  = $(this).attr('coll-id');
		var btnarr = ["确定", "取消"];
		mui.confirm("你确定删除即玩小游戏吗？", "操作提示", btnarr, function(e){		
			if(e.index == 0) {
				$.ajax({
					type:"get",
					url:config.data+"users/getDelCollect",
					async:true,
					data:{
						id:id
					},
					success:function(data){
						if (data.state) {
							mui.alert("删除成功！", "操作提示", "确定");
							getH5();
						} else{
							mui.alert("删除失败！", "操作提示", "确定");
						}
					}
				});
				
			} else {
				
			}
		});
	})

	
	
	
})