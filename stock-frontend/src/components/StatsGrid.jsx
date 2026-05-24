function StatBox({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg)',
      borderRadius: 12,
      padding: '14px 16px',
      border: '1px solid var(--border)',
    }}>
      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        marginBottom: 6,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: color || 'var(--text)',
      }}>
        {value}
      </div>
    </div>
  )
}

export default function StatsGrid({ stock }) {
  if (!stock) return null

  const fmt = (num) =>
    num ? `₹${Number(num).toLocaleString('en-IN')}` : '—'

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-muted)',
        letterSpacing: 1,
        marginBottom: 14,
        textTransform: 'uppercase',
      }}>
        Statistics
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
      }}>
        <StatBox
          label="52W High"
          value={fmt(stock.week_52?.high)}
          color="var(--success)"
        />
        <StatBox
          label="52W Low"
          value={fmt(stock.week_52?.low)}
          color="var(--danger)"
        />
        <StatBox
          label="Avg Price"
          value={fmt(stock.averages?.price)}
        />
        <StatBox
          label="MA 30"
          value={fmt(stock.averages?.ma_30)}
          color="var(--warning)"
        />
        <StatBox
          label="MA 90"
          value={fmt(stock.averages?.ma_90)}
          color="var(--primary)"
        />
        <StatBox
          label="Volatility"
          value={fmt(stock.volatility)}
        />
        <StatBox
          label="Avg Volume"
          value={stock.averages?.volume?.toLocaleString('en-IN')}
        />
        <StatBox
          label="Signal"
          value={stock.signal}
          color={stock.signal === 'BUY'
            ? 'var(--success)'
            : 'var(--warning)'}
        />
        <StatBox
          label="Today"
          value={`${stock.change?.direction === 'up' ? '▲' : '▼'} ${stock.change?.percent}%`}
          color={stock.change?.direction === 'up'
            ? 'var(--success)'
            : 'var(--danger)'}
        />
      </div>
    </div>
  )
}
