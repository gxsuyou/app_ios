var icon;
var gameName;
var gameId;
var gameComment = false;
var gameStrategy = false;
var commentModule = false;
var userId = localStorage.getItem("userId");
var game;
var gameImg;
$(function() {
	mui.plusReady(function() {
		mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
		$('.header_box').next().css("margin-top", 0 + "px");
		$('.backImg').css("top", total_height - 36.5 + "px");
		var self = plus.webview.currentWebview();
		gameId = self.gameId;

		$('body').on('tap', '.game_relatedInfocontent', function() {
			mui.openWindow({
				url: "../news/news_post.html",
				id: "../news/news_post.html",
				extras: {
					newsId: $(this).attr('data-id'),
					gameId: gameId
				}
			})
		})

		//相关资讯结束

		//相关评论结束

		$('body').on('tap', '.game_similarContent', function() {
			mui.openWindow({
				url: 'game_detail.html',
				id: 'game_detail.html',
				extras: {
					gameId: $(this).attr('data-id')
				},
				createNew: true //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			})
		})

		//		相关游戏结束

		$('body').on("tap", ".goToscore", function() {
			if(localStorage.getItem("userId")) {
				mui.openWindow({
					url: "game_score.html",
					id: "game_score.html",
					extras: {
						gameId: gameId,
						icon: icon,
						gameName: gameName,
						game_icon: gameImg
					}
				})
			} else {
				mui.openWindow({
					url: "../user/login.html",
					id: "../user/login.html"
				})
			}

		})

		//详情页 点击

		$('body').on("tap", ".game_detail_detail", function() {
			detail_main()
			pageIndex = "detail";
			commentModule = false;
			//			mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
			$(this).addClass('game_detail_detail_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_assess_active').removeClass('game_detail_strategy_active')
			$('.game_detail_details').removeClass('hidden').siblings('div').addClass('hidden');

		})

		//详情页结束

		//评论页开始

		$('body').on("tap", ".game_detail_assess", function() {
			mui('#game_detailContent').pullRefresh().enablePullupToRefresh();
			detail_assess();
		});

		//		评论页结束		

		//		攻略页开始
		$('body').on("tap", ".game_detail_strategy", function() {

			detail_strategy();
		});

		$("body").on("tap", ".download", function() {
			addDownNum()
			if(game.game_download_ios !== null) {
				location.href = game.game_download_ios;
			} else {
				location.href = game.game_download_ios2;
			}
		})

		//		攻略页结束
		$("body").on("tap", "#game_detail_download", function(ev) {
//			if(!userId) {
//				mui.openWindow({
//					url: '../user/login.html',
//					id: 'login.html'
//				})
//				return false;
//			}
			event = ev || window.event;
			event.stopPropagation();
			var t = $(this);
			var isFile = false;

			addMyGame() //添加首席收藏
			addDownNum() //增加下载量

			if(String(game.game_download_ios) != "null") {
				location.href = game.game_download_ios;
				return false;
			} else {
				location.href = game.game_download_ios2;
				setTimeout(function() {
					mui.toast("正在安装，请按Home键在桌面查看", {
						duration: "long"
					});
					setTimeout(function() {
						$('.download_btn').css({
							"border": "1px solid #8ed8ed",
							"color": "#8ed8ed",
							"background": "#fff"
						});
						$('.download_btn_text').text("刷新");
						$("#game_detail_download").attr("id", "reload");
					}, 3800);
				}, 3000)
				return false;
			}
		});

		function addMyGame() {
			if(userId) {

				$.ajax({
					type: "get",
					url: config.data + "game/addMyGameIos",
					async: true,
					data: {
						gameId: gameId,
						userId: userId,
						sys: 1
					},
					success: function(data) {
						if(data.state) {

						} else {

						}
					}
				});
			}
		}

		/* 增加下载数量 */
		function addDownNum() {
			$.ajax({
				type: "get",
				url: config.data + "game/addDownloadNum",
				async: true,
				data: {
					id: self.gameId
				},
				success: function(data) {
					if(data.state) {
						$("#game_msg_install").text(parseInt($("#game_msg_install").text()) + 1 + "次下载");

					}
				}
			});
		}

		$('body').on('tap', '#reload', function() {
			window.location.reload();
		});

	})

	$('body').on('tap', '.strategy_content_classify', function(e) {
		e.stopPropagation()
		var msg = $(this).text();
		mui.openWindow({
			url: "../strategy/strategy_search_result.html",
			id: "strategy_search_result.html",
			extras: {
				msg: msg
			}
		})
	})

	$('body').on('longtap', '.mui-slider-item img', function() {
		var picurl = $(this).attr("src");
		saveImg(picurl);
	});

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

	function savePicture(picurl) {
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
		dtask.start();
	}

	$('body').on("tap", ".backImg", function() {
		mui.back();
	})

	$('.comment_content').each(function() {
		var maxWidth = 10;
		if($(this).text().length > maxWidth) {
			$(this).text($(this).text().substring(0, maxWidth));
			$(this).html($(this).html() + "<span class='color_green' style='margin-left:0.2rem;' >详细</span>")
		}
	})

	$(window).scroll(function() {
		var $body = $('body');
		var windowWidth = $(window).width();
		var imgHeight = (0.66 * windowWidth - total_height);
		var setCoverOpacity = function() {
			$body.find('#header').css({
				opacity: ((($body.scrollTop() / imgHeight) > 1) ? 1 : ($body.scrollTop() / imgHeight))
			})
			$body.find('.before_header').css({
				opacity: ((($body.scrollTop() / imgHeight) > 1) ? 1 : ($body.scrollTop() / imgHeight))
			})
		}

		//初始化设置背景透明度 
		setCoverOpacity();
		//监听滚动条事件，改变透明度 
		$(window).scroll(function() {
			setCoverOpacity();
		});
		if($body.scrollTop() >= imgHeight + 106) {
			$('.download').removeClass('hidden')
			$('.border').removeClass('hidden')
			$('.game_detail_nav').css({
				"position": "fixed",
				"top": total_height,
				"border-bottom": "1px solid #E7EAEC",
				"z-index": 9999
			});

		} else {
			$('.download').addClass('hidden')
			$('.border').addClass('hidden')
			$('.game_detail_nav').css({
				"position": "static",
				"border-bottom": "0.5rem solid #E7EAEC"
			})
		}
	})
	var tog = 1;
	$('.show_all').click(function() {
		if(tog == 1) {
			$('.game_simpleIntro_content').removeClass('overflow_two');
			$(this).text("收回");
			tog = 2;
		} else {
			$('.game_simpleIntro_content').addClass('overflow_two');
			$(this).text("显示全部");
			tog = 1;
		}
	});

	/* 打开评论详情 */

	$('body').on('tap', '.news_post_commentContent', function(e) {
		e.stopPropagation();
		if(userId) {
			mui.openWindow({
				url: "game_allComments.html",
				id: "game_allComments.html",
				createNew: true,
				extras: {
					commentId: $(this).attr('data-id'),
					gameId: gameId,
					uid: $(this).attr('data-uid'),
					game_name: gameName,
					game_icon: gameImg,
					pageIndex: pageIndex
				}
			});
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html",

			});
		}
	})

	//	游戏攻略点赞

	$('body').on('tap', '.thumb,.thumb_num', function(e) {
		e.stopPropagation();
		if(userId) {
			var ts = $(this);
			if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {
				ts.css('background-image', 'url("../../Public/image/good.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) - 1)
				ts.attr('data-state', 'null');
				$.ajax({
					type: "get",
					url: config.data + "strategy/unLikeNum",
					async: true,
					data: {
						strategyId: ts.attr('data-id'),
						user_id: userId
					},
					success: function(data) {
						if(data.state) {
							mui.toast("取消点赞成功")
						} else {
							mui.toast("取消点赞失败，请重试")
						}
					}
				});
			} else {
				ts.css('background-image', 'url("../../Public/image/diangoodone.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) + 1)
				ts.attr('data-state', 1)
				$.ajax({
					type: "get",
					url: config.data + "strategy/addNum",
					async: true,
					data: {
						strategyId: ts.attr('data-id'),
						user_id: userId
					},
					success: function(data) {

						if(data.state) {
							mui.toast("点赞成功")

						} else {
							mui.toast("点赞失败，请重试")
						}
					}
				});
			}
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html",

			})
		}

	})

	//	游戏点赞结束

})

function onStateChanged(download, status) {
	downloding(download)
	if(download.state == 4 && status == 200) {
		// 下载完成 
		$("#game_detail_download").removeClass("download_btn_active");
		$(".download_btn_text").text("安装");
		console.log("Download success: " + download.filename);

	}
}

function downloding(download) {
	switch(download.state) {
		case 0:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 1:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 2:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 3:
			loading((download.downloadedSize / download.totalSize * 100).toFixed(0))

			break;
		case 4:
			//			$(".ldownload_btn_text").text("打开");
			loading(0)
			break;
	}
}

function loading(num) {
	$(".download_loading").css("width", num + "%");
}

function launchApp(pagename) {
	if(plus.os.name == "Android") {
		plus.runtime.launchApplication({
			pname: pagename,
			extra: {
				url: "http://www.html5plus.org"
			}
		}, function(e) {
			installApp('_downloads/' + game.game_name + '.apk')
		});
	} else if(plus.os.name == "iOS") {
		plus.runtime.launchApplication({
			action: "http://www.html5plus.org"
		}, function(e) {
			alert("Open system default browser failed: " + e.message);
		});
	}
}

/* 攻略按键 */

$("body").on("tap", ".strategy_indent", function() {
	var strategy_id = $(this).attr("data-id");
	mui.openWindow({
		url: "../strategy/strategy_details.html",
		id: "strategy_details.html",
		createNew: true,
		extras: {
			strategyId: strategy_id
		}
	});

})

function detail_strategy() {
	strategyPage = 1;
	$('.news_post_commentContentstra').children().remove();
	commentModule = false;
	pageIndex = "strategy";
	mui('#game_detailContent').pullRefresh().enablePullupToRefresh();
	$(".game_detail_strategy").addClass('game_detail_strategy_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_detail_active').removeClass('game_detail_assess_active')
	$('.game_detail_walkThroughs').removeClass('hidden').siblings('div').addClass('hidden'); //获取游戏攻略	
	$.ajax({
		type: "get",
		url: config.data + "game/getStrategyByGameName",
		async: true,
		data: {
			gameName: gameName,
			page: 1,
			user_id: userId
		},
		success: function(data) {
			mui('#game_detailContent').pullRefresh().endPulldown(true);
			if(data.state) {
				var str = data.strategy;
				var div = '';
				if(str.length > 0) {
					for(var i = 0; i < str.length; i++) {
						if(str[i].src) {
							var src = "src"
						} else {
							var src = "hidden"
						}

						if(str[i].top_img_src == "" || str[i].top_img_src == null) {
							imgSrc = "";
							imgToggle = "none";
						} else {
							imgSrc = str[i].top_img_src;
							imgToggle = "block";
						}
						var detail = $(str[i].detail).text();
						portrait = "../../Public/image/morentouxiang.png";
						if(str[i].portrait == 0 || str[i].portrait == null) {

						} else {
							portrait = str[i].portrait;
						}

						if(str[i].strategy_id == null) {
							var dianz = "<div class='thumb' data-state='null' data-id='" + str[i].id + "'></div>"
						} else {
							var dianz = "<div class='thumb' data-state='1'     data-id='" + str[i].id + "' style='background-image:url(../../Public/image/diangoodone.png)'></div>"
						}

						div +=
							"<div class='strategy_indent ofh'  data-id='" + str[i].id + "'>" +
							"<div class='ofh'>" +
							"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
							"<div  class='timeName'>" +
							"<div class='comment_user font_14 font_bold fl'>" + str[i].nick_name + "</div>" +
							"<div class='font_12 color_9e9e9e fl'>" + str[i].add_time + "</div>" +
							"</div>" +
							"</div>" +
							"<div class='game_comment_content'style='margin-top:0.4rem;' >" +
							"<div class='font_14 overflow_two color_7a7a7a simHei'>" +
							"<img data-id='" + str[i].id + "'  style='width:100%;display:" + imgToggle + "' src=" + imgSrc + ">" +
							"<div class='font_bold color_282828' style='font-size:16px;margin-top:0.625rem;padding-left:0.5rem'>" +
							"<span>" + str[i].title + "</span>" +
							"</div>" +
							"<div  class='strategy_content'>" + detail + "</div>" +
							"</div>" +
							//"<img class='game_strategyImg " + src + "' src='" + config.img + str[i].src + "'/>" +
							"<div style='margin-top:0.2rem' class='backgroundColor_gray border_radius_twenty strategy_content_classify tac font_14 color_7a7a7a fl'>" + str[i].game_name + "</div>" +
							"<div class='comment_info'>" +
							"<div  style='margin:0.2rem 0rem;' class='fr color_9e9e9e comment_imgs'>" +
							dianz +
							"<div  class='thumb_num' data-id='" + str[i].id + "'>" + str[i].agree_num + "</div>" +
							"<div data-id='" + str[i].id + "'   class='comment_img'></div>" +
							"<div  class='comment_num' style='margin-right:0.8rem;'>" + str[i].comment_num + "</div>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>"

					}
					$('.news_post_commentContentstra').append(div);

					if(str.length < 6) {
						mui('#game_detailContent').pullRefresh().endPullupToRefresh(true);
					} else {
						mui('#game_detailContent').pullRefresh().endPullupToRefresh(false);
					}

				} else {
					mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
					$('.news_post_commentContentstra').append("<div class='no_strategy'></div>")
				}
			}
		}
	});
	//		获取游戏攻略结束
}

/* 检查我要评价接口的button是否打开 */
function check_assess() {
	if(userId) {
		/*登录下执行*/
		$.ajax({
			type: "get",
			url: config.data + "game/getCommentUserById",
			async: true,
			data: {
				game_id: gameId,
				user_id: userId
			},
			success: function(data) {
				if(data.state != 1) {
					$(".goToscore").css("display", "none");
				} else {
					$(".goToscore").css("display", "block");
				}
			}
		});
	}

}

/* 评论按键 */
function detail_assess() {
	check_assess();
	commentModule = true;
	pageIndex = "assess";
	$(".game_detail_assess").addClass('game_detail_assess_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_detail_active').removeClass('game_detail_strategy_active');
	$('.game_detail_comments').removeClass('hidden').siblings('div').addClass('hidden');
	$.ajax({
		type: "get",
		url: config.data + "game/getGameCommentScore",
		async: true,
		data: {
			gameId: gameId
		},
		success: function(data) {
			$(".bar0,.bar1,.bar2,.bar3,.bar4").css('width', "0rem");
			mui('#game_detailContent').pullRefresh().endPulldown(true);
			if(data.state) {
				var s = data.scoreList;
				var total_10 = 0,
					total_8 = 0,
					total_6 = 0,
					total_4 = 0,
					total_2 = 0
				var num_total = 0;
				var arr = [];
				for(var i = 0; i < s.length; i++) {
					num_total += s[i].num;
				}

				for(var j = 0; j < s.length; j++) {
					if(s[j].score == 10) {
						var lan = 10 / num_total;
						$(".bar4").css('width', lan + "rem");

						total_10 += 10 * s[j].num;

					} else if(s[j].score == 8) {

						var lan = 10 / num_total;
						$(".bar3").css('width', lan + "rem");
						total_8 += 8 * s[j].num;

					} else if(s[j].score == 6) {
						var lan = 10 / num_total;
						$(".bar2").css('width', lan + "rem");
						total_6 += 6 * s[j].num;

					} else if(s[j].score == 4) {

						var lan = 10 / num_total;
						$(".bar1").css('width', lan + "rem");
						total_4 += 4 * s[j].num;

					} else if(s[j].score == 2) {

						var lan = 10 / num_total;
						$(".bar0").css('width', lan + "rem");
						total_2 += 2 * s[j].num;

					}

				}

				var total = (total_10 + total_8 + total_6 + total_4 + total_2) / num_total;
				if(!Object.is(total, NaN)) {
					$(".game_infoScore").text(total.toFixed(1) + "分")
					$(".gameScore").text(total.toFixed(1))
				}

			}
		}
	});

	//获取游戏评论
	getAccess()

}

/* 评价下的 评论 */
function getAccess() {
	$.ajax({
		type: "get",
		url: config.data + "game/getGameCommentById",
		async: true,
		data: {
			gameId: gameId,
			page: 1,
			userId: userId
		},
		success: function(data) {
			if(data.state) {
				var com = data.comment;
				var div = '';
				var portrait = "../../Public/image/morentouxiang.png";

				for(var i = 0; i < com.length; i++) {
					if(com[i].state) {
						var ifGood = "good";
					} else {
						var ifGood = "noGood";
					}
					if(com[i].portrait == 0 || com[i].portrait == null) {
						portrait = "../../Public/image/morentouxiang.png";
					} else {
						portrait = com[i].portrait;
					}

					if(com[i].user_id == userId) {
						var comment_dele = "<div class='font_12 fl color_7fcadf game_dele_com' data-id='" + com[i].id + "'>删除</div>"
					} else {
						var comment_dele = "&nbsp;"
					}

					var score = Number(com[i].score) / 2
					var scoreStar = ""

					for(var n = 0; n < score; n++) {
						scoreStar += "<div class='game_list_star_active'></div>"
					}
					for(var m = 0; m < 5 - score; m++) {
						scoreStar += "<div></div>"
					}

					var star = "<div class='stars'>" + scoreStar + "</div>"

					div +=
						"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
						"<div >" +
						"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
						"<div class='fl'>" +
						"<div class='comment_user font_12 font_bold'>" + com[i].nick_name + "</div>" +
						star +
						"</div>" +
						"</div>" +
						"<div class='game_comment_content' >" +
						"<div class='comment_content font_14' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'>" + com[i].content + "</div>" +
						"<div class='comment_info ofh'>" +
						"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
						comment_dele +
						"<div class='fr color_9e9e9e comment_imgs'>" +
						"<span class='thumb_game    " + ifGood + "' data-state='" + com[i].state + "'></span>" +
						"<span class='thumb_num_game font_14'>" + com[i].agree + "</span>" +
						"<span class='comment_img' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'></span>" +
						"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
						"</div>" +
						"</div>" +
						"</div>" +
						"</div>"
				}
				$('.news_post_commentContents').empty().append(div);
				if(com.length < 10) {
					mui('#game_detailContent').pullRefresh().endPullupToRefresh(true);
				} else {
					mui('#game_detailContent').pullRefresh().endPullupToRefresh(false);

				}
			}
		}
	});

}

//	游戏攻略点赞

$('body').on('tap', '.thumb_game,.thumb_num_game', function(e) {
	e.stopPropagation();
	if(userId) {
		var ts = $(this);
		if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {
			ts.css('background-image', 'url("../../Public/image/good.png")')
			ts.siblings('.thumb_num_game').text(parseInt(ts.siblings('.thumb_num_game').text()) - 1)
			ts.attr('data-state', 'null');
			$.ajax({
				type: "get",
				url: config.data + "game/unLikeComment",
				async: true,
				data: {
					commentId: ts.siblings('.comment_img').attr('data-id'),
					userId: userId
				},
				success: function(data) {
					if(data.state) {
						mui.toast("取消点赞成功")
					} else {
						mui.toast("取消点赞失败，请重试")
					}
				}
			});
		} else {
			ts.css('background-image', 'url("../../Public/image/diangoodone.png")')
			ts.siblings('.thumb_num_game').text(parseInt(ts.siblings('.thumb_num_game').text()) + 1)
			ts.attr('data-state', 1)
			$.ajax({
				type: "get",
				url: config.data + "game/likeComment",
				async: true,
				data: {
					commentId: ts.siblings('.comment_img').attr('data-id'),
					userId: userId
				},
				success: function(data) {

					if(data.state) {
						mui.toast("点赞成功")

					} else {
						mui.toast("点赞失败，请重试")
					}
				}
			});
		}
	} else {
		mui.openWindow({
			url: "../user/login.html",
			id: "../user/login.html",

		})
	}
})

//	游戏点赞结束

/*去到更多标签*/
$("body").on("tap", ".sign_more", function() {
	mui.openWindow({
		url: "game_more_list.html",
		id: "game_more_list.html",
		extras: {
			gameId: gameId,
			gameName: gameName
		}
	})
})

detail_main();

function detail_main() {
	setTimeout(function() {
		$.ajax({
			type: "get",
			url: config.data + "game/getGameById",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					game = data.gameDetail; //这个已经把全部数据放进去					
					var g = data.gameDetail;
					var icon_img = g.game_title_img;
					icon = icon_img;
					var game_name = g.game_name;
					gameName = game_name;
					$("#game_detail_download").attr("src", g.game_download_andriod);
					var fileName = '_downloads/' + game.game_name + '.ipa';
					if(plus.runtime.isApplicationExist({
							pname: game.game_packagename,
							action: ''
						})) {
						$("#game_detail_download").find(".download_btn_text").text("打开");
					} else {
						plus.downloader.enumerate(function(tasks) {
							var state = false;
							for(var i = 0; i < tasks.length; i++) {
								if(tasks[i].filename == fileName) {
									$(".download_btn_text").text("取消");
									tasks[i].addEventListener("statechanged", onStateChanged, false);
									state = true;
								}
							}
							if(!state) {
								plus.io.resolveLocalFileSystemURL('_downloads/' + game.game_name + '.apk', function(entry) {
									$("#game_detail_download").find(".download_btn_text").text("安装");
									//	可通过entry对象操作文件 
								}, function(e) {
									//console.log("文件不存在 " + e.message);
								});
							}
						});
					}
					gameImg = g.icon;
					$('.game_detailTopimg').css('background-image', 'url(' + config.img + encodeURI(g.game_title_img) + ')');
					$('.game_infoImg').css('background-image', 'url(' + config.img + encodeURI(g.icon) + ')');
					$('.game_call').text(g.game_name);
					$('.game_nameHeader').text(g.game_name);
					$('.game_company').text(g.game_company);
					var sp = "";
					$('.game_infoScore').text(g.grade + "分");
					$('.gameScore').text(g.grade);
					if(g.tagList) {
						var t = g.tagList.split(',')
						var Id = g.tagId.split(",")
						if(t.length > 6) {
							for(var i = 0; i < 6; i++) {
								sp += "<span class='color_green signs_box' data-tagid='" + Id[i] + "'>" + t[i] + "</span>"
							}
						} else {
							for(var i = 0; i < t.length; i++) {
								sp += "<span  class='color_green signs_box' data-tagid='" + Id[i] + "'>" + t[i] + "</span>"
							}
						}
					}
					$('.game_signs').empty().append(sp);
					$('.game_signs').append("<img style='height:1.3rem;margin-left:0.3rem' class='sign_more'  src='../../Public/image/sign_more_btn.png' >")

					$('.game_simpleIntro_content').html(g.game_detail);
					$('.game_particular_value').children().eq(0).text(g.game_download_num + "次下载");
					$('.game_particular_value').children().eq(1).text(g.game_version);
					$('.game_particular_value').children().eq(2).text(g.game_size);
					$('.game_particular_value').children().eq(3).text(g.game_update_date);
					$('.game_particular_value').children().eq(4).text(g.game_company);
					$.ajax({
						type: "get",
						url: config.data + "game/getGameImgListById",
						async: true,
						data: {
							gameId: gameId
						},
						success: function(data) {
							if(data.state) {
								var gl = data.gameList
								var div = ''
								for(var i = 0; i < gl.length; i++) {
									div +=
										"<div style='margin:0.625rem 0.625rem;margin-left:0;margin-top:0.125rem;flex-shrink:0;'>" +
										"<img class='game_detail_content' src='" + config.img + encodeURI(gl[i].img_src) + "' data-preview-src='' data-preview-group='2' />" +
										"</div>"
								}
								$('.game_detail_contents').empty().append(div);
							}
						}
					});
				} else {

				}
			}

		});

		//相关资讯
		$.ajax({
			type: "get",
			url: config.data + "game/getNewsByGameId",
			async: true,
			data: {
				gameId: gameId,
				userId: userId
			},
			success: function(data) {
				if(data.state) {
					var nl = data.newsList;
					var div = '';
					for(var i = 0; i < nl.length; i++) {
						div +=
							"<div class='game_relatedInfocontent' data-id='" + nl[i].id + "'>" +
							"<div class='game_relatedInfocontentImg' style='background-image: url(" + config.img + encodeURI(nl[i].img) + ");'></div>" +
							"<div class='game_relatedInfocontentArt font_14 simHei color_282828'>" + nl[i].title + "</div>" +
							"<div class='game_relatedInfocontentTime font_12 simHei color_9e9e9e'>" + nl[i].add_time + "</div>" +
							"</div>"
					}
					$('.game_relatedInfocontents').empty().append(div);
				}
			}
		});

		//游戏热评部分
		indexCommit();
		//游戏热评部分结束

		//相似游戏开始
		$.ajax({
			type: "get",
			url: config.data + "game/getGameLikeTag?sys=1",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					var gl = data.gameList;
					var div = '';
					for(var i = 0; i < gl.length; i++) {
						div +=
							"<div style='flex-shrink:0;'>" +
							"<div class='game_similarContent backgroundColor_white ofh' data-id='" + gl[i].id + "'>" +
							"<div class='game_similarContentimg' style='background-image: url(" + config.img + encodeURI(gl[i].icon) + ");' ></div>" +
							"<div class='game_similarContentname font_12 font_bold color_282828'>" + gl[i].game_name + "</div>" +
							"<div class='game_similarContentinfo ofh'>" +
							"<div class='font_12 color_7a7a7a fl' style='margin-left: 0.4375rem;'>" + gl[i].tagList + "</div>" +
							"<div class='fr font_12 color_7a7a7a' style='margin-right: 0.5rem;'>" + gl[i].grade + "分</div>" +
							"<div class='game_star fr'></div>" +
							"</div>" +
							"</div>" +
							"</div>"
					}
					$('.game_similarContents').empty().append(div);
				} else {

				}
			}
		});
		//相似游戏结束

	}, 200)
	//延迟时间

}

/* 点击标签 */
$("body").on("tap", ".game_signs > span", function() {
	var tagId = $(this).attr("data-tagid");
	var tagName = $(this).text();
	mui.openWindow({
		url: "game_classify_list.html",
		id: "game_classify_list.html",
		extras: {
			tagId: tagId,
			tagName: tagName
		}
	})
})

/*
 点击删除游戏评论
 */
$("body").on("tap", ".game_dele_com", function(e) {
	e.stopPropagation()
	var id = $(this).attr("data-id")
	plus.nativeUI.confirm("删除评论", function(e) {
		if(e.index == 0) {
			$.ajax({
				type: "get",
				url: config.data + "game/delMyComment",
				async: true,
				data: {
					uid: userId,
					id: id
				},
				success: function(data) {
					if(data.state == 1) {
						mui.toast("删除成功")
						indexCommit()
						getAccess()
						//						check_assess()
						detail_assess()
					} else {
						mui.toast("删除失败")
					}
				}
			})
		}
	})
})

function indexCommit() {
	$.ajax({
		type: "get",
		url: config.data + "game/getGameHotComment",
		async: true,
		data: {
			gameId: gameId,
			userId: userId
		},
		success: function(data) {
			if(data.state) {

				var com = data.comment,
					portrait;
				var div = '';

				for(var i = 0; i < com.length; i++) {
					console.log(com[i])
					if(com[i].state) {
						var ifGood = "good";
					} else {
						var ifGood = "noGood";
					}

					if(com[i].portrait == 0 || com[i].portrait == null) {
						portrait = "../../Public/image/morentouxiang.png";
					} else {
						portrait = com[i].portrait;
					}

					if(com[i].user_id == userId) {
						var comment_dele = "<div class='font_12 fl color_7fcadf game_dele_com' data-id='" + com[i].id + "'>删除</div>"
					} else {
						var comment_dele = "&nbsp;"
					}
					var score = Number(com[i].score) / 2
					var scoreStar = ""

					for(var n = 0; n < score; n++) {
						scoreStar += "<div class='game_list_star_active'></div>"
					}
					for(var m = 0; m < 5 - score; m++) {
						scoreStar += "<div></div>"
					}

					var star = "<div class='stars'>" +
						scoreStar +
						"</div>"

					div +=
						"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
						"<div >" +
						"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
						"<div class='fl'>" +
						"<div class='comment_user font_12 font_bold'>" + com[i].nick_name + "</div>" +
						star +
						"</div>" +
						"</div>" +
						"<div class='game_comment_content'>" +
						"<div class='comment_content font_14' data-id='" + com[i].id + "'>" + com[i].content + "</div>" +
						"<div class='comment_info ofh'>" +
						"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
						comment_dele +
						"<div class='fr color_9e9e9e comment_imgs'>" +
						"<span class='thumb_game " + ifGood + "' data-state='" + com[i].state + "'></span>" +
						"<span class='thumb_num_game font_14'>" + com[i].agree + "</span>" +
						"<span class='comment_img' data-id='" + com[i].id + "'></span>" +
						"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
						"</div>" +
						"</div>" +
						"</div>" +
						"</div>"
				}
				$('.news_post_commentContentshot').empty().append(div);
			}
		}
	});
}