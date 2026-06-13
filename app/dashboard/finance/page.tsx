'use client';

import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MONTHLY_CASHFLOW = [
  { month: 'Ene', ingresos: 35000, gastos: 22000 },
  { month: 'Feb', ingresos: 39000, gastos: 25000 },
  { month: 'Mar', ingresos: 42000, gastos: 26000 },
  { month: 'Abr', ingresos: 45000, gastos: 28000 },
  { month: 'May', ingresos: 47000, gastos: 29000 },
  { month: 'Jun', ingresos: 52000, gastos: 31000 },
];

const TRANSACTIONS = [
  { id: 1, description: 'Pago cliente Costa Negra', amount: 5000, type: 'income', date: 'Hoy' },
  { id: 2, description: 'Suscripción Claude API', amount: -800, type: 'expense', date: 'Hoy' },
  { id: 3, description: 'Pago cliente ROES & CO', amount: 8500, type: 'income', date: 'Ayer' },
  { id: 4, description: 'Suscripción Vercel Pro', amount: -50, type: 'expense', date: 'Ayer' },
  { id: 5, description: 'Pago cliente Seabird', amount: 12000, type: 'income', date: 'Hace 2 días' },
  { id: 6, description: 'Suscripción Adobe Suite', amount: -600, type: 'expense', date: 'Hace 2 días' },
  { id: 7, description: 'Pago cliente Influence IA', amount: 6500, type: 'income', date: 'Hace 3 días' },
  { id: 8, description: 'Equipo de desarrollo (outsource)', amount: -3000, type: 'expense', date: 'Hace 3 días' },
];

export default function FinancePage() {
  const totalIncome = MONTHLY_CASHFLOW[MONTHLY_CASHFLOW.length - 1].ingresos;
  const totalExpenses = MONTHLY_CASHFLOW[MONTHLY_CASHFLOW.length - 1].gastos;
  const profit = totalIncome - totalExpenses;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>⚖️ Legal y Finanzas</h1>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '24px', background: 'var(--bg2)', borderRadius: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>INGRESOS</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--green)', marginBottom: '8px' }}>${totalIncome.toLocaleString()}</p>
          <p style={{ fontSize: '12px', color: 'var(--green)' }}>+12% desde mes anterior</p>
        </div>

        <div style={{ padding: '24px', background: 'var(--bg2)', borderRadius: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>GASTOS</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#EF4444', marginBottom: '8px' }}>${totalExpenses.toLocaleString()}</p>
          <p style={{ fontSize: '12px', color: '#EF4444' }}>+8% desde mes anterior</p>
        </div>

        <div style={{ padding: '24px', background: 'var(--bg2)', borderRadius: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>UTILIDAD NETA</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--blue)', marginBottom: '8px' }}>${profit.toLocaleString()}</p>
          <p style={{ fontSize: '12px', color: 'var(--blue)' }}>Margen: {Math.round((profit / totalIncome) * 100)}%</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Area Chart */}
        <div style={{ padding: '24px', background: 'var(--bg2)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Flujo de Efectivo Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_CASHFLOW}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--green)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--b)" />
              <XAxis dataKey="month" stroke="var(--t3)" />
              <YAxis stroke="var(--t3)" />
              <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--b)' }} />
              <Area type="monotone" dataKey="ingresos" stroke="var(--green)" fillOpacity={1} fill="url(#colorIngresos)" name="Ingresos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Comparison */}
        <div style={{ padding: '24px', background: 'var(--bg2)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Últimos 3 Meses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_CASHFLOW.slice(-3)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--b)" />
              <XAxis dataKey="month" stroke="var(--t3)" />
              <YAxis stroke="var(--t3)" />
              <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--b)' }} />
              <Legend />
              <Bar dataKey="ingresos" fill="var(--green)" name="Ingresos" />
              <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions */}
      <div style={{ padding: '24px', background: 'var(--bg2)', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Transacciones Recientes</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', padding: '12px', borderBottom: '1px solid var(--b)', background: 'var(--bg)', fontWeight: 600, fontSize: '12px' }}>
          <div>DESCRIPCIÓN</div>
          <div>MONTO</div>
          <div>FECHA</div>
        </div>

        {TRANSACTIONS.map((tx) => (
          <div
            key={tx.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '16px',
              padding: '12px',
              borderBottom: '1px solid var(--b)',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            <div>
              <p style={{ fontWeight: 500 }}>{tx.description}</p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--green)' : '#EF4444' }}>
              {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
            </div>
            <div style={{ color: 'var(--t3)', fontSize: '12px' }}>{tx.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
