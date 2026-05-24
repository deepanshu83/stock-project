import { LineChart, Line, ResponsiveContainer } from 'recharts'

const SECTOR_BADGES = {
  IT: 'IT',
  Banking: 'Banking',
  Auto: 'Auto',
  Conglomerate: 'Conglomerate',
  Pharma: 'Pharma',
  Consumer: 'Consumer',
}

export default function StockCard({ stock, isSelected, onClick }) {
  const performance = stock.day_percent || 0
  const isPositive = performance >= 0
  const borderColor = isSelected
    ? 'var(--primary)'
    : performance > 2
    ? 'rgba(0, 196, 140, 0.25)'
    : performance < -2
    ? 'rgba(255, 100, 124, 0.25)'
    : 'var(--border)'

  const sparkData = stock.recent_history?.map((row) => ({ value: row.close })) || []

  return (
    <button
      type="button"
      onClick={() => onClick(stock.ticker)}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        color: 'inherit',
        background: 'var(--card)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 18,
        padding: 18,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isSelected ? '0 20px 50px rgba(79, 142, 247, 0.12)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.7 }}>{stock.ticker}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stock.sector}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: isPositive ? 'var(--success)' : 'var(--danger)',
          }}>
            {isPositive ? '▲' : '▼'} {performance?.toFixed(2)}%
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 999,
            background: stock.signal === 'BUY' ? 'var(--success)22' : 'var(--warning)22',
            color: stock.signal === 'BUY' ? 'var(--success)' : 'var(--warning)',
          }}>
            {stock.signal}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 24, fontWeight: 800 }}>₹{stock.current_price?.toLocaleString('en-IN')}</span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 999,
          color: 'var(--text)',
          background: 'rgba(79, 142, 247, 0.15)',
        }}>
          {SECTOR_BADGES[stock.sector] || stock.sector}
        </span>
      </div>

      <div style={{ width: '100%', height: 60, marginBottom: 12 }}>
        {sparkData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                dataKey="value"
                stroke={isPositive ? 'var(--success)' : 'var(--danger)'}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 12 }} />
        )}
      </div>

      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
        paddingTop: 12,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>52W high {stock.week_52?.high?.toLocaleString('en-IN')}</span>
        <span>52W low {stock.week_52?.low?.toLocaleString('en-IN')}</span>
      </div>
    </button>
  )
}
