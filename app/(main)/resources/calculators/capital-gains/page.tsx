"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react"

type AssetType = "equity" | "property" | "gold" | "debt"
type HoldingPeriod = "short-term" | "long-term"

export default function CapitalGainsCalculator() {
  const [assetType, setAssetType] = useState<AssetType>("equity")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [salePrice, setSalePrice] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [saleDate, setSaleDate] = useState("")
  const [indexation, setIndexation] = useState(false)
  const [result, setResult] = useState<{
    capitalGain: number
    holdingPeriod: HoldingPeriod
    holdingMonths: number
    taxRate: number
    taxAmount: number
    netProceeds: number
    assetType: string
  } | null>(null)

  const calculateHoldingPeriod = (purchase: string, sale: string): number => {
    const purchaseD = new Date(purchase)
    const saleD = new Date(sale)
    const months = (saleD.getFullYear() - purchaseD.getFullYear()) * 12 + (saleD.getMonth() - purchaseD.getMonth())
    return months
  }

  const getHoldingPeriodType = (months: number, asset: AssetType): HoldingPeriod => {
    if (asset === "equity") {
      return months >= 12 ? "long-term" : "short-term"
    } else if (asset === "property" || asset === "gold") {
      return months >= 24 ? "long-term" : "short-term"
    } else {
      // Debt mutual funds - no LTCG benefit since Budget 2023
      // Always treated as short-term (taxed at slab rate)
      return "short-term"
    }
  }

  const getTaxRate = (asset: AssetType, period: HoldingPeriod): number => {
    // FY 2025-26 / 2026-27 Capital Gains Tax Rates
    if (asset === "equity") {
      if (period === "long-term") {
        return 12.5 // LTCG on equity - 12.5%
      } else {
        return 20 // STCG on equity - 20%
      }
    } else if (asset === "property" || asset === "gold") {
      if (period === "long-term") {
        return 12.5 // LTCG on property/gold - 12.5%
      } else {
        return 30 // STCG as per income tax slab (assuming 30% for calculation)
      }
    } else {
      // Debt funds - always taxed at slab rate (no LTCG benefit since Budget 2023)
      return 30 // As per slab (assuming highest slab for calculation)
    }
  }

  const calculateCapitalGains = () => {
    const purchase = parseFloat(purchasePrice) || 0
    const sale = parseFloat(salePrice) || 0

    if (!purchaseDate || !saleDate) {
      alert("Please enter both purchase and sale dates")
      return
    }

    const holdingMonths = calculateHoldingPeriod(purchaseDate, saleDate)
    const holdingPeriod = getHoldingPeriodType(holdingMonths, assetType)

    // Simple capital gain (without indexation for now)
    let capitalGain = sale - purchase

    // Apply indexation for long-term property if enabled (not available for debt funds)
    if (indexation && holdingPeriod === "long-term" && assetType === "property") {
      // Simplified indexation calculation (using average 5% inflation)
      const years = holdingMonths / 12
      const inflationFactor = Math.pow(1.05, years)
      const indexedPurchase = purchase * inflationFactor
      capitalGain = sale - indexedPurchase
    }

    const taxRate = getTaxRate(assetType, holdingPeriod)
    const taxAmount = (capitalGain * taxRate) / 100
    const netProceeds = sale - taxAmount

    setResult({
      capitalGain,
      holdingPeriod,
      holdingMonths,
      taxRate,
      taxAmount,
      netProceeds,
      assetType: assetType,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value)
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
          <h1 className="text-4xl font-heading font-bold mb-4">Capital Gains Tax Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate short-term and long-term capital gains tax on equity, property, and other assets (FY 2025-26 / 2026-27)
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    Enter Asset Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Asset Type */}
                  <div className="space-y-2">
                    <Label>Asset Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAssetType("equity")}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          assetType === "equity"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Equity/Stocks
                      </button>
                      <button
                        onClick={() => setAssetType("property")}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          assetType === "property"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Property
                      </button>
                      <button
                        onClick={() => setAssetType("gold")}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          assetType === "gold"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Gold
                      </button>
                      <button
                        onClick={() => setAssetType("debt")}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          assetType === "debt"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Debt Funds
                      </button>
                    </div>
                  </div>

                  {/* Purchase Price */}
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      placeholder="e.g., 1000000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                    />
                  </div>

                  {/* Sale Price */}
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price (₹)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      placeholder="e.g., 1500000"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                    />
                  </div>

                  {/* Purchase Date */}
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                    />
                  </div>

                  {/* Sale Date */}
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Sale Date</Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                    />
                  </div>

                  {/* Indexation (only for property LTCG - debt funds have no LTCG benefit) */}
                  {assetType === "property" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="indexation"
                          checked={indexation}
                          onChange={(e) => setIndexation(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="indexation" className="cursor-pointer">
                          Apply Indexation (for LTCG)
                        </Label>
                      </div>
                      <p className="text-xs text-text-muted">
                        Indexation benefit adjusts purchase price for inflation
                      </p>
                    </div>
                  )}

                  <Button onClick={calculateCapitalGains} className="w-full bg-primary hover:bg-primary-light text-white">
                    Calculate Capital Gains
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Capital Gains Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-blue-800 mb-1">Asset Type: {result.assetType.toUpperCase()}</div>
                        <div className="font-semibold text-blue-900">
                          Holding Period: {result.holdingPeriod.toUpperCase()} ({result.holdingMonths} months)
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          Tax Rate: {result.taxRate}%
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Sale Price</span>
                          <span className="font-semibold">{formatCurrency(parseFloat(salePrice))}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Purchase Price</span>
                          <span className="font-semibold">- {formatCurrency(parseFloat(purchasePrice))}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b bg-green-50 -mx-4 px-4 py-3 rounded">
                          <span className="text-text-secondary">Capital Gain</span>
                          <span className="font-semibold text-green-700">
                            {formatCurrency(result.capitalGain)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b bg-red-50 -mx-4 px-4 py-3 rounded">
                          <span className="text-text-secondary">Tax @ {result.taxRate}%</span>
                          <span className="font-semibold text-red-700">
                            - {formatCurrency(result.taxAmount)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">Net Proceeds</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.netProceeds)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-yellow-900 mb-2">Summary</h4>
                        <div className="text-sm text-yellow-800 space-y-1">
                          <div>• Sale Proceeds: {formatCurrency(parseFloat(salePrice))}</div>
                          <div>• Capital Gain: {formatCurrency(result.capitalGain)}</div>
                          <div>• Tax Liability: {formatCurrency(result.taxAmount)}</div>
                          <div className="font-semibold pt-2 border-t border-yellow-200 mt-2">
                            • Net Amount in Hand: {formatCurrency(result.netProceeds)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter asset details to calculate capital gains</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tax Rates Reference - FY 2025-26 */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Capital Gains Tax Rates (FY 2025-26 / 2026-27)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Equity/Stocks/Mutual Funds</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between pb-2 border-b">
                        <span>Short-term (&lt;12 months)</span>
                        <span className="font-semibold">20%</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span>Long-term (≥12 months)</span>
                        <span className="font-semibold">12.5%</span>
                      </div>
                      <p className="text-xs text-text-muted mt-2">
                        LTCG exemption up to ₹1.25 lakh per year
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Property/Gold/Other Assets</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between pb-2 border-b">
                        <span>Short-term (&lt;24 months)</span>
                        <span className="font-semibold">As per slab</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span>Long-term (≥24 months)</span>
                        <span className="font-semibold">12.5%</span>
                      </div>
                      <p className="text-xs text-text-muted mt-2">
                        Indexation benefit available for property
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Debt Mutual Funds</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between pb-2 border-b">
                        <span>Any holding period</span>
                        <span className="font-semibold">As per slab</span>
                      </div>
                      <p className="text-xs text-red-600 mt-2 font-medium">
                        No LTCG benefit since Budget 2023. Always taxed at slab rate regardless of holding period.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
                <h3 className="font-semibold text-blue-800 mb-2">Key Capital Gains Rules</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• STCG on equity: 20% (increased from 15% in Budget 2024)</div>
                  <div>• LTCG on equity: 12.5% above ₹1.25 lakh exemption</div>
                  <div>• Uniform 12.5% LTCG rate for property, gold, unlisted shares</div>
                  <div>• Debt funds: Always at slab rate (no LTCG benefit since Budget 2023)</div>
                  <div>• FY 2026-27: Same rates under New Income Tax Act 2025 (Sec 67, 196-198)</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
                <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  This calculator provides approximate capital gains calculations. Actual tax may vary based on exemptions, deductions, and specific circumstances. Consult a CA for accurate tax planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
