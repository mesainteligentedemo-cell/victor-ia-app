export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">Victor IA</h1>
          <a href="/dashboard" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:shadow-lg transition">
            Dashboard
          </a>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Bienvenido a Victor IA SaaS</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Plataforma completa de IA con 10 módulos potentes</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: 'Generators', icon: '✨' },
            { name: 'Agents', icon: '🤖' },
            { name: 'CRM', icon: '📊' },
            { name: 'Automation', icon: '⚙️' },
            { name: 'Analytics', icon: '📈' }
          ].map((module) => (
            <div key={module.name} className="p-4 border border-gray-200 dark:border-gray-800 rounded hover:shadow-md transition">
              <div className="text-3xl mb-2">{module.icon}</div>
              <p className="font-semibold text-black dark:text-white">{module.name}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
