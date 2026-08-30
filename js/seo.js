(function () {
  const SITE = "https://inked.top";
  const OG = `${SITE}/assets/og.png`;
  const LOGO = `${SITE}/assets/logo-512.png`;

  function upsertMeta(attr, key, content) {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertLink(rel, href, extras) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
    if (extras) {
      Object.keys(extras).forEach((k) => el.setAttribute(k, extras[k]));
    }
  }

  function upsertJsonLd(id, data) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  function organization() {
    return {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Inked",
      legalName: "Inked",
      url: SITE,
      email: "hello@inked.top",
      logo: {
        "@type": "ImageObject",
        url: LOGO,
        width: 512,
        height: 512,
        caption: "Inked — white 360° ring and diamond ink nib"
      },
      image: OG,
      description: "360° company research for investors. Public-signal memos covering growth, capital, and risk.",
      foundingLocation: { "@type": "Place", name: "Shanghai", addressCountry: "CN" },
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@inked.top",
        contactType: "customer support"
      }
    };
  }

  function breadcrumbs(crumbs) {
    const items = [{ name: "Inked", path: "/" }].concat(crumbs || []);
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: it.path.startsWith("http") ? it.path : `${SITE}${it.path}`
      }))
    };
  }

  window.INKED_SEO = {
    applyPage(opts) {
      const title = opts.title;
      const description = opts.description;
      const path = opts.path || "/";
      const url = path.startsWith("http") ? path : `${SITE}${path}`;
      const type = opts.type || "website";

      if (title) document.title = title;
      upsertMeta("name", "description", description);
      upsertMeta("name", "theme-color", "#F6F3EC");
      upsertMeta("name", "color-scheme", "light");
      upsertMeta("name", "robots", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
      upsertMeta("name", "author", "Inked");
      upsertMeta("name", "citation_title", title);
      upsertMeta("name", "citation_author", "Inked");
      upsertMeta("name", "citation_publication_date", "2026-08-30");
      upsertMeta("property", "og:site_name", "Inked");
      upsertMeta("property", "og:type", type);
      upsertMeta("property", "og:title", title);
      upsertMeta("property", "og:description", description);
      upsertMeta("property", "og:url", url);
      upsertMeta("property", "og:image", OG);
      upsertMeta("property", "og:image:alt", "Inked — 360° investor research");
      upsertMeta("property", "og:image:width", "1200");
      upsertMeta("property", "og:image:height", "630");
      upsertMeta("property", "og:locale", "en_US");
      upsertMeta("name", "twitter:card", "summary_large_image");
      upsertMeta("name", "twitter:title", title);
      upsertMeta("name", "twitter:description", description);
      upsertMeta("name", "twitter:image", OG);
      upsertLink("canonical", url);
      upsertLink("apple-touch-icon", `${SITE}/assets/logo-180.png`);

      let alt = document.querySelector('link[rel="alternate"][type="text/plain"]');
      if (!alt) {
        alt = document.createElement("link");
        alt.rel = "alternate";
        alt.type = "text/plain";
        alt.title = "LLM index";
        document.head.appendChild(alt);
      }
      alt.href = `${SITE}/llms.txt`;

      upsertJsonLd("inked-org", {
        "@context": "https://schema.org",
        ...organization()
      });

      if (opts.crumbs) {
        upsertJsonLd("inked-crumbs", breadcrumbs(opts.crumbs));
      }
    },

    applyHome() {
      this.applyPage({
        title: "Inked: Free AI Company Research for Investors (2026)",
        description: "Paste a URL. Inked reads growth, capital, and risk — a 360° company memo for investors in 60 seconds. Public-signal research.",
        path: "/"
      });
      upsertJsonLd("inked-app", {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Inked",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE,
        description: "360° company research memos for investors from public web signals.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "First two memos free" },
        publisher: { "@id": `${SITE}/#organization` },
        featureList: [
          "Decision brief",
          "Capital trail",
          "Positioning",
          "Growth archaeology",
          "Channels",
          "Strengths and risks",
          "Founder questions",
          "Comparables",
          "Sourced evidence"
        ]
      });
      upsertJsonLd("inked-site", {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "Inked",
        description: "360° company research for investors.",
        inLanguage: "en",
        publisher: { "@id": `${SITE}/#organization` }
      });
      upsertJsonLd("inked-faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Inked?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Inked writes a 360° investor memo from a company URL, product text, or PDF. It covers growth, capital, risk, and founder questions. Public-signal research only."
            }
          },
          {
            "@type": "Question",
            name: "How does Inked research a company?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Inked reads public sources in parallel: the live site, archives, pricing, social and developer traces, disclosed funding, and market context. Figures are labeled with source class and confidence."
            }
          },
          {
            "@type": "Question",
            name: "Is an Inked memo investment advice?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Inked is research infrastructure. Users remain responsible for capital, compliance, and decisions."
            }
          },
          {
            "@type": "Question",
            name: "Where can agents read a machine index of Inked?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "https://inked.top/llms.txt lists public pages, citation rules, and facts not to invent."
            }
          }
        ]
      });
    },

    applyReport(company) {
      const path = `/report.html?c=${company.slug}`;
      this.applyPage({
        title: `${company.name} — 360° investor memo · Inked`,
        description: `${company.oneLiner} Public-signal 360° memo.`,
        path,
        type: "article",
        crumbs: [
          { name: "Samples", path: "/#samples" },
          { name: `${company.name} memo`, path }
        ]
      });
      upsertJsonLd("inked-report", {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${company.name} — 360° investor memo`,
        description: company.oneLiner,
        url: `${SITE}${path}`,
        image: OG,
        datePublished: "2026-08-30",
        dateModified: "2026-08-30",
        inLanguage: "en",
        author: { "@id": `${SITE}/#organization` },
        publisher: { "@id": `${SITE}/#organization` },
        about: { "@type": "Organization", name: company.name, url: `https://${company.url}` },
        articleSection: "Investor research",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-name]", "[data-liner]", "#brief"]
        }
      });
    }
  };
})();
