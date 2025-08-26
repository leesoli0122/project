
var lvar_dashboardFileIntEventPageCnt = 9;
var lvar_dashboardFileIntEventPageNum = 0;
var lvar_dashboardFileIntEventTotalCnt = 0;

var lvar_paginationFileIntEventViewCnt = 9;
var lvar_paginationFileIntEventInitFlag = false;
var lvar_dashboardFileIntCompareArr = [];

const lvar_FileInt_totPageLimit = 10;
var lvar_body = {};
var lvar_initParam = {};

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


$(function () {
	var paramData = $('#dashboardFileIntEventDialog').data('initParam');
	lvar_initParam = paramData;
	var chartType = paramData['chartType'];
	var chartConf = lf_getChartELConf(chartType);

	lvar_body = paramData['body'];
	var term = paramData['term'];
	
	if(chartConf['info'].param == 'date'){
		$('#dashboardFileIntEventSearchName').text('검색시간');
		$('#dashboardFileIntEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']);
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
				queryText += ' AND '+ lvar_eventFileIntDialog_searchFieldStr[parameters[i]['name']] + ' = '+parameters[i]['value']
			}
			
		} else {
			queryText = ' AND '+ lvar_eventFileIntDialog_searchFieldStr[lvar_body['parameters']['name']] + ' = '+cf_scaleData(lvar_body['parameters']['value']);
		}
		$('#dashboardFileIntEventSearchName').text('쿼리');
		$('#dashboardFileIntEventSearchValue').text(lvar_body['starttime'] + ' ~ ' + lvar_body['endtime']
		+ queryText);
	}
	
	lf_dashboardFileIntEventDialogServiceCall700004();
	
});

function lf_dashboardFileIntEventDialogServiceCall700004(pageNum){
	if(pageNum == null) pageNum = lvar_dashboardFileIntEventPageNum;
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
		var cnt = ((lvar_dashboardFileIntEventPageNum) * lvar_dashboardFileIntEventPageCnt + 1);
		for(var i = 0; i < dataList.length; i++){
			var $rowHTML = table.find('> tbody > tr:eq(0)').clone();
			var rowData = dataList[i];
			var order = cnt+i;
			
			$rowHTML.data('flag', false);
			rowData['order'] = order; 
			$rowHTML.data('rowData', rowData);
			
			if(lvar_dashboardFileIntCompareArr.length > 0){
				if(lvar_dashboardFileIntCompareArr[0]){
					if(lvar_dashboardFileIntCompareArr[0] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
				if(lvar_dashboardFileIntCompareArr[1]){
					if(lvar_dashboardFileIntCompareArr[1] == order){
						$rowHTML.css('background-color','#f8f9fa');
						$rowHTML.data('flag', true);
					}
				}
			}
			
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
			
			var detailData = order+'¥'+rowData['dn'] + ' ('+rowData['equip_ip']+") / "+rowData['revisetime']+'¥'
				+lvar_eventFileIntTypeObj[(rowData['type'])]+'¥'+rowData['path']+'¥'+rowData['perm_old']+'¥'
				+rowData['perm_new']+'¥'+rowData['gid_old']+'¥'+rowData['gid_new']+'¥'
				+rowData['createtime']+'¥'+rowData['size_old']+'¥'+rowData['size_new']+'¥'
				+rowData['uid_old']+'¥'+rowData['uid_new']+'¥'+rowData['message']+'¥'
				+rowData['hash_old']+'¥'+rowData['hash_new']+'¥'+rowData['collecttime']+'¥'
				+rowData['revisetime'];
				
			if(i >0){
			$('#detailData').val($('#detailData').val()+'~'+detailData);
			}else $('#detailData').val(detailData); 
		}
		
		if(!lvar_paginationFileIntEventInitFlag){
			lvar_dashboardFileIntEventTotalCnt = data.body.info.totalcnt;
		}
		lvar_paginationFileIntEventInitFlag = true;
		
		$('#dashboardFileIntEventTable').parent().slideDown(600);
	}
	
	lf_paginationFileIntInit();
	
}

function lf_dashboardFileIntEventTabContentActive(rowData){
	
	var $h4 = $('<h4 class="dashboardFileIntInfo'+rowData['order']+'"><span>('+rowData['order']+')</span> '+rowData['dn']
	+' ('+rowData['equip_ip']+') / '
	+rowData['createtime'].substring(11, rowData['createtime'].length)+'</h4>'
	);
	
	$('#dashboardFileIntEventDetailTitle').prepend($h4);
	
	if($('#dashboardFileIntEventDetailTitle > h4').length == 3){
		$('#dashboardFileIntEventDetailTitle > h4:last').remove();
	}
	
	var detailBox = $('<div class="detail dashboardFileIntInfo'+rowData['order']+'"><ul class="detail_list"></ul></div>');
	
	var infoData = {};
	getJsonAllData(rowData, infoData);
	
	if((Object.keys(infoData)).length > 0){
		for(var key in infoData){
			detailBox.find('.detail_list').append($('<li><dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+infoData[key]+'">'+infoData[key]+'</dd></dl></li>'));
		}
		
		detailBox.data('order', infoData['order']);
		
		$('#dashboardFileIntEventDetailContent > div.detail_box').prepend(detailBox);
	}
	
	if($('#dashboardFileIntEventDetailContent > div.detail_box > div').length == 3){
		$('#dashboardFileIntEventDetailContent > div.detail_box > div:last').remove();
	}
	
}

function lf_dashboardFileIntEventCompareObj(flag, order){
	if(!flag){
		if(lvar_dashboardFileIntCompareArr.length == 2){
			lvar_dashboardFileIntCompareArr.shift();
		}
		
		lvar_dashboardFileIntCompareArr.push(order);
	}
	else{
		
		if(lvar_dashboardFileIntCompareArr[0]){
			if(lvar_dashboardFileIntCompareArr[0] == order){
				lvar_dashboardFileIntCompareArr.splice(0, 1);
			}
		}
		if(lvar_dashboardFileIntCompareArr[1]){
			if(lvar_dashboardFileIntCompareArr[1] == order){
				lvar_dashboardFileIntCompareArr.splice(1, 1)
			}
		}
		
	}
}

function lf_dashboardFileIntEventListCompareCheck(){
	var table = $('#dashboardFileIntEventTable');
	var listTR = table.find('> tbody > tr:not(:first)');
	
	listTR.each(function(){
		var rowData = $(this).data('rowData');
		var order = rowData['order'];
		
		var ok = false;
		if(lvar_dashboardFileIntCompareArr.length > 0){
			for(var i = 0; i < lvar_dashboardFileIntCompareArr.length; i++){
				if(lvar_dashboardFileIntCompareArr[i] == order){
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

function lf_dashboardFileIntEventTableRowClk(thiz){
	var rowData = $(thiz).data('rowData');
	
	console.log(rowData);
	
	var num = $(thiz).children(':first').text();
	$('#detailNum').val("");
	$('#detailNum').val("fileInt_"+num);
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');
}

function lf_dashboardFileIntEventInfoTabRemove(thiz){
	event.stopPropagation();
	
	var li = $(thiz).parent();
	
	var rowDataOrder = (li.data('rowData'))['order'];
	lf_dashboardFileIntEventInfoRemoveOrder(rowDataOrder);
}

function lf_dashboardFileIntEventInfoRemoveOrder(order){
	
	if(lvar_dashboardFileIntCompareArr.indexOf(order) >= 0){
		lvar_dashboardFileIntCompareArr.splice(lvar_dashboardFileIntCompareArr.indexOf(order), 1);
	}
	
	$('.dashboardFileIntInfo'+order).remove();
	lf_dashboardFileIntEventListCompareCheck();
}


function lf_dashboardFileIntEventInfoInit(){
	lvar_dashboardFileIntCompareArr = [];
	lf_dashboardFileIntEventListCompareCheck();
	
	$('#dashboardFileIntEventDetailTab').empty();
	$('#dashboardFileIntEventDetailTitle').empty();
	$('#dashboardFileIntEventDetailContent > div.detail_box').empty();
	
}

function lf_openEventFileIntViewWindow(thiz){  
	
	var newWindow = window.open('./dashboardEventFileIntView.do', '_blank');
	newWindow['eventData'] = lvar_initParam;
	
}

/*********************************************************************************************************
 * 
 * pagination Script
 * 
 *********************************************************************************************************/
function lf_paginationFileIntClk(thiz){
	$('#dashboardFileIntEventPagination > li').removeClass('active');
	$(thiz).addClass('active');
	var cnt = parseInt($(thiz).text()) - 1;
	lf_dashboardFileIntEventDialogServiceCall700004(cnt);
}

function lf_paginationFileIntInit(){
	
	var totPageTot = Math.ceil(lvar_dashboardFileIntEventTotalCnt / lvar_dashboardFileIntEventPageCnt);
	
	$('#dashboardFileIntEventPagination').empty();
	
	if(totPageTot <= 1){
		$('#dashboardFileIntEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
		$('#dashboardFileIntEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
	}
	else{
		if(lvar_dashboardFileIntEventPageNum == 0){ // 첫페이지
			$('#dashboardFileIntEventPagination').append('<li class="first disabled"><a href="#">First</a></li>');
			$('#dashboardFileIntEventPagination').append('<li class="previous disabled"><a href="#">Prev</a></li>');
		} else if(lvar_dashboardFileIntEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		} else { // 중간
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'first\');" class="first"><a href="#">First</a></li>');
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'previous\');" class="previous"><a href="#">Prev</a></li>');
		}
	}
	
	
	// 한페이지도 안될때
	if(lvar_dashboardFileIntEventTotalCnt < lvar_paginationFileIntEventViewCnt){
		$('#dashboardFileIntEventPagination').append('<li class="active" page="0"><a href="#">1</a></li>');
	}
	else{
		var pageStart = Math.floor(lvar_dashboardFileIntEventPageNum / lvar_FileInt_totPageLimit) * lvar_FileInt_totPageLimit;
		var pageCnt = 0; 
		for(var i = pageStart; i<totPageTot && pageCnt<lvar_FileInt_totPageLimit; i++){
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntClk(this);" ' 
				+ 'class="'+(i == lvar_dashboardFileIntEventPageNum ? 'active' : '')
				+'" page="'+i+'">' 
				+ '<a href="#">'+(i+1)+'</a></li>');
			pageCnt++;
		}
	}
	
	if(totPageTot <= 1){
		$('#dashboardFileIntEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
		$('#dashboardFileIntEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
	}
	else{
		if(lvar_dashboardFileIntEventPageNum == 0){ // 첫페이지
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'last\');" class="last"><a href="#">Last</a></li>');	
		} else if(lvar_dashboardFileIntEventPageNum + 1 == totPageTot){ // 마지막 페이지
			$('#dashboardFileIntEventPagination').append('<li class="next disabled"><a href="#">Next</a></li>');
			$('#dashboardFileIntEventPagination').append('<li class="last disabled"><a href="#">Last</a></li>');
		} else { // 중간
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'next\');" class="next"><a href="#">Next</a></li>');
			$('#dashboardFileIntEventPagination').append('<li onclick="javascript: lf_paginationFileIntEvent(\'last\');" class="last"><a href="#">Last</a></li>');
		}
	}
	
	$('#dashboardFileIntCurrentPage').text(lvar_dashboardFileIntEventPageNum + 1);
	$('#dashboardFileIntTotPage').text(totPageTot);
	
}

function lf_paginationFileIntEvent(mode){
	
	var totPageTot = Math.ceil(lvar_dashboardFileIntEventTotalCnt / lvar_dashboardFileIntEventPageCnt);
	
	if(mode == 'first'){
		lvar_dashboardFileIntEventPageNum = 0;
	}
	else if(mode == 'previous'){
		lvar_dashboardFileIntEventPageNum = lvar_dashboardFileIntEventPageNum - 1;
	}
	else if(mode == 'next'){
		lvar_dashboardFileIntEventPageNum = lvar_dashboardFileIntEventPageNum + 1;
	}
	else if(mode == 'last'){
		//lvar_dashboardFileIntEventPageNum = totPageTot;
		if(totPageTot > 0) lvar_dashboardFileIntEventPageNum = totPageTot-1;
		else lvar_dashboardFileIntEventPageNum = totPageTot;
	}
	
	lf_dashboardFileIntEventDialogServiceCall700004();
}