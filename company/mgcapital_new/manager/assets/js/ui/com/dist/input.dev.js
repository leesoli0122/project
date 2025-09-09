"use strict";

(function ($) {
  /*---------------------------
    Android ��ǲ ��Ŀ�� ��ũ��
  ---------------------------*/
  function iptFocusScrl() {
    if (/Android/i.test(navigator.userAgent)) {
      window.addEventListener('resize', function () {
        var el = document.activeElement;

        if (el && el.tagName === 'INPUT') {
          window.setTimeout(function () {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 0);
        }
      });
    }
  }
  /*---------------------------
    3�ڸ� �޸� ����
  ---------------------------*/


  var commaFormatter = function () {
    function format(input) {
      var v = (input.value || '').replace(/[^0-9]/g, '');
      v = v.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      input.value = v;
    }

    return {
      format: format
    };
  }();
  /*---------------------------
    ���� ���δ�
  ---------------------------*/


  var fileUploader = function () {
    return {
      init: function init() {
        var $uploadInput = $('.uploadInput'); // �ؽ�Ʈ �ڽ�(�б�����)

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
          var name = this.files && this.files.length ? this.files[0].name : '';
          $uploadInput.val(name).addClass('up');
          $fileLabel.text(name ? '���õ� ����: ' + name : '');
        });
      }
    };
  }();
  /*---------------------------
    �Է� Ŭ���� ��ư
    - ���۰� ������ �ڵ����� ����
    - �� ���� ���� ��ư ����
  ---------------------------*/


  function refreshClearBtn($input) {
    var $wrap = $input.closest('.ipt-clear');

    if ($wrap.length === 0) {
      $input.wrap('<span class="ipt-clear"></span>');
      $wrap = $input.parent();
    }

    var disabled = $input.prop('disabled') || $input.prop('readonly');
    var hasVal = ($input.val() || '').trim() !== '';
    var $btn = $wrap.find('> .btn-clear');

    if (hasVal && !disabled) {
      if ($btn.length === 0) {
        $('<button type="button" class="btn-clear" aria-label="�Է� �����" title="�����">\xd7</button>').appendTo($wrap).on('click', function (e) {
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
    $input.on('input', function () {
      refreshClearBtn($(this));
    }).on('keyup change propertychange', function () {
      refreshClearBtn($(this));
    }); // IE ����

    $input.data('clear-bound', true);
    refreshClearBtn($input); // �ʱⰪ �ݿ�
  }

  function initClearable() {
    $('input[type="text"]').each(function () {
      bindOnce($(this));
    });
  }
  /*---------------------------
    DOM Ready
  ---------------------------*/


  $(function () {
    iptFocusScrl();
    fileUploader.init(); // ���� ��ǲ 3�ڸ� �޸�

    $(document).on('input', 'input[inputmode=numeric]', function () {
      commaFormatter.format(this);
    }); // Ŭ���� ��ư: �ʱ�ȭ + ���� ��� ����

    initClearable();
    $(document).on('focusin', 'input[type="text"]', function () {
      bindOnce($(this));
    });
  });
})(jQuery); //������ option ���󺯰�
//# sourceMappingURL=input.dev.js.map
