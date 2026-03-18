$(document).ready(function(){

    /**
     * ?•½ê´? ?™?˜
     */
    var TermsAgreement = (function () {

        var $chkAll, $reqChks, $optChks, $consChk, $consChks, $allChks, $submitBtn;

        return {
            // ì´ˆê¸°?™”
            init: function () {
                $chkAll = $('#chkAll'); // ? „ì²? ?™?˜ (ë¶?ëª?)
                $reqChks = $('.chkReq'); // ?•„?ˆ˜ ?•­ëª?
                $optChks = $('.chkOpt'); // ?„ ?ƒ ?•­ëª?
                $consChk = $('#chkCons'); // ?ˆ˜?‹  ?™?˜ (ë¶?ëª?)
                $consChks = $('.chkConsChild'); // ?ˆ˜?‹  ?™?˜ ?•­ëª? (SMS, ?´ë©”ì¼, ê´‘ê³ ?„±)
                $allChks = $('.chkReq, .chkOpt, #chkCons, .chkConsChild'); // ? „ì²? ?•­ëª?
                $submitBtn = $('#submitBtn'); // ê°??ž… ë²„íŠ¼

                this.bindEvents();
            },

            // ?´ë²¤íŠ¸
            bindEvents: function () {

                var self = this;

                // ? „ì²? ?™?˜ (ë¶?ëª?)
                $chkAll.on('change', function () {
                    self.toggleAll($(this).prop('checked'));
                });

                // ? „ì²? ?•­ëª?
                $allChks.on('change', function () {
                    self.uptSubmitBtn();
                    self.uptAllChk();
                });

                // ?ˆ˜?‹  ?™?˜ (ë¶?ëª?)
                $consChk.on('change', function () {
                    var isChecked = $(this).prop('checked');
                    $consChks.prop('checked', isChecked);
                    self.uptAllChk();
                });

                // ?ˆ˜?‹  ?™?˜ ?•­ëª?
                $consChks.on('change', function () {
                    self.uptConsAllChk()
                    self.uptAllChk();
                });
            },

            toggleAll: function (isChecked) {
                $allChks.prop('checked', isChecked);
                this.uptSubmitBtn();
                this.uptAllChk();
            },

            // ? „ì²? ?™?˜ ì²´í¬ ?ƒ?ƒœ ?—…?°?´?Š¸ (ì²´í¬ ?—¬ë¶?)
            uptAllChk: function () {
                var allReqChked = $reqChks.length === $reqChks.filter(':checked').length; // ?•„?ˆ˜ ?•­ëª?
                var allSelChked = $optChks.length === $optChks.filter(':checked').length; // ?„ ?ƒ ?•­ëª?
                var allConsChked = $consChks.length === $consChks.filter(':checked').length; // ?ˆ˜?‹  ?™?˜
                var allChecked = $allChks.length === $allChks.filter(':checked').length; // ëª¨ë“  ?•­ëª?

                 //  ?•„?ˆ˜ + ?„ ?ƒ + ?ˆ˜?‹  ?™?˜ ( ëª¨ë‘ ì²´í¬ ?‹œ ? „ì²? ?™?˜ ì²´í¬ ?™œ?„±?™” )
                if (allReqChked && allSelChked && allConsChked) {
                    $chkAll.prop('checked', true);
                } else {
                    $chkAll.prop('checked', false);
                }
            },

            // ?ˆ˜?‹  ?™?˜ ?•­ëª? (?•˜?œ„ ?•­ëª? ì¤? ?•˜?‚˜?¼?„ ?„ ?ƒ ?‹œ)
            uptConsAllChk: function () {
                var anyConsChked = $consChks.filter(':checked').length > 0;
                $consChk.prop('checked', anyConsChked);
            },

            //ë²„íŠ¼ ?™œ?„±?™” (?•„?ˆ˜ ?•­ëª?)
            uptSubmitBtn: function () {
                var allReqChked = $reqChks.length === $reqChks.filter(':checked').length;
                $submitBtn.prop('disabled', !allReqChked);
            }
        };
    })();

    TermsAgreement.init();


});