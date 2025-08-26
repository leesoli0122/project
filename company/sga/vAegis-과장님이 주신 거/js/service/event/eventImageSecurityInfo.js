//row 데이터 변경해주는 상수 값.
const scanTypeList = {'MANUAL' : '수동 스캔', 'AUTO' : '자동 스캔' , 'POLICY_REEVALUATION' : '정책 재평가'};
const imageStatusList  = {
"ERROR_IN_REQUESTING_ANALYSIS": "분석 요청 실패"
, "WAITING_FOR_ANALYSIS": "분석 대기"
, "ANALYZING": "분석 중"
, "ANALYSIS_COMPELETED": "분석 완료"
, "ERROR_IN_ANALYZING": "분석 중 오류 발생"
, "EVALUATING": "정책 평가 중"
, "ERROR_IN_EVALUATING": "정책 평가 중 오류 발생"
, "EVALUATION_COMPLETED": "정책 평가 완료"
}
const scanResultList  = { 
 "NOT_EVALUATED": "평가 미실행"
, "PASS": "성공"
, "ERROR": "에러"
, "NO_PASS": "실패"	
} 
var detailData;
var rowData;

$(function () {
	lf_detailFrame();
	
	$('#logInfo').click(function() {
		replaceClass('logInfo','','open');
		replaceClass('jsonInfo','open','');
		$('.tabMgmt_1').show();
		$('.tabMgmt_2').hide();
	});

	$('#jsonInfo').click(function() {
		replaceClass('logInfo','open','');
		replaceClass('jsonInfo','','open');
		$('.tabMgmt_1').hide();
		$('.tabMgmt_2').show();
	});
});

function replaceClass(id, oldClass, newClass) {
    var elem = $(`#${id}`);
    if (elem.hasClass(oldClass)) {
        elem.removeClass(oldClass);
    }
    elem.addClass(newClass);
}


function lf_detailFrame(){
	var category = opener.document.getElementById("detailNum").value;
	var detailList = $('.detail_list_image');
	var detailInfo = "";
	
	console.log(category);
	
	detailList.find('> li').remove();
	
	switch(category){
		case 'eventImageSecurity' :
		detailInfo =  (
			"<li><dl><dt>스캔 유형</dt><dd></dd></dl></li>"+
			"<li><dl><dt>Registry</dt><dd></dd></dl></li>"+
			"<li><dl><dt>Image Tag</dt><dd></dd></dl></li>"+
			"<li><dl><dt>Digest</dt><dd></dd></dl></li>"+
			"<li><dl><dt>메시지</dt><dd></dd></dl></li>"+
			"<li><dl><dt>스캔 결과</dt><dd></dd></dl></li>"+
			"<li><dl><dt>요청 사용자</dt><dd></dd></dl></li>"+
			"<li><dl><dt>생성 시간</dt><dd></dd></dl></li>"+
			"<li><dl><dt>종료 시간</dt><dd></dd></dl></li>"
			); break;
		
		case 'isScanHistory' :
		detailInfo =  (
			"<li><dl><dt>스캔 유형</dt><dd></dd></dl></li>"+
			"<li><dl><dt>Registry</dt><dd></dd></dl></li>"+
			"<li><dl><dt>Repository</dt><dd></dd></dl></li>"+
			"<li><dl><dt>Image Tag</dt><dd></dd></dl></li>"+
			"<li><dl><dt>Digest</dt><dd></dd></dl></li>"+
			"<li><dl><dt>메시지</dt><dd></dd></dl></li>"+
			"<li><dl><dt>스캔 결과</dt><dd></dd></dl></li>"+
			"<li><dl><dt>생성 시간</dt><dd></dd></dl></li>"+
			"<li><dl><dt>종료 시간</dt><dd></dd></dl></li>"
			); break;
		default : 
		detailInfo = (
			""
			); break;
	}
	detailList.append(detailInfo);
	
	detailData = opener.document.getElementById("detailData").value;
	rowData = JSON.parse(detailData);
	lf_eventDetail(category);
	//renderJson(); 원본로그 출력을 위한 json render
}



function lf_eventDetail(category){
	var dp = function(name) {
		if(rowData[name]){
			if(name == 'scan_type') {
				return scanTypeList[rowData['scan_type']];		
			}
			else if(name == 'scan_result'){
				return rowData['scan_result']? scanResultList[rowData['scan_result']] : "-";
			}

			else if(rowData[name]) {
				return rowData[name];
			}
		}
		else if(name =='finished_date'){ 
			if(rowData['scan_result']){
				return rowData['updated_date']? rowData['updated_date'] : "-";
			}
			else{
				return "-";
			}
		}
		else{
			return '-';
		}
	};
	
	var registry_ip = rowData['registry_host'];
	$("#deviceNm1").val(dp('registry')); // 상세 정보 
	$("#eventDtm1").val(rowData['created_date']?rowData['created_date']: "-"); // 탐지 시간
	
	/*$("#deviceNm2").val(rowData['registry'] + "(" + registry_ip + ")"); // 상세 정보 
	$("#eventDtm2").val(rowData['created_date']); // 탐지 시간*/
	
	var bodyList = $('ul.detail_list_image > li > dl > dd');
	if(category == 'isScanHistory') {	
		lf_setData(bodyList[0], dp('scan_type'));
		lf_setData(bodyList[1], dp('registry'));
		lf_setData(bodyList[2], dp('repository'));
		lf_setData(bodyList[3], dp('tag'));
		lf_setData(bodyList[4], dp('digest'));
		lf_setData(bodyList[5], dp('message'));
		lf_setData(bodyList[6], dp('scan_result'));
		lf_setData(bodyList[7], dp('created_date'));
		lf_setData(bodyList[8], dp('finished_date'));
	} 
	else if(category == 'eventImageSecurity') {	
		lf_setData(bodyList[0], dp('scan_type'));
		lf_setData(bodyList[1], dp('registry'));
		lf_setData(bodyList[2], dp('image_tag'));
		lf_setData(bodyList[3], dp('digest'));
		lf_setData(bodyList[4], dp('message'));
		lf_setData(bodyList[5], dp('scan_result'));
		lf_setData(bodyList[6], dp('request_user'));
		lf_setData(bodyList[7], dp('created_date'));
		lf_setData(bodyList[8], dp('finished_date'));
	} 
}

function lf_setData(thiz, data) {
	$(thiz).text(data);
	$(thiz).attr('title', data);
}

function renderJson() {
	var options = {
		collapsed: false,
		rootCollapsable: true,
		withQuotes: false,
		withLinks: true
    };
    $('#json-renderer').jsonViewer(rowData, options); 
	$('#jsonInfo').show();
}








