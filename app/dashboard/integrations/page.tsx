"use client";

import { useIntegrationsStore } from "@/lib/stores";
import { Button } from "@/components/shared/Button";
import { useModal } from "@/lib/hooks";
import { Modal } from "@/components/shared/Modal";
import { useEffect } from "react";

const AVAILABLE_INTEGRATIONS = [
  { id: "slack", name: "Slack", description: "Send notifications to Slack", icon: "💬", connected: false },
  { id: "github", name: "GitHub", description: "Sync repositories and deployments", icon: "🐙", connected: false },
  { id: "zapier", name: "Zapier", description: "Connect to 5000+ apps", icon: "⚡", connected: false },
  { id: "stripe", name: "Stripe", description: "Payment processing", icon: "💳", connected: false },
  { id: "twilio", name: "Twilio", description: "SMS and voice", icon: "📱", connected: false },
  { id: "hubspot", name: "HubSpot", description: "CRM integration", icon: "🔗", connected: false },
];

export default function IntegrationsPage() {
  const { integrations, addIntegration } = useIntegrationsStore();
  const { isOpen, open, close } = useModal();

  useEffect(() => {
    const fetchIntegrations = async () => {
      const res = await fetch("/api/integrations?userId=user-id");
      if (res.ok) {
        const data = await res.json();
      }
    };
    fetchIntegrations();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect external services and tools</p>
        </div>
        <Button onClick={open} variant="primary">
          + Add Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Connected</p>
          <p className="text-3xl font-bold text-black dark:text-white">{integrations.length}</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
          <p className="text-3xl font-bold text-black dark:text-white">{AVAILABLE_INTEGRATIONS.length}</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last Sync</p>
          <p className="text-xl font-bold text-black dark:text-white">2h ago</p>
        </div>
      </div>

      {/* Integration Grid */}
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_INTEGRATIONS.map((service) => (
            <div
              key={service.id}
              className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
              <Button
                onClick={() => addIntegration({ id: service.id, name: service.name, active: true, connectedAt: new Date() } as any)}
                variant={service.connected ? "ghost" : "primary"}
                className="w-full"
              >
                {service.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Services */}
      {integrations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Active Integrations</h2>
          <div className="space-y-2">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-black dark:text-white">{integration.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connected and active</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Add Integration">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Select an integration from the list above to connect it to your account.</p>
      </Modal>
    </div>
  );
}
