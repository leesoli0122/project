<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html lang="ko">
<head>
<title>컨테이너 워크로드 실행제어 정책관리 - cAegis</title>
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
<!-- TODO: import -->
<%@ include file="/page/layout/common_sample.jsp"%>
<script defer src="./js/service/securityPolicy/loadModal.js?v=${version}"></script>
<script defer src="./js/service/securityPolicy/workLoadPolicy.js?v=${version}"></script>
<script type="text/javascript">
	$(document).ready(function() {
		$('#workLoad_policy_table').DataTable({
			autoWidth : false,
			paging : true,
			pagingType : 'full_numbers',
			//"ordering": true,
			order : [],
			columnDefs : [{
				targets : [ 8 ],
				orderable : false,
			},
			{				
				targets : [1,2,3,4,5,6,7], 
				"createdCell": function(td, cellData, rowData, row, col) {
					$(td).attr('title', cellData); // title 속성에 데이터 추가
					// 스타일 속성 설정
					$(td).css({
						'white-space': 'nowrap',
						'overflow': 'hidden',
						'text-overflow': 'ellipsis'
					}); 
				}
			}],
			info : true,
			filter : true,
			lengthChange : true,
			dom : 'rt<"bottom"ip><"clear">',
		});
	})
</script>
<style>
/* TODO : style.css 통합*/
.securitypolicy_bottom_info{
	background-color: #424a57;
	margin-bottom: 10px;
}
.securitypolicy_bottom_info .policy_title_box{
	padding-bottom: 10px;
}
.securitypolicy_top_info{
	background-color: #424a57;
}
.popup_view_cont{
	background-color: #2c333de8;
}

</style>
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
		<jsp:param name="menuId" value="policyWorkload" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="policyWorkload" />
	</jsp:include>

	<input type="hidden" id="checkedAgentList" name="checkedAgentList" />
	<input type="hidden" id="editRuleIdx" name="editRuleIdx" />
	<input type="hidden" id="checkDef" name="0" />

	<section class="securitypolicy_page mscrollbar">
		<div class="sub">
			<div class="securitypolicy_box">
				<div id="registry_policy_title" class="securitypolicy_title cluster_policy_title">
					<div class="securitypolicy_title_left">
						<h3>컨테이너 워크로드 실행제어</h3>
						<dl class="fl">
							<dt>총개수</dt>
							<dd id="registry_policy_cnt">4</dd>
						</dl>
					</div>
					<div class="securitypolicy_title_middle cluster_policy_title_middle">
						<div class="fl">
							<div class="event_sel">
								<div class="sel_box">
									<select id="selectClusterUuid" onchange="updateTableByCluster()" class="wide event cluster_selecteBox">
										<option value="53596b7c-dde6-4a04-ada6-ffa143a9728a">Cluster-61</option><option value="2f4b443e-d0c4-455f-9664-c6f6fbe5f5d1">Cluster-67</option><option value="73f67fc0-949a-4527-9a27-ccf35ad2c527">K8S v1.19.14_Cluster</option><option value="e957fea2-1f6a-4ae2-931f-8a5ee1228c4d">Openshift-240</option>
									</select>
								</div>
							</div>
						</div>
						<div class="fl">
							<div class="ipt_box">
								<input class="" type="text" placeholder="Rule Name을 입력하여 주십시오." id="searchKeyword" name="searchKeyword" />
							</div>
							<a id="searchBtn" href="#" class="btn serch">검색</a>
						</div>
					</div>
					<div class="securitypolicy_title_right cluster_policy_title_right">
						<div class="fl">
							<a id="policyUpdate" href="#" class="btn" rel="workLoad_policy_add" name="workLoad">정책추가</a><!--//line def 클래스 제거-->
						</div>
					</div>
				</div>
				<div id="containerSecurityPolicyTree">
					<div id="registry_policy_contain">
						<div id="workLoadTbl" class="tbl">
							<table id="workLoad_policy_table">
								<colgroup>
									<col width="6%" />
									<col width="10%" />
									<col width="24%" />
									<col width="10%" />
									<col width="10%" />
									<col width="10%" />
									<col width="10%" />
									<col width="10%" />
									<col width="10%" />
								</colgroup>
								<thead>
									<tr>
										<th>No</th>
										<th>Type</th>
										<th>Rule Name</th>
										<th>Action</th>
										<th>Enabled</th>
										<th>Updated User</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th>Operation</th>
									</tr>
								</thead>
								<tbody>
								<tr role="row" class="odd"><td>1</td><td title="CUSTOM" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CUSTOM</td><td title="Namespace[intig2-ns] :: for TEST" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Namespace[intig2-ns] :: for TEST</td><td title="ALLOW" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">ALLOW</td><td title="적용" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">적용</td><td title="jypark0125" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">jypark0125</td><td title="2023-12-07 14:47:14" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-07 14:47:14</td><td title="2023-12-07 14:47:14" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-07 14:47:14</td><td><input type="hidden" name="workLoadData" value="{&quot;policy_type&quot;:&quot;CUSTOM&quot;,&quot;is_activated&quot;:&quot;T&quot;,&quot;updated_at&quot;:&quot;2023-12-07 14:47:14&quot;,&quot;cluster_uuid&quot;:&quot;53596b7c-dde6-4a04-ada6-ffa143a9728a&quot;,&quot;policy_description&quot;:&quot;Namespace[intig2-ns]- for TEST&quot;,&quot;updated_by&quot;:&quot;jypark0125&quot;,&quot;policy_name&quot;:&quot;Namespace[intig2-ns] :: for TEST&quot;,&quot;created_at&quot;:&quot;2023-12-07 14:47:14&quot;,&quot;policy_action&quot;:&quot;ALLOW&quot;,&quot;uuid&quot;:&quot;4a23508c-2309-426d-92a5-1f8a928df9dc&quot;}"><a href="#" class="btn icon edit" rel="workLoad_policy_edit" name="workload"> </a><a class="btn icon del" rel="workLoad_policy_del"> </a></td></tr><tr role="row" class="even"><td>2</td><td title="CUSTOM" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CUSTOM</td><td title="Cluster policy: All Deny" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Cluster policy: All Deny</td><td title="DENY" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">DENY</td><td title="적용" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">적용</td><td title="jypark0125" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">jypark0125</td><td title="2023-12-06 15:29:49" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-06 15:29:49</td><td title="2023-12-06 15:29:49" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-06 15:29:49</td><td><input type="hidden" name="workLoadData" value="{&quot;policy_type&quot;:&quot;CUSTOM&quot;,&quot;is_activated&quot;:&quot;T&quot;,&quot;updated_at&quot;:&quot;2023-12-06 15:29:49&quot;,&quot;cluster_uuid&quot;:&quot;53596b7c-dde6-4a04-ada6-ffa143a9728a&quot;,&quot;policy_description&quot;:&quot;Cluster policy&quot;,&quot;updated_by&quot;:&quot;jypark0125&quot;,&quot;policy_name&quot;:&quot;Cluster policy: All Deny&quot;,&quot;created_at&quot;:&quot;2023-12-06 15:29:49&quot;,&quot;policy_action&quot;:&quot;DENY&quot;,&quot;uuid&quot;:&quot;a01e8b8d-e3fc-4e8e-955c-a95d6f134558&quot;}"><a href="#" class="btn icon edit" rel="workLoad_policy_edit" name="workload"> </a><a class="btn icon del" rel="workLoad_policy_del"> </a></td></tr><tr role="row" class="odd"><td>3</td><td title="CUSTOM" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CUSTOM</td><td title="Namespace[monitoring]: For Prometheus" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Namespace[monitoring]: For Prometheus</td><td title="ALLOW" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">ALLOW</td><td title="적용" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">적용</td><td title="jypark0125" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">jypark0125</td><td title="2023-12-06 14:01:47" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-06 14:01:47</td><td title="2023-12-06 14:01:47" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-06 14:01:47</td><td><input type="hidden" name="workLoadData" value="{&quot;policy_type&quot;:&quot;CUSTOM&quot;,&quot;is_activated&quot;:&quot;T&quot;,&quot;updated_at&quot;:&quot;2023-12-06 14:01:47&quot;,&quot;cluster_uuid&quot;:&quot;53596b7c-dde6-4a04-ada6-ffa143a9728a&quot;,&quot;policy_description&quot;:&quot;Promethus&quot;,&quot;updated_by&quot;:&quot;jypark0125&quot;,&quot;policy_name&quot;:&quot;Namespace[monitoring]: For Prometheus&quot;,&quot;created_at&quot;:&quot;2023-12-06 14:01:47&quot;,&quot;policy_action&quot;:&quot;ALLOW&quot;,&quot;uuid&quot;:&quot;c94a79df-2569-4cea-8071-66875ceb9e12&quot;}"><a href="#" class="btn icon edit" rel="workLoad_policy_edit" name="workload"> </a><a class="btn icon del" rel="workLoad_policy_del"> </a></td></tr><tr role="row" class="even"><td>4</td><td title="CUSTOM" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CUSTOM</td><td title="Namespace[sga-ns] :: policy" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Namespace[sga-ns] :: policy</td><td title="ALLOW" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">ALLOW</td><td title="적용" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">적용</td><td title="jypark0125" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">jypark0125</td><td title="2023-12-06 14:00:50" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-06 14:00:50</td><td title="2023-12-06 14:00:50" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-12-06 14:00:50</td><td><input type="hidden" name="workLoadData" value="{&quot;policy_type&quot;:&quot;CUSTOM&quot;,&quot;is_activated&quot;:&quot;T&quot;,&quot;updated_at&quot;:&quot;2023-12-06 14:00:50&quot;,&quot;cluster_uuid&quot;:&quot;53596b7c-dde6-4a04-ada6-ffa143a9728a&quot;,&quot;policy_description&quot;:&quot;Namespace policy&quot;,&quot;updated_by&quot;:&quot;jypark0125&quot;,&quot;policy_name&quot;:&quot;Namespace[sga-ns] :: policy&quot;,&quot;created_at&quot;:&quot;2023-12-06 14:00:50&quot;,&quot;policy_action&quot;:&quot;ALLOW&quot;,&quot;uuid&quot;:&quot;c5128400-4c2b-4940-8119-1f158dcaadf1&quot;}"><a href="#" class="btn icon edit" rel="workLoad_policy_edit" name="workload"> </a><a class="btn icon del" rel="workLoad_policy_del"> </a></td></tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<!-- 230308 탐지룰 관리 > 컨테이너 워크로드 실행제어 정책 추가 Modal -->
	<div id="workLoad_policy_edit" class="modal mid win_popup rec" style="height: 100%; width: 1000px"><!--//2024-01-15 mscrollbar 클래스 제거-->
		<input type="hidden" id="selectedClusterUuid" value="" />
		<input type="hidden" id="clusterInfo" value="" />
		<input type="hidden" id="clusterSubjectInfo" value="" />
		<input type="hidden" id="clusterCsPolicyInfo" value="" />

		<h4 id="title" data-type="">컨테이너 워크로드 실행제어</h4>
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<div class="securitypolicy_top" style="padding-top: 0px">
					<div class="securitypolicy_top_info">
						<div class="policy_title_box" style="padding-top: 0px">
							<p class="policy_title">Rule Name</p>
							<div class="ipt_box" style="padding-right: 20px">
								<input type="text" id="workload_rulename" value="" placeholder="" class="no_radius" />
							</div>
							<label class="switch-button"> <input id="workload_isactive" type="checkbox" /> <span class="onoff-switch"></span>
							</label>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Description</p>
							<div class="ipt_box">
								<input type="text" id="workload_description" value="" placeholder="" class="no_radius" />
							</div>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Cluster</p>
							<div class="sel_box">
								<select id="wh_cluster" class="popup_sel">
									<!-- <option value="" disabled selected style="display: none">적용할 Cluster를 선택해 주십시오</option> -->
								</select>
							</div>

							<p class="policy_title" style="padding-left: 30px">Action</p>
							<div class="sel_box">
								<select id="workload_action" class="popup_sel" s>
									<option value="DENY" selected="selected">Deny</option>
									<option value="ALLOW">Allow</option>
									<!-- <option value="LOGGING">Logging</option> -->
								</select>
							</div>
						</div>
					</div>
				</div>
				<div id="workLoadPolicyInfo" class="securitypolicy_bottom" style="padding-top: 10px">
					<div class="securitypolicy_bottom_info">
						<div class="policy_title_box" style="padding-top: 0px">
							<p class="policy_title">Scope</p>
							<div class="policy_body">
								<div id="policy_scopeOption">
									<div class="policy_option">
										<p>Cluster</p>
										<div class="ipt_box" style="margin-right: 10px">
											<input type="text" value="" class="selected_cluster no_radius" readonly />
										</div>
										<p>Namespace</p>
										<div class="ipt_box">
											<input type="text" placeholder="" class="no_radius" name="namespace" />
										</div>
										<a id="scopeOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
									</div>
								</div>
								<p class="policy_explain">Cluster 정책이 Namespace 정책보다 우선 적용 됩니다.</p>
							</div>
						</div>
					</div>
					
					<div class="securitypolicy_bottom_info">
						<div class="policy_title_box">
							<!--2024-01-15 삭제<p class="policy_title"></p>-->
							<div class="policy_body">
								<p class="policy_explain" style="padding:0;">네임스페이스 정책일 경우 동일한 주체에 대한 정책이 여러개일 경우 Deny 정책이 우선 적용됩니다.</p>
							</div>
						</div>
						
						<div class="policy_title_box">
							<p class="policy_title">Subjects</p>
							<div class="policy_body">
								<div style="display: flex; margin-top: 10px; margin-bottom: 10px">
									<p>Account 정보를 최신화 합니다</p>
									<a class="btn icon update" onclick="updateClusterSubjectList()"></a><!--//2024-01-15 btn icon 클래스 추가-->
								</div>
								<div id="policy_subjectOption">
									<div class="policy_option">
										<div class="sel_box">
											<select id="wh_subject_type_0" class="popup_sel" name="wh_subject_type"></select>
										</div>
										<div id="subject_info_box_0" class="sel_box" style="display: none">
											<select id="wh_subject_info_0" class="popup_sel" name="wh_subject_info"></select>
										</div>
										<div id="subjectOption_ipt_0" class="ipt_box" style="display: none">
											<input type="text" value="" placeholder="" class="no_radius" name="wh_subject_input" />
										</div>
										<a id="subjectOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
									</div>
								</div>
								<p class="policy_explain">실행하고자 하는 주체(User,Group,ServiceAccount,System,Process) 정보를 입력합니다.</p>
							</div>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Resources</p>
							<div class="policy_body">
								<div id="policy_resourceOption">
									<div class="policy_option">
										<div class="sel_box">
											<select id="wh_resources_0" class="popup_sel"></select>
										</div>
										<div id="resourceOption_ipt_0" class="ipt_box" style="display: none">
											<input type="text" value="" placeholder="" class="no_radius" />
										</div>
										<a id="resourceOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
									</div>
								</div>
								<p class="policy_explain">실행 제어 하고자 하는 Kubernetes Resource를 선택합니다.</p>
							</div>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Operations</p>
							<div class="policy_body">
								<div id="policy_operationsOption">
									<div class="policy_option">
										<div class="sel_box">
											<select id="wh_operations_0" class="popup_sel"></select>
										</div>
										<div id="operationsOption_ipt_0" class="ipt_box" style="display: none">
											<input type="text" value="" placeholder="" class="no_radius" />
										</div>
										<a id="operationsOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
									</div>
								</div>
								<p class="policy_explain">제어할 Operation을 선택합니다.</p>
							</div>
						</div>
					</div>
										
					<div class="securitypolicy_bottom_info">
						<div class="policy_title_box" style="padding-bottom: 0px">
							<div class="policy_box">
								<input type="checkbox" id="wh_validation" />
								<label for="wh_validation" style="color: #e5e5e5; font-size: 13px; font-weight: 400"> 보안 표준 규정준수 검증</label>
							</div>
						</div>
						<div class="policy_title_box">
							<div id="complianceBox" class="policy_body" style="align-items: center">
								<div style="display: flex; align-items: center">
									<!-- 0707 사용자 규정준수 추가 -->
									<div class="cs_compliance_box sel_box" style="min-width: 220px; margin-right: 10px">
										<select id="cs_complicance" class="popup_sel"></select>
									</div>
									<p>Fail Controls의 갯수가</p>
									<div class="sel_box" style="min-width: 200px; margin-right: 10px">
										<select id="cs_complianceCondition" class="popup_sel">
											<option value="EQUAL" selected="selected">equals(=)</option>
											<option value="LOW">less than(&lt;)</option>
											<option value="EQUAL_LOW">less than or equals(&lt;=)</option>
											<option value="HIGH">greater than(&gt;)</option>
											<option value="EQUAL_HIGH">greater than or equals(&gt;=)</option>
										</select>
									</div>
									<div class="ipt_box" style="margin-right: 10px">
										<input type="text" id="cs_failCount" value="" class="no_radius" />
									</div>
									<p>인지 확인 합니다.</p>
								</div>
								<p id="cs_failMessage" style="color:red; margin-top:10px; display:none">클러스터에 설정된 규정 준수 스캔 정책이 존재하지 않습니다.</p>
							</div> 
						</div>
					</div>
					
					<div class="securitypolicy_bottom_info">
						<div class="policy_title_box" style="padding:0px;">
							<div class="policy_box">
								<input type="checkbox" id="wh_assurenced" />
								<label for="wh_assurenced" style="color: #e5e5e5; font-size: 13px; font-weight: 400"> 보증된 컨테이너 이미지 사용을 확인합니다.</label>
							</div>
						</div>
					</div>
					

						<div class="policy_btn_box">
							<a href="javascript:lf_closeWorkLoadPolicyModal();" class="btn line">취소</a><!-- 2024-01-16 삭제 :  style="margin-right: 30px", line 클래스 추가-->
							<a href="#" id="wh_policy_add" class="btn" onclick="plusPolicyWorkload()">확인</a>
						</div>
				</div>
			</div>
		</div>

		<div class="modal_controller" style="margin: 8px">
			<a href="javascript:lf_closeWorkLoadPolicyModal();" class="close">close</a>
		</div>
	</div>
</body>
</html>
