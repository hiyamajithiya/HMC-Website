"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator } from "lucide-react"

export default function GSTCalculator() {
  const [amount, setAmount] = useState("")
  const [gstRate, setGstRate] = useState("18")
  const [calculationType, setCalculationType] = useState<"exclusive" | "inclusive">("exclusive")
  const [result, setResult] = useState<{
    baseAmount: number
    cgst: number
    sgst: number
    igst: number
    totalGST: number
    finalAmount: number
  } | null>(null)

  const calculateGST = () => {
    const amt = parseFloat(amount) || 0
    const rate = parseFloat(gstRate) || 0

    let baseAmount = 0
    let totalGST = 0
    let finalAmount = 0

    if (calculationType === "exclusive") {
      // Amount is without GST
      baseAmount = amt
      totalGST = (amt * rate) / 100
      finalAmount = amt + totalGST
    } else {
      // Amount is with GST
      finalAmount = amt
      baseAmount = (amt * 100) / (100 + rate)
      totalGST = amt - baseAmount
    }

    const cgst = totalGST / 2
    const sgst = totalGST / 2
    const igst = totalGST

    setResult({
      baseAmount,
      cgst,
      sgst,
      igst,
      totalGST,
      finalAmount,
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
          <h1 className="text-4xl font-heading font-bold mb-4">GST Calculator</h1>
          <p className="text-xl text-white/90">
            Calculate GST amount for goods and services
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
                    Enter Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Calculation Type */}
                  <div className="space-y-2">
                    <Label>Calculation Type</Label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCalculationType("exclusive")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          calculationType === "exclusive"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Exclusive of GST
                      </button>
                      <button
                        onClick={() => setCalculationType("inclusive")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          calculationType === "inclusive"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border-light hover:border-primary/50"
                        }`}
                      >
                        Inclusive of GST
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      Amount (₹) {calculationType === "exclusive" ? "(without GST)" : "(with GST)"}
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 10000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  {/* GST Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="gstRate">GST Rate (%)</Label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {["5", "12", "18", "28"].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setGstRate(rate)}
                          className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                            gstRate === rate
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border-light hover:border-primary/50"
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                    <Input
                      id="gstRate"
                      type="number"
                      placeholder="or enter custom rate"
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                    />
                  </div>

                  <Button onClick={calculateGST} className="w-full bg-primary hover:bg-primary-light">
                    Calculate GST
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
                          <span className="text-text-secondary">Base Amount (without GST)</span>
                          <span className="font-semibold">{formatCurrency(result.baseAmount)}</span>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg space-y-3">
                          <h4 className="font-semibold text-green-900 mb-2">
                            Intra-State Supply (Within State)
                          </h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800">
                              CGST ({parseFloat(gstRate) / 2}%)
                            </span>
                            <span className="font-semibold text-green-900">
                              {formatCurrency(result.cgst)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800">
                              SGST ({parseFloat(gstRate) / 2}%)
                            </span>
                            <span className="font-semibold text-green-900">
                              {formatCurrency(result.sgst)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Inter-State Supply (Between States)
                          </h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800">IGST ({gstRate}%)</span>
                            <span className="font-semibold text-blue-900">
                              {formatCurrency(result.igst)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-text-secondary">Total GST</span>
                          <span className="font-semibold">{formatCurrency(result.totalGST)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                          <span className="text-lg font-semibold text-primary">
                            Final Amount (with GST)
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(result.finalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-text-muted">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter amount and GST rate to see calculation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* GST Rates Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Common GST Rates in India</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700 mb-2">5%</div>
                    <p className="text-sm text-green-800">
                      Essential items, packaged food, footwear under ₹500
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700 mb-2">12%</div>
                    <p className="text-sm text-blue-800">
                      Processed food, computers, mobiles
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700 mb-2">18%</div>
                    <p className="text-sm text-purple-800">
                      Most goods and services, capital goods
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-700 mb-2">28%</div>
                    <p className="text-sm text-red-800">
                      Luxury items, automobiles, tobacco
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
              <p className="text-sm text-yellow-700">
                This calculator provides approximate GST calculations for informational purposes only.
                Actual GST rates may vary based on specific goods or services. For accurate GST compliance,
                please consult with a qualified Chartered Accountant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
