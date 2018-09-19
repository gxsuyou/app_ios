var strategyId;
var token;
var userId = localStorage.getItem("userId") || 22;
var imgNum = 0;

//	发帖子
var imgArray = [];
$(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});
	});

	//	点击选择图片
	$('.choose_game').css({
		'border-radius': '20px',
		'background-color': '#e6ebec'
	})
	var h = $(window).height()
	$(window).resize(function() {
		var changeHeight = $(window).height();
		if(changeHeight < h) {
			$('.show_imgs,.img_num').addClass('hidden')
			$('.choose_img').css('bottom', '0')
			$('.choose_game').css('bottom', '2.625rem')
		} else {
			$('.show_imgs,.img_num').removeClass('hidden')
			$('.choose_img').css('bottom', '10.625rem')
			$('.choose_game').css('bottom', '13.25rem')
		}
	});

	getStrategy()

	function getStrategy() {
		var strategy_title = window.localStorage.getItem("strategy_title");
		var strategy_game = window.localStorage.getItem("strategy_game");
		var strategy_content = window.localStorage.getItem("strategy_content");
		console.log(strategy_title, strategy_game, strategy_content);

		if(strategy_title != "" || strategy_game != "", strategy_content != "") {
			$(".strategy_title").val(strategy_title)
			$(".choose_game").val(strategy_game)
			$("#strategy_textarea").html(strategy_content)
		}
	}
	/*返回查询是否保存攻略*/
	$("body").on("tap", ".strategy-back", function() {
		var title = $(".strategy_title").val()
		var game = $(".choose_game").val()
		var content = $("#strategy_textarea").html()

		if(content == '<div>&nbsp;</div><span class="insertNode1" style="-webkit-user-select:text"></span>') {
			content = ""
		}

		if(title != "" || game != "" || content != "") {

			plus.nativeUI.confirm("保存攻略", function(e) {
				if(e.index == 0) {
					console.log("您要保存攻略")
					window.localStorage.setItem("strategy_title", title)
					window.localStorage.setItem("strategy_game", game)
					window.localStorage.setItem("strategy_content", content)

				} else {
					window.localStorage.setItem("strategy_title", "")
					window.localStorage.setItem("strategy_game", "")
					window.localStorage.setItem("strategy_content", "")
					console.log("您不要保存攻略")
				}
				var my_yue = plus.webview.getWebviewById('html/strategy/strategy.html');
				mui.fire(my_yue, 'refresh'); //刷新攻略首页
				mui.back()
			})

		} else {
			mui.back()
		}

	})

	$('body').on('tap', '.delete_img', function() {
		$(this).parent().parent('.show_imgcontent').remove()
		$('.img_num').text($('.show_imgs > .show_imgcontent').length + "/9")
	})

	$("body").on("focus", "#strategy_textarea", function() {
		$('#strategy_textarea').css("height", "50%");
		setTimeout(function() {
			var scrollY = $('#strategy_textarea')[0].scrollHeight - 300;
			//			console.log("滚动"+scrollY);
			$('#strategy_textarea').animate({
				scrollTop: scrollY
			}, 0);
		}, 100);
	});

	$("body").on("blur", "#strategy_textarea", function() {
		$('#strategy_textarea').css("height", "75vh");
	});

	$("body").on("keyup", "#strategy_textarea", function() {
		console.log($(this).html())
		$("#strategy_textarea span,#strategy_textarea div,#strategy_textarea p").css("-webkit-user-select", "text");
	});

	$('body').on("tap", ".publish", function() {
		var content = "<div>" + $("#strategy_textarea").html() + "</div>";

		var indexSrc = $("#strategy_textarea img:first").attr("src");
		if(indexSrc !== undefined) {
			var indexImg = indexSrc;
		} else {
			indexImg = ""
		}

		var str = $('.strategy_title').val();
		var title = str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
		var gameName = $('.choose_game').val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");

		if(gameName.length > 8) {
			mui.toast("游戏名不能超过8个字");
			return false;
		}

		if(title && content && gameName) {
			mui.toast("正在发布，请等待");
			$.ajax({
				type: "post",
				url: config.data + "strategy/addStrategyMsg",
				async: true,
				data: {
					userId: userId,
					title: title,
					detail: content,
					gameName: gameName,
					top_img_src: indexImg
				},
				success: function(data) {
					if(data.state) {
						$("#strategy_textarea").html("");
						$(".strategy_title").val("");
						$(".choose_game").val("");
						setTimeout(function() {
							mui.toast("上传成功");
							mui.back();
						}, 4000);
					} else {
						mui.toast("上传失败");
					}
				}
			});
		} else {
			mui.toast("标题及内容和游戏名不能为空")
		}
	})

	//	发帖子结束

})

$("body").on("tap", "#strategy_textarea", function() {
	$("#strategy_textarea span,#strategy_textarea div,#strategy_textarea p").css("-webkit-user-select", "text");
});

var insertNum = 1,
	insertNode = "insertNode1";

function appendHtml() {
	var sel, range;
	if(window.getSelection) {
		var sel = window.getSelection();
		if(sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
			var el = document.createElement("span");
			insertNode = "insertNode" + insertNum;
			el.innerHTML = "<span  class='" + insertNode + "'></span>";
			insertNum++; //编号加起来 
			var frag = window.parent.document.createDocumentFragment(),
				node, lastNode;
			while((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}
			range.insertNode(frag);
			if(lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
		console.log($("#strategy_textarea").html())
	}
}

$("body").on("tap", "#choose_img", function(e) {
	appendHtml(); //放入节点  	    
	setTimeout(function() {
		if(mui.os.plus) {
			var buttonTit = [{
				title: "从手机相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "上传图片",
				cancel: "取消",
				buttons: buttonTit
			}, function(b) { /*actionSheet 按钮点击事件*/

				switch(b.index) {
					case 0:
						break;
					case 1:
						galleryImgs(); /*打开相册*/
						break;
					default:
						break;
				}
			})
		}

	}, 500);
});

// 从相册中选择图片   
function galleryImgs() {
	// 从相册中选择图片 

	plus.gallery.pick(function(e) {
		//  mui.toast("正在上传,请等待");
		var rename = Math.round(Math.random() * 100) + e.files[0];

		plus.zip.compressImage({
				src: e.files[0],
				dst: rename,
				quality: 35
			},
			function(k) {
				console.log(JSON.stringify(k))
				var size = k.size / 1024;
				if(size > 1024) {
					mui.toast("图片尺寸过大，请压缩后再上传");
					return false;
				}
				mui.toast("正在上传,请等待");

				var uploader = plus.uploader.createUpload(config.url_upload + "adminStrategy/img?title=strategy&url=" + config.url_upload, {
					method: "post"
				}, function(t, status) {
					var res = JSON.parse(t.responseText);
					console.log("已上传成功" + t.responseText);
					$('#strategy_textarea').css("height", "75vh"); //增加高度
					if(res.errno == 0) {
						var src = res.data[0];
						$("." + insertNode).eq(0).append("<img style='width:98%;height:auto;border:none;' src=" + src + "/>");
					} else {
						mui.toast("上传图片失败")
					}
				});

				uploader.addFile(k.target, {
					"key": "file"
				}); // 固定值，千万不要改！！！！！！				
				uploader.start();

			},
			function(error) {
				mui.toast("网络错误，请稍后重试!")
				console.log("Compress error!");
			});
		[]

	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum: 1,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择1张图片');
		}
	});
}

//function appendHtml(src){
//	
//	$("."+insertNode).eq(0).append(src);
//	console.log($("#strategy_textarea").html())
//	return false;
// var sel, range;
// if(window.getSelection){
//	var sel=window.getSelection();
//	if (sel.getRangeAt && sel.rangeCount) {
//			range = sel.getRangeAt(0);
//          range.deleteContents();
//    var el =document.createElement("div");
//			el.innerHTML =src;
//			var frag = window.parent.document.createDocumentFragment(), node, lastNode;
//      while ((node = el.firstChild)) {
//          lastNode = frag.appendChild(node);
//      }
//      range.insertNode(frag);
//		if (lastNode) {
//          range = range.cloneRange();
//          range.setStartAfter(lastNode);
//          range.collapse(true);
//          sel.removeAllRanges();
//          sel.addRange(range);
//      }
//	}else{
//		$("#strategy_textarea").append(src);
//	}
// }
//}

//插入图片
//function appendHtml(src){
////	$('#strategy_textarea').focus()
////	alert(document.execCommand('insertImage','false',src));
////	document.execCommand('insertImage','false',src);
////	alert($('#strategy_textarea').html())
////	return false;
// if(window.getSelection){
//   //sel = window.getSelection();
//   //console.log(11+sel.getRangeAt,"22"+sel.rangeCount);
//	if (getRangeAt && rangeCount){	   
////			range = sel.getRangeAt(0);
////			console.log("33"+range.toString());
//         
//          var el =document.createElement("div");
//			el.innerHTML =src;
//			var frag = window.parent.document.createDocumentFragment(), node, lastNode;
//			
//			
//			alert(el.firstChild)
//          while ((node = el.firstChild)) {
//          	alert(1)
//              lastNode = frag.appendChild(node);
//          }
//          
//           console.log(666+lastNode);
//          
//          range.insertNode(frag);
//		    if(lastNode) {
//              range = range.cloneRange();
//              range.setStartAfter(lastNode);
//              range.collapse(true);
//              sel.removeAllRanges();
//              sel.addRange(range);
//          }
//		     alert($("#strategy_textarea").html())
//		}
// } else if (document.selection && document.selection.type != "Control") {
//          document.selection.createRange().pasteHTML(html);
//   }
//}

//	选择图片结束
//上传图片
function upLoad(strategyId, key, path) {
	getUpToken('img', key, function(token) {
		var url = "http://upload-z2.qiniup.com/";
		var uploader = plus.uploader.createUpload(url, {
			method: "post"
		}, function(t, status) {
			if(status == 200) {
				console.log(JSON.parse(t.responseText).key)
				$.ajax({
					type: "get",
					url: config.data + "strategy/addStrategyImg",
					async: true,
					data: {
						strategyId: strategyId,
						img: JSON.parse(t.responseText).key
					},
					success: function(data) {

						mui.back()
					}
				});
			} else {
				console.log("上传失败 - ", status);
				mui.toast("上传图片失败")
			}

		});

		uploader.addData("key", key);
		uploader.addData("token", token);
		uploader.addFile(path, {
			"key": "file"
		}); // 固定值，千万不要改！！！！！！

		uploader.start();
	})
}