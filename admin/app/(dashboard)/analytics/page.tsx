"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import TopBar from "@/components/TopBar";
import { Issue, fetchIssues } from "@/lib/api";
import { C, CATEGORY_TOKENS } from "@/lib/tokens";

export default function AnalyticsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIssues(await fetchIssues());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const total = issues.length;
  const pending = issues.filter(i => i.status === "pending").length;
  const inProgress = issues.filter(i => i.status === "in_progress").length;
  const resolved = issues.filter(i => i.status === "resolved").length;

  // Category breakdown
  const catCounts: Record<string, number> = {};
  for (const i of issues) catCounts[i.category ?? "other"] = (catCounts[i.category ?? "other"] ?? 0) + 1;
  const totalCat = total || 1;

  // Resolution rate
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Avg time (mock — use hours since created)
  const avgResponseHours = issues.length > 0
    ? Math.round(issues.reduce((s, i) => s + (Date.now() - new Date(i.created_at).getTime()) / 3600000, 0) / issues.length)
    : 0;

  // Hourly distribution (mock based on created_at hours)
  const hourDist = Array(24).fill(0);
  for (const i of issues) {
    const h = new Date(i.created_at).getHours();
    hourDist[h]++;
  }
  const maxHour = Math.max(...hourDist, 1);

  // Status pie data
  const statusData = [
    { label: "Новые", value: pending, color: C.amber500 },
    { label: "В работе", value: inProgress, color: C.purple500 },
    { label: "Решено", value: resolved, color: C.success500 },
  ];

  // Weekly mock data
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const weekData = weekDays.map((_, i) => Math.round(total / 7 + Math.sin(i * 1.2) * (total / 14)));
  const maxWeek = Math.max(...weekData, 1);

  return (
    <>
      <TopBar
        title="Аналитика"
        subtitle={`Общая статистика по ${total} заявкам${error ? ` · ⚠ ${error}` : ""}`}
      />

      <div className="content-pad" style={{ overflow: "auto", flex: 1 }}>
        {/* Top KPIs */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          <div className="card card-pad kpi-card">
            <div className="label">Всего заявок</div>
            <div className="value">{total}</div>
          </div>
          <div className="card card-pad kpi-card">
            <div className="label">Решено</div>
            <div className="value" style={{ color: C.success500 }}>{resolutionRate}%</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              {resolved} из {total}
            </div>
          </div>
          <div className="card card-pad kpi-card">
            <div className="label">Среднее время (ч)</div>
            <div className="value">{avgResponseHours}</div>
          </div>
          <div className="card card-pad kpi-card">
            <div className="label">В очереди</div>
            <div className="value" style={{ color: C.amber500 }}>{pending + inProgress}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Status distribution */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Распределение по статусам</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Текущее состояние всех заявок</div>

            {/* Visual bar */}
            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginTop: 20, gap: 2 }}>
              {statusData.map(s => (
                <div key={s.label} style={{
                  flex: s.value,
                  background: s.color,
                  minWidth: s.value > 0 ? 4 : 0,
                }} />
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              {statusData.map(s => (
                <div key={s.label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0",
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ fontSize: 12, color: "var(--text)", flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", width: 40, textAlign: "right" }}>
                    {total > 0 ? Math.round((s.value / total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category distribution */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Категории</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Классификация ML-модели</div>

            <div style={{ marginTop: 20 }}>
              {(["pothole", "garbage", "lighting", "other"] as const).map(id => {
                const cat = CATEGORY_TOKENS[id];
                const val = catCounts[id] ?? 0;
                const pct = val / totalCat;
                return (
                  <div key={id} style={{ marginBottom: 14 }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      fontSize: 12, marginBottom: 6,
                    }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        color: "var(--text)", fontWeight: 600,
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: cat.hue }} />
                        {cat.ru}
                      </span>
                      <span style={{ color: "var(--text-soft)", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                        {val} ({Math.round(pct * 100)}%)
                      </span>
                    </div>
                    <div style={{ height: 6, background: "var(--surface-alt)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        width: `${pct * 100}%`, height: "100%",
                        background: cat.hue, borderRadius: 3,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly distribution */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Почасовое распределение</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Когда поступают заявки</div>

            <div style={{ height: 160, marginTop: 20, display: "flex", alignItems: "flex-end", gap: 2 }}>
              {hourDist.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "100%",
                    height: `${(v / maxHour) * 130}px`,
                    background: v === Math.max(...hourDist) ? C.amber500 : C.navy700,
                    borderRadius: "3px 3px 0 0",
                    minHeight: v > 0 ? 3 : 0,
                    transition: "height 0.3s ease",
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "var(--text-muted)" }}>
              {[0, 6, 12, 18, 23].map(h => (
                <span key={h}>{String(h).padStart(2, "0")}:00</span>
              ))}
            </div>
          </div>

          {/* Weekly distribution */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>По дням недели</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Средняя активность</div>

            <div style={{ marginTop: 20 }}>
              {weekDays.map((day, i) => (
                <div key={day} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "6px 0",
                }}>
                  <span style={{ width: 24, fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>{day}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--surface-alt)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${(weekData[i] / maxWeek) * 100}%`,
                      height: "100%",
                      background: i === 4 || i === 5 ? C.amber500 : C.navy700,
                      borderRadius: 4,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <span className="mono" style={{ width: 24, fontSize: 11, textAlign: "right", color: "var(--text-soft)" }}>
                    {weekData[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
