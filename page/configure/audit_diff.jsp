<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>감사 상세 - Aegis</title>
	<meta charset="UTF-8" http-equiv="Content-Type">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0">
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
	<script src="./js/common/json-viewer.js?v=${version}"></script>
	<script src="./js/service/configure/auditDiff.js?v=${version}"></script>
</head>

<body class="win_popup event mscrollbar">
	<section>
		<h4 id="type">감사 상세</h4>
		<div class="popup_view_cont">
			<div class="tab_container">
				<div class="tab_cont open">
					<div class="top">
						<dl>
							<dt>
								<span>주체</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" readonly="" value="(0) agent3-135 (192.168.10.135)" id="subject" name="subject">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>
								<span>시간</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" readonly="" value="2021-08-18 16:52:48" id="eventtime" name="eventtime">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>
								<span>작업명</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" readonly="" value="2021-08-18 16:52:48" id="topic" name="topic">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>
								<span>메시지</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<textarea readonly="" id="message" name="message">ThisLeftData.ByteToASCIICode.</textarea>
								</div>
							</dd>
						</dl>
					</div>
				</div>
			</div>
			<div class="tab_box">
				<div class="tab">
					<ul class="tab_lst">
						<li id="tab1" value="tabMgmt_1" class="open"><a href="#" class="tab_link">신규</a></li>
						<li id="tab2" value="tabMgmt_2"><a href="#" class="tab_link">이전</a></li>
						<li id="tab3" value="tabMgmt_3"><a href="#" class="tab_link">비교</a></li>
					</ul>
				</div>
			</div>
			<div class="btn_wrap download"></div>
			<div id="tabMgmt" class="tab_container">
				<div class="tabMgmt_1 tab_cont open">
					<div class="bottom">
						<div class="packet_box mscrollbar">
							<pre id="json-renderer1"></pre>
						</div>
					</div>
				</div>
				<div class="tabMgmt_2 tab_cont">
					<div class="bottom">
						<div class="packet_box mscrollbar">
							<pre id="json-renderer2"></pre>
						</div>
					</div>
				</div>
				<div class="tabMgmt_3 tab_cont">
					<div class="bottom">
						<div class="packet_box mscrollbar">
							<pre id="json-renderer3"></pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</body>

</body>
</html>