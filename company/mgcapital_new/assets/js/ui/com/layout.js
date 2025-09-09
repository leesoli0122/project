$(document).ready(function(){

    /*---------------------------------------------
        load, init
    ---------------------------------------------*/
    $(window).on("load", function () {
        if ($('.fullPopupOn .pop-con-wrap').length > 0) { // DOM 존재 여부 먼저 체크한 뒤에 이벤트 바인딩
            headerPopupL.scrolling();
        }

        if ($('.contentWrap').length > 0) {
            sideToolsL.scrolling(); // 초기 상태 확인
        }

        if ($('#gnbFull').length > 0) {
            gnbFullL.init();// 불필요한 DOM 탐색을 줄이고 예외를 방지
        }

        if ($('#gnb').length > 0) {
            gnbL.init();// 불필요한 DOM 탐색을 줄이고 예외를 방지
        }

        if ($('#skipnavi').length > 0) {
            skipNaviL.init();// init 실행 전에 존재 여부 확인
        }

        console.log('[layout.js] 초기화 완료');
    });

    /*---------------------------------------------
        resize
    ---------------------------------------------*/
    $(window).on('resize', function () {
        if ($('.wrap .contentWrap').length > 0) {
            headerL.scrolling();
        }

        if ($('.fullPopupOn .pop-con-wrap').length > 0) {
            headerPopupL.scrolling();
        }

        // if ($('.wrap .contentWrap').length > 0) {
        //     sideToolsL.updatePosition();
        // }
    });
    /*---------------------------------------------
        GNB 메뉴 제어 모듈
    ---------------------------------------------*/
    var gnbFullL = (function () {

        return {
            $gnbItem: null,

            // 마우스 오버 또는 포커스
            mouseOverFocusIn: function () {
                this.$gnbItem.on("mouseenter focusin", function () {
                    var $this = $(this);
    
                    // 이미 열려있으면 다시 열지 않음 (중복 방지)
                    if (!$this.hasClass("on")) {
                        $this.addClass("on").siblings().removeClass("on");
    
                        $this.find(".menu-sub").hide().css("display", "flex").stop(true, true).slideDown(200);
                        $this.siblings().find(".menu-sub").stop(true, true).slideUp(200);
                    }
                });
            },

            // 마우스 리브
            mouseLeave: function () {
                this.$gnbItem.on("mouseleave", function () {
                    var $this = $(this);
                    $this.removeClass("on");
                    $this.find(".menu-sub").stop(true, true).slideUp(200);
                });
            },

            // 외부 포커스 이동 시 메뉴 닫기
            focusOutGnb: function () {
                $("body").on("focusin", function (e) {
                    if (!$(e.target).closest("#gnbFull").length) {
                        gnbFullL.$gnbItem.removeClass("on");
                        gnbFullL.$gnbItem.find(".menu-sub").stop(true, true).slideUp(200);
                    }
                });
            },

            // 초기화
            init: function () {
                this.$gnbItem = $("#gnbFull .menu-list .menu-item"); // DOM
                this.mouseOverFocusIn();
                this.mouseLeave();
                this.focusOutGnb();
            }
        };
    })();


    var gnbL = (function () {
        return {
            init: function () {
                this.bindDepthToggle(); // 공통 뎁스 이벤트
                this.bindMenuClick();   // 1뎁스 이벤트
                this.bindResize();      // 리사이즈 이벤트
            },
    
            bindMenuClick: function () {
                $(document).on("click", "#gnb .menu-list .menu-item > a", function (e) {
                    e.preventDefault();
                    var $parent = $(this).parent();
    
                    if ($parent.hasClass("on")) {
                        $parent.removeClass("on");
                        $parent.find(".on").removeClass("on");
                    } else {
                        $parent.addClass("on")
                            .siblings(".menu-item")
                            .removeClass("on")
                            .find(".on").removeClass("on");
                    }
                });
            },
    
            bindDepthToggle: function () {
                $(document).on("click", "#gnb .depth-con ul > li > a", function (e) {
                    var $this = $(this);
                    var $parentLi = $this.parent();
                    var $nextDepth = $parentLi.children("div, ul").not("a");
    
                    if (!$nextDepth.length) return;
                    e.preventDefault();
    
                    $parentLi.toggleClass("on");
                    $parentLi.siblings("li").removeClass("on").find("li").removeClass("on");
                    $parentLi.siblings("li").find("div, ul").removeClass("on");
                });
            },
    
            bindResize: function () {
                var _this = this;
    
                $(window).on("resize", function () {
                    // GNB 상태 초기화 또는 재바인딩 필요 시 사용
                    _this.resetGnb(); // 선택적
                });
            },
    
            resetGnb: function () {
                // 모든 on 클래스 제거 및 메뉴 초기화
                $("#gnb .menu-item, #gnb li").removeClass("on");
                $("#gnb .menu-sub, #gnb .depth02, #gnb .depth03").removeAttr("style");
            }
        };
    })();
    

    /*---------------------------------------------
        Skip Navi 포커스 이동 모듈
    ---------------------------------------------*/
    var skipNaviL = (function () {
        return {
            moveFocus: function () {
                $("#skipnavi a").on("keydown", function (e) {
                    if (e.keyCode === 13) {
                        if (this.id === "gotoContentArea") {
                            location.href = "#gotoContentArea";

                            $("#gotoContentArea").attr("tabindex", "-1");

                            const homeLink = $(".home > a");
                            if (homeLink.length > 0) {
                                homeLink.focus();
                            } else if ($(".shortcut-area > .btn-wrap > a").length > 0) {
                                $(".shortcut-area > .btn-wrap > a").first().focus(); // 바로가기 버튼이 있을 때
                            } else {
                                $("#gotoContentArea").focus(); // fallback 포커스
                            }
                                
                        } else if (this.id === "gnbFull") {
                            location.href = "#gnbFull";
                            $(".menu-list .menu-item > a").first().focus();
                        }
                    }
                });
            },

            init: function () {
                this.moveFocus();
            }
        };
    })();

    
    /**
     * header on클래스 추가
    **/
    var headerL = (function() {

        var scrollY = 0;

        return {
            headerAni: function() {
                if (scrollY > 0) {
                    $('.headerOn:visible, .btmWrap:visible').addClass('on');
                    
                } else {
                    $('.headerOn:visible, .btmWrap:visible').removeClass('on');
                }
            },
            // 스크롤 처리
            scrolling: function () {
                scrollY = $('.wrap .contentWrap').length > 0 ? $('.wrap .contentWrap').scrollTop() : 0; //.length 조건으로 존재할 때만 .scrollTop() 호출해서 스크립트가 멈추는 상황 방지
                this.headerAni();
            }
        };
    })();

    //event
    if ($('.wrap .contentWrap').length > 0) {
        $('.wrap .contentWrap').on('scroll', function () {
            headerL.scrolling();
        });
    }

    /**
     * 팝업 header on 클래스 추가
     **/
    var headerPopupL = (function() {

        var scrollY = 0;

        return {
            headerAni: function() {
                var headerOn = $('.fullPopupOn:visible .pop-header, .fullPopupOn:visible .pop-btm-wrap');
                if (scrollY > 0) {
                    headerOn.addClass('on');
                } else {
                    headerOn.removeClass('on');
                }
            },
            scrolling: function () {
                scrollY = $('.fullPopupOn .pop-con-wrap').length > 0 ? $('.fullPopupOn .pop-con-wrap').scrollTop() : 0;
                this.headerAni();
            }
        };
    })();

    // event
    if ($('.fullPopupOn .pop-con-wrap').length > 0) {
        $('.fullPopupOn .pop-con-wrap').on('scroll', function () {
            headerPopupL.scrolling();
        });
    }

    /**
     * 스크롤 업 버튼 on 클래스 제어
     **/
    var sideToolsL = (function() {

        var isOn = false;

        return {

            scrolling: function () {
                if ($('.contentWrap').length === 0) return;

                var scrollTop = $('.contentWrap').scrollTop();
                console.log('#sideTools');
                
                if (scrollTop >= 200 && !isOn) {
                    $('#sideTools').addClass('on');
                    isOn = true;
                    console.log('scrolling: ' + 'down');

                } else if (scrollTop < 200 && isOn) {
                    $('#sideTools').removeClass('on');
                    isOn = false;
                    console.log('scrolling: ' + 'up');
                }

                // this.updatePosition();
            },

            // 스크롤 맨 위로 이동
            moveTop: function () {
                $('.contentWrap').animate({ scrollTop: 0 }, 300);
                console.log('moveTop: ' + 'scrollUp');
            },

            // updatePosition: function () {

            //     var $sideTools = $('#sideTools');
            //     var $btmCont = $('.btmCont');
            //     var contentScrollTop = $('.contentWrap').scrollTop();
            
            //     if ($btmCont.length === 0 || $btmCont.outerHeight() === 0) {
            //         $sideTools.css({
            //             position: 'absolute',
            //             bottom: '30px'
            //         });
            //         return;
            //     }
            
            //     var btmHeight = $btmCont.outerHeight();
            
            //     if (contentScrollTop >= btmHeight) {
            //         $sideTools.css({
            //             position: 'fixed',
            //             bottom: (btmHeight + 30) + 'px'
            //         });
            //     } else {
            //         $sideTools.css({
            //             position: 'absolute',
            //             bottom: '30px'
            //         });
            //     }
            // },

            plusMenu: function(){
                var $plusMenu = $('#sideTools .sideMenu ul');
                var $overlay = $('.overlay')

                $plusMenu.hide();
                $overlay.removeClass('on');

                $(document).on('click', '#sideTools .sideMenu > button', function(e) {
                    e.preventDefault();
                    var $thisUl = $(this).siblings('ul');
                    if ($thisUl.is(':visible')) {
                        $thisUl.stop(true, true).slideUp(200);
                        $overlay.removeClass('on');
                        $('.sideMenu').removeClass('on');
                        $('#sideTools').css({'z-index' : '9'});
                        $('.sideMenu > button').text('퀵메뉴 열기');
                        
                    } else {
                        $thisUl.stop(true, true).slideDown(200);
                        $overlay.addClass('on');
                        $('.sideMenu').addClass('on');
                        $('#sideTools').css({'z-index' : '12'});
                        $('.sideMenu > button').text('퀵메뉴 닫기');
                    }
                });
            }
        };
    })();

    if ($('#sideTools').length > 0) {
        // 스크롤 이벤트 바인딩
        if ($('.contentWrap').length > 0) {
            $('.contentWrap').on('scroll', function () {
                sideToolsL.scrolling();
            });
        }

        // TOP 버튼 클릭 이벤트
        $(document).on('click', '#sideTools .scrollUpBtn', function () {
            sideToolsL.moveTop();
        });

        // 위치 및 메뉴 초기 세팅
        // sideToolsL.updatePosition();
        sideToolsL.plusMenu();

    }

    // $(window).on('resize', function () {
    //     sideToolsL.updatePosition();
    // });

});