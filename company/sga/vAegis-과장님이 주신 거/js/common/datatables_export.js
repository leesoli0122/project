function initExportExcel(tid) {
	$('#' + tid + '_length').children('div:eq(0)').append(
		'<span data=' + tid + ' style=cursor:pointer class=exportExcel onclick=javascript:_exportExcel(this)> ::Excel</span>'
	);
}

function _exportExcel(thiz) {
	var tid = $(thiz).attr('data');
	$('#' + tid + '_wrapper').find('select.table_top').val('-1').trigger('change');
	$('#' + tid + '_wrapper').find('div.nice-select span.current').text('All');

	var excelHandler = {
		getExcelFileName : function() {
			var title = $(document).find("title").text();
			if(title == '') title = "Aegis_excelData";
			return title + '.xlsx';
		},
		getSheetName : function(){
			return 'Sheet1';
		},
		getExcelData : function(){
			return document.getElementById(tid); 
		},
		getWorksheet : function(){
			return XLSX.utils.table_to_sheet(this.getExcelData());
		}
	}

	var wb = XLSX.utils.book_new();
	var newWorksheet = excelHandler.getWorksheet();

	XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

	var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
}

function s2ab(s) { 
	var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	var view = new Uint8Array(buf);  //create uint8array as viewer
	for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
	return buf;    
}
