var ENV = "dev";
//测试环境
if(ENV == "dev") {
   //发开模式
	var config = {
		img: "http://img.oneyouxi.com.cn/",
		apk: "http://apk.oneyouxi.com.cn/",
		//	data:"http://192.168.0.207:8877/",
		data: "http://182.61.26.179:8877/",
		base64: "http://base64.oneyouxi.com.cn/",
		url_upload: "https://admin.oneyouxi.com.cn/",
		wgtUrl: "https://admin.oneyouxi.com.cn/www/test/IOS/H5BD8D7F0.wgt"
	}
}else{
	//正式模式
	var config = {
		img: "http://img.oneyouxi.com.cn/",
		apk: "http://apk.oneyouxi.com.cn/",
		data: "http://onetest.oneyouxi.com.cn/",
		base64: "http://base64.oneyouxi.com.cn/",
		url_upload: "https://admin.oneyouxi.com.cn/",
		wgtUrl: "https://admin.oneyouxi.com.cn/www/IOS/H5BD8D7F0.wgt"
	}
}



var userInfostr = window.localStorage.getItem("userInfo");
var userInfojson = eval('(' + userInfostr + ')');
if(userInfojson) {
	var userId = userInfojson.id
} else {
	var userId = 0
}

function activeBell() {
	if(userId) {
		$.ajax({
			type: "get",
			url: config.data + "news/getTip",
			async: true,
			data: {
				"userId": userId
			},
			success: function(data) {
				if(data.state == 1) {
					$(".bell").addClass("bell_active");
				} else {
					$(".bell").removeClass("bell_active");
				}
			}
		});
	}
}

var total_height;
var wgtVer = null;
var totalSize;

$(function() {
	mui.plusReady(function() {
		total_height = plus.navigator.getStatusbarHeight() + 45;
		$('.before_header').css({
			"height": total_height - 45 + "px",
			"width": "100%"
		});
		$('.header_box').next().css("margin-top", total_height + "px");

	

		// 下载wgt文件
//		function downWgt() {
//			var dtask = plus.downloader.createDownload(config.wgtUrl, {
//				method: 'GET',
//				data: '',
//				filename: "_doc/update/",
//				timeout: '3000',
//				retry: 0,
//				retryInterval: 0
//			}, function(d, status) {
//				if(status == 200) {
//					console.log("下载wgt成功：" + d.filename);
//					installWgt(d.filename); // 安装wgt包
//				} else {
//					console.log("下载wgt失败！");
//					plus.nativeUI.alert("下载wgt失败！");
//					hiddenUpload()
//				}
//				plus.nativeUI.closeWaiting();
//			})
//			dtask.addEventListener("statechanged", onStateChanged, false);
//			dtask.start();
//		}

		// 更新应用资源
//		function installWgt(path) {
//			//			plus.nativeUI.showWaiting("安装wgt文件...");
//			plus.runtime.install(path, {}, function() {
//				plus.nativeUI.closeWaiting();
//				//				console.log("安装wgt文件成功！");
//				plus.runtime.restart();
//				//				plus.nativeUI.alert("应用资源更新完成！", function() {
//				//					
//				//				});
//			}, function(e) {
//				plus.nativeUI.closeWaiting();
//				console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
//				plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
//				hiddenUpload()
//			});
//		}

//		function onStateChanged(download, status) {
//			//			console.log(JSON.stringify(download))
//			downloding(download)
//		}

//		function downloding(download) {
//			switch(download.state) {
//				case 0:
//					//			$(".ldownload_btn_text").text('等待');
//					break;
//				case 1:
//					//			$(".ldownload_btn_text").text('等待');
//					break;
//				case 2:
//					//			$(".ldownload_btn_text").text('等待');
//					break;
//				case 3:
//					//				loading((download.downloadedSize / download.totalSize * 100).toFixed(0))
//					loading((download.downloadedSize / totalSize * 100).toFixed(0))
//
//					break;
//				case 4:
//					//			$(".ldownload_btn_text").text("打开");
//					loading(0)
//					break;
//			}
//		}

//		function loading(num) {
//			if(num == 100) {
//				$(".progress-move").css("border-radius", "1rem")
//				hiddenUpload()
//			}
//			$(".progress-move").css("width", num + "%")
//			$(".progress-num").text("正在更新 " + num + "%")
//
//		}

	})
});