import type { Language } from './language';

export type NewsCategory = 'company' | 'media';
export type NewsFilter = 'all' | NewsCategory;
export type NewsImage = 'newsMaterial' | 'newsAward' | 'newsYtn' | 'newsKepco';

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  date: string;
  image: NewsImage;
  sourceUrl: string;
  medium: 'article' | 'video';
  content: Record<Language, {
    title: string;
    summary: string;
    imageAlt: string;
    sourceLabel: string;
  }>;
}

/** Existing company news, ordered by publication date. Sources open in their original language. */
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
        imageAlt: 'Envelope material production equipment and three reflective material samples',
        sourceLabel: 'ET News',
      },
      ko: {
        title: '비행선 기낭 소재 개발',
        summary: '한국섬유개발연구원과의 협업을 통해 무인 비행선에 적합한 기낭 소재를 개발했습니다.',
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
        imageAlt: 'Participants at the K-Deeptech startup competition award ceremony',
        sourceLabel: 'Unicorn Factory',
      },
      ko: {
        title: 'K-딥테크 왕중왕전 우수상',
        summary: 'K-딥테크 왕중왕전 학생 창업 부문에서 이카루스가 우수상을 수상했습니다.',
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
        imageAlt: 'ICARUS airship technology featured in YTN news coverage',
        sourceLabel: 'YTN',
      },
      ko: {
        title: 'YTN이 소개한 ICARUS',
        summary: '광주미래산업엑스포에서 선보인 이카루스의 기술과 제품이 YTN 뉴스에 소개되었습니다.',
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
        title: 'KEPCO Startup Grand Prize',
        summary: 'ICARUS is awarded the Grand Prize in the startup competition hosted by Korea Electric Power Corporation.',
        imageAlt: 'ICARUS at the Korea Electric Power Corporation startup competition',
        sourceLabel: 'Media Youth',
      },
      ko: {
        title: '한전 창업경진대회 대상',
        summary: '한국전력공사가 주최한 창업경진대회에서 이카루스가 대상을 수상했습니다.',
        imageAlt: '한국전력공사 창업경진대회에 참가한 이카루스',
        sourceLabel: '미디어유스',
      },
    },
  },
];

const en = {
  metadata: {
    title: 'News & updates — ICARUS LTA',
    description: 'Company news, development updates and media coverage from ICARUS LTA.',
  },
  heading: 'News',
  eyebrow: 'NEWSROOM',
  title: ['News &', 'updates.'],
  introduction: 'Progress, perspectives and stories from ICARUS. Follow the work as it takes shape.',
  filtersLabel: 'Filter news by category',
  filters: { all: 'All', company: 'Company', media: 'Media' },
  categories: { company: 'Company', media: 'Media' },
  featured: 'LATEST UPDATE',
  moreStories: 'More from ICARUS',
  article: 'Read article',
  video: 'Watch coverage',
  sourceLanguage: 'Korean',
  newWindow: 'opens in a new tab',
  results: (count: number) => `${count} ${count === 1 ? 'story' : 'stories'}`,
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
  heading: 'News',
  eyebrow: '새로운 소식',
  title: ['ICARUS의', '지금.'],
  introduction: '기술을 만들어가는 과정부터 새로운 만남까지. 이카루스의 발걸음을 전합니다.',
  filtersLabel: '소식 카테고리 선택',
  filters: { all: '전체', company: '기업 소식', media: '언론 보도' },
  categories: { company: '기업 소식', media: '언론 보도' },
  featured: '최근 소식',
  moreStories: '더 많은 이야기',
  article: '기사 읽기',
  video: '보도 영상 보기',
  sourceLanguage: '한국어',
  newWindow: '새 탭에서 열림',
  results: (count: number) => `${count}개의 소식`,
  press: {
    label: '미디어 문의',
    title: '이카루스의 이야기가 궁금하다면.',
    description: '인터뷰, 기업 소개 자료, 취재에 관한 문의를 기다립니다.',
    cta: '문의하기',
  },
};

export const newsContent = { en, ko };
