<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<title>탐지 룰 관리 - Aegis</title>
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
<%@ include file="/page/layout/common.jsp"%>
<script src="./js/service/securityPolicy/policyManagement.js?v=${version}"></script>
<script src="./js/service/securityPolicy/loadModal.js?v=${version}"></script>
<script src="./js/service/securityPolicy/editPolicyModal.js?v=${version}"></script>
<script src="./js/service/securityPolicy/editAssetModal.js?v=${version}"></script>
<script src="./js/service/securityPolicy/workLoadPolicy.js?v=${version}"></script>

<!-- 230210 Registry 화면에 표시 될 테이블 표 추가(imageSecurity_policy_table)-->
<script type="text/javascript">
	$(document).ready(function() {
		$('#workLoad_policy_table').DataTable({
			autoWidth : false,
			paging : true,
			pagingType : 'full_numbers',
			//"ordering": true,
			order : [],
			columnDefs : [ {
				targets : [ 8 ],
				orderable : false,
			}, ],
			info : true,
			filter : false,
			lengthChange : true,
			dom : 'rt<"bottom"ip><"clear">',
		});

		$('#imageSecurity_policy_table').DataTable({
			autoWidth : false,
			paging : true,
			pagingType : 'full_numbers',
			//"ordering": true,
			order : [],
			columnDefs : [ {
				targets : [ 9 ],
				orderable : false,
			}, ],
			info : true,
			filter : false,
			lengthChange : true,
			dom : 'rt<"bottom"ip><"clear">',
		});

		$('#firewall_policy_table').DataTable({
			autoWidth : false,
			paging : true,
			pagingType : 'full_numbers',
			ordering : true,
			info : true,
			filter : false,
			lengthChange : true,
			dom : 'rt<"bottom"ip><"clear">',
		});

		$('#fileint_policy_table').DataTable({
			autoWidth : false,
			paging : true,
			pagingType : 'full_numbers',
			ordering : true,
			info : true,
			filter : false,
			lengthChange : true,
			dom : 'rt<"bottom"ip><"clear">',
		});
	});
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

	<jsp:include page="/page/layout/sidebar.jsp" flush="false">
		<jsp:param name="menuId" value="policyManagement" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar.jsp" flush="false">
		<jsp:param name="menuId" value="policyManagement" />
	</jsp:include>

	<input type="hidden" id="checkedAgentList" name="checkedAgentList" />
	<input type="hidden" id="editRuleIdx" name="editRuleIdx" />
	<input type="hidden" id="checkDef" name="0" />

	<!-- TODO : section 로직 분리 -->
	<section class="securitypolicy_page mscrollbar">
		<div class="sub">
			<div class="securitypolicy_box">
				<div class="tbl rowcol">
					<table class="click">
						<colgroup>
							<col />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
							<col width="7%" />
						</colgroup>
						<thead>
							<tr>
								<th rowspan="2">그룹</th>
								<th colspan="2">방화벽</th>
								<th colspan="2">컨테이너 워크로드 실행제어</th>
								<th colspan="2">컨테이너 이벤트</th>
								<th colspan="2">컨테이너 이미지 스캔</th>
								<th colspan="2">안티 멀웨어</th>
								<th colspan="2">무결성</th>
							</tr>
							<tr>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
							</tr>
						</thead>
						<tbody id="groupStatTable"></tbody>
					</table>
				</div>
			</div>
			<div class="securitypolicy_box">
				<div id="security_policy_title" class="securitypolicy_title">
					<div class="securitypolicy_title_left">
						<h3>AGENT LIST</h3>
						<!-- dl class="fl">
						<dt>장비그룹</dt>
						<dd id="groupName"></dd>
					</dl -->
						<dl class="fl">
							<dt>총개수</dt>
							<dd id="deviceCnt"></dd>
						</dl>
					</div>
					<div class="securitypolicy_title_right">
						<dl class="fl">
							<dt>정보</dt>
							<dd>
								<a href="javascript:window.open('/vulnerability.do', '', 'width=1200,height=840,location=no,status=no,scrollbars=no');" class="btn line">취약점 조회</a>
								<a href="javascript:window.open('/processView.do', '', 'width=1200,height=840,location=no,status=no,scrollbars=no');" class="btn line">프로세스 조회</a>
							</dd>
						</dl>
						<dl class="fl">
							<dt>기본정책</dt>
							<dd>
								<a href="#" class="btn line def" rel="policy_add" name="ips">침입방지시스템</a>
								<a href="#" class="btn line def" rel="policy_add" name="malware">멀웨어</a>
							</dd>
						</dl>
						<dl class="fl">
							<dt>검색어</dt>
							<dd>
								<div class="ipt_box">
									<input class="" type="text" placeholder="장비명, IP를 입력하여 주십시오." id="searchKeyword" name="searchKeyword" />
								</div>
								<a id="searchBtn" href="#" class="btn serch">검색</a>
							</dd>
						</dl>
					</div>
				</div>

				<!-- Registry 자산 페이지 클릭시 show -->
				<div id="registry_policy_title" class="securitypolicy_title" style="display: none">
					<div class="securitypolicy_title_left">
						<h3 id="policy_title">AGENT LIST</h3>
						<dl class="fl">
							<dt>총개수</dt>
							<dd id="registry_policy_cnt"></dd>
						</dl>
					</div>
					<div class="securitypolicy_title_right">
						<dl class="fl">
							<dd>
								<a id="policy_update" href="#" class="btn line def" rel="imageSecurity_policy_add" name="imageSecurity">정책추가</a>
							</dd>
						</dl>
						<dl class="fl">
							<dt>검색어</dt>
							<dd>
								<div class="ipt_box">
									<input class="" type="text" placeholder="Rule Name을 입력하여 주십시오." id="searchKeyword" name="searchKeyword" />
								</div>
								<a id="searchBtn" href="#" class="btn serch">검색</a>
							</dd>
						</dl>
					</div>
				</div>

				<div id="security_policy_contain" class="securitypolicy_contain">
					<ul id="deviceList" class="securitypolicy_cont"></ul>
				</div>

				<!-- cluster 자산 페이지 클릭시 show -->
				<div id="registry_policy_contain">
					<div id="workLoadTbl" class="tbl" style="display: none">
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
							<tbody></tbody>
						</table>
					</div>

					<!-- Registry 이미지 시큐리티 -->
					<div id="imageSecurityTbl" class="tbl" style="display: none">
						<table id="imageSecurity_policy_table">
							<colgroup>
								<col width="6%" />
								<col width="8%" />
								<col width="10%" />
								<col width="12%" />
								<col width="10%" />
								<col width="10%" />
								<col width="8%" />
								<col width="10%" />
								<col width="10%" />
								<col width="10%" />
							</colgroup>
							<thead>
								<tr>
									<th>No</th>
									<th>Type</th>
									<th>Registry</th>
									<th>Rule Name</th>
									<th>Action</th>
									<th>Enabled</th>
									<th>Updated User</th>
									<th>Created Date</th>
									<th>Updated Date</th>
									<th>Operation</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>

					<div id="firewallTbl" class="tbl" style="display: none">
						<table id="firewall_policy_table">
							<colgroup>
								<col width="6%" />
								<col width="8%" />
								<col width="10%" />
								<col width="10%" />
								<col width="10%" />
								<col width="10%" />
								<col width="8%" />
								<col width="8%" />
								<col width="8%" />
								<col width="8%" />
								<col width="8%" />
							</colgroup>
							<thead>
								<tr>
									<th>No</th>
									<th>Direction</th>
									<th>Source IP/CIDR</th>
									<th>Source Port</th>
									<th>Destination IP(CIDR)</th>
									<th>Destination PORT</th>
									<th>Action</th>
									<th>Enabled</th>
									<th>Created Date</th>
									<th>Updated Date</th>
									<th>Operation</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>

					<div id="fileintTbl" class="tbl" style="display: none">
						<table id="fileint_policy_table">
							<colgroup>
								<col width="10%" />
								<col width="10%" />
								<col width="10%" />
								<col width="10%" />
								<col width="10%" />
								<col width="10%" />
								<col width="12%" />
								<col width="12%" />
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
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- TODO : Modal 로직 분리 -->
	<!-- div id="workLoad_policy_edit" class="modal mid win_popup rec mscrollbar" style="height: 100%;">
		<h4 id="title" data-type=""> 컨테이너 워크로드</h4> 
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<div class="securitypolicy_top" style="padding-top:0px">
					 <div class="securitypolicy_top_info">
					</div>
				</div>
				<div class="securitypolicy_bottom" style="padding-top:10px">
					<div class="securitypolicy_bottom_info">
					</div>
				</div>
			</div>
		</div>
		<div class="modal_controller" style="margin: 8px;">
			<a href="javascript:lf_closeImageSecurityPolicyModal();" class="close">close</a>
		</div>
	</div -->

	<!-- 230308 탐지룰 관리 > 컨테이너 워크로드 실행제어 정책 추가 Modal -->
	<div id="workLoad_policy_edit" class="modal mid win_popup rec mscrollbar" style="height: 100%; width: 1000px">
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

						<div class="policy_title_box">
							<p class="policy_title">Subjects</p>
							<div class="policy_body">
								<div style="display: flex; margin-top: 10px; margin-bottom: 10px">
									<p>Cluster Account 정보를 최신화 합니다</p>
									<a class="update" onclick="updateClusterSubjectList()"></a>
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

						<div class="policy_title_box" style="padding-bottom: 0px">
							<div class="policy_box">
								<input type="checkbox" id="wh_validation" />
								<label for="wh_validation" style="color: #e5e5e5; font-size: 13px; font-weight: 400"> 보안 표준 규정준수 검증</label>
							</div>
						</div>
						<div class="policy_title_box">
							<div class="policy_body" style="align-items: center">
								<div style="display: flex; align-items: center">
									<!-- 0707 사용자 규정준수 추가 -->
									<div class="sel_box" style="min-width: 200px; margin-right: 10px">
										<select id="cs_complicance" class="popup_sel"></select>
									</div>
									<p>Fail Controls의 갯수가</p>
									<div class="sel_box" style="min-width: 200px; margin-right: 10px">
										<select id="wh_complianceCondition" class="popup_sel">
											<option value="EQUAL" selected="selected">equals(=)</option>
											<option value="LOW">less than(&lt;)</option>
											<option value="EQUAL_LOW">less than or equals(&lt;=)</option>
											<option value="HIGH">greater than(&gt;)</option>
											<option value="EQUAL_HIGH">greater than or equals(&gt;=)</option>
										</select>
									</div>
									<div class="ipt_box" style="margin-right: 10px">
										<input type="text" id="wh_failCount" value="" class="no_radius" />
									</div>
									<p>인지 확인 합니다.</p>
								</div>
							</div>
						</div>

						<div class="policy_title_box">
							<div class="policy_box">
								<input type="checkbox" id="wh_assurenced" />
								<label for="wh_assurenced" style="color: #e5e5e5; font-size: 13px; font-weight: 400"> Assurenced Container Image 사용을 확인합니다.</label>
							</div>
						</div>

						<div class="policy_btn_box">
							<a href="javascript:lf_closeWorkLoadPolicyModal();" class="btn" style="margin-right: 30px">취소</a>
							<a href="#" id="wh_policy_add" class="btn" onclick="plusPolicyWorkload()">확인</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal_controller" style="margin: 8px">
			<a href="javascript:lf_closeWorkLoadPolicyModal();" class="close">close</a>
		</div>
	</div>

	<!-- 230201 탐지룰 관리 > 이미지 시큐리티 정책 추가 Modal -->
	<div id="imageSecurity_policy_edit" class="modal mid win_popup rec mscrollbar" style="height: 100%">
		<input type="hidden" id="editPolicyUuid" value="" />
		<h4 id="title" data-type="">컨테이너 이미지 스캔</h4>
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<div class="securitypolicy_top" style="padding-top: 0px">
					<div class="securitypolicy_top_info">
						<div class="policy_title_box" style="padding-top: 0px">
							<p class="policy_title">Rule Name</p>
							<div class="ipt_box">
								<input type="text" id="policy_rule_name" value="" placeholder="" class="no_radius" />
							</div>
							<div class="toggle_box">
								<label class="switch-button"> <input id="policy_isactive" type="checkbox" /> <span class="onoff-switch"></span>
								</label>
							</div>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Description</p>
							<div class="ipt_box">
								<input type="text" id="policy_description" value="" placeholder="" class="no_radius" />
							</div>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Registry</p>
							<div class="sel_box">
								<select id="policy_registry" class="popup_sel"></select>
							</div>
							<p class="policy_title" style="padding-left: 20px">Action</p>
							<div class="sel_box">
								<select id="policy_action" class="popup_sel">
									<option value="block" selected="selected">Deny</option>
									<option value="allow">Allow</option>
									<option value="log">Logging</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div class="securitypolicy_bottom" style="padding-top: 10px">
					<div class="securitypolicy_bottom_info">
						<dl>
							<dt>Contents</dt>
							<dd>
								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_contents" id="imageTag" value="image_tag" />
										<label for="imageTag"> 이미지 태그</label>
									</div>
									<div id="policy_image_tag" class="policy_select_box">
										<div class="policy_select_box_default">
											<select id="sel_image_tag" name="image_tag" class="policy_sel">
												<option value="LIKE" selected="selected">like</option>
												<option value="EQUAL">equals(=)</option>
												<!-- <option value="NOT_LIKE">not like</option>
												<option value="NOT_EQUAL">not equals(!=)</option> -->
												<!-- 숫자 태그인 경우에만 해당 Condition은 적용 가능 -->
												<option value="LOW">less than(&lt;)</option>
												<option value="EQUAL_LOW">less than or equals(&lt;=)</option>
												<option value="HIGH">greater than(&gt;)</option>
												<option value="EQUAL_HIGH">greater than or equals(&gt;=)</option>
											</select>
											<input id="ipt_image_tag" type="text" name="image_tag" value="" placeholder="latest" class="policy_input" />
											<a id="image_tag" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>
								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_contents" id="scriptContentsPort" value="port_num" />

										<label for="scriptContentsPort"> 포트 번호</label>
									</div>
									<div id="policy_port_num" class="policy_select_box">
										<div id="sel_image_tag" class="policy_select_box_default">
											<select id="sel_port_num" name="port_num" class="policy_sel">
												<option value="LIKE" selected="selected">like</option>
												<option value="EQUAL">equals(=)</option>
											</select>
											<input id="ipt_port_num" type="text" name="port_num" value="" placeholder="22" class="policy_input" />
											<a id="port_num" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>
								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_contents" id="scriptContentsFile" value="deploy_file" />
										<label for="scriptContentsFile"> 배포 파일에</label>
									</div>
									<div id="policy_deploy_file" class="policy_select_box">
										<div class="policy_select_box_default">
											<select id="sel_deploy_file" name="deploy_file" class="policy_sel">
												<option value="LIKE" selected="selected">like</option>
												<option value="NOT_LIKE">not like</option>
											</select>
											<input id="ipt_deploy_file" type="text" name="deploy_file" value="" placeholder="HEALTHCHEC" class="policy_input" />
											<a id="deploy_file" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>
								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_contents" id="nameVersion" value="package" />
										<label for="nameVersion"> Package</label>
									</div>
									<div id="policy_package" class="policy_select_box">
										<div class="policy_select_box_default">
											<input id="ipt_package_name" type="text" name="package_name" value="" placeholder="Name" class="policy_input" />
											<input id="ipt_package_version" type="text" name="package_version" value="" placeholder="Version" class="policy_input" />
											<a id="package" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>
								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_contents" id="license" value="license" />
										<label for="license"> License</label>
									</div>
									<div id="policy_license" class="policy_select_box">
										<div class="policy_select_box_default">
											<input id="ipt_license" type="text" name="license" value="" placeholder="GPLv2" class="policy_input" />
											<a id="license" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>Sensitive Data</dt>
							<dd>
								<div class="policy_box">
									<input type="checkbox" name="policy_sensitive_data" id="regex" value="sensitive_data" />
									<label for="regex"> 민감정보가 있는지 확인합니다.</label>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>Vulnerabilities</dt>
							<dd>
								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_vulnerabilities" id="cveId" value="cve_id" />
										<label for="cveId"> CVE의 ID가</label>
									</div>
									<div id="policy_cve_id" class="policy_select_box">
										<div class="policy_select_box_default">
											<select id="sel_cve_id" name="cve_id" class="policy_sel">
												<option value="LIKE" selected="selected">like</option>
												<option value="EQUAL">equals(=)</option>
											</select>
											<input id="ipt_cve_id" type="text" name="cve_id" value="" placeholder="" class="policy_input" />
											<a id="cve_id" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>

								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_vulnerabilities" id="severity" value="cve_severity" />
										<label for="severity"> CVE의 Severity가</label>
									</div>
									<div id="policy_cve_severity" class="policy_select_box">
										<div class="policy_select_box_default">
											<select id="sel_cve_severity" name="cve_severity" class="policy_sel">
												<option value="EQUAL" selected="selected">equals(=)</option>
												<option value="LOW">less than(&lt;)</option>
												<option value="EQUAL_LOW">less than or equals(&lt;=)</option>
												<option value="HIGH">greater than(&gt;)</option>
												<option value="EQUAL_HIGH">greater than or equals(&gt;=)</option>
											</select>
											<select id="sel_cve_severity_level" name="cve_severity_level" class="policy_sel">
												<option value="Critical">Critical</option>
												<option value="High">High</option>
												<option value="Medium">Medium</option>
												<option value="Low">Low</option>
												<option value="Negligible">Negligible</option>
												<option value="Unknown">Unknown</option>
											</select>
											<a id="cve_severity" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>

								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_vulnerabilities" id="cvssVersionBaseScore" value="cvss_score" />
										<label for="cvssVersionBaseScore"> CVSS(V3) 의 Score가</label>
									</div>
									<div id="policy_cvss_score" class="policy_select_box">
										<div class="policy_select_box_default">
											<select id="sel_cvss_score" name="cvss_score" class="policy_sel">
												<option value="EQUAL" selected="selected">equals(=)</option>
												<option value="LOW">less than(&lt;)</option>
												<option value="EQUAL_LOW">less than or equals(&lt;=)</option>
												<option value="HIGH">greater than(&gt;)</option>
												<option value="EQUAL_HIGH">greater than or equals(&gt;=)</option>
											</select>
											<input id="ipt_cvss_score" type="text" name="cvss_score" value="" placeholder="" class="policy_input" />
											<a id="cvss_score" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>

								<div class="policy_box">
									<div class="policy_checklable_box">
										<input type="checkbox" name="policy_vulnerabilities" id="cvssVersionVector" value="cvss_vector" />
										<label for="cvssVersionVector"> CVSS(V3)의 Vector가 </label>
									</div>
									<div id="policy_cvss_vector" class="policy_select_box">
										<div class="policy_select_box_default">
											<select id="sel_cvss_vector" name="cvss_vector" class="policy_sel">
												<option value="LIKE" selected="selected">like</option>
												<option value="EQUAL">equals(=)</option>
											</select>
											<input id="ipt_cvss_vector" type="text" name="cvss_vector" value="" placeholder="" class="policy_input" />
											<a id="cvss_vector" class="btn icon add" onclick="plusInput(this.id)"></a>
											<p>인지 확인합니다.</p>
										</div>
									</div>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>Malwares</dt>
							<dd>
								<div class="policy_box">
									<input type="checkbox" name="policy_malwares" id="malware" value="malwares" />
									<label for="malware"> 악성코드가 존재하는지 확인합니다.</label>
								</div>
							</dd>
						</dl>
						<div class="policy_btn_box">
							<a href="javascript:lf_closeImageSecurityPolicyModal();" class="btn" style="margin-right: 30px">취소</a>
							<a href="#" class="btn" onclick="plusPolicy()">확인</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal_controller" style="margin: 8px">
			<a href="javascript:lf_closeImageSecurityPolicyModal();" class="close">close</a>
		</div>
	</div>

	<div id="policy_edit" class="modal mid win_popup rec mscrollbar" style="height: 100%">
		<h4 id="title" data-type=""></h4>
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<div class="securitypolicy_top">
					<h5>revision 정보</h5>
					<div class="securitypolicy_top_info">
						<dl>
							<dt>revision</dt>
							<dd>
								<div class="rev">
									<div id="rev"></div>
									<div id="nol" class="info nol none" title="기본정책">기본정책</div>
									<div id="ind" class="info ind none" title="개별정책">개별정책</div>
									<a href="#" class="btn bline rev_list_btn">
										<span>대상 선택</span>
									</a>
									<ul id="rev_list" class="rev_list mscrollbar">
										<!-- li>
											<a href="#">
												<div class="rev fl">
													<div>rev 362</div>
													<div class="info nol" title="기본정책">기본정책</div>
													<div class="info pol" title="정책적용됨">정책적용됨</div>
												</div>
												<p class="fl">
													<span>12</span>대 / 생성시간 : <span>2020-11-06 12:23</span> / 등록 사용자 : <span>이종화</span>(<span>jonghlee</span>) / <span>2020년 4분기 정기 업데이트 담당자 : 오인수 사원</span>
												</p>
											</a>
										</li -->
									</ul>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>사용자 및 생성시간</dt>
							<dd>
								<span id="userid"></span> / <span id="createtime"></span>
							</dd>
						</dl>
						<dl>
							<dt>변경 사항</dt>
							<dd>
								<div class="ipt_box">
									<input type="text" id="description" name="description" value="" placeholder="변경사항을 입력하여 주십시오." class="no_radius" />
								</div>
							</dd>
						</dl>
					</div>
					<div class="securitypolicy_btn">
						<div class="sel_box fr">
							<select id="mode" name="mode" class="mid">
								<option value="3" selected="selected">ON</option>
								<option value="0">OFF</option>
							</select>
						</div>
					</div>
				</div>
				<div class="securitypolicy_bottom">
					<h5>룰 편집</h5>
					<div class="securitypolicy_bottom_info">
						<!-- div class="ips_rule edit">
							<textarea></textarea>
						</div -->
						<div id="rule_edit" class="tbl moving">
							<!-- table class="click">
								<colgroup>
									<col width="10%">
									<col width="12%">
									<col width="auto">
									<col width="15%">
								</colgroup>
								<thead>
									<tr>
										<th>우선순위</th>
										<th>모드</th>
										<th>파일</th>
										<th>관리</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<div class="move_icon">1</div>
										</td>
										<td class="long_w">ON</td>
										<td class="long_w tl">/tmp/mcliZokhb</td>
										<td class="long_w">
											<div>
												<a class="btn icon del">룰 삭제</a>
												<a class="btn icon edit">룰 편집</a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="move_icon">2</div>
										</td>
										<td class="long_w">ON</td>
										<td class="long_w tl">/tmp/mclzaKmfa</td>
										<td class="long_w">
											<div>
												<a class="btn icon del">룰 삭제</a>
												<a class="btn icon edit">룰 편집</a>
											</div>
										</td>
									</tr>
	 							</tbody>
							</table -->
						</div>
						<div class="equiplist_search">
							<div class="search_cont">
								<div class="sel_box fl">
									<select name="equipSearch" class="">
										<option value="equipname" selected="selected">장비명</option>
										<option value="masterip">장비IP</option>
										<option value="osver">비고</option>
									</select>
								</div>
								<div class="ipt_box fl">
									<input type="text" placeholder="장비를 검색하여 주십시오" name="equipKeyword" />
									<a href="#" class="" rel="equip_search_btn">장비 검색</a>
								</div>
							</div>
							<a href="#" class="btn grey">검색 초기화</a>
						</div>
						<div class="equiplist tbl">
							<table class="click">
								<colgroup>
									<col width="8%" />
									<col width="25%" />
									<col width="auto" />
									<col width="35%" />
								</colgroup>
								<thead>
									<tr>
										<th>
											<div class="chk_box">
												<input type="checkbox" name="all_checkbox" id="chk00" value="" />
												<label for="chk00"></label>
											</div>
										</th>
										<th>장비IP</th>
										<th>장비명</th>
										<th>비고</th>
									</tr>
								</thead>
								<tbody id="equip_list">
									<!-- tr>
										<td>
											<div class="chk_box">
												<input type="checkbox" name="checkbox_list" id="check01" value="">
												<label for="check01"></label>
											</div>
										</td>
										<td class="long_w tl">000.000.000.000</td>
										<td class="long_w tl">None</td>
										<td class="long_w tl">None</td>
									</tr>
									<tr>
										<td>
											<div class="chk_box">
												<input type="checkbox" name="checkbox_list" id="check02" value="">
												<label for="check02"></label>
											</div>
										</td>
										<td class="long_w tl">192.168.2.10</td>
										<td class="long_w tl">General</td>
										<td class="long_w tl">General</td>
									</tr -->
								</tbody>
							</table>
						</div>
					</div>
					<div class="securitypolicy_btn">
						<div class="btn_wrap fr">
							<a href="#" class="btn" rel="process_view_btn" style="display: none">조회</a>
							<a href="#" class="btn" rel="policy_edit_btn">업데이트</a>
							<a href="#" class="btn securitypolicy_add_btn policy_option" style="display: none">
								<span>옵션</span>
							</a>
							<a href="#" class="btn bline securitypolicy_add_btn policy_body" rel="rule_add_btn" style="display: none">
								<span>정책추가</span>
							</a>
						</div>
					</div>
					<div id="rule_add" class="securitypolicy_add">
						<!-- dl>
							<dt>화이트/블랙 리스트</dt>
							<dd>
								<div class="w50">
									<div class="sel_box">
										<select class="popup_sel">
											<option>ON</option>
											<option>OFF</option>
										</select>
									</div>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>모드</dt>
							<dd>
								<div class="w50">
									<div class="sel_box">
										<select class="popup_sel">
											<option>ON</option>
											<option>OFF</option>
										</select>
									</div>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>파일</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text"
										placeholder="파일의 전체 경로를 작성해주세요." name="required">
								</div>
							</dd>
						</dl>
						<div class="btn_wrap fr">
							<a href="#" class="btn grey securitypolicy_add_btn">취소</a> <a
								href="#" class="btn">추가</a>
						</div -->
					</div>
				</div>
			</div>
		</div>
		<div class="modal_controller">
			<a href="javascript:lf_closePolicyEditModal();" class="close">close</a>
		</div>
	</div>

	<div id="policy_hist" class="modal mid win_popup rec mscrollbar" style="height: 100%">
		<input type="hidden" id="policyData" value="" />
		<h4 id="title"></h4>
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<div class="securitypolicy_top">
					<h5>자산 정보</h5>
					<div class="securitypolicy_top_info">
						<dl>
							<dt>자산이름 및 IP</dt>
							<dd id="equipname"></dd>
						</dl>
						<dl>
							<dt>등록일시</dt>
							<dd id="registertime"></dd>
						</dl>
						<dl>
							<dt>OS</dt>
							<dd id="equipname"></dd>
						</dl>
					</div>
					<div class="securitypolicy_btn">
						<div class="sel_box fr" style="width: 150px">
							<select id="policyType" class="wide" style="width: 150px">
								<option value="ips" selected="selected">침입방지시스템</option>
								<option value="firewall">방화벽</option>
								<option value="malware">멀웨어</option>
								<option value="fileint">파일무결성</option>
								<option value="appctl">실행 파일 통제</option>
								<option value="pamacl">서비스 제어</option>
							</select>
						</div>
					</div>
				</div>
				<div class="securitypolicy_bottom">
					<h5>정책 정보</h5>
					<div class="securitypolicy_bottom_info">
						<dl>
							<dt>revision</dt>
							<dd>
								<div class="rev">
									<div id="rev"></div>
									<div id="nol" class="info nol none" title="기본정책">기본정책</div>
									<div id="ind" class="info ind none" title="개별정책">개별정책</div>
									<!-- div id="pol" class="info pol none" title="정책적용됨">정책적용됨</div -->
									<a href="#" class="btn bline rev_list_btn">
										<span>대상 선택</span>
									</a>
									<ul id="rev_list" class="rev_list mscrollbar">
										<!-- li>
											<a href="#">
												<div class="rev fl">
													<div>rev 362</div>
													<div class="info nol none" title="기본정책없음">기본정책없음</div>
													<div class="info ind none" title="개별정책없음">개별정책없음</div>
													<div class="info pol none" title="정책적용안됨">정책적용안됨</div>
												</div>
												<p class="fl">
													<span>12</span>대 / 생성시간 : <span>2020-11-06 12:23</span> / 등록 사용자 : <span>이종화</span>(<span>jonghlee</span>) / <span>2020년 	4분기 정기 업데이트 담당자 : 오인수 사원</span>
												</p>
											</a>
										</li -->
									</ul>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>사용자 및 생성시간</dt>
							<dd>
								<span id="userid"></span> / <span id="createtime"></span>
							</dd>
						</dl>
						<div class="history mscrollbar" style="height: 125px">
							<ul id="rev_history">
								<!-- li>
									<dl>
										<dt>
											<em>rev 201</em> <span>(<em>change</em>)</span>
										</dt>
										<dd>
											<span>2020-11-12 08:02</span>
										</dd>
									</dl>
								</li -->
							</ul>
						</div>
						<div>
							<dl>
								<dt>변경 사항</dt>
								<dd>
									<div class="ipt_box">
										<input type="text" id="description" name="description" value="" placeholder="변경사항을 입력하여 주십시오." class="no_radius" readonly />
										<br />
									</div>
								</dd>
							</dl>
						</div>
						<div id="policy_option">
							<!-- dt>2차인증</dt>
							<dd>
								<div class="w50">
									<div class="sel_box">
										<select name="twofactor" class="popup_sel disabled">
											<option value="0">비활성화</option>
											<option value="1">활성화</option>
										</select>
									</div>
								</div>
							</dd-->
						</div>
						<div id="policy_table" class="table">
							<!-- div class="tbl">
								<table class="" style="width: 100%">
									<colgroup>
										<col width="25%">
										<col width="25%">
										<col width="20%">
										<col width="20%">
										<col width="auto">
									</colgroup>
									<thead>
										<tr>
											<th>출발지</th>
											<th>도착지</th>
											<th>프로토콜</th>
											<th>액션</th>
											<th>비고</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="long_w tl" title="000.000.000.000:0000">000.000.000.000:0000</td>
											<td class="long_w tl" title="000.000.000.000:0000">000.000.000.000:0000</td>
											<td class="long_w">TCP</td>
											<td class="long_w">Allowed</td>
											<td class="long_w tl">Web</td>
										</tr>
									</tbody>
								</table>
							</div -->
						</div>
						<div id="policy_textarea" class="ips_rule edit">
							<!-- textarea></textarea -->
						</div>
					</div>
					<div class="securitypolicy_btn">
						<div class="sel_box fr">
							<select id="mode" name="mode" class="mid disabled">
								<option value="3" selected="selected">ON</option>
								<option value="0">OFF</option>
							</select>
						</div>
						<div class="btn_wrap fr">
							<a href="#" rel="policy_edit_btn" class="btn">업데이트</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal_controller">
			<a href="javascript:lf_closePolicyHistModal();" class="close">close</a>
		</div>
	</div>
</body>
</html>
