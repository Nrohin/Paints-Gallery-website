/* ==========================================================================
   PAINT'S GALLERY — PREMIUM WEBSITE SEARCH
   Vanilla JavaScript. No dependencies. No backend. Works offline.
   Everything is namespaced under "pgSearch" to avoid collisions with the
   site's existing global scope.

   Requires: assets/js/search-data.js loaded BEFORE this file
             (defines window.pgSearchData)
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 0. GUARD — don't run twice, don't run without data                  */
  /* ------------------------------------------------------------------ */
  if (window.__pgSearchInitialized) return;
  window.__pgSearchInitialized = true;

  var pgSearchItems = Array.isArray(window.pgSearchData) ? window.pgSearchData : [];

  /* ------------------------------------------------------------------ */
  /* 1. STATE                                                            */
  /* ------------------------------------------------------------------ */
  var pgSearchState = {
    open: false,
    query: "",
    results: [], // flat list of currently rendered, clickable entries {item, el}
    activeIndex: -1,
    debounceTimer: null,
  };

  var PG_RECENT_KEY = "pgSearchRecentSearches";
  var PG_RECENT_MAX = 5;

  /* ------------------------------------------------------------------ */
  /* 2. TYPE → LABEL MAP (no icons)                                      */
  /* ------------------------------------------------------------------ */
  var pgTypeMeta = {
    page: { label: "Pages" },
    product: { label: "Products" },
    category: { label: "Categories" },
    section: { label: "Services" },
    popular: { label: "Popular Searches" },
    recent: { label: "Recent Searches" },
  };

  var PG_GROUP_ORDER = ["page", "product", "category", "section"];

  /* ------------------------------------------------------------------ */
  /* 3. URL RESOLUTION — make links work correctly regardless of         */
  /*    which page the user is currently on                              */
  /* ------------------------------------------------------------------ */
  function pgResolveUrl(url) {
    var onIndex = /(^|\/)index\.html$/.test(location.pathname) || /\/$/.test(location.pathname) || location.pathname === "";
    if (onIndex && url.indexOf("index.html#") === 0) {
      return url.replace("index.html", "");
    }
    return url;
  }

  /* ------------------------------------------------------------------ */
  /* 4. FUZZY MATCHING — Levenshtein distance + similarity scoring       */
  /* ------------------------------------------------------------------ */
  function pgLevenshtein(a, b) {
    if (a === b) return 0;
    var al = a.length,
      bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;

    var prevRow = new Array(bl + 1);
    var curRow = new Array(bl + 1);

    for (var j = 0; j <= bl; j++) prevRow[j] = j;

    for (var i = 1; i <= al; i++) {
      curRow[0] = i;
      var ca = a.charCodeAt(i - 1);
      for (j = 1; j <= bl; j++) {
        var cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
        var del = prevRow[j] + 1;
        var ins = curRow[j - 1] + 1;
        var sub = prevRow[j - 1] + cost;
        curRow[j] = Math.min(del, ins, sub);
      }
      var tmp = prevRow;
      prevRow = curRow;
      curRow = tmp;
    }
    return prevRow[bl];
  }

  // Returns 0..1 similarity (1 = identical)
  function pgSimilarity(a, b) {
    var maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    var dist = pgLevenshtein(a, b);
    return 1 - dist / maxLen;
  }

  // Best fuzzy similarity of `query` against any whitespace-delimited
  // token inside `text`, plus a whole-string comparison.
  function pgBestFuzzy(query, text) {
    var best = pgSimilarity(query, text);
    var tokens = text.split(/\s+/);
    for (var i = 0; i < tokens.length; i++) {
      var s = pgSimilarity(query, tokens[i]);
      if (s > best) best = s;
    }
    return best;
  }

  /* ------------------------------------------------------------------ */
  /* 5. SCORING / RANKING                                                 */
  /* ------------------------------------------------------------------ */
  function pgScoreItem(item, rawQuery) {
    var q = rawQuery.trim().toLowerCase();
    if (!q) return 0;

    var title = item.title.toLowerCase();
    var keywords = (item.keywords || []).map(function (k) {
      return k.toLowerCase();
    });
    var aliases = (item.aliases || []).map(function (a) {
      return a.toLowerCase();
    });

    var score = 0;
    var matchedField = null; // used later for highlight target

    // 1. Exact title match
    if (title === q) {
      score = Math.max(score, 100);
      matchedField = matchedField || "title";
    }
    // 2. Title starts with
    if (title.indexOf(q) === 0) {
      score = Math.max(score, 90);
      matchedField = matchedField || "title";
    }
    // 3. Title contains
    if (title.indexOf(q) !== -1) {
      score = Math.max(score, 75);
      matchedField = matchedField || "title";
    }
    // 4. Keyword exact / contains
    for (var i = 0; i < keywords.length; i++) {
      if (keywords[i] === q) {
        score = Math.max(score, 65);
        matchedField = matchedField || "title";
      } else if (keywords[i].indexOf(q) !== -1 || q.indexOf(keywords[i]) !== -1) {
        score = Math.max(score, 60);
        matchedField = matchedField || "title";
      }
    }
    // 5. Alias exact / contains (synonyms)
    for (var k = 0; k < aliases.length; k++) {
      if (aliases[k] === q) {
        score = Math.max(score, 58);
        matchedField = matchedField || "title";
      } else if (aliases[k].indexOf(q) !== -1 || q.indexOf(aliases[k]) !== -1) {
        score = Math.max(score, 52);
        matchedField = matchedField || "title";
      }
    }

    // 6. Fuzzy similarity (typo tolerance) — only if nothing strong matched yet
    if (score < 50) {
      var fz = pgBestFuzzy(q, title);
      for (i = 0; i < keywords.length; i++) {
        fz = Math.max(fz, pgBestFuzzy(q, keywords[i]) * 0.92);
      }
      for (k = 0; k < aliases.length; k++) {
        fz = Math.max(fz, pgBestFuzzy(q, aliases[k]) * 0.9);
      }
      // Only accept reasonably close typos (avoid noisy matches)
      if (fz >= 0.62) {
        score = Math.max(score, Math.round(fz * 48));
        matchedField = matchedField || "title";
      }
    }

    return score;
  }

  function pgSearch(rawQuery) {
    var q = rawQuery.trim();
    if (!q) return [];

    var scored = [];
    for (var i = 0; i < pgSearchItems.length; i++) {
      var s = pgScoreItem(pgSearchItems[i], q);
      if (s > 0) scored.push({ item: pgSearchItems[i], score: s });
    }

    scored.sort(function (a, b) {
      return b.score - a.score;
    });

    return scored.map(function (s) {
      return s.item;
    });
  }

  /* ------------------------------------------------------------------ */
  /* 6. HIGHLIGHTING                                                      */
  /* ------------------------------------------------------------------ */
  function pgEscapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function pgHighlight(text, rawQuery) {
    var q = rawQuery.trim();
    if (!q) return pgEscapeHtml(text);

    var lowerText = text.toLowerCase();
    var lowerQ = q.toLowerCase();
    var idx = lowerText.indexOf(lowerQ);

    if (idx === -1) {
      // No direct substring (likely a fuzzy/alias match) — return as-is
      return pgEscapeHtml(text);
    }

    var before = pgEscapeHtml(text.slice(0, idx));
    var match = pgEscapeHtml(text.slice(idx, idx + q.length));
    var after = pgEscapeHtml(text.slice(idx + q.length));
    return before + "<mark>" + match + "</mark>" + after;
  }

  /* ------------------------------------------------------------------ */
  /* 7. RECENT SEARCHES (localStorage)                                   */
  /* ------------------------------------------------------------------ */
  function pgGetRecent() {
    try {
      var raw = window.localStorage.getItem(PG_RECENT_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function pgSaveRecent(item) {
    try {
      var list = pgGetRecent();
      list = list.filter(function (r) {
        return r.url !== item.url;
      });
      list.unshift({ title: item.title, url: item.url, category: item.category, type: item.type });
      if (list.length > PG_RECENT_MAX) list = list.slice(0, PG_RECENT_MAX);
      window.localStorage.setItem(PG_RECENT_KEY, JSON.stringify(list));
    } catch (e) {
      /* localStorage unavailable — fail silently, non-critical feature */
    }
  }

  function pgRemoveRecent(url) {
    try {
      var list = pgGetRecent().filter(function (r) {
        return r.url !== url;
      });
      window.localStorage.setItem(PG_RECENT_KEY, JSON.stringify(list));
    } catch (e) {
      /* ignore */
    }
  }

  /* ------------------------------------------------------------------ */
  /* 8. DOM BUILD — trigger buttons + overlay                            */
  /* ------------------------------------------------------------------ */
  var pgEls = {};

  function pgBuildTriggers() {
    var navActions = document.querySelector(".nav-actions");
    if (!navActions) return;

    // Desktop pill
    var pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pg-search-trigger";
    pill.setAttribute("aria-label", "Search Paint's Gallery");
    pill.setAttribute("data-pg-search-open", "");
   pill.innerHTML =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
  '<span class="pg-search-trigger-text">Search</span>';

    // Mobile icon-only button
    var iconBtn = document.createElement("button");
    iconBtn.type = "button";
    iconBtn.className = "pg-search-icon-btn";
    iconBtn.setAttribute("aria-label", "Search Paint's Gallery");
    iconBtn.setAttribute("data-pg-search-open", "");
    iconBtn.innerHTML =
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

    // Insert before the primary CTA button so layout stays balanced,
    // falling back to prepend if structure differs.
    var firstChild = navActions.firstChild;
    navActions.insertBefore(iconBtn, firstChild);
    navActions.insertBefore(pill, firstChild);

    pgEls.pill = pill;
    pgEls.iconBtn = iconBtn;
  }

  function pgBuildOverlay() {
    var overlay = document.createElement("div");
    overlay.className = "pg-search-overlay";
    overlay.id = "pgSearchOverlay";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML =
      '<div class="pg-search-panel" role="dialog" aria-modal="true" aria-label="Site search">' +
      '<div class="pg-search-input-row">' +
      '<svg class="pg-search-lead-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
      '<input type="text" id="pgSearchInput" autocomplete="off" spellcheck="false" placeholder="Search paints, products, services..." aria-label="Search Paint\'s Gallery" role="combobox" aria-expanded="true" aria-controls="pgSearchResults" aria-autocomplete="list" />' +
      '<button type="button" class="pg-search-esc-btn" id="pgSearchCloseBtn" aria-label="Close search">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
      "</button>" +
      "</div>" +
      '<div class="pg-search-results" id="pgSearchResults" role="listbox" aria-label="Search results"></div>' +
      '<div class="pg-search-footer">' +
      '<span class="pg-search-hint"><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>' +
      '<span class="pg-search-hint"><kbd>&crarr;</kbd> Select</span>' +
      '<span class="pg-search-hint"><kbd>Esc</kbd> Close</span>' +
      "</div>" +
      "</div>";

    document.body.appendChild(overlay);

    pgEls.overlay = overlay;
    pgEls.panel = overlay.querySelector(".pg-search-panel");
    pgEls.input = overlay.querySelector("#pgSearchInput");
    pgEls.resultsBox = overlay.querySelector("#pgSearchResults");
    pgEls.closeBtn = overlay.querySelector("#pgSearchCloseBtn");
  }

  /* ------------------------------------------------------------------ */
  /* 9. RENDERING                                                         */
  /* ------------------------------------------------------------------ */
  function pgCreateItemRow(item, query, opts) {
    opts = opts || {};
    var meta = pgTypeMeta[item.type] || { label: "Result" };

    var row = document.createElement(opts.isRecent ? "div" : "a");
    if (!opts.isRecent) {
      row.setAttribute("href", pgResolveUrl(item.url));
    }
    row.className = "pg-search-item" + (opts.isRecent ? " pg-search-recent-row" : "");
    row.setAttribute("role", "option");
    row.setAttribute("tabindex", "-1");

    var titleHtml = query ? pgHighlight(item.title, query) : pgEscapeHtml(item.title);

    row.innerHTML =
      '<span class="pg-search-item-text">' +
      '<span class="pg-search-item-title">' + titleHtml + "</span>" +
      '<span class="pg-search-item-category">' + pgEscapeHtml(item.category || meta.label) + "</span>" +
      "</span>" +
      (opts.isRecent
        ? '<button type="button" class="pg-search-recent-remove" aria-label="Remove from recent searches"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>'
        : '<svg class="pg-search-item-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>');

    row.addEventListener("click", function (e) {
      if (opts.isRecent && e.target.closest(".pg-search-recent-remove")) {
        e.preventDefault();
        e.stopPropagation();
        pgRemoveRecent(item.url);
        pgRender();
        return;
      }
      pgSaveRecent(item);
      pgCloseOverlay();
      // For recent-search rows (div, not anchor) navigate manually.
      if (opts.isRecent) {
        window.location.href = pgResolveUrl(item.url);
      }
    });

    return row;
  }

  function pgCreateGroupLabel(text) {
    var label = document.createElement("div");
    label.className = "pg-search-group-label";
    label.setAttribute("role", "presentation");
    label.textContent = text;
    return label;
  }

  function pgRenderEmptyState() {
    var wrap = document.createElement("div");
    wrap.className = "pg-search-empty-state";
    wrap.innerHTML =
      '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
      "<p>No results for <strong>\u201c" + pgEscapeHtml(pgSearchState.query) + "\u201d</strong></p>" +
      "<p>Try “interior”, “calculator”, or “waterproofing”</p>";
    return wrap;
  }

  function pgRender() {
    var box = pgEls.resultsBox;
    box.innerHTML = "";
    pgSearchState.results = [];
    pgSearchState.activeIndex = -1;

    var query = pgSearchState.query.trim();

    if (!query) {
      // Recent searches
      var recent = pgGetRecent();
      if (recent.length) {
        box.appendChild(pgCreateGroupLabel("Recent Searches"));
        recent.forEach(function (r) {
          var row = pgCreateItemRow(r, "", { isRecent: true });
          box.appendChild(row);
          pgSearchState.results.push(row);
        });
      }

      // Popular searches
      var popular = pgSearchItems.filter(function (i) {
        return i.popular;
      });
      if (popular.length) {
        box.appendChild(pgCreateGroupLabel("Popular Searches"));
        popular.forEach(function (p) {
          var row = pgCreateItemRow(p, "");
          box.appendChild(row);
          pgSearchState.results.push(row);
        });
      }

      if (!recent.length && !popular.length) {
        box.appendChild(pgRenderEmptyState());
      }
      return;
    }

    var results = pgSearch(query);

    if (!results.length) {
      box.appendChild(pgRenderEmptyState());
      return;
    }

    // Group by type in a fixed, sensible order
    var byType = {};
    results.forEach(function (item) {
      byType[item.type] = byType[item.type] || [];
      byType[item.type].push(item);
    });

    var typesInOrder = PG_GROUP_ORDER.filter(function (t) {
      return byType[t] && byType[t].length;
    });
    // Include any unforeseen types at the end
    Object.keys(byType).forEach(function (t) {
      if (typesInOrder.indexOf(t) === -1) typesInOrder.push(t);
    });

    typesInOrder.forEach(function (type) {
      var meta = pgTypeMeta[type] || { label: "Results" };
      box.appendChild(pgCreateGroupLabel(meta.label));
      byType[type].forEach(function (item) {
        var row = pgCreateItemRow(item, query);
        box.appendChild(row);
        pgSearchState.results.push(row);
      });
    });
  }

  function pgSetActiveIndex(newIndex) {
    var rows = pgSearchState.results;
    if (!rows.length) return;

    if (pgSearchState.activeIndex >= 0 && rows[pgSearchState.activeIndex]) {
      rows[pgSearchState.activeIndex].classList.remove("pg-active-item");
      rows[pgSearchState.activeIndex].setAttribute("aria-selected", "false");
    }

    newIndex = Math.max(0, Math.min(newIndex, rows.length - 1));
    pgSearchState.activeIndex = newIndex;

    var activeRow = rows[newIndex];
    activeRow.classList.add("pg-active-item");
    activeRow.setAttribute("aria-selected", "true");
    activeRow.scrollIntoView({ block: "nearest" });
  }

  /* ------------------------------------------------------------------ */
  /* 10. OPEN / CLOSE                                                     */
  /* ------------------------------------------------------------------ */
  function pgOpenOverlay() {
    if (pgSearchState.open) return;
    pgSearchState.open = true;
    pgEls.overlay.classList.add("pg-active");
    pgEls.overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    pgRender();
    // Auto focus (slight delay lets the open animation start smoothly)
    setTimeout(function () {
      pgEls.input.focus();
    }, 60);
  }

  function pgCloseOverlay() {
    if (!pgSearchState.open) return;
    pgSearchState.open = false;
    pgEls.overlay.classList.remove("pg-active");
    pgEls.overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    pgEls.input.value = "";
    pgSearchState.query = "";
  }

  /* ------------------------------------------------------------------ */
  /* 11. EVENT WIRING                                                     */
  /* ------------------------------------------------------------------ */
  function pgDebounce(fn, delay) {
    return function () {
      var args = arguments;
      clearTimeout(pgSearchState.debounceTimer);
      pgSearchState.debounceTimer = setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  var pgHandleInput = pgDebounce(function (value) {
    // Minimum query length check to avoid unnecessary searches
    if (value.trim().length < 2 && value.trim().length !== 0) {
      pgSearchState.query = value;
      pgRender();
      return;
    }
    pgSearchState.query = value;
    pgRender();
  }, 300);

  function pgWireEvents() {
    // Open triggers
    document.querySelectorAll("[data-pg-search-open]").forEach(function (btn) {
      btn.addEventListener("click", pgOpenOverlay);
    });

    // Close button
    pgEls.closeBtn.addEventListener("click", pgCloseOverlay);

    // Click outside panel closes overlay
    pgEls.overlay.addEventListener("mousedown", function (e) {
      if (e.target === pgEls.overlay) pgCloseOverlay();
    });

    // Typing
    pgEls.input.addEventListener("input", function (e) {
      pgHandleInput(e.target.value);
    });

    // Keyboard navigation inside overlay
    pgEls.input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        pgSetActiveIndex(pgSearchState.activeIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        pgSetActiveIndex(pgSearchState.activeIndex - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (pgSearchState.activeIndex >= 0 && pgSearchState.results[pgSearchState.activeIndex]) {
          pgSearchState.results[pgSearchState.activeIndex].click();
        } else if (pgSearchState.results.length) {
          pgSearchState.results[0].click();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        pgCloseOverlay();
      }
    });

    // Global shortcuts: Ctrl+K / Cmd+K to open, Esc to close
    document.addEventListener("keydown", function (e) {
      var isK = e.key === "k" || e.key === "K";
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        if (pgSearchState.open) {
          pgCloseOverlay();
        } else {
          pgOpenOverlay();
        }
      } else if (e.key === "Escape" && pgSearchState.open) {
        pgCloseOverlay();
      } else if (e.key === "/" && !pgSearchState.open) {
        var activeTag = document.activeElement && document.activeElement.tagName;
        if (activeTag !== "INPUT" && activeTag !== "TEXTAREA") {
          e.preventDefault();
          pgOpenOverlay();
        }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 12. INIT                                                             */
  /* ------------------------------------------------------------------ */
  function pgInit() {
    if (!pgSearchItems.length) {
      // No data file loaded — nothing to search, bail out quietly.
      return;
    }
    pgBuildTriggers();
    pgBuildOverlay();
    pgWireEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pgInit);
  } else {
    pgInit();
  }
})();