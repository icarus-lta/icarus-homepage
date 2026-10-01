import type { Language } from './language';

/** Confirmed by the user for the bilingual contact page. */
export const companyContactEmail = 'contact@icarus-airship.com';

const en = {
  metadata: {
    title: 'Contact — ICARUS LTA',
    description: 'Get in touch with ICARUS. Send us your name, email, subject, and inquiry.',
  },
  title: 'Contact',
  description: 'Questions or proposals?\nWe’d love to hear from you.',
  requiredNote: 'Required fields',
  fields: {
    name: { label: 'Name', placeholder: 'Enter your name', required: 'Enter your name.' },
    email: { label: 'Email', placeholder: 'you@company.com', required: 'Enter your email address.' },
    subject: { label: 'Subject', placeholder: 'What would you like to discuss?', required: 'Enter a subject.' },
    message: { label: 'Message', placeholder: 'Tell us how we can help.', required: 'Enter your message.' },
  },
  invalidEmail: 'Enter a valid email address.',
  replyNote: 'We’ll reply to the email address you provide.',
  submit: 'Send inquiry',
  sending: 'Sending…',
  successTitle: 'Thank you for reaching out.',
  successDescription: 'Your inquiry has been submitted.',
  another: 'Send another inquiry',
  failure: 'Your inquiry could not be sent. Please try again or email us directly.',
  previewNotice: 'Design preview only. Your message has not been sent.',
};

const ko: typeof en = {
  metadata: {
    title: '문의하기 — ICARUS LTA',
    description: 'ICARUS에 궁금한 점이나 제안을 남겨주세요. 이름, 이메일, 문의 제목, 문의 내용을 입력하실 수 있습니다.',
  },
  title: '문의하기',
  description: 'ICARUS에 궁금한 점이나 제안을 남겨주세요.',
  requiredNote: '필수 입력 항목',
  fields: {
    name: { label: '이름', placeholder: '이름을 입력해주세요.', required: '이름을 입력해주세요.' },
    email: { label: '이메일', placeholder: '답변받으실 이메일을 입력해주세요.', required: '이메일을 입력해주세요.' },
    subject: { label: '문의 제목', placeholder: '문의 제목을 입력해주세요.', required: '문의 제목을 입력해주세요.' },
    message: { label: '문의 내용', placeholder: '문의하실 내용을 남겨주세요.', required: '문의 내용을 입력해주세요.' },
  },
  invalidEmail: '올바른 이메일 주소를 입력해주세요.',
  replyNote: '입력하신 이메일로 답변드립니다.',
  submit: '문의하기',
  sending: '전송 중…',
  successTitle: '문의가 접수되었습니다.',
  successDescription: '빠른 시일 내에 회신 드리겠습니다.',
  another: '새 문의 작성',
  failure: '문의가 전송되지 않았습니다. 다시 시도하거나 이메일로 연락해주세요.',
  previewNotice: '디자인 미리보기입니다. 입력하신 내용은 전송되지 않습니다.',
};

export const contactContent = { en, ko } satisfies Record<Language, typeof en>;
