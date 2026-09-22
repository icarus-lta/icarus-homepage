import type { Language } from './language';

const en = {
  metadata: {
    title: 'About ICARUS LTA',
    description: 'How ICARUS develops unmanned airships, the technology behind them, and where our work takes flight. Our capabilities, development sites and progress.',
  },
  hero: {
    label: 'ICARUS',
    location: 'GWANGJU, SOUTH KOREA',
    title: 'ABOUT\nICARUS',
    description: 'In airships, often seen as a technology of the past, we saw new possibilities.\nICARUS was founded to turn those possibilities into reality.',
    discover: 'EXPLORE ICARUS',
  },
  film: {
    watch: 'Watch our flight film', unavailable: 'Film unavailable',
    caption: 'ICARUS · FLIGHT TEST FOOTAGE', title: 'ICARUS · Flight test footage',
    pause: 'Pause background video', play: 'Play background video',
    close: 'Close', closeLabel: 'Close film', label: 'ICARUS airship flight test film',
  },
  chapters: {
    label: 'INSIDE ICARUS', navigation: 'About page sections',
    items: [
      { id: 'what-we-do', label: 'What we do' },
      { id: 'why-us', label: 'Why us' },
      { id: 'when-we-start', label: 'When we start' },
      { id: 'where-are-we', label: 'Where are we' },
    ],
  },
  /** 01 — the company stated plainly, over the ground-team photograph. */
  what: {
    label: 'WHAT WE DO', title: 'What we do',
    /** Each claim reads as one phrase; `only` is set in the heading's keyword colour. */
    claims: [
      { only: 'Korea’s only', text: 'unmanned airship system developer' },
      { only: 'Korea’s only', text: 'stratospheric system developer' },
    ],
    description: 'From envelope materials through design, fabrication, flight control, ground control and operation, we carry out every stage ourselves. No other company in Korea holds all of these steps in house.',
    imageAlt: 'The ground team carrying the full ICARUS airship across a lawn at the test site',
    imageCaption: 'ICARUS · FLIGHT TESTING',
    points: [
      {
        title: 'Airframe',
        description: 'From hull geometry and structural analysis through fabrication and assembly. Our airships are built in our own hangar in Gwangju.',
      },
      {
        title: 'Flight control',
        description: 'Flight-control software and the ground-control system that flies the airship, each validated in the air rather than only in simulation.',
      },
      {
        title: 'Envelope materials',
        description: 'Lightweight, high-strength laminates that keep helium from escaping — the material the whole airship depends on.',
      },
    ],
  },
  /** 02 — what we hold in house, over the CFD visual. */
  why: {
    label: 'WHY US', title: 'Why us',
    lead: 'The three capabilities\nthat put an airship in the air',
    description: 'Airframe, control and materials each change the others’ constraints. A new material changes the hull geometry; a new geometry changes how the airship must be controlled. We develop all three together, so those interactions are settled at the design stage.',
    imageCaption: 'ICARUS / COMPUTATIONAL FLUID DYNAMICS',
    points: [
      {
        title: 'Design & fabrication',
        description: 'Hull geometry verified against CFD analysis, then fabricated, assembled and confirmed in flight. Each test feeds the next revision of the design.',
      },
      {
        title: 'Flight control',
        description: 'Autonomous control that began in drone research, carried over to unmanned airships. Flight-dynamics models are corrected against measurements taken in the air.',
      },
      {
        title: 'Materials',
        description: 'Lightweight, high-strength, gas-barrier laminates developed with the Korea Textile Development Institute. A prototype material was completed in 2025.',
      },
    ],
  },
  /** 03 — the company history as a plain timeline. No media in this chapter. */
  when: {
    label: 'WHEN WE START', title: 'When we start',
    lead: 'From our first year to now',
    description: 'What ICARUS has built, and where that work has been recognised.',
    history: [
      {
        year: '2025',
        entries: [
          { date: '06', text: 'Exhibited at the Gwangju Future Industry Expo; featured in YTN news coverage' },
          { date: '10', text: 'Excellence Award, K-Deeptech competition (student startup category)' },
          { date: '12', text: 'Unmanned airship envelope material developed with the Korea Textile Development Institute' },
        ],
      },
      {
        year: '2026',
        entries: [
          { date: '', text: 'Small unmanned airship flight testing under way' },
        ],
      },
    ],
  },
  /** 04 — the three sites, over the schematic map. */
  where: {
    label: 'WHERE ARE WE', title: 'Where are we',
    description: 'Our work connects development and assembly in Gwangju with testing in Jangseong. Goheung will be our next location.',
    places: [
      { name: 'Gwangju', english: 'GWANGJU', role: 'Office & assembly hangar', description: 'Where we develop ideas, design our systems, and assemble airships.', status: 'Active' },
      { name: 'Jangseong', english: 'JANGSEONG', role: 'Test area', description: 'Where we test our airships and bring what we learn back into development.', status: 'Active' },
      { name: 'Goheung', english: 'GOHEUNG', role: 'Future location', description: 'The next location for ICARUS is taking shape.', status: 'Coming soon' },
    ],
    mapNote: 'Schematic overview of our locations.',
    contact: 'Get in touch',
    contactDescription: 'Start a conversation about our technology and what we could build together.',
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
      { id: 'what-we-do', label: 'What we do' },
      { id: 'why-us', label: 'Why us' },
      { id: 'when-we-start', label: 'When we start' },
      { id: 'where-are-we', label: 'Where are we' },
    ],
  },
  what: {
    label: 'WHAT WE DO', title: 'What we do',
    claims: [
      { only: '국내 유일', text: '무인 비행선 시스템 개발 기업' },
      { only: '국내 유일', text: '성층권 시스템 개발 기업' },
    ],
    description: '비행선 소재부터 설계와 제작, 비행 제어와 지상 관제, 그리고 운용까지 전 과정을 직접 수행합니다. 이 모든 단계를 한 기업 안에 갖춘 곳은 국내에서 ICARUS뿐입니다.',
    imageAlt: '시험 현장의 잔디밭에서 ICARUS 비행선을 함께 운반하는 지상 운영팀',
    imageCaption: 'ICARUS · 시험 비행 현장',
    points: [
      {
        title: '무인 비행선 기체',
        description: '기체 형상 설계와 구조 해석부터 제작과 조립까지 직접 수행합니다. 비행선은 광주 격납고에서 만들어집니다.',
      },
      {
        title: '무인 비행선 제어',
        description: '비행 제어 소프트웨어와 지상 관제 시스템을 개발합니다. 시뮬레이션에 머무르지 않고 실제 비행으로 검증합니다.',
      },
      {
        title: '무인 비행선 소재',
        description: '가볍고 강하면서 헬륨이 쉽게 새지 않는 기낭 소재를 개발합니다. 비행선 전체가 이 소재 위에서 성립합니다.',
      },
    ],
  },
  why: {
    label: 'WHY US', title: 'Why us',
    lead: '비행선을 날게 하는\n세 가지 기술력',
    description: '기체와 제어, 소재는 서로의 조건을 바꿉니다. 소재가 달라지면 기체 형상이 달라지고, 형상이 달라지면 제어 방식이 달라집니다. ICARUS는 세 기술을 함께 개발해 이 맞물림을 설계 단계에서 풉니다.',
    imageCaption: 'ICARUS / COMPUTATIONAL FLUID DYNAMICS',
    points: [
      {
        title: '설계 및 제작 기술력',
        description: 'CFD 유동 해석으로 기체 형상을 검증하고, 제작과 조립을 거쳐 실제 비행으로 확인합니다. 시험에서 확인한 것이 다음 설계로 이어집니다.',
      },
      {
        title: '제어 기술력',
        description: '드론 제어 연구에서 출발한 자율 비행 제어 기술을 무인 비행선에 적용합니다. 비행 동역학 모델을 시험 비행 계측값과 대조해 보정합니다.',
      },
      {
        title: '소재 기술력',
        description: '한국섬유개발연구원과 함께 경량 고강도 가스 차단 적층 소재를 개발합니다. 2025년 시제품 개발을 마쳤습니다.',
      },
    ],
  },
  when: {
    label: 'WHEN WE START', title: 'When we start',
    lead: '첫해부터 지금까지',
    description: 'ICARUS가 무엇을 만들어 왔고, 어디에서 그 결과를 인정받았는지 정리했습니다.',
    history: [
      {
        year: '2025',
        entries: [
          { date: '06', text: '광주미래산업엑스포 참가, YTN 뉴스 보도' },
          { date: '10', text: 'K-딥테크 왕중왕전 학생 창업 부문 우수상' },
          { date: '12', text: '한국섬유개발연구원과 무인 비행선 기낭 소재 개발' },
        ],
      },
      {
        year: '2026',
        entries: [
          { date: '', text: '소형 무인 비행선 시험 비행 진행' },
        ],
      },
    ],
  },
  where: {
    label: 'WHERE ARE WE', title: 'Where are we',
    description: '광주에서 연구하고 조립하며, 장성에서 시험합니다. 다음 걸음은 고흥으로 이어집니다.',
    places: [
      { name: '광주', english: 'GWANGJU', role: '사무실 · 조립 격납고', description: '아이디어를 구체화하고 시스템을 설계하며 비행선을 조립하는 공간입니다.', status: '운영 중' },
      { name: '장성', english: 'JANGSEONG', role: '시험 비행장', description: '직접 비행하며 확인하고, 현장에서 배운 것을 다음 개발로 이어가는 공간입니다.', status: '운영 중' },
      { name: '고흥', english: 'GOHEUNG', role: '예정 거점', description: 'ICARUS의 다음 거점을 준비하고 있습니다.', status: '준비 중' },
    ],
    mapNote: '각 거점의 위치를 개략적으로 표시했습니다.',
    contact: '문의하기',
    contactDescription: 'ICARUS의 기술과 함께 만들어 갈 가능성에 관해 이야기해 주세요.',
  },
};

export const aboutContent = { en, ko } satisfies Record<Language, typeof en>;
