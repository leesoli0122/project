<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>프로세스 조회 - Aegis</title>
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
	<%@ include file="/page/layout/common.jsp"%>
	
	<style>
	.win_popup .popup_view_cont .tbl .top {
		height: 40px;
		margin-bottom: 12px;
	}
	</style>
	
	<script src="./js/service/process/processView.js?v=${version}"></script>
	<script src="./js/service/process/loadProcess.js?v=${version}"></script>
</head>

<script type="text/javascript">
	$(function () {
		$(".computer_box_left").resizable({
			minWidth: 360,
			maxWidth: 600,
			handles: "e",
			resize: function (e, ui) {
				var currentWidth = ui.size.width;
				var gap = 10;
				currentWidth += gap;
				$(".computer_box_right").css("width", "calc(100% - " + currentWidth + "px)");
			}
		});
		$('.tree').mCustomScrollbar({
			autoExpandScrollbar: "true",
			axis:"yx",
			scrollInertia: 600,
		});
		$('#Tree01 .tree_wrap').jstree({
			"core" : {
				"animation" : 0,
				"check_callback" : true,
				'force_text' : true,
				"themes" : { "stripes" : false },
				check_callback: (operation, node, node_parent, node_position, more) => {
					if (operation === "move_node" && more.ref === undefined) {
						var pData = dataMap[node_parent.id];
						var cData = dataMap[node.id];
						if(!pData) return false; // 부모가 없어서(욕아님)
						if(!cData) return false; // 자식데이터가 없어서
						return moveNode(pData, cData);                    		
					}
				}
			},
			"types" : {
				"cloudid" :{
				},
				"file" : {
					'icon': 'jstree-file'
				},
				"file_offline" : {
					'icon': 'jstree-file_offline'
				},
				'folder' : {
					'icon': ''
				}
			},
			"plugins" : [ "state", "types", "wholerow"],
		}).bind("select_node.jstree", function (event, data) {
			clickNode(data);
		});
		$('.tree_wrap').on("change.jstree", function (e, data) {
			$(".tree").mCustomScrollbar('update');
		});
	});
	
	$(document).ready(function() {
		/* Formatting function for row details - modify as you need */
		$('#processTable').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"ordering": true,
			"order" : [[0, "desc"]],
			"info": true,
			"filter": true,
			"lengthChange": true,
			"language": {
				"lengthMenu":
					'<span>show</span>'+
					'<div class="sel_box">'+
					'<select class="table_top">'+
					'<option value="-1">All</option>'+
					'<option value="10">10</option>'+
					'<option value="25">25</option>'+
					'<option value="50">50</option>'+
					'<option value="100">100</option>'+
					'</select>'+
					'</div>'+
					'<span>entries</span>'
					,
				"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
			},
			"dom": '<"top"lf>rt<"bottom"ip><"clear">',
			//"pageLength": 10,
		});
		$('.sel_box select').niceSelect();
	});
</script>

<body class="win_popup rec mscrollbar">
	<input type="hidden" name="checkedProcessList" value=""/>
	<section class="pub">
		<h4>프로세스 조회</h4>
		<div class="popup_view_cont">
			<div class="computer_box manager">
				<div class="computer_box_left" style="height:700px;">
					<div id="Tree01" class="content tree">
						<div class="tree_wrap">
							<ul>
								<li id="G0000000000000" data-jstree='{ "cloudid"="G0000000000000", "opened" : true, "state" : "open" }'>Aegis</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="computer_box_right">
					<h5 id="equip">선택 자산 없음</h5>
					<div class="tbl">
						<table id="processTable" class="click">
							<colgroup>
								<col width="8%">
								<col width="20%">
								<col width="15%">
								<col width="15%">
								<col width="40%">
							</colgroup>
							<thead>
								<tr>
									<th></th>
									<th>이름</th>
									<th>CPU</th>
									<th>메모리</th>
									<th>커맨드</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
					<div class="btn_wrap">
						<div class="fr">
							<a href="#" class="btn" onclick="javascript: addBtn(); return false;" id="saveBtn">추가</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</body>