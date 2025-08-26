var lvar_param_prefix = 'event_complianceScan';
var lvar_param_trid = '700017';
var lvar_param_service = lf_serviceCall700017;
var lvar_event_pageNum = 0;
var lvar_event_totalCnt = 0;
var lvar_event_pageCnt = 5;
var is_dashboard = false; //대시보드인지 확인

var lvar_event_page_obj = {}

var COLOR_OF_RESULT = {
	passed: '#4E66DC',
	failed: '#B93C3C',
	WARN:'grey', excepted:'grey', skipped:'grey'
}

// BASE 프레임워크 이름 (CUSTOM 프레임워크의 경우에만, 컨트롤 ID 값에 따라 추가해 준다)
var FRAMEWORK_NAME_OBJECT = {
	'clf_0001': "Kubernetes",
	'clf_0002': "Docker",
	'clf_0004': "DevOps",
	'clf_0003': "NSA-CISA",
	'clf_0005': "Linux"
}

// 컨트롤에서 변경할 이름들
var controlChangeNameLabel = ['K', 'D', 'L'];

// 변경할 컨트롤 이름
var controlChangeNameLabelFromFrameworkId = {
	"clf_0003":  "NSA-",	// 새로 붙일 네임
	"clf_0004":  "DevOps-"	// 새로 붙일 네임
}

//var category = opener.document.getElementById("detailNum").value;

// 데이터 넘길시 아래와 같이 데이터를 넘기면 프레임워크 유저 활성화, 스캔가능 여부 체크하여 데이터 select\
// is_user_scan_enable = 'T' > 프레임워크 유저 활성화 여부 확인하여 활성화한 데이터만 select
// is_scan_enable = 'T' > 스캔 가능여부 확인하여 가능한 데이터만 select
var detailData = null;
// 대시보드의 호출에 대비한 분리
if (opener.document.getElementById("detailData")) {
	is_dashboard = false;
	detailData = opener.document.getElementById("detailData").value;
} else if (opener.document.getElementById("complianceDetailData")) {
	is_dashboard = true;
	detailData = opener.document.getElementById("complianceDetailData").value;
}

var rowData = JSON.parse(detailData);
var taskLogDataList = null;
var subtaskLogDataList = null;
var taskLogDataResultCount = null;

$(document).ready(function () {
	//table search
	$('#searchKeyword').on('keyup', function (event) {
		if (event.keyCode === 13) { // enter
			executeSearch(); // 검색 실행
		}
	});
	$('#searchBtn').on('click', function () {
		executeSearch(); // 검색 실행
	});

	// 모든 테이블 redraw 시 drop down 메뉴 추가 (redraw 하면 테이블 이외의 사용자 커스텀 모두 날아가기 때문)
	complianceScanTable.on('draw', function () {
		drawSubtaskListTree();
		//cf_contPreloader(lvar_param_prefix + '_result_table');
		$('.view_hide_btn_icon').removeClass('view_hide_active');
	});
});

$(function () {
	initTabFrameworkName();
	initScanResultCnt();
	
	if(is_dashboard) {
		initDashboardComplianceDetailTitle();
	}
	
	if(rowData['needFrameworkSelect']) { // 프레임워크 selectBox를 필요로 할 경우
		selectFrameworkList();
	}
	
	if (rowData["error_subtask_count"] == -1) {
		printErrorMessage();
	} else {
		lf_serviceCall700019();
		lf_serviceCall700017(0);
	}
	
	
});

function selectFrameworkList() {
	var is_user_scan_enable = rowData.is_user_scan_enable ? rowData.is_user_scan_enable : null;
	var is_scan_enable =  rowData.is_scan_enable ?  rowData.is_scan_enable : null;

	var body = {
		'clusterUuid': rowData.clusterUuid,
		'term' : rowData.term,
		'is_user_scan_enable': is_user_scan_enable,
		'is_scan_enable': is_scan_enable,
	};
	cf_requestServer(_TR_DASHBOARD_FRAMEWORK_LIST_BY_CLUSTER, body, lf_serviceCall600603CallBack, false);
}

//프레임워크 리스트 생성
function lf_serviceCall600603CallBack(data) {
	var selectBoxDiv = $('#frameworkSelectBox');
	var selectElement = $('<select id="frameworkSelect" class="popup_sel" onchange="executeSearch()">');
	selectBoxDiv.append(selectElement);
	
	var frameworkList = filterFirstOccurrenceByProperty(data);
	if(frameworkList.length == 0) { // 조회된 프레임워크 리스트가 없는경우
		$("#frameworkSelect").append(`<option>-</option>`);
	}
	frameworkList.forEach(function(data){
		$("#frameworkSelect").append(`<option value=${data.id}>${data.name}</option>`);
	});

	if(rowData.frameworkName) {
		$("#frameworkSelect option:contains('"+rowData.frameworkName+"')").prop('selected', true);
	}
	$("#frameworkSelect").niceSelect();
}

//프로퍼티의 중복을 제거하면서 해당 프로퍼티 값의 첫 번째 등장 객체만 남기는 로직
function filterFirstOccurrenceByProperty(data) {
	// 클러스터 규정 준수 스캔 정책 정보  
	var frameworkList = [];
	var frameworkIds = new Set();

	for (const obj of data.body.frameworkList) {
		if (!frameworkIds.has(obj.id)) {
			frameworkIds.add(obj.id);
			frameworkList.push(obj);
		}
	}
	return frameworkList;
}

/*function printSelectFramework() {
	var selectBoxDiv = $('#frameworkSelectBox');
	var selectElement = $('<select id="frameworkSelect" class="popup_sel" onchange="executeSearch()">');

	for (var key in FRAMEWORK_NAME_OBJECT) {
		if (FRAMEWORK_NAME_OBJECT.hasOwnProperty(key)) {
			var optionElement = $("<option>").val(key).text(FRAMEWORK_NAME_OBJECT[key]);
			selectElement.append(optionElement);
		}
	}
	selectBoxDiv.append(selectElement);
	
	if(rowData.frameworkName) $('#frameworkSelect').val(rowData.frameworkName);
	else $('#frameworkSelect option:first').prop('selected', true);
	
	$('#frameworkSelect').niceSelect();
}*/

// error -1일 경우 
function printErrorMessage() {
	$('.tbl').remove();
	var html = '';
	html += '<div class="error_subtask_message">' + rowData["message"] + '</div>';
	$('.event_cont').append(html);
}

// 700017
function lf_serviceCall700017(pageNum) {
	var resultValue = $('#resultValue').val();
	var searchValue = $('#searchValue').val();
	var frameworkIdValue = $('#frameworkSelect').val();
	
	if (!pageNum && pageNum != 0) {
		pageNum = lvar_event_pageNum; // default = 0 
	} else {
		switch (pageNum) {
			case 'first': pageNum = 0; break;
			case 'previous': pageNum = lvar_event_pageNum - 1; break;
			case 'next': pageNum = lvar_event_pageNum + 1; break;
			case 'last': pageNum = Math.ceil(lvar_event_totalCnt / lvar_event_pageCnt) - 1; break;
		}
	}
	lvar_event_pageNum = pageNum; // 페이지 넘버 재정의
	
	var body = {
		page: lvar_event_pageNum * lvar_event_pageCnt,
		topn: lvar_event_pageCnt,
	}
	
	if(rowData.uuid) body['scan_history_uuid'] = rowData.uuid;
	if(rowData.term) body['term'] = rowData.term;
	if(rowData.clusterUuid) body['clusterUuid'] = rowData.clusterUuid;
	if(rowData.starttime) body['starttime'] = rowData.starttime;
	if(rowData.endtime) body['endtime'] = rowData.endtime;
	// 2023-09-08 이성호 추가 > enable데이터 추가
	if(rowData.is_user_scan_enable)body['is_user_scan_enable'] = rowData.is_user_scan_enable;
	if(rowData.is_scan_enable)body['is_scan_enable'] = rowData.is_scan_enable;
	
	if(resultValue) body['resultValue'] = resultValue;
	if(searchValue) body['searchValue'] = searchValue;
	if(frameworkIdValue) body['frameworkId'] = frameworkIdValue;

	//cf_contPreloader(lvar_param_prefix + '_result_table');
	cf_requestServer(_TR_EVENT_COMPLIANCE_INFO, body, lf_serviceCall700017Callback, false);
}
function lf_serviceCall700017Callback(data) {
	if (!data.body) {
		complianceScanTable.clear().draw();
		return false;
	}
	taskLogDataList = data.body.taskLogDataList;
	subtaskLogDataList = data.body.subtaskLogDataList;
	taskLogDataResultCount = data.body.taskLogDataResultCount;
	
	//cf_contPreloader(lvar_param_prefix + '_result_table');
	drawComplianceScanTable();
}

// 700019
function lf_serviceCall700019() {
	var resultValue = $('#resultValue').val();
	var searchValue = $('#searchValue').val();
	var frameworkIdValue = $('#frameworkSelect').val();
	
	var body = {
		trId: lvar_param_trid,
	};
	if(rowData.uuid) body['scan_history_uuid'] = rowData.uuid;
	if(rowData.term) body['term'] = rowData.term;
	if(rowData.clusterUuid) body['clusterUuid'] = rowData.clusterUuid;
	if(rowData.starttime) body['starttime'] = rowData.starttime;
	if(rowData.endtime) body['endtime'] = rowData.endtime;
	// 2023-09-08 이성호 추가 > enable데이터 추가
	if(rowData.is_user_scan_enable)body['is_user_scan_enable'] = rowData.is_user_scan_enable;
	if(rowData.is_scan_enable)body['is_scan_enable'] = rowData.is_scan_enable;
	
	if(resultValue) body['resultValue'] = resultValue;
	if(searchValue) body['searchValue'] = searchValue;
	if(frameworkIdValue) body['frameworkId'] = frameworkIdValue;
	
	//cf_contPreloader(lvar_param_prefix + '_result_table');
	cf_requestServer(_TR_EVENT_CSP_PAGEINFO_SEARCH, body, lf_serviceCall700019Callback, false);
}
function lf_serviceCall700019Callback(data) {
	var dataInfo = data.body.info[0]; // totalCnt
	var totalCnt = dataInfo['totalcnt'];
	lvar_event_totalCnt = totalCnt;
	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;
	var len = complianceScanTable.page.len();
	lvar_event_pageCnt = len;
	var pagingValue = totalCnt + '_' + len + '_' + page;
	var info = {
		'start': 0,
		'page': page,
		'pages': Math.ceil(totalCnt / len),
		'length': len,
		'recordsTotal': totalCnt,
		'recordsDisplay': totalCnt,
		'all': false
	};
	var api = complianceScanTable.columns.adjust();
	var settings = api.settings()[0];
	_fnUpdatePaginate(settings, info, lvar_param_service);

	$('#complianceTaskEventPaging').val(pagingValue);
	//cf_contPreloader(lvar_param_prefix + '_result_table');
}

// 페이징 버튼 클릭
function lf_serviceButtonDataCallback() {
	var pageArr = $('#complianceTaskEventPaging').val().split('_');
	var totalCnt = pageArr[0] ? pageArr[0] : lvar_event_totalCnt;
	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;
	var len = pageArr[1];
	var pagingValue = totalCnt + '_' + len + '_' + page;
	var info = {
		'start': 0,
		'page': page,
		'pages': Math.ceil(totalCnt / len),
		'length': len,
		'recordsTotal': totalCnt,
		'recordsDisplay': totalCnt,
		'all': false
	};
	var api = complianceScanTable.columns.adjust();
	var settings = api.settings()[0];
	if (totalCnt > 0) {
		_fnUpdatePaginate(settings, info, lvar_param_service);
	}

	$('#complianceTaskEventPaging').val(pagingValue);
}

// 대시보드 호춣 시 최상단의 제목 수정
function initDashboardComplianceDetailTitle() {
	$('#complianceDetailTitle').html('대시보드 상세 > 클러스터 규정 준수 스캔');
}

// 프레임워크 이름 초기화
function initTabFrameworkName() {
	var framework = rowData.framework ?  rowData.framework : '-';
	var version = rowData.version === '-' ? '' : rowData.version;
	if(rowData.framework && rowData.version)$('#logInfoInner').html(framework + ' ' + version);
}

// 스캔 결과 카운트 초기화
function initScanResultCnt() {
	var passedCnt = taskLogDataResultCount ? taskLogDataResultCount.passed_cnt : 0;
	var failedCnt = taskLogDataResultCount ? taskLogDataResultCount.failed_cnt : 0;
	var errorCnt = taskLogDataResultCount ? taskLogDataResultCount.error_cnt : 0;
	var etcCnt =  taskLogDataResultCount ? taskLogDataResultCount.etc_cnt : 0; // etc count 추가
	var totalCnt = passedCnt + failedCnt + errorCnt + etcCnt; 
	
	$('#totalCount').html(totalCnt);
	$('#passedCount').html(passedCnt);
	$('#failedCount').html(failedCnt);
	$('#errorCount').html(errorCnt);
	$('#etcCount').html(etcCnt);  // etc count 추가
}

// null에 대한 처리
function transformDataOfNull(item) {
	var transformData = typeof item !== 'undefined' && item !== null && item !== 'null' && item !== '' ? item : '-';
	return transformData;
}

// taskId 변환
/*function transformTaskId(data) {
	if (!data) {
		data = '-';
	}
	if (data.startsWith('G_')) {
		data = data.replace('G_', '');
		var hyphenIndex = data.indexOf("-");
		if (hyphenIndex >= 0) {
			data = data.substring(hyphenIndex + 1);
		}
	}

	return data;
}*/

// taskId 변환(10-27 로직 수정)
function transformTaskId(target,baseId) { // target : task_id, baseId : framework_id
	if (!target) {
		target = '-'; // task_id가 없는 경우에는 -로 치환
	}
	// 10-27 로직 변경 
	if (target[1] == "-") { //target[0] == "K" || target[0] == "D" || target[0] == "L"
		if (controlChangeNameLabel.includes(target[0])) {
			target = target.substr(2); // target 문자열이 2번째 부터 시작(ex: K-CIS-1.1 -> CIS-1.1)
		}
	} else {
		target = target.substr(4); //  4번쨰 index 부터 substr  ~  / (ex: G_K-CIS-1.2 ->  "" + "CIS-1.2" -> CIS-1.2) 
		if (controlChangeNameLabelFromFrameworkId[baseId]) { // clf_0003 또는 clf_0004 가 존재하는 경우
			target = controlChangeNameLabelFromFrameworkId[baseId].rename + target; // rename(새로 붙일 이름) + substr된 target 이름
			//  (ex: clc_0004 ->  "DevOps-" + "0004" -> DevOps-0004)
		}
	}
	return target;
}

// frameworkName 변환(10-27 로직 수정)
function transformFrameworkName(frameworkType, frameworkId) {
	if(frameworkType == "DEFAULT") {
		return ""; // 
	}
	$.each(FRAMEWORK_NAME_OBJECT, function (key, value) {
		if (frameworkId.toLowerCase().indexOf(key) !== -1) { // frameworkId 값이 정의된 객체의 key값과 같은 경우
			data = value; // data는 해당 value 값으로 
			return false; // 반복 종료 
		}
	});
	return data;
}

// 테이블 출력
function drawComplianceScanTable() {
	var style_html = '"white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"';
	
	complianceScanTable.clear();
	$.each(taskLogDataList, function (idx, rowData) {

		var severityOrdering = 0;
		switch (rowData['severity']) {
			case "CRITICAL":
				severityOrdering = 0;
				break;
			case "HIGH":
				severityOrdering = 1;
				break;
			case "MEDIUM":
				severityOrdering = 2;
				break;
			case "LOW":
				severityOrdering = 3;
				break;
			default: //unknown, '-'
				severityOrdering = 4;
				break;
		}
		var frameworkName = '';

		var btnIcon_html = '';
		btnIcon_html += '<div class="view_hide_btn_icon" data-onoff="' + rowData["uuid"] + '_task" onclick="onoffDisplay(this)"></div>';
		
		var result_html = '';
		result_html += '<div class="result_cnt_box">';
		result_html += '	<div class="passed_cnt_box">' + rowData["passed_subtask_count"] + '</div>';
		result_html += '	<div class="failed_cnt_box">' + rowData["failed_subtask_count"] + '</div>';
		result_html += '	<div class="error_cnt_box">' + rowData["error_subtask_count"] + '</div>';
		result_html += '	<div class="etc_cnt_box">' + rowData["etc_subtask_count"] + '</div>';  // etc count 추가
		result_html += '</div>';

		var row = complianceScanTable.row.add([
			btnIcon_html,
			transformDataOfNull(rowData["active_framework_name"]),
			transformDataOfNull(rowData["framework_type"]),
			//10-27 ID 값 수정 : CUSTOM 인 경우에만 framework_id 값에 따른 BASE FRAMEWORK name 추가. 아닌경우에는 ID만 추가
			transformFrameworkName(rowData["framework_type"], rowData["framework_id"])+' '+transformTaskId(rowData["task_id"],rowData["framework_id"]), 
			transformDataOfNull(rowData["task_name"]),
			transformDataOfNull(rowData["description"]),
			transformDataOfNull(rowData["remediation"]),
			transformDataOfNull(rowData["severity"]),
			result_html,
			transformDataOfNull(rowData["date"]),
			rowData["uuid"],
			rowData["result"],
			severityOrdering
		]);
	});
	complianceScanTable.draw();
	
	initScanResultCnt();
	lf_serviceButtonDataCallback();
}

// drop down 메뉴 관리
function onoffDisplay(thiz) {
	var dataOnoff = $(thiz).data('onoff');
	var hasClassActive = $(thiz).hasClass('view_hide_active');
	if (hasClassActive) {
		// 클릭시 숨기기
		$('.subtask_bundle[data-onoff="' + dataOnoff + '"]').css('display', 'none');
		$('.subtask_detail[data-onoff="' + dataOnoff + '"]').slideUp();
		$('.view_hide_btn_icon[data-onoff="' + dataOnoff + '"]').removeClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onoff="' + dataOnoff + '"]').removeClass('view_hide_active');
	} else {
		// 클릭시 보이기
		$('.subtask_bundle[data-onoff="' + dataOnoff + '"]').css('display', 'table-row');
		$('.subtask_detail[data-onoff="' + dataOnoff + '"]').slideDown();
		$('.view_hide_btn_icon[data-onoff="' + dataOnoff + '"]').addClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onoff="' + dataOnoff + '"]').addClass('view_hide_active');
	}
}

// drop down 메뉴 하위 카테고리 출력
function getCategoryHtml(category) {
	var html = ''

	html += '<div class="subtask_catagory">';
	html += '	<div class="subtask_catagory_title">' + transformDataOfNull(category.title) + '</div>';

	if ((category.title).includes('Result')) {
		html += '	<div class="subtask_catagory_detail" style="font-weight: bold; color:' + COLOR_OF_RESULT[category.detail] + '">' + transformDataOfNull(category.detail) + '</div>';
	} else if ((category.title).includes('Description') || (category.title).includes('Remediation')) {
		var detail = transformDataOfNull(category.detail);
		var formattedDetail = detail.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\\n/g, '<br/>');
		var formattedTitle = detail.replace(/\\n/g, '\n');
		html += '	<div title="' + formattedTitle + '" class="subtask_catagory_detail">' + formattedDetail + '</div>';
	} else if ((category.title).includes('Actual value')) {
		var detail = '';
		if (!category.detail) {
			detail = '-';
		} else {
			// jkcho 문자 개행 수정
			detail = transformDataOfNull(category.detail).replace(/\|\|\|/g, ' \n');
		}
		html += '<textarea readonly="" class="textarea-scrollbar scrollbar-outer">'
		html += detail
		html += '</textarea>'
	} else {
		html += '	<div class="subtask_catagory_detail">' + transformDataOfNull(category.detail) + '</div>';
	}

	html += '</div>';

	return html;
}

// drop down 메뉴 출력
function drawSubtaskListTree() {
	taskLogDataList.forEach((task) => { // task 하위에 subtaskTr
		var rowSubtaskElementHtml = '';
		rowSubtaskElementHtml += '<tr id="rowSubtaskTr_' + task.uuid + '" data-onoff="' + task.uuid + '_task" data-scanner=' + task.scanner + ' class="subtask_bundle" style="display: none">'; // 룰 묶음
		rowSubtaskElementHtml += '	<td colspan="9"></td>';
		rowSubtaskElementHtml += '</tr>';

		var rowTaskId = '#rowTaskTr_' + task.uuid;
		$(rowTaskId).after(rowSubtaskElementHtml);
	});
	subtaskLogDataList.forEach((subtask) => {
		var rowSubtaskElementHtml = $('#rowSubtaskTr_' + subtask.task_detail_uuid + ' td');
		var rowSubtaskDiv = $('#rowSubtaskTr_' + subtask.task_detail_uuid + ' td div.row_subtask');

		var rowTaskPassedCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + ' .passed_cnt_box').text();
		var rowTaskFailedCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + ' .failed_cnt_box').text();
		var rowTaskEtcCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + ' .etc_cnt_box').text(); // 10-25 추가. etc count 비교를 위한 객체 생성
		var rowTaskErrorCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + ' .error_cnt_box').text();

		var description = subtask.description ? subtask.description : subtask.kubescape_description;
		var remediation = subtask.remediation ? subtask.remediation : subtask.kubescape_remediation;
		var scanner = $('#rowSubtaskTr_' + subtask.task_detail_uuid).data('scanner');

		var subtaskHtml = ''; // task 하위의 subtask 요소
		subtaskHtml += '<div id="rowSubtask_' + subtask.task_detail_uuid + '_' + subtask.id + '" class="row_subtask"></div>'
		rowSubtaskElementHtml.append(subtaskHtml);

		var subTaskElemet = $('#rowSubtask_' + subtask.task_detail_uuid + '_' + subtask.id);
		var subTaskNameHtml = '';
		var rowSubTaskLength = $('#rowSubtaskTr_' + subtask.task_detail_uuid + ' .row_subtask').length;
		
		// subtask tiltle '.'을 기준으로 앞의 문자열 
		var subtaskTag = rowSubtaskDiv.length + 1;
		if(subtask.subtask_id != null && subtask.subtask_id != '') subtaskTag = subtask.subtask_id;

		// result가 error 밖에 없을 때, 에러 관련 row 한번만 출력(10-25 etc 조건 추가)
		if (rowTaskPassedCnt == 0 && rowTaskFailedCnt == 0 && rowTaskEtcCnt == 0 && rowTaskErrorCnt > 0) {
			if (rowSubTaskLength > 1) return false;
			subTaskNameHtml += '<div class="subtask_name">';
			subTaskNameHtml += '	<div class="subtask_catagory_detail">' + transformDataOfNull(subtask.actual_value) + '</div>';
			subTaskNameHtml += '</div>';
		} else {
			subTaskNameHtml += '<div class="subtask_name">';
			subTaskNameHtml += '	<div class="subtask_catagory_title">';
			subTaskNameHtml += '		<div class="view_hide_btn_icon_grey" data-onoff="' + subtask.task_detail_uuid + '_' + subtask.id + '_subtask" onclick="onoffDisplay(this)"></div>';
			subTaskNameHtml += '	</div>';
			subTaskNameHtml += '	<div class="subtask_catagory_detail">' + subtaskTag + '. ' + transformDataOfNull(subtask.subtask_name) + '</div>' + '<div style="margin-left: 10px; font-weight: bold; color:' + COLOR_OF_RESULT[subtask.scan_result] + '">[' + transformDataOfNull(subtask.scan_result) + ']</div>';
			subTaskNameHtml += '</div>';
		}
		subTaskElemet.append(subTaskNameHtml);

		// 카테고리 정보를 객체 배열로 정의
		var categories = [
			{ title: '· Result:', detail: subtask.scan_result },
			{ title: '· Description: ', detail: description },
			{ title: '· Remediation:', detail: remediation },
			{ title: '· Actual value:', detail: subtask.actual_value, scanner: scanner },
		];

		// 상세 정보 HTML 구성
		var subtaskDetailHtml = '';
		subtaskDetailHtml += '<div class="subtask_detail" data-onoff="' + subtask.task_detail_uuid + '_' + subtask.id + '_subtask" style="display: none">';
		subtaskDetailHtml += categories.map(getCategoryHtml).join('');
		subtaskDetailHtml += '</div>';

		subTaskElemet.append(subtaskDetailHtml);
	});

	// 하위 요소가 없다면 드롭다운 버튼 삭제
	taskLogDataList.forEach((task) => {
		var subtaskRow = $('#rowSubtaskTr_' + task.uuid + ' td');
		if (subtaskRow.is(':empty')) {
			$('[data-onoff="' + task.uuid + '_task"]').remove();
			$('#rowSubtaskTr_' + task.uuid).remove();
		}
	});
}

//검색
function executeSearch() {
	$('#searchValue').val($('#searchKeyword').val());
	
	lvar_event_totalCnt = 0;
	lf_serviceCall700019();
	lf_serviceCall700017(0);
}

//상단 result count 클릭 시
function scanStatusRefresh(callOut) {
	$('#resultValue').val(callOut);
	executeSearch();
}
