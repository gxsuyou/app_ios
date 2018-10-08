var subpages = ['html/news/news.html', 'html/game/game_recommend.html', 'html/strategy/strategy.html', 'html/play/play.html', 'html/user/me.html'];

var Index = 0;
var newVer;
//把子页的路径写在数组里面
var activeTab = subpages[Index];
//选项卡点击事件
var self;
mui.plusReady(function() {

	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	var totalSize, newVer;

	function plusReady() {
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			wgtVer = inf.version;
			console.log("当前应用版本：" + wgtVer);
			//	检测更新
			$.ajax({
				type: "get",
				url: config.data + "h5/updateIos",
				async: true,
				success: function(data) {
					if(data.state) {
						newVer = data.mark
						totalSize = data.totalSize
						if(wgtVer && newVer && (wgtVer != newVer)) {
//													if(wgtVer && newVer) {

							showUpload() //展示
						} else {
							//plus.nativeUI.alert("无新版本可更新！");
						}
					} else {
						console.log("检测更新失败！");
						plus.nativeUI.alert("检测更新失败！");
					}
				}
			});
		});
	}
    
    
    function showUpload() {

		var download_wgt = null
		var href = "./html/user/upload.html";

		if(download_wgt) { // 避免快速多次点击创建多个窗口  
			return;
		}
		download_wgt = plus.webview.create(href, "upload.html", {
			width: '100%',
			height: '100%',
			top: 0,
			zindex: 0,
			opacity: 1,
			background: 'transparent',
			scrollIndicator: 'none',
			scalable: false,
			popGesture: 'none',
		}, {
			info: {
				totalSize:totalSize,
			}
		});
		
	
		download_wgt.addEventListener("loaded", function() {
			download_wgt.show('fade-in', 0);
		}, false);

		plus.webview.getLaunchWebview().setStyle({
			mask: "rgba(0,0,0,0.5)",
		});
	}






	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");
	var h1 = plus.webview.getLaunchWebview()
	var height = document.documentElement.clientHeight || document.body.clientHeight;
	window.onresize = function() {
		if(plus.webview.getWebviewById('html/play/play.html')) {

			var heightView = document.documentElement.clientHeight || document.body.clientHeight;
			if(heightView < height) {
				//			plus.webview.currentWebview().setStyle({
				//				height: height
				//			});
				////			//修改父页面高度的时候，也要修改子页面的高度  因为子页面距离父页面底部始终是51px  所以这里只需要用父页面的高度减去51px,就是子页面的高度

				plus.webview.getWebviewById('html/play/play.html').setStyle({
					height: (heightView)
				});
				$('#footer').addClass('hidden')
			} else {
				$('#footer').removeClass('hidden')
				plus.webview.getWebviewById('html/play/play.html').setStyle({
					height: (height - 50)
				});
			}
		}
	}

	//	window.addEventListener('toIndex', function(event) {
	//		// mui.fire()传过来的额外的参数，在event.detail中；
	//		var detail = event.detail;
	//		// var param = detail.param;
	//		// 执行相应的ajax或者操作DOM等操作
	//		console.log(name)
	//	});
	//获取当前页面所属的Webview窗口对象
	self = plus.webview.currentWebview();
	var sub = plus.webview.create(
		subpages[0], //子页url
		subpages[0], //子页id
		{
			top: '0px', //设置距离顶部的距离
			bottom: '50px' //设置距离底部的距离
		}
	);
	self.append(sub);

	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var index = $(this).index();

		//获取目标子页的id
		var h = plus.webview.getWebviewById(subpages[index]) //有东西后就不create了

		console.log(plus.webview.getWebviewById(subpages[index]))
		document.getElementsByClassName("mui-icon")[1].classList.remove('game_active');
		document.getElementsByClassName("mui-icon")[0].classList.remove('news_active');
		document.getElementsByClassName("mui-icon")[2].classList.remove('strategy_active');
		document.getElementsByClassName("mui-icon")[3].classList.remove('play_active');
		document.getElementsByClassName("mui-icon")[4].classList.remove('me_active');
		this.children[0].classList.add(this.getAttribute('data-img'));
		var targetTab = this.getAttribute('data-href');

		if(targetTab == activeTab) {
			return;
		}

		if(!h) {
			var sub = plus.webview.create(
				subpages[index], //子页url
				subpages[index], //子页id
				{
					top: '0px', //设置距离顶部的距离
					bottom: '50px' //设置距离底部的距离
				}
			);
			self.append(sub);
		}
		//更换标题
		//	    title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		plus.webview.show(targetTab);
		//隐藏当前选项卡
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;

	});

	mui.back = function() {
		return false;
	}

});