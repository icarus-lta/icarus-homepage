import type { Language } from './language';

export type NewsCategory = 'company' | 'media';
export type NewsImage = 'newsMaterial' | 'newsAward' | 'newsYtn' | 'newsKepco' | 'newsDkEmtechMou';

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  /** YYYY-MM when only the month is known; YYYY-MM-DD for dated coverage. */
  date: string;
  image?: NewsImage;
  /** Company detail artwork; company posts use the ICARUS logo by default. */
  companyVisual?: 'ansys' | 'tips' | 'dk-emtech';
  sourceUrl?: string;
  medium?: 'article' | 'video';
  content: Record<Language, {
    title: string;
    summary: string;
    imageAlt?: string;
    body: readonly string[];
    sourceLabel?: string;
  }>;
}

/** Company posts with bilingual paragraph content and optional original-source links. */
export const newsArticles: readonly NewsArticle[] = [
  {
    id: 'didimdol-rd',
    category: 'company',
    date: '2024-10',
    content: {
      ko: {
        title: '디딤돌 R&D',
        summary: '무인 비행선 기술 개발의 기반을 다지는 디딤돌 R&D 소식입니다.',
        body: [
          '2024년 10월, 이카루스는 디딤돌 R&D를 계기로 무인 비행선의 핵심 기술을 체계적으로 검토하고 있습니다. 장시간 공중에 머무는 기체를 만들기 위해서는 부력과 기체 중량의 균형부터 추진, 전력, 제어까지 함께 설계해야 합니다.',
          '설계 단계에서 세운 가정을 제작과 시험으로 확인하고, 확인한 결과를 다시 설계에 반영하는 과정이 중요합니다. 이카루스는 기체 구조와 비행 제어를 따로 보지 않고 하나의 시스템으로 연결해 개발하고 있습니다.',
          '이번 연구개발은 실제 비행선에 적용할 수 있는 기술적 기반을 쌓는 과정입니다. 이후에도 시제품 제작과 검증을 거듭하며 오래 비행할 수 있는 무인 플랫폼의 가능성을 구체화하겠습니다.',
        ],
      },
      en: {
        title: 'Didimdol R&D',
        summary: 'An October 2024 update on the foundations of ICARUS’s unmanned airship research.',
        body: [
          'In October 2024, ICARUS began using Didimdol R&D to examine the core technologies behind its unmanned airship. Long-duration flight calls for a balance of buoyancy and aircraft weight, together with propulsion, power, and control.',
          'Assumptions made during design need to be checked through fabrication and testing, then fed back into the next design. We are developing the aircraft structure and flight-control system as parts of one platform.',
          'This research lays a technical foundation for future aircraft. We will keep refining prototypes and validating the technologies needed for an unmanned platform that can remain aloft for extended periods.',
        ],
      },
    },
  },
  {
    id: 'industry-academia-rd',
    category: 'company',
    date: '2025-02',
    content: {
      ko: {
        title: '산학연 콜라보 R&D',
        summary: '산학연 협력을 바탕으로 무인 비행선 연구개발을 이어갑니다.',
        body: [
          '이카루스는 2025년 2월 산학연 콜라보 R&D를 통해 무인 비행선 연구개발의 협력 기반을 넓혔습니다. 기업의 제작·운용 관점과 학계 및 연구기관의 전문 지식을 연결해 기술 과제를 함께 살펴보는 계기입니다.',
          '무인 비행선은 기낭 소재, 구조, 추진 장치와 비행 제어가 서로 영향을 주는 시스템입니다. 한 분야의 성능만 높여서는 전체 기체의 성능을 판단하기 어렵기에, 설계 조건과 시험 결과를 공유하며 문제를 종합적으로 검토하고자 합니다.',
          '이카루스는 연구에서 얻은 지식을 시제품 제작과 시험에 연결하고, 실제 검증 과정에서 드러나는 과제를 다음 연구에 반영하겠습니다. 이러한 협력을 통해 무인 비행선 기술을 단계적으로 다듬어 가겠습니다.',
        ],
      },
      en: {
        title: 'Industry–academia–research collaborative R&D',
        summary: 'Advancing unmanned airship research through collaboration across industry, academia, and research institutions.',
        body: [
          'In February 2025, ICARUS broadened the collaborative foundation for unmanned airship R&D through an industry, academia, and research program. It brings practical design and operating questions together with specialist research knowledge.',
          'Envelope materials, structures, propulsion, and flight controls all affect one another. Evaluating the whole aircraft requires sharing design assumptions and test results across these fields.',
          'We aim to connect that knowledge with prototype fabrication and testing, then return what we learn to the next research cycle. This step-by-step process will help refine the technologies behind our unmanned airship.',
        ],
      },
    },
  },
  {
    id: 'dk-emtech-mou',
    category: 'company',
    image: 'newsDkEmtechMou',
    companyVisual: 'dk-emtech',
    date: '2025-04',
    content: {
      ko: {
        title: 'DK엠텍과 MOU 체결',
        summary: 'DK엠텍과 업무협약을 맺고 무인 비행선의 활용 가능성을 함께 모색합니다.',
        body: [
          '이카루스는 2025년 4월 DK엠텍과 업무협약(MOU)을 체결했습니다. 양사는 이번 협약을 계기로 각자의 경험을 공유하고, 무인 비행선이 현장에서 어떻게 활용될 수 있을지 함께 논의하기로 했습니다.',
          '비행선 기술이 실제 운용으로 이어지려면 비행 성능뿐 아니라 임무 환경과 사용자의 요구도 이해해야 합니다. 이카루스는 기체 개발 관점에서 필요한 기술과 운용 조건을 검토하고, DK엠텍과 적용 가능성을 살펴보겠습니다.',
          '이번 업무협약은 협력을 시작하기 위한 기반입니다. 구체적인 활용 방안은 이후 논의와 검증을 통해 다듬어 가며, 현장의 요구를 개발 과정에 반영하겠습니다.',
        ],
        imageAlt: 'DK엠텍 업무협약 관련 회의에 참석한 세 사람이 테이블에 앉아 있는 모습',
      },
      en: {
        title: 'MOU signed with DK Emtech',
        summary: 'ICARUS and DK Emtech establish a basis for exploring unmanned airship applications together.',
        body: [
          'ICARUS signed a memorandum of understanding with DK Emtech in April 2025. The agreement opens a discussion about how their respective experience can inform potential applications for unmanned airships.',
          'Putting an aircraft to work in the field requires more than flight performance. Operating conditions and user needs also shape the platform. ICARUS will examine the technical and operational questions with DK Emtech as the discussion develops.',
          'The MOU establishes a basis for cooperation. Specific applications will be refined through further discussion and validation, with field requirements feeding back into our development work.',
        ],
        imageAlt: 'Three participants seated at a table during a meeting related to the DK Emtech MOU',
      },
    },
  },
  {
    id: 'ansys-space-korea-2025',
    category: 'company',
    companyVisual: 'ansys',
    date: '2025-05',
    content: {
      ko: {
        title: 'ANSYS SPACE KOREA 선정',
        summary: '글로벌 기업 협업 프로그램 ANSYS SPACE KOREA에 선정되었습니다.',
        body: [
          '이카루스가 2025년 5월 글로벌 기업 협업 프로그램 ANSYS SPACE KOREA에 선정되었습니다. 이번 선정은 무인 비행선 설계에 필요한 해석과 검증 역량을 발전시킬 수 있는 협력의 계기입니다.',
          '비행선은 큰 기낭을 지닌 저속 항공기로, 공기의 흐름과 구조 하중, 비행 조건을 함께 고려해야 합니다. 설계 단계에서 수치 해석으로 예상한 결과를 실제 제작 및 시험 결과와 비교하면 개선해야 할 지점을 더 분명히 볼 수 있습니다.',
          '이카루스는 이러한 설계와 검증의 반복을 통해 기체에 대한 이해를 높이고자 합니다. 프로그램 참여를 무인 비행선 개발 과정에 적용할 수 있는 실질적인 학습의 기회로 삼겠습니다.',
        ],
      },
      en: {
        title: 'Selected for ANSYS SPACE KOREA',
        summary: 'ICARUS joins the ANSYS SPACE KOREA global corporate collaboration program.',
        body: [
          'ICARUS was selected for the ANSYS SPACE KOREA global corporate collaboration program in May 2025. The selection creates an opportunity to strengthen the analysis and validation work behind our unmanned airship design.',
          'An airship combines a large envelope with low-speed flight, so airflow, structural loads, and operating conditions have to be considered together. Comparing numerical predictions with fabrication and test results helps reveal where a design needs improvement.',
          'We intend to use this program as a practical learning opportunity and continue the cycle of design, testing, and refinement as our aircraft develops.',
        ],
      },
    },
  },
  {
    id: 'seed-investment-2026',
    category: 'company',
    date: '2026-05',
    content: {
      ko: {
        title: '시드 투자 유치',
        summary: '이카루스는 2026년 5월 시드 투자를 유치했습니다.',
        body: [
          '이카루스는 2026년 5월 광주연합기술지주와 지스트홀딩스로부터 시드 투자를 유치했습니다. 무인 비행선의 설계에서 제작, 시험으로 이어지는 개발을 지속할 수 있는 기반을 마련했다는 점에서 뜻깊은 이정표입니다.',
          '이카루스는 기체 구조와 비행 제어 시스템을 함께 개발하고 있습니다. 시제품을 만들고 비행 시험에서 확인한 결과를 다음 설계에 반영하는 과정을 반복하며, 실제 운용에 필요한 신뢰성을 높여가고자 합니다.',
          '이번 투자를 계기로 연구개발의 흐름을 이어가고, 장시간 비행을 위한 핵심 과제를 차근차근 검증하겠습니다. 기술의 완성도를 높이면서 향후 활용 분야를 구체화해 나가겠습니다.',
        ],
      },
      en: {
        title: 'Seed investment secured',
        summary: 'ICARUS secured seed investment in May 2026.',
        body: [
          'ICARUS secured seed investment from Gwangju Technology Holdings and GIST Holdings in May 2026. It marks a milestone in sustaining the work from unmanned airship design through fabrication and testing.',
          'We develop the airframe and flight-control system together. Each prototype and flight test provides evidence that can be fed into the next design, helping us improve the platform for real operating conditions.',
          'The investment supports the continuation of this research and development. We will work through the technical challenges of longer-duration flight and define potential applications as the aircraft matures.',
        ],
      },
    },
  },
  {
    id: 'ansys-space-korea-2026',
    category: 'company',
    companyVisual: 'ansys',
    date: '2026-05',
    content: {
      ko: {
        title: 'ANSYS SPACE KOREA 후속 선정',
        summary: '2025년에 이어 ANSYS SPACE KOREA 후속 프로그램에 선정되었습니다.',
        body: [
          '이카루스가 2026년 5월 ANSYS SPACE KOREA 후속 프로그램에 선정되었습니다. 2025년 선정에 이어 무인 비행선의 설계와 해석을 발전시킬 수 있는 기회를 다시 얻었습니다.',
          '지난 단계에서 다룬 설계 과제를 더 깊이 검토하고, 해석 결과와 제작·시험 과정에서 얻는 관찰을 연결해 나가고자 합니다. 특히 서로 다른 비행 조건에서 기체가 어떻게 반응하는지 이해하는 것은 다음 설계를 위한 중요한 자료가 됩니다.',
          '이카루스는 후속 프로그램을 통해 해석을 개발 과정의 한 부분으로 꾸준히 활용하고, 실제 검증 결과를 바탕으로 설계의 완성도를 높여가겠습니다.',
        ],
      },
      en: {
        title: 'Selected for the ANSYS SPACE KOREA follow-on program',
        summary: 'ICARUS continues its ANSYS SPACE KOREA participation following its 2025 selection.',
        body: [
          'ICARUS was selected for the ANSYS SPACE KOREA follow-on program in May 2026. After our 2025 selection, the program offers another opportunity to develop our airship design and analysis capabilities.',
          'We plan to examine design questions in greater depth and connect simulation results with observations from fabrication and testing. Understanding how the aircraft responds under different flight conditions will inform the next design.',
          'The follow-on program will help us keep analysis within the development cycle and improve our designs using the evidence gathered from physical validation.',
        ],
      },
    },
  },
  {
    id: 'tips-selection-2026',
    category: 'company',
    companyVisual: 'tips',
    date: '2026-09',
    content: {
      ko: {
        title: 'TIPS 선정',
        summary: 'TIPS에 선정되어 무인 비행선 기술 개발의 다음 단계를 이어갑니다.',
        body: [
          '이카루스가 2026년 9월 TIPS에 선정되었습니다. 무인 비행선의 기술적 가능성을 실제로 검증하고 활용 분야를 넓혀가기 위한 연구개발을 이어갈 예정입니다.',
          '장시간 비행을 위해서는 기낭과 구조, 추진과 전력, 자율 비행 제어가 함께 안정적으로 작동해야 합니다. 이카루스는 개별 기술의 성능뿐 아니라 전체 기체가 임무 환경에서 어떤 결과를 내는지 확인하는 데 집중하고 있습니다.',
          '앞으로도 설계, 제작, 비행 시험을 잇는 과정을 통해 기술적 과제를 하나씩 검증하겠습니다. 축적한 결과를 바탕으로 통신 중계와 관측 등 무인 비행선의 활용 가능성을 구체화하겠습니다.',
        ],
      },
      en: {
        title: 'Selected for TIPS',
        summary: 'ICARUS is selected for TIPS as it moves into the next stage of unmanned airship development.',
        body: [
          'ICARUS was selected for TIPS in September 2026. We will continue research and development to validate our unmanned airship technology and explore practical uses for it.',
          'Extended flight depends on the envelope, structure, propulsion, power, and autonomous control working reliably together. We focus on how the complete aircraft performs under operating conditions, as well as on individual components.',
          'By linking design, fabrication, and flight testing, we will work through technical challenges one by one. The results will help define potential uses in communications relay and observation.',
        ],
      },
    },
  },
  {
    id: 'envelope-materials',
    category: 'media',
    date: '2025-12-03',
    image: 'newsMaterial',
    sourceUrl: 'https://www.etnews.com/20251203000330',
    medium: 'article',
    content: {
      en: {
        title: 'New airship envelope material',
        summary: 'ICARUS develops envelope materials for unmanned airships in collaboration with the Korea Textile Development Institute.',
        body: [
          'The collaboration focuses on a lightweight envelope that retains helium and withstands weathering during long-duration flight. These properties are important for maintaining lift and material strength while keeping aircraft mass low.',
          'KTDI combined layers serving different roles, including weather resistance, structural support, and gas retention. The resulting material was developed with high-altitude airship applications in mind.',
        ],
        imageAlt: 'Envelope material production equipment and three reflective material samples',
        sourceLabel: 'ET News',
      },
      ko: {
        title: '비행선 기낭 소재 개발',
        summary: '한국섬유개발연구원과의 협업을 통해 무인 비행선에 적합한 기낭 소재를 개발했습니다.',
        body: [
          '장기체공 비행선의 기낭은 가벼우면서도 헬륨의 누출을 억제하고, 외부 환경에 노출되어도 강도를 유지해야 합니다. 이번 개발은 이러한 조건을 함께 충족하는 소재 확보에 초점을 맞췄습니다.',
          '한국섬유개발연구원은 내후성·하중 지지·가스 차단을 담당하는 층을 결합한 다층 소재를 개발했습니다. 이카루스와의 협업을 통해 고고도 비행선에 활용할 수 있는 기낭 소재의 기반을 마련했습니다.',
        ],
        imageAlt: '기낭 소재 생산 설비와 반사성 소재 시편 세 개',
        sourceLabel: '전자신문',
      },
    },
  },
  {
    id: 'k-deeptech-award',
    category: 'media',
    date: '2025-10-17',
    image: 'newsAward',
    sourceUrl: 'https://www.unicornfactory.co.kr/article/2025101715015176267',
    medium: 'article',
    content: {
      en: {
        title: 'K-Deeptech Excellence Award',
        summary: 'ICARUS receives an Excellence Award in the student startup category at the K-Deeptech competition.',
        body: [
          'ICARUS received the award at the K-Deeptech startup finals held at COEX in Seoul on October 17, 2025. The event brought together university startups to present their research-based technologies and business plans.',
          'ICARUS presented its autonomous airship approach for long-duration maritime monitoring. The coverage also introduced the company’s plan to gather operational data and validate the aircraft before expanding toward communications relay applications.',
        ],
        imageAlt: 'Participants at the K-Deeptech startup competition award ceremony',
        sourceLabel: 'Unicorn Factory',
      },
      ko: {
        title: 'K-딥테크 왕중왕전 우수상',
        summary: 'K-딥테크 왕중왕전 학생 창업 부문에서 이카루스가 우수상을 수상했습니다.',
        body: [
          '이카루스는 2025년 10월 17일 서울 코엑스에서 열린 K-딥테크 스타트업 왕중왕전 결선에 참가했습니다. 대학의 연구 성과를 바탕으로 한 기술과 사업 계획을 소개하는 자리에서 학생창업 부문 우수상을 받았습니다.',
          '이번 보도에서는 장기체공 무인 비행선을 활용한 해양 감시 구상이 소개되었습니다. 실제 운용 데이터를 쌓고 항공 시스템을 검증한 뒤 통신 중계 분야로 확장하려는 개발 방향도 함께 다뤄졌습니다.',
        ],
        imageAlt: 'K-딥테크 창업경진대회 시상식의 참가자들',
        sourceLabel: '유니콘팩토리',
      },
    },
  },
  {
    id: 'ytn-feature',
    category: 'media',
    date: '2025-06-26',
    image: 'newsYtn',
    sourceUrl: 'https://www.ytn.co.kr/_ln/0115_202506262059094515',
    medium: 'video',
    content: {
      en: {
        title: 'ICARUS on YTN',
        summary: 'A look at ICARUS at the Gwangju Future Industry Expo, featured in YTN’s news coverage.',
        body: [
          'YTN’s June 26, 2025 report from the Gwangju Future Industry Expo featured an ICARUS airship transmitting live images of the exhibition floor. The demonstration introduced visitors to an airborne observation platform.',
          'The report discussed maritime and forest monitoring applications, alongside research into airborne communications networks. Founder Jongwon Lee also described the development direction toward longer-duration flight.',
        ],
        imageAlt: 'ICARUS airship technology featured in YTN news coverage',
        sourceLabel: 'YTN',
      },
      ko: {
        title: 'YTN이 소개한 ICARUS',
        summary: '광주미래산업엑스포에서 선보인 이카루스의 기술과 제품이 YTN 뉴스에 소개되었습니다.',
        body: [
          '2025년 6월 26일 YTN의 광주미래산업엑스포 보도에 이카루스가 등장했습니다. 전시장에서는 비행선이 현장의 모습을 실시간 영상으로 전달하며 공중 관측 플랫폼의 활용 모습을 선보였습니다.',
          '보도는 해양·산림 감시와 공중 통신망 연구 등 비행선의 활용 분야를 소개했습니다. 이종원 대표의 인터뷰를 통해 더 오랫동안 비행할 수 있는 항공 시스템을 향한 개발 방향도 전했습니다.',
        ],
        imageAlt: 'YTN 뉴스에 소개된 이카루스의 비행선 기술',
        sourceLabel: 'YTN',
      },
    },
  },
  {
    id: 'kepco-startup-award',
    category: 'media',
    date: '2024-11-17',
    image: 'newsKepco',
    sourceUrl: 'https://www.mediayouth.kr/news/806190',
    medium: 'article',
    content: {
      en: {
        title: 'Grand Prize at Gwangju–Jeonnam Student Startup Competition',
        summary: 'ICARUS wins the Grand Prize with its autonomous airship concept for maritime monitoring.',
        body: [
          'The competition took place on November 14, 2024 at KEPCO’s Energy Technology Research Institute. It was jointly hosted by Gwangju, South Jeolla Province, and KEPCO to support university entrepreneurship in the region.',
          'Ten teams reached the finals following the initial screening. ICARUS, a GIST startup team, presented an autonomous airship for maritime monitoring and received the Grand Prize.',
        ],
        imageAlt: 'ICARUS at the Korea Electric Power Corporation startup competition',
        sourceLabel: 'Media Youth',
      },
      ko: {
        title: '한전 학생창업경진대회 대상',
        summary: '이카루스가 해양 감시용 자율주행 비행선 아이디어로 학생창업경진대회 대상을 수상했습니다.',
        body: [
          '2024년 11월 14일 한국전력공사 에너지기술연구소에서 광주·전남권역 학생창업경진대회가 열렸습니다. 광주광역시·전라남도·한국전력공사가 공동 주최해 지역 대학의 창업 아이디어를 발굴하는 행사입니다.',
          '서류 심사를 거친 10개 팀이 본선에서 각자의 아이디어를 발표했습니다. GIST 학생창업팀인 이카루스는 해양 감시를 위한 자율주행 비행선을 제안해 대상을 받았습니다.',
        ],
        imageAlt: '한국전력공사 창업경진대회에 참가한 이카루스',
        sourceLabel: '미디어유스',
      },
    },
  },
];

const en = {
  metadata: {
    title: 'Newsroom — ICARUS LTA',
    description: 'Company news, development updates and media coverage from ICARUS LTA.',
  },
  heading: 'Newsroom',
  eyebrow: 'NEWSROOM',
  title: ['News &', 'updates.'],
  introduction: 'Progress, perspectives and stories from ICARUS. Follow the work as it takes shape.',
  categories: { company: 'Company', media: 'Media' },
  featured: 'LATEST UPDATE',
  moreStories: 'More from ICARUS',
  article: 'Read more',
  back: 'All news',
  source: 'Related coverage',
  originalArticle: 'Read the original article',
  originalVideo: 'Watch the original report',
  previousArticle: 'Previous post',
  nextArticle: 'Next post',
  articleNavigation: 'More news posts',
  notFound: 'This post could not be found.',
  notFoundDescription: 'Visit the newsroom to browse the latest posts.',
  newWindow: 'opens in a new tab',
  pagination: {
    label: 'News pages',
    previous: 'Previous page',
    next: 'Next page',
    page: (number: number) => `Page ${number}`,
    results: (page: number, total: number, count: number) => `Page ${page} of ${total}, ${count} ${count === 1 ? 'story' : 'stories'}`,
  },
  press: {
    label: 'Media inquiries',
    title: 'A story worth sharing.',
    description: 'For interviews, company information and media inquiries, get in touch with the ICARUS team.',
    cta: 'Contact ICARUS',
  },
};

const ko: typeof en = {
  metadata: {
    title: '새로운 소식 — ICARUS LTA',
    description: '이카루스의 기업 소식과 개발 이야기, 언론 보도를 만나보세요.',
  },
  heading: 'Newsroom',
  eyebrow: '새로운 소식',
  title: ['ICARUS의', '지금.'],
  introduction: '기술을 만들어가는 과정부터 새로운 만남까지. 이카루스의 발걸음을 전합니다.',
  categories: { company: '기업 소식', media: '언론 보도' },
  featured: '최근 소식',
  moreStories: '더 많은 이야기',
  article: '자세히 보기',
  back: '소식 목록',
  source: '관련 보도',
  originalArticle: '원문 기사 보기',
  originalVideo: '원문 영상 보기',
  previousArticle: '이전 글',
  nextArticle: '다음 글',
  articleNavigation: '다른 소식 보기',
  notFound: '게시글을 찾을 수 없습니다.',
  notFoundDescription: '소식 목록에서 다른 게시글을 확인해 주세요.',
  newWindow: '새 탭에서 열림',
  pagination: {
    label: '소식 페이지 이동',
    previous: '이전 페이지',
    next: '다음 페이지',
    page: (number: number) => `${number}페이지`,
    results: (page: number, total: number, count: number) => `전체 ${total}페이지 중 ${page}페이지, 소식 ${count}개`,
  },
  press: {
    label: '미디어 문의',
    title: '이카루스의 이야기가 궁금하다면.',
    description: '인터뷰, 기업 소개 자료, 취재에 관한 문의를 기다립니다.',
    cta: '문의하기',
  },
};

export const newsContent = { en, ko };
