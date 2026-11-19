(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Callback Popup
     ------------------------------------------------------------------------ */
  var pop = document.getElementById("pop");
  var popShown = false;

  try {
    popShown = sessionStorage.getItem("popSeen") === "1";
  } catch (e) {
    // sessionStorage unavailable (e.g. restricted browsing mode)
  }

  function openPop() {
    if (!pop || popShown) return;
    popShown = true;
    try {
      sessionStorage.setItem("popSeen", "1");
    } catch (e) {}
    pop.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      var nameInput = document.getElementById("p-name");
      if (nameInput) nameInput.focus({ preventScroll: true });
    }, 350);
  }

  function closePop() {
    if (!pop) return;
    pop.hidden = true;
    document.body.style.overflow = "";
  }

  if (pop) {
    pop.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closePop();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !pop.hidden) closePop();
    });

    var scrollTicking = false;
    function checkScroll() {
      scrollTicking = false;
      if (popShown) {
        window.removeEventListener("scroll", onScroll);
        return;
      }
      var activeView = document.querySelector(".view:not([hidden])");
      if (!activeView) return;
      var blocks = [].slice.call(activeView.children).filter(function (el) {
        return el.offsetHeight > 0;
      });
      var thirdBlock = blocks[2];
      if (!thirdBlock) return;
      if (thirdBlock.getBoundingClientRect().top < window.innerHeight * 0.55) {
        openPop();
      }
    }

    function onScroll() {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(checkScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var popForm = document.getElementById("popForm");
  if (popForm) {
    popForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("p-name").value.trim();
      var phone = document.getElementById("p-phone").value.replace(/\D/g, "");
      var err = document.getElementById("popErr");
      if (!name || phone.length < 10) {
        err.hidden = false;
        return;
      }
      err.hidden = true;
      document.getElementById("popName").textContent = name;
      this.hidden = true;
      document.getElementById("popDone").hidden = false;
    });
  }

  /* ------------------------------------------------------------------------
     Decorative Background Motifs
     ------------------------------------------------------------------------ */
  var motifs = ["m-preg", "m-heart", "m-baby", "m-feet", "m-beat", "m-sprig", "m-mom"];
  var spots = [
    [
      { r: "4%", t: "12%", s: 110, rot: -8 },
      { l: "2%", b: "8%", s: 70, rot: 12 }
    ],
    [
      { r: "7%", b: "10%", s: 84, rot: 10 },
      { l: "45%", t: "6%", s: 56, rot: -14 }
    ],
    [
      { l: "3%", t: "14%", s: 96, rot: 6 },
      { r: "3%", b: "6%", s: 120, rot: -6 }
    ],
    [
      { r: "38%", b: "6%", s: 64, rot: 16 },
      { l: "2%", t: "8%", s: 92, rot: -10 }
    ]
  ];

  var posMap = { l: "left", r: "right", t: "top", b: "bottom" };
  var decoHosts = [].slice.call(
    document.querySelectorAll(".home-top, .svc-hero, section.band, footer")
  );

  decoHosts.forEach(function (host, i) {
    host.classList.add("deco-host");
    spots[i % spots.length].forEach(function (sp, j) {
      var motifId = motifs[(i * 2 + j) % motifs.length];
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "deco c" + (((i + j) % 3) + 1) + " k" + (j + 1));
      svg.setAttribute("aria-hidden", "true");

      var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#" + motifId);
      svg.appendChild(use);

      svg.style.width = svg.style.height = sp.s + "px";
      ["l", "r", "t", "b"].forEach(function (k) {
        if (sp[k]) svg.style[posMap[k]] = sp[k];
      });
      svg.style.rotate = sp.rot + "deg";
      svg.style.animationDelay = -(i * 1.7 + j * 3) + "s";

      host.insertBefore(svg, host.firstChild);
    });
  });

  /* ------------------------------------------------------------------------
     Pregnancy Due Date Calculator
     ------------------------------------------------------------------------ */
  var lmpInput = document.getElementById("c-lmp");
  var cycInput = document.getElementById("c-cyc");

  if (lmpInput && cycInput) {
    var defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 70);
    lmpInput.value = defaultDate.toISOString().slice(0, 10);

    var formatDate = function (d) {
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    };

    function calculateDueDate() {
      var val = lmpInput.value;
      if (!val) return;
      var parts = val.split("-");
      var lmpDate = new Date(+parts[0], parts[1] - 1, +parts[2]);
      var cycleOffset = +cycInput.value - 28;

      var due = new Date(lmpDate);
      due.setDate(due.getDate() + 280 + cycleOffset);

      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var days = Math.round((today - lmpDate) / 864e5) - cycleOffset;

      document.getElementById("c-due").textContent = formatDate(due);
      var wkEl = document.getElementById("c-wk");
      var triEl = document.getElementById("c-tri");
      var nextEl = document.getElementById("c-next");

      if (days < 0 || days > 300) {
        wkEl.textContent = "—";
        triEl.textContent = "—";
        nextEl.textContent = "Please check the date you entered.";
        return;
      }

      var weeks = Math.floor(days / 7);
      var remDays = days % 7;
      wkEl.textContent = weeks + " wk" + (remDays ? " " + remDays + " d" : "");
      triEl.textContent = weeks < 13 ? "First" : weeks < 28 ? "Second" : "Third";
      nextEl.textContent =
        weeks < 11
          ? "Coming up: NT scan at 11–13 weeks."
          : weeks < 18
            ? "Coming up: anomaly scan at 18–22 weeks."
            : weeks < 24
              ? "Coming up: sugar test at 24–28 weeks."
              : weeks < 36
                ? "Coming up: growth scans and your birth plan."
                : "Weekly check-ups until your baby arrives.";
    }

    lmpInput.addEventListener("input", calculateDueDate);
    cycInput.addEventListener("change", calculateDueDate);
    calculateDueDate();
  }

  /* Deep-link scroll targets (e.g. data-go="calc") */
  document.querySelectorAll("[data-go]").forEach(function (link) {
    link.addEventListener("click", function () {
      var targetId = link.dataset.go;
      setTimeout(function () {
        var el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    });
  });

  /* ------------------------------------------------------------------------
     Events Category & Format Filters
     ------------------------------------------------------------------------ */
  var evCat = "all";
  var evMode = "all";

  function applyEventFilters() {
    var count = 0;
    document.querySelectorAll("#evGrid .ev-card").forEach(function (card) {
      var match =
        (evCat === "all" || card.dataset.cat === evCat) &&
        (evMode === "all" || card.dataset.mode === evMode);
      card.hidden = !match;
      if (match) count++;
    });

    var countEl = document.getElementById("evCount");
    var emptyEl = document.getElementById("evEmpty");
    if (countEl) {
      countEl.textContent = "Showing " + count + " event" + (count === 1 ? "" : "s");
    }
    if (emptyEl) {
      emptyEl.hidden = count > 0;
    }
  }

  document.querySelectorAll(".fchip").forEach(function (btn) {
    btn.addEventListener("click", function () {
      evCat = btn.dataset.f;
      document.querySelectorAll(".fchip").forEach(function (other) {
        var active = other === btn;
        other.classList.toggle("on", active);
        other.setAttribute("aria-pressed", active);
      });
      applyEventFilters();
    });
  });

  document.querySelectorAll(".seg button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      evMode = btn.dataset.m;
      document.querySelectorAll(".seg button").forEach(function (other) {
        other.classList.toggle("on", other === btn);
      });
      applyEventFilters();
    });
  });

  var evResetBtn = document.getElementById("evReset");
  if (evResetBtn) {
    evResetBtn.addEventListener("click", function () {
      var allCat = document.querySelector('.fchip[data-f="all"]');
      var allMode = document.querySelector('.seg button[data-m="all"]');
      if (allCat) allCat.click();
      if (allMode) allMode.click();
    });
  }

  /* Pre-fill contact form when registering for an event */
  document.querySelectorAll("[data-event]").forEach(function (link) {
    link.addEventListener("click", function () {
      setTimeout(function () {
        var msg = document.getElementById("f-msg");
        var reason = document.getElementById("f-reason");
        if (msg) msg.value = "I would like to register for: " + link.dataset.event;
        if (reason) reason.value = "Other";
      }, 80);
    });
  });

  /* ------------------------------------------------------------------------
     Horizontal Sliders (Instagram Reels, Google Reviews, Video Stories)
     ------------------------------------------------------------------------ */
  function updateSliderNav(track) {
    var buttons = document.querySelectorAll('.sl-btn[data-sl="' + track.id + '"]');
    buttons.forEach(function (btn) {
      var dir = +btn.dataset.dir;
      btn.disabled =
        dir < 0
          ? track.scrollLeft < 4
          : track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    });
  }

  document.querySelectorAll(".sl-track").forEach(function (track) {
    var ticking = false;
    track.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          updateSliderNav(track);
        });
      },
      { passive: true }
    );
    updateSliderNav(track);
  });

  document.querySelectorAll(".sl-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var track = document.getElementById(btn.dataset.sl);
      if (!track) return;
      track.scrollBy({
        left: +btn.dataset.dir * track.clientWidth * 0.85,
        behavior: "smooth"
      });
    });
  });

  window.addEventListener("hashchange", function () {
    setTimeout(function () {
      document.querySelectorAll(".sl-track").forEach(updateSliderNav);
    }, 50);
  });

  /* ------------------------------------------------------------------------
     Trimester Tabs (Pregnancy Care & Patient Guide)
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".ttabs").forEach(function (tabList) {
    var tabs = [].slice.call(tabList.querySelectorAll(".tt"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (other) {
          var isSelected = other === tab;
          other.classList.toggle("on", isSelected);
          other.setAttribute("aria-selected", isSelected);
          var panel = document.getElementById(other.dataset.tp);
          if (panel) panel.hidden = !isSelected;
        });
      });
    });
  });

  /* ------------------------------------------------------------------------
     Client-Side Hash Router & Navigation State
     ------------------------------------------------------------------------ */
  var views = [].slice.call(document.querySelectorAll(".view"));
  var navLinks = [].slice.call(
    document.querySelectorAll("nav.main > a, nav.main .drop-trigger")
  );
  var serviceViews = [
    "pregnancy-care",
    "high-risk",
    "labour",
    "painless-labour",
    "endometriosis",
    "laparoscopy",
    "fertility",
    "obstetrics",
    "gynaecology"
  ];

  var pageTitles = {
    home: "",
    about: "About",
    services: "Services",
    obstetrics: "Obstetrics",
    gynaecology: "Gynaecology",
    "pregnancy-care": "Pregnancy Care",
    "high-risk": "High-Risk Pregnancy",
    labour: "Labour & Delivery",
    "painless-labour": "Painless Labour",
    endometriosis: "Endometriosis Care",
    laparoscopy: "Laparoscopy",
    fertility: "Fertility Care",
    guide: "Patient Guide",
    events: "Events & Programs",
    stories: "Patient Stories",
    blog: "Blog",
    contact: "Contact"
  };

  var navEl = document.getElementById("nav");
  var menuBtn = document.getElementById("menuBtn");

  function showView() {
    var id = (location.hash || "#home").slice(1);
    if (
      !views.some(function (v) {
        return v.dataset.view === id;
      })
    ) {
      id = "home";
    }

    views.forEach(function (v) {
      v.hidden = v.dataset.view !== id;
    });

    document.title =
      (pageTitles[id] ? pageTitles[id] + " · " : "") +
      "Dr. Hemalatha Obstetrics & Gynaecology";

    var topNavId = serviceViews.indexOf(id) > -1 ? "services" : id;
    document.querySelectorAll(".drop").forEach(function (d) {
      d.classList.remove("open");
    });

    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + topNavId) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.querySelectorAll(".side nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (navEl) navEl.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", function () {
    showView();
    if (document.activeElement) document.activeElement.blur();
  });
  showView();

  if (menuBtn && navEl) {
    menuBtn.addEventListener("click", function () {
      var isOpen = navEl.classList.toggle("open");
      this.setAttribute("aria-expanded", isOpen);
    });
  }

  /* ------------------------------------------------------------------------
     Contact Form & Story Filter
     ------------------------------------------------------------------------ */
  var bookForm = document.getElementById("bookForm");
  if (bookForm) {
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var formOk = document.getElementById("formOk");
      if (formOk) formOk.hidden = false;
    });
  }

  var storyFilterBtns = [].slice.call(
    document.querySelectorAll("#storyFilter button")
  );
  storyFilterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.dataset.f;
      storyFilterBtns.forEach(function (other) {
        other.className = "btn " + (other === btn ? "primary" : "ghost");
      });
      document.querySelectorAll("#stories .card").forEach(function (card) {
        card.hidden = !(filter === "all" || card.dataset.c === filter);
      });
    });
  });
})();
