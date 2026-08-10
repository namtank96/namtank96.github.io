/** ASCII enum 값 → 화면 라벨. 스키마 주석 참조. */

export const KIND_LABEL = {
  rules: '운영 규칙',
  prompt: '프롬프트',
  subagent: '서브에이전트',
  template: '템플릿',
} as const;

export type Kind = keyof typeof KIND_LABEL;

/** 홈·자산 목록 상단에 그리는 업무 arc. code 순서가 곧 업무 흐름입니다. */
export const ARC = [
  { code: 'A01', step: '운영 기반' },
  { code: 'A06', step: '기회 해체' },
  { code: 'A02', step: '고객 진단' },
  { code: 'A05', step: '경쟁 대조' },
  { code: 'A07', step: '사업성 검증' },
  { code: 'A08', step: '회의 처리' },
  { code: 'A03', step: '품질 감사' },
  { code: 'A04', step: '세션 인계' },
] as const;

export function arcStep(code: string): string | undefined {
  return ARC.find((a) => a.code === code)?.step;
}

/** 2026. 8. 10. 형태 */
export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(d);
}
