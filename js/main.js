(function () {
  "use strict";

  const POPUP_STORAGE_KEY = "popSeen";
  const CONSENT_STORAGE_KEY = "clinicCookieConsent";
  const POPUP_SCROLL_RATIO = 0.55;
  const DEFAULT_CYCLE_DAYS = 28;
  const GESTATION_DAYS = 280;
  const MAX_PREGNANCY_DAYS = 300;
  const DEFAULT_LMP_OFFSET_DAYS = 70;
  const MS_PER_DAY = 86400000;
  const SLIDER_EDGE_THRESHOLD_PX = 4;
  const SLIDER_SCROLL_STEP_RATIO = 0.85;
  const INDIAN_MOBILE_PATTERN = /^(?:\+?91[\s-]?)?(?:0)?[6-9]\d{9}$/;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const DECORATIVE_MOTIFS = ["m-preg", "m-heart", "m-baby", "m-feet", "m-beat", "m-sprig", "m-mom"];
  const DECORATIVE_SPOTS = [
    [
      { right: "4%", top: "12%", size: 110, rotate: -8 },
      { left: "2%", bottom: "8%", size: 70, rotate: 12 }
    ],
    [
      { right: "7%", bottom: "10%", size: 84, rotate: 10 },
      { left: "45%", top: "6%", size: 56, rotate: -14 }
    ],
    [
      { left: "3%", top: "14%", size: 96, rotate: 6 },
      { right: "3%", bottom: "6%", size: 120, rotate: -6 }
    ],
    [
      { right: "38%", bottom: "6%", size: 64, rotate: 16 },
      { left: "2%", top: "8%", size: 92, rotate: -10 }
    ]
  ];

  function safeStorageGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch {
      // Ignore storage errors in privacy-restricted browsers
    }
  }

  function isValidIndianMobile(rawValue) {
    const cleaned = rawValue.trim().replace(/[\s()-]/g, "");
    return INDIAN_MOBILE_PATTERN.test(cleaned);
  }

  function isValidEmail(rawValue) {
    return EMAIL_PATTERN.test(rawValue.trim());
  }

  function setFieldValidity(inputEl, isValid) {
    if (!inputEl) return;
    if (isValid) {
      inputEl.removeAttribute("aria-invalid");
    } else {
      inputEl.setAttribute("aria-invalid", "true");
    }
  }

  function initCopyrightYear() {
    const currentYear = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = currentYear;
    });
  }

  /* ------------------------------------------------------------------------
     Analytics (loads strictly after explicit cookie consent)
     ------------------------------------------------------------------------ */
  let analyticsLoaded = false;

  function loadAnalyticsScripts() {
    if (analyticsLoaded) return;
    const gtmId = (document.body.dataset.gtm || "").trim();
    const ga4Id = (document.body.dataset.ga4 || "").trim();
    if (!gtmId && !ga4Id) return;

    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];

    if (gtmId) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const gtmScript = document.createElement("script");
      gtmScript.async = true;
      gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId);
      document.head.appendChild(gtmScript);
      return;
    }

    if (ga4Id) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id);
      document.head.appendChild(gaScript);
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", ga4Id);
    }
  }

  function trackConversionEvent(eventName, payload) {
    if (!analyticsLoaded || !Array.isArray(window.dataLayer)) return;
    window.dataLayer.push(Object.assign({ event: eventName }, payload || {}));
  }

  function initConversionTracking() {
    document.querySelectorAll("[data-track]").forEach((linkEl) => {
      linkEl.addEventListener("click", () => {
        trackConversionEvent(linkEl.dataset.track, { href: linkEl.getAttribute("href") });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Cookie Consent Banner (Accept / Reject / Settings)
     ------------------------------------------------------------------------ */
  function readSavedConsent() {
    const raw = safeStorageGet(localStorage, CONSENT_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function initCookieConsent() {
    const banner = document.getElementById("cookieBar");
    const prefsPanel = document.getElementById("cookiePrefs");
    const analyticsCheckbox = document.getElementById("cookieAnalytics");
    if (!banner) return;

    const saved = readSavedConsent();
    const hasTrackers = Boolean(document.body.dataset.gtm || document.body.dataset.ga4);

    if (saved && saved.analytics) {
      loadAnalyticsScripts();
    } else if (!saved && hasTrackers) {
      banner.hidden = false;
    }

    function applyChoice(allowAnalytics) {
      safeStorageSet(
        localStorage,
        CONSENT_STORAGE_KEY,
        JSON.stringify({ essential: true, analytics: allowAnalytics, updatedAt: Date.now() })
      );
      if (allowAnalytics) loadAnalyticsScripts();
      banner.hidden = true;
      if (prefsPanel) prefsPanel.hidden = true;
    }

    function openCookieSettings() {
      const current = readSavedConsent();
      if (analyticsCheckbox) analyticsCheckbox.checked = Boolean(current && current.analytics);
      banner.hidden = false;
      if (prefsPanel) prefsPanel.hidden = false;
    }

    document.getElementById("cookieAccept")?.addEventListener("click", () => applyChoice(true));
    document.getElementById("cookieReject")?.addEventListener("click", () => applyChoice(false));
    document.getElementById("cookieCustomize")?.addEventListener("click", () => {
      if (prefsPanel) prefsPanel.hidden = !prefsPanel.hidden;
    });
    document.getElementById("cookieSave")?.addEventListener("click", () => {
      applyChoice(Boolean(analyticsCheckbox && analyticsCheckbox.checked));
    });
    document.getElementById("cookieSettingsBtn")?.addEventListener("click", openCookieSettings);
    document.querySelectorAll("[data-open-cookie-settings]").forEach((btn) => {
      btn.addEventListener("click", openCookieSettings);
    });
  }

  /* ------------------------------------------------------------------------
     Navigation, Mobile Menu & Keyboard Mega-Menu
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const navEl = document.getElementById("nav");
    const menuBtn = document.getElementById("menuBtn");

    if (menuBtn && navEl) {
      menuBtn.addEventListener("click", () => {
        const isOpen = navEl.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
      });
    }

    document.querySelectorAll(".drop").forEach((dropEl) => {
      const trigger = dropEl.querySelector(".drop-trigger");
      if (!trigger) return;

      dropEl.addEventListener("mouseenter", () => trigger.setAttribute("aria-expanded", "true"));
      dropEl.addEventListener("mouseleave", () => trigger.setAttribute("aria-expanded", "false"));
      dropEl.addEventListener("focusin", () => trigger.setAttribute("aria-expanded", "true"));
      dropEl.addEventListener("focusout", (event) => {
        if (!dropEl.contains(event.relatedTarget)) {
          trigger.setAttribute("aria-expanded", "false");
          dropEl.classList.remove("open");
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (navEl && navEl.classList.contains("open")) {
        navEl.classList.remove("open");
        menuBtn?.setAttribute("aria-expanded", "false");
        menuBtn?.focus();
      }
      document.querySelectorAll(".drop").forEach((dropEl) => {
        dropEl.classList.remove("open");
        dropEl.querySelector(".drop-trigger")?.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Shared Form Submission Helper
     ------------------------------------------------------------------------ */
  async function submitEnquiry(endpoint, payload) {
    if (!endpoint) {
      return {
        delivered: false,
        note: "Draft site: this form is not connected yet. It will be linked to the clinic's verified email/CRM before launch."
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Server returned status " + response.status);
    }

    return { delivered: true, note: "" };
  }

  /* ------------------------------------------------------------------------
     Callback Popup with Focus Trap
     ------------------------------------------------------------------------ */
  function trapFocusWithin(container, event) {
    if (event.key !== "Tab") return;
    const focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initCallbackPopup() {
    const popupEl = document.getElementById("pop");
    const popupCard = popupEl?.querySelector(".pop-card");
    const popupForm = document.getElementById("popForm");
    if (!popupEl || !popupCard || !popupForm) return;

    let popupShown = safeStorageGet(sessionStorage, POPUP_STORAGE_KEY) === "1";
    let previouslyFocused = null;
    let scrollTicking = false;

    function openPopup() {
      if (popupShown) return;
      popupShown = true;
      safeStorageSet(sessionStorage, POPUP_STORAGE_KEY, "1");
      previouslyFocused = document.activeElement;
      popupEl.hidden = false;
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.getElementById("p-name")?.focus({ preventScroll: true });
      }, 300);
    }

    function closePopup() {
      popupEl.hidden = true;
      document.body.style.overflow = "";
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    }

    function checkScrollTrigger() {
      scrollTicking = false;
      if (popupShown) {
        window.removeEventListener("scroll", onScroll);
        return;
      }
      const mainEl = document.getElementById("main-content");
      if (!mainEl) return;
      const sections = Array.from(mainEl.children).filter((el) => el.offsetHeight > 0);
      const triggerSection = sections[2];
      if (!triggerSection) return;
      if (triggerSection.getBoundingClientRect().top < window.innerHeight * POPUP_SCROLL_RATIO) {
        openPopup();
      }
    }

    function onScroll() {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(checkScrollTrigger);
      }
    }

    popupEl.addEventListener("click", (event) => {
      if (event.target.closest("[data-close]")) closePopup();
    });

    document.addEventListener("keydown", (event) => {
      if (popupEl.hidden) return;
      if (event.key === "Escape") closePopup();
      trapFocusWithin(popupCard, event);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    bindPopupForm(popupForm);
  }

  function bindPopupForm(popupForm) {
    const nameInput = document.getElementById("p-name");
    const phoneInput = document.getElementById("p-phone");
    const consentInput = document.getElementById("p-consent");
    const honeypotInput = document.getElementById("p-website");
    const errEl = document.getElementById("popErr");
    const submitBtn = document.getElementById("popSubmit");

    popupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (honeypotInput && honeypotInput.value.trim() !== "") return;

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const hasName = name.length > 0;
      const hasValidPhone = isValidIndianMobile(phone);
      const hasConsent = Boolean(consentInput && consentInput.checked);

      setFieldValidity(nameInput, hasName);
      setFieldValidity(phoneInput, hasValidPhone);
      setFieldValidity(consentInput, hasConsent);

      if (!hasName || !hasValidPhone || !hasConsent) {
        errEl.textContent = !hasConsent
          ? "Please tick the privacy consent box so we may contact you."
          : "Please enter your name and a valid 10-digit Indian mobile number.";
        errEl.hidden = false;
        return;
      }

      errEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending request…";

      try {
        const selectedSvc = popupForm.querySelector('input[name="service"]:checked')?.value || "";
        const result = await submitEnquiry(popupForm.dataset.endpoint, {
          source: "callback_popup",
          name,
          phone,
          service: selectedSvc,
          consent: true,
          page: location.pathname
        });

        trackConversionEvent("form_submit", { form: "callback_popup", service: selectedSvc });
        document.getElementById("popName").textContent = name;
        const statusNote = document.getElementById("popStatusNote");
        if (statusNote) statusNote.textContent = result.note;
        popupForm.hidden = true;
        document.getElementById("popDone").hidden = false;
      } catch {
        errEl.textContent =
          "Could not send your request right now. Please try again or call the clinic directly.";
        errEl.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a call back";
      }
    });
  }

  /* ------------------------------------------------------------------------
     Contact Page Appointment Form
     ------------------------------------------------------------------------ */
  function prefillEventFromQuery() {
    const params = new URLSearchParams(location.search);
    const eventParam = params.get("event");
    if (!eventParam) return;
    const msgInput = document.getElementById("f-msg");
    const reasonSelect = document.getElementById("f-reason");
    if (msgInput && !msgInput.value) {
      msgInput.value = "I would like to register for: " + eventParam;
    }
    if (reasonSelect) reasonSelect.value = "Other";
  }

  function initBookingForm() {
    const formEl = document.getElementById("bookForm");
    if (!formEl) return;

    prefillEventFromQuery();

    const nameInput = document.getElementById("f-name");
    const phoneInput = document.getElementById("f-phone");
    const emailInput = document.getElementById("f-email");
    const consentInput = document.getElementById("f-consent");
    const honeypotInput = document.getElementById("f-website");
    const errEl = document.getElementById("formErr");
    const okEl = document.getElementById("formOk");
    const submitBtn = document.getElementById("bookSubmit");

    formEl.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (honeypotInput && honeypotInput.value.trim() !== "") return;

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      const hasName = name.length > 0;
      const hasValidPhone = isValidIndianMobile(phone);
      const hasValidEmail = email === "" || isValidEmail(email);
      const hasConsent = Boolean(consentInput && consentInput.checked);

      setFieldValidity(nameInput, hasName);
      setFieldValidity(phoneInput, hasValidPhone);
      setFieldValidity(emailInput, hasValidEmail);
      setFieldValidity(consentInput, hasConsent);

      if (!hasName || !hasValidPhone || !hasValidEmail || !hasConsent) {
        okEl.hidden = true;
        errEl.textContent = !hasName
          ? "Please enter your name."
          : !hasValidPhone
            ? "Please enter a valid 10-digit Indian mobile number (+91 optional)."
            : !hasValidEmail
              ? "Please enter a valid email address or leave email blank."
              : "Please tick the privacy consent box before requesting an appointment.";
        errEl.hidden = false;
        return;
      }

      errEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";

      try {
        const result = await submitEnquiry(formEl.dataset.endpoint, {
          source: "contact_form",
          name,
          phone,
          email,
          reason: document.getElementById("f-reason")?.value || "",
          weeks: document.getElementById("f-weeks")?.value.trim() || "",
          preferredDate: document.getElementById("f-date")?.value || "",
          message: document.getElementById("f-msg")?.value.trim() || "",
          consent: true
        });

        trackConversionEvent("form_submit", { form: "contact_booking" });
        okEl.textContent = result.delivered
          ? "Thank you, " + name + ". Your appointment request has been received."
          : result.note;
        okEl.hidden = false;
        if (result.delivered) formEl.reset();
      } catch {
        errEl.textContent =
          "Something went wrong while sending your request. Please call or WhatsApp the clinic directly.";
        errEl.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request appointment";
      }
    });
  }

  /* ------------------------------------------------------------------------
     Pregnancy Due Date Calculator
     ------------------------------------------------------------------------ */
  function formatIndianDate(dateObj) {
    return dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function getMilestoneGuidance(weeks) {
    if (weeks < 11) return "Coming up: NT scan at 11–13 weeks.";
    if (weeks < 18) return "Coming up: anomaly scan at 18–22 weeks.";
    if (weeks < 24) return "Coming up: sugar test at 24–28 weeks.";
    if (weeks < 36) return "Coming up: growth scans and your birth plan.";
    return "Weekly check-ups until your baby arrives.";
  }

  function initDueDateCalculator() {
    const lmpInput = document.getElementById("c-lmp");
    const cycleSelect = document.getElementById("c-cyc");
    if (!lmpInput || !cycleSelect) return;

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - DEFAULT_LMP_OFFSET_DAYS);
    lmpInput.value = defaultDate.toISOString().slice(0, 10);

    function updateEstimate() {
      const value = lmpInput.value;
      if (!value) return;

      const parts = value.split("-").map(Number);
      const lmpDate = new Date(parts[0], parts[1] - 1, parts[2]);
      const cycleOffset = Number(cycleSelect.value) - DEFAULT_CYCLE_DAYS;

      const dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + GESTATION_DAYS + cycleOffset);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const elapsedDays = Math.round((today - lmpDate) / MS_PER_DAY) - cycleOffset;

      document.getElementById("c-due").textContent = formatIndianDate(dueDate);
      const weekEl = document.getElementById("c-wk");
      const trimesterEl = document.getElementById("c-tri");
      const nextEl = document.getElementById("c-next");

      if (elapsedDays < 0 || elapsedDays > MAX_PREGNANCY_DAYS) {
        weekEl.textContent = "—";
        trimesterEl.textContent = "—";
        nextEl.textContent = "Please check the date you entered.";
        return;
      }

      const weeks = Math.floor(elapsedDays / 7);
      const remainderDays = elapsedDays % 7;
      weekEl.textContent = weeks + " wk" + (remainderDays ? " " + remainderDays + " d" : "");
      trimesterEl.textContent = weeks < 13 ? "First" : weeks < 28 ? "Second" : "Third";
      nextEl.textContent = getMilestoneGuidance(weeks);
    }

    lmpInput.addEventListener("input", updateEstimate);
    cycleSelect.addEventListener("change", updateEstimate);
    updateEstimate();
  }

  /* ------------------------------------------------------------------------
     Events Category & Format Filters
     ------------------------------------------------------------------------ */
  function initEventFilters() {
    const gridEl = document.getElementById("evGrid");
    if (!gridEl) return;

    let selectedCategory = "all";
    let selectedMode = "all";

    function applyFilters() {
      let visibleCount = 0;
      gridEl.querySelectorAll(".ev-card").forEach((cardEl) => {
        const matchesCat = selectedCategory === "all" || cardEl.dataset.cat === selectedCategory;
        const matchesMode = selectedMode === "all" || cardEl.dataset.mode === selectedMode;
        const isVisible = matchesCat && matchesMode;
        cardEl.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      const countEl = document.getElementById("evCount");
      const emptyEl = document.getElementById("evEmpty");
      if (countEl) {
        countEl.textContent =
          "Showing " + visibleCount + " event" + (visibleCount === 1 ? "" : "s");
      }
      if (emptyEl) emptyEl.hidden = visibleCount > 0;
    }

    document.querySelectorAll(".fchip").forEach((chipBtn) => {
      chipBtn.addEventListener("click", () => {
        selectedCategory = chipBtn.dataset.f;
        document.querySelectorAll(".fchip").forEach((otherBtn) => {
          const isActive = otherBtn === chipBtn;
          otherBtn.classList.toggle("on", isActive);
          otherBtn.setAttribute("aria-pressed", String(isActive));
        });
        applyFilters();
      });
    });

    document.querySelectorAll(".seg button").forEach((modeBtn) => {
      modeBtn.addEventListener("click", () => {
        selectedMode = modeBtn.dataset.m;
        document.querySelectorAll(".seg button").forEach((otherBtn) => {
          otherBtn.classList.toggle("on", otherBtn === modeBtn);
        });
        applyFilters();
      });
    });

    document.getElementById("evReset")?.addEventListener("click", () => {
      document.querySelector('.fchip[data-f="all"]')?.click();
      document.querySelector('.seg button[data-m="all"]')?.click();
    });
  }

  /* ------------------------------------------------------------------------
     Horizontal Sliders & Trimester Tabs
     ------------------------------------------------------------------------ */
  function updateSliderButtons(trackEl) {
    document.querySelectorAll('.sl-btn[data-sl="' + trackEl.id + '"]').forEach((btn) => {
      const direction = Number(btn.dataset.dir);
      btn.disabled =
        direction < 0
          ? trackEl.scrollLeft < SLIDER_EDGE_THRESHOLD_PX
          : trackEl.scrollLeft + trackEl.clientWidth >=
            trackEl.scrollWidth - SLIDER_EDGE_THRESHOLD_PX;
    });
  }

  function initSliders() {
    document.querySelectorAll(".sl-track").forEach((trackEl) => {
      let ticking = false;
      trackEl.addEventListener(
        "scroll",
        () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            updateSliderButtons(trackEl);
          });
        },
        { passive: true }
      );
      updateSliderButtons(trackEl);
    });

    document.querySelectorAll(".sl-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const trackEl = document.getElementById(btn.dataset.sl);
        if (!trackEl) return;
        trackEl.scrollBy({
          left: Number(btn.dataset.dir) * trackEl.clientWidth * SLIDER_SCROLL_STEP_RATIO,
          behavior: "smooth"
        });
      });
    });

    window.addEventListener("resize", () => {
      document.querySelectorAll(".sl-track").forEach(updateSliderButtons);
    });
  }

  function initTrimesterTabs() {
    document.querySelectorAll(".ttabs").forEach((tabList) => {
      const tabs = Array.from(tabList.querySelectorAll(".tt"));
      tabs.forEach((tabBtn) => {
        tabBtn.addEventListener("click", () => {
          tabs.forEach((otherBtn) => {
            const isSelected = otherBtn === tabBtn;
            otherBtn.classList.toggle("on", isSelected);
            otherBtn.setAttribute("aria-selected", String(isSelected));
            const panel = document.getElementById(otherBtn.dataset.tp);
            if (panel) panel.hidden = !isSelected;
          });
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Decorative Background Motifs
     ------------------------------------------------------------------------ */
  function initDecorativeMotifs() {
    const hosts = document.querySelectorAll(".home-top, .svc-hero, section.band, footer");
    hosts.forEach((hostEl, hostIdx) => {
      hostEl.classList.add("deco-host");
      DECORATIVE_SPOTS[hostIdx % DECORATIVE_SPOTS.length].forEach((spot, spotIdx) => {
        const motifId = DECORATIVE_MOTIFS[(hostIdx * 2 + spotIdx) % DECORATIVE_MOTIFS.length];
        const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgEl.setAttribute(
          "class",
          "deco c" + (((hostIdx + spotIdx) % 3) + 1) + " k" + (spotIdx + 1)
        );
        svgEl.setAttribute("aria-hidden", "true");

        const useEl = document.createElementNS("http://www.w3.org/2000/svg", "use");
        useEl.setAttribute("href", "#" + motifId);
        svgEl.appendChild(useEl);

        svgEl.style.width = spot.size + "px";
        svgEl.style.height = spot.size + "px";
        if (spot.left) svgEl.style.left = spot.left;
        if (spot.right) svgEl.style.right = spot.right;
        if (spot.top) svgEl.style.top = spot.top;
        if (spot.bottom) svgEl.style.bottom = spot.bottom;
        svgEl.style.rotate = spot.rotate + "deg";

        hostEl.insertBefore(svgEl, hostEl.firstChild);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  initCopyrightYear();
  initNavigation();
  initCookieConsent();
  initConversionTracking();
  initCallbackPopup();
  initBookingForm();
  initDueDateCalculator();
  initEventFilters();
  initSliders();
  initTrimesterTabs();
  initDecorativeMotifs();
})();
