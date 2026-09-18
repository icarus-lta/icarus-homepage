const en = {
  navigation: {
    label: 'Main navigation',
    links: [
      { label: 'MISSION', href: '/mission' },
      { label: 'ABOUT', href: '/about' },
      { label: 'CAREER', href: '/career' },
      { label: 'NEWS', href: '/news' },
    ],
    contact: 'CONTACT',
  },
  hero: {
    titleLines: ['Building Humanity’s', 'Next Infrastructure Layer', 'In the Stratosphere'],
    primaryLabel: 'Join us',
    secondaryLabel: 'Contact',
  },
  altitude: {
    title: 'The layer between orbit and the ground',
    description: 'A persistent stratospheric layer - bridges orbit and the ground, relieving communication bottlenecks and extending connectivity',
    rowLabels: {
      leo: 'LEO', leoAlt: '400–700 km',
      stratosphere: 'STRATOSPHERE', stratosphereAlt: '20 km',
      troposphere: 'TROPOSPHERE', troposphereAlt: '10 km',
      ground: 'GROUND', groundAlt: '0 km', groundStation: 'GROUND STATION',
    },
    rates: {
      crosslinkKind: 'Laser Communication (FSO)', crosslink: 'Tbps',
      directKind: 'RF Communication', direct: 'Mbps', bottleneck: 'Network bottleneck',
      laserKind: 'Laser Communication (FSO)', laser: 'Tbps',
      relayKind: 'RF Communication', relay: 'Gbps', relayGain: 'x 100 bandwidth',
    },
    directToCell: 'Direct to Cell',
    services: { City: 'City', Mobile: 'Mobile', Mobility: 'Mobility', Military: 'Military' },
    serviceDescription: 'direct-to-cell service group',
    airship: 'Stratospheric airship',
    airshipDescription: 'A slender blue-and-silver airship facing left, with a hull and compact fins symmetric about the horizontal centreline, and a clearly defined solar array following the upper contour. No gondola or propeller.',
  },
  endurance: {
    title: 'The New Era of Airship',
    description: "Technology doesn't automatically improve. ICARUS reinvents long-stagnant airship technology.",
    parts: [
      { name: 'Envelope Material', detail: 'Laminated, Helium Barrier Material' },
      { name: 'Solar Panel', detail: 'Silicon based High efficiency, Light weight panel' },
      { name: 'Propulsion Unit', detail: 'High efficiency Electric motor and Propeller' },
      { name: 'Payload', detail: 'Communication Relay Antenna, Radar, EO/IR' },
    ],
    north: 'DPRK', south: 'ROK', radiusLabel: 'Coverage radius',
    capabilities: {
      relay: 'Communication Relay',
      cost: { emphasis: '10 times cheaper', comparison: 'than satellite' },
      speed: { emphasis: '100 times faster', comparison: 'than satellite' },
      observation: 'Observation',
      realtime: 'Real-time Observation',
      applications: ['Maritime', 'Wildfire', 'Defense', 'Environmental monitoring'],
    },
  },
  roadmap: {
    eyebrow: 'ROADMAP', title: 'From test flights to service',
    phases: [
      { phase: 'PHASE 01', title: 'Small-scale Airship Flight test', note: 'In Progress', current: true },
      { phase: 'PHASE 02', title: 'Stratosphere airship Flight test' },
      { phase: 'PHASE 03', title: 'Scale Up' },
      { phase: 'PHASE 04', title: 'Commercial Service' },
    ],
  },
  contact: {
    title: 'From the ground to the stratosphere',
    description: 'We are looking for partners, operators and engineers to climb with us.',
    secondaryLabel: 'Careers',
  },
  footer: {
    address: 'Startup Center A-318-1, GIST, 123 Cheomdangwagi-ro, Buk-gu, Gwangju, Republic of Korea',
    copyright: '© 2026 ICARUS LTA. All rights reserved.',
  },
};

const ko: typeof en = {
  navigation: {
    label: '주 메뉴',
    links: [
      { label: '미션', href: '/mission' },
      { label: '회사 소개', href: '/about' },
      { label: '채용', href: '/career' },
      { label: '소식', href: '/news' },
    ],
    contact: '문의하기',
  },
  hero: {
    titleLines: ['성층권을 통한', '인류의 새로운 인프라를 구축합니다'],
    primaryLabel: '지원하기', secondaryLabel: '문의하기',
  },
  altitude: {
    title: '우주와 지상 사이의 새로운 공간',
    description: 'ICARUS는 성층권 비행선을 통해 우주와 지상 사이의 통신 병목을 해소하고 새로운 통신 인프라를 제시합니다',
    rowLabels: {
      leo: '저궤도', leoAlt: '400–700 km',
      stratosphere: '성층권', stratosphereAlt: '20 km',
      troposphere: '대류권', troposphereAlt: '10 km',
      ground: '지상', groundAlt: '0 km', groundStation: '지상 기지국',
    },
    rates: {
      crosslinkKind: '레이저 통신 (FSO)', crosslink: 'Tbps',
      directKind: 'RF 통신', direct: 'Mbps', bottleneck: '통신 병목 발생',
      laserKind: '레이저 통신 (FSO)', laser: 'Tbps',
      relayKind: 'RF 통신', relay: 'Gbps', relayGain: '대역폭 100배',
    },
    directToCell: '단말 직접 연결 가능',
    services: { City: '도시', Mobile: '모바일', Mobility: '모빌리티', Military: '국방' },
    serviceDescription: '단말 직접 연결 서비스',
    airship: '성층권 비행선',
    airshipDescription: '왼쪽을 향하는 청색·은색 비행선. 수평 중심선을 기준으로 대칭인 선체와 꼬리날개, 상단 곡면을 따라 배치된 태양전지로 구성되어 있습니다.',
  },
  endurance: {
    title: '비행선을 다시 혁신합니다',
    description: '기술은 저절로 발전하지 않습니다. ICARUS는 오랫동안 정체되었던 인류의 비행선 기술을 다시 혁신합니다.',
    parts: [
      { name: '기낭 소재', detail: '저중량 고강도 가스차단성 복합 소재' },
      { name: '태양전지', detail: '실리콘 기반 고효율·경량 패널' },
      { name: '추진 장치', detail: '고효율 전기모터 · 프로펠러' },
      { name: '탑재 장비', detail: '통신 중계 안테나 · 레이더 · EO/IR' },
    ],
    north: '북한', south: '대한민국', radiusLabel: '통신 반경',
    capabilities: {
      relay: '통신 중계',
      cost: { emphasis: '10배 저렴한 비용', comparison: '위성 대비' },
      speed: { emphasis: '100배 빠른 속도', comparison: '위성 대비' },
      observation: '관측',
      realtime: '실시간 관측',
      applications: ['해양', '산불', '국방', '환경 모니터링'],
    },
  },
  roadmap: {
    eyebrow: '로드맵', title: '시험 비행에서 상용 서비스까지',
    phases: [
      { phase: '01 단계', title: '소형 비행선 시험 비행', note: '진행 중', current: true },
      { phase: '02 단계', title: '성층권 비행선 시험 비행' },
      { phase: '03 단계', title: '스케일업' },
      { phase: '04 단계', title: '상용 서비스 제공' },
    ],
  },
  contact: {
    title: '지상에서 성층권까지',
    description: '더 높은 곳으로 함께 나아갈 파트너, 운영사, 엔지니어를 찾습니다.',
    secondaryLabel: '채용 안내',
  },
  footer: {
    address: '광주광역시 북구 첨단과기로 123, 광주과학기술원 창업진흥센터 A-318-1',
    copyright: '© 2026 ICARUS LTA. 모든 권리 보유.',
  },
};

export const content = { en, ko };
