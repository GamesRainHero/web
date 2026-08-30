/* Rainhero Games — site behaviour
   Replaces the old checkbox-hack navigation with a real, keyboard-usable menu. */
(function () {
  "use strict";

  /* ---- Mobile navigation ---------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var scrim = document.querySelector(".nav-scrim");

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (scrim) scrim.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      var first = nav.querySelector("a");
      if (first) first.focus();
    }
  }

  function isOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!isOpen());
    });

    if (scrim) {
      scrim.addEventListener("click", function () {
        setNav(false);
      });
    }

    // Close on link tap, on Escape, and when the layout grows past the breakpoint.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        setNav(false);
        toggle.focus();
      }
    });

    var wide = window.matchMedia("(min-width: 761px)");
    var onWide = function (e) {
      if (e.matches && isOpen()) setNav(false);
    };
    if (wide.addEventListener) wide.addEventListener("change", onWide);
    else wide.addListener(onWide);
  }

  /* ---- Header state on scroll ------------------------------ */
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("site-header--solid")) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;height:80px;width:1px;";
    document.body.prepend(sentinel);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          header.classList.toggle("is-stuck", !entries[0].isIntersecting);
        },
        { threshold: 0 }
      ).observe(sentinel);
    } else {
      window.addEventListener("scroll", function () {
        header.classList.toggle("is-stuck", window.scrollY > 80);
      });
    }
  }

  /* ---- Scroll reveal --------------------------------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = Math.min(i, 4) * 70 + "ms";
      io.observe(el);
    });

    // Failsafe: nothing stays hidden, whatever the observer does.
    window.setTimeout(function () {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("is-visible");
      });
    }, 2000);
  }

  /* ---- Copy the email address ------------------------------
     mailto: does nothing on a machine with no mail client set up,
     so every address also has a copy button next to it. */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-copy]"),
    function (btn) {
      var label = btn.textContent.trim();
      var revert;

      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");

        var done = function (ok) {
          btn.textContent = ok ? "Copied" : "Press Ctrl+C";
          btn.classList.toggle("copy-ok", ok);
          window.clearTimeout(revert);
          revert = window.setTimeout(function () {
            btn.textContent = label;
            btn.classList.remove("copy-ok");
          }, 2200);
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(
            function () { done(true); },
            function () { done(false); }
          );
          return;
        }

        // Fallback for pages served over plain http
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:absolute;left:-9999px;top:0;";
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      });
    }
  );

  /* ---- Footer year ----------------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
