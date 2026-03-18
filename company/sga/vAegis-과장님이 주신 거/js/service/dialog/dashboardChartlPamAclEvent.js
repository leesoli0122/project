
var lvar_dashboardPamAclEventPageCnt = 18;
var lvar_dashboardPamAclEventPageNum = 0;
var lvar_dashboardPamAclEventTotalCnt = 0;

var lvar_paginationPamAclEventViewCnt = 18;
var lvar_paginationPamAclEventInitFlag = false;
var lvar_dashboardPamAclCompareArr = [];

const lvar_PamAcl_totPageLimit = 10;
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

var lvar_eventPamAclDialog_searchFieldStr = {
	'starttime': '시작일시',
	'endtime': '종료일시',
	'action': '허용',
	'permit': '허용',
	'user': '사용자',
	'service': '서비스',
	'ip': 'IP',
	'message': '이벤트 내용',
	'equiplist': '자산',
	'searchtime': '발생일시'
}


$(function () {
	var paramData = $('#dashboardPamAclEventDialog').data('initParam');
	lvar_initParam = paramData;
	var chartType = paramData['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = paramData['body'];
	var term = paramData['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardPamAclEventSearchName').text('검색시간');
		$('#dashboardPamAclEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardPamAclEventSearchName').text('자산');
		$('#dashboardPamAclEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ ' AND 자산ID = '+lvar_body['equiplist'][0]);
	}
	else{
		var parameters = lvar_body['parameters'];
		var queryText = '';
		if(parameters.constructor == Array) {
			for(var i=0; i<parameters.length; i++) {
				queryText += ' AND '+ lvar_eventPamAclDialog_searchFieldStr[parameters[i]['name']] + ' = '+cf_scaleData(parameters[i]['value']);
			}
			
		} else {
			queryText = ' AND '+ lvar_eventPamAclDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']);
		}
		$('#dashboardPamAclEventSearchName').text('쿼리');
		$('#dashboardPamAclEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ queryText);
	}
	
	lf_dashboardPamAclEventDialogServiceCall700008();
	
});

function lf_dashboardPamAclEventDialogServiceCall700008(pageNum){
	if(pageNum == null) pageNum = lvar_dashboardPamAclEventPageNum;
	lvar_dashboardPamAclEventPageNum = parseInt(pageNum);
	
	var body = lvar_body;
	
	body['page'] = lvar_dashboardPamAclEventPageNum;
	body['topn'] = lvar_dashboardPamAclEventPageCnt;
	
	if(!lvar_paginationPamAclEventInitFlag){
		body['info'] = true;
	}
	else body['info'] = false;
	
	// 검색조건 예시
	
	var table = $('#dashboardPamAclEventTable');
	cf_contPreloader('dashboardPamAclEventTable');
	
	table.find('> tbody > tr:not(:first)').remove();
	
	cf_requestServer(_TR_EVENT_PAMACL_SEARCH,body,lf_dashboardPamAclEventDialogServiceCall700008Callback);
}

function lf_dashboardPamAclEventDialogServiceCall700008Callback(data, body){
	cf_contPreloader('dashboardPamAclEventTable');
	
	var table = $('#dashboardPamAclEventTable');
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0 ){
		$('#dashboardPamAclEventTable').parent().hide();
		var cnt = ((lvar_dashboardPamAclEventPageNum) * lvar_dashboardPamAclEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
			if(lvar_dashboardPamAclCompareArr.length > 0){
				if(lvar_dashboardPamAclCompareArr[0]){
					if(lvar_dashboardPamAclCompareArr[0] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
				if(lvar_dashboardPamAclCompareArr[1]){
					if(lvar_dashboardPamAclCompareArr[1] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
			}
	
			$rowHTML.find("td:eq(0)").text(order);
			
			var column1Val = rowData['dn'] + ' ('+rowData['equip_ip']+')';
			$rowHTML.find("td:eq(1)").text(column1Val);
			
			var column2Val = (rowData['permit']==1? '+':'-');
			$rowHTML.find("td:eq(2)").text(column2Val);
			
			var column3Val = rowData['service'];
			$rowHTML.find("td:eq(3)").text(column3Val);
			
			var column4Val = rowData['message'];
			$rowHTML.find("td:eq(4)").text(column4Val);
			
			var column5Val = rowData['revisetime'];
			$rowHTML.find("td:eq(5)").text(column5Val);
			
			$rowHTML.show();
			table.find('> tbody tr:last').after($rowHTML);
			
			var detailData = order+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['revisetime']+'¥'
				+(rowData['permit']==1? '+':'-')+'¥'+rowData['equip_id']+'¥'+rowData['equip_ip']+'¥'
				+rowData['pid']+'¥'+rowData['ppid']+'¥'+rowData['service']+'¥'
				+rowData['user']+'¥'+rowData['ip']+'¥'+rowData['message']+'¥'
				+rowData['collecttime']+'¥'+rowData['revisetime'];
				
			if(i >0){
			$('#detailData').val($('#detailData').val()+'~'+detailData);
			}else $('#detailData').val(detailData); 
		}
		
		if(!lvar_paginationPamAclEventInitFlag){
			lvar_dashboardPamAclEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationPamAclEventInitFlag = true;
		
		$('#dashboardPamAclEventTable').parent().slideDown(600);
	}
	
	lf_paginationPamAclInit();
	
}

function lf_dashboardPamAclEventTabContentActive(rowData){
	
	var $h4 = $('<h4 class="dashboardPamAclInfo'+rowData['order']+'"><span>('+rowData['order']+')</span> '+rowData['dn']
	+' ('+rowData['equip_ip']+') / '
	+rowData['createtime'].substring(11, rowData['createtime'].length)+'</h4>'
	);
	
	$('#dashboardPamAclEventDetailTitle').prepend($h4);
	
	if($('#dashboardPamAclEventDetailTitle > h4').length == 3){
		$('#dashboardPamAclEventDetailTitle > h4:last').remove();
	}
	
	var detailBox = $('<div class="detail dashboardPamAclInfo'+rowData['order']+'"><ul class="detail_list"></ul></div>');
	
	var infoData = {};
	getJsonAllData(rowData, infoData);
	
	if((Object.keys(infoData)).length > 0){
		for(var key in infoData){
			detailBox.find('.detail_list').append($('<li><dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+infoData[key]+'">'+infoData[key]+'</dd></dl></li>'));
		}
		
		detailBox.data('order', infoData['order']);
		
		$('#dashboardPamAclEventDetailContent > div.detail_box').prepend(detailBox);
	}
	
	if($('#dashboardPamAclEventDetailContent > div.detail_box > div').length == 3){
		$('#dashboardPamAclEventDetailContent > div.detail_box > div:last').remove();
	}
	
}

function lf_dashboardPamAclEventCompareObj(flag, order){
	if(!flag){
		if(lvar_dashboardPamAclCompareArr.length == 2){
			lvar_dashboardPamAclCompareArr.shift();
		}
		
		lvar_dashboardPamAclCompareArr.push(order);
	}
	else{
		
		if(lvar_dashboardPamAclCompareArr[0]){
			if(lvar_dashboardPamAclCompareArr[0] == order){
				lvar_dashboardPamAclCompareArr.splice(0, 1);
			}
		}
		if(lvar_dashboardPamAclCompareArr[1]){
			if(lvar_dashboardPamAclCompareArr[1] == order){
				lvar_dashboardPamAclCompareArr.splice(1, 1)
			}
		}
		
	}
}

function lf_dashboardPamAclEventListCompareCheck(){
	var table = $('#dashboardPamAclEventTable');
	var listTR = table.find('> tbody > tr:not(:first)');
	
	listTR.each(function(){
		var rowData = $(this).data('rowData');
		var order = rowData['order'];
		
		var ok = false;
		if(lvar_dashboardPamAclCompareArr.length > 0){
			for(var i = 0; i < lvar_dashboardPamAclCompareArr.length; i++){
				if(lvar_dashboardPamAclCompareArr[i] == order){
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

function lf_dashboardPamAclEventTableRowClk(thiz){
	var rowData = $(thiz).data('rowData');
	
	console.log(rowData);
	
	var num = $(thiz).children(':first').text();
	$('#detailNum').val("");
	$('#detailNum').val("pamAcl_"+num);
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');
}

function lf_dashboardPamAclEventInfoTabRemove(thiz){
	event.stopPropagation();
	
	var li = $(thiz).parent();
	
	var rowDataOrder = (li.data('rowData'))['order'];
	lf_dashboardPamAclEventInfoRemoveOrder(rowDataOrder);
}

function lf_dashboardPamAclEventInfoRemoveOrder(order){
	
	if(lvar_dashboardPamAclCompareArr.indexOf(order) >= 0){
		lvar_dashboardPamAclCompareArr.splice(lvar_dashboardPamAclCompareArr.indexOf(order), 1);
	}
	
	$('.dashboardPamAclInfo'+order).remove();
	lf_dashboardPamAclEventListCompareCheck();
}


function lf_dashboardPamAclEventInfoInit(){
	lvar_dashboardPamAclCompareArr = [];
	lf_dashboardPamAclEventListCompareCheck();
	
	$('#dashboardPamAclEventDetailTab').empty();
	$('#dashboardPamAclEventDetailTitle').empty();
	$('#dashboardPamAclEventDetailContent > div.detail_box').empty();
	
}

function lf_openEventPamAclViewWindow(thiz){  
	
	var newWindow = window.open('./dashboardEventPamAclView.do', '_blank');
	newWindow['eventData'] = lvar_initParam;
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationPamAclClk(thiz){
	$('#dashboardPamAclEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text()) - 1;
	lf_dashboardPamAclEventDialogServiceCall700008(cnt);
}

function lf_paginationPamAclInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardPamAclEventTotalCnt / lvar_dashboardPamAclEventPageCnt);
	
	$('#dashboardPamAclEventPagination').empty();
	
	if(totPageTot <= 1){
		$('#dashboardPamAclEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardPamAclEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if(lvar_dashboardPamAclEventPageNum == 0){ // 첫페이지
			$('#dashboardPamAclEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
			$('#dashboardPamAclEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		} else if(lvar_dashboardPamAclEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		} else { // 중간
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardPamAclEventTotalCnt < lvar_paginationPamAclEventViewCnt){
		$('#dashboardPamAclEventPagination').append('<li class="active" page="0"><a href="#">1</a></li>');
	}
	else{
		var pageStart = Math.floor(lvar_dashboardPamAclEventPageNum / lvar_PamAcl_totPageLimit) * lvar_PamAcl_totPageLimit;
		var pageCnt = 0; 
		for(var i = pageStart; i<totPageTot && pageCnt<lvar_PamAcl_totPageLimit; i++){
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclClk(this);" ' 
				+ 'class="'+(i == lvar_dashboardPamAclEventPageNum ? 'active' : '')
				+'" page="'+i+'">' 
				+ '<a href="#">'+(i+1)+'</a></li>');
			pageCnt++;
		}
	}
	
	if(totPageTot <= 1){
		$('#dashboardPamAclEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardPamAclEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardPamAclEventPageNum == 0){ // 첫페이지
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'last\');" class="last"><a href="#">Last</a></li>');	
		} else if(lvar_dashboardPamAclEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardPamAclEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
			$('#dashboardPamAclEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		} else { // 중간
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardPamAclEventPagination').append('<li onclick="javascript: lf_paginationPamAclEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardPamAclCurrentPage').text(lvar_dashboardPamAclEventPageNum + 1);
	$('#dashboardPamAclTotPage').text(totPageTot);
	
}

function lf_paginationPamAclEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardPamAclEventTotalCnt / lvar_dashboardPamAclEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardPamAclEventPageNum = 0;
	}
	else if(mode == 'previous'){
		lvar_dashboardPamAclEventPageNum = lvar_dashboardPamAclEventPageNum - 1;
	}
	else if(mode == 'next'){
		lvar_dashboardPamAclEventPageNum = lvar_dashboardPamAclEventPageNum + 1;
	}
	else if(mode == 'last'){
		//lvar_dashboardPamAclEventPageNum = totPageTot;
		if(totPageTot > 0) lvar_dashboardPamAclEventPageNum = totPageTot-1;
		else lvar_dashboardPamAclEventPageNum = totPageTot;
	}
	
	lf_dashboardPamAclEventDialogServiceCall700008();
}