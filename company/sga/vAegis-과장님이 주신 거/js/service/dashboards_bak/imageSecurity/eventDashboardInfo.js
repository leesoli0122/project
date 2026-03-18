/**
 * TODO : 페이징 상수 값 정의
 * lvar_event_pageNum 
 * lvar_event_pageCnt 
 * lvar_event_TotalCnt
 * term 
 * registry_uuid
 * searchKeyword
 */

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

$(function () {
	document.onkeydown = NotReload; // 새로고침 제한
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