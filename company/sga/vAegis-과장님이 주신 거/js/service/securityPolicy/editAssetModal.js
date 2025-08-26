function lf_historyPolicy(policyType, policyData) {	
	//UI Reset
	$("#policy_hist #title").html("");
	$("#policy_hist #equipname").html("");
	$("#policy_hist #registertime").html("");
	$("#policy_hist #osver").html("");
	$("#policy_hist #userid").html("");
	$("#policy_hist #createtime").html("");
	$("#policy_hist #description").val("");
	$("#policy_hist #rev_history").html("");
	$("#policy_hist #rev_list").html("");
	
	$("#policy_hist #policyType").val(policyType).prop("selected", true);
	$("#policy_hist #policyType").niceSelect("update");
	$("#policy_hist #policyData").val(JSON.stringify(policyData));
	
	switch (policyType) {
	case _POLICY_IPS:
		$("#policy_hist #title").html("정책 이력 (침입방지시스템)");
		break;
	case _POLICY_MAL:
		$("#policy_hist #title").html("정책 이력 (멀웨어)");
		break;
	case _POLICY_FW:
		$("#policy_hist #title").html("정책 이력 (방화벽)");
		break;
	case _POLICY_FILE:
		$("#policy_hist #title").html("정책 이력 (파일무결성)");
		break;
	case _POLICY_APPCTL:
		$("#policy_hist #title").html("정책 이력 (실행 파일 통제)");
		break;
	case _POLICY_PAMACL:
		$("#policy_hist #title").html("정책 이력 (서비스 제어)");
		break;
	}
	
	$("#policy_hist #equipname").html("<span>" + policyData.equipname + "(<span>" + policyData.group_name + "</span>)</span> / <span>" + policyData.masterip + "</span>");
	$("#policy_hist #registertime").html(policyData.registertime);
	$("#policy_hist #osver").html(policyData.osver);
	
	lf_policyRevisionHistory(policyType, policyData);
	lf_policyRuleList(policyType, policyData);
}

function lf_policyRevisionHistory(policyType, policyData) {
	var body = {
		"equip_id" : policyData.hardwareid,
		"policyType" : policyType
	};
	cf_requestServer(_TR_POLICY_REVISION_HISTORY, body, lf_serviceCall800035CallBack, false);

	var body = {
		"policyType" : policyType,
		"policy" : 0
	};
	cf_requestServer(_TR_POLICY_RULE_LIST, body, lf_serviceCall800033CallBackForAssetRevList, false);
}

function lf_policyRuleList(policyType, policyData) {
	var rev = null;
	
	switch (policyType) {
	case _POLICY_IPS:
		rev = (policyData.default_ips == 0 && policyData.mark_ips == 0) ? "-" : policyData.mark_ips;
		policyData.mark_ips == 0 ? $("#policy_hist #nol").addClass("none") : $("#policy_hist #nol").removeClass("none");
		policyData.default_ips === policyData.mark_ips ? $("#policy_hist #ind").addClass("none") : $("#policy_hist #ind").removeClass("none");
		break;
	case _POLICY_MAL:
		rev = (policyData.default_mw == 0 && policyData.mark_mw == 0) ? "-" : policyData.mark_mw;
		policyData.mark_mw == 0 ? $("#policy_hist #nol").addClass("none") : $("#policy_hist #nol").removeClass("none");
		policyData.default_mw === policyData.mark_mw ? $("#policy_hist #ind").addClass("none") : $("#policy_hist #ind").removeClass("none");
		break;
	case _POLICY_FW:
		rev = (policyData.default_fw == 0 && policyData.mark_fw == 0) ? "-" : policyData.mark_fw;
		$("#policy_hist #nol").hide();
		policyData.mark_fw == 0 ? $("#policy_hist #ind").addClass("none") : $("#policy_hist #ind").removeClass("none");
		break;
	case _POLICY_FILE:
		rev = (policyData.default_file == 0 && policyData.mark_file == 0) ? "-" : policyData.mark_file;
		$("#policy_hist #nol").hide();
		policyData.mark_file == 0 ? $("#policy_hist #ind").addClass("none") : $("#policy_hist #ind").removeClass("none");
		break;
	case _POLICY_APPCTL:
		rev = (policyData.default_appctl == 0 && policyData.mark_appctl == 0) ? "-" : policyData.mark_appctl;
		$("#policy_hist #nol").hide();
		policyData.mark_appctl == 0 ? $("#policy_hist #ind").addClass("none") : $("#policy_hist #ind").removeClass("none");
		break;
	case _POLICY_PAMACL:
		rev = (policyData.default_pamacl == 0 && policyData.mark_pamacl == 0) ? "-" : policyData.mark_pamacl;
		$("#policy_hist #nol").hide();
		policyData.mark_pamacl == 0 ? $("#policy_hist #ind").addClass("none") : $("#policy_hist #ind").removeClass("none");
		break;
	}
	$("#policy_hist #rev").html("rev " + rev);
	
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
		lf_serviceCall800033CallBackForAsset(data);
		return;
	}
	var body = {
		"policyType" : policyType,
		"rev" : parseInt(rev, 10),
		"policy" : 1
	};
	setTimeout(function() {
		cf_requestServer(_TR_POLICY_RULE_LIST, body, lf_serviceCall800033CallBackForAsset, false)
	}, 500);
}

function lf_serviceCall800035CallBack(data) {
	var dataList = data.body.dataList;
	
	var html = "";
	$.each(dataList, function(index, item) {
		var caption;
		if('mark' == item.action && 'INSERT' == item.operation) caption = "관리 정책 업데이트";
		else if('mark' == item.action && 'DELETE' == item.operation) caption = "관리 정책 삭제";
		else if('status' == item.action && 'INSERT' == item.operation) caption = "자산 정책 업데이트";
		else if('status' == item.action && 'DELETE' == item.operation) caption = "자산 정책 삭제";
		else caption = item.operation + "(" + item.action + ")"; 
		
		html += "<li>";
		html += "	<dl>";
		html += "		<dt>";
		html += "			<em>rev " + item.rev + "</em>";
		html += "		</dt>";
		html += "		<dt>";
		html += "			<span>(<em>" + caption + "</em>)</span>";
		html += "		</dt>";
		html += "		<dd>";
		html += "			<span>" + item.createtime + "</span>";
		html += "		</dd>";
		html += "	</dl>";
		html += "</li>";
	});
	$("#policy_hist #rev_history").html(html);
}

function lf_serviceCall800033CallBackForAssetRevList(data) {
	var defaultPolicy = data.body.defaultPolicy;
	var dataList = data.body.dataList;
	
	var html = "";
	if(!$.isEmptyObject(defaultPolicy)) {
		html += "<li>";
		html += "	<a href=\"javascript:lf_policyRuleListSub('" + defaultPolicy.policytype + "', '" + defaultPolicy.rev + "', true);\">";
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
		html += "	<a href=\"javascript:lf_policyRuleListSub('" + item.policytype + "', '" + item.rev + "', false);\">";
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
	$("#policy_hist #rev_list").html(html);
}

function lf_policyRuleListSub(policyType, rev, defaultPolicy) {
	$("#policy_hist .rev_list_btn").removeClass("on");
	$("#policy_hist #rev_list").removeClass("on");
	
	if(isEmptyRev(rev)) {
		alert('설정된 정책이 존재하지 않습니다.');
		return false;
	}
	
	$("#policy_hist #rev").html("rev " + rev);
	defaultPolicy ? $("#policy_hist #nol").removeClass("none") : $("#policy_hist #nol").addClass("none");
	defaultPolicy ? $("#policy_hist #ind").addClass("none") : $("#policy_hist #ind").removeClass("none");
	
	var body = {
		"policyType" : policyType,
		"rev" : parseInt(rev, 10),
		"policy" : 1
	};
	
	$("#policy_hist #policy_textarea textarea").html("로딩 중..");
	
	setTimeout(function() {
		cf_requestServer(_TR_POLICY_RULE_LIST, body, lf_serviceCall800033CallBackForAsset, false)
	}, 500);
}

function lf_serviceCall800033CallBackForAsset(data) {
	var rev = $("#policy_hist #rev").text().replace(/[^0-9]/g,'');
	
	var policy = new Object();
	var defaultPolicy = data.body.defaultPolicy;
	var dataList = data.body.dataList;
	
	if(!$.isEmptyObject(defaultPolicy)) policy = defaultPolicy;

	if(dataList.length > 0) {
		$.each(dataList, function(index, item) {
			if(item.rev == rev) policy = item;
		});
	}
	$("#policy_hist #userid").html(policy.userid);
	$("#policy_hist #createtime").html(policy.createtime);
	$("#policy_hist #description").val(policy.description);
	$("#policy_hist .securitypolicy_btn select[name='mode']").val(policy.mode).prop("selected", true);
	$("#policy_hist .securitypolicy_btn select").niceSelect("update");
	$('#policy_hist #policy_option').html("");
	
	var policyType = policy.policytype;
	var modalRightId = '';
	switch (policyType) {
	case _POLICY_IPS:
		lf_loadIpsAssetPolicy(policy);
		modalRightId = _MODAL_ASSET_RIGHT_IPS_ID;
		break;
	case _POLICY_MAL:
		lf_loadMalwareAssetPolicy(policy);
		modalRightId = _MODAL_ASSET_RIGHT_MALWARE_ID;
		break;
	case _POLICY_FW:
		lf_loadFirewallAssetPolicy(policy);
		modalRightId = _MODAL_ASSET_RIGHT_FW_ID;
		break;
	case _POLICY_FILE:
	case _POLICY_APPCTL:
		lf_loadFileAppctlAssetPolicy(policy);
		modalRightId = _MODAL_ASSET_RIGHT_FILE_ID;
		break;
	case _POLICY_PAMACL:
		lf_loadPamAclAssetPolicy(policy);
		modalRightId = _MODAL_ASSET_RIGHT_PAMACL_ID;
		break;
	}
}

function lf_loadIpsAssetPolicy(policy) {
	if(!policy || !policy.policystr) return;
	
	var html = "";
	html += "<textarea wrap=\"off\">";
	$.each(policy.policystr, function(index, item) {
		html += item.policy + "\n";
	});
	html += "</textarea>"
	$("#policy_hist #policy_textarea").html(html);
	$("#policy_hist #policy_table").html("");
	$('#policy_hist #policy_option').html("");
}

function lf_loadMalwareAssetPolicy(policy) {
	var option = policy.optionstr;
	//if(!option || option == null) return;

	var action = _SCANMODE['OFF'];
	var realtime = _MODE['ON'];
	var schedule = _MODE['OFF'];
	if(option) {
		action = option.action;
		realtime = option.realtime;
		schedule = option.schedule;
	}
	
	var optionStr = "";
	if(realtime == _MODE['ON']) optionStr = "실시간검사=ON";
	else optionStr = "실시간검사=OFF";
	
	if(schedule ==_MODE['OFF']) optionStr += ", 예약검사=OFF";
	else if(schedule == 24) optionStr += ", 예약검사=0시";
	else optionStr += (", 예약검사=" + (schedule < 10 ? "0" + schedule : schedule) + "시");
	
	if(action == _SCANMODE['OFF']) optionStr += ", 감염 파일 처리=경고";
	else if(action == _SCANMODE['MOVE']) optionStr += ", 감염 파일 처리=격리";
	else if(action == _SCANMODE['COPY']) optionStr += ", 감염 파일 처리=복사";
	else if(action == _SCANMODE['REMOVE']) optionStr += ", 감염 파일 처리=삭제";
	else optionStr += ", 감염 파일 처리=차단";
	
	var html = "";
	html += "<dl>";
	html += "	<dt>옵션</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "				<input type=\"text\" value=\"" + optionStr + "\" class=\"no_radius\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";	
	$('#policy_hist #policy_option').html(html);
	$('#policy_hist #policy_option input[type=radio]').attr('disabled', true);
	$('#policy_hist #policy_option select').attr('disabled', true).niceSelect('update');   
	
	if(action ==_SCANMODE['MOVE']) $('#malwareAction02').prop('checked', true);
	else if(action ==_SCANMODE['COPY']) $('#malwareAction03').prop('checked', true);
	else if(action ==_SCANMODE['REMOVE']) $('#malwareAction04').prop('checked', true);
	else if(action ==_SCANMODE['EXECACL']) $('#malwareAction05').prop('checked', true);
	else $('#malwareAction01').prop('checked', true);
	
	html = "";
	html += "<div class=\"tbl\">";
	html += "	<table class=\"\" style=\"width: 100%\">";
	html += "		<colgroup>";
	html += "			<col width=\"25%\">";
	html += "			<col width=\"auto\">";
	html += "		</colgroup>";
	html += "		<thead>";
	html += "			<tr>";
	html += "				<th>모드</th>";
	html += "				<th>파일</th>";
	html += "			</tr>";
	html += "		</thead>";
	html += "		<tbody>";
	$.each(policy.policystr, function(index, item) {
		var mode = '';
		if(item.mode == _MODE['ON']) mode = 'ON';
		else if(item.mode == _MODE['OFF']) mode = 'OFF';
		else mode = 'SKIP';

	    html += "			<tr>";
	    html += "				<td class=\"long_w\">" + mode + "</td>";
	    html += "				<td class=\"long_w tl\" title=\"" + item.filename + "\">" + item.filename + "</td>";
	    html += "			</tr>";
	});
	html += "		</tbody>";
	html += "	</table>";
	html += "</div>"
	$("#policy_hist #policy_table").html(html);
	$("#policy_hist #policy_textarea").html("");
}

function lf_loadFirewallAssetPolicy(policy) {
	if(!policy || !policy.policystr) return;

	var html = "";
	html = "";
	html += "<div class=\"tbl\">";
	html += "	<table class=\"\" style=\"width: 100%\">";
	html += "		<colgroup>";
	html += "			<col width=\"30%\">";
	html += "			<col width=\"30%\">";
	html += "			<col width=\"10%\">";
	html += "			<col width=\"10%\">";
	html += "			<col width=\"auto\">";
	html += "		</colgroup>";
	html += "		<thead>";
	html += "			<tr>";
	html += "				<th>출발지</th>";
	html += "				<th>도착지</th>";
	html += "				<th>프로토콜</th>";
	html += "				<th>액션</th>";
	html += "				<th>비고</th>";
	html += "			</tr>";
	html += "		</thead>";
	html += "		<tbody>";
	$.each(policy.policystr, function(index, item) {
	    html += "		<tr>";
	    html += "			<td class=\"long_w tl\" title=\"" + (isAnyIpAddress(item.src_ip) ? _ANY : item.src_ip) + ':' + (isAnyPort(item.src_port) ? _ANY : item.src_port) + "\">" + (isAnyIpAddress(item.src_ip) ? _ANY : item.src_ip) + ':' + (isAnyPort(item.src_port) ? _ANY : item.src_port) + "</td>";
	    html += "			<td class=\"long_w tl\" title=\"" + (isAnyIpAddress(item.dest_ip) ? _ANY : item.dest_ip) + ':' + (isAnyPort(item.dest_port) ?  _ANY : item.dest_port) + "\">" + (isAnyIpAddress(item.dest_ip) ? _ANY : item.dest_ip) + ':' + (isAnyPort(item.dest_port) ?  _ANY : item.dest_port) + "</td>";
	    html += "			<td class=\"long_w\">" + item.protocol.toUpperCase() + "</td>";
	    html += "			<td class=\"long_w\">" + item.action + "</td>";
	    html += "			<td class=\"long_w tl\" title=\"" + item.message + "\">" + item.message + "</td>";
	    html += "		</tr>";
	});
	html += "		</tbody>";
	html += "	</table>";
	html += "</div>"
	$("#policy_hist #policy_table").html(html);
	$("#policy_hist #policy_textarea").html("");
	$('#policy_hist #policy_option').html("");
}

function lf_loadFileAppctlAssetPolicy(policy) {
	if(!policy || !policy.policystr) return;
	
	var html = "";	
	if(_POLICY_APPCTL == policy.policyType) {
		var optionStr = "유형=블랙리스트";
		if(policy != null && policy.optionstr) {
			if(policy.optionstr.type == _WHITE_LIST) optionStr = "유형=화이트리스트";
		}
		html += "<dl>";
		html += "	<dt>옵션</dt>";
		html += "	<dd>";
		html += "		<div class=\"ipt_box\">";
		html += "				<input type=\"text\" value=\"" + optionStr + "\" class=\"no_radius\">";
		html += "		</div>";
		html += "	</dd>";
		html += "</dl>";
		
		$('#policy_hist #policy_option').html(html);
		$("#policy_hist #policy_option select").niceSelect();
	} else {
		$('#policy_hist #policy_option').html("");
	}
	
	
	html = "";
	html += "<div class=\"tbl\">";
	html += "	<table class=\"\" style=\"width: 100%\">";
	html += "		<colgroup>";
	html += "			<col width=\"25%\">";
	html += "			<col width=\"auto\">";
	html += "		</colgroup>";
	html += "		<thead>";
	html += "			<tr>";
	html += "				<th>모드</th>";
	html += "				<th>파일</th>";
	html += "			</tr>";
	html += "		</thead>";
	html += "		<tbody>";
	$.each(policy.policystr, function(index, item) {
	    html += "		<tr>";
	    html += "			<td class=\"long_w\">" + (item.mode == _MODE['ON'] ? 'ON' : 'OFF') + "</td>";
	    html += "			<td class=\"long_w tl\" title=\"" + item.filename + "\">" + item.filename + "</td>";
	    html += "		</tr>";
	});
	html += "		</tbody>";
	html += "	</table>";
	html += "</div>"
	$("#policy_hist #policy_table").html(html);
	$("#policy_hist #policy_textarea").html("");
}

function lf_loadPamAclAssetPolicy(policy) {
	if(!policy || !policy.policystr) return;
	
	var optionStr = "2차인증=비활성화";
	if(policy.optionstr) {
		if(policy.optionstr.twofactor == 1) optionStr = "2차인증=활성화";
	}
	
	var html = "";
	html += "<dl>";
	html += "	<dt>옵션</dt>";
	html += "	<dd>";
	html += "		<div class=\"ipt_box\">";
	html += "				<input type=\"text\" value=\"" + optionStr + "\" class=\"no_radius\">";
	html += "		</div>";
	html += "	</dd>";
	html += "</dl>";
	$('#policy_hist #policy_option').html(html);
	$("#policy_hist #policy_option select").niceSelect();
		
	html = "";
	html += "<div class=\"tbl\">";
	html += "	<table class=\"\" style=\"width: 100%\">";
	html += "		<colgroup>";
	html += "			<col width=\"25%\">";
	html += "			<col width=\"25%\">";
	html += "			<col width=\"20%\">";
	html += "			<col width=\"20%\">";
	html += "			<col width=\"auto\">";
	html += "		</colgroup>";
	html += "		<thead>";
	html += "			<tr>";
	html += "				<th>타입</th>";
	html += "				<th>접근허용</th>";
	html += "				<th>대상</th>";
	html += "				<th>서비스</th>";
	html += "				<th>IP</th>";
	html += "			</tr>";
	html += "		</thead>";
	html += "		<tbody>";
	$.each(policy.policystr, function(index, item) {
		var ipmask = item.ip;
		if (ipmask.toUpperCase() == "ANY") ipmask = "Any";
		else ipmask = ipmask + "/" + item.netmask;
		
		var target = item.target;
		if(target == _TARGET_DEFAULT) target = '기본'
		else if(target == _TARGET_USER) target = '사용자';
		else if(target == _TARGET_GROUP) target = '그룹';
		else target = item.target;

	    html += "		<tr>";
	    html += "			<td class=\"long_w\">" + target + "</td>";
	    html += "			<td class=\"long_w\">" + item.permission + "</td>";
	    html += "			<td class=\"long_w\">" + item.userid + "</td>";
	    html += "			<td class=\"long_w\">" + item.service + "</td>";
	    html += "			<td class=\"long_w tl\" title=\"" + ipmask + "\">" + ipmask + "</td>";
	    html += "		</tr>";
	});
	html += "		</tbody>";
	html += "	</table>";
	html += "</div>"
	
	$("#policy_hist #policy_table").html(html);
	$("#policy_hist #policy_textarea").html("");
}
