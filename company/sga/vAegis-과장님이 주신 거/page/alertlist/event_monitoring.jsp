<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
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
	<link rel="icon" href="../../assets/images/favicon.png" type="image/png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	<script src="../../assets/js/service/alertlist/alertList.js?v=${version}"></script>
	<script src="../../assets/js/service/alertlist/alertListDrawChart.js?v=${version}"></script>	
	<link rel="stylesheet" href="../../assets/css/lib/rickshaw/graph.css">
	<link rel="stylesheet" href="../../assets/css/lib/rickshaw/detail.css">
	<link rel="stylesheet" href="../../assets/css/lib/rickshaw/legend.css">
	<script src="../../assets/js/lib/rickshaw/d3.v3.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Class.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Compat.ClassList.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Area.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Line.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Bar.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.ScatterPlot.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Stack.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.RangeSlider.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.RangeSlider.Preview.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.HoverDetail.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Annotate.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Legend.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Axis.Time.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Toggle.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Order.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Highlight.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Smoother.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Fixtures.Time.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Fixtures.Time.Local.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Fixtures.Number.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Fixtures.RandomData.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Fixtures.Color.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Color.Palette.js"></script>
	<script src="../../assets/js/lib/rickshaw/Rickshaw.Graph.Axis.Y.js"></script>
	
	
	<script type="text/javascript">

		// 탭 길이 이상현상으로 scripts.js의 cont()를 오버라이딩
		function cont() {}
		// 탭 길이 이상현상으로 scripts.js의 mscrollbar()를 오버라이딩
		function mscrollbar() {
			$('textarea').addClass('textarea-scrollbar scrollbar-outer');
			$('.textarea-scrollbar').scrollbar();
			if ($('.mscrollbar').length) {
				$('.mscrollbar').mCustomScrollbar({
					autoExpandScrollbar: "true",
					axis: "yx",
					scrollInertia: 300,
					callbacks: {
						onOverflowX: function () {
							// $('.dashboard_main').css({paddingRight: '20px'});
							// $('.sub').css({paddingRight: '20px'});
						},
						onOverflowY: function () {
							$('.list_box').css({paddingRight: '17px'});
						},
						onOverflowXNone: function () {
							$('.dashboard_main').css({paddingRight: '7px'});
						},
						onOverflowYNone: function () {
							$('.list_box').css({paddingRight: 0});
						},
					},
					setTop: 0,
					setLeft: 0,
				});
			}
		}
	
		$(function() {
			//${webOption}.activeService.activeMode==="Aegis"
			if(true){
				$('.alerts_tab_btn_wrap').append('<li class="alerts_tab_btn_list"><a href="#" class="alerts_tab_btn" data-value="host">호스트</a></li>');
			}
			$("#cluster_alert_tab li").on('click', function() {
				$("#cluster_alert_tab li").each(function() {
					$(this).removeClass("open");
				});
				$(this).addClass("open");
			});
			$("#host_alert_tab li").on('click', function() {
				$("#host_alert_tab li").each(function() {
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
			// 클러스터 > 전체 데이터 수집 시작
			$("#clusterStartBtn").on('click', function() {
				$("#clusterStartBtn").addClass("on");
				$("#clusterStopBtn").removeClass("on");
				doConnect(); 
				
				$("#imageSecurityBtn").addClass("on"); // 이미지 시큐리티 추가
				$("#containerWorkloadBtn").addClass("on"); // 컨테이너 워크로드 추가
				$("#imageRunningControlBtn").addClass("on"); // 컨테이너 이미지 실행 제어 추가
				$("#containerSecurityBtn").addClass("on"); // 컨테이너 이벤트 추가
				
				$("#imageSecurityBtn").html("ON"); // 이미지 시큐리티 추가
				$("#containerWorkloadBtn").html("ON"); // 컨테이너 워크로드 추가
				$("#imageRunningControlBtn").html("ON"); // 컨테이너 이미지 실행 제어 추가
				$("#containerSecurityBtn").html("ON"); // 컨테이너 이벤트 추가
			});
			// 호스트 > 전체 데이터 수집 시작 
			$("#hostStartBtn").on('click', function() {
				$("#hostStartBtn").addClass("on");
				$("#hostStopBtn").removeClass("on");
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
			// 클러스터 > 전체 데이터 수집 정지
			$("#clusterStopBtn").on('click', function() {
				$("#clusterStartBtn").removeClass("on");
				$("#clusterStopBtn").addClass("on");
				doDisconnect();
				
			$("#imageSecurityBtn").removeClass("on"); // 이미지 시큐리티 추가
		    $("#containerWorkloadBtn").removeClass("on"); // 컨테이너 워크로드 추가
		    $("#imageRunningControlBtn").removeClass("on"); // 컨테이너 이미지 실행 제어 추가
		    $("#containerSecurityBtn").removeClass("on"); // 컨테이너 이벤트 추가
		    
		    $("#imageSecurityBtn").html("OFF"); // 이미지 시큐리티 추가
		    $("#containerWorkloadBtn").html("OFF"); // 컨테이너 워크로드 추가
		    $("#imageRunningControlBtn").html("OFF"); // 컨테이너 이미지 실행 제어 추가
		    $("#containerSecurityBtn").html("OFF"); // 컨테이너 이벤트 추가
			});
			// 호스트 > 전체 데이터 수집 정지 
			$("#hostStopBtn").on('click', function() {
				$("#hostStartBtn").removeClass("on");
				$("#hostStopBtn").addClass("on");
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
			});
			$("#clusterDeleteBtn").on('click', function() {
				deviceCnt = new Map();
				ipCnt = new Map();
				clusterTotalCnt = 0;
				
				imageSecurityTotalCnt = 0; 	// 이미지 시큐리티 추가
				containerWorkloadTotalCnt = 0	 // 컨테이너 워크로드 추가
				imageRunningControlTotalCnt = 0	 // 컨테이너 이미지 실행 제어 추가
				containerSecurityTotalCnt = 0	 // 컨테이너 이벤트 추가
				
				imageSecurityEventCnt = 0; // 이미지 시큐리티 추가
				containerWorkloadEventCnt = 0; // 컨테이너 워크로드 추가
				imageRunningControlEventCnt = 0; // 컨테이너 이미지 실행 제어 추가
				containerSecurityEventCnt = 0; // 컨테이너 이벤트 추가
				
				$("#clusterTotalCnt").html("0");
				
				$("#imageSecurityTotalCnt").html("0"); // 이미지 시큐리티 추가
				$("#containerWorkloadTotalCnt").html("0"); // 컨테이너 워크로드 추가
				$("#imageRunningControlTotalCnt").html("0"); // 컨테이너 이미지 실행 제어 추가
				$("#containerSecurityTotalCnt").html("0"); // 컨테이너 이벤트 추가
				
				$("#imageSecurityEventCnt").html("0"); // 이미지 시큐리티 추가
				$("#containerWorkloadEventCnt").html("0"); // 컨테이너 워크로드 추가
				$("#imageRunningControlEventCnt").html("0"); // 컨테이너 이미지 실행 제어 추가
				$("#containerSecurityEventCnt").html("0"); // 컨테이너 이벤트 추가
				
				$("#clusterLogList").html("");
			});
			$("#hostDeleteBtn").on('click', function() {
				deviceCnt = new Map();
				ipCnt = new Map();
				hostTotalCnt = 0;
				      
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
				
				$("#hostTotalCnt").html("0");
				
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
				
				$("#hostLogList").html("");
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
			// 이벤트 모니터링 > 경보현황 > ImageSecurity 버튼 직접 조작 시
			$("#imageSecurityBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			// 컨테이너 워크로드 버튼조작 이벤트
			$("#containerWorkloadBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			// 컨테이너 이미지 실행 제어 버튼조작 이벤트
			$("#imageRunningControlBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			// 컨테니어 시큐리티 버튼조작 이벤트
			$("#containerSecurityBtn").on('click', function() {
				if($(this).hasClass("on")) {
					$(this).removeClass("on");
					$(this).html("OFF");
				} else {
					$(this).addClass("on");
					$(this).html("ON");
				}
			});
			
			
			$("#cluster_alert_tab .tab_link").on('click', function() {
				selectedTab = $(this).attr("rel");
				
				$("#clusterLogList p").each(function() {
					((selectedTab == "CLUSTER_TOTAL" || selectedTab == $(this).attr("id")) && (!$("#clusterKeywordFilter").is(":checked") || ($("#clusterKeywordFilter").is(":checked") && $(this).html().indexOf($("#clusterKeyword").val()) > -1))) ? $(this).show() : $(this).hide();
				}); 
			});
			$("#host_alert_tab .tab_link").on('click', function() {
				selectedTab = $(this).attr("rel");
				
				$("#hostLogList p").each(function() {
					((selectedTab == "HOST_TOTAL" || selectedTab == $(this).attr("id")) && (!$("#hostKeywordFilter").is(":checked") || ($("#hostKeywordFilter").is(":checked") && $(this).html().indexOf($("#hostKeyword").val()) > -1))) ? $(this).show() : $(this).hide();
				});
			});
			$("#clusterKeyword").keydown(function() {
				$("#clusterLogList p").each(function() {
					((selectedTab == "CLUSTER_TOTAL" || selectedTab == $(this).attr("id")) && (!$("#clusterKeywordFilter").is(":checked") || ($("#clusterKeywordFilter").is(":checked") && $(this).html().indexOf($("#clusterKeyword").val()) > -1))) ? $(this).show() : $(this).hide();
				});
			});
			$("#hostKeyword").keydown(function() {
				$("#hostLogList p").each(function() {
					((selectedTab == "HOST_TOTAL" || selectedTab == $(this).attr("id")) && (!$("#hostKeywordFilter").is(":checked") || ($("#hostKeywordFilter").is(":checked") && $(this).html().indexOf($("#hostKeyword").val()) > -1))) ? $(this).show() : $(this).hide();
				});
			});
			// 키워드 체크박스 체크 해제 시 검색어 미적용
			$("#clusterKeywordFilter").on('click', function() { 
				if(!$("#clusterKeywordFilter").is(":checked")){
					$("#cluster_alert_tab a[rel='" + selectedTab + "']").trigger("click");
				};
			});
			$("#hostKeywordFilter").on('click', function() { 
				if(!$("#hostKeywordFilter").is(":checked")){
					$("#host_alert_tab a[rel='" + selectedTab + "']").trigger("click");
				};
			});
			
			// 클러스터, 호스트 탭 버튼 클릭 이벤트
			$(".alerts_tab_btn").on('click', function() {
				tabValue = $(this).data("value");
				var tabId = "#" + tabValue + "Tab";
				
				// 탭 변경 시 '실시간 로그 조회' 선택된 탭 찾기
				switch(tabValue){
				 case tabName.CLUSTER:
					 selectedTab = $("#cluster_alert_tab li.open a").attr("rel");
					 break;
				 case tabName.HOST:
					 selectedTab = $("#host_alert_tab li.open a").attr("rel");
					 break;
				}
				
				// 스크롤 초기화
				$(".mCSB_container").css("left", 0);
				$(".mCSB_dragger").css("left", 0);
				// 모든 탭 내용 숨기기
				$(".alert_tab_content").hide();
				// 모든 탭 버튼 클래스 제거
				$(".alerts_tab_btn").removeClass("active");
				// 선택한 탭 내용 표시
				$(tabId).show();
				// 선택한 탭 버튼 활성화
				$(this).addClass("active");
			});
		}); 
		
		$(document).ready(function() {
			
			$(".alerts_tab_btn[data-value='cluster']").trigger("click");
			loadClusterRealtimeChart();
			loadHostRealtimeChart();
			$("#clusterStartBtn").trigger("click");
			$("#hostStartBtn").trigger("click");
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

<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="eventMonitoring" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="eventMonitoring" />
</jsp:include>

<input type="hidden" id="detailJson" value=""></input>
<input type="hidden" id="detailData" value=""></input>
<input type="hidden" id="detailNum" value=""></input>

<div class="monitoring_tooltip"></div>
<section class="alerts_page mscrollbar">
	<article class="alerts_page_tab_btn">
		<div>
			<ul class="alerts_tab_btn_wrap">
				<li class="alerts_tab_btn_list"><a href="#" class="alerts_tab_btn active" data-value="cluster">클러스터</a></li>
			</ul>
		</div>
	</article>
	<article class="alert_tab_content" id="clusterTab">
		<div class="sub">
			<div class="alertlist_search_box">
				<ul class="alertlist_search_cont flex_wrap">
					<li class="system_status">
						<div class="alertlist_search_cont_box">
							<div class="alertlist_search_cont_tit">
								<h4 title="">시스템 현황</h4>
							</div>
							<div class="alertlist_search_cont_status">
								<div class="status_top">
									<dl>
										<dt>로그 발생 건수</dt>
										<dd>
											<span id="clusterTotalCnt" class="txt_figure">0</span>
											<!--<span>0</span>-->
										</dd>
									</dl>
									<div class="alertlist_btn_box" >
										<a id="clusterStartBtn" href="#" class="btn icon play" title="전체 데이터 수집 시작">전체 데이터 수집 시작</a>
										<a id="clusterStopBtn" href="#" class="btn icon stop on" title="전체 데이터 수집 정지">전체 데이터 수집 정지</a>
										<a id="clusterDeleteBtn" href="#" class="btn icon del2" title="전체 데이터 삭제">전체 데이터 삭제</a>
									</div>
								</div>
								<!-- <ul class="status_bottom">
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
									li>
										<dl>
											<dt>그룹 합계</dt>
											<dd>
												<span id="groupCnt" class="blue">0</span><!-- / <span>40</span>
											/dd>
										</dl>
									</li
								</ul> -->
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
									<!--  08-10 : 컨테이너 방화벽, 컨테이너 무결성, 대응도 추가로 숨김 -->
									<!--li>
										<div>컨테이너 방화벽</div>
										<div>
											<div id="containerFirewallTotalCnt">0</div>
											<div>
												<span id="containerFirewallEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="containerFirewallBtn" class="btn togl">OFF</a>
										</div>
									</li--> 
									<li>
										<div>컨테이너 이벤트</div>
										<div>
											<div id="containerSecurityTotalCnt">0</div>
											<div>
												<span id="containerSecurityEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="containerSecurityBtn" class="btn togl">OFF</a>
										</div>
									</li>
									<li>
										<div>컨테이너 워크로드 실행 제어</div>
										<div>
											<div id="containerWorkloadTotalCnt">0</div>
											<div>
												<span id="containerWorkloadEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="containerWorkloadBtn" class="btn togl">OFF</a>
										</div>
									</li>
									<li>
										<div>컨테이너 이미지 실행 제어</div>
										<div>
											<div id="imageRunningControlTotalCnt">0</div>
											<div>
												<span id="imageRunningControlEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="imageRunningControlBtn" class="btn togl">OFF</a>
										</div>
									</li>
									<li>
										<div>컨테이너 이미지 스캔</div>
										<div>
											<div id="imageSecurityTotalCnt">0</div>
											<div>
												<span id="imageSecurityEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="imageSecurityBtn" class="btn togl">OFF</a>
										</div>
									</li>
									<!-- <li>
										<div>규정 준수</div>
										<div>
											<div id="">0</div>
											<div>
												<span id="">0</span>
											</div>
										</div>
										<div>
											<a id="" class="btn togl">OFF</a>
										</div>
									</li> -->
									<!-- <li>
										<div>안티 멀웨어 스캔</div>
										<div>
											<div id="malwareTotalCnt">0</div>
											<div>
												<span id="malwareEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="malwareBtn" class="btn togl">OFF</a>
										</div>
									</li> -->
									<!--li>
										<div>컨테이너 무결성</div>
										<div>
											<div id="containerFileTotalCnt">0</div>
											<div>
												<span id="containerFileEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="containerFileBtn" class="btn togl">OFF</a>
										</div>
									</li -->
									<!--li>
										<div>대응</div>
										<div>
											<div id="">0</div>
											<div>
												<span id="">0</span>
											</div>
										</div>
										<div>
											<a id="" class="btn togl">OFF</a>
										</div>
									</li  -->
								</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="alertlist_search_cont_box">
							<div class="alertlist_search_cont_tit">
								<h4 title="">로그 발생 현황</h4>
							</div>
							<div class="alertlist_search_cont_grap" id="clusterRealtimeChart"></div>
						</div>
					</li>
				</ul>
			</div>
			<div class="alertlist_cont_box">
				<div class="alertlist_top">
					<h3>실시간 로그 조회</h3>
					<ul class="filter_box ab55">
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
								<input type="checkbox" name="checkbox_list" id="clusterKeywordFilter" value="">
								<label for="clusterKeywordFilter"></label>
							</div>
							<div class="ipt_box">
								<input class="" type="text" placeholder="키워드 Filter 입력 " id="clusterKeyword" name="keyword" readonly>
							</div>
						</li>
					</ul>
				</div>
				<div class="alertlist_bottom">
					<div class="tab_box">
						<div class="tab">
							<ul id="cluster_alert_tab" class="tab_lst">
								<!--  08-10 : 컨테이너 방화벽, 컨테이너 무결성, 대응도 추가로 숨김 -->
								<li class="open"><a href="#" class="tab_link" rel="CLUSTER_TOTAL">전체 </a></li>
								<!--li><a href="#" class="tab_link" rel="CONTAINER_FIREWALL">컨테이너 방화벽</a></li-->
								<li><a href="#" class="tab_link" rel="CONTAINER_SECURITY">컨테이너 이벤트</a></li>
								<li style="width:auto"><a href="#" class="tab_link" rel="CONTAINER_WORKLOAD">컨테이너 워크로드 실행 제어</a></li>
								<li style="width:auto"><a href="#" class="tab_link" rel="IMAGE_RUNNING_CONTROL">컨테이너 이미지 실행 제어</a></li>
								<li style="width:auto"><a href="#" class="tab_link" rel="IMAGESECURITY">컨테이너 이미지 스캔</a></li>
								<!--li><a href="#" class="tab_link" rel="CONTAINER_FILE">컨테이너 무결성</a></li-->
								<!--li><a href="#" class="tab_link" rel="">대응</a></li-->
							</ul>
						</div>
					</div>
					<div class="tab_container">
						<div class="tabMgmt_1 tab_cont open">
							<div class="alertlist_contents">
								<div class="alertlist" id="clusterLogList">
									<!--  p id="IPS">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="AV">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="MALWARE">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="AV">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="PAMACL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="PAMACL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="FIREWALL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="FILE">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="APPCTL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p  -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
	
	<article class="alert_tab_content" id="hostTab">
		<div class="sub">
			<div class="alertlist_search_box">
				<ul class="alertlist_search_cont flex_wrap">
					<li class="system_status">
						<div class="alertlist_search_cont_box">
							<div class="alertlist_search_cont_tit">
								<h4 title="">시스템 현황</h4>
							</div>
							<div class="alertlist_search_cont_status">
								<div class="status_top">
									<dl>
										<dt>로그 발생 건수</dt>
										<dd>
											<span id="hostTotalCnt" class="txt_figure">0</span>
											<!--<span>0</span>-->
										</dd>
									</dl>
									<div class="alertlist_btn_box" >
										<a id="hostStartBtn" href="#" class="btn icon play" title="전체 데이터 수집 시작">전체 데이터 수집 시작</a>
										<a id="hostStopBtn" href="#" class="btn icon stop on" title="전체 데이터 수집 정지">전체 데이터 수집 정지</a>
										<a id="hostDeleteBtn" href="#" class="btn icon del2" title="전체 데이터 삭제">전체 데이터 삭제</a>
									</div>
								</div>
								<!-- <ul class="status_bottom">
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
									li>
										<dl>
											<dt>그룹 합계</dt>
											<dd>
												<span id="groupCnt" class="blue">0</span><!-- / <span>40</span>
											/dd>
										</dl>
									</li
								</ul> -->
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
											</div>
										</div>
										<div>
											<a id="firewallBtn" class="btn togl">OFF</a>
										</div>
									</li>
									<li>
										<div>침입 방지 시스템</div>
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
										<div>안티 멀웨어</div>
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
										<div>파일 무결성</div>
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
									<!-- <li>
										<div>규정 준수</div>
										<div>
											<div id="">0</div>
											<div>
												<span id="">0</span>
											</div>
										</div>
										<div>
											<a id="" class="btn togl">OFF</a>
										</div>
									</li> -->
									<!-- <li>
										<div>안티 멀웨어 스캔</div>
										<div>
											<div id="malwareTotalCnt">0</div>
											<div>
												<span id="malwareEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="malwareBtn" class="btn togl">OFF</a>
										</div>
									</li> -->
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
							<div class="alertlist_search_cont_grap" id="hostRealtimeChart"></div>
						</div>
					</li>
				</ul>
			</div>
			<div class="alertlist_cont_box">
				<div class="alertlist_top">
					<h3>실시간 로그 조회</h3>
					<ul class="filter_box ab55">
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
								<input type="checkbox" name="checkbox_list" id="hostKeywordFilter" value="">
								<label for="hostKeywordFilter"></label>
							</div>
							<div class="ipt_box">
								<input class="" type="text" placeholder="키워드 Filter 입력 " id="hostKeyword" name="keyword" readonly>
							</div>
						</li>
					</ul>
				</div>
				<div class="alertlist_bottom">
					<div class="tab_box">
						<div class="tab">
							<ul id="host_alert_tab" class="tab_lst">
								<li class="open"><a href="#" class="tab_link" rel="HOST_TOTAL">전체 </a></li>
								<li><a href="#" class="tab_link" rel="FIREWALL"> 방화벽</a></li>
								<li><a href="#" class="tab_link" rel="IPS">침입 방지 시스템</a></li>
								<li><a href="#" class="tab_link" rel="MALWARE">안티 멀웨어</a></li>
								<li><a href="#" class="tab_link" rel="FILE">파일 무결성</a></li>
								<li><a href="#" class="tab_link" rel="APPCTL">실행 파일 통제</a></li>
								<li><a href="#" class="tab_link" rel="PAMACL">서비스 제어</a></li>
							</ul>
						</div>
					</div>
					<div class="tab_container">
						<div class="tabMgmt_1 tab_cont open">
							<div class="alertlist_contents">
								<div class="alertlist" id="hostLogList">
									<!--  p id="IPS">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="AV">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="MALWARE">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="AV">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span> <span style="color: #47c104">2525/udp</span></p>
									<p id="PAMACL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="PAMACL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="FIREWALL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="FILE">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p>
									<p id="APPCTL">2021-11-20 13:52:42 <span style="color: #47c104">Allow</span> 203.0.113.70 <span style="color: #b8ae0d">10.10.0.20</span><span style="color: #47c104">2525/udp</span></p  -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
</section>
</body>
</html>
