const EVENT_SHEET_NAME = "events";
const SESSION_SHEET_NAME = "sessions";
const PIECE_DAMAGE_SHEET_NAME = "piece_damage";

const EVENT_HEADERS = [
  "received_at",
  "session_id",
  "event_id",
  "event_type",
  "event_at",
  "build_version",
  "stage_key",
  "stage_title",
  "wave",
  "wave_ordinal",
  "wave_total",
  "wave_phase",
  "elapsed_sec",
  "level",
  "kills",
  "damage_done",
  "enemy_count",
  "sort_successes",
  "tower_created",
  "tower_queued",
  "rerolls",
  "perk_choices",
  "max_combo",
  "damage_by_piece",
  "system_damage_by_source",
  "tower_composition",
  "alive_slot_count",
  "destroyed_slot_count",
  "slot_hp_total",
  "slot_hp_avg",
  "slot_hp_min",
  "slot_hp_ratio_avg",
  "slot_hp_ratios",
  "payload_json",
];

const EVENT_DESCRIPTIONS = [
  "서버가 로그를 받은 시각",
  "한 번의 플레이를 구분하는 고유 ID",
  "이벤트 중복을 구분하는 고유 ID",
  "발생한 행동 종류",
  "사용자 기기에서 이벤트가 발생한 시각",
  "플레이한 전시 빌드 버전",
  "스테이지 내부 식별자",
  "화면에 표시되는 스테이지 이름",
  "게임 내부 웨이브 번호",
  "스테이지 기준 몇 번째 웨이브인지",
  "스테이지 전체 웨이브 수",
  "전투/정비/보스 등 당시 상태",
  "세션 시작 후 경과 초",
  "당시 플레이어 레벨",
  "당시 누적 처치 점수",
  "당시 누적 총 피해량",
  "당시 전장에 남은 몬스터 수",
  "당시 누적 소팅 성공 횟수",
  "당시 누적 포탑 생성 횟수",
  "당시 누적 예약 포탑 횟수",
  "당시 누적 리롤 횟수",
  "당시 누적 특전 선택 횟수",
  "당시까지 달성한 최대 콤보",
  "웨이브/세션 이벤트의 기물별 피해 요약",
  "콤보 관통 등 기물 외 시스템 피해",
  "당시 배치·예약된 기물별 포탑 수",
  "살아 있는 슬롯 수",
  "파괴된 슬롯 수",
  "전체 슬롯 체력 합계",
  "슬롯 평균 체력",
  "가장 낮은 슬롯 체력",
  "슬롯 평균 체력 비율(0~1)",
  "각 슬롯 체력 비율 배열",
  "이벤트의 상세 원본 JSON",
];

const SESSION_HEADERS = [
  "received_at",
  "session_id",
  "result",
  "event_at",
  "build_version",
  "stage_key",
  "stage_title",
  "selected_pieces",
  "selected_piece_keys",
  "reached_wave",
  "wave_total",
  "elapsed_sec",
  "duration_ms",
  "sort_successes",
  "tower_created",
  "tower_queued",
  "rerolls",
  "perk_choices",
  "max_combo",
  "picked_perks",
  "kills",
  "damage_done",
  "damage_by_piece",
  "system_damage_by_source",
  "tower_composition",
  "wave_snapshots",
  "wave_remaining_enemies",
  "alive_slot_count",
  "destroyed_slot_count",
  "slot_hp_total",
  "slot_hp_avg",
  "slot_hp_min",
  "slot_hp_ratio_avg",
  "payload_json",
];

const SESSION_DESCRIPTIONS = [
  "서버가 세션 종료 로그를 받은 시각",
  "한 번의 플레이를 구분하는 고유 ID",
  "clear/ fail/ abandon/ restart 종료 결과",
  "사용자 기기에서 세션이 끝난 시각",
  "플레이한 전시 빌드 버전",
  "스테이지 내부 식별자",
  "화면에 표시되는 스테이지 이름",
  "해당 스테이지에 편성한 기물 이름",
  "해당 스테이지에 편성한 기물 내부 키",
  "도달한 가장 높은 웨이브",
  "스테이지 전체 웨이브 수",
  "게임 안에서 흐른 시간(초)",
  "실제 세션 지속 시간(밀리초)",
  "세션 전체 소팅 성공 횟수",
  "세션 전체 포탑 생성 횟수",
  "세션 전체 예약 포탑 횟수",
  "세션 전체 리롤 횟수",
  "세션 전체 특전 선택 횟수",
  "세션에서 달성한 최대 콤보",
  "선택한 특전 이름 목록",
  "세션 전체 처치 점수",
  "세션 전체 피해량(기물+시스템)",
  "기물별 누적 피해량",
  "콤보 관통 등 기물 외 시스템 피해",
  "종료 시 배치·예약된 기물별 포탑 수",
  "완료 웨이브별 피해·슬롯 체력 원본",
  "완료 웨이브별 종료 시 남은 몬스터 수",
  "종료 시 살아 있는 슬롯 수",
  "종료 시 파괴된 슬롯 수",
  "종료 시 전체 슬롯 체력 합계",
  "종료 시 슬롯 평균 체력",
  "종료 시 가장 낮은 슬롯 체력",
  "종료 시 슬롯 평균 체력 비율(0~1)",
  "세션 종료 상세 원본 JSON",
];

const PIECE_DAMAGE_HEADERS = [
  "received_at",
  "session_id",
  "result",
  "stage_key",
  "stage_title",
  "piece_key",
  "piece_name",
  "tower_type",
  "selected",
  "damage_done",
  "damage_share",
  "reached_wave",
  "max_combo",
];

const PIECE_DAMAGE_DESCRIPTIONS = [
  "서버가 세션 종료 로그를 받은 시각",
  "한 번의 플레이를 구분하는 고유 ID",
  "세션 종료 결과",
  "스테이지 내부 식별자",
  "화면에 표시되는 스테이지 이름",
  "기물 내부 식별 키",
  "기물 표시 이름",
  "기물의 TowerType",
  "해당 스테이지 편성 여부",
  "이 기물이 세션에서 준 누적 피해",
  "전체 기물 피해 중 이 기물의 비율(0~1)",
  "세션이 도달한 가장 높은 웨이브",
  "세션에서 달성한 최대 콤보",
];

function doGet() {
  return jsonOutput_({ ok: true, message: "3-Sort exhibition telemetry receiver is alive." });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    lock.waitLock(10000);
    locked = true;
    const payload = parseRequestPayload_(e);
    const events = normalizeEvents_(payload);
    if (!events.length) return jsonOutput_({ ok: false, error: "no_events" });

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) throw new Error("No active spreadsheet. Create this script from Extensions > Apps Script inside the telemetry Sheet.");
    const receivedAt = new Date();
    const eventSheet = ensureSheet_(spreadsheet, EVENT_SHEET_NAME, EVENT_HEADERS, EVENT_DESCRIPTIONS);
    appendRows_(eventSheet, events.map((event) => toEventRow_(event, receivedAt)));

    const sessionEvents = events.filter((event) => event.eventType === "session_end");
    const sessionRows = sessionEvents.map((event) => toSessionRow_(event, receivedAt));
    if (sessionRows.length) {
      const sessionSheet = ensureSheet_(spreadsheet, SESSION_SHEET_NAME, SESSION_HEADERS, SESSION_DESCRIPTIONS);
      appendRows_(sessionSheet, sessionRows);
    }

    const pieceDamageRows = sessionEvents.flatMap((event) => toPieceDamageRows_(event, receivedAt));
    if (pieceDamageRows.length) {
      const pieceDamageSheet = ensureSheet_(
        spreadsheet,
        PIECE_DAMAGE_SHEET_NAME,
        PIECE_DAMAGE_HEADERS,
        PIECE_DAMAGE_DESCRIPTIONS,
      );
      appendRows_(pieceDamageSheet, pieceDamageRows);
    }

    return jsonOutput_({
      ok: true,
      events: events.length,
      sessions: sessionRows.length,
      pieceDamageRows: pieceDamageRows.length,
    });
  } catch (error) {
    return jsonOutput_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function parseRequestPayload_(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
  return JSON.parse(raw);
}

function normalizeEvents_(payload) {
  if (Array.isArray(payload && payload.events)) return payload.events.filter(Boolean);
  if (payload && payload.eventType) return [payload];
  return [];
}

function ensureSheet_(spreadsheet, name, headers, descriptions) {
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  ensureColumnCapacity_(sheet, headers.length);
  if (sheet.getLastRow() > 0 && text_(sheet.getRange(1, 1).getValue()) === "received_at") {
    sheet.insertRowBefore(1);
  }
  sheet.getRange(1, 1, 1, descriptions.length).setValues([descriptions]);
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(2);
  sheet.getRange(1, 1, 1, descriptions.length)
    .setBackground("#fff2cc")
    .setFontWeight("bold")
    .setWrap(true)
    .setVerticalAlignment("middle");
  sheet.getRange(2, 1, 1, headers.length)
    .setBackground("#d9eaf7")
    .setFontWeight("bold")
    .setWrap(false);
  sheet.setRowHeight(1, 48);
  return sheet;
}

function ensureColumnCapacity_(sheet, requiredColumns) {
  const missing = requiredColumns - sheet.getMaxColumns();
  if (missing > 0) sheet.insertColumnsAfter(sheet.getMaxColumns(), missing);
}

function appendRows_(sheet, rows) {
  if (!rows.length) return;
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function toEventRow_(event, receivedAt) {
  const payload = event.payload || {};
  return [
    receivedAt,
    text_(event.sessionId),
    text_(event.eventId),
    text_(event.eventType),
    text_(event.eventAt),
    text_(event.buildVersion),
    text_(event.stageKey),
    text_(event.stageTitle),
    number_(event.wave),
    number_(event.waveOrdinal),
    number_(event.waveTotal),
    text_(event.wavePhase),
    number_(event.elapsedSec),
    number_(event.level),
    number_(event.kills),
    number_(event.damageDone),
    number_(event.enemyCount),
    number_(event.sortSuccesses),
    number_(event.towerCreated),
    number_(event.towerQueued),
    number_(event.rerolls),
    number_(event.perkChoices),
    number_(event.maxCombo || payload.maxCombo),
    formatDamageByPiece_(payload.damageByPiece),
    formatSourceDamage_(payload.systemDamageBySource),
    formatTowerComposition_(payload.towerComposition),
    number_(event.aliveSlotCount),
    number_(event.destroyedSlotCount),
    number_(event.slotHpTotal),
    number_(event.slotHpAvg),
    number_(event.slotHpMin),
    number_(event.slotHpRatioAvg),
    json_(event.slotHpRatios || []),
    json_(event.payload || {}),
  ];
}

function toSessionRow_(event, receivedAt) {
  const payload = event.payload || {};
  const loadout = Array.isArray(payload.loadout) ? payload.loadout : [];
  const pickedPerks = Array.isArray(payload.pickedPerks)
    ? payload.pickedPerks.map((perk) => perk.title || perk.id || "").filter(Boolean).join(", ")
    : "";
  return [
    receivedAt,
    text_(event.sessionId),
    text_(payload.result),
    text_(event.eventAt),
    text_(event.buildVersion),
    text_(event.stageKey),
    text_(event.stageTitle),
    loadout.map((piece) => piece.name || piece.pieceKey || "").filter(Boolean).join(", "),
    loadout.map((piece) => piece.pieceKey || "").filter(Boolean).join(", "),
    number_(event.reachedWave || event.waveOrdinal),
    number_(event.waveTotal),
    number_(event.elapsedSec),
    number_(payload.durationMs),
    number_(event.sortSuccesses),
    number_(event.towerCreated),
    number_(event.towerQueued),
    number_(event.rerolls),
    number_(event.perkChoices),
    number_(payload.maxCombo || event.maxCombo),
    pickedPerks,
    number_(event.kills),
    number_(event.damageDone),
    formatDamageByPiece_(payload.damageByPiece),
    formatSourceDamage_(payload.systemDamageBySource),
    formatTowerComposition_(payload.towerComposition),
    json_(payload.waveSnapshots || []),
    formatWaveRemainingEnemies_(payload.waveRemainingEnemies || payload.waveSnapshots),
    number_(event.aliveSlotCount),
    number_(event.destroyedSlotCount),
    number_(event.slotHpTotal),
    number_(event.slotHpAvg),
    number_(event.slotHpMin),
    number_(event.slotHpRatioAvg),
    json_(payload),
  ];
}

function toPieceDamageRows_(event, receivedAt) {
  const payload = event.payload || {};
  const loadout = Array.isArray(payload.loadout) ? payload.loadout : [];
  const selectedByKey = Object.fromEntries(
    loadout.filter((piece) => piece && piece.pieceKey).map((piece) => [piece.pieceKey, piece]),
  );
  const damageItems = normalizeDamageByPiece_(payload.damageByPiece);
  const damageByKey = Object.fromEntries(damageItems.map((piece) => [piece.pieceKey, piece]));
  const pieceKeys = [...new Set([...Object.keys(selectedByKey), ...Object.keys(damageByKey)])];
  const totalPieceDamage = damageItems.reduce((sum, piece) => sum + number_(piece.damage), 0);
  return pieceKeys.map((pieceKey) => {
    const selectedPiece = selectedByKey[pieceKey] || {};
    const damagePiece = damageByKey[pieceKey] || {};
    const damage = number_(damagePiece.damage);
    return [
      receivedAt,
      text_(event.sessionId),
      text_(payload.result),
      text_(event.stageKey),
      text_(event.stageTitle),
      text_(pieceKey),
      text_(damagePiece.pieceName || selectedPiece.name || pieceKey),
      text_(damagePiece.towerType || selectedPiece.towerType),
      Boolean(selectedByKey[pieceKey]),
      damage,
      totalPieceDamage > 0 ? damage / totalPieceDamage : 0,
      number_(event.reachedWave || event.waveOrdinal),
      number_(payload.maxCombo || event.maxCombo),
    ];
  });
}

function normalizeDamageByPiece_(value) {
  if (Array.isArray(value)) return value.filter((item) => item && item.pieceKey);
  if (!value || typeof value !== "object") return [];
  return Object.keys(value).map((pieceKey) => ({ pieceKey, damage: number_(value[pieceKey]) }));
}

function formatDamageByPiece_(value) {
  return normalizeDamageByPiece_(value)
    .map((piece) => `${piece.pieceName || piece.pieceKey}: ${number_(piece.damage).toFixed(2)}`)
    .join(" | ");
}

function formatSourceDamage_(value) {
  if (!value || typeof value !== "object") return "";
  return Object.keys(value)
    .map((source) => `${source}: ${number_(value[source]).toFixed(2)}`)
    .join(" | ");
}

function formatTowerComposition_(value) {
  if (!Array.isArray(value)) return "";
  return value
    .map((piece) => `${piece.pieceName || piece.pieceKey}: ${number_(piece.count)}`)
    .join(" | ");
}

function formatWaveRemainingEnemies_(value) {
  if (!Array.isArray(value)) return "";
  return value
    .map((snapshot) => {
      const waveOrdinal = number_(snapshot.waveOrdinal || snapshot.wave);
      const remaining = snapshot.remainingEnemyCount != null
        ? number_(snapshot.remainingEnemyCount)
        : number_(snapshot.enemyCount);
      const label = waveOrdinal > 0 ? `W${waveOrdinal}` : text_(snapshot.wave || "");
      return label ? `${label}: ${remaining}` : `${remaining}`;
    })
    .filter(Boolean)
    .join(" | ");
}

function jsonOutput_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function number_(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function text_(value) {
  return value == null ? "" : String(value);
}

function json_(value) {
  try {
    return JSON.stringify(value == null ? null : value);
  } catch (error) {
    return "";
  }
}
