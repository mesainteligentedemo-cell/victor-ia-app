// Victor IA â€” Set de iconos SVG custom
// Grid 24px Â· stroke 1.5 Â· currentColor Â· esquinas redondeadas
// Uso: <IconGrid size={16} className="text-black" />

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

function base(props: IconProps) {
  const { size = 16, className = "", strokeWidth = 1.5 } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
}

/* â”€â”€ Set principal (spec) â”€â”€ */

export function IconGrid(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </svg>
  );
}

export function IconDocument(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 3.5h8l4 4V20.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1z" />
      <path d="M14 3.5v4h4" />
      <path d="M8.5 12.5h7M8.5 16h5" />
    </svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.4-5.6A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8.5 11.5h7M8.5 14.5h4" />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 3.5v16a1 1 0 0 0 1 1h16" />
      <path d="M8 16v-5M12.5 16V8M17 16v-3" />
    </svg>
  );
}

export function IconGear(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V19.7a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.12-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H4.3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.12 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.08a1.7 1.7 0 0 0 1.03-1.56V4.3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03h.17a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03z" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

/* â”€â”€ Extras del producto â”€â”€ */

export function IconVideo(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5l5-3v9l-5-3" />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5s1.2-6.2 3.6-8.5z" />
    </svg>
  );
}

export function IconZap(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 2.5L4.5 13.5h6l-1.5 8 8.5-11h-6l1.5-8z" />
    </svg>
  );
}

export function IconPen(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M16.5 3.9a2.1 2.1 0 0 1 3 3L7 19.5l-4 1 1-4L16.5 3.9z" />
      <path d="M14.5 6l3.5 3.5" />
    </svg>
  );
}

export function IconMic(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4M8.5 21.5h7" />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
    </svg>
  );
}
