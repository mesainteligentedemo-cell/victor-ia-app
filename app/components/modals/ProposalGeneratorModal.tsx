'use client';

import { useState } from 'react';
import { FileText, Loader2, Download } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface ProposalGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS = [
  'Sitio Web (Web 4.0)',
  'Auditoría SEO Técnica',
  'Branding / Identidad',
  'Producción de Video',
  'Campaña de Contenido',
  'Automatización n8n',
  'Dashboard BI',
  'App / SaaS',
  'Fotografía',
  'Voz IA / Locución',
];

interface ProposalResult {
  client: string;
  services: string[];
  amount: number;
  currency: string;
  timeline: string;
  paymentTerms: string;
  narrative: string;
  issuedAt: string;
}

export default function ProposalGeneratorModal({ isOpen, onClose }: ProposalGeneratorModalProps) {
  const [client, setClient] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'MXN' | 'USD'>('MXN');
  const [timeline, setTimeline] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProposalResult | null>(null);

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleGenerate = async () => {
    if (client.trim().length < 2) { setError('Escribe el nombre del cliente.'); return; }
    if (services.length === 0) { setError('Selecciona al menos un servicio.'); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client, services, amount: Number(amount) || 0, currency, timeline, paymentTerms,
        }),
      });
      if (!res.ok) throw new Error('No se pudo generar la propuesta. Intenta de nuevo.');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la propuesta.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!result) return;
    const fmt = (n: number) =>
      n.toLocaleString('es-MX', { style: 'currency', currency: result.currency });
    const rows = result.services
      .map((s) => `<tr><td>${s}</td><td style="text-align:right">Incluido</td></tr>`)
      .join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Propuesta ${result.client}</title>
<style>
  body{font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#0E0F12;margin:48px;line-height:1.6;}
  .brand{font-size:28px;font-weight:800;color:#3B82F6;letter-spacing:-1px;}
  .sub{color:#666;font-size:13px;margin-bottom:32px;}
  h1{font-size:22px;margin:24px 0 8px;}
  table{width:100%;border-collapse:collapse;margin:16px 0;}
  td,th{padding:10px 12px;border-bottom:1px solid #e5e5e5;font-size:13px;}
  th{text-align:left;background:#f5f5f7;}
  .total{font-size:20px;font-weight:800;text-align:right;margin-top:8px;}
  .narr{white-space:pre-wrap;font-size:13px;margin:16px 0;}
  .terms{font-size:12px;color:#444;margin-top:24px;border-top:1px solid #e5e5e5;padding-top:16px;}
  @media print{body{margin:24px;}}
</style></head><body>
  <div class="brand">VICTOR IA</div>
  <div class="sub">Propuesta comercial · ${new Date(result.issuedAt).toLocaleDateString('es-MX')}</div>
  <h1>Para: ${result.client}</h1>
  <div class="narr">${result.narrative.replace(/</g, '&lt;')}</div>
  <h1>Servicios</h1>
  <table><thead><tr><th>Servicio</th><th style="text-align:right">Estatus</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="total">Inversión total: ${fmt(result.amount)}</div>
  <div class="terms">
    <strong>Plazo:</strong> ${result.timeline || 'A definir'}<br/>
    <strong>Términos de pago:</strong> ${result.paymentTerms || 'A definir'}
  </div>
  <script>window.onload=function(){window.print();}</script>
</body></html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Proposal Generator"
      icon={<FileText size={18} />}
      maxWidth={680}
      footer={
        <>
          <button className="sm-btn" onClick={onClose} disabled={loading} style={{ flex: 1 }}>Cerrar</button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading} style={{ flex: 2 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {loading ? 'Generando…' : 'Generar propuesta'}
          </button>
        </>
      }
    >
      {error && <div className="sm-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ marginBottom: 14 }}>
        <label className="sm-label">Cliente</label>
        <input className="sm-input" value={client} onChange={(e) => setClient(e.target.value)}
          placeholder="Ej: Seabird Ocean Resort" />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label className="sm-label">Servicios</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SERVICE_OPTIONS.map((s) => (
            <button key={s} type="button"
              className={`sm-chip ${services.includes(s) ? 'active' : ''}`}
              onClick={() => toggleService(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="sm-row sm-row-2" style={{ marginBottom: 14 }}>
        <div>
          <label className="sm-label">Inversión</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="sm-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="68000" />
            <select className="sm-select" style={{ width: 90 }} value={currency}
              onChange={(e) => setCurrency(e.target.value as 'MXN' | 'USD')}>
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div>
          <label className="sm-label">Plazo</label>
          <input className="sm-input" value={timeline} onChange={(e) => setTimeline(e.target.value)}
            placeholder="Ej: 6 semanas" />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="sm-label">Términos de pago</label>
        <input className="sm-input" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}
          placeholder="Ej: 50% anticipo, 50% contra entrega" />
      </div>

      {result && (
        <div style={{ padding: 14, background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--t2)', whiteSpace: 'pre-wrap', marginBottom: 12, maxHeight: 200, overflowY: 'auto' }}>
            {result.narrative}
          </div>
          <button className="sm-btn primary" onClick={downloadPdf} style={{ width: '100%' }}>
            <Download size={15} /> Descargar PDF
          </button>
        </div>
      )}
    </StudioModalShell>
  );
}
