'use client';

import { useState } from 'react';

const CAMPAIGNS = [
  { id: 1, name: 'Lanzamiento Victor IA 2.0', status: 'active', reach: 45230, engagement: 12.5, roi: '340%' },
  { id: 2, name: 'Email Campaign Mayo', status: 'completed', reach: 28150, engagement: 8.3, roi: '215%' },
  { id: 3, name: 'Social Media Ads Q2', status: 'active', reach: 67840, engagement: 15.2, roi: '520%' },
  { id: 4, name: 'Content Marketing Roadmap', status: 'planning', reach: 0, engagement: 0, roi: '0%' },
];

export default function MarketingPage() {
  const totalReach = CAMPAIGNS.reduce((sum, c) => sum + c.reach, 0);
  const avgEngagement = (CAMPAIGNS.reduce((sum, c) => sum + c.engagement, 0) / CAMPAIGNS.length).toFixed(1);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>📢 Marketing</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>ALCANCE TOTAL</p>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>{(totalReach / 1000).toFixed(0)}k</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>ENGAGEMENT PROMEDIO</p>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>{avgEngagement}%</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>CAMPAÑAS ACTIVAS</p>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>{CAMPAIGNS.filter(c => c.status === 'active').length}</p>
        </div>
      </div>

      <div style={{ background: 'var(--bg2)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--b)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--b)' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Campaña</th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Estado</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Alcance</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Engagement</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>ROI</th>
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((campaign) => (
              <tr key={campaign.id} style={{ borderBottom: '1px solid var(--b)' }}>
                <td style={{ padding: '16px', fontWeight: 500 }}>{campaign.name}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', background: campaign.status === 'active' ? 'rgba(59, 130, 246, 0.1)' : campaign.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: campaign.status === 'active' ? 'var(--blue)' : campaign.status === 'completed' ? '#10B981' : '#6B7280' }}>
                    {campaign.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{campaign.reach.toLocaleString()}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{campaign.engagement}%</td>
                <td style={{ padding: '16px', textAlign: 'right', color: 'var(--green)', fontWeight: 600 }}>{campaign.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
