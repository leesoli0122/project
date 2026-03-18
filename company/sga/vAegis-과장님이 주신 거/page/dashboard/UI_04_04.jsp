<%@page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta http-equiv="Content-Security-Policy"
	content="upgrade-insecure-requests" />

<title>클러스터 규정준수 스캔 - Aegis</title>
<meta charset="UTF-8" http-equiv="Content-Type">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0">
<meta name="mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no" />

<!-- TODO: search engine info -->
<meta name="robots" content="Aegis" />
<meta name="keywords" content="Aegis" />
<meta name="title" content="Aegis" />
<meta name="description" content="Aegis" />

<!-- TODO: social url link image -->
<meta property="og:url" content="">
<meta property="og:title" content="Aegis">
<meta property="og:type" content="website">
<meta property="og:image" content="">
<meta property="og:description" content="Aegis 홈페이지입니다.">

<!-- TODO: favicon -->
<link rel="icon" href="/assets/images/favicon.png" type="image/png" />

<!-- TODO: import -->
<%@ include file="/page/layout/common_sample.jsp"%>

<script src="/js/service/securityPolicy/policyComplianceScan.js?v=${version}"></script>

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
		<jsp:param name="menuId" value="policyComplianceScan" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="policyComplianceScan" />
	</jsp:include>
	<div class="modal small" style="width:470px;" id="policyComplianceScan_modal" tabindex="0"
		style="display: none; margin-left: auto; margin-top: auto;">
		<div class="modal_header">
			<h3>다른이름으로 저장</h3>
		</div>
		<div class="modal_body">
			<div class="modal_cont">
				<table class="policy_cs_compliance_modal_table">
					<tr>
						<td>Cluster</td>
						<td class="second">
							<div class="sel_box width_fix_300 scrolldelete">
								<select
									onchange="clusterChangePolicyComplianceScanModal(this.value)"
									id="clusterListModal" class="popup_sel">
									<option>클러스터</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<td>Framework Name</td>
						<td class="second"><input id="saveAsName" type="text" /></td>
					</tr>
					<tr>
						<td>Description</td>
						<td class="second"><input id="saveAsDescription" type="text" /></td>
					</tr>
					<tr>
						<td>Version</td>
						<td class="second"><input id="saveAsVersion" type="text" /></td>
					</tr>
				</table>
			</div>
		</div>
		<div class="modal_footer">
			<a href="javascript:closePolicyComplianceScanModal();"
				class="btn grey">취소</a> <a
				href="javascript:saveAsPolicyComplianceScan();" class="btn">저장</a>
		</div>
		<div class="modal_controller">
			<a href="#" class="close">close</a>
		</div>
	</div>
	<section id="loadingSpot" class="computer_page compliance_scan"><!--compliance_scan 클래스 추가, mscrollbar 삭제-->
		<div class="sub">
			<div class="policy_cs_compliance_sub_bar wrap">
				<div id="policy_cs_compliance_sub_bar_center"
					class="policy_cs_compliance_sub_bar center">
					<div class="computer_box manager">
						<div class="policy_cs_compliance_div">
							<ul class="top_ul">
								<li class="policy_top_menu_line first" style="width:200px;">
									<div class="sel_box width_fix_100_percentage">
										<select id="clusterList"
											onchange="requestList(this.value,'cluster');">
											<option>클러스터</option>
										</select>
									</div>
								</li>
								<li class="policy_top_menu_line second" style="width:250px;">
									<div class="sel_box width_fix_100_percentage">
										<select id="frameWorkList"
											onChange="requestList(this.value,'frameWork');">
											<option value="allFrameWork">All</option>
										</select>
									</div>
								</li>
								<li class="policy_top_menu_line near third">
									<div class="fl">
										<div class="ipt_box">
											<input class="top_menu_input_text" type="text" id="reSearchText"
											placeholder="Name, Description 검색 키워드를 입력해주십시오." style="width:400px;">
										</div>
										<a class="btn serch" onclick="reSearchGroupOrControls();" href="#"></a>
									</div>
								</li>
								<li class="policy_top_menu_line right">
									<p class="kebabMenuStyleUl" onclick="importControlMenu();">펼치기</p>
									<!--<ul class="kebabMenuStyleUl">
										<li onclick="importControlMenu();">.</li>
										<li onclick="importControlMenu();">.</li>
										<li onclick="importControlMenu();">.</li>
									</ul>-->
								</li>
								<li class="policy_top_menu_line near right"><a href="#"
									rel="policyComplianceScan_modal" class="btn modalLoad">다른이름으로
										저장</a></li>
								<li class="policy_top_menu_line near right"><a
									href="javascript:savePolicyComplianceScan();" class="btn">저장</a></li>


							</ul>
						</div>
						<div id="frameWorkListBox"></div>
					</div>
				</div>
				<div class="policy_cs_compliance_sub_bar side">
					<div id="policy_cs_compliance_sub_bar_side">
						<div class="policy_cs_compliance_sub_bar title">Import
							Control</div>
						<div class="policy_cs_compliance_sub_bar contents">
							<ul>

							</ul>
						</div>
					</div>
				</div>
			</div>

		</div>
	</section>

	
</body>
</html>