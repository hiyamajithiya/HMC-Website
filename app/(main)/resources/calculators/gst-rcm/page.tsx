"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, AlertTriangle } from "lucide-react"

type RCMCategory = {
  name: string
  gstRate: number
  description: string
}

const rcmCategories: RCMCategory[] = [
  { name: "Legal Services (Advocate)", gstRate: 18, description: "Services by advocate/senior advocate" },
  { name: "GTA Services (Unregistered)", gstRate: 5, description: "Goods Transport Agency services" },
  { name: "Security Services", gstRate: 18, description: "Services by way of supply of security personnel" },
  { name: "Sponsorship Services", gstRate: 18, description: "Sponsorship services" },
  { name: "Import of Services", gstRate: 18, description: "Import of services from outside India" },
  { name: "Director Services (Company)", gstRate: 18, description: "Services by director to company" },
  { name: "Recovery Agent Services", gstRate: 18, description: "Services of recovery agents" },
  { name: "Arbitral Tribunal Services", gstRate: 18, description: "Services by arbitral tribunal" },
  { name: "Government Services", gstRate: 18, description: "Supply of goods/services by govt" },
  { name: "Lottery/Betting/Gambling", gstRate: 40, description: "Services related to lottery, betting, gambling (GST 2.0 rate)" },
]

export default function GSTRCMCalculator() {
  const [amount, setAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<RCMCategory>(rcmCategories[0])
  const [isIntraState, setIsIntraState] = useState(true)
  const [result, setResult] = useState<{
    baseAmount: number
    gstRate: number
    cgst: number
    sgst: number
    igst: number
    totalGST: number
    totalAmount: number
  } | null>(null)

  const calculateRCM = () => {
    const baseAmount = parseFloat(amount) || 0
    const gstRate = selectedCategory.gstRate

    const totalGST = (baseAmount * gstRate) / 100

    let cgst = 0
    let sgst = 0
    let igst = 0

    if (isIntraState) {
      // For intra-state: CGST + SGST
      cgst = totalGST / 2
      sgst = totalGST / 2
    } else {
      // For inter-state: IGST
      igst = totalGST
    }

    const totalAmount = baseAmount + totalGST

    setResult({
      baseAmount,
      gstRate,
      cgst,
      sgst,
      igst,
      totalGST,
      totalAmount,
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
          <h1 className="text-4xl font-heading font-bold mb-4">GST Reverse Charge Mechanism (RCM) Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate GST payable under Reverse Charge Mechanism for specified services
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* RCM Warning */}
            <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-800 mb-2">What is Reverse Charge Mechanism (RCM)?</h3>
                  <p className="text-sm text-yellow-700 mb-2">
                    Under RCM, the recipient of goods or services is liable to pay GST instead of the supplier. This applies to specific categories of supplies notified by the government.
                  </p>
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> You must pay GST to the government even though the supplier doesn't charge it on the invoice.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    Enter RCM Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">RCM Service Category</Label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={rcmCategories.indexOf(selectedCategory)}
                      onChange={(e) => setSelectedCategory(rcmCategories[parseInt(e.target.value)])}
                    >
                      {rcmCategories.map((cat, index) => (
                        <option key={index} value={index}>
                          {cat.name} - {cat.gstRate}%
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-text-muted">
                      {selectedCategory.description}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Service/Purchase Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 50000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Enter the base amount (excluding GST)
                    </p>
                  </div>

                  {/* Transaction Type */}
                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsIntraState(true)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          isIntraState
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Intra-State
                        <div className="text-xs font-normal mt-1">CGST + SGST</div>
                      </button>
                      <button
                        onClick={() => setIsIntraState(false)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          !isIntraState
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Inter-State
                        <div className="text-xs font-normal mt-1">IGST</div>
                      </button>
                    </div>
                  </div>

                  <Button onClick={calculateRCM} className="w-full bg-primary hover:bg-primary-light text-white">
                    Calculate RCM
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">RCM Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-blue-800 mb-1">Selected Category</div>
                        <div className="font-semibold text-blue-900">{selectedCategory.name}</div>
                        <div className="text-xs text-blue-700 mt-1">
                          GST Rate: {selectedCategory.gstRate}% | {isIntraState ? "Intra-State" : "Inter-State"}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Base Amount</span>
                          <span className="font-semibold">{formatCurrency(result.baseAmount)}</span>
                        </div>

                        {isIntraState ? (
                          <>
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-text-secondary">CGST ({result.gstRate / 2}%)</span>
                              <span className="font-semibold text-blue-700">
                                {formatCurrency(result.cgst)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-text-secondary">SGST ({result.gstRate / 2}%)</span>
                              <span className="font-semibold text-blue-700">
                                {formatCurrency(result.sgst)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-text-secondary">IGST ({result.gstRate}%)</span>
                            <span className="font-semibold text-blue-700">
                              {formatCurrency(result.igst)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pb-2 border-b bg-red-50 -mx-4 px-4 py-3 rounded">
                          <span className="text-text-secondary">Total GST (You Pay to Govt)</span>
                          <span className="font-semibold text-red-700">
                            {formatCurrency(result.totalGST)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">Total Cost</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-green-900 mb-2">Payment Breakdown</h4>
                        <div className="text-sm text-green-800 space-y-1">
                          <div>• Amount Paid to Supplier: {formatCurrency(result.baseAmount)}</div>
                          <div>• GST to be Deposited to Govt: {formatCurrency(result.totalGST)}</div>
                          {isIntraState ? (
                            <>
                              <div className="ml-4">→ CGST: {formatCurrency(result.cgst)}</div>
                              <div className="ml-4">→ SGST: {formatCurrency(result.sgst)}</div>
                            </>
                          ) : (
                            <div className="ml-4">→ IGST: {formatCurrency(result.igst)}</div>
                          )}
                          <div className="font-semibold pt-2 border-t border-green-200 mt-2">
                            • Your Total Expense: {formatCurrency(result.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter RCM details to calculate GST liability</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Common RCM Categories */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Common RCM Applicable Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rcmCategories.map((cat, index) => (
                    <div key={index} className="p-4 border border-border-light rounded-lg hover:border-primary/50 transition-colors">
                      <div className="font-semibold text-primary mb-1">{cat.name}</div>
                      <div className="text-xs text-text-secondary mb-2">{cat.description}</div>
                      <div className="text-lg font-bold text-primary">
                        GST: {cat.gstRate}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
                <h3 className="font-semibold text-blue-800 mb-2">Key Points About RCM</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Recipient pays GST, not the supplier</div>
                  <div>• Input Tax Credit (ITC) is available</div>
                  <div>• Must be reported in GSTR-3B</div>
                  <div>• Payment due by 20th of next month</div>
                  <div>• Applies even if supplier is unregistered</div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r">
                <h3 className="font-semibold text-green-800 mb-2">GST 2.0 Rate Changes (w.e.f. 22 Sept 2025)</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• New rate structure: 0%, 5%, 18%, 40% (12% and 28% slabs eliminated)</div>
                  <div>• Most services remain at 18% under RCM</div>
                  <div>• Lottery/Betting/Gambling moved from 28% to 40%</div>
                  <div>• GTA services remain at 5%</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
                <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  This calculator provides approximate RCM calculations based on notified categories. Rates updated for GST 2.0 (effective 22 Sept 2025). RCM applicability may change based on notifications and specific conditions. Consult a CA for accurate compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
