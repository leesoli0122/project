$(document).ready(function () {
    // fake select 별도 처리
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11) {
        var s = document.createElement("script");
        s.src = "../../assets/js/ui/com/fake_select.js";
        document.head.appendChild(s);
    }

    var $telInput = $("#tel-input");

    /** 전화번호 포맷팅 함수 */
    function formatTel(value) {
        var val = value.replace(/[^0-9]/g, "").slice(0, 11); // 숫자만 추출 + 최대 11자리
        if (val.length > 7) {
            return val.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
        } else if (val.length > 3) {
            return val.replace(/(\d{3})(\d{0,4})/, "$1-$2");
        }
        return val;
    }

    /** 입력 제한 (키보드) */
    $telInput.on("keydown", function (e) {
        var allowKeys = ["Backspace", "ArrowLeft", "ArrowRight"];
        if (!((e.key >= "0" && e.key <= "9") || $.inArray(e.key, allowKeys) !== -1)) {
            e.preventDefault();
        }
    });

    /** input 이벤트 (자동 포맷팅) */
    $telInput.on("input", function () {
        $(this).val(formatTel($(this).val()));
    });

    /** 붙여넣기 이벤트 */
    $telInput.on("paste", function (e) {
        e.preventDefault();
        var paste = (e.originalEvent.clipboardData || window.clipboardData).getData("text");
        $(this).val(formatTel(paste));
    });

    /** 간편인증 선택 (이벤트 위임) */
    $(".auth-list").on("change", 'input[type="radio"]', function () {
        var $li = $(this).closest("li");
        $li.addClass("selected").siblings().removeClass("selected");
    });
});
