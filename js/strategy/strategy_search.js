$(function() {
	mui.plusReady(function(){
		plus.webview.currentWebview().setStyle({
            softinputMode: "adjustResize"  // 弹出软键盘时自动改变webview的高度
        });
	});
	$('body').on('input', 'input[type=text]', function() {
		$('.search_lists').children().remove()
		var content = $('.search_bar').val()
		if(content) {
			$.ajax({
				type: "get",
				url: config.data + "strategy/getStrategyGameNameByMsg",
				async: true,
				data: {
					msg: content
				},
				success: function(data) {
					$('.error').html("");
					if(data.state) {
						var gn = data.gameName;
						var div = '';
						console.log(JSON.stringify(gn));
						if(gn.length==0){
							var no_content = "<div class='no_content tac '>没有搜到任何内容</div>";
						    $('.search_lists').empty().append(no_content);
							return false;
						}
						for(var i = 0; i < gn.length; i++) {
							div +=
								"<div class='search_list' data-id='"+gn[i].id+"'>" 
								+"<div class='fl' style='margin:0 0.5rem 0 1rem;'>"+gn[i].game_name+" :"+"</div>"+
								"<div class='fl searchTitle' >" + gn[i].title + "</div>" +
								"</div>"
						}
						$('.search_lists').empty().append(div);
					} else {						
                        var no_content = "<div class='no_content tac '>没有搜到任何内容</div>";
						$('.search_lists').empty().append(no_content);
					}
				},
				error:function(){
					var errorHTML="<div style='margin-top:11rem'><img style='width:138px;height:180px;display:block;margin:0 auto;' src='../../Public/image/notonline.png' /></div>";
       	            $('.error').html(errorHTML);
				}
			});
		}
	})

	$("body").on('tap','.search_list',function(){
		$(".search_bar").blur();
		var msg = $(this).children('div').text();
		var id=$(this).attr("data-id");
		mui.openWindow({
			url:"strategy_details.html",
			id:"strategy_details.html",
			extras:{
				strategyId:id
			}
		});

	})
	

	
	
	$('body').on("tap",".search_img",function(){
		$(".search_bar").blur();
		var id = $('.search_list:first').attr("data-id");
	if (id) {
			mui.openWindow({
	url:"strategy_details.html",
			id:"strategy_details.html",
				extras:{
					strategyId:id
				}
			})
		} else{
			mui.toast("请输入内容")
		}
	})
	
})