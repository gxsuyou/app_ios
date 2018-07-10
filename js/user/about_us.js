$(function(){
	mui.plusReady(function(){
		var backHeight = plus.navigator.getStatusbarHeight();
		var finalHeight = parseInt(backHeight) + 11 + "px";
		$('.back').css('top',finalHeight);
	});
	$('body').on("tap",".back",function(){
		mui.back()
	})
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
        $('.version').text(`版本 : ${inf.version}`)
   });
})
