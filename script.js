/* =========================================================================
   PAINT'S GALLERY — script.js
   Vanilla JS only. No dependencies.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- LOADER ---------- */
  var loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () { loader.classList.add('hide'); }, 400);
  });
  // Fallback in case 'load' already fired or is slow
  setTimeout(function () { loader.classList.add('hide'); }, 2500);

  /* ---------- SCROLL PROGRESS BAR + NAVBAR + ACTIVE LINK + BACK TO TOP (CONSOLIDATED) ---------- */
  var progressBar = document.getElementById('scrollProgress');
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('main > section[id], .section[id]');
  var backToTop = document.getElementById('backToTop');

  // Cache section positions for active link calculation
  var sectionPositions = [];
  function cacheSectionPositions() {
    sectionPositions = [];
    sections.forEach(function (sec) {
      sectionPositions.push({
        id: sec.id,
        top: sec.offsetTop
      });
    });
  }
  cacheSectionPositions();
  // Recalculate on resize (debounced)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(cacheSectionPositions, 150);
  }, { passive: true });

  // Single rAF loop for all scroll-dependent updates
  var scrollScheduled = false;
  function onScroll() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Progress bar
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';

      // Navbar shrink
      if (scrollTop > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      // Active link (using cached positions)
      var scrollPos = scrollTop + 160;
      var current = 'home';
      for (var i = 0; i < sectionPositions.length; i++) {
        if (scrollPos >= sectionPositions[i].top) current = sectionPositions[i].id;
      }
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.dataset.section === current);
      });

      // Back to top
      backToTop.classList.toggle('show', scrollTop > 500);

      scrollScheduled = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- MOBILE NAV TOGGLE ---------- */
 const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("navLinks");

if (mobileMenuBtn && mobileNav) {

    mobileMenuBtn.addEventListener("click", function () {

        mobileMenuBtn.classList.toggle("menu-open");
        mobileNav.classList.toggle("open");

    });

    mobileNav.querySelectorAll("a").forEach(function(link){

        link.addEventListener("click", function(){

            mobileMenuBtn.classList.remove("menu-open");
            mobileNav.classList.remove("open");

        });

    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {

        if (
            mobileNav.classList.contains("open") &&
            !mobileNav.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)
        ) {
            mobileNav.classList.remove("open");
            mobileMenuBtn.classList.remove("menu-open");
        }

    });

}


  /* ---------- CURSOR GLOW (disabled on touch devices) ---------- */
  var cursorGlow = document.getElementById('cursorGlow');
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice && cursorGlow) {
    var cursorScheduled = false;
    window.addEventListener('mousemove', function (e) {
      if (cursorScheduled) return;
      cursorScheduled = true;
      requestAnimationFrame(function () {
        cursorGlow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
        cursorScheduled = false;
      });
    }, { passive: true });
  }

  

  /* ---------- HERO MOUSE PARALLAX (throttled, transform3d) ---------- */
  var heroFrame = document.getElementById('heroParallax');
  var heroSection = document.getElementById('heroSection');
  if (heroFrame && heroSection) {
    var parallaxScheduled = false;
    var heroRect = heroSection.getBoundingClientRect();
    // Update rect on scroll/resize
    window.addEventListener('scroll', function () {
      heroRect = heroSection.getBoundingClientRect();
    }, { passive: true });
    window.addEventListener('resize', function () {
      heroRect = heroSection.getBoundingClientRect();
    }, { passive: true });

    heroSection.addEventListener('mousemove', function (e) {
      if (parallaxScheduled) return;
      parallaxScheduled = true;
      requestAnimationFrame(function () {
        var x = (e.clientX - heroRect.left) / heroRect.width - 0.5;
        var y = (e.clientY - heroRect.top) / heroRect.height - 0.5;
        // Use transform3d instead of rotate for better performance
        heroFrame.style.transform = 'perspective(1000px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateZ(0)';
        parallaxScheduled = false;
      });
    }, { passive: true });
    heroSection.addEventListener('mouseleave', function () {
      heroFrame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal-up');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- BUTTON RIPPLE EFFECT ---------- */
  document.querySelectorAll('.ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var circle = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-effect';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 650);
    });
  });

  /* ---------- ANIMATED COUNTERS ---------- */
  var counters = document.querySelectorAll('.counter');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.target, 10);
      var duration = 1600;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  
  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });



  /* ---------- BACK TO TOP ---------- */
  var backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- IMAGE FALLBACKS FOR SIMPLE <img> (non wrapped) ---------- */
  document.querySelectorAll('.logo-track img').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
  });

  /* ---------- INITIAL CALLS ---------- */
  updateProgress();
  updateNavbar();
  updateActiveLink();
  toggleBackToTop();
});

/* =========================================================================
   PAINT ESTIMATION CALCULATOR MODULE
   Self-contained. All identifiers are calc-prefixed and scoped inside this
   listener so nothing here can collide with the rest of the site's script.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var calcForm = document.getElementById('calcForm');
  if (!calcForm) return; // module not present on this page

  /* ---------- product data ---------- */
  var CALC_INTERIOR_PRODUCTS = [
    { name: 'Impression Eco Clean',   covMin: 22.30, covMax: 23.23, coats: 2 },
    { name: 'Impression HD',          covMin: 20.45, covMax: 22.30, coats: 2 },
    { name: 'Beauty Gold Washable',   covMin: 22.30, covMax: 24.16, coats: 2 },
    { name: 'Beauty Gold Classic',    covMin: 20.45, covMax: 22.30, coats: 2 },
    { name: 'Beauty Little Master',   covMin: 20.45, covMax: 22.30, coats: 2 }
  ];
  var CALC_EXTERIOR_PRODUCTS = [
    { name: 'Nerolac Excel Total',        covMin: 13.01, covMax: 14.87, coats: 1 },
    { name: 'Nerolac Excel Everlast',     covMin: 5.57,  covMax: 6.03,  coats: 2 },
    { name: 'Nerolac Excel Mica Marble',  covMin: 9.29,  covMax: 11.15, coats: 1 },
    { name: 'Nerolac Excel Anti Peel',    covMin: 9.29,  covMax: 11.15, coats: 1 },
    { name: 'Nerolac Surakshya Plus+',    covMin: 9.29,  covMax: 11.15, coats: 1 }
  ];
  var CALC_SURFACE_FACTORS = { 'new': 1.0, repainted: 0.95, absorbent: 1.15, smooth: 0.90 };
  var CALC_FT_TO_M = 0.3048;

  /* ---------- element refs ---------- */
  var calcCalculateBtn = document.getElementById('calcCalculateBtn');
  var calcResetBtn = document.getElementById('calcResetBtn');
  var calcResultsWrap = document.getElementById('calcResults');

  var calcStep2 = document.getElementById('calcStep2');
  var calcStep2Error = document.getElementById('calcStep2Error');
  var calcStep4Error = document.getElementById('calcStep4Error');

  var calcInteriorPanel = document.getElementById('calcInteriorPanel');
  var calcExteriorPanel = document.getElementById('calcExteriorPanel');
  var calcRoomsWrap = document.getElementById('calcRoomsWrap');
  var addRoomBtn = document.getElementById('addRoomBtn');
  var calcInteriorTotalEl = document.getElementById('calcInteriorTotal');

  var calcToggleDefaults = document.getElementById('calcToggleDefaults');
  var calcDefaultsPanel = document.getElementById('calcDefaultsPanel');
  var calcDoorW = document.getElementById('calcDoorW');
  var calcDoorH = document.getElementById('calcDoorH');
  var calcWindowW = document.getElementById('calcWindowW');
  var calcWindowH = document.getElementById('calcWindowH');

  var calcExtUnit = document.getElementById('calcExtUnit');
  var calcExtLength = document.getElementById('calcExtLength');
  var calcExtWidth = document.getElementById('calcExtWidth');
  var calcExtHeight = document.getElementById('calcExtHeight');
  var calcExtFloors = document.getElementById('calcExtFloors');
  var calcExtDoors = document.getElementById('calcExtDoors');
  var calcExtWindows = document.getElementById('calcExtWindows');
  var calcHasCompound = document.getElementById('calcHasCompound');
  var calcCompoundFields = document.getElementById('calcCompoundFields');
  var calcCompoundLength = document.getElementById('calcCompoundLength');
  var calcCompoundHeight = document.getElementById('calcCompoundHeight');
  var calcHasPillars = document.getElementById('calcHasPillars');
  var calcPillarFields = document.getElementById('calcPillarFields');
  var calcPillarArea = document.getElementById('calcPillarArea');
  var calcExteriorTotalEl = document.getElementById('calcExteriorTotal');

  var calcPaintGrid = document.getElementById('calcPaintGrid');
  var calcCoatsInput = document.getElementById('calcCoats');
  var calcDarkShade = document.getElementById('calcDarkShade');
  var calcDarkWarning = document.getElementById('calcDarkWarning');
  var calcIncludeAdvanced = document.getElementById('calcIncludeAdvanced');
  var calcAdvancedFields = document.getElementById('calcAdvancedFields');
  var calcPrimerNeeded = document.getElementById('calcPrimerNeeded');
  var calcPuttyNeeded = document.getElementById('calcPuttyNeeded');
  var calcPricePerLitre = document.getElementById('calcPricePerLitre');

  var resArea = document.getElementById('resArea');
  var resPaint = document.getElementById('resPaint');
  var resCoverage = document.getElementById('resCoverage');
  var resCoats = document.getElementById('resCoats');
  var resMin = document.getElementById('resMin');
  var resEst = document.getElementById('resEst');
  var resMax = document.getElementById('resMax');
  var resPacks = document.getElementById('resPacks');
  var resAdvancedWrap = document.getElementById('resAdvancedWrap');
  var resPrimer = document.getElementById('resPrimer');
  var resPutty = document.getElementById('resPutty');
  var resCostWrap = document.getElementById('resCostWrap');
  var resCost = document.getElementById('resCost');

  /* ---------- state ---------- */
  var calcRoomCount = 0;
  var calcInteriorAreaTotal = 0;
  var calcExteriorAreaTotal = 0;

  /* ---------- helpers ---------- */
  function getProjectType() {
    var el = document.querySelector('input[name="calcProjectType"]:checked');
    return el ? el.value : 'interior';
  }
  function getProductsForType() {
    return getProjectType() === 'interior' ? CALC_INTERIOR_PRODUCTS : CALC_EXTERIOR_PRODUCTS;
  }
  function getSelectedPaintIndex() {
    var el = document.querySelector('input[name="calcPaint"]:checked');
    return el ? parseInt(el.value, 10) : 0;
  }
  function toMeters(value, unit) { return unit === 'ft' ? value * CALC_FT_TO_M : value; }

  /* ---------- single-page Calculate / Reset ---------- */
  calcCalculateBtn.addEventListener('click', function () {
    calcStep2Error.textContent = '';
    calcStep4Error.textContent = '';

    if (!validateStep2()) {
      calcResultsWrap.classList.remove('show');
      document.getElementById('calcStep2').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!validateStep4()) {
      calcResultsWrap.classList.remove('show');
      document.getElementById('calcStep4').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    calculateResults();
    calcResultsWrap.classList.add('show');
    calcResultsWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  calcResetBtn.addEventListener('click', resetCalculator);

  calcForm.addEventListener('submit', function (e) { e.preventDefault(); });

  /* ---------- project type toggle ---------- */
  document.querySelectorAll('input[name="calcProjectType"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var type = getProjectType();
      calcInteriorPanel.style.display = (type === 'interior') ? 'block' : 'none';
      calcExteriorPanel.style.display = (type === 'exterior') ? 'block' : 'none';
      populatePaintGrid();
    });
  });

  /* ---------- ROOM REPEATER (interior) ---------- */
  function roomTemplate() {
    return '' +
      '<div class="calc-room-head">' +
        '<input type="text" class="calc-room-name calc-input" placeholder="Room name (optional)">' +
        '<button type="button" class="calc-room-remove">Remove</button>' +
      '</div>' +
      '<div class="calc-field-row calc-field-row-3">' +
        '<div class="calc-field"><label>Length</label><input type="number" class="calc-room-length calc-input" min="0.1" step="0.1" placeholder="e.g. 12"></div>' +
        '<div class="calc-field"><label>Width</label><input type="number" class="calc-room-width calc-input" min="0.1" step="0.1" placeholder="e.g. 10"></div>' +

        '<div class="calc-field"><label>Height</label><input type="number" class="calc-room-height calc-input" min="0.1" step="0.1" placeholder="e.g. 9"></div>' +
      '</div>' +
      '<div class="calc-field-row calc-field-row-3">' +
        '<div class="calc-field"><label>Unit</label><select class="calc-room-unit calc-input"><option value="ft">Feet</option><option value="m">Meter</option></select></div>' +
        '<div class="calc-field"><label>Doors</label><input type="number" class="calc-room-doors calc-input" min="0" step="1" value="1"></div>' +
        '<div class="calc-field"><label>Windows</label><input type="number" class="calc-room-windows calc-input" min="0" step="1" value="1"></div>' +
      '</div>' +
      '<label class="calc-checkbox-row"><input type="checkbox" class="calc-room-ceiling" checked><span>Include ceiling</span></label>' +
      '<div class="calc-room-area">Area: <strong class="calc-room-area-value">0 m²</strong></div>';
  }

  function addRoom() {
    calcRoomCount++;
    var div = document.createElement('div');
    div.className = 'calc-room';
    div.dataset.roomId = 'room' + calcRoomCount;
    div.innerHTML = roomTemplate();
    calcRoomsWrap.appendChild(div);
    updateRoomRemoveButtons();
    recalcInterior();
  }

  function updateRoomRemoveButtons() {
    var rooms = calcRoomsWrap.querySelectorAll('.calc-room');
    rooms.forEach(function (r) {
      var btn = r.querySelector('.calc-room-remove');
      btn.style.visibility = rooms.length > 1 ? 'visible' : 'hidden';
    });
  }

  addRoomBtn.addEventListener('click', addRoom);

  calcRoomsWrap.addEventListener('click', function (e) {
    if (e.target.classList.contains('calc-room-remove')) {
      var rooms = calcRoomsWrap.querySelectorAll('.calc-room');
      if (rooms.length > 1) {
        e.target.closest('.calc-room').remove();
        updateRoomRemoveButtons();
        recalcInterior();
      }
    }
  });

  calcToggleDefaults.addEventListener('click', function () {
    calcDefaultsPanel.classList.toggle('open');
    calcToggleDefaults.textContent = calcDefaultsPanel.classList.contains('open') ? 'Hide door/window sizes' : 'Edit door/window sizes';
  });

  /* ---------- recalculation ---------- */
  function recalcInterior() {
    var doorW = parseFloat(calcDoorW.value) || 0.9, doorH = parseFloat(calcDoorH.value) || 2.1;
    var winW = parseFloat(calcWindowW.value) || 1.2, winH = parseFloat(calcWindowH.value) || 1.2;
    var total = 0;

    calcRoomsWrap.querySelectorAll('.calc-room').forEach(function (room) {
      var unit = room.querySelector('.calc-room-unit').value;
      var L = toMeters(parseFloat(room.querySelector('.calc-room-length').value) || 0, unit);
      var W = toMeters(parseFloat(room.querySelector('.calc-room-width').value) || 0, unit);
      var H = toMeters(parseFloat(room.querySelector('.calc-room-height').value) || 0, unit);
      var doors = parseFloat(room.querySelector('.calc-room-doors').value) || 0;
      var windows = parseFloat(room.querySelector('.calc-room-windows').value) || 0;
      var hasCeiling = room.querySelector('.calc-room-ceiling').checked;

      var wallArea = 2 * (L + W) * H;
      var ceilingArea = hasCeiling ? (L * W) : 0;
      var deduction = (doors * doorW * doorH) + (windows * winW * winH);
      var area = Math.max(0, wallArea + ceilingArea - deduction);

      room.querySelector('.calc-room-area-value').textContent = area.toFixed(1) + ' m²';
      total += area;
    });

    calcInteriorAreaTotal = total;
    calcInteriorTotalEl.textContent = total.toFixed(1) + ' m²';
  }

  function recalcExterior() {
    var unit = calcExtUnit.value;
    var L = toMeters(parseFloat(calcExtLength.value) || 0, unit);
    var W = toMeters(parseFloat(calcExtWidth.value) || 0, unit);
    var H = toMeters(parseFloat(calcExtHeight.value) || 0, unit);
    var floors = parseFloat(calcExtFloors.value) || 1;
    var doors = parseFloat(calcExtDoors.value) || 0;
    var windows = parseFloat(calcExtWindows.value) || 0;
    var doorW = parseFloat(calcDoorW.value) || 0.9, doorH = parseFloat(calcDoorH.value) || 2.1;
    var winW = parseFloat(calcWindowW.value) || 1.2, winH = parseFloat(calcWindowH.value) || 1.2;

    var perimeter = 2 * (L + W);
    var totalHeight = H * floors;
    var wallArea = perimeter * totalHeight;
    var deduction = (doors * doorW * doorH) + (windows * winW * winH);

    var compoundArea = 0;
    if (calcHasCompound.checked) {
      var cl = toMeters(parseFloat(calcCompoundLength.value) || 0, unit);
      var ch = toMeters(parseFloat(calcCompoundHeight.value) || 0, unit);
      compoundArea = cl * ch;
    }
    var pillarArea = calcHasPillars.checked ? (parseFloat(calcPillarArea.value) || 0) : 0;

    var total = Math.max(0, wallArea - deduction + compoundArea + pillarArea);
    calcExteriorAreaTotal = total;
    calcExteriorTotalEl.textContent = total.toFixed(1) + ' m²';
  }

  calcStep2.addEventListener('input', handleStep2Change);
  calcStep2.addEventListener('change', handleStep2Change);

  function handleStep2Change(e) {
    if (e.target === calcHasCompound) { calcCompoundFields.style.display = calcHasCompound.checked ? 'grid' : 'none'; }
    if (e.target === calcHasPillars) { calcPillarFields.style.display = calcHasPillars.checked ? 'grid' : 'none'; }

    // real-time negative/under-minimum highlighting
    if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
      var min = e.target.hasAttribute('min') ? parseFloat(e.target.min) : null;
      var val = e.target.value === '' ? null : parseFloat(e.target.value);
      var invalid = val !== null && ((min !== null && val < min) || val < 0);
      e.target.classList.toggle('calc-invalid', !!invalid);
    }

    if (getProjectType() === 'interior') recalcInterior(); else recalcExterior();
  }

  /* ---------- STEP 2 validation ---------- */
  function validateStep2() {
    calcStep2Error.textContent = '';
    if (getProjectType() === 'interior') {
      if (calcInteriorAreaTotal <= 0) {
        calcStep2Error.textContent = 'Please enter valid room dimensions (length, width and height) for at least one room.';
        return false;
      }
    } else {
      var L = parseFloat(calcExtLength.value), W = parseFloat(calcExtWidth.value),
          H = parseFloat(calcExtHeight.value), F = parseFloat(calcExtFloors.value);
      if (!(L > 0) || !(W > 0) || !(H > 0) || !(F >= 1)) {
        calcStep2Error.textContent = 'Please fill in valid building length, width, height and number of floors.';
        return false;
      }
    }
    return true;
  }

  /* ---------- STEP 4: paint selection ---------- */
  function populatePaintGrid() {
    var products = getProductsForType();
    calcPaintGrid.innerHTML = '';
    products.forEach(function (p, i) {
      var label = document.createElement('label');
      label.className = 'calc-paint-card';
      label.innerHTML =
        '<input type="radio" name="calcPaint" value="' + i + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<span class="calc-paint-name">' + p.name + '</span>' +
        '<span class="calc-paint-cov">' + p.covMin + '\u2013' + p.covMax + ' m²/L</span>';
      calcPaintGrid.appendChild(label);
    });
    calcPaintGrid.querySelectorAll('input[name="calcPaint"]').forEach(function (radio) {
      radio.addEventListener('change', applyCoatsDefault);
    });
  }

  function applyCoatsDefault() {
    var product = getProductsForType()[getSelectedPaintIndex()];
    if (!product) return;
    var coats = product.coats + (calcDarkShade.checked ? 1 : 0);
    calcCoatsInput.value = coats;
    calcDarkWarning.style.display = calcDarkShade.checked ? 'block' : 'none';
  }

  calcDarkShade.addEventListener('change', applyCoatsDefault);

  calcIncludeAdvanced.addEventListener('change', function () {
    calcAdvancedFields.style.display = calcIncludeAdvanced.checked ? 'grid' : 'none';
  });

  function validateStep4() {
    calcStep4Error.textContent = '';
    var coats = parseFloat(calcCoatsInput.value);
    if (!(coats >= 1)) {
      calcStep4Error.textContent = 'Number of coats must be at least 1.';
      return false;
    }
    return true;
  }

  /* ---------- pack recommendation ---------- */
  function recommendPacks(requiredLitres) {
    var required = Math.max(requiredLitres, 0.1);
    var remaining = required;
    var combo = [];

    var bigCount = Math.floor(remaining / 20);
    if (bigCount > 0) {
      combo.push({ size: 20, count: bigCount });
      remaining = +(remaining - bigCount * 20).toFixed(2);
    }
    if (remaining > 0.05) {
      var smaller = [10, 4, 1];
      var chosen = null;
      for (var i = 0; i < smaller.length; i++) {
        if (smaller[i] >= remaining) { chosen = smaller[i]; break; }
      }
      combo.push(chosen ? { size: chosen, count: 1 } : { size: 20, count: 1 });
    }

    var merged = {};
    combo.forEach(function (c) { merged[c.size] = (merged[c.size] || 0) + c.count; });
    return Object.keys(merged)
      .sort(function (a, b) { return b - a; })
      .map(function (k) { return { size: +k, count: merged[k] }; });
  }

  /* ---------- final calculation ---------- */
  function calculateResults() {
    var type = getProjectType();
    var area = (type === 'interior') ? calcInteriorAreaTotal : calcExteriorAreaTotal;
    var surface = document.querySelector('input[name="calcSurface"]:checked').value;
    var factor = CALC_SURFACE_FACTORS[surface] || 1;
    var adjustedArea = area * factor;

    var product = getProductsForType()[getSelectedPaintIndex()];
    var coats = Math.max(1, parseInt(calcCoatsInput.value, 10) || product.coats);
    var avgCov = (product.covMin + product.covMax) / 2;

    var minPaint = (adjustedArea * coats) / product.covMax; // highest coverage → least paint
    var maxPaint = (adjustedArea * coats) / product.covMin; // lowest coverage → most paint
    var estPaint = (adjustedArea * coats) / avgCov;

    resArea.textContent = area.toFixed(1) + ' m²' + (factor !== 1 ? ' (' + adjustedArea.toFixed(1) + ' m² adjusted)' : '');
    resPaint.textContent = product.name;
    resCoverage.textContent = product.covMin + '\u2013' + product.covMax + ' m²/L';
    resCoats.textContent = coats;
    resMin.textContent = minPaint.toFixed(1) + ' L';
    resEst.textContent = estPaint.toFixed(1) + ' L';
    resMax.textContent = maxPaint.toFixed(1) + ' L';

    var packs = recommendPacks(estPaint);
    resPacks.textContent = packs.length
      ? packs.map(function (p) { return p.count + ' \u00d7 ' + p.size + 'L'; }).join(' + ')
      : '1 \u00d7 1L';

    var showAdv = calcIncludeAdvanced.checked;
    resAdvancedWrap.style.display = showAdv ? 'grid' : 'none';
    if (showAdv) {
      var primerOn = calcPrimerNeeded.value === 'yes';
      var puttyOn = calcPuttyNeeded.value === 'yes';
      resPrimer.textContent = primerOn ? (adjustedArea / 10).toFixed(1) + ' L (approx.)' : 'Not required';
      resPutty.textContent = puttyOn ? (adjustedArea / 1.4).toFixed(1) + ' kg (approx.)' : 'Not required';

      var price = parseFloat(calcPricePerLitre.value);
      if (price > 0) {
        resCostWrap.style.display = 'block';
        resCost.textContent = 'NPR ' + Math.round(estPaint * price).toLocaleString('en-IN');
      } else {
        resCostWrap.style.display = 'none';
      }
    }
  }

  /* ---------- reset ---------- */
  function resetCalculator() {
    calcForm.reset();
    calcRoomsWrap.innerHTML = '';
    calcRoomCount = 0;
    addRoom();

    calcDefaultsPanel.classList.remove('open');
    calcToggleDefaults.textContent = 'Edit door/window sizes';
    calcCompoundFields.style.display = 'none';
    calcPillarFields.style.display = 'none';
    calcAdvancedFields.style.display = 'none';
    resAdvancedWrap.style.display = 'none';
    calcDarkWarning.style.display = 'none';

    calcInteriorPanel.style.display = 'block';
    calcExteriorPanel.style.display = 'none';

    document.querySelectorAll('#calcForm input.calc-invalid').forEach(function (el) {
      el.classList.remove('calc-invalid');
    });

    calcStep2Error.textContent = '';
    calcStep4Error.textContent = '';
    calcResultsWrap.classList.remove('show');

    populatePaintGrid();
    document.getElementById('estimator').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- initial page load ---------- */
  /* FIX: these two calls were missing, which is why the room dimension
     inputs (Length/Width/Height) and paint cards never appeared on a
     fresh page load — they were only ever created inside resetCalculator(),
     which only runs when the Reset button is clicked. */
  populatePaintGrid();
  addRoom();

  /* ---------- DOWNLOAD ESTIMATE (PDF) — native vector text, no rasterization ---------- */
  (function initCalcPdfDownload() {
    var calcDownloadBtn = document.getElementById('calcDownloadBtn');
    var calcDownloadError = document.getElementById('calcDownloadError');
    var calcPdfLocation = document.getElementById('calcPdfLocation');
    var calcPdfCustomer = document.getElementById('calcPdfCustomer');
    if (!calcDownloadBtn) return; // block not present, do nothing

    var existingLocationField = document.querySelector('[data-location], #siteLocation, #calcLocationField');
    if (existingLocationField && calcPdfLocation && !calcPdfLocation.value) {
      calcPdfLocation.value = existingLocationField.value || existingLocationField.textContent || '';
    }

    var ACCENT = [255, 107, 0]; // matches --accent-orange
    var INK = [26, 26, 26];
    var GREY = [90, 90, 90];
    var LINE = [200, 200, 200];

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function formatDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function formatTime(d) {
      var h = d.getHours(), m = pad(d.getMinutes());
      var suffix = h >= 12 ? 'PM' : 'AM';
      var h12 = h % 12 || 12;
      return pad(h12) + ':' + m + ' ' + suffix;
    }
    function generateEstimateId() {
      var rand = Math.floor(1000 + Math.random() * 9000);
      return 'PG-' + Date.now().toString().slice(-6) + '-' + rand;
    }
    function textOf(el) { return el && el.textContent ? el.textContent.trim() : '—'; }
    function displayOf(el) { return el && el.style.display !== 'none'; }
    function findExistingLogo() {
      var img = document.querySelector('img.logo, .site-logo img, .navbar-logo img, header img[alt*="logo" i]');
      return img || null;
    }

    // Converts an on-page <img> to a PNG data URL via an in-memory canvas,
    // so the (small, already-raster) logo can be embedded — everything else stays vector text.
    function loadLogoDataUrl(imgEl) {
      return new Promise(function (resolve) {
        if (!imgEl || !imgEl.src) { resolve(null); return; }
        var fresh = new Image();
        fresh.crossOrigin = 'anonymous';
        fresh.onload = function () {
          try {
            var c = document.createElement('canvas');
            c.width = fresh.naturalWidth;
            c.height = fresh.naturalHeight;
            var ctx = c.getContext('2d');
            ctx.drawImage(fresh, 0, 0);
            resolve({ dataUrl: c.toDataURL('image/png'), w: c.width, h: c.height });
          } catch (e) {
            resolve(null); // CORS-blocked or failed — skip logo, don't break the PDF
          }
        };
        fresh.onerror = function () { resolve(null); };
        fresh.src = imgEl.src;
      });
    }

    function buildPdf(logoInfo) {
      var jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF('p', 'mm', 'a4');
      var pageWidth = 210;
      var marginX = 20;
      var contentWidth = pageWidth - marginX * 2;
      var y = 20;
      var now = new Date();

      // ---- HEADER ----
      var textX = marginX;
      if (logoInfo) {
        var logoH = 14;
        var logoW = (logoInfo.w / logoInfo.h) * logoH;
        doc.addImage(logoInfo.dataUrl, 'PNG', marginX, y - 4, logoW, logoH);
        textX = marginX + logoW + 6;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor.apply(doc, INK);
      doc.text("PAINT'S GALLERY", textX, y);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor.apply(doc, GREY);
      doc.text('Your Paint Expert.', textX, y + 5.5);

      y += 13;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor.apply(doc, ACCENT);
      doc.text('PROFESSIONAL PAINT ESTIMATION REPORT', textX, y);

      y += 4;
      doc.setDrawColor.apply(doc, INK);
      doc.setLineWidth(0.4);
      doc.line(marginX, y, pageWidth - marginX, y);

      // ---- META INFO ----
      y += 8;
      var location = (calcPdfLocation && calcPdfLocation.value.trim()) || '_______________________';
      var customer = (calcPdfCustomer && calcPdfCustomer.value.trim()) || '—';
      var metaRows = [
        ['Date:', formatDate(now), 'Estimate ID:', generateEstimateId()],
        ['Time:', formatTime(now), 'Location:', location],
        ['Customer Name:', customer, '', '']
      ];
      doc.setFontSize(9.5);
      metaRows.forEach(function (row) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor.apply(doc, GREY);
        doc.text(row[0], marginX, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor.apply(doc, INK);
        doc.text(row[1], marginX + 30, y);
        if (row[2]) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor.apply(doc, GREY);
          doc.text(row[2], marginX + 95, y);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor.apply(doc, INK);
          doc.text(row[3], marginX + 125, y);
        }
        y += 6;
      });

      y += 2;
      doc.setDrawColor.apply(doc, LINE);
      doc.setLineWidth(0.2);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 8;

      // ---- RESULTS TABLE ----
      var surfaceEl = document.querySelector('input[name="calcSurface"]:checked');
      var surfaceLabel = surfaceEl ? surfaceEl.closest('label').querySelector('.calc-option-title').textContent : '—';
      var showAdvanced = displayOf(document.getElementById('resAdvancedWrap'));
      var showCost = document.getElementById('resCostWrap') && displayOf(document.getElementById('resCostWrap'));

      var rows = [
        ['Paint Type', textOf(resPaint)],
        ['Surface Condition', surfaceLabel],
        ['Paintable Area', textOf(resArea)],
        ['Coverage', textOf(resCoverage)],
        ['Number of Coats', textOf(resCoats)]
      ];
      if (showAdvanced) {
        rows.push(['Primer Required', textOf(resPrimer)]);
        rows.push(['Putty Required', textOf(resPutty)]);
      }
      rows.push(['Recommended Purchase', textOf(resPacks)]);
      if (showCost) rows.push(['Estimated Cost', textOf(resCost)]);

      var labelColW = contentWidth * 0.42;
      var rowH = 9;
      doc.setFontSize(9.5);
      rows.forEach(function (r) {
        doc.setDrawColor.apply(doc, LINE);
        doc.setLineWidth(0.2);
        doc.rect(marginX, y - 5.5, labelColW, rowH);
        doc.rect(marginX + labelColW, y - 5.5, contentWidth - labelColW, rowH);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor.apply(doc, INK);
        doc.text(r[0], marginX + 3, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor.apply(doc, [51, 51, 51]);
        doc.text(String(r[1]), marginX + labelColW + 3, y);
        y += rowH;
      });

      y += 8;

      // ---- LITRES BAND ----
      var bandH = 18;
      var colW = contentWidth / 3;
      var litres = [['MINIMUM', textOf(resMin), false], ['ESTIMATED TOTAL PAINT', textOf(resEst), true], ['MAXIMUM', textOf(resMax), false]];
      doc.setDrawColor.apply(doc, INK);
      doc.setLineWidth(0.4);
      doc.rect(marginX, y, contentWidth, bandH);
      doc.line(marginX + colW, y, marginX + colW, y + bandH);
      doc.line(marginX + colW * 2, y, marginX + colW * 2, y + bandH);

      litres.forEach(function (item, i) {
        var cx = marginX + colW * i + colW / 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor.apply(doc, GREY);
        doc.text(item[0], cx, y + 6, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor.apply(doc, item[2] ? ACCENT : INK);
        doc.text(item[1], cx, y + 13, { align: 'center' });
      });

      y += bandH + 10;

      // ---- DISCLAIMER ----
      doc.setDrawColor.apply(doc, LINE);
      doc.setLineWidth(0.2);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor.apply(doc, INK);
      doc.text('DISCLAIMER', marginX, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor.apply(doc, GREY);
      var disclaimerLines = doc.splitTextToSize(
        'This estimation is approximate and may vary depending on wall condition, application method, wastage and surface absorption.',
        contentWidth
      );
      doc.text(disclaimerLines, marginX, y);
      y += disclaimerLines.length * 4;

      // ---- FOOTER (pinned near bottom of page) ----
      var footerY = 275;
      doc.setDrawColor.apply(doc, LINE);
      doc.setLineWidth(0.2);
      doc.line(marginX, footerY - 6, pageWidth - marginX, footerY - 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor.apply(doc, INK);
      doc.text("Paint's Gallery", marginX, footerY);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor.apply(doc, GREY);
      doc.text('Your Paint Expert.', marginX, footerY + 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Puspalal Chowk, Biratnagar, Nepal', marginX + 65, footerY);
      doc.text('Phone: +977 9714535749', marginX + 65, footerY + 4);

      return doc;
    }

    function downloadPdf() {
      if (typeof window.jspdf === 'undefined') {
        calcDownloadError.textContent = 'PDF library failed to load. Please check your connection and try again.';
        return;
      }
      calcDownloadError.textContent = '';
      calcDownloadBtn.disabled = true;
      calcDownloadBtn.textContent = 'Preparing PDF…';

      loadLogoDataUrl(findExistingLogo())
        .then(function (logoInfo) {
          var doc = buildPdf(logoInfo);
          var filename = 'Paint-Estimate-' + formatDate(new Date()) + '.pdf';
          doc.save(filename);
        })
        .catch(function () {
          calcDownloadError.textContent = 'Something went wrong generating the PDF. Please try again.';
        })
        .finally(function () {
          calcDownloadBtn.disabled = false;
          calcDownloadBtn.textContent = 'Download Estimate (PDF)';
        });
    }

    calcDownloadBtn.addEventListener('click', downloadPdf);
  })();

});