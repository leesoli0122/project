window.addEventListener('scroll', () => {
	const bwLeft = window.scrollX;
	document.querySelector('#header').style.transform = `translateX(-${bwLeft}px)`;
});

$(document).ready(function() {
    /**  3자리 수마다 콤마 적용 **/
    $(document).on('keyup', 'input[inputmode=numeric]', function (event) {
      this.value = this.value.replace(/[^0-9]/g, ''); // 입력값이 숫자가 아니면 공백
      this.value = this.value.replace(/,/g, ''); // ,값 공백처리
      this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
    });
  
    //계산 완료
    $('.btn.btn-primary.result').on('click', function (e) {
      e.preventDefault();
  
      $('.contents-wrap').animate({
          scrollTop: $('.txt-list-wrap').offset().top
      });
    });
  
    //input focus
    $('.form-control:not(.form-control.select, input.form-control:read-only), textarea, #loanRegNum').focus(function(){// #loanRegNum개발대응으로 추가
      if (!$(this).hasClass('select')) {
        $('.fixed-btn-wrap').hide();
      }
    });
  
    $('.form-control:not(.form-control.select, input.form-control:read-only), textarea,  #loanRegNum').blur(function(){// #loanRegNum개발대응으로 추가
      if (!$(this).hasClass('select')) {
        $('.fixed-btn-wrap').show();
      }
    });

   
	/**약관체크 팝업**/
     // 전체 동의 체크박스 및 하위 체크박스 처리
    function toggleCheckboxes($context, isChecked) {
      $context.find('input[type="checkbox"]').prop('checked', isChecked);
	}

	$('.terms-area').on('click', '.chk-all .check.all', function() {
		toggleCheckboxes($(this).closest('.terms-area'), $(this).is(':checked'));
	});

	// 레벨2 체크박스 상태 변경 및 전체 동의 상태 업데이트
	$('.terms-area').on('click', '.level2 > fieldset .check.all', function() {
		var isChecked = $(this).is(':checked');
		toggleCheckboxes($(this).closest('.level2'), isChecked);
		updateCheckAllState($(this).closest('.terms-area'));
	});

	// 레벨3 체크박스 변경 시 상위 체크박스 상태 업데이트
	$('.terms-area').on('change', '.etc.level3 input[type="checkbox"]', function() {
		var $level2 = $(this).closest('.level2');
		var anyChecked = $level2.find('.etc.level3 input[type="checkbox"]:checked').length > 0;
		$level2.find('> fieldset .check.all').prop('checked', anyChecked);
		updateCheckAllState($(this).closest('.terms-area'));
	});

	// 팝업 제어
	$('[terms-pop]').on('click', function() {
		$('#' + $(this).attr('terms-pop')).toggle();
	});

	$('.btn-layer-close, .btn-primary').on('click', function() {
		$(this).closest('.layerpopup').hide();
	});

	// 전체 동의 상태 업데이트
	function updateCheckAllState($termsArea) {
		var allCheckboxes = $termsArea.find('.level2 > fieldset input[type="checkbox"]').length;
		var checkedCheckboxes = $termsArea.find('.level2 > fieldset input[type="checkbox"]:checked').length;
		// 레벨2의 모든 체크박스가 체크되어야 하며, 레벨3의 상태는 무시
		$termsArea.find('.chk-all .check.all').prop('checked', allCheckboxes === checkedCheckboxes);
	}
  
	// 레벨2와 레벨3 체크박스 상태 변경 시 전체 동의 상태 업데이트
	$('.terms-area').on('change', 'input[type="checkbox"]', function() {
		updateCheckAllState($(this).closest('.terms-area'));
	});
	/**약관체크 팝업**/
  

    /** accorion **/
    $('.accordion .btn-accordion').click(function() {
      var accordionCont = $(this).closest('.accordion').find('.accordion-cont');
      $(this).parent().toggleClass('on');
      accordionCont.toggleClass('on');
	});
  
  
    /** 이미지 불러오기 **/
    $('.thumb-wrap ul').on('change', '.plus', function(e) {
		const file = e.target.files[0]; // 불러온 파일 가져오기
		const $parentListItem = $(this).closest('li');
  
		if (file) {
			const reader = new FileReader();
  
			reader.onload = function(e) {
				const imageUrl = e.target.result;
  
				const newListItem = $('<li><img src="' + imageUrl + '" alt="Uploaded Image"><span>추가</span></li>');
  
				$parentListItem.replaceWith(newListItem);
  
				newListItem.addClass('delete');
  
				const newPlusListItem = $('<li class="plus"><input type="file" id="file" class="ip-file"><span>추가</span></li>');
              
				$('.thumb-wrap ul').append(newPlusListItem);
			};
  
			reader.readAsDataURL(file);
		}
    });
    /** 이미지 불러오기 삭제 **/
    $('.thumb-wrap ul').on('click', '.delete', function(e) {
		e.stopPropagation();//중단
  
		$(this).remove();
    });
      
    /** textarea css **/
    $('#myTextarea').on('focus', function() {
		$(this).css({
            'border-color': '#003763',
            'color': '#000000',
        });
    }).on('blur', function() {
        $(this).css({
            'border-color': '#DDDDDD',
            'color': '#999999',
        });
    });

	/** tab **/
	$(".tab-item.type2 > li").click(function(){

		var tabCont = $(this).attr("data-tab");

		$(this).siblings().removeClass("on");
		if (!$(this).hasClass('swiper'))  $(this).addClass("on");

		$(".tab-content").addClass("dp-none");
		$("#" + tabCont).removeClass("dp-none");

		$(".tab-item.scroll > li").click(function() {
			var tabContPosition = $(".tab-item.scroll > li:first-child").offset().left;
			var listItemPosition = $(this).offset().left;
			var distance = listItemPosition - tabContPosition;
	  
			$(".tab-item.scroll").animate({
				scrollLeft: distance
			}, 100);
		});
	});

	//tab
	$(".tab-item > li").click(function() {
		var tabCont = $(this).attr("data-tab");
		$(this).siblings().removeClass("on");
		$(this).addClass("on");
		$(this).closest('.tabs').find(".tab-content").addClass("dp-none"); // 같은 탭 세트 내의 모든 탭 컨텐츠를 숨김
		$("#" + tabCont).removeClass("dp-none"); // 선택한 탭의 컨텐츠만 보여줌
	});
  
  });

	// //레이어팝업 높이 판단하여 block와 position 컨트롤
	function layerFunc(_target) {
  
		if (_target.hasClass('laypop-all')) {
		//전체풀팝업일경우 dimmed 생기지않음
  
		}else {
			if (_target.outerHeight() > $(window).height()) {
				_target.css({ 'position': 'absolute', 'top': '50px', 'left': getCenterAlignPos($(window).width(), _target.outerWidth()) });
				addBlock('full');
			} else {
				_target.css({ 'position': 'fixed', 'top': getCenterAlignPos($(window).height(), _target.outerHeight()), 'left': getCenterAlignPos($(window).width(), _target.outerWidth()) });
				if (_target.attr('id') == "loadingLayer") {
				addBlock('removeEvent');
				} else if (_target.attr('id') == "customAlertLayer") {
					addBlock("fixed");
				} else {
					addBlock();
				}
			}
		}
	}


  
	//block
	var currentTop = 0;

	function addBlock(_full) {
		$('.close').on('click', function () {
			$('.block').trigger('click');
		});
	}
	function deleteBlock(_full) {
		if (_full == 'fixed') {
			$('.block').fadeOut(300);
			$('.block').remove();
		}
		$('html, .wrap').css({ 'height': '', 'overflow': '' });
		$('body').removeAttr('style');
		// $(window).scrollTop(winScrollTop);
	}
  
  
  // messagePopup
  function messagePopup(id) {
    var _target = $('#' + id);
    currentTop = $(window).scrollTop();
    $('body').css({ 'position': 'fixed', 'top': -currentTop });
    _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
      closePopup(id);
      $('body').removeAttr('style');
      $(window).scrollTop(currentTop);
    });
    if (_target.hasClass('layer-up')) {
  
    }else if (_target.hasClass('type-alert')){
      _target.fadeIn(600);
      _target.focus();
      _target.addClass("on");
  
    }else{
      _target.fadeIn(600);
      _target.addClass("on");
      _target.focus();
    }
  
  }
  
  // popup
  function openPopup(id) {
    var _target = $('#' + id);
    currentTop = $(window).scrollTop();
   
    //if (!_target.hasClass('tooltip')) {
        //$('body').css({ 'position': 'fixed', 'top': -currentTop });
    //}
  
    //_target.fadeIn(300);
    layerFunc(_target);
    _target.removeClass('close');
    _target.addClass('on').show();
    _target.focus();
    _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
        closePopupUp(id);
        $('body').removeAttr('style');
        $(window).scrollTop(currentTop);
        _target.removeClass('on');
    });

    // data-focus가 btn-layer-close인 경우 레이어 팝업 닫기
    if (_target.attr('data-focus') === 'btn-layer-close') {
        _target.find('[data-focus="btn-layer-close"]').on('click', function () {
            _target.hide(); // 레이어 감추기
            closePopupUp(id);
            $('body').removeAttr('style');
            $(window).scrollTop(currentTop);
            _target.removeClass('on');
        });
    }
  
    if (_target.has('.ly-select-list').length > 0) {
        _target.find('.ly-select-list > li > button').on('click', function () {
            _target.hide(); // 레이어 감추기
            closePopupUp(id);
            $('body').removeAttr('style');
            $(window).scrollTop(currentTop);
            _target.removeClass('show');
        });
    }
  
    /** 테이블 팝업 **/
    if (_target.has('.ly-select > .table-type.check').length > 0) {
        _target.find('.ly-select .table-type.check tbody tr').on('click', function () {
            _target.hide(); // 레이어 감추기
            closePopupUp(id);
            $('body').removeAttr('style');
            $(window).scrollTop(currentTop);
            _target.removeClass('show');
            e.preventDefault();
        });
    }
}


  
  function closePopup(id) {
    var _target = $('#' + id);
    deleteBlock();
    _target.fadeOut(600);
    _target.removeClass('on');
    $(window).scrollTop(currentTop);
  }
  
  function closePopupUp(id) {
    deleteBlock();
    //ADD eunji 2020-10-05
    $('#' + id).scrollTop(0);
    $('#' + id).fadeOut(600);
  }
  
  /**
  * 중앙정렬 위치
  * @param containerSize : 컨테이너의 크기
  * @param targetSize : 컨테이너에 들어 있는 오브젝트의 크기
  * @return
  */
  function getCenterAlignPos(containerSize, targetSize) {
    var pos = (containerSize - targetSize) / 2;
    return pos;
  }
  
  /**selectbox***/
  document.addEventListener('DOMContentLoaded', function() {
    // 버튼과 리스트를 가져오기
    const btns = document.querySelectorAll('.btn-select');
    const lists = document.querySelectorAll('.select-list');

    // 각각의 버튼에 대해 이벤트 리스너 추가
    btns.forEach((btn, index) => {
        const list = lists[index];
        btn.addEventListener('click', (event) => {
            event.preventDefault(); // form의 기본 동작 중지
            if (!btn.classList.contains('disabled')) {
                btn.classList.toggle('action');
            }
        });

        list.addEventListener('click', (event) => {
          if (event.target.nodeName === "BUTTON") {
              if (!btn.classList.contains('disabled')) {
                  // 선택된 항목의 텍스트를 버튼의 텍스트로 설정
                  btn.innerText = event.target.innerText;
                  btn.classList.remove('action');
                  // 선택된 버튼에 "select-ok" 클래스 추가
                  const selectedBtn = document.querySelector('.btn-select.select-ok');
                  if (selectedBtn) {
                      selectedBtn.classList.remove('select-ok');
                  }
                  btn.classList.add('select-ok');
                  
                  // 여기에 check 클래스 추가 로직을 삽입
                  const currentSelected = document.querySelector('.select-list button.check');
                  // 기존에 check 클래스가 적용된 버튼이 있으면 제거
                  if (currentSelected) {
                      currentSelected.classList.remove('check');
                  }
                  // 현재 선택된 버튼에 check 클래스 추가
                  event.target.classList.add('check');
              }
          }
      });
    });

    // 선택된 항목을 btn-select에 표시
    const selectedOption = document.querySelector('.select button');
    if (selectedOption) {
        btns[0].innerText = selectedOption.innerText;
    }

    // 외부 영역 클릭 시 모든 버튼의 action 클래스 제거
    document.addEventListener('click', (event) => {
        const targetElement = event.target;

        btns.forEach((btn) => {
            // 클릭된 요소가 버튼이거나 버튼의 자식 요소이면 이벤트를 처리하지 않음
            if (targetElement.closest('.btn-select') === btn) {
                return;
            }
            // 외부 영역을 클릭한 경우 action 클래스 제거
            btn.classList.remove('action');
        });
    });
});
