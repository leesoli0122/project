<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>사이트 이용 설정 - Aegis</title>
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
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	<script src="./js/service/configure/site.js?v=${version}"></script>
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
	<jsp:param name="menuId" value="siteConfig" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="siteConfig" />
</jsp:include>

<section class="configuration_page mscrollbar">
	<div class="sub">
		<div class="configuration_box">
			<div style="margin-bottom: 8px">
				<div class="dt-buttons">
					<a class="dt-button btn" href="javascript:saveSiteConfigure();"><span>저장</span></a>
				</div>
			</div>
			<div class="col02">
				<dl class="set_opt open">
					<dt class="set_opt_tit">
						<h3><a href="#" class="set_open">로그 분석 서버 관리</a></h3>
					</dt>
					<dd class="set_opt_con">
						<dl>
							<dt>IP</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="사용할 IP를 입력해주세요.(ex : 192.168.1.2)" id="masterip">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>PORT</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="사용할 Port를 입력해주세요.(ex : 7117)" id="masterport">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>ID</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="로그 분석 서버의 ID를 입력해주세요." id="username">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>패스워드</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="password" placeholder="로그 분석 서버의 패스워드를 입력해주세요." id="password">
								</div>
							</dd>
						</dl>
					</dd>
				</dl>
				<dl class="set_opt open">
					<dt class="set_opt_tit">
						<h3><a href="#" class="set_open">로그 수집 서버 관리</a></h3>
					</dt>
					<dd class="set_opt_con">
						<dl>
							<dt>자동 연동</dt>
							<dd>
								<div class="sel_box">
									<select class="popup_sel" id="activeAgent">
										<option value="true" selected>자동연동</option>
										<option value="false">수동연동</option>
									</select>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>자동 연동 수집 건수</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="자동 연동 시 설정 될 수집 건수" id="activeAgentLogCount">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>이름</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="로그 수집 서버의 이름을 입력해주세요(ex : Service)" id="servicename">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>ID</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="로그 수집 서버의 ID를 입력해주세요(ex : Service)" id="serviceid">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>IP</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="로그 수집 서버의 IP를 입력해주세요.(192.168.2.21)" id="serviceip">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>PORT</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="로그 수집 서버의 Port 를 입력해주세요." id="serviceport">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>CODE</dt>
							<dd>
								<div class="sel_box">
									<select class="popup_sel" id="servicecode" disabled>
										<option value="0403X999X999" selected>기본</option>
									</select>
								</div>
							</dd>
						</dl>
					</dd>
				</dl>
			</div>
			<div class="col02">
				<dl class="set_opt open">
					<dt class="set_opt_tit">
						<h3><a href="#" class="set_open">사용자 로그인 설정</a></h3>
					</dt>
					<dd class="set_opt_con">
						<dl>
							<dt>로그인 유지 시간</dt>
							<dd>
								<div class="sel_box">
									<select class="popup_sel" id="loginExpire">
										<option value="10">10분</option>
										<option value="30">30분</option>
										<option value="60">1시간</option>
										<option value="120">2시간</option>
										<option value="240">4시간</option>
										<option value="480">8시간</option>
										<option value="720">12시간</option>
										<option value="1440">24시간</option>
									</select>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>최대 로그인 세션 수(사용 안함=0)</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="서버 내 최대 로그인 세션 수를 입력해주세요(ex : 2)" id="loginLimit">
								</div>
							</dd>
						</dl>
						<dl>
							<dt>로그인 허용 IP(IP1,IP2...)</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text" placeholder="로그인 허용 IP를 입력하세요(ex : 1.1.1.1,2.2.2.2,3.3.3.3)" id="loginAuthIPList">
								</div>
							</dd>
						</dl>
						<dl>
	                        <dt>
								로그인 2차 인증
	                        </dt>
	                        <dd>
	                            <div class="sel_box" id="loginOtp">
	                                <select class="popup_sel">
	                                    <option value="false">비활성화</option>
	                                    <option value="true">활성화</option>
	                                </select>
	                            </div>
	                        </dd>
	                    </dl>
					</dd>
				</dl>
				<dl class="set_opt open">
					<dt class="set_opt_tit">
						<h3><a href="#" class="set_open">로그인 실패 처리</a></h3>
					</dt>
					<dd class="set_opt_con">
						<dl>
							<dt>연속 로그인 실패 허용 횟수</dt>
							<dd>
								<div class="sel_box">
									<select class="popup_sel" id="loginBanCount">
										<option value="-1">사용 안함</option>
										<option value="3">3회</option>
										<option value="4">4회</option>
										<option value="5">5회</option>
									</select>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>계정 잠김 시간 설정</dt>
							<dd>
								<div class="sel_box">
									<select class="popup_sel" id="loginBanTime">
										<option value="5">5분</option>
										<option value="10">10분</option>
										<option value="30">30분</option>
										<option value="60">60분</option>
									</select>
								</div>
							</dd>
						</dl>
					</dd>
				</dl>
				
				<dl class="set_opt open">
                	<dt class="set_opt_tit">
                    	<h3>
                        	<a href="#" class="set_open">
                        		서버 2차 인증 설정
                        	</a>
                    	</h3>
                	</dt>
                	<dd class="set_opt_con">   
                		<dl>
                        	<dt>
								사용 여부
                        	</dt>
                        	<dd>
                        		<div class="sel_box" id="otpActive">
	                                <select class="popup_sel">
	                                    <option value="true">활성화</option>
	                                    <option value="false">비활성화</option>
	                                </select>
	                            </div>
	                        </dd>
                    	</dl>                 
	                    <dl>
	                        <dt>
								벤더
	                        </dt>
	                        <dd>
	                            <div class="sel_box" id="vender">
	                                <select class="popup_sel">
	                                    <option value="totp">기본</option>
	                                    <option value="acotp">ACOTP</option>
	                                    <option value="vascootp">Vasco</option>
	                                    <option value="miraeotp">미래</option>
	                                </select>
	                            </div>
	                        </dd>
	                    </dl>       
                    	<dl>
	                        <dt>
								발급 주체 이름
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="OTP 발급 주체명을 입력하세요(ex : aegis.com)" id="company">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								2차인증 IP
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="OTP 서버 주소를 입력하세요(ex : 192.168.2.21)" id="address">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								Plain-Port 
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="OTP 포트를 입력하세요(ex : 5008)" id="plainPort">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								SSL-Port 
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="OTP 포트를 입력하세요(ex : 5308)" id="sslPort">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								인증 대상 
	                        </dt>
	                        <dd>
	                            <div class="sel_box" id="policy">
	                                <select class="popup_sel">
	                                    <option value="all">전체</option>
	                                    <option value="agent">자산</option>
	                                </select>
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								OTP 시간 오차 허용
	                        </dt>
	                        <dd>
	                            <div class="sel_box" id="window">
	                                <select class="popup_sel">
	                                    <option value="0">없음</option>
	                                    <option value="2">1분</option>
	                                    <option value="4">2분</option>
	                                    <option value="6">3분</option>
	                                    <option value="8">4분</option>
	                                    <option value="10">5분</option>
	                                    <option value="20">10분</option>
	                                </select>
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								OTP 서버 IP
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="Radius 서버 주소를 입력하세요(ex : 192.168.2.21)" id="otpPrimaryHost">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								OTP 서버 보조 IP
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="Radius 보조 서버 주소를 입력하세요(ex : 192.168.2.21)" id="otpSecondaryHost">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								OTP 서버 보조 IP
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="Radius 포트 입력하세요(ex : 1812)" id="otpPort">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								OTP 서버 공개키
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="password" placeholder="Radius 키를 입력하세요(ex : SecretKey)" id="otpSecret">
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								OTP 서버 타임아웃
	                        </dt>
	                        <dd>
	                            <div class="sel_box" id="otpTimeout">
	                                <select class="popup_sel">
	                                    <option value="1">1초</option>
	                                    <option value="3">3초</option>
	                                    <option value="5">5초</option>
	                                    <option value="10">10초</option>
	                                </select>
	                            </div>
	                        </dd>
	                    </dl>
	                    <dl>
	                        <dt>
								OTP 서버 NAS-IP-Address
	                        </dt>
	                        <dd>
	                            <div class="ipt_box">
	                                <input type="text" placeholder="Radius 인증 시 전송 할 NAS-IP-Address 입력하세요(ex : 127.0.0.1)" id="otpClient">
	                            </div>
	                        </dd>
	                    </dl>
                	</dd>
            	</dl>
			</div>
		</div>
	</div>
</section>

</body>
</html>