const _ADD = "add";
const _EDIT = "edit";

function lf_editPolicy(policyType, policyData) {
	//UI Reset
	$(".securitypolicy_add").removeClass("on");
	
	$("#policy_edit #title").html("");
	$("#policy_edit #rev").html("");
	$("#policy_edit #nol").addClass("none");
	$("#policy_edit #ind").addClass("none");
	$("#policy_edit #rule_add").html("");
	$('#policy_edit a[rel="process_view_btn"]').hide();
	$('#policy_edit a.policy_option').hide();
	if(policyType == _POLICY_FILE || policyType == _POLICY_APPCTL) {
		$('#policy_edit a[rel="process_view_btn"]').show();
	}
	if(policyType == _POLICY_MAL || policyType == _POLICY_APPCTL || policyType == _POLICY_PAMACL) {
		$('#policy_edit a.policy_option').show();
	}
	$('#policy_edit a[rel="rule_add_btn"]').hide();
	$("#policy_edit #rule_edit").html("");
	$("#policy_edit #equip_list").html("");
	
	$("#policy_edit #title").attr("data-type", policyType);
	
	switch (policyType) {
	case _POLICY_IPS:
		$("#policy_edit #title").html("정책 편집 (침입방지시스템)");
		break;
	case _POLICY_MAL:
		$("#policy_edit #title").html("정책 편집 (멀웨어)");
		break;
	case _POLICY_FW:
		$("#policy_edit #title").html("정책 편집 (방화벽)");
		break;
	case _POLICY_FILE:
		$("#policy_edit #title").html("정책 편집 (파일무결성)");
		break;
	case _POLICY_APPCTL:
		$("#policy_edit #title").html("정책 편집 (실행 파일 통제)");
		break;
	case _POLICY_PAMACL:
		$("#policy_edit #title").html("정책 편집 (서비스 제어)");
		break;
	case _POLICY_IMAGESECURITY:
		$("#policy_edit #title").html("정책 편집 (이미지 시큐리티)");
		break;
	}
	
	lf_editPolicyRevisionHistory(policyType, policyData);
	if(policyData != null) {
		lf_editPolicyRuleList(policyType, policyData);
	} else {
		$("#policy_edit #rev").html("New");
		
		switch (policyType) {
		case _POLICY_IPS:
			lf_loadIpsPolicyEdit(null);
			break;
		case _POLICY_MAL:
			lf_loadMalwarePolicyEdit(null);
			break;
		case _POLICY_FW:
			lf_loadFirewallPolicyEdit(null);
			break;
		case _POLICY_FILE:
		case _POLICY_APPCTL:
			lf_loadFileAppctlPolicyEdit(null);
			break;
		case _POLICY_PAMACL:
			lf_loadPamAclPolicyEdit(null);
			break;
		}
		
		if($("#checkDef").val() != 1) lf_loadAgentList(policyType, _NEW_REV);
	}
}

function lf_editPolicyRevisionHistory(policyType, policyData) {
	var body = {
		"policyType" : policyType,
		"policy" : 0
	};
	cf_requestServer(_TR_POLICY_RULE_LIST, body, function(data) {
		var defaultPolicy = data.body.defaultPolicy;
		var dataList = data.body.dataList;
		
		var html = "";
		if(!$.isEmptyObject(defaultPolicy)) {
			html += "<li>";
			html += "	<a href=\"javascript:lf_editPolicyRuleListSub('" + defaultPolicy.policytype + "', '" + defaultPolicy.rev + "', true);\">";
			html += "		<div class=\"rev fl\">";
			html += "			<div>rev " + defaultPolicy.rev + "</div>"
			html += "			<div class=\"info nol\" title=\"기본정책\">기본정책</div>";
			html += "			<div class=\"info ind none\" title=\"개별정책\">개별정책</div>";
			html += "		</div>";
			html += "		<p class=\"fl\">";
			html += "			생성시간 : <span>" + defaultPolicy.createtime + "</span> / 등록 사용자 : <span>" + defaultPolicy.userid + "</span> / <span>" + defaultPolicy.description + "</span>";
			html += "		</p>";
			html += "	</a>";
			html += "</li>"
		}
		$.each(dataList, function(index, item) {
			if(item.def == 1) return;
			
			html += "<li>";
			html += "	<a href=\"javascript:lf_editPolicyRuleListSub('" + item.policytype + "', '" + item.rev + "', false);\">";
			html += "		<div class=\"rev fl\">";
			html += "			<div>rev " + item.rev + "</div>";
			if(item.policytype == _POLICY_IPS || item.policytype == _POLICY_MAL) {
				html += "			<div class=\"info nol " + (item.def == 0 ? "none" : "") + "\" title=\"기본정책\">기본정책</div>";
			}
			html += "			<div class=\"info ind " + (item.def == 0 ? "" : "none") + "\" title=\"개별정책\">개별정책</div>";
			html += "		</div>";
			html += "		<p class=\"fl\">";
			html += 			(item.def == 0 ? "<span>" + item.markcnt + "</span>대 / " : "") + "생성시간 : <span>" + item.createtime + "</span> / 등록 사용자 : <span>" + item.userid + "</span> / <span>" + item.description + "</span>";
			html += "		</p>";
			html += "	</a>";
			html += "</li>"
		});
		$("#policy_edit #rev_list").html(html);
	}, false);
}

function lf_editPolicyRuleListSub(policyType, rev, defaultPolicy) {
	$("#policy_edit .rev_list_btn").removeClass("on");
	$("#policy_edit #rev_list").removeClass("on");
	
/*	if(defaultPolicy) {
		$('div.securitypolicy_bottom_info div.equiplist_search').hide();
		$('div.securitypolicy_bottom_info div.tbl table.click').hide();		
	} else {
		$('div.securitypolicy_bottom_info div.equiplist_search').show();
		$('div.securitypolicy_bottom_info div.tbl table.click').show();
	}*/
	if(isEmptyRev(rev)) {
		alert('설정된 정책이 존재하지 않습니다.');
		return false;
	}
	
	$("#policy_edit #rev").html("rev " + rev);
	defaultPolicy ? $("#policy_edit #nol").removeClass("none") : $("#policy_edit #nol").addClass("none");
	defaultPolicy ? $("#policy_edit #ind").addClass("none") : $("#policy_edit #ind").removeClass("none");
	
	var body = {
		"policyType" : policyType,
		"rev" : parseInt(rev, 10),
		"policy" : 1
	};
	
	$("#policy_edit #rule_edit textarea").html("로딩 중..");
	
	setTimeout(function() {
		cf_requestServer(_TR_POLICY_RULE_LIST, body, lf_serviceCall800033CallBackForEdit, false)
	}, 500);
}

function lf_editPolicyRuleList(policyType, policyData) {
	var rev = "";
	
	switch (policyType) {
	case _POLICY_IPS:
		rev = (policyData.default_ips == 0 && policyData.mark_ips == 0) ? "-" : policyData.mark_ips;
		policyData.mark_ips == 0 ? $("#policy_edit #nol").addClass("none") : $("#policy_edit #nol").removeClass("none");
		policyData.default_ips === policyData.mark_ips ? $("#policy_edit #ind").addClass("none") : $("#policy_edit #ind").removeClass("none");
		break;
	case _POLICY_MAL:
		rev = (policyData.default_mw == 0 && policyData.mark_mw == 0) ? "-" : policyData.mark_mw;
		policyData.mark_mw == 0 ? $("#policy_edit #nol").addClass("none") : $("#policy_edit #nol").removeClass("none");
		policyData.default_mw === policyData.mark_mw ? $("#policy_edit #ind").addClass("none") : $("#policy_edit #ind").removeClass("none");
		break;
	case _POLICY_FW:
		rev = (policyData.default_fw == 0 && policyData.mark_fw == 0) ? "-" : policyData.mark_fw;
		$("#policy_edit #nol").addClass("none");
		policyData.mark_fw == 0 ? $("#policy_edit #ind").addClass("none") : $("#policy_edit #ind").removeClass("none");
		break;
	case _POLICY_FILE:
		rev = (policyData.default_file == 0 && policyData.mark_file == 0) ? "-" : policyData.mark_file;
		$("#policy_edit #nol").addClass("none");
		policyData.mark_file == 0 ? $("#policy_edit #ind").addClass("none") : $("#policy_edit #ind").removeClass("none");
		break;
	case _POLICY_APPCTL:
		rev = (policyData.default_appctl == 0 && policyData.mark_appctl == 0) ? "-" : policyData.mark_appctl;
		$("#policy_edit #nol").addClass("none");
		policyData.mark_appctl == 0 ? $("#policy_edit #ind").addClass("none") : $("#policy_edit #ind").removeClass("none");
		break;
	case _POLICY_PAMACL:
		rev = (policyData.default_pamacl == 0 && policyData.mark_pamacl == 0) ? "-" : policyData.mark_pamacl;
		$("#policy_edit #nol").addClass("none");
		policyData.mark_pamacl == 0 ? $("#policy_edit #ind").addClass("none") : $("#policy_edit #ind").removeClass("none");
		break;
	}
	$("#policy_edit #rev").html("rev " + rev);
	
	if(isEmptyRev(rev)) {
		alert('설정된 정책이 존재하지 않습니다.');
		var data = {
			body : {
				defaultPolicy : {
					mode : "-",
					policytype : policyType,
					createtime : "-",
					userid : "-",
					description : "-",
					type : 0,
					policystr : []
				},
				dataList : {}
			}
		};
		lf_serviceCall800033CallBackForEdit(data);
		return;
	}
	var body = {
		"policyType" : policyType,
		"rev" : parseInt(rev, 10),
		"policy" : 1
	};
	setTimeout(function() {			
		cf_requestServer(_TR_POLICY_RULE_LIST, body, lf_serviceCall800033CallBackForEdit, false)
	}, 500);
}

function lf_serviceCall800033CallBackForEdit(data) {
	console.log(data);
	
	var rev = $("#policy_edit #rev").text().replace(/[^0-9]/g,'');
	
	var policy = new Object();
	var defaultPolicy = data.body.defaultPolicy;
	var dataList = data.body.dataList;
	
	if(!$.isEmptyObject(defaultPolicy)) policy = defaultPolicy;

	if(dataList.length > 0) {
		$.each(dataList, function(index, item) {
			if(item.rev == rev) policy = item;
		});
	}
	$("#policy_edit #userid").html(policy.userid);
	$("#policy_edit #createtime").html(policy.createtime);
	$("#policy_edit #description").val(policy.description);
	$("#policy_edit .securitypolicy_top select[name='mode']").val(policy.mode).prop("selected", true);
	$("#policy_edit .securitypolicy_top select").niceSelect("update");
		
	
	var policyType = policy.policytype;
	switch (policyType) {
	case _POLICY_IPS:
		lf_loadIpsPolicyEdit(policy);
		break;
	case _POLICY_MAL:
		lf_loadMalwarePolicyEdit(policy);
		break;
	case _POLICY_FW:
		lf_loadFirewallPolicyEdit(policy);
		break;
	case _POLICY_FILE:
	case _POLICY_APPCTL:
		lf_loadFileAppctlPolicyEdit(policy);
		break;
	case _POLICY_PAMACL:
		lf_loadPamAclPolicyEdit(policy);
		break;
	}
	
	if($("#checkDef").val() != 1) lf_loadAgentList(policyType, rev);
}

function lf_loadIpsPolicyEdit(policy) {
	var html = "";
	html += "<textarea wrap=\"off\" rows=\"5\">";
	
	if(policy != null) {
		$.each(policy.policystr, function(index, item) {
			html += item.policy + "\n";
		});
	}
	
	html += "</textarea>"
	$("#policy_edit #rule_edit").html(html);
	
	$("#policy_edit #rule_add").html("");
	$('#policy_edit a[rel="rule_add_btn"]').hide();
}

function lf_loadMalwarePolicyEdit(policy) {
	var html = "";
	html += "<table class=\"click\">";
	html += "	<colgroup>";
	html += "		<col width=\"10%\">";
	html += "		<col width=\"12%\">";
	html += "		<col width=\"auto\">";
	html += "		<col width=\"15%\">";
	html += "	</colgroup>";
	html += "	<thead>";
	html += "		<tr>";
	html += "			<th>우선순위</th>";
	html += "			<th>모드</th>";
	html += "			<th>파일</th>";
	html += "			<th>관리</th>";
	html += "		</tr>";
	html += "	</thead>";
	html += "	<tbody>";

	if(policy != null) {
		$.each(policy.policystr, function(index, item) {
			var policyId = getUUID();
			
			var mode = 'OFF';
			if(item.mode == _MODE['ON']) mode = 'ON';
			else if (item.mode == _MODE['OFF']) mode = 'OFF';
			else if (item.mode == _MODE['WARN']) mode = 'WARN';
			else mode = 'SKIP';
			
			html += "		<tr id=\"" + policyId + "\" data-value='" + JSON.stringify(item) + "'>";
			html += "			<td>";
			html += "				<div class=\"move_icon\">1</div>";
			html += "			</td>";
			html += "			<td class=\"long_w\">" + mode + "</td>";
			html += "			<td class=\"long_w tl\">" + item.filename + "</td>";
			html += "			<td class=\"long_w\">";
			html += "				<div>";
			html += "					<a href=\"javascript:lf_delMalwarePolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
			html += "					<a href=\"javascript:lf_changeMalwarePolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
			html += "				</div>";
			html += "			</td>";
			html += "		</tr>";
		});
	} else {
		/*
		html += "		<tr>";
		html += "			<td class=\"long_w\" colspan=\"4\">No data</td>";
		html += "		</tr>";
		*/
	}
	
	html += "	</tbody>";
	html += "</table>";
	$("#policy_edit #rule_edit").html(html);
	$("#policy_edit #rule_edit tbody").sortable();
	
	var action = _SCANMODE['OFF'];
	var realtime = _MODE['ON'];
	var schedule = _MODE['OFF'];
	if(policy != null && policy.optionstr) {
		action = policy.optionstr.action;
		realtime = policy.optionstr.realtime;
		schedule = policy.optionstr.schedule;
	}
	
	html = "";
	html += "<input type=\"hidden\" name=\"policyId\" value=\"" + getUUID() + "\">";
	html += "<input type=\"hidden\" name=\"policyMethod\" value=\"" + _ADD + "\">";
	html += "<dl class=\"policy_option\">";
	html += "	<dt>실시간 검사</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"realtime\" class=\"popup_sel\">";
	html += "					<option value=\"" + _MODE['ON'] + "\" " + (realtime ==_MODE['OFF'] ? "selected" : "") + ">ON</option>";
	html += "					<option value=\"" + _MODE['OFF'] + "\" " + (realtime ==_MODE['OFF'] ? "selected" : "") + ">OFF</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_option\">";
	html += "	<dt>예약검사</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"schedule\" class=\"popup_sel\">";
	html += "					<option value=\"" + _MODE['OFF'] + "\" " + (schedule ==_MODE['OFF'] ? "selected" : "") + ">OFF</option>";
	html += "					<option value=\"24\" " + (schedule == i ? "selected" : "") + ">매일 0시</option>";
	for(var i=1; i<24; i++) {
		html += "					<option value=\"" + i + "\" " + (schedule == i ? "selected" : "") + ">매일 " + (i < 10 ? "0" + i : i) + "시</option>";
	}
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_option\">";
	html += "	<dt>감염 파일 처리</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input type=\"radio\" name=\"action\" id=\"malwareAction1\" value=\"" + _SCANMODE['OFF'] + "\" " + (action ==_SCANMODE['OFF'] ? "selected" : "") + ">";
	html += "			<label for=\"malwareAction1\"></label>경고";
	html += "			<input type=\"radio\" name=\"action\" id=\"malwareAction2\" value=\"" + _SCANMODE['MOVE'] + "\" " + (action ==_SCANMODE['MOVE'] ? "selected" : "") + ">";
	html += "			<label for=\"malwareAction2\"></label>격리";
	html += "			<input type=\"radio\" name=\"action\" id=\"malwareAction3\" value=\"" + _SCANMODE['COPY'] + "\" " + (action ==_SCANMODE['COPY'] ? "selected" : "") + ">";
	html += "			<label for=\"malwareAction3\"></label>복사";
	html += "			<input type=\"radio\" name=\"action\" id=\"malwareAction4\" value=\"" + _SCANMODE['REMOVE'] + "\" " + (action ==_SCANMODE['REMOVE'] ? "selected" : "") + ">";
	html += "			<label for=\"malwareAction4\"></label>삭제";
	html += "			<input type=\"radio\" name=\"action\" id=\"malwareAction5\" value=\"" + _SCANMODE['EXECACL'] + "\" " + (action ==_SCANMODE['EXECACL'] ? "selected" : "") + ">";
	html += "			<label for=\"malwareAction5\"></label>차단";  
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>모드</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"mode\" class=\"popup_sel\">";
	html += "					<option value=\"" + _MODE['ON'] + "\">ON</option>";
	html += "					<option value=\"" + _MODE['OFF'] + "\">OFF</option>";
	html += "					<option value=\"" + _MODE['SKIP'] + "\">SKIP</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>파일</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"파일의 전체 경로를 작성해주세요.\" name=\"filename\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<div class=\"btn_wrap fr\">";
	html += "	<a href=\"javascript:lf_closePolicyEdit();\" class=\"btn grey securitypolicy_add_btn\">취소</a>";
	html += "	<a href=\"javascript:lf_addMalwarePolicyEdit();\" class=\"btn\">확인</a>";
	html += "</div>";
	$("#policy_edit #rule_add").html(html);
	$("#policy_edit #rule_add select").niceSelect();	
	$('#policy_edit a[rel="rule_add_btn"]').show();
	
	if(action ==_SCANMODE['MOVE']) $('#malwareAction02').prop('checked', true);
	else if(action ==_SCANMODE['COPY']) $('#malwareAction03').prop('checked', true);
	else if(action ==_SCANMODE['REMOVE']) $('#malwareAction04').prop('checked', true);
	else if(action ==_SCANMODE['EXECACL']) $('#malwareAction05').prop('checked', true);
	else $('#malwareAction01').prop('checked', true);
}

function lf_addMalwarePolicyEdit() {
	if($('#policy_edit #rule_add').find('dl.policy_option').is(":visible")) { // 옵션인 경우 패스
		lf_closePolicyEdit();
		return; 
	}
	
	var policyMethod = $("#policy_edit #rule_add input[name='policyMethod']").val();
	var policyId = policyMethod == _ADD? getUUID() : $("#policy_edit #rule_add input[name='policyId']").val();
	
	var policy = {
		"mode": $("#policy_edit #rule_add select[name='mode']").val(),
		"filename": $("#policy_edit #rule_add input[name='filename']").val()
	};
	
	var mode = 'OFF';
	if(policy.mode == _MODE['ON']) mode = 'ON';
	else if (policy.mode == _MODE['OFF']) mode = 'OFF';
	else if (policy.mode == _MODE['WARN']) mode = 'WARN';
	else mode = 'SKIP';
	
	if(!validationMalwarePolicy(policy)) return;
	
	if(policyMethod == _ADD) {
		if(existsMalwarePolicy(policy, null)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		if($("#" + policyId)) $("#policy_edit #rule_edit tbody").append("<tr id=\"" + policyId + "\"></tr>");
		
		var html = "";
		html += "	<td>";
		html += "		<div class=\"move_icon\">1</div>";
		html += "	</td>";
		html += "	<td class=\"long_w\">" + mode + "</td>";
		html += "	<td class=\"long_w tl\">" + policy.filename + "</td>";
		html += "	<td class=\"long_w\">";
		html += "		<div>";
		html += "			<a href=\"javascript:lf_delMalwarePolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
		html += "			<a href=\"javascript:lf_changeMalwarePolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
		html += "		</div>";
		html += "	</td>";
		
		$("#policy_edit #rule_edit tbody").append("<tr id=\"" + policyId + "\"></tr>");
		$("#" + policyId).html(html);
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();
	} else {
		if(existsMalwarePolicy(policy, policyId)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		$("#" + policyId).find("td").eq(1).text(mode);
		$("#" + policyId).find("td").eq(2).text(policy.filename);
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();	
	}
	
	lf_closePolicyEdit();
}

function lf_changeMalwarePolicyEdit(policyId) {
	$("#policy_edit #rule_add input[name='policyId']").val(policyId);
	$("#policy_edit #rule_add input[name='policyMethod']").val(_EDIT);
	var policy = JSON.parse($("#" + policyId).attr("data-value"));
	$(".securitypolicy_add").addClass("on");
	$('#policy_edit #rule_add').find('dl.policy_option').hide();
    $('#policy_edit #rule_add').find('dl.policy_body').show();
	
	$("#policy_edit #rule_add input[name='policyId']").val(policyId);
	$("#policy_edit #rule_add select[name='mode']").val(policy.mode).prop("selected", true);
	$("#policy_edit #rule_add input[name='filename']").val(policy.filename);
	$("#policy_edit #rule_add select").niceSelect("update");
}

function lf_delMalwarePolicyEdit(policyId) {
	swal("정책 삭제","선택 한 정책을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if(willDelete) $("#" + policyId).remove();
	});
}

function lf_loadFirewallPolicyEdit(policy) {
	var html = "";
	html += "<table class=\"click\">";
	html += "	<colgroup>";
	html += "		<col width=\"10%\">";
	html += "		<col width=\"20%\">";
	html += "		<col width=\"20%\">";
	html += "		<col width=\"12%\">";
	html += "		<col width=\"12%\">";
	html += "		<col width=\"auto\">";
	html += "		<col width=\"12%\">";
	html += "	</colgroup>";
	html += "	<thead>";
	html += "		<tr>";
	html += "			<th>우선순위</th>";
	html += "			<th>출발지</th>";
	html += "			<th>도착지</th>";
	html += "			<th>프로토콜</th>";
	html += "			<th>액션</th>";
	html += "			<th>메세지</th>";
	html += "			<th>관리</th>";
	html += "		</tr>";
	html += "	</thead>";
	html += "	<tbody>";
	
	if(policy != null) {
		$.each(policy.policystr, function(index, item) {
			var policyId = getUUID();
			
			var mode = 'OFF';
			if(item.mode == _MODE['ON']) mode = 'ON';
			else if (item.mode == _MODE['OFF']) mode = 'OFF';
			else if (item.mode == _MODE['WARN']) mode = 'WARN';
			else mode = 'SKIP';
			
			html += "		<tr id=\"" + policyId + "\" data-value='" + JSON.stringify(item) + "'>";
			html += "			<td>";
			html += "				<div class=\"move_icon\">1</div>";
			html += "			</td>";
		    html += "			<td class=\"long_w tl\" title=\"" + (isAnyIpAddress(item.src_ip) ? _ANY : item.src_ip) + ':' + (isAnyPort(item.src_port) ? _ANY : item.src_port) + "\">" + (isAnyIpAddress(item.src_ip) ? _ANY : item.src_ip) + ':' + (isAnyPort(item.src_port) ? _ANY : item.src_port) + "</td>";
		    html += "			<td class=\"long_w tl\" title=\"" + (isAnyIpAddress(item.dest_ip) ? _ANY : item.dest_ip) + ':' + (isAnyPort(item.dest_port) ?  _ANY : item.dest_port) + "\">" + (isAnyIpAddress(item.dest_ip) ? _ANY : item.dest_ip) + ':' + (isAnyPort(item.dest_port) ?  _ANY : item.dest_port) + "</td>";
		    html += "			<td class=\"long_w\">" + item.protocol.toUpperCase() + "</td>";
		    html += "			<td class=\"long_w\">" + item.action + "</td>";
		    html += "			<td class=\"long_w tl\" title=\"" + item.message + "\">" + item.message + "</td>";
			html += "			<td class=\"long_w\">";
			html += "				<div>";
			html += "					<a href=\"javascript:lf_delFirewallPolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
			html += "					<a href=\"javascript:lf_changeFirewallPolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
			html += "				</div>";
			html += "			</td>";
		    html += "		</tr>";
		});
	} else {
		/*
		html += "		<tr>";
		html += "			<td class=\"long_w\" colspan=\"7\">No data</td>";
		html += "		</tr>";
		*/
	}
	
	html += "	</tbody>";
	html += "</table>";
	$("#policy_edit #rule_edit").html(html);
	$("#policy_edit #rule_edit tbody").sortable();
	
	html = "";
	html += "<input type=\"hidden\" name=\"policyId\" value=\"" + getUUID() + "\">";
	html += "<input type=\"hidden\" name=\"policyMethod\" value=\"" + _ADD + "\">";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>출발지</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"ANY-IP\" name=\"src_ip\">";
	html += "		</div>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"ANY-PORT\" name=\"src_port\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>도착지</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"ANY-IP\" name=\"dest_ip\">";
	html += "		</div>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"ANY-PORT\" name=\"dest_port\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>프로토콜</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"protocol\" class=\"popup_sel\">";
	html += "					<option value=\"tcp\">TCP</option>";
	html += "					<option value=\"udp\">UDP</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>액션</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"action\" class=\"popup_sel\">";
	html += "					<option value=\"allow\">allow</option>";
	html += "					<option value=\"alert\">alert</option>";
	html += "					<option value=\"drop\">drop</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>메세지</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"위반 출력 메세지\" name=\"message\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<div class=\"btn_wrap fr\">";
	html += "	<a href=\"javascript:lf_closePolicyEdit();\" class=\"btn grey securitypolicy_add_btn\">취소</a>";
	html += "	<a href=\"javascript:lf_addFirewallPolicyEdit();\" class=\"btn\">확인</a>";
	html += "</div>";
	$("#policy_edit #rule_add").html(html);
	$("#policy_edit #rule_add select").niceSelect();
	
	$('#policy_edit a[rel="rule_add_btn"]').show();
}

function lf_addFirewallPolicyEdit() {
	var policyMethod = $("#policy_edit #rule_add input[name='policyMethod']").val();
	var policyId = policyMethod == _ADD? getUUID() : $("#policy_edit #rule_add input[name='policyId']").val();
	
	var policy = {
		"src_ip": $("#policy_edit #rule_add input[name='src_ip']").val(),
		"src_port": $("#policy_edit #rule_add input[name='src_port']").val(),
		"dest_ip": $("#policy_edit #rule_add input[name='dest_ip']").val(),
		"dest_port": $("#policy_edit #rule_add input[name='dest_port']").val(),
		"protocol": $("#policy_edit #rule_add select[name='protocol']").val(),
		"action": $("#policy_edit #rule_add select[name='action']").val(),
		"message": $("#policy_edit #rule_add input[name='message']").val()
	};
	
	if(!policy.src_ip) policy.src_ip = "0";
	if(!policy.src_port) policy.src_port = "0";
	if(!policy.dest_ip) policy.dest_ip = "0";
	if(!policy.dest_port) policy.dest_port = "0";
	
	var mode = 'OFF';
	if(policy.mode == _MODE['ON']) mode = 'ON';
	else if (policy.mode == _MODE['OFF']) mode = 'OFF';
	else if (policy.mode == _MODE['WARN']) mode = 'WARN';
	else mode = 'SKIP';
	
	if(!validationFirewallPolicy(policy)) return;
	
	var src = (isAnyIpAddress(policy.src_ip) ? _ANY : policy.src_ip) + ':' + (isAnyPort(policy.src_port) ? _ANY : policy.src_port);
	var dest = (isAnyIpAddress(policy.dest_ip) ? _ANY : policy.dest_ip) + ':' + (isAnyPort(policy.dest_port) ?  _ANY : policy.dest_port);
	if(policyMethod == _ADD) {
		if(existsFirewallPolicy(policy, null)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		if($("#" + policyId)) $("#policy_edit #rule_edit tbody").append("<tr id=\"" + policyId + "\"></tr>");
		
		var html = "";
		html += "	<td>";
		html += "		<div class=\"move_icon\">1</div>";
		html += "	</td>";
	    html += "	<td class=\"long_w tl\" title=\"" + src + "\">" + src + "</td>";
	    html += "	<td class=\"long_w tl\" title=\"" + dest + "\">" + dest + "</td>";
	    html += "	<td class=\"long_w\">" + policy.protocol.toUpperCase() + "</td>";
	    html += "	<td class=\"long_w\">" + policy.action + "</td>";
	    html += "	<td class=\"long_w tl\" title=\"" + policy.message + "\">" + policy.message + "</td>";
		html += "	<td class=\"long_w\">";
		html += "		<div>";
		html += "			<a href=\"javascript:lf_delFirewallPolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
		html += "			<a href=\"javascript:lf_changeFirewallPolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
		html += "		</div>";
		html += "	</td>";
		$("#" + policyId).html(html);
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();
	} else {
		if(existsFirewallPolicy(policy, policyId)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		$("#" + policyId).find("td").eq(1).text(src);
		$("#" + policyId).find("td").eq(1).attr("title", src);		
		$("#" + policyId).find("td").eq(2).text(dest);
		$("#" + policyId).find("td").eq(2).attr("title", dest);
		$("#" + policyId).find("td").eq(3).text(policy.protocol.toUpperCase());
		$("#" + policyId).find("td").eq(4).text(policy.message);
		$("#" + policyId).find("td").eq(4).attr("title", policy.message);
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();			
	}
	
	lf_closePolicyEdit();
}

function lf_changeFirewallPolicyEdit(policyId) {
	$("#policy_edit #rule_add input[name='policyId']").val(policyId);
	$("#policy_edit #rule_add input[name='policyMethod']").val(_EDIT);
	var policy = JSON.parse($("#" + policyId).attr("data-value"));
	$(".securitypolicy_add").addClass("on");
	
	var src_ip = (isAnyIpAddress(policy.src_ip) ? _ANY : policy.src_ip);	
	$("#policy_edit #rule_add input[name='src_ip']").val(src_ip);
	
	var src_port = (isAnyPort(policy.src_port) ? _ANY : policy.src_port)
	$("#policy_edit #rule_add input[name='src_port']").val(src_port);
	
	var dest_ip = (isAnyIpAddress(policy.dest_ip) ? _ANY : policy.dest_ip);	
	$("#policy_edit #rule_add input[name='dest_ip']").val(dest_ip);
	
	var dest_port = (isAnyPort(policy.dest_port) ? _ANY : policy.dest_port)
	$("#policy_edit #rule_add input[name='dest_port']").val(dest_port);
	
	$("#policy_edit #rule_add select[name='protocol']").val(policy.protocol).prop("selected", true);
	$("#policy_edit #rule_add select[name='action']").val(policy.action).prop("selected", true);
	$("#policy_edit #rule_add input[name='message']").val(policy.message);
	$("#policy_edit #rule_add select").niceSelect("update");
}

function lf_delFirewallPolicyEdit(policyId) {
	swal("정책 삭제","선택 한 정책을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if(willDelete) $("#" + policyId).remove();
	});
}

function lf_loadFileAppctlPolicyEdit(policy) {
	var html = "";
	html += "<table class=\"click\">";
	html += "	<colgroup>";
	html += "		<col width=\"10%\">";
	html += "		<col width=\"12%\">";
	html += "		<col width=\"auto\">";
	html += "		<col width=\"15%\">";
	html += "	</colgroup>";
	html += "	<thead>";
	html += "		<tr>";
	html += "			<th>우선순위</th>";
	html += "			<th>모드</th>";
	html += "			<th>파일</th>";
	html += "			<th>관리</th>";
	html += "		</tr>";
	html += "	</thead>";
	html += "	<tbody>";
	
	if(policy != null) {
		$.each(policy.policystr, function(index, item) {
			var policyId = getUUID();
			
			html += "		<tr id=\"" + policyId + "\" data-value='" + JSON.stringify(item) + "'>";
			html += "			<td>";
			html += "				<div class=\"move_icon\">1</div>";
			html += "			</td>";
		    html += "			<td class=\"long_w\">" + (item.mode == _MODE['ON'] ? 'ON' : 'OFF') + "</td>";
		    html += "			<td class=\"long_w tl\" title=\"" + item.filename + "\">" + item.filename + "</td>";
			html += "			<td class=\"long_w\">";
			html += "				<div>";
			html += "					<a href=\"javascript:lf_delFileAppctlPolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
			html += "					<a href=\"javascript:lf_changeFileAppctlPolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
			html += "				</div>";
			html += "			</td>";
		    html += "		</tr>";
		});
	} else {
		/*
		html += "		<tr>";
		html += "			<td class=\"long_w\" colspan=\"4\">No data</td>";
		html += "		</tr>";
		*/
	}
	
	html += "	</tbody>";
	html += "</table>";
	$("#policy_edit #rule_edit").html(html);
	$("#policy_edit #rule_edit tbody").sortable();
	
	html = "";
	html += "<input type=\"hidden\" name=\"policyId\" value=\"" + getUUID() + "\">";
	html += "<input type=\"hidden\" name=\"policyMethod\" value=\"" + _ADD + "\">";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>모드</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"mode\" class=\"popup_sel\">";
	html += "					<option value=\"" + _MODE['ON'] + "\" " + (type == _MODE['ON'] ? "selected" : "") + ">ON</option>";
	html += "					<option value=\"" + _MODE['OFF'] + "\" " + (type == _MODE['OFF'] ? "selected" : "") + ">OFF</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>파일</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"파일의 전체 경로를 작성해주세요.\" name=\"filename\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	if($("#policy_edit #title").attr("data-type") == _POLICY_APPCTL) {
		var type = _BLACK_LIST;
		if(policy != null && policy.optionstr) {
			type = policy.optionstr.type;
		}
		
		html += "<dl class=\"policy_option\">";
		html += "	<dt>유형</dt>";
		html += "	<dd>";
		html += "		<div class=\"w50\">";
		html += "			<div class=\"sel_box\">";
		html += "				<select name=\"type\" class=\"popup_sel\">";
		html += "					<option value=\"" + _BLACK_LIST + "\" " + (type == _BLACK_LIST ? "selected" : "") + ">블랙리스트</option>";
		html += "					<option value=\"" + _WHITE_LIST + "\" " + (type == _WHITE_LIST ? "selected" : "") + ">화이트리스트</option>";
		html += "				</select>";
		html += "			</div>";
		html += "		</div>";
		html += "	</dd>";
		html += "</dl>";
	}
	html += "<div class=\"btn_wrap fr\">";
	html += "	<a href=\"javascript:lf_closePolicyEdit();\" class=\"btn grey securitypolicy_add_btn\">취소</a>";
	html += "	<a href=\"javascript:lf_addFileAppctlPolicyEdit();\" class=\"btn\">확인</a>";
	html += "</div>";
	$("#policy_edit #rule_add").html(html);
	$("#policy_edit #rule_add select").niceSelect();
	
	$('#policy_edit a[rel="rule_add_btn"]').show();
}

function lf_addFileAppctlPolicyEdit() {
	if($('#policy_edit #rule_add').find('dl.policy_option').is(":visible")) { // 옵션인 경우 패스
		lf_closePolicyEdit();
		return; 
	}
	
	var policyMethod = $("#policy_edit #rule_add input[name='policyMethod']").val();
	var policyId = policyMethod == _ADD? getUUID() : $("#policy_edit #rule_add input[name='policyId']").val();
	
	var policy = {
		"mode": $("#policy_edit #rule_add select[name='mode']").val(),
		"filename": $("#policy_edit #rule_add input[name='filename']").val()
	};
	
	var mode = 'OFF';
	if(policy.mode == _MODE['ON']) mode = 'ON';
	else mode = 'OFF';
	
	if(!validationFileAppctlPolicy(policy)) return;
	
	if(policyMethod == _ADD) {
		if(existsFileAppctlPolicy(policy, null)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		if($("#" + policyId)) $("#policy_edit #rule_edit tbody").append("<tr id=\"" + policyId + "\"></tr>");
		
		var html = "";
		html += "	<td>";
		html += "		<div class=\"move_icon\">1</div>";
		html += "	</td>";
	    html += "	<td class=\"long_w\">" + mode + "</td>";
	    html += "	<td class=\"long_w tl\" title=\"" + policy.filename + "\">" + policy.filename + "</td>";
		html += "	<td class=\"long_w\">";
		html += "		<div>";
		html += "			<a href=\"javascript:lf_delFileAppctlPolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
		html += "			<a href=\"javascript:lf_changeFileAppctlPolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
		html += "		</div>";
		html += "	</td>";
		$("#" + policyId).html(html);
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();
	} else {		
		if(existsFileAppctlPolicy(policy, policyId)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		$("#" + policyId).find("td").eq(1).text(mode);
		$("#" + policyId).find("td").eq(2).text(policy.filename);
		$("#" + policyId).find("td").eq(2).attr("title", policy.filename);
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();	
	}
	
	lf_closePolicyEdit();
}

function lf_changeFileAppctlPolicyEdit(policyId) {
	$("#policy_edit #rule_add input[name='policyId']").val(policyId);
	$("#policy_edit #rule_add input[name='policyMethod']").val(_EDIT);
	var policy = JSON.parse($("#" + policyId).attr("data-value"));
	$(".securitypolicy_add").addClass("on");
	$('#policy_edit #rule_add').find('dl.policy_option').hide();
    $('#policy_edit #rule_add').find('dl.policy_body').show();
	
	$("#policy_edit #rule_add select[name='mode']").val(policy.mode).prop("selected", true);
	$("#policy_edit #rule_add input[name='filename']").val(policy.filename);
	$("#policy_edit #rule_add select").niceSelect("update");
}

function lf_delFileAppctlPolicyEdit(policyId) {
	swal("정책 삭제","선택 한 정책을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if(willDelete) $("#" + policyId).remove();
	});
}

function lf_loadPamAclPolicyEdit(policy) {
	var html = "";
	html += "<table class=\"click\">";
	html += "	<colgroup>";
	html += "		<col width=\"10%\">";
	html += "		<col width=\"15%\">";
	html += "		<col width=\"20%\">";
	html += "		<col width=\"15%\">";
	html += "		<col width=\"auto\">";
	html += "		<col width=\"15%\">";
	html += "	</colgroup>";
	html += "	<thead>";
	html += "		<tr>";
	html += "			<th>우선순위</th>";
	html += "			<th>타입</th>";
	html += "			<th>접근 허용</th>";
	html += "			<th>대상</th>";
	html += "			<th>서비스</th>";
	html += "			<th>IP</th>";
	html += "			<th>관리</th>";
	html += "		</tr>";
	html += "	</thead>";
	html += "	<tbody>";
	
	if(policy != null) {
		$.each(policy.policystr, function(index, item) {
			var policyId = getUUID();
			
			var ipmask = item.ip;
			if (isAnyIpAddress(ipmask)) ipmask = _ANY;
			else ipmask = ipmask + "/" + item.netmask;
			
			var target = item.target;
			if(target == _TARGET_DEFAULT) target = '기본'
			else if(target == _TARGET_USER) target = '사용자';
			else if(target == _TARGET_GROUP) target = '그룹';
			else target = item.target;
			
			html += "		<tr id=\"" + policyId + "\" data-value='" + JSON.stringify(item) + "'>";
			html += "			<td>";
			html += "				<div class=\"move_icon\">1</div>";
			html += "			</td>";
		    html += "			<td class=\"long_w\">" + target + "</td>";
		    html += "			<td class=\"long_w\">" + item.permission + "</td>";
		    html += "			<td class=\"long_w\">" + item.userid + "</td>";
		    html += "			<td class=\"long_w\">" + item.service + "</td>";
		    html += "			<td class=\"long_w tl\" title=\"" + ipmask + "\">" + ipmask + "</td>";
			html += "			<td class=\"long_w\">";
			html += "				<div>";
			html += "					<a href=\"javascript:lf_delPamAclPolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
			html += "					<a href=\"javascript:lf_changePamAclPolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
			html += "				</div>";
			html += "			</td>";
		    html += "		</tr>";
		});
	} else {
		/*
		html += "		<tr>";
		html += "			<td class=\"long_w\" colspan=\"7\">No data</td>";
		html += "		</tr>";
		*/
	}
	
	var twofactor = _TF_MODE['OFF'];
	if(policy && policy.optionstr) {
		twofactor = policy.optionstr.twofactor;
	}
		
	html += "	</tbody>";
	html += "</table>";
	$("#policy_edit #rule_edit").html(html);
	$("#policy_edit #rule_edit tbody").sortable();
	
	html = "";	
	html += "<input type=\"hidden\" name=\"policyId\" value=\"" + getUUID() + "\">";
	html += "<input type=\"hidden\" name=\"policyMethod\" value=\"" + _ADD + "\">";
	html += "<dl class=\"policy_option\">";
	html += "	<dt>2차인증</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"twofactor\" class=\"popup_sel\">";
	html += "					<option value=\"" + _TF_MODE['OFF'] + "\" " + (twofactor == _TF_MODE['OFF'] ? "selected" : "") + ">비활성화</option>";
	html += "					<option value=\"" + _TF_MODE['ON']  + "\" " + (twofactor == _TF_MODE['ON'] ? "selected" : "") + ">활성화</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>타입</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"target\" class=\"popup_sel\">";
	html += "					<option value=\"" + _TARGET_DEFAULT + "\">기본</option>";
	html += "					<option value=\"" + _TARGET_USER + "\">사용자</option>";
	html += "					<option value=\"" + _TARGET_GROUP + "\">그룹</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>접근 허용</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"permission\" class=\"popup_sel\">";
	html += "					<option value=\"+\">+</option>";
	html += "					<option value=\"-\">-</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>대상</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"User/Group\" name=\"userid\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>서비스</dt>";
	html += "	<dd>";
	html += "		<div class=\"w50\">";
	html += "			<div class=\"sel_box\">";
	html += "				<select name=\"service\" class=\"popup_sel\">";
	html += "					<option value=\"ALL\">ALL</option>";
	html += "					<option value=\"sshd\">sshd</option>";
	html += "					<option value=\"remote\">remote</option>";
	html += "					<option value=\"rlogin\">rlogin</option>";
	html += "					<option value=\"vsftpd\">vsftpd</option>";
	html += "				</select>";
	html += "			</div>";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>IP</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"ANY/IP/IP1-IP2\" name=\"ip\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<dl class=\"policy_body\">";
	html += "	<dt>Netmask</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "			<input class=\"no_radius\" type=\"text\" placeholder=\"255.255.255.255\" name=\"netmask\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	html += "<div class=\"btn_wrap fr\">";
	html += "	<a href=\"javascript:lf_closePolicyEdit();\" class=\"btn grey securitypolicy_add_btn\">취소</a>";
	html += "	<a href=\"javascript:lf_addPamAclPolicyEdit();\" class=\"btn\">확인</a>";
	html += "</div>";
	$("#policy_edit #rule_add").html(html);
	$("#policy_edit #rule_add select").niceSelect();
	
	$('#policy_edit a[rel="rule_add_btn"]').show();
}

function lf_addPamAclPolicyEdit() {	
	if($('#policy_edit #rule_add').find('dl.policy_option').is(":visible")) { // 옵션인 경우 패스
		lf_closePolicyEdit();
		return; 
	}
	
	var policyMethod = $("#policy_edit #rule_add input[name='policyMethod']").val();
	var policyId = policyMethod == _ADD? getUUID() : $("#policy_edit #rule_add input[name='policyId']").val();

	var policy = {
		"target": $("#policy_edit #rule_add select[name='target']").val(),
		"permission": $("#policy_edit #rule_add select[name='permission']").val(),
		"userid": $("#policy_edit #rule_add input[name='userid']").val(),
		"service": $("#policy_edit #rule_add select[name='service']").val(),
		"ip": $("#policy_edit #rule_add input[name='ip']").val(),
		"netmask": $("#policy_edit #rule_add input[name='netmask']").val()
	};
	
	// 데이터 보정
	if(!policy.ip || isAnyIpAddress(policy.ip)) {
		policy.ip = _ANY;
		$("#policy_edit #rule_add input[name='ip']").val(policy.ip);
	}
	if(!policy.netmask) {
		policy.netmask = "255.255.255.255";
		$("#policy_edit #rule_add input[name='netmask']").val(policy.netmask);
	}
	if(policy.target == _TARGET_DEFAULT) {
		policy.userid = "*";
		$("#policy_edit #rule_add input[name='userid']").val(policy.userid);
	}
	
	var ipmask = policy.ip;
	if (isAnyIpAddress(ipmask)) ipmask = _ANY;
	else ipmask = ipmask + "/" + policy.netmask;
	
	var target = policy.target;
	if(target == _TARGET_DEFAULT) target = '기본'
	else if(target == _TARGET_USER) target = '사용자';
	else if(target == _TARGET_GROUP) target = '그룹';
	else target = policy.target;
	
	if(!validationPamAclPolicy(policy)) return;

	if(policyMethod == _ADD) { // 추가
		if(existsPamAclPolicy(policy, null)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		if($("#" + policyId)) $("#policy_edit #rule_edit tbody").append("<tr id=\"" + policyId + "\"></tr>");				
		var html = "";
		html += "	<td>";
		html += "		<div class=\"move_icon\">1</div>";
		html += "	</td>";
	    html += "	<td class=\"long_w\">" + target + "</td>";
	    html += "	<td class=\"long_w\">" + policy.permission + "</td>";
	    html += "	<td class=\"long_w\">" + policy.userid + "</td>";
	    html += "	<td class=\"long_w\">" + policy.service + "</td>";
	    html += "	<td class=\"long_w tl\" title=\"" + ipmask + "\">" + ipmask + "</td>";
		html += "	<td class=\"long_w\">";
		html += "		<div>";
		html += "			<a href=\"javascript:lf_delPamAclPolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
		html += "			<a href=\"javascript:lf_changePamAclPolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
		html += "		</div>";
		html += "	</td>";
		$("#" + policyId).html(html);
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();
	} else {
		if(existsPamAclPolicy(policy, policyId)) {
			alert("중복 정책이 존재합니다.");
			return;
		}
		
		$("#" + policyId).find("td").eq(1).text(target);
		$("#" + policyId).find("td").eq(2).text(policy.permission);
		$("#" + policyId).find("td").eq(3).text(policy.userid);
		$("#" + policyId).find("td").eq(4).text(policy.service);
		$("#" + policyId).find("td").eq(5).attr("title", ipmask);
		$("#" + policyId).find("td").eq(5).text(ipmask);		
		$("#" + policyId).attr("data-value", JSON.stringify(policy));
		$("#policy_edit #rule_edit tbody").sortable();
	}
	
	lf_closePolicyEdit();
	//값도 클리어
}

function lf_changePamAclPolicyEdit(policyId) {
	$("#policy_edit #rule_add input[name='policyId']").val(policyId);
	$("#policy_edit #rule_add input[name='policyMethod']").val(_EDIT);
	var policy = JSON.parse($("#" + policyId).attr("data-value"));
		
	$(".securitypolicy_add").addClass("on");
	$('#policy_edit #rule_add').find('dl.policy_option').hide();
    $('#policy_edit #rule_add').find('dl.policy_body').show();
	
	$("#policy_edit #rule_add select[name='target']").val(policy.target).prop("selected", true);
	$("#policy_edit #rule_add select[name='permission']").val(policy.permission).prop("selected", true);
	$("#policy_edit #rule_add input[name='userid']").val(policy.userid);
	$("#policy_edit #rule_add select[name='service']").val(policy.service).prop("selected", true);
	
	if(isAnyIpAddress(policy.ip)) $("#policy_edit #rule_add input[name='ip']").val(_ANY);  
	else $("#policy_edit #rule_add input[name='ip']").val(policy.ip);
	
	
	$("#policy_edit #rule_add input[name='netmask']").val(policy.netmask);
	$("#policy_edit #rule_add select").niceSelect("update");
}

function lf_delPamAclPolicyEdit(policyId) {
	swal("정책 삭제","선택 한 정책을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if(willDelete) $("#" + policyId).remove();
	});
}

function lf_serviceCall800041CallBack(data) {	
	alert('정책이 설정되었습니다.');
	//$('td.on').find('a').trigger('click');
	//$('.modal').find('a.close').trigger('click'); 
	lf_closePolicyEditModal();
	lf_reloadPolicyBoard();
}

function lf_removePolicy(policyType, equipList) {
	swal("정책 삭제","선택 한 정책을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if(willDelete) {
			var body = {
				"policyType": policyType,
				"equipList" : equipList
			};
			//console.log('body > ', body);
			cf_requestServer(_TR_POLICY_REMOVE, body, function(){
				swal("정책 삭제", "정상적으로 처리되었습니다.", "./assets/images/icon_alert02.png", {
					buttons:"확인"
				}).then(function(willDelete) {
					lf_reloadPolicyBoard();
				});
			});
		} else {
			swal("정책 삭제", "취소하였습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		}
	});
}

function lf_loadAgentAllList() {
	var body = {};
	cf_requestServer(_TR_POLICY_AGENT_LIST,body,lf_serviceCall800034CallBack);
}

function lf_serviceCall800032CallBack_All(data) { 
	//console.log('800034::', data);
	var allAgentList = data.body.dataList;
}

function lf_loadAgentList(policyType, rev) {
	var body = {
		'policyType': policyType,
		'mark_rev' : rev
	};
	if(rev === _NEW_REV) {
		delete body.mark_rev;
		var data = {};
		lf_serviceCall800034CallBack(data);
		return;
	}
	cf_requestServer(_TR_POLICY_AGENT_LIST,body,lf_serviceCall800034CallBack);
}

function lf_serviceCall800034CallBack(data) {
	//console.log('800034::', data);
	if($.isEmptyObject(data)) {
		data = {
			body: {
				dataList: []
			}
		};
	}
	var agentList = data.body.dataList;
	var body = {};
	cf_requestServer(_TR_POLICY_REVISION_STAT,body,lf_serviceCall800032CallBack_All, false);
    
	function lf_serviceCall800032CallBack_All(data) {
		var allAgentList = data.body.dataList;

		var html = "";
		$.each(allAgentList, function(idx, item) {
			html += "<tr>";
			html += "	<td>";
			html += "		<div class=\"chk_box\">";
			html += "			<input type=\"checkbox\" name=\"equipList\" id=\"check" + idx + "\" value=\"" + item.hardwareid + "\" >";
			html += "			<label for=\"check" + idx + "\"></label>";
			html += "		</div>";
			html += "	</td>";
			html += "	<td class=\"long_w tl\">" + item.masterip + "</td>";
			html += "	<td class=\"long_w tl\">" + item.equipname + "</td>";
			html += "	<td class=\"long_w tl\">" + item.osver + "</td>";
			html += "</tr>";
		});
		$("#policy_edit #equip_list").html(html);
		
		// 선택한 Agent + AgentList 에 있는 check 선택
		if(selectAgent) $("#equip_list input[type='checkbox'][value='" + selectAgent + "']").prop("checked", true);
		$.each(agentList, function(idx1, item1) {
			$("#equip_list input[type='checkbox'][value='" + item1.equip_id + "']").prop("checked", true);
		});
		
		console.log(allAgentList);
	}
}

function requestProcessAdd(pName) {
	if(!pName) return 0;
	if(pName.length < 1) return 0;

	var specialChars = "\":*?<>";
	for(var i = 0; i < specialChars.length; i++) {
		pName = pName.replace(new RegExp("\\" + specialChars[i], "gi"), "");
	}
	
	var checkData = true;
	$.each($("#policy_edit #rule_edit tbody tr"), function(idx, item) {
		var policy = JSON.parse(item.attr("data-value"));
		if(policy.filename== pName) {
			checkData = false;
			return checkData;
		}
	});
	if(!checkData) return 0;
	
	$(".securitypolicy_add").removeClass("on");
	var policyId = $("#policy_edit #rule_add input[name='policyId']").val();
	
	var policy = {
		"mode": "ON",
		"filename": pName
	};
	
	if($("#" + policyId)) $("#policy_edit #rule_edit tbody").append("<tr id=\"" + policyId + "\"></tr>");
	
	var html = "";
	html += "	<td>";
	html += "		<div class=\"move_icon\">1</div>";
	html += "	</td>";
    html += "	<td class=\"long_w\">ON</td>";
    html += "	<td class=\"long_w tl\" title=\"" + pName + "\">" + pName + "</td>";
	html += "	<td class=\"long_w\">";
	html += "		<div>";
	html += "			<a href=\"javascript:lf_delFileAppctlPolicyEdit('" + policyId + "');\" class=\"btn icon del\">룰 삭제</a>";
	html += "			<a href=\"javascript:lf_changeFileAppctlPolicyEdit('" + policyId + "');\" class=\"btn icon edit\">룰 편집</a>";
	html += "		</div>";
	html += "	</td>";
	$("#" + policyId).html(html);
	$("#" + policyId).attr("data-value", JSON.stringify(policy));
	$("#policy_edit #rule_edit tbody").sortable();
	
	return 1;
}


function lf_resetPolicyEdit() {
	$("#policy_edit #rule_add dl.policy_body input[type='radio']:eq(0)").prop("checked", true);
	$("#policy_edit #rule_add dl.policy_body select").find("option:eq(0)").prop("selected", true);
	$("#policy_edit #rule_add dl.policy_body select").niceSelect("update");	
	$("#policy_edit #rule_add dl.policy_body input[type='text']").val("");
	$("#policy_edit #rule_edit textarea").text("");
	
	$("#policy_edit #rule_add input[name='policyMethod']").val(_ADD);
}

function lf_closePolicyEdit() {
	$(".securitypolicy_add").removeClass("on");
	lf_resetPolicyEdit();	
}

/*************************************************************************************
 * 데이터 체크
 **************************************************************************************/
 function validationPamAclPolicy(policy) {	
	if(policy['target'] != _TARGET_DEFAULT && policy['target'] != _TARGET_GROUP && policy['target'] != _TARGET_USER) {
		alert("타입이 올바르지 않습니다");		
		return false;
	} 
	
	if(policy['target'] != _TARGET_DEFAULT && !policy['userid']) {
		alert("사용자 또는 그룹명이 올바르지 않습니다");		
		return false;
	}
	
	if(policy['permission'] != '+' && policy['permission'] != '-') {
		alert("접근 허용이 올바르지 않습니다");		
		return false;
	}
	
	
	if(!validateIpAddress(policy['ip'])) {
		alert("IP가 올바르지 않습니다");
		return false;
	}
	
	if(!validateIpAddress(policy['netmask'])) {
		alert("Netmask가 올바르지 않습니다");
		return false;
	}
	
	return true;
}

function existsPamAclPolicy(policy, ignorePolicyId) {
	var exists = false;
	$.each($("#policy_edit #rule_edit tbody tr"), function(idx, item) {
		var data = JSON.parse($(item).attr("data-value"));
		var id = $(item).attr("id");
		
		// 수정 할 Row 는 중복값 체크를 무시한다
		if(id == ignorePolicyId) return;
		
		if(policy['target'] == data['target'] 
			&& policy['permission'] == data['permission']
			&& policy['userid'] == data['userid']
			&& policy['service'] == data['service']
			&& policy['ip'] == data['ip']
			&& policy['netmask'] == data['netmask']) {
			exists = true;
		}						
	});
	
	return exists;
}

function validationMalwarePolicy(policy) { 
	if(policy['mode'] != _MODE['ON'] && policy['mode'] != _MODE['OFF'] && policy['mode'] != _MODE['SKIP']) {
		alert("모드가 올바르지 않습니다");		
		return false;
	} 
	
	var filePath = policy['filename'];
	if (!filePath) {
        alert('파일 경로의 값이 비어있습니다.');
        return false;
    } else if(!filePath.startsWith('/') && !/^[a-zA-Z]{1}:/g.test(filePath)) {
    	alert('파일 올바르지 않습니다');
        return false;
    }
    
    return true;
}

function existsMalwarePolicy(policy, ignorePolicyId) { 
	var exists = false;
	$.each($("#policy_edit #rule_edit tbody tr"), function(idx, item) {
		var data = JSON.parse($(item).attr("data-value"));
		var id = $(item).attr("id");
		
		// 수정 할 Row 는 중복값 체크를 무시한다
		if(id == ignorePolicyId) return;
		
		if(policy['mode'] == data['mode'] 
			&& policy['filename'] == data['filename']) {
			exists = true;
		}						
	});
	
	return exists; 
}

function validationFileAppctlPolicy(policy) {
	if(policy['mode'] != _MODE['ON'] && policy['mode'] != _MODE['OFF']) {
		alert("모드가 올바르지 않습니다");		
		return false;
	} 
	
	var filePath = policy['filename'];
	if (!filePath) {
        alert('파일 경로의 값이 비어있습니다.');
        return false;
    } else if(!filePath.startsWith('/') && !/^[a-zA-Z]{1}:/g.test(filePath)) {
    	alert('파일 올바르지 않습니다');
        return false;
    } 
	 
	return true; 
}
function existsFileAppctlPolicy(policy, ignorePolicyId) { 
	var exists = false;
	$.each($("#policy_edit #rule_edit tbody tr"), function(idx, item) {
		var data = JSON.parse($(item).attr("data-value"));
		var id = $(item).attr("id");
		
		// 수정 할 Row 는 중복값 체크를 무시한다
		if(id == ignorePolicyId) return;
		
		if(policy['mode'] == data['mode'] 
			&& policy['filename'] == data['filename']) {
			exists = true;
		}						
	});
	
	return exists;
}


function validationFirewallPolicy(policy) {
	if(!validateIpAddress(policy['src_ip'])) {
		alert("출발지 IP가 올바르지 않습니다");
		return false;
	}
	if(!validateIpAddress(policy['dest_ip'])) {
		alert("도착지 IP가 올바르지 않습니다");
		return false;
	}
    
    return true; 
}

function existsFirewallPolicy(policy, ignorePolicyId) { 
	var exists = false;
	$.each($("#policy_edit #rule_edit tbody tr"), function(idx, item) {
		var data = JSON.parse($(item).attr("data-value"));
		var id = $(item).attr("id");
		
		// 수정 할 Row 는 중복값 체크를 무시한다
		if(id == ignorePolicyId) return;
		
		if(policy['src_ip'] == data['src_ip'] 
			&& policy['dest_ip'] == data['dest_ip']
			&& policy['src_port'] == data['src_port']
			&& policy['dest_port'] == data['dest_port']
			&& policy['protocol'] == data['protocol']
			) {
			exists = true;
		}						
	});
	
	return exists;
}

/*************************************************************************************
 * 숫자 앞자리 0 채우는 함수
 **************************************************************************************/
function numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function validateIpAddress(ipAddress)
{   
	var ipArray = ipAddress.split("-");
	
	if(ipArray.length == 1) {
		return validateIp(ipArray[0]);
	} else if(ipArray.length == 2) {
		return validateIp(ipArray[0]) && validateIp(ipArray[1]);
	}
    
    return false;
}

function validateIp(ipAddress)
{   
	if(isAnyIpAddress(ipAddress) || validateIpv4(ipAddress) || validateIpv6(ipAddress)) {
		return true;
	}
	
    return false;
}

function validateIpv4(ipAddress)
{   
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress) || isEmpty(ipAddress))
    {
        return true;
    }
    return false;
}

function validateIpv6(ipAddress)
{   
    if (/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi.test(ipAddress) || isEmpty(ipAddress))
    {
        return true;
    }
    return false;
}

function isAnyIpAddress(ipAddress) {
    if (ipAddress.toUpperCase() === _ANY || ipAddress == '0' || ipAddress === '0.0.0.0' || ipAddress === '::') {
        return true;
    }
    return false;
}

function validatePort(port) {
    if (String(port).toUpperCase() === _ANY || (0 <= parseInt(port, 10) && parseInt(port, 10) <= 65535) || isEmpty(port)) {
        return true;
    }
    return false;
}

function isAnyPort(port) {
    if (String(port).toUpperCase() === _ANY || port == '0') {
        return true;
    }
    return false;
}

function validateID(id) {
	var idReg = /^[A-za-z]/g;
	
	if(isEmpty(id)) return false;
	
	return idReg.test(id);
}

function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
		return v.toString(16);
	});
}