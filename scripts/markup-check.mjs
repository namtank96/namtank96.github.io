#!/usr/bin/env node
/**
 * 빌드 산출물 점검 — 조판용 제어 문자가 화면으로 새는 것을 막습니다.
 *
 * 왜 필요한가:
 * 표제는 `profile.ts` 에서 `|`(줄) 과 `/`(조각) 로 끊어 두고 `headlineLines()` 로
 * 풀어 씁니다. 구분자를 늘리면서 헬퍼만 고치고 호출부를 안 고치면
 * 그 문자가 그대로 렌더됩니다. 실제로 한 번 배포까지 나갔습니다 —
 * 홈 표제가 "제 일은 늘/확정된 게" 로 떴습니다.
 *
 * 사람 기억이 아니라 파이프라인에 둡니다. 이 사이트가 주장하는 원칙 그대로입니다.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
/* 표제·요약처럼 조판 마커를 쓰는 자리. 본문 산문은 대상이 아닙니다 —
 * "문서 → 편집 가능한 덱" 같은 정상 텍스트에 / 가 들어갈 수 있습니다. */
const SEPARATORS = ['|', '/'];
const TAGS = ['h1', 'h2', 'h3'];

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

const strip = (html) => html.replace(/<[^>]+>/g, '');

let violations = 0;
let scanned = 0;

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const tag of TAGS) {
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g');
    for (const m of html.matchAll(re)) {
      scanned += 1;
      /* 마커가 쓰인 자리만 봅니다 — .line / .seg 로 감싼 표제입니다.
       * 감싸는 span 이 있으면 헬퍼를 통과한 것이므로 잔여 구분자는 버그입니다. */
      if (!m[1].includes('class="line"') && !m[1].includes('class="seg"')) continue;
      const text = strip(m[1]);
      const hit = SEPARATORS.find((s) => text.includes(s));
      if (hit) {
        violations += 1;
        console.error(
          `\x1b[31m✗\x1b[0m ${file} <${tag}> 에 구분자 '${hit}' 가 그대로 남았습니다\n    ${text.trim().slice(0, 80)}`,
        );
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n\x1b[31m마크업 게이트 실패\x1b[0m — 구분자 누출 ${violations}건`);
  console.error('headlineLines() 의 분리 문자와 호출부의 렌더 구조가 어긋났습니다.');
  process.exit(1);
}

console.log(`\x1b[32m✓ 마크업 게이트 통과\x1b[0m — 제목 ${scanned}개, 구분자 누출 0건`);
