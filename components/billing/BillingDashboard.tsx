'use client';

import { useEffect, useState } from 'react';
import { UserSubscription } from '@/lib/billing/subscription-manager';
import Button from '@/components/ui/Button';

export function BillingDashboard() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setIsLoading(true);

      // Fetch subscription
      const subResponse = await fetch('/api/billing/subscription');
      if (!subResponse.ok) throw new Error('Failed to fetch subscription');
      const subData = await subResponse.json();
      setSubscription(subData.subscription);

      // Fetch invoices
      const invResponse = await fetch('/api/billing/invoices');
      if (!invResponse.ok) throw new Error('Failed to fetch invoices');
      const invData = await invResponse.json();
      setInvoices(invData.invoices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/billing/portal', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to create portal session');
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert('Failed to open billing portal');
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading billing information...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold mb-4">Current Plan</h3>

        {subscription ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="text-lg font-semibold capitalize">{subscription.planId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subscription.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Billing Cycle</p>
                <p className="text-lg font-semibold capitalize">
                  {subscription.billingCycle}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Renewal Date</p>
                <p className="text-lg font-semibold">
                  {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            {subscription.planId !== 'business' && (
              <Button onClick={handleUpgrade} className="w-full mt-4">
                Upgrade Plan
              </Button>
            )}

            <Button
              onClick={handleManageBilling}
              className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Manage Billing
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You're on the free plan</p>
            <Button onClick={handleUpgrade}>Upgrade Now</Button>
          </div>
        )}
      </div>

      {/* Usage */}
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold mb-4">Usage</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">API Calls</span>
              <span className="text-sm text-gray-600">1,234 / 100,000</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/80 bg-blue-600 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Storage</span>
              <span className="text-sm text-gray-600">12.5 GB / 100 GB</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/8 bg-blue-600 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Collaborators</span>
              <span className="text-sm text-gray-600">3 / 10</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/10 bg-blue-600 rounded-full" />
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Usage is tracked monthly and resets on the first day of each month.
        </p>
      </div>

      {/* Billing History */}
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold mb-4">Billing History</h3>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      ${(invoice.amount_due / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={invoice.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">No invoices yet</p>
        )}
      </div>

      {/* Payment Methods */}
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold mb-4">Payment Methods</h3>

        <p className="text-gray-600 mb-4">
          Manage your payment methods in the billing portal.
        </p>

        <Button
          onClick={handleManageBilling}
          className="bg-gray-100 text-gray-900 hover:bg-gray-200"
        >
          Manage Payment Methods
        </Button>
      </div>
    </div>
  );
}