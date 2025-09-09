(function ($) {

    /*---------------------------
      Android 인풋 포커스 스크롤
    ---------------------------*/
    function iptFocusScrl() {
      if (/Android/i.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
          var el = document.activeElement;
          if (el && el.tagName === 'INPUT') {
            window.setTimeout(function () {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 0);
          }
        });
      }
    }

    /*---------------------------
      3자리 콤마 포맷
    ---------------------------*/
    var commaFormatter = (function () {
      function format(input) {
        var v = (input.value || '').replace(/[^0-9]/g, '');
        v = v.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        input.value = v;
      }
      return { format: format };
    })();

    /*---------------------------
      파일 업로더
    ---------------------------*/
    var fileUploader = (function () {
      return {
        init: function () {
          var $uploadInput = $('.uploadInput'); // 텍스트 박스(읽기전용)
          var $fileInput = $('#files');
          var $btnPick = $('#btnPick');
          var $fileLabel = $('.fileLabel');

          function openPicker(e) {
            e.preventDefault && e.preventDefault();
            $fileInput.trigger('click');
          }
          $btnPick.on('click', openPicker);
          $btnPick.on('keydown', function (e) {
            var k = e.key || e.keyCode;
            if (k === 'Enter' || k === 13 || k === ' ' || k === 32) openPicker(e);
          });

          $fileInput.on('change', function () {
            var name = (this.files && this.files.length) ? this.files[0].name : '';
            $uploadInput.val(name).addClass('up');
            $fileLabel.text(name ? ('선택된 파일: ' + name) : '');
          });
        }
      };
    })();

    /*---------------------------
      입력 클리어 버튼
      - 래퍼가 없으면 자동으로 감쌈
      - 값 있을 때만 버튼 생성
    ---------------------------*/
    function refreshClearBtn($input) {
        var $wrap = $input.closest('.ipt-clear');
        if ($wrap.length === 0) {
          // 감싸지 않고 바로 종료 → ipt-clear 없으면 동작 안함
          return;
        }
      
        var disabled = $input.prop('disabled') || $input.prop('readonly');
        var hasVal = ($input.val() || '').trim() !== '';
        var $btn = $wrap.find('> .btn-clear');
      
        if (hasVal && !disabled) {
          if ($btn.length === 0) {
            $('<button type="button" class="btn-clear" aria-label="입력 지우기" title="지우기">\xd7</button>')
              .appendTo($wrap)
              .on('click', function (e) {
                e.preventDefault();
                var $target = $(this).siblings('input[type="text"]').first();
                $target.val('').focus().trigger('input');
                $(this).remove();
              });
          }
        } else {
          $btn.remove();
        }
      }
      
      function bindOnce($input) {
        if ($input.data('clear-bound')) return;
        $input
          .on('input', function () { refreshClearBtn($(this)); })
          .on('keyup change propertychange', function () { refreshClearBtn($(this)); }); // IE 대응
        $input.data('clear-bound', true);
        refreshClearBtn($input); // 초기값 반영
      }
      
      function initClearable() {
        $('input[type="text"]').each(function () { bindOnce($(this)); });
      }
      
    /*---------------------------
      DOM Ready
    ---------------------------*/
    $(function () {
      iptFocusScrl();
      fileUploader.init();

      // 숫자 인풋 3자리 콤마
      $(document).on('input', 'input[inputmode=numeric]', function () {
        commaFormatter.format(this);
      });

      // 클리어 버튼: 초기화 + 동적 요소 대응
      initClearable();
      $(document).on('focusin', 'input[type="text"]', function () { bindOnce($(this)); });
    });

})(jQuery);
  

//셀릭스 option 색상변경
