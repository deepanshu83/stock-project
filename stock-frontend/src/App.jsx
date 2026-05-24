import { useState, useEffect, useCallback, useMemo } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StockCard from './components/StockCard'
import StockChart from './components/StockChart'
import StatsGrid from './components/StatsGrid'
import ComparisonTable from './components/ComparisonTable'
import SectorPerformance from './components/SectorPerformance'
import {
  fetchMarketOverview,
  fetchAllStocks,
  fetchStockHistory,
  fetchStockTech,
  fetchSectorPerformance,
} from './services/api'

const STOCKS_LIST = [
  'TCS',
  'RELIANCE',
  'INFY',
  'HDFCBANK',
  'WIPRO',
  'BAJFINANCE',
  'ICICIBANK',
  'SBIN',
  'MARUTI',
  'TATAMOTORS',
  'ADANIENT',
  'SUNPHARMA',
  'TITAN',
  'ITC',
  'LTIM',
]

const PERIODS = ['1mo', '3mo', '6mo', '1y']

export default function App() {
  const [overview, setOverview] = useState(null)
  const [stocks, setStocks] = useState([])
  const [sectorData, setSectorData] = useState([])
  const [selected, setSelected] = useState('TCS')
  const [period, setPeriod] = useState('1y')
  const [history, setHistory] = useState([])
  const [technical, setTechnical] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showBollinger, setShowBollinger] = useState(true)

  const selectedStock = useMemo(
    () => stocks.find((stock) => stock.ticker === selected),
    [stocks, selected]
  )

  const totalPortfolioValue = useMemo(
    () => stocks.reduce((sum, stock) => sum + (stock.current_price || 0), 0),
    [stocks]
  )

  const bestPerformer = useMemo(() => {
    return [...stocks]
      .filter((stock) => typeof stock.day_percent === 'number')
      .sort((a, b) => b.day_percent - a.day_percent)[0]
  }, [stocks])

  const worstPerformer = useMemo(() => {
    return [...stocks]
      .filter((stock) => typeof stock.day_percent === 'number')
      .sort((a, b) => a.day_percent - b.day_percent)[0]
  }, [stocks])

  const loadDashboard = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const [overviewRes, stockRes, sectorRes] = await Promise.all([
        fetchMarketOverview(),
        fetchAllStocks(),
        fetchSectorPerformance(),
      ])
      setOverview(overviewRes)
      setStocks(stockRes.stocks || [])
      setSectorData(sectorRes.sectors || [])
      if (!selected && stockRes.stocks?.length) {
        setSelected(stockRes.stocks[0].ticker)
      }
    } catch (err) {
      setError('Data nahi aaya. Backend chal rahi hai? (localhost:8000)')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selected])

  const loadSelectedStock = useCallback(
    async (ticker, periodValue) => {
      setChartLoading(true)
      try {
        const [historyRes, techRes] = await Promise.all([
          fetchStockHistory(ticker, periodValue),
          fetchStockTech(ticker),
        ])
        setHistory(historyRes.history || [])
        setTechnical(techRes)
      } catch (err) {
        console.error('Chart load failed', err)
      } finally {
        setChartLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (selected) {
      loadSelectedStock(selected, period)
    }
  }, [selected, period, loadSelectedStock])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="skeleton title-skeleton" />
          <div className="skeleton hero-skeleton" />
          <div className="skeleton grid-skeleton" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>⚠️</div>
          <div style={{ color: 'var(--danger)', fontSize: 18, marginBottom: 12 }}>{error}</div>
          <button
            onClick={loadDashboard}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 26px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Dobara try karo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar lastUpdated={overview?.last_updated} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 40px' }}>
        <HeroSection
          overview={overview}
          totalValue={totalPortfolioValue}
          bestPerformer={bestPerformer}
          worstPerformer={worstPerformer}
        />

        <section style={{ marginTop: 24 }}>
          <div className="dashboard-grid">
            <aside style={{ position: 'sticky', top: 92, alignSelf: 'start' }}>
              <div style={{
                border: '1px solid var(--border)',
                borderRadius: 20,
                background: 'var(--card)',
                padding: 20,
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: 'var(--text-muted)',
                  marginBottom: 14,
                }}>Stock Watchlist</div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {stocks.map((stock) => (
                    <StockCard
                      key={stock.ticker}
                      stock={stock}
                      isSelected={stock.ticker === selected}
                      onClick={setSelected}
                    />
                  ))}
                </div>
              </div>
            </aside>

            <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <StockChart
                history={history}
                ticker={selected}
                period={period}
                onPeriodChange={setPeriod}
                showBollinger={showBollinger}
                toggleBollinger={() => setShowBollinger((prev) => !prev)}
                technical={technical}
              />
              <StatsGrid stock={selectedStock} technical={technical} />
            </section>
          </div>
        </section>

        <section style={{ marginTop: 30 }}>
          <ComparisonTable stocks={stocks} />
        </section>

        <section style={{ marginTop: 30 }}>
          <SectorPerformance sectors={sectorData} />
        </section>
      </main>
    </div>
  )
}
