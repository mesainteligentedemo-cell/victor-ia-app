# 🎨 Visual Polish Checklist — Victor IA App

## Módulos a Auditar & Pulir

### 1. ✅ Analytics Avanzado (`/dashboard/analytics/advanced`)
- [ ] Responsive: Mobile (< 600px), Tablet (600-899px), Desktop (900px+)
- [ ] Dark mode: todos los colores correctos
- [ ] Charts: responsive, labeling claro, hover states
- [ ] Cards: spacing 8pt grid, borders sutiles, shadows correctas
- [ ] Buttons: estados (default, hover, active, focus)
- [ ] Alerts/Predictions: diseño claro, íconos consistentes
- [ ] Color hierarchy: primario (#000), secundario (#333), terciario (#666)
- [ ] Typography: encabezados, body, labels bien jerarquizados
- [ ] Accessibility: ARIA labels, keyboard navigation, color contrast
- [ ] Animations: transitions suaves (150ms-350ms)
- [ ] Empty states: "No data" message con ícono
- [ ] Loading states: skeleton loaders

**Priority: HIGH** — Este es el módulo más visible para monetización

---

### 2. ✅ Automation/Workflows (`/dashboard/automation`)
- [ ] Tab navigation: active state claro
- [ ] Template cards: hover effect, click feedback
- [ ] Workflow builder: form inputs, step editor
- [ ] Control buttons: play/pause/delete/duplicate estados
- [ ] Status badges: colores diferenciados (pending, running, success, failed)
- [ ] Timeline/execution history: dates, durations formateados
- [ ] Modal: backdrop, centering, close button
- [ ] Responsive grid: mobile → 1 col, tablet → 2 cols, desktop → 3-4 cols
- [ ] Form validation: error messages, visual feedback
- [ ] Confirmations: "Are you sure?" para delete

**Priority: HIGH** — Feature core para automatización

---

### 3. ✅ Agent Memory (`/dashboard/agents/memory`)
- [ ] Sidebar: agent cards con active state
- [ ] Memory items: badges de tipo, confidence bars visuales
- [ ] Learning score: progress bar con color gradient
- [ ] Card design: hover effects, subtle shadows
- [ ] Typography: labels pequeños pero legibles
- [ ] Icons: consistentes, 16-24px size
- [ ] Spacing: 8pt grid en padding/margins
- [ ] States: completed (green), in-progress (blue), locked (gray)
- [ ] Responsive: sidebar collapse en mobile
- [ ] Micro-interactions: hover scale, transitions

**Priority: MEDIUM** — Diferenciador clave

---

### 4. ✅ Skill Trees (`/dashboard/skills`)
- [ ] Tree visualization: nodes claramente diferenciados
- [ ] Level progression: visual distinction (completed, current, locked)
- [ ] XP bars: smooth progress animation
- [ ] Achievement cards: earned vs locked estados
- [ ] Leaderboard: ranking clear, current user highlighted
- [ ] Grid layout: responsive columns
- [ ] Colors: success (green), warning (amber), locked (gray)
- [ ] Icons/Emojis: 24-32px, centered
- [ ] Responsive: single column en mobile

**Priority: MEDIUM** — Gamification es crítica para retención

---

### 5. ✅ API Keys (`/dashboard/api-keys`)
- [ ] Key display: masked input, show/hide toggle
- [ ] Copy button: click feedback, "Copied!" toast
- [ ] Usage bar: color changes por % (green <80%, red >80%)
- [ ] Rate limits: clear display, warning colors
- [ ] Tables: striped rows en alternancia, hover effect
- [ ] Status badges: active (green), inactive (gray)
- [ ] Form inputs: proper styling, validation
- [ ] Delete button: danger state, confirmation needed
- [ ] Endpoints list: method badges (GET/POST colors)

**Priority: HIGH** — Security & integración crítica

---

### 6. ✅ Collaboration (`/dashboard/collaboration`)
- [ ] Project cards: active state bold
- [ ] Team presence: color-coded dots (green online, amber idle, gray offline)
- [ ] Activity feed: timestamps, emoji indicators
- [ ] Tab navigation: responsive, smooth transitions
- [ ] Member list: avatar + status + role clara
- [ ] Buttons: approve/comment/view estados

**Priority: MEDIUM** — Colaboración diferenciador

---

### 7. ✅ Marketplace (`/dashboard/marketplace`)
- [ ] Template cards: hover lift effect, clear CTA
- [ ] Star ratings: gold color, count visible
- [ ] Trending badges: green color, positioned corner
- [ ] Premium badge: gold/amber, distinctive
- [ ] Search box: focus state, clear button
- [ ] Category pills: active state clear
- [ ] Modal: responsive, scrollable content
- [ ] Grid: 1 col mobile, 2 cols tablet, 3 cols desktop

**Priority: MEDIUM** — Revenue stream

---

### 8. ✅ Settings (`/dashboard/settings`)
- [ ] Tab sidebar: active state, icons consistent
- [ ] Form fields: proper labeling, help text small
- [ ] Toggle switches: ON/OFF visual clear
- [ ] Plan cards: current plan highlighted
- [ ] Payment method: card icon + last 4 digits
- [ ] Integrations grid: responsive, one-click buttons
- [ ] Danger zone: red color, confirmation needed
- [ ] Links: underline on hover, color distinction

**Priority: MEDIUM** — User experience completa

---

## Global Visual Standards

### Color Palette
```
Primary: #000000 (Black)
Secondary: #ffffff (White)
Accent: #3b82f6 (Blue)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
```

### Spacing (8pt Grid)
```
xs:  4px
sm:  8px
md: 12px
lg: 16px
xl: 24px
xxl: 32px
```

### Typography
```
Headings: 600-700 weight, line-height 1.2
Body:     400-500 weight, line-height 1.5
Labels:   500-600 weight, line-height 1.4
Sizes:    xs(11px), sm(12px), base(13px), lg(14px), xl(16px), 2xl(20px)
```

### Border Radius
```
xs:  4px
sm:  6px
md:  8px
lg: 12px
xl: 16px
```

### Shadows
```
sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Transitions
```
Fast:  150ms cubic-bezier(0.4, 0, 0.2, 1)
Base:  250ms cubic-bezier(0.4, 0, 0.2, 1)
Slow:  350ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Responsive Breakpoints
```
Mobile:   < 600px  (sidebar 60px, single column layouts)
Tablet:   600-899px (2 column layouts)
Desktop:  ≥ 900px  (full layouts as designed)
```

---

## Accessibility Checklist

### WCAG 2.2 AA Compliance
- [ ] Color contrast: 4.5:1 for text, 3:1 for UI elements
- [ ] Font sizes: minimum 12px, readable
- [ ] Touch targets: minimum 48x48px for mobile
- [ ] Keyboard navigation: Tab order logical, all interactive elements accessible
- [ ] Focus indicators: visible outline, 2px, contrasting color
- [ ] ARIA labels: images, buttons, form fields labeled
- [ ] Semantic HTML: proper heading hierarchy, form structure
- [ ] Skip links: "Skip to content" link present
- [ ] Reduced motion: respects prefers-reduced-motion
- [ ] Color blind: doesn't rely on color alone for meaning

---

## Mobile-First Responsive

### Mobile (< 600px)
- [ ] Sidebar: collapsed to 60px, only icons visible
- [ ] Navigation: stacked vertically
- [ ] Grid layouts: single column
- [ ] Modals: full width minus 20px margins
- [ ] Tables: horizontal scroll OR card layout
- [ ] Touch targets: minimum 44x44px
- [ ] Font sizes: readable without zoom
- [ ] Spacing: 12px instead of 16px for margins

### Tablet (600px - 899px)
- [ ] Grid layouts: 2 columns
- [ ] Sidebar: visible with text
- [ ] Tables: readable without scroll
- [ ] Modals: max-width 90%
- [ ] Two-column layouts: side-by-side

### Desktop (≥ 900px)
- [ ] Full layouts as designed
- [ ] Grid layouts: 3-4 columns
- [ ] Hover effects: enabled
- [ ] Modals: max-width 500px
- [ ] Sidebar: 240px full width

---

## Micro-interactions

### Buttons
- [ ] Hover: border color change, background shift
- [ ] Focus: 2px outline, 2px offset
- [ ] Active: subtle scale (98%)
- [ ] Disabled: opacity 0.5, no cursor

### Cards
- [ ] Hover: border color change, subtle shadow, scale 1.02
- [ ] Focus: outline if interactive
- [ ] Active: background color shift
- [ ] Transition: 150ms ease

### Inputs
- [ ] Focus: blue outline, box-shadow glow
- [ ] Hover: border color change
- [ ] Error: red border, error message visible
- [ ] Valid: green checkmark visible

### Modals
- [ ] Open: fade in (150ms) + slide up (250ms)
- [ ] Close: reverse animation
- [ ] Backdrop: fade in/out

---

## Dark Mode Verification

### Colors Check
- [ ] Background: #0f0f0f (not pure black, avoids eye strain)
- [ ] Bg2: #1a1a1a (subtle lift from bg)
- [ ] Bg3: #252525 (hover states)
- [ ] Borders: #333333 (visible but subtle)
- [ ] Text Primary: #ffffff (good contrast)
- [ ] Text Secondary: #b0b0b0 (still readable)
- [ ] Text Tertiary: #808080 (low emphasis)

### Visual Check
- [ ] No pure white text (fatigue)
- [ ] No pure black background (too harsh)
- [ ] Sufficient contrast ratios maintained
- [ ] Icons visible and clear
- [ ] Charts readable

---

## Quality Assurance Checklist

Before marking "COMPLETE":

- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Tested on mobile devices (real hardware if possible)
- [ ] Screenshot comparisons for before/after
- [ ] Lighthouse score: ≥ 90 (Performance, Accessibility, Best Practices)
- [ ] No console errors or warnings
- [ ] All interactive elements keyboard accessible
- [ ] All images have alt text
- [ ] Loading states show (no blank screens)
- [ ] Error states clear and helpful
- [ ] Animations smooth (60 FPS)
- [ ] Fast animations for impatient users
- [ ] Slow animations for clarity where needed
- [ ] Proper line heights for readability
- [ ] Proper letter spacing for headers

---

## Status by Module

| Módulo | Visual | Mobile | Dark | Accesible | Estado |
|--------|--------|--------|------|-----------|--------|
| Analytics | ⬜ | ⬜ | ⬜ | ⬜ | TODO |
| Workflows | ⬜ | ⬜ | ⬜ | ⬜ | TODO |
| Memory | ⬜ | ⬜ | ⬜ | ⬜ | TODO |
| Skills | ⬜ | ⬜ | ⬜ | ⬜ | TODO |
| API Keys | ⬜ | ⬜ | ⬜ | ⬜ | TODO |
| Collaboration | ⬜ | ⬜ | ⬜ | ⬜ | TODO |
| Marketplace | ⬜ | ⬜ | ⬜ | ⬜ | TODO |
| Settings | ⬜ | ⬜ | ⬜ | ⬜ | TODO |

---

**Este es el checklist que seguiremos para que TODO se vea PERFECTO.**