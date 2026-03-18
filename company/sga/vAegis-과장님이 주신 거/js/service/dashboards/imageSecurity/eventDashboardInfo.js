/**
 * 페이징 상수 값 정의
 * lvar_event_pageNum 
 * lvar_event_pageCnt 
 * lvar_event_TotalCnt
 * term 
 * registry_uuid
 * searchKeyword
 */
var eventPageNum = 0;
var eventPageCnt = 10;
var eventTotalCnt = 0;

var registryUuid;
var registryName;

var useCache = false; // 캐시 키 사용 유무
var statusLoading = false; // loading check flag

/**
 * 스캔 상태 메시지
 */
var imageStatusList  = {
"ERROR_IN_REQUESTING_ANALYSIS": "분석 요청 실패"
, "WAITING_FOR_ANALYSIS": "분석 대기"
, "ANALYZING": "분석 중"
, "ANALYSIS_COMPELETED": "분석 완료"
, "ERROR_IN_ANALYZING": "분석 중 오류 발생"
, "EVALUATING": "정책 평가 중"
, "ERROR_IN_EVALUATING": "정책 평가 중 오류 발생"
, "EVALUATION_COMPLETED": "정책 평가 완료"
}
/** 
 * 스캔 타입 메시지
*/
var imageScanType = { 
	"MANUAL" : "수동 스캔",
	"POLICY_REEVALUATION" : "정책 재평가",
	"AUTO" : "자동 스캔"
};
/**
 * 스캔 결과 메시지
 */
var imageScanResult = { 
	"PASS" : "성공",
	"NO_PASS" : "실패",
	"ERROR" : "에러",
	"WARN" : "경고",			
};

/**
 * 검색 기능 시 사용되는 변수 
 * 사용 되는 페이지 : 대시보드 > malware, scan , scan completion , image assurance
 */
var searchKeyword; // 검색 목록 
var searchKeywordList = [];
var selectedScanStatus; // 선택된 필터링 옵션

/**
 * 사용 되는 페이지 : 대시보드 >  scan , scan completion , image assurance
 * 스캔 상태 상수 값 정의 
 */
var scanStatus ={
	// scan
	'Success' : 'successed',
	'Fail': 'failed',
	// scan completion
	'Scan Complete' : 'scanCompleted',
	'Scanning': 'scanning',
	'No Scan': 'notScan',
	'Waiting Scan': 'watingScan',
	// image assurance
	'Assurance' : 'assuranceImage'
};

/**
 * 사용 되는 페이지 : 대시보드 > vulnerablities
 * table Click 시 backgroundcss 정의 
 */
var focusUuid; // 저장 시킬 focusUUid
var focusCss ={
	"focusColor" : "#2f3742",
	"noFocusColor" : "#121212"
};

/**
 * 사용 되는 페이지 : 대시보드 > vulnerablities , scan , scan completion , image assurance
 * 현황판 선택 시 해당 되는 class 값과 속성 매칭
 */
var classNameParam = {
	'tc_critical' :'critical',
	'tc_high':'high',
	'tc_medium':'medium',
	'tc_low' : 'low',
	'tc_info': 'info',
	'tc_non' :'unknown'
}

/**
 * 공통 시작 함수
 */
$(function () {
	document.onkeydown = NotReload; // 새로고침 제한 함수 호출
	var dashboardCspData = JSON.parse($('#dashboardCspData', opener.document).attr(window.name)); // 호출한 부모 브라우저의 값을 가진 속성을 가져옴
	term = dashboardCspData['term'];
	registryUuid = dashboardCspData['registryUuid'];
});
function NotReload(){ 
    if( (event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) || (event.keyCode == 116) ) {
        event.keyCode = 0;
        event.cancelBubble = true;
        event.returnValue = false;
    } 
}
/**
 * 사용 되는 페이지 : 대시보드 > vulnerablities , scan , scan completion , image assurance
 * 선택 된 상황판의 css 속성을 변경해주는 함수
 */
function replaceSelectedDivCss(className) {
	// 해당 클래스와 동일 요소(li)에 적용된 스타일 태그 제거
	$("."+className).parent().find('div').each(function() {
		// total은 제외 
		if(this.className != 'total') $(this).css('background-color','#262A37'); // common.css --sel-color
	});
	// 해당 클래스에 새로운 css 스타일 적용
	// total은 제외 
	if(className != 'total') $("."+className).css('background-color','#121212');
}

 