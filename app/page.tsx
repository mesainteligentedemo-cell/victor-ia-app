import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-black/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Victor IA</h1>
          <div className="flex gap-4">
            <Link href="/pricing" className="text-sm hover:underline hidden md:inline">
              Pricing
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:shadow-lg transition text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Complete AI Platform for Your Business
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
          Generate content, automate workflows, manage CRM, and analyze metrics - all in one powerful platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-lg transition">
            Start Free Trial
          </Link>
          <Link href="/pricing" className="px-8 py-3 border border-gray-200 dark:border-gray-800 rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition">
            View Pricing →
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
          100 free credits • No credit card required • Cancel anytime
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-16">10 Powerful Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: "✨", name: "Generators", desc: "6 content types" },
            { icon: "🤖", name: "Agents", desc: "AI automation" },
            { icon: "📊", name: "CRM", desc: "Sales pipeline" },
            { icon: "⚙️", name: "Automation", desc: "n8n workflows" },
            { icon: "📈", name: "Analytics", desc: "Real-time metrics" },
            { icon: "🎓", name: "Training", desc: "Learning mgmt" },
            { icon: "👥", name: "HR", desc: "Team management" },
            { icon: "💰", name: "Finance", desc: "Budget tracking" },
            { icon: "🔗", name: "Integrations", desc: "6+ services" },
            { icon: "🔐", name: "Admin", desc: "Full control" },
          ].map((feature) => (
            <div key={feature.name} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition bg-white dark:bg-gray-900">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold mb-1">{feature.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section className="max-w-4xl mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose Victor IA?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "All-in-One", desc: "10 modules in one platform" },
            { title: "AI-Powered", desc: "Advanced AI agents and generation" },
            { title: "Affordable", desc: "Start at $29/month" },
            { title: "100% Responsive", desc: "Mobile, tablet, desktop" },
            { title: "Secure", desc: "Enterprise-grade security" },
            { title: "Real-Time", desc: "Live dashboards & analytics" },
          ].map((item) => (
            <div key={item.title}>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Join teams already using Victor IA to automate their business.
        </p>
        <Link href="/sign-up" className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-lg transition">
          Start Free Trial Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2024 Victor IA. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-6">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </main>
  );
}
