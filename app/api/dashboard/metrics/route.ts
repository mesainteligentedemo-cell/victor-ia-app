import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

interface MetricsRequest {
  userId: string;
  days?: number;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const days = parseInt(url.searchParams.get('days') || '7');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Generate mock metrics based on time
    const metrics = {
      kpis: {
        speed: {
          label: 'Velocidad',
          value: '0.8s',
          change: '+12%',
          icon: '⚡',
        },
        team: {
          label: 'Equipo',
          value: '8/155',
          change: '↑ 3 nuevos',
          icon: '👥',
        },
        efficiency: {
          label: 'Eficiencia',
          value: '94%',
          change: '+5%',
          icon: '📈',
        },
        cost: {
          label: 'Costo',
          value: '$2.4k',
          change: '-8%',
          icon: '💰',
        },
      },
      activity: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        data: [45, 52, 48, 61, 55, 42, 38],
      },
      pipeline: [
        { stage: 'Prospect', count: 12, value: 180000 },
        { stage: 'Proposal', count: 8, value: 240000 },
        { stage: 'Authorized', count: 5, value: 300000 },
        { stage: 'Completed', count: 3, value: 150000 },
      ],
      specialists: [
        { name: 'Chat IA', usage: 45 },
        { name: 'Generators', usage: 28 },
        { name: 'Analytics', usage: 18 },
        { name: 'CRM', usage: 12 },
        { name: 'Video', usage: 8 },
        { name: 'Otros', usage: 5 },
      ],
      recentActivity: [
        {
          id: '1',
          type: 'chat_sent',
          description: 'Enviaste 12 mensajes',
          timestamp: 'Hace 2 horas',
          icon: '💬',
        },
        {
          id: '2',
          type: 'generator_used',
          description: 'Generaste 3 imágenes 4K',
          timestamp: 'Hace 4 horas',
          icon: '🖼️',
        },
        {
          id: '3',
          type: 'project_created',
          description: 'Creaste proyecto "Costa Negra v2"',
          timestamp: 'Ayer',
          icon: '📁',
        },
        {
          id: '4',
          type: 'agent_executed',
          description: 'Ejecutaste 5 agentes en paralelo',
          timestamp: '2 días atrás',
          icon: '🤖',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString(),
      dataPeriod: `${days} días`,
    });
  } catch (error) {
    logger.error('Metrics error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}