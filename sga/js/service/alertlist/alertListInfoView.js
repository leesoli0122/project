
var limit_length = 25;
var lvar_infoData = {};

$(function () {
	lvar_infoData = ($('#alertListEventDialog').data('initParam'))['rowData'];
	var topic = ($('#alertListEventDialog').data('initParam'))['topic'];
	var idx =($('#alertListEventDialog').data('initParam'))['idx'];
	
	console.log(lvar_infoData);
	
	var rowData = {};
	getJsonAllData(lvar_infoData, rowData);
	
	
	
	$('#headline').html(
		"<span>(<em>" + idx + "</em>)</span> " + rowData['dn'] + "(" + rowData['devIP'] + ") / " + rowData['revisetime']
	);	
	
	var event = new SolipsEvent(lvar_infoData);
	
	var ignoreKey = [ '', 'dn', 'equip_id', 'class'];
	if((Object.keys(rowData)).length > 0){
		var content = $('#contentList');

		if(topic == _TOPIC_FIREWALL
			|| topic == _TOPIC_IPS
			|| topic == _TOPIC_MALWARE
			|| topic == _TOPIC_FILE
			|| topic == _TOPIC_APPCTL) {
			//var data = rowData[key];
			//data = limit_length.lengtgh < limit_lenth? data:(data.substring(0, limit_length) + "..");
			//var $li = $('<li title=' + rowData[key] + '><dl><dt>'+_FIELD_LABEL[key]+'</dt><dd>'+data+'</dd></dl></li>');
			for(var key in rowData){
				var keyName = _FIELD_LABEL[key];
				if(keyName == null) continue;
				
				if(ignoreKey.indexOf(key) > 0) continue;
				
				var titleValue = rowData[key];
				var bodyValue = rowData[key];				
				if(key == 'severity') {
					bodyValue = event.getSeverityName();
				} 

				if(bodyValue.length > limit_length) {
					bodyValue = bodyValue.substring(0, limit_length) + "..";
				} 
				
				
				var $li = $('<li><dl><dt>'+_FIELD_LABEL[key]+'</dt><dd title="' + titleValue + '">'+bodyValue+'</dd></dl></li>')
				content.append($li);				
			}
		} 	
		//$('#content').append(content);
		
	}
});

