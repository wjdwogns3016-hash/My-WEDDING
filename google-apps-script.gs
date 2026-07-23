/**
 * 전세버스 신청 저장용 Google Apps Script
 *
 * 사용 방법
 * 1) Google Sheets에서 새 스프레드시트를 만듭니다.
 * 2) 확장 프로그램 → Apps Script를 엽니다.
 * 3) 이 파일 내용을 붙여넣고 저장합니다.
 * 4) 배포 → 새 배포 → 유형: 웹 앱
 * 5) 실행 사용자: 나
 * 6) 액세스 권한: 모든 사용자
 * 7) 배포 후 생성되는 /exec URL을 청첩장 config.js의
 *    CONFIG.busReservation.submitUrl 에 입력합니다.
 */

const BUS_SHEET_NAME = '전세버스 신청';
const BUS_HEADERS = [
  '신청일시',
  '성함',
  '연락처',
  '탑승 인원',
  '이용 구간',
  '동행인 성함',
  '전달사항',
  '신청 경로'
];

function doPost(e) {
  try {
    const sheet = getBusSheet_();
    const p = e && e.parameter ? e.parameter : {};

    const name = clean_(p.name);
    const phone = clean_(p.phone);
    const passengerCount = Number(p.passengerCount || 0);
    const tripType = clean_(p.tripType);
    const companions = clean_(p.companions);
    const note = clean_(p.note);
    const source = clean_(p.source);

    if (!name || !phone || !tripType || !Number.isFinite(passengerCount) || passengerCount < 1) {
      return HtmlService.createHtmlOutput('필수 항목이 누락되었습니다.');
    }

    sheet.appendRow([
      new Date(),
      name,
      phone,
      passengerCount,
      tripType,
      companions,
      note,
      source
    ]);

    return HtmlService.createHtmlOutput('신청이 정상적으로 접수되었습니다.');
  } catch (error) {
    console.error(error);
    return HtmlService.createHtmlOutput('저장 중 오류가 발생했습니다.');
  }
}

function getBusSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(BUS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BUS_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, BUS_HEADERS.length).setValues([BUS_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, BUS_HEADERS.length).setFontWeight('bold');
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }

  return sheet;
}

function clean_(value) {
  return String(value == null ? '' : value).trim().slice(0, 500);
}
