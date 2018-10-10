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

	$('body').on("tap", ".loginout", function() {
	    window.localStorage.clear();
		mui.back()
		var p= plus.webview.getWebviewById("html/user/me.html");
		mui.fire(p,"reload")
	})

})

function clear() {
	plus.io.resolveLocalFileSystemURL(
		'_downloads/',
		function(entry) {
			entry.removeRecursively(function() {
				mui.toast('删除成功');
			});
		},
		function(e) {
			mui.toast('获取io操作对象失败');
		}
	)

}