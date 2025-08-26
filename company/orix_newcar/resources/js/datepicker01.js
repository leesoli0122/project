$(document).ready(function() {
    function datepickerHandlers(){
        // 기본 설정
        $.datepicker.setDefaults({
            showAnim: "fold",
            // showOn: "both",
            // buttonImage:"/resources/images/ic_datepicker.png",
            // buttonImageOnly:true,
            // buttonText:"달력 선택",
            closeText: "닫기",
            prevText: "이전달",
            nextText: "다음달",
            currentText: "오늘",
            monthNames: ["1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"
            ],
            monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"
            ],
            dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
            dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
            weekHeader: "주",
            dateFormat: "yy.mm.dd",
            firstDay: 0,
            isRTL: true,
            showOtherMonths:true,
            showMonthAfterYear: true,
            showButtonPanel: true,
            changeYear: true,
            changeMonth: true,
            yearSuffix: "년",
            minDate:null, //null
            yearRange:"c-5:c+5"//선택 범위
        });
        
        // 위치 조절 함수
        function repositionDatepicker(input, inst){
            var inputOffset = $(input).offset(); // input의 위치값 가져오기
            var inputHeight = $(input).outerHeight();
            inst.dpDiv.css({
                top: inputOffset.top + inputHeight + "px", // input 바로 아래
                left: inputOffset.left + "px" // input의 왼쪽
            });
        }
        
        $(".datepicker").datepicker({
            beforeShow: function(input, inst) {
                
                repositionDatepicker(input, inst);
    
                $(window).on('scroll resize', function() {
                    repositionDatepicker(input, inst);
                });
    
            },
            onClose: function() {
                $(window).off('scroll resize');
            }
        });
    
        // "오늘" 버튼 클릭 시
        $(document).on('click', '.ui-datepicker-current', function() {
            var today = new Date();
            var $datepickerInput = $('.datepicker');
    
            $datepickerInput.datepicker("setDate", today); // 오늘 날짜 설정
            $datepickerInput.datepicker("hide"); // datepicker 숨기기
    
             // 포커스 제거
            $datepickerInput.each(function() {
                $(this).blur();
            });
    
        });
    }
    
    // Datepicker 핸들러 실행
    datepickerHandlers();
});
