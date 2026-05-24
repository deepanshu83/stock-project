import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'

const PERIODS = ['1mo', '3mo', '6mo', '1y']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: '#1E2436',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{
        color: 'var(--text-muted)',
        marginBottom: 6,
        fontSize: 11,
      }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{
          color: p.color,
          fontWeight: 600,
          marginBottom: 2,
        }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  )
}

export default function StockChart({ history, ticker, period, onPeriodChange }) {
  if (!history?.length) return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 16,
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
    }}>
      Chart load ho raha hai...
    </div>
  )

  const chartData = history
    .filter((_, i) => i % 5 === 0)
    .map((d) => ({
      date: d.date?.slice(5),
      Price: d.close,
      MA30: d.ma_30,
      MA90: d.ma_90,
    }))

  const isPositive =
    history[history.length - 1]?.close >= history[0]?.close

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: 24,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 4,
          }}>
            {ticker} — Price Chart
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--text-muted)',
          }}>
            Close price + Moving Averages
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: `1px solid ${period === p ? 'var(--primary)' : 'var(--border)'}`,
                background: period === p ? 'var(--primary)22' : 'transparent',
                color: period === p ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1E2436"
          />
          <XAxis
            dataKey="date"
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              color: 'var(--text-muted)',
            }}
          />
          <Line
            type="monotone"
            dataKey="Price"
            stroke={isPositive ? 'var(--success)' : 'var(--danger)'}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="MA30"
            stroke="var(--warning)"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 2"
          />
          <Line
            type="monotone"
            dataKey="MA90"
            stroke="var(--primary)"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
