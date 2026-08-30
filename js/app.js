(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function toast(message) {
    const el = $("[data-toast]");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("is-on"), 2800);
  }

  function resolveCompany(raw) {
    const data = window.INKED_COMPANIES || {};
    const aliases = window.INKED_ALIASES || {};
    const key = String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
    const slug = aliases[key] || (data[key] ? key : null);
    return slug ? data[slug] : null;
  }

  function slugFromQuery() {
    const params = new URLSearchParams(location.search);
    return params.get("c") || params.get("url") || "cursor";
  }

  function listHtml(items) {
    return items.map((item) => `<li>${item}</li>`).join("");
  }

  function pHtml(items) {
    return items.map((item) => `<p>${item}</p>`).join("");
  }

  function renderReport(company) {
    if (!company) {
      toast("Unknown company — showing Cursor as a sample.");
      company = window.INKED_COMPANIES.cursor;
    }

    document.title = `${company.name} — 360° investor memo · Inked`;
    try {
      if (window.INKED_SEO) window.INKED_SEO.applyReport(company);
    } catch (err) {
      console.warn("Inked SEO skipped", err);
    }
    const name = $("[data-name]");
    const liner = $("[data-liner]");
    const url = $("[data-url]");
    const cat = $("[data-category]");
    if (name) name.textContent = company.name;
    if (liner) liner.textContent = company.oneLiner;
    if (url) url.textContent = company.url;
    if (cat) cat.textContent = company.category;

    const stats = $("[data-stats]");
    if (stats) {
      stats.innerHTML = company.stats
        .map((s) => `<div class="stat"><dt>${s.k}</dt><dd>${s.v}</dd></div>`)
        .join("");
    }

    const brief = $("[data-brief]");
    if (brief) brief.innerHTML = pHtml(company.brief);

    const next = $("[data-next]");
    if (next) next.innerHTML = `<ul>${listHtml(company.nextMoves)}</ul>`;

    const capital = $("[data-capital]");
    if (capital) capital.textContent = company.capital.summary;

    const rounds = $("[data-rounds]");
    if (rounds) {
      rounds.innerHTML = `<thead><tr><th>When</th><th>Round</th><th>Reading</th></tr></thead><tbody>${company.capital.rounds
        .map((r) => `<tr><td class="mono">${r.when}</td><td>${r.what}</td><td>${r.note}</td></tr>`)
        .join("")}</tbody>`;
    }

    const position = $("[data-position]");
    const monetize = $("[data-monetize]");
    if (position) position.textContent = company.positioning;
    if (monetize) monetize.textContent = company.monetization;

    const growth = $("[data-growth]");
    if (growth) growth.innerHTML = pHtml(company.growth);

    const channels = $("[data-channels]");
    if (channels) {
      channels.innerHTML = company.channels
        .map(
          (c) => `<div>
            <div class="bar-meta"><span>${c.name}</span><span class="mono">${c.value}</span></div>
            <div class="bar" aria-hidden="true"><i style="width:${c.value}%"></i></div>
            <span style="color:var(--muted);font-size:0.82rem">${c.note}</span>
          </div>`
        )
        .join("");
    }

    const strengths = $("[data-strengths]");
    const risks = $("[data-risks]");
    if (strengths) strengths.innerHTML = listHtml(company.strengths);
    if (risks) risks.innerHTML = listHtml(company.risks);

    const questions = $("[data-questions]");
    if (questions) questions.innerHTML = listHtml(company.questions);

    const comps = $("[data-comps]");
    if (comps) {
      comps.innerHTML = `<thead><tr><th>Company</th><th>How to read them</th></tr></thead><tbody>${company.comps
        .map((c) => `<tr><td>${c.name}</td><td>${c.note}</td></tr>`)
        .join("")}</tbody>`;
    }

    const sources = $("[data-sources]");
    if (sources) {
      sources.innerHTML = `<thead><tr><th>Source</th><th>Confidence</th><th>Note</th></tr></thead><tbody>${company.sources
        .map((s) => `<tr><td>${s.src}</td><td>${s.conf}</td><td>${s.note}</td></tr>`)
        .join("")}</tbody>`;
    }

    const exportBtn = $("[data-export]");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => exportMarkdown(company));
    }

    observeToc();
  }

  function exportMarkdown(company) {
    const lines = [
      `# ${company.name} — 360° investor memo`,
      ``,
      `_${company.oneLiner}_`,
      ``,
      `Site: ${company.url} · Category: ${company.category} · Fit: ${company.fit}`,
      ``,
      `## 01 Decision brief`,
      ...company.brief.map((p) => `- ${p}`),
      ``,
      `## Validate first`,
      ...company.nextMoves.map((p) => `- ${p}`),
      ``,
      `## 02 Capital`,
      company.capital.summary,
      ...company.capital.rounds.map((r) => `- ${r.when} — ${r.what}: ${r.note}`),
      ``,
      `## 03 Positioning`,
      company.positioning,
      ``,
      `## Monetization`,
      company.monetization,
      ``,
      `## 04 Growth archaeology`,
      ...company.growth.map((p) => `- ${p}`),
      ``,
      `## 05 Channels`,
      ...company.channels.map((c) => `- ${c.name} (${c.value}): ${c.note}`),
      ``,
      `## 06 Strengths`,
      ...company.strengths.map((p) => `- ${p}`),
      ``,
      `## Risks`,
      ...company.risks.map((p) => `- ${p}`),
      ``,
      `## 07 Founder questions`,
      ...company.questions.map((p, i) => `${i + 1}. ${p}`),
      ``,
      `## 08 Comparables`,
      ...company.comps.map((c) => `- ${c.name}: ${c.note}`),
      ``,
      `## 09 Sources`,
      ...company.sources.map((s) => `- ${s.src} (${s.conf}): ${s.note}`),
      ``,
      `_Generated by Inked._`
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${company.slug}-inked-memo.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Memo exported as Markdown.");
  }

  function wireStageMotion() {
    const root = $("[data-stages]");
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stages = $$("[data-stages] > section");
    if (stages.length < 2) return;

    let lastY = window.scrollY;
    let dir = "down";

    const trackDir = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 4) dir = y > lastY ? "down" : "up";
      lastY = y;
    };
    window.addEventListener("scroll", trackDir, { passive: true });

    const setStage = (el, on) => {
      if (on) {
        el.classList.toggle("from-up", dir === "up");
        el.classList.add("is-in");
        return;
      }
      el.classList.toggle("from-up", dir === "down");
      el.classList.remove("is-in");
    };

    stages.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.72 && r.bottom > window.innerHeight * 0.28) {
        s.classList.add("is-in");
      }
    });
    document.documentElement.classList.add("motion-on");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setStage(entry.target, entry.isIntersecting && entry.intersectionRatio >= 0.28);
        });
      },
      { threshold: [0.2, 0.28, 0.45, 0.6] }
    );
    stages.forEach((s) => io.observe(s));
  }

  function observeToc() {
    const links = $$(".toc a");
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${visible.target.id}`));
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.15, 0.4] }
    );
    sections.forEach((s) => io.observe(s));
  }

  function wireNav() {
    const toggle = $("[data-menu]");
    const drawer = $("[data-drawer]");
    const more = $("[data-more]");
    const moreMenu = $("[data-more-menu]");

    const closeDrawer = () => {
      drawer?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Open menu");
    };

    const closeMore = () => {
      if (!moreMenu) return;
      moreMenu.hidden = true;
      more?.setAttribute("aria-expanded", "false");
    };

    if (toggle && drawer) {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = !drawer.classList.contains("is-open");
        drawer.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        if (open) closeMore();
      });
      drawer.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("click", closeDrawer);
      });
      drawer.addEventListener("click", (e) => e.stopPropagation());
    }

    if (more && moreMenu) {
      more.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = moreMenu.hidden;
        moreMenu.hidden = !open;
        more.setAttribute("aria-expanded", String(open));
        if (open) closeDrawer();
      });
      moreMenu.addEventListener("click", (e) => e.stopPropagation());
      moreMenu.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("click", closeMore);
      });
    }

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!more?.contains(t) && !moreMenu?.contains(t)) closeMore();
      if (!toggle?.contains(t) && !drawer?.contains(t)) closeDrawer();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        closeMore();
      }
    });
  }

  function wireModal(sel, openSel, closeSel, formSel, message) {
    const modal = $(sel);
    if (!modal) return;
    const open = () => {
      modal.hidden = false;
      modal.classList.add("is-open");
    };
    const close = () => {
      modal.classList.remove("is-open");
      modal.hidden = true;
    };
    $$(openSel).forEach((b) => b.addEventListener("click", open));
    $(closeSel)?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    $(formSel)?.addEventListener("submit", (e) => {
      e.preventDefault();
      close();
      toast(message);
    });
  }

  function wireAnalyze() {
    const form = $("[data-analyze]");
    const overlay = $("[data-overlay]");
    if (!form || !overlay) return;

    const signals = $$("[data-signal]", overlay);
    const elapsed = $("[data-elapsed]", overlay);
    const cancel = $("[data-cancel]", overlay);
    let timer;
    let tick;
    let aborted = false;

    function reset() {
      signals.forEach((li) => li.classList.remove("is-run", "is-done"));
      if (elapsed) elapsed.textContent = "Elapsed 0s";
    }

    function close() {
      aborted = true;
      clearInterval(timer);
      clearInterval(tick);
      overlay.classList.remove("is-open");
      overlay.hidden = true;
    }

    function run(raw) {
      const company = resolveCompany(raw) || window.INKED_COMPANIES.cursor;
      const known = Boolean(resolveCompany(raw));
      aborted = false;
      reset();
      overlay.hidden = false;
      overlay.classList.add("is-open");

      let seconds = 0;
      tick = setInterval(() => {
        seconds += 1;
        if (elapsed) elapsed.textContent = `Elapsed ${seconds}s`;
      }, 1000);

      let i = 0;
      const step = () => {
        if (aborted) return;
        if (i > 0) signals[i - 1]?.classList.replace("is-run", "is-done");
        if (i < signals.length) {
          signals[i].classList.add("is-run");
          i += 1;
          timer = setTimeout(step, 380);
        } else {
          signals.forEach((li) => {
            li.classList.remove("is-run");
            li.classList.add("is-done");
          });
          clearInterval(tick);
          setTimeout(() => {
            if (aborted) return;
            if (!known) toast("No live crawl yet — opening a written sample memo.");
            location.href = `report.html?c=${company.slug}`;
          }, 420);
        }
      };
      step();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const mode = form.dataset.inputMode || "url";
      let value = $("#company-url")?.value || "cursor.com";
      if (mode === "text") {
        const text = $("#company-text")?.value || "";
        const hit = Object.values(window.INKED_COMPANIES).find((c) =>
          text.toLowerCase().includes(c.name.toLowerCase())
        );
        value = hit ? hit.url : value;
      }
      run(value);
    });

    $$("[data-try]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = $("#company-url");
        if (input) input.value = btn.dataset.try;
        run(btn.dataset.try);
      });
    });

    const advBtn = $("[data-advanced]");
    const advBar = $("[data-advanced-bar]");
    advBtn?.addEventListener("click", () => {
      const open = advBar.hasAttribute("hidden");
      advBar.hidden = !open;
      advBtn.setAttribute("aria-expanded", String(open));
    });

    $$("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        form.dataset.inputMode = mode;
        $$("[data-mode]").forEach((b) => b.classList.toggle("is-on", b === btn));
        $$("[data-mode-panel]").forEach((panel) => {
          const on = panel.dataset.modePanel === mode;
          panel.classList.toggle("is-on", on);
          panel.hidden = !on;
        });
      });
    });

    $("[data-pdf]")?.addEventListener("change", () => {
      toast("PDF parsed in demo — running the Cursor sample memo.");
      run("cursor.com");
    });

    cancel?.addEventListener("click", close);
  }

  wireNav();
  wireModal(
    "[data-auth]",
    "[data-open-auth]",
    "[data-close-auth]",
    "[data-auth-form]",
    "Magic link queued — check your inbox in a real deploy."
  );
  wireModal(
    "[data-demo]",
    "[data-open-demo]",
    "[data-close-demo]",
    "[data-demo-form]",
    "Demo request queued — we’ll write back from hello@inked.top."
  );
  wireAnalyze();
  wireStageMotion();

  if ($("[data-memo]")) {
    const raw = slugFromQuery();
    renderReport(resolveCompany(raw) || window.INKED_COMPANIES[raw] || window.INKED_COMPANIES.cursor);
  }
})();
