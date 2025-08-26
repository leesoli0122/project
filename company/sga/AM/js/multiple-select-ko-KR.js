(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = global || self, factory(global.jQuery));
}(this, function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  /**
   * Multiple Select en-US translation
   * Author: Zhixin Wen<wenzhixin2010@gmail.com>
   */

  $.fn.multipleSelect.locales['ko-KR'] = {
    formatSelectAll: function formatSelectAll() {
      return '전체 선택';
    },
    formatAllSelected: function formatAllSelected() {
      return '모두 선택';
    },
    formatCountSelected: function formatCountSelected(count, total) {
      return total + ' 개 중 '+ count + ' 개 선택 ';
    },
    formatNoMatchesFound: function formatNoMatchesFound() {
      return '검색 결과가 없습니다';
    }
  };
  $.extend($.fn.multipleSelect.defaults, $.fn.multipleSelect.locales['ko-KR']);

}));
