<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>컨테이너 이미지 스캔 상세 - Aegis</title>
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

	<script src="./js/service/event/eventImageSecurityInfo.js?v=${version}"></script>
	
</head>
<body class="win_popup event mscrollbar">
<input type="hidden" id="packetData" value=""/>

<input type="hidden" id="detailData" value=""/> 
	<section>
		<h4>이벤트 상세</h4>
		<div class="popup_view_cont">
			<div class="tab_box">
				<div class="tab">
					<ul class="tab_lst">
						<li id="logInfo" value="tabMgmt_1" class="open"><a href="#" id="logInfo" class="tab_link">로그정보 </a></li>
						<!-- <li id="jsonInfo" value="tabMgmt_2" ><a href="#" id="jsonInfo" class="tab_link">원본로그</a></li> -->
					</ul>
				</div>
			</div>
			<div class="btn_wrap download">
				<!-- a id="packetDownloadBtn" class="btn grey" href="#">다운로드</a -->
			</div>
			<div id="tabMgmt" class="tab_container">
				<div class="tabMgmt_1 tab_cont open">
					<div class="top">
						<dl>
							<dt>
								<span>자산정보</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" id="deviceNm1" name="deviceNm1" value="" readonly="">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>
								<span>탐지시간</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" id="eventDtm1" name="eventDtm1" value="" readonly="">
								</div>
							</dd>
						</dl>
					</div>
					<div class="detail">
						<ul class="detail_list_image"></ul>
					</div>
				</div>
				<!-- <div class="tabMgmt_2 tab_cont">
					<div class="top">
						<dl>
							<dt>
								<span>자산정보</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" id="deviceNm2" name="deviceNm2" value="" readonly="">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>
								<span>탐지시간</span>
							</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" id="eventDtm2" name="eventDtm2" value="" readonly="">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>JSON</dt>
							<dd>
								<div class="ipt_box">
									<ul>
										<li class="wide">
											<dl>
												<dd style="width: 100%;">
													<pre id="json-renderer"></pre>
												</dd>
											</dl>
										</li>
									</ul>
								</div>
							</dd>
						</dl>
					</div>
				</div> -->
			</div>
		</div>
	</section>
</body>

</body>
</html>