var detailData;
var rowData;

// request에서 보여줄 내용만 추출하여 다시 json으로 만드는데 사용되는 함수들
	var requestRegroup = {};	// 보여줄 request값인 json
	var objectRegroup = {};		// 보여줄 request안에 object값 json
	var metadataRegroup = {};		// 보여줄 request안에 object안에 metadata값 json
	var metadataKeyWord = ['annotations', 'creationTimestamp', 'name', 'namespace'];	// 메타데이터에서 추출할 키값 -> 오브젝트에 metadata로 추가되는 요소
	var objectKeyWord = ['apiVersion', 'kind', 'metadata', 'spec', 'status', 'command','container','stderr','stdout'];	// 오브젝트에서 추출할 키값

$(function () {
	lf_detailFrame();
});

function lf_detailFrame(){
	var category = opener.document.getElementById("detailNum").value;
	var detailList = $('.detail_list_cluster');
	var detailInfo = "";
	
	detailList.find('> li').remove();
	
	switch(category){
		case 'eventWorkload':
			detailInfo =  (
				"<li><dl><dt>Result</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Rule Name</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Request By</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Cluster</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Namespace</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Kind</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Operation</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Message</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Date</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Request</dt><dd id='detailRequest'></dd></dl></li>"
			); break;
		default : 
		detailInfo = (
			""
			); break;
	}
	detailList.append(detailInfo);
	detailData = opener.document.getElementById("detailData").value;
	rowData = JSON.parse(detailData);
	lf_eventDetail(category);
}

function lf_eventDetail(category){
	console.log("rowData: " , rowData);
	// category에 따라 데이터 display
	var dp = function(name) {
		if(name == 'date'){
			return rowData['created_at'];
		}
		else {
			return rowData[name];
		}
	};
	
	// Operation의 값에 따라서 키값이 변동되며, 변동된 키값에 따라 내용을 추출
	switch(getJsonValue(rowData, 'request_operation_type')){
		case "CREATE":
		case "CONNECT":
			pickUpInObject('object');
			break;
		case "UPDATE":
			pickUpInObject('object');
			pickUpInObject('oldObject');
			break;
		case "DELETE":
			pickUpInObject('oldObject');	
			break;
		default:
			break;
	}
	
	// 23-07-28 추가. request json 데이터 출력 
	$("#detailRequest").append('<textarea id="detailJsonLog" class=\'detail_json_log_view\' readonly>' + JSON.stringify(requestRegroup, null,4) + '</textarea>'); // 컨텐츠
	mscrollbar(); // textarea에 스크롤바 적용하는 함수 -> scripts.js에 정의
	// textarea 스크롤바에 생성시 크기 제한 문제 해결 및 css적용
	document.head.innerHTML += '<style>'
		+ ' .detail_json_log_view { height: 500px !important;}'
		+ ' .scroll-wrapper > .scroll-content {height: 500px !important;}'
		+ ' #detailJsonLog{height: 500px !important; background:black;}'
		+ ' </style>';

	
	var registry_ip = rowData['registry_host'];
	if(!registry_ip) registry_ip = 'docker.io';
	
	$("#deviceNm1").val(rowData['request_scope'].split(":")[0]); // 상세 정보 
	$("#eventDtm1").val(rowData['created_at']); // 탐지 시간
	
	var bodyList = $('ul.detail_list_cluster > li > dl > dd');
	if(category == 'eventWorkload') {	
		lf_setData(bodyList[0], dp('authorization_action'));
		lf_setData(bodyList[1], dp('policy_name'));
		lf_setData(bodyList[2], dp('subject'));
		lf_setData(bodyList[3], dp('cluster'));
		lf_setData(bodyList[4], dp('namespace'));
		lf_setData(bodyList[5], dp('request_resource'));
		lf_setData(bodyList[6], dp('request_operation_type'));
		lf_setData(bodyList[7], dp('message'));
		lf_setData(bodyList[8], dp('date'));
	} 
}

function lf_setData(thiz, data) {
	$(thiz).text(data);
	$(thiz).attr('title', data);
}


// 오브젝트 내에서 키값에 따라 데이터를 추출, object라는 키값 이름이 변동사항이 있어서 함수로 정의
function pickUpInObject(objectKeyName){
	// 키 값이 존재하지 않을시 실행 중지
	if(!Object.keys(rowData['request']).includes(objectKeyName)) return;
	
	// object값 추출
	objectKeyWord.forEach(function(value) {
		// 키 값이 존재하지 않을시 실행 중지
		if(!Object.keys(rowData['request'][objectKeyName]).includes(value)){
			return;
		}
		else if (value != 'metadata') {
			// common.js에 있는 프로퍼티 추출 함수 사용
			objectRegroup[value] = getJsonValue(rowData['request'][objectKeyName], value);
		} else {
			// 메타 데이터값 추출
			metadataKeyWord.forEach(function(metaValue) {
				// 키 값이 존재하지 않을시 실행 중지
				if(!Object.keys(rowData['request'][objectKeyName]['metadata']).includes(metaValue)){
					return;
				}
				metadataRegroup[metaValue] = getJsonValue(rowData['request'][objectKeyName]['metadata'], metaValue);
			});
			// metadata값을 object값에 추가
			objectRegroup['metadata'] = metadataRegroup;
			// metadata값을 초기화
			metadataRegroup={};
		}
	});
	// UI 설계 순서에 따라 object값을 contents값에 먼저 추가
	requestRegroup[objectKeyName] = objectRegroup;
	//object값 초기화
	objectRegroup={};
}












