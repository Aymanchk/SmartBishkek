"use client";

import { useState, useEffect } from "react";
import {
  Globe, Bell, Shield, Database, Palette, User,
  Save, RefreshCw, Moon, Sun,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import { useTheme } from "@/components/ThemeProvider";
import { useSettings, UserSettings } from "@/components/SettingsProvider";
import { C } from "@/lib/tokens";

interface SettingSection {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const SECTIONS: SettingSection[] = [
  { id: "general", icon: <Globe size={16} />, label: "Основные" },
  { id: "notifications", icon: <Bell size={16} />, label: "Уведомления" },
  { id: "appearance", icon: <Palette size={16} />, label: "Внешний вид" },
  { id: "api", icon: <Database size={16} />, label: "API и данные" },
  { id: "security", icon: <Shield size={16} />, label: "Безопасность" },
  { id: "profile", icon: <User size={16} />, label: "Профиль" },
];

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [activeSection, setActiveSection] = useState("general");
  
  // Local form state for settings
  const [form, setForm] = useState<UserSettings>(settings);
  
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");
  const [refreshInterval, setRefreshInterval] = useState("10");
  const [notifyNew, setNotifyNew] = useState(true);
  const [notifyResolved, setNotifyResolved] = useState(false);
  const [notifySound, setNotifySound] = useState(true);
  const [saved, setSaved] = useState(false);

  // Sync form when settings load from localStorage
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function handleSave() {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setForm(settings);
  }

  const initials = `${settings.firstName.charAt(0)}${settings.lastName.charAt(0)}`.toUpperCase();

  return (
    <>
      <TopBar title="Настройки" subtitle="Конфигурация панели оператора" />

      <div className="content-pad" style={{ overflow: "auto", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
          {/* Section nav */}
          <div className="card" style={{ padding: 8, alignSelf: "start" }}>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "none",
                  background: activeSection === s.id ? C.amber500 : "transparent",
                  color: activeSection === s.id ? "#1A1207" : "var(--text-soft)",
                  fontSize: 13, fontWeight: activeSection === s.id ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {/* Section content */}
          <div>
            {activeSection === "general" && (
              <div className="card card-pad">
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Основные настройки</div>

                <FieldRow label="Название системы">
                  <input
                    type="text"
                    value={form.systemName}
                    onChange={(e) => setForm({ ...form, systemName: e.target.value })}
                    style={inputStyle}
                  />
                </FieldRow>
                <FieldRow label="Город">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    style={inputStyle}
                  />
                </FieldRow>
                <FieldRow label="Язык интерфейса">
                  <select style={inputStyle}>
                    <option>Русский</option>
                    <option>Кыргызча</option>
                    <option>English</option>
                  </select>
                </FieldRow>
                <FieldRow label="Часовой пояс">
                  <select style={inputStyle}>
                    <option>Asia/Bishkek (UTC+6)</option>
                  </select>
                </FieldRow>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="card card-pad">
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Уведомления</div>

                <ToggleRow label="Новые заявки" desc="Уведомлять при поступлении новой заявки" checked={notifyNew} onChange={() => setNotifyNew(!notifyNew)} />
                <ToggleRow label="Решённые заявки" desc="Уведомлять когда заявка решена" checked={notifyResolved} onChange={() => setNotifyResolved(!notifyResolved)} />
                <ToggleRow label="Звуковой сигнал" desc="Воспроизводить звук при уведомлении" checked={notifySound} onChange={() => setNotifySound(!notifySound)} />
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="card card-pad">
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Внешний вид</div>

                <FieldRow label="Тема">
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={theme === "light" ? undefined : toggle}
                      className={`chip ${theme === "light" ? "active" : ""}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <Sun size={14} /> Светлая
                    </button>
                    <button
                      onClick={theme === "dark" ? undefined : toggle}
                      className={`chip ${theme === "dark" ? "active" : ""}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <Moon size={14} /> Тёмная
                    </button>
                  </div>
                </FieldRow>
                <FieldRow label="Шрифт">
                  <select style={inputStyle} defaultValue="Manrope">
                    <option>Manrope</option>
                    <option>Inter</option>
                    <option>Roboto</option>
                  </select>
                </FieldRow>
              </div>
            )}

            {activeSection === "api" && (
              <div className="card card-pad">
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>API и данные</div>

                <FieldRow label="Backend API URL">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={e => setApiUrl(e.target.value)}
                    style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace" }}
                  />
                </FieldRow>
                <FieldRow label="Интервал обновления (сек)">
                  <input
                    type="number"
                    value={refreshInterval}
                    onChange={e => setRefreshInterval(e.target.value)}
                    style={{ ...inputStyle, width: 100 }}
                    min={5}
                    max={300}
                  />
                </FieldRow>
                <FieldRow label="Формат координат">
                  <select style={inputStyle}>
                    <option>Десятичные градусы</option>
                    <option>DMS (градусы, минуты, секунды)</option>
                  </select>
                </FieldRow>
              </div>
            )}

            {activeSection === "security" && (
              <div className="card card-pad">
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Безопасность</div>

                <FieldRow label="Текущий пароль">
                  <input type="password" placeholder="••••••••" style={inputStyle} />
                </FieldRow>
                <FieldRow label="Новый пароль">
                  <input type="password" placeholder="Минимум 8 символов" style={inputStyle} />
                </FieldRow>
                <FieldRow label="Подтвердить пароль">
                  <input type="password" placeholder="Повторите новый пароль" style={inputStyle} />
                </FieldRow>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="card card-pad">
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Профиль оператора</div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: `linear-gradient(135deg, ${C.amber500}, ${C.amber700})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 22, color: "#fff",
                  }}>{initials}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{settings.firstName} {settings.lastName}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Оператор · Мэрия г. {settings.city} · {settings.district}</div>
                  </div>
                </div>

                <FieldRow label="Имя">
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={inputStyle} />
                </FieldRow>
                <FieldRow label="Фамилия">
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={inputStyle} />
                </FieldRow>
                <FieldRow label="Email">
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </FieldRow>
                <FieldRow label="Район ответственности">
                  <input type="text" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} style={inputStyle} />
                </FieldRow>
              </div>
            )}

            {/* Save button */}
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <button
                className="btn-primary"
                style={{ width: "auto", padding: "0 24px" }}
                onClick={handleSave}
              >
                <Save size={16} />
                {saved ? "Сохранено ✓" : "Сохранить"}
              </button>
              <button className="btn-secondary" onClick={handleReset} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={14} />
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  height: 38,
  padding: "0 14px",
  borderRadius: 8,
  border: "1px solid var(--line)",
  background: "var(--surface-alt)",
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  maxWidth: 380,
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 20,
      padding: "14px 0",
      borderBottom: "1px solid var(--line-soft)",
    }}>
      <div style={{ width: 180, fontSize: 13, fontWeight: 600, color: "var(--text)", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 20,
      padding: "14px 0",
      borderBottom: "1px solid var(--line-soft)",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: checked ? C.success500 : "var(--line)",
          border: "none", cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: 9,
          background: "#fff",
          position: "absolute", top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }} />
      </button>
    </div>
  );
}
