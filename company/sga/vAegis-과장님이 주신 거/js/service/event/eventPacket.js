var lvar_eventPacket_init = false;
var NON_PRINT_CHAR = "·";
var jsonData;

$(function () {
	lf_detailFrame();
	renderJson();

	$('#logInfo').click(function() {
		replaceClass('logInfo','','open');
		replaceClass('jsonInfo','open','');
		replaceClass('packetInfo','open','');
		$('.tabMgmt_1').show();
		$('.tabMgmt_2').hide();
		$('.tabMgmt_3').hide();
	});

	$('#jsonInfo').click(function() {
		replaceClass('logInfo','open','');
		replaceClass('jsonInfo','','open');
		replaceClass('packetInfo','open','');
		$('.tabMgmt_1').hide();
		$('.tabMgmt_2').show();
		$('.tabMgmt_3').hide();
	});

	$('#packetInfo').click(function() {
		replaceClass('logInfo','open','');
		replaceClass('jsonInfo','open','');
		replaceClass('packetInfo','','open');
		$('.tabMgmt_1').hide();
		$('.tabMgmt_2').hide();
		$('.tabMgmt_3').show();
	});
});

function replaceClass(id, oldClass, newClass) {
    var elem = $(`#${id}`);
    if (elem.hasClass(oldClass)) {
        elem.removeClass(oldClass);
    }
    elem.addClass(newClass);
}

function lf_detailFrame(){
	var val = opener.document.getElementById("detailNum").value;
	var category = val.split('_')[0];
	var num = val.split('_')[1];
	var detailList = $('.paket_detail_list');
	var detailInfo = "";
	
	detailList.find('> li').remove();
	
	switch(category){
		case 'fileInt' : 
			$("#eventLabel").append(" > 파일 무결성");
			detailInfo = (
				"<li><dl><dt>타입</dt><dd></dd></dl></li>"+
				"<li><dl><dt>파일경로</dt><dd></dd></dl></li>"+
				"<li><dl><dt>변경전 퍼미션</dt><dd></dd></dl></li>"+
				"<li><dl><dt>퍼미션</dt><dd></dd></dl></li>"+
				"<li><dl><dt>변경전 GID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>GID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>생성시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>변경전 사이즈</dt><dd></dd></dl></li>"+
				"<li><dl><dt>파일크기</dt><dd></dd></dl></li>"+
				"<li><dl><dt>변경전 UID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>UID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>메시지</dt><dd></dd></dl></li>"+
				"<li><dl><dt>변경전 해시</dt><dd></dd></dl></li>"+
				"<li><dl><dt>해시</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수집시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수정시간</dt><dd></dd></dl></li>"
			); break;
		case 'fileCtl' :
		case 'appCtl' :
			$("#eventLabel").append(" > 실행 파일 통제");
			detailInfo = (
				"<li><dl><dt>파일경로</dt><dd></dd></dl></li>"+
				"<li><dl><dt>장비ID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>장비IP</dt><dd></dd></dl></li>"+
				"<li><dl><dt>PID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>PPID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>메시지</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수정시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수집시간</dt><dd></dd></dl></li>"
			); break;
		case 'http' :
			$("#eventLabel").append(" > 침입 방지 시스템");
			detailInfo = (
				"<li><dl><dt>호스트명</dt><dd></dd></dl></li>"+
				"<li><dl><dt>주소</dt><dd></dd></dl></li>"+
				"<li><dl><dt>포트</dt><dd></dd></dl></li>"+
				"<li><dl><dt>User Agent</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Content Type</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Method</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Protocol</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Status</dt><dd></dd></dl></li>"+
				"<li><dl><dt>길이</dt><dd></dd></dl></li>"+			
				"<li><dl><dt>수정시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수집시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>플로우 ID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>출발지정보</dt><dd></dd></dl></li>"+
				"<li><dl><dt>목적지정보</dt><dd></dd></dl></li>"
			); break;
		case 'pamAcl' :
			$("#eventLabel").append(" > 서비스 제어");
			detailInfo = (
				"<li><dl><dt>허용 여부</dt><dd></dd></dl></li>"+
				"<li><dl><dt>장비ID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>장비IP</dt><dd></dd></dl></li>"+
				"<li><dl><dt>PID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>PPID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>서비스</dt><dd></dd></dl></li>"+
				"<li><dl><dt>사용자</dt><dd></dd></dl></li>"+
				"<li><dl><dt>IP</dt><dd></dd></dl></li>"+
				"<li><dl><dt>메세지</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수정시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수집시간</dt><dd></dd></dl></li>"
			); break;
		// 230207 추가
		case 'imageSecurity' :
			$("#eventLabel").append(" > 컨테이너 이미지 스캔");
			detailInfo = (
				"<li><dl><dt>스캔 유형</dt><dd></dd></dl></li>"+
				"<li><dl><dt>스캔 결과</dt><dd></dd></dl></li>"+
				"<li><dl><dt>스캔 상태</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Registry</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Image Tag</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Digest</dt><dd></dd></dl></li>"+
				"<li><dl><dt>재스캔 여부</dt><dd></dd></dl></li>"+
				"<li><dl><dt>메시지</dt><dd></dd></dl></li>"
			); break;
		case 'containerWorkload' : // 컨테이너 워크로드 실행 제어 추가
			$("#eventLabel").append(" > 컨테이너 워크로드 실행 제어");
			detailInfo = (
				"<li><dl><dt>Result</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Rule Name</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Cluster</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Namespace</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Kind</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Operation</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Action</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Message</dt><dd></dd></dl></li>"
			); break;
		case 'imageRunningControl' : // 컨테이너 이미지 실행 제어 추가
			$("#eventLabel").append(" > 컨테이너 이미지 실행 제어");
			detailInfo = (
				"<li><dl><dt>Result</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Cluster</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Namespace</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Kind</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Operation</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Registry</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Repository User</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Image Tag</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Request User</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Message</dt><dd></dd></dl></li>"
			); break;
		case 'containerSecurity' : // 컨테이너 이벤트 추가
			$("#eventLabel").append(" > 컨테이너 이벤트");
			detailInfo = (
				"<li><dl><dt>Cluster</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Rule Name</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Rule Severity</dt><dd></dd></dl></li>"+
				"<li><dl><dt>Message</dt><dd></dd></dl></li>"
			); break;
		case 'ips' :
			$("#eventLabel").append(" > 침입 방지 시스템");
			detailInfo = (
					"<li><dl><dt>출발지 포트</dt><dd></dd></dl></li>"+
					"<li><dl><dt>수정시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>시그니처</dt><dd></dd></dl></li>"+
					"<li><dl><dt>목적지 포트</dt><dd></dd></dl></li>"+
					"<li><dl><dt>위험도</dt><dd></dd></dl></li>"+
					"<li><dl><dt>클라이언트 Byte</dt><dd></dd></dl></li>"+
					"<li><dl><dt>수집시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>발생시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>플로우 시작 시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>rev</dt><dd></dd></dl></li>"+
					"<li><dl><dt>프로토콜</dt><dd></dd></dl></li>"+
					"<li><dl><dt>클라이언트 패킷</dt><dd></dd></dl></li>"+
					"<li><dl><dt>장비IP</dt><dd></dd></dl></li>"+
					"<li><dl><dt>장비ID</dt><dd></dd></dl></li>"+
					"<li><dl><dt>플로우 ID</dt><dd></dd></dl></li>"+
					"<li><dl><dt>이벤트타입</dt><dd></dd></dl></li>"+
					"<li><dl><dt>GID</dt><dd></dd></dl></li>"+
					"<li><dl><dt>서버 패킷</dt><dd></dd></dl></li>"+
					"<li><dl><dt>탐지명</dt><dd></dd></dl></li>"+
					"<li><dl><dt>분류</dt><dd></dd></dl></li>"+
					"<li><dl><dt>서버 Byte</dt><dd></dd></dl></li>"+
					"<li><dl><dt>출발지정보</dt><dd></dd></dl></li>"+
					"<li><dl><dt>목적지정보</dt><dd></dd></dl></li>"
				); break;
		case 'fw' :
			$("#eventLabel").append(" > 방화벽");
			detailInfo = (
					"<li><dl><dt>출발지 포트</dt><dd></dd></dl></li>"+
					"<li><dl><dt>수정시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>시그니처</dt><dd></dd></dl></li>"+
					"<li><dl><dt>목적지 포트</dt><dd></dd></dl></li>"+
					"<li><dl><dt>위험도</dt><dd></dd></dl></li>"+
					"<li><dl><dt>클라이언트 Byte</dt><dd></dd></dl></li>"+
					"<li><dl><dt>수집시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>발생시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>플로우 시작 시간</dt><dd></dd></dl></li>"+
					"<li><dl><dt>rev</dt><dd></dd></dl></li>"+
					"<li><dl><dt>프로토콜</dt><dd></dd></dl></li>"+
					"<li><dl><dt>클라이언트 패킷</dt><dd></dd></dl></li>"+
					"<li><dl><dt>장비IP</dt><dd></dd></dl></li>"+
					"<li><dl><dt>장비ID</dt><dd></dd></dl></li>"+
					"<li><dl><dt>플로우 ID</dt><dd></dd></dl></li>"+
					"<li><dl><dt>이벤트타입</dt><dd></dd></dl></li>"+
					"<li><dl><dt>GID</dt><dd></dd></dl></li>"+
					"<li><dl><dt>서버 패킷</dt><dd></dd></dl></li>"+
					"<li><dl><dt>탐지명</dt><dd></dd></dl></li>"+
					"<li><dl><dt>분류</dt><dd></dd></dl></li>"+
					"<li><dl><dt>서버 Byte</dt><dd></dd></dl></li>"+
					"<li><dl><dt>출발지정보</dt><dd></dd></dl></li>"+
					"<li><dl><dt>목적지정보</dt><dd></dd></dl></li>"
				); break;
		default : 
			detailInfo = (
				"<li><dl><dt>출발지 포트</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수정시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>시그니처</dt><dd></dd></dl></li>"+
				"<li><dl><dt>목적지 포트</dt><dd></dd></dl></li>"+
				"<li><dl><dt>위험도</dt><dd></dd></dl></li>"+
				"<li><dl><dt>클라이언트 Byte</dt><dd></dd></dl></li>"+
				"<li><dl><dt>수집시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>발생시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>플로우 시작 시간</dt><dd></dd></dl></li>"+
				"<li><dl><dt>rev</dt><dd></dd></dl></li>"+
				"<li><dl><dt>프로토콜</dt><dd></dd></dl></li>"+
				"<li><dl><dt>클라이언트 패킷</dt><dd></dd></dl></li>"+
				"<li><dl><dt>장비IP</dt><dd></dd></dl></li>"+
				"<li><dl><dt>장비ID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>플로우 ID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>이벤트타입</dt><dd></dd></dl></li>"+
				"<li><dl><dt>GID</dt><dd></dd></dl></li>"+
				"<li><dl><dt>서버 패킷</dt><dd></dd></dl></li>"+
				"<li><dl><dt>탐지명</dt><dd></dd></dl></li>"+
				"<li><dl><dt>분류</dt><dd></dd></dl></li>"+
				"<li><dl><dt>서버 Byte</dt><dd></dd></dl></li>"+
				"<li><dl><dt>출발지정보</dt><dd></dd></dl></li>"+
				"<li><dl><dt>목적지정보</dt><dd></dd></dl></li>"
			); break;
	}
	detailList.append(detailInfo);

	lf_eventDetail(category, num);
}

function lf_eventDetail(category, num){
	var detailList = opener.document.getElementById("detailData").value;
	console.log(detailList);
	
	var dataArr = detailList.split('~'); 
	var detail = "";
	dataArr.forEach(element => {
		var target = element.split('¥')[0];
		if(num == target) detail = element.split('¥');
	});
	
	$('#detail_info').text("");
	console.log(detail);
	for(var i=0; i<detail.length; i++){
		if(i<25){
			switch(i){
				case 0 : break; //case 0 : $('.detail_form').find('> h4 span em').text(detail[i]); break;  스킵
				case 1 : break;
				default :
					if($('.paket_detail_list').children(':eq('+(i-2)+')').find('> dl dt').text() != '') { 
						$('.paket_detail_list').children(':eq('+(i-2)+')').find('> dl dd').text(detail[i]); 
						$('.paket_detail_list').children(':eq('+(i-2)+')').find('> dl dd').attr('title', detail[i]);
					}
					break;
			};
		}
	}
	// 230207 jkcho : Registry 자산 로그 정보일 경우 추가 
	if(detail[1] == "Registry"){
		var info = detail[1].split("/");
		$("#deviceNm1").val(/*"(" + num + ") " +*/ info[0].trim());
		$("#eventDtm1").val(detail[9].trim()); // 탐지 시간을 생성일 기준으로 할지 정해야 함
		$("#deviceNm2").val(/*"(" + num + ") " +*/ info[0].trim());
		$("#eventDtm2").val(detail[9].trim()); // 탐지 시간을 생성일 기준으로 할지 정해야 함
	}
	else if(detail.length > 1) {
		var info = detail[1].split("/");
		$("#deviceNm1").val(/*"(" + num + ") " +*/ info[0].trim());
		$("#deviceNm2").val(/*"(" + num + ") " +*/ info[0].trim());
		$("#deviceNm3").val(/*"(" + num + ") " +*/ info[0].trim());
		$("#eventDtm1").val(info[1].trim());
		$("#eventDtm2").val(info[1].trim());
		$("#eventDtm3").val(info[1].trim());
	}
	console.log(detail);
	// 1-dn(equip_ip) 2-src_port 5-dest_port 12-proto 14-equip_ip 16-flow_id 17-event_type 21-category 23-src_ip 24-dest_ip
	var packet_value = detail[12]+'~'+detail[23]+'~'+detail[2]+'~'+detail[24]+'~'+detail[5]+'~'+detail[21]+'~'+detail[17]+'~'+(detail[1].split(' '))[0]+'~'+detail[14]+'~'+detail[16];
	$('#packetData').attr('value',packet_value);
	
	var flowId = detail[16];	
	if(category == 'ips' || category == 'av' || category == 'http'){
		lf_serviceCall700005(flowId);
		$('#packetDownloadBtn').show();
		$('#packetInfo').show();
	}
}

function nobodyPacket() {
	$('#nameBody').val('No data available in table');
}

function lf_serviceCall700005(flow_id){
	var parameters = [];
	var param = {}; 
		param['name'] = 'flow_id';
		param['value'] = flow_id;
		parameters.push(param);

	var body = {
		'info'  : false,
		'parameters': parameters
	};
	
	cf_requestServer(_TR_EVENT_PACKET_SEARCH,body,lf_serviceCall700005Callback);
}

function lf_serviceCall700005Callback(data){
	console.log(data);
	var body = $('#nameBody');
	var binaryTable = $('#packet_data').find('> li:nth-child(1) ul');
	var hexTable = $('#packet_data').find('> li:nth-child(2) ul');
	var nameTable = $('#packet_data').find('> li:nth-child(3) ul');
	var dataList = data.body.dataList[0];
	var cnt = 0;
	var num = 0;
	var nidx = 0;
	var bodyText = "";
	var hexarray = [];
	
	body.text("");
	binaryTable.children().remove();
	hexTable.children().remove();
	nameTable.children().remove();

	if(dataList){
		$("#packetDownloadBtn").attr("href", location.protocol + '//' + location.host + '/download.do?id=packet&flow_id=' + dataList.flow_id);

		hexarray = dataList.hexarray;
		var $LI = $('<li class="num"></li>');
		var $LI2 = $('<li class="num"></li>');
		var len = hexarray.length;
		hexarray.forEach(decimal => {
			// binaryTable
			if(cnt%16 ==0){
				var idx;
				var binary;
				var hex;
				if(num <10){
					idx = '00'+num+'0';
				}else if(num <100){
					idx = '0'+num.toString(16)+'0';
					if(num<16) idx = '00'+num.toString(16)+'0';
				}else if(num <1000){
					idx = num.toString(16)+'0';
				}
				binaryTable.append('<li>'+idx+'</li>');
				num++;
			}
			// hexTable & nameTable
			if(decimal <0){
				binary = (decimal*-1).toString(2);
				var chg = "";
				var add = "";
				for(var i=0; i<binary.length; i++){
					if(binary.charAt(i)>0){
						chg+='0';
					}else{
						chg+='1';
					}
				}
				
				switch(chg.length){	// 음수 2진수 변환
					case 4 : add = "1111"; chg = add+chg; break;
					case 5 : add = "111"; chg = add+chg; break;
					case 6 : add = "11"; chg = add+chg; break;
					case 7 : add = "1"; chg = add+chg; break;
				}
				
				var minus = parseInt(chg,2)+1;
				hex = minus.toString(16).toUpperCase();
			}else{
				hex = decimal.toString(16).toUpperCase();
			}
			if(hex.length < 2) hex= '0'+hex;

			var ascii = hex_to_ascii(hex);
			bodyText+=ascii;
			$LI.append('<span name="span' + (cnt-1) + '">'+hex+'</span>');
			$LI2.append('<span name="span' + (cnt-1) + '">'+ascii+'</span>');

			if(cnt%8 == 0){
				$LI = $('<li class="num" name="num' + (nidx) + '"></li>');
				$LI2 = $('<li class="num" name="num' + (nidx) + '"></li>');
				nidx++;
			}
			if((cnt+1)%8 == 0){
				hexTable.append($LI);
				nameTable.append($LI2);
			}
			cnt++;
		});
		
		body.append(bodyText);
	}else{
		nobodyPacket();
	}
	
	$('.cont_btn1').on('click', function () {
        if ($(this).hasClass('packet')) {
            $(this).html('로그정보');
            $(this).parents('.win_popup').find('.popup_view_cont.logtxt').removeClass('on');
            $(this).parents('.win_popup').find('.popup_view_cont.packet').addClass('on');
            $(this).parents('.modal_cont').find('.popup_view_cont.logtxt').removeClass('on');
            $(this).parents('.modal_cont').find('.popup_view_cont.packet').addClass('on');
            $(this).removeClass('packet');
        } else {
            $(this).html('패킷정보');
            $(this).parents('.win_popup').find('.popup_view_cont.logtxt').addClass('on');
            $(this).parents('.win_popup').find('.popup_view_cont.packet').removeClass('on');
            $(this).addClass('packet');
        }
    });
    $('.packet_box .hex li').each(function (index) {
        $(this).attr('name', 'num' + index);
        $(this).children().attr('name', 'num' + index);
    });
    $('.packet_box .hex li span').each(function (index) {
        $(this).attr('name', 'span' + index);
    });
    $('.packet_box .name li').each(function (index) {
        $(this).attr('name', 'num' + index);
    });
    $('.packet_box .name li span').each(function (index) {
        $(this).attr('name', 'span' + index);
    });
    $('.packet_box').each(function () {
        $('.num').on('mouseover', function () {
            var thisTitle = $(this).attr('name');
            $(".num[name~=" + thisTitle + "]").css({color: "#e5e5e5", background: "#2e6fd4", lineHeight: "28px"});
        });
        $('.num').on('mouseout', function () {
            var thisTitle = $(this).attr('name');
            $(".num[name~=" + thisTitle + "]").css({color: "#e5e5e5", background: "#3a434f"});
        });
        $('.num span').on('mouseover', function () {
            var thisTitle = $(this).attr('name');
            $("span[name~=" + thisTitle + "]").css({border: "1px solid #fff", boxSizing: "border-box"});
        });
        $('.num span').on('mouseout', function () {
            var thisTitle = $(this).attr('name');
            $("span[name~=" + thisTitle + "]").css({border: 'none'});
        });
    });
}

function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var i = parseInt(hex, 16);
	var str = NON_PRINT_CHAR;
	
	if(i > 31 && i < 127) { // PRINTABLE
		str = String.fromCharCode(i);
	}
	
	return str;
 }

function renderJson() {
 	if(!jsonData) {
 		if(!opener.document.getElementById("detailJson")) return;
		var val = opener.document.getElementById("detailJson").value;
		if(!val) return;
	
		jsonData = JSON.parse(val);
		//jsonData = val;//.replace(/\r?\n/g, '\r\n');
	}
	
	var options = {
		collapsed: false,
		rootCollapsable: true,
		withQuotes: false,
		withLinks: true
    };
    $('#json-renderer').jsonViewer(jsonData, options); 
	$('#jsonInfo').show();
}
