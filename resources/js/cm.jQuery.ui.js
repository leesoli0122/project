/****************************************/
/*	Name: 7-ELEVEN
/*	PART: java script
/*	Version: 1.0
/*	Author: [애드캡슐 퍼블리싱팀] 박현아, 최웅, 윤정환
/****************************************/

$(function(){
	/*
		Part : GNB
		Author : 박현아
	*/

	var $headTop = $('.header_top');
	var $gnb = $('#gnb'),
		$gnbLi = $gnb.find('>li'),
		$gnbA = $gnbLi.find('>a');

	var $subGnb = $gnbLi.find('>ul'),
		$subGnbLi = $subGnb.find('>li'),
		$subGnbA = $subGnbLi.find('>a');

	if($gnbLi.is('.active')){
		$gnbLi.filter('.active').find('ZDEL_img').attr('src', $gnbLi.filter('.active').find('ZDEL_img').attr("src").replace('_off.png', '_on.png'));
	}
	
	jQuery.headTopFn = function(state){
		if(state == false){
			$headTop.removeClass('on').stop().animate({
				'height': '120px'
			}, function(){
				$subGnb.css('height', '0');
			});
			$('.utils').removeClass('on');
			$('.utils ul').addClass('hide');

		}else{
			$headTop.addClass('on').stop().animate({
				'height': '306px'
			});
			$subGnb.css('height', 'auto');
			if(!$('.utils').is('.on')){
				$('.utils ul').removeClass('hide');
			}
		}
	};//end headTopFn

	jQuery.gnbReplace = function($this, state){
		$gnbLi.each(function(){
			$(this).find('ZDEL_img').attr('src', $(this).find('ZDEL_img').attr("src").replace('_on.png', '_off.png'));
		});
		$gnbLi.removeClass('on');
		if(state == true){
			if($this.parent().is('#gnb')){
				$this.addClass('on');
			}else{
				$this.parent().parent().addClass('on');
			}
			
			$gnbLi.filter('.on').find('ZDEL_img').attr('src', $gnbLi.filter('.on').find('ZDEL_img').attr("src").replace('_off.png', '_on.png'));
		}else{
			if($gnbLi.is('.active')){
				$gnbLi.filter('.active').find('ZDEL_img').attr('src', $gnbLi.filter('.active').find('ZDEL_img').attr("src").replace('_off.png', '_on.png'));
			}
		}
	}; //end jQuery.gnbReplace

	$gnbLi.on('mouseenter focusin', function(){
		$.headTopFn(true);
		$.gnbReplace($(this), true);
	})

	$gnbA.on('focusin', function(){
		$.headTopFn(true);
	});
	
	$headTop.on('mouseleave', function(){
		$.headTopFn(false);
		$.gnbReplace($gnbLi, false);
	}); //end mouseleave
	
	$('.main #container a:eq(0)').on('focusin', function(){
		$.headTopFn(false);
		$.gnbReplace($gnbLi, false);
	});

	var winWidth = $(window).outerWidth();
	
	if(winWidth <960){
		$('.sub #header').css('position', 'static');
		$('.sub #header .header_top').css('position', 'absolute');
		//$('.sub #container').css('padding-top', '43px');
	}else{
		$('.sub #header').css('position', 'fixed');
		$('.sub #header .header_top').css('position', 'absolute');
		$('.sub #container').css('padding-top', '160px');
	}

	$(window).resize(function(){
		var winWidth = $(window).outerWidth();
	
		if(winWidth <960){
			$('.sub #header').css('position', 'static');
			$('.sub #header .header_top').css('position', 'absolute');
			//$('.sub #container').css('padding-top', '43px');
		}else{
			$('.sub #header').css('position', 'fixed');
			$('.sub #header .header_top').css('position', 'absolute');
			$('.sub #container').css('padding-top', '160px');
		}
	});


	/*
		Part : HEAD LINE MAP
		Author : 박현아
	*/

	var $lineMap = $('.line_map > ul'),
		$lineMapLi = $lineMap.find('>li'),
		$lineMapA = $lineMapLi.find('>a');
	
	$('.sub_menu').hide();
	
	/*2014-09-28 박현아 수정*/
	$lineMapA.on('focusin',function(){
		$headTop.removeClass('on').stop().animate({
			'height': '120px',
			'position': 'fixed'
		}, function(){
			$subGnb.css('height', '0');
		});
		$('.sub .header_bottom').stop().animate({
			'margin-top': '0'
		});
		$('.utils ul').addClass('hide');
	});
	
	$lineMapA.on('click focusin', function(event){
		if(!$(this).parent().is('.depth3')){
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			if($(this).parent().is('.on')){
				$lineMapLi.removeClass('on');
				$('.sub_menu').hide();
			}else{
				$lineMapLi.removeClass('on');
				$(this).parent().addClass('on');
				$(this).next().show();
			}
		}
		
		var subLiLen =  $(this).next().find('li').length-1;
		$(this).next().find('li').eq(subLiLen).find('a').attr('id', 'subLastLi');
	});
	

	$('.sub_menu a ').on('keydown', function(event){
		var index = $(this).parent().index();
		var len = $(this).parent().parent().find('li').length-1;

		var isShift = window.event.shiftKey ? true : false;

		if(index == 0){
			if(isShift && (event.keyCode == 9)){
				//return false;
				setTimeout(function(){$("#subLastLi").focus()},1);

			}
		}
		if(isShift && (event.keyCode == 9)){
			return;
		}else if(event.keyCode == 9){
			if(index == len){
				//return false;
				$(this).parent().parent().prev().focus();
			}
			
		}
	}); //end keydown

	/*
		Part : HEAD UTIL
		Author : 박현아
	*/

	var $utils = $('.head_util .utils > a'),
		$utilStore = $('.head_util .util_store'),
		$btnHappy = $('.head_util .btn_happy'),
		$headUtilA = $('.head_util > a');

	$utils.on('mouseenter focusin', function(){
		$headUtilA.removeClass('on');
		$(this).addClass('on');
		$.gnbReplace($gnbLi, false);
	});

	$utils.on('mouseleave', function(){
		$(this).removeClass('on');
	});

	$utils.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		if(!$headTop.is('.on')){
			$(this).parent().addClass('on');
			$(this).next().removeClass('hide');
		}
	});
	
	$('.head_util .utils>ul > li > a').on('mouseenter', function(){
		$.gnbReplace($gnbLi, false);
	});


	$headUtilA.on('mouseenter focusin', function(){
		$utils.removeClass('on');
		$headUtilA.removeClass('on');
		$btnHappy.find('.info').addClass('hide');
		$(this).addClass('on');

		if($(this).is('.btn_happy')){
			$(this).find('.info').removeClass('hide');
		}
		$.gnbReplace($gnbLi, false);
	});



	$headUtilA.on('mouseleave focusout', function(){
		$utils.removeClass('on');
		$headUtilA.removeClass('on');
		$btnHappy.find('.info').addClass('hide');
	});

	/*
		Part : skipMenu focus 시
		Author : 박현아
	*/

	var $skipMenu = $('.skipMenu a');

	$skipMenu.on('focusin', function(){
		$('#header').css('position', 'relative');
		$('#container').css('padding-top', '0');
		$('.header_top').css('position', 'relative');
		$('.header_bottom').css('margin-top', '0');
		$.headTopFn(false);
	});

	$skipMenu.on('focusout', function(){
		$('.sub #header').css('position', 'fixed');
		$('.sub #container').css('padding-top', '160px');
		$('.main #container').css('padding-top', '120px');
		$('.header_top').css('position', 'absolute');
		//$('.header_bottom').css('margin-top', '120px'); 2014-09-28 박현아 삭제
	});

	/*
		Part : 프로덕트 셀렉트 박스
		Author : 박현아
	*/
	var $selBox = $('.sel_box'),
		$selBoxA = $selBox.find('strong > a'),
		$selBoxDiv = $selBox.find('.sel_list'),
		$selBoxUl = $selBox.find('ul'),
		$selBoxLi = $selBoxUl.find('li'),
		$selBoxLiA = $selBoxLi.find('a');
	var selBoxLen = $selBox.length;
	$selBoxDiv.hide();

	$selBoxA.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		if($(this).parent().parent().is('.on')){
			$selBox.removeClass('on');
			$selBoxDiv.hide();
		}else{
			$selBox.removeClass('on');
			$selBoxDiv.hide();
			$(this).parent().next().show();
			$(this).parent().parent().addClass('on');
		}
		
	}); //end click
	
	$selBoxA.on('focusin', function(){
		$selBoxDiv.hide();
	});

	/*
		Part : 키워드 검색 배경 이미지
		Author : 박현아
	*/

	//검색 input
	var $keywordInput = $('.keyword_src');
	
	//검색 인풋 포커스 될 때 배경 삭제
	$keywordInput.on('focusin', function(){
		$(this).addClass('on')
	}); //end keyword_src focuin

	//검색 인풋 포커스 아웃될 때 값 유무에 따라 배경 삭제
	$keywordInput.on('focusout', function(){
		if($(this).val() == ''){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}//end if
	}); //end keyword_src focuout

	/*
		Part : 문의점포 라디오버튼
		Author : 박현아
	*/

	var $btnRadioTab = $('.btn_radio_tab');
	
	$('.cont_tab_radio').hide();
	$('.cont_tab_radio').eq(0).show();



	$btnRadioTab.on('click', function(){
		var chk = $(this).val()-1;
		$('.cont_tab_radio').hide();
		$('.cont_tab_radio').eq(chk).show();

	});

	/*
		Part : 회사연혁 탭
		Author : 박현아
	*/

	var $historyTab = $('.tab_filter.history'),
		$historyTabLi = $historyTab.find('>li'),
		$historyTabA = $historyTabLi.find('>a');

	var $wrapHistory = $('.wrap_history');
	
	var $historyContTab = $('.history_cont .tab_layer'),
		$historyContTabLi = $historyContTab.find('>li'),
		$historyContTabA = $historyContTabLi.find('>a');

	var $contHistory =$('.history_cont .cont_history').not('.history_cont.type02 .cont_history');

	$wrapHistory.not(':eq(0)').hide();

	$historyTabA.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;

		var index = $(this).parent().index();
		
		var tabTxt = $(this).html()
		
		var subTabTxt = $historyContTabLi.filter('.on').find('a').html();

		if(index == 0){
			var lineMap =subTabTxt + ' | ' + tabTxt + ' | 회사연혁  | 회사소개 | ABOUT 7-ELEVEN | 7-ELEVEN | 세븐일레븐';

		}else {
			var lineMap = tabTxt + ' | 회사연혁  | 회사소개 | ABOUT 7-ELEVEN | 7-ELEVEN | 세븐일레븐';
		}
		
		$historyTabLi.removeClass('on');
		$(this).parent().addClass('on');

		$wrapHistory.hide();
		$wrapHistory.eq(index).show();

		
		$(document).attr('title', lineMap);
	});

	$contHistory.not(':eq(0)').hide();
	
	$historyContTabA.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		var index = $(this).parent().index();

		var tabTxt = $(this).html();
		var lineMap = tabTxt + " | 2010's | 회사연혁  | 회사소개 | ABOUT 7-ELEVEN | 7-ELEVEN | 세븐일레븐";

		$historyContTabLi.removeClass('on');
		$(this).parent().addClass('on');
		$contHistory.hide();
		$contHistory.eq(index).show();

		$(document).attr('title', lineMap);
	});

	/*
		Part : FOOTER
		Author : 박현아
	*/
	var $familySite = $('.wrap_site strong a'),
	$familySiteUl = $('.wrap_site>.wrap_family'),
	$familySiteUlLi = $familySiteUl.find('>ul>li')
	$familySiteLi = $familySiteUl.find('li'),
	$familySiteA = $familySiteLi.find('a');


	var familySiteUlH = $familySiteUl.outerHeight()-1;

	$familySiteUl.css('top', -familySiteUlH);
	$familySiteUl.hide();

	$familySite.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		if($(this).is('.on')){
			$familySiteUl.hide();
			$(this).removeClass('on');	
		}else{
			$familySiteUl.show();
			$(this).addClass('on');	
		}
	});//end familySite click

	$familySiteA.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		var listText = $(this).html();
		var listSrc = $(this).attr('href');

		$familySiteUl.hide();
		$familySite.removeClass('on').focus();
		$familySite.text(listText);
		$('.btn_go').attr('href', listSrc);

	});
	
	$('.btn_go, .footer_util li a').on('focusin', function(){
		$familySiteUl.hide();
	});

	/*
		Part : Document click 시 드롭다운 메뉴 닫히기
		Author : 박현아
	*/
	
	/*
		Part : policyPrivacy
		2014-11-14 개인정보처리 방침 
	*/
	var $policyWrap  = $('.wrap_policy strong a'),
	$policyWrapUl = $('.wrap_policy>.wrap_policy_prev'),
	$policyWrapUlLi = $policyWrapUl.find('>ul>li')
	$policyWrapLi = $policyWrapUl.find('li'),
	$policyWrapA = $policyWrapLi.find('a');


	var policyWrapUlH = $policyWrapUl.outerHeight()-1;

	$policyWrapUl.css('top', -policyWrapUlH);
	$policyWrapUl.hide();

	$policyWrap.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		if($(this).is('.on')){
			$policyWrapUl.hide();
			$(this).removeClass('on');	
		}else{
			$policyWrapUl.show();
			$(this).addClass('on');	
		}
	});//end policyWrap click

	$policyWrapA.on('click', function(event){
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		var listText = $(this).html();
		var listSrc = $(this).attr('href');

		$policyWrapUl.hide();
		$policyWrap.removeClass('on').focus();
		$policyWrap.text(listText);
		$('.pbtn_go').attr('href', listSrc);

	});
	
	$('.pbtn_go').on('focusin', function(){
		$policyWrapUl.hide();
	});

	/*
		Part : Document click 시 드롭다운 메뉴 닫히기
		Author : HYS
	*/



	var except = $('.wrap_site, .line_map, .sel_box');

	$(document).on('click', function(event){
		if(!$(event.target).parents().is(except)){
			/*패밀리 사이트*/
			$familySiteUl.hide();
			$familySite.removeClass('on');

			/*line map*/
			$lineMapLi.removeClass('on');
			$('.sub_menu').hide();

			/*프로덕트 셀렉트 박스*/
			$selBox.removeClass('on');
		}
			
	});



/******************************************************************************
*	용도		:	product 상품 이미지 리스트 만들기 js
*	버전		:	1.0
*	참고사항	:	
*	제작		:	w
*******************************************************************************/
		

		jQuery.productList = function(){
			
			var aniTime = 300;
			var iLiength = $('.img_list > ul > li').length
			var z = 0
			

			var listType = 1
			var listTypeNum
			var listWidth
			var boxWidth

			if($('.img_list').attr('class') == "img_list img_list_01")
			{
				listType = 1
			}
			else if($('.img_list').attr('class') == "img_list img_list_02")
			{
				listType = 2
			}
			
			switch(listType)
			{
				case 1:
					listTypeNum = 5
					listWidth = 192
					boxWidth = 374
					boxWidth2 = 191
				break;
				case 2:
					
					listTypeNum = 3
					listWidth = 320
					boxWidth = 311
					boxWidth2 = 319
				break;

			}
			
			
			
			for(var i = 0 ; i < (iLiength/listTypeNum) ; i ++)
			{
				
				for(var j = 0 ; j < listTypeNum ; j ++)
				{
					if((z % listTypeNum) == listTypeNum-1)
					{
						$('.img_list > ul > li').eq(z).css({'top':i*191,'right':'-1px'})
						$('.img_list > ul > li').eq(z).find('a').css({'float':'left'})
					}
					else
					{
						$('.img_list > ul > li').eq(z).css({'top':i*191,'left':j*listWidth})
					}
						// 이미지 리스트 좋아요 가운데 정렬
						//$('.img_list > ul > li').eq(z).find('.like_wrap').css({'margin-left':-($('.img_list > ul > li').eq(z).find('.like_wrap').width()/2)})
						
					
					z++
				}
			}

			


			
			// 더보기 후 높이 조절
			if(iLiength%listTypeNum != 0)
			{
				$(".btn_more").remove()
				if(iLiength%listTypeNum == 1)
				{
					$(".img_list").css({'height':191*((iLiength - 1)/listTypeNum)+5})
				}
				else
				{
					$(".img_list").css({'height':191*(parseInt(iLiength/listTypeNum)+1)+5})
				}
			}
			else
			{
				$(".img_list").css({'height':191*(iLiength/listTypeNum)+5})
			}
			
			if($('.img_list').attr('class') != undefined)
			{
				if($('.img_list').attr('class') == "img_list img_list_01 img_list_01_02")
				{
					if(iLiength < listTypeNum*2)
					{
						$(".btn_more").remove()
					}
				}
				else
				{
					if(iLiength < listTypeNum*3)
					{
						$(".btn_more").remove()
					}
				}
			}

		

/******************************************************************************
*	용도		:	product 상품 이미지 리스트 마우스 이벤트 js
*	버전		:	1.0
*	참고사항	:	
*	제작		:	w
*******************************************************************************/

		
// 이미지 리스트 타입1에 마우스 오버 및 포커스 이벤트
		
		
		$(document).on("mouseover focusin",".img_list > ul > li > .btn_product_01",function(){
			
			/** 2014-09-15 박현아 수정 | $(this).index() > $(this).parent().index() **/
			if($(this).parent().index() != 0 && $(this).parent().index() != iLiength -1)
			{
				if($(this).parent().attr('class') != "btn_more")
				{
					
					if(($(this).parent().index() % listTypeNum) == listTypeNum-1)
					{
						$(this).parent().css({'float':'right'})
					}
					
					$('.img_list > ul > li').css({'z-index':'2'})
					if(listType == 1)
					{
						$(this).parent().css({ 'border':'5px solid #dadbdd','z-index':'3','height':'182px'}).stop().animate({'width':boxWidth}, aniTime)
						
						$(this).css({'width':boxWidth})
						
						$(this).parent().addClass('on')
					}
					else if(listType == 2)
					{
						$(this).parent().css({ 'border':'5px solid #dadbdd','z-index':'3','height':'182px', 'width':boxWidth})
						

						$(this).parent().addClass('on')
						
					}

					
					
					
				}
			}
			
		});
		$(document).on("mouseout focusout",".img_list > ul > li > .btn_product_01",function(){
			
			
			if($(this).parent().index() != 0)
			{
				
				if(listType == 1)
				{
					$(this).parent().css({ 'border':'1px solid #d7d7d7','height':'190px'}).stop().animate({'width':boxWidth2}, aniTime, function(){
						$(this).parent().css({ 'z-index':'2'})
					})
					
					$(this).css({'width':boxWidth2})	
					
					$(this).parent().removeClass('on')
				}
				else if(listType == 2)
				{
					$(this).parent().css({ 'border':'1px solid #d7d7d7','height':'190px', 'width':boxWidth2, 'z-index':'2'})
					
					$(this).parent().removeClass('on')
				}
				
				
			}
		});

		
// 이미지 리스트 타입2에 마우스 오버 및 포커스 이벤트
		
		$(document).on("mouseover focusin",".img_list > ul > li > .btn_product_02",function(){
			if($(this).parent().index() != 0 && $(this).index() != iLiength -1)
			{
				$(this).find('.product_layer').css({'opacity':'1'})
			}
			
		});
		$(document).on("mouseout focusout",".img_list > ul > li > .btn_product_02",function(){
			if($(this).parent().index() != 0)
			{
				
				$(this).find('.product_layer').css({'opacity':'0'})
			}
		});
		
/******************************************************************************
*	용도		:	product 상품 반투명 상세보기 관련 이벤트
*	버전		:	1.0
*	참고사항	:	
*	제작		:	w
*******************************************************************************/

	// 처음에 반투명 상세보기 숨김
	$('.product_layer').css({'opacity':'0'})


	// 반투명 상세보기 오버아웃 이벤트
	$(document).on("mouseover focusin",".btn_product_01",function(){
		$(this).find('.product_layer').css({'opacity':'1'})	
	});
	$(document).on("mouseout focusout",".btn_product_01",function(){
		$(this).find('.product_layer').css({'opacity':'0'})
	});		

	}
		$.productList();
/******************************************************************************
*	용도		:	레이어팝업 js
*	버전		:	1.0
*	참고사항	:	
*	제작		:	w
*******************************************************************************/
	



var $btnThis;
	//레이어 팝업 오픈 이벤트
			$(document).on("click",".layer_open, .layer_open2, .store_open",function(event){
				event.preventDefault ? event.preventDefault() : event.returnValue = false;
				//**팝업 로드 스크립트
				var href = $(this).attr('href');
				$.fnLayerOepn(href);
				$btnThis = $(this);
			}); //end layer_open

	jQuery.fnLayerOepn = function(href){
		if($('.layer_pop_wrap').length >1){
			return false;
		}else{
			
			$('#container , #wrap_happy').append('<div class="layer_pop_wrap"></div>');
				
			var href = href + ' #layer';
			
			$('.layer_pop_wrap').load(href,function(){
				if($(this).parents().is('#wrap_happy')){
					//온라인 행복충전소 딤처리
					$('.overlayerBg').css({'width':$(window).width(),'height':$(document).height(),'opacity':"0.6"})
				}else{
					$('.overlayerBg').css({'width':$(window).width(),'height':$('#wrap').height(),'opacity':"0.6"})
				}

				var layerContH = $('.layer_pop').outerHeight();
				var layerContW = $('.layer_pop').outerWidth();

				if(layerContH > 600)
				{
					$(this).find('.wrap_table').css({'height': '367px','overflow-y':'scroll'});					
					$('.layer_body').css({'overflow-y':'auto'});
				}
				
				var marginT = $(window).scrollTop() + ($(window).height() - layerContH) / 2;
				var offsetL = ($(window).width()/2) - (layerContW/2);
				
				$(this).offset({left: offsetL, top:marginT});
				$('.layer_pop_wrap a:first').attr('tabindex', '0').show().focus();

				/*2014-09-15 박현아 수정 | 버튼외에 폼태그요소가 먼저 올수있음*/
				$('.layer_pop_wrap').attr('tabindex', '0').focus();
				if($(this).find('.store_find')){
					$.storeFn();
				}
				
				

			})//end load
			$('#container, #wrap_happy').append('<div class="overlayerBg"></div>');
		} //end if
		
	}

	
	//레이어 팝업 클로즈 이벤트
			$(this).on("click",".layer_close",function(){	
				
				$('.layer_pop_wrap').remove();
				$('.overlayerBg').remove();
				setTimeout(function(){$(".layer_open").focus()},50);
				//$btnThis.focus();
				return false;
			});
/*
	//시프트 + 탭 포커스
			$(document).on("keydown",".layer_pop_wrap a:first",function(){	
			
				
				var isShift = window.event.shiftKey ? true : false;
				
				if(isShift && (event.keyCode == 9)){
					//$(".layer_close").attr('tabindex', '0').show().focus()
						$('.layer_pop_wrap a:').attr('tabindex', '0').focus();
					return false;
				} //end if
			}); //end keydown


	// 탭 포커스
			$(this).on("keydown",".layer_pop_wrap a:last",function(){	
			
				
				var isShift = window.event.shiftKey ? true : false;
				
				if((!isShift && event.keyCode == 9)){
					$('.layer_pop_wrap').attr('tabindex', '0').focus();
					//$('.layer_pop_wrap a:first').attr('tabindex', '0').show().focus()
					return false;
				} //end if
			}); //end keydown*/
/*
			$(this).on('keydown', '.layer_pop_wrap', function(event){
				//var totalPopALen = $('.layer_pop_wrap a').length-1;
				var isShift = window.event.shiftKey ? true : false;

				if((isShift && event.keyCode == 9)){
					
					if($(event.target).is('.layer_pop_wrap')){
						$('.layer_pop_wrap a.btnRe').attr('tabindex', '0').show().focus()
					}

					
				}
			});
			
*/
	/*** 2014-09-15 박현아 수정 | 레이어 팝업 폼 태그 반영 ***/
	$(this).on('keydown', '.layer_pop_wrap a', function(event){
		
		var totalPopALen = $('.layer_pop_wrap a').length-1;
		var index = $(this).index();
		var isShift = window.event.shiftKey ? true : false;
		
		/*2014-09-28 박현아 수정*/
		if(!isShift && event.keyCode == 9){
			/*if(index == totalPopALen){
				$('.layer_pop_wrap').attr('tabindex', '0').focus();
			}*/

			if($(event.target).is('.layer_pop_wrap a:last')){
				$('.layer_pop_wrap').attr('tabindex', '0').focus();
			}
		}
		
	});
	
	$(this).on('keydown', '.layer_pop_wrap', function(event){
		
		var totalPopALen = $('.layer_pop_wrap a').length-1;
		var isShift = window.event.shiftKey ? true : false;

		if((isShift && event.keyCode == 9)){

			if($(event.target).is('.layer_pop_wrap')){
				
				setTimeout(function(){
					$('.layer_pop_wrap a:last').focus();
				}, 100);


				

			}
			//$('.layer_pop_wrap').find('.btnRe').focus();
		}
	});

	// 레이어팝업 윈도우 리사이징시 이벤트
		
		$(window).resize(function () {
			if($('.overlayerBg').height() != null)
			{
					resizeFunc()
			}	
		});

		
			
		

		function resizeFunc()
		{
			
			$('.overlayerBg').css({'width':$(window).width()})


			var layerContH = $('.layer_pop').outerHeight();
			var layerContW = $('.layer_pop').outerWidth();

			
			
			var marginT = $(window).scrollTop() + ($(window).height() - layerContH) / 2;
			var offsetL = ($(window).width()/2) - (layerContW/2)
			

			$('.layer_pop_wrap').offset({left: offsetL, top:marginT});
			
		}


	/*
		PART :  FAQ
		Author : 박현아
	*/

	var $listFag = $('.list_faq'),
		$listFagLi = $listFag.find('li'),
		$listFagA = $listFagLi.find('a'),
		$answer = $('.answer');

	$listFagA.on('click', function(){
		var $thisParents = $(this).parent().parent(),
			$thisAnswer = $(this).parent().next();
		
		var thisAnswerH = $thisAnswer.find('.cont_answer').outerHeight();
		thisParentsH = $thisParents.outerHeight();


		if($thisParents.is('.on')){
			$listFagLi.removeClass('on');
			$listFagA.attr('title', '답변 열기');
			$answer.stop().animate({
				'height': '0',
				'padding-top': '0',
				'padding-bottom': '0'
			});

			return false;
		}else{
			$listFagLi.removeClass('on');
			$thisParents.addClass('on');

			$listFagA.attr('title', '답변 열기');
			$(this).attr('title', '답변 닫기');
			
			$answer.stop().animate({
				'height': '0',
				'padding-top': '0',
				'padding-bottom': '0'
			});

			$thisAnswer.stop().animate({
				'height': thisAnswerH,
				'padding-top': '0',
				'padding-bottom': '20px'
			}, function(){
				$('html, body').animate({scrollTop: $thisParents.position().top - (thisParentsH * 2)});
			});
		}

		return false;

	}); //end $listFagA click

	/*
		PART : 가맹개설 안내 탭
		Author : 박현아
	*/

	var $tabLayer = $('.tab_filter.contPage'),
		$tabLayerLi = $tabLayer.find('li'),
		$tabLayerA = $tabLayerLi.find('a');

	var $tabCont = $('.information_tab_cont');

	//초기 탭 보여주기
	$tabCont.not($tabCont.eq(0)).hide();

	$tabLayerA.on('click', function(event){
		//prevent default action (hyperlink)
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		
		var index = $(this).parent().index();
		var lineMap = ' | 가맹개설안내 | 창업가이드 | FRANCHISE | 7-ELEVEN | 세븐일레븐';
		var tabTxt = $(this).text();
		
		// 탭 활성화
		$tabLayerLi.removeClass('on');
		$(this).parent().addClass('on');
		
		// 탭 내용 보여주기
		$tabCont.hide();
		$tabCont.eq(index).show();

		// 페이지 타이틀 해당 탭 타이틀로 변경
		$(document).attr('title', tabTxt + lineMap);
	}); //end tab click*/

	/*
		PART : 지점찾기 탭
		Author : 박현아
	*/



	jQuery.storeFn = function(){

		var $storeTab = $('.tab_store'),
			$storeTabLi = $storeTab.find('li'),
			$storeTabA = $storeTabLi.find('a');

		var $storeTabCont = $('.cont_store');

		$storeTabCont.not($storeTabCont.eq(0)).hide();

		$storeTabA.on('click', function(event){
			//prevent default action (hyperlink)
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			
			var index = $(this).parent().index();
			
			$storeTabLi.removeClass('on');
			$(this).parent().addClass('on');

			$storeTabCont.hide();
			$storeTabCont.eq(index).show();
		});

		var storeLaySido = $("#storeLaySido option:selected").val();
		var storeLayGu = $("#storeLocationGu").val();
		storeLayGu = encodeURIComponent(storeLayGu);
		$.ajax({
			url : "/library/asp/StoreGetGugun.asp",
			type: "post",
			data : "Sido="+ storeLaySido + "&Gu="+ storeLayGu + "&selName=storeLayGu",
			datatype : "html",
			timeout : 1000,
			error : function() {
				alert("네트워크 접속이 원활하지 않습니다.");
			},
			success : function(getData) {
				$("#storecatetd2").html("");
				$("#storecatetd2").html(getData);
			}
		});

		$("#storeLaySido").change(function(){  
			var storeLaySido = $("#storeLaySido option:selected").val();
			$.ajax({
				url : "/library/asp/StoreGetGugun.asp",
				type: "post",
				data : "Sido="+ storeLaySido + "&selName=storeLayGu",
				datatype : "html",
				timeout : 1000,
				error : function() {
					alert("네트워크 접속이 원활하지 않습니다.");
				},
				success : function(getData) {
					$("#storecatetd2").html("");
					$("#storecatetd2").html(getData);
				}
			});
		});
	}
	
	jQuery.Fn_store_search = function(storeflag){
		if (storeflag == "1"){
			var storeLaySido = $("#storeLaySido").val();
			var storeLayGu = $("#storeLayGu").val();
			storeLayGu = encodeURIComponent(storeLayGu);
			$.ajax({
				url : "/util/storeLayerPop.asp",
				type: "post",
				data : "storeLaySido="+ storeLaySido + "&storeLayGu="+storeLayGu + "&hiddentext=none",
				datatype : "html",
				timeout : 1000,
				error : function() {
					alert("네트워크 접속이 원활하지 않습니다.");
				},
				success : function(getData) {
					$("#layer").html("");
					$("#layer").html(getData);
					$.storeFn();
					
					$("#storeForm").attr("target", "mapifrmAction");
					$("#storeForm").attr("enctype", "application/x-www-form-urlencoded");
					$("#storeForm").attr("action","/util/mapifrmAction.asp").submit();

					$("#storeButton1").focus();
				}
			});			
		}else {
			var storeText = $("#storeText").val();
			$.ajax({
				url : "/util/storeLayerPop.asp",
				type: "post",
				data : "storeText="+storeText + "&hiddentext=none",
				datatype : "html",
				timeout : 1000,
				error : function() {
					alert("네트워크 접속이 원활하지 않습니다.");

				},
				success : function(getData) {
					$("#layer").html("");
					$("#layer").html(getData);
					$.storeFn();
					var $storeTab = $('.tab_store'),
						$storeTabLi = $storeTab.find('li'),
						$storeTabA = $storeTabLi.find('a');
						$storeTabA.click();
						

					$("#storeForm").attr("target", "mapifrmAction");
					$("#storeForm").attr("enctype", "application/x-www-form-urlencoded");
					$("#storeForm").attr("action","/util/mapifrmAction.asp").submit();
					storePopupTimer = setTimeout(function()
					   {
						$("#storeButton2").focus();
					   }, 10);

					
					
				}
			});			
		}
	}

	/*
		PART : 사회공헌안내 탭
		Author : 최웅
	*/
	var aniTime = 300;
	$('.list_info').slideUp(0) 

	$('.tit_info a').on('click', function(){
		$(this).parent().next().slideToggle(aniTime, function(){
			if($(this).is(":hidden")){
			$(this).prev().find('a').removeClass('on')
				
			}
			else{
			$(this).prev().find('a').addClass('on')	
			
			}
		})
		return false;	
	});

	/*
		PART : 7-ELEVEN
		Author : 박현아
	*/

	var $introTab = $('.tab_filter.intro'),
		$introTabLi = $introTab.find('li'),
		$introTabA = $introTabLi.find('a');

	var $seven11Tab = $('.seven11_tab');
	
	$seven11Tab.not(':eq(0)').hide();

	$introTabA.on('click', function(event){
		//prevent default action (hyperlink)
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		
		var index = $(this).parent().index();
		var lineMap = ' | 7-ELEVEN | 회사소개 | ABOUT 7-ELEVEN | 7-ELEVEN | 세븐일레븐';
		var tabTxt = $(this).text();

		// 탭 활성화
		$introTabLi.removeClass('on');
		$(this).parent().addClass('on');
		
		// 탭 내용 보여주기
		$seven11Tab.hide();
		$seven11Tab.eq(index).show();

		// 페이지 타이틀 해당 탭 타이틀로 변경
		$(document).attr('title', tabTxt + lineMap);

	}); //end click

	/*
		PART : 가맹타입별 조건 탭
		Author : 윤정환
	*/

	var $conditionTab = $('.tab_filter.condition_tab_wrap'),
		$conditionTabLi = $conditionTab.find('li'),
		$conditionTabA = $conditionTabLi.find('a');

	var $conditionCont = $('.condition_tab_inner');

	//초기 탭 보여주기
	$conditionCont.not($conditionCont.eq(0)).hide();

	$conditionTabA.on('click', function(event){
		//prevent default action (hyperlink)
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		
		var index = $(this).parent().index();
		var lineMap = ' | 가맹타입별조건 | 가맹가이드 | FRANCHISE | 7-ELEVEN | 세븐일레븐';
		var tabTxt = $(this).text();
		
		// 탭 활성화
		$conditionTabLi.removeClass('on');
		$(this).parent().addClass('on');
		
		// 탭 내용 보여주기
		$conditionCont.hide();
		$conditionCont.eq(index).show();

		// 페이지 타이틀 해당 탭 타이틀로 변경
		$(document).attr('title', tabTxt + lineMap);
	}); //end tab click*/


	var $conditionInTab = $('.condition_tab_inner.tab01'),
		$conditionInTabLi = $conditionInTab.find('li'),
		$conditionInTabA = $conditionInTabLi.find('a');

	var $conditionInCont = $('.condition_tab_inner.tab01 .conSection');

	//초기 탭 보여주기
	$conditionInCont.not($conditionInCont.eq(0)).hide();

	$conditionInTabA.on('click', function(event){
		//prevent default action (hyperlink)
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		
		var index = $(this).parent().index();
		var lineMap = ' | 가맹타입별조건 | 가맹가이드 | FRANCHISE | 7-ELEVEN | 세븐일레븐';
		var tabTxt = $(this).text();
		
		// 탭 활성화
		$conditionInTabLi.removeClass('on');
		$(this).parent().addClass('on');
		
		// 탭 내용 보여주기
		$conditionInCont.hide();
		$conditionInCont.eq(index).show();

		// 페이지 타이틀 해당 탭 타이틀로 변경
		$(document).attr('title', tabTxt + lineMap);
	}); //end tab click*/

	/*
		Part : 썸네일 타이틀 opacity
		Author : 윤정환
	*/
	$('.thumb_img p').css({'opacity':'0.8'})

	/*
		PART : 환경경영전개 탭
		Author : 윤정환
	*/

	var $envTab = $('.env_step .tab_filter'),
		$envTabLi = $envTab.find('li'),
		$envTabA = $envTabLi.find('a');

	var $envCont = $('.env_step_tab');

	//초기 탭 보여주기
	$envCont.not($envCont.eq(0)).hide();

	$envTabA.on('click', function(event){
		//prevent default action (hyperlink)
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		
		var index = $(this).parent().index();
		var lineMap = ' | 환경경영전개 | 환경경영 | FRANCHISE | 7-ELEVEN | 세븐일레븐';
		var tabTxt = $(this).text();
		
		// 탭 활성화
		$envTabLi.removeClass('on');
		$(this).parent().addClass('on');
		
		// 탭 내용 보여주기
		$envCont.hide();
		$envCont.eq(index).show();

		// 페이지 타이틀 해당 탭 타이틀로 변경
		$(document).attr('title', tabTxt + lineMap);
	}); //end tab click*/

	/*
		PART : 직무소개 탭
		Author : 윤정환
	*/

	var $jobTab = $('.job_intro .tab_filter'),
		$jobTabLi = $jobTab.find('li'),
		$jobTabA = $jobTabLi.find('a');

	var $jobCont = $('.job_intro_tab');

	//초기 탭 보여주기
	$jobCont.not($jobCont.eq(0)).hide();

	$jobTabA.on('click', function(event){
		//prevent default action (hyperlink)
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		
		var index = $(this).parent().index();
		var lineMap = ' | 직무소개 | 채용안내 | ABOUT 7-ELEVEN | 7-ELEVEN | 세븐일레븐';
		var tabTxt = $(this).text();
		
		// 탭 활성화
		$jobTabLi.removeClass('on');
		$(this).parent().addClass('on');
		
		// 탭 내용 보여주기
		$jobCont.hide();
		$jobCont.eq(index).show();

		// 페이지 타이틀 해당 탭 타이틀로 변경
		$(document).attr('title', tabTxt + lineMap);
	}); //end tab click*/

	/*
		PART : 개인정보취급(처리)방침
		Author : 최웅
	*/
	$('.anchorLstCon li a').on('click', function(event){


		$('html, body').stop().animate({
			
			scrollTop : ($('#pvPolicy0'+($(this).parent().index()+1)+'').offset().top-200)
		})
		
		return false;
	}); //end tab click*/

	/*
		PART : 개인정보수집 및 이용동의 임시 로드
		Author : 박현아
	*/

	var $termboxBox = $('.termbox_box');
	var agreeHref = '/front/html/util/policyPrivacy_02.html #pvPolicyCont';

	$termboxBox.load(agreeHref);



}); //end function
/*
	Part : 외부페이지에서 서비스안내 html로드
	Author : 윤정환 09.22 수정
*/
$(function(){
	var href= "/front/html/product/servconv_list.html #tab0";
	var tab1dep = 1;
	
	jQuery.serviceTab = function(gbn){
		$('.product_service .cont_body').load(href+gbn ,function(){
			var lineMap = ' | 서비스안내 | PRODUCT | 7-ELEVEN | 세븐일레븐';
			var tabTxt1depth = $('.tab_filter').find('li.on').text();
			var tabTxt2depth = $('.tab_layer').find('li.on').text();
			if($('.tab_layer').find('li').has('.on')){
				$(document).attr('title', tabTxt2depth + ' | ' + tabTxt1depth + lineMap);
			}else{
				$(document).attr('title', tabTxt1depth + lineMap);
			}
			//첫 디폴트페이지
			$('.tab_cont .conSection').not('.conSection:eq(0)').hide();

			//1dep tab
			$('.tab_filter li a').on('click',function(){
				var tab1depIndex = $(this).parent().index()+1;
				tabTxt1depth = $(this).text();
				
				var tabTxt = $(this).text();

				if($(this).parent().is('.on')){
					return false;
				}else{
					//.cont_body 초기화
					$('.cont_body').remove();
					$('#container').append('<div class="cont_body"></div>')
					$('.tab_filter li').removeClass('on');
					$(this).parent().addClass('on');
					
					//li의 인덱스번호 = tab 인덱스번호 , tab의 첫번째conSection만 가져오기
					$('.cont_body').load(href+tab1depIndex, function(){
						$('.tab_cont .conSection').not('.conSection:eq(0)').hide();
						
						if($(this).find('div').is('.wrap_tab')){
							tabTxt2depth = $('.tab_layer').find('li.on').text() + ' | ';
							$(document).attr('title', tabTxt2depth +tabTxt1depth + lineMap);
						}else {
							$(document).attr('title', tabTxt1depth + lineMap);
						}
						

						
						//서브tab 호출
						tab2dep();
					})
				}
				return false;
			});
			//2dep tab
			var tab2dep= function(){
				$('.tab_layer li a').on('click',function(){
					var tab2depIndex = $(this).parent().index();
					$('.tab_layer li').removeClass('on');
					$(this).parent().addClass('on');
					if($('.tab_layer').find('li').has('.on')){
						$(document).attr('title', $(this).parent().text() +' | '+ tabTxt1depth + lineMap);
					}else{
						$(document).attr('title', tabTxt1depth + lineMap);
					}
					$('.tab_cont .conSection').hide();
					//2dep li의 인덱스 번호 = conSection의 인덱스 비교하여 가져오기
					$('.tab_cont .conSection').eq(tab2depIndex).show();
				
					return false;
				});
			}
			tab2dep();
		});
	}
	
});


/*
	Part : /library/asp/AspHeader.asp 에서 SNS 퍼가기
	Author : 강진모
*/
/*
$(function(){

	$('#facebookShare').on('click',function(){
		alert("GRefferUrl : ");
		alert("GUrl : ");
		alert("GParameter : ");
		var sns = "facebook";
		var url = "http://wwww.naver.com";
		var txt = "세븐일레븐 페이스북으로 공유하기";
		sendSns(sns, url, txt)
	});

	$('#twitterShare').on('click',function(){
		var sns = "twitter";
		var url = "http://wwww.naver.com";
		var txt = "세븐일레븐 트위터로 공유하기";
		sendSns(sns, url, txt)
	});

});
*/