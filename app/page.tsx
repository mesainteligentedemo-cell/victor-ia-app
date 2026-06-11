"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import AgentsPanel from "@/components/AgentsPanel";
import ProspeccionPage from "@/components/prospeccion/ProspeccionPage";

type ActiveModule = "chat" | "prospeccion";

export default function Home() {
  const [activeModule, setActiveModule] = useState<ActiveModule>("chat");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentsPanelVisible, setAgentsPanelVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [chatKey, setChatKey] = useState(0);

  const handleLoadingChange = useCallback((loading: boolean, query: string) => {
    setIsGenerating(loading);
    if (loading && query) setLastQuery(query);
  }, []);

  function handleNewChat() {
    setChatKey((k) => k + 1);
    setActiveProject(null);
    setActiveSkill(null);
    setIsGenerating(false);
    setLastQuery("");
  }

  function handleSelectModule(module: ActiveModule) {
    setActiveModule(module);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ink">

      {/* Sidebar fijo — tablet (160px) y desktop (200px) */}
      <div className="hidden sm:block">
        <Sidebar
          variant="docked"
          activeProject={activeProject}
          activeSkill={activeSkill}
          onSelectProject={setActiveProject}
          onSelectSkill={setActiveSkill}
          onNewChat={handleNewChat}
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
        />
      </div>

      {/* Mobile <640px — overlay con hamburguesa */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full">
            <Sidebar
              variant="overlay"
              activeProject={activeProject}
              activeSkill={activeSkill}
              onSelectProject={setActiveProject}
              onSelectSkill={setActiveSkill}
              onNewChat={handleNewChat}
              onClose={() => setSidebarOpen(false)}
              activeModule={activeModule}
              onSelectModule={handleSelectModule}
            />
          </div>
        </div>
      )}

      {/* Main content — columna central */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {activeModule === "chat" ? (
          <ChatInterface
            key={chatKey}
            activeProject={activeProject}
            activeSkill={activeSkill}
            onOpenSidebar={() => setSidebarOpen(true)}
            onSelectProject={setActiveProject}
            onSelectSkill={setActiveSkill}
            onLoadingChange={handleLoadingChange}
            agentsPanelVisible={agentsPanelVisible}
            onToggleAgentsPanel={() => setAgentsPanelVisible((v) => !v)}
          />
        ) : (
          <ProspeccionPage />
        )}
      </main>

      {/* Panel de agentes — solo desktop ≥1024px (3a columna) */}
      {activeModule === "chat" && (
        <div className="hidden lg:block">
          <AgentsPanel
            isLoading={isGenerating}
            lastQuery={lastQuery}
            isVisible={agentsPanelVisible}
            onToggle={() => setAgentsPanelVisible((v) => !v)}
          />
        </div>
      )}
    </div>
  );
}