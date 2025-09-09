"use strict";

/**
 * �׺���̼� ���ڵ�� ������Ʈ
 * IE11 ȣȯ(ES5): let/const, forEach, arrow �Լ� ������� ����
 */
(function () {
  'use strict'; // DOM ��� ĳ��

  var lnb = document.querySelector('#menuWrap');
  if (!lnb) return; // ������

  var singleMode = lnb.getAttribute('data-accordion') === 'single';
  var CLASS_OPEN = 'acitve';
  var CLASS_TOGGLE = 'accordion';
  var SELECTOR_SUBMENU = '.submenu'; // Ű���� �̺�Ʈ ���

  var KEY_ENTER = 13;
  var KEY_SPACE = 32;
  /**
   * ��ҿ� Ŭ������ �ִ��� Ȯ��
   * @param {Element} el - Ȯ���� ���
   * @param {string} className - Ȯ���� Ŭ������
   * @returns {boolean}
   */

  function hasClass(el, className) {
    if (!el || !className) return false;
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
  }
  /**
   * ��ҿ� Ŭ���� �߰�
   * @param {Element} el - ��� ���
   * @param {string} className - �߰��� Ŭ������
   */


  function addClass(el, className) {
    if (!el || !className || hasClass(el, className)) return;
    el.className = (el.className + ' ' + className).trim();
  }
  /**
   * ��ҿ��� Ŭ���� ����
   * @param {Element} el - ��� ���
   * @param {string} className - ������ Ŭ������
   */


  function removeClass(el, className) {
    if (!el || !className || !hasClass(el, className)) return;
    el.className = el.className.replace(new RegExp('\\s*' + className + '\\s*', 'g'), ' ').trim();
  }
  /**
   * �޴� ������ �ݱ�
   * @param {Element} li - ���� li ���
   */


  function closeItem(li) {
    if (!li) return;
    var btn = li.querySelector('.' + CLASS_TOGGLE);
    var submenu = li.querySelector(SELECTOR_SUBMENU);

    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
    } // CSS �ִϸ��̼��� ���� Ŭ������ ���� (display ���� ����)


    removeClass(li, CLASS_OPEN);
  }
  /**
   * �޴� ������ ����
   * @param {Element} li - �� li ���
   */


  function openItem(li) {
    if (!li) return;
    var btn = li.querySelector('.' + CLASS_TOGGLE);
    var submenu = li.querySelector(SELECTOR_SUBMENU);

    if (btn) {
      btn.setAttribute('aria-expanded', 'true');
    } // CSS �ִϸ��̼��� ���� Ŭ������ �߰� (display ���� ����)


    addClass(li, CLASS_OPEN);
  }
  /**
   * ���� �޴� �����۵� ��� �ݱ�
   * @param {Element} currentLi - ���� li ��� (������ ���)
   */


  function closeSiblings(currentLi) {
    if (!currentLi || !currentLi.parentNode) return;
    var siblings = currentLi.parentNode.children;

    for (var i = 0; i < siblings.length; i++) {
      if (siblings[i] !== currentLi) {
        closeItem(siblings[i]);
      }
    }
  }
  /**
   * �޴� ������ ���
   * @param {Element} li - ����� li ���
   */


  function toggleItem(li) {
    if (!li) return;
    var isOpen = hasClass(li, CLASS_OPEN);

    if (isOpen) {
      closeItem(li);
    } else {
      // ���� ����� �� ���� ��ҵ� �ݱ�
      if (singleMode) {
        closeSiblings(li);
      }

      openItem(li);
    }
  }
  /**
   * Ŭ�� �̺�Ʈ �ڵ鷯
   * @param {Event} e - Ŭ�� �̺�Ʈ
   */


  function handleClick(e) {
    var target = e.target || e.srcElement; // ��ư ��ü �Ǵ� �ڽ� ���(������ ��) Ŭ�� ��� ���

    while (target && target !== lnb && !hasClass(target, CLASS_TOGGLE)) {
      target = target.parentNode;
    }

    if (!target || target === lnb) return;
    var li = target.parentNode;
    toggleItem(li);
  }
  /**
   * Ű���� �̺�Ʈ �ڵ鷯
   * @param {Event} e - Ű���� �̺�Ʈ
   */


  function handleKeydown(e) {
    var target = e.target || e.srcElement;
    if (!hasClass(target, CLASS_TOGGLE)) return;
    var key = e.keyCode || e.which; // Enter �Ǵ� Space Ű ó��

    if (key === KEY_ENTER || key === KEY_SPACE) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }

      toggleItem(target.parentNode);
    }
  } // �̺�Ʈ ������ ���


  lnb.addEventListener('click', handleClick, false);
  lnb.addEventListener('keydown', handleKeydown, false);
})();
//# sourceMappingURL=nav.dev.js.map
