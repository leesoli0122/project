/*
 * 정책 관리 > 클러스터 정책 > 클러스터 규정준수
 * 
*/
// 모달창에서 고른 프레임워크의 리스트
var modalSelectClusterFrameWorkNames = [];
// 통신시 보낼 데이터
var sendData = {
	type: "", // 필수 데이터 나머지 데이터 들은 필요시에 추가되며 init시 {}로 초기화
	// 각 조회 또는 저장마다 필요한 데이터가 다르기 때문에 필요한 요소만 서버에 보내도록 구성
	cluster_uuid: "",
	frameWorkId: "",
	frameWorkIdList: [],
	reSearch: "",
	reSearchControl: "",
	allFrameWork: "",
	group: "",
	onOffFrameWorkChangeDataCheck: "",
	onOffControlChangeDataCheck: "",
	onOffFrameWorkChangeData: {},
	onOffControlChangeData: {},
	onOffFrameWorkChangeDataKey: [],
	onOffControlChangeDataFrameWorkKey: [],
	onOffControlChangeDataControlKey: {},
	saveAsCluster: "",
	saveAsFrameWorkName: "",
	saveAsDescription: "",
	saveAsVersion: "",
	saveAsControlUUID: [],
	baseFrameWorkId: "",
	controlUUID: ""
}
// 현재 선택된 데이터
var selectedData = {
	cluster: "",
	frameWork: ""
}
// 프레임워크들의 정보
var frameWorkList = {};
var onOffFrameWorkChangeData = {};

// 활성화된 컨트롤 정보
var onOffControlChangeData = {};

// 검색된 정보
var corControlList = [];
var corGroupList = {};

// 검색모드인가? > 다른이름 저장에 사용
var searchMode = false;
// 검색시 그룹 정보를 가져와야하는가?
var searchGetGroup = false;

// 컨트롤에서 변경할 이름들
var controlChangeNameLabel = ['K', 'D', 'L'];

// 변경할 컨트롤 이름
var controlChangeNameLabelFromFrameworkId = {
	"clf_0003": {
		"cut": 4,	// 앞에서부터 자를 범위
		"rename": "NSA-"	// 새로 붙일 네임
	},
	"clf_0004": {
		"cut": 4,	// 앞에서부터 자를 범위
		"rename": "DevOps-"	// 새로 붙일 네임
	}
}

// 아이콘 key: value
// key: 포함되는 내용(소문자로 입력) value: 아이콘 이미지 위치
var frameWorkBasedIcon = {
	"kubernetes": "policy_cs_compliance_kubernetes",
	"docker": "policy_cs_compliance_docker",
	"linux": "policy_cs_compliance_linux",
	"devops": "policy_cs_compliance_devops",
	"nsa-cisa": "policy_cs_compliance_nsa_cisa"
}

// 검색시에 컨트롤의 펼침을 위한 꺽쇠 요소 id 배열
var slideControlOpenArrayForSearch = [];

// 컨트롤 ALL SELECT 관련 객체
var controlAllControlData={
/*	"프레임워크 아이디":{
		"original":"T/F",//초기 스위치값
		"is_changed":"T/F",
		"value":"T/F"
	}*/
};

// 컨트롤  sorting 함수
function policyCsComplianceControlSorting(targetA, targetB) {
	// 컨트롤 id에 '-'이 포함되지 않았다면 재정렬 x
	if (targetA.control_id.lastIndexOf("-") == -1 && targetB.control_id.lastIndexOf("-") == -1) return 0;

	var beatArrayA = targetA.control_id.substr(targetA.control_id.lastIndexOf("-") + 1).split('.');
	var beatArrayB = targetB.control_id.substr(targetB.control_id.lastIndexOf("-") + 1).split('.');
	var length = 0;
	var result = 0;

	if (beatArrayA.length >= beatArrayB.length) length = beatArrayB.length;
	else length = beatArrayA.length;

	for (var i = 0; i < length; i++) {
		if (!Number(beatArrayA[i]) && !Number(beatArrayB[i])) {
			if (beatArrayA[i] > beatArrayB[i]) {
				result = 1;
				break;
			}
			else if (beatArrayA[i] < beatArrayB[i]) {
				result = -1;
				break;
			} else {
				result = 0;
				break;
			}
		}
		else if (!Number(beatArrayA[i])) {
			result = 1;
			break;
		}
		else if (!Number(beatArrayB[i])) {
			result = -1;
			break;
		}

		if (Number(beatArrayA[i]) > Number(beatArrayB[i])) {
			result = 1;
			break;
		}
		else if (Number(beatArrayA[i]) < Number(beatArrayB[i])) {
			result = -1;
			break;
		}
	}

	return result;
}


$(document).ready(function() {
	getClusterList();
	$('#reSearchText').on('keyup', function (event) {
		if (event.keyCode === 13) { // enter
			reSearchGroupOrControls(); // 검색 실행
		}
	});
});

/**
 * 공통 모듈에 들어갈 함수
 */
// 슬라이드 디스플레이(꺽쇠) 객체
var slideDisplay = {
	// 사용시 해당 객체에 동작 여부 담김
	displayViewState: {},
	// 초기화 예외
	initException: {},
	// 플래그로 해당 속도는 필요시 재설정 할 수 있음
	// 재설정 ex) slideDisplay.middle = 200;
	fast: 0,
	middle: 600,
	slow: 1200,

	// 예외 까지 모두 초기화할것인가?
	initAll: false,

	onOff: function(targetId, slidetime, exception) {
		var speed = slideDisplay[slidetime];


		if (this.displayViewState[targetId]) {
			// 클릭시 숨기기
			this.displayViewState[targetId] = false;
			$('#' + targetId).slideUp(speed);
			$('.view_hide_btn_icon.' + targetId).removeClass('view_hide_active');
			$('.view_hide_btn_icon_grey.' + targetId).removeClass('view_hide_active');
			//2024-01-09 퍼블참고
			$('.view_hide_btn_icon.' + targetId).closest('#frameWorkListBox > div').removeClass('open_box');

		} else {
			// 클릭시 보이기
			this.displayViewState[targetId] = true;
			$('#' + targetId).slideDown(speed);
			$('.view_hide_btn_icon.' + targetId).addClass('view_hide_active');
			$('.view_hide_btn_icon_grey.' + targetId).addClass('view_hide_active');
			//2024-01-09 퍼블참고
			$('.view_hide_btn_icon.' + targetId).closest('#frameWorkListBox > div').addClass('open_box');
		}
		// 초기화 예외사항은 따로 저장
		if (exception) this.initException[exception] = this.displayViewState[targetId];
	},
	// 함수 플래그 설정 초기화
	init: function() {
		// 전부 초기화
		if (this.initAll) {
			this.initExceoption = {};
			this.displayViewState = {};

			// 초기화 예외가 있는경우 빼고 초기화
		} else if (this.initExceoption) {
			// 메모리 주소가 아닌 실제 값 복사
			this.displayViewState = ccf_isCopyObj(this.initExceoption);
			this.initExceoption = {};
		} else {	// 전부 초기화는 아니지만, 예외가 없는 경우
			this.displayViewState = {};
		}
		this.fast = 0;
		this.middle = 600;
		this.slow = 1200;
		this.initAll = false;
	}
}

/*// 깊은 복사
// 실제 데이터 값을 복사해주는 함수
function isCopyObj(origin) {
	let copy = {};

	for (let key in origin) {
		if (typeof origin[key] === 'object') {
			copy[key] = isCopyObj(obj[key]);
		} else {
			copy[key] = origin[key];
		}
	}
	return copy;
}*/

/**
 * display
 */
function policyComplianceSlideDisplay(targetId, slidetime, exception) {
	slideDisplay.onOff(targetId, slidetime, exception);
	//$("#policy_cs_compliance_sub_bar_side").css("height", document.getElementById("policy_cs_compliance_sub_bar_center").clientHeight);
}

/**
 * 초기화 관련 함수들
 */
// 초기화 함수
function policyCSComplianceInit(type) {
	if (type === "cluster") initCluster();
	else if (type === "sendData") initSendData();
	else if (type === "frameWork") initFrameWork();
	else if (type === "modalFrameWorkName") initModalSelectClusterFrameWorkNames();
	else if (type === "group") initGroup();
	else if (type === "frameWorkChange") initFrameWorkChange();

	initSendData();
}
// sendData 초기화
function initSendData() {
	sendData = {};
}
// 클러스터 정보 초기화
function initCluster() {
	initFrameWork();

	selectedData.cluster = "";
	// 선택지 지우기
	$('#clusterList').children().remove();
	$('#clusterListModal').children().remove();
	$("#clusterList").niceSelect("update");
	$("#clusterListModal").niceSelect("update");
}
// 프레임워크 정보 초기화 > 클러스터 변경시
function initFrameWork() {
	initModalSelectClusterFrameWorkNames();
	initFrameWorkChange();

	selectedData.frameWork = "";
	frameWorkList = {};

	// 선택지 지우기
	$('#frameWorkList').children('option:not(:first)').remove();
	$("#frameWorkList").niceSelect("update");


}

// 프레임 워크 변경시
function initFrameWorkChange() {
	// 프레임 워크 변경시 하나 추가해야함
	slideDisplay.initAll = true;
	slideDisplay.init();
	// 이전 검색 결과 초기화
	corControlList = [];
	corGroupList = {};
	$("#reSearchText").val("");

	// 전체 box  초기화
	$("#frameWorkListBox").html("");
	policyCSComplianceInit("sendData");	
	
	// 검색 모드 초기화
	searchMode = false;
}

// 모달창 프레임워크 이름 초기화
function initModalSelectClusterFrameWorkNames() {
	modalSelectClusterFrameWorkNames = [];
}


/**
 * 통신 관련 함수들
 */
// 통신 서비스 이름관리 함수
function getServiceName(type) {
	if (type === "get") return _TR_POLICY_CS_COMPLIANCE_SEARCH;
	else if (type === "save") return _TR_POLICY_CS_COMPLIANCE_INSERT_UPDATE;
}

// 통신 관리 함수
function policyCSComplianceRequestServer(type, fixData, sync) {
	var sendType = sendData.type;
	var serviceName = getServiceName(type);
	cf_contPreloader("loadingSpot");

	cf_requestServer(serviceName, sendData, (data) => {
		cf_removePreloader("loadingSpot");
		if (type === "get") getCallBackController(sendType, fixData, data);
		else if (type === "save") saveCallBackController(sendType, fixData, data);
	}, sync);
}

// 조회 콜백 컨트롤러
function getCallBackController(type, fixData, data) {
	if (type === "cluster") getClusterListCallBack(fixData, data.body.resultData);
	else if (type === "frameWork") getFrameWorkListCallBack(fixData, data.body.resultData);
	else if (type === "control") getControlListCallBack(fixData, data);
	else if (type === "reSearch") getReSearchCallBack(fixData, data);
}

// 저장 콜백 컨트롤러
function saveCallBackController(type, fixData, data) {
	if (type === "save") saveCallBack(fixData, data);
	else if (type === "saveAs") saveAsCallBack(fixData, data);
	else if (type === "import") importCallBack(fixData, data);
}

// 저장
function savePolicyComplianceScan() {
	if (!Object.keys(onOffControlChangeData).length && !Object.keys(onOffFrameWorkChangeData).length) {
		cf_alert("저장", "변경사항이 없습니다.");
		return false;
	}

	policyCSComplianceInit("sendData");
	sendData.type = "save";
	
	
	// 프레임 워크 변경사항 있을시 플래그 넣고, 변경 데이터 넣음
	if (Object.keys(onOffFrameWorkChangeData).length) {
		sendData.onOffFrameWorkChangeDataCheck = "Y";
		sendData.onOffFrameWorkChangeData = onOffFrameWorkChangeData;
		sendData.onOffFrameWorkChangeDataKey = [];
		$.each(onOffFrameWorkChangeData, (index, item) => {
			sendData.onOffFrameWorkChangeDataKey.push(index);
		});
	} else {
		sendData.onOffFrameWorkChangeDataCheck = "N";
	}
	
	sendData.controlAllControlOffData = [];
	sendData.controlAllControlOnData = [];
	// 전체 셀렉트를 했나?
	$.each(controlAllControlData,(index,item)=>{
		if(item.is_changed ==="T"){
			if(item.value==="T") sendData.controlAllControlOnData.push(index);
			else sendData.controlAllControlOffData.push(index);
		}
	});
	
	// TODO 컨트롤 전체 ON/OFF시 비정제 데이터를 가지고 넘어가므로 정제과정 필요 (현재 백단에서 정제중)
	// 컨트롤 변경사항 있을시 플래그 넣고, 변경 데이터 넣음
	if (Object.keys(onOffControlChangeData).length) {
		sendData.onOffControlChangeDataCheck = "Y";
		sendData.onOffControlChangeData = onOffControlChangeData;
		sendData.onOffControlChangeDataFrameWorkKey = [];
		sendData.onOffControlChangeDataControlKey = {};
		$.each(onOffControlChangeData, (frameWork, item) => {
			sendData.onOffControlChangeDataFrameWorkKey.push(frameWork);
			sendData.onOffControlChangeDataControlKey[frameWork] = [];
			$.each(item, (control, value) => {
				sendData.onOffControlChangeDataControlKey[frameWork].push(control);
			});
		});
	} else {
		sendData.onOffControlChangeDataCheck = "N";
	}
	policyCSComplianceRequestServer("save", sendData);
}

// 저장 콜백
function saveCallBack(fixData, data) {
	
	$.each(onOffFrameWorkChangeData, (frameWork, item) => {
		frameWorkList[frameWork].is_enabled = item;
	});
	onOffFrameWorkChangeData = {};
	onOffControlChangeData = {};
	
	$.each(controlAllControlData,(index,item) => {
		controlAllControlData[index].original = item.value;
		controlAllControlData[index].is_changed = 'F';
	});

	// 결과 알림
	if (data.body.result === "N") {
		cf_alert("저장", "저장에 실패하였습니다.");
	} else if(data.body.result === "Y") {
		cf_alert("저장", "저장 완료하였습니다.");
	}
}

// 다른 이름으로 저장
function saveAsPolicyComplianceScan() {
	var clusterId = $("#clusterListModal").val();
	var frameWorkName = $("#saveAsName").val().trim();
	var description = $("#saveAsDescription").val().trim();
	var version = $("#saveAsVersion").val().trim();

	// 체크
	if (modalSelectClusterFrameWorkNames.includes(frameWorkName)) {
		cf_alert("저장 실패", "해당 클러스터에 이미 있는 프레임 워크 이름입니다.");
		return false;
	} else if (frameWorkName == "") {
		cf_alert("저장 실패", "프레임 워크 이름을 입력해주세요.");
		return false;
	}

	if (description == "") description = "-";
	if (version == "") version = "-";
	else if (version.length >= 50) {
		cf_alert("저장 실패", "버전은 50글자 제한입니다.");
		return false;
	}


	// sendData 작성
	policyCSComplianceInit("sendData");
	sendData.type = "saveAs";
	sendData.saveAsCluster = clusterId;
	sendData.saveAsFrameWorkName = frameWorkName;
	sendData.saveAsDescription = description;
	sendData.saveAsVersion = version;
	sendData.saveAsControlUUID = [];
	if (searchMode) { // 검색일시 > 검색된 컨트롤 리스트를 보냄
		sendData.reSearch = "Y";
		$.each(corControlList, (index, item) => {
			if (!sendData.saveAsControlUUID.includes(item))
				sendData.saveAsControlUUID.push(item);
		})
	} else if (selectedData.frameWork === "allFrameWork") {// 전체 프레임 워크일때 > 클러스터 아이디를 보냄
		sendData.reSearch = "N";
		sendData.allFrameWork = "Y";
		sendData.cluster_uuid = selectedData.cluster;
	} else { // 단일 프레임 워크 일때 > 프레임워크 아이디를 보냄
		sendData.reSearch = "N";
		sendData.allFrameWork = "N";
		sendData.baseFrameWorkId = selectedData.frameWork;
	}

	policyCSComplianceRequestServer("save", sendData);
}

// 다른 이름으로 저장 콜백
function saveAsCallBack(fixData, data) {
	// 이미 있는 이름에 추가
	modalSelectClusterFrameWorkNames.push(fixData.saveAsFrameWorkName);
	// 모달창 닫기
	closePolicyComplianceScanModal()

	// 결과 알림
	if (data.body.result === "N") cf_alert("다른이름으로 저장", "이미 존재하는 프레임워크 이름입니다.");
	else {
		cf_alert("다른이름으로 저장", "저장 완료하였습니다.");
	}

	// 초기화
	getFrameWorkList(selectedData.cluster);
}

// import 콜백
function importCallBack(fixData, data) {
	if (data.body.result === "N") cf_alert("추가 실패", data.body.contents);
	else {
		cf_alert("추가 성공", "컨트롤을 추가하였습니다.");
		selectFrameWork(fixData.frameWorkId);
	}

}

/**
 * 조회 관련 함수들
 */
// 클러스터 받아오는 함수
function getClusterList() {
	// 초기화
	policyCSComplianceInit("cluster");

	// 서버에 보낼 데이터 세팅
	sendData.type = "cluster";
	policyCSComplianceRequestServer("get");
}
// 클러스터 콜백 함수
function getClusterListCallBack(fixData, data) {
	if (data.length != 0) {
		var clusterIdSelect = "";
		$.each(data, function(index, item) {
			if (index === 0) clusterIdSelect = item.cluster
			$('#clusterList').append("<option value='" + item.cluster + "'>" + item.cluster_name + "</option>");
			$('#clusterListModal').append("<option value='" + item.cluster + "'>" + item.cluster_name + "</option>");
		});

		selectedData.cluster = clusterIdSelect;
		$("#clusterList").val(clusterIdSelect).niceSelect("update");
		getFrameWorkList(clusterIdSelect);
	} else {	// 클러스터가 존재하지 않을시
		$('#clusterList').append("<option>Doesn't exist</option>");
		$("#clusterList").niceSelect("update");
	}
}

// 프레임 워크 받아오는 함수
function getFrameWorkList(cluster) {
	// 초기화 및 설정
	policyCSComplianceInit("frameWork");

	// 모달창 업데이트
	$("#clusterListModal").val(cluster).niceSelect("update");

	selectedData.cluster = cluster;
	sendData.type = "frameWork";
	sendData.cluster_uuid = cluster;
	policyCSComplianceRequestServer("get");
}
// 받아온 프레임 워크 콜백 함수
function getFrameWorkListCallBack(fixData, data) {
	var frameWorkIdSelect = "";
	if(data.length>0){
		$("#frameWorkList").val('NONE').attr("disabled", false);
		$("#reSearchText").attr("disabled", false);
		$(".btn.serch").attr("onclick", "reSearchGroupOrControls();");
		$("#complianceSaveBtn").attr("href", "javascript:savePolicyComplianceScan();");
		$("#complianceSaveAsBtn").attr("href", "javascript:saveAsPolicyComplianceScan();");
		
		$.each(data, (index, item) => {
			modalFrameWorkNamePush(item.name);
			$('#frameWorkList').append("<option value='" + item.id + "'>" + item.name + "</option>");

			if (index === 0) frameWorkIdSelect = item.id;

			frameWorkList[item.id] = {
				id: item.id,
				name: item.name,
				version: item.version,
				description: item.description,
				//2023-10-19 is_user_enabled는 all control select로 기능 변경
				is_enabled: item.is_user_enabled ? 'T' : 'F',
				type: item.type
			}
			
			// 컨트롤 all 컨트롤러데이터
			controlAllControlData[item.id]={
				original: item.is_user_enabled ? 'T' : 'F',
				is_changed: 'F',
				value:item.is_user_enabled ? 'T' : 'F'
			}
			
		});

	selectedData.frameWork = frameWorkIdSelect;
	$("#frameWorkList").val(frameWorkIdSelect).niceSelect("update");
	selectFrameWork(frameWorkIdSelect);
	}else{
		// 프레임 워크가 없을때. //disabled
		$('#frameWorkList').append("<option value='NONE'>활성화 프레임워크 없음</option>");
		$("#frameWorkList").val('NONE').attr("disabled", true);
		$("#reSearchText").attr("disabled", true);
		$(".btn.serch").attr("onclick", "");
		$("#complianceSaveBtn").attr("href", "#");
		$("#complianceSaveAsBtn").attr("href", "#");
		$("#frameWorkList").val('NONE').niceSelect("update");
		cf_alert("알림", "스캔 가능한 활성화 프레임워크가 없습니다.");
	}
}

// 컨트롤 리스트 콜백
function getControlListCallBack(fixData, data) {
	var keyWord;
	if (fixData.keyWord) keyWord = fixData.keyWord;

	if (fixData.allFrameWork === "Y") {
		$.each(data.body, (index, item) => {

			if (searchMode && item.controlList.length !== 0) {
				$("#slideButton" + index).trigger("click");
				$("#" + index + "_BOX").show();
			}
			groupControlDisplayManager(index, item, keyWord);
			$("span").removeClass("policy_cs_compliance_scan_group_seleted");

		});
	} else {// 단일 프레임 워크
		if (searchMode) {
			$("#" + fixData.frameWorkId + "_BOX").show();
		}
		groupControlDisplayManager(fixData.frameWorkId, data.body, keyWord);
	}
}
// 그룹과 컨트롤 디스플레이 매니저
function groupControlDisplayManager(frameWorkId, data, keyWord) {
	var contents;
	if (data.groupList || data.group === "NONE")
		$("#slideButton" + frameWorkId).trigger("click");
	if (data.groupList) { // 그룹 정보가 있을때!
		var groupBoxHeight = 0;
		var userHeight = (document.body.clientHeight) * 57 / 100;
		var indexZeroGroupId = pageView.groupFrame(data.groupList, frameWorkId, keyWord, contents, data.customNullGroupList);
		groupBoxHeight = document.getElementById(frameWorkId + "GroupBox").offsetHeight;
		if (groupBoxHeight < userHeight) {
			$("#" + frameWorkId + "GroupBox").css("height", userHeight);
			$("#controlListBox" + frameWorkId).css("height", userHeight);
			$("#" + frameWorkId + "GroupBox").css("max-height", userHeight);
		} else {
			$("#controlListBox" + frameWorkId).css("height", groupBoxHeight);
			$("#" + frameWorkId + "GroupBox").css("max-height", groupBoxHeight);
		}
		if (selectedData.frameWork === "allFrameWork") $("#slideButton" + frameWorkId).trigger("click");
		// 그룹 클릭 // data.controlList
		selectGroup(indexZeroGroupId, indexZeroGroupId.replaceAll("\\.", "_") + "_" + frameWorkId, frameWorkId, null, keyWord, contents);


	} else if (data.group === "NONE") {
		if (selectedData.frameWork === "allFrameWork") $("#slideButton" + frameWorkId).trigger("click");
		pageView.setGroupNone(frameWorkId);
		$("#controlListBox" + frameWorkId).html(pageView.controlFrame(data.controlList, frameWorkId, keyWord, contents, "groupNone"));
		//$("#policy_cs_compliance_sub_bar_side").css("height", document.getElementById("policy_cs_compliance_sub_bar_center").clientHeight);

	} else {// 그룹이 이미 지정되어 받은 데이터에서 그룹 정보가 없을때. 또는 그룹이 NONE일때
		$("#controlListBox" + frameWorkId).html(pageView.controlFrame(data.controlList, frameWorkId, keyWord, contents));
	}

	if (searchMode) {
		$.each(slideControlOpenArrayForSearch, (index, item) => {
			if (!slideDisplay.displayViewState[item]) slideDisplay.onOff(item, 'fast');
		});
	}
	slideControlOpenArrayForSearch = [];
}

// 검색시 처음에 실행되는 메소드
function getReSearchCallBack(fixData, data) {
	// 이전 검색 결과 초기화
	corControlList = [];
	corGroupList = {};

	// 전달할 데이터
	var corDatas = {
		corControlList: [],
		corGroupList: {},
	}


	if (fixData.allFrameWork === "Y") { // 전체 프레임 워크
		$.each(data.body, (uuid, item) => {
			// 컨트롤 리스트 입력
			$.each(item.corControlList, (name, value) => {
				if (!corControlList.includes(value.control_uuid)) {
					corDatas.corControlList.push(value.control_uuid);
				}
			});
			corDatas.corGroupList[uuid] = [];
			// 그룹 리스트 입력
			$.each(item.corGroupList, (name, value) => {
				corDatas.corGroupList[uuid].push(value.id);
			});
		});
	} else { // 단일 프레임 워크
		// 컨트롤 리스트 입력
		$.each(data.body.corControlList, (index, item) => {
			corDatas.corControlList.push(item.control_uuid);
		});

		// 그룹 리스트 입력
		corDatas.corGroupList[fixData.frameWorkId] = [];
		$.each(data.body.corGroupList, (index, item) => {
			corDatas.corGroupList[fixData.frameWorkId].push(item.id);
		});
	}

	selectFrameWork(fixData.frameWorkId, fixData.keyWord, corDatas);
}

/**
 * 데이터 선택 관련 함수들
 */
// 데이터 변경사항 체크
function requestList(value, name) {
	if (Object.keys(onOffControlChangeData).length || Object.keys(onOffFrameWorkChangeData).length) {
		swal("확인", " 변경 사항이 적용되지 않았습니다. 이동하십니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(willChange => {
			if (willChange) {
				onOffControlChangeData = {};
				onOffFrameWorkChangeData = {};
				requestListInterChange(value, name);
			}
			else if (name == "cluster") $("#clusterList").val(selectedData.cluster).niceSelect("update");
			else if (name == "frameWork") $("#frameWorkList").val(selectedData.frameWork).niceSelect("update");
		});
	} else {
		requestListInterChange(value, name);
	}

}
// 확인 후 본래 도착지로 이동
function requestListInterChange(value, name) {
	if (name == "cluster") getFrameWorkList(value);
	else if (name == "frameWork") selectFrameWork(value);
}
// 프레임 워크 선택
function selectFrameWork(frameWorkId, keyWord, fixData) {
	$.each(controlAllControlData,(index,item)=>{
		if(item.is_changed==="T"){
			controlAllControlData[index].value = item.original;
			controlAllControlData[index].is_changed = 'F';
		}
	});

	
	var allFrameWork = 0;
	policyCSComplianceInit("frameWorkChange");
	if (keyWord) {
		sendData.keyWord = keyWord;
		$("#reSearchText").val(keyWord);
	}
	// 선택 데이터 전역으로 선언
	selectedData.frameWork = frameWorkId;
	sendData.type = "control";
	sendData.reSearch = "N";
	sendData.group = "PASS";
	if (fixData) {
		// 초기화하고 나서 데이터가 있으면 추가하는 방식 사용
		corControlList = fixData.corControlList;
		corGroupList = fixData.corGroupList;
		// 검색 일치 그룹이 있다면 검색 모드로 변경
		searchMode = true;
		sendData.getGroupInfo = "Y";
	} else {
		sendData.getGroupInfo = "N";
	}


	if (frameWorkId == "allFrameWork") {
		allFrameWork = 1;
		sendData.allFrameWork = "Y";

		// 전체 데이터 일때. -> append
		sendData["frameWorkIdList"] = [];
		$.each(frameWorkList, (index, item) => {
			viewFraneWorkInfo(item.id, allFrameWork);
			sendData.frameWorkIdList.push(item.id);
		});
	} else {
		// 개별 데이터 일때
		viewFraneWorkInfo(frameWorkId, allFrameWork);
		sendData.allFrameWork = "N";
		sendData.frameWorkId = frameWorkId;
	}

	// 데이터 요청
	policyCSComplianceRequestServer("get", sendData);
}

// 그룹 선택
function selectGroup(groupId, groupCSSId, frameWorkId, groupNull, keyWord, contents) {
	$("span").removeClass("policy_cs_compliance_scan_group_seleted");
	$("." + groupCSSId).addClass("policy_cs_compliance_scan_group_seleted");
	
	//2024-01-04 퍼블참고 
	$(".policy_cs_compliance_div.group>ul>li").removeClass("selectOK");
	$("." + groupCSSId).parents().addClass("selectOK");



	//  == Y 

	// 데이터 초기화
	policyCSComplianceInit("sendData");
	// 보낼 데이터 세팅
	sendData.type = "control";
	sendData.reSearch = "N";
	sendData.frameWorkId = frameWorkId;
	if (groupNull !== "Y") sendData.group = groupId;
	else sendData.group = "getNull";
	sendData.allFrameWork = "N";
	// 검색시
	if (keyWord && keyWord !== "") {
		sendData.keyWord = keyWord;
		var depth = groupId.split('.').length - 1;
		var addGroupId = groupId;
		sendData.corGroupList = [];
		// 선택한 그룹이 검색어에 걸렸나?
		if (corGroupList[frameWorkId].includes(groupId)) {
			sendData.reSearchControl = "Y";
			sendData.corGroupList.push(groupId);
		}

		// 선택한 그룹의 부모 그룹중 검색어에 걸렸나?
		for (var i = 0; i < depth; i++) {
			addGroupId = addGroupId.substr(0, addGroupId.lastIndexOf('.'));
			if (corGroupList[frameWorkId].includes(addGroupId)) {
				sendData.reSearchControl = "Y";
				sendData.corGroupList.push(addGroupId);
			}
		}

		// 선택한 그룹의 자식 그룹중 검색어에 걸렸나?
		if (corGroupList[frameWorkId]) {
			$.each(corGroupList[frameWorkId], (index, item) => {
				var reversGroupDepth = item.split('.').length - 1;
				var reversGroupId = item;

				for (var i = 0; i < reversGroupDepth; i++) {
					reversGroupId = reversGroupId.substr(0, reversGroupId.lastIndexOf('.'));
					if (groupId === reversGroupId && !sendData.corGroupList.includes(item)) {
						sendData.reSearchControl = "Y";
						sendData.corGroupList.push(item);
					}
				}
			});
		}


	}
	// 데이터 요청
	policyCSComplianceRequestServer("get", sendData);
}
// 프레임 워크 Onoff변경
function onOffFrameWorkChange(frameWorkId) {
	var oldFrameWorkState = controlAllControlData[frameWorkId].value;
	var newFrameWorkState = "";
	controlAllControlData[frameWorkId].is_changed = "T";
	
	if (oldFrameWorkState === "T") {
		newFrameWorkState = "F";
		controlAllControlData[frameWorkId].value = "F";
		$(".swith-able-"+frameWorkId).addClass("onoff_switch_is_not_active");
		$(".swith-able-"+frameWorkId).removeClass("onoff_switch_is_active");
		// 클릭 이벤트 후 disabled 처리 // $('#ckBox').is(':checked');
		
		$.each($(".swith-able-box-"+frameWorkId),(index,item) =>{
			if($(item).is(':checked')){
				$(item).trigger("click");
			}
		});
		$(".swith-able-box-"+frameWorkId).attr("disabled",true);
	}else{
		newFrameWorkState = "T";
		controlAllControlData[frameWorkId].value = "T";
		$(".swith-able-"+frameWorkId).addClass("onoff_switch_is_active");
		$(".swith-able-"+frameWorkId).removeClass("onoff_switch_is_not_active");
		// disabled 해제후 클릭처리
		$(".swith-able-box-"+frameWorkId).attr("disabled",false);
		// disable 해제후 클릭처리 // $('#ckBox').is(':checked');
		$.each($(".swith-able-box-"+frameWorkId),(index,item) =>{
			if(!$(item).is(':checked')){
				$(item).trigger("click");
			}
		});
		$(".swith-able-box-"+frameWorkId).attr("value","on");
	} 
	
	// 전체를 선택하는 순간 기존 on/off 처리된 데이터는 init
	onOffControlChangeData[frameWorkId]={};
	onOffFrameWorkChangeData[frameWorkId] = newFrameWorkState;
	
	// 한번 이라도 실행이 되었는가?
	controlAllControlData[frameWorkId].is_changed = "T";
}

// 컨트롤 onOff 변경
function onOffControlChange(frameWorkId, controlId, thiz) {
	var newControlState = "";
	
	if (!onOffControlChangeData[frameWorkId]) onOffControlChangeData[frameWorkId] = {};
	
	if(thiz.value==="on"){
		$(thiz).attr("value","off");
		newControlState="F";
	}else{
		$(thiz).attr("value","on");
		newControlState="T";
	}

	
	if(onOffControlChangeData[frameWorkId][controlId]){
		delete onOffControlChangeData[frameWorkId][controlId];
		if (Object.keys(onOffControlChangeData[frameWorkId]).length === 0) delete onOffControlChangeData[frameWorkId];
	}else{
		onOffControlChangeData[frameWorkId][controlId]=newControlState;
	}
}
// 검색
function reSearchGroupOrControls() {
	var keyWord = $("#reSearchText").val().trim();
	if (keyWord.length < 1) {

		return requestList(selectedData.frameWork, 'frameWork');
	}

	// send 데이터 초기화
	policyCSComplianceInit("sendData");
	searchMode = true;

	// 보낼 데이터 세팅
	sendData.type = "reSearch";
	sendData.reSearch = "Y";
	sendData.group = "NONE";
	sendData.keyWord = keyWord;
	sendData.frameWorkId = selectedData.frameWork;
	sendData.getGroupInfo = "Y";

	if (selectedData.frameWork !== "allFrameWork") {
		sendData.allFrameWork = "N";
	} else {
		sendData.allFrameWork = "Y";
		sendData["frameWorkIdList"] = [];
		$.each(frameWorkList, (index, item) => {
			sendData.frameWorkIdList.push(item.id);
		});

	}
	// 그룹 정보를 가져오도록
	searchGetGroup = true;
	// 데이터 요청
	policyCSComplianceRequestServer("get", sendData);

}

/**
 * Import Export관련 함수들
 */
// 만료 날짜값을 입력받아 년월일시분초를 정할수 있게 수정된 setCookie 함수 > 기존 함수는 날짜만 추가가능
function setCookieExpiresCustomDate(name, value, expires) {	//쿠키 쓰기
	var curCookie;
	if (expires) {
		var today = expires;
		/*curCookie = name + "=" + escape(value) + "; expires=" + today.toGMTString()+"; path=/"+_WEBCONTENTNAME+";";*/
		curCookie = name + "=" + escape(value) + "; expires=" + today.toGMTString() + "; path=/;";
	} else {
		/* curCookie = name + "=" + escape(value)+"; path=/"+_WEBCONTENTNAME+";";*/
		curCookie = name + "=" + escape(value) + "; path=/;";
	}
	document.cookie = curCookie;
}

// 컨트롤 Export
function exportControls(controlId, base, controlUUID) {
	// 쿠키에 저장 > 만료일자 마지막 컨트롤 추가로 부터 10분
	var expDate = new Date();
	expDate.setMinutes(expDate.getMinutes() + 10);
	var controlIdArray = [];
	var newControlIdArray = [];

	//cf_delCookie("policyComplianceScanKey");


	// 기존 쿠키가 있을시 문자열, 배열 변환
	if (cf_getCookie("policyComplianceScanKey") && cf_getCookie("policyComplianceScanKey") !== "") {
		controlIdArray = cf_getCookie("policyComplianceScanKey").split(",");
		$.each(controlIdArray, (index, item) => {
			if (cf_getCookie("policyComplianceScanValue_" + item) && cf_getCookie("policyComplianceScanValue_" + item) !== "")
				newControlIdArray.push(item);
		});
		controlIdArray = newControlIdArray;
	}

	if (!controlIdArray.includes(controlUUID)) {
		controlIdArray.push(controlUUID);
	}

	// 컨트롤 아이디 추가 및 쿠키에 저장 
	setCookieExpiresCustomDate("policyComplianceScanKey", controlIdArray, expDate);
	setCookieExpiresCustomDate("policyComplianceScanValue_" + controlUUID, '{"id":"' + controlId + '","base":"' + base + '"}', expDate);

	viewSubSideBarContents(controlIdArray);
}

// 삭제
function exportDeleteControl(value) {
	// 뷰
	viewSubSideBarContents(controlIdArray);

	// 기존 쿠키가 있을시 문자열, 배열 변환
	if (cf_getCookie("policyComplianceScanKey") && cf_getCookie("policyComplianceScanKey") !== "") {
		var controlIdArray = [];
		controlIdArray = cf_getCookie("policyComplianceScanKey").split(",");
		if (controlIdArray.includes(value)) {
			controlIdArray.splice(controlIdArray.indexOf(value), 1);
			// 쿠키에 저장 > 만료일자 마지막 컨트롤 추가로 부터 10분
			var expDate = new Date();
			expDate.setMinutes(expDate.getMinutes() + 10);
			setCookieExpiresCustomDate("policyComplianceScanKey", controlIdArray, expDate);
			// 실제값 삭제
			cf_delCookie("policyComplianceScanValue_" + value);
			// 뷰
			viewSubSideBarContents(controlIdArray);
		}
	}
}

// 정책에 컨트롤 추가
function importControls(value) {
	var frameWorkId = selectedData.frameWork;
	if (frameWorkId === "allFrameWork" || frameWorkList[frameWorkId].type === "DEFAULT") {
		cf_alert("추가 실패", "전체 프레임워크, DEFAULT 프레임 워크에는 컨트롤 추가가 불가능합니다.");
		return false;
	}


	// sendData
	policyCSComplianceInit("sendData");
	sendData.type = "import";
	sendData.frameWorkId = frameWorkId;
	sendData.controlUUID = value;
	sendData.cluster_uuid = selectedData.cluster;

	policyCSComplianceRequestServer("save", sendData);
}

/**
 * 뷰 관련 함수들
 */
// 삼점 버튼 클릭
function importControlMenu() {
	if ($(".policy_cs_compliance_sub_bar").hasClass("on") === true) {
		$(".policy_cs_compliance_sub_bar.side").hide("slide", { direction: "right" }, 100);
		$(".policy_cs_compliance_div>.top_ul").removeClass("on");
		$(".policy_cs_compliance_sub_bar").removeClass("on");
	} else {

		// 쿠키 읽어서 띄우기 
		if (cf_getCookie("policyComplianceScanKey") && cf_getCookie("policyComplianceScanKey") !== "") {
			var controlIdArray = cf_getCookie("policyComplianceScanKey").split(",");
			var newControlIdArray = [];
			$.each(controlIdArray, (index, item) => {
				if (cf_getCookie("policyComplianceScanValue_" + item) && cf_getCookie("policyComplianceScanValue_" + item) !== "")
					newControlIdArray.push(item);
			});
			// view
			viewSubSideBarContents(newControlIdArray);
			// 키값 새로 저장
			var expDate = new Date();
			expDate.setMinutes(expDate.getMinutes() + 10);
			setCookieExpiresCustomDate("policyComplianceScanKey", newControlIdArray, expDate);
		}
		$(".policy_cs_compliance_sub_bar.side").show("slide", { direction: "right" }, 100);
		$(".policy_cs_compliance_div>.top_ul").addClass("on");
		$(".policy_cs_compliance_sub_bar").addClass("on");
		//$("#policy_cs_compliance_sub_bar_side").css("height", document.getElementById("policy_cs_compliance_sub_bar_center").clientHeight);
	}
}
// 현재 복사한 컨트롤들 display
function viewSubSideBarContents(array) {
	var values = {};
	var frame = "";
	$(".policy_cs_compliance_sub_bar.contents>ul").html("");
	$.each(array, (index, item) => {
		values = JSON.parse(cf_getCookie("policyComplianceScanValue_" + item));
		frame = "<li> "
			+ "<ul> "
			+ "<li><div title=\"Control Import\" onclick=\"importControls('" + item + "');\" class=\"policy_cs_compliance import_icon\"></div></li> "
			+ "<li title=\"" + values.base + "\">" + values.id + "</li> "
			+ "<li><div onclick=\"exportDeleteControl('" + item + "');\" class=\"close_icon policy_cs_compliance\"></div></li></ul></li> ";
		$(".policy_cs_compliance_sub_bar.contents>ul").append(frame);
	});
}
// 프레임 워크 정보 display
function viewFraneWorkInfo(frameWorkId, allCheck) {
	if (allCheck === 0) $("#frameWorkListBox").html(pageView.centerFrame(frameWorkList[frameWorkId]));
	else $("#frameWorkListBox").append(pageView.centerFrame(frameWorkList[frameWorkId]));

	if (searchMode) $("#" + frameWorkId + "_BOX").hide();
	//$("#policy_cs_compliance_sub_bar_side").css("height", document.getElementById("policy_cs_compliance_sub_bar_center").clientHeight);
}
// 페이지 뷰를 처리하는곳
var pageView = {
	centerFrame: function(target) {
		frameWorkId = target.id
		frameWorkName = target.name;
		frameWorkVersion = target.version;
		frameWorkDescription = target.description;
		if (target.is_enabled == "T") {
			frameWorkChecked = "checked";
		} else {
			frameWorkChecked = "";
		}
		// 변경 데이터가 있다면 변경데이터로 넣어주기
		if (controlAllControlData[frameWorkId].original === "T") frameWorkChecked = "checked";
		else if (controlAllControlData[frameWorkId].original === "F") frameWorkChecked = "";

		var frame = "<div id=\"" + frameWorkId + "_BOX\">"
			+ "<table style=\"width: 100%;\">"
			+ "<thead>"
			+ "<tr>"
			+ "<td colspan=\"3\">"
			+ "<div id=\"slideButton" + frameWorkId + "\" title=\"Detail View\" class=\"view_hide_btn_icon policy_cs_compliance left_side title " + frameWorkId + "\">"
			+ "</div>"

			+ "<div class=\"policy_cs_compliance_div title\" onclick=\"policyComplianceSlideDisplay('" + frameWorkId + "','fast','" + frameWorkId + "')\">"
			+ "<ul>"
			
			+ "<li class=\"kebabMenuStyleUlParentLi\">"
			/*2024-01-17 펼침 아이콘삭제 + "<ul class=\"kebabMenuStyleUl\">"
			+ "<li onclick=\"importControlMenu();\">.</li>"
			+ "<li onclick=\"importControlMenu();\">.</li>"
			+ "<li onclick=\"importControlMenu();\">.</li>"
			+ "</ul>"*/
			
			+ "</li>"
			

			+ "<li class=\"onCkeck_wrap\">"
			
			+ "</li>"
			+ "<li class=\"framework_name\">" + frameWorkName + "</li>"
			+ "<li class=\"sub first\"><strong>Description :</strong> "
			+ frameWorkDescription
			+ "</li>"
			+ "<li class=\"sub\"><strong>Version : </strong>"
			+ frameWorkVersion
			+ "</li>"
			+ "</ul>"
			+ "</div>"

			/**s 2024-01-17: 토글버튼 위치 교체**/
			+ "<label class=\"switch-button\"> <input "
			+ "id=\"policy_isactive\" type=\"checkbox\" "
			+ frameWorkChecked
			+ " onchange=\"onOffFrameWorkChange('" + frameWorkId + "');\"> <span "
			+ "class=\"onoff-switch\"></span>"
			+ "</label>"
			/**e 2024-01-17 : 토글버튼 위치 교체**/
			+ "</td>"
			+ "</tr>"
			+ "</thead>"
			+ "<tbody id=\"" + frameWorkId + "\" style=\"display: none;\">"
			+ "<tr>"
			+ "<td class=\"cs_compliance_scan_policy_groupBigBox " + frameWorkId + "\" style=\"width: 30%;\">"
			+ "<div id=\"" + frameWorkId + "GroupBox\" class=\"policy_cs_compliance_div group\">"
			+ "<ul id=\"" + frameWorkId + "GroupBoxUl\"></ul>"
			+ "</div>"
			+ "</td>"
			+ "<td class=\"cs_compliance_scan_policy_groupBigBox " + frameWorkId + "\">"
			+ "<div style=\"width: 10px;\"></div>"
			+ "</td>"
			+ "<td style=\"width: 70%;\">"
			+ "<div id=\"controlListBox" + frameWorkId + "\" class=\"policy_cs_compliance_div contain_box\">"
			+ "</div>"
			+ "</td>"
			+ "</tr>"
			+ "</tbody>"
			+ "</table>"
			+ "</div>";
		// 리턴
		return frame;
	},
	groupFrame: function(groupList, frameWorkId, keyWord, contents, customNullGroupList) {
		var numbering = [];
		var keyWordCheck = '';
		var depthMove = false;
		var indexZeroId = "";
		var numberingView = "";
		var icon = "";
		var defaulMargin = 30;
		var iconMargin = 0;
		var spanLineHight = " line-height:18px; ";
		//var baseFrameWorkName = "";
		if (!keyWord || keyWord === '') keyWord = '';
		else {
			contents = "<span class=\'polocy_cs_compliance_scan_searchTargets\'>" + keyWord + "</span>";
			keyWordCheck = ", '" + keyWord + "'";
		}

		if (!contents) contents = '';
		if (frameWorkList[frameWorkId].type === "CUSTOM") {
			iconMargin = 35;

			$.each(customNullGroupList, (index, item) => {
				groupList.push({ "id": item.id, "name": item.name, "base_framework_name": item.name, "groupNull": "Y" });
			});
		}

		$.each(groupList, (index, item) => {
			if (item.groupNull !== "Y") {
				numberingView = item.id.substr(item.id.lastIndexOf("-") + 1);
				numberingView += ". ";
				item.groupNull = "N";
			} else {
				numberingView = "1. ";
			}
			if (item.group_id) {	// n 뎁스
				depthMove = true;
				item.idCSS = item.id.replaceAll("\\.", "_") + "_" + frameWorkId;
				item.groupIdCSS = item.group_id.replaceAll("\\.", "_") + "_" + frameWorkId;

				// 몇 뎁스인가?
				var depth = item.id.split('.').length - 1;
				var marginLeft = "";
				var displayBlock = "";

				if (depth === 1) {
					marginLeft = " margin-left:" + (defaulMargin + iconMargin) + "px; ";
				} else {
					marginLeft = " margin-left:" + defaulMargin + "px; ";
					displayBlock = " display:block; ";
				}



				// 현재 뎁스 있는지 확인 및 늘림
				if (!numbering[depth]) {	// 현재 뎁스가 없다면?
					numbering[depth] = 1;
					$("#" + item.groupIdCSS).append("<ul style=\"margin-top: 10px; " + marginLeft + "\" id=\"" + item.groupIdCSS + "Ul\"></ul>");
				}
				else numbering[depth]++;
				// 하위 뎁스 초기화
				numbering = numbering.slice(0, depth + 1);

				$("#" + item.groupIdCSS + "Ul").append("<li style=\"margin-top:10px;\"  id=\"" + item.idCSS + "\" ><span style=\" "+spanLineHight+displayBlock+" \"  class=\"" + item.idCSS + "\" onclick=\"selectGroup('" + item.id + "','" + item.idCSS + "','" + frameWorkId + "' , null " + keyWordCheck + ")\">" + numberingView + item.name.replaceAll(keyWord, contents) + "</span></li>")


			} else { //0뎁스

				// 사용자 정일일때 아이콘
				if (frameWorkList[frameWorkId].type === "CUSTOM") {
					icon = complianceBaseLabelIcon(item.base_framework_name);
				}

				// 뎁스 이동시
				if (depthMove) {
					numbering = numbering.slice(0, 1);
					depthMove = false;
				}

				// 넘버링
				if (!numbering[0]) numbering[0] = 1;
				else numbering[0]++;
				// css용 id
				item.idCSS = item.id.replaceAll("\\.", "_") + "_" + frameWorkId;
				if (index === 0) indexZeroId = item.id;
				$("#" + frameWorkId + "GroupBoxUl").append("<li id=\"" + item.idCSS + "\" ><span style=\"font-weight:bold; "+spanLineHight+"\" class=\"" + item.idCSS + "\" onclick=\"selectGroup('" + item.id + "','" + item.idCSS + "','" + frameWorkId + "', '" + item.groupNull + "' " + keyWordCheck + ")\">" + icon + numberingView + item.name.replaceAll(keyWord, contents) + " </span></li>");
			}
		});

		return indexZeroId;
	},
	setGroupNone: function(target_class) {
		$(".cs_compliance_scan_policy_groupBigBox." + target_class).addClass("on");
	},

	controlFrame: function(controlList, frameWorkId, keyWord, contents, noneType) {
		var frame = "";
		if (!keyWord || keyWord === '') keyWord = '';
		else {
			contents = "<span class=\'polocy_cs_compliance_scan_searchTargets\'>" + keyWord + "</span>";
		}
		if (!contents) contents = '';
		if (noneType === "groupNone") {
			var userHeight = (document.body.clientHeight) * 57 / 100;
			$("#controlListBox" + frameWorkId).css("height", userHeight);
		}

		// 컨트롤 재정렬
		controlList.sort(function(targetA, targetB) {
			return policyCsComplianceControlSorting(targetA, targetB);
		});

		$.each(controlList, (index, item) => {
			var display = "";
			var displayClass = "";
			var frameWork_itemId = frameWorkId + "_" + item.control_uuid;
			var controlActive = "";
			var complianceBase = "";
			var description = "";
			var remediation = "";
			var baseLabelCSS = "";
			var controlIdTopMargin = "";
			var sideSlidebar = "";
			var sideName = "";
			var controlDetailSpanLineHeight = " line-height:18px; ";
			var checkBoxDisabled = "";
			var checkBoxCSS = "container_security_switch onoff_switch_is_active";
			var controlValue="";
			var controlViewOnOff="";
			
			// DB에서 가져온 데이터 item.is_enabled
			// 현재 유저가 변경한 데이터 = onOffChangeData[framework][control_uuid]안에 존재
			// 전체 프레임 워크를 변경한 플래그는? controlAllControlData[frameWorkId].is_changed 안에 존재
			
			// 가장 먼저 확인할 플래그 전체 컨트롤을 변경했나?
			if(controlAllControlData[frameWorkId].is_changed=="T"){
				if(controlAllControlData[frameWorkId].value==="T" && onOffControlChangeData[frameWorkId][item.control_uuid]==="F"){
					// 전체 켰는데 유저가 끈데이터 일때.
					controlViewOnOff = "F";
				}else if(controlAllControlData[frameWorkId].value==="T"){// 전체를 켰는데, 유저가 끈건 아닐때.
					controlViewOnOff = "T";
				}else{ // 전체 껐을때.
					controlViewOnOff = "F";
				}
			}else{// 전체 컨트롤 플래그 변경 안함
				// 유저가 해당 컨트롤을 변경했나?
				if(onOffControlChangeData[frameWorkId]&&onOffControlChangeData[frameWorkId][item.control_uuid]){
					// 해당 컨트롤을 변경 했을경우
					controlViewOnOff = onOffControlChangeData[frameWorkId][item.control_uuid];
				}else{ // 해당 컨트롤을 변경 안했을경우
					controlViewOnOff = item.is_enabled;
				}
			}
			
			// 실제 ON/OFF 처리
			if(controlViewOnOff==="T"){
				controlActive = " checked ";
				controlValue = "on";
			}else{//controlViewOnOff ==="F"
				controlActive = "";
				controlValue = "off";
			}
			
			
			
			if (slideDisplay.displayViewState[frameWork_itemId]) {
				display = " display: block; ";
				displayClass = " view_hide_active";
			}
			if (item.description) {
				description = " <li><div style=\"display:flex;\"><div style=\"flex-shrink:0\"><b>· Description:</b>&nbsp</div><div><span style=\""+controlDetailSpanLineHeight+"\">" + controlDetailParsing(item.description,keyWord, contents) + "</span></div></div> </li> ";
			}
			if (item.remediation) {
				remediation = " <li style=\"margin-top:10px;\"><div style=\"display:flex;\"><div style=\"flex-shrink:0\"> <b>· Remediation:</b>&nbsp</div><div title=\""+item.remediation.replaceAll("\\\\n", "&#10;").replaceAll("\\\. ", "\. &#10;")+"\"><span style=\""+controlDetailSpanLineHeight+"\">" + controlDetailParsing(item.remediation,keyWord, contents) + "</span> </div></div> </li> ";
			}
			if (!item.name) item.name = "";
			if (!item.severity) item.severity = "";
			// 변환
			complianceBase = item.base_name;

			if (frameWorkList[frameWorkId].type === "CUSTOM") {
				baseLabelCSS = "&nbsp;" + complianceBaseLabelIcon(complianceBase);
				/*2024-01-12 
				controlIdTopMargin = " style=\"margin-top: 10px;\" ";
				sideSlidebar = " style=\"right:-20px;\" ";
				sideName = " margin-left: 70px; ";*/
			}
			
			if(controlAllControlData[frameWorkId].value ==='F'){
				checkBoxDisabled = 'disabled';
				checkBoxCSS = 'container_security_switch onoff_switch_is_not_active';
			}

			frame += "<div class=\"policy_cs_compliance_div detail\"> "
				+ "<div class=\"title\"> "
				+ "<ul> "
				+ " <li class=\"icon\">" + baseLabelCSS + "</li> "
				+ "<li> "
				+ "<ul " + controlIdTopMargin + "> "
				+ "<li> "
				+ "<b>" + this.changeName(item.control_id, item.base_id).replaceAll(keyWord, contents) + "</b> "
				+ "</li> "
				+ " </ul> </li> "
				+ "<li><div class=\"severity_icon " + item.severity.toLowerCase() + "\"></div></li> "
				+ "<li class=\"onCkeck_wrap\"> "
				+ "<div> "
				+ "<label title=\"ON/OFF Control\" class=\"switch-button container_security_switch\"> <input "
				+ "id=\"policy_isactive\" class=\"swith-able-box-"+frameWorkId+"\" type=\"checkbox\" "+checkBoxDisabled+" " + controlActive + " "
				+ " value='"+controlValue+"' onchange=\"onOffControlChange('" + frameWorkId + "','" + item.control_uuid + "',this);\"> "
				+ "<span class=\"onoff-switch swith-able-"+frameWorkId+" "+checkBoxCSS+"\"></span> "
				+ "</label> "
				+ "</div> "
				+ "</li> "
				+ "<li class=\"export_icon_wrap\"> "
				+ "<div title=\"Control Export\" class=\"export_icon\" onclick=\"exportControls('" + this.changeName(item.control_id, item.base_id) + "', '" + complianceBase + "','" + item.control_uuid + "')\"></div>"
				+ "</li>"
				+ "</ul> <div class=\"icon_wrap\"> <div " + sideSlidebar + " title=\"Detail View\" "
				+ "class=\"view_hide_btn_icon_grey " + displayClass + " policy_cs_compliance detail  left_side " + frameWork_itemId + "\" "
				+ "onclick=\"slideDisplay.onOff('" + frameWork_itemId + "','middle')\"></div> "
				+ "</div> <div style=\"" + sideName + " \" > "
				+ "<span class=\"name\"> " + item.name.replaceAll(keyWord, contents) + " </span> "
				+ "</div> <div  style=\"" + sideName + display+" \" class=\"detail\" id=\"" + frameWork_itemId + "\" > "
				+ "<ul> " + description + remediation
				+ "</ul> </div> </div> </div> ";

			if (item.remediation && item.remediation.toLowerCase().search(keyWord.toLowerCase()) != -1) {
				slideControlOpenArrayForSearch.push(frameWork_itemId);
			} else if (item.description && item.description.toLowerCase().search(keyWord.toLowerCase()) != -1) {
				slideControlOpenArrayForSearch.push(frameWork_itemId);
			}

		});
		return frame;
	},
	changeName: function(target, baseId) {
		if (target[1] == "-") { //target[0] == "K" || target[0] == "D" || target[0] == "L"
			if (controlChangeNameLabel.includes(target[0])) {
				target = target.substr(2);
			}
		} else if (controlChangeNameLabelFromFrameworkId[baseId]) {
			target = target.substr(controlChangeNameLabelFromFrameworkId[baseId].cut);
			target = controlChangeNameLabelFromFrameworkId[baseId].rename + target;
		}
		return target;
	}
}
// 컨트롤 상세내용 파싱
function controlDetailParsing(source,keyWord, contents){
	source = source.replaceAll(keyWord, contents).replaceAll("\\\\n", "");
	source = source.replaceAll("\\\`\\\`\\\`", "").replaceAll("\\\. ", "\.<br/>");
	return source;
}

// 아이콘
function complianceBaseLabelIcon(complianceBase) {
	var baseLabelCSS = "";
	if (complianceBase === "" || !complianceBase) return baseLabelCSS;

	$.each(frameWorkBasedIcon, function(index, item) {
		if (complianceBase.toLowerCase().indexOf(index) !== -1) {
			baseLabelCSS = " <div class=\"" + item + "\"></div> ";
			return false;
		}
	});
	return baseLabelCSS;
}


/**
 * 모달 관련 함수들
 */
// 모달 > USER modal에 기생중 > but USER Modal과 display 및 객체는 분리
function closePolicyComplianceScanModal() {
	removeUserDim();
	$('#policyComplianceScan_modal').removeClass('open');
	$("#policyComplianceScan_modal").hide();
	var isVisible = $('#policyComplianceScan_modal').is(':visible');
	var modalLength = $('.modal:visible').length;

	if (isVisible) {
		if (modalLength > 1) {
			$('#policyComplianceScan_modal').fadeOut(250);
		} else {
			$('.dim').fadeOut(250);
		}
	}
}

// 클러스터별 프레임워크들 이름
function clusterChangePolicyComplianceScanModal(value) {
	var sendData = {
		"type": "frameWork",
		"cluster_uuid": value
	};
	cf_requestServer(_TR_POLICY_CS_COMPLIANCE_SEARCH, sendData, (data) => {
		data = data.body.resultData;
		modalSelectClusterFrameWorkNames = [];
		$.each(data, (index, item) => {
			modalSelectClusterFrameWorkNames.push(item.name);
		});
	});
}
// 모달창에서 선택한 클러스터의 이미 존재하는 이름들
function modalFrameWorkNamePush(name) {
	modalSelectClusterFrameWorkNames.push(name);
}