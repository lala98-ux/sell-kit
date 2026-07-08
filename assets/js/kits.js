/* ============================================================
   셀킷 킷 데이터 — 단일 소스
   킷이 추가되면 이 배열에 항목 하나만 추가하면
   헤더 드롭다운 / 메인 킷 카드 / 푸터 링크에 자동 반영됩니다.
   status: 'live'   → 상세페이지 링크 연결
           'coming' → 클릭 시 "준비중입니다" alert
   ============================================================ */

/* 사이트 루트 경로 자동 계산 (하위 폴더 페이지에서도 동작) */
var SELLKIT_ROOT = (function () {
  var src = document.currentScript.src;
  return src.substring(0, src.indexOf('assets/js/'));
})();

/* 선형 SVG 아이콘 (stroke: currentColor) */
var SELLKIT_ICONS = {
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.38 8.38 0 0112.5 3h.5a8.48 8.48 0 018 8v.5z"/><path d="M12 8l1.1 2.2 2.4.4-1.7 1.7.4 2.4L12 13.6l-2.2 1.1.4-2.4-1.7-1.7 2.4-.4L12 8z"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>'
};

var SELLKIT_KITS = [
  {
    id: 'discount',
    name: '할인킷',
    tagline: '프로모션으로 객단가 올리기',
    desc: '카페24엔 없던 1+1·2+1 수량 프로모션. 할인킷을 설치하면 클릭 몇 번으로 바로 시작됩니다.',
    points: ['1+1·2+1 등 수량 조건을 자유롭게 설정', '설치 즉시 적용, 개발 대기 없음'],
    chips: ['N+1', '수량 할인', '실시간 수정'],
    icon: 'tag',
    path: '할인킷/index.html',
    status: 'live'
  },
  {
    id: 'upsell',
    name: '업셀킷',
    tagline: '구매 직전 놓치는 고객 잡기',
    desc: '고객이 상품을 보는 순간이 객단가를 올릴 기회. 자동 추천 위젯 14종이 함께 살 상품을 띄워줍니다.',
    points: ['함께 사는 상품을 자동으로 추천', '위젯 14종, 스크립트 자동 설치'],
    chips: ['다양한 위젯', '토글 관리', '즉시 반영'],
    icon: 'trend',
    path: '업셀킷/index.html',
    status: 'live'
  },
  {
    id: 'multiship',
    name: '멀티배송킷',
    tagline: '한 주문서에서 여러 곳에 배송',
    desc: '한 번의 주문으로 여러 곳에 배송. 선물처럼 나눠 보내는 주문도 우리 몰에서 바로 처리됩니다.',
    points: ['주문 하나를 여러 배송지로 분할', '선물·단체 주문을 매출 기회로'],
    chips: ['단체주문', '분할배송', '명절대응'],
    icon: 'truck',
    path: null,
    status: 'coming'
  },
  {
    id: 'review',
    name: '리뷰킷',
    tagline: '리뷰로 구매 전환 끌어올리기',
    desc: '쌓인 리뷰가 다음 고객을 설득합니다. 리뷰를 자동으로 모아 돋보이는 자리에 노출합니다.',
    points: ['리뷰 수집부터 노출까지 자동으로', '상품 상세·장바구니 등 원하는 페이지에 리뷰 노출'],
    chips: ['품질관리', '추천리뷰', '포토리뷰'],
    icon: 'review',
    path: null,
    status: 'coming'
  },
  {
    id: 'firstbuy',
    name: '첫구매킷',
    tagline: '첫 방문을 첫 구매로 전환',
    desc: '처음 온 고객을 그냥 보내지 않습니다. 첫 구매 혜택으로 첫 전환의 문턱을 낮춥니다.',
    points: ['신규 방문자에게 자동 웰컴 혜택', '첫 구매를 단골의 시작으로'],
    chips: ['웰컴 혜택', '첫구매 전환', '100원딜'],
    icon: 'gift',
    path: null,
    status: 'coming'
  }
];

var SELLKIT_GUIDE_URL = 'https://www.notion.so/2687805786d9809d8d4de379eb7ebfab?source=copy_link';

/* 카페24 앱스토어 — 엔트위즈소프트 앱 목록 */
var SELLKIT_STORE_URL = 'https://store.cafe24.com/kr/search/apps?f=pNo%3A10260&is_caqi_badge_only=F&s=%EC%97%94%ED%8A%B8%EC%9C%84%EC%A6%88%EC%86%8C%ED%94%84%ED%8A%B8';

/* 준비중 킷/페이지 클릭 처리 */
function sellkitComingSoon() {
  alert('준비중입니다.');
}
