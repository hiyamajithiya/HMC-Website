"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, ShoppingCart } from "lucide-react"

export default function GSTTCSCalculator() {
  const [netValue, setNetValue] = useState("")
  const [platformFee, setPlatformFee] = useState("")
  const [result, setResult] = useState<{
    netTaxableValue: number
    tcsRate: number
    tcsAmount: number
    platformFee: number
    totalDeduction: number
    netPayment: number
  } | null>(null)

  const calculateTCS = () => {
    const netTaxable = parseFloat(netValue) || 0
    const platformFeeAmount = parseFloat(platformFee) || 0

    // TCS rate is 1% of net value of taxable supplies
    const tcsRate = 1
    const tcsAmount = (netTaxable * tcsRate) / 100

    const totalDeduction = tcsAmount + platformFeeAmount
    const netPayment = netTaxable - totalDeduction

    setResult({
      netTaxableValue: netTaxable,
      tcsRate,
      tcsAmount,
      platformFee: platformFeeAmount,
      totalDeduction,
      netPayment,
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
          <h1 className="text-4xl font-heading font-bold mb-4">E-commerce TCS Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate Tax Collected at Source (TCS) by e-commerce operators like Amazon, Flipkart
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* TCS Information */}
            <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r">
              <div className="flex items-start gap-3">
                <ShoppingCart className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-800 mb-2">What is E-commerce TCS?</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    E-commerce operators (like Amazon, Flipkart, Myntra) must collect TCS at <strong>1%</strong> of the net value of taxable supplies made through their platform.
                  </p>
                  <p className="text-sm text-blue-700">
                    This TCS is collected by the platform and deposited to the government. Sellers can claim this as credit in their GST returns.
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
                    Enter Sales Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Net Taxable Value */}
                  <div className="space-y-2">
                    <Label htmlFor="netValue">Net Taxable Value of Supplies (₹)</Label>
                    <Input
                      id="netValue"
                      type="number"
                      placeholder="e.g., 100000"
                      value={netValue}
                      onChange={(e) => setNetValue(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Total sales made through the e-commerce platform (excluding platform fees and GST)
                    </p>
                  </div>

                  {/* Platform Fee */}
                  <div className="space-y-2">
                    <Label htmlFor="platformFee">Platform Commission/Fee (₹)</Label>
                    <Input
                      id="platformFee"
                      type="number"
                      placeholder="e.g., 15000"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Commission charged by the e-commerce platform (optional)
                    </p>
                  </div>

                  {/* Information Box */}
                  <div className="bg-bg-secondary p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">How TCS Works:</h4>
                    <ol className="text-xs text-text-secondary space-y-1 list-decimal list-inside">
                      <li>You make sales through e-commerce platform</li>
                      <li>Platform collects 1% TCS on net value</li>
                      <li>Platform deducts their commission/fees</li>
                      <li>You receive net payment after deductions</li>
                      <li>You can claim TCS credit in GSTR-2A/2B</li>
                    </ol>
                  </div>

                  <Button onClick={calculateTCS} className="w-full bg-primary hover:bg-primary-light text-white">
                    Calculate TCS & Net Payment
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-blue-800 mb-1">E-commerce Platform TCS</div>
                        <div className="font-semibold text-blue-900">Rate: {result.tcsRate}% of Net Value</div>
                        <div className="text-xs text-blue-700 mt-1">
                          Applicable under Section 52 of CGST Act
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Gross Sales Value</span>
                          <span className="font-semibold">{formatCurrency(result.netTaxableValue)}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">TCS @ {result.tcsRate}%</span>
                          <span className="font-semibold text-red-700">
                            - {formatCurrency(result.tcsAmount)}
                          </span>
                        </div>

                        {result.platformFee > 0 && (
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-text-secondary">Platform Fee/Commission</span>
                            <span className="font-semibold text-red-700">
                              - {formatCurrency(result.platformFee)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pb-2 border-b bg-red-50 -mx-4 px-4 py-3 rounded">
                          <span className="text-text-secondary">Total Deductions</span>
                          <span className="font-semibold text-red-700">
                            {formatCurrency(result.totalDeduction)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">Net Payment to You</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.netPayment)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-green-900 mb-2">Transaction Summary</h4>
                        <div className="text-sm text-green-800 space-y-1">
                          <div>• Gross Sales: {formatCurrency(result.netTaxableValue)}</div>
                          <div>• TCS Collected by Platform: {formatCurrency(result.tcsAmount)}</div>
                          {result.platformFee > 0 && (
                            <div>• Platform Charges: {formatCurrency(result.platformFee)}</div>
                          )}
                          <div className="font-semibold pt-2 border-t border-green-200 mt-2">
                            • Amount Credited to You: {formatCurrency(result.netPayment)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <div>• TCS can be claimed as credit in GSTR-2A/2B</div>
                          <div>• Platform will issue TCS certificate</div>
                          <div>• Claim credit while filing GSTR-3B</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter sales details to calculate TCS</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Information Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Who Collects TCS?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>✅ Amazon</li>
                    <li>✅ Flipkart</li>
                    <li>✅ Myntra</li>
                    <li>✅ Snapdeal</li>
                    <li>✅ Meesho</li>
                    <li>✅ Ajio</li>
                    <li>✅ All registered e-commerce operators</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">TCS Rate & Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li><strong>Rate:</strong> 1% of net value</li>
                    <li><strong>Calculated on:</strong> Net taxable supplies</li>
                    <li><strong>Due Date:</strong> 10th of next month</li>
                    <li><strong>Return:</strong> GSTR-8 (by platform)</li>
                    <li><strong>Credit:</strong> Available in GSTR-2A</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How to Claim Credit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>1. Check GSTR-2A/2B</li>
                    <li>2. Verify TCS amount</li>
                    <li>3. Match with platform statement</li>
                    <li>4. Claim in GSTR-3B (Table 4A)</li>
                    <li>5. Adjust against output liability</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Important Notes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
                <h3 className="font-semibold text-blue-800 mb-2">Key Points</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• TCS is different from GST on sales</div>
                  <div>• Platform files GSTR-8 monthly</div>
                  <div>• Sellers can claim TCS as input credit</div>
                  <div>• Applies to all supplies through e-commerce</div>
                  <div>• Rate is uniform at 1% across India</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
                <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  This calculator provides TCS calculations at the standard 1% rate. Actual deductions may vary based on platform policies and specific transaction types. Consult your CA for accurate reconciliation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
