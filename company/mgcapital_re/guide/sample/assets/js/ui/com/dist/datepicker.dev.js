"use strict";

$(document).ready(function () {
  var datepickerL = {
    init: function init() {
      $(".datepicker").datepicker({
        minDate: 0,
        closeText: "�ݱ�",
        prevText: "������",
        nextText: "������",
        currentText: "����",
        monthNames: ["1��", "2��", "3��", "4��", "5��", "6��", "7��", "8��", "9��", "10��", "11��", "12��"],
        monthNamesShort: ["1��", "2��", "3��", "4��", "5��", "6��", "7��", "8��", "9��", "10��", "11��", "12��"],
        dayNames: ["�Ͽ���", "������", "ȭ����", "������", "�����", "�ݿ���", "�����"],
        dayNamesShort: ["��", "��", "ȭ", "��", "��", "��", "��"],
        dayNamesMin: ["��", "��", "ȭ", "��", "��", "��", "��"],
        weekHeader: "��",
        dateFormat: "yy.m.d",
        // ��¥���� ��)yy�� m�� d��
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: "��"
      });
    }
  };
  datepickerL.init();
});
//# sourceMappingURL=datepicker.dev.js.map
