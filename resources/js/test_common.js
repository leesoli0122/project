// @ts-nocheck
(function ($) {

    // min 포함 max 불포함 랜덤 정수
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // 랜덤 문자열
    var hashCodes = [];

    function uiGetHashCode(length) {
        var string =
            '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        var stringLength = string.length;

        length = typeof length === 'number' && length > 0 ? length : 10;

        function getCode(length) {
            var code = '';
            for (var i = 0; i < length; i++) {
                code += string[getRandomInt(0, stringLength)];
            }
            if (hashCodes.indexOf(code) > -1) {
                code = getCode(length);
            }
            return code;
        }

        result = getCode(length);
        hashCodes.push(result);

        return result;
    }

    // $.fn.swiperSet - Swiper.js
    // https://github.com/nolimits4web/Swiper/blob/Swiper2/API.md
    $.fn.swiperSet = function (customOption) {
        var defaultOption = {
            customClass: null,
            appendController: null,
            pageControl: false,
            nextControl: false,
            nextControlText: '다음',
            prevControl: false,
            prevControlText: '이전',
            scrollbarControl: false,
            playControl: false,
            playControlText: '재생',
            pauseControl: false,
            pauseControlText: '일시정지',
            buildPagination: null,
            scrollbar: {},
            fractionControl: false,
            togglePlayControl: false,
        };

        this.each(function () {
            var option = $.extend({}, defaultOption, customOption);
            var $this = $(this);

            if ($this.data('swiper') || !$.isFunction(window.Swiper)) return;

            var $items = $this.children();

            if (!$this.parent('.swiper-container').length) {
                $this.wrap(
                    '<div class="swiper-object"><div class="swiper-container"></div></div>'
                );
            }
            $this.addClass('swiper-wrapper');
            $items.addClass('swiper-slide').each(function (i) {
                $(this).attr('data-swiper-set-slide-index', i);
            });

            var $container = $this.parent('.swiper-container');
            var $wrap = $container.parent('.swiper-object');
            var $appendController = $wrap;
            var length = $items.length;

            if (typeof option.customClass === 'string') {
                $wrap.addClass(option.customClass);
            }

            option.autoplay = length > 1 && option.autoplay ? option.autoplay : false;
            option.loop = length > 1 && option.loop ? option.loop : false;

            if (option.appendController) {
                $appendController = $(option.appendController);
            }

            if (length === 1) {
                $wrap.addClass('swiper-object-once');
            } else if (length <= 0) {
                $wrap.addClass('swiper-object-empty');
            }

            var $pagination = null;
            var paginationHTML = '';
            var $pageItems = null;
            var paginationActiveSet = null;
            var $fractionCurrent = null;
            var togglePlayButtonActive = function () { };

            if (option.pageControl) {
                if (option.pagination) {
                    if (typeof option.pagination === 'string') {
                        $pagination = $appendController.find(option.pagination);
                    } else {
                        $pagination = $(option.pagination);
                    }
                    option.pagination = false;
                } else {
                    $appendController.append('<div class="swiper-pagination"></div>');
                    $pagination = $appendController.find('.swiper-pagination');
                }
                if (typeof option.buildPagination === 'function') {
                    for (var i = 0; i < length; i++) {
                        paginationHTML += option.buildPagination(i) || '';
                    }
                    $pagination.append(paginationHTML);
                    $pageItems = $pagination.children();
                    paginationActiveSet = function (i) {
                        $pageItems.removeClass('swiper-active-switch');
                        $pageItems.eq(i).addClass('swiper-active-switch');
                    };
                    if (option.initialSlide) {
                        paginationActiveSet(option.initialSlide);
                    } else {
                        paginationActiveSet(0);
                    }
                    $pageItems.on('click.swiper', function () {
                        var swiper = $this.data('swiper');
                        var $item = $(this);
                        var index = $pageItems.index($item);
                        if (swiper) {
                            swiper.swipeTo(index);
                        }
                    });
                } else {
                    option.pagination = $pagination.get(0);
                }
            }
            if (option.fractionControl) {
                if (option.fraction) {
                    if (typeof option.fraction === 'string') {
                        option.fraction = $appendController.find(option.fraction).get(0);
                    } else {
                        option.fraction = $(option.fraction).get(0);
                    }
                } else {
                    $appendController.append('<div class="swiper-fraction"></div>');
                    option.fraction = $appendController.find('.swiper-fraction').get(0);
                }
                $(option.fraction).append(
                    '<span class="swiper-fraction-current"></span>/<span class="swiper-fraction-total">' + length + '</span>'
                );
                $fractionCurrent = $(option.fraction).find('.swiper-fraction-current');
            }
            if (option.prevControl) {
                if (option.prevBtn) {
                    if (typeof option.prevBtn === 'string') {
                        option.prevBtn = $appendController.find(option.prevBtn).get(0);
                    } else {
                        option.prevBtn = $(option.prevBtn).get(0);
                    }
                } else {
                    $appendController.prepend(
                        '<button type="button" class="swiper-button-prev"><span class="swiper-button-prev-text">' +
                        option.prevControlText +
                        '</span></button>'
                    );
                    option.prevBtn = $appendController.find('.swiper-button-prev').get(0);
                }
            }
            if (option.nextControl) {
                if (option.nextBtn) {
                    if (typeof option.nextBtn === 'string') {
                        option.nextBtn = $appendController.find(option.nextBtn).get(0);
                    } else {
                        option.nextBtn = $(option.nextBtn).get(0);
                    }
                } else {
                    $appendController.prepend(
                        '<button type="button" class="swiper-button-next"><span class="swiper-button-next-text">' +
                        option.nextControlText +
                        '</span></button>'
                    );
                    option.nextBtn = $appendController.find('.swiper-button-next').get(0);
                }
            }
            if (option.togglePlayControl) {
                if (option.togglePlayButton) {
                    if (typeof option.togglePlayButton === 'string') {
                        option.togglePlayButton = $appendController
                            .find(option.togglePlayButton)
                            .get(0);
                    } else {
                        option.togglePlayButton = $(option.togglePlayButton).get(0);
                    }
                } else {
                    $appendController.append(
                        '<button type="button" class="swiper-button-toggle-play"><span class="swiper-button-toggle-play-text"></span></button>'
                    );
                    option.togglePlayButton = $appendController
                        .find('.swiper-button-toggle-play')
                        .get(0);
                }
                togglePlayButtonActive = function (active) {
                    var $button = $(option.togglePlayButton);
                    var $buttonText = $button.find('.swiper-button-toggle-play-text');
                    if (active) {
                        $button.addClass('swiper-button-toggle-play-active');
                        $buttonText.text(option.pauseControlText);
                    } else {
                        $button.removeClass('swiper-button-toggle-play-active');
                        $buttonText.text(option.playControlText);
                    }
                }
            }
            if (option.playControl) {
                if (option.playButton) {
                    if (typeof option.playButton === 'string') {
                        option.playButton = $appendController
                            .find(option.playButton)
                            .get(0);
                    } else {
                        option.playButton = $(option.playButton).get(0);
                    }
                } else {
                    $appendController.prepend(
                        '<button type="button" class="swiper-button-play"><span class="swiper-button-play-text">' +
                        option.playControlText +
                        '</span></button>'
                    );
                    option.playButton = $appendController
                        .find('.swiper-button-play')
                        .get(0);
                }
            }
            if (option.pauseControl) {
                if (option.pauseButton) {
                    if (typeof option.pauseButton === 'string') {
                        option.pauseButton = $appendController
                            .find(option.pauseButton)
                            .get(0);
                    } else {
                        option.pauseButton = $(option.pauseButton).get(0);
                    }
                } else {
                    $appendController.prepend(
                        '<button type="button" class="swiper-button-pause"><span class="swiper-button-pause-text">' +
                        option.pauseControlText +
                        '</span></button>'
                    );
                    option.pauseButton = $appendController
                        .find('.swiper-button-pause')
                        .get(0);
                }
            }
            if (option.autoplay && option.playControl) {
                $(option.playButton).addClass('is-active');
                $(option.playButton).attr("aria-pressed", "true");
                $(option.pauseButton).removeAttr("aria-pressed");
            } else if (!option.autoplay && option.pauseControl) {
                $(option.pauseButton).addClass('is-active');
                $(option.pauseButton).attr("aria-pressed", "true");
                $(option.playButton).removeAttr("aria-pressed");
            }
            if (option.scrollbarControl) {
                if (!option.scrollbar.container) {
                    $appendController.append('<div class="swiper-scrollbar"></div>');
                }
                option.scrollbar = $.extend({}, {
                    container: $appendController.find('.swiper-scrollbar').get(0)
                },
                    option.scrollbar
                );
            }

            var onAutoplayStart = option.onAutoplayStart;
            option.onAutoplayStart = function (swiper) {
                if (option.playControl) {
                    $(option.playButton).addClass('is-active');
                    $(option.playButton).attr("aria-pressed", "true");
                }
                if (option.pauseControl) {
                    $(option.pauseButton).removeClass('is-active');
                    $(option.pauseButton).removeAttr("aria-pressed");

                }

                togglePlayButtonActive(true);
                if (typeof onAutoplayStart === 'function') {
                    onAutoplayStart(swiper);
                }
            };
            var onAutoplayStop = option.onAutoplayStop;
            option.onAutoplayStop = function (swiper) {
                if (option.playControl) {
                    $(option.playButton).removeClass('is-active');
                    $(option.playButton).removeAttr("aria-pressed");
                }
                if (option.pauseControl) {
                    $(option.pauseButton).addClass('is-active');
                    $(option.pauseButton).attr("aria-pressed", "true");
                }

                togglePlayButtonActive(false);
                if (typeof onAutoplayStop === 'function') {
                    onAutoplayStop(swiper);
                }
            };

            function setDisabled(swiper) {
                if (option.prevControl && !option.loop) {
                    if (swiper.activeIndex === 0) {
                        $(option.prevBtn).addClass('swiper-button-disabled');
                    } else {
                        $(option.prevBtn).removeClass('swiper-button-disabled');
                    }
                }
                if (option.nextControl && !option.loop) {
                    if (swiper.activeIndex === swiper.slides.length - 1) {
                        $(option.nextBtn).addClass('swiper-button-disabled');
                    } else {
                        $(option.nextBtn).removeClass('swiper-button-disabled');
                    }
                }
            }
            var onInit = option.onInit;
            option.onInit = function (swiper) {
                setDisabled(swiper);
                if ($fractionCurrent && $fractionCurrent.length) {
                    $fractionCurrent.text(swiper.activeLoopIndex + 1);
                }

                if (typeof onInit === 'function') {
                    onInit(swiper);
                }
            };
            var onFirstInit = option.onFirstInit;
            option.onFirstInit = function (swiper) {
                setDisabled(swiper);
                if ($fractionCurrent && $fractionCurrent.length) {
                    $fractionCurrent.text(swiper.activeLoopIndex + 1);
                }

                if (typeof onFirstInit === 'function') {
                    onFirstInit(swiper);
                }
            }
            var onSlideChangeStart = option.onSlideChangeStart;
            option.onSlideChangeStart = function (swiper) {
                setDisabled(swiper);
                if ($fractionCurrent && $fractionCurrent.length) {
                    $fractionCurrent.text(swiper.activeLoopIndex + 1);
                }

                if (typeof paginationActiveSet === 'function') {
                    paginationActiveSet(swiper.activeLoopIndex);
                }
                if (typeof onSlideChangeStart === 'function') {
                    onSlideChangeStart(swiper);
                }
            };

            if ($.isFunction(window.Swiper)) {

                var swiper = new Swiper($container.get(0), option);
                $this.data('swiper', swiper);

                if (option.nextControl) {
                    $(option.nextBtn)
                        .off('click.swiper')
                        .on('click.swiper', function () {
                            swiper.swipeNext();
                        });
                }
                if (option.prevControl) {
                    $(option.prevBtn)
                        .off('click.swiper')
                        .on('click.swiper', function () {
                            swiper.swipePrev();
                        });
                }
                if (option.playControl) {
                    $(option.playButton)
                        .off('click.swiper')
                        .on('click.swiper', function () {
                            swiper.startAutoplay();
                        });
                }
                if (option.pauseControl) {
                    $(option.pauseButton)
                        .off('click.swiper')
                        .on('click.swiper', function () {
                            swiper.stopAutoplay();
                        });
                }
                if (option.togglePlayControl) {
                    $(option.togglePlayButton)
                        .off('click.swiper')
                        .on('click.swiper', function () {
                            if ($(this).hasClass('swiper-button-toggle-play-active')) {
                                swiper.stopAutoplay();
                            } else {
                                swiper.startAutoplay();
                            }
                        });
                }
            }
        });

        return this;
    };

    // common
    var $win = $(window);
    var $doc = $(document);

    // 미디어쿼리 판단
    var resizeMedia = {
        state: 'pc',
        resizeUpdate: function () {
            var isPC, isMobile, isSmallPC, isTablet = null;

            if (window.matchMedia) {
                isMobile = window.matchMedia('(max-width: 768px)').matches;
                isSmallPC = window.matchMedia('(max-width: 1200px)').matches;
                isTablet = window.matchMedia('(max-width: 768px)').matches;
                isPC = !isMobile && !isSmallPC && !isTablet;
            } else {
                isMobile = window.innerWidth <= 480;
                isSmallPC = window.innerWidth <= 1200;
                isTablet = window.innerWidth <= 768;
                isPC = !isMobile && !isSmallPC && !isTablet;
            }

            if (isSmallPC && !isTablet && resizeMedia.state !== 'small-pc') {
                resizeMedia.state = 'small-pc';
                $win.trigger('changeMedia', [resizeMedia.state]);
            } else if (isTablet && !isMobile && resizeMedia.state !== 'tablet') {
                resizeMedia.state = 'tablet';
                $win.trigger('changeMedia', [resizeMedia.state]);
            } else if (isMobile && resizeMedia.state !== 'mobile') {
                resizeMedia.state = 'mobile';
                $win.trigger('changeMedia', [resizeMedia.state]);
            } else if (isPC && resizeMedia.state !== 'pc') {
                resizeMedia.state = 'pc';
                $win.trigger('changeMedia', [resizeMedia.state]);
            }
        }
    };
    resizeMedia.resizeUpdate();

    window.uiScriptResizeMedia = resizeMedia;

    // swiper focus
    $doc.on('focus.swiper', '.swiper-object', function (e) {
        var $this = $(e.target);
        var $wrap = $this.is('.swiper-object') ?
            $this :
            $this.closest('.swiper-object');
        $wrap = $wrap.length ? $wrap : $this.find('.swiper-object');
        var $container = $this.is('.swiper-container') ?
            $this :
            $this.closest('.swiper-container');
        $container = $container.length ?
            $container :
            $this.find('.swiper-container');
        var $list = $this.is('.swiper-wrapper') ?
            $this :
            $this.closest('.swiper-wrapper');
        $list = $list.length ? $list : $this.find('.swiper-wrapper');
        var $currentItem = $this.is('.swiper-slide') ?
            $this :
            $this.closest('.swiper-slide');
        var swiper = $list.data('swiper');
        var index = $currentItem.length ?
            $currentItem.data('swiper-set-slide-index') :
            null;
        var containerOffset = {};
        var itemOffset = {};

        if (swiper) {
            $wrap.scrollTop(0).scrollLeft(0);
            $container.scrollTop(0).scrollLeft(0);
            $list.scrollTop(0).scrollLeft(0);
            swiper.stopAutoplay();

            if (typeof index === 'number') {
                if (typeof swiper.loopedSlides === 'number') {
                    index = $currentItem.index() - swiper.loopedSlides;
                }

                containerOffset = $container.offset();
                itemOffset = $currentItem.offset();

                if (!(
                    containerOffset.left - 1 <= itemOffset.left &&
                    containerOffset.left + 1 + $container.outerWidth() >= itemOffset.left + $currentItem.outerWidth() &&
                    containerOffset.top - 1 <= itemOffset.top &&
                    containerOffset.top + 1 + $container.outerHeight() >= itemOffset.top + $currentItem.outerHeight()
                )) {
                    swiper.swipeTo(index);
                }
            }
        }
    });

    // sticky
    var UiSticky = function (target, option) {
        var _ = this;
        var $target = $(target).eq(0);

        _.className = {
            wrap: 'js-sticky-wrap',
            fixed: 'is-fixed'
        };
        _.options = option;
        _.target = $target;
        _.init();
        _.on();
        _.update();
    };
    UiSticky.prototype.init = function () {
        var _ = this;

        _.target.wrap('<div class="' + _.className.wrap + '"></div>');
        _.wrap = _.target.closest('.' + _.className.wrap);

        if (typeof _.options.customClass === 'string') {
            _.wrap.addClass(_.options.customClass);
        }
    };
    UiSticky.prototype.on = function () {
        var _ = this;

        _.hashCode = uiGetHashCode();

        $win
            .on('scroll.uiSticky' + _.hashCode, function () {
                _.update();
            })
            .on('resize.uiSticky' + _.hashCode, function () {
                _.update();
            });
    };
    UiSticky.prototype.update = function () {
        var _ = this;
        var offsetTop = _.wrap.offset().top - _.options.addiHeight;
        var scrollTop = $win.scrollTop();
        var maxScrollTop = $doc.outerHeight() - $win.height();
        var height = 0;

        if (scrollTop >= 0 && scrollTop <= maxScrollTop) {
            height = _.target.outerHeight();

            if (
                scrollTop >= offsetTop &&

                (!_.target.hasClass(_.className.fixed) || _.height !== height)
            ) {
                _.wrap.css('height', height);
                _.target
                    .addClass(_.className.fixed)
                    .css('position', 'fixed')
                    .trigger('stickyed');

                _.height = height;
            } else if (
                scrollTop < offsetTop &&
                _.target.hasClass(_.className.fixed)
            ) {
                _.wrap.css('height', '');
                _.target
                    .removeClass(_.className.fixed)
                    .css('position', '')
                    .trigger('unStickyed');
            }
        }
    };
    UiSticky.prototype.changeAddiHeight = function (val) {
        var _ = this;

        _.options.addiHeight = val;
        _.update();
    };
    $.fn.uiSticky = function (custom) {
        var defaultOption = {
            addiHeight: 0,
            customClass: null
        };
        var other = [];

        custom = custom || {};

        $.each(arguments, function (i) {
            if (i > 0) {
                other.push(this);
            }
        });

        this.each(function () {
            var options = {};
            var uiSticky = this.uiSticky;

            if (typeof custom === 'object' && !uiSticky) {
                options = $.extend({}, defaultOption, custom);
                this.uiSticky = new UiSticky(this, options);
            } else if (typeof custom === 'string' && uiSticky) {
                switch (custom) {
                    case 'update':

                        uiSticky.update();
                        break;
                    case 'changeAddiHeight':

                        uiSticky.changeAddiHeight(other[0]);
                        break;
                    default:
                        break;
                }
            }
        });

        return this;
    };

    // drop down
    var UiDropDown = function (target, option) {
        var _ = this;
        var $wrap = $(target).eq(0);

        _.className = {
            opened: 'js-dropdown-opened',
            top: 'js-dropdown-top',
            bottom: 'js-dropdown-bottom'
        };
        _.css = {
            hide: {
                position: 'absolute',
                top: '',
                left: '',
                bottom: '',
                marginLeft: '',
                display: 'none'
            },
            show: {
                position: 'absolute',
                top: '100%',
                left: '0',
                display: 'block'
            }
        }
        _.options = option;
        _.wrap = $wrap;
        _.init();
        _.on();
    };
    UiDropDown.prototype.init = function () {
        var _ = this;

        if (_.options.opener) {
            if (typeof _.options.opener === 'string') {

                _.opener = _.wrap.find(_.options.opener).eq(0);
            } else {

                _.opener = _.options.opener;
            }
        }

        if (_.options.layer) {
            if (typeof _.options.layer === 'string') {

                _.layer = _.wrap.find(_.options.layer).eq(0);
            } else {

                _.layer = _.options.layer;
            }

            _.layer.css(_.css.hide);
        }

        if (_.layer.length) {
            _.wrap.css('position', 'relative');
        }

        _.options.init();
    }
    UiDropDown.prototype.on = function () {
        var _ = this;

        if (_.layer.length) {

            _.hashCode = uiGetHashCode();

            if (_.opener && _.opener.length && _.options.event === 'click') {

                _.opener.on('click.uiDropDown', function () {
                    _.toggle();
                });

                $doc.on('click.uiDropDown' + _.hashCode, function (e) {
                    var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

                    if (!check) {
                        _.close();
                    }
                });

                $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {

                    var check = $(e.target).is(_.layer) || $(e.target).closest(_.layer).length;

                    if (check) {
                        _.open();
                    } else {
                        _.close();
                    }
                });
            } else if (_.options.event === 'hover') {
                _.wrap
                    .on('mouseenter.uiDropDown', function () {
                        _.open();
                    })
                    .on('mouseleave.uiDropDown', function () {
                        _.close();
                    });

                $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
                    var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

                    if (check) {
                        _.open();
                    } else {
                        _.close();
                    }
                });
            }

            $win.on('resize.uiDropDown' + _.hashCode, function () {
                _.update();
            });
        }
    }
    UiDropDown.prototype.update = function () {
        var _ = this;
        var docH = 0;
        var docW = 0;
        var layerH = 0;
        var layerW = 0;

        if (_.wrap.hasClass(_.className.opened)) {

            _.layer.css(_.css.hide);
            _.wrap.removeClass(_.className.top + ' ' + _.className.bottom);

            var docH = $doc.height();
            var docW = $doc.width();

            _.layer.css(_.css.show);

            var wrapT = _.wrap.offset().top;

            var layerT = _.layer.offset().top;

            var layerL = _.layer.offset().left;

            var layerH = _.layer.outerHeight();

            var layerW = _.layer.outerWidth();

            if (docH < layerT + layerH && wrapT - layerH >= 0) {
                _.wrap.addClass(_.className.top);

                _.layer.css({
                    top: 'auto',
                    bottom: '100%'
                });
            } else {
                _.wrap.addClass(_.className.bottom);
            }
            if (docW < layerL + layerW && docW - layerW > 0) {

                _.layer.css({
                    marginLeft: -(Math.ceil(layerL + layerW - docW))
                });
            }
        }
    }
    UiDropDown.prototype.toggle = function () {
        var _ = this;

        if (_.wrap.hasClass(_.className.opened)) {
            _.close();
        } else {
            _.open();
        }
    }
    UiDropDown.prototype.open = function () {
        var _ = this;

        if (!_.wrap.hasClass(_.className.opened)) {
            _.wrap
                .addClass(_.className.opened)
                .css('z-index', '90');

            _.layer.css(_.css.show);
            _.update();

            _.layer.trigger('uiDropDownOpened');
        }
    }
    UiDropDown.prototype.close = function () {
        var _ = this;

        if (_.wrap.hasClass(_.className.opened)) {
            _.wrap
                .removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom)
                .css('z-index', '');

            _.layer
                .css(_.css.hide)
                .trigger('uiDropDownClosed');
        }
    }
    $.fn.uiDropDown = function (custom) {
        var defaultOption = {
            opener: null,
            layer: null,
            event: 'click',
            init: function () { }
        };
        var other = [];

        custom = custom || {};

        $.each(arguments, function (i) {
            if (i > 0) {
                other.push(this);
            }
        });

        this.each(function () {
            var options = {};
            var uiDropDown = this.uiDropDown;

            if (typeof custom === 'object' && !uiDropDown) {
                options = $.extend({}, defaultOption, custom);
                this.uiDropDown = new UiDropDown(this, options);
            } else if (typeof custom === 'string' && uiDropDown) {
                switch (custom) {
                    case 'close':

                        uiDropDown.close();
                        break;
                    case 'open':

                        uiDropDown.open();
                        break;
                    default:
                        break;
                }
            }
        });

        return this;
    };

    // accordion
    var UiAccordion = function (target, option) {
        var _ = this;
        var $wrap = $(target).eq(0);

        _.className = {
            opened: 'js-accordion-opened'
        };
        _.options = option;
        _.wrap = $wrap;
        _.init();
        _.on();
    };
    UiAccordion.prototype.init = function () {
        var _ = this;

        if (_.options.opener) {
            if (typeof _.options.opener === 'string') {

                _.opener = _.wrap.find(_.options.opener);
            } else {

                _.opener = _.options.opener;
            }
        }

        if (_.options.layer) {
            if (typeof _.options.layer === 'string') {

                _.layer = _.wrap.find(_.options.layer);
            } else {

                _.layer = _.options.layer;
            }
        }

        if (_.options.item) {
            if (typeof _.options.item === 'string') {

                _.item = _.wrap.find(_.options.item);
            } else {

                _.item = _.options.item;
            }
        }

        if (_.layer.length && _.item.length && _.item.filter('[data-initial-open]').length) {

            _.item.each(function () {
                var $this = $(this);
                if ($this.attr('data-initial-open') === 'true') {
                    _.open($this, 0);
                }
            });
        }

        _.options.init();
    }
    UiAccordion.prototype.on = function () {
        var _ = this;

        if (_.opener.length && _.layer.length) {

            _.hashCode = uiGetHashCode();

            _.opener.on('click.uiAccordion', function () {

                _.toggle($(this).closest(_.item));
            });

            $doc

                .on('keydown.uiAccordion' + _.hashCode, function (e) {

                    if (e.keyCode === 9 && _.blockTabKey) {
                        e.preventDefault();
                    }
                })

                .on('focusin.uiAccordion' + _.hashCode, function (e) {
                    var $item =

                        ($(e.target).is(_.layer) || $(e.target).closest(_.layer).length) &&

                        $(e.target).closest(_.item);

                    if ($item) {
                        _.open($item, 0);
                    }
                });
        }
    }
    UiAccordion.prototype.toggle = function ($item) {
        var _ = this;

        if ($item.hasClass(_.className.opened)) {
            _.close($item);
        } else {
            _.open($item);
        }
    }
    UiAccordion.prototype.open = function ($item, speed) {
        var _ = this;
        var $layer = null;
        var beforeH = 0;
        var afterH = 0;
        speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

        if (!$item.hasClass(_.className.opened)) {
            $item.addClass(_.className.opened);

            $layer = $item.find(_.layer);
            $layer.stop().css('display', 'block');
            beforeH = $layer.height();
            $layer.css('height', 'auto');
            afterH = $layer.height();
            if (beforeH === afterH) {
                speed = 0;
            }
            $layer
                .css('height', beforeH)
                .animate({
                    height: afterH
                }, {
                    duration: speed,
                    step: function () {
                        contentsZoom.update();
                    },
                    complete: function () {
                        $layer
                            .css({
                                height: 'auto'
                            })
                            .trigger('uiAccordionAfterOpened');
                    }
                })
                .trigger('uiAccordionOpened', [beforeH, afterH]);

            if (_.options.once) {

                _.item.not($item).each(function () {
                    _.close($(this));
                });
            }
        }
    }
    UiAccordion.prototype.close = function ($item, speed) {
        var _ = this;
        var $layer = null;
        var beforeH = 0;
        var afterH = 0;
        speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

        if ($item.hasClass(_.className.opened)) {

            _.blockTabKey = true;
            $item.removeClass(_.className.opened);

            $layer = $item.find(_.layer);
            $layer.stop().css('display', 'block');
            beforeH = $layer.height();
            $layer.css('height', '');
            afterH = $layer.height();
            if (beforeH === afterH) {
                speed = 0;
            }
            $layer
                .css('height', beforeH)
                .animate({
                    height: afterH
                }, {
                    duration: speed,
                    step: function () {
                        contentsZoom.update();
                    },
                    complete: function () {
                        $layer
                            .css({
                                display: '',
                                height: ''
                            })
                            .trigger('uiAccordionAfterClosed');

                        _.blockTabKey = false;
                    }
                })
                .trigger('uiAccordionClosed', [beforeH, afterH]);
        }
    }
    UiAccordion.prototype.allClose = function () {
        var _ = this;

        _.item.each(function () {
            _.close($(this));
        });
    }
    $.fn.uiAccordion = function (custom) {
        var defaultOption = {
            item: null,
            opener: null,
            layer: null,
            once: false,
            speed: 500,
            init: function () { }
        };
        var other = [];

        custom = custom || {};

        $.each(arguments, function (i) {
            if (i > 0) {
                other.push(this);
            }
        });

        this.each(function () {
            var options = {};
            var uiAccordion = this.uiAccordion;

            if (typeof custom === 'object' && !uiAccordion) {
                options = $.extend({}, defaultOption, custom);
                this.uiAccordion = new UiAccordion(this, options);
            } else if (typeof custom === 'string' && uiAccordion) {
                switch (custom) {
                    case 'allClose':

                        uiAccordion.allClose();
                        break;
                    case 'close':

                        uiAccordion.close(other[0], other[1]);
                        break;
                    case 'open':

                        uiAccordion.open(other[0], other[1]);
                        break;
                    default:
                        break;
                }
            }
        });

        return this;
    };

    // tab ui
    var UiTabPanel = function (target, option) {
        var _ = this;
        var $wrap = $(target).eq(0);

        _.className = {
            active: 'js-tabpanel-active',
            opened: 'js-tabpanel-opened'
        };
        _.options = option;
        _.wrap = $wrap;
        _.crrTarget = '';
        _.init();
        _.on();
    };
    UiTabPanel.prototype.init = function () {
        var _ = this;
        var initialOpen = typeof _.options.initialOpen === 'string' && _.options.initialOpen;

        if (_.options.opener) {
            if (typeof _.options.opener === 'string') {

                _.opener = _.wrap.find(_.options.opener);
            } else {

                _.opener = _.options.opener;
            }
        }

        if (_.options.item) {
            if (typeof _.options.item === 'string') {

                _.item = _.wrap.find(_.options.item);
            } else {

                _.item = _.options.item;
            }
        }

        if (_.opener.length && _.item.length) {

            _.hashCode = uiGetHashCode();

            if (!initialOpen) {

                initialOpen = _.opener.eq(0).attr('data-tab-open');
            }

            if (_.options.a11y) {
                _.initA11y();
            }

            _.open(initialOpen, false);
        }
    }
    UiTabPanel.prototype.on = function () {
        var _ = this;
        var openerFocus = false;
        var $focusOpener = null;

        if (_.opener.length && _.item.length) {

            _.opener.on('click.uiTabPanel', function () {
                const STOP_TAB = $(this).parents('.stop-tab').length > 0;
                if (STOP_TAB) return;

                var target = $(this).attr('data-tab-open');
                //				$(this).attr('title','선택됨');
                _.open(target);
            });

            $doc.on('focusin.uiTabPanel' + _.hashCode, function (e) {
                var $panel =

                    ($(e.target).is(_.item) && $(e.target)) ||

                    ($(e.target).closest(_.item).length && $(e.target).closest(_.item));

                if ($panel && !$panel.is(':hidden')) {
                    _.open($panel.attr('data-tab'));
                }
            });

            _.opener
                .on('focus.uiTabPanel', function () {
                    openerFocus = true;
                    $focusOpener = $(this);
                })
                .on('blur.uiTabPanel', function () {
                    openerFocus = false;
                    $focusOpener = null;
                });
            $doc

                .on('keydown.uiTabPanel' + _.hashCode, function (e) {
                    var keyCode = e.keyCode;
                    if (_.options.a11y && openerFocus) {
                        if ([13, 32, 35, 36, 37, 38, 39, 40].indexOf(keyCode) > -1) {
                            e.preventDefault();
                        }
                    }
                })

                .on('keyup.uiTabPanel' + _.hashCode, function (e) {
                    var keyCode = e.keyCode;
                    var target = $focusOpener && $focusOpener.attr('data-tab-open');
                    if (_.options.a11y && openerFocus) {
                        switch (keyCode) {
                            case 35:
                                _.goEnd();
                                break;
                            case 36:
                                _.goStart();
                                break;
                            case 37:
                                //_.prev();
                                break;
                            case 38:
                                //_.prev();
                                break;
                            case 39:
                                //_.next();
                                break;
                            case 40:
                                //_.next();
                                break;
                            case 13:
                                _.open(target);
                                break;
                            case 32:
                                _.open(target);
                                break;
                            default:
                                break;
                        }
                    }
                });
        }
    }
    UiTabPanel.prototype.open = function (target, focus) {
        var _ = this;

        var $opener = _.opener.filter('[data-tab-open="' + target + '"]');

        var $panel = _.item.filter('[data-tab="' + target + '"]');

        if (!$panel.hasClass(_.className.opened)) {
            if (_.options.a11y) {
                _.setActiveA11y(target, focus);
            }

            _.crrTarget = target;

            _.opener.not($opener).removeClass(_.className.active);
            //			_.opener.not($opener).find('a').removeAttr('title');

            _.item.not($panel).removeClass(_.className.opened);
            $opener.addClass(_.className.active);
            //			$opener.find('a').attr('title','선택됨');
            $panel
                .addClass(_.className.opened)
                .trigger('uiTabPanelChange');
        }
    }
    UiTabPanel.prototype.indexOpen = function (i) {
        var _ = this;

        var target = _.opener.eq(i).attr('data-tab-open');

        _.open(target);
    }
    UiTabPanel.prototype.next = function () {
        var _ = this;

        var length = _.opener.length;

        var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) + 1;
        if (i >= length) {
            i = 0;
        }
        _.indexOpen(i);
    }
    UiTabPanel.prototype.prev = function () {
        var _ = this;

        var length = _.opener.length;

        var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) - 1;
        if (i < 0) {
            i = length - 1;
        }
        _.indexOpen(i);
    }
    UiTabPanel.prototype.goStart = function () {
        var _ = this;
        _.indexOpen(0);
    }
    UiTabPanel.prototype.goEnd = function () {
        var _ = this;

        _.indexOpen(_.opener.length - 1);
    }
    UiTabPanel.prototype.initA11y = function () {
        var _ = this;

        _.opener.each(function () {
            var $this = $(this);

            var target = $this.attr('data-tab-open');

            /*20220418 접근성 수정
             * $this
                .attr('role', 'tab')
                .attr('id', 'tabpanel-opener-'+target+'-'+_.hashCode)
                .attr('aria-controls', 'tabpanel-'+target+'-'+_.hashCode);*/
        });

        _.item.each(function () {
            var $this = $(this);

            var target = $this.attr('data-tab');

            /*$this
                .attr('role', 'tabpanel')
                .attr('id', 'tabpanel-'+target+'-'+_.hashCode)
                .attr('aria-labelledby', 'tabpanel-opener-'+target+'-'+_.hashCode);*/
        });

        _.wrap.attr('role', 'tablist');
    }
    UiTabPanel.prototype.setActiveA11y = function (target, focus) {
        var _ = this;

        focus = focus === false ? false : true;

        _.opener.each(function () {
            var $this = $(this);
            var crrTarget = $this.attr('data-tab-open');
            const NOT_A = $('.tab-basic-buttons-item').find('a').length < 1;

            if (crrTarget === target) {
                $this.find('a').attr('title', '선택됨');

                if (NOT_A) {
                    $this
                        .attr('title', '선택됨');
                }
                if (focus) {
                    $this.focus();
                }
            } else {
                $this.find('a').removeAttr('title');

                if (NOT_A) {
                    $this
                        .removeAttr('title');
                }
            }
        });

        _.item.each(function () {
            var $this = $(this);
            var crrTarget = $this.attr('data-tab');

            if (crrTarget === target) {
                $this.removeAttr('hidden');
            } else {
                $this.attr('hidden', '');
            }
        });
    }
    UiTabPanel.prototype.addA11y = function () {
        var _ = this;

        if (!_.options.a11y) {
            _.options.a11y = true;
            _.initA11y();
            _.setActiveA11y(_.crrTarget);
        }
    }
    UiTabPanel.prototype.clearA11y = function () {
        var _ = this;

        if (_.options.a11y) {
            _.options.a11y = false;

            _.opener
                .removeAttr('role')
                .removeAttr('id')
                .removeAttr('aria-controls')
                .removeAttr('tabindex')
                .removeAttr('aria-selected');

            _.item
                .removeAttr('role')
                .removeAttr('id')
                .removeAttr('aria-labelledby')
                .removeAttr('hidden');

            _.wrap.removeAttr('role');
        }
    }
    $.fn.uiTabPanel = function (custom) {
        var defaultOption = {
            item: null,
            opener: null,
            initialOpen: null,
            a11y: false
        };
        var other = [];

        custom = custom || {};

        $.each(arguments, function (i) {
            if (i > 0) {
                other.push(this);
            }
        });

        this.each(function () {
            var options = {};
            var uiTabPanel = this.uiTabPanel;

            if (typeof custom === 'object' && !uiTabPanel) {
                options = $.extend({}, defaultOption, custom);
                this.uiTabPanel = new UiTabPanel(this, options);
            } else if (typeof custom === 'string' && uiTabPanel) {
                switch (custom) {
                    case 'addA11y':

                        uiTabPanel.addA11y();
                        break;
                    case 'clearA11y':

                        uiTabPanel.clearA11y();
                        break;
                    default:
                        break;
                }
            }
        });

        return this;
    };

    // scrollBlock
    var scrollBlock = {
        scrollTop: 0,
        className: {
            block: 'js-scroll-blocking'
        },
        block: function () {
            var _ = scrollBlock;
            var $html = $('html');
            var $wrap = $('.layout-wrap');

            scrollBlock.scrollTop = $win.scrollTop();

            if (!$html.hasClass(_.className.block)) {
                $html.addClass(_.className.block);
            }

            $wrap.scrollTop(_.scrollTop);
        },
        clear: function () {
            var _ = scrollBlock;
            var $html = $('html');
            var $wrap = $('.layout-wrap');

            $wrap.scrollTop(0);

            if ($html.hasClass(_.className.block)) {
                $html.removeClass(_.className.block);
            }

            $win.scrollTop(_.scrollTop);
        }
    };

    window.uiScriptScrollBlock = scrollBlock;
    // layer
    var uiLayer = {
        open: function (target, opener) {
            var $html = $('html');
            var $layer = $('[data-layer="' + target + '"]');
            var timer = null;

            if ($layer.length && !$layer.hasClass('js-layer-opened')) {
                $layer.trigger('layerBeforeOpened');
                $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);
                $layer
                    .stop()
                    .css('display', 'block')
                    .animate({
                        opacity: 1
                    }, 400, function () {
                        $layer.trigger('layerAfterOpened');
                    })
                    .attr('tabindex', '0')
                    .data('layerIndex', $('.js-layer-opened').length)
                    .focus();
                scrollBlock.block();

                if ($(opener).length) {
                    $layer.data('layerOpener', $(opener));
                }

                timer = setTimeout(function () {
                    clearTimeout(timer);
                    $layer
                        .addClass('js-layer-opened')
                        .trigger('layerOpened');
                }, 0);
            }
        },
        close: function (target) {
            var $html = $('html');
            var $layer = $('[data-layer="' + target + '"]');
            var timer = null;

            if ($layer.length && $layer.hasClass('js-layer-opened')) {
                $layer
                    .trigger('layerBeforeClosed')
                    .stop()
                    .removeClass('js-layer-opened')
                    .css('display', 'block')
                    .data('layerIndex', null)
                    .animate({
                        opacity: 0
                    }, 400, function () {
                        var $opener = $layer.data('layerOpener');

                        $(this).css('display', 'none');

                        if (!$('.js-layer-opened').length) {
                            $html.removeClass('js-html-layer-opened js-html-layer-closed-animate js-html-layer-opened-' + target);
                            scrollBlock.clear();
                        }

                        if ($opener && $opener.length) {
                            $opener.focus();
                            $layer.data('layerOpener', null);
                        }

                        $layer.trigger('layerAfterClosed');
                    })
                    .trigger('layerClosed');

                timer = setTimeout(function () {
                    clearTimeout(timer);
                    if (!$('.js-layer-opened').length) {
                        $html.addClass('js-html-layer-closed-animate');
                    }
                }, 0);
            }
        },
        noAnimateClose: function (target) {
            var $html = $('html');
            var $layer = $('[data-layer="' + target + '"]');
            var $opener = $layer.data('layerOpener');

            if ($layer.length && $layer.hasClass('js-layer-opened')) {
                $layer
                    .stop()
                    .trigger('layerBeforeClosed')
                    .removeClass('js-layer-opened')
                    .css({
                        'display': 'none',
                        'opacity': '0'
                    })
                    .data('layerIndex', null)
                    .trigger('layerClosed')
                    .trigger('layerAfterClosed');
                if ($opener && $opener.length) {
                    $opener.focus();
                    $layer.data('layerOpener', null);
                }
                if (!$('.js-layer-opened').length) {
                    $html.removeClass('js-html-layer-opened js-html-layer-closed-animate js-html-layer-opened-' + target);
                    scrollBlock.clear();
                }
            }
        },
        checkFocus: function (e) {
            var $layer = $('[data-layer]').not(':hidden');
            var $target = $(e.target);
            var $closest = $target.closest('[data-layer]');
            var lastIndex = (function () {
                var index = 0;
                $layer.each(function () {
                    var crrI = $(this).data('layerIndex');
                    if (crrI > index) {
                        index = crrI;
                    }
                });
                return index;
            })();
            var checkLayer =
                $layer.length &&
                !($target.is($layer) && $target.data('layerIndex') === lastIndex) &&
                !($closest.length && $closest.is($layer) && $closest.data('layerIndex') === lastIndex);

            if (checkLayer) {
                $layer.filter(function () {
                    return $(this).data('layerIndex') === lastIndex;
                }).focus();
            }
        }
    };

    window.uiScriptLayer = uiLayer;

    $doc
        .on('focusin.uiLayer', uiLayer.checkFocus)
        .on('click.uiLayer', '[data-role="layerClose"]', function () {
            var $layer = $(this).closest('[data-layer]');
            if ($layer.length) {
                uiLayer.close($layer.attr('data-layer'));
            }
        })
        .on('click.uiLayer', '[data-layer-open]', function (e) {
            var layer = $(this).attr('data-layer-open');
            var $layer = $('[data-layer="' + layer + '"]');
            if ($layer.length) {
                uiLayer.open(layer);
                $layer.data('layerOpener', $(this));
            }
            e.preventDefault();
        });

    // dropdown, accordion 닫기 버튼
    function componentLayerCloseButton(param) {
        if (param.layer.hasClass('ui-accordion-layer')) return; // 접근성: 알아두세요 버튼 강제 삽입 방지 추가

        if (typeof param.text === 'function') {
            param.item.each(function () {
                var $this = $(this);
                $this.find(param.layer).append(
                    '<button type="button" class="component-layer-close-button"><span class="component-layer-close-button-text">' +
                    param.text($this) +
                    '</span></button>'
                );
            });
        } else {
            param.layer.append(
                '<button type="button" class="component-layer-close-button"><span class="component-layer-close-button-text">' +
                param.text +
                '</span></button>'
            );
        }

        var $closeBtn = param.layer.find('.component-layer-close-button');

        $closeBtn.on('click', function () {
            var $this = $(this);
            $this.closest(param.item).find(param.opener).eq(0).focus();
            param.close($this);
        });
    }

    // .layout-container 에 header, footer 높이 빼기

    var layoutResizeTimer = null;

    function layoutResize() {
        //		var $container = $('.layout-container');
        //		var $header = $('.header-wrap');
        //		var $footer = $('.footer-wrap');
        //
        //		clearTimeout(layoutResizeTimer);
        //
        //		layoutResizeTimer = setTimeout(function(){
        //			clearTimeout(layoutResizeTimer);
        //			$container.css({
        //				paddingTop: $header.outerHeight(),
        //				paddingBottom: $footer.outerHeight()
        //			});
        //		}, 0);
    }

    // location sticky
    function locationStickySet() {
        var lacationStickyAddiHeight = $('.header-bottom.js-ui-sticky-object').outerHeight();
        $('.location-wrap.js-ui-sticky-object').uiSticky('changeAddiHeight', lacationStickyAddiHeight);
    }

    // all menu layer
    function uiScriptAllMenu() {
        $('.all-menu-nav-depth2-list').each(function () {
            var $this = $(this);

            $this.uiAccordion({
                item: '.all-menu-nav-depth2-item',
                opener: '.all-menu-nav-depth2-opener',
                layer: '.all-menu-nav-depth2-layer',
                once: true,
                speed: 400,
                init: function () {
                    componentLayerCloseButton({
                        item: $this.find('.all-menu-nav-depth2-item'),
                        opener: $this.find('.all-menu-nav-depth2-opener'),
                        layer: $this.find('.all-menu-nav-depth2-layer'),
                        text: '하위 메뉴 닫기',
                        close: function ($btn) {
                            $this.uiAccordion('close', $btn.closest('.all-menu-nav-depth2-item'));
                        }
                    });
                }
            });
        });
        $('.all-menu-nav-depth2-item')
            .off('uiAccordionOpened uiAccordionClosed')
            .on('uiAccordionOpened uiAccordionClosed', function (e) {
                var $this = $(this);
                var $opener = $this.find('.all-menu-nav-depth2-opener span');

                if (e.type === 'uiAccordionOpened') {
                    $opener.text('하위 메뉴 닫기');
                } else {
                    $opener.text('하위 메뉴 열기');
                }
            });
        $('.all-menu-nav-depth2-item').on('uiAccordionOpened uiAccordionAfterOpened', function () {
            var $this = $(this);
            var $frame = $('.all-menu-nav-list');
            var $docItem = $this.closest('.all-menu-nav-item');

            if ($frame.height() !== $frame.get(0).scrollHeight) {
                $frame.stop().animate({
                    scrollTop: $this.offset().top - $docItem.offset().top
                }, 400);
            }
        });
        $('.all-menu-nav')
            .uiTabPanel({
                a11y: true,
                item: '.all-menu-nav-item',
                opener: '.all-menu-nav-tab-button'
            })
            .on('uiTabPanelChange', function () {
                $('.all-menu-nav-list').scrollTop(0);
            });
        setAllMenuA11y();
    }

    window.uiScriptAllMenu = uiScriptAllMenu;
    var uiScriptAllMenuSearch = {
        show: function () {
            $('.all-menu-layer').addClass('is-show-search-result');
        },
        hide: function () {
            $('.all-menu-layer').removeClass('is-show-search-result');
        }
    }

    window.uiScriptAllMenuSearch = uiScriptAllMenuSearch;

    function setAllMenuA11y() {
        var $menuNav = $('.all-menu-nav');
        var isMobile = $('.layout-container').css('min-width') === '0px';

        if (isMobile) {
            $menuNav.uiTabPanel('addA11y');
        } else {
            $menuNav.uiTabPanel('clearA11y');
        }
    }
    $doc
        .on('click.uiScriptAllMenuSearch', '.all-menu-search-closer', function () {
            uiScriptAllMenuSearch.hide();
            $('.all-menu-layer').removeClass('is-show-search');
        })
        .on('click.uiScriptAllMenuSearch', '.all-menu-search-opener', function () {
            $('.all-menu-layer').addClass('is-show-search');
        });
    $win.on('resize.uiScriptAllMenuSearch', function () {
        setAllMenuA11y();
    });

    // contents zoom
    var contentsZoom = {
        zoom: 1,
        content: null,
        wrap: null,
        initCheck: false,
        init: function () {
            var _ = contentsZoom;
            contentsZoom.content = $('.title-top, .container, .content');
            _.content.wrap('<div class="js-content-zoom-wrap"></div>');

            contentsZoom.wrap = _.content.parent('.js-content-zoom-wrap');
            _.initCheck = true;
        },
        set: function (val) {
            contentsZoom.zoom = val > 1.5 ? 1.5 : val < 0.75 ? 0.75 : val;

            var _ = contentsZoom;

            _.content.css({
                '-webkit-transform': 'scale(' + _.zoom + ')',
                'transform': 'scale(' + _.zoom + ')',
                '-webkit-transform-origin': '0 0',
                'transform-origin': '0 0'
            });
            _.update();
        },
        update: function () {
            var _ = contentsZoom;
            if (_.initCheck) {
                _.wrap.each(function () {
                    var $this = $(this);
                    var $content = $this.find(_.content);
                    var wrapWidth = $this.outerWidth();
                    var width = wrapWidth * ((1 / (wrapWidth * _.zoom)) * wrapWidth);

                    $content.css({
                        width: width
                    });
                    var height = $content.outerHeight() * _.zoom;
                    $this.css({
                        height: height
                    });
                });
            }
        },
        up: function () {
            var zoom = contentsZoom.zoom;
            contentsZoom.set(zoom < 1 ? zoom + 0.05 : zoom + 0.1);
        },
        down: function () {
            var zoom = contentsZoom.zoom;
            contentsZoom.set(zoom <= 1 ? zoom - 0.05 : zoom - 0.1);
        }
    }

    window.uiScriptContentsZoom = contentsZoom;
    // 개발에서 컨텐츠 높이 바뀌는 일이 있을 때 uiScriptContentsZoom.update(); 라고 호출 해 줘야 함.
    $doc
        .on('click.uiContentsZoom', '.js-contents-zoom-up', contentsZoom.up)
        .on('click.uiContentsZoom', '.js-contents-zoom-down', contentsZoom.down)
        .on('uiAccordionAfterOpened.uiContentsZoom uiAccordionAfterClosed.uiContentsZoom uiTabPanelChange.uiContentsZoom', function () {
            contentsZoom.update();
        });

    // print
    $doc.on('click.uiPrint', '.js-contents-print', function () {
        window.print();
    });

    function printOfPartial(target) {
        var printWindow = window.open('', '인쇄', 'width=1000px, height=700');
        var head = $('head').html();
        var html = $(target).get(0).outerHTML;

        html = '<!DOCTYPE html>' +
            '<html lang="ko">' +
            '<head>' +
            head +
            '</head>' +
            '<body>' +
            '<div style="min-width: 1000px;">' +
            html +
            '</div>' +
            '</body>' +
            '</html>';

        printWindow.document.open();

        printWindow.document.write(html);

        printWindow.focus();

        setTimeout(function () {

            printWindow.document.close();

            printWindow.print();

            printWindow.close();
        }, 1000);

        /*var timer = setTimeout(function(){
            clearTimeout(timer);
            printWindow.print();
            printWindow.close();
        }, 1000);*/
    }

    window.uiScriptPrintOfPartial = printOfPartial;

    // gnb ui
    function uiScriptGNB() {
        $('.gnb-item').uiDropDown({
            event: 'hover',
            layer: '.gnb-layer'
        }, function () { });

        $('.gnb-depth2-item')
            .off('uiAccordionOpened uiAccordionClosed')
            .on('uiAccordionOpened uiAccordionClosed', function (e) {
                var $this = $(this);
                var $opener = $this.find('.gnb-depth2-opener span');
                if (e.type === 'uiAccordionOpened') {

                } else {
                    $opener.text('하위 메뉴 보기');
                }
            });
        /*
            $('.gnb-depth2-list').each(function(){
                var $this = $(this);
    
                $this.uiAccordion({
                    item: '.gnb-depth2-item',
                    opener: '.gnb-depth2-opener',
                    layer: '.gnb-depth2-layer',
                    once: true,
                    speed: 400,
                    init: function(){
                        componentLayerCloseButton({
                            item: $this.find('.gnb-depth2-item'),
                            opener: $this.find('.gnb-depth2-opener'),
                            layer: $this.find('.gnb-depth2-layer'),
                            text: '하위 메뉴 숨기기',
                            close: function($btn){
                                $this.uiAccordion('close', $btn.closest('.gnb-depth2-item'));
                            }
                        });
                    }
                });
            });
            $('.gnb-item').on('uiDropDownClosed', function(){
                $('.gnb-depth2-list').uiAccordion('allClose');
            });*/
    }

    window.uiScriptGNB = uiScriptGNB;

    // location ui
    function uiScriptLocation() {
        $('.location-select.js-ui-dropdown-wrap')
            .each(function () {
                var $this = $(this);

                $this.uiDropDown({
                    opener: '.js-ui-dropdown-opener',
                    layer: '.js-ui-dropdown-layer',
                    init: function () {
                        componentLayerCloseButton({
                            item: $this,
                            opener: $this.find('.js-ui-dropdown-opener'),
                            layer: $this.find('.js-ui-dropdown-layer'),
                            text: function ($item) {
                                return $item.find('.js-ui-dropdown-opener span').text().replace('열기', '닫기');
                            },
                            close: function () {
                                $this.uiDropDown('close');
                            }
                        });
                    }
                });
            })
            .off('uiDropDownOpened uiDropDownClosed')
            .on('uiDropDownOpened uiDropDownClosed', function (e) {
                var $this = $(this);
                var $opener = $this.find('.js-ui-dropdown-opener span');
                var text = $opener.text();

                if (e.type === 'uiDropDownOpened') {
                    $opener.text(text.replace('열기', '닫기'));
                } else {
                    $opener.text(text.replace('닫기', '열기'));
                }
            });
    }

    window.uiScriptLocation = uiScriptLocation;

    // footer ui
    function uiScriptFooter() {
        $('.footer-nav.js-ui-dropdown-wrap, .footer-select.js-ui-dropdown-wrap')
            .each(function () {
                var $this = $(this);

                $this.uiDropDown({
                    opener: '.js-ui-dropdown-opener',
                    layer: '.js-ui-dropdown-layer',
                    init: function () {
                        componentLayerCloseButton({
                            item: $this,
                            opener: $this.find('.js-ui-dropdown-opener'),
                            layer: $this.find('.js-ui-dropdown-layer'),
                            text: function ($item) {
                                return $item.find('.js-ui-dropdown-opener').attr('title').replace('열기', '닫기');
                            },
                            close: function () {
                                $this.uiDropDown('close');
                            }
                        });
                    }
                });
            })
            .off('uiDropDownOpened uiDropDownClosed')
            .on('uiDropDownOpened uiDropDownClosed', function (e) {
                var $this = $(this);
                var $opener = $this.find('.js-ui-dropdown-opener');
                var text = $opener.attr('title');

                if (e.type === 'uiDropDownOpened') {
                    $opener.attr('title', text.replace('열기', '닫기'));
                } else {
                    $opener.attr('title', text.replace('닫기', '열기'));
                }
            });
    }

    window.uiScriptFooter = uiScriptFooter;

    // ui common
    function uiScriptCommon() {
        // tab panel
        $('.tab-basic:not(.tab-basic-no-script)').each(function () {
            var $this = $(this);
            var initial = $this.attr('data-initial');

            $this.uiTabPanel({
                a11y: true,
                item: $this.children('.tab-basic-contents').children('.tab-basic-panel'),
                opener: $this.children('.tab-basic-buttons').find('.tab-basic-buttons-item'),
                initialOpen: initial
            });
        });

        // accordion
        $('.js-ui-accordion-item')
            .off('uiAccordionOpened uiAccordionClosed')
            .on('uiAccordionOpened uiAccordionClosed', function (e) {
                var $this = $(this);
                var $opener = $this.find('.js-ui-accordion-opener span');
                var text = $opener.text();

                if (e.type === 'uiAccordionOpened') {
                    $opener.text(text.replace('열기', '닫기'));
                } else {
                    $opener.text(text.replace('닫기', '열기'));
                }
            });
        $('.js-ui-accordion-wrap').each(function () {
            var $this = $(this);
            var $item = $('.js-ui-accordion-item').filter(function () {
                return $(this).closest('.js-ui-accordion-wrap').is($this);
            });
            var $opener = $('.js-ui-accordion-opener').filter(function () {
                return $(this).closest('.js-ui-accordion-wrap').is($this);
            });
            var $layer = $('.js-ui-accordion-layer').filter(function () {
                return $(this).closest('.js-ui-accordion-wrap').is($this);
            });
            var once = (function () {
                var once = $this.attr('data-once');
                return once && once === 'true' ? true : false;
            })();
            var text = function ($item) {
                return $item.find('.js-ui-accordion-opener-text').text();
            };

            if (!$this.get(0).uiAccordion) {
                $item.each(function () {
                    var $this = $(this);
                    $this.find($opener).children('span').text(text($this) + ' 열기');
                });
            }

            $this.uiAccordion({
                item: $item,
                opener: $opener,
                layer: $layer,
                once: once,
                init: function () {
                    componentLayerCloseButton({
                        item: $item,
                        opener: $opener,
                        layer: $layer,
                        text: function ($item) {
                            return text($item) + ' 닫기';
                        },
                        close: function ($btn) {
                            $this.uiAccordion('close', $btn.closest($item));
                        }
                    });
                }
            });
        });

        // dropdown
        $('.js-ui-dropdown-wrap:not(.location-select):not(.footer-nav):not(.footer-select)')
            .each(function () {
                var $this = $(this);

                $this.uiDropDown({
                    opener: '.js-ui-dropdown-opener',
                    layer: '.js-ui-dropdown-layer',
                    init: function () {
                        componentLayerCloseButton({
                            item: $this,
                            opener: $this.find('.js-ui-dropdown-opener'),
                            layer: $this.find('.js-ui-dropdown-layer'),
                            text: function ($item) {
                                return $item.find('.js-ui-dropdown-opener span').text().replace('열기', '닫기');
                            },
                            close: function () {
                                $this.uiDropDown('close');
                            }
                        });
                    }
                });
            })
            .off('uiDropDownOpened uiDropDownClosed')
            .on('uiDropDownOpened uiDropDownClosed', function (e) {
                var $this = $(this);
                var $opener = $this.find('.js-ui-dropdown-opener span');
                var text = $opener.text();

                if (e.type === 'uiDropDownOpened') {
                    $opener.text(text.replace('열기', '닫기'));
                } else {
                    $opener.text(text.replace('닫기', '열기'));
                }
            });
    }

    window.uiScriptCommon = uiScriptCommon;

    // card slide ui
    function uiScriptCardSlider() {
        // 체크카드 발급신청 카드 슬라이드
        var $cardSlider = $('.slide-section');
        var $cardSliderItems = $cardSlider.children();
        $cardSliderItems
            .on('focusin', function () {
                $(this).addClass('is-focus');
            })
            .on('focusout', function () {
                $(this).removeClass('is-focus');
            })

            .on('change', function (e) {
                var $this = $(this);
                $cardSliderItems.removeClass('is-checked');
                if ($this.find('input').is(':checked')) {
                    $this.addClass('is-checked');
                }
            });
        if ($cardSliderItems.length <= 3) {
            $cardSlider.addClass('is-min-length');
        }
        $cardSlider.wrapInner('<div class="card-slider-list"></div>');
        $cardSlider.find('.card-slider-list').swiperSet({
            observer: true,
            nextControl: true,
            prevControl: true,
            slidesPerView: 'auto'
        });
    }

    window.uiScriptCardSlider = uiScriptCardSlider;

    // 마이페이지 슬라이드 스와이프 막기
    function mypageAccountSwiperResize() {
        var isMobile = $('.mypg-slick').css('max-width') === 'none';
        if (isMobile) {
            $('.mypg-slick').removeClass('swiper-no-swiping');
        } else {
            $('.mypg-slick').addClass('swiper-no-swiping');
        }
    }

    // 프로그래스바 애니메이션
    function animateToProgress() {
        var scrollTop = $win.scrollTop();
        $('[data-animate-progress]').each(function () {
            var $this = $(this);
            var offsetTop = $this.offset().top - 400;
            var maxTop = $doc.height() - $win.height();
            var data = $this.data('animate-progress');
            if (
                (scrollTop >= offsetTop && !$this.hasClass('is-animate')) ||
                (maxTop <= offsetTop && !$this.hasClass('is-animate'))
            ) {
                $this
                    .stop()
                    .addClass('is-animate')
                    .css('width', '0')
                    .animate({
                        width: '100%'
                    }, 500, function () {
                        $(this)
                            .stop()
                            .animate({
                                width: data + '%'
                            }, 500, function () {
                                $(this)
                                    .addClass('is-animate-end')
                                    .parent()
                                    .prev()
                                    .animate({
                                        opacity: 1
                                    }, 500);
                            });
                    });
            }
        });
    }

    $(function () {
        layoutResize();
        setTimeout(function () {
            contentsZoom.init();
        }, 50);

        // sticky
        $('.js-ui-sticky-object').uiSticky();
        locationStickySet();

        // ui common
        uiScriptCommon();

        setTimeout(function () {
            // main
            if ($('.main-page-wrap').length) {
                $('.layout-page-title').remove();
            }

            // main 상단 슬라이드
            $('.main-page-top-banner').swiperSet({
                observer: true,
                appendController: $('.main-page-top-banner-controller div'),
                nextControl: true,
                prevControl: true,
                pageControl: true,
                playControl: true,
                pauseControl: true,
                loop: true,
                paginationClickable: true,
                autoplay: 3000,
                nextBtn: $('.main-page-section-top-banner .swiper-button-next').get(0),
                prevBtn: $('.main-page-section-top-banner .swiper-button-prev').get(0),
                onInit: function () {
                    $('.main-page-top-banner-controller').find('.swiper-active-switch').attr('title', '선택됨');
                    $('.main-page-top-banner-controller').find('.swiper-pagination-switch').attr('role', 'button');
                },
                onSlideChangeEnd: function () {
                    $('.main-page-top-banner-controller').find('.swiper-pagination-switch').removeAttr('title');
                    $('.main-page-top-banner-controller').find('.swiper-active-switch').attr('title', '선택됨');
                },
            });

            // main 예적금 상품 슬라이드
            $('.main-page-representative-product-list').swiperSet({
                observer: true,
                appendController: $('.main-page-representative-controller'),
                pageControl: true,
                playControl: true,
                pauseControl: true,
                loop: true,
                paginationClickable: true,
                autoplay: 3000,
                playControlText: '예적금상품 재생',
                pauseControlText: '예적금상품 일시정지'
            });

            // main 예적금 상품 슬라이드2
            $('.main-page-representative-product-list2').swiperSet({
                observer: true,
                appendController: $('.main-page-representative-controller2'),
                pageControl: true,
                playControl: true,
                pauseControl: true,
                loop: true,
                paginationClickable: true,
                autoplay: 3000,
                playControlText: '대출상품 재생',
                pauseControlText: '대출상품 일시정지'
            });

            // main 이벤트 상품 슬라이드
            $('.main-page-event-product-list').swiperSet({
                observer: true,
                appendController: $('.main-page-event-product-controller'),
                pageControl: true,
                playControl: true,
                pauseControl: true,
                loop: true,
                paginationClickable: true,
                autoplay: 3000,
                playControlText: '이벤트상품 재생',
                pauseControlText: '이벤트상품 일시정지'
            });

            // main 작은 배너 슬라이드
            $('.main-page-small-slide-banner-list').swiperSet({
                observer: true,
                appendController: $('.main-page-small-slide-banner-controller'),
                pageControl: false,
                playControl: true,
                pauseControl: true,
                loop: true,
                paginationClickable: true,
                autoplay: 3000,
                playControlText: '고객센터 재생',
                pauseControlText: '고객센터 일시정지'
            });
        }, 200);

        // 마이페이지 계좌 슬라이더
        $('.mypg-slick').swiperSet({
            observer: true,
            customClass: 'js-swiper-mypage-account-slide',
            freeMode: true,
            freeModeFluid: true,
            slidesPerView: 'auto',
            scrollbarControl: true,
            scrollbar: {
                hide: false
            },
            noSwiping: true
        });

        mypageAccountSwiperResize();
        // if ($('.mypg-slick').length) {
        //   $('.tab-basic-panel').on('uiTabPanelChange.mypageAccountSwiper', function () {
        //     $(this).find('.mypg-slick').data('swiper').resizeFix();
        //   });
        // }

        animateToProgress();
    });

    $win
        .on('load.uiScript', function () {
            layoutResize();
            locationStickySet();
        })
        .on('scroll.uiScript', function () {
            animateToProgress();
        })
        .on('resize.uiScript', function () {
            resizeMedia.resizeUpdate();
            layoutResize();
            locationStickySet();
            mypageAccountSwiperResize();
            animateToProgress();
            contentsZoom.update();
        });

})(jQuery);

/*
    1. 개요 : 포인트 컬러 지정
    2. 설명 : 해당 클래스명 사용 시 포인트 컬러로 색상 변경
    3. 최초 작성이력 : 2019. 02. 12 (유시영)
    4. 수정 이력 :
    -----------
    yyyy-mm-dd v0.1 : 내용내용 , 혹은 사유사유 , 작성자 이름 꼭!
*/

// 포인트 색상 지정하기
//var colorA = '#00397b'; //파란색
//var colorB = '#e3047f'; //핑크색

/*$(function() {
    $('.all-color01').css({
        'border-color': colorA,
        'background-color': colorA
    });
    $('.bd-color01').css('border-color', colorA);
    $('.bg-color01').css('background-color', colorA);
    $('.txt-color01').css('color', colorA);
 
    $('.all-color02').css({
        'border-color': colorB,
        'background-color': colorB
    });
    $('.bd-color02').css('border-color', colorB);
    $('.bg-color02').css('background-color', colorB);
    $('.txt-color02').css('color', colorB);
    $('.txt-color02').css('color', colorB);*/
// $('.active-menu').css('color', colorB);
/*	$('.color-active').css('color', colorB);
});*/

/*
    1. 개요 : 팝업창 세로정렬
    2. 설명 : window.height값을 읽어서 팝업창 가운데 띄우기
    @param selector : 띄울 팝업창 selector -> '.className', '#id' 형태
    (해당 selector의 padding값이 있으면 popHeight값에 padding값만큼 적용이 안되니 주의바람)
    3. 최초 작성이력 : 2019. 02. 13
*/
function autoHeight(selector) {

    // var htmlHeight = $(window).height();

    // var popHeight = $(selector).height();
    // var popTop = (htmlHeight - popHeight) / 2;

    // $(selector).css({
    //   top: popTop + 'px',
    //   'margin-top': 0
    // });
}

$(document).ready(function () {
    // autoHeight('.dim-contents');

    function fireResize() {
        if (document.createEvent) {
            var evt = document.createEvent('Event');
            evt.initEvent('resize', true, true);
            window.dispatchEvent(evt);
        } else {

            element = document.createEventObject();

            element.fireEvent('onresize', event);
        }
    }

    fireResize();
});

/*
    1. 개요 : resize 이벤트 시 팝업창 세로정렬
    2. 설명 :
    @param selector : 띄울 팝업창 selector -> '.className', '#id' 형태
    3. 최초 작성이력 : 2019. 02. 13
*/
function resizePopup(selector) {

    // $(window).resize(function () {
    //   if (this.resizeTO) {
    //     clearTimeout(this.resizeTO);
    //   }
    //   this.resizeTO = setTimeout(function () {

    //     $(this).trigger('resizeEnd');
    //   }, 0);
    // });

    // $(window).on('resizeEnd', function () {
    //   autoHeight(selector);
    // });
}
// resizePopup('.dim-contents');

/*
    1. 개요 : 프린트버튼
    2. 설명 : .btn-print 클릭 시 프린트
    3. 최초 작성이력 : 2019. 02. 25
*/

$(document).on('click', '.window-print', function () {
    window.print();
});

/*
1. 개요 : 메인 셀렉트박스 focus이벤트 (접근성)
2. 설명 : div.loca-select focus 이벤트
3. 최초 작성이력 : 2019. 03. 06
*/

$(document).on('focus', 'div.loca-select', function () {

    $(this)
        .find('ul')
        .addClass('block');

    $('div.loca-select')
        .not(this)
        .find('ul')
        .removeClass('block');
});

$(document).on('blur', 'div.loca-select ul li:last-child', function () {

    $('div.loca-select ul').removeClass('block');
});

$(document).on('focus', '.btn-home', function () {

    $('div.loca-select ul').removeClass('block');
});

/* popup focus */
// 접근성 관련 포커스 강제 이동
function accessibilityFocus() {

    $(document).on('keydown', '[data-focus-prev], [data-focus-next]', function (
        e
    ) {

        var next = $(e.target).attr('data-focus-next'),

            prev = $(e.target).attr('data-focus-prev'),
            target = next || prev || false;

        if (!target || e.keyCode != 9) {
            return;
        }

        if ((!e.shiftKey && !!next) || (e.shiftKey && !!prev)) {
            setTimeout(function () {

                $('[data-focus="' + target + '"]').focus();
            }, 1);
        }
    });
}

function tooltip() {
    var openBtn = '[data-tooltip]',
        closeBtn = '.tooltip-close';

    function getTarget(t) {

        return $(t).attr('data-tooltip');
    }

    function open(t) {

        var showTarget = $('[data-tooltip-con="' + t + '"]');
        showTarget.show().focus();
        showTarget.find('.tooltip-close').data('activeTarget', t);
    }

    function close(t) {

        var activeTarget = $('[data-tooltip-con="' + t + '"]');
        activeTarget.hide();

        $('[data-tooltip="' + t + '"]').focus();
    }

    $(document)
        .on('click', openBtn, function (e) {
            e.preventDefault();
            open(getTarget(e.target));
        })
        .on('click', closeBtn, function (e) {
            e.preventDefault();

            close($(this).data('activeTarget'));
        });
}

//tooltip 툴팁

function tooltipAui() {

    let $tooltip = $('.aui-tooltip');

    $tooltip.on('click focus', function (e) {
        e.preventDefault();

        var t = $(this),
            targetOff = t.offset(),
            dataOpt = t.data('option'),
            tarId = t.data('id'),

            tarH = $('#' + tarId + '').outerHeight(),

            tarW = $('#' + tarId + '').outerWidth(),
            thisBtnW = t.outerWidth(),
            thisBtnH = t.outerHeight();

        var config = {
            top: {

                'top': parseInt(targetOff.top - tarH),
                'left': parseInt(targetOff.left + (thisBtnW - tarW) / 2 < 0 ? 0 : targetOff.left + (thisBtnW - tarW) / 2)
            },
            left: {
                'top': parseInt(targetOff.top),

                'left': parseInt(targetOff.left - tarW < 0 ? 0 : targetOff.left - tarW)
            },
            right: {
                'top': parseInt(targetOff.top),

                'left': parseInt(targetOff.left + tarW + thisBtnW > $('body').width() ? $('body').width() - tarW : targetOff.left + thisBtnW)
            },
            bottom: {
                'top': parseInt(targetOff.top + thisBtnH),
                'left': parseInt(targetOff.left + (thisBtnW - tarW) / 2 < 0 ? 0 : targetOff.left + (thisBtnW - tarW) / 2)
            },
            leftbottom: {
                'top': parseInt(targetOff.top + thisBtnH),

                'left': parseInt(targetOff.left - tarW < 0 ? 0 : targetOff.left - tarW) + 15
            }
        };

        $('#' + tarId + '').css(config[dataOpt]).addClass(dataOpt).addClass('active');

    }).on('blur', function () {

        var t = $(this),
            tarId = t.data('id');

        $('#' + tarId + '').removeClass('active');
    });
}

function LayerPopup() {
    var openBtn = '[data-layerpopup]',
        closeBtn = '.tooltip-layerpopup-close';

    function getTarget(t) {

        return $(t).attr('data-layerpopup');
    }

    function open(t) {

        var showTarget = $('[data-layerpopup-con="' + t + '"]');
        showTarget.show().focus();
        showTarget.find('.tooltip-layerpopup-close').data('activeTarget', t);

        $('[data-layerpopup="' + t + '"]').parents().addClass('scroll-type');
    }

    function close(t) {

        var activeTarget = $('[data-layerpopup-con="' + t + '"]');
        activeTarget.hide();

        $('[data-layerpopup="' + t + '"]').focus();

        $('[data-layerpopup="' + t + '"]').parents().removeClass('scroll-type');
    }

    $(document).on('click', openBtn, function (e) {
        e.preventDefault();
        open(getTarget(e.target));
    }).on('click', closeBtn, function (e) {
        e.preventDefault();

        close($(this).data('activeTarget'));
    })
}

$(document).ready(function () {
    LayerPopup();
    accessibilityFocus();
    tooltip();
    tooltipAui();

    $('.gnb-list > li').each(function (index) {

        var gnbHeight = $(this).find('.gnb-layer').height() + 10;

        $('.layout-wrap').append('<div class="gnbbackground-box gnbbackground-box-type' + (index + 1) + ' " style="height:' + gnbHeight + 'px "></div>');
    });

    $('.gnb-list > li.gnb-item').each(function (index, element) {

        $(element).on('focusin hover mouseenter', function () {

            $('.gnbbackground-box-type' + (index + 1)).addClass('active');
        });

        $(element).on('mouseleave focusout', function () {

            $('.gnbbackground-box-type' + (index + 1)).removeClass('active');
        });
    });
});
//fsbcontainer tabindex

$(document).ready(function () {

    $("#_FSBcontainer").attr('tabindex', '-1');
});

//전체 메뉴 검색 눌렀을 경우 검색창으로 바로 포커스 이동

$(function () {

    $('.header-all-menu-open.search').click(function () {
        setTimeout(function () {

            $('.all-menu-search-form-input').focus();
        }, 100);
    });
});

//키비주얼 text 유무 확인 후 클래스 분기

$(document).ready(function () {

    var isVisualText = $('.main-page-top-banner-title')[0];

    if (!isVisualText) {

        $('.main-page-top-banner').addClass('type01');
    }

    // 팝업 z-index 순서 정하기

    function popupOrder() {

        const DIM_LIST = $('.dim-contents');
        const DIM_LENGTH = DIM_LIST.length;

        for (var i = 0; i < DIM_LENGTH; i++) {
            const DIM = DIM_LIST.eq(i);

            DIM.css('z-index', 10000 - i);
        }
    }

    popupOrder();

});

/*===========================================================================================================*/
/*===========================================================================================================*/
/*===========================================================================================================*/

$(document).ready(function () {

    /* GNB 배경 처리 */
    {
        const $el = $('.gnb-depth01-item'),
            $el2 = $('.gnb-depth02-list'),
            $bg = $('.gnb-bg');

        $el.on('mouseenter focusin', function () {

            const $this = $(this),
                $list = $this.find('.gnb-depth02-list');

            $list.stop().show();

            const HEIGHT = $list.outerHeight();

            $bg.css({
                "height": HEIGHT,
                "border-color": "#d9d9d9",
                "opacity": "1",
            });
        });

        $el.on('mouseleave focusout', function () {

            const $this = $(this),
                $list = $this.find('.gnb-depth02-list');

            $list.stop().hide(1);
            $bg.css({
                "height": 0,
                "border-color": "transparent",
                "opacity": 0,
            });
        });
    };

    /* 전체메뉴 PC 높이 계산 */
    function changeFullMenuHeight() {

        const isOpen = $('.full-menu-wrap').prev('button').hasClass('on');

        if (!isOpen) return false;

        const $menu = $('.full-menu-depth01-list'),
            num = $menu.offset().top;

        let HEIGHT = $(window).height(),

            padding = $('.full-menu-box.view-pc').css('padding-top');

        padding = padding.replace(/[^0-9]/g, "")
        HEIGHT = HEIGHT - num - padding;

        $menu.css('max-height', HEIGHT + 'px');
    }

    $(window).resize(function () {
        changeFullMenuHeight();
    });

    /* 띠배너 SPAN 구분 처리  */
    {
        const $el = $('.main-point-banner'),
            $txt = $el.find('.txt');

        if ($el.length > 0) {
            const str = $txt.html(),
                BACK = str.split('<br>');

            if (BACK[1] != undefined) {
                $txt.html(`<strong>${BACK[0]} </strong><span>${BACK[1]}</span>`);
            }
        }
    }

    /* 검색 PC, 전체메뉴 PC */
    {
        function menuReset() {
            const isTypeB = $('.type-B').length > 0;

            $('.header-menu-list .search button').removeClass('on');
            $('.search-wrap').hide();

            $('.full-menu-depth01-list').scrollTop(0);
            $('[data-name="menu01"]').trigger('click');

            $('.inp-search').val('');
            $('.inp-search').next('.clearbtn').hide();

            $('.full-menu-mob-depth02-item button').removeClass('on');

            if (isTypeB) {
                $('.full-menu-mob-depth01-list').removeClass('on');
            } else {
                $('.full-menu-mob-depth01-item:first-child > button').trigger('click');
            }
        }

        function openHeaderTool($obj) {
            const $el = $obj.element,
                $btn = $obj.button,
                $close = $obj.closeButton;

            function checkLayer($this, isFullMenuOpen) {
                if ($this.hasClass('on') || isFullMenuOpen) {
                    $el.stop().fadeOut(200);
                    $btn.removeClass('on');
                    $btn.focus();

                    menuReset();

                    uiScriptScrollBlock.clear();

                    return false;
                }

                $this.addClass('on');
                $el.stop().show();
                $el.css('tabindex', '0').focus();

                uiScriptScrollBlock.block();
            }

            $btn.click(function () {
                checkLayer($(this));
                changeFullMenuHeight();
                setStickyTop();
            });

            if (!$close) return false;

            $close.click(function () {

                checkLayer($(this), true);
            });
        }

        const $searchWrapObj = {
            element: $('.search-wrap'),
            button: $('.header-menu-list .search > button'),
            closeButton: null,
        }

        const $fullMenuWrapObj = {
            element: $('.full-menu-wrap'),
            button: $('.header-menu-list .menu > button'),
            closeButton: $('.full-menu-close-btn'),
        }

        openHeaderTool($searchWrapObj);
        openHeaderTool($fullMenuWrapObj);
    }

    /* Type B Mobile 전체메뉴 Sticky 위치 설정 */

    function setStickyTop() {
        const isTypeB = $('.layout-wrap.type-B').length > 0;

        if (!isTypeB) return;

        const $menuList = $('.full-menu-mob-list-menu-box');
        const TOP = $('.full-menu-head').outerHeight();

        $menuList.css('top', TOP + 'px');
    }

    /* Clear Button */

    {
        let $el = $('.inp-search').add('.basic-inp'),
            $btn = $('.clearbtn');

        function showBtn($btn) {
            if ($btn.css("display") === "block") return false;

            const WIDTH = $btn.css('height');

            $btn.stop().show().animate({
                minWidth: WIDTH,
                maxWidth: WIDTH,
                opacity: 1,
            }, 150);
        }

        function hideBtn($btn) {
            if ($btn.css("display") === "none") return false;

            const WIDTH = $btn.css('height');

            $btn.stop().animate({
                minWidth: 0,
                maxWidth: 0,
                opacity: 0,
            }, 150);

            setTimeout(() => {
                $btn.hide()
            }, 150);
        }

        $el.on('keyup', function () {

            const $this = $(this),
                txt = $this.val();

            $btn = $this.siblings('.clearbtn');

            txt !== '' ? showBtn($btn) : hideBtn($btn);
        });

        $btn.on('click', function () {

            const $this = $(this);
            $el = $this.siblings('input');

            $el.val('');
            $el.focus();
            hideBtn($this);
        });

    }

    /*========== BUTTON EVENT ==========*/
    /**
     * @author 이예빈
     * @since 2024. 03. 22
     * @version 1.0.0
     * @summary 버튼 이벤트
     * @description 버튼에 ON/OFF 관련 이벤트를 추가합니다.
     */

    const Button = {
        selected: function (obj) {
            obj.btn.addClass('on')
                .attr('title', obj.type ? obj.type + '닫기' : '선택됨');
        },
        unselected: function (obj) {
            obj.allBtn.removeClass('on')
                .removeAttr('title');

            if (obj.type) obj.allBtn.attr('title', obj.type + '열기');
        },
        control: function (obj) {
            const isOn = obj.btn.hasClass('on');
            this.unselected(obj);
            this.selected(obj);

            if (obj.isToggle && isOn) this.unselected(obj);
        }
    };

    /* 전체메뉴 버튼 ON OFF */

    $('.full-menu-btn').on('click', function () {

        const $this = $(this);
        const obj = {
            btn: $this,
            allBtn: $('.full-menu-btn'),
            name: $this.data('name'),
        };

        document.querySelector(`[data-target=${obj.name}]`).scrollIntoView({ behavior: 'smooth' });

        Button.control(obj);
    });

    /* 모바일 GNB 버튼 depth01 ON OFF */

    $(':not(.type-B) .full-menu-mob-depth01-item > button').on('click', function () {
        const $this = $(this);
        const obj = {
            btn: $this,
            allBtn: $('.full-menu-mob-depth01-item > button'),
        };

        Button.control(obj);
    });

    /* 모바일 GNB 버튼 depth02 ON OFF */

    $('.full-menu-mob-depth02-item > button').on('click', function () {

        const $this = $(this);
        const obj = {
            btn: $this,
            allBtn: $('.full-menu-mob-depth02-item > button'),
            isToggle: true,
        };

        Button.control(obj);
    });

    /* 추천상품 버튼 ON OFF */

    $('.main-product-menu-btn').on('click', function () {

        const $this = $(this);
        const obj = {
            btn: $this,

            allBtn: $('.main-product-menu-btn'),
        };

        Button.control(obj);
    });

    /* 브레드크럼 버튼 ON OFF */

    $('.breadcrumb-select').on('click', function () {

        const $this = $(this);
        const obj = {
            btn: $this,

            allBtn: $('.breadcrumb-select'),
            isToggle: true,
            type: '목록',
        };

        Button.control(obj);
    });

    /* FOOTER SELECT 버튼 */

    $('.footer-select-btn').on('click', function () {

        const $this = $(this);
        const obj = {
            btn: $this,
            allBtn: $this,
            isToggle: true,
            type: '목록',
        };

        Button.control(obj);

        function bgClickOff() {
            $('html').one('click', function (e) {

                const isSelect = Boolean($(e.target).closest('.footer-select-box').length);

                if (!isSelect) {
                    Button.unselected(obj);
                } else {
                    bgClickOff();
                }
            });
        }

        bgClickOff();
    });

    /* 즉시이체 펼쳐보기 / 접기 버튼 */

    {
        const $wrap = $('.basic-frame');
        const moreBtn = '.card-more-btn';

        $wrap.on('click', moreBtn, function () {
            const $this = $(this);
            const $list = $this.prev('.card-list');
            const isOpened = JSON.parse($this.attr('aria-pressed'));

            if (isOpened) {
                $list.removeClass('on');
                $this.attr('aria-pressed', false);
                $this.text('펼쳐보기');
            } else {
                $list.addClass('on');
                $this.attr('aria-pressed', true);
                $this.text('접기');
            }
        });
    }

    /* TYPE-B FULL MENU 스크롤 */
    /*========== TYPE-B FULL MENU SCROLL ==========*/
    /**
     * @author 이예빈
     * @since 2024. 03. 26
     * @version 1.0.0
     * @summary 스크롤 이벤트
     * @description B타입 메인화면 모바일 메뉴에 스크롤 이동 관련 이벤트를 추가합니다.
     */

    (function () {
        const isTypeB = $('.layout-wrap.type-B').length > 0,
            scrollBox = $('.full-menu-mob-box').not('#typeAmenu'),
            menuBtn = $('.full-menu-mob-depth01-item button'),
            menuBtnWrap = $('.full-menu-mob-depth01-list'),
            menuOpenBtn = $('.full-menu-open-btn'),
            titleList = $('.full-menu-mob-depth01-title'),
            speed = 300;

        if (!isTypeB) return false;

        let positionList = [];
        let padding = menuBtnWrap.offset().top + menuBtnWrap.outerHeight() + 100;
        let isScrolling = false;

        // 각 메뉴별 위치값 얻기
        function getPositions() {
            titleList.each(function (index, item) {
                positionList.push($(item).offset().top - padding);
            });
        }

        // 클릭한 상단 메뉴를 가로 스크롤 중앙으로 이동
        function centeredScroll(btn) {
            const obj = {
                btn: $(btn),
                allBtn: menuBtn,
            };

            btn.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
            Button.control(obj);
        }

        // 스크롤 이동
        function goToScroll(num) {
            scrollBox.animate({
                scrollTop: positionList[num]
            }, speed)
        }

        // 최하단인지 확인
        function checkBottom() {
            const scrollTop = scrollBox.scrollTop(),
                innerHeight = scrollBox.innerHeight(),
                scrollHeight = scrollBox.prop('scrollHeight');
            return scrollHeight === scrollTop + innerHeight;
        }

        // 상단메뉴 아래로 펼치기
        menuOpenBtn.on('click', function () {
            menuBtnWrap.toggleClass('on');
            padding = menuBtnWrap.offset().top + menuBtnWrap.outerHeight() + 100;
        });

        function debounce(fn) {
            var cancelID = null;
            return (args) => {
                clearTimeout(cancelID);
                cancelID = setTimeout(fn.bind(this, args), 200);
            }
        }

        menuBtn.on('click', function () {
            const num = $(this).parent().index();
            isScrolling = true;
            centeredScroll(this);
            setTimeout(() => {
                goToScroll(num);

                setTimeout(() => {
                    isScrolling = false;
                }, speed + speed);
            }, 200);
        });

        scrollBox.on('scroll', debounce(function (e) {
            if (isScrolling) return false;

            if (checkBottom()) {
                const lastBtn = menuBtn.last()[0];
                centeredScroll(lastBtn);
                return;
            }

            const scrollTop = scrollBox.scrollTop();
            let moveBtn;
            titleList.each(function (index, item) {
                let isDown = positionList[index] <= scrollTop;
                if (isDown) moveBtn = menuBtn[index];
                if (index === 0 && positionList[0] >= scrollTop) {
                    moveBtn = menuBtn[0];
                    return false;
                }
            });
            centeredScroll(moveBtn);
        }));

        $('.type-B .header-menu-list .menu > button').on('click', function () {
            getPositions();
        });
    }());

    const isMain = $('.main-wrap').length > 0,
        isTypeB = $('.layout-wrap.type-B').length > 0;

    if (isTypeB && isMain) {
        $('.typeAcont').remove();
        // $('#typeAmenu').remove();
    } else {
        $('.typeBcont').remove();
        // $('#typeBmenu').remove();
    }

    /*========== ADD CLASS RADOMLY ==========*/
    /**
     * @author 이예빈
     * @since 2024. 03. 22
     * @version 1.1.0
     * @summary 슬라이드 그룹에 속한 각 슬라이드 요소에 랜덤한 클래스를 할당합니다.
     * @description
     * 이 함수는 사용자가 지정한 슬라이드 그룹 선택자에 해당하는 각 슬라이드 그룹에 대해 실행됩니다.
     * 각 슬라이드 그룹 내의 슬라이드 요소들은 순서대로 문자열과 랜덤한 번호를 조합하여 class 이름을 생성합니다.
     * 이때, 번호는 1부터 'maxNum' 까지의 순서로 생성되며, 이를 섞어서 중복되지 않는 랜덤한 순서로 할당합니다.
     *
     * 만약 사용자가 'maxNum'을 지정하지 않았을 경우, 기본값으로 3이 사용됩니다.
     * 만약 사용자가 'el'을 입력하지 않았을 경우, 콘솔에 오류 메시지가 표시되며 함수가 실행되지 않습니다.
     *
     * ignore 변수가 true 값일 경우, 배열을 랜덤하게 섞지 않습니다.
     */

    {
        const productObj = {
            el: $('.main-product'),
            maxNum: 6,
        }
        const bannerObj = {
            el: $('.type-B .main-banner-item'),
            maxNum: 6,
            ignore: true,
        }

        /**
         * 배열을 랜덤하게 섞어서 반환
         * @param {Array} Array - 섞을 배열
         * @param {Array} - 랜덤하게 섞인 배열
         */

        const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

        /**
         * 주어진 요소에 랜덤한 클래스를 할당
         * @param {string} selector - 클래스가 추가될 요소를 선택하는 css 선택자
         * @param {number} maxNum - 할당될 클래스의 최대 개수(기본값: 3)
         * @param {string} format - 클래스명의 포맷을 지정하는 문자열(기본값: type)
         */

        const addRandomClasses = ({ el, maxNum = 99, format = 'type', ignore = false }) => {
            // 선택자가 유효한 경우에만 실행
            if (!el) {
                console.error('선택자가 필요합니다');
                return;
            }

            const $el = $(el);

            // 중복되지 않은 숫자 배열 생성
            let numberArray = Array.from({ length: maxNum }, (_, index) => index + 1);

            // 조건에 해당하는 경우 배열을 랜덤하게 섞음
            if (!ignore) numberArray = shuffleArray(numberArray);

            // 선택된 요소에 클래스를 추가
            $el.each(function (index) {
                const classIndex = index % maxNum;
                const paddedClassNumber = numberArray[classIndex].toString().padStart(2, 0);
                const className = `${format}${paddedClassNumber}`;
                $(this).addClass(className);
            });
        }

        addRandomClasses(productObj);
        addRandomClasses(bannerObj);
    }

    /*========== SLIDE ==========*/
    /**
     * @author 이예빈
     * @since 2024. 04. 01
     * @version 1.0.0
     * @summary 슬라이드 이벤트
     * @description 메인 화면 슬라이드 관련 이벤트를 정의합니다.
     */

    {
        function createSlideEvent() {
            // 클래스 명
            let data = {
                bullet: '.swiper-pagination-bullet',
                bulletActive: '.swiper-pagination-bullet-active',
                playBtn: '.swiper-button-play',
                stopBtn: '.swiper-button-pause',
                prevBtn: '.swiper-button-prev',
                nextBtn: '.swiper-button-next',
                paging: '.swiper-pagination',
            };

            return {
                data: data,
                computed: {
                    // 슬라이드가 일정 개수보다 많은지 계산
                    hasEnoughSlides: function (el, min) {
                        const len = $(el).children('li').length;
                        return len > min;
                    },
                },
                methods: {
                    buttonClickHandler: function (el, swiper) {
                        const $playBtn = $(el).find(data.playBtn),
                            $stopBtn = $(el).find(data.stopBtn),
                            $prevBtn = $(el).find(data.prevBtn),
                            $nextBtn = $(el).find(data.nextBtn),
                            $bullet = $(el).find(data.bullet);

                        $playBtn.add($stopBtn).on('click', function () {
                            $(this).siblings('button').attr('aria-pressed', true);
                            $(this).removeAttr('aria-pressed');

                            if ($(this).hasClass(data.playBtn.replace('.', ''))) {
                                swiper.autoplay.start();
                            } else {
                                swiper.autoplay.stop();
                            }
                        });

                        $bullet.add($prevBtn).add($nextBtn).on('click', function () {
                            $stopBtn.length > 0 ? $stopBtn.trigger('click') : swiper.autoplay.stop();
                        });
                    },
                    updateTitle: function (el) {
                        $(el).find(data.bullet).removeAttr('title');
                        $(el).find(data.bulletActive).attr('title', '선택됨');
                    },
                },
                utility: {
                    buttonTemplate: function (index, className) {
                        return `
              <button type="button" class="${className}">
                <span class="tts">${index + 1}번째 슬라이드</span>
              </button>`;
                    },
                    ifOneSlide: function (el) {
                        $(el).addClass('one');
                        $(el).find('.swiper-controller').remove();
                        $(el).find('.swiper-btn-wrap').remove();
                    },
                },
            }
        }

        const Slide = createSlideEvent();

        /* MAIN BANNER SLIDE */
        {
            const el = isTypeB ? '.main-banner-box' : '.main-banner-wrap',
                isSlide = Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 1),
                isSlideCountOver = Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 3);

            let slideCount = isTypeB ? 3 : 1,
                isCentered = isTypeB,
                isTwoSlides = false,
                isFade = true;

            if (!isSlide) {
                Slide.utility.ifOneSlide(el);
            } else {
                if (isTypeB) {
                    isFade = false;

                    if (!isSlideCountOver) {
                        $(el).find('.swiper-wrapper').addClass('less');
                        isCentered = false;

                        if (!Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 2)) {
                            $(el).addClass('two');
                            slideCount = 2;
                            isTwoSlides = true;
                        } else {
                            slideCount = 1;
                            isFade = true;
                        }
                    }
                }

                new Swiper(el, {
                    autoplay: {
                        delay: 3000,
                    },
                    speed: isTypeB ? 1000 : 500,
                    // spaceBetween: 20,
                    // slidesPerView: slideCount,
                    navigation: {
                        prevEl: $(el).find(Slide.data.prevBtn)[0],
                        nextEl: $(el).find(Slide.data.nextBtn)[0],
                    },
                    breakpoints: {
                        0: {
                            spaceBetween: isTypeB ? 20 : 0,
                            slidesPerView: 1,
                            autoplay: {
                                enabled: true,
                                delay: 3000,
                            },
                        },
                        1200: {
                            spaceBetween: isTypeB ? 20 : 0,
                            slidesPerView: slideCount,
                            // autoplay: {
                            //   enabled: !isTwoSlides,
                            //   delay: 3000,
                            // },
                        },
                    },
                    effect: isFade ? 'fade' : false,
                    transition: {
                        fade: {
                            crossFade: isFade,
                        },
                    },
                    centeredSlides: isCentered,
                    observer: true,
                    observerParents: true,
                    loop: true,
                    watchOverflow: true,
                    parallax: true,
                    pagination: {
                        el: $(el).find(Slide.data.paging)[0],
                        type: 'bullets',
                        clickable: true,
                        renderBullet: function (index, className) {
                            return Slide.utility.buttonTemplate(index, className);
                        },
                    },
                    a11y: {
                        slideLabelMessage: '{{index}} / {{slidesLength}}',
                    },
                    on: {
                        init: function () {
                            Slide.methods.buttonClickHandler(el, this);

                            if (isTypeB && !isSlideCountOver) {
                                $('.main-banner-list.less .swiper-slide').css({
                                    'transition-property': 'left, width, min-width, max-width, opacity',
                                    'transition-timing-function': 'ease',
                                });
                            }
                        },
                        slideChange: function () {
                            Slide.methods.updateTitle(el);
                        },
                        resize: function () {
                            if (isTwoSlides) {
                                $(window).width() < 1200 ? this.autoplay.start() : this.autoplay.stop();
                            }
                        }
                    },
                });
            }
        }

        /* PRODUCT SLIDE */
        {
            const el = '.main-product-wrap',
                isSlide = Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 1),
                isSlideCountOver = Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 2);

            if (!isSlideCountOver) {
                $(el).addClass('less');
            }

            if (!isSlide) {
                Slide.utility.ifOneSlide(el);
            } else {
                new Swiper(el, {
                    // autoplay: {
                    //   delay: 3000,
                    // },
                    speed: 1000,
                    spaceBetween: 20,
                    slidesPerView: 2,
                    breakpoints: {
                        0: {
                            spaceBetween: 0,
                            slidesPerView: 1,
                        },
                        768: {
                            spaceBetween: 20,
                            slidesPerView: 2,
                        },
                    },
                    observer: true,
                    observerParents: true,
                    loop: true,
                    watchOverflow: true,
                    navigation: {
                        prevEl: $(el).find(Slide.data.prevBtn)[0],
                        nextEl: $(el).find(Slide.data.nextBtn)[0],
                    },
                    a11y: {
                        slideLabelMessage: '{{index}} / {{slidesLength}}',
                    },
                    on: {
                        init: function () {
                            Slide.methods.buttonClickHandler(el, this);
                        },
                        slideChange: function () {
                            const currentIndex = this.realIndex + 1;
                            const totalIndex = this.slides.length;

                            $(el).find('.swiper-current').html(`<span>${currentIndex}</span> / ${totalIndex}`);
                            Slide.methods.updateTitle(el);
                        },
                    },
                });
            }
        }

        /* SUB BANNER SLIDE */
        {
            const el = isTypeB ? '.main-sub-banner-box' : '.main-notice-right',
                isSlide = Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 1);

            if (!isSlide) {
                Slide.utility.ifOneSlide(el);
            } else {

                new Swiper(el, {
                    autoplay: {
                        delay: 3000,
                    },
                    speed: 1000,
                    spaceBetween: 0,
                    slidesPerView: 1,
                    observer: true,
                    observerParents: true,
                    loop: true,
                    watchOverflow: true,
                    navigation: {
                        prevEl: $(el).find(Slide.data.prevBtn)[0],
                        nextEl: $(el).find(Slide.data.nextBtn)[0],
                    },
                    pagination: {
                        el: $(el).find(Slide.data.paging)[0],
                        type: 'bullets',
                        clickable: true,
                        renderBullet: function (index, className) {
                            return Slide.utility.buttonTemplate(index, className);
                        },
                    },
                    a11y: {
                        slideLabelMessage: '{{index}} / {{slidesLength}}',
                    },
                    on: {
                        init: function () {
                            Slide.methods.buttonClickHandler(el, this);
                        },
                        slideChange: function () {
                            Slide.methods.updateTitle(el);
                        },
                    },
                });
            }
        }

        /* B타입 공지 밴드 */
        {
            const el = '.main-notice-band-wrap',
                isSlide = Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 1);

            if (!isSlide) {
                Slide.utility.ifOneSlide(el);
            } else {
                new Swiper(el, {
                    autoplay: {
                        delay: 3000,
                    },
                    speed: 1000,
                    direction: 'vertical',
                    breakpoints: {
                        0: {
                            direction: 'horizontal',
                        },
                        768: {
                            direction: 'vertical',
                        },
                    },
                    spaceBetween: 0,
                    slidesPerView: 1,
                    autoHeight: true,
                    observer: true,
                    observerParents: true,
                    loop: true,
                    watchOverflow: true,
                    navigation: {
                        prevEl: $(el).find(Slide.data.prevBtn)[0],
                        nextEl: $(el).find(Slide.data.nextBtn)[0],
                    },
                    a11y: {
                        slideLabelMessage: '{{index}} / {{slidesLength}}',
                    },
                    on: {
                        init: function () {
                            Slide.methods.buttonClickHandler(el, this);
                        },
                        slideChange: function () {
                            Slide.methods.updateTitle(el);
                        },
                    },
                });
            }
        }

        /* 팝업 Slide */
        {
            const el = '.dim-contents.swiper',
                isSlide = Slide.computed.hasEnoughSlides($(el).find('.swiper-wrapper'), 1);

            if (!isSlide) {
                Slide.utility.ifOneSlide(el);
            } else {
                new Swiper(el, {
                    autoplay: {
                        delay: 3000,
                    },
                    speed: 1000,
                    // breakpoints: {
                    //   0: {
                    //   },
                    //   768: {
                    //   },
                    // },
                    spaceBetween: 0,
                    slidesPerView: 1,
                    observer: true,
                    observerParents: true,
                    loop: true,
                    watchOverflow: true,
                    navigation: {
                        prevEl: $(el).find(Slide.data.prevBtn)[0],
                        nextEl: $(el).find(Slide.data.nextBtn)[0],
                    },
                    pagination: {
                        el: $(el).find(Slide.data.paging)[0],
                        type: 'bullets',
                        clickable: true,
                        renderBullet: function (index, className) {
                            return Slide.utility.buttonTemplate(index, className);
                        },
                    },
                    a11y: {
                        slideLabelMessage: '{{index}} / {{slidesLength}}',
                    },
                    on: {
                        init: function () {
                            Slide.methods.buttonClickHandler(el, this);
                        },
                        slideChange: function () {
                            Slide.methods.updateTitle(el);
                        },
                    },
                });
            }
        }

        $(Slide.data.bulletActive).attr('title', '선택됨');
    }

    /*========== TAB EVENT ==========*/
    /**
     * @author 이예빈
     * @since 2024. 03. 28
     * @version 1.0.0
     * @summary 탭 관련 함수입니다.
     * @description
     * 탭 버튼을 클릭하면 탭 버튼 및 컨텐츠의 ON/OFF 관련 이벤트를 컨트롤합니다.
     *
     * 탭 버튼 부모 요소 : role="tablist"
     * 탭 버튼 : id="tabButton1" / role="tab" / aria-controls="tabPanel1" / aria-selected="true"
     * 탭 컨텐츠 : id="tabPanel1" / role="tabpanel" / aria-labelledby="tabButton1" / tabindex="0"
     */

    function initTab(tabButtons) {
        tabButtons.each(function (index) {
            const tabButton = $(this);

            tabButton.on("click", () => activeTab(tabButton));

            tabButton.on("keydown", function (e) {
                const keyCode = e.keyCode;

                if (keyCode === 37 || keyCode === 39) {
                    e.preventDefault();

                    const nextTab = keyCode === 37 ? tabButton.prev() : tabButton.next();

                    if (nextTab.length) {
                        activeTab(nextTab);
                        nextTab.focus();
                    }
                }
            });

            if (tabButton.attr('aria-selected') === "true") activeTab(tabButton);
        });

        function activeTab(tabButton) {
            tabButtons.attr("aria-selected", false);
            tabButton.attr("aria-selected", true);

            const tabPanel = $("#" + tabButton.attr("aria-controls"));

            tabPanel.siblings('[role="tabpanel"]').hide();
            tabPanel.show();
            uiScriptContentsZoom.update();
        }
    }

    initTab($('[role="tablist"] [role="tab"]'));

    window.initTab = initTab;

    /*========== ACCODIAN EVENT ==========*/
    /**
     * @author 이예빈
     * @since 2024. 04. 02
     * @version 1.0.2
     * @summary 아코디언 관련 함수입니다.
     * @description
     * 아코디언 버튼을 클릭하면 아코디언의 관련 이벤트를 컨트롤합니다.
     *
     * 만약 아코디언 그룹과 연결되어 아코디언을 작동하는 버튼 그룹이 별도로 존재한다면, 아코디언은 하나씩만 열려있는 상태로 유지됩니다.
     * 그리고 아코디언을 아코디언 요소에 포함된 버튼과 아코디언 외부의 버튼으로 동시에 관리할 수 있으며, 이 두개의 요소는 연동됩니다.
     *
     * Case 1: 아코디언 단독 사용
     * 아코디언 버튼을 매개변수로 전달
     * (기본: accoBtn)
     *
     * 아코디언 버튼 : id="btnId" aria-expanded="true" / aria-controls="contentId"
     * 아코디언 컨텐츠 : id="contentId" / aria-labelledby="btnId"
     *
     * Case 2: 아코디언 그룹 사용(ex: 전체계좌조회)
     * 아코디언 요소를 모두 감싼 wrap을 매개변수로 전달 - 아코디언과 아코디언에 사용하는 버튼 모두 포함된 엘리먼트
     * (기본: accoWrap)
     *
     */

    function hideAccordion($el, selector, id, type, type2) {
        const $content = $("#" + id);

        $el.attr(type, "false");
        selector.attr(type2, "false");
        $content.stop().slideUp(300);

        setTimeout(() => {
            uiScriptContentsZoom.update();
        }, 300);
    }

    function toggleExpanded($el) {
        const currentValue = $el.attr("aria-expanded");
        const newValue = currentValue === "true" ? "false" : "true";
        const ctrl = $el.attr("aria-controls");
        const $content = $('#' + ctrl);

        if (currentValue === "true") {
            $content.stop().slideUp(300);
        } else {
            $content.stop().slideDown(300);
        }
        $el.attr("aria-expanded", newValue);

        setTimeout(() => {
            uiScriptContentsZoom.update();
        }, 300);
    }

    function initAccordion($el) {
        const ctrl = "aria-controls";
        const exp = "aria-expanded";
        const press = "aria-pressed";
        const $labelled = $el.find("[aria-labelledby]");

        function showAccordion(id) {
            const $content = $("#" + id);
            const padding = 120;
            const speed = 500;
            const top = $content.closest(`ul:not(#${id})`).offset().top - padding;

            $labelled.stop().slideUp(300);
            $content.stop().slideDown(300);

            /* 240828 요청으로 스크롤링 삭제처리 */
            // $('html, body').animate({
            //   scrollTop: top
            // }, speed);

            setTimeout(() => {
                uiScriptContentsZoom.update();
            }, 300);

            // setTimeout(() => {
            //   $content.attr("tabindex", 0).focus();
            // }, 300);
        }

        if ($el.is("button")) {
            $el.on('click', function () {
                toggleExpanded($(this));
            });
        } else {
            const $exp = $el.find(`[${ctrl}][${exp}]`);
            const $press = $el.find(`[${ctrl}][${press}]`);

            $exp.each(function () {
                const id = $(this).attr(ctrl);

                $(this).on("click", function () {
                    const selector = $(`[${ctrl}=${id}][${press}]`);

                    if ($(this).attr(exp) === "true") {
                        hideAccordion($(this), selector, id, exp, press);

                        return false;
                    }

                    showAccordion(id);

                    $press.attr(press, "false");
                    $exp.attr(exp, "false");
                    selector.attr(press, "true");
                    $(this).attr(exp, "true");
                });
            });

            $press.each(function () {
                const id = $(this).attr(ctrl);

                $(this).on("click", function () {
                    const selector = $(`[${ctrl}=${id}][${exp}]`);

                    if ($(this).attr(press) === "true") {
                        hideAccordion($(this), selector, id, press, exp);

                        return false;
                    }

                    showAccordion(id);

                    $exp.attr(exp, "false");
                    $press.attr(press, "false");
                    selector.attr(exp, "true");
                    $(this).attr(press, "true");
                });
            });
        }
    }

    $('.accoWrap').each(function () {
        initAccordion($(this));
    });

    $('.accoBtn').each(function () {
        initAccordion($(this));
    });

    window.initAccordion = initAccordion;

    /*========== Tooltip EVENT ==========*/
    /**
     * @author 이예빈
     * @since 2024. 04. 19
     * @version 1.0.1
     * @summary 툴팁 관련 함수입니다.
     * @description
     *
     * Case 1: Hover시 나타나는 툴팁 - 닫기 버튼 없음
     *
     * 툴팁 버튼 : aria-describedby="tooltipBox"
     * 툴팁 내용 : id="tooltipBox" / role="tooltip"
     *
     * Case 2: 버튼 클릭시 나타나는 툴팁(ex.메뉴) - 닫기 버튼 있음
     * 기본형에서 tooltip-wrap에 type-click 클래스 추가
     * 닫기 버튼에 close 클래스 추가
     */

    {
        const tooltipClickWrap = '.tooltip-wrap.type-click';
        const tooltipBtn = '.tooltip-wrap > button';
        const tooltipAllBox = '.tooltip-wrap.type-click .tooltip-box';
        const tooltipClose = '.tooltip-box .close';

        function hideTooltip($tooltip) {
            $(tooltipAllBox).hide();
            $(tooltipBtn).attr('aria-pressed', 'false');
            $tooltip.prev().focus();
        }

        $('.tooltipWrap').on('click', tooltipBtn, function () {
            const $tooltip = $(this).next();
            const isPressed = $(this).attr('aria-pressed') === 'true';

            if (isPressed) {
                hideTooltip($tooltip);

                return false;
            }

            $(tooltipBtn).attr('aria-pressed', 'false');
            $(this).attr('aria-pressed', 'true');

            $(tooltipAllBox).hide();
            $tooltip.show().focus();

            function bgClickEvent() {
                $('html').one('click', function (e) {
                    const isTooltip = Boolean($(e.target).closest(tooltipClickWrap).length);

                    isTooltip ? bgClickEvent() : hideTooltip($tooltip);
                });
            }
            bgClickEvent();

            $(tooltipClickWrap).one('click', tooltipClose, function () {
                const $tooltip = $(this).parent();

                hideTooltip($tooltip);
            });
        });
    }

    /*========== Select Button EVENT ==========*/
    /**
     * @author 이예빈
     * @since 2024. 05. 01
     * @version 1.0.1
     * @summary Select 버튼 관련 함수입니다.
     * @description
     *
     * [필수 속성]
     *
     * 이벤트 적용할 요소의 부모 요소에 selectWrap 클래스 추가(최초 DOM 생성 시 존재하는 요소여야함)
     *
     * 셀렉트 전체 : class="select-wrap"
     * 셀렉트 버튼 : id="selectBtn" aria-controls="selectList" aria-pressed="false"
     * 셀렉트 목록 : id="selectList" tabindex="0" aria-labelledby="selectBtn"
     *
     * id와 aria 속성으로 버튼과 목록 요소 연결
     *
     */

    {
        function initSelect($el) {
            const selectWrap = '.select-wrap';
            const selectBtn = '.select-wrap > [aria-controls]';
            const selectList = '.select-wrap > [aria-labelledby]';
            const selectItemBtn = '.select-wrap > [aria-labelledby] button';
            const speed = 200;

            function hideSelect($list) {
                $(selectList).stop().slideUp(speed);
                $(selectBtn).attr('aria-pressed', 'false');
                $list.prev().focus();
            }

            function showSelect() {
                const $list = $(this).next();
                const isPressed = $(this).attr('aria-pressed') === 'true';

                if (isPressed) {
                    hideSelect($list);

                    return false;
                }

                $(selectBtn).attr('aria-pressed', 'false');
                $(this).attr('aria-pressed', 'true');

                $(selectList).hide();
                $list.stop().slideDown(speed).focus();
                $list.scrollTop(0);

                $list.find('button').on('click', function () {
                    const $list = $(this).parents(selectList);
                    hideSelect($list);
                });

                function bgClickEvent() {
                    $('html').one('click', function (e) {
                        const isSelect = Boolean($(e.target).closest(selectWrap).length);

                        isSelect ? bgClickEvent() : hideSelect($list);
                    });
                }
                bgClickEvent();
            }

            $el.on('click', '[aria-controls]', showSelect);
        }

        $('.selectWrap').each(function () {
            initSelect($(this));
        });

        window.initSelect = initSelect;
    }

    /*========== Toast Popup EVENT ==========*/
    /**
     * @author 이예빈
     * @since 2024. 04. 22
     * @version 1.0.0
     * @summary 토스트 팝업 관련 함수입니다.
     * @description
     * 토스트 팝업 실행 버튼에 toastBtn 클래스를 추가
     * 버튼을 감싼 부모 요소에 toastBtnWrap 클래스를 추가
     * data-msg 로 메시지 입력
     * data-speed 로 진행시간 입력
     */

    {
        const cls = '.toastBtn';
        let removeToast;

        function toastTemplate(msg) {
            return `
        <div class="toast-popup">
          <p class="txt">${msg}</p>
        </div>
      `
        }

        $('.toastBtnWrap').on('click', cls, function () {
            const msg = $(this).data('msg');
            const el = toastTemplate(msg);

            let speed = $(this).data('speed');

            if (speed === undefined) speed = 2500;

            clearInterval(removeToast);
            $('.toast-popup').remove();
            $('html').append(el);

            $('.toast-popup').css('animation-duration', speed + 'ms');

            removeToast = setTimeout(() => {
                $('.toast-popup').remove();
            }, speed);
        });
    }
});

/* 테이블 로우 삭제 버튼 */

function deleteTableRow($btn) {
    const $td = $btn.closest('td').siblings().add($btn.closest('td'));
    const $tr = $btn.closest('tr');

    $td
        .animate({
            'padding-top': 0,
            'padding-bottom': 0,
        })
        .wrapInner('<div/>)').children()
        .slideUp(function () {
            $tr.remove();
        });;

    $tr
        .animate({
            'opacity': 0,
        });
}
