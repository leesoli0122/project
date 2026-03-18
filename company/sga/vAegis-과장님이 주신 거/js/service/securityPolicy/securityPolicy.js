const _SEP = ':::';
const GROUP_ID = {
	Aegis: 'G0000000000000',
	Hosts: 'G0000000000001',
	Registry: 'G0000000000002',
	Clusters: 'G0000000000003',
};

$(function () {
	$("#searchBtn").on("click", function() {
		var searchKeyword = $("#searchKeyword").val();
		$("#deviceList #device").each(function() {
			var html = $(this).find("h4").html();
			if(html.indexOf(searchKeyword) > -1) $(this).show();
			else $(this).hide();
		});
	});
});

$(document).ready(function() {
	lf_serviceCall800031();
});

function lf_serviceCall800031() {
    var body = {};
    cf_requestServer(_TR_POLICY_STAT,body,lf_serviceCall800031CallBack, false);
}

function lf_serviceCall800031CallBack(data){
	var rulesStatList = data.body.dataList;
	rulesStatList = rulesStatList.filter(obj => obj.group_id === GROUP_ID.Hosts);
	
	var agentOnline = 0;
	var agentOffline = 0;
	var ipsOnline = 0;
	var ipsOffline = 0;
	var firewallOnline = 0;
	var firewallOffline = 0;
	var malwareOnline = 0;
	var malwareOffline = 0;
	var fileintOnline = 0;
	var fileintOffline = 0;
	var appctlOnline = 0;
	var appctlOffline = 0;
	var pamaclOnline = 0;
	var pamaclOffline = 0;
	
	var html = "";
	$.each(rulesStatList, function(index, item) {
		agentOnline += item.agent_online;
		agentOffline += item.agent_offline;
		ipsOnline += item.ips_online;
		ipsOffline += item.ips_offline;
		firewallOnline += item.firewall_online;
		firewallOffline += item.firewall_offline;
		malwareOnline += item.malware_online;
		malwareOffline += item.malware_offline;
		fileintOnline += item.fileint_online;
		fileintOffline += item.fileint_offline;
		appctlOnline += item.appctl_online;
		appctlOffline += item.appctl_offline;
		pamaclOnline += item.pamacl_online;
		pamaclOffline += item.pamacl_offline;
		
		html += "<tr>";
		//html += "	<td class=\"none tl\">" + item.group_name + "</td>";
		html += "	<td class=\"none tl\" onclick=\"javascript:lf_serviceCall800032('" + item.group_id + "','','')\">" + item.group_name + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'agent', true);\">" + item.agent_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'agent', false);\">" + item.agent_offline + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'ips', true);\">" + item.ips_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'ips', false);\">" + item.ips_offline + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'firewall', true);\">" + item.firewall_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'firewall', false);\">" + item.firewall_offline + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'malware', true);\">" + item.malware_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'malware', false);\">" + item.malware_offline + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'fileint', true);\">" + item.fileint_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'fileint', false);\">" + item.fileint_offline + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'appctl', true);\">" + item.appctl_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'appctl', false);\">" + item.appctl_offline + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'pamacl', true);\">" + item.pamacl_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'pamacl', false);\">" + item.pamacl_offline + "</a></td>";
		html += "</tr>";
	});
	$("#groupStatTable").html(html);
	
	html = "";
	html += "<tr class=\"footer\">";
	html += "	<td class=\"\" onclick=\"javascript:lf_serviceCall800032('','','')\">전체</td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'agent', true);\">" + agentOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'agent', false);\">" + agentOffline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'ips', true);\">" + ipsOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'ips', false);\">" + ipsOffline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'firewall', true);\">" + firewallOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'firewall', false);\">" + firewallOffline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'malware', true);\">" + malwareOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'malware', false);\">" + malwareOffline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'fileint', true);\">" + fileintOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'fileint', false);\">" + fileintOffline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'appctl', true);\">" + appctlOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'appctl', false);\">" + appctlOffline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'pamacl', true);\">" + pamaclOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'pamacl', false);\">" + pamaclOffline + "</a></td>";
	html += "</tr>";
	$("#groupStatTable").append(html);
	
	$(".click > tbody > tr > td").on("click", function() {
		$(".click > tbody > tr > td").each(function() {
			$(this).removeClass("on");
		});
		$(this).addClass("on");
	});
	
    cf_requestServer(_TR_POLICY_REVISION_STAT, {}, lf_serviceCall800032CallBack, false);
}

function lf_serviceCall800032(groupId, policyType, online) {
    if(isEmpty(groupId)) groupId = "";
    
    var body = { 
    	'groupId': groupId 
    };
    if(policyType) {
    	body.policyType = policyType;
    	if(online) body.online = 1;
    	else body.online = 0;   	
    }
    
    cf_requestServer(_TR_POLICY_REVISION_STAT,body,lf_serviceCall800032CallBack, false);
}

function lf_serviceCall800032CallBack(data) {
	var policyRevStatList = data.body.dataList;
	policyRevStatList = policyRevStatList.filter(obj => obj.group_id === GROUP_ID.Hosts);
	$("#deviceCnt").html(policyRevStatList.length);
	
	var html = "";
	$.each(policyRevStatList, function(index, item) {		
		html +="<li id=\"device\">";
		html +="	<input type=\"hidden\" name=\"policyData\" value='" + JSON.stringify(item) + "'>";
		html +="	<div class=\"securitypolicy_cont_box\">";
		html +="		<div class=\"securitypolicy_cont_tit\">";
		html +="			<h4 title=\"\">" + item.equipname + "(" + item.masterip + ")</h4>";
		html +="			<div class=\"" + (item.status_agent == 1 ? "online" : "offline") + "\">" + (item.status_agent == 1 ? "정상" : "비정상") + "</div>";
		html +="		</div>";
		html +="		<div class=\"securitypolicy_cont_list\">";
		html +="			<ul>";
		html +="				<li>";
		html +="					<div>침입방지시스템</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"ips\">";
		html +="							<div class=\"revision\">" + ((item.default_ips == 0 && item.mark_ips == 0) ? "rev -" : "rev " + item.mark_ips) + "</div>";
		html +="							<div class=\"info nol " + (item.default_ips == 0 ? "none" : "") + "\" title=\"기본정책\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_ips == 0 || item.mark_ips == item.default_ips)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_ips ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.default_ips != item.mark_ips) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"ips\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"ips\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"ips\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>방화벽</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"firewall\">";
		html +="							<div class=\"revision\">" + ((item.default_fw == 0 && item.mark_fw == 0) ? "rev -" : "rev " + item.mark_fw) + "</div>";
		html +="							<div class=\"info nol " + (item.default_fw == 0 ? "none" : "") + "\" title=\"방화벽은 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_fw == 0 || item.mark_fw == item.default_fw)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_fw ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_fw != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"firewall\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"firewall\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"firewall\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>멀웨어</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"malware\">";
		html +="							<div class=\"revision\">" + ((item.default_mw == 0 && item.mark_mw == 0) ? "rev -" : "rev " + item.mark_mw) + "</div>";
		html +="							<div class=\"info nol " + (item.default_mw == 0 ? "none" : "") + "\" title=\"기본정책\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_mw == 0 || item.mark_mw == item.default_mw)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_mw ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.default_mw != item.mark_mw) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"malware\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"malware\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"malware\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>파일무결성</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"fileint\">";
		html +="							<div class=\"revision\">" + ((item.default_file == 0 && item.mark_file == 0) ? "rev -" : "rev " + item.mark_file) + "</div>";
		html +="							<div class=\"info nol " + (item.default_file == 0 ? "none" : "") + "\" title=\"파일무결성은 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_file == 0 || item.mark_file == item.default_file)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_file ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_file != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"fileint\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"fileint\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"fileint\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>실행 파일 통제</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"appctl\">";
		html +="							<div class=\"revision\">" + ((item.default_appctl == 0 && item.mark_appctl == 0) ? "rev -" : "rev " + item.mark_appctl) + "</div>";
		html +="							<div class=\"info nol " + (item.default_appctl == 0 ? "none" : "") + "\" title=\"실행 파일 통제는 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_appctl == 0 || item.mark_appctl == item.default_appctl)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_appctl ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_appctl != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"appctl\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"appctl\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"appctl\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>서비스 제어</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"pamacl\">";
		html +="							<div class=\"revision\">" + ((item.default_pamacl == 0 && item.mark_pamacl == 0) ? "rev -" : "rev " + item.mark_pamacl) + "</div>";
		html +="							<div class=\"info nol " + (item.default_pamacl == 0 ? "none" : "") + "\" title=\"서비스제어는 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_pamacl == 0 || item.mark_pamacl == item.default_pamacl)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_pamacl ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_pamacl != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"pamacl\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"pamacl\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"pamacl\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="			</ul>";
		html +="		</div>";
		html +="	</div>";
		html +="</li>";
	});
	$("#deviceList").html(html);
    lf_setModal(); // loadModal.js
}

function isEmpty(data) {
    return (typeof data === 'undefined' || data === null || data === '');
}