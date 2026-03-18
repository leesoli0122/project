<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
    
<head>
	<title>탐지 룰 관리 - Aegis</title>
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
	<link rel="icon" href="/assets/images/favicon.png" type="favicon.png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common_sample.jsp"%>
	<script src="/js/service/securityPolicy/securityPolicy.js?v=${version}"></script>
	<script src="/js/service/securityPolicy/loadModal.js?v=${version}"></script>
    <script src="/js/service/securityPolicy/editPolicyModal.js?v=${version}"></script>
    <script src="/js/service/securityPolicy/editAssetModal.js?v=${version}"></script>
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
		<jsp:param name="menuId" value="securityPolicy" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="securityPolicy" />
	</jsp:include>

	<input type="hidden" id="checkedAgentList" name="checkedAgentList">
	<input type="hidden" id="editRuleIdx" name="editRuleIdx">
	<input type="hidden" id="checkDef" name="0">

	<section class="securitypolicy_page mscrollbar">
		<div class="sub">
			<div class="securitypolicy_box">
				<div class="tbl rowcol">
					<table class="click">
						<colgroup>
							<col>
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
							<col width="6%">
						</colgroup>
						<thead>
							<tr>
								<th rowspan="2" class="bt_w">그룹</th><!--bt_w 클래스 추가-->
								<th colspan="2">상태</th>
								<th colspan="2">침입방지시스템</th>
								<th colspan="2">방화벽</th>
								<th colspan="2">멀웨어</th>
								<th colspan="2">파일무결성</th>
								<th colspan="2">실행 파일 통제</th>
								<th colspan="2">서비스 제어</th>
							</tr>
							<tr>
								<th>정상</th>
								<th>비정상</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
								<th>적용</th>
								<th>미적용</th>
							</tr>
						</thead>
						<tbody id="groupStatTable"></tbody>
					</table>
				</div>
			</div>
			<div class="securitypolicy_box">
				<div class="securitypolicy_title">
					<div class="securitypolicy_title_left">
						<h3>AGENT LIST</h3>
						<!-- dl class="fl">
						<dt>장비그룹</dt>
						<dd id="groupName"></dd>
					</dl -->
						<dl class="fl">
							<dt>총개수</dt>
							<dd id="deviceCnt"></dd>
						</dl>
					</div>
					<div class="securitypolicy_title_right">
						<dl class="fl">
							<dt>정보</dt>
							<dd>
								<a href="javascript:window.open('/vulnerability.do', '', 'width=1200,height=840,location=no,status=no,scrollbars=no');" class="btn line" >취약점 조회</a>
								<a href="javascript:window.open('/processView.do', '', 'width=1200,height=840,location=no,status=no,scrollbars=no');" class="btn line" >프로세스 조회</a>
							</dd>
						</dl>
						<dl class="fl">
							<dt>기본정책</dt>
							<dd>
								<a href="#" class="btn line def" rel="policy_add" name="ips">침입방지시스템</a>
								<a href="#" class="btn line def" rel="policy_add" name="malware">멀웨어</a>
							</dd>
						</dl>						
						<dl class="fl">
							<dt>검색어</dt>
							<dd>
								<div class="ipt_box">
									<input class="" type="text" placeholder="장비명, IP를 입력하여 주십시오." id="searchKeyword" name="searchKeyword">
								</div>
								<a id="searchBtn" href="#" class="btn serch">검색</a>
							</dd>
						</dl>
					</div>
				</div>
				<div class="securitypolicy_contain">
					<ul id="deviceList" class="securitypolicy_cont">
						<!-- li>
						<div class="securitypolicy_cont_box">
							<div class="securitypolicy_cont_tit">
								<h4 title="">Centos8-21(192.168.2.21)</h4>
								<div class="online">Online</div>
							</div>
							<div class="securitypolicy_cont_list">
								<ul>
									<li>
										<div>IPS</div>
										<div>
											<a href="#" onclick="window.open('securitypolicy_popup_win.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">
												<div>rev 362</div>
												<div class="info nol" title="기본정책">기본정책</div>
												<div class="info pol" title="정책적용됨">정책적용됨</div>
											</a>
										</div>
										<div>
											<a class="btn icon add" onclick="window.open('securitypolicy_popup_win5.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">정책추가</a>
										</div>
									</li>
									<li>
										<div>방화벽</div>
										<div>
											<a href="#" onclick="window.open('securitypolicy_popup_win2.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">
												<div>rev 362</div>
												<div class="info ind" title="개별정책">개별정책</div>
												<div class="info pol" title="정책적용됨">정책적용됨</div>
											</a>
										</div>
										<div>
											<a class="btn icon del">정책삭제</a>
											<a class="btn icon edit" onclick="window.open('securitypolicy_popup_win6.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">정책편집</a>
										</div>
									</li>
									<li>
										<div>AntiMalware</div>
										<div>
											<a href="#" onclick="window.open('securitypolicy_popup_win.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">
												<div>rev 362</div>
												<div class="info nol" title="기본정책">기본정책</div>
												<div class="info pol none" title="정책적용안됨">정책적용안됨</div>
											</a>
										</div>
										<div>
											<a class="btn icon add" onclick="window.open('securitypolicy_popup_win5.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">정책추가</a>
										</div>
									</li>
									<li>
										<div>파일무결성</div>
										<div>
											<a href="#" onclick="window.open('securitypolicy_popup_win3.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">
												<div>rev 362</div>
												<div class="info ind" title="개별정책">개별정책</div>
												<div class="info pol none" title="정책적용안됨">정책적용안됨</div>
											</a>
										</div>
										<div>
											<a class="btn icon del">정책삭제</a>
											<a class="btn icon edit" onclick="window.open('securitypolicy_popup_win7.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">정책편집</a>
										</div>
									</li>
									<li>
										<div>실행 파일 통제</div>
										<div>
											<a href="#" onclick="window.open('securitypolicy_popup_win3.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">
												<div>rev 362</div>
												<div class="info nol none" title="기본정책없음">기본정책없음</div>
												<div class="info ind none" title="개별정책없음">개별정책없음</div>
												<div class="info pol none" title="정책적용안됨">정책적용안됨</div>
											</a>
										</div>
										<div>
											<a class="btn icon add" onclick="window.open('securitypolicy_popup_win7.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">정책추가</a>
										</div>
									</li>
									<li>
										<div>서비스 제어</div>
										<div>
											<a href="#" onclick="window.open('securitypolicy_popup_win4.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">
												<div>rev 362</div>
												<div class="info ind none" title="개별정책없음">개별정책없음</div>
												<div class="info pol none" title="정책적용안됨">정책적용안됨</div>
											</a>
										</div>
										<div>
											<a class="btn icon add" onclick="window.open('securitypolicy_popup_win8.html','','width=786,height=850,location=no,status=no,scrollbars=yes');">정책추가</a>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</li -->
					</ul>
				</div>
			</div>
		</div>
	</section>
	
	<div id="policy_edit" class="modal mid win_popup rec mscrollbar" style="height: 100%;">
		<h4 id="title" data-type=""></h4>
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<div class="securitypolicy_top">
					<h5>revision 정보</h5>
					<div class="securitypolicy_top_info">
						<dl>
							<dt>revision</dt>
							<dd>
								<div class="rev">
									<div id="rev"></div>
									<div id="nol" class="info nol none" title="기본정책">기본정책</div>
									<div id="ind" class="info ind none" title="개별정책">개별정책</div>
									<a href="#" class="btn bline rev_list_btn"><span>대상 선택</span></a>
									<ul id="rev_list" class="rev_list mscrollbar">
										<!-- li>
											<a href="#">
												<div class="rev fl">
													<div>rev 362</div>
													<div class="info nol" title="기본정책">기본정책</div>
													<div class="info pol" title="정책적용됨">정책적용됨</div>
												</div>
												<p class="fl">
													<span>12</span>대 / 생성시간 : <span>2020-11-06 12:23</span> / 등록 사용자 : <span>이종화</span>(<span>jonghlee</span>) / <span>2020년 4분기 정기 업데이트 담당자 : 오인수 사원</span>
												</p>
											</a>
										</li -->
									</ul>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>사용자 및 생성시간</dt>
							<dd>
								<span id="userid"></span> / <span id="createtime"></span>
							</dd>
						</dl>
						<dl>
							<dt>변경 사항</dt>
							<dd>
								<div class="ipt_box">
									<input type="text" id="description" name="description" value="" placeholder="변경사항을 입력하여 주십시오." class="no_radius">
								</div>
							</dd>
						</dl>
					</div>
					<div class="securitypolicy_btn">
						<div class="sel_box fr">
							<select id="mode" name="mode" class="mid">
								<option value="3" selected="selected">ON</option>
								<option value="0">OFF</option>
							</select>
						</div>
					</div>
				</div>
				<div class="securitypolicy_bottom">
					<h5>룰 편집</h5>
					<div class="securitypolicy_bottom_info">
						<!-- div class="ips_rule edit">
							<textarea></textarea>
						</div -->
						<div id="rule_edit" class="tbl moving">
							<!-- table class="click">
								<colgroup>
									<col width="10%">
									<col width="12%">
									<col width="auto">
									<col width="15%">
								</colgroup>
								<thead>
									<tr>
										<th>우선순위</th>
										<th>모드</th>
										<th>파일</th>
										<th>관리</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<div class="move_icon">1</div>
										</td>
										<td class="long_w">ON</td>
										<td class="long_w tl">/tmp/mcliZokhb</td>
										<td class="long_w">
											<div>
												<a class="btn icon del">룰 삭제</a>
												<a class="btn icon edit">룰 편집</a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="move_icon">2</div>
										</td>
										<td class="long_w">ON</td>
										<td class="long_w tl">/tmp/mclzaKmfa</td>
										<td class="long_w">
											<div>
												<a class="btn icon del">룰 삭제</a>
												<a class="btn icon edit">룰 편집</a>
											</div>
										</td>
									</tr>
	 							</tbody>
							</table -->
						</div>
						<div class="equiplist_search">
							<div class="search_cont">
								<div class="sel_box fl">
									<select name="equipSearch" class="">
										<option value="equipname" selected="selected">장비명</option>
										<option value="masterip">장비IP</option>
										<option value="osver">비고</option>
									</select>
								</div>
								<div class="ipt_box fl">
									<input type="text" placeholder="장비를 검색하여 주십시오" name="equipKeyword">
									<a href="#" class="" rel="equip_search_btn">장비 검색</a>
								</div>
							</div>
							<a href="#" class="btn grey">검색 초기화</a>
						</div>
						<div class="equiplist tbl">
							<table class="click">
								<colgroup>
									<col width="8%">
									<col width="25%">
									<col width="auto">
									<col width="35%">
								</colgroup>
								<thead>
									<tr>
										<th>
											<div class="chk_box">
												<input type="checkbox" name="all_checkbox" id="chk00" value="">
												<label for="chk00"></label>
											</div>
										</th>
										<th>장비IP</th>
										<th>장비명</th>
										<th>비고</th>
									</tr>
								</thead>
								<tbody id="equip_list">
									<!-- tr>
										<td>
											<div class="chk_box">
												<input type="checkbox" name="checkbox_list" id="check01" value="">
												<label for="check01"></label>
											</div>
										</td>
										<td class="long_w tl">000.000.000.000</td>
										<td class="long_w tl">None</td>
										<td class="long_w tl">None</td>
									</tr>
									<tr>
										<td>
											<div class="chk_box">
												<input type="checkbox" name="checkbox_list" id="check02" value="">
												<label for="check02"></label>
											</div>
										</td>
										<td class="long_w tl">192.168.2.10</td>
										<td class="long_w tl">General</td>
										<td class="long_w tl">General</td>
									</tr -->
								</tbody>
							</table>
						</div>
					</div>
					<div class="securitypolicy_btn">
						<div class="btn_wrap fr">
							<a href="#" class="btn" rel="process_view_btn" style="display: none;">조회</a>
							<a href="#" class="btn" rel="policy_edit_btn">업데이트</a>
							<a href="#" class="btn securitypolicy_add_btn policy_option" style="display: none;"><span>옵션</span></a>
							<a href="#" class="btn bline securitypolicy_add_btn policy_body" rel="rule_add_btn" style="display: none;"><span>정책추가</span></a>
						</div>
					</div>
					<div id="rule_add" class="securitypolicy_add">
						<!-- dl>
							<dt>화이트/블랙 리스트</dt>
							<dd>
								<div class="w50">
									<div class="sel_box">
										<select class="popup_sel">
											<option>ON</option>
											<option>OFF</option>
										</select>
									</div>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>모드</dt>
							<dd>
								<div class="w50">
									<div class="sel_box">
										<select class="popup_sel">
											<option>ON</option>
											<option>OFF</option>
										</select>
									</div>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>파일</dt>
							<dd>
								<div class="ipt_box">
									<input class="no_radius" type="text"
										placeholder="파일의 전체 경로를 작성해주세요." name="required">
								</div>
							</dd>
						</dl>
						<div class="btn_wrap fr">
							<a href="#" class="btn grey securitypolicy_add_btn">취소</a> <a
								href="#" class="btn">추가</a>
						</div -->
					</div>
				</div>
			</div>
		</div>
		<div class="modal_controller">
			<a href="javascript:lf_closePolicyEditModal();" class="close">close</a>
		</div>
	</div>
	
	<div id="policy_hist" class="modal mid win_popup rec mscrollbar" style="height: 100%;">
		<input type="hidden" id="policyData" value="" />
		<h4 id="title"></h4>
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<div class="securitypolicy_top">
					<h5>자산 정보</h5>
					<div class="securitypolicy_top_info">
						<dl>
							<dt>자산이름 및 IP</dt>
							<dd id="equipname"></dd>
						</dl>
						<dl>
							<dt>등록일시</dt>
							<dd id="registertime"></dd>
						</dl>
						<dl>
							<dt>OS</dt>
							<dd id="equipname"></dd>
						</dl>
					</div>
					<div class="securitypolicy_btn">
						<div class="sel_box fr" style="width: 150px;">
							<select id="policyType" class="wide" style="width: 150px;">
								<option value="ips" selected="selected">침입방지시스템</option>
								<option value="firewall">방화벽</option>
								<option value="malware">멀웨어</option>
								<option value="fileint">파일무결성</option>
								<option value="appctl">실행 파일 통제</option>
								<option value="pamacl">서비스 제어</option>
							</select>
						</div>
					</div>
				</div>
				<div class="securitypolicy_bottom">
					<h5>정책 정보</h5>
					<div class="securitypolicy_bottom_info">
						<dl>
							<dt>revision</dt>
							<dd>
								<div class="rev">
									<div id="rev"></div>
									<div id="nol" class="info nol none" title="기본정책">기본정책</div>
									<div id="ind" class="info ind none" title="개별정책">개별정책</div>
									<!-- div id="pol" class="info pol none" title="정책적용됨">정책적용됨</div -->
									<a href="#" class="btn bline rev_list_btn"> <span>대상 선택</span></a>
									<ul id="rev_list" class="rev_list mscrollbar">
										<!-- li>
											<a href="#">
												<div class="rev fl">
													<div>rev 362</div>
													<div class="info nol none" title="기본정책없음">기본정책없음</div>
													<div class="info ind none" title="개별정책없음">개별정책없음</div>
													<div class="info pol none" title="정책적용안됨">정책적용안됨</div>
												</div>
												<p class="fl">
													<span>12</span>대 / 생성시간 : <span>2020-11-06 12:23</span> / 등록 사용자 : <span>이종화</span>(<span>jonghlee</span>) / <span>2020년 	4분기 정기 업데이트 담당자 : 오인수 사원</span>
												</p>
											</a>
										</li -->
									</ul>
								</div>
							</dd>
						</dl>
						<dl>
							<dt>사용자 및 생성시간</dt>
							<dd>
								<span id="userid"></span> / <span id="createtime"></span>
							</dd>
						</dl>
						<div class="history mscrollbar" style="height: 125px;">
							<ul id="rev_history">
								<!-- li>
									<dl>
										<dt>
											<em>rev 201</em> <span>(<em>change</em>)</span>
										</dt>
										<dd>
											<span>2020-11-12 08:02</span>
										</dd>
									</dl>
								</li -->
							</ul>
						</div>		
						<div>
							<dl>
								<dt>변경 사항</dt>
								<dd>
									<div class="ipt_box">
										<input type="text"  id="description" name="description"  value="" placeholder="변경사항을 입력하여 주십시오." class="no_radius" readonly>
										<br/>
									</div>
								</dd>
							</dl>
						</div>				
						<div id="policy_option">
							<!-- dt>2차인증</dt>
							<dd>
								<div class="w50">
									<div class="sel_box">
										<select name="twofactor" class="popup_sel disabled">
											<option value="0">비활성화</option>
											<option value="1">활성화</option>
										</select>
									</div>
								</div>
							</dd-->
						</div>
						<div id="policy_table" class="table">
							<!-- div class="tbl">
								<table class="" style="width: 100%">
									<colgroup>
										<col width="25%">
										<col width="25%">
										<col width="20%">
										<col width="20%">
										<col width="auto">
									</colgroup>
									<thead>
										<tr>
											<th>출발지</th>
											<th>도착지</th>
											<th>프로토콜</th>
											<th>액션</th>
											<th>비고</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="long_w tl" title="000.000.000.000:0000">000.000.000.000:0000</td>
											<td class="long_w tl" title="000.000.000.000:0000">000.000.000.000:0000</td>
											<td class="long_w">TCP</td>
											<td class="long_w">Allowed</td>
											<td class="long_w tl">Web</td>
										</tr>
									</tbody>
								</table>
							</div -->
						</div>
						<div id="policy_textarea" class="ips_rule edit">
							<!-- textarea></textarea -->
						</div>
					</div>
					<div class="securitypolicy_btn">
						<div class="sel_box fr">
							<select id="mode" name="mode" class="mid disabled">
								<option value="3" selected="selected">ON</option>
								<option value="0">OFF</option>
							</select>
						</div>
						<div class="btn_wrap fr">
							<a href="#" rel="policy_edit_btn" class="btn">업데이트</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal_controller">
			<a href="javascript:lf_closePolicyHistModal();" class="close">close</a>
		</div>
	</div>
	
</body>
</html>