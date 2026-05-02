"use client";

import { STATUS_TOKENS, CATEGORY_TOKENS } from "@/lib/tokens";

export function StatusPill({ status }: { status: string }) {
  const s = STATUS_TOKENS[status] ?? STATUS_TOKENS.pending;
  return (
    <span className="pill" style={{ background: s.bg, color: s.fg }}>
      <span className="dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export function CategoryPill({ category }: { category: string | null }) {
  const c = CATEGORY_TOKENS[category ?? "other"] ?? CATEGORY_TOKENS.other;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: c.hue }} />
      {c.ru}
    </span>
  );
}
