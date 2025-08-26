var _AUTH_LIST = [
	// 대시보드
	{ parent : 'dashboard', id: 'dashboard' },
	// 이벤트 모니터링
	{ parent : 'eventMonitoring', id: 'eventMonitoring' }, // 230118 eventMonitoring 권한 설정 추가
	// 이벤트 조회 > 호스트 이벤트
	{ parent : 'eventList', id: 'firewallEvent' },
	{ parent : 'eventList', id: 'ipsEvent' },
	{ parent : 'eventList', id: 'malwareEvent' },
	{ parent : 'eventList', id: 'fileIntEvent' },
	{ parent : 'eventList', id: 'fileCtlEvent' },
	{ parent : 'eventList', id: 'pamAclEvent' },
	// 이벤트 조회 > 클러스터 이벤트
	{ parent : 'eventList', id: 'containerSecurityEvent' }, // 230609 containerSecurityEvent 권한 설정 추가
	{ parent : 'eventList', id: 'workloadEvent' }, // workloadEvent 권한 설정 추가
	{ parent : 'eventList', id: 'containerImageControlEvent' }, // 230622 containerImageControlEvent 권한 설정 추가
	{ parent : 'eventList', id: 'imageSecurityEvent' }, // imageSecurityEvent 권한 설정 추가
	{ parent : 'eventList', id: 'complianceEvent' }, // 규정 준수 권한 설정 추가
	// 스캔
	{ parent : 'scan', id: 'complianceScan' }, // 230404 스캔 > 규정 준수 추가 
	{ parent : 'scan', id: 'imageScan' }, // 230220 스캔 > 이미지 추가
	{ parent : 'scan', id: 'cloudScan' },
	{ parent : 'scan', id: 'vulnerabilityScan' },
	// 정책관리 > 호스트 정책
	{ parent : 'policy', id: 'securityPolicy' },
	// 정책관리 > 클러스터 정책
	{ parent : 'policy', id: 'policyContainerSecurity' }, 
	{ parent : 'policy', id: 'policyWorkload' }, 
	{ parent : 'policy', id: 'policyImageSecurity' }, 
	{ parent : 'policy', id: 'policyComplianceScan' }, //230712 정책관리 > 클러스터 정책 > 클러스터 규정준수 스캔 추가
	// 정책관리
	{ parent : 'policy', id: 'cloudManager' }, // 230118 정책 관리 > 자산관리(aegis) 권한 설정 off 
	{ parent : 'policy', id: 'userConfig' },
	{ parent : 'policy', id: 'auditList' },
	//{ parent : 'policy', id: 'policyComplianceScan' },	//230712 정책관리 > 클러스터 정책 > 클러스터 규정준수 스캔 추가
	// 환경설정
	{ parent : 'configure', id: 'authConfig' },
	{ parent : 'configure', id: 'siteConfig' },
	// not used
	/*{ parent : 'malware', id: 'complianceScan' },
	{ parent : 'malware', id: 'imageScan' },*/
	/*{ parent : 'policy', id: 'cloudManagerContainer' }, // 230111 정책 관리 > 자산 관리(cAegis) 권한 설정 추가 > 클라우드 매니저 컨테이너와 병합
	{ parent : 'alertList', id: 'alertList' },
	{ parent : 'malware', id: 'malwareExcept' },
	{ parent : 'policy', id: 'policyManagement' }, // 230201 탐지 룰 관리(cAegis) 추가*/
];

$(function () {
	selectAuth();
});

function selectAuth(){		
	cf_requestServer(_TR_CONFIG_AUTH_SEARCH, null,lf_serviceCall900001CallBack);	
}

function saveAuthList() {
	var body = {};
	var authList = [];

	var trList = $('#authTable').find('tr')
	
	for(var i=0; i<trList.length; i++) {
		var tr = trList[i];
		
		var id = $(tr).attr('rel-id');		
		if(!id) continue;
		
		var obj = {};
		//{ "parent" : "cloud", "id": "cloudStatus", "auth" : [ "0000A399X999", "0000A499X999", "0000A599X999", "0000A699X999" ] },
		obj['parent'] = $(tr).attr('rel-parent');
		obj['id'] = id;
		
		var auth = [];
		var checkbox_list = $(tr).find("input[name='checkbox_list']");				
		auth.push(_USERLEVEL_SUPER_ADMIN);
		if(checkbox_list[1].checked) auth.push(_USERLEVEL_ADMIN);
		if(checkbox_list[2].checked) auth.push(_USERLEVEL_OPERATOR);
		if(checkbox_list[3].checked) auth.push(_USERLEVEL_VIEWER);
		 
		obj['auth'] = auth;
		authList.push(obj);		
	}

	body['authList'] = authList;
		
	swal("권한 설정 변경", "권한 설정 정보를 변경하시겠습니까?", "./assets/images/icon_alert01.png", {
        buttons: ["취소", "확인"],
    }).then(function(willDelete) {
        if (willDelete) {
            cf_requestServer(_TR_CONFIG_AUTH_SET, body,lf_serviceCall900002CallBack);	
        } else {
        	swal("권한 설정 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
        		buttons: "확인",
        	});
        }
    });	
	
}

function getAuth(authList, id) {
	for(var i=0; i<authList.length; i++) {
		var data = authList[i]
		if(data['id'] == id) {
			return data['auth'];
		}
	}
	
	return ['0000A399X999'];
}
		
function lf_serviceCall900001CallBack(data) {
	var table = $('#authTable').DataTable();
	table.clear().draw();
	
	console.log(data);
	
	var authList = data.body.authList;
	var prevParent = '';	
	for(var i=0; i<_AUTH_LIST.length; i++) {		
		var idx = i < 10? '0'+i:i+1;		
		var rowData = _AUTH_LIST[i];
		//var id = 'check01_' + idx;
		var id = 'check_' + rowData['id'] + '_';
		var auth = getAuth(authList, rowData['id']);
		
		var parentName;		
		if(prevParent == rowData['parent']) {
			parentName = '';
		} else {
			parentName = _MENU_LABEL[rowData['parent']];
			if(!parentName) parentName = rowData['parent'];
			
			prevParent = rowData['parent'];
		}
		
		var menuName = _MENU_LABEL[rowData['id']];
		if(!menuName) menuName = rowData['id'];
		
		var row = table.row.add([
			parentName,
			menuName,
			'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id + _USERLEVEL_SUPER_ADMIN + '\' readonly=\'readonly\' checked=\'checked\'><label for=\'' + id + _USERLEVEL_SUPER_ADMIN + '\'></label></div>',
			'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id + _USERLEVEL_ADMIN + '\'><label for=\'' + id + _USERLEVEL_ADMIN + '\'></label></div>',
			'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id + _USERLEVEL_OPERATOR + '\'><label for=\'' + id + _USERLEVEL_OPERATOR + '\'></label></div>',
			'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id + _USERLEVEL_VIEWER + '\'><label for=\'' + id + _USERLEVEL_VIEWER + '\'></label></div>'
			//'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id1 + '\' readonly=\'readonly\' checked=\'checked\'><label for=' + id1 + '></label></div>',
			//'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id2 + '\'><label for=' + id2 + '></label></div>',
			//'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id3 + '\'><label for=' + id3 + '></label></div>',
			//'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=\'' + id4 + '\'><label for=' + id4 + '></label></div>'
		]).draw( true ).node();
		
		$(row).attr('rel-id', rowData['id']);
		$(row).attr('rel-parent', rowData['parent']);
		if(auth.includes(_USERLEVEL_ADMIN)) $(row).find('td:eq(3)').find('input').prop('checked', 'checked');
		if(auth.includes(_USERLEVEL_OPERATOR)) $(row).find('td:eq(4)').find('input').prop('checked', 'checked');
		if(auth.includes(_USERLEVEL_VIEWER)) $(row).find('td:eq(5)').find('input').prop('checked', 'checked');
	}
}

function lf_serviceCall900002CallBack(data) {
	swal("권한 설정 변경", "정상적으로 처리되었습니다.", "./assets/images/icon_alert02.png", {
		buttons: "확인",
	});
	
	selectAuth();
}