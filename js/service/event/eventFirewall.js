
var lvar_event_pageNum = 0;
var lvar_event_init = false;
var lvar_event_pageCnt = 10;
var lvar_event_TotalCnt = 0;
var lvar_param_prefix = 'event_firewall';
var lvar_param_trId = '700001';

var lvar_eventFirewall_searchFieldStr = {
	'starttime': '시작일시',
	'endtime': '종료일시',
	'src_ip': '출발지 IP',
	'src_port': '출발지 Port',
	'dest_ip': '도착지 IP',
	'dest_port': '도착지 Port',
	'action': '액션',
	'equiplist': '자산',
	'signature': '정책메세지',
	'signature_id': '정책ID',
	'searchtime': '발생일시',
	'allowed' : '허용',
	'blocked': '차단',
}

var lvar_eventFirewallOperation = {
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
	lf_initEventFirewall();
});

function lf_addEventFirewallCondition(){

	var lvar_param_prefix = 'event_firewall';
	
	var type = $('#'+lvar_param_prefix+'_search_type').val();
	var value;
	
	var queryData = {
			'type': type,
			'operation': operation,
			'value': value
		};
	
	if(type == 'searchtime'){
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
	}
	else{
		var operation = $('#'+lvar_param_prefix+'_search_operation_'+type).val();
		value = $('#'+lvar_param_prefix+'_'+type).val();
		queryData['value'] = value;
		queryData['operation'] = operation;
		
		if(!value) {
			swal(lvar_eventFirewall_searchFieldStr[type] + " 값이 비어있습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
			return;
		}
		
		if(type == 'src_port' || type == 'dest_port') {
			if(!cf_isPort(value)) {
				swal(lvar_eventFirewall_searchFieldStr[type] + " 값이 유효하지 않습니다.", {
			        icon: "./assets/images/icon_alert04.png",
			        buttons:"확인"
			    });
				return;
			}
		}
	}
	
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');
	if(type == 'searchtime' && queryTable.find("span:contains('" + lvar_eventFirewall_searchFieldStr['searchtime'] + "')").length > 0) {
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
		$TR.append($('<p><span>'+lvar_eventFirewall_searchFieldStr[type]+'</span> / <span>'+value+'</span></p>'));	
	}else {		
		$TR.append($('<p><span>'+lvar_eventFirewall_searchFieldStr[type]+'</span> / <span>'+lvar_eventFirewallOperation[operation]+'</span> / <span>'+value+'</span></p>'));
	}
	
	$TR.append($('<a class="removex" title="삭제" onclick="javascript: $(this).parent().remove();"></a>'));
	queryTable.find('ul').append($TR);
	
	lf_eventFirewallsearchClear();
}

function lf_eventFirewallsearchClear(){
	$('.firewall_date').val("");
	$('#'+lvar_param_prefix+'_src_ip').val("");
	$('#'+lvar_param_prefix+'_src_port').val("");
	$('#'+lvar_param_prefix+'_dest_ip').val("");
	$('#'+lvar_param_prefix+'_dest_port').val("");
	$('#'+lvar_param_prefix+'_action option[value=allowed]').attr('selected','selected');
}

function lf_eventFirewallSelectType(thiz){
	var value = $(thiz).val();
	$('#event_firewall_search_value_field').children().hide();
	
	if(value == 'date' || value == 'equiplist'){
		$('#event_firewall_search_operation').hide();
		$('#event_firewall_search_operation_not').fadeIn();
	}
	else{
		$('#event_firewall_search_operation').fadeIn();
		$('#event_firewall_search_operation_not').hide();
	}
	
	$('#event_firewall_search_value_field').find('#event_firewall_'+value).fadeIn();
	
}

function lf_getUrlParams() {
	var params = {};
	if(window.location.search != ''){
		var param = Base64.decode(window.location.search);
		param = param.replaceAll(';', '');
		
		var paramArr = param.split('&');
		
		
		if(paramArr.length > 0){
			for(var i = 0; i < paramArr.length; i++){
				var arr = paramArr[i].split('=');
				var key = arr[0];
				var value = arr[1];
				params[key] = value;
			}
		}
	}
	
	return params;
}

function lf_initEventFirewall(){
	$('#'+lvar_param_prefix+'_starttime').val((new Date()).format('yyyy-MM-dd')+' 00:00:00');
	$('#'+lvar_param_prefix+'_endtime').val((new Date()).format('yyyy-MM-dd')+' 23:59:59');
	lf_serviceCall700007();
	lf_serviceCall700001();
}

function lf_eventFirewallClick(){
	lvar_event_pageNum = 0;
	lvar_event_TotalCnt = 0;
	lf_serviceCall700007();
	lf_serviceCall700001();
	mscrollbarReset();
}

function lf_serviceCall700001(pageNum){

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
		'parameters': parameters
	};
	if(equiplist != null) body['equiplist'] = equiplist;
	if(starttime != null) body['starttime'] = starttime;
	if(endtime != null) body['endtime'] = endtime;
	body['info'] = lvar_event_init;
	
	var table = $('#'+lvar_param_prefix+'_result_table');
	table.find('> tbody tr').remove();
	cf_contPreloader(lvar_param_prefix+'_result_table');
	cf_requestServer(_TR_EVENT_FIREWALL_SEARCH,body,lf_serviceCall700001Callback);
}

function lf_serviceCall700001Callback(data, body){
	
	$('#'+lvar_param_prefix+'_result_div').hide();
	$('#'+lvar_param_prefix+'_result_div').slideDown(300);
	
	var table = $('#'+lvar_param_prefix+'_result_table').DataTable();
	table.clear().draw();
	$('#detailData').val("");
	cf_contPreloader(lvar_param_prefix+'_result_table');
	
	var dataList = data.body.dataList;
	$.each(dataList, function(idx, rowData){
		var number = idx+1;
		var eve = (rowData['eve']['alert'] ? rowData['eve']['alert'] : rowData['eve']['http']);
		var event = new SolipsEvent(rowData);
		table.row.add([
			// 2023-09-07 이성호 페이지 넘버링 변경
			//"<td class=\'long_w\'>"+(idx+1)+"</td>",
			"<td class=\'long_w\'>"+((body.page*body.topn)+(idx+1))+"<p style='display:none;'>"+(idx+1)+"</p></td>",
			"<td class=\'long_w\'>"+rowData['dn'] + ' ('+rowData['equip_ip']+")</td>",
			"<td class=\'long_w\'>"+rowData['src_ip'] + ':'+rowData['src_port']+"</td>",
			"<td class=\'long_w\'>"+rowData['dest_ip'] + ':'+rowData['dest_port']+"</td>",
			"<td class=\'long_w\'>"+rowData['proto']+"</td>",
			"<td class=\'long_w\'>"+eve['action']+"</td>",
			"<td class=\'long_w\'>"+rowData['revisetime']+"</td>"
		]);
		
		var flow;
		if(rowData['eve']['flow']) flow = rowData['eve']['flow'];
		else flow = {};
		
		var detailData = number+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['revisetime']+'¥'
		+rowData['src_port']+'¥'+rowData['revisetime']+'¥'+eve['signature_id']+'¥'
		+rowData['dest_port']+'¥'+event.getSeverityName()+'¥'+flow['bytes_toclient']+'¥'
		+rowData['collecttime']+'¥'+event.getTimestamp()+'¥'+event.getFlowStart()+'¥'
		+eve['rev']+'¥'+rowData['proto']+'¥'+flow['pkts_toclient']+'¥'
		+rowData['equip_ip']+'¥'+rowData['equip_id']+'¥'+rowData['flow_id']+'¥'
		+rowData['event_type']+'¥'+eve['gid']+'¥'+flow['pkts_toserver']+'¥'
		+event.getSignature()+'¥'+event.getCategory()+'¥'+flow['bytes_toserver']
		+'¥'+(rowData['src_ip']+':'+rowData['src_port']) + '¥' + (rowData['dest_ip']+':'+rowData['dest_port']);
		
		if(idx >0){
			$('#detailData').val($('#detailData').val()+'~'+detailData);
		}else $('#detailData').val(detailData); 
	});
	table.draw();
	
	$('#'+lvar_param_prefix+'_result_table').find('> tbody tr').addClass('modalLoad')
	.attr({
		rel : 'eventFirewallDetail_modal',
		onclick : 'lf_eventFirewallTableClick(this);'
	});	
	
	if($("#exportFile").length == 0) {
		$('#event_firewall_result_table_length').children('div:eq(0)').append(
			'<span id=exportFile data-id=firewall data-format=excel data-ui=' + lvar_param_prefix 
			+ ' style=cursor:pointer onclick=javascript:lf_exportFile(this)> ::Excel</span>'
		);
	}

	lf_serviceButtonDataCallback(data);
}

function lf_serviceButtonDataCallback(data){
	var pageArr = $('#fw_paging').val().split('_');
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
	
	$('#fw_paging').val(pagingValue);	
}

function lf_eventFirewallTableClick(obj){
	// 2023-09-07 이성호 페이지 넘버링 변경
	//var num = $(obj).children(':first').text();
	var num = $(obj).children(':first').children(':last').text();
	$('#detailNum').val("");
	$('#detailNum').val("fw_"+num);
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
	
	$('#fw_paging').val(pagingValue);
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
			lf_serviceCall700001(e.data.action);
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
	lf_serviceCall700001();
	mscrollbarReset();
}