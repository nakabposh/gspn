/**
 * main.js — Shared initialization for all GSPN Website Tools pages
 * Handles dropdown navigation, tab switching, active highlighting, and page setup.
 */

(function() {
  'use strict';

  // ── Tab Switching (tools.html & custom-template.html) ─────────────────────────
  var pageTabs = document.querySelectorAll('.page-tab');
  if (pageTabs.length > 0) {
    pageTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var target = this.getAttribute('data-tab');

        // Deactivate all tabs
        pageTabs.forEach(function(t) { t.classList.remove('active'); });

        // Activate clicked tab
        this.classList.add('active');

        // Hide all panes
        var panes = document.querySelectorAll('.tab-pane');
        panes.forEach(function(p) { p.classList.add('hidden'); p.classList.remove('active'); });

        // Show target pane
        var targetPane = document.getElementById('pane-' + target);
        if (targetPane) {
          targetPane.classList.remove('hidden');
          targetPane.classList.add('active');
        }
      });
    });
  }

  // ── Dropdown Navigation System ──────────────────────────────────────────────
  var dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(function(dd) {
    var btn = dd.querySelector('.nav-dropdown-btn');
    if (!btn) return;

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var wasOpen = dd.classList.contains('open');

      // Close all other dropdowns
      dropdowns.forEach(function(other) {
        if (other !== dd) {
          other.classList.remove('open');
          var otherBtn = other.querySelector('.nav-dropdown-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this one
      if (wasOpen) {
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        dd.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(function(dd) {
        dd.classList.remove('open');
        var btn = dd.querySelector('.nav-dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function(dd) {
        dd.classList.remove('open');
        var btn = dd.querySelector('.nav-dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ── Navigation Active Highlight ─────────────────────────────────────────────
  var currentPath = window.location.pathname;
  var currentPage = currentPath.split('/').pop() || 'index.html';
  if (!currentPage || currentPage === '') currentPage = 'index.html';
  if (currentPath.indexOf('/context/') !== -1) {
    currentPage = 'context/' + currentPage;
  }

  // Normalize extension if clean URLs are used (e.g. /tools -> tools.html)
  var plainPage = currentPage.replace('context/', '');
  if (plainPage && plainPage.indexOf('.') === -1) {
    plainPage = plainPage + '.html';
  }

  // Define route-to-group mappings
  var routeMap = {
    'tools': ['tools.html', 'custom-template.html'],
    'reports': ['openPending.html', 'reportMaking.html', 'masterCloser.html', 'cancellationReport.html', 'reports.html', 'closer.html', 'Closer.html'],
    'context': ['Context.html', 'formats.html', 'context/formats.html', 'context/index.html']
  };

  // 1. Highlight Top Nav links
  var topNavLinks = document.querySelectorAll('.nav-link:not(.nav-dropdown-btn)');
  topNavLinks.forEach(function(link) {
    var href = link.getAttribute('href') || '';
    var pageName = href.split('/').pop();
    if (pageName && pageName.indexOf('.') === -1) pageName = pageName + '.html';
    link.classList.remove('active');
    if (pageName === plainPage || (plainPage === 'index.html' && (pageName === 'index.html' || href === '/' || href === 'index.html' || href === './'))) {
      link.classList.add('active');
    }
  });

  // 2. Highlight Top Nav Dropdowns
  var toolsDd = document.getElementById('dropdownTools');
  var reportsDd = document.getElementById('dropdownReports');
  var contextDd = document.getElementById('dropdownContext');

  if (toolsDd && routeMap.tools.indexOf(plainPage) !== -1) {
    var b = toolsDd.querySelector('.nav-dropdown-btn');
    if (b) b.classList.add('active');
    toolsDd.classList.add('active');
  }

  if (reportsDd && routeMap.reports.indexOf(plainPage) !== -1) {
    var b = reportsDd.querySelector('.nav-dropdown-btn');
    if (b) b.classList.add('active');
    reportsDd.classList.add('active');
  }

  if (contextDd && (routeMap.context.indexOf(currentPage) !== -1 || routeMap.context.indexOf(plainPage) !== -1)) {
    var b = contextDd.querySelector('.nav-dropdown-btn');
    if (b) b.classList.add('active');
    contextDd.classList.add('active');
  }

  // 3. Highlight specific dropdown items
  var dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(function(item) {
    var href = item.getAttribute('href') || '';
    var itemPage = href.split('/').pop();
    if (itemPage && itemPage.indexOf('.') === -1) itemPage = itemPage + '.html';
    if (itemPage === plainPage || (plainPage.indexOf('formats') !== -1 && itemPage.indexOf('formats') !== -1)) {
      item.classList.add('active');
    }
  });

  // 4. Highlight Bottom Nav
  var bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  bottomNavItems.forEach(function(item) {
    var href = item.getAttribute('href') || '';
    var itemPage = href.split('/').pop();
    if (itemPage && itemPage.indexOf('.') === -1) itemPage = itemPage + '.html';
    item.classList.remove('active');

    if (itemPage === plainPage || (plainPage === 'index.html' && itemPage === 'index.html')) {
      item.classList.add('active');
    } else if (item.id === 'navMaster' && (plainPage === 'openPending.html' || plainPage === 'reportMaking.html' || plainPage === 'masterCloser.html' || plainPage === 'cancellationReport.html')) {
      item.classList.add('active');
    } else if (item.id === 'navSvcReports' && plainPage === 'reports.html') {
      item.classList.add('active');
    } else if (item.id === 'navContext' && (plainPage === 'Context.html' || plainPage === 'formats.html')) {
      item.classList.add('active');
    }
  });

})();
