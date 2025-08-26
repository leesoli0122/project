
var lvar_dashboardAppCtlEventPageCnt = 18;
var lvar_dashboardAppCtlEventPageNum = 0;
var lvar_dashboardAppCtlEventTotalCnt = 0;

var lvar_paginationAppCtlEventViewCnt = 18;
var lvar_paginationAppCtlEventInitFlag = false;
var lvar_dashboardAppCtlCompareArr = [];

const lvar_AppCtl_totPageLimit = 10;
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

var lvar_eventAppCtlDialog_searchFieldStr = {
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
	var paramData = $('#dashboardAppCtlEventDialog').data('initParam');
	lvar_initParam = paramData;
	var chartType = paramData['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = paramData['body'];
	var term = paramData['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardAppCtlEventSearchName').text('검색시간');
		$('#dashboardAppCtlEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardAppCtlEventSearchName').text('자산');
		$('#dashboardAppCtlEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ ' AND 자산ID = '+lvar_body['equiplist'][0]);
	}
	else{
		var parameters = lvar_body['parameters'];
		var queryText = '';
		if(parameters.constructor == Array) {
			for(var i=0; i<parameters.length; i++) {
				queryText += ' AND '+ lvar_eventAppCtlDialog_searchFieldStr[parameters[i]['name']] + ' = '+cf_scaleData(parameters[i]['value']);
			}
			
		} else {
			queryText = ' AND '+ lvar_eventAppCtlDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']);
		}
		$('#dashboardAppCtlEventSearchName').text('쿼리');
		$('#dashboardAppCtlEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ queryText);
	}
	
	lf_dashboardAppCtlEventDialogServiceCall700006();
	
});

function lf_dashboardAppCtlEventDialogServiceCall700006(pageNum){
	if(pageNum == null) pageNum = lvar_dashboardAppCtlEventPageNum;
	lvar_dashboardAppCtlEventPageNum = parseInt(pageNum);
	
	var body = lvar_body;
	
	body['page'] = lvar_dashboardAppCtlEventPageNum;
	body['topn'] = lvar_dashboardAppCtlEventPageCnt;
	
	if(!lvar_paginationAppCtlEventInitFlag){
		body['info'] = true;
	}
	else body['info'] = false;
	
	// 검색조건 예시
	
	var table = $('#dashboardAppCtlEventTable');
	cf_contPreloader('dashboardAppCtlEventTable');
	
	table.find('> tbody > tr:not(:first)').remove();
	
	cf_requestServer(_TR_EVENT_FILECTL_SEARCH,body,lf_dashboardAppCtlEventDialogServiceCall700006Callback);
}

function lf_dashboardAppCtlEventDialogServiceCall700006Callback(data, body){
	cf_contPreloader('dashboardAppCtlEventTable');
	
	var table = $('#dashboardAppCtlEventTable');
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0 ){
		$('#dashboardAppCtlEventTable').parent().hide();
		var cnt = ((lvar_dashboardAppCtlEventPageNum) * lvar_dashboardAppCtlEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
			if(lvar_dashboardAppCtlCompareArr.length > 0){
				if(lvar_dashboardAppCtlCompareArr[0]){
					if(lvar_dashboardAppCtlCompareArr[0] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
				if(lvar_dashboardAppCtlCompareArr[1]){
					if(lvar_dashboardAppCtlCompareArr[1] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
			}
			
			var message = rowData['message'];
			var type;			
			if(message.indexOf('White')>=0) {				
				type = 'White';
			} else {
				type = 'Black';
			}
			
			$rowHTML.find("td:eq(0)").text(order);
			
			var column1Val = rowData['dn'] + ' ('+rowData['equip_ip']+')';
			$rowHTML.find("td:eq(1)").text(column1Val);
			
			var column2Val = type;
			$rowHTML.find("td:eq(2)").append(column2Val);
		
			var column3Val = rowData['path'];
			$rowHTML.find("td:eq(3)").text(column3Val);
			
			var column4Val = rowData['message'];
			$rowHTML.find("td:eq(4)").text(column4Val);
			
			var column6Val = rowData['revisetime'];
			$rowHTML.find("td:eq(5)").text(column6Val);
			
			$rowHTML.show();
			table.find('> tbody tr:last').after($rowHTML);
	
			var detailData = order+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['revisetime']+'¥'
				+rowData['path']+'¥'+rowData['equip_id']+'¥'+rowData['equip_ip']+'¥'
				+rowData['pid']+'¥'+rowData['ppid']+'¥'				
				+rowData['message']+'¥'
				+rowData['collecttime']+'¥'+rowData['revisetime'];
				
			if(i >0){
			$('#detailData').val($('#detailData').val()+'~'+detailData);
			}else $('#detailData').val(detailData); 
		}
		
		if(!lvar_paginationAppCtlEventInitFlag){
			lvar_dashboardAppCtlEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationAppCtlEventInitFlag = true;
		
		$('#dashboardAppCtlEventTable').parent().slideDown(600);
	}
	
	lf_paginationAppCtlInit();
	
}

function lf_dashboardAppCtlEventTabContentActive(rowData){
	
	var $h4 = $('<h4 class="dashboardAppCtlInfo'+rowData['order']+'"><span>('+rowData['order']+')</span> '+rowData['dn']
	+' ('+rowData['equip_ip']+') / '
	+rowData['createtime'].substring(11, rowData['createtime'].length)+'</h4>'
	);
	
	$('#dashboardAppCtlEventDetailTitle').prepend($h4);
	
	if($('#dashboardAppCtlEventDetailTitle > h4').length == 3){
		$('#dashboardAppCtlEventDetailTitle > h4:last').remove();
	}
	
	var detailBox = $('<div class="detail dashboardAppCtlInfo'+rowData['order']+'"><ul class="detail_list"></ul></div>');
	
	var infoData = {};
	getJsonAllData(rowData, infoData);
	
	if((Object.keys(infoData)).length > 0){
		for(var key in infoData){
			detailBox.find('.detail_list').append($('<li><dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+infoData[key]+'">'+infoData[key]+'</dd></dl></li>'));
		}
		
		detailBox.data('order', infoData['order']);
		
		$('#dashboardAppCtlEventDetailContent > div.detail_box').prepend(detailBox);
	}
	
	if($('#dashboardAppCtlEventDetailContent > div.detail_box > div').length == 3){
		$('#dashboardAppCtlEventDetailContent > div.detail_box > div:last').remove();
	}
	
}

function lf_dashboardAppCtlEventCompareObj(flag, order){
	if(!flag){
		if(lvar_dashboardAppCtlCompareArr.length == 2){
			lvar_dashboardAppCtlCompareArr.shift();
		}
		
		lvar_dashboardAppCtlCompareArr.push(order);
	}
	else{
		
		if(lvar_dashboardAppCtlCompareArr[0]){
			if(lvar_dashboardAppCtlCompareArr[0] == order){
				lvar_dashboardAppCtlCompareArr.splice(0, 1);
			}
		}
		if(lvar_dashboardAppCtlCompareArr[1]){
			if(lvar_dashboardAppCtlCompareArr[1] == order){
				lvar_dashboardAppCtlCompareArr.splice(1, 1)
			}
		}
		
	}
}

function lf_dashboardAppCtlEventListCompareCheck(){
	var table = $('#dashboardAppCtlEventTable');
	var listTR = table.find('> tbody > tr:not(:first)');
	
	listTR.each(function(){
		var rowData = $(this).data('rowData');
		var order = rowData['order'];
		
		var ok = false;
		if(lvar_dashboardAppCtlCompareArr.length > 0){
			for(var i = 0; i < lvar_dashboardAppCtlCompareArr.length; i++){
				if(lvar_dashboardAppCtlCompareArr[i] == order){
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

function lf_dashboardAppCtlEventTableRowClk(thiz){
	var rowData = $(thiz).data('rowData');
	
	console.log(rowData);
	
	var num = $(thiz).children(':first').text();
	$('#detailNum').val("");
	$('#detailNum').val("appCtl_"+num);
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');
}

function lf_dashboardAppCtlEventInfoTabRemove(thiz){
	event.stopPropagation();
	
	var li = $(thiz).parent();
	
	var rowDataOrder = (li.data('rowData'))['order'];
	lf_dashboardAppCtlEventInfoRemoveOrder(rowDataOrder);
}

function lf_dashboardAppCtlEventInfoRemoveOrder(order){
	
	if(lvar_dashboardAppCtlCompareArr.indexOf(order) >= 0){
		lvar_dashboardAppCtlCompareArr.splice(lvar_dashboardAppCtlCompareArr.indexOf(order), 1);
	}
	
	$('.dashboardAppCtlInfo'+order).remove();
	lf_dashboardAppCtlEventListCompareCheck();
}


function lf_dashboardAppCtlEventInfoInit(){
	lvar_dashboardAppCtlCompareArr = [];
	lf_dashboardAppCtlEventListCompareCheck();
	
	$('#dashboardAppCtlEventDetailTab').empty();
	$('#dashboardAppCtlEventDetailTitle').empty();
	$('#dashboardAppCtlEventDetailContent > div.detail_box').empty();
	
}

function lf_openEventAppCtlViewWindow(thiz){  
	
	var newWindow = window.open('./dashboardEventAppCtlView.do', '_blank');
	newWindow['eventData'] = lvar_initParam;
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationAppCtlClk(thiz){
	$('#dashboardAppCtlEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text()) - 1;
	lf_dashboardAppCtlEventDialogServiceCall700006(cnt);
}

function lf_paginationAppCtlInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardAppCtlEventTotalCnt / lvar_dashboardAppCtlEventPageCnt);
	
	$('#dashboardAppCtlEventPagination').empty();
	
	if(totPageTot <= 1){
		$('#dashboardAppCtlEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardAppCtlEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if(lvar_dashboardAppCtlEventPageNum == 0){ // 첫페이지
			$('#dashboardAppCtlEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
			$('#dashboardAppCtlEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		} else if(lvar_dashboardAppCtlEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		} else { // 중간
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardAppCtlEventTotalCnt < lvar_paginationAppCtlEventViewCnt){
		$('#dashboardAppCtlEventPagination').append('<li class="active" page="0"><a href="#">1</a></li>');
	}
	else{
		var pageStart = Math.floor(lvar_dashboardAppCtlEventPageNum / lvar_AppCtl_totPageLimit) * lvar_AppCtl_totPageLimit;
		var pageCnt = 0; 
		for(var i = pageStart; i<totPageTot && pageCnt<lvar_AppCtl_totPageLimit; i++){
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlClk(this);" ' 
				+ 'class="'+(i == lvar_dashboardAppCtlEventPageNum ? 'active' : '')
				+'" page="'+i+'">' 
				+ '<a href="#">'+(i+1)+'</a></li>');
			pageCnt++;
		}
	}
	
	if(totPageTot <= 1){
		$('#dashboardAppCtlEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardAppCtlEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardAppCtlEventPageNum == 0){ // 첫페이지
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'last\');" class="last"><a href="#">Last</a></li>');	
		} else if(lvar_dashboardAppCtlEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardAppCtlEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
			$('#dashboardAppCtlEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		} else { // 중간
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardAppCtlEventPagination').append('<li onclick="javascript: lf_paginationAppCtlEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardAppCtlCurrentPage').text(lvar_dashboardAppCtlEventPageNum + 1);
	$('#dashboardAppCtlTotPage').text(totPageTot);
	
}

function lf_paginationAppCtlEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardAppCtlEventTotalCnt / lvar_dashboardAppCtlEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardAppCtlEventPageNum = 0;
	}
	else if(mode == 'previous'){
		lvar_dashboardAppCtlEventPageNum = lvar_dashboardAppCtlEventPageNum - 1;
	}
	else if(mode == 'next'){
		lvar_dashboardAppCtlEventPageNum = lvar_dashboardAppCtlEventPageNum + 1;
	}
	else if(mode == 'last'){
		//lvar_dashboardAppCtlEventPageNum = totPageTot;
		if(totPageTot > 0) lvar_dashboardAppCtlEventPageNum = totPageTot-1;
		else lvar_dashboardAppCtlEventPageNum = totPageTot;
	}
	
	lf_dashboardAppCtlEventDialogServiceCall700006();
}