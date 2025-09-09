

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
                        $tab.attr('aria-selected', 'true');
                        $panel.show().attr('aria-hidden', 'false');
                        $tab.find('button').attr('aria-label', $tab.find('button').text() + ', 현재 선택됨');
                    } else {
                        $tab.attr('aria-selected', 'false');
                        $panel.hide().attr('aria-hidden', 'true');
                        $tab.find('button').attr('aria-label', $tab.find('button').text());
                    }
                });

                // event binding
                $tabs.on('click', function (e) {
                    e.preventDefault();
                    Tabs.switchTab($(this), $tabContainer);
                });

                // 키보드 이벤트 바인딩
                $tabs.on('keydown', function (e) {
                    Tabs.handleKeydown(e, $(this), $tabContainer);
                });

                // 포커스 이벤트 바인딩
                $tabs.on('focus', function () {
                    $(this).addClass('focused');
                }).on('blur', function () {
                    $(this).removeClass('focused');
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
                $allTabs.removeClass('active').attr('aria-selected', 'false');
                $allPanels.hide().attr('aria-hidden', 'true');
                $allTabs.find('button').each(function() {
                    var $btn = $(this);
                    $btn.attr('aria-label', $btn.text());
                });

                // 새 탭 활성화
                $clickedTab.addClass('active').attr('aria-selected', 'true');
                $targetPanel.show().attr('aria-hidden', 'false');
                $clickedTab.find('button').attr('aria-label', $clickedTab.find('button').text() + ', 현재 선택됨');
                
                // 모바일 select 동기화
                var $mobileSelect = $tabContainer.find('.tab-select-mobile select');
                if ($mobileSelect.length) {
                    $mobileSelect.val(targetId);
                }

                // 포커스 이동 (접근성 향상)
                $clickedTab.find('button').focus();
                
                // 스크린 리더를 위한 탭 변경 안내
                announceTabChange($clickedTab.find('button').text());
            },

            handleKeydown: function (e, $currentTab, $tabContainer) {
                var $tabs = $tabContainer.find('.tab-item, .nested-tab-item');
                var currentIndex = $tabs.index($currentTab);
                var $nextTab, $prevTab;

                switch (e.keyCode) {
                    case 37: // Left arrow
                        e.preventDefault();
                        $prevTab = $tabs.eq(currentIndex - 1);
                        if ($prevTab.length) {
                            $prevTab.find('button').focus();
                        } else {
                            $tabs.last().find('button').focus(); // 마지막 탭으로
                        }
                        break;
                    case 39: // Right arrow
                        e.preventDefault();
                        $nextTab = $tabs.eq(currentIndex + 1);
                        if ($nextTab.length) {
                            $nextTab.find('button').focus();
                        } else {
                            $tabs.first().find('button').focus(); // 첫 번째 탭으로
                        }
                        break;
                    case 36: // Home
                        e.preventDefault();
                        $tabs.first().find('button').focus();
                        break;
                    case 35: // End
                        e.preventDefault();
                        $tabs.last().find('button').focus();
                        break;
                    case 13: // Enter
                    case 32: // Space
                        e.preventDefault();
                        Tabs.switchTab($currentTab, $tabContainer);
                        break;
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

    /**
     * 스크린 리더를 위한 상태 안내
     */
    function announceTabChange(tabName) {
        // 스크린 리더 사용자에게 탭 변경을 안내
        var announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = tabName + ' 탭이 선택되었습니다.';
        
        document.body.appendChild(announcement);
        
        // 잠시 후 제거
        setTimeout(function() {
            document.body.removeChild(announcement);
        }, 1000);
    }

});
