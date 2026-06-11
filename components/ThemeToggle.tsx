"use client";

import { useState, useEffect } from "react";
import { IconSun, IconMoon } from "./Icons";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("vi-theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
    else if (document.documentElement.classList.contains("light")) setTheme("light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.classList.toggle("light", next === "light");
    localStorage.setItem("vi-theme", next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 300);
  }

  return (
    <button
      onClick={toggle}
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
      className="p-2 rounded-lg text-warm-45 hover:text-warm hover:bg-warm-5 transition-all"
    >
      {/* Evita mismatch de hidratación: icono fijo hasta montar */}
      {!mounted || theme === "dark" ? <IconSun size={15} /> : <IconMoon size={15} />}
    </button>
  );
}