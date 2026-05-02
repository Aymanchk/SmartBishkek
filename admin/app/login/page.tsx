"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { C } from "@/lib/tokens";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "smartbishkek2026") {
      document.cookie = "sb_auth=true; path=/; max-age=86400";
      router.push("/");
    } else {
      setError(true);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div className="card" style={{
        width: 380, padding: "32px 40px",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: `linear-gradient(135deg, ${C.amber500}, ${C.amber700})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 24, marginBottom: 20
        }}>S</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>SmartBishkek</h1>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 30 }}>Панель управления оператора</p>

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 11 }} />
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(false); }}
              style={{
                width: "100%", height: 38, padding: "0 14px 0 40px",
                borderRadius: 8, border: `1px solid ${error ? C.danger500 : "var(--line)"}`,
                background: "var(--surface-alt)", color: "var(--text)",
                fontSize: 13, outline: "none",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 11 }} />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              style={{
                width: "100%", height: 38, padding: "0 14px 0 40px",
                borderRadius: 8, border: `1px solid ${error ? C.danger500 : "var(--line)"}`,
                background: "var(--surface-alt)", color: "var(--text)",
                fontSize: 13, outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: 11, color: C.danger500, textAlign: "center", marginTop: -4 }}>
              Неверный логин или пароль
            </div>
          )}

          <button className="btn-primary" type="submit" style={{ marginTop: 8 }}>
            Войти в систему
          </button>
        </form>

        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 24 }}>
          Доступ только для сотрудников мэрии
        </div>
      </div>
    </div>
  );
}
