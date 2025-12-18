"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Info, Loader2, RefreshCw } from "lucide-react"

// GST on FFMC Services (SAC 997157) - Full Fledged Money Changer
// Two methods available:
// Method 1: With RBI Reference Rate - Based on margin (difference between RBI rate and actual rate)
// Method 2: Without RBI Reference Rate - Slab-based calculation

type CalculationMethod = "rbi-rate" | "slab-based"
type TransactionType = "buying" | "selling"

// Currencies for which RBI publishes reference rates
const RBI_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
]

interface RbiRateResult {
  method: "rbi-rate"
  transactionValue: number
  rbiReferenceValue: number
  valueOfSupply: number
  marginPercentage: number
  gstRate: number
  cgst: number
  sgst: number
  igst: number
  totalGST: number
  netPayable: number
  currency: string
}

interface SlabBasedResult {
  method: "slab-based"
  grossAmount: number
  slab: string
  valueOfSupply: number
  gstRate: number
  cgst: number
  sgst: number
  igst: number
  totalGST: number
  netPayable: number
}

type CalculationResult = RbiRateResult | SlabBasedResult

interface RbiRates {
  USD?: number
  EUR?: number
  GBP?: number
  JPY?: number
  date?: string
}

export default function GSTFFMCCalculator() {
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>("rbi-rate")
  const [transactionType, setTransactionType] = useState<TransactionType>("buying")

  // Method 1 (RBI Rate) inputs
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [foreignCurrencyAmount, setForeignCurrencyAmount] = useState("")
  const [transactionDate, setTransactionDate] = useState("")
  const [rbiRate, setRbiRate] = useState("")
  const [actualRate, setActualRate] = useState("")
  const [isFetchingRate, setIsFetchingRate] = useState(false)
  const [rateError, setRateError] = useState("")
  const [fetchedRates, setFetchedRates] = useState<RbiRates | null>(null)

  // Method 2 (Slab-based) inputs
  const [grossAmountINR, setGrossAmountINR] = useState("")

  const [result, setResult] = useState<CalculationResult | null>(null)

  // Format date for display
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Get today's date for max date validation
  const getMaxDate = () => {
    return formatDateForInput(new Date())
  }

  // Fetch RBI reference rates
  const fetchRbiRates = async (date: string) => {
    if (!date) return

    setIsFetchingRate(true)
    setRateError("")

    try {
      // RBI publishes rates on working days only
      // We'll use a proxy API or direct RBI API
      // For now, we'll use the RBI's DBIE (Database on Indian Economy) API format

      const formattedDate = date.split('-').reverse().join('-') // Convert YYYY-MM-DD to DD-MM-YYYY

      // Try to fetch from RBI's official API
      const response = await fetch(`/api/rbi-rates?date=${date}`)

      if (response.ok) {
        const data = await response.json()
        if (data.rates) {
          setFetchedRates(data.rates)
          // Auto-fill the rate for selected currency
          if (data.rates[selectedCurrency]) {
            setRbiRate(data.rates[selectedCurrency].toString())
          }
          return
        }
      }

      // If API fails, show error and allow manual entry
      setRateError("Could not fetch RBI rate. Please enter manually or try a different date.")

    } catch (error) {
      console.error("Error fetching RBI rates:", error)
      setRateError("Could not fetch RBI rate. Please enter manually.")
    } finally {
      setIsFetchingRate(false)
    }
  }

  // When date changes, fetch rates
  useEffect(() => {
    if (transactionDate && calculationMethod === "rbi-rate") {
      fetchRbiRates(transactionDate)
    }
  }, [transactionDate])

  // When currency changes, update rate from fetched rates
  useEffect(() => {
    if (fetchedRates && fetchedRates[selectedCurrency as keyof RbiRates]) {
      const rate = fetchedRates[selectedCurrency as keyof RbiRates]
      if (typeof rate === 'number') {
        setRbiRate(rate.toString())
      }
    }
  }, [selectedCurrency, fetchedRates])

  // Method 1: Calculate GST with RBI Reference Rate
  const calculateWithRbiRate = () => {
    const amount = parseFloat(foreignCurrencyAmount) || 0
    const rbi = parseFloat(rbiRate) || 0
    const actual = parseFloat(actualRate) || 0

    if (amount <= 0 || rbi <= 0 || actual <= 0) {
      return
    }

    // Calculate transaction values
    const rbiReferenceValue = amount * rbi
    const actualValue = amount * actual

    // Value of Supply for FFMC Services (SAC 997157)
    let valueOfSupply = 0

    if (transactionType === "buying") {
      valueOfSupply = Math.abs(rbiReferenceValue - actualValue)
    } else {
      valueOfSupply = Math.abs(actualValue - rbiReferenceValue)
    }

    // As per Rule 32(2)(b) of CGST Rules:
    // If value of supply is 1% or less of gross amount, then 1% of gross amount is deemed value
    const onePercentOfGross = rbiReferenceValue * 0.01
    const marginPercentage = (valueOfSupply / rbiReferenceValue) * 100

    // Apply minimum 1% rule
    const effectiveValueOfSupply = valueOfSupply < onePercentOfGross
      ? onePercentOfGross
      : valueOfSupply

    // GST Rate for FFMC Services is 18% (SAC 997157)
    const gstRate = 18
    const totalGST = (effectiveValueOfSupply * gstRate) / 100
    const cgst = totalGST / 2
    const sgst = totalGST / 2
    const igst = totalGST

    // Net payable (actual transaction + GST)
    const netPayable = actualValue + totalGST

    setResult({
      method: "rbi-rate",
      transactionValue: actualValue,
      rbiReferenceValue,
      valueOfSupply: effectiveValueOfSupply,
      marginPercentage,
      gstRate,
      cgst,
      sgst,
      igst,
      totalGST,
      netPayable,
      currency: selectedCurrency,
    })
  }

  // Method 2: Calculate GST with Slab-based method (without RBI Reference Rate)
  // As per Notification No. 8/2018 - Central Tax (Rate) dated 25.01.2018
  const calculateWithSlabBased = () => {
    const grossAmount = parseFloat(grossAmountINR) || 0

    if (grossAmount <= 0) {
      return
    }

    let valueOfSupply = 0
    let slab = ""

    // Slab-based calculation as per Rule 32(2)(b) read with Notification
    // Slab 1: Up to Rs. 1,00,000 - 1% of gross amount or Rs. 250, whichever is higher
    // Slab 2: Rs. 1,00,001 to Rs. 10,00,000 - Rs. 1,000 + 0.5% of amount exceeding Rs. 1,00,000
    // Slab 3: Above Rs. 10,00,000 - Rs. 5,500 + 0.1% of amount exceeding Rs. 10,00,000, max Rs. 60,000

    if (grossAmount <= 100000) {
      // Slab 1: Up to Rs. 1,00,000
      const onePercent = grossAmount * 0.01
      valueOfSupply = Math.max(onePercent, 250)
      slab = "Up to Rs. 1,00,000"
    } else if (grossAmount <= 1000000) {
      // Slab 2: Rs. 1,00,001 to Rs. 10,00,000
      const excessAmount = grossAmount - 100000
      valueOfSupply = 1000 + (excessAmount * 0.005)
      slab = "Rs. 1,00,001 to Rs. 10,00,000"
    } else {
      // Slab 3: Above Rs. 10,00,000
      const excessAmount = grossAmount - 1000000
      const calculatedValue = 5500 + (excessAmount * 0.001)
      valueOfSupply = Math.min(calculatedValue, 60000)
      slab = "Above Rs. 10,00,000"
    }

    // GST Rate for FFMC Services is 18% (SAC 997157)
    const gstRate = 18
    const totalGST = (valueOfSupply * gstRate) / 100
    const cgst = totalGST / 2
    const sgst = totalGST / 2
    const igst = totalGST

    // Net payable (gross amount + GST)
    const netPayable = grossAmount + totalGST

    setResult({
      method: "slab-based",
      grossAmount,
      slab,
      valueOfSupply,
      gstRate,
      cgst,
      sgst,
      igst,
      totalGST,
      netPayable,
    })
  }

  const handleCalculate = () => {
    if (calculationMethod === "rbi-rate") {
      calculateWithRbiRate()
    } else {
      calculateWithSlabBased()
    }
  }

  const resetForm = () => {
    setForeignCurrencyAmount("")
    setTransactionDate("")
    setRbiRate("")
    setActualRate("")
    setGrossAmountINR("")
    setResult(null)
    setFetchedRates(null)
    setRateError("")
  }

  const handleMethodChange = (method: CalculationMethod) => {
    setCalculationMethod(method)
    resetForm()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getCurrencySymbol = (code: string) => {
    const currency = RBI_CURRENCIES.find(c => c.code === code)
    return currency?.symbol || code
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container-custom">
          <Link
            href="/resources/calculators"
            className="inline-flex items-center text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculators
          </Link>
          <h1 className="text-4xl font-heading font-bold mb-4">GST on FFMC Services</h1>
          <p className="text-xl text-white/90">
            Calculate GST on Full Fledged Money Changer Services (SAC 997157)
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Method Selection */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Select Calculation Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleMethodChange("rbi-rate")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      calculationMethod === "rbi-rate"
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border-light hover:border-primary/50"
                    }`}
                  >
                    <h3 className={`font-semibold mb-2 ${calculationMethod === "rbi-rate" ? "text-primary" : ""}`}>
                      Method 1: With RBI Reference Rate
                    </h3>
                    <p className="text-sm text-text-muted">
                      Calculate based on the difference between RBI reference rate and your actual buying/selling rate.
                      Subject to minimum 1% of gross amount.
                    </p>
                  </button>
                  <button
                    onClick={() => handleMethodChange("slab-based")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      calculationMethod === "slab-based"
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border-light hover:border-primary/50"
                    }`}
                  >
                    <h3 className={`font-semibold mb-2 ${calculationMethod === "slab-based" ? "text-primary" : ""}`}>
                      Method 2: Without RBI Reference Rate (Slab-based)
                    </h3>
                    <p className="text-sm text-text-muted">
                      Calculate using slab-based rates when RBI reference rate is not available.
                      As per Notification No. 8/2018.
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    {calculationMethod === "rbi-rate"
                      ? "Enter Transaction Details (Method 1)"
                      : "Enter Transaction Details (Method 2)"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {calculationMethod === "rbi-rate" ? (
                    <>
                      {/* Transaction Type */}
                      <div className="space-y-2">
                        <Label>Transaction Type</Label>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setTransactionType("buying")}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                              transactionType === "buying"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border-light hover:border-primary/50"
                            }`}
                          >
                            Buying Forex
                            <span className="block text-xs mt-1 font-normal opacity-70">
                              (Customer selling to you)
                            </span>
                          </button>
                          <button
                            onClick={() => setTransactionType("selling")}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                              transactionType === "selling"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border-light hover:border-primary/50"
                            }`}
                          >
                            Selling Forex
                            <span className="block text-xs mt-1 font-normal opacity-70">
                              (Customer buying from you)
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Currency Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="currency">Select Currency</Label>
                        <select
                          id="currency"
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                          className="w-full px-4 py-2 border border-border-light rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                        >
                          {RBI_CURRENCIES.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code} - {currency.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-text-muted">
                          RBI publishes reference rates for these currencies
                        </p>
                      </div>

                      {/* Transaction Date */}
                      <div className="space-y-2">
                        <Label htmlFor="transactionDate">Transaction Date</Label>
                        <div className="relative">
                          <Input
                            id="transactionDate"
                            type="date"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            max={getMaxDate()}
                            className="pr-10"
                          />
                          {isFetchingRate && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-text-muted">
                          RBI rate will be auto-fetched for this date (working days only)
                        </p>
                        {rateError && (
                          <p className="text-xs text-amber-600 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            {rateError}
                          </p>
                        )}
                      </div>

                      {/* Foreign Currency Amount */}
                      <div className="space-y-2">
                        <Label htmlFor="foreignCurrencyAmount">
                          Foreign Currency Amount ({selectedCurrency})
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {getCurrencySymbol(selectedCurrency)}
                          </span>
                          <Input
                            id="foreignCurrencyAmount"
                            type="number"
                            placeholder={`e.g., 1000`}
                            value={foreignCurrencyAmount}
                            onChange={(e) => setForeignCurrencyAmount(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>

                      {/* RBI Reference Rate */}
                      <div className="space-y-2">
                        <Label htmlFor="rbiRate">
                          RBI Reference Rate (per {selectedCurrency} in INR)
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">₹</span>
                            <Input
                              id="rbiRate"
                              type="number"
                              step="0.01"
                              placeholder="e.g., 83.50"
                              value={rbiRate}
                              onChange={(e) => setRbiRate(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                          {transactionDate && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => fetchRbiRates(transactionDate)}
                              disabled={isFetchingRate}
                              title="Refresh RBI Rate"
                            >
                              <RefreshCw className={`h-4 w-4 ${isFetchingRate ? 'animate-spin' : ''}`} />
                            </Button>
                          )}
                        </div>
                        {fetchedRates && fetchedRates.date && (
                          <p className="text-xs text-green-600">
                            Rate fetched for {fetchedRates.date}
                          </p>
                        )}
                      </div>

                      {/* Actual Exchange Rate */}
                      <div className="space-y-2">
                        <Label htmlFor="actualRate">
                          {transactionType === "buying"
                            ? `Your Buying Rate (per ${selectedCurrency} in INR)`
                            : `Your Selling Rate (per ${selectedCurrency} in INR)`}
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">₹</span>
                          <Input
                            id="actualRate"
                            type="number"
                            step="0.01"
                            placeholder={transactionType === "buying" ? "e.g., 82.00" : "e.g., 85.00"}
                            value={actualRate}
                            onChange={(e) => setActualRate(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                        <p className="text-xs text-text-muted">
                          {transactionType === "buying"
                            ? "Rate at which you buy from customer (usually less than RBI rate)"
                            : "Rate at which you sell to customer (usually more than RBI rate)"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Gross Amount in INR */}
                      <div className="space-y-2">
                        <Label htmlFor="grossAmountINR">
                          Gross Transaction Amount (in INR)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">₹</span>
                          <Input
                            id="grossAmountINR"
                            type="number"
                            placeholder="e.g., 500000"
                            value={grossAmountINR}
                            onChange={(e) => setGrossAmountINR(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                        <p className="text-xs text-text-muted">
                          Enter the total INR value of the forex transaction
                        </p>
                      </div>

                      {/* Slab Information */}
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-blue-900 text-sm">Slab Rates (Value of Supply)</h4>
                        <div className="text-xs text-blue-800 space-y-1">
                          <p><strong>Slab 1:</strong> Up to Rs. 1,00,000 → 1% or Rs. 250 (whichever is higher)</p>
                          <p><strong>Slab 2:</strong> Rs. 1,00,001 to Rs. 10,00,000 → Rs. 1,000 + 0.5% of excess</p>
                          <p><strong>Slab 3:</strong> Above Rs. 10,00,000 → Rs. 5,500 + 0.1% of excess (max Rs. 60,000)</p>
                        </div>
                      </div>
                    </>
                  )}

                  <Button onClick={handleCalculate} className="w-full bg-primary hover:bg-primary-light">
                    Calculate GST
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Calculation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {result.method === "rbi-rate" ? (
                          <>
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-text-secondary">Currency</span>
                              <span className="font-semibold">{result.currency}</span>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-text-secondary">Transaction Amount (INR)</span>
                              <span className="font-semibold">{formatCurrency(result.transactionValue)}</span>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-text-secondary">RBI Reference Value (INR)</span>
                              <span className="font-semibold">{formatCurrency(result.rbiReferenceValue)}</span>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                                <Info className="h-4 w-4 mr-2" />
                                Value of Supply (Margin)
                              </h4>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-amber-800">
                                  Margin ({result.marginPercentage.toFixed(2)}%)
                                </span>
                                <span className="font-semibold text-amber-900">
                                  {formatCurrency(result.valueOfSupply)}
                                </span>
                              </div>
                              {result.marginPercentage < 1 && (
                                <p className="text-xs text-amber-700 mt-2">
                                  * Minimum 1% of gross amount applied as per Rule 32(2)(b)
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-text-secondary">Gross Amount (INR)</span>
                              <span className="font-semibold">{formatCurrency(result.grossAmount)}</span>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                                <Info className="h-4 w-4 mr-2" />
                                Value of Supply (Slab-based)
                              </h4>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-amber-800">
                                  Applicable Slab
                                </span>
                                <span className="text-sm font-medium text-amber-900">
                                  {result.slab}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-amber-800">
                                  Value of Supply
                                </span>
                                <span className="font-semibold text-amber-900">
                                  {formatCurrency(result.valueOfSupply)}
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="bg-green-50 p-4 rounded-lg space-y-3">
                          <h4 className="font-semibold text-green-900 mb-2">
                            Intra-State Supply (Within State)
                          </h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800">
                              CGST (9%)
                            </span>
                            <span className="font-semibold text-green-900">
                              {formatCurrency(result.cgst)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800">
                              SGST (9%)
                            </span>
                            <span className="font-semibold text-green-900">
                              {formatCurrency(result.sgst)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Inter-State Supply (Between States)
                          </h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800">IGST (18%)</span>
                            <span className="font-semibold text-blue-900">
                              {formatCurrency(result.igst)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Total GST Payable</span>
                          <span className="font-semibold text-red-600">{formatCurrency(result.totalGST)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">
                            Net Amount (incl. GST)
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.netPayable)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter transaction details to see GST calculation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Information Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>About FFMC GST Calculation (SAC 997157)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">What is FFMC?</h4>
                    <p className="text-sm text-blue-800">
                      Full Fledged Money Changer (FFMC) is an authorized dealer licensed by RBI to
                      buy and sell foreign exchange. FFMC services fall under SAC Code 997157
                      (Foreign Exchange Services).
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">RBI Reference Rates</h4>
                    <p className="text-sm text-purple-800">
                      RBI publishes reference rates for <strong>USD, EUR, GBP, and JPY</strong> on all
                      working days. Rates are published around 1:30 PM IST. For holidays/weekends,
                      previous working day&apos;s rate applies.
                    </p>
                  </div>
                </div>

                {/* Method 1 Information */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Method 1: With RBI Reference Rate</h4>
                  <p className="text-sm text-green-800 mb-2">
                    As per Rule 32(2)(b) of CGST Rules, 2017:
                  </p>
                  <ul className="text-sm text-green-800 list-disc list-inside space-y-1">
                    <li>Value of supply = Difference between RBI reference rate and actual buying/selling rate</li>
                    <li>Subject to a minimum of 1% of the gross amount of currency exchanged</li>
                    <li>Use this method when RBI reference rate for the currency is available</li>
                  </ul>
                </div>

                {/* Method 2 Information */}
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Method 2: Without RBI Reference Rate (Slab-based)</h4>
                  <p className="text-sm text-orange-800 mb-2">
                    As per Notification No. 8/2018-Central Tax (Rate) dated 25.01.2018, when RBI reference rate is not available:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-orange-800 mt-2">
                      <thead>
                        <tr className="border-b border-orange-200">
                          <th className="text-left py-2 pr-4">Gross Amount of Currency</th>
                          <th className="text-left py-2">Value of Supply</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-orange-100">
                          <td className="py-2 pr-4">Up to Rs. 1,00,000</td>
                          <td className="py-2">1% of gross amount or Rs. 250, whichever is higher</td>
                        </tr>
                        <tr className="border-b border-orange-100">
                          <td className="py-2 pr-4">Rs. 1,00,001 to Rs. 10,00,000</td>
                          <td className="py-2">Rs. 1,000 + 0.5% of amount exceeding Rs. 1,00,000</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4">Above Rs. 10,00,000</td>
                          <td className="py-2">Rs. 5,500 + 0.1% of amount exceeding Rs. 10,00,000 (Max Rs. 60,000)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">When to Use Method 1</h4>
                    <ul className="text-sm text-amber-800 list-disc list-inside space-y-1">
                      <li>RBI publishes reference rate for the currency</li>
                      <li>Major currencies: USD, EUR, GBP, JPY</li>
                      <li>When you know both RBI rate and your actual rate</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h4 className="font-semibold text-teal-900 mb-2">When to Use Method 2</h4>
                    <ul className="text-sm text-teal-800 list-disc list-inside space-y-1">
                      <li>RBI does not publish reference rate for the currency</li>
                      <li>Currencies like AED, SGD, THB, AUD, CAD, etc.</li>
                      <li>When only gross INR amount is known</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Example Calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Example 1 */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Example 1: Method 1 - Selling USD 1,000</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><strong>Given:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li>Foreign Currency: USD 1,000</li>
                        <li>RBI Reference Rate: Rs. 83.50</li>
                        <li>FFMC Selling Rate: Rs. 85.00</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Calculation:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li>RBI Value: 1,000 x 83.50 = Rs. 83,500</li>
                        <li>Actual Value: 1,000 x 85.00 = Rs. 85,000</li>
                        <li>Margin (Value of Supply): Rs. 1,500</li>
                        <li>GST @ 18%: Rs. 270</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Example 2 */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Example 2: Method 2 - Transaction of Rs. 5,00,000</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><strong>Given:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li>Gross Amount: Rs. 5,00,000</li>
                        <li>Applicable Slab: Rs. 1,00,001 to Rs. 10,00,000</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Calculation:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li>Value of Supply = Rs. 1,000 + 0.5% of (5,00,000 - 1,00,000)</li>
                        <li>= Rs. 1,000 + Rs. 2,000 = Rs. 3,000</li>
                        <li>GST @ 18%: Rs. 540</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
              <p className="text-sm text-yellow-700">
                This calculator provides approximate GST calculations for FFMC services for informational
                purposes only. The actual GST liability may vary based on specific transaction details
                and prevailing rules. RBI reference rates are fetched from official sources but users should
                verify rates from the RBI website for accuracy. For GST compliance and filing, please consult
                with a qualified Chartered Accountant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
