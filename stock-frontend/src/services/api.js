const BASE_URL = 'http://localhost:8000'

export const fetchStockInfo = async (ticker) => {
  const res = await fetch(`${BASE_URL}/stock/${ticker}`)
  if (!res.ok) throw new Error('Stock data nahi aaya')
  return res.json()
}

export const fetchHistory = async (ticker, period = '1y') => {
  const res = await fetch(`${BASE_URL}/stock/${ticker}/history?period=${period}`)
  if (!res.ok) throw new Error('History nahi aaya')
  return res.json()
}

export const fetchCompare = async () => {
  const res = await fetch(`${BASE_URL}/compare`)
  if (!res.ok) throw new Error('Compare data nahi aaya')
  return res.json()
}
