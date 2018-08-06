var clsId;
var page = 0;
var name;
$(function(){
	
		mui.init({
				swipeBack: true, //启用右滑关闭功能
				pullRefresh: {
					container: ".list_game", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
					up: {
						height: 50, //可选.默认50.触发上拉加载拖动距离
						auto: true, //可选,默认false.自动上拉加载一次
						contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
						contentnomore: '没有更多内容了', //可选，请求完毕若没有更多数据时显示的提醒内容；
						callback: up //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
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
		
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		clsId = self.clsId;
		name = self.name;
		$('.game_nameHeader').text(name);
	});
	/* 点击标签跳转 */
	$('body').on('tap','.game_list',function(){
		mui.openWindow({
			url:"game_detail.html",
			id:"game_detail.html",
			extras:{
				gameId:$(this).attr('data-id')
			}
		})
	});
	
	$('body').on('tap','.tag',function(e){
		e.stopPropagation()
		tagId = $(this).attr('data-id');
		tagName = $(this).text();
       mui.openWindow({
			url: "game_classify_list.html",
			id: "game_classify_list.html",
			extras: {
				tagId: tagId,
				tagName: tagName
			}
		})
	});
	
			
			function up(){
				page++;
				$.ajax({
					type:"get",
					url:config.data + "game/getGameByCls",
					async:true,
					data:{
						clsId:clsId,
						sys:1,
						page:page
					},
					success:function(data){
						if (data.state) {
							var g = data.gameList;
							var li = '';
							for (var i = 0; i < g.length; i++) {
								var signs = '';
								
								if(g[i].tagNameList){
									var result= g[i].tagNameList.split(",");
									var resultId = g[i].tagIdList.split(",");
									if (result.length <= 3) {
										for (var j = 0; j < result.length; j++) {
											signs +=
												"<div style='white-space:nowrap;'  class='fl tag font_12 border_green border_radius_twenty' data-id='"+ resultId[j] +"'>"+ result[j] +"</div>"
										}
									} else{
										for (var j = 0; j < 3; j++) {
											signs +=
												"<div style='white-space:nowrap;' class='fl tag font_12 border_green border_radius_twenty' data-id='"+ resultId[j] +"'>"+ result[j] +"</div>"
										}
									}
									
								}
								li +=
								 		"<li class='game_list ofh' data-id="+ g[i].id +">"+
											"<div class='color_9e9e9e  game_listScore'>"+ ((page-1)*20 + i+1) +"</div>"+
											"<div class='game_listImg ' style='background-image: url("+ config.img + encodeURI(g[i].icon) +");'></div>"+
											"<div class='' style='margin-top: 1.25rem;margin-left: 0.875rem;'>"+
												"<div class='font_14 overflow'>"+ g[i].game_name +"</div>"+
												"<div class='font_12'>"+
													"<div class='ofh game_recommend_stars'>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_starScore fl color_green'>"+ g[i].grade +"</div>"+
													"</div>"+
												"</div>"+
												"<div style='display:flex;width:11rem;'  class='font_12 color_green'>"+
												  signs +								
												"</div>"+
											"</div>"+
											"<div class='game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>"+
										"</li>"
							}
							
							$('.game_lists').append(li);
							$('.game_recommend_stars').each(function(){
				
								var score =  $(this).find('.game_recommend_starScore').eq(0).text()
								var starNum = Math.round(score)
								
								
								if (starNum % 2 == 0) {
									
									var starFinal = (starNum / 2 - 1 ); 
									$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_active')
									$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
								} else{
									var starFinal = ((starNum - 1)/2)
									$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
									$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_half')
								}
							})
							
							if (g.length < 20) {
								mui('.list_game').pullRefresh().endPullupToRefresh(true);
							} else{
								mui('.list_game').pullRefresh().endPullupToRefresh(false);
							}
	
						} else{
							
						}
					}
				});
				
				
			}
			
			function down() {
				window.location.reload();
				setTimeout(function() {
					mui('.list_game').pullRefresh().endPulldown(true);
				}, 1000);

			}
})
