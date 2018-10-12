mui.plusReady(function() {
	init()

	$("body").on("tap", ".mui-table-view-cell", function() {
		var show = $(this).find(".voucher_contents").css("display")
		if(show == "none") {
			$(this).find(".voucher_contents").css("display", "block")
			$(this).find(".mui-icon").removeClass("mui-icon-arrowdown")
			$(this).find(".mui-icon").addClass("mui-icon-arrowup")
		} else {
			$(this).find(".voucher_contents").css("display", "none")
			$(this).find(".mui-icon").addClass("mui-icon-arrowdown")
			$(this).find(".mui-icon").removeClass("mui-icon-arrowup")
		}

	})

	$("body").on("tap", ".voucher_contents,.commendTicketUse", function(e) {
		e.stopPropagation()
		var name = $(this).find(".voucher_get").children("div:last-child").text()
		if(name != "去使用") {
			mui.toast("正在审核中")
			return;
		}

		var tu_id = $(this).attr("data-tu_id")
		var icon_href = $(this).attr("data-icon_href")
		var game_name = $(this).attr("data-game_name")
		var game_id = $(this).attr("data-game_id")

		mui.openWindow({
			url: "me_checkvoucher.html",
			id: "me_checkvoucher.html",
			extras: {
				tu_id: tu_id,
				icon_href: icon_href,
				game_name: game_name,
				game_id: game_id
			},
			createNew: true
		})
	})

	/* 未使用的优惠券  */
	$("body").on("tap", ".voucher_nav>div:first-child", function() {
		$(".voucher_nav>div:last-child").removeClass("border_bottom color_green")
		$(this).addClass("border_bottom color_green")
		$("#voucher_nouse").css("display", "block")
		$("#voucher_use").css("display", "none")

	})

	/* 使用的优惠券  */
	$("body").on("tap", ".voucher_nav>div:last-child", function() {
		$(".voucher_nav>div:first-child").removeClass("border_bottom color_green")
		$(this).addClass("border_bottom color_green")
		$("#voucher_nouse").css("display", "none")
		$("#voucher_use").css("display", "block")
		aluse()
	})

	/*到使用规则*/
	$("body").on("tap", ".userule", function() {
		mui.openWindow({
			url: "voucher_userule.html",
			id: "voucher_userule.html"
		})
	})

	function aluse() {
		$.ajax({
			type: "get",
			url: config.data + "users/getMyTicket",
			async: true,
			data: {
				uid: userId,
				stateType: 2,
				sys: 1
			},
			success: function(data) {
				var content = ""
				for(var i = 0; i < data.length; i++) {
					var ticket = data[i].mytickets
					for(var n = 0; n < ticket.length; n++) {
						if(ticket[n].state == 2) {
							content += "<li>" +
								"<div class='voucher_val' style='color:#7a7a7a'>" +
								"<div>" + "￥ <span>" + ticket[n].coin + "</span>" + "</div>" +
								"<div>满" + ticket[n].a_coin + "元可用</div>" +
								"</div>" +
								"<div class='voucher_get'>" +
								"<div><span>" + "【" + data[i].game_name + "】" + "</span>" + "充值满" + ticket[n].a_coin + "元可返还" + ticket[n].coin + "元" + "</div>" +
								"<img style='width:3.3rem;height:2.7rem;margin-left:0.5rem;' src='../../Public/image/voucher_aluse.png' />" +
								"</div>" +
								"</li>"
						}
					}
				}
				$("#voucher_use>img").remove()
				$("#voucher_use>.voucher_uselist").empty().append(content)

				var getlistNums = $("#voucher_use>.voucher_uselist>li").length
				if(getlistNums == 0) {
					$("#voucher_use").append("<img  src='../../Public/image/wuneirong.png' style='display:block;width:50%;margin:0 auto;margin-top:6rem;'  />")
				}

			}
		})
	}

})

function init() {
	$.ajax({
		type: "get",
		url: config.data + "users/getMyTicketCommon",
		async: true,
		data: {
			uid: userId,
			sys: 1
		},
		success: function(data) {
			var commendTicket = "";
			if(data.length > 0) {
				$(".commendTicket").css("display", "block")

				for(var i = 0; i < data.length; i++) {
					if(data[i].state == 3) {
						var use = "<span>正在审核...</span>"
					} else {
						var use = "<div>去使用</div>"
					}
					commendTicket += "<li style='background:url(../../Public/image/me_voucherbg.png) no-repeat center /100% 100%;' data-tu_id='" + data[i].id + "' class='commendTicketUse'>" +
						"<div class='voucher_val'>" +
						"<div>" +
						"￥ <span>" + data[i].coin + "</span>" +
						"</div>" +
						"<div>" +
						"满" + data[i].a_coin + "元可用" +
						"</div>" +
						"</div>" +
						"<div class='voucher_get'>" +
						"<div>" +
						"活动专区任意游戏充值满" + data[i].a_coin + "元可返还" + data[i].coin + "元" +
						"</div>" +
						use +
						"</div>" +
						"</li>"
				}
				$("#voucher_nouse>img").remove()
				$(".commendTicketContents").empty().append(commendTicket)
			} else {
				$(".commendTicket").css("display", "none")
			}
		}
	})

	$.ajax({
		type: "get",
		url: config.data + "users/getMyTicket",
		async: true,
		data: {
			uid: userId,
			sys: 1
		},
		success: function(data) {
			if(data.length > 0) {
				//          if(0) {
				var content = ""
				for(var i = 0; i < data.length; i++) {

					var ticket = data[i].mytickets
					var mytickets = ""
					var t_nums = data[i].t_num;

					if(t_nums) {
						var infoNum = "<div class='voucher_info_num'>" + data[i].t_num + "</div>"
					} else {
						var infoNum = ""
					}

					for(var n = 0; n < ticket.length; n++) {

						var isNew = ticket[n].is_new

						if(isNew) {

							var isNewImages = "style='background:url(../../Public/image/me_voucherbg_new.png) no-repeat center /100% 100%;'";
						} else {
							var isNewImages = "style='background:url(../../Public/image/me_voucherbg.png) no-repeat center /100% 100%;'";
						}

						if(ticket[n].state == 3) {
							var use = "<span>正在审核...</span>"
						} else {
							var use = "<div>去使用</div>"
						}

						mytickets +=
							"<ul data-game_id='" + data[i].game_id + "'  " + isNewImages + "   data-tu_id='" + ticket[n].tu_id + "' data-icon_href='" + config.img + data[i].icon + "'  data-game_name='" + data[i].game_name + "' class='voucher_contents'>" + "<li>" +
							"<div class='voucher_val' >" +
							"<div>" +
							"￥ <span>" + ticket[n].coin + "</span>" +
							"</div>" +
							"<div>" +
							"满" + ticket[n].a_coin + "元可用" +
							"</div>" +
							"</div>" +
							"<div class='voucher_get'>" +
							"<div>" +
							"<span>" +
							"【" + data[i].game_name + "】" +
							"</span>" +
							"充值满" + ticket[n].a_coin + "元可返还" + ticket[n].coin + "元" +
							"</div>" +
							use +
							"</div>" +
							"</li>" +
							"</ul>"

					}

					content += "<li class='mui-table-view-cell'  >" +
						"<div class='voucher_header'>" +
						"<img src='" + config.img + data[i].icon + "' />" +
						data[i].game_name +
						"<div>" +
						infoNum +
						"<a class='mui-icon mui-icon-arrowdown'></a>" +
						"</div>" +
						"</div>" +
						mytickets +
						"</li>"
				}
				$("#voucher_nouse>img").remove()
				$("#voucher_nouse>.mui-table-view>li:not('.commendTicket')").remove()
				$("#voucher_nouse>.mui-table-view").append(content)

			} else {
				/*没有东西的情况下*/
				var com = $(".commendTicket").css("display")
				if(com == "none") {
					$("#voucher_nouse").append("<img  src='../../Public/image/wuneirong.png' style='display:block;width:50%;margin:0 auto;margin-top:6rem;'  />")
				}
			}

		}
	})

}

window.addEventListener('reload', function() {
	init()
})