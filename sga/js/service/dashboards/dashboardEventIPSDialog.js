
var lvar_dashboardIPSEventPageCnt = 50;
var lvar_dashboardIPSEventPageNum = 1;
var lvar_dashboardIPSEventTotalCnt = 0;

var lvar_paginationIPSEventViewCnt = 5;
var lvar_paginationIPSEventInitFlag = false;

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
		$('#dashboardIPSEventSearchName').text('검색시간');
		$('#dashboardIPSEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardIPSEventSearchName').text('자산');
		$('#dashboardIPSEventSearchValue').text(lvar_body['equiplist'][0]);
	}
	else{
		$('#dashboardIPSEventSearchName').text('쿼리');
		$('#dashboardIPSEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime'] 
		+ ' AND '+ lvar_eventIPSDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']));
	}
	
	lf_dashboardIPSEventDialogServiceCall700002();
});

function lf_dashboardIPSEventDialogServiceCall700002(pageNum){
	if(!pageNum) pageNum = lvar_dashboardIPSEventPageNum;
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
	
	cf_requestServer(_TR_EVENT_IPS_SEARCH,body,lf_dashboardIPSEventDialogServiceCall700002Callback);
}

function lf_dashboardIPSEventDialogServiceCall700002Callback(data, body){
	cf_contPreloader('dashboardIPSEventTable');
	
	var table = $('#dashboardIPSEventTable');
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0 ){
		$('#dashboardIPSEventTable').parent().hide();
		var cnt = ((lvar_dashboardIPSEventPageNum-1) * lvar_dashboardIPSEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			var event = new SolipsEvent(rowData);
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
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
		}
		
		if(!lvar_paginationIPSEventInitFlag){
			lvar_dashboardIPSEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationIPSEventInitFlag = true;
		
		$('#dashboardIPSEventTable').parent().slideDown(600);
	}
	
	lf_paginationIPSInit();
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationIPSClk(thiz){
	$('#dashboardIPSEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text());
	lf_dashboardIPSEventDialogServiceCall700002(cnt);
}

function lf_paginationIPSInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardIPSEventTotalCnt / lvar_dashboardIPSEventPageCnt);
	
	$('#dashboardIPSEventPagination').empty();
	
	if(lvar_dashboardIPSEventPageNum == 1){
		$('#dashboardIPSEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardIPSEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if( lvar_dashboardIPSEventPageNum - lvar_paginationIPSEventViewCnt < 1){
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardIPSEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		}
		else{
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardIPSEventTotalCnt < lvar_paginationIPSEventViewCnt){
		$('#dashboardIPSEventPagination').append('<li class="active" page="1"><a href="#">1</a></li>');
	}
	else{
		var pageFirst = Math.ceil(lvar_dashboardIPSEventPageNum / lvar_dashboardIPSEventPageCnt);
		
		for(var i = 0; i < lvar_paginationIPSEventViewCnt; i++ ){
			var paginationNum = ((pageFirst-1)*lvar_paginationIPSEventViewCnt)+i+1;
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSClk(this);" class="'+(lvar_dashboardIPSEventPageNum == paginationNum ? 'active' : '')+'" page="'+paginationNum+'"><a href="#">'+paginationNum+'</a></li>');
			
			if(paginationNum == totPageTot) break;
		}
	}
	
	if(lvar_dashboardIPSEventPageNum == totPageTot){
		$('#dashboardIPSEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardIPSEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardIPSEventPageNum + lvar_paginationIPSEventViewCnt >= totPageTot){
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardIPSEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		}
		else{
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardIPSEventPagination').append('<li onclick="javascript: lf_paginationIPSEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardIPSCurrentPage').text(lvar_dashboardIPSEventPageNum);
	$('#dashboardIPSTotPage').text(totPageTot);
	
}

function lf_paginationIPSEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardIPSEventTotalCnt / lvar_dashboardIPSEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardIPSEventPageNum = 1;
	}
	else if(mode == 'previous'){
		lvar_dashboardIPSEventPageNum = lvar_dashboardIPSEventPageNum - lvar_paginationIPSEventViewCnt;
	}
	else if(mode == 'next'){
		lvar_dashboardIPSEventPageNum = lvar_dashboardIPSEventPageNum + lvar_paginationIPSEventViewCnt;
	}
	else if(mode == 'last'){		
		if(totPageTot > 0) lvar_dashboardIPSEventPageNum = totPageTot-1;
		else lvar_dashboardIPSEventPageNum = totPageTot;
	}
	
	lf_dashboardIPSEventDialogServiceCall700002();
}

function lf_dashboardIPSTableClk(thiz){
	
	var newWindow = window.open('./dashboardEventInfoView.do', '','width=620,height=500,location=no,status=no,scrollbars=yes');
	
	var param = {
		'data': $(thiz).data('rowData'),
		'chartType': lvar_param['chartType'] 
	}
	newWindow['eventData'] = param;
}
