import type { Language } from './language';

export type NewsCategory = 'company' | 'media';
export type NewsImage = 'newsMaterial' | 'newsAward' | 'newsYtn' | 'newsKepco';

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  date: string;
  image: NewsImage;
  sourceUrl?: string;
  medium?: 'article' | 'video';
  content: Record<Language, {
    title: string;
    summary: string;
    imageAlt: string;
    body: readonly string[];
    sourceLabel?: string;
  }>;
}

/** Company posts with bilingual paragraph content and optional original-source links. */
export const newsArticles: readonly NewsArticle[] = [
  {
    id: 'envelope-materials',
    category: 'company',
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
    category: 'company',
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
    category: 'company',
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
        title: '광주·전남 학생창업경진대회 대상',
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
