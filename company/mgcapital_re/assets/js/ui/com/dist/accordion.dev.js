"use strict";

$(function () {
  // �����ڵ� �̽������� ��� (EUC-KR ����)
  var TXT_NEYONG = "\uB0B4\uC6A9"; // "����"

  var LABEL_CLOSE = "\uB2EB\uAE30"; // "�ݱ�"

  var LABEL_OPEN = "\uC5F4\uAE30"; // "����"

  var accordionToggle = function () {
    return {
      open: function open(target) {
        target.addClass("on").attr("title", LABEL_CLOSE).attr("aria-expanded", "true").find(".ic-arr .sr-only").text(TXT_NEYONG + " " + LABEL_CLOSE);
      },
      close: function close(target) {
        target.removeClass("on").attr("title", LABEL_OPEN).attr("aria-expanded", "false").find(".ic-arr .sr-only").text(TXT_NEYONG + " " + LABEL_OPEN);
      },
      toggle: function toggle(target) {
        if (target.hasClass("on")) {
          this.close(target);
        } else {
          this.open(target);
        }
      }
    };
  }();

  $(document).on("click", ".accordionToggle .accordion-item > .tit", function () {
    var $currentAccordion = $(this).closest(".accordion-item");
    accordionToggle.toggle($currentAccordion);
  });
});
$(document).ready(function () {
  function toggleAccordionClass() {
    if ($(window).width() <= 768) {
      // ����� ����
      $(".product-content").addClass("accordion-list accordionToggle");
    } else {
      $(".product-content").removeClass("accordion-list accordionToggle");
    }
  } // ó�� �ε� �� ����


  toggleAccordionClass(); // ȭ�� ũ�� �ٲ� �� ����

  $(window).resize(function () {
    toggleAccordionClass();
  });
});
$(document).ready(function () {
  function toggleAccordionButton() {
    $(".tit").each(function () {
      var $btn = $(this).find("button.ic-arr");

      if ($(window).width() <= 768) {
        // �����: ��ư ������ ����
        if ($btn.length === 0) {
          $(this).append('<button type="button" class="ic-arr"><span class="sr-only">���� ����</span></button>');
        }
      } else {
        // PC: ��ư ������ ����
        if ($btn.length > 0) {
          $btn.remove();
        }
      }
    });
  } // ó�� �ε��� �� ����


  toggleAccordionButton(); // ȭ�� ũ�� ���� �� ����

  $(window).resize(function () {
    toggleAccordionButton();
  });
});
//# sourceMappingURL=accordion.dev.js.map
