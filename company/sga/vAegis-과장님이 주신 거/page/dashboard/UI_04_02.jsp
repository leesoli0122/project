<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html lang="ko">
<head>
<title>컨테이너 이벤트 정책관리 - cAegis</title>
<meta charset="UTF-8" http-equiv="Content-Type" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="format-detection" content="telephone=no" />

<!-- TODO: search engine info -->
<meta name="robots" content="Aegis" />
<meta name="keywords" content="Aegis" />
<meta name="title" content="Aegis" />
<meta name="description" content="Aegis" />

<!-- TODO: social url link image -->
<meta property="og:url" content="" />
<meta property="og:title" content="Aegis" />
<meta property="og:type" content="website" />
<meta property="og:image" content="Aegis.png" />
<meta property="og:description" content="Aegis 홈페이지입니다." />

<!-- TODO: favicon -->
<link rel="icon" href="./assets/images/favicon.png" type="favicon.png" />

<style>
.hidden {
	display: none !important;
}
.container_security_row_selecter .list {
	max-height: 80px !important;
}
.search_result_strong {
	font-weight: bold;
	background-color: #367ae2;
}
</style>

<!-- TODO: import -->
<%@ include file="/page/layout/common_sample.jsp"%>
<script defer src="./js/service/securityPolicy/policyContainerSecurity.js?v=${version}"></script>
<script type="text/javascript">
	var policyTable;

	$(document).ready(function() {
		// DataTable init
		policyTable = $('#containerSecurityPolicy_table').DataTable({
			autoWidth : false,
			paging : false,
			pagingType : "full_numbers",
			ordering : false,
			columnDefs : [ {
				targets : [ 1, 2 ],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).attr('title', cellData.replace(/<[^>]+>/g, '')); // title 속성에 데이터 추가
					// 스타일 속성 설정
					$(td).css({
						'white-space' : 'nowrap',
						'overflow' : 'hidden',
						'text-overflow' : 'ellipsis'
					});
				},
			}, {
				targets : [ 8 ],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).css({
						'display' : 'block',
					});
				},
			}, {
				targets : [ 5 ],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).css({
						'line-height': '12px',
					});
				},
			} ],
			info : false,
			filter : true,
			lengthChange : false,
			dom : 'rt<"bottom"ip><"clear">',
			createdRow : function(row, data, dataIndex) {
				$(row).attr('id', 'rowPolicyTr_' + data[9]); // 하위 tree를 출력 하기 위한 tr 추가
			}
		});
	})
</script>
</head>
<body>
	<h1>Aegis ADMIN</h1>
	<div class="skip_navigation">
		<ul>
			<li><a href="#Content" class="go_content">본문 바로가기</a></li>
			<li><a href="#Gnb">메뉴 바로가기</a></li>
		</ul>
	</div>

	<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="policyContainerSecurity" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="policyContainerSecurity" />
	</jsp:include>

	<input type="hidden" id="checkedAgentList" name="checkedAgentList" />
	<input type="hidden" id="editRuleIdx" name="editRuleIdx" />
	<input type="hidden" id="checkDef" name="0" />

	<section class="securitypolicy_page mscrollbar">
		<div class="sub">
			<div class="securitypolicy_box">
				<div class="securitypolicy_title cluster_policy_title">
					<div class="securitypolicy_title_left">
						<h3>컨테이너 이벤트</h3>
						<dl class="fl">
							<dt>총개수</dt>
							<dd id="policyCnt"></dd>
						</dl>
					</div>
					<div class="securitypolicy_title_middle cluster_policy_title_middle">
						<div class="fl">
							<div class="event_sel container_security_cluster_selecter">
								<div class="sel_box">
									<select id="selectClusterUuid" onchange="updateSelectCluster()" class="wide event cluster_selecteBox">
									<option value="53596b7c-dde6-4a04-ada6-ffa143a9728a">Cluster-61</option><option value="2f4b443e-d0c4-455f-9664-c6f6fbe5f5d1">Cluster-67</option><option value="73f67fc0-949a-4527-9a27-ccf35ad2c527">K8S v1.19.14_Cluster</option><option value="e957fea2-1f6a-4ae2-931f-8a5ee1228c4d">Openshift-240</option></select>
								</div>
							</div>
						</div>
						<div class="fl">
							<div class="ipt_box">
								<input class="" type="text" placeholder="Name, Description 검색 키워드를 입력하여 주십시오." id="searchKeyword" name="searchKeyword" />
							</div>
							<a id="searchBtn" href="#" class="btn serch">검색</a>
						</div>
					</div>
					<div class="securitypolicy_title_right cluster_policy_title_right">
						<div class="fl">
							<a id="policyUpdate" href="#" class="btn" rel="containerSecurity_policy_add" onclick="updatePolicyContainerSecurity()" name="containerSecurity">저장</a><!--//line def 클래스 제거-->
						</div>
					</div>
				</div>
				<div id="containerSecurityPolicyTree">
					<div class="tbl">
						<table id="containerSecurityPolicy_table" class="dataTable no-footer" role="grid">
							<colgroup>
								<col width="3%">
								<col width="25%">
								<col width="45%">
								<col width="10%">
								<col width="10%">
								<col width="7%">
								<col width="10%">
								<col width="10%">
							</colgroup>
							<thead>
								<tr role="row"><th class="sorting_disabled" rowspan="1" colspan="1"></th><th class="sorting_disabled" rowspan="1" colspan="1">Name</th><th class="sorting_disabled" rowspan="1" colspan="1">Description</th><th class="sorting_disabled" rowspan="1" colspan="1">Severity</th><th class="sorting_disabled" rowspan="1" colspan="1">Action</th><th class="sorting_disabled" rowspan="1" colspan="1">Enable</th><th class="sorting_disabled" rowspan="1" colspan="1">Updated User</th><th class="sorting_disabled" rowspan="1" colspan="1">Updated Date</th><th id="policyData" style="display: none;" class="sorting_disabled" rowspan="1" colspan="1">policy Data</th></tr>
							</thead>
							<tbody><tr id="rowPolicyTr_undefined" role="row" class="tr_open"><td><div class="view_hide_btn_icon view_hide_active" data-onoff="csc_k8s003_policy" onclick="onOffDisplay(this)"></div></td><td title="Misconfigured cluster information" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Misconfigured cluster information</span></td><td title="공격자는 클러스터의 잘못된 구성과 약점을 악용하여 클러스터 설정을 조작하기 위해 kubernetes의 메터데이터를 찾습니다.  오케스트레이터를 손상시키려는 시도일 수 있습니다.Kubernetes API 서버에 액세스하고 Secrets 개체에서 중요한 정보를 검색할 수 있습니다." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">공격자는 클러스터의 잘못된 구성과 약점을 악용하여 클러스터 설정을 조작하기 위해 kubernetes의 메터데이터를 찾습니다.  오케스트레이터를 손상시키려는 시도일 수 있습니다.Kubernetes API 서버에 액세스하고 Secrets 개체에서 중요한 정보를 검색할 수 있습니다.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s003', false)" id="containerSecuritySeverity_csc_k8s003" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s003', false)" id="containerSecurityAction_csc_k8s003" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s003', false)" id="containerSecurityPolicyEnabled_csc_k8s003" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s003" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s003&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s036&quot;,&quot;csr_k8s048&quot;,&quot;csr_k8s049&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s003" data-onoff="csc_k8s003_policy" class="container_security_rule_bundle" style="display: table-row;">	<td colspan="8"><div id="rowRule_csc_k8s003_csr_k8s036" class="container_security_row_rule"><div class="container_security_rule_name tr_open">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey view_hide_active" data-onoff="csc_k8s003_csr_k8s036_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">CVE-2022-3172</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s003', true)" id="containerSecurityRuleEnabled_csc_k8s003_csr_k8s036" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s003_csr_k8s036_rule" style=""><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">CronJob,DaemonSet,Deployment,Job,Pod,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">API Service 개체에 대한 읽기 및 쓰기 권한이 있는 공격자는 집계된 API 서버를 사용하여 클라이언트 트래픽을 사용자 지정 URL로 리디렉션할 수 있습니다. 
이로 인해 권한 상승 또는 민감한 정보 유출이 발생할 수 있습니다.

영향 받는  kube-apiserver 버전
v1.25.0, v1.24.0~v1.24.4,  v1.23.0~v1.23.10, v1.22.0~v1.22.13, ≤ V1.21</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes 커뮤니티는 2022.05 취약성 CVE-2022-3172를 발견했습니다. 공격자는 집계된 API 서버를 사용하여 클라이언트 트래픽을 사용자 지정 URL로 리디렉션할 수 있습니다. 이로 인해 권한 상승 또는 민감한 정보 유출이 발생할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="신뢰할 수 있는 사용자만 API 서비스 개체에 대한 읽기 및 쓰기 권한을 가지고 있는지 확인하십시오.
이렇게 하면 신뢰할 수 없는 사용자가 API 서비스 개체를 사용하여 집계된 API 서버를 Deployment하고 제어할 수 없습니다.

Kubernetes 버전을 다음 버전(또는 더 높은 패치) 중 하나로 업그레이드하십시오. , , ,v1.25.1v1.24.5v1.23.11, v1.22.14" class="container_security_rule_catagory_detail"><span class="search_able_value">신뢰할 수 있는 사용자만 API 서비스 개체에 대한 읽기 및 쓰기 권한을 가지고 있는지 확인하십시오.
이렇게 하면 신뢰할 수 없는 사용자가 API 서비스 개체를 사용하여 집계된 API 서버를 Deployment하고 제어할 수 없습니다.

Kubernetes 버전을 다음 버전(또는 더 높은 패치) 중 하나로 업그레이드하십시오. , , ,v1.25.1v1.24.5v1.23.11, v1.22.14</span></div></div></div></div><div id="rowRule_csc_k8s003_csr_k8s048" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s003_csr_k8s048_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">Service Account 자동 마운트 비활성화</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s003', true)" id="containerSecurityRuleEnabled_csc_k8s003_csr_k8s048" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s003_csr_k8s048_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">CronJob,DaemonSet,Deployment,Job,Pod,ReplicaSet,ServiceAccount,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">자동 마운트가 비활성화되지 않은  Service Account를 확인합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">기본적으로 Service Account 액세스 Token은 클러스터에서 생성된 모든 Pod에 마운트되며 Pod의 컨테이너는 Service Account 자격 증명을 사용하여 Kubernetes API 서버에 요청을 보낼 수 있습니다. 
Pod에 대한 액세스 권한을 얻은 공격자는 서비스 /var/run/secrets/kubernetes.io/serviceaccount/token계정 권한에 따라 Service Account Token( 에 있음)에 액세스하고 클러스터에서 Job을 수행할 수 있습니다. 
Service Account Token에 대한 액세스 권한을 얻은 공격자는 클러스터 외부에서 Kubernetes API 서버를 인증 및 액세스하고 클러스터에 대한 액세스를 유지할 수도 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="automountServiceAccountToken: false를 지정하여 Service Account 수준 또는 개별 Pod 수준에서 Pod에 대한 Service Account Token의 자동 마운트를 비활성화합니다.  

apiVersion: v1
kind: ServiceAccount
metadata:
  name: BUILD-robot
automountServiceAccountToken: false # we look for this attribute" class="container_security_rule_catagory_detail"><span class="search_able_value">automountServiceAccountToken: false를 지정하여 Service Account 수준 또는 개별 Pod 수준에서 Pod에 대한 Service Account Token의 자동 마운트를 비활성화합니다.  

apiVersion: v1
kind: ServiceAccount
metadata:
  name: BUILD-robot
automountServiceAccountToken: false # we look for this attribute</span></div></div></div></div><div id="rowRule_csc_k8s003_csr_k8s049" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s003_csr_k8s049_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">3. <span class="search_able_value">Etcd is accessible using insecure connection (HTTP)</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s003', true)" id="containerSecurityRuleEnabled_csc_k8s003_csr_k8s049" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s003_csr_k8s049_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">etcd 서버(Kubernetes 데이터베이스) 포트는 일반 HTTP를 통해 액세스할 수 있으므로 암호화되지 않았으며 잠재적으로 안전하지 않습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">etcd에 대한 액세스는 클러스터의 루트 권한과 동일하므로 이상적으로는 API 서버만 액세스할 수 있어야 합니다. 데이터의 민감도를 고려하여 etcd 클러스터에 대한 액세스가 필요한 노드에만 권한을 부여하는 것이 좋습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="기본적으로 --etcd-certfile, --etcd-keyfile 설정되지 않습니다.
etcd 플래그 --key-file 및 --cert-file을 사용하여 설정이 HTTPS 포트에서만 etcd를 노출하는지 확인하십시오." class="container_security_rule_catagory_detail"><span class="search_able_value">기본적으로 --etcd-certfile, --etcd-keyfile 설정되지 않습니다.
etcd 플래그 --key-file 및 --cert-file을 사용하여 설정이 HTTPS 포트에서만 etcd를 노출하는지 확인하십시오.</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s004" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s004_policy" onclick="onOffDisplay(this)"></div></td><td title="Container Drift" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Container Drift</span></td><td title="컨테이너 드리프트(Container drift)는 컨테이너 이미지와 실제 컨테이너 상태가 일치하지 않는 상태를 의미합니다. 						
즉, 이미지로부터 컨테이너를 생성할 때 사용된 환경 설정과 패키지, 라이브러리 등이 시간이 지남에 따라 변화하면서 컨테이너 내부 상태와 일치하지 않게 됩니다.						
						
예를 들어, 개발자가 애플리케이션을 개발할 때, 로컬 머신에서 컨테이너 이미지를 빌드하고 실행합니다. 						
이때 사용되는 환경 설정, 라이브러리 버전 등은 개발자 로컬 머신에 따라 다를 수 있습니다. 						
따라서 이러한 이미지를 기반으로 한 프로덕션 환경에서는 이미지와 실제 상태 간의 차이가 발생할 수 있습니다. 						
이러한 차이는 예기치 않은 오류를 발생시키거나, 보안 문제를 유발할 수 있으며, 심각한 경우 서비스 다운 등의 문제로 이어질 수 있습니다. " style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">컨테이너 드리프트(Container drift)는 컨테이너 이미지와 실제 컨테이너 상태가 일치하지 않는 상태를 의미합니다. 						
즉, 이미지로부터 컨테이너를 생성할 때 사용된 환경 설정과 패키지, 라이브러리 등이 시간이 지남에 따라 변화하면서 컨테이너 내부 상태와 일치하지 않게 됩니다.						
						
예를 들어, 개발자가 애플리케이션을 개발할 때, 로컬 머신에서 컨테이너 이미지를 빌드하고 실행합니다. 						
이때 사용되는 환경 설정, 라이브러리 버전 등은 개발자 로컬 머신에 따라 다를 수 있습니다. 						
따라서 이러한 이미지를 기반으로 한 프로덕션 환경에서는 이미지와 실제 상태 간의 차이가 발생할 수 있습니다. 						
이러한 차이는 예기치 않은 오류를 발생시키거나, 보안 문제를 유발할 수 있으며, 심각한 경우 서비스 다운 등의 문제로 이어질 수 있습니다. </span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s004', false)" id="containerSecuritySeverity_csc_k8s004" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s004', false)" id="containerSecurityAction_csc_k8s004" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s004', false)" id="containerSecurityPolicyEnabled_csc_k8s004" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s004" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s004&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s050&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s004" data-onoff="csc_k8s004_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s004_csr_k8s050" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s004_csr_k8s050_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">Sidecar injection</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s004', true)" id="containerSecurityRuleEnabled_csc_k8s004_csr_k8s050" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s004_csr_k8s050_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">CronJob,DaemonSet,Deployment,Job,Pod</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes Pod는 공유 스토리지 및 네트워크 리소스가 있는 하나 이상의 컨테이너 그룹입니다. 
사이드카 컨테이너는 기본 컨테이너 옆에 있는 추가 컨테이너를 설명하는 데 사용되는 용어입니다. 예를 들어 서비스 메시 프록시는 애플리케이션 Pod에서 사이드카로 작동합니다.
공격자는 클러스터에서 분리된 자체 Pod를 실행하는 대신 사이드카 컨테이너를 클러스터의 합법적인 Pod에 주입하여 코드를 실행하고 활동을 숨길 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">공격자는 클러스터에서 분리된 자체 Pod를 실행하는 대신 사이드카 컨테이너를 클러스터의 합법적인 Pod에 주입하여 코드를 실행하고 활동을 숨길 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="불필요한 사용자 및 서비스 계정이 새 Pod 및 컨트롤러를 생성하지 못하도록 합니다." class="container_security_rule_catagory_detail"><span class="search_able_value">불필요한 사용자 및 서비스 계정이 새 Pod 및 컨트롤러를 생성하지 못하도록 합니다.</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s005" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s005_policy" onclick="onOffDisplay(this)"></div></td><td title="Exec Into Container" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Exec Into Container</span></td><td title="권한이 있는 공격자는 exec 명령(&quot;kubectl exec&quot;)을 사용하여 클러스터의 컨테이너에서 악성 명령을 실행할 수 있습니다. 이 방법에서 공격자는 OS 이미지(예: Ubuntu)와 같은 합법적인 이미지를 백도어 컨테이너로 사용하고 &quot;kubectl exec&quot;를 사용하여 원격으로 악성 코드를 실행할 수 있습니다." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">권한이 있는 공격자는 exec 명령("kubectl exec")을 사용하여 클러스터의 컨테이너에서 악성 명령을 실행할 수 있습니다. 이 방법에서 공격자는 OS 이미지(예: Ubuntu)와 같은 합법적인 이미지를 백도어 컨테이너로 사용하고 "kubectl exec"를 사용하여 원격으로 악성 코드를 실행할 수 있습니다.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s005', false)" id="containerSecuritySeverity_csc_k8s005" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s005', false)" id="containerSecurityAction_csc_k8s005" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s005', false)" id="containerSecurityPolicyEnabled_csc_k8s005" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s005" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s005&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s030&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s005" data-onoff="csc_k8s005_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s005_csr_k8s030" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s005_csr_k8s030_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">Exec into container</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s005', true)" id="containerSecurityRuleEnabled_csc_k8s005_csr_k8s030" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s005_csr_k8s030_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD, RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">RoleBinding,ClusterRoleBinding,Role,ClusterRole</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes에서 Pods/exec 하위 리소스에 대한 생성 권한을 부여하면 잠재적으로 권한 에스컬레이션이 허용될 수 있습니다. 이는 이러한 하위 리소스를 통해 사용자가 클러스터의 Kubernetes  Pod에 액세스하고 제어할 수 있기 때문입니다.
사용자에게 Pods/exec 하위 리소스에 대한 생성 권한이 있는 경우 클러스터의 모든 Pod에서 명령을 실행할 수 있습니다. 이를 통해 Pod에서 실행 중인 컨테이너에 대한 액세스 권한을 얻을 수 있으므로 민감한 정보에 대한 액세스 권한을 부여하거나 승인되지 않은 Job을 수행할 수 있습니다.
예) 공격자는 OS 이미지(예: Ubuntu)와 같은 합법적인 이미지를 백도어 컨테이너로 사용하고 "kubectl exec"를 사용하여 원격으로 악성 코드를 실행할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">권한이 있는 공격자는 exec 명령("kubectl exec")을 사용하여 클러스터의 컨테이너에서 악성 명령을 실행할 수 있습니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="프로덕션 환경에서 kubectl exec 명령을 금지하는 것이 좋습니다. 
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: Pod-exec
rules:
- apiGroups: [" *"]="" resources:="" ["pods="" exec"]="" #="" we="" look="" for="" this="" resource="" or="" *="" verbs:="" ["create"]="" verb="" "="" class="container_security_rule_catagory_detail"><span class="search_able_value">프로덕션 환경에서 kubectl exec 명령을 금지하는 것이 좋습니다. 
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: Pod-exec
rules:
- apiGroups: ["*"]
  resources: ["Pods/exec"] # we look for this resource or *
  verbs: ["create"]    # we look for this verb or *     </span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s006" role="row" class=""><td></td><td title="Container Breakout " style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Container Breakout </span></td><td title="컨테이너 브레이크아웃은 하나의 컨테이너에서 다른 컨테이너나 호스트 시스템으로의 무단 액세스 또는 제어를 의미합니다. 
즉, 컨테이너 내부에서 실행되는 프로세스가 컨테이너 외부에서 실행되는 프로세스와 통신하거나 시스템 자원에 액세스할 수 있는 경우를 말합니다. 
이는 일반적으로 보안상의 위협으로 간주되며, 악의적인 사용자가 시스템을 공격하거나 중요한 데이터를 빼낼 수 있는 가능성이 있습니다. 
컨테이너 브레이크아웃을 방지하기 위해서는 적절한 보안 조치가 필요하며, 이를 위해 컨테이너 내부에서 실행되는 프로세스의 격리와 제한된 권한 부여 등이 사용됩니다.  " style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">컨테이너 브레이크아웃은 하나의 컨테이너에서 다른 컨테이너나 호스트 시스템으로의 무단 액세스 또는 제어를 의미합니다. 
즉, 컨테이너 내부에서 실행되는 프로세스가 컨테이너 외부에서 실행되는 프로세스와 통신하거나 시스템 자원에 액세스할 수 있는 경우를 말합니다. 
이는 일반적으로 보안상의 위협으로 간주되며, 악의적인 사용자가 시스템을 공격하거나 중요한 데이터를 빼낼 수 있는 가능성이 있습니다. 
컨테이너 브레이크아웃을 방지하기 위해서는 적절한 보안 조치가 필요하며, 이를 위해 컨테이너 내부에서 실행되는 프로세스의 격리와 제한된 권한 부여 등이 사용됩니다.  </span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s006', false)" id="containerSecuritySeverity_csc_k8s006" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s006', false)" id="containerSecurityAction_csc_k8s006" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s006', false)" id="containerSecurityPolicyEnabled_csc_k8s006" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s006" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s006&quot;,&quot;policyRuleIds&quot;:[],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowPolicyTr_csc_k8s007" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s007_policy" onclick="onOffDisplay(this)"></div></td><td title="Container escape to  host" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Container escape to  host</span></td><td title="호스트로의 컨테이너 탈출(Container escape to host)은, 컨테이너 내부에서 악성 코드나 공격자가 실행되어 호스트 시스템으로의 침투를 의도하는 공격 기술입니다. 
이 공격 기술은 컨테이너 내부에서 실행되는 프로세스들이 호스트 시스템의 리소스를 직접 접근할 수 있게 되면서 가능해집니다." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">호스트로의 컨테이너 탈출(Container escape to host)은, 컨테이너 내부에서 악성 코드나 공격자가 실행되어 호스트 시스템으로의 침투를 의도하는 공격 기술입니다. 
이 공격 기술은 컨테이너 내부에서 실행되는 프로세스들이 호스트 시스템의 리소스를 직접 접근할 수 있게 되면서 가능해집니다.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s007', false)" id="containerSecuritySeverity_csc_k8s007" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s007', false)" id="containerSecurityAction_csc_k8s007" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s007', false)" id="containerSecurityPolicyEnabled_csc_k8s007" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s007" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s007&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s019&quot;,&quot;csr_k8s021&quot;,&quot;csr_k8s038&quot;,&quot;csr_k8s035&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s007" data-onoff="csc_k8s007_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s007_csr_k8s019" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s007_csr_k8s019_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">Docker 소켓이 파드 내부에 마운트 됨</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s007', true)" id="containerSecurityRuleEnabled_csc_k8s007_csr_k8s019" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s007_csr_k8s019_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,DaemonSet,StatefulSet,ReplicaSet,ReplicationController,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Docker는 네트워크로 연결되지 않은 UNIX 소켓을 통해 실행됩니다. 데몬 모드에서는 해당 CA에서 서명한 인증서로 인증된 클라이언트의 연결만 허용합니다. 이 소켓은 올바른 권한이 없으면 다른 컨테이너에 의해 마운트될 수 있습니다. 마운트되면 소켓을 사용하여 모든 컨테이너를 회전하거나 새 이미지를 생성하거나 기존 컨테이너를 종료할 수 있습니다.

컨테이너에서 실행 중인 도커 소켓 데몬을 보호하려면 적절한 SELinux/AppArmor 프로파일을 설정하여 이 소켓을 탑재하는 컨테이너를 제한하십시오.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Docker 소켓(Unix 소켓)을 탑재하고 Docker 런타임을 사용할 수 있는 경우 컨테이너가 Docker 내부에 액세스하고 중요한 정보 검색, Docker 명령 실행 할 수 있습니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="volumes:hostPath (선택 사항) 호스트 노드의 파일 시스템에서 Pod로 파일 또는 디렉터리를 마운트합니다. 경로가 /var/lib/docker로 설정된 경우 컨테이너는 Docker 내부에 액세스할 수 있습니다.

apiVersion: v1
kind: Pod
metadata:
  name: <name>
spec:
    volumes:
        -name: <volume name>
        hostPath:
-           path: /var/run/docker.sock

apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: <name>
spec:
  schedule: <>
  jobTemplate:
    spec:
      template:
        spec:
          volumes:
            -name: <volume name>
              hostPath:
 -                      path: /var/run/docker.sock" class="container_security_rule_catagory_detail"><span class="search_able_value">volumes:hostPath (선택 사항) 호스트 노드의 파일 시스템에서 Pod로 파일 또는 디렉터리를 마운트합니다. 경로가 /var/lib/docker로 설정된 경우 컨테이너는 Docker 내부에 액세스할 수 있습니다.

apiVersion: v1
kind: Pod
metadata:
  name: &lt;name&gt;
spec:
    volumes:
        -name: &lt;volume name&gt;
        hostPath:
-           path: /var/run/docker.sock

apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: &lt;name&gt;
spec:
  schedule: &lt;&gt;
  jobTemplate:
    spec:
      template:
        spec:
          volumes:
            -name: &lt;volume name&gt;
              hostPath:
 -                      path: /var/run/docker.sock</span></div></div></div></div><div id="rowRule_csc_k8s007_csr_k8s021" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s007_csr_k8s021_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">Kubernetes Dashboard가 &ZeroWidthSpace;&ZeroWidthSpace;Deployment되지 않았는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s007', true)" id="containerSecurityRuleEnabled_csc_k8s007_csr_k8s021" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s007_csr_k8s021_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">ClusterRole,ClusterRoleBinding,CronJob,DaemonSet,Deployment,Job,Pod,ReplicaSet,Role,RoleBinding,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">2019년 중반 Tesla는 해킹을 당해 kube-dashboard가 인터넷에 노출되었습니다. 해커는 탐색하고, 자격 증명을 찾고, 비트코인 &ZeroWidthSpace;&ZeroWidthSpace;채굴 소프트웨어를 실행하는 Pod를 Deployment했습니다. 필요하지 않은 경우 kube-dashboard를 비활성화하여 개별 액세스 인터페이스를 관리할 필요가 없도록 하고 공격 벡터로 제한하는 것이 좋습니다.

</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes 대시보드는 Kubernetes 클러스터를 모니터링하고 관리하는 데 사용되는 웹 기반 UI입니다. 대시보드를 통해 사용자는 이 Service Account에 대한 바인딩 또는 클러스터 바인딩에 의해 결정되는 권한이 있는 Service Account(Kubernetes-dashboard)을 사용하여 클러스터에서 Job을 수행할 수 있습니다. 클러스터의 컨테이너에 대한 액세스 권한을 얻은 공격자는 대시보드 Pod에 대한 네트워크 액세스를 사용할 수 있습니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="누가 대시보드 Service Account과 연결되어 있거나 대시보드 역할/클러스터 역할에 바인딩되어 있는지 확인하십시오.

apiVersion: v1
kind: Pod
metadata:
  name: <name>
  labels:
-   app: kubernetes-dashboard
-   k8s-app: kubernetes-dashboard
spec:
  containers:
  - name: <container name>
-   image: kubernetes-dashboard
-   image: kubernetesui" class="container_security_rule_catagory_detail"><span class="search_able_value">누가 대시보드 Service Account과 연결되어 있거나 대시보드 역할/클러스터 역할에 바인딩되어 있는지 확인하십시오.

apiVersion: v1
kind: Pod
metadata:
  name: &lt;name&gt;
  labels:
-   app: kubernetes-dashboard
-   k8s-app: kubernetes-dashboard
spec:
  containers:
  - name: &lt;container name&gt;
-   image: kubernetes-dashboard
-   image: kubernetesui</span></div></div></div></div><div id="rowRule_csc_k8s007_csr_k8s038" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s007_csr_k8s038_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">3. <span class="search_able_value">CVE-2021-25741</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s007', true)" id="containerSecurityRuleEnabled_csc_k8s007_csr_k8s038" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s007_csr_k8s038_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Node</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">사용자는 subPath 또는 subPathExpr 볼륨 마운트가 있는 컨테이너를 생성하여 호스트 파일 시스템의 어디에서나 파일 및 디렉토리에 액세스할 수 있습니다. 
영향을 받는 Kubernetes 버전은 v1.22.0 - v1.22.1, v1.21.0 - v1.21.4, v1.20.0 - v1.20.10, 버전 v1.19.14 이하입니다. 
CVE에 대해 자세히 알아보려면 CVE 링크( https://nvd.nist.gov/vuln/detail/CVE-2021-25741 )를 참조하십시오.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">CVE-2021-25741은  임의 호스트 파일 시스템 액세스에 symlink를 사용합니다.
루트 사용자로 컨테이너를 시작할 수 있는 권한이 있는 공격자는 이 취약성을 악용하여 호스트 파일 시스템으로 탈출하고 호스트의 중요한 디렉터리에 대한 읽기 및 쓰기 권한을 얻을 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="kubelet을 업그레이드하지 않고 이 취약성을 완화하려면 kubelet 및 kube-apiserver에서 VolumeSubpath feature gate 를 사용하지 않도록 설정하거나 subPath 또는 subPathExpr feature를 사용하여 기존 Pod를 제거할 수 있습니다.

CVE-2021-25741은 다음 Kubernetes 버전(v1.22.2, v1.21.5, v1.20.11, v1.19.15) 에서 수정되었습니다.  " class="container_security_rule_catagory_detail"><span class="search_able_value">kubelet을 업그레이드하지 않고 이 취약성을 완화하려면 kubelet 및 kube-apiserver에서 VolumeSubpath feature gate 를 사용하지 않도록 설정하거나 subPath 또는 subPathExpr feature를 사용하여 기존 Pod를 제거할 수 있습니다.

CVE-2021-25741은 다음 Kubernetes 버전(v1.22.2, v1.21.5, v1.20.11, v1.19.15) 에서 수정되었습니다.  </span></div></div></div></div><div id="rowRule_csc_k8s007_csr_k8s035" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s007_csr_k8s035_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">4. <span class="search_able_value">CVE-2022-0492</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s007', true)" id="containerSecurityRuleEnabled_csc_k8s007_csr_k8s035" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s007_csr_k8s035_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">ConfigMap,Pod,Deployment,ReplicaSet,DaemonSet,StatefulSet,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Linux 커널 취약성 CVE-2022-0492로 인해 컨테이너 내부에서 실행되는 악성 코드가 컨테이너 격리를 벗어나 전체 노드에 대한 루트 권한을 얻을 수 있습니다. 이 취약점을 악용하려면 악성 코드가 컨테이너에서 루트로 실행되거나 CAP_DAC_OVERRIDE 기능이 있어야 합니다. 
 SELinux 또는 AppArmor가 Deployment되면 이 CVE를 악용할 수 없게 됩니다. 
또한 컨테이너 런타임이 cgroup 버전1 구현을 사용하는 경우 익스플로잇이 가능합니다(Kubernetes 수준에서 볼 수 없기 때문에 기본적으로 켜져 있다고 가정함).
 고정된 커널 버전 번호를 사용할 수 있게 되면 이 컨트롤을 수정하여 이를 확인하고 오 탐지를 방지합니다. 
시스템을 손상시키기 위해서는 취약한 커널이 있는 클러스터에 단일 노드만 있으면 충분합니다</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Linux 커널 취약점 CVE-2022-0492는 컨테이너가 높은 권한(Root 또는 CAP_DAC_OVERRIDE 기능)으로 실행 중이고 SELinux 또는 AppArmor가 활성화되어 있지 않은지 확인</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="AppArmor 또는 SELinux를 활성화합니다. 최소 권한 원칙을 따르고 루트 권한 또는 권한 에스컬레이션 옵션 및 CAP_DAC_OVERRIDE 기능을 제거합니다. (참고 csr_k8s021)

Pod가 unshare system call을 사용하지 못하도록 하려면 컨테이너 런타임의 기본 seccomp 프로파일을 사용하십시오. 

자세한 내용은 컨테이너 런타임 기본 seccomp 프로필을 사용하는 팟(Pod) 생성을 참조하십시오. (참고 csr_k8s040)" class="container_security_rule_catagory_detail"><span class="search_able_value">AppArmor 또는 SELinux를 활성화합니다. 최소 권한 원칙을 따르고 루트 권한 또는 권한 에스컬레이션 옵션 및 CAP_DAC_OVERRIDE 기능을 제거합니다. (참고 csr_k8s021)

Pod가 unshare system call을 사용하지 못하도록 하려면 컨테이너 런타임의 기본 seccomp 프로파일을 사용하십시오. 

자세한 내용은 컨테이너 런타임 기본 seccomp 프로필을 사용하는 팟(Pod) 생성을 참조하십시오. (참고 csr_k8s040)</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s008" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s008_policy" onclick="onOffDisplay(this)"></div></td><td title="Privileged Container" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Privileged Container</span></td><td title="권한이 있는 컨테이너는 호스트 시스템의 모든 기능을 포함하는 컨테이너로 일반 컨테이너의 모든 제한을 해제합니다. 실질적으로 이는 권한 있는 컨테이너가 호스트에서 직접 수행할 수 있는 거의 모든 Job을 수행할 수 있음을 의미합니다. 권한 있는 컨테이너에 대한 액세스 권한을 얻거나 새 권한 있는 컨테이너를 생성할 수 있는 권한(예: 손상된 Pod의 Service Account 사용)을 가진 공격자는 호스트의 리소스에 대한 액세스 권한을 얻을 수 있습니다." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">권한이 있는 컨테이너는 호스트 시스템의 모든 기능을 포함하는 컨테이너로 일반 컨테이너의 모든 제한을 해제합니다. 실질적으로 이는 권한 있는 컨테이너가 호스트에서 직접 수행할 수 있는 거의 모든 Job을 수행할 수 있음을 의미합니다. 권한 있는 컨테이너에 대한 액세스 권한을 얻거나 새 권한 있는 컨테이너를 생성할 수 있는 권한(예: 손상된 Pod의 Service Account 사용)을 가진 공격자는 호스트의 리소스에 대한 액세스 권한을 얻을 수 있습니다.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s008', false)" id="containerSecuritySeverity_csc_k8s008" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s008', false)" id="containerSecurityAction_csc_k8s008" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s008', false)" id="containerSecurityPolicyEnabled_csc_k8s008" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s008" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s001&quot;,&quot;csr_k8s002&quot;,&quot;csr_k8s003&quot;,&quot;csr_k8s004&quot;,&quot;csr_k8s005&quot;,&quot;csr_k8s011&quot;,&quot;csr_k8s012&quot;,&quot;csr_k8s013&quot;,&quot;csr_k8s014&quot;,&quot;csr_k8s015&quot;,&quot;csr_k8s016&quot;,&quot;csr_k8s017&quot;,&quot;csr_k8s018&quot;,&quot;csr_k8s022&quot;,&quot;csr_k8s023&quot;,&quot;csr_k8s032&quot;,&quot;csr_k8s040&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s008" data-onoff="csc_k8s008_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s008_csr_k8s001" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s001_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">호스트 프로세스 ID 네임스페이스를 공유하려는 컨테이너의 허용을 최소화함</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s001" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s001_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">프로세스 네임스페이스 공유가 활성화되면 컨테이너의 프로세스가 해당 팟(Pod)의 다른 모든 컨테이너에 표시됩니다. 이 기능을 사용하면 로거 사이드카 컨테이너 또는 문제 해결 컨테이너 이미지와 같은 디버깅 도구가 포함되지 않은 협력 컨테이너를 구성할 수 있습니다.

호스트 프로세스 ID 네임스페이스를 공유하면 컨테이너 이미지 간의 격리가 해제되고 Pod의 다른 컨테이너에서 프로세스를 볼 수 있습니다. 
여기에는 /proc 디렉토리 의 모든 정보가 포함되며 때로는 환경 변수로 전달되는 secrets 또는 키가 포함될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트의 PID 네임스페이스에서 실행 중인 컨테이너는 컨테이너 외부에서 실행 중인 프로세스를 검사할 수 있습니다. 컨테이너가 ptrace 기능에도 액세스할 수 있는 경우 이를 사용하여 컨테이너 외부에서 권한을 에스컬레이션할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="hostPID를 false로 설정하면 Pod는 호스트의 PID 네임스페이스를 사용할 수 없습니다.

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: <policy name>
spec:
+ hostPID: false" class="container_security_rule_catagory_detail"><span class="search_able_value">hostPID를 false로 설정하면 Pod는 호스트의 PID 네임스페이스를 사용할 수 없습니다.

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: &lt;policy name&gt;
spec:
+ hostPID: false</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s002" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s002_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">권한 있는 컨테이너를 허용하지 않음</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s002" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s002_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">PodSecurityPolicy,Pod</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">권한이 있는 컨테이너는 호스트 시스템의 모든 루트 기능이 있는 컨테이너로, 일반 컨테이너에서 액세스할 수 없는 리소스에 액세스할 수 있습니다.

권한 있는 플래그로 컨테이너를 실행하면 사용자가 호스트 리소스에 대한 중요한 액세스 권한을 가질 수 있습니다. 권한이 있는 컨테이너가 손상된 경우 반드시 원격 코드 실행이 수반되는 것은 아니지만 공격자가 CAP_SYS_ADMIN을 포함하여 사용 가능한 모든 기능을 사용하여 전체 호스트 루트를 실행할 수 있음을 의미합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">권한이 있는 컨테이너는 호스트 시스템의 모든 기능을 포함하는 컨테이너로 일반 컨테이너의 모든 제한을 해제합니다. 실질적으로 이는 권한 있는 컨테이너가 호스트에서 직접 수행할 수 있는 거의 모든 Job을 수행할 수 있음을 의미합니다. 권한 있는 컨테이너에 대한 액세스 권한을 얻거나 새 권한 있는 컨테이너를 생성할 수 있는 권한을 가진 공격자는 호스트의 리소스에 대한 액세스 권한을 얻을 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: <policy name>
spec:+ privileged: false

privileged 가 true인 경우 권한 있는 컨테이너의 프로세스는 기본적으로 호스트의 루트와 동일합니다. 기본값은 false입니다.

apiVersion: v1
kind: Pod
metadata:
  name: <Pod name>
spec:
  containers:
  - name: <container name>
    image: <image>
    securityContext:
-      privileged: true" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: &lt;policy name&gt;
spec:+ privileged: false

privileged 가 true인 경우 권한 있는 컨테이너의 프로세스는 기본적으로 호스트의 루트와 동일합니다. 기본값은 false입니다.

apiVersion: v1
kind: Pod
metadata:
  name: &lt;Pod name&gt;
spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    securityContext:
-      privileged: true</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s003" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s003_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">3. <span class="search_able_value">호스트 IPC 네임스페이스를 공유하려는 컨테이너를 허용하지 않음</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s003" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s003_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트 IPC 네임스페이스는 Pod의 컨테이너를 공유할 수 있는지 여부를 제어합니다. 
PodSecurityPolicy를 사용 하고 hostIPC가 False 로 설정 되도록 컨테이너가 격리된 상태로 유지되도록 클러스터 수준 제한을 관리할 수 있습니다 .

호스트 PID/IPC 네임스페이스, 네트워킹 및 포트의 공유를 방지하면 컨테이너와 기본 호스트 간에 적절한 격리가 보장됩니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트의 IPC 네임스페이스에서 실행되는 컨테이너는 IPC를 사용하여 컨테이너 외부의 프로세스와 상호 작용할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: <policy name>
spec:
+ hostIPC: false" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: &lt;policy name&gt;
spec:
+ hostIPC: false</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s004" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s004_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">4. <span class="search_able_value">호스트 네트워크 네임스페이스를 공유하려는 컨테이너를 허용하지 않음</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s004" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s004_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes 클러스터에서 모든 Pod는 고유한 IP 주소를 갖습니다. Pod는 포트 할당, 이름 지정, 서비스 검색, 로드 밸런싱, 애플리케이션 구성 및 마이그레이션의 관점에서 VM 또는 물리적 호스트처럼 취급될 수 있습니다.

호스트 네트워크 네임스페이스를 공유하면 컨테이너 이미지 간의 격리가 해제되고 Pod의 다른 컨테이너에서 호스트를 볼 수 있습니다. 경우에 따라 노드의 호스트 네트워크에 있는 Pod는 네트워크 주소 변환(NAT)을 사용하지 않고 모든 노드의 모든 Pod와 통신할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트의 네트워크 네임스페이스에서 실행 중인 컨테이너는 로컬 루프백 장치에 액세스할 수 있고 다른 Pod와의 네트워크 트래픽에 액세스할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="hostNetwork를 false로 설정하면 Pod가 호스트의 네트워크 네임스페이스를 사용할 수 없습니다.

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: <policy name>
spec:
+ hostNetwork: false" class="container_security_rule_catagory_detail"><span class="search_able_value">hostNetwork를 false로 설정하면 Pod가 호스트의 네트워크 네임스페이스를 사용할 수 없습니다.

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: &lt;policy name&gt;
spec:
+ hostNetwork: false</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s005" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s005_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">5. <span class="search_able_value">Root User로의 컨테이너의 실행을 허용 하지않음</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s005" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s005_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes에서 컨테이너의 사용자 ID 테이블은 호스트의 사용자 테이블에 매핑됩니다. 컨테이너 내에서 루트 사용자로 프로세스를 실행하면 호스트에서 루트로 실행됩니다.
많은 컨테이너 이미지는 루트 사용자를 사용하여 PID 1을 실행합니다.
PID 1이 손상되면 공격자는 컨테이너에서 루트 권한을 가지며 잘못된 구성을 악용할 수 있습니다</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너는 모든 Linux 사용자로 실행할 수 있습니다. Container Runtime 보안 기능의 제약을 받는 동안 루트 사용자로 실행되는 컨테이너는 여전히 컨테이너 탈주 가능성이 높아집니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="runAsUser:rule:MustRunAsNonRoot - 루트 권한으로 컨테이너를 실행할 수 없습니다.
runAsUser:rule:MustRunAs - 최소 범위가 1 이상으로 설정되면 컨테이너가 루트로 실행될 수 없습니다.

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: <policy name>
spec:
    runAsUser:
+   rule: 'MustRunAsNonRoot'
or
    rule: 'MustRunAs'
    ranges:
+   - min: <min user, 1 or higher>
      max: <max user>" class="container_security_rule_catagory_detail"><span class="search_able_value">runAsUser:rule:MustRunAsNonRoot - 루트 권한으로 컨테이너를 실행할 수 없습니다.
runAsUser:rule:MustRunAs - 최소 범위가 1 이상으로 설정되면 컨테이너가 루트로 실행될 수 없습니다.

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: &lt;policy name&gt;
spec:
    runAsUser:
+   rule: 'MustRunAsNonRoot'
or
    rule: 'MustRunAs'
    ranges:
+   - min: &lt;min user, 1 or higher&gt;
      max: &lt;max user&gt;</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s011" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s011_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">6. <span class="search_able_value">컨테이너가 호스트 프로세스 ID 네임스페이스를 공유하지 않는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s011" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s011_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,DaemonSet,StatefulSet,ReplicaSet,ReplicationController,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">네임스페이스는 실행 중인 프로세스를 격리하고 시스템 리소스에 대한 액세스를 제한하며, 실행 중인 프로세스는 제한 사항에 구애받지 않습니다.

컨테이너 내에서 권한을 에스컬레이션하는 공격자의 옵션을 제한하려면 호스트 프로세스 ID 네임스페이스를 공유하지 않도록 컨테이너를 구성하는 것이 좋습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너는 호스트 시스템에서 최대한 격리되어야 합니다. 
컨테이너가 호스트 프로세스 ID 네임스페이스를 공유는 컨테이너 간 영향을 허용할 수 있으며 호스트 자체를 잠재적으로 악의적이거나 파괴적인 Job에 노출시킬 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="hostPID가 true인 경우 Pod는 호스트의 PID 네임스페이스를 사용합니다. 기본값은 false입니다.
apiVersion: v1
kind: Pod
metadata:
  name: <name>
spec:
- hostPID: true" class="container_security_rule_catagory_detail"><span class="search_able_value">hostPID가 true인 경우 Pod는 호스트의 PID 네임스페이스를 사용합니다. 기본값은 false입니다.
apiVersion: v1
kind: Pod
metadata:
  name: &lt;name&gt;
spec:
- hostPID: true</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s012" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s012_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">7. <span class="search_able_value">컨테이너가 호스트 IPC 네임스페이스를 공유하지 않는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s012" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s012_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,DaemonSet,StatefulSet,ReplicaSet,ReplicationController,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트의 IPC 네임스페이스에서 실행되는 컨테이너는 IPC를 사용하여 컨테이너 외부의 프로세스와 상호 작용할 수 있습니다.

컨테이너가 호스트 IPC 네임스페이스를 공유하는 것을 허용하지 않는 허용 제어 정책이 정의되어 있어야 합니다.

hostIPC가 필요한 컨테이너를 실행해야 하는 경우 별도의 정책으로 정의해야 하며 제한된 Service Account 및 사용자에게만 해당 정책을 사용할 수 있는 권한이 부여되는지 신중하게 확인해야 합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트의 IPC 네임스페이스에서 실행되는 컨테이너는 IPC를 사용하여 컨테이너 외부의 프로세스와 상호 작용할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="hostIPC: true인 경우 Pod는 호스트의 IPC 네임스페이스를 사용합니다. 기본값은 false입니다.

apiVersion: v1
kind: Pod
metadata:
  name: <name>
spec:
- hostIPC: true" class="container_security_rule_catagory_detail"><span class="search_able_value">hostIPC: true인 경우 Pod는 호스트의 IPC 네임스페이스를 사용합니다. 기본값은 false입니다.

apiVersion: v1
kind: Pod
metadata:
  name: &lt;name&gt;
spec:
- hostIPC: true</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s013" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s013_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">8. <span class="search_able_value">컨테이너가 호스트 네트워크 네임스페이스를 공유하지 않는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s013" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s013_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,DaemonSet,StatefulSet,ReplicaSet,ReplicationController,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너에 대해 호스트 네트워크 모드를 사용하는 경우 해당 컨테이너의 네트워크 스택이 Docker 호스트에서 격리되지 않으므로 컨테이너는 호스트의 네트워킹 네임스페이스를 공유하고 자체 IP 주소 할당을 받지 않습니다.

컨테이너 내에서 권한을 에스컬레이션하는 공격자의 옵션을 제한하려면 호스트 네트워크 네임스페이스를 공유하지 않도록 컨테이너를 구성하는 것이 좋습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트의 네트워크 네임스페이스에서 실행 중인 컨테이너는 로컬 루프백 장치에 액세스할 수 있고 다른 Pod와의 네트워크 트래픽에 액세스할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="hostNetwork가 true인 경우 Pod는 호스트의 네트워크 네임스페이스를 사용합니다. 기본값은 false입니다.

apiVersion: v1
kind: Pod
metadata:
  name: <name>
spec:
- hostNetwork: true" class="container_security_rule_catagory_detail"><span class="search_able_value">hostNetwork가 true인 경우 Pod는 호스트의 네트워크 네임스페이스를 사용합니다. 기본값은 false입니다.

apiVersion: v1
kind: Pod
metadata:
  name: &lt;name&gt;
spec:
- hostNetwork: true</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s014" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s014_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">9. <span class="search_able_value">컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s014" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s014_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">AllowPrivilegeEscalation Pod 보안 정책은 사용자가 컨테이너의 보안 컨텍스트를 True 로 설정할 수 있는지 여부를 제어 합니다 .
이를 False 로 설정하면 컨테이너의 자식 프로세스가 부모보다 더 많은 권한을 얻을 수 없습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">allowPrivilegeEscalation 플래그가 true로 설정된 상태로 실행 중인 컨테이너에는 부모보다 더 많은 권한을 얻을 수 있는 프로세스가 있을 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="RunAsUser 명령이 기존 권한 세트를 우회할 수 없도록 AllowPrivilegeEscalation을 False 로 설정

apiVersion: v1
kind: Pod
metadata:
  name: <Pod name>
spec:
  containers:
  - name: <container name>
    image: <image>
    securityContext:
+      allowPrivilegeEscalation: false" class="container_security_rule_catagory_detail"><span class="search_able_value">RunAsUser 명령이 기존 권한 세트를 우회할 수 없도록 AllowPrivilegeEscalation을 False 로 설정

apiVersion: v1
kind: Pod
metadata:
  name: &lt;Pod name&gt;
spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    securityContext:
+      allowPrivilegeEscalation: false</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s015" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s015_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">10. <span class="search_able_value">루트 컨테이너 허용 최소화</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s015" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s015_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,DaemonSet,StatefulSet,ReplicaSet,ReplicationController,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너는 사용자 및 그룹에 부여된 권한을 통해 리소스에 대한 명시적 및 암시적 권한을 부여하는 기존 Unix 보안 모델에 의존합니다. 사용자 네임스페이스는 Kubernetes에서 활성화되지 않습니다. 컨테이너의 사용자 ID 테이블은 호스트의 사용자 테이블에 매핑되며 컨테이너 내에서 루트 사용자로 프로세스를 실행하면 호스트에서 루트로 실행됩니다. 가능하지만 컨테이너 내부에서 루트로 실행하는 것은 권장하지 않습니다.

루트로 실행되는 컨테이너에는 일반적으로 워크로드에 필요한 것보다 훨씬 더 많은 권한이 있습니다. 손상된 경우 공격자는 이러한 권한을 사용하여 네트워크에 대한 추가 공격을 수행할 수 있습니다. 여러 컨테이너 이미지는 루트 사용자를 사용하여 PID 1을 실행합니다. 공격자는 컨테이너에서 루트 권한을 가지며 잘못된 구성을 악용할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너는 모든 Linux 사용자로 실행할 수 있습니다. 컨테이너 런타임 보안 기능의 제약을 받는 동안 루트 사용자로 실행되는 컨테이너는 여전히 컨테이너 탈주 가능성이 높아집니다.
</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="runAsNonRoot가 true인 경우 루트 권한 없이 컨테이너를 실행해야 합니다. 기본값은 false입니다.
runAsUser 사용자 번호가 0이 아닌 경우 컨테이너가 루트가 아닌 해당 사용자 ID로 실행되어야 합니다.

apiVersion: v1
kind: Pod
metadata:
  name: <name>
spec:
    securityContext:
+   runAsNonRoot: true
+   runAsUser: <specific user>" class="container_security_rule_catagory_detail"><span class="search_able_value">runAsNonRoot가 true인 경우 루트 권한 없이 컨테이너를 실행해야 합니다. 기본값은 false입니다.
runAsUser 사용자 번호가 0이 아닌 경우 컨테이너가 루트가 아닌 해당 사용자 ID로 실행되어야 합니다.

apiVersion: v1
kind: Pod
metadata:
  name: &lt;name&gt;
spec:
    securityContext:
+   runAsNonRoot: true
+   runAsUser: &lt;specific user&gt;</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s016" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s016_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">11. <span class="search_able_value">안전하지 않은기능이 추가된 컨테이너가 허용되는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s016" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s016_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Linux 기능 기능을 사용하면 루트 사용자의 모든 권한을 부여하지 않고 프로세스에 특정 권한을 부여할 수 있습니다. 추가된 기능은 클러스터의 핵심 프로세스 및 네트워킹 설정을 변경하는 데 사용할 수 있는 추가 권한이 있는 Pod의 컨테이너에 권한을 부여합니다. 클러스터의 적절한 기능에 필요한 권한만 사용하는 것이 좋습니다.

컨테이너에 대한 Linux 기능을 추가하거나 제거하려면 컨테이너 매니페스트의 securityContext 섹션에 capability 필드를 포함할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너는 Container Runtime이 할당한 기본 기능 집합으로 실행됩니다. 이 집합 밖의 기능을 컨테이너에 추가하면 컨테이너 탈주 공격의 위험에 노출될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: <policy name>
spec:
- allowedCapabilities:" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: &lt;policy name&gt;
spec:
- allowedCapabilities:</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s017" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s017_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">12. <span class="search_able_value"> CAP_SYS_ADMIN은 루트 액세스와 동등한 권한이 높은 액세스 수준이며 일반적으로 사용을 피함</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s017" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s017_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">CAP_SYS_ADMIN Linux 기능이 사용되지 않는지 확인하십시오.

기능은 전체 루트 액세스 권한을 부여하지 않고 특정 명명된 루트 Job을 허용하며 세분화된 권한 모델로 간주됩니다.

필요한 기능만 다시 추가하여 Pod에서 모든 기능을 삭제하는 것이 좋습니다. CAP_SYS_ADMIN이 가장 많은 기능을 가지고 있습니다. CAP_SYS_ADMIN은 루트 액세스와 동등한 권한이 높은 액세스 수준이며 일반적으로 피해야 합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">CAP_SYS_ADMIN Linux 기능이 사용되지 않는지 확인하십시오.

Capabilities는 전체 루트 액세스 권한을 부여하지 않고 특정 명명된 루트 Job을 허용하며 세분화된 권한 모델로 간주됩니다.

필요한 기능만 추가하는 것이 좋습니다.
CAP_SYS_ADMIN이 가장 많은 기능을 가지고 있습니다. CAP_SYS_ADMIN은 루트 액세스와 동등한 권한이 높은 액세스 수준이며 일반적으로 피해야 합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: Pod
metadata:
  name: <Pod name>
spec:
  containers:
  - name: <container name>
    image: <image>
    securityContext:
        capabilities:
            add:
-               -SYS_ADMIN     # 없어야함" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: Pod
metadata:
  name: &lt;Pod name&gt;
spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    securityContext:
        capabilities:
            add:
-               -SYS_ADMIN     # 없어야함</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s018" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s018_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">13. <span class="search_able_value">hostPort를 지정하는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s018" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s018_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">hostPort 설정은 Kubernetes 컨테이너에 적용됩니다. 컨테이너 포트는 :에서 외부 네트워크에 노출됩니다. 여기서 hostIP는 컨테이너가 실행 중인 Kubernetes 노드의 IP 주소이고 hostPort는 사용자가 요청한 포트입니다.

꼭 필요한 경우가 아니면 Pod에 대한 hostPort를 지정하지 않는 것이 좋습니다. Pod를 hostPort에 바인딩하면 각 <hostip, hostport,="" protocol=""> 조합이 고유해야 하므로 Pod를 예약할 수 있는 위치 수가 제한됩니다.</hostip,></span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">호스트 포트는 컨테이너를 호스트 네트워크에 직접 연결합니다. 이는 네트워크 정책과 같은 제어를 우회할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: Pod
metadata:
  name: <Pod name>
spec:
  containers:
  - name: <container name>
    image: <image>
    ports:
-    hostPort: <port>" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: Pod
metadata:
  name: &lt;Pod name&gt;
spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    ports:
-    hostPort: &lt;port&gt;</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s022" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s022_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">14. <span class="search_able_value">호스트 충돌을 피하기 위해 컨테이너가 높은 UID로 실행되는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s022" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s022_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,DaemonSet,StatefulSet,ReplicaSet,ReplicationController,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">프로세스가 네임스페이스 외부에서 권한을 에스컬레이션하려고 시도하는 경우 프로세스는 실제 사용자에 매핑되지 않고 호스트에서 권한이 없는 높은 숫자의 UID로 실행됩니다. 이는 프로세스가 호스트 시스템에 대한 권한이 없으며 이 방법으로 공격할 수 없음을 의미합니다.

일반적인 Linux Deployment판은 UID 1000을 루트가 아닌 시스템 사용자가 아닌 첫 번째 사용자에게 할당하고 1000명의 사용자가 적절한 버퍼를 제공해야 하므로 이 검사는 UID 1,000 미만에서 트리거됩니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">높은 UID로 컨테이너가 실행되지 않음
</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="애플리케이션에 루트 권한이 필요하지 않은 경우 PodSecurityContext에서 runAsUser 또는 runAsGroup을 정의하고 사용자 ID 1000 이상을 사용해야 합니다. allowPrivlegeEscalation= false 인지 확인하십시오.

apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 1000   # we make sure this is greater than 999 and
    runAsGroup: 3000  # This value is greater than 999
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: busybox
    command: [ " sh",="" "-c",="" "sleep="" 1h"="" ]="" securitycontext:="" allowprivilegeescalation:="" false="" #lastly,="" we="" check="" this="" is="" set="" to="" false"="" class="container_security_rule_catagory_detail"><span class="search_able_value">애플리케이션에 루트 권한이 필요하지 않은 경우 PodSecurityContext에서 runAsUser 또는 runAsGroup을 정의하고 사용자 ID 1000 이상을 사용해야 합니다. allowPrivlegeEscalation= false 인지 확인하십시오.

apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 1000   # we make sure this is greater than 999 and
    runAsGroup: 3000  # This value is greater than 999
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: busybox
    command: [ "sh", "-c", "sleep 1h" ]
    securityContext:
      allowPrivilegeEscalation: false  #lastly, we check this is set to false</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s023" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s023_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">15. <span class="search_able_value">컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s023" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s023_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">allowPrivilegeEscalation Pod 보안 정책은 사용자가 컨테이너의 보안 컨텍스트를 True 로 설정할 수 있는지 여부를 제어 합니다 . 이를 False 로 설정하면 컨테이너의 자식 프로세스가 부모보다 더 많은 권한을 얻을 수 없습니다.

RunAsUser 명령이 기존 권한 세트를 우회할 수 없도록 AllowPrivilegeEscalation 을 False 로 설정하는 것이 좋습니다 .</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">allowPrivilegeEscalation 플래그가 true로 설정된 상태로 실행 중인 컨테이너에는 부모보다 더 많은 권한을 얻을 수 있는 프로세스가 있을 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: Pod
metadata:
  name: <Pod name>
spec:
  containers:
  - name: <container name>
    image: <image>
    securityContext:
+      allowPrivilegeEscalation: false" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: Pod
metadata:
  name: &lt;Pod name&gt;
spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    securityContext:
+      allowPrivilegeEscalation: false</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s032" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s032_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">16. <span class="search_able_value">쓰기 가능한 hostPath 마운트</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s032" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s032_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,ReplicaSet,DaemonSet,StatefulSet,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">hostPath 볼륨은 호스트에서 컨테이너로 디렉토리 또는 파일을 마운트합니다.  
클러스터에서 새 컨테이너를 생성할 수 있는 권한이 있는 공격자는 쓰기 가능한 hostPath 볼륨으로 컨테이너를 생성하고 기본 호스트에서 지속성을 얻을 수 있습니다. 
예를 들어 후자는 호스트에서 크론 Job을 생성하여 달성할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">hostPath 볼륨을 마운트하는 컨테이너는 기본 클러스터 노드의 파일 시스템에 액세스할 수 있습니다. hostPath 볼륨을 사용하면 컨테이너가 노드 파일 시스템의 권한 있는 영역에 액세스할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="hostPath 마운트를 사용하지 않거나 예외 메커니즘을 사용하여 불필요한 알림을 제거
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
      readOnly: false
  volumes:
  - name: test-volume
    hostPath: #we look for this attribute 
      path: /data
      type: Directory" class="container_security_rule_catagory_detail"><span class="search_able_value">hostPath 마운트를 사용하지 않거나 예외 메커니즘을 사용하여 불필요한 알림을 제거
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
      readOnly: false
  volumes:
  - name: test-volume
    hostPath: #we look for this attribute 
      path: /data
      type: Directory</span></div></div></div></div><div id="rowRule_csc_k8s008_csr_k8s040" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s008_csr_k8s040_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">17. <span class="search_able_value">컨테이너가 AppArmor 혹은 seccomp의 프로필 없이 실행'</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s008', true)" id="containerSecurityRuleEnabled_csc_k8s008_csr_k8s040" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s008_csr_k8s040_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">CronJob,DaemonSet,Deployment,Job,Pod,ReplicaSet,StatefulSet,PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">seccomp를 사용하여 컨테이너화된 애플리케이션이 기본 호스트 운영 체제의 커널에 대한 특정 시스템 호출을 수행하지 못하도록 방지하십시오
Seccomp(secure computing mode)는 애플리케이션이 수행할 수 있는 시스템 호출 집합을 제한하는 데 사용되므로 클러스터 관리자가 클러스터에서 실행 중인 워크로드의 보안을 더 잘 제어할 수 있습니다.
Kubernetes는 역사적 이유로 기본적으로 seccomp 프로필을 비활성화합니다. 워크로드가 컨테이너 내에서 사용할 수 있는 Job을 제한하도록 하려면 이를 활성화해야 합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value"> AppArmor, seccomp의 프로필 설정없이 컨테이너를 실행시킬경우 호스트 운영 체제의 커널에 대한 특정 시스템 호출을 수행할 수 있습니다</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="주석을 추가하여 기본 seccomp 프로필을 사용하도록 컨테이너 또는 Pod, PodSecurityPolicy 구성합니다
기본적으로 seccomp 프로필은 unconfined로 설정되며 이는 seccomp 프로필이 활성화되지 않음을 의미합니다.

apiVersion: v1
kind: Pod
metadata:
  name: default-Pod
spec:
  securityContext:
    seccompProfile:
      type: RuntimeDefault # unconfined X
  containers:
    ...
    securityContext:
      allowPrivilegeEscalation: false
---
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor
  annotations: container.apparmor.security.beta.kubernetes.io/hello: localhost/k8s-apparmor-example-deny-write
---
`apparmor.security.beta.kubernetes.io/defaultProfileName`  annotations을 `RUNTIME/default`로 설정
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
    name: restricted
    annotations:       seccomp.security.alpha.kubernetes.io/allowedProfileNames: 'docker/default,RUNTIME/default'        apparmor.security.beta.kubernetes.io/allowedProfileNames: 'RUNTIME/default'        seccomp.security.alpha.kubernetes.io/defaultProfileName:  'RUNTIME/default'        apparmor.security.beta.kubernetes.io/defaultProfileName:  'RUNTIME/default'" class="container_security_rule_catagory_detail"><span class="search_able_value">주석을 추가하여 기본 seccomp 프로필을 사용하도록 컨테이너 또는 Pod, PodSecurityPolicy 구성합니다
기본적으로 seccomp 프로필은 unconfined로 설정되며 이는 seccomp 프로필이 활성화되지 않음을 의미합니다.

apiVersion: v1
kind: Pod
metadata:
  name: default-Pod
spec:
  securityContext:
    seccompProfile:
      type: RuntimeDefault # unconfined X
  containers:
    ...
    securityContext:
      allowPrivilegeEscalation: false
---
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor
  annotations: container.apparmor.security.beta.kubernetes.io/hello: localhost/k8s-apparmor-example-deny-write
---
`apparmor.security.beta.kubernetes.io/defaultProfileName`  annotations을 `RUNTIME/default`로 설정
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
    name: restricted
    annotations:       seccomp.security.alpha.kubernetes.io/allowedProfileNames: 'docker/default,RUNTIME/default'        apparmor.security.beta.kubernetes.io/allowedProfileNames: 'RUNTIME/default'        seccomp.security.alpha.kubernetes.io/defaultProfileName:  'RUNTIME/default'        apparmor.security.beta.kubernetes.io/defaultProfileName:  'RUNTIME/default'</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s009" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s009_policy" onclick="onOffDisplay(this)"></div></td><td title="Credential Access" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Credential Access</span></td><td title="기본적으로 Service Account Access Token은 클러스터에서 생성된 모든 Pod에 마운트되며 Pod의 컨테이너는 Service Account 자격 증명을 사용하여 Kubernetes API 서버에 요청을 보낼 수 있습니다. 
Pod에 대한 액세스 권한을 얻은 공격자는 서비스 /var/run/secrets/kubernetes.io/serviceaccount/token계정 권한에 따라 Service Account Token( 에 있음)에 액세스하고 클러스터에서 Job을 수행할 수 있습니다. 
RBAC가 활성화되지 않은 경우 Service Account은 클러스터에서 무제한 권한을 가지며, RBAC이 활성화된 경우 해당 권한은 연결된 RoleBindings \ ClusterRoleBindings에 의해 결정됩니다.
Service Account Token에 대한 액세스 권한을 얻은 공격자는 클러스터 외부에서 Kubernetes API 서버를 인증 및 액세스하고 클러스터에 대한 액세스를 유지할 수도 있습니다." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">기본적으로 Service Account Access Token은 클러스터에서 생성된 모든 Pod에 마운트되며 Pod의 컨테이너는 Service Account 자격 증명을 사용하여 Kubernetes API 서버에 요청을 보낼 수 있습니다. 
Pod에 대한 액세스 권한을 얻은 공격자는 서비스 /var/run/secrets/kubernetes.io/serviceaccount/token계정 권한에 따라 Service Account Token( 에 있음)에 액세스하고 클러스터에서 Job을 수행할 수 있습니다. 
RBAC가 활성화되지 않은 경우 Service Account은 클러스터에서 무제한 권한을 가지며, RBAC이 활성화된 경우 해당 권한은 연결된 RoleBindings \ ClusterRoleBindings에 의해 결정됩니다.
Service Account Token에 대한 액세스 권한을 얻은 공격자는 클러스터 외부에서 Kubernetes API 서버를 인증 및 액세스하고 클러스터에 대한 액세스를 유지할 수도 있습니다.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s009', false)" id="containerSecuritySeverity_csc_k8s009" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s009', false)" id="containerSecurityAction_csc_k8s009" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s009', false)" id="containerSecurityPolicyEnabled_csc_k8s009" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s009" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s009&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s026&quot;,&quot;csr_k8s027&quot;,&quot;csr_k8s031&quot;,&quot;csr_k8s034&quot;,&quot;csr_k8s042&quot;,&quot;csr_k8s039&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s009" data-onoff="csc_k8s009_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s009_csr_k8s026" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s009_csr_k8s026_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">Group/User/Service Account에 `impersonate`  권한이 있는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s009', true)" id="containerSecurityRuleEnabled_csc_k8s009_csr_k8s026" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s009_csr_k8s026_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">CRITICAL</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">ServiceAccount</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes에서 가장 권한을 사용하면 사용자 또는 Service Account이 마치 다른 사용자 또는 Service Account인 것처럼 Job을 수행할 수 있습니다. 이는 한 서비스가 사용자를 대신하여 다른 서비스에 액세스해야 하는 경우와 같은 특정 상황에서 유용할 수 있습니다.

그러나 ServiceAccount 또는 노드가 다른 사용자 또는 Service Account에 대한 `impersonate`  권한을 갖도록 허용하면 잠재적으로 권한 에스컬레이션이 허용될 수 있습니다. ServiceAccount 및 노드는 일반적으로 개별 사용자와 연결되어 있지 않기 때문에 다른 사용자를 가장할 수 있는 기능을 부여하면 잠재적으로 ServiceAccount 또는 노드에 액세스할 수 있는 모든 사용자가 가장된 사용자의 권한을 얻을 수 있습니다.

예를 들어 ServiceAccount에 관리자 권한이 있는 사용자에 대한 가장 권한이 있는 경우 ServiceAccount에 액세스할 수 있는 모든 사용자는 관리자 사용자인 것처럼 Job을 수행할 수 있습니다. 이로 인해 민감한 정보에 대한 무단 액세스 또는 무단 Job을 수행할 수 있으므로 일반적으로 ServiceAccount 및 노드에 가장 권한을 부여하지 않는 것이 가장 좋습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value"> ServiceAccount 또는 노드가 다른 사용자 또는 Service Account에 대한  `impersonate`  권한을 갖도록 허용하면 잠재적으로 권한 에스컬레이션이 허용될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  annotations:
    authorization.k8s.io/impersonate: false" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  annotations:
    authorization.k8s.io/impersonate: false</span></div></div></div></div><div id="rowRule_csc_k8s009_csr_k8s027" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s009_csr_k8s027_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">ServiceAccount 중 모든 secrets을 읽을 수 있는 계정이있는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s009', true)" id="containerSecurityRuleEnabled_csc_k8s009_csr_k8s027" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s009_csr_k8s027_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">ServiceAccount</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">ServiceAccounts의 한 가지 잠재적인 문제는 잠재적으로 Kubernetes 클러스터의 모든 secrets을 읽을 수 있는 권한을 부여받을 수 있다는 것입니다. 이렇게 하면 ServiceAccount가 secrets, API 키 및 클러스터에 secrets로 저장된 기타 민감한 데이터와 같은 민감한 정보에 액세스할 수 있습니다.

ServiceAccount가 모든 secrets을 읽도록 허용하면 잠재적으로 중요한 정보에 대한 무단 액세스를 허용할 수 있으므로 클러스터에 보안 위험이 발생할 수 있습니다. 따라서 일반적으로 ServiceAccounts에 클러스터의 모든 secrets를 읽을 수 있는 권한을 부여하지 않는 것이 가장 좋습니다.

Kubernetes 클러스터를 실행하는 물리적 또는 가상 머신인 노드에도 잠재적으로 모든 secrets을 읽을 수 있는 권한이 부여될 수 있다는 점에 유의해야 합니다. 따라서 중요한 정보에 대한 잠재적인 무단 액세스를 방지하는 기능이 노드에 없는지 확인하는 것도 중요합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes에서 ServiceAccount는 특정 서비스와 연결된 계정입니다. ServiceAccount에는 Kubernetes 클러스터 내에서 수행할 수 있는 Job을 결정하는 역할이라는 특정 권한이 부여될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  annotations:
    authorization.k8s.io/get: []" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  annotations:
    authorization.k8s.io/get: []</span></div></div></div></div><div id="rowRule_csc_k8s009_csr_k8s031" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s009_csr_k8s031_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">3. <span class="search_able_value">secrets에 대한 액세스 최소화</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s009', true)" id="containerSecurityRuleEnabled_csc_k8s009_csr_k8s031" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s009_csr_k8s031_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD, RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">RoleBinding,ClusterRoleBinding,Role,ClusterRole</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">secrets 액세스 권한이 있는 공격자는 다양한 서비스에 대한 자격 증명을 포함할 수 있는 중요한 정보에 액세스할 수 있습니다. 
Secrets을 list/get할 User, Group 또는 service account을 결정합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes 클러스터에 저장된 secrets에 대한 부적절한 액세스를 통해 공격자는 Kubernetes 클러스터 또는 자격 증명이 secrets로 저장된 외부 리소스에 대한 추가 액세스 권한을 얻을 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="Kubernetes  secrets에 액세스할 수 있는 사용자, 그룹 및 Service Account 목록을 모니터링하고 승인합니다. 
Kubernetes API의 개체 에 대한 get, list, watch, secrets 액세스 권한이 있거나 액세스 권한이 있는 사용자를 검토하고 클러스터의 개체에 액세스합니다 

kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: Pod-exec
rules:
- apiGroups: [" *"]="" resources:="" ["secrets"]="" #="" we="" look="" for="" this="" resource="" or="" *="" verbs:="" ["get","list","watch"]="" verb="" "="" class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes  secrets에 액세스할 수 있는 사용자, 그룹 및 Service Account 목록을 모니터링하고 승인합니다. 
Kubernetes API의 개체 에 대한 get, list, watch, secrets 액세스 권한이 있거나 액세스 권한이 있는 사용자를 검토하고 클러스터의 개체에 액세스합니다 

kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: Pod-exec
rules:
- apiGroups: ["*"]
  resources: ["secrets"] # we look for this resource or *
  verbs: ["get","list","watch"]    # we look for this verb or *     </span></div></div></div></div><div id="rowRule_csc_k8s009_csr_k8s034" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s009_csr_k8s034_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">4. <span class="search_able_value">Applications credentials in configuration files</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s009', true)" id="containerSecurityRuleEnabled_csc_k8s009_csr_k8s034" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s009_csr_k8s034_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,ReplicaSet,DaemonSet,StatefulSet,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">알려진 민감한 키 이름 목록을 사용하여 Pod의 환경 변수에 민감한 정보가 있는지 확인합니다. 민감한 정보가 포함된 configmap이 있는지 확인하십시오.
(포드에 configuration에 민감한 정보가 있는 경우)</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">알려진 민감한 키 이름 목록을 사용하여 Pod의 환경 변수에 민감한 정보 사용됨 </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="Kubernetes secrets 또는 키 관리 시스템을 사용하여 자격 증명을 저장합니다." class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes secrets 또는 키 관리 시스템을 사용하여 자격 증명을 저장합니다.</span></div></div></div></div><div id="rowRule_csc_k8s009_csr_k8s042" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s009_csr_k8s042_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">5. <span class="search_able_value">ServiceAccount의 플러그인  admission policy plugin이 설정되지않았습니다.</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s009', true)" id="containerSecurityRuleEnabled_csc_k8s009_csr_k8s042" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s009_csr_k8s042_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">서비스 계정 관리를 자동화합니다. Pod를 생성할 때 서비스 계정을 지정하지 않으면 동일한 네임스페이스의 기본 서비스 계정이 자동으로 할당됩니다. 자체 서비스 계정을 만들고 API 서버에서 보안 토큰을 관리하도록 해야 합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Pod를 생성할 때 서비스 계정을 지정하지 않으면 동일한 네임스페이스의 기본 서비스 계정이 자동으로 할당됩니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    component: kube-apiserver
    tier: policy-plane
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
+   - kube-apiserver
+   - --enable-admission-plugins=ServiceAccount
    image: gcr.io/google_containers/kube-apiserver-amd64:v1.6.0
    ..." class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    component: kube-apiserver
    tier: policy-plane
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
+   - kube-apiserver
+   - --enable-admission-plugins=ServiceAccount
    image: gcr.io/google_containers/kube-apiserver-amd64:v1.6.0
    ...</span></div></div></div></div><div id="rowRule_csc_k8s009_csr_k8s039" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s009_csr_k8s039_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">6. <span class="search_able_value">CVE-2021-25742</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s009', true)" id="containerSecurityRuleEnabled_csc_k8s009_csr_k8s039" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s009_csr_k8s039_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">CronJob,DaemonSet,Deployment,Job,Node,Pod,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Ingress Object를 생성하거나 업데이트할 수 있는 사용자가 사용자 지정 스니펫 기능을 사용하여 클러스터의 모든 secrets을 얻을 수 있는 ingress-nginx의 보안 문제(자세한 내용은 https://github.com/kubernetes/ingress-nginx/issues/7837 참조) )</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value"> CVE-2021-25742이 다중 테넌트 클러스터의 관리자가 아닌 사용자에게 수신 생성 및 수정 권한이 부여된 경우 사용자는 사용자 지정 스니펫 기능을 사용하여 클러스터의 모든 Secrets을 얻을 수 있습니다. 이로 인해 클러스터의 다른 테넌트 또는 Secrets 정보에 대한 무단 액세스가 발생할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="이 취약성을 완화하는 방법: 
1. 완화를 허용하는  ingress-nginx 버전 >= v0.49.1 또는 >= v1.0.1)으로 업그레이드합니다. 
2. ingress-nginx를 Deployment하는 방법에 따라
 ingress-nginx ConfigMap에서 
allow-ginset-reculations를 false로 설정합니다." class="container_security_rule_catagory_detail"><span class="search_able_value">이 취약성을 완화하는 방법: 
1. 완화를 허용하는  ingress-nginx 버전 &gt;= v0.49.1 또는 &gt;= v1.0.1)으로 업그레이드합니다. 
2. ingress-nginx를 Deployment하는 방법에 따라
 ingress-nginx ConfigMap에서 
allow-ginset-reculations를 false로 설정합니다.</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s010" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s010_policy" onclick="onOffDisplay(this)"></div></td><td title="ARP poisoning and IP spoofing" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">ARP poisoning and IP spoofing</span></td><td title="Kubernetes에는 클러스터에서 사용할 수 있는 수많은 네트워크 플러그인(컨테이너 네트워크 인터페이스 또는 CNI)이 있습니다. 이 구성에서는 veth 쌍을 사용하여 다양한 Pod가 연결된 각 노드(cbr0)에 브리지가 생성됩니다.
POD 간 트래픽이 레벨 2 구성 요소인 브리지를 통과한다는 사실은 클러스터에서 ARP poisoning 수행이 가능함을 의미합니다.
따라서 공격자가 클러스터의 POD에 액세스하면 ARP poisoning을 수행하고 다른 POD의 트래픽을 spoofing할 수 있습니다. 공격자는 이 기술을 사용하여 DNS spoofing  또는 다른 POD의 클라우드 ID 도용과 같은 측면 이동으로 이어질 수 있는 네트워크 수준에서 여러 가지 공격을 수행할 수 있습니다(CVE-2021-1677)." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Kubernetes에는 클러스터에서 사용할 수 있는 수많은 네트워크 플러그인(컨테이너 네트워크 인터페이스 또는 CNI)이 있습니다. 이 구성에서는 veth 쌍을 사용하여 다양한 Pod가 연결된 각 노드(cbr0)에 브리지가 생성됩니다.
POD 간 트래픽이 레벨 2 구성 요소인 브리지를 통과한다는 사실은 클러스터에서 ARP poisoning 수행이 가능함을 의미합니다.
따라서 공격자가 클러스터의 POD에 액세스하면 ARP poisoning을 수행하고 다른 POD의 트래픽을 spoofing할 수 있습니다. 공격자는 이 기술을 사용하여 DNS spoofing  또는 다른 POD의 클라우드 ID 도용과 같은 측면 이동으로 이어질 수 있는 네트워크 수준에서 여러 가지 공격을 수행할 수 있습니다(CVE-2021-1677).</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s010', false)" id="containerSecuritySeverity_csc_k8s010" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s010', false)" id="containerSecurityAction_csc_k8s010" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s010', false)" id="containerSecurityPolicyEnabled_csc_k8s010" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s010" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s010&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s020&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s010" data-onoff="csc_k8s010_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s010_csr_k8s020" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s010_csr_k8s020_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">CVE-2020-14386 
NET_RAW 기능이 있는 컨테이너의 허용이 최소화되도록 보장</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s010', true)" id="containerSecurityRuleEnabled_csc_k8s010_csr_k8s020" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s010_csr_k8s020_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,PodSecurityPolicy</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">CVE-2020-14386은 af_packet 커널 모듈의 메모리 손상 취약점입니다. 취약점을 악용하려면 CAP_NET_RAW 기능이 필요합니다. Linux의 루트가 아닌 사용자에게는 이 기능이 없습니다. 그러나 커널 버전이 4.6 이상인 Linux OS에서는 루트가 아닌 사용자가 CAP_NET_RAW 기능이 있는 사용자 네임스페이스를 만들 수 있습니다. 기본적으로 Kubernetes 및 Docker 컨테이너에는 CAP_NET_RAW 기능이 있습니다. 따라서 공격자는 클러스터에 있는 노드의 Linux 커널 버전이 4.6 이상인 경우 ACK 클러스터의 노드에서 CVE-2020-14386 취약점을 악용할 수 있습니다. 공격자는 이 취약점을 악용하여 최대 10바이트 범위를 벗어난 쓰기를 수행할 수 있습니다. 이로 인해 무단 권한 에스컬레이션 및 컨테이너 탈출이 발생할 수 있습니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">이 취약점은 Linux 커널에 있는 패킷 소켓 기능의 버그로 인해 발생합니다. 
공격자는 취약점 발견자가 명시한 대로 최대 10바이트의 범위를 벗어난 쓰기를 수행하기 위해 취약점을 악용할 수 있습니다. 
이 취약성은 무단 권한 상승 및 컨테이너 탈출로 이어지고, 클러스터 노드의 메모리를 소진하고, 노드에서 실행되는 애플리케이션에 영향을 미칠 수 있습니다</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title=" securityContext:capabilities:drop
Capabilites 필드를 사용하면 루트 사용자의 모든 권한을 부여하지 않고 프로세스에 특정 권한을 부여할 수 있습니다. 드롭 에 ALL 또는 NET_RAW 가 포함되면 NET_RAW 기능 이 비활성화됩니다.
apiVersion: v1
kind: Pod
metadata:
  name: <Pod name>
spec:
  containers:
  - name: <container name>
    image: <image>
    securityContext:
      capabilities:
        drop:
+        - NET_RAW
+        - ALL

Pod에 대해 CAP_NET_RAW 기능이 비활성화되도록 Pod 보안 정책(PSP)을 구성할 수 있습니다

apiversion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: no-cap-net-raw
spec:
  requiredDropCapabilities:
    -NET_RAW" class="container_security_rule_catagory_detail"><span class="search_able_value"> securityContext:capabilities:drop
Capabilites 필드를 사용하면 루트 사용자의 모든 권한을 부여하지 않고 프로세스에 특정 권한을 부여할 수 있습니다. 드롭 에 ALL 또는 NET_RAW 가 포함되면 NET_RAW 기능 이 비활성화됩니다.
apiVersion: v1
kind: Pod
metadata:
  name: &lt;Pod name&gt;
spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    securityContext:
      capabilities:
        drop:
+        - NET_RAW
+        - ALL

Pod에 대해 CAP_NET_RAW 기능이 비활성화되도록 Pod 보안 정책(PSP)을 구성할 수 있습니다

apiversion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: no-cap-net-raw
spec:
  requiredDropCapabilities:
    -NET_RAW</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s011" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s011_policy" onclick="onOffDisplay(this)"></div></td><td title="Prevent host-resource overoccupation in a container environment" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Prevent host-resource overoccupation in a container environment</span></td><td title="컨테이너 런타임이 호스트 자원을 과다하게 사용하는 경우, 다른 컨테이너 및 호스트 시스템의 성능에 영향을 미칠 수 있습니다. 
이는 일반적으로 컨테이너화된 애플리케이션 간의 자원 경합이나, 컨테이너가 사용하는 클러스터 리소스 (CPU, 메모리, 스토리지 등)의 부족으로 인한 것입니다.
리소스 고갈을 방지하기 위해 모든 컨테이너 또는 네임스페이스에 대해 제한을 설정해야 합니다.
모든 네임스페이스에 대한 리소스 사용을 제한하는 리소스 정책(LimitRange 또는 ResourceQuota)을 정의했는지 확인하십시오." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">컨테이너 런타임이 호스트 자원을 과다하게 사용하는 경우, 다른 컨테이너 및 호스트 시스템의 성능에 영향을 미칠 수 있습니다. 
이는 일반적으로 컨테이너화된 애플리케이션 간의 자원 경합이나, 컨테이너가 사용하는 클러스터 리소스 (CPU, 메모리, 스토리지 등)의 부족으로 인한 것입니다.
리소스 고갈을 방지하기 위해 모든 컨테이너 또는 네임스페이스에 대해 제한을 설정해야 합니다.
모든 네임스페이스에 대한 리소스 사용을 제한하는 리소스 정책(LimitRange 또는 ResourceQuota)을 정의했는지 확인하십시오.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s011', false)" id="containerSecuritySeverity_csc_k8s011" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s011', false)" id="containerSecurityAction_csc_k8s011" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s011', false)" id="containerSecurityPolicyEnabled_csc_k8s011" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s011" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s011&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s045&quot;,&quot;csr_k8s046&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s011" data-onoff="csc_k8s011_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s011_csr_k8s045" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s011_csr_k8s045_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">Use ResourceQuota policies to limit resources </span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s011', true)" id="containerSecurityRuleEnabled_csc_k8s011_csr_k8s045" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s011_csr_k8s045_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">ResourceQuota</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes 리소스 부족시 메모리나 로컬 디스크 공간은 compressible resource에 해당하지 않기 때문에, 강제적으로 Throttle을 할 수 없다. 
그래서 쿠버네티스 클러스터는 리소스를 수거하기 위해서 우선순위에 따라 Pod  Eviction합니다.  </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">마스터 노드의  etcd 프로세스가 OOM 상태에 이르렀을시 5분(기본값) 간격으로 API-Server에 의해 etcd 압축이 트리거됩니다. 
그러나 소모보다 느리게 증가함으로 결국 etcd는 서비스거부(DoS)를 야기할 수 있습니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="전체네임스페이스 혹은 네임스페이스별 총 리소스 사용을 limits하는 제약 조건을  ResourceQuota 정책으로 구성합니다.
오브젝트( service, secret, configMap)의 총 수, 스토리지 클래스의 용량(크기), PVC 수" class="container_security_rule_catagory_detail"><span class="search_able_value">전체네임스페이스 혹은 네임스페이스별 총 리소스 사용을 limits하는 제약 조건을  ResourceQuota 정책으로 구성합니다.
오브젝트( service, secret, configMap)의 총 수, 스토리지 클래스의 용량(크기), PVC 수</span></div></div></div></div><div id="rowRule_csc_k8s011_csr_k8s046" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s011_csr_k8s046_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">Use LimitRange policies to limit resources</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s011', true)" id="containerSecurityRuleEnabled_csc_k8s011_csr_k8s046" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s011_csr_k8s046_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">LimitRange</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">네임스페이스 내에서 파드나 컨테이너는 네임스페이스의 리소스 쿼터에 정의된 만큼의 CPU와 메모리를 사용할 수 있는데, 이 때 아무런 제약을 걸지않았을때 k8s의 리소스를 무제한으로 사용가능하므로, 하나의 파드 또는 컨테이너가 사용 가능한 모든 리소스를 독점할 수 있습니다
네임스페이스 또는 노드에 대한 리소스 사용을 제한하기 위해 LimitRange 정책이 구성되었는지 확인합니다</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">하나의 파드 또는 컨테이너가 사용 가능한 모든 리소스를 독점할 수 있습니다.&nbsp;(아무런 제약을 걸지 않았을 때, 기본적으로 컨테이너는 k8s의 리소스를 무제한으로 사용합니다)</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="각 컨테이너에 대한 기본 요청 및 제한, 즉 네임스페이스에서 움직이는 Pod 하나하나의 리소스량의 최소 및 최대 요청으로 LimitRange 정책을 구성합니다
" class="container_security_rule_catagory_detail"><span class="search_able_value">각 컨테이너에 대한 기본 요청 및 제한, 즉 네임스페이스에서 움직이는 Pod 하나하나의 리소스량의 최소 및 최대 요청으로 LimitRange 정책을 구성합니다
</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s012" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s012_policy" onclick="onOffDisplay(this)"></div></td><td title="Overcommitting resources within container environments" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Overcommitting resources within container environments</span></td><td title="클러스터에서 리소스를 과도하게 커밋하는 경우 정상 조건에서는 모든 것이 완벽하게 실행될 수 있지만 부하가 높은 시나리오에서는 컨테이너가 CPU와 메모리를 한계까지 소비하기 시작할 수 있습니다.  이로 인해 노드가 Pod 제거를 시작하고 매우 중요한 상황에서 클러스터에서 사용 가능한 리소스가 고갈되어 파드 혹은 노드가 축출될 수 있습니다." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">클러스터에서 리소스를 과도하게 커밋하는 경우 정상 조건에서는 모든 것이 완벽하게 실행될 수 있지만 부하가 높은 시나리오에서는 컨테이너가 CPU와 메모리를 한계까지 소비하기 시작할 수 있습니다.  이로 인해 노드가 Pod 제거를 시작하고 매우 중요한 상황에서 클러스터에서 사용 가능한 리소스가 고갈되어 파드 혹은 노드가 축출될 수 있습니다.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s012', false)" id="containerSecuritySeverity_csc_k8s012" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s012', false)" id="containerSecurityAction_csc_k8s012" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s012', false)" id="containerSecurityPolicyEnabled_csc_k8s012" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s012" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s012&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s007&quot;,&quot;csr_k8s009&quot;,&quot;csr_k8s043&quot;,&quot;csr_k8s044&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s012" data-onoff="csc_k8s012_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s012_csr_k8s007" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s012_csr_k8s007_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">CPU limits이 설정되었는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s012', true)" id="containerSecurityRuleEnabled_csc_k8s012_csr_k8s007" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s012_csr_k8s007_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,CronJob,DaemonSet,Deployment,Job,Pod,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes를 사용하면 관리자가 리소스 사용에 대한 엄격한 제한으로 네임스페이스에서 CPU 할당량을 설정할 수 있습니다. 컨테이너는 구성된 제한보다 더 많은 CPU를 사용할 수 없습니다. 시스템에 CPU 시간이 없는 경우 컨테이너는 요청한 만큼의 CPU를 할당받을 수 있습니다.

CPU quotas는 공유 리소스를 적절하게 활용하는 데 사용됩니다. 관리되는 할당량이 없는 시스템은 수행하는 Job에 대한 리소스 부족으로 인해 결국 붕괴될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">CPU 할당량은 공유 리소스를 적절하게 활용하는 데 사용됩니다. 관리되는 할당량이 없는 시스템은 수행하는 Job에 대한 리소스 부족으로 인해 결국 붕괴될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="spec:
  containers:
   - name: <container name>
    image: <image>
    resources:
       limits:
+       cpu: <cpu limit>" class="container_security_rule_catagory_detail"><span class="search_able_value">spec:
  containers:
   - name: &lt;container name&gt;
    image: &lt;image&gt;
    resources:
       limits:
+       cpu: &lt;cpu limit&gt;</span></div></div></div></div><div id="rowRule_csc_k8s012_csr_k8s009" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s012_csr_k8s009_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">Memory limits이 설정되었는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s012', true)" id="containerSecurityRuleEnabled_csc_k8s012_csr_k8s009" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s012_csr_k8s009_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,CronJob,DaemonSet,Deployment,Job,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">스케줄러는 Pod의 컨테이너에 대한 리소스 요청 정보를 사용하여 Pod를 배치할 노드를 결정합니다. kubelet은 리소스 제한 집합을 적용하여 실행 중인 컨테이너가 제한 집합보다 더 많은 리소스를 사용할 수 없도록 합니다.

컨테이너의 프로세스가 허용된 메모리 양보다 더 많이 사용하려고 하면 시스템 커널은 메모리 부족(OOM) 오류와 함께 할당을 시도한 프로세스를 종료합니다. 제한이 설정되지 않으면 kubectl은 컨테이너가 소진될 때까지 점점 더 많은 메모리를 컨테이너에 할당합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너의 프로세스가 허용된 메모리 양보다 더 많이 사용하려고 하면 시스템 커널은 메모리 부족(OOM) 오류와 함께 할당을 시도한 프로세스를 종료합니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="spec:
  containers:
  - name: <container name>
    image: <image>
    resources:
      limits:
+       memory: <memory limit>" class="container_security_rule_catagory_detail"><span class="search_able_value">spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    resources:
      limits:
+       memory: &lt;memory limit&gt;</span></div></div></div></div><div id="rowRule_csc_k8s012_csr_k8s043" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s012_csr_k8s043_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">3. <span class="search_able_value">컨테이너 환경 내 CPU Overcommit  감지</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s012', true)" id="containerSecurityRuleEnabled_csc_k8s012_csr_k8s043" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s012_csr_k8s043_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,ReplicaSet,DaemonSet,StatefulSet,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes limits은 Pod 정의 또는 Deployment 정의에서 컨테이너별로 설정됩니다.
limits은 request보다 높을 수 있으므로 모든 limits의 합계가 노드 용량보다 높을 수 있습니다. 이를 오버 커밋이라 합니다. 
</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">kubernetes는 리소스 부족이 발생하면 Deployment시 할당된 request 크기까지 강제적으로 줄여서 리소스 부족을 해결합니다. 이는 강제로 줄이는 것이기 때문에 성능저하가 발생할수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="이런 문제를 예방하려면, Pod를 Deployment할때 request와 limit 값을 같이 주면, throttling은 발생하지 않지만 정확히 얼마의 CPU를 할당해야 하는지가 중요합니다. 		
Pod 별로 다양한 테스트를 통해서 적정 CPU 양을 찾아 적용하고 모니터링합니다.								" class="container_security_rule_catagory_detail"><span class="search_able_value">이런 문제를 예방하려면, Pod를 Deployment할때 request와 limit 값을 같이 주면, throttling은 발생하지 않지만 정확히 얼마의 CPU를 할당해야 하는지가 중요합니다. 		
Pod 별로 다양한 테스트를 통해서 적정 CPU 양을 찾아 적용하고 모니터링합니다.								</span></div></div></div></div><div id="rowRule_csc_k8s012_csr_k8s044" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s012_csr_k8s044_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">4. <span class="search_able_value">컨테이너 환경 내 Memory Overcommit  감지</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s012', true)" id="containerSecurityRuleEnabled_csc_k8s012_csr_k8s044" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s012_csr_k8s044_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,Deployment,ReplicaSet,DaemonSet,StatefulSet,Job,CronJob</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes limits은 Pod 정의 또는 Deployment 정의에서 컨테이너별로 설정됩니다.
limits은 request보다 높을 수 있으므로 모든 limits의 합계가 노드 용량보다 높을 수 있습니다. 이를 오버 커밋이라 합니다. 
 실제로 모든 컨테이너가 요청된 것보다 더 많은 메모리를 사용하는 경우 노드의 메모리가 고갈될 수 있습니다. 이로 인해 일부 메모리를 확보하기 위해  우선순위에 의해 Pod를 종료합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">kubernetes에 의한 Node-pressure eviction 발생하고, kubelet에의해 파드를 종료합니다. 
</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="비현실적인 limits을 설정하거나 Overcommit하면 프로세스가 제한되고 성능에 영향을 미친다는 사실을 모를 수 있습니다. Memory 사용량을 사전에 모니터링하고 컨테이너와 네임스페이스 모두에서 실제 limits을 파악합니다." class="container_security_rule_catagory_detail"><span class="search_able_value">비현실적인 limits을 설정하거나 Overcommit하면 프로세스가 제한되고 성능에 영향을 미친다는 사실을 모를 수 있습니다. Memory 사용량을 사전에 모니터링하고 컨테이너와 네임스페이스 모두에서 실제 limits을 파악합니다.</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s002" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s002_policy" onclick="onOffDisplay(this)"></div></td><td title="Execution non-warranted container images" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Execution non-warranted container images</span></td><td title="정책기반의 스캔(분석/평가)이 Pass되지 않은 혹은 취약한 속성을 가진 안전하지 않은 이미지로의 컨테이너 실행은 클러스터를 손상시킬 수 있습니다." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">정책기반의 스캔(분석/평가)이 Pass되지 않은 혹은 취약한 속성을 가진 안전하지 않은 이미지로의 컨테이너 실행은 클러스터를 손상시킬 수 있습니다.</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s002', false)" id="containerSecuritySeverity_csc_k8s002" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s002', false)" id="containerSecurityAction_csc_k8s002" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s002', false)" id="containerSecurityPolicyEnabled_csc_k8s002" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s002" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s002&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s047&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s002" data-onoff="csc_k8s002_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s002_csr_k8s047" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s002_csr_k8s047_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">Execution non-warranted container images</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s002', true)" id="containerSecurityRuleEnabled_csc_k8s002_csr_k8s047" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s002_csr_k8s047_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">CronJob,DaemonSet,Deployment,Job,Pod,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">정책기반의 스캔(분석/평가)이 안된 안전하지 않은 이미지의 실행은 클러스터를 손상시킬 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">스캔이 완료되지 않은 즉, 신뢰할수 없는 이미지를 클러스터에서 실행하면 클러스터가 손상될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="컨테이너 워크로드 실행제어 정책에서 " assurenced="" container="" image="" 사용을="" 확인합니다."="" 항목을="" 활성화="" 하십시오."="" class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너 워크로드 실행제어 정책에서 "Assurenced Container Image 사용을 확인합니다." 항목을 활성화 하십시오.</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s013" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s013_policy" onclick="onOffDisplay(this)"></div></td><td title="Privilege Escalation" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Privilege Escalation</span></td><td title="클라우드에서 공격자는 초기 액세스 권한을 얻고 권한을 에스컬레이션하려고 합니다. 즉, 컨테이너는 일시적이며 특정 네임스페이스와 cgroup에의해 isolation됩니다. 컨테이너 내에서 공격자는 시스템에 대한 더 많은 제어권을 얻기 위해 호스트로 탈출하려고 합니다. 

호스트로의 탈출을 위한 높은 액세스의 예는 다음과 같습니다.
* System/root 수준
* 관리자와 같은 액세스 권한이 있는 사용자 계정
* 특정 시스템에 액세스하거나 특정 기능을 수행하는 사용자 계정" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">클라우드에서 공격자는 초기 액세스 권한을 얻고 권한을 에스컬레이션하려고 합니다. 즉, 컨테이너는 일시적이며 특정 네임스페이스와 cgroup에의해 isolation됩니다. 컨테이너 내에서 공격자는 시스템에 대한 더 많은 제어권을 얻기 위해 호스트로 탈출하려고 합니다. 

호스트로의 탈출을 위한 높은 액세스의 예는 다음과 같습니다.
* System/root 수준
* 관리자와 같은 액세스 권한이 있는 사용자 계정
* 특정 시스템에 액세스하거나 특정 기능을 수행하는 사용자 계정</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s013', false)" id="containerSecuritySeverity_csc_k8s013" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s013', false)" id="containerSecurityAction_csc_k8s013" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s013', false)" id="containerSecurityPolicyEnabled_csc_k8s013" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s013" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s013&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s029&quot;,&quot;csr_k8s024&quot;,&quot;csr_k8s025&quot;,&quot;csr_k8s028&quot;,&quot;csr_k8s041&quot;,&quot;csr_k8s037&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s013" data-onoff="csc_k8s013_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s013_csr_k8s029" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s013_csr_k8s029_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">Cluster-admin binding </span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s013', true)" id="containerSecurityRuleEnabled_csc_k8s013_csr_k8s029" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s013_csr_k8s029_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">RoleBinding,ClusterRoleBinding,Role,ClusterRole</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">RBAC(역할 기반 액세스 제어)는 Kubernetes의 핵심 보안 기능입니다. RBAC는 클러스터에 있는 다양한 ID의 허용되는 Job을 제한할 수 있습니다. 
Cluster-admin은 Kubernetes에 내장된 높은 권한을 가진 역할입니다. 
클러스터에서 바인딩 및 클러스터 바인딩을 생성할 수 있는 권한이 있는 공격자는 클러스터 관리자 ClusterRole 또는 다른 높은 권한 역할에 대한 바인딩을 생성할 수 있습니다. (최소 권한 원칙을 적용해야 합니다. 꼭 필요한 경우에만 클러스터 관리자 권한이 부여되었는지 확인하세요. )</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value"> Cluster-admin은 Kubernetes에 내장된 높은 권한을 가진 역할입니다. 클러스터에서 바인딩 및 클러스터 바인딩을 생성할 수 있는 권한이 있는 공격자는 클러스터 관리자 ClusterRole 또는 다른 높은 권한 역할에 대한 바인딩을 생성할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="cluster-admin clusterrole에 바인딩되거나 동등한 높은 권한을 가짐으로써 어떤 주제에 cluster-admin RBAC 권한이 있는지 확인합니다." class="container_security_rule_catagory_detail"><span class="search_able_value">cluster-admin clusterrole에 바인딩되거나 동등한 높은 권한을 가짐으로써 어떤 주제에 cluster-admin RBAC 권한이 있는지 확인합니다.</span></div></div></div></div><div id="rowRule_csc_k8s013_csr_k8s024" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s013_csr_k8s024_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">노드에 부여된 RoleBinding을 확인해 권한 에스컬레이션을 허용하는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s013', true)" id="containerSecurityRuleEnabled_csc_k8s013_csr_k8s024" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s013_csr_k8s024_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">CRITICAL</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">RoleBinding</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes에서 RoleBinding은 사용자 또는 사용자 그룹에 특정 권한을 부여하는 데 사용됩니다. 역할이라고도 하는 이러한 권한은 사용자가 Kubernetes 클러스터 내에서 수행할 수 있는 Job을 결정합니다.

권한 에스컬레이션을 허용하지 않는 방식으로 RoleBinding을 구성하는 것이 중요합니다. 즉, RoleBinding이 있는 사용자는 RoleBinding을 통해 명시적으로 부여되지 않은 권한에 대한 액세스 권한을 얻을 수 없습니다.

권한 에스컬레이션을 허용하면 사용자가 잠재적으로 중요한 정보에 대한 무단 액세스 권한을 얻거나 수행할 수 없는 Job을 수행할 수 있습니다. 이는 클러스터에 보안 위험을 초래할 수 있으므로 RoleBindings에서 권한 에스컬레이션을 방지하는 것이 중요합니다.

RoleBindings에서 권한 에스컬레이션을 방지하는 한 가지 방법은 ServiceAccounts 또는 노드에 권한이 부여되지 않았는지 확인하는 것입니다. ServiceAccount 및 노드는 일반적으로 개별 사용자와 연결되어 있지 않기 때문에 여기에 RoleBinding을 부여하면 잠재적으로 ServiceAccount 또는 Node에 액세스할 수 있는 모든 사용자가 RoleBinding이 부여한 권한을 얻을 수 있습니다. 이로 인해 권한 상승이 발생할 수 있으므로 일반적으로 ServiceAccount 및 노드에 RoleBinding을 부여하지 않는 것이 가장 좋습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">권한 에스컬레이션을 허용하면 사용자가 잠재적으로 중요한 정보에 대한 무단 액세스 권한을 얻거나 수행할 수 없는 Job을 수행할 수 있습니다. 이는 클러스터에 보안 위험을 초래할 수 있으므로 RoleBindings에서 권한 에스컬레이션을 방지하는 것이 중요합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: RoleBinding
metadata:
  name: restricted-access
subjects:
- kind: ServiceAccount
  name: my-service-account
- kind: Node
  name: my-node
roleRef:
  kind: ClusterRole
  name: restricted-access
  apiGroup: rbac.authorization.k8s.io" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: RoleBinding
metadata:
  name: restricted-access
subjects:
- kind: ServiceAccount
  name: my-service-account
- kind: Node
  name: my-node
roleRef:
  kind: ClusterRole
  name: restricted-access
  apiGroup: rbac.authorization.k8s.io</span></div></div></div></div><div id="rowRule_csc_k8s013_csr_k8s025" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s013_csr_k8s025_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">3. <span class="search_able_value">`nodes/proxy` 또는 `Pods/exec` 하위 리소스에 생성권한을 부여하는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s013', true)" id="containerSecurityRuleEnabled_csc_k8s013_csr_k8s025" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s013_csr_k8s025_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">HIGH</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">ClusterRole</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes에서 node/proxy 또는 Pods/exec 하위 리소스에 대한 생성 권한을 부여하면 잠재적으로 권한 에스컬레이션이 허용될 수 있습니다. 이는 이러한 하위 리소스를 통해 사용자가 클러스터의 Kubernetes 노드 및 Pod에 액세스하고 제어할 수 있기 때문입니다.

사용자에게 nodes/proxy 하위 리소스에 대한 만들기 권한이 있는 경우 클러스터의 모든 노드에 대한 프록시를 만들 수 있습니다. 이렇게 하면 마치 노드에 직접 로그인한 것처럼 노드에 액세스할 수 있으므로 민감한 정보에 대한 액세스 권한을 부여하거나 수행할 수 없는 Job을 수행할 수 있습니다.

마찬가지로 사용자에게 Pods/exec 하위 리소스에 대한 생성 권한이 있는 경우 클러스터의 모든 Pod에서 명령을 실행할 수 있습니다. 이를 통해 Pod에서 실행 중인 컨테이너에 대한 액세스 권한을 얻을 수 있으므로 민감한 정보에 대한 액세스 권한을 부여하거나 승인되지 않은 Job을 수행할 수 있습니다.

따라서 잠재적으로 권한 에스컬레이션을 허용할 수 있으므로 노드/프록시 및 Pod/exec 하위 리소스에 대한 생성 권한을 부여할지 여부를 신중하게 고려하는 것이 중요합니다. 합법적으로 필요한 신뢰할 수 있는 사용자에게만 이러한 권한을 부여하고 승인되지 않은 목적으로 사용되지 않도록 사용을 모니터링하는 것이 더 안전할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">`nodes/proxy' 또는 `Pods/exec` 하위 리소스에 대한 생성 권한을 부여하면 잠재적인 권한 상승이 가능합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: ClusterRole
metadata:
  name: restricted-access
rules:
- apiGroups: []
  resources: [nodes/proxy, Pods/exec]
  verbs: [create]" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: ClusterRole
metadata:
  name: restricted-access
rules:
- apiGroups: []
  resources: [nodes/proxy, Pods/exec]
  verbs: [create]</span></div></div></div></div><div id="rowRule_csc_k8s013_csr_k8s028" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s013_csr_k8s028_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">4. <span class="search_able_value">CVE-2020-8554를 악용하는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s013', true)" id="containerSecurityRuleEnabled_csc_k8s013_csr_k8s028" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s013_csr_k8s028_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">ServiceAccount</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Kubernetes에서 ServiceAccount는 특정 서비스와 연결된 계정입니다. ServiceAccount에는 Kubernetes 클러스터 내에서 수행할 수 있는 Job을 결정하는 역할이라는 특정 권한이 부여될 수 있습니다.

ServiceAccounts의 잠재적인 문제 중 하나는 CVE-2020-8554로 알려진 취약점을 악용하는 데 사용될 수 있다는 것입니다. 이 취약점으로 인해 서비스 및 서비스 status를 수정할 수 있는 ServiceAccount가 status.loadBalancer.ingress.ip 필드를 임의의 IP 주소로 설정할 수 있습니다.

이러한 권한이 있는 ServiceAccount가 status.loadBalancer.ingress.ip 필드를 자신이 제어하는 &ZeroWidthSpace;&ZeroWidthSpace;IP 주소로 설정하면 클러스터에 대해 중간자(MiTM) 공격을 시작할 수 있습니다. 이렇게 하면 클러스터와 지정된 IP 주소 사이의 트래픽을 가로채고 수정할 수 있으므로 민감한 정보에 대한 액세스 권한을 얻거나 승인되지 않은 Job을 수행할 수 있습니다.

이러한 유형의 공격을 방지하려면 서비스 및 해당 상태를 수정할 수 있는 권한이 있는 ServiceAccount가 status.loadBalancer.ingress.ip 필드를 설정할 수 없는지 확인하는 것이 중요합니다. 이는 클러스터의 ServiceAccounts와 관련된 역할 및 권한을 신중하게 구성하여 수행할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">services/status를 수정할 수 있는 ServiceAccount 및 노드는 `status.loadBalancer.ingress.ip` 필드를 설정하여 수정되지 않은 CVE-2020-8554를 악용하여  클러스터의 다른 Pod(또는 노드)에서 트래픽을 가로챌 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="1. 사용자는 `kubectl auth can-i patch service --subresource=status` 명령을 사용하여 LoadBalancer 서비스의 상태를 패치할 수 있는 권한이 있는지 확인할 수 있습니다. 

2. externalIP admission plugin 구성이 되어있는지 확인합니다. ( 클러스터 관리자가 구성한 항목으로 제한)

3. 서비스어카운트의 patch 권한 확인
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  annotations:
    services/status/patch: []" class="container_security_rule_catagory_detail"><span class="search_able_value">1. 사용자는 `kubectl auth can-i patch service --subresource=status` 명령을 사용하여 LoadBalancer 서비스의 상태를 패치할 수 있는 권한이 있는지 확인할 수 있습니다. 

2. externalIP admission plugin 구성이 되어있는지 확인합니다. ( 클러스터 관리자가 구성한 항목으로 제한)

3. 서비스어카운트의 patch 권한 확인
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  annotations:
    services/status/patch: []</span></div></div></div></div><div id="rowRule_csc_k8s013_csr_k8s041" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s013_csr_k8s041_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">5. <span class="search_able_value">컨테이너 진입점에 Sudo 명령어 추가됨 </span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s013', true)" id="containerSecurityRuleEnabled_csc_k8s013_csr_k8s041" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s013_csr_k8s041_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">CronJob,DaemonSet,Deployment,Job,Pod,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너 진입점 명령에 sudo를 추가하면 프로세스 권한이 상승하고 금지된 리소스에 대한 액세스가 허용될 수 있습니다. 이 컨트롤은 Pod의 모든 컨테이너에서 모든 진입점 명령을 확인하여 sudo 명령이 있는 항목을 찾습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">컨테이너 진입점 명령에 sudo를 추가하면 프로세스 권한이 상승하고 금지된 리소스에 대한 액세스가 허용될 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: Pod
metadata:
  name: command-demo
  labels:
    purpose: demonstrate-command
spec:
  containers:
  - name: command-demo-container
    image: debian
    command: [" printenv"]="" #="" finds="" if="" "sudo"="" is="" used="" here="" args:="" ["hostname",="" "kubernetes_port"]="" restartpolicy:="" onfailure"="" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: Pod
metadata:
  name: command-demo
  labels:
    purpose: demonstrate-command
spec:
  containers:
  - name: command-demo-container
    image: debian
    command: ["printenv"]  # finds if "sudo" is used here
    args: ["HOSTNAME", "KUBERNETES_PORT"]
  restartPolicy: OnFailure</span></div></div></div></div><div id="rowRule_csc_k8s013_csr_k8s037" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s013_csr_k8s037_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">6. <span class="search_able_value">CVE-2022-0185</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s013', true)" id="containerSecurityRuleEnabled_csc_k8s013_csr_k8s037" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s013_csr_k8s037_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">RUNTIME</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">MEDIUM</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">APIService,Service</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Linux 관리자는 공격자가 컨테이너를 탈출하고 노드를 완전히 제어할 수 있도록 하는 광범위하게 사용 가능한 Linux 커널 취약점(CVE-2022-0185)을 공개했습니다. 이 취약점을 악용할 수 있으려면 공격자가 컨테이너에서 코드를 실행할 수 있어야 하며 컨테이너에 CAP_SYS_ADMIN 권한이 있어야 합니다. 

공격자는 이 취약점을 악용하여 DDoS 공격을 시작하거나 컨테이너에서 탈출할 수 있습니다. 이를 통해 공격자는 취약한 호스트에 대한 권한을 상승시킬 수 있습니다</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Linux 커널 취약점 CVE-2022-0185은 Pod Deployment 권한 혹은 Pod 실행 권한이 있는 공격자는 이 취약성을 악용하고 인증을 우회하여 메모리에서 범위를 벗어난 쓰기 Job을 수행할 수 있습니다. 
이로 인해 노드의 운영 체제가 충돌하고 서비스 중단이 발생합니다. 
또한 공격자는 악성 코드를 실행하여 컨테이너에서 탈출하고 호스트에 대한 루트 권한을 얻을 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="1. CAP_SYS_ADMIN 권한있는 컨테이너 체크
(참고:csr_k8s002)

2. Node의 Linux 커널 버전 확인, 5.1 이상 또는 5.16.2 이하인 경우 경고 발생
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{" \t"}{.status.nodeinfo.kernelversion}{"\n"}{end}'="" linux="" 커널="" 버전을="" 5.16.2="" 이상으로="" 패치"="" class="container_security_rule_catagory_detail"><span class="search_able_value">1. CAP_SYS_ADMIN 권한있는 컨테이너 체크
(참고:csr_k8s002)

2. Node의 Linux 커널 버전 확인, 5.1 이상 또는 5.16.2 이하인 경우 경고 발생
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.nodeInfo.kernelVersion}{"\n"}{end}'

Linux 커널 버전을 5.16.2 이상으로 패치</span></div></div></div></div></td></tr><tr id="rowPolicyTr_csc_k8s014" role="row" class=""><td><div class="view_hide_btn_icon" data-onoff="csc_k8s014_policy" onclick="onOffDisplay(this)"></div></td><td title="DevOpsBest" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">DevOpsBest</span></td><td title="Kubernetes DevOps 모범 사례" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="search_able_value">Kubernetes DevOps 모범 사례</span></td><td><div class="event_sel">	<div class="sel_box">		<select onchange="policyValueChange('csc_k8s014', false)" id="containerSecuritySeverity_csc_k8s014" class="wide event container_security_row_selecter" style="display: none;">		<option value="CRITICAL">Critical</option>		<option value="HIGH">High</option>		<option value="MEDIUM">Medium</option>		<option value="LOW">Low</option>		<option value="IGNORE">Ignore</option>		</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Medium</span><ul class="list"><li data-value="CRITICAL" class="option">Critical</li><li data-value="HIGH" class="option">High</li><li data-value="MEDIUM" class="option selected">Medium</li><li data-value="LOW" class="option">Low</li><li data-value="IGNORE" class="option">Ignore</li></ul></div>	</div></div></td><td><div class="event_sel">	<div class="sel_box">			<select onchange="policyValueChange('csc_k8s014', false)" id="containerSecurityAction_csc_k8s014" class="wide event container_security_row_selecter" style="display: none;">				<option value="DENY">Deny</option>				<option value="ALERT">Alert</option>				<option value="LOGGING">Logging</option>			</select><div class="nice-select wide event container_security_row_selecter" tabindex="0"><span class="current">Logging</span><ul class="list"><li data-value="DENY" class="option">Deny</li><li data-value="ALERT" class="option">Alert</li><li data-value="LOGGING" class="option selected">Logging</li></ul></div>	</div></div></td><td style="line-height: 12px;"><label class="switch-button container_security_switch"> <input onchange="policyValueChange('csc_k8s014', false)" id="containerSecurityPolicyEnabled_csc_k8s014" type="checkbox"> <span class="onoff-switch container_security_switch"></span></label></td><td><span class="container_security_policy_updated_user">shlee99</span></td><td><span class="container_security_policy_updated_date">2023-11-21 21:39:40</span></td><td style="display: block;"><input id="originalPolicy_csc_k8s014" type="hidden" value="{&quot;policyId&quot;:&quot;csc_k8s014&quot;,&quot;policyRuleIds&quot;:[&quot;csr_k8s006&quot;,&quot;csr_k8s008&quot;],&quot;severity&quot;:&quot;MEDIUM&quot;,&quot;action&quot;:&quot;LOGGING&quot;,&quot;enabled&quot;:true}"></td></tr><tr id="rowRuleTr_csc_k8s014" data-onoff="csc_k8s014_policy" class="container_security_rule_bundle" style="display: none">	<td colspan="8"><div id="rowRule_csc_k8s014_csr_k8s006" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s014_csr_k8s006_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">1. <span class="search_able_value">CPU Requests가 설정되었는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s014', true)" id="containerSecurityRuleEnabled_csc_k8s014_csr_k8s006" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s014_csr_k8s006_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,CronJob,DaemonSet,Deployment,Job,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">Pod의 컨테이너에 대한 리소스 요청을 지정할 때 스케줄러는 이 정보를 사용하여 Pod를 배치할 노드를 결정합니다. 컨테이너에 대한 리소스 제한을 설정할 때 kubelet은 실행 중인 컨테이너가 설정한 제한보다 더 많은 리소스를 사용할 수 없도록 해당 제한을 적용합니다.

기본 CPU 제한이 있는 네임스페이스에 컨테이너가 생성되고 컨테이너가 자체 CPU 제한을 지정하지 않으면 컨테이너에 기본 CPU 제한이 할당됩니다. Kubernetes는 특정 조건에서 기본 CPU 요청을 할당합니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">CPU Requests를 설정하면  컨테이너는 요청한 만큼의CPU를 갖도록 보장되지만 설정된 제한보다 더 많은 CPU를 사용할 수 없습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title="apiVersion: v1
kind: Pod
metadata:
  name: <name>
spec:
  containers:
  - name: <container name>
    image: <image>
    resources:
      requests:
+       cpu: <cpu request>" class="container_security_rule_catagory_detail"><span class="search_able_value">apiVersion: v1
kind: Pod
metadata:
  name: &lt;name&gt;
spec:
  containers:
  - name: &lt;container name&gt;
    image: &lt;image&gt;
    resources:
      requests:
+       cpu: &lt;cpu request&gt;</span></div></div></div></div><div id="rowRule_csc_k8s014_csr_k8s008" class="container_security_row_rule"><div class="container_security_rule_name">	<div class="container_security_rule_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="csc_k8s014_csr_k8s008_rule" onclick="onOffDisplay(this)"></div>	</div>	<div class="container_security_rule_catagory_detail">2. <span class="search_able_value">Memory Requests가 설정되었는지 확인</span></div><label class="switch-button container_security_switch" style="margin-left: auto;"> <input onchange="policyValueChange('csc_k8s014', true)" id="containerSecurityRuleEnabled_csc_k8s014_csr_k8s008" type="checkbox"> <div class="onoff-switch container_security_switch onoff_switch_is_active"></div></label></div><div class="container_security_rule_detail" data-onoff="csc_k8s014_csr_k8s008_rule" style="display: none"><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Type:</div>	<div class="container_security_rule_catagory_detail">BUILD</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Severity:</div>	<div class="container_security_rule_catagory_detail">LOW</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Resource:</div>	<div class="container_security_rule_catagory_detail">Pod,CronJob,DaemonSet,Deployment,Job,ReplicaSet,StatefulSet</div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Description: </div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">메모리 리소스는 바이트에서 페타바이트까지의 값을 사용하여 정의할 수 있으며 일반적으로 메비바이트를 사용합니다. 노드의 메모리 양보다 큰 메모리 요청을 구성하면 Pod가 예약되지 않습니다. 컨테이너에 대한 메모리 요청을 지정할 때 컨테이너의 리소스 매니페스트에 resources:requests 필드를 포함합니다. 메모리 한계를 지정하려면 resources:limits 를 포함하십시오 .

메모리 요청을 설정하면 컨테이너에 대한 메모리 제한이 적용됩니다. 컨테이너는 요청한 만큼의 메모리를 갖도록 보장되지만 설정된 제한보다 더 많은 메모리를 사용할 수 없습니다. 이 구성은 리소스를 절약하고 악용된 컨테이너에 대한 공격을 방지할 수 있습니다.</span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Impact:</div>	<div class="container_security_rule_catagory_detail"><span class="search_able_value">메모리 요청을 설정하면  컨테이너는 요청한 만큼의 메모리를 갖도록 보장되지만 설정된 제한보다 더 많은 메모리를 사용할 수 없습니다. </span></div></div><div class="container_security_rule_catagory">	<div class="container_security_rule_catagory_title">· Remediation:</div>	<div title=" spec:
   containers:
   - name: <container name>
    image: <image>
    resources:
      requests:
+       memory: <memory request>" class="container_security_rule_catagory_detail"><span class="search_able_value"> spec:
   containers:
   - name: &lt;container name&gt;
    image: &lt;image&gt;
    resources:
      requests:
+       memory: &lt;memory request&gt;</span></div></div></div></div></td></tr></tbody>

						</table>


					</div>
				</div>
			</div>
		</div>
	</section>
</body>
</html>
