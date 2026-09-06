(() => {
  "use strict";

  const body = document.body;
  const portraitButton = document.querySelector("#portrait-button");
  const portrait = document.querySelector("#portrait");
  const pipelineEvent = document.querySelector("#pipeline-event");
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const openSource = portrait?.dataset.openSrc;
  const closedSource = portrait?.dataset.closedSrc;
  let isAwake = false;
  let blinkTimer;

  if (openSource) {
    const openPortrait = new Image();
    openPortrait.src = openSource;
  }

  function swapPortrait(source, switching = false) {
    if (!portrait || !source) return;

    if (switching) {
      portraitButton?.classList.add("is-switching");
      window.setTimeout(() => {
        portrait.src = source;
        requestAnimationFrame(() => portraitButton?.classList.remove("is-switching"));
      }, 105);
      return;
    }

    portrait.src = source;
  }

  function wakePortfolio() {
    if (isAwake) {
      blink();
      return;
    }

    isAwake = true;
    body.dataset.awake = "true";
    portraitButton?.setAttribute("aria-label", "Shaktiranjan is awake. Activate to blink.");
    swapPortrait(openSource, true);
  }

  function blink() {
    if (!portrait || !portraitButton) return;
    window.clearTimeout(blinkTimer);
    portraitButton.classList.add("is-blinking");
    swapPortrait(closedSource);

    blinkTimer = window.setTimeout(() => {
      swapPortrait(openSource);
      portraitButton.classList.remove("is-blinking");
    }, 180);
  }

  portraitButton?.setAttribute("aria-label", "Touch to open Shaktiranjan's eyes and reveal the portfolio.");
  portraitButton?.addEventListener("click", wakePortfolio);

  portraitButton?.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || reducedMotion.matches) return;
    const bounds = portraitButton.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portraitButton.style.setProperty("--ry", `${x * 7}deg`);
    portraitButton.style.setProperty("--rx", `${y * -7}deg`);
  });

  portraitButton?.addEventListener("pointerleave", () => {
    portraitButton.style.setProperty("--ry", "0deg");
    portraitButton.style.setProperty("--rx", "0deg");
  });

  const events = [
    "SQL change detected · watermark advanced",
    "Kafka events received · micro-batch ready",
    "ADF trigger fired · dependencies resolved",
    "ADLS landing complete · Parquet validated",
    "PySpark transform running · partitions tuned",
    "Delta merge complete · quality gates passed",
    "Gold tables refreshed · insight ready"
  ];
  let eventIndex = 0;

  function rotatePipelineStatus() {
    if (!pipelineEvent) return;
    eventIndex = (eventIndex + 1) % events.length;
    pipelineEvent.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-4px)" }],
      { duration: 170, fill: "forwards" }
    ).finished.then(() => {
      pipelineEvent.textContent = events[eventIndex];
      pipelineEvent.animate(
        [{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 230, fill: "forwards" }
      );
    }).catch(() => {});
  }

  if (!reducedMotion.matches) {
    window.setInterval(rotatePipelineStatus, 2200);
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px" });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks?.classList.toggle("open", !isOpen);
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  setupDataCanvas();

  function setupDataCanvas() {
    const canvas = document.querySelector("#data-canvas");
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const points = [];
    const packets = [];
    let width = 0;
    let height = 0;
    let ratio = 1;
    let animationFrame = 0;

    function resize() {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createField();
    }

    function createField() {
      points.length = 0;
      packets.length = 0;
      const columns = Math.max(6, Math.floor(width / 180));
      const rows = Math.max(4, Math.floor(height / 160));

      for (let row = 0; row <= rows; row += 1) {
        for (let column = 0; column <= columns; column += 1) {
          points.push({
            x: (column / columns) * width + (Math.random() - 0.5) * 55,
            y: (row / rows) * height + (Math.random() - 0.5) * 45,
            z: Math.random(),
            phase: Math.random() * Math.PI * 2
          });
        }
      }

      for (let index = 0; index < 14; index += 1) {
        packets.push({
          progress: Math.random(),
          speed: 0.000035 + Math.random() * 0.000045,
          lane: Math.random(),
          hue: index % 3
        });
      }
    }

    function draw(timestamp) {
      context.clearRect(0, 0, width, height);
      const drift = timestamp * 0.00008;
      const maxDistance = Math.max(155, width / 7);

      points.forEach((point, index) => {
        const px = point.x + Math.sin(drift + point.phase) * 12 * point.z;
        const py = point.y + Math.cos(drift * 0.8 + point.phase) * 8 * point.z;

        for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
          const next = points[nextIndex];
          const distance = Math.hypot(point.x - next.x, point.y - next.y);
          if (distance < maxDistance) {
            context.strokeStyle = `rgba(80, 159, 195, ${0.055 * (1 - distance / maxDistance)})`;
            context.lineWidth = 0.65;
            context.beginPath();
            context.moveTo(px, py);
            context.lineTo(next.x, next.y);
            context.stroke();
          }
        }

        context.fillStyle = `rgba(128, 205, 232, ${0.16 + point.z * 0.17})`;
        context.beginPath();
        context.arc(px, py, 0.65 + point.z * 1.1, 0, Math.PI * 2);
        context.fill();
      });

      packets.forEach((packet) => {
        packet.progress = (packet.progress + packet.speed * 16.7) % 1;
        const x = packet.progress * (width + 180) - 90;
        const baseY = height * (0.16 + packet.lane * 0.68);
        const y = baseY + Math.sin(packet.progress * Math.PI * 3 + packet.lane * 8) * 55;
        const colors = ["50, 199, 243", "169, 240, 95", "168, 148, 255"];
        const color = colors[packet.hue];

        context.strokeStyle = `rgba(${color}, 0.1)`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x - 58, y);
        context.lineTo(x, y);
        context.stroke();

        context.fillStyle = `rgba(${color}, 0.72)`;
        context.shadowColor = `rgba(${color}, 0.8)`;
        context.shadowBlur = 10;
        context.beginPath();
        context.arc(x, y, 2.2, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (reducedMotion.matches) {
      draw(0);
      cancelAnimationFrame(animationFrame);
    } else {
      animationFrame = requestAnimationFrame(draw);
    }
  }
})();
