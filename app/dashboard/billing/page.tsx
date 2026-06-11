"use client";

import { Button } from "@/components/shared/Button";

export default function BillingPage() {
  const invoices = [
    { id: "INV-001", date: "2024-01-15", amount: "$99.00", status: "Paid" },
    { id: "INV-002", date: "2024-02-15", amount: "$99.00", status: "Paid" },
    { id: "INV-003", date: "2024-03-15", amount: "$99.00", status: "Pending" },
  ];

  const plan = {
    name: "Professional",
    price: "$99",
    interval: "month",
    features: ["100 generations/month", "8 agents", "Advanced analytics", "Priority support"],
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Billing</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage subscription and payments</p>
      </div>

      <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold text-black dark:text-white">
              {plan.price}/<span className="text-lg">{plan.interval}</span>
            </p>
          </div>
          <Button variant="primary">Change Plan</Button>
        </div>

        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-green-600">✓</span> {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Payment Method</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-black dark:text-white">Visa ending in 4242</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/2025</p>
          </div>
          <Button variant="ghost">Update</Button>
        </div>
      </div>

      <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Invoices</h3>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex justify-between items-center p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
              <div>
                <p className="font-semibold text-black dark:text-white">{invoice.id}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-black dark:text-white">{invoice.amount}</p>
                <span className={`text-xs px-2 py-1 rounded ${invoice.status === "Paid" ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100"}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
