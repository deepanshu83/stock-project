export default function Navbar({ lastUpdated }) {
  return (
    <nav style={{
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>📈</span>
        <span style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          Stock Dashboard
        </span>
        <span style={{
          fontSize: 11,
          background: 'var(--primary)22',
          color: 'var(--primary)',
          padding: '2px 8px',
          borderRadius: 99,
          fontWeight: 600,
        }}>
          NSE LIVE
        </span>
      </div>

      {lastUpdated && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Updated: {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      )}
    </nav>
  )
}
