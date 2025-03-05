var lvar_event_pageNum = 0;
var lvar_event_init = false;
var lvar_event_pageCnt = 10;
var lvar_event_TotalCnt = 0;
var lvar_param_prefix = 'event_imageSecurity'; // #event_imageSecurity_ ~ 
var lvar_param_trId = '700012'; 
var lvar_json = {};


var lvar_eventImageSecurity_searchFieldStr = {
	'type': '타입',
	'registry': '레지스트리',
	'digest': '다이제스트',
	'created_at': '생성 일시',
	'updated_at': '종료 일시',
	'image_tag': '이미지 태그',
	'result': '컨테이너 이미지 스캔 결과',
	'message': '이벤트 내용',
}

var lvar_eventImageSecurityOperation = {
	1: 'equals(=)',
	11: 'not equals(!=)',
	2: 'like',
	12: 'not like',
	3: 'less than(<)',
	4: 'less than or equals(<=)',
	5: 'greater than(>)',
	6: 'greater than or equals(>=)',
}

var scanTypeList = {'MANUAL' : '수동 스캔', 'AUTO' : '자동 스캔' , 'POLICY_REEVALUATION' : '정책 재평가'};
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
var scanResultList  = { 
 "PASS": "성공"
, "ERROR": "에러"
, "NO_PASS": "실패"	
}

$(function(){
	//1. 최초 진입 시 24시간 내 데이터 조회 
	lf_serviceCall700019();
	lf_serviceCall700012();
	
	//2. starttime finishedtime 초기 설정 값 
	$('#'+lvar_param_prefix+'_starttime_created_at').val((new Date()).format('yyyy-MM-dd')+'T00:00:00');
	$('#'+lvar_param_prefix+'_endtime_created_at').val((new Date()).format('yyyy-MM-dd')+'T23:59:59');
	$('#'+lvar_param_prefix+'_starttime_updated_at').val((new Date()).format('yyyy-MM-dd')+'T00:00:00');
	$('#'+lvar_param_prefix+'_endtime_updated_at').val((new Date()).format('yyyy-MM-dd')+'T23:59:59');
});

// 빈 객체인지 체크하는 함수
function isEmptyObj(obj)  {
  if(obj.constructor === Object
     && Object.keys(obj).length === 0)  {
    return true;
  }
 
  return false;
}
 
// 쿼리 추가 
function lf_addEventImageSecurityCondition(){
	var lvar_param_prefix = 'event_imageSecurity';
	var type = $('#'+ lvar_param_prefix+'_search_type').val(); 
	var value;
	var text;
	var selectValue;
	
	var queryData={
		'type': type,
		'operation': operation,
		'value': value
	};
	
	if('created_at' == type){
		var starttimeValue = $('#'+lvar_param_prefix+'_starttime_created_at').val();
		var endtimeValue = $('#'+lvar_param_prefix+'_endtime_created_at').val();
		value = starttimeValue + '~' + endtimeValue;
		queryData['value'] = value; // ex) 2023-02-10/13:38:57~2023-03-02/13:39:57
		queryData['operation'] = '';
		

		if(!starttimeValue || !endtimeValue) {
			swal("검색 시간 값이 비어있습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
	}
	else if('updated_at' == type){
		var starttimeValue = $('#'+lvar_param_prefix+'_starttime_updated_at').val();
		var endtimeValue = $('#'+lvar_param_prefix+'_endtime_updated_at').val();
		value = starttimeValue + '~' + endtimeValue;
		queryData['value'] = value; 
		queryData['operation'] = '';
		
		value = starttimeValue + '~' + endtimeValue;

		if(!starttimeValue || !endtimeValue) {
			swal("검색 시간 값이 비어있습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
	}
	else{
		var operation = $('#'+lvar_param_prefix+'_search_operation_'+type).val(); // #event_imageSecurity_search_operation_~
		value = $('#'+lvar_param_prefix+'_'+type).val(); // #event_imageSecurity_~
		text =  $('#'+lvar_param_prefix+'_'+type+" option:selected").text(); // 검색 옵션의 실제 출력 텍스트
		
		queryData['value'] = value;
		queryData['operation'] = operation;
		
		if(!value) {
			swal(lvar_eventImageSecurity_searchFieldStr[type] + " 값이 비어있습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
	}
	
	// 쿼리 추가 항목 데이터
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');
	if(type == 'created_at' && queryTable.find("span:contains('" + lvar_eventImageSecurity_searchFieldStr['created_at'] + "')").length > 0) {
		swal("검색 시간은 1개 이하만 입력 할 수 있습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
	    return;
	}
	if(type == 'updated_at' && queryTable.find("span:contains('" + lvar_eventImageSecurity_searchFieldStr['updated_at'] + "')").length > 0) {
		swal("검색 시간은 1개 이하만 입력 할 수 있습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
	    return;
	}
	
	
	var $TR = $('<li></li>');
	$TR.data('queryData', queryData);
	if(type == 'created_at' || type == 'updated_at' ){
		$TR.append($('<p><span>'+lvar_eventImageSecurity_searchFieldStr[type]+'</span> / <span>'+value+'</span></p>'));	

	}else {
		// select 태그인 경우에는 text 출력. 아닌경우에는 value 출력 
		if(!text) selectOption = value;
		else selectOption = text; 
		
		$TR.append($('<p><span>'+lvar_eventImageSecurity_searchFieldStr[type]+'</span> / <span>'+lvar_eventImageSecurityOperation[operation]+'</span> / <span>'+selectOption+'</span></p>'));
	}
	
	$TR.append($('<a class="removex" title="삭제" onclick="javascript: $(this).parent().remove();"></a>'));
	queryTable.find('ul').append($TR); // 쿼리 추가 항목 표시
	 
	lf_eventImageSecuritySearchClear();
}

// 쿼리 입력 내용 초기화
function lf_eventImageSecuritySearchClear(){
	// date 타입 형식 초기화 
	$('#'+lvar_param_prefix+'_starttime_created_at').val((new Date()).format('yyyy-MM-dd')+'/00:00:00');
	$('#'+lvar_param_prefix+'_endtime_created_at').val((new Date()).format('yyyy-MM-dd')+'/23:59:59');
	$('#'+lvar_param_prefix+'_starttime_updated_at').val((new Date()).format('yyyy-MM-dd')+'/00:00:00');
	$('#'+lvar_param_prefix+'_endtime_updated_at').val((new Date()).format('yyyy-MM-dd')+'/23:59:59');
	
	$('#'+lvar_param_prefix+'_registry').val("");
	$('#'+lvar_param_prefix+'_image_tag').val("");
	$('#'+lvar_param_prefix+'_message').val("");
	$('#'+lvar_param_prefix+'_digest').val("");
} 

// ? 역할 찾아보기. 
function lf_getUrlParams() {
	var params = {};
	var param = Base64.decode(window.location.search);
	param = param.replaceAll(';', '');
	
	var paramArr = [];
	if(param.indexOf('&') > 0){
		paramArr = param.split('&');
	}
	
	if(paramArr.length > 0){
		for(var i = 0; i < paramArr.length; i++){
			var arr = paramArr[i].split('=');
			var key = arr[0];
			var value = arr[1];
			params[key] = value;
		}
	}
	
	return params;
}


// 검색 버튼 클릭 시 호출되는 함수
function lf_eventImageSecurityClick(){
	lvar_event_TotalCnt = 0;
	lf_serviceCall700019(); // 페이징 관련 처리 함수 
	lf_serviceCall700012(0);  // 데이터 초기화 및 호출 함수 
	mscrollbarReset();
}


//ServiceTr 데이터 초기화 및 호출 함수
function lf_serviceCall700012(pageNum){
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
	var starttime_created_at = null;
	var endtime_created_at = null;
	var starttime_updated_at = null;
	var endtime_updated_at =  null;
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');

	queryTable.find('ul li').each(function(){
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];
	
		if('created_at' == type){
			var timeArr = value.split('~');
			starttime_created_at = timeArr[0];
			endtime_created_at = timeArr[1];
		}
		else if('updated_at' == type){
			var timeArr = value.split('~');
			starttime_updated_at = timeArr[0];
			endtime_updated_at = timeArr[1];
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
	
	if(starttime_created_at != null) body['starttime_created_at'] = starttime_created_at;
	if(endtime_created_at != null) body['endtime_created_at'] = endtime_created_at;
	if(starttime_updated_at != null) body['starttime_updated_at'] = starttime_updated_at;
	if(endtime_updated_at != null) body['endtime_updated_at'] = endtime_updated_at;
	
	// 23-07-26 추가
	// 날짜 정보가 아무것도 없이 검색 시 현재 날짜 기준 default 값 설정(페이지 첫 진입시에도 적용)
	if(!starttime_created_at && !endtime_created_at && !starttime_updated_at && !endtime_updated_at)
	{
		body['starttime_created_at'] = (new Date()).format('yyyy-MM-dd')+'/00:00:00';
		body['endtime_created_at'] = (new Date()).format('yyyy-MM-dd')+'/23:59:59';
	}
	
	var table = $('#'+lvar_param_prefix+'_result_table');
	table.find('> tbody tr').remove(); // Table Data delete
	
	cf_contPreloader(lvar_param_prefix+'_result_table'); // Loding
	cf_requestServer(_TR_EVENT_IS_SEARCH,body,lf_serviceCall700012Callback);
}

function lf_serviceCall700012Callback(data, body){
	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(600);
	
	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	table.clear().draw(); 
	$('#detailData').val("");
	cf_contPreloader(lvar_param_prefix+'_result_table'); // Loding 재호출

	lvar_json = {};
	var dataList = data.body.dataList;
	$.each(dataList, function(idx, rowData){
		console.log("rowData: ", rowData);
		
		var scanType = rowData['scan_type']? scanTypeList[rowData['scan_type']]:"-";
		var registryName = rowData['registry']? rowData['registry']:"-";
		var imageTag = rowData['image_tag'] ? rowData['image_tag'] :"-"; 
		var digest = rowData['digest']? rowData['digest'] :"-";
		var result = rowData['scan_result']? scanResultList[rowData['scan_result']]: imageStatusList[rowData['image_status']];
		var requestUser= rowData['request_user']? rowData['request_user']:"-";
		var createdDate = rowData['created_date']?rowData['created_date']:"-";
		var finishedDate = rowData['updated_date']? rowData['updated_date'] : "-"; 
		var message = rowData['message'] ? rowData['message'] : '-'; 
		var tableRow = table.row.add([
			// 2023-09-07 이성호 페이지 넘버링 변경
			//(idx+1),
			(body.page+(idx+1))+"<p style='display:none;'>"+idx+"</p>",
			scanType,
			registryName,
			digest,
			imageTag,
			message,
			result,
			requestUser,
			createdDate,
			finishedDate,
		]).draw(false).node(); // 새로 추가된 행을 그리고, 해당 노드를 가져옴
		$(tableRow).find('td').addClass('long_w');
		
		// 이벤트 상세에 전달할 데이터 생성
		var detailData;
		detailData = idx+1 + '¥' + 'Registry'+ '¥' + rowData['scan_type'] +'¥'+ rowData['registry'] +'¥'+ rowData['image_tag'] +'¥'
		+ rowData['digest'] +'¥'+ rowData['message'] +'¥'+ result +'¥'
		+ rowData['request_user'] +'¥'+ createdDate +'¥'+ finishedDate;
		
		lvar_json[idx] = rowData // 이벤트 상세 > 원본 로그에 출력될 json 객체에 row데이터 담기
		if(idx >0){ 
			$('#detailData').val($('#detailData').val()+'~'+detailData);
		}else {
			$('#detailData').val(detailData); 
		}
	});
	table.draw();
	
	// 테이블 클릭 이벤트
	$('#'+lvar_param_prefix+'_result_table').find('> tbody tr').addClass('modalLoad')
	.attr({
		rel : 'eventImageSecurityDetail_modal',
		onclick : 'lf_eventImageSecurityTableClick(this);'
	});
	
	lf_serviceButtonDataCallback(data);
}

function lf_serviceButtonDataCallback(data){
	var pageArr = $('#imageSecurity_paging').val().split('_');
	var dataInfo = data.body;
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
		_fnUpdatePaginate(settings,info);
	}

	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(300);
	
	$('#imageSecurity_paging').val(pagingValue);	
}

// 테이블 row 클릭 이벤트 : 상세정보 이동 
function lf_eventImageSecurityTableClick(obj) {
	// 2023-09-07 이성호 페이지 넘버링 변경
	//var num = $(obj).children(':first').text();
	var num = $(obj).children(':first').children(':last').text();
	
	$('#detailNum').val("");
	$('#detailNum').val("eventImageSecurity");
	
	$('#detailData').val("");
	// 2023-09-07 이성호 페이지 넘버링 변경
	//if(lvar_json[num-1]) $('#detailData').val(JSON.stringify(lvar_json[num-1], null, 4));
	if(lvar_json[num]) $('#detailData').val(JSON.stringify(lvar_json[num], null, 4));
	
	window.open('/eventImageSecurityInfo.do','','width=869,height=866,location=no,status=no,scrollbars=yes');
}


// ServiceTr 페이징 관련 처리 함수 
function lf_serviceCall700019(){
	var parameters = [];
	var starttime_created_at = null;
	var endtime_created_at = null;
	var starttime_updated_at = null;
	var endtime_updated_at =  null;
	// var equiplist = null;
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');

	queryTable.find('ul li').each(function(){
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];
	
		if('created_at' == type){
			var timeArr = value.split('~');
			starttime_created_at = timeArr[0];
			endtime_created_at = timeArr[1];
		}
		else if('updated_at' == type){
			var timeArr = value.split('~');
			starttime_updated_at = timeArr[0];
			endtime_updated_at = timeArr[1];
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
		'trId': lvar_param_trId
	};
	
	if(starttime_created_at != null) body['starttime_created_at'] = starttime_created_at;
	if(endtime_created_at != null) body['endtime_created_at'] = endtime_created_at;
	if(starttime_updated_at != null) body['starttime_updated_at'] = starttime_updated_at;
	if(endtime_updated_at != null) body['endtime_updated_at'] = endtime_updated_at;

	// 23-07-26 추가
	// 날짜 정보가 아무것도 없이 검색 시 현재 날짜 기준 default 값 설정(페이지 첫 진입시에도 적용)
	if(!starttime_created_at && !endtime_created_at && !starttime_updated_at && !endtime_updated_at){
		body['starttime_created_at'] = (new Date()).format('yyyy-MM-dd')+'/00:00:00';
		body['endtime_created_at'] = (new Date()).format('yyyy-MM-dd')+'/23:59:59';
	}
	cf_contPreloader(lvar_param_prefix+'_result_table');
	cf_requestServer(_TR_EVENT_CSP_PAGEINFO_SEARCH,body,lf_serviceCall700019Callback);
}


// totalcnt GET
// ex) totalcnt: 8007
function lf_serviceCall700019Callback(data){
	var dataInfo = data.body.info[0]; // totalcnt
	var totalCnt = dataInfo['totalcnt'];
	lvar_event_TotalCnt = totalCnt;
	//var page = dataInfo['page'] ? dataInfo['page']-1 : 0;
 	var page = lvar_event_pageNum ? lvar_event_pageNum : 0;

	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	var len = table.page.len();
	
	// 추가
/*	console.log("now page: ", Math.ceil(totalCnt/len));
	console.log("click page: ", len); 
	
	if(Math.ceil(totalCnt/len) != len){
		lvar_event_TotalCnt = 0; 
	} */
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
	_fnUpdatePaginate(settings,info);
	
	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(300);
	
	$('#imageSecurity_paging').val(pagingValue);
	cf_contPreloader(lvar_param_prefix+'_result_table');
	
}

function _fnUpdatePaginate (settings,info){
		var
			type   = settings.sPaginationType,
			plugin = extPagination(type),
			modern = typeof plugin === 'function',
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;

		/* Add a draw callback for the pagination on first instance, to update the paging display */
			node.id = settings.sTableId+'_paginate';
			
			if ( modern ) {
				var
					start      = info.start, // 0 
					len        = info.length, // 10
					visRecords = info.recordsDisplay, //68
					all        = all, // false
					page = info.page, // 0
					pages = info.pages, // 7
					buttons = plugin(page, pages),
					i, ien;
				for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
					_pageButton(settings, features.p[i], i, buttons, page, pages);
				}
			}				
}


function extPagination(type) {
	switch(type){
		case "simple": return (function ( page, pages ) {
			return [ 'previous', 'next' ];
		});
		case "full": return (function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		});
	
		case "numbers": return (function ( page, pages ) {
			return [ _numbers(page, pages) ];
		});
	
		case "simple_numbers": return (function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		});
	
		case "full_numbers": return (function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		});
		
		case "first_last_numbers": return (function (page, pages) {
			 return ['first', _numbers(page, pages), 'last'];
		 });

		// For testing and plug-ins to use
		case "_numbers" : return _numbers;

		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		case "numbers_length": return 7;
	}
}
function _numbers ( page, pages ) {
	var
		numbers = [],
		buttons = extPagination("numbers_length"),
		half = Math.floor( buttons / 2 ),
		i = 1;

	if ( pages <= buttons ) {
		numbers = _range( 0, pages );
	}
	else if ( page <= half ) {
		numbers = _range( 0, buttons-2 );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
	}
	else if ( page >= pages - 1 - half ) {
		numbers = _range( pages-(buttons-2), pages );
		numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
		numbers.splice( 0, 0, 0 );
	}
	else {
		numbers = _range( page-half+2, page+half-1 );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
		numbers.splice( 0, 0, 'ellipsis' );
		numbers.splice( 0, 0, 0 );
	}

	numbers.DT_el = 'span';
	return numbers;
}
function _range( len, start ){
	var out = [];
	var end;

	if ( start === undefined ) {
		start = 0;
		end = len;
	}
	else {
		end = start;
		start = len;
	}

	for ( var i=start ; i<end ; i++ ) {
		out.push( i );
	}

	return out;
}
function _pageButton( settings, host, idx, buttons, page, pages ) {
	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	var api = table.columns.adjust();
	var counter=0;
	var i, ien, button;
	$(host).empty().html('<ul class="pagination"/>').children('ul');
	
	for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
		button = buttons[i];
		if ( $.isArray( button ) ) {
			for(var j = 0; j<(button.length); j++){
				_addPageButton(settings, table, host, idx, button[j], page, pages, counter);
				counter++;
			}
		}else {
			_addPageButton(settings, table, host, idx, button, page, pages, counter);
			counter++;
		}
	}

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}
	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
}

function _addPageButton(settings, api, host, idx, button, page, pages, counter){
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay = '';
	var btnClass = '';
	var node;

	var clickHandler = function ( e ) {
		e.preventDefault();
		if ( !$(e.currentTarget).hasClass('disabled')) {
			lf_serviceCall700012(e.data.action);
		}
		mscrollbarReset();
	};

	switch ( button ) {
		case 'ellipsis':
			btnDisplay = '&#x2026;';
			btnClass = 'disabled';
			break;

		case 'first':
			btnDisplay = lang.sFirst;
			btnClass = button + (page > 0 ?
				'' : ' disabled');
			break;

		case 'previous':
			btnDisplay = lang.sPrevious;
			btnClass = button + (page > 0 ?
				'' : ' disabled');
			break;

		case 'next':
			btnDisplay = lang.sNext;
			btnClass = button + (page < pages-1 ?
				'' : ' disabled');
			break;

		case 'last':
			btnDisplay = lang.sLast;
			btnClass = button + (page < pages-1 ?
				'' : ' disabled');
			break;

		default:
			btnDisplay = button + 1;
			btnClass = page === button ?
				'active' : '';
			break;
	}
	
	if ( btnDisplay ) {
		node = $('<li>', {
				'class': classes.sPageButton+' '+btnClass,
				'id': idx === 0 && typeof button === 'string' ?
					settings.sTableId +'_'+ button :
					null
			} )
			.append( $('<a>', {
					'href': '#',
					'aria-controls': settings.sTableId,
					'aria-label': aria[ button ],
					'data-dt-idx': counter,
					'tabindex': settings.iTabIndex
				} )
				.html( btnDisplay )
			)
		$(host).children('ul').append(node);
		_fnBindAction(
			node, {action: button}, clickHandler
		);

	}
}

function _fnBindAction( n, oData, fn ){
	$(n)
		.on( 'click.DT', oData, function (e) {
				$(n).blur(); // Remove focus outline for mouse users
				fn(e);
			} )
		.on( 'keypress.DT', oData, function (e){
				if ( e.which === 13 ) {
					e.preventDefault();
					fn(e);
				}
			} )
		.on( 'selectstart.DT', function () {
				/* Take the brutal approach to cancelling text selection */
				return false;
			} );
}


function _fnLengthChange(length){
	lvar_event_pageNum = 0; // 페이지 넘버 1번으로 초기화
	lvar_event_pageCnt = length;
	lf_serviceCall700019();
	lf_serviceCall700012();
	mscrollbarReset();
}





