"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import StatCard from "@/components/StatCard";
import { StatusPill, CategoryPill } from "@/components/StatusPill";
import { Issue, fetchIssues } from "@/lib/api";
import { C, CATEGORY_TOKENS } from "@/lib/tokens";

import { useSettings } from "@/components/SettingsProvider";

const SPARKS = [
  "M0 22 L15 18 L30 20 L45 14 L60 16 L75 10 L90 12 L105 8 L120 6",
  "M0 14 L15 16 L30 12 L45 18 L60 14 L75 20 L90 16 L105 22 L120 18",
  "M0 26 L15 22 L30 24 L45 18 L60 14 L75 16 L90 10 L105 8 L120 4",
  "M0 18 L15 16 L30 18 L45 14 L60 16 L75 14 L90 16 L105 14 L120 16",
];

const RANGES = ["Сегодня", "7 дней", "30 дней", "Квартал"];

export default function Dashboard() {
  const { settings } = useSettings();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState(2);

  const load = useCallback(async () => {
    try {
      setIssues(await fetchIssues());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  const counts = {
    todayNew: issues.filter(i => isToday(new Date(i.created_at))).length,
    inProgress: issues.filter(i => i.status === "in_progress").length,
    resolvedMonth: issues.filter(i => i.status === "resolved" && isThisMonth(new Date(i.created_at))).length,
  };

  const days = Array.from({ length: 30 }).map(
    (_, i) => 35 + Math.sin(i * 0.7) * 18 + i * 1.4 + (i % 7 === 0 ? 12 : 0)
  );
  const maxBar = Math.max(...days);

  // category distribution from real data
  const catCounts: Record<string, number> = {};
  for (const i of issues) catCounts[i.category ?? "other"] = (catCounts[i.category ?? "other"] ?? 0) + 1;
  const totalCat = Object.values(catCounts).reduce((a, b) => a + b, 0) || 1;
  const cats = (["pothole", "garbage", "lighting", "other"] as const).map(id => ({
    id,
    label: CATEGORY_TOKENS[id].ru,
    val: catCounts[id] ?? 0,
    pct: (catCounts[id] ?? 0) / totalCat,
  }));

  const recent = issues.slice(0, 8);

  return (
    <>
      <TopBar
        title="Дашборд"
        subtitle={`${settings.city} · все районы · сегодня${error ? ` · ⚠ ${error}` : ""}`}
      >
        <div style={{ display: "flex", gap: 6, marginLeft: 24 }}>
          {RANGES.map((l, i) => (
            <button
              key={l}
              className={`chip ${i === range ? "active" : ""}`}
              onClick={() => setRange(i)}
            >
              {l}
            </button>
          ))}
        </div>
      </TopBar>

      <div className="content-pad" style={{ overflow: "auto", flex: 1 }}>
        <div className="kpi-grid">
          <StatCard label="Новых сегодня" value={counts.todayNew} delta="+12%" deltaPositive spark={SPARKS[0]} />
          <StatCard label="В работе" value={counts.inProgress} delta="+4%" deltaPositive={false} spark={SPARKS[1]} />
          <StatCard label="Решено за месяц" value={counts.resolvedMonth} delta="+22%" deltaPositive spark={SPARKS[2]} />
          <StatCard label="SLA соблюдён" value="87%" delta="+3%" deltaPositive spark={SPARKS[3]} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 16 }}>
          {/* flow chart */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Поток заявок</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  30 дней · подано vs закрыто
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-soft)" }}>
                <Legend color={C.navy700} label="Подано" />
                <Legend color={C.amber500} label="Закрыто" />
              </div>
            </div>
            <div style={{ height: 200, marginTop: 20, display: "flex", alignItems: "flex-end", gap: 4 }}>
              {days.map((v, i) => (
                <div key={i} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", height: `${(v / maxBar) * 100}%`, background: C.navy700, borderRadius: "3px 3px 0 0" }} />
                  <div style={{ width: "100%", height: `${((v * 0.72) / maxBar) * 100}%`, background: C.amber500, borderRadius: "0 0 3px 3px" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--text-muted)" }}>
              <span>1 апр</span><span>10 апр</span><span>20 апр</span><span>30 апр</span>
            </div>
          </div>

          {/* categories */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Категории</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Распределение за месяц</div>
            <div style={{ marginTop: 18 }}>
              {cats.map(cat => (
                <div key={cat.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text)", fontWeight: 600 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_TOKENS[cat.id].hue }} />
                      {cat.label}
                    </span>
                    <span style={{ color: "var(--text-soft)", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                      {cat.val}
                    </span>
                  </div>
                  <div style={{ height: 6, background: "var(--surface-alt)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      width: `${cat.pct * 100}%`, height: "100%",
                      background: CATEGORY_TOKENS[cat.id].hue, borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* live activity */}
        <div className="card" style={{ marginTop: 16, overflow: "hidden" }}>
          <div style={{
            padding: "16px 20px", display: "flex",
            justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid var(--line-soft)",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                Поток · в реальном времени
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="live-dot" /> Live · обновляется каждые 10 сек
              </div>
            </div>
            <Link href="/issues" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              Все заявки →
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Категория</th>
                <th>Координаты</th>
                <th>Статус</th>
                <th>Получено</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map(it => (
                <tr key={it.id}>
                  <td className="mono" style={{ fontSize: 11, fontWeight: 600 }}>SB-{String(it.id).padStart(7, "0")}</td>
                  <td><CategoryPill category={it.category} /></td>
                  <td style={{ color: "var(--text-soft)" }}>
                    <span className="mono">
                      {parseFloat(it.latitude).toFixed(4)}, {parseFloat(it.longitude).toFixed(4)}
                    </span>
                  </td>
                  <td><StatusPill status={it.status} /></td>
                  <td style={{ color: "var(--text-muted)", fontSize: 11 }}>
                    {relTime(new Date(it.created_at))}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`/issues/${it.id}`} style={{ color: "var(--text-muted)" }}>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                    Заявок пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      {label}
    </span>
  );
}

function isToday(d: Date) {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}
function isThisMonth(d: Date) {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth();
}
function relTime(d: Date) {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return `${Math.floor(s)} сек назад`;
  if (s < 3600) return `${Math.floor(s / 60)} мин назад`;
  if (s < 86400) return `${Math.floor(s / 3600)} ч назад`;
  return `${Math.floor(s / 86400)} д назад`;
}
