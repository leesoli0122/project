<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>방화벽 - Aegis</title>
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
	<meta property="og:image" content="Aegis.png">
	<meta property="og:description" content="Aegis 홈페이지입니다.">
	
	<!-- TODO: favicon -->
	<link rel="icon" href="/assets/images/favicon.png" type="favicon.png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	
	
	
	
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

<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="fw_paging" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_firewall_search_type_field" class="sel_box">
							<select id="event_firewall_search_type" class="wide event">
								<option value="searchtime">검색 시간</option>
								<option value="src_ip">출발지 IP</option>
								<option value="src_port">출발지 Port</option>
								<option value="dest_ip">도착지 IP</option>
								<option value="dest_port">도착지 Port</option>
								<option value="action">액션</option>
								<option value="equiplist">자산</option>
							</select>
						</div>
					</div>
					<div class="searchtime on">
						<div class="searchtime_box">
							<div id="event_firewall_date" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_firewall_starttime" type='text' class="form-control firewall_date" placeholder="검색 시작 시간" />
									<span for="event_firewall_starttime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_firewall_endtime" type='text' class="form-control firewall_date" placeholder="검색 끝나는 시간" />
									<span for="event_firewall_endtime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFirewallCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFirewallClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="src_ip">
						<div class="src_ip_box">
							<div class="sel_box fl">
								<select id="event_firewall_search_operation_src_ip" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_firewall_src_ip" type="text" placeholder="0.0.0.0" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFirewallCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFirewallClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="src_port">
						<div class="src_port_box">
							<div class="sel_box fl">
								<select id="event_firewall_search_operation_src_port" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_firewall_src_port" type="text" placeholder="1 ~ 65535" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFirewallCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFirewallClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="dest_ip">
						<div class="dest_ip_box">
							<div class="sel_box fl">
								<select id="event_firewall_search_operation_dest_ip" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_firewall_dest_ip" type="text" placeholder="0.0.0.0" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFirewallCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFirewallClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="dest_port">
						<div class="dest_port_box">
							<div class="sel_box fl">
								<select id="event_firewall_search_operation_dest_port" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_firewall_dest_port" type="text" placeholder="1 ~ 65535" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFirewallCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFirewallClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="action">
						<div class="action_box">
							<div class="sel_box fl">
								<select id="event_firewall_search_operation_action" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_firewall_action" class="wide">
									<option value="allowed" selected="selected">Allowed</option>
									<option value="blocked">Blocked</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFirewallCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFirewallClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="equiplist">
						<div class="btn_wrap fl">
							<a href="#" class="btn bline modalLoad" rel="equiplist_modal" onclick="javascript:lf_initEquipList();"><span>자산 선택</span></a>
							<a href="javascript:lf_eventFirewallClick();" class="btn">검색</a>
						</div>
					</div>
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_firewall_queryTable" class="fl">
					<div id="mCSB_2" class="mCustomScrollBox mCS-light mCSB_vertical_horizontal mCSB_inside" tabindex="0" style="max-height: none;">
						<div id="mCSB_2_container_wrapper" class="mCSB_container_wrapper mCS_y_hidden mCS_no_scrollbar_y mCS_x_hidden mCS_no_scrollbar_x">
							<div id="mCSB_2_container" class="mCSB_container" style="position: relative; top: 0px; left: 0px; width: 100%;" dir="ltr">
								<ul>
									<li><p><span>발생일시</span> / <span>2023-12-30/00:00:00~2023-12-30/00:01:00</span></p><a class="removex" title="삭제" onclick="javascript: $(this).parent().remove();"></a></li>
								</ul>
							</div>
						</div>

					</div>
				</div>
			</div><!--//event_search_bottom-->


		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<div id="event_firewall_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="top"><div class="dataTables_length" id="event_firewall_result_table_length"><div><span>show</span><div class="sel_box"><select class="table_top" onchange="_fnLengthChange(this.value)" style="display: none;"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select><div class="nice-select table_top" tabindex="0"><span class="current">10</span><ul class="list"><li data-value="10" class="option selected">10</li><li data-value="25" class="option">25</li><li data-value="50" class="option">50</li><li data-value="100" class="option">100</li></ul></div></div><span>entries</span><span id="exportFile" data-id="firewall" data-format="excel" data-ui="event_firewall" style="cursor:pointer" onclick="javascript:lf_exportFile(this)"> ::Excel</span></div></div></div><table id="event_firewall_result_table" class="click dataTable no-footer" role="grid">
						<colgroup>
							<col width="8%">
							<col width="20%">
							<col width="15%">
							<col width="15%">
							<col width="10%">
							<col width="10%">
							<col width="15%">
						</colgroup>
						<thead class="thead-light">
							<tr role="row"><th class="sorting_asc" tabindex="0" aria-controls="event_firewall_result_table" rowspan="1" colspan="1" aria-label="번호: activate to sort column descending" aria-sort="ascending">번호</th><th class="sorting" tabindex="0" aria-controls="event_firewall_result_table" rowspan="1" colspan="1" aria-label="자산: activate to sort column ascending">자산</th><th class="sorting" tabindex="0" aria-controls="event_firewall_result_table" rowspan="1" colspan="1" aria-label="출발지: activate to sort column ascending">출발지</th><th class="sorting" tabindex="0" aria-controls="event_firewall_result_table" rowspan="1" colspan="1" aria-label="목적지: activate to sort column ascending">목적지</th><th class="sorting" tabindex="0" aria-controls="event_firewall_result_table" rowspan="1" colspan="1" aria-label="프로토콜: activate to sort column ascending">프로토콜</th><th class="sorting" tabindex="0" aria-controls="event_firewall_result_table" rowspan="1" colspan="1" aria-label="액션: activate to sort column ascending">액션</th><th class="sorting" tabindex="0" aria-controls="event_firewall_result_table" rowspan="1" colspan="1" aria-label="탐지시간: activate to sort column ascending">탐지시간</th></tr>
						</thead>
						<tbody><tr role="row" class="odd modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">1<p style="display:none;">1</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:33946</td><td>192.168.254.138:9090</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:21</td></tr><tr role="row" class="even modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">2<p style="display:none;">2</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:41714</td><td>192.168.254.128:5443</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:21</td></tr><tr role="row" class="odd modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">3<p style="display:none;">3</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:33948</td><td>192.168.254.138:9090</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:21</td></tr><tr role="row" class="even modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">4<p style="display:none;">4</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:59160</td><td>192.168.254.189:9093</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:20</td></tr><tr role="row" class="odd modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">5<p style="display:none;">5</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:57580</td><td>192.168.254.145:3000</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:18</td></tr><tr role="row" class="even modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">6<p style="display:none;">6</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:39474</td><td>192.168.254.141:8080</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:18</td></tr><tr role="row" class="odd modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">7<p style="display:none;">7</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:57582</td><td>192.168.254.145:3000</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:18</td></tr><tr role="row" class="even modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">8<p style="display:none;">8</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:39475</td><td>192.168.254.141:8080</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:18</td></tr><tr role="row" class="odd modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">9<p style="display:none;">9</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:10249</td><td>192.168.254.138:47586</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:17</td></tr><tr role="row" class="even modalLoad" rel="eventFirewallDetail_modal" onclick="lf_eventFirewallTableClick(this);"><td class="sorting_1">10<p style="display:none;">10</p></td><td>k8s-worker (192.168.20.63)</td><td>192.168.20.63:9100</td><td>192.168.20.63:57412</td><td>TCP</td><td>allowed</td><td>2023-12-26 12:31:16</td></tr></tbody>
					</table><div class="bottom"><div class="dataTables_paginate paging_full_numbers" id="event_firewall_result_table_paginate"><ul class="pagination"><li class="paginate_button first disabled" id="event_firewall_result_table_first"><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="0" tabindex="0">First</a></li><li class="paginate_button previous disabled" id="event_firewall_result_table_previous"><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="1" tabindex="0">Previous</a></li><li class="paginate_button active"><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="2" tabindex="0">1</a></li><li class="paginate_button "><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="3" tabindex="0">2</a></li><li class="paginate_button "><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="4" tabindex="0">3</a></li><li class="paginate_button "><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="5" tabindex="0">4</a></li><li class="paginate_button "><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="6" tabindex="0">5</a></li><li class="paginate_button disabled" id="event_firewall_result_table_ellipsis"><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="7" tabindex="0">…</a></li><li class="paginate_button "><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="8" tabindex="0">3669</a></li><li class="paginate_button next" id="event_firewall_result_table_next"><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="9" tabindex="0">Next</a></li><li class="paginate_button last" id="event_firewall_result_table_last"><a href="#" aria-controls="event_firewall_result_table" data-dt-idx="10" tabindex="0">Last</a></li></ul></div></div><div class="clear"></div></div>
				</div>
			</div>
		</div>
		<!--//event_cont_box-->
	</div>
</section>

<!--  modal :: 자산 선택 팝업  -->
<div class="modal mid" id="equiplist_modal">
    <div class="modal_header">
        <h3>자산선택</h3>
    </div>
    <div class="modal_body">
        <div class="modal_cont">
            <div class="equiplist_search">
                <div class="search_cont">
                    <div id="event_equiplist_ips" class="sel_box fl">
                        <select class="wide">
                            <option selected="selected" value="equipIP">자산IP</option>
                            <option value="equipName">자산명</option>                                                       
                        </select>
                    </div>
                    <div class="ipt_box fl">
                        <input id="event_equiplist_name" type="text" placeholder="자산를 검색하여 주십시오" name="required">
                        <a href="#" onclick="javascript:lf_searchEquipList();">자산 검색</a>
                    </div>
                </div>
                <a href="#" class="btn grey" onclick="javascript:lf_initEquipList();">검색 초기화</a>
            </div>
            <script type="text/javascript">
                $(document).ready(function() {
                    $("#event_equiplist_table").dataTable({
                        "autoWidth": false,
                        "paging": true,
                        "pagingType" : "full_numbers",
                        "ordering": false,
                        "info": true,
                        "filter": false,
                        "lengthChange": true,
                        "language": {
                            "info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
                        },
                        "dom": 'rt<"bottom"fip><"clear">',
                        // "pageLength": '10',
                    });
                } );

            </script>
            <div class="tbl row10">
                <table id="event_equiplist_table" class="click">
                    <colgroup>
                        <col width="8%">
                        <col width="25%">
                        <col width="auto">
                        <col width="35%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th>
                            <div class="chk_box equip_all_select">
                                <input type="checkbox" name="all_checkbox" id="chk00" value="">
                                <label for="chk00"></label>
                            </div>
                        </th>
                        <th>자산IP</th>
                        <th>자산명</th>
                        <th>그룹</th>
                    </tr>
                    </thead>
                    <tbody>
                     
                    </tbody>
                </table>
            </div>
            <div class="equiplist_list">
                <div id="event_equiplist_box" class="fl equiplist_list_box mscrollbar">
                    <ul class="fl">
                       
                    </ul>
                </div>
                <p class="equiplist_choice_info">
                    <span>(<em>0</em>)</span> 개 선택
                </p>
            </div>
        </div>
    </div>
    <div class="modal_footer">
        <div class="btn_wrap fr">
            <a href="#" class="btn grey close">취소</a>
            <a href="#" class="btn close" onclick="javascript:lf_addEquipList();">확인</a>
        </div>
    </div>
    <div class="modal_controller">
        <a href="#" class="close">close</a>
    </div>
</div>

</body>
</html>