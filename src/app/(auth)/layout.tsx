export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: '28px 24px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            marginBottom: 20,
            color: 'var(--text)',
          }}
        >
          Transit<em style={{ fontStyle: 'normal', color: 'var(--primary)' }}>Pulse</em>
        </div>
        {children}
      </div>
    </main>
  );
}
