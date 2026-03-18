var lvar_param_prefix  = "event_image_assurance_detail"; 
var lvar_param_service = lf_serviceCall600401; 

$(function () {
	var dashboardCspData = JSON.parse($('#dashboardCspData', opener.document).attr(window.name)); // 호출한 부모 브라우저의 값을 가진 속성을 가져옴

	registryUuid = dashboardCspData['registryUuid'];
	registryName = dashboardCspData['registryName'];
	selectedScanStatus = dashboardCspData['selectedScanStatus'] ? scanStatus[dashboardCspData['selectedScanStatus']] : null;
	if(selectedScanStatus) { // 선택 된 스캔 상태가 존재하는 경우
		replaceSelectedDivCss(selectedScanStatus);
		searchKeywordList.push("scan_status|"+selectedScanStatus); // 최초 진입 시 scanStatus 상태 전달. 없는경우 totals 조회
	}
	createScanResult();
	  
	// 페이지 종료 시 콜백 함수. 종료 직전은 beforeunload
	window.addEventListener('beforeunload', function(event) {
	  if (window.opener && !window.opener.closed) {
	    window.opener.lf_serviceCall600403(lvar_param_prefix + '|' + registryUuid);
	  }
	});
});

/**
 * 최초 데이터 조회 시 호출 
 */
function createScanResult(){
	lf_serviceCall600401(); // 최초 데이터 조회 
}

/**
 * 스캔 결과에 대한 데이터 구분
 */
function scanCountDetail(data){	
	var scanResultCnt = data.body.scanResultCnt; 
	var totalCnt = 0; 
	var assuranceImageCnt = 0;
	var unAssuranceImageCnt = 0; 
	$.each(scanResultCnt, function(index, value){
		var resultCnt = value['count'];
		var imageAssuranceStatus =  value['image_assurance_scan_status'];
		
		// 도커 레지스트리인 경우 resultCnt의 총 합 = 전체 스캔 갯수
		totalCnt += resultCnt;
		
		// 이미지 보증 결과 
		if(imageAssuranceStatus == "assurance") assuranceImageCnt += resultCnt;
		else if(imageAssuranceStatus == "unAssurance") unAssuranceImageCnt += resultCnt;
	});
		
	if(data.body.registryImageCnt){ // 레지스트리 전체 이미지 갯수
		totalCnt = data.body.registryImageCnt; 
	}
	
	$("#totalsCnt").html(totalCnt);
	$("#assuranceCnt").html(assuranceImageCnt);
	$("#unAssuranceCnt").html(unAssuranceImageCnt);
	$("#etcCnt").html(totalCnt-assuranceImageCnt-unAssuranceImageCnt);
}	
/**
 * 스캔 현황 카운트 클릭 시 필터링 후 조회
 */
function cntClick(selectedClassName){
	if(selectedClassName) selectedScanStatus = selectedClassName; // 이미지 스캔 상태값 저장
	
	// 선택된 현황판의 상태에 따라 css를 변경하는 함수 호출 
	replaceSelectedDivCss(selectedClassName);
	searchBtnClick();
}
/**
 * 검색 버튼 클릭 시 서비스 필터링 후 조회
 */
function searchBtnClick(selectedStatus){
	searchKeywordList = []; // 검색 키워드 배열 초기화 후 진행
	searchKeyword = $("#searchKeyword").val(); 
	if(!searchKeyword){
		searchKeyword = null; // 검색 키워드 조건이 없는경우, 필터링 조건 초기화
	}
	else{
		searchKeywordList.push("image_tag|"+$("#searchKeyword").val());
	}
	if(selectedScanStatus && selectedScanStatus != 'totals'){ // 스캔 상태도 필터링 조건에 추가 + totals는 필터링 검색 x
		searchKeywordList.push("scan_status|"+selectedScanStatus);
	}
	
	detailInfoFiltering(); // 검색 조건에 따라 데이터 검색
}

/**
 * 새롭게 조건에 따라 쿼리를 조회할 때 호출
 * 조건 검색은 처음페이지 부터
 */
function detailInfoFiltering() {
	eventTotalCnt = 0; // 페이징 total cnt 초기화
	lf_serviceCall600401(0); // 데이터 초기화 및 호출. 검색 버튼 클릭시 페이지버튼은 무조건 0
}

/**
 * @service 600401
 * 상세 데이터 조회 
 * @body page,topn,term
 * @callback
 */
function lf_serviceCall600401(pageNum){
	if(!statusLoading){ // 로딩 중이 아닌경우, 로딩 상태로 변경
		cf_contPreloader(lvar_param_prefix+'_result_table'); 
		statusLoading = true;
	}
	
	if(!pageNum && pageNum != 0){
		pageNum = eventPageNum; // default = 0 
	}
	else{
		switch(pageNum){
		case 'first': pageNum = 0; break;
		case 'previous': pageNum = eventPageNum-1; break;
		case 'next': pageNum = eventPageNum+1; break;
		case 'last': pageNum = Math.ceil(eventTotalCnt/eventPageCnt)-1; break;
		}
	}
	eventPageNum = pageNum; // 페이지 넘버 재정의
	var body ={
		'topic': lvar_param_prefix,
		"page" : eventPageNum * eventPageCnt,
		'topn' : eventPageCnt,
		"registry_uuid" : registryUuid,
	};
	// 캐시 데이터 사용유무 체크
	if(useCache) { // 캐시 사용하는 경우(페이지 이동, 필터링 검색 시)
		body["isLoaded"] = false;
		body["pageCacheKey"] = lvar_param_prefix + '|' + registryUuid;
	}
	else{ // 캐시를 사용하지 않는 경우(최초 진입 시, 페이지 리로드 시)
		body["isLoaded"] = true;
	}
	//scan Status가 있는경우 body에 추가 
	if(selectedScanStatus) body["scanStatus"] = selectedScanStatus; 
	// 검색 키워드가 있는경우 body 에 추가 
	if (searchKeywordList.length > 0) body['keyword'] = searchKeywordList; 

	cf_requestServer(_TR_DASHOBOARD_IS_DASHBOARD_DETAIL, body, lf_serviceCallBack600401);
}
function lf_serviceCallBack600401(data,body){
	// 캐시가 사용되지않앗을 경우 
	if(!useCache) {
		// 현황판 현재 시점으로 최신화
		scanCountDetail(data);
		
		useCache = true; // 캐시 사용으로 변경 
		lf_serviceCall600401(); // 재호출. 캐시 데이터에서 정보 조회
	}
	else {
		createResultPage(data,body); // 기존 콜백 로직
	}	
}
function createResultPage(data,body){
	if(statusLoading){ // 로딩 중인 경우 로딩 창 취소
		cf_contPreloader(lvar_param_prefix+'_result_table'); 
		statusLoading = false;
	}

	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	table.clear().draw(); 
	var dataList = data.body.dataList;
	
	$.each(dataList, function(idx, rowData){
		var tableRow = table.row.add({
			"Type": rowData['scan_type']? imageScanType[rowData['scan_type']] : '스캔 미실행',
			"Registry": registryName,
			"Digest": rowData['digest']? rowData['digest'] : '-',
			"Image Tag": rowData['image_tag']? rowData['image_tag'] : '-',
			"Request User": rowData['request_user']? rowData['request_user'] : '-',
			"Result": rowData['scan_result'] ? imageScanResult[rowData['scan_result']] : '-',
			"Created Date":	rowData['created_date'] ? rowData['created_date'] : '-',
			"Finished Date": rowData['finished_date'] ? (rowData['created_date'] ? rowData['finished_date'] : '-') : '-',
		}).draw(false).node();
		$(tableRow).data(rowData);
	}); 
	
	// 페이징 버튼 생성
	createPagingBotton(data.body.allDataCnt); // 페이지 갯수 cnt 전달
	// 페이징 버튼 클릭시 발생되는 이벤트 정의
	lf_serviceButtonDataCallback(); 
	// 스캔 결과 데이터 카운트 그려주는 함수 
	//scanCountDetail(); 
}

//  페이징 버튼 클릭시 발생되는 이벤트 정의 (공통로직에 포함되도 될듯?)
function lf_serviceButtonDataCallback(){
	var pageArr = $('#detail_info_paging').val().split('_');
	var totalCnt = pageArr[0] ? pageArr[0] : eventTotalCnt;
	var page = eventPageNum ? eventPageNum : 0;
	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	var len = pageArr[1];
	var pagingValue = totalCnt+"_"+len+"_"+page;
	var info = {
		"start":0,
		"page": Math.ceil(totalCnt/len) <= page ? Math.ceil(totalCnt/len)-1 : page, // 페이지 번호가 더 큰경우에는 마지막 번호로
		"pages": Math.ceil(totalCnt/len),
		"length": len,
		"recordsTotal": totalCnt,
		"recordsDisplay": totalCnt,
		"all": false
	};
	
	var api = table.columns.adjust();
	var settings = api.settings()[0];
	$('#detail_info_paging').val(pagingValue);	
}

/**
 * @param 조회 페이지 길이
 * 페이징 버튼 생성
 */
function createPagingBotton(totalCnt){
	var totalCnt = totalCnt;

	eventTotalCnt = totalCnt;
 	var page = eventPageNum ? eventPageNum : 0;

	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	var len = table.page.len();
	
	eventPageCnt = len;
	var pagingValue = totalCnt+"_"+len+"_"+page;
	var info = {
		"start":0,
		"page": Math.ceil(totalCnt/len) <= page ? Math.ceil(totalCnt/len)-1 : page, // 페이지 번호가 더 큰경우에는 마지막 번호로
		"pages": Math.ceil(totalCnt/len),
		"length": len,
		"recordsTotal": totalCnt,
		"recordsDisplay": totalCnt,
		"all": false
	};
	
	var api = table.columns.adjust();
	var settings = api.settings()[0];
	if(totalCnt >= 0){
		_fnUpdatePaginate(settings,info,lvar_param_service); // page_common.js 에 정의
	}
	$('#detail_info_paging').val(pagingValue); // 페이징 결과값 저장
}

/** 
 * Datatable length 변경 시 호출되는 함수
*/ 
function _fnLengthChange(length){
	eventPageCnt = length;
	lf_serviceCall600401(); // 데이터 조회 
}

