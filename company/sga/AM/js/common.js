$(document).ready(function(){
	$("p.btn_allcategory a").click(function(){
		$(this).toggleClass("on");
		$(".nav_allcategory").toggle();
		return false;
	});
	$(".main_menu>ul>li>a:gt(0)").click(function(){
		$(this).next().slideToggle().parent().toggleClass("on");
		return false;
	});
	$("p.btn_tree a").toggle(function(){
		$(this).addClass("on")
		$(".tree_wrap").animate({"left":"0px"},300,'swing');
		return false;
	},function(){
		$(this).removeClass("on")
		$(".tree_wrap").animate({"left":"-242px"},300,'swing');
		return false;
	});
	$("p.btn_lnb a").click(function(){
		$(this).toggleClass("on")
		$(".lnb_wrap").toggleClass("left0");
		$("#container").toggleClass("ml0");
		return false;
	});

	$(window).resize(function(){
		$width=$(window).width();
		if($width>1280){
			$(".nav_allcategory").hide();
			$("p.btn_allcategory a").removeClass("on");
		}else if($width<1280){
			$("#cantainer").css({"margin-left":"0px"})
		}
	});
	$(".list_btn .btn_work").click(function(){
		$(this).next(".dropdown_btn,.droptop_btn").toggle();
		return false;
	});
	$(".btn_drdown").click(function(){
		$(this).next(".dropdown_btn").toggle();
		return false;
	});
	$(".list_btn .btn_column").click(function(){
		$(".column_setting").addClass("is_visible");
		$("html").css("overflow","hidden");
		return false;
	});
	$(".list_btn .btn_add").click(function(){
		$(".system_add").addClass("is_visible");
		$("html").css("overflow","hidden");
		return false;
	});
	$(".layer_popup .bg,.layer_popup .btn_close,.layer_popup .close").click(function(){
		$(".layer_popup").removeClass("is_visible");
		$(".save_alert").fadeOut('fast');
		$("html").css("overflow","auto");	
		return false;
	});
	$(".btn_box .btn_save_add").click(function(){
		$(".save_alert").fadeIn('fast');		
		return false;
	});
	$(".btn_box .btn_save_add,.btn_box .btn_detail_save").click(function(){
		$(".save_alert").fadeIn('fast');		
		return false;
	});
	$(".save_alert .cancel").click(function(){
		$(".save_alert").fadeOut('fast');		
		return false;
	});

	/*media 속도조절 보이기*/
	$(".playerbtn .speed").click(function(){
		$(".speed_btn").fadeToggle('fast');
		return false;
	});

	/* 알림보기 */
	$(".user_area .btn_alam a").click(function(){
		$(".layer_alim").toggle();
		$(this).toggleClass("on");
		return false;
	});

	/* 메뉴얼 다운 */
	$(".user_area .btn_download a").click(function(){
		$(".layer_menual").toggle();
		$(this).toggleClass("on");
		return false;
	});
	/* 서버상태 확인 */
	$(".user_area .btn_server a").click(function(){
		$(".layer_serverstatus").toggle();
		$(this).toggleClass("on");
		return false;
	});

	/* 상세검색열기 */
	$(".btn_detail_search").click(function(){
		$(".detail_search_wrap").show();
		return false;
	});	
	/* 상세검색닫기 */
	$(".detail_search_btn").click(function(){
		$(".detail_search_wrap").hide();
		return false;
	});


})