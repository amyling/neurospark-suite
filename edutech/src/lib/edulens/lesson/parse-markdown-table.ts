export type MarkdownTable = {
  headers: string[];
  rows: string[][];
};

/**
 * Parses a GitHub-style markdown table string into headers and rows.
 */
export function parseMarkdownTable(text: string): MarkdownTable | null {
  const lines = text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("|"));

  if (lines.length < 2) {
    return null;
  }

  const parseRow = (line: string): string[] => {
    const cells = line.split("|").map((cell) => cell.trim());
    if (cells[0] === "") {
      cells.shift();
    }
    if (cells[cells.length - 1] === "") {
      cells.pop();
    }
    return cells;
  };

  const headers = parseRow(lines[0]);
  const separator = lines[1].replace(/\|/g, "").replace(/\s/g, "");
  if (!/^[-:]+$/.test(separator)) {
    return null;
  }

  const rows = lines.slice(2).map(parseRow).filter((row) => row.length > 0);
  if (!headers.length) {
    return null;
  }

  return { headers, rows };
}
