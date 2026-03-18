<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <title>멀웨어 이벤트 - Aegis</title>
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
    <link rel="stylesheet" href="/assets/css/lib/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/lib/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" href="/assets/css/lib/datatables.css?v=${version}">
    <link rel="stylesheet" href="/assets/css/lib/select.dataTables.css?v=${version}">
    <link rel="stylesheet" href="/assets/css/style.css?v=${version}">
	<link rel="stylesheet" href="/assets/css/common.css?v=${version}">

    <script src="/assets/js/lib/jquery.min.js?v=${version}"></script>
	<script src="/assets/js/lib/bootstrap.min.js"></script>
	<script src="/assets/js/lib/moment.js"></script>
	<script src="/assets/js/lib/bootstrap-datetimepicker.js"></script>
    <script src="/assets/js/lib/jquery-ui.js?v=${version}"></script>
    <script src="/assets/js/lib/echarts.js?v=${version}"></script>
    <script src="/assets/js/lib/jquery.nice-select.js?v=${version}"></script>
    <script src="/assets/js/lib/select.dataTables.js?v=${version}"></script>
    <script src="/assets/js/lib/datatables.js?v=${version}"></script>
    <script src="/assets/js/lib/sweetalert.js"></script>
    
    <script src="/js/common/define.js?v=${version}"></script>
    <script src="/js/common/basic_common.js?v=${version}"></script>
    <script src="/js/common/cf_common.js?v=${version}"></script>
    
    <script src="/js/service/dashboards/dashboardChart.js?v=${version}"></script>
    <script src="/js/service/dashboards/dashboardEventAVDialog.js?v=${version}"></script>
    
</head>
<body class="win_popup overflow_h">
<section>
    <h3>컨테이너 이벤트 - 상세정보</h3>
    <div class="popup_view_cont ui_01_04_01">
        <!-- s:2023-10-20 jung-->
		<div class="view_info">
				<!--s:컨텐츠내용-->
				<p class="tit">RuleName(e.g. Execution non-warranted container images)</p>	
				<ul class="block">
					<li>
						<span class="label">Action</span>
						<span></span>
					</li>
					<li>
						<span class="label">Severity</span>
						<span></span>
					</li>
					<li>
						<span class="label">impact</span>
						<span></span>
					</li>
					<li>
						<span class="label">Description</span>
						<span></span>
					</li>
					<li>
						<span class="label">Remediation</span>
						<span></span>
					</li>
				</ul>
			</div>
			<!--e:컨텐츠내용-->
			<div class="">
					<div class="tbl vul_detail_tbl">
						<div class="form">
							<div class="right">
								<div class="search_box">
									<div class="ipt_box">
										<input class="" type="text" placeholder="Kind, User, Message 키워드를 입력해 주세요" id="searchKeyword" name="vulSearchKeyword" style="width:450px;">
									</div>
									<a id="vulSearchBtn" href="#" class="btn serch" onclick="vulSearchBtnClick()">검색</a>
								</div>
							</div>
						</div>
						<div id="event_vulnerability_detail_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_vulnerability_detail_result_table" class="dataTable no-footer" role="grid">
								<colgroup>
									<col width="100px">
									<col width="150px">
									<col width="auto">
									<col width="120px">
									<col width="120px">
									<col width="120px">
									<col width="200px">
									<col width="150px">
								</colgroup>
								<thead>
									<tr role="row">
										<th class="sorting">NO.</th>
										<th class="sorting">Action</th>
										<th class="sorting">Namespace</th>
										<th class="sorting">Kind</th>
										<th class="sorting">Operation</th>
										<th class="sorting">User</th>
										<th class="sorting">Message</th>
										<th class="sorting">Date</th>
									</tr>
								</thead>
								<tbody>
									<tr role="row">
										<td colspan="8" class="dataTables_empty">No data available in table</td>
									
									</tr>
								</tbody>
							</table>
							<div class="bottom" style="display:none;">
								<div class="dataTables_paginate paging_full_numbers" id="event_vulnerability_detail_result_table_paginate">
									<ul class="pagination">
										<li class="paginate_button first disabled" id="event_vulnerability_detail_result_table_first">
											<a href="#" aria-controls="event_vulnerability_detail_result_table" data-dt-idx="0" tabindex="0">First</a>
										</li>
										<li class="paginate_button previous disabled" id="event_vulnerability_detail_result_table_previous">
											<a href="#" aria-controls="event_vulnerability_detail_result_table" data-dt-idx="1" tabindex="0">Previous</a>
										</li>
										<li class="paginate_button active">
											<a href="#" aria-controls="event_vulnerability_detail_result_table" data-dt-idx="2" tabindex="0">1</a>
										</li>
										<li class="paginate_button ">
											<a href="#" aria-controls="event_vulnerability_detail_result_table" data-dt-idx="3" tabindex="0">2</a>
										</li>
										<li class="paginate_button next" id="event_vulnerability_detail_result_table_next">
											<a href="#" aria-controls="event_vulnerability_detail_result_table" data-dt-idx="9" tabindex="0">Next</a>
										</li>
										<li class="paginate_button last" id="event_vulnerability_detail_result_table_last">
											<a href="#" aria-controls="event_vulnerability_detail_result_table" data-dt-idx="10" tabindex="0">Last</a>
										</li>
									</ul>
								</div>
							</div>
							<div class="clear"></div>
						</div><!--//dataTables_wrapper-->
					</div><!--//tbl-->
			</div><!--//tab-box-->
		<!-- e:2023-10-20 jung-->
    </div>
</section>
</body>
</html>