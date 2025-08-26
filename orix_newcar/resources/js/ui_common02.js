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
			optionLayerCloseClass = 'stove-btn-close',
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

			$('<button>', { class: optionLayerCloseClass, title: '닫기' }).appendTo($optionLayer);
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

			$this.find('.' + optionLayerCloseClass).on({
				click: function(e) {
					e.stopPropagation();
					close();
				},
				blur: function() {
					$this.find('.' + optionLayerClass).addClass(onClass).attr('tabindex', 0).focus();
				}
			});

			$this.find('.' + optionClass).on('click', function(e) {
				e.stopPropagation();
				$select.val($(this).attr('rel'));
				e.preventDefault(); //select 선택 시 기본 폼 리셋이 일어나지 않도록 수정
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

	
	/*********************************************************************
		Datepicker #데이터피커
	*********************************************************************/
	/*---------------------------------------------
		Custom Datepicker Functionn
	---------------------------------------------*/
	

	

	/*********************************************************************
		TOGGLE_ACCORDION #토글_아코디언 [QnA]
	*********************************************************************/
	/*---------------------------------------------
		Toggle_Accordion [QnA]
	---------------------------------------------*/
    function toggleChkHandlers() {
        // .toggleChk 요소에 대해 클릭 이벤트 핸들러 추가
        $('.toggleChk').on('click', function() {
            handleToggleClick($(this));
        });
    }

    function handleToggleClick($toggleElement) {
        var $toggleCont = $toggleElement.parent().find('.ques-cont');
        var isOpen = $toggleElement.toggleClass('active').hasClass('active');
        $toggleCont.toggleClass('active');

        // 버튼 상태에 따라 title 속성 설정
        $toggleElement.attr('title', isOpen ? '닫힘' : '열림');
    }

    // 페이지 로드 후 토글 핸들러 실행
    toggleChkHandlers();

	
	/*********************************************************************
		Filter_fixed #필터fixed
	*********************************************************************/
	/*---------------------------------------------
		Filter_fixed [상담내역]
	---------------------------------------------*/

	function handleScroll() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > 400) {
            $(".filter").addClass("fix");
        } else {
            $(".filter").removeClass("fix");
        }
    }

    function initScrollEvent() {
        $(window).on('scroll', handleScroll);
    }

    // 이벤트 초기화 함수 실행
    initScrollEvent();

	/*********************************************************************
		Input_File #인풋_파일 업로드
	*********************************************************************/
	/*---------------------------------------------
		Input_File [파일 업로드]
	---------------------------------------------*/
    function setupFileInputHandlers() {
        const $fileInput = $('.plus-file');  // 파일 입력
        const $addFileList = $('.add-file'); // 파일 리스트
        const maxFiles = 3;                  // 최대 파일 개수
        const maxFileSize = 300 * 1024 * 1024; // 300MB 제한 (바이트로 변환)

        // "찾아보기" 버튼 트리거
        $('.file .btn-input').on('click', function() {
            $fileInput.click();
        });

        // 파일 선택
        $fileInput.on('change', function() {
            // 파일 3개 있는지 확인
            if ($addFileList.children('li').length >= maxFiles) {
                alert('최대 3개의 파일만 선택할 수 있습니다.');
                return;
            }

            const files = Array.from(this.files);

            // 선택 파일 검사
            files.forEach(function(file) {
                const fileType = file.type;
                const fileSize = file.size;

                // 파일 형식과 크기 검사 (JPG, PNG, 300MB 이하)
                if (!fileType.match(/image\/(jpeg|png)/)) {
                    alert('JPG 또는 PNG 파일만 업로드할 수 있습니다.');
                    return;
                }
                if (fileSize > maxFileSize) {
                    alert('파일 크기는 300MB를 초과할 수 없습니다.');
                    return;
                }

                // 파일이 3개 미만일 때만 리스트에 추가
                if ($addFileList.children('li').length < maxFiles) {
                    const $newListItem = $('<li>').text(file.name);
                    const $deleteButton = $('<span>').addClass('delete-file').text('삭제'); // 삭제 버튼 추가
                    $newListItem.append($deleteButton);
                    $addFileList.append($newListItem);
                }
            });

            // 파일 입력을 초기화
            $fileInput.val('');
        });

		// 삭제 버튼 클릭 이벤트 처리
		$addFileList.on('click', '.delete-file', function() {
			$(this).parent().remove();
			// 파일 목록 업데이트
			$uploadName.text(updatedFileNames.join(', '));
		});
    }

    setupFileInputHandlers();
});


