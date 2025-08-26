var detailData;
var rowData;
var nowDisplayViewState = false;
	// contents에서 보여줄 내용만 추출하여 다시 json으로 만드는데 사용되는 함수들
	var contentsRegroup = {};	// 보여줄 contents값인 json
	var objectRegroup = {};		// 보여줄 contents안에 object값 json
	var metadataRegroup = {};		// 보여줄 contents안에 object안에 metadata값 json
	var metadataKeyWord = ['annotations', 'creationTimestamp', 'name', 'namespace'];	// 메타데이터에서 추출할 키값 -> 오브젝트에 metadata로 추가되는 요소
	var objectKeyWord = ['apiVersion', 'kind', 'metadata', 'spec', 'status'];	// 오브젝트에서 추출할 키값
	var contentsKeyWord = ['operation', 'options', 'requestKind', 'userInfo'];	// 컨텐츠에서 추출할 키값

$(function() {
	//console.log("start");
	lf_detailFrame();
});



// View and Hide 기능
function onOffDisplay() {
	if (nowDisplayViewState) {
		// 클릭시 숨기기
		nowDisplayViewState = false;
		$('#resultDetailDiv').slideUp();
		$('.view_hide_btn_icon').removeClass('view_hide_active'); 
		

	} else {
		// 클릭시 보이기
		nowDisplayViewState = true;
		$('#resultDetailDiv').slideDown();
		$('.view_hide_btn_icon').addClass('view_hide_active'); 
	}
}

function lf_detailFrame() {
	var category = opener.document.getElementById("detailNum").value;
	var detailList = $('.detail_list_cluster');
	var detailInfo = "";

	detailList.find('> li').remove();

	switch (category) {
		case 'eventContainerSecurity':
			detailInfo = (
				"<li><dl><dt>Type</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Severity</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Resource</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Impact</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Description</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Remediation</dt><dd></dd></dl></li>"
			); break;

		default:
			detailInfo = (
				""
			); break;
	}
	detailList.append(detailInfo);

	detailData = opener.document.getElementById("detailData").value;
	//console.log("datail Data: ", detailData);
	rowData = JSON.parse(detailData);
	//console.log("rowData:  ", rowData);
	lf_eventDetail(category);
}

function lf_eventDetail(category) {

	
	var dp = function(name) {
		if (name == 'resource') {
			// resource정보는 여러개 일 수 있으므로 여러개일시 ,로 구분하여 display
			var resourceList = "";
			rowData['resource'].forEach(function(value, index) {
				if (!index == 0) resourceList += ", ";
				resourceList += value;
			});
			return resourceList;
		} else {
			return rowData[name];
		}
	};


	
	// Operation의 값에 따라서 키값이 변동되며, 변동된 키값에 따라 내용을 추출
	switch(getJsonValue(rowData, 'operation')){
		case "CREATE":
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


	// contents값 추출
	contentsKeyWord.forEach(function(value) {
		// common.js에 있는 프로퍼티 추출 함수 사용
		contentsRegroup[value] = getJsonValue(rowData['contents'], value);
	});


	$("#clusterName").val(rowData['cluster']); // 클러스터 이름
	$("#nameSpace").val(getJsonValue(rowData['contents'], 'namespace')); // 네임 스페이스
	$("#message").val(rowData['message'].split("details=(")[1].slice(0, -1)); // 메세지
	$("#csDetailRuleName").html(rowData['rulename']); // 룰 네임
	
	$("#detailContents").append('<textarea id="detailJsonLog" class=\'detail_json_log_view\' readonly>' + JSON.stringify(contentsRegroup, null, 4) + '</textarea>'); // 컨텐츠

	mscrollbar(); // textarea에 스크롤바 적용하는 함수 -> scripts.js에 정의
	
	// textarea 스크롤바에 생성시 크기 제한 문제 해결 및 css적용
	document.head.innerHTML += '<style>'
		+ ' .detail_json_log_view { height: 1200px !important;}'
		+ ' .scroll-wrapper > .scroll-content {height: 1200px !important;}'
		+ ' #detailJsonLog{height: 1200px !important; background:black;}'
		+ ' </style>';

	var bodyList = $('ul.detail_list_cluster > li > dl > dd');
	if (category == 'eventContainerSecurity') {
		lf_setData(bodyList[0], dp('type'));
		lf_setData(bodyList[1], dp('severity'));
		lf_setData(bodyList[2], dp('resource'));
		lf_setData(bodyList[3], dp('impact'));
		lf_setData(bodyList[4], dp('description'));
		lf_setData(bodyList[5], dp('remediation'));
	}



}

function lf_setData(thiz, data) {
	$(thiz).text(data);
	$(thiz).attr('title', data);
}

// 오브젝트 내에서 키값에 따라 데이터를 추출, object라는 키값 이름이 변동사항이 있어서 함수로 정의
function pickUpInObject(objectKeyName){
	// 키 값이 존재하지 않을시 실행 중지
	if(!Object.keys(rowData['contents']).includes(objectKeyName))return;
	
	// object값 추출
	objectKeyWord.forEach(function(value) {
		// 키 값이 존재하지 않을시 실행 중지
		if(!Object.keys(rowData['contents'][objectKeyName]).includes(value))return;
		else if (value != 'metadata') {
			// common.js에 있는 프로퍼티 추출 함수 사용
			objectRegroup[value] = getJsonValue(rowData['contents'][objectKeyName], value);
		} else {
			// 메타 데이터값 추출
			metadataKeyWord.forEach(function(metaValue) {
				// 키 값이 존재하지 않을시 실행 중지
				if(!Object.keys(rowData['contents'][objectKeyName]['metadata']).includes(metaValue))return;
				metadataRegroup[metaValue] = getJsonValue(rowData['contents'][objectKeyName]['metadata'], metaValue);
			});
			// metadata값을 object값에 추가
			objectRegroup['metadata'] = metadataRegroup;
			// metadata값을 초기화
			metadataRegroup={};
		}
	});
	// UI 설계 순서에 따라 object값을 contents값에 먼저 추가
	contentsRegroup[objectKeyName] = objectRegroup;
	//object값 초기화
	objectRegroup={};
}







