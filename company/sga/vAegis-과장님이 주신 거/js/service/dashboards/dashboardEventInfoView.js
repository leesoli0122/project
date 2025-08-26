

var lvar_infoData = {};

$(function () {
	
	var paramData = window['eventData'];
	
	lvar_infoData = paramData['data'];
	var chartType = paramData['chartType'];
	
	var rowData = {};
	getJsonAllData(lvar_infoData, rowData);
	
	console.log(rowData);
	
	$('#dashboardInfoSubTitle').text(rowData['dn']);
	
	if((Object.keys(rowData)).length > 0){
		var content;
		
		if(chartType.indexOf('fileInt') == 0){
			content = $('<div class="tbl"><table id="testTb2" class="left"><colgroup>'+
					'<col width="148px">' +
					'<col width="auto">' +
					'</colgroup>' +
					'<tbody></tbody'+
			'</table></div>');
			
			for(var key in rowData){
				content.find('tbody').append($('<tr>'+
					'<th class="tl">'+(_FIELD_LABEL[key] ? _FIELD_LABEL[key] : key)+'</th>'+
					'<td class="tl" title="'+rowData[key]+'">'+rowData[key]+'</td>'+
				'</tr>'));
			}
			
		}
		else{
			content = $('<ul class="detail_list"></ul>');
			
			for(var key in rowData){
				var $li = $('<li><dl><dt>'+key+'</dt><dd>'+rowData[key]+'</dd></dl></li>')
				content.append($li);
			}
			
		}

		$('#dashboardInfoContent').append(content);
		
	}
	
});

