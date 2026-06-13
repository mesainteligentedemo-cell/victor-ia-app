'"'"'use client'"'"';

import { useState } from '"'"'react'"'"';
import { useUser } from '"'"'@clerk/nextjs'"'"';
import { PRICING_PLANS } from '"'"'@/lib/stripe'"'"';

export default function BillingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState('"'"'starter'"'"');

  const handleUpgrade = async (plan: string) => {
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) return;

    setLoading(plan);

    try {
      // Step 1: Create/fetch Stripe customer
      const customerRes = await fetch('"'"'/api/stripe/customer'"'"', {
        method: '"'"'POST'"'"',
        headers: { '"'"'Content-Type'"'"': '"'"'application/json'"'"' },
        body: JSON.stringify({
          userId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName || '"'"'User'"'"',
        }),
      });

      if (!customerRes.ok) throw new Error('"'"'Failed to create customer'"'"');
      const { customerId } = await customerRes.json();

      // Step 2: Create checkout session
      const priceId = PRICING_PLANS[plan as keyof typeof PRICING_PLANS]?.stripePriceId;
      if (!priceId) throw new Error('"'"'Invalid plan'"'"');

      const checkoutRes = await fetch('"'"'/api/stripe/checkout'"'"', {
        method: '"'"'POST'"'"',
        headers: { '"'"'Content-Type'"'"': '"'"'application/json'"'"' },
        body: JSON.stringify({
          customerId,
          priceId,
          successUrl: `${window.location.origin}/dashboard/billing?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
        }),
      });

      if (!checkoutRes.ok) throw new Error('"'"'Failed to create checkout session'"'"');
      const { sessionUrl } = await checkoutRes.json();

      // Redirect to Stripe Checkout
      if (sessionUrl) window.location.href = sessionUrl;
    } catch (error) {
      console.error('"'"'Upgrade error:'"'"', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
          Planes de Precios
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Elige el plan perfecto para tu equipo
        </p>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-lg border-2 p-8 transition-all ${
                userPlan === key
                  ? '"'"'border-black dark:border-white bg-gray-50 dark:bg-gray-900'"'"'
                  : '"'"'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"'"'
              }`}
            >
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                {plan.name}
              </h2>

              <div className="mb-6">
                <span className="text-5xl font-bold text-black dark:text-white">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    /mes
                  </span>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-700 dark:text-gray-300"
                  >
                    <span className="mr-3 text-black dark:text-white">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(key)}
                disabled={loading === key || userPlan === key}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  userPlan === key
                    ? '"'"'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-default'"'"'
                    : loading === key
                      ? '"'"'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"'"'
                      : '"'"'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'"'"'
                }`}
              >
                {loading === key
                  ? '"'"'Procesando...'"'"'
                  : userPlan === key
                    ? '"'"'Plan Actual'"'"'
                    : '"'"'Seleccionar'"'"'}
              </button>
            </div>
          ))}
        </div>

        {/* Current Plan Info */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">
            Tu Plan Actual
          </h3>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Plan:</span> {userPlan}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Renovación:</span> 15 de Julio, 2026
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Método de pago:</span> Tarjeta
              terminada en 4242
            </p>
          </div>

          {/* Management Actions */}
          <div className="flex gap-4 mt-6">
            <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-90">
              Editar Método de Pago
            </button>
            <button className="px-4 py-2 border border-black dark:border-white text-black dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800">
              Cancelar Suscripción
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
