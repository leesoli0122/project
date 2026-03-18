

$(document).ready(function(){

    /**
     *   TAB
    **/
    var Tabs = (function () {
        return {
            init: function (container) {
                var $tabContainer = $(container);
                var $tabs = $tabContainer.find('.tab-item, .nested-tab-item');
                // var $panels = $tabContainer.find('.tab-panel, .nested-tab-panel');

                // 초기 활성 탭
                $tabs.each(function () {
                    var $tab = $(this);
                    var targetId = $tab.attr('data-tab');
                    var $panel = $('#' + targetId);

                    if ($tab.hasClass('active')) {
                        $tab.attr('title', '선택됨');
                        $panel.show();
                    } else {
                        $tab.removeAttr('title');
                        $panel.hide();
                    }
                });

                // event binding
                $tabs.on('click', function () {
                    Tabs.switchTab($(this), $tabContainer);
                });
            },

            switchTab: function ($clickedTab, $tabContainer) {
                var targetId = $clickedTab.attr('data-tab');
                var $targetPanel = $('#' + targetId);
                var isNested = $clickedTab.hasClass('nested-tab-item');

                // 같은 그룹의 탭 찾기
                var $allTabs = isNested ? $tabContainer.find('.nested-tab-item') : $tabContainer.find('.tab-item');
                var $allPanels = isNested ? $tabContainer.find('.nested-tab-panel') : $tabContainer.find('.tab-panel');

                // 기존 탭 초기화
                $allTabs.removeClass('active').removeAttr('title');
                $allPanels.hide();

                // 새 탭 활성화
                $clickedTab.addClass('active').attr('title', '선택됨');
                $targetPanel.show();
                
                // 모바일 select 동기화
                var $mobileSelect = $tabContainer.find('.tab-select-mobile select');
                if ($mobileSelect.length) {
                    $mobileSelect.val(targetId);
                }
            }
        };
    })();

    // 모든 탭 초기화
    $('.jsTab, .nestedJsTab').each(function () {
        Tabs.init(this);
    });

    /**
     *   TAB Swiper - IE11 호환성 처리
    **/
    var tabSwiperL = (function () {
        var pager = ['영역', '영역2', '영역3', '영역4'];
        var tabSwiper = null;

        // Swiper가 존재하고 IE11이 아닌 경우에만 초기화
        if (typeof Swiper !== 'undefined' && !isIE11()) {
            try {
                tabSwiper = new Swiper('.tabs.tab-area.swiper', {
                    spaceBetween: 20,
                    autoHeight: true,
                    pagination: {
                        el: '.tabs ul',
                        clickable: true,
                        renderBullet: function (index, className) {
                            return '<li class="tab-item ' + className + '">' + pager[index] + '</li>';
                        }
                    }
                });
            } catch (e) {
                console.log('Swiper 초기화 실패:', e.message);
                // Swiper 초기화 실패 시 기본 탭 동작으로 폴백
                initFallbackTabs();
            }
        } else {
            // IE11이거나 Swiper가 없는 경우 기본 탭 동작으로 폴백
            initFallbackTabs();
        }

        return tabSwiper;
    })();

    /**
     * IE11 감지 함수
     */
    function isIE11() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var msie11 = ua.indexOf('Trident/');
        return (msie > 0 || msie11 > 0);
    }

    /**
     * Swiper 대신 기본 탭 동작으로 폴백
     */
    function initFallbackTabs() {
        var $swiperContainer = $('.tabs.tab-area.swiper');
        if ($swiperContainer.length > 0) {
            var $tabList = $swiperContainer.find('.swiper-pager.tab-list');
            var $slides = $swiperContainer.find('.swiper-slide');
            
            // 기본 탭 스타일 적용
            $tabList.find('li').each(function(index) {
                var $tab = $(this);
                var $slide = $slides.eq(index);
                
                // 첫 번째 탭만 활성화
                if (index === 0) {
                    $tab.addClass('swiper-pagination-bullet-active');
                    $slide.show();
                } else {
                    $slide.hide();
                }
                
                // 탭 클릭 이벤트
                $tab.on('click', function() {
                    $tabList.find('li').removeClass('swiper-pagination-bullet-active');
                    $tab.addClass('swiper-pagination-bullet-active');
                    $slides.hide();
                    $slide.show();
                });
            });
        }
    }

     /**
     * 모바일 select와 PC 탭 동기화
     */

    var $mobileSelect = $('.tab-select-mobile select');
    if ($mobileSelect.length) {
        $mobileSelect.on('change', function() {
            var selectedValue = $(this).val();
            var $tabContainer = $(this).closest('.jsTab');
            var $targetTab = $tabContainer.find('.tab-item[data-tab="' + selectedValue + '"]');
            if ($targetTab.length) {
                Tabs.switchTab($targetTab, $tabContainer);
            }
        });
    }

});
