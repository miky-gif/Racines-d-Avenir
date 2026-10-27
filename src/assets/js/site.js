/* ==========================================================================
   Racines d'Avenir — interactions et animations
   Aucune dépendance. Chaque module ne s'active que si la page contient les
   éléments correspondants. Les animations sont désactivées lorsque
   l'utilisateur a demandé à réduire les mouvements.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = !reducedMotion && 'IntersectionObserver' in window;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ------------------------------------------------------------------
     Boucle de défilement partagée (une seule lecture par image)
     ------------------------------------------------------------------ */
  const scrollTasks = [];
  let ticking = false;
  function onScrollFrame(task) {
    scrollTasks.push(task);
    task();
  }
  function runScrollTasks() {
    ticking = false;
    scrollTasks.forEach(t => t());
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(runScrollTasks); }
  }, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(runScrollTasks));

  /* Observe l'entrée d'éléments dans la fenêtre (une seule fois) */
  function whenVisible(elements, callback, rootMargin) {
    if (!elements.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        callback(entry.target);
      });
    }, { rootMargin: rootMargin || '0px 0px -8% 0px' });
    elements.forEach(el => io.observe(el));
  }
  const inView = el => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  };

  /* ------------------------------------------------------------------
     En-tête : ombre, retrait au défilement, barre de progression, menu
     ------------------------------------------------------------------ */
  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;
    const progress = $('[data-scroll-progress]', header);
    const toggle = $('[data-menu-toggle]', header);
    const menu = $('#menu-mobile');
    let lastY = window.scrollY;

    onScrollFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.setProperty('--progress', max > 0 ? clamp(y / max, 0, 1) : 0);
      }
      const menuOpen = menu && !menu.hidden;
      const delta = y - lastY;
      if (menuOpen || y < 200 || header.contains(document.activeElement)) header.classList.remove('is-hidden');
      else if (delta > 6) header.classList.add('is-hidden');
      else if (delta < -6) header.classList.remove('is-hidden');
      lastY = y;
    });
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

    if (!toggle || !menu) return;
    $$('nav a, :scope > a, :scope > p', menu).forEach((el, i) => el.style.setProperty('--i', i));

    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      $('[data-icon-open]', toggle).hidden = !open;
      $('[data-icon-closed]', toggle).hidden = open;
      menu.classList.remove('is-opening', 'is-closing');
      if (open) {
        menu.hidden = false;
        if (!reducedMotion) { void menu.offsetWidth; menu.classList.add('is-opening'); }
      } else if (!reducedMotion && !menu.hidden) {
        menu.classList.add('is-closing');
      } else {
        menu.hidden = true;
      }
    };
    menu.addEventListener('animationend', e => {
      if (e.target !== menu) return;
      if (menu.classList.contains('is-closing')) menu.hidden = true;
      menu.classList.remove('is-opening', 'is-closing');
    });
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1280px)').addEventListener('change', e => {
      if (e.matches) { menu.classList.remove('is-opening', 'is-closing'); menu.hidden = true; setOpen(false); }
    });
  }

  /* ------------------------------------------------------------------
     Apparitions au défilement
     ------------------------------------------------------------------ */
  function initReveal() {
    if (!motion) return;

    // Blocs entiers
    const blocks = $$('[data-reveal]:not([data-stagger])').filter(el => !inView(el));
    blocks.forEach(el => el.classList.add('is-pending'));
    whenVisible(blocks, el => el.classList.remove('is-pending'));

    // Enfants en cascade
    const groups = $$('[data-stagger]');
    groups.forEach(g => Array.from(g.children).forEach((c, i) => c.style.setProperty('--i', Math.min(i, 12))));
    const pendingGroups = groups.filter(el => !inView(el));
    pendingGroups.forEach(el => el.classList.add('is-pending'));
    whenVisible(pendingGroups, el => { el.classList.remove('is-pending'); el.classList.add('is-in'); });

    // Photos (hors photo plein cadre du haut de page)
    const slots = $$('.img-slot').filter(el => !el.closest('.hero-media, .hs-media') && !inView(el));
    slots.forEach(el => el.classList.add('is-pending'));
    whenVisible(slots, el => el.classList.remove('is-pending'), '0px 0px -4% 0px');

    // Jauges
    const bars = $$('.bar-fill').filter(el => !inView(el));
    bars.forEach(el => el.classList.add('is-pending'));
    whenVisible(bars, el => el.classList.remove('is-pending'));

    window.addEventListener('beforeprint', () => {
      $$('.is-pending').forEach(el => el.classList.remove('is-pending'));
    });
  }

  /* Titres découpés mot à mot */
  function initSplitHeadings() {
    if (!motion) return;
    const headings = $$('main h2, footer h2').filter(h => !h.closest('[data-hero]'));
    headings.forEach(h => {
      let index = 0;
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const parts = node.textContent.split(/(\s+)/);
        if (parts.length < 2 && !parts[0].trim()) return;
        const frag = document.createDocumentFragment();
        parts.forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.style.setProperty('--wi', index++);
          w.textContent = part;
          frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      });
      h.classList.add('split');
    });
    const pending = headings.filter(h => !inView(h));
    pending.forEach(h => h.classList.add('is-pending'));
    whenVisible(pending, h => h.classList.remove('is-pending'));
  }

  /* Soulignés jaunes dessinés au trait */
  function initSwashes() {
    if (!motion) return;
    const paths = $$('svg[aria-hidden="true"] path[fill="none"][stroke="#F2B134"]');
    paths.forEach(p => { p.setAttribute('pathLength', '1'); p.classList.add('swash'); });
    const hero = paths.filter(p => p.closest('[data-hero]'));
    setTimeout(() => hero.forEach(p => p.classList.add('is-drawn')), 1100);
    whenVisible(paths.filter(p => !p.closest('[data-hero]')), p => {
      setTimeout(() => p.classList.add('is-drawn'), 350);
    });
  }

  /* Compteurs */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length || !motion) return;
    const format = n => n.toLocaleString('fr-FR').replace(/[  ]/g, ' ');
    counters.forEach(el => { el.textContent = '0'; });
    const pcts = $$('.pct').filter(el => !inView(el));
    pcts.forEach(el => el.classList.add('is-pending'));
    whenVisible(pcts, el => el.classList.remove('is-pending'));
    whenVisible(counters, el => {
      const target = Number(el.dataset.count);
      const duration = 1400 + Math.min(target, 100) * 6;
      const start = performance.now();
      const step = now => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = format(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ------------------------------------------------------------------
     Formes décoratives : flottement + parallaxe ; photo du haut de page
     ------------------------------------------------------------------ */
  function initParallax() {
    if (!motion) return;
    const leaves = $$('[aria-hidden="true"]').filter(el =>
      /border-radius:\s*(0 100% 0 100%|100% 0 100% 0)/.test(el.getAttribute('style') || '') &&
      /position:\s*absolute/.test(el.getAttribute('style') || ''));
    leaves.forEach((el, i) => {
      el.classList.add('leaf');
      el.style.setProperty('--float-d', (7 + (i * 1.7) % 5).toFixed(1) + 's');
      el.style.setProperty('--float-delay', (-(i * 2.3) % 6).toFixed(1) + 's');
      el.style.setProperty('--float-r', (i % 2 ? -1 : 1) * (5 + (i * 3) % 7) + 'deg');
      el.style.setProperty('--float-s', (1.03 + (i % 3) * 0.02).toFixed(2));
      el._speed = 0.06 + (i % 3) * 0.04;
      el._offset = 0;
    });

    const heroImages = $$('.hero-media > .img-slot, .hs-media > .img-slot');
    const hero = heroImages.length && heroImages[0].closest('[data-hero]');

    onScrollFrame(() => {
      const vh = window.innerHeight;
      leaves.forEach(el => {
        const r = el.getBoundingClientRect();
        const base = r.top + r.height / 2 - el._offset;
        if (base < -vh || base > vh * 2) return;
        el._offset = clamp((vh / 2 - base) * el._speed, -90, 90);
        el.style.setProperty('--parallax', el._offset.toFixed(1) + 'px');
      });
      if (hero && window.scrollY < hero.offsetHeight + 100) {
        const y = (window.scrollY * 0.35).toFixed(1) + 'px';
        heroImages.forEach(img => img.style.setProperty('--parallax', y));
      }
    });
  }

  /* ------------------------------------------------------------------
     Parcours : la frise se remplit au fil du défilement
     ------------------------------------------------------------------ */
  function initTimeline() {
    const lines = $$('.tl-progress');
    if (!lines.length || !motion) return;
    onScrollFrame(() => {
      const mark = window.innerHeight * 0.6;
      lines.forEach(line => {
        if (!line.offsetParent) return; // frise masquée (version desktop ou mobile)
        // Mesure hors transformation : la ligne est elle-même mise à l'échelle
        const top = line.offsetParent.getBoundingClientRect().top + line.offsetTop;
        const height = line.offsetHeight;
        if (!height) return;
        line.style.setProperty('--p', clamp((mark - top) / height, 0, 1).toFixed(4));
        $$('.tl-num', line.parentElement).forEach(num => {
          if (num.classList.contains('is-reached') || !num.offsetParent) return;
          const nr = num.getBoundingClientRect();
          if (nr.top + nr.height / 2 < mark) num.classList.add('is-reached');
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Carrousel horizontal (filières de l'accueil) : boutons + glisser
     ------------------------------------------------------------------ */
  function initRails() {
    $$('[data-rail]').forEach(rail => {
      const prev = $$(`[data-rail-prev="${rail.dataset.rail}"]`);
      const next = $$(`[data-rail-next="${rail.dataset.rail}"]`);
      const scroll = dir => rail.scrollBy({
        left: dir * Math.min(rail.clientWidth * 0.8, 720),
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
      prev.forEach(b => b.addEventListener('click', () => scroll(-1)));
      next.forEach(b => b.addEventListener('click', () => scroll(1)));

      const updateButtons = () => {
        const atStart = rail.scrollLeft <= 2;
        const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
        prev.forEach(b => { b.disabled = atStart; });
        next.forEach(b => { b.disabled = atEnd; });
      };
      rail.addEventListener('scroll', () => requestAnimationFrame(updateButtons), { passive: true });
      window.addEventListener('resize', updateButtons);
      updateButtons();

      // Glisser à la souris (le tactile défile nativement)
      let startX = 0, startScroll = 0, pressed = false, dragged = false;
      rail.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        pressed = true; dragged = false;
        startX = e.clientX; startScroll = rail.scrollLeft;
      });
      window.addEventListener('pointermove', e => {
        if (!pressed) return;
        const dx = e.clientX - startX;
        if (!dragged && Math.abs(dx) > 6) { dragged = true; rail.classList.add('is-dragging'); }
        if (dragged) { rail.scrollLeft = startScroll - dx; e.preventDefault(); }
      });
      window.addEventListener('pointerup', () => {
        if (!pressed) return;
        pressed = false;
        if (!dragged) return;
        rail.classList.remove('is-dragging');
        // Empêche le clic qui suit le glisser d'ouvrir la carte
        rail.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }, { capture: true, once: true });
        setTimeout(() => { dragged = false; }, 0);
      });
      rail.addEventListener('dragstart', e => e.preventDefault());
    });
  }

  /* ------------------------------------------------------------------
     Filtres (catalogue des formations, actualités)
     Pastilles : [data-filter="<groupe>"][data-value="…"] (valeur "all" = tout)
     Éléments  : [data-filter-item] avec data-<groupe>="…"
     ------------------------------------------------------------------ */
  const params = new URLSearchParams(window.location.search);

  function initFilters() {
    $$('[data-filters]').forEach(scope => {
      const chips = $$('[data-filter]', scope);
      const items = $$('[data-filter-item]', scope);
      const grid = items.length && items[0].parentElement;
      const state = {};
      chips.forEach(c => { if (c.getAttribute('aria-pressed') === 'true') state[c.dataset.filter] = c.dataset.value; });
      // Filtre présélectionné par l'adresse (ex. nos-formations.html?domaine=numerique)
      Object.keys(state).forEach(group => {
        const v = params.get(group);
        if (v && chips.some(c => c.dataset.filter === group && c.dataset.value === v)) state[group] = v;
      });

      const apply = animate => {
        let count = 0;
        items.forEach(item => {
          const ok = Object.entries(state).every(([group, value]) => value === 'all' || item.dataset[group] === value);
          item.hidden = !ok;
          if (ok) item.style.setProperty('--i', Math.min(count++, 12));
        });
        chips.forEach(c => c.setAttribute('aria-pressed', String(state[c.dataset.filter] === c.dataset.value)));
        const filtered = Object.values(state).some(v => v !== 'all');
        $$('[data-filter-count]', scope).forEach(el => { el.textContent = count; });
        $$('[data-filter-label]', scope).forEach(el => {
          el.textContent = count > 1 ? el.dataset.plural : el.dataset.singular;
        });
        $$('[data-filter-empty]', scope).forEach(el => { el.hidden = count > 0; });
        $$('[data-filter-reset]', scope).forEach(el => {
          if (el.hasAttribute('data-only-when-filtered')) el.hidden = !filtered;
        });
        // Rejoue l'apparition en cascade des cartes affichées
        if (animate && motion && grid && grid.hasAttribute('data-stagger')) {
          grid.classList.remove('is-pending', 'is-in');
          void grid.offsetWidth;
          grid.classList.add('is-in');
        }
      };

      chips.forEach(c => c.addEventListener('click', () => { state[c.dataset.filter] = c.dataset.value; apply(true); }));
      $$('[data-filter-reset]', scope).forEach(b => b.addEventListener('click', () => {
        Object.keys(state).forEach(k => { state[k] = 'all'; });
        apply(true);
      }));
      apply(false);
    });
  }

  /* ------------------------------------------------------------------
     Accordéon (programme d'une formation) — un seul module ouvert
     ------------------------------------------------------------------ */
  function animateHeight(el, open) {
    if (reducedMotion || !el.animate) { el.hidden = !open; return; }
    el.hidden = false;
    const h = el.scrollHeight;
    const pb = getComputedStyle(el).paddingBottom;
    const shut = { height: '0px', paddingBottom: '0px', opacity: 0 };
    const full = { height: h + 'px', paddingBottom: pb, opacity: 1 };
    el.style.overflow = 'hidden';
    const anim = el.animate(open ? [shut, full] : [full, shut],
      { duration: open ? 420 : 300, easing: 'cubic-bezier(.2,.7,.2,1)' });
    anim.onfinish = () => { el.style.overflow = ''; el.hidden = !open; };
  }

  function initAccordions() {
    $$('[data-accordion]').forEach(acc => {
      const buttons = $$('.acc', acc);
      buttons.forEach(btn => btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        buttons.forEach(b => {
          const isTarget = b === btn && open;
          const wasOpen = b.getAttribute('aria-expanded') === 'true';
          b.setAttribute('aria-expanded', String(isTarget));
          if (isTarget !== wasOpen) animateHeight($('#' + b.getAttribute('aria-controls')), isTarget);
        });
      }));
    });
  }

  /* ------------------------------------------------------------------
     Défilement automatique partagé (bannière d'accueil, témoignages) :
     pause au survol, au focus, hors de l'écran ou sur demande.
     ------------------------------------------------------------------ */
  function autoplay(root, duration, onNext, options) {
    // hoverTarget : zone dont le survol met en pause (par défaut tout le bloc)
    const hoverTarget = options && 'hoverTarget' in options ? options.hoverTarget : root;
    root.style.setProperty('--slide-duration', duration + 'ms');
    let timer = null, startedAt = 0, remaining = duration, hovering = false, visible = false, stopped = false;
    const api = {};
    api.schedule = () => {
      clearTimeout(timer); timer = null;
      if (reducedMotion || stopped || !visible || hovering) return;
      startedAt = performance.now();
      timer = setTimeout(onNext, remaining);
      root.classList.add('is-playing');
      root.classList.remove('is-paused');
    };
    api.pause = () => {
      if (timer) { clearTimeout(timer); timer = null; remaining -= performance.now() - startedAt; }
      root.classList.add('is-paused');
    };
    api.restart = () => { remaining = duration; api.schedule(); };
    api.toggle = () => { stopped = !stopped; if (stopped) api.pause(); else api.schedule(); return stopped; };

    const hold = () => { hovering = true; api.pause(); };
    const release = () => { hovering = false; api.schedule(); };
    if (hoverTarget) {
      hoverTarget.addEventListener('mouseenter', hold);
      hoverTarget.addEventListener('mouseleave', release);
    }
    // Pause au clavier seulement : un clic sur une flèche ne doit pas tout arrêter
    root.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) hold(); });
    root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) release(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) api.schedule(); else api.pause();
      }, { threshold: 0.35 }).observe(root);
    }
    return api;
  }

  const replay = el => {
    if (reducedMotion) return;
    el.classList.remove('is-entering'); void el.offsetWidth; el.classList.add('is-entering');
  };

  /* Glisser horizontal au doigt → précédent / suivant */
  function onSwipe(root, prev, next) {
    let x0 = null, y0 = 0;
    root.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { x0 = e.clientX; y0 = e.clientY; } });
    root.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    });
  }

  /* ------------------------------------------------------------------
     Bannière d'accueil (carrousel des métiers)
     ------------------------------------------------------------------ */
  function initSlider() {
    $$('[data-slider]').forEach(root => {
      const slides = $$('[data-slide-item]', root);
      const dots = $$('[data-slider-dot]', root);
      const index = $('[data-slider-index]', root);
      const pauseBtn = $('[data-slider-pause]', root);
      let current = 0;

      const show = i => {
        current = (i + slides.length) % slides.length;
        slides.forEach((s, k) => {
          const on = k === current;
          s.classList.toggle('is-active', on);
          s.setAttribute('aria-hidden', String(!on));
          $$('a, button', s).forEach(el => { el.tabIndex = on ? 0 : -1; });
        });
        dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === current)));
        if (index) index.textContent = String(current + 1).padStart(2, '0');
        player.restart();
      };
      const player = autoplay(root, 7000, () => show(current + 1), { hoverTarget: $('.hs-bar', root) });

      $('[data-slider-prev]', root).addEventListener('click', () => show(current - 1));
      $('[data-slider-next]', root).addEventListener('click', () => show(current + 1));
      dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
      if (pauseBtn) {
        if (reducedMotion) pauseBtn.hidden = true;
        pauseBtn.addEventListener('click', () => {
          const stopped = player.toggle();
          pauseBtn.setAttribute('aria-pressed', String(stopped));
          pauseBtn.setAttribute('aria-label', stopped ? 'Reprendre le défilement' : 'Mettre en pause le défilement');
          root.classList.toggle('is-stopped', stopped);
        });
      }
      root.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
      });
      onSwipe(root, () => show(current - 1), () => show(current + 1));
    });
  }

  /* ------------------------------------------------------------------
     Témoignages
     ------------------------------------------------------------------ */
  function initTestimonials() {
    $$('[data-testimonials]').forEach(root => {
      const slides = $$('[data-slide]', root);
      const photos = $$('[data-slide-photo]', root);
      const dots = $$('[data-slide-dot]', root);
      const index = $('[data-slide-index]', root);
      let current = 0;

      const show = i => {
        current = (i + slides.length) % slides.length;
        slides.forEach((s, k) => { s.hidden = k !== current; if (k === current) replay(s); });
        photos.forEach((p, k) => { p.style.display = k === current ? 'block' : 'none'; if (k === current) replay(p); });
        dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === current)));
        if (index) index.textContent = current + 1;
        player.restart();
      };
      const player = autoplay(root, 7000, () => show(current + 1));

      $('[data-slide-prev]', root).addEventListener('click', () => show(current - 1));
      $('[data-slide-next]', root).addEventListener('click', () => show(current + 1));
      dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
      onSwipe(root, () => show(current - 1), () => show(current + 1));
    });
  }

  /* ------------------------------------------------------------------
     Ancres : sur mobile, certaines cibles existent en double (frise du
     parcours) → on redirige vers la version visible (#former → #former-m)
     ------------------------------------------------------------------ */
  function initAnchors() {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id && document.getElementById(id);
      if (!el || el.offsetParent) return;
      const alt = document.getElementById(id + '-m');
      if (alt && alt.offsetParent) alt.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    };
    window.addEventListener('hashchange', go);
    if (window.location.hash) setTimeout(go, 60);
  }

  /* ------------------------------------------------------------------
     Formulaires
     Si le formulaire possède un attribut action (ex. Formspree, script
     serveur), les données y sont envoyées ; sinon la confirmation
     s'affiche directement (mode démonstration).
     ------------------------------------------------------------------ */
  function initForms() {
    $$('form[data-form]').forEach(form => {
      const card = form.closest('[data-form-card]');
      const success = card && $('[data-form-success]', card);

      // Pastilles à choix multiples → champ caché
      const multi = $$('[data-multi]', form);
      const syncMulti = () => {
        const groups = {};
        multi.forEach(b => {
          groups[b.dataset.multi] = groups[b.dataset.multi] || [];
          if (b.getAttribute('aria-pressed') === 'true') groups[b.dataset.multi].push(b.dataset.value);
        });
        Object.entries(groups).forEach(([name, values]) => { form.elements[name].value = values.join(', '); });
      };
      multi.forEach(b => b.addEventListener('click', () => {
        b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
        syncMulti();
      }));
      // Choix présélectionné par l'adresse (ex. partenaires.html?engagement=Fondation)
      multi.forEach(b => { if (params.getAll(b.dataset.multi).includes(b.dataset.value)) b.setAttribute('aria-pressed', 'true'); });
      syncMulti();

      // Champs préremplis par l'adresse (ex. contact.html?formation=couture-africaine)
      const preset = (name, value) => {
        const field = form.elements[name];
        if (field && value && Array.from(field.options || []).some(o => o.value === value)) field.value = value;
      };
      if (params.get('formation')) { preset('objet', 'pre'); preset('filiere', params.get('formation')); }
      preset('objet', params.get('objet'));

      // Champ affiché selon la valeur d'un autre (ex. filière si « Préinscription »)
      $$('[data-show-when]', form).forEach(el => {
        const [name, value] = el.dataset.showWhen.split('=');
        const field = form.elements[name];
        const update = () => {
          const show = field.value === value;
          if (show && el.hidden && !reducedMotion) el.classList.add('is-entering');
          el.hidden = !show;
        };
        field.addEventListener('change', update);
        el.hidden = field.value !== value;
      });

      const reveal = el => {
        el.hidden = false;
        if (!reducedMotion) { el.classList.remove('is-entering'); void el.offsetWidth; el.classList.add('is-entering'); }
      };

      const showSuccess = () => {
        form.hidden = true;
        if (success) {
          reveal(success);
          success.focus({ preventScroll: true });
        }
      };

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const error = $('.form-error', form);
        if (error) error.remove();
        const action = form.getAttribute('action');
        if (!action) { showSuccess(); return; }
        const submit = $('[type="submit"]', form);
        if (submit) submit.disabled = true;
        try {
          const res = await fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(res.statusText);
          showSuccess();
        } catch (err) {
          const p = document.createElement('p');
          p.className = 'form-error';
          p.setAttribute('role', 'alert');
          p.textContent = "L'envoi n'a pas abouti. Merci de réessayer ou de nous appeler au +237 6 12 34 56 78.";
          form.appendChild(p);
        } finally {
          if (submit) submit.disabled = false;
        }
      });

      if (success) {
        $$('[data-form-again]', success).forEach(b => b.addEventListener('click', () => {
          form.reset();
          multi.forEach(m => m.setAttribute('aria-pressed', String(m.hasAttribute('data-default'))));
          syncMulti();
          $$('[data-show-when]', form).forEach(el => {
            const [name, value] = el.dataset.showWhen.split('=');
            el.hidden = form.elements[name].value !== value;
          });
          success.hidden = true;
          reveal(form);
          const first = $('input, select, textarea', form);
          if (first) first.focus();
        }));
      }
    });
  }

  initHeader();
  initSplitHeadings();
  initReveal();
  initSwashes();
  initCounters();
  initParallax();
  initTimeline();
  initRails();
  initFilters();
  initAccordions();
  initSlider();
  initTestimonials();
  initAnchors();
  initForms();
})();
