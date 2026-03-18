$(document).ready(function(){
	/* 상세검색 열고닫기 */
	$(".btn_detail_search").click(function(){
		$(".detail_search_wrap").show();
		return false;
	});
	$(".detail_search_btn").click(function(){
		$(".detail_search_wrap").hide();
		return false;
	});

	/*레이어팝업사라짐*/
	$(".layer_popup .bg,.layer_popup .btn_close,.layer_popup .close").click(function(){
		$(".layer_popup").removeClass("is_visible");
		$(".save_alert").fadeOut('fast');
		$("html").css("overflow","auto");	
		return false;
	});

	$(".savetoast").delay(2000).fadeOut();
	$(".alim_toast").delay(1500).fadeOut();

	/*레이어팝업*/
	$("#btn_update").click(function(){
		$("#update_popup").addClass("is_visible");
		$("html").css("overflow","hidden");
		return false;
	});

	/*대시보드컨트롤러*/
	$(".dash_contrl .btn_dbcontrl").click(function(){
		$(".dash_contrl").toggleClass("show");
		return false;
	});
	$(".dash_contrl .ctrl_close").click(function(){
		$(".dash_contrl").removeClass("show");
		return false;
	});

	/*저장확인*/
	$(".btn_box .btn_save").click(function(){
		$(".save_alert_wrap").show();		
		return false;
	});
	$(".save_alert .cancel").click(function(){
		$(".save_alert_wrap").hede();		
		return false;
	});

	$(".action_type>ul>li>a").click(function(){
		$(this).toggleClass("on").next().toggle();
		return false;
	});

	/*오름&내림차순*/
	$(".sort_column").click(function(){
		$(this).find("div").addClass("order_on").toggleClass("des");
		return false;
	});

	/*엔트리 옵션추가팝업*/
	$(".entry_name .btn_option").click(function(){
		$(this).parent().next(".option_list").toggle();
		return false;
	});

	/*엔트리 클릭*/
	$(".entry_top ul li a").click(function(){
		$(this).addClass("on").parent().siblings("li").find("a").removeClass("on");
		return false;
	});

	$(".entry_connect .entry_name").click(function(){
		$(this).parents(".entry_connect").find(".setting01").show();
		$(this).parents(".entry_connect").find(".entry_setting").not(".setting01").hide();
		return false;
	});
	$(".entry_connect .option01").click(function(){
		$(this).parents(".entry_connect").find(".setting02").show();
		$(this).parents(".entry_connect").find(".entry_setting").not(".setting02").hide();
		return false;
	});
	$(".entry_connect .option02").click(function(){
		$(this).parents(".entry_connect").find(".setting03").show();
		$(this).parents(".entry_connect").find(".entry_setting").not(".setting03").hide();
		return false;
	});
	$(".entry_connect .option03").click(function(){
		$(this).parents(".entry_connect").find(".setting04").show();
		$(this).parents(".entry_connect").find(".entry_setting").not(".setting04").hide();
		return false;
	});

	$(".entry_gather .option01").click(function(){
		$(this).parents(".entry_gather").find(".setting01").show();
		$(this).parents(".entry_gather").find(".entry_setting").not(".setting01").hide();
		return false;
	});
	$(".entry_gather .entry_name").click(function(){
		$(this).parents(".entry_gather").find(".setting02").show();
		$(this).parents(".entry_gather").find(".entry_setting").not(".setting02").hide();
		return false;
	});
	$(".entry_gather .option02").click(function(){
		$(this).parents(".entry_gather").find(".setting03").show();
		$(this).parents(".entry_gather").find(".entry_setting").not(".setting03").hide();
		return false;
	});

	$(".entry_execute .option01").click(function(){
		$(this).parents(".entry_execute").find(".setting01").show();
		$(this).parents(".entry_execute").find(".entry_setting").not(".setting01").hide();
		return false;
	});
	$(".entry_execute .entry_name").click(function(){
		$(this).parents(".entry_execute").find(".setting02").show();
		$(this).parents(".entry_execute").find(".entry_setting").not(".setting02").hide();
		return false;
	});
	$(".entry_execute .option02").click(function(){
		$(this).parents(".entry_execute").find(".setting03").show();
		$(this).parents(".entry_execute").find(".entry_setting").not(".setting03").hide();
		return false;
	});

	$(".entry_execute_err .entry_name").click(function(){
		$(this).parents(".entry_execute_err").find(".setting01").show();
		$(this).parents(".entry_execute_err").find(".entry_setting").not(".setting01").hide();
		return false;
	});
	$(".entry_disconnect .entry_name").click(function(){
		$(this).parents(".entry_disconnect").find(".setting01").show();
		$(this).parents(".entry_disconnect").find(".entry_setting").not(".setting01").hide();
		return false;
	});

	/*엔트리 설정 닫침*/
	$(".transper_bg").click(function(){
		$(".entry_setting").hide();
		$(".entry_top ul li a").removeClass("on");
		return false;
	});
	/*조건추가팝업*/
	$(".cdt_btn>.btn_box>a").click(function(){
		$(this).parent().next().toggle();
		return false;
	});
	/*textarea,언어선택 팝업*/
	$(".btn_txta,.lang_wrap>a").click(function(){
		$(this).next().toggle();
		return false;
	});

	/*마우스 오버시 도움말표시*/
	$(".form_contrl").hover(function(){
		$(this).next(".entry_help").toggle();
	});
	$(".btn_entry_help").hover(function(){
		$(this).next(".entry_help02").toggle();
	});

	/* 메뉴 */
	$(".btn_lnb a").click(function(){
		$("#SGIM_wrap").toggleClass("mini_nav");
		return false;
	});
	$(window).resize(function(){
		$width=$(window).width();
		if($width<768){
			$("#SGIM_wrap").removeClass("mini_nav");
		}
	});
	$(".nav_list li ul").css("display","none");
	$(".nav_list>li>.depth_menu").click(function(){
		$(this).toggleClass("on").next().toggleClass("open").parent().siblings().find(".depth_menu").removeClass("on").next().removeClass("open");
		$(this).next().slideToggle();
		return false;
	});

	$(".btn_lnb_m a").click(function(){
		$("#SGIM_wrap").toggleClass("show_nav");
		return false;
	});

	$("a.fm_tit").click(function(){
		$(this).next().toggleClass("hideform");
		return false;
	});

	$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
     //console.log(scroll);
    if (scroll >= 100) {
        //console.log('a');
        $(".topPrss").addClass("scrollPrss");
    } else {
        //console.log('a');
        $(".topPrss").removeClass("scrollPrss");
    }
	});

	$(".btn_dropdown").click(function(){
		$(this).next().slideToggle(200);
		return false;
	});

	// 오류 토스트 
	$(".err_toast").click(function(){
		$(this).toggleClass("open");
		return false;
	});
	$(".warning_toast").click(function(){
		$(this).toggleClass("open");
		return false;
	});

	$(".month_slt .form_contrl.year").click(function(){
		$(this).toggleClass("on");
		$(this).next().fadeToggle();
		return false;
	});

	$(".errcode_dt_btn").click(function(){
		$(this).toggleClass("open");
		$(this).parent().next().slideToggle(200);
		return false;
	});

	$(".tn_slt .fm_tit").click(function(){
		$(".tab_arrow").removeClass("open");
		$(".slt_list").slideDown(200);
	})
	$(".db_server_row").click(function(){
		$(this).parent(".db_detail").toggleClass("open");
	})
})