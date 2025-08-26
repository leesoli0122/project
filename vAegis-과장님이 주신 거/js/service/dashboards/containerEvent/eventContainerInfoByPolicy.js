var sendData = {
	clusterUuid: '',
	policyId: '',
	term: '',
	searchKeyword: '',
	fixDate: '',
	page: lvar_event_pageNum, // 0번 째 로우부터 갯수를 셈.
	topn: lvar_event_pageCnt,
	getNewCnt: '0', // 페이징 처리를 위해 새로 카운팅
};
var lvar_param_prefix = "event_containerPolicyDetail"
var lvar_event_pageNum = 0;
var lvar_event_pageCnt = 10;
var lvar_event_init = false;
var lvar_event_TotalCnt = 0;
var lvar_param_service = lf_serviceCall600622;
var original_cnt = 0;

$(document).ready(function() {
	/*	$().DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"order": [],
			"info": false,
			"language": false,
			"dom": 'rt<"bottom"ip><"clear">',
			"pageLength": 10,
			"initComplete": function(settings, json) {
				$('[data-toggle="tooltip"]').tooltip();
			},
			"columnDefs": [],
		});*/
	$('#' + lvar_param_prefix + '_result_table').DataTable({
		"autoWidth": false,
		"paging": true,
		"pagingType": "full_numbers",
		"ordering": true,
		"order": [],
		"columns": [
			{ "data": "No" },
			{ "data": "Action" },
			{ "data": "Rule name" },
			{ "data": "Namespace" },
			{ "data": "Kind" },
			{ "data": "Operation" },
			{ "data": "User" },
			{ "data": "Message" },
			{ "data": "Date" },
		],
		"columnDefs": [{
			"targets": "_all",
			"createdCell": function(td, cellData, rowData, row, col) {
				$(td).attr('title', cellData); // title 속성에 데이터 추가
				//$(tr).attr('role', 'row');
				// 스타일 속성 설정
				$(td).css({
					'white-space': 'nowrap',
					'overflow': 'hidden',
					'text-overflow': 'ellipsis'
				});
			}
		}
		],
		"info": false,
		"filter": false,
		"lengthChange": false,
		/*		"language": {
					"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
				},*/
		//"dom": '<"top"lf>rt<"bottom"ip><"clear">',
		"dom": 'rt<"bottom"ip><"clear">',
		// "pageLength": '10',
	});
	
	// 검색 엔터키 입력 EVT 적용
	$('#searchKeyword').on('keyup', function(event) {
		if (event.keyCode === 13) { // enter
			vulSearchBtnClick(); // 검색 실행
		}
	});
	
	init_eventContainerInfoPage(JSON.parse(opener.document.getElementById("detailDataInfo").value));
});

// ===========================================================
// init 함수
// ===========================================================
function init_eventContainerInfoPage(detailData) {
	init_sendData();
	init_policy(detailData);
}

// send data 초기화
function init_sendData() {
	sendData = {};
}

// 정책 기준시 데이터 초기화
function init_policy(detailData) {
	// Header 세팅
	$('#policy_header_name').html(detailData.name);
	$('#policy_header_action').html(detailData.policy_action);
	$('#policy_header_severity').append(ccf_displaySeverityBCSetting(detailData.severity));
	$('#policy_header_description').html(detailData.description);
	lvar_event_TotalCnt = detailData.cnt;
	original_cnt = detailData.cnt;

	// 초기 조회 세팅
	sendData = {
		clusterUuid: detailData.clusterUuid,
		term: detailData.term,
		policyId: detailData.policy_id,
		page: 0,
		topn: lvar_event_pageCnt,
		fixDate: detailData.fixdate,
		getNewCnt: 'N'
	};
	lf_serviceCall700019Callback();
	lf_serviceCall600622();
}

// ===========================================================
// 통신 함수
// ===========================================================
function lf_serviceCall600622(pageNum) {
	cf_contPreloader(lvar_param_prefix + '_result_table'); // Loding
	if (pageNum != null) {
		switch (pageNum) {
			case 'first': pageNum = 0; break;
			case 'previous': pageNum = lvar_event_pageNum - 1; break;
			case 'next': pageNum = lvar_event_pageNum + 1; break;
			case 'last': pageNum = Math.ceil(lvar_event_TotalCnt / lvar_event_pageCnt) - 1; break;
		}
		lvar_event_pageNum = pageNum; // 페이지 넘버 재정의
		sendData.page = pageNum * lvar_event_pageCnt;
	}
	cf_requestServer(_TR_DASHBOARD_CE_DASHBOARD_BY_POLICY_DETAIL_INFO, sendData, lf_serviceCall600622CallBack);
}

function lf_serviceCall600622CallBack(data, body) {
	var eventList = data.body.eventList;

	// 검색시 처음에만 실행되는 페이징 카운팅 변경
	if (body.getNewCnt === 'Y') {
		sendData.getNewCnt = 'N';
		lvar_event_TotalCnt = data.body.newCnt;
		lvar_event_pageNum = 0; // 페이지 넘버 재정의
		lf_serviceCall700019Callback();
	}
	tableDataDisplay(eventList, body);
	lf_serviceButtonDataCallback();
	cf_contPreloader(lvar_param_prefix + '_result_table'); // Loding
}

// 페이징 처리
function lf_serviceCall700019Callback() {
	var totalCnt = lvar_event_TotalCnt;
	var page = lvar_event_pageNum;

	var table = $('#' + lvar_param_prefix + '_result_table').DataTable();
	var len = table.page.len();

	lvar_event_pageCnt = len;
	var pagingValue = totalCnt + "_" + len + "_" + page;
	var info = {
		"start": 0,
		"page": page,
		"pages": Math.ceil(totalCnt / len),
		"length": len,
		"recordsTotal": totalCnt,
		"recordsDisplay": totalCnt,
		"all": false
	};

	var api = table.columns.adjust();
	var settings = api.settings()[0];
	_fnUpdatePaginate(settings, info, lvar_param_service);
	$('#containerPolicyDetailEventPaging').val(pagingValue);
}

// ===========================================================
//  페이징 버튼 클릭시 발생되는 이벤트 정의
// ===========================================================
function lf_serviceButtonDataCallback() {
	var pageArr = $('#containerPolicyDetailEventPaging').val().split('_');
	var totalCnt = pageArr[0] ? pageArr[0] : lvar_event_TotalCnt;
	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;
	var table = $('#' + lvar_param_prefix + '_result_table').DataTable();
	var len = pageArr[1];
	var pagingValue = totalCnt + "_" + len + "_" + page;

	var info = {
		"start": 0,
		"page": page,
		"pages": Math.ceil(totalCnt / len),
		"length": len,
		"recordsTotal": totalCnt,
		"recordsDisplay": totalCnt,
		"all": false
	};

	var api = table.columns.adjust();
	var settings = api.settings()[0];
	if (totalCnt > 0) {
		_fnUpdatePaginate(settings, info, lf_serviceCall600622);
	}

	$('#' + lvar_param_prefix + '_result_div').hide();
	$('#' + lvar_param_prefix + '_result_div').slideDown(300);
	$('#containerPolicyDetailEventPaging').val(pagingValue);
}

// ===========================================================
// 데이터 세팅
// ===========================================================
function tableDataDisplay(eventList, inputData) {
	//
	$('#' + lvar_param_prefix + '_result_div').hide();
	$('#' + lvar_param_prefix + '_result_div').slideDown(600);

	var table = $('#' + lvar_param_prefix + '_result_table').DataTable();
	table.clear().draw();
	var indexNumber = sendData.page;
	for (var i = 0; i < eventList.length; i++) {
		var tableRow = table.row.add({
			"No": (indexNumber + i + 1),
			"Action": eventList[i].policy_action,
			"Rule name": eventList[i].rule_name,
			"Namespace": eventList[i].namespace,
			"Kind": eventList[i].object_kind,
			"Operation": eventList[i].operation,
			"User": eventList[i].subject_name,
			"Message": eventList[i].message,
			"Date": eventList[i].date
		}).draw(false).node();
		$(tableRow).data(eventList[i]);
	}
}
// ===========================================================
// 검색 기능
// ===========================================================
function vulSearchBtnClick() {
	sendData.page=0;
	lvar_event_pageNum = 0;
	var keyword = $('#searchKeyword').val().trim();
	if (keyword == null || keyword == '') {
		sendData.searchKeyword = null;
		lvar_event_TotalCnt = original_cnt;
		lf_serviceCall700019Callback();
	} else {
		sendData.searchKeyword = keyword;
		sendData.getNewCnt = 'Y';
	}

	lf_serviceCall600622();
}
