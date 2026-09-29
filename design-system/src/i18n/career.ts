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
    title: '비행선 기체 설계 엔지니어(Mechanical)',
    field: '신입·경력 · 정규직 · 광주광역시 북구',
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
          { label: '근무지', value: '광주광역시 북구 첨단과기로 123 창업진흥센터 A동', note: '(1인 오피스텔 제공)' },
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
    title: 'Airship Airframe Design Engineer',
    field: 'Entry-level and experienced · Full-time · Buk-gu, Gwangju',
    introductionHeading: 'About ICARUS',
    introductionMission: 'Building a new layer of infrastructure for humanity with stratospheric airships',
    introduction: 'Airframe engineering at ICARUS LTA, developing uncrewed airships for long-duration operations in the stratosphere',
    introductionParagraphs: [
      'ICARUS is developing the world’s first uncrewed stratospheric airship designed to remain aloft for five years or longer, to establish infrastructure including communications and observation networks in the stratosphere.',
      'Airships have long been seen as a technology of the past, with limited innovation compared with other aircraft systems. We aim to turn them into advanced aerial platforms by redesigning their structures, propulsion, control, and operations. We are establishing structures and design criteria for an airship whose answers are still taking shape, then validating those decisions through physical hardware and flight. We are looking for an airframe design engineer to help build this technology from the ground up.',
    ],
    sections: [
      {
        id: 'responsibilities', heading: 'Responsibilities',
        bullets: [
          'Airframe design from major propulsion and power subsystems down to individual components',
          'Structural and layout design, including detailed design based on system requirements',
          'Comparison of design alternatives and ownership of technical decisions considering mass, stiffness, manufacturability, maintainability, and system integration',
          'Machining, assembly, fabrication, and airframe installation of your own part and structural designs',
          'Design verification and iterative improvements based on ground tests, flight tests, and field issues',
          'Interface definition and airframe integration across propulsion, power, control, and aerodynamic systems',
        ],
      },
      {
        id: 'requirements', heading: 'Requirements',
        bullets: [
          'Mechanical, mechanism, or structural design proficiency with 3D CAD tools',
          'Aerospace hardware design experience, including university research, student clubs, or personal projects',
          'Interest in fabricating and verifying your own hardware designs',
          'A problem-solving approach based on defining problems and comparing design alternatives',
          'Ability to explain design intent and the reasoning behind technical decisions',
          'Strong motivation to develop new aircraft systems',
        ],
      },
      {
        id: 'preferred', heading: 'Preferred qualifications',
        bullets: [
          'Hardware development experience with drones, uncrewed aircraft, robots, or mobility systems',
          'Experience with drone-related open-source software such as PX4 or ArduPilot',
          'Aircraft structural, mechanism, or propulsion-system design experience',
          'Experience across the full hardware development process, from design through fabrication and testing',
          'Project or subsystem leadership experience',
          'Documentation of design reviews, test results, and technical decisions',
          'Evaluation of design alternatives and trade-offs between competing requirements',
        ],
      },
      {
        id: 'working', heading: 'Growth opportunities and engineering environment',
        bullets: [
          'Design ownership through participation in defining requirements, design criteria, and implementation methods for a new airship',
          'Experience across concept and detailed design, fabrication, assembly, ground tests, flight tests, and design improvements',
          'Opportunities to lead component and subsystem design and contribute to technical decisions regardless of seniority',
          'Design reviews and practical feedback from PhD experts formerly with the Korea Aerospace Research Institute (KARI)',
          'Broader aircraft systems design skills through collaboration across structures, aerodynamics, propulsion, control, and power',
          'Participation in increasing airframe scale and endurance from small, low-altitude airships toward stratospheric platforms',
          'Opportunities to grow into a core engineering role while establishing company design practices and technical knowledge',
          'Autonomy in selecting parts, equipment, and test resources and proposing and spending development budgets, with larger expenditures reported to the CEO',
        ],
      },
      {
        id: 'conditions', heading: 'Working conditions',
        facts: [
          { label: 'Employment', value: 'Full-time, permanent' },
          { label: 'Location', value: 'Building A, Startup Promotion Center, 123 Cheomdangwagi-ro, Buk-gu, Gwangju' },
          { label: 'Annual pay', value: 'Determined after the interview' },
        ],
      },
      {
        id: 'process', heading: 'Hiring process',
        steps: [
          { title: 'Application review', bullets: [] },
          { title: 'First interview', bullets: [] },
          { title: 'Second interview', bullets: [] },
          { title: 'Terms discussion', bullets: [] },
          { title: 'Final acceptance', bullets: [] },
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
      introduction: 'Airship control engineering at ICARUS LTA, spanning dynamics modeling, control algorithm design, simulation, and flight testing',
      introductionParagraphs: [
        mechanicalDesignRole.en.introductionParagraphs![0],
        'Keeping an airship at its desired attitude and position in wind and other disturbances requires an understanding of its dynamics and control algorithms designed for its specific characteristics. We are looking for an Airship Control Engineer to lead the development cycle from dynamics modeling and simulation to flight testing and improvement. We welcome engineers who have applied control theory to physical hardware in any field, including automotive systems and robotics, to help build a new aircraft system.',
      ],
      sections: [
        {
          id: 'responsibilities', heading: 'Responsibilities',
          bullets: [
            'Development and validation of airship dynamics models using fluid dynamics analysis results',
            'Design of airship attitude and position control algorithms',
            'Simulation-based verification of control performance and algorithm improvement',
            'Application of control algorithms to the physical aircraft and execution of flight tests',
            'Flight-data analysis to identify root causes and lead iterative control algorithm improvements',
            'Coordination of algorithm behavior and interfaces with the PX4 flight-software engineer, including collaboration on porting and verification',
          ],
        },
        {
          id: 'requirements', heading: 'Requirements',
          bullets: [
            'A master’s degree or higher involving control-related research, or expected completion of a master’s degree; no minimum years of experience',
            'Mathematical understanding of control theory',
            'Experience applying control algorithms to physical hardware in any field, including automotive systems, robots, drones, or launch vehicles',
            'Proficiency in C++',
            'Ability to investigate root causes using test results and explain the reasoning behind control-design decisions',
          ],
        },
        {
          id: 'preferred', heading: 'Preferred qualifications',
          bullets: [
            'Control experience with drones, aircraft, launch vehicles, or other flight platforms',
            'Experience with PX4 or ArduPilot',
            'Dynamics modeling and simulation of nonlinear systems',
            'A degree in a control-related field such as aerospace, mechanical, or electrical engineering',
          ],
        },
        {
          id: 'working', heading: 'Growth opportunities and engineering environment',
          bullets: [
            'Participation across the control development cycle, from dynamics modeling and algorithm design to simulation, flight testing, and improvement',
            'Ownership of assigned control algorithms and technical decisions regardless of seniority',
            'Control-related guidance and practical feedback from PhD experts with around 30 years of experience at the Korea Aerospace Research Institute (KARI)',
            'Broader systems understanding and control-design skills through collaboration with fluid dynamics, airframe, and flight-software engineers and technical discussions with the founder',
            'Participation in increasing airframe scale and endurance from small, low-altitude airships toward stratospheric platforms, informed by real operational data',
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
      title: '비행선 기체 설계 엔지니어(Electronics)',
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
      title: 'Airship Electrical & Electronics Engineer',
      introduction: 'Airship electrical and embedded engineering spanning flight-controller interfaces, firmware, PCBs, batteries, and power systems',
      sections: [
        {
          id: 'responsibilities', heading: 'Responsibilities',
          bullets: [
            'Design of airship electrical and embedded systems connecting the flight controller (FC), sensors, actuators, and power equipment',
            'Development of sensor and device communications, drivers, and data acquisition using UART, I2C, SPI, and CAN',
            'MCU firmware development in C/C++ and integration of sensor data and device status with the FC',
            'Selection and integration of commercial modules, with custom interface and power-board schematic design, PCB design, and bring-up as needed',
            'Selection and integration of batteries and battery management systems (BMS), voltage/current/temperature monitoring, and verification of charging, discharging, and protection functions',
            'Power-budget estimation and configuration of power distribution, conversion, protection, wiring, connectors, and harnesses',
            'Investigation of hardware and firmware issues, including communications faults, unstable power, and electromagnetic interference, with improvements based on ground and flight tests',
            'Interface coordination with airframe and flight-control engineers, and documentation of schematics, wiring, communication specifications, and test results',
          ],
        },
        {
          id: 'requirements', heading: 'Requirements',
          bullets: [
            'Firmware development skills for MCUs or embedded systems using C/C++',
            'Device integration experience using at least one of UART, I2C, SPI, or CAN',
            'Foundational understanding of digital, analog, and power circuits',
            'Ability to connect sensors and electronic components and verify operation using schematics and datasheets',
            'Hardware and firmware troubleshooting skills using instruments such as oscilloscopes, logic analyzers, or multimeters',
            'Hands-on embedded-system or electronics development experience, including university research, student clubs, or personal projects',
            'Ability to document technical decision rationale and test results and collaborate across engineering disciplines',
          ],
        },
        {
          id: 'preferred', heading: 'Preferred qualifications',
          bullets: [
            'Sensor-driver development or peripheral integration with flight-control systems such as PX4 or ArduPilot',
            'Schematic and PCB design, fabrication, and board bring-up experience using tools such as KiCad or Altium',
            'Design or integration and verification of batteries, BMS, DC/DC converters, or power-protection circuits',
            'RTOS-based real-time tasks, interrupt handling, and firmware debugging',
            'Electrical integration of drones, uncrewed aircraft, or robots, or integration of motors, ESCs, and actuators',
            'Grounding, shielding, noise mitigation, and electrical harness design',
            'Measurement and test automation and data analysis using Python or similar tools',
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
