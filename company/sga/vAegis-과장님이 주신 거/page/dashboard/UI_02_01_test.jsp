<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>대시보드 - Aegis</title>
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
	<link rel="icon" href="/assets/images/favicon.png" type="image/png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	<script src="/js/service/alertlist/alertList.js?v=${version}"></script>
	
	<link rel="stylesheet" href="/assets/css/lib/rickshaw/graph.css">
	<link rel="stylesheet" href="/assets/css/lib/rickshaw/detail.css">
	<link rel="stylesheet" href="/assets/css/lib/rickshaw/legend.css">
	<script src="/assets/js/lib/rickshaw/d3.v3.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Class.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Compat.ClassList.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Area.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Line.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Bar.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.ScatterPlot.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Renderer.Stack.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.RangeSlider.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.RangeSlider.Preview.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.HoverDetail.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Annotate.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Legend.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Axis.Time.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Toggle.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Order.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Behavior.Series.Highlight.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Smoother.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Fixtures.Time.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Fixtures.Time.Local.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Fixtures.Number.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Fixtures.RandomData.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Fixtures.Color.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Color.Palette.js"></script>
	<script src="/assets/js/lib/rickshaw/Rickshaw.Graph.Axis.Y.js"></script>
	
	
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
	<jsp:param name="menuId" value="dashboard" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="dashboard" />
</jsp:include>


<input type="hidden" id="detailJson" value=""></input>
<input type="hidden" id="detailData" value=""></input>
<input type="hidden" id="detailNum" value=""></input>

<section class="alerts_page mscrollbar">
	<article class="alerts_page_tab_btn">
		<div>
			<ul class="alerts_tab_btn_wrap">
				<li class="alerts_tab_btn_list"><a href="#" class="alerts_tab_btn active" data-value="cluster">클러스터</a></li>
				<li class="alerts_tab_btn_list"><a href="#" class="alerts_tab_btn" data-value="host">호스트</a></li>
			</ul>
		</div>
	</article>
	<article class="alert_tab_content" id="clusterTab">
		<div class="sub">
			<div class="alertlist_search_box">
				<ul class="alertlist_search_cont flex_wrap">
					<li class="system_status"><!--system_status 클래스 추가-->
						<div class="alertlist_search_cont_box">
							<div class="alertlist_search_cont_tit">
								<h4 title="">시스템 현황</h4>
							</div>
							<div class="alertlist_search_cont_status">
								<div class="status_top">
									<dl>
										<dt>로그 발생 건수</dt>
										<dd>
											<span id="totalCnt" class="txt_figure">646</span><!--blue 클래스 txt_figure로 변경-->
										</dd>
									</dl>
									<div class="alertlist_btn_box" >
										<a id="clusterStartBtn" href="#" class="btn icon play on" title="전체 데이터 수집 시작">전체 데이터 수집 시작</a>
										<a id="clusterStopBtn" href="#" class="btn icon stop" title="전체 데이터 수집 정지">전체 데이터 수집 정지</a>
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
											<a id="containerSecurityBtn" class="btn togl on">OPEN</a>
										</div>
									</li>
									<li>
										<div>컨테이너 워크로드 실행 제어</div>
										<div>
											<div id="containerWorkloadTotalCnt">410</div>
											<div>
												<span id="containerWorkloadEventCnt">0</span>
											</div>
										</div>
										<div>
											<a id="containerWorkloadBtn" class="btn togl on">OPEN</a>
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
											<a id="imageRunningControlBtn" class="btn togl on">OPEN</a>
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
											<a id="imageSecurityBtn" class="btn togl on">OPEN</a>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</li>
					<li class="last">
						<div class="alertlist_search_cont_box">
							<div class="alertlist_search_cont_tit">
								<h4 title="">로그 발생 현황</h4>
							</div>
							<div class="alertlist_search_cont_grap" id="chart_container">
								<script>
								var dom = document.getElementById('chart_container');
								var myChart = echarts.init(dom, 'dark', {
								  renderer: 'canvas',
								  useDirtyRect: false
								});
								var app = {};

								var option;

								var series = [
								  {
									data: [1.93, 7.28, 3.76, 5.55, 2.88, 1.7, 8.83, 2, 5.69, 1.27, 3.85, 1.65, 9.18, 5.82, 4.85, 2.03, 1.26, 1.56, 5.28, 1.87, 2.66, 1.37, 2.68, 5.84, 8.12, 6.83, 1.3, 5.37, 6.44, 2.21, 6.05],
									type: 'bar',
									stack: 'a',
									//color : "#3faeb8",
									itemStyle: {
										color: '#3faeb8',
										borderType: 'round',
									  },
									name : '이미지 시큐리티'
								  },
								  {
									data: [4.58, 9.46, 2.26, 9.86, 1, 7.27, 7.58, 6.6, 6.98, 4.48, 2.31, 3.33, 7.12, 9.26, 3.92, 2.36, 7.61, 7.96, 4.06, 6.85, 4.5, 5.58, 1.48, 2.16, 4.18, 5.46, 3.48, 4.75, 0.43, 9.65, 5.47],
									type: 'bar',
									stack: 'a',
									color : "#4d67cc",
									name : '컨테이너 워크로드 실행 제어'
								  },
								  {
									data: [5, 9.01, 0.97, 7.4, 8.2, 8.58, 6.1, 8.37, 1.87, 3.98, 2.69, 8.66, 1.01, 6.05, 3.28, 1.53, 8.92, 5, 6, 1, 5, 9, 6.23, 3.56, 5.12, 3.85, 7.58, 3.82, 1.62, 1.92, 4.21],
									type: 'bar',
									stack: 'b',
									color : "#da9527",
									name : '컨테이너 이미지 실행 제어'
								  },
								  {
									data: [9.81, 5.76, 7.32, 6.45, 3.18, 4.3, 5.69, 7, 4.01, 2.48, 5.73, 7.92, 8.53, 5.25, 6.91, 1.46, 3.4, 9.6, 7.01, 3.41, 4.17, 6.13, 2.39, 4.11, 2.52, 1.43, 7.29, 3.98, 7.35, 9.11, 3.16],
									type: 'bar',
									stack: 'b',
									color : "#9f9e9e",
										name : '컨테이너 이벤트'
								  }
								
								];
								const stackInfo = {};
								for (let i = 0; i < series[0].data.length; ++i) {
								  for (let j = 0; j < series.length; ++j) {
									const stackName = series[j].stack;
									if (!stackName) {
									  continue;
									}
									if (!stackInfo[stackName]) {
									  stackInfo[stackName] = {
										stackStart: [],
										stackEnd: []
									  };
									}
									const info = stackInfo[stackName];
									const data = series[j].data[i];
									if (data && data !== '-') {
									  if (info.stackStart[i] == null) {
										info.stackStart[i] = j;
									  }
									  info.stackEnd[i] = j;
									}
								  }
								}
								for (let i = 0; i < series.length; ++i) {
								  const data = series[i].data;
								  const info = stackInfo[series[i].stack];
								  for (let j = 0; j < series[i].data.length; ++j) {
									// const isStart = info.stackStart[j] === i;
									const isEnd = info.stackEnd[j] === i;
									const topBorder = isEnd ? 50 : 0;
									const bottomBorder = 0;
									data[j] = {
									  value: data[j],
									  itemStyle: {
										borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
									  }
									};
								  }
								}
								option = {
								  backgroundColor:'transparent',

								grid: {
										left: '3%',
										right: '3%',
										top:'20',
										bottom: '20',
									},	
								  xAxis: {
									type: 'category',
									data: false
								  },
								  yAxis: {
									type: 'value'
								  },
								  series: series
								};


								if (option && typeof option === 'object') {
								  myChart.setOption(option);
								}

								window.addEventListener('resize', myChart.resize);
								</script>
							</div>
							
						</div>
					</li>
				</ul>
			</div>

			<div class="alertlist_cont_box">
				<div class="alertlist_top">
					<h3>실시간 로그 조회</h3>
					<ul class="filter_box ab55"><!--//ab53 클래스 추가-->
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
									<p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:56:25&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135626&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:25</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;LOW&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너 환경 내 CPU Overcommit  감지&quot;,&quot;ruleId&quot;:&quot;csr_k8s043&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;97d4d30d-31c7-48e4-8d8d-c017c1114e16&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Overcommitting resources within container environments&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.seccompProfile.type] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s012&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너 환경 내 CPU Overcommit  감지]</span> <span style="color: #47c104;"> severity=[LOW]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.seccompProfile.type] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;MEDIUM&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s023&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;97d4d30d-31c7-48e4-8d8d-c017c1114e16&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인]</span> <span style="color: #47c104;"> severity=[MEDIUM]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;LOW&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;호스트 충돌을 피하기 위해 컨테이너가 높은 UID로 실행되는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s022&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;97d4d30d-31c7-48e4-8d8d-c017c1114e16&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsUser] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[호스트 충돌을 피하기 위해 컨테이너가 높은 UID로 실행되는지 확인]</span> <span style="color: #47c104;"> severity=[LOW]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsUser] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;MEDIUM&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;루트 컨테이너 허용 최소화&quot;,&quot;ruleId&quot;:&quot;csr_k8s015&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;97d4d30d-31c7-48e4-8d8d-c017c1114e16&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsNonRoot] in request, [NOT IN] [securityContext.runAsUser] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[루트 컨테이너 허용 최소화]</span> <span style="color: #47c104;"> severity=[MEDIUM]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsNonRoot] in request, [NOT IN] [securityContext.runAsUser] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;HIGH&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s014&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;97d4d30d-31c7-48e4-8d8d-c017c1114e16&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인]</span> <span style="color: #47c104;"> severity=[HIGH]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;MEDIUM&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너가 호스트 프로세스 ID 네임스페이스를 공유하지 않는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s011&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;97d4d30d-31c7-48e4-8d8d-c017c1114e16&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.memory] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너가 호스트 프로세스 ID 네임스페이스를 공유하지 않는지 확인]</span> <span style="color: #47c104;"> severity=[MEDIUM]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.memory] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;LOW&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;CPU limits이 설정되었는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s007&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;97d4d30d-31c7-48e4-8d8d-c017c1114e16&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Overcommitting resources within container environments&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.cpu] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s012&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[CPU limits이 설정되었는지 확인]</span> <span style="color: #47c104;"> severity=[LOW]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.cpu] in request)]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;Pod&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[Pod]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:56:23&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135624&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style="display: block;"> <span>2023-12-21 13:56:23</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:56:04&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135606&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:56:04</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:49&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135550&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:49</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:49&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135550&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:49</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:49&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135550&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:49</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:45&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135546&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:45</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:45&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;Pod&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135546&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;DELETE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:45</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[Pod]</span> <span style="color: #47c104;"> operation=[DELETE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:45&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135546&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:45</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:45&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135546&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:45</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:40&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135542&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:40</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:37&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135538&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:37</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:37&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135538&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:37</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:35&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:35</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:35&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:35</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:35&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:35</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;LOW&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너 환경 내 CPU Overcommit  감지&quot;,&quot;ruleId&quot;:&quot;csr_k8s043&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;eb0ec02c-1a2f-471a-8a92-aba902909387&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Overcommitting resources within container environments&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.seccompProfile.type] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s012&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너 환경 내 CPU Overcommit  감지]</span> <span style="color: #47c104;"> severity=[LOW]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.seccompProfile.type] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;MEDIUM&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s023&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;eb0ec02c-1a2f-471a-8a92-aba902909387&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인]</span> <span style="color: #47c104;"> severity=[MEDIUM]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;LOW&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;호스트 충돌을 피하기 위해 컨테이너가 높은 UID로 실행되는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s022&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;eb0ec02c-1a2f-471a-8a92-aba902909387&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsUser] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[호스트 충돌을 피하기 위해 컨테이너가 높은 UID로 실행되는지 확인]</span> <span style="color: #47c104;"> severity=[LOW]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsUser] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;MEDIUM&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;루트 컨테이너 허용 최소화&quot;,&quot;ruleId&quot;:&quot;csr_k8s015&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;eb0ec02c-1a2f-471a-8a92-aba902909387&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsNonRoot] in request, [NOT IN] [securityContext.runAsUser] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[루트 컨테이너 허용 최소화]</span> <span style="color: #47c104;"> severity=[MEDIUM]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [securityContext.runAsNonRoot] in request, [NOT IN] [securityContext.runAsUser] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;HIGH&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s014&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;eb0ec02c-1a2f-471a-8a92-aba902909387&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인]</span> <span style="color: #47c104;"> severity=[HIGH]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [allowPrivilegeEscalation: false] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;MEDIUM&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;컨테이너가 호스트 프로세스 ID 네임스페이스를 공유하지 않는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s011&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;eb0ec02c-1a2f-471a-8a92-aba902909387&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Privileged Container&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.memory] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s008&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[컨테이너가 호스트 프로세스 ID 네임스페이스를 공유하지 않는지 확인]</span> <span style="color: #47c104;"> severity=[MEDIUM]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.memory] in request)]</span></p><p id="CONTAINER_SECURITY" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;policySeverity&quot;:&quot;MEDIUM&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;ruleCheckResult&quot;:&quot;FAIL&quot;,&quot;checkMethod&quot;:&quot;WEBHOOK&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;ruleSeverity&quot;:&quot;LOW&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1132,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;reference&quot;:&quot;wh_authorization_history.uuid&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;clusterName&quot;:&quot;Openshift-240&quot;,&quot;ruleName&quot;:&quot;CPU limits이 설정되었는지 확인&quot;,&quot;ruleId&quot;:&quot;csr_k8s007&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean&quot;,&quot;referenceKey&quot;:&quot;eb0ec02c-1a2f-471a-8a92-aba902909387&quot;,&quot;clusterUuid&quot;:&quot;e957fea2-1f6a-4ae2-931f-8a5ee1228c4d&quot;,&quot;policyAction&quot;:&quot;ALERT&quot;,&quot;policyName&quot;:&quot;Overcommitting resources within container environments&quot;,&quot;message&quot;:&quot;Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.cpu] in request)&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;policyId&quot;:&quot;csc_k8s012&quot;,&quot;stname&quot;:null}" onclick="containerSecurityAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> cluster=[Openshift-240]</span> <span style="color: yellow;"> rule_name=[CPU limits이 설정되었는지 확인]</span> <span style="color: #47c104;"> severity=[LOW]</span><span>message=[Request(Subject=openshift-operator-lifecycle-manager:olm-operator-serviceaccount, Resource=Pod, Operation=CREATE), Violated details=([NOT IN] [containers.resources.limits.cpu] in request)]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;Pod&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[Pod]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p><p id="CONTAINER_WORKLOAD" data="{&quot;date&quot;:&quot;2023-12-21 13:55:34&quot;,&quot;devID&quot;:&quot;E1681448512793&quot;,&quot;cluster&quot;:&quot;Openshift-240&quot;,&quot;devStatus&quot;:true,&quot;minor&quot;:0,&quot;kind&quot;:&quot;ServiceAccount&quot;,&quot;dn&quot;:&quot;k8s-master&quot;,&quot;message&quot;:&quot;Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다&quot;,&quot;devIP&quot;:&quot;192.168.20.61&quot;,&quot;devName&quot;:&quot;k8s-master&quot;,&quot;systemTime&quot;:&quot;20231221135536&quot;,&quot;plctype&quot;:0,&quot;logclass&quot;:1131,&quot;tableName&quot;:&quot;RESOURCEALERTLOG12&quot;,&quot;result&quot;:&quot;DEFAULT ALLOW&quot;,&quot;logtype&quot;:0,&quot;equip_id&quot;:&quot;E1681448512793&quot;,&quot;major&quot;:0,&quot;namespace&quot;:&quot;openshift-marketplace&quot;,&quot;action&quot;:&quot;ALLOW&quot;,&quot;ruleName&quot;:&quot;Base Rule - Default ALLOW&quot;,&quot;operation&quot;:&quot;CREATE&quot;,&quot;class&quot;:&quot;olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean&quot;,&quot;stname&quot;:null}" onclick="containerWorkloadAlertListClick(this);" style=""> <span>2023-12-21 13:55:34</span> <span style="color: red;"> result=[DEFAULT ALLOW]</span> <span style="color: yellow;"> rule_name=[Base Rule - Default ALLOW]</span> <span style="color: #47c104;"> cluster=[Openshift-240]</span> <span style="color: #47c104;"> namespace=[openshift-marketplace]</span> <span style="color: #47c104;"> kind=[ServiceAccount]</span> <span style="color: #47c104;"> operation=[CREATE]</span> <span>message=[Allowed by Base rule: 컨테이너 워크로드 실행제어 정책이 설정되지 않았습니다]</span></p>
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
