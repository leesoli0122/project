"use strict";

$(document).ready(function () {
  /**
   * ?���? ?��?�� ?��?��/?��?�� 분리 ?�� 경우
   */
  var TermsAgreement = function () {
    var $reqGroup, $optGroup, $elems; // , $submitBtn;

    return {
      init: function init() {
        $reqGroup = $('.check-box.terms[data-group="required"]'); // ?��?�� ?��?�� 그룹

        $optGroup = $('.check-box.terms[data-group="optional"]'); // ?��?�� ?��?�� 그룹

        $elems = {
          // ?��?�� ?��?�� 그룹
          $chkAll: $reqGroup.find('#chkAll'),
          $reqChks: $reqGroup.find('.chkReq'),
          // ?��?�� ?��?�� 그룹
          $chkOptAll: $optGroup.find('#chkOptAll'),
          $optChks: $optGroup.find('.chkOpt'),
          $consChk: $optGroup.find('#chkCons'),
          $consChks: $optGroup.find('.chkConsChild')
        }; // $submitBtn = $('#submitBtn');

        this.bindEvents();
      },
      bindEvents: function bindEvents() {
        var self = this; // ?��?�� ?��?�� ?���? 체크

        $elems.$chkAll.on('change', function () {
          var isChecked = $(this).prop('checked');
          $elems.$reqChks.prop('checked', isChecked);
          self.updateChkAll(); // self.updateSubmitBtn();
        }); // ?��?�� ?��?�� ?���? 체크

        $elems.$chkOptAll.on('change', function () {
          var isChecked = $(this).prop('checked');
          $elems.$optChks.prop('checked', isChecked);
          $elems.$consChk.prop('checked', isChecked);
          $elems.$consChks.prop('checked', isChecked);
          self.updateChkOptAll();
        }); // 개별 ?���? �?�? ?�� ?���? 체크박스 ?��?��?��?��

        $elems.$reqChks.on('change', function () {
          self.updateChkAll(); // self.updateSubmitBtn();
        });
        $elems.$optChks.on('change', function () {
          self.updateChkOptAll();
        });
        $elems.$consChks.on('change', function () {
          self.updateConsChk();
          self.updateChkOptAll();
        });
      },
      updateChkAll: function updateChkAll() {
        var allChecked = $elems.$reqChks.length === $elems.$reqChks.filter(':checked').length;
        $elems.$chkAll.prop('checked', allChecked);
      },
      updateChkOptAll: function updateChkOptAll() {
        var allOptChecked = $elems.$optChks.length === $elems.$optChks.filter(':checked').length;
        var allConsChecked = $elems.$consChks.length === $elems.$consChks.filter(':checked').length;
        $elems.$chkOptAll.prop('checked', allOptChecked && allConsChecked);
      },
      updateConsChk: function updateConsChk() {
        $elems.$consChk.prop('checked', $elems.$consChks.filter(':checked').length > 0);
      } // updateSubmitBtn: function () {
      //     $submitBtn.prop('disabled', $elems.$reqChks.length !== $elems.$reqChks.filter(':checked').length);
      // }

    };
  }();

  TermsAgreement.init();
});
//# sourceMappingURL=terms_2.dev.js.map
