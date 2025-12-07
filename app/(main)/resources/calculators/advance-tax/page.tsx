"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Calendar } from "lucide-react"

export default function AdvanceTaxCalculator() {
  const [totalIncome, setTotalIncome] = useState("")
  const [deductions, setDeductions] = useState("")
  const [tdsDeducted, setTdsDeducted] = useState("")
  const [regime, setRegime] = useState<"old" | "new">("new")
  const [result, setResult] = useState<{
    grossIncome: number
    taxableIncome: number
    totalTax: number
    tdsDeducted: number
    advanceTaxPayable: number
    installments: {
      date: string
      percentage: number
      amount: number
      cumulative: number
    }[]
  } | null>(null)

  const calculateIncomeTax = (taxableIncome: number, regime: "old" | "new") => {
    let tax = 0

    if (regime === "new") {
      // New Regime FY 2025-26
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

      // Rebate under section 87A (up to ₹7 lakhs)
      if (taxableIncome <= 700000) {
        tax = Math.max(0, tax - 25000)
      }
    } else {
      // Old Regime
      if (taxableIncome <= 250000) {
        tax = 0
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2
      } else {
        tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.3
      }

      // Rebate under section 87A
      if (taxableIncome <= 500000) {
        tax = Math.max(0, tax - 12500)
      }
    }

    // Add 4% cess
    const totalTax = tax + (tax * 0.04)
    return totalTax
  }

  const calculateAdvanceTax = () => {
    const income = parseFloat(totalIncome) || 0
    const totalDeductions = parseFloat(deductions) || 0
    const tds = parseFloat(tdsDeducted) || 0

    // For new regime, standard deduction is ₹75,000 (FY 2025-26)
    const standardDeduction = regime === "new" ? 75000 : (regime === "old" ? 50000 : 0)
    const taxableIncome = Math.max(income - standardDeduction - totalDeductions, 0)

    const totalTax = calculateIncomeTax(taxableIncome, regime)
    const advanceTaxPayable = Math.max(totalTax - tds, 0)

    // Advance tax installments (if tax liability > ₹10,000)
    const installments = [
      { date: "15th June 2025", percentage: 15, amount: 0, cumulative: 0 },
      { date: "15th September 2025", percentage: 45, amount: 0, cumulative: 0 },
      { date: "15th December 2025", percentage: 75, amount: 0, cumulative: 0 },
      { date: "15th March 2026", percentage: 100, amount: 0, cumulative: 0 },
    ]

    if (advanceTaxPayable >= 10000) {
      let previousCumulative = 0
      installments.forEach((installment) => {
        installment.cumulative = (advanceTaxPayable * installment.percentage) / 100
        installment.amount = installment.cumulative - previousCumulative
        previousCumulative = installment.cumulative
      })
    }

    setResult({
      grossIncome: income,
      taxableIncome,
      totalTax,
      tdsDeducted: tds,
      advanceTaxPayable,
      installments,
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
          <h1 className="text-4xl font-heading font-bold mb-4">Advance Tax Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate advance tax liability and payment schedule for FY 2025-26
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
                    Enter Income Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tax Regime */}
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

                  {/* Total Income */}
                  <div className="space-y-2">
                    <Label htmlFor="totalIncome">Total Annual Income (₹)</Label>
                    <Input
                      id="totalIncome"
                      type="number"
                      placeholder="e.g., 1200000"
                      value={totalIncome}
                      onChange={(e) => setTotalIncome(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Include salary, business income, capital gains, other income
                    </p>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Total Deductions (₹)</Label>
                    <Input
                      id="deductions"
                      type="number"
                      placeholder="e.g., 150000"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      {regime === "new"
                        ? "Limited deductions in new regime. Standard deduction ₹75,000 applied automatically"
                        : "80C, 80D, HRA, etc. Standard deduction ₹50,000 applied automatically"}
                    </p>
                  </div>

                  {/* TDS Deducted */}
                  <div className="space-y-2">
                    <Label htmlFor="tdsDeducted">TDS Already Deducted (₹)</Label>
                    <Input
                      id="tdsDeducted"
                      type="number"
                      placeholder="e.g., 50000"
                      value={tdsDeducted}
                      onChange={(e) => setTdsDeducted(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      TDS on salary, interest, rent, etc. already deducted
                    </p>
                  </div>

                  <Button onClick={calculateAdvanceTax} className="w-full bg-primary hover:bg-primary-light text-white">
                    Calculate Advance Tax
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Tax Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-blue-800 mb-1">Tax Regime: {regime.toUpperCase()}</div>
                        <div className="font-semibold text-blue-900">
                          FY 2025-26 (AY 2026-27)
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Gross Income</span>
                          <span className="font-semibold">{formatCurrency(result.grossIncome)}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Taxable Income</span>
                          <span className="font-semibold">{formatCurrency(result.taxableIncome)}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Total Tax Liability</span>
                          <span className="font-semibold text-red-700">
                            {formatCurrency(result.totalTax)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">TDS Deducted</span>
                          <span className="font-semibold text-green-700">
                            - {formatCurrency(result.tdsDeducted)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">Advance Tax Payable</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.advanceTaxPayable)}
                          </span>
                        </div>
                      </div>

                      {result.advanceTaxPayable >= 10000 ? (
                        <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                          <h4 className="font-semibold text-yellow-900 mb-3">
                            Advance Tax Payment Schedule
                          </h4>
                          <div className="space-y-3">
                            {result.installments.map((inst, index) => (
                              <div key={index} className="flex justify-between items-center pb-2 border-b border-yellow-200">
                                <div>
                                  <div className="text-sm font-semibold text-yellow-900">{inst.date}</div>
                                  <div className="text-xs text-yellow-700">{inst.percentage}% of total</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-yellow-900">
                                    {formatCurrency(inst.amount)}
                                  </div>
                                  <div className="text-xs text-yellow-700">
                                    Cumulative: {formatCurrency(inst.cumulative)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 p-4 rounded-lg mt-6">
                          <h4 className="font-semibold text-green-900 mb-2">✅ No Advance Tax Required</h4>
                          <p className="text-sm text-green-700">
                            Advance tax is not required as your net tax liability after TDS is less than ₹10,000.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter income details to calculate advance tax</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Advance Tax Due Dates */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Advance Tax Payment Schedule (FY 2025-26)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border border-border-light rounded-lg bg-blue-50">
                    <div className="text-sm text-blue-800 mb-1">1st Installment</div>
                    <div className="font-semibold text-blue-900 text-lg">15th June 2025</div>
                    <div className="text-sm text-blue-700 mt-1">15% of tax</div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg bg-green-50">
                    <div className="text-sm text-green-800 mb-1">2nd Installment</div>
                    <div className="font-semibold text-green-900 text-lg">15th Sept 2025</div>
                    <div className="text-sm text-green-700 mt-1">45% of tax</div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg bg-orange-50">
                    <div className="text-sm text-orange-800 mb-1">3rd Installment</div>
                    <div className="font-semibold text-orange-900 text-lg">15th Dec 2025</div>
                    <div className="text-sm text-orange-700 mt-1">75% of tax</div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg bg-red-50">
                    <div className="text-sm text-red-800 mb-1">4th Installment</div>
                    <div className="font-semibold text-red-900 text-lg">15th March 2026</div>
                    <div className="text-sm text-red-700 mt-1">100% of tax</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
                <h3 className="font-semibold text-blue-800 mb-2">Who Must Pay Advance Tax?</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Tax liability exceeds ₹10,000 in a year</div>
                  <div>• Applies to salaried, self-employed, businesses</div>
                  <div>• Senior citizens (60+) with no business income exempt</div>
                  <div>• Pay even if TDS is deducted</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
                <h3 className="font-semibold text-yellow-800 mb-2">Interest on Late/Short Payment</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>• Section 234B: 1% per month (if less than 90% paid)</div>
                  <div>• Section 234C: 1% per month (on each installment)</div>
                  <div>• Calculated from due date to payment date</div>
                  <div>• Better to pay on time to avoid interest</div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
              <p className="text-sm text-yellow-700">
                This calculator provides approximate advance tax calculations for FY 2025-26. Actual tax may vary based on deductions, exemptions, and other income sources. Consult a CA for accurate tax planning and compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
