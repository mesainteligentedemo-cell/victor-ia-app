"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeProject={activeProject}
          activeSkill={activeSkill}
          onSelectProject={setActiveProject}
          onSelectSkill={setActiveSkill}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full">
            <Sidebar
              activeProject={activeProject}
              activeSkill={activeSkill}
              onSelectProject={setActiveProject}
              onSelectSkill={setActiveSkill}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <ChatInterface
          activeProject={activeProject}
          activeSkill={activeSkill}
          onOpenSidebar={() => setSidebarOpen(true)}
          onSelectProject={setActiveProject}
          onSelectSkill={setActiveSkill}
        />
      </main>
    </div>
  );
}
