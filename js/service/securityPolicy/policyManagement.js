const _SEP = ':::';

$(function () {
	$("#searchBtn").on("click", function() {
		var searchKeyword = $("#searchKeyword").val();
		$("#deviceList #device").each(function() {
			var html = $(this).find("h4").html();
			if(html.indexOf(searchKeyword) > -1) $(this).show();
			else $(this).hide();
		});
	});
});

$(document).ready(function() {
	// 기존 정책 적용 미적용 체크
	lf_serviceCall800031();
	
	// Registry 정책 목록 call
	lf_serviceCall600074();
});


function lf_serviceCall600074(){
	// is_registry 테이블 ROW 조회 
	cf_requestServer(_TR_CLOUD_CONTAINER_SERVER_STATUS, null, lf_serviceCall600074CallBack);
}

function lf_serviceCall600074CallBack(data) {
	var dataList = data.body.dataList;
	
	// 정책 추가 Modal에   Registry Tab에 Option 추가
	dataList.forEach(function(data){
		$("#policy_registry").append( "<option value='"+data.registry_uuid+"'>"+data.equipmarkname+"</option>");
		$("#policy_registry").niceSelect("update");
	});
}

function lf_serviceCall800031() {
    var body = {};
    cf_requestServer(_TR_POLICY_STAT,body,lf_serviceCall800031CallBack, false);
}

function lf_serviceCall800031CallBack(data){
	//var rulesStatList = data.body.dataList;
	var rulesStatList = data.body.dataList.filter(item => item.group_name !== 'Registry'); // jkcho : Registry 그룹이 Hardware 테이블에 추가되면서 해당 그룹에 대한 결과가 조회됨. 현재 임시로 제거
	var registryPolicyList = data.body.registryPolicyList; // Registry 정책 현황 리스트 추가
	
	var firewallOnline = 0;
	var firewallOffline = 0;
	var malwareOnline = 0;
	var malwareOffline = 0;
	var fileintOnline = 0;
	var fileintOffline = 0;
	
	var imagesecurityOnline = 0;
	var imagesecurityOffline = 0;
	var whAuthorizationOnline = 0;
	var whAuthorizationOffline = 0; 
	
	var html = "";
	/**
	 * 추가) Registry 탐지 룰 관리 
	 * 800052 서비스 참조
	 */
	$.each(registryPolicyList, function(index, item) {
		imagesecurityOnline += item.imagesecurity_online;
		imagesecurityOffline += item.imagesecurity_offline;
		whAuthorizationOnline += item.wh_authorization_online;
		whAuthorizationOffline += item.wh_authorization_offline;
		
		
		html = "";
		html += "<tr>";
		html += "	<td class=\"none tl\"> Registry</td>"; // 수동으로 그룹 기입
		//방화벽
		html += "	<td> <a> - </a></td>";
		html += "	<td> <a> - </a></td>";
		//컨테이너 워크로드 실행제어
		html += "	<td> <a> - </a></td>";
		html += "	<td> <a> - </a></td>";
		//컨테이너 이벤트
		html += "	<td> <a> - </a></td>";
		html += "	<td> <a> - </a></td>";
		//이미지 시큐리티
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('imageSecurity','T')\">"+ item.imagesecurity_online +"</a></td>";
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('imageSecurity','F')\">"+ item.imagesecurity_offline +"</a></td>";
		//안티 멀웨어
		html += "	<td> <a> - </a></td>";
		html += "	<td> <a> - </a></td>";
		//무결성
		html += "	<td> <a> - </a></td>";
		html += "	<td> <a> - </a></td>";
		html += "</tr>";
	});
	$("#groupStatTable").append(html);
	
	/**
	 * 기존 리소스 탐지룰 관리
	 */
	$.each(rulesStatList, function(index, item) {
		console.log("item :", item);
		firewallOnline += item.firewall_online;
		firewallOffline += item.firewall_offline;
		malwareOnline += item.malware_online;
		malwareOffline += item.malware_offline;
		fileintOnline += item.fileint_online;
		fileintOffline += item.fileint_offline;
		
		html += "<tr>";
		//html += "	<td class=\"none tl\">" + item.group_name + "</td>";
		html += "	<td class=\"none tl\" onclick=\"javascript:lf_serviceCall800032('" + item.group_id + "','','')\">" + item.group_name + "</a></td>";
		// 방화벽
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'firewall', true);\">" + item.firewall_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'firewall', false);\">" + item.firewall_offline + "</a></td>";
		
		//컨테이너 워크로드 실행제어(현재 임시로 "clusters" 그룹 이름을 지정하여 해당 그룹에만 결과 값을 출력한다)
		if(item.group_name === "Clusters") html += "<td> <a onclick=\"javascript:lf_serviceCall800052('workLoad','T')\">"+ whAuthorizationOnline +"</a></td>";
		else html += "	<td><a> 0 </a></td>"
		if(item.group_name === "Clusters") html += "<td> <a onclick=\"javascript:lf_serviceCall800052('workLoad','F')\">"+ whAuthorizationOffline +"</a></td>";
		else html += "	<td><a> 0 </a></td>"
		
		//컨테이너 이벤트
		html += "	<td><a> 0 </a></td>"
		html += "	<td><a> 0 </a></td>"
		//이미지 시큐리티
		html += "	<td><a> - </a></td>"
		html += "	<td><a> - </a></td>"
		//안티 멀웨어
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'malware', true);\">" + item.malware_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'malware', false);\">" + item.malware_offline + "</a></td>";
		// 무결성
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'fileint', true);\">" + item.fileint_online + "</a></td>";
		html += "	<td><a href=\"javascript:lf_serviceCall800032('" + item.group_id + "', 'fileint', false);\">" + item.fileint_offline + "</a></td>";

		html += "</tr>";
	});
	$("#groupStatTable").html(html);

	/*html = "";
	html += "<tr>";
	html += "	<td class=\"none tl\"> Cluster</td>";
	//방화벽
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('firewall','T')\"> 0 </a></td>";
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('firewall','F')\"> 0 </a></td>";
	//컨테이너 워크로드 실행제어
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('workLoad','T')\">"+ whAuthorizationOnline +"</a></td>";
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('workLoad','F')\">"+ whAuthorizationOffline +"</a></td>";
	//컨테이너 이벤트
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('containerSecurity','T')\"> 0 </a></td>";
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('containerSecurity','F')\"> 0 </a></td>";
	//이미지 시큐리티
	html += "	<td> <a> - </a></td>";
	html += "	<td> <a> - </a></td>";
	//안티 멀웨어
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('antiMal','T')\"> 0 </a></td>";
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('antiMal','F')\"> 0 </a></td>";
	//무결성
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('fileint','T')\"> 0 </a></td>";
	html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('fileint','F')\"> 0 </a></td>";
	html += "</tr>";
	$("#groupStatTable").append(html);*/
	
	
	/*
	$.each(registryPolicyList, function(index, item) {
		html = "";
		html += "<tr>";
		html += "	<td class=\"none tl\"> Cluster</td>";
		//방화벽
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('firewall','T')\"> 0 </a></td>";
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('firewall','F')\"> 0 </a></td>";
		//컨테이너 워크로드 실행제어
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('workLoad','T')\"> 0 </a></td>";
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('workLoad','F')\"> 0 </a></td>";
		//컨테이너 이벤트
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('containerSecurity','T')\"> 0 </a></td>";
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('containerSecurity','F')\"> 0 </a></td>";
		//이미지 시큐리티
		html += "	<td> <a> - </a></td>";
		html += "	<td> <a> - </a></td>";
		//안티 멀웨어
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('antiMal','T')\"> 0 </a></td>";
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('antiMal','F')\"> 0 </a></td>";
		//무결성
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('fileint','T')\"> 0 </a></td>";
		html += "	<td> <a onclick=\"javascript:lf_serviceCall800052('fileint','F')\"> 0 </a></td>";
		html += "</tr>";
	});
	$("#groupStatTable").append(html);
	*/
	
	// 전체 리스트
	html = "";
	html += "<tr class=\"footer\">";
	html += "	<td>전체</td>";
	//방화벽
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'firewall', true);\">" + firewallOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'firewall', false);\">" + firewallOffline + "</a></td>";
	//컨테이너 워크로드 실행 제어
	html += "	<td <a href=\"javascript:lf_serviceCall800032('', 'firewall', true);\">"+ whAuthorizationOnline +"</a></td>";
	html += "	<td <a href=\"javascript:lf_serviceCall800032('', 'firewall', true);\">"+ whAuthorizationOffline +"</a></td>";
	//컨테이너 이벤트
	html += "	<td><a> 0 </a></td>"
	html += "	<td><a> 0 </a></td>"
	//이미지 시큐리티
	html += "	<td><a href=\"javascript:lf_serviceCall800052('imageSecurity', 'T');\">"+ imagesecurityOnline +"</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800052('imageSecurity', 'F');\">"+ imagesecurityOffline +"</a></td>";
	//안티 멀웨어
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'malware', true);\">" + malwareOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'malware', false);\">" + malwareOffline + "</a></td>";
	//무결성
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'fileint', true);\">" + fileintOnline + "</a></td>";
	html += "	<td><a href=\"javascript:lf_serviceCall800032('', 'fileint', false);\">" + fileintOffline + "</a></td>";
	
	html += "</tr>";
	$("#groupStatTable").append(html);
	

	$(".click > tbody > tr > td").on("click", function() {
		$(".click > tbody > tr > td").each(function() {
			$(this).removeClass("on");
		});
		$(this).addClass("on");
	});
	
    cf_requestServer(_TR_POLICY_REVISION_STAT, {}, lf_serviceCall800032CallBack, false);
}

// Registry 자산 리스트 호출
function lf_serviceCall800052(policyType, online){
    var body ={};
    if(policyType) body.policyType = policyType;
	if(online) body.online = online;	
	// policyType에 따라 변경되도록 로직 수정
	cf_requestServer(_TR_POLICY_IMAGESECURITY_STAT,body,lf_serviceCall800052CallBack, false);
}


// 이미지 시큐리티 정책 내용 출력 > policyType에 따라 변경되도록 로직 수정 필요
function lf_serviceCall800052CallBack(data){ 
	console.log(data.body);
	//Table Draw
	var policyDataList = data.body.policyDataList;
	var policyType = data.body.policyType;
	
	if(policyDataList) $('#registry_policy_cnt').html(policyDataList.length);
	else $('#registry_policy_cnt').html(0);
	
	// 타이틀, 테이블 생성 로직을 policyType에 따라 변경 (ex: changeDataTable(policyType,policyDataList))
	changePolicyTitle(policyType); // 타이틀 변경
	changeDataTable(policyType,policyDataList); // 테이블 생성
}

/**
 * policy Type에 따른 테이블 변경
 */
function changeDataTable(policyType,policyDataList){
	
	$('#registry_policy_contain .tbl').hide(); // 테이블 페이지 전체 숨김
	
	var table = $('#'+policyType+'_policy_table').DataTable();
	table.clear().draw(); // 테이블 초기화 
	
	// 이미지 시큐리티
	if(policyType === 'imageSecurity') {
		$('#registry_policy_contain div[id="imageSecurityTbl"]').show(); 
		var actionName = { 'ACCEPT':'ALLOW', 'REJECT':'DENY', 'WARN':'LOGGING'};
		$.each(policyDataList, function(idx,rowData){
			var type = rowData['policy_classification'] ? rowData['policy_classification']:'-';
			var registry = rowData['registry'] ? rowData['registry']:'-';
			var rule_name = rowData['rule_name']? rowData['rule_name']:'';
			var action =  rowData['policy_contents']? actionName[rowData['policy_contents'].elements[0].elements[0].action]:'-';
			var user = rowData['updated_user']?  rowData['updated_user']:'-';
			var enabled = rowData['enabled']? '적용':'미적용';
			var created_date = rowData['created_at']?rowData['created_at']:'-';
			var updated_date = rowData['updated_at']?rowData['updated_at']:'-';
			var btn_html = ''
			if(type == 'CUSTOM') btn_html = "<a href=\"#\" class=\"btn icon edit\" rel=\"imageSecurity_policy_edit\" name=\"imageSecurity\"> </a>"
						   				+ "<a class=\"btn icon del\" rel=\"imageSecurity_policy_del\"> </a>";
			else btn_html = "<a href=\"#\" class=\"btn icon edit\" rel=\"imageSecurity_policy_edit\" name=\"imageSecurity\"> </a>"			   				
			
			table.row.add([
				"<td>"+(idx+1)+"</td>",
				"<td>"+type+"</td>",
				"<td>"+registry+"</td>",
				"<td>"+rule_name+"</td>",
				"<td>"+action+"</td>", // 좀더 생각. 쿼리 수정 필요해보임
				"<td>"+enabled+"</td>",
				"<td>"+user+"</td>",
				"<td>"+created_date+"</td>",
				"<td>"+updated_date+"</td>",
				"<td>"
					+ "<input type=\"hidden\" name=\"isData\" value='" +JSON.stringify(rowData)+ "'>"
					+  btn_html
				+"</td>",		
			]);
		});
	}
	// 컨테이너 워크로드 실행제어 
	else if(policyType === 'workLoad'){
		$('#registry_policy_contain div[id="workLoadTbl"]').show();
		
		$.each(policyDataList, function(idx,rowData){
			var type = rowData['policy_type'] ? rowData['policy_type']:'-';
			var rule_name = rowData['policy_name']? rowData['policy_name']:'-';
			var action = rowData['policy_action']? rowData['policy_action']:'-';
			var enabled = rowData['is_activated'] === "T" ? '적용':'미적용';
			var updated_user = rowData['updated_by']?  rowData['updated_by']:'-';
			var created_date = rowData['created_at']?rowData['created_at']:'-';
			var updated_date = rowData['updated_at']?rowData['updated_at']:'-';
			var btn_html ="<a href=\"#\" class=\"btn icon edit\" rel=\"workLoad_policy_edit\" name=\"workload\"> </a>"
						 + "<a class=\"btn icon del\" rel=\"workLoad_policy_del\"> </a>";		   				
			table.row.add([
				"<td>"+(idx+1)+"</td>",
				"<td>"+type+"</td>",
				"<td>"+rule_name+"</td>",
				"<td>"+action+"</td>",
				"<td>"+enabled+"</td>",
				"<td>"+updated_user+"</td>",
				"<td>"+created_date+"</td>",
				"<td>"+updated_date+"</td>",
				"<td>"
					+ "<input type=\"hidden\" name=\"workLoadData\" value='" +JSON.stringify(rowData)+ "'>"
					+  btn_html
				+"</td>",		
			]);
		});
		
	}
	
	// 방화벽
	else if(policyType === 'firewall') {
		$('#registry_policy_contain div[id="firewallTbl"]').show();
		
		$.each(policyDataList, function(idx,rowData){
		});
	}
	// 무결성
	else if(policyType === 'fileint') {
		$('#registry_policy_contain div[id="fileintTbl"]').show();
		
		$.each(policyDataList, function(idx,rowData){
		});
	}
		
	table.draw();
}


var cve_cnt = 0; //sel 초기화를 위한 임의의 id. 변경 필요.
function editPolicy(data){
	initPolicy(); // 수정 전, 입력 폼 초기화
	cve_cnt = 0 ; 
		
	var actionList = { 'ACCEPT':'allow', 'REJECT':'block', 'WARN':'log'};
	$("#editPolicyUuid").val(data['policy_uuid']); // policy_uuid 저장
	$("#policy_rule_name").val(data['rule_name']);
	$("#policy_description").val(data['policy_contents'].description);
	
	if(!data['registry_uuid']){ // 미적용 정책은 registry 정보가 없음 
		$("#policy_registry").val($("#policy_registry option:eq(0)").val()).niceSelect("update"); // 따라서 수정폼에서 첫번째 값을 보여주도록 함
	}
	else{
		$("#policy_registry").val(data['registry_uuid']).niceSelect("update"); // nice-select update
	}
	
	
	$("#policy_action").val(actionList[data['policy_contents'].elements[0].elements[0].action]).niceSelect("update"); // 파싱작업 필요.
	if(data['enabled']=="T") $("input:checkbox[id='policy_isactive']").prop("checked",true); // 토글버튼 체크 유무 확인
	
	$.each(data['policy_contents'].elements, function(index,item){
		$.each(item.elements , function(index,element){
			// 체크박스 체크 유무 확인 
			editCheckBox(element)
			
			editInputBox(element)
		});
	});
}


function editCheckBox(element){
	if(element.key =="scriptContents") { // 포트번호 또는 배포파일
		if(element.value.split(" ")[0] == "EXPOSE") { // Port의 Value는 EXOPESE 포트번호 이므로 이를 기준으로 체크
			$("input:checkbox[id='scriptContentsPort']").prop("checked",true);
		}
		else $("input:checkbox[id='scriptContentsFile']").prop("checked",true);	
	}
	else if(element.key){
		$("input:checkbox[id='"+element.key+"']").prop("checked",true);
	}
	// 멀웨어 정책은 key : null, condition : FIND
	else if(element.condition =="FIND") $("input:checkbox[id='malware']").prop("checked",true); 
}


function editInputBox(element){
	var elementList={'scriptContents': 'scriptContents' ,'imageTag':'image_tag', 'nameVersion':'package' , 'license':'license' , 'cveId':'cve_id', 'severity':'cve_severity', 'cvssVersionBaseScore':'cvss_score', 'cvssVersionVector':'cvss_vector'}
	var conditionList = {'HIGH':'HIGH', 'EQUAL_HIGH':'EQUAL_HIGH', 'EQUAL':'EQUAL', 'NOT_EQUAL' :'NOT_EQUAL', 'EQUAL_LOW': 'EQUAL_LOW', 'LOW':'LOW','LIKE':'LIKE',  'NOT_LIKE':'NOT_LIKE'};
	
	var elementKey = elementList[element.key];
	var elementCondition = conditionList[element.condition];
	var elementValue = element.value;

	// 키 값에 따른 key, value 값 수정
	if(elementKey === 'scriptContents'){
	 	if(element.value.split(" ")[0] == "EXPOSE"){ // 포트 
			 elementKey = 'port_num';
			 elementValue = element.value.split(" ")[1];
			 // 배포는 condition 형식이 다름(LIKE_IGNORECASE,NOT_LIKE_IGNORECASE)
			 // elementValue 에 공백(\n)이 포함되어 있는 경우에는 EQUAL. 아닌경우 LIKE 표시
			 elementCondition = elementValue.includes('\n')? conditionList['EQUAL'] : conditionList['LIKE'];
		}
		else{ // 배포 파일
			elementKey = 'deploy_file';
		}
	}
	else if(elementKey === 'cvss_score'|| elementKey === 'cvss_vector'){
			elementValue = element.value.split(",")[1]; // 3.1 제외한 값
	}
	
	
	// 키 값에 따른 sel,ipt 값 입력
	if(elementKey==='package'){ // name value
		var package_name = element.value.split(",")[0];
		var package_version = element.value.split(",")[1];
		if($("#ipt_"+elementKey+"_name").val()) {
			plusInput(elementKey); 
			$("#"+idx+"_ipt_"+elementKey+"_name").val(package_name); 
			$("#"+idx+"_ipt_"+elementKey+"_version").val(package_version); 
			
		}else{
			$("#ipt_"+elementKey+"_name").val(package_name); 	
			$("#ipt_"+elementKey+"_version").val(package_version); 	
		}
	}
	else if(elementKey ==='license'){
		if($("#ipt_"+elementKey).val()){
			plusInput(elementKey); 
			$("#"+idx+"_ipt_"+elementKey).val(elementValue);
		}
		else{
			$("#ipt_"+elementKey).val(elementValue); 
		}
	}
	
	else if(elementKey ==='cve_severity'){ // sel + sel
		if(cve_cnt>0) { // 로직 생각해 볼 것 
			plusInput(elementKey); 
			$("#"+idx+"_sel_"+elementKey).val(elementCondition).prop("selected",true);
			$("#"+idx+"_sel_"+elementKey+"_level").val(elementValue).prop("selected",true);
		}
		else {
			$("#sel_"+elementKey).val(elementCondition).prop("selected",true);
			$("#sel_"+elementKey+"_level").val(elementValue).prop("selected",true);
			cve_cnt++;
		}
	}
	else{
		if($("#ipt_"+elementKey).val()) {
			plusInput(elementKey); 
			$("#"+idx+"_sel_"+elementKey).val(elementCondition).prop("selected",true);
			$("#"+idx+"_ipt_"+elementKey).val(elementValue); 
		}
		else {
			$("#sel_"+elementKey).val(elementCondition).prop("selected",true);
			$("#ipt_"+elementKey).val(elementValue); 
		}
	}
}

var idx = 0;
function minusInput(id){
	var parent = $("#"+id).parent().attr('id'); 
	$("div").remove("#"+parent);
}
// + 버튼 클릭 시 입력 폼 생성
function plusInput(id){
	idx += 1; 
	var ipt_idx =  idx+"_ipt_"+id;
	var sel_idx =  idx+"_sel_"+id;
	
	var del_idx = "del_"+idx;

	var html = "";
	html +="<div class=\"policy_select_box_default\" id='"+idx+"'>";

	if(id === "package"){
		html   +="<input id='"+ipt_idx+"_name' type='text' name='"+id+"_name' class='policy_input' placeholder=''>"
				+"<input id='"+ipt_idx+"_version' type='text' name='"+id+"_version' class='policy_input' placeholder=''>"
				+"<a id="+del_idx+" class=\"btn icon del2\" onclick=\"minusInput(this.id)\"></a>"; // 삭제 버튼
	}
	else if(id==="license"){
		html +="<input id='"+ipt_idx+"' type='text' name="+id+" class='policy_input' placeholder=''>"
				+"<a id="+del_idx+" class=\"btn icon del2\" onclick=\"minusInput(this.id)\"></a>"; // 삭제 버튼
	}
	else if(id==="deploy_file"){
		html   += "<select id='"+sel_idx+"' name="+id+" class='policy_sel'>"
				+ "<option value=\"LIKE\">like</option>"
				+ "<option value=\"NOT_LIKE\">not like</option>"
				+ "</select>"
				+ "<input id='"+ipt_idx+"' type='text' name="+id+" class='policy_input'>"
				+ "<a id="+del_idx+" class=\"btn icon del2\" onclick=\"minusInput(this.id)\"></a>"; // 삭제 버튼

	}
	else if(id==="image_tag"){
		html   += "<select id='"+sel_idx+"' name="+id+" class='policy_sel'>"
				+ "<option value=\"LIKE\">like</option>"
		        + "<option value=\"EQUAL\">equals(=)</option>"
				+ "<option value=\"LOW\">less than(&lt;)</option>"
				+ "<option value=\"EQUAL_LOW\">less than or equals(&lt;=)</option>"
				+ "<option value=\"HIGH\">greater than(&gt;)</option>"
				+ "<option value=\"EQUAL_HIGH\">greater than or equals(&gt;=)</option>"
				+ "</select>"
				+ "<input id='"+ipt_idx+"' type='text' name="+id+" class='policy_input'>"
				+ "<a id="+del_idx+" class=\"btn icon del2\" onclick=\"minusInput(this.id)\"></a>"; // 삭제 버튼
	}
	else if(id==="cve_severity"){ // select + select
		html   += "<select id='"+sel_idx+"' name="+id+" class='policy_sel'>"
		        + "<option value=\"EQUAL\">equals(=)</option>"
				+ "<option value=\"LOW\">less than(&lt;)</option>"
				+ "<option value=\"EQUAL_LOW\">less than or equals(&lt;=)</option>"
				+ "<option value=\"HIGH\">greater than(&gt;)</option>"
				+ "<option value=\"EQUAL_HIGH\">greater than or equals(&gt;=)</option>"
				+ "</select>"
				+"<select id='"+sel_idx+"_level' name=\"cve_severity_level\" class=\"policy_sel\">"
				                +"<option value=\"Critical\" >Critical</option>"
                +"<option value=\"High\">High</option>"
				+"<option value=\"Medium\" selected=\"selected\">Medium</option>"
                +"<option value=\"Low\">Low</option>"
                +"<option value=\"Negligible\">Negligible</option>"
                +"<option value=\"Unknown\">Unknown</option>"
         		+"</select>"
				+"<a id="+del_idx+" class=\"btn icon del2\" onclick=\"minusInput(this.id)\"></a>"; // 삭제 버튼
	}
	else if(id==="cve_score"){
		html   += "<select id='"+sel_idx+"' name="+id+" class='policy_sel'>"
		        + "<option value=\"EQUAL\">equals(=)</option>"
				+ "<option value=\"LOW\">less than(&lt;)</option>"
				+ "<option value=\"EQUAL_LOW\">less than or equals(&lt;=)</option>"
				+ "<option value=\"HIGH\">greater than(&gt;)</option>"
				+ "<option value=\"EQUAL_HIGH\">greater than or equals(&gt;=)</option>"
				+ "</select>"
				+ "<input id='"+ipt_idx+"' type='text' name="+id+" class='policy_input'>"
				+ "<a id="+del_idx+" class=\"btn icon del2\" onclick=\"minusInput(this.id)\"></a>"; // 삭제 버튼
	}
	else{ // port_num, cve_id, cvss_vector
		html   += "<select id='"+sel_idx+"' name="+id+" class='policy_sel'>"
				+ "<option value=\"LIKE\">like</option>"
	            + "<option value=\"EQUAL\">equals(=)</option>"
				+ "</select>"
			    + "<input id='"+ipt_idx+"' type='text' name="+id+" class='policy_input'>"
			    + "<a id="+del_idx+" class=\"btn icon del2\" onclick=\"minusInput(this.id)\"></a>"; // 삭제 버튼
	}
	html +="</div>";
	$("#policy_"+id).prepend(html);
}


function changePolicyTitle(key){
	var titleList={'Registry':'Registry List','firewall':'방화벽','workLoad':'컨테이너 워크로드 실행제어','containerSecurity':'컨테이너 이벤트', 'imageSecurity':'컨테이너 이미지 스캔', 'antiMal': '안티 멀웨어', 'fileint':'무결성'};
	
	if(key){
		$("#policy_title").html(titleList[key]); // title 변경 

		$("#security_policy_title").hide();
		$("#registry_policy_title").show();
		$("#security_policy_contain").hide();
		$("#registry_policy_contain").show();
	}
	else{
		// 타이틀 변경 
		$("#security_policy_title").show();
		$("#registry_policy_title").hide();
		$("#security_policy_contain").show();
		$("#registry_policy_contain").hide();
	}
	
	//정책 추가 버튼 속성 변경 
	$("#policy_update").attr("name",key); 
	$("#policy_update").attr("rel",key+"_policy_add"); 
}

function lf_serviceCall800032(groupId, policyType, online) {
    if(isEmpty(groupId)) groupId = "";
    
    var body = { 
    	'groupId': groupId 
    };
    if(policyType) {
    	body.policyType = policyType;
    	if(online) body.online = 1;
    	else body.online = 0;   	
    }
    
    cf_requestServer(_TR_POLICY_REVISION_STAT,body,lf_serviceCall800032CallBack, false);
}


function lf_serviceCall800032CallBack(data) {
		
	// 230210 추가. Registry 항목과 구분하게 나타내기 위함
	changePolicyTitle();
	
	$("#deviceCnt").html(data.body.dataList.length);
	var policyRevStatList = data.body.dataList;
	
	var html = "";
	$.each(policyRevStatList, function(index, item) {		
		html +="<li id=\"device\">";
		html +="	<input type=\"hidden\" name=\"policyData\" value='" + JSON.stringify(item) + "'>";
		html +="	<div class=\"securitypolicy_cont_box\">";
		html +="		<div class=\"securitypolicy_cont_tit\">";
		html +="			<h4 title=\"\">" + item.equipname + "(" + item.masterip + ")</h4>";
		html +="			<div class=\"" + (item.status_agent == 1 ? "online" : "offline") + "\">" + (item.status_agent == 1 ? "정상" : "비정상") + "</div>";
		html +="		</div>";
		html +="		<div class=\"securitypolicy_cont_list\">";
		html +="			<ul>";
		html +="				<li>";
		html +="					<div>침입방지시스템</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"ips\">";
		html +="							<div class=\"revision\">" + ((item.default_ips == 0 && item.mark_ips == 0) ? "rev -" : "rev " + item.mark_ips) + "</div>";
		html +="							<div class=\"info nol " + (item.default_ips == 0 ? "none" : "") + "\" title=\"기본정책\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_ips == 0 || item.mark_ips == item.default_ips)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_ips ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.default_ips != item.mark_ips) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"ips\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"ips\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"ips\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>방화벽</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"firewall\">";
		html +="							<div class=\"revision\">" + ((item.default_fw == 0 && item.mark_fw == 0) ? "rev -" : "rev " + item.mark_fw) + "</div>";
		html +="							<div class=\"info nol " + (item.default_fw == 0 ? "none" : "") + "\" title=\"방화벽은 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_fw == 0 || item.mark_fw == item.default_fw)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_fw ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_fw != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"firewall\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"firewall\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"firewall\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>멀웨어</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"malware\">";
		html +="							<div class=\"revision\">" + ((item.default_mw == 0 && item.mark_mw == 0) ? "rev -" : "rev " + item.mark_mw) + "</div>";
		html +="							<div class=\"info nol " + (item.default_mw == 0 ? "none" : "") + "\" title=\"기본정책\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_mw == 0 || item.mark_mw == item.default_mw)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_mw ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.default_mw != item.mark_mw) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"malware\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"malware\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"malware\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>파일무결성</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"fileint\">";
		html +="							<div class=\"revision\">" + ((item.default_file == 0 && item.mark_file == 0) ? "rev -" : "rev " + item.mark_file) + "</div>";
		html +="							<div class=\"info nol " + (item.default_file == 0 ? "none" : "") + "\" title=\"파일무결성은 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_file == 0 || item.mark_file == item.default_file)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_file ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_file != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"fileint\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"fileint\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"fileint\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>실행 파일 통제</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"appctl\">";
		html +="							<div class=\"revision\">" + ((item.default_appctl == 0 && item.mark_appctl == 0) ? "rev -" : "rev " + item.mark_appctl) + "</div>";
		html +="							<div class=\"info nol " + (item.default_appctl == 0 ? "none" : "") + "\" title=\"실행 파일 통제는 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_appctl == 0 || item.mark_appctl == item.default_appctl)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_appctl ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_appctl != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"appctl\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"appctl\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"appctl\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="				<li>";
		html +="					<div>서비스 제어</div>";
		html +="					<div>";
		html +="						<a href=\"#\" rel=\"policy_hist\" name=\"pamacl\">";
		html +="							<div class=\"revision\">" + ((item.default_pamacl == 0 && item.mark_pamacl == 0) ? "rev -" : "rev " + item.mark_pamacl) + "</div>";
		html +="							<div class=\"info nol " + (item.default_pamacl == 0 ? "none" : "") + "\" title=\"서비스제어는 기본정책을 지원하지 않습니다.\">기본정책</div>";
		html +="							<div class=\"info ind " + ((item.mark_pamacl == 0 || item.mark_pamacl == item.default_pamacl)? "none" : "") + "\" title=\"개별정책\">개별정책</div>";
		html +="							<div class=\"info pol " + (!item.sync_pamacl ? "none" : "") + "\" title=\"정책적용\">정책적용</div>";	
		html +="						</a>";
		html +="					</div>";
		html +="					<div>";
		if(item.mark_pamacl != 0) {
			html +="						<a href=\"#\" class=\"btn icon del\" rel=\"policy_remove\" name=\"pamacl\">정책삭제</a>";
			html +="						<a href=\"#\" class=\"btn icon edit\" rel=\"policy_edit\" name=\"pamacl\">정책편집</a>";
		} else {
			html +="						<a href=\"#\" class=\"btn icon add\" rel=\"policy_add\" name=\"pamacl\" agentid=\"" + item.hardwareid + "\">정책추가</a>";
		}
		html +="					</div>";
		html +="				</li>";
		html +="			</ul>";
		html +="		</div>";
		html +="	</div>";
		html +="</li>";
	});
	$("#deviceList").html(html);
    lf_setModal(); // loadModal.js
}

function isEmpty(data) {
    return (typeof data === 'undefined' || data === null || data === '');
}


function plusPolicy() {
	var editPolicyUuid = $("#editPolicyUuid").val();
	if(editPolicyUuid){
		swal("정책 수정", "정책을 수정하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) {
				lf_serviceCall800053(editPolicyUuid);
			} else {
				swal("정책 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	}
	else{
		swal("정책 추가", "정책을 추가하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) {
				lf_serviceCall800051();
			} else {
				swal("정책 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
		});
	}
}

function delPolicy(data){

	swal("정책 삭제", "등록 된 정책을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) {
				body = {};
				body['registryUuid'] = data['registry_uuid']; // 비활성화 시 사용
				body['policyUuid']= data['policy_uuid']; // 삭제 시 사용
				lf_serviceCall800054(body);
			} else {
				swal("정책 삭제", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
	});
}

/**
 * ImageSecurity body 데이터 생성
 * 추가) null 데이터가 있는 경우 에러메시지 전송
 */
function lf_createIsBodydata(){
	var rule_name = $('#policy_rule_name').val();
	var description = $('#policy_description').val();
	var registry_uuid = $('#policy_registry option:selected').val();
	var action = $('#policy_action option:selected').val();
	var is_active = $('input:checkbox[id="policy_isactive"]').is(":checked");

	var contentsChkList = document.querySelectorAll("input[name=policy_contents]:checked");
	var sensitiveDataChkList = document.querySelectorAll("input[name=policy_sensitive_data]:checked");
	var vulnerabilitiesChkList = document.querySelectorAll("input[name=policy_vulnerabilities]:checked");
	var malwaresChkList = document.querySelectorAll("input[name=policy_malwares]:checked");

	// params 체크
	if(!chkListParams(contentsChkList)||!chkListParams(sensitiveDataChkList)|| !chkListParams(vulnerabilitiesChkList)||!chkListParams(malwaresChkList))
	{
		return false;
	}
	var parameter= {};
	parameter['contents'] = chkListParams(contentsChkList); // package, license만 받는 형식이 다르니 따로 처리하자 
	parameter['sensitive'] = chkListParams(sensitiveDataChkList);
	parameter['vulnerabilities'] = chkListParams(vulnerabilitiesChkList);
	parameter['malwares'] = chkListParams(malwaresChkList); 
	
	// Param Data null 체크
	if(!checkParamsAllNull(parameter)){
		cf_alert(null, "선택된 정책 정보가 없습니다.");
		return false;
	}
	
	var body = {
		'rule_name': rule_name,
		'description': description,
		'registry_uuid': registry_uuid,
		'action' : action, 
		'is_active': is_active,
		'parameter': parameter
	};
	
	return body;
}

function chkListParams(chkList){
	// 추가적으로 데이터를 저장해야하는 chkId
	var plusChkList = ['image_tag','port_num','deploy_file','package','cve_id','cve_severity','cvss_score', 'cvss_vector', 'license']
	var params = {};
	var paramCheck = false; 
	
	chkList.forEach(function(option){
		var chkId = option.value;
		// 추가로 저장 데이터가 있는 객체의 경우 + paramCheck false
		if(plusChkList.includes(chkId) && !paramCheck){
			var plusDataList = new Array();
			
			if(chkId==="package"){
				var nameList = $("input[name="+chkId+"_name]");
				var versionList = $("input[name="+chkId+"_version]");
				for(i=0; i<nameList.length; i++){
					var plusData ={}; 
					plusData['name'] = nameList[i].value;
					plusData['version'] = versionList[i].value;
					if(!checkParamData(chkId, plusData)) paramCheck = true;
					plusDataList.push(plusData);
				}
			}
			else if(chkId==="license"){
				var inputList = $("input[name="+chkId+"]");
				for(i=0; i<inputList.length; i++){
					var plusData = {};
					plusData['value'] = inputList[i].value;
					if(!checkParamData(chkId, plusData)) paramCheck = true;
					plusDataList.push(plusData);
				}
			}
			else if (chkId ==="cve_severity"){ 
				var operSelList= $("select[name="+chkId+"]");
				var valSelList= $("select[name="+chkId+"_level]"); // 둘다 체크박스
				for(i=0; i<operSelList.length; i++){
					var plusData = {};
					plusData['operation'] = operSelList[i].value;
					plusData['value'] = valSelList[i].value;
					if(!checkParamData(chkId, plusData)) paramCheck = true;
					plusDataList.push(plusData);
				}
			}
			else{
				var selList= $("select[name="+chkId+"]");
				var inputList = $("input[name="+chkId+"]");
				for(i=0; i<inputList.length; i++){
					var plusData = {};
					plusData['operation'] = selList[i].value;
					plusData['value'] = inputList[i].value;
					if(!checkParamData(chkId, plusData)) paramCheck = true;
					plusDataList.push(plusData);
				}
			}
			params[chkId] = plusDataList; 	
		}
		// 없는 경우 true/false만 저장
		else{
			params[chkId] = true;
		}
	});
	
	if(paramCheck) return false; // 널 값이 확인되는 경우 false 반환 
	
	return params; // 객체 반환
}


/**
 * checkParamsAllNull : Parameter Data 가 전부 null 인지 체크
 * checkParamData : Parmaeter Params Data null, 유효성 체크
 */
function checkParamsAllNull(data){
	if(Object.keys(data.contents).length == 0 && Object.keys(data.vulnerabilities).length == 0 &&Object.keys(data.sensitive).length == 0 && Object.keys(data.malwares).length == 0) {
		return false;
	}
	else return true;
}

function checkParamData(chkId, plusData){
	var intOperationList = ['HIGH','EQUAL_HIGH', 'LOW', 'EQUAL_LOW']; // 숫자태그에서만 올 수 있는 operation
	
	// null check	
	if(chkId==="package"){
		if(!plusData['name'] || !plusData['version']) {
			cf_alert(null, chkId+" 정보를 정확하게 기입해 주세요");
			return false;
		}
	}
	else {
		if(!plusData['value']) {
			cf_alert(null, chkId+" 정보를 정확하게 기입해 주세요");
			return false;
		}
	}
	
	// int operation check
	if(chkId=='image_tag' && intOperationList.includes(plusData['operation']) || chkId=='cvss_score' && intOperationList.includes(plusData['operation'])){
		var result = plusData['value'].match(/(^\d+$)|(^\d{1,}.\d{1,1}$)/); // 소숫점 유효성 검사
		
		if(!result) { // 숫자여야 하나, 문자열인 경우
			cf_alert(null, chkId+" 옵션 값이 올바르지 않습니다");
			return false;
		}
	}
	
	return true;
}

/**
 * IS 정책 삭제
 * policy_uuid 필수
 */
function lf_serviceCall800054(body){	
	cf_requestServer(_TR_POLICY_IMAGESECURITY_DEL,body,lf_serviceCall800054Callback);
}

function lf_serviceCall800054Callback(data){
	
	swal("삭제 완료", "정책이 삭제되었습니다", "./assets/images/icon_alert02.png", {
			buttons: "확인"
	});
	
	lf_reloadPolicyBoard(); // 정책룰 관리 페이지 리로드 관련 함수
}



/**
 * IS 정책 수정
 * put
 * policy_uuid 필수
 */
function lf_serviceCall800053(editPolicyUuid){
	
	var body = lf_createIsBodydata();
	if(body) {
		body['policyUuid'] = editPolicyUuid;
		cf_requestServer(_TR_POLICY_IMAGESECURITY_EDIT,body,lf_serviceCall800053Callback);
	}

}
function lf_serviceCall800053Callback(data){
	swal("수정 완료", "정책이 수정되었습니다", "./assets/images/icon_alert02.png", {
				buttons: "확인"
	});
	lf_closeImageSecurityPolicyModal(); // 모달 창 종료
	lf_reloadPolicyBoard(); // 정책룰 관리 페이지 리로드 관련 함수
	initPolicy(); // 정책 입력 설정 초기화
}

/** 
 * IS 정책생성. body 데이터 전달
 */
function lf_serviceCall800051(){
	var body = lf_createIsBodydata();
	console.log("body?:", body);

	if(body) cf_requestServer(_TR_POLICY_IMAGESECURITY,body,lf_serviceCall800051Callback);
}

function lf_serviceCall800051Callback(data){
	swal("추가 완료", "정책이 추가되었습니다", "./assets/images/icon_alert02.png", {
				buttons: "확인"
	});
	lf_closeImageSecurityPolicyModal(); // 모달 창 종료
	lf_reloadPolicyBoard(); // 정책룰 관리 페이지 리로드 관련 함수
	initPolicy(); // 0216 추가 )정책 설정 초기화
}


function initPolicy(){
	$("#editPolicyUuid").val("");
	$("#policy_rule_name").val("");
	$("#policy_description").val("");
	$("input:checkbox[type='checkbox']").prop("checked",false); // 체크 박스 옵션 모두 해제
	
	$("#policy_image_tag .policy_select_box_default").not(":last").remove();
	$("#policy_port_num .policy_select_box_default").not(":last").remove();
	$("#policy_deploy_file .policy_select_box_default").not(":last").remove();
	$("#policy_package .policy_select_box_default").not(":last").remove();
	$("#policy_license .policy_select_box_default").not(":last").remove();
	$("#policy_cve_id .policy_select_box_default").not(":last").remove();
	$("#policy_cve_severity .policy_select_box_default").not(":last").remove();
	$("#policy_cvss_score .policy_select_box_default").not(":last").remove();
	$("#policy_cvss_vector .policy_select_box_default").not(":last").remove();

	$("select").find("option:first").prop("selected", true);
		
	$("#policy_registry").val($("#policy_registry option:eq(0)").val()).niceSelect("update"); 
	$("#policy_action").val("allow").niceSelect("update");
	
	$(".policy_input").val(""); // 전체 input 초기화
}


