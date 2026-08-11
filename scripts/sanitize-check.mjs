/**
 * 살균 게이트 — 금칙어가 하나라도 있으면 빌드를 실패시킵니다.
 *
 * package.json 의 `prebuild` 로 걸려 있어 `npm run build` 앞에 자동 실행되고,
 * GitHub Actions 의 배포 빌드에서도 똑같이 돕니다.
 * 즉 사내 정보가 섞인 커밋은 푸시돼도 사이트로 나가지 못합니다.
 *
 * 예외 처리: 라인 끝에 `# sanitize-ok: <사유>` 주석을 달면 그 줄은 통과합니다.
 * 경력 페이지의 전 직장 공개 성과 수치(MAU 등)처럼 의도적으로 남기는 값에만 쓰세요.
 */
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { relative } from 'node:path';
import { FORBIDDEN, SCAN_GLOBS, IGNORE_GLOBS } from './forbidden.mjs';

const ROOT = process.cwd();
const ALLOW_MARKER = /sanitize-ok:/;

const files = [];
for (const pattern of SCAN_GLOBS) {
  for await (const entry of glob(pattern, { cwd: ROOT, exclude: IGNORE_GLOBS })) {
    files.push(entry);
  }
}

const violations = [];

for (const file of [...new Set(files)].sort()) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (ALLOW_MARKER.test(line)) return;

    for (const rule of FORBIDDEN) {
      rule.re.lastIndex = 0;
      const hits = line.match(rule.re);
      if (hits) {
        violations.push({
          file: relative(ROOT, file).replace(/\\/g, '/'),
          line: i + 1,
          rule: rule.id,
          why: rule.why,
          hits: [...new Set(hits)].join(', '),
          text: line.trim().slice(0, 100),
        });
      }
    }
  });
}

/*
 * 추가 검사: `# sanitize-ok` 가 YAML 블록 스칼라(`>-`, `|`) 안에 들어간 경우.
 * 블록 스칼라 안에서 `#` 은 주석이 아니라 본문입니다. 그대로 화면에 찍힙니다.
 * 실제로 한 번 새어나갔던 사고라 기계로 막습니다.
 */
const BLOCK_START = /^[\w-]+:\s*[>|][-+]?\s*$/;

for (const file of [...new Set(files)].sort()) {
  if (!file.endsWith('.md')) continue;
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  let inBlock = false;
  text.split(/\r?\n/).forEach((line, i) => {
    if (BLOCK_START.test(line)) {
      inBlock = true;
      return;
    }
    if (inBlock && line.trim() !== '' && !/^\s\s/.test(line)) inBlock = false;
    if (inBlock && line.includes('sanitize-ok')) {
      violations.push({
        file: relative(ROOT, file).replace(/\\/g, '/'),
        line: i + 1,
        rule: 'rendered-comment',
        why: 'YAML 블록 스칼라 안의 #은 주석이 아니라 본문입니다. 화면에 그대로 찍힙니다.',
        hits: 'sanitize-ok',
        text: line.trim().slice(0, 100),
      });
    }
  });
}

if (violations.length === 0) {
  console.log(`\x1b[32m✓ 살균 게이트 통과\x1b[0m — ${files.length}개 파일, 금칙어 0건`);
  process.exit(0);
}

console.error(`\n\x1b[41m\x1b[30m 살균 게이트 실패 \x1b[0m 금칙어 ${violations.length}건\n`);
for (const v of violations) {
  console.error(`  \x1b[36m${v.file}:${v.line}\x1b[0m  [${v.rule}] \x1b[33m${v.hits}\x1b[0m`);
  console.error(`    ${v.why}`);
  console.error(`    \x1b[2m${v.text}\x1b[0m\n`);
}
console.error('  일반화해서 다시 쓰거나, 의도한 노출이면 그 줄 끝에 `sanitize-ok: 사유` 를 다세요.\n');
process.exit(1);
