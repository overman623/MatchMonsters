(function () {
  /*
   * 데이터 수정 빠른 지도
   * - 전투 난이도 전체감: defaultConfig, monsters, monsterGroups, wavePatterns
   * - 매치/기물 성능: designTables.PieceData (+ ProjectileData for shot cosmetics)
   * - 스테이지 흐름: stages -> waves -> wavePatterns -> monsterGroups 순서로 연결
   * - 신규 기물/스테이지 추가: designTables의 PieceData/ProjectileData/StageData 행을 추가
   * - TowerData: Phase E에서 제거됨. ConnectTower 컬럼은 레거시 0 유지
   * - 수정 후 검증:
   *   node "tools/validate-phase-2-3.mjs"
   */
  const dataGuide = {
    version: "2026-06-12-authoring-guide",
    quickStart: [
      "몬스터가 너무 많거나 적으면 monsterGroups의 마리 수와 wavePatterns의 time/event를 먼저 봅니다.",
      "몬스터 실스탯은 MonsterData 절대값(MonsterHp/MonsterAtk/MoveSpeed/AtkSpeed). config *Mult는 레거시 폴백입니다.",
      "매치 샷/박치기는 PieceData(MatchAttack/Atk)와 ProjectileData를 먼저 봅니다.",
      "신규 기물은 PieceData 행을 추가하면 자동으로 편성/상점 후보에 들어갑니다.",
      "기물 강화는 PieceUpgradeData의 FromPieceID -> ToPieceID로 보유 ID를 교체하고, 비용은 UpgradeCostData에서 읽습니다.",
      "신규 스테이지는 StageData/WaveData/WavePatternData 행을 추가하면 메인화면 화살표 목록에 들어갑니다.",
      "신규 보스는 BossData 행을 추가하고 StageData.BossID에서 참조합니다.",
      "기획서 원본형 데이터 구조는 designTables와 designTableSchema를 기준으로 봅니다.",
    ],
    coreLinks: [
      "pieces.*.matchAttack / pieces.*.atk / pieces.*.speed -> match combat (speed = headbutt travel range)",
      "MATCH_SHOT_DEFAULTS.projectileId -> projectiles.*",
      "monsters.*.projectileId -> monsterProjectiles.*",
      "waves.*.patternId -> wavePatterns.*",
      "wavePatterns.*.events[].groupId -> monsterGroups.*",
      "monsterGroups.*.monsters의 key -> monsters.*",
      "stages[].waveIds -> waves.*",
    ],
    editOrder: [
      "defaultConfig",
      "projectiles",
      "monsterProjectiles",
      "monsters",
      "monsterGroups",
      "wavePatterns",
      "waves",
      "pieces",
      "loadout",
    ],
    tables: {
      defaultConfig: {
        label: "전역 전투 밸런스",
        editWhen: "전체 난이도, 슬롯 체력, 기본 탄 데미지, 웨이브 시간, 보스 배율을 조절할 때",
        hotFields: ["slotHp", "monsterHp", "monsterDamage", "bulletDamage", "bulletSpeed", "waveDuration", "enemyCap", "difficultyTierIntervalSec"],
      },
      towerTypes: {
        label: "포탑 유형 기본값",
        editWhen: "기본형/산탄형/저격형 같은 큰 역할, 색상, 기본 설명을 바꿀 때",
        hotFields: ["name", "color", "image", "aiType", "targetPriority", "projectileType"],
      },
      pieces: {
        label: "실제 기물",
        editWhen: "캐릭터 이름, 보유 여부, 연결 포탑을 바꿀 때",
        hotFields: ["type", "star", "name", "matchAttack", "atk", "speed", "owned", "attribute"],
      },
      projectiles: {
        label: "투사체 성능",
        editWhen: "탄 크기, 탄속, 관통, 산탄 각도, 폭발 범위, 체력 비례 피해를 바꿀 때",
        hotFields: ["homing", "speedMult", "damageRatio", "radius", "life", "pierceHits", "splashRadius"],
      },
      monsters: {
        label: "몬스터 타입",
        editWhen: "벽면형/지상형/공중형/원거리형/보스형의 체력, 속도, 공격 배율을 바꿀 때",
        hotFields: ["hpMult", "damageMult", "speedMult", "attackRateMult", "pack", "xp", "projectileId", "canMove", "canAttack", "testDummy"],
      },
      monsterProjectiles: {
        label: "몬스터 투사체",
        editWhen: "몬스터 탄 이미지, 탄속, 크기, 수명을 바꿀 때",
        hotFields: ["name", "prefab", "speed", "radius", "life"],
      },
      monsterGroups: {
        label: "스폰 묶음",
        editWhen: "한 번에 어떤 몬스터가 몇 마리 나오는지 바꿀 때",
        hotFields: ["monsters", "eliteChance", "spreadX", "spreadY"],
      },
      wavePatterns: {
        label: "웨이브 타임라인",
        editWhen: "몇 초에 어떤 스폰 묶음이 나오는지 바꿀 때",
        hotFields: ["events[].time", "events[].groupId", "events[].repeat", "events[].eliteChance"],
      },
      waves: {
        label: "웨이브 목록",
        editWhen: "웨이브 이름, 타입, 지속시간, 보스/패턴 연결을 바꿀 때",
        hotFields: ["label", "type", "duration", "patternId", "bossId"],
      },
      bosses: {
        label: "보스",
        editWhen: "최종보스 체력, 근접/원거리 공격, 소환 패턴, 등장 위치를 바꿀 때. 원본 수정은 designTables.BossData를 우선 사용합니다.",
        hotFields: ["hpMult", "meleeDamage", "rangedDamage", "attackRange", "summon", "spawn"],
      },
      stages: {
        label: "스테이지",
        editWhen: "스테이지 이름, 메인화면 화살표 순서, 사용 웨이브, 클리어 보상을 바꿀 때",
        hotFields: ["key", "title", "subtitle", "waveIds", "bossIds", "waveReward", "clearReward", "ui.mainImage"],
      },
      loadout: {
        label: "덱 편성/덱 생성",
        editWhen: "캐릭터 편성 수, 공격 기물, 선택 가능 기물, 덱 생성 규칙을 바꿀 때",
        hotFields: ["maxSlots", "attackPieceKeys", "orePieceKeys", "fallbackPieceKeys", "selectablePieceKeys", "startDeck"],
      },
      levelData: {
        label: "경험치/콤보",
        editWhen: "레벨업 속도, 콤보 유지 시간을 바꿀 때",
        hotFields: ["xpBase", "xpLevelGrowth", "comboWindow", "comboAlertWindow"],
      },
      progression: {
        label: "로비 성장",
        editWhen: "기물 강화 연결과 강화 비용을 바꿀 때",
        hotFields: ["PieceUpgradeData.FromPieceID", "PieceUpgradeData.ToPieceID", "UpgradeCostData.UpgradeCost", "PieceData.PieceLv"],
      },
      shop: {
        label: "상점/해금",
        editWhen: "기물 해금 비용과 상점 정렬 순서를 바꿀 때",
        hotFields: ["pieceUnlocks", "fallbackUnlockCost"],
      },
      designTables: {
        label: "기획서 원본형 테이블",
        editWhen: "기획서/스프레드시트의 PascalCase 컬럼 구조를 기준으로 값을 맞출 때",
        hotFields: ["StageData", "WaveData", "WavePatternData", "MonsterData", "BossData", "AttributeData", "PieceData", "PieceUpgradeData", "UpgradeCostData"],
      },
    },
  };

  // 포탑/매치 공격 유형 테이블.
  // 캐릭터 기물은 전부 matchAttack(매치 시 슬롯 중앙 산탄)로 통일합니다.
  // basic/scatter 등 옛 키는 호환용 alias이며 type 값은 matchAttack입니다.
  // attack 은 정렬 전용 공격 기물(박치기)용입니다.
  const matchAttackType = {
    type: "matchAttack",
    mark: "MA",
    name: "Match Attack",
    color: "#ff8d4d",
    image: "assets/images/ui/PIECE/산탄형.png",
    fireRateMod: 0.9,
    range: 1600,
    description: "Fires a scatter volley from the slot center on match.",
    designRole: "Match attack",
    aiType: "shotgun",
    targetPriority: "near",
    projectileType: "normal",
  };

  const towerTypes = {
    matchAttack: { ...matchAttackType },
    // legacy aliases → matchAttack
    basic: { ...matchAttackType },
    scatter: { ...matchAttackType },
    ranger: { ...matchAttackType },
    sniper: { ...matchAttackType },
    breaker: { ...matchAttackType },
    blast: { ...matchAttackType },
    support: { ...matchAttackType },
    // 정렬 전용 공격 기물용 표시 타입 (포탑 생성 없음, 매치 시 박치기)
    attack: {
      type: "attack",
      mark: "AT",
      name: "Attack Piece",
      color: "#9aa4b2",
      image: "",
      owned: false,
      fireRateMod: 0,
      range: 0,
      description: "Attack piece that headbutts on match without a tower.",
      designRole: "Sort/match attack piece",
      aiType: "none",
      targetPriority: "near",
      projectileType: "none",
    },
    // 원석 기물용 표시 타입 (속성별 박치기)
    ore: {
      type: "ore",
      mark: "OR",
      name: "Ore Piece",
      color: "#c9b6ff",
      image: "",
      owned: false,
      fireRateMod: 0,
      range: 0,
      description: "Elemental ore piece that headbutts on match without a tower.",
      designRole: "Sort/match ore piece",
      aiType: "none",
      targetPriority: "near",
      projectileType: "none",
    },
    // 특수 클릭 기물용 표시 타입
    special: {
      type: "special",
      mark: "SP",
      name: "Special Piece",
      color: "#5ec8ff",
      image: "",
      owned: false,
      fireRateMod: 0,
      range: 0,
      description: "Click-to-clear special piece.",
      designRole: "Sort special piece",
      aiType: "none",
      targetPriority: "near",
      projectileType: "none",
    },
  };

  // Piece/Tower/Projectile 런타임 정의는 designTables의 PascalCase 원본 행에서만 생성합니다.

  // 몬스터 테이블: 몬스터 타입별 배율입니다. 기본값은 defaultConfig와 곱해집니다.
  const monsters = {
    basic: {
      key: "basic",
      monsterId: "monster_basic_1",
      name: "Wall",
      role: "좌우 벽면에서 등장하는 표준 몬스터",
      mark: "M",
      color: "#d85d72",
      hpMult: 13.6363636364,
      damageMult: 1,
      speedMult: 1,
      attackRateMult: 1,
      radiusAdd: 0,
      projectileId: null,
      taunt: 1,
      pack: 1,
      weight: 0.44,
      xp: 1,
      designStatus: "core",
    },
    tank: {
      key: "tank",
      monsterId: "monster_tank_1",
      name: "Ground",
      role: "하단에서 등장하는 높은 체력 몬스터",
      mark: "T",
      color: "#b982ff",
      hpMult: 40.9090909091,
      damageMult: 1,
      speedMult: 0.55,
      attackRateMult: 1.15,
      radiusAdd: 5,
      attackRange: 60,
      projectileId: "7102",
      taunt: 7,
      pack: 1,
      weight: 0.12,
      xp: 1,
      designStatus: "core",
    },
    speed: {
      key: "speed",
      monsterId: "monster_speed_1",
      name: "Air",
      role: "상단에서 등장하는 빠른 몬스터",
      mark: "S",
      color: "#ffcf5a",
      hpMult: 9.5454545455,
      damageMult: 1,
      speedMult: 1.85,
      attackRateMult: 0.82,
      radiusAdd: -2,
      attackRange: 150,
      projectileId: "7101",
      taunt: 0.55,
      pack: 1,
      weight: 0.34,
      xp: 1,
      designStatus: "core",
    },
    ranged: {
      key: "ranged",
      monsterId: "monster_ranged_1",
      name: "Ranged",
      role: "Ranged reserve monster",
      mark: "R",
      color: "#69d7ff",
      hpMult: 10.9090909091,
      damageMult: 1,
      speedMult: 0.78,
      attackRateMult: 1.45,
      radiusAdd: 0,
      attackRange: 132,
      projectileId: "7103",
      taunt: 0.8,
      pack: 1,
      weight: 0.1,
      xp: 1,
      designStatus: "core",
    },
    centerCat: {
      key: "centerCat",
      monsterId: "center_cat",
      name: "Cat",
      role: "Center pressure · Full-sort timer",
      mark: "C",
      color: "#ff8f5a",
      hpMult: 1,
      damageMult: 1,
      speedMult: 1,
      attackRateMult: 1,
      radiusAdd: 2,
      attackRange: 150,
      projectileId: "7101",
      taunt: 2,
      pack: 1,
      weight: 0,
      xp: 2,
      isCenter: true,
      timedAttackDuration: 55,
      timedAttackDamage: 120,
      designStatus: "core",
    },
    centerEgg: {
      key: "centerEgg",
      monsterId: "center_egg",
      name: "Egg",
      role: "Center pressure · long Full-sort timer",
      mark: "E",
      color: "#ffe08a",
      hpMult: 1,
      damageMult: 1,
      speedMult: 1,
      attackRateMult: 1,
      radiusAdd: 4,
      attackRange: 150,
      projectileId: "7101",
      taunt: 2.5,
      pack: 1,
      weight: 0,
      xp: 2,
      isCenter: true,
      timedAttackDuration: 80,
      timedAttackDamage: 200,
      designStatus: "core",
    },
    centerDevil: {
      key: "centerDevil",
      monsterId: "center_devil",
      name: "Devil",
      role: "Center pressure · fast match turns",
      mark: "D",
      color: "#ff5a7a",
      hpMult: 1,
      damageMult: 1,
      speedMult: 1,
      attackRateMult: 1,
      radiusAdd: 2,
      attackRange: 150,
      projectileId: "7101",
      taunt: 2.2,
      pack: 1,
      weight: 0,
      xp: 2,
      isCenter: true,
      timedAttackDuration: 45,
      timedAttackDamage: 120,
      designStatus: "core",
    },
    midBoss: {
      key: "midBoss",
      monsterId: "monster_mid_boss_1",
      name: "Mid Boss",
      role: "Legacy mid-boss compatible large monster",
      mark: "MB",
      color: "#ff9f43",
      hpMult: 1,
      damageMult: 1,
      speedMult: 1,
      attackRateMult: 1,
      radiusAdd: 0,
      taunt: 18,
      pack: 1,
      weight: 0,
      xp: 1,
      designStatus: "legacy-prototype",
    },
    finalBoss: {
      key: "finalBoss",
      monsterId: "monster_final_boss_1",
      name: "Final Boss",
      role: "Final wave boss",
      mark: "B",
      color: "#ff4f6d",
      sprite: "assets/images/monsters/boss.png",
      hpMult: 1,
      damageMult: 1,
      speedMult: 1,
      attackRateMult: 1,
      radiusAdd: 0,
      attackRange: 110,
      projectileId: "7104",
      taunt: 25,
      pack: 1,
      weight: 0,
      xp: 1,
      designStatus: "core",
    },
    dummy: {
      key: "dummy",
      monsterId: "monster_test_dummy_1",
      name: "Dummy",
      role: "Stationary target dummy for test stage",
      mark: "D",
      color: "#9ee7ff",
      hpMult: 18,
      damageMult: 0.01,
      speedMult: 0.01,
      attackRateMult: 1,
      radiusAdd: 7,
      taunt: 12,
      pack: 1,
      weight: 0,
      xp: 1,
      canMove: false,
      canAttack: false,
      testDummy: true,
      designStatus: "test-only",
    },
  };

  // 보스 테이블: 보스 전용 체력/공격/소환/등장 위치 데이터입니다.
  const bosses = {
    mid_boss_1: {
      id: "mid_boss_1",
      kind: "mid",
      monsterKey: "midBoss",
      label: "중간보스",
      banner: "중간보스 등장",
      spawn: { xRatio: 0.5, yRatio: 0.11 },
      hpMult: 95,
      meleeDamage: 4,
      rangedDamage: 0,
      speed: 18,
      attackRate: 1.15,
      rangedRate: 0,
      matchMeleeInterval: 2,
      matchRangedInterval: 4,
      attackRange: 0,
      meleeRange: 38,
      radius: 27,
      taunt: 18,
      xp: 1,
      configKeys: {
        hpMult: "midBossHpMult",
        meleeDamage: "midBossDamage",
        speed: "midBossSpeed",
        meleeWarning: "bossMeleeWarningTime",
      },
      patterns: [],
    },
    final_boss_1: {
      id: "final_boss_1",
      kind: "final",
      monsterKey: "finalBoss",
      label: "최종보스",
      banner: "최종보스 등장",
      spawn: { xRatio: 0.5, yRatio: 0.11 },
      hpMult: 909.0909090909,
      meleeDamage: 14,
      rangedDamage: 4,
      speed: 22,
      attackRate: 0.95,
      rangedRate: 1.45,
      matchMeleeInterval: 2,
      matchRangedInterval: 4,
      attackRange: 110,
      standOffRange: 110,
      meleeRange: 0,
      radius: 47,
      taunt: 25,
      xp: 1,
      forkCount: 3,
      forkSpreadDeg: 72,
      forkShotInterval: 0.16,
      orbEveryAttacks: 5,
      orbMaxHp: 3750,
      orbDurationSec: 20,
      orbFailDamage: 400,
      orbOffsetX: 78,
      orbRadius: 30,
      orbRamDamageMult: 0.5,
      orbMatchDamageMult: 2,
      summon: {
        monsterKey: "speed",
        interval: 8,
        count: 12,
        radiusMin: 34,
        radiusMax: 74,
        spreadX: 5,
        spreadY: 5,
        banner: "공중형 대량 소환",
        log: "최종보스 패턴: 공중형 대량 소환",
      },
      warning: {
        rangedDelay: 0.75,
        meleeDelay: 0.55,
      },
      configKeys: {
        orbMaxHp: "bossOrbMaxHp",
        orbDurationSec: "bossOrbDurationSec",
        orbFailDamage: "bossOrbFailDamage",
        hpMult: "finalBossHpMult",
        meleeDamage: "finalBossMeleeDamage",
        rangedDamage: "finalBossRangedDamage",
        speed: "finalBossSpeed",
        attackRange: "finalBossRangedRange",
        summonInterval: "finalBossSummonSec",
        summonCount: "finalBossSummonCount",
        rangedWarning: "bossWarningTime",
        meleeWarning: "bossMeleeWarningTime",
      },
      patterns: ["ranged_warning", "melee_warning", "summon_speed_pack"],
    },
  };

  // 몬스터 그룹 테이블: 웨이브 타임라인에서 한 번에 스폰할 몬스터 묶음입니다.
  const monsterGroups = {
    mg_w1_basic_01: { id: "mg_w1_basic_01", monsters: { basic: 4, speed: 1 } },
    mg_w1_basic_02: { id: "mg_w1_basic_02", monsters: { basic: 5, speed: 1 } },
    mg_w2_speed_01: { id: "mg_w2_speed_01", monsters: { basic: 5, speed: 3 } },
    mg_w2_speed_02: { id: "mg_w2_speed_02", monsters: { basic: 6, speed: 4 } },
    mg_w3_tank_01: { id: "mg_w3_tank_01", monsters: { basic: 6, speed: 3, tank: 1 } },
    mg_w3_tank_02: { id: "mg_w3_tank_02", monsters: { basic: 7, speed: 4, tank: 1 } },
    mg_w4_rush_01: { id: "mg_w4_rush_01", monsters: { basic: 8, speed: 6, tank: 1 } },
    mg_w4_rush_02: { id: "mg_w4_rush_02", monsters: { basic: 10, speed: 8, tank: 1 } },
    mg_w5_mixed_01: { id: "mg_w5_mixed_01", monsters: { basic: 9, speed: 5, tank: 1 } },
    mg_w5_mixed_02: { id: "mg_w5_mixed_02", monsters: { basic: 10, speed: 6, tank: 2 } },
    mg_w6_elite_01: { id: "mg_w6_elite_01", monsters: { basic: 10, speed: 6, tank: 2 }, eliteChance: 0.06 },
    mg_w6_elite_02: { id: "mg_w6_elite_02", monsters: { basic: 11, speed: 8, tank: 2 }, eliteChance: 0.08 },
    mg_w7_pressure_01: { id: "mg_w7_pressure_01", monsters: { basic: 9, speed: 10, tank: 3 }, eliteChance: 0.1 },
    mg_w7_pressure_02: { id: "mg_w7_pressure_02", monsters: { basic: 10, speed: 11, tank: 3 }, eliteChance: 0.12 },
    mg_w8_rush_01: { id: "mg_w8_rush_01", monsters: { basic: 11, speed: 11, tank: 3 }, eliteChance: 0.1 },
    mg_w8_rush_02: { id: "mg_w8_rush_02", monsters: { basic: 13, speed: 12, tank: 4 }, eliteChance: 0.12 },
    mg_w9_final_01: { id: "mg_w9_final_01", monsters: { basic: 11, speed: 10, tank: 4 }, eliteChance: 0.12 },
    mg_w9_final_02: { id: "mg_w9_final_02", monsters: { basic: 12, speed: 11, tank: 5 }, eliteChance: 0.14 },
    mg_final_boss_adds: { id: "mg_final_boss_adds", monsters: { speed: 8 } },
    mg_test_dummy_01: {
      id: "mg_test_dummy_01",
      monsters: { dummy: 3 },
      spawnPoint: { xRatio: 0.5, yRatio: 0.31 },
      spreadX: 42,
      spreadY: 10,
    },
    mg_test_dummy_02: {
      id: "mg_test_dummy_02",
      monsters: { dummy: 5 },
      spawnPoint: { xRatio: 0.5, yRatio: 0.5 },
      spreadX: 58,
      spreadY: 16,
    },
    mg_test_dummy_03: {
      id: "mg_test_dummy_03",
      monsters: { dummy: 7 },
      spawnPoint: { xRatio: 0.5, yRatio: 0.69 },
      spreadX: 68,
      spreadY: 18,
    },
  };

  // 웨이브 패턴 테이블: 몇 초에 어떤 monsterGroup을 호출할지 정합니다.
  const wavePatterns = {
    wp_w1: {
      id: "wp_w1",
      events: [
        { time: 0, groupId: "mg_w1_basic_01" },
        { time: 5, groupId: "mg_w1_basic_01" },
        { time: 10, groupId: "mg_w1_basic_02" },
        { time: 15, groupId: "mg_w1_basic_01" },
        { time: 20, groupId: "mg_w1_basic_02" },
        { time: 25, groupId: "mg_w1_basic_01" },
        { time: 30, groupId: "mg_w1_basic_02" },
      ],
    },
    wp_w2: {
      id: "wp_w2",
      events: [
        { time: 0, groupId: "mg_w2_speed_01" },
        { time: 5, groupId: "mg_w2_speed_01" },
        { time: 10, groupId: "mg_w2_speed_02" },
        { time: 15, groupId: "mg_w2_speed_01" },
        { time: 20, groupId: "mg_w2_speed_02" },
        { time: 25, groupId: "mg_w2_speed_01" },
        { time: 30, groupId: "mg_w2_speed_02" },
      ],
    },
    wp_w3: {
      id: "wp_w3",
      events: [
        { time: 0, groupId: "mg_w3_tank_01" },
        { time: 5, groupId: "mg_w3_tank_01" },
        { time: 10, groupId: "mg_w3_tank_02" },
        { time: 15, groupId: "mg_w3_tank_01" },
        { time: 20, groupId: "mg_w3_tank_02" },
        { time: 25, groupId: "mg_w3_tank_01" },
        { time: 30, groupId: "mg_w3_tank_02" },
      ],
    },
    wp_w4: {
      id: "wp_w4",
      events: [
        { time: 0, groupId: "mg_w4_rush_01" },
        { time: 5, groupId: "mg_w4_rush_01" },
        { time: 10, groupId: "mg_w4_rush_02" },
        { time: 15, groupId: "mg_w4_rush_01" },
        { time: 20, groupId: "mg_w4_rush_02" },
        { time: 25, groupId: "mg_w4_rush_01" },
        { time: 30, groupId: "mg_w4_rush_02" },
      ],
    },
    wp_w5: {
      id: "wp_w5",
      events: [
        { time: 0, groupId: "mg_w5_mixed_01" },
        { time: 5, groupId: "mg_w5_mixed_01" },
        { time: 10, groupId: "mg_w5_mixed_02" },
        { time: 15, groupId: "mg_w5_mixed_01" },
        { time: 20, groupId: "mg_w5_mixed_02" },
        { time: 25, groupId: "mg_w5_mixed_01" },
        { time: 30, groupId: "mg_w5_mixed_02" },
      ],
    },
    wp_w6: {
      id: "wp_w6",
      events: [
        { time: 0, groupId: "mg_w6_elite_01" },
        { time: 5, groupId: "mg_w6_elite_01" },
        { time: 10, groupId: "mg_w6_elite_02" },
        { time: 15, groupId: "mg_w6_elite_01" },
        { time: 20, groupId: "mg_w6_elite_02" },
        { time: 25, groupId: "mg_w6_elite_01" },
        { time: 30, groupId: "mg_w6_elite_02" },
      ],
    },
    wp_w7: {
      id: "wp_w7",
      events: [
        { time: 0, groupId: "mg_w7_pressure_01" },
        { time: 5, groupId: "mg_w7_pressure_01" },
        { time: 10, groupId: "mg_w7_pressure_02" },
        { time: 15, groupId: "mg_w7_pressure_01" },
        { time: 20, groupId: "mg_w7_pressure_02" },
        { time: 25, groupId: "mg_w7_pressure_01" },
        { time: 30, groupId: "mg_w7_pressure_02" },
      ],
    },
    wp_w8: {
      id: "wp_w8",
      events: [
        { time: 0, groupId: "mg_w8_rush_01" },
        { time: 5, groupId: "mg_w8_rush_01" },
        { time: 10, groupId: "mg_w8_rush_02" },
        { time: 15, groupId: "mg_w8_rush_01" },
        { time: 20, groupId: "mg_w8_rush_02" },
        { time: 25, groupId: "mg_w8_rush_01" },
        { time: 30, groupId: "mg_w8_rush_02" },
      ],
    },
    wp_w9: {
      id: "wp_w9",
      events: [
        { time: 0, groupId: "mg_w9_final_01" },
        { time: 5, groupId: "mg_w9_final_01" },
        { time: 10, groupId: "mg_w9_final_02" },
        { time: 15, groupId: "mg_w9_final_01" },
        { time: 20, groupId: "mg_w9_final_02" },
        { time: 25, groupId: "mg_w9_final_01" },
        { time: 30, groupId: "mg_w9_final_02" },
      ],
    },
    wp_test_dummy: {
      id: "wp_test_dummy",
      events: [
        { time: 0, groupId: "mg_test_dummy_01" },
        { time: 4, groupId: "mg_test_dummy_02" },
        { time: 8, groupId: "mg_test_dummy_01" },
        { time: 12, groupId: "mg_test_dummy_03" },
        { time: 16, groupId: "mg_test_dummy_02" },
        { time: 20, groupId: "mg_test_dummy_01" },
        { time: 24, groupId: "mg_test_dummy_03" },
        { time: 28, groupId: "mg_test_dummy_02" },
        { time: 32, groupId: "mg_test_dummy_03" },
      ],
    },
  };

  // 웨이브 테이블: 1~10 웨이브의 타입/지속시간/패턴/보스 연결입니다.
  const waves = {
    1: { id: 1, label: "입문 물량", type: "normal", duration: 32, patternId: "wp_w1" },
    2: { id: 2, label: "공중형 적응", type: "normal", duration: 32, patternId: "wp_w2" },
    3: { id: 3, label: "탱커 첫 압박", type: "normal", duration: 32, patternId: "wp_w3" },
    4: { id: 4, label: "러시", type: "rush", duration: 32, patternId: "wp_w4" },
    5: { id: 5, label: "혼합 압박", type: "normal", duration: 32, patternId: "wp_w5" },
    6: { id: 6, label: "엘리트 진입", type: "normal", duration: 32, patternId: "wp_w6" },
    7: { id: 7, label: "속도 압박", type: "normal", duration: 32, patternId: "wp_w7" },
    8: { id: 8, label: "대형 러시", type: "rush", duration: 32, patternId: "wp_w8" },
    9: { id: 9, label: "최종 전 압박", type: "normal", duration: 32, patternId: "wp_w9" },
    10: { id: 10, label: "최종보스", type: "boss", bossId: "final_boss_1", bossKind: "final", duration: 0 },
    101: { id: 101, label: "허수아비 테스트 1", type: "test", duration: 40, patternId: "wp_test_dummy" },
    102: { id: 102, label: "허수아비 테스트 2", type: "test", duration: 40, patternId: "wp_test_dummy" },
    103: { id: 103, label: "허수아비 테스트 3", type: "test", duration: 40, patternId: "wp_test_dummy" },
    104: { id: 104, label: "허수아비 테스트 4", type: "test", duration: 40, patternId: "wp_test_dummy" },
    105: { id: 105, label: "허수아비 테스트 5", type: "test", duration: 40, patternId: "wp_test_dummy" },
    106: { id: 106, label: "허수아비 테스트 6", type: "test", duration: 40, patternId: "wp_test_dummy" },
    107: { id: 107, label: "허수아비 테스트 7", type: "test", duration: 40, patternId: "wp_test_dummy" },
    108: { id: 108, label: "허수아비 테스트 8", type: "test", duration: 40, patternId: "wp_test_dummy" },
    109: { id: 109, label: "허수아비 테스트 9", type: "test", duration: 40, patternId: "wp_test_dummy" },
    110: { id: 110, label: "허수아비 테스트 10", type: "test", duration: 40, patternId: "wp_test_dummy" },
  };

  // 덱 편성/보충 테이블
  // 편성: 캐릭터 4 / 정렬 덱: 편성 4 + 공격 기물 4 = 8종
  // orePieceKeys는 데이터로 남겨두되 정렬 덱에는 넣지 않음(공격 기물 유지).
  const loadout = {
    maxSlots: 4,
    defaultPieceKeys: ["cactus_1", "owl_1", "robot_1", "knight_1"],
    fallbackPieceKeys: ["cactus_1", "owl_1", "robot_1", "knight_1"],
    selectablePieceKeys: [
      "ghost_1", "wizard_1", "shark_1", "dragon_1", "cowboy_1", "cactus_1",
      "owl_1", "robot_1", "gorilla_1", "knight_1", "tiger_1", "slime_1",
    ],
    attackPieceKeys: ["Attack_Arrow", "Attack_Bomb", "Attack_Stone", "Attack_Axe"],
    orePieceKeys: [],
    specialClickPieceKeys: ["Special_Mana", "Special_Heal", "Special_Atk"],
    startDeck: {
      setsPerPiece: 3,
      cellsPerSet: 3,
      initialPiecesPerSlot: 2,
      refillPiecesPerEmptySlot: 2,
    },
  };

  const attackPieceDefs = [
    // Speed = 박치기 이동 가능 거리(px). Atk = 박치기 피해.
    // 화살: 단일 고기둥 / 폭탄·도끼: 다수에 약한 피해.
    { pieceId: 8101, key: "Attack_Arrow", name: "Attack Arrow", mark: "Ar", color: "#8b95a5", image: "assets/images/ui/PIECE/Attack_Arrow.png", matchAttack: 1, speed: 260, hp: 1, atk: 500, matchType: 0, ramStyle: "single", desc: "단일 대상 강한 박치기" },
    { pieceId: 8102, key: "Attack_Bomb", name: "Attack Bomb", mark: "Bo", color: "#c4a574", image: "assets/images/ui/PIECE/Attack_Bomb.png", matchAttack: 1, speed: 170, hp: 1, atk: 180, matchType: 0, ramStyle: "splash", splashRadius: 100, splashDamageRatio: 0.7, desc: "약한 박치기 + 주변 스플래시" },
    { pieceId: 8103, key: "Attack_Stone", name: "Attack Stone", mark: "St", color: "#7a9e8a", image: "assets/images/ui/PIECE/Attack_Stone.png", matchAttack: 1, speed: 180, hp: 1, atk: 50, matchType: 0, ramStyle: "knockback", knockback: 84, desc: "약한 박치기 + 넉백" },
    { pieceId: 8104, key: "Attack_Axe", name: "Attack Axe", mark: "Ax", color: "#a67c8a", image: "assets/images/ui/PIECE/Attack_Axe.png", matchAttack: 1, speed: 240, hp: 1, atk: 180, matchType: 0, ramStyle: "pierce", desc: "약한 관통 박치기" },
  ];

  // 원석 기물: 속성별 박치기 전용. Atk/Speed/ramStyle은 Attack_Arrow와 동일.
  const orePieceDefs = [
    { pieceId: 8301, key: "Ore_Fire", name: "Fire Ore", mark: "Fi", color: "#ff7a6e", image: "assets/images/ui/PIECE/Stone_Fire.png", attribute: 1, matchAttack: 1, speed: 260, hp: 1, atk: 500, matchType: 0, ramStyle: "single", desc: "불 원석 · 단일 박치기" },
    { pieceId: 8302, key: "Ore_Water", name: "Water Ore", mark: "Wa", color: "#5eb0c9", image: "assets/images/ui/PIECE/Stone_Water.png", attribute: 2, matchAttack: 1, speed: 260, hp: 1, atk: 500, matchType: 0, ramStyle: "single", desc: "물 원석 · 단일 박치기" },
    { pieceId: 8303, key: "Ore_Leaf", name: "Leaf Ore", mark: "Lf", color: "#6fbf73", image: "assets/images/ui/PIECE/Stone_Leaf.png", attribute: 4, matchAttack: 1, speed: 260, hp: 1, atk: 500, matchType: 0, ramStyle: "single", desc: "나무 원석 · 단일 박치기" },
    { pieceId: 8304, key: "Ore_Volt", name: "Volt Ore", mark: "Vo", color: "#7ec8ff", image: "assets/images/ui/PIECE/Stone_Volt.png", attribute: 3, matchAttack: 1, speed: 260, hp: 1, atk: 500, matchType: 0, ramStyle: "single", desc: "전기 원석 · 단일 박치기" },
  ];

  const specialClickPieceDefs = [
    {
      pieceId: 8201,
      key: "Special_Mana",
      name: "Mana Crystal",
      mark: "MP",
      color: "#5ec8ff",
      image: "assets/images/ui/PIECE/Special_1.png",
      matchAttack: 0,
      speed: 1,
      hp: 1,
      atk: 0,
      matchType: 0,
      specialEffect: "mpUp",
      effectValue: 3,
    },
    {
      pieceId: 8202,
      key: "Special_Heal",
      name: "Life Heal",
      mark: "HP",
      color: "#6fd3a0",
      image: "assets/images/ui/PIECE/Special_2.png",
      matchAttack: 0,
      speed: 1,
      hp: 1,
      atk: 0,
      matchType: 0,
      specialEffect: "healHp",
      effectValue: 0,
    },
    {
      pieceId: 8203,
      key: "Special_Atk",
      name: "Attack Up",
      mark: "ATK",
      color: "#f0a060",
      image: "assets/images/ui/PIECE/Special_3.png",
      matchAttack: 0,
      speed: 1,
      hp: 1,
      atk: 0,
      matchType: 0,
      specialEffect: "atkUp",
      effectValue: 0,
    },
  ];

  // Attribute: 0=None(무속성), 1=Flame, 2=Water, 3=Bolt, 4=Leaf.
  // Default is None until combat affinity is wired.
  const PIECE_ATTRIBUTE = Object.freeze({
    NONE: 0,
    FLAME: 1,
    WATER: 2,
    BOLT: 3,
    LEAF: 4,
  });
  const PIECE_ATTRIBUTE_INFO = Object.freeze({
    [PIECE_ATTRIBUTE.NONE]: { key: "none", name: "None", labelKo: "무속성", role: "기본" },
    [PIECE_ATTRIBUTE.FLAME]: { key: "flame", name: "Flame", labelKo: "불", role: "화력/폭발" },
    [PIECE_ATTRIBUTE.WATER]: { key: "water", name: "Water", labelKo: "물", role: "제어/지속" },
    [PIECE_ATTRIBUTE.BOLT]: { key: "bolt", name: "Bolt", labelKo: "전", role: "관통/연쇄" },
    [PIECE_ATTRIBUTE.LEAF]: { key: "leaf", name: "Leaf", labelKo: "풀", role: "산탄/지원" },
  });
  const normalizePieceAttribute = (value) => {
    const id = Math.max(0, Math.floor(Number(value) || 0));
    return PIECE_ATTRIBUTE_INFO[id] ? id : PIECE_ATTRIBUTE.NONE;
  };
  const getPieceAttributeInfo = (value) => PIECE_ATTRIBUTE_INFO[normalizePieceAttribute(value)];

  const attackPieceLevelRows = attackPieceDefs.map((def) => ({
    PieceID: def.pieceId,
    PieceName: def.name,
    MatchType: Number(def.matchType) || 0,
    Attribute: normalizePieceAttribute(def.attribute),
    PieceDesc: def.desc || "공격 기물 (포탑 없음, 매치 시 박치기)",
    PieceGrade: 1,
    PieceLv: 1,
    ConnectTower: 0,
    Portrait: def.image,
    PieceSprite: def.image,
    MatchAttack: Number(def.matchAttack) || 1,
    Speed: Number(def.speed) || 1,
    Hp: Number(def.hp) || 1,
    Atk: Number(def.atk) || 777,
    Type: "attack",
    Mark: def.mark,
    Color: def.color,
    "*": "",
    Desc: `${def.name} 공격 기물`,
  }));

  const orePieceLevelRows = orePieceDefs.map((def) => ({
    PieceID: def.pieceId,
    PieceName: def.name,
    MatchType: Number(def.matchType) || 0,
    Attribute: normalizePieceAttribute(def.attribute),
    PieceDesc: def.desc || "원석 기물 (매치 시 박치기)",
    PieceGrade: 1,
    PieceLv: 1,
    ConnectTower: 0,
    Portrait: def.image,
    PieceSprite: def.image,
    MatchAttack: Number(def.matchAttack) || 1,
    Speed: Number(def.speed) || 1,
    Hp: Number(def.hp) || 1,
    Atk: Number(def.atk) || 500,
    Type: "ore",
    Mark: def.mark,
    Color: def.color,
    "*": "",
    Desc: `${def.name} 원석 기물`,
  }));

  const specialClickPieceLevelRows = specialClickPieceDefs.map((def) => ({
    PieceID: def.pieceId,
    PieceName: def.name,
    MatchType: Number(def.matchType) || 0,
    Attribute: normalizePieceAttribute(def.attribute),
    PieceDesc: `${def.name} (매치 사이클마다 1개 중 랜덤, 클릭 시 제거)`,
    PieceGrade: 1,
    PieceLv: 1,
    ConnectTower: 0,
    Portrait: def.image,
    PieceSprite: def.image,
    MatchAttack: Number(def.matchAttack) || 0,
    Speed: Number(def.speed) || 1,
    Hp: Number(def.hp) || 1,
    Atk: Number(def.atk) || 0,
    Type: "special",
    Mark: def.mark,
    Color: def.color,
    SpecialEffect: def.specialEffect || "none",
    EffectValue: Number(def.effectValue) || 0,
    "*": "",
    Desc: `${def.name} · 클릭 제거`,
  }));

  function buildAttackPieces() {
    // PieceData(Type=attack)에서 생성. 여기 함수는 누락 시 폴백용.
    return Object.fromEntries(
      attackPieceDefs.map((def) => [
        def.key,
        {
          key: def.key,
          type: "attack",
          pieceKind: "attack",
          sortOnly: true,
          noTower: true,
          star: 1,
          level: 1,
          name: def.name,
          mark: def.mark,
          color: def.color,
          image: def.image || "",
          portrait: def.image || "",
          owned: false,
          matchAttack: Number(def.matchAttack) || 1,
          speed: Number(def.speed) || 1,
          hp: Number(def.hp) || 1,
          atk: Number(def.atk) || 777,
          matchType: Number(def.matchType) || 0,
          attribute: normalizePieceAttribute(def.attribute),
          ramStyle: def.ramStyle || "chain",
          splashRadius: Number(def.splashRadius) || 0,
          splashDamageRatio: Number(def.splashDamageRatio) || 0,
          attackSlowDuration: Number(def.attackSlowDuration) || 0,
          knockback: Number(def.knockback) || 0,
          description: def.desc || "공격 기물 (포탑 없음, 매치 시 박치기)",
          source: "attackPieces",
          design: {
            pieceId: def.pieceId,
            matchType: Number(def.matchType) || 0,
            attribute: normalizePieceAttribute(def.attribute),
            type: "attack",
            matchAttack: Number(def.matchAttack) || 1,
            speed: Number(def.speed) || 1,
            hp: Number(def.hp) || 1,
            atk: Number(def.atk) || 777,
            ramStyle: def.ramStyle || "chain",
            splashRadius: Number(def.splashRadius) || 0,
            splashDamageRatio: Number(def.splashDamageRatio) || 0,
            attackSlowDuration: Number(def.attackSlowDuration) || 0,
            knockback: Number(def.knockback) || 0,
          },
        },
      ]),
    );
  }

  function buildOrePieces() {
    // PieceData(Type=ore)에서 생성. 여기 함수는 누락 시 폴백용.
    return Object.fromEntries(
      orePieceDefs.map((def) => [
        def.key,
        {
          key: def.key,
          type: "ore",
          pieceKind: "ore",
          sortOnly: true,
          noTower: true,
          star: 1,
          level: 1,
          name: def.name,
          mark: def.mark,
          color: def.color,
          image: def.image || "",
          portrait: def.image || "",
          owned: false,
          matchAttack: Number(def.matchAttack) || 1,
          speed: Number(def.speed) || 1,
          hp: Number(def.hp) || 1,
          atk: Number(def.atk) || 500,
          matchType: Number(def.matchType) || 0,
          attribute: normalizePieceAttribute(def.attribute),
          ramStyle: def.ramStyle || "single",
          splashRadius: 0,
          splashDamageRatio: 0,
          attackSlowDuration: 0,
          knockback: 0,
          description: def.desc || "원석 기물 (매치 시 박치기)",
          source: "orePieces",
          design: {
            pieceId: def.pieceId,
            matchType: Number(def.matchType) || 0,
            attribute: normalizePieceAttribute(def.attribute),
            type: "ore",
            matchAttack: Number(def.matchAttack) || 1,
            speed: Number(def.speed) || 1,
            hp: Number(def.hp) || 1,
            atk: Number(def.atk) || 500,
            ramStyle: def.ramStyle || "single",
          },
        },
      ]),
    );
  }

  function buildSpecialClickPieces() {
    return Object.fromEntries(
      specialClickPieceDefs.map((def) => [
        def.key,
        {
          key: def.key,
          type: "special",
          pieceKind: "special",
          sortOnly: true,
          noTower: true,
          clickToClear: true,
          persistOnMatch: true,
          specialEffect: def.specialEffect || "none",
          effectValue: Number(def.effectValue) || 0,
          star: 1,
          level: 1,
          name: def.name,
          mark: def.mark,
          color: def.color,
          image: def.image || "",
          portrait: def.image || "",
          owned: false,
          matchAttack: Number(def.matchAttack) || 0,
          speed: Number(def.speed) || 1,
          hp: Number(def.hp) || 1,
          atk: Number(def.atk) || 0,
          matchType: Number(def.matchType) || 0,
          attribute: normalizePieceAttribute(def.attribute),
          description: `${def.name} (매치 사이클마다 1개 중 랜덤, 클릭 시 제거)`,
          source: "specialClickPieces",
          design: {
            pieceId: def.pieceId,
            matchType: Number(def.matchType) || 0,
            attribute: normalizePieceAttribute(def.attribute),
            type: "special",
            matchAttack: Number(def.matchAttack) || 0,
            speed: Number(def.speed) || 1,
            hp: Number(def.hp) || 1,
            atk: Number(def.atk) || 0,
            specialEffect: def.specialEffect || "none",
            effectValue: Number(def.effectValue) || 0,
          },
        },
      ]),
    );
  }

  const shop = {
    pieceUnlocks: [
      // Grade 1 — contest: half price
      { pieceKey: "cactus_1", cost: { gold: 20 }, sortOrder: 10 },
      { pieceKey: "owl_1", cost: { gold: 25 }, sortOrder: 11 },
      { pieceKey: "robot_1", cost: { gold: 32 }, sortOrder: 12 },
      { pieceKey: "knight_1", cost: { gold: 40 }, sortOrder: 13 },
      // Grade 2
      { pieceKey: "slime_1", cost: { gold: 57 }, sortOrder: 20 },
      { pieceKey: "gorilla_1", cost: { gold: 65 }, sortOrder: 21 },
      { pieceKey: "cowboy_1", cost: { gold: 72 }, sortOrder: 22 },
      { pieceKey: "ghost_1", cost: { gold: 80 }, sortOrder: 23 },
      // Grade 3
      { pieceKey: "wizard_1", cost: { gold: 112 }, sortOrder: 30 },
      { pieceKey: "dragon_1", cost: { gold: 122 }, sortOrder: 31 },
      { pieceKey: "shark_1", cost: { gold: 132 }, sortOrder: 32 },
      { pieceKey: "tiger_1", cost: { gold: 142 }, sortOrder: 33 },
    ],
    fallbackUnlockCost: { gold: 62 },
  };

  // 스테이지 테이블: 배열 순서가 메인화면 스테이지 화살표 순서입니다.
  const stages = [
    {
      key: "stage-1",
      title: "Stone Altar",
      subtitle: "Authorized Personnel Only",
      description: "Defend the center 4x3 sorting slots through endless combat.",
      firstWave: 1,
      waveIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      bossIds: ["final_boss_1"],
      loadoutKey: "default",
      clearReward: {
        gold: 1220,
      },
      config: {
        totalWaves: 10,
        waveDuration: 32,
      },
      ui: {
        mainImage: "assets/images/ui/Main/Image_Stage_1 5.png",
        clearImage: "assets/images/ui/Main/Clear Stage.png",
      },
    },
    {
      key: "stage-2",
      title: "2 스테이지",
      subtitle: "Safe Zone Collapse",
      description: "1스테이지보다 많은 물량과 빠른 압박을 상정한 임시 2스테이지입니다.",
      firstWave: 1,
      waveIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      bossIds: ["final_boss_1"],
      loadoutKey: "default",
      clearReward: {
        gold: 1600,
      },
      config: {
        totalWaves: 10,
        waveDuration: 40,
        monsterHp: 28,
        monsterDamage: 1.1,
        monsterSpeed: 38,
        enemyCap: 10,
      },
      ui: {
        mainImage: "assets/images/ui/Main/Image_Stage_1 5.png",
        clearImage: "assets/images/ui/Main/Clear Stage.png",
      },
    },
    {
      key: "stage-test-dummy",
      title: "테스트 스테이지",
      subtitle: "Target Dummy Range",
      description: "이동과 공격을 하지 않는 허수아비가 계속 등장하는 포탑/특전/탄약 테스트용 스테이지입니다.",
      testStage: true,
      testMode: "targetDummy",
      firstWave: 101,
      waveIds: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
      bossIds: [],
      loadoutKey: "default",
      clearReward: {
        gold: 0,
      },
      config: {
        totalWaves: 10,
        waveDuration: 40,
        enemyCap: 10,
      },
      ui: {
        mainImage: "assets/images/ui/Main/Image_Stage_1 5.png",
        clearImage: "assets/images/ui/Main/Clear Stage.png",
      },
    },
  ];

  const levelData = {
    stageStartLevel: 1,
    stageMaxLevel: 20,
    xpBase: 20,
    xpLevelGrowth: 12,
    pendingPerkOnly: false,
    comboWindow: 3.5,
    comboWindowMin: 2.5,
    comboWindowScaleAtCombo: 10,
    comboAlertWindow: 0.7,
    comboFeverEnabled: true,
  };

  // MatchType: 0=none, 1=up laser, 2=cross laser, 3=horizontal laser, 4=vertical laser,
  // 5=cross laser, 6=explosion, 7=heal, 8=freeze arrow, 9=thunder, 10=scatter shot.
  // Currently wired: all MatchTypes 1–10 (exhibition character assignment).
  // Phase C: ConnectTower unused — characters fight via MatchType / PieceData only.
  // Attribute draft mapping:
  // Flame=Dragon/Tiger/Gorilla, Water=Shark/Slime/Ghost, Bolt=Wizard/Robot/Cowboy, Leaf=Cactus/Owl/Knight.
  const dataTablePieceFamilies = [
    { group: "ghost", pieceStart: 8031, grade: 2, name: "Ghost", desc: "Ghost character", image: "assets/images/ui/PIECE/Character_1.png", matchAttack: 42, speed: 280, hp: 140, atk: 165, matchType: 3, attribute: 2, mark: "G", color: "#c9b6ff" },
    { group: "wizard", pieceStart: 8036, grade: 3, name: "Wizard", desc: "Wizard character", image: "assets/images/ui/PIECE/Character_2.png", matchAttack: 55, speed: 310, hp: 120, atk: 155, matchType: 9, attribute: 3, mark: "W", color: "#7ec8ff" },
    { group: "shark", pieceStart: 8041, grade: 3, name: "Shark", desc: "Shark character", image: "assets/images/ui/PIECE/Character_3.png", matchAttack: 28, speed: 250, hp: 160, atk: 130, matchType: 8, attribute: 2, mark: "S", color: "#5eb0c9" },
    { group: "dragon", pieceStart: 8046, grade: 3, name: "Dragon", desc: "Dragon character", image: "assets/images/ui/PIECE/Character_4.png", matchAttack: 48, speed: 290, hp: 150, atk: 175, matchType: 5, attribute: 1, mark: "D", color: "#ff7a6e" },
    { group: "cowboy", pieceStart: 8051, grade: 2, name: "Cowboy", desc: "Cowboy character", image: "assets/images/ui/PIECE/Character_5.png", matchAttack: 40, speed: 300, hp: 135, atk: 160, matchType: 4, attribute: 3, mark: "C", color: "#d4a574" },
    { group: "cactus", pieceStart: 8056, grade: 1, name: "Cactus", desc: "Cactus character", image: "assets/images/ui/PIECE/Character_6.png", matchAttack: 35, speed: 270, hp: 145, atk: 150, matchType: 10, attribute: 4, mark: "A", color: "#6fbf73" },
    { group: "owl", pieceStart: 8061, grade: 1, name: "Owl", desc: "Owl character", image: "assets/images/ui/PIECE/Character_7.png", matchAttack: 45, speed: 320, hp: 125, atk: 140, matchType: 5, attribute: 4, mark: "O", color: "#b08968" },
    { group: "robot", pieceStart: 8066, grade: 1, name: "Robot", desc: "Robot character", image: "assets/images/ui/PIECE/Character_8.png", matchAttack: 38, speed: 240, hp: 170, atk: 145, matchType: 2, attribute: 3, mark: "R", color: "#9aa4b2" },
    { group: "gorilla", pieceStart: 8071, grade: 2, name: "Gorilla", desc: "Gorilla character", image: "assets/images/ui/PIECE/Character_9.png", matchAttack: 50, speed: 220, hp: 190, atk: 185, matchType: 6, attribute: 1, mark: "U", color: "#8d6e63" },
    { group: "knight", pieceStart: 8076, grade: 1, name: "Knight", desc: "Knight character", image: "assets/images/ui/PIECE/Character_10.png", matchAttack: 36, speed: 230, hp: 180, atk: 155, matchType: 2, attribute: 4, mark: "K", color: "#90a4ae" },
    { group: "tiger", pieceStart: 8081, grade: 3, name: "Tiger", desc: "Tiger character", image: "assets/images/ui/PIECE/Character_11.png", matchAttack: 44, speed: 340, hp: 130, atk: 170, matchType: 1, attribute: 1, mark: "T", color: "#ffb74d" },
    { group: "slime", pieceStart: 8086, grade: 2, name: "Slime", desc: "Slime character", image: "assets/images/ui/PIECE/Character_12.png", matchAttack: 25, speed: 260, hp: 200, atk: 100, matchType: 7, attribute: 2, mark: "L", color: "#81c784" },
  ];

  // PieceData 원본형 행 데이터
  // - PieceID: Character_* 계열 8031~8090.
  // - MatchType: 0=none, 1=up laser, 2=cross laser, 3=horizontal laser, 4=vertical laser,
  //   5=cross laser, 6=explosion, 7=heal, 8=freeze arrow, 9=thunder, 10=scatter shot.
  // - Attribute: 0=None, 1=Flame, 2=Water, 3=Bolt, 4=Leaf (default None).
  // - ConnectTower: Phase C — unused (0). Match combat uses PieceData + ProjectileData.
  // - MatchAttack / Speed / Hp / Atk: 매치 공격용 추가 스탯.
  // - Type: character | attack (기물 구분). 런타임 combat type(matchAttack/attack)과 별개.
  const pieceLevelRows = dataTablePieceFamilies.flatMap((family) =>
    Array.from({ length: 5 }, (_, index) => ({
      PieceID: family.pieceStart + index,
      PieceName: `PieceName_${family.group}_1`,
      MatchType: Number(family.matchType) || 0,
      Attribute: normalizePieceAttribute(family.attribute),
      PieceDesc: family.desc,
      PieceGrade: Math.max(1, Math.floor(Number(family.grade) || 1)),
      PieceLv: 1,
      ConnectTower: 0,
      Portrait: family.image,
      PieceSprite: family.image,
      MatchAttack: Number(family.matchAttack) || 1,
      Speed: Number(family.speed) || 1,
      Hp: Number(family.hp) || 1,
      Atk: Number(family.atk) || 777,
      Type: "character",
      Mark: family.mark || "",
      Color: family.color || "",
      "*": "",
      Desc: `${family.name} Lv1`,
    })),
  );

  const defaultOwnedPieceIds = new Set(
    dataTablePieceFamilies
      .filter((family) => Math.max(1, Math.floor(Number(family.grade) || 1)) === 1)
      .map((family) => family.pieceStart),
  );

  // PieceUpgradeData 원본형 행 데이터
  // - UpgradeID: 강화 규칙 고유 ID.
  // - PieceGroupID: 같은 계열 기물을 묶는 그룹 키. 로비 표시/교체 처리 기준이 된다.
  // - FromPieceID -> ToPieceID: 강화 전/후 기물 ID 연결.
  // - Desc: 편집자 메모.
  const pieceUpgradeRows = dataTablePieceFamilies.flatMap((family, familyIndex) =>
    Array.from({ length: 4 }, (_, index) => ({
      UpgradeID: 880000 + familyIndex * 10 + index + 1,
      PieceGroupID: family.group,
      FromPieceID: family.pieceStart + index,
      ToPieceID: family.pieceStart + index + 1,
      "*": "",
      Desc: `${family.name} Lv${index + 1} -> Lv${index + 2}`,
    })),
  );

  // UpgradeCostData 원본형 행 데이터
  // - UpgradeCostID: 강화 비용 행 고유 ID.
  // - UpgradeID: PieceUpgradeData.UpgradeID 참조.
  // - CurrencyType: 현재는 gold만 사용한다.
  // - UpgradeCost: 해당 1회 강화에 필요한 비용.
  const dataTableUpgradeCostByFromLevel = [100, 200, 300, 400];
  const pieceUpgradeCostRows = pieceUpgradeRows.map((upgradeRow, index) => ({
    UpgradeCostID: 881001 + index,
    UpgradeID: upgradeRow.UpgradeID,
    CurrencyType: "gold",
    UpgradeCost: dataTableUpgradeCostByFromLevel[index % dataTableUpgradeCostByFromLevel.length],
    "*": "",
    Desc: `${upgradeRow.Desc} 비용`,
  }));

  const generatedPieceRuntimeKeyMap = {
    8031: "ghost_1", 8032: "ghost_2", 8033: "ghost_3", 8034: "ghost_4", 8035: "ghost_5",
    8036: "wizard_1", 8037: "wizard_2", 8038: "wizard_3", 8039: "wizard_4", 8040: "wizard_5",
    8041: "shark_1", 8042: "shark_2", 8043: "shark_3", 8044: "shark_4", 8045: "shark_5",
    8046: "dragon_1", 8047: "dragon_2", 8048: "dragon_3", 8049: "dragon_4", 8050: "dragon_5",
    8051: "cowboy_1", 8052: "cowboy_2", 8053: "cowboy_3", 8054: "cowboy_4", 8055: "cowboy_5",
    8056: "cactus_1", 8057: "cactus_2", 8058: "cactus_3", 8059: "cactus_4", 8060: "cactus_5",
    8061: "owl_1", 8062: "owl_2", 8063: "owl_3", 8064: "owl_4", 8065: "owl_5",
    8066: "robot_1", 8067: "robot_2", 8068: "robot_3", 8069: "robot_4", 8070: "robot_5",
    8071: "gorilla_1", 8072: "gorilla_2", 8073: "gorilla_3", 8074: "gorilla_4", 8075: "gorilla_5",
    8076: "knight_1", 8077: "knight_2", 8078: "knight_3", 8079: "knight_4", 8080: "knight_5",
    8081: "tiger_1", 8082: "tiger_2", 8083: "tiger_3", 8084: "tiger_4", 8085: "tiger_5",
    8086: "slime_1", 8087: "slime_2", 8088: "slime_3", 8089: "slime_4", 8090: "slime_5",
    8101: "Attack_Arrow", 8102: "Attack_Bomb", 8103: "Attack_Stone", 8104: "Attack_Axe",
    8201: "Special_Mana", 8202: "Special_Heal", 8203: "Special_Atk",
    8301: "Ore_Fire", 8302: "Ore_Water", 8303: "Ore_Leaf", 8304: "Ore_Volt",
  };

  const designTableSchema = {
    source: "종합 데이터 테이블_김시온_v0.1",
    conventions: {
      tableCase: "PascalCase",
      idRule: "ID 컬럼은 정수 행 참조, Key 컬럼은 문자열/리소스/로컬라이즈 참조",
      ignoredColumns: ["*", "Desc", "Description", "몬스터 총합"],
    },
    tables: {
      StageData: {
        pk: "StageID",
        runtimeTable: "stages",
        columns: ["StageID", "StageName", "WaveDataID", "MonsterGroupID_Normal", "MonsterGroupID_Speedy", "MonsterGroupID_Tanker", "BossID", "WaveReward", "StageReward", "BGID", "WaveDuration", "*", "Desc"],
      },
      WaveData: {
        pk: "WaveID",
        runtimeTable: "waves",
        columns: ["WaveID", "WavePattern_1", "WavePattern_2", "WavePattern_3", "WavePattern_4", "WavePattern_5", "WavePattern_6", "WavePattern_7", "WavePattern_8", "WavePattern_9", "*", "Desc"],
      },
      WavePatternData: {
        pk: "WavePatternID",
        runtimeTable: "wavePatterns",
        columns: ["WavePatternID", "WaveType", "Normal_Count", "Speedy_Count", "Tanker_Count", "*", "몬스터 총합", "Desc"],
      },
      MonsterGroupData: {
        pk: "MonsterGroupID",
        runtimeTable: "monsterGroups",
        columns: ["MonsterGroupID", "MonsterID_1", "MonsterID_2", "MonsterID_3", "*", "Desc"],
      },
      MonsterData: {
        pk: "MonsterID",
        runtimeTable: "monsters",
        columns: ["MonsterID", "MonsterName", "MonsterType", "ExpTypeID", "MonsterHp", "MonsterAtk", "MonsterAtkSpeed", "MonsterAtkRange", "MonsterMoveSpeed", "MonsterSprite", "MonsterProjectileID", "*", "Desc"],
      },
      BossData: {
        pk: "BossID",
        runtimeTable: "bosses",
        columns: ["BossID", "BossName", "MonsterID", "SummonMonsterGroupID", "SummonInterval", "SummonCount", "SpawnXRatio", "SpawnYRatio", "*", "Desc"],
      },
      MonsterProjectileData: {
        pk: "MonsterProjectileID",
        runtimeTable: "monsterProjectiles",
        columns: ["MonsterProjectileID", "ProjectileName", "ProjectilePrefab", "ProjectileSpeed", "ProjectileSize", "ProjectileLife", "*", "Desc"],
      },
      PieceData: {
        pk: "PieceID",
        runtimeTable: "pieces",
        columns: ["PieceID", "PieceName", "MatchType", "Attribute", "PieceDesc", "PieceGrade", "PieceLv", "ConnectTower", "Portrait", "PieceSprite", "MatchAttack", "Speed", "Hp", "Atk", "Type", "Mark", "Color", "*", "Desc"],
      },
      AttributeData: {
        pk: "AttributeID",
        runtimeTable: "attributes",
        columns: ["AttributeID", "AttributeKey", "AttributeName", "AttributeRole", "*", "Desc"],
      },
      PieceUpgradeData: {
        pk: "UpgradeID",
        runtimeTable: "pieces.*.upgrade",
        columns: ["UpgradeID", "PieceGroupID", "FromPieceID", "ToPieceID", "*", "Desc"],
      },
      UpgradeCostData: {
        pk: "UpgradeCostID",
        runtimeTable: "pieces.*.upgradeCost",
        columns: ["UpgradeCostID", "UpgradeID", "CurrencyType", "UpgradeCost", "*", "Desc"],
      },
      ProjectileData: {
        pk: "ProjectileID",
        runtimeTable: "projectiles",
        columns: ["ProjectileID", "ProjectileType", "ProjectileName", "ProjectilePrefab", "*", "Desc"],
      },
      LevelData: {
        pk: "LevelID",
        runtimeTable: "levelData",
        columns: ["LevelID", "GoalLevel", "RequiredXP", "IsMaxLevel", "*", "Description", "PerkEventType"],
      },
      ExpData: {
        pk: "ExpTypeID",
        runtimeTable: "monsters.*.xp",
        columns: ["ExpTypeID", "ExpAmount", "BlockSpriteKey", "*", "Description"],
      },
      Resource: {
        pk: "ResourceID",
        runtimeTable: "shop/progression/defaultPlayerSave.currency",
        columns: ["ResourceID", "Root", "ResourceKey", "Desc"],
      },
      LocalizeData: {
        pk: "Key",
        runtimeTable: "localizeData",
        columns: ["Key", "Id", "Shared Comments", "English(en)", "English(en) Comments", "Korean(ko)", "Korean(ko) Comments"],
      },
    },
  };

  const designRuntimeKeyMap = {
    StageData: { 1001: "stage-1", 1002: "stage-2", 1901: "stage-test-dummy" },
    WaveData: { 2001: "stage-1", 2002: "stage-2", 2901: "stage-test-dummy" },
    WavePatternData: {
      3001: 1,
      3002: 2,
      3003: 3,
      3004: 4,
      3005: 5,
      3006: 6,
      3007: 7,
      3008: 8,
      3009: 9,
      3901: 101,
      3902: 102,
      3903: 103,
      3904: 104,
      3905: 105,
      3906: 106,
      3907: 107,
      3908: 108,
      3909: 109,
    },
    MonsterData: { 4111: "basic", 4121: "speed", 4131: "tank", 4141: "ranged", 4151: "centerCat", 4152: "centerEgg", 4153: "centerDevil", 4191: "finalBoss", 4991: "dummy" },
    MonsterProjectileData: { 7101: "7101", 7102: "7102", 7103: "7103", 7104: "7104", 7105: "7105" },
    BossData: { 9001: "final_boss_1" },
    PieceData: generatedPieceRuntimeKeyMap,
    ProjectileData: { 6001: "proj_basic_homing", 6002: "proj_sniper_pierce", 6003: "proj_tank_breaker", 6004: "proj_blast_explode", 6005: "proj_support_heal" },
  };

  const designTables = {
    schemaVersion: "2026-06-19-data-table-balance",

    // ============================================================
    // StageData - 스테이지 선택, 보상, 배경, 웨이브 묶음 연결
    // ============================================================
    StageData: [
      { StageID: 1001, StageName: "StageName_1", WaveDataID: 2001, MonsterGroupID_Normal: 11011, MonsterGroupID_Speedy: 11012, MonsterGroupID_Tanker: 11013, BossID: 9001, WaveReward: 5, StageReward: 1220, BGID: "assets/images/ui/Main/Image_Stage_1 5.png", WaveDuration: 32, Desc: "Stage 1 Authorized Personnel Only" },
      { StageID: 1002, StageName: "StageName_2", WaveDataID: 2002, MonsterGroupID_Normal: 11021, MonsterGroupID_Speedy: 11022, MonsterGroupID_Tanker: 11023, BossID: 9001, WaveReward: 5, StageReward: 1600, BGID: "assets/images/ui/Main/Image_Stage_1 5.png", Desc: "2 스테이지 임시 데이터" },
      { StageID: 1901, StageName: "StageName_TestDummy", WaveDataID: 2901, MonsterGroupID_Normal: 11901, MonsterGroupID_Speedy: 11901, MonsterGroupID_Tanker: 11901, BossID: 0, WaveReward: 0, StageReward: 0, BGID: "assets/images/ui/Main/Image_Stage_1 5.png", Desc: "허수아비 타격 테스트 스테이지" },
    ],

    // ============================================================
    // WaveData - 스테이지가 사용할 1~9웨이브 패턴 묶음. 10웨이브는 StageData.BossID로 보스 고정.
    // ============================================================
    WaveData: [
      { WaveID: 2001, WavePattern_1: 3001, WavePattern_2: 3002, WavePattern_3: 3003, WavePattern_4: 3004, WavePattern_5: 3005, WavePattern_6: 3006, WavePattern_7: 3007, WavePattern_8: 3008, WavePattern_9: 3009, Desc: "1스테이지 1~9웨이브 패턴" },
      { WaveID: 2002, WavePattern_1: 3001, WavePattern_2: 3002, WavePattern_3: 3003, WavePattern_4: 3004, WavePattern_5: 3005, WavePattern_6: 3006, WavePattern_7: 3007, WavePattern_8: 3008, WavePattern_9: 3009, Desc: "2스테이지 임시 재사용 패턴" },
      { WaveID: 2901, WavePattern_1: 3901, WavePattern_2: 3902, WavePattern_3: 3903, WavePattern_4: 3904, WavePattern_5: 3905, WavePattern_6: 3906, WavePattern_7: 3907, WavePattern_8: 3908, WavePattern_9: 3909, Desc: "허수아비 테스트 패턴" },
    ],

    // ============================================================
    // WavePatternData - 웨이브 타입과 몬스터 타입별 등장 수량
    // ============================================================
    WavePatternData: [
      { WavePatternID: 3001, WaveType: "Normal", Normal_Count: 38, Speedy_Count: 6, Tanker_Count: 0, "몬스터 총합": 44, Desc: "입문 물량" },
      { WavePatternID: 3002, WaveType: "Normal", Normal_Count: 44, Speedy_Count: 16, Tanker_Count: 0, "몬스터 총합": 60, Desc: "공중형 적응" },
      { WavePatternID: 3003, WaveType: "Normal", Normal_Count: 54, Speedy_Count: 14, Tanker_Count: 8, "몬스터 총합": 76, Desc: "탱커 첫 압박" },
      { WavePatternID: 3004, WaveType: "Rush", Normal_Count: 72, Speedy_Count: 28, Tanker_Count: 8, "몬스터 총합": 108, Desc: "러시" },
      { WavePatternID: 3005, WaveType: "Normal", Normal_Count: 70, Speedy_Count: 24, Tanker_Count: 12, "몬스터 총합": 106, Desc: "혼합 압박" },
      { WavePatternID: 3006, WaveType: "Normal", Normal_Count: 78, Speedy_Count: 30, Tanker_Count: 16, "몬스터 총합": 124, Desc: "엘리트 진입" },
      { WavePatternID: 3007, WaveType: "Normal", Normal_Count: 84, Speedy_Count: 36, Tanker_Count: 20, "몬스터 총합": 140, Desc: "속도 압박" },
      { WavePatternID: 3008, WaveType: "Rush", Normal_Count: 98, Speedy_Count: 44, Tanker_Count: 24, "몬스터 총합": 166, Desc: "대형 러시" },
      { WavePatternID: 3009, WaveType: "Normal", Normal_Count: 100, Speedy_Count: 48, Tanker_Count: 30, "몬스터 총합": 178, Desc: "최종 전 압박" },
      { WavePatternID: 3901, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 1" },
      { WavePatternID: 3902, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 2" },
      { WavePatternID: 3903, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 3" },
      { WavePatternID: 3904, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 4" },
      { WavePatternID: 3905, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 5" },
      { WavePatternID: 3906, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 6" },
      { WavePatternID: 3907, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 7" },
      { WavePatternID: 3908, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 8" },
      { WavePatternID: 3909, WaveType: "Test", Normal_Count: 18, Speedy_Count: 0, Tanker_Count: 0, "몬스터 총합": 18, Desc: "허수아비 테스트 9" },
    ],

    // ============================================================
    // MonsterGroupData - 웨이브가 뽑아 쓸 몬스터 후보군
    // ============================================================
    MonsterGroupData: [
      { MonsterGroupID: 11011, MonsterID_1: 4111, MonsterID_2: 4121, MonsterID_3: 0, Desc: "1스테이지 일반 후보군" },
      { MonsterGroupID: 11012, MonsterID_1: 4121, MonsterID_2: 4111, MonsterID_3: 0, Desc: "1스테이지 속도 후보군" },
      { MonsterGroupID: 11013, MonsterID_1: 4131, MonsterID_2: 4111, MonsterID_3: 0, Desc: "1스테이지 탱커 후보군" },
      { MonsterGroupID: 11021, MonsterID_1: 4111, MonsterID_2: 4121, MonsterID_3: 0, Desc: "2스테이지 일반 후보군" },
      { MonsterGroupID: 11022, MonsterID_1: 4121, MonsterID_2: 4111, MonsterID_3: 0, Desc: "2스테이지 속도 후보군" },
      { MonsterGroupID: 11023, MonsterID_1: 4131, MonsterID_2: 4121, MonsterID_3: 0, Desc: "2스테이지 탱커 후보군" },
      { MonsterGroupID: 11901, MonsterID_1: 4991, MonsterID_2: 0, MonsterID_3: 0, Desc: "허수아비 후보군" },
      { MonsterGroupID: 19001, MonsterID_1: 4121, MonsterID_2: 4111, MonsterID_3: 0, Desc: "보스 소환 후보군" },
    ],

    // ============================================================
    // MonsterData - 일반/속도/탱커/원거리/보스/허수아비 스탯
    // ============================================================
    MonsterData: [
      // 체력: 평균 박치기 기준.
      // 일반 몬스터 MonsterAtkSpeed = 사거리 안에서의 매치 공격 주기(정수). 클수록 느림.
      // 보스 MonsterAtkSpeed는 레거시(초)로 남기되, 실제 게이트는 matchMelee/RangedInterval 사용.
      { MonsterID: 4111, MonsterName: "Wall", MonsterType: 1, ExpTypeID: 81, MonsterHp: 300, MonsterAtk: 2, MonsterAtkSpeed: 1, MonsterAtkRange: 64, MonsterMoveSpeed: 34, MonsterSprite: "assets/images/monsters/wall.png", MonsterProjectileID: 0, Desc: "Wall · attack every 1 match in range" },
      { MonsterID: 4121, MonsterName: "Air", MonsterType: 2, ExpTypeID: 82, MonsterHp: 210, MonsterAtk: 4, MonsterAtkSpeed: 2, MonsterAtkRange: 150, MonsterMoveSpeed: 61, MonsterSprite: "assets/images/monsters/air.png", MonsterProjectileID: 7101, Desc: "Air · attack every 2 matches in range" },
      { MonsterID: 4131, MonsterName: "Ground", MonsterType: 3, ExpTypeID: 82, MonsterHp: 900, MonsterAtk: 6, MonsterAtkSpeed: 3, MonsterAtkRange: 60, MonsterMoveSpeed: 19, MonsterSprite: "assets/images/monsters/ground.png", MonsterProjectileID: 7102, Desc: "Ground · attack every 3 matches in range" },
      { MonsterID: 4141, MonsterName: "Monster_Ranged_01", MonsterType: 4, ExpTypeID: 82, MonsterHp: 240, MonsterAtk: 1, MonsterAtkSpeed: 3, MonsterAtkRange: 126, MonsterMoveSpeed: 27, MonsterSprite: "monster_ranged_1", MonsterProjectileID: 7103, Desc: "Ranged · inactive reserve" },
      { MonsterID: 4151, MonsterName: "Cat", MonsterType: 5, ExpTypeID: 82, MonsterHp: 2000, MonsterAtk: 20, MonsterAtkSpeed: 5, MonsterAtkRange: 150, MonsterMoveSpeed: 61, MonsterSprite: "assets/images/monsters/center_cat.png", MonsterProjectileID: 7101, Desc: "Center Cat · match 5 / timed 55s / burst 120" },
      { MonsterID: 4152, MonsterName: "Egg", MonsterType: 5, ExpTypeID: 82, MonsterHp: 4000, MonsterAtk: 10, MonsterAtkSpeed: 6, MonsterAtkRange: 150, MonsterMoveSpeed: 61, MonsterSprite: "assets/images/monsters/center_egg.png", MonsterProjectileID: 7101, Desc: "Center Egg · match 6 / timed 80s / burst 200" },
      { MonsterID: 4153, MonsterName: "Devil", MonsterType: 5, ExpTypeID: 82, MonsterHp: 3000, MonsterAtk: 10, MonsterAtkSpeed: 3, MonsterAtkRange: 150, MonsterMoveSpeed: 61, MonsterSprite: "assets/images/monsters/center_devil.png", MonsterProjectileID: 7101, Desc: "Center Devil · match 3 / timed 45s / burst 120" },
      { MonsterID: 4191, MonsterName: "Monster_FinalBoss_01", MonsterType: 9, ExpTypeID: 83, MonsterHp: 20000, MonsterAtk: 10, MonsterAtkSpeed: 1.2, MonsterAtkRange: 110, MonsterMoveSpeed: 21, MonsterSprite: "assets/images/monsters/boss.png", MonsterProjectileID: 7104, Desc: "Final boss · match-turn melee 2 / ranged 4" },
      { MonsterID: 4991, MonsterName: "Monster_TestDummy_01", MonsterType: 99, ExpTypeID: 84, MonsterHp: 1200, MonsterAtk: 0, MonsterAtkSpeed: 0, MonsterAtkRange: 0, MonsterMoveSpeed: 0, MonsterSprite: "monster_test_dummy_1", MonsterProjectileID: 0, Desc: "Target dummy · measurement" },
    ],

    // ============================================================
    // MonsterProjectileData - 몬스터 원거리탄 (이미지/속도/크기)
    // ============================================================
    MonsterProjectileData: [
      { MonsterProjectileID: 7101, ProjectileName: "공중형 탄", ProjectilePrefab: "assets/images/Projectile/101.png", ProjectileSpeed: 260, ProjectileSize: 14, ProjectileLife: 2.2, Desc: "공중형 기본 투사체" },
      { MonsterProjectileID: 7102, ProjectileName: "지상형 탄", ProjectilePrefab: "assets/images/Projectile/101.png", ProjectileSpeed: 180, ProjectileSize: 18, ProjectileLife: 2.4, Desc: "지상형 기본 투사체" },
      { MonsterProjectileID: 7103, ProjectileName: "원거리형 탄", ProjectilePrefab: "assets/images/Projectile/101.png", ProjectileSpeed: 240, ProjectileSize: 12, ProjectileLife: 2.6, Desc: "원거리형 예비 투사체" },
      { MonsterProjectileID: 7104, ProjectileName: "보스 갈래탄", ProjectilePrefab: "assets/images/Projectile/02.png", ProjectileSpeed: 250, ProjectileSize: 16, ProjectileLife: 2.6, Desc: "최종보스 원거리 갈래 투사체" },
      { MonsterProjectileID: 7105, ProjectileName: "보스 실패탄", ProjectilePrefab: "assets/images/Projectile/boss_projectile.png", ProjectileSpeed: 340, ProjectileSize: 24, ProjectileLife: 3.2, Desc: "구슬 파괴 실패 페널티 투사체" },
    ],

    // ============================================================
    // BossData - 10웨이브 보스와 소환 몬스터 그룹
    // ============================================================
    BossData: [
      { BossID: 9001, BossName: "BossName_FinalBoss_01", MonsterID: 4191, SummonMonsterGroupID: 19001, SummonInterval: 9, SummonCount: 8, SpawnXRatio: 0.5, SpawnYRatio: 0.11, Desc: "최종보스" },
    ],

    // ============================================================
    // AttributeData - 기물 속성 정의 (무속성 포함 5종)
    // AttributeID: 0=None, 1=Flame, 2=Water, 3=Bolt, 4=Leaf
    // ============================================================
    AttributeData: [
      { AttributeID: 0, AttributeKey: "none", AttributeName: "None", AttributeRole: "기본", "*": "", Desc: "무속성 · 기본 형태" },
      { AttributeID: 1, AttributeKey: "flame", AttributeName: "Flame", AttributeRole: "화력/폭발", "*": "", Desc: "불 속성" },
      { AttributeID: 2, AttributeKey: "water", AttributeName: "Water", AttributeRole: "제어/지속", "*": "", Desc: "물 속성" },
      { AttributeID: 3, AttributeKey: "bolt", AttributeName: "Bolt", AttributeRole: "관통/연쇄", "*": "", Desc: "전(전기) 속성" },
      { AttributeID: 4, AttributeKey: "leaf", AttributeName: "Leaf", AttributeRole: "산탄/지원", "*": "", Desc: "풀 속성" },
    ],

    // ============================================================
    // PieceData - 로비/소팅에 등장하는 기물과 연결 타워
    // 핵심 컬럼:
    // PieceID = 기물 ID, Attribute = AttributeData.AttributeID (기본 0=무속성),
    // PieceLv = 표시 레벨, ConnectTower = 레거시 미사용(0)
    // ============================================================
    PieceData: [...pieceLevelRows, ...attackPieceLevelRows, ...orePieceLevelRows, ...specialClickPieceLevelRows],

    // ============================================================
    // PieceUpgradeData - 기물 강화 시 보유 PieceID를 다음 PieceID로 교체
    // 핵심 컬럼:
    // FromPieceID -> ToPieceID = 강화 연결, PieceGroupID = 같은 계열 묶음
    // ============================================================
    PieceUpgradeData: pieceUpgradeRows,

    // ============================================================
    // UpgradeCostData - 강화 비용. PieceUpgradeData.UpgradeID와 1:1로 연결
    // 핵심 컬럼:
    // UpgradeID = 강화 규칙 참조, CurrencyType/UpgradeCost = 차감 재화와 비용
    // ============================================================
    UpgradeCostData: pieceUpgradeCostRows,

    // ============================================================
    // ProjectileData - 매치 샷/연출용 발사체 타입과 프리팹 키
    // ============================================================
    ProjectileData: [
      { ProjectileID: 6001, ProjectileType: "Basic", ProjectileName: "노말", ProjectilePrefab: "assets/images/Projectile/01.png", "*": "", Desc: "매치 산탄/공용 01 투사체" },
      { ProjectileID: 6002, ProjectileType: "Snipe", ProjectileName: "저격", ProjectilePrefab: "assets/images/Projectile/13.png", "*": "", Desc: "예비 13 투사체" },
      { ProjectileID: 6003, ProjectileType: "Tank", ProjectileName: "탱커", ProjectilePrefab: "assets/images/Projectile/02.png", "*": "", Desc: "예비 02 투사체" },
      { ProjectileID: 6004, ProjectileType: "Explode", ProjectileName: "폭발", ProjectilePrefab: "assets/images/Projectile/14.png", "*": "", Desc: "예비 14 투사체" },
      { ProjectileID: 6005, ProjectileType: "Heal", ProjectileName: "힐링", ProjectilePrefab: "assets/images/Projectile/08.png", "*": "", Desc: "예비 08 투사체" },
    ],

    // ============================================================
    // LevelData - 레벨별 누적 경험치 (Phase F: 특전 이벤트 미사용)
    // ============================================================
    LevelData: [
      { LevelID: 101, GoalLevel: 1, RequiredXP: 0, IsMaxLevel: 0, Description: "시작 레벨", PerkEventType: "None" },
      { LevelID: 102, GoalLevel: 2, RequiredXP: 45, IsMaxLevel: 0, Description: "레벨 2", PerkEventType: "None" },
      { LevelID: 103, GoalLevel: 3, RequiredXP: 100, IsMaxLevel: 0, Description: "레벨 3", PerkEventType: "None" },
      { LevelID: 104, GoalLevel: 4, RequiredXP: 165, IsMaxLevel: 0, Description: "레벨 4", PerkEventType: "None" },
      { LevelID: 105, GoalLevel: 5, RequiredXP: 250, IsMaxLevel: 0, Description: "레벨 5", PerkEventType: "None" },
      { LevelID: 120, GoalLevel: 20, RequiredXP: 5000, IsMaxLevel: 1, Description: "임시 최대 레벨", PerkEventType: "None" },
    ],

    // ============================================================
    // ExpData - MonsterData.ExpTypeID별 경험치 드랍
    // ============================================================
    ExpData: [
      { ExpTypeID: 81, ExpAmount: 1, BlockSpriteKey: "exp_green", Description: "일반몹 경험치" },
      { ExpTypeID: 82, ExpAmount: 1, BlockSpriteKey: "exp_blue", Description: "엘리트/특수몹 경험치" },
      { ExpTypeID: 83, ExpAmount: 1, BlockSpriteKey: "exp_purple", Description: "보스 경험치" },
      { ExpTypeID: 84, ExpAmount: 1, BlockSpriteKey: "exp_green", Description: "허수아비 경험치" },
    ],

    // ============================================================
    // Resource - 재화/리소스 키 연결
    // ============================================================
    Resource: [
      { ResourceID: 11001, Root: "currency.gold", ResourceKey: "gold", Desc: "Coins" },
    ],

    // ============================================================
    // LocalizeData - 화면 표시 이름/설명 현지화
    // ============================================================
    LocalizeData: [
      { Key: "StageName_1", Id: 100001, "Shared Comments": "", "English(en)": "Stone Altar", "English(en) Comments": "", "Korean(ko)": "암석 재단", "Korean(ko) Comments": "" },
      { Key: "StageName_2", Id: 100002, "Shared Comments": "", "English(en)": "Stage 2", "English(en) Comments": "", "Korean(ko)": "2 스테이지", "Korean(ko) Comments": "" },
      { Key: "StageName_TestDummy", Id: 100003, "Shared Comments": "", "English(en)": "Target Dummy Stage", "English(en) Comments": "", "Korean(ko)": "허수아비 스테이지", "Korean(ko) Comments": "" },
      { Key: "PieceName_ghost_1", Id: 101001, "Shared Comments": "", "English(en)": "Ghost", "English(en) Comments": "", "Korean(ko)": "유령", "Korean(ko) Comments": "" },
      { Key: "PieceName_wizard_1", Id: 101002, "Shared Comments": "", "English(en)": "Wizard", "English(en) Comments": "", "Korean(ko)": "마법사", "Korean(ko) Comments": "" },
      { Key: "PieceName_shark_1", Id: 101003, "Shared Comments": "", "English(en)": "Shark", "English(en) Comments": "", "Korean(ko)": "상어", "Korean(ko) Comments": "" },
      { Key: "PieceName_dragon_1", Id: 101004, "Shared Comments": "", "English(en)": "Dragon", "English(en) Comments": "", "Korean(ko)": "드래곤", "Korean(ko) Comments": "" },
      { Key: "PieceName_cowboy_1", Id: 101005, "Shared Comments": "", "English(en)": "Cowboy", "English(en) Comments": "", "Korean(ko)": "카우보이", "Korean(ko) Comments": "" },
      { Key: "PieceName_cactus_1", Id: 101006, "Shared Comments": "", "English(en)": "Cactus", "English(en) Comments": "", "Korean(ko)": "선인장", "Korean(ko) Comments": "" },
      { Key: "PieceName_owl_1", Id: 101007, "Shared Comments": "", "English(en)": "Owl", "English(en) Comments": "", "Korean(ko)": "부엉이", "Korean(ko) Comments": "" },
      { Key: "PieceName_robot_1", Id: 101008, "Shared Comments": "", "English(en)": "Robot", "English(en) Comments": "", "Korean(ko)": "로보트", "Korean(ko) Comments": "" },
      { Key: "PieceName_gorilla_1", Id: 101009, "Shared Comments": "", "English(en)": "Gorilla", "English(en) Comments": "", "Korean(ko)": "고릴라", "Korean(ko) Comments": "" },
      { Key: "PieceName_knight_1", Id: 101010, "Shared Comments": "", "English(en)": "Knight", "English(en) Comments": "", "Korean(ko)": "기사", "Korean(ko) Comments": "" },
      { Key: "PieceName_tiger_1", Id: 101011, "Shared Comments": "", "English(en)": "Tiger", "English(en) Comments": "", "Korean(ko)": "호랑이", "Korean(ko) Comments": "" },
      { Key: "PieceName_slime_1", Id: 101012, "Shared Comments": "", "English(en)": "Slime", "English(en) Comments": "", "Korean(ko)": "슬라임", "Korean(ko) Comments": "" },
      { Key: "PieceName_ranger_1", Id: 101013, "Shared Comments": "", "English(en)": "Inactive Ranger", "English(en) Comments": "", "Korean(ko)": "비활성 레인저", "Korean(ko) Comments": "" },
    ],
  };
  designTables.ResourceData = designTables.Resource;

  function fillDesignTableSchemaColumns() {
    Object.entries(designTableSchema.tables || {}).forEach(([tableName, tableSchema]) => {
      const rows = designTables[tableName];
      if (!Array.isArray(rows)) return;
      rows.forEach((row) => {
        (tableSchema.columns || []).forEach((column) => {
          if (!(column in row)) row[column] = "";
        });
      });
    });
  }
  fillDesignTableSchemaColumns();

  function indexDesignRows(tableName, primaryKey) {
    return new Map((designTables[tableName] || []).map((row) => [String(row[primaryKey]), row]));
  }

  function getCurrentLanguage() {
    const lang = String(window.CURRENT_LANGUAGE || "ko").toLowerCase();
    return lang === "en" ? "en" : "ko";
  }

  function setCurrentLanguage(lang) {
    window.CURRENT_LANGUAGE = String(lang).toLowerCase() === "en" ? "en" : "ko";
    return window.CURRENT_LANGUAGE;
  }

  function localizeDesignKey(key, fallback = "") {
    if (!key || key === "None") return fallback;
    const rawKey = String(key);
    const row = (designTables.LocalizeData || []).find((item) => item.Key === key);
    if (row) {
      const en = row["English(en)"] || row.English || "";
      const ko = row["Korean(ko)"] || row.Korean || "";
      if (getCurrentLanguage() === "en") return en || ko || fallback || rawKey;
      return ko || en || fallback || rawKey;
    }
    const looksLikeLocalizeKey = /^[A-Za-z][A-Za-z0-9]*(Name|Desc|Text|Label|Title|Subtitle|Description)_/.test(rawKey);
    return looksLikeLocalizeKey ? fallback || rawKey : rawKey || fallback;
  }

  function splitDesignCount(total, bucketCount) {
    const count = Math.max(0, Math.floor(Number(total) || 0));
    const buckets = Array.from({ length: Math.max(1, bucketCount) }, () => 0);
    for (let index = 0; index < count; index += 1) buckets[index % buckets.length] += 1;
    return buckets;
  }

  function getDesignRuntimeKey(tableName, rowId, prefix, fallback = "") {
    if (rowId === undefined || rowId === null || rowId === "" || rowId === "None") return fallback;
    const mapped = designRuntimeKeyMap[tableName]?.[rowId] || designRuntimeKeyMap[tableName]?.[String(rowId)];
    return mapped || `${prefix}_${rowId}`;
  }

  function getDesignRuntimeMonsterKey(monsterId) {
    return getDesignRuntimeKey("MonsterData", monsterId, "monster");
  }

  function getDesignRuntimeBossKey(bossId) {
    if (!bossId || bossId === "None" || String(bossId) === "0") return "";
    return getDesignRuntimeKey("BossData", bossId, "boss");
  }

  function getDesignRuntimePieceKey(pieceId) {
    return getDesignRuntimeKey("PieceData", pieceId, "piece");
  }

  function getDesignRuntimeProjectileKey(projectileId) {
    return getDesignRuntimeKey("ProjectileData", projectileId, "proj");
  }

  function getDesignRuntimeMonsterGroupKey(groupId) {
    return getDesignRuntimeKey("MonsterGroupData", groupId, "mg_design");
  }

  function designMonsterTypeToRuntime(monsterType) {
    const text = String(monsterType || "").trim().toLowerCase();
    const map = {
      "1": "basic",
      normal: "basic",
      basic: "basic",
      "2": "speed",
      speedy: "speed",
      speed: "speed",
      "3": "tank",
      tanker: "tank",
      tank: "tank",
      "4": "ranged",
      range: "ranged",
      ranged: "ranged",
      "5": "center",
      center: "center",
      "9": "boss",
      boss: "boss",
      finalboss: "boss",
      "99": "dummy",
      dummy: "dummy",
      test: "dummy",
    };
    return map[text] || "basic";
  }

  function distributeDesignMonsterTypes(total, groupId) {
    const count = Math.max(0, Math.floor(Number(total) || 0));
    const group = indexDesignRows("MonsterGroupData", "MonsterGroupID").get(String(groupId));
    const monsterKeys = [group?.MonsterID_1, group?.MonsterID_2, group?.MonsterID_3]
      .map((monsterId) => (Number(monsterId) ? getDesignRuntimeMonsterKey(monsterId) : ""))
      .filter(Boolean);
    if (!count || !monsterKeys.length) return {};
    const weights = monsterKeys.map((_, index) => (index === 0 ? 6 : index === 1 ? 3 : 1));
    const weightTotal = weights.reduce((sum, value) => sum + value, 0);
    const result = {};
    let assigned = 0;
    monsterKeys.forEach((monsterKey, index) => {
      const value = index === monsterKeys.length - 1
        ? count - assigned
        : Math.floor((count * weights[index]) / weightTotal);
      if (value > 0) result[monsterKey] = (result[monsterKey] || 0) + value;
      assigned += Math.max(0, value);
    });
    if (!Object.keys(result).length) result[monsterKeys[0]] = count;
    return result;
  }

  function mergeMonsterCounts(...countObjects) {
    return countObjects.reduce((merged, counts) => {
      Object.entries(counts || {}).forEach(([monsterKey, count]) => {
        merged[monsterKey] = (merged[monsterKey] || 0) + Math.max(0, Math.floor(Number(count) || 0));
      });
      return merged;
    }, {});
  }

  function getDesignRuntimeStageKey(stageId, fallbackIndex) {
    return getDesignRuntimeKey("StageData", stageId, "stage", `stage-${fallbackIndex + 1}`);
  }

  function getDesignRuntimeWaveId(stageKey, stageIndex, waveOrdinal) {
    if (stageKey === "stage-1") return waveOrdinal;
    if (stageKey === "stage-test-dummy") return 100 + waveOrdinal;
    return (stageIndex + 1) * 100 + waveOrdinal;
  }

  function getDesignPatternId(stageKey, stageId, waveOrdinal, waveType) {
    if (waveType === "boss") return null;
    if (stageKey === "stage-1") return `wp_w${waveOrdinal}`;
    if (stageKey === "stage-test-dummy") return `wp_test_dummy_w${waveOrdinal}`;
    return `wp_stage_${stageId}_w${waveOrdinal}`;
  }

  function designWaveTypeToRuntime(waveType) {
    const type = String(waveType || "Normal").toLowerCase();
    if (type === "boss") return "boss";
    if (type === "rush") return "rush";
    if (type === "test") return "test";
    return "normal";
  }

  function designPieceTypeToRuntime(pieceType) {
    const type = String(pieceType || "").toLowerCase();
    if (type === "attack") return "attack";
    if (type === "matchattack") return "matchAttack";
    // Character piece/tower roles all resolve to matchAttack.
    const map = {
      1: "matchAttack",
      ar: "matchAttack",
      basic: "matchAttack",
      matchattack: "matchAttack",
      2: "matchAttack",
      scatter: "matchAttack",
      shotgun: "matchAttack",
      ranger: "matchAttack",
      3: "matchAttack",
      lange: "matchAttack",
      range: "matchAttack",
      ranged: "matchAttack",
      sniper: "matchAttack",
      4: "matchAttack",
      breaker: "matchAttack",
      tank: "matchAttack",
      tanker: "matchAttack",
      5: "matchAttack",
      blast: "matchAttack",
      area: "matchAttack",
      wide: "matchAttack",
      explode: "matchAttack",
      6: "matchAttack",
      support: "matchAttack",
      buffer: "matchAttack",
      heal: "matchAttack",
    };
    return map[type] || "matchAttack";
  }

  function designTargetPriorityToRuntime(targetPriority) {
    const type = String(targetPriority || "").toLowerCase().replace(/[\s_-]/g, "");
    const map = {
      nearest: "near",
      near: "near",
      farthest: "far",
      far: "far",
      highesthp: "strong",
      highhp: "strong",
      strong: "strong",
      lowesthp: "weak",
      lowhp: "weak",
      weak: "weak",
      lowallyhp: "friendly",
      ally: "friendly",
      friendly: "friendly",
      support: "friendly",
      cluster: "cluster",
    };
    return map[type] || "near";
  }

  function designProjectileTypeToRuntime(projectileType) {
    const type = String(projectileType || "").toLowerCase().replace(/[\s_-]/g, "");
    const map = {
      normal: "normal",
      basic: "normal",
      basicnonhoming: "normal",
      shotgun: "normal",
      scatter: "normal",
      pierce: "pierce",
      piercing: "pierce",
      snipe: "pierce",
      sniper: "pierce",
      tank: "tank",
      breaker: "tank",
      explode: "explode",
      blast: "explode",
      heal: "heal",
      support: "heal",
    };
    return map[type] || "normal";
  }

  function getProjectileFillDefaults(projectileType, aiType) {
    if (projectileType === "normal") {
      if (aiType === "shotgun") return { ...projectileFillDefaultsByType.shotgun };
      if (aiType === "basic-non") return { ...projectileFillDefaultsByType.basicNonHoming };
      return { ...projectileFillDefaultsByType.basic };
    }
    if (projectileType === "pierce") return { ...projectileFillDefaultsByType.snipe, homing: false };
    const effectDefaults = projectileFillDefaultsByType[projectileType] || projectileFillDefaultsByType.basic;
    const result = { ...effectDefaults };
    if (aiType === "basic-non") {
      result.homing = false;
      result.sequentialStored = false;
      result.burstInterval = 0;
    } else if (aiType === "shotgun") {
      result.homing = false;
      result.fanStep = projectileFillDefaultsByType.shotgun.fanStep;
      result.life = Math.min(result.life || 1, projectileFillDefaultsByType.shotgun.life);
    } else if (aiType === "basic" || aiType === "heal") {
      result.homing = result.homing !== false;
    }
    return result;
  }

  const projectileFillDefaultsByType = {
    basic: {
      homing: true,
      sequentialStored: false,
      overdriveInterval: 0.024,
      spreadJitter: 0,
      speedMult: 1,
      damageRatio: 1,
      radius: 5,
      life: 1.3,
      fanStep: 0.035,
      pierce: false,
      pierceHits: 0,
      splashRadius: 0,
      splashDamageRatio: 0,
      percentHpDamage: 0,
      knockback: 0,
    },
    shotgun: {
      homing: false,
      sequentialStored: false,
      overdriveInterval: 0.018,
      spreadJitter: 0,
      speedMult: 0.78,
      damageRatio: 1,
      radius: 4.5,
      life: 3.2,
      fanStep: 0.16,
      pierce: false,
      pierceHits: 0,
      splashRadius: 0,
      splashDamageRatio: 0,
      percentHpDamage: 0,
      knockback: 0,
    },
    basicNonHoming: {
      homing: false,
      sequentialStored: true,
      overdriveInterval: 0.024,
      spreadJitter: 0.018,
      speedMult: 1.22,
      damageRatio: 1,
      radius: 4.8,
      life: 1.65,
      burstInterval: 0.07,
      fanStep: 0.012,
      pierce: false,
      pierceHits: 0,
      splashRadius: 0,
      splashDamageRatio: 0,
      percentHpDamage: 0,
      knockback: 0,
    },
    snipe: {
      homing: false,
      sequentialStored: false,
      overdriveInterval: 0.045,
      spreadJitter: 0,
      speedMult: 1.6,
      damageRatio: 1,
      radius: 6.2,
      life: 1.9,
      fanStep: 0.035,
      pierce: true,
      pierceHits: 2,
      splashRadius: 0,
      splashDamageRatio: 0,
      percentHpDamage: 0,
      knockback: 0,
    },
    tank: {
      homing: true,
      sequentialStored: false,
      overdriveInterval: 0.024,
      spreadJitter: 0,
      speedMult: 1,
      damageRatio: 1,
      radius: 5.4,
      life: 1.35,
      fanStep: 0.035,
      pierce: false,
      pierceHits: 0,
      splashRadius: 0,
      splashDamageRatio: 0,
      percentHpDamage: 0.035,
      knockback: 0,
    },
    explode: {
      homing: true,
      sequentialStored: false,
      overdriveInterval: 0.024,
      spreadJitter: 0,
      speedMult: 0.82,
      damageRatio: 1,
      radius: 7,
      life: 1.35,
      fanStep: 0.035,
      pierce: false,
      pierceHits: 0,
      splashRadius: 52,
      splashDamageRatio: 0.72,
      percentHpDamage: 0,
      knockback: 0,
    },
    heal: {
      homing: true,
      sequentialStored: false,
      overdriveInterval: 0.024,
      spreadJitter: 0,
      speedMult: 1,
      damageRatio: 1,
      radius: 5,
      life: 1.3,
      fanStep: 0.035,
      pierce: false,
      pierceHits: 0,
      splashRadius: 0,
      splashDamageRatio: 0,
      percentHpDamage: 0,
      knockback: 0,
    },
  };

  const DESIGN_PROJECTILE_SIZE_UNIT_PX = 20;

  function normalizeDesignProjectileSize(value, fallback = 0) {
    const raw = Number(value);
    if (!Number.isFinite(raw) || raw <= 0) return fallback;
    return raw <= 2 ? raw * DESIGN_PROJECTILE_SIZE_UNIT_PX : raw;
  }

  // Phase E: builds projectiles + pieces only. TowerData / runtime.towers removed.
  function buildDesignPieceTowerRuntimeTables() {
    const runtime = {
      projectiles: {},
      pieces: {},
      pieceDefinitions: [],
    };

    (designTables.ProjectileData || []).forEach((projectileRow) => {
      const projectileKey = getDesignRuntimeProjectileKey(projectileRow.ProjectileID);
      if (!projectileKey) return;
      const projectileType = designProjectileTypeToRuntime(projectileRow.ProjectileType);
      const aiType = "shotgun";
      const fillDefaults = getProjectileFillDefaults(projectileType, aiType);
      const radius = normalizeDesignProjectileSize(0, fillDefaults.radius);
      runtime.projectiles[projectileKey] = {
        ...fillDefaults,
        id: projectileKey,
        type: projectileType,
        projectileType,
        aiType,
        name: localizeDesignKey(projectileRow.ProjectileName, projectileRow.ProjectileName || projectileKey),
        radius,
        pierce: fillDefaults.pierce === true,
        pierceHits: Number(fillDefaults.pierceHits || 0),
        splashRadius: Number(fillDefaults.splashRadius || 0),
        prefab: projectileRow.ProjectilePrefab || projectileKey,
        source: "designTables",
        design: {
          projectileId: projectileRow.ProjectileID,
          projectileType: projectileRow.ProjectileType,
          projectileEffectType: projectileType,
          aiType,
          fillSource: "ProjectileTypeDefaults",
        },
      };
    });

    (designTables.PieceData || []).forEach((pieceRow) => {
      const pieceKey = getDesignRuntimePieceKey(pieceRow.PieceID);
      if (!pieceKey) return;
      const sheetType = String(pieceRow.Type || "character").toLowerCase();
      const pieceKind = sheetType === "attack"
        ? "attack"
        : sheetType === "ore"
          ? "ore"
          : sheetType === "special"
            ? "special"
            : "character";

      if (pieceKind === "special") {
        runtime.pieces[pieceKey] = {
          key: pieceKey,
          type: "special",
          pieceKind: "special",
          sortOnly: true,
          noTower: true,
          clickToClear: true,
          persistOnMatch: true,
          specialEffect: String(pieceRow.SpecialEffect || "none"),
          effectValue: Math.max(0, Number(pieceRow.EffectValue) || 0),
          star: Math.max(1, Math.floor(Number(pieceRow.PieceGrade) || 1)),
          level: Math.max(1, Math.floor(Number(pieceRow.PieceLv) || 1)),
          name: localizeDesignKey(pieceRow.PieceName, pieceRow.PieceName || pieceKey),
          mark: pieceRow.Mark || "특",
          color: pieceRow.Color || "#5ec8ff",
          connectTower: null,
          image: pieceRow.PieceSprite || pieceRow.Portrait || "",
          portrait: pieceRow.Portrait || pieceRow.PieceSprite || "",
          owned: false,
          description: localizeDesignKey(pieceRow.PieceDesc, pieceRow.PieceDesc || ""),
          matchAttack: Math.max(0, Number(pieceRow.MatchAttack) || 0),
          speed: Math.max(0, Number(pieceRow.Speed) || 1),
          hp: Math.max(0, Number(pieceRow.Hp) || 1),
          atk: Math.max(0, Number(pieceRow.Atk) || 0),
          matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
          attribute: normalizePieceAttribute(pieceRow.Attribute),
          source: "designTables",
          design: {
            pieceId: pieceRow.PieceID,
            matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
            attribute: normalizePieceAttribute(pieceRow.Attribute),
            pieceLevel: Number(pieceRow.PieceLv) || 1,
            connectTower: pieceRow.ConnectTower || 0,
            matchAttack: Number(pieceRow.MatchAttack) || 0,
            speed: Number(pieceRow.Speed) || 1,
            hp: Number(pieceRow.Hp) || 1,
            atk: Number(pieceRow.Atk) || 0,
            type: "special",
            specialEffect: String(pieceRow.SpecialEffect || "none"),
            effectValue: Math.max(0, Number(pieceRow.EffectValue) || 0),
          },
        };
        return;
      }

      if (pieceKind === "ore") {
        const oreDef = orePieceDefs.find((def) => Number(def.pieceId) === Number(pieceRow.PieceID)) || null;
        runtime.pieces[pieceKey] = {
          key: pieceKey,
          type: "ore",
          pieceKind: "ore",
          sortOnly: true,
          noTower: true,
          star: Math.max(1, Math.floor(Number(pieceRow.PieceGrade) || 1)),
          level: Math.max(1, Math.floor(Number(pieceRow.PieceLv) || 1)),
          name: localizeDesignKey(pieceRow.PieceName, pieceRow.PieceName || pieceKey),
          mark: pieceRow.Mark || "Ore",
          color: pieceRow.Color || "#c9b6ff",
          connectTower: null,
          image: pieceRow.PieceSprite || pieceRow.Portrait || "",
          portrait: pieceRow.Portrait || pieceRow.PieceSprite || "",
          owned: false,
          description: localizeDesignKey(pieceRow.PieceDesc, pieceRow.PieceDesc || oreDef?.desc || ""),
          matchAttack: Math.max(0, Number(pieceRow.MatchAttack) || 1),
          speed: Math.max(0, Number(pieceRow.Speed) || 1),
          hp: Math.max(0, Number(pieceRow.Hp) || 1),
          atk: Math.max(0, Number(pieceRow.Atk) || 500),
          matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
          attribute: normalizePieceAttribute(pieceRow.Attribute),
          ramStyle: oreDef?.ramStyle || "single",
          splashRadius: 0,
          splashDamageRatio: 0,
          attackSlowDuration: 0,
          knockback: 0,
          source: "designTables",
          design: {
            pieceId: pieceRow.PieceID,
            matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
            attribute: normalizePieceAttribute(pieceRow.Attribute),
            pieceLevel: Number(pieceRow.PieceLv) || 1,
            connectTower: pieceRow.ConnectTower || 0,
            matchAttack: Number(pieceRow.MatchAttack) || 1,
            speed: Number(pieceRow.Speed) || 1,
            hp: Number(pieceRow.Hp) || 1,
            atk: Number(pieceRow.Atk) || 500,
            type: "ore",
            ramStyle: oreDef?.ramStyle || "single",
          },
        };
        return;
      }

      if (pieceKind === "attack") {
        const attackDef = attackPieceDefs.find((def) => Number(def.pieceId) === Number(pieceRow.PieceID)) || null;
        runtime.pieces[pieceKey] = {
          key: pieceKey,
          type: "attack",
          pieceKind: "attack",
          sortOnly: true,
          noTower: true,
          star: Math.max(1, Math.floor(Number(pieceRow.PieceGrade) || 1)),
          level: Math.max(1, Math.floor(Number(pieceRow.PieceLv) || 1)),
          name: localizeDesignKey(pieceRow.PieceName, pieceRow.PieceName || pieceKey),
          mark: pieceRow.Mark || "공",
          color: pieceRow.Color || "#9aa4b2",
          connectTower: null,
          image: pieceRow.PieceSprite || pieceRow.Portrait || "",
          portrait: pieceRow.Portrait || pieceRow.PieceSprite || "",
          owned: false,
          description: localizeDesignKey(pieceRow.PieceDesc, pieceRow.PieceDesc || attackDef?.desc || ""),
          matchAttack: Math.max(0, Number(pieceRow.MatchAttack) || 1),
          speed: Math.max(0, Number(pieceRow.Speed) || 1),
          hp: Math.max(0, Number(pieceRow.Hp) || 1),
          atk: Math.max(0, Number(pieceRow.Atk) || 777),
          matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
          attribute: normalizePieceAttribute(pieceRow.Attribute),
          ramStyle: attackDef?.ramStyle || "chain",
          splashRadius: Number(attackDef?.splashRadius) || 0,
          splashDamageRatio: Number(attackDef?.splashDamageRatio) || 0,
          attackSlowDuration: Number(attackDef?.attackSlowDuration) || 0,
          knockback: Number(attackDef?.knockback) || 0,
          source: "designTables",
          design: {
            pieceId: pieceRow.PieceID,
            matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
            attribute: normalizePieceAttribute(pieceRow.Attribute),
            pieceLevel: Number(pieceRow.PieceLv) || 1,
            connectTower: pieceRow.ConnectTower || 0,
            matchAttack: Number(pieceRow.MatchAttack) || 1,
            speed: Number(pieceRow.Speed) || 1,
            hp: Number(pieceRow.Hp) || 1,
            atk: Number(pieceRow.Atk) || 777,
            type: "attack",
            ramStyle: attackDef?.ramStyle || "chain",
            splashRadius: Number(attackDef?.splashRadius) || 0,
            splashDamageRatio: Number(attackDef?.splashDamageRatio) || 0,
            attackSlowDuration: Number(attackDef?.attackSlowDuration) || 0,
            knockback: Number(attackDef?.knockback) || 0,
          },
        };
        return;
      }

      // Phase E: characters always fight via MatchType / PieceData (no ConnectTower runtime).
      // Do not set sortOnly here — that flag suppresses match volleys (attack/special only).
      const runtimeType = "matchAttack";
      const baseType = towerTypes[runtimeType] || {};
      const name = localizeDesignKey(pieceRow.PieceName, baseType.name || pieceRow.PieceName || pieceKey);
      runtime.pieces[pieceKey] = {
        key: pieceKey,
        type: runtimeType,
        pieceKind: "character",
        noTower: true,
        star: Math.max(1, Math.floor(Number(pieceRow.PieceGrade) || 1)),
        level: Math.max(1, Math.floor(Number(pieceRow.PieceLv) || 1)),
        name,
        mark: pieceRow.Mark || `${baseType.mark || ""}${Math.max(1, Math.floor(Number(pieceRow.PieceGrade) || 1))}`,
        color: pieceRow.Color || baseType.color || "#9aa4b2",
        connectTower: null,
        image: pieceRow.PieceSprite || pieceRow.Portrait || baseType.image || "",
        portrait: pieceRow.Portrait || pieceRow.PieceSprite || "",
        owned: defaultOwnedPieceIds.has(Number(pieceRow.PieceID)),
        description: localizeDesignKey(pieceRow.PieceDesc, baseType.description || pieceRow.PieceDesc || ""),
        matchAttack: Math.max(0, Number(pieceRow.MatchAttack) || 1),
        speed: Math.max(0, Number(pieceRow.Speed) || 1),
        hp: Math.max(0, Number(pieceRow.Hp) || 1),
        atk: Math.max(0, Number(pieceRow.Atk) || 777),
        matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
        attribute: normalizePieceAttribute(pieceRow.Attribute),
        source: "designTables",
        design: {
          pieceId: pieceRow.PieceID,
          matchType: Math.max(0, Math.floor(Number(pieceRow.MatchType) || 0)),
          attribute: normalizePieceAttribute(pieceRow.Attribute),
          pieceLevel: Number(pieceRow.PieceLv) || 1,
          connectTower: Number(pieceRow.ConnectTower) || 0,
          matchAttack: Number(pieceRow.MatchAttack) || 1,
          speed: Number(pieceRow.Speed) || 1,
          nameKey: pieceRow.PieceName || "",
          descKey: pieceRow.PieceDesc || "",
          hp: Number(pieceRow.Hp) || 1,
          atk: Number(pieceRow.Atk) || 777,
          type: "character",
        },
      };
      runtime.pieceDefinitions.push([pieceKey, runtimeType, runtime.pieces[pieceKey].star, name]);
    });

    const upgradeCostByUpgradeId = new Map((designTables.UpgradeCostData || []).map((costRow) => [String(costRow.UpgradeID), costRow]));
    (designTables.PieceUpgradeData || []).forEach((upgradeRow) => {
      const fromKey = getDesignRuntimePieceKey(upgradeRow.FromPieceID);
      const toKey = getDesignRuntimePieceKey(upgradeRow.ToPieceID);
      if (!fromKey || !toKey || !runtime.pieces[fromKey] || !runtime.pieces[toKey]) return;
      const costRow = upgradeCostByUpgradeId.get(String(upgradeRow.UpgradeID));
      const groupId = upgradeRow.PieceGroupID || runtime.pieces[fromKey].upgradeGroupId || fromKey;
      runtime.pieces[fromKey].upgradeGroupId = groupId;
      runtime.pieces[fromKey].nextPieceKey = toKey;
      runtime.pieces[fromKey].upgradeCost = Math.max(0, Math.floor(Number(costRow?.UpgradeCost) || 0));
      runtime.pieces[fromKey].upgradeCurrencyType = costRow?.CurrencyType || "gold";
      runtime.pieces[fromKey].upgradeId = upgradeRow.UpgradeID;
      runtime.pieces[fromKey].upgradeCostId = costRow?.UpgradeCostID || null;
      runtime.pieces[toKey].upgradeGroupId = groupId;
      runtime.pieces[toKey].prevPieceKey = fromKey;
      runtime.pieces[toKey].upgradeOnly = true;
    });

    return runtime;
  }

  function buildDesignLoadoutRuntimeTable(pieceTowerTables) {
    const maxSlots = Math.max(1, Math.floor(Number(loadout.maxSlots) || 4));
    const allPieceKeys = Object.keys(pieceTowerTables.pieces || {});
    const configuredSelectable = [...new Set((loadout.selectablePieceKeys || []).filter((pieceKey) => allPieceKeys.includes(pieceKey)))];
    const definitionKeys = [...new Set((pieceTowerTables.pieceDefinitions || []).map(([pieceKey]) => pieceKey).filter(Boolean))];
    // Curated lobby list wins when present, but still merge base character PieceData rows
    // so AUTO_ADD / new PieceData entries enter selectable + shop unlocks.
    const generatedBaseCharacterKeys = Object.values(pieceTowerTables.pieces || {})
      .filter((piece) => piece?.pieceKind === "character" && !piece.upgradeOnly && piece.key)
      .map((piece) => piece.key);
    const selectablePieceKeys = [...new Set([
      ...(configuredSelectable.length ? configuredSelectable : definitionKeys),
      ...generatedBaseCharacterKeys,
    ])];
    const ownedSelectableKeys = selectablePieceKeys.filter((pieceKey) => pieceTowerTables.pieces[pieceKey]?.owned === true);
    const legacyFallbackKeys = (loadout.fallbackPieceKeys || []).filter((pieceKey) => selectablePieceKeys.includes(pieceKey));
    const fallbackPieceKeys = [
      ...ownedSelectableKeys,
      ...legacyFallbackKeys.filter((pieceKey) => !ownedSelectableKeys.includes(pieceKey)),
      ...selectablePieceKeys.filter((pieceKey) => !ownedSelectableKeys.includes(pieceKey) && !legacyFallbackKeys.includes(pieceKey)),
    ].slice(0, maxSlots);
    const attackPieceKeys = [...new Set((loadout.attackPieceKeys || []).filter((pieceKey) => allPieceKeys.includes(pieceKey)))];
    const orePieceKeys = [...new Set((loadout.orePieceKeys || []).filter((pieceKey) => allPieceKeys.includes(pieceKey)))];
    const specialClickPieceKeys = [...new Set((loadout.specialClickPieceKeys || []).filter((pieceKey) => allPieceKeys.includes(pieceKey)))];

    return {
      ...loadout,
      maxSlots,
      characterSlots: maxSlots,
      defaultPieceKeys: (loadout.defaultPieceKeys || []).filter((pieceKey) => selectablePieceKeys.includes(pieceKey)),
      fallbackPieceKeys,
      selectablePieceKeys,
      attackPieceKeys,
      orePieceKeys,
      specialClickPieceKeys,
      source: "designTables",
    };
  }

  function buildDesignShopRuntimeTable(pieceTowerTables, runtimeLoadout) {
    const manualEntries = (shop.pieceUnlocks || []).filter((entry) => pieceTowerTables.pieces[entry.pieceKey]);
    const manualKeys = new Set(manualEntries.map((entry) => entry.pieceKey));
    const autoEntries = (runtimeLoadout.selectablePieceKeys || [])
      .filter((pieceKey) => !manualKeys.has(pieceKey) && pieceTowerTables.pieces[pieceKey]?.owned !== true && !pieceTowerTables.pieces[pieceKey]?.upgradeOnly)
      .map((pieceKey, index) => ({
        pieceKey,
        label: `${pieceTowerTables.pieces[pieceKey]?.name || pieceKey} 해금`,
        cost: { ...shop.fallbackUnlockCost },
        sortOrder: 100 + index,
        source: "designTables-auto",
      }));

    return {
      ...shop,
      pieceUnlocks: [...manualEntries, ...autoEntries],
      source: "designTables",
    };
  }

  function buildDesignBossRuntimeTables() {
    const runtimeBosses = Object.fromEntries(Object.entries(bosses).map(([key, value]) => [key, { ...value }]));
    const numberOr = (value, fallback = 0) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const monsterById = indexDesignRows("MonsterData", "MonsterID");
    const expAmountByExpType = Object.fromEntries(
      (designTables.ExpData || []).map((row) => [String(row.ExpTypeID), Math.max(0, Math.floor(Number(row.ExpAmount) || 0))])
    );
    const baseMonsterHp = 22;
    const bossFillDefaults = {
      kind: "final",
      meleeRange: 0,
      standOffRange: 110,
      radius: 41,
      taunt: 25,
      rangedDamageRatio: 0.15,
      rangedRateMult: 1.6,
      summonInterval: 8,
      summonRadiusMin: 34,
      summonRadiusMax: 74,
      summonSpreadX: 5,
      summonSpreadY: 5,
      warningRangedDelay: 0.75,
      warningMeleeDelay: 0.55,
    };

    for (const bossRow of designTables.BossData || []) {
      const bossKey = getDesignRuntimeBossKey(bossRow.BossID);
      if (!bossKey) continue;
      const baseMonsterRow = monsterById.get(String(bossRow.MonsterID));
      const bossKind = String(bossRow.BossName || bossRow.Desc || "").toLowerCase().includes("mid") ? "mid" : bossFillDefaults.kind;
      const monsterKey = getDesignRuntimeMonsterKey(bossRow.MonsterID) || "finalBoss";
      const bossExpTypeId = String(baseMonsterRow?.ExpTypeID || "");
      const bossXp = Math.max(0, Math.floor(Number(expAmountByExpType[bossExpTypeId] ?? 1)));
      const label = localizeDesignKey(bossRow.BossName, bossRow.Desc || bossKey);
      const summonCount = Math.max(0, Math.floor(numberOr(bossRow.SummonCount, 0)));
      const summonGroupId = Number(bossRow.SummonMonsterGroupID) || 0;
      const summonMonsters = summonGroupId && summonCount > 0 ? distributeDesignMonsterTypes(summonCount, summonGroupId) : {};
      const summon = Object.keys(summonMonsters).length > 0
        ? {
            monsterGroupId: getDesignRuntimeMonsterGroupKey(summonGroupId),
            monsterKey: Object.keys(summonMonsters)[0] || "",
            monsters: summonMonsters,
            interval: Math.max(0.1, numberOr(bossRow.SummonInterval, bossFillDefaults.summonInterval)),
            count: summonCount,
            radiusMin: bossFillDefaults.summonRadiusMin,
            radiusMax: bossFillDefaults.summonRadiusMax,
            spreadX: bossFillDefaults.summonSpreadX,
            spreadY: bossFillDefaults.summonSpreadY,
            banner: `${label} 소환`,
            log: `${label} 패턴: 몬스터 소환`,
            design: {
              summonMonsterGroupId: summonGroupId,
              sourceTable: "MonsterGroupData",
            },
          }
        : null;
      const monsterHp = numberOr(baseMonsterRow?.MonsterHp, baseMonsterHp);
      const monsterAtk = Math.max(0, numberOr(baseMonsterRow?.MonsterAtk, 0));
      const monsterAtkSpeed = Math.max(0.1, numberOr(baseMonsterRow?.MonsterAtkSpeed, 1.15));
      const monsterAtkRange = Math.max(0, numberOr(baseMonsterRow?.MonsterAtkRange, 0));
      const monsterMoveSpeed = Math.max(0, numberOr(baseMonsterRow?.MonsterMoveSpeed, 18));
      const prior = runtimeBosses[bossKey] || {};
      const priorConfigKeys = prior.configKeys && typeof prior.configKeys === "object" ? prior.configKeys : null;

      runtimeBosses[bossKey] = {
        id: bossKey,
        kind: bossKind,
        monsterKey,
        label,
        banner: `${label} 등장`,
        spawn: {
          xRatio: numberOr(bossRow.SpawnXRatio, 0.5),
          yRatio: numberOr(bossRow.SpawnYRatio, 0.11),
        },
        hpMult: Math.max(1, monsterHp / baseMonsterHp),
        meleeDamage: monsterAtk,
        rangedDamage: monsterAtkRange > 0
          ? Math.max(1, numberOr(prior.rangedDamage, Math.round(monsterAtk * bossFillDefaults.rangedDamageRatio)))
          : 0,
        speed: monsterMoveSpeed,
        attackRate: monsterAtkSpeed,
        rangedRate: monsterAtkRange > 0
          ? Math.max(0.1, numberOr(prior.rangedRate, monsterAtkSpeed * bossFillDefaults.rangedRateMult))
          : 0,
        matchMeleeInterval: Math.max(1, Math.floor(numberOr(prior.matchMeleeInterval, 2))),
        matchRangedInterval: Math.max(1, Math.floor(numberOr(prior.matchRangedInterval, 4))),
        attackRange: monsterAtkRange,
        standOffRange: numberOr(prior.standOffRange, bossFillDefaults.standOffRange),
        meleeRange: monsterAtkRange > 0 ? 0 : bossFillDefaults.meleeRange,
        radius: numberOr(prior.radius, bossFillDefaults.radius),
        taunt: numberOr(prior.taunt, bossFillDefaults.taunt),
        xp: bossXp,
        forkCount: Math.max(1, Math.floor(numberOr(prior.forkCount, 3))),
        forkSpreadDeg: Math.max(0, numberOr(prior.forkSpreadDeg, 72)),
        forkShotInterval: Math.max(0.05, numberOr(prior.forkShotInterval, 0.16)),
        orbEveryAttacks: Math.max(1, Math.floor(numberOr(prior.orbEveryAttacks, 5))),
        orbMaxHp: Math.max(1, numberOr(prior.orbMaxHp, 3750)),
        orbDurationSec: Math.max(1, numberOr(prior.orbDurationSec, 20)),
        orbFailDamage: Math.max(1, numberOr(prior.orbFailDamage, 400)),
        orbOffsetX: Math.max(20, numberOr(prior.orbOffsetX, 78)),
        orbRadius: Math.max(10, numberOr(prior.orbRadius, 30)),
        orbRamDamageMult: Math.max(0, numberOr(prior.orbRamDamageMult, 0.5)),
        orbMatchDamageMult: Math.max(0, numberOr(prior.orbMatchDamageMult, 2)),
        summon,
        warning: {
          rangedDelay: bossFillDefaults.warningRangedDelay,
          meleeDelay: bossFillDefaults.warningMeleeDelay,
        },
        configKeys: priorConfigKeys || {},
        patterns: [],
        source: "designTables",
        design: {
          bossId: bossRow.BossID,
          bossKind,
          monsterId: bossRow.MonsterID,
          expTypeId: bossExpTypeId,
          summonMonsterGroupId: bossRow.SummonMonsterGroupID,
          statSource: "MonsterData",
          fillSource: "BossDataDefaults",
        },
      };
    }

    return {
      bosses: runtimeBosses,
      source: "designTables",
    };
  }

  function buildDesignLevelExpRuntimeTables() {
    const levelRows = [...(designTables.LevelData || [])]
      .map((row) => ({
        levelId: row.LevelID,
        goalLevel: Math.max(1, Math.floor(Number(row.GoalLevel) || 1)),
        requiredXp: Math.max(0, Math.floor(Number(row.RequiredXP) || 0)),
        isMaxLevel: Number(row.IsMaxLevel) === 1,
        perkEventType: row.PerkEventType || "Normal",
        description: row.Description || "",
        source: "designTables",
      }))
      .sort((a, b) => a.goalLevel - b.goalLevel);

    const requiredXpByLevel = {};
    const xpCostByLevel = {};
    for (const row of levelRows) {
      requiredXpByLevel[row.goalLevel] = row.requiredXp;
    }
    for (let index = 0; index < levelRows.length - 1; index += 1) {
      const from = levelRows[index];
      const to = levelRows[index + 1];
      const levelGap = Math.max(1, to.goalLevel - from.goalLevel);
      const xpGap = Math.max(1, to.requiredXp - from.requiredXp);
      const perLevel = Math.max(1, Math.ceil(xpGap / levelGap));
      for (let level = from.goalLevel; level < to.goalLevel; level += 1) {
        xpCostByLevel[level] = perLevel;
      }
    }

    const maxLevelRow = levelRows.find((row) => row.isMaxLevel) || levelRows[levelRows.length - 1] || null;
    const stageMaxLevel = Math.max(1, Math.floor(Number(maxLevelRow?.goalLevel) || Number(levelData.stageMaxLevel) || 20));
    const firstPlayableRow = levelRows.find((row) => row.goalLevel > 1);
    const xpBase = Math.max(1, Number(xpCostByLevel[1] || firstPlayableRow?.requiredXp || levelData.xpBase || 20));
    const secondCost = Number(xpCostByLevel[2] || xpBase);
    const xpLevelGrowth = Math.max(0, secondCost - xpBase || Number(levelData.xpLevelGrowth) || 0);

    const expAmountByExpType = Object.fromEntries(
      (designTables.ExpData || []).map((row) => [String(row.ExpTypeID), Math.max(0, Math.floor(Number(row.ExpAmount) || 0))])
    );
    const expTypeToRuntimeKeys = {
      81: ["basic"],
      82: ["speed", "tank", "ranged", "centerCat", "centerEgg", "centerDevil"],
      83: ["midBoss", "finalBoss"],
      84: ["dummy"],
    };
    const runtimeMonsters = Object.fromEntries(Object.entries(monsters).map(([key, value]) => [key, { ...value }]));
    const numberOr = (value, fallback = 0) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const baseMonsterHp = 22;
    const baseMonsterDamage = 1;
    const baseMonsterSpeed = 34;
    const baseMonsterAttackRate = 1.35;
    const visualDefaultsByMonsterType = {
      basic: { mark: "M", color: "#d85d72", taunt: 1, pack: 1, radiusAdd: 0, weight: 0.44 },
      speed: { mark: "S", color: "#ffcf5a", taunt: 0.55, pack: 1, radiusAdd: -2, weight: 0.34 },
      tank: { mark: "T", color: "#b982ff", taunt: 7, pack: 1, radiusAdd: 5, weight: 0.12 },
      ranged: { mark: "R", color: "#69d7ff", taunt: 0.8, pack: 1, radiusAdd: 0, weight: 0.1 },
      center: { mark: "C", color: "#ff8f5a", taunt: 2, pack: 1, radiusAdd: 2, weight: 0 },
      boss: { mark: "B", color: "#ff4f6d", taunt: 25, pack: 1, radiusAdd: 0, weight: 0 },
      dummy: { mark: "D", color: "#9ee7ff", taunt: 12, pack: 1, radiusAdd: 7, weight: 0 },
    };

    for (const monsterRow of designTables.MonsterData || []) {
      const monsterKey = getDesignRuntimeMonsterKey(monsterRow.MonsterID);
      if (!monsterKey) continue;
      const monsterType = designMonsterTypeToRuntime(monsterRow.MonsterType);
      const prior = runtimeMonsters[monsterKey] || {};
      const typeDefaults = visualDefaultsByMonsterType[monsterType] || visualDefaultsByMonsterType.basic;
      const monsterHp = Number(monsterRow.MonsterHp);
      const monsterAtk = Number(monsterRow.MonsterAtk);
      const monsterMoveSpeed = Number(monsterRow.MonsterMoveSpeed);
      const monsterAtkSpeed = Number(monsterRow.MonsterAtkSpeed);
      const monsterAtkRange = Number(monsterRow.MonsterAtkRange);
      const isDummy = monsterType === "dummy";
      const isCenter = prior.isCenter === true || monsterType === "center";
      const expTypeId = String(monsterRow.ExpTypeID || "");
      runtimeMonsters[monsterKey] = {
        key: monsterKey,
        monsterId: monsterRow.MonsterSprite || monsterKey,
        sprite: monsterRow.MonsterSprite || "",
        name: localizeDesignKey(monsterRow.MonsterName, monsterRow.Desc || monsterKey),
        role: monsterRow.Desc || monsterType,
        mark: prior.mark || typeDefaults.mark,
        color: prior.color || typeDefaults.color,
        hpMult: monsterHp > 0 ? monsterHp / baseMonsterHp : 1,
        damageMult: monsterAtk > 0 ? monsterAtk / baseMonsterDamage : isDummy ? 0.01 : 1,
        speedMult: monsterMoveSpeed > 0 ? monsterMoveSpeed / baseMonsterSpeed : isDummy ? 0.01 : 1,
        attackRateMult: monsterAtkSpeed > 0 ? monsterAtkSpeed / baseMonsterAttackRate : 1,
        radiusAdd: numberOr(prior.radiusAdd, numberOr(typeDefaults.radiusAdd, 0)),
        attackRange: monsterAtkRange > 0 ? monsterAtkRange : 0,
        projectileId: (() => {
          const rawId = Number(monsterRow.MonsterProjectileID);
          if (!Number.isFinite(rawId) || rawId <= 0) return null;
          return getDesignRuntimeKey("MonsterProjectileData", rawId, String(rawId)) || String(rawId);
        })(),
        taunt: numberOr(prior.taunt, typeDefaults.taunt),
        pack: Math.max(1, Math.floor(numberOr(prior.pack, typeDefaults.pack))),
        weight: numberOr(prior.weight, typeDefaults.weight),
        xp: Math.max(0, Math.floor(Number(expAmountByExpType[expTypeId] ?? prior.xp ?? 1))),
        canMove: isDummy ? false : monsterMoveSpeed > 0,
        canAttack: isDummy ? false : monsterAtk > 0,
        testDummy: isDummy,
        isCenter,
        timedAttackDuration: isCenter
          ? Math.max(1, numberOr(prior.timedAttackDuration, 55))
          : 0,
        timedAttackDamage: isCenter
          ? Math.max(0, numberOr(prior.timedAttackDamage, 120))
          : 0,
        expDataType: expTypeId,
        expSource: "designTables",
        source: "designTables",
        design: {
          monsterId: monsterRow.MonsterID,
          monsterType,
          expTypeId: monsterRow.ExpTypeID,
          monsterHp: Number(monsterRow.MonsterHp) || 0,
          monsterAtk: Number(monsterRow.MonsterAtk) || 0,
          monsterAtkSpeed: Number(monsterRow.MonsterAtkSpeed) || 0,
          monsterAtkRange: Number(monsterRow.MonsterAtkRange) || 0,
          monsterProjectileId: Number(monsterRow.MonsterProjectileID) || 0,
          monsterMoveSpeed: Number(monsterRow.MonsterMoveSpeed) || 0,
          fillSource: "MonsterTypeDefaults",
        },
      };
    }
    for (const [expTypeId, xpAmount] of Object.entries(expAmountByExpType)) {
      for (const monsterKey of expTypeToRuntimeKeys[expTypeId] || []) {
        if (!runtimeMonsters[monsterKey]) continue;
        runtimeMonsters[monsterKey] = {
          ...runtimeMonsters[monsterKey],
          xp: xpAmount,
          expDataType: expTypeId,
          expSource: "designTables",
        };
      }
    }

    return {
      levelData: {
        ...levelData,
        stageStartLevel: levelRows[0]?.goalLevel || levelData.stageStartLevel || 1,
        stageMaxLevel,
        xpBase,
        xpLevelGrowth,
        levels: levelRows,
        requiredXpByLevel,
        xpCostByLevel,
        source: "designTables",
      },
      monsters: runtimeMonsters,
      expData: {
        byExpType: expAmountByExpType,
        source: "designTables",
      },
    };
  }

  function buildDesignPatternEvents({ stageRow, patternRow, patternId, waveOrdinal }) {
    const waveDuration = Number(patternRow?.Duration ?? patternRow?.WaveDuration ?? stageRow?.WaveDuration ?? 40);
    const eventCount = Math.max(1, Math.min(8, Math.floor((Number.isFinite(waveDuration) && waveDuration > 0 ? waveDuration : 40) / 5) + 1));
    const normalBuckets = splitDesignCount(patternRow.Normal_Count, eventCount);
    const speedyBuckets = splitDesignCount(patternRow.Speedy_Count, eventCount);
    const tankerBuckets = splitDesignCount(patternRow.Tanker_Count, eventCount);
    const events = [];
    for (let index = 0; index < eventCount; index += 1) {
      const monsters = mergeMonsterCounts(
        distributeDesignMonsterTypes(normalBuckets[index], stageRow.MonsterGroupID_Normal),
        distributeDesignMonsterTypes(speedyBuckets[index], stageRow.MonsterGroupID_Speedy),
        distributeDesignMonsterTypes(tankerBuckets[index], stageRow.MonsterGroupID_Tanker)
      );
      if (!Object.keys(monsters).length) continue;
      const groupId = `${patternId}_g${index + 1}`;
      const sourceGroups = [
        { role: "Normal", monsterGroupId: Number(stageRow.MonsterGroupID_Normal) || 0, count: normalBuckets[index] },
        { role: "Speedy", monsterGroupId: Number(stageRow.MonsterGroupID_Speedy) || 0, count: speedyBuckets[index] },
        { role: "Tanker", monsterGroupId: Number(stageRow.MonsterGroupID_Tanker) || 0, count: tankerBuckets[index] },
      ].filter((item) => item.monsterGroupId && item.count > 0);
      events.push({
        time: index * 5,
        groupId,
        spreadX: 18 + Math.min(30, waveOrdinal * 2),
        spreadY: 10,
      });
      stageWaveRuntimeTables.monsterGroups[groupId] = {
        id: groupId,
        monsters,
        source: "designTables",
        design: {
          stageId: stageRow.StageID,
          wavePatternId: patternRow.WavePatternID,
          eventIndex: index + 1,
          sourceGroups,
        },
      };
    }
    return events;
  }

  const stageWaveRuntimeTables = {
    monsterGroups: { ...monsterGroups },
    wavePatterns: { ...wavePatterns },
    waves: { ...waves },
    stages: [],
  };

  function buildDesignStageWaveRuntimeTables() {
    const waveDataById = indexDesignRows("WaveData", "WaveID");
    const patternById = indexDesignRows("WavePatternData", "WavePatternID");
    const legacyStagesByKey = new Map(stages.map((stage) => [stage.key, stage]));
    const runtimeBosses = runtimeBossTables?.bosses || bosses;
    const getRuntimeWaveDuration = (stageRow, patternRow) => {
      const duration = Number(patternRow?.Duration ?? patternRow?.WaveDuration ?? stageRow?.WaveDuration ?? 40);
      return Number.isFinite(duration) && duration > 0 ? duration : 40;
    };

    (designTables.StageData || []).forEach((stageRow, stageIndex) => {
      const stageKey = getDesignRuntimeStageKey(stageRow.StageID, stageIndex);
      const legacyStage = legacyStagesByKey.get(stageKey) || {};
      const waveData = waveDataById.get(String(stageRow.WaveDataID));
      const stageBossKey = getDesignRuntimeBossKey(stageRow.BossID);
      const stageBossIds = stageBossKey && runtimeBosses[stageBossKey] ? [stageBossKey] : [];
      const waveIds = [];

      for (let waveOrdinal = 1; waveOrdinal <= 9; waveOrdinal += 1) {
        const patternIdValue = waveData?.[`WavePattern_${waveOrdinal}`];
        const patternRow = patternById.get(String(patternIdValue));
        if (!patternRow) continue;
        const runtimeType = designWaveTypeToRuntime(patternRow.WaveType);
        const runtimeWaveId = getDesignRuntimeWaveId(stageKey, stageIndex, waveOrdinal);
        const runtimePatternId = getDesignPatternId(stageKey, stageRow.StageID, waveOrdinal, runtimeType);
        const wave = {
          id: runtimeWaveId,
          label: patternRow.Desc || `${waveOrdinal}웨이브`,
          type: runtimeType,
          duration: runtimeType === "boss" ? 0 : getRuntimeWaveDuration(stageRow, patternRow),
          source: "designTables",
          design: {
            stageId: stageRow.StageID,
            waveDataId: stageRow.WaveDataID,
            wavePatternId: patternRow.WavePatternID,
            waveOrdinal,
          },
        };

        wave.patternId = runtimePatternId;
        stageWaveRuntimeTables.wavePatterns[runtimePatternId] = {
          id: runtimePatternId,
          source: "designTables",
          design: {
            stageId: stageRow.StageID,
            wavePatternId: patternRow.WavePatternID,
          },
          events: buildDesignPatternEvents({
            stageRow,
            patternRow,
            patternId: runtimePatternId,
            waveOrdinal,
          }),
        };

        stageWaveRuntimeTables.waves[runtimeWaveId] = wave;
        waveIds.push(runtimeWaveId);
      }

      if (stageBossIds.length > 0) {
        const bossId = stageBossIds[0];
        const bossWaveId = getDesignRuntimeWaveId(stageKey, stageIndex, 10);
        stageWaveRuntimeTables.waves[bossWaveId] = {
          id: bossWaveId,
          label: runtimeBosses[bossId]?.label || "최종보스",
          type: "boss",
          bossId,
          bossKind: runtimeBosses[bossId]?.kind || "final",
          duration: 0,
          source: "designTables",
          design: {
            stageId: stageRow.StageID,
            waveDataId: stageRow.WaveDataID,
            bossId: stageRow.BossID,
            waveOrdinal: 10,
            generatedFromBossData: true,
          },
        };
        waveIds.push(bossWaveId);
      } else if (stageKey === "stage-test-dummy") {
        const patternIdValue = waveData?.WavePattern_9;
        const patternRow = patternById.get(String(patternIdValue));
        if (patternRow) {
          const waveOrdinal = 10;
          const runtimeWaveId = getDesignRuntimeWaveId(stageKey, stageIndex, waveOrdinal);
          const runtimePatternId = getDesignPatternId(stageKey, stageRow.StageID, waveOrdinal, "test");
          stageWaveRuntimeTables.wavePatterns[runtimePatternId] = {
            id: runtimePatternId,
            source: "designTables",
            design: {
              stageId: stageRow.StageID,
              wavePatternId: patternRow.WavePatternID,
              reusedForTestWave10: true,
            },
            events: buildDesignPatternEvents({
              stageRow,
              patternRow,
              patternId: runtimePatternId,
              waveOrdinal,
            }),
          };
          stageWaveRuntimeTables.waves[runtimeWaveId] = {
            id: runtimeWaveId,
            label: "허수아비 테스트 10",
            type: "test",
            duration: getRuntimeWaveDuration(stageRow, patternRow),
            patternId: runtimePatternId,
            source: "designTables",
            design: {
              stageId: stageRow.StageID,
              waveDataId: stageRow.WaveDataID,
              wavePatternId: patternRow.WavePatternID,
              waveOrdinal,
              generatedTestWave: true,
            },
          };
          waveIds.push(runtimeWaveId);
        }
      }

      stageWaveRuntimeTables.stages.push({
        ...legacyStage,
        key: stageKey,
        title: localizeDesignKey(stageRow.StageName, legacyStage.title || stageRow.StageName || `스테이지 ${stageIndex + 1}`),
        subtitle: legacyStage.subtitle || stageRow.Desc || "",
        description: stageRow.Desc || legacyStage.description || "",
        firstWave: waveIds[0] || legacyStage.firstWave || 1,
        waveIds,
        bossIds: stageBossIds,
        waveReward: {
          gold: Number(stageRow.WaveReward) || 0,
        },
        clearReward: {
          gold: Number(stageRow.StageReward) || 0,
        },
        ui: {
          ...(legacyStage.ui || {}),
          mainImage: stageRow.BGID || legacyStage.ui?.mainImage || "",
        },
        source: "designTables",
        design: {
          stageId: stageRow.StageID,
          waveDataId: stageRow.WaveDataID,
        },
      });
    });

    if (!stageWaveRuntimeTables.stages.length) {
      stageWaveRuntimeTables.stages = stages.map((stage) => ({ ...stage }));
    }
    return stageWaveRuntimeTables;
  }

  const runtimePieceTowerTables = buildDesignPieceTowerRuntimeTables();
  // PieceData에 없는 공격 기물만 폴백으로 채운다 (지금은 PieceData에 포함됨).
  Object.entries(buildAttackPieces()).forEach(([pieceKey, piece]) => {
    if (!runtimePieceTowerTables.pieces[pieceKey]) runtimePieceTowerTables.pieces[pieceKey] = piece;
  });
  Object.entries(buildOrePieces()).forEach(([pieceKey, piece]) => {
    if (!runtimePieceTowerTables.pieces[pieceKey]) runtimePieceTowerTables.pieces[pieceKey] = piece;
  });
  Object.entries(buildSpecialClickPieces()).forEach(([pieceKey, piece]) => {
    if (!runtimePieceTowerTables.pieces[pieceKey]) runtimePieceTowerTables.pieces[pieceKey] = piece;
  });
  const runtimeLoadout = buildDesignLoadoutRuntimeTable(runtimePieceTowerTables);
  const runtimeShop = buildDesignShopRuntimeTable(runtimePieceTowerTables, runtimeLoadout);
  const runtimeLevelExpTables = buildDesignLevelExpRuntimeTables();
  const runtimeMonsterProjectiles = (() => {
    const runtime = {};
    const asNumber = (value, fallback = 0) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : fallback;
    };
    for (const row of designTables.MonsterProjectileData || []) {
      const rawId = Number(row.MonsterProjectileID);
      if (!Number.isFinite(rawId) || rawId <= 0) continue;
      const key = getDesignRuntimeKey("MonsterProjectileData", rawId, String(rawId), String(rawId));
      runtime[key] = {
        id: key,
        name: row.ProjectileName || key,
        prefab: row.ProjectilePrefab || "",
        speed: Math.max(1, asNumber(row.ProjectileSpeed, 220)),
        radius: Math.max(2, asNumber(row.ProjectileSize, 12)),
        life: Math.max(0.1, asNumber(row.ProjectileLife, 2)),
        source: "designTables",
        design: { monsterProjectileId: rawId },
      };
    }
    return runtime;
  })();
  const runtimeBossTables = buildDesignBossRuntimeTables();
  const runtimeStageWaveTables = buildDesignStageWaveRuntimeTables();

  if (!window.CURRENT_LANGUAGE) window.CURRENT_LANGUAGE = "ko";

  window.GAME_DATA = {
    version: "2026-06-25-exhibition-projectile-sprites",
    dataGuide,
    designTableSchema,
    designRuntimeKeyMap,
    designTables,
    getCurrentLanguage,
    setCurrentLanguage,
    localizeDesignKey,
    pieceAttribute: PIECE_ATTRIBUTE,
    pieceAttributeInfo: PIECE_ATTRIBUTE_INFO,
    constants: {
      slotCount: 12,
      cellsPerSlot: 3,
      loadoutPieceCount: 4,
      initialPiecesPerSlot: 2,
      refillPiecesPerEmptySlot: 2,
      slotSize: { width: 102, height: 76 },
      slotSizeStorageVersion: 8,
    },
    storageKeys: {
      layout: "slotSortBattleLayoutV8",
      playerSave: "slotSortBattlePlayerSaveV1",
      phonePreset: "slotSortBattlePhonePresetV1",
      lobby: "slotSortBattleLobbyV4",
      stageClear: "slotSortBattleStageClearV1",
      legacyBest: "slotSortBest",
    },
    defaultPlayerSave: {
      version: 1,
      currency: { gold: 0 },
      ownedPieces: ["cactus_1", "owl_1", "robot_1", "knight_1"],
      selectedLoadout: ["cactus_1", "owl_1", "robot_1", "knight_1"],
      selectedStageKey: "stage-1",
      clearedStages: {},
      bestScore: 0,
      stageRecords: {},
      settings: { phonePreset: "galaxy-s24", language: "ko" },
      pieceLevels: {},
      pieceStars: {},
      unlockedRewards: {},
    },
    progression: {
      pieceDefaultLevel: 1,
      pieceMaxLevel: 20,
      pieceUpgradeMode: "replacePieceId",
      pieceUpgradeBaseGold: 120,
      pieceUpgradeGoldStep: 80,
      pieceLevelDamageBonus: 0,
      pieceLevelRangeBonus: 0,
      pieceLevelAmmoBonusEvery: 999,
    },
    levelData: runtimeLevelExpTables.levelData,
    effectData: {
      pieceLevelDamageBonus: { type: "deprecated", stat: "damageMultiplier", perLevel: 0 },
      pieceLevelRangeBonus: { type: "deprecated", stat: "range", perLevel: 0 },
      pieceLevelAmmoBonus: { type: "deprecated", stat: "maxAmmo", everyLevel: 999, amount: 0 },
      perkTowerAmmoBonus: { type: "towerStat", stat: "maxAmmoFromSeconds", amount: 0.8 },
    },
    localizeData: {
      ui: {
        start: "Start!",
        deck: "Loadout",
        shop: "Shop",
        enhance: "Enhance",
        owned: "Owned",
        acquire: "Acquire",
      },
      result: {
        clear: "Stage Clear",
        fail: "Game Over",
        firstClearReward: "First Clear Reward",
        rewardClaimed: "Reward Claimed",
        noReward: "No Reward",
      },
    },
    shop: runtimeShop,
    towerTypes,
    projectiles: runtimePieceTowerTables.projectiles,
    pieces: runtimePieceTowerTables.pieces,
    pieceDefinitions: runtimePieceTowerTables.pieceDefinitions,
    gradeStats: {
      1: { damage: 1, fireRate: 1, range: 0, bulletBonus: 0 },
    },
    loadout: runtimeLoadout,
    fallbackLoadoutKeys: runtimeLoadout.fallbackPieceKeys,
    defaultLoadoutKeys: runtimeLoadout.defaultPieceKeys,
    monsters: runtimeLevelExpTables.monsters,
    monsterTypes: runtimeLevelExpTables.monsters,
    monsterProjectiles: runtimeMonsterProjectiles,
    bosses: runtimeBossTables.bosses,
    monsterGroups: runtimeStageWaveTables.monsterGroups,
    wavePatterns: runtimeStageWaveTables.wavePatterns,
    waves: runtimeStageWaveTables.waves,
    stages: runtimeStageWaveTables.stages,
    // elite 비율은 getCurrentEliteRate(난이도 티어)가 담당. eliteBonus는 레거시 호환용(미사용).
    waveProfiles: {
      // Soft intro stretched: old 1→1·2, old 2→3·4, old 3→5·6, old 4·5·6→7·8·9
      1: {
        label: "벽면 학습",
        spawnRate: 2.05,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 1, speed: 0, tank: 0, ranged: 0 },
      },
      2: {
        label: "벽면 학습",
        spawnRate: 2.05,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 1, speed: 0, tank: 0, ranged: 0 },
      },
      3: {
        label: "공중형 등장",
        spawnRate: 1.75,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 0.72, speed: 0.28, tank: 0, ranged: 0 },
      },
      4: {
        label: "공중형 등장",
        spawnRate: 1.75,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 0.72, speed: 0.28, tank: 0, ranged: 0 },
      },
      5: {
        label: "지상형 등장",
        spawnRate: 1.5,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 0.55, speed: 0.25, tank: 0.2, ranged: 0 },
      },
      6: {
        label: "지상형 등장",
        spawnRate: 1.5,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 0.55, speed: 0.25, tank: 0.2, ranged: 0 },
      },
      7: {
        label: "혼합 적응",
        spawnRate: 1.3,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 0.5, speed: 0.3, tank: 0.2, ranged: 0 },
      },
      8: {
        label: "압박 상승",
        spawnRate: 1.18,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 0.46, speed: 0.34, tank: 0.2, ranged: 0 },
      },
      9: {
        label: "후반 진입",
        spawnRate: 1.08,
        batchBonus: 0,
        eliteBonus: 0,
        weights: { basic: 0.44, speed: 0.36, tank: 0.2, ranged: 0 },
      },
    },
    phonePresets: [
      {
        key: "galaxy-s24",
        label: "갤럭시 S24 / S25 / S26",
        width: 360,
        height: 780,
        note: "FHD+ 1080x2340 기준 CSS 플레이 영역 360x780",
      },
      {
        key: "galaxy-s24-plus",
        label: "갤럭시 S24+ / S25+",
        width: 412,
        height: 892,
        note: "QHD+ 1440x3120 기준 CSS 플레이 영역 412x892",
      },
      {
        key: "galaxy-s24-ultra",
        label: "갤럭시 S24 Ultra / S25 Ultra",
        width: 412,
        height: 892,
        note: "QHD+ 1440x3120 기준 CSS 플레이 영역 412x892",
      },
      {
        key: "galaxy-s26-large",
        label: "갤럭시 S26+ / S26 Ultra 예상",
        width: 412,
        height: 892,
        note: "대형 갤럭시 QHD+ 계열 임시 대응",
      },
    ],
    defaultConfig: {
      slotHp: 10000,
      monsterHp: 22,
      monsterDamage: 1,
      monsterSpeed: 34,
      monsterRadius: 11,
      eliteMonsterRadius: 14,
      monsterAttackRate: 1.35,
      monsterSpawnSec: 1.05,
      spawnBatch: 1,
      mpMax: 10,
      spawnSlotMinDistance: 42,
      eliteRate: 0.01,
      eliteRatePerTier: 0.01,
      eliteRateMax: 0.2,
      eliteHpMult: 1.5,
      eliteDamageMult: 1.25,
      // 페이즈 1→10: 몬스터 공격력 1배→1.5배 (이후 상한 유지)
      monsterAtkScaleMax: 1.5,
      monsterAtkScaleMaxTier: 10,
      difficultyTierIntervalSec: 60,
      basicMonsterWeight: 0.44,
      tankMonsterWeight: 0.12,
      speedMonsterWeight: 0.34,
      rangedMonsterWeight: 0,
      // 레거시 배율(미사용 권장). 실스탯은 MonsterData.MonsterHp / MonsterAtk 절대값을 봅니다.
      tankMonsterHpMult: 1,
      tankMonsterSpeedMult: 1,
      tankMonsterDamageMult: 1,
      tankMonsterTaunt: 7,
      speedMonsterHpMult: 1,
      speedMonsterSpeedMult: 1,
      speedMonsterDamageMult: 1,
      speedMonsterPack: 1,
      rangedMonsterHpMult: 1,
      rangedMonsterSpeedMult: 1,
      rangedMonsterDamageMult: 1,
      rangedMonsterAttackRange: 126,
      baseBullets: 4,
      comboBulletBonus: 0,
      maxBullets: 16,
      bulletDamage: 24,
      bulletSpeed: 720,
      bulletRetargetRange: 150,
      towerFireRate: 0.6,
      towerQueueLimit: 1,
      towerOverdriveDamageRatio: 0.3,
      sortHealAmount: 5,
      deckClearHealRatio: 0.1,
      rerollCooldown: 14,
      baseRerollCharges: 2,
      looseThreeFillChance: 0.1,
      repairSortsRequired: 3,
      setsPerPiece: 3,
      fieldClearDamage: 180,
      fieldClearBossDamageRatio: 0.4,
      comboWindow: 3.5,
      comboWindowMin: 2.5,
      comboWindowScaleAtCombo: 10,
      comboAlertWindow: 0.7,
      comboFeverEnabled: true,
      enemyCap: 10,
      xpBase: 20,
      xpLevelGrowth: 12,
      commonRate: 0.5,
      rareRate: 0.3,
      legendaryRate: 0,
      uniqueRate: 0.2,
      splashRadius: 28,
      splashDamageRatio: 0.18,
      feverDuration: 10,
      totalWaves: 10,
      waveDuration: 32,
      midBossHpMult: 95,
      midBossDamage: 4,
      midBossSpeed: 18,
      // 최종보스 HP ≈ MonsterHp(20000). 목표 전투 ~3분.
      // 가정: 유효 DPS ~280(피버/박치기 포함), 구슬로 딜타임 ~40% → 20000/(280*0.4)≈179초.
      finalBossHpMult: 909.0909090909,
      finalBossMeleeDamage: 10,
      finalBossRangedDamage: 4,
      finalBossSpeed: 21,
      finalBossRangedRange: 110,
      finalBossSummonSec: 9,
      finalBossSummonCount: 8,
      bossOrbMaxHp: 3750,
      bossOrbDurationSec: 20,
      bossOrbFailDamage: 400,
      bossWarningTime: 0.75,
      bossMeleeWarningTime: 0.55,
      maxDamageUpgrades: 3,
      maxProjectileUpgrades: 3,
      maxFireRateUpgrades: 5,
      supportHealAmount: 22,
    },
  };
})();
