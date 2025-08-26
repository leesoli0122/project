
var lvar_dashboardFileIntEventPageCnt = 50;
var lvar_dashboardFileIntEventPageNum = 1;
var lvar_dashboardFileIntEventTotalCnt = 0;

var lvar_paginationFileIntEventViewCnt = 5;
var lvar_paginationFileIntEventInitFlag = false;

var lvar_eventFileIntTypeObj = {
		1:	'create',
		2:	'Permission Update',
		4:	'User Update',
		8:	'Group Update',
		16:	'Size Update',
		32:	'Hash Update',
		64:	'Delete',
}

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

var lvar_eventFileIntDialog_searchFieldStr = {
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
		$('#dashboardFileIntEventSearchName').text('검색시간');
		$('#dashboardFileIntEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
	}
	else if(chartConf['info'].param == 'equiplist'){
		$('#dashboardFileIntEventSearchName').text('자산');
		$('#dashboardFileIntEventSearchValue').text(lvar_body['equiplist'][0]);
	}
	else{
		$('#dashboardFileIntEventSearchName').text('쿼리');
		$('#dashboardFileIntEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime'] 
		+ ' AND '+ lvar_eventFileIntDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']));
	}
	
	lf_dashboardFileIntEventDialogServiceCall700004();
});

function lf_dashboardFileIntEventDialogServiceCall700004(pageNum){
	if(!pageNum) pageNum = lvar_dashboardFileIntEventPageNum;
	lvar_dashboardFileIntEventPageNum = parseInt(pageNum);
	
	var body = lvar_body;
	
	body['page'] = lvar_dashboardFileIntEventPageNum;
	body['topn'] = lvar_dashboardFileIntEventPageCnt;
	
	if(!lvar_paginationFileIntEventInitFlag){
		body['info'] = true;
	}
	else body['info'] = false;
	
	// 검색조건 예시
	
	var table = $('#dashboardFileIntEventTable');
	cf_contPreloader('dashboardFileIntEventTable');
	
	table.find('> tbody > tr:not(:first)').remove();
	
	cf_requestServer(_TR_EVENT_FILEINT_SEARCH,body,lf_dashboardFileIntEventDialogServiceCall700004Callback);
}

function lf_dashboardFileIntEventDialogServiceCall700004Callback(data, body){
	cf_contPreloader('dashboardFileIntEventTable');
	
	var table = $('#dashboardFileIntEventTable');
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0 ){
		$('#dashboardFileIntEventTable').parent().hide();
		var cnt = ((lvar_dashboardFileIntEventPageNum-1) * lvar_dashboardFileIntEventPageCnt + 1);
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
			
			var column2Val = rowData['type'];
			$rowHTML.find("td:eq(2)").text(lvar_eventFileIntTypeObj[column2Val]);
			
			var column3Val = rowData['path'];
			$rowHTML.find("td:eq(3)").text(column3Val);
			
			if(column2Val == 1 || column2Val == 64 || column2Val == 16){
				var sizeOldP = $('<p><span>변경 전 파일크기: </span><span>'+rowData['size_old']+'</span></p>');
				var sizeNewP = $('<p><span>변경 후 파일크기: </span><span>'+rowData['size_new']+'</span></p>');
				$rowHTML.find("td:eq(4)").append(sizeOldP);
				$rowHTML.find("td:eq(4)").append(sizeNewP);
			}
			else if(column2Val == 2){
				var permOldP = $('<p><span>변경 전 Perm: </span><span>'+rowData['perm_old']+'</span></p>');
				var permNewP = $('<p><span>변경 후 Perm: </span><span>'+rowData['perm_new']+'</span></p>');
				$rowHTML.find("td:eq(4)").append(permOldP);
				$rowHTML.find("td:eq(4)").append(permNewP);
			}
			else if(column2Val == 32){
				var hashOldP = $('<p><span>변경 전 해시: </span><span>'+rowData['hash_old']+'</span></p>');
				var hashNewP = $('<p><span>변경 후 해시: </span><span>'+rowData['hash_new']+'</span></p>');
				$rowHTML.find("td:eq(4)").append(hashOldP);
				$rowHTML.find("td:eq(4)").append(hashNewP);
			}
			else if(column2Val == 4){
				var uidOldP = $('<p><span>변경 전 UID: </span><span>'+rowData['uid_old']+'</span></p>');
				var uidNewP = $('<p><span>변경 후 UID: </span><span>'+rowData['uid_new']+'</span></p>');
				$rowHTML.find("td:eq(4)").append(uidOldP);
				$rowHTML.find("td:eq(4)").append(uidNewP);
			}
			else if(column2Val == 8){
				var gidOldP = $('<p><span>변경 전 GID: </span><span>'+rowData['gid_old']+'</span></p>');
				var gidNewP = $('<p><span>변경 후 GID: </span><span>'+rowData['gid_new']+'</span></p>');
				$rowHTML.find("td:eq(4)").append(gidOldP);
				$rowHTML.find("td:eq(4)").append(gidNewP);
			}
			
			var column6Val = rowData['revisetime'];
			$rowHTML.find("td:eq(5)").text(column6Val);
			
			$rowHTML.show();
			table.find('> tbody tr:last').after($rowHTML);
		}
		
		if(!lvar_paginationFileIntEventInitFlag){
			lvar_dashboardFileIntEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationFileIntEventInitFlag = true;
		
		$('#dashboardFileIntEventTable').parent().slideDown(600);
	}
	
	lf_paginationFileIntInit();
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationFileIntClk(thiz){
	$('#dashboardFileIntEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text());
	lf_dashboardFileIntEventDialogServiceCall700004(cnt);
}

function lf_paginationFileIntInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardFileIntEventTotalCnt / lvar_dashboardFileIntEventPageCnt);
	
	$('#dashboardFileIntEventPagination').empty();
	
	if(lvar_dashboardFileIntEventPageNum == 1){
		$('#dashboardFileIntEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardFileIntEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if( lvar_dashboardFileIntEventPageNum - lvar_paginationFileIntEventViewCnt < 1){
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFileIntEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		}
		else{
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardFileIntEventTotalCnt < lvar_paginationFileIntEventViewCnt){
		$('#dashboardFileIntEventPagination').append('<li class="active" page="1"><a href="#">1</a></li>');
	}
	else{
		var pageFirst = Math.ceil(lvar_dashboardFileIntEventPageNum / lvar_dashboardFileIntEventPageCnt);
		
		for(var i = 0; i < lvar_paginationFileIntEventViewCnt; i++ ){
			var paginationNum = ((pageFirst-1)*lvar_paginationFileIntEventViewCnt)+i+1;
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntClk(this);" class="'+(lvar_dashboardFileIntEventPageNum == paginationNum ? 'active' : '')+'" page="'+paginationNum+'"><a href="#">'+paginationNum+'</a></li>');
			
			if(paginationNum == totPageTot) break;
		}
	}
	
	if(lvar_dashboardFileIntEventPageNum == totPageTot){
		$('#dashboardFileIntEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardFileIntEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardFileIntEventPageNum + lvar_paginationFileIntEventViewCnt >= totPageTot){
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFileIntEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		}
		else{
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardFileIntCurrentPage').text(lvar_dashboardFileIntEventPageNum);
	$('#dashboardFileIntTotPage').text(totPageTot);
	
}

function lf_paginationFileIntEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardFileIntEventTotalCnt / lvar_dashboardFileIntEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardFileIntEventPageNum = 1;
	}
	else if(mode == 'previous'){
		lvar_dashboardFileIntEventPageNum = lvar_dashboardFileIntEventPageNum - lvar_paginationFileIntEventViewCnt;
	}
	else if(mode == 'next'){
		lvar_dashboardFileIntEventPageNum = lvar_dashboardFileIntEventPageNum + lvar_paginationFileIntEventViewCnt;
	}
	else if(mode == 'last'){
		lvar_dashboardFileIntEventPageNum = totPageTot;
	}
	
	lf_dashboardFileIntEventDialogServiceCall700004();
}

function lf_dashboardFileIntTableClk(thiz){
	
	var newWindow = window.open('./dashboardEventInfoView.do', '','width=620,height=500,location=no,status=no,scrollbars=yes');
	
	var param = {
		'data': $(thiz).data('rowData'),
		'chartType': lvar_param['chartType'] 
	}
	newWindow['eventData'] = param;
}
