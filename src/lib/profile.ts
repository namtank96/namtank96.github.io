/**
 * 사이트 전역 프로필.
 *
 * 컬렉션으로 만들지 않은 이유: 엔트리가 하나뿐인 컬렉션은 안티패턴입니다.
 * 매 페이지에서 await getEntry() 를 치를 이유가 없습니다.
 */
export const profile = {
  name: '남윤서',
  role: 'AX 사업개발 · 사업관리',

  /** 홈 히어로 헤드라인 (전환 최적 톤) */
  headline: 'AI에게 시키기 전에, 규격부터 씁니다.',

  /** /assets 인트로 헤드라인 (선언 톤) */
  headlineAssets: '문서를 쓰지 않고, 규격을 씁니다.',

  /** /about 헤드라인 (정확·겸손 톤 — 채용담당자용) */
  headlineAbout: '기획의 판단을 규칙으로 옮깁니다.',

  /** 히어로 부연 2줄 */
  intro: [
    '제안·진단·검토를 사람의 컨디션이 아니라 규격이 보증하게 만듭니다.',
    '실무에서 쓰는 에이전트 운영 규칙을 그대로 복사해 갈 수 있게 공개해 두었습니다.',
  ],

  /** 히어로 하단 증거 한 줄 — 검증 가능한 수치만 */
  proof: ['스펙 문서 100+', '커스텀 서브에이전트 7종', '운영 규칙 리포 3개'],

  email: 'ktds.axbd@gmail.com', // sanitize-ok: 본인이 공개하는 연락처
  github: 'https://github.com/namtank96',
  siteUrl: 'https://namtank96.github.io',

  /** 기본 meta description */
  description:
    'AX 사업개발·사업관리 실무에서 쓰는 에이전트 운영 규칙과 업무 규격을 공개합니다. 읽고 그대로 복사해 가세요.',
} as const;
