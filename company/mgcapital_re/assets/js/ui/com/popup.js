$(document).ready(function () {
    /**
     *  ** fkSelAndPopupResetOverflow 함수 전역 정의
     *  - 팝업과 셀렉트가 모두 닫혔을 때만 `overflow: ''` 적용
     **/

    /**
     *  팝업
     *  data-popup-open :: full 팝업, btmSheet 팝업
     *  data-modal-open :: modal
     *  data-menu-open :: 전체 메뉴
     **/
    (function () {
        /**
         *  팝업 관리 모듈
         **/
        // var popupContainer = $('.layerPopup');
        // popupContainer.css('visibility', 'hidden');

        var popupL = {
            /**
             * 팝업 초기화
             */
            initPopup: function (id) {
                var $target = $("#" + id);
                if (!$target.length) return;

                $target.addClass("on");
                $target.find(".pop-con-wrap").scrollTop(0);
                $(".contentWrap").css("overflow", "hidden");

                console.log("initPopup: " + "공통 실행");

                //full 팝업 header fixed 처리
                // setTimeout(function () {
                //     if ($target.hasClass('full')) {
                //         var $header = $target.find('.pop-header');
                //         if ($header.length) {
                //             $header.css('position', 'fixed');

                //             console.log('initPopup: ' + 'fixed 적용');
                //         }
                //     }
                // }, 100);

                // 접근성: 포커스 처리
                var $focusEl = $target.find(".pop-area");
                if ($focusEl.length) {
                    $focusEl.attr("tabindex", "0").focus();

                    console.log("focusEl: " + "포커스 실행");
                } else {
                    $target.removeAttr("tabindex");
                }
            },

            /**
             * 팝업 열기
             */
            openPopup: function (id) {
                this.initPopup(id);
            },

            /**
             * 모달 열기
             */
            openModal: function (id) {
                this.initPopup(id);

                console.log("openModal: " + "모달 실행");
            },

            /**
             * 메뉴 팝업 열기
             */
            openMenu: function (id) {
                this.initPopup(id);

                console.log("openMenu: " + "메뉴 팝업 실행");
            },

            /**
             * 팝업 닫기
             */
            closePopup: function (id) {
                var _target = document.getElementById(id);
                if (_target) _target.classList.remove("on");
                this.fkSelAndPopupResetOverflow();

                // 초기화
                if (_target.classList.contains("full")) {
                    var header = _target.querySelector(".pop-header");
                    if (header) {
                        header.style.position = "";

                        console.log("closePopup: " + "공통 초기화");
                    }
                }
                this.fkSelAndPopupResetOverflow();
            },

            /**
             * 팝업 및 셀렉트 닫힐 때 `overflow` 초기화
             */
            fkSelAndPopupResetOverflow: function () {
                var isPopupOpen = $(".layerPopup.on").length > 0;
                var isSelectOpen = $(".stove-option-layer.on").length > 0;

                if (!$(".layerPopup.on").length && !$(".stove-option-layer.on").length) {
                    $(".contentWrap").css("overflow", "");
                    $(".pop-area").removeAttr("tabindex");

                    console.log("fkSelAndPopupResetOverflow: " + "마지막 팝업 닫힘");

                    setTimeout(function () {
                        $(".layerPopup.toggleUp").removeClass("active");

                        console.log("toggleUp: " + "초기화");
                    }, 10);
                }
            },
        };

        /**
         * 바텀시트 관리 모듈
         **/
        var btmShtTL = {
            /**
             * 바텀시트토글
             */
            btmAti: function (id) {
                var $target = $("#" + id);
                if (!$target.length) return;

                var $contentWrap = $target.find(".pop-con-wrap");
                $target.toggleClass("active");

                console.log("btmAti: " + "바텀시트토글 실행");

                if ($target.hasClass("active")) {
                    $contentWrap.scrollTop(0).attr("tabindex", "-1").focus();

                    console.log("btmAti: " + "포커스 실행");
                } else {
                    $contentWrap.removeAttr("tabindex");
                }
            },
        };

        /**
         * 이벤트 위임을 이용한 팝업 제어
         */
        $(document).on("click", function (e) {
            var $target = $(e.target);

            // 팝업 열기
            var $openBtn = $target.closest("[data-popup-open]");
            if ($openBtn.length) return popupL.openPopup($openBtn.data("popup-open"));
            // 라벨 클릭 시 팝업 열기
            $(document).on("change", function () {
                var popupId = $('label[for="' + this.id + '"]').data("popup-open");
                if (popupId && window.popupL) {
                    window.popupL.openPopup(popupId);
                }
            });

            // 모달 열기
            var $modalBtn = $target.closest("[data-modal-open]");
            if ($modalBtn.length) return popupL.openModal($modalBtn.data("modal-open"));

            // 메뉴 열기
            var $menuBtn = $target.closest("[data-menu-open]");
            if ($menuBtn.length) return popupL.openMenu($menuBtn.data("menu-open"));

            // 팝업 닫기
            var $closeBtn = $target.closest("[data-popup-close]");
            if ($closeBtn.length) return popupL.closePopup($closeBtn.data("popup-close"));

            // 바텀시트 토글
            var $btmToggleBtn = $target.closest("[data-btm-toggle]");
            if ($btmToggleBtn.length) return btmShtTL.btmAti($btmToggleBtn.data("btm-toggle"));

            // 바텀시트 dim 클릭 시 닫기
            var $dimLayer = $target.closest(".layerPopup.btmSheet");
            if ($dimLayer.length && $target.is($dimLayer)) {
                $dimLayer.removeClass("active").find(".pop-con-wrap").removeAttr("tabindex");
                popupL.closePopup($dimLayer.attr("id"));
                return;
            }
        });

        // 전역 오염 방지 - 필요할 때만 가져다 사용할 수 있도록 노출
        window.popupL = popupL;
        window.btmShtTL = btmShtTL;
        // 전역에서 접근 가능하도록 별도 함수로 노출
        window.fkSelAndPopupResetOverflow = popupL.fkSelAndPopupResetOverflow;
    })();
});
