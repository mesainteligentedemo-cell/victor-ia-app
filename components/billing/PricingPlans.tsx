'use client';

import { useState } from 'react';
import { PRICING_TIERS } from '@/lib/billing/stripe-service';
import Button from '@/components/ui/Button';

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (planId: string) => {
    // Redirect to checkout
    const priceId =
      billingCycle === 'monthly'
        ? PRICING_TIERS.find(t => t.id === planId)?.stripePriceIdMonthly
        : PRICING_TIERS.find(t => t.id === planId)?.stripePriceIdAnnual;

    if (priceId) {
      // Start checkout flow
      window.location.href = `/checkout?priceId=${priceId}`;
    }
  };

  return (
    <div className="space-y-12">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${billingCycle === 'annual' ? 'font-semibold' : 'text-gray-500'}`}>
          Annual
          <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Save 17%
          </span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_TIERS.map((tier) => {
          const price =
            billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
          const displayPrice = price / 100;

          return (
            <div
              key={tier.id}
              className={`rounded-lg border-2 p-8 transition-all ${
                tier.id === 'pro'
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {tier.id === 'pro' && (
                <div className="mb-4 inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {tier.id === 'free' ? 'Free' : `$${displayPrice.toFixed(2)}`}
                </span>
                {tier.id !== 'free' && (
                  <span className="text-gray-600 text-sm ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(tier.id)}
                className={`w-full mb-8 ${
                  tier.id === 'pro'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.id === 'free' ? 'Get Started' : 'Subscribe Now'}
              </Button>

              {/* Features */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Features</p>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>

        <details className="border rounded-lg p-4 cursor-pointer">
          <summary className="font-semibold">Can I upgrade or downgrade anytime?</summary>
          <p className="mt-2 text-gray-600">
            Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately.
          </p>
        </details>

        <details className="border rounded-lg p-4 cursor-pointer">
          <summary className="font-semibold">What about refunds?</summary>
          <p className="mt-2 text-gray-600">
            We offer a 30-day money-back guarantee. If you're not satisfied, contact support for a full refund.
          </p>
        </details>

        <details className="border rounded-lg p-4 cursor-pointer">
          <summary className="font-semibold">Do you offer discounts for annual billing?</summary>
          <p className="mt-2 text-gray-600">
            Yes! Switch to annual billing to save 17% compared to monthly billing.
          </p>
        </details>

        <details className="border rounded-lg p-4 cursor-pointer">
          <summary className="font-semibold">Is there a free trial?</summary>
          <p className="mt-2 text-gray-600">
            Start with the free plan and upgrade anytime. No credit card required.
          </p>
        </details>
      </div>
    </div>
  );
}