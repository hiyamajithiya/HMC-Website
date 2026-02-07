"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator } from "lucide-react"

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("")
  const [deductions80C, setDeductions80C] = useState("")
  const [deductions80D, setDeductions80D] = useState("")
  const [otherDeductions, setOtherDeductions] = useState("")
  const [regime, setRegime] = useState<"old" | "new">("new")
  const [financialYear, setFinancialYear] = useState<"2025-26" | "2026-27">("2026-27")
  const [isSalaried, setIsSalaried] = useState<boolean>(true)
  const [result, setResult] = useState<{
    taxableIncome: number
    tax: number
    cess: number
    totalTax: number
    rebate: number
  } | null>(null)

  const calculateTax = () => {
    const totalIncome = parseFloat(income) || 0
    const ded80C = parseFloat(deductions80C) || 0
    const ded80D = parseFloat(deductions80D) || 0
    const otherDed = parseFloat(otherDeductions) || 0

    let taxableIncome = totalIncome
    let tax = 0
    let rebate = 0

    if (regime === "old") {
      // Old regime with deductions
      const totalDeductions = Math.min(ded80C, 150000) + ded80D + otherDed
      const standardDeduction = isSalaried ? 50000 : 0
      taxableIncome = Math.max(totalIncome - totalDeductions - standardDeduction, 0)

      // Old regime tax slabs (same for both years)
      if (taxableIncome <= 250000) {
        tax = 0
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2
      } else {
        tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.3
      }

      // Section 87A Rebate for Old Regime (up to Rs 5 lakh income)
      if (taxableIncome <= 500000) {
        rebate = Math.min(tax, 12500)
      }
    } else {
      // New regime tax slabs (FY 2025-26 and FY 2026-27 - same slabs)
      const standardDeduction = isSalaried ? 75000 : 0
      taxableIncome = Math.max(totalIncome - standardDeduction, 0)

      if (taxableIncome <= 400000) {
        tax = 0
      } else if (taxableIncome <= 800000) {
        tax = (taxableIncome - 400000) * 0.05
      } else if (taxableIncome <= 1200000) {
        tax = 20000 + (taxableIncome - 800000) * 0.1
      } else if (taxableIncome <= 1600000) {
        tax = 20000 + 40000 + (taxableIncome - 1200000) * 0.15
      } else if (taxableIncome <= 2000000) {
        tax = 20000 + 40000 + 60000 + (taxableIncome - 1600000) * 0.2
      } else if (taxableIncome <= 2400000) {
        tax = 20000 + 40000 + 60000 + 80000 + (taxableIncome - 2000000) * 0.25
      } else {
        tax = 20000 + 40000 + 60000 + 80000 + 100000 + (taxableIncome - 2400000) * 0.3
      }

      // Section 87A Rebate (up to Rs 12 lakh income)
      if (taxableIncome <= 1200000) {
        rebate = Math.min(tax, 60000)
      }
    }

    // Apply rebate
    const taxAfterRebate = Math.max(tax - rebate, 0)
    const cess = taxAfterRebate * 0.04 // 4% health and education cess
    const totalTax = taxAfterRebate + cess

    setResult({
      taxableIncome,
      tax,
      cess,
      totalTax,
      rebate,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Section references based on FY
  const rebateSection = financialYear === "2026-27" ? "Section 157 (earlier 87A)" : "Section 87A"
  const deduction80CLabel = financialYear === "2026-27" ? "Section 123 (earlier 80C)" : "Section 80C"
  const deduction80DLabel = financialYear === "2026-27" ? "Section 126 (earlier 80D)" : "Section 80D"

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
          <h1 className="text-4xl font-heading font-bold mb-4">Income Tax Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate your income tax for FY 2025-26 and FY 2026-27 under old and new tax regime
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
                    Enter Your Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Financial Year Selection */}
                  <div className="space-y-2">
                    <Label>Financial Year</Label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setFinancialYear("2025-26")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          financialYear === "2025-26"
                            ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                            : "border-border-light hover:border-secondary/50"
                        }`}
                      >
                        FY 2025-26
                      </button>
                      <button
                        onClick={() => setFinancialYear("2026-27")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          financialYear === "2026-27"
                            ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                            : "border-border-light hover:border-secondary/50"
                        }`}
                      >
                        FY 2026-27
                      </button>
                    </div>
                    {financialYear === "2026-27" && (
                      <p className="text-xs text-blue-600 font-medium">
                        New Income Tax Act 2025 applicable from 1st April 2026
                      </p>
                    )}
                  </div>

                  {/* Tax Regime Selection */}
                  <div className="space-y-2">
                    <Label>Tax Regime</Label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setRegime("new")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          regime === "new"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        New Regime
                      </button>
                      <button
                        onClick={() => setRegime("old")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          regime === "old"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Old Regime
                      </button>
                    </div>
                  </div>

                  {/* Income Type */}
                  <div className="space-y-2">
                    <Label>Income Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsSalaried(true)}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          isSalaried
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Salaried
                      </button>
                      <button
                        onClick={() => setIsSalaried(false)}
                        className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                          !isSalaried
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Business/Other
                      </button>
                    </div>
                    <p className="text-xs text-text-muted">
                      Standard deduction ({regime === "old" ? "\u20B950,000" : "\u20B975,000"}) applies only to salaried individuals
                    </p>
                  </div>

                  {/* Gross Annual Income */}
                  <div className="space-y-2">
                    <Label htmlFor="income">Gross Annual Income (\u20B9)</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="e.g., 1200000"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>

                  {/* Deductions (only for old regime) */}
                  {regime === "old" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="80c">Deductions under {deduction80CLabel} (\u20B9)</Label>
                        <Input
                          id="80c"
                          type="number"
                          placeholder="Max: 150000"
                          value={deductions80C}
                          onChange={(e) => setDeductions80C(e.target.value)}
                        />
                        <p className="text-xs text-text-muted">
                          PPF, ELSS, Life Insurance, etc. (Max: \u20B91,50,000)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="80d">Deductions under {deduction80DLabel} (\u20B9)</Label>
                        <Input
                          id="80d"
                          type="number"
                          placeholder="Health insurance premium"
                          value={deductions80D}
                          onChange={(e) => setDeductions80D(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="other">Other Deductions (\u20B9)</Label>
                        <Input
                          id="other"
                          type="number"
                          placeholder={financialYear === "2026-27" ? "Sec 129 (80E), Sec 133 (80G), etc." : "80E, 80G, etc."}
                          value={otherDeductions}
                          onChange={(e) => setOtherDeductions(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <Button onClick={calculateTax} className="w-full bg-primary hover:bg-primary-light text-white">
                    Calculate Tax
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
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Taxable Income</span>
                          <span className="font-semibold">{formatCurrency(result.taxableIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Income Tax</span>
                          <span className="font-semibold">{formatCurrency(result.tax)}</span>
                        </div>
                        {result.rebate > 0 && (
                          <div className="flex justify-between items-center pb-2 border-b bg-green-50 -mx-4 px-4 py-2">
                            <span className="text-green-700 font-medium">
                              Less: Rebate u/s {rebateSection}
                            </span>
                            <span className="font-semibold text-green-700">
                              - {formatCurrency(result.rebate)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Health & Education Cess (4%)</span>
                          <span className="font-semibold">{formatCurrency(result.cess)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">Total Tax Payable</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.totalTax)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          FY {financialYear} - {regime === "new" ? "New" : "Old"} Regime
                          {financialYear === "2026-27" && " (Income Tax Act 2025)"}
                        </h4>
                        <p className="text-sm text-blue-800 mb-2">
                          {regime === "new"
                            ? "New regime offers enhanced tax slabs with standard deduction of \u20B975,000. Income up to \u20B912,75,000 (salaried) is effectively tax-free."
                            : "Old regime allows deductions under various sections but has higher tax rates."}
                        </p>
                        {result.rebate > 0 && (
                          <p className="text-sm text-green-800 font-medium">
                            {"\u2713"} {rebateSection} rebate applied: Income up to {regime === "new" ? "\u20B912 lakh is tax-free!" : "\u20B95 lakh is tax-free"}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter your income details and click Calculate Tax to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tax Slabs Information */}
            <div className="mt-12 space-y-8">
              <h2 className="text-2xl font-heading font-bold text-primary text-center">
                Tax Slabs for FY {financialYear}
                {financialYear === "2026-27" && " (New Income Tax Act 2025)"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className={regime === "new" ? "ring-2 ring-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>New Tax Regime Slabs</span>
                      {regime === "new" && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                          Selected
                        </span>
                      )}
                    </CardTitle>
                    {financialYear === "2026-27" && (
                      <p className="text-xs text-blue-600">Section 202 (earlier Section 115BAC)</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>\u20B90 - \u20B94,00,000</span>
                        <span className="font-semibold">Nil</span>
                      </div>
                      <div className="flex justify-between">
                        <span>\u20B94,00,001 - \u20B98,00,000</span>
                        <span className="font-semibold">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>\u20B98,00,001 - \u20B912,00,000</span>
                        <span className="font-semibold">10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>\u20B912,00,001 - \u20B916,00,000</span>
                        <span className="font-semibold">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>\u20B916,00,001 - \u20B920,00,000</span>
                        <span className="font-semibold">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>\u20B920,00,001 - \u20B924,00,000</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Above \u20B924,00,000</span>
                        <span className="font-semibold">30%</span>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-text-muted">
                          Standard deduction: \u20B975,000 (for salaried only)
                        </p>
                        <p className="text-xs text-green-700 font-medium mt-2">
                          Rebate u/s {rebateSection}: Income up to \u20B912 lakh is tax-free!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={regime === "old" ? "ring-2 ring-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Old Tax Regime Slabs</span>
                      {regime === "old" && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                          Selected
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>\u20B90 - \u20B92,50,000</span>
                        <span className="font-semibold">Nil</span>
                      </div>
                      <div className="flex justify-between">
                        <span>\u20B92,50,001 - \u20B95,00,000</span>
                        <span className="font-semibold">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>\u20B95,00,001 - \u20B910,00,000</span>
                        <span className="font-semibold">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Above \u20B910,00,000</span>
                        <span className="font-semibold">30%</span>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-text-muted">
                          Standard deduction: \u20B950,000 (for salaried only)
                          <br />
                          Deductions under {financialYear === "2026-27" ? "Sec 123 (80C), Sec 126 (80D)" : "80C, 80D"}, and other sections available
                        </p>
                        <p className="text-xs text-green-700 font-medium mt-2">
                          Rebate u/s {rebateSection}: Income up to \u20B95 lakh is tax-free
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info Note */}
              {financialYear === "2026-27" ? (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      New Income Tax Act 2025 (Effective 1st April 2026)
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• The new Act replaces the Income Tax Act 1961 with simplified language</li>
                      <li>• <strong>Tax slabs and rates remain the same</strong> as FY 2025-26 &mdash; no change in tax liability</li>
                      <li>• Section numbers have changed: 80C &rarr; 123, 80D &rarr; 126, 87A &rarr; 157, 115BAC &rarr; 202</li>
                      <li>• &ldquo;Previous Year&rdquo; and &ldquo;Assessment Year&rdquo; replaced with single &ldquo;Tax Year&rdquo; concept</li>
                      <li>• All 69+ TDS sections consolidated into Section 393</li>
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-900 mb-2">
                      What&apos;s New in FY 2025-26?
                    </h3>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>• Tax-free income increased to ₹4,00,000 (from ₹3,00,000)</li>
                      <li>• New 25% slab for income ₹20-24 lakh (7 slabs instead of 6)</li>
                      <li>• <strong>Section 87A rebate increased:</strong> Income up to ₹12,00,000 is now tax-free in new regime!</li>
                      <li>• Standard deduction: ₹75,000 for salaried (new regime)</li>
                      <li>• Effectively ₹12,75,000 tax-free for salaried individuals</li>
                      <li>• Old regime slabs remain unchanged</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
              <p className="text-sm text-yellow-700">
                This calculator provides approximate tax calculations for informational purposes only.
                Actual tax liability may vary based on individual circumstances, surcharge applicability,
                and specific exemptions. For accurate tax planning and filing, please consult with a
                qualified Chartered Accountant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
