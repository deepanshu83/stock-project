export default function StockCard({ stock, isSelected, onClick }) {
  const isUp = stock.change?.direction === 'up'

  return (
    <div
      onClick={() => onClick(stock.ticker)}
      style={{
        background: 'var(--card)',
        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 16,
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isSelected
          ? '0 0 0 3px var(--primary)22'
          : 'none',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 1,
        }}>
          {stock.ticker}
        </span>

        <span style={{
          fontSize: 11,
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 99,
          background: stock.signal === 'BUY'
            ? 'var(--success)22'
            : 'var(--warning)22',
          color: stock.signal === 'BUY'
            ? 'var(--success)'
            : 'var(--warning)',
        }}>
          {stock.signal}
        </span>
      </div>

      <div style={{
        fontSize: 26,
        fontWeight: 800,
        marginBottom: 6,
      }}>
        ₹{stock.current_price?.toLocaleString('en-IN')}
      </div>

      <div style={{
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        color: isUp ? 'var(--success)' : 'var(--danger)',
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 8,
      }}>
        <span>{isUp ? '▲' : '▼'}</span>
        <span>₹{Math.abs(stock.change?.amount)}</span>
        <span style={{ fontSize: 13 }}>
          ({stock.change?.percent}%)
        </span>
      </div>

      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
        paddingTop: 8,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>MA30: ₹{stock.averages?.ma_30?.toLocaleString('en-IN')}</span>
        <span>MA90: ₹{stock.averages?.ma_90?.toLocaleString('en-IN')}</span>
      </div>
    </div>
  )
}
