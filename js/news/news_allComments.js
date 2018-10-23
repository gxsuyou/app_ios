var newsId;
var page = 1;
var userId = localStorage.getItem("userId") || 22;
var commentId;
var targetCommentId;
var targetUserId;
var loginToggle = false;
face_contents.get()
mui.init({
	swipeBack: true, //启用右滑关闭功能
	beforeback: function() {　　　　 //获得父页面的webview
		var list = plus.webview.getWebviewById('news_post.html'); //触发父页面的自定义事件(refresh),从而进行刷新	
		mui.fire(list, 'refresh');//返回true,继续页面关闭逻辑		
		return true;
	}
})
$(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
		var self = plus.webview.currentWebview();
		newsId = self.newsId;
		commentId = self.commentId;
		targetUserId = self.targetUserId;
		firstImg = self.firstImg;
		title = self.title;
		//		获取一级评论
		up();
		$.ajax({
			type: "get",
			url: config.data + "news/getCommentById",
			async: true,
			data: {
				"commentId": commentId
			},
			success: function(data) {
				if(data.state) {
					var c = data.comment;
					if(c.portrait == 0 || c.portrait == null) {
						portrait = "../../Public/image/morentouxiang.png";
					} else {
						portrait = c.portrait;
					}
					$('.news_post_commentContent_head').eq(0).css('background-image', "url(" + encodeURI(portrait) + ")")
					$('.news_post_commentContent').attr("data-id", c.id);
					$('.news_post_commentContent').attr("data-userId", c.user_id);
					$('.comment_userOne').text(c.nick_name);
					$('.comment_contentOne').html(c.content);
					$('.timeOne').text(c.add_time);
					$('.comment_summary').attr('data-id', c.newsid);
					if(c.news_img) {
						$('.comment_summary_img').css('background-image', 'url(' + config.img + encodeURI(c.news_img) + ')')
					} else {
						$('.comment_summary_img').css('background-image', 'url(../../Public/image/link.png)')
					}
					$('.comment_summary_art').text(c.news_title)
					targetCommentId = $('.news_post_commentContent').attr("data-id");
					targetUserId = $('.news_post_commentContent').attr("data-userId");
				} else {

				}
			}

		});

		$(".news_post_commentContents").scroll(function() {
			var height = $(this).height();
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(this)[0].scrollHeight;
			//到底部执行
			if(scrollTop / (scrollHeight - height) >= 0.82) {
				up();
			}
		})

		$('body').on('tap', '.comment_summary', function() {
			var newsId = $(this).attr('data-id');
			mui.openWindow({
				url: "news_post.html",
				id: "news_post.html",
				createNew: true,
				extras: {
					newsId: newsId,
				}
			});
		})

		$("body").on("tap", ".comment_dele", function() {
			var id = $(this).attr("data-id")
			plus.nativeUI.confirm("删除评论", function(e) {
				if(e.index == 0) {
					$.ajax({
						type: "get",
						url: config.data + "news/delMyComment",
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

		//点击发布
		$('body').on("tap", ".publish", function() {
			var content = $(this).prev().prev().val();
			if(content) {
				$.ajax({
					type: "get",
					url: config.data + "news/comment",
					async: true,
					data: {
						"targetCommentId": targetCommentId,
						"userId": userId,
						"series": 2,
						"content": content,
						"targetUserId": targetUserId,
						"news_img": firstImg,
						"newsid": newsId,
						"news_title": title
					},
					success: function(data) {
						if(data.state == "1") {
							mui.toast("评论成功")
							$('.news_secondComment_input').val("")
							window.location.reload()
						} else {
							mui.toast("失败")
						}
					}
				});
			} else {
				mui.toast("发送内容不能为空")
			}

		})

		//点击发布结束

		$("body").on("tap", ".faceContent>div", function(e) {
			e.preventDefault()
			var str = $(this).attr("data-id")
			var tc = document.querySelector(".news_secondComment_input")
			var tclen = tc.value.length;
			tc.focus()
			if(typeof document.selection != "undefined") {
				document.selection.createRange().text = str;
			} else {
				tc.value = tc.value.substr(0, tc.selectionStart) + str + tc.value.substring(tc.selectionStart, tclen);
			}
		})

	})

})

var face_to = 1;
$("body").on("tap", ".face", function() {
	if(face_to == 1) {
		face_to = 0
		$(".faceContent").css("display", "block")
		$(".news_post_commentContents").css("padding-bottom", "12.2rem")
	} else {
		face_to = 1
		$(".faceContent").css("display", "none")
		$(".news_post_commentContents").css("padding-bottom", "4rem")
	}
})

//$("body").on("focus", ".news_secondComment_input", function() {
//	setTimeout(function() {
//		var scrollY = $('.news_post_commentContents').height()
//		$('.news_post_commentContents').animate({
//			scrollTop: scrollY
//		}, 0)
//	}, 400);
//})

//获取二级评论
function up() {
	if(loginToggle) {
		return false;
	}
	loginToggle = true;
	$.ajax({
		type: "get",
		url: config.data + "news/getNewsCommentTowByPage",
		async: true,
		data: {
			"parentId": commentId,
			"page": page
		},
		success: function(data) {
			loginToggle = false;
			page++;
			if(data.state) {
				var com = data.comment;
				var div = "";
				var portrait;
				for(var i = 0; i < com.length; i++) {
					var ifHidden = com[i].targetUserNickName || "hidden";
					if(com[i].portrait == 0 || com[i].portrait == null) {
						portrait = "../../Public/image/morentouxiang.png";
					} else {
						portrait = com[i].portrait;
					}

					if(com[i].user_id == userId) {
						var comment_dele = "<div class='font_12 fl color_7fcadf comment_dele' data-id='" + com[i].id + "'>删除</div>"
					} else {
						var comment_dele = "&nbsp;"
					}

					div +=
						"<div class='news_post_commentContent ofh' style='border-top: 1px solid #e6ebec;margin-top: 0px;border-bottom: 0;' data-id='" + com[i].id + "' data-userId='" + com[i].selfUserId + "' >" +
						"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");'></div>" +
						"<div class='news_post_commentContent_content fl'>" +
						"<div class='comment_user font_12'>" +
						"<span>" + com[i].selfNickName + "</span>" +
						"</div>" +
						"<div class='comment_content font_14'>" + com[i].content + "</div>" +
						"<div class='comment_info ofh'>" +
						"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
						comment_dele +
						"</div>" +
						"</div>" +
						"</div>"
				}

				$('.news_post_secondcommentContents').append(div);
				var nu = $(".news_post_commentContent").length - 1;

				//数据量
				$(".news_allReply").text("全部回复  ( " + nu + " )");
				if(com.length < 10) {
					$(".bottomInfo").text("没有更多的评论了");
					loginToggle = true;
					//						mui('.news_post_commentContents').pullRefresh().endPullupToRefresh(true);	
				} else {
					//						mui('.news_post_commentContents').pullRefresh().endPullupToRefresh(false);				
				}
			} else {

			}
		}
	});

	//		获取二级评论结束
}

//function down() {
//	window.location.reload();
//	setTimeout(function() {
//		mui('.news_allComments').pullRefresh().endPulldown(true);
//	}, 1000);
//}