"use client";

import { useCRMStore } from "@/lib/stores";
import { useForm, useModal } from "@/lib/hooks";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Modal } from "@/components/shared/Modal";
import { useState, useEffect } from "react";

const PIPELINE_STAGES = ["lead", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];

export default function CRMPage() {
  const { prospects, metrics, setMetrics, addProspect } = useCRMStore();
  const { isOpen, open, close } = useModal();
  const [stageFilter, setStageFilter] = useState<string | null>(null);

  const form = useForm(
    { name: "", company: "", email: "", phone: "", value: "" },
    async (values) => {
      const prospect = {
        id: Math.random().toString(36).substring(7),
        userId: "user-id",
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone,
        stage: "lead" as const,
        value: parseInt(values.value) || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      addProspect(prospect);
      close();
      form.setValues({ name: "", company: "", email: "", phone: "", value: "" });
    }
  );

  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await fetch("/api/crm?userId=user-id");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    };
    fetchMetrics();
  }, []);

  const filteredProspects = stageFilter
    ? prospects.filter((p) => p.stage === stageFilter)
    : prospects;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">CRM</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tu pipeline de ventas</p>
        </div>
        <Button onClick={open} variant="primary">
          + Nuevo Prospecto
        </Button>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Prospectos</p>
            <p className="text-3xl font-bold text-black dark:text-white">{metrics.totalProspects}</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Promedio</p>
            <p className="text-3xl font-bold text-black dark:text-white">${metrics.avgValuePerProspect.toFixed(0)}</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tasa Conversión</p>
            <p className="text-3xl font-bold text-black dark:text-white">{metrics.conversionRate.toFixed(1)}%</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Cerrados</p>
            <p className="text-3xl font-bold text-black dark:text-white">{metrics.prospectsPerStage.won}</p>
          </div>
        </div>
      )}

      {/* Pipeline Stages */}
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Pipeline</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {PIPELINE_STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stageFilter === stage ? null : stage)}
              className={`p-3 rounded border transition ${
                stageFilter === stage
                  ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-black dark:text-white hover:shadow-md"
              }`}
            >
              <p className="text-xs font-semibold capitalize">{stage}</p>
              <p className="text-lg font-bold">{metrics?.prospectsPerStage[stage as keyof typeof PIPELINE_STAGES] || 0}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prospects List */}
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
          {stageFilter ? `Prospectos - ${stageFilter}` : "Todos los Prospectos"}
        </h2>
        {filteredProspects.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Sin prospectos en esta etapa</p>
        ) : (
          <div className="space-y-2">
            {filteredProspects.map((prospect) => (
              <div key={prospect.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-black dark:text-white">{prospect.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{prospect.company} • {prospect.email}</p>
                    <p className="text-sm font-medium text-black dark:text-white mt-1">${prospect.value}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded capitalize">
                    {prospect.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Nuevo Prospecto">
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Nombre"
            value={form.values.name}
            onChange={form.handleChange}
            required
          />
          <Input
            name="company"
            placeholder="Empresa"
            value={form.values.company}
            onChange={form.handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.values.email}
            onChange={form.handleChange}
            required
          />
          <Input
            name="phone"
            placeholder="Teléfono"
            value={form.values.phone}
            onChange={form.handleChange}
          />
          <Input
            name="value"
            type="number"
            placeholder="Valor del Deal ($)"
            value={form.values.value}
            onChange={form.handleChange}
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="flex-1">
              Crear Prospecto
            </Button>
            <Button type="button" variant="ghost" onClick={close} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
