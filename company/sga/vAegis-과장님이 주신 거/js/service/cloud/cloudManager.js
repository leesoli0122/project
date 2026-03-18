var selectData = {};
var treeNodeMap = {};
var dataMap = {};
var saveData = {};
var addDepth2Group = {};	// 1뎁스를 클릭시 2뎁스 그룹을 만들기위한 지정
var clickGroupId = ""; // 마지막으로 클릭한 그룹 아이디
var clickGroupType = ""; // 마지막으로 클릭한 그룹 타입
var runMode = "";
var depthOpen = { // 페이지 진입 또는 트리를 다시 불러올시, open이 필요하다면, 현재 몇번째 뎁스까지 오픈했나?
	"depth0": true,
	"depth1": true,
	"depth2": true
};

// DB에 타입정보가 없기에 개발을 위해 임시로 TYPE 정보 맵핑
// 추가로 자식 그룹은 부모 그룹의 타입을 참조하여 추가됨
var typeTempData = {
	"G0000000000001": "HostSecurity",
	"G0000000000002": "Registry",
	"G0000000000003": "ContainerSecurity"
}

$(function() {
	selectGroupList();
	initAgent();
});

// info on 삭제
function infoViewClear() {
	// 현재 사용하지 않음
	$(".info").removeClass("on");
}

function selectGroupList() {
	var body = {};
	body['groupId'] = 'G0000000000000';
	body['depth'] = 'N_DEPTH';

	cf_requestServer(_TR_GROUP_SEARCH, body, lf_serviceCall800101CallBack);
}

function lf_serviceCall800101CallBack(data) {
	// 2023-06-20 로직 변경으로 인한 주석처리
	//$("#groupid").empty(); // 기존에 있던 그룹 목록을 지음(그렇지않으면 무한히 생김)		


	var dataList = data.body['ROOT']['childlist'];

	// Aegis 자산(클러스터)  그룹리스트에 추가
	$.each(dataList, function(index, item) {
		addGroupNode('Tree01', 'G0000000000000', item);
	});

	nodeOpen();

	/*	$.each(dataList, function(index, item) {
			$('#groupid').append("<option value='" + item['groupid'] + "'>" + item['groupname'] + "</option>");
		});*/

	$("#groupid").niceSelect("update");
	selectAgentList();
}

function nodeOpen() {
	var treeName = "Tree01";
	var openNodeTarget = "";

	// 루트 노드 오픈
	$('#' + treeName + ' .tree_wrap').jstree("open_node", "G0000000000000");

	switch (clickGroupType) {
		case "HostSecurity":
			if (treeNodeMap["Tree01_G0000000000001"]) {
				openNodeTarget = treeNodeMap["Tree01_G0000000000001"];
				$('#' + treeName + ' .tree_wrap').jstree("open_node", openNodeTarget);
			}
			break;
		case "Registry":
			if (treeNodeMap["Tree01_G0000000000002"]) {
				openNodeTarget = treeNodeMap["Tree01_G0000000000002"];
				$('#' + treeName + ' .tree_wrap').jstree("open_node", openNodeTarget);
			}
			break;
		case "ContainerSecurity":
			if (treeNodeMap["Tree01_G0000000000003"]) {
				openNodeTarget = treeNodeMap["Tree01_G0000000000003"];
				$('#' + treeName + ' .tree_wrap').jstree("open_node", openNodeTarget);
			}
			break;
		default: break;
	}

	// 클릭 그룹아이디가 빈값이 아닐때, 노드 오픈
	// TO DO 2뎁스 부터는 open_node가 실행되지 않음..
	if (clickGroupId != "" && treeNodeMap["Tree01_" + clickGroupId] && clickGroupId != "G0000000000001" && clickGroupId != "G0000000000002" && clickGroupId != "G0000000000003") {
		openNodeTarget = treeNodeMap["Tree01_" + clickGroupId];
		$('#' + treeName + ' .tree_wrap').jstree("open_node", openNodeTarget);
	}
}

function selectAgentList() {
	var body = {};
	// 2023-06-22 그룹 아이디 주석처리
	//body['groupId'] = 'G0000000000000';

	// groups 테이블 ROW 조회	
	// hardwares ROW 조회
	cf_requestServer(_TR_CLOUD_SERVER_STATUS, body, lf_serviceCall600072CallBack);

	// is_registry  ROW 조회 
	cf_requestServer(_TR_CLOUD_CONTAINER_SERVER_STATUS, null, lf_serviceCall600074CallBack);

	// cluster_info  ROW 조회
	cf_requestServer(_TR_CLUSTER_SEARCH, null, lf_serviceCall800140CallBack);

}


function lf_serviceCall600072CallBack(data) {
	var dataList = data.body.dataList;
	runMode = data.body.modeData;

	// 해당 콜백은 호스트 시큐리티 타입만 조회하기 때문
	var type = "HostSecurity";

	if (runMode == _DEVMODE) devGroupAdd();

	$.each(dataList, function(index, item) {
		//var groupPath = (item['grouppath'] + ':' + item['groupid']).split(':');
		// 데이터 타입 체크 문항 추가
		if (item["groupid"] != "G0000000000000" && typeTempData[item["groupid"]] == type) {
			addAgentNode('Tree01', item['groupid'], item);
		} else if (runMode == _DEVMODE) {
			dataCheckTypeGroupid(type, item);
		}
	});
	initGroupNode();
}



// 2023-06-19 [caegis] 추가되어 있는 부분 확인
function lf_serviceCall600074CallBack(data) {
	var dataList = data.body.dataList;
	// 해당 콜백은 레지스트리 콜백
	var type = "Registry";

	$.each(dataList, function(index, item) {
		// 기존 그룹패스 길이 2 이상은 결국 root 뎁스에 자산을 넣지 못하게 하기 위함이므로 아래와 같이 변경
		if (item["groupid"] != "G0000000000000" && typeTempData[item["groupid"]] == type) {
			addAgentNode('Tree01', item["groupid"], item); // groupPath[1]=REGISTRY=G0000000000003, item=data
		}
	});
	initGroupNode();
}

// containerSecurity 타입> 컨테이너 조회 callBack
function lf_serviceCall800140CallBack(data) {
	var dataList = data.body.dataList;
	var type = "ContainerSecurity";

	$.each(dataList, function(index, item) {
		if (item["groupid"] != "G0000000000000" && typeTempData[item["groupid"]] == type) {
			addAgentNode('Tree01', item["groupid"], item);
		}
	});
	initGroupNode();
}

function initGroupNode() {
	var treeName = 'Tree01';
	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=G0000000000000]'));
	if (!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if (!pNode) return false;

	var sel = pNode.id;

	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	if (sel) {
		var children = ref.get_node(sel).children;

		$.each(children, function(index, item) {

			var agentList = ref.get_node(item).children;
			var groupName = ref.get_node(item).text;
			var folderCount = 0;	// 폴더의 갯수
			var agentInchildrenFolder = 0;	// 2뎁스 폴더의 자산수

			$.each(agentList, function(index, depth2) {
				//자산의 폴더 갯수 구하기
				if (ref.get_node(depth2).type == "folder") {
					folderCount++;
					agentInchildrenFolder += ref.get_node(depth2).children.length;
					//2뎁스 폴더에도 자산수 구해와서 자산갯수 명시
					var groupNameDepth2 = ref.get_node(depth2).text;
					var sDepth2 = groupNameDepth2.lastIndexOf('(');
					if (sDepth2 > 0) {
						groupNameDepth2 = groupNameDepth2.substring(0, sDepth2)
					}
					// 2뎁스의 자산수를 명시
					groupNameDepth2 = groupNameDepth2 + '(' + ref.get_node(depth2).children.length + '대)';
					ref.rename_node(depth2, groupNameDepth2);
				}
			})

			var s = groupName.lastIndexOf('(');
			if (s > 0) {
				groupName = groupName.substring(0, s)
			}
			//뎁스(폴더)는 자산 갯수에서 제거
			groupName = groupName + '(' + (agentList.length - folderCount + agentInchildrenFolder) + '대)';
			ref.rename_node(item, groupName);
		});
	}
}

function addGroupNode(treeName, parentId, data) {
	var groupId;
	var groupName;
	if (data) {
		groupName = data['groupname'];
		groupId = data['groupid'];
	}

	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=' + parentId + ']'));
	if (!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if (!pNode) return false;

	var sel = pNode.id;
	sel = sel[0];

	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	var newNode = { "cloudid": groupId, "type": "folder", "state": "open" };

	sel = ref.create_node(pNode, newNode, "last", null);

	if (sel) {
		treeNodeMap[treeName + '_' + groupId] = sel;
		ref.rename_node(sel, groupName);
		dataMap[sel] = data;
	}





	// 만약에 data안에 2뎁스인 childlist가 존재하면, addGroupNode함수 재귀
	if (data['childlist']) {
		$.each(data['childlist'], function(index, item) {

			// 자식의 타입은 부모의 타입을 따라갑니다.
			typeTempData[item["groupid"]] = typeTempData[item["parentgroupid"]];

			// 자식 그룹도 자산을 추가할 수 있도록 설정
			$('#groupid').append("<option value='" + item['groupid'] + "'>" + item['groupname'] + "</option>");
			$("#groupid").niceSelect("update");

			// 여기서 그룹 아이디는 1뎁스의 그룹아이디 이므로 2뎁스에게는 부모 아이디
			addGroupNode('Tree01', groupId, item);

		});
	}
}


function addAgentNode(treeName, parentId, data) {
	var agentId = 'E0000000000000';
	var agentName = 'undefined';

	// 타입별 분류
	if (typeTempData[parentId] == "Registry") {
		// 0322 추가. docker 의 경우 임시 ip로 대체. public registry는 지원하지 않기 때문
		/*
		if (data['masterip'] === 'docker.io') {
			agentName = data['equipmarkname'] + ' (192.168.20.65:443)';
		}
		else {
			agentName = data['equipmarkname'] + ' (' + data['masterip'] + ')';
		}
		*/
		agentName = data['equipmarkname'] + ' (' + data['masterip'] + ')';
		agentId = data['registry_uuid']; // hardwareid -> registry_uuid
	}
	else if (typeTempData[parentId] == "HostSecurity") {
		agentName = data['equipmarkname'] + ' (' + data['masterip'] + ')';
		agentId = data['hardwareid'];
	} else if (typeTempData[parentId] == "ContainerSecurity") {
		agentName = data["cluster_name"] + ' (' + data['master_ip'] + ')';
		agentId = data['cluster'];
	} else if (typeTempData[parentId] == "WebHook" || typeTempData[parentId] == "CSP") {
		agentName = data['equipmarkname'] + ' (' + data['masterip'] + ')';
		agentId = data['hardwareid'];
	} else {
		return false;
	}

	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=' + parentId + ']'));
	if (!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if (!pNode) { // 콘솔로그에서 알림창으로 변경
		cf_alert("오류", 'pNode(' + parentId + ') not found');
		return;
	}

	var sel = pNode.id;
	sel = sel[0];

	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	var newNode = {
		"cloudid": agentId,
		"type": data['devstatus'] == 1 ? "file" : "file_offline",
		"state": "open"
	};

	// 만약에 호스트 시큐리티 타입이 아니라면 헬스 체크는 하지 않는다.
	if (typeTempData[parentId] != "HostSecurity" && typeTempData[parentId] != "WebHook" && typeTempData[parentId] != "CSP") {
		//newNode["type"] = "file_offline";
		// file_notcheck가 클래스로 등록가능하게 로직을 변경해야함
		newNode["type"] = "file_notcheck";
	}

	sel = ref.create_node(pNode, newNode, "last", null);

	if (sel) {
		treeNodeMap[treeName + '_' + agentId] = sel;
		ref.rename_node(sel, agentName);
		dataMap[sel] = data;
	}
}


function initAgent() {
	// 소속그룹에 대한 강제 선택 > 그룹 생성시에만 적용
	var targetGroupId = "G0000000000001";
	/*if ($("#editCheck").val() == "insert") {
		if (typeTempData[clickGroupId]== "HostSecurity") targetGroupId = "G0000000000001";
		else if (typeTempData[clickGroupId] == "Registry") targetGroupId = "G0000000000002";
		else if (typeTempData[clickGroupId] == "ContainerSecurity") targetGroupId = "G0000000000003";
		// 수정시에는 자신의 타입이 그대로 적용
	} else if ($("#editCheck").val() == "update") {
		targetGroupId = clickGroupId;
	}*/
	if (clickGroupId != "") targetGroupId = clickGroupId;

	// 에이전트 초기화. 기존의 form, val 값을 비우고 버튼은 hide
	// 공통
	$("#groupname_view").html("");
	$("#registertime_view").html("");
	$("#modifytime_view").html("");
	$("#equipmarkname_view").html(""); // 자산명 
	$("#equiplocation_view").html(""); // 자산위치
	$("#masterip_view").html("");
	$("#type_view").html(""); // 자산 타입
	$("#masterip").val(""); 

	//Aegis -host
	$("#osver_view").html("");
	$("#company_view").html("");
	$("#manager_view").html("");
	$("#service_state_view").html("");
	$("#log_state_view").html("");
	$("#log_count_view").html("");

	//cAegis -registry
	$("#registry_type_view").html(""); // registry type
	$("#vendor_view").html(""); // vendor 
	$("#auto_scan_view").html(""); // 자동분석 여부
	$("#registry_id_view").html(""); // 아이디 
	$("#registry_pw_view").html(""); // 비번
	$("#is_registered_tls_cert_view").html(""); // 인증서
	$(".is_registryed_tls_status_text").addClass("hidden"); // tls status 상태 숨김
	
	// vendor 01 제외 hide
	$(".regv03").hide(); // oauth token hide 
	
	//cAegis -cluster
	$("#cluster_webhook_server_view").html("");	// 웹훅 서버
	$("#cluster_webhook_server_timeout_view").html(""); // 웹훅 서버 타임 아웃
	$("#cluster_tls_cert_status_view").html("");	// 인증서 상태
	$("#cluster_tls_cert_status").html("");	// 인증서 상태
	$("#cluster_tls_cert_view").html("");	// 인증서
	$("#cluster_auth_token_view").html("");	// 토큰
	$("#cluster_auto_scan_cycle").val("");	// 토큰
	$("#cluster_auto_scan").val("F").niceSelect("update");

	// value
	$("#hardwareid").val("");
	$("#groupid").val(targetGroupId).niceSelect("update");
	$("#registertime").val("");
	$("#modifytime").val("");
	$("#type").val(typeTempData[clickGroupId]).niceSelect("update");
	$("#equipmarkname").val("");
	$("#equiplocation").val("");
	$("#masterip").val("");
	$("#osver").val("");
	$("#company").val("");
	$("#manager").val("");
	$("#service_state").val("true").niceSelect("update");
	$("#log_state").val("true").niceSelect("update");
	$("#log_count").val("");

	// value 추가(cAegis -registry 관련)
	if(typeTempData[clickGroupId] == "Registry") $("#masterip").val("docker.io"); 
	$("#registry_type").val("PRIVATE").niceSelect("update"); // registry_type
	$("#vendor").val("REGV01").niceSelect("update"); // vendor
	$("#selected_vendor").parent().addClass("hidden"); // vendor name form
	$("#auto_scan").val("F").niceSelect("update"); // 자동분석 여부(default: F)
	$("#registry_user").val(""); // 아이디 
	$("#registry_pw").val(""); // 비번
	$("#auto_scan_cycle").val(""); // 자동분석 실행 주기
	$("#tls_cert").val(""); // 인증서
	$("#is_registered_tls_cert").val(""); // 인증서 값  
	$("#is_registered_tls_status").html("");	// 인증서 상태
	$("#is_registered_tls_status_view").html(""); 
	$("#is_registered_tls_cert_expiration_date_view").html(""); // 인증서 유효기간
	$("#oauth_token").val(""); // oauth token 
	

	// value 추가(cAegis -cluster 관련)
	$("#cs_webhook_url").val("");
	$("#cs_webhook_timeout").val(30);
	$("#cs_cert_data").val();
	$("#cs_cert_data").val(""); // CA인증서
	$("#cs_auth_token_data").val(""); // auth토큰 
	$("#clusterosver").val(""); // OS 클러스터용 표기
	$("#masterip").attr("readonly", false);	// readonly 속성 제거

	$("#modifyBtn").hide();
	$("#removeBtn").hide();

	// 2023-06-19 [caegis] 추가된 내용 확인
	autoScanCycleChange();
	optionChange(); // 타입 옵션에 따라 보여지는 목록 다르게 출력
	selectData = {
		groupid: targetGroupId
	}; // (중요!) selectData 초기화. 이전에 클릭 조회한 데이터가 남아있기 때문
	// 230808:kimsw groupid도 날려버리게 되면 자산 추가 시 두번째 클릭에서 부턴 오류가 나기 때문에 로직 변경

	$("#addGroupBtn").show();
	$("#modifyGroupBtn").show();
	$("#removeGroupBtn").show();
	$("#addBtn").show();
}

// 자산 또는 그룹 클릭시 
function clickNode(event) {
	initAgent();

	var treeName = 'Tree01';
	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	sel = ref.get_selected();
	//if(!sel=="" && sel!="G0000000000000") {

	selectData = dataMap[sel];

	// 2023-06-19 [caegis] 변경 내용 확인 -> if문 조건에 sel!="G0000000000000" 추가 되었음
	if (sel && sel != "G0000000000000") {
		selectComplianceFrameworkList(selectData["cluster"]);
		// 분류 방식이 type값으로 분류하기 때문에 해당 로직은 주석처리 2023-07-03
		// Aegis 클러스터 자산은 HARDWARES에 저장되어 hardwareid 여부를 체크
		//if (selectData['hardwareid']) {

		// 그룹 아이디 저장
		if (selectData['groupid']) clickGroupId = selectData['groupid'];

		// 그룹추가시 그룹이 추가되는 경로(종속관계) 설정
		if (selectData['parentgroupid'] == "G0000000000000") {
			// 상위 그룹 클릭시 자신의 경로를 추가 경로로 설정
			addDepth2Group['parentId'] = selectData['groupid'];
		}
		else if (selectData['parentgroupid']) { // 하지만 2뎁스에서 추가할시 3뎁스로 이어지므로 페어런츠 값을 사용하여 2뎁스에 추가되도록 설정
			// 하위 그룹 클릭시 상위 그룹을 그룹추가 경로로 설정
			addDepth2Group['parentId'] = selectData['parentgroupid'];
		} else if (dataMap[treeNodeMap['Tree01_' + dataMap[sel]['groupid']]]['parentgroupid'] == "G0000000000000") {
			// 상위 그룹의 자산 클릭시 상위 그룹을 그룹 추가 경로로 설정
			addDepth2Group['parentId'] = selectData['groupid'];
		} else {
			// 하위 그룹의 자산 클릭시 상위 그룹을 그룹 추가 경로로 설정
			addDepth2Group['parentId'] = dataMap[treeNodeMap["Tree01_" + dataMap[sel]['groupid']]]["parentgroupid"];
		}

		// 부모 그룹 아이디가 있다는것은 뎁스(그룹)을 클릭했다는것을 의미
		if (selectData["parentgroupid"]) {

			$('.info').removeClass("on");
			$(".edit_box").removeClass("on");

			// WebHook 또는 CSP
			if (typeTempData[selectData["groupid"]] == "WebHook" || typeTempData[selectData["groupid"]] == "CSP") {
				//$(".edit_box").removeClass("on");
				$('#addGroupBtn').hide();
				$('#modifyGroupBtn').hide();
				$('#removeGroupBtn').hide();
				$('#addBtn').hide();
			}
		}
		// 2023-06-21타입으로 분류
		// 여기서 자산의 그룹 ID는 엄밀히 따지면 자신의 페어런츠 그룹의 아이디
		else if (typeTempData[selectData['groupid']] == "HostSecurity") {
			// 호스트타입의 내부 로직은 변경하지 않았습니다.
			var hardwareid = selectData['hardwareid'];
			var registertime = selectData['registertime'];
			var dflDate = moment().format('YYYYMMDD');
			var equipmarkname = selectData['equipmarkname'];
			var equiplocation = selectData['location'];
			var masterip = selectData['masterip'];
			var osver = selectData['osver'];
			var company = selectData['company'];
			var manager = selectData['manager'];
			var service_state = selectData['service_state'];
			var log_state = selectData['log_state'];
			var log_count = selectData['log_count'];

			var grouppath = selectData['grouppath'].split(':');

			var groupid = "";
			var groupname = "";



			if (grouppath.length > 1) {
				$('#groupid').html(grouppath[1]);
				var group = treeNodeMap['Tree02_' + grouppath[1]];
				var groupMap = dataMap[group];
				groupname = groupMap['groupname'];
			} else {
				groupid = selectData['groupid'];
				groupname = selectData['groupname'];
			}
			$("#groupname_view").html(groupname);
			$("#registertime_view").html(registertime);
			$("#modifytime_view").html(dflDate);
			$("#type_view").html("HostSecurity"); // 타입 추가
			$("#equipmarkname_view").html(equipmarkname);
			$("#equiplocation_view").html(equiplocation);
			$("#masterip_view").html(masterip);
			$("#osver_view").html(osver);
			$("#company_view").html(company);
			$("#manager_view").html(manager);
			$("#service_state_view").html(service_state ? "ON" : "OFF");
			$("#log_state_view").html(log_state ? "ON" : "OFF");
			$("#log_count_view").html(log_count);


			$('#hardwareid').val(hardwareid);
			$("#groupid").val(groupid).niceSelect("update");
			$("#registertime").val(registertime);
			$("#modifytime").val(dflDate);
			$("#equipmarkname").val(equipmarkname);
			$("#equiplocation").val(equiplocation);
			$("#masterip").val(masterip);
			$("#osver").val(osver);
			$("#company").val(company);
			$("#manager").val(manager);
			$("#service_state").val(service_state + "").niceSelect("update");
			$("#log_state").val(log_state + "").niceSelect("update");
			$("#log_count").val(log_count);

			$("#modifyBtn").show();
			$("#removeBtn").show();
			$('#modifyGroupBtn').hide();
			$('#removeGroupBtn').hide();



			$(".edit_box").removeClass("on");
			$(".info").addClass("on");

			// 2023-06-19 [caegis] 추가된 내용
			$("#type").val("HostSecurity").niceSelect("update");
			optionChange(); // 타입에 따라 옵션 변경

		}

		// 2023-06-19 [caegis] 추가 내용 확인
		// cAegis는 레지스트리 목록만 조회하므로 registryuuid 를 체크 
		//else if (selectData['registry_uuid']) {

		// 2023-06-21 타입으로 분류
		// 여기서 자산의 그룹 ID는 엄밀히 따지면 자신의 페어런츠 그룹의 아이디
		// vaegis 호스트에 페어런츠 아이디가 아니라 그룹 아이디로 들어가기에 타입별 구분을 위해 구분
		else if (typeTempData[selectData['groupid']] == "Registry") {
			// 레지스트리타입의 내부 로직은 일부 변경되었습니다.
			var grouppath = ["G0000000000000"];
			// 변경 사항 - 변경 전
			//var groupid = "";
			//var groupname = "";
			// 변경 후
			var groupid = selectData['groupid'];
			// 그룹 아이디를 통해서 그룹 이름을 구하는 과정은 트리맵에서 트리키를 가지고 노드값을 가져온다음
			// 노드값을 키로 이용해서 데이터맵에서 그룹네임을 추출
			var groupname = dataMap[treeNodeMap["Tree01_" + groupid]]["groupname"];

			// 변경 사항(추가)
			var type = selectData['type'];
			var registryuuid = selectData['registry_uuid'];
			var registertime = selectData['registertime']; //등록일
			var modifytime = selectData['modifytime']; //최종 변경일
			var equipmarkname = selectData['equipmarkname']; //자산명
			var masterip = selectData['masterip']; // IP
			var registry_vendor_name = selectData['registry_vendor_name']; //Vendor 이름(view)
			var registry_vendor_code = selectData['registry_vendor_code']; //Vendor 값

			var auto_scan = selectData['auto_scan']; //자동 분석 여부
			var auto_scan_cycle = selectData['auto_scan_cycle']; //자동분석 실행 주기
			var registry_user = selectData['registry_user']; // registry 유저 ID.
			var registry_pw = selectData['registry_pw']; // registry 유저 Password.
			var oauth_token = selectData['oauth_token']; // Quay 에서만 사용. oauth token 값
			var tls_cert = selectData['tls_cert']; // tls 인증서 정보
			var is_registered_tls_cert = selectData['is_registered_tls_cert']; // 인증서 등록 여부
			var tls_cert_expiration_date = selectData['tls_cert_expiration_date']; // 인증서 유효 기간
			var current_date = selectData['current_date']; // 현재 시간


			// is_registered_tls_cert 상태에 따른 icon 태그 변경
			if (is_registered_tls_cert == "T") {
				$(".is_registryed_tls_status_text").removeClass("hidden");
				$('.is_registryed_tls_status_text').html("valid"); 
				tls_state_view = "<div class='icon_cert_status_check'></div>";
			} else if (is_registered_tls_cert == "F") {
				$(".is_registryed_tls_status_text").removeClass("hidden");
				$('.is_registryed_tls_status_text').html("invalid"); 
				tls_state_view = "<div class='icon_cert_status_check false'></div>";
			} else if (is_registered_tls_cert == "W") {
				$(".is_registryed_tls_status_text").addClass("hidden");
				if(tls_cert) tls_state_view = "인증서 정보를 최신화 중 입니다."; // tls 인증서가 있는 경우에만 문구 추가
				else tls_state_view =""; // 없는경우 ""으로 대체
			}
			
			// 10-13 추가. 인증서 유효기간에 따라 icon태그 변경. 현재날짜보다 유효기간이 적은경우 false 출력
			if(tls_cert_expiration_date){
				var currentDate = new Date(current_date);
				var tlsCertExpirationDate = new Date(tls_cert_expiration_date);
			
				if (currentDate < tlsCertExpirationDate) {
					$(".is_registryed_tls_status_text").removeClass("hidden");
					$('.is_registryed_tls_status_text').html("valid"); 
					tls_state_view = "<div class='icon_cert_status_check'></div>";
				} else if (currentDate >= tlsCertExpirationDate) {
					$(".is_registryed_tls_status_text").removeClass("hidden");
					$('.is_registryed_tls_status_text').html("invalid"); 
					tls_state_view = "<div class='icon_cert_status_check false'></div>";
				}
			}
		
			$("#groupname_view").html(groupname);
			$("#registertime_view").html(registertime);
			$("#modifytime_view").html(modifytime);

			// view(html)
			$("#type_view").html(type);
			$("#equipmarkname_view").html(equipmarkname);
			$("#masterip_view").html(masterip);
			$("#vendor_view").html(registry_vendor_name);
			$("#auto_scan_view").html(auto_scan === "T" ? ('[ON] ' + auto_scan_cycle) : '[OFF] -');
			$("#registry_id_view").html(registry_user? registry_user :"-");
			$("#registry_pw_view").html(registry_pw? "" : "-");
			$("#oauth_token_view").html(oauth_token); // oauth token 

			$('#is_registered_tls_status').html(tls_state_view);
			$('#is_registered_tls_status_view').html(tls_state_view);
			if(tls_cert){ // tls_cert 값의 존재 유무에 따른 태그 변경
				$("#is_registered_tls_cert_view").html(Base64.decode(tls_cert).trim());
			}
			$('#is_registered_tls_cert_expiration_date_view').html(tls_cert_expiration_date? tls_cert_expiration_date : "-");



			//value(val)
			$("#groupid").val(groupid).niceSelect("update");
			$("#registry_type").val(type).niceSelect("update");
			
			$("#registertime").val(registertime);
			$("#equipmarkname").val(equipmarkname);
			$("#modifytime").val(modifytime);

			$("#masterip").val(masterip);
			$("#vendor").val(registry_vendor_code).niceSelect("update");
			$("#selected_vendor").val(registry_vendor_name).niceSelect("update");
			if ($('#vendor').val() === "REGV99") { // 기타인 경우
				$("#selected_vendor").parent().removeClass("hidden"); // vendor name form show
			};
			
			$("#registry_user").val(registry_user);
			$("#oauth_token").val(oauth_token); // oauth token

			$("#auto_scan").val(auto_scan).niceSelect("update");
			$("#auto_scan_cycle").val(auto_scan_cycle);
			autoScanCycleChange(); // 실행주기(auto_scan) 옵션에 따라 입력 여부 결정


			if(tls_cert){
				$("#tls_cert").val(Base64.decode(tls_cert));
			}
			$("#modifyBtn").show();
			$("#removeBtn").show();
			$('#modifyGroupBtn').hide();
			$('#removeGroupBtn').hide();

			$(".edit_box").removeClass("on");
			$(".info").addClass("on");

			// 추가 docker 인 경우 
			/*
			if (masterip === "docker.io") {
				$("#masterip_view").html("192.168.20.65:443");
				$("#masterip").val("192.168.20.65:443");
			};
			*/
			$("#type").val("Registry").niceSelect("update");
			optionChange();		
			//registryTypeChange(); // 레지스트리 타입 옵션에 따라 UI 출력 형식 결정 
	
		}
		else if (typeTempData[selectData['groupid']] == "ContainerSecurity") {
			selectComplianceFrameworkList(selectData["cluster"]);

			clickGroupId = selectData.groupid;
			var groupid = selectData['groupid'];
			// 그룹 아이디를 통해서 그룹 이름을 구하는 과정은 트리맵에서 트리키를 가지고 노드값을 가져온다음
			// 노드값을 키로 이용해서 데이터맵에서 그룹네임을 추출
			var groupname = dataMap[treeNodeMap["Tree01_" + groupid]]["groupname"];
			var registertime = selectData['registertime'];
			var modifytime = selectData['modifytime'];
			var type = typeTempData[selectData['groupid']];
			var cluster_name = selectData['cluster_name'];
			var location = selectData['equiplocation']; // 사용자 정의 자산 위치
			var master_ip = selectData['master_ip'] + ":" + selectData['master_kubeapi_port'];
			var osvar = selectData['osversion']; // 사용자 정의 OS
			var webhook_url = selectData['webhook_url'];
			var webhook_timeout = selectData['webhook_timeout'];
			var cert_state = selectData['cert_state'];
			var webhook_state = selectData['webhook_state'];
			var ca_data = selectData['ca_data'];
			if (selectData['ca_auth']) {
				var ca_auth = selectData['ca_auth'];
			} else {
				var ca_auth = "";
			}

			var cert_state_view = "";
			var cert_state_view_word = "";
			var webhook_state_view = "";
			var webhook_state_view_edit = "style='margin-top:3px;'";
			var webhook_state_view_edit_view = "";
			var webhook_state_view_edit_word ="";
			var cluster_auto_scan = selectData['cluster_auto_scan'];
			var cluster_auto_scan_cycle = selectData['cluster_auto_scan_cycle'];
			var complianceFrameworkList = selectData.complianceFrameworkList;
			var tls_expire_date = selectData['crt_expire_date']?selectData['crt_expire_date']:'-';
			var today_expire_date = selectData['today_expire_date'];
			
			//crt_expire_date today_expire_date
			if(tls_expire_date !=='-'){
				var checkExpired = new Date(tls_expire_date);
				var nowExpired = new Date(today_expire_date);
				if(checkExpired<nowExpired){
					// 인증서 기간 만료시 인증서 상태 invalid
					cert_state = 'F';
				}
			}
			
			if (cert_state == "T") {
				cert_state_view = "<div><div class='icon_cert_status_check'></div></div>";
				cert_state_view_word  = "valid";
			} else if (cert_state == "F") {
				cert_state_view = "<div><div class='icon_cert_status_check false'></div></div>";
				cert_state_view_word  = "invalid";
			} else if (cert_state == "W") {
				cert_state_view = "인증서 정보를 최신화 중 입니다.";
			}

			if (webhook_state == "T") {
				webhook_state_view = "<div><div class='icon_cert_status_check'></div></div>";
				webhook_state_view_edit_view =  "<div style='width:50px;'><div "+webhook_state_view_edit+" class='icon_cert_status_check'></div></div>";
				webhook_state_view_edit_word ="valid";
			} else if (webhook_state == "F") {
				webhook_state_view = "<div><div class='icon_cert_status_check false'></div></div>";
				webhook_state_view_edit_view =  "<div><div "+webhook_state_view_edit+" class='icon_cert_status_check false'></div></div>";
				webhook_state_view_edit_word ="invalid";
			} else if (webhook_state == "W") {
				webhook_state_view = "연동 정보를 최신화 중 입니다.";
				webhook_state_view_edit_view = "<div class='img_box' style='width:32px;'><div "+webhook_state_view_edit+"><img src='assets/images/loading_big.gif'></div></div>";
				webhook_state_view_edit_word ="checking";
			}

					
			var nameOfComplianceFrameworkList = [];
			// TODO 2023-09-12 이성호 > 로직 개선 필요
			$.each(complianceFrameworkList, function(index, item) {
				if (item.is_user_enabled === 'T') { // 유저가 활성화 했을경우
				
					if (item.is_scannable === 'T') { // 스캔 가능한 경우
						nameOfComplianceFrameworkList.push("<span style=\"margin-left: 10px;\" title=\"스캔 가능\">"+item.name+"</span>");
					} else if(item.is_scannable === 'W'){
						nameOfComplianceFrameworkList.push("<span style=\"margin-left: 10px;\" title=\"스캔 여부 확인중\">"+item.name+"<b>[?]</b></span>");
					}else { // 스캔 불가능
						if (item.not_scannable_reason) { // 스캔 불가 이유가 있는경우
							nameOfComplianceFrameworkList.push("<span style=\"margin-left: 10px;\" title=\""+item.not_scannable_reason+"\">"+item.name+"<b>[X]</b></span>" );
						}else { // 스캔 불가 이유가 없는 경우
							nameOfComplianceFrameworkList.push("<span style=\"margin-left: 10px;\" title=\"프레임워크 활성화 필요\">"+item.name+"<b>[X]</b></span>");
						}
					}
				}
			});



			$("#cluster_webhook_server_view").html(webhook_url ? webhook_url : '-');
			$("#cluster_webhook_server_timeout_view").html(webhook_timeout ? (webhook_timeout + " 초") : '-');
			$("#cluster_auto_scan_cycle_view").html(cluster_auto_scan === 'T' ? ('[ON] ' + cluster_auto_scan_cycle) : '[OFF] -');
			$("#compliance_framework_list_view").html(nameOfComplianceFrameworkList.toString() ? nameOfComplianceFrameworkList.toString() : '-');

			// info
			$("#groupname_view").html(groupname);
			$("#registertime_view").html(registertime);
			$("#modifytime_view").html(modifytime);
			$("#type_view").html(type);
			$("#equipmarkname_view").html(cluster_name);// 자산명
			$("#equiplocation_view").html(location);
			$("#masterip_view").html(master_ip);
			$("#osver_view").html(osvar);
			$("#cluster_tls_cert_status_view").html(cert_state_view);
			$("#cluster_tls_cert_status").html(cert_state_view);
			$("#cluster_tls_cert_view").html(Base64.decode(ca_data).trim());
			$("#cluster_auth_token_view").html(Base64.decode(ca_auth));
			$("#cluster_webhook_status_view").html(webhook_state_view);
			$("#cluster_webhook_status").html(webhook_state_view_edit_view);
			$("#cluster_tls_cert_status_word").html(cert_state_view_word);
			$("#cluster_webhook_status_word").html(webhook_state_view_edit_word);
			$("#cluster_tls_expire_date").html(tls_expire_date);
			

			$("#modifyBtn").show();
			$("#removeBtn").show();
			$('#modifyGroupBtn').hide();
			$('#removeGroupBtn').hide();


			$(".edit_box").removeClass("on");
			$(".info").addClass("on");

			// value
			$("#groupid").val(groupid).niceSelect("update");
			$("#registertime").val(registertime);
			$("#modifytime").val(modifytime);
			$("#type").val("ContainerSecurity").niceSelect("update");
			$("#equipmarkname").val(cluster_name);
			$("#equiplocation").val(location);
			$("#masterip").val(master_ip);
			$("#clusterosver").val(osvar);
			$("#cs_webhook_url").val(webhook_url);
			$("#cs_webhook_timeout").val(webhook_timeout);
			$("#cs_cert_data").val(Base64.decode(ca_data).trim());
			$("#cs_auth_token_data").val(Base64.decode(ca_auth));
			$("#cluster_auto_scan").val(cluster_auto_scan).niceSelect("update");
			$("#cluster_auto_scan_cycle").val(cluster_auto_scan_cycle);

			autoScanCycleChange();
			optionChange();

		} else if (typeTempData[selectData['groupid']] == "WebHook" || typeTempData[selectData['groupid']] == "CSP") {
			// WebHook OR CSP
			$('#addGroupBtn').hide();
			$('#modifyGroupBtn').hide();
			$('#removeGroupBtn').hide();
			$('#addBtn').hide();

			var hardwareid = selectData['hardwareid'];
			var registertime = selectData['registertime'];
			var dflDate = moment().format('YYYYMMDD');
			var equipmarkname = selectData['equipmarkname'];
			var equiplocation = selectData['location'];
			var masterip = selectData['masterip'];
			var osver = selectData['osver'];
			var company = selectData['company'];
			var manager = selectData['manager'];
			var service_state = selectData['service_state'];
			var log_state = selectData['log_state'];
			var log_count = selectData['log_count'];

			var grouppath = selectData['grouppath'].split(':');

			var groupid = "";
			var groupname = "";



			if (grouppath.length > 1) {
				$('#groupid').html(grouppath[1]);
				var group = treeNodeMap['Tree02_' + grouppath[1]];
				var groupMap = dataMap[group];
				groupname = groupMap['groupname'];
			} else {
				groupid = selectData['groupid'];
				groupname = selectData['groupname'];
			}
			$("#groupname_view").html(groupname);
			$("#registertime_view").html(registertime);
			$("#modifytime_view").html(dflDate);
			$("#type_view").html(typeTempData[selectData['groupid']]); // 타입 추가
			$("#equipmarkname_view").html(equipmarkname);
			$("#equiplocation_view").html(equiplocation);
			$("#masterip_view").html(masterip);
			$("#osver_view").html(osver);
			$("#company_view").html(company);
			$("#manager_view").html(manager);
			$("#service_state_view").html(service_state ? "ON" : "OFF");
			$("#log_state_view").html(log_state ? "ON" : "OFF");
			$("#log_count_view").html(log_count);


			$('#hardwareid').val(hardwareid);
			$("#groupid").val(groupid).niceSelect("update");
			$("#registertime").val(registertime);
			$("#modifytime").val(dflDate);
			$("#equipmarkname").val(equipmarkname);
			$("#equiplocation").val(equiplocation);
			$("#masterip").val(masterip);
			$("#osver").val(osver);
			$("#company").val(company);
			$("#manager").val(manager);
			$("#service_state").val(service_state + "").niceSelect("update");
			$("#log_state").val(log_state + "").niceSelect("update");
			$("#log_count").val(log_count);

			//$("#modifyBtn").show();
			//$("#removeBtn").show();

			// 2023-06-19 [caegis] 추가된 내용


			$(".edit_box").removeClass("on");
			$(".info").addClass("on");

			// 2023-06-19 [caegis] 추가된 내용
			$("#type").val("HostSecurity").niceSelect("update");
			optionChange(); // 타입에 따라 옵션 변경


		}
	}
	else { // 루트 노드거나 sel값이 존재하지 않을경우
		$('.info').removeClass("on");
		$(".edit_box").removeClass("on");
		$('#addGroupBtn').hide();
		$('#modifyGroupBtn').hide();
		$('#removeGroupBtn').hide();
		$('#addBtn').hide();

	}
	$(".edit_line").addClass("hidden");
	$(".computer_box_right .edit").removeClass("edit_no_border");
	unifyHeight();
}

// 2023-06-19 [caegis] 추가 내용 확인
// 230117 자동 분석 여부 on -> 자동 분석 실행 주기 입력
function autoScanCycleChange() {
	if ($('#auto_scan option:selected').val() === "T") {
		$('#auto_scan_cycle').attr("disabled", false);
	}
	else {
		$('#auto_scan_cycle').attr("disabled", true);
	}
	if ($('#cluster_auto_scan option:selected').val() === "T") {
		$('#cluster_auto_scan_cycle').attr("disabled", false);
	}
	else {
		$('#cluster_auto_scan_cycle').attr("disabled", true);
	}
};

// 230110 type에 따른 선택 옵션 변경
function optionChange() {
	if ($('#type option:selected').val() == "Registry") {
		$('.cs_option').hide();
		$('.host_option').hide();
		$('.registry_option').show();
	}
	else if ($('#type option:selected').val() == "HostSecurity") {
		$('.cs_option').hide();
		$('.registry_option').hide();
		$('.host_option').show();
	}
	else if ($('#type option:selected').val() == "ContainerSecurity") {
		$('.registry_option').hide();
		$('.host_option').hide();
		$('.cs_option').show();
	}
	else {
		$('.registry_option').hide();
		$('.host_option').hide();
		$('.cs_option').hide();
	}
}

// 자산 추가, 수정시 그룹값을 변경하면 type값도 일치하는 데이터로 변경
function typeChange(groupId) {
	$("#type").val(typeTempData[groupId]).niceSelect("update");
	optionChange();
}

// 레지스트리 자산 타입 변경에 따라 UI 변경사항 적용
/*
function registryTypeChange() {
	// vaild 표시 유무 설정
	if ($('#registry_type option:selected').val() == "PRIVATE") {
		$('.registry_validation').show(); 
	}
	else if ($('#registry_type option:selected').val() == "PUBLIC") {
		$('.registry_validation').hide(); 
	}
	// 타입 변경 시 vendor 리스트 초기화 
	//$('#vendor').val($('#vendor option:first').val()).niceSelect('update');
	vendorChange();
}
*/

//객체 compliance 생성 kimsw
function makeComplianceData() {
	var compliance = {};
	$('#scanAbleFramework div.scan_able_list').each(function() {
		var id = $(this).attr('id');
		var name = $(this).data('name');
		compliance[id] = {
			is_user_enabled: 'F',
			name: name
		};
	});
	$('#scanTargetFramework div.scan_target_list').each(function() {
		var id = $(this).attr('id');
		var name = $(this).data('name');
		compliance[id] = {
			is_user_enabled: 'T',
			name: name
		};
	});
	return compliance;
}


// 자산 등록, 수정 -> registry_uuid로 결정
function saveBtn() {
	// 공통 value
	saveData['groupid'] = $('#groupid').val(); // 소속 그룹
	saveData['equipmarkname'] = $('#equipmarkname').val(); // 자산명
	saveData['location'] = $('#equiplocation').val(); // 자산 위치
	saveData['masterip'] = $('#masterip').val(); // IP


	if (typeTempData[$('#groupid').val()] == "ContainerSecurity") {
		// 프레임워크 활성화
		saveData['compliance'] = makeComplianceData();
		//웹훅서버
		// 이성호 2023-08-24 웹훅 값이 없으면 null
		saveData['webhook_url'] = $('#cs_webhook_url').val();
		saveData['webhook_url'] = saveData['webhook_url'].replaceAll(" ", "");
		//웹훅서버 타임아웃
		if (saveData['webhook_url']) {
			saveData['webhook_timeout'] = parseInt($('#cs_webhook_timeout').val() ? $('#cs_webhook_timeout').val() : 30);
		} else {
			saveData['webhook_timeout'] = null;
		}

		saveData['cluster_auto_scan'] = $('#cluster_auto_scan option:selected').val(); // T/F
		
		
		// 자동 분석 여부가 OFF이면, 실행주기 값 null
		if (saveData['cluster_auto_scan'] === "T") {
			saveData['cluster_auto_scan_cycle'] = $('#cluster_auto_scan_cycle').val() ? $('#cluster_auto_scan_cycle').val() : null;
		}
		else {
			saveData['cluster_auto_scan_cycle'] = null;
		}
		//OS
		saveData['osver'] = $('#clusterosver').val();
		//ca인증서
		saveData['ca_data'] = $('#cs_cert_data').val();
		//authToken
		saveData['ca_auth'] = $('#cs_auth_token_data').val();

		// 공백 제거> 값을 가져올때 해도 되지만 모든 데이터가 cluster에 오는것은 아니기 때문에 해당 되는 데이터는 여기서 한번에 공백을 제거
		// 문자 중간에 공백이 존재해도 되는 데이터는 trim으로, 중간에 공백이 존재하면 안되는 데이터는 replace로 공백제거
		saveData['equipmarkname'] = saveData['equipmarkname'].trim();
		saveData['location'] = saveData['location'].trim();
		saveData['osver'] = saveData['osver'].trim();
		// 공백 제거시 정상적으로 데이터 변환이 어려움 > trim 으로 해결
		saveData['ca_data'] = saveData['ca_data'].trim();
		saveData['ca_auth'] = saveData['ca_auth'].trim();

		saveData['masterip'] = saveData['masterip'].replaceAll(" ", "");		
		
		// 필수 데이터 체크
		if (!checkData()) return false; // 필수 조건 통과 x 시, 자산 등록 x
		var requestID = "";
		
		// selectData로 자산 수정, 생성 분리
		if ($("#editCheck").val() == "update") { // 자산 수정
			// 생성일> 사용안함
			saveData['registertime'] = $('#registertime').val();
			
			if(clusterUuidData!=""){
				saveData['cluster'] = clusterUuidData;
			}else{
				saveData['cluster'] = selectData['cluster'];
				clusterUuidData = selectData['cluster'];
			}
			
			requestID = _TR_CLUSTER_UPDATE;
			// 자산 수정 기능 비활성화
			//return cf_alert("클러스터 자산 수정", "비활성화 되었습니다.");
		} else {// 자산 생성
			requestID = _TR_CLUSTER_INSERT;
		}


		// 오토 스캔 컴플라이언스
		var autoScanCompliance = [];
		$('#scanTargetFramework div.scan_target_list').each(function() {
			autoScanCompliance.push($(this).attr('id'));
		});
		// 2023-09-20 이성호 수정> 오토 스캔 컨플라이언스를 스캔 가능 여부 요청에 사용
		// 스캔 스케줄에 요청될 데이터가 결국 스캔 가능한 여부를 확인해야 하기 때문
		saveData['autoScanCompliance'] = autoScanCompliance;
		
		var autoScanData = {};
		autoScanData['frameworks'] = autoScanCompliance;
		autoScanData['cycle'] = saveData['cluster_auto_scan_cycle'];


		// TODO 2023-09-12 이성호 > 로직 개선 필요(인증서 체크부터 등록 또는 수정)
		// 인증서 확인
		cf_requestServer(_TR_CLUSTER_CRTCHECK, saveData, function(data) {

			if (data["body"]["MESSAGE"] == "OK") {
				// 로딩 표시
				cf_contPreloader("loadingSpot");
				// 인증서가 올바르면 생성 또는 수정 실행
				cf_requestServer(requestID, saveData, function(value) {
					var resultTitle = value["body"]["resultTitle"];
					var resultMessage = value["body"]["resultMessage"];
					
					// 로딩 제거
					cf_removePreloader("loadingSpot");			
					cf_alert(resultTitle, resultMessage);
					
					selectTree(); // 데이터 초기화 후 selectGroupList() 호출

					//initAgent(); // 입력 폼 초기화
				});
			} else {
				cf_alert("오류", "인증서 또는 토큰값을 정확하게 입력해주세요.");
			}
		});

	} 
	else if (typeTempData[$('#groupid').val()] == "Registry") { //09-14 추가.typeTempData를 통해 Registry Type의 데이터만 구분해서 처리
		// 공통 value
		saveData['groupid'] = $('#groupid').val(); // Registry groupid =  G0000000000002
		saveData['equipmarkname'] = $('#equipmarkname').val(); // registry_name
		saveData['masterip'] = $('#masterip').val(); // registry_host 
		// 만약 registry_host 정보가 변경된 경우, 변경사항 flag값으로 전달
		if (saveData['masterip'] != selectData['masterip']) {
			saveData['masterip_change'] = "T";
		}
		else{
			saveData['masterip_change'] = "F";
		}
		// saveData['registry_type'] = $('#registry_type option:selected').val(); // 레지스트리 타입
		saveData['registry_vendor_code'] = $('#vendor option:selected').val(); //vendor
		saveData['registry_vendor_name'] = $('#vendor option:selected').text(); //vendor_name
		if(saveData['registry_vendor_name'] == "기타"){ //vendor_name 이 기타인 경우, 입력한 값 전달
			saveData['registry_vendor_name'] = $('#selected_vendor').val();
		}
		// registry 접속 정보
		saveData['registry_user'] = $('#registry_user').val()? $('#registry_user').val() : null ;
		saveData['registry_pw'] = $('#registry_pw').val() ? $('#registry_pw').val() : null;
		saveData['registry_pw_a256'] = null; // aes256 암호화 정보
		
		// 자동 분석 여부가 OFF(F)이면, 실행주기 값 null
		saveData['auto_scan'] = $('#auto_scan option:selected').val(); // T/F
		if (saveData['auto_scan'] === "T") { 	
			saveData['auto_scan_cycle'] = $('#auto_scan_cycle').val() ? $('#auto_scan_cycle').val() : null;
		}
		else{
			saveData['auto_scan_cycle'] = null;
		}
		// 인증서 BASE64 인코딩 하여 저장.
		if($('#tls_cert').val()){
			saveData['tls_cert'] = btoa($('#tls_cert').val().trim() + '\n');
		}
		
		// 11-02 추가. Registry 타입 또는 Vendor 형식에 따라 파라미터값을 조절
		checkSaveData(saveData);
		
		// Service 호출 ID 변경 로직
		var requestID;
		var requestTitle;
		var requestMessage;
		
		if (selectData['registry_uuid']) { // 자산 등록 시 저장된 registry_uuid 사용. 자산 클릭 당시에만 조회된다
			saveData['registry_uuid'] = selectData['registry_uuid'] // 저장 값에 사용
			requestID = _TR_REGISTRY_UPDATE;
			requestTitle = "자산 정보 변경"
			requestMessage = "자산 정보를 변경하시겠습니까?"
		}
		else { // 자산 등록 전에는 registry_uuid 가 없음
			requestID = _TR_REGISTRY_INSERT;
			requestTitle = "자산 정보 추가"
			requestMessage = "자산 정보를 추가하시겠습니까?"
		}
		if (!checkData()) {
			return false; // 유효성 검사 통과 x 시, 자산 등록 서비스 호출 x
		}
		
		// Service 호출 및 결과 콜백 함수
		swal(requestTitle, requestMessage, "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if (willDelete) {
				cf_requestServer(requestID, saveData, function(data) {
					if (data.body.registry_result === "autoScanFail") {
						swal(requestTitle, "자산 정보 등록이 완료되었으나, 자동 분석 설정이 연동되지 않았습니다.", "./assets/images/icon_alert02.png", {
							buttons: "확인"
						});
					}
					else {
						swal(requestTitle, "정상적으로 처리되었습니다.", "./assets/images/icon_alert02.png", {
							buttons: "확인"
						});
					}
					selectTree(); // 데이터 초기화 후 selectGroupList() 호출
					initAgent(); // 입력 폼 초기화
				});
			} else {
				swal(requestTitle, "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	}
	else { // 클러스터 외 나머지 기능
		// 현재는 클러스터 작업이 우선이기에 기존 자산 생성,수정 로직은 변경하지 않았습니다.
		// typeTempData를 통해 타입별 지정을 권장합니다.
		// 기본 그룹의 하위 그룹은 그룹 조회시 typeTempData에 그룹아이디:타입 으로 저장됩니다.
		
		// other type인 경우
		saveData['osver'] = $('#osver').val();
		saveData['company'] = $('#company').val();
		saveData['manager'] = $('#manager').val();
		saveData['service_state'] = Boolean($('#service_state').val()); // 자산 연동 여부 
		saveData['log_state'] = Boolean($('#log_state').val()); // 로그 수집 여부 
		saveData['log_count'] = $('#log_count').val(); // 로그 수집 건수	

		// 기존 hosts 로직
		var requestID;
		if($("#hardwareid").val().length > 0) requestID = _TR_AGENT_UPDATE;
		else requestID = _TR_AGENT_INSERT;
		
		if(!checkData()) return false;
			
		swal("자산 정보 변경", "자산 정보를 변경하시겠습니까?", "./assets/images/icon_alert01.png", {
	        buttons: ["취소", "확인"],
	    }).then(function(willDelete) {
	        if (willDelete) {
	            cf_requestServer(requestID, selectData, function(data) {
	            	if(data.body.sendToMaster_log == false || data.body.sendToMaster_log == false) {
		            	swal("자산 정보 변경", "자산 정보 변경은 완료되었으나 로그 수집 설정이 연동되지 않았습니다.", "./assets/images/icon_alert03.png", {
					        buttons:"확인"
					    }); 
	            	} else {
		            	swal("자산 정보 변경", "정상적으로 처리되었습니다.", "./assets/images/icon_alert02.png", {
					        buttons:"확인"
					    }); 
	            	}
					selectTree();
					initAgent();
				});
	        } else {
		    	swal("자산 정보 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
		    		buttons: "확인"
		    	});
		    }
	    });	
	}// 클러스터 외 기능 끝
}

// 자산 삭제
function deleteAgent() {
	if (!selectData) return false;
	var requestID;
	// type 값에 따라 requestID 변경 

	// 컨테이너 이벤트
	if (typeTempData[selectData['groupid']] == "ContainerSecurity") {
		requestID = _TR_CLUSTER_DELETE;
	} else if (typeTempData[selectData['groupid']] == "HostSecurity") { // 호스트 시큐리티
		requestID = _TR_AGENT_DELETE;
	} else if (typeTempData[selectData['groupid']] == "Registry") { // 레지스트리
		requestID = _TR_REGISTRY_DELETE;
	} else {
		return false;
	}

	swal("자산 정보 삭제", "선택 한 자산을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if (willDelete) {
			cf_requestServer(requestID, selectData, function(data) {
				// 클러스터 자산은 정상적으로 삭제처리가 안될시 정상 삭제가 안되었다고 표기
				if (requestID == _TR_CLUSTER_DELETE) {

					// 정상 처리일때
					if (data["body"]["Message"] == "T") {
						swal("자산 정보 삭제", "정상적으로 처리되었습니다.", "./assets/images/icon_alert02.png", {
							buttons: "확인"
						});
					} else {// 삭제되지 않았을때
						swal("자산 정보 삭제", "자산 삭제에 실패하였습니다.", "./assets/images/icon_alert03.png", {
							buttons: "확인"
						});
					}


				} else {
					swal("자산 정보 삭제", "정상적으로 처리되었습니다.", "./assets/images/icon_alert02.png", {
						buttons: "확인"
					});
				}
				selectTree();
				initAgent();
			});
		} else {
			swal("자산 정보 삭제", "취소하였습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		}
	});

}


function moveNode(pData, data, type) {
	//드로그 앤 드랍에 따른 groupid 변경 구현
	var moveNodeData = {
		"type": type,				// 타입	// 수정일> 현재 호스트에만 적용되어있으며 클러스터와 레지스트리는 따로 맵퍼에서 적용
		"groupid": pData["groupid"]	// 그룹아이디
	};


	if (type == "HostSecurity") {
		// 호스트 그룹 이동
		moveNodeData["targetid"] = data["hardwareid"];
		// 호스트타입은 날짜 양식이 다르므로 DB 형식에 맞게 날짜 주입
		let today = new Date();
		moveNodeData["modifytime"] = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
	} else if (type == "Registry") {
		// 레지스트리 그룹 이동
		moveNodeData["targetid"] = data["registry_uuid"];
	} else if (type == "ContainerSecurity") {
		// 클러스터 그룹 이동
		moveNodeData["targetid"] = data["cluster"];
	} else return false;	// 타입이 잘못되었을때

	cf_requestServer(_TR_GROUP_MOVE, moveNodeData, function(data) {
		clickGroupType = type;
		initGroupNode();
		//selectData["groupid"] = pData["groupid"];
		selectTree(); // 데이터 초기화 후 selectGroupList() 호출
		initAgent(); // 입력 폼 초기화
		$('.info').removeClass("on");
	});


}


function selectTree() {
	initTree('Tree01'); // Aegis
	//initTree('Tree02');
	clickGroupType = typeTempData[selectData['groupid']]; // 트리에서 그룹 open할 default 그룹을 지정
	clickGroupId = selectData['groupid'];	// 트리에서 상세 오픈할 그룹 지정
	selectData = {};
	depthOpen = {	// 반복해서 트리 노드를 오픈하지 않도록 지정
		"depth0": true,
		"depth1": true,
		"depth2": true
	}
	saveData = {}; // 230117 추가. 저장 데이터 clean

	treeNodeMap = {};
	dataMap = {};

	selectGroupList();
}

// 그룹 수정 데이터를 DB에 업데이트하는 함수
function renameGroup(data) {
	// 해당 설정은 이름 입력에서 막았으므로 renameGroup 함수까지 오지 않기에 주석처리
	// 부모 그룹 아이디가 루트면 이름 변경 불가
	//if (body['parentgroupid'] == 'G0000000000000') return;
	var body = {};


	body['groupId'] = data['groupid'];
	body['groupName'] = data['groupname'];
	// 기존 고정 값에서 뎁스(폴더)에 따른 변동값으로 변경
	body['parentGroupId'] = data['parentgroupid'];
	body['groupPath'] = data['grouppath'];
	body['groupDesc'] = 'Aegis';
	body['email'] = 'Aegis';
	body['mobile'] = 'Aegis';
	body['fax'] = 'Aegis';
	body['tel'] = 'Aegis';
	body['managerName'] = 'Aegis';

	cf_requestServer(_TR_GROUP_UPDATE, body, function(data) {
		selectTree();
	});
}

function addGroup(groupName) {
	var body = {};
	if (!groupName || groupName.length < 2) {
		groupName = "undefined";
	}


	body['parentGroupId'] = 'G0000000000000';
	if (addDepth2Group['parentId']) { // 1뎁스 클릭하면 1뎁스 그룹id가 2뎁스 페어런츠 아이디로 등록
		body['parentGroupId'] = addDepth2Group['parentId'];
	}


	body['groupName'] = groupName;
	body['groupDesc'] = 'Aegis';
	body['email'] = 'Aegis';
	body['mobile'] = 'Aegis';
	body['fax'] = 'Aegis';
	body['tel'] = 'Aegis';
	body['managerName'] = 'Aegis';

	cf_requestServer(_TR_GROUP_INSERT, body, function(data) {
		selectTree();
	});
}



//그룹 추가(groups 에 저장되는 클러스터 자산)
function createGroup() {
	var treeName = 'Tree01';
	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	sel = ref.get_selected();
	if (sel == "" || sel == "G0000000000000") {
		cf_alert(null, '추가 할 그룹을 선택하세요.');
		return false;
	}

	var parentId = 'G0000000000000';
	if (addDepth2Group['parentId']) {
		// 1뎁스를 클릭하고 2뎁스 그룹 추가할시
		parentId = addDepth2Group['parentId'];
	}

	// 2023-06-21 현 caegis정책은 root그룹에 하위 그룹을 추가할 수 없습니다.
	// 하지만 기존 그룹에는 그룹추가가 가능
	if (parentId == 'G0000000000000') {
		swal("그룹 추가 실패", "root그룹에 그룹을 추가할 수 없습니다.", "./assets/images/icon_alert03.png", {
			buttons: "확인"
		});
		return false;
	}



	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=' + parentId + ']'));
	if (!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if (!pNode) return false;

	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	var newNode = { "cloudid": "", "type": "folder", "state": "open" };

	sel = ref.create_node(pNode, newNode);
	if (sel) {
		var groupName = ref.get_node(sel).text;
		ref.edit(sel, null, function() {
			if (groupName.length > 1) {
				addGroup(ref.get_node(sel).text);
			} else {
				cf_alert(null, '그룹이름은 2글자 이상 입력하세요');
				ref.delete_node(ref.get_node(sel));
			}
		});
	}

}

// 그룹 수정
function editGroup() {
	var treeName = 'Tree01';
	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	sel = ref.get_selected();
	if (sel == "" || sel == "G0000000000000") {
		cf_alert(null, '수정 할 그룹을 선택하세요.');
		return false;
	}
	// TO DO 루트 그룹에 폴더 추가 기능 개발시 기본 그룹만 수정 할 수 없게 변경
	else if (selectData['parentgroupid'] == "G0000000000000") {
		cf_alert(null, '기본 그룹은 수정 할 수 없습니다.');
		return false;
	}
	//	else if (selectData['groupid'] == "G0000000000002") {
	//		cf_alert(null, 'Registry 그룹은 수정 할 수 없습니다.');
	//		return false; // ROOT
	//	}
	else if (sel) {
		var data = dataMap[sel];
		var hardwareid = data['hardwareid'];
		var registryid = data['registry_uuid']; // hardware에 저장하지 않으므로 registry_uuid값을 찾도록 함

		/*if(sel=="G0000000000000") { // Aegis Tree 선택 시
			cf_alert(null, '최상위 그룹은 수정 할 수 없습니다.');
			return false; // ROOT
		}*/

		if (hardwareid || registryid) {
			cf_alert(null, '수정 할 그룹을 선택하세요.');
			return false; // Agent
		}

		var presentName = ref.get_node(sel).text;
		var originalName = presentName;


		var s = originalName.lastIndexOf('(');
		if (s > 0) {
			originalName = originalName.substring(0, s)
		}

		ref.rename_node(sel, originalName);
		setTimeout(function() {
			var newName = ref.get_node(sel).text;
			var agentList = ref.get_node(sel).children;
		}, 300);

		ref.rename_node(sel, originalName); // Agent 개수 없는걸로 변환
		ref.edit(sel, null, function() {
			var newName = ref.get_node(sel).text;
			var agentList = ref.get_node(sel).children;

			// TO DO 2뎁스를 넘어서 N 뎁스를 구현하면, agentlist.length로는 자산 갯수 못구함
			// 처음에 자산을 불러올때, 사용한 로직을 응용하면 될듯.
			if (newName == originalName) {
				ref.rename_node(sel, newName + '(' + agentList.length + '대)');
				return;
			} else if (newName.length < 2) {
				cf_alert(null, '그룹이름은 2글자 이상 입력하세요');
				ref.rename_node(sel, presentName);
			} else {
				data['groupname'] = newName;
				renameGroup(data);
				ref.rename_node(sel, newName + '(' + agentList.length + '대)');
			}
		});
	}

}

// 그룹 삭제
function deleteGroup() {
	var treeName = 'Tree01';
	var ref = $('#' + treeName + ' .tree_wrap').jstree(true),
		sel = ref.get_selected();

	if (sel == "") { // !sel x
		cf_alert(null, '삭제 할 그룹을 선택하세요.');
		return false;
	}

	if (sel == "G0000000000000") {
		cf_alert(null, '최상위 그룹은 삭제 할 수 없습니다.');
		return false; // ROOT
	}

	// 기본 그룹 삭제 불가능
	if (selectData['parentgroupid'] == "G0000000000000") {
		cf_alert(null, '기본 그룹은 삭제 할 수 없습니다.');
		return false; //
	}

	var children = ref.get_node(sel).children;
	if (children.length > 0) {
		cf_alert(null, '하위 노드가 있을 경우 삭제 하실 수 없습니다.');
		return false;
	}

	var data = dataMap[sel];
	if (data['hardwareid'] || data['registry_uuid']) {
		cf_alert(null, '삭제 할 그룹을 선택하세요.');
		return false;
	}

	swal("그룹 정보 삭제", "선택 한 그룹을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if (willDelete) {
			var body = {};
			body['groupId'] = data['groupid'];
			body['parentGroupId'] = data['parentgroupid'];
			cf_requestServer(_TR_GROUP_DELETE, body, function(data) {
				swal("그룹  정보 삭제", "정상적으로 처리되었습니다.", "./assets/images/icon_alert02.png", {
					buttons: "확인"
				});

				// ref.delete_node(sel);
				selectTree();
			});
		} else {
			swal("그룹 정보 삭제", "취소하였습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		}
	});
}


function setSelectIndex(sel, i) {
	$('#' + sel + ' option').removeProp("selected");
	$('#' + sel + ' option:eq(' + i + ')').prop("selected", "true");

	$('#' + sel).next().find('.list li').removeClass('focus selected');
	$('#' + sel).next().find('.list li:nth-child(' + i + ')').addClass('focus selected');
	$('#' + sel).next().find('span.current').text($('#' + sel + ' option:selected').val());
	//$("#service_state option").index( $("#service_state option:selected") );
}

function initTree(treeName) {
	var parentId = 'G0000000000000';
	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=' + parentId + ']'));
	if (!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if (!pNode) return false;

	var children = $('#' + treeName + ' .tree_wrap').jstree().get_node(pNode).children;
	$('#' + treeName + ' .tree_wrap').jstree('delete_node', children);
}

// 크론탭 검사 로직
function isValidCronExpression(expression) {
  // 크론텝 표현식을 검증하는 정규식
  var cronRegex = /^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$/;

  // 크론텝 표현식 유효성 검사
  if (!expression.match(cronRegex)) {
    return false;
  }
  // 크론텝 필드 값 유효성 검사
  var fields = expression.split(' ');
  // 필드 개수가 6개여야 함 (초, 분, 시, 일, 월, 주)
  if (fields.length !== 6) {
    return false;
  }
  // 큐오츠 스케줄러 스타일 '?' 문자 허용
  if (fields.includes('?')) {
    return true;
  }
  // 각 필드의 범위 유효성 검사
  for (var field of fields) {
    var parts = field.split('/');
    var value = parseInt(parts[0], 10);
    // 숫자 또는 '*' 또는 '?'이어야 함
    if (isNaN(value) && parts[0] !== '*' && parts[0] !== '?') {
      return false;
    }
    // '/' 뒤에는 숫자 또는 '*' 또는 '?'이어야 함
    if (parts[1] && (!/^\d+$/.test(parts[1]) || parseInt(parts[1], 10) <= 0)) {
      return false;
    }
  }
  return true;
}

// 자산 입력 목록 체크
function checkData() {
 
	if (!saveData['groupid']) {
		cf_alert(null, '소속 그룹을 선택해주세요.');
		return false;
	}
	if (!saveData['equipmarkname'] || saveData['equipmarkname'].length < 2) {
		cf_alert(null, '자산명을 기입해주세요.');
		return false;
	}
 
	// 호스트 자산일때.
	/*var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	if(!ipformat.test(selectData['masterip'])) {
		cf_alert(null, 'IP 정보를 형식에 맞게 기입해주세요.');
		return false;
	}*/
 
// 230110 type에 따른 check option 변경
	if ($('#type option:selected').val() == "Registry") {
		// 마스터 아이피 유무 체크
		if (!saveData['masterip']) {
			cf_alert(null, 'IP:포트번호(혹은 도메인명) 를 입력해주세요.');
			return false;
		}
		// IP:PORT 혹은 도메인 형식 체크
		//var domainformat = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+(?:\:[0-9]{1,})*$/; // :PORT 도 입력 가능
		var domainformat = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+$/;
		var ipformat = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):[0-9]{1,5}$/;
		var masterIpValue = saveData['masterip'].split(":");
						
		if(!domainformat.test(saveData['masterip'])) {  // 도메인 명 체크
			// 도메인 유효성 검사 미통과 시 ip:port로 체크.  
			// IP:PORT 형식체크
			if(!ipformat.test(saveData['masterip'])) { // ip 포트 번호 입력여부 체크
				cf_alert(null, 'IP:포트번호(혹은 도메인) 정보를 형식에 맞게 기입해주세요.'); // 둘 다 안맞는 경우에만 에러
				return false;
			}
			// ip에 :을 두번 입력한 경우
			if (masterIpValue[1] > 65535 || masterIpValue[1] < 0) {
				cf_alert(null, '포트 범위를 벗어났습니다.');
				return false;
			}
		}
		// vendor name 이 설정되지않는 경우 
		if (saveData['registry_vendor_name'] == "") {
			cf_alert(null, 'Vendor 정보를 기입해주세요.');
			return false;
		}
		
		// Registry Type 에 따라 검사 여부 변경
		if(saveData['registry_type'] == "PRIVATE"){
			// id password
			if (!saveData['registry_user'] || !saveData['registry_pw']) {
				cf_alert(null, 'Registry 접속 정보를 정확하게 기입해주세요.');
				return false;
			}
			// 인증서 관련
			if (!saveData['tls_cert'] || saveData['tls_cert'].length < 2) {
				cf_alert(null, '인증서 정보를 기입해주세요.');
				return false;
			}
		}
		else if(saveData['registry_type'] == "PUBLIC"){
			// 자동 분석 여부
			if((saveData['auto_scan'] == "T" && saveData['registry_vendor_name']=="Docker Registry")){
				cf_alert(null, 'Docker Regisrty 에는 자동분석을 지원하지않습니다.');
				return false;
			}
			// id혹은 password 중 하나라도 있는 경우 체크
			if ((saveData['registry_user'] && !saveData['registry_pw'])
				||(!saveData['registry_user'] && saveData['registry_pw'])) {
				cf_alert(null, 'Registry 접속 정보를 정확하게 기입해주세요.');
				return false;
			}
			// 인증서 관련
			if (!saveData['tls_cert'] || saveData['tls_cert'].length < 2) {
				cf_alert(null, '인증서 정보를 기입해주세요.');
				return false;
			}
		}
		
		// 자동 분석 ON 일떄, 자동분석 실행 주기가 입력이 안된 경우
		if (saveData['auto_scan'] == "T" && !saveData['auto_scan_cycle']) {
			cf_alert(null, '자동분석 실행 주기를 정확하게 기입해주세요.');
			return false;
		}
		// 자동 분석 ON 일떄, 자동분석 실행 주기가 있는 경우, 크론텝 표현식 유효성 검사
		if (saveData['auto_scan'] == "T" && !isValidCronExpression(saveData['auto_scan_cycle'])){
		  	cf_alert(null, '자동분석 실행 주기를 예시 형식에 맞게 기입해주세요.');
			return false;
		}
		// 11-02 추가, Vendor 정보가 RedHat Quay 이면서, OAuthToken값이 비었을 경우, 입력 유무 체크
		if(saveData['registry_vendor_code'] === "REGV03" && (saveData['oauth_token'] == null||saveData['oauth_token'] == "")){
			cf_alert(null, 'OAuth Token값을 입력해주세요');
			return false;
		}
	}
	else if ($('#type option:selected').val() == "HostSecurity") {
		if (!saveData['osver']) {
			cf_alert(null, 'OS 정보를 정확하게 기입해주세요.');
			return false;
		}
 
		if (!saveData['service_state'] || !saveData['log_state'] || !saveData['log_count']) {
			cf_alert(null, '자산 연동 설정 정보를 입력하세요.');
			return false;
		}
 
		if (saveData['log_count'] < 10) {
			cf_alert(null, '초당 로그 수집 건수는 최소 10건 이상입니다.');
			return false;
		}
		// 2023-06-19 [caegis] 변경 내용 확인 -> ip 유효성 검사가 하단에 ipcheck로 분리 되었음을 확인
	}
	else if ($('#type option:selected').val() == "ContainerSecurity") {
		var alertName = "유효성 없음";
		var masterIPName = "IP";
 
		// 자산 위치가 null값인 경우 -로 치환
		if (!saveData['location'] || saveData['location'].length < 2) {
			saveData['location'] = "-";
		}
		// os 정보가 null값인 경우 -로 치환
		if (!saveData['osver'] || saveData['osver'].length < 2) {
			saveData['osver'] = "-";
		}
 
 
		/*		// 형식 체크와 메세지 리턴
				var urlCheckedResult = validateCheckUrl(saveData['masterip']);
				if (!urlCheckedResult.isValidated) {
					cf_alert(alertName, '도메인 URL: ' + urlCheckedResult.message);
					return false;
				}
		*/
 
		// 마스터 아이피에 :이 들어있는지 체크
		if (!saveData['masterip'].includes(':')) {
			cf_alert(alertName, masterIPName + ':   \' : \'을 표시하여 포트번호를 입력해주세요.');
			return false;
		} else {
			var masterIpValue = saveData['masterip'].split(":");
			// ip에 :을 두번 이상 입력한 경우
			if (masterIpValue[2]) {
				/*				cf_alert(alertName, masterIPName + ': 잘못된 주소 형식입니다.');
								return false;*/		
				// saveData에 가공한 ip정보 변경 및 추가
				saveData['masterip'] = masterIpValue[0]+':'+masterIpValue[1];
				saveData['masterport'] = parseInt(masterIpValue[2]);
				console.log('masterIP: '+saveData['masterip']);
				console.log('masterport: '+saveData['masterport']);
				
			} else { // IP
 
/*				if (!ipCheck(masterIpValue[0])) {
					cf_alert(alertName, masterIPName + ': IP 형식에 맞지 않습니다.');
					return false;
				}
				if (masterIpValue[1] > 65535 || masterIpValue[1] < 0) {
					cf_alert(alertName, masterIPName + ': 포트 범위를 벗어났습니다.');
					return false;
				}
*/
				// saveData에 가공한 ip정보 변경 및 추가
				saveData['masterip'] = masterIpValue[0];
				saveData['masterport'] = parseInt(masterIpValue[1]);
			}
				console.log('masterIP: '+saveData['masterip']);
				console.log('masterport: '+saveData['masterport']);
		}
 
 
 
 
		// 자동분석주기가 T인데 주기가 없다면.
		if (saveData['cluster_auto_scan'] == "T" && !saveData['cluster_auto_scan_cycle']) {
			cf_alert(null, '자동분석 실행 주기를 정확하게 기입해주세요.');
			return false;
		}
 
		// 자동 분석 ON 일떄, 자동분석 실행 주기가 있는 경우, 크론텝 표현식 유효성 검사
		if (saveData['cluster_auto_scan'] == "T" && !isValidCronExpression(saveData['cluster_auto_scan_cycle'])) {
			cf_alert(null, '자동분석 실행 주기를 예시 형식에 맞게 기입해주세요.');
			return false;
		}
 
		// 2023-08-24 webhook 유효성 체크 수정 > 이성호
		// 웹훅 URL이 있다면 형식 체크
		if (saveData['webhook_url']) {
			// 형식 체크와 메세지 리턴
			var urlCheckedResult = validateCheckUrl(saveData['webhook_url']);
			if (!urlCheckedResult.isValidated) {
				cf_alert(alertName, '웹훅 서버 URL: ' + urlCheckedResult.message);
				return false;
			}
		}
 
		// 웹훅 타임아웃 시간은 무조건 기입되게 default 10초로 설정되며 60초를 넘기지 못하도록 되어있으므로 체크하지 않습니다.
		/*if (saveData['cs_webhook_timeout'] < 1) {
			cf_alert(null, '웹훅 서버 타임아웃을 기입해주세요.');
			return false;
		}*/
 
		// 인증서 관련
		// ca인증서와 auth토큰에 대한 값을 모두 확인후 둘다 변경한다는것
		if (!saveData['ca_data'] || saveData['ca_data'].length < 2) {
			cf_alert(alertName, 'CA인증서: 값을 입력해주세요.');
			return false;
		}
		if (!saveData['ca_auth'] || saveData['ca_auth'].length < 2) {
			cf_alert(alertName, 'Auth Token: 값을 입력해주세요.');
			return false;
		}
 
		// base64인코딩하여 인증서 관련 정보 변경
		//saveData['ca_data'] = Base64.encode(saveData['ca_data']);
		//saveData['ca_auth'] = Base64.encode(saveData['ca_auth']);
 
 
		saveData['ca_data'] = btoa(saveData['ca_data'] + '\n');
		saveData['ca_auth'] = btoa(saveData['ca_auth']);
 
		// 길이체크
		// 자산명
		if (saveData['equipmarkname'].length > 50) {
			cf_alert(alertName, '자산명의 길이 제한은 50글자입니다.');
			return false;
			// 웹훅 URL
		} else if (saveData['location'].length > 30) {
			cf_alert(alertName, '자산위치의 길이제한은 30글자입니다.');
			return false;
		} else if (saveData['osver'].length > 128) {
			cf_alert(alertName, 'OS 길이제한은 128글자입니다.');
			return false;
		} else if (saveData['webhook_url'].length > 100) {
			cf_alert(alertName, '웹훅 URL의 길이제한은 100글자입니다.');
			return false;
		}
 
		// 크론식 체크
		if (saveData['cluster_auto_scan'] === 'T' && !(validateCronTest(saveData['cluster_auto_scan_cycle']))) {
			cf_alert(null, '잘못된 크론 표현식입니다.');
			return false;
		}
		
	}
	else {
		cf_alert("오류", '타입이 잘못되었습니다.');
		return false;
	}
 
	return true;
}
// url 형식인지 체크
// return : object
function validateCheckUrl(strUrl, isHavePort) {
	var result = {
		isValidated: false,
		message: "url형식이 아닙니다."
	};
	var httpsExpUrl = /^https[s]?:\/\/([\S]{3,})/i;
	var httpExpUrl = /^http[s]?:\/\/([\S]{3,})/i;
	var domainformat = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+$/;
 
	if (httpsExpUrl.test(strUrl)) {
		result.isValidated = true;
		result.message = "url 형식입니다.";
		return result;
	} else if (isHavePort && domainformat.test(strUrl)) {
		result.isValidated = true;
		result.message = "url:port 형식입니다.";
		return result;
	} else if (isHavePort) {
		result.isValidated = false;
		result.message = "url:port형식이 아닙니다.";
	} else if (httpExpUrl.test(strUrl)) {
		result.isValidated = false;
		result.message = "\'http\'는 지원하지 않습니다. \'https\'를 사용하여 주십시오.";
		return result;
	}
	return result;
}

//크론식을 패턴 Test 
function validateCronTest(cronJob) {
	var patternForQuartzCron = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;

	return patternForQuartzCron.test(cronJob);
}

// 0113 ip 유효성 검사 추가
function ipCheck(ip) {
	var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

	if (!ipformat.test(ip)) {
		return false; // 형식에 맞지 않음
	}
	return true

}

function selTreeNode() {
	var treeName = 'Tree02';
	var ref = $('#' + treeName + ' .tree_wrap').jstree(true),
		sel = ref.get_selected();

	if (sel) {
		var data = dataMap[sel];

		$('#groupid').val(data['groupid']);
		$('#groupname').val(data['groupname']);
	}
}

// 웹훅서버타임아웃의 최소값은 10 최대값은 30
function whTimeCheck() {
	if ($("#cs_webhook_timeout").val() < 10) {
		$("#cs_webhook_timeout").val(10);
		cf_alert(null, '웹훅 타임아웃의 범위제한은 10~30초 입니다.');
	}
	else if ($("#cs_webhook_timeout").val() > 30) {
		$("#cs_webhook_timeout").val(30);
		cf_alert(null, '웹훅 타임아웃의 범위제한은 10~30초 입니다.');
	}
}

function devGroupAdd() {
	var devGroupDataWebHook = {
		"groupname": "WebHook",
		"groupid": "devModeWebHook",
		"parentgroupid": "G0000000000003"
	}
	var devGroupDataCSP = {
		"groupname": "CSP",
		"groupid": "devModeCSP",
		"parentgroupid": "G0000000000003"
	}

	typeTempData['devModeWebHook'] = "WebHook";
	typeTempData['devModeCSP'] = "CSP";

	addGroupNode('Tree01', "G0000000000003", devGroupDataWebHook);
	addGroupNode('Tree01', "G0000000000003", devGroupDataCSP);


}

function dataCheckTypeGroupid(type, value) {
	// 컨테이너 이벤트 일시.
	if (typeTempData[value['groupid']] == "ContainerSecurity") {
		if (value['model'] == "WEBHOOK") {
			value["groupid"] = "devModeWebHook";
		} else if (value['model'] == "CSP") {
			value["groupid"] = "devModeCSP";
		}
		addAgentNode('Tree01', value["groupid"], value);
	}
}

function showPlaceholderIfNeeded() {
	if ($("#scanAbleFramework .scan_able_list").length === 0) {
		$("#scanAbleFramework .scan_framework_placeholder").show();
	} else {
		$("#scanAbleFramework .scan_framework_placeholder").hide();
	}

	if ($("#scanTargetFramework .scan_target_list").length === 0) {
		$("#scanTargetFramework .scan_framework_placeholder").show();
	} else {
		$("#scanTargetFramework .scan_framework_placeholder").hide();
	}
}

// kimsw
function selectComplianceFrameworkList(clusterUuid) {
	var body = {};
	body['clusterUuid'] = clusterUuid;
	cf_requestServer(_TR_CLUSTER_FRAMEWORK_SELECT, body, lf_serviceCall800145CallBack, false);
}

// 가져온 compliance List selectData추가
function lf_serviceCall800145CallBack(data) {
	var baseComplianceFrameworkList = data.body.baseComplianceFrameworkList;
	var clusterComplianceFrameworkList = data.body.clusterComplianceFrameworkList;

	var complianceFrameworkList;

	if (clusterComplianceFrameworkList.length > 0) {
		complianceFrameworkList = mergeComplianceFramework(clusterComplianceFrameworkList, baseComplianceFrameworkList);
	} else {
		complianceFrameworkList = baseComplianceFrameworkList;
	}

	selectData['complianceFrameworkList'] = complianceFrameworkList;
}

// 커스텀이 아닌 것들 중에
function mergeComplianceFramework(clusterComplianceFrameworkList, baseComplianceFrameworkList) {
	// BASE의  is_user_enabled는 기본적으로 F로 설정
	$.each(baseComplianceFrameworkList, function(index, obj) {
		obj.is_user_enabled = 'F';
	});

	var defaultClusterComplianceFrameworkList = clusterComplianceFrameworkList.filter((item) => item.type === 'DEFAULT');
	var custumClusterComplianceFrameworkList = clusterComplianceFrameworkList.filter((item) => item.type === 'CUSTOM');

	var complianceFrameworkList = [];
	var nameInClusterComplianceFrameworkList = new Set(defaultClusterComplianceFrameworkList.map((item) => item.name));
	var nameInBaseComplianceFrameworkList = new Set(baseComplianceFrameworkList.map((item) => item.name));
	// base에 속하는 ClusterComplianceFrameworkList로 complianceFrameworkList 초기화
	complianceFrameworkList = defaultClusterComplianceFrameworkList.filter((item) => nameInBaseComplianceFrameworkList.has(item.name));

	// complianceFrameworkList.name만을 갖는 List 선언 및 할당
	var nameInComplianceFrameworkList = new Set(complianceFrameworkList.map(item => item.name));
	// baseComplianceFrameworkList.name 중 nameInComplianceFrameworkList에 속하지 않는 값을  찾아 complianceFrameworkList에 push
	$.each(baseComplianceFrameworkList, function(index, baseItem) {
		if (!nameInComplianceFrameworkList.has(baseItem.name)) {
			complianceFrameworkList.push(baseItem);
		}
	});
	// custum 규정준수 넣기
	$.each(custumClusterComplianceFrameworkList, function(index, obj) {
		complianceFrameworkList.push(obj);
	});

	return complianceFrameworkList;
}

function initActivateFramework(complianceFrameworkList, callOut) {
	var CALL_OUT_ADD = 'addBtn';
	var CALL_OUT_MODIFY = 'modifyBtn';

	if (complianceFrameworkList) {
		$("#scanAbleFramework .scan_able_list").remove();	// 스캔가능 프레임워크
		$("#scanTargetFramework .scan_target_list").remove();	// 스캔대상 프레임워크

		$.each(complianceFrameworkList, function(index, item) {
			if (callOut === CALL_OUT_ADD && item.type==="DEFAULT") {
				// 2023-09-20 이성호 추가 > 자산 생성시에는 기본 프레임 워크만 띄우기
				var elementId = '#' + item.id;
				var html = '<div class="scan_target_list" id="' + item.id + '">' + item.name + '</div>';
				$('#scanTargetFramework').append(html);
				$(elementId).attr('data-name', item.name);

			} else if (callOut === CALL_OUT_MODIFY) {
					var title = "";
					var name = "";
					var elementId = '#' + item.id;
					var className ="";
					var idName="";
				if (item.is_user_enabled === "T") {
					
					className = "scan_target_list";
					idName = "scanTargetFramework";
					
					if(item.is_scannable==="T"){//스캔 가능하다고 판단
						title = "스캔 가능";
						name = item.name;
					}else if(item.is_user_enabled==="T"){// 스캔 불가능하지만 유저가 활성화 시켰을떄.
						name = item.name +"<b>[X]</b>";
						if(item.not_scannable_reason){// 스캔 불가 사유 있을때
							title = item.not_scannable_reason;
						}else{// 스캔 불가 사유 없을때.
							title ="프레임워크 활성화 필요";
						}
					}/*else{// 스캔 불가능, 유저 비활성화
						name = item.name +"<b>[X]</b>";
						if(item.not_scannable_reason){// 스캔 불가 사유 있을때
							title = item.not_scannable_reason;
						}else{// 스캔 불가 사유 없을때.
							title ="스캔가능 여부 요청필요";
						}
					}*/
					
				} else {// 유저 비활성화된 목록
					name = item.name +"<b>[X]</b>";
					title ="프레임워크 활성화 필요";
					className= "scan_able_list";
					idName = "scanAbleFramework";
				}
				var html = '<div class="'+className+'" id="' + item.id + '" value="' + item.is_scannable + '" title="'+title+'">' + name + '</div>';
				$('#'+idName).append(html);
				$(elementId).attr('data-name', item.name);
			}
		});
	}

	showPlaceholderIfNeeded();

	$('#scanTargetFramework').mCustomScrollbar("destroy");
	$('#scanAbleFramework').mCustomScrollbar("destroy");
	mscrollbar();
}

// left box option
$(function() {
	$(".computer_box_left").resizable(
		{
			minWidth: 360,
			maxWidth: 600,
			handles: "e",
			resize: function(e, ui) {
				var currentWidth = ui.size.width;
				var gap = 10;
				currentWidth += gap;
				$(".computer_box_right").css("width",
					"calc(100% - " + currentWidth + "px)");
				$('.tree').mCustomScrollbar({
					autoExpandScrollbar: "true",
					axis: "yx",
					scrollInertia: 600,
				});
			}
		});
	$('.tree').mCustomScrollbar({
		autoExpandScrollbar: "true",
		axis: "yx",
		scrollInertia: 600,
	});

	$("#addBtn").on("click", function() {
		var treeName = 'Tree01';
		var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
		var complianceFrameworkList = selectData['complianceFrameworkList'];
		sel = ref.get_selected();
		if (sel == "" || sel == "G0000000000000") {
			cf_alert(null, '자산을 추가 할 그룹을 선택하세요.');
			return false;
		}
		$("#editCheck").val("insert");
		$(".edit_box").addClass("on");
		$(".info").removeClass("on");
		$(".cs_edit_crt_status").hide();

		var groupid = selectData["groupid"];

		$('#groupid').children('option:not(:first)').remove();

		// 자산 생성시 default 그룹이면 그룹 선택이 가능
		if (groupid == "G0000000000001" || groupid == "G0000000000002" || groupid == "G0000000000003") {
			$('#groupid').append("<option value='G0000000000001'>Hosts</option>");
			$('#groupid').append("<option value='G0000000000002'>Registry</option>");
			$('#groupid').append("<option value='G0000000000003'>Clusters</option>");
		} else {// default 그룹이 아니면, 선택한 그룹만 강제 선택
			var dapthView = dataMap[treeNodeMap["Tree01_" + dataMap[treeNodeMap["Tree01_" + groupid]]["parentgroupid"]]]["groupname"] + " > ";
			$('#groupid').append("<option value='" + groupid + "'>" + dapthView + dataMap[treeNodeMap["Tree01_" + groupid]]["groupname"] + "</option>");
		}

		$("#groupid").niceSelect("update");
		initAgent();
		if (ref["_model"]["data"][sel]["type"] != "folder") {
			$("#modifyGroupBtn").hide();
			$("#removeGroupBtn").hide();
		}
		if (typeTempData[groupid] == "ContainerSecurity") {
			$(".cs_option #cluster_tls_cert_status").parent().addClass("hidden");
			$("#cluster_webhook_status").html("<div><div style='margin-top: 3px;' class='icon_cert_status_check false'></div></div>"); // 자산 추가시 웹훅 연결상태에 들어갈 값
			$("#cluster_webhook_status_word").html("invalid"); // 자산 추가시 웹훅 연결상태에 들어갈 값
			$(".edit_line").removeClass("hidden");
			$(".edit_box").removeClass("edit_box_no_border");
			$(".computer_box_right .edit").addClass("edit_no_border");
		} else {
			$(".registry_option #is_registered_tls_status").parent().addClass("hidden"); // 추가 버튼 클릭 시 registry tls status 옵션 숨김
			$(".cs_option #cluster_tls_cert_status").parent().addClass("hidden");
			$(".edit_line").addClass("hidden");
			$(".edit_box").addClass("edit_box_no_border");
			$(".computer_box_right .edit").removeClass("edit_no_border");
		}

		initActivateFramework(complianceFrameworkList, 'addBtn');
		unifyHeight();
	});

	$("#modifyBtn").on("click", function() {
		clickNode();
		clusterUuidData="";
		$("#editCheck").val("update");
		$(".edit_box").addClass("on");
		$(".info").removeClass("on");
		$(".cs_edit_crt_status").show();
		$("#modifyBtn").hide();

		// 선택지 지우기
		$('#groupid').children('option:not(:first)').remove();

		$.each(typeTempData, function(index, item) {
			// 자산 수정시 동일 타입 그룹만 선택가능> 자신만 선택되게 변경
			// 추가로 바로 밑 if문만 제거하여 자산추가에 each안에 있는 내용을 그대로 넣으면 자산 추가시에도 그룹의 부모자식 관계 표현 가능
			if (typeTempData[selectData["groupid"]] == item) {
				// 수정시 뎁스 위치 표기하는데 있어서 default 그룹은 추가적인 표기 없음
				if (index == "G0000000000001" || index == "G0000000000002" || index == "G0000000000003") {
					$('#groupid').append("<option value='" + index + "'>" + dataMap[treeNodeMap["Tree01_" + index]]["groupname"] + "</option>");
				} else {	// default 그룹을 제외한 나머지 그룹은 자신이 속한 default 그룹의 이름을 자신의 이름 앞에 배치
					var dapthView = dataMap[treeNodeMap["Tree01_" + dataMap[treeNodeMap["Tree01_" + index]]["parentgroupid"]]]["groupname"] + " > ";
					$('#groupid').append("<option value='" + index + "'>" + dapthView + dataMap[treeNodeMap["Tree01_" + index]]["groupname"] + "</option>");
				}
			}
		});
		$("#groupid").val(selectData["groupid"]).niceSelect("update");
		$("#groupid").niceSelect("update");

		if (typeTempData[selectData["groupid"]] == "ContainerSecurity") {
			// 수정시 masterip를 변경할 수 없으므로 readonly 속성 추가
			$("#masterip").attr("readonly", true);
		} else {// 자산 수정이 아닐시 false > 수정은 초기화과정을 안거치기에 추가
			$("#masterip").attr("readonly", false);
		}

		// kimsw
		$("#scanAbleFramework .scan_able_list").remove();	// 스캔가능 프레임워크
		$("#scanTargetFramework .scan_target_list").remove();	// 스캔대상 프레임워크
		initActivateFramework(selectData.complianceFrameworkList, 'modifyBtn');

		if (typeTempData[selectData["groupid"]] == "ContainerSecurity") {
			$(".cs_option #cluster_tls_cert_status").parent().removeClass("hidden");
			$(".edit_line").removeClass("hidden");
			$(".edit_box").removeClass("edit_box_no_border");
			$(".computer_box_right .edit").addClass("edit_no_border");
		} else {
			$(".registry_option #is_registered_tls_status").parent().removeClass("hidden"); // 수정 버튼 클릭 시 registry tls status 옵션 표시
			$(".cs_option #cluster_tls_cert_status").parent().addClass("hidden");
			$(".edit_line").addClass("hidden");
			$(".edit_box").addClass("edit_box_no_border");
			$(".computer_box_right .edit").removeClass("edit_no_border");
		}

		unifyHeight();
	});

	$("#removeBtn").on("click", function() {
		deleteAgent();
	});

	$("#saveBtn").on("click", function() {
		saveBtn();
	});

	$("#cancelBtn").on("click", function() {
		clickNode(); // 230808:kimsw 자산 추가 후 취소 하게되면 init 후 초기화된 selectData를 참조함으로 버그 발생하는 현상 수정
		$(".edit_box").removeClass("on");
		$(".info").addClass("on");
	});

	$('a.createGroup').on('click', function() {
		// 그룹 추가시 트리를 클릭한 현황에 따라 그룹 생성 가능
		createGroup();
	});
	$('a.createAgent').on('click', function() {
		initAgent();
	});
	$('a.renameGroup').on('click', function() {
		editGroup();
	});
	$('a.deleteGroup').on('click', function() {
		deleteGroup();
	});
	$('a.deleteAgent').on('click', function() {
		deleteAgent();
	});
	$('a.vulnerablilityAgent').on('click', function() {
		vulnerabilityAgent();
	});

});

$(document).ready(function() {
});

$(function() {
	$('#Tree01 .tree_wrap')
		.jstree(
			{
				"core": {
					"animation": 0,
					"check_callback": true,
					'force_text': true,
					"themes": {
						"stripes": false
					},
					check_callback: function(operation, node,
						node_parent, node_position, more) {
						if (operation === "move_node"
							&& more.ref === undefined) {
							var pData = dataMap[node_parent.id];
							var cData = dataMap[node.id];

							if (!pData)
								return false; // 부모 데이터 -> 이동할 목적지의 데이터
							if (!cData)
								return false; // 자식데이터 -> 이동시킬 대상의 데이터

							// typeTempData를 통해 드로그앤 드랍에서 타입에 따라서 같은 타입 내에서만 이동이 가능하며
							// pData의 부모그룹 아이디의 존재를 통해서 부모 그룹 아이디가 존재하면 이동할 목적지가 그룹이기에 이동이 가능
							// cData의 부모그룹 아이디의 존재를 통해서 부모그룹 아이디가 존재하면 이동할 대상이 그룹이기에 그룹간의 이동을 막았으며
							if (!cData["parentgroupid"]
								&& pData["parentgroupid"]
								&& typeTempData[pData["groupid"]] == typeTempData[cData["groupid"]])
								return moveNode(
									pData,
									cData,
									typeTempData[cData["groupid"]]);

							// 조건에 안맞으면 default retrun값은 false
							return false;
						}
					}
				},
				"types": {
					"cloudid": {},
					"file": {
						'icon': 'jstree-file'
					},
					"file_offline": {
						'icon': 'jstree-file_offline'
					},
					'folder': {
						'icon': ''
					},
					"file_notcheck": {
						'icon': 'jstree-file_notcheck'
					}
				},
				// "types" : {
				//     "#" : { "max_children" : 1, "max_depth" : 4, "valid_children" : ["root"] },
				//     "root" : { "icon" : "assets/images/tree_icon.png", "valid_children" : ["default"] },
				//     "default" : { "valid_children" : ["default","file"] },
				//     "file" : { "icon" : "file", "valid_children" : [] }
				// },
				"dnd": {
					"drop_finish": function() {
						alert("DROP");
					},
					"drag_check": function(data) {
						alert("CHECK");
						if (data.r.attr("id") == "phtml_1") {
							return false;
						}
						return {
							after: true,
							before: true,
							inside: true
						};
					},
					"drag_finish": function(data) {
						alert("DRAG OK");
					}
				},
				'contextmenu': {
					"items": function(node) {
						var items = {
							"addgroup": { //사실상 "test"라는 변수를 사용
								"separator_before": false,
								"separator_after": true,
								"label": "그룹추가",
								"action": function(obj) {
									createGroup();
								}
							},
							"modifygroup": {
								"separator_before": false,
								"separator_after": true,
								"label": "그룹수정",
								"action": function(obj) {
									editGroup();
								}
							},
							"deletegroup": {
								"separator_before": false,
								"separator_after": true,
								"label": "그룹삭제",
								"action": function(obj) {
									deleteGroup();
								}
							},
							"addagent": {
								"separator_before": false,
								"separator_after": true,
								"label": "자산추가",
								"action": function(obj) {
									$("#addBtn").trigger("click");
								}
							},
							"modifyagent": {
								"separator_before": false,
								"separator_after": true,
								"label": "자산수정",
								"action": function(obj) {
									$("#modifyBtn").trigger("click");
								}
							},
							"deleteagent": {
								"separator_before": false,
								"separator_after": true,
								"label": "자산삭제",
								"action": function(obj) {
									$("#removeBtn").trigger("click");
								}
							}


						}	// items 객체 끝

						// 보여줄 라벨에서 불필요한 요소 삭제
						if (node.type == "folder" && node.parent == "G0000000000000") { // 기본 그룹 정의 > 부모가 ROOT이고, 폴더면 기본그룹
							delete items.modifygroup;
							delete items.deletegroup;
							delete items.modifyagent;
							delete items.deleteagent;
						} else if (node.type == "folder") { // 페어런츠가 루트가 아닌데, 타입이 폴더면 2뎁스 그룹
							delete items.addgroup;
							delete items.modifyagent;
							delete items.deleteagent;

							if (runMode == _DEVMODE && (node.original.cloudid == "devModeWebHook" || node.original.cloudid == "devModeCSP")) {
								delete items.modifygroup;
								delete items.deletegroup;
								delete items.addagent;
							}
						} else { // 타입이 폴더가 아니면 자산
							delete items.addgroup;
							delete items.modifygroup;
							delete items.deletegroup;
							if (runMode == _DEVMODE) {
								var targetNodeId = $('#Tree01 .tree_wrap').jstree(true)['_model']['data'][node.parent]['original']['cloudid'];
								if (targetNodeId == "devModeWebHook" || targetNodeId == "devModeCSP") {
									delete items.modifyagent;
									delete items.deleteagent;
									delete items.addagent;
								}
							}
						}
						return items;
					},// "items 벨류 끝"	
					"show_at_node": false
				},
				"plugins": ["contextmenu", "state", "types",
					"dnd", "wholerow"],
			}).bind("dblclick.jstree", function(event) {
				//Double Click to Rename
				// 대상이 기본 그룹이 아니고, 타입이 폴더일때만 리네임을 허용			
				var targetNode = $('#Tree01 .tree_wrap').jstree('get_selected', true);
				if (targetNode[0]["parent"] != "G0000000000000" && targetNode[0]["type"] == "folder" && targetNode[0]["original"]["cloudid"] != "devModeWebHook" && targetNode[0]["original"]["cloudid"] != "devModeCSP") {
					editGroup();
				}
			}).bind("select_node.jstree", function(event, data) {
				//click.jstree > select_node.jstree 변경, 좌우클릭에 대한 선택시 데이터를 넣도록 변경
				clickNode();
			}).bind("click.jstree", function(event, data) {
				// 클릭한것이 폴더의 아이콘일때 폴더를 클릭하도록 설정unify
				// if문 조건이 긴 이유는 중간에 키값을 건너뛰고 내부 키값에 접근하여 질의시 중간에 건너뛴 키값이 없으면 에러가 발생하기 때문
				if (event['target'] && event['target']['nextElementSibling'] && event['target']['nextElementSibling']['attributes'] && event['target']['nextElementSibling']['attributes']['id'] && event['target']['nextElementSibling']['attributes']['id']['value']) {
					$("#" + event['target']['nextElementSibling']['attributes']['id']['value']).trigger("click");
				}
			});
	$('.tree_wrap').on("change.jstree", function(e, data) {
		//$(".tree").mCustomScrollbar('update');
		//var ref = $('.tree_wrap').jstree(true),
		//	sel = ref.get_selected();                

	});
});
/*
$(function () {
$('#Tree02 .tree_wrap').jstree({
"core" : {
"animation" : 0,
"check_callback" : true,
'force_text' : true,
"themes" : { "stripes" : false },
},
"types" : {
"file" : {
'icon': 'jstree-file'
},
'folder' : {
'icon': 'jstree-folder'
}
},
"plugins" : [ "state", "types", "wholerow"],
}).bind("click.jstree", function (event) {
//Double Click to Rename
selTreeNode();
});
});
*/

// left, reight content 높이 통일 
function unifyHeight() {
	var leftBox = $('.cloud_manager_computer_box_left');
	var reightBoxHeight = $('.cloud_manager_computer_box_right').height();

	leftBox.attr('style', 'height: ' + (reightBoxHeight) + 'px !important;');
}
