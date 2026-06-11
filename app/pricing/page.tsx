"use client";

import { Button } from "@/components/shared/Button";
import { PLANS } from "@/lib/stripe/stripe";
import Link from "next/link";

export default function PricingPage() {
  const plans = Object.entries(PLANS).map(([key, plan]) => ({
    key,
    ...plan,
  }));

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">Victor IA</h1>
          <Link href="/" className="text-black dark:text-white hover:underline">
            Back
          </Link>
        </div>
      </nav>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Choose the plan that fits your needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`p-8 rounded-lg border transition ${
                plan.key === "pro"
                  ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-black dark:text-white"
              }`}
            >
              {plan.key === "pro" && (
                <div className="text-sm font-semibold mb-2 opacity-90">MOST POPULAR</div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="opacity-75">/month</span>
              </div>

              <Button
                variant={plan.key === "pro" ? (plan.key === "pro" ? "ghost" : "primary") : "primary"}
                className="w-full mb-6"
              >
                Get Started
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {[
              { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time." },
              { q: "Is there a free trial?", a: "Yes, all new accounts get 100 free credits to try out the platform." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards via Stripe." },
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time without penalties." },
            ].map((item, i) => (
              <div key={i}>
                <h4 className="font-semibold text-black dark:text-white mb-2">{item.q}</h4>
                <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
