'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CHART_DATA_DAILY = [
  { date: 'Lun', chats: 12, generaciones: 8 },
  { date: 'Mar', chats: 19, generaciones: 15 },
  { date: 'Mié', chats: 15, generaciones: 12 },
  { date: 'Jue', chats: 25, generaciones: 22 },
  { date: 'Vie', chats: 32, generaciones: 28 },
  { date: 'Sáb', chats: 28, generaciones: 25 },
  { date: 'Dom', chats: 21, generaciones: 18 },
];

const CHART_DATA_GENERATION = [
  { name: 'Imágenes', value: 1200 },
  { name: 'Videos', value: 800 },
  { name: 'Texto', value: 800 },
];

const CHART_DATA_AGENTS = [
  { agent: 'Código', usage: 45 },
  { agent: 'UI/UX', usage: 32 },
  { agent: 'Copy', usage: 28 },
  { agent: 'Video', usage: 35 },
  { agent: 'Data', usage: 40 },
];

const COLORS = ['var(--blue)', 'var(--orange)', 'var(--green)', 'var(--purple)', 'var(--pink)'];

export default function AnalyticsPage() {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>📊 Analytics Avanzado</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Usuarios', value: '245', trend: '+12%' },
          { label: 'Chats', value: '3.4k', trend: '+8%' },
          { label: 'Generaciones', value: '2.8k', trend: '+15%' },
          { label: 'Ingresos', value: '$47k', trend: '+22%' },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px' }}>{stat.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: 'var(--green)' }}>{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Line Chart */}
        <div style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Actividad Semanal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={CHART_DATA_DAILY}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--b)" />
              <XAxis dataKey="date" stroke="var(--t3)" />
              <YAxis stroke="var(--t3)" />
              <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--b)' }} />
              <Legend />
              <Line type="monotone" dataKey="chats" stroke="var(--blue)" name="Chats" strokeWidth={2} />
              <Line type="monotone" dataKey="generaciones" stroke="var(--orange)" name="Generaciones" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={CHART_DATA_GENERATION} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                {CHART_DATA_GENERATION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Uso por Agente</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={CHART_DATA_AGENTS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--b)" />
            <XAxis dataKey="agent" stroke="var(--t3)" />
            <YAxis stroke="var(--t3)" />
            <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--b)' }} />
            <Bar dataKey="usage" fill="var(--blue)" name="Uso %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
