/** ASCII enum 값 → 화면 라벨. 스키마 주석 참조. */

export const KIND_LABEL = {
  rules: '운영 규칙',
  prompt: '프롬프트',
  subagent: '서브에이전트',
  template: '템플릿',
} as const;

export type Kind = keyof typeof KIND_LABEL;

/** 업종 — 고객사명 대신 쓰는 식별 단위 */
export const INDUSTRY_LABEL = {
  finance: '금융',
  public: '공공',
  manufacturing: '제조',
  education: '교육',
  telco: '통신',
  internal: '사내',
  other: '기타',
} as const;

export type Industry = keyof typeof INDUSTRY_LABEL;

/** 홈·자산 목록 상단에 그리는 업무 arc. code 순서가 곧 업무 흐름입니다. */
export const ARC = [
  { code: 'A01', step: '운영 기반' },
  { code: 'A06', step: '기회 해체' },
  { code: 'A02', step: '고객 진단' },
  { code: 'A05', step: '경쟁 대조' },
  { code: 'A07', step: '사업성 검증' },
  { code: 'A11', step: '보고 준비' },
  { code: 'A08', step: '회의 처리' },
  { code: 'A03', step: '품질 감사' },
  { code: 'A04', step: '세션 인계' },
] as const;

export function arcStep(code: string): string | undefined {
  return ARC.find((a) => a.code === code)?.step;
}

/** 묶음 라벨. 자산이 arc 하나에 다 안 들어가서 나눴습니다. */
export const GROUP_LABEL = {
  flow: '사업개발 업무 흐름',
  ops: '기획 리포 운영',
  build: '산출물 제작',
} as const;

export const GROUP_NOTE = {
  flow: '발굴에서 인계까지, 한 건이 도는 순서대로.',
  ops: '문서가 늘어나면서 뭐가 최신인지 모르겠을 때.',
  build: '덱과 데모를 실제로 만들 때.',
} as const;

export type Group = keyof typeof GROUP_LABEL;
export const GROUP_ORDER: Group[] = ['flow', 'ops', 'build'];

/** 2026. 8. 10. 형태 */
export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(d);
}
