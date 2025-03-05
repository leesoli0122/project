
var limit_length = 25;
var lvar_infoData = {};

$(function () {	
	selectUser();
	
	$("input[name=all_checkbox]").on("click", function() {
		var checked = $(this).prop("checked");
		$("input[name=checkbox_list]").each(function() {
			$(this).prop("checked", checked);
		});
	});
});

function selectUser(){
	var body = {};		
	cf_requestServer(_TR_N_USER_LIST, body,lf_serviceCall500011CallBack);	
}

function initUpdateUser(thiz) {
	var rowData = $(thiz).data();
//	console.log(rowData);
	$('#password').show();
	//$('#confirm').removeClass('close');
	buildUpdateModal(rowData);
	modalUi();
}

function initInsertUser() {
	//$('#confirm').removeClass('close');
	$('#password').hide();
	buildInsertModal();
	modalUi();
}

function confirm(thiz) {
	var method = $(thiz).attr('rel');
	
	if(method == 'insert') {
		insertUser();
	} else if(method == 'update') {
		updateUser();
	}
}

function insertUser() {
	var body = checkBodyData();
	body['method'] = 'insert';
	
	if(body['username'].length < 2) {
		swal("사용자 이름은 2글자 이상이여야 합니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
		return;
	}
	
	if(body['username'].length > 20) {
		swal("사용자 이름은 20글자 이내여야 합니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
		return;
	}
	
	//ID
	var idReg = /^[a-z]+[a-z0-9]{5,20}$/g;
    if( !idReg.test(body['userid'])) {
        alert("아이디는 영소문자로 시작하는 6~20자 영소문자 또는 숫자이어야 합니다.");
        return;
    }
    
    //PW    
    var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-`]).{9,20}$/;
    if(body['password1'] == '') { // 1. empty check 
    	swal("비밀번호를 입력하세요.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
        return;
    } else if(body['password1'].length < 9 || body['password1'].length > 20) { // 3. 비밀번호 길이
    	swal("비밀번호는 9~20글자여야 하며, 숫자/영대소문자/특수문자를 모두 포함해야 합니다.", {
    		icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
        return;    
    } else if(!reg.test(body['password1'])){
    	swal("비밀번호는 9~20글자여야 하며, 숫자/영대소문자/특수문자를 모두 포함해야 합니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });   
  		return;
 	} else if(body['password1'].search(/\s/) != -1) { // 1. empty check
 		swal("비밀번호에 공백을 제거해주세요.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    }); 
        return;
    } else if(body['password1'] != body['password2']) { // 2. 비밀번호 일치
    	swal("입력한 비밀번호와 재입력 비밀번호가 일치하지 않습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
        return;
    }
    
    if(body['password1'].indexOf(body['userid']) > -1) {
    	swal("비밀번호에 아이디가 포함되어 있습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
    	return;
    }
    
    var iter = /(.)\1{1,}/;
    if(iter.test(body['password1'])) {
    	swal("비밀번호에 동일한 문자를 연속해서 사용할 수 없습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
    	return;
    }
    
    if(checkSeq(body['password1'])) {
    	swal("비밀번호에 키보드 연속 된 문자를 사용 할 수 없습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
    	return;
    }
    
    if(!/[0-9]{2,3}-[0-9]{3,4}-[0-9]{3,4}$/.test(body['phone'])) {
    	swal("올바른 형식의 전화번호를 입력해주세요.(ex : 010-0000-0000)", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
    	return;
    }
    

    if(!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(body['email'])) {
    	swal("올바른 형식의 이메일을 입력해주세요.(ex : aegis@sgacorp.kr)", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
    	return;
    }
    
    body['password1'] = '';
    body['password2'] = '';

	//console.log(body);
	
	swal("사용자 정보 추가","사용자정보를 추가하시겠습니까?","./assets/images/icon_alert01.png", {
        buttons: ["취소", "확인"],
    }).then(function(willDelete) {
        if (willDelete) {
            cf_requestServer(_TR_N_USER_INSERT_UPDATE, body, serviceCall500012CallBack);
        }
    });	
}


function updateUser() {
	var body = checkBodyData();
	body['method'] = 'update';
	
	if(body['username'].length < 2) {
		swal("사용자 이름은 2글자 이상이여야 합니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
		return;
	}
	
	if(body['username'].length > 20) {
		swal("사용자 이름은 20글자 이내여야 합니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
		return;
	}
	
	//ID
	var idReg = /^[a-z]+[a-z0-9]{5,20}$/g;
    if( !idReg.test(body['userid'])) {
    	swal("아이디는 영소문자로 시작하는 6~20자 영소문자 또는 숫자이어야 합니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
        return;
    }
    
    //PW    
    var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-`]).{9,20}$/;
    if(body['password1'] != '') {
	    if(body['password1'].length < 9 || body['password1'].length > 20) { // 3. 비밀번호 길이
	    	swal("비밀번호는 9~20글자여야 하며, 숫자/영대소문자/특수문자를 모두 포함해야 합니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
	        return;    
	    } else if(!reg.test(body['password1'])){
	    	swal("비밀번호는 9~20글자여야 하며, 숫자/영대소문자/특수문자를 모두 포함해야 합니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });   
	  		return;
	 	} else if(body['password1'].search(/\s/) != -1) { // 1. empty check
	 		swal("비밀번호에 공백을 제거해주세요.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    }); 
	        return;
	    } else if(body['password1'] != body['password2']) { // 2. 비밀번호 일치
	    	swal("입력한 비밀번호와 재입력 비밀번호가 일치하지 않습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
	        return;
	    }
	    
	    if(body['password1'].indexOf(body['userid']) > -1) {
	    	swal("비밀번호에 아이디가 포함되어 있습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
	    	return;
	    }
	    
	    var iter = /(.)\1{1,}/;
	    if(iter.test(body['password1'])) {
	    	swal("비밀번호에 동일한 문자를 연속해서 사용할 수 없습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
	    	return;
	    }
	    
	    if(checkSeq(body['password1'])) {
	    	swal("비밀번호에 키보드 연속 된 문자를 사용 할 수 없습니다.", {
		        icon: "./assets/images/icon_alert04.png",
		        buttons:"확인"
		    });
	    	return;
	    }
	    
	}
    
    if(!/[0-9]{2,3}-[0-9]{3,4}-[0-9]{3,4}/.test(body['phone'])) {
    	swal("올바른 형식의 전화번호를 입력해주세요.(ex : 010-0000-0000)", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
    	return;
    }
    
    if(!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(body['email'])) {
    	swal("올바른 형식의 이메일을 입력해주세요.(ex : aegis@sgacorp.kr)", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
    	return;
    }
    
    body['password1'] = '';
    body['password2'] = '';
    
 	
	//console.log(body);
	
	swal("사용자 정보 변경","사용자정보를 변경하시겠습니까?","./assets/images/icon_alert01.png", {
        buttons: ["취소", "확인"],
    }).then(function(willDelete) {
        if (willDelete) {
            cf_requestServer(_TR_N_USER_INSERT_UPDATE, body, serviceCall500012CallBack);
        }
    });
}



function deleteUser() {
	var table = $('#userTable').DataTable();
	var checkbox_list = $("input:checkbox[name='checkbox_list']");
	
	var aegis = 0;
	var body = {};
	var delList = [];
	for(var i = 0; i<checkbox_list.length; i++) {
		if(checkbox_list[i] && checkbox_list[i].checked) {			
			var rowID = $(checkbox_list[i]).attr('id').replace('check', 'row');
			var data = $('#' + rowID).data();

			if('aegis' == data.userid || 'aegiswas' == data.userid) {
				aegis++;		
				continue;
			}
			
			delList.push(data);							
		}		
	}
	
	if(aegis > 0) {
		swal("사용자 정보 삭제","기본 계정은 삭제 할 수 없습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
	}
	
	if(delList.length < 1) {
		cf_alert(null, '삭제 할 사용자를 선택하세요.');
		return false;
	}
	
	body['userList'] = delList;
	
	swal("사용자 정보 삭제","선택 한 사용자를 삭제하시겠습니까?","/assets/images/icon_alert04.png", {
        buttons: ["취소", "확인"],
    }).then(function(willDelete) {
        if (willDelete) {
            cf_requestServer(_TR_N_USER_DELETE, body, lf_serviceCall500013CallBack);
        }
    });	
}

function selectLevel(v) {
	$('ul li[data-value=0000A399X999]').removeClass('selected');
	$('ul li[data-value=0000A499X999]').removeClass('selected');
	$('ul li[data-value=0000A599X999]').removeClass('selected');
	$('ul li[data-value=0000A699X999]').removeClass('selected');
	$('#authkey').val(v).attr('selected', true);
	
	if(v == _USERLEVEL_SUPER_ADMIN) {
		$('ul li[data-value=0000A399X999]').addClass('selected');
		$('span.current').text('SUPER ADMIN');
	} else if(v == _USERLEVEL_ADMIN) {
		$('ul li[data-value=0000A499X999]').addClass('selected');
		$('span.current').text('ADMIN');
	} else if(v == _USERLEVEL_OPERATOR) {
		$('ul li[data-value=0000A599X999]').addClass('selected');
		$('span.current').text('Operator');
	} else {
		$('ul li[data-value=0000A699X999]').addClass('selected');
		$('span.current').text('Viewer');
	}
}

function buildUpdateModal(rowData) {  
	$('#confirm').attr('rel', 'update');
	$('#modal_title').text('사용자 수정');
	$('#confirm').text('수정');
	$('#userid').attr("readonly", true);
	$('#userid').val(rowData['userid']);
	$('#username').val(rowData['username']);
	$('#email').val(rowData['email']);
	$('#phone').val(rowData['phone']);
	$('#address').val(rowData['address']);
	$('#postname').val(rowData['postname']);	
	$('#password1').val('');
	$('#password2').val('');
	
	selectLevel(rowData['authkey']);
	if(rowData['authkey'] == _USERLEVEL_SUPER_ADMIN) {
		var url = "/otp/qrcode.do?" + new Date().getTime() + "&userId=" + rowData['userid'];
		$("#qrCode").attr("href", "javascript: onLoadImage('" + url + "')");
	}
	
	buildUserGroup();
}

function buildInsertModal() {    
	$('#confirm').attr('rel', 'insert');
	$('#modal_title').text('사용자 추가');
	$('#confirm').text('추가');
	
	$('#userid').removeAttr("readonly");
	$('#userid').val('');
	$('#username').val('');
	$('#email').val('aegis@sgacorp.kr');
	$('#phone').val('010-0000-0000');
	$('#address').val('');
	$('#postname').val('');
	$('#password1').val('');
	$('#password2').val('');
	selectLevel(_USERLEVEL_SUPER_ADMIN);
	
	buildUserGroup();
}

function onLoadImage(url) {
	var img = new Image();
	img.src = url;
	var img_size = 120
	var win_width = img_size + 25;
	var height = img_size + 30;
	var OpenWindow = window.open('2차 인증','_blank', 'width='+win_width+', height='+height+', menubars=no, scrollbars=auto');
	OpenWindow.document.write("<style>body{margin:0px;}</style><img src='"+url+"' width='"+img_size+"'>");
}

function buildUserGroup() {
	//cf_requestServer(_TR_GROUP_SEARCH, null, lf_serviceCall800101CallBack);
	//console.log($('#connect_menu').find('dt em').text()); // 전체개수
}

function checkBodyData() {
	var body = {};
	body['userid'] = $('#userid').val();
	body['username'] = $('#username').val();
	body['email'] = $('#email').val();
	body['phone'] = $('#phone').val();
	body['address'] = $('#address').val();
	body['postname'] = $('#postname').val();
	body['password1'] = $('#password1').val();
	body['password2'] = $('#password2').val();
	body['authkey'] = $('#user_modal01 ul.list li.selected').attr('data-value');

	/* TODO : 일단은 기본값 */
	body['authList'] = [ 'G0000000000000' ];
	
	if(body['password1']) {
		body['enc_pw'] = Base64.encode(body['password1'])
	}
	
	return body;
}

function closeModal() {
	removeDim();
    $('#user_modal01').removeClass('open');
    $("#user_modal01").hide();
    var isVisible = $('#user_modal01').is(':visible');
    var modalLength = $('.modal:visible').length;

    if (isVisible) {
        if (modalLength > 1) {
            $('#user_modal01').fadeOut(250);
        } else {
            $('.dim').fadeOut(250);
        }
    }
}

/* Service Call Back */
function lf_serviceCall500013CallBack(data){
	swal("사용자 정보 삭제","정상적으로 처리되었습니다.", {
        icon: "./assets/images/icon_alert02.png",
        buttons:"확인"
    });
	
//	console.log(data);
	
	selectUser();
}
function lf_serviceCall500011CallBack(data){
	var table = $('#userTable').DataTable();
	table.clear().draw();
//	console.log(data);
	var userList = data.body.userList;
	if(userList.length > 0) {
		for(var i = 0; i < userList.length; i++){
			var idx = i < 10? '0'+i:i+1;
			var rowData = userList[i];			
			var permName;
			var permClass;
			var data = rowData['authkey'];
			if(data == _USERLEVEL_SUPER_ADMIN) {
				permName = 'Super Admin';
				permClass = 'permissions super_bg';
			} else if(data == _USERLEVEL_ADMIN) {
				permName = 'Admin';
				permClass = 'permissions admin_bg';
			} else if(data == _USERLEVEL_OPERATOR) {
				permName = 'Operator';
				permClass = 'permissions operator_bg';
			} else { // _USERLEVEL_VIEWER
				permName = 'Viewer';
				permClass = 'permissions viewer_bg';	
			}
			
			var row = table.row.add([
				'<div class=chk_box><input type=\'checkbox\' name=\'checkbox_list\' id=check' + idx + ' value=><label for=check' + idx + '></label></div>',
				rowData['username'] + '(' + rowData['userid'] + ')',
				rowData['phone'],
				rowData['email'],
				('<span class=\'' + permClass + '\'>' + permName + '</span>'),
				rowData['modifydate']
			]).draw( true ).node();
			
			$(row).find('td').slice(1, 5).addClass('modalLoad');
			$(row).find('td').slice(1, 5).attr('rel', 'user_modal01');
			
			$(row).data(rowData); 
			$(row).attr("id", 'row' + idx);
			$(row).attr("onclick", "javascript: initUpdateUser(this)");
		}
	}
	
	table.draw();	
	modalUi();
}

function lf_serviceCall800101CallBack(data) {
	var groupList = data.body.ROOT.childlist;
	
//	console.log(groupList);
}

function serviceCall500012CallBack(data) {	
	swal("사용자 정보 변경", "사용자 정보가 정상적으로 변경 되었습니다.", "./assets/images/icon_alert02.png", {
        buttons:"확인"
    });
	
//	console.log(data);
	selectUser();
	closeModal();
}
