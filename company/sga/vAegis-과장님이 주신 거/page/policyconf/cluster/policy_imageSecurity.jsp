<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html lang="ko">
<head>
<title>컨테이너 이미지 스캔 - cAegis</title>
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
<script defer src="./js/service/securityPolicy/policyImageSecurity.js?v=${version}"></script>
<script defer src="./js/service/securityPolicy/policyImageAssurance.js?v=${version}"></script>
<script type="text/javascript">
	$(document).ready(function() {
		$('#imageSecurity_policy_table').DataTable({
			autoWidth : false,
			paging : true,
			pagingType : 'full_numbers',
			//"ordering": true,
			order : [],
			columnDefs : [{
				targets : [ 9 ],
				orderable : false,
			},
			{				
				targets : [1,2,3,4,5,6,7,8], 
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
		<jsp:param name="menuId" value="policyImageSecurity" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="policyImageSecurity" />
	</jsp:include>

	<input type="hidden" id="checkedAgentList" name="checkedAgentList" />
	<input type="hidden" id="editRuleIdx" name="editRuleIdx" />
	<input type="hidden" id="checkDef" name="0" />

	<section class="securitypolicy_page mscrollbar">
		<div class="sub">
			<div class="securitypolicy_box">
				<div id="registry_policy_title" class="securitypolicy_title cluster_policy_title">
					<div class="securitypolicy_title_left">
						<h3>컨테이너 이미지 스캔</h3>
						<dl class="fl">
							<dt>총개수</dt>
							<dd id="registry_policy_cnt"></dd>
						</dl>
					</div>
					<div class="securitypolicy_title_middle cluster_policy_title_middle">
						<div class="fl">
							<div class="event_sel">
								<div class="sel_box">
									<select id="selectRegistryUuid" onchange="updateTableByRegistry()" class="wide event cluster_selecteBox">
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
							<a id="policyUpdate" href="#" class="btn" rel="imageSecurity_policy_add" name="imageSecurity">정책추가</a><!--//2024-01-16 line def 클래스 삭제-->
							<a id="policyUpdate" href="#" class="btn" rel="imageAssurance_policy_edit" name="">이미지 보증 설정</a><!--//2024-01-16 line def 클래스 삭제-->
						</div>
					</div>
				</div>
				<div id="imageSecurityTbl" class="tbl">
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
			</div>
		</div>
	</section>
	<!-- 230904 정책관리 > 클러스터 정책 > 컨테이너 이미지 보증 설정 Modal -->
	<div id="imageAssurance_policy_edit" class="modal" style="width:600px; height: 400px;">
				<div class="assurance_container">
					<div class="assurance_container_box">
						<div class=assurance_row>
							<div class="assurance_item_x">
					        	<input type="checkbox" name="" id="assuranceMalware" value="" />
								<label for="assuranceMalware"></label>
								<div class="assurance_item_y">
									<div class="assurance_malware" onclick="" id=""></div>
									<p>Malware</p>
								</div>
					        </div>
					        <div class="assurance_item_x">
								<input type="checkbox" name="" id="assuranceSensitive" value="" />
								<label for="assuranceSensitive"></label>
								<div class="assurance_item_y">
									<div class="assurance_sensitive" onclick="" id=""></div>
									<p>Sensitive Data</p>
								</div>
					        </div>
						</div>
						<div class="assurance_row">
							<div class="assurance_item_x">
								<input type="checkbox" name="" id="assuranceCve" value="" />
								<label for="assuranceCve"></label>
								<div class="assurance_item_y">
									<div class="assurance_cve" onclick="" id=""></div>
									<p>CVE Blacklist</p>
								</div>
							</div>
					        <div class="assurance_item_x">
					        	<input type="checkbox" name="" id="assuranceScan" value="" />
								<label for="assuranceScan"></label>
								<div class="assurance_item_y">
									<div class="assurance_scan" onclick="" id=""></div>
									<p>Image Scanned</p>
								</div>
					        </div>
						</div>
					</div>
					<div class="policy_btn_box" style="padding: 0px;">
						<a href="javascript:lf_closeImageAssurancePolicyModal();" class="btn" style="margin-right:30px">취소</a>
						<a href="#" class="btn" onclick="editImageAssurancePolicy()">확인</a>
					</div>
			    </div>
	</div>
	
	<!-- 230201 정책관리 > 클러스터 정책 >  컨테이너 이미지 스캔 정책 추가 Modal -->
	<div id="imageSecurity_policy_edit" class="modal mid win_popup rec" style="height: 100%"><!-- 2024-01-16 : mscrollbar 클래스 삭제-->
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
											<input id="ipt_deploy_file" type="text" name="deploy_file" value="" placeholder="HEALTHCHECK" class="policy_input" />
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
							<a href="javascript:lf_closeImageSecurityPolicyModal();" class="btn line">취소</a><!--2024-01-16 :  style="margin-right: 30px" 스타일 삭제, line 클래스 추가-->
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
</body>
</html>
