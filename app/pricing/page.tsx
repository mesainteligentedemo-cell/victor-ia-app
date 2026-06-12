import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-black/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Victor IA</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-sm hover:underline">
              Inicio
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:shadow-lg transition text-sm">
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Precios Claros. Sin Sorpresas.</h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
          155 especialistas trabajando para ti. Desde $150/mes.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Starter */}
          <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Para nuevas empresas</p>

            <div className="mb-8">
              <span className="text-4xl font-bold">$150</span>
              <span className="text-gray-600 dark:text-gray-400">/mes</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>1 sitio web</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>5 especialistas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>Soporte email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>1 actualización/mes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>222 componentes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>45,000+ assets</span>
              </li>
            </ul>

            <Link href="/sign-up" className="w-full block text-center px-6 py-3 border border-gray-200 dark:border-gray-800 rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Comenzar gratis
            </Link>
          </div>

          {/* Pro (Recomendado) */}
          <div className="p-8 border-2 border-black dark:border-white rounded-lg bg-black dark:bg-white text-white dark:text-black transform scale-105">
            <div className="bg-white dark:bg-black text-black dark:text-white px-3 py-1 w-fit rounded text-xs font-bold mb-4">
              RECOMENDADO
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-gray-300 dark:text-gray-600 mb-6">Empresas en crecimiento</p>

            <div className="mb-8">
              <span className="text-4xl font-bold">$500</span>
              <span className="text-gray-300 dark:text-gray-600">/mes</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>3 sitios web</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>15 especialistas</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Soporte 24/7</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>4 actualizaciones/mes</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Análisis mensual</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Aprendizaje automático</span>
              </li>
            </ul>

            <Link href="/sign-up" className="w-full block text-center px-6 py-3 bg-white dark:bg-black rounded font-semibold hover:shadow-lg transition">
              Comenzar ahora
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Agencias y corporativos</p>

            <div className="mb-8">
              <span className="text-4xl font-bold">Custom</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>Sitios ilimitados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>Todos los 155 especialistas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>Soporte 24/7 dedicado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>Actualizaciones ilimitadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>API access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white">✓</span>
                <span>Training incluido</span>
              </li>
            </ul>

            <Link href="mailto:info@victor-ia.com.mx" className="w-full block text-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-lg transition">
              Hablar con especialista
            </Link>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-8">Ahorro Real</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Agencia freelancer</p>
              <p className="text-2xl font-bold">$15,000+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">/mes</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Agencia digital</p>
              <p className="text-2xl font-bold">$25,000+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">/mes</p>
            </div>
            <div className="p-6 bg-black dark:bg-white rounded-lg text-white dark:text-black">
              <p className="mb-2">Victor IA PRO</p>
              <p className="text-2xl font-bold">$500</p>
              <p className="text-sm">Ahorro: 97%</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h3>
        <div className="space-y-6">
          {[
            {
              q: "¿Puedo cancelar cuando quiera?",
              a: "Sí. Sin contratos. Sin penalidades. Cancela cuando quieras."
            },
            {
              q: "¿Cuánto tarda un proyecto?",
              a: "Desde 60 minutos. Un sitio web completo, listo para producción."
            },
            {
              q: "¿Está incluido el hosting?",
              a: "No. Usamos Vercel (recomendado, $0-20/mes). Puedes usar otro."
            },
            {
              q: "¿Hay ajustes ilimitados?",
              a: "Según el plan. Starter: 1/mes. Pro: 4/mes. Enterprise: ilimitados."
            },
            {
              q: "¿Qué es el aprendizaje automático?",
              a: "Cada proyecto enseña al sistema. Proyecto 5 es 25% más rápido que proyecto 1."
            },
            {
              q: "¿Puedo ver una demo?",
              a: "Sí. Haz click en 'Ver Demo en Vivo' o mira nuestro portfolio."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h4 className="font-bold mb-2">{item.q}</h4>
              <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center mb-20">
        <h3 className="text-4xl font-bold mb-6">Tu agencia completa empieza hoy</h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          155 especialistas esperando tu primer brief.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-lg transition">
            Comenzar ahora
          </Link>
          <Link href="mailto:info@victor-ia.com.mx" className="px-8 py-3 border border-gray-200 dark:border-gray-800 rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition">
            Hablar con especialista
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2024 Victor IA. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 mt-6">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Security</a>
        </div>
      </footer>
    </main>
  );
}