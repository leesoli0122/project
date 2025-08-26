<%@page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Security-Policy"
	content="upgrade-insecure-requests" />

<title>자산 관리 - Aegis</title>
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
<link rel="icon" href="./assets/images/favicon.png" type="image/png" />

<!-- TODO: import -->
<%@ include file="/page/layout/common_sample.jsp"%>

<style>
.scroll-wrapper {
	width: 550px;
}

.cs_timer_option {
	display: flex
}

.cs_timer_option_title {
	float: left;
	width: 147px;
	padding: 12px 18px;
	color: #ddd;
	font-size: 13px;
	font-weight: 400;
}

.cluster_auto_scan_select {
	width: 100px !important;
}

.btn_wrap {
	width: 100% !important;
}

.container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 300px;
	margin: 0 auto;
	padding: 20px;
}

.list-container {
	display: flex;
	align-items: center;
}

.list-container span {
	display: inline-block;
	padding: 10px;
	background-color: #f0f0f0;
	margin-right: 5px;
}

.scan_framework_buttons {
	display: flex;
	flex-direction: column;
	margin: 0 20px;
}

.scan_framework_button {
	cursor: pointer;
	margin: 5px 0;
	padding: 5px 10px;
	background-color: #2e6fd4;;
	color: #fff;
	border: none;
	border-radius: 5px;
	width: 25px;
}

.scan_activate_container {
	display: flex;
	align-items: center;
	/* width: calc(100% - 136px); */
}

.cs_option.activate_framework {
	display: flex;
}

.scan_framework_container {
	font-family: 'Noto Sans KR', sans-serif;
	width: 100%;
	min-height: 34px;
	line-height: 32px;
	font-size: 13px;
	font-weight: 400;
	background: #2f3742;
	border: 1px solid #565d68;
	height: 140px;
}

.scan_framework_placeholder {
	color: #676e79;
	padding: 0px 10px;
}

.scan_able_list, .scan_target_list {
	cursor: pointer;
	padding: 0px 10px;
}

.scan_able_list.selected, .scan_target_list.selected {
	background: #2e6fd4;
}

.computer_box_right .edit {
	height: 100% !important;
	min-height: 76.8vh;
}

.scroll-wrapper {
	width: 100% !important;
}

.switch-button {
	display: flex;
	align-items: center;
	flex-direction: row-reverse;
}

.scan_framework_container.disabled {
	background-color: #3a3d42;
	color: #666;
	border: 1px solid #555;
	cursor: unset;
}

.scan_framework_buttons.disabled button {
	background-color: #3a3d42;
	color: #666;
	border: 1px solid #555;
	cursor: unset;
}

.webhook_option {
	max-width: 950px;
}

.webhook_option li {
	margin-bottom: 3px;
}

hr {
	display: block !important;
	margin-bottom: 0px !important;
	border-top: 1px solid #7a91b7 !important;
}

.hidden {
	display: none !important;
}

.edit_line {
	display: block;
	width: 100%;
	height: 26px;
	background: #2f3742;
}

.edit_box {
	border: 1px solid #161b22;
}

.edit_box_no_border {
	border: none !important;
}

.edit_no_border {
	border: none !important;
}
</style>
<script src="./js/service/cloud/cloudRegistry.js?v=${version}"></script>
<script
	src="./js/service/cloud/containerSecurity/cloudClusterDisplay.js?v=${version}"></script>
<script
	src="./js/service/cloud/containerSecurity/cloudClusterSaveAndEdit.js?v=${version}"></script>
<script defer src="./js/service/cloud/cloudManager.js?v=${version}"></script>
<script>
	$(document)
			.ready(
					function() {
						$(document).on(
								"click",
								".scan_target_list",
								function() {
									if (!($('.scan_framework_container')
											.hasClass("disabled"))) {
										$(".scan_able_list").removeClass(
												"selected");
										$(this).toggleClass("selected");
									}
								});
						$(document).on(
								"click",
								".scan_able_list",
								function() {
									if (!($('.scan_framework_container')
											.hasClass("disabled"))) {
										$(".scan_target_list").removeClass(
												"selected");
										$(this).toggleClass("selected");
									}
								});

						$("#moveRightButton")
								.on(
										"click",
										function() {
											var selectedElements = $("#scanAbleFramework .scan_able_list.selected");
											//console.log(item.attributes.value.value);
											if (selectedElements.length > 0) {
												selectedElements
														.removeClass("scan_able_list");
												selectedElements
														.addClass("scan_target_list");
												$("#scanTargetFramework")
														.append(
																selectedElements);
											}
											$('#scanTargetFramework')
											.mCustomScrollbar("destroy");
											mscrollbar();
											showPlaceholderIfNeeded();
										});
						$("#moveLeftButton")
								.on(
										"click",
										function() {
											var selectedElements = $("#scanTargetFramework .scan_target_list.selected");
											if (selectedElements.length > 0) {
												selectedElements
														.removeClass("scan_target_list");
												selectedElements
														.addClass("scan_able_list");
												$("#scanAbleFramework").append(
														selectedElements);
											}
											$('#scanAbleFramework')
											.mCustomScrollbar("destroy");
											mscrollbar();
											showPlaceholderIfNeeded();
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

	<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="cloudManager" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="cloudManager" />
	</jsp:include>

	<input type="hidden" id="hardwareid" name="hardwareid" value="">

	<section class="computer_page scroll_no"><!-- 2024-01-25 : mscrollbar 제거 및 scroll_no 클래스 추가-->
		<div class="sub">
			<div class="content_wrap">
				<div class="computer_box manager">
					<div class="computer_box_left cloud_manager_computer_box_left">
						<div id="Tree01" class="content tree">
							<div class="tree_wrap">
								<ul>
									<li id="G0000000000000"
										data-jstree='{ "cloudid"="G0000000000000", "opened" : true, "state" : "open" }'>Aegis</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="computer_box_right cloud_manager_computer_box_right scroll_yes"><!-- 2024-01-25 : scroll_yesn 클래스 추가-->
						<div class="tit_wrap">
							<div class="fl">
								<a id="addGroupBtn" href="#" class="btn createGroup">그룹추가</a> <a
									id="modifyGroupBtn" href="#" class="btn renameGroup">그룹수정</a> <a
									id="removeGroupBtn" href="#" class="btn deleteGroup">그룹삭제</a> <a
									id="addBtn" href="#" class="btn create2 ative_edit">자산추가</a> <a
									id="modifyBtn" href="#" class="btn ative_edit"
									style="display: none;">자산수정</a> <a id="removeBtn" href="#"
									class="btn grey delete" style="display: none;">자산삭제</a>
							</div>
						</div>
						<div class="edit" id="loadingSpot">
							<div class="info">
								<ul>
									<li>
										<dl>
											<dt>소속그룹</dt>
											<dd id="groupname_view"></dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>등록일</dt>
											<dd id="registertime_view"></dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>최종 변경일</dt>
											<dd id="modifytime_view"></dd>
										</dl>
									</li>
									<li class="host_option cs_option">
										<dl>
											<dt>타입</dt>
											<dd id="type_view"></dd>
										</dl>
									</li>
									<!-- Registry -->
									<li class="registry_option">
										<dl>
											<dt>Vendor</dt>
											<dd id="vendor_view"></dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>자산명</dt>
											<dd id="equipmarkname_view"></dd>
										</dl>
									</li>
									<li class="host_option cs_option">
										<dl>
											<dt>자산위치</dt>
											<dd id="equiplocation_view"></dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt class="host_option">IP</dt>
											<dt class="registry_option cs_option">IP (도메인명)</dt>
											<dd id="masterip_view"></dd>
										</dl>
									</li>
									<li class="host_option cs_option">
										<dl>
											<dt>OS</dt>
											<dd id="osver_view"></dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>제조사</dt>
											<dd id="company_view"></dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>장비관련주체</dt>
											<dd id="manager_view"></dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>자산 연동 여부</dt>
											<dd id="groupname_view"></dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>자산 연동 서버</dt>
											<dd id="service_state_view"></dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>로그 수집 여부</dt>
											<dd id="log_state_view"></dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>초당 로그 수집 건수</dt>
											<dd id="log_count_view"></dd>
										</dl>
									</li>

									<li class="registry_option">
										<dl>
											<dt>자동 분석 여부</dt>
											<dd id="auto_scan_view"></dd>
										</dl>
									</li>
									<li class="registry_option">
										<dl>
											<dt>ID</dt>
											<dd id="registry_id_view"></dd>
										</dl>
									</li>
									<li class="registry_option">
										<dl>
											<dt>Password</dt>
											<dd id="registry_pw_view"></dd>
										</dl>
									</li>
									<li class="regv03" style="display: none; height: 95px;">
										<dl>
											<dt>OAuth Token</dt>
											<dd>
												<textarea id="oauth_token_view" style="" readonly></textarea>
											</dd>
										</dl>
									</li>
									<li class="registry_option" style="height: 95px;">
										<dl>
											<dt>인증서</dt>
											<dd>
												<textarea id="is_registered_tls_cert_view" style="" readonly></textarea>
											</dd>
										</dl>
									</li>
									<li class="registry_option"
										style="display: flex; border-bottom: 0;">
										<dl>
											<dt>인증서 유효기간</dt>
											<!-- <dd style="padding: 0;">
											<textarea id="is_registered_tls_cert_expiration_date_view" style="height:40px!important;" readonly></textarea>
										</dd> -->
											<dd id="is_registered_tls_cert_expiration_date_view"></dd>
										</dl>

										<dl
											style="display: flex; align-items: center; justify-content: flex-start; flex-direction: row-reverse;">
											<!-- <dt style="width: auto !important">Valid</dt> -->
											<dt style="width: auto !important"
												class="is_registryed_tls_status_text hidden">Valid</dt>
											<dd id="is_registered_tls_status_view"
												style="width: auto !important;"></dd>
										</dl>
									</li>

									<!-- containerSecurity> Cluster -->
									<li class="cs_option" style="height: 50px;">
										<dl>
											<dt>인증서 상태</dt>
											<dd id="cluster_tls_cert_status_view"></dd>
										</dl>
									</li>
									<li class="cs_option" style="height: 50px;">
										<dl>
											<dt>인증서 만료기간</dt>
											<dd id="cluster_tls_expire_date"></dd>
										</dl>
									</li>
									<li class="cs_option cs_crt" style="height: 95px;">
										<dl>
											<dt>CA 인증서</dt>
											<dd>
												<textarea id="cluster_tls_cert_view" style="" readonly></textarea>
											</dd>
										</dl>
									</li>
									<li class="cs_option cs_crt" style="height: 90px;">
										<dl>
											<dt>Auth Token</dt>
											<dd>
												<textarea id="cluster_auth_token_view" style="" readonly></textarea>
											</dd>
										</dl>
									</li>
									<li class="cs_option webhook_option_view" style="display: flex">
										<dl>
											<dt>웹훅 서버</dt>
											<dd id="cluster_webhook_server_view"></dd>
										</dl>
									</li>
									<li class="cs_option webhook_option_view">
										<dl>
											<dt>웹훅 서버 타임아웃</dt>
											<dd id="cluster_webhook_server_timeout_view"></dd>
										</dl>
									</li>
									<li class="cs_option" style="height: 50px;">
										<dl>
											<dt>웹훅 서버 연동</dt>
											<dd id="cluster_webhook_status_view"></dd>
										</dl>
									</li>
									<li class="cs_option webhook_option_view" style="height: 50px;">
										<dl>
											<dt>규정 준수 스캔 자동 실행</dt>
											<dd id="cluster_auto_scan_cycle_view"></dd>
										</dl>
									</li>
									<li class="cs_option webhook_option_view" style="height: 90px;">
										<dl>
											<dt>규정 준수 스캔 프레임워크 활성화</dt>
											<dd>
												<div id="compliance_framework_list_view"
													style="overflow: auto; min-height: 70px; background-color: #3a3d42; color: #bbb; border: 1px solid #555;"></div>
											</dd>
										</dl>
									</li>
								</ul>
							</div>
							<div class="edit_box">
								<ul>
									<li style="display: none">
										<dl>
											<dt>editOrAdd</dt>
											<dd>
												<div>
													<!-- true일 경우 edit모드 false일경우 insert모드 -->
													<input class="no_radius" type="text" id="editCheck"
														name="editCheck" value="true">
												</div>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>소속그룹</dt>
											<dd>
												<div class="sel_box">
													<select id="groupid" name="groupid" class="popup_sel"
														onChange="typeChange(this.value)">
														<option disabled selected value="">선택</option>
													</select>
												</div>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>등록일</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="registertime"
														name="registertime" value="" readonly>
												</div>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>최종 변경일</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="modifytime"
														name="modifytime" value="" readonly>
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option cs_option">
										<dl>
											<dt>타입</dt>
											<dd>
												<div class="sel_box">
													<select id="type" name="type" class="popup_sel"
														onChange="optionChange()" required>
														<option value="" disabled selected style="display: none">Host
															Security or Container Security or Registry</option>
														<option disabled selected value="Registry">Registry</option>
														<option disabled selected value="HostSecurity">HostSecurity</option>
														<option disabled selected value="ContainerSecurity">ContainerSecurity</option>
													</select>
												</div>
											</dd>
										</dl>
									</li>
									<!-- Registry 용 -->
									<!-- <li class="registry_option" style="display: none;">
									<dl>
										<dt>타입</dt>
										<dd style="display: flex;">
											<div class="sel_box" style="flex:1;">
												<select id="registry_type" name="registry_type" class="popup_sel" onChange="registryTypeChange()" required>
													<option selected  value="PUBLIC">Public</option>
													<option value="PRIVATE">Private</option>
												</select>
											</div> 
											<div class="ipt_box" style="flex: 5;">
												<input class="no_radius" type="text"  name="registry_type" value="Registry" readonly>
											</div>
										</dd>
									</dl>
								</li> -->
									<li class="registry_option" style="display: none;">
										<dl>
											<dt>Vendor</dt>
											<dd style="display: flex;">
												<div class="sel_box" style="flex: 1;">
													<select id="vendor" name="vendor" class="popup_sel"
														onChange="vendorChange()">
														<option value="REGV01">Docker Registry</option>
														<option value="REGV02" selected>Docker Private
															Registry</option>
														<option value="REGV03">Red Hat Quay</option>
														<option value="REGV04">Google Container Registry</option>
														<option value="REGV05">Naver Container Registry</option>
														<option value="REGV06">Amazone ECR</option>
														<option value="REGV07">Microsoft ACR</option>
														<option value="REGV20">SuSe Portus</option>
														<option value="REGV21">VMWare Harbor</option>
														<option value="REGV23">JFrog Artifactory</option>
														<option value="REGV99">기타</option>
													</select>
												</div>
												<!-- 기타 선택 시 Vendor 입력 -->
												<div class="ipt_box" style="flex: 2;">
													<input class="no_radius" id="selected_vendor" type="text"
														value="" placeholder="">
												</div>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<!-- class에 따른 title 변경 -->
											<dt class="host_option">자산명(도메인명)</dt>
											<dt class="registry_option cs_option">자산명</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="equipmarkname"
														name="equipmarkname" value=""
														placeholder="자산명(도메인명)을 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option cs_option">
										<dl>
											<dt>자산위치</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="equiplocation"
														name="equiplocation" value=""
														placeholder="자산위치를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<!-- class에 따른 title 변경 -->
											<dt class="host_option">IP</dt>
											<dt class="registry_option cs_option">IP (도메인명)</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="masterip"
														name="masterip" value=""
														placeholder="IP : PORT 혹은 도메인명 : PORT를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>OS</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="osver"
														name="osver" value="" placeholder="OS를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<!-- 클러스터용 OS -->
									<li class="cs_option">
										<dl>
											<dt>OS</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="clusterosver"
														name="clusterosver" value="" placeholder="OS를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>제조사</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="company"
														name="company" value="" placeholder="제조사를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>장비관련주체</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="manager"
														name="manager" value="" placeholder="장비관련주체를 입력헤 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>자산 연동 여부</dt>
											<dd>
												<div class="sel_box">
													<select id="service_state" name="service_state"
														class="popup_sel">
														<option value="true">ON</option>
														<option value="false">OFF</option>
													</select>
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>자산 연동 서버</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="relayServer"
														name="relayServer" value="사이트 이용 설정 자동 적용" readonly>
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>로그 수집 여부</dt>
											<dd>
												<div class="sel_box">
													<select id="log_state" name="log_state" class="popup_sel">
														<option value="true">ON</option>
														<option value="false">OFF</option>
													</select>
												</div>
											</dd>
										</dl>
									</li>
									<li class="host_option">
										<dl>
											<dt>초당 로그 수집 건수</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="log_count"
														name="log_count" value=""
														placeholder="초당 로그 수집 건수 입력해 주십시오. (예 100)">
												</div>
											</dd>
										</dl>
									</li>

									<li class="registry_option" style="display: none;">
										<dl>
											<dt>자동 분석 여부</dt>
											<dd style="display: flex;">
												<div class="sel_box" style="flex: 1;">
													<select id="auto_scan" name="auto_scan" class="popup_sel"
														onChange="autoScanCycleChange()">
														<option value="T">ON</option>
														<option value="F">OFF</option>
													</select>
												</div>
												<!-- 자동 분석 실행 주기 -->
												<div class="ipt_box" style="flex: 5;">
													<input class="no_radius" type="text" id="auto_scan_cycle"
														name="auto_scan_cycle" value=""
														placeholder="( 예: 0 0 0/12 * * ? ) 형식으로 레지스트리 스캔 주기를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>

									<li class="registry_option" style="display: none;">
										<dl>
											<dt>ID</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="registry_user"
														name="registry_user" value=""
														placeholder="Registry 접속을 위한 ID를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="registry_option" style="display: none;">
										<dl>
											<dt>Password</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="password" id="registry_pw"
														name="registry_pw" value=""
														placeholder="Registry 접속을 위한 Password ( 혹은 Personal Access Token ) 를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="regv03" style="display: none;">
										<dl>
											<dt>OAuth Token</dt>
											<dd>
												<div class="ipt_box">
													<input class="no_radius" type="text" id="oauth_token"
														name="registry_oauth" value=""
														placeholder="Registry 접속을 위한 OAuth Token 정보를 입력해 주십시오.">
												</div>
											</dd>
										</dl>
									</li>
									<li class="registry_option"
										style="display: none; margin-bottom: 27px;">
										<dl>
											<dt>인증서</dt>
											<dd>
												<div class="ipt_box">
													<textarea class="no_radius" style="" id="tls_cert"
														name="tls_cert"
														placeholder="Registry TLS 접속을 위한 인증서를 등록해 주십시오."></textarea>
												</div>
											</dd>
										</dl>
									</li>
									<li class="registry_option registry_validation"
										style="max-width: 950px">
										<dl
											style="display: flex; align-items: center; justify-content: flex-start; flex-direction: row-reverse;">
											<dt style="width: auto !important"
												class="is_registryed_tls_status_text hidden">Valid</dt>
											<dd id="is_registered_tls_status" style="width: auto;"></dd>
										</dl>
									</li>

									<!-- containerSecurity> Cluster -->
									<li class="cs_option" style="display: none;">
										<dl>
											<dt>CA 인증서</dt>
											<dd>
												<div class="ipt_box">
													<textarea class="no_radius" style="" id="cs_cert_data"
														name="cs_cert_data"
														placeholder="클러스터의 CA 인증서 정보를 입력해 주십시오."></textarea>
												</div>
											</dd>
										</dl>
									</li>
									<li style="margin-top: 27px; margin-bottom: 27px;"
										class="cs_option" style="display: none;">
										<dl>
											<dt>AuthToken</dt>
											<dd>
												<div class="ipt_box">
													<textarea class="no_radius" style=""
														id="cs_auth_token_data" name="cs_auth_token_data"
														placeholder="클러스터에 등록된 주체의 토큰을 입력해 주십시오."></textarea>
												</div>
											</dd>
										</dl>
									</li>
									<li class="cs_option" style="max-width: 950px">
										<dl
											style="display: flex; align-items: center; justify-content: flex-start; flex-direction: row-reverse;">
											<dt id="cluster_tls_cert_status_word"
												style="width: auto !important"></dt>
											<dd id="cluster_tls_cert_status" style="width: auto;"></dd>
										</dl>
									</li>
								</ul>
							</div>
							<div class="edit_line hidden"></div>
							<div class="edit_box">
								<ul class="webhook_option">
									<li class="cs_option cs_timer_option" style="display: none;">
										<div style='margin: auto;' class="cs_timer_option_title">웹훅
											서버</div>
										<div style="width: 85%">
											<ul>
												<li>
													<table>
														<tr>
															<td style="width: 60%;">
																<dl>
																	<dd style="width: 100% !important">
																		<div class="ipt_box">
																			<input class="no_radius" type="text"
																				id="cs_webhook_url" name="cs_webhook_url" value=""
																				placeholder="웹훅 서버 URL을 입력해 주십시오.">
																		</div>
																	</dd>
																</dl>
															</td>
															<td style="width: 30%;">
																<dl style="display: flex;">
																	<dt style="width: 100%;">타임아웃 (초)</dt>
																	<dd style="width: 100%;">
																		<div class="ipt_box">
																			<input class="no_radius" type="number" min="10"
																				max="30" id="cs_webhook_timeout"
																				name="cs_webhook_timeout" onchange="whTimeCheck()"
																				value="" />
																		</div>
																	</dd>
																</dl>
															</td>
															<td style="width: 10%;">
																<div style="margin-left: 18px; display: flex;">
																	<div id="cluster_webhook_status"></div>
																	<div id="cluster_webhook_status_word"
																		style="margin-left: 5px; margin-top: 9px; font-size: 13px; color: #ddd;"></div>
																</div>
															</td>
														</tr>
													</table>
												</li>
											</ul>
										</div>
									</li>
									<li class="cs_option cs_timer_option">
										<div class="cs_timer_option_title">규정준수 스캔</div>
										<div style="width: 100%;">
											<ul style="display: flex;">
												<li class="cs_option" style="display: none;">
													<dl style="display: flex;">
														<dt>자동 실행 여부</dt>
														<dd class="cluster_auto_scan_select">
															<div class="sel_box">
																<select id="cluster_auto_scan" name="auto_scan"
																	class="popup_sel" onChange="autoScanCycleChange()"
																	value="">
																	<option value="T">ON</option>
																	<option value="F">OFF</option>
																</select>
															</div>
														</dd>
													</dl>
												</li>
												<li class="cs_option" style="display: none; width: 100%">
													<dl>
														<dd style="width: 100% !important">
															<div class="ipt_box">
																<input class="no_radius" type="text"
																	id="cluster_auto_scan_cycle" name="auto_scan_cycle"
																	value="" placeholder="예: 0 0 0/12 * * ?">
															</div>
														</dd>
													</dl>
												</li>
											</ul>
										</div>
									</li>
									<li class="cs_option activate_framework">
										<div class="cs_timer_option_title"></div> <!-- TODO: 이름 변경 -->
										<dl>
											<dt>프레임워크 활성화</dt>
											<dd>
												<div class="scan_activate_container">
													<div class="scan_framework_container mscrollbar"
														id="scanAbleFramework">
														<div class="scan_framework_placeholder"
															style="display: none;">스캔가능 프레임워크</div>
													</div>
													<div class="scan_framework_buttons">
														<button class="scan_framework_button" id="moveRightButton">&gt;</button>
														<button class="scan_framework_button" id="moveLeftButton">&lt;</button>
													</div>
													<div class="scan_framework_container mscrollbar"
														id="scanTargetFramework">
														<div class="scan_framework_placeholder"
															style="display: none;">스캔대상 프레임워크</div>
													</div>
												</div>
											</dd>
										</dl>
									</li>
								</ul>
								<div class="btn_wrap">
									<div class="fr">
										<a id="cancelBtn" href="#" class="btn grey">취소</a> <a
											id="saveBtn" href="#" class="btn">저장</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</body>
</html>