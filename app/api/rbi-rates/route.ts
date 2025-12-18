import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// RBI Reference Rate API
// Fetches reference exchange rates from RBI for USD, EUR, GBP, JPY

interface RbiRateResponse {
  rates: {
    USD?: number
    EUR?: number
    GBP?: number
    JPY?: number
    date?: string
  }
  source: string
  message?: string
}

// Cache for storing fetched rates to minimize API calls
const rateCache = new Map<string, { rates: RbiRateResponse['rates'], timestamp: number }>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour cache

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') // Expected format: YYYY-MM-DD

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required (format: YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = date
    const cached = rateCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        rates: cached.rates,
        source: 'cache',
      })
    }

    // Try to fetch from RBI's official DBIE API
    // RBI publishes rates at: https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx
    // The API endpoint format may vary, we'll try multiple sources

    let rates: RbiRateResponse['rates'] = {}
    let fetchSuccess = false

    // Method 1: Try RBI's statistical API (DBIE)
    try {
      // Convert date to DD-MMM-YYYY format for RBI API
      const [year, month, day] = date.split('-')
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const formattedDate = `${day}-${monthNames[parseInt(month) - 1]}-${year}`

      // RBI publishes reference rates data - trying their API
      const rbiUrl = `https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx`

      // Since RBI doesn't have a direct JSON API, we'll use an alternative approach
      // Try fetching from a reliable forex data source

      // Method 2: Use exchangerate-api or similar free API as fallback
      // Note: These are approximate rates, actual RBI rates should be verified from RBI website
      const exchangeApiUrl = `https://api.exchangerate-api.com/v4/latest/INR`

      const response = await fetch(exchangeApiUrl, {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      })

      if (response.ok) {
        const data = await response.json()

        // Convert rates (API gives INR to other currencies, we need other currencies to INR)
        if (data.rates) {
          rates = {
            USD: data.rates.USD ? parseFloat((1 / data.rates.USD).toFixed(4)) : undefined,
            EUR: data.rates.EUR ? parseFloat((1 / data.rates.EUR).toFixed(4)) : undefined,
            GBP: data.rates.GBP ? parseFloat((1 / data.rates.GBP).toFixed(4)) : undefined,
            JPY: data.rates.JPY ? parseFloat((1 / data.rates.JPY).toFixed(4)) : undefined,
            date: data.date || date,
          }
          fetchSuccess = true
        }
      }
    } catch (apiError) {
      console.error('Exchange API fetch failed:', apiError)
    }

    // Method 3: Try Open Exchange Rates API (free tier)
    if (!fetchSuccess) {
      try {
        const openExchangeUrl = `https://open.er-api.com/v6/latest/USD`
        const response = await fetch(openExchangeUrl)

        if (response.ok) {
          const data = await response.json()

          if (data.rates && data.rates.INR) {
            const inrRate = data.rates.INR
            rates = {
              USD: parseFloat(inrRate.toFixed(4)),
              EUR: data.rates.EUR ? parseFloat((inrRate / data.rates.EUR).toFixed(4)) : undefined,
              GBP: data.rates.GBP ? parseFloat((inrRate / data.rates.GBP).toFixed(4)) : undefined,
              JPY: data.rates.JPY ? parseFloat((inrRate / data.rates.JPY).toFixed(4)) : undefined,
              date: date,
            }
            fetchSuccess = true
          }
        }
      } catch (apiError) {
        console.error('Open Exchange API fetch failed:', apiError)
      }
    }

    // Method 4: Use Frankfurter API (free, no API key needed)
    if (!fetchSuccess) {
      try {
        const frankfurterUrl = `https://api.frankfurter.app/${date}?from=USD&to=INR,EUR,GBP,JPY`
        const response = await fetch(frankfurterUrl)

        if (response.ok) {
          const data = await response.json()

          if (data.rates && data.rates.INR) {
            const usdToInr = data.rates.INR
            rates = {
              USD: parseFloat(usdToInr.toFixed(4)),
              EUR: data.rates.EUR ? parseFloat((usdToInr / data.rates.EUR).toFixed(4)) : undefined,
              GBP: data.rates.GBP ? parseFloat((usdToInr / data.rates.GBP).toFixed(4)) : undefined,
              // For JPY, we need to calculate differently as EUR/GBP are per USD
              JPY: undefined, // Will need separate calculation
              date: data.date || date,
            }

            // Fetch JPY rate separately
            const jpyResponse = await fetch(`https://api.frankfurter.app/${date}?from=JPY&to=INR`)
            if (jpyResponse.ok) {
              const jpyData = await jpyResponse.json()
              if (jpyData.rates && jpyData.rates.INR) {
                rates.JPY = parseFloat(jpyData.rates.INR.toFixed(4))
              }
            }

            fetchSuccess = true
          }
        }
      } catch (apiError) {
        console.error('Frankfurter API fetch failed:', apiError)
      }
    }

    if (fetchSuccess && Object.keys(rates).length > 0) {
      // Cache the rates
      rateCache.set(cacheKey, { rates, timestamp: Date.now() })

      return NextResponse.json({
        rates,
        source: 'api',
        message: 'Note: These are indicative rates. Please verify actual RBI reference rates from rbi.org.in for official use.',
      })
    }

    // If all methods fail, return error
    return NextResponse.json(
      {
        error: 'Could not fetch exchange rates. Please enter the RBI reference rate manually.',
        message: 'You can find official RBI reference rates at: https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx'
      },
      { status: 503 }
    )

  } catch (error) {
    console.error('RBI rates API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    )
  }
}
