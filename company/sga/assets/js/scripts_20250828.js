$(document).ready(function () {
    userAgentCheck();
    lnbEvt();
    topcont();
    checkAllChecked();
    currentPage();
    //tabf();
    //tabadd();
    TabCls();
    modalUi();
    cont();
    sortable();
    niceSelect();
    datepicker();
    mscrollbar();
    selectoption();
    setopt();
    packet();
    tooltip();
    connectboxlist();
    winpopup();
});

//$('.event_search_bottom').click(function(e) { 
//    $(".bootstrap-datetimepicker-widget").next().trigger("click");    
//});

//반응형 스크립트
$(window).resize(function() {
    if (window.matchMedia('(min-height: 0) and (max-height: 850px)').matches){
        $('.modal .modal_body').addClass('mscrollbar');
        mscrollbar();
    } else if(window.matchMedia('(min-height: 850px)').matches) {
        $('.modal .modal_body.mscrollbar').mCustomScrollbar("destroy");
        if(!($('.modal .modal_body.mscrollbar').length)){
        	mscrollbar();
        }
    }
    if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
        $('.modal.open').css({
            marginLeft : 'auto',
            marginTop : 'auto'
        });
    }
    if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
        var layerHeight = $('.modal.open').outerHeight();
        var layerWidth = $('.modal.open').outerWidth();
        $('.modal').css({
            marginLeft : -layerWidth/2,
            marginTop : -layerHeight/2
        });
    }
    if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
        $('body').css({
            overflow : 'hidden'
        }).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
    if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
        $('body').css({
            overflowX : 'scroll'
        }).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
    if ($('html').hasClass('ie')){
        var headHeight = $('.modal.open .modal_header').outerHeight();
        var bodyHeight = $('.modal.open .modal_body').outerHeight();
        var footerHeight = $('.modal.open .modal_footer').outerHeight();
        var layerHeight = headHeight + bodyHeight + footerHeight;
        if($('.modal').hasClass('dashboard_view')){
            $('.modal.open').css({
                display : 'block',
            });
        }else {
            $('.modal.open').css({
                maxHeight : layerHeight,
                display : 'block',
            });
        }
    }
});

// datepicker type
function datepicker() {
    $(function () {
        $('.datetimepicker').datetimepicker({
            format: 'YYYY-MM-DD',
            //locale: 'ko',
        });
        $('.datetimepicker_day_sec').datetimepicker({
            format: 'YYYY-MM-DD/HH:mm:ss',
            //locale: 'ko',
        });
        $('.datetimepicker_day_min').datetimepicker({
            format: 'YYYY-MM-DD/HH:mm',
            //locale: 'ko',
        });
        $('.datetimepicker_time_only').datetimepicker({
            format: 'LT',
            //locale: 'ko',
        });
        $('.datetimepicker_day_hour').datetimepicker({
            format: 'YYYY-MM-DD/HH시',
            //locale: 'ko',
        });
        $('.datetimepicker_year').datetimepicker({
            //locale: 'ko',
            format: 'YYYY',
            viewMode: 'years',
        });
        $('.datetimepicker_from').datetimepicker({
            format: 'YYYY-MM-DD',
            //locale: 'ko',
        });
        $('.datetimepicker_to').datetimepicker({
            format: 'YYYY-MM-DD',
            //locale: 'ko',
            useCurrent: false, //Important! See issue #1075
        });

        $('.datetimepicker_min_from').datetimepicker({
            format: 'YYYY-MM-DD/HH:mm:ss',
            focusOnShow: false,
            sideBySide: true,
            allowInputToggle: true,
            //locale: 'ko',
        });
        $('.datetimepicker_min_to').datetimepicker({
            format: 'YYYY-MM-DD/HH:mm:ss',
            focusOnShow: false,
            sideBySide: true,
            allowInputToggle: true,
            //locale: 'ko',
            useCurrent: false, //Important! See issue #1075
        });


        $(".datetimepicker_min_from").on("dp.change", function (e) {
            $('.datetimepicker_min_to').data("DateTimePicker").minDate(e.date);
        });
        $(".datetimepicker_min_to").on("dp.change", function (e) {
            $('.datetimepicker_min_from').data("DateTimePicker").maxDate(e.date);
        });


        $(".datetimepicker_from").on("dp.change", function (e) {
            $('.datetimepicker_to').data("DateTimePicker").minDate(e.date);
        });
        $(".datetimepicker_to").on("dp.change", function (e) {
            $('.datetimepicker_from').data("DateTimePicker").maxDate(e.date);
        });

    });
}

// 스크롤 스타일 변경
function mscrollbar() {
    $('textarea').addClass('textarea-scrollbar scrollbar-outer');
    $('.textarea-scrollbar').scrollbar();
    if ($('.mscrollbar').length) {
        $('.mscrollbar').mCustomScrollbar({
            autoExpandScrollbar: "true",
            axis: "yx",
            scrollInertia: 300,
            callbacks: {
                onOverflowX: function () {
//                    $('.dashboard_main').css({paddingRight: '20px'});
//                    $('.sub').css({paddingRight: '20px'});
                    if ($(".sub").parents('section').hasClass('mCS_no_scrollbar')) {
                        $('.sub').css({paddingRight: '7px'});
                    }
                },
                onOverflowY: function () {
                    // $('.sub').css({paddingRight: '17px'});
                    $('.list_box').css({paddingRight: '17px'});
                },
                onOverflowXNone: function () {
                    $('.dashboard_main').css({paddingRight: '7px'});
                    if ($(".sub").parents('section').hasClass('mCS_no_scrollbar')) {
                        $('.sub').css({paddingRight: '7px'});
                    }
                },
                onOverflowYNone: function () {
                    $('.sub').css({paddingRight: 0});
                    $('.list_box').css({paddingRight: 0});
                },
            },
            setTop: 0,
            setLeft: 0,
        });
    }
}

function mscrollbarReset(){
	$('section').mCustomScrollbar("destroy");
	mscrollbar();
}

//채크박스 스크립트
function checkAllChecked() {
    $("input:checkbox[name='all_checkbox']").on('click', function () {
        if (this.checked) {
            $("input:checkbox[name='chart_checkbox_list']").prop("checked", true);
        } else {
            $("input:checkbox[name='chart_checkbox_list']").prop("checked", false);
        }
    });
    $('.list_box li a').on('click', function () {
        var $input = $(this).parents('li').find('input:checkbox[name=\'chart_checkbox_list\']');
        if ($input.is(":checked") == true) {
            $input.prop("checked", false);
        } else {
            $input.prop("checked", true);
        }
    });
}

// 메뉴 스크립트
function lnbEvt() {
    $('.lnb').on('mouseenter', function () {
        $('.lnb').parent().parent().addClass('on');
        $('#sidebarCopyright').css('display', 'block');
    });
    $('.header_box').on('mouseleave', function () {
        $(this).removeClass('on');
        if ($('.lnb > li.has_children > .depth2 > li > a').hasClass('on')) {
            $('.lnb > li.has_children > a').parent().removeClass('active');
            $('.lnb > li.has_children > .depth2 > li > a.on').parents('li.has_children').addClass('active');
        } else {
            $('.lnb > li.has_children > a').parent().removeClass('active');
        }
		$('#sidebarCopyright').css('display', 'none');
    });
    if ($('.lnb > li > ul').hasClass('depth2')) {
        $('.lnb > li > ul').parent().addClass('has_children');
    }
    if ($('.lnb > li > ul > li > ul').hasClass('depth3')) {
        $('.lnb > li > ul > li > ul').parent().addClass('has_children');
    }
    $('.lnb > li.has_children > a').attr('href', '#');
    $('.lnb > li.has_children > a').on('click', function (e) {
        e.preventDefault();
        $(this).parent().siblings('li.has_children').removeClass('active');
        $(this).parent().addClass('active');
        
        /* 
        	mouseenter 없이 페이지 리로딩 시 메뉴가 펼쳐지지 않는 현상
        	클릭 시 무조건 메뉴가 펴지게 끔 해준다
        */
        $('.lnb').parent().parent().addClass('on'); 
    });

}

// 현재 선택된 메뉴 style 적용
function currentPage() {
    var locationUrl = $(location).attr('pathname');
    var dom = $('.lnb li').find('a[href="' + locationUrl + '"]');
    var dom1 = $('.lnb li.has_children').find('a[href="' + locationUrl + '"]');
    $(dom).addClass('on');
    $(dom1).addClass('on');
    $(dom).parents('li').addClass('active');
    $(dom1).parents('li.has_children').addClass('active');
}

// topcontents 스크립트
function topcont() {
    $('.user_info_link').on('click', function (e) {
        e.preventDefault();
        $('.user_info_list').addClass('on');
    });
    $('.top_dashboard_link').on('click', function (e) {
        e.preventDefault();
        if ($('.top_dashboard').hasClass('disabled')) {
            $('.top_dashboard_list').removeClass('on');
        } else {
            $('.top_dashboard_list').addClass('on');
        }
    });
    $('html').click(function (e) {
        if (!$('.user_info_link').has(e.target).length) {
            $('.user_info_list').removeClass('on');
        }
        if (!$('.top_dashboard').has(e.target).length) {
            $('.top_dashboard_list').removeClass('on');
        }
        if (!$('.event_search_top').has(e.target).length) {
			$('.bootstrap-datetimepicker-widget').next().trigger('click');  
   		}
    });
}

// tab동작 스크립트
function tabf() {
    var $btn_tab = $('.tab_lst li').find('.tab_link');
    $btn_tab.on('click', function (e) {
        e.preventDefault();
        var contTop = $('.tab_container').offset();
        $('.newmodal_body').scrollTop(contTop);
        var $this = $(this),
            $thisrel = $this.parent().attr('value'); // tab_lst li :: rel
        $thisClass = $('.' + $thisrel); // tab_cont :: class
        target = $thisClass.parent('.tab_container').attr('id'); // tab_container :: id

        $('#' + target).find('.tab_cont').removeClass('open');
        $('#' + target + ' .' + $thisrel).addClass('open');
        $this.parent().addClass('open modalLoad').siblings().removeClass('open modalLoad'); // tab_lst li :: on
        $this.parent().siblings().attr("rel", "");
        if ($(".tab_lst li").hasClass('open')) {
            $(".tab_lst li.open").addClass('modalLoad').attr("rel", "tab_edit_modal");
        }
        $('.mscrollbar').mCustomScrollbar("scrollTo", 'left', 0);
    });
    $(document).on("dblclick", ".dashboard_main .tab_lst li.open.modalLoad", function (e) {
        e.preventDefault();
        var $self = $(this);
        var $thisrel = $self.attr('rel');
        var $target = $('#' + $thisrel);

        // open and focusin
        $target.attr('tabindex', '0').fadeIn(250).focus();
        // $target.css({ display: 'table' });
        $target.addClass('open');

        // create background
        createDim();

        if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches) {
            $('.modal.open').css({
                marginLeft: 'auto',
                marginTop: 'auto',
            });
        }
        if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches) {
            var layerHeight = $('.modal.open').outerHeight();
            var layerWidth = $('.modal.open').outerWidth();
            $('.modal').css({
                marginLeft: -layerWidth / 2,
                marginTop: -layerHeight / 2,
            });
        }

        // keydown focus repeat
        $target.find(".close").on('keydown', function (e) {
            if (e.which == '9') {
                $target.attr('tabindex', '0').focus();
            }
        });

        // close and focusout
        $target.find(".close").on('click', function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            removeDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;
            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $target.find(".modalLoad").on('click', function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            $self.focus();
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $(document).on("keyup", function (e) {
            if (e.which == '27') {
                $target.fadeOut(250);
                removeDim();
                $self.focus();
                $target.attr('class', 'modal');
            }
        });

        $target.parents('html body').find(".dim").click(function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            removeDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });
        if ($('html').hasClass('ie')) {
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if ($('.modal').hasClass('open')) {
                $('.modal.open').css({
                    height: layerHeight,
                    display: 'block',
                });
            }
            if ($('.modal.open').hasClass('dashboard_view')) {
                $('.modal.open').css({
                    height: 'auto',
                    display: 'block'
                });
            }
        }
        if ($('html').hasClass('firefox')) {
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if ($('.modal').hasClass('open')) {
                $('.modal.open').css({
                    height: layerHeight,
                    display: 'block',
                });
            }
            if ($('.modal.open').hasClass('dashboard_view')) {
                $('.modal.open').css({
                    height: 'auto',
                    display: 'block'
                });
            }
        }
        if ($('.detail_scroll').length) {
            var $detail = $('.detail_box').find('.detail').length;
            if ($detail == 2) {
                $('.detail_scroll').addClass('col2');
            }
        }
    });
}

//tab add 스크립트
function tabadd() {
    $('.tab_add').on('click', function (e) {
        e.preventDefault();
        var $lst_len = $('.tab_lst li').length;
        var count = $lst_len;
        count++;
        $('.tab_lst li.open').removeClass('open');
        $('.tab_container .tab_cont.open').removeClass('open');
        $('.tab_lst').children().last().after(
            "<li value=\"tabMgmt_" + count + "\" class=\"open on\">\n" +
            "<a href=\"#\" class=\"tab_link\" title=\"\">Tab style" + count + "</a>\n" +
            "<a href=\"#\" onclick=\"window.open('dashboard_popup_win.html','','height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');\" class=\"full\" title=\"새창열기\">새창열기</a>\n\n" +
            "<a href=\"#\" class=\"tab_cls\">close</a>\n" +
            "</li>"
        );
        $('.tab_container').children().last().after(
            "        <div class=\"tabMgmt_" + count + " tab_cont open\">\n" +
            "            <div class=\"dashboard_box\">\n" +
            "                <div class=\"dashboard_box_top\">\n" +
            "                    <div class=\"dashboard_title\">\n" +
            "                        <h3>Tab style" + count + "</h3>\n" +
            "                    </div>\n" +
            "                    <div class=\"dashboard_btn_box\">\n" +
            "                         <a href=\"#\" rel=\"time_all_modal\" class=\"btn bline modalLoad\">\n" +
            "                            <span>리로딩설정</span>\n" +
            "                        </a>\n" +
            "                        <a href=\"#\" rel=\"dashboard_listadd_modal\" class=\"btn bline modalLoad\">\n" +
            "                            <span>위젯설정</span>\n" +
            "                        </a>\n" +
            "                        <a href=\"#\" class=\"btn save\">\n" +
            "                            <span>저장</span>\n" +
            "                        </a>\n" +
            "                         <a href=\"#\" class=\"btn pin\">고정</a>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "                <div class=\"dashboard_box_cont\">\n" +
            "                    <ul class=\"dashboard_cont\">\n" +
            "\n" +
            "                    </ul>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n"
        );
        tabf();
        modalUi();
        var $tab_len = $(".tab_lst li").length;
        var $tab_wid = 100 / $tab_len + "%";
        $(".tab_lst li").css({maxWidth: $tab_wid});
        // TabCls();
    });
}

// tab삭제 스크립트
function TabCls() {
    // var $tab_cls = $('.tab_lst li.open').find('.tab_cls');
    $(document).on("click", ".tab_cls", function () {
        var contTop = $('.tab_container').offset();
        $('.newmodal_body').scrollTop(contTop);
        var $this = $(this),
            $thisrel = $this.parent().attr('value'); // tab_lst li :: rel
        $thisClass = $('.' + $thisrel); // tab_cont :: class
        target = $thisClass.parent('.tab_container').attr('id'); // tab_container :: id
        $('#' + target + ' .' + $thisrel).remove();
        $this.parent().prev().addClass('open');
        var $sibling = $this.parent().prev().attr('value');
        $siblingClass = $('.' + $sibling);
        target2 = $siblingClass.parent('.tab_container').attr('id');
        $('#' + target2 + ' .' + $sibling).addClass('open');
        $this.parent().remove();
    });
}

// 드레그 & 드랍 스크립트
function sortable() {
    if ($('.dashboard_cont').length) {
        $(".dashboard_box_cont > ul.dashboard_cont").sortable({
            connectWith: ".dashboard_cont",
            placeholder: "ui-state-highlight",
            start: function (event, ui) {
                var $width = ui.item.innerWidth();
                $(this).find('.ui-state-highlight').css({width: $width});
            },
            items: "li:not(.ui-state-disabled)"
        }).disableSelection();
    }
    /*
    if ($('.win_popup2').length) {
        $(".dashboard_box_cont > ul.dashboard_cont").sortable({
            items: "li(.ui-state-disabled)"
        }).disableSelection();
    }
    */
}

// 대시보드 컨텐츠 스크립트
function cont() {
    var $tab_len = $(".tab_lst li").length;
    var $tab_wid = 100 / $tab_len + "%";
    $(".tab_lst li").css({maxWidth: $tab_wid});
    $(".top5 > ul > li").addClass("ui-state-disabled");
    $('.cont_btn_day a').on('click', function () {
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
    });
    $('.btn.pin').on('click', function () {
        $(this).toggleClass("on");
        $(".dashboard_cont > li").toggleClass("ui-state-disabled");
        $(".dashboard_box_cont > .dashboard_cont").sortable({
            connectWith: ".dashboard_cont",
            items: "li:not(.ui-state-disabled)",
            cancel: ".ui-state-disabled"
        }).disableSelection();
        if ($(this).hasClass('on')) {
            $(this).html('고정됨');
        } else {
            $(this).html('고정하기');
        }
    });
    $('.cont_btn_link').on('click', function (e) {
        e.preventDefault();
        $(this).addClass('on');
        $(this).parent().find('.cont_btn_list').addClass('on');
    });
    $('html').click(function (e) {
        if (!$('.cont_btn_link').has(e.target).length) {
            $('.cont_btn_list').removeClass('on');
            $('.cont_btn_link').removeClass('on');
        }

    });
    $('.dashboard_cont .delete').on('click', function (e) {
        e.preventDefault();
        $(this).parents('li').remove();
    });
}

// 모달 팝업 스크립트
function modalUi() {
    $('a.modalLoad').on('click', function (e) {
        e.preventDefault();
        connectboxlistcss();
        var $self = $(this);
        var $thisrel = $self.attr('rel');
        var $target = $('#' + $thisrel);

        // open and focusin
        $target.attr('tabindex', '0').fadeIn(250).focus();
        // $target.css({ display: 'table' });
        $target.addClass('open');

        // create background
        createDim();

        $('.modal .modal_body').removeClass('mscrollbar');
        mscrollbar();

        if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches) {
            $('.modal.open').css({
                marginLeft: 'auto',
                marginTop: 'auto',
            });
        }
        if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches) {
            var layerHeight = $('.modal.open').outerHeight();
            var layerWidth = $('.modal.open').outerWidth();
            $('.modal').css({
                marginLeft: -layerWidth / 2,
                marginTop: -layerHeight / 2,
            });
        }
        if (window.matchMedia('(min-height: 0) and (max-height: 850px)').matches){
            $('.modal .modal_body').addClass('mscrollbar');
            mscrollbar();
        }



        // keydown focus repeat
        $target.find(".close").on('keydown', function (e) {
            if (e.which == '9') {
                $target.attr('tabindex', '0').focus();
            }
        });

        // close and focusout
        $target.find(".close").on('click', function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            removeDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;
            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $target.find(".modalLoad").on('click', function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            $self.focus();
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $(document).on("keyup", function (e) {
            if (e.which == '27') {
                $target.fadeOut(250);
                removeDim();
                $self.focus();
                $target.attr('class', 'modal');
            }
        });

        $target.parents('html body').find(".dim").click(function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            removeDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });
        if ($('html').hasClass('ie')) {
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if ($('.modal').hasClass('open')) {
                $('.modal.open').css({
                    height: layerHeight,
                    display: 'block',
                });
            }
            if ($('.modal.open').hasClass('dashboard_view')) {
                $('.modal.open').css({
                    height: 'auto',
                    display: 'block'
                });
            }
        }
        if ($('html').hasClass('firefox')) {
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if ($('.modal').hasClass('open')) {
                $('.modal.open').css({
                    height: layerHeight,
                    display: 'block',
                });
            }
            if ($('.modal.open').hasClass('dashboard_view')) {
                $('.modal.open').css({
                    height: 'auto',
                    display: 'block'
                });
            }
        }
        if ($('.detail_scroll').length) {
            var $detail = $('.detail_box').find('.detail').length;
            if ($detail == 2) {
                $('.detail_scroll').addClass('col2');
            }
        }

    });
    $('table .modalLoad').on('click', function (e) {

        e.preventDefault();
        var $self = $(this);
        var $thisrel = $self.attr('rel');
        var $target = $('#' + $thisrel);
        connectboxlistcss();

        // open and focusin
        $target.attr('tabindex', '0').fadeIn(250).focus();
        $target.css({display: 'table'});
        $target.addClass('open');
        // create background
        createDim();
        $('.modal .modal_body').removeClass('mscrollbar');
        mscrollbar();

        if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches) {
            $('.modal.open').css({
                marginLeft: 'auto',
                marginTop: 'auto',
            });
        }
        if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches) {
            var layerHeight = $('.modal.open').outerHeight();
            var layerWidth = $('.modal.open').outerWidth();
            $('.modal').css({
                marginLeft: -layerWidth / 2,
                marginTop: -layerHeight / 2,
            });
        }
        if (window.matchMedia('(min-height: 0) and (max-height: 850px)').matches){
            $('.modal .modal_body').addClass('mscrollbar');
            mscrollbar();
        }
        // keydown focus repeat
        $target.find(".close").on('keydown', function (e) {
            if (e.which == '9') {
                $target.attr('tabindex', '0').focus();
            }
        });
        // close and focusout
        $target.find(".close").on('click', function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            removeDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });
        $target.find(".modalLoad").on('click', function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            $self.focus();
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });
        $(document).on("keyup", function (e) {
            if (e.which == '27') {
                $target.fadeOut(250);
                removeDim();
                $self.focus();
                $target.attr('class', 'modal');
            }
        });
        $target.parents('html body').find(".dim").click(function (e) {
            e.preventDefault();
            if (e.which == '9') {
                $target.attr('tabindex', '0').focus();
            }
            $target.fadeOut(250);
            removeDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });
        if ($('html').hasClass('ie')) {
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if ($('.modal').hasClass('open')) {
                $('.modal.open').css({
                    height: layerHeight,
                    display: 'block',
                });
            }
            if ($('.modal.open').hasClass('dashboard_view')) {
                $('.modal.open').css({
                    height: 'auto',
                    display: 'block'
                });
            }
        }
        if ($('html').hasClass('firefox')) {
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if ($('.modal').hasClass('open')) {
                $('.modal.open').css({
                    height: layerHeight,
                    display: 'block',
                });
            }
            if ($('.modal.open').hasClass('dashboard_view')) {
                $('.modal.open').css({
                    height: 'auto',
                    display: 'block'
                });
            }
        }
        if ($('.detail_scroll').length) {
            var $detail = $('.detail_box').find('.detail').length;
            if ($detail == 2) {
                $('.detail_scroll').addClass('col2');
            }

            var $detail = $('.detail_title').find('h4').length;
            if ($detail == 2) {
                $('.detail_title').addClass('col2');
            }
        }
    });
    if ($('.modal_tab').length) {
        var $btn_tab = $('.modal_tab_lst li').find('.modal_tab_link');
        $btn_tab.on('click', function (e) {
            e.preventDefault();
            var contTop = $('.modal_tab_container').offset();
            $('.newmodal_cont').scrollTop(contTop);
            var $this = $(this),
                $thisrel = $this.parent().attr('rel'); // tab_lst li :: rel
            $thisClass = $('.' + $thisrel); // tab_cont :: class
            target = $thisClass.parent('.modal_tab_container').attr('id'); // tab_container :: id

            $('#' + target).find('.tab_cont').removeClass('open');
            $('#' + target + ' .' + $thisrel).addClass('open');
            $this.parent().addClass('open').siblings().removeClass('open'); // tab_lst li :: on
        });
    }
    if ($('.password_change').length) {
        $('.password_change').on('click', function (e) {
            e.preventDefault();
            $('.password_change_box').toggleClass('on');
            if ($('html').hasClass('ie')) {
                var headHeight = $('.modal.open .modal_header').innerHeight();
                var bodyHeight = $('.modal.open .modal_body').innerHeight();
                var footerHeight = $('.modal.open .modal_footer').innerHeight();
                var layerHeight = headHeight + bodyHeight + footerHeight;
                if ($('.modal').hasClass('open')) {
                    $('.modal.open').css({
                        height: layerHeight,
                        display: 'block',
                    });
                }
            }
            if ($('html').hasClass('firefox')) {
                var headHeight = $('.modal.open .modal_header').innerHeight();
                var bodyHeight = $('.modal.open .modal_body').innerHeight();
                var footerHeight = $('.modal.open .modal_footer').innerHeight();
                var layerHeight = headHeight + bodyHeight + footerHeight;
                if ($('.modal').hasClass('open')) {
                    $('.modal.open').css({
                        height: layerHeight,
                        display: 'block',
                    });
                }
            }
        });
    }
    if ($('.detail_list').length) {
        $('.detail_list > li > a').on('click', function (e) {
            if ($(this).hasClass('on')) {
                e.preventDefault();
                $(this).parents('ul').removeClass('active');
                $(this).removeClass('on');
            } else {
                e.preventDefault();
                $(this).addClass('on');
                $(this).parents('ul').siblings('ul.active').find('li a').removeClass('on');
                $(this).parents('ul').siblings('ul.active').removeClass('active');
                $(this).parents('ul').addClass('active');
            }
        });
    }
    if ($('.rev_list_btn').length) {
        $('.rev_list_btn').on('click', function (e) {
            if ($(this).hasClass('on')) {
                e.preventDefault();
                $(this).removeClass('on');
                $(this).parent().find('ul.rev_list').removeClass('on');
            } else {
                e.preventDefault();
                $(this).addClass('on');
                $(this).parent().find('ul.rev_list').addClass('on');
            }
        });
        $('.rev_list > li > a').on('click', function (e) {
            e.preventDefault();
            $(this).toggleClass('on');
            $(this).parents('li').nextAll().find('a').removeClass('on');
            $(this).parents('li').prevAll().find('a').removeClass('on');
        });
    }
    if ($('.modal a.btn.update').length) {
        $('.modal a.btn.update').on('click', function () {
            $(this).parents('.modal.open').find('.modal_cont .firewall').css({display: 'none'});
            $(this).parents('.modal.open').find('.modal_cont .ips_rule').css({display: 'none'});
            $(this).parents('.modal.open').find('.modal_cont .individual').css({display: 'block'});
        });
    }
}
function createDim() {
    if (!$('.dim').length) {
        $('body').append('<div class="dim"></div>');
    }
    $('.dim').fadeIn(250);
    if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches) {
        $('body').css({
            overflow: 'hidden'
        }).bind('touchmove', function (e) {
            e.preventDefault();
        });
    }
    if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches) {
        $('body').css({
            overflowX: 'scroll'
        }).bind('touchmove', function (e) {
            e.preventDefault();
        });
    }
}
function removeDim() {
    $('.dim').fadeOut(250);
    if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches) {
        $('body').css({
            overflow: 'inherit'
        }).bind('touchmove', function (e) {
            e.preventDefault();
        });
    }
    if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches) {
        $('body').css({
            overflowX: 'auto'
        }).bind('touchmove', function (e) {
            e.preventDefault();
        });
    }
}

//셀렉트박스 스크립트
function niceSelect() {
    $('.sel_box select').niceSelect();
}
function selectoption() {
    if ($('.nice-select.event').length) {
        $('.nice-select.event li').on('click', function () {
        	console.log("select option");
            var $self = $(this);
            var $thisval = $self.data('value');
            var $target = $('.' + $thisval);
            $self.parents('.event_search_warp').find('div.on').removeClass('on');
            $self.parents('.event_search_warp').find($target).addClass('on');
            mscrollbar();
        });
    }
    if ($('.nice-select.tab').length) {
        $('.nice-select.tab li').on('click', function () {
            var $self = $(this);
            var $thisval = $self.data('value');
            var $target = $('.' + $thisval);
            $self.parents('.modal_tab_box').find('div.open').removeClass('open');
            $self.parents('.modal_tab_box').find($target).addClass('open');
            $self.parents('.nice-select').removeClass('open');
            mscrollbar();
        });
    }
}

//브라우저채크 스크립트
function userAgentCheck() {
    var ua = window.navigator.userAgent;

    // check Browser
    if (ua.toLowerCase().indexOf('safari') !== -1) {

        if (ua.toLowerCase().indexOf('chrome') !== -1) {
            $('html').addClass('chrome');

        } else {
            $('html').addClass('safari');
        }

    } else if (ua.toLowerCase().indexOf('firefox') !== -1) {
        $('html').addClass('firefox');

    } else if (ua.toLowerCase().indexOf('msie 9.0') !== -1) {
        $('html').addClass('ie ie9');

    } else if (ua.toLowerCase().indexOf('msie 10.0') !== -1) {
        $('html').addClass('ie ie10');

    } else if (ua.toLowerCase().indexOf('rv:11.0') !== -1) {
        $('html').addClass('ie ie11');
    }

}

//권한 설정 스크립트
function connectboxlist() {
    // $('.connect_box_lst.all li span').each(function (index) {
    //     $(this).addClass('count' + index);
    // });
    $('.connect_box_btn .add').on('click', function (e) {
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.all li.on').clone().appendTo('.connect_box_lst.result').removeClass('on');
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.all li.on').remove();
        connectboxlistcss();
    });
    $('.connect_box_btn .alladd').on('click', function () {
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.all li').clone().appendTo('.connect_box_lst.result').removeClass('on');
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.all li').remove();
        connectboxlistcss();
    });
    $('.connect_box_btn .del').on('click', function () {
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.result li.on').clone().appendTo('.connect_box_lst.all').removeClass('on');
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.result li.on').remove();
        connectboxlistcss();
    });
    $('.connect_box_btn .alldel').on('click', function () {
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.result li').clone().appendTo('.connect_box_lst.all').removeClass('on');
        $(this).parents('.connect_box_wrap').find('.connect_box_lst.result li').remove();
        connectboxlistcss();
    });
    $('.connect_box_lst').on('click', "li", function () {
        $(this).toggleClass('on');
    });
    connectboxlistcss();
}
function connectboxlistcss(){
    var result = $(".modal.open .connect_box_lst.result li");
    var all = $(".modal.open .connect_box_lst.all li");
    if (result.length > 5){
        result.css({height:"33px"});
        result.parent().css({paddingRight: '17px'});
    }
    if (6 > result.length){
        result.css({borderBottom: "1px solid #565d68"});
        result.parents(".connect_box_lst.result").css({paddingRight: 0});
    }
    if (result.length > 4){
        result.siblings().css({borderBottom: "1px solid #565d68", height:"33px"});
        result.last().css({borderBottom: 0, height:"32px"});
    }
    if (all.length > 5){
        all.css({height:"33px"});
        all.parent().css({paddingRight: '17px'});
    }
    if (6 > all.length){
        all.css({borderBottom: "1px solid #565d68"});
        all.parents(".connect_box_lst.all").css({paddingRight: 0});
    }
    if (all.length > 4){
        all.siblings().css({borderBottom: "1px solid #565d68", height:"33px"});
        all.last().css({borderBottom: 0, height:"32px"});
    }
}

//패킷 스크립트
function packet() {
    $('.cont_btn1').on('click', function () {
        if ($(this).hasClass('packet')) {
            $(this).html('로그정보');
            $(this).parents('.win_popup').find('.popup_view_cont.logtxt').removeClass('on');
            $(this).parents('.win_popup').find('.popup_view_cont.packet').addClass('on');
            $(this).parents('.modal_cont').find('.popup_view_cont.logtxt').removeClass('on');
            $(this).parents('.modal_cont').find('.popup_view_cont.packet').addClass('on');
            $(this).removeClass('packet');
        } else {
            $(this).html('패킷정보');
            $(this).parents('.win_popup').find('.popup_view_cont.logtxt').addClass('on');
            $(this).parents('.win_popup').find('.popup_view_cont.packet').removeClass('on');
            $(this).addClass('packet');
        }
    });
    $('.packet_box .hex li').each(function (index) {
        $(this).attr('name', 'num' + index);
        $(this).children().attr('name', 'num' + index);
    });
    $('.packet_box .hex li span').each(function (index) {
        $(this).attr('name', 'span' + index);
    });
    $('.packet_box .name li').each(function (index) {
        $(this).attr('name', 'num' + index);
    });
    $('.packet_box .name li span').each(function (index) {
        $(this).attr('name', 'span' + index);
    });
    $('.packet_box').each(function () {
        $('.num').on('mouseover', function () {
            var thisTitle = $(this).attr('name');
            $(".num[name~=" + thisTitle + "]").css({color: "#e5e5e5", background: "#2e6fd4", lineHeight: "28px"});
        });
        $('.num').on('mouseout', function () {
            var thisTitle = $(this).attr('name');
            $(".num[name~=" + thisTitle + "]").css({color: "#e5e5e5", background: "#3a434f"});
        });
        $('.num span').on('mouseover', function () {
            var thisTitle = $(this).attr('name');
            $("span[name~=" + thisTitle + "]").css({border: "1px solid #fff", boxSizing: "border-box"});
        });
        $('.num span').on('mouseout', function () {
            var thisTitle = $(this).attr('name');
            $("span[name~=" + thisTitle + "]").css({border: 'none'});
        });
    });

}

//리스트 슬라이드 설정 스크립트
function setopt() {
    if ($('.set_opt').length) {
        $('.set_opt .set_opt_tit a').on('click', function (e) {
            if ($(this).parents('.set_opt').hasClass('open')) {
                $(this).parents('.set_opt').removeClass('open');
            } else {
                $(this).parents('.set_opt').addClass('open');
            }
        });
        $('.set_slide .next-slide').on('click', function (e) {
            if ($(this).parents('.set_slide').find('li').last().hasClass('on')) {
                $(this).parents('.set_slide').find('li.on').addClass('on');
            } else {
                $(this).parents('.set_slide').find('li.on').removeClass('on').next('li').addClass('on');
            }
        });
        $('.set_slide .prev-slide').on('click', function (e) {
            if ($(this).parents('.set_slide').find('li').first().hasClass('on')) {
                $(this).parents('.set_slide').find('li.on').addClass('on');
            } else {
                $(this).parents('.set_slide').find('li.on').removeClass('on').prev('li').addClass('on');
            }
        });
    }
}

//툴팁 스크립트
function mouse() {
    $("*[title]").tooltip({
        create: function (ev, ui) {
            $(this).data("ui-tooltip").liveRegion.remove();
        }
    });
}
function tooltip() {
    $('.computer_cont_con ul li').mouseenter(function(e) {
        var sWidth = window.innerWidth;
        var sHeight = window.innerHeight;

        var oWidth = $('.over_data').width();
        var oHeight = $('.over_data').height();

        // 레이어가 나타날 위치를 셋팅한다.
        var divLeft = e.clientX + 5;
        var divTop = e.clientY + 5;

        // 레이어가 화면 크기를 벗어나면 위치를 바꾸어 배치한다.
        if( divLeft + oWidth + 50 > sWidth ) divLeft -= oWidth;
        if( divTop + oHeight + 50 > sHeight ) divTop -= oHeight;

        // 레이어 위치를 바꾸었더니 상단기준점(0,0) 밖으로 벗어난다면 상단기준점(0,0)에 배치하자.
        if( divLeft < 0 ) divLeft = 0;
        if( divTop < 0 ) divTop = 0;
        if ($(this).hasClass('on')){
            $('.over_data').css({
                background: "rgba(85,165,89,0.9)",
                border: "1px solid #addbb0",
            });
        }
        if ($(this).hasClass('off')){
            $('.over_data').css({
                background: "rgba(133,137,141,0.9)",
                border: "1px solid #e5e5e5",
            });
        }
        $('.over_data').css({
            "display" : "block",
            "top": divTop,
            "left": divLeft,
            "position": "fixed"
        }).show();
    });
    $('.computer_cont_con ul li').mouseleave(function() {
        $('.over_data').css({
            "display" : "none",
        });
    });
}

function winpopup() {
    if ($('.detail_list2').length) {
        $('.detail_list2 > li > a').on('click', function (e) {
            if ($(this).hasClass('on')) {
                e.preventDefault();
                $(this).parents('ul').removeClass('active');
                $(this).removeClass('on');
            } else {
                e.preventDefault();
                $(this).addClass('on');
                $(this).parents('ul').siblings('ul.active').find('li a').removeClass('on');
                $(this).parents('ul').siblings('ul.active').removeClass('active');
                $(this).parents('ul').addClass('active');
            }
        });
    }
    $('.securitypolicy_add_btn').on('click', function f() {        
        if($(this).hasClass('policy_body')) {
        	$('#policy_edit #rule_add').find('dl.policy_option').hide();
        	$('#policy_edit #rule_add').find('dl.policy_body').show();
        	$("#policy_edit #rule_add a.cancel_btn").show();
        } else {
        	$('#policy_edit #rule_add').find('dl.policy_option').show();
        	$('#policy_edit #rule_add').find('dl.policy_body').hide();
        	$("#policy_edit #rule_add a.cancel_btn").hide();
        }
        $(this).parents('.securitypolicy_bottom').find('.securitypolicy_add').toggleClass('on');
        lf_resetPolicyEdit();
    });
}
