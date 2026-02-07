"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, TrendingDown, TrendingUp } from "lucide-react"

export default function GSTCompositionCalculator() {
  const [turnover, setTurnover] = useState("")
  const [purchases, setPurchases] = useState("")
  const [expenses, setExpenses] = useState("")
  const [businessType, setBusinessType] = useState<"trading" | "manufacturing" | "services">("trading")
  const [result, setResult] = useState<{
    regularScheme: {
      outputTax: number
      inputCredit: number
      netTax: number
    }
    compositionScheme: {
      tax: number
      rate: number
    }
    savings: number
    recommendation: string
  } | null>(null)

  const compositionRates = {
    trading: 1, // 1% for traders
    manufacturing: 1, // 1% for manufacturers
    services: 6, // 6% for service providers
  }

  const calculateGST = () => {
    const annualTurnover = parseFloat(turnover) || 0
    const annualPurchases = parseFloat(purchases) || 0
    const annualExpenses = parseFloat(expenses) || 0

    // Regular Scheme Calculation (assuming 18% GST rate on average)
    const outputTax = annualTurnover * 0.18
    const inputCredit = (annualPurchases + annualExpenses) * 0.18
    const netTaxRegular = Math.max(outputTax - inputCredit, 0)

    // Composition Scheme Calculation
    const compositionRate = compositionRates[businessType]
    const taxComposition = annualTurnover * (compositionRate / 100)

    // Savings calculation
    const savings = netTaxRegular - taxComposition

    // Recommendation logic
    let recommendation = ""
    if (savings > 0) {
      recommendation = "Composition Scheme is beneficial"
    } else if (savings < 0) {
      recommendation = "Regular Scheme is beneficial"
    } else {
      recommendation = "Both schemes have similar tax liability"
    }

    // Additional checks for composition eligibility
    if (annualTurnover > 15000000) {
      recommendation = "Not eligible for Composition Scheme (Turnover exceeds ₹1.5 Cr)"
    }

    setResult({
      regularScheme: {
        outputTax,
        inputCredit,
        netTax: netTaxRegular,
      },
      compositionScheme: {
        tax: taxComposition,
        rate: compositionRate,
      },
      savings,
      recommendation,
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
          <h1 className="text-4xl font-heading font-bold mb-4">GST Composition vs Regular Scheme Calculator</h1>
          <p className="text-xl text-white/90">
            Compare tax liability under Composition Scheme and Regular Scheme to choose the best option
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
                    Enter Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Business Type */}
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setBusinessType("trading")}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          businessType === "trading"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Trading
                      </button>
                      <button
                        onClick={() => setBusinessType("manufacturing")}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          businessType === "manufacturing"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Manufacturing
                      </button>
                      <button
                        onClick={() => setBusinessType("services")}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          businessType === "services"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Services
                      </button>
                    </div>
                    <p className="text-xs text-text-muted">
                      Composition rate: {compositionRates[businessType]}%
                    </p>
                  </div>

                  {/* Annual Turnover */}
                  <div className="space-y-2">
                    <Label htmlFor="turnover">Annual Turnover (₹)</Label>
                    <Input
                      id="turnover"
                      type="number"
                      placeholder="e.g., 12000000"
                      value={turnover}
                      onChange={(e) => setTurnover(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Total taxable sales (excluding GST). Max ₹1.5 Cr for composition eligibility
                    </p>
                  </div>

                  {/* Annual Purchases */}
                  <div className="space-y-2">
                    <Label htmlFor="purchases">Annual Purchases (₹)</Label>
                    <Input
                      id="purchases"
                      type="number"
                      placeholder="e.g., 8000000"
                      value={purchases}
                      onChange={(e) => setPurchases(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Total purchases (excluding GST)
                    </p>
                  </div>

                  {/* Annual Expenses */}
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Annual Expenses (₹)</Label>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="e.g., 500000"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Business expenses like rent, utilities, etc. (excluding GST)
                    </p>
                  </div>

                  <Button onClick={calculateGST} className="w-full bg-primary hover:bg-primary-light text-white">
                    Compare Schemes
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Comparison Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      {/* Recommendation */}
                      <div className={`p-4 rounded-lg ${
                        result.savings > 0 ? "bg-green-50 border-l-4 border-green-500" :
                        result.savings < 0 ? "bg-blue-50 border-l-4 border-blue-500" :
                        "bg-gray-50 border-l-4 border-gray-500"
                      }`}>
                        <div className="font-semibold mb-1">
                          {result.recommendation.includes("Not eligible") ? "❌ " : "✅ "}
                          Recommendation
                        </div>
                        <div className="text-sm font-bold">{result.recommendation}</div>
                        {result.savings > 0 && !result.recommendation.includes("Not eligible") && (
                          <div className="text-sm mt-2 text-green-800">
                            Annual Savings: {formatCurrency(result.savings)}
                          </div>
                        )}
                      </div>

                      {/* Regular Scheme */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Regular Scheme
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Output Tax (18% avg):</span>
                            <span className="font-semibold text-blue-900">
                              {formatCurrency(result.regularScheme.outputTax)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Input Tax Credit:</span>
                            <span className="font-semibold text-green-700">
                              - {formatCurrency(result.regularScheme.inputCredit)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-blue-200">
                            <span className="text-blue-800 font-semibold">Net Tax Payable:</span>
                            <span className="font-bold text-blue-900">
                              {formatCurrency(result.regularScheme.netTax)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Composition Scheme */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                          <TrendingDown className="h-4 w-4 mr-2" />
                          Composition Scheme
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700">Tax Rate:</span>
                            <span className="font-semibold text-green-900">
                              {result.compositionScheme.rate}% of turnover
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">No Input Tax Credit</span>
                            <span className="text-xs text-green-600">N/A</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-green-200">
                            <span className="text-green-800 font-semibold">Total Tax Payable:</span>
                            <span className="font-bold text-green-900">
                              {formatCurrency(result.compositionScheme.tax)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Difference */}
                      <div className="bg-bg-secondary p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Difference:</span>
                          <span className={`text-lg font-bold ${
                            result.savings > 0 ? "text-green-600" :
                            result.savings < 0 ? "text-red-600" : "text-gray-600"
                          }`}>
                            {result.savings > 0 ? "Save " : result.savings < 0 ? "Pay " : ""}
                            {formatCurrency(Math.abs(result.savings))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter business details to compare schemes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Information Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Composition Scheme Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Composition Scheme Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>✅ Lower tax rate (1% or 6%)</li>
                    <li>✅ Simplified compliance (Quarterly returns)</li>
                    <li>✅ Less paperwork and record-keeping</li>
                    <li>✅ Suitable for small businesses</li>
                    <li>❌ No input tax credit available</li>
                    <li>❌ Cannot charge GST on invoices</li>
                    <li>❌ Cannot do interstate supplies</li>
                    <li>❌ Turnover limit: ₹1.5 Cr (₹75 L for services)</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Regular Scheme Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Regular Scheme Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>✅ Input tax credit available</li>
                    <li>✅ Can do interstate supplies</li>
                    <li>✅ No turnover limit</li>
                    <li>✅ Better for B2B businesses</li>
                    <li>✅ Can issue tax invoices</li>
                    <li>❌ Higher compliance burden</li>
                    <li>❌ Monthly returns required</li>
                    <li>❌ More record-keeping</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Important Notes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
                <h3 className="font-semibold text-blue-800 mb-2">Eligibility Criteria</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Annual turnover up to ₹1.5 Crore</div>
                  <div>• Not engaged in inter-state supplies</div>
                  <div>• Not selling exempt goods</div>
                  <div>• Not an e-commerce operator</div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r">
                <h3 className="font-semibold text-green-800 mb-2">GST 2.0 Rate Changes (w.e.f. 22 Sept 2025)</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• New rate structure: <strong>0%, 5%, 18%, 40%</strong> (12% and 28% slabs eliminated)</div>
                  <div>• 99% of items previously at 12% moved to 5%</div>
                  <div>• 90% of items previously at 28% moved to 18%</div>
                  <div>• New 40% rate for luxury/sin goods (pan masala, tobacco, aerated drinks)</div>
                  <div>• Composition scheme rates remain unchanged</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
                <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  This calculator uses simplified assumptions (18% avg GST rate for regular scheme under GST 2.0). Actual tax may vary based on specific GST rates applicable to your goods/services. Consult a CA for accurate compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
