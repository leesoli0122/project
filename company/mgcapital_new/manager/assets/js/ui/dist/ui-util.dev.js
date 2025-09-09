"use strict";

// IE11 ȣȯ���� ���� UI ��ƿ��Ƽ
// ES6 ��� ��� �Ϲ� ��ũ��Ʈ �ε� ��� ���
(function () {
  'use strict'; // IE11 ȣȯ���� ���� ���� ��ũ��Ʈ �ε� �Լ�

  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;

    if (callback) {
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = callback;
      }
    }

    document.head.appendChild(script);
  } // ��� UI ������Ʈ ��ũ��Ʈ �ε�


  function loadUIComponents() {
    var components = ['accordion.js', 'datepicker.js', 'fake_select.js', 'input.js', 'layout.js', 'popup.js', 'tab.js', 'nav.js'];
    var basePath = '../../assets/js/ui/com/';
    var loadedCount = 0;
    console.log('UI ������Ʈ �ε� ����...');
    components.forEach(function (component) {
      var scriptPath = basePath + component;
      console.log('�ε� ��:', scriptPath);
      loadScript(scriptPath, function () {
        loadedCount++;
        console.log('�ε� �Ϸ�:', component, '(', loadedCount, '/', components.length, ')');

        if (loadedCount === components.length) {
          console.log('��� UI ������Ʈ�� �ε�Ǿ����ϴ�.');
        }
      });
    });
  } // DOM�� �غ�Ǹ� UI ������Ʈ �ε�


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUIComponents);
  } else {
    loadUIComponents();
  }

  console.log('UI Util loaded - IE11 compatible version');
})();
//# sourceMappingURL=ui-util.dev.js.map
