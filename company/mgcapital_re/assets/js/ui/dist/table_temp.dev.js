"use strict";

$(window).on("load", function () {
  // select placeholder -> value
  var selectedText = $("#selectCustom select option:selected").text();
  $("#selectCustom .btn-fake-slt .value").text(selectedText); // select value�� tap-panel ��ȯ

  $("#yearSelect").on("change", function () {
    var target = $(this).val();
    $(".tab-panel").removeClass("active");
    $("#" + target).addClass("active");
  });
});
//# sourceMappingURL=table_temp.dev.js.map
