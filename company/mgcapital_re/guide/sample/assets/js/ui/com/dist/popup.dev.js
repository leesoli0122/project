"use strict";

$(document).ready(function () {
  /**
   *  ** fkSelAndPopupResetOverflow �Լ� ���� ����
   *  - �˾��� ����Ʈ�� ��� ������ ���� `overflow: ''` ����
  **/

  /**
   *  �˾�
   *  data-popup-open :: full �˾�, btmSheet �˾�
   *  data-modal-open :: modal
   *  data-menu-open :: ��ü �޴�
  **/
  (function () {
    /**
     *  �˾� ���� ���
     **/
    // var popupContainer = $('.layerPopup');
    // popupContainer.css('visibility', 'hidden');
    var popupL = {
      /**
       * �˾� �ʱ�ȭ
       */
      initPopup: function initPopup(id) {
        var $target = $('#' + id);
        if (!$target.length) return;
        $target.addClass('on');
        $target.find('.pop-con-wrap').scrollTop(0);
        $('.contentWrap').css('overflow', 'hidden');
        console.log('initPopup: ' + '���� ����'); //full �˾� header fixed ó��
        // setTimeout(function () {
        //     if ($target.hasClass('full')) {
        //         var $header = $target.find('.pop-header');
        //         if ($header.length) {
        //             $header.css('position', 'fixed');
        //             console.log('initPopup: ' + 'fixed ����');
        //         }
        //     }
        // }, 100);
        // ���ټ�: ��Ŀ�� ó��

        var $focusEl = $target.find('.pop-area');

        if ($focusEl.length) {
          $focusEl.attr('tabindex', '0').focus();
          console.log('focusEl: ' + '��Ŀ�� ����');
        } else {
          $target.removeAttr('tabindex');
        }
      },

      /**
       * �˾� ����
       */
      openPopup: function openPopup(id) {
        this.initPopup(id);
      },

      /**
       * ��� ����
       */
      openModal: function openModal(id) {
        this.initPopup(id);
        console.log('openModal: ' + '��� ����');
      },

      /**
       * �޴� �˾� ����
       */
      openMenu: function openMenu(id) {
        this.initPopup(id);
        console.log('openMenu: ' + '�޴� �˾� ����');
      },

      /**
       * �˾� �ݱ�
       */
      closePopup: function closePopup(id) {
        var _target = document.getElementById(id);

        if (_target) _target.classList.remove('on');
        this.fkSelAndPopupResetOverflow(); // �ʱ�ȭ

        if (_target.classList.contains('full')) {
          var header = _target.querySelector('.pop-header');

          if (header) {
            header.style.position = '';
            console.log('closePopup: ' + '���� �ʱ�ȭ');
          }
        }

        this.fkSelAndPopupResetOverflow();
      },

      /**
       * �˾� �� ����Ʈ ���� �� `overflow` �ʱ�ȭ
       */
      fkSelAndPopupResetOverflow: function fkSelAndPopupResetOverflow() {
        var isPopupOpen = $('.layerPopup.on').length > 0;
        var isSelectOpen = $('.stove-option-layer.on').length > 0;

        if (!$('.layerPopup.on').length && !$('.stove-option-layer.on').length) {
          $('.contentWrap').css('overflow', '');
          $('.pop-area').removeAttr('tabindex');
          console.log('fkSelAndPopupResetOverflow: ' + '������ �˾� ����');
          setTimeout(function () {
            $('.layerPopup.toggleUp').removeClass('active');
            console.log('toggleUp: ' + '�ʱ�ȭ');
          }, 10);
        }
      }
    };
    /**
     * ���ҽ�Ʈ ���� ���
     **/

    var btmShtTL = {
      /**
       * ���ҽ�Ʈ���
       */
      btmAti: function btmAti(id) {
        var $target = $('#' + id);
        if (!$target.length) return;
        var $contentWrap = $target.find('.pop-con-wrap');
        $target.toggleClass('active');
        console.log('btmAti: ' + '���ҽ�Ʈ��� ����');

        if ($target.hasClass('active')) {
          $contentWrap.scrollTop(0).attr('tabindex', '-1').focus();
          console.log('btmAti: ' + '��Ŀ�� ����');
        } else {
          $contentWrap.removeAttr('tabindex');
        }
      }
    };
    /**
     * �̺�Ʈ ������ �̿��� �˾� ����
     */

    $(document).on('click', function (e) {
      var $target = $(e.target); // �˾� ����

      var $openBtn = $target.closest('[data-popup-open]');
      if ($openBtn.length) return popupL.openPopup($openBtn.data('popup-open')); // ��� ����

      var $modalBtn = $target.closest('[data-modal-open]');
      if ($modalBtn.length) return popupL.openModal($modalBtn.data('modal-open')); // �޴� ����

      var $menuBtn = $target.closest('[data-menu-open]');
      if ($menuBtn.length) return popupL.openMenu($menuBtn.data('menu-open')); // �˾� �ݱ�

      var $closeBtn = $target.closest('[data-popup-close]');
      if ($closeBtn.length) return popupL.closePopup($closeBtn.data('popup-close')); // ���ҽ�Ʈ ���

      var $btmToggleBtn = $target.closest('[data-btm-toggle]');
      if ($btmToggleBtn.length) return btmShtTL.btmAti($btmToggleBtn.data('btm-toggle')); // ���ҽ�Ʈ dim Ŭ�� �� �ݱ�

      var $dimLayer = $target.closest('.layerPopup.btmSheet');

      if ($dimLayer.length && $target.is($dimLayer)) {
        $dimLayer.removeClass('active').find('.pop-con-wrap').removeAttr('tabindex');
        popupL.closePopup($dimLayer.attr('id'));
        return;
      }
    }); // ���� ���� ���� - �ʿ��� ���� ������ ����� �� �ֵ��� ����

    window.popupL = popupL;
    window.btmShtTL = btmShtTL; // �������� ���� �����ϵ��� ���� �Լ��� ����

    window.fkSelAndPopupResetOverflow = popupL.fkSelAndPopupResetOverflow;
  })();
});
//# sourceMappingURL=popup.dev.js.map
