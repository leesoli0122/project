/*
 * 정책 관리 > 클러스터 > 컨테이너 이벤트
 * 사용자 지정 정책 테이블 출력
 * 800066 컨테이너 이벤트 정보 조회
 * 800067 컨테이너 이벤트 정책 추가, 수정
 * */

var CONTAINER_SECURITY = 'containerSecurity';
var policyList
var policyRuleList
var policyActivationList

var policiesData = []; // isChanged가 포함된 배열
var policies = []; // isChanged가 없는 body에 넣을 배열

$(document).ready(function() {
	//table search
	$('#searchKeyword').on('keyup', function(event) {
		if (event.keyCode === 13) { // enter
			executeSearch(); // 검색 실행
		}
	});
	$('#searchBtn').on('click', function() {
		executeSearch(); // 검색 실행
	});
	/*$('#containerSecurityPolicy_table').on('draw.dt', function(){
		$('.container_security_row_selecter').niceSelect('update');
	});*/
	// 페이징 시 rule 재출력, value 재초기화
	/*$('#containerSecurityPolicy_table').on('page.dt', function () {
		$('.view_hide_btn_icon.view_hide_active').removeClass('view_hide_active');
		var pageDrawListener = function () {
			drawPolicyRuleListTree();
			setPolicyValueOnActivation();
			// 이벤트 핸들러가 한 번 실행된 후에는 제거
			$('#containerSecurityPolicy_table').off('draw.dt', pageDrawListener);
		};
		$('#containerSecurityPolicy_table').on('draw.dt', pageDrawListener);
	});*/
});

$(function() {
	lf_serviceCall800060(); // 클러스터 List
	lf_serviceCall800066(); // 정책 List, 룰 List, activation List
});

// rule drop down
function onOffDisplay(thiz) {
	var dataOnOff = $(thiz).data('onoff');
	var hasClassActive = $(thiz).hasClass('view_hide_active');
	if (hasClassActive) {
		// 클릭시 숨기기
		$('.container_security_rule_bundle[data-onOff="' + dataOnOff + '"]').css('display', 'none');
		$('.container_security_rule_detail[data-onOff="' + dataOnOff + '"]').slideUp();
		$('.view_hide_btn_icon[data-onOff="' + dataOnOff + '"]').removeClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onOff="' + dataOnOff + '"]').removeClass('view_hide_active');
		$('.view_hide_btn_icon[data-onOff="' + dataOnOff + '"]').parent().parent().removeClass('tr_open');//2024-01-15 퍼블 추가
		$('.view_hide_btn_icon_grey[data-onOff="' + dataOnOff + '"]').parent().parent().removeClass('tr_open');//2024-01-15 퍼블 추가

	} else {
		// 클릭시 보이기
		$('.container_security_rule_bundle[data-onOff="' + dataOnOff + '"]').css('display', 'table-row');
		$('.container_security_rule_detail[data-onOff="' + dataOnOff + '"]').slideDown();
		$('.view_hide_btn_icon[data-onOff="' + dataOnOff + '"]').addClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onOff="' + dataOnOff + '"]').addClass('view_hide_active');
		$('.view_hide_btn_icon[data-onOff="' + dataOnOff + '"]').parent().parent().addClass('tr_open');//2024-01-15 퍼블 추가
		$('.view_hide_btn_icon_grey[data-onOff="' + dataOnOff + '"]').parent().parent().addClass('tr_open');//2024-01-15 퍼블 추가

	}
	// 공통 함수에 존재하는 mCustomScrollbar 함수가 제대로 동작하지 않아 직접 실행
	$('section').mCustomScrollbar("update");
}

// table search
function executeSearch() {
	var searchKeyword = $('#searchKeyword').val();

	$('tbody tr').removeClass('hidden');
	$('.view_hide_active').trigger('click');

	// 기존의 search 강조 없애기 
	$('tbody .search_result_strong').each(function() {
		var innerText = $(this).text();
		$(this).replaceWith(innerText);
	});

	// 검색 값 강조
	$('tbody .search_able_value').each(function() {
		var searchText = $(this).text();
		if (searchText.includes(searchKeyword)) {
			var newText = searchText.replace(searchKeyword, '<span class="search_result_strong">' + searchKeyword + '</span>');
			$(this).html(newText);
		}
	});

	onoffSearchValue(searchKeyword);

	// tbody tr 하위에 .search_result_strong .view_hide_active이 존재하지 않다면 addclass('hidden') 
	if (searchKeyword != null && searchKeyword != '') {
		$("[id*='rowPolicyTr']:not(:has(.search_result_strong, .view_hide_active))").addClass('hidden');
	}
}

// 검색 결과에 따라 드롭다운
function onoffSearchValue(searchKeyword) {
	if (searchKeyword != null && searchKeyword != '') {
		// class container_security_rule_name에 search value가 존재하면 view_hide_btn_icon 클릭
		// class container_security_rule_name에 search value가 존재하면 view_hide_btn_icon_grey 클릭
		var searchResultStrong = $("span.search_result_strong");
		var searchRowRuleTr = searchResultStrong.closest('[id*="rowRuleTr_"]');
		var searchContainerSecurityRuleDetail = searchResultStrong.closest('[class*="container_security_rule_detail"]');

		if (searchRowRuleTr.length > 0) {
			$.each(searchRowRuleTr, function(index, item) {
				var dataOnoffValue = item.dataset.onoff;
				var viewHideBtnIcon = $('.view_hide_btn_icon[data-onoff="' + dataOnoffValue + '"]');
				viewHideBtnIcon.trigger('click');
			});
		}
		if (searchContainerSecurityRuleDetail.length > 0) {
			$.each(searchContainerSecurityRuleDetail, function(index, item) {
				var dataOnoffValue = item.dataset.onoff;
				var viewHideBtnIconGrey = $('.view_hide_btn_icon_grey[data-onoff="' + dataOnoffValue + '"]');
				viewHideBtnIconGrey.trigger('click');
			});
		}
	}
}

// 800060
function lf_serviceCall800060() {
	cf_requestServer(_TR_POLICY_CLUSTER_INFO, null, lf_serviceCall800060CallBack, false);
}
// 800060
// clusterSelete
function lf_serviceCall800060CallBack(data) {
	var clusterList = data.body.clusterList;
	var clusterInfo = JSON.stringify(clusterList);

	// DB에서 조회된 cluster 자산 리스트
	$.each(clusterList, function(idx, cluster) {
		$('#selectClusterUuid').append('<option value="' + cluster['uuid'] + '">' + cluster['name'] + '</option>');
	});
	// cluster select 초기화
	$('#selectClusterUuid option:first').prop('selected', true);

	$('#selectClusterUuid').niceSelect('update');
}

function updateSelectCluster() {
	policyList = '';
	policyRuleList = '';
	policyActivationList = '';
	policiesData = [];
	policies = [];

	lf_serviceCall800066(); // 클러스터 선택시 테이블 redraw
}

// 800066
function lf_serviceCall800066() {
	cf_requestServer(_TR_POLICY_CONTAINER_SECURITY_INFO, null, lf_serviceCall800066CallBack, false);
}
// 800066
// policy, policyRule, activation select
function lf_serviceCall800066CallBack(data) {
	var containerSecurityPolicyTree = $('#containerSecurityPolicyTree');
	policyList = data.body.policyList;
	policyRuleList = data.body.policyRuleList;
	policyActivationList = data.body.policyActivationList

	// 총 개수
	if (policyList) $('#policyCnt').html(policyList.length);
	else $('#policyCnt').html('0');

	// policyList를 출력
	drawPolicyDataTable();
	// policyRuleList를 출력
	drawPolicyRuleListTree();
	// activation을 이용하여 value 조정
	setPolicyValueOnActivation();
	$('.container_security_row_selecter').niceSelect('update');
}
// 800066
//data에 대한 null 체크, 데이터 변환
function transformData(item) {
	var transformData = typeof item !== 'undefined' && item !== null && item !== 'null' ? item : '-';

	return transformData;
}
// 800066
// 카테고리 정보를 HTML 문자열로 변환하는 함수
function getCategoryHtml(category) {
	var html = ''
	html += '<div class="container_security_rule_catagory">';
	html += '	<div class="container_security_rule_catagory_title">' + category.title + '</div>';

	if ((category.title).includes('Description') || (category.title).includes('Impact')) {
		html += '	<div class="container_security_rule_catagory_detail">' + makeSearchAbleValueSpan(category.detail) + '</div>';
	} else if ((category.title).includes('Remediation')) {
		html += '	<div title="' + category.detail + '" class="container_security_rule_catagory_detail">' + makeSearchAbleValueSpan(category.detail.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, '&quot;')) + '</div>';
	} else {
		html += '	<div class="container_security_rule_catagory_detail">' + category.detail + '</div>';
	}

	html += '</div>';

	return html;
}
// 800066
// policy 하위 rule 요소 추가
function drawPolicyRuleListTree() {
	policyList.forEach((policy) => { // policy 하위에 RuleTr
		var rowRulesElementHtml = '';
		rowRulesElementHtml += '<tr id="rowRuleTr_' + policy.id + '" data-onOff="' + policy.id + '_policy" class="container_security_rule_bundle" style="display: none">'; // 룰 묶음
		rowRulesElementHtml += '	<td colspan="8"></td>';
		rowRulesElementHtml += '</tr>';

		var policyId = '#rowPolicyTr_' + policy.id;
		$(policyId).after(rowRulesElementHtml);
	});

	policyRuleList.forEach((rule) => {
		var switch_html = '<label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange(\'' + rule.policy_id + '\', true)" id="containerSecurityRuleEnabled_' + rule.policy_id + '_' + rule.id + '" type="checkbox" /> <div class="onoff-switch container_security_switch onoff_switch_is_not_active"></div>';
		var rowRuleElement = $('#rowRuleTr_' + rule.policy_id + ' td'); // 출력 되어있는 rule 요소
		var rowRuleDiv = $('#rowRuleTr_' + rule.policy_id + ' td div.container_security_row_rule'); // 출력 되어있는 rule 요소

		var ruleHtml = ''; // policy 하위의 rule 요소
		ruleHtml += '<div id="rowRule_' + rule.policy_id + '_' + rule.id + '" class="container_security_row_rule"></div>'
		rowRuleElement.append(ruleHtml);

		var rulesElemet = $('#rowRule_' + rule.policy_id + '_' + rule.id);
		var ruleNameHtml = ''
		ruleNameHtml += '<div class="container_security_rule_name">';
		ruleNameHtml += '	<div class="container_security_rule_catagory_title">';
		ruleNameHtml += '		<div class="view_hide_btn_icon_grey" data-onOff="' + rule.policy_id + '_' + rule.id + '_rule" onclick="onOffDisplay(this)"></div>';
		ruleNameHtml += '	</div>';
		ruleNameHtml += '	<div class="container_security_rule_catagory_detail">' + (rowRuleDiv.length + 1) + '. ' + makeSearchAbleValueSpan(rule.name) + '</div>';
		ruleNameHtml += switch_html;
		ruleNameHtml += '</div>';

		rulesElemet.append(ruleNameHtml);

		// 카테고리 정보를 객체 배열로 정의
		var categories = [
			{ title: '· Type:', detail: rule.type },
			{ title: '· Severity:', detail: rule.severity },
			{ title: '· Resource:', detail: rule.resource },
			{ title: '· Description: ', detail: rule.description },
			{ title: '· Impact:', detail: rule.impact },
			{ title: '· Remediation:', detail: rule.remediation }
		];

		// 상세 정보 HTML 구성
		var ruleDetailHtml = '';
		ruleDetailHtml += '<div class="container_security_rule_detail" data-onOff="' + rule.policy_id + '_' + rule.id + '_rule" style="display: none">';
		ruleDetailHtml += '<span class="ico runtime">Runtime</span> <span class="ico build">Bulid</span> <span class="ico time">Time</span> <span class="severity bc_low">Low</span> <span class="severity bc_medium">Medium</span> <span class="severity bc_high">High</span> <span class="severity bc_critical">Critical</span> '; //2024-01-18 퍼블확인용 - type, Severity 디자인
		ruleDetailHtml += categories.map(getCategoryHtml).join('');
		ruleDetailHtml += '</div>';

		rulesElemet.append(ruleDetailHtml);
	});

	// 하위 요소가 없다면 드롭다운 버튼 삭제
	policyList.forEach((policy) => {
		var rulerow = $('#rowRuleTr_' + policy.id + ' td');
		if (rulerow.is(':empty')) {
			$('[data-onOff="' + policy.id + '_policy"]').remove();
			$('#rowRuleTr_' + policy.id).remove();
		}
	});
}
// 800066 
// 데이터 테이블 출력
function drawPolicyDataTable() {
	var style_html = '"white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"';
	policyTable.clear();
	$.each(policyList, function(idx, rowData) {
		var selectSeverity = rowData["severity"];
		var selectAction = rowData["action"];

		var switch_html = '<label class="switch-button container_security_switch"> <input onchange="policyValueChange(\'' + rowData["id"] + '\', false)" id="containerSecurityPolicyEnabled_' + rowData["id"] + '" type="checkbox" /> <span class="onoff-switch container_security_switch">';
		var severity_html = '';
		severity_html += '<div class="event_sel">';
		severity_html += '	<div class="sel_box">';
		severity_html += '		<select onchange="policyValueChange(\'' + rowData["id"] + '\', false)" id="containerSecuritySeverity_' + rowData["id"] + '" class="wide event container_security_row_selecter">';
		severity_html += '		<option value="CRITICAL">Critical</option>';
		severity_html += '		<option value="HIGH">High</option>';
		severity_html += '		<option value="MEDIUM">Medium</option>';
		severity_html += '		<option value="LOW">Low</option>';
		severity_html += '		<option value="IGNORE">Ignore</option>';
		severity_html += '		</select>';
		severity_html += '	</div>';
		severity_html += '</div>';

		var action_html = '';
		action_html += '<div class="event_sel">';
		action_html += '	<div class="sel_box">';
		action_html += '			<select onchange="policyValueChange(\'' + rowData["id"] + '\', false)" id="containerSecurityAction_' + rowData["id"] + '" class="wide event container_security_row_selecter">';
		action_html += '				<option value="DENY">Deny</option>';
		action_html += '				<option value="ALERT">Alert</option>';
		action_html += '				<option value="LOGGING">Logging</option>';
		action_html += '			</select>';
		action_html += '	</div>';
		action_html += '</div>';

		var originalPolicy_html = '';
		originalPolicy_html += '<input id="originalPolicy_' + rowData["id"] + '" type="hidden">'

		var btnIcon_html = '';
		btnIcon_html += '<div class="view_hide_btn_icon" data-onOff="' + rowData["id"] + '_policy" onclick="onOffDisplay(this)"></div>';

		var updateUser_html = '';
		updateUser_html += '<span class="container_security_policy_updated_user">-</span>';

		var updateDate_html = '';
		updateDate_html += '<span class="container_security_policy_updated_date">-</span>';

		var row = policyTable.row.add([
			btnIcon_html,
			makeSearchAbleValueSpan(transformData(rowData["name"])),
			makeSearchAbleValueSpan(transformData(rowData["description"])),
			severity_html,
			action_html,
			switch_html,
			updateUser_html, // UpdateUesr
			updateDate_html, // UpdateDate
			originalPolicy_html, //API요청을 보낼 JSON 데이터 추가
			rowData["id"]
		]).draw().node();

		// 받아온 severity, Action 값에 따라 selectBox val 수정
		if (selectSeverity) {
			var containerSecuritySeveritySelect = $(row).find('#containerSecuritySeverity_' + rowData["id"]);
			containerSecuritySeveritySelect.val(selectSeverity);
		}
	});
	$('.container_security_row_selecter').niceSelect();
}

// 800066 
// activation value 적용
function setPolicyValueOnActivation() {
	var selectedClusterUuid = $('#selectClusterUuid').val();

	policyActivationList.forEach(function(policyActivation, index) {
		var cluster_uuid = policyActivation.cluster_uuid; // selectBox val과 매칭
		var policy_id = policyActivation.policy_id;
		var action = policyActivation.action;
		var severity = policyActivation.severity;
		var is_enabled = policyActivation.is_enabled;
		var policy_rule_ids = policyActivation.policy_rule_ids;
		var updated_by = policyActivation.updated_by;
		var updated_at = policyActivation.updated_at;
		var originalPolicy = {
			policyId: '',
			policyRuleIds: [],
			severity: '',
			action: '',
			enabled: '',
		};

		if (cluster_uuid === selectedClusterUuid) {
			var policyTr = $('#rowPolicyTr_' + policy_id);
			originalPolicy.policyId = policy_id;
			originalPolicy.policyRuleIds = policy_rule_ids;
			originalPolicy.severity = severity;
			originalPolicy.action = action;
			originalPolicy.enabled = is_enabled;

			var originalPolicyToString = JSON.stringify(originalPolicy);

			if (policyTr) {
				var containerSecuritySeverity = policyTr.find('[id*="containerSecuritySeverity"]');
				containerSecuritySeverity.val(severity);

				var containerSecurityAction = policyTr.find('[id*="containerSecurityAction"]');
				containerSecurityAction.val(action);

				var containerSecurityPolicyEnabled = policyTr.find('[id*="containerSecurityPolicyEnabled"]');
				if (is_enabled) {
					$('#rowRuleTr_' + policy_id + ' input[type="checkbox"]').prop('disabled', false);
					$('#rowRuleTr_' + policy_id + ' input[type="checkbox"] + .onoff-switch').removeClass('onoff_switch_is_not_active');
					$('#rowRuleTr_' + policy_id + ' input[type="checkbox"] + .onoff-switch').addClass('onoff_switch_is_active');
					containerSecurityPolicyEnabled.prop("checked", true);
				}

				var containerSecurityUpdateUser = policyTr.find('.container_security_policy_updated_user');
				containerSecurityUpdateUser.text(updated_by);

				var containerSecurityUpdateDate = policyTr.find('.container_security_policy_updated_date');
				containerSecurityUpdateDate.text(updated_at);

				var containerSecurityoriginalPolicy = policyTr.find('[id*="originalPolicy"]');
				containerSecurityoriginalPolicy.val(originalPolicyToString);

				policy_rule_ids.forEach(function(ruleId, index) {
					$('#containerSecurityRuleEnabled_' + policy_id + '_' + ruleId).prop("checked", true);
				});
			}
		}
	});
}

// 객체를 순회하면서 변경점 존재하는지 확인
function compareObjects(obj1, obj2) {
	var keys1 = Object.keys(obj1);
	var keys2 = Object.keys(obj2);

	// 길이가 다르면 X
	if (keys1.length !== keys2.length) {
		return false;
	}

	for (let key of keys1) {
		var value1 = obj1[key];
		var value2 = obj2[key];
		// object, array일 경우
		if (typeof value1 === 'object' && typeof value2 === 'object') {
			if (Array.isArray(value1) && Array.isArray(value2)) {
				if (compareArrays(value1, value2)) {
					return true;
				}
			} else if (compareObjects(value1, value2)) {
				return true;
			}
		} else if (value1 !== value2) {
			return true;
		}
	}

	return false;
}
function compareArrays(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return true;
	}

	for (let i = 0; i < arr1.length; i++) {
		if (typeof arr1[i] === 'object' && typeof arr2[i] === 'object') {
			if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
				if (compareArrays(arr1[i], arr2[i])) {
					return true;
				}
			} else if (compareObjects(arr1[i], arr2[i])) {
				return true;
			}
		} else if (arr1[i] !== arr2[i]) {
			return true;
		}
	}

	return false;
}

// 정책들에대한 변화 확인, body의 policies value 정제
function policyValueChange(policyId, isRule) {
	//2023-10-23 이성호 로직 순서 변경
	// 정책에 대한 설정이 있을경우, 룰에 대한 설정보다 먼저 UI를 움직여서 데이터 체크시 현 시점의 데이터를 저장되게 변경
	var enabled = $('#containerSecurityPolicyEnabled_' + policyId).is(':checked');

	if (!(enabled && isRule)) {
		if (enabled) {// 전체 끄기
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"]').prop('disabled', false);
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"] + .onoff-switch').removeClass('onoff_switch_is_not_active');
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"] + .onoff-switch').addClass('onoff_switch_is_active');
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"]').prop("checked", true);
		} else {// 전체 키기.
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"]').prop('disabled', true);
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"] + .onoff-switch').removeClass('onoff_switch_is_active');
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"] + .onoff-switch').addClass('onoff_switch_is_not_active');
			$('#rowRuleTr_' + policyId + ' input[type="checkbox"]').prop("checked", false);
		}
	}

	var customPolicy = {
		policyId: '',
		policyRuleIds: [],
		severity: '',
		action: '',
		enabled: false
	};
	var originalPolicyDataString = $('#originalPolicy_' + policyId).val(); // activation에 데이터가 없다면 null
	var originalPolicyData = originalPolicyDataString ? JSON.parse(originalPolicyDataString) : '';

	var policyRuleIds = $('#rowRuleTr_' + policyId + ' [id*=containerSecurityRuleEnabled_]:checkbox:checked').map(function() {
		return (this.id).replace('containerSecurityRuleEnabled_' + policyId + '_', '');
	}).get();
	var severity = $('#containerSecuritySeverity_' + policyId).val();
	var action = $('#containerSecurityAction_' + policyId).val();


	customPolicy.policyId = policyId;
	customPolicy.policyRuleIds = policyRuleIds;
	customPolicy.severity = severity;
	customPolicy.action = action;
	customPolicy.enabled = enabled;


	// customPolicy, originalPolicyData 비교
	if (originalPolicyData) {
		var isChanged = compareObjects(originalPolicyData, customPolicy);
		customPolicy.isChanged = isChanged;
	} else {
		customPolicy.isChanged = true;
	}

	// 중복 데이터에 대한 삭제
	var duplicateIndex = policiesData.findIndex(obj => obj.policyId === customPolicy.policyId);
	if (duplicateIndex !== -1) {
		policiesData.splice(duplicateIndex, 1);
	}
	policiesData.push(customPolicy);

	// isChanged가 true인 것만 남김
	policies = policiesData.filter(policy => {
		if (policy.isChanged) {
			return true;
		}
		return false;
	});

}

// 800067
function lf_serviceCall800067() {
	var clusterUuid = $('#selectClusterUuid').val();
	var body = {
		clusterUuid: clusterUuid,
		policies: policies
	}
	cf_requestServer(_TR_POLICY_CONTAINER_SECURITY_UPDATE, body, lf_serviceCall800067CallBack);
}
// 800067
// 정책 Update
function lf_serviceCall800067CallBack(data) {
	swal('저장 완료', '정책이 저장되었습니다.', './assets/images/icon_alert02.png', {
		buttons: '확인'
	}).then(function() {
		location.reload();
	});
}
// 800067
function updatePolicyContainerSecurity() {
	swal("정책 저장", "정책을 저장하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if (willDelete && !policies.length) {
			swal("정책 저장", "변경된 정책이 존재하지 않습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		} else if (willDelete) {
			lf_serviceCall800067(); // 정책 저장 서비스
		} else {
			swal("정책 저장", "취소하였습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		}
	});
}

// 특정 value만 검색, 피드백 하기 위한 html span 설정 
function makeSearchAbleValueSpan(data) {
	var searchAbleValueSpanHtml = '';
	searchAbleValueSpanHtml += '<span class="search_able_value">' + data + '</span>';

	return searchAbleValueSpanHtml;
}
