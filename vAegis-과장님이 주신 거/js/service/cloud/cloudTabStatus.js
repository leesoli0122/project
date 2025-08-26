
var timeId = null;
var scanSecond;

$(function () {
	var data = {};
	cf_requestServer(_TR_MALWARE_STATUS, data, serviceCall800201CallBack);    
});

function initMalwareStatus(data) {
	var statusMalwareTable = $('#statusMalwareTable').DataTable();
	
	if(timeId != null) {
		clearInterval(timeId);
	}
	
	statusMalwareTable.clear().draw();
	setScanSecond(0);
	timeId = setInterval(function() { setScanSecond(scanSecond+1); } , 1000);
	
	var equip_id_arr = data.equip_id.split("¥");
	var equipmarkname_arr = data.equipmarkname.split("¥");
	var masterip_arr = data.masterip.split("¥");
	
	for(var i=0; i<equip_id_arr.length; i++) {
		var dstatus = data.status;
		if(typeof dstatus == "undefined" || dstatus == null || dstatus == "")
			data.status = _STATUS['SCAN_INIT'];
		
			
		var row = statusMalwareTable.row.add( [
		    equipmarkname_arr[i] + "(" + masterip_arr[i] + ")",
		    '<em class="online">' + _STATUSNAME[data.status] + '</em>', //SCAN_IDLE
		    "-",
		    "-"
		] ).draw( false ).node();
		$(row).attr("equipmarkname", equipmarkname_arr[i]);
		$(row).attr("masterip", masterip_arr[i]);
		$(row).attr("equip_id", equip_id_arr[i]);
		
		$(row).attr("onclick", "javascript: requestStop(this)");        
        $(row).find('td').addClass('long_w');
        $(row).find('td:eq(0)').addClass('tl');
        $(row).find('td:eq(2)').addClass('tl');        
	}	
	
	statusMalwareTable.draw(true);
}

function setScanSecond(sec) {
	scanSecond = sec;
	
	var min = Math.floor(scanSecond/60, 0);
	var sec = scanSecond%60;
	if(min < 10) min = "0" + min;
	if(sec < 10) sec = "0" + sec;
		
	$('#tab_malware_scan div.securitypolicy_title dl dt').text(min + ":" + sec);
}

function serviceCall800201CallBack(data) {
	var statusMap = data.body.statusMap;
	var statusList = Object.values(statusMap);
	
	console.log(statusList);
	
	for(var i=0; i<statusList.length; i++) {
		if(statusList[i].status != _STATUS['SCAN_IDLE']) {
			onMessageMalwareScan(statusList[i]);
		}
	}	
}


function onMessageMalwareScan(data) {	
	var statusMalwareTable = $('#statusMalwareTable').DataTable();
	
	var dstatus = data.status;
	if(typeof dstatus == "undefined" || dstatus == null || dstatus == "")
		data.status = _STATUS['SCAN_INIT'];
	
	var agentName = "";
	if(data.devName) {
		agentName = data.devName + "(" + data.devIP + ")";
	} else {
		agentName = data.equipmarkname + "(" + data.masterip + ")";
	}
	var exists = false;
	var rows = statusMalwareTable.rows().data();
	for(var i=0; i<rows.length; i++) {
		var item = rows[i];
		
        if (agentName == item[0]) {
        	exists = true;

        	//item[1] = _STATUSNAME[data.status];
        	item[1] = '<em class="online">' + _STATUSNAME[data.status] + '</em>';
        	switch(data.status) {
				case _STATUS['SCAN_INIT'] :	
					break;		
				case _STATUS['SCAN_START'] :
					item[2] = data.filename;
					item[3] = data.infectcount + "/" + data.dircount;
					break;
				case _STATUS['SCAN_FIN'] :
					item[1] = '<em class="offline">' + _STATUSNAME[data.status] + '</em>';
					item[2] = '-';
					break;
				case _STATUS['SCAN_FAIL'] :
					item[1] = '<em class="offline">' + _STATUSNAME[data.status] + '(자산 연결 확인)</em>';
					item[2] = '-';					
					break;
			}
        	
        	statusMalwareTable.row(i).data(item);
            break;
        }
    }
    if(!exists) {
    	var filename = _STATUS['SCAN_START']==data.status? data.filename:"-";
    	var count = _STATUS['SCAN_START']==data.status? (data.infectcount + "/" + data.dircount):"-";
    	var status = '<em class="online">' + _STATUSNAME[data.status] + '</em>';
    	var row = statusMalwareTable.row.add( [
		    agentName,
		    status,
		    filename,
		    count
		] ).draw( false ).node();		
		if(data.devName) {
			$(row).attr("equipmarkname", data.devName);
			$(row).attr("masterip", data.devIP);
			$(row).attr("equip_id", data.devID);			
		} else {
			$(row).attr("equipmarkname", data.equipmarkname);
			$(row).attr("masterip", data.masterip);
			$(row).attr("equip_id", data.equip_id);
		}

		$(row).attr("onclick", "javascript: requestStop(this)");
		$(row).find('td').addClass('long_w');
        $(row).find('td:eq(0)').addClass('tl');
        $(row).find('td:eq(2)').addClass('tl');
    }
    
    /*if(timeId == null) {
    	setScanSecond(0);
		imeId = setInterval(function() { setScanSecond(scanSecond+1); } , 1000);
	}*/
    if(timeId != null) {
	    var offCnt = 0;
	    for(var i=0; i<rows.length; i++) {
			var item = rows[i];
			if(item[1].indexOf("offline") >= 0) {
				offCnt++;
			}
		}
		if(rows.length == offCnt) {
    		clearInterval(timeId);
    	}
	}
	
	statusMalwareTable.draw(true);	
}
