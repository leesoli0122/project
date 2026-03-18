$(document).ready(function() {
	selectCloudStatus();
});

function selectCloudStatus(){
	var body = {};
	cf_requestServer(_TR_CLOUD_SERVER_STATUS_STAT, body, lf_serviceCall600071CallBack);	
}

function lf_serviceCall600071CallBack(data) {
	groupList = data.body.dataList;
	groupList.sort(function(a, b) {
		return a.groupid < b.groupid ? -1 : a.groupid > b.groupid ? 1 : 0;
	});
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
		$("#" + item.groupid).append("<li class=\"" + (item.devstatus == 1 ? "on" : "off") + "\" devstatus=\"" + item.devstatus + "\" equipmarkname=\"" + item.equipmarkname + "\" masterip=\"" + item.masterip + "\" osver=\"" + item.osver + "\"></li>");
	});
	
	$(".computer_cont_con ul li").mouseenter(function(e) {
		var html = "";
		html += "<p>" + ($(this).attr("devstatus") == "1" ? "정상" : "비정상") + "</p>";
		html += "<p>" + $(this).attr("equipmarkname") + "</p>";
		html += "<p>" + $(this).attr("masterip") + "</p>";
		html += "<p>" + $(this).attr("osver") + "</p>";
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