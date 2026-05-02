"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import { StatusPill, CategoryPill } from "@/components/StatusPill";
import { Issue, fetchIssues, IssueStatus } from "@/lib/api";
import { STATUS_TOKENS } from "@/lib/tokens";

const IssueMap = dynamic(() => import("@/components/IssueMap"), { ssr: false });

const STATUS_FILTERS: { key: IssueStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "resolved", label: "Решено" },
];

export default function MapPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const filtered = useMemo(() => {
    let list = issues;
    if (statusFilter !== "all") list = list.filter(i => i.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i =>
        `SB-${String(i.id).padStart(7, "0")}`.toLowerCase().includes(s) ||
        (i.description && i.description.toLowerCase().includes(s))
      );
    }
    return list;
  }, [issues, statusFilter, search]);

  function relTime(d: Date) {
    const s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return `${Math.floor(s)} сек назад`;
    if (s < 3600) return `${Math.floor(s / 60)} мин назад`;
    if (s < 86400) return `${Math.floor(s / 3600)} ч назад`;
    return `${Math.floor(s / 86400)} д назад`;
  }

  return (
    <>
      <TopBar
        title="Карта"
        subtitle={`${filtered.length} заявок на карте${error ? ` · ⚠ ${error}` : ""}`}
      >
        <div style={{ display: "flex", gap: 6, marginLeft: 24 }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              className={`chip ${statusFilter === f.key ? "active" : ""}`}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </TopBar>

      <div className="triage">
        {/* Left panel — Issue list */}
        <div className="triage-list">
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
            <input
              type="text"
              placeholder="Поиск по номеру или описанию…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: 34,
                padding: "0 12px",
                borderRadius: 8,
                border: "1px solid var(--line)",
                background: "var(--surface-alt)",
                color: "var(--text)",
                fontSize: 12,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                Заявок не найдено
              </div>
            )}
            {filtered.map(it => (
              <div
                key={it.id}
                className={`triage-list-row ${selectedId === it.id ? "active" : ""}`}
                onClick={() => setSelectedId(it.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--text)" }}>
                    SB-{String(it.id).padStart(7, "0")}
                  </span>
                  <StatusPill status={it.status} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <CategoryPill category={it.category} />
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {relTime(new Date(it.created_at))}
                  </span>
                </div>
                {it.description && (
                  <div style={{
                    fontSize: 11, color: "var(--text-soft)", marginTop: 6,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {it.description}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--line)",
            fontSize: 11,
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span className="live-dot" />
            Обновляется каждые 10 сек · {filtered.length} из {issues.length}
          </div>
        </div>

        {/* Right panel — Map */}
        <div className="triage-map">
          <IssueMap issues={filtered} />
          {/* Map overlay controls */}
          <div style={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}>
            <div className="map-overlay">
              <button className="active">OSM</button>
              <button>Спутник</button>
            </div>
          </div>
          {/* Issue count badge */}
          <div style={{
            position: "absolute", bottom: 16, left: 16, zIndex: 1000,
            background: "var(--surface)", border: "1px solid var(--line)",
            borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600,
            boxShadow: "0 2px 8px rgba(0,0,0,.1)",
            color: "var(--text)",
          }}>
            📍 {filtered.length} заявок
          </div>
        </div>
      </div>
    </>
  );
}
