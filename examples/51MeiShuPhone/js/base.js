$(function(){

	$('nav#slideMenu').mmenu({
		position: "right"
	});
	$(".closeSlideMenu").click(function(){
		$("#slideMenu").trigger("close");
	});
	$(".openSlideMenu").click(function(){
		$("#slideMenu").trigger("open");
		$('html, body').scrollTop(0);
	});
	$(".goTop").click(function(){
		$('html, body').animate({"scrollTop": 0},200);
	});
	$(".slideMenu > h3").each(function(index){
		$(this).click(function(){
			if($(this).hasClass('add')) {
				$(this).removeClass('add').addClass('minus');
				$(this).next('div').slideDown();
			} else if ($(this).hasClass('minus')) {
				$(this).removeClass('minus').addClass('add');
				$(this).next('div').slideUp();
			}
		});
	});
	$(".huashi > h3, .schoollist > h3").each(function(index){
		$(this).click(function(){
			if($(this).hasClass('add2')) {
				$(this).removeClass('add2').addClass('minus2');
				$(this).next('ul').slideDown();
			} else if ($(this).hasClass('minus2')) {
				$(this).removeClass('minus2').addClass('add2');
				$(this).next('ul').slideUp();
			}
		});
	});
});