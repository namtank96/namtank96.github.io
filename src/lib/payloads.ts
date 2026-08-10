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

const byStem: Record<string, string> = {};
for (const [path, text] of Object.entries(modules)) {
  const stem = path.split('/').pop()!.replace(/\.md$/, '');
  byStem[stem] = text;
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
