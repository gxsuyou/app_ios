$(function() {
	$('body').on('input', 'input[type=text],.search_bar', function() {
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
					if(data.state) {
						var gn = data.gameName;
						var div = '';
						for(var i = 0; i < gn.length; i++) {
							div +=
								"<div class='search_list' data-id='"+gn[i].id+"'>" 
								+"<div class='fl' style='margin:0 0.5rem 0 1rem;'>"+gn[i].game_name+" :"+"</div>"+
								"<div class='fl searchTitle' >" + gn[i].title + "</div>" +
								"</div>"
						}
						$('.search_lists').empty().append(div);
					} else {

					}
				}
			});
		}
	})

	$("body").on('tap','.search_list',function(){
		var msg = $(this).children('div').text();
		var id=$(this).attr("data-id");
		mui.openWindow({
			url:"strategy_details.html",
			id:"strategy_details.html",
			extras:{
				strategyId:id
			}
		});
		
//			var msg = $(this).children('div').text();
//		mui.openWindow({
//			url:"strategy_search_result.html",
//			id:"strategy_search_result.html",
//			extras:{
//				msg:msg
//			}
//		})
	})
	
	$('body').on("tap",".search_img",function(){
		var id = $('.search_list:first').attr("data-id");
//		alert(msg);
//		return false;
		if (id) {
			mui.openWindow({
	url:"strategy_details.html",
			id:"strategy_details.html",
				extras:{
					strategyId:id
				}
			})
		} else{
			mui.toast("内容不能为空")
		}
	})
	
})