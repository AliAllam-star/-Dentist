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

  /* ---------- 7) نموذج الحجز والتحويل للواتساب ---------- */
  var form = document.getElementById('bookingForm');
  var success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // منع الإرسال الافتراضي

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // 1. جلب البيانات من الحقول بدقة وقت الضغط
      var nameEl = document.getElementById('name');
      var phoneEl = document.getElementById('phone');
      var serviceEl = document.getElementById('service');
      var dateEl = document.getElementById('date');
      var messageEl = document.getElementById('message');

      var name = nameEl ? nameEl.value.trim() : "";
      var phone = phoneEl ? phoneEl.value.trim() : "";
      var date = dateEl ? dateEl.value : "";
      
      // جلب نص الخدمة المختارة
      var serviceText = "";
      if (serviceEl && serviceEl.selectedIndex !== -1 && serviceEl.value !== "") {
        serviceText = serviceEl.options[serviceEl.selectedIndex].text.trim();
      }

      var notes = (messageEl && messageEl.value.trim() !== "") ? messageEl.value.trim() : "لا يوجد";
      
    var messageLines = [
    `*طلب حجز جديد* 📌`,
    ``,
    `👤 *الاسم:* ${name}`,
    `📞 *رقم الهاتف:* ${phone}`,
    `🛠️ *الخدمة المطلوبة:* `+ serviceText,
    `📅 *التاريخ المفضل:* ` + (date || 'غير محدد'),
    `📝 *الملاحظات:* ${notes || 'لا يوجد'}`
  ]
      // ضع رقم الواتسآب الخاص بك هنا مع كود الدولة وبدون علامة +
      var myWhatsAppNumber = "201140286051"; 

      // 3. تشفير الرسالة وتجهيز الرابط
      var fullMessage = messageLines.join('\n');
      var encodedMessage = encodeURIComponent(fullMessage);
      var whatsappUrl = "https://api.whatsapp.com/send?phone=" + myWhatsAppNumber + "&text=" + encodedMessage;

      // 4. إظهار رسالة النجاح وتفريغ الحقول
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () {
          success.hidden = true;
        }, 6000);
      }

      form.reset();

      // 5. التحويل المباشر لصفحة الواتساب
      window.open(whatsappUrl, '_blank');
    });
  }

  /* ---------- 8) تحديث سنة التذييل ---------- */
  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

})(); // إغلاق دالة الـ IIFE المفقودة
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll("[data-ba-slider]");

  sliders.forEach((slider) => {
    const range = slider.querySelector("[data-ba-range]");
    const afterImgWrapper = slider.querySelector("[data-ba-after]");
    const afterImg = afterImgWrapper.querySelector(".ba-img--after");
    const divider = slider.querySelector("[data-ba-divider]");

    const updateSlider = (value) => {
      // تحديث عرض الطبقة والفاصل بناءً على نسبة الشريط
      afterImgWrapper.style.width = `${value}%`;
      divider.style.right = `${value}%`;

      // اضبط عرض الصورة العلوية لتطابق عرض الكارت الأصلي لعدم مطها
      const sliderWidth = slider.offsetWidth;
      afterImg.style.width = `${sliderWidth}px`;
    };

    range.addEventListener("input", (e) => {
      updateSlider(e.target.value);
    });

    // إعادة الضبط عند تغيير حجم الشاشة
    window.addEventListener("resize", () => {
      updateSlider(range.value);
    });

    updateSlider(50);
  });
});
// نصوص المقالات الكاملة
const articlesData = {
  "article-1": {
    title: "دليلك الشامل لزراعة الأسنان: الأهمية والخطوات",
    content: `
      <p>تعتبر زراعة الأسنان الخيار الخيار الأمثل والأنسب لتعويض الأسنان المفقودة، حيث تعيد للفك قدرته الطبيعية على المضغ والكلام دون التأثير على الأسنان المجاورة.</p>
      <h4>ما هي زراعة الأسنان؟</h4>
      <p>هي عملية تثبيت جذر اصطناعي مصنوع من مادة التيتانيوم الآمنة داخل عظم الفك، يلتحم مع العظم ليصبح قاعدة قوية لتركيب السن الجديد.</p>
      <h4>أهمية زراعة الأسنان:</h4>
      <p>• حماية عظام الفك من الضمور والآتكل بعد فقدان السن.<br>
      • الحفاظ على المظهر الطبيعي واستعادة الثقة بالنفس.<br>
      • منع تحرك الأسنان المجاورة من مكانها الصحيح.</p>
      <h4>ما الذي يحجم المرضى عن الزراعة؟</h4>
      <p>الخوف من الألم أو الاعتقاد بأن التكلفة مرتفعة، ولكن مع التخدير الرقمي والتقنيات الحديثة أصبحت العملية بدون ألم ونسبة نجاحها تتجاوز 98%.</p>
    `
  },
  "article-2": {
    title: "متى تحتاج لتقويم الأسنان؟ وما هي أنواعه؟",
    content: `
      <p>تقويم الأسنان ليس مجرد إجراء جمالي، بل هو خطوة علاجية أساسية لتعديل اصطفاف الأسنان وتحسين أداء الفكين.</p>
      <h4>فوائد وأهمية التقويم:</h4>
      <p>• تحسين عملية مضغ الطعام وتخفيف العبء على الجهاز الهضمي.<br>
      • تسهيل تنظيف الأسنان وتقليل فرص حدوث التسوس وأمراض اللثة.<br>
      • معالجة مشاكل النطق والتأتأة الناتجة عن عدم انتظام الأسنان.</p>
      <h4>أنواع التقويم المتاحة:</h4>
      <p><strong>1. التقويم المعدني:</strong> الأكثر شيوعاً وفاعلية للحالات المركبة.<br>
      <strong>2. التقويم الشفاف (Invisalign):</strong> قالب شفاف قابل للإزالة ومخفي تماماً أثناء الابتسامة.</p>
    `
  },
  "article-3": {
    title: "ابتسامة هوليوود: بين الحقيقة والتجميل العصري",
    content: `
      <p>ابتسامة هوليوود هي إجراء تجميلي يهدف إلى تغطية عيوب الأسنان الخارجية عبر قشور خزفية رقيقة (الفينير) توضع على السطح الخارجي للسن.</p>
      <h4>متى تحتاج لابتسامة هوليوود؟</h4>
      <p>• وجود تصبغات دائمة لا تزول بالتبييض التقليدي.<br>
      • وجود كسور بسيطة أو شقوق في الأسنان الأمامية.<br>
      • وجود فراغات بين الأسنان ترغب في إخفائها سريعاً.</p>
      <h4>أهمية العناية بعد الإجراء:</h4>
      <p>تستمر نتائج الفينير لأكثر من 10 إلى 15 سنة عند الالتزام بالتنظيف اليومي وزيارة الطبيب بشكل دوري للحفاظ على بريقها.</p>
    `
  }
};

// تشغيل النافذة المنبثقة للـ Modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("articleModal");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const modalOverlay = document.getElementById("modalOverlay");

  document.querySelectorAll(".btn-read-more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const articleKey = btn.getAttribute("data-article");
      const article = articlesData[articleKey];

      if (article) {
        modalBody.innerHTML = `<h2>${article.title}</h2>${article.content}`;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
});