$(document).ready(function() {

	/*********************************************************************
		SELECT #셀렉트
	*********************************************************************/
	/*---------------------------------------------
		Custom Select Functionn
	---------------------------------------------*/
	function customSelect(element) {
		// Check iOS
		if (isIOS()) {
			return;
		}

		var fnName = '[data-stove="select"]',
			$this = $(element).closest(fnName),
			$select = $this.find('select'),
			$stage = $('body');

		/* Class Define */
		var onClass = 'on',
			dimClass = 'stove-dim',
			optionLayerClass = 'stove-option-layer',
			optionLayerScrollClass = 'stove-option-scroll',
			// optionLayerCloseClass = 'stove-btn-close',
			optionTitleClass = 'stove-options-title',
			optionListClass = 'stove-options',
			optionClass = 'stove-option';

		/* Extend Define */
		var nowStatus = $this.attr('data-status'),
			statusDisabled = $select.attr('disabled'),
			statusReadonly = $select.attr('readonly'),
			uiCase = $this.attr('data-uicase'),
			optionLength = $select.children('option').length;

		/* Reset */
		if (statusDisabled == 'disabled' || statusReadonly == 'readonly') return;
		$(fnName).find('.' + dimClass + ', .' + optionLayerClass).remove();

		/* Option Init */
		initOptionLayer();

		/* Event Bindings */
		bindOptionEvents();

		/* Init */
		if (nowStatus == 'open') {
			close();
		} else {
			open();
		}

		/* Functions */
		function initOptionLayer() {
			$select.before('<div class="' + dimClass + '"></div>');
			$select.after('<div class="' + optionLayerClass + '" role="dialog"></div>');

			var $dim = $this.find('.' + dimClass),
				$optionLayer = $this.find('.' + optionLayerClass),
				$optionScroll = $('<div>', { class: optionLayerScrollClass }).appendTo($optionLayer),
				$optionList = $('<div>', { class: optionListClass }).appendTo($optionScroll);

			if (uiCase == 'slide') {
				$('<div>', { class: optionTitleClass, text: $select.attr('title') }).appendTo($optionLayer);
			}

			// $('<button>', { class: optionLayerCloseClass, title: '닫기' }).appendTo($optionLayer);
			createOptionButtons($optionList, optionLength);
			highlightSelectedOption();
		}

		function createOptionButtons($optionList, optionLength) {
			for (var i = 0; i < optionLength; i++) {
				var option = $select.children('option').eq(i);
				if (option.attr('hidden')) {
					continue;
				} else if (option.attr('disabled')) {
					$('<button>', { class: optionClass, text: option.text(), rel: option.val(), disabled: 'disabled' }).appendTo($optionList);
				} else {
					$('<button>', { class: optionClass, text: option.text(), rel: option.val() }).appendTo($optionList);
				}
			}
		}

		function highlightSelectedOption() {
			setTimeout(function() {
				$this.find('button').each(function() {
					var thisRel = $(this).attr('rel'),
						thisValue = $select.val();
					if (thisRel == thisValue) {
						$(this).addClass(onClass);
					}
				});
			}, 0);
		}

		function open() {
			var $dim = $this.find('.' + dimClass),
				$optionLayer = $this.find('.' + optionLayerClass);

			$optionLayer.addClass('va-' + uiCase);

			if (uiCase == 'slide') {
				setTimeout(function() {
					$dim.addClass(onClass);
					$optionLayer.addClass(onClass);
					$stage.css({ overflow: 'hidden' });
				}, 0);

				setTimeout(function() {
					$optionLayer.attr('tabindex', 0).focus();
				}, 0);

				$dim.click(function(e) {
					e.stopPropagation();
					close();
				});
			} else {
				$optionLayer.attr('tabindex', 0).focus();
				bindGlobalEvents();
			}

			$this.attr('data-status', 'open');
		}

		function close() {
			if (uiCase == 'slide') {
				setTimeout(function() {
					$this.find('.' + dimClass).remove();
					$this.find('.' + optionLayerClass).remove();
					$stage.css({ overflow: 'auto' });
				}, 0);
			} else {
				$stage.off('click keydown');
				setTimeout(function() {
					$this.find('.' + optionLayerClass).remove();
				}, 0);
			}

			setTimeout(function() {
				$select.focus();
				$this.removeAttr('data-status');
			}, 1);
		}

		function bindOptionEvents() {
			$select.on('keydown', function(e) {
				if (e.keyCode === 27) { // ESC key
					e.stopPropagation();
					close();
				}
			});

			$this.find('.' + optionLayerClass).on({
				click: function(e) {
					e.stopPropagation();
				},
				keydown: function(e) {
					if (e.keyCode === 27) { // ESC key
						e.stopPropagation();
						close();
					}
				}
			});

			// $this.find('.' + optionLayerCloseClass).on({
			// 	click: function(e) {
			// 		e.stopPropagation();
			// 		close();
			// 	},
			// 	blur: function() {
			// 		$this.find('.' + optionLayerClass).addClass(onClass).attr('tabindex', 0).focus();
			// 	}
			// });

			$this.find('.' + optionClass).on('click', function(e) {
				e.stopPropagation();
				$select.val($(this).attr('rel'));
				$select.trigger('change'); // 브라우저와 다른 코드 인식 , 이벤트 발생
				e.preventDefault(); //select 선택 시 기본 폼 리셋 x
				close();
			});
		}

		function bindGlobalEvents() {
			$stage.on({
				click: function(e) {
					if (!$(e.target).hasClass($this)) {
						close();
					}
				},
				keydown: function(e) {
					if (e.keyCode === 27) { // ESC key
						e.stopPropagation();
						close();
					}
				}
			});
		}
	}

	/*---------------------------------------------
		Check if the device is iOS
	---------------------------------------------*/
	function isIOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	}

	/*---------------------------------------------
		Custom Select  Event Binding
	---------------------------------------------*/
	function customEventBindingHandlers() {
		$(document).on('mousedown', '.se-select[data-stove="select"] select', function(e) {
			if (isIOS()) {
				// iOS 기본 동작
				return;
			}
			e.preventDefault();
		});

		$(document).on('keydown', '.se-select[data-stove="select"] select', function(e) {
			if (isIOS()) {
				// iOS 기본 동작
				return;
			}
			if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
				e.preventDefault();
				customSelect($(this));
			}
		});

		$(document).on('click', '.se-select[data-stove="select"] select', function(e) {
			if (isIOS()) {
				// iOS 기본 동작
				return;
			}
			e.preventDefault();
			customSelect($(this));
		});
	}
	customEventBindingHandlers();
	
	/*********************************************************************
		Datepicker #데이터피커
	*********************************************************************/
	/*---------------------------------------------
		Custom Datepicker Functionn
	---------------------------------------------*/
	function customDatepicker(){
        // 기본 설정
        $.datepicker.setDefaults({
            closeText: "닫기",
            prevText: "이전달",
            nextText: "다음달",
            currentText: "오늘",
            monthNames:["01", "02", "03", "04", "05", "06",
			"07", "08", "09", "10", "11", "12"
			],
			monthNamesShort:  ["01", "02", "03", "04", "05", "06",
			"07", "08", "09", "10", "11", "12"
			],
            dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
            dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
            weekHeader: "주",
            dateFormat: "yy.mm.dd",
            firstDay: 0,
            isRTL: true,
			 // yearSuffix: "년",
			minDate:null //null
        });

		// 커스텀 설정
		$('.datepicker').datepicker({
			showOtherMonths:true,
			showMonthAfterYear: true,
			showButtonPanel: true,
			changeYear: true,
			changeMonth: true,
			yearRange:'c-5:c+5',//선택 범위
			beforeShow: function(input, inst) {
				repositionDatepicker(input, inst);
				$(window).on('scroll resize', function() {
					repositionDatepicker(input, inst);
				});
				if ($(input).closest('.layerpopup').length) {
					setTimeout(function() {
					$('.ui-datepicker').css('z-index', '202');
				}, 0);
				} else {
					setTimeout(function() {
					$('.ui-datepicker').css('z-index', '2');
				}, 0);
				}
			},
			onClose: function() {
				$(window).off('scroll resize');
			}
		});
        
        // 위치 조절 함수
        function repositionDatepicker(input, inst){
            var inputOffset = $(input).offset(); // input의 위치값 가져오기
            var inputHeight = $(input).outerHeight();
            inst.dpDiv.css({
                top: inputOffset.top + inputHeight + 'px', // input 바로 아래
                left: inputOffset.left + 'px' // input의 왼쪽
            });
        }

		//오늘 버튼
		var old_goToToday = $.datepicker._gotoToday;
		$.datepicker._gotoToday = function(id) {
			old_goToToday.call(this,id);
			var target = $(id); // input 포커스 설정
			target.focus();
			this._selectDate(id);
			target.blur();
		};
		
    }
    // Datepicker 핸들러 실행
    customDatepicker();

	/*********************************************************************
		TOGGLE_ACCORDION #토글_아코디언 [QnA]
	*********************************************************************/
	/*---------------------------------------------
		Toggle_Accordion [QnA]
	---------------------------------------------*/
    function toggleChkHandlers() {
        $(document).on('click', '.toggleChk', function(e){
			handleToggleClick($(this));
		});
		$(document).on('click','.toggleChk .btn', function(e){
			e.preventDefault();
			e.stopPropagation();
		});
    }//개발 수정

    function handleToggleClick($toggleElement) {
        var $toggleCont = $toggleElement.parent().find('.ques-cont');
        var isOpen = $toggleElement.toggleClass('active').hasClass('active');

		// 20250114 추가
		$('.toggleChk.active').not($toggleElement).removeClass('active').attr('title', '닫힘');
    	$('.ques-cont.active').not($toggleCont).removeClass('active');

        $toggleCont.toggleClass('active');
        $toggleElement.attr('title', isOpen ? '열림' : '닫힘');
    }

    toggleChkHandlers();
	
	/*********************************************************************
		Filter_fixed #필터fixed
	*********************************************************************/
	/*---------------------------------------------
		Filter_fixed [상담내역]
	---------------------------------------------*/
	// function handleScroll() {
    //     var scrollTop = $(window).scrollTop();

    //     if (scrollTop > 400) {
    //         $('.filter').addClass('fix');
    //     } else {
    //         $('.filter').removeClass('fix');
    //     }
    // }

    // function initScrollEvent() {
    //     $(window).on('scroll', handleScroll);
    // }

    // // 이벤트 초기화 함수 실행
    // initScrollEvent();

	/*********************************************************************
		Input_File #인풋_파일 업로드
	*********************************************************************/
	/*---------------------------------------------
		Input_File [파일 업로드]
	---------------------------------------------*/
	// 견적내기 및 자료실 파일 업로드 추가 (문서 파일 - .attachmentFile)
	function setupFileInputHandlers() {
		const maxFiles = 3;// 최대 파일 개수
		const maxFileSize = 50 * 1024 * 1024; // 50MB 제한
		const allowedExtensions = ['xlsx', 'pdf', 'hwp', 'doc', 'pptx']; // 허용된 파일 확장자
        
		
		$('.file').each(function() {
			const $container = $(this);
			const $fileInput = $container.find('.attachmentFile');
			const $addFileList = $container.find('.add-file');
            
			// 파일 선택
			$fileInput.on('change', function() {
				const files = Array.from(this.files);

                if ($addFileList.children('li').length + files.length > maxFiles) {
                    messageView('최대 3개의 파일만 선택할 수 있습니다.');
                    return;
                }
                    
				files.forEach(function(file) {
					const fileSize = file.size;
					const filename = file.name;
					const fileExtension = filename.split('.').pop().toLowerCase();
					

					if (!allowedExtensions.includes(fileExtension)) {
						messageView(fileExtension + '는 지원하지 않는 확장자입니다.');
						return;
					}
					if (fileSize >= maxFileSize) {
						messageView('파일 크기는 50MB를 초과할 수 없습니다.');
						return;
					}
	
					if ($addFileList.children('li').length < maxFiles) {
						const $newListItem = $('<li>').text(file.name);''
						const $deleteButton = $('<span>').addClass('delete-file').text('삭제');

	
						$deleteButton.on('click', function() {
							$(this).closest('li').remove();
						});
						// S:개발 현행화
						var fileNm = $('.attachmentFile')[0].files[0].name; // 파일명
						var fileNa = $('.delete-file').closet('li').text().replaceAll('삭제', '');
						var gijun = $('.delete-file').parent('li').text();
                        var delimitter = '삭제';
                        var flag = 'Y';
                        var resultArray = gijun.split(delimitter);

						console.log(resultArray);
						resultArray.some(function(item, index, arr) {
							console.log('item' + index + arr[index]);
							if (arr[index] === fileNm) {
								flag = 'N';
								return flag === 'N';
							}
						});

						if(flag === 'Y') {
							$addFileList.append($newListItem);
							$newListItem.append($deleteButton);
						}else{
							messageView("동일파일 업로드 불가합니다.");
							return;
						}
						// E:개발 현행화
					}
				});
	
				$fileInput.val('');
			});
		});
	}
	setupFileInputHandlers();

	// 개발현행화 - 현황조회 파일 업로드 추가 (이미지 파일 -  .nwcFile)
	function setupFileInputHandlersNwc() {
		const maxFiles = 5;// 최대 파일 개수
		const maxFileSize = 300 * 1024 * 1024; // 300MB 제한
		const allowedExtensions = ['jpg', 'gif', 'png', 'pdf']; // 허용된 파일 확장자
	
		
		$('.file').each(function() {
			const $container = $(this);
			const $fileInput = $container.find('.nwcFile');
			const $addFileList = $container.find('.add-file');
	
			// 파일 선택
			$fileInput.on('change', function() {
				const files = Array.from(this.files);

                if ($addFileList.children('li').length + files.length > maxFiles) {
                    messageView('최대 5개의 파일만 선택할 수 있습니다.');
                    return;
                }
	
				files.forEach(function(file) {
					const fileSize = file.size;
					const filename = file.name;
					const fileExtension = filename.split('.').pop().toLowerCase();
	
					if (!allowedExtensions.includes(fileExtension)) {
						messageView(fileExtension + '는 지원하지 않는 확장자입니다.');
						return;
					}
					if (fileSize >= maxFileSize) {
						messageView('파일 크기는 300MB를 초과할 수 없습니다.');
						return;
					}
	
					if ($addFileList.children('li').length < maxFiles) {
						const $newListItem = $('<li>').text(file.name);
						const $deleteButton = $('<span>').addClass('delete-file').text('삭제');
	
						$deleteButton.on('click', function() {
							$(this).closest('li').remove();
						});
						$newListItem.append($deleteButton);
						$addFileList.append($newListItem);
					}
				});
	
				$fileInput.val('');
			});
		});
	}
	
	setupFileInputHandlersNwc();



	/*********************************************************************
		Select Popup [년도 선택_팝업 / 차량 선택 _ 팝업/ 실적조회_테이블]
	*********************************************************************/
	/*---------------------------------------------
		Select Popup [년도 선택_팝업 / 차량 선택 _ 팝업/ 실적조회_테이블]
	---------------------------------------------*/

	function btnSelectHandlers() {
		// 항목 선택
		function updateSelection(container, button, link) {
			if ($(container).hasClass('disabled')) return;

			// 항목을 선택
			$(container).addClass('on');

			// '선택됨' title 추가
			addTitleToElement(button);
			addTitleToElement(link);
		}

		// '선택됨' title 추가
		function addTitleToElement(e) {
			if (e) {
				$(e).attr('title', '선택됨');
			}
		}

		// 클릭 이벤트
		function handleContainerClick(e) {
			const container = e.currentTarget;
			const $container = $(container);
			const $button = $container.find('button').get(0);
			const $link = $container.find('a').get(0);

			// disabled 이벤트 종료
			if ($container.hasClass('disabled')) return;

			// 부모 요소
			var $parent = $container.closest('.btnSelect');

			// 리스트아이템 , 버튼 초기화
			resetListItems($parent);
			resetButtons($parent);

			// 항목 선택
			updateSelection(container, $button, $link);
		}

		// 리스트아이템 , 버튼 초기화
		function resetListItems($parent) {
			$parent.find('li, div, tr td:first-child').removeClass('on');
		}
		function resetButtons($parent) {
			$parent.find('button').removeAttr('title');
		}

		// disabled 포커스 방지
		function disableFocusItems() {
			$('.btnSelect .disabled button, .btnSelect .disabled a').attr('tabindex', '-1');
		}

		// 클릭 이벤트 초기화 함수
		function initContainerClickEvent() {
			var $btnSelects = $('.btnSelect');

			$btnSelects.each(function() {
				var $this = $(this);
				$this.find('li, div, tr td:first-child').on('click', handleContainerClick);
			});

			// disabled 포커스 방지
			disableFocusItems();
		}

		initContainerClickEvent();
	}

	btnSelectHandlers();

	/*********************************************************************
		scrollTop Button
	*********************************************************************/
	/*---------------------------------------------
		scrollTop
	---------------------------------------------*/
	function handleScrollTop() {
		if ($('.btn-top').length > 0) {
			$('.btn-top').hide();
		
			$(window).on('scroll', function() {
				var scrollTop = $(this).scrollTop();
				var windowHeight = $(this).height();
				var footerTop = $('footer').offset().top;
				var contentWrapOffset = $('.sub-content').offset(); // #contentWrap의 위치
				var contentWrapWidth = $('.sub-content').outerWidth(); // #contentWrap의 너비
		
				// 위치
				if (scrollTop > 0) {
					
					if ($('.btn-top').css('display') === 'none') {

						$('.btn-top').css({
							display: 'block',
							opacity: 0
						}).stop(true, true).animate({
							opacity: 1
						});

					}
				
					if (scrollTop + windowHeight >= footerTop) {

						$('.btn-top').css({
							position: 'absolute',
							bottom: '30px',
							right: '10px'
						});
						
					} else {
						
						$('.btn-top').css({
							position: 'fixed',
							bottom: '30px',
							right: '10px'
						});

						// contentWrap
						var buttonWidth = $('.btn-top').outerWidth();
						var contentWrapRightEdge = contentWrapOffset.left + contentWrapWidth;
						var buttonRightEdge = $(window).width() - buttonWidth - 10;
		
						// #contentWrap 밖으로 나갈 경우
						if (buttonRightEdge > contentWrapRightEdge) {
							$('.btn-top').css({
								right: ($(window).width() - contentWrapRightEdge + '10px')
							});
						} else {
							$('.btn-top').css({
								right: '10px' // 원래 위치
							});
						}
					}
					
				} else {

					$('.btn-top').css('display', 'none');
				}
			});
		
			$('.btn-top').on('click', function() {
				$('html, body').stop().animate({ scrollTop: 0 }, 'linear');
			});
		}
	}
	
	handleScrollTop();
	
	/*********************************************************************
		Input_Delete Button
	*********************************************************************/
	/*---------------------------------------------
		Input_Delete Button
	---------------------------------------------*/
	//개발-> 검색 INPUT : 삭제 버튼 고정으로 변경 (스크립트 미사용)
	function delEvent() {
		$('.form-wrap .form-group').each(function(idx, obj) {
			var formGroup = $(obj);
	
			// input 필드를 선택
			formGroup.find('.form-control.hasCancel').each(function() {
				var inputElement = $(this);
				var btnCancelContainer = inputElement.closest('.col-10'); // 부모
				const btnCancel = $('<button type="button" class="btn btn-cancel" onclick="clearBtn()"><span class="ir">입력취소</span></button>');//개발 : onclick="clearBtn()"
	
				// 페이지 로드 시 값이 있는 경우 취소 버튼 생성
				if (inputElement.val().trim() !== '' && btnCancelContainer.find('.btn-cancel').length === 0) {
					btnCancelContainer.append(btnCancel);
				}
	
				inputElement.off('focus').on('focus', function() {
					inputElement.off('keyup').on('keyup', function() {
						var inputValue = inputElement.val().trim();
						var btnCancelContainer = inputElement.closest('.col-10'); // 부모
						const btnCancel = $('<button type="button" class="btn btn-cancel" onclick="clearBtn()"><span class="ir">입력취소</span></button>');//개발 : onclick="clearBtn()"
	
						if (inputValue !== '') {
							if (btnCancelContainer.find('.btn-cancel').length === 0) {
								btnCancelContainer.append(btnCancel);
							}
						} else {
							btnCancelContainer.find('.btn-cancel').remove();
						}
					});
				});
			});
	
			formGroup.off('click', '.btn-cancel').on('click', '.btn-cancel', function() {
				var inputElement = $(this).closest('.col-10').find('.form-control');
				inputElement.val('');
				$(this).remove();
			});
		});
	}
	
	delEvent();

});

