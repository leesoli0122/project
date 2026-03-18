var asssuranceUuid; 

// 이미지 보증 정책 클릭 시 호출되는 함수. 정책 정보를 읽어들여와 결과에 맞는 checkbox 선택(READ)
function statPolicyImage(){
	initCheckbox();
	cf_requestServer(_TR_POLICY_IMAGEASSURANCE_STAT,null,lf_serviceCall800055CallBack,false);
}
function lf_serviceCall800055CallBack(data){
	var imageAssuranceList = data.body.imageAssuranceList[0]; 
	asssuranceUuid = imageAssuranceList['image_assurance_uuid'];
	
	if(imageAssuranceList['is_assured_malware']=="T") $("#assuranceMalware").prop("checked",true); 
	if(imageAssuranceList['is_assured_sensitive_data']=="T") $("#assuranceSensitive").prop("checked",true); 
	if(imageAssuranceList['is_assured_cve']=="T") $("#assuranceCve").prop("checked",true); 
	if(imageAssuranceList['is_assured_scanned_image']=="T") $("#assuranceScan").prop("checked",true); 
}
// 확인 버튼 클릭 시 선택된 항목 업데이트(UPDATE)
function editImageAssurancePolicy(){
	swal("이미지 보증 설정", "설정 정보를 변경하시겠습니까?", "./assets/images/icon_alert01.png", {
        buttons: ["취소", "확인"],
    }).then(function(willUpdate) {
        if (willUpdate) {
            lf_serviceCall800056();	
        } else {
        	swal("이미지 보증 설정", "취소하였습니다.", "./assets/images/icon_alert03.png", {
        		buttons: "확인",
        	});
        }
    });	
}
function lf_serviceCall800056(){
	var body = {
		"assuranceUuid" : asssuranceUuid,
	};
	if($("#assuranceMalware").is(":checked")){
		body["assuredMalware"] = "T";
	}
	else{
		body["assuredMalware"] = "F";
	}
	if($("#assuranceSensitive").is(":checked")){
				
		body["assuredSensitiveData"] = "T";
	}
	else{
		body["assuredSensitiveData"] = "F";
	}
	if($("#assuranceCve").is(":checked")){
		body["assuredCve"] = "T";
	}
	else{
		body["assuredCve"] = "F";
	}
	if($("#assuranceScan").is(":checked")){
		body["assuredScannedImage"] = "T";
	}
	else{
		body["assuredScannedImage"] = "F";
	}
	cf_requestServer(_TR_POLICY_IMAGEASSURANCE_EDIT,body,lf_serviceCall800056CallBack);
}

function lf_serviceCall800056CallBack(body){
	removeDim();
	swal("이미지 보증 설정", "설정 정보가 변경되었습니다.", "./assets/images/icon_alert03.png", {
		buttons: "확인",
	});
	$("#imageAssurance_policy_edit").hide();
}

// 최초. 체크박스 초기화 함수 
function initCheckbox(){
	$("#assuranceMalware").prop("checked",false); 
	$("#assuranceSensitive").prop("checked",false); 
	$("#assuranceCve").prop("checked",false); 
	$("#assuranceScan").prop("checked",false); 
}
