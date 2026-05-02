"use client";

import { useState } from "react";
import { Users, Phone, Clock, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import TopBar from "@/components/TopBar";
import { C } from "@/lib/tokens";

interface Crew {
  id: number;
  name: string;
  lead: string;
  phone: string;
  district: string;
  members: number;
  status: "available" | "busy" | "offline";
  activeIssues: number;
  resolvedToday: number;
}

const MOCK_CREWS: Crew[] = [
  { id: 1, name: "Бригада «Альфа»",   lead: "Асанов К.",   phone: "+996 555 01-01-01", district: "Ленинский",       members: 4, status: "busy",      activeIssues: 3, resolvedToday: 5 },
  { id: 2, name: "Бригада «Бета»",    lead: "Жумабеков Э.", phone: "+996 555 02-02-02", district: "Октябрьский",     members: 3, status: "available", activeIssues: 0, resolvedToday: 7 },
  { id: 3, name: "Бригада «Гамма»",   lead: "Токтосунов А.", phone: "+996 555 03-03-03", district: "Первомайский",    members: 5, status: "busy",      activeIssues: 2, resolvedToday: 4 },
  { id: 4, name: "Бригада «Дельта»",  lead: "Сыдыков Б.",  phone: "+996 555 04-04-04", district: "Свердловский",    members: 3, status: "offline",   activeIssues: 0, resolvedToday: 0 },
  { id: 5, name: "Бригада «Эпсилон»", lead: "Маматов Т.",  phone: "+996 555 05-05-05", district: "Чуй (пригород)", members: 4, status: "available", activeIssues: 1, resolvedToday: 3 },
];

const STATUS_MAP: Record<Crew["status"], { label: string; color: string; bg: string }> = {
  available: { label: "Свободна", color: C.success700, bg: C.success100 },
  busy:      { label: "Занята",   color: C.amber700,   bg: C.amber100 },
  offline:   { label: "Офлайн",   color: C.danger700,  bg: C.danger100 },
};

export default function CrewsPage() {
  const [crews] = useState<Crew[]>(MOCK_CREWS);
  const [filter, setFilter] = useState<"all" | Crew["status"]>("all");

  const filtered = filter === "all" ? crews : crews.filter(c => c.status === filter);

  const totalActive = crews.reduce((s, c) => s + c.activeIssues, 0);
  const totalResolved = crews.reduce((s, c) => s + c.resolvedToday, 0);
  const available = crews.filter(c => c.status === "available").length;

  return (
    <>
      <TopBar
        title="Бригады"
        subtitle={`${crews.length} бригад · ${available} свободных`}
      >
        <div style={{ display: "flex", gap: 6, marginLeft: 24 }}>
          {(["all", "available", "busy", "offline"] as const).map(f => (
            <button
              key={f}
              className={`chip ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Все" : STATUS_MAP[f].label}
            </button>
          ))}
        </div>
      </TopBar>

      <div className="content-pad" style={{ overflow: "auto", flex: 1 }}>
        {/* Summary KPIs */}
        <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 20 }}>
          <div className="card card-pad kpi-card">
            <div className="label">Бригад на линии</div>
            <div className="value">{crews.filter(c => c.status !== "offline").length}</div>
          </div>
          <div className="card card-pad kpi-card">
            <div className="label">Активных заявок</div>
            <div className="value">{totalActive}</div>
          </div>
          <div className="card card-pad kpi-card">
            <div className="label">Решено сегодня</div>
            <div className="value" style={{ color: C.success500 }}>{totalResolved}</div>
          </div>
        </div>

        {/* Crew cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 16,
        }}>
          {filtered.map(crew => {
            const st = STATUS_MAP[crew.status];
            return (
              <div key={crew.id} className="card" style={{ overflow: "hidden" }}>
                {/* Header */}
                <div style={{
                  padding: "16px 18px",
                  borderBottom: "1px solid var(--line-soft)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.navy700}, ${C.navy900})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.amber500, fontWeight: 800, fontSize: 16,
                  }}>
                    {crew.name.charAt(crew.name.indexOf("«") + 1)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                      {crew.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      Бригадир: {crew.lead}
                    </div>
                  </div>
                  <span className="pill" style={{ background: st.bg, color: st.color }}>
                    <span className="dot" style={{ background: st.color }} />
                    {st.label}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: "14px 18px" }}>
                  {[
                    { icon: <MapPin size={13} />, label: "Район", value: crew.district },
                    { icon: <Users size={13} />, label: "Сотрудников", value: `${crew.members} чел.` },
                    { icon: <Phone size={13} />, label: "Телефон", value: crew.phone },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 0",
                      borderTop: i > 0 ? "1px solid var(--line-soft)" : "none",
                    }}>
                      <span style={{ color: "var(--text-muted)" }}>{row.icon}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{row.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Footer metrics */}
                <div style={{
                  padding: "12px 18px",
                  borderTop: "1px solid var(--line-soft)",
                  display: "flex", gap: 16,
                  background: "var(--surface-alt)",
                }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: crew.activeIssues > 0 ? C.amber500 : "var(--text)" }}>
                      {crew.activeIssues}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Активных</div>
                  </div>
                  <div style={{ width: 1, background: "var(--line)" }} />
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.success500 }}>
                      {crew.resolvedToday}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Решено сегодня</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
            Нет бригад с выбранным статусом
          </div>
        )}
      </div>
    </>
  );
}
