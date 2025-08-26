
var lvar_infoData;
var lvar_chartType;

$(function () {
	lvar_infoData = ($('#dashboardInfoDialog').data('initParam'))['rowData'];
	lvar_chartType = ($('#dashboardInfoDialog').data('initParam'))['chartType'];
	
	if(lvar_chartType.indexOf('firewall') == 0) $('#dashboardInfoTitle').text('방화벽 이벤트 정보');
	else if(lvar_chartType.indexOf('ips') == 0) $('#dashboardInfoTitle').text('침입방지시스템 이벤트 정보');
	else if(lvar_chartType.indexOf('av') == 0) $('#dashboardInfoTitle').text('멀웨어 이벤트 정보');
	else if(lvar_chartType.indexOf('fileInt') == 0) $('#dashboardInfoTitle').text('파일무결성 이벤트 정보');
	
	$('#dashboardInfoSubTitle').text(lvar_infoData['dn']);
	
	let rowData = {};
	getJsonAllData(lvar_infoData, rowData);
	
	if((Object.keys(rowData)).length > 0){
		var content = $('#dashboardInfoContent');
		
		var viewCnt = 3;
		var rowDataLength = (Object.keys(rowData)).length;
		
		var cnt = 0;
		var fiancnt = 1;
		var rowArr = [];
		var rowObj = {};
		for(var infoKey in rowData){
			
			if(viewCnt == cnt){
				cnt = 0;
				rowArr.push(rowObj);
				rowObj = {};
			}
			
			rowObj[infoKey] = rowData[infoKey];
			
			if(fiancnt == rowDataLength) rowArr.push(rowObj);
			
			fiancnt++;
			cnt++;
		}
		
		for(var i = 0; i < rowArr.length; i++){
			var row = rowArr[i];
			var infoTr = $('<li></li>');
			for(var key in row){
				
				infoTr.append($('<dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+row[key]+'">'+row[key]+'</dd></dl>'));
			}
			content.append(infoTr);
		}
	}
	
});

