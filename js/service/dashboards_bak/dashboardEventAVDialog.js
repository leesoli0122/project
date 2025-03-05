
var lvar_dashboardAVEventPageCnt = 50;
var lvar_dashboardAVEventPageNum = 1;
var lvar_dashboardAVEventTotalCnt = 0;

var lvar_paginationAVEventViewCnt = 5;
var lvar_paginationAVEventInitFlag = false;

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

var lvar_param = null;
var lvar_body = null;

$(function () {
	
	lvar_param = window['eventData'];
	
	var chartType = lvar_param['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = lvar_param['body'];
	var term = lvar_param['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardAVEventSearchName').text('검색시간');
		$('#dashboardAVEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardAVEventSearchName').text('자산');
		$('#dashboardAVEventSearchValue').text(lvar_body['equiplist'][0]);
	}
	else{
		$('#dashboardAVEventSearchName').text('쿼리');
		$('#dashboardAVEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime'] 
		+ ' AND '+ lvar_eventAVDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']));
	}
	
	lf_dashboardAVEventDialogServiceCall700003();
});

function lf_dashboardAVEventDialogServiceCall700003(pageNum){
	if(!pageNum) pageNum = lvar_dashboardAVEventPageNum;
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
		var cnt = ((lvar_dashboardAVEventPageNum-1) * lvar_dashboardAVEventPageCnt + 1);
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
		
		if(!lvar_paginationAVEventInitFlag){
			lvar_dashboardAVEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationAVEventInitFlag = true;
		
		$('#dashboardAVEventTable').parent().slideDown(600);
	}
	
	lf_paginationAVInit();
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationAVClk(thiz){
	$('#dashboardAVEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text());
	lf_dashboardAVEventDialogServiceCall700003(cnt);
}

function lf_paginationAVInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardAVEventTotalCnt / lvar_dashboardAVEventPageCnt);
	
	$('#dashboardAVEventPagination').empty();
	
	if(lvar_dashboardAVEventPageNum == 1){
		$('#dashboardAVEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardAVEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if( lvar_dashboardAVEventPageNum - lvar_paginationAVEventViewCnt < 1){
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardAVEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		}
		else{
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardAVEventTotalCnt < lvar_paginationAVEventViewCnt){
		$('#dashboardAVEventPagination').append('<li class="active" page="1"><a href="#">1</a></li>');
	}
	else{
		var pageFirst = Math.ceil(lvar_dashboardAVEventPageNum / lvar_dashboardAVEventPageCnt);
		
		for(var i = 0; i < lvar_paginationAVEventViewCnt; i++ ){
			var paginationNum = ((pageFirst-1)*lvar_paginationAVEventViewCnt)+i+1;
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVClk(this);" class="'+(lvar_dashboardAVEventPageNum == paginationNum ? 'active' : '')+'" page="'+paginationNum+'"><a href="#">'+paginationNum+'</a></li>');
			
			if(paginationNum == totPageTot) break;
		}
	}
	
	if(lvar_dashboardAVEventPageNum == totPageTot){
		$('#dashboardAVEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardAVEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardAVEventPageNum + lvar_paginationAVEventViewCnt >= totPageTot){
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardAVEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		}
		else{
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardAVEventPagination').append('<li onclick="javascript: lf_paginationAVEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardAVCurrentPage').text(lvar_dashboardAVEventPageNum);
	$('#dashboardAVTotPage').text(totPageTot);
	
}

function lf_paginationAVEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardAVEventTotalCnt / lvar_dashboardAVEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardAVEventPageNum = 1;
	}
	else if(mode == 'previous'){
		lvar_dashboardAVEventPageNum = lvar_dashboardAVEventPageNum - lvar_paginationAVEventViewCnt;
	}
	else if(mode == 'next'){
		lvar_dashboardAVEventPageNum = lvar_dashboardAVEventPageNum + lvar_paginationAVEventViewCnt;
	}
	else if(mode == 'last'){
		lvar_dashboardAVEventPageNum = totPageTot;
	}
	
	lf_dashboardAVEventDialogServiceCall700003();
}

function lf_dashboardAVTableClk(thiz){
	
	var newWindow = window.open('./dashboardEventInfoView.do', '','width=620,height=500,location=no,status=no,scrollbars=yes');
	
	debugger;
	var param = {
		'data': $(thiz).data('rowData'),
		'chartType': lvar_param['chartType'] 
	}
	newWindow['eventData'] = param;
}
