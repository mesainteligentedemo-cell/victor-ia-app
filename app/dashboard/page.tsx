import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 p-6 sticky top-0 bg-white dark:bg-black/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Victor IA</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tu agencia creativa IA</p>
          </div>
          <UserButton />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Bienvenido a tu agencia</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">155 especialistas listos para trabajar en tu próximo proyecto</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Plan actual</p>
            <p className="text-2xl font-bold">PRO</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">3 sitios web activos</p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Especialistas disponibles</p>
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Trabajando 24/7</p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Proyectos completados</p>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Comienza tu primero hoy</p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Assets disponibles</p>
            <p className="text-2xl font-bold">45K+</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Componentes + imágenes</p>
          </div>
        </div>

        {/* New Project CTA */}
        <div className="mb-8 p-8 border-2 border-black dark:border-white rounded-lg bg-black dark:bg-white text-white dark:text-black">
          <h3 className="text-2xl font-bold mb-3">Crear nuevo proyecto</h3>
          <p className="mb-6 text-gray-200 dark:text-gray-800">
            Cuéntale a Victor IA qué necesitas. En 60 minutos, tendrás un sitio web completo, hermoso y seguro.
          </p>
          <input
            type="text"
            placeholder='Ej: "Sitio web luxury para Costa Negra"'
            className="w-full px-4 py-3 rounded bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 mb-4"
          />
          <button className="px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded font-semibold hover:shadow-lg transition w-full">
            Comenzar proyecto →
          </button>
        </div>

        {/* 155 Especialistas */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Tu equipo: 155 especialistas en 27 categorías</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { cat: "Diseño & Creatividad", count: "40 especialistas", icon: "🎨" },
              { cat: "Video & Audio", count: "15 especialistas", icon: "🎬" },
              { cat: "Seguridad", count: "38 especialistas", icon: "🔐" },
              { cat: "Automatización", count: "15 especialistas", icon: "⚙️" },
              { cat: "Desarrollo", count: "25 especialistas", icon: "💻" },
              { cat: "Marketing", count: "12 especialistas", icon: "📊" },
              { cat: "Copy & Contenido", count: "8 especialistas", icon: "✍️" },
              { cat: "+ 20 más", count: "2 especialistas c/una", icon: "+" }
            ].map((cat, idx) => (
              <div key={idx} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition cursor-pointer">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h4 className="font-bold mb-1">{cat.cat}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Proyectos activos */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Tus proyectos</h3>
          <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No tienes proyectos activos</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Crea tu primer proyecto arriba. El equipo trabajará en paralelo para entregarlo en ~60 minutos.
            </p>
            <a href="#" className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-lg transition">
              Ver ejemplos →
            </a>
          </div>
        </div>

        {/* Assets Library */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Tu librería: 45,000+ assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-3">📦</div>
              <h4 className="font-bold mb-2">222 Componentes React</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Buttons, cards, animations. Todo en dark mode. Copy-paste directo.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-3">🖼️</div>
              <h4 className="font-bold mb-2">2,800+ Imágenes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Optimizadas en WebP. Desde Cloudinary CDN (50ms en cualquier país).</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-3">🎬</div>
              <h4 className="font-bold mb-2">4,254 Videos 4K</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Heroes, intros, explicaciones. Listos para editar.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-bold mb-2">133 Animaciones</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scroll effects, hover interactions. GSAP + Framer Motion.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-3">🔤</div>
              <h4 className="font-bold mb-2">Tipografía Premium</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cormorant Garamond, Inter. Fallbacks incluidos.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="font-bold mb-2">Estilos predefinidos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Luxury, minimalist, playful. Listos para aplicar.</p>
            </div>
          </div>
        </div>

        {/* Machine Learning */}
        <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
          <h3 className="text-2xl font-bold mb-4">Aprendizaje automático</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Victor IA aprende de cada proyecto. Tu segundo proyecto cuesta 25% menos tiempo. Tu quinto proyecto es 50% más rápido.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="font-bold text-lg">Proyecto 1</p>
              <p className="text-gray-600 dark:text-gray-400">60 min</p>
            </div>
            <div>
              <p className="font-bold text-lg">Proyecto 2</p>
              <p className="text-gray-600 dark:text-gray-400">45 min</p>
            </div>
            <div>
              <p className="font-bold text-lg">Proyecto 5</p>
              <p className="text-gray-600 dark:text-gray-400">30 min</p>
            </div>
            <div>
              <p className="font-bold text-lg">Proyecto 10+</p>
              <p className="text-gray-600 dark:text-gray-400">~10 min</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}