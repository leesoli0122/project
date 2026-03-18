var processSocket = null;
var lp_callBack = null;
var lp_masterip = null;
var lp_hardwareid = null;


$(function () {
	doConnect();
});

function doConnect() {
	if(processSocket != null) return;
	
	processSocket = new WebSocket(
		(window.location.protocol == "http:"? "ws":"wss") +
		"://" + window.location.host + "/event.ws"
	);
	processSocket.onopen = function() {
		console.log("Process 연결");
	
		processSocket.onmessage = onMessage;
        processSocket.onclose = onClose;
        processSocket.onerror = onError;

        registTopic();
    };
}

function registTopic() {
    var topicList = new Array();
    topicList.push(_TOPIC_PROCESS);

    var headerJson = new Object();
    headerJson.wsId = _WS_SET; // SET:100001, ADD:100002, DEL:100003, GET:100004
    
    var bodyJson = new Object();
    bodyJson.topicList = topicList;

    var json = new Object();
    json.header = headerJson;
    json.body = bodyJson;

    if(processSocket != null) processSocket.send(JSON.stringify(json));
}

function onMessage(evt) {
	if(lp_callBack == null) return;
	
    var jsonData = JSON.parse(evt.data);
    
    if (Array.isArray(jsonData)) {
    	$.each(jsonData, function(index, item){
    		//if($('#selAgentID').val() != item.devID) return;
    		if(item.class != _TOPIC_PROCESS) return;
    		
    		lp_callBack(item);
	    });
    }
}

function onClose(evt) {
    console.log("연결 끊김");
}

function onError(evt) {
    console.log("Error : " + evt);
}

function requestProcessList(_masterip, _hardwareid, _callBack) {	
	lp_callBack = _callBack;
	lp_masterip = _masterip;
	lp_hardwareid = _hardwareid;
	
	var data = {};
	data.TYPE = "processcontrol";
	data.IP = _masterip;
	data.ID = _hardwareid;
	data.FIRSTKEY = parseInt(_hardwareid.substring(1));

	cf_requestServer(_TR_PROCESS_SEARCH, data, lf_serviceCall800207CallBack);
}


function lf_serviceCall800207CallBack() {
	console.log("lf_serviceCall800207CallBack");
}