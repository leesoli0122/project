var evar_param_prefix = 'event_equiplist';

$(function () {
	$("input:checkbox[name='all_checkbox']").on('click', function () {
		if (this.checked) $("input:checkbox[name='checkbox_list']").prop("checked", true);
		else $("input:checkbox[name='checkbox_list']").prop("checked", false);
	});
});

function lf_initEquipList(){
	
	lf_eventEquipSearchClear();
	var body = {
		'startNum' : 0,
		'rowCnt' :  50
	};
	
	cf_requestServer(_TR_AGENT_SEARCH,body,lf_serviceCall800120Callback);
	
	$(".equip_all_select").on('click',function(e){
		ln_allSelect();
	});
}

function lf_eventEquipSearchClear(){
	//$('#'+evar_param_prefix+'_current').text("---");
	$('#'+evar_param_prefix+'_name').val("");
	$(".equiplist_choice_info > span > em").text(0);
	$('.equip_all_select input[type=checkbox]').prop('checked', false);
}

function lf_serviceCall800120Callback(data){
	var table = $('#'+evar_param_prefix+'_table').DataTable();
	table.clear().draw();
	$('#'+evar_param_prefix+'_box').find('ul').children().remove();
	
	var dataList = data.body.dataList;
	$.each(dataList, function(idx, rowData){
		var number = idx+1;
		var chkbox = "<td class=\'chk_box\'><input type=\'checkbox\' name=\'checkbox_list\' id=\'check"+number+"\' value=\'"+rowData['masterip']+"~"+rowData['equipmarkname']+"~"+rowData['hardwareid']+"\' onclick=\'javascript:ln_checkboxSelected(this);\'><label for=\'check"+number+"\'></label></input></td>"
		table.row.add([
			chkbox,
			"<td class=\'long_w\'>"+rowData['masterip']+"</td>",
			"<td class=\'long_w\'>"+rowData['equipmarkname']+"</td>",
			"<td class=\'long_w\'>"+rowData['groupname']+"</td>"
		]);
		//$('.nice-select').find('> ul').append('<li data-value=\"'+rowData['masterip']+'\" class="option">'+rowData['masterip']+'</li>');
	});
	$('#'+evar_param_prefix+'_ips').find('> div span').attr('id',evar_param_prefix+'_current');
	$('#'+evar_param_prefix+'_ips').find('> div ul').attr('style','width:160px; height:242px; overflow:auto;');
	table.draw();

}

function ln_removeElement(obj) {
	$(obj).parent().remove();
	$(".equiplist_choice_info > span > em").text($(".equiplist_list_box ul > li").length);
}

function ln_allSelect() {
	var table = $('#event_equiplist_table').DataTable();
	var tablefc = $('#'+evar_param_prefix+'_box');
	var count = 0;
	
	tablefc.find('ul').empty();
	table.rows().every(function (item, index, element) {         
    	var data = this.data(); 
    	var node = this.node();
    	
		var equipData = {};
		var $TR = $('<li></li>');
    	if($(node).find("input[name=checkbox_list]").is(':checked')) {
    		var data = $(node).find("input[name=checkbox_list]").attr('value').split('~');
    		equipData['masterip'] = data[1];
			equipData['equipmarkname'] = data[0];
			equipData['hardwareid'] = data[2];
    		var qid = data[1]+'(' + data[0] + ')';
    		qid = qid.replace(/ /g, "");
    		$TR.data('equipData', equipData);
    		$TR.append('<p><span data-type=' + qid + '>'+ qid + '</span></p>');
			$TR.append($('<a class="removex" title="삭제" onclick="javascript: ln_removeElement(this);"></a>'));
			
    		tablefc.find('ul').append($TR);
    		count++;
    	}
    });
    
    $(".equiplist_choice_info > span > em").text($(".equiplist_list_box ul > li").length);
}

function ln_checkboxSelected(obj){
	
	var equipData = {};

	var table = $('#'+evar_param_prefix+'_box');
	var $TR = $('<li></li>');
	
	var val = $(obj).val();
	equipData['masterip'] = val.split('~')[0];
	equipData['equipmarkname'] = val.split('~')[1];
	equipData['hardwareid'] = val.split('~')[2];
	var checked = $(obj).is(':checked');
	
	var qid = equipData['equipmarkname']+'(' + equipData['masterip'] + ')';
	if(checked){
		$TR.data('equipData', equipData);
		$TR.append('<p><span data-type=' + qid + '>'+ qid + '</span></p>');
		$TR.append($('<a class="removex" title="삭제" onclick="javascript: ln_removeElement(this);"></a>'));
		table.find('ul').append($TR);
	} else {
		ln_removeElement($(".equiplist_list_box ul > li > p > span[data-type='" + qid + "']").parent().siblings());
	}
	
	$(".equiplist_choice_info > span > em").text($(".equiplist_list_box ul > li").length);
}

function lf_addEquipList(){
	var equipTable = $('#'+evar_param_prefix+'_box');
	var count = 0;
	var title = "";
	var firstName = "";

	var type =  'equiplist';
	var value = "";
	var queryData = {
		'type': type,
		'value': value
	};

	equipTable.find('ul li').each(function(){
		var equipData = $(this).data('equipData');
		var masterip = equipData['masterip'];
		var equipmarkname = equipData['equipmarkname'];
		var hardwareid = equipData['hardwareid'];
		
		if(count == 0){
			firstName = equipmarkname;
		}
		
		value += hardwareid+",";
		title += masterip+" "+equipmarkname+" / ";
		count++;
	});
	
	if(count == 0) return;

	queryData['value'] = value.substr(0, value.length -1);
	var etc = count-1;
	
	var queryTable = $('#'+lvar_param_prefix+'_queryTable');
	var $TR = $('<li></li>');
	$TR.data('queryData', queryData);
	if(etc>0){
		$TR.append('<p title="'+title+'"><span>자산</span> / <span>'+firstName+' <em>외 <span>'+etc+'</span>개</em></span></p>');
		
	}else{
		$TR.append('<p title="'+title+'"><span>자산</span> / <span>'+firstName+'</span></p>');
	}
	$TR.append('<a class="removex" title="삭제" onclick="javascript: $(this).parent().remove();"></a>');
	queryTable.find('ul').append($TR);
	
}

function lf_searchEquipList(){
	var v = $('#'+evar_param_prefix+'_current').parent().find('.selected').attr('data-value');

	var masterip = ($('#'+evar_param_prefix+'_current').text() != '---' ? $('#'+evar_param_prefix+'_current').text() : "");
	var equipmarkname = $('#'+evar_param_prefix+'_name').val();
	
	var body = {
		'startNum' : 0,
		'rowCnt' :  50
	};
	
	if(equipmarkname != '') {
		if(v == 'equipIP') {
			body['masterip'] = equipmarkname;
		} else { // equipname
			body['equipmarkname'] = equipmarkname;
		}
	}

	cf_requestServer(_TR_AGENT_SEARCH,body,lf_serviceCall800120Callback);
}

function lf_exportFile(thiz) {
	var id = $(thiz).attr('data-id');
	var format = $(thiz).attr('data-format');
	var param_prefix  = $(thiz).attr('data-ui');
	
	var parameters = [];
	var starttime = null;
	var endtime = null;
	var equiplist = null;
	var queryTable = $('#'+param_prefix+'_queryTable');
	
	queryTable.find('ul li').each(function(){
		var queryData = $(this).data('queryData');
		var type = queryData['type'];
		var operation = queryData['operation'];
		var value = queryData['value'];
		if('searchtime' == type){
			var timeArr = value.split('~');
			starttime = timeArr[0];
			endtime = timeArr[1];
		}
		else if('equiplist' == type){
			var eqList = queryData['value'].split(",");
			if(eqList != null && eqList.length > 0) {
				if(equiplist == null) {
					equiplist = eqList;
				} else {
					equiplist.push(...eqList);
				}
			}
		}
		else{
			var param = {}; 
			param['name'] = type;
			param['value'] = value;
			param['operation'] = operation;
			parameters.push(param);
		}
		
	});
	
	var body = {
		'page' : lvar_event_pageNum,
		'topn' :  lvar_event_pageCnt,
		'parameters': parameters
	};
	body['id'] = id;
	body['format'] = format;
	if(equiplist != null) body['equiplist'] = equiplist;
	if(starttime != null) body['starttime'] = starttime;
	if(endtime != null) body['endtime'] = endtime;

	cf_alert("엑셀 다운로드", "다운로드가 준비되면 자동으로 시작됩니다.\n페이지를 이동하지 말고 기다려주세요.");
	$.ajax({
        type : 'POST',
        url : '/export.do',
        dataType : 'json',
        loadingTarget: true,
        data : JSON.stringify(body),
        success : function(result) {
            //alert("success");
            //console.log(result);
            //window.location.assign(url);
            var link=document.createElement('a');
    		link.href = "/export.do?filename=" + result.filename;
    		link.download = result.filename;
    		link.click();
            
        },
        error: function(request, status, error) {
        	alert("error");
        }
    });
}
