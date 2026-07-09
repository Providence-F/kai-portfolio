window.PianoApp = window.PianoApp || {};

// ─── Page ↔ Key mapping (from data.js) ────────────
function getPageToNote(page) {
  const map = window.PianoApp.data && window.PianoApp.data.navMappings && window.PianoApp.data.navMappings.pageToNote;
  return map ? map[page] : null;
}

// ─── Transition routing ────────────────────────────
const transitionVariants = {
  "portfolio.html": "circle-reveal",
  "experience.html": "circle-reveal",
  "about.html": "circle-reveal",
  "index.html": "fade",
};

const transitionPairs = {
  // index ↔ sub-pages: circle-reveal
  "index.html->portfolio.html": "circle-reveal",
  "portfolio.html->index.html": "circle-reveal",
  "index.html->experience.html": "circle-reveal",
  "experience.html->index.html": "circle-reveal",
  "index.html->about.html": "circle-reveal",
  "about.html->index.html": "circle-reveal",

  // sub-page ↔ sub-page: slide-from-right
  "portfolio.html->experience.html": "slide-from-right",
  "experience.html->portfolio.html": "slide-from-right",
  "portfolio.html->about.html": "slide-from-right",
  "about.html->portfolio.html": "slide-from-right",
  "experience.html->about.html": "slide-from-right",
  "about.html->experience.html": "slide-from-right",
};

function getPageName() {
  return (window.location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0];
}

function getTransitionVariant(from, to) {
  const pairKey = `${from}->${to}`;
  return transitionPairs[pairKey] || transitionVariants[to] || "fade";
}

// ─── SPA detection ─────────────────────────────────
function isSpaMode() {
  return !!(document.getElementById('home-view') && document.getElementById('page-view'));
}

// ─── Key position helpers ──────────────────────────

function getKeyOrigin(note) {
  const keyEl = document.querySelector(`[data-note="${note}"]`);
  if (keyEl) {
    const r = keyEl.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  const origins = JSON.parse(sessionStorage.getItem('keyOrigins') || '{}');
  if (origins[note]) return origins[note];
  // Fallback: lower-center of viewport, roughly where piano keys sit
  return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.75 };
}

function cleanupTransitionLayers() {
  // Cancel any lingering Web Animations on body (fill:forwards survives bfcache)
  if (document.body.getAnimations) {
    document.body.getAnimations().forEach(a => a.cancel());
  }

  document.querySelectorAll('.circle-reveal-mask, .circle-reveal-layer, .reveal-circle-bg, .reveal-slide-bg, .exit-slide-layer').forEach(el => el.remove());
  const overlay = document.querySelector(".transition-overlay");
  if (overlay) {
    overlay.classList.remove("active", "slide-left", "scale", "fade", "curtain-wipe");
    overlay.innerHTML = "";
  }
  document.querySelectorAll(".page-content").forEach(el => {
    el.classList.remove("exit-circle", "enter-circle", "exit-slide-left", "enter-slide-right");
    el.style.removeProperty("--circle-origin");
    el.style.opacity = "";
    el.style.transform = "";
    el.style.transition = "";
    el.style.transformOrigin = "";
  });
  document.querySelectorAll(".page-header .page-title").forEach(el => {
    el.style.removeProperty("opacity");
    el.style.removeProperty("transform");
    el.style.removeProperty("transition");
    el.style.removeProperty("animation");
  });
  document.querySelectorAll(".page").forEach(p => {
    p.style.removeProperty("clip-path");
    p.style.removeProperty("transition");
  });
  document.body.style.position = "";
  document.body.style.zIndex = "";
  document.body.style.opacity = "";
  document.body.style.clipPath = "";
  document.body.style.transition = "";
}

// ─── SPA page loading ──────────────────────────────

const pageInitMap = {
  'portfolio.html': 'initPortfolio',
  'about.html': 'initAbout',
  'experience.html': 'initMap',
};

function fetchPageContent(url) {
  // Timeout: if GitHub Pages is slow, fall back to full navigation after 8s
  var timeoutPromise = new Promise(function (_, reject) {
    setTimeout(function () { reject(new Error('SPA fetch timeout: ' + url)); }, 8000);
  });

  var fetchPromise = fetch(url, { credentials: 'same-origin' })
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load ' + url + ': ' + res.status);
      return res.text();
    })
    .then(function (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const titleEl = doc.querySelector('.page-header .page-title');
      const pageEl = doc.querySelector('.page.page-warm, .page.experience-ariel, .page');
      const descMeta = doc.querySelector('meta[name="description"]');

      return {
        title: titleEl ? {
          text: titleEl.textContent,
          i18nKey: titleEl.getAttribute('data-i18n'),
        } : null,
        pageClass: pageEl ? pageEl.className : 'page page-warm',
        pageHTML: pageEl ? pageEl.innerHTML : '',
        description: descMeta ? descMeta.getAttribute('content') : '',
      };
    });

  return Promise.race([fetchPromise, timeoutPromise]);
}

function setSpaPageState(url) {
  const homeView = document.getElementById('home-view');
  const pageHeader = document.getElementById('page-header');
  const pageView = document.getElementById('page-view');

  if (url === 'index.html' || url === 'index' || url === '' || url === '/') {
    document.body.classList.add('spa-home');
    document.body.classList.remove('spa-subpage');
    document.body.classList.add('landscape-page');
    if (homeView) homeView.classList.add('active');
    if (pageHeader) pageHeader.style.display = 'none';
    if (pageView) pageView.classList.remove('active');
    if (pageView) pageView.style.display = 'none';
  } else {
    document.body.classList.remove('spa-home');
    document.body.classList.add('spa-subpage');
    document.body.classList.remove('landscape-page');
    if (homeView) homeView.classList.remove('active');
    if (pageHeader) pageHeader.style.display = '';
    if (pageView) pageView.classList.add('active');
    if (pageView) pageView.style.display = '';
  }
}

function applySubPageContent(url, content) {
  const pageHeader = document.getElementById('page-header');
  const pageView = document.getElementById('page-view');
  const pageTitle = document.getElementById('page-title');

  if (!pageHeader || !pageView) return;

  // Update title
  if (pageTitle && content.title) {
    pageTitle.textContent = content.title.text;
    if (content.title.i18nKey) {
      pageTitle.setAttribute('data-i18n', content.title.i18nKey);
    } else {
      pageTitle.removeAttribute('data-i18n');
    }
  }

  // Update page class and content
  pageView.className = content.pageClass;
  pageView.innerHTML = content.pageHTML;

  // Update meta description
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && content.description) {
    descMeta.setAttribute('content', content.description);
  }

  // i18n
  if (window.PianoApp.i18n) {
    window.PianoApp.i18n.apply();
    window.PianoApp.i18n.bindToggle();
  }

  // Active nav
  updateActiveNav(url);

  // Initialize page-specific content
  const initName = pageInitMap[url];
  if (initName && typeof window.PianoApp[initName] === 'function') {
    try {
      window.PianoApp[initName]();
    } catch (e) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('[SPA] init error:', initName, e);
      }
    }
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

function updateActiveNav(url) {
  document.querySelectorAll('.page-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === url || href === './' + url) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

window.PianoApp.spaLoadPage = function (url, options) {
  options = options || {};
  return fetchPageContent(url).then(function (content) {
    applySubPageContent(url, content);
    setSpaPageState(url);
    if (!options.silent) {
      history.pushState({ spaUrl: url }, '', url);
    }
    document.title = content.title && content.title.text ? content.title.text : document.title;
  });
};

// ─── SPA navigation with transitions ───────────────

window.PianoApp.spaNavigate = function (url, variant, origin) {
  const currentPage = getPageName();
  if (currentPage === url) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (url === 'index.html') {
      goHomeInSpa(url);
    } else {
      window.PianoApp.spaLoadPage(url);
    }
    return;
  }

  sessionStorage.setItem('pianoTransition', JSON.stringify({
    from: currentPage, to: url, variant: variant, timestamp: Date.now()
  }));
  sessionStorage.removeItem('pianoTransitionPlayed');

  if (variant === 'circle-reveal') {
    if (currentPage === 'index.html') {
      // Forward: home → sub-page
      const targetKey = getPageToNote(url) || 'C3';
      const pos = origin || getKeyOrigin(targetKey);

      const origins = JSON.parse(sessionStorage.getItem('keyOrigins') || '{}');
      origins[targetKey] = pos;
      sessionStorage.setItem('keyOrigins', JSON.stringify(origins));

      // Load new page content first (hidden)
      fetchPageContent(url).then(function (content) {
        applySubPageContent(url, content);
        setSpaPageState(url);

        const homeView = document.getElementById('home-view');
        const pageHeader = document.getElementById('page-header');
        const pageView = document.getElementById('page-view');

        // Position page-view above home-view, initially transparent
        if (pageView) {
          pageView.style.opacity = '0';
          pageView.style.transition = 'opacity 0.25s ease';
        }
        if (pageHeader) {
          pageHeader.style.opacity = '0';
          pageHeader.style.transition = 'opacity 0.25s ease 0.15s';
        }

        // Create expanding mask from key origin
        const mask = document.createElement('div');
        mask.className = 'circle-reveal-mask';
        mask.style.cssText =
          'position:fixed;inset:0;z-index:100;' +
          'background:#F2ECE2;';
        document.body.appendChild(mask);

        mask.animate([
          { clipPath: 'circle(0% at ' + pos.x + 'px ' + pos.y + 'px)' },
          { clipPath: 'circle(150% at ' + pos.x + 'px ' + pos.y + 'px)' }
        ], {
          duration: 800,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        });

        setTimeout(function () {
          if (homeView) homeView.classList.remove('active');
          if (pageHeader) pageHeader.style.opacity = '1';
          if (pageView) pageView.style.opacity = '1';
          history.pushState({ spaUrl: url }, '', url);
          document.title = content.title && content.title.text ? content.title.text : document.title;
        }, 720);

        setTimeout(function () {
          mask.remove();
          cleanupTransitionLayers();
        }, 1000);
      }).catch(function (err) {
        console.error('[SPA] failed to load page:', err);
        window.location.href = url;
      });

    } else {
      // Reverse: sub-page → home
      const targetKey = getPageToNote(currentPage) || 'C3';
      const origins = JSON.parse(sessionStorage.getItem('keyOrigins') || '{}');
      const stored = origins[targetKey];
      const pos = stored || getKeyOrigin(targetKey);

      const homeView = document.getElementById('home-view');
      const pageHeader = document.getElementById('page-header');
      const pageView = document.getElementById('page-view');

      if (homeView) {
        homeView.classList.add('active');
        homeView.style.opacity = '0';
        homeView.style.transition = 'opacity 0.35s ease 0.45s';
      }

      if (pageView) {
        pageView.style.transition = 'clip-path 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease';
        pageView.style.clipPath = 'circle(200% at ' + pos.x + 'px ' + pos.y + 'px)';
      }

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (pageView) {
            pageView.style.clipPath = 'circle(0% at ' + pos.x + 'px ' + pos.y + 'px)';
            pageView.style.opacity = '0';
          }
        });
      });

      setTimeout(function () {
        setSpaPageState('index.html');
        if (homeView) homeView.style.opacity = '1';
        if (pageHeader) pageHeader.style.display = 'none';
        if (pageView) {
          pageView.classList.remove('active');
          pageView.style.display = 'none';
          pageView.style.clipPath = '';
          pageView.style.opacity = '';
          pageView.style.transition = '';
          pageView.innerHTML = '';
        }
        history.pushState({ spaUrl: 'index.html' }, '', 'index.html');
        document.title = 'Piano';
        cleanupTransitionLayers();
      }, 850);
    }

  } else if (variant === 'slide-from-right') {
    const pageContent = document.querySelector('#page-view .page-content');
    const pageTitle = document.querySelector('#page-header .page-title');

    if (pageContent) {
      pageContent.style.transition = 'transform 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.9s ease';
      pageContent.style.transform = 'translateX(-15%)';
      pageContent.style.opacity = '0.5';
    }

    if (pageTitle) {
      pageTitle.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      pageTitle.style.opacity = '0';
      pageTitle.style.transform = 'translateY(-6px)';
    }

    const bgLayer = document.createElement('div');
    bgLayer.className = 'reveal-slide-bg';
    bgLayer.style.cssText =
      'position:fixed;inset:0;z-index:89;' +
      'background:#F2ECE2;' +
      'transform:translateX(100%);' +
      'transition:transform 0.9s cubic-bezier(0.22,1,0.36,1);';
    document.body.appendChild(bgLayer);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bgLayer.style.transform = 'translateX(0)';
      });
    });

    setTimeout(function () {
      fetchPageContent(url).then(function (content) {
        applySubPageContent(url, content);
        setSpaPageState(url);

        const newPageContent = document.querySelector('#page-view .page-content');
        const newPageTitle = document.querySelector('#page-header .page-title');
        const newPageView = document.getElementById('page-view');

        if (newPageView) {
          newPageView.style.transform = 'translateX(100%)';
          newPageView.style.transition = 'transform 0.9s cubic-bezier(0.22,1,0.36,1)';
        }

        if (newPageContent) {
          newPageContent.style.opacity = '1';
          newPageContent.style.transform = 'translateX(0)';
        }

        if (newPageTitle) {
          newPageTitle.style.opacity = '0';
          newPageTitle.style.transform = 'translateY(8px)';
          newPageTitle.style.transition = 'none';
          newPageTitle.style.animation = 'none';
        }

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            if (newPageView) newPageView.style.transform = 'translateX(0)';
            if (newPageTitle) {
              newPageTitle.style.transition = 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)';
              newPageTitle.style.opacity = '1';
              newPageTitle.style.transform = 'translateY(0)';
            }
          });
        });

        history.pushState({ spaUrl: url }, '', url);
        document.title = content.title && content.title.text ? content.title.text : document.title;

        setTimeout(function () {
          bgLayer.remove();
          cleanupTransitionLayers();
        }, 950);
      }).catch(function (err) {
        console.error('[SPA] slide navigation failed:', err);
        window.location.href = url;
      });
    }, 950);

  } else {
    // fade
    const pageContent = document.querySelector('#page-view .page-content') || document.querySelector('.page-content');
    if (pageContent) {
      pageContent.style.transition = 'opacity 0.5s ease';
      pageContent.style.opacity = '0';
    }
    setTimeout(function () {
      if (url === 'index.html') {
        goHomeInSpa(url);
      } else {
        window.PianoApp.spaLoadPage(url);
      }
    }, 500);
  }
};

function goHomeInSpa(url) {
  const homeView = document.getElementById('home-view');
  const pageHeader = document.getElementById('page-header');
  const pageView = document.getElementById('page-view');

  setSpaPageState('index.html');
  if (homeView) homeView.classList.add('active');
  if (pageHeader) pageHeader.style.display = 'none';
  if (pageView) {
    pageView.className = 'page';
    pageView.classList.remove('active');
    pageView.style.display = 'none';
    pageView.innerHTML = '';
  }
  history.pushState({ spaUrl: 'index.html' }, '', url || 'index.html');
  document.title = 'Piano';
  cleanupTransitionLayers();
}

// ─── Init ──────────────────────────────────────────

window.PianoApp.initTransitions = function () {
  cleanupTransitionLayers();

  const inIframe = window.self !== window.top;
  if (inIframe) return;

  // Intercept internal links for animated exit
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return;

    // Avoid rebinding
    if (link.dataset.transitionBound === '1') return;
    link.dataset.transitionBound = '1';

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const currentPage = getPageName();
      const variant = getTransitionVariant(currentPage, href);

      // From index: resolve the corresponding key position as origin
      let origin = null;
      if (currentPage === 'index.html') {
        const targetKey = getPageToNote(href);
        if (targetKey) origin = getKeyOrigin(targetKey);
      }

      if (isSpaMode()) {
        window.PianoApp.spaNavigate(href, variant, origin);
      } else {
        window.PianoApp.navigateWithTransition(href, variant, origin);
      }
    });
  });

  // Reverse animation on arrival: only slide-from-right needs an entry animation;
  // circle-reveal plays its effect entirely on the outgoing page.
  const trans = JSON.parse(sessionStorage.getItem('pianoTransition') || '{}');
  const currentPage = getPageName();
  if (trans.to === currentPage && !sessionStorage.getItem('pianoTransitionPlayed')) {
    sessionStorage.setItem('pianoTransitionPlayed', 'true');
    if (trans.variant === 'slide-from-right') {
      playReverseSlideAnimation();
    }
    // circle-reveal and fade do not need reverse entry animations
  }

  // SPA popstate: handle browser back/forward within the same session
  if (isSpaMode()) {
    window.addEventListener('popstate', function (e) {
      const targetUrl = (e.state && e.state.spaUrl) || getPageName();
      if (targetUrl === 'index.html' || targetUrl === 'index' || targetUrl === '' || targetUrl === '/') {
        goHomeInSpa('index.html');
      } else {
        fetchPageContent(targetUrl).then(function (content) {
          applySubPageContent(targetUrl, content);
          setSpaPageState(targetUrl);
          document.title = content.title && content.title.text ? content.title.text : document.title;
        }).catch(function () {
          window.location.href = targetUrl;
        });
      }
    });
  }

  window.PianoApp.initNav();
};

// ─── Legacy full-page navigation (used in standalone pages) ──────────────

window.PianoApp.navigateWithTransition = function (url, variant, origin) {
  const currentPage = getPageName();
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[transition] navigate:', currentPage, '->', url, 'variant:', variant);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    window.location.href = url;
    return;
  }

  sessionStorage.setItem('pianoTransition', JSON.stringify({
    from: currentPage, to: url, variant: variant, timestamp: Date.now()
  }));
  sessionStorage.removeItem('pianoTransitionPlayed');

  const pageContent = document.querySelector(".page-content");

  if (variant === "circle-reveal") {
    const goingToIndex = url.includes('index.html');
    const targetKey = goingToIndex
      ? (getPageToNote(currentPage) || 'C3')
      : (getPageToNote(url) || 'C3');

    if (!goingToIndex) {
      // Forward: index → sub-page
      // Light mask expands from the corresponding key position
      let ox, oy;
      if (origin) {
        ox = origin.x; oy = origin.y;
      } else {
        const pos = getKeyOrigin(targetKey);
        ox = pos.x; oy = pos.y;
      }

      // Save key position for reverse transition
      const origins = JSON.parse(sessionStorage.getItem('keyOrigins') || '{}');
      origins[targetKey] = { x: ox, y: oy };
      sessionStorage.setItem('keyOrigins', JSON.stringify(origins));

      // Use Web Animations API for reliable clip-path animation
      const mask = document.createElement('div');
      mask.className = 'circle-reveal-mask';
      mask.style.cssText =
        'position:fixed;inset:0;z-index:100;' +
        'background:#F2ECE2;';
      document.body.appendChild(mask);

      mask.animate([
        { clipPath: 'circle(0% at ' + ox + 'px ' + oy + 'px)' },
        { clipPath: 'circle(150% at ' + ox + 'px ' + oy + 'px)' }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });

      setTimeout(() => { window.location.href = url; }, 720);

    } else {
      // Reverse: sub-page → index
      // Place an iframe of index.html beneath <body>, then shrink the entire body
      // toward the corresponding key position so the iframe is revealed underneath.
      const origins = JSON.parse(sessionStorage.getItem('keyOrigins') || '{}');
      const stored = origins[targetKey];
      let ox, oy;
      if (stored) {
        ox = stored.x; oy = stored.y;
      } else {
        const pos = getKeyOrigin(targetKey);
        ox = pos.x; oy = pos.y;
      }

      // Build iframe preview inside <html> but before <body> so it sits underneath
      const html = document.documentElement;
      const previewWrap = document.createElement('div');
      previewWrap.className = 'transition-underlay';
      previewWrap.style.cssText = 'position:fixed;inset:0;z-index:0;';

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.cssText = 'position:absolute;inset:0;border:none;width:100%;height:100%;';
      previewWrap.appendChild(iframe);
      html.insertBefore(previewWrap, html.firstChild);

      // Bring body above the iframe layer
      document.body.style.position = 'relative';
      document.body.style.zIndex = '1';

      let shrinkStarted = false;
      function startShrink() {
        if (shrinkStarted) return;
        shrinkStarted = true;
        // Shrink the *entire* body (header + content) toward the key
        document.body.animate([
          { clipPath: 'circle(200% at ' + ox + 'px ' + oy + 'px)', opacity: 1 },
          { clipPath: 'circle(0% at ' + ox + 'px ' + oy + 'px)', opacity: 0 }
        ], {
          duration: 800,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        });
        setTimeout(() => { window.location.href = url; }, 850);
      }

      iframe.addEventListener('load', function() {
        try {
          var idoc = iframe.contentDocument || iframe.contentWindow.document;
          var iwin = iframe.contentWindow;
          if (idoc && idoc.head) {
            var style = idoc.createElement('style');
            style.textContent =
              '.page-header{opacity:0!important;visibility:hidden!important}' +
              '.animate-fade-in-up{animation:none!important;opacity:1!important;transform:none!important}' +
              '.transition-overlay{display:none!important}' +
              '.piano-wrapper{opacity:1!important;transform:none!important}';
            idoc.head.appendChild(style);
          }
          if (iwin && iwin.sessionStorage) {
            iwin.sessionStorage.setItem('pianoTransitionPlayed', 'true');
          }
        } catch(e) {}
        sessionStorage.setItem('pianoTransitionPlayed', 'true');
        startShrink();
      });

      // Fallback: start shrink even if iframe hasn't loaded within 300ms
      setTimeout(startShrink, 300);
    }

  } else if (variant === "slide-from-right") {
    // Sub-page → sub-page: light warm overlay, stays below page-header (z-index 89)
    const slideFrom = 'translateX(100%)';
    const slideCurrent = 'translateX(-15%)';

    if (pageContent) {
      pageContent.style.transition = 'transform 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.9s ease';
      pageContent.style.transform = slideCurrent;
      pageContent.style.opacity = '0.5';
    }

    // Fade out the title text so it doesn't snap on the new page
    const pageTitle = document.querySelector('.page-header .page-title');
    if (pageTitle) {
      pageTitle.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      pageTitle.style.opacity = '0';
      pageTitle.style.transform = 'translateY(-6px)';
    }

    const bgLayer = document.createElement('div');
    bgLayer.className = 'reveal-slide-bg';
    bgLayer.style.cssText =
      'position:fixed;inset:0;z-index:89;' +  // below page-header (z-index: 90)
      'background:#F2ECE2;' +
      'transform:' + slideFrom + ';' +
      'transition:transform 0.9s cubic-bezier(0.22,1,0.36,1);';
    document.body.appendChild(bgLayer);

    const prefetchSelector = 'link[rel="prefetch"][href="' + url + '"]';
    if (!document.head.querySelector(prefetchSelector)) {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = url;
      document.head.appendChild(prefetch);
    }

    sessionStorage.setItem('pianoTransitionPlayed', 'true');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bgLayer.style.transform = 'translateX(0)';
      });
    });
    setTimeout(() => { window.location.href = url; }, 950);

  } else {
    // fade
    if (pageContent) {
      pageContent.style.transition = 'opacity 0.5s ease';
      pageContent.style.opacity = '0';
    }
    setTimeout(() => { window.location.href = url; }, 500);
  }
};

// ─── Reverse slide animation (arrival) ─────────────

function playReverseSlideAnimation() {
  const pageContent = document.querySelector(".page-content");
  if (pageContent) {
    pageContent.classList.add("enter-slide-left");
    setTimeout(() => pageContent.classList.remove("enter-slide-left"), 600);
  }

  // Fade in the new page title with a slight delay for a smooth handoff
  const pageTitle = document.querySelector('.page-header .page-title');
  if (pageTitle) {
    pageTitle.style.opacity = '0';
    pageTitle.style.transform = 'translateY(8px)';
    pageTitle.style.transition = 'none';
    // Override the animate-fade-in-up so we control the timing ourselves
    pageTitle.style.animation = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pageTitle.style.transition = 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        pageTitle.style.opacity = '1';
        pageTitle.style.transform = 'translateY(0)';
      });
    });
  }

  const layer = document.createElement('div');
  layer.className = 'exit-slide-layer';
  layer.style.background = '#F2ECE2';
  document.body.appendChild(layer);
  requestAnimationFrame(() => layer.classList.add('active'));
  setTimeout(() => layer.remove(), 600);
}

// ─── bfcache restore (browser back button) ───────────

window.addEventListener("pageshow", (e) => {
  if (!e.persisted) return;

  cleanupTransitionLayers();

  const trans = JSON.parse(sessionStorage.getItem('pianoTransition') || '{}');
  const currentPage = getPageName();

  if (trans.from === currentPage || trans.to === currentPage) {
    if (trans.variant === 'slide-from-right') {
      playReverseSlideAnimation();
    }
  }

  const keyboard = document.getElementById("piano-keyboard");
  if (keyboard && keyboard.children.length === 0 && window.PianoApp.initPiano) {
    window.PianoApp.initPiano();
  }
});

// ─── Sub-page nav active-state ─────────────────────

window.PianoApp.initNav = function () {
  var nav = document.querySelector('.page-nav');
  if (!nav) return;

  var currentPath = window.location.pathname;
  nav.querySelectorAll('a').forEach(function (link) {
    var href = link.getAttribute('href');
    var normalizedHref = href.replace(/^\.?\//, '');
    var normalizedCurrent = currentPath.replace(/^\/|\/$/g, '');
    if (normalizedCurrent === normalizedHref || normalizedCurrent.endsWith('/' + normalizedHref)) {
      link.setAttribute('aria-current', 'page');
    }
  });
};
