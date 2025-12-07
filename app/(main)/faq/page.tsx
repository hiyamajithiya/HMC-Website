"use client"

import { Metadata } from "next"
import { useState } from "react"
import { HelpCircle, ChevronDown, ChevronUp, Search, Phone, Mail } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"
import Link from "next/link"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What services does Himanshu Majithiya & Co. provide?",
          a: "We are a full-service Chartered Accountancy firm offering Income Tax Return Filing, GST Services, Company Audit, Company Formation, FEMA/FFMC Compliance, Financial Consulting, and AI-powered Business Automation solutions."
        },
        {
          q: "Where is your office located?",
          a: `Our office is located at ${SITE_INFO.address.line1}, ${SITE_INFO.address.line2}, ${SITE_INFO.address.city}, ${SITE_INFO.address.state} ${SITE_INFO.address.pincode}. We also offer virtual consultations for clients who prefer online meetings.`
        },
        {
          q: "What are your office hours?",
          a: "We are open Monday to Saturday from 10:00 AM to 6:00 PM. We are closed on Sundays and public holidays. For urgent matters, please call us to schedule a special appointment."
        },
        {
          q: "How can I schedule a consultation?",
          a: "You can book an appointment online through our website, call us directly, or send us an email. We typically respond within 24 hours to schedule a convenient time for you."
        },
        {
          q: "Do you offer virtual consultations?",
          a: "Yes! We offer both in-person and virtual consultations via video conferencing platforms. This allows us to serve clients across India and internationally."
        }
      ]
    },
    {
      category: "Income Tax",
      questions: [
        {
          q: "What is the last date to file Income Tax Returns for FY 2024-25?",
          a: "For individuals and HUFs (non-audit cases), the due date is July 31, 2025. For audit cases and businesses, the due date is typically October 31, 2025. However, we recommend filing early to avoid last-minute issues."
        },
        {
          q: "What documents do I need to file my Income Tax Return?",
          a: "You'll need: PAN Card, Aadhaar Card, Form 16 (if salaried), Bank Statements, Investment Proofs (80C, 80D, etc.), Home Loan Interest Certificate, Capital Gains statements, and any other income documents like rental agreements or business P&L statements."
        },
        {
          q: "Can I claim tax deduction under Section 80C?",
          a: "Yes, you can claim deductions up to ₹1.5 lakh under Section 80C for investments in PPF, ELSS, EPF, Life Insurance Premiums, Principal repayment of Home Loan, Sukanya Samriddhi Yojana, NSC, and more."
        },
        {
          q: "What is the benefit of Section 87A rebate in the new tax regime?",
          a: "For FY 2025-26, if your taxable income is up to ₹12 lakh under the new tax regime, you get a rebate of up to ₹60,000, effectively making your tax liability zero. For FY 2024-25, the limit was ₹7 lakh with a ₹25,000 rebate."
        },
        {
          q: "Should I choose the old or new tax regime?",
          a: "It depends on your individual circumstances, deductions, and exemptions. The new regime has lower tax rates but fewer deductions. We recommend scheduling a consultation to analyze which regime saves you more tax based on your specific situation."
        },
        {
          q: "What happens if I miss the ITR filing deadline?",
          a: "You can still file a belated return until December 31st of the assessment year, but you'll have to pay a late filing fee (₹5,000 or ₹1,000 depending on income). You may also lose certain benefits like carrying forward losses."
        },
        {
          q: "Can I revise my Income Tax Return after filing?",
          a: "Yes, you can revise your return within the time allowed under the Income Tax Act if you discover any errors or omissions. The revised return must be filed before the end of the assessment year or before completion of assessment, whichever is earlier."
        }
      ]
    },
    {
      category: "GST",
      questions: [
        {
          q: "Who needs to register for GST?",
          a: "Businesses with annual turnover exceeding ₹40 lakh (₹20 lakh for special category states) must register for GST. E-commerce sellers, inter-state suppliers, and certain specified businesses must register regardless of turnover."
        },
        {
          q: "How long does GST registration take?",
          a: "GST registration typically takes 3-7 working days if all documents are in order. We handle the entire process including documentation, application filing, and follow-up with GST authorities."
        },
        {
          q: "What is GSTR-1, GSTR-3B, and when are they due?",
          a: "GSTR-1 is for reporting outward supplies (sales) and is due on the 11th of the following month. GSTR-3B is a summary return for paying tax and is due on the 20th. For quarterly filers under QRMP scheme, GSTR-1 is due on the 13th of the month following the quarter."
        },
        {
          q: "Can I claim Input Tax Credit (ITC)?",
          a: "Yes, you can claim ITC on goods and services used for business purposes, provided you have valid tax invoices and the supplier has filed their returns. ITC cannot be claimed on certain items like motor vehicles (with exceptions), food and beverages, and personal expenses."
        },
        {
          q: "What are the GST rates in India?",
          a: "GST has four main slabs: 5%, 12%, 18%, and 28%. Essential items have 0% or 5% GST, while luxury and demerit goods attract 28%. Additionally, precious metals have 3% GST. The rate depends on the HSN/SAC code of your product/service."
        },
        {
          q: "What is the penalty for late filing of GST returns?",
          a: "Late filing attracts a penalty of ₹50 per day (₹20 for nil returns) under CGST and SGST each, making it ₹100 per day (₹40 for nil returns). Maximum penalty is ₹5,000. Additionally, interest at 18% p.a. applies on delayed tax payment."
        }
      ]
    },
    {
      category: "Company Formation",
      questions: [
        {
          q: "What are the different types of company structures in India?",
          a: "The main types are: Private Limited Company (most common for startups), Public Limited Company, One Person Company (OPC), Limited Liability Partnership (LLP), and Partnership Firm. Each has different compliance requirements and benefits."
        },
        {
          q: "How long does company incorporation take?",
          a: "With proper documentation, company incorporation typically takes 7-15 days. This includes name approval, drafting documents, filing with MCA, and obtaining incorporation certificate. We ensure a smooth and fast process."
        },
        {
          q: "What documents are needed for company registration?",
          a: "You'll need: PAN and Aadhaar of Directors/Partners, Address Proof of Registered Office, Rental Agreement or NOC, Director's photographs, Digital Signature Certificate (DSC), and MOA/AOA. We guide you through the entire documentation process."
        },
        {
          q: "What is the minimum capital required to start a Private Limited Company?",
          a: "There is no minimum capital requirement for incorporating a Private Limited Company in India. You can start with any amount, even ₹1. However, having adequate capital is recommended for business operations."
        },
        {
          q: "How many directors are required for a Private Limited Company?",
          a: "A Private Limited Company requires a minimum of 2 directors and can have a maximum of 15 directors. At least one director must be an Indian resident. Directors must have DIN (Director Identification Number)."
        },
        {
          q: "What are the ongoing compliance requirements after incorporation?",
          a: "Annual compliances include: ROC Annual Filing, Income Tax Return, GST Returns (if applicable), TDS Returns, Audit (if applicable), Board Meetings, AGM, and maintaining statutory registers. We offer comprehensive compliance packages."
        }
      ]
    },
    {
      category: "Audit Services",
      questions: [
        {
          q: "Who needs to get their accounts audited?",
          a: "Mandatory audit applies to: All companies (regardless of turnover), businesses with turnover exceeding ₹1 crore (presumptive taxation limit is ₹2 crore for certain businesses), LLPs with contribution exceeding ₹25 lakh or turnover exceeding ₹40 lakh, and certain professionals."
        },
        {
          q: "What is the difference between Statutory Audit and Internal Audit?",
          a: "Statutory Audit is mandatory as per law, conducted annually by an independent CA to verify financial statements' accuracy. Internal Audit is voluntary (except for certain cases), conducted periodically to assess internal controls, risk management, and operational efficiency."
        },
        {
          q: "What documents are required for a company audit?",
          a: "Required documents include: Books of Accounts, Bank Statements, Sales and Purchase Invoices, Stock Registers, Fixed Asset Registers, Trial Balance, Financial Statements, GST and TDS Returns, Agreements/Contracts, and Board Resolutions."
        },
        {
          q: "How long does the audit process take?",
          a: "The duration depends on company size and complexity. For small companies, it typically takes 2-4 weeks. For larger organizations, it may take 1-3 months. We ensure timely completion with minimal disruption to your operations."
        },
        {
          q: "What is Tax Audit and when is it required?",
          a: "Tax Audit under Section 44AB is required for businesses with turnover exceeding ₹1 crore (₹10 crore for certain digital businesses) or professionals with gross receipts exceeding ₹50 lakh. The audit report must be filed by September 30th (October 31st for Transfer Pricing cases)."
        }
      ]
    },
    {
      category: "FEMA & FFMC",
      questions: [
        {
          q: "What is FEMA compliance?",
          a: "FEMA (Foreign Exchange Management Act) regulates foreign exchange transactions in India. It covers FDI, ODI, ECB, Foreign Portfolio Investment, and remittances. Businesses dealing with foreign entities must comply with FEMA regulations."
        },
        {
          q: "What is FFMC and who needs it?",
          a: "FFMC (Full-Fledged Money Changer) license is required for entities engaged in buying and selling foreign currency. It's regulated by RBI and requires strict compliance with FEMA and AML regulations."
        },
        {
          q: "What are the reporting requirements under FEMA?",
          a: "Key filings include: Foreign Liabilities and Assets (FLA) Return, Annual Return on Foreign Liabilities and Assets (FLA), Form FC-GPR for foreign investment, Advance Reporting Forms for ODI/FDI, and RBI master returns."
        },
        {
          q: "What is the penalty for non-compliance with FEMA?",
          a: "FEMA violations can attract penalties up to 3 times the sum involved in contravention. In cases where the amount is not quantifiable, penalties up to ₹2 lakh may be levied. Continued non-compliance can lead to further penalties."
        }
      ]
    },
    {
      category: "Fees & Payment",
      questions: [
        {
          q: "How do you charge for your services?",
          a: "Our fees depend on the complexity and scope of work. We offer transparent, competitive pricing. For most services, we provide a fixed fee quote upfront. For ongoing services, we offer monthly/annual packages. Contact us for a customized quote."
        },
        {
          q: "Do you offer package deals for multiple services?",
          a: "Yes! We offer bundled packages for startups and businesses needing multiple services like company formation + GST registration + accounting. Packages provide significant cost savings and convenience."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept payments via Bank Transfer (NEFT/RTGS/IMPS), UPI, Credit/Debit Cards, and Cheques. All payments are subject to applicable GST."
        },
        {
          q: "Do I need to pay an advance?",
          a: "For most services, we require an advance payment (typically 50%) before starting work. The balance is due upon completion or as per the agreed payment schedule in the engagement letter."
        }
      ]
    },
    {
      category: "Technology & Tools",
      questions: [
        {
          q: "What is AI-powered business automation?",
          a: "We help businesses automate repetitive tasks like invoice processing, expense tracking, GST reconciliation, and financial reporting using AI and machine learning. This saves time, reduces errors, and improves efficiency."
        },
        {
          q: "Do you provide accounting software setup?",
          a: "Yes, we help you select, implement, and configure accounting software (Tally, QuickBooks, Zoho Books, etc.) tailored to your business needs. We also provide training to your team."
        },
        {
          q: "Can I access my financial data online?",
          a: "If you opt for cloud-based accounting solutions, you can access your financial data anytime, anywhere. We use secure, encrypted platforms to ensure data privacy and security."
        },
        {
          q: "Do you offer online tax calculators?",
          a: "Yes! Our website has free online calculators for Income Tax, GST, and other financial calculations. These are designed to give you quick estimates. For accurate tax planning, we recommend a professional consultation."
        }
      ]
    }
  ]

  // Filter FAQs based on search query
  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90">
              Find answers to common questions about our services
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted text-lg">
                  No results found for "{searchQuery}". Try a different search term.
                </p>
              </div>
            ) : (
              filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-primary">
                    {category.category}
                  </h2>

                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex
                      const isOpen = openIndex === globalIndex

                      return (
                        <div
                          key={faqIndex}
                          className="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-bg-secondary transition-colors"
                          >
                            <span className="font-semibold text-text-primary flex-1">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-text-muted flex-shrink-0 mt-1" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-6 pb-4 text-text-secondary animate-slide-down">
                              <p className="leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-text-secondary mb-8">
              Can't find the answer you're looking for? Our team is here to help!
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/contact"
                className="bg-bg-secondary p-6 rounded-lg hover:shadow-md transition-shadow group"
              >
                <Mail className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-text-secondary">
                  {SITE_INFO.email.primary}
                </p>
              </Link>

              <Link
                href={`tel:${SITE_INFO.phone.primary}`}
                className="bg-bg-secondary p-6 rounded-lg hover:shadow-md transition-shadow group"
              >
                <Phone className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-text-secondary">
                  {SITE_INFO.phone.primary}
                </p>
              </Link>

              <Link
                href="/book-appointment"
                className="bg-primary text-white p-6 rounded-lg hover:bg-primary-light transition-colors group"
              >
                <HelpCircle className="h-10 w-10 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Book Consultation</h3>
                <p className="text-sm text-white/90">
                  Schedule a meeting
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">Helpful Resources</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/resources/calculators/income-tax"
                className="px-6 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-primary font-semibold"
              >
                Income Tax Calculator
              </Link>
              <Link
                href="/resources/compliance-calendar"
                className="px-6 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-primary font-semibold"
              >
                Compliance Calendar
              </Link>
              <Link
                href="/resources/useful-links"
                className="px-6 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-primary font-semibold"
              >
                Useful Links
              </Link>
              <Link
                href="/services"
                className="px-6 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-primary font-semibold"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
