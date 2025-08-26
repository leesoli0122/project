
var lvar_infoData;
var lvar_chartType;

function scaleData(data) {
	if(data && !Number.isInteger(data)) { 
		if(data.indexOf("ET ") == 0) {
			return data.replace("ET ", "")
		} else if(data.indexOf("GPL ") == 0) {
			return data.replace("GPL ", "")
		} else {
			return data;
		}
	}
}

$(function () {
	lvar_infoData = ($('#dashboardInfoDialog').data('initParam'))['rowData'];
	lvar_chartType = ($('#dashboardInfoDialog').data('initParam'))['chartType'];
	
	// 상세보기 차트 제목 	
	if(lvar_chartType.indexOf('firewall') == 0) $('#dashboardInfoTitle').text('방화벽 이벤트 정보');
	else if(lvar_chartType.indexOf('ips') == 0) $('#dashboardInfoTitle').text('침입방지시스템 이벤트 정보');
	else if(lvar_chartType.indexOf('av') == 0) $('#dashboardInfoTitle').text('멀웨어 이벤트 정보');
	else if(lvar_chartType.indexOf('malware') == 0) $('#dashboardInfoTitle').text('멀웨어 이벤트 정보');
	else if(lvar_chartType.indexOf('fileInt') == 0) $('#dashboardInfoTitle').text('파일 무결성 이벤트 정보');
	else if(lvar_chartType.indexOf('fileCtl') == 0) $('#dashboardInfoTitle').text('실행 파일 통제 이벤트 정보');
	else if(lvar_chartType.indexOf('pamAcl') == 0) $('#dashboardInfoTitle').text('서비스 제어 이벤트 정보');
	else if(lvar_chartType.indexOf('csp') == 0) $('#dashboardInfoTitle').text('컨테이너 이미지 스캔 이벤트 정보');
		
	// subtitle. if조건은 csp 추가하면서 새롭게 추가. 기존에 있던 형식은 else문으로 dn(자산명)을 표시함
	if(lvar_infoData['dn'] == 'csp'){
		if(lvar_chartType == 'cspMalwareTopN') $('#dashboardInfoSubTitle').text('멀웨어 탐지 Top 5');
		else if(lvar_chartType == 'cspVulnerabilityTopN') $('#dashboardInfoSubTitle').text('취약성 탐지 Top 5');
		else if(lvar_chartType == 'cspScanStatusTable') $('#dashboardInfoSubTitle').text('컨테이너 이미지 스캔 상태');
		else if(lvar_chartType == 'cspDistributionControlStatusTable') $('#dashboardInfoSubTitle').text('컨테이너 이미지 실행제어 상태');
	}
	else{
		$('#dashboardInfoSubTitle').text(lvar_infoData['dn']);
	}
	
	
	let rowData = {};
	getJsonAllData(lvar_infoData, rowData);
	
	if((Object.keys(rowData)).length > 0){
		var content;
		if(lvar_chartType.indexOf('fileInt') == 0){
			content = $('<div class="tbl"><table id="testTb2" class="left"><colgroup>'+
					'<col width="148px">' +
					'<col width="auto">' +
					'</colgroup>' +
					'<tbody></tbody'+
			'</table></div>');
			
			for(var key in rowData){
				var data = scaleData(rowData[key]);
				content.find('tbody').append($('<tr>'+
					'<th class="tl">'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</th>'+
					'<td class="tl" title="'+data+'">'+data+'</td>'+
				'</tr>'));
			}
			
		}
		// [cAegis] csp일때의 모달 형식 변경(row당 1개의 rowData, dl css 변경)
		else if(lvar_chartType.indexOf('csp') == 0){
			content = $('<ul class="detail_list"></ul>');
			var rowArr = [];
			var rowObj = {};
			console.log("rowData: ",rowData);

			for(var infoKey in rowData){
				rowObj[infoKey] = rowData[infoKey];
				rowArr.push(rowObj);
				rowObj = {};
			}
			
			console.log("rowData: ",rowArr);
			for(var i = 0; i < rowArr.length; i++){
				var row = rowArr[i];
				var infoTr = $('<li></li>');
		
				for(var key in row){
					var data = row[key];
					console.log("data: " , data);
					if(data && key!='no' && key!='dn') { // 테이블 번호와 자산(csp)은 표시하지 않도록 한다.
						/*infoTr.append($('<dl style="width:100%; height:auto;"><p class="dt_style">'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)
						+'</p><p class="dl_style" title="'+data+'">'+data+'</p></dl>'));*/
						
						infoTr.append($('<dl style="width:100%; height:auto;"><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)
						+'</dt><dd class="csp_row" title="'+data+'">'+data+'</dd></dl>'));
						content.append(infoTr);
					}
					
				}
			}
			
			
		}
		else{
			content = $('<ul class="detail_list"></ul>');
			
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
					var data = scaleData(row[key]);
					infoTr.append($('<dl><dt>'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</dt><dd title="'+data+'">'+data+'</dd></dl>'));	
				}
				content.append(infoTr);
			}
		}

		$('#dashboardInfoContent').append(content);
		
	}
	
});

