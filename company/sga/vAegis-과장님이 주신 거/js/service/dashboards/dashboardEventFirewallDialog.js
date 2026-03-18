
var lvar_dashboardFirewallEventPageCnt = 50;
var lvar_dashboardFirewallEventPageNum = 1;
var lvar_dashboardFirewallEventTotalCnt = 0;

var lvar_paginationFirewallEventViewCnt = 5;
var lvar_paginationFirewallEventInitFlag = false;

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

var lvar_param = null;
var lvar_body = null;

$(function () {
	
	lvar_param = window['eventData'];
	
	var chartType = lvar_param['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = lvar_param['body'];
	var term = lvar_param['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardFirewallEventSearchName').text('검색시간');
		$('#dashboardFirewallEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardFirewallEventSearchName').text('자산');
		$('#dashboardFirewallEventSearchValue').text(lvar_body['equiplist'][0]);
	}
	else{
		$('#dashboardFirewallEventSearchName').text('쿼리');
		$('#dashboardFirewallEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime'] 
		+ ' AND '+ lvar_eventFirewallDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']));
	}
	
	lf_dashboardFirewallEventDialogServiceCall700001();
});

function lf_dashboardFirewallEventDialogServiceCall700001(pageNum){
	if(!pageNum) pageNum = lvar_dashboardFirewallEventPageNum;
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
		var cnt = ((lvar_dashboardFirewallEventPageNum-1) * lvar_dashboardFirewallEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
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
			
			var column6Val = rowData['revisetime'];
			$rowHTML.find("td:eq(6)").text(column6Val);
			
			$rowHTML.show();
			table.find('> tbody tr:last').after($rowHTML);
		}
		
		if(!lvar_paginationFirewallEventInitFlag){
			lvar_dashboardFirewallEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationFirewallEventInitFlag = true;
		
		$('#dashboardFirewallEventTable').parent().slideDown(600);
	}
	
	lf_paginationFirewallInit();
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationClk(thiz){
	$('#dashboardFirewallEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text());
	lf_dashboardFirewallEventDialogServiceCall700001(cnt);
}

function lf_paginationFirewallInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardFirewallEventTotalCnt / lvar_dashboardFirewallEventPageCnt);
	
	$('#dashboardFirewallEventPagination').empty();
	
	if(lvar_dashboardFirewallEventPageNum == 1){
		$('#dashboardFirewallEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardFirewallEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if( lvar_dashboardFirewallEventPageNum - lvar_paginationFirewallEventViewCnt < 1){
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFirewallEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		}
		else{
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardFirewallEventTotalCnt < lvar_paginationFirewallEventViewCnt){
		$('#dashboardFirewallEventPagination').append('<li class="active" page="1"><a href="#">1</a></li>');
	}
	else{
		var pageFirst = Math.ceil(lvar_dashboardFirewallEventPageNum / lvar_dashboardFirewallEventPageCnt);
		
		for(var i = 0; i < lvar_paginationFirewallEventViewCnt; i++ ){
			var paginationNum = ((pageFirst-1)*lvar_paginationFirewallEventViewCnt)+i+1;
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationClk(this);" class="'+(lvar_dashboardFirewallEventPageNum == paginationNum ? 'active' : '')+'" page="'+paginationNum+'"><a href="#">'+paginationNum+'</a></li>');
			
			if(paginationNum == totPageTot) break;
		}
	}
	
	if(lvar_dashboardFirewallEventPageNum == totPageTot){
		$('#dashboardFirewallEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardFirewallEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardFirewallEventPageNum + lvar_paginationFirewallEventViewCnt >= totPageTot){
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFirewallEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		}
		else{
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFirewallEventPagination').append('<li onclick="javascript: lf_paginationFirewallEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardFirewallCurrentPage').text(lvar_dashboardFirewallEventPageNum);
	$('#dashboardFirewallTotPage').text(totPageTot);
	
}

function lf_paginationFirewallEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardFirewallEventTotalCnt / lvar_dashboardFirewallEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardFirewallEventPageNum = 1;
	}
	else if(mode == 'previous'){
		lvar_dashboardFirewallEventPageNum = lvar_dashboardFirewallEventPageNum - lvar_paginationFirewallEventViewCnt;
	}
	else if(mode == 'next'){
		lvar_dashboardFirewallEventPageNum = lvar_dashboardFirewallEventPageNum + lvar_paginationFirewallEventViewCnt;
	}
	else if(mode == 'last'){
		lvar_dashboardFirewallEventPageNum = totPageTot;
	}
	
	lf_dashboardFirewallEventDialogServiceCall700001();
}



function lf_dashboardFirewallTableClk(thiz){
	
	var newWindow = window.open('./dashboardEventInfoView.do', '','width=620,height=500,location=no,status=no,scrollbars=yes');
	
	var param = {
		'data': $(thiz).data('rowData'),
		'chartType': lvar_param['chartType'] 
	}
	newWindow['eventData'] = param;
}



