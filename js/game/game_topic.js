var subjectId;
$(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		subjectId = self.subjectId;
		$.ajax({
			type: "get",
			url: config.data + "game/getSubjectById",
			async: true,
			data: {
				subjectId: subjectId,
				sys: 1,
				page: 1
			},
			success: function(data) {
				if(data.state) {
					var sub = data.subject;
					$('.game_topicsHeadimg').css('background-image', 'url(' + config.img + encodeURI(sub.img) + ')');			
					$('.game_topicsHeadart').text(sub.detail);				
				} else {

				}
			}
		});
		
		
	})
	$('body').on('tap','.game_topicsContent',function(){
		//alert(1);
		mui.openWindow({
			url:"game_detail.html",
			id:"game_detail.html",
			extras:{
				gameId:$(this).attr('data-id')
			}
		})
	})
})