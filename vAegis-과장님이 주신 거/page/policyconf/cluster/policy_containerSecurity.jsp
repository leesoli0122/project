<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html lang="ko">
<head>
<title>컨테이너 이벤트 정책관리 - cAegis</title>
<meta charset="UTF-8" http-equiv="Content-Type" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="format-detection" content="telephone=no" />

<!-- TODO: search engine info -->
<meta name="robots" content="Aegis" />
<meta name="keywords" content="Aegis" />
<meta name="title" content="Aegis" />
<meta name="description" content="Aegis" />

<!-- TODO: social url link image -->
<meta property="og:url" content="" />
<meta property="og:title" content="Aegis" />
<meta property="og:type" content="website" />
<meta property="og:image" content="Aegis.png" />
<meta property="og:description" content="Aegis 홈페이지입니다." />

<!-- TODO: favicon -->
<link rel="icon" href="./assets/images/favicon.png" type="favicon.png" />

<style>
.hidden {
	display: none !important;
}
.container_security_row_selecter .list {
	max-height: 80px !important;
}
.search_result_strong {
	font-weight: bold;
	background-color: #367ae2;
}
</style>

<!-- TODO: import -->
<%@ include file="/page/layout/common_sample.jsp"%>
<script defer src="./js/service/securityPolicy/policyContainerSecurity.js?v=${version}"></script>
<script type="text/javascript">
	var policyTable;

	$(document).ready(function() {
		// DataTable init
		policyTable = $('#containerSecurityPolicy_table').DataTable({
			autoWidth : false,
			paging : false,
			pagingType : "full_numbers",
			ordering : false,
			columnDefs : [ {
				targets : [ 1, 2 ],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).attr('title', cellData.replace(/<[^>]+>/g, '')); // title 속성에 데이터 추가
					// 스타일 속성 설정
					$(td).css({
						'white-space' : 'nowrap',
						'overflow' : 'hidden',
						'text-overflow' : 'ellipsis'
					});
				},
			}, {
				targets : [ 8 ],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).css({
						'display' : 'block',
					});
				},
			}, {
				targets : [ 5 ],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).css({
						'line-height': '12px',
					});
				},
			} ],
			info : false,
			filter : true,
			lengthChange : false,
			dom : 'rt<"bottom"ip><"clear">',
			createdRow : function(row, data, dataIndex) {
				$(row).attr('id', 'rowPolicyTr_' + data[9]); // 하위 tree를 출력 하기 위한 tr 추가
			}
		});
	})
</script>
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
		<jsp:param name="menuId" value="policyContainerSecurity" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="policyContainerSecurity" />
	</jsp:include>

	<input type="hidden" id="checkedAgentList" name="checkedAgentList" />
	<input type="hidden" id="editRuleIdx" name="editRuleIdx" />
	<input type="hidden" id="checkDef" name="0" />

	<section class="securitypolicy_page mscrollbar">
		<div class="sub">
			<div class="securitypolicy_box">
				<div class="securitypolicy_title cluster_policy_title">
					<div class="securitypolicy_title_left">
						<h3>컨테이너 이벤트</h3>
						<dl class="fl">
							<dt>총개수</dt>
							<dd id="policyCnt"></dd>
						</dl>
					</div>
					<div class="securitypolicy_title_middle cluster_policy_title_middle">
						<div class="fl">
							<div class="event_sel container_security_cluster_selecter">
								<div class="sel_box">
									<select id="selectClusterUuid" onchange="updateSelectCluster()" class="wide event cluster_selecteBox">
									</select>
								</div>
							</div>
						</div>
						<div class="fl">
							<div class="ipt_box">
								<input class="" type="text" placeholder="Name, Description 검색 키워드를 입력하여 주십시오." id="searchKeyword" name="searchKeyword" />
							</div>
							<a id="searchBtn" href="#" class="btn serch">검색</a>
						</div>
					</div>
					<div class="securitypolicy_title_right cluster_policy_title_right">
						<div class="fl">
							<a id="policyUpdate" href="#" class="btn" rel="containerSecurity_policy_add" onclick="updatePolicyContainerSecurity()" name="containerSecurity">저장</a><!--//line def 클래스 제거-->
						</div>
					</div>
				</div>
				<div id="containerSecurityPolicyTree">
					<div class="tbl">
						<table id="containerSecurityPolicy_table">
							<colgroup>
								<col width="3%" />
								<col width="25%" />
								<col width="45%" />
								<col width="10%" />
								<col width="10%" />
								<col width="7%" />
								<col width="10%" />
								<col width="10%" />
							</colgroup>
							<thead>
								<tr>
									<th></th>
									<th>Name</th>
									<th>Description</th>
									<th>Severity</th>
									<th>Action</th>
									<th>Enable</th>
									<th>Updated User</th>
									<th>Updated Date</th>
									<th id="policyData" style="display: none;">policy Data</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>
</body>
</html>
