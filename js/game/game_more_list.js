var gameId;
var gameName;
$(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		gameId = self.gameId;
		gameName = self.gameName + "标签";
		$('.game_nameHeader').text(gameName);

		$.ajax({
			type: "get",
			url: config.data + "game/getGameById",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				var g = data.gameDetail
				var tag_list = ""
				if(g.tagList) {
					var t = g.tagList.split(',')
					var Id = g.tagId.split(",")
   
	                for(var i = 0; i < t.length; i++) {
						tag_list+="<li class='game_list color_7a7a7a' data-tagid='"+Id[i]+"'>" +
						  "<div>"+t[i]+"</div>"+
						  "<div class='mui-icon mui-icon-forward mui-pull-right'></div>"+
						"</li>"
					}

					$('.game_lists').empty().append(tag_list)

				}
			}
		})

	})
    /*mui.plusReady结束*/
    
    $("body").on("tap",".game_list",function(){
        var tagId = $(this).attr("data-tagid")
		var tagName = $(this).children("div:first-child").text()
		mui.openWindow({
			url: "game_classify_list.html",
			id: "game_classify_list.html",
			extras: {
				tagId: tagId,
				tagName: tagName
			}
		})
    })
    
})