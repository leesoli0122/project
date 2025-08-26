/**
 * 탐지룰 관리 > 컨테이너 워크로드 실행제어 
 */
// TODO : category mapping 함수 작성
var POLICY_TYPE = 'workLoad'
var resourceCategories = {
"*":"*",	
"Pod":"workload","ReplicaSet":"workload","Deployment":"workload","StatefulSet":"workload","DaemonSet":"workload","ReplicationController":"workload","Job":"workload", "CronJob":"workload",
"Service":"service" , "Ingress":"service", "EndPoints":"service", 
"ConfigMap":"config", "Secret":"config",
"ServiceAccount":"cluster", "Role":"cluster", "ClusterRole":"cluster", "RoleBinding":"cluster", "ClusterRoleBinding":"cluster",
"PersistentVolumeClaim":"storage",
"Namespace":"cluster", "Node":"cluster"
};
var policyDataList;
var previousClusterUuid; // 이전 Uuid 정보
var clusterUuidState; // 페이지 진입 시 uuid 정보
var policyScope; // 1120 추가. policy scope 범위에 따라 저장

// 유효성 검사 operation 체크 리스트
var operationAllowList = ['create', 'apply', 'patch', 'edit', 'replace', 'delete',  'expose', 'exec'];

var shouldTriggerBeforeUnload = true;
// 추가 Clear local storage when leaving the page
window.addEventListener('beforeunload', function() {
	if (shouldTriggerBeforeUnload) {
       localStorage.removeItem('clusterUuid');
    }
});

$(document).ready(function () {
	$('#searchKeyword').on('keyup', function (event) {
		if (event.keyCode === 13) { // enter
			executeSearch(); // 검색 실행
		}
	});
	$('#searchBtn').on('click', function () {
		executeSearch(); // 검색 실행
	});
})
$(function(){
	lf_serviceCall800060();
	lf_serviceCall800052();
	lf_setModal(); // loadModal.js
	
	// 로컬 스토리지에 저장된 uuid 가 있는 경우 해당 uuid 값 출력(반드시 클러스터 목록 생성 후 출력되어야한다 800060)
	var storedClusterUuid = localStorage.getItem("clusterUuid");
	if(storedClusterUuid){
		 $("#selectClusterUuid").val(storedClusterUuid).niceSelect('update');
		 updateTableByCluster();
	}
	// 활성화된 프레임워크가없는데, 보안 표준 규정 준수 검증 클릭 시
	$('#wh_validation').on("click", function(event) {
		if($('#cs_complicance').val() == '-'){
			// 클릭 이벤트가 발생해도 체크박스가 클릭되지 않음
			event.preventDefault();
		  	$("#cs_failMessage").show();
		}
	});
});

function executeSearch() {
	var searchKeyword = $('#searchKeyword').val();
	var table = $('#'+POLICY_TYPE+'_policy_table').DataTable();
	
	table.column(2).search(searchKeyword).draw();
}

//800060 클러스터 정보 조회
function lf_serviceCall800060() {
	cf_requestServer(_TR_POLICY_CLUSTER_INFO, null, lf_serviceCall800060CallBack, false);
}

function lf_serviceCall800060CallBack(data){
	var clusterList = data.body.clusterList;
	var clusterInfo = JSON.stringify(clusterList);
	$('#clusterInfo').val(clusterInfo);
	$('#selectedClusterUuid').val(clusterList[0]['uuid']);
	
	// DB에서 조회된 cluster 자산 리스트
	$('#selectClusterUuid option').remove();
	$("#wh_cluster option").remove(); // 기존 옵션 초기화
	$("#wh_cluster").append(`<option value="" disabled selected style="display: none">적용할 Cluster를 선택해 주십시오</option>`);
	$.each(clusterList,function(idx,cluster){
		$("#wh_cluster").append(`<option value=${cluster['uuid']}>${cluster['name']}</option>`)
		$('#selectClusterUuid').append('<option value="' + cluster['uuid'] + '">' + cluster['name'] + '</option>');
	});
	if(!$('#wh_cluster option:selected').val()=="") $('.selected_cluster').val($('#wh_cluster option:selected').text());
	$('#selectClusterUuid option:first').prop('selected', true);
	$("#wh_cluster").niceSelect('update');
	$('#selectClusterUuid').niceSelect('update');
}
// 모달 페이지 로드 시 호출
function lf_serviceCall800061CallBack(data){
	// 클러스터 주체 정보
	var clusterSubjectInfo = JSON.stringify(data.body.clusterSubjectList);
	$('#clusterSubjectInfo').val(clusterSubjectInfo);	
}

function lf_serviceCall800062CallBack(data){
	var selectedClusterSubjectInfo = data.body.selectedClusterSubjectInfo;
	$('#clusterSubjectInfo').val(JSON.stringify(selectedClusterSubjectInfo));
	
	$('#policy_subjectOption .policy_option:gt(0)').remove(); // 첫번째 옵션 제외 제거
	$('#policy_subjectOption .policy_option').find('select:eq(0)').val("*").niceSelect('update'); 
	$('#policy_subjectOption .policy_option div:eq(2)').hide();
	$('#policy_subjectOption .policy_option div:eq(3)').hide();
}

/**
 *  프로퍼티의 중복을 제거하면서 해당 프로퍼티 값의 첫 번째 등장 객체만 남기는 로직
 */
function filterFirstOccurrenceByProperty(data){
	// 클러스터 규정 준수 스캔 정책 정보  
	var clusterCsPolicyList = [];
	var frameworkIds = new Set();
	
	for (const obj of data.body.clusterCsPolicyList) {
	  if (!frameworkIds.has(obj.id)) {
	    frameworkIds.add(obj.id);
	    clusterCsPolicyList.push(obj);
	  }
	}
	
	return clusterCsPolicyList;
}
function lf_serviceCall800068CallBack(data){
	var clusterCsPolicyList = filterFirstOccurrenceByProperty(data);
	
	$('#cs_complicance option').remove(); // 기존 옵션 초기화
	if(clusterCsPolicyList.length == 0){ // 조회되는 클러스터 항목이 없는 경우
		$('#cs_complicance').append(`<option>-</option>`).niceSelect('update');
	    $("#complianceBox select").prop("disabled", true).niceSelect('update'); // select box 비활성화
	  	$("#complianceBox input").prop("readonly", true); // 하위에 있는 모든 input 요소들을 읽기 전용으로 설정
	}
	else{
		// 데이터가 있는경우 모두 원복
	    $("#complianceBox select").prop("disabled", false).niceSelect('update');
	  	$("#complianceBox input").prop("readonly", false);
	}
	$.each(clusterCsPolicyList,function(idx,clusterCsPolicy){
		$('#cs_complicance').append(`<option value="${clusterCsPolicy['id']}">${clusterCsPolicy['name']}</option>`).niceSelect('update');
	});
}

/**
 * Cluster Subject 목록 최신화 
 * 1. API 호출 (cluterUuid 전달. ServiceTr800062)
 * 2. Subject 옵션 변경
 */
function updateClusterSubjectList(){
	swal("클러스터 주체 목록 최신화", "Cluster Account 정보를 최신화 하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willUpdate) {
		if(willUpdate) {
			var selectedClusterUuid = $("#wh_cluster option:checked").val();
			if(!selectedClusterUuid) {
				return nullAlert("Cluster"); // 선택된 클러스터 항목이 없는경우 에러메시지
			}
			else{
				var body = {
					'clusterUuid': selectedClusterUuid
				};
				cf_requestServer(_TR_POLICY_CLUSTER_SUBJECT_UPDATE,body,lf_serviceCall800062CallBack,false);
			}
		} else {
			swal("클러스터 주체 목록 최신화", "취소하였습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
			
		}
	});
}

function optionListUp(index){
	$('#wh_subject_type_'+index).append(
		`
 		 <option value="*" selected>*</option>
		 <option value="USER">User</option>
		 <option value="SERVICEACCOUNT">ServiceAccount</option>
		 <option value="GROUP">Group</option>
		 `
	).niceSelect('update');
		
	$('#wh_resources_'+index).append(
		`<option selected>*</option>
		 <option>Pod</option>
		 <option>ReplicaSet</option>
		 <option>Deployment</option>
		 <option>StatefulSet</option>
		 <option>DemonSet</option>
		 <option>ReplicationController</option>
		 <option>Job</option>
		 <option>CronJob</option>
		 <option>Service</option>
		 <option>Ingress</option>
		 <option>Endpoints</option>
		 <option>ConfigMap</option>
		 <option>Secret</option>
		 <option>ServiceAccount</option>
		 <option>Role</option>
		 <option>ClusterRole</option>
		 <option>RoleBinding</option>
		 <option>ClusterRoleBinding</option>
		 <option>PersistentVolumeClaim</option>
		 <option>Namespace</option>
		 <option>Node</option>
		 <option>PodSecurityPolicy</option>
 		 <option>사용자 입력</option>
		`	
	).niceSelect('update');
	
	$('#wh_operations_'+index).append(
		`<option selected>*</option>
		 <option>create</option>
		 <option>apply</option>
		 <option>patch</option>
		 <option>edit</option>
		 <option>replace</option>
		 <option>delete</option>
		 <option>expose</option>
		 <option>exec</option>
		 <option>사용자 입력</option>
		`	
	).niceSelect('update');	
	
	// option 클릭 이벤트
	// scope 
	$("#wh_cluster").off("change").on("change", function(event) {
		// 이벤트 버블링 차단
		event.stopPropagation();
		// Scope 의 Cluster 변경 
		$('.selected_cluster').val($('#wh_cluster option:selected').text());
		if(previousClusterUuid != $('#wh_cluster').val()) { // 선택 옵션이 현재 uuid와 다른 경우
		
			// TODO: 초기화 스크립트 작성
			previousClusterUuid = $('#wh_cluster').val();
			clusterUuidState = $('#wh_cluster').val();
			
			// 첫번째 선택 옵션 외 모두 삭제 : scope 
			$('#policy_scopeOption .policy_option:gt(0)').remove().niceSelect('update');
			$('#policy_scopeOption').find('input:eq(1)').val(""); // 첫번째 네임스페이스 입력 폼 초기화	
			
			// 첫번째 선택 옵션 외 모두 삭제 : subject 
			$('#policy_subjectOption .policy_option:gt(0)').remove();
			$('#policy_subjectOption .policy_option').find('select:eq(0)').val("*").niceSelect('update'); 
			$('#policy_subjectOption .policy_option div:eq(2)').hide();
			$('#policy_subjectOption .policy_option div:eq(3)').hide();
			
			// 첫번째 선택 옵션 외 모두 삭제 : resource 
			$('#policy_resourceOption .policy_option:gt(0)').remove();
			$('#policy_resourceOption .policy_option').find('select:eq(0)').val("*").niceSelect('update'); 

			// 첫번째 선택 옵션 외 모두 삭제 : operation 
			$('#policy_operationsOption .policy_option:gt(0)').remove();
			$('#policy_operationsOption .policy_option').find('select:eq(0)').val("*").niceSelect('update'); 

			// 체크 박스 옵션 모두 해제 
			$("input:checkbox[type='checkbox']").prop("checked",false); 

			// 보안 표준 규정 준수 검증 메시지 숨김
			$("#cs_failMessage").hide();

			var body = {
				'clusterUuid' : $('#wh_cluster option:selected').val()
			};
			// 0816 추가. 클러스터 조회 시 주체 목록 같이 조회 후 display
			cf_requestServer(_TR_POLICY_CLUSTER_SUBJECT_INFO, body, lf_serviceCall800061CallBack, false);
			// 0707 추가. 규정 준수 스캔 목록 조회
			cf_requestServer(_TR_POLICY_CLUSTER_CS_POLICY_INFO,body,lf_serviceCall800068CallBack,false);
		}
	});
	
	// subject 타입 클릭
	$('#wh_subject_type_'+index).change(function(){
		$('#subject_info_box_'+index).empty(); 
		var selectedSubject =  $('#wh_subject_type_'+index+' option:selected').val();
		var clusterSubjectList  = JSON.parse($('#clusterSubjectInfo').val());
		
		if(selectedSubject ==="*") {
			$('#subject_info_box_'+index).hide(); // 전체 타입은 info box x 
			$('#subjectOption_ipt_'+index).hide();
		}
		else {
			$('#subject_info_box_'+index).show(); 
			$('#subjectOption_ipt_'+index).hide();
		}
			
		$('#subject_info_box_'+index).append(
			`
			<select id="wh_subject_info_${index}" class=" popup_sel" name="wh_subject_info" >
			</select>
			 `
		);
		$("#wh_subject_info_"+index).append(`<option value="*">*</option>`); // 전체 옵션 추가
		$.each(clusterSubjectList,function(idx,clusterSubjectInfo){
			if(selectedSubject==clusterSubjectInfo['subjectType']) {
				if(clusterSubjectInfo['subjectType'] == 'SERVICEACCOUNT'){
					$("#wh_subject_info_"+index).append(`<option value=${clusterSubjectInfo['uuid']}>${clusterSubjectInfo['namespace']}:${clusterSubjectInfo['subject']}</option>`)
				}
				else{
					$("#wh_subject_info_"+index).append(`<option value=${clusterSubjectInfo['uuid']}>${clusterSubjectInfo['subject']}</option>`)
				}
			}
		});
		$("#wh_subject_info_"+index).append(`<option class="subjectEditOption" value="other">사용자 입력</option>`); // 사용자 입력 옵션 추가
		$("#wh_subject_info_"+index).niceSelect();
	});
	// subject 사용자 입력 클릭
	$('#subject_info_box_'+index).change(function(){
		var selected = $('option:selected', this).attr('class');
		if(selected == "subjectEditOption"){
		  $('#subjectOption_ipt_'+index).show();
		}else{
		 	$('#subjectOption_ipt_'+index).hide();
		}
	});
	
	
	// resource
	$('#wh_resources_'+index).change(function(){
		if($('#wh_resources_'+index+' option:selected').val()==="사용자 입력") {
			$('#resourceOption_ipt_'+index).show();
		}
		else{
			$('#resourceOption_ipt_'+index).hide();
		}
	});
	
	$('#wh_operations_'+index).change(function(){
		if($('#wh_operations_'+index+' option:selected').val()==="사용자 입력") {
			$('#operationsOption_ipt_'+index).show();
		}
		else{
			$('#operationsOption_ipt_'+index).hide();
		}
	});
}

/**
 *  + 버튼 클릭 시 입력 폼 생성 
 * @parma scopeOption 
 * @parma subjectOption
 * @parma resourceOption
 * @parma operationsOption
 */
var idx = 0; 
function plusOptionWorkload(id){
	idx += 1;
	var del_idx = "del"+idx;
	
	var html =""; 	
	// scopeOption
	if(id === "scopeOption"){
		var selectedCluster = $("#wh_cluster option:selected").text(); 
		html += `
			<div class="policy_option">
				<div class="policy_scope" />
				<div class="policy_scope">
					<p>Namespace</p>
					<div class="ipt_box">
						<input type="text" class="no_radius" name="namespace">
					</div>
				</div>
				<a id="${del_idx}" class="btn icon del2" onclick="minusOptionWorkload(this.id)">삭제</a>
			</div>
		`
	}
	else if(id ==="subjectOption"){
		html += `
			<div class="policy_option">
				<div class="sel_box">
					<select id="wh_subject_type_${idx}"class="popup_sel" name="wh_subject_type">
					</select>
				</div>
				<div id="subject_info_box_${idx}" class="sel_box" style="display:none;">
					<select id="wh_subject_info_${idx}" class="popup_sel" name="wh_subject_info">
					</select>
				</div>
				<div id ="subjectOption_ipt_${idx}" class="ipt_box" style="display:none">
					<input type="text" value="" placeholder="" class="no_radius" name="wh_subject_input" >
				</div>
				<a id="${del_idx}" class="btn icon del2" onclick="minusOptionWorkload(this.id)">삭제</a>
			</div>		
		`;
	}
	else{
		html +=`
			<div class="policy_option">
				<div class="sel_box">
		`;
		
		if(id==='operationsOption') {
			html += `<select id="wh_operations_${idx}" class="popup_sel" >
					 </select>`;
		}
		else{
			html += `<select id="wh_resources_${idx}" class="popup_sel" >
					 </select>`;
		}
		html += `
				</div>
				<div id="${id}_ipt_${idx}" class="ipt_box" style="display:none">
					<input type="text" value="" placeholder="" class="no_radius">
				</div>
				<a id="${del_idx}" class="btn icon del2" onclick="minusOptionWorkload(this.id)">삭제</a>
			</div>
		`
	}

	$("#policy_"+id).append(html);
	$("#policy_"+id).find("select").niceSelect(); // select 태그 새로고침
	optionListUp(idx); 
}

/**
 * - 버튼 클릭 시 입력 폼 제거 : - 버튼 태그의 부모태그를 삭제
 */
function minusOptionWorkload(id){
	$("#"+id).parent().remove();
}


/**
 * 삭제 버튼 클릭 
 */
function deletePolicyWorkload(data){
	swal("정책 삭제", "등록 된 정책을 삭제하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
		}).then(function(willDelete) {
			if(willDelete) {
				var body = { 'policyUuid': data['uuid']};
				cf_requestServer(_TR_POLICY_CLUSTER_WORKLOAD_DEL,body,lf_serviceCall800064CallBack); // 정책 삭제 서비스
			} else {
				swal("정책 삭제", "취소하였습니다.", "./assets/images/icon_alert03.png", {
					buttons: "확인"
				});
			}
	});
}
function lf_serviceCall800064CallBack(data) {
	localStorage.setItem("clusterUuid", $('#selectClusterUuid option:selected').val());

	swal("삭제 완료", "정책이 삭제되었습니다.", "./assets/images/icon_alert02.png", {
		buttons: "확인"
	}).then(function () {
		shouldTriggerBeforeUnload = false; // 새로 고침시에는 리로드 BeforeUnload 동작 막을 수 있도록 flag값 전달 
		location.reload();
	});
	//lf_closeWorkLoadPolicyModal(); // 모달 창 종료
	//lf_reloadPolicyBoard(); // 정책룰 관리 페이지 리로드 관련 함수
}

// 

/**
 * 확인 버튼 클릭 
 * 정책 추가 버튼(확인 버튼) 클릭 -> 입력 데이터 체크 -> 서비스 호출
 * 정책 수정 / 정책 추가
 */
function plusPolicyWorkload(){
	swal("정책 추가", "정책을 추가하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if(willDelete) {
			lf_serviceCall800063(); // 정책 추가 서비스
		} else {
			swal("정책 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		}
	});
}

function lf_serviceCall800063(){
	createWorkloadData(); // 입력 데이터 체크
}

/**
 * 입력 데이터 가공
 * 1. 널 체크(발견 시 nullAlert 호출) / 데이터가 있는 경우 유효성 검사 dataCheck(title,data)
 * 2. 데이터 형식 만들기
 * 
 * 최종적으로 body 파라미터 생성 -> 800063 서비스 
 * TODO : 로직 분리
 */
function createWorkloadData(policyUuid){
	// top list check
	var policyName = $("#workload_rulename").val();
	if(!policyName) return nullAlert("Rule Name"); 
		
	var policyDescription = $('#workload_description').val();
	if(!policyDescription) return nullAlert("Desciprtion");
	
	// 0707 추가 클러스터 uuid 
	var selectedClusterUuid = $("#wh_cluster option:checked").val();
	if(!selectedClusterUuid) return nullAlert("Cluster");
	
	var activated = $('input:checkbox[id="workload_isactive"]').is(":checked");
	var policyAction = $('#workload_action option:selected').val();
	var checkListData = []; // 중복 데이터 체크를 위한 Array
		
	/**
	 * subjects 체크
	 */
	var subjects= new Array(); 
	var subjectList = $("div[id=policy_subjectOption]").children(); 
	var subjectIncorrectDataCheck = false;
	var subjectNullCheck = false;
	
	$.each(subjectList,function(){
		var type = $(this).find('select[name="wh_subject_type"]').val();
		var subjectInfo = $(this).find('select[name="wh_subject_info"] option:selected').text();
		
		if(subjectInfo == "사용자 입력"){
			subjectInfo = $(this).find('input[name="wh_subject_input"]').val();
			if(subjectInfo) {
				// 형식 체크. serviceaccount인 경우 "namespace:" 이 앞에 붙어야 한다
				var checkData = [type,subjectInfo];
				if(!dataCheck("SubjectInfo",checkData)) {
					subjectIncorrectDataCheck = true;
					return false;
				}
			}
			else {
				subjectNullCheck = true;
				return false;
			} 
		}
		
		var subjectData = {'type':type,'subject':subjectInfo};
		checkListData.push(subjectData); // 중복데이터 체크를 위해 데이터 추가
		subjects.push(subjectData);	
	});
	
	// 사용자 입력 데이터 체크
	if(subjectIncorrectDataCheck) return incorrectDataAlert("Subject 값이 올바르지 않습니다.");
	else if(subjectNullCheck) return nullAlert("Subject"); // 널체크
	// 중복 데이터 체크
	if(!dataCheck("duplicationDataCheck",checkListData)) return incorrectDataAlert("중복된 Subject 값이 존재합니다.");
	
	/**
	 * RBAC 체크
	 * 1. scope
	 * 2. resource
	 * 3. operation
	 */
	//var rules = new Array(); 
	var policyRules = {}; 
	var rbacElements = new Array();

	// 1. RBAC > Scope
	var scopeList = $("div[id=policy_scopeOption").children(); // policy_option 
	var duplicationCluster = 0; // 중복 클러스터 체크
	var duplicationNamespace = 0; // 중복 네임스페이스 체크
	checkListData = [] ; // 중복 체크 Array 변수 초기화
	var clusterScopeElements={
		'type' : "scope",
		'categories' : "cluster",
		'elements': [],
	};
	var namespaceScopeElements={
		'type' : "scope",
		'categories' : "namespace",
		'elements': [],
	};

	$.each(scopeList,function(){
		// 멀티 클러스터를 지원하지 않음 1개의 클러스터만 선택할 수 있도록 이후 추가되는 형태는 inputbox
		var clusterScope = $("#wh_cluster option:checked").val(); // 0707 변경. text() -> val(). uuid 값을 전달
		var namespaceScope = $(this).find('input[name="namespace"]').val(); // 공백,null 인 경우 cluster 정책

		var elements = new Array(); 
		var elementsParam = {
			// IP옵션의 key값은 IP이나 현재 없음.
			'key': namespaceScope? "name" : "uuid",
			'condition' : "EQUAL",
			'value' : namespaceScope? clusterScope+":"+namespaceScope : clusterScope, 
		};
		elements.push(elementsParam);
	
		var category = namespaceScope? "namespace":"cluster";
		if(category === "cluster") {
			duplicationCluster++;
			clusterScopeElements['elements'].push(elements);
		}else {
			duplicationNamespace++;
			namespaceScopeElements['elements'].push(elements);
		}
		checkListData.push(elementsParam); // 중복 데이터 체크를 위해 데이터 추가
	});
	if(duplicationCluster>1) return incorrectDataAlert("Cluster 정책은 1개만 적용됩니다.")
	if(!dataCheck("duplicationDataCheck",checkListData)) return incorrectDataAlert("중복된 Scope 값이 존재합니다.");

	if(duplicationNamespace) { //namespace scope 체크
		rbacElements.push(namespaceScopeElements);
		policyScope = 'NAMESPACE';
	}
	else if(duplicationCluster) { // cluster 정책 체크
		rbacElements.push(clusterScopeElements);
		policyScope = 'CLUSTER';
	}

	// 2. RBAC > Resources
	var resourcesList = $("div[id=policy_resourceOption]").children();
	var resourceElements={}; //rbacPolicy 에 담을 element 객체 생성
	var resourceIncorrectDataCheck = false;
	var resourceNullCheck = false;
	checkListData = [] ; // 중복 체크 Array 변수 초기화

	$.each(resourcesList,function(){
		var resource = $(this).find('select').val();
		var category = resourceCategories[resource] ? resourceCategories[resource]: "custom"; // 사용자 입력의 리소스 중 없는 경우 category는 custom;
		
		// resourceElements.elements.elementsParam 객체 
		if(resource ==="사용자 입력") {
			var resourceInput = $(this).find('input').val(); 
			if(!resourceInput|| resourceInput ===""){
				resourceNullCheck = true;
				return false; // 공백,null 인 경우 each문 종료
			}
			else {
				// 형식 체크.
				if(dataCheck("Resource",resourceInput)) { // TODO dataCheck 유효성 검사 추가
				}
				else{
					resourceIncorrectDataCheck = true;
					return false; // 유효성 검사 실패인 경우  each문 종료
				}
			}
		}
		
		var elements = new Array(); 
		var elementsParam = {
			'condition' : "EQUAL_IGNORECASE",
		}
		if(resource!="*") { // 카테고리가 * 인경우에는 key,value값 제외
			elementsParam['key'] = "kind";
			elementsParam['value'] = resourceInput? resourceInput : resource; 
		}
		elements.push(elementsParam);
		checkListData.push(elementsParam); // 중복 데이터 체크를 위해 데이터 추가

		
		if(!resourceElements[category]){
			resourceElements[category] = {
				'type': 'resource',
				'categories': category,
				'elements': []
			};
		}
		resourceElements[category]['elements'].push(elements);
	});
	
	if(resourceNullCheck) return nullAlert("resource"); // 널체크 에러 
	else if(resourceIncorrectDataCheck) return incorrectDataAlert("resource 형식이 올바르지 않습니다"); // 유효성 검사 에러
	for(var key in resourceElements){ // 모두 만족하는 경우 키값 추가
		rbacElements.push(resourceElements[key]);
	}
	
	if(!dataCheck("duplicationDataCheck",checkListData)) return incorrectDataAlert("중복된 Resource 값이 존재합니다.");
	policyRules['rbacPolicy'] = rbacElements; 
	

	// 3. RBAC > Operations
	var operationList = $("div[id=policy_operationsOption]").children(); 
	var operationElements ={}; 
	var operationNullCheck = false;
	var operationIncorrectDataCheck = false; 
	checkListData = []; // 중복 체크 Array 변수 초기화
	
	$.each(operationList ,function(){
		var operation = $(this).find('select').val();
		var category = operation === "*" ? "*": "verb";

		if(operation ==="사용자 입력") {
			var operationInput = $(this).find('input').val(); // 공백,null 인 경우 cluster 정책
			
			if(!operationInput || operationInput==="" ){
				operationNullCheck = true;
				return false; // 공백,null 인 경우 each문 종료
			}
			else {
				// 형식 체크.
				if(dataCheck("Operation",operationInput)) { // TODO operation 유효성 검사 추가
				}
				else{
					operationIncorrectDataCheck = true;
					return false; // 유효성 검사 실패인 경우  each문 종료
				}
			}		
		}
		var elements = new Array(); 
		var elementsParam = {
			'condition' : "EQUAL_IGNORECASE",
		}
		if(operation!="*"){
			elementsParam['value'] = operationInput? operationInput : operation; //  *인 경우 value 값 제외
		}
		elements.push(elementsParam);
		checkListData.push(elementsParam); // 중복 데이터 체크를 위해 데이터 추가
		
		if(!operationElements[category]){
			operationElements[category] = {
				'type':"operation",
				'categories': category,
				'elements': []
			};
		}
		operationElements[category]['elements'].push(elements);
	});
	
	if(operationNullCheck) return nullAlert("operation"); // 널체크 에러 
	else if(operationIncorrectDataCheck) return incorrectDataAlert("operation 형식이 올바르지 않습니다"); // 유효성 검사 에러
	for(var key in operationElements){ // 모두 만족하는 경우 키값 추가
		rbacElements.push(operationElements[key]);
		
	}
	if(!dataCheck("duplicationDataCheck",checkListData)) return incorrectDataAlert("중복된 operation 값이 존재합니다.");
	policyRules['rbacPolicy'] = rbacElements;
	
	// 최종 rbac element 
	var rbacElement = {
		'policyType': "RBAC",
		'name': "RBAC 정책",
		'elements': rbacElements
	};
	policyRules['rbacPolicy'] = rbacElement;
		
	/**
	 * SECURITY_COMPLIANCE
	 * 보안 표준 규정 준수 검증 > 데이터 체크
	 */
	var validationCheck =$('input:checkbox[id="wh_validation"]').is(":checked"); // true/false
	if(validationCheck){
		var frameworkId = $("#cs_complicance option:selected").val();
		if(frameworkId =='-'){
			return incorrectDataAlert("클러스터 규정 준수 스캔 정책을 설정해 주십시오");
		}
		
		var condition = $("#cs_complianceCondition option:selected").val();
		var failControlsCount = $("#cs_failCount").val();
		if(failControlsCount) {
			if(!dataCheck("FailControlsCount",failControlsCount)){ 
				return incorrectDataAlert("Fail Controls 값은 숫자 형식만 입력 가능합니다.");
			}
		}
		else return nullAlert("Fail Controls");
		
		var securityComplianceElement = {
			'policyType': "SECURITY_COMPLIANCE",
			'failControlsCount':failControlsCount,
			'condition':condition ,
			'frameworkId': frameworkId // 새롭게 추가
		};
		policyRules['securityCompliancePolicy'] = securityComplianceElement;
	} 
	
	// Assurenced Container Image 체크 확인(IMAGE_SECURITY)
	var assurencedCheck = $('input:checkbox[id="wh_assurenced"]').is(":checked"); // true/false
	if(assurencedCheck){
		var imageSecurityElement = {
			'policyType': "IMAGE_SECURITY",
			'checked': true 
		};
		policyRules['imageSecurityPolicy'] = imageSecurityElement;
	}
	
	/**
	 * 정책 등록 파라미터 body 
	 */
	var body = {
		'subjects':subjects,
		'policyName': policyName,
		'policyDescription': policyDescription,
		'clusterUuid': selectedClusterUuid, // 0707 body데이터에 clusterUuid 추가
		'policyAction' : policyAction, 
		'policyScope' : policyScope, // 1120 policyScope 추가
		'activated': activated,
		'policyRules': policyRules,
	};
	if(policyUuid) body['policyUuid'] = policyUuid; // 수정 함수를 호출할 때
	
	// 정책 등록&수정 함수 호출
	cf_requestServer(_TR_POLICY_CLUSTER_WORKLOAD_ADD,body,lf_serviceCall800063CallBack); 
}

function lf_serviceCall800063CallBack(){
	localStorage.setItem("clusterUuid", $('#wh_cluster option:selected').val());
	
	swal("추가 완료", policyScope + " 정책이 저장되었습니다", "./assets/images/icon_alert02.png", {
		buttons: "확인"
	}).then(function () {
	    shouldTriggerBeforeUnload = false; // 새로 고침시에는 리로드 BeforeUnload 동작 막을 수 있도록 flag값 전달 
		location.reload();
	});
	// 모달 창 종료(lf_closeWorkLoadPolicyModal 에서는 클러스터 초기화가 되므로 직접 로직 작성)
	removeDim();
	initWorkLoadPolicy(); // 설정 초기화
	$("#workLoad_policy_edit").hide();
}
/**
 * 수정 html 생성 폼.  
 * editRbacOptionList
 * editSubjectOptionList
 */
function lf_serviceCall800065CallBack(data){
	var clusterRuleList = data.body.clusterRuleList; 
	var rbacUsed=false; 
	var securityComplianceUsed=false;
	var imageSecurityRuleUsed=false;	
	var appendSubjectList = [];  // 추가 시킬 subject List
	
	// 0804 추가. 수정 항목 추가 전, Compliance Framwork Lisk업(동기)
	var body ={
		"clusterUuid" : clusterRuleList[0].cluster_uuid,
	};
	cf_requestServer(_TR_POLICY_CLUSTER_CS_POLICY_INFO,body,lf_serviceCall800068CallBack,false);
	
	// 1. RULE 리스트 생성 , 주체 리스트 추출
	$.each(clusterRuleList,function(idx,clusterRule){
		// Rule Option
		var ruleType = clusterRule["rule_type"];
		
		if(ruleType === "RBAC"){
			// subject 목록 저장	
			var subjectType = clusterRule['subject_type'];
			var subject = clusterRule['subject'];
			appendSubjectList.push({'subjectType':subjectType , 'subject':subject});
		 	
		 	if(!rbacUsed){ // 동일한 정책이 주체 수 만큼 내려지므로,ㅡ중복되는 데이터가 추가되는 것을 방지하기 위해 체크
				rbacUsed = true;
				var elements = JSON.parse(clusterRule["rule_elements"]); // type, categories, elements, description, uuid
				editRbacOptionList(elements);			
			 }	
		}
		else if(ruleType === "SECURITY_COMPLIANCE" && !securityComplianceUsed){ // sc_count =  failControlsCount 
			securityComplianceUsed=true
			$("input:checkbox[id='wh_validation']").prop("checked",true ); 
			$("#cs_complicance").val(clusterRule['framework_id']).niceSelect("update"); // 사용자 클러스터 규정준수 값 불러오기
			$("#cs_complianceCondition").val(clusterRule['condition']).niceSelect("update"); //cs condition 값 목록 불러오기 
			$("#cs_failCount").val(clusterRule['sc_count']);
		}
		else if(ruleType === "IMAGE_SECURITY" && !imageSecurityRuleUsed){ // 체크 박스만 변경
			imageSecurityRuleUsed=true
			$("input:checkbox[id='wh_assurenced']").prop("checked",true); 
		}		
	});
	
	// 2. 주체 리스트 생성 appendSubjectList =[{'subjectType':subjectType , 'subject':subject} , {}... ]
	// Subjects 목록 최신화
	cf_requestServer(_TR_POLICY_CLUSTER_SUBJECT_INFO, { 'clusterUuid': $('#wh_cluster option:selected').val() }, lf_serviceCall800061CallBack, false);
	// 주체 리스트 생성
	editSubjectOptionList(appendSubjectList); 
}

var i = 0; // 수정(edit) div id 값
function editSubjectOptionList(subjectList){
	$("#policy_subjectOption .policy_option").remove(); 
	$.each(subjectList, function(idx,subjectData){
		var subjectType = subjectData['subjectType']; 
		var subject = subjectData['subject'];
		
		i--;
		var html = '';
		html += `
			<div class="policy_option">
				<div class="sel_box">
					<select id="wh_subject_type_${i}"class="popup_sel" name="wh_subject_type">
					</select>
				</div>
				<div id="subject_info_box_${i}" class="sel_box">
					<select id="wh_subject_info_${i}" class="popup_sel" name="wh_subject_info">
					</select>
				</div>
				<div id ="subjectOption_ipt_${i}" class="ipt_box" style="display:none">
					<input type="text" value="" placeholder="" class="no_radius" name="wh_subject_input" >
				</div>
		`;
		// 첫번째 policy_option에는 +(추가)버튼
		if($("#policy_subjectOption .policy_option").length === 0){
			html += `
				<a id="subjectOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
			 </div>
			`;
		}
		else{
			html += `
				<a id="${i}" class="btn icon del2" onclick="minusOptionWorkload(this.id)">삭제</a>
			</div>
			`;
		}
		
		$("#policy_subjectOption").append(html);
		$("#policy_subjectOption select").niceSelect();
		optionListUp(i); // 옵션 리스트, 클릭 이벤트 생성(순서 중요. select 지정 후 추가됨)
		/*if(subjectType ==="UNKNOWN"){
			subjectType ="*";  
			$(`#subject_info_box_${i}`).hide(); // 	subjectType 이 "*" 인 경우에는 info null
		}
*/		
		$(`#wh_subject_type_${i}`).val(subjectType).niceSelect('update'); // 저장된 subjectType 으로 select 추가
		// 옵션 리스트 subjectType에 따라서 추가
		$(`#wh_subject_info_${i}`).empty();
		var clusterSubjectList  = JSON.parse($('#clusterSubjectInfo').val()); // 저장된 cluster 주체 리스트
		
		
		$(`#wh_subject_info_${i}`).append(`<option value="*">*</option>`); // 전체 옵션 기본적으로 추가		
		if(subject != "*") {
			$(`#wh_subject_info_${i}`).append(`<option>${subject}</option>`); // 기본적으로 받은 값 추가. 사용자 입력 값은 옵션 리스트에 없기 떄문 
		} 
		$.each(clusterSubjectList,function(idx,clusterSubjectInfo){
			if(clusterSubjectInfo['subjectType'] === subjectType){//subjectType 이 같은 것 만 추가
				var infoData = clusterSubjectInfo['subject'];
				if(subjectType == "SERVICEACCOUNT") {
					infoData = clusterSubjectInfo['namespace'] +":"+ clusterSubjectInfo['subject'];  // 단, 타입이 SERVICEACCOUNT 인 경우에는 예외적으로 namespace를 앞에 붙여줌
				}
				if(infoData != subject) $(`#wh_subject_info_${i}`).append(`<option>${infoData}</option>`); // 현재 옵션에 없는 데이터들 추가
			}
		});
		$(`#wh_subject_info_${i}`).append(`<option class="subjectEditOption" value="other">사용자 입력</option>`); // 사용자 입력 기본적으로 추가
		$(`#wh_subject_info_${i}`).val(subject).niceSelect().niceSelect('update');	// 저장된 subject 로 select 추가
	});
}

function editRbacOptionList(elements){ 
	$("#policy_scopeOption .policy_option").remove();
	$("#policy_resourceOption .policy_option").remove();
	$("#policy_operationsOption .policy_option").remove();
	
	$.each(elements, function(idx, element){
		var type = element['type']; 
		var category = element['categories'][0];
		var ruleElements = element['elements'];
		
		$.each(ruleElements, function(index,ruleElement){
			i--; // 기존 추가시 사용했던 idx와 겹치게되면 optionListUp 에서 겹칠 수 있으므로 -- 
			var elementValue = ruleElement['value']; 
			var html = '';
			if(type === "scope"){
				var cluster = '';
				var namespace = '';
				if(category == "namespace"){
					cluster = elementValue.split(":")[0];
					namespace = elementValue.split(":")[1];
				}
				else {
					cluster = elementValue;
				}
				if($("#policy_scopeOption .policy_option").length === 0){
					html += `
						<div class="policy_option">
							<div class="policy_scope">
								<p>Cluster</p>
								<div class="ipt_box" style="margin-right: 10px;">
									<input type="text" value="" class="selected_cluster no_radius" readonly>
								</div>
							</div>
							<div class="policy_scope">
								<p>Namespace</p>
								<div class="ipt_box">
									<input type="text" class="no_radius" name="namespace" value=${namespace} >
								</div>
							</div>
							<a id="scopeOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
						 </div>
					`;	
					$("#policy_scopeOption").append(html);
					$("#policy_scopeOption select").niceSelect();
								
					// 현재 클러스터 정보 가져오기
					var clusterList = JSON.parse($('#clusterInfo').val());				
					$.each(clusterList,function(idx,clusterData){
						if(clusterData['uuid'] === cluster || clusterData['name'] === cluster ) {
							$("#wh_cluster").val(clusterData['uuid']).niceSelect('update');
							previousClusterUuid =  clusterData['uuid'];
						}
					});
					$("#wh_cluster").niceSelect('update');
					optionListUp(i); // 클릭 옵션 리스트 생성
				}
				else{
					html += `
						<div class="policy_option">
							<div class="policy_scope"/>
								
							<div class="policy_scope">
								<p>Namespace</p>
								<div class="ipt_box">
									<input type="text" class="no_radius" name="namespace" value=${namespace} >
								</div>
							</div>
							<a id="del${i}" class="btn icon del2" onclick="minusOptionWorkload(this.id)">삭제</a>
						</div>
					`;	
					$("#policy_scopeOption").append(html);
					$("#policy_scopeOption select").niceSelect();
					optionListUp(i); // 클릭 옵션 리스트 생성			
				}
			}
			else if(type === "resource"){
				html +=`
					<div class="policy_option">
						<div class="sel_box">
							<select id="wh_resources_${i}" class="popup_sel" >
							
							</select>
						</div>
						<div id="resourceOption_ipt_${i}" class="ipt_box" style="display:none">
							<input type="text" value="" placeholder="" class="no_radius">
						</div>
				`;
				
				// 첫번째 policy_option에는 +(추가)버튼
				if($("#policy_resourceOption .policy_option").length === 0){
					html += `
						<a id="resourceOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
					 </div>
					`;
				}
				else{
					html += `
						<a id="${i}" class="btn icon del2" onclick="minusOptionWorkload(this.id)">삭제</a>
					 </div>
					`;
				}
				$("#policy_resourceOption").append(html);
				$("#policy_resourceOption select").niceSelect();
				optionListUp(i); // <select> <option> 생성
				
				if(category == "custom") {
					$(`#wh_resources_${i}`).val("사용자 입력").niceSelect('update');
					$(`#resourceOption_ipt_${i}`).show();
					$(`#resourceOption_ipt_${i} input`).val(elementValue).niceSelect('update');
				}
				else{
					$(`#wh_resources_${i}`).val(elementValue?elementValue:"*").niceSelect('update');
				}
			}
			else if(type == "operation"){
				html +=`
					<div class="policy_option">
						<div class="sel_box">
							<select id="wh_operations_${i}" class="popup_sel" >
								
							</select>
						</div>
						<div id="operationsOption_ipt_${i}" class="ipt_box" style="display:none">
							<input type="text" value="" placeholder="" class="no_radius">
						</div>
					`;
					
				// 첫번째 policy_option에는 +(추가)버튼
				if($("#policy_operationsOption .policy_option").length === 0){
					html += `
						<a id="operationsOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
					 </div>
					`;
				}
				else{
					html += `
						<a id="${i}" class="btn icon del2" onclick="minusOptionWorkload(this.id)">삭제</a>
					 </div>
					`;
				}
				$("#policy_operationsOption").append(html);
				$("#policy_operationsOption select").niceSelect(); 
				optionListUp(i); // <select> <option> 생성
				$(`#wh_operations_${i}`).val(elementValue?elementValue.toLowerCase():"*").niceSelect('update'); // 현재 데이터값을 select
			}
		});		
	});	
}

function editWorkLoadPolicy(data){
	// securitypolicy_top_info
	$("#workload_rulename").val(data['policy_name']);
	$("#workload_description").val(data['policy_description']);
	$("#workload_action").val(data['policy_action']).niceSelect("update");
	if(data['is_activated'] ==="T") $("input:checkbox[id='workload_isactive']").prop("checked",true); // 토글버튼 체크 유무 확인
	
	// securitypolicy_bottom_info
	var body = {
		"policyUuid": data['uuid'],
	};
	cf_requestServer(_TR_POLICY_CLUSTER_ROLE_INFO, body,lf_serviceCall800065CallBack,false); 
	$('.selected_cluster').val($('#wh_cluster option:selected').text()); // Scope Cluster에는 선택된 Cluster Text 값을 추가
			
	//확인 버튼 onclick function change(저장 버튼)
	$("#wh_policy_add").attr('onclick',  'editPolicyWorkload("' + data['uuid'] + '")'); // 버튼의 onclick 함수를 변경
}

/**
 * 수정 버튼 클릭
 */
function editPolicyWorkload(policyUuid){
	swal("정책 수정", "정책을 수정하시겠습니까?", "./assets/images/icon_alert01.png", {
			buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if(willDelete) {
			createWorkloadData(policyUuid); // 입력 데이터 체크 후 수정
		} else {
			swal("정책 수정", "취소하였습니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		}
	});
}

/**
 * 입력 폼 초기화
 */
function initWorkLoadPolicy(){
	previousClusterUuid = null; // 추가. 입력 폼 초기화 시 선택된 clusterUuid 항목도 초기화 
	
  	$("#cs_failMessage").hide(); // 추가. 만약 에러 팝업 메시지가 열려있는 경우 초기화

	$("select").find("option:first").prop("selected", true);
	
	// input 초기화
	$(".ipt_box input").val(""); 
	// 체크 박스 옵션 모두 해제 
	$("input:checkbox[type='checkbox']").prop("checked",false); 
	
	$('#workload_action').val("DENY").niceSelect("update");
	// 0707 사용자 규정 준수 입력 추가
	
	$('#cs_complianceCondition').val($("#cs_complianceCondition option:eq(0)").val()).niceSelect("update");
	$("#wh_policy_add").attr('onclick', 'plusPolicyWorkload()'); // 버튼의 onclick 함수를 원래대로변경

	// .policy_option 목록 재생성 
	$('#policy_scopeOption').empty(); 
	$('#policy_scopeOption').append(`
		<div class="policy_option">
			<div class="policy_scope">
				<p>Cluster</p>
				<div class="ipt_box" style="margin-right: 10px;">
					<input type="text" value="" class="selected_cluster no_radius" readonly>
				</div>
			</div>
			<div class="policy_scope">
				<p>Namespace</p>
				<div class="ipt_box">
					<input type="text"  placeholder="" class="no_radius" name="namespace">
				</div>
			</div>
			<a id="scopeOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
		</div>`);
	$("#policy_scopeOption").find("select").niceSelect(); // select 태그 새로고침

	
	$('#policy_subjectOption').empty();
	$('#policy_subjectOption').append(`
		<div class="policy_option">
			<div class="sel_box">
				<select id="wh_subject_type_0" class="popup_sel" name="wh_subject_type">
				</select>
			</div>
			<div id="subject_info_box_0" class="sel_box" style="display:none;">
				<select id="wh_subject_info_0" class=" popup_sel" name="wh_subject_info" >
				</select>
			</div>
			<div id ="subjectOption_ipt_0" class="ipt_box" style="display:none">
				<input type="text" value="" placeholder="" class="no_radius" name="wh_subject_input" >
			</div>
			<a id="subjectOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
		</div>`);
	$("#policy_subjectOption").find("select").niceSelect();
	
	$('#policy_resourceOption').empty();
	$('#policy_resourceOption').append(`
	<div class="policy_option">
		<div class="sel_box">
			<select id ="wh_resources_0" class=" popup_sel" >
			</select>
		</div>
		<div id ="resourceOption_ipt_0" class="ipt_box" style="display:none">
			<input type="text"  value="" placeholder="" class="no_radius">
		</div>
		<a id="resourceOption" class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
	</div>`);
	$('#policy_resourceOption').find("select").niceSelect();
	
	$('#policy_operationsOption').empty();
	$('#policy_operationsOption').append(`
	<div class="policy_option">
		<div class="sel_box">
			<select id="wh_operations_0" class=" popup_sel">
			</select>
		</div>
		<div id="operationsOption_ipt_0" class="ipt_box" style="display:none">
			<input type="text"  value="" placeholder="" class="no_radius">
		</div>
		<a id="operationsOption"class="btn icon add" onclick="plusOptionWorkload(this.id)">추가</a>
	</div>`);
	$('#policy_operationsOption').find("select").niceSelect();
	
	//추가. 이전 선택된 규정 준수 프레임워크 리스트도 초기화 
	$('#cs_complicance').empty();
	$('#cs_complicance').append(`<option>-</option>`).niceSelect('update');
}

/**
 * 데이터 유효성 검사
 * TODO : subject, resource, operations, scope 중복 검사로직 추가
 * 현재 검사 항목 : 숫자 형식 체크, IP형식 체크
 */
function dataCheck(title, data){
	if(title === "FailControlsCount") {
		if (data.match(/^[0-9]*$/)) return true;
	}
	else if(title==="SubjectInfo"){
		// ip 형식 체크. 보류 
		//var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		//if (data.match(ipformat)) return true;
		var subjectType = data[0];
		var subjectInfo = data[1];
		// type이 SA 일때, 네임스페이스가 붙어야 함(namespace:subjectInfo)
		if(subjectType === "SERVICEACCOUNT") {
			if(subjectInfo.split(":")[1]) return true 
			//else return false;
		}
		else{
			// TODO: 다른 type 조건들 유효성 검사
			return true;
		}
	} 
	else if(title==="Resource"){
		if(subjectType === "SERVICEACCOUNT") {
			if(subjectInfo.split(":")[1]) return true 
			//else return false;
		}
		else{
			// TODO: 다른 type 조건 유효성 검사 로직 추가
			return true;
		}
	} 
	else if(title==="Operation"){
		if(operationAllowList.includes(data.toLowerCase())) return true
		//else false;
	} 
	else if(title==="duplicationDataCheck"){
		// 데이터 중복 검사
		var uniqueDataList = new Set(data.map(JSON.stringify)); // Set 자료형은 중복되는 데이터가 존재하지않음. Object를 string 형식으로 변환(Object는 값이 같아도 다른 값이기 때문)
		if(uniqueDataList.size == data.length) return true
	}
	return false;
}
//유효성 검사 실패 alert
function incorrectDataAlert(message){
	cf_alert(null, message);
}
// null 데이터 처리 alert
function nullAlert(title){
	cf_alert(null, title+" 값이 비어 있습니다");
}

//kimsw: 230721 기능 분리로 인한 로직 추가
//Registry 자산 리스트 호출
function lf_serviceCall800052(){
 var body ={};
 body.policyType = POLICY_TYPE;
// policyType에 따라 변경되도록 로직 수정
cf_requestServer(_TR_POLICY_IMAGESECURITY_STAT,body,lf_serviceCall800052CallBack, false);
}

//table 관련
//이미지 시큐리티 정책 내용 출력 > policyType에 따라 변경되도록 로직 수정 필요
function lf_serviceCall800052CallBack(data){ 
// Table Draw
policyDataList = data.body.policyDataList;

// 타이틀, 테이블 생성 로직을 policyType에 따라 변경 (ex:
// changeDataTable(policyType,policyDataList))
//drawDataTable(policyDataList); // 테이블 생성
updateTableByCluster();
}

function drawDataTable(policyDataList) {
var table = $('#'+POLICY_TYPE+'_policy_table').DataTable();
table.clear().draw(); // 테이블 초기화 

if(policyDataList) $('#registry_policy_cnt').html(policyDataList.length);
else $('#registry_policy_cnt').html(0);

$.each(policyDataList, function(idx,rowData){
	var type = rowData['policy_type'] ? rowData['policy_type']:'-';
	var rule_name = rowData['policy_name']? rowData['policy_name']:'-';
	var action = rowData['policy_action']? rowData['policy_action']:'-';
	var enabled = rowData['is_activated'] === "T" ? '적용':'미적용';
	var updated_user = rowData['updated_by']?  rowData['updated_by']:'-';
	var created_date = rowData['created_at']?rowData['created_at']:'-';
	var updated_date = rowData['updated_at']?rowData['updated_at']:'-';
	var btn_html ="<a href=\"#\" class=\"btn icon edit\" rel=\"workLoad_policy_edit\" name=\"workload\"> </a>"
							+ "<a class=\"btn icon del\" rel=\"workLoad_policy_del\"> </a>"
	table.row.add([
		(idx+1),
		type,
		rule_name,
		action,
		enabled,
		updated_user,
		created_date,
		updated_date,
		"<td>"
			+ "<input type=\"hidden\" name=\"workLoadData\" value='" +JSON.stringify(rowData)+ "'>"
			+  btn_html
		+"</td>",		
	]);
});
table.draw();
}

function updateTableByCluster() {
	var selectClusterUuid = $('#selectClusterUuid').val();
	var selectClusterDataList = policyDataList.filter(function(obj) {
	  return obj.cluster_uuid === selectClusterUuid;
	});
	
	drawDataTable(selectClusterDataList);
}

function closedAndUpdateTableByCluster(){ //수정 시 모달 창 닫을 떄 이전 클러스터 상태 유지
	$('#selectClusterUuid').val(clusterUuidState).niceSelect('update'); // 셀렉트 박스 변경
	var selectClusterDataList = policyDataList.filter(function(obj) {
	  return obj.cluster_uuid === clusterUuidState;
	});
	drawDataTable(selectClusterDataList);
}



