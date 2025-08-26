
$(function () {
	$("#chartTabSelect").on("change", function() {
		var val = $(this).val();
		
		$("#chartTabSelect option").each(function() {
			$("." + $(this).val()).removeClass("open");
		});
		
		$("." + val).addClass("open");
//		$("." + val + " input:checkbox").each(function() {
//			$(this).prop("checked", false);
//		});
	});
	$("#chartSelectAllCheck1").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	$("#chartSelectAllCheck2").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	$("#chartSelectAllCheck3").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	$("#chartSelectAllCheck4").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	$("#chartSelectAllCheck5").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	$("#chartSelectAllCheck6").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	// 대시보드 > 이미지 시큐리티 > 전체 선택 체크 박스 func
	$("#chartSelectAllCheck7").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	// 대시보드 > 컨테이너 이벤트 > 전체 선택 체크박스
	$("#chartSelectAllCheck8").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
	// 대시보드 > 컨테이너 이벤트 > 전체 선택 체크박스
	$("#chartSelectAllCheck9").on("click", function() {
		var val = $(this).val();
		var checked = $(this).prop("checked");
		$("." + val + " input:checkbox[name=chart_checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
});

$(document).ready(function() {
	$('select').niceSelect();
	mscrollbar();
});