var malwareSocket = null;

$(function () {
	doConnect();
});

function doConnect() {
	if(malwareSocket != null) return;
	
	malwareSocket = new WebSocket(
		(window.location.protocol == "http:"? "ws":"wss") +
		"://" + window.location.host + "/event.ws"
	);
	malwareSocket.onopen = function() {
		console.log("Malware 연결");
	
		malwareSocket.onmessage = onMessage;
        malwareSocket.onclose = onClose;
        malwareSocket.onerror = onError;

        registTopic();
    };
}

function registTopic() {
    var topicList = new Array();
    topicList.push(_TOPIC_MALWARE_EVENT);
    topicList.push(_TOPIC_MALWARE_SCAN);
    var headerJson = new Object();
    headerJson.wsId = _WS_SET; // SET:100001, ADD:100002, DEL:100003, GET:100004
    
    var bodyJson = new Object();
    bodyJson.topicList = topicList;

    var json = new Object();
    json.header = headerJson;
    json.body = bodyJson;

    if(malwareSocket != null) malwareSocket.send(JSON.stringify(json));
}

function onMessage(evt) {
	var t = $('#recentMalwareTable').DataTable();
	
    var jsonData = JSON.parse(evt.data);    
    if (Array.isArray(jsonData)) {
    	$.each(jsonData, function(index, item){
    		if(item.class == _TOPIC_MALWARE_EVENT) {
	        	onMessageMalwareEvent(item);
	        } else if(item.class == _TOPIC_MALWARE_SCAN) {
	        	onMessageMalwareScan(item);
	        }
	    });
    }		
}

function onClose(evt) {
    console.log("연결 끊김");
}

function onError(evt) {
    console.log("Error : " + evt);
}