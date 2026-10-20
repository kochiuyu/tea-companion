/* Tea Companion — localize Quarto navbar on zh pages.
 * Runs only when <html lang> starts with "zh".
 * Rewrites top-nav labels + hrefs to the same-locale tree.
 * Works under GitHub Pages (/tea-companion/) and local (_site/).
 */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (!htmlLang.startsWith("zh")) return;

    var isHant = htmlLang.indexOf("hant") !== -1 || htmlLang.indexOf("hk") !== -1;
    // zh-Hans vs zh-Hant-HK
    if (htmlLang === "zh-hans" || htmlLang.indexOf("hans") !== -1) isHant = false;
    if (htmlLang.indexOf("hant") !== -1) isHant = true;

    var locale = isHant ? "zh-hant-hk" : "zh-hans";

    var labels = isHant
      ? {
          home: "首頁",
          teaMenu: "茶",
          teaBasics: "茶葉入門",
          teaTroubleshoot: "廚房排障",
          teaReadingStudies: "讀懂茶研究",
          modules: "章節",
          modulesOverview: "章節總覽",
          m1: "第一章 化學核心",
          m2: "第二章 身體、大腦與心情",
          m3: "第三章 歷史、儀式與溫暖",
          m4: "第四章 決策與選擇",
          reference: "參考",
          cup: "杯量參考",
          glossary: "詞彙表",
          linkages: "連結橋樑",
          bibliography: "參考文獻",
          searchPlaceholder: "搜尋",
        }
      : {
          home: "首页",
          teaMenu: "茶",
          teaBasics: "茶叶入门",
          teaTroubleshoot: "厨房排障",
          teaReadingStudies: "读懂茶研究",
          modules: "章节",
          modulesOverview: "章节总览",
          m1: "第一章 化学核心",
          m2: "第二章 身体、大脑与心情",
          m3: "第三章 历史、仪式与温暖",
          m4: "第四章 决策与选择",
          reference: "参考",
          cup: "杯量参考",
          glossary: "词汇表",
          linkages: "联结桥梁",
          bibliography: "参考文献",
          searchPlaceholder: "搜索",
        };

    // Detect site root (handles /tea-companion/ on GitHub Pages).
    // Prefer <base href> if present; else infer from a known EN home link in the navbar.
    function siteRoot() {
      var base = document.querySelector("base");
      if (base && base.href) {
        try {
          var u = new URL(base.href);
          return u.pathname.endsWith("/") ? u.pathname : u.pathname.replace(/\/[^/]*$/, "/");
        } catch (e) {}
      }
      // Find any navbar link to index.html at site root or locale root
      var anchors = document.querySelectorAll(".navbar a[href]");
      for (var i = 0; i < anchors.length; i++) {
        var href = anchors[i].getAttribute("href");
        if (!href) continue;
        try {
          var abs = new URL(href, window.location.href);
          var path = abs.pathname;
          // Match .../tea-companion/index.html or .../tea-companion/zh-hans/index.html
          var m = path.match(/^(.*\/)(?:zh-hant-hk\/|zh-hans\/)?(?:index\.html)?$/);
          if (m && /index\.html$/.test(path)) {
            // Strip locale prefix if present
            var root = path.replace(/zh-hant-hk\/index\.html$/, "")
                           .replace(/zh-hans\/index\.html$/, "")
                           .replace(/index\.html$/, "");
            if (root) return root;
          }
        } catch (e) {}
      }
      // Fallback: walk up from current path until we leave zh-* or hit site
      var parts = window.location.pathname.split("/").filter(Boolean);
      // Drop filename
      if (parts.length && /\.html?$/.test(parts[parts.length - 1])) parts.pop();
      // Drop locale and below
      var idx = parts.indexOf("zh-hant-hk");
      if (idx === -1) idx = parts.indexOf("zh-hans");
      if (idx !== -1) parts = parts.slice(0, idx);
      return "/" + (parts.length ? parts.join("/") + "/" : "");
    }

    var root = siteRoot();
    function locUrl(rel) {
      // rel like "index.html" or "modules/module-01/index.html"
      return root + locale + "/" + rel.replace(/^\//, "");
    }

    // Map English navbar path suffixes → locale-relative targets
    // Most-specific paths first so /modules/.../index.html is not eaten by /index.html
    var pathMap = [
      { re: /\/modules\/module-01\/index\.html$/, to: "modules/module-01/index.html", labelKey: "m1" },
      { re: /\/modules\/module-02\/index\.html$/, to: "modules/module-02/index.html", labelKey: "m2" },
      { re: /\/modules\/module-03\/index\.html$/, to: "modules/module-03/index.html", labelKey: "m3" },
      { re: /\/modules\/module-04\/index\.html$/, to: "modules/module-04/index.html", labelKey: "m4" },
      { re: /\/modules\/index\.html$/, to: "modules/index.html", labelKey: "modulesOverview" },
      { re: /\/tea-basics\.html$/, to: "tea-basics.html", labelKey: "teaBasics" },
      { re: /\/tea-troubleshoot\.html$/, to: "tea-troubleshoot.html", labelKey: "teaTroubleshoot" },
      { re: /\/tea-reading-studies\.html$/, to: "tea-reading-studies.html", labelKey: "teaReadingStudies" },
      { re: /\/cup-reference\.html$/, to: "cup-reference.html", labelKey: "cup" },
      { re: /\/glossary\.html$/, to: "glossary.html", labelKey: "glossary" },
      { re: /\/linkages\.html$/, to: "linkages.html", labelKey: "linkages" },
      { re: /\/bibliography\.html$/, to: "bibliography.html", labelKey: "bibliography" },
      // Root home only (not .../modules/.../index.html)
      { re: /\/index\.html$/, to: "index.html", labelKey: "home" },
    ];

    function rewriteAnchor(a) {
      var href = a.getAttribute("href");
      if (!href || href === "#" || href.indexOf("mailto:") === 0) return;
      // Leave Language menu home links alone (they already point at the three homes)
      var inLangMenu = a.closest("#nav-menu-language--語言") ||
                       a.closest('[id*="nav-menu-language"]') ||
                       (a.closest(".dropdown-menu") && a.closest(".nav-item") &&
                        /Language|語言|语言/.test((a.closest(".nav-item").querySelector(".nav-link") || {}).textContent || ""));
      // More reliable: if parent dropdown toggle contains "Language"
      var drop = a.closest("li.nav-item.dropdown");
      if (drop) {
        var toggle = drop.querySelector(".nav-link.dropdown-toggle");
        if (toggle && /Language|語言|语言/.test(toggle.textContent || "")) {
          return; // keep Language menu as-is
        }
      }

      var abs;
      try { abs = new URL(href, window.location.href); } catch (e) { return; }
      var path = abs.pathname;

      // Skip if already under this locale
      if (path.indexOf("/" + locale + "/") !== -1) {
        // Still relabel if needed
      } else {
        for (var i = 0; i < pathMap.length; i++) {
          if (pathMap[i].re.test(path)) {
            a.setAttribute("href", locUrl(pathMap[i].to));
            if (pathMap[i].labelKey && labels[pathMap[i].labelKey]) {
              // Only replace text nodes; keep icons
              setLinkText(a, labels[pathMap[i].labelKey]);
            }
            return;
          }
        }
      }
    }

    function setLinkText(a, text) {
      // Prefer direct text; preserve leading icons
      var icon = a.querySelector("i, .bi, svg");
      if (icon) {
        a.innerHTML = "";
        a.appendChild(icon);
        a.appendChild(document.createTextNode(" " + text));
      } else {
        a.textContent = text;
      }
    }

    // Relabel top-level dropdown toggles
    document.querySelectorAll(".navbar .nav-link.dropdown-toggle").forEach(function (tog) {
      var t = (tog.textContent || "").trim();
      if (/^Chapters?$/i.test(t) || /^Modules$/i.test(t)) setLinkText(tog, labels.modules);
      else if (/^Reference$/i.test(t)) setLinkText(tog, labels.reference);
      else if (/^Tea$/i.test(t)) setLinkText(tog, labels.teaMenu);
      // leave Language toggle
    });

    // Rewrite all navbar anchors (except Language menu)
    document.querySelectorAll(".navbar a[href]").forEach(rewriteAnchor);

    // Top-level Home / Tea basics (non-dropdown)
    document.querySelectorAll(".navbar .nav-item > .nav-link:not(.dropdown-toggle)").forEach(function (a) {
      rewriteAnchor(a);
      var t = (a.textContent || "").trim();
      if (/^Home$/i.test(t)) setLinkText(a, labels.home);
      else if (/^Tea basics$/i.test(t)) setLinkText(a, labels.teaBasics);
    });

    // Search placeholder
    var search = document.getElementById("quarto-search");
    if (search) {
      var input = search.querySelector("input");
      if (input) {
        input.setAttribute("placeholder", labels.searchPlaceholder);
        input.setAttribute("aria-label", labels.searchPlaceholder);
      }
    }

    // Document title suffix: leave as-is (site title is English project-wide);
    // page H1 already Chinese from qmd.
  });
})();
