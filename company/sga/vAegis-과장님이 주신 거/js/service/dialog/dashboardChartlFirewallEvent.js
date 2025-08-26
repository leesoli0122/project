
var lvar_dashboardFirewallEventPageCnt = 18;
var lvar_dashboardFirewallEventPageNum = 0;
var lvar_dashboardFirewallEventTotalCnt = 0;

var lvar_paginationFirewallEventViewCnt = 18;
var lvar_paginationFirewallEventInitFlag = false;
var lvar_dashboardFirewallCompareArr = [];

const lvar_Firewall_totPageLimit = 10;
var lvar_body = {};
var lvar_initParam = {};

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

var lvar_eventFirewallDialog_searchFieldStr = {
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
	'path': '파일 경로',
}


$(function () {
	var paramData = $('#dashboardFirewallEventDialog').data('initParam');
	lvar_initParam = paramData;
	
	var chartType = paramData['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = paramData['body'];
	var term = paramData['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardFirewallEventSearchName').text('검색시간');
		$('#dashboardFirewallEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
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
				queryText += ' AND '+ lvar_eventFirewallDialog_searchFieldStr[parameters[i]['name']] + ' = '+cf_scaleData(parameters[i]['value']);
			}
			
		} else {
			queryText = ' AND '+ lvar_eventFirewallDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']);
		}
		$('#dashboardFirewallEventSearchName').text('쿼리');
		$('#dashboardFirewallEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ queryText);		
	}
	
	lf_dashboardFirewallEventDialogServiceCall700001();
	
});

function lf_dashboardFirewallEventDialogServiceCall700001(pageNum){
	if(pageNum == null) pageNum = lvar_dashboardFirewallEventPageNum;
	lvar_dashboardFirewallEventPageNum = parseInt(pageNum);
	
	var body = lvar_body;
	
	body['page'] = lvar_dashboardFirewallEventPageNum;
	body['topn'] = lvar_dashboardFirewallEventPageCnt;
	
	if(!lvar_paginationFirewallEventInitFlag){
		body['info'] = true;
	}
	else body['info'] = false;
	
	// 검색조건 예시
	
	var table = $('#dashboardFirewallEventTable');
	cf_contPreloader('dashboardFirewallEventTable');
	
	table.find('> tbody > tr:not(:first)').remove();
	
	cf_requestServer(_TR_EVENT_FIREWALL_SEARCH,body,lf_dashboardFirewallEventDialogServiceCall700001Callback);
}

function lf_dashboardFirewallEventDialogServiceCall700001Callback(data, body){
	cf_contPreloader('dashboardFirewallEventTable');
	
	var table = $('#dashboardFirewallEventTable');
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0 ){
		$('#dashboardFirewallEventTable').parent().hide();
		var cnt = ((lvar_dashboardFirewallEventPageNum) * lvar_dashboardFirewallEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
			if(lvar_dashboardFirewallCompareArr.length > 0){
				if(lvar_dashboardFirewallCompareArr[0]){
					if(lvar_dashboardFirewallCompareArr[0] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
				if(lvar_dashboardFirewallCompareArr[1]){
					if(lvar_dashboardFirewallCompareArr[1] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
			}
			
			$rowHTML.find("td:eq(0)").text(order);
			
			var column1Val = rowData['dn'] + ' ('+rowData['equip_ip']+')';
			$rowHTML.find("td:eq(1)").text(column1Val);
			
			var column2Val = rowData['src_ip'] + ':'+rowData['src_port'];
			$rowHTML.find("td:eq(2)").text(column2Val);
			
			var column3Val = rowData['dest_ip'] + ':'+rowData['dest_port'];
			$rowHTML.find("td:eq(3)").text(column3Val);
			
			var column4Val = rowData['proto'];
			$rowHTML.find("td:eq(4)").text(column4Val);
			
			if(rowData['eve']){
				if(rowData['eve']['alert']){
					var column5Val = rowData['eve']['alert']['action'];
					$rowHTML.find("td:eq(5)").text(column5Val);
				}
				if(rowData['eve']['http']){
					var column5Val = rowData['eve']['http']['action'];
					$rowHTML.find("td:eq(5)").text(column5Val);
				}
			}
			
			var column6Val = rowData['createtime'];
			$rowHTML.find("td:eq(6)").text(column6Val);
			
			$rowHTML.show();
			table.find('> tbody tr:last').after($rowHTML);
			
			var flow;
			if(rowData['eve']['flow']) flow = rowData['eve']['flow'];
			else flow = {};
			
			var event = new SolipsEvent(rowData);
			var eve = (rowData['eve']['alert'] ? rowData['eve']['alert'] : rowData['eve']['http']);
			var detailData = order+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['createtime']+'¥'
			+rowData['src_port']+'¥'+rowData['revisetime']+'¥'+eve['signature_id']+'¥'
			+rowData['dest_port']+'¥'+eve['severity']+'¥'+flow['bytes_toclient']+'¥'
			+rowData['collecttime']+'¥'+event.getTimestamp()+'¥'+event.getFlowStart()+'¥'
			+eve['rev']+'¥'+rowData['proto']+'¥'+flow['pkts_toclient']+'¥'
			+rowData['equip_ip']+'¥'+rowData['equip_id']+'¥'+rowData['flow_id']+'¥'
			+rowData['event_type']+'¥'+eve['gid']+'¥'+flow['pkts_toserver']+'¥'
			+eve['signature']+'¥'+eve['category']+'¥'+flow['bytes_toserver']
			+'¥'+(rowData['src_ip']+':'+rowData['src_port']) + '¥' + (rowData['dest_ip']+':'+rowData['dest_port']);
			
			if(i >0){
				$('#detailData').val($('#detailData').val()+'~'+detailData);
			}else $('#detailData').val(detailData); 
		}
		
		if(!lvar_paginationFirewallEventInitFlag){
			lvar_dashboardFirewallEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationFirewallEventInitFlag = true;
		
		$('#dashboardFirewallEventTable').parent().slideDown(600);
	}
	
	lf_paginationFirewallInit();
	
}

function lf_dashboardFirewallEventTabContentActive(rowData){
	
	var $h4 = $('<h4 class="dashboardFirewallInfo'+rowData['order']+'"><span>('+rowData['order']+')</span> '+rowData['dn']
	+' ('+rowData['equip_ip']+') / '
	+rowData['createtime'].substring(11, rowData['createtime'].length)+'</h4>'
	);
	
	$('#dashboardFirewallEventDetailTitle').prepend($h4);
	
	if($('#dashboardFirewallEventDetailTitle > h4').length == 3){
		$('#dashboardFirewallEventDetailTitle > h4:last').remove();
	}
	
	var detailBox = $('<div class="detail dashboardFirewallInfo'+rowData['order']+'"><ul class="detail_list"></ul></div>');
	
	var infoData = {};
	getJsonAllData(rowData, infoData);
	
	if((Object.keys(infoData)).length > 0){
		for(var key in infoData){
			detailBox.find('.detail_list').append($('<li><dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+infoData[key]+'">'+infoData[key]+'</dd></dl></li>'));
		}
		
		detailBox.data('order', infoData['order']);
		
		$('#dashboardFirewallEventDetailContent > div.detail_box').prepend(detailBox);
	}
	
	if($('#dashboardFirewallEventDetailContent > div.detail_box > div').length == 3){
		$('#dashboardFirewallEventDetailContent > div.detail_box > div:last').remove();
	}
	
}

function lf_dashboardFirewallEventCompareObj(flag, order){
	if(!flag){
		if(lvar_dashboardFirewallCompareArr.length == 2){
			lvar_dashboardFirewallCompareArr.shift();
		}
		
		lvar_dashboardFirewallCompareArr.push(order);
	}
	else{
		
		if(lvar_dashboardFirewallCompareArr[0]){
			if(lvar_dashboardFirewallCompareArr[0] == order){
				lvar_dashboardFirewallCompareArr.splice(0, 1);
			}
		}
		if(lvar_dashboardFirewallCompareArr[1]){
			if(lvar_dashboardFirewallCompareArr[1] == order){
				lvar_dashboardFirewallCompareArr.splice(1, 1)
			}
		}
		
	}
}

function lf_dashboardFirewallEventListCompareCheck(){
	var table = $('#dashboardFirewallEventTable');
	var listTR = table.find('> tbody > tr:not(:first)');
	
	listTR.each(function(){
		var rowData = $(this).data('rowData');
		var order = rowData['order'];
		
		var ok = false;
		if(lvar_dashboardFirewallCompareArr.length > 0){
			for(var i = 0; i < lvar_dashboardFirewallCompareArr.length; i++){
				if(lvar_dashboardFirewallCompareArr[i] == order){
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

function lf_dashboardFirewallEventTableRowClk(thiz){
	var rowData = $(thiz).data('rowData');
	
	console.log(rowData);
	
	var num = $(thiz).children(':first').text();
	$('#detailNum').val("");
	$('#detailNum').val("fw_"+num);
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');	
}

function lf_dashboardFirewallEventInfoTabRemove(thiz){
	event.stopPropagation();
	
	var li = $(thiz).parent();
	
	var rowDataOrder = (li.data('rowData'))['order'];
	lf_dashboardFirewallEventInfoRemoveOrder(rowDataOrder);
}

function lf_dashboardFirewallEventInfoRemoveOrder(order){
	
	if(lvar_dashboardFirewallCompareArr.indexOf(order) >= 0){
		lvar_dashboardFirewallCompareArr.splice(lvar_dashboardFirewallCompareArr.indexOf(order), 1);
	}
	
	$('.dashboardFirewallInfo'+order).remove();
	lf_dashboardFirewallEventListCompareCheck();
}


function lf_dashboardFirewallEventInfoInit(){
	lvar_dashboardFirewallCompareArr = [];
	lf_dashboardFirewallEventListCompareCheck();
	
	$('#dashboardFirewallEventDetailTab').empty();
	$('#dashboardFirewallEventDetailTitle').empty();
	$('#dashboardFirewallEventDetailContent > div.detail_box').empty();
	
}

function lf_openEventFirewallViewWindow(thiz){  
	
	var newWindow = window.open('./dashboardEventFirewallView.do', '_blank');
	newWindow['eventData'] = lvar_initParam;
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationFirewallClk(thiz){
	$('#dashboardFirewallEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text()) - 1;
	lf_dashboardFirewallEventDialogServiceCall700001(cnt);
}

function lf_paginationFirewallInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardFirewallEventTotalCnt / lvar_dashboardFirewallEventPageCnt);
	
	$('#dashboardFirewallEventPagination').empty();
	
	if(totPageTot <= 1){
		$('#dashboardFirewallEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardFirewallEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if(lvar_dashboardFirewallEventPageNum == 0){ // 첫페이지
			$('#dashboardFirewallEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
			$('#dashboardFirewallEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		} else if(lvar_dashboardFirewallEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		} else { // 중간
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardFirewallEventTotalCnt < lvar_paginationFirewallEventViewCnt){
		$('#dashboardFirewallEventPagination').append('<li class="active" page="0"><a href="#">1</a></li>');
	}
	else{
		var pageStart = Math.floor(lvar_dashboardFirewallEventPageNum / lvar_Firewall_totPageLimit) * lvar_Firewall_totPageLimit;
		var pageCnt = 0; 
		for(var i = pageStart; i<totPageTot && pageCnt<lvar_Firewall_totPageLimit; i++){
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallClk(this);" ' 
				+ 'class="'+(i == lvar_dashboardFirewallEventPageNum ? 'active' : '')
				+'" page="'+i+'">' 
				+ '<a href="#">'+(i+1)+'</a></li>');
			pageCnt++;
		}
	}
		
	if(totPageTot <= 1){
		$('#dashboardFirewallEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardFirewallEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardFirewallEventPageNum == 0){ // 첫페이지
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'last\');" class="last"><a href="#">Last</a></li>');	
		} else if(lvar_dashboardFirewallEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardFirewallEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
			$('#dashboardFirewallEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		} else { // 중간
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardFirewallCurrentPage').text(lvar_dashboardFirewallEventPageNum + 1);
	$('#dashboardFirewallTotPage').text(totPageTot);
	
}

function lf_paginationFirewallEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardFirewallEventTotalCnt / lvar_dashboardFirewallEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardFirewallEventPageNum = 0;
	}
	else if(mode == 'previous'){
		lvar_dashboardFirewallEventPageNum = lvar_dashboardFirewallEventPageNum - 1;
	}
	else if(mode == 'next'){
		lvar_dashboardFirewallEventPageNum = lvar_dashboardFirewallEventPageNum + 1;
	}
	else if(mode == 'last'){
		//lvar_dashboardFirewallEventPageNum = totPageTot;
		if(totPageTot > 0) lvar_dashboardFirewallEventPageNum = totPageTot-1;
		else lvar_dashboardFirewallEventPageNum = totPageTot;
	}
	
	lf_dashboardFirewallEventDialogServiceCall700001();
}