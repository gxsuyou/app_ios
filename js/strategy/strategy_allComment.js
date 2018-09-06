var commentId;
var firstUserid;
var target_img;
var target_title;
var strategyId;
var ajaxToggle = false;
var page = 0;
$(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
		var self = plus.webview.currentWebview();
		commentId = self.commentId;
		target_img = self.target_img;
		target_title = self.target_title;
		strategyId = self.strategyId;
		mui.init({
			swipeBack: true,
			gestureConfig: {
				tap: true, //默认为true
				doubletap: true, //默认为false
				longtap: true, //默认为false
			},
			beforeback: function() {
				var list = plus.webview.getWebviewById("strategy_details.html"); //对游戏首页
				mui.fire(list, 'refresh');
				return true; //返回true,继续页面关闭逻辑			        
			},
			pullRefresh: {
				container: ".strategy_all", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				//				up: {
				//					height: 50, //可选.默认50.触发上拉加载拖动距离
				//					auto: true, //可选,默认false.自动上拉加载一次
				//					contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
				//					contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
				//					callback: up //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				//				},
				//				down: {
				//					style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
				//					color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
				//					height: '50px', //可选,默认50px.下拉刷新控件的高度,
				//					range: '100px', //可选 默认100px,控件可下拉拖拽的范围
				//					offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
				//					auto: false, //可选,默认false.首次加载自动上拉刷新一次
				//					callback: down //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				//				}
			}

		})

		$('body').on('longtap', 'img', function() {
			var picurl = $(this).attr("src");
			saveImg(picurl);
		});

		$.ajax({
			type: "get",
			url: config.data + "strategy/getCommentById",
			async: true,
			data: {
				commentId: commentId
			},
			success: function(data) {
				if(data.state) {
					var com = data.comment,
						portrait;
					firstUserid = com.user_id;
					if(com.portrait == 0 || com.portrait == null) {
						portrait = "../../Public/image/morentouxiang.png";
					} else {
						portrait = com.portrait;
					}

					$('.comment_user').text(com.nick_name);
					$('.comment_content').html(com.content);
					if(com.img) {
						$('.allCom_img').attr('src', config.img + encodeURI(com.img))
						$(".allCom_img").attr("data-preview-src", "")
						$(".allCom_img").attr("data-preview-group", "1")
					} else {
						$('.allCom_img').addClass('hidden')
					}

					$('.comment_summary').attr('data-id', com.targetid);

					if(com.strategy_img) {
						$('.comment_summary_img').css('background-image', 'url(' + config.img + encodeURI(strategy) + ')')
					} else {
						$('.comment_summary_img').css('background-image', 'url(../../Public/image/link.png)')
					}
					$('.comment_summary_art').text(com.target_title)
					$('.date').text(com.add_time);

					$('.news_post_commentContent_head').css("background-image", "url(" + encodeURI(portrait) + ")")
					/* 初始化执行一次 */
					up();

				} else {

				}
			}
		});

		$('body').on('tap', '.comment_summary', function() {
			var strategyId = $(this).attr('data-id');
			mui.openWindow({
				url: "strategy_details.html",
				id: "strategy_details.html",
				createNew: true,
				extras: {
					strategyId: strategyId
				}
			})
		})
		$("body").on("focus", ".news_secondComment_input", function() {
			setTimeout(function() {
				var scrollY = $('.strategy_all').height()
				$('.strategy_all').animate({
					scrollTop: scrollY
				}, 0)
			}, 400);
		})
		//滚动触发
		$(".strategy_all").scroll(function() {
			var height = $(this).height();
			var scrollHeight = $(this)[0].scrollHeight;
			var scrollTop = $(this).scrollTop();
			if(scrollTop / (scrollHeight - height) >= 0.65) {
				up();
			}
		})

		$("body").on("tap", ".comment_dele", function() {
			var id = $(this).attr("data-id")
			plus.nativeUI.confirm("删除评论", function(e) {
				if(e.index == 0) {
					$.ajax({
						type: "get",
						url: config.data + "strategy/delMyComment",
						async: true,
						data: {
							uid: userId,
							id: id
						},
						success: function(data) {
							if(data.state == 1) {
								mui.toast("删除成功")
								window.location.reload()
							} else {
								mui.toast("删除失败")
							}
						}
					})
				}
			})
		})

		//发表评论       
		$('body').on("tap", ".publish", function() {
			var content = $(this).siblings('.news_secondComment_input').val();
			if(content) {
				$.ajax({
					type: "get",
					url: config.data + "strategy/strategyComment",
					async: true,
					data: {
						userId: userId,
						content: content,
						targetCommentId: commentId,
						targetUserId: firstUserid,
						series: 2,
						target_img: target_img,
						targetid: strategyId,
						target_title: target_title
					},
					success: function(data) {
						if(data.state) {
							mui.toast("发送成功");
							window.location.reload();
						} else {
							mui.toast("发送失败，请重试")
						}
					}

				});
			} else {
				mui.toast("发送内容不能为空")
			}
		})

	})
})

function up() {
	if(ajaxToggle) {
		return false;
	}
	page++;
	ajaxToggle = true;
	$.ajax({
		type: "get",
		url: config.data + "strategy/getStrategyCommentTowByPage",
		async: true,
		data: {
			commentId: commentId,
			page: page
		},
		success: function(data) {
			if(data.state) {
				ajaxToggle = false;
				var c = data.comment;
				var div = '';
				for(var i = 0; i < c.length; i++) {

					if(c[i].targetUserNickName) {
						var ifHide = "ifHide"
					} else {
						var ifHide = "hidden"
					}
					if(c[i].portrait == 0 || c[i].portrait == null) {
						portrait = "../../Public/image/morentouxiang.png";
					} else {
						portrait = c[i].portrait;
					}

					if(c[i].user_id == userId) {
						var comment_dele = "<div class='font_12 fl color_7fcadf comment_dele' data-id='" + c[i].id + "'>删除</div>"
					} else {
						var comment_dele = "&nbsp;"
					}

					console.log(c[i].user_id)

					div +=
						"<div class='news_post_commentContentsec ofh' style='border-top: 1px solid #e6ebec;margin-top: 0;border-bottom: 0;' data-id='" + c[i].id + "'>" +
						"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");'></div>" +
						"<div class='news_post_commentContent_content fl'>" +
						"<div class='comment_user font_12'>" +
						"<span>" + c[i].selfNickName + "</span>" +
						//						"<span class='" + ifHide + "' style='color: #7A7A7A;'>回复</span>" +
						//						"<span class='" + ifHide + "'>" + c[i].targetUserNickName + "</span>" +
						"</div>" +
						"<div class='comment_content font_14'>" + c[i].content + "</div>" +
						"<div class='comment_info ofh'>" +
						"<div class='font_12 color_9e9e9e fl'>" + c[i].add_time + "</div>" +
						comment_dele +
						"</div>" +
						"</div>" +
						"</div>"
				}
				$('.news_post_commentContentsecs').append(div);

				var num = $(".news_post_commentContentsecs>div").length;

				$(".news_allReply").text("全部回复 ( " + num + " )");

				if(c.length < 10) {
					ajaxToggle = true;
					$(".bottomInfo").text("无更多评论");
				} else {
					//mui('.strategy_all').pullRefresh().endPullupToRefresh(false);
				}
			} else {

			}
		}
	});
}

function down() {
	window.location.reload();
	setTimeout(function() {
		mui('.strategy_all').pullRefresh().endPulldown(true);
	}, 1000);

}

$('body').on('tap', '.mui-preview-header', function() {
	var num = $(".mui-preview-indicator").text();
	num = num.substring(0, 1) - 1;
	var url = $(".mui-preview-image img:eq(" + num + ")").attr("src");
	saveImg(url);
})

function saveImg(picurl) {
	var picname;
	var btnArray = ['否', '是'];
	mui.confirm('是否保存该图片？', 'ONE', btnArray, function(e) {
		if(e.index == 1) {

			if(picurl.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
			{
				picname = picurl.substring(picurl.lastIndexOf("/") + 1, picurl.length);
			} else {
				picname = picurl;
			}
			savePicture(picurl, picname)
		}
	});

}

function savePicture(picurl, picname) {
	// 创建下载任务
	var dtask = plus.downloader.createDownload(picurl, {}, function(d, status) {
		// 下载完成
		if(status == 200) {
			plus.gallery.save(d.filename, function() {
				mui.toast('保存成功');
			}, function() {
				mui.toast('保存失败，请重试！');
			});
		} else {
			alert("Download failed: " + status);
		}

	});
	//dtask.addEventListener( "statechanged", onStateChanged, false );
	dtask.start();

}