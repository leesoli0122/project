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
    <h3>컨테이너 워크로드 현황-상세정보</h3>
    <div class="popup_view_cont ui_01_04_01">
        <!-- s:2023-10-20 jung-->
		<div class="view_info">
				<!--s:컨텐츠내용-->
				<ul>
					<li>
						<span class="label">Cluster</span>
						<span>Cluster-61</span>
					</li>
					<li>
						<span class="label">Namespace</span>
						<span>caegis-system</span>
					</li>
					<li>
						<span class="label">Kind</span>
						<span>Pod</span>
					</li>
					<li>
						<span class="label">Name</span>
						<span>Base Rule - System</span>
					</li>
				</ul>
			</div>
			<!--e:컨텐츠내용-->
			<div class="tab_box">
				<ul class="tab_item">
					<li class="on" data-tab="tab_cont01"><a href="javascript:void(0);">Security Issue</a></li>
					<li data-tab="tab_cont02"><a href="javascript:void(0);">Vulnerabilities</a></li>
					<li data-tab="tab_cont03"><a href="javascript:void(0);">Malware</a></li>
					<li data-tab="tab_cont04"><a href="javascript:void(0);">Sensitive Data</a></li>
					<li data-tab="tab_cont05"><a href="javascript:void(0);">Event</a></li>
					<li data-tab="tab_cont06"><a href="javascript:void(0);">Audit</a></li>
				</ul>
				<!-- s:Security Issue-->
				<div id="tab_cont01" class="tab_content">
					<div class="card_box">
						<h4 class="tit">Sga-tomcat 8.0</h4>
						<ul class="card_list w5">
							<li class="total erro">
								<h5 class="tit">Total Vulnerabilities</h5>
								<p class="txt_figure">5</p>
							</li>
							<li class="malware">
								<h5 class="tit">Malware</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="sensitive">
								<h5 class="tit">Sensitive Data</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="image">
								<h5 class="tit">image Assurance</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="detection">
								<h5 class="tit">Detection Event</h5>
								<p class="txt_figure">0</p>
							</li>
						</ul>
					</div><!--//card_box-->
					<div class="card_box">
						<h4 class="tit">Sga-ubuntu</h4>
						<ul class="card_list w5">
							<li class="total">
								<h5 class="tit">Total Vulnerabilities</h5>
								<p class="txt_figure">5</p>
							</li>
							<li class="malware">
								<h5 class="tit">Malware</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="sensitive">
								<h5 class="tit">Sensitive Data</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="image">
								<h5 class="tit">image Assurance</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="detection">
								<h5 class="tit">Detection Event</h5>
								<p class="txt_figure">0</p>
							</li>
						</ul>
					</div><!--//card_box-->
				
				</div>
				<!-- e:Security Issue-->
				<!-- s:Vulnerabilities-->
				<div id="tab_cont02" class="tab_content dp_none">
					<div class="card_box vulnerabilities_info">
						<ul class="card_list w6">
							<li class="tc_critical">
								<h5 class="tit">Critical</h5>
								<p class="txt_figure">5</p>
							
							</li>
							<li class="tc_high">
								<h5 class="tit">hight</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="tc_medium">
								<h5 class="tit">medum</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="tc_low">
								<h5 class="tit">row</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="tc_info">
								<h5 class="tit">info</h5>
								<p class="txt_figure">0</p>
							</li>
							<li class="tc_non">
								<h5 class="tit">Unknown</h5>
								<p class="txt_figure">0</p>
							</li>
						</ul>
					</div><!--//card_box-->

					<div class="dashboard_compliance_table">

					<div class="tbl vul_detail_tbl">
						<!--s : jung form 클래스 추가 및 search_box 클래스 변경-->
						<div class="form">
							<div class="left">
								<div class="search_box">
									<div class="ipt_box">
										<input class="" type="text" placeholder="Image Tag 혹은 Identifier,Description 키워드를 입력해 주세요" id="searchKeyword" name="vulSearchKeyword" style="width:450px;">
									</div>
									<a id="vulSearchBtn" href="#" class="btn serch" onclick="vulSearchBtnClick()">검색</a>
								</div>
							</div>
						</div>
						<!--e : jung form 클래스 추가 및 search_box 클래스 변경-->
							
						<div id="event_vulnerability_detail_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_vulnerability_detail_result_table" class="dataTable no-footer" role="grid">
								<colgroup>
									<col width="8%">
									<col width="10%">
									<col width="auto">
									<col width="8%">
									<col width="10%">
									<col width="8%">
									<col width="auto">
									<col width="auto">
									<col width="10%">
									<col width="10%">
								</colgroup>
								<thead>
									<tr role="row">
										<th class="sorting">Container</th>
										<th class="sorting">Registry</th>
										<th class="sorting">Digest</th>
										<th class="sorting">Image Tag</th>
										<th class="sorting">Identifier</th>
										<th class="sorting">Severity</th>
										<th class="sorting">CVSS Score</th>
										<th class="sorting">Description</th>
										<th class="sorting">Url</th>
										<th class="sorting">Created Date</th>
										
									</tr>
								</thead>
								<tbody>
									<tr role="row" class="odd" style="background-color: rgb(0, 0, 0);">
										<td>-</td>
										<td>sga-sorlegisty</td>
										<td>default-route-openshift-image-registry.apps.ocp.sga.co.kr</td>
										<td>sha256:066f6c7fd07dc0d34c49c150e94bd7dafe73760f3eae1489b8fcae96a3fac7a9</td>
										<td>openshift/jboss-amq-63:1.4</td>
										<td>Unknown</td>
										<td>-</td>
										<td>** REJECT ** DO NOT USE THIS CANDIDATE NUMBER. ConsultIDs: none. Reason: This candidate was withdrawn by its CNA. Further investigation showed that it was not a security issue. Notes: none.</td>
										<td><a style="color: #bbb; text-decoration: underline;" href="https://nvd.nist.gov/vuln/detail/CVE-2013-0341" target="_blank">https://nvd.nist.gov/vuln/detail/CVE-2013-0341</a></td>
										<td>2023-10-16 21:54:14</td>
									</tr>
								</tbody>
							</table>
							<div class="bottom">
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

					<div class="tbl vul_detail_tbl">
						<div class="form">
							<div class="left">
								<div class="search_box">
									<div class="ipt_box">
										<input class="" type="text" placeholder="Package Name 키워드를 입력해 주세요" id="searchPackageKeyword" name="vulPackageSearchKeyword" style="width:400px;">
									</div>
									<a id="vulPackageSearchBtn" href="#" class="btn serch" onclick="vulPackageSearchBtnClick()">&gt;검색</a>
								</div>
							</div>
						</div>
								
						<div id="event_vulnerability_package_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_vulnerability_package_result_table" class="dataTable no-footer" role="grid">
								<colgroup>
									<col width="10%">
									<col width="auto">
									<col width="10%">
									<col width="10%">
									<col width="auto">
									<col width="auto">
								</colgroup>
								<thead>
									<tr role="row"><th class="sorting" tabindex="0" aria-controls="event_vulnerability_package_result_table" rowspan="1" colspan="1" aria-label="Package Name: activate to sort column ascending">Package Name</th><th class="sorting" tabindex="0" aria-controls="event_vulnerability_package_result_table" rowspan="1" colspan="1" aria-label="Package-related Path: activate to sort column ascending">Package-related Path</th><th class="sorting" tabindex="0" aria-controls="event_vulnerability_package_result_table" rowspan="1" colspan="1" aria-label="Package Version: activate to sort column ascending">Package Version</th><th class="sorting" tabindex="0" aria-controls="event_vulnerability_package_result_table" rowspan="1" colspan="1" aria-label="Fix Version: activate to sort column ascending">Fix Version</th><th class="sorting" tabindex="0" aria-controls="event_vulnerability_package_result_table" rowspan="1" colspan="1" aria-label="CVSS: activate to sort column ascending">CVSS</th><th class="sorting_asc" tabindex="0" aria-controls="event_vulnerability_package_result_table" rowspan="1" colspan="1" aria-label="CPE: activate to sort column descending" aria-sort="ascending">CPE</th></tr>
								</thead>
								<tbody>
								<tr role="row" class="odd"><td title="tar" class="long_w" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">tar</td><td title="/var/lib/rpm/Packages" class="long_w" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">/var/lib/rpm/Packages</td><td title="2:1.26-35.el7" class="long_w" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2:1.26-35.el7</td><td title="-" class="long_w" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="CVSS:2.0/AV:N/AC:L/Au:N/C:C/I:C/A:C" class="long_w" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CVSS:2.0/AV:N/AC:L/Au:N/C:C/I:C/A:C</td><td title="cpe:2.3:a:redhat:tar:2:1.26-35.el7:*:*:*:*:*:*,cpe:2.3:a:tar:tar:2:1.26-35.el7:*:*:*:*:*:*" class="long_w" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">cpe:2.3:a:redhat:tar:2:1.26-35.el7:*:*:*:*:*:*,cpe:2.3:a:tar:tar:2:1.26-35.el7:*:*:*:*:*:*</td></tr></tbody>
							</table>
							<div class="bottom">
								<div class="dataTables_paginate paging_full_numbers" id="event_vulnerability_package_result_table_paginate">
									<ul class="pagination">
										<li class="paginate_button first disabled" id="event_vulnerability_package_result_table_first"><a href="#" aria-controls="event_vulnerability_package_result_table" data-dt-idx="0" tabindex="0">First</a></li><li class="paginate_button previous disabled" id="event_vulnerability_package_result_table_previous"><a href="#" aria-controls="event_vulnerability_package_result_table" data-dt-idx="1" tabindex="0">Previous</a></li><li class="paginate_button active"><a href="#" aria-controls="event_vulnerability_package_result_table" data-dt-idx="2" tabindex="0">1</a></li><li class="paginate_button next disabled" id="event_vulnerability_package_result_table_next"><a href="#" aria-controls="event_vulnerability_package_result_table" data-dt-idx="3" tabindex="0">Next</a></li><li class="paginate_button last disabled" id="event_vulnerability_package_result_table_last"><a href="#" aria-controls="event_vulnerability_package_result_table" data-dt-idx="4" tabindex="0">Last</a></li>
									</ul>
								</div>
							</div>
							<div class="clear"></div>
						</div>
					</div>

					</div><!--//dashboard_compliance_table-->
				
				</div>
				<!-- e:Vulnerabilities-->
				<!-- s:Malware-->
				<div id="tab_cont03" class="tab_content dp_none">
					<div class="tbl vul_detail_tbl">
						<div id="event_vulnerability_detail_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_vulnerability_detail_result_table" class="dataTable no-footer" role="grid">
								<colgroup>
									<col width="100px">
									<col width="150px">
									<col width="300px">
									<col width="auto">
								</colgroup>
								<thead>
									<tr role="row">
										<th class="sorting">NO.</th>
										<th class="sorting">Container</th>
										<th class="sorting">Signature Name</th>
										<th class="sorting">File path</th>

										
									</tr>
								</thead>
								<tbody>
									<tr role="row">
										<td colspan="4" class="dataTables_empty">No data available in table</td>
									
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

				</div>
				<!-- e:Malware-->
				<!-- s:Sensitive Data-->
				<div id="tab_cont04" class="tab_content dp_none">
					<div class="tbl vul_detail_tbl">
						<div id="event_vulnerability_detail_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_vulnerability_detail_result_table" class="dataTable no-footer" role="grid">
								<colgroup>
									<col width="100px">
									<col width="150px">
									<col width="300px">
									<col width="auto">
								</colgroup>
								<thead>
									<tr role="row">
										<th class="sorting">NO.</th>
										<th class="sorting">Container</th>
										<th class="sorting">File</th>
										<th class="sorting">File path</th>

										
									</tr>
								</thead>
								<tbody>
									<tr role="row">
										<td colspan="4" class="dataTables_empty">No data available in table</td>
									
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
				</div>
				<!-- e:Sensitive Data-->
				<!-- s:Event-->
				<div id="tab_cont05" class="tab_content dp_none">
					<div class="tbl vul_detail_tbl">
						<!--s : jung form 클래스 추가 및 search_box 클래스 변경-->
						<div class="form">
							<div class="left">
								<div class="search_box">
									<div class="ipt_box">
										<input class="" type="text" placeholder="Rule Name, Subnect Name, Operation 검색키워드를 입력해주세요." id="searchKeyword" name="vulSearchKeyword" style="width:450px;">
									</div>
									<a id="vulSearchBtn" href="#" class="btn serch" onclick="vulSearchBtnClick()">검색</a>
								</div>
							</div>
						</div>
						<!--e : jung form 클래스 추가 및 search_box 클래스 변경-->
							
						<div id="event_vulnerability_detail_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_vulnerability_detail_result_table" class="dataTable no-footer" role="grid">
								<colgroup>
									<col width="100px">
									<col width="10%">
									<col width="10%">
									<col width="10%">
									<col width="10%">
									<col width="15%">
									<col width="auto">
									<col width="15%">
									<col width="10%">
								</colgroup>
								<thead>
									<tr role="row">
										<th class="sorting">NO.</th>
										<th class="sorting">Reslt</th>
										<th class="sorting">Rule Type</th>
										<th class="sorting">Rule Name</th>
										<th class="sorting">Severity</th>
										<th class="sorting">Subject</th>
										<th class="sorting">Subject Name</th>
										<th class="sorting">Operation</th>
										<th class="sorting">Date</th>


										
									</tr>
								</thead>
								<tbody>
									<tr role="row">
										<td colspan="9" class="dataTables_empty">No data available in table</td>
									
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
				</div>
				<!-- e:SEvent-->
				<!-- s:Event-->
				<div id="tab_cont06" class="tab_content dp_none">
					<div class="tbl vul_detail_tbl">
						<!--s : jung form 클래스 추가 및 search_box 클래스 변경-->
						<div class="form">
							<div class="left">
								<div class="search_box">
									<div class="ipt_box">
										<input class="" type="text" placeholder="Message, ReqestUser, RequestObject, Request Object Name 검색키워드를 입력해주세요." id="searchKeyword" name="vulSearchKeyword" style="width:450px;">
									</div>
									<a id="vulSearchBtn" href="#" class="btn serch" onclick="vulSearchBtnClick()">검색</a>
								</div>
							</div>
						</div>
						<!--e : jung form 클래스 추가 및 search_box 클래스 변경-->
							
						<div id="event_vulnerability_detail_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_vulnerability_detail_result_table" class="dataTable no-footer" role="grid">
								<colgroup>
									<col width="100px">
									<col width="15%">
									<col width="15%">
									<col width="15%">
									<col width="auto">
									<col width="15%">
									<col width="10%">
								</colgroup>
								<thead>
									<tr role="row">
										<th class="sorting">NO.</th>
										<th class="sorting">Reslt</th>
										<th class="sorting">Message</th>
										<th class="sorting">Request Object</th>
										<th class="sorting">Request Object Name</th>
										<th class="sorting">Request Operation</th>
										<th class="sorting">Date</th>


										
									</tr>
								</thead>
								<tbody>
									<tr role="row">
										<td colspan="7" class="dataTables_empty">No data available in table</td>
									
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
				</div>
				<!-- e:SEvent-->

			</div><!--//tab-box-->
		<!-- e:2023-10-20 jung-->
    </div>
</section>
<script>
	//tab
	$(".tab_item > li").click(function(){
		var tabCont = $(this).attr("data-tab");
		$(this).siblings().removeClass("on");
		$(this).addClass("on");
		$(this).closest("ul").siblings().addClass("dp_none");
		$("#" + tabCont).removeClass("dp_none");
	});
</script>
</body>
</html>