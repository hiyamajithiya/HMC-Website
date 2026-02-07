"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Calendar, Building2, Users, User } from "lucide-react"

type AssesseeType = "individual" | "company" | "partnership"
type TaxRegime = "old" | "new"
type CompanyType = "domestic" | "domestic_new" | "foreign"
type FinancialYear = "2025-26" | "2026-27"

export default function AdvanceTaxCalculator() {
  const [assesseeType, setAssesseeType] = useState<AssesseeType>("individual")
  const [totalIncome, setTotalIncome] = useState("")
  const [deductions, setDeductions] = useState("")
  const [tdsDeducted, setTdsDeducted] = useState("")
  const [regime, setRegime] = useState<TaxRegime>("new")
  const [financialYear, setFinancialYear] = useState<FinancialYear>("2026-27")
  const [companyType, setCompanyType] = useState<CompanyType>("domestic")
  const [turnoverBelow400Cr, setTurnoverBelow400Cr] = useState(true)
  const [result, setResult] = useState<{
    grossIncome: number
    taxableIncome: number
    totalTax: number
    tdsDeducted: number
    advanceTaxPayable: number
    taxRate: string
    installments: {
      date: string
      percentage: number
      amount: number
      cumulative: number
    }[]
  } | null>(null)

  const calculateIndividualTax = (taxableIncome: number, regime: TaxRegime) => {
    let tax = 0

    if (regime === "new") {
      // New Regime FY 2025-26 / 2026-27 (7 slabs including 25%)
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

      // Rebate under section 87A (up to ₹12 lakhs)
      if (taxableIncome <= 1200000) {
        tax = Math.max(0, tax - 60000)
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
    return { tax: totalTax, rate: regime === "new" ? "Slab (New Regime)" : "Slab (Old Regime)" }
  }

  const calculateCompanyTax = (taxableIncome: number, companyType: CompanyType, turnoverBelow400Cr: boolean) => {
    let rate = 0
    let rateDescription = ""

    if (companyType === "domestic_new") {
      // Section 115BAA - New manufacturing companies
      rate = 0.22
      rateDescription = "22% (Section 115BAA)"
    } else if (companyType === "domestic") {
      if (turnoverBelow400Cr) {
        rate = 0.25
        rateDescription = "25% (Turnover ≤ ₹400 Cr)"
      } else {
        rate = 0.30
        rateDescription = "30% (Turnover > ₹400 Cr)"
      }
    } else {
      // Foreign company
      rate = 0.40
      rateDescription = "40% (Foreign Company)"
    }

    const tax = taxableIncome * rate
    // Surcharge
    let surcharge = 0
    if (companyType === "domestic" || companyType === "domestic_new") {
      if (taxableIncome > 100000000) {
        surcharge = tax * 0.12 // 12% surcharge above 10 Cr
      } else if (taxableIncome > 10000000) {
        surcharge = tax * 0.07 // 7% surcharge above 1 Cr
      }
    } else {
      // Foreign company surcharge
      if (taxableIncome > 100000000) {
        surcharge = tax * 0.05
      } else if (taxableIncome > 10000000) {
        surcharge = tax * 0.02
      }
    }

    // Add 4% cess
    const totalTax = (tax + surcharge) * 1.04
    return { tax: totalTax, rate: rateDescription }
  }

  const calculatePartnershipTax = (taxableIncome: number) => {
    // Partnership Firm/LLP - Flat 30%
    const rate = 0.30
    const tax = taxableIncome * rate

    // Surcharge: 12% if income exceeds ₹1 crore
    let surcharge = 0
    if (taxableIncome > 10000000) {
      surcharge = tax * 0.12
    }

    // Add 4% cess
    const totalTax = (tax + surcharge) * 1.04
    return { tax: totalTax, rate: "30% (Flat Rate)" }
  }

  const calculateAdvanceTax = () => {
    const income = parseFloat(totalIncome) || 0
    const totalDeductions = parseFloat(deductions) || 0
    const tds = parseFloat(tdsDeducted) || 0

    let taxableIncome = 0
    let taxResult = { tax: 0, rate: "" }

    if (assesseeType === "individual") {
      // For individuals, apply standard deduction
      const standardDeduction = regime === "new" ? 75000 : 50000
      taxableIncome = Math.max(income - standardDeduction - totalDeductions, 0)
      taxResult = calculateIndividualTax(taxableIncome, regime)
    } else if (assesseeType === "company") {
      taxableIncome = Math.max(income - totalDeductions, 0)
      taxResult = calculateCompanyTax(taxableIncome, companyType, turnoverBelow400Cr)
    } else {
      // Partnership/LLP
      taxableIncome = Math.max(income - totalDeductions, 0)
      taxResult = calculatePartnershipTax(taxableIncome)
    }

    const advanceTaxPayable = Math.max(taxResult.tax - tds, 0)

    // Advance tax installments based on selected FY
    const fyStartYear = financialYear === "2025-26" ? 2025 : 2026
    const fyEndYear = fyStartYear + 1
    const installments = [
      { date: `15th June ${fyStartYear}`, percentage: 15, amount: 0, cumulative: 0 },
      { date: `15th September ${fyStartYear}`, percentage: 45, amount: 0, cumulative: 0 },
      { date: `15th December ${fyStartYear}`, percentage: 75, amount: 0, cumulative: 0 },
      { date: `15th March ${fyEndYear}`, percentage: 100, amount: 0, cumulative: 0 },
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
      totalTax: taxResult.tax,
      tdsDeducted: tds,
      advanceTaxPayable,
      taxRate: taxResult.rate,
      installments,
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
          <h1 className="text-4xl font-heading font-bold mb-4">Advance Tax Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate advance tax for Individuals, Companies &amp; Partnership Firms/LLPs - FY 2025-26 / 2026-27
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
                  {/* Financial Year */}
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

                  {/* Assessee Type */}
                  <div className="space-y-2">
                    <Label>Type of Assessee</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setAssesseeType("individual")}
                        className={`py-3 px-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-1 ${
                          assesseeType === "individual"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        <User className="h-5 w-5" />
                        <span className="text-sm">Individual</span>
                      </button>
                      <button
                        onClick={() => setAssesseeType("company")}
                        className={`py-3 px-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-1 ${
                          assesseeType === "company"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        <Building2 className="h-5 w-5" />
                        <span className="text-sm">Company</span>
                      </button>
                      <button
                        onClick={() => setAssesseeType("partnership")}
                        className={`py-3 px-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-1 ${
                          assesseeType === "partnership"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        <Users className="h-5 w-5" />
                        <span className="text-sm">Firm/LLP</span>
                      </button>
                    </div>
                  </div>

                  {/* Individual: Tax Regime */}
                  {assesseeType === "individual" && (
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
                  )}

                  {/* Company: Type Selection */}
                  {assesseeType === "company" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Company Type</Label>
                        <div className="space-y-2">
                          <button
                            onClick={() => setCompanyType("domestic")}
                            className={`w-full py-3 px-4 rounded-lg border-2 transition-colors text-left ${
                              companyType === "domestic"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border-light hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium">Domestic Company (Normal)</div>
                            <div className="text-xs text-text-muted">25% or 30% based on turnover</div>
                          </button>
                          <button
                            onClick={() => setCompanyType("domestic_new")}
                            className={`w-full py-3 px-4 rounded-lg border-2 transition-colors text-left ${
                              companyType === "domestic_new"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border-light hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium">Domestic Company (Section 115BAA)</div>
                            <div className="text-xs text-text-muted">22% - No exemptions/deductions</div>
                          </button>
                          <button
                            onClick={() => setCompanyType("foreign")}
                            className={`w-full py-3 px-4 rounded-lg border-2 transition-colors text-left ${
                              companyType === "foreign"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border-light hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium">Foreign Company</div>
                            <div className="text-xs text-text-muted">40% tax rate</div>
                          </button>
                        </div>
                      </div>

                      {companyType === "domestic" && (
                        <div className="space-y-2">
                          <Label>Previous Year Turnover</Label>
                          <div className="flex gap-4">
                            <button
                              onClick={() => setTurnoverBelow400Cr(true)}
                              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors text-sm ${
                                turnoverBelow400Cr
                                  ? "border-primary bg-primary/10 text-primary font-semibold"
                                  : "border-border-light hover:border-primary/50"
                              }`}
                            >
                              ≤ ₹400 Crore
                            </button>
                            <button
                              onClick={() => setTurnoverBelow400Cr(false)}
                              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors text-sm ${
                                !turnoverBelow400Cr
                                  ? "border-primary bg-primary/10 text-primary font-semibold"
                                  : "border-border-light hover:border-primary/50"
                              }`}
                            >
                              &gt; ₹400 Crore
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Partnership/LLP Info */}
                  {assesseeType === "partnership" && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Tax Rate:</strong> Flat 30% + Surcharge (if applicable) + 4% Cess
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        Surcharge: 12% if income exceeds ₹1 Crore
                      </div>
                    </div>
                  )}

                  {/* Total Income */}
                  <div className="space-y-2">
                    <Label htmlFor="totalIncome">
                      {assesseeType === "individual" ? "Total Annual Income (₹)" : "Total Business Income (₹)"}
                    </Label>
                    <Input
                      id="totalIncome"
                      type="number"
                      placeholder="e.g., 1200000"
                      value={totalIncome}
                      onChange={(e) => setTotalIncome(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      {assesseeType === "individual"
                        ? "Include salary, business income, capital gains, other income"
                        : "Net profit before tax"}
                    </p>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-2">
                    <Label htmlFor="deductions">
                      {assesseeType === "individual" ? "Total Deductions (₹)" : "Allowable Deductions (₹)"}
                    </Label>
                    <Input
                      id="deductions"
                      type="number"
                      placeholder="e.g., 150000"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      {assesseeType === "individual"
                        ? regime === "new"
                          ? "Limited deductions in new regime. Standard deduction ₹75,000 applied automatically"
                          : "80C, 80D, HRA, etc. Standard deduction ₹50,000 applied automatically"
                        : "Depreciation, business expenses, etc."}
                    </p>
                  </div>

                  {/* TDS/TCS Deducted */}
                  <div className="space-y-2">
                    <Label htmlFor="tdsDeducted">TDS/TCS Already Deducted (₹)</Label>
                    <Input
                      id="tdsDeducted"
                      type="number"
                      placeholder="e.g., 50000"
                      value={tdsDeducted}
                      onChange={(e) => setTdsDeducted(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      TDS on payments received, TCS on purchases, etc.
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
                        <div className="text-sm text-blue-800 mb-1">
                          {assesseeType === "individual" && "Individual"}
                          {assesseeType === "company" && "Company"}
                          {assesseeType === "partnership" && "Partnership Firm / LLP"}
                        </div>
                        <div className="font-semibold text-blue-900">
                          FY {financialYear} {financialYear === "2025-26" ? "(AY 2026-27)" : "(Tax Year 2026-27)"}
                        </div>
                        <div className="text-sm text-blue-700 mt-1">
                          Tax Rate: {result.taxRate}
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
                          <span className="text-text-secondary">TDS/TCS Deducted</span>
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

            {/* Tax Rates Reference */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Tax Rates Reference (FY {financialYear})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Individual */}
                  <div className="p-4 border border-border-light rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-primary">Individual</h4>
                    </div>
                    <div className="text-sm space-y-1 text-text-secondary">
                      <div><strong>New Regime:</strong></div>
                      <div>₹0-4L: Nil</div>
                      <div>₹4-8L: 5%</div>
                      <div>₹8-12L: 10%</div>
                      <div>₹12-16L: 15%</div>
                      <div>₹16-20L: 20%</div>
                      <div>₹20-24L: 25%</div>
                      <div>Above ₹24L: 30%</div>
                      <div className="text-xs mt-2">+ 4% Cess on total tax</div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="p-4 border border-border-light rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-primary">Company</h4>
                    </div>
                    <div className="text-sm space-y-1 text-text-secondary">
                      <div><strong>Domestic (Normal):</strong></div>
                      <div>Turnover ≤ ₹400Cr: 25%</div>
                      <div>Turnover &gt; ₹400Cr: 30%</div>
                      <div className="mt-2"><strong>Section 115BAA:</strong> 22%</div>
                      <div className="mt-2"><strong>Foreign:</strong> 40%</div>
                      <div className="text-xs mt-2">+ Surcharge + 4% Cess</div>
                    </div>
                  </div>

                  {/* Partnership/LLP */}
                  <div className="p-4 border border-border-light rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-primary">Partnership / LLP</h4>
                    </div>
                    <div className="text-sm space-y-1 text-text-secondary">
                      <div><strong>Tax Rate:</strong> 30% (Flat)</div>
                      <div className="mt-2"><strong>Surcharge:</strong></div>
                      <div>Income &gt; ₹1Cr: 12%</div>
                      <div className="text-xs mt-2">+ 4% Cess on total tax</div>
                      <div className="mt-3 text-xs">
                        Note: Partner remuneration & interest deductible subject to limits
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advance Tax Due Dates */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Advance Tax Payment Schedule (FY {financialYear})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border border-border-light rounded-lg bg-blue-50">
                    <div className="text-sm text-blue-800 mb-1">1st Installment</div>
                    <div className="font-semibold text-blue-900 text-lg">15th June {financialYear === "2025-26" ? "2025" : "2026"}</div>
                    <div className="text-sm text-blue-700 mt-1">15% of tax</div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg bg-green-50">
                    <div className="text-sm text-green-800 mb-1">2nd Installment</div>
                    <div className="font-semibold text-green-900 text-lg">15th Sept {financialYear === "2025-26" ? "2025" : "2026"}</div>
                    <div className="text-sm text-green-700 mt-1">45% of tax (cumulative)</div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg bg-orange-50">
                    <div className="text-sm text-orange-800 mb-1">3rd Installment</div>
                    <div className="font-semibold text-orange-900 text-lg">15th Dec {financialYear === "2025-26" ? "2025" : "2026"}</div>
                    <div className="text-sm text-orange-700 mt-1">75% of tax (cumulative)</div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg bg-red-50">
                    <div className="text-sm text-red-800 mb-1">4th Installment</div>
                    <div className="font-semibold text-red-900 text-lg">15th March {financialYear === "2025-26" ? "2026" : "2027"}</div>
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
                  <div>• Individuals, Companies, Firms, LLPs</div>
                  <div>• Senior citizens (60+) with no business income exempt</div>
                  <div>• Presumptive taxation (44AD/44ADA): Pay 100% by 15th March</div>
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
                This calculator provides approximate advance tax calculations for FY 2025-26 / 2026-27. Actual tax may vary based on specific exemptions, deductions, MAT/AMT applicability, and other factors. For FY 2026-27, MAT rate is reduced to 14%. Consult a Chartered Accountant for accurate tax planning and compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
