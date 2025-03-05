/**
 * 23-09-20 추가 vendor 변경 옵션
 */
function vendorChange() {
	// 기타 선택 시 vendor 입력 폼 출력
	if ($('#vendor option:selected').val() === "REGV99") {
		$("#selected_vendor").parent().removeClass("hidden"); // vendor name form show
	}
	else{
		$("#selected_vendor").parent().addClass("hidden"); // vendor name form hidden
	}
	
	//docker hub 인 경우 + 수정데이터가 없는경우
	if($('#vendor option:selected').val() === "REGV01" && !selectData['masterip']){
		$('#masterip').val("docker.io").niceSelect('update');
	}
	else{
		$('#masterip').val("").niceSelect('update');
	}

	// Quay Registry
	if($('#vendor option:selected').val() === "REGV03"){
		$(".regv03").show(); // vendor name form show
	}else{
		$(".regv03").hide(); // vendor name form hidden
	}
};

/**
 * vendor 혹은 type별 추가 항목체크하여 saveData에 저장
 */
function checkSaveData(saveData){
	// Vendor 사에 따라 입력 폼 추가
	var selectedVendor = $('#vendor option:selected').val();
	
	// Quay Registry
	if(selectedVendor === "REGV03"){
		saveData['oauth_token'] = $('#oauth_token').val()? $('#oauth_token').val() : null ;
	}
	else{
		saveData['oauth_token'] =  null ;
	}
	
	/**
	 * private-Openshift Red Hat Quay
	 * private-Openshift Docker Registry 
	 * private-docker private Registry
	 * public-Naver Container Registry
	 * public-docker Registry : docker.io
	 */
	if(selectedVendor === "REGV01"){
		saveData['registry_type'] = "PUBLIC"
	}
	else{
		saveData['registry_type'] = "PRIVATE" 
	}
}