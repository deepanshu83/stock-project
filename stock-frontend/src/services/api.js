const BASE_URL = 'http://localhost:8000'

const fetchWithTimeout = async (url, timeout = 10000) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      throw new Error('Request timeout — server slow hai ya band hai')
    }
    throw new Error('FastAPI server nahi chal rahi — localhost:8000 check karo')
  }
}

const handleResponse = async (response, defaultMsg) => {
  if (response.status === 404) {
    throw new Error('Stock data nahi mila — symbol check karo')
  }
  if (response.status === 500) {
    throw new Error('Server error — check terminal for details')
  }
  if (!response.ok) {
    try {
      const body = await response.json()
      throw new Error(body.detail || `${defaultMsg}: ${response.statusText}`)
    } catch {
      throw new Error(`${defaultMsg}: ${response.statusText}`)
    }
  }
  return response.json()
}

export const fetchMarketOverview = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/market/overview`)
  return handleResponse(res, 'Market overview nahi aaya')
}

export const fetchAllStocks = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/stocks/all`)
  return handleResponse(res, 'Stock list nahi aaya')
}

export const fetchStockHistory = async (ticker, period = '1y') => {
  const res = await fetchWithTimeout(`${BASE_URL}/stock/${ticker}/history?period=${period}`)
  return handleResponse(res, 'History nahi aaya')
}

export const fetchStockTech = async (ticker) => {
  const res = await fetchWithTimeout(`${BASE_URL}/stock/${ticker}/technical`)
  return handleResponse(res, 'Technical data nahi aaya')
}

export const fetchSectorPerformance = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/sector/performance`)
  return handleResponse(res, 'Sector performance nahi aaya')
}

export const fetchCompare = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/compare`)
  return handleResponse(res, 'Compare data nahi aaya')
}
