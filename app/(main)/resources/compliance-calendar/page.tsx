"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, AlertCircle, CheckCircle2, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// Compliance events template for each month
const getComplianceEventsForMonth = (year: number, month: number) => {
  const events = []

  // GST GSTR-3B - 20th of every month
  events.push({
    title: "GST GSTR-3B Filing",
    day: 20,
    category: "GST",
    frequency: "Monthly",
    description: "Monthly summary return for regular taxpayers",
  })

  // GST GSTR-1 - 11th of every month
  events.push({
    title: "GST GSTR-1 Filing",
    day: 11,
    category: "GST",
    frequency: "Monthly",
    description: "Details of outward supplies",
  })

  // TDS Payment - 7th of every month
  events.push({
    title: `TDS Payment for ${new Date(year, month - 2, 1).toLocaleString('en-IN', { month: 'long' })}`,
    day: 7,
    category: "TDS",
    frequency: "Monthly",
    description: `Payment of TDS deducted in ${new Date(year, month - 2, 1).toLocaleString('en-IN', { month: 'long' })}`,
  })

  // PF/ESI - 15th of every month
  events.push({
    title: "PF & ESI Payment",
    day: 15,
    category: "Other",
    frequency: "Monthly",
    description: `PF and ESI payment for ${new Date(year, month - 2, 1).toLocaleString('en-IN', { month: 'long' })}`,
  })

  // Quarterly events
  // Advance Tax - 15th June, Sept, Dec, March
  if (month === 6 || month === 9 || month === 12 || month === 3) {
    const quarter = month === 6 ? "Q1" : month === 9 ? "Q2" : month === 12 ? "Q3" : "Q4"
    events.push({
      title: `Advance Tax ${quarter} Payment`,
      day: month === 3 ? 15 : 15,
      category: "Income Tax",
      frequency: "Quarterly",
      description: `${quarter} installment of advance tax for FY ${year}-${(year + 1) % 100}`,
    })
  }

  // TDS Return - Last day of month after quarter end (July, Oct, Jan, April)
  if (month === 7 || month === 10 || month === 1 || month === 4) {
    const quarter = month === 7 ? "Q1" : month === 10 ? "Q2" : month === 1 ? "Q3" : "Q4"
    const lastDay = new Date(year, month, 0).getDate()
    events.push({
      title: `TDS Return ${quarter} Filing`,
      day: lastDay,
      category: "TDS",
      frequency: "Quarterly",
      description: `TDS return for ${quarter}`,
    })
  }

  // Annual events
  // Income Tax Return - 31st July
  if (month === 7) {
    events.push({
      title: "Income Tax Return Filing",
      day: 31,
      category: "Income Tax",
      frequency: "Annual",
      description: "ITR filing for individuals and non-audit cases",
    })
  }

  // Tax Audit Report - 30th September
  if (month === 9) {
    events.push({
      title: "Tax Audit Report Filing",
      day: 30,
      category: "Income Tax",
      frequency: "Annual",
      description: "Tax audit report under Section 44AB",
    })
  }

  // GST Annual Return - 31st December
  if (month === 12) {
    events.push({
      title: "GST Annual Return (GSTR-9)",
      day: 31,
      category: "GST",
      frequency: "Annual",
      description: `Annual return for FY ${year - 1}-${year % 100}`,
    })
  }

  // ROC Annual Filing - 30th September
  if (month === 9) {
    events.push({
      title: "ROC Annual Filing (AOC-4, MGT-7)",
      day: 30,
      category: "ROC",
      frequency: "Annual",
      description: "Annual filing of financial statements and annual return",
    })
  }

  // DIR-3 KYC - 30th September
  if (month === 9) {
    events.push({
      title: "DIR-3 KYC Filing",
      day: 30,
      category: "ROC",
      frequency: "Annual",
      description: "Director KYC filing for all directors",
    })
  }

  // Professional Tax - varies by state, using 15th as common date
  events.push({
    title: "Professional Tax Payment",
    day: 15,
    category: "Other",
    frequency: "Monthly",
    description: "Professional tax payment (state-specific)",
  })

  return events.map((event, index) => ({
    ...event,
    id: `${year}-${month}-${index}`,
    dueDate: `${year}-${String(month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`,
  }))
}

const categories = [
  { label: "All", value: "all" },
  { label: "Income Tax", value: "Income Tax" },
  { label: "GST", value: "GST" },
  { label: "TDS", value: "TDS" },
  { label: "ROC", value: "ROC" },
  { label: "Other", value: "Other" },
]

function getDaysUntil(dateString: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(dateString)
  dueDate.setHours(0, 0, 0, 0)
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getStatusBadge(daysUntil: number) {
  if (daysUntil < 0) {
    return <Badge variant="destructive" className="text-xs">Overdue</Badge>
  } else if (daysUntil <= 3) {
    return <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">Due Soon</Badge>
  } else if (daysUntil <= 7) {
    return <Badge variant="secondary" className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white">Upcoming</Badge>
  } else {
    return <Badge variant="outline" className="text-xs">Scheduled</Badge>
  }
}

export default function ComplianceCalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1) // 1-12
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedCategory, setSelectedCategory] = useState("all")

  const complianceEvents = useMemo(() => {
    return getComplianceEventsForMonth(currentYear, currentMonth)
  }, [currentYear, currentMonth])

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "all") {
      return complianceEvents
    }
    return complianceEvents.filter(event => event.category === selectedCategory)
  }, [complianceEvents, selectedCategory])

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const currentMonthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric'
  })

  const isCurrentMonth = currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Compliance Calendar
            </h1>
            <p className="text-xl text-white/90">
              Never miss a compliance deadline with our comprehensive calendar
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  selectedCategory === category.value
                    ? "bg-primary hover:bg-primary-light text-white"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Current Month View */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={handlePreviousMonth}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-center">
                <h2 className="text-2xl font-heading font-bold text-primary">
                  {currentMonthName}
                </h2>
                {isCurrentMonth && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-text-muted mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Current Month</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                onClick={handleNextMonth}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-text-muted">
                  No compliance events for the selected category this month
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEvents
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((event) => {
                    const daysUntil = getDaysUntil(event.dueDate)
                    return (
                      <Card key={event.id} className="card-hover">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-2">
                                <div className={`w-1 h-full ${
                                  event.category === 'GST' ? 'bg-green-500' :
                                  event.category === 'Income Tax' ? 'bg-blue-500' :
                                  event.category === 'TDS' ? 'bg-red-500' :
                                  event.category === 'ROC' ? 'bg-purple-500' :
                                  'bg-gray-500'
                                } rounded`}></div>
                                <div>
                                  <CardTitle className="text-lg">{event.title}</CardTitle>
                                  <p className="text-sm text-text-muted mt-1">{event.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {event.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(daysUntil)}
                              <div className="text-sm font-semibold text-primary">
                                {new Date(event.dueDate).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-text-muted flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.frequency}
                              </div>
                              {daysUntil >= 0 && daysUntil <= 30 && (
                                <div className="text-xs text-text-muted">
                                  {daysUntil === 0 ? "Today" :
                                   daysUntil === 1 ? "Tomorrow" :
                                   `${daysUntil} days left`}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-heading font-bold text-primary mb-6 text-center">
              Status Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Overdue</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">Due Soon (≤3 days)</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">Upcoming (≤7 days)</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Scheduled</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-2">Important Note</h3>
              <p className="text-sm text-blue-700 mb-2">
                Due dates may vary based on business type, turnover, and specific circumstances.
                Some dates are subject to change based on government notifications.
              </p>
              <p className="text-sm text-blue-700">
                For personalized compliance calendar and reminders, please contact us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Never Miss a Deadline
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let us handle your compliance requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <button className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Book Appointment
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
