import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 규칙: enum 값은 ASCII, 화면 라벨은 한국어(src/lib/labels.ts).
 * enum 값은 data-* 속성·CSS 셀렉터·쿼리스트링으로 새기 때문에
 * 한글을 넣으면 퍼센트 인코딩과 셀렉터 문제가 생깁니다.
 *
 * 파일명도 ASCII kebab-case 로만 짓습니다. 한글 파일명은
 * Windows(NFC)와 GitHub Actions 러너(NFD)의 유니코드 정규화가 어긋나
 * "로컬 성공, CI 404"를 만드는데, 두 파일명이 눈으로는 똑같이 보여
 * 진단이 대단히 어렵습니다. 한국어는 title 필드에만 씁니다.
 */

const assets = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/assets' }),
  schema: z.object({
    /** 'A01' — 업무 arc 상의 배지 */
    code: z.string().regex(/^A\d{2}$/),
    title: z.string(),
    /** 한 줄 정의. 카드와 meta description 에 그대로 쓰임 */
    summary: z.string().max(120),

    /** 형식 배지 */
    kind: z.enum(['rules', 'prompt', 'subagent', 'template']),
    /** 붙이는 곳: '프로젝트 루트 CLAUDE.md' 등 */
    install: z.string(),

    /** src/payloads/<이 값>.md — 복사 페이로드와 연결하는 키 */
    payload: z.string(),
    /*
     * 분량(줄 수)은 필드로 두지 않습니다. 페이로드를 고칠 때마다 손으로
     * 갱신해야 하고 반드시 어긋납니다. payloadLineCount() 로 계산합니다.
     * — 자산 A02 §4 "갭은 저장하지 않고 계산한다"와 같은 취지
     */

    /** 업무 arc 정렬 순서 */
    order: z.number().int(),

    /*
     * 자산 페이지 11섹션 중 짧은 것들은 프론트매터로 강제합니다.
     * 본문 마크다운에 맡기면 자산마다 순서와 유무가 흔들리는데,
     * 스키마에 박아두면 빠뜨린 자산은 빌드가 거부합니다.
     * 본문에는 긴 것 둘(출력 예시 · 이 규칙의 근거)만 남습니다.
     */
    /** §3 언제 쓰나 — 추상어 금지, 실제 상황으로 */
    whenToUse: z.array(z.string()).min(2).max(4),
    /** §4 안 쓰는 경우 — 신뢰 장치. 해당 없으면 그렇게 적을 것 */
    whenNotToUse: z.string(),
    /** §5 입력 — 최소 입력을 반드시 명시 */
    input: z.string(),
    /** §6 사용법 — 3단계 이내. 넘으면 자산 설계가 잘못된 것 */
    steps: z.array(z.string()).min(1).max(3),
    /** §10 주의점·한계 — 오작동 조건. 과대 판매 방지 */
    caveats: z.array(z.string()).max(3).default([]),
    /** §11 변경 이력 */
    changelog: z
      .array(z.object({ version: z.string(), date: z.coerce.date(), note: z.string() }))
      .min(1),

    version: z.string(),
    updated: z.coerce.date(),

    /** arc 앞뒤 자산 code 2개 */
    related: z.array(z.string()).max(2).default([]),
    featured: z.boolean().default(false),

    /**
     * 기본값이 draft 입니다.
     * public repo 공개는 되돌릴 수 없으므로, 공개는 반드시 의도적인 행위여야 합니다.
     * 살균을 마친 뒤에만 false 로 바꾸세요.
     */
    draft: z.boolean().default(true),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    team: z.string().optional(),

    start: z.coerce.date(),
    /** 없으면 '현재'. current: boolean 같은 두 번째 진실원천을 두지 않습니다. */
    end: z.coerce.date().optional(),

    summary: z.string(),
    highlights: z.array(z.string()).min(1),
    skills: z.array(z.string()).default([]),

    /** 이 역할에서 나온 자산 code 목록 — 경력과 자산을 잇는 증거 링크 */
    assetRefs: z.array(z.string()).default([]),

    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { assets, experience };
