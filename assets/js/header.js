/* ============================================================
   셀킷 공통 헤더
   사용법: body 최상단에 <div id="sellkit-header"></div> 를 두고
          kits.js → header.js 순서로 불러오면 자동 렌더링됩니다.
   ============================================================ */
(function () {
  var R = SELLKIT_ROOT;

  var here = decodeURIComponent(location.pathname);
  var isContact = here.indexOf('contact.html') !== -1;
  var currentKit = SELLKIT_KITS.filter(function (k) {
    return k.path && here.indexOf('/' + k.path.split('/')[0] + '/') !== -1;
  })[0];
  var isKitPage = !!currentKit;
  var isMain = !isKitPage && !/(contact|terms|privacy)\.html/.test(here);

  function kitItems(cls) {
    return SELLKIT_KITS.map(function (kit) {
      var current = currentKit && kit.id === currentKit.id ? ' is-current' : '';
      var inner =
        '<span class="sk-kit-txt"><strong>' + kit.name +
        (kit.status === 'coming' ? '<em class="sk-soon">준비중</em>' : '') +
        (current ? '<em class="sk-here">현재 페이지</em>' : '') +
        '</strong><small>' + kit.tagline + '</small></span>';
      if (kit.status === 'live') {
        return '<a class="' + cls + current + '" href="' + R + kit.path + '">' + inner + '</a>';
      }
      return '<button type="button" class="' + cls + ' is-coming' + current + '" onclick="sellkitComingSoon()">' + inner + '</button>';
    }).join('');
  }

  var html =
    '<header class="sk-header" id="skHeader">' +
      '<div class="sk-header-inner">' +
        '<div class="sk-brand">' +
          '<a class="sk-logo" href="' + R + 'index.html"><img src="' + R + 'assets/img/sellkit_logo_1.png" alt="셀킷 로고">sellkit</a>' +
          (currentKit ? '<span class="sk-kit-badge" role="button" tabindex="0">' + currentKit.name + '</span>' : '') +
        '</div>' +
        '<nav class="sk-nav">' +
          '<div class="sk-nav-item sk-has-drop' + (isKitPage ? ' active' : '') + '">' +
            '<button type="button" class="sk-nav-link" id="skKitBtn">Kit' +
              '<svg class="sk-caret" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
            '</button>' +
            '<div class="sk-drop">' + kitItems('sk-drop-item') + '</div>' +
          '</div>' +
          '<a class="sk-nav-link' + (isContact ? ' active' : '') + '" href="' + R + 'contact.html">도입 문의</a>' +
          '<a class="sk-nav-link" href="' + SELLKIT_GUIDE_URL + '" target="_blank" rel="noopener">가이드<span class="sk-ext">↗</span></a>' +
        '</nav>' +
        '<div class="sk-header-right">' +
          '<a class="btn btn-primary btn-sm sk-header-cta" href="' + SELLKIT_STORE_URL + '" target="_blank" rel="noopener">무료로 시작하기</a>' +
          '<button type="button" class="sk-burger" id="skBurger" aria-label="메뉴 열기"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div>' +
      '<div class="sk-mobile" id="skMobile">' +
        '<div class="sk-mobile-group">Kit</div>' +
        kitItems('sk-mobile-kit') +
        '<a class="sk-mobile-link' + (isContact ? ' active' : '') + '" href="' + R + 'contact.html">도입 문의</a>' +
        '<a class="sk-mobile-link" href="' + SELLKIT_GUIDE_URL + '" target="_blank" rel="noopener">가이드 ↗</a>' +
        '<a class="btn btn-primary sk-mobile-cta" href="' + SELLKIT_STORE_URL + '" target="_blank" rel="noopener">무료로 시작하기</a>' +
      '</div>' +
    '</header>';

  function render() {
    var mount = document.getElementById('sellkit-header');
    if (!mount) return;
    mount.innerHTML = html;

    var headerEl = document.getElementById('skHeader');
    var burger = document.getElementById('skBurger');
    var kitBtn = document.getElementById('skKitBtn');
    var mobileEl = document.getElementById('skMobile');

    /* backdrop-filter가 걸린 헤더는 fixed 자식의 컨테이닝 블록이 되므로
       모바일 패널을 body로 빼내 화면 전체를 덮게 한다. */
    if (mobileEl) document.body.appendChild(mobileEl);

    burger.addEventListener('click', function () {
      var open = headerEl.classList.toggle('menu-open');
      if (mobileEl) mobileEl.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* 터치 기기 대응: Kit 버튼 클릭으로도 드롭다운 열림 */
    kitBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      kitBtn.parentNode.classList.toggle('drop-open');
    });
    document.addEventListener('click', function () {
      var open = document.querySelector('.sk-has-drop.drop-open');
      if (open) open.classList.remove('drop-open');
    });

    window.addEventListener('scroll', function () {
      headerEl.classList.toggle('scrolled', window.scrollY > 8);
    });

    function scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* 메인 페이지: 헤더 로고 클릭 → 최상단으로 스크롤 (재로딩 없이) */
    var logo = headerEl.querySelector('.sk-logo');
    if (logo && isMain) {
      logo.addEventListener('click', function (e) { e.preventDefault(); scrollTop(); });
    }

    /* 킷 상세 페이지: 로고 옆 킷 배지 클릭 → 해당 킷 최상단으로 스크롤 */
    var badge = headerEl.querySelector('.sk-kit-badge');
    if (badge) {
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', scrollTop);
      badge.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollTop(); }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
