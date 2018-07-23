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
		$.ajax({
			type: "get",
			url: config.data + "game/getGameById",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					game = data.gameDetail;
					//这个已经把全部数据放进去
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
					$('.game_infoScore').text(g.grade + "分");
					$('.gameScore').text(g.grade);
					if(g.tagList) {
						var t = g.tagList.split(',');
						for(var i = 0; i < t.length - 1; i++) {
							var sp = "<span class='color_green'>" + t[i] + "  |</span>"

						}
						$('.game_signs').append(sp)
						var spLast = "<span class='color_green'>" + t[t.length - 1] + "</span>"
						$('.game_signs').append(spLast)

					}
					$('.game_simpleIntro_content').html(g.game_detail);
					$('.game_particular_value').children().eq(0).text(g.game_download_num + "次下载");
					$('.game_particular_value').children().eq(1).text(g.game_version);
					$('.game_particular_value').children().eq(2).text(g.game_size + "MB");
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
										//"<img class='game_detail_content' style='background-image: url(" + config.img + encodeURI(gl[i].img_src) + ");'></img>" +
										"</div>"
								}
								$('.game_detail_contents').append(div);
							} else {

							}
						}
					});
				} else {

				}
			}

		});

		//		相关资讯
		$.ajax({
			type: "get",
			url: config.data + "game/getNewsByGameId",
			async: true,
			data: {
				gameId: gameId
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
					$('.game_relatedInfocontents').append(div)

				} else {

				}
			}
		});

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

		//		相关资讯结束

		//		游戏热评部分
		$.ajax({
			type: "get",
			url: config.data + "game/getGameHotComment",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				
//				var portrait;
				if(data.state) {

					var com = data.comment,portrait;
					var div = '';

					for(var i = 0; i < com.length; i++) {
						if(com[i].state) {
							var ifGood = "good";
						} else {
							var ifGood = "noGood";
						}
						
						
				        if(com[i].portrait==0||com[i].portrait==null){
						    portrait="../../Public/image/morentouxiang.png";
					    }else{
						    portrait=com[i].portrait;
						}
								
						
						
						div +=
							"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
							"<div class='ofh'>" +
							"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
							"<div class='comment_user font_12 font_bold fl'>" + com[i].nick_name + "</div>" +
							"</div>" +
							"<div class='game_comment_content'>" +
							"<div class='comment_content font_14' data-id='" + com[i].id + "'>" + com[i].content + "</div>" +
							"<div class='comment_info ofh'>" +
							"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
							"<div class='fr color_9e9e9e comment_imgs'>" +
							"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "'></span>" +
							"<span class='thumb_num font_14'>" + com[i].agree + "</span>" +
							"<span class='comment_img' data-id='" + com[i].id + "'></span>" +
							"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +

							"</div>"
					}
					$('.news_post_commentContentshot').append(div);
				} else {

				}
			}
		});

		//		游戏热评部分结束

		//		相关游戏

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
					$('.game_similarContents').append(div)
				} else {

				}
			}
		});

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

		$('body').on("tap",".goToscore",function() {
			if(localStorage.getItem("userId")) {
				mui.openWindow({
					url: "game_score.html",
					id: "game_score.html",
					extras: {
						gameId: gameId,
						icon: icon,
						gameName: gameName,
						game_icon:gameImg
					}
				})
			} else {
				mui.openWindow({
					url: "../user/login.html",
					id: "../user/login.html"
				})
			}

		})

		
		
		
		//详情页

		$('body').on("tap",".game_detail_detail",function() {
			pageIndex="detail";
			commentModule = false;
			mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
			$(this).addClass('game_detail_detail_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_assess_active').removeClass('game_detail_strategy_active')
			$('.game_detail_details').removeClass('hidden').siblings('div').addClass('hidden');

		})

		//		详情页结束

		//		评论页开始

		$('body').on("tap",".game_detail_assess",function() {		
		    detail_assess();
		});
	

		//		评论页结束		

		//		攻略页开始

		$('body').on("tap",".game_detail_strategy",function() {				    
			 detail_strategy();
		});
       
	   
		$("body").on("tap",".download",function(){
           	if(game.game_download_ios!==null){
				location.href=game.game_download_ios;
			}else{
				//alert("越狱包");
			}
		})
		
		
	
		//		攻略页结束
		$("body").on("tap","#game_detail_download",function(ev) {
			event = ev || window.event;
			event.stopPropagation();
			var t = $(this);
			var isFile = false;			  
			if(String(game.game_download_ios)!="null"){
				location.href=game.game_download_ios;
				return false;
			}else{
                location.href=game.game_download_ios2;
                setTimeout(()=>{ 
                	mui.toast("正在安装，请按Home键在桌面查看",{duration:"long"});
                	setTimeout(()=>{
                		$('.download_btn').css({"border":"1px solid #8ed8ed","color":"#8ed8ed","background":"#fff"});
                		$('.download_btn_text').text("刷新");
                		$("#game_detail_download").attr("id","reload");
                	},3800);
                },3000)
				return false;
			}

       });
       
       
       $('body').on('tap','#reload',function(){
       	  window.location.reload();
       });

	})
	
	
	
	/* 
	 * 安装
	 * @params 第一个是包名
	 * @param 第二个是下载地址
	 */
	
//	function createDownload(name, src) {
//	$.ajax({
//		type: "get",
//		url: config.data + "game/addDownloadNum",
//		async: true,
//		data: {
//			id: self.gameId
//		},
//		success: function(data) {
//			if(data.state) {
//				$("#game_msg_install").text(parseInt($("#game_msg_install").text()) + 1)
//			}
//		}
//	});
//	plus.downloader.enumerate(function(tasks) {
//		for(var i = 0; i < tasks.length; i++) {
//
//			if(tasks[i].filename == '_downloads/' + name + '.ipa') {
//				//				tasks[i].abort();
//				return;
//
//			}
//
//		}
//
//		mui.toast("开始下载")
//		$(".download_btn_text").text("取消");
//		var dtask = plus.downloader.createDownload("http://ipa.oneyouxi.com.cn/" + encodeURI(src), {
//			method: 'GET',
//			data: '',
//			filename: '_downloads/'+name+'.ipa',
//			timeout: '3000',
//			retry: 0,
//			retryInterval: 0
//		}, function(d, status) {
//			// 下载完成
//			if(status == 200) {
//				//添加到我的游戏
//				if(userId) {
//					$.ajax({
//						type: "get",
//						url: config.data + "game/addMyGame",
//						async: true,
//						data: {
//							gameId: gameId,
//							userId: userId,
//							sys: 2
//						},
//						success: function(data) {
//							if(data.state) {
//
//							} else {
//
//							}
//						}
//					});
//				}
//				//添加到我的游戏结束
//			    alert("安装中"+dtask.filename);
//				plus.runtime.install(dtask.filename,{force:true},function(widgetInfo) {
//					$(".download_btn_text").text("打开");
//				}, function(error) {
//					console.log(error)
//					alert(JSON.stringify(error))
//				});
//
//			} else {
//				mui.toast("下载失败: " + status);
//				$("#game_detail_download").removeClass("download_btn_active");
//			}
//		});
//		dtask.addEventListener("statechanged", onStateChanged, false);
//		dtask.start();
//	});
//}

/* 安装ios包 */
//function installApp(filename) {
//
//	plus.runtime.install(filename,{force:true},function(widgetInfo) {
//		console.log(widgetInfo)
//	}, function(error) {
//		mui.toast("打开失败")
//		alert(JSON.stringify(error))
//
//	});
//}
//	
	
	

	$('body').on("tap",".backImg",function() {
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
				"border-bottom": "1px solid #E7EAEC"
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
    var tog=1;
	$('.show_all').click(function() {
		if(tog==1){
		   $('.game_simpleIntro_content').removeClass('overflow_two');
		   $(this).text("收回");	
		   tog=2;
		}else{
		   $('.game_simpleIntro_content').addClass('overflow_two');
		   $(this).text("显示全部");	
		   tog=1;
		}	
	});
	
    /* 打开评论详情 */
   
	$('body').on('tap', '.news_post_commentContent,.comment_img', function(e) {
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
					game_name:gameName,
					game_icon:gameImg
				}
			});
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html",

			});
		}
	})

	//	游戏点赞

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
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) + 1)
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

})


function onStateChanged(download, status) {
	//	if(download.state==5){
	//		console.log(download.state)
	//	}

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
	//	!$("#game_detail_download").hasClass("download_btn_active") ? $("#game_detail_download").addClass("download_btn_active") : "";
	$(".download_loading").css("width", num + "%");
}



function launchApp(pagename) {
	alert(plus.os.name)
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


function detail_strategy(){
		   $('.news_post_commentContentstra').children().remove();
			commentModule = false;
			pageIndex="strategy";
			mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
		    $(".game_detail_strategy").addClass('game_detail_strategy_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_detail_active').removeClass('game_detail_assess_active')
			$('.game_detail_walkThroughs').removeClass('hidden').siblings('div').addClass('hidden');
			//		获取游戏攻略
			$.ajax({
				type: "get",
				url: config.data + "game/getStrategyByGameName",
				async: true,
				data: {
					gameName: gameName,
					page: 1
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
								
								
								if(str[i].top_img_src==""||str[i].top_img_src==null){									
									imgSrc="";
									imgToggle="none";	
								}else{
									imgSrc=str[i].top_img_src;
									imgToggle="block";						
								}
								var detail=$(str[i].detail).text();
								portrait="../../Public/image/morentouxiang.png";
								if(str[i].portrait==0||str[i].portrait==null){
									
								}else{
									portrait=str[i].portrait;
								}
								div +=
									"<div class='news_post_commentContent strategy_indent ofh'  data-id='" + str[i].id + "'>" +
									"<div class='ofh'>" +
									  "<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
									   "<div  class='timeName'>"+
									    "<div class='comment_user font_14 font_bold fl'>" + str[i].nick_name + "</div>" +
									     "<div class='font_12 color_9e9e9e fl'>" + str[i].add_time + "</div>" +
									   "</div>"+
									"</div>" +
									"<div class='game_comment_content'>" +									
									"<div class='font_14 overflow_two color_7a7a7a simHei'>" 
									+ 
									 "<img data-id='" + str[i].id + "'  style='width:100%;display:"+imgToggle+"' src="+imgSrc+">"+
									 "<div class='font_bold color_282828' style='font-size:16px;margin-top:0.625rem;padding-left:0.5rem'>" +
									   "<span>" + str[i].title + "</span>" +								  
									 "</div>" +
									  "<div  class='strategy_content'>"+detail+"</div>"+	
									"</div>" +
									//"<img class='game_strategyImg " + src + "' src='" + config.img + str[i].src + "'/>" +
									"<div class='comment_info'>" +									
									"<div class='fr color_9e9e9e comment_imgs'>" +
									 "<div class='thumb'></div>" +
									 "<div  class='thumb_num'>"+str[i].agree_num + "</div>" +
									 "<div data-id='" + str[i].id + "'   class='comment_img'></div>" +
									 "<div  class='comment_num'>" + str[i].comment_num + "</div>" +
									"</div>" +
									"</div>" +
									"</div>" +
									"</div>"

							}
							$('.news_post_commentContentstra').append(div);
						} else {
							$('.news_post_commentContentstra').append("<div class='no_strategy'></div>")

						}

					} else {

					}
				}
			});
			//		获取游戏攻略结束
	    }
		
        
        function check_assess(){      	
        	$.ajax({
				type: "get",
				url: config.data + "game/getCommentUserById",
				async: true,
				data: {
					game_id:gameId,
					user_id:userId
				},
				success: function(data) {
					if(data.state!=1){
						$(".goToscore").css("display","none");
					}
			   }
		    });
		    
        }
    
    
	
		function detail_assess(){	
			check_assess();
			commentModule=true;
			pageIndex="assess";
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
					
					 mui('#game_detailContent').pullRefresh().endPulldown(true);
					if(data.state) {
						var s = data.scoreList;
						var total_10=0,total_8=0,total_6=0,total_4=0,total_2=0
						var num_total=0;
						var arr = [];
						for(var i = 0; i < s.length; i++) {
							num_total += s[i].num;
						}
                        //alert(num_total)
						for(var j = 0; j < s.length; j++) {	
							if(s[j].score==10){
                                var lan=10/num_total;         
							    $(".bar4").css('width', lan + "rem");
							    
							    total_10 += 10*s[j].num;
							    
							}else if(s[j].score==8){
								
								 var lan=10/num_total;
								$(".bar3").css('width', lan + "rem");
								 total_8 += 8*s[j].num;
								
								
							}else if(s[j].score==6){								
								var lan=10/num_total;
								$(".bar2").css('width', lan + "rem");
								total_6 += 6*s[j].num;
								
							}else if(s[j].score==4){
								
								var lan=10/num_total;
								$(".bar1").css('width', lan + "rem");
								total_4 += 4*s[j].num;
								
							}else if(s[j].score==2){
								
								var lan=10/num_total;
								$(".bar0").css('width', lan + "rem");
								total_2 += 2*s[j].num;
								
							}	
											
						}

                        var total=(total_10+total_8+total_6+total_4+total_2)/num_total;                    
                        if(!Object.is(total,NaN)){
                        	$(".gameScore").text(total.toFixed(1));
                        }
						
							
                        

					} else {

					}
				}
			});

			//		获取游戏评论
			//!gameComment
			if(1){
				gameComment = true;
				$.ajax({
					type: "get",
					url: config.data + "game/getGameCommentById",
					async: true,
					data: {
						gameId: gameId,
						page: 1,
					},
					success: function(data) {
						if(data.state) {
							var com = data.comment;
							var div = '';
							var portrait="../../Public/image/morentouxiang.png";
							for(var i = 0; i < com.length; i++) {
								if(com[i].state) {
									var ifGood = "good";
								} else {
									var ifGood = "noGood";
								}
							     if(com[i].portrait==0||com[i].portrait==null){								  
									  portrait="../../Public/image/morentouxiang.png";
								  }else{
								  	portrait=com[i].portrait;
								  }
								div +=
									"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
									"<div class='ofh'>" +
									"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
									"<div class='comment_user font_12 font_bold fl'>" + com[i].nick_name + "</div>" +
									"</div>" +
									"<div class='game_comment_content' >" +
									"<div class='comment_content font_14' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'>" + com[i].content + "</div>" +
									"<div class='comment_info ofh'>" +
									"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
									"<div class='fr color_9e9e9e comment_imgs'>" +
									"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "'></span>" +
									"<span class='thumb_num font_14'>" + com[i].agree + "</span>" +
									"<span class='comment_img' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'></span>" +
									"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
									"</div>" +
									"</div>" +
									"</div>" +

									"</div>"
							}
							$('.news_post_commentContents').empty().append(div);
						} else {

						}
					}
				});
			}

			//		获取游戏评论结束
		}