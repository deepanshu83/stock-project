const BASE_URL = 'http://localhost:8000'

const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${errorMessage}: ${body || response.statusText}`)
  }
  return response.json()
}

export const fetchMarketOverview = async () => {
  const res = await fetch(`${BASE_URL}/market/overview`)
  return handleResponse(res, 'Market overview nahi aaya')
}

export const fetchAllStocks = async () => {
  const res = await fetch(`${BASE_URL}/stocks/all`)
  return handleResponse(res, 'Stock list nahi aaya')
}

export const fetchStockHistory = async (ticker, period = '1y') => {
  const res = await fetch(`${BASE_URL}/stock/${ticker}/history?period=${period}`)
  return handleResponse(res, 'History nahi aaya')
}

export const fetchStockTech = async (ticker) => {
  const res = await fetch(`${BASE_URL}/stock/${ticker}/technical`)
  return handleResponse(res, 'Technical data nahi aaya')
}

export const fetchSectorPerformance = async () => {
  const res = await fetch(`${BASE_URL}/sector/performance`)
  return handleResponse(res, 'Sector performance nahi aaya')
}

export const fetchCompare = async () => {
  const res = await fetch(`${BASE_URL}/compare`)
  return handleResponse(res, 'Compare data nahi aaya')
}
