import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Victor IA</h1>
          <div className="flex gap-4 items-center">
            <Link href="/pricing" className="text-sm hover:underline hidden md:inline">
              Precios
            </Link>
            <button
              onClick={() => document.getElementById('clerk-signin')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm hover:underline hidden md:inline"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="max-w-5xl mx-auto px-4 py-24 md:py-36 text-center">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 mb-6">
          155 especialistas, 45,000+ assets, infinitas posibilidades.
        </p>
        <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
          Agencia IA que trabaja 24/7 sin cansarse
        </h2>
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          El equipo creativo que nunca duerme. Resultados en horas, no en meses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => document.getElementById('clerk-signin')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded font-semibold text-lg hover:shadow-xl transition"
          >
            Iniciar Sesión
          </button>
          <a
            href="mailto:info@victor-ia.com.mx?subject=Quiero%20hablar%20con%20un%20especialista"
            className="px-8 py-4 border border-black dark:border-white rounded font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            Hablar con especialista
          </a>
        </div>
      </section>

      {/* ============ SECTION 1: ¿QUÉ ES VICTOR IA? ============ */}
      <section className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <h3 className="text-3xl md:text-5xl font-bold text-center mb-6">
            ¿Qué es Victor IA?
          </h3>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            No es un bot, es una agencia entera: 155 especialistas trabajando para ti.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Sin */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
              <h4 className="text-sm uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-6 font-semibold">
                Sin
              </h4>
              <ul className="space-y-4">
                {["Salarios", "Cansancio", "Errores"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 flex items-center justify-center border border-gray-400 dark:border-gray-600 rounded-full text-sm shrink-0">
                      ✕
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Con */}
            <div className="p-8 border border-black dark:border-white rounded-2xl bg-black dark:bg-white text-white dark:text-black">
              <h4 className="text-sm uppercase tracking-widest mb-6 font-semibold opacity-70">
                Con
              </h4>
              <ul className="space-y-4">
                {[
                  "24/7 disponible",
                  "Aprendizaje automático",
                  "40-60% más rápido",
                  "95% más barato",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-lg font-medium">
                    <span className="w-6 h-6 flex items-center justify-center border border-white/40 dark:border-black/40 rounded-full text-sm shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "155", label: "Especialistas" },
              { num: "45,000+", label: "Assets" },
              { num: "24/7", label: "Sin parar" },
              { num: "95%", label: "Más barato" },
            ].map((stat) => (
              <div key={stat.label} className="py-6">
                <div className="text-3xl md:text-5xl font-bold mb-2">{stat.num}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 2: LA DIFERENCIA ============ */}
      <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28">
          <h3 className="text-3xl md:text-5xl font-bold text-center mb-16">La Diferencia</h3>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left bg-white dark:bg-black min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="p-5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold"></th>
                  <th className="p-5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold">
                    Agencia Tradicional
                  </th>
                  <th className="p-5 text-sm uppercase tracking-wider font-bold bg-black dark:bg-white text-white dark:text-black">
                    Victor IA
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Equipo",
                    trad: "10-20 personas",
                    via: "155 especialistas IA",
                  },
                  {
                    label: "Tiempo",
                    trad: "Semanas o meses",
                    via: "Horas",
                  },
                  {
                    label: "Costo",
                    trad: "Miles de dólares al mes",
                    via: "Desde $150",
                  },
                  {
                    label: "Disponibilidad",
                    trad: "Horario de oficina",
                    via: "24/7 sin cansarse",
                  },
                  {
                    label: "Aprendizaje",
                    trad: "Capacitación lenta",
                    via: "Aprendizaje automático continuo",
                  },
                  {
                    label: "Escalabilidad",
                    trad: "Contratar más gente",
                    via: "Infinita, al instante",
                  },
                  {
                    label: "Calidad",
                    trad: "Variable según el equipo",
                    via: "Control de calidad en cada entrega",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 0
                        ? "border-b border-gray-200 dark:border-gray-800"
                        : "border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40"
                    }
                  >
                    <td className="p-5 font-semibold">{row.label}</td>
                    <td className="p-5 text-gray-600 dark:text-gray-400">{row.trad}</td>
                    <td className="p-5 font-medium">{row.via}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: CÓMO FUNCIONA ============ */}
      <section className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28">
          <h3 className="text-3xl md:text-5xl font-bold text-center mb-4">Cómo Funciona</h3>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 text-center mb-16">
            5 pasos en 60 minutos
          </p>

          <ol className="space-y-6">
            {[
              { n: "1", title: "Tú pides", time: "1 min" },
              { n: "2", title: "Victor IA planifica", time: "2 min" },
              { n: "3", title: "Especialistas trabajan en paralelo", time: "40 min" },
              { n: "4", title: "Control de calidad", time: "10 min" },
              { n: "5", title: "Sitio LIVE", time: "7 min" },
            ].map((step) => (
              <li
                key={step.n}
                className="flex items-center gap-6 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-md transition bg-white dark:bg-gray-900/40"
              >
                <span className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full text-xl md:text-2xl font-bold shrink-0">
                  {step.n}
                </span>
                <span className="text-lg md:text-2xl font-semibold flex-1">{step.title}</span>
                <span className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-mono shrink-0">
                  {step.time}
                </span>
              </li>
            ))}
          </ol>

          <p className="text-center mt-12 text-2xl md:text-3xl font-bold">
            Total: 60 minutos
          </p>
        </div>
      </section>

      {/* ============ SECTION 4: PRECIOS ============ */}
      <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <h3 className="text-3xl md:text-5xl font-bold text-center mb-16">Precios</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-black flex flex-col">
              <h4 className="text-sm uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-4 font-semibold">
                Starter
              </h4>
              <div className="text-5xl font-bold mb-8">
                $150
              </div>
              <Link
                href="/sign-up"
                className="mt-auto block text-center px-6 py-3 border border-black dark:border-white rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              >
                Empezar
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 border-2 border-black dark:border-white rounded-2xl bg-black dark:bg-white text-white dark:text-black flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white rounded-full text-xs uppercase tracking-widest font-semibold">
                Recomendado
              </span>
              <h4 className="text-sm uppercase tracking-widest opacity-70 mb-4 font-semibold">
                Pro
              </h4>
              <div className="text-5xl font-bold mb-8">
                $500
              </div>
              <Link
                href="/sign-up"
                className="mt-auto block text-center px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded font-semibold hover:shadow-xl transition"
              >
                Empezar
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-black flex flex-col">
              <h4 className="text-sm uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-4 font-semibold">
                Enterprise
              </h4>
              <div className="text-5xl font-bold mb-8">
                Custom
              </div>
              <a
                href="mailto:info@victor-ia.com.mx?subject=Plan%20Enterprise%20Victor%20IA"
                className="mt-auto block text-center px-6 py-3 border border-black dark:border-white rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              >
                Hablar con especialista
              </a>
            </div>
          </div>

          <p className="text-center mt-10 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/pricing" className="underline hover:no-underline">
              Ver detalle completo de planes →
            </Link>
          </p>
        </div>
      </section>

      {/* ============ SECTION 5: CTA FINAL ============ */}
      <section className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-24 md:py-32 text-center">
          <h3 className="text-3xl md:text-6xl font-bold mb-10 leading-tight">
            Tu próximo proyecto empieza hoy.
            <br />
            155 especialistas esperando.
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded font-semibold text-lg hover:shadow-xl transition"
            >
              Ver Demo en Vivo
            </Link>
            <a
              href="mailto:info@victor-ia.com.mx?subject=Quiero%20hablar%20con%20un%20especialista"
              className="px-8 py-4 border border-black dark:border-white rounded font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            >
              Hablar con especialista
            </a>
          </div>
        </div>
      </section>

      {/* ============ SIGN IN SECTION ============ */}
      <section id="clerk-signin" className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-24 md:py-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Accede a tu agencia</h3>
            <p className="text-gray-600 dark:text-gray-400">
              155 especialistas listos para trabajar
            </p>
          </div>

          <div className="flex justify-center">
            <SignIn
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900",
                  formButtonPrimary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100",
                  footerActionLink: "text-blue-600 hover:text-blue-700",
                  dividerLine: "bg-gray-200 dark:bg-gray-800",
                  dividerText: "text-gray-600 dark:text-gray-400",
                  formFieldLabel: "text-gray-900 dark:text-gray-100",
                  formFieldInput: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white",
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2026 Victor IA. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 mt-6">
          <Link href="/pricing" className="hover:underline">
            Precios
          </Link>
          <Link href="/docs" className="hover:underline">
            Docs
          </Link>
          <a href="mailto:info@victor-ia.com.mx" className="hover:underline">
            Contacto
          </a>
        </div>
      </footer>
    </main>
  );
}
