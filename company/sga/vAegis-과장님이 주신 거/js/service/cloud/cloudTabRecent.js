$(function () {
	var body = {
		'page' : 0,
		'topn' :  10,
		'parameters': []
	};

	cf_requestServer(_TR_EVENT_MALWARE_SEARCH,body,serviceCall700010Callback);
	
});

function serviceCall700010Callback(data, body){
	var dataList = data.body.dataList;
	$.each(dataList, function(idx, rowData){
		rowData.devIP = rowData.equip_id;
		onMessageMalwareEvent(rowData);
	});
}

function onMessageMalwareEvent(item) {
	var t = $('#recentMalwareTable').DataTable();
	var idx = item['id'];
	var agentName;
	if(item['devIP']) {
		agentName = item['dn'] + ' ('+item['devIP']+')';
	} else {
		agentName = item['dn'] + ' ('+item['masterip']+')';
	}
	var row = t.row.add( [
        item['dn'] + ' ('+item['devIP']+')',         
        item.virusname,
        item.filename,
        item.revisetime
    ] ).draw( false ).node();
    
    $(row).data(item);         
    $(row).attr("onclick", "javascript: malwareAlertListClick(this)");
    $(row).attr("idx", idx);
    $(row).find('td').addClass('long_w');
    $(row).find('td:eq(0)').addClass('tl');
    $(row).find('td:eq(2)').addClass('tl');
    $(row).attr("topic", _TOPIC_MALWARE_EVENT);    
}

function malwareAlertListClick(thiz) {
	var num = 0;
	var rowData = $(thiz).data();
	
	$('#detailNum').val("");
	$('#detailNum').val("malwareEvent_"+num);
	
	$('#detailData').val("");
	$('#detailData').val(JSON.stringify(rowData));

	window.open('/eventMalwareInfo.do','','width=869,height=679,location=no,status=no,scrollbars=yes');
}
