"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator } from "lucide-react"

type TDSCategory = {
  name: string
  rate: number | string
  section: string
  isSalary?: boolean
  isProperty?: boolean
}

const tdsCategories: TDSCategory[] = [
  { name: "Salary", rate: "As per Income Tax Slab", section: "192", isSalary: true },
  { name: "Professional/Technical Fees", rate: 10, section: "194J" },
  { name: "Contractor - Individual/HUF", rate: 1, section: "194C" },
  { name: "Contractor - Others", rate: 2, section: "194C" },
  { name: "Commission/Brokerage", rate: 5, section: "194H" },
  { name: "Rent - Plant & Machinery", rate: 2, section: "194I" },
  { name: "Rent - Land & Building", rate: 10, section: "194I" },
  { name: "Interest Other Than Securities", rate: 10, section: "194A" },
  { name: "Dividend", rate: 10, section: "194" },
  { name: "Winnings from Lottery", rate: 30, section: "194B" },
  { name: "Purchase of Property (>₹50L)", rate: 1, section: "194-IA", isProperty: true },
]

export default function TDSCalculator() {
  const [amount, setAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TDSCategory>(tdsCategories[1])
  const [annualSalary, setAnnualSalary] = useState("")
  const [deductions, setDeductions] = useState("")
  const [panAvailable, setPanAvailable] = useState(true)
  // Property specific fields
  const [sellerPanAvailable, setSellerPanAvailable] = useState(true)
  const [propertyType, setPropertyType] = useState<"residential" | "commercial">("residential")
  const [result, setResult] = useState<{
    grossAmount: number
    tdsRate: number
    tdsAmount: number
    netAmount: number
    isPropertyBelow50L?: boolean
  } | null>(null)

  const calculateIncomeTax = (taxableIncome: number) => {
    // Using new regime FY 2025-26 slabs for salary TDS
    let tax = 0

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

    // Add 4% cess
    const totalTax = tax + (tax * 0.04)
    return totalTax
  }

  const calculateTDS = () => {
    const grossAmount = parseFloat(amount) || 0
    let tdsAmount = 0
    let tdsRate = 0
    let isPropertyBelow50L = false

    if (selectedCategory.isSalary) {
      // For salary, calculate based on income tax slabs
      const yearly = parseFloat(annualSalary) || 0
      const totalDeductions = parseFloat(deductions) || 0
      const standardDeduction = 75000 // FY 2025-26

      const taxableIncome = Math.max(yearly - standardDeduction - totalDeductions, 0)
      const annualTax = calculateIncomeTax(taxableIncome)

      // Monthly TDS
      tdsAmount = annualTax / 12
      tdsRate = yearly > 0 ? ((annualTax / yearly) * 100) : 0
    } else if (selectedCategory.isProperty) {
      // TDS on Property Purchase - Section 194-IA
      // Applicable only if property value > Rs. 50 lakhs
      const threshold = 5000000 // Rs. 50 lakhs

      if (grossAmount < threshold) {
        // No TDS applicable for property below Rs. 50 lakhs
        tdsRate = 0
        tdsAmount = 0
        isPropertyBelow50L = true
      } else {
        // TDS @ 1% on total property value
        tdsRate = 1

        // If seller's PAN not available, TDS @ 20%
        if (!sellerPanAvailable) {
          tdsRate = 20
        }

        tdsAmount = (grossAmount * tdsRate) / 100
      }
    } else {
      // For other categories, use fixed rate
      tdsRate = typeof selectedCategory.rate === 'number' ? selectedCategory.rate : 0

      // If PAN not available, TDS rate is 20% (higher of 20% or actual rate)
      if (!panAvailable) {
        tdsRate = Math.max(20, tdsRate)
      }

      tdsAmount = (grossAmount * tdsRate) / 100
    }

    const netAmount = grossAmount - tdsAmount

    setResult({
      grossAmount,
      tdsRate,
      tdsAmount,
      netAmount,
      isPropertyBelow50L,
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
          <h1 className="text-4xl font-heading font-bold mb-4">TDS Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate Tax Deducted at Source for various payment categories
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
                    Enter Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Payment Category</Label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={tdsCategories.indexOf(selectedCategory)}
                      onChange={(e) => setSelectedCategory(tdsCategories[parseInt(e.target.value)])}
                    >
                      {tdsCategories.map((cat, index) => (
                        <option key={index} value={index}>
                          {cat.name} - {cat.rate}% (Section {cat.section})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Conditional Fields based on category */}
                  {selectedCategory.isSalary ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="annualSalary">Annual Salary (₹)</Label>
                        <Input
                          id="annualSalary"
                          type="number"
                          placeholder="e.g., 1200000"
                          value={annualSalary}
                          onChange={(e) => setAnnualSalary(e.target.value)}
                        />
                        <p className="text-xs text-text-muted">
                          Total annual salary (including all allowances)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deductions">Annual Deductions (₹)</Label>
                        <Input
                          id="deductions"
                          type="number"
                          placeholder="e.g., 150000"
                          value={deductions}
                          onChange={(e) => setDeductions(e.target.value)}
                        />
                        <p className="text-xs text-text-muted">
                          80C, 80D, HRA, etc. (Standard deduction ₹75,000 applied automatically)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlySalary">Monthly Salary (₹)</Label>
                        <Input
                          id="monthlySalary"
                          type="number"
                          placeholder="e.g., 100000"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <p className="text-xs text-text-muted">
                          For calculating net monthly payment
                        </p>
                      </div>
                    </>
                  ) : selectedCategory.isProperty ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="propertyValue">Property Value / Sale Consideration (₹)</Label>
                        <Input
                          id="propertyValue"
                          type="number"
                          placeholder="e.g., 7500000"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <p className="text-xs text-text-muted">
                          Total sale consideration of the property
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 text-sm mb-2">Section 194-IA Applicability</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• TDS applicable only if property value exceeds <strong>Rs. 50 Lakhs</strong></li>
                          <li>• TDS Rate: <strong>1%</strong> of total sale consideration</li>
                          <li>• Buyer is responsible to deduct and deposit TDS</li>
                          <li>• TDS to be deposited within 30 days from end of month</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <Label>Seller&apos;s PAN Status</Label>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSellerPanAvailable(true)}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                              sellerPanAvailable
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border-light hover:border-primary/50"
                            }`}
                          >
                            PAN Available
                          </button>
                          <button
                            onClick={() => setSellerPanAvailable(false)}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                              !sellerPanAvailable
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border-light hover:border-primary/50"
                            }`}
                          >
                            No PAN
                          </button>
                        </div>
                        {!sellerPanAvailable && (
                          <p className="text-xs text-red-600">
                            Note: TDS will be deducted at 20% if seller&apos;s PAN is not available
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="amount">Payment Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="e.g., 50000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  )}

                  {/* PAN Availability - Not for Salary or Property (Property has seller's PAN separately) */}
                  {!selectedCategory.isSalary && !selectedCategory.isProperty && (
                    <div className="space-y-2">
                      <Label>PAN Status</Label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setPanAvailable(true)}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                            panAvailable
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border-light hover:border-primary/50"
                          }`}
                        >
                          PAN Available
                        </button>
                        <button
                          onClick={() => setPanAvailable(false)}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                            !panAvailable
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border-light hover:border-primary/50"
                          }`}
                        >
                          No PAN
                        </button>
                      </div>
                      {!panAvailable && (
                        <p className="text-xs text-red-600">
                          Note: TDS will be deducted at 20% if PAN is not available
                        </p>
                      )}
                    </div>
                  )}

                  <Button onClick={calculateTDS} className="w-full bg-primary hover:bg-primary-light text-white">
                    Calculate TDS
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">TDS Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-blue-800 mb-1">Selected Category</div>
                        <div className="font-semibold text-blue-900">{selectedCategory.name}</div>
                        <div className="text-xs text-blue-700 mt-1">
                          Section {selectedCategory.section} | Rate: {selectedCategory.rate}%
                          {!panAvailable && !selectedCategory.isProperty && " (20% due to no PAN)"}
                          {selectedCategory.isProperty && !sellerPanAvailable && " (20% due to seller's PAN not available)"}
                        </div>
                      </div>

                      {/* Special message for property below Rs. 50 lakhs */}
                      {result.isPropertyBelow50L && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                          <h4 className="font-semibold text-green-800 mb-1">No TDS Applicable</h4>
                          <p className="text-sm text-green-700">
                            TDS under Section 194-IA is not applicable as the property value is below Rs. 50 Lakhs.
                            The buyer can pay the full amount to the seller without any TDS deduction.
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">
                            {selectedCategory.isProperty ? "Property Value" : "Gross Payment"}
                          </span>
                          <span className="font-semibold">{formatCurrency(result.grossAmount)}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">TDS Rate</span>
                          <span className="font-semibold">
                            {result.isPropertyBelow50L ? "N/A" : `${result.tdsRate}%`}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b bg-red-50 -mx-4 px-4 py-3 rounded">
                          <span className="text-text-secondary">TDS Amount (to be deducted)</span>
                          <span className="font-semibold text-red-700">
                            {formatCurrency(result.tdsAmount)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">
                            {selectedCategory.isProperty ? "Net Payable to Seller" : "Net Payment"}
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.netAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-green-900 mb-2">
                          {selectedCategory.isProperty ? "Property Transaction Breakdown" : "Payment Breakdown"}
                        </h4>
                        <div className="text-sm text-green-800 space-y-1">
                          <div>• {selectedCategory.isProperty ? "Property Value" : "Gross Payment"}: {formatCurrency(result.grossAmount)}</div>
                          <div>• TDS Deducted: {formatCurrency(result.tdsAmount)}</div>
                          <div>• Net Paid to {selectedCategory.isProperty ? "Seller" : "Payee"}: {formatCurrency(result.netAmount)}</div>
                          {result.tdsAmount > 0 && (
                            <div>• TDS to be deposited to Govt: {formatCurrency(result.tdsAmount)}</div>
                          )}
                        </div>
                      </div>

                      {/* Property-specific Form 26QB reminder */}
                      {selectedCategory.isProperty && result.tdsAmount > 0 && (
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-amber-900 mb-2">Form 26QB Compliance</h4>
                          <div className="text-sm text-amber-800 space-y-1">
                            <div>• File Form 26QB within 30 days from end of month of deduction</div>
                            <div>• Issue Form 16B to the seller after filing 26QB</div>
                            <div>• TDS deposited via TRACES portal using Challan 26QB</div>
                            <div>• Both buyer &amp; seller PANs are mandatory for filing</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter payment details to calculate TDS</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* TDS Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Common TDS Rates & Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tdsCategories.map((cat, index) => (
                    <div key={index} className="p-4 border border-border-light rounded-lg hover:border-primary/50 transition-colors">
                      <div className="font-semibold text-primary mb-1">{cat.name}</div>
                      <div className="text-sm text-text-secondary">Section {cat.section}</div>
                      <div className="text-lg font-bold text-primary mt-2">
                        {cat.isSalary ? cat.rate : `${cat.rate}%`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
                <h3 className="font-semibold text-blue-800 mb-2">TDS Due Dates</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Government Deductor: Same day</div>
                  <div>• Other Deductors: 7th of next month</div>
                  <div>• March Deductions: 30th April</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
                <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  This calculator provides approximate TDS calculations. Actual TDS may vary based on
                  exemptions and specific conditions. Consult a CA for accurate compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
