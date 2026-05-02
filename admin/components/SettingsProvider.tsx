"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface UserSettings {
  systemName: string;
  city: string;
  firstName: string;
  lastName: string;
  email: string;
  district: string;
}

const defaultSettings: UserSettings = {
  systemName: "SmartBishkek",
  city: "Бишкек",
  firstName: "Аида",
  lastName: "Касымова",
  email: "aida.k@meria.kg",
  district: "Чуй район",
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const SettingsCtx = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sb-user-settings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    setLoaded(true);
  }, []);

  const updateSettings = (updates: Partial<UserSettings>) => {
    const nextSettings = { ...settings, ...updates };
    setSettings(nextSettings);
    localStorage.setItem("sb-user-settings", JSON.stringify(nextSettings));
  };

  if (!loaded) return null; // Avoid hydration mismatch on initial render

  return (
    <SettingsCtx.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsCtx.Provider>
  );
}

export const useSettings = () => useContext(SettingsCtx);
