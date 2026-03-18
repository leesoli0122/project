$(document).ready(function () {

    /**
     * ?•½ê´? ?™?˜ ?•„?ˆ˜/?„ ?ƒ ë¶„ë¦¬ ?  ê²½ìš°
     */
    var TermsAgreement = (function () {

        var $reqGroup, $optGroup, $elems
        // , $submitBtn;

        return {
            init: function () {
                $reqGroup = $('.check-box.terms[data-group="required"]'); // ?•„?ˆ˜ ?™?˜ ê·¸ë£¹
                $optGroup = $('.check-box.terms[data-group="optional"]'); // ?„ ?ƒ ?™?˜ ê·¸ë£¹

                $elems = {
                    // ?•„?ˆ˜ ?™?˜ ê·¸ë£¹
                    $chkAll : $reqGroup.find('#chkAll'),
                    $reqChks : $reqGroup.find('.chkReq'),

                    // ?„ ?ƒ ?™?˜ ê·¸ë£¹
                    $chkOptAll : $optGroup.find('#chkOptAll'),
                    $optChks : $optGroup.find('.chkOpt'),
                    $consChk : $optGroup.find('#chkCons'),
                    $consChks : $optGroup.find('.chkConsChild')
                };

                // $submitBtn = $('#submitBtn');

                this.bindEvents();
            },

            bindEvents: function () {
                var self = this;

                // ?•„?ˆ˜ ?™?˜ ? „ì²? ì²´í¬
                $elems.$chkAll.on('change', function () {
                    var isChecked = $(this).prop('checked');
                    $elems.$reqChks.prop('checked', isChecked);
                    self.updateChkAll();
                    // self.updateSubmitBtn();
                });

                // ?„ ?ƒ ?™?˜ ? „ì²? ì²´í¬
                $elems.$chkOptAll.on('change', function () {
                    var isChecked = $(this).prop('checked');
                    $elems.$optChks.prop('checked', isChecked);
                    $elems.$consChk.prop('checked', isChecked);
                    $elems.$consChks.prop('checked', isChecked);
                    self.updateChkOptAll();
                });

                // ê°œë³„ ?•­ëª? ë³?ê²? ?‹œ ? „ì²? ì²´í¬ë°•ìŠ¤ ?—…?°?´?Š¸
                $elems.$reqChks.on('change', function () {
                    self.updateChkAll();
                    // self.updateSubmitBtn();
                });

                $elems.$optChks.on('change', function () {
                    self.updateChkOptAll();
                });

                $elems.$consChks.on('change', function () {
                    self.updateConsChk();
                    self.updateChkOptAll();
                });
            },

            updateChkAll: function () {
                var allChecked = $elems.$reqChks.length === $elems.$reqChks.filter(':checked').length;
                $elems.$chkAll.prop('checked', allChecked);
            },

            updateChkOptAll: function () {
                var allOptChecked = $elems.$optChks.length === $elems.$optChks.filter(':checked').length;
                var allConsChecked = $elems.$consChks.length === $elems.$consChks.filter(':checked').length;
                $elems.$chkOptAll.prop('checked', allOptChecked && allConsChecked);
            },

            updateConsChk: function () {
                $elems.$consChk.prop('checked', $elems.$consChks.filter(':checked').length > 0);
            },

            // updateSubmitBtn: function () {
            //     $submitBtn.prop('disabled', $elems.$reqChks.length !== $elems.$reqChks.filter(':checked').length);
            // }
        };
    })();

    TermsAgreement.init();
});
