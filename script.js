/* ========= Basic helpers ========= */
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

/* ====== Theme (dark/light) with persistence ====== */
(function themeInit(){
  const html = document.documentElement;
  const toggle = $('#theme-toggle');
  if(!toggle) return;

  const saved = localStorage.getItem('site-theme') || 'dark';
  if(saved === 'light') html.classList.add('light');

  toggle.setAttribute('aria-pressed', saved === 'light');
  toggle.setAttribute('aria-label', saved === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  toggle.textContent = (saved === 'light') ? '☀️' : '🌙';

  toggle.addEventListener('click', () => {
    const nowLight = html.classList.toggle('light');
    localStorage.setItem('site-theme', nowLight ? 'light' : 'dark');
    toggle.textContent = nowLight ? '☀️' : '🌙';
    toggle.setAttribute('aria-pressed', nowLight);
    toggle.setAttribute('aria-label', nowLight ? 'Switch to dark mode' : 'Switch to light mode');
  });
})();

/* ====== Mobile nav toggle ====== */
(function mobileNav(){
  const navToggle = $('#nav-toggle');
  const navLinks = $('#main-nav');
  if(!navToggle || !navLinks) return;

  navToggle.setAttribute('aria-expanded', 'false');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  $$('.nav-link').forEach(a => 
    a.addEventListener('click', () => {
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
})();

/* ====== Smooth scroll & active link highlight ====== */
(function navBehaviour(){
  const links = $$('.nav-link');
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  const sections = ['home','about','skills','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const options = {root:null, rootMargin:'-20% 0px -40% 0px', threshold:0};
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      const id = ent.target.id;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if(ent.isIntersecting){
        link && link.classList.add('active');
      } else {
        link && link.classList.remove('active');
      }
    });
  }, options);

  sections.forEach(s => observer.observe(s));
})();

/* ====== Typing effect ====== */
(function typingEffect(){
  const el = document.querySelector('.typing');
  if(!el) return;
  const phrases = ['Full Stack Developer','Problem Solver','Tech Enthusiast'];
  let p = 0, i = 0, forward = true;

  function tick(){
    const text = phrases[p];
    if(forward){
      i++;
      el.textContent = text.slice(0,i);
      if(i === text.length){ forward = false; setTimeout(tick, 1500); return; }
    } else {
      i--;
      el.textContent = text.slice(0,i);
      if(i === 0){ forward = true; p = (p+1)%phrases.length; setTimeout(tick, 300); return; }
    }
    setTimeout(tick, forward ? 90 : 40);
  }
  tick();
})();

/* ====== Animated skill bars when visible ====== */
(function skillBars(){
  const bars = Array.from(document.querySelectorAll('.progress'));
  if(bars.length === 0) return;

  bars.forEach(bar => {
    const span = bar.querySelector('span');
    if(span) span.style.width = '0%';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        const bar = en.target;
        const percent = bar.getAttribute('data-percent') || 0;
        const span = bar.querySelector('span');
        if(span) {
          span.style.transition = 'width 1.2s ease-in-out';
          span.style.width = percent + '%';
        }
        io.unobserve(bar);
      }
    });
  }, {threshold:0.4});
  bars.forEach(b => io.observe(b));
})();

/* ====== Back to top button ====== */
(function backToTop(){
  const btn = $('#topBtn');
  if(!btn) return;
  const showAt = 400;
  btn.style.display = 'none';

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > showAt ? 'block' : 'none';
  });

  btn.addEventListener('click', () => 
    window.scrollTo({top:0, behavior:'smooth'})
  );
})();

/* ====== Fill current year in footer ====== */
(function fillYear(){
  const el = document.getElementById('year');
  if(el) el.textContent = new Date().getFullYear();
})();

/* ====== Projects placeholders ====== */
(function setProjectLinks(){
  // Example:
  // $('#calc-demo')?.setAttribute('href', 'https://your-demo-url');
  // $('#calc-src')?.setAttribute('href', 'https://github.com/...');
})();

/* ====== Contact Form Submission with Formspree ====== */
(function contactFormHandler(){
  const form = document.getElementById("contact-form");
  if(!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      alert("✅ Message sent successfully!");
      form.reset();
    } else {
      alert("❌ Oops! Something went wrong. Please try again.");
    }
  });
})();

/* ====== Fade-in effect on scroll ====== */
(function fadeInOnScroll(){
  const elements = $$("section, .fade-in, img, h1, h2, h3, p, .card");

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});

  elements.forEach(el => io.observe(el));
})();
