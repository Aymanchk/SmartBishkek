"use client";

import { C } from "@/lib/tokens";

export default function StatCard({
  label, value, delta, deltaPositive, spark,
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  spark?: string;
}) {
  return (
    <div className="card card-pad kpi-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="label">{label}</span>
        {delta && (
          <span className={`kpi-delta ${deltaPositive ? "up" : "down"}`}>
            <span style={{ fontSize: 9 }}>{deltaPositive ? "▲" : "▼"}</span>
            {delta}
          </span>
        )}
      </div>
      <div className="value">{value}</div>
      {spark && (
        <svg width="100%" height="32" viewBox="0 0 120 32" style={{ marginTop: 8 }}>
          <path d={spark} fill="none" stroke={C.amber500} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
          <path d={`${spark} L 120 32 L 0 32 Z`} fill={C.amber500} opacity="0.1" />
        </svg>
      )}
    </div>
  );
}
