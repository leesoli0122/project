$(function () {

    // 유니코드 이스케이프 사용 (EUC-KR 안전)
    var TXT_NEYONG = '\uB0B4\uC6A9';   // "내용"
    var LABEL_CLOSE = '\uB2EB\uAE30'; // "닫기"
    var LABEL_OPEN  = '\uC5F4\uAE30'; // "열기"
  
    var accordionToggle = (function () {
      return {
        open: function (target) {
          target.addClass("on")
                .attr("title", LABEL_CLOSE)
                .attr("aria-expanded", "true")
                .find(".ic-arr .sr-only").text(TXT_NEYONG + " " + LABEL_CLOSE);
        },
        close: function (target) {
          target.removeClass("on")
                .attr("title", LABEL_OPEN)
                .attr("aria-expanded", "false")
                .find(".ic-arr .sr-only").text(TXT_NEYONG + " " + LABEL_OPEN);
        },
        toggle: function (target) {
          if (target.hasClass("on")) {
            this.close(target);
          } else {
            this.open(target);
          }
        }
      };
    })();
  
    $(document).on("click", ".accordionToggle .accordion-item > .tit", function () {
      var $currentAccordion = $(this).closest(".accordion-item");
      accordionToggle.toggle($currentAccordion);
    });
  
  });
  

  $(document).ready(function(){
    function toggleAccordionClass() {
        if ($(window).width() <= 768) { // 모바일 기준
            $(".product-content").addClass("accordion-list accordionToggle");
        } else {
            $(".product-content").removeClass("accordion-list accordionToggle");
        }
    }

    // 처음 로드 시 실행
    toggleAccordionClass();

    // 화면 크기 바뀔 때 실행
    $(window).resize(function(){
        toggleAccordionClass();
    });
});


$(document).ready(function(){
    function toggleAccordionButton() {
        $(".tit").each(function(){
            let $btn = $(this).find("button.ic-arr");

            if ($(window).width() <= 768) {
                // 모바일: 버튼 없으면 생성
                if ($btn.length === 0) {
                    $(this).append(
                        '<button type="button" class="ic-arr"><span class="sr-only">내용 열기</span></button>'
                    );
                }
            } else {
                // PC: 버튼 있으면 삭제
                if ($btn.length > 0) {
                    $btn.remove();
                }
            }
        });
    }

    // 처음 로드할 때 실행
    toggleAccordionButton();

    // 화면 크기 변경 시 실행
    $(window).resize(function(){
        toggleAccordionButton();
    });
});