import type { Language } from './language';


const en = {
  metadata: {
    title: 'About ICARUS LTA',
    description: 'Explore ICARUS’s unmanned airships and HAPS systems, our development work, and our sites in Gwangju, Jangseong, and Goheung.',
  },
  hero: {
    label: 'ICARUS',
    location: 'GWANGJU, SOUTH KOREA',
    title: 'ABOUT\nICARUS',
    description: 'We saw new possibilities in airships, long considered a technology of the past.\nICARUS was founded to make those possibilities real.',
    discover: 'EXPLORE ICARUS',
  },
  film: {
    watch: 'Watch our flight film', unavailable: 'Film unavailable',
    caption: 'ICARUS · FLIGHT TEST FOOTAGE', title: 'ICARUS · Flight Test Footage',
    pause: 'Pause background video', play: 'Play background video',
    close: 'Close', closeLabel: 'Close film', label: 'ICARUS airship flight test film',
  },
  chapters: {
    label: 'INSIDE ICARUS', navigation: 'About page sections',
    items: [
      { id: 'what-we-do', label: 'What We Do' },
      { id: 'why-us', label: 'Why Us' },
      { id: 'when-we-start', label: 'When We Start' },
      { id: 'where-are-we', label: 'Where We Work' },
    ],
  },
  /** 01 — the company stated plainly, over the ground-team photograph. */
  what: {
    label: 'WHAT WE DO', title: 'What We Do',
    /** Each claim reads as one phrase; `only` is set as an ice-blue badge above it. */
    claims: [
      { only: 'Korea’s Only', text: 'Unmanned Airship System Developer' },
      { only: 'Korea’s Only', text: 'HAPS System Developer' },
    ],
    description: 'ICARUS is Korea’s only developer of unmanned airship systems and HAPS systems. We work across materials, design, fabrication, control, and operations.',
    imageAlt: 'The ground team carrying the full ICARUS airship across a lawn at the test site',
    imageCaption: 'ICARUS · FLIGHT TESTING',
    /** A large keyword and one short line each; Why us below carries the detail. */
    points: [
      { title: 'Airframe', description: 'From airframe design to fabrication and validation' },
      { title: 'Operations', description: 'From control software and ground control to airship operations' },
      { title: 'Materials', description: 'Lightweight, high-strength gas-barrier composites developed in house' },
    ],
  },
  /** 02 — what we hold in house; choosing a capability changes the visual beside it. */
  why: {
    label: 'WHY ICARUS', title: 'Why ICARUS',
    /** One card each: the title beside its number, and one line below. Choosing a card shows its
        visual on the left, described by `visual` and captioned `caption`. */
    points: [
      {
        title: 'Design & Fabrication', description: 'We handle the entire airframe development process, from analysis and design to fabrication and validation.',
        caption: 'ICARUS / COMPUTATIONAL FLUID DYNAMICS', visual: 'CFD simulation of airflow around the airship',
      },
      {
        title: 'Flight Control Software', description: 'We develop airship control software through dynamics simulation of unmanned airships.',
        caption: 'ICARUS / FLIGHT CONTROL SIMULATION', visual: 'Illustrative airship station-keeping simulation with wind, position error, power consumption and attitude response',
      },
      {
        title: 'Airship Materials', description: 'We develop world-class lightweight, high-strength gas-barrier composites for unmanned airships.',
        caption: 'ICARUS / ENVELOPE MATERIAL', visual: 'Footage of material-processing rollers and test equipment',
      },
    ],
  },
  /** 03 — the company history as a plain timeline, with no copy above it. The last year is the current one. */
  when: {
    label: 'WHEN WE START', title: 'When We Start',
    history: [
      {
        year: '2024',
        entries: [
          { date: '04', text: 'Selected for the Korea Institute of Startup & Entrepreneurship Development’s Startup-Centered University program (pre-startup track)' },
          { date: '06', text: 'ICARUS founded' },
          { date: '10', text: 'Selected for the Ministry of SMEs and Startups’ Didimdol R&D program' },
          { date: '11', text: 'Grand Prize at the Korea Electric Power Corporation startup competition' },
        ],
      },
      {
        year: '2025',
        entries: [
          { date: '04', text: 'Selected for the Global Corporate Collaboration Program (ANSYS SPACE KOREA)' },
          { date: '07', text: 'Signed an MOU with DK MTech, a specialist supplier to the Korea Coast Guard' },
          { date: '10', text: 'Excellence Award in the student startup category at the K-Deep Tech Championship' },
          { date: '12', text: 'Developed unmanned airship envelope material with the Korea Textile Development Institute' },
        ],
      },
      {
        year: '2026',
        entries: [
          { date: '02', text: 'Incorporated as ICARUS LTA' },
          { date: '03', text: 'Established a corporate research institute' },
          { date: '05', text: 'Secured seed investment' },
          { date: '06', text: 'Selected for the follow-on Global Corporate Collaboration Program (ANSYS SPACE KOREA)' },
          { date: '09', text: 'Selected for the TIPS program' },
        ],
      },
    ],
  },
  /** 04 — the three sites, over the schematic map. */
  where: {
    label: 'WHERE WE WORK', title: 'Where We Work',
    description: 'We conduct research and assemble airships in Gwangju, then test them in Jangseong. Goheung is our next step.',
    places: [
      { name: 'Gwangju', english: 'GWANGJU', role: 'Headquarters & Production Facility', description: 'System design, airship fabrication, and integration.', status: 'Operational' },
      { name: 'Jangseong', english: 'JANGSEONG', role: 'Flight Test Site', description: 'Flight testing to validate aircraft performance and operations.', status: 'Operational' },
      { name: 'Goheung', english: 'GOHEUNG', role: 'Flight Test Site', description: 'Planned.', status: 'In preparation' },
    ],
  },
};

// Korean and English carry the same content, with copy written naturally for each language.
const ko: typeof en = {
  metadata: {
    title: '회사 소개 — ICARUS LTA',
    description: 'ICARUS의 무인 비행선·성층권 시스템 기술과 개발 과정, 광주·장성·고흥의 거점을 소개합니다.',
  },
  hero: {
    label: 'ICARUS', location: '대한민국 광주',
    title: 'ABOUT\nICARUS',
    description: '과거의 기술로 여겨지는 비행선에서, 우리는 새로운 가능성을 보았습니다.\nICARUS는 그 가능성을 현실로 만들기 위해 시작되었습니다.',
    discover: 'ICARUS 살펴보기',
  },
  film: {
    watch: '시험 비행 영상 보기', unavailable: '영상을 불러올 수 없습니다',
    caption: 'ICARUS · 시험 비행 현장', title: 'ICARUS · 시험 비행 영상',
    pause: '배경 영상 일시정지', play: '배경 영상 재생',
    close: '닫기', closeLabel: '영상 닫기', label: 'ICARUS 비행선 시험 비행 영상',
  },
  chapters: {
    label: '회사 소개', navigation: '회사 소개 목차',
    items: [
      { id: 'what-we-do', label: 'What We Do' },
      { id: 'why-us', label: 'Why Us' },
      { id: 'when-we-start', label: 'When We Start' },
      { id: 'where-are-we', label: 'Where We Are' },
    ],
  },
  what: {
    label: 'WHAT WE DO', title: 'What We Do',
    claims: [
      { only: '국내 유일', text: '무인 비행선 시스템 개발 기업' },
      { only: '국내 유일', text: '성층권 무인 항공기 개발 기업' },
    ],
    /** \n starts the claim on its own line; the word joiner (⁠) keeps a wrapped line from starting with the middle dot. */
    description: 'ICARUS는 비행선 소재에서부터 설계와 제작, 제어와 운용 역량을 보유한\n국내 유일의 무인 비행선 시스템 개발 기업⁠·성층권 무인 항공기 개발 기업입니다.',
    imageAlt: '시험 현장의 잔디밭에서 ICARUS 비행선을 함께 운반하는 지상 운영팀',
    imageCaption: 'ICARUS · 시험 비행 현장',
    /** \n starts a new line in the description. */
    points: [
      { title: '기체', description: '기체 설계에서부터\n제작·검증까지' },
      { title: '운용', description: '제어 SW와 지상 관제부터 비행선 운용까지' },
      { title: '소재', description: '저중량 고강도 가스 차단성 복합 소재 자체 개발' },
    ],
  },
  why: {
    label: 'WHY ICARUS', title: 'Why ICARUS',
    points: [
      {
        title: '설계 및 제작', description: '해석부터 설계·제작·검증까지, 기체 개발 전 과정을 직접 수행합니다.',
        caption: 'ICARUS / COMPUTATIONAL FLUID DYNAMICS', visual: '비행선 주변 유동을 보여주는 CFD 시뮬레이션',
      },
      {
        title: '비행 제어 SW', description: '무인 비행선 동역학 시뮬레이션을 통한 비행선 제어 SW를 개발합니다.',
        caption: 'ICARUS / FLIGHT CONTROL SIMULATION', visual: '바람에 대한 비행선의 정점 유지와 위치 오차, 소비 전력, 자세 응답을 보여주는 예시 시뮬레이션',
      },
      {
        title: '비행선 소재', description: '세계 최고 수준의 무인 비행선용 저중량 고강도 가스 차단성 복합 소재를 개발합니다.',
        caption: 'ICARUS / ENVELOPE MATERIAL', visual: '소재 가공 롤러와 시험 장비를 보여주는 영상',
      },
    ],
  },
  when: {
    label: 'WHEN WE START', title: 'When We Start',
    history: [
      {
        year: '2024',
        entries: [
          { date: '04', text: '창업진흥원 창업중심대학(예비) 선정' },
          { date: '06', text: '이카루스 설립'},
          { date: '10', text: '중소벤처기업부 디딤돌 R&D 선정' },
          { date: '11', text: '한국전력 창업 경진대회 대상' },
        ],
      },
      {
        year: '2025',
        entries: [
          { date: '04', text: '글로벌 기업 협업 프로그램(ANSYS SPACE KOREA) 선정'},
          { date: '07', text: '해경 납품 전문업체 DK엠텍과 MOU 체결' },
          { date: '10', text: 'K-딥테크 왕중왕전 학생 창업 부문 우수상' },
          { date: '12', text: '한국섬유개발연구원과 무인 비행선 기낭 소재 개발' },
        ],
      },
      {
        year: '2026',
        entries: [
          { date: '02', text: '이카루스LTA 법인 전환' },
          { date: '03', text: '기업 연구소 설립' },
          { date: '05', text: '시드 투자 유치' },
          { date: '06', text: '글로벌 기업 협업 프로그램(ANSYS SPACE KOREA)후속 선정' },
          { date: '09', text: 'TIPS 선정' },
        ],
      },
    ],
  },
  where: {
    label: 'WHERE WE ARE', title: 'Where We Are',
    description: '광주에서 연구하고 조립하며, 장성에서 시험합니다. 다음 걸음은 고흥으로 이어집니다.',
    places: [
      { name: '광주', english: 'GWANGJU', role: '본사 · 제작 시설', description: '시스템 설계 및 비행선 제작·통합 수행', status: '운영 중' },
      { name: '장성', english: 'JANGSEONG', role: '시험 비행장', description: '실제 비행을 통한 기체 비행 성능 및 운용 성능 검증', status: '운영 중' },
      { name: '고흥', english: 'GOHEUNG', role: '시험 비행장', description: '예정', status: '준비 중' },
    ],
  },
};

export const aboutContent = { en, ko } satisfies Record<Language, typeof en>;
