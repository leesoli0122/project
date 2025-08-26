
	var gridMaxWidth = 1140;
	var gridMinWidth = 0;
	
	function fn_getInitGridWidth(){
		var tblWidth = $(".tbl_area").css("width");
		tblWidth = Number(String(tblWidth).replace(/px/gi, ""));
		
		var gridWidth = tblWidth;
		return gridWidth;
	}
	
	var fn_gridUtil = function(gridId, dataStr, options){
		
		var jsonReaderId = options.jsonReaderId;
		var optionColNames =  options.colNames;
		var optionColModels = options.colModels;
		var pagerId = "";
		var cation = options.cation;
		var defColModels = options.colModels;
		var defColModelNames = options.defColModelNames;
		var subGrid = false;
		var subGridRowExpanded = null;
		var postData = {};
		var multiselect = true;
		var afterLoadCallFn = null;
		var beforeSelectRow = null;
		var gridWidth = fn_getInitGridWidth();
		
		
		var rowNum= 10;
	
		if(typeof options.pagerId != "undefinded"){
			pagerId = options.pagerId;
		}
		
		if(typeof options.postData != "undefined"){
			postData = options.postData;
		}
		
		if(typeof options.multiselect != "undefined"){
			multiselect = options.multiselect;
		}
		
		if(typeof options.subGrid != "undefined"){
			
			subGrid = options.subGrid;
			subGridRowExpanded = options.subGridRowExpanded;
		
		}
		
		if(typeof options.afterLoadCallFn != "undefined"){
			afterLoadCallFn = options.afterLoadCallFn;
		}
		
		if(typeof options.beforeSelectRow != "undefined"){
			beforeSelectRow = options.beforeSelectRow;
		}
		
		var gridTbl = $("#"+gridId+"").jqGrid(
				{
					data : dataStr.rows,	
					datatype: "local",
					mtype :"POST",
					jsonReader: {
					    repeatitems: false,
					    id: jsonReaderId
					},
					colNames: optionColNames,
				  	colModel: optionColModels,
					sortable: false,
					hidedlg: true,
					resizeStop : function(){ 
						fn_setGridWidth(gridId);
						
					},
					postData : postData,
					multiselect: multiselect,
					multiSort : false,
					subGrid : subGrid,
					subGridRowExpanded : subGridRowExpanded,
					height:"100%",
					autowidth:false,
					shrinkToFit: false, //가로스크롤
					rownumbers: true,
					rownumWidth: 30,
					width : gridWidth,
					rowNum:rowNum,
					rowList:[10,20,30,40,50,60,70,80,90,100],
					pager: pagerId,
					caption: cation,
					viewrecords: true,
					multisearch : false,
					loadComplete : function(data){
						
						//넓이 재설정
						fn_setGridWidth(gridId);
						
						//데이터 로드 후 이벤트 
						if(afterLoadCallFn != null){
							window[afterLoadCallFn](data);
						}
						
						/*
						if ($("#"+gridId+"").getGridParam('records') === 0) {
							var emptyMsg = $.jgrid.regional[lang].defaults.emptyrecords;
							$("#"+gridId+" tbody").html("<div style='padding:6px;text-align:center;'>"+emptyMsg+"</div>");
			         
			            }*/
						
					}, beforeRequest : function(){
						
						var currentRowNum = $("#"+gridId+"").jqGrid()[0].p.rowNum;
						if(rowNum != currentRowNum){
							$.jgrid.saveRowNum($("#"+gridId+"").jqGrid());
						}
						
					}, beforeSelectRow : beforeSelectRow
				}
			
		);
		
		//윈도우 창 크기 변경 시 이벤트 
		$(window).resize(function() {
			var gridWidth = fn_getInitGridWidth();
			var gridObj = $("#"+gridId+"");
	    	gridObj.jqGrid("setGridWidth",gridWidth, gridObj.jqGrid()[0].p.shrinkToFit);
		});
		
		$("#"+gridId+"").jqGrid('setGridParam', {ondblClickRow: function(rowid,iRow,iCol,e){
			
			var isRowNum = $("#"+gridId+"").jqGrid()[0].p.rownumbers;
			var isMultiSelect = $("#"+gridId+"").jqGrid()[0].p.multiselect;
			var checkCol = -1;
			var isPreCheck = false;
			
			if(isMultiSelect){
				
				var checkCol = isRowNum ? 1:0;
				isPreCheck = true;
			
			}
			
			if(isPreCheck){
				if(checkCol == iCol){
					return false;
				}
			}
			
			fn_customAction(rowid);
		}});
		
		
		
		
		$("#"+gridId+"").jqGrid('navGrid',"#"+pagerId+"",{
			edit:false,add:false,del:false,search:false,view:false},
			{},
			{},
			{},
			{}
		);
		
		
		if ( typeof options.setColumnAreaId != "undefined" && options.setColumnAreaId !="" ) {
			var buttonHtml = "<button type=\"button\" id=\"setColumnBtn\" class=\"btn btn-default\" aria-label=\"Left Align\">";
			buttonHtml += "<span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"> 컬럼설정</span></button>";
			
			$("#"+options.setColumnAreaId+"").append(buttonHtml);
			$("#setColumnBtn").click(function(event){
				fn_setColumnChooserModal(gridId,options);
			});
			
			
		}
		
		
		//컬럼 설정 창을 열었을 때 나타나는 modal창
		var fn_setColumnChooserModal = function(gridObjId){
			
			var startIndex = 0;
			
			var gridObj = $("#"+gridObjId+"");
			
	        if(gridObj.jqGrid()[0].p.rownumbers) startIndex++;
	        if(gridObj.jqGrid()[0].p.multiselect) startIndex++;
	        if(gridObj.jqGrid()[0].p.subGrid) startIndex++;
	        
	        var colModels = gridObj.jqGrid()[0].p.colModel;
	        
			//grid를 호출 한 util에 선언
			
			var modalHtml = "<div class=\"modal-header\">";
			modalHtml += "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>";
			modalHtml += "<h4 class=\"modal-title\">조회 컬럼 설정</h4>";
			modalHtml += "</div>";
			modalHtml += "<div class=\"modal-body\">";
			modalHtml += "<div class=\"row scroll_small_dialog\">";
			
			for(var i=startIndex;i<colModels.length;i++){
				
				modalHtml += "<div class=\"col-lg-12\"> <div class=\"input-group\">";
				
				var colModel = colModels[i];
				var colName = optionColNames[i-startIndex];
				
				var checked = "";
				
				//모델의 hidden 값이 fasle가 아니면
				if(!colModel.hidden){
					checked = "checked=\"checked\"";
				}
				
				modalHtml += "<label>";
				modalHtml += "<input type=\"checkbox\" id=\"showColumnChk\" name=\"showColumnChk\" value=\""+colModel.name+"\" "+checked+" /> ";
				modalHtml += colName;
				modalHtml += "</label></div></div>";
			}
			
			modalHtml += "</div>";
			modalHtml += "<div class=\"modal-footer\">";
			modalHtml += "<span class=\"fl\">";
			modalHtml += "<button type=\"button\" onclick=\"\" class=\"btn btn-default\" id=\"defColumnModal\" >기본설정 복원</button>";
			modalHtml += "</span>";
			modalHtml += "<button type=\"button\" class=\"btn btn-default\" id=\"closeSetColumnModal\" >닫기</button>";
			modalHtml += "<button type=\"button\" class=\"btn btn-primary\" id=\"setColumnModal\" >적용</button>";
			modalHtml += "</div>"; 
			
			$("div#smallModal").modal({keyboard:true, show:true});
			$("div#smallModalContent").empty();
			$("div#smallModalContent").append(modalHtml);
			$("div#smallModal").modal("show");
			
			$("#closeSetColumnModal").on("click",function(event){
				fn_closeSetColumn();
			});
			
			$("#setColumnModal").on("click",function(event){
				fn_setColumn(gridObjId);
			});
			
			$("#defColumnModal").on("click",function(event){
				fn_setDefColumn(gridObjId, defColModelNames, defColModels);
			});
			
			
		}
		
		var fn_closeSetColumn = function(){
			$("div#smallModalContent").empty();
			$("div#smallModal").modal("hide");
			$("#closeSetColumnModal").off("click");
		}
		
		
		//컬럼 적용
		var fn_setColumn = function (gridObjId){
			
			var gridObj = $("#"+gridObjId+"");
			
			//check box check값 탐색
			var showCols = [];
			var hideCols = [];
			
			$("input:checkbox[name='showColumnChk']").each(function(index){
				
				//check 되있으면
				if($(this).prop("checked")){
					showCols.push($(this).val());
				}else{
					hideCols.push($(this).val());
				}
				
			});
			
			//컬럼을 보여준다.
			gridObj.jqGrid("showCol", showCols);
			//컬럼을 감춘다.
			gridObj.jqGrid("hideCol", hideCols);
			
			//넓이 재설정
			fn_setGridWidth(gridObjId);
			
			//modal창 닫기
			$("div#smallModal").modal("hide");
		}

		//기본 컬럼 값으로 초기화
		var fn_setDefColumn = function(gridObjId, defColModelNames, defColModels){
			
			//그리드 object를 가져온다.
			var gridObj = $("#"+gridObjId+"");
			
			var key = window.location.pathname + ":" + gridKey + ":" + gridObj.jqGrid()[0].p.url;
			jQuery.store.del(key);
			
			var startIndex = 0;
			var width = 0;
			
			//rownumbers ture 일때
			if(gridObj.jqGrid()[0].p.rownumbers){
				startIndex++;
				width+=30;
			}
				
			//multiselect true 일때
	        if(gridObj.jqGrid()[0].p.multiselect){
	        	startIndex++;
	        	width+=35;
	        }
	        
	        //subgrid 가 있을 경우
	        if(gridObj.jqGrid()[0].p.subGrid) {
	        	startIndex++;
	        	width+=20;
	        }
	        
	        //현재 grid의 컬럼 정보를 가져온다.
	        var colModels = gridObj.jqGrid()[0].p.colModel;
	        
	    	var showCols = [];
			var hideCols = [];
			
			//기본 설정 컬럼 정보에서 show, hide 상태를 구분해서 찾아온다.
			for(var i=startIndex;i<colModels.length;i++){
				
				var colModel = colModels[i];
				var isSearch = false;
				
				for(var j=0;j<defColModelNames.length;j++){
					
					if(colModel.name == defColModelNames[j]){
						isSearch = true;
						break;
					}
					
				}
				
				if(isSearch){
					
					showCols.push(colModel.name);
				}else{
					hideCols.push(colModel.name);
				}
				
			}
			
			for(var i=0;i<defColModels.length;i++){
				
				for(var j=0;j<showCols.length;j++){
					
					if(defColModels[i].name == showCols[j]){
						
						width+=defColModels[i].width;
						break;
					}
				}
				
				gridObj.jqGrid("setColWidth", i+startIndex, defColModels[i].width);
			}
			
			//컬럼을 보여준다.
			gridObj.jqGrid("showCol", showCols);
			//컬럼을 감춘다.
			gridObj.jqGrid("hideCol", hideCols);
		
			//넓이 재설정
	
			var gridWidth = fn_getInitGridWidth();
			
			gridObj.jqGrid("setGridWidth",gridWidth, gridObj.jqGrid()[0].p.shrinkToFit);
		
			var gridOption = {};
         
			gridOption[key] = { 
					colModel: gridObj.jqGrid()[0].p.colModel.slice(startIndex)
			};
			
			jQuery.store.set(key, gridOption);
			
			//modal창 닫기
			fn_closeSetColumn();
		}
		
		function fn_setGridWidth(gridId){
			
			var startIndex = 0;
			var width = 0;
			
			var gridObj = $("#"+gridId+"");
			
	        if(gridObj.jqGrid()[0].p.rownumbers){ 
	        	startIndex++;
	        	width+=30;
	        }
	        if(gridObj.jqGrid()[0].p.multiselect){
	        	startIndex++;
	        	width+=35;
	        }
	        if(gridObj.jqGrid()[0].p.subGrid){ 
	        	startIndex++;
	        	width+=20;
	        }
	        
	        var colModels = gridObj.jqGrid()[0].p.colModel;
	        
	    	for(var i=startIndex;i<colModels.length;i++){
	    		
	    		var colModel = colModels[i];
	    		
	    		if(!colModel.hidden){
	    			width+=colModel.width;
	    		}
	    		
	    	};
	    	
			/*if(width > gridMaxWidth){
				width = gridMaxWidth;
			}
			*/
	    	
	    	var gridWidth = fn_getInitGridWidth();
			
	    	gridObj.jqGrid("setGridWidth",gridWidth, gridObj.jqGrid()[0].p.shrinkToFit);
		}
		
	
		
		return gridTbl;
	}
	

	function fn_initSearch(gridId){
		fn_initSearchPannel();
		$("#"+gridId+"").setGridParam({
			page : 1,
			postData : {
				searchTerm : "",
				filter : ""
			}
		}).trigger("reloadGrid");
	}
	