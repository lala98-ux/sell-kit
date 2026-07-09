/* ============================================================
   도입 문의 폼 — 검증 + 제출
   ============================================================ */
(function () {
  var form = document.getElementById('inquiryForm');
  if (!form) return;

  function $(id) { return document.getElementById(id); }

  /* 연락처 자동 하이픈 */
  var phone = $('fPhone');
  phone.addEventListener('input', function () {
    var v = phone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7) v = v.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
    else if (v.length > 3) v = v.replace(/^(\d{2,3})(\d+)$/, '$1-$2');
    phone.value = v;
  });

  /* 전체 동의 */
  var agreeAll = $('agreeAll');
  var agrees = [$('agreeTerms'), $('agreePrivacy')];
  agreeAll.addEventListener('change', function () {
    agrees.forEach(function (c) { c.checked = agreeAll.checked; });
  });
  agrees.forEach(function (c) {
    c.addEventListener('change', function () {
      agreeAll.checked = agrees.every(function (x) { return x.checked; });
    });
  });

  /* 문의할 킷 다중선택 (전체 선택 지원) */
  var kitSelect = $('kitSelect');
  var kitChips = [];
  var allChip = null;
  if (kitSelect && typeof SELLKIT_KITS !== 'undefined') {
    allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = 'kit-sel-chip kit-sel-all';
    allChip.textContent = '전체 선택';
    kitSelect.appendChild(allChip);

    SELLKIT_KITS.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kit-sel-chip';
      b.setAttribute('data-kit', k.name);
      b.setAttribute('aria-pressed', 'false');
      b.textContent = k.name;
      kitSelect.appendChild(b);
      kitChips.push(b);
    });

    function syncAll() {
      var all = kitChips.length && kitChips.every(function (c) { return c.classList.contains('is-sel'); });
      allChip.classList.toggle('is-sel', all);
      allChip.setAttribute('aria-pressed', all ? 'true' : 'false');
      var wrap = kitSelect.closest('.form-field');
      if (wrap && selectedKits().length) wrap.classList.remove('has-error');
    }
    allChip.addEventListener('click', function () {
      var turnOn = !kitChips.every(function (c) { return c.classList.contains('is-sel'); });
      kitChips.forEach(function (c) {
        c.classList.toggle('is-sel', turnOn);
        c.setAttribute('aria-pressed', turnOn ? 'true' : 'false');
      });
      syncAll();
    });
    kitChips.forEach(function (c) {
      c.addEventListener('click', function () {
        var on = c.classList.toggle('is-sel');
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
        syncAll();
      });
    });
  }
  function selectedKits() {
    return kitChips.filter(function (c) { return c.classList.contains('is-sel'); })
                   .map(function (c) { return c.getAttribute('data-kit'); });
  }

  /* 문의 카테고리 — 커스텀 드롭다운 */
  (function () {
    var dd = $('catDD'), trigger = $('catTrigger'), menu = $('catMenu'), hidden = $('fCategory');
    if (!dd || !trigger || !menu || !hidden) return;
    var valueEl = trigger.querySelector('.cat-value');
    var opts = Array.prototype.slice.call(menu.querySelectorAll('.cat-opt'));

    function open() { dd.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
    function close() { dd.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dd.classList.contains('open') ? close() : open();
    });
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        var v = o.getAttribute('data-value');
        hidden.value = v;
        valueEl.textContent = v;
        valueEl.classList.remove('is-placeholder');
        trigger.classList.add('has-value');
        opts.forEach(function (x) { x.classList.remove('is-active'); });
        o.classList.add('is-active');
        dd.closest('.form-field').classList.remove('has-error');
        close();
      });
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

  /* 문의 내용 글자수 카운터 (N/1000) */
  (function () {
    var msg = $('fMessage'), cnt = $('msgCount');
    if (!msg || !cnt) return;
    var max = 1000;
    msg.addEventListener('input', function () {
      if (msg.value.length > max) msg.value = msg.value.slice(0, max);
      cnt.textContent = msg.value.length;
      cnt.parentNode.classList.toggle('is-full', msg.value.length >= max);
    });
  })();

  function invalid(el, msg) {
    var wrap = el.closest('.form-field');
    wrap.classList.add('has-error');
    wrap.querySelector('.field-error').textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    Array.prototype.forEach.call(form.querySelectorAll('.has-error'), function (el) {
      el.classList.remove('has-error');
    });
    $('formGlobalError').style.display = 'none';

    var name = $('fName').value.trim();
    var email = $('fEmail').value.trim();
    var phoneVal = phone.value.trim();
    var category = $('fCategory').value;
    var message = $('fMessage').value.trim();
    var ok = true;

    if (!name) { invalid($('fName'), '담당자명을 입력해 주세요.'); ok = false; }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { invalid($('fEmail'), '올바른 이메일 주소를 입력해 주세요.'); ok = false; }
    if (phoneVal.replace(/\D/g, '').length < 9) { invalid(phone, '올바른 연락처를 입력해 주세요.'); ok = false; }
    if (kitSelect && selectedKits().length === 0) { invalid(kitSelect, '문의할 킷을 하나 이상 선택해 주세요.'); ok = false; }
    if (!category) { invalid($('fCategory'), '문의 카테고리를 선택해 주세요.'); ok = false; }
    if (!message) { invalid($('fMessage'), '문의 내용을 입력해 주세요.'); ok = false; }

    var consentBox = document.querySelector('.consent-box');
    var agreed = agrees.every(function (c) { return c.checked; });
    consentBox.classList.toggle('has-error', !agreed);
    if (!agreed) ok = false;

    if (!ok) {
      var first = form.querySelector('.has-error');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var btn = $('submitBtn');
    btn.disabled = true;
    btn.textContent = '접수 중...';

    submitInquiry({
      name: name,
      email: email,
      phone: phoneVal,
      kits: selectedKits(),
      category: category,
      message: message,
      agreeTerms: true,
      agreePrivacy: true
    }).then(function () {
      form.style.display = 'none';
      document.querySelector('.contact-head').style.display = 'none';
      $('formSuccess').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = '문의 접수하기';
      $('formGlobalError').style.display = 'block';
    });
  });

  /* ------------------------------------------------------------
     API 연동 지점
     추후 API 문서 수령 후 이 함수 내부만 실제 요청으로 교체하면 됩니다.
     예) return fetch(API_URL, { method:'POST', headers:{...}, body: JSON.stringify(data) })
     현재는 0.8초 뒤 성공 처리되는 데모 동작입니다.
     ------------------------------------------------------------ */
  function submitInquiry(data) {
    console.log('[sellkit] 문의 접수 데이터:', data);
    return new Promise(function (resolve) { setTimeout(resolve, 800); });
  }
})();
