'use client'

type ActionType = 'image' | 'video' | 'presentation' | 'web' | 'voice' | 'training' | 'admin' | 'dashboard'

interface Action {
  id: ActionType
  icon: string
  label: string
  description: string
}

interface ActionGridProps {
  onAction: (type: ActionType) => void
}

const ACTIONS: Action[] = [
  {
    id: 'image',
    icon: '🖼️',
    label: 'Generar imagen',
    description: 'Crea imágenes con IA',
  },
  {
    id: 'video',
    icon: '🎬',
    label: 'Crear video',
    description: 'Video o presentación animada',
  },
  {
    id: 'presentation',
    icon: '📊',
    label: 'Presentación',
    description: 'Slides profesionales',
  },
  {
    id: 'web',
    icon: '🌐',
    label: 'Diseño web',
    description: 'Landing pages y sitios',
  },
  {
    id: 'voice',
    icon: '🎙️',
    label: 'Voz IA',
    description: 'Audio y voice overs',
  },
  {
    id: 'training',
    icon: '🧠',
    label: 'Entrenamiento',
    description: 'Cursos y capacitación',
  },
  {
    id: 'admin',
    icon: '⚡',
    label: 'Administración',
    description: 'Automatiza procesos',
  },
  {
    id: 'dashboard',
    icon: '📈',
    label: 'Dashboard',
    description: 'Métricas y analytics',
  },
]

export default function ActionGrid({ onAction }: ActionGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-2xl mx-auto">
      {ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="
            group flex flex-col items-center gap-2 p-3 rounded-xl
            border border-zinc-800 bg-zinc-900
            hover:bg-white hover:border-white
            transition-all duration-150 ease-out
            text-center
          "
        >
          <span className="text-2xl">{action.icon}</span>
          <div>
            <p className="text-xs font-medium text-zinc-200 group-hover:text-black transition-colors leading-tight">
              {action.label}
            </p>
            <p className="text-[10px] text-zinc-500 group-hover:text-zinc-700 transition-colors mt-0.5 leading-tight hidden sm:block">
              {action.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export type { ActionType, Action }