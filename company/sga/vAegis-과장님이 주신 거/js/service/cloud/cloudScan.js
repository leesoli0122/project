const _SPEED = 200;
const _LIMIT = 4;
var currPage = 1;
var groupList;

const _STATUS = {
	'SCAN_IDLE' : 0,
	'SCAN_INIT' : 1,
	'SCAN_START' : 2,
	'SCAN_FIN' : 3,
	'SCAN_FAIL' : 9
}

const _STATUSNAME = {
	0 : '대기',
	1 : '검사 준비',
	2 : '검사 중',
	3 : '완료',
	9 : '실패'
}

const _MODE = {
	'SKIP' : 4,
    'ON' : 3,
    'OFF' : 0,
    'WARN' : 1        
};

const _SCANMODE = {
	'NORMAL' : 0,
	'OFF' : 0,
	'SUBDIR' : 1,
    'MOVE' : 4,
    'COPY' : 8,
    'REMOVE' : 16,
    'EXECACL' : 32
};

// 230728 kimsw: 그룹아이디를 사용하여 Hosts를 필터링하기위해 추가
const GROUP_ID = {
	Aegis: 'G0000000000000',
	Hosts: 'G0000000000001',
	Registry: 'G0000000000002',
	Clusters: 'G0000000000003',
};

$(function() {
	$("#btn_filename_add").on("click", function(event) {
		var html = "";
		html += "<tr style=\"height: 50px;\">";
		html += "	<td></td>";
		html += "	<td>";
		html += "		<div class=\"ipt_box\" style=\"width: 500px;\">";
		html += "			<input type=\"text\" id=\"filename\" placeholder=\"파일의 전체 경로를 작성해주세요.\" name=\"filename\">";
		html += "		</div>";
		html += "	</td>";
		html += "	<td></td>";
		html += "	<td></td>";
		html += "</tr>";
		$("#malware_scan_option_table").append(html);
	});
	$("#btn_malware_scan").on("click", function(event) {
		/* 2024-01-22 스타일 변경 $(this).css({border: $("#malware_scan").is(":visible") ? "2px solid #424a57" : "2px solid #2e6fd4"});*/
		$("#malware_scan").is(":visible") ? $("#malware_scan").hide() : $("#malware_scan").show();

		$(this).toggleClass("on");

	});
	$("#btn_malware_recent").on("click", function(event) {
		/*2024-01-22 $(this).css({border: $("#malware_recent").is(":visible") ? "2px solid #424a57" : "2px solid #2e6fd4"});*/
		$("#malware_recent").is(":visible") ? $("#malware_recent").hide() : $("#malware_recent").show();
		$(this).toggleClass("on");

	});
	$("#btn_malware_summary").on("click", function(event) {
		$(this).css({border: $("#malware_summary").is(":visible") ? "2px solid #424a57" : "2px solid #2e6fd4"});
		$("#malware_summary").is(":visible") ? $("#malware_summary").hide() : $("#malware_summary").show();
	});
	$("#btn_malware_scan_option").on("click", function(event) {
		if(!$("#malware_scan_option").is(":visible")) {
			//2024-01-22 $(this).css({border: "2px solid #2e6fd4"});
			$(this).toggleClass("on");

			$("#malware_scan_option").show();
		} else {
			$("#btn_malware_scan").css({border: "2px solid #424a57"});
			$("#btn_malware_recent").css({border: "2px solid #424a57"});
			$("#btn_malware_summary").css({border: "2px solid #424a57"});
			$("#btn_malware_scan_option").css({border: "2px solid #424a57"});
			
			$("#malware_scan").hide();
			$("#malware_recent").hide();
			$("#malware_summary").hide();
			$("#malware_scan_option").hide();
		}
	});
	$("#btn_scan").on("click", function(event) {
		//$(".malware_tab").hide(_SPEED);
		//$("a.btn_control").addClass('disabled');
	

		$("#btn_malware_scan").css({border: "2px solid #424a57"});
		$("#btn_malware_recent").css({border: "2px solid #424a57"});
		$("#btn_malware_summary").css({border: "2px solid #424a57"});
		$("#btn_malware_scan_option").css({border: "2px solid #424a57"});
		
		$("#malware_scan").hide();
		$("#malware_recent").hide();
		$("#malware_summary").hide();
		$("#malware_scan_option").hide();
		
		startScan();
	});
	$("#searchBtn").on("click", function(event) {
		var searchKeyword = $("#searchKeyword").val();
		
		$(".computer_cont_con li").each(function() {
			if($(this).attr("equipmarkname").indexOf(searchKeyword) > -1) $(this).show();
			else if($(this).attr("masterip").indexOf(searchKeyword) > -1) $(this).show();
			else if($(this).attr("osver").indexOf(searchKeyword) > -1) $(this).show();
			else $(this).hide();
		});
	});
	
	selectCloudStatus();
	$('div.action').find('input').eq(0).prop('checked', true);
	$('#subcheck').prop('checked', true);
	loadMalwareVersion();
	checkMalwareVersion();
});

function loadMalwareVersion() {
	var reqUrl = _WEBCONTEXTURL + "/malware_info.do";
	
	$.ajax({
		url :reqUrl,
		data : null,
		async  : _ASYNC ,
		type : "get",
		//dataType : "json",
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		},
		success:function(data, XMLHttpRequest, textStatus) {
			var dataArray = JSON.parse(data);
			if(dataArray.length > 0) {
				
				dataArray[0].time;
				if(dataArray[0].download[0]) {
					var fileArray = dataArray[0].download[0].split('/');
					var title = "Time : " + dataArray[0].time;
					
					$('.asset_list_head').find('.fl:eq(3) dd').text(fileArray[1]);
					$('.asset_list_head').find('.fl:eq(3) dd').attr("title", "Time : " + dataArray[0].time);
					$('.asset_list_head').find('.fl:eq(3) dt').attr("title", "Hash : " + dataArray[0].hashcode);
				}
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrow) {
			cf_alert('오류', "AJAX 요청 에러 메세지 : \n " + errorThrow);
		}
		
	});
}

function checkMalwareVersion() {
	var reqUrl = _WEBCONTEXTURL + "/malware_update.do?type=check";
	
	$.ajax({
		url :reqUrl,
		data : null,
		async  : _ASYNC ,
		type : "get",
		//dataType : "json",
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		},
		success:function(data, XMLHttpRequest, textStatus) {
			//var data = JSON.parse(data);
			if(data['result'] == 0) {
				$('.asset_list_head').find('.fl:eq(4) dt').text("Relay Server:");
				$('.asset_list_head').find('.fl:eq(4) dd').html("<span onclick='confirmMalwareVersionFromRelay()' title='Sync'>OnLine</span>");
			} else if(data['result'] == 1) {
				$('.asset_list_head').find('.fl:eq(4) dt').text("Relay Server:");
				$('.asset_list_head').find('.fl:eq(4) dd').html("<span title='동기화 작업중'>Process...</span>");
			}  else if(data['result'] == -3) {
				$('.asset_list_head').find('.fl:eq(4) dt').text("Relay Server:");
				$('.asset_list_head').find('.fl:eq(4) dd').html("<span>OffLine</span>");
			}			
		},
		error:function(XMLHttpRequest, textStatus, errorThrow) {
			cf_alert('오류', "AJAX 요청 에러 메세지 : \n " + errorThrow);
		}
		
	});
}
function confirmMalwareVersionFromRelay() {
	swal("패턴 동기화","Relay 서버의 패턴 버전과 동기화 하시겠습니까?","./assets/images/icon_alert01.png", {
        buttons: ["취소", "확인"],
    }).then(function(willDelete) {
        if (willDelete) {
            syncMalwareVersionFromRelay();
        }
    });
}

function syncMalwareVersionFromRelay() {
	var reqUrl = _WEBCONTEXTURL + "/malware_update.do?type=process";
	$('.asset_list_head').find('.fl:eq(4) dd').html("<span title='동기화 작업중'>Process...</span>");
	swal("릴레이 서버와의 동기화가 시작됩니다. 잠시만 기다려주세요.", {
        icon: "./assets/images/icon_alert02.png",
        buttons:"확인"
    });
        
	$.ajax({
		url :reqUrl,
		data : null,
		async  : _ASYNC ,
		type : "get",
		//dataType : "json",
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		},
		success:function(data, XMLHttpRequest, textStatus) {
			//var data = JSON.parse(data);
			$('.asset_list_head').find('.fl:eq(4) dt').text("Relay Server:");
			$('.asset_list_head').find('.fl:eq(4) dd').html("<span onclick='confirmMalwareVersionFromRelay()' title='Sync'>OnLine</span>");
			var msg = "";
			if(data['result'] == 2) {
				swal("릴레이 서버와의 동기화 작업이 완료되었습니다.", {
			        icon: "./assets/images/icon_alert02.png",
			        buttons:"확인"
			    });
			    return;
			} else if(data['result'] == 3) {
				swal("릴레이 서버와의 동기화 작업이 완료되었으나 일부 파일이 정상적으로 다운로드 되지 않았습니다.", {
			        icon: "./assets/images/icon_alert04.png",
			        buttons:"확인"
			    });
			    return;
			} else if(data['result'] == -1) {
				msg = "관리자에게 문의해주세요(로컬 파일 경로 확인)";
	        } else if(data['result'] == -2) {
	        	msg = "관리자에게 문의해주세요(릴레이 서버 URL 확인)";
	        } else if(data['result'] == -3) {
	        	msg = "관리자에게 문의해주세요(릴레이 서버 상태 확인)";
	        } else if(data['result'] == -4) {
	        	msg = "관리자에게 문의해주세요(릴레이 서버 정상 동작 확인)";
	        } else if(data['result'] == -5) {
	        	msg = "이미 동기화 작업 중입니다. 잠시만 기다려주세요";
	        } else if(data['result'] == -10) {
	        	msg = "관리자에게 문의해주세요";
	        } else {
	        	return;
	        }	
	        swal(msg, {
		        icon: "./assets/images/icon_alert03.png",
		        buttons:"확인"
		    });		
		},
		error:function(XMLHttpRequest, textStatus, errorThrow) {
			cf_alert('오류', "AJAX 요청 에러 메세지 : \n " + errorThrow);
		}
		
	});
}

function selectCloudStatus(){
	var body = {};
	cf_requestServer(_TR_CLOUD_SERVER_STATUS_STAT, body, lf_serviceCall600071CallBack);
}

function lf_serviceCall600071CallBack(data) {
	groupList = data.body.dataList;
	groupList.sort(function(a, b) {
		return a.groupid < b.groupid ? -1 : a.groupid > b.groupid ? 1 : 0;
	});
	groupList = groupList.filter(obj => obj.groupid === GROUP_ID.Hosts);
	//console.log(groupList);
	
	var groupCount = 0;
	var allCount = 0;
	var liveCount = 0;
	var deadCount = 0;
	$.each(groupList, function(idx, item) {
		groupCount++;
		allCount += item['all_count'];
		liveCount += item['live_count'];
		deadCount += item['dead_count'];
	});
	$("#groupCount").html(convertNumber(groupCount));
	$("#allCount").html(convertNumber(allCount));
	$("#liveCount").html(convertNumber(liveCount));
	$("#deadCount").html(convertNumber(deadCount));
	
	var html = "";
	$.each(groupList, function(idx, item) {
		console.log(item);
		html += "<div class=\"computer_cont\">";
		html += "	<div class=\"computer_cont_title\">";
		html += "		<h3>" + item['groupname'] + "</h3>";
		html += "		<dl class=\"fl\">";
		html += "			<dt>정상</dt>";
		html += "			<dd><span>" + convertNumber(item['live_count']) + "</span>대</dd>";
		html += "		</dl>";
		html += "		<dl class=\"fl\">";
		html += "			<dt>비정상</dt>";
		html += "			<dd><span>" + convertNumber(item['dead_count']) + "</span>대</dd>";
		html += "		</dl>";
		html += "		<dl class=\"fl\">";
		html += "			<dt>Last Ver</dt>";
		html += "			<dd><span>2022-01-12</span></dd>";
		html += "		</dl>";
		html += "		<dl class=\"fl\">";
		html += "			<dt>Relay Server</dt>";
		html += "			<dd><span>OffLine</span></dd>";
		html += "		</dl>";
		html += "	</div>";
		html += "	<div class=\"computer_cont_con\">";
		html += "		<ul id=\"" + item['groupid'] + "\"></ul>";
		html += "	</div>";
		html += "</div>";
	});
	$("#groupList").append(html);
	
	
	var body = {};
	cf_requestServer(_TR_CLOUD_SERVER_STATUS, body, lf_serviceCall600072CallBack);	
}

function lf_serviceCall600072CallBack(data) {
	var dataList = data.body.dataList;
	dataList.sort(function(a, b) {
		return a.equipmarkname < b.equipmarkname ? -1 : a.equipmarkname > b.equipmarkname ? 1 : 0;
	});
	var echoBody = data.body.echoBody;
	//console.log(dataList);
	//console.log(echoBody);
	
	var html = "";
	$.each(dataList, function(idx, item) {
		$("#" + item.groupid).append("<li class=\"" + (item.devstatus == 1 ? "on" : "off") + "\" hardwareid=\"" + item.hardwareid + "\" devstatus=\"" + item.devstatus + "\" equipmarkname=\"" + item.equipmarkname + "\" masterip=\"" + item.masterip + "\" osver=\"" + item.osver + "\" pattern=\"" + (item.filename != null ? item.filename : "") + "\" downloadtime=\"" + (item.downloadtime != null ? item.downloadtime : "") + "\"></li>");
	});
	
	$(".computer_cont_con ul li").click(function(e) {
		var checkEquip = new Object();
		checkEquip.masterip = $(this).attr("masterip");
		checkEquip.equipmarkname = $(this).attr("equipmarkname");
		checkEquip.hardwareid = $(this).attr("hardwareid");
		
		var checkIndex = -1;
		var checkData = $("#checkData").val() != "" ? JSON.parse($("#checkData").val()) : new Array();
		$.each(checkData, function(index, item){
			if(item.hardwareid == checkEquip.hardwareid) {
				checkIndex = index;
			}
		});
		
		if(checkIndex > -1) {
			//$(this).css({border: "0px"});
			$(this).removeClass("clik"); //2024-01-22 퍼블 스타일 변경
			//opacity: 1,
			checkData.splice(checkIndex, 1);
		} else {
			//$(this).css({border: "3px solid #FF7012"});
			$(this).addClass("clik"); //2024-01-22 퍼블 스타일 변경
			//opacity: 0.3,
			checkData.push(checkEquip);
		}
		$("#checkData").val(JSON.stringify(checkData));
	});
	
	$(".computer_cont_con ul li").mouseenter(function(e) {
		var html = "";
		html += "<p>" + ($(this).attr("devstatus") == "1" ? "정상" : "비정상") + "</p>";
		html += "<p>" + $(this).attr("equipmarkname") + "</p>";
		html += "<p>" + $(this).attr("masterip") + "</p>";
		html += "<p>" + $(this).attr("osver") + "</p>";
		html += "<p>" + $(this).attr("pattern") + "</p>";
		html += "<p>" + $(this).attr("downloadtime") + "</p>";
		$(".over_data").html(html);
		
		var sWidth = window.innerWidth;
		var sHeight = window.innerHeight;
		
		var oWidth = $(".over_data").width();
		var oHeight = $(".over_data").height();
		
		var divLeft = e.clientX + 5;
		var divTop = e.clientY + 5;
		
		if(divLeft + oWidth + 50 > sWidth) divLeft -= oWidth;
		if(divTop + oHeight + 50 > sHeight) divTop -= oHeight;
		
		if(divLeft < 0) divLeft = 0;
		if(divTop < 0) divTop = 0;
		if($(this).hasClass("on")) {
			$(".over_data").css({
				background: "rgba(85,165,89,0.9)",
				border: "1px solid #addbb0",
			});
		}
		if($(this).hasClass("off")) {
			$(".over_data").css({
				background: "rgba(133,137,141,0.9)",
				border: "1px solid #e5e5e5",
			});
		}
		$(".over_data").css({
			"display" : "block",
			"top": divTop,
			"left": divLeft,
			"position": "fixed"
		}).show();
	});
	$(".computer_cont_con ul li").mouseleave(function() {
		$(".over_data").css({"display" : "none"});
	});
}

function convertNumber(data) {
	return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function startScan() {
	var scanData = {};
	var option = {};
	var policyList = [];
	
	// 검사 자산 설정
	/*
	var checkbox_list = $("input:checkbox[name='checkbox_list']");
	var devList = [];
	var masterip = "";
	var equipmarkname = "";
	var hardwareid = "";
	var firstAgent = "";
	var devCount = 0;
	for(var i = 0; i<checkbox_list.length; i++) {
		if(checkbox_list[i] && checkbox_list[i].checked) {			
			var rowID = $(checkbox_list[i]).attr('id').replace('check', 'row');
			var data = $('#' + rowID).data();
			
			if(!data) continue;
			
			if(firstAgent.length == 0) {
				firstAgent = data.equipmarkname + "(" + data.masterip + ")";
			}
			
			
			if(masterip.length == 0) masterip = data.masterip;
			else masterip += ("¥"+data.masterip);
			
			if(equipmarkname.length == 0) equipmarkname = data.equipmarkname;
			else equipmarkname += ("¥"+data.equipmarkname);
			
			if(hardwareid.length == 0) hardwareid = data.hardwareid;
			else hardwareid += ("¥"+data.hardwareid);
			
			devCount++;
		}		
	}
	if(masterip.length == 0) {
    	alert('자산을 선택해주세요.');
    	return;
    }
    */
	
	var checkData = $("#checkData").val() != "" ? JSON.parse($("#checkData").val()) : new Array();
	var devList = [];
	var masterip = "";
	var equipmarkname = "";
	var hardwareid = "";
	var firstAgent = "";
	var devCount = 0;
	$.each(checkData, function(index, item){
		if(firstAgent.length == 0) {
			firstAgent = item.equipmarkname + "(" + item.masterip + ")";
		}
		
		if(masterip.length == 0) masterip = item.masterip;
		else masterip += ("¥"+item.masterip);
		
		if(equipmarkname.length == 0) equipmarkname = item.equipmarkname;
		else equipmarkname += ("¥"+item.equipmarkname);
		
		if(hardwareid.length == 0) hardwareid = item.hardwareid;
		else hardwareid += ("¥"+item.hardwareid);
		
		devCount++;
	});
	
	if(masterip.length == 0) {
    	alert('자산을 선택해주세요.');
    	return;
    }
	
	scanData.masterip = masterip;
	scanData.equipmarkname = equipmarkname;    	
	scanData.equip_id = hardwareid;
	
	// 검사 경로 설정
	if($("input[name=filename]").length == 1) {
		var policy = new Object(); // mode (ON: 3, OFF: 0)
		policy.mode = 3;
        policy.filename = $("input[name=filename]").val();
        
        if(policy.filename.length > 0) policyList.push(policy);
	} else {
		$("input[name=filename]").each(function(idx){
			var policy = new Object(); // mode (ON: 3, OFF: 0)
			policy.mode = 3;
	        policy.filename = $(this).val();
	        
	        if(policy.filename.length < 1) {
	        	return;        	
	        }
	        
	    	for(var i=0; i<policyList.length; i++) {
	    		if(policyList[i].filename == policy.filename) return;
	    	}    
	    	
	        policyList.push(policy);
		});
	}
	
	/*var fileTable = $('#malwareTable').DataTable();
	var rows = fileTable.rows().data();
	var realCount = 0;
    $.each(rows, function(index, item){
        var policy = new Object(); // mode (ON: 3, OFF: 0)
        policy.mode = _MODE[item[0]];
        policy.filename = item[1];
        policyList.push(policy);
        
        if(_MODE['ON'] == policy.mode) realCount++;
    });
    */
    console.log(policyList);
    if(policyList.length == 0) {
    	alert('검사 파일 경로를 올바르게 입력해주세요.');
    	return;
    }

	scanData.policyList = policyList;
	
	var radioArray = $('div.action').find('input');
	option.action = 0;
	if(radioArray.eq(3).prop('checked')) {
		option.action |= _SCANMODE['REMOVE'];
	} else if(radioArray.eq(2).prop('checked')) {
		option.action = _SCANMODE['COPY'];
	} else if(radioArray.eq(1).prop('checked')) {
		option.action |= _SCANMODE['MOVE'];
	} else {
		option.action |= _SCANMODE['OFF'];
	}
	
	if($('#subcheck').prop('checked')) {
		option.subdir = _SCANMODE['SUBDIR'];
	} else {
		option.subdir = _SCANMODE['NORMAL'];
	}
	
	scanData.option = option;
	scanData.mode = _MODE['ON'];
	
	var message = firstAgent + (devCount<2? "":(" 외 " + (devCount-1) + "대"));	
	swal("멀웨어 통합 검사","설정한 경로에 대해서 검사를 진행하시겠습니까?\n"+message,"./assets/images/icon_alert01.png", {
        buttons: ["취소", "확인"],
    }).then(function(willDelete) {
        if (willDelete) {
        	//console.log(data);
        	console.log(scanData);
        	initMalwareStatus(scanData);
        	//cf_requestServer(_TR_MALWARE_STATUS, data, serviceCall800201CallBack);
        	cf_requestServer(_TR_MALWARE_SCAN_START, scanData, lf_serviceCall800202CallBack);           
        }
    });
}

function lf_serviceCall800202CallBack(data) {
	var status = data.body.status;
	
	if(status == 0) {
		swal("확인", "분석 서버 연결 상태를 확인하세요", {
			icon: "./assets/images/icon_alert04.png",
			buttons:"확인"
		});	
		
		var statusMalwareTable = $('#statusMalwareTable').DataTable();	
		statusMalwareTable.clear().draw();
		return;
	}
	
	swal("확인", "멀웨어 스캔 상황판에서 진행사항을 확인하세요.", {
		icon: "./assets/images/icon_alert04.png",
		buttons:"확인"
	});	
	$('a.btn_control[rel=tab_malware_scan]').trigger('click');	
}

function requestStop(thiz) {
	var data = {};
	data.equipmarkname = $(thiz).attr('equipmarkname');
	data.masterip = $(thiz).attr('masterip');
	data.equip_id = $(thiz).attr('equip_id');

	//console.log(data);
	if($(thiz).find('td').eq(1).text() == _STATUSNAME[2]) { // 검사중일 때만
		swal("멀웨어 통합 검사","선택한 장비의 검사를 중지하시겠습니까?","info", {
	        buttons: ["취소", "확인"],
	    }).then(function(willDelete) {
	        if (willDelete) {
	        	cf_requestServer(_TR_MALWARE_SCAN_STOP, data, function() {} );
	        }
	    });
	}
}
