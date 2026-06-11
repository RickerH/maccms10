/**
 * pure2026 Theme JavaScript
 * - Theme toggle (dark/light)
 * - Story 2.1+: skeleton fade-out
 * - Story 3.1+: search debounce, mobile nav
 */
(function() {
  'use strict';

  /* ============================================================
     Theme Toggle
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function() {
    var toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function() {
      var html = document.documentElement;
      var current = html.getAttribute('data-theme');
      var next = (current === 'light') ? 'dark' : 'light';

      html.setAttribute('data-theme', next);

      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // localStorage unavailable (private browsing etc), silent fallback
      }

      // Update toggle icon to reflect current theme state
      // --icon-sun: \e621 (huo / 太阳), --icon-moon: \e61a (qiehuan / 切换)
      var icon = toggleBtn.querySelector('.iconfont');
      if (icon) {
        icon.innerHTML = (next === 'light') ? '&#xe61a;' : '&#xe621;';
      }
    });
  });

  /* ============================================================
     Search Form
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function() {
    var searchForm = document.querySelector('.nav-search');
    if (!searchForm) return;

    var input = searchForm.querySelector('input[name="wd"]');
    if (!input) return;

    var debounceTimer = null;

    function syncState() {
      var value = input.value.replace(/^\s+|\s+$/g, '');
      searchForm.classList.toggle('has-value', value.length > 0);
      searchForm.classList.remove('is-typing');
    }

    input.addEventListener('input', function() {
      searchForm.classList.add('is-typing');
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(syncState, 300);
    });

    searchForm.addEventListener('submit', function(event) {
      input.value = input.value.replace(/^\s+|\s+$/g, '');
      if (!input.value) {
        event.preventDefault();
        input.focus();
        searchForm.classList.remove('has-value');
        return;
      }
      searchForm.classList.add('has-value');
    });

    syncState();
  });

})();
