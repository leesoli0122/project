$(document).ready(function(){
	userModalUi();
	tfModalUi();
	
	//로그아웃 이벤트
	$('a.logout').on('click',function(e){
		cf_serviceCall100002();
	});
	
	$('a.confirm').on('click',function(e){
		updateCurrentUser();
	});
    
    var timer = setTimeout(function(){
        checkPasswordHistory();
    }, 500);
    
});


// removeDim 에 리스너를 달아놓으니 너무 자주 호출되버려서 임시로 동기화 변수를 사용하여 중복호출을 제한한다.
// 완전한 동기화는 안되더라도 최소화 할 수는 있다.
var sync = 0;
function checkPasswordHistory() {
	if(!cf_getCookie("AUTHINFO")) return "";
	if(sync == 1) return; // 이미 조회 중
		
	if(cf_getCookie("PW_CHANGE")) { // 이미 조회 한적 있음(로그아웃 할 때 까지 유지)
		return;
	}
	
	sync = 1;
	var reqAsync,reqUrl,paramData;	
	var callback = function(data) {
		var auditList = data.body.auditList
		if(auditList == null) return;
		
		if(auditList.length == 0) {
			$("a.userModalLoad").trigger("click");

			if(!$('.password_change_box').hasClass("on")) {
				$('.usr_password_change').trigger("click");	
			}
			
			swal("비밀번호 변경","초기 패스워드를 변경하시기 바랍니다.", {
		        icon: "warning",
		        buttons:"확인"
		    });
		} else {
			console.log("init PW_CHANGE");
			cf_setCookie("PW_CHANGE", "" + auditList.length);
		}
	};
	var body = {};
	var reqTrid = _TR_N_PASSWORD_AUDIT_LIST;
	var Params={};
	
	if(!reqUrl) reqUrl = cf_getJsonUrl();
	if(typeof reqAsync == "undefined" ) reqAsync =  _ASYNC;
	if(!paramData) paramData = null;
	if(_IDPWSERVICE && _IDPWSERVICE[reqTrid]){
		log("_IDPWSERVICE["+reqTrid+"]="+ _IDPWSERVICE[reqTrid]);
		if(!body.enc_userPasswd){
			cf_certCheckDialogPopup(reqTrid,body,callback,reqAsync,reqUrl,paramData);
			return false;
		}else Params['header'] = cf_jsonHeaderSet(reqTrid, body);
	}else Params['header'] = cf_jsonHeaderSet(reqTrid);
	
	if(body) Params['body']= body;
	log('Params',Params); log('url',reqUrl); log('reqAsync',reqAsync);
	
	$.ajax({
		url :reqUrl,
		data : JSON.stringify(Params),
		async  : reqAsync ,
		type : "post",
		//dataType : "json",
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		},
		success:function(data, XMLHttpRequest, textStatus) {
			sync = 0;
			if("00000"!=data.header.rtnCode){ //서비스오류
				//cf_serviceCallError(data);
			}else {				
				callback(data, body);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrow) {
			sync = 0;
			//cf_alert('오류', "AJAX 요청 에러 메세지 : \n " + errorThrow);
		}
		
	});
}

function initUserinfo() {
	if(_USER.getUserId() == '') {
		swal("내정보","로그인 정보가 없습니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
	    
	    
		cf_serviceCall100002();
		return;
	}
		
	$('.modal_cont #currentUserId').val(_USER.getUserId());
	$('.modal_cont #currentUserName').val(_USER.getUserKnm());
	$('.modal_cont #currentUserPhone').val(_USER.getUserPhone());
	$('.modal_cont #currentUserEmail').val(_USER.getUserEmail());
	$('.modal_cont #userPasswd').val('');
	$('.modal_cont #userPasswd1').val('');
	$('.modal_cont #userPasswd2').val('');
	
	var authkey = _USER.getAuthKey();
	if(authkey == _USERLEVEL_SUPER_ADMIN) {
		permName = 'Super Admin';
		permClass = 'permissions super_bg';
	} else if(authkey == _USERLEVEL_ADMIN) {
		permName = 'Admin';
		permClass = 'permissions admin_bg';
	} else if(authkey == _USERLEVEL_OPERATOR) {
		permName = 'Operator';
		permClass = 'permissions operator_bg';
	} else { // _USERLEVEL_VIEWER
		permName = 'Viewer';
		permClass = 'permissions viewer_bg';	
	}
	$('.modal_cont #authkey').removeClass('permissions super_bg admin_bg operator_bg viewer_bg');
	$('.modal_cont #authkey').addClass(permClass);
	$('.modal_cont #authkey').text(permName);

	return true;
}

function tfModalUi() {
	
	$('a.otp_change').on('click',function(e){
		e.preventDefault();
		swal("QR 재발급","QR 재발급시 기존에 발행 된 OTP로 인증이 불가능해집니다. 진행하시겠습니까?","warning", {
	        buttons: ["취소", "확인"],
	    }).then(function(willDelete) {	    	
	    	var body = { "vender" : "totp" };
	    	var passwd = $('#otpPasswd').val();
	    	if(!passwd) {
	    		swal("QR 재발급","비밀번호를 입력해주세요", {
			        icon: "error",
			        buttons:"확인"
			    });		
	    		return;
	    	}	    	
	    	body['userPasswd'] = Base64.encode(passwd);
	    	
	        if (willDelete) {
	            cf_requestServer(_TR_CURRENT_TOTPCODE_UPDATE, body, function(data) {
	            	console.log(data);
	            	var body = data.body;
	            	if(data.body['errorMsg']) {
		            	swal("QR 재발급", data.body['errorMsg'], {
					        icon: "error",
					        buttons:"확인"
					    });
	            		return;
	            	}
	            	
	            	loadOTPData();
	            	$("#otpQRImg").attr("src", "/otp/qrcode.do?" + new Date().getTime());
	            	
					swal("QR 재발급","정상적으로 처리되었습니다.", {
				        icon: "success",
				        buttons:"확인"
				    });				    
				});
	        }
	    });		
	});
	
	// 2차인증 모달 이벤트
	$('a.tfModalLoad').on('click',function(e){
        e.preventDefault();
        
        var $self = $(this);
        var $thisrel = $self.attr('rel');
        var $target = $('#'+ $thisrel);

        // open and focusin
        $target.attr('tabindex', '0').fadeIn(250).focus();        
        // $target.css({ display: 'table' });
        $target.addClass('open');
        //$target.css('z-index', 999999);

        // create background
        createUserDim();

        if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
            $('.modal.open').css({
                marginLeft : 'auto',
                marginTop : 'auto',
            });
        }
        if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
            var layerHeight = $('.modal.open').outerHeight();
            var layerWidth = $('.modal.open').outerWidth();
            $('.modal').css({
                marginLeft : -layerWidth/2,
                marginTop : -layerHeight/2,
            });
        }

        // keydown focus repeat
        $target.find(".close").on('keydown', function(e){
            if(e.which=='9'){
                $target.attr('tabindex', '0').focus();
            }
        });

        // close and focusout
        $target.find(".close").on('click',function(e){
            e.preventDefault();
            $target.fadeOut(250);
            removeUserDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;
            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $target.find(".tfModalLoad").on('click',function(e){
            e.preventDefault();
            $target.fadeOut(250);
            $self.focus();
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $(document).on("keyup", function(e){
            if(e.which=='27'){
                $target.fadeOut(250);
                removeUserDim();
                $self.focus();
                $target.attr('class', 'modal');
            }
        });

        $target.parents('html body').find(".dim").click(function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            removeUserDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });
        if ($('html').hasClass('ie')){
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if($('.modal').hasClass('open')){
                $('.modal.open').css({
                    height : layerHeight,
                    display : 'block',
                });
            } 
            if($('.modal.open').hasClass('dashboard_view')){
                $('.modal.open').css({
                    height : 'auto',
                    display : 'block'
                });
            }
        }
        if ($('html').hasClass('firefox')){
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if($('.modal').hasClass('open')){
                $('.modal.open').css({
                    height : layerHeight,
                    display : 'block',
                });
            }
            if($('.modal.open').hasClass('dashboard_view')){
                $('.modal.open').css({
                    height : 'auto',
                    display : 'block'
                });
            }
        }
    });
    
    loadOTPData();
}

function loadOTPData() {
	var body = { "vender" : "totp" };
	cf_requestServer(_TR_CURRENT_TOTPCODE_LIST, body, function(data) {
		var otpData = data.body.result;
		$('#otpQRCode').text(otpData['data']);
		$('#otpUserid').val(otpData['id']);
		$('#otpCompany').val(otpData['company']);
		$('#otpPasswd').val('');
		$('#otpCreatetime').val(otpData['createtime']);
	});	
}


function updateCurrentUser() {
	var body = {};
	body['currentUserId'] = $('.modal_cont #currentUserId').val();
	body['currentUserName'] = $('.modal_cont #currentUserName').val();
	body['currentUserPhone'] = $('.modal_cont #currentUserPhone').val();
	body['currentUserEmail'] = $('.modal_cont #currentUserEmail').val();
	
	var password = $('.modal_cont #userPasswd').val();
	var password1 = $('.modal_cont #userPasswd1').val();
	var password2 = $('.modal_cont #userPasswd2').val();
	
	if(body['currentUserName'].length > 20) {
		swal("사용자 이름은 20글자 이내여야 합니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
		return;
	}
	
	if(!/[0-9]{2,3}-[0-9]{3,4}-[0-9]{3,4}$/.test(body['currentUserPhone'])) {
    	swal("올바른 형식의 전화번호를 입력해주세요.(ex : 010-0000-0000)", {
	        icon: "warning",
	        buttons:"확인"
	    });
    	return;
    }
    
    if(!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(body['currentUserEmail'])) {
    	swal("올바른 형식의 이메일을 입력해주세요.(ex : aegis@sgacorp.kr)", {
	        icon: "warning",
	        buttons:"확인"
	    });
    	return;
    }
    
    if(password.length < 1) {
		swal("비밀번호를 입력하세요", {
	        icon: "warning",
	        buttons:"확인"
	    });
		return false;
	}
	
	body['userPasswd'] = Base64.encode(password)
	if($('.password_change_box').hasClass('on')) {
		if(checkPassword(password, password1, password2)) {
			body['userNewPasswd'] = Base64.encode(password1);
		} else {
			return false;
		}
	}

    swal("사용자 정보 변경","사용자정보를 변경하시겠습니까?","info", {
        buttons: ["취소", "확인"],
    }).then(function(will) {
        if (will) {
        	cf_requestServer(_TR_CURRENT_USER_UPDATE, body, function(data) {
        		//if($('.password_change_box').hasClass('on')) {
        		//	cf_requestServer(_TR_CURRENT_USER_PASSWORD_UPDATE, body, null);
        		//}
        		
        		lf_serviceCall500012CallBack(data);
        	});
        }
    });	
}


/* 자기 정보 변경 모달 세팅 */
function userModalUi() {
	// 내 정보 변경 모달 세팅
	$('body').append(
		'<div class="modal" id="user_modal">' +
		    '<div class="modal_header">' +
		        '<h3>내정보</h3>' +
		    '</div>' +
		    '<div class="modal_body">' +
		        '<div class="modal_cont">' +
		            '<dl>' +
		                '<dt>' +
		                    '<h4>' +
		                        '<span>User ID</span>' +
		                        '<span id="authkey" class="permissions">' +
		                            'Unknown' +
		                        '</span>' +
		                    '</h4>' +
		                '</dt>' +
		                '<dd>' +
		                    '<div class="ipt_box">' +
		                        '<input type="text" value="" id="currentUserId" readonly>' +
		                    '</div>' +
		                '</dd>' +
		            '</dl>' +
		            '<dl>' +
		                '<dt><h4>Password</h4></dt>' +
		                '<dd>' +
		                    '<div class="ipt_box password">' +
		                        '<input type="password" id="userPasswd" placeholder="기존 비밀번호를 입력해 주세요.">' +
		                        '<a href="#" class="usr_password_change password_change">비밀번호변경</a>' +
		                    '</div>' +
		                    '<div class="password_change_box">' +
		                        '<div class="ipt_box">' +
		                            '<input type="password" id="userPasswd1" placeholder="신규 비밀번호를 입력해 주세요." name="required">' +
		                        '</div>' +
		                        '<div class="ipt_box">' +
		                            '<input type="password" id="userPasswd2" placeholder="신규 비밀번호를 다시한번 입력해 주세요." name="required">' +
		                        '</div>' +
		                    '</div>' +
		                '</dd>' +
		            '</dl>' +
		            '<dl>' +
		                '<dt>' +
		                    '<h4>' +
		                        '<span>User Name</span>' +
		                    '</h4>' +
		                '</dt>' +
		                '<dd>' +
		                    '<div class="ipt_box">' +
		                        '<input type="text" id="currentUserName" placeholder="사용자의 이름을 입력해주세요." value="" name="required">' +
		                    '</div>' +
		                '</dd>' +
		            '</dl>' +
		            '<dl>' +
		                '<dt>' +
		                    '<h4>' +
		                        '<span>User Phone</span>' +
		                    '</h4>' +
		                '</dt>' +
		                '<dd>' +
		                    '<div class="ipt_box">' +
		                        '<input type="text" id="currentUserPhone" placeholder="연락처를 입력해 주세요." value="" name="required">' +
		                    '</div>' +
		                '</dd>' +
		            '</dl>' +
		            '<dl>' +
		                '<dt>' +
		                    '<h4>' +
		                        '<span>User Email</span>' +
		                    '</h4>' +
		                '</dt>' +
		                '<dd>' +
		                    '<div class="ipt_box">' +
		                        '<input type="text" id="currentUserEmail" placeholder="이메일를 입력해 주세요." value="auditcastle@sgacorp.co.kr" name="required">' +
		                    '</div>' +
		                '</dd>' +
		            '</dl>' +
		        '</div>' +
		    '</div>' +
		    '<div class="modal_footer">' +
		        '<div class="btn_wrap fr">' +
		            '<a href="#" class="btn grey close">취소</a>' +
		            '<a href="#" class="btn confirm">수정</a>' +
		        '</div>' +
		    '</div>' +
		    '<div class="modal_controller">' +
		        '<a href="#" class="close">close</a>' +
		    '</div>' +
		'</div>'
	);
		
	// 내 정보 변경 모달 이벤트
	$('a.userModalLoad').on('click',function(e){
        e.preventDefault();
        if(!initUserinfo()) return;
        
        var $self = $(this);
        var $thisrel = $self.attr('rel');
        var $target = $('#'+ $thisrel);

        // open and focusin
        $target.attr('tabindex', '0').fadeIn(250).focus();        
        // $target.css({ display: 'table' });
        $target.addClass('open');
        //$target.css('z-index', 999999);

        // create background
        createUserDim();

        if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
            $('.modal.open').css({
                marginLeft : 'auto',
                marginTop : 'auto',
            });
        }
        if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
            var layerHeight = $('.modal.open').outerHeight();
            var layerWidth = $('.modal.open').outerWidth();
            $('.modal').css({
                marginLeft : -layerWidth/2,
                marginTop : -layerHeight/2,
            });
        }

        // keydown focus repeat
        $target.find(".close").on('keydown', function(e){
            if(e.which=='9'){
                $target.attr('tabindex', '0').focus();
            }
        });

        // close and focusout
        $target.find(".close").on('click',function(e){
            e.preventDefault();
            $target.fadeOut(250);
            removeUserDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;
            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $target.find(".userModalLoad").on('click',function(e){
            e.preventDefault();
            $target.fadeOut(250);
            $self.focus();
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });

        $(document).on("keyup", function(e){
            if(e.which=='27'){
                $target.fadeOut(250);
                removeUserDim();
                $self.focus();
                $target.attr('class', 'modal');
            }
        });

        $target.parents('html body').find(".dim").click(function (e) {
            e.preventDefault();
            $target.fadeOut(250);
            removeUserDim();
            $self.focus();
            $(this).off('click');
            $target.removeClass('open');
            var isVisible = $target.is(':visible');
            var modalLength = $('.modal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                    $target.fadeOut(250);
                } else {
                    $('.dim').fadeOut(250);
                }
            }
        });
        if ($('html').hasClass('ie')){
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if($('.modal').hasClass('open')){
                $('.modal.open').css({
                    height : layerHeight,
                    display : 'block',
                });
            } 
            if($('.modal.open').hasClass('dashboard_view')){
                $('.modal.open').css({
                    height : 'auto',
                    display : 'block'
                });
            }
        }
        if ($('html').hasClass('firefox')){
            var headHeight = $('.modal.open .modal_header').innerHeight();
            var bodyHeight = $('.modal.open .modal_body').innerHeight();
            var footerHeight = $('.modal.open .modal_footer').innerHeight();
            var layerHeight = headHeight + bodyHeight + footerHeight;
            if($('.modal').hasClass('open')){
                $('.modal.open').css({
                    height : layerHeight,
                    display : 'block',
                });
            }
            if($('.modal.open').hasClass('dashboard_view')){
                $('.modal.open').css({
                    height : 'auto',
                    display : 'block'
                });
            }
        }
    });    
    
    // 패스워드 변경 이벤트
	if ($('.usr_password_change').length){
        $('.usr_password_change').on('click',function (e) {
            e.preventDefault();
                        
            $('.password_change_box').toggleClass('on');
            if ($('html').hasClass('ie')){
                var headHeight = $('.modal.open .modal_header').innerHeight();
                var bodyHeight = $('.modal.open .modal_body').innerHeight();
                var footerHeight = $('.modal.open .modal_footer').innerHeight();
                var layerHeight = headHeight + bodyHeight + footerHeight;
                if($('.modal').hasClass('open')){
                    $('.modal.open').css({
                        height : layerHeight,
                        display : 'block',
                    });
                }
            }
            if ($('html').hasClass('firefox')){
                var headHeight = $('.modal.open .modal_header').innerHeight();
                var bodyHeight = $('.modal.open .modal_body').innerHeight();
                var footerHeight = $('.modal.open .modal_footer').innerHeight();
                var layerHeight = headHeight + bodyHeight + footerHeight;
                if($('.modal').hasClass('open')){
                    $('.modal.open').css({
                        height : layerHeight,
                        display : 'block',
                    });
                }
            }
        });
    }
	
}

function createUserDim(){
    if (!$('.dim').length) {
        $('body').append('<div class="dim"></div>');
    }

    $('.dim').fadeIn(250);
    if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
        $('body').css({
            overflow : 'hidden'
        }).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
    if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
        $('body').css({
            overflowX : 'scroll'
        }).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
}

function closeUserModal() {
	removeUserDim();
    $('#user_modal').removeClass('open');
    $("#user_modal").hide();
    var isVisible = $('#user_modal').is(':visible');
    var modalLength = $('.modal:visible').length;

    if (isVisible) {
        if (modalLength > 1) {
            $('#user_modal').fadeOut(250);
        } else {
            $('.dim').fadeOut(250);
        }
    }    
}

function removeUserDim(){
	$('.password_change_box').removeClass('on');
	
    $('.dim').fadeOut(250);
    if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
        $('body').css({
            overflow : 'inherit'
        }).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
    if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
        $('body').css({
            overflowX : 'auto'
        }).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
    
    var timer = setTimeout(function(){
        checkPasswordHistory();
    }, 1000);
}

function lf_serviceCall500012CallBack(data) {  
	swal("사용자 정보 변경","사용자 정보가 정상적으로 변경 되었습니다.", {
        icon: "success",
        buttons:"확인"
    });
    
    //_AUTHINFO = data.body.authToken;
    var _authinfo = cf_getCookie("AUTHINFO");
    _authinfo = Base64.decode(_authinfo);
    var authArray = _authinfo.split('|');
    
    cf_setCookie("AUTHINFO", Base64.encode(
		authArray[0]+"|"
		+authArray[1]+"|"
		+authArray[2]+"|"
		+data.body.currentUserName+"|"
		+authArray[4]+"|"
		+authArray[5]+"|"
		+data.body.currentUserPhone+"|"
		+data.body.currentUserEmail
		)
	);
	cf_userInfoSet();
	closeUserModal();
	$('#currentUserId').attr('title', _USER.getUserId());
	$('#currentUserId').text(_USER.getUserKnm());   
}

function checkSeq(str){
	var max = 3; // 3자리 이상 검사
	var i, j, k, x, y;
	var buff = ["0123456789","abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ","qwertyuiopasdfghjklzxcvbnm","QWERTYUIOPASDFGHJKLZXCVBNM"]

	var scr, src2, ptn = "";

	for(i = 0; i < buff.length; i++){
		src = buff[i];
		src2 = buff[i] + buff[i];

		for(j = 0; j < src.length; j++){
			x = src.substr(j, 1);
			y = src2.substr(j, max);
			ptn += "["+x+"]{"+max+",}|";
			ptn += y+"|";

		}
	}
	
	ptn = new RegExp(ptn.replace(/.$/, ""));

	if(ptn.test(str)) return true;
	
	return false;
}

function checkPassword(password, password1, password2) {
	var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-`]).{9,20}$/;
    if(password1 == '') {
    	swal("", "신규 비밀번호를 입력하여 주세요.", "", {
			buttons:"확인"
		});
		return false; 
    } else if(password1.length < 9 || password1.length > 20) { // 3. 비밀번호 길이
    	swal("비밀번호는 9~20글자여야 하며, 숫자/알파벳/특수문자를 모두 포함해야 합니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
        return false;    
    } else if(!reg.test(password1)){   
    	swal("비밀번호는 9~20글자여야 하며, 숫자/알파벳/특수문자를 모두 포함해야 합니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
  		return false;
 	} else if(password1.search(/\s/) != -1) { // 1. empty check 
		swal("비밀번호에 공백을 제거해주세요.", {
	        icon: "warning",
	        buttons:"확인"
	    });
    	return false;
	} else if(password1 != password2) { // 2. 비밀번호 일치
		swal("입력한 비밀번호와 재입력 비밀번호가 일치하지 않습니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
        return false;
    } else if(password == password1) {
    	swal("이전 비밀번호가 동일한 비밀번호는 사용 하실 수 없습니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
	    return false;
    }
    
    var iter = /(.)\1{1,}/;
    if(iter.test(password1)) {
    	swal("비밀번호에 동일한 문자를 연속해서 사용할 수 없습니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
    	return;
    }
    
    if(checkSeq(password1)) {
    	swal("비밀번호에 키보드 연속 된 문자를 사용 할 수 없습니다.", {
	        icon: "warning",
	        buttons:"확인"
	    });
    	return;
    }
    
    return true;    
}