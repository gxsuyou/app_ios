var infoName;

mui.plusReady(function(){
	var self = plus.webview.currentWebview()
	infoName=self.infoName;
	$(".newinfor_nameHeader").text(infoName)
	
	
	var content="";
	
	content="<div class='new_list'>"+
	 "<div class='new_time'>"+"9月20日   14:30"+"</div>"+
	 "<div>"+
	 "<div class='new_contents'>"+
	  "<div class='new_icon' style='background-image:url(../../Public/image/center_info_fuli.png)'></div>"+
	  "<div class='new_content'>"+"活动内容描写XXXX，XXXXXX活动内容描写XXXXXXXXXX，活动内容描写XXXX，XXXXXX活动内容描写XXXXXXXXXX。活动内容描写XXXX，XXXXXX活动内容描写XXXXXXXXXX。"+"</div>"
	 +"</div>"
	+"</div>"
	
	$(".new_lists").append(content)
	
	
})
