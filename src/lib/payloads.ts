/**
 * 복사 페이로드 로더.
 *
 * src/payloads/*.md 는 컨텐츠 컬렉션이 아닙니다. 렌더링하면 안 되는
 * 원문 그대로의 텍스트라서, Vite 의 ?raw 로 문자열째 읽습니다.
 * (자세한 이유는 CopyBlock.astro 상단 주석 참조)
 */
const modules = import.meta.glob('../payloads/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * 관리자 화면(CMS)에서 페이로드를 저장하면 앞에 빈 프론트매터가 붙을 수 있습니다.
 * 페이로드는 원문 그대로 복사돼야 하므로 그것만 걷어냅니다.
 *
 * 내용이 있는 프론트매터는 건드리지 않습니다 — A03·A09·A12·A13 처럼
 * 서브에이전트 정의를 담은 페이로드는 `---\nname: …\n---` 가 본문의 일부입니다.
 * (그 파일들은 첫 줄이 주석이라 애초에 이 정규식에 걸리지도 않습니다.)
 */
const EMPTY_FRONTMATTER = /^---[ \t]*\r?\n---[ \t]*\r?\n/;

const byStem: Record<string, string> = {};
for (const [path, text] of Object.entries(modules)) {
  const stem = path.split('/').pop()!.replace(/\.md$/, '');
  byStem[stem] = text.replace(EMPTY_FRONTMATTER, '');
}

export function getPayload(stem: string): string {
  const text = byStem[stem];
  if (text === undefined) {
    // 조용히 빈 문자열을 복사하게 두면 "왜 클립보드가 비지?"를
    // 몇 달 뒤에 디버깅하게 됩니다. 빌드에서 바로 터뜨립니다.
    throw new Error(
      `페이로드를 찾을 수 없습니다: src/payloads/${stem}.md\n` +
        `사용 가능: ${Object.keys(byStem).join(', ') || '(없음)'}`,
    );
  }
  return text;
}

export function payloadLineCount(stem: string): number {
  return getPayload(stem).split('\n').length;
}
