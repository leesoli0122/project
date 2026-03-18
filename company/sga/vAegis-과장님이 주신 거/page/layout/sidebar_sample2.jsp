<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8" %>
	<% String menuId=request.getParameter("menuId"); // 선택한 메뉴의 상위 메뉴를 actice 하기위한 로직 boolean eventList=false; // 이벤트 조회
		boolean hostEventList=false; // 이벤트 조회> 호스트 이벤트
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
	<!--<div class="logo_box">
		<a href="./dashboard.do" class="logo_link">
			<div class="logo_hidden_box">
				<img src="./assets/images/logo.png" />
			</div>
		</a>
	</div>-->
	<nav>
		<!-- 2023-11-08 : cAegis / Aegis(cAegis + vAegis) 분기 처리-->
		<!--2023-11-08 : cAegis 수정-->
		<ul class="lnb cAegis" style="display:none;">
			<!-- 대시보드 -->
			<li class=""><a href="./dashboard.do" class="menu01"><span>Dashboard</span></a>
				<ul class="depth2">
					<li class="has_children"><a href="#" class="menu01_1"><span>컨테이너 워크로드 현황</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>컨테이너 워크로드 현황</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="#" class="menu01_2"><span>컨테이너 이미지 스캔</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>컨테이너 이미지 스캔, 배포 제어 현황</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="#" class="menu01_3"><span>클러스터 규정준수 스캔</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>클러스터 규정준수 스캔 현황</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="#" class="menu01_4"><span>컨테이너 이벤트</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>컨테이너 이벤트 이벤트 발생 현황</span></a></li>
						</ul>
					</li>
				</ul>
			</li>

			<!-- 이벤트 모니터링 -->
			<li class=""><a href="./eventMonitoring.do" class="menu02"><span>이벤트 모니터링</span></a>
				<ul class="depth2">
					<li class=""><a href="#"class="menu02_1"><span>컨테이너 워크로드 실행 제어</span></a></li>
					<li class=""><a href="#"class="menu02_2"><span>컨테이너 이미지 실행 제어</span></a></li>
					<li class=""><a href="#"class="menu02_3"><span>컨테이너 이미지 스캔</span></a></li>
					<li class=""><a href="#"class="menu02_4"><span>컨테이너 이벤트</span></a></li>
				</ul>
			</li>

			<!-- 이벤트 조회 -->
			<li class="has_children"><a href="#" class="menu03"><span>이벤트 조회</span></a>
				<ul class="depth2">
					<li><a href="./eventWorkload.do" class="menu03_1"><span>컨테이너 워크로드 실행제어</span></a></li>
					<li><a href="./eventContainerImageControl.do" class="menu03_2"><span>컨테이너 이미지 실행제어</span></a></li>
					<li><a href="./eventImageSecurity.do" class="menu03_3"><span>컨테이너 이미지 스캔</span></a></li>
					<li><a href="./eventContainerSecurity.do" class="menu03_4"><span>컨테이너 이벤트</span></a></li>
					<li><a href="./eventCompliance.do" class="menu03_5"><span>클러스터 규정준수 스캔</span></a></li>
				</ul>
			</li>

			<!-- 스캔 --> <!-- 230220 스캔 카테고리 추가(멀웨어는 vaegis 멀웨어 통합검사로 잠시 대체) -->
			<li class="has_children"><a href="#" class="menu04"><span>스캔</span></a>
				<ul class="depth2">
					<li><a href="menu04_1"><span>클러스터 규정준수 스캔</span></a></li>
					<li><a href="menu04_2"><span>컨테이너 이미지 스캔</span></a></li>
				</ul>
			</li>
			<!-- 정책관리 -->
			<li class="has_children"><a href="#" class="menu05"><span>관리</span></a>
				<ul class="depth2">
					<li><a href="./policyContainerSecurity.do" class="menu05_1"><span>컨테이너 이벤트 정책</span></a></li>
					<li><a href="./policyWorkload.do" class="menu05_2"><span>컨테이너 워크로드 실행제어 정책</span></a></li>
					<li><a href="./policyImageSecurity.do" class="menu05_3"><span>컨테이너 이미지 스캔 정책</span></a></li>
					<li><a href="./policyComplianceScan.do" class="menu05_4"><span>클러스터 규정준수 스캔 정책</span></a></li>
					<li><a href="./cloudManager.do" class="menu05_5"><span>자산 관리</span></a></li>
					<li><a href="" class="menu05_6"><span>사용자 관리</span></a></li>
				</ul>
			</li>
			<!-- 환경설정 -->
			<li class="has_children active"><a href="#" class="menu06"><span>환경 설정</span></a>
				<ul class="depth2">
					<li><a href="./authManager.do" class="menu06_1"><span>메뉴 권한 설정</span></a></li>
					<li class="has_children"><a href="./siteManager.do" class="menu06_2"><span>사이트 이용 설정</span></a>
						<ul class="depth3">
							<li class=""><a href=""><span>사이트 이용 설정</span></a></li>
						</ul>
					</li>
					<li><a href="" class="menu06_3"><span>감사 로그</span></a></li>
				</ul>
			</li>
		</ul>

		<!--2023-11-08 : Aegis 추가-->
		<ul class="lnb Aegis">
			<!-- 대시보드 -->
			<li class=""><a href="./dashboard.do" class="menu01"><span>Dashboard</span></a>
				<ul class="depth2">
					<li class="has_children"><a href="#" class="menu01_1"><span>컨테이너 워크로드 현황</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>컨테이너 워크로드 현황</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="#" class="menu01_2"><span>컨테이너 이미지 스캔</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>컨테이너 이미지 스캔, 배포 제어 현황</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="#" class="menu01_3"><span>클러스터 규정준수 스캔</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>클러스터 규정준수 스캔 현황</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="#" class="menu01_4"><span>컨테이너 이벤트</span></a>
						<ul class="depth3">
							<li><a href="" class=""><span>컨테이너 이벤트 이벤트 발생 현황</span></a></li>
						</ul>
					</li>
				</ul>
			</li>

			<!-- 이벤트 모니터링 -->
			<li class=""><a href="./eventMonitoring.do" class="menu02"><span>이벤트 모니터링</span></a>
				<ul class="depth2">
					<!--호스트 이벤트-->
					<li class="has_children"><a href="#" class="menu02_1"><span>호스트 이벤트</span></a>
						<ul class="depth3">
							<li><a href="#"class=""><span>방화벽</span></a></li>
							<li><a href="#"class=""><span>침입 방지 시스템</span></a></li>
							<li><a href="#"class=""><span>안티 멀웨어</span></a></li>
							<li><a href="#"class=""><span>파일 무결성</span></a></li>
							<li><a href="#"class=""><span>실행 파일 제어</span></a></li>
							<li><a href="#"class=""><span>서비스 제어</span></a></li>
						</ul>
					</li>
					<!--클러스터 이벤트-->
					<li class="has_children"><a href="#" class="menu02_2"><span>클러스터 이벤트</span></a>
						<ul class="depth3">
							<li><a href="#"class=""><span>컨테이너 워크로드 실행 제어</span></a></li>
							<li><a href="#"class=""><span>컨테이너 이미지 실행 제어</span></a></li>
							<li><a href="#"class=""><span>컨테이너 이미지 스캔</span></a></li>
							<li><a href="#"class=""><span>컨테이너 이벤트</span></a></li>
						</ul>
					</li>
				</ul>
			</li>

			<!-- 이벤트 조회 -->
			<li class="has_children"><a href="#" class="menu03"><span>이벤트 조회</span></a>
				<ul class="depth2">
					<!-- 호스트 이벤트 -->
					<li class="has_children"><a href="#" class="menu03_1"><span>호스트 이벤트</span></a>
						<ul class="depth3">
							<li><a href="./eventFirewall.do" class=""><span>방화벽</span></a></li>
							<li><a href="./eventIPS.do" class=""><span>침입 방지 시스템</span></a></li>
							<li><a href="" class=""><span>멜웨어 스캔</span></a></li>
							<li><a href="./eventFileInt.do" class=""><span>파일 무결성</span></a></li>
							<li><a href="./eventFileCtl.do" class=""><span>실행 파일 제어</span></a></li>
							<li><a href="./eventPamAcl.do" class=""><span>서비스 제어</span></a></li>
						</ul>
					</li>
					<!-- 클러스터 이벤트 -->
					<li class="has_children"><a href="#" class="menu03_2"><span>클러스터 이벤트</span></a>
						<ul class="depth3">
							<li><a href="./eventWorkload.do" class=""><span>컨테이너 워크로드 실행제어</span></a></li>
							<li><a href="./eventContainerImageControl.do" class=""><span>컨테이너 이미지 실행제어</span></a></li>
							<li><a href="./eventImageSecurity.do" class=""><span>컨테이너 이미지 스캔</span></a></li>
							<li><a href="./eventContainerSecurity.do" class=""><span>컨테이너 이벤트</span></a></li>
							<li><a href="./eventCompliance.do" class=""><span>클러스터 규정준수 스캔</span></a></li>
						</ul>
					</li>
				</ul>
			</li>

			<!-- 스캔 -->
			<li class="has_children"><a href="#" class="menu04"><span>스캔</span></a>
				<ul class="depth2">
					<li class="has_children"><a href="./complianceScan.do" class="menu04_1"><span>클러스터 규정준수</span></a>
						<ul class="depth3">
							<li><a href=""><span>클러스터 규정준수 스캔</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="./imageScan.do" class="menu04_2"><span>컨테이너 이미지</span></a>
						<ul class="depth3">
							<li><a href=""><span>컨테이너 이미지 스캔</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="./cloudScan.do" class="menu04_3"><span>호스트 안티 멀웨어</span></a>
						<ul class="depth3">
							<li><a href=""><span>멀웨어 통합/수동검사/예외설정</span></a></li>
						</ul>
					</li>
					<li class="has_children"><a href="./vulnerability.do" class="menu04_4"><span>호스트 취약성</span></a>
						<ul class="depth3">
							<li><a href=""><span>호스트 취약성 스캔</span></a></li>
						</ul>
					</li>
				</ul>
			</li>
			<!-- 정책관리 -->
			<li class="has_children"><a href="#" class="menu05"><span>관리</span></a>
				<ul class="depth2">
					<li><a href="#" class="menu05_1"><span>호스트 정책</span></a></li>
					<!-- 클러스터 정책 -->
					<li class="has_children"><a href="#" class="menu05_2"><span>클러스터 정책</span></a>
						<ul class="depth3">
							<li><a href="./policyContainerSecurity.do" class=""><span>컨테이너 이벤트 정책</span></a></li>
							<li><a href="./policyWorkload.do" class=""><span>컨테이너 워크로드 실행제어 정책</span></a></li>
							<li><a href="./policyImageSecurity.do" class=""><span>컨테이너 이미지 스캔 정책</span></a></li>
							<li><a href="./policyComplianceScan.do" class=""><span>클러스터 규정준수 스캔 정책</span></a></li>
						</ul>
					</li>
					<li><a href="./cloudManager.do" class="menu05_3"><span>자산 관리</span></a></li>
					<li><a href="./userManager.do" class="menu05_4"><span>사용자 관리</span></a></li>
				</ul>
			</li>
			<!-- 환경설정 -->
			<li class="has_children"><a href="#" class="menu06"><span>환경 설정</span></a>
				<ul class="depth2">
					<li><a href="./authManager.do" class="menu06_1"><span>메뉴 권한 설정</span></a></li>
					<li><a href="./siteManager.do" class="menu06_2"><span>사이트 이용 설정</span></a></li>
					<li><a href="" class="menu06_3"><span>감사 로그</span></a></li>
				</ul>
			</li>
		</ul>
	</nav>
</header>