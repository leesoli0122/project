/**
 * 이벤트 조회 상수 값 정의
 * 공통모듈 사용으로 인하여 lvar_param_prefix, _result_table은 기존 스네이트 방식이름 유지
 * lvar_param_prefix +  _search_operation_옵션이름 : 검색 옵션 operation 값 
 * lvar_param_prefix +  _옵션이름 : 검색 옵션 값
 * 
 * lvar_param_service : 페이지 버튼 클릭 시 호출되는 서비스
 */

// TODO: 230727 kimsw | cs_compliance_scan_history의 framework_ids가 변경 예정이기 때문에 우선 비워둠. 추후 data 추가

var lvar_param_prefix = 'event_compliance';
var lvar_param_trid = '700016';
var lvar_param_service = lf_serviceCall700016;
var lvar_event_pageNum = 0;
var lvar_event_init = false;
var lvar_event_pageCnt = 10;
var lvar_event_totalCnt = 0;
var lvarJson = {};
var lvarEventComplianceSearchFieldStr = {
	'created_searchtime': 'Created Date​',
	'finished_searchtime': 'Finished Date',
	'type': 'Type',
	'cluster': 'Cluster',
	'framework': 'Framework',
	'total_controls': 'Total Controls',
	'pass_controls': 'Pass Controls',
	'fail_controls': 'Fail Controls',
	'error_controls': 'Error Controls',
	'etc_controls':'Etc Controls',
	'request_user': 'Request User',
}
var lvarEventComplianceOperation = {
	1: 'equals(=)',
	11: 'not equals(!=)',
	2: 'like',
	12: 'not like',
	3: 'less than(<)',
	4: 'less than or equals(<=)',
	5: 'greater than(>)',
	6: 'greater than or equals(>=)',
}

$(function () {
	lf_ComplianceInit();
});

// "추가" 버튼 클릭 > 쿼리 추가 
function lf_addEventComplianceCondition() {
	//# + lvar_param_prefix +  SearchType : 검색 옵션 값 
	var type = $('#' + lvar_param_prefix + '_search_type').val();
	var value;
	var text;
	var queryData = {
		'type': type,
		'operation': operation,
		'value': value
	};

	// 시간 조건
	if (type == 'created_searchtime') {
		var starttimeValue = $('#' + lvar_param_prefix + '_created_starttime').val();
		var endtimeValue = $('#' + lvar_param_prefix + '_created_endtime').val();
		value = starttimeValue + '~' + endtimeValue;

		queryData['value'] = value;
		queryData['operation'] = '';

		if (!starttimeValue || !endtimeValue) {
			swal('검색 시간 값이 비어있습니다.', {
				icon: './assets/images/icon_alert04.png',
				buttons: '확인'
			});
			return;
		}
	} else if (type == 'finished_searchtime') {
		var starttimeValue = $('#' + lvar_param_prefix + '_finished_starttime').val();
		var endtimeValue = $('#' + lvar_param_prefix + '_finished_endtime').val();
		value = starttimeValue + '~' + endtimeValue;

		queryData['value'] = value;
		queryData['operation'] = '';

		if (!starttimeValue || !endtimeValue) {
			swal('검색 시간 값이 비어있습니다.', {
				icon: './assets/images/icon_alert04.png',
				buttons: '확인'
			});
			return;
		}
	} else if (type == 'total_controls' || type == 'fail_controls' || type == 'pass_controls' || type == 'error_controls' || type == 'etc_controls') {
		var operation = $('#' + lvar_param_prefix + '_search_operation' + '_' + type).val(); // 검색 옵션 operation 값
		value = $('#' + lvar_param_prefix + '_' + type).val(); // 검색 옵션 값 
		text = $('#' + lvar_param_prefix + '_' + type + ' option:selected').text(); // 검색 옵션의 실제 출력 텍스트

		queryData['value'] = value;
		queryData['operation'] = operation;

		if (!value) {
			swal(lvarEventComplianceSearchFieldStr[type] + ' 값이 비어있습니다.', {
				icon: './assets/images/icon_alert04.png',
				buttons: '확인'
			});
			return;
		}
		value = parseInt($('#' + lvar_param_prefix + '_' + type).val());

		if (isNaN(value)) {
			swal(lvarEventComplianceSearchFieldStr[type] + '에는 숫자만 입력 가능합니다.', {
				icon: './assets/images/icon_alert04.png',
				buttons: '확인'
			});
			return;
		}
	} else if (type == 'framework') {
		var operation = '1';
		value = $('#' + lvar_param_prefix + '_' + type).val(); // 검색 옵션 값 
		text = $('#' + lvar_param_prefix + '_' + type + ' option:selected').text(); // 검색 옵션의 실제 출력 텍스트

		queryData['value'] = value;
		queryData['operation'] = operation;
		if (!value) {
			swal(lvarEventComplianceSearchFieldStr[type] + ' 값이 비어있습니다.', {
				icon: './assets/images/icon_alert04.png',
				buttons: '확인'
			});
			return;
		}
	} else {
		var operation = $('#' + lvar_param_prefix + '_search_operation' + '_' + type).val(); // 검색 옵션 operation 값
		value = $('#' + lvar_param_prefix + '_' + type).val(); // 검색 옵션 값 
		text = $('#' + lvar_param_prefix + '_' + type + ' option:selected').text(); // 검색 옵션의 실제 출력 텍스트

		queryData['value'] = value;
		queryData['operation'] = operation;
		if (!value) {
			swal(lvarEventComplianceSearchFieldStr[type] + ' 값이 비어있습니다.', {
				icon: './assets/images/icon_alert04.png',
				buttons: '확인'
			});
			return;
		}
	}

	var queryTable = $('#' + lvar_param_prefix + '_queryTable'); // 추가 될 쿼리 태그(li)가 append 될 부모 div id
	//탐지 시간 옵션 유효성 검사 : 시간 옵션은 1개만 가능
	if ((type == 'created_searchtime' && queryTable.find('span:contains("' + lvarEventComplianceSearchFieldStr["created_searchtime"] + '")').length > 0)
		|| (type == 'finished_searchtime' && queryTable.find('span:contains("' + lvarEventComplianceSearchFieldStr["finished_searchtime"] + '")').length > 0)) {
		swal('검색 시간은 1개 이하만 입력 할 수 있습니다.', {
			icon: './assets/images/icon_alert04.png',
			buttons: '확인'
		});
		return;
	}

	var $TR = $('<li></li>'); // 추가된 쿼리 <li> 태그 형식으로 출력
	$TR.data('queryData', queryData);
	if (type == 'created_searchtime' || type == 'finished_searchtime') { // 시간 데이터에는 operation 값이 붙지 않음
		$TR.append($('<p><span>' + lvarEventComplianceSearchFieldStr[type] + '</span> / <span>' + value + '</span></p>'));
	} else {
		// select 태그인 경우에는 text 출력. 아닌경우에는 value 출력 
		if (!text) selectOption = value;
		else selectOption = text;

		$TR.append($('<p><span>' + lvarEventComplianceSearchFieldStr[type] + '</span> / <span>' + lvarEventComplianceOperation[operation] + '</span> / <span>' + selectOption + '</span></p>'));
	}

	$TR.append($('<a class="removex" title="삭제" onclick="javascript: $(this).parent().remove();"></a>')); // 삭제 버튼 : 해당 태그의 부모(li) 태그 삭제
	queryTable.find('ul').append($TR); // 쿼리 추가 항목 표시

	lf_eventComplianceSearchClear();
}

function lf_ComplianceInit() {
	$('#' + lvar_param_prefix + '_created_starttime').val((new Date()).format('yyyy-MM-dd') + 'T00:00:00');
	$('#' + lvar_param_prefix + '_created_endtime').val((new Date()).format('yyyy-MM-dd') + 'T23:59:59');
	cf_requestServer(_TR_POLICY_CLUSTER_INFO, null, lf_serviceCall800060CallBack, false);
	lf_serviceCall700019();
	lf_serviceCall700016();
}

// 쿼리 입력 내용 초기화
function lf_eventComplianceSearchClear() {
	$('.complianceEvent_date').val(''); // 클래스 이름으로 date 형식 초기화
	$('#' + lvar_param_prefix + '_cluster').val('');
	/*$('#' + lvar_param_prefix + '_framework').val('');*/
	$('#' + lvar_param_prefix + '_total_controls').val('');
	$('#' + lvar_param_prefix + '_pass_controls').val('');
	$('#' + lvar_param_prefix + '_fail_controls').val('');
	$('#' + lvar_param_prefix + '_error_controls').val('');
	$('#' + lvar_param_prefix + '_etc_controls').val('');
	$('#' + lvar_param_prefix + '_request_user').val('');
}

// "검색" 버튼 클릭 > 조건에 따른 쿼리 조회
function lf_eventComplianceClick() {
	lvar_event_totalCnt = 0;
	lf_serviceCall700019(); // 페이징 관련 처리 
	lf_serviceCall700016(0);  // 데이터 초기화 및 호출. 검색 버튼 클릭시 페이지버튼은 무조건 0
	mscrollbarReset(); // 스크롤바 reset
}

// ServiceTr 데이터 초기화 및 호출 데이터 전달
function lf_serviceCall700016(pageNum) {
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

	var parameters = [];
	var created_starttime = null;
	var finished_starttime = null;
	var created_endtime = null;
	var finished_endtime = null;
	var queryTable = $('#' + lvar_param_prefix + '_queryTable');

	queryTable.find('ul li').each(function () {
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];

		// 기준이 되는 기본 searchtime을 created Date라고 가정한다
		if ('created_searchtime' == type) {
			var timeArr = value.split('~');
			created_starttime = timeArr[0];
			created_endtime = timeArr[1];
		} else if ('finished_searchtime' == type) {
			var timeArr = value.split('~');
			finished_starttime = timeArr[0];
			finished_endtime = timeArr[1];
		} else {
			var param = {};
			param['name'] = type;
			param['value'] = value;
			param['operation'] = operation;
			parameters.push(param);
		}
	});
	var body = {
		'page': lvar_event_pageNum * lvar_event_pageCnt,
		'topn': lvar_event_pageCnt,
		'parameters': parameters.length > 0 ? parameters : null
	};

	if (created_starttime != null) body['created_starttime'] = created_starttime; 
	else if(created_starttime == null && finished_starttime == null) body['created_starttime'] = (new Date()).format('yyyy-MM-dd') + '/00:00:00';
	if (created_endtime != null) body['created_endtime'] = created_endtime;
	else if(created_endtime == null && finished_endtime == null) body['created_endtime'] = (new Date()).format('yyyy-MM-dd') + '/23:59:59';

	if (finished_starttime != null) body['finished_starttime'] = finished_starttime;
	if (finished_endtime != null) body['finished_endtime'] = finished_endtime;

	// Table Data delete
	var table = $('#' + lvar_param_prefix + '_result_table');
	table.find('> tbody tr').remove();

	cf_contPreloader(lvar_param_prefix + '_result_table'); // Loding
	cf_requestServer(_TR_EVENT_COMPLIANCE, body, lf_serviceCall700016Callback);
}

//log에 대한 null 체크, 데이터 변환
function transformViewLog(item) {
	var transformData = typeof item !== 'undefined' && item !== null && item !== 'null' ? item : "-";
	return transformData;
}

// ServiceTr 데이터 초기화 및 호출 결과 콜백 함수
function lf_serviceCall700016Callback(data, body) {
	var frameworkList = data.body.frameworkList;
	/*var selectFrameworkElement = $('#event_compliance_framework');
	selectFrameworkElement.empty();
	$.each(frameworkList, function(idx, data) {
		var html = '<option value="'+ data.id +'">'+ data.name +'</option>'
		selectFrameworkElement.append(html);
	});
	selectFrameworkElement.niceSelect("update");*/


	$('#' + lvar_param_prefix + '_result_div').hide();
	$('#' + lvar_param_prefix + '_result_div').slideDown(600);

	var table = $('#' + lvar_param_prefix + '_result_table').DataTable();

	table.clear().draw();
	$('#detailData').val('');
	cf_contPreloader(lvar_param_prefix + '_result_table'); // Loding 재호출

	lvarJson = {}; // 상세 페이지에 전달 시킬 json 데이터 리스트
	var dataList = data.body.dataList;

	$.each(dataList, function (idx, rowData) {
		var errorElement = transformViewLog(rowData["error_controls"]);
		if (rowData["error_subtask_count"] == -1) errorElement = -1;

		// 테이블 데이터 추가
		table.row.add([
			// 2023-09-07 이성호 페이지 넘버링 변경
			//(idx+1),
			(body.page+(idx+1))+"<p style='display:none;'>"+(idx+1)+"</p>",
			transformViewLog(rowData["type"]) === 'MANUAL' ? '수동' : '자동',
			transformViewLog(rowData["cluster"]),
			transformViewLog(rowData["framework"]),
			transformViewLog(rowData["total_controls"]),
			transformViewLog(rowData["pass_controls"]),
			transformViewLog(rowData["fail_controls"]),
			errorElement,
			transformViewLog(rowData["etc_controls"]),
			transformViewLog(rowData["request_user"]),
			transformViewLog(rowData["created_date"]),
			transformViewLog(rowData["finished_date"]),
			transformViewLog(rowData["message"]),
		]);
		lvarJson[idx] = rowData;  // 이벤트 상세 > 원본 로그에 출력될 json 객체에 row데이터 담기
	});
	table.draw();

	// 테이블 클릭 이벤트 정의 
	$('#' + lvar_param_prefix + '_result_table').find('> tbody tr').addClass('modalLoad') // 테이블 row에 class 추가 : 모달창으로 이동되는 이벤트 정의
		.attr({
			rel: 'eventComplianceDetail_modal',
			onclick: 'lf_eventComplianceTableClick(this);'
		});

	lf_serviceButtonDataCallback(data); // 페이징 버튼 클릭시 발생되는 이벤트 정의
}

//  페이징 버튼 클릭시 발생되는 이벤트 정의
function lf_serviceButtonDataCallback(data) {
	var pageArr = $('#complianceEventPaging').val().split('_');
	var dataInfo = data.body;
	var totalCnt = pageArr[0] ? pageArr[0] : lvar_event_totalCnt;
	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;
	var table = $('#' + lvar_param_prefix + '_result_table').DataTable();
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
	var api = table.columns.adjust();
	var settings = api.settings()[0];
	if (totalCnt > 0) {
		_fnUpdatePaginate(settings, info, lvar_param_service);
	}

	$('#' + lvar_param_prefix + '_result_div').hide();
	$('#' + lvar_param_prefix + '_result_div').slideDown(300);

	$('#complianceEventPaging').val(pagingValue);
}

// 테이블 row 클릭 이벤트 : 상세정보 이동 
function lf_eventComplianceTableClick(obj) {
	// 2023-09-07 이성호 페이지 넘버링 변경
	//var num = $(obj).children(':first').text();
	var num = $(obj).children(':first').children(':last').text();
	
	$('#detailNum').val('');
	$('#detailNum').val('eventCompliance');

	$('#detailData').val('');

	// 2023-09-07 이성호 페이지 넘버링 변경
	//if (lvarJson[num - 1]) $('#detailData').val(transformViewLog(JSON.stringify(lvarJson[num - 1])));
	if(lvarJson[num-1]) $('#detailData').val(transformViewLog(JSON.stringify(lvarJson[num-1], null, 4)));
	//console.log($('#detailData').val(transformViewLog(JSON.stringify(lvarJson[num - 1]))));

	window.open('/eventComplianceInfo.do', '', 'width=1300,height=810,location=no,status=no,scrollbars=yes');
}

// ServiceTr 페이지 관련 처리 데이터 전달 
// ServiceTr 페이징 관련 처리 함수 
function lf_serviceCall700019() {
	var parameters = [];
	var created_starttime = null;
	var finished_starttime = null;
	var created_endtime = null;
	var finished_endtime = null;
	var queryTable = $('#' + lvar_param_prefix + '_queryTable');

	queryTable.find('ul li').each(function () {
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];

		// 기준이 되는 기본 searchtime을 created Date라고 가정한다
		if ('created_searchtime' == type) {
			var timeArr = value.split('~');
			created_starttime = timeArr[0];
			created_endtime = timeArr[1];
		} else if ('finished_searchtime' == type) {
			var timeArr = value.split('~');
			finished_starttime = timeArr[0];
			finished_endtime = timeArr[1];
		} else {
			var param = {};
			param['name'] = type;
			param['value'] = value;
			param['operation'] = operation;
			parameters.push(param);
		}
	});

	var body = {
		'parameters': parameters.length > 0 ? parameters : null,
		'trId': lvar_param_trid
	};
	
	console.log('created_starttime', created_starttime);
	console.log('created_endtime', created_endtime);
	console.log('finished_starttime', finished_starttime);
	console.log('finished_endtime', finished_endtime);

	// 날짜 정보가 없으면 현재 날짜 기준 default값 설정
	if (created_starttime != null) body['created_starttime'] = created_starttime; 
	else if(created_starttime == null && finished_starttime == null) body['created_starttime'] = (new Date()).format('yyyy-MM-dd') + '/00:00:00';
	if (created_endtime != null) body['created_endtime'] = created_endtime;
	else if(created_endtime == null && finished_endtime == null) body['created_endtime'] = (new Date()).format('yyyy-MM-dd') + '/23:59:59';

	if (finished_starttime != null) body['finished_starttime'] = finished_starttime;
	if (finished_endtime != null) body['finished_endtime'] = finished_endtime;

	console.log(body);
	
	cf_contPreloader(lvar_param_prefix + '_result_table');
	cf_requestServer(_TR_EVENT_CSP_PAGEINFO_SEARCH, body, lf_serviceCall700019Callback);
}

// ServiceTr 페이지 관련 처리 결과 콜백 함수
// totalCnt GET  
// ex) totalCnt: 8007
function lf_serviceCall700019Callback(data) {
	var dataInfo = data.body.info[0]; // totalCnt
	var totalCnt = dataInfo['totalcnt'];
	lvar_event_totalCnt = totalCnt;
	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;
	var table = $('#' + lvar_param_prefix + '_result_table').DataTable();
	var len = table.page.len();
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
	var api = table.columns.adjust();
	var settings = api.settings()[0];
	_fnUpdatePaginate(settings, info, lvar_param_service);

	$('#complianceEventPaging').val(pagingValue);
	cf_contPreloader(lvar_param_prefix + '_result_table');
}

function lf_serviceCall800060CallBack(data) {
	var clusterList = data.body.clusterList;
	clusterList.forEach(function (data) {
		$("#event_compliance_search_operation_framework").append(`<option value=${data.uuid}>${data.name}</option>`);
		$("#event_compliance_search_operation_framework").niceSelect("update");
	})
	// 프레임워크 리스트 생성 함수 호출 
	selectFrameworkList();
}

function selectFrameworkList(clusterUuid) {
	var body = {
		'clusterUuid': clusterUuid ? clusterUuid : $("#event_compliance_search_operation_framework option:selected").val(),
		'allFrameworkShow': 'T' // 10-26 추가.
	};
	cf_requestServer(_TR_CLUSTER_FRAMEWORK_STATUS, body, lf_serviceCall800405CallBack, false);
}

//프레임워크 리스트 생성
function lf_serviceCall800405CallBack(data) {
	console.log('event_compliance_framework', event_compliance_framework);
	$("#event_compliance_framework option").remove(); // 기존 프레임워크 리스트 초기화
	
	var frameworkList = filterFirstOccurrenceByProperty(data);
	if(frameworkList.length == 0) { // 조회된 프레임워크 리스트가 없는경우
		$("#event_compliance_framework").append(`<option>-</option>`);
	}
	frameworkList.forEach(function(data){
		$("#event_compliance_framework").append(`<option value=${data.id}>${data.name}</option>`);
		// 프레임워크 리스트 id 저장
		// frameworkUuidList.push(data.id);
	});	
	$("#event_compliance_framework").niceSelect("update");
}
//프레임워크 리스트 생성(변경)


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

// Datatable length 변경 시 호출되는 함수
function _fnLengthChange(length) {
	lvar_event_pageNum = 0; // 페이지 넘버 1번으로 초기화
	lvar_event_pageCnt = length;
	lf_serviceCall700019();
	lf_serviceCall700016();
	mscrollbarReset();
}