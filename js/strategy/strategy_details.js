var userId = localStorage.getItem("userId") || 0;
var proId;
var strategyId;
var page = 0;
var sort = "add_time";
var target_img;
var target_title;
$(function(){
	$('body').on("tap",".news_review",function() {
		$('html, body').animate({
			scrollTop: $('#recommend').offset().top - parseInt(total_height + 36) + "px"
		}, 1000)
	})
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		strategyId = self.strategyId;
		var anchor = self.anchor;
		total_height = plus.navigator.getStatusbarHeight() + 45 + "px";	
		mui.init({
			swipeBack: true,
			gestureConfig: {
				tap: true, //默认为true
				doubletap: true, //默认为false
				longtap: true, //默认为false
				swipe: true, //默认为true
				drag: true, //默认为true
				hold: true, //默认为false，不监听
				release: false //默认为false，不监听
			},
			pullRefresh: {
				container: ".strategy_details", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				up: {
					height: 50, //可选.默认50.触发上拉加载拖动距离
					auto: true, //可选,默认false.自动上拉加载一次
					contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
					contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
					callback:up //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				},
				down: {
					style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
					color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
					height: '50px', //可选,默认50px.下拉刷新控件的高度,
					range: '100px', //可选 默认100px,控件可下拉拖拽的范围
					offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
					auto: false, //可选,默认false.首次加载自动上拉刷新一次
					callback: down //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				}
			}
		})


		detail();
		$('body').on("tap",".news_collect",function() {
			if(userId !== 0) {
				if($(this).attr('data-collect') == 1) {
					$('.news_collect').attr('data-collect', 0)
					unCollect(strategyId)
				} else {
					$('.news_collect').attr('data-collect', 1)
					collect(strategyId)
				}
			} else {
				mui.toast("请先登录")
			}

		})

		//长按保存图片
		$('body').on('longtap', 'img', function() {
			var picurl = $(this).attr("src")
			saveImg(picurl);

		})
		//长按保存图片结束
		
		$('body').on('tap','.mui-preview-header',function(){
          var num=$(".mui-preview-indicator").text();        
          num=num.substring(0,1)-1;
          var  url=$(".mui-preview-image img:eq("+num+")").attr("src");
          saveImg(url);
		});
		
		
		
		
		function saveImg(picurl){
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
				} else {

				}
			})
		}

		//	切换评论排序
		$('.time').click(function() {
			$(this).addClass('color_green');
			$('.hot').removeClass('color_green');
			$('.news_post_commentContents').children().remove();
			mui('.strategy_details').pullRefresh().refresh(true);
			page = 0;
			sort = "add_time";
			up()
		})
		$('.hot').click(function() {
			$(this).addClass('color_green');
			$('.time').removeClass('color_green');
			$('.news_post_commentContents').children().remove();
			mui('.strategy_details').pullRefresh().refresh(true);
			page = 0;
			sort = "comment_num";
			up()
		})

		//	切换评论排序结束

		//		点赞与取消点赞

		$('body').on('tap', '.thumb', function(event) {
			event.stopPropagation();
			var ts = $(this);
			var commentId = ts.parents(".news_post_commentContent").attr('data-id');

			if(ts.hasClass('unLike')) {

				ts.addClass('liked').removeClass('unLike');
				ts.next('.thumb_num').text(parseInt(ts.next('.thumb_num').text()) + 1)

				$.ajax({
					type: "get",
					url: config.data + "strategy/likeComment",
					async: true,
					data: {
						commentId: commentId,
						userId: userId,
						state: 1
					},
					success: function(data) {
						if(data.state) {

						} else {

						}
					}
				});
			} else {

				ts.removeClass('liked').addClass('unLike');
				ts.next('.thumb_num').text(parseInt(ts.next('.thumb_num').text()) - 1)
				$.ajax({
					type: "get",
					url: config.data + "strategy/unLikeComment",
					async: true,
					data: {
						commentId: commentId,
						userId: userId,

					},
					success: function(data) {
						if(data.state) {

						} else {

						}
					}
				});
			}
		})

		$('body').on('tap', '.thumb_num', function(event) {
			event.stopPropagation();
			var ts = $(this).siblings('.thumb');
			var commentId = ts.parents(".news_post_commentContent").attr('data-id');

			if(ts.hasClass('unLike')) {

				ts.addClass('liked').removeClass('unLike');
				ts.next('.thumb_num').text(parseInt(ts.next('.thumb_num').text()) + 1)

				$.ajax({
					type: "get",
					url: config.data + "strategy/likeComment",
					async: true,
					data: {
						commentId: commentId,
						userId: userId,
						state: 1
					},
					success: function(data) {
						if(data.state) {

						} else {

						}
					}
				});
			} else {

				ts.removeClass('liked').addClass('unLike');
				ts.next('.thumb_num').text(parseInt(ts.next('.thumb_num').text()) - 1)
				$.ajax({
					type: "get",
					url: config.data + "strategy/unLikeComment",
					async: true,
					data: {
						commentId: commentId,
						userId: userId,

					},
					success: function(data) {
						if(data.state) {

						} else {

						}
					}
				});
			}
		})

		//		点赞与取消点赞结束
		
		



		$('body').on('tap', '.more_secondComment,.comment_img', function(event) {
		  if(userId != 0) {
			event.stopPropagation();
			var commentId = $(this).attr('data-id')
			mui.openWindow({
				url: "strategy_allComments.html",
				id: "strategy_allComments.html",
				createNew: true,
				extras: {
					strategyId: strategyId,
					commentId: $(this).attr('data-id'),
					target_img: target_img,
					target_title: target_title
				}
			});
		  }else{
		  	mui.toast("请先登录")
		  }
			
			
		})

		//	滚动隐藏
		function scroll(fn) {
			var beforeScrollTop = document.body.scrollTop,
				fn = fn || function() {};
			window.addEventListener("scroll", function() {
				var afterScrollTop = document.body.scrollTop,
					delta = afterScrollTop - beforeScrollTop,
				    scrollHeight=document.body.scrollHeight,
				    windowHeight=$(window).height();
				 /*到底部*/
				//console.log(scrollHeight,windowHeight+afterScrollTop+20)
				if(scrollHeight<=windowHeight+afterScrollTop+20){
					fn('up');
					return ;
				}
				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
				beforeScrollTop = afterScrollTop;
			}, false);
		}

		scroll(function(direction) {
			if(direction == "down") {
				$('.news_userInfo_reply').addClass('hidden')
			} else {
				$('.news_userInfo_reply').removeClass('hidden')
			}
		});

        
        $("body").on('tap','.news_post_content_detail a',function(){
             mui.openWindow({
			   url:"../play/h5game.html",
			   id:"h5game.html",
			   extras:{
				url:$(this).attr('href')
			  }
		   })
        });




		//滚动隐藏结束

		$('body').on("tap",".news_userInfo_replyInput",function() {
			if(userId !== 0) {
				mui.openWindow({
					url: "strategy_comment.html",
					id: "strategy_comment.html",
					extras: {
						strategyId: strategyId,
						proId: proId,
						target_img: target_img,
						target_title: target_title
					}
				})
			} else {
				mui.toast("请先登录")
			}

		})
		

		$('body').on('tap', '.news_post_commentContent', function() {
		  if(userId !== 0) {
			mui.openWindow({
				url: "strategy_allComments.html",
				id: "strategy_allComments.html",
				createNew: true,
				extras: {
					strategyId: strategyId,
					commentId: $(this).attr('data-id'),
					target_img: target_img,
					target_title: target_title
				}
			})
		  }else{
		  	mui.toast("请先登录")
		  }
		  
		});
        //取消收藏结束
        




		
		

	})
})




function up() {
			page++;
			if(sort == "comment_num") {
				$.ajax({
					type: "get",
					url: config.data + "strategy/getStrategyCommentByPageUser",
					async: true,
					data: {
						page: page,
						userId: userId,
						targetId: proId,
						strategyId: strategyId
					},
					success: function(data) {                      
						if(data.state) {
							var com = data.comment;
							var div = "",portrait;
								
							
							for(var i = 0; i < com.length; i++) {
								if(com[i].img) {
									var img = "img"
								} else {
									var img = "hidden"
								}
								var sec = "";
								if(com[i].towCommentList.length > 0) {
									for(var j = 0; j < com[i].towCommentList.length; j++) {
										if(com[i].towCommentList[j].targetUserNickName) {
											ifHide = "ifHide"
										} else {
											ifHide = "hidden"
										}
										sec +=
											"<div class='comment_secondComment'>" +
											"<span class='color_green'>" + com[i].towCommentList[j].selfNickName + "</span>" +
											"<span class='" + ifHide + "'>回复</span>" +
											"<span class='color_green " + ifHide + "'>" + com[i].towCommentList[j].targetUserNickName + "</span>" +
											"<span class='color_282828'>: &nbsp; " + com[i].towCommentList[j].content + "</span>" +
											"</div>"
									}

									sec += "<div class='more_secondComment color_green fr' data-id='" + com[i].id + "'>全部回复</div>"

								}

								if(com[i].state !== 1) {
									var ifLike = "unLike"

								} else {
									var ifLike = "liked"
								}

								
								if(com[i].portrait==0||com[i].portrait==null){
									portrait="../../Public/image/morentouxiang.png";
								}else{
								    portrait=com[i].portrait;
								}
								
								div +=
									"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
									"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");'></div>" +
									"<div class='news_post_commentContent_content fl'>" +
									"<div class='comment_user font_12'>" + com[i].nick_name + "</div>" +
									"<div class='comment_content font_14'>" + com[i].content + "</div>" +
									"<img class='" + img + "' src='" + config.img + encodeURI(com[i].img) + "' width='100%' />" +
									"<div class='comment_info ofh'>" +
									"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
									"<div class='fr color_9e9e9e comment_imgs'>" +
									"<span class='thumb " + ifLike + "'></span>" +
									"<span class='thumb_num font_14'>" + com[i].agree_num + "</span>" +
									"<span class='comment_img' data-id='" + com[i].id + "'></span>" +
									"<span class='comment_num font_14' style='margin-left:0.25rem;'>" + com[i].comment_num + "</span>" +
									"</div>" +
									"</div>" +
									"<div class='comment_secondComments font_14 ofh'>" +
									sec +
									"</div>" +
									"</div>" +
									"</div>";

							}

							$('.news_post_commentContents').append(div);
						    for(var n = 0; n < com.length;n++) {
								if($(".img").eq(n).width()>$(".imgFirst").width()){
								$(".img").eq(n).css("width","100%");
							  }
							}
							
							
							var commitNum=$(".news_post_commentContent").length;
                            $(".news_reviewNum").text(commitNum)
							if(com.length < 5) {
								mui('.strategy_details').pullRefresh().endPullupToRefresh(true);
							} else {
								mui('.strategy_details').pullRefresh().endPullupToRefresh(false);
							}
						} else {

						}
					}
				});
			} else {
				$.ajax({
					type: "get",
					url: config.data + "strategy/getStrategyCommentByPage",
					async: true,
					data: {
						strategyId: strategyId,
						page: page,
						userId: userId,
						sort: sort
					},
					success: function(data) {
                       
						if(data.state) {
							var com = data.comment;
							var div = "";
							for(var i = 0; i < com.length; i++) {
                         
								if(com[i].img) {
									var img = "img"
								} else {
									var img = "hidden"
								}
								var sec = "",portrait;
                                											
								if(com[i].towCommentList.length > 0) {
									for(var j = 0; j < com[i].towCommentList.length; j++) {
										if(com[i].towCommentList[j].targetUserNickName) {
											ifHide = "ifHide"
										} else {
											ifHide = "hidden"
										}
										sec +=
											"<div class='comment_secondComment'>" +
											"<span class='color_green'>" + com[i].towCommentList[j].selfNickName + "</span>" +
											"<span class='" + ifHide + "'>回复</span>" +
											"<span class='color_green" + ifHide + "'>" + com[i].towCommentList[j].targetUserNickName + "</span>" +
											"<span class='color_282828'>: &nbsp; " + com[i].towCommentList[j].content + "</span>" +
											"</div>"
									}

									sec += "<div class='more_secondComment color_green fr' data-id='" + com[i].id + "'>全部回复</div>"

								}

								if(com[i].state !== 1) {
									var ifLike = "unLike"

								} else {
									var ifLike = "liked"

								}
								
								if(com[i].portrait==0||com[i].portrait==null){
									portrait="../../Public/image/morentouxiang.png";
								}else{
									portrait=com[i].portrait;
								}
								

								div +=
									"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
									"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");'></div>" +
									"<div class='news_post_commentContent_content fl'>" +
									"<div class='comment_user font_12'>" + com[i].nick_name + "</div>" +
									"<div class='comment_content font_14'>" + com[i].content + "</div>" +
									"<div class='imgFirst'>"+
									   "<img class='" + img + "' src='" + config.img + encodeURI(com[i].img) + "' />" +
									"</div>"+
									"<div class='comment_info ofh'>" +
									"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
									"<div class='fr color_9e9e9e comment_imgs'>" +
									"<span class='thumb " + ifLike + "'></span>" +
									"<span class='thumb_num font_14'>" + com[i].agree_num + "</span>" +
									"<span class='comment_img' data-id='" + com[i].id + "'></span>" +
									"<span class='comment_num font_14' style='margin-left:0.25rem;'>" + com[i].comment_num + "</span>" +
									"</div>" +
									"</div>" +
									"<div class='comment_secondComments font_14 ofh'>" +
									sec +
									"</div>" +
									"</div>" +
									"</div>";
									
						}							 
							$('.news_post_commentContents').append(div);
							for(var n = 0; n < com.length;n++) {
								if($(".img").eq(n).width()>$(".imgFirst").width()){
								$(".img").eq(n).css("width","100%");
							  }
							}
							
							
							var commitNum=$(".news_post_commentContent").length
                            $(".news_reviewNum").text(commitNum)

							if(com.length < 5) {
								mui('.strategy_details').pullRefresh().endPullupToRefresh(true);
							} else {
								mui('.strategy_details').pullRefresh().endPullupToRefresh(false);
							}
						} else {

						}
					}
				});
			}

		}




//获取详情ajax

function detail() {
	$.ajax({
		type: "get",
		url: config.data + "strategy/getStrategyById",
		async: true,
		data: {
			strategyId: strategyId,
			userId: userId
		},
		success: function(data) {
			if(data.state) {
				var str = data.strategy,
					portrait,nickName,detail;

				if(str.comment_num > 99) {
					var comment_num = 99
				} else {
					var comment_num = str.comment_num
				}
				if(str.portrait == 0 || str.portrait == null) {
					portrait = "../../Public/image/morentouxiang.png";
				} else {
					portrait = str.portrait;
				}

                if(str.admin){
                	nickName=str.nike_name;
                }else{
                	nickName=str.nick_name;
                }              
                if(str.detail!=null){
                	detail=str.detail.replace(/<span> <\/span>/g,"&nbsp;");
                }
           
                $('.news_post_content_detail').html(detail);
//				$('.news_reviewNum').text(comment_num);
				$('h4').text(str.title);
				$('.news_userInfo_img').css("background-image", "url(" + encodeURI(portrait) + ")");
				$('.news_userInfo_name').text(nickName);
				$('.news_userInfo_date').text(str.add_time);			
				$(".news_post_content_detail img").attr("data-preview-src","");
                $(".news_post_content_detail img").attr("data-preview-group","1");  
				$('.news_post_content_detail img').css("max-width", "100%");
				target_img = str.top_img_src;
				target_title = str.title;
				if(str.imgList) {
					var string = str.imgList;
					var result = string.split(",");
					var img = '';
					for(var i = 0; i < result.length; i++) {
						img +=
							"<img src='" + config.img + encodeURI(result[i]) + "' width='100%' />"
					}
					$('.news_post_content_imgs').append(img)
				} else {

				}
				proId = str.user_id;
				if(str.collect > 0) {
					$('.news_collect').attr('data-collect', 1).addClass('collected')
				} else {
					$('.news_collect').attr('data-collect', 0)
				}
			} else {

			}
		}
	});
}

//收藏
function collect(strategyId) {

	$('.news_collect').addClass("collected")

	$.ajax({
		type: "get",
		url: config.data + "strategy/collect",
		async: true,
		data: {
			targetId: strategyId,
			userId: userId,
			type: 2,
			sys: 2
		},
		success: function(data) {
			if(data.state) {
				mui.toast("收藏成功")
			} else {

			}
		}
	});
}

//收藏结束

//取消收藏
function unCollect(strategyId) {
	$('.news_collect').removeClass('collected')
	$.ajax({
		type: "get",
		url: config.data + "strategy/unCollect",
		async: true,
		data: {
			targetId: strategyId,
			userId: userId,
			type: 2,
		},
		success: function(data) {
			if(data.state) {
				mui.toast("取消收藏成功")
			} else {

			}
		}
	});
}

function down() {
	window.location.reload();
	setTimeout(function() {
		mui('.strategy_details').pullRefresh().endPulldown(true);
	}, 1000);
}

// 保存图片到相册中 
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
	dtask.start();
}