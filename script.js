/**
 * ====================================================================
 * BENJIE B. PAHAMUTANG - HIGH PERFORMANCE PORTFOLIO ENGINE
 * Full-featured interactive engine with canvas particles, terminal emulator,
 * skill filtering, section scroll reveals, theme toggler, and counters.
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Init all modules
  initThemeManager();
  initNavigation();
  initParticleCanvas();
  initTypingEffect();
  initAnimatedCounters();
  initScrollReveals();
  initSkillFilter();
  initInteractiveTerminal();
  initContactForm();
  initBackToTop();
});

/* ====================================================================
   1. THEME MANAGER MODULE (Dark / Light Mode)
   ==================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById("themeToggle");
  const htmlTag = document.documentElement;
  
  // Check cached local theme
  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
  htmlTag.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlTag.getAttribute("data-theme");
      const targetTheme = currentTheme === "dark" ? "light" : "dark";
      
      htmlTag.setAttribute("data-theme", targetTheme);
      localStorage.setItem("portfolio_theme", targetTheme);
      updateThemeIcon(targetTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#themeToggle i");
  if (!icon) return;
  if (theme === "dark") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}

/* ====================================================================
   2. NAVIGATION & SCROLL PROGRESS MODULE
   ==================================================================== */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-item");
  const progressBar = document.getElementById("progressBar");

  // Scroll Event Listener
  window.addEventListener("scroll", () => {
    // Navbar glass effect on scroll
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Update Scroll Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + "%";

    // Active Section Tracking
    const sections = document.querySelectorAll("section");
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });

  // Hamburger Mobile Toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking links
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("active");
      });
    });
  }
}

/* ====================================================================
   3. BACKGROUND CANVAS PARTICLES SYSTEM
   ==================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById("bg-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const particleCount = 65;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = "rgba(0, 210, 255, 0.4)";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Draw connecting lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.strokeStyle = `rgba(0, 210, 255, ${1 - distance / 110})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ====================================================================
   4. TYPING EFFECT MODULE
   ==================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById("typingEffect");
  if (!typingElement) return;

  const words = [
    "BENJIE B. PAHAMUTANG",
    "SOFTWARE DEVELOPER",
    "HARDWARE INTEGRATOR",
    "AI SOLUTIONS ARCHITECT"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2200; // Pause at top
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ====================================================================
   5. ANIMATED STAT COUNTERS
   ==================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll(".counter");
  let animated = false;

  function startCounters() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const speed = target / 50;

      const updateCount = () => {
        const count = +counter.innerText;
        if (count < target) {
          counter.innerText = Math.ceil(count + speed);
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target + "+";
        }
      };

      updateCount();
    });
  }

  window.addEventListener("scroll", () => {
    const heroSection = document.getElementById("home");
    if (!heroSection) return;
    const sectionPos = heroSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight;

    if (sectionPos < screenPos && !animated) {
      startCounters();
      animated = true;
    }
  });
}

/* ====================================================================
   6. SCROLL REVEAL ANIMATION MODULE
   ==================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll(".reveal");

  function checkReveal() {
    const windowHeight = window.innerHeight;
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      const revealPoint = 120;

      if (elementTop < windowHeight - revealPoint) {
        reveal.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", checkReveal);
  checkReveal(); // Trigger once on load
}

/* ====================================================================
   7. SKILL FILTER SYSTEM MODULE
   ==================================================================== */
function initSkillFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-tag-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      skillCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";
          setTimeout(() => (card.style.opacity = "1"), 50);
        } else {
          card.style.opacity = "0";
          setTimeout(() => (card.style.display = "none"), 300);
        }
      });
    });
  });
}

/* ====================================================================
   8. INTERACTIVE TERMINAL EMULATOR MODULE
   ==================================================================== */
function initInteractiveTerminal() {
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");
  if (!input || !output) return;

  const commands = {
    help: "Available Commands: <br>&bull; <b>about</b> - Summary profile<br>&bull; <b>skills</b> - View core technical stack<br>&bull; <b>projects</b> - List flagship developments<br>&bull; <b>contact</b> - View communication lines<br>&bull; <b>clear</b> - Clear terminal window",
    about: "Benjie B. Pahamutang - Software Developer, Hardware Integrator & Systems Engineer passionate about high performance code.",
    skills: "Python (92%), HTML/CSS (95%), JavaScript ES6+ (88%), Arduino & IoT (85%), MySQL (87%), Git (89%), REST APIs (84%)",
    projects: "1. Automated Queueing System<br>2. Teamtea POS System<br>3. AI Interactive Fitness Coach",
    contact: "Email: pahamutangbenjie85@gmail.com | Phone: +63 997 294 7697"
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value.trim().toLowerCase();
      input.value = "";

      // Append user line
      const userLine = document.createElement("p");
      userLine.className = "term-line";
      userLine.innerHTML = `<span class="term-green">benjie@portfolio:~$</span> ${val}`;
      output.appendChild(userLine);

      if (val === "clear") {
        output.innerHTML = `<p class="term-line"><span class="term-green">benjie@portfolio:~$</span> Terminal cleared. Type 'help' for options.</p>`;
        return;
      }

      // Output response
      const responseLine = document.createElement("p");
      responseLine.className = "term-line term-response";

      if (commands[val]) {
        responseLine.innerHTML = commands[val];
      } else if (val === "") {
        return;
      } else {
        responseLine.innerHTML = `Command not recognized: '<span class="term-red">${val}</span>'. Type 'help' for options.`;
      }

      output.appendChild(responseLine);
      output.scrollTop = output.scrollHeight;
    }
  });
}

/* ====================================================================
   9. CONTACT FORM VALIDATOR AND AJAX SIMULATION
   ==================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.style.color = "#ff4757";
      formStatus.textContent = "Please fill out all required fields.";
      return;
    }

    // UI Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;
    formStatus.style.color = "var(--primary-glow)";
    formStatus.textContent = "Connecting to mail server...";

    // Simulated Server Network Delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> <i class="fas fa-paper-plane"></i>`;
      formStatus.style.color = "#2ed573";
      formStatus.textContent = "✔ Thank you! Your message has been transmitted successfully.";
      form.reset();
    }, 1500);
  });
}

/* ====================================================================
   10. BACK TO TOP BUTTON
   ==================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}