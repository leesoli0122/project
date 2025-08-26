
var lvar_event_pageNum = 0;
var lvar_event_init = false;
var lvar_event_pageCnt = 10;
var lvar_event_TotalCnt = 0;
var lvar_param_prefix = 'event_fileInt';
var lvar_param_trId = '700004';

var lvar_eventFileIntTypeObj = _EVENTFILEINTTYPEOBJ;

var lvar_eventFileInt_searchFieldStr = {
	'date': '탐지시간',
	'path': '전체 경로',
	'perm': 'Permission',
	'perm_old': '바뀌기 전 Permission',
	'perm_new': '바뀐 후 Permission',
	'type': '무결성 위반 종류',
	'hash': '해싱키',
	'hash_old': '바뀌기 전 해시',
	'hash_new': '바뀐 후 해시',
	'filesize': '파일크기',
	'filesize_old': '바뀌기 전 파일크기',
	'filesize_new': '바뀐 후 파일크기',
	'uid': 'UID',
	'uid_old': '바뀌기 전 UID',
	'uid_new': '바뀐 후 UID',
	'gid': 'GID',
	'gid_old': '바뀌기 전 GID',
	'gid_new': '바뀐 후 GID',
	'message': '이벤트 내용',
	'equiplist': '자산',
	'searchtime': '발생일시',
}

var lvar_eventFileIntOperation = {
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
	lf_initEventFileInt();	
});

function lf_eventFileIntSelectType(thiz){
	var value = $(thiz).val();
	$('#event_fileInt_search_value_field').children().hide();
	
	if(value == 'date' || value == 'equiplist'){
		$('#event_fileInt_search_operation').hide();
		$('#event_fileInt_search_operation_not').fadeIn();
	}
	else{
		$('#event_fileInt_search_operation').fadeIn();
		$('#event_fileInt_search_operation_not').hide();
	}
	
	$('#event_fileInt_search_value_field').find('#'+lvar_param_prefix+'_'+value).fadeIn();
	
}

function lf_eventFileIntEquipSelect(){
	var callback = function(selectEquips){
		let selectEquipInfo = [];
		for(let key in selectEquips){
			selectEquipInfo.push(key);
		}
		$('#event_fileInt_equipList').data('selectEquipInfo', selectEquipInfo);
		
		if(selectEquips.length == 0){
			cf_alert('경고', '자산을 선택하여 주십시오.');
			return false;
		}
		
		if(selectEquips.length == 1){
			$('#event_fileInt_equipList').val(selectEquips[0].equipname+'('+selectEquips[0].masterip+') 자산이 선택되었습니다.');
		}
		else{
			let equipListStr = '';
			$('#event_fileInt_equipList').val(Object.keys(selectEquips).length+'대의 자산이 선택되었습니다.');
			let keyCnt = 0;
			
			for(let key in selectEquips){
				if(keyCnt == 0 ) equipListStr = selectEquips[key].equipname+' ('+selectEquips[key].masterip+')';
				else equipListStr += ', '+selectEquips[key].equipname+' ('+selectEquips[key].masterip+')';
				keyCnt++;
			}
			
			$('#event_fileInt_equipList').attr('onclick', null);
			$('#event_fileInt_equipList').attr('data-container', 'body');
			$('#event_fileInt_equipList').attr('data-toggle', 'popover');
			$('#event_fileInt_equipList').attr('data-placement', 'top');
			$('#event_fileInt_equipList').attr('data-original-title', '선택된 자산');
			$('#event_fileInt_equipList').attr('data-content', equipListStr);
			
			$('#event_fileInt_equipList').popover();
		}
		
		return true;
	}
	
	cf_selectEquipDialog('MULTI', callback);
}


function lf_initEventFileInt(){
	$('#'+lvar_param_prefix+'_starttime').val((new Date()).format('yyyy-MM-dd')+'T00:00:00');
	$('#'+lvar_param_prefix+'_endtime').val((new Date()).format('yyyy-MM-dd')+'T23:59:59');
	lf_serviceCall700007();
	lf_serviceCall700004();
}

function lf_eventFileIntClick(){
	lvar_event_pageNum = 0;
	lvar_event_TotalCnt = 0;
	lf_serviceCall700007();
	lf_serviceCall700004();
	mscrollbarReset();
}

function lf_addEventFileIntConditionValue(){

	var lvar_param_prefix = 'event_fileInt';

	var type = $('#'+lvar_param_prefix+'_search_type').val();
	var operation = $('#'+lvar_param_prefix+'_search_operation_'+type).val();

	var queryData = {
		'type': type,
		'operation': operation,
		'value': value
	};
	
	if(type == 'equiplist'){
		var value = $('#'+lvar_param_prefix+'_'+type+'_value').data('selectEquipInfo');
		queryData['value'] = value;
		queryData['operation'] = '';
		lf_addEventFileIntCondition(queryData);
	}
	else if(type == 'searchtime'){
		var starttimeValue = $('#'+lvar_param_prefix+'_starttime').val();
		var endtimeValue = $('#'+lvar_param_prefix+'_endtime').val();
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
		
		lf_addEventFileIntCondition(queryData);
	}
	else if('perm' == type){
		var perm_old = $('#event_fileInt_perm_old').val();
		var perm_new = $('#event_fileInt_perm_new').val();
		if(!perm_old && !perm_new) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
		    return;
		}
		
		var value = perm_old+" / "+perm_new;
		var title = lvar_eventFileInt_searchFieldStr['perm_old']+"/"+lvar_eventFileInt_searchFieldStr['perm_new'];
		
		queryData['type'] = type;
		queryData['name'] = 'perm';
		queryData['value'] = value;
		queryData['operation'] = operation;
		queryData['title'] = title;
		lf_addEventFileIntCondition(queryData);
		
	}
	else if('hash' == type){
		var hash_all = $('#event_fileInt_hash_all').val();
		var hash_old = $('#event_fileInt_hash_old').val();
		var hash_new = $('#event_fileInt_hash_new').val();
		if(!hash_all && !hash_old && !hash_new) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
		    return;
		}
		
		var value = hash_all+" / "+hash_old+" / "+hash_new;
		var title = lvar_eventFileInt_searchFieldStr['hash_all']+"/"+lvar_eventFileInt_searchFieldStr['hash_old']+lvar_eventFileInt_searchFieldStr['hash_new'];
		
		queryData['type'] = type;
		queryData['name'] = 'hash';
		queryData['value'] = value;
		queryData['operation'] = operation;
		lf_addEventFileIntCondition(queryData);

	}
	else if('filesize' == type){
		var filesize_all = $('#event_fileInt_filesize_all').val();
		var filesize_old = $('#event_fileInt_filesize_old').val();
		var filesize_new = $('#event_fileInt_filesize_new').val();
		if(!filesize_all && !filesize_old && !filesize_new) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
		    return;
		}
		
		if(!lf_checkLimit(filesize_all, 0, 2147483647) 
			|| !lf_checkLimit(filesize_old, 0, 2147483647) 
			|| !lf_checkLimit(filesize_new, 0, 2147483647)) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다(>=0)", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
		
		var value = filesize_all+" / "+filesize_old+" / "+filesize_new;
		var title = lvar_eventFileInt_searchFieldStr['filesize_all']+"/"+lvar_eventFileInt_searchFieldStr['filesize_old']+lvar_eventFileInt_searchFieldStr['filesize_new'];

		queryData['type'] = type;
		queryData['name'] = 'filesize';
		queryData['value'] = value;
		queryData['operation'] = operation;
		lf_addEventFileIntCondition(queryData);
		
	}
	else if('gid' == type){
		var gid_old = $('#event_fileInt_gid_old').val();
		var gid_new = $('#event_fileInt_gid_new').val();
		if(!gid_old && !gid_new) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
		    return;
		}
		if(!lf_checkLimit(gid_old, 0, 2147483647) 
			|| !lf_checkLimit(gid_new, 0, 2147483647)) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다(>=0)", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
		
		var value = gid_old+" / "+gid_new;
		var title = lvar_eventFileInt_searchFieldStr['gid_old']+"/"+lvar_eventFileInt_searchFieldStr['gid_new'];

		queryData['type'] = type;
		queryData['name'] = 'gid';
		queryData['value'] = value;
		queryData['operation'] = operation;
		lf_addEventFileIntCondition(queryData);
	
	}
	else if('uid' == type){
		var uid_old = $('#event_fileInt_uid_old').val();
		var uid_new = $('#event_fileInt_uid_new').val();
		if(!uid_old && !uid_new) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
		    return;
		}
		if(!lf_checkLimit(uid_old, 0, 2147483647) 
			|| !lf_checkLimit(uid_new, 0, 2147483647)) {
			swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 유효하지 않습니다(>=0)", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
		
		var value = uid_old+" / "+uid_new;
		var title = lvar_eventFileInt_searchFieldStr['uid_old']+"/"+lvar_eventFileInt_searchFieldStr['uid_new'];

		queryData['type'] = type;
		queryData['name'] = 'uid';
		queryData['value'] = value;
		queryData['operation'] = operation;
		lf_addEventFileIntCondition(queryData);
	}
	else if('type' == type){
		queryData['type'] = type;
		queryData['value'] = parseInt($('#'+lvar_param_prefix+'_'+type).val());
		queryData['operation'] = operation;
		lf_addEventFileIntCondition(queryData);
	}
	else{
		queryData['type'] = type;
		queryData['value'] = $('#'+lvar_param_prefix+'_'+type).val();
		queryData['operation'] = operation;
		lf_addEventFileIntCondition(queryData);
	}
}

function lf_checkLimit(value, s, e) {
	if(value == '') return true;
	try {
		var val = parseInt(value);
		return val >= s && val <= e;
	} catch(error) {
		return false;
	}	
}

function lf_addEventFileIntCondition(queryData){
	var type = queryData['type'];
	var operation = queryData['operation'];
	var value = queryData['value'];
	var title = queryData['title'];
	
	if(!value) {
		swal(lvar_eventFileInt_searchFieldStr[type] + " 값이 비어있습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
		return;
	}
		
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');
	if(type == 'searchtime' && queryTable.find("span:contains('" + lvar_eventFileInt_searchFieldStr['searchtime'] + "')").length > 0) {
		swal("검색 시간은 1개 이하만 입력 할 수 있습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
	    return;
	}
	
	var $TR = $('<li></li>');
	$TR.data('queryData', queryData);
	
	if(type == 'equiplist'){
		
	}else if(type == 'searchtime'){
		$TR.append($('<p><span>'+lvar_eventFileInt_searchFieldStr[type]+'</span> / <span>'+value+'</span></p>'));	
	}else if('type' == type){
		$TR.append($('<p><span>'+lvar_eventFileInt_searchFieldStr[type]+'</span> / <span>'+lvar_eventFileIntOperation[operation]+'</span> / <span>'+lvar_eventFileIntTypeObj[value]+'</span></p>'));
	}else{
		if(title){
			$TR.append($('<p><span>'+lvar_eventFileInt_searchFieldStr[type]+'</span> / <span>'+lvar_eventFileIntOperation[operation]+'</span> / <span>'+value+'</span></p>').attr("title",title));
		}else{
			$TR.append($('<p><span>'+lvar_eventFileInt_searchFieldStr[type]+'</span> / <span>'+lvar_eventFileIntOperation[operation]+'</span> / <span>'+value+'</span></p>'));
		}
	}	
		
	$TR.append($('<a class="removex" title="삭제" onclick="javascript: $(this).parent().remove();"></a>'));
	queryTable.find('ul').append($TR);

	lf_eventfileIntsearchClear();
}

function lf_eventfileIntsearchClear(){
	$('.fileInt_date').val("");
	$('#'+lvar_param_prefix+'_path').val("");
	$('#'+lvar_param_prefix+'_type option[selected=1]').attr('selected','selected');
	$('.fileInt_perm').val("");
	$('.fileInt_hash').val("");
	$('.fileInt_filesize').val("");
	$('.fileInt_uid').val("");
	$('.fileInt_gid').val("");
	$('#'+lvar_param_prefix+'_message').val("");
}


function lf_serviceCall700004(pageNum){

	if(!pageNum && pageNum != 0){
		pageNum = lvar_event_pageNum;
	}else{
		switch(pageNum){
		case 'first': pageNum = 0; break;
		case 'previous': pageNum = lvar_event_pageNum-1; break;
		case 'next': pageNum = lvar_event_pageNum+1; break;
		case 'last': pageNum = Math.ceil(lvar_event_TotalCnt/lvar_event_pageCnt)-1; break;
		}
	}
	lvar_event_pageNum = pageNum;
	
	var parameters = [];
	var starttime = null;
	var endtime = null;
	var equiplist = null;
	
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');
	queryTable.find('ul li').each(function(){
		var queryData = $(this).data('queryData');
		var paramType = queryData['type'];
		var operation = queryData['operation'];
		var paramValue = queryData['value'];
		
		if('searchtime' == paramType){
			starttime = paramValue.split('~')[0];
			endtime = paramValue.split('~')[1];
		}
		else if('equiplist' == paramType){
			var eqList = queryData['value'].split(",");
			if(eqList != null && eqList.length > 0) {
				if(equiplist == null) {
					equiplist = eqList;
				} else {
					equiplist.push(...eqList);
				}
			}
		}
		else{
			var param = {}; 
			param['name'] = paramType;
			param['value'] = paramValue;
			param['operation'] = operation;
			parameters.push(param);
		}
	});
	
	var body = {
		'page' : lvar_event_pageNum,
		'topn' :  lvar_event_pageCnt,
		'parameters': parameters
	};

	if(equiplist != null) body['equiplist'] = equiplist;
	if(starttime != null) body['starttime'] = starttime;
	if(endtime != null) body['endtime'] = endtime;
	body['info'] = lvar_event_init;
		
	var table = $('#'+lvar_param_prefix+'_result_table');
	table.find('> tbody tr').remove();	
	cf_contPreloader(lvar_param_prefix+'_result_table');
	cf_requestServer(_TR_EVENT_FILEINT_SEARCH,body,lf_serviceCall700004Callback);
}

function lf_serviceCall700004Callback(data, body){
	
	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(300);
	
	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	table.clear().draw();
	$('#detailData').val("");
	cf_contPreloader(lvar_param_prefix+'_result_table');
	
	var dataList = data.body.dataList;
	$.each(dataList, function(idx, rowData){
		var number = idx+1;
		table.row.add([
			// 2023-09-07 이성호 페이지 넘버링 변경
			//"<td class=\'long_w\'>"+(idx+1)+"</td>",
			"<td class=\'long_w\'>"+((body.page*body.topn)+(idx+1))+"<p style='display:none;'>"+(idx+1)+"</p></td>",
			"<td class=\'long_w\'>"+rowData['dn'] + ' ('+rowData['equip_ip']+")</td>",
			"<td class=\'long_w\'>"+lvar_eventFileIntTypeObj[(rowData['type'])]+"</td>",
			"<td class=\'long_w\'>"+rowData['message']+"</td>",
			"<td class=\'long_w\'>"+rowData['revisetime']+"</td>"
		]);
		var detailData = number+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['revisetime']+'¥'
		+lvar_eventFileIntTypeObj[(rowData['type'])]+'¥'+rowData['path']+'¥'+rowData['perm_old']+'¥'
		+rowData['perm_new']+'¥'+rowData['gid_old']+'¥'+rowData['gid_new']+'¥'
		+rowData['createtime']+'¥'+rowData['size_old']+'¥'+rowData['size_new']+'¥'
		+rowData['uid_old']+'¥'+rowData['uid_new']+'¥'+rowData['message']+'¥'
		+rowData['hash_old']+'¥'+rowData['hash_new']+'¥'+rowData['collecttime']+'¥'
		+rowData['revisetime'];
		
		if(idx >0){
		$('#detailData').val($('#detailData').val()+'~'+detailData);
		}else $('#detailData').val(detailData); 

	});
	table.draw();

	$('#'+lvar_param_prefix+'_result_table').find('> tbody tr').addClass('modalLoad')
	.attr({
	rel : 'eventFileintDetail_modal',
	onclick : 'lf_eventFileintTableClick(this);'
	});
	
	if($("#exportFile").length == 0) {
		$('#event_fileInt_result_table_length').children('div:eq(0)').append(
			'<span id=exportFile data-id=fileint data-format=excel data-ui=' + lvar_param_prefix 
			+ ' style=cursor:pointer onclick=javascript:lf_exportFile(this)> ::Excel</span>'
		);
	}

	lf_serviceButtonDataCallback(data);
}

function lf_serviceButtonDataCallback(data){
	var pageArr = $('#fileint_paging').val().split('_');
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
	
	$('#fileint_paging').val(pagingValue);		
}

function lf_eventFileintTableClick(obj){
	// 2023-09-07 이성호 페이지 넘버링 변경
	//var num = $(obj).children(':first').text();
	var num = $(obj).children(':first').children(':last').text();
	$('#detailNum').val("");
	$('#detailNum').val("fileInt_"+num);
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');
}

function lf_serviceCall700007(){
	
	var parameters = [];
	var starttime = null;
	var endtime = null;
	var equiplist = null;
	
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');
	
	queryTable.find('ul li').each(function(){
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];
		if('searchtime' == type){
			var timeArr = value.split('~');
			starttime = timeArr[0];
			endtime = timeArr[1];
		}
		else if('equiplist' == type){
			var eqList = queryData['value'].split(",");
			if(eqList != null && eqList.length > 0) {
				if(equiplist == null) {
					equiplist = eqList;
				} else {
					equiplist.push(...eqList);
				}
			}
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
		'page' : lvar_event_pageNum,
		'topn' :  lvar_event_pageCnt,
		'parameters': parameters,
		'trId': lvar_param_trId
	};
	
	if(equiplist != null) body['equiplist'] = equiplist;
	if(starttime != null) body['starttime'] = starttime;
	if(endtime != null) body['endtime'] = endtime;
	
	cf_contPreloader(lvar_param_prefix+'_result_table');
	cf_requestServer(_TR_EVENT_PAGEINFO_SEARCH,body,lf_serviceCall700007Callback);
}

function lf_serviceCall700007Callback(data){
	var dataInfo = data.body.info;
	var totalCnt = dataInfo['totalcnt'];
	lvar_event_TotalCnt = totalCnt;
	var page = dataInfo['page'] ? dataInfo['page']-1 : 0;
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
	//if(totalCnt > 0){
	_fnUpdatePaginate(settings,info);
	//}

	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(300);
	
	$('#fileint_paging').val(pagingValue);
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
					start      = info.start,
					len        = info.length,
					visRecords = info.recordsDisplay,
					all        = all,
					page = info.page,
					pages = info.pages,
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
			lf_serviceCall700004(e.data.action);
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
	lvar_event_pageCnt = length;
	lf_serviceCall700007();
	lf_serviceCall700004();
	mscrollbarReset();
}