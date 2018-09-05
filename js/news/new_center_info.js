var name;
var type;
mui.plusReady(function() {
	var self = plus.webview.currentWebview()
	name = self.name;
	type = self.type;
	$(".newinfor_nameHeader").text(name)

	var info_arr = []
	var content = ""
	var numContent = ""
	$.ajax({
		type: "get",
		url: config.data + "users/getNoticeInfo",
		async: true,
		data: {
			uid: userId,
			type: type
		},
		success: function(data) {
			for(i = 0; i < data.length; i++) {               
				content += "<div class='new_list'>" +
					"<div class='new_time'>" + data[i].addTime + "</div>" +
					"<div>" +
					"<div class='new_contents'>" +
					"<div class='new_icon' style='background-image:url("+data[i].img+")'></div>" +
					"<div class='new_content'>" + data[i].detail + "</div>" +
					"</div>" +
					"</div>"

			}
			$(".new_lists").empty().append(content)

		}
	})


})