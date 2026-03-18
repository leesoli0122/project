"use strict";

$(document).ready(function () {
  /**
   *   TAB
  **/
  var Tabs = function () {
    return {
      init: function init(container) {
        var $tabContainer = $(container);
        var $tabs = $tabContainer.find('.tab-item, .nested-tab-item'); // var $panels = $tabContainer.find('.tab-panel, .nested-tab-panel');
        // �ʱ� Ȱ�� ��

        $tabs.each(function () {
          var $tab = $(this);
          var targetId = $tab.attr('data-tab');
          var $panel = $('#' + targetId);

          if ($tab.hasClass('active')) {
            $tab.attr('title', '���õ�');
            $panel.show();
          } else {
            $tab.removeAttr('title');
            $panel.hide();
          }
        }); // event binding

        $tabs.on('click', function () {
          Tabs.switchTab($(this), $tabContainer);
        });
      },
      switchTab: function switchTab($clickedTab, $tabContainer) {
        var targetId = $clickedTab.attr('data-tab');
        var $targetPanel = $('#' + targetId);
        var isNested = $clickedTab.hasClass('nested-tab-item'); // ���� �׷��� �� ã��

        var $allTabs = isNested ? $tabContainer.find('.nested-tab-item') : $tabContainer.find('.tab-item');
        var $allPanels = isNested ? $tabContainer.find('.nested-tab-panel') : $tabContainer.find('.tab-panel'); // ���� �� �ʱ�ȭ

        $allTabs.removeClass('active').removeAttr('title');
        $allPanels.hide(); // �� �� Ȱ��ȭ

        $clickedTab.addClass('active').attr('title', '���õ�');
        $targetPanel.show(); // ����� select ����ȭ

        var $mobileSelect = $tabContainer.find('.tab-select-mobile select');

        if ($mobileSelect.length) {
          $mobileSelect.val(targetId);
        }
      }
    };
  }(); // ��� �� �ʱ�ȭ


  $('.jsTab, .nestedJsTab').each(function () {
    Tabs.init(this);
  });
  /**
   *   TAB Swiper - IE11 ȣȯ�� ó��
  **/

  var tabSwiperL = function () {
    var pager = ['����', '����2', '����3', '����4'];
    var tabSwiper = null; // Swiper�� �����ϰ� IE11�� �ƴ� ��쿡�� �ʱ�ȭ

    if (typeof Swiper !== 'undefined' && !isIE11()) {
      try {
        tabSwiper = new Swiper('.tabs.tab-area.swiper', {
          spaceBetween: 20,
          autoHeight: true,
          pagination: {
            el: '.tabs ul',
            clickable: true,
            renderBullet: function renderBullet(index, className) {
              return '<li class="tab-item ' + className + '">' + pager[index] + '</li>';
            }
          }
        });
      } catch (e) {
        console.log('Swiper �ʱ�ȭ ����:', e.message); // Swiper �ʱ�ȭ ���� �� �⺻ �� �������� ����

        initFallbackTabs();
      }
    } else {
      // IE11�̰ų� Swiper�� ���� ��� �⺻ �� �������� ����
      initFallbackTabs();
    }

    return tabSwiper;
  }();
  /**
   * IE11 ���� �Լ�
   */


  function isIE11() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var msie11 = ua.indexOf('Trident/');
    return msie > 0 || msie11 > 0;
  }
  /**
   * Swiper ��� �⺻ �� �������� ����
   */


  function initFallbackTabs() {
    var $swiperContainer = $('.tabs.tab-area.swiper');

    if ($swiperContainer.length > 0) {
      var $tabList = $swiperContainer.find('.swiper-pager.tab-list');
      var $slides = $swiperContainer.find('.swiper-slide'); // �⺻ �� ��Ÿ�� ����

      $tabList.find('li').each(function (index) {
        var $tab = $(this);
        var $slide = $slides.eq(index); // ù ��° �Ǹ� Ȱ��ȭ

        if (index === 0) {
          $tab.addClass('swiper-pagination-bullet-active');
          $slide.show();
        } else {
          $slide.hide();
        } // �� Ŭ�� �̺�Ʈ


        $tab.on('click', function () {
          $tabList.find('li').removeClass('swiper-pagination-bullet-active');
          $tab.addClass('swiper-pagination-bullet-active');
          $slides.hide();
          $slide.show();
        });
      });
    }
  }
  /**
  * ����� select�� PC �� ����ȭ
  */


  var $mobileSelect = $('.tab-select-mobile select');

  if ($mobileSelect.length) {
    $mobileSelect.on('change', function () {
      var selectedValue = $(this).val();
      var $tabContainer = $(this).closest('.jsTab');
      var $targetTab = $tabContainer.find('.tab-item[data-tab="' + selectedValue + '"]');

      if ($targetTab.length) {
        Tabs.switchTab($targetTab, $tabContainer);
      }
    });
  }
});
//# sourceMappingURL=tab.dev.js.map
