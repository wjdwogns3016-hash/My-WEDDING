/**
 * Original Warm Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: true,  // 커튼 열림 애니메이션 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "정재훈",
    father: "정흥운",
    mother: "정경아",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "박선영",
    father: "박호동",
    mother: "하은주",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-09-12",
    time: "15:30",
    venue: "센텀사이언스파크 23층 스카이홀",
    address: "부산광역시 해운대구 센텀중앙로 79",

    // 약도 아래 주차 안내
    parking: {
      title: "주차 안내",
      summary: "건물 내 주차장 400대 · 하객 3시간 무료",
      details: [
        "예식 시간 전후에는 주차장이 혼잡할 수 있으니 여유 있게 도착해 주세요.",
        "센텀시티역 4번 출구에서 무료 셔틀버스도 이용하실 수 있습니다."
      ]
    },

    mapLinks: {
      kakao: "https://place.map.kakao.com/14525753",
      naver: "https://naver.me/xk1n8I1H"
    }
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
     { role: "신랑", name: "정재훈", bank: "신한은행", number: "110-435-203760" },
    ],
    bride: [
     { role: "신부", name: "박선영", bank: "우리은행", number: "1002-664-295784" },
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "정재훈 ♥ 박선영 결혼합니다",
    description: "2026년 9월 12일, 소중한 분들을 초대합니다."
  }
};
