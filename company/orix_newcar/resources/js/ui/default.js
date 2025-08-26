$(document).ready(function () {

	/**  3자리 수마다 콤마 적용 **/
	$(document).on('keyup', 'input[inputmode=numeric]', function () {
		this.value = this.value.replace(/[^0-9]/g, ''); // 입력값이 숫자가 아니면 공백
		this.value = this.value.replace(/,/g, ''); // ,값 공백처리
		this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
	});

	/*********************************************************************
	on/off 기능
	*********************************************************************/
	/** 툴팁 **/
	$(".info-tooltip").on('click', function () {
		var $this = $(this).parents(".tooltip-wrap");
		$this.toggleClass('on');
	});

	//툴팁 닫기
	$(".tooltip-close").on('click', function () {
		var $this = $(this).parents(".tooltip-wrap");
		$this.removeClass('on');
	});

	// 견적추가 on/off
	document.querySelectorAll('.grid-list-wrap.style3 .grid-list-header').forEach(function (header) {
		header.addEventListener('click', function () {
			header.classList.toggle('on');
		});
	});

	// 견적서 보기
	$(document).on('click', '.show-estimate-wrap .btn-estimate', function () {
		var estimateSection = document.querySelector('.estimate');
		var button = this;

		if (estimateSection.style.display === 'none') {
			estimateSection.style.display = 'block';
			button.textContent = '견적서 접기';
		} else {
			estimateSection.style.display = 'none';
			button.textContent = '견적서 보기';
		}
		// 이미지 방향 변경 로직
		if (button.classList.contains('rotate')) {
			button.classList.remove('rotate');
		} else {
			button.classList.add('rotate');
		}
	});

	// 페이지 로드 시 초기 상태를 확인
	document.addEventListener('DOMContentLoaded', function () {
		if (inputField.value.trim() !== "") {
			myButton.classList.add('active');
			myButton.disabled = false; // 버튼 활성화
		} else {
			myButton.classList.remove('active');
			myButton.disabled = true; // 버튼 비활성화
		}
	});

	// 다중 선택(checkbox 사용 안함)
	$(document).on('click', '.choose-group.model .choose li', function () {
		$(this).toggleClass('chk');
	});

	/*********************************************************************
	input
	*********************************************************************/

	/** input focus **/
	$('.form-control, textarea').focus(function () {
		if (!$(this).hasClass('select') && !$(this).prop("readonly")) {
			$('.fixed-btn-wrap').hide();
		}
	});

	$('.form-control, textarea').blur(function () {
		if (!$(this).hasClass('select') && !$(this).prop("readonly")) {
			$('.fixed-btn-wrap').show();
		}
	});

	/** keyboard focus **/
	$(document).keydown(function (event) {
		if (event.key === "Escape") {
			var inputField = $("input.form-control");
			inputField.blur();
		}
	});

	/** 전체동의 **/
	$('.check.all').on('click', function () {
		var termsPopID = $(this).attr("terms-all");

		if ($(this).prop("checked")) {
			$("#" + termsPopID).closest('.layerpopup').show();
		} else {
			$("#" + termsPopID).closest('.layerpopup').hide();
		}

		if (!$('.level1 .all').closest('fieldset').siblings().hasClass('etc')) {
			// 약관 전체동의
			$('.level2').find('input').prop('checked', $(this).prop('checked'));
		}
	});

	/** 개별 약관 **/
	$('.check').on('click', function () {
		var totalNum = $(".level2 fieldset > .check").length;
		var checkNum = $(".level2 fieldset > .check:checked").length;

		var terms_id = $(this).attr("terms-pop");

		$('.level1 .all').prop('checked', totalNum === checkNum);

		if ($(this).prop("checked")) {
			$("#" + terms_id).closest('.layerpopup').show();
		} else {
			$("#" + terms_id).closest('.layerpopup').hide();
		}

		if (!$(this).closest('div.level3').hasClass('etc')) {
			$('.level1 .all').prop('checked', totalNum === checkNum);
		} else {
			agreeChek();
		}
	});

	/*********************************************************************
		tab
	*********************************************************************/
	/// 상위 탭
	$(".tab-item > li").click(function () {
		var selectedTab  = $(this).attr("data-tab");
		var tabContents  = $(this).closest(".tabs").find(".tab-content-area > .tab-content");

		tabContents.addClass("dp-none");
		$("#" + selectedTab).removeClass("dp-none");

		$(this).addClass("on").attr('title', '선택됨').siblings().removeClass("on").attr('title', '');
	});

	// 하위 탭 (e.g., 심사 > 심사승인, 심사협의)
	$(".tab-item02 > li").click(function (e) {
		e.stopPropagation();
		var selectedSubTab  = $(this).attr("data-tab");
		var subTabContents = $(this).closest(".tabs").find(".tab-content-area02 > .tab-content");

		subTabContents.addClass("dp-none");
		$("#" + selectedSubTab).removeClass("dp-none");
		
		$(this).addClass("on").attr('title', '선택됨').siblings().removeClass("on").attr('title', '');
	});

});

/*********************************************************************
팝업 #popup
*********************************************************************/
// 레이어팝업 높이 판단하여 block과 position 컨트롤
function layerFunc(_target) {
	if (!_target.hasClass('laypop-all')) {
		if (_target.outerHeight() > $(window).height()) {
			addBlock('full');
		} else {
			if (_target.attr('id') === "loadingLayer") {
				addBlock('removeEvent');
			} else if (_target.attr('id') === "customAlertLayer") {
				addBlock('fixed');
			} else {
				addBlock();
			}
		}
	} else {
		console.log('Skipping laypop-all class');
	}
}

// block 추가 및 삭제
function addBlock(_full) {

	// close 버튼
	$('.close').on('click', function () {
		$('.block').trigger('click');
	});
}

function deleteBlock(_full) {
	if (_full === 'fixed') {
		$('.block').fadeOut(300).remove();
	}
	$('html, .wrap').css({ 'height': '', 'overflow': '' });
	$('body').removeAttr('style');
}

function messagePopup(id) {
	const _target = $('#' + id);
	const currentTop = $(window).scrollTop();

	// 스크롤 방지
	$('body').css({ 'position': 'auto'});

	_target.find('.btn-layer-close, .btn-close, .confirm').off('click').on('click', function () {
		closePopup(id, currentTop);

		let isEmptyField = false;

		$('input, textarea, select').each(function () {
			if ($(this).val().trim() === "") {
				// 포커스 설정
				$(this).focus();

				// 포커스된 인풋으로 스크롤 이동
				let $this = $('input, textarea, select').on('focus', function () {
					let offset = $(this).offset();
					console.log('Focused input position:', offset.top, offset.left);
				});

				setTimeout(function () {
					$('html, body').animate({
						scrollTop: $this.offset().top - 300
					}, 500);
				}, 0);

				isEmptyField = true;
				return false; // 루프 중지
			}
		});
	});//off('click')추가(기존 이벤트를 제거한 뒤 바인딩)

	_target.fadeIn(600).addClass('on').focus();
}

// 팝업 열기 및 닫기
let scrollPosition = 0;

function openPopup(id) {
	const $target = $('#' + id);

	// 스크롤 위치 복원 및 스타일 초기화
	$('html').css({ 'overflow': 'hidden'});

	if ($target.length) {

		// 현재 스크롤 위치 저장
		scrollPosition = $(window).scrollTop();

		showPopup($target);
	} else {
		console.error('Target element not found:', id);
	}

	function showPopup($target) {
		layerFunc($target);
		$target.removeClass('close').addClass('on').show().focus();
		// close 버튼
		$target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
			closePopup(id);
		});
	}
}

function closePopup(id, storedScrollPosition) {
	const $target = $('#' + id);

	deleteBlock();
	$target.fadeOut(200).removeClass('on');

	// 스크롤 위치 복원 및 스타일 초기화
	$('html').css({
		'overflow': '',
	});

	// 스크롤 위치 복원
	if (storedScrollPosition !== undefined) {
		$(window).scrollTop(storedScrollPosition);
	}
}

function closePopupUp(id) {
	deleteBlock();
	$('#' + id).scrollTop(0).fadeOut(600);
}
