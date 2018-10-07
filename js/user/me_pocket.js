
var coin=0;
mui.plusReady(function() {

	$.ajax({
		type: "get",
		url: config.data + "users/getUserMyCoin",
		async: true,
		data: {
			uid: userId
		},
		success: function(data) {
			$(".me_goldInfoLeft>div:last-child").html(data.coin + "<span>币</span>")
			coin=data.coin;
		}
	})
	
	
	
	

	$("body").on("tap", ".topheadright", function() {
		mui.openWindow({
			url:"me_dealrecord.html",
			id:"me_dealrecord.html",
		})
	})
	
	
	$("body").on("tap", ".me_goldInforight", function() {
		mui.openWindow({
			url: "me_withdraw.html",
			id: "me_withdraw.html",
			extras:{
				coin:coin
			}
		})

	})
	$("body").on("tap", ".voucher_header", function() {

		var no = $(this).siblings(".voucher_getgoldcontent").css("display")

		if(no == "none") {
			$(this).find("a").removeClass("mui-icon-arrowdown")
			$(this).find("a").addClass("mui-icon-arrowup")
			$(this).siblings(".voucher_getgoldcontent").css("display", "flex")
		} else {
			$(this).find("a").removeClass("mui-icon-arrowup")
			$(this).find("a").addClass("mui-icon-arrowdown")
			$(this).siblings(".voucher_getgoldcontent").css("display", "none")
		}

	})
    
    
    $("body").on("tap",".voucher_getgoldto",function(){

    	var mean=$(this).attr("data-mean")
    	switch(mean){
    		case "signin":
    		  mui.openWindow({
    		  	url:"me_signin.html",
    		  	id:"me_signin.html"
    		  })
    	}
    })




})
