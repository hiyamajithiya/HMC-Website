"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator } from "lucide-react"

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTenure, setLoanTenure] = useState("")
  const [tenureType, setTenureType] = useState<"months" | "years">("years")
  const [result, setResult] = useState<{
    emi: number
    totalAmount: number
    totalInterest: number
    principalAmount: number
  } | null>(null)

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount) || 0
    const rate = parseFloat(interestRate) || 0
    let tenure = parseFloat(loanTenure) || 0

    // Convert tenure to months if in years
    if (tenureType === "years") {
      tenure = tenure * 12
    }

    // Monthly interest rate
    const monthlyRate = rate / 12 / 100

    // EMI calculation using formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)

    const totalAmount = emi * tenure
    const totalInterest = totalAmount - principal

    setResult({
      emi: isFinite(emi) ? emi : 0,
      totalAmount: isFinite(totalAmount) ? totalAmount : 0,
      totalInterest: isFinite(totalInterest) ? totalInterest : 0,
      principalAmount: principal,
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
          <h1 className="text-4xl font-heading font-bold mb-4">EMI Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate Equated Monthly Installment for home, car, and personal loans
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
                    Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="e.g., 2500000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      {[1000000, 2500000, 5000000, 10000000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setLoanAmount(amt.toString())}
                          className="text-xs py-1 px-3 rounded border border-border-light hover:border-primary hover:text-primary transition-colors"
                        >
                          {amt >= 10000000
                            ? `₹${amt / 10000000}Cr`
                            : `₹${amt / 100000}L`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 8.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      {["7.5", "8.5", "9.5", "10.5"].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setInterestRate(rate)}
                          className="text-xs py-1 px-3 rounded border border-border-light hover:border-primary hover:text-primary transition-colors"
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-2">
                    <Label htmlFor="loanTenure">Loan Tenure</Label>
                    <div className="flex gap-2">
                      <Input
                        id="loanTenure"
                        type="number"
                        placeholder="e.g., 20"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(e.target.value)}
                        className="flex-1"
                      />
                      <select
                        value={tenureType}
                        onChange={(e) => setTenureType(e.target.value as "months" | "years")}
                        className="px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {tenureType === "years"
                        ? [5, 10, 15, 20, 30].map((tenure) => (
                            <button
                              key={tenure}
                              onClick={() => setLoanTenure(tenure.toString())}
                              className="text-xs py-1 px-3 rounded border border-border-light hover:border-primary hover:text-primary transition-colors"
                            >
                              {tenure}Y
                            </button>
                          ))
                        : [12, 24, 36, 60, 120].map((tenure) => (
                            <button
                              key={tenure}
                              onClick={() => setLoanTenure(tenure.toString())}
                              className="text-xs py-1 px-3 rounded border border-border-light hover:border-primary hover:text-primary transition-colors"
                            >
                              {tenure}M
                            </button>
                          ))}
                    </div>
                  </div>

                  <Button onClick={calculateEMI} className="w-full bg-primary hover:bg-primary-light">
                    Calculate EMI
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">EMI Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-lg text-center">
                        <div className="text-sm opacity-90 mb-2">Monthly EMI</div>
                        <div className="text-4xl font-bold mb-1">{formatCurrency(result.emi)}</div>
                        <div className="text-xs opacity-80">per month</div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Principal Amount</span>
                          <span className="font-semibold">
                            {formatCurrency(result.principalAmount)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Total Interest</span>
                          <span className="font-semibold text-orange-600">
                            {formatCurrency(result.totalInterest)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">Total Payment</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Visual Breakdown */}
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-text-secondary">
                          Payment Breakdown
                        </div>
                        <div className="h-8 flex rounded-lg overflow-hidden">
                          <div
                            className="bg-primary flex items-center justify-center text-white text-xs font-semibold"
                            style={{
                              width: `${(result.principalAmount / result.totalAmount) * 100}%`,
                            }}
                          >
                            Principal
                          </div>
                          <div
                            className="bg-orange-500 flex items-center justify-center text-white text-xs font-semibold"
                            style={{
                              width: `${(result.totalInterest / result.totalAmount) * 100}%`,
                            }}
                          >
                            Interest
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-text-muted">
                          <span>
                            Principal: {((result.principalAmount / result.totalAmount) * 100).toFixed(1)}%
                          </span>
                          <span>
                            Interest: {((result.totalInterest / result.totalAmount) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter loan details to calculate EMI</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Loan Types Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Typical Interest Rates in India</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border-light rounded-lg">
                    <div className="font-semibold text-primary mb-2">Home Loan</div>
                    <div className="text-2xl font-bold text-primary mb-1">8.5% - 9.5%</div>
                    <div className="text-sm text-text-muted">per annum</div>
                  </div>
                  <div className="p-4 border border-border-light rounded-lg">
                    <div className="font-semibold text-primary mb-2">Car Loan</div>
                    <div className="text-2xl font-bold text-primary mb-1">9% - 11%</div>
                    <div className="text-sm text-text-muted">per annum</div>
                  </div>
                  <div className="p-4 border border-border-light rounded-lg">
                    <div className="font-semibold text-primary mb-2">Personal Loan</div>
                    <div className="text-2xl font-bold text-primary mb-1">10% - 16%</div>
                    <div className="text-sm text-text-muted">per annum</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
              <p className="text-sm text-yellow-700">
                This calculator provides approximate EMI calculations for informational purposes only.
                Actual EMI may vary based on bank policies, processing fees, and other charges. Please
                consult with your financial institution for accurate loan calculations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
