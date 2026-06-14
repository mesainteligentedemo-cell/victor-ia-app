'use client';

import { useState } from 'react';
import { FileText, Loader2, FileDown } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface ProposalGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProposalResult {
  client: string;
  services: string[];
  amount: number;
  currency: string;
  timeline: string;
  paymentTerms: string;
  narrative: string;
}

export default function ProposalGeneratorModal({ isOpen, onClose }: ProposalGeneratorModalProps) {
  const [client, setClient] = useState('');
  const [servicesText, setServicesText] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('MXN');
  const [timeline, setTimeline] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProposalResult | null>(null);

  const handleClose = () => {
    setError(null);
    setResult(null);
    onClose();
  };

  const handleGenerate = async () => {
    const services = servicesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (client.trim().length < 2) {
      setError('Escribe el nombre del cliente.');
      return;
    }
    if (services.length === 0) {
      setError('Agrega al menos un servicio (uno por línea).');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client,
          services,
          amount: Number(amount) || 0,
          currency,
          timeline,
          paymentTerms,
        }),
      });
      if (!res.ok) throw new Error('No se pudo generar la propuesta. Intenta de nuevo.');
      const data = (await res.json()) as ProposalResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la propuesta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Proposal Generator"
      subtitle="Propuestas comerciales persuasivas"
      icon={<FileText size={19} />}
      maxWidth={620}
      footer={
        <>
          <button className="sm-btn" onClick={handleClose} disabled={loading}>
            Cerrar
          </button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <FileText size={16} />}
            {loading ? 'Redactando…' : 'Generar propuesta'}
          </button>
        </>
      }
    >
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {error && <div className="sm-error">{error}</div>}

      {!result && (
        <>
          <div className="sm-field">
            <label className="sm-label" htmlFor="pr-client">Cliente</label>
            <input
              id="pr-client"
              className="sm-input"
              value={client}
              maxLength={200}
              placeholder="Ej. Seabird Ocean Resort"
              onChange={(e) => setClient(e.target.value)}
            />
          </div>
          <div className="sm-field">
            <label className="sm-label" htmlFor="pr-serv">Servicios (uno por línea)</label>
            <textarea
              id="pr-serv"
              className="sm-textarea"
              value={servicesText}
              placeholder={'Sitio web luxury\nAuditoría SEO\nCampaña de video'}
              onChange={(e) => setServicesText(e.target.value)}
            />
          </div>
          <div className="sm-row">
            <div className="sm-field">
              <label className="sm-label" htmlFor="pr-amount">Inversión</label>
              <input
                id="pr-amount"
                className="sm-input"
                type="number"
                min={0}
                value={amount}
                placeholder="68000"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="sm-field">
              <label className="sm-label" htmlFor="pr-cur">Moneda</label>
              <select
                id="pr-cur"
                className="sm-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div className="sm-row">
            <div className="sm-field">
              <label className="sm-label" htmlFor="pr-time">Plazo</label>
              <input
                id="pr-time"
                className="sm-input"
                value={timeline}
                maxLength={200}
                placeholder="Ej. 6 semanas"
                onChange={(e) => setTimeline(e.target.value)}
              />
            </div>
            <div className="sm-field">
              <label className="sm-label" htmlFor="pr-pay">Términos de pago</label>
              <input
                id="pr-pay"
                className="sm-input"
                value={paymentTerms}
                maxLength={300}
                placeholder="Ej. 50% anticipo, 50% entrega"
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: 'var(--green)' }}>✅ Propuesta · {result.client}</div>
            <button className="sm-btn" onClick={() => window.print()}>
              <FileDown size={15} /> Exportar
            </button>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 10,
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              maxHeight: 320,
              overflowY: 'auto',
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--t1)' }}>
              {result.narrative}
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--b)' }}>
              <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 6 }}>Servicios</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--t2)' }}>
                {result.services.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>
                {result.amount.toLocaleString('es-MX')} {result.currency}
              </div>
            </div>
          </div>
          <button className="sm-btn" style={{ marginTop: 14 }} onClick={() => setResult(null)}>
            Crear otra
          </button>
        </div>
      )}
    </StudioModalShell>
  );
}
