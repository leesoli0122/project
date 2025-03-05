$(function () {
	selectSite();
});

function selectSite(){
	cf_requestServer(_TR_CONFIG_SITE_SEARCH, null,lf_serviceCall900011CallBack);	
}



function selectValue(k, v) {
	var kv = k + v;
	$('#'+k).parent().find('ul.list li').removeClass('selected');
	$('#'+k).parent().find('ul.list li[data-value=' + v + ']').addClass('selected');
	var selText = $('#'+k).parent().find('ul.list li[data-value=' + v + ']').text()	
	$('#'+k).parent().find('span.current').text(selText);	
}

function getValue(k) {
	var obj = $('#' + k).parent();
	var sel = obj.find('li.selected')
	return sel.attr('data-value').replace(k, '');
}



function saveSiteConfigure() {
	var body = {};
	var site = {};
	var otp = {};
	
	// enter.properties
	site['loginExpire'] = getValue('loginExpire');
	site['loginBanCount'] = getValue('loginBanCount');
	site['loginBanTime'] = getValue('loginBanTime');
	site['loginOtp'] = getValue('loginOtp');
	site['loginLimit'] = $('#loginLimit').val();
	site['loginAuthIPList'] = $('#loginAuthIPList').val();
		
	site['activeAgent'] = getValue('activeAgent');
	site['activeAgentLogCount'] = $('#activeAgentLogCount').val();
		
	site['run'] = 'true';
	site['masterip'] = $('#masterip').val();
	site['masterport'] = $('#masterport').val();
	site['username'] = $('#username').val();
	site['password'] = $('#password').val();
	
	site['servicename'] = $('#servicename').val();
	site['serviceid'] = $('#serviceid').val();
	site['serviceip'] = $('#serviceip').val();
	site['serviceport'] = $('#serviceport').val();
	site['servicecode'] = '0403X999X999';
	body['site'] = site;
		
	var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	var portformat = /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|5\d{4}|[0-9]\d{0,3})$/;
	var numformat = /^[\d]{1,5}$/;
	
    if(!ipformat.test(site['masterip'])) {
        cf_alert(null, 'IP 정보를 형식에 맞게 기입해주세요.');
		return false;
    }    
    if(!portformat.test(site['masterport'])) {
        cf_alert(null, 'Port 정보를 형식에 맞게 기입해주세요.');
		return false;
    }
    
    if(!ipformat.test(site['serviceip'])) {
        cf_alert(null, 'IP 정보를 형식에 맞게 기입해주세요.');
		return false;
    }
    
    if(!portformat.test(site['serviceport'])) {
        cf_alert(null, 'Port 정보를 형식에 맞게 기입해주세요.');
		return false;
    }
    
    if(!site['servicename']) {
    	cf_alert(null, '로그 수집 서버 이름을 형식에 맞게 기입해주세요.');
		return false;
    }
    
    if(!site['serviceid']) {
    	cf_alert(null, '로그 수집 서버 ID를 형식에 맞게 기입해주세요.');
		return false;
    }
    
    var ipArray = site['loginAuthIPList'].split(",");
    if(ipArray.length > 0 && ipArray[0].length > 0) {
    	for(var idx = 0; idx < ipArray.length; idx++) {
    		if(!ipformat.test(ipArray[idx])) {
		        cf_alert(null, '로그인 허용 IP를 형식에 맞게 기입해주세요.');
				return false;
		    }
    	}
    }

	if(!numformat.test(site['activeAgentLogCount'])) {
        cf_alert(null, '최대 로그 수집 건수를 형식에 맞게 입력해주세요(0-99999)');
		return false;
    }
    
    if(!numformat.test(site['loginLimit'])) {
        cf_alert(null, '최대 로그인 세션수를 형식에 맞게 입력해주세요(0-99999)');
		return false;
    }
    
    if(site['loginLimit'] < 1) {
    	site['loginLimit'] = 0;
    	$('#loginLimit').val(0);
    }
    
    	
	// tf_otp.json
	var windowformat = /^[1-5]{1}$/;
	var companyformat = /^([a-zA-Z0-9][a-zA-Z0-9-]{1,}\.){1,}([a-zA-Z0-9]){1,}$/;
	
	otp['active'] = getValue('otpActive');
	otp['window'] = getValue('window');
	otp['vender'] = getValue('vender');
	otp['policy'] = getValue('policy');
	otp['company'] = $('#company').val();
	otp['address'] = $('#address').val();
	otp['plainPort'] = $('#plainPort').val();
	otp['sslPort'] = $('#sslPort').val();
	
	otp['otpPrimaryHost'] = $('#otpPrimaryHost').val();
	otp['otpSecondaryHost'] = $('#otpSecondaryHost').val();
	otp['otpPort'] = $('#otpPort').val();
	otp['otpSecret'] = $('#otpSecret').val();
	otp['otpTimeout'] = getValue('otpTimeout');
	otp['otpClient'] = $('#otpClient').val();
	
	body['otp'] = otp;
	
	if(!otp['window']) {
        cf_alert(null, '최대 로그 수집 건수를 형식에 맞게 입력해주세요(0-20)');
		return false;
    }
    if(!companyformat.test(otp['company'])) {
        cf_alert(null, '발급주체를 도메인 형식에 맞게 입력해주세요(aegis.com)');
		return false;
    }
    if(!companyformat.test(otp['company'])) {
        cf_alert(null, '발급주체를 도메인 형식에 맞게 입력해주세요(aegis.com)');
		return false;
    }
    if(!portformat.test(otp['plainPort'])) {
        cf_alert(null, 'Plain Port 정보를 형식에 맞게 기입해주세요.(0 미사용)');
		return false;
    }
    if(!portformat.test(otp['sslPort'])) {
        cf_alert(null, 'SSL Port 정보를 형식에 맞게 기입해주세요.(0 미사용)');
		return false;
    }
    if(!portformat.test(otp['otpPort'])) {
        cf_alert(null, 'OTP 인증 Port 정보를 형식에 맞게 기입해주세요.');
		return false;
    }
    if(!ipformat.test(otp['address'])) {
        cf_alert(null, '2차 인증 IP 정보를 형식에 맞게 기입해주세요.');
		return false;
    } 
    if(!ipformat.test(otp['otpPrimaryHost'])) {
        cf_alert(null, 'OTP 서버 IP 정보를 형식에 맞게 기입해주세요.');
		return false;
    }
    if(!ipformat.test(otp['otpSecondaryHost'])) {
        cf_alert(null, 'OTP 보조 서버 IP 정보를 형식에 맞게 기입해주세요.');
		return false;
    }
    if(!ipformat.test(otp['otpClient'])) {
        cf_alert(null, 'OTP Nas IP 정보를 형식에 맞게 기입해주세요.');
		return false;
    }
    if(!otp['otpSecret']) {
    	cf_alert(null, 'OTP 키를 형식에 맞게 기입해주세요.');
		return false;
    }
    
	//console.log(site);
		
	swal("사이트 정보 변경","사이트 정보를 저장하시겠습니까?\n[일부 내용은 서버 재시작 후에 적용됩니다]","info", {
        buttons: ["취소", "확인"],
    }).then(function(willDelete) {
        if (willDelete) {
            cf_requestServer(_TR_CONFIG_SITE_SET, body,lf_serviceCall900012CallBack);
        }
    });    	
}	

function lf_serviceCall900011CallBack(data) {
	console.log(data);
	var site = data.body.site;
	var otp = data.body.otp;
	
	selectValue('loginExpire', site['loginExpire']);
	selectValue('loginBanCount', site['loginBanCount']);
	selectValue('loginBanTime', site['loginBanTime']);
	selectValue('loginOtp', site['loginOtp']);
	
	$('#loginLimit').val(site['loginLimit']);
	$('#loginAuthIPList').val(site['loginAuthIPList']);
	
	selectValue('activeAgent', site['activeAgent']);
	$('#activeAgentLogCount').val(site['activeAgentLogCount']);

	$('#masterip').val(site['masterip']);
	$('#masterport').val(site['masterport']);
	$('#username').val(site['username']);
	$('#password').val(site['password']);
	
	$('#servicename').val(site['servicename']);
	$('#serviceid').val(site['serviceid']);
	$('#serviceip').val(site['serviceip']);
	$('#serviceport').val(site['serviceport']);
	
	if(!otp) return;
	selectValue('otpActive', otp['active']);
	selectValue('window', otp['window']);
	selectValue('vender', otp['vender']);
	selectValue('otpTimeout', otp['otpTimeout']);
	$('#company').val(otp['company']);
	$('#address').val(otp['address']);
	$('#plainPort').val(otp['plainPort']);
	$('#sslPort').val(otp['sslPort']);
	$('#otpPrimaryHost').val(otp['otpPrimaryHost']);
	$('#otpSecondaryHost').val(otp['otpSecondaryHost']);
	$('#otpPort').val(otp['otpPort']);
	$('#otpSecret').val(otp['otpSecret']);
	$('#otpClient').val(otp['otpClient']);
}

function lf_serviceCall900012CallBack(data) {
	swal("사이트 정보 변경","정상적으로 처리되었습니다.", {
        icon: "success",
        buttons:"확인"
    });
	
	selectSite();
}