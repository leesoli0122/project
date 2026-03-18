"use strict";

$(document).ready(function () {
  /**
   * ?���? ?��?��
   */
  var TermsAgreement = function () {
    var $chkAll, $reqChks, $optChks, $consChk, $consChks, $allChks, $submitBtn;
    return {
      // 초기?��
      init: function init() {
        $chkAll = $('#chkAll'); // ?���? ?��?�� (�?�?)

        $reqChks = $('.chkReq'); // ?��?�� ?���?

        $optChks = $('.chkOpt'); // ?��?�� ?���?

        $consChk = $('#chkCons'); // ?��?�� ?��?�� (�?�?)

        $consChks = $('.chkConsChild'); // ?��?�� ?��?�� ?���? (SMS, ?��메일, 광고?��)

        $allChks = $('.chkReq, .chkOpt, #chkCons, .chkConsChild'); // ?���? ?���?

        $submitBtn = $('#submitBtn'); // �??�� 버튼

        this.bindEvents();
      },
      // ?��벤트
      bindEvents: function bindEvents() {
        var self = this; // ?���? ?��?�� (�?�?)

        $chkAll.on('change', function () {
          self.toggleAll($(this).prop('checked'));
        }); // ?���? ?���?

        $allChks.on('change', function () {
          self.uptSubmitBtn();
          self.uptAllChk();
        }); // ?��?�� ?��?�� (�?�?)

        $consChk.on('change', function () {
          var isChecked = $(this).prop('checked');
          $consChks.prop('checked', isChecked);
          self.uptAllChk();
        }); // ?��?�� ?��?�� ?���?

        $consChks.on('change', function () {
          self.uptConsAllChk();
          self.uptAllChk();
        });
      },
      toggleAll: function toggleAll(isChecked) {
        $allChks.prop('checked', isChecked);
        this.uptSubmitBtn();
        this.uptAllChk();
      },
      // ?���? ?��?�� 체크 ?��?�� ?��?��?��?�� (체크 ?���?)
      uptAllChk: function uptAllChk() {
        var allReqChked = $reqChks.length === $reqChks.filter(':checked').length; // ?��?�� ?���?

        var allSelChked = $optChks.length === $optChks.filter(':checked').length; // ?��?�� ?���?

        var allConsChked = $consChks.length === $consChks.filter(':checked').length; // ?��?�� ?��?��

        var allChecked = $allChks.length === $allChks.filter(':checked').length; // 모든 ?���?
        //  ?��?�� + ?��?�� + ?��?�� ?��?�� ( 모두 체크 ?�� ?���? ?��?�� 체크 ?��?��?�� )

        if (allReqChked && allSelChked && allConsChked) {
          $chkAll.prop('checked', true);
        } else {
          $chkAll.prop('checked', false);
        }
      },
      // ?��?�� ?��?�� ?���? (?��?�� ?���? �? ?��?��?��?�� ?��?�� ?��)
      uptConsAllChk: function uptConsAllChk() {
        var anyConsChked = $consChks.filter(':checked').length > 0;
        $consChk.prop('checked', anyConsChked);
      },
      //버튼 ?��?��?�� (?��?�� ?���?)
      uptSubmitBtn: function uptSubmitBtn() {
        var allReqChked = $reqChks.length === $reqChks.filter(':checked').length;
        $submitBtn.prop('disabled', !allReqChked);
      }
    };
  }();

  TermsAgreement.init();
});
//# sourceMappingURL=terms_test.dev.js.map
