$(document).ready(function(){
	
	
	$(".contact-li1").mouseover(function(){
		$("#contact-text").html("http://woerwosi.com");
	}).mouseout(function(){
		$("#contact-text").html("欢迎您");
	});

	$(".contact-li2").mouseover(function(){
		$("#contact-text").html("china_victory@sina.cn");
	}).mouseout(function(){
		$("#contact-text").html("欢迎您");
	});

	$(".contact-li3").mouseover(function(){
		$("#contact-text").html("http://weibo.com/512364662");
	}).mouseout(function(){
		$("#contact-text").html("欢迎您");
	});

	$(".contact-li4").mouseover(function(){
		$("#contact-text").html("Tel : (+86) 1567 5809 110");
	}).mouseout(function(){
		$("#contact-text").html("欢迎您");
	});

});
