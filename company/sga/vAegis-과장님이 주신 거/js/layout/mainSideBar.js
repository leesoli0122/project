
$(function(){
	lf_lnbEvt();
	lf_currentPage();
});

function lf_lnbEvt(){
	$('.lnb').on('mouseenter', function() {
		$('.lnb').parent().parent().addClass('on');
	});
	$('.header_box').on(
			'mouseleave',
			function() {
				$(this).removeClass('on');
				if ($('.lnb > li.has_children > .depth2 > li > a').hasClass(
						'on')) {
					$('.lnb > li.has_children > a').parent().removeClass(
							'active');
					$('.lnb > li.has_children > .depth2 > li > a.on').parent()
							.parent().parent().addClass('active');
				} else {
					$('.lnb > li.has_children > a').parent().removeClass(
							'active');
				}
			});
	if ($('.lnb > li > ul').hasClass('depth2')) {
		$('.lnb > li > ul').parent().addClass('has_children');
	}
	if ($('.lnb > li > ul > li > ul').hasClass('depth3')) {
		$('.lnb > li > ul > li > ul').parent().addClass('has_children');
	}
	$('.lnb > li.has_children > a').attr('href', '#');
	$('.lnb > li.has_children > a').on('click', function(e) {
		e.preventDefault();
		$(this).parent().siblings('li.has_children').removeClass('active');
		$(this).parent().addClass('active');
		
	});
	
	$('.lnb li > a').each(function(){
		if($(this).is('[menu-id]')){
			$(this).click(function(){
				cf_menuClick($(this).attr('menu-id'));
			});
		}
	});

}


//현재 선택된 메뉴 style 적용
function lf_currentPage() {
	var locationUrl = $(location).attr('pathname');
	var dom = $('.lnb li').find('a[href="' + locationUrl + '"]');
	var dom1 = $('.lnb li.has_children').find('a[href="' + locationUrl + '"]');
	$(dom).addClass('on');
	$(dom1).addClass('on');
	$(dom).parents('li').addClass('active');
	$(dom1).parents('li.has_children').addClass('active');
}

