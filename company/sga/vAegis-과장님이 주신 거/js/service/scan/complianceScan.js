/**
 * 스캔> 클러스터 규정준수 상수 값 정의
 */
var COLOR_OF_RESULT = {
	passed: '#4E66DC',
	failed: '#B93C3C',
	WARN:'grey', excepted:'grey', skipped:'grey'
}
var scanning = false; // 스캔 현황
var frameworkUuidList = []; // 프레임워크 리스트 id 저장
const _scanTime = 60000; // 총 스캔 시간
var taskLogDataList = null;
var subtaskLogDataList = null;
var taskLogDataResultCount = null;

/**
 * 페이지 로드 시 호출되는 함수
 * 1. 필터링(키워드 검색, 현황판 클릭 시)
 * 2. 드롭다운
 */
$(document).ready(function () {
	// 검색 버튼 클릭 시 이벤트 정의
	$('#searchKeyword').on('keyup', function (event) {
		if (event.keyCode === 13) { // enter
			executeSearch(this); // 검색 실행
		}
	});
	$('#searchBtn').on('click', function () {
		var searchKeywordInfo = document.querySelector('#searchKeyword'); // 검색 실행 시 해당 searchKeyword 를 가져옴
		executeSearch(searchKeywordInfo); // 검색 실행
	});
	
	// 모든 테이블 redraw 시 drop down 메뉴 추가 (redraw 하면 테이블 이외의 사용자 커스텀 모두 날아가기 때문)
	complianceScanTable.on('draw', function () {
		drawSubtaskListTree();
		$('.view_hide_btn_icon').removeClass('view_hide_active');
	});
});
/**
 * 검색(datatables)
 * 1. 키워드 검색 : executeSearch
 * 2. 현황판 클릭 시 : scanStatusRefresh
 */
function executeSearch(thiz) {
	complianceScanTable.search(thiz.value).draw();
}
function scanStatusRefresh(callOut) { // 상단 result count 클릭 시 동작
	var searchValue = callOut === 'total'? '' : callOut;
	complianceScanTable.columns(9).search(searchValue).draw();
}

/**
 * 페이지 로드 시 
 * 1. 프레임워크 리스트 생성 (ServiceTr800405)
 * 2. 24시간 이내 스캔 리스트 조회 + 스캔 진행 상태 조회 (ServiceCall800406) 
 * 3. 스캔 상태 주기적으로 조회(ServiceTr800408)
 */
$(function(){
	// 클러스터 리스트 생성	
	cf_requestServer(_TR_POLICY_CLUSTER_INFO, null, lf_serviceCall800060CallBack,false); 
	// 24시간 이내 스캔 진행 상태 조회
	cf_requestServer(_TR_COMPLIANCE_SCAN_LIST, null, lf_serviceCall800406CallBack,false); 
});
//클러스터 리스트 생성
function lf_serviceCall800060CallBack(data) {
	var clusterList = data.body.clusterList;
	clusterList.forEach(function(data){
		$("#clusterList").append( `<option value=${data.uuid}>${data.name}</option>`);
		$("#clusterList").niceSelect("update");
	})
	// 프레임워크 리스트 생성 함수 호출 
	selectFrameworkList();
}

/**
 * 프레임워크 리스트 생성 호출 함수 
 */
function selectFrameworkList(clusterUuid){
	var body ={
		'clusterUuid' : clusterUuid? clusterUuid : $("#clusterList option:selected").val()
	};
	cf_requestServer(_TR_CLUSTER_FRAMEWORK_STATUS, body, lf_serviceCall800405CallBack,false); 
}

/**
 *  프레임워크 리스트 생성
 */ 
function lf_serviceCall800405CallBack(data) {
	$("#frameworkList option").remove(); // 기존 프레임워크 리스트 초기화
	
	var frameworkList = filterFirstOccurrenceByProperty(data);
	// 조회된 프레임워크 리스트가 없는경우
	if(frameworkList.length ==0) { 
		$("#frameworkList").append(`<option>-</option>`);
	}
	// 조회된 프레임워크 리스트가 있는 경우
	frameworkList.forEach(function(data){
		$("#frameworkList").append(`<option value=${data.id}>${data.name}</option>`);
		// 프레임워크 리스트 id 저장
		frameworkUuidList.push(data.id);
	});	
	
	$("#frameworkList").niceSelect("update");
}

// 24시간 이내 최신 스캔된 진행 상태 조회 
function lf_serviceCall800406CallBack(data){
	console.log("data: ", data);
	var clusterClScanInfo = data.body.clusterClScanInfo; // 스캔 결과 모두 가져오기
	var scanlength = data.body.clusterClScanInfo.length; // 길이 가져오기 
	var clScanStatus;
	var clusterUuid;
	var frameworkUuid;
	if(scanlength==0){ // 24시간 이내 스캔 항목이 없는 경우
		console.log("no scanning data");
	}
	else{  
		// 24시간 이내 스캔 항목이 있는 경우 해당 항목을 출력
		$.each(clusterClScanInfo, function(idx,scanInfo){
			// 스캔 상태 체크 
			if(!clScanStatus) clScanStatus = scanInfo.scan_status;
			if(!clusterUuid)  clusterUuid = scanInfo.cluster_uuid; 
			if(!frameworkUuid) frameworkUuid = scanInfo.framework_id;
			// 스캐닝인 경우에는 해당 clusterUuid 및 FrameworrkUuid 설정 을 마지막으로 종료(해당 결과를 보여주도록한다)
			if(clScanStatus ==  'SCANNING'){
				clScanStatus = scanInfo.scan_status;
				clusterUuid = scanInfo.cluster_uuid; 
				frameworkUuid = scanInfo.framework_id;
				return false;
			}		
		});
		// 선택 항목으로 최신화
		if(clusterUuid && $('#clusterList option[value="' + clusterUuid + '"]').length != 0) {
			$("#clusterList").val(clusterUuid).niceSelect("update");	
			selectFrameworkList(clusterUuid); // 프레임워크 리스트 변경
		}
		else{
			$("#clusterList option:eq(0)").prop("selected", true).niceSelect("update");
		}
		if(frameworkUuid && $('#frameworkList option[value="' + frameworkUuid + '"]').length != 0) {
			$("#frameworkList").val(frameworkUuid).niceSelect("update");	
		}
		else{
			$("#frameworkList option:eq(0)").prop("selected", true).niceSelect("update");
		}
		// 2. 스캔 중이라면? 800408 실행 / 아니라면? 800410 실행 
		if(clScanStatus == "SCANNING"){
			// 스캔 버튼 비활성화
			scanning = true;
			scanButtonRefresh(scanning);
			// 프로그래스바 show 및 동작
			loadProgress(clusterClScanInfo.scanning_time);
			// serviceCall800408 : 스캔 상태 체크 후 스캔 완료 시 해당 데이터 호출
			cf_requestServer(_TR_COMPLIANCE_SCAN_STATUS, null, lf_serviceCall800408CallBack);
		}
		else{
			// serviceCall800410 : 24시간 기준 최신 스캔 상태 조회
			cf_requestServer(_TR_COMPLIANCE_SCAN_STATUS_LATEST, null, lf_serviceCall800410CallBack); 
		}
	}
}

/**
 * 규정 준수 스캔 서비스 호출 
 */
function selectComplianceScanResult(){	
	// 1. body 데이터 생성 
	var body ={
		'clusterUuid': $("#clusterList option:selected").val(),
		'clusterName': $("#clusterList option:selected").text(),
	};
	var frameworkUuid = {}; 
	if($("#frameworkList option:selected").val() =='-') {
		swal("클러스터 규정 준수 스캔 정책을 설정해 주십시오", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
		});
		return;
	}
	else{
		body['frameworkUuid'] = $("#frameworkList option:selected").val();
		body['frameworkName'] = $("#frameworkList option:selected").text();
	}
	
	// 2. 스캔 현황 체크. 스캔 중인 경우 scan서비스 비활성
	if(scanning){
		return;
	}
	else{
		swal("규정 준수 스캔", "스캔을 진행하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) { // 확인 버튼 클릭 시
				// 스캔 요청
				cf_requestServer(_TR_COMPLIANCE_SCAN, body, lf_serviceCall800407CallBack);
			} else {
				swal("스캔 요청 취소", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	}
}
// 스캔 요청 완료 후 호출되는 콜백. 
function lf_serviceCall800407CallBack(data,body){
	swal("스캔 요청 성공", "스캔 작업시간이 다소 소요될 수 있으니 참고해주십시오.", "./assets/images/icon_alert03.png", {
		buttons: "확인"
	});	
	scanning = true;
	scanButtonRefresh(scanning);
	loadProgress(); // 프로그래스 바 동작
	// serviceCall800408 : 스캔 상태 체크 후 스캔 완료 시 해당 데이터 호출하는 서비스
	cf_requestServer(_TR_COMPLIANCE_SCAN_STATUS, body, lf_serviceCall800408CallBack); // 스캔 요청 body 데이터 그대로 전달
}
// 스캔 상태 체크 완료 후 콜백
function lf_serviceCall800408CallBack(data,body){
	scanning = false; // 스캔 버튼 활성화
	scanButtonRefresh(scanning);
	loadProgress(_scanTime); // 프로그래스바 숨김
	
	// data 결과에 따라 createScanStatusTable 호출
	if(!data.body){
		// serviceCall800410 : 24시간 기준 최신 스캔 상태 조회
		cf_requestServer(_TR_COMPLIANCE_SCAN_STATUS_LATEST, null, lf_serviceCall800410CallBack); 
	}
	else{  // 스캔 결과 데이터가 없는경우 ( 에러 , 혹은 설정된 컨트롤이 없을 떄 발생)
		// 에러 발생한 경우
		if(data.body.scanErrMessage){
			var clusterName = $(`#clusterList option[value=${body.clusterUuid}]`).text();
			var frameworkName = $(`#frameworkList option[value=${body.frameworkUuid}]`).text();
			
			var scanErrMessage = data.body.scanErrMessage.split(':');
			var lastIndex = scanErrMessage.length - 1;
			swal("규정 준수 스캔 에러", `규정 준수 스캔 과정에서 에러가 발생하였습니다. \nCluster(${clusterName}), Framework(${frameworkName}) \nMessage(${scanErrMessage[lastIndex].trim()})`,"./assets/images/icon_alert03.png", {
				buttons: "확인"
			});	
		}
		// 스캔은 성공하였으나, 결과가 없는경우
		else{
			noScanResult();
		}
	}
}
// 24시간 이내 최신 스캔 데이터 체크 후 콜백
function lf_serviceCall800410CallBack(data){
	if(!data.body){
		noScanResult();
	}
	else{
		createScanStatusTable(data, false);
	}
}

/** 
 * 스캔 버튼 활성화/비활성화 
*/
function scanButtonRefresh(scanning){
	if(scanning){
		$("#clScanBtn").text("스캔 중");
		$("#clScanBtn").css({
			'background-color':'grey',
			'border-color':'grey'
		});
	}
	else{
		$("#clScanBtn").text("스캔");
		$("#clScanBtn").css({
			'background-color':'#2365af',
			'border-color':'#2365af'
		});
	}
}
/**
 * 프로그래스 바 
 * 프로그래스 바 동작 중인 경우 현황판 hide. 
 * 프로그래스 바 동작 완료인 경우 현황판 show, 프로그래스바 설정 초기화(1초 딜레이).
 */
var MyCounter;
function loadProgress(starttime){
	$('.progressbarBox').show();

	// 로딩바 초기화
	var countTime = _scanTime; // 1분
	var percent = 0;

	if (starttime) {
		countTime -= starttime;
		percent = Math.floor(starttime / _scanTime * 100);
	}

	$('.Loading span').css('width', percent + '%');
	
	if(percent >= 100){
		clearInterval(MyCounter);
		$('.progressbar p').text('Finished');

		setTimeout(function() {
			$('.progressbarBox').hide(); 
			// 기존 프로그래스 바 형태로 초기화
			$('.progressbar p').text('Scanning..');
  			$('.Loading span').css('width', '0%');
		}, 1000); // 1초 뒤 숨김
		return;
	}
	
	var dotCount = 1;
	MyCounter = setInterval(function(){
		if(dotCount > 5) dotCount = 1; 
		else dotCount++; 
		
		countTime -= 1000;
		if(countTime > 0){
			// css 값을 주기적으로 변경
			percent += 1.6;
	  		$('.Loading span').css('width', percent + '%');
			$('.progressbar p').text('Scanning' +  '.'.repeat(dotCount));
		}else{
			clearInterval(MyCounter);
			$('.progressbar p').text('Wait...');
			loadProgress(); // 재호출. 0 부터 재시작
		};
	},1000);  // 1초당 1씩증가
}
/**
 * rowData null 처리('-')
 */
function transformDataOfNull(item) {
	var transformData = typeof item !== 'undefined' && item !== null && item !== 'null' && item !== '' ? item : '-';
	return transformData;
}

/**
 *  프로퍼티의 중복을 제거하면서 해당 프로퍼티 값의 첫 번째 등장 객체만 남기는 로직
 */
function filterFirstOccurrenceByProperty(data){
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

/** 
 * 스캔 현황 카운트 현황판, 테이블 생성
*/
function createScanStatusTable(data, statusRefresh){	
    mscrollbarReset(); // 스크롤바 재생성.(페이지 길이에 따라 스크롤바 유무를 정해준다.)
    
	taskLogDataList = data.body.taskLogDataList;
	subtaskLogDataList = data.body.subtaskLogDataList;
	taskLogDataResultCount = data.body.taskLogDataResultCount;

	complianceScanTable.clear().draw();
	$.each(taskLogDataList, function(idx, rowData){
		
		var severityOrdering = 0;
		switch(rowData['severity']){
			case "CRITICAL":
				severityOrdering=0;
				break;
			case "HIGH":
				severityOrdering=1;
				break;
			case "MEDIUM":
				severityOrdering=2;
				break;
			case "LOW":
				severityOrdering=3;
				break;
			default: //unknown, '-'
				severityOrdering=4;
				break;
		}
		
		var btnIcon_html = '';
		btnIcon_html += '<div class="view_hide_btn_icon" data-onOff="' + rowData["uuid"] + '_task" onclick="onoffDisplay(this)"></div>';
		
		var result_html = '';
		result_html += '<div class="result_cnt_box">';
		result_html += '	<div class="passed_cnt_box">' + rowData["passed_subtask_count"] + '</div>';
		result_html += '	<div class="failed_cnt_box">' + rowData["failed_subtask_count"] + '</div>';
		result_html += '	<div class="error_cnt_box">' + rowData["error_subtask_count"] + '</div>'; 
		result_html += '	<div class="etc_cnt_box">' + rowData["etc_subtask_count"] + '</div>';  // etc count 추가
		result_html += '</div>';
		var scanRow = complianceScanTable.row.add([
			btnIcon_html,
			result_html,
			transformDataOfNull(rowData["active_framework_name"]),
			transformDataOfNull(rowData["task_name"]),
			transformDataOfNull(rowData["description"]),
			transformDataOfNull(rowData["remediation"]), // .replace(/\n|`/g, " ") 추가 필요
			transformDataOfNull(rowData["severity"]),
			transformDataOfNull(rowData["date"]), // 이전 created_at
			rowData["uuid"], // index 8. subtask history uuid값
			rowData["result"],// transformDataOfNull 제거 필요
			severityOrdering
		]).draw();
		$(scanRow).find('td').addClass('long_w');
	});
	initScanResultCnt();
}

/**
 * 스캔 결과 카운트 초기화
 */
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

	// 검색 결과(search) 또한 초기화 
	complianceScanTable
	.search('')
	.columns(9).search('')
	.draw();
}
/**
 * 10-24 추가) 스캔은 성공하였으나, 스캔 결과가 없는 경우 
 * 1) 스캔 데이터 초기화
 * 2) 테이블 초기화
 * 3) 현황판 count 초기화
 */
function noScanResult(){
	// 스캔 데이터 초기화
	taskLogDataList = null;
 	subtaskLogDataList = null;
	taskLogDataResultCount = null;
	// 테이블 초기화
	complianceScanTable.clear().draw();
	 // 현황판 count 초기화
	initScanResultCnt();
}


/**
 * drop down 메뉴 관리 
 * 
 */
function onoffDisplay(thiz) {
	var dataOnOff = $(thiz).data('onoff');
	var hasClassActive = $(thiz).hasClass('view_hide_active');
	if (hasClassActive) {
		// 클릭시 숨기기
		$('.subtask_bundle[data-onOff="' + dataOnOff + '"]').css('display', 'none');
		$('.subtask_detail[data-onOff="' + dataOnOff + '"]').slideUp();
		$('.view_hide_btn_icon[data-onOff="' + dataOnOff + '"]').removeClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onOff="' + dataOnOff + '"]').removeClass('view_hide_active');
	} else {
		// 클릭시 보이기
		$('.subtask_bundle[data-onOff="' + dataOnOff + '"]').css('display', 'table-row');
		$('.subtask_detail[data-onOff="' + dataOnOff + '"]').slideDown();
		$('.view_hide_btn_icon[data-onOff="' + dataOnOff + '"]').addClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onOff="' + dataOnOff + '"]').addClass('view_hide_active');
	}
	// 공통 함수에 존재하는 mCustomScrollbar 함수가 제대로 동작하지 않아 직접 실행
	//$('section').mCustomScrollbar("update");
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
			//jkcho actual value 문자 개행 수정
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
	// 10-24 추가. taskLogDataList null 체크
	if(!taskLogDataList){
		return false;
	}
	taskLogDataList.forEach((task) => { // task 하위에 subtaskTr
		var rowSubtaskElementHtml = '';
		rowSubtaskElementHtml += '<tr id="rowSubtaskTr_' + task.uuid + '" data-onoff="' + task.uuid + '_task" data-scanner=' + task.scanner + ' class="subtask_bundle" style="display: none">'; // 룰 묶음
		rowSubtaskElementHtml += '	<td colspan="8"></td>'; 
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
			//subTaskNameHtml += '	<div class="subtask_catagory_detail">' + (rowSubtaskDiv.length + 1) + '. ' + transformDataOfNull(subtask.subtask_name) + '</div>' + '<div style="margin-left: 10px; font-weight: bold; color:' + COLOR_OF_RESULT[subtask.scan_result] + '">[' + transformDataOfNull(subtask.scan_result) + ']</div>';
			// 넘버링 대신 subtask_id 출력되도록 변경 
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


