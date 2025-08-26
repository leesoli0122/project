<%@page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<title>컨테이너 이벤트 상세 - Aegis</title>
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
<meta property="og:image" content="Aegis.png">
<meta property="og:description" content="Aegis 홈페이지입니다.">

<!-- TODO: favicon -->
<link rel="icon" href="./assets/images/favicon.png" type="favicon.png" />

<!-- TODO: import -->
<%@ include file="/page/layout/common.jsp"%>

<script src="./js/service/event/eventContainerSecurityInfo.js?v=${version}"></script>

</head>
<body class="win_popup event mscrollbar">
	<input type="hidden" id="detailData" value="" />
	<section>
		<h4>이벤트 상세</h4>
		<div class="popup_view_cont">
			<div class="tab_box">
				<div class="tab">
					<ul class="tab_lst">
						<li id="logInfo" value="tabMgmt_1" class="open"><a href="#"
							id="logInfo" class="tab_link">로그정보 </a></li>
					</ul>
				</div>
			</div>
			<div class="btn_wrap download">

				<!-- a id="packetDownloadBtn" class="btn grey" href="#">다운로드</a -->
			</div>
			<div id="tabMgmt" class="tab_container">
				<div class="tabMgmt_1 tab_cont open">
					<div class="top">
						<div class="detail_text_color">
							<table style="width: 100%;">
								<tr>
									<td><span class="detail_top_titles">Cluster</span></td>
									<td>
										<div class="ipt_box">
											<input class="no_radius" type="text" id="clusterName"
												name="clusterName" value="" readonly="">
										</div>
									</td>
									<td class="detail_top_table_second_group_line"><span
										class="detail_top_titles">Namespace</span></td>
									<td>
										<div class="ipt_box">
											<input class="no_radius" type="text" id="nameSpace"
												name="nameSpace" value="" readonly="">
										</div>
									</td>
								</tr>
								<tr>
									<td class="detail_top_table_second_row"><span
										class="detail_top_titles">Message</span></td>
									<td class="detail_top_table_second_row" colspan="3">
										<div class="ipt_box">
											<input class="no_radius" type="text" id="message"
												name="message" value="" readonly="">
										</div>
									</td>
								</tr>
							</table>
						</div>
						<div class="detail detail_text_color detail_titles">
							<div class="deatail_hideAndView" onclick="onOffDisplay()">
								<div class="view_hide_btn_icon"></div>
								
								<span style="padding-left:10px;">Rule Name
									: </span> <span id="csDetailRuleName"> 룰이름</span>
							</div>
							<div id="resultDetailDiv" style="display: none;">
								<ul class="detail_list_cluster"></ul>
							</div>
						</div>
						<div class="detail" id="detailContents" style="padding-top: 10px;">
							<div class="info nol"></div>
							<span class="detail_text_color detail_titles">Contents</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</body>

</body>
</html>