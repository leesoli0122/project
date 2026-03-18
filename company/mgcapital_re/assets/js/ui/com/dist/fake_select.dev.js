"use strict";

$(document).ready(function () {
  /*---------------------------------------------
      ready, load
  ---------------------------------------------*/
  $(window).on('load', function () {
    fnPreload();
  });
  /*---------------------------------------------
      preload, init
  ---------------------------------------------*/

  /* preload */

  function fnPreload() {
    seSelect.init();
  }
  /*---------------------------------------------
      Custom Select Function #����Ʈ
  ---------------------------------------------*/

  /*
      function
  */


  var customSelect = function customSelect(element) {
    /* Funtion Define */
    var fnName = '[data-stove="select"]',
        $this = $(element).closest(fnName),
        $select = $this.find('select'),
        $stage = $('.contentWrap');
    /* Class Define */

    var onClass = 'on',
        dimClass = 'stove-dim',
        optionLayerClass = 'stove-option-layer',
        optionLayerScrollClass = 'stove-option-scroll',
        optionLayerCloseClass = 'stove-btn-close',
        optionTitleClass = 'stove-options-title',
        optionListClass = 'stove-options',
        optionClass = 'stove-option';
    /* Extend Define */

    var nowStatus = $this.attr('data-status'),
        statusDisabled = $select.attr('disabled'),
        statusReadonly = $select.attr('readonly'),
        uiCase = $this.attr('data-uicase'),
        optionLength = $select.children('option').length;
    /* Reset */

    if (statusDisabled == 'disabled' || statusReadonly == 'readonly') return;
    $(fnName).find('.' + dimClass + ', .' + optionLayerClass).remove();
    /* Option Init */

    $select.before('<div class="' + dimClass + '"></div>');
    $select.after('<div class="' + optionLayerClass + '" role="dialog"></div>');
    var $dim = $this.find('.' + dimClass),
        $optionLayer = $this.find('.' + optionLayerClass);
    var $optionScroll = $('<div>', {
      "class": optionLayerScrollClass
    }).appendTo($optionLayer);
    var $optionList = $('<div>', {
      "class": optionListClass
    }).appendTo($optionScroll);

    for (var i = 0; i < optionLength; i++) {
      var option = $select.children('option').eq(i);

      if (option.attr('disabled') && option.attr('selected') && option.attr('hidden')) {
        if (uiCase == 'slide') {// $('<div>', {
          //     class: optionTitleClass,
          //     text: option.text(),
          //     rel: option.val()
          // }).appendTo($optionList);
        }
      } else if (option.attr('disabled')) {
        $('<button>', {
          "class": optionClass,
          text: option.text(),
          disabled: 'disabled'
        }).attr('data-value', option.val()).appendTo($optionList);
      } else if (option.attr('hidden')) {// �⺻ �ɼ�(hidden)�� ǥ������ ����
      } else {
        $('<button>', {
          "class": optionClass,
          text: option.text()
        }).attr('data-value', option.val()).appendTo($optionList);
      }
    }

    var $optionBtn = $optionList.find('button'); // var $closeBtn = $('<button>', {
    //     class: optionLayerCloseClass,
    //     title: '�ݱ�'
    // }).appendTo($optionLayer);

    var $optionTitle = $('<div>', {
      "class": optionTitleClass,
      text: $this.find('.e-hidden-title').text()
    }).prependTo($optionLayer);
    setTimeout(function () {
      $optionBtn.each(function () {
        var thisRel = $(this).attr('data-value'),
            thisValue = $select.val();

        if (thisRel == thisValue) {
          $(this).addClass(onClass);
          $(this).attr('title', '���õ�');
        }
      });
    }, 0);
    /* Common Function */

    function open() {
      $optionLayer.addClass('va-' + uiCase);

      if (uiCase == 'slide') {
        setTimeout(function () {
          $dim.addClass(onClass);
          $optionLayer.addClass(onClass); // $stage.css({ 'overflow': 'hidden' });

          if (window.innnerWidth > 768) {
            $stage.css({
              'ocerflow': 'hidden'
            });
          }
        }, 0);
        setTimeout(function () {
          $optionLayer.attr('tabindex', 0).focus();
        }, 0);
        $dim.click(function (e) {
          close();
          e.stopPropagation();
        });
      }

      $this.attr('data-status', 'open');
    }

    ;

    function close() {
      if (uiCase == 'slide') {
        setTimeout(function () {
          $dim.remove();
          $optionLayer.remove(); // $stage.css({ 'overflow': '' });

          fkSelAndPopupResetOverflow(); // ��� �˾��� select layer ���� ���� Ȯ�� �� overflow �ʱ�ȭ

          console.log('PUB_COM ' + '������ �˾� ���� ��� ���� �ʱ�ȭ');
        }, 0);
      }

      setTimeout(function () {
        $this.removeAttr('data-status');
      }, 1);
      return;
    }

    ;
    /* Event Binding */

    $select.on({
      keydown: function keydown(e) {
        if (e.keyCode == 27) {
          e.stopPropagation();
          close();
        }
      }
    });
    $optionLayer.on({
      click: function click(e) {
        e.stopPropagation();
      },
      keydown: function keydown(e) {
        if (e.keyCode == 27) {
          e.stopPropagation();
          close();
        }
      }
    }); // $closeBtn.on({
    //     click: function (e) {
    //         e.stopPropagation();
    //         close();
    //     },
    //     blur: function (e) {
    //         $optionLayer.addClass(onClass).attr('tabindex', 0).focus();
    //     }
    // });

    $optionBtn.on({
      click: function click(e) {
        e.stopPropagation();
        $select.val($(this).attr('data-value')).trigger('change');
        e.preventDefault(); //select ���� �� �⺻ �� ���� x

        close();
        var $fakeSlt = $this.closest('.se-select').find('.btn-fake-slt'),
            $fakeSltVal = $fakeSlt.find('.value');
        var sltVal = $(this).text().toString();
        $fakeSlt.focus();
        $fakeSlt.addClass('selected');
        $fakeSltVal.text(sltVal);
      }
    });
    /* Init */

    if (nowStatus == 'open') {
      close();
    } else {
      open();
    }
  };
  /*
      event
  */


  $(document).on('click', '.se-select .btn-fake-slt', function () {
    if ($(this).siblings('select').prop('disabled')) return;
    customSelect($(this).closest('.se-select').find('select'));
  });
  /*---------------------------------------------
      select #����Ʈ
  ---------------------------------------------*/

  /*
      function
  */

  var seSelect = function () {
    return {
      init: function init() {
        // �ʱ�ȭ
        $('.se-select').each(function () {
          if ($(this).attr('data-stove') == 'select') {
            // Ŀ���Ҽ���Ʈ
            if ($(this).find('.btn-fake-slt').length != 0) return;
            $(this).append('<button type="button" class="se-btn btn-fake-slt"><span class="placeholder"></span><span class="value"></span></button>');
            var $select = $(this).find('select'),
                $fakeSlt = $(this).find('.btn-fake-slt'),
                $fakeSltPlaceholder = $fakeSlt.find('.placeholder'),
                $fakeSltVal = $fakeSlt.find('.value');

            if ($select.attr('disabled')) {
              $fakeSlt.addClass('disabled');
            }

            if ($select.attr('readonly')) {
              $fakeSlt.addClass('readonly');
            }

            $select.find('option').each(function () {
              if ($(this).attr('hidden')) {
                $fakeSltPlaceholder.text($(this).text());
              }

              if ($(this).attr('selected')) {
                $fakeSlt.addClass('selected');
                $fakeSltVal.text($(this).text());
              }
            });
          }
        });
      },
      // errorChk: function (_target) { // ��������
      //     var $slt = $(_target),
      //         $sltWrap = $slt.closest('.se-select'),
      //         $fakeSlt = $sltWrap.find('.btn-fake-slt');
      //     if ($slt.hasClass('has-error')) {
      //         $fakeSlt.addClass('has-error');
      //     } else {
      //         $fakeSlt.removeClass('has-error');
      //     }
      // },
      errorChk: function errorChk(_target) {
        // ���� ����
        var $slt = $(_target),
            $sltWrap = $slt.closest('.se-select'),
            $formGroup = $sltWrap.closest('.form-group'); // form-group ã��

        if ($formGroup.hasClass('user-invalid')) {
          $formGroup.addClass('user-invalid');
        } else {
          $formGroup.removeClass('user-invalid');
        }
      },

      /**
       * ���� �ڵ����� ������ ��� ���� fn
       * @param _target : .se-select �� Ư�� ID
       */
      valChk: function valChk(_target) {
        var $seSlt = $(_target);
        var $select = $seSlt.find('select'),
            $fakeSlt = $seSlt.find('.btn-fake-slt'),
            $fakeSltVal = $fakeSlt.find('.value');

        if ($select.attr('disabled') || $select.prop('disabled') == true) {
          $fakeSlt.addClass('disabled');
        } else {
          $fakeSlt.removeClass('disabled');
        }

        $select.find('option').each(function () {
          if ($(this).prop('selected') == true && $(this).prop('hidden') != true) {
            $fakeSlt.addClass('selected');
            $fakeSltVal.text($(this).text());
          }

          if ($(this).prop('selected') == true && $(this).prop('hidden') == true && $(this).index() == 0) {
            $fakeSlt.removeClass('selected');
            $fakeSltVal.text('');
          }
        });
      }
    };
  }();
  /*
      event
  */


  $(document).on('change', '[data-stove="select"] select', function () {
    seSelect.errorChk($(this));
  });
});
//# sourceMappingURL=fake_select.dev.js.map
