var tu_id = null;
mui.plusReady(function() {

	var n = plus.webview.currentWebview();
	tu_id = n.tu_id
	var gameId = n.game_id
	var packagename;
	var hasno
	initGame()

	function initGame() {
		if(gameId == undefined) {
			$(".me_voulan").html("<span class='chooseOneGame' style='color:#282828'>选择要使用的游戏</span><span  style='font-size:16px;color:#c9c9c9;font-weight:600;margin-left:auto;margin-right:10%;' class='mui-icon mui-icon-arrowright chooseOneGame'></span>")
			return false;
		}

		if(n.onerankchoose == "choose") {
			$(".me_voulan").append("<span class='chooseOneGame' style='margin-left:auto;margin-right:10%;font-size:12px;color:#c9c9c9;'  >更换游戏<span  class='mui-icon mui-icon-arrowright ' style='font-weight:600;font-size:16px;margin-left:-0.1rem' ></span></span>")
		}

		$.ajax({
			type: "get",
			url: config.data + "game/getGameById",
			async: true,
			data: {
				gameId: gameId,
				sys: 2
			},
			success: function(data) {

				var game = data.gameDetail;
				packagename = game.game_packagename
				hasno = plus.runtime.isApplicationExist({
					pname: game.game_packagename,
					action: ''
				})
			}
		})
	}

	$(".me_voulan>img").attr("src", n.icon_href)
	$(".me_voulan>span:first-of-type").text(n.game_name)
	var mask = mui.createMask(function() {
        $(".me_downcontents").css("display", "none")
	}); //callback为用户点击蒙版时自动执行的回调；
	$("body").on("tap", ".me_tochar", function() {

		if(hasno == false) {
			mask.show() //"下载游戏"
			 $(".me_downcontents").css("display", "block")
			return false
		}

		var playerId = $(".playerId").val()
		var phoneNum = $(".phoneNum").val()
		var playDir = $(".playDir").val()
		if(playerId == "" || phoneNum == ""){
			mui.toast("请输入必要信息")
			return false;
		}
		if(phoneNum.length > 15) {
			mui.toast("请输入准确号码")
			return false;
		}
         
		if(gameId == undefined) {
			return false;
		}
		$.ajax({
			type: "post",
			url: config.data + "game/getUseTicket",
			async: true,
			data: {
				uid: userId,
				tu_id: tu_id,
				game_user: playerId,
				game_area: playDir,
				tel: phoneNum
			},
			success: function(data) {
				if(data.state == 1) {
					mui.toast("提交，正在审核中。")
					setTimeout(function() {
						
						if(plus.os.name == "Android") {
							plus.runtime.launchApplication({
								pname: packagename,
								extra: {
									//									url: "http://www.html5plus.org"
								}
							}, function(e) {
								//								installApp('_downloads/' + game.game_name + '.apk')
							});
						}
						back()
					}, 2000)
				}
			}
		})

	})

	$("body").on("tap", ".me_downgo", function() {
		mui.openWindow({
			url: '../../html/game/game_detail.html',
			id: 'game_detail.html',
			extras: {
				gameId: gameId
			}
		})
	})
	$("body").on("tap", ".me_downclose", function() {

		mask.close(); //关闭遮罩
		$(".me_downcontents").css("display", "none")
	})

	$("body").on("tap", ".chooseOneGame", function() {
		mui.openWindow({
			url: "me_commonvoucherchoose.html",
			id: "me_commonvoucherchoose.html",
			extras: {
				tu_id: tu_id
			}
		})
	})

    mui.back = function(){
    	back()
    }

    $("body").on("tap",".mui-action",function(){
       back()
    })
     
     function back(){
     	 var list = plus.webview.getWebviewById("me_voucher.html");
        mui.fire(list, 'reload');
    	mui.openWindow({
    		url:"me_voucher.html",
    		id:"me_voucher.html"
    	})
     }

})