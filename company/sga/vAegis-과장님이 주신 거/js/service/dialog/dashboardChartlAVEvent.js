
var lvar_dashboardAVEventPageCnt = 18;
var lvar_dashboardAVEventPageNum = 0;
var lvar_dashboardAVEventTotalCnt = 0;

var lvar_paginationAVEventViewCnt = 18;
var lvar_paginationAVEventInitFlag = false;
var lvar_dashboardAVCompareArr = [];

const lvar_AV_totPageLimit = 10;
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

var lvar_eventAVDialog_searchFieldStr = {
	'starttime': '시작일시',
	'endtime': '종료일시',
	'src_ip': '출발지 IP',
	'src_port': '출발지 Port',
	'dest_ip': '도착지 IP',
	'dest_port': '도착지 Port',
	'action': '액션',
	'equiplist': '자산',
	'signature_id': '정책ID',
	'path': '파일 경로',
}


$(function () {
	var paramData = $('#dashboardAVEventDialog').data('initParam');
	lvar_initParam = paramData;
	
	var chartType = paramData['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = paramData['body'];
	var term = paramData['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardAVEventSearchName').text('검색시간');
		$('#dashboardAVEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardFileIntEventSearchName').text('쿼리');
		$('#dashboardFileIntEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ ' AND 자산ID = '+lvar_body['equiplist'][0]);
	}
	else{
		var parameters = lvar_body['parameters'];
		var queryText = '';
		if(parameters.constructor == Array) {
			for(var i=0; i<parameters.length; i++) {
				queryText += ' AND '+ lvar_eventAVDialog_searchFieldStr[parameters[i]['name']] + ' = '+cf_scaleData(parameters[i]['value']);
			}
			
		} else {
			queryText = ' AND '+ lvar_eventAVDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']);
		}
		$('#dashboardAVEventSearchName').text('쿼리');
		$('#dashboardAVEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ queryText);
	}
	
	lf_dashboardAVEventDialogServiceCall700003();
	
});

function lf_dashboardAVEventDialogServiceCall700003(pageNum){
	if(pageNum == null) pageNum = lvar_dashboardAVEventPageNum;
	lvar_dashboardAVEventPageNum = parseInt(pageNum);
	
	var body = lvar_body;
	
	body['page'] = lvar_dashboardAVEventPageNum;
	body['topn'] = lvar_dashboardAVEventPageCnt;
	
	if(!lvar_paginationAVEventInitFlag){
		body['info'] = true;
	}
	else body['info'] = false;
	
	// 검색조건 예시
	
	var table = $('#dashboardAVEventTable');
	cf_contPreloader('dashboardAVEventTable');
	
	table.find('> tbody > tr:not(:first)').remove();
	
	cf_requestServer(_TR_EVENT_AV_SEARCH,body,lf_dashboardAVEventDialogServiceCall700003Callback);
}

function lf_dashboardAVEventDialogServiceCall700003Callback(data, body){
	cf_contPreloader('dashboardAVEventTable');
	
	var table = $('#dashboardAVEventTable');
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0 ){
		$('#dashboardAVEventTable').parent().hide();
		var cnt = ((lvar_dashboardAVEventPageNum) * lvar_dashboardAVEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			var event = new SolipsEvent(rowData);
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
			if(lvar_dashboardAVCompareArr.length > 0){
				if(lvar_dashboardAVCompareArr[0]){
					if(lvar_dashboardAVCompareArr[0] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
				if(lvar_dashboardAVCompareArr[1]){
					if(lvar_dashboardAVCompareArr[1] == order){
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
					var column5Val = event.getSignature();
					$rowHTML.find("td:eq(5)").text(column5Val);
					
					var column6Val = event.getSeverityName();
					$rowHTML.find("td:eq(6)").text(column6Val);
					
					var column7Val = rowData['eve']['http']['action'];
					$rowHTML.find("td:eq(7)").text(column7Val);
				}
				
			}
			
			var column6Val = rowData['revisetime'];
			$rowHTML.find("td:eq(8)").text(column6Val);
			
			$rowHTML.show();
			table.find('> tbody tr:last').after($rowHTML);
			
			var flow;
			if(rowData['eve']['flow']) flow = rowData['eve']['flow'];
			else flow = {};
			
			var eve = (rowData['eve']['alert'] ? rowData['eve']['alert'] : rowData['eve']['http']);
			var detailData = order+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['revisetime']+'¥'
			+rowData['src_port']+'¥'+rowData['revisetime']+'¥'+eve['signature_id']+'¥'
			+rowData['dest_port']+'¥'+event.getSeverityName()+'¥'+flow['bytes_toclient']+'¥'
			+rowData['collecttime']+'¥'+rowData['eve']['timestamp']+'¥'+flow['start']+'¥'
			+eve['rev']+'¥'+rowData['proto']+'¥'+flow['pkts_toclient']+'¥'
			+rowData['equip_ip']+'¥'+rowData['equip_id']+'¥'+rowData['flow_id']+'¥'
			+rowData['event_type']+'¥'+eve['gid']+'¥'+flow['pkts_toserver']+'¥'
			+event.getSignature()+'¥'+event.getCategory()+'¥'+flow['bytes_toserver']
			+'¥'+(rowData['src_ip']+':'+rowData['src_port']) + '¥' + (rowData['dest_ip']+':'+rowData['dest_port']);
			
			if(i >0){
				$('#detailData').val($('#detailData').val()+'~'+detailData);
			}else $('#detailData').val(detailData); 
		}
		
		if(!lvar_paginationAVEventInitFlag){
			lvar_dashboardAVEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationAVEventInitFlag = true;
		
		$('#dashboardAVEventTable').parent().slideDown(600);
	}
	
	lf_paginationAVInit();
	
}

function lf_dashboardAVEventTabContentActive(rowData){
	
	var $h4 = $('<h4 class="dashboardAVInfo'+rowData['order']+'"><span>('+rowData['order']+')</span> '+rowData['dn']
	+' ('+rowData['equip_ip']+') / '
	+rowData['createtime'].substring(11, rowData['createtime'].length)+'</h4>'
	);
	
	$('#dashboardAVEventDetailTitle').prepend($h4);
	
	if($('#dashboardAVEventDetailTitle > h4').length == 3){
		$('#dashboardAVEventDetailTitle > h4:last').remove();
	}
	
	var detailBox = $('<div class="detail dashboardAVInfo'+rowData['order']+'"><ul class="detail_list"></ul></div>');
	
	var infoData = {};
	getJsonAllData(rowData, infoData);
	
	if((Object.keys(infoData)).length > 0){
		for(var key in infoData){
			detailBox.find('.detail_list').append($('<li><dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+infoData[key]+'">'+infoData[key]+'</dd></dl></li>'));
		}
		
		detailBox.data('order', infoData['order']);
		
		$('#dashboardAVEventDetailContent > div.detail_box').prepend(detailBox);
	}
	
	if($('#dashboardAVEventDetailContent > div.detail_box > div').length == 3){
		$('#dashboardAVEventDetailContent > div.detail_box > div:last').remove();
	}
	
}

function lf_dashboardAVEventCompareObj(flag, order){
	if(!flag){
		if(lvar_dashboardAVCompareArr.length == 2){
			lvar_dashboardAVCompareArr.shift();
		}
		
		lvar_dashboardAVCompareArr.push(order);
	}
	else{
		
		if(lvar_dashboardAVCompareArr[0]){
			if(lvar_dashboardAVCompareArr[0] == order){
				lvar_dashboardAVCompareArr.splice(0, 1);
			}
		}
		if(lvar_dashboardAVCompareArr[1]){
			if(lvar_dashboardAVCompareArr[1] == order){
				lvar_dashboardAVCompareArr.splice(1, 1)
			}
		}
		
	}
}

function lf_dashboardAVEventListCompareCheck(){
	var table = $('#dashboardAVEventTable');
	var listTR = table.find('> tbody > tr:not(:first)');
	
	listTR.each(function(){
		var rowData = $(this).data('rowData');
		var order = rowData['order'];
		
		var ok = false;
		if(lvar_dashboardAVCompareArr.length > 0){
			for(var i = 0; i < lvar_dashboardAVCompareArr.length; i++){
				if(lvar_dashboardAVCompareArr[i] == order){
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

function lf_dashboardAVEventTableRowClk(thiz){
	var rowData = $(thiz).data('rowData');
	
	console.log(rowData);
	
	var num = $(thiz).children(':first').text();
	$('#detailNum').val("");
	$('#detailNum').val("av_"+num);
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');	
}

function lf_dashboardAVEventInfoTabRemove(thiz){
	event.stopPropagation();
	
	var li = $(thiz).parent();
	
	var rowDataOrder = (li.data('rowData'))['order'];
	lf_dashboardAVEventInfoRemoveOrder(rowDataOrder);
}

function lf_dashboardAVEventInfoRemoveOrder(order){
	
	if(lvar_dashboardAVCompareArr.indexOf(order) >= 0){
		lvar_dashboardAVCompareArr.splice(lvar_dashboardAVCompareArr.indexOf(order), 1);
	}
	
	$('.dashboardAVInfo'+order).remove();
	lf_dashboardAVEventListCompareCheck();
}


function lf_dashboardAVEventInfoInit(){
	lvar_dashboardAVCompareArr = [];
	lf_dashboardAVEventListCompareCheck();
	
	$('#dashboardAVEventDetailTab').empty();
	$('#dashboardAVEventDetailTitle').empty();
	$('#dashboardAVEventDetailContent > div.detail_box').empty();
	
}

function lf_openEventAVViewWindow(thiz){  
	
	var newWindow = window.open('./dashboardEventAVView.do', '_blank');
	newWindow['eventData'] = lvar_initParam;
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationAVClk(thiz){
	$('#dashboardAVEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text()) - 1;
	lf_dashboardAVEventDialogServiceCall700003(cnt);
}

function lf_paginationAVInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardAVEventTotalCnt / lvar_dashboardAVEventPageCnt);
	
	$('#dashboardAVEventPagination').empty();
	
	if(totPageTot <= 1){
		$('#dashboardAVEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardAVEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if(lvar_dashboardAVEventPageNum == 0){ // 첫페이지
			$('#dashboardAVEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
			$('#dashboardAVEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		} else if(lvar_dashboardAVEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		} else { // 중간
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardAVEventTotalCnt < lvar_paginationAVEventViewCnt){
		$('#dashboardAVEventPagination').append('<li class="active" page="0"><a href="#">1</a></li>');
	}
	else{
		var pageStart = Math.floor(lvar_dashboardAVEventPageNum / lvar_AV_totPageLimit) * lvar_AV_totPageLimit;
		var pageCnt = 0; 
		for(var i = pageStart; i<totPageTot && pageCnt<lvar_AV_totPageLimit; i++){
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVClk(this);" ' 
				+ 'class="'+(i == lvar_dashboardAVEventPageNum ? 'active' : '')
				+'" page="'+i+'">' 
				+ '<a href="#">'+(i+1)+'</a></li>');
			pageCnt++;
		}	
	}
	
	if(totPageTot <= 1){
		$('#dashboardAVEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardAVEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardAVEventPageNum == 0){ // 첫페이지
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'last\');" class="last"><a href="#">Last</a></li>');	
		} else if(lvar_dashboardAVEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardAVEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
			$('#dashboardAVEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		} else { // 중간
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardAVCurrentPage').text(lvar_dashboardAVEventPageNum + 1);
	$('#dashboardAVTotPage').text(totPageTot);
	
}

function lf_paginationAVEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardAVEventTotalCnt / lvar_dashboardAVEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardAVEventPageNum = 0;
	}
	else if(mode == 'previous'){
		lvar_dashboardAVEventPageNum = lvar_dashboardAVEventPageNum - 1;
	}
	else if(mode == 'next'){
		lvar_dashboardAVEventPageNum = lvar_dashboardAVEventPageNum + 1;
	}
	else if(mode == 'last'){
		lvar_dashboardAVEventPageNum = totPageTot;
	}
	
	lf_dashboardAVEventDialogServiceCall700003();
}