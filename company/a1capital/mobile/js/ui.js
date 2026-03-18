
$(document).ready(function() {

    /** 전체동의**/
    $('.check.all').on('click',  function() {
      var termsPopID = $(this).attr("terms-all");
      /**약관동의 체크시 팝업열림 
      if ($(this).prop("checked")) {
        $("#" + termsPopID).closest('.layerpopup').show();
        
      } else {
        $("#" + termsPopID).closest('.layerpopup').hide();
      }
  **/
      if (!$(this).parents('fieldset').siblings().hasClass('etc')) {
        //약관 전체동의
        if ($('.level1 .all').prop('checked')) {
            $('.level2').find('input').prop('checked', true);
        }else {
          $('.level2').find('input').prop('checked', false);
        };
      }else{ //선택약관(상품서비스) 전체동의
        if ($('.level2 fieldset .all').prop('checked')) {
            $('.level3').find('input').prop('checked', true);
        }else {
          $('.level3').find('input').prop('checked', false);
        };
      }
  
  
    });
  
  
    /** 개별 약관**/
    $('.check').on('click', function() {
      var totalNum = $(".level2 fieldset > .check").length;
      var checkNum = $(".level2 fieldset > .check:checked").length;
  
      var dmTotalNum	= $(".level3 .check").length;
      var dmCheckNum = $(".level3 .check:checked").length;
     
      var terms_id = $(this).attr("terms-pop");
    
          /**약관동의 체크시 팝업열림 
      if (totalNum == checkNum) {
          $('.level1 .all').prop('checked', true);
      } else {
          $('.level1 .all').prop('checked', false);
      }
  **/

      if (dmCheckNum >= 1) {
          $('.level2 fieldset .all').prop('checked', true);
      } else if (dmCheckNum == 0) {
          $('.level2 fieldset .all').prop('checked', false);
      }
          /**약관동의 체크시 팝업열림 
      if ($(this).prop("checked")) {
          $("#" + terms_id).closest('.layerpopup').show();
      } else {
          $("#" + terms_id).closest('.layerpopup').hide();
      }
      **/


      if (!$(this).parent().parent('div.level3').hasClass('etc')) {
        //약관 개별동의
        if (totalNum == checkNum) {
          $('.level1 .all').prop('checked', true);
        }else{
          $('.level1 .all').prop('checked', false);
        };
        }else{
        //선택약관(상품서비스) 개별동의
        if (dmCheckNum >= 1) {
          $('.level2 fieldset .all').prop('checked', true);
        }else if(dmCheckNum == 0){
          $('.level2 fieldset .all').prop('checked', false);
        };
        agreeChek();
      };
  
      $(".layerpopup .btn.btn-primary").on("click", function() {
        var popup = $(this).closest('.layerpopup');
        var popupID = popup.attr("id");
      
        
        var termsPopID = popupID.replace("-popup", "");
      
        
        $("[terms-pop='" + termsPopID + "']").prop("checked", true);
  
        popup.hide();
      });
  
      $(".btn-layer-close").on("click", function() {
        var popup = $(this).closest('.layerpopup');
        var popupID = popup.attr("id");
        var termsPopID = popupID.replace("-popup", "");
        $("[terms-pop='" + termsPopID + "']").prop("checked", false);
  
        popup.hide();
      });
      
    });
  
  });