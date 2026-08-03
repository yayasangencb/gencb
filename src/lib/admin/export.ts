export function toCsv(rows: Record<string, unknown>[], headers: { key: string; label: string }[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = headers.map((h) => esc(h.label)).join(";");
  const body = rows.map((r) => headers.map((h) => esc(r[h.key])).join(";")).join("\n");
  return `${head}\n${body}`;
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[], headers: { key: string; label: string }[]) {
  const blob = new Blob([`\uFEFF${toCsv(rows, headers)}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function printTable(
  title: string,
  rows: Record<string, unknown>[],
  headers: { key: string; label: string }[],
) {
  const win = window.open("", "_blank", "width=1024,height=768");
  if (!win) return;
  const th = headers.map((h) => `<th>${h.label}</th>`).join("");
  const tr = rows
    .map((r) => `<tr>${headers.map((h) => `<td>${String(r[h.key] ?? "")}</td>`).join("")}</tr>`)
    .join("");
  win.document.write(`<!doctype html><html><head><title>${title}</title><style>
    body{font-family:Inter,system-ui,sans-serif;padding:24px;color:#0b1b3a}
    h1{font-size:18px;margin:0 0 4px}
    p{font-size:12px;color:#555;margin:0 0 16px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{border:1px solid #cbd5e1;padding:6px 8px;text-align:left}
    th{background:#e8f0fe}
  </style></head><body><h1>${title}</h1><p>Yayasan Generasi Cerdas Beraksi (GEN-CB) — dicetak ${new Date().toLocaleString("id-ID")}</p>
  <table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

export function exportPdf(title: string, rows: Record<string, unknown>[], headers: { key: string; label: string }[]) {
  printTable(title, rows, headers);
}

export function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}