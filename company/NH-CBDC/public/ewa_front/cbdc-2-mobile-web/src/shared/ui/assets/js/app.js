$(window).ready(function () {
    $('body').append('<a href="pubList.html" class="pub-list-btn">퍼블</a>');
  
    $('body').append('<button type="button" class="btn goto-top-btn"><span>맨위로</span></button>');
  
    $('.ipt-label').click(function () {
      if (!$(this).closest('.ipt-form').hasClass('on-focus')) {
        $(this).closest('.ipt-form').find('input').focus();
        $(this).closest('.ipt-form').find('textarea').focus();
      }
    });
  
    $('.ipt-text').focus(function () {
      $(this).closest('.ipt-form').removeClass('on-data');
      if (!$(this).closest('.ipt-form').hasClass('btm-sheet')) {
        $(this).closest('.ipt-form').addClass('on-focus');
      }
      if ($(this).val() != '') {
        $(this).closest('.ipt-form').addClass('show-del-btn');
      }
    });
  
    $('.ipt-text').focusout(function () {
       $(this).closest(".ipt-form").removeClass("on-focus");
       $(this).closest(".ipt-form").removeClass("show-del-btn");
    });
  
    $(document).on('keyup', '.ipt-text', function () {
      if ($(this).val() != '') {
        $(this).closest('.ipt-form').addClass('show-del-btn');
      } else {
        $(this).closest('.ipt-form').removeClass('show-del-btn');
      }
    });
  
    $(document).on('click', '.ipt_reset', function () {
      $(this).closest('.ipt-form').find("input[type='text']").val('');
      $(this).closest('.ipt-form').find("input[type='number']").val('');
      $(this).closest('.ipt-form').removeClass('show-del-btn');
      $(this).closest('.ipt-form').removeClass('on-error');
    });
  
    $('.btm-sheet').click(function () {
      let btmSheetId = $(this).attr('id').split('btm-sheet-btn-')[1];
      openBtmSheet(btmSheetId);
    });
  
    $('.btm-sheet-top .close-btn').click(function () {
      closeBtmSheet();
      return false;
    });
  
    $(document).on('click', '.top-noti-msg', function () {
      $(this).removeClass('on');
    });
  
    $('.mask').click(function () {
      hideModal();
      hideAlert();
      closeBtmSheet();
    });
  
    $('.toggle-btn').click(function () {
      if ($(this).hasClass('on')) {
        $(this).removeClass('on');
      } else {
        $(this).addClass('on');
      }
    });
  
    $(document).on('click', '.goto-top-btn', function () {
      $('html, body').animate({ scrollTop: 0 }, 400);
    });
  
    $('.tab-btn').click(function () {
      $('.board-list-tab ul li').removeClass('on');
      $(this).parent('li').addClass('on');
    });
  
    $('.top-more-btn').click(function () {
      if ($('.more-menu').hasClass('on')) {
        $('.more-menu').removeClass('on');
      } else {
        $('.more-menu').addClass('on');
      }
    });
  
    $('.more-menu-btn').click(function () {
      console.log('some action!');
      $('.more-menu').removeClass('on');
    });
  
    $(document).on('click', function (e) {
      // console.log(e.target.className);
      if (e.target.className != 'more-menu-btn' && e.target.className != 'btn top-more-btn') {
        $('.more-menu').removeClass('on');
      }
  
      if (
        e.target.className != 'tooltip-inner' &&
        e.target.className != 'tooltip-cont' &&
        e.target.className != 'tooltip-cont sub' &&
        e.target.className != 'btn help-btn'
      ) {
        $('.tooltip').removeClass('on');
      }
    });
  });
  
  $(window).scroll(function () {
    if ($(window).scrollTop() > 200) {
      $('.goto-top-btn').fadeIn();
    } else {
      $('.goto-top-btn').fadeOut();
    }
  });
  
  function showModal(id) {
    // 모든 모달과 마스크를 먼저 숨김
    $('.modal').hide().removeClass('on');
    $('.mask').hide();
  
    // 선택한 모달이 full 클래스가 아닐 경우 마스크 표시
    if (!$('#' + id).hasClass('full')) {
      $('.mask').fadeIn();
    }
  
    // 선택한 모달 표시
    $('#' + id).fadeIn(100).addClass('on');
  }
  
  
  function hideModal() {
    $('.modal').removeClass('on');
    $('.mask').fadeOut();
    $('.modal').fadeOut(100);
  }
  
  function showAlert(id) {
    $('.mask').fadeIn();
    $('#' + id).fadeIn(100);
    $('#' + id).addClass('on');
  }
  
  function hideAlert() {
    $('.alert-modal').removeClass('on');
    $('.mask').fadeOut();
    $('.alert-modal').fadeOut(100);
  }
  
  function closeBtmSheet() {
    $('.btm-sheet-area').removeClass('on');
    $('.mask').fadeOut();
  }
  
  function openBtmSheet(id) {
    $('#btm-sheet-' + id).addClass('on');
    $('.mask').fadeIn();
  }
  
  // 휴대폰 정규식
  function checkTelnum(str) {
    const regExp = /^01(0|1|[6-9])[0-9]{3,4}[0-9]{4}$/;
    if (regExp.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  
  // 한글 체크
  function checkKor(str) {
    // const regExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
    // const regExp = /([^가-힣\x20])/i;
    const regExp = /^[가-힣]{2,6}$/;
    if (regExp.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  
  // 숫자 체크
  function checkNum(str) {
    const regExp = /[0-9]/g;
    if (regExp.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  
  // 영문(영어) 체크
  function checkEng(str) {
    const regExp = /[a-zA-Z]/g; // 영어
    if (regExp.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  
  // 영문+숫자만 입력 체크
  function checkEngNum(str) {
    const regExp = /[a-zA-Z0-9]/g;
    if (regExp.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  
  // 공백(스페이스 바) 체크
  function checkSpace(str) {
    if (str.search(/\s/) !== -1) {
      return true; // 스페이스가 있는 경우
    } else {
      return false; // 스페이스 없는 경우
    }
  }
  
  // 특수 문자 체크
  function checkSpecial(str) {
    const regExp = /[!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]/g;
    if (regExp.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  
  // 생년월일 체크
  function checkBirth(dateStr) {
    var year = Number(dateStr.substr(0, 4));
    var month = Number(dateStr.substr(4, 2));
    var day = Number(dateStr.substr(6, 2));
    var today = new Date();
    var yearNow = today.getFullYear();
    var monthNow = today.getMonth() + 1;
    var dateNow = today.getDate();
  
    console.log(dateStr.length <= 8);
  
    if (dateStr.length == 8) {
      if (1900 > year) {
        return false;
      } else if (month < 1 || month > 12) {
        return false;
      } else if (day < 1 || day > 31) {
        return false;
      } else if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        return false;
      } else if (month == 2) {
        var isleap = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        if (day > 29 || (day == 29 && !isleap)) {
          return false;
        } else {
          return true;
        }
      } else if (
        year > yearNow ||
        (year == yearNow && month > monthNow) ||
        (year == yearNow && month == monthNow && day >= dateNow)
      ) {
        return 'future';
      } else {
        return true;
      }
    } else {
      return 'length';
    }
  }
  
  var toastId = 0;
  
  function toastMsg(msg) {
    let hasBtm = '';
    if ($('.has-btm-btn').length > 0) {
      hasBtm = ' has-btm';
    } else {
      hasBtm = '';
    }
  
    let toast = '<div class="toast" id="toast-id-' + toastId + '">' + msg + '</div>';
  
    if ($('.toast-area').length > 0) {
      $('.toast-area').append(toast);
    } else {
      $('body').append('<div class="toast-area' + hasBtm + '">' + toast + '</div>');
    }
  
    hideToast(toastId);
    toastId++;
  }
  
  function hideToast(id) {
    setTimeout(function () {
      $('#toast-id-' + id).fadeOut();
    }, 2000);
  }
  
  function notiMsg(msg) {
    $('body').append('<div class="top-noti-msg">' + msg + '</div>');
    setTimeout(function () {
      $('.top-noti-msg').addClass('on');
      setTimeout(function () {
        $('.top-noti-msg').removeClass('on');
      }, 2000);
    }, 500);
  }
  
  function geKoreanNumber(number) {
    // const koreanUnits = ['조', '천','백','십','억','천','백','십','만', '천', '백', '십',''];
    // const unit = 10;
    const koreanUnits = ['조', '억', '만', ''];
    const unit = 10000;
    let answer = '';
    cnt = 0;
    while (number > 0) {
      const mod = number % unit;
      const modToString = mod.toString().replace(/(\d)(\d{3})/, '$1,$2');
      number = Math.floor(number / unit);
      if (parseInt(answer) > 0) {
        answer = `${modToString}${koreanUnits.pop()}${answer}`;
      } else {
        answer = `${modToString}${koreanUnits.pop()}`;
      }
      cnt++;
    }
    return answer;
  }
  