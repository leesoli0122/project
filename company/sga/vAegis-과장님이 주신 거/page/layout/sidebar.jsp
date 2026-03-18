<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%
String menuId = request.getParameter("menuId");

// 선택한 메뉴의 상위 메뉴를 actice 하기위한 로직 
boolean eventList = false; // 이벤트 조회
boolean hostEventList = false; // 이벤트 조회 > 호스트 이벤트
boolean clusterEventList = false; // 이벤트 조회 > 클러스터 이벤트
boolean scanList = false; // 스캔
boolean policyList = false; // 정책 관리
boolean hostPolicyList = false; // 정책 관리
boolean clusterPolicyList = false; // 정책 관리
boolean envList = false; // 환경 설정

switch (menuId) {
// 주석처리되어있는 메뉴는 제외하고 작성되었습니다.

// 이벤트 조회 > 호스트 이벤트
case "firewallEvent": // 방화벽
case "ipsEvent": // 침입방지시스템
case "malwareEvent": // 멀웨어
case "fileIntEvent": // 파일 무결성
case "fileCtlEvent": // 실행 파일 통제
case "pamAclEvent": // 서비스제어
	hostEventList = true;
	eventList = true;
	break;

//이벤트 조회 > 클러스터 이벤트
case "containerSecurityEvent": // 컨테이너 이벤트
case "workloadEvent": // 컨테이너 워크로드 실행제어
case "containerImageControlEvent": // 컨테이너 이미지 실행제어
case "imageSecurityEvent": // 컨테이너 이미지 스캔
case "complianceEvent": // 클러스터 규정준수 스캔
	clusterEventList = true;
	eventList = true;
	break;

// 스캔
case "complianceScan": // 클러스터 규정 준수
case "imageScan": // 컨테이너 이미지
case "cloudScan": // 안티 멀웨어
case "vulnerabilityScan": // 호스트 취약성
	scanList = true;
	break;

// 정책 관리
case "cloudManager": // 자산 관리
case "userConfig": // 사용자 관리
case "auditList": // 감사로그
	policyList = true;
	break;

// 정책 관리 > 호스트 정책
case "securityPolicy": // 탐지 룰 관리
	hostPolicyList = true;
	policyList = true;
	break;

// 정책관리 > 클러스터 정책
case "policyContainerSecurity": // 컨테이너 이벤트 정책관리
case "policyWorkload": // 컨테이너 워크로드 실행제어
case "policyImageSecurity": // 클러스터 이미지 스캔
case "policyComplianceScan": // 클러스터 규정준수 스캔
	clusterPolicyList = true;
	policyList = true;
	break;

// 환경 설정
case "authConfig": // 메뉴 권한 설정
case "siteConfig": // 사이트 이용 설정
	envList = true;
	break;

default:
	break;
}
%>
<style>
	.header_box.on nav .lnb>li .depth2>li.has_children>a {
		pointer-events: auto;
		cursor: pointer;
	}
</style>
<header class="header_box">
<div class="logo_box">
	<a href="./dashboard.do" class="logo_link">
		<div class="logo_hidden_box">
			<img src="../../assets/images/logo.png" />
		</div>
	</a>
</div>
<nav>
	<ul class="lnb">
		<!-- 대시보드 -->
		<li class="<%=(menuId.equals("dashboard") ? "active" : "")%>"><a href="./dashboard.do" class="menu01"><span>대시보드</span></a></li>
		<!-- 이벤트 모니터링 -->
		<%-- <li class="<%= (menuId.equals("alertList") ? "active" : "")  %>"><a href="./alertList.do" class="menu02"><span>이벤트 모니터링</span></a></li> --%>
		<li class="<%=(menuId.equals("eventMonitoring") ? "active" : "")%>"><a href="./eventMonitoring.do" class="menu02"><span>이벤트 모니터링</span></a></li>
		<!-- 이벤트 조회 --> <!-- 230118 이벤트 모니터링(cAegis) 추가 -->
		<li class="<%=(eventList ? "active" : "")%>"><a href="#" class="menu03"><span>이벤트 조회</span></a>
			<ul class="depth2">
				<li class="<%=(hostEventList ? "active" : "")%>"><a href="#" class="menu03_1"><span>호스트 이벤트</span></a>
					<ul class="depth3">
						<!-- 호스트 이벤트 -->
						<li><a href="./eventFirewall.do" class="<%=(menuId.equals("firewallEvent") ? "on" : "")%>"><span>방화벽</span></a></li>
						<li><a href="./eventIPS.do" class="<%= (menuId.equals("ipsEvent") ? "on" : "")  %>"><span>침입방지시스템</span></a></li>
						<li><a href="./eventMalware.do" class="<%= (menuId.equals("malwareEvent") ? "on" : "")  %>"><span>멀웨어</span></a></li>
						<li><a href="./eventFileInt.do" class="<%=(menuId.equals("fileIntEvent") ? "on" : "")%>"><span>파일 무결성</span></a></li>
						<li><a href="./eventFileCtl.do" class="<%=(menuId.equals("fileCtlEvent") ? "on" : "")%>"><span>실행 파일 통제</span></a></li>
						<li><a href="./eventPamAcl.do" class="<%= (menuId.equals("pamAclEvent") ? "on" : "")  %>"><span>서비스 제어</span></a></li>
					</ul>
				</li>
				<li class="<%=(clusterEventList ? "active" : "")%>"><a href="#" class="menu03_2"><span>클러스터 이벤트</span></a>
					<ul class="depth3">
						<!-- 클러스터 아벤트 -->
						<li><a href="./eventContainerSecurity.do" class="<%=(menuId.equals("containerSecurityEvent") ? "on" : "")%>"><span>컨테이너 이벤트</span></a></li>
						<li><a href="./eventWorkload.do" class="<%=(menuId.equals("workloadEvent") ? "on" : "")%>"><span>컨테이너 워크로드 실행제어</span></a></li>
						<li><a href="./eventContainerImageControl.do" class="<%=(menuId.equals("containerImageControlEvent") ? "on" : "")%>"><span>컨테이너 이미지 실행제어</span></a></li>
						<li><a href="./eventImageSecurity.do" class="<%=(menuId.equals("imageSecurityEvent") ? "on" : "")%>"><span>컨테이너 이미지 스캔</span></a></li>
						<li><a href="./eventCompliance.do" class="<%=(menuId.equals("complianceEvent") ? "on" : "")%>"><span>클러스터 규정준수 스캔</span></a></li> 
					</ul>
				</li>
			</ul>
		</li>
		<!-- ?? -->
		<%-- <li class="<%= (menuId.equals("cloudScan") || menuId.equals("malwareScan") || menuId.equals("malwareExcept") ? "active" : "")  %>">
			<a href="#" class="menu04"><span>멀웨어</span></a>
			<ul class="depth2">
				<li><a href="./cloudScan.do" class="<%= (menuId.equals("cloudScan") ? "on" : "")  %>"><span>멀웨어 통합 검사</span></a></li>
				<li><a href="./scanMalware.do" class="<%= (menuId.equals("malwareScan") ? "on" : "")  %>"><span>멀웨어 수동 검사</span></a></li>
				<li><a href="./exceptMalware.do" class="<%= (menuId.equals("malwareExcept") ? "on" : "")  %>"><span>멀웨어 예외 설정</span></a></li>
			</ul>
		</li> --%>
		<!-- 스캔 --> <!-- 230220 스캔 카테고리 추가(멀웨어는 vaegis 멀웨어 통합검사로 잠시 대체) -->
		<li class="<%=(scanList ? "active" : "")%>"><a href="#" class="menu04"><span>스캔</span></a>
			<ul class="depth2">
				<li><a href="./complianceScan.do" class="<%=(menuId.equals("complianceScan") ? "on" : "")%>"><span>클러스터 규정 준수</span></a></li>
				<li><a href="./imageScan.do" class="<%=(menuId.equals("imageScan") ? "on" : "")%>"><span>컨테이너 이미지</span></a></li>
				<li><a href="./cloudScan.do" class="<%=(menuId.equals("cloudScan") ? "on" : "")%>"><span>호스트 안티 멀웨어</span></a></li>
				<li><a href="./vulnerability.do" class="<%=(menuId.equals("vulnerabilityScan") ? "on" : "")%>"><span>호스트 취약성</span></a></li>
			</ul>
		</li>
		<!-- 정책관리 -->
		<li class="<%=(policyList ? "active" : "")%>"><a href="#" class="menu06"><span>정책 관리</span></a>
			<ul class="depth2">
				<li class="<%=(hostPolicyList ? "active" : "")%>"><a href="#" class="menu06_1"><span>호스트 정책</span></a>
					<ul class="depth3">
						<li><a href="./securityPolicy.do" class="<%= (menuId.equals("securityPolicy") ? "on" : "")  %>"><span>탐지 룰 관리</span></a></li>
					</ul>
				</li>
				<li class="<%=(clusterPolicyList ? "active" : "")%>"><a href="#" class="menu06_2"><span>클러스터 정책</span></a>
					<ul class="depth3">
						<li><a href="./policyContainerSecurity.do" class="<%=(menuId.equals("policyContainerSecurity") ? "on" : "")%>"><span>컨테이너 이벤트</span></a></li>
						<li><a href="./policyWorkload.do" class="<%=(menuId.equals("policyWorkload") ? "on" : "")%>"><span>컨테이너 워크로드 실행제어</span></a></li>
						<li><a href="./policyImageSecurity.do" class="<%=(menuId.equals("policyImageSecurity") ? "on" : "")%>"><span>컨테이너 이미지 스캔</span></a></li>
						<li><a href="./policyComplianceScan.do" class="<%=(menuId.equals("policyComplianceScan") ? "on" : "")%>"><span>클러스터 규정준수 스캔</span></a></li>
					</ul>
				</li>
				<li><a href="./cloudManager.do" class="<%=(menuId.equals("cloudManager") ? "on" : "")%>"><span>자산 관리</span></a></li>
				<li><a href="./userManager.do" class="<%=(menuId.equals("userConfig") ? "on" : "")%>"><span>사용자 관리</span></a></li>
				<li><a href="./auditList.do" class="<%=(menuId.equals("auditList") ? "on" : "")%>"><span>감사 로그</span></a></li>
						<%-- <li><a href="./policyManagement.do" class="<%=(menuId.equals("policyManagement") ? "on" : "")%>"><span>탐지 룰 관리</span></a></li> --%>
				<%-- <li><a href="./cloudManager.do" class="<%= (menuId.equals("cloudManagerContainer") ? "on" : "")  %>"><span>자산 관리</span></a></li> --%>
			</ul>
		</li>
		<!-- 환경설정 -->
		<li class="<%=(envList ? "active" : "")%>"><a href="#" class="menu05"><span>환경 설정</span></a>
			<ul class="depth2">
				<li><a href="./authManager.do" class="<%= (menuId.equals("authConfig") ? "on" : "")  %>"><span>메뉴 권한 설정</span></a></li>
				<li><a href="./siteManager.do" class="<%= (menuId.equals("siteConfig") ? "on" : "")  %>"><span>사이트 이용 설정</span></a></li>
			</ul>
		</li>
	</ul>
</nav>
</header>