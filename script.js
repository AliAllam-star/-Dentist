/* =====================================================================
   عيادة بريق للأسنان — سكربت التفاعلات
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 1) قائمة الموبايل ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    });

    // إغلاق القائمة عند الضغط على أي رابط
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2) ظل الترويسة عند التمرير ---------- */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* ---------- 3) تحديد رابط القسم النشط ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = nav ? nav.querySelectorAll('a') : [];

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- 4) أنيميشن الظهور عند التمرير ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 5) عدّاد الإحصائيات ---------- */
  var counters = document.querySelectorAll('.stat strong[data-count]');
  var countersDone = false;

  function runCounters() {
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var duration = 1600;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString('en-US') + (progress === 1 && target >= 1000 ? '+' : '');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('en-US') + (target >= 1000 ? '+' : '');
      }
      requestAnimationFrame(step);
    });
  }

  var statsSection = document.querySelector('.stats');
  if (statsSection && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersDone) {
          countersDone = true;
          runCounters();
        }
      });
    }, { threshold: 0.4 });
    statObserver.observe(statsSection);
  } else {
    runCounters();
  }

  /* ---------- 6) سلايدر آراء العملاء ---------- */
  var track = document.getElementById('testiTrack');
  var dotsWrap = document.getElementById('testiDots');

  if (track && dotsWrap) {
    var slides = track.children;
    var count = slides.length;
    var current = 0;
    var timer = null;

    for (var i = 0; i < count; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'الرأي رقم ' + (i + 1));
      dot.dataset.index = i;
      dotsWrap.appendChild(dot);
    }
    var dots = dotsWrap.children;

    function goTo(index) {
      current = (index + count) % count;
      // اتجاه RTL: نحرّك بالموجب
      track.style.transform = 'translateX(' + (current * 100) + '%)';
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('active', d === current);
      }
    }

    dotsWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      goTo(parseInt(btn.dataset.index, 10));
      restart();
    });

    function next() { goTo(current + 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 5000); }

    goTo(0);
    restart();

    var wrap = track.parentElement;
    wrap.addEventListener('mouseenter', function () { clearInterval(timer); });
    wrap.addEventListener('mouseleave', restart);
  }

  /* ---------- 7) نموذج الحجز ---------- */
  var form = document.getElementById('bookingForm');
  var success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // هنا يمكنك ربط النموذج بخدمة بريد أو واتساب أو API خاص بك
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      setTimeout(function () { if (success) success.hidden = true; }, 6000);
    });
  }

  /* ---------- 8) سنة التذييل ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const phoneNumber = "201000000000"; // اكتب رقمك هنا

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const service = document.getElementById('service').value;
  const notes = document.getElementById('message').value;

  // المصفوفة مع الإيموجيز
  const messageLines = [
    `📌 *طلب حجز جديد* 📌`,
    ``,
    `👤 *الاسم:* ${name}`,
    `📞 *رقم الهاتف:* ${phone}`,
    `🛠️ *الخدمة المطلوبة:* ${service}`,
    `📝 *الملاحظات:* ${notes || 'لا يوجد'}`
  ];

  // تشفير كل سطر والربط بـ %0A للسطر الجديد
  const fullText = messageLines
    .map(line => encodeURIComponent(line))
    .join('%0A');

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${fullText}`;
  
  window.open(whatsappUrl, '_blank');
  this.reset();
});