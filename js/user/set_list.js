$(function() {
	mui.plusReady(function() {
		$('.set_lists > ul >li:eq(1)').click(function() {
			
			clear()
		})
	})
	
	
	//	若要获得当前开关状态，可通过判断当前开关控件是否包含.mui-active类来实现，若包含，则为打开状态，否则即为关闭状态；如下为代码示例：

//	var isActive = document.getElementById("mySwitch").classList.contains("mui-active");
//	if(isActive) {
//		console.log("打开状态");
//	} else {
//		console.log("关闭状态");
//	}

	$('.set_lists > ul >li:first').click(function() {
		mui.openWindow({
			url: "profile.html",
			id: "profile.html"
		})
	})

	


	$('body').on("tap",".loginout",function() {
		window.localStorage.clear();
//		         alert(1)
//		         return false;
//		plus.webview.close(plus.webview.getWebviewById("H5C62934A"), "none");
		//		plus.webview.close(plus.webview.getWebviewById("HBuilder"),"none");

		//							plus.webview.getWebviewById("html/game/game.html").close();
		//							plus.webview.getWebviewById("html/store/store.html").close();
		//							H5D2B2392 plus.webview.getWebviewById("html/user/me.html").close(); 
	    plus.webview.close("html/user/me.html");
        plus.webview.close("html/news/news.html");
        plus.webview.close("html/game/game_recommend.html");
        plus.webview.close("html/strategy/strategy.html");
        plus.webview.close("html/play/play.html");
                           
                           
		
		mui.openWindow({
			url: '../../index.html',
			id: 'H5C62934A',
			//id:'HBuilder',
			createNew: true
		});
//        	self = plus.webview.currentWebview();
//	                        var sub = plus.webview.create(
//		                        "../../index.html", //子页url
//		                        "../../index.html", //子页id
//		                        {
//			                       top: '0px', //设置距离顶部的距离
//			                       bottom: '0px' //设置距离底部的距离
//		                         }
//	                        );
//	                        self.append(sub);
	         


	})


})



function clear(){
	plus.io.resolveLocalFileSystemURL(
	    '_downloads/',
          function(entry){
	        entry.removeRecursively(function(){
		    mui.toast('删除成功');
		});
	    },
	    function(e){mui.toast('获取io操作对象失败');}
	)		
			
}
