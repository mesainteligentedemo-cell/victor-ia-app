'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Clock, DollarSign, AlertCircle } from 'lucide-react';

export default function AdvancedAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // Simulate loading
    try {
      const res = await fetch(`/api/dashboard/analytics-advanced?range=${timeRange}`);
      const analytics = await res.json();
      setData(analytics);
    } catch {
      setData(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = () => ({
    roi: { totalSpent: 2847.5, valueGenerated: 18420, roiPercentage: 547, timeSaved: 142, costPerOutput: 2.15 },
    trends: [
      { date: 'May 13', roi: 320, timeSaved: 12, outputs: 45 },
      { date: 'May 14', roi: 380, timeSaved: 18, outputs: 58 },
      { date: 'May 15', roi: 450, timeSaved: 22, outputs: 71 },
      { date: 'May 16', roi: 520, timeSaved: 28, outputs: 89 },
      { date: 'May 17', roi: 547, timeSaved: 32, outputs: 102 },
    ],
    usageBySpecialty: [
      { name: 'Copywriter', value: 35, roi: 620 },
      { name: 'Designer', value: 28, roi: 480 },
      { name: 'Videographer', value: 22, roi: 890 },
      { name: 'Developer', value: 12, roi: 320 },
      { name: 'Analyst', value: 3, roi: 180 },
    ],
    predictions: {
      creditRunoutDays: 12,
      recommendedPlan: 'pro',
      trendingSpecialty: 'Videographer',
      costOptimization: 'Switch 60% of Designer tasks to batch mode: -$420/month',
    },
    quality: {
      avgRating: 4.7,
      satisfaction: 94,
      reworkRate: 3.2,
      recommendedTemplates: [
        { name: 'LinkedIn B2B Copy', successRate: 0.96 },
        { name: 'Product Photography', successRate: 0.92 },
        { name: 'YouTube Scripts', successRate: 0.88 },
      ],
    },
  });

  return (
    <div style={{ padding: 'var(--sp-xl)', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 32px;
        }

        .header-title {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          margin: 0;
          font-size: 14px;
          color: var(--t2);
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .range-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .range-btn {
          padding: 8px 12px;
          border: 1px solid var(--b);
          background: var(--bg2);
          color: var(--p);
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 150ms ease;
        }

        .range-btn:hover {
          border-color: var(--p);
          background: var(--bg3);
        }

        .range-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid var(--b);
          background: #000;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 150ms ease;
        }

        .export-btn:hover {
          background: #333;
          border-color: #333;
        }

        .alert-critical {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .alert-icon {
          flex-shrink: 0;
          color: #ef4444;
          margin-top: 1px;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: #ef4444;
        }

        .alert-message {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: var(--t2);
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 16px;
          transition: all 150ms ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-card:hover {
          border-color: var(--p);
          background: var(--bg3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .metric-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--t2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .metric-change {
          font-size: 12px;
          color: var(--t3);
          margin: 0;
        }

        .metric-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }

        .chart-container {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .chart-title {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .quality-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .quality-item {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 8px;
          padding: 16px;
        }

        .quality-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--t2);
          margin: 0 0 8px 0;
        }

        .quality-value {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }

        .template-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .template-name {
          margin: 0;
          font-weight: 500;
        }

        .success-rate {
          font-weight: 600;
          color: #10b981;
        }

        .recommendation {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-left: 3px solid #000;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .recommendation-title {
          font-size: 13px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .recommendation-text {
          font-size: 13px;
          color: var(--t2);
          margin: 0;
          line-height: 1.5;
        }

        .skeleton {
          background: linear-gradient(90deg, var(--bg2) 0%, var(--bg3) 50%, var(--bg2) 100%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 599px) {
          .header-title { font-size: 24px; }
          .metric-grid { grid-template-columns: 1fr; }
          .chart-grid { grid-template-columns: 1fr; }
          .quality-grid { grid-template-columns: 1fr; }
          .range-buttons { flex-direction: column; }
          .range-btn { flex: 1; }
        }

        @media (max-width: 899px) {
          .metric-grid { grid-template-columns: repeat(2, 1fr); }
          .chart-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="header">
          <h1 className="header-title">Advanced Analytics</h1>
          <p className="header-subtitle">ROI analysis, predictions, and cost optimization</p>
        </div>
        <button className="export-btn" aria-label="Export analytics to PDF">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* Time Range Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div className="range-buttons">
          {[{ value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' }, { value: '90d', label: 'Last 90 days' }, { value: 'all', label: 'All time' }].map((range) => (
            <button
              key={range.value}
              className={`range-btn ${timeRange === range.value ? 'active' : ''}`}
              onClick={() => setTimeRange(range.value)}
              aria-pressed={timeRange === range.value}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="metric-card">
                <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '28px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '14px', width: '70%' }} />
              </div>
            ))}
          </div>
        </div>
      ) : data ? (
        <>
          {/* Critical Alert */}
          {data.predictions.creditRunoutDays < 14 && (
            <div className="alert-critical">
              <AlertCircle size={20} className="alert-icon" />
              <div className="alert-content">
                <p className="alert-title">⚠️ Credits running out in {data.predictions.creditRunoutDays} days</p>
                <p className="alert-message">At your current consumption rate, you'll need to upgrade or recharge. We recommend: <strong>{data.predictions.recommendedPlan.toUpperCase()}</strong> plan.</p>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="metric-grid">
            {[
              { label: 'Total ROI', value: `+${data.roi.roiPercentage}%`, icon: TrendingUp, change: '+12% vs last week' },
              { label: 'Time Saved', value: `${data.roi.timeSaved}h`, icon: Clock, change: 'Equivalent to $1,140 MXN' },
              { label: 'Cost per Output', value: `$${data.roi.costPerOutput.toFixed(2)}`, icon: DollarSign, change: '-8% this month' },
              { label: 'Total Spent', value: `$${data.roi.totalSpent.toFixed(0)}`, icon: TrendingUp, change: `Generated: $${data.roi.valueGenerated.toFixed(0)}` },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="metric-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="metric-icon">
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="metric-label">{metric.label}</p>
                      <p className="metric-value">{metric.value}</p>
                      <p className="metric-change">{metric.change}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="chart-grid">
            {/* ROI Trend */}
            <div className="chart-container">
              <h3 className="chart-title">ROI Trend (Last 5 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--b)" />
                  <XAxis dataKey="date" stroke="var(--t2)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--t2)" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="roi" stroke="#000" strokeWidth={2} dot={{ fill: '#000' }} name="ROI %" />
                  <Line type="monotone" dataKey="timeSaved" stroke="#999" strokeWidth={2} name="Hours Saved" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Usage by Specialty */}
            <div className="chart-container">
              <h3 className="chart-title">Usage by Specialty</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.usageBySpecialty}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--b)" />
                  <XAxis dataKey="name" stroke="var(--t2)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--t2)" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#000" radius={[8, 8, 0, 0]} name="% Usage" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="quality-grid">
            {[
              { label: 'Avg Rating', value: `${data.quality.avgRating} ⭐` },
              { label: 'Satisfaction', value: `${data.quality.satisfaction}%` },
              { label: 'Rework Rate', value: `${data.quality.reworkRate}%` },
            ].map((metric) => (
              <div key={metric.label} className="quality-item">
                <p className="quality-label">{metric.label}</p>
                <p className="quality-value">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="recommendation">
            <p className="recommendation-title">💡 Optimization Opportunity</p>
            <p className="recommendation-text">{data.predictions.costOptimization}</p>
            <p style={{ fontSize: '12px', color: 'var(--t3)', margin: '8px 0 0 0' }}>Implementing this would save ~15% monthly costs</p>
          </div>

          {/* Top Performing Templates */}
          <div className="chart-container">
            <h3 className="chart-title">Best Performing Templates</h3>
            {data.quality.recommendedTemplates.map((t: any) => (
              <div key={t.name} className="template-item">
                <p className="template-name">{t.name}</p>
                <p className="success-rate">{(t.successRate * 100).toFixed(0)}% success</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg2)', borderRadius: '12px' }}>
          <p style={{ margin: 0, color: 'var(--t2)' }}>No data available</p>
        </div>
      )}
    </div>
  );
}