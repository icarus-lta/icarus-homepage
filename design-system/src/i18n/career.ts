export interface CareerSection {
  id: string;
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  facts?: readonly { label: string; value: string; note?: string }[];
  steps?: readonly { title: string; bullets: readonly string[] }[];
}

export interface CareerRoleContent {
  title: string;
  field: string;
  introduction: string;
  introductionHeading?: string;
  introductionMission?: string;
  introductionParagraphs?: readonly string[];
  tasks?: readonly string[];
  sections?: readonly CareerSection[];
  contact?: { heading: string; bullets: readonly string[]; name: string; email: string };
}

const mechanicalDesignRole: { id: string; ko: CareerRoleContent; en: CareerRoleContent } = {
  id: 'airship-structural-design',
  ko: {
    title: '비행선 기체 설계 엔지니어 (Mechanical)',
    field: '신입·경력 · 정규직 · 전남광주통합특별시 북구',
    introductionHeading: '회사 소개',
    introductionMission: '성층권 비행선을 통한 인류의 새로운 인프라 레이어 구축',
    introduction: '성층권에서 장기간 머무는 무인 비행선을 개발하는 ICARUS LTA의 기체 설계 엔지니어 채용',
    introductionParagraphs: [
      'ICARUS는 성층권에 통신망과 관측망을 비롯한 인프라를 구축하기 위해 인류 최초로 5년 이상 장기 체공하는 성층권 무인 비행선을 개발하고 있습니다.',
      '비행선은 오랫동안 과거의 기술로 인식되며 다른 항공 시스템에 비해 기술적 혁신이 제한되어 왔습니다. 우리는 구조·추진·제어·운용 기술을 새롭게 설계해 비행선을 다시 첨단 항공 플랫폼으로 발전시키고자 합니다. 아직 정답이 정해지지 않은 비행선의 구조와 설계 기준을 세우고, 그 판단을 실제 하드웨어와 비행으로 검증하며 이 기술을 처음부터 함께 만들어갈 기체 설계 엔지니어를 찾습니다.'
    ],
    sections: [
      {
        id: 'responsibilities', heading: '주요 업무',
        bullets: [
          '비행선 기낭·추진·계류 시스템 및 지상운용장비의 기계·기구·구조 설계',
          '시스템 요구조건에 따른 구조·배치 설계 및 상세화',
          '중량·강성·제작성·정비성·시스템 통합을 고려한 설계 대안 비교 및 기술적 의사결정 주도',
          '직접 설계한 부품·구조물의 조립·제작 및 실제 기체 적용',
          '지상·비행시험 결과와 현장 문제를 반영한 설계 검증 및 반복 개선',
        ],
      },
      {
        id: 'requirements', heading: '지원 자격',
        bullets: [
          '학사 이상의 학력',
          '3D CAD 툴을 활용한 기계·기구·구조 설계 역량',
          '학내 연구·동아리·개인 프로젝트 등을 포함한 모빌리티 시스템 하드웨어 설계 경험',
          '자신의 설계를 실제 하드웨어로 제작하고 검증하는 과정에 대한 관심',
          '문제를 정의하고 설계 대안을 비교하며 해법을 찾는 문제 해결 태도',
          '설계 의도와 기술적 판단의 근거를 논리적으로 설명하는 역량',
          '해외여행에 결격사유가 없는 자',
          '남성의 경우 병역필 또는 면제자',
        ],
      },
      {
        id: 'preferred', heading: '우대 사항',
        bullets: [
          '석사 이상의 학력',
          '무인 항공기 구조·기구·추진 시스템 설계 경험',
          '프로젝트 리딩 경험',
          'SRR·PDR·CDR 등 기술 검토 참여 및 설계 문서 작성 경험',
          '최적화 도구 활용 시스템 설계 경험',
        ],
      },
      {
        id: 'working', heading: '성장 기회 및 환경',
        bullets: [
          '새로운 항공 시스템의 요구조건·설계 기준 수립부터 상세 설계, 제작·조립, 지상·비행시험 및 개선까지 기체 개발 전 과정 참여',
          '연차·직급에 관계없이 담당 서브시스템·컴포넌트 설계에 대한 Ownership',
          '30여년 경력의 前 한국항공우주연구원(KARI) 박사급 전문가들과의 설계 리뷰 및 실무 피드백 기회 제공',
          '구조·공력·추진·제어·전력 담당자와의 협업을 통한 항공기 시스템 설계 역량 확장',
          '저고도 소형 비행선부터 성층권 플랫폼까지 기체 규모와 체공 성능을 높이는 개발 과정 참여',
        ],
      },
      {
        id: 'conditions', heading: '근무 조건',
        facts: [
          { label: '고용 형태', value: '정규직' },
          { label: '근무지', value: '전남광주통합특별시 북구 첨단과기로 123 창업진흥센터 A동', note: '(1인 오피스텔 제공)' },
          { label: '연봉 및 스톡옵션', value: '면접 후 결정' },
        ],
      },
      {
        id: 'process', heading: '채용 절차',
        steps: [
          { title: '서류전형', bullets: [] },
          { title: '1차면접', bullets: [] },
          { title: '2차면접', bullets: [] },
          { title: '처우협의', bullets: [] },
          { title: '최종합격', bullets: [] },
        ],
      },
    ],
  },
  en: {
    title: 'Airship Mechanical Design Engineer',
    field: 'Entry-level or experienced · Permanent · Buk-gu, Jeonnam-Gwangju Special Metropolitan City',
    introductionHeading: 'About ICARUS',
    introductionMission: 'Using stratospheric airships to build a new layer of infrastructure for humanity',
    introduction: 'Join ICARUS LTA as an airship design engineer and help develop uncrewed airships for long-duration stratospheric flight',
    introductionParagraphs: [
      'ICARUS is developing what would be the world’s first uncrewed stratospheric airship capable of remaining aloft for at least five years. Our goal is to build infrastructure in the stratosphere, including communications and observation networks.',
      'Long regarded as a technology of the past, airships have seen less innovation than other aircraft. We are rethinking their structures, propulsion, control, and operation to develop them as advanced aerial platforms. We are looking for a design engineer to help define new structural and design standards, test those decisions in hardware and flight, and build this technology from the ground up.',
    ],
    sections: [
      {
        id: 'responsibilities', heading: 'Responsibilities',
        bullets: [
          'Design mechanical systems and structures for the airship envelope, propulsion and mooring systems, and ground support equipment',
          'Develop structural layouts and detailed designs based on system requirements',
          'Evaluate design options and lead technical decisions around weight, stiffness, manufacturability, maintainability, and system integration',
          'Fabricate and assemble the parts and structures you design, then integrate them into the aircraft',
          'Validate and refine designs using ground and flight test results and issues found in the field',
        ],
      },
      {
        id: 'requirements', heading: 'Requirements',
        bullets: [
          'Bachelor’s degree or higher',
          'Proficiency in mechanical and structural design using 3D CAD tools',
          'Experience designing hardware for mobility systems through academic research, student clubs, or personal projects',
          'Interest in building and testing the hardware you design',
          'Ability to define problems, compare design options, and find solutions',
          'Ability to explain your design intent and the reasoning behind technical decisions',
          'Eligibility for international travel',
          'For male applicants, completion of or exemption from mandatory military service',
        ],
      },
      {
        id: 'preferred', heading: 'Preferred qualifications',
        bullets: [
          'Master’s degree or higher',
          'Experience designing structures, mechanisms, or propulsion systems for uncrewed aircraft',
          'Experience leading a project',
          'Experience participating in SRR, PDR, or CDR design reviews and preparing design documents',
          'Experience using optimization tools in system design',
        ],
      },
      {
        id: 'working', heading: 'Growth opportunities',
        bullets: [
          'Work across the full airframe development process, from setting requirements and design standards to detailed design, fabrication, assembly, ground and flight testing, and refinement',
          'Take ownership of the subsystems and components you design, regardless of tenure or title',
          'Receive design reviews and hands-on feedback from former Korea Aerospace Research Institute (KARI) PhD-level experts with more than 30 years of experience',
          'Expand your aircraft systems design skills by working with specialists in structures, aerodynamics, propulsion, control, and power',
          'Help scale our aircraft and extend their endurance, from small low-altitude airships to stratospheric platforms',
        ],
      },
      {
        id: 'conditions', heading: 'Working conditions',
        facts: [
          { label: 'Employment type', value: 'Permanent' },
          { label: 'Work location', value: 'Building A, Startup Promotion Center, 123 Cheomdangwagi-ro, Buk-gu, Jeonnam-Gwangju Special Metropolitan City', note: '(Private studio apartment provided)' },
          { label: 'Salary & stock options', value: 'Discussed after interviews' },
        ],
      },
      {
        id: 'process', heading: 'Hiring process',
        steps: [
          { title: 'Application review', bullets: [] },
          { title: 'First interview', bullets: [] },
          { title: 'Second interview', bullets: [] },
          { title: 'Compensation discussion', bullets: [] },
          { title: 'Final offer', bullets: [] },
        ],
      },
    ],
  },
};

/** Mechanical copy follows the user's supplied draft and disclosure preferences.
 * Electronics shares its introduction and hiring terms, with role-specific content
 * based on the user's scope and .design-sync/ELECTRONICS-JD-REFERENCES.md.
 * Flight control follows the supplied control-algorithm JD while sharing the
 * current employment terms and hiring stages of the other openings. */
export const careerRoles: readonly { id: string; ko: CareerRoleContent; en: CareerRoleContent }[] = [
  {
    id: 'flight-control-sw',
    ko: {
      ...mechanicalDesignRole.ko,
      title: '비행선 제어 엔지니어',
      introduction: '비행선 동역학 모델링부터 제어 알고리즘 설계, 시뮬레이션 및 실기체 비행시험까지 주도할 ICARUS LTA의 비행선 제어 엔지니어 채용',
      introductionParagraphs: [
        mechanicalDesignRole.ko.introductionParagraphs![0],
        'ICARUS LTA는 성층권을 인류의 새로운 인프라 공간으로 개척하는 것을 목표로 합니다. 통신망과 관측망을 비롯한 다양한 시스템을 성층권에 구축하고, 이를 위해 인류 최초로 5년, 10년 동안 한자리에 머무를 수 있는 무인 비행선을 개발하고 있습니다.',
        '성층권 비행선은 보유 에너지의 80%를 위치 유지에 사용합니다. 비행선이 강풍 환경에서 에너지를 최적화하며 잘 제어 될 수 있도록, 무인 비행선의 제어 알고리즘과 제어 SW를 개발합니다.'
      ],
      sections: [
        {
          id: 'responsibilities', heading: '주요 업무',
          bullets: [
            '유체역학 해석 결과를 바탕으로 한 비행선 동역학 모델 구축 및 검증',
            '비행선의 자세·위치 제어 알고리즘 설계',
            '시뮬레이션을 통한 제어 성능 검증 및 알고리즘 개선',
            '설계한 제어 알고리즘의 실기체 적용 및 비행시험 수행',
            '비행 데이터 분석을 통한 문제 원인 규명과 제어 알고리즘의 반복 개선 주도',
          ],
        },
        {
          id: 'requirements', heading: '지원 자격',
          bullets: [
            '석사 이상 또는 그에 준하는 학력',
            'C++/MATLAB/Simulink 활용 역량',
            '제어 이론에 대한 수학적 이해',
            '드론·발사체·모빌리티 시스템의 자세·위치 제어 알고리즘 개발 및 실제 하드웨어에 적용한 경험',
            '드론 관련 오픈소스 SW(PX4, ArduPilot 등) 활용 경험',
            '해외여행에 결격사유가 없는 자',
            '남성의 경우 병역필 또는 면제자',
          ],
        },
        {
          id: 'preferred', heading: '우대 사항',
          bullets: [
            '최적 제어 경험 보유자',
            '동역학 모델링 수립 및 모델 파라미터 식별·검증 관련 경험 보유자',
            'SIL/HIL 환경에서의 제어 알고리즘 검증 경험',
          ],
        },
        {
          id: 'working', heading: '성장 기회 및 환경',
          bullets: [
            '국내 유일·국내 최고의 비행선 제어 SW를 개발할 수 있는 경험',
            '동역학 모델링부터 제어 알고리즘 설계, 시뮬레이션 검증, 실기체 비행시험 및 개선까지 제어 개발 전 과정 참여',
            '30여년 경력의 前 한국항공우주연구원(KARI) 박사급 전문가들의 제어 분야 자문 및 실무 피드백 기회 제공',
            '유체역학 해석·기체 설계·FC SW 담당자와의 협업 및 기술 논의를 통한 시스템 이해와 제어 설계 역량 확장',
            '저고도 소형 비행선부터 성층권 플랫폼까지 실제 운용 데이터를 바탕으로 기체 규모와 체공 성능을 높이는 개발 과정 참여',
          ],
        },
        ...(mechanicalDesignRole.ko.sections ?? []).filter(section => ['conditions', 'process'].includes(section.id)),
      ],
    },
    en: {
      ...mechanicalDesignRole.en,
      title: 'Airship Control Engineer',
      introduction: 'Join ICARUS LTA to lead airship control development, from dynamics modeling and algorithm design to simulation and flight testing',
      introductionParagraphs: [
        mechanicalDesignRole.en.introductionParagraphs![0],
        'We aim to make the stratosphere a new home for infrastructure, from communications to observation networks. To do that, we are developing an uncrewed airship designed to hold position for five to ten years—a world first.',
        'Station-keeping can consume 80% of a stratospheric airship’s available energy. We develop control algorithms and software to keep the aircraft on station in strong winds while using energy efficiently.',
      ],
      sections: [
        {
          id: 'responsibilities', heading: 'Responsibilities',
          bullets: [
            'Build and validate airship dynamics models using fluid dynamics analysis results',
            'Design attitude and position control algorithms for the airship',
            'Use simulation to test control performance and refine algorithms',
            'Deploy control algorithms on the aircraft and conduct flight tests',
            'Analyze flight data, identify causes of issues, and lead iterative improvements to the control algorithms',
          ],
        },
        {
          id: 'requirements', heading: 'Requirements',
          bullets: [
            'Master’s degree or higher, or an equivalent level of education',
            'Proficiency with C++, MATLAB, and Simulink',
            'Strong mathematical understanding of control theory',
            'Experience developing attitude and position control algorithms for drones, launch vehicles, or mobility systems and applying them to physical hardware',
            'Experience using open-source drone software such as PX4 or ArduPilot',
            'Eligibility for international travel',
            'For male applicants, completion of or exemption from mandatory military service',
          ],
        },
        {
          id: 'preferred', heading: 'Preferred qualifications',
          bullets: [
            'Experience with optimal control',
            'Experience building dynamics models and identifying and validating model parameters',
            'Experience validating control algorithms in software-in-the-loop (SIL) or hardware-in-the-loop (HIL) environments',
          ],
        },
        {
          id: 'working', heading: 'Growth opportunities',
          bullets: [
            'Build Korea’s only airship control software and help set a new benchmark for the field',
            'Work across the control development process, from dynamics modeling and algorithm design to simulation, aircraft flight testing, and refinement',
            'Receive control-system guidance and practical feedback from former Korea Aerospace Research Institute (KARI) PhD-level experts with more than 30 years of experience',
            'Build systems knowledge and control-design skills by working with specialists in fluid dynamics, airframe design, and flight-control software',
            'Use real operational data to help scale our aircraft and extend their endurance, from small low-altitude airships to stratospheric platforms',
          ],
        },
        ...(mechanicalDesignRole.en.sections ?? []).filter(section => ['conditions', 'process'].includes(section.id)),
      ],
    },
  },
  mechanicalDesignRole,
  {
    id: 'airship-electrical-electronics',
    ko: {
      ...mechanicalDesignRole.ko,
      title: '비행선 기체 설계 엔지니어 (Electronics)',
      introduction: 'FC·센서 통신, 임베디드 펌웨어, PCB 및 배터리·전원 시스템을 개발할 비행선 전기전자 엔지니어 채용',
      sections: [
        {
          id: 'responsibilities', heading: '주요 업무',
          bullets: [
            '비행 제어 컴퓨터(FC), 센서, 구동부 및 전원 장치를 포함한 비행선 전기전자·임베디드 시스템 설계 및 통합',
            'UART·I2C·SPI·CAN 기반 장치 통신 및 MCU 기반 C/C++ 펌웨어·드라이버 개발',
            '센서 데이터 및 장치 상태의 수집·처리와 FC 연동 시스템 개발',
            'PCB 설계 및 펌웨어 개발',
            '배선·커넥터·하네스 제작 관리 및 조립 감독',
          ],
        },
        {
          id: 'requirements', heading: '지원 자격',
          bullets: [
            '학사 이상의 학력',
            'PCB 설계 툴 활용 역량(KiCad·Altium 등)',
            '학내 연구·동아리·개인 프로젝트 등을 포함한 실제 임베디드 시스템 또는 전자 하드웨어 개발 경험',
            'UART·I2C·SPI·CAN 등 통신 인터페이스를 활용한 장치 연동 경험',
            '오실로스코프·멀티미터 등 계측기를 활용한 하드웨어·펌웨어 문제 원인 분석 역량',
            '기술적 판단의 근거와 시험 결과를 문서화하고 다른 분야의 엔지니어와 협업하는 역량',
            '해외여행에 결격사유가 없는 자',
            '남성의 경우 병역필 또는 면제자',
          ],
        },
        {
          id: 'preferred', heading: '우대 사항',
          bullets: [
            'PX4·ArduPilot 관련 시스템 연동 경험',
            '배터리·전원 분배·DC/DC 컨버터 등 전력 시스템 설계 및 통합 경험',
            '드론·모빌리티·로봇 시스템의 임베디드 시스템 개발 경험',
          ],
        },
        ...(mechanicalDesignRole.ko.sections ?? []).filter(section => ['working', 'conditions', 'process'].includes(section.id)),
      ],
    },
    en: {
      ...mechanicalDesignRole.en,
      title: 'Airship Electrical and Electronics Engineer',
      introduction: 'Join ICARUS LTA to develop flight-controller and sensor communications, embedded firmware, PCBs, batteries, and power systems',
      sections: [
        {
          id: 'responsibilities', heading: 'Responsibilities',
          bullets: [
            'Design and integrate airship electrical and embedded systems, including the flight-control computer (FC), sensors, actuators, and power equipment',
            'Develop device communications over UART, I2C, SPI, and CAN, as well as MCU firmware and drivers in C/C++',
            'Build systems that collect and process sensor data and device status and interface with the FC',
            'Design PCBs and develop firmware',
            'Oversee the fabrication and assembly of wiring, connectors, and harnesses',
          ],
        },
        {
          id: 'requirements', heading: 'Requirements',
          bullets: [
            'Bachelor’s degree or higher',
            'Proficiency with PCB design tools such as KiCad or Altium',
            'Hands-on embedded-system or electronic hardware development experience through academic research, student clubs, or personal projects',
            'Experience integrating devices through communication interfaces such as UART, I2C, SPI, or CAN',
            'Ability to troubleshoot hardware and firmware using instruments such as oscilloscopes and multimeters',
            'Ability to document technical decisions and test results and collaborate with engineers in other disciplines',
            'Eligibility for international travel',
            'For male applicants, completion of or exemption from mandatory military service',
          ],
        },
        {
          id: 'preferred', heading: 'Preferred qualifications',
          bullets: [
            'Experience integrating systems with PX4 or ArduPilot',
            'Experience designing and integrating power systems, including batteries, power distribution, and DC/DC converters',
            'Experience developing embedded systems for drones, mobility platforms, or robots',
          ],
        },
        ...(mechanicalDesignRole.en.sections ?? []).filter(section => ['working', 'conditions', 'process'].includes(section.id)),
      ],
    },
  },
] as const;

export const careerContent = {
  ko: {
    heading: '채용 공고',
    introduction: 'ICARUS와 함께할 동료를 찾습니다.',
    all: '전체',
    deadline: '채용 시 마감',
    back: '채용 목록',
    share: '공유',
    apply: '지원하기',
    copied: '링크가 복사되었습니다.',
    copyFailed: '링크를 복사하지 못했습니다. 주소창의 링크를 복사해 주세요.',
    actions: '채용 공고 공유 및 지원',
    overview: '직무 소개',
    tasks: '주요 업무',
    notice: '상세 채용 조건과 지원 방법은 추후 안내합니다.',
    metadata: {
      title: '채용 — ICARUS LTA',
      description: 'ICARUS의 비행선 제어, 기체 설계, 전기전자 엔지니어 직무를 확인하세요.',
    },
  },
  en: {
    heading: 'Open positions',
    introduction: 'Join the team at ICARUS.',
    all: 'All positions',
    deadline: 'Open until filled',
    back: 'All positions',
    share: 'Share',
    apply: 'Apply now',
    copied: 'Link copied.',
    copyFailed: 'Could not copy the link. Please copy it from the address bar.',
    actions: 'Share or apply for this position',
    overview: 'About the role',
    tasks: 'Responsibilities',
    notice: 'Hiring requirements and application details will be announced later.',
    metadata: {
      title: 'Careers — ICARUS LTA',
      description: 'Explore airship control, airframe design, and electrical engineering roles at ICARUS.',
    },
  },
} as const;
