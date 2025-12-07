"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, AlertCircle } from "lucide-react"

export default function GSTInterestCalculator() {
  const [taxAmount, setTaxAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [returnType, setReturnType] = useState<"GSTR-3B" | "GSTR-1" | "Annual Return">("GSTR-3B")
  const [result, setResult] = useState<{
    taxAmount: number
    delayDays: number
    interestRate: number
    interestAmount: number
    lateFee: number
    totalPayable: number
  } | null>(null)

  const calculateInterestAndFee = () => {
    const tax = parseFloat(taxAmount) || 0
    const due = new Date(dueDate)
    const payment = new Date(paymentDate)

    // Calculate delay in days
    const timeDiff = payment.getTime() - due.getTime()
    const delayDays = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 0)

    // Interest calculation: 18% per annum
    const interestRate = 18
    const interestAmount = (tax * interestRate * delayDays) / (365 * 100)

    // Late fee calculation
    let lateFee = 0
    if (delayDays > 0) {
      if (returnType === "GSTR-3B") {
        // GSTR-3B: ₹50/day (₹20 CGST + ₹20 SGST if NIL return, else ₹50 each)
        // Assuming non-NIL return for calculation
        lateFee = Math.min(delayDays * 100, 5000) // Max ₹5000
      } else if (returnType === "GSTR-1") {
        // GSTR-1: ₹200/day (₹100 CGST + ₹100 SGST)
        lateFee = Math.min(delayDays * 200, 10000) // Max ₹10000 (50 days)
      } else {
        // Annual Return: ₹200/day (₹100 CGST + ₹100 SGST)
        lateFee = delayDays * 200
      }
    }

    const totalPayable = tax + interestAmount + lateFee

    setResult({
      taxAmount: tax,
      delayDays,
      interestRate,
      interestAmount,
      lateFee,
      totalPayable,
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
          <h1 className="text-4xl font-heading font-bold mb-4">GST Interest & Late Fee Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate interest and late fees for delayed GST payment and return filing
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Warning */}
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-800 mb-2">Important: Penalties for Delay</h3>
                  <p className="text-sm text-red-700 mb-2">
                    <strong>Interest:</strong> 18% per annum on delayed tax payment (calculated daily)
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>Late Fee:</strong> ₹50-200 per day for delayed return filing (varies by return type)
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
                    Enter Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Return Type */}
                  <div className="space-y-2">
                    <Label>GST Return Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setReturnType("GSTR-3B")}
                        className={`py-3 px-2 text-sm rounded-lg border-2 transition-colors ${
                          returnType === "GSTR-3B"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        GSTR-3B
                      </button>
                      <button
                        onClick={() => setReturnType("GSTR-1")}
                        className={`py-3 px-2 text-sm rounded-lg border-2 transition-colors ${
                          returnType === "GSTR-1"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        GSTR-1
                      </button>
                      <button
                        onClick={() => setReturnType("Annual Return")}
                        className={`py-3 px-2 text-sm rounded-lg border-2 transition-colors ${
                          returnType === "Annual Return"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Annual
                      </button>
                    </div>
                  </div>

                  {/* Tax Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="taxAmount">Tax Amount (₹)</Label>
                    <Input
                      id="taxAmount"
                      type="number"
                      placeholder="e.g., 50000"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Total GST liability (CGST + SGST + IGST)
                    </p>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      {returnType === "GSTR-3B" && "Usually 20th of next month"}
                      {returnType === "GSTR-1" && "Usually 11th of next month"}
                      {returnType === "Annual Return" && "Usually 31st December"}
                    </p>
                  </div>

                  {/* Payment Date */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Actual Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                    <p className="text-xs text-text-muted">
                      Date when tax was actually paid
                    </p>
                  </div>

                  {/* Information Box */}
                  <div className="bg-bg-secondary p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Late Fee Structure:</h4>
                    <ul className="text-xs text-text-secondary space-y-1">
                      <li><strong>GSTR-3B:</strong> ₹50/day (₹100 if not NIL), Max ₹5,000</li>
                      <li><strong>GSTR-1:</strong> ₹200/day, Max ₹10,000</li>
                      <li><strong>Annual Return:</strong> ₹200/day, No max limit</li>
                      <li><strong>Interest:</strong> 18% p.a. on all delays</li>
                    </ul>
                  </div>

                  <Button onClick={calculateInterestAndFee} className="w-full bg-primary hover:bg-primary-light text-white">
                    Calculate Interest & Late Fee
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Penalty Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-blue-800 mb-1">Return Type: {returnType}</div>
                        <div className="font-semibold text-blue-900">
                          Delay: {result.delayDays} days
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          Interest Rate: {result.interestRate}% per annum
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Original Tax Amount</span>
                          <span className="font-semibold">{formatCurrency(result.taxAmount)}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Delay Period</span>
                          <span className="font-semibold text-orange-700">
                            {result.delayDays} days
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Interest @ {result.interestRate}% p.a.</span>
                          <span className="font-semibold text-red-700">
                            {formatCurrency(result.interestAmount)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Late Fee</span>
                          <span className="font-semibold text-red-700">
                            {formatCurrency(result.lateFee)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">Total Payable</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.totalPayable)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-red-900 mb-2">Payment Breakdown</h4>
                        <div className="text-sm text-red-800 space-y-1">
                          <div>• Original Tax: {formatCurrency(result.taxAmount)}</div>
                          <div>• Interest ({result.delayDays} days): {formatCurrency(result.interestAmount)}</div>
                          <div>• Late Fee: {formatCurrency(result.lateFee)}</div>
                          <div className="font-semibold pt-2 border-t border-red-200 mt-2">
                            • Total to be Paid: {formatCurrency(result.totalPayable)}
                          </div>
                          <div className="text-xs text-red-700 mt-2">
                            Additional penalty of {formatCurrency(result.interestAmount + result.lateFee)} due to delay
                          </div>
                        </div>
                      </div>

                      {result.delayDays > 0 && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Avoid Future Penalties</h4>
                          <div className="text-sm text-yellow-700 space-y-1">
                            <div>• Pay GST by 20th of next month</div>
                            <div>• File returns before due date</div>
                            <div>• Set calendar reminders</div>
                            <div>• Maintain adequate working capital</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter payment details to calculate penalties</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Due Dates Reference */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>GST Return Due Dates Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-border-light rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">GSTR-1</h4>
                    <p className="text-sm text-text-secondary mb-2">Outward supplies</p>
                    <div className="text-xs space-y-1">
                      <div><strong>Monthly:</strong> 11th of next month</div>
                      <div><strong>Quarterly:</strong> 13th of month after quarter</div>
                      <div><strong>Late Fee:</strong> ₹200/day (Max ₹10,000)</div>
                    </div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">GSTR-3B</h4>
                    <p className="text-sm text-text-secondary mb-2">Summary return & payment</p>
                    <div className="text-xs space-y-1">
                      <div><strong>Monthly:</strong> 20th of next month</div>
                      <div><strong>Quarterly:</strong> 22nd/24th of month after quarter</div>
                      <div><strong>Late Fee:</strong> ₹50/day (Max ₹5,000)</div>
                    </div>
                  </div>

                  <div className="p-4 border border-border-light rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">GSTR-9</h4>
                    <p className="text-sm text-text-secondary mb-2">Annual Return</p>
                    <div className="text-xs space-y-1">
                      <div><strong>Due:</strong> 31st December</div>
                      <div><strong>For:</strong> Previous financial year</div>
                      <div><strong>Late Fee:</strong> ₹200/day (No max)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
                <h3 className="font-semibold text-blue-800 mb-2">Interest Calculation</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Charged at 18% per annum</div>
                  <div>• Calculated on daily basis</div>
                  <div>• Applies from due date to payment date</div>
                  <div>• Separate for CGST, SGST, IGST</div>
                  <div>• No exemption or waiver available</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
                <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  This calculator provides approximate interest and late fee calculations. Actual penalties may vary based on specific circumstances, NIL returns, and recent amendments. Consult a CA for accurate compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
