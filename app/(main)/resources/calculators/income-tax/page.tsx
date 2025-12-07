"use client"

import { useState } from "react"
import { Metadata } from "next"
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
  const [financialYear, setFinancialYear] = useState<"2024-25" | "2025-26">("2025-26")
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
      const standardDeduction = isSalaried ? 50000 : 0 // Standard deduction only for salaried
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

      // Section 87A Rebate for Old Regime (up to ₹5 lakh income)
      if (taxableIncome <= 500000) {
        rebate = Math.min(tax, 12500)
      }
    } else {
      // New regime tax slabs
      if (financialYear === "2024-25") {
        // FY 2024-25 New Regime
        const standardDeduction = isSalaried ? 50000 : 0 // Standard deduction only for salaried
        taxableIncome = Math.max(totalIncome - standardDeduction, 0)

        if (taxableIncome <= 300000) {
          tax = 0
        } else if (taxableIncome <= 600000) {
          tax = (taxableIncome - 300000) * 0.05
        } else if (taxableIncome <= 900000) {
          tax = 15000 + (taxableIncome - 600000) * 0.1
        } else if (taxableIncome <= 1200000) {
          tax = 15000 + 30000 + (taxableIncome - 900000) * 0.15
        } else if (taxableIncome <= 1500000) {
          tax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.2
        } else {
          tax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.3
        }

        // Section 87A Rebate for FY 2024-25 (up to ₹7 lakh income)
        if (taxableIncome <= 700000) {
          rebate = Math.min(tax, 25000)
        }
      } else {
        // FY 2025-26 New Regime (Enhanced slabs)
        const standardDeduction = isSalaried ? 75000 : 0 // Standard deduction only for salaried
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
        } else {
          tax = 20000 + 40000 + 60000 + 80000 + (taxableIncome - 2000000) * 0.3
        }

        // Section 87A Rebate for FY 2025-26 (up to ₹12 lakh income)
        if (taxableIncome <= 1200000) {
          rebate = Math.min(tax, 60000)
        }
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
            Calculate your income tax for FY 2024-25 and FY 2025-26 under old and new tax regime
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
                        onClick={() => setFinancialYear("2024-25")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          financialYear === "2024-25"
                            ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                            : "border-border-light hover:border-secondary/50"
                        }`}
                      >
                        FY 2024-25
                      </button>
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
                    </div>
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
                      Standard deduction ({regime === "old" ? "₹50,000" : financialYear === "2025-26" ? "₹75,000" : "₹50,000"}) applies only to salaried individuals
                    </p>
                  </div>

                  {/* Gross Annual Income */}
                  <div className="space-y-2">
                    <Label htmlFor="income">Gross Annual Income (₹)</Label>
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
                        <Label htmlFor="80c">Deductions under 80C (₹)</Label>
                        <Input
                          id="80c"
                          type="number"
                          placeholder="Max: 150000"
                          value={deductions80C}
                          onChange={(e) => setDeductions80C(e.target.value)}
                        />
                        <p className="text-xs text-text-muted">
                          PPF, ELSS, Life Insurance, etc. (Max: ₹1,50,000)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="80d">Deductions under 80D (₹)</Label>
                        <Input
                          id="80d"
                          type="number"
                          placeholder="Health insurance premium"
                          value={deductions80D}
                          onChange={(e) => setDeductions80D(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="other">Other Deductions (₹)</Label>
                        <Input
                          id="other"
                          type="number"
                          placeholder="80E, 80G, etc."
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
                              Less: Rebate u/s 87A
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
                        </h4>
                        <p className="text-sm text-blue-800 mb-2">
                          {regime === "new"
                            ? financialYear === "2025-26"
                              ? "New regime for FY 2025-26 offers enhanced tax slabs with standard deduction of ₹75,000."
                              : "New regime offers lower tax rates but does not allow most deductions and exemptions."
                            : "Old regime allows deductions under various sections but has higher tax rates."}
                        </p>
                        {result.rebate > 0 && (
                          <p className="text-sm text-green-800 font-medium">
                            ✓ Section 87A rebate applied:
                            {regime === "new"
                              ? financialYear === "2025-26"
                                ? " Income up to ₹12 lakh is tax-free!"
                                : " Rebate available for income up to ₹7 lakh"
                              : " Rebate available for income up to ₹5 lakh"}
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
                  </CardHeader>
                  <CardContent>
                    {financialYear === "2024-25" ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>₹0 - ₹3,00,000</span>
                          <span className="font-semibold">Nil</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹3,00,001 - ₹6,00,000</span>
                          <span className="font-semibold">5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹6,00,001 - ₹9,00,000</span>
                          <span className="font-semibold">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹9,00,001 - ₹12,00,000</span>
                          <span className="font-semibold">15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹12,00,001 - ₹15,00,000</span>
                          <span className="font-semibold">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Above ₹15,00,000</span>
                          <span className="font-semibold">30%</span>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-text-muted">
                            Standard deduction: ₹50,000 (for salaried only)
                          </p>
                          <p className="text-xs text-green-700 font-medium mt-2">
                            Rebate u/s 87A: Income up to ₹7 lakh is tax-free
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>₹0 - ₹4,00,000</span>
                          <span className="font-semibold">Nil</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹4,00,001 - ₹8,00,000</span>
                          <span className="font-semibold">5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹8,00,001 - ₹12,00,000</span>
                          <span className="font-semibold">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹12,00,001 - ₹16,00,000</span>
                          <span className="font-semibold">15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹16,00,001 - ₹20,00,000</span>
                          <span className="font-semibold">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Above ₹20,00,000</span>
                          <span className="font-semibold">30%</span>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-text-muted">
                            Standard deduction: ₹75,000 (for salaried only)
                          </p>
                          <p className="text-xs text-green-700 font-medium mt-2">
                            Rebate u/s 87A: Income up to ₹12 lakh is tax-free!
                          </p>
                        </div>
                      </div>
                    )}
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
                        <span>₹0 - ₹2,50,000</span>
                        <span className="font-semibold">Nil</span>
                      </div>
                      <div className="flex justify-between">
                        <span>₹2,50,001 - ₹5,00,000</span>
                        <span className="font-semibold">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>₹5,00,001 - ₹10,00,000</span>
                        <span className="font-semibold">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Above ₹10,00,000</span>
                        <span className="font-semibold">30%</span>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-text-muted">
                          Standard deduction: ₹50,000 (for salaried only)
                          <br />
                          Deductions under 80C, 80D, and other sections available
                        </p>
                        <p className="text-xs text-green-700 font-medium mt-2">
                          Rebate u/s 87A: Income up to ₹5 lakh is tax-free
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Note */}
              {financialYear === "2025-26" && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-900 mb-2">
                      What's New in FY 2025-26?
                    </h3>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>• Enhanced standard deduction increased to ₹75,000 (from ₹50,000)</li>
                      <li>• Tax-free income increased to ₹4,00,000 (from ₹3,00,000)</li>
                      <li>• <strong>Section 87A rebate increased:</strong> Income up to ₹12,00,000 is now tax-free in new regime! (previously ₹7 lakh)</li>
                      <li>• Revised tax slabs with better thresholds for middle-income earners</li>
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
                Actual tax liability may vary based on individual circumstances. For accurate tax planning
                and filing, please consult with a qualified Chartered Accountant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
