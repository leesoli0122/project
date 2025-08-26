/**
 * 변수 값 정의
 */
var scanning  = false; // 스캔 현황 체크
var scanList = []; // 스캔 진행시킬 목록
var checkImageList = []; // 체크 항목을 저장하는 List
// 조회 데이터 저장
var registryUuid = null; // 선택한 레지스트리의 id 값을 저장
var scanResult = null; // 선택한 레지스트리의 전체 스캔 결과 데이터를 저장 
// Type 기준
var scanSuccess = ['PASS','WARN']; // scan_result
var scanFail = ['NOT_EVALUATED','NO_PASS','ERROR']; // scan_result
var malware = ['malwareDetectionAttributeEvaluation','malwareDetectionFileEvaluation','malwareScanEvaluation','malwareScanFailEvaluation'];
var cve = ['vulnCveAttributeEvaluation', 'vulnCvssAttributeEvaluation', 'vulnDetectionPackageEvaluation', 'vulnScanFailEvaluation' ];
var sensitive = ['fileGeneralAttributeEvaluation','fileGeneralContentsEvaluation']; // 민감 정보 데이터
var content = ['fileDeploymentAttributeEvaluation','fileDeploymentBuildEvaluation', 'fileDeploymentCredentialAccessEvaluation', 'fileDeploymentStorageEvaluation' , 'filePackageAttributeEvaluation', 'filePackageIntegrityEvaluation' ];
//row 데이터 변경
var scanTypeList = {
	'MANUAL' : '수동 스캔', 'AUTO' : '자동 스캔' , 'POLICY_REEVALUATION' : '정책 재평가', 'NOSCAN': '스캔 미실행'
};
var imageStatusList  = {
"ERROR_IN_REQUESTING_ANALYSIS": "분석 요청 실패"
, "WAITING_FOR_ANALYSIS": "분석 대기"
, "ANALYZING": "분석 중"
, "ANALYSIS_COMPELETED": "분석 완료"
, "ERROR_IN_ANALYZING": "분석 중 오류 발생"
, "EVALUATING": "정책 평가 중"
, "ERROR_IN_EVALUATING": "정책 평가 중 오류 발생"
, "EVALUATION_COMPLETED": "정책 평가 완료"
, "NO_SCAN": "스캔 미실행"
};
var scanResultList  = { 
 "NOT_EVALUATED": "평가 미실행"
, "PASS": "성공"
, "ERROR": "에러"
, "NO_PASS": "실패"	
};
var scanPolicyList = {
"REJECT" : "DENY"
, "ACCEPT" : "ALLOW"
};
var scanPolicyList = {
"REJECT" : "DENY"
, "ACCEPT" : "ALLOW"
}; 
var scanOperator ={ 
'EQUAL': 'equals(=)',
'NOT_EQUAL': 'not equals(!=)',
'LIKE': 'like',
'NOT_LIKE': 'not like',
'LOW': 'less than(<)',
'EQUAL_LOW': 'less than or equals(<=)',
'HIGH': 'greater than(>)',
'EQUAL_HIGH': 'greater than or equals(>=)',
};

// loading check flag
var statusLoading = false; 
function loading(isLoading,area){
	if(isLoading && !statusLoading) { // 로딩 요청이 오고, 현재 로딩 상태가 아닌경우
		cf_contPreloader(area); 
		statusLoading = true;
	}
	else if(!isLoading && statusLoading){ // 로딩 종료 요청이 오고, 현재 로딩 상태인 경우
		cf_contPreloader(area); 
		statusLoading = false;
	}
}
function convertNumber(data) {
	return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// 빈 객체인지 체크하는 함수
function isEmptyObj(obj)  {
  if(obj.constructor === Object
     && Object.keys(obj).length === 0)  {
    return true;
  }
  return false;
}
/** 
 * 페이지 로드 시 호출되는 함수
*/
$(function(){	
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
	
	// 페이지 호출 시 레지스트리 목록 call
	lf_serviceCall600074();
	lf_serviceCall800400(); // 추가. 800400 IS 스캔 현황 조회
    lf_setModal(); // imageScanModal.js. 정책 Modal 설정
});
/**
 * 키워드 검색(datatables)
 */
function executeSearch(thiz) {
	var table = $('#statusImageScanTable').DataTable();
	table.search(thiz.value).draw();
}

function lf_serviceCall800400(){
	cf_requestServer(_TR_SCAN_IS_SCAN_STATUS,null,lf_serviceCall800400CallBack);
}
function lf_serviceCall800400CallBack(data){ // 스캔이 완전히 완료되는 경우에 호출되는 함수
	if(data.body.refresh == "true"){ // 스캔 항목이 있어, 이후 리프레시가 필요한경우 
		if(scanning){ // 어디선가 상태 체크하여 scanning이 종료되었을 경우를 제외하고 확실히 현재 스캔중인경우에만 리프레시
			registryScanStatusRefresh();
			scanningEvent(false);
		}
	}	
	else{ // 조회 시작 부터 스캔 항목이 없는 경우
		scanningEvent(false);
	}
}
// is_registry 테이블 ROW 조회(비동기)
function lf_serviceCall600074(){
	cf_requestServer(_TR_CLOUD_CONTAINER_SERVER_STATUS, null, lf_serviceCall600074CallBack,false);
}
function lf_serviceCall600074CallBack(data) {
	var dataList = data.body.dataList;
	// Registry select에 Option 추가
	dataList.forEach(function(data){
		$("#registryList").append( "<option value='"+data.registry_uuid+"'>"+data.equipmarkname+"</option>");
		$("#registryList").niceSelect("update");
	});
	// + 현재 선택된 자산에 설정된 룰을 표시 
	lf_serviceCall800401();
	// + 스캔 중 Progressbar 동작. 이후 lf_serviceCall800400 동작에 의해 생성 유무 결정
	scanningEvent(true);
}

function lf_serviceCall800401(data){
	registryUuid = $("#registryList option:selected").val(); // 첫번째 조회되는 레지스트리 자산항목 선택. 저장
	var body = {
		'registry_uuid' : registryUuid
	};
	cf_requestServer(_TR_SCAN_REGISTRY_POLICY_STATUS,body,lf_serviceCall800401CallBack);
}
function lf_serviceCall800401CallBack(data){
	if(data.body.selectRegistryIsPolicyInfo.length === 0){
		$("#registryPolicyRulename").val("");
	}
	else{
		var policyData = data.body.selectRegistryIsPolicyInfo[0].policy_contents; 
		var elements = policyData.elements;
		
		// 1. ipt태그에 전달받은 데이터 Rule name 추가
		// ex) $("#registryPolicyRulename").val("rule name");
		$("#registryPolicyRulename").val(policyData.name);
		
		// 2. 모달에 전달받은 데이터 추가
		// 2-1. modal header
		$("#policy_rule_name").val(policyData.name);
		$("#policy_description").val(policyData.description);
		$("#policy_registry").val( $("#registryList option:selected").text());
		
		$("#policy_action").val(scanPolicyList[policyData.elements[0].elements[0].action]); // 변경 필요
	
		// 2-2. modal body
		createPolicyModal(elements); 
	}
}

// Registry 스캔 현황 버튼 클릭 시
function searchRegistryScanStatus(){
	// 1. 스캔 현황 리프레시 
	registryScanStatusRefresh();
	
	// 2. 스캔 상태 체크 후(800399) 스캔 중이 아닌경우 버튼 비활성화 종료
	cf_requestServer(_TR_SCAN_IS_SCAN_CHECK,null,function(data){
		if(data.body.scanning =="false") {
			scanningEvent(false);
		}
		else{
			//스캔 중인 경우 상태 변경 
			if(!scanning) scanningEvent(true);
		}
	});
}

// 레지스트리 uuid 전달하여 스캔 현황 리프레시(800402) 
function registryScanStatusRefresh(){
	var body = {
		'registry_uuid': registryUuid
	};
	loading(true,'imageScanBody'); //로딩
	cf_requestServer(_TR_SCAN_REGISTRY_SCAN_STATUS, body, lf_serviceCall800402CallBack); // Registry 스캔 현황 조회 
}	
function detailCheck(detailType, detailResult){
	var check = false; 
	$.each(detailType, function(i,data){
		if(!isEmptyObj(detailResult[data])){
			check = true;
			return false; // break
		}
	});
	return check;
}
function lf_serviceCall800402CallBack(data){
	scanList=[]; // 스캔 체크 리스트 초기화
    mscrollbarReset(); // 스크롤바 재생성.(페이지 길이에 따라 스크롤바 유무를 정해준다.)
	scanResult = data.body.registryScanStatus;
	
	// 현황 카운트
	var totalCount = 0;
	var scannedCount = 0;
	var successCount = 0;
	var failCount = 0;
	var contentCount = 0;
	var cveCount = 0; 
	var malCount = 0;
	var sensitiveCount = 0; 

	$.each(scanResult, function(idx, rowData){
		var result = rowData['scan_result'];
		var detailResult = rowData['detail_result'];
		// 전체 cnt 
		totalCount ++;
		// scaned, 스캔 성공 실패 cnt
		if(result && result != "undefined"){
			scannedCount++;
			
			if(scanSuccess.includes(result)){
				successCount++;
			}
			else if(scanFail.includes(result)){
				failCount++;
			}
		}
		if(detailResult && !isEmptyObj(detailResult)){
			detailResult = detailResult['result'];
			// cve cnt
			if(detailCheck(cve,detailResult)) cveCount++;
			// mal cnt 
			if(detailCheck(malware,detailResult)) malCount++;
			// sensitive data cnt 
			if(detailCheck(sensitive,detailResult)) sensitiveCount++;
			// content cnt
			if(detailCheck(content,detailResult)) contentCount++;
		}
	});
	$("#totalCount").html(convertNumber(totalCount));
	$("#scannedCount").html(convertNumber(scannedCount));
	$("#successCount").html(convertNumber(successCount));
	$("#failCount").html(convertNumber(failCount));
	$("#cveCount").html(convertNumber(cveCount));
	$("#malCount").html(convertNumber(malCount));
	$("#contentCount").html(convertNumber(contentCount));
	$("#sensitiveCount").html(convertNumber(sensitiveCount));
  	
  	createTable(scanResult,"total");
}
function scanStatus(cntId){
	if(scanning) return; // 스캔 상태인 경우 해당 함수 종료
	createTable(scanResult,$("#"+cntId).attr('class').split(' ')[0]);
}

// 테이블 생성 로직
function createTable(data,statusType){ 	
	loading(false,'imageScanBody');
	
	if(data) {
		$('#statusImageScanTable input').attr('id','allCheck'); //데이터가 있는 경우에만 올체크 활성화
	}
	// 09-25 추가. 테이블 생성 시 필터링 키워드 확인하여 필터링 검색 실행
	var searchKeywordInfo = document.querySelector('#searchKeyword'); // 검색 결과 호출 전 해당 searchKeyword 를 가져옴
	executeSearch(searchKeywordInfo); // 필터링 검색 실행
	
	checkImageList = []; // 리스트 초기화
	var table = $('#statusImageScanTable').DataTable();
	table.clear().draw(); // 테이블 초기화
	$.each(data,function(idx,rowData){	
		var detailResult = rowData['detail_result']; // Contents ,CVE, Malware, Sensitive Data
		var result   = rowData['scan_result']; // Scanned, Success, Fail 
	
		var targetRow = false;
		if(statusType == 'total'){
			targetRow = true;
		}
		if(result && result != "undefined"){
			if(statusType == 'scanned' || statusType == 'status'){
				targetRow = true;
			}
			else if(statusType == 'success' && scanSuccess.includes(result)){
				targetRow = true;
			}
			else if(statusType == 'fail'  && scanFail.includes(result)){
				targetRow = true;
			}
		}
		
		if(detailResult && !isEmptyObj(detailResult)){
			detailResult = detailResult['result'];
			
			if(statusType == 'cve' && detailCheck(cve,detailResult)){
				targetRow = true;	
			}
			else if(statusType == 'malware' && detailCheck(malware,detailResult)){
				targetRow = true;	
			}
			else if(statusType == 'sensitive' && detailCheck(sensitive,detailResult)){
				targetRow = true;	
			}
			else if(statusType == 'content' && detailCheck(content,detailResult)){
				targetRow = true;	
			}
		}
		// statusType조건에 만족하는 테이블만 출력
		if(targetRow){
			var digest = rowData['digest'] ? rowData['digest'] :'-' ; 
			var type = rowData['scan_type'] ? scanTypeList[rowData['scan_type']]: '스캔 미실행';
			var registry = rowData['registry']? rowData['registry']: '-'; 
			var repository = rowData['repository'] ? rowData['repository'] : '-';
			var createdDate = rowData['created_date']? rowData['created_date']:'-';
			var tag = rowData['tag']? rowData['tag']: '-'; 
			var imageTag = repository+':'+tag;
			var resultRow = result? scanResultList[result] : '-';
			if(resultRow == '-' && rowData['status']) {
				resultRow = imageStatusList[rowData['status']];
			}
			var finishedDate = result? rowData['updated_date'] : '-'; // 스캔이 완료된 경우에만 updated_date를 표시한다.
			if(createdDate == '-'){
				finishedDate = '-';  // 만약 created_date 가 null 인경우, finishedDate 도 표시하지 않도록 한다(에러 상황)
			}
			var message = rowData['message'] ? rowData['message'] : '-'; 
			var scanRow = table.row.add([
				"<td>"
				+`<input type="checkbox" id="${idx}" value="${digest}">
				  <label for="${idx}"></label>
				  `
				+
				"</td>",
				type,
				registry,
				digest,
			 	imageTag,
			 	message,
				resultRow,
				createdDate,
				finishedDate,
			]).draw(false).node();
			$(scanRow).data(rowData);
			$(scanRow).find('td').not(':first-child').on('click', function(e) {
			  	imageSecurityScanListClick(this);
			});
			$(scanRow).find('td:eq(0) input').on('click', function(e) { // 개별 체크박스 이벤트 처리
			  	updateScanList(idx,this);
			});
			var imageInfo = {
				'index':idx,
				'repository':rowData['repository'],
				'tag':rowData['tag'],
				'digest':rowData['digest'],
				'scan_result': rowData['scan_result'],
				'registry_uuid':registryUuid,
			};
			checkImageList.push(imageInfo); // 데이터 저장
		}		
	});

	$("#allCheck").on("click", function(e) {  // 전체 선택 체크박스 이벤트 처리
		var data = table.data();
		if ($(this).is( ":checked" )) {
			for (var i = 0; i < data.length; i++) { // 이쪽 수정 한 줄 범위만 체크되도록 수정 
	 			//$(`input:checkbox[type='checkbox'][id='${i}']`).prop("checked",true);
	 			$('#statusImageScanTable').find('tbody td:first-child :checkbox').prop("checked",true);
	      		updateScanListAll(i,checkImageList[i]);
	   		}
		} else {
			$("input:checkbox[type='checkbox']").prop("checked",false);
			scanList=[]; // 초기화
		}
	});
	
}
// 스캔 목록 최신화(전체 버튼 클릭 시)
function updateScanListAll(idx,rowData){
	var scanRow = rowData;
	if(!scanList.some(item => item.index === idx)){
		scanList.push(scanRow);
	}
	else{
		var index = scanList.indexOf(scanRow);
  		scanList.splice(index, 1);
	}
}
//스캔 목록 최신화
function updateScanList(idx,thiz){
	var rowData = $(thiz).parent().parent().data(); // td > tr 태그 정보 가져오기 
	var scanRow = {
		'index':idx,
		'repository':rowData['repository'],
		'tag':rowData['tag'],
		'digest':rowData['digest'],
		'scan_result': rowData['scan_result'],
		'registry_uuid':registryUuid,
	};
	if(!scanList.some(item => item.index === idx)){
		scanList.push(scanRow);
	}
	else{
		var index = scanList.indexOf(scanRow);
  		scanList.splice(index, 1);
	}
}


// 테이블 row 클릭 이벤트 : 상세정보 이동 
function imageSecurityScanListClick(thiz) {
	var rowData = $(thiz).parent().data(); // td > tr 태그 정보 가져오기 
	if(!rowData['registry']) rowData['registry'] = $("#registryList option:selected").text(); // 스캔 미실행 항목인 경우 레지스트리 정보가 없음. 수동으로 추가	
	$('#detailNum').val("");
	$('#detailNum').val("isScanHistory");
	
	$('#detailData').val("");
	$('#detailData').val(JSON.stringify(rowData));

	window.open('/eventImageSecurityInfo.do','','width=869,height=866,location=no,status=no,scrollbars=yes');
}

function imageSecurityEval(){
	if(scanning) return; // 스캔 상태인 경우 해당 함수 종료
	
	if(scanList.length>0){
		swal("이미지 재평가", "재평가를 진행하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) {
				if($("#registryPolicyRulename").val() == "") {
					swal("재평가 요청 실패", "레지스트리에 정책이 설정되어 있지 않습니다.", "./assets/images/icon_alert03.png", {
						buttons: "확인"
					});
				}
				else{
					imageEval();
				}
			} else {
				swal("이미지 재평가 요청", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	}
	else{
		swal("재평가 요청 실패", "재평가 할 대상을 선택해 주십시오", "./assets/images/icon_alert02.png", {
			buttons: "확인"
		});
	}
}
// 선택된 이미지 스캔 -> 없는 경우 선택된 레지스트리 스캔
function imageSecurityScan(){
	if(scanning) return; // 스캔 상태인 경우 해당 함수 종료
	
	var scanListSize = scanList.length
	// 이미지 스캔 
	if(scanListSize > 0){
		swal("이미지 스캔", "스캔을 진행하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) {
				// 설정된 정책 확인. 없는 경우 스캔 진행 x 
				if($("#registryPolicyRulename").val() == "") {
					swal("이미지 스캔 요청 실패", "레지스트리에 정책이 설정되어 있지 않습니다.", "./assets/images/icon_alert03.png", {
						buttons: "확인"
					});
				}
				else{
					imageScan();
				}
			} else {
				swal("이미지 스캔", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	}
	// 레지스트리 스캔
	else{
		swal("레지스트리 스캔", "선택된 레지스트리의 전체 이미지를 스캔 하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) {
				// 설정된 정책 확인. 없는 경우 스캔 진행 x 
				if($("#registryPolicyRulename").val() == "") {
					swal("레지스트리 스캔 요청 실패", "레지스트리에 정책이 설정되어 있지 않습니다.", "./assets/images/icon_alert03.png", {
						buttons: "확인"
					});
				}
				else{
					registryScan();
				}
			} else {
				swal("레지스트리 스캔", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	} 
}
function imageEval(){	
	cf_requestServer(_TR_SCAN_IS_EVALUATION, scanList, imageEvalCallBack);
	// 평가는 완료된 직후 콜백함수가 호출되므로 수동으로 상태 리프레쉬
	setTimeout(registryScanStatusRefresh(), 5000); 
	scanningEvent(true);
}
function imageEvalCallBack(data){
	setTimeout(registryScanStatusRefresh(), 5000); 
	scanningEvent(false);
	// 모든 스캔 요청이 끝난 후 팝업창 출력
	if(!data.body){
		swal("이미지 재평가 요청", `재평가 작업이 완료되었습니다.`, "./assets/images/icon_alert02.png", {
			buttons: "확인"
		});
	}else{
		swal("이미지 재평가 요청", `재평가 과정에 오류가 발생하였습니다. \n 선택된 이미지 (${data.body.failImagesList})에 대한 스캔 작업이 완료되어야합니다.`, "./assets/images/icon_alert03.png", {
			buttons: "확인"
		});
	}
}
// 이미지 스캔
function imageScan(){
	cf_requestServer(_TR_SCAN_IS_SCAN, scanList, imageScanCallBack);
}
function imageScanCallBack(data){
	// 모든 스캔 요청이 끝난 후 팝업창 출력
	if(!data.body){
		swal("이미지 스캔 요청", "스캔 작업시간이 다소 소요될 수 있으니 참고해주십시오.", "./assets/images/icon_alert02.png", {
			buttons: "확인"
		});
	}else{
		swal("이미지 스캔 요청", `스캔 요청에 실패한 이미지가 존재합니다. \n (${data.body.failImagesList})`, "./assets/images/icon_alert03.png", {
			buttons: "확인"
		});
	}
	refreshRegistryScanStatus();
}

// 레지스트리 스캔
function registryScan(){
	var body = { 
		'registry_uuid' : registryUuid,
		'scan_type' : "registry",
	};
	cf_requestServer(_TR_SCAN_IS_SCAN, body, function(){
		swal("레지스트리 스캔 요청", "스캔 작업시간이 다소 소요될 수 있으니 참고해주십시오.", "./assets/images/icon_alert02.png", {
			buttons: "확인"
		});	
		refreshRegistryScanStatus();
	});
}

// 레지스트리 uuid 전달하여 스캔 현황 refresh(800402) 
function refreshRegistryScanStatus(){
	//1. 스캔 상태 체크
	scanningEvent(true);
	cf_requestServer(_TR_SCAN_IS_SCAN_STATUS,null,lf_serviceCall800400CallBack);
	//2. 현재 선택된 registry 기준 현황 조회
	registryScanStatusRefresh();
}

// 스캔/재평가 시 상황판 버튼 비활성화
function scanningEvent(isScan){
	if(isScan){
		// 버튼 ui 변경
		$('#imageScanCallBox a').css({
			'background-color':'grey',
			'border-color':'grey'
		});
		// 스캔 진행 상태값 변경
		scanning = true;
		// 프로그래스바 출력 
		loadProgress();
	}
	else{
		$('#imageScanCallBox a').css({
			'background-color':'#2365af',
			'border-color':'#2365af'
		});
		scanning = false;
		loadProgress();
	}
}
// progressbar 변경
var myCounter;
function loadProgress(){
	var percent = 0;
	var countTime = 60000; // 1분	
	var dotCount = 1;  // scanning 뒤 . 갯수 

	if(scanning){ // 스캔 중인 경우
		$('.progressbarBox').show();
		$('.Loading span').css('width', '0%'); // 길이 0으로 시작

		myCounter = setInterval(function(){
			if(dotCount > 5) dotCount = 1; 
			else dotCount++; 
			countTime -= 1000; // 1초씩 차감
			if(countTime > 0){ // 1분보다 큰 경우 값을 주기적으로 변경
				percent += 1.6;
		  		$('.Loading span').css('width', percent + '%');
				$('.progressbar p').text('Scanning' +  '.'.repeat(dotCount));
			}else{ // 1분보다 작은 경우 초기화
				clearInterval(myCounter);
				$('.progressbar p').text('Wait...');
				loadProgress(); // 재호출. 0 부터 재시작
			};
		},1000);  // 1초당 1씩증가
	}
	else{ // 스캔이 완료되었을 경우
		clearInterval(myCounter);
		$('.Loading span').css('width', '100%');
		$('.progressbar p').text('Finished');

		setTimeout(function() {
			$('.progressbarBox').hide(); 
			// 기존 프로그래스 바 형태로 초기화
			$('.progressbar p').text('Scanning..');
  			$('.Loading span').css('width', '0%');
		});
		return;
	}
}

// 설정 된 Policy 현황 Modal
function createPolicyModal(elements){
	$('.securitypolicy_bottom_info').empty();
	var html = "";
	html+= `
		<dl>
			<dt>Contents</dt>
			<dd>
				<div class="policy_box">
		        	<div class="policy_checklable_box">
		               <input type="checkbox" name=policy_contents id="imageTag" value="image_tag" disabled>
		               <label for="imageTag"> 이미지 태그</label>
		        	</div>
		       		<div id="policy_image_tag" class="policy_select_box">
	           	   		<div class="policy_select_box_default">
		           	   		<input id="1_image_tag" type="text" class="policy_input" value="" readonly>
		                    <input placeholder="latest" id="2_image_tag" type="text" class="policy_input" value="" readonly>
		                    <p style="margin-left:10px;">인지 확인합니다.</p>  
		                </div>
	                </div>
				</div>
				
				<div class="policy_box">
                   	<div class="policy_checklable_box">
                       <input type="checkbox" name="policy_contents" id="scriptContentsPort" value="port_num" disabled>
	                   <label for="scriptContentsPort"> 포트 번호</label>
                	</div>
                  	<div id="policy_port_num" class="policy_select_box">
	           	   		<div class="policy_select_box_default">
		           	   		<input id="1_port_num" type="text" class="policy_input" value="" readonly>
		                    <input placeholder="22" id="2_port_num" type="text" class="policy_input" value="" readonly>
		                    <p style="margin-left:10px;">인지 확인합니다.</p>  
		                </div>
	                </div>
                </div>
                
                <div class="policy_box">
                   	<div class="policy_checklable_box">
	                    <input type="checkbox" name="policy_contents" id="scriptContentsFile" value="deploy_file" disabled>
	                    <label for="scriptContentsFile"> 배포 파일에</label>
	               	</div>
                  	<div id="policy_deploy_file" class="policy_select_box">
	           	   		<div class="policy_select_box_default">
		           	   		<input id="1_deploy_file" type="text" class="policy_input" value="" readonly>
		                    <input placeholder="HEALTHCHECK" id="2_deploy_file" type="text" class="policy_input" value="" readonly>
		                    <p style="margin-left:10px;">인지 확인합니다.</p>  
		                </div>
	                </div>
                </div>
                
				<div class="policy_box">
                   	<div class="policy_checklable_box">
                       <input type="checkbox" name="policy_contents" id="nameVersion" value="package" disabled>
                       <label for="nameVersion"> Package</label>
                	</div>
                   	<div id="policy_package" class="policy_select_box">
	           	   		<div class="policy_select_box_default">
		           	   		<input placeholder="Name" id="1_package" type="text" class="policy_input" value="" readonly>
		                    <input placeholder="Version" id="2_package" type="text" class="policy_input" value="" readonly>
		                    <p style="margin-left:10px;">인지 확인합니다.</p>  
		                </div>
	                </div>
                </div>
				
				<div class="policy_box">                  	
              		<div class="policy_checklable_box">
                       <input type="checkbox" name="policy_contents" id="license" value="license" disabled>
                       <label for="license"> License</label>
                	</div>
                  	<div id="policy_license" class="policy_select_box">
                   		<div class="policy_select_box_default">
		           	   		<input placeholder="GPLv2" id="1_license" type="text" class="policy_input" value="" readonly>
		                    <p style="margin-left:10px;">인지 확인합니다.</p>  
		                </div>
	                </div>
                </div>
                
			</dd>
		</dl>	
		<dl>
			<dt>Sensitive Data</dt>
			<dd>
				<div class="policy_box">
                   <input type="checkbox" name="policy_sensitive_data" id="regex" value="sensitive_data" disabled>
                   <label for="regex"> 민감정보가 있는지 확인합니다.</label>
                </div>
			</dd>
		</dl>
		<dl>
			<dt>Vulnerabilities</dt>
			<dd>
				<div class="policy_box">
                   	<div class="policy_checklable_box">
                       <input type="checkbox" name="policy_vulnerabilities" id="cveId" value="cve_id" disabled>
                       <label for="cveId"> CVE의 ID가</label>
                	</div>
                  	<div id="policy_cve_id" class="policy_select_box">
                   	   <div class="policy_select_box_default">
                           <input id="1_cve_id" type="text" class="policy_input" readonly>
                           <input id="2_cve_id" type="text" class="policy_input" readonly>
                           <p style="margin-left:10px;">인지 확인합니다.</p>
                       </div>
                   	</div>
                </div>
                
                <div class="policy_box">
                   	<div class="policy_checklable_box">
                       <input type="checkbox" name="policy_vulnerabilities" id="severity" value="cve_severity" disabled>
                       <label for="severity"> CVE의 Severity가</label>
                	</div>
                  	<div id="policy_cve_severity" class="policy_select_box">
                   	   <div class="policy_select_box_default">
                           <input id="1_cve_severity" type="text" class="policy_input" readonly>
                           <input id="2_cve_severity" type="text" class="policy_input" readonly>
                           <p style="margin-left:10px;">인지 확인합니다.</p>
                       </div>
                   	</div>
	            </div>
	                          	
               	<div class="policy_box">
	               	<div class="policy_checklable_box">
	                   <input type="checkbox" name="policy_vulnerabilities" id="cvssVersionBaseScore" value="cvss_score" disabled>
	                   <label for="cvssVersionBaseScore"> CVSS(V3) 의 Score가</label>
	            	</div>
	            	
	              	<div id="policy_cvss_score" class="policy_select_box">
	               	   <div class="policy_select_box_default">
	                       <input id="1_cvss_score" type="text" value="" class="policy_input" readonly>
          	               <input id="2_cvss_score" type="text" value="" class="policy_input" readonly>
	                   </div>
	               	</div>
	            </div>
                                
	            <div class="policy_box">
	               	<div class="policy_checklable_box">
	                   <input type="checkbox" name="policy_vulnerabilities" id="cvssVersionVector" value="cvss_vector" disabled>
	                   <label for="cvssVersionVector"> CVSS(V3)의 Vector가 </label>
	            	</div>
	              	<div id="policy_cvss_vector" class="policy_select_box">
	               	   <div class="policy_select_box_default">
	                       <input id="1_cvss_vector" type="text" value="" class="policy_input" readonly>
	                       <input id="2_cvss_vector" type="text" value="" class="policy_input" readonly>
	                       <p style="margin-left:10px;">인지 확인합니다.</p>
	                   </div>
	               	</div>
	            </div>
			</dd>
		</dl>
		<dl>
			<dt>Malwares</dt>
			<dd>
				<div class="policy_box">
                   <input type="checkbox" name=policy_malwares id="malware" value="malwares" disabled>
                   <label for="malware"> 악성코드가 존재하는지 확인합니다.</label>
                </div>
			</dd>
		</dl>
	`;	
	$(".securitypolicy_bottom_info").append(html);
	
	// 2. elements 데이터 확인
	elements.forEach(function(e){
		e.elements.forEach(function(element){
			// 체크박스 체크 유무 확인 및 적용
			editCheckBox(element); 		
			// Input 데이터 확인 및 추가
			editInputBox(element);
		})
	});
	
}

function editCheckBox(element){
	if(element.key =="scriptContents") { // 포트번호 또는 배포파일
		if(element.value.split(" ")[0] == "EXPOSE") { // Port의 Value는 EXOPESE 포트번호 이므로 이를 기준으로 체크
			$("input:checkbox[id='scriptContentsPort']").prop("checked",true);
		}
		else $("input:checkbox[id='scriptContentsFile']").prop("checked",true);	
	}
	else if(element.key){
		$("input:checkbox[id='"+element.key+"']").prop("checked",true);
	}
	// 멀웨어 정책은 key : null, condition : FIND
	else if(element.condition =="FIND") $("input:checkbox[id='malware']").prop("checked",true); 
}


function editInputBox(element){
	var elementList={'scriptContents': 'scriptContents' ,'imageTag':'image_tag', 'nameVersion':'package' , 'license':'license' , 'cveId':'cve_id', 'severity':'cve_severity', 'cvssVersionBaseScore':'cvss_score', 'cvssVersionVector':'cvss_vector'}
	// 배포는 condition이 조금 다름"LIKE_IGNORECASE" == "LIKE ", NOT_LIKE_IGNORECASE == "NOT_LIKE"
	var conditionList = {'HIGH':'HIGH', 'EQUAL_HIGH':'EQUAL_HIGH', 'EQUAL':'EQUAL', 'NOT_EQUAL' :'NOT_EQUAL', 'EQUAL_LOW': 'EQUAL_LOW', 'LOW':'LOW','LIKE':'LIKE', 'LIKE_IGNORECASE':'LIKE', 'NOT_LIKE':'NOT_LIKE', 'NOT_LIKE_IGNORECASE': 'NOT_LIKE'};	
	var elementKey = elementList[element.key];
	var elementCondition = scanOperator[conditionList[element.condition]]; // 부등호
	var elementValue = element.value;	
	// 키 값에 따른 key, value 값 수정
	if(elementKey === 'scriptContents'){
	 	if(element.value.split(" ")[0] == "EXPOSE"){ // 포트 
			 elementKey = 'port_num';
			 elementValue = element.value.split(" ")[1];
		}
		else{ // 배포 파일
			elementKey = 'deploy_file';
		}
	}
	else if(elementKey === 'cvss_score'|| elementKey === 'cvss_vector'){
			elementValue = element.value.split(",")[1]; // 3.1 제외한 값
	}
	
	var html = "";

	if(elementKey==='package'){ // name value
		var package_name= elementValue.split(",")[0];
		var package_version = elementValue.split(",")[1];
		
		if(!$("#1_"+elementKey).val()) {
			$("#1_"+elementKey).val(package_name);
			$("#2_"+elementKey).val(package_version);
		}
		else{
			html += 
			`<div class="policy_select_box_default">
			 	<input type='text' class='policy_input' value='${package_name}' readonly>
				<input type='text' class='policy_input' value='${package_version}' readonly>
			 </div>
			`;
			$("#policy_"+elementKey).prepend(html);
		}
	}
	else if(elementKey==='license'){
		if(!$("#1_"+elementKey).val()) {
			$("#1_"+elementKey).val(elementValue);
		}
		else{
			html += 
			`<div class="policy_select_box_default">
				<input type='text' class='policy_input' value='${elementValue}' readonly>
			 </div>
			`;
			$("#policy_"+elementKey).prepend(html);
		}
	}
	else{
		if(!$("#1_"+elementKey).val()){
			$("#1_"+elementKey).val(elementCondition);
			$("#2_"+elementKey).val(elementValue);
		}
		else{
			html += 
			`<div class="policy_select_box_default">
				<input type='text' class='policy_input' value='${elementCondition}' readonly>
				<input type='text' class='policy_input' value='${elementValue}' readonly>
			 </div>
			`;
			$("#policy_"+elementKey).prepend(html);
		}
	}	
}

