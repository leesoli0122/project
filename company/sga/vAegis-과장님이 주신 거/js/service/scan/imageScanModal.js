function lf_setModal() {
	lf_addClickEventModal();
}


function lf_addClickEventModal() {
	
	// 스캔 > 이미지 스캔 : 스캔 레지스트리 정책 정보 
	$('a[rel="registry_policy_info"]').off('click');
	$(document).on("click", 'a[rel="registry_policy_info"]', function(e){
		if($("#registryPolicyRulename").val() == "") {
			alert("설정된 정책이 없습니다");
		}
		else{
			e.stopPropagation(); // a 태그의 이벤트 전파를 중단시키기 위함
			e.preventDefault(); //  a 태그를 눌러도 새로고침 x
			createDim();
			lf_serviceCall800401();
		    $("#registry_policy_info").show(); 
		}		
	});
}

// 추가. 이미지 시큐리티 정책 모달 종료
function lf_closeRegistryPolicyInfoModal() {
	removeDim();
	$("#registry_policy_info").hide();
}

