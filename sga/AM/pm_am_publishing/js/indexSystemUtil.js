
	var gridId = "gridTbl";
	var options ={ 
			defColModelNames : ["systemNm","ipAddress","systemType","encType","osType","regDt"],
			colNames : ["시스템 명","IP","시스템 구분","OS 구분","인코딩","설명","등록일"],
		    colModels : [
		         		  	    {name:"systemNm",index:"systemNm",  align:"left",width:220 ,sortable: true, search:false},
		        				{name:"ipAddress",index:"ipAddress",width:220, align:"center" ,sortable: true, search:false},
		        				{name:"systemType",index:"systemType", align:"center",width:180 ,sortable: true, search:false},
		        				{name:"osType",index:"osType", align:"center",width:180 ,sortable: true, search:false},
		        				{name:"encType",index:"encType", align:"center",width:100 ,sortable: true, search:false},
		        				{name:"description",index:"description", align:"center",width:300 ,sortable: true, search:false, hidden:true},
		        				{name:"regDt",index:"regDt", align:"left",width:180 ,sortable: true, search:false}
		        			],
		    jsonReaderId : "systemId",
		    pagerId : "navGrid",
		    caption : "시스템 관리",
		    subGrid: true, 
            subGridRowExpanded: fn_showChildGrid
	}

	$(document).ready(function(event){
	
		fn_gridUtil(gridId, list,options);
	});
	
	function fn_showChildGrid(parentRowID, parentRowKey){
		var jsonData = subList;
		var systemConnList = jsonData.systemConnList;
		var systemServiceList = jsonData.systemServiceList;
		
		var isSystemConnEmpty = systemConnList.length >0 ? false:true;
		var isSystemServiceEmpty = systemServiceList.length >0 ? false:true;
		
		var html = "";
		html += "<div class=\"fl\">";
		html += "<h4>시스템 접속 정보</h4>";
		html += "</div>";
		
		html += "<table class=\"table table-condensed\">";
		html += "<thead>";
		html += "<tr>";
		html += "<th>접속정보 명</th>";
		html += "<th>접속정보 구분</th>";
		html += "<th>접속모드</th>";
		html += "<th>접속포트</th>";
		html += "<th>도메인</th>";
		html += "<th>DB 종류</th>";
		html += "<th>접속테스트 결과</th>";
		html += "<th>접속테스트 일시</th>";
		
		html += "</tr>";
		html += "</thead>";
		html += "<tbody>";
		
		if(isSystemConnEmpty){
			
			html += "<tr>";
			html += "<td colspan=\"8\">시스템접속정보가 등록되지 않았습니다.</td>";
			html += "</tr>";
		
		}else{
			
			$(systemConnList).each(function(index){
				var jsonObj = systemConnList[index];
				
				html += "<tr>";
				html += "<td>";
				html += jsonObj.systemConnectNm;
				html += "</td>";
				
				html += "<td>";
				html += jsonObj.connectTypeDesc;
				html += "</td>";
				html += "<td>";
				html += jsonObj.connectModeDesc;
				html += "</td>";
				html += "<td>";
				html += jsonObj.port;
				html += "</td>";
				html += "<td>";
				html += jsonObj.domain;
				html += "</td>";
				html += "<td>";
				html += jsonObj.dbTypeDesc;
				html += "</td>";
				html += "<td>";
				html += jsonObj.connectResultDesc;
				html += "</td>";
				html += "<td>";
				if(jsonObj.connectDt!=null){
					html += jsonObj.connectDt;
				}
				html += "</td>";
				
				html += "</tr>";
				
			});
			
		}
		
		
		html += "</tbody>";
		html += "</table>";
		
		html += "<div class=\"fl\">";
		html += "<h4>시스템 서비스 정보</h4>";
		html += "</div>";
		
		html += "<table class=\"table table-condensed\">";
		html += "<thead>";
		html += "<tr>";
		html += "<th>서비스 명</th>";
		html += "<th>프로토콜</th>";
		html += "<th>포트</th>";
		html += "<th>도메인</th>";
		html += "<th>DB 종류</th>";
		html += "<th>등록자</th>";
		html += "</tr>";
		html += "</thead>";
		html += "<tbody>";
		
		if(isSystemServiceEmpty){
			
			html += "<tr>";
			html += "<td colspan=\"6\">시스템 서비스 정보가 등록되지 않았습니다.</td>";
			html += "</tr>";
		
		}else{
			
			$(systemServiceList).each(function(index){
				var jsonObj = systemServiceList[index];
				
				html += "<tr>";
				html += "<td>";
				html += jsonObj.systemServiceNm;
				html += "</td>";
				
				html += "<td>";
				html += jsonObj.protocol;
				html += "</td>";
				html += "<td>";
				html += jsonObj.port;
				html += "</td>";
				html += "<td>";
				if(jsonObj.domain!=null){
					html += jsonObj.domain;
				}
				html += "</td>";
				html += "<td>";
				html += jsonObj.dbType;
				html += "</td>";
				html += "<td>";
				html += jsonObj.regId;
				html += "</td>";
				
				html += "</tr>";
				
			});
			
		}
		
		html += "</tbody>";
		html += "</table>";
		
		$("#" + parentRowID).empty();
		$("#" + parentRowID).append(html);
	}
	