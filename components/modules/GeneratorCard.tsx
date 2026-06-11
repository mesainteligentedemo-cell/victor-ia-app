"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useGeneratorsStore } from "@/lib/stores";
import { useToast } from "@/lib/hooks";

interface GeneratorCardProps {
  type: "image" | "video" | "presentation" | "email" | "landing-page" | "social-post" | "audio" | "pdf";
  title: string;
  description: string;
  icon: string;
}

export function GeneratorCard({ type, title, description, icon }: GeneratorCardProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addGeneration } = useGeneratorsStore();
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      addToast("Por favor ingresa un prompt", "error", 2000);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user-id",
          type,
          params: { prompt, quality: "premium" }
        })
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      addGeneration(data);
      addToast(`${title} generado exitosamente`, "success");
      setPrompt("");
    } catch (error) {
      addToast("Error al generar contenido", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-lg transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-black dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      
      <div className="space-y-3">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Describe tu ${title.toLowerCase()}...`}
          disabled={isLoading}
          className="text-sm"
        />
        <Button
          onClick={handleGenerate}
          isLoading={isLoading}
          variant="primary"
          className="w-full"
        >
          Generar
        </Button>
      </div>
    </div>
  );
}
