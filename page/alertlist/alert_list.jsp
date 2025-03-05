<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%@ include file="/page/layout/header.jsp"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>이벤트 모니터링 - Aegis</title>
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
	<meta property="og:image" content="">
	<meta property="og:description" content="Aegis 홈페이지입니다.">
	
	<!-- TODO: favicon -->
	<link rel="icon" href="./assets/images/favicon.png" type="image/png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common.jsp"%>
	<script src="./js/service/alertlist/alertList.js?v=${version}"></script>
	
	<link rel="stylesheet" href="./assets/css/lib/rickshaw/graph.css">
	<link rel="stylesheet" href="./assets/css/lib/rickshaw/detail.css">
	<link rel="stylesheet" href="./assets/css/lib/rickshaw/legend.css">
	<script src="./assets/js/lib/rickshaw/d3.v3.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Class.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Compat.ClassList.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Area.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Line.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Bar.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.ScatterPlot.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Stack.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.RangeSlider.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.RangeSlider.Preview.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.HoverDetail.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Annotate.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Legend.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Axis.Time.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Toggle.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Order.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Highlight.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Smoother.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Fixtures.Time.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Fixtures.Time.Local.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Fixtures.Number.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Fixtures.RandomData.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Fixtures.Color.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Color.Palette.js"></script>
	<script src="./assets/js/lib/rickshaw/Rickshaw.Graph.Axis.Y.js"></script>
	
	
	<script type="text/javascript">
		$(function() {
			$("#alert_tab li").on('click', function() {
				$("#alert_tab li").each(function() {
					$(this).removeClass("open");
				});
				$(this).addClass("open");
			});
			$("input:checkbox[name='checkbox_list']").on('click', function() {
				if (this.checked) {
					$(this).parents('li').find('input').attr("readonly", false);
				} else {
					$(this).parents('li').find('input').attr("readonly", true);
				}
				if ($('.list_box').length) {
					if (this.checked) {
						$('.list_box li').addClass('on');
					} else {
						$('.list_box li').removeClass('on');
					}
				}
			});
			$("#startBtn").on('click', function() {
				$("#startBtn").addClass("on");
				$("#stopBtn").removeClass("on");
				doConnect();
				
				$("#firewallBtn").addClass("on");
				$("#ipsBtn").addClass("on");
				$("#malwareBtn").addClass("on");
				$("#appctlBtn").addClass("on");
				$("#fileBtn").addClass("on");
				$("#pamaclBtn").addClass("on");
				
				$("#firewallBtn").html("ON");
				$("#ipsBtn").html("ON");
				$("#malwareBtn").html("ON");
				$("#appctlBtn").html("ON");
				$("#fileBtn").html("ON");
				$("#pamaclBtn").html("ON");
			});
			$("#stopBtn").on('click', function() {
				$("#startBtn").removeClass("on");
				$("#stopBtn").addClass("on");
				doDisconnect();
				
				$("#firewallBtn").removeClass("on");
				$("#ipsBtn").removeClass("on");
				$("#malwareBtn").removeClass("on");
				$("#appctlBtn").removeClass("on");
				$("#fileBtn").removeClass("on");
				$("#pamaclBtn").removeClass("on");
				
				$("#firewallBtn").html("OFF");
				$("#ipsBtn").html("OFF");
				$("#malwareBtn").html("OFF");
				$("#appctlBtn").html("OFF");
				$("#fileBtn").html("OFF");
				$("#pamaclBtn").html("OFF");
				
				/*
				$("#firewallEventCnt").html("0");
				$("#ipsEventCnt").html("0");
				$("#malwareEventCnt").html("0");
				$("#appctlEventCnt").html("0");
				$("#fileEventCnt").html("0");
				$("#pamaclEventCnt").html("0");
				*/
			});
			$("#deleteBtn").on('click', function() {
				totalCnt = 0;
				deviceCnt = new Map();
				ipCnt = new Map();

				firewallTotalCnt = 0;
				ipsTotalCnt = 0;
				malwareTotalCnt = 0;
				appctlTotalCnt = 0;
				fileTotalCnt = 0;
				pamaclTotalCnt = 0;

				firewallEventCnt = 0;
				ipsEventCnt = 0;
				malwareEventCnt = 0;
				appctlEventCnt = 0;
				fileEventCnt = 0;
				pamaclEventCnt = 0;
				
				$("#totalCnt").html("0");
				$("#deviceCnt").html("0");
				$("#groupCnt").html("0");
				
				$("#firewallTotalCnt").html("0");
				$("#ipsTotalCnt").html("0");
				$("#malwareTotalCnt").html("0");
				$("#appctlTotalCnt").html("0");
				$("#fileTotalCnt").html("0");
				$("#pamaclTotalCnt").html("0");
				
				$("#firewallEventCnt").html("0");
				$("#ipsEventCnt").html("0");
				$("#malwareEventCnt").html("0");
				$("#appctlEventCnt").html("0");
				$("#fileEventCnt").html("0");
				$("#pamaclEventCnt").html("0");
				
				$("#logList").html("");
			});
			$("#firewallBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			$("#ipsBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			$("#malwareBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			$("#appctlBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			$("#fileBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			$("#pamaclBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			$(".tab_link").on('click', function() {
				selectedTab = $(this).attr("rel");
				$("#logList p").each(function() {
					((selectedTab == "TOTAL" || selectedTab == $(this).attr("id")) && (!$("#keywordFilter").is(":checked") || ($("#keywordFilter").is(":checked") && $(this).html().indexOf($("#keyword").val()) > -1))) ? $(this).show() : $(this).hide();
				});
			});
			$("#keyword").keydown(function() {
				$("#logList p").each(function() {
					((selectedTab == "TOTAL" || selectedTab == $(this).attr("id")) && (!$("#keywordFilter").is(":checked") || ($("#keywordFilter").is(":checked") && $(this).html().indexOf($("#keyword").val()) > -1))) ? $(this).show() : $(this).hide();
				});
			});
		});
		
		$(document).ready(function() {
			loadRealtimeChart();
			$("#startBtn").trigger("click");
		});
	</script>
</head>
<body>

<h1>Aegis ADMIN</h1>
<div class="skip_navigation">
    <ul>
        <li>
            <a href="#Content" class="go_content">본문 바로가기</a>
        </li>
        <li>
            <a href="#Gnb">메뉴 바로가기</a>
        </li>
    </ul>
</div>

<jsp:include page="/page/layout/sidebar.jsp" flush="false">
	<jsp:param name="menuId" value="alertList" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="alertList" />
</jsp:include>

<input type="hidden" id="detailJson" value=""></input>
<input type="hidden" id="detailData" value=""></input>
<input type="hidden" id="detailNum" value=""></input>

<section class="alerts_page mscrollbar">
	<div class="sub">
		<div class="alertlist_search_box">
			<ul class="alertlist_search_cont">
				<li>
					<div class="alertlist_search_cont_box">
						<div class="alertlist_search_cont_tit">
							<h4 title="">시스템 현황</h4>
						</div>
						<div class="alertlist_search_cont_status">
							<div class="status_top">
								<dl>
									<dt>로그 발생 건수</dt>
									<dd>
										<span id="totalCnt" class="blue">0</span>
										<!--<span>0</span>-->
									</dd>
								</dl>
								<div class="alertlist_btn_box">
									<a id="startBtn" href="#" class="btn icon play" title="전체 데이터 수집 시작">전체 데이터 수집 시작</a>
									<a id="stopBtn" href="#" class="btn icon stop on" title="전체 데이터 수집 정지">전체 데이터 수집 정지</a>
									<a id="deleteBtn" href="#" class="btn icon del2" title="전체 데이터 삭제">전체 데이터 삭제</a>
								</div>
							</div>
							<ul class="status_bottom">
								<li>
									<dl>
										<dt>발생 장비 갯수</dt>
										<dd>
											<span id="deviceCnt" class="blue">0</span>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>접근 IP 갯수</dt>
										<dd>
											<span id="ipCnt" class="blue">0</span>
										</dd>
									</dl>
								</li>
								<!-- li>
									<dl>
										<dt>그룹 합계</dt>
										<dd>
											<span id="groupCnt" class="blue">0</span><!-- / <span>40</span> -->
										<!-- /dd>
									</dl>
								</li -->
							</ul>
						</div>
					</div>
				</li>
				<li>
					<div class="alertlist_search_cont_box">
						<div class="alertlist_search_cont_tit">
							<h4 title="">경보현황</h4>
						</div>
						<div class="alertlist_search_cont_list">
							<ul>
								<li>
									<div>방화벽</div>
									<div>
										<div id="firewallTotalCnt">0</div>
										<div>
											<span id="firewallEventCnt">0</span>
											<!-- span class="up">9</span -->
										</div>
									</div>
									<div>
										<a id="firewallBtn" class="btn togl">OFF</a>
									</div>
								</li>
								<li>
									<div>침입방지시스템</div>
									<div>
										<div id="ipsTotalCnt">0</div>
										<div>
											<span id="ipsEventCnt">0</span>
										</div>
									</div>
									<div>
										<a id="ipsBtn" class="btn togl">OFF</a>
									</div>
								</li>
								<li>
									<div>멀웨어</div>
									<div>
										<div id="malwareTotalCnt">0</div>
										<div>
											<span id="malwareEventCnt">0</span>
										</div>
									</div>
									<div>
										<a id="malwareBtn" class="btn togl">OFF</a>
									</div>
								</li>
								<li>
									<div>파일무결성</div>
									<div>
										<div id="fileTotalCnt">0</div>
										<div>
											<span id="fileEventCnt">0</span>
										</div>
									</div>
									<div>
										<a id="fileBtn" class="btn togl">OFF</a>
									</div>
								</li>
								<li>
									<div>실행 파일 통제</div>
									<div>
										<div id="appctlTotalCnt">0</div>
										<div>
											<span id="appctlEventCnt">0</span>
										</div>
									</div>
									<div>
										<a id="appctlBtn" class="btn togl">OFF</a>
									</div>
								</li>
								<li>
									<div>서비스 제어</div>
									<div>
										<div id="pamaclTotalCnt">0</div>
										<div>
											<span id="pamaclEventCnt">0</span>
										</div>
									</div>
									<div>
										<a id="pamaclBtn" class="btn togl">OFF</a>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</li>
				<li>
					<div class="alertlist_search_cont_box">
						<div class="alertlist_search_cont_tit">
							<h4 title="">로그 발생 현황</h4>
						</div>
						<div class="alertlist_search_cont_grap" id="realtimeChart"></div>
					</div>
				</li>
			</ul>
		</div>
		<div class="alertlist_cont_box">
			<div class="alertlist_top">
				<h3>실시간 로그 조회</h3>
				<ul class="filter_box">
					<!-- li>
						<div class="chk_box">
							<input type="checkbox" name="checkbox_list" id="deviceFilter" value="">
							<label for="deviceFilter"></label>
						</div>
						<div class="ipt_box">
							<input class="" type="text" placeholder="장비명 Filter 입력 " id="device" name="device" readonly>
						</div>
					</li>
					<li>
						<div class="chk_box">
							<input type="checkbox" name="checkbox_list" id="ipFilter" value="">
							<label for="ipFilter"></label>
						</div>
						<div class="ipt_box">
							<input class="" type="text" placeholder="IP Filter 입력 " id="ip" name="ip" readonly>
						</div>
					</li -->
					<li>
						<div class="chk_box">
							<input type="checkbox" name="checkbox_list" id="keywordFilter" value="">
							<label for="keywordFilter"></label>
						</div>
						<div class="ipt_box">
							<input class="" type="text" placeholder="키워드 Filter 입력 " id="keyword" name="keyword" readonly>
						</div>
					</li>
				</ul>
			</div>
			<div class="alertlist_bottom">
				<div class="tab_box">
					<div class="tab">
						<ul id="alert_tab" class="tab_lst">
							<li class="open"><a href="#" class="tab_link" rel="TOTAL">전체 </a></li>
							<li><a href="#" class="tab_link" rel="FIREWALL">방화벽</a></li>
							<li><a href="#" class="tab_link" rel="IPS">침입방지시스템</a></li>
							<li><a href="#" class="tab_link" rel="MALWARE">멀웨어</a></li>
							<li><a href="#" class="tab_link" rel="FILE">파일 무결성</a></li>
							<li><a href="#" class="tab_link" rel="APPCTL">실행 파일 통제</a></li>
							<li><a href="#" class="tab_link" rel="PAMACL">서비스 제어</a></li>
						</ul>
					</div>
				</div>
				<div class="tab_container">
					<div class="tabMgmt_1 tab_cont open">
						<div class="alertlist_contents mscrollbar">
							<div class="alertlist" id="logList">
								<!-- p id="IPS">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
								<p id="AV">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
								<p id="MALWARE">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
								<p id="AV">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
								<p id="PAMACL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
								<p id="PAMACL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
								<p id="FIREWALL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
								<p id="FILE">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
								<p id="APPCTL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p -->
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