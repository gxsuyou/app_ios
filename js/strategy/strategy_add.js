var strategyId;
var token;
var userId = localStorage.getItem("userId") || 22;
var imgNum = 0;

//	发帖子
var imgArray=[];
$(function() {
	mui.plusReady(function(){
		plus.webview.currentWebview().setStyle({
            softinputMode: "adjustResize"  // 弹出软键盘时自动改变webview的高度
        });
	});

	//	点击选择图片
	$('.choose_game').css({'border-radius':'20px','background-color':'#e6ebec'})
	var h = $(window).height()
	$(window).resize(function() {
		var changeHeight = $(window).height();
		if(changeHeight < h) {
			$('.show_imgs,.img_num').addClass('hidden')
			$('.choose_img').css('bottom', '0')
			$('.choose_game').css('bottom','2.625rem')
		} else {
			$('.show_imgs,.img_num').removeClass('hidden')
			$('.choose_img').css('bottom', '10.625rem')
			$('.choose_game').css('bottom','13.25rem')
		}
	});


   $("body").on("tap","#choose_img",function(e){
      setTimeout(function(){
		if(mui.os.plus) {
			var buttonTit = [
				{
					title: "从手机相册选择"
				}
			];
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
		
		 },500);
	});

	$('body').on('tap', '.delete_img', function() {
		$(this).parent().parent('.show_imgcontent').remove()
		$('.img_num').text($('.show_imgs > .show_imgcontent').length + "/9")
	})

		
	$("body").on("focus","#strategy_textarea",function(){
		setTimeout(function(){
			var scrollY=$('#strategy_textarea')[0].scrollHeight;
           $('#strategy_textarea').animate({scrollTop:scrollY},200);        
		},200);
	});
	

   $("body").on("keyup","#strategy_textarea",function(){
		$("#strategy_textarea span,#strategy_textarea div").css("-webkit-user-select","text");
		 
	});

  

	
	$('body').on("tap",".publish",function() {
	var content="<div>"+$("#strategy_textarea").html()+"</div>";

    var indexSrc=$("#strategy_textarea img:first").attr("src");
    if(indexSrc!==undefined){
	    var indexImg=indexSrc;
    }else{
	    indexImg=""
    }

		var str = $('.strategy_title').val();
	 	var title = str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
		var gameName = $('.choose_game').val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");

		if(title && content && gameName){
			mui.toast("正在发布，请等待");
			$.ajax({
				type: "post",
				url: config.data + "strategy/addStrategyMsg",
				async: true,
				data: {
					userId: userId,
					title:title,
					detail:content,
					gameName:gameName,
					top_img_src:indexImg
				},
				success: function(data) {
					if(data.state){					
			          $("#strategy_textarea").html("");
		              $(".strategy_title").val("");
		              $(".choose_game").val("");
				     setTimeout(function(){
				     	mui.toast("上传成功");
				        mui.back();				        
			          },4000);					 
					} else {
	                   mui.toast("上传失败");
					}
				}
			});
		}else{
			mui.toast("标题及内容和游戏名不能为空")
		}
	})

	//	发帖子结束
	
})


// 从相册中选择图片   
function galleryImgs() {
	// 从相册中选择图片 
	$("#strategy_textarea").focus();
	plus.gallery.pick(function(e) {
//  mui.toast("正在上传,请等待");
        var rename=Math.round(Math.random()*100)+e.files[0];
    
    plus.zip.compressImage({
			src:e.files[0],
			dst:rename,
			quality:50
		},
		function(k) {
			    console.log(JSON.stringify(k))
			    var size=k.size/1024;
			    if(size>1024){
			    	mui.toast("图片尺寸过大，请压缩后再上传");
			    	return false;
			    }
//			    return false;
			    mui.toast("正在上传,请等待");
			    
				var uploader = plus.uploader.createUpload(config.url_upload+"adminStrategy/img?title=strategy&url="+config.url_upload,{
					method: "post"
				}, function(t, status) {
					 var res =JSON.parse(t.responseText);
					 console.log(t.responseText);
					  if(res.errno==0){
						  var src=res.data[0];
//						  appendHtml("<img style='width:98%;height:auto;' src="+src+"/>");	
						  insertTextAtSelection("<img style='width:98%;height:auto;' src="+src+"/>","html");
//						  $("#strategy_textarea").append("<img style='width:98%;height:auto;' src="+src+"/>")
					  }else{
						  mui.toast("上传图片失败")
					  }
		
				});

				uploader.addFile(k.target,{
					"key": "file"
				}); // 固定值，千万不要改！！！！！！				
				uploader.start();
			
            },function(error) {
			    console.log("Compress error!");
	    });
    

	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum:1,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择1张图片');
		}
	});
}



   $("body").on("tap","#strategy_textarea",function(){
		$("#strategy_textarea span,#strategy_textarea div").css("-webkit-user-select","text");
		var text = '';
        insertTextAtSelection(text);
	});
	


function insertTextAtSelection(text, mode) {
    var _this = this;
    var sel, range, node;
    mode = mode || '';
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            // range.deleteContents();
            var textNode = document.createTextNode(text);
            if (mode == "html") {
                var el = document.createElement("div");
                el.innerHTML = text;
                var frag = document.createDocumentFragment(),
                    node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                sel.removeAllRanges();
                range = range.cloneRange();
                sel.addRange(range);
            } else {
                console.log(JSON.stringify(textNode));
                
                range.insertNode(textNode);
                range.selectNode(textNode);
            }
        }
    }
}
// });
 
//插入图片
//function appendHtml(src){
// 
// alert(1)
// if(window.getSelection){
//
//   $("#strategy_textarea").focus()
//	if (sel.getRangeAt && sel.rangeCount){	   
//			range = sel.getRangeAt(0);
//          range.deleteContents();
//          var el =document.createElement("div");
//			el.innerHTML =src;
//			var frag = window.parent.document.createDocumentFragment(), node, lastNode;
//          while ((node = el.firstChild)) {
//              lastNode = frag.appendChild(node);
//          }
//      range.insertNode(frag);
//		    if(lastNode) {
//          range = range.cloneRange();
//          range.setStartAfter(lastNode);
//          range.collapse(true);
//          sel.removeAllRanges();
//          sel.addRange(range);
//          }
//		}
// } else if (document.selection && document.selection.type != "Control") {
//          document.selection.createRange().pasteHTML(html);
//   }
//}
//


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
		uploader.addFile(path,{
			"key": "file"
		}); // 固定值，千万不要改！！！！！！
		
		uploader.start();
	})
}

//function getUpToken(scope, key, callback) {
//	$.ajax({
//		type: "get",
//		url: config.data + "users/getUptokenByMsg",
//		async: true,
//		data: {
//			scope: scope,
//			key: key
//		},
//		success: function(data) {
//			token = data.upToken;
//			return callback(token)
//		}
//	});
//}

//上传到七牛的function结束

