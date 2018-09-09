var newsId;
var page = 1;
var userId = localStorage.getItem("userId") || 22;
var commentId;
var targetCommentId;
var targetUserId;
var loginToggle = false;
mui.init({
	swipeBack: true, //启用右滑关闭功能
	pullRefresh: {
		container: ".news_post_commentContents", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		//			up: {
		//				height:50, //可选.默认50.触发上拉加载拖动距离
		//				auto:false, //可选,默认false.自动上拉加载一次
		//				contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
		//				contentnomore: '没有更多评论了', //可选，请求完毕若没有更多数据时显示的提醒内容；
		//				callback:up //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		//			}
		//		    down: {
		//				style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
		//				color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
		//				height: '50px', //可选,默认50px.下拉刷新控件的高度,
		//				range: '100px', //可选 默认100px,控件可下拉拖拽的范围
		//				offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
		//				auto:false, //可选,默认false.首次加载自动上拉刷新一次	,
		//				callback:down
		//			},
	}
});

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

		$('body').on('tap', '.comment_summary', function(e) {
			e.stopPropagation();
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

		//		点击发布结束

	})

})

toface()

function toface() {
	var face = [{
			src: "a_what.png",
			id: "<好奇怪>"
		}, {
			src: "alas.png",
			id: "<哎呀>"
		}, {
			src: "angry.png",
			id: "<怒>"
		},
		{
			src: "ass.png",
			id: "<屎>"
		}, {
			src: "bad_smile.png",
			id: "<坏笑>"
		}, {
			src: "beer_brown.png",
			id: "<棕啤>"
		}, {
			src: "beer_yellow.png",
			id: "<黄啤>"
		},
		{
			src: "black.png",
			id: "<黑头>"
		}, {
			src: "but.png",
			id: "<无奈>"
		}, {
			src: "butcry.png",
			id: "<无奈哭>"
		}, {
			src: "bye.png",
			id: "<再见>"
		}, {
			src: "cool.png",
			id: "<酷>"
		}, {
			src: "cry.png",
			id: "<哭>"
		}, {
			src: "cry_hand.png",
			id: "<手扶脸>"
		}, {
			src: "cry_smile.png",
			id: "<哭笑>"
		}, {
			src: "cut.png",
			id: "<可爱>"
		},
		{
			src: "dog.png",
			id: "<狗>"
		}, {
			src: "doughnut.png",
			id: "<甜甜圈>"
		}, {
			src: "duck.png",
			id: "<鸭子>"
		}, {
			src: "eat_wat.png",
			id: "<吃西瓜>"
		}, {
			src: "eee.png",
			id: "<额>"
		}, {
			src: "halo.png",
			id: "<晕>"
		}, {
			src: "heart.png",
			id: "<心>"
		}, {
			src: "heart_break.png",
			id: "<心碎>"
		}, {
			src: "impatine.png",
			id: "<不耐烦>"
		}, {
			src: "kiss.png",
			id: "<亲亲>"
		}, {
			src: "laugl.png",
			id: "<偷笑>"
		}, {
			src: "leaf.png",
			id: "<树叶>"
		}, {
			src: "lemon.png",
			id: "<柠檬>"
		}, {
			src: "notsobad.png",
			id: "<好无奈>"
		}, {
			src: "ooo.png",
			id: "<噢噢>"
		}, {
			src: "pig.png",
			id: "<猪>"
		}, {
			src: "punch_face.png",
			id: "<打脸>"
		}, {
			src: "rigid.png",
			id: "<僵硬>"
		}, {
			src: "see_smile.png",
			id: "<看坏笑>"
		}, {
			src: "she.png",
			id: "<喜欢>"
		},
		{
			src: "shine.png",
			id: "<闪耀>"
		}, {
			src: "shock.png",
			id: "<惊呆>"
		}, {
			src: "shutup.png",
			id: "<闭嘴>"
		}, {
			src: "shy.png",
			id: "<害羞>"
		}, {
			src: "sleep.png",
			id: "<睡觉>"
		}, {
			src: "slience.png",
			id: "<沉默>"
		}, {
			src: "split.png",
			id: "<吐>"
		}, {
			src: "strange.png",
			id: "<奇怪>"
		}, {
			src: "smile_big.png",
			id: "<大笑>"
		}, {
			src: "smile_little.png",
			id: "<害羞无奈>"
		}, {
			src: "soangry.png",
			id: "<超生气>"
		}, {
			src: "surprised.png",
			id: "<惊讶>"
		}, {
			src: "unhappy.png",
			id: "<不高兴>"
		}, {
			src: "wa.png",
			id: "<青蛙>"
		}, {
			src: "watermelon.png",
			id: "<西瓜>"
		}, {
			src: "what.png",
			id: "<啥>"
		}, {
			src: "wired.png",
			id: "<奇怪咯>"
		}, {
			src: "yes.png",
			id: "<好的>"
		}
	]
	var faceContent = ""
	face.forEach(function(item) {
		faceContent += "<img src='" + "../../Public/image/face/" + item.src + "' data-id='" + item.id + "' />"
	})
	$(".faceContent").append(faceContent)
}
var face_to = 1;
$("body").on("tap", ".face", function() {
	if(face_to == 1) {
		face_to = 0
		$(".faceContent").css("display", "block")
	} else {
		face_to = 1
		$(".faceContent").css("display", "none")
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

$("body").on("tap", ".faceContent>img", function(e) {
	e.stopPropagation()
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

function down() {
	window.location.reload();
	setTimeout(function() {
		mui('.news_allComments').pullRefresh().endPulldown(true);
	}, 1000);
}