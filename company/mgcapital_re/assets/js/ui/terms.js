$(document).ready(function () {
    /**
     * �빟愿� �룞�쓽
     */
    var TermsAgreement = (function () {
        var $chkAll, $reqChks, $optChks, $consChk, $consChks, $allChks, $submitBtn;

        return {
            // 珥덇린�솕
            init: function () {
                $chkAll = $("#chkAll"); // �쟾泥� �룞�쓽 (遺�紐�)
                $reqChks = $(".chkReq"); // �븘�닔 �빆紐�
                $optChks = $(".chkOpt"); // �꽑�깮 �빆紐�
                $consChk = $("#chkCons"); // �닔�떊 �룞�쓽 (遺�紐�)
                $consChks = $(".chkConsChild"); // �닔�떊 �룞�쓽 �빆紐� (SMS, �씠硫붿씪, 愿묎퀬�꽦)
                $allChks = $(".chkReq, .chkOpt, #chkCons, .chkConsChild"); // �쟾泥� �빆紐�
                // $submitBtn = $('#submitBtn'); // 媛��엯 踰꾪듉

                this.bindEvents();
            },

            // �씠踰ㅽ듃
            bindEvents: function () {
                var self = this;

                // �쟾泥� �룞�쓽 (遺�紐�)
                $chkAll.on("change", function () {
                    self.toggleAll($(this).prop("checked"));
                });

                // �쟾泥� �빆紐�
                $allChks.on("change", function () {
                    // self.uptSubmitBtn();
                    self.uptAllChk();
                });

                // �닔�떊 �룞�쓽 (遺�紐�)
                $consChk.on("change", function () {
                    var isChecked = $(this).prop("checked");
                    $consChks.prop("checked", isChecked);
                    self.uptAllChk();
                });

                // �닔�떊 �룞�쓽 �빆紐�
                $consChks.on("change", function () {
                    self.uptConsAllChk();
                    self.uptAllChk();
                });
            },

            toggleAll: function (isChecked) {
                $allChks.prop("checked", isChecked);
                // this.uptSubmitBtn();
                this.uptAllChk();
            },

            // �쟾泥� �룞�쓽 泥댄겕 �긽�깭 �뾽�뜲�씠�듃 (泥댄겕 �뿬遺�)
            uptAllChk: function () {
                var allReqChked = $reqChks.length === $reqChks.filter(":checked").length; // �븘�닔 �빆紐�
                var allSelChked = $optChks.length === $optChks.filter(":checked").length; // �꽑�깮 �빆紐�
                var allConsChked = $consChks.length === $consChks.filter(":checked").length; // �닔�떊 �룞�쓽
                var allChecked = $allChks.length === $allChks.filter(":checked").length; // 紐⑤뱺 �빆紐�

                //  �븘�닔 + �꽑�깮 + �닔�떊 �룞�쓽 ( 紐⑤몢 泥댄겕 �떆 �쟾泥� �룞�쓽 泥댄겕 �솢�꽦�솕 )
                if (allReqChked && allSelChked && allConsChked) {
                    $chkAll.prop("checked", true);
                } else {
                    $chkAll.prop("checked", false);
                }
            },

            // �닔�떊 �룞�쓽 �빆紐� (�븯�쐞 �빆紐� 以� �븯�굹�씪�룄 �꽑�깮 �떆)
            uptConsAllChk: function () {
                var anyConsChked = $consChks.filter(":checked").length > 0;
                $consChk.prop("checked", anyConsChked);
            },

            //踰꾪듉 �솢�꽦�솕 (�븘�닔 �빆紐�)
            // uptSubmitBtn: function () {
            //     var allReqChked = $reqChks.length === $reqChks.filter(':checked').length;
            //     $submitBtn.prop('disabled', !allReqChked);
            // }
        };
    })();

    TermsAgreement.init();

    // �씪踰� �겢由� �떆 泥댄겕諛뺤뒪 �긽�깭 �쑀吏� + �뙘�뾽留� �뿴湲�
    $(document).on("click", "label.check-button[data-popup-open]", function (e) {
        e.preventDefault(); // 泥댄겕諛뺤뒪 泥댄겕/�뼵泥댄겕 諛⑹��

        var popupId = $(this).data("popup-open");
        if (popupId && window.popupL) {
            window.popupL.openPopup(popupId);
            console.log("Label clicked - popup opened:", popupId);
        }
    });
});

$(function () {
    var BREAKPOINT = 768; // 紐⑤컮�씪: <=768, PC: >768
    var mq = window.matchMedia("(max-width: " + BREAKPOINT + "px)");

    // 媛쒕퀎 �슂�냼�뿉 ����빐 諛깆뾽/蹂듭썝/�젣嫄�
    function backupIfNeeded($els) {
        $els.each(function () {
            var $el = $(this);
            if (!$el.attr("data-open-bak") && $el.is("[data-popup-open]")) {
                $el.attr("data-open-bak", $el.attr("data-popup-open")); // 媛� 諛깆뾽
            }
        });
    }
    function toMobile($scope) {
        var $els = ($scope || $(document)).find("label[data-open-bak]");
        // 諛깆뾽�씠 �엳�뒗 �븷�뱾��� 紐⑤몢 蹂듭썝
        $els.each(function () {
            var $el = $(this);
            $el.attr("data-popup-open", $el.attr("data-open-bak"));
        });
    }
    function toPC($scope) {
        var $els = ($scope || $(document)).find("label[data-popup-open], label[data-open-bak]");
        // �슦�꽑 �깉濡� �뱾�뼱�삩 �슂�냼�룄 諛깆뾽 蹂댁옣
        backupIfNeeded($els);
        // 洹몃━怨� data-popup-open �젣嫄�
        $els.filter("[data-popup-open]").removeAttr("data-popup-open");
    }

    // 珥덇린 諛깆뾽
    backupIfNeeded($("label[data-popup-open]"));

    // 紐⑤뱶 �쟻�슜
    function applyMode(isMobile, $scope) {
        if (isMobile) toMobile($scope);
        else toPC($scope);
    }

    // 理쒖큹 1�쉶
    applyMode(mq.matches);

    // 釉뚮젅�씠�겕�룷�씤�듃 蹂�寃� 媛먯��
    if (mq.addEventListener) {
        mq.addEventListener("change", function (e) {
            applyMode(e.matches);
        });
    } else if (mq.addListener) {
        // 援ы삎 釉뚮씪�슦���
        mq.addListener(function (e) {
            applyMode(e.matches);
        });
    } else {
        // �븘二� 援ы삎 �뤃諛�: resize濡� �긽�깭 �쟾�솚 媛먯��
        var lastMobile = mq.matches;
        $(window).on("resize", function () {
            var nowMobile = $(window).width() <= BREAKPOINT;
            if (nowMobile !== lastMobile) {
                lastMobile = nowMobile;
                applyMode(nowMobile);
            }
        });
    }

    // �룞�쟻 異붽�� ����쓳
    if (window.MutationObserver) {
        var mo = new MutationObserver(function (muts) {
            muts.forEach(function (m) {
                var $added = $(m.addedNodes);
                if (!$added.length) return;
                var $scope = $(); // batch
                $added.each(function () {
                    $scope = $scope.add(this.nodeType === 1 ? this : []);
                });
                if ($scope.length) {
                    // �깉濡� �뱾�뼱�삩 label�뿉 ����빐 �쁽�옱 紐⑤뱶 湲곗�� 諛붾줈 �쟻�슜
                    applyMode(mq.matches, $scope);
                }
            });
        });
        mo.observe(document.body, { childList: true, subtree: true });
    } else {
        // �뤃諛�: 二쇨린�쟻�쑝濡� �젙由�
        setInterval(function () {
            applyMode(mq.matches);
        }, 500);
    }
});
