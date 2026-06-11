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
      toggleBtn.setAttribute('aria-label', (next === 'light') ? '切换到暗色模式' : '切换到亮色模式');

      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // localStorage unavailable (private browsing etc), silent fallback
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

  /* ============================================================
     WAP Search Overlay
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function() {
    var trigger = document.querySelector('.wap-search-trigger');
    var overlay = document.getElementById('searchOverlay');
    if (!trigger || !overlay) return;

    var cancel = document.getElementById('searchOverlayCancel');
    var input = overlay.querySelector('input[name="wd"]');

    function openOverlay() {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (input) {
        setTimeout(function() { input.focus(); }, 150);
      }
    }

    function closeOverlay() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (input) input.value = '';
    }

    trigger.addEventListener('click', openOverlay);

    if (cancel) {
      cancel.addEventListener('click', closeOverlay);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeOverlay();
      }
    });
  });

})();
