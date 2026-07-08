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
          '<div class="sk-footer-logo"><img src="' + R + 'assets/img/sellkit_logo_1.png" alt="셀킷 로고">sellkit</div>' +
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

  function render() {
    var mount = document.getElementById('sellkit-footer');
    if (mount) mount.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
