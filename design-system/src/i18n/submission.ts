import type { Language } from './language';
import { SubmissionError } from '../utils/submitForm';

const messages = {
  ko: {
    upload_pending: '첨부파일을 확인하는 데 시간이 걸리고 있습니다. 입력 내용은 유지되니 잠시 후 다시 제출해 주세요.',
    verification_failed: '자동 입력 방지 확인을 완료하지 못했습니다. 잠시 후 다시 제출해 주세요.',
    capacity_reached: '현재 온라인 접수 한도에 도달했습니다. 입력 내용은 유지됩니다. contact@icarus-airship.com으로 보내주시거나 나중에 다시 제출해 주세요.',
    submission_expired: '접수 시간이 만료되었습니다. 입력 내용은 유지되니 다시 제출해 주세요.',
    upload_failed: '첨부파일을 전송하지 못했습니다. 입력 내용은 유지되니 다시 제출해 주세요.',
    service_unavailable: '현재 온라인 접수를 이용할 수 없습니다. 잠시 후 다시 시도하거나 contact@icarus-airship.com으로 보내주세요.',
    rate_limited: '짧은 시간에 여러 번 제출하셨습니다. 잠시 후 다시 시도해 주세요.',
    too_large: '첨부파일 용량이 전송 한도를 초과했습니다. 파일 크기를 줄여 다시 제출해 주세요.',
    invalid_file: '첨부파일을 확인해 주세요. 이력서와 포트폴리오는 PDF 파일로 제출해 주세요.',
    submission_in_progress: '이전 제출을 처리하고 있습니다. 잠시 기다린 후 다시 확인해 주세요.',
  },
  en: {
    upload_pending: 'Your attachments are still being verified. Your entries are still here. Please try again shortly.',
    verification_failed: 'The verification could not be completed. Please try submitting again.',
    capacity_reached: 'Online submissions have reached their current limit. Your entries are still here. Please email contact@icarus-airship.com or try again later.',
    submission_expired: 'Your submission session expired. Your entries are still here. Please submit again.',
    upload_failed: 'Your attachments could not be uploaded. Your entries are still here. Please submit again.',
    service_unavailable: 'Online submissions are currently unavailable. Please try again later or email contact@icarus-airship.com.',
    rate_limited: 'There have been several recent submissions. Please wait before trying again.',
    too_large: 'Your attachments exceed the delivery limit. Please reduce the file sizes and try again.',
    invalid_file: 'Please check your attachments. Use PDF files for your resume and portfolio.',
    submission_in_progress: 'Your previous submission is still being processed. Please wait before trying again.',
  },
};

export function submissionMessage(error: unknown, language: Language, fallback: string) {
  if (!(error instanceof SubmissionError)) return fallback;
  const code = ['file_too_large', 'request_too_large', 'email_too_large'].includes(error.code) ? 'too_large' : error.code;
  return messages[language][code as keyof typeof messages.ko] || fallback;
}
