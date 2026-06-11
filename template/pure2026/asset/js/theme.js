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


  /* ============================================================
     Detail Page
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function() {
    // Description expand/collapse
    var desc = document.getElementById('detailDesc');
    var expandBtn = document.getElementById('detailExpandBtn');
    if (desc && expandBtn) {
      expandBtn.addEventListener('click', function() {
        var expanded = desc.classList.toggle('expanded');
        desc.textContent = expanded ? (desc.getAttribute('data-full') || desc.textContent) : (desc.getAttribute('data-short') || desc.textContent);
        expandBtn.textContent = expanded ? '收起' : '展开';
      });
    }

    // Play group tab switching
    var tabsContainer = document.querySelector('.play-group-tabs');
    if (tabsContainer) {
      tabsContainer.addEventListener('click', function(e) {
        var tab = e.target.closest('.play-group-tab');
        if (!tab) return;
        var sid = tab.getAttribute('data-sid');
        tabsContainer.querySelectorAll('.play-group-tab').forEach(function(t) {
          t.classList.toggle('active', t === tab);
        });
        document.querySelectorAll('.episode-panel').forEach(function(panel) {
          panel.classList.toggle('active', panel.getAttribute('data-sid') === sid);
        });
      });
    }

    // Episode chunk fold/unfold
    document.addEventListener('click', function(e) {
      var header = e.target.closest('.episode-chunk-header');
      if (!header) return;
      var chunk = header.parentElement;
      var list = chunk && chunk.querySelector('.episode-chunk-list');
      if (list) list.classList.toggle('collapsed');
    });

    // Share button
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.detail-share-btn');
      if (!btn) return;
      var url = window.location.href;
      var title = document.title;
      if (navigator.share && window.innerWidth < 820) {
        navigator.share({ title: title, url: url }).catch(function() {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          var orig = btn.textContent;
          btn.textContent = '已复制链接';
          setTimeout(function() { btn.textContent = orig; }, 2000);
        }).catch(function() { prompt('复制链接：', url); });
      } else {
        prompt('复制链接：', url);
      }
    });

    // Login gate — close button and background click
    document.addEventListener('click', function(e) {
      var overlay = document.getElementById('loginGateOverlay');
      if (!overlay) return;
      if (e.target.closest('.login-gate-close') || e.target === overlay) {
        overlay.classList.remove('active');
      }
    });

    // Login gate — ESC close
    document.addEventListener('keydown', function(e) {
      if (e.key !== 'Escape') return;
      var overlay = document.getElementById('loginGateOverlay');
      if (overlay) overlay.classList.remove('active');
    });
  });

  // Login gate — capture phase intercepts mac_ulog before jQuery handler
  document.addEventListener('click', function(e) {
    var favBtn = e.target.closest('.mac_ulog[data-type="2"]');
    if (!favBtn) return;
    var overlay = document.getElementById('loginGateOverlay');
    if (!overlay) return;
    if (overlay.getAttribute('data-logged-in') !== '1') {
      e.stopImmediatePropagation();
      overlay.classList.add('active');
    }
  }, true);

})();
