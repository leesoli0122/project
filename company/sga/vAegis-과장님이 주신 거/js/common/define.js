/***************************************************************
* 업무 그룹명 : 
* 서브 업무명 : 
* 설       명 :
* 작   성  자 : 
* 작   성  일 : 
* Copyright ⓒ 
* ======================================
* 변경자/변경일 : 
* 변경사유/내역 : 
* ======================================
***************************************************************/

const _LOGFLAG = true;		//로그 console 출력
const _WEBCONTEXTURL="";
const _ASYNC = true;
const _DEVMODE = "debug";

var _IDPWSERVICE = {};

/*************************************************************\
 * table 공통 
 *************************************************************/
const _PAGE_DEFAULT = 10;		//리스트 표시 수

const _TOPIC_ALL 			= 'ALL';
const _TOPIC_IPS 			= 'olm.java.tsm.bean.data.apt.IPSLogBean';
const _TOPIC_FIREWALL		= 'olm.java.tsm.bean.data.apt.IPSLogBean.FIREWALL';
const _TOPIC_AV 			= 'olm.java.tsm.bean.data.apt.IPSLogBean.MALWARE';
const _TOPIC_MALWARE 		= 'olm.java.tsm.bean.data.apt.MalwareEventLogBean';

const _TOPIC_FILE 			= 'olm.java.tsm.bean.data.apt.InotifyBean';
const _TOPIC_APPCTL			= 'olm.java.tsm.bean.data.apt.ips.IPSCmdCtlBean';
const _TOPIC_PAMACL			= 'olm.java.tsm.bean.data.apt.ips.IPSPamBean';
const _TOPIC_ALERT			= 'olm.java.tsm.bean.data.SendMonitorBean';
const _TOPIC_PACKET			= 'olm.java.tsm.bean.data.apt.ips.IPSNetPktBean';
const _TOPIC_POLICY_SERVER 	= 'olm.java.tsm.bean.data.cloudvm.IPSPolicyApplyBean';
const _TOPIC_POLICY_AGENT 	= 'olm.java.tsm.bean.data.cloudvm.IPSPolicyApplyLogBean';

const _TOPIC_FILESYSTEM 	= 'olm.java.tsm.bean.data.apt.rc_policy.FileDirectoryRealBean';
const _TOPIC_EXFILESYSTEM 	= 'olm.java.tsm.bean.data.apt.MalwareExceptionFileBean';

const _TOPIC_MALWARE_EVENT	= 'olm.java.tsm.bean.data.apt.MalwareEventLogBean';
const _TOPIC_MALWARE_HISTORY = 'olm.java.tsm.bean.data.apt.MalwareHistoryLogBean';
const _TOPIC_MALWARE_SCAN 	= 'olm.java.tsm.bean.data.apt.MalwareScanLogBean';

const _TOPIC_PROCESS 		= 'olm.java.tsm.bean.data.apt.ProcListBean';

const _TOPIC_IMAGESECURITY = 'sga.sol.ac.server.bean.data.csp.ImageSecurityBean';
const _TOPIC_CONTAINER_WORKLOAD = 'olm.java.tsm.bean.data.apt.ContainerWorkloadEventLogBean';
const _TOPIC_CONTAINER_SECURITY_EVENT = 'olm.java.tsm.bean.data.apt.ContainerSecurityEventLogBean';
const _TOPIC_IMAGE_RUNNING_CONTROL_EVENT = 'olm.java.tsm.bean.data.apt.ImageRunningControlEventLogBean';


const _USERLEVEL_SUPER_ADMIN	= "0000A399X999";
const _USERLEVEL_ADMIN 			= "0000A499X999";
const _USERLEVEL_OPERATOR 		= "0000A599X999";
const _USERLEVEL_VIEWER 		= "0000A699X999";
/*************************************************************\
 * LOGIN SERVICE 
 *************************************************************/
const _TR_LOGIN						= "100001";
const _TR_LOGOUT						= "100002";
const _TR_OTP_LOGIN					= "100003";

/*************************************************************\
 * EQUIP SERVICE
 *************************************************************/
const _TR_EQUIP_TREE					= "200001";
const _TR_EQUIP_LIST					= "200002";

/*************************************************************\
 * USER SERVICE
 *************************************************************/
const _TR_USER_LIST						= "500001";
const _TR_N_USER_LIST					= "500011";
const _TR_USER_INSERT_UPDATE			= "500002";
const _TR_N_USER_INSERT_UPDATE			= "500012";
const _TR_USER_DELETE					= "500003";
const _TR_N_USER_DELETE					= "500013";
const _TR_N_PASSWORD_AUDIT_LIST			= "500014";
const _TR_CURRENT_USER_UPDATE			= "500005";
const _TR_CURRENT_USER_PASSWORD_UPDATE	= "500006";

const _TR_SUPER_USER_PASSWORD_UPDATE	= "500007";

const _TR_SUPER_USER_UPDATE	= "500008";

const _TR_CURRENT_TOTPCODE_LIST		= "500021";
const _TR_CURRENT_TOTPCODE_UPDATE	= "500022";
// LOG
//const _TR_LOG_LIST					= "300001";

/*************************************************************\
 * DASHBOARD CHART SERVICE -FIREWALL
 *************************************************************/
const _TR_DASHBOARD_FW_EVENT_TREND				= "600001";
const _TR_DASHBOARD_FW_POLICY_TOPN				= "600002";
const _TR_DASHBOARD_FW_SERVER_TOPN				= "600003";
const _TR_DASHBOARD_FW_SRC_IP_TOPN				= "600004";
const _TR_DASHBOARD_FW_SRC_PORT_TOPN			= "600005";
const _TR_DASHBOARD_FW_RECENT_EVENT_TOPN		= "600006";
const _TR_DASHBOARD_FW_DST_IP_TOPN				= "600007";
const _TR_DASHBOARD_FW_DST_PORT_TOPN			= "600008";
/*************************************************************\
 * DASHBOARD CHART SERVICE -IPS
 *************************************************************/
const _TR_DASHBOARD_IPS_EVENT_TREND				= "600021";
const _TR_DASHBOARD_IPS_POLICY_TOPN				= "600022";
const _TR_DASHBOARD_IPS_COMPUTER_TOPN			= "600023";
const _TR_DASHBOARD_IPS_SRCIP_TOPN				= "600024";
const _TR_DASHBOARD_IPS_DSTIP_TOPN				= "600025";
const _TR_DASHBOARD_IPS_WEB_OCCUPTION			= "600026";
const _TR_DASHBOARD_IPS_RECENT_EVENT_TOPN		= "600027";
/*************************************************************\
 * DASHBOARD CHART SERVICE -ANTI MALWARE
 *************************************************************/
const _TR_DASHBOARD_AV_EVENT_TREND				= "600041";
const _TR_DASHBOARD_AV_STATUS_LIST				= "600042";
const _TR_DASHBOARD_AV_RECENT_CLOUD_TOPN		= "600043";
const _TR_DASHBOARD_AV_RECENT_EVENT_TOPN		= "600044";
/*************************************************************\
 * DASHBOARD CHART SERVICE -ANTI MALWARE(CLAMAV)
 *************************************************************/
const _TR_DASHBOARD_MALWARE_EVENT_TREND			= "600321";
const _TR_DASHBOARD_MALWARE_STATUS_LIST			= "600322";
const _TR_DASHBOARD_MALWARE_RECENT_CLOUD_TOPN	= "600323";
const _TR_DASHBOARD_MALWARE_RECENT_EVENT_TOPN	= "600324";
/*************************************************************\
 * DASHBOARD CHART SERVICE -FILEINT
 *************************************************************/
const _TR_DASHBOARD_FILEINT_EVENT_TREND				= "600061";
const _TR_DASHBOARD_FILEINT_FILE_TOPN				= "600062";
const _TR_DASHBOARD_FILEINT_CLOUD_TOPN				= "600063";
const _TR_DASHBOARD_FILEINT_RECENT_EVENT_TOPN		= "600064";
/*************************************************************\
 * DASHBOARD CHART SERVICE -APPCTL
 *************************************************************/
const _TR_DASHBOARD_APPCTL_EVENT_TREND				= "600081";
const _TR_DASHBOARD_APPCTL_FILE_TOPN				= "600082";
const _TR_DASHBOARD_APPCTL_CLOUD_TOPN				= "600083";
const _TR_DASHBOARD_APPCTL_RECENT_EVENT_TOPN		= "600084";
/*************************************************************\
 * DASHBOARD CHART SERVICE -PAMACL
 *************************************************************/
const _TR_DASHBOARD_PAMACL_EVENT_TREND				= "600301";
const _TR_DASHBOARD_PAMACL_SERVICE_TOPN				= "600302";
const _TR_DASHBOARD_PAMACL_USER_TOPN				= "600303";
const _TR_DASHBOARD_PAMACL_IP_TOPN					= "600304";
const _TR_DASHBOARD_PAMACL_CLOUD_TOPN				= "600305";
const _TR_DASHBOARD_PAMACL_RECENT_EVENT_TOPN		= "600306";

/*************************************************************\
 * CLOUD 
 *************************************************************/
// 호스트
const _TR_CLOUD_SERVER_STATUS_STAT					= "600071";
const _TR_CLOUD_SERVER_STATUS						= "600072";

// 레지스트리
const _TR_CLOUD_CONTAINER_REGISTRY_SERACH			= "600073";
const _TR_CLOUD_CONTAINER_SERVER_STATUS				= "600074";

// 클러스터
//const _TR_CLOUD_SERVER_STATUS_STAT					= "600075";
// 클러스터에 대한 상태확인은 제공하지 않습니다. 상태 확인이 필요하면 Redcastle 에이전트를 설치해야합니다.
//const _TR_CLOUD_CLUSTER_STATUS							= "600076";

/*************************************************************\
 * CLOUD CONTAINER
 *************************************************************/
// CLOUD와 병합으로 해당 정의는 CLOUD> 레지스트리에있습니다.



/*************************************************************\
 * DASHBOARD CONF SERVICE
 *************************************************************/
const _TR_DASHBOARD_CONF_CURRENT_USER_INFO			= "600101";
const _TR_DASHBOARD_CONF_CURRENT_USER_SAVE			= "600102";
const _TR_DASHBOARD_CONF_CURRENT_USER_DELETE		= "600103";
const _TR_DASHBOARD_CONF_PUBLIC_USER_LIST			= "600104";
//const _TR_DASHBOARD_CONF_DASHBOARD_USER_SEARCH	= "600105";
const _TR_DASHBOARD_CONF_PUBLIC_LIST				= "600106";
const _TR_DASHBOARD_CONF_ADMIN_PUBLIC_LIST			= "600107";

const _TR_DASHBOARD_CONF_PUBLIC_SUPERADMIN_SAVE		= "600202";
const _TR_DASHBOARD_CONF_SUPERADMIN_LIST			= "600204";
const _TR_DASHBOARD_CONF_DASHBOARD_ADMIN_SEARCH		= "600205";

/*************************************************************\
 * DASHBOARD CHART SERVICE - IMAGE SECURITY
 *************************************************************/

const _TR_DASHOBOARD_MALWARE_TOP5 = "600500";
const _TR_DASHOBOARD_VULNERABILITY_TOP5 = "600501";
const _TR_DASHOBOARD_SCAN_HISTORY = "600502";
const _TR_DASHOBOARD_IMAGE_DISTRIBUTION_CONTROL_HISTORY = "600503";

const _TR_DASHOBOARD_DONUT_CHART_STATUS = "600400";

const _TR_DASHOBOARD_IS_DASHBOARD_DETAIL = "600401";
const _TR_DASHOBOARD_IS_VULNERABILITY_PACKAGE_DETAIL = "600402";
const _TR_DASHOBOARD_IS_DASHBOARD_CACHE_CLEAR = "600403";

/*************************************************************\
 * DASHBOARD CHART SERVICE - CONTAINER EVENT
 *************************************************************/
const _TR_DASHBOARD_CE_DASHBOARD_BY_POLICY_TOP5 ="600610";	// 컨테이너 이벤트 조회 TOP 5
const _TR_DASHBOARD_CE_DASHBOARD_BY_POLICY_COUNT ="600611";	// 컨테이너 이벤트 조회 COUNT
const _TR_DASHBOARD_CE_DASHBOARD_BY_POLICY_SEVERITY_COUNT ="600620";	// 컨테이너 이벤트 정책 위험도 기준 조회
const _TR_DASHBOARD_CE_RUNTIME_BUILDTIME_BY_COUNT ="600621";	// 컨테이너 런타임/빌드타임 조회 COUNT
const _TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_RULE_TOP5 ="600612";	// 컨테이너 이벤트 런타임 조회 > 룰 베이스 TOP 5
const _TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_RULE_COUNT ="600613";	// 컨테이너 이벤트 런타임 조회 > 룰 베이스 COUNT
const _TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_SEVERITY_TABLE ="600614";	// 컨테이너 이벤트 런타임 조회 > 위험도 베이스 TABLE
const _TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_SEVERITY_COUNT ="600615";	// 컨테이너 이벤트 런타임 조회 > 위험도 베이스 COUNT
const _TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_RULE_TOP5 ="600616";	// 컨테이너 이벤트 빌드타임 조회 > 룰 베이스 TOP 5
const _TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_RULE_COUNT ="600617";	// 컨테이너 이벤트 빌드타임 조회 > 룰 베이스 COUNT
const _TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_SEVERITY_TABLE ="600618";	// 컨테이너 이벤트 빌드타임 조회 > 위험도 베이스 TABLE
const _TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_SEVERITY_COUNT ="600619";	// 컨테이너 이벤트 빌드타임 조회 > 위험도 베이스 COUNT

/*************************************************************\
 * DASHBOARD CHART SERVICE - COMPLIANCE SCAN
 *************************************************************/
const _TR_DASHBOARD_COMPLIANCE_TOTAL_RATE = "600600";
const _TR_DASHBOARD_COMPLIANCE_RATE_FOR_REGULATIONS = "600601";
const _TR_DASHBOARD_COMPLIANCE_EVALUATION_TREND = "600602";
const _TR_DASHBOARD_FRAMEWORK_LIST_BY_CLUSTER = "600603";

/*************************************************************\
 * EVENT SEARCH SERVICE
 *************************************************************/
const _TR_EVENT_FIREWALL_SEARCH		= "700001";
const _TR_EVENT_IPS_SEARCH			= "700002";
const _TR_EVENT_AV_SEARCH			= "700003";
const _TR_EVENT_FILEINT_SEARCH		= "700004";
const _TR_EVENT_PACKET_SEARCH		= "700005";
const _TR_EVENT_FILECTL_SEARCH		= "700006";
const _TR_EVENT_PAGEINFO_SEARCH		= "700007";
const _TR_EVENT_PAMACL_SEARCH		= "700008";
const _TR_EVENT_AUDIT_SEARCH		= "700009";
const _TR_EVENT_MALWARE_SEARCH		= "700010";
const _TR_EVENT_MALWARE_HISTORY_SEARCH		= "700011";
const _TR_EVENT_IS_SEARCH			= "700012";
const _TR_EVENT_WORKLOAD_SEARCH		= "700013";
const _TR_EVENT_CONTAINER_SECURITY	= "700014";
const _TR_EVENT_CONTAINER_IMAGE_CONTROL = "700015";
const _TR_EVENT_COMPLIANCE = "700016";
const _TR_EVENT_COMPLIANCE_INFO = "700017";

const _TR_EVENT_CSP_PAGEINFO_SEARCH	= "700019";






/*************************************************************\
 * EVENT MONITORING SERVICE 
 *************************************************************/
const _TR_EVENT_IMAGESECURIY_SEARCH		= "700020"; // 이름 변경 필요 


/*************************************************************\
 * POLICY MANAGE SERVICE
 *************************************************************/
const _TR_POLICY_MANAGE_SEARCH				= '800001';
const _TR_POLICY_MANAGE_SET					= '800002';
const _TR_POLICY_MANAGE_RESULT_SEARCH		= '800005';
const _TR_POLICY_MANAGE_SERVER_SEARCH		= '800021';


/*************************************************************\
 * SECURITY POLICY SERVICE
 *************************************************************/
const _TR_POLICY_STAT						= '800031';
const _TR_POLICY_REVISION_STAT				= '800032';
const _TR_POLICY_RULE_LIST					= '800033';
const _TR_POLICY_AGENT_LIST					= '800034';
const _TR_POLICY_REVISION_HISTORY			= '800035';
const _TR_POLICY_APPLY						= '800041';
const _TR_ASSET_APPLY						= '800042';
const _TR_POLICY_REMOVE						= '800043';

// 230208 추가 Registry Policy
const _TR_POLICY_IMAGESECURITY				= '800051';
// 230213 추가 Registry Policy Status (TODO: 이름변경 _TR_POLICY_REGISTRY_STAT	)
const _TR_POLICY_IMAGESECURITY_STAT			= '800052';
//230217 추가 Registry Policy 수정, 삭제
const _TR_POLICY_IMAGESECURITY_EDIT			= '800053';
const _TR_POLICY_IMAGESECURITY_DEL			= '800054';

//230905 이미지 보증 정책 조회, 수정
const _TR_POLICY_IMAGEASSURANCE_STAT		= '800055';
const _TR_POLICY_IMAGEASSURANCE_EDIT		= '800056';


//230313 추가 탐지룰 관리 >  컨테이너 워크로드 실행 제어
const _TR_POLICY_CLUSTER_INFO 				= '800060'; 
const _TR_POLICY_CLUSTER_SUBJECT_INFO 		= '800061'; 
const _TR_POLICY_CLUSTER_SUBJECT_UPDATE 	= '800062'; 
const _TR_POLICY_CLUSTER_WORKLOAD_ADD		= '800063'; 
const _TR_POLICY_CLUSTER_WORKLOAD_DEL		= '800064'; 
const _TR_POLICY_CLUSTER_ROLE_INFO			= '800065'; 
const _TR_POLICY_CLUSTER_CS_POLICY_INFO	    = '800068';  //230707 클러스터 규정준수 정책 조회 추가

// 230630 정책 관리 > 클러스터 > 컨테이너 이벤트
const _TR_POLICY_CONTAINER_SECURITY_INFO = '800066'; // select
const _TR_POLICY_CONTAINER_SECURITY_UPDATE = '800067'; // update



/*************************************************************\
 * GROUP
 *************************************************************/
const _TR_GROUP_SEARCH				= '800101';
const _TR_GROUP_INSERT				= '800111';
const _TR_GROUP_UPDATE				= '800112';
const _TR_GROUP_DELETE				= '800113';
const _TR_GROUP_MOVE				= '800114';

/*************************************************************\
 * AGENT
 *************************************************************/
const _TR_AGENT_SEARCH				= '800120';
const _TR_AGENT_INSERT				= '800121';
const _TR_AGENT_UPDATE				= '800122';
const _TR_AGENT_DELETE				= '800123';

/*************************************************************\
 * 230110 AGENT > TYPE : REGISTRY
 *************************************************************/
//const _TR_REGISTRY_SEARCH				= '800124'; // type 추가 시 추가 예정
const _TR_REGISTRY_INSERT				= '800125';
const _TR_REGISTRY_UPDATE				= '800126';
const _TR_REGISTRY_DELETE				= '800127';

/*************************************************************\
 * 230621 AGENT > TYPE : ContainerSecurity(CLUSTER)
 *************************************************************/
const _TR_CLUSTER_SEARCH						= '800140';
const _TR_CLUSTER_INSERT						= '800141';
const _TR_CLUSTER_UPDATE						= '800142';
const _TR_CLUSTER_DELETE						= '800143';
const _TR_CLUSTER_CRTCHECK					= '800144';
const _TR_CLUSTER_FRAMEWORK_SELECT	= '800145';
const _TR_CLUSTER_POST_AUTO_SCAN		= '800146';

/*************************************************************\
 * MALWARE SCAN
 *************************************************************/
const _TR_MALWARE_STATUS			= '800201';
const _TR_MALWARE_SCAN_START		= '800202';
const _TR_MALWARE_SCAN_STOP			= '800203';
const _TR_MALWARE_FILE_SEARCH		= '800204';
const _TR_MALWARE_EXFILE_SEARCH		= '800205';
const _TR_MALWARE_EXFILE_SET		= '800206';

/*************************************************************\
 * PROCESS SCAN
 *************************************************************/
const _TR_PROCESS_SEARCH			= '800207';
/*************************************************************\
 * 취약점 SCAN
 *************************************************************/
const _TR_VULNERABILITY_SCAN_STAT_CHECK = '800300'; // jkcho 추가. 스캔 보고서 상태 체크
const _TR_VULNERABILITY_SCAN_START		= '800301';
const _TR_VULNERABILITY_SEARCH			= '800302';

/*************************************************************\
 * 230221 추가
 * IMAGE SCAN
 *************************************************************/
const _TR_SCAN_REGISTRY_POLICY_STATUS	= '800401';
const _TR_SCAN_REGISTRY_SCAN_STATUS		= '800402';
const _TR_SCAN_IS_EVALUATION 			= '800403';
const _TR_SCAN_IS_SCAN 					= '800404';

const _TR_SCAN_IS_SCAN_CHECK			= '800399';
const _TR_SCAN_IS_SCAN_STATUS			= '800400';

/*************************************************************\
 * 230404 추가
 * COMPLIANCE SCAN
 *************************************************************/
const _TR_CLUSTER_FRAMEWORK_STATUS = '800405';
const _TR_COMPLIANCE_SCAN_LIST = '800406';
const _TR_COMPLIANCE_SCAN = '800407';
const _TR_COMPLIANCE_SCAN_STATUS = '800408';
const _TR_COMPLIANCE_SCAN_LIST_SEARCH = '800409';
const _TR_COMPLIANCE_SCAN_STATUS_LATEST = '800410';

/*************************************************************\
 * 230717 추가
 * COMPLIANCE SCAN POLICY
 * 800420 ~ 800429
 *************************************************************/
const _TR_POLICY_CS_COMPLIANCE_SEARCH = '800420';
const _TR_POLICY_CS_COMPLIANCE_INSERT_UPDATE = '800421';


/*************************************************************\
 * ETC
 *************************************************************/
const _TR_CONFIG_AUTH_SEARCH				= '900001';
const _TR_CONFIG_AUTH_SET					= '900002';
const _TR_CONFIG_SITE_SEARCH				= '900011';
const _TR_CONFIG_SITE_SET					= '900012';


/*************************************************************\
 * WEBSOCKET CONST
 *************************************************************/
// 실시간 로그 
const _WS_SET		= '100001';
const _WS_ADD		= '100002';
const _WS_DEL		= '100003';
const _WS_GET		= '100004';

// 사용자 메뉴 관리
const _WS_MENU_GET 		= '200001';
const _WS_MENU_REQUEST	= '200002';
const _WS_MENU_RESPONSE	= '200003';


/********************************************************************************
* USER 권한 필드정보
********************************************************************************/
const _AUTH_SEARCH = "1:E";
const _AUTH_ANALYSIS = "2:E";
const _AUTH_SERVERSTAT = "3:E";
const _AUTH_MODULEMNG = "4:E";
const _AUTH_STARTSTOP = "4:E";


/********************************************************************************
* USER 정보
********************************************************************************/

var _USER={
	userId : "",
	userKnm : "",
	authKey : "",
	userLev : "",
	userLevKnm : "",
	userStatus : "",
	userPhone : "",
	userEmail : "",
	
	setUserId:function(rUserId){
		this.userId = rUserId;
	},
	setUserKnm:function(rUserKnm){
		this.userKnm = rUserKnm;
	},
	setAuthKey:function(rAuthKey){
		this.authKey = rAuthKey;
	},
	setUserLev:function(rUserLev){
		this.userLev = rUserLev;
		this.userLevKnm = _LEVELINFO_ARR[rUserLev];
	},
	setUserLevKnm:function(rUserLev){
		this.userLevKnm = rUserLev;
	},
	setUserStatus:function(rUserStatus){
		this.userStatus = rUserStatus;
	},
	setUserPhone:function(rUserPhone){
		this.userPhone = rUserPhone;
	},
	setUserEmail:function(rUserEmail){
		this.userEmail = rUserEmail;
	},
	
	getUserId:function(){
		return this.userId;
	},
	getUserKnm:function(){
		return this.userKnm;
	},
	getAuthKey:function(){
		return this.authKey;
	},
	getUserLev:function(){
		return this.userLev;
	},
	getUserLevKnm:function(){
		return this.userLevKnm;
	},
	getUserStatus:function(){
		return this.userStatus;
	},
	getUserPhone:function(){
		return this.userPhone;
	},
	getUserEmail:function(){
		return this.userEmail;
	}
};

const _NOTLOGINSP_150 = "SP150";
const _NOTLOGINSP_107 = "SP107";

/********************************************************************************
* USER LEVEL CD
********************************************************************************/
const USER_LEVEL_SUPERADMIN = "SUPER";
const USER_LEVEL_ADMIN = "ADMIN";
const USER_LEVEL_OPERATOR = "OPERATOR";
const USER_LEVEL_VIEWER = "VIEWER";

const USER_LEVEL_SUPERADMIN_CODE	 = "0000A399X999";
const USER_LEVEL_ADMIN_CODE		 = "0000A499X999";
const USER_LEVEL_OPERATOR_CODE	 = "0000A599X999";
const USER_LEVEL_VIEWER_CODE		 = "0000A699X999";

const STATUS_INUSE = "INUSE";
const STATUS_NOTUSE = "NOTUSE";
const STATUS_LOCKED = "LOCKED";
const STATUS_DELETED = "DELETED";


var _AUTHINFO;

const _MAIN_MENU = [
	{
		'categoryId': 'main',
		'categoryName': 'MAIN',
		'categoryOrder': 1,
		'children': [
			{
				'menuId': 'dashboard',
				'menuName': 'DASHBOARD',
				'menuOrder': 1,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-chart-pie',
				'category': 'main'
			}
		]
	},
	{
		'categoryId': 'alerts',
		'categoryName': 'Alerts',
		'categoryOrder': 2,
		'children': [
			{
				'menuId': 'alertList',
				'menuName': 'Alert List',
				'menuOrder': 1,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-bell',
				'category': 'alerts'
			}
		]
	},
	{
		'categoryId': 'event',
		'categoryName': 'Event',
		'categoryOrder': 3,
		'children': [
			{
				'menuId': 'event',
				'menuName': 'Event',
				'menuOrder': 1,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-flag',
				'category': 'event',
				'children': [
					{
						'menuId': 'firewallEvent',
						'menuName': '방화벽',
						'menuOrder': 1,
						'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
						'useYn': 'Y',
						'category': 'event'
					},
					{
						'menuId': 'ipsEvent',
						'menuName': 'IPS',
						'menuOrder': 2,
						'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
						'useYn': 'Y',
						'category': 'event'
					},
					{
						'menuId': 'avEvent',
						'menuName': '멀웨어',
						'menuOrder': 3,
						'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
						'useYn': 'Y',
						'category': 'event'
					},
					{
						'menuId': 'fileIntEvent',
						'menuName': '파일 무결성',
						'menuOrder': 4,
						'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
						'useYn': 'Y',
						'category': 'event'
					},
					{
						'menuId': 'fileCtlEvent',
						'menuName': '실행 파일 통제',
						'menuOrder': 4,
						'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
						'useYn': 'Y',
						'category': 'event'
					},
					{
						'menuId': 'pamAclEvent',
						'menuName': '서비스 제어',
						'menuOrder': 4,
						'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
						'useYn': 'Y',
						'category': 'event'
					},
				]
			}
		]
	},
	{
		'categoryId': 'computer',
		'categoryName': 'Computer',
		'categoryOrder': 4,
		'children': [
			{
				'menuId': 'cloudList',
				'menuName': 'Cloud',
				'menuOrder': 1,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE, USER_LEVEL_OPERATOR_CODE, USER_LEVEL_VIEWER_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-server',
				'category': 'computer'
			}
		]
	},
	{
		'categoryId': 'configuration',
		'categoryName': 'Configuration',
		'categoryOrder': 10,
		'children': [
			{
				'menuId': 'securityConf',
				'menuName': 'Policy',
				'menuOrder': 1,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-cogs',
				'category': 'configuration',
				'children': [
					{
						'menuId': 'firewallPolicy',
						'menuName': '방화벽',
						'menuOrder': 1,
						'menuAuth': [USER_LEVEL_SUPERADMIN_CODE, USER_LEVEL_ADMIN_CODE],
						'useYn': 'Y',
						'category': 'configuration'
					}
				]
			},
			{
				'menuId': 'siteConfig',
				'menuName': '사이트 이용 설정',
				'menuOrder': 2,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-cog',
				'category': 'configuration'
			},
			{
				'menuId': 'userConfig',
				'menuName': '사용자 관리',
				'menuOrder': 3,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-users',
				'category': 'configuration'
			},
			{
				'menuId': 'auditList',
				'menuName': '감사 로그',
				'menuOrder': 3,
				'menuAuth': [USER_LEVEL_SUPERADMIN_CODE],
				'useYn': 'Y',
				'feather': 'fas fa-users',
				'category': 'configuration'
			}
		]
	}
	
]

const _MENU_PATH = {
		'dashboard': 			['Home', '대시보드'],
		'alertList': 			['Home', '이벤트 모니터링'],
		'eventList': 			['Home', '이벤트 조회'],
		'firewallEvent': 		['Home', '이벤트 조회', '방화벽'],
		'ipsEvent': 			['Home', '이벤트 조회', '침입방지시스템'],
		'avEvent': 				['Home', '이벤트 조회', '멀웨어 행위'],
		'malwareEvent': 		['Home', '이벤트 조회', '멀웨어'],
		'malwareHistoryEvent':	['Home', '이벤트 조회', '멀웨어 스캔 이력'],
		'fileIntEvent': 		['Home', '이벤트 조회', '파일무결성'],
		'fileCtlEvent': 		['Home', '이벤트 조회', '실행 파일 통제'],
		'pamAclEvent': 			['Home', '이벤트 조회', '서비스 제어'],
		'malware': 				['Home', '멀웨어'],		
		'malwareScan':	 		['Home', '멀웨어', '멀웨어 수동 검사'],
		'cloudScan': 			['Home', '멀웨어', '멀웨어 통합 검사'],
		'malwareExcept':	 	['Home', '멀웨어', '멀웨어 예외 설정'],
		'policy': 				['Home', '정책 관리'],
		'securityPolicy': 		['Home', '정책 관리', '탐지 룰 관리'],
		// 2023-06-20 cloudManagerContainer와 병합				
		'cloudManager': 		['Home', '정책 관리', '자산 관리'],
		'userConfig': 			['Home', '정책 관리', '사용자 관리'],
		'auditList': 			['Home', '정책 관리', '감사 로그'],		
		'configure': 			['Home', '환경 설정'],		
		'authConfig': 			['Home', '환경 설정', '메뉴 권한 관리'],
		'siteConfig': 			['Home', '환경 설정', '사이트 이용 설정'],
				
		'systemAccount': 		['Home', '정책', '계정 관리'],
		'cloudStatus': 			['Home', '자산', '자산 현황'],			
}

const _MENU_LABEL = {
		// 대시보드
		'dashboard': 			'대시보드',
		// 이벤트 모니터링
		'eventMonitoring': 		'이벤트 모니터링', // 230118 이벤트 모니터링 권한 설정 추가
		// 이벤트 조회
		'eventList': 			'이벤트 조회',
		// 이벤트 조회 > 호스트 이벤트
		'firewallEvent': 		'방화벽',
		'ipsEvent': 			'침입방지시스템',
		'malwareEvent': 		'멀웨어',
		'fileIntEvent': 		'파일무결성',
		'fileCtlEvent': 		'실행 파일 통제',
		'pamAclEvent': 			'서비스 제어',
		// 이벤트 조회 > 클러스터 이벤트
		'containerSecurityEvent': 	    '컨테이너 이벤트', // 230609 이벤트 조회 > 컨테이너 이벤트 권한 설정
		'workloadEvent': 	    '컨테이너 워크로드 실행제어', // 이벤트 조회 > 컨테이너 워크로드 실행제어 권한 설정
		'containerImageControlEvent':		'컨테이너 이미지 실행제어', // 230622 이벤트 조회 > 컨테이너 이미지 실행제어 권한 설정
		'imageSecurityEvent': 	'컨테이너 이미지 스캔', // 이벤트 조회 > 이미지 시큐리티 권한 설정
		'complianceEvent':		'클러스터 규정준수 스캔', // 이벤트 조회 > 규정 준수 권한 설정
		// 스캔
		'scan':					'스캔', // 2302020 스캔 카테고리 추가
		'imageScan':			'컨테이너 이미지', //230220 스캔 > 이미지 추가
		'complianceScan':		'클러스터 규정 준수', //230404 스캔 > 규정 준수 추가
		'cloudScan': 			'호스트 안티 멀웨어',
		'vulnerabilityScan': 			'호스트 취약성',
		// 정책 관리
		'policy': 				'정책 관리',
		'cloudManager': 		'자산 관리',
		'userConfig': 			'사용자 관리',
		'auditList': 			'감사 로그',
		// 정책 관리 > 호스트 정책
		'policyManagement': 	'탐지 룰 관리', // 230201 탐지 룰 관리(cAegis)추가
		// 정책 관리 > 클러스터 정책
		'policyContainerSecurity': '컨테이너 이벤트',
		'policyWorkload': '컨테이너 워크로드 실행제어',
		'policyImageSecurity': '컨테이너 이미지 스캔',
		'policyComplianceScan': '컨테이너 규정준수 스캔',
		// 환경 설정
		'configure': 			'환경 설정',
		'authConfig': 			'메뉴 권한 설정',
		'siteConfig': 			'사이트 이용 설정',
		// not used
		'alertList': 			'이벤트 모니터링',
		'avEvent': 				'멀웨어 행위',
		'malwareHistoryEvent': 	'멀웨어 스캔 이력',
		'securityPolicy': 		'탐지 룰 관리',
		'malware': 				'멀웨어',
		'cloud': 				'자산',
		'cloudStatus': 			'자산 현황',
		// 2023-06-20 cloudManagerContainer와 병합
		'malwareScan': 			'멀웨어 수동 검사',
		'malwareExcept': 		'멀웨어 예외 설정',
		'systemAccount': 		'계정 관리',
		'policyComplianceScan':		'클러스터 규정준수 스캔', //230404 정책관리>클러스터 정책 > 클러스터 규정준수 스캔 추가
}

const _FIELD_LABEL = {
		'revisetime':			'수정시간',
		'order':				'순서',
		'createtime':			'생성시간',
		'rev': 					'REV',
		'gid': 					'GID',
		'dn':					'자산',
		'collecttime':			'수집시간',
		'equip_ip':				'자산IP',
		'equip_id':				'자산ID',
		'event_type':			'이벤트타입', 
		'timestamp':			'발생시간',
		'src_ip':				'출발지 IP',
		'src_port':				'출발지 포트',
		'dest_ip':				'목적지 IP',
		'dest_port':			'목적지 포트',
		'proto':				'프로토콜',
		'app_proto':			'어플리케이션 프로토콜',
		'flow_id':				'플로우 ID',
		'in_iface':				'인터페이스',
		'app_proto_tc':			'어플리케이션 정보',
		'tx_id':				'TX ID',
		'icmp_code':			'ICMP 코드',
		'response_icmp_code':	'ICMP 응답 코드',
		'icmp_type':			'ICMP 타입',
		'response_icmp_type':	'ICMP 응답 타입',
		'reason':				'사유',
		'pkts_toclient':		'클라이언트 패킷',
		'pkts_toserver':		'서버 패킷',
		'alerted':				'Alert 여부',
		'start':				'플로우 시작 시간',
		'end':					'플로우 종료 시간',
		'bytes_toclient':		'클라이언트 Byte',
		'bytes_toserver':		'서버 Byte',
		'age':					'age',
		'defrag':				'defrag',
		'tcp':					'TCP',
		'ftp':					'FTP',
		'app_layer':			'어플리케이션 정보',
		'dns':					'DNS',
		'capture':				'캡처',
		'detect':				'탐지 정보',
		'http':					'HTTP',
		'decoder':				'디코더',
		'flow_mgr':				'플로우 매니저',
		'flow':					'플로우',
		'uptime':				'업타임',
		'filename':				'파일명',
		'size':					'파일 크기',
		'stored':				'stored',
		'tx_id':				'TX ID',
		'gaps':					'gaps',
		'signature_id':			'시그니처 ID',
		'signature':			'탐지명',
		'action':				'액션',
		'category':				'분류',
		'severity':				'위험도',
		'rev':					'rev',
		'metadata':				'메타데이터',
		'former_category':		'시그니처 대분류',
		'created_at':			'시그니처 생성 시간',
		'updated_at':			'시그니처 변경 시간',
		'hostname':				'호스트명',
		'url':					'URL',
		'protocol':				'프로토콜',
		'http_user_agent':		'사용자 에이전트',
		'http_method':			'메소드',
		'http_content_type':	'컨텐츠 타입',
		'http_refer':			'리퍼러',
		'length':				'길이',
		'status':				'응답상태',
		'serial':				'시리얼',
		'notbefore':			'유효시간 시작',
		'subject':				'SUBJECT',
		'issuerdn':				'도메인 정보',
		'notafter':				'유효시간 종료',		
		'fingerprint':			'인증서 지문',
		'version':				'버전',
		'ja3':					'JA3',
		'sni':					'SNI',
		'tcp':					'TCP',
		'rst':					'RST',
		'tcp_flags_ts':			'TCP Flags TS',
		'tcp_flags_tc':			'TCP Flags TC',
		'tcp_flags':			'TCP Flags',
		'psh':					'PSH',
		'ack':					'ACK',
		'syn':					'SYN',
		'fingerprint':			'TCP 지문',
		'state':				'상태',
		'dns':					'DNS',
		'qr':					'qr',
		'grouped':				'grouped',
		'flags':				'flags',
		'answers':				'answers',
		'rrname':				'rrname',
		'rcode':				'rcode',
		'type':					'타입',
		'authorities':			'authorities',
		'ra':					'ra',
		'rd':					'rd',
		'id':					'ID',
		'rrtype':				'rrtype',
		'server':				'서버',
		'client':				'클라이언트',
		'flowints':				'flowints',
		'flowbits':				'flowbits',
		'message':				'메시지',
		'uid_new':				'UID',
		'uid_old':				'변경전 UID',
		'size_old':				'변경전 사이즈',
		'size_new':				'파일크기',
		'path':					'파일경로',
		'hash_new':				'해시',
		'hash_old':				'변경전 해시',
		'gid_old':				'변경전 GID',
		'gid_new':				'변경전 GID',
		'perm_new':				'퍼미션',
		'perm_old':				'변경전 퍼미션',
		'rev':					'리비젼',
		
		// 추가. csp용어
		'cnt':					'검출 갯수',
		'cveid':				'CVE ID',
		'requestuser':			'요청 사용자',
		'rescanned':			'재스캔 여부',
		'scanresult':			'스캔 결과',
		'is_createdat':			'탐지 시간',
		'is_finishedat':		'종료 시간',
		'date':					'탐지 시간',
		'tag':					'이미지 태그', 
		'actionresult':			'인가 결과',
		'digest':				'다이제스트',
}

var _ACTION_OBJ = {
	'allowed': '허용',
	'blocked': '차단'
}

var _EVENTFILEINTTYPEOBJ = {
		1:	'Create',
		2:	'Permission',
		4:	'User',
		8:	'Group',
		16:	'Size',
		32:	'Hash(무결성)',
		64:	'Delete',		
}

var _AUDIT_TYPE = {
	'SERVICE' : '서비스 감사',
	'EVENT' : '주요 이벤트 감사',
	'CONFIG' : '설정 이벤트 감사'
}

var _AUDIT_TOPIC = {
	'SESSIONDESTROY_DOUBLE_LOGIN':	'중복 로그인 세션 해제',
	'LOGINSUCCESS':					'사용자 로그인',
	'LOGINDENY_LIMITOVER':			'로그인 거부(세션 초과)',
	'LOGINDENY_NOAUTHIP':			'로그인 거부(비인가 IP 접속)',
	'LOGINDENY_PASSWORD':			'로그인 거부(비밀번호 오류)',
	'LOGINDENY_BAN':				'로그인 거부(BAN)',
	'LOGINLOCKED_USER':				'사용자 ID Locked',
	'AGENT_ADD':					'자산 추가',
	'AGENT_DELETE':					'자산 삭제',
	'AGENT_UPDATE':					'자산 수정',
	'GROUP_ADD':					'그룹 추가',
	'GROUP_DELETE':					'그룹 삭제',
	'GROUP_UPDATE':					'그룹 수정',
	'POLICY_ADD':					'정책 추가',
	'POLICY_EQUIP_DELETE':			'정책 해제',
	'POLICY_EQUIP_UPDATE':			'정책 배정',
	'USER_ADD':						'사용자 정보 추가',
	'USER_DELETE':					'사용자 정보 삭제',
	'USER_UPDATE':					'사용자 정보 수정',
	'SITECONFIG_UPDATE':			'사이트 설정 수정',
	'AUTHCONFIG_UPDATE':			'메뉴 권한 설정 수정',
	'AVPATTERN_ADD':				'멀웨어 패턴 배포(agt)',							
	'AVPATTERN_UPDATE':				'멀웨어 패턴 업데이트(svr)',						
}


var _DIALOG_HTML = {
	'DASHBOARD_CHART_CREATE' : {
		'url': './page/dialog/dashboard_chart_dialog.html',
		'id': 'dashboardChartAddDialog'
	},
	'DASHBOARD_CHART_CONFIGURATION' : {
		'url': './page/dialog/dashboard_chart_conf_dialog.html',
		'id': 'dashboardChartConfigurationDialog'
	},
	'DASHBOARD_TAB_EDIT' : {
		'url': './page/dialog/dashboard_tab_edit_dialog.html',
		'id': 'dashboardTabEditDialog'
	},
	'DASHBOARD_PUBLIC' : {
		'url': './page/dialog/dashboard_public_dialog.html',
		'id': 'dashboardPublicDialog'
	},
	'DASHBOARD_PUBLIC_SAVE' : {
		'url': './page/dialog/dashboard_public_save_dialog.html',
		'id': 'dashboardPublicSaveDialog'
	},
	'DASHBOARD_CHART_FIREWALL_EVENT' : {
		'url': './page/dialog/dashboard_firewall_event_dialog.html',
		'id': 'dashboardFirewallEventDialog'
	},
	'DASHBOARD_CHART_IPS_EVENT' : {
		'url': './page/dialog/dashboard_ips_event_dialog.html',
		'id': 'dashboardIPSEventDialog'
	},
	'DASHBOARD_CHART_AV_EVENT' : {
		'url': './page/dialog/dashboard_av_event_dialog.html',
		'id': 'dashboardAVEventDialog'
	},
	'DASHBOARD_CHART_MALWARE_EVENT' : {
		'url': './page/dialog/dashboard_malware_event_dialog.html',
		'id': 'dashboardMalwareEventDialog'
	},
	'DASHBOARD_CHART_FILEINT_EVENT' : {
		'url': './page/dialog/dashboard_fileint_event_dialog.html',
		'id': 'dashboardFileIntEventDialog'
	},
	'DASHBOARD_CHART_APPCTL_EVENT' : {
		'url': './page/dialog/dashboard_appctl_event_dialog.html',
		'id': 'dashboardAppCtlEventDialog'
	},
	'DASHBOARD_CHART_PAMACL_EVENT' : {
		'url': './page/dialog/dashboard_pamacl_event_dialog.html',
		'id': 'dashboardPamAclEventDialog'
	},
	'DASHBOARD_CHART_INFO' : {
		'url': './page/dialog/dashboard_info_dialog.html',
		'id': 'dashboardInfoDialog'
	},
	'DASHBOARD_PUBLIC_ADMIN' : {
		'url': './page/dialog/dashboard_admin_dialog.html',
		'id': 'dashboardAdminDialog'
	},
	'ALERTLIST_FIREWALL_EVENT' : {
		'url': './page/dialog/alertlist_firewall_event_dialog.html',
		'id': 'alertListEventDialog'
	},
}
