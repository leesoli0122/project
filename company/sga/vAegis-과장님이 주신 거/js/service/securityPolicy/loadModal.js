var isUpdatablePolicy = false;

const _ANY = 'ANY';
const _EMPTY_REV = '-';
const _DIV_INDIVIDUAL = 'individual';
const _CLASS_INDIVIDUAL = 'ind';
const _CLASS_NOT = 'not';
const _CLASS_NONE = 'none';
const _REL_POLICY_ADD_SUFFIX = '_add';
const _CLASS_POLICY_ADD = 'policy_add';
const _CLASS_POLICY_EDIT = 'policy_edit';
const _POLICY_IPS = 'ips';
const _POLICY_FW = 'firewall';
const _POLICY_MAL = 'malware';
const _POLICY_FILE = 'fileint';
const _POLICY_APPCTL = 'appctl';
const _POLICY_PAMACL = 'pamacl';
const _POLICY_IMAGESECURITY = 'imageSecurity'; // 이미지 시큐리티 추가
const _NEW_REV = 'NEW';
const _MODAL_ASSET = 'assetediting_modal';
const _MODAL_POLICY = 'policyediting_modal_';
const _MODAL_POLICY_IPS_ID = 'policyediting_modal_ips'; // IPS
const _MODAL_POLICY_MALWARE_ID = 'policyediting_modal_malware'; // MALWARE
const _MODAL_POLICY_FW_ID = 'policyediting_modal_firewall'; // Firewall
const _MODAL_POLICY_FILE_ID = 'policyediting_modal_file'; // 파일무결성 / 실행 파일 통제
const _MODAL_POLICY_PAMACL_ID = 'policyediting_modal_pamacl'; // 서비스 제어
const _MODAL_ASSET_RIGHT_IPS_ID = 'assetPolicyListTable_ips'; // IPS
const _MODAL_ASSET_RIGHT_MALWARE_ID = 'assetPolicyListTable_malware'; // Malware
const _MODAL_ASSET_RIGHT_FW_ID = 'assetPolicyListTable_fw'; // Firewall
const _MODAL_ASSET_RIGHT_FILE_ID = 'assetPolicyListTable_file'; // 파일무결성 / 실행 파일 통제
const _MODAL_ASSET_RIGHT_PAMACL_ID = 'assetPolicyListTable_pamacl'; // 파일무결성 / 실행 파일 통제
const _MODAL_HEADER = {
	[_POLICY_IPS]: '침입방지시스템',
	[_POLICY_FW]: '방화벽',
	[_POLICY_MAL]: '멀웨어',
	[_POLICY_FILE]: '파일무결성',
	[_POLICY_APPCTL]: '실행 파일 통제',
	[_POLICY_PAMACL]: '서비스 제어'
};

const _MODAL_HEADER_PREFIX = 'policy_';

const _TF_MODE = {
	'OFF': 0,
	'ON': 1
};

const _MODE = {
	'SKIP': 4,
	'ON': 3,
	'OFF': 0,
	'WARN': 1
};

const _SCANMODE = {
	'OFF': 0,
	'MOVE': 4,
	'COPY': 8,
	'REMOVE': 16,
	'EXECACL': 32
};

var selectAgent;

const _WHITE_LIST = 5000;
const _BLACK_LIST = 5001;

const _TARGET_DEFAULT = 100;
const _TARGET_USER = 101;
const _TARGET_GROUP = 102;
const _TARGET = {
	'기본': _TARGET_DEFAULT,
	'사용자': _TARGET_USER,
	'그룹': _TARGET_GROUP
};

function lf_setModal() {
	lf_addClickEventModal();
}


function lf_addClickEventModal() {
	$('a[rel="policy_hist"]').off('click');
	$('a[rel="policy_hist"]').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();

		createDim();

		var $self = $(this);
		var $thisrel = $self.attr("rel");
		var $thisname = $self.attr("name");
		var policyData = JSON.parse($self.parents('li').find('input:hidden[name=policyData]').val());
		lf_historyPolicy($thisname, policyData);
		$("#policy_hist").show();
	});
	$('a[rel="policy_edit"]').off('click');
	$('a[rel="policy_edit"]').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();

		createDim();

		var $self = $(this);
		var $thisrel = $self.attr("rel");
		var $thisname = $self.attr("name");
		selectAgent = null;

		if ($self.hasClass("def")) $("#checkDef").val("1");
		else $("#checkDef").val("0");

		var policyData = JSON.parse($self.parents('li').find('input:hidden[name=policyData]').val());

		lf_editPolicy($thisname, policyData);
		$("#policy_edit").show();
	});
	$('a[rel="policy_add"]').off('click');
	$('a[rel="policy_add"]').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();

		createDim();

		var $self = $(this);
		var $thisrel = $self.attr("rel");
		var $thisname = $self.attr("name");
		selectAgent = $self.attr("agentid");

		if ($self.hasClass("def")) $("#checkDef").val("1");
		else $("#checkDef").val("0");

		lf_editPolicy($thisname, null);
		$("#policy_edit").show();
	});

	// 컨테이너 워크로드 실행제어 정책 추가 
	$(document).off("click", 'a[rel="workLoad_policy_add"]').on("click", 'a[rel="workLoad_policy_add"]', function (e) {
		e.stopPropagation(); // a 태그의 이벤트 전파를 중단시키기 위함
		e.preventDefault(); //  a 태그를 눌러도 새로고침 x
		createDim()

		// 이전 클러스터 정보 저장(페이지 나갈 때 상태유지에 사용)
		clusterUuidState = $('#selectClusterUuid').val();
		
		// 현재 클러스터 정보 가져오기(동기 처리)
		cf_requestServer(_TR_POLICY_CLUSTER_INFO, null, lf_serviceCall800060CallBack, false);
		
		// 현재 클러스터 주체 정보 가져오기(동기 처리)
		var body = { 'clusterUuid': $('#wh_cluster option:selected').val()};
		cf_requestServer(_TR_POLICY_CLUSTER_SUBJECT_INFO, body, lf_serviceCall800061CallBack, false);
		
		// 규정준수 정책 선택 항목 비활성화(처음에는 선택된 Cluster가 없기 떄문)
		$('#cs_complicance').append(`<option>-</option>`).niceSelect('update');
	    $("#complianceBox select").prop("disabled", true).niceSelect('update'); // select box 비활성화
	  	$("#complianceBox input").prop("readonly", true); // 하위에 있는 모든 input 요소들을 읽기 전용으로 설정

		optionListUp(0);  // 선택 option 생성 
		$("#workLoad_policy_edit").show(); // edit를 open
	});

	// 컨테이너 워크로드 정책 수정
	$(document).off("click", 'a[rel="workLoad_policy_edit"]').on("click", 'a[rel="workLoad_policy_edit"]', function (e) {
		e.stopPropagation(); // a 태그의 이벤트 전파를 중단시키기 위함
		e.preventDefault(); //  a 태그를 눌러도 새로고침 x
		createDim();
		
		// 이전 클러스터 정보 저장(페이지 나갈 때 상태유지에 사용)
		clusterUuidState = $('#selectClusterUuid').val();
		
		// 현재 클러스터 정보 가져오기(동기 처리)
		cf_requestServer(_TR_POLICY_CLUSTER_INFO, null, lf_serviceCall800060CallBack, false);

		var $self = $(this);
		var workLoadData = JSON.parse($self.parents('td').find('input:hidden[name=workLoadData]').val());

		optionListUp(0);  // 선택 option 생성 
		editWorkLoadPolicy(workLoadData); // 수정 폼 생성. 선택된 정책 데이터 전달
		$("#workLoad_policy_edit").show(); // edit를 open
	});
	
	//  컨테이너 워크로드 삭제
	$('a[rel="workLoad_policy_del"]').off('click');
	$(document).on("click", 'a[rel="workLoad_policy_del"]', function (e) {
		var $self = $(this);
		var workLoadData = JSON.parse($self.parents('td').find('input:hidden[name=workLoadData]').val());
		// 정책 삭제 함수 호출 
		deletePolicyWorkload(workLoadData);
	});

	// 이미지 시큐리티 정책 추가
	$('a[rel="imageSecurity_policy_add"]').off('click');
	$(document).on("click", 'a[rel="imageSecurity_policy_add"]', function (e) { //  $(document) 를 사용하여 동적으로 변경
		e.stopPropagation(); // a 태그의 이벤트 전파를 중단시키기 위함
		e.preventDefault(); //  a 태그를 눌러도 새로고침 x
		createDim();

		/* 기존 aegis 로직
		var $self = $(this);
				var $thisrel = $self.attr("rel");
		var $thisname = $self.attr("name");
		selectAgent = $self.attr("agentid");
		
		if($self.hasClass("def")) $("#checkDef").val("1"); 
		else $("#checkDef").val("0");
		
		lf_editPolicy($thisname, null);
		*/
		$("#imageSecurity_policy_edit").show(); // edit를 open
	});

	// 이미지 시큐리티 정책 수정
	$('a[rel="imageSecurity_policy_edit"]').off('click');
	$(document).on("click", 'a[rel="imageSecurity_policy_edit"]', function (e) {
		e.stopPropagation(); // a 태그의 이벤트 전파를 중단시키기 위함
		e.preventDefault(); //  a 태그를 눌러도 새로고침 x
		createDim();
		var $self = $(this);
		var isData = JSON.parse($self.parents('td').find('input:hidden[name=isData]').val());

		editPolicy(isData);
		$("#imageSecurity_policy_edit").show(); // edit를 open
	});


	// 이미지 시큐리티 정책 삭제
	$('a[rel="imageSecurity_policy_del"]').off('click');
	$(document).on("click", 'a[rel="imageSecurity_policy_del"]', function (e) {
		var $self = $(this);
		var isData = JSON.parse($self.parents('td').find('input:hidden[name=isData]').val());

		delPolicy(isData);
	});
	
	// 컨테이너 이미지 보증 정책 설정 
	$('a[rel="imageAssurance_policy_edit"]').off('click');
	$(document).on("click", 'a[rel="imageAssurance_policy_edit"]', function (e) {
		e.stopPropagation(); // a 태그의 이벤트 전파를 중단시키기 위함
		e.preventDefault(); //  a 태그를 눌러도 새로고침 x
		createDim();
		statPolicyImage(); // 이미지 보증 정책 조회
		$("#imageAssurance_policy_edit").show(); // edit를 open
	});


	$('a[rel="policy_remove"]').off('click');
	$('a[rel="policy_remove"]').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		var $self = $(this);
		var $thisrel = $self.attr("rel");
		var $thisname = $self.attr("name");
		var policyData = JSON.parse($self.parents('li').find('input:hidden[name=policyData]').val());

		lf_removePolicy($thisname, [policyData.hardwareid]);
	});
	$('#policy_hist a[rel="policy_edit_btn"]').on('click', function () {
		swal("정책 변경", "정책을 변경하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function (willDelete) {
			if (willDelete) {
				var policyType = $("#policy_hist #policyType").val();
				var policyData = JSON.parse($("#policy_hist #policyData").val());
				var rev = $("#policy_hist #rev").text().replace(/[^0-9]/g, '');

				var body = {
					"policyType": policyType,
					"rev": rev,
					"equipList": [
						policyData.hardwareid
					]
				};
				cf_requestServer(_TR_ASSET_APPLY, body, function () { // lf_serviceCall800042Callback
					alert('정책이 설정되었습니다.');
					lf_closePolicyHistModal();
					lf_reloadPolicyBoard();
				}, false);
			} else {
				swal("정책 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	});
	$("#policy_hist #policyType").on('change', function () {
		var policyType = $(this).val();
		var policyData = JSON.parse($("#policy_hist #policyData").val());
		lf_historyPolicy(policyType, policyData);
	});
	$('#policy_edit a[rel="policy_edit_btn"]').on('click', function () {
		swal("정책 변경", "정책을 변경하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function (willDelete) {
			if (willDelete) {
				var isIndPolicy = !($("#checkDef").val() == "1");
				var policyType = $("#policy_edit #title").attr("data-type");
				var rev = $("#policy_edit #rev").text().replace(/[^0-9]/g, '');
				var mode = $("#policy_edit select[name='mode']").val();
				var description = $("#policy_edit input[name='description']").val();


				var policyList = new Array();
				if (policyType == _POLICY_IPS) {
					var policyVal = $.trim($('#policy_edit #rule_edit').find('textarea').val());
					var policyArray = policyVal.split('\n');
					$.each(policyArray, function (index, policy) {
						if (policy === '' || $.trim(policy) === '') {
							return true;
						}
						policy = $.trim(policy);
						policyList.push({ policy });
					});
				} else {
					$("#policy_edit #rule_edit tbody tr").each(function () {
						var data = $(this).attr("data-value");
						if (data) policyList.push(JSON.parse(data));
					});
				}

				var equipList = new Array();
				$("#policy_edit #equip_list input[name=equipList]").each(function () {
					if ($(this).is(":checked")) equipList.push($(this).val());
				});

				var option = {};
				switch (policyType) {
					case _POLICY_IPS:

						break;
					case _POLICY_MAL:
						option.schedule = $("#policy_edit #rule_add select[name='schedule']").val();
						option.realtime = $("#policy_edit #rule_add select[name='realtime']").val();
						option.action = $("#policy_edit #rule_add input[name='action']:checked").val();
						break;
					case _POLICY_FW:
						break;
					case _POLICY_FILE:
						break;
					case _POLICY_APPCTL:
						option.type = $("#policy_edit #rule_add select[name='type']").val() == _WHITE_LIST ? _WHITE_LIST : _BLACK_LIST;
						break;
					case _POLICY_PAMACL:
						$("#policy_edit #title").html("정책 편집 (서비스 제어)");
						if ($("#policy_edit #rule_add select[name='twofactor']").val() == '1') option.twofactor = 1;
						else option.twofactor = 0;
						break;
				}

				var body = {
					"def": (isIndPolicy === true ? 0 : 1),
					"prevRev": (rev === _NEW_REV ? 0 : rev),
					"policyType": policyType,
					"mode": mode,
					"policyList": policyList,
					"equipList": equipList,
					"description": description,
					"option": option
				};
				if (!isIndPolicy) delete body.equipList;
				console.log('800041 body >>> ', body);
				setTimeout(function () { cf_requestServer(_TR_POLICY_APPLY, body, lf_serviceCall800041CallBack, false) }, 500);
			} else {
				swal("정책 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	});
	$('#policy_edit input:checkbox[name=all_checkbox]').on('click', function () {
		$.each($('#policy_edit input:checkbox[name=equipList]'), function (idx, item) {
			$(item).prop("checked", $('#policy_edit input:checkbox[name=all_checkbox]').prop("checked"));
		});
	});
	$('#policy_edit a[rel="equip_search_btn"]').on('click', function () {
		var equipSearch = $('#policy_edit select[name=equipSearch]').val();
		var equipKeyword = $('#policy_edit input:text[name=equipKeyword]').val();

		$.each($("#policy_edit #equip_list tr"), function (idx, item) {
			var result = false;
			if (equipSearch == "masterip" && ($(item).children("td:eq(1)").html().toUpperCase()).indexOf(equipKeyword.toUpperCase()) > -1) result = true;
			else if (equipSearch == "equipname" && ($(item).children("td:eq(2)").html().toUpperCase()).indexOf(equipKeyword.toUpperCase()) > -1) result = true;
			else if (equipSearch == "osver" && ($(item).children("td:eq(3)").html().toUpperCase()).indexOf(equipKeyword.toUpperCase()) > -1) result = true;

			result ? $(item).show() : $(item).hide();
		});
	});
	$('#policy_edit a[rel="process_view_btn"]').on('click', function (e) {
		var popup = window.open('/processView.do', '', 'width=1200,height=840,location=no,status=no,scrollbars=no');
	});
}

function lf_closePolicyHistModal() {
	removeDim();
	$("#policy_hist #policy_textarea textarea").html("");
	$("#policy_hist").hide();
}

function lf_closePolicyEditModal() {
	removeDim();
	$("#policy_edit #rule_edit textarea").html("");
	$("#policy_edit").hide();
}

// 이미지 시큐리티 정책 모달 닫기
function lf_closeImageSecurityPolicyModal() {
	removeDim();
	$('#selectRegistryUuid').val($('#policy_registry').val()).niceSelect('update'); //닫을 때 마지막으로 설정한 항목으로 업데이트
	updateTableByRegistry(); // 테이블 현재 선택된 클러스터로 드로우
	initPolicy(); // 설정 초기화
	$("#imageSecurity_policy_edit").hide();
}

// 컨테이너 이미지 보증 모달 닫기
function lf_closeImageAssurancePolicyModal() {
	removeDim();
	$("#imageAssurance_policy_edit").hide();
}

// 컨테이너 워크로드 모달 닫기
function lf_closeWorkLoadPolicyModal() {
	removeDim();
	initWorkLoadPolicy(); // 설정 초기화
	$("#workLoad_policy_edit").hide();
	closedAndUpdateTableByCluster(); // 이전 cluster 선택 항목으로 업데이트 
}

// 컨테이너 이벤트 모달 닫기
function lf_closeContainerSecurityPolicyModal() {
	removeDim();
	//initWorkLoadPolicy(); // ??? 설정 초기화
	$("#containerSecurityPolicyEdit").hide();
}

function lf_reloadPolicyBoard() {
	lf_serviceCall800032('', '', '');
	lf_serviceCall800031();// 230214 추가. 현황판 update
	$("#groupStatTable td").removeClass("on");
}

function isEmptyRev(rev) {
	if (isNaN(rev)) return true;
	if (_EMPTY_REV == rev) return true;
	if (_EMPTY_REV == '') return true;

	const parsed = parseInt(rev, 10)
	if (isNaN(parsed)) return true;

	return false;
}

function checkMode(action, mode) {
	if (typeof action == "undefined" || action == null || action == "") return false;

	try {
		action = action * 1;
		return (action & mode) == mode;
	} catch (e) {
		return false;
	}
}