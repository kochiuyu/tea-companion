/* Tea Companion — localize Quarto navbar on zh pages.
 * Runs only when <html lang> starts with "zh".
 * Rewrites top-nav labels + hrefs to the same-locale tree.
 * Works under GitHub Pages (/tea-companion/) and local (_site/).
 * Matches pretty URLs (…/module-01/) and …/index.html.
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
          m3: "第三章 歷史與文化",
          m4: "第四章 情境與儀式心理",
          m5: "第五章 決策與選擇",
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
          m3: "第三章 历史与文化",
          m4: "第四章 情境与仪式心理",
          m5: "第五章 决策与选择",
          reference: "参考",
          cup: "杯量参考",
          glossary: "词汇表",
          linkages: "联结桥梁",
          bibliography: "参考文献",
          searchPlaceholder: "搜索",
        };

    function siteRoot() {
      // Ignore empty <base href> — browsers treat it as the document URL and
      // would wrongly nest the locale (…/zh-hant-hk/zh-hant-hk/…).
      var base = document.querySelector("base");
      if (base) {
        var raw = base.getAttribute("href");
        if (raw && raw.trim() && raw.trim() !== "./") {
          try {
            var u = new URL(raw, window.location.href);
            var p = u.pathname;
            // If base points inside a locale folder, strip back to site root
            p = p.replace(/\/zh-hant-hk\/.*$/, "/").replace(/\/zh-hans\/.*$/, "/");
            if (!p.endsWith("/")) p = p.replace(/\/[^/]*$/, "/");
            if (p) return p;
          } catch (e) {}
        }
      }
      var parts = window.location.pathname.split("/").filter(Boolean);
      if (parts.length && /\.html?$/.test(parts[parts.length - 1])) parts.pop();
      var idx = parts.indexOf("zh-hant-hk");
      if (idx === -1) idx = parts.indexOf("zh-hans");
      if (idx !== -1) parts = parts.slice(0, idx);
      return "/" + (parts.length ? parts.join("/") + "/" : "");
    }

    var root = siteRoot();
    function locUrl(rel) {
      return root + locale + "/" + rel.replace(/^\//, "");
    }

    // optional /index.html or trailing slash (GitHub Pages pretty URLs)
    function modRe(n) {
      return new RegExp("\\/modules\\/module-0" + n + "(?:\\/(?:index\\.html)?)?$");
    }
    var pathMap = [
      { re: modRe(1), to: "modules/module-01/index.html", labelKey: "m1" },
      { re: modRe(2), to: "modules/module-02/index.html", labelKey: "m2" },
      { re: modRe(3), to: "modules/module-03/index.html", labelKey: "m3" },
      { re: modRe(4), to: "modules/module-04/index.html", labelKey: "m4" },
      { re: modRe(5), to: "modules/module-05/index.html", labelKey: "m5" },
      { re: /\/modules(?:\/(?:index\.html)?)?$/, to: "modules/index.html", labelKey: "modulesOverview" },
      { re: /\/tea-basics(?:\.html)?$/, to: "tea-basics.html", labelKey: "teaBasics" },
      { re: /\/tea-troubleshoot(?:\.html)?$/, to: "tea-troubleshoot.html", labelKey: "teaTroubleshoot" },
      { re: /\/tea-reading-studies(?:\.html)?$/, to: "tea-reading-studies.html", labelKey: "teaReadingStudies" },
      { re: /\/cup-reference(?:\.html)?$/, to: "cup-reference.html", labelKey: "cup" },
      { re: /\/glossary(?:\.html)?$/, to: "glossary.html", labelKey: "glossary" },
      { re: /\/linkages(?:\.html)?$/, to: "linkages.html", labelKey: "linkages" },
      { re: /\/bibliography(?:\.html)?$/, to: "bibliography.html", labelKey: "bibliography" },
      // Site home: /index.html or bare site root (not …/modules/)
      { re: /\/index\.html$/, to: "index.html", labelKey: "home" },
      { re: new RegExp("^" + root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"), to: "index.html", labelKey: "home" },
    ];

    // English (or stale) link text → labelKey, when path matching is ambiguous
    var textMap = [
      { re: /^Chapters?\s*overview$/i, labelKey: "modulesOverview", to: "modules/index.html" },
      { re: /^Chapter\s*1\b/i, labelKey: "m1", to: "modules/module-01/index.html" },
      { re: /^Chapter\s*2\b/i, labelKey: "m2", to: "modules/module-02/index.html" },
      { re: /^Chapter\s*3\b/i, labelKey: "m3", to: "modules/module-03/index.html" },
      { re: /^Chapter\s*4\b/i, labelKey: "m4", to: "modules/module-04/index.html" },
      { re: /^Chapter\s*5\b/i, labelKey: "m5", to: "modules/module-05/index.html" },
      { re: /^Modules$/i, labelKey: "modulesOverview", to: "modules/index.html" },
      { re: /^Home$/i, labelKey: "home", to: "index.html" },
      { re: /^Basics$/i, labelKey: "teaBasics", to: "tea-basics.html" },
      { re: /^Tea basics$/i, labelKey: "teaBasics", to: "tea-basics.html" },
      { re: /^Kitchen troubleshoot$/i, labelKey: "teaTroubleshoot", to: "tea-troubleshoot.html" },
      { re: /^Reading a tea study$/i, labelKey: "teaReadingStudies", to: "tea-reading-studies.html" },
      { re: /^Cup reference$/i, labelKey: "cup", to: "cup-reference.html" },
      { re: /^Glossary$/i, labelKey: "glossary", to: "glossary.html" },
      { re: /^Linkages$/i, labelKey: "linkages", to: "linkages.html" },
      { re: /^Bibliography$/i, labelKey: "bibliography", to: "bibliography.html" },
    ];

    function setLinkText(a, text) {
      var span = a.querySelector(".dropdown-text, .menu-text");
      if (span) {
        span.textContent = text;
        return;
      }
      var icon = a.querySelector("i, .bi, svg");
      if (icon) {
        a.innerHTML = "";
        a.appendChild(icon);
        a.appendChild(document.createTextNode(" " + text));
      } else {
        a.textContent = text;
      }
    }

    function applyTarget(a, to, labelKey) {
      a.setAttribute("href", locUrl(to));
      if (labelKey && labels[labelKey]) setLinkText(a, labels[labelKey]);
    }

    function rewriteAnchor(a) {
      var href = a.getAttribute("href");
      if (!href || href === "#" || href.indexOf("mailto:") === 0) return;

      var drop = a.closest("li.nav-item.dropdown");
      if (drop) {
        var toggle = drop.querySelector(".nav-link.dropdown-toggle");
        if (toggle && /Language|語言|语言/.test(toggle.textContent || "")) {
          return;
        }
      }

      var abs;
      try { abs = new URL(href, window.location.href); } catch (e) { return; }
      var path = abs.pathname.replace(/\/+$/, function (m, off, s) {
        // keep single trailing slash for directory URLs; normalize // 
        return s.length > 1 ? "/" : m;
      });
      // Normalize: strip trailing slash except for root
      if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

      var matched = false;
      if (path.indexOf("/" + locale + "/") === -1) {
        for (var i = 0; i < pathMap.length; i++) {
          // test against both raw and stripped forms
          var raw = abs.pathname;
          if (pathMap[i].re.test(raw) || pathMap[i].re.test(path) || pathMap[i].re.test(path + "/")) {
            applyTarget(a, pathMap[i].to, pathMap[i].labelKey);
            matched = true;
            break;
          }
        }
      } else {
        // Already under this locale: still relabel
        for (var j = 0; j < pathMap.length; j++) {
          var raw2 = abs.pathname;
          if (pathMap[j].re.test(raw2) || pathMap[j].re.test(path) || pathMap[j].re.test(path + "/")) {
            if (pathMap[j].labelKey && labels[pathMap[j].labelKey]) {
              setLinkText(a, labels[pathMap[j].labelKey]);
            }
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        var t = (a.textContent || "").replace(/\s+/g, " ").trim();
        for (var k = 0; k < textMap.length; k++) {
          if (textMap[k].re.test(t)) {
            applyTarget(a, textMap[k].to, textMap[k].labelKey);
            break;
          }
        }
      }
    }

    document.querySelectorAll(".navbar .nav-link.dropdown-toggle").forEach(function (tog) {
      var t = (tog.textContent || "").replace(/\s+/g, " ").trim();
      if (/^Chapters?$/i.test(t) || /^Modules$/i.test(t)) setLinkText(tog, labels.modules);
      else if (/^Reference$/i.test(t)) setLinkText(tog, labels.reference);
      else if (/^Tea$/i.test(t)) setLinkText(tog, labels.teaMenu);
    });

    document.querySelectorAll(".navbar a[href]").forEach(rewriteAnchor);

    document.querySelectorAll(".navbar .nav-item > .nav-link:not(.dropdown-toggle)").forEach(function (a) {
      rewriteAnchor(a);
      var t = (a.textContent || "").replace(/\s+/g, " ").trim();
      if (/^Home$/i.test(t) || t === labels.home) {
        a.setAttribute("href", locUrl("index.html"));
        setLinkText(a, labels.home);
      }
    });

    var search = document.getElementById("quarto-search");
    if (search) {
      var input = search.querySelector("input");
      if (input) {
        input.setAttribute("placeholder", labels.searchPlaceholder);
        input.setAttribute("aria-label", labels.searchPlaceholder);
      }
    }
  });
})();
