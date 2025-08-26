var selectData = {};
var treeNodeMap = {};
var dataMap = {};
var idx = 0;
$(function () {
	//table = $('#processTable').DataTable();
	//table.destroy();
	//table.clear().draw();
	
	selectGroupList();		
});

function addBtn() {	
	var inputData = $('input[name="checkedProcessList"]').val().split('_');
	var cnt = 0; 	
	inputData.forEach(function (item) {
		cnt += opener.requestProcessAdd(item);		
	});
	
	if(cnt > 0) {
		alert(cnt + "개의 프로세스가 추가되었습니다");
	} else {
		alert("추가 된 프로세스가 없습니다");
	}
}

function addProcess(item) {
	//console.log(item);
	if(selectData.hardwareid != item.devID) {
		console.log("no match devID");
		return;
	}
	
	var table = $('#processTable').DataTable();
	var fileName = item['processName'];
	if(item['cmd']) {
		fileName = item['cmd'].split(' ')[0];
	}
	
	var row = table.row.add([
        '<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=check' + idx + ' value=\'' + fileName + '\'><label for=check' + idx + '></label></div>',
        item['processName'],
        item['cpu_rate'] + '%',
        item['mem_rate'] + '%',
        item['cmd'],        
    ] ).draw( false ).node();
    $(row).data(item); 
    $(row).attr("id", 'row' + idx);
    
    idx++;
    lf_addClickEventCheckBox();
}

function selectGroupList(){
	var body = {};
		
	body['groupId'] = 'G0000000000000';

	console.log(body);
	
	cf_requestServer(_TR_GROUP_SEARCH, body, lf_serviceCall800101CallBack);	
}

function selectAgentList(){
	var body = {};
		
	body['groupId'] = 'G0000000000000';
	
	cf_requestServer(_TR_CLOUD_SERVER_STATUS, body, lf_serviceCall600072CallBack);	
}


function initEvent() {    
	$('div.dataTables_paginate').on('click', function(event){
        event.stopPropagation();        
        lf_addClickEventCheckBox();
    });
}

function lf_serviceCall800101CallBack(data) {
	var dataList = data.body['ROOT']['childlist'];
	
	console.log(dataList);
	
	$.each(dataList, function(index, item) {
		addGroupNode('Tree01', 'G0000000000000', item);
	});	
	
	selectAgentList();
}

function lf_serviceCall600072CallBack(data) {
	var dataList = data.body.dataList;
	
	//console.log(dataList);
		
	$.each(dataList, function(index, item) {
		var groupPath = (item['grouppath'] + ':' + item['groupid']).split(':');
		//console.log(item['equipmarkname'] + '/' + item['hardwareid'] + '/' + groupPath);
		if(groupPath.length > 1) {
			addAgentNode('Tree01', groupPath[1], item);
		}
	});
	
	initGroupNode();
	initEvent();
}

function addAgentNode(treeName, parentId, data) {
	var agentId = 'E0000000000000';
	var agentName = 'undefined';
	if(data) {
		agentName = data['equipmarkname'] + ' (' + data['masterip'] + ')'; 
		agentId = data['hardwareid'];
	}
	
	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=' + parentId + ']'));
	if(!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if(!pNode) {
		console.log('pNode(' + parentId + ') not found');
		return;
	}
	
	//var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	//if(!pNode) {
	//	console.log('pNode(' + parentId + ') not found');
	//	return;
	//}
	var sel = pNode.id;
    sel = sel[0];
            
    var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
    var newNode = { "cloudid": agentId, "type": data['devstatus'] == 1? "file":"file_offline", "state" : "open" };
            
	sel = ref.create_node(pNode, newNode, "last", null);
	
    if(sel) {
    	treeNodeMap[treeName + '_' + agentId] = sel;    	    
        ref.rename_node(sel, agentName);
        dataMap[sel] = data;
    }    
}

function addGroupNode(treeName, parentId, data) {
	var groupId;
	var groupName;
	if(data) {
		groupName = data['groupname']; 
		groupId = data['groupid'];
	}
	
	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=' + parentId + ']'));
	if(!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if(!pNode) return false;

	var sel = pNode.id;
    sel = sel[0];
            
    var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
    var newNode = { "cloudid": groupId, "type": "folder", "state" : "open" };

	sel = ref.create_node(pNode, newNode, "last", null);

    if(sel) {
    	treeNodeMap[treeName + '_' + groupId] = sel;
    	ref.rename_node(sel, groupName); 
    	dataMap[sel] = data;    
    }
    
    $('#' + treeName + ' .tree_wrap').jstree("open_all");
}

function initGroupNode() {
	var treeName = 'Tree01';
	var pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node($('#' + treeName + ' li[data-jstree*=G0000000000000]'));
	if(!pNode) pNode = $('#' + treeName + ' .tree_wrap').jstree(true).get_node(treeNodeMap[treeName + '_' + parentId]);
	if(!pNode) return false;

	var sel = pNode.id;
	var ref = $('#' + treeName + ' .tree_wrap').jstree(true);
	if(sel) {		
		var children = ref.get_node(sel).children;
		$.each(children, function(index, item) {
			var agentList = ref.get_node(item).children;
			var groupName = ref.get_node(item).text;			
			//console.log(groupName + '/' + agentList.length);			
			var s = groupName.lastIndexOf('(');
			if(s > 0) {						
				groupName = groupName.substring(0, s)
			}
			groupName = groupName + '(' + agentList.length + ')';
			ref.rename_node(item, groupName);
		});
	}
}

function clickNode(data) {
	var id = data.node.id;
	var icon = data.node.icon;
	
	var iconType = data.node.original.type;
	if(iconType != 'file' && iconType != 'file_offline') {
		//console.log('only agent : ' + id);
		return;
	}
	
	var ref = $('#Tree01 .tree_wrap').jstree(true);
    var sel = ref.get_selected();
    
    if(sel) {
    	selectData = dataMap[sel];
    	var name = selectData.equipmarkname + '(' + selectData.masterip + ')';		
		var type;
    	var message;
    	var name = selectData.equipmarkname + '(' + selectData.masterip + ')';
    	if(selectData.devstatus == 1) {
    		type = "./assets/images/icon_alert01.png";
    		message = name + " 프로세스 정보를 로드하시겠습니까?";
    	} else {
    		type = "./assets/images/icon_alert04.png";
    		message = "경고 : 연결 불안정\n" + name + " 프로세스 정보를 로드하시겠습니까?";
    	}
    	
    	swal("확인", message, type, {
	        buttons: ["취소", "확인"],
	    }).then(function(willDelete) {
	        if(willDelete) {
	        	idx = 0;
	        	$('#equip').text(name);
	        	$('#processTable').DataTable().clear().draw();
	        	requestProcessList(selectData.masterip, selectData.hardwareid, addProcess);
	        }
	    });
    } else {
    	swal("확인", "자산 정보를 찾을 수 없습니다.", {
			icon: "./assets/images/icon_alert04.png",
			buttons:"확인"
		});
    }
}

function lf_addClickEventCheckBox() {
    $('input[name="checkbox_list"]').on('click', function(event) {
        event.stopPropagation();
        var $input = $('input[name="checkedProcessList"]');
        if($(this).prop('checked')) {
            if($input.val().indexOf($(this).val()) == -1) {
                $input.val($input.val() + $(this).val() + '_');
            }
        } else {
            var val = $input.val().replace($(this).val() + '_', '');
            $input.val(val);
        }
    });
}
