/* ============================================================
   셀킷 공통 푸터
   사용법: body 하단에 <div id="sellkit-footer"></div> 를 두고
          kits.js → footer.js 순서로 불러오면 자동 렌더링됩니다.
   ============================================================ */
(function () {
  var R = SELLKIT_ROOT;
  var YEAR = new Date().getFullYear();

  var html =
    '<footer class="sk-footer">' +
      '<div class="sk-footer-inner">' +
        '<div class="sk-footer-top">' +
          '<a class="sk-footer-logo" href="' + R + 'index.html" style="text-decoration:none;color:inherit;cursor:pointer;"><img src="' + R + 'assets/img/sellkit_logo_1.png" alt="셀킷 로고">sellkit</a>' +
          '<div class="sk-footer-line">' +
            '<p>클릭 몇 번으로 시작하는 쇼핑몰 성장 키트</p>' +
            '<div class="sk-footer-policy">' +
              '<a href="' + R + 'terms.html">이용약관</a>' +
              '<span class="sk-footer-policy-sep">·</span>' +
              '<a href="' + R + 'privacy.html">개인정보처리방침</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sk-footer-biz">' +
          '㈜엔트위즈소프트 ㆍ 대표: 유철웅<br>' +
          '이메일: agency@entwiz.com ㆍ 사업자등록번호 113-86-58651<br>' +
          '서울 금천구 가산디지털1로 181 가산 더블유센터 504, 505호<br>' +
          'CS센터 1666-7926 (상담시간 : 평일 오전 10:00~오후 7:00)' +
        '</div>' +
        '<div class="sk-footer-copy">Copyright©' + YEAR + ' ENTWIZ CORP. ALL RIGHTS RESERVED.</div>' +
      '</div>' +
    '</footer>';

  var here = decodeURIComponent(location.pathname);
  var isMain = !/(contact|terms|privacy)\.html/.test(here) &&
    !(window.SELLKIT_KITS || []).some(function (k) {
      return k.path && here.indexOf('/' + k.path.split('/')[0] + '/') !== -1;
    });

  function render() {
    var mount = document.getElementById('sellkit-footer');
    if (!mount) return;
    mount.innerHTML = html;

    /* 메인 페이지: 푸터 로고 클릭 → 재로딩 없이 최상단으로 스크롤 */
    var logo = mount.querySelector('.sk-footer-logo');
    if (logo && isMain) {
      logo.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();

/* ============================================================
   도입 문의 플로팅 버튼 (우측 하단)
   - 문의 페이지(contact.html) 제외한 모든 페이지에 노출
   - 스타일 자체 주입 → 메인/랜딩 어느 CSS든 동일하게 표시
   ============================================================ */
(function () {
  var R = SELLKIT_ROOT;
  if (/contact\.html$/i.test(location.pathname)) return;

  var css =
    '.sk-fab{position:fixed;right:24px;bottom:24px;z-index:90;display:inline-flex;align-items:center;gap:8px;' +
    'padding:14px 20px;border-radius:999px;background:var(--brand);color:#fff;font-family:inherit;font-size:15px;font-weight:800;' +
    'text-decoration:none;box-shadow:0 10px 28px rgba(var(--brand-rgb),.4);' +
    'transform:translateY(12px);opacity:0;transition:transform .3s ease,opacity .3s ease,box-shadow .2s ease,background .2s ease;}' +
    '.sk-fab.show{transform:none;opacity:1;}' +
    '.sk-fab svg{width:20px;height:20px;flex:none;}' +
    '@media (hover:hover){.sk-fab:hover{box-shadow:0 14px 34px rgba(var(--brand-rgb),.52);filter:brightness(1.05);}}' +
    '@media (max-width:600px){.sk-fab{right:16px;bottom:16px;padding:13px 18px;font-size:14px;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var a = document.createElement('a');
  a.className = 'sk-fab';
  a.href = R + 'contact.html';
  a.setAttribute('aria-label', '도입 문의');
  a.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
    '</svg><span>도입 문의</span>';

  function mount() {
    document.body.appendChild(a);
    requestAnimationFrame(function () { a.classList.add('show'); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
