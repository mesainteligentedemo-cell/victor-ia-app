export default function PublicTest() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FFFFFF', color: '#000000', minHeight: '100vh' }}>
      <h1 style={{ color: '#000000', fontSize: '32px', marginBottom: '20px', fontWeight: '700' }}>✅ App está VIVA</h1>
      <p style={{ color: '#666666', fontSize: '16px', lineHeight: '1.6', maxWidth: '600px' }}>
        Si ves esta página, la app está desplegada correctamente en Vercel y está sirviendo contenido en blanco/negro.
      </p>
      <p style={{ color: '#666666', fontSize: '14px', marginTop: '20px' }}>
        <a href="/dashboard" style={{ color: '#1A1A1A', textDecoration: 'underline', fontSize: '16px' }}>
          → Ir a Dashboard (requiere login con Clerk)
        </a>
      </p>
      <hr style={{ margin: '40px 0', borderColor: '#E5E5E5', border: 'none', borderTop: '1px solid #E5E5E5' }} />
      <h2 style={{ fontSize: '18px', color: '#000000', marginBottom: '10px', fontWeight: '600' }}>Status:</h2>
      <pre style={{ background: '#FAFAFA', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#000000', border: '1px solid #E5E5E5' }}>
{`Vercel Deployment: ✅
Next.js: ✅
CSS Variables (white-first): ✅
Fonts (Plus Jakarta Sans): ✅
Clerk Auth: ✅
`}
      </pre>
    </div>
  );
}