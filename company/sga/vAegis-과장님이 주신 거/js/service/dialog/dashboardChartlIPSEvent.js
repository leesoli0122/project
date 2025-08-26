
var lvar_dashboardIPSEventPageCnt = 18;
var lvar_dashboardIPSEventPageNum = 0;
var lvar_dashboardIPSEventTotalCnt = 0;

var lvar_paginationIPSEventViewCnt = 18;
var lvar_paginationIPSEventInitFlag = false;
var lvar_dashboardIPSCompareArr = [];

const lvar_IPS_totPageLimit = 10;
var lvar_body = {};
var lvar_initParam = {};
var lvar_json = {};

var lvar_connectorObj = {
	1: 'equals',
	11: 'not equals',
	2: 'like',
	12: 'not like',
	3: 'less than',
	4: 'less than or equals',
	5: 'greater than',
	6: 'greater than or equals'
}

var lvar_eventIPSDialog_searchFieldStr = {
	'starttime': '시작일시',
	'endtime': '종료일시',
	'src_ip': '출발지 IP',
	'src_port': '출발지 Port',
	'dest_ip': '도착지 IP',
	'dest_port': '도착지 Port',
	'action': '액션',
	'equiplist': '자산',
	'signature_id': '정책ID',
	'hostname': '호스트명',
	'url': '주소',
}


$(function () {
	var paramData = $('#dashboardIPSEventDialog').data('initParam');
	console.log(paramData);
	lvar_initParam = paramData;
	var chartType = paramData['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = paramData['body'];
	var term = paramData['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardIPSEventSearchName').text('검색시간');
		$('#dashboardIPSEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
		lvar_body['event_type'] = 'alert';
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardFileIntEventSearchName').text('자산');
		$('#dashboardFileIntEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ ' AND 자산ID = '+lvar_body['equiplist'][0]);
	}
	else{
		var parameters = lvar_body['parameters'];
		var queryText = '';
		if(parameters.constructor == Array) {
			for(var i=0; i<parameters.length; i++) {
				queryText += ' AND '+ lvar_eventIPSDialog_searchFieldStr[parameters[i]['name']] + ' = '+cf_scaleData(parameters[i]['value']);
			}
			
		} else {			
			queryText = ' AND '+ lvar_eventIPSDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']);
		}
		$('#dashboardIPSEventSearchName').text('쿼리');
		$('#dashboardIPSEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ queryText);
	}

	lf_dashboardIPSEventDialogServiceCall700002();
	
});

function lf_dashboardIPSEventDialogServiceCall700002(pageNum){
	if(pageNum == null) pageNum = lvar_dashboardIPSEventPageNum;
	lvar_dashboardIPSEventPageNum = parseInt(pageNum);
	var body = lvar_body;
	
	body['page'] = lvar_dashboardIPSEventPageNum;
	body['topn'] = lvar_dashboardIPSEventPageCnt;
	
	if(!lvar_paginationIPSEventInitFlag){
		body['info'] = true;
	}
	else body['info'] = false;
	
	// 검색조건 예시
	
	var table = $('#dashboardIPSEventTable');
	cf_contPreloader('dashboardIPSEventTable');
	
	table.find('> tbody > tr:not(:first)').remove();

	//console.log(body);
	cf_requestServer(_TR_EVENT_IPS_SEARCH,body,lf_dashboardIPSEventDialogServiceCall700002Callback);
}

function lf_dashboardIPSEventDialogServiceCall700002Callback(data, body){
	cf_contPreloader('dashboardIPSEventTable');
	
	var table = $('#dashboardIPSEventTable');
	
	var dataList = data.body.dataList;
	
	lvar_json = {};
	if(dataList.length > 0 ){
		$('#dashboardIPSEventTable').parent().hide();
		var cnt = ((lvar_dashboardIPSEventPageNum) * lvar_dashboardIPSEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			var event = new SolipsEvent(rowData);
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
			if(lvar_dashboardIPSCompareArr.length > 0){
				if(lvar_dashboardIPSCompareArr[0]){
					if(lvar_dashboardIPSCompareArr[0] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
				if(lvar_dashboardIPSCompareArr[1]){
					if(lvar_dashboardIPSCompareArr[1] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
			}
			
			$rowHTML.find("td:eq(0)").text(order);
			
			var column1Val = rowData['dn'] + ' ('+rowData['equip_ip']+')';
			$rowHTML.find("td:eq(1)").text(column1Val);
			
			var column2Val = rowData['src_ip'];
			$rowHTML.find("td:eq(2)").text(column2Val);
			
			var column3Val = rowData['dest_ip'];
			$rowHTML.find("td:eq(3)").text(column3Val);
			
			var column4Val = rowData['proto'];
			$rowHTML.find("td:eq(4)").text(column4Val);
			
			if(rowData['eve']){
				if(rowData['eve']['alert']){
					var column5Val = event.getSignature();
					$rowHTML.find("td:eq(5)").text(column5Val);
					
					var column6Val = event.getSeverityName();
					$rowHTML.find("td:eq(6)").text(column6Val);
					
					var column7Val = rowData['eve']['alert']['action'];
					$rowHTML.find("td:eq(7)").text(column7Val);
				}
				
				if(rowData['eve']['http']){
					var column5Val = event.getHttpHostname();
					$rowHTML.find("td:eq(5)").text(column5Val);
					
					var column6Val = event.getSeverityName();
					$rowHTML.find("td:eq(6)").text(column6Val);
					
					var column7Val = rowData['eve']['http']['action'];
					$rowHTML.find("td:eq(7)").text(column7Val);
				}
				
			}
			
			var column6Val = rowData['createtime'];
			$rowHTML.find("td:eq(8)").text(column6Val);
			
			$rowHTML.show();
			table.find('> tbody tr:last').after($rowHTML);
			
			var eve = (rowData['eve']['alert'] ? rowData['eve']['alert'] : rowData['eve']['http']);
			var detailData;
			//console.log(rowData);
			//console.log(eve);
			if(rowData['event_type'] == 'http') {				
				detailData = order+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['createtime']+'¥'
				+event.getHttpHostname()+'¥'+event.getHttpUrl()+'¥'+event.getHttpPort()+'¥'
				+event.getHttpUserAgent()+'¥'+event.getHttpContentType()+'¥'+event.getHttpMethod()+'¥'
				+event.getHttpProtocol()+'¥'+event.getHttpStatus()+'¥'+event.getHttpLength()+'¥'
				+rowData['collecttime']+'¥'+rowData['eve']['timestamp'] + '¥'+rowData['flow_id'] + '¥'
				+(rowData['src_ip']+':'+rowData['src_port']) + '¥' + (rowData['dest_ip']+':'+rowData['dest_port']) + '¥'+rowData['flow_id'];
			} else {
				var flow;
				if(rowData['eve']['flow']) flow = rowData['eve']['flow'];
				else flow = {};
				
				var event = new SolipsEvent(rowData);	
				detailData = order+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['createtime']+'¥'
				+rowData['src_port']+'¥'+rowData['revisetime']+'¥'+eve['signature_id']+'¥'
				+rowData['dest_port']+'¥'+event.getSeverityName()+'¥'+flow['bytes_toclient']+'¥'
				+rowData['collecttime']+'¥'+event.getTimestamp()+'¥'+event.getFlowStart()+'¥'				
				+eve['rev']+'¥'+rowData['proto']+'¥'+flow['pkts_toclient']+'¥'
				+rowData['equip_ip']+'¥'+rowData['equip_id']+'¥'+rowData['flow_id']+'¥'
				+rowData['event_type']+'¥'+eve['gid']+'¥'+flow['pkts_toserver']+'¥'
				+event.getSignature()+'¥'+event.getCategory()+'¥'+flow['bytes_toserver']
				+'¥'+(rowData['src_ip']+':'+rowData['src_port']) + '¥' + (rowData['dest_ip']+':'+rowData['dest_port']);
			}
			
			lvar_json[order] = rowData;
			if(i >0){
				$('#detailData').val($('#detailData').val()+'~'+detailData);
			}else $('#detailData').val(detailData); 
		}
		
		if(!lvar_paginationIPSEventInitFlag){
			lvar_dashboardIPSEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationIPSEventInitFlag = true;
		
		$('#dashboardIPSEventTable').parent().slideDown(600);
	}
	
	lf_paginationIPSInit();
	
}

function lf_dashboardIPSEventTabContentActive(rowData){
	
	var $h4 = $('<h4 class="dashboardIPSInfo'+rowData['order']+'"><span>('+rowData['order']+')</span> '+rowData['dn']
	+' ('+rowData['equip_ip']+') / '
	+rowData['createtime'].substring(11, rowData['createtime'].length)+'</h4>'
	);
	
	$('#dashboardIPSEventDetailTitle').prepend($h4);
	
	if($('#dashboardIPSEventDetailTitle > h4').length == 3){
		$('#dashboardIPSEventDetailTitle > h4:last').remove();
	}
	
	var detailBox = $('<div class="detail dashboardIPSInfo'+rowData['order']+'"><ul class="detail_list"></ul></div>');
	
	var infoData = {};
	getJsonAllData(rowData, infoData);
	
	if((Object.keys(infoData)).length > 0){
		for(var key in infoData){
			detailBox.find('.detail_list').append($('<li><dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+infoData[key]+'">'+infoData[key]+'</dd></dl></li>'));
		}
		
		detailBox.data('order', infoData['order']);
		
		$('#dashboardIPSEventDetailContent > div.detail_box').prepend(detailBox);
	}
	
	if($('#dashboardIPSEventDetailContent > div.detail_box > div').length == 3){
		$('#dashboardIPSEventDetailContent > div.detail_box > div:last').remove();
	}
	
}

function lf_dashboardIPSEventCompareObj(flag, order){
	if(!flag){
		if(lvar_dashboardIPSCompareArr.length == 2){
			lvar_dashboardIPSCompareArr.shift();
		}
		
		lvar_dashboardIPSCompareArr.push(order);
	}
	else{
		
		if(lvar_dashboardIPSCompareArr[0]){
			if(lvar_dashboardIPSCompareArr[0] == order){
				lvar_dashboardIPSCompareArr.splice(0, 1);
			}
		}
		if(lvar_dashboardIPSCompareArr[1]){
			if(lvar_dashboardIPSCompareArr[1] == order){
				lvar_dashboardIPSCompareArr.splice(1, 1)
			}
		}
		
	}
}

function lf_dashboardIPSEventListCompareCheck(){
	var table = $('#dashboardIPSEventTable');
	var listTR = table.find('> tbody > tr:not(:first)');
	
	listTR.each(function(){
		var rowData = $(this).data('rowData');
		var order = rowData['order'];
		
		var ok = false;
		if(lvar_dashboardIPSCompareArr.length > 0){
			for(var i = 0; i < lvar_dashboardIPSCompareArr.length; i++){
				if(lvar_dashboardIPSCompareArr[i] == order){
					ok = true;
				}
			}
		}
		
		if(ok){
			$(this).css('background-color','#f8f9fa');
			$(this).data('flag', true);
		}
		else{
			$(this).css('background-color','');
			$(this).data('flag', false);
		}
		
		
		
	});
}

function lf_dashboardIPSEventTableRowClk(thiz){
	var rowData = $(thiz).data('rowData');
	
	var num = $(thiz).children(':first').text();
	$('#detailNum').val("");
	if(rowData['event_type'] == 'http') {
		$('#detailNum').val("http_"+num);
	} else {
		$('#detailNum').val("ips_"+num);
	}
	if(lvar_json[num]) {
		$('#detailJson').val(JSON.stringify(lvar_json[num], null, 4));
	}
	
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');
}

function lf_dashboardIPSEventInfoTabRemove(thiz){
	event.stopPropagation();
	
	var li = $(thiz).parent();
	
	var rowDataOrder = (li.data('rowData'))['order'];
	lf_dashboardIPSEventInfoRemoveOrder(rowDataOrder);
}

function lf_dashboardIPSEventInfoRemoveOrder(order){
	
	if(lvar_dashboardIPSCompareArr.indexOf(order) >= 0){
		lvar_dashboardIPSCompareArr.splice(lvar_dashboardIPSCompareArr.indexOf(order), 1);
	}
	
	$('.dashboardIPSInfo'+order).remove();
	lf_dashboardIPSEventListCompareCheck();
}


function lf_dashboardIPSEventInfoInit(){
	lvar_dashboardIPSCompareArr = [];
	lf_dashboardIPSEventListCompareCheck();
	
	$('#dashboardIPSEventDetailTab').empty();
	$('#dashboardIPSEventDetailTitle').empty();
	$('#dashboardIPSEventDetailContent > div.detail_box').empty();
	
}

function lf_openEventIPSViewWindow(thiz){  
	var newWindow = window.open('./dashboardEventIPSView.do', '_blank');
	newWindow['eventData'] = lvar_initParam;
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationIPSClk(thiz){
	$('#dashboardIPSEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text()) - 1;
	lf_dashboardIPSEventDialogServiceCall700002(cnt);
}

function lf_paginationIPSInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardIPSEventTotalCnt / lvar_dashboardIPSEventPageCnt);
		
	$('#dashboardIPSEventPagination').empty();

	if(totPageTot <= 1){
		$('#dashboardIPSEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardIPSEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if(lvar_dashboardIPSEventPageNum == 0){ // 첫페이지
			$('#dashboardIPSEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
			$('#dashboardIPSEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		} else if(lvar_dashboardIPSEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		} else { // 중간
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	// 한페이지도 안될때
	if(lvar_dashboardIPSEventTotalCnt < lvar_paginationIPSEventViewCnt){
		$('#dashboardIPSEventPagination').append('<li class="active" page="0"><a href="#">1</a></li>');
	}
	else{
		var pageStart = Math.floor(lvar_dashboardIPSEventPageNum / lvar_IPS_totPageLimit) * lvar_IPS_totPageLimit;	
		var pageCnt = 0; 
		for(var i = pageStart; i<totPageTot && pageCnt<lvar_IPS_totPageLimit; i++){
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSClk(this);" ' 
				+ 'class="'+(i == lvar_dashboardIPSEventPageNum ? 'active' : '')
				+'" page="'+i+'">' 
				+ '<a href="#">'+(i+1)+'</a></li>');
			pageCnt++;
		}
	}
	
	if(totPageTot <= 1){
		$('#dashboardIPSEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardIPSEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardIPSEventPageNum == 0){ // 첫페이지
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'last\');" class="last"><a href="#">Last</a></li>');	
		} else if(lvar_dashboardIPSEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardIPSEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
			$('#dashboardIPSEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		} else { // 중간
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardIPSCurrentPage').text(lvar_dashboardIPSEventPageNum + 1);
	$('#dashboardIPSTotPage').text(totPageTot);
	
}

function lf_paginationIPSEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardIPSEventTotalCnt / lvar_dashboardIPSEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardIPSEventPageNum = 0;
	}
	else if(mode == 'previous'){
		lvar_dashboardIPSEventPageNum = lvar_dashboardIPSEventPageNum - 1;
	}
	else if(mode == 'next'){
		lvar_dashboardIPSEventPageNum = lvar_dashboardIPSEventPageNum + 1;
	}
	else if(mode == 'last'){
		if(totPageTot > 0) lvar_dashboardIPSEventPageNum = totPageTot-1;
		else lvar_dashboardIPSEventPageNum = totPageTot;
	}
	
	console.log(lvar_dashboardIPSEventPageNum);
	
	lf_dashboardIPSEventDialogServiceCall700002();
}