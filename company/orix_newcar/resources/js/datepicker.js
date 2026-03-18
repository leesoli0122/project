$(function() {
    var dateFormat = "yy-mm-dd",
        from = $("#from").datepicker({
            dateFormat: dateFormat,
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            showAnim: "slideDown",
            beforeShow: function(input, inst) {
                var $inputWrap = $(input).closest('.input_wrap');  // input_wrap 요소를 기준으로 위치 조정
                setTimeout(function() {
                    inst.dpDiv.css({
                        top: $inputWrap.offset().top + $inputWrap.outerHeight(),
                        left: $inputWrap.offset().left,
                        zIndex: 1000 // 필요에 따라 z-index를 조정
                    }).appendTo($inputWrap); // input_wrap 안에 달력을 추가
                }, 0);
            }
        }).on("change", function() {
            to.datepicker("option", "minDate", getDate(this));
        }),
        to = $("#to").datepicker({
            dateFormat: dateFormat,
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            showAnim: "slideDown",
            beforeShow: function(input, inst) {
                var $inputWrap = $(input).closest('.input_wrap');  // input_wrap 요소를 기준으로 위치 조정
                setTimeout(function() {
                    inst.dpDiv.css({
                        top: $inputWrap.offset().top + $inputWrap.outerHeight(),
                        left: $inputWrap.offset().left,
                        zIndex: 1000 // 필요에 따라 z-index를 조정
                    }).appendTo($inputWrap); // input_wrap 안에 달력을 추가
                }, 0);
            }
        }).on("change", function() {
            from.datepicker("option", "maxDate", getDate(this));
        });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }
        return date;
    }

    // 버튼 클릭 시 연결된 input에 Datepicker 열기
    $("#from-button").on("click", function() {
        $("#from").focus();
        $("#from").datepicker("show");
    });

    $("#to-button").on("click", function() {
        $("#to").focus();
        $("#to").datepicker("show");
    });
});