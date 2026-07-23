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

    // 약도 아래 교통 안내
    transportation: {
      title: "교통 안내",
      sections: [
        {
          title: "자동차",
          icon: "🚗",
          items: [
            "서울·경기 지역: 구서 IC로 진출 후 해운대 센텀시티 방향",
            "김해·창원 지역: 서부산 IC로 진출 후 해운대 센텀시티 방향"
          ]
        },
        {
          title: "철도",
          icon: "🚆",
          items: [
            "부산역에서 지하철 1호선 승차 후 서면역에서 2호선으로 환승하여 센텀시티역 하차",
            "부산역에서 40번 또는 1001번 버스 승차 후 벡스코 하차",
            "181번 환승: SK텔레콤 정류장 하차",
            "1002번 환승: 센텀중학교 정류장 하차",
            "307번 환승: SK텔레콤 정류장 하차",
            "해운대구 3-2번 환승: SK텔레콤 정류장 하차"
          ]
        },
        {
          title: "버스",
          icon: "🚌",
          items: [
            "5-1, 39, 40, 63, 141, 155, 1001, 1002, 107번: 센텀시티역·벡스코 하차",
            "115, 181, 307, 해운대구 3-1, 3-2번: SK텔레콤 정류소 하차 후 도보 3분"
          ]
        },
        {
          title: "지하철",
          icon: "🚇",
          items: [
            "2호선 센텀시티역 하차"
          ]
        },
        {
          title: "셔틀버스",
          icon: "🚐",
          items: [
            "센텀시티역 4번 출구 앞에서 센텀사이언스파크 정문까지 운행",
            "약 20분 간격이며 당일 현장 상황에 따라 변동될 수 있습니다."
          ]
        },
        {
          title: "도보",
          icon: "🚶",
          items: [
            "센텀시티역 6번 출구에서 약 800m 직진 · 약 15분 소요"
          ]
        }
      ]
    },

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
      { role: "신랑 아버지", name: "정흥운", bank: "부산은행", number: "112-2146-0775-09" },
      { role: "신랑 어머니", name: "정경아", bank: "농협은행", number: "841-12-244747" }
    ],
    bride: [
      { role: "신부", name: "박선영", bank: "우리은행", number: "1002-664-295784" },
      { role: "신부 아버지", name: "박호동", bank: "우리은행", number: "356-0078-1002001" },
      { role: "신부 어머니", name: "하은주", bank: "경남은행", number: "703-21005-6922" }
    ]
  },

  // ── 서울 전세버스 신청 ──
  busReservation: {
    enabled: true,
    title: "서울 전세버스 안내",
    description: "서울·수도권에서 오시는 하객분들의 편의를 위해 예식장까지 왕복 전세버스를 운행할 예정입니다.\n\n원활한 차량 준비와 탑승 인원 확인을 위해 전세버스를 이용하시는 분께서는 아래 신청서를 꼭 작성해 주시길 부탁드립니다.",

    // 신청 버튼 아래에 표시되는 추가 안내 문구
    notice: "신청해 주신 연락처를 통해 버스 출발 장소와 시간 등 자세한 일정을 추후 한 분 한 분 안내드리겠습니다.",

    // 출발 장소/시간이 확정되면 적어주세요. 비워두면 화면에 표시되지 않습니다.
    routeInfo: "",

    // Google Apps Script를 웹 앱으로 배포한 뒤 생성되는 /exec 주소를 입력하세요.
    // 예: https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec
    submitUrl: "https://script.google.com/macros/s/AKfycbxxsd6ZaFM_3H7oN8QQas-F6I8JQ8qbIjy0hOS7sUFFttTnpDf7Haz5wrE019dwznh9/exec"
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "정재훈 ♥ 박선영 결혼합니다",
    description: "2026년 9월 12일, 소중한 분들을 초대합니다."
  }
};
