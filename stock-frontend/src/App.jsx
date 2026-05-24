import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import StockCard from './components/StockCard'
import StockChart from './components/StockChart'
import StatsGrid from './components/StatsGrid'
import { fetchStockInfo, fetchHistory } from './services/api'

const STOCKS_LIST = ['TCS', 'RELIANCE', 'INFY', 'HDFCBANK', 'WIPRO']

export default function App() {
  const [stocks, setStocks] = useState([])
  const [selected, setSelected] = useState('TCS')
  const [selectedStock, setStock] = useState(null)
  const [history, setHistory] = useState([])
  const [period, setPeriod] = useState('1y')
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoad] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setUpdated] = useState(null)

  const loadAll = useCallback(async () => {
    try {
      setError(null)
      const results = await Promise.all(
        STOCKS_LIST.map((t) => fetchStockInfo(t))
      )
      setStocks(results)
      const sel = results.find((s) => s.ticker === selected)
      if (sel) setStock(sel)
      setUpdated(new Date().toISOString())
    } catch (err) {
      setError('Data nahi aaya. FastAPI chal r rahi hai? (localhost:8000)')
    } finally {
      setLoading(false)
    }
  }, [selected])

  const loadChart = useCallback(async (ticker, p) => {
    setChartLoad(true)
    try {
      const data = await fetchHistory(ticker, p)
      setHistory(data.history)
    } catch (err) {
      console.error('Chart error:', err)
    } finally {
      setChartLoad(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  useEffect(() => {
    loadChart(selected, period)
    const s = stocks.find((s) => s.ticker === selected)
    if (s) setStock(s)
  }, [selected, period, stocks, loadChart])

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}>
      <div style={{ fontSize: 40 }}>📊</div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>
        Stock data aa raha hai...
      </div>
      <div style={{
        fontSize: 13,
        color: 'var(--text-muted)',
      }}>
        Yahoo Finance se live data fetch ho raha hai
      </div>
    </div>
  )

  if (error) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{
        color: 'var(--danger)',
        fontSize: 16,
        maxWidth: 400,
      }}>
        {error}
      </div>
      <button
        onClick={() => { setLoading(true); loadAll() }}
        style={{
          background: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Dobara Try Karo
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar lastUpdated={lastUpdated} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
          <button
            onClick={loadAll}
            style={{
              background: 'var(--card)',
              color: 'var(--text-sec)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔄 Refresh
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 20,
          alignItems: 'start',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: 1.5,
              marginBottom: 4,
            }}>
              INDIAN STOCKS
            </div>
            {stocks.map((stock) => (
              <StockCard
                key={stock.ticker}
                stock={stock}
                isSelected={stock.ticker === selected}
                onClick={setSelected}
              />
            ))}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {chartLoading ? (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                height: 340,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                gap: 10,
              }}>
                📊 Chart load ho raha hai...
              </div>
            ) : (
              <StockChart
                history={history}
                ticker={selected}
                period={period}
                onPeriodChange={setPeriod}
              />
            )}

            <StatsGrid stock={selectedStock} />
          </div>
        </div>
      </div>
    </div>
  )
}
