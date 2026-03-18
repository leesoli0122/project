$(document).ready(function () {
    var TermsAgreement = (function () {
        var $termsPopup = $("#fullPopup"), // ?åù?óÖ
            $termsList = $(".terms-list-area li"), // ?ïΩÍ¥? Î¶¨Ïä§?ä∏
            $chkAll = $("#chkAll"), // ?†ÑÏ≤? ?èô?ùò Ï≤¥ÌÅ¨Î∞ïÏä§
            $reqChks = $(".chkReq"), // ?ïÑ?àò ?ï≠Î™? Ï≤¥ÌÅ¨Î∞ïÏä§
            $termsBtn = $(".btn-secondary"), // "?ôï?ù∏?ñà?äµ?ãà?ã§" Î≤ÑÌäº
            $submitBtn = $("#submitBtn"), // ?†úÏ∂? Î≤ÑÌäº
            $popupWrap = $(".pop-con-wrap"), // ?ä§?Å¨Î°? Í∞êÏ???ö©
            currentIndex = 0;

        return {
            // Ï¥àÍ∏∞?ôî
            init: function () {
                this.bindEvents();
            },

            // ?ù¥Î≤§Ìä∏ Î∞îÏù∏?î©
            bindEvents: function () {
                var self = this;

                // ?ïΩÍ¥? ?Å¥Î¶? ?ãú ?åù?óÖ ?ó¥Í∏?
                $(".check-box.terms").on("click", function () {
                    self.openPopup("fullPopup");
                });

                // ?ä§?Å¨Î°? ?ù¥Î≤§Ìä∏ Í∞êÏ??
                $popupWrap.on("scroll", function () {
                    self.checkScroll();
                });

                // "?ôï?ù∏?ñà?äµ?ãà?ã§" Î≤ÑÌäº ?Å¥Î¶? ?ãú ?ã§?ùå ?ïΩÍ¥??úºÎ°? ?ù¥?èô
                $termsBtn.on("click", function () {
                    self.nextTerm();
                });

                // ?†ÑÏ≤? ?èô?ùò Ï≤¥ÌÅ¨Î∞ïÏä§ Î≥?Í≤? ?ãú Î™®Îì† ?ï≠Î™? Ï≤¥ÌÅ¨
                $chkAll.on("change", function () {
                    self.toggleAll($(this).prop("checked"));
                });

                // Í∞úÎ≥Ñ Ï≤¥ÌÅ¨Î∞ïÏä§ Î≥?Í≤? ?ãú ?†ÑÏ≤? ?èô?ùò ?ó¨Î∂? ?óÖ?ç∞?ù¥?ä∏
                $reqChks.on("change", function () {
                    self.updateAllCheck();
                });
            },

            // ?åù?óÖ ?ó¥Í∏? (popupL ?ôú?ö©)
            openPopup: function (id) {
                if (typeof popupL !== "undefined" && popupL.openPopup) {
                    popupL.openPopup(id);
                } else {
                    console.error("popupL?ù¥ ?†ï?ùò?êòÏß? ?ïä?ùå");
                }
                this.showCurrentTerm();
            },

            // ?òÑ?û¨ ?ïΩÍ¥? ?ëú?ãú
            showCurrentTerm: function () {
                if ($termsList.length === 0) {
                    console.error("?ïΩÍ¥? Î¶¨Ïä§?ä∏Í∞? Ï°¥Ïû¨?ïòÏß? ?ïä?äµ?ãà?ã§.");
                    return;
                }

                // Î™®Îì† ?ïΩÍ¥? ?à®Í∏∞Í≥†, ?òÑ?û¨ ?ïΩÍ¥?Îß? Î≥¥Ïù¥Í≤? ?Ñ§?†ï
                $termsList.hide();
                var $currentTerm = $termsList.eq(currentIndex);

                if ($currentTerm.length === 0) {
                    console.warn("?ûòÎ™ªÎêú currentIndex:", currentIndex);
                    return;
                }

                $currentTerm.show();
                $popupWrap.scrollTop(0); // ?ä§?Å¨Î°? Ï¥àÍ∏∞?ôî
                $termsBtn.text("?ä§?Å¨Î°§ÏùÑ ?ÅùÍπåÏ?? ?Ç¥?†§Ï£ºÏÑ∏?öî").prop("disabled", true);
            },

            // ?ä§?Å¨Î°§Ïù¥ ?ÅùÍπåÏ?? ?Ç¥?†§Í∞îÎäîÏß? ?ôï?ù∏
            checkScroll: function () {
                var scrollHeight = $popupWrap.prop("scrollHeight");
                var scrollTop = $popupWrap.scrollTop();
                var clientHeight = $popupWrap.outerHeight();

                if (scrollTop + clientHeight >= scrollHeight - 10) {
                    $termsBtn.text("?ôï?ù∏?ñà?äµ?ãà?ã§").prop("disabled", false);
                }
            },

            // ?ã§?ùå ?ïΩÍ¥??úºÎ°? ?ù¥?èô
            nextTerm: function () {
                // ?òÑ?û¨ ?ïΩÍ¥? Ï≤¥ÌÅ¨ Ï≤òÎ¶¨
                $reqChks.eq(currentIndex).prop("checked", true);

                // ?ã§?ùå ?ïΩÍ¥??úºÎ°? ?ù¥?èô
                currentIndex++;

                if (currentIndex < $termsList.length) {
                    this.showCurrentTerm();
                } else {
                    this.closePopup("fullPopup");
                    this.updateAllCheck();
                }
            },

            // ?åù?óÖ ?ã´Í∏?
            closePopup: function (id) {
                if (typeof popupL !== "undefined" && popupL.closePopup) {
                    popupL.closePopup(id);
                } else {
                    console.error("popupL?ù¥ ?†ï?ùò?êòÏß? ?ïä?ùå");
                }
            },

            // ?†ÑÏ≤? ?èô?ùò Ï≤¥ÌÅ¨Î∞ïÏä§ ?ÉÅ?Éú ?óÖ?ç∞?ù¥?ä∏
            updateAllCheck: function () {
                var allChecked = $reqChks.length === $reqChks.filter(":checked").length;
                $chkAll.prop("checked", allChecked);
                $submitBtn.prop("disabled", !allChecked);
            },

            // ?†ÑÏ≤? ?èô?ùò ?Ñ†?Éù
            toggleAll: function (isChecked) {
                $reqChks.prop("checked", isChecked);
                this.updateAllCheck();
            }
        };
    })();

    TermsAgreement.init();
});
