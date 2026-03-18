/**
 * 이벤트 조회 상수 값 정의
 * 공통모듈 사용으로 인하여 lvar_param_prefix, _result_table은 기존 스네이트 방식이름 유지
 * lvar_param_prefix+ _search_operation_옵션이름 : 검색 옵션 operation 값 
 * lvar_param_prefix+ _옵션이름 : 검색 옵션 값
 * 
 * lvar_param_service : 페이지 버튼 클릭 시 호출되는 서비스
 */
var lvar_param_prefix = "event_containerSecurity";
var lvar_param_trid = '700014';
var lvar_param_service = lf_serviceCall700014;

var lvar_event_pageNum = 0;
var lvar_event_init = false;
var lvar_event_pageCnt = 10;
var lvar_event_TotalCnt = 0;

var lvarJson = {};

var lvarEventContainerSecuritySearchFieldStr = {
	'action': '액션',
	'cluster' : '클러스터',
	'rulename': '정책명',
	'message': '이벤트 내용',
	'severity': '위험도',
	'searchtime': '검색 시간',
}
 
var lvarEventContainerSecurityOperation = {
	1: 'equals(=)',
	11: 'not equals(!=)',
	2: 'like',
	12: 'not like',
	3: 'less than(<)',
	4: 'less than or equals(<=)',
	5: 'greater than(>)',
	6: 'greater than or equals(>=)',
}
 // 페이지 진입시 초기설정
 $(function () {
	lf_ContainerSecurityInt();	
});
 
// "추가" 버튼 클릭 > 쿼리 조건 추가 
function lf_addEventContainerSecurityCondition(){
	//#+lvar_param_prefix+ SearchType : 검색 옵션 값 
	var type = $('#'+ lvar_param_prefix+'SearchType').val(); 
	var value;
	var text;

	var queryData={
		'type': type,
		'operation': operation,
		'value': value
	};
	
	// 시간 조건
	if(type == 'searchtime'){
		var starttimeValue = $('#'+lvar_param_prefix+'StartTime').val();
		var endtimeValue = $('#'+lvar_param_prefix+'EndTime').val();
		value = starttimeValue + '~' + endtimeValue;

		queryData['value'] = value;
		queryData['operation'] = '';
		
		if(!starttimeValue || !endtimeValue) {
			swal("검색 시간 값이 비어있습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
	}
	else{
		var operation = $('#'+lvar_param_prefix+'SearchOperation'+type).val(); // 검색 옵션 operation 값
		value = $('#'+lvar_param_prefix+type).val(); // 검색 옵션 값 
		text =  $('#'+lvar_param_prefix+type+" option:selected").text(); // 검색 옵션의 실제 출력 텍스트
		
		queryData['value'] = value;
		queryData['operation'] = operation;
		
		if(!value) {
			swal(lvarEventContainerSecuritySearchFieldStr[type] + " 값이 비어있습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
	}
	
	var queryTable = $('#'+lvar_param_prefix+'QueryTable'); // 추가 될 쿼리 태그(li)가 append 될 부모 div id
	//탐지 시간 옵션 유효성 검사 : 시간 옵션은 1개만 가능
	if(type == 'searchtime' && queryTable.find("span:contains('" + lvarEventContainerSecuritySearchFieldStr['searchtime'] + "')").length > 0) {
		swal("검색 시간은 1개 이하만 입력 할 수 있습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
	    return;
	}
	var $TR = $('<li></li>'); // 추가된 쿼리 <li> 태그 형식으로 출력
	$TR.data('queryData', queryData);
	if(type == 'searchtime' ){ // 시간 데이터에는 operation 값이 붙지 않음
		$TR.append($('<p><span>'+lvarEventContainerSecuritySearchFieldStr[type]+'</span> / <span>'+value+'</span></p>'));	

	}else {
		// select 태그인 경우에는 text 출력. 아닌경우에는 value 출력 
		if(!text) selectOption = value;
		else selectOption = text; 
		
		$TR.append($('<p><span>'+lvarEventContainerSecuritySearchFieldStr[type]+'</span> / <span>'+lvarEventContainerSecurityOperation[operation]+'</span> / <span>'+selectOption+'</span></p>'));
	}
	$TR.append($('<a class="removex" title="삭제" onclick="javascript: $(this).parent().remove();"></a>')); // 삭제 버튼 : 해당 태그의 부모(li) 태그 삭제
	queryTable.find('ul').append($TR); // 쿼리 추가 항목 표시
	 
	lf_eventContainerSecuritySearchClear();

}

// 페이지 진입시 초기 쿼리 설정
function lf_ContainerSecurityInt(){
	$('#'+lvar_param_prefix+'StartTime').val((new Date()).format('yyyy-MM-dd')+'T00:00:00');
	$('#'+lvar_param_prefix+'EndTime').val((new Date()).format('yyyy-MM-dd')+'T23:59:59');
	// 2023-06-22 기능 복구
	lf_serviceCall700019();
	lf_serviceCall700014();
}
 
 
// 쿼리 입력 내용 초기화
function lf_eventContainerSecuritySearchClear(){
	$('.containerSecurityEventDate').val(""); // 클래스 이름으로 date 형식 초기화
	$('#'+lvar_param_prefix+'rulename').val("");
	$('#'+lvar_param_prefix+'cluster').val("");
	$('#'+lvar_param_prefix+'message').val("");
}
 
  // "검색" 버튼 클릭 > 조건에 따른 쿼리 조회
function lf_eventContainerSecurityClick() {
	lvar_event_TotalCnt = 0;
	lf_serviceCall700019(); // 페이징 관련 처리 
	lf_serviceCall700014(0);  // 데이터 초기화 및 호출. 검색 버튼 클릭시 페이지버튼은 무조건 0
	mscrollbarReset(); // 스크롤바 reset
}
 
// ServiceTr 데이터 초기화 및 호출 데이터 전달
function lf_serviceCall700014(pageNum){
	if(!pageNum && pageNum != 0){
		pageNum = lvar_event_pageNum; // default = 0 
	}
	else{
		switch(pageNum){
		case 'first': pageNum = 0; break;
		case 'previous': pageNum = lvar_event_pageNum-1; break;
		case 'next': pageNum = lvar_event_pageNum+1; break;
		case 'last': pageNum = Math.ceil(lvar_event_TotalCnt/lvar_event_pageCnt)-1; break;
		}
	}
	
	lvar_event_pageNum = pageNum; // 페이지 넘버 재정의
	
	var parameters = [];
	var starttime = null;
	var endtime = null;
	var queryTable = $('#'+lvar_param_prefix+'QueryTable');
	
	queryTable.find('ul li').each(function(){
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];
	
		if('searchtime' == type){
			var timeArr = value.split('~');
			starttime = timeArr[0];
			endtime = timeArr[1];
			// 컨테이너 시큐리테에서는 하나의 컬럼에 여러 데이터가 들어가있기에 message ==, != 조회에는 뒤에 )을 붙여줍니다
		}else if('message' == type && (operation == 1 || operation == 11)){
			var param = {}; 			
			param['name'] = type;
			param['value'] = value+')';
			param['operation'] = operation;
			parameters.push(param);
		}
		else{
			var param = {}; 			
			param['name'] = type;
			param['value'] = value;
			param['operation'] = operation;
			parameters.push(param);
		}	
	});

	var body = {
		'page' : lvar_event_pageNum * lvar_event_pageCnt,
		'topn' :  lvar_event_pageCnt,
		'parameters': parameters.length>0 ? parameters : null	
	};

	// 2023-06-16 수정
	// 날짜 정보가 없으면 현재 날짜 기준 default값 설정
	if(starttime != null) body['starttime'] = starttime;
	else body['starttime'] = (new Date()).format('yyyy-MM-dd')+'/00:00:00';
	if(endtime != null) body['endtime'] = endtime;
	else body['endtime'] = (new Date()).format('yyyy-MM-dd')+'/23:59:59';
	
	// Table Data delete
	var table = $('#'+lvar_param_prefix+'_result_table');
	table.find('> tbody tr').remove(); 
	
	cf_contPreloader(lvar_param_prefix+'_result_table'); // Loding
	cf_requestServer(_TR_EVENT_CONTAINER_SECURITY,body,lf_serviceCall700014Callback);
} 

// ServiceTr 데이터 초기화 및 호출 결과 콜백 함수
function lf_serviceCall700014Callback(data, body){
	
	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(600);

	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	table.clear().draw(); 
	$('#detailData').val("");
	cf_contPreloader(lvar_param_prefix+'_result_table'); // Loding 재호출
	
	lvarJson = {}; // 상세 페이지에 전달 시킬 json 데이터 리스트
	var dataList = data.body.dataList;
	$.each(dataList, function(idx, rowData){
		// severity 정열을 위한 숫자 데이터
		// TO BE severity에 따른 이미지로 대체시 대체 이미지를 넣을 수 있는 로직
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
			default: //unknown
				severityOrdering=4;
				break;
		}
		
		// 테이블 그리기 
		table.row.add([
			// 2023-09-07 이성호 페이지 넘버링 변경
			//"<td>"+(idx+1)+"</td>",
			"<td class=\'long_w\'>"+(body.page+(idx+1))+"<p style='display:none;'>"+idx+"</p></td>",
			"<td>"+rowData['action']+"</td>",
			"<td>"+rowData['cluster'] + "</td>",
			"<td>"+rowData['rulename']+"</td>",
			"<td>"+rowData['message'].split("details=(")[1].slice(0, -1)+"</td>",
			"<td>"+rowData['severity']+"</td>",	// TO BE severity에 따른 이미지로 대체
			"<td>"+rowData['date']+"</td>",
			"<td>"+severityOrdering+"</td>"
		]);
		lvarJson[idx] = rowData;  // 이벤트 상세 > 원본 로그에 출력될 json 객체에 row데이터 담기
	}); 
	table.draw();
	
	// 테이블 클릭 이벤트 정의 
	$('#'+lvar_param_prefix+'_result_table').find('> tbody tr').addClass('modalLoad') // 테이블 row에 class 추가 : 모달창으로 이동되는 이벤트 정의
	.attr({
		rel : 'eventContainerSecurityDetail_modal',
		onclick : 'lf_eventImageSecurityTableClick(this);'
	});
	
	lf_serviceButtonDataCallback(data); // 페이징 버튼 클릭시 발생되는 이벤트 정의
}


//  페이징 버튼 클릭시 발생되는 이벤트 정의
function lf_serviceButtonDataCallback(data){
	var pageArr = $('#containerSecurityEventPaging').val().split('_');
	// dataInfo를 통해서 데이터가 정상적으로 넘어오는지 확인 가능
	var dataInfo = data.body;
	//console.log(dataInfo);
	var totalCnt = pageArr[0] ? pageArr[0] : lvar_event_TotalCnt;
	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;
	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	var len = pageArr[1];
	var pagingValue = totalCnt+"_"+len+"_"+page;
	
	var info = {
		"start":0,
		"page": page,
		"pages": Math.ceil(totalCnt/len),
		"length": len,
		"recordsTotal": totalCnt,
		"recordsDisplay": totalCnt,
		"all": false
	};
	
	var api = table.columns.adjust();
	var settings = api.settings()[0];
	if(totalCnt > 0){
		_fnUpdatePaginate(settings,info,lvar_param_service);
	}

	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(300);
	
	$('#containerSecurityEventPaging').val(pagingValue);	
}

// 테이블 row 클릭 이벤트 : 상세정보 이동 
function lf_eventImageSecurityTableClick(obj) {
	// 2023-09-07 이성호 페이지 넘버링 변경
	//var num = $(obj).children(':first').text();
	var num = $(obj).children(':first').children(':last').text();
	
	$('#detailNum').val("");
	$('#detailNum').val("eventContainerSecurity");
	
	$('#detailData').val("");

	// 2023-09-07 이성호 페이지 넘버링 변경
	//if(lvarJson[num-1]) $('#detailData').val(JSON.stringify(lvarJson[num-1]));
	if(lvarJson[num]) $('#detailData').val(JSON.stringify(lvarJson[num], null, 4));
	
	window.open('/eventContainerSecurityInfo.do','','width=869,height=766,location=no,status=no,scrollbars=yes');
}


// ServiceTr 페이지 관련 처리 데이터 전달 
// ServiceTr 페이징 관련 처리 함수 
function lf_serviceCall700019(){
	var parameters = [];
	var starttime = null;
	var endtime = null;
	var queryTable = $('#'+lvar_param_prefix+'QueryTable');
	
	queryTable.find('ul li').each(function(){
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];
	
		if('searchtime' == type){
			var timeArr = value.split('~');
			starttime = timeArr[0];
			endtime = timeArr[1];
			// 컨테이너 시큐리테에서는 하나의 컬럼에 여러 데이터가 들어가있기에 message ==, != 조회에는 뒤에 )을 붙여줍니다
		}else if('message' == type && (operation == 1 || operation == 11)){
			var param = {}; 			
			param['name'] = type;
			param['value'] = value+')';
			param['operation'] = operation;
			parameters.push(param);
		}
		else{
			var param = {}; 			
			param['name'] = type;
			param['value'] = value;
			param['operation'] = operation;
			parameters.push(param);
		}	
	});
	
	var body = {
		'parameters': parameters.length>0 ? parameters : null,
		'trId': lvar_param_trid
	};
	
	// 2023-06-16 수정
	// 날짜 정보가 없으면 현재 날짜 기준 default값 설정
	if(starttime != null) body['starttime'] = starttime;
	else body['starttime'] = (new Date()).format('yyyy-MM-dd')+'/00:00:00';
	if(endtime != null) body['endtime'] = endtime;
	else body['endtime'] = (new Date()).format('yyyy-MM-dd')+'/23:59:59';
	
	cf_contPreloader(lvar_param_prefix+'_result_table');
	cf_requestServer(_TR_EVENT_CSP_PAGEINFO_SEARCH, body,lf_serviceCall700019Callback);
}

// ServiceTr 페이지 관련 처리 결과 콜백 함수
// totalcnt GET  
// ex) totalcnt: 8007
function lf_serviceCall700019Callback(data){
	var dataInfo = data.body.info[0]; // totalcnt
	var totalCnt = dataInfo['totalcnt'];

	lvar_event_TotalCnt = totalCnt;
 	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;

	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	var len = table.page.len();
	
	lvar_event_pageCnt = len;
	var pagingValue = totalCnt+"_"+len+"_"+page;
	var info = {
		"start":0,
		"page": page,
		"pages": Math.ceil(totalCnt/len),
		"length": len,
		"recordsTotal": totalCnt,
		"recordsDisplay": totalCnt,
		"all": false
	};
	
	var api = table.columns.adjust();
	var settings = api.settings()[0];
	_fnUpdatePaginate(settings,info,lvar_param_service);
	
	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(300);
	
	$('#containerSecurityEventPaging').val(pagingValue);
	cf_contPreloader(lvar_param_prefix+'_result_table');
	
}

// Datatable length 변경 시 호출되는 함수
function _fnLengthChange(length){
	lvar_event_pageCnt = length;
	lf_serviceCall700019();
	lf_serviceCall700014();
	mscrollbarReset();
}