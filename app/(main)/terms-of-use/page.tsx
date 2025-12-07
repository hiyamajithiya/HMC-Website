import { Metadata } from "next"
import { FileText, AlertCircle, Scale } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Terms of Use | Himanshu Majithiya & Co.",
  description: "Terms and conditions governing the use of our website and services. Please read carefully before using our services.",
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Scale className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Use
            </h1>
            <p className="text-xl text-white/90">
              Terms and conditions governing our services
            </p>
            <p className="text-sm text-white/80 mt-4">
              Last Updated: December 7, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">

            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg text-text-secondary leading-relaxed">
                Welcome to <strong>Himanshu Majithiya & Co.</strong> These Terms of Use govern your access to and use of our website and professional services. By accessing or using our website, you agree to be bound by these terms. If you do not agree with these terms, please do not use our website or services.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
              </div>
              <p className="text-text-secondary mb-3">
                By accessing this website and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. These terms constitute a legally binding agreement between you and Himanshu Majithiya & Co.
              </p>
            </div>

            {/* Services Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Services Description</h2>
              <p className="text-text-secondary mb-3">
                Himanshu Majithiya & Co. is a firm of Chartered Accountants providing professional services including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Income Tax Return Filing and Tax Planning</li>
                <li>GST Registration, Filing, and Compliance</li>
                <li>Company Formation and Incorporation</li>
                <li>Statutory and Internal Audits</li>
                <li>FEMA and FFMC Compliance</li>
                <li>Financial Consulting and Advisory</li>
                <li>AI and Business Automation Solutions</li>
              </ul>
              <p className="text-text-secondary mt-3">
                The specific scope and terms of each engagement will be defined in a separate engagement letter or service agreement.
              </p>
            </div>

            {/* Use of Website */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Use of Website</h2>

              <h3 className="text-lg font-semibold mb-2 mt-4">3.1 Permitted Use</h3>
              <p className="text-text-secondary mb-3">
                You may use our website for lawful purposes only, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Accessing information about our services</li>
                <li>Contacting us for inquiries or consultations</li>
                <li>Using calculators and tools provided on the website</li>
                <li>Reading blog posts and resources</li>
                <li>Scheduling appointments</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-6">3.2 Prohibited Use</h3>
              <p className="text-text-secondary mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Use the website for any unlawful purpose or to violate any laws</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Copy, modify, or distribute website content without permission</li>
                <li>Use automated systems (bots, scrapers) to access the website</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Collect or harvest personal information of other users</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property Rights</h2>
              <p className="text-text-secondary mb-3">
                All content on this website, including but not limited to text, graphics, logos, images, software, calculators, and tools, is the property of Himanshu Majithiya & Co. or its licensors and is protected by Indian and international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-text-secondary mb-3">
                You may not reproduce, distribute, modify, create derivative works, publicly display, or exploit any content from this website without our prior written consent.
              </p>
            </div>

            {/* Professional Relationship */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Professional Relationship and Engagement</h2>

              <h3 className="text-lg font-semibold mb-2">5.1 No Attorney-Client Relationship</h3>
              <p className="text-text-secondary mb-3">
                Use of this website or communication through contact forms does not create a chartered accountant-client relationship. A formal engagement relationship is established only through a written engagement letter signed by both parties.
              </p>

              <h3 className="text-lg font-semibold mb-2 mt-4">5.2 Engagement Terms</h3>
              <p className="text-text-secondary mb-3">
                All professional services are subject to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Execution of a formal engagement letter</li>
                <li>Agreement on scope of work and fees</li>
                <li>Compliance with ICAI (Institute of Chartered Accountants of India) regulations</li>
                <li>Professional standards and ethical guidelines</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">5.3 Confidentiality</h3>
              <p className="text-text-secondary">
                We maintain strict confidentiality of client information in accordance with ICAI professional standards. However, we may be required to disclose information as mandated by law or regulatory authorities.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>

              <h3 className="text-lg font-semibold mb-2">6.1 Website Information</h3>
              <p className="text-text-secondary mb-3">
                The information provided on this website is for general informational purposes only. While we strive for accuracy:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>We make no warranties about completeness, accuracy, or reliability</li>
                <li>Tax laws and regulations change frequently</li>
                <li>Information should not be considered professional advice for your specific situation</li>
                <li>You should consult with us directly for personalized advice</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-6">6.2 Calculators and Tools</h3>
              <p className="text-text-secondary mb-3">
                Calculators and tools provided on our website are for estimation purposes only. Results may vary based on individual circumstances. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Accuracy of calculations or projections</li>
                <li>Decisions made based on calculator results</li>
                <li>Any loss or damage arising from use of these tools</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-6">6.3 Third-Party Services</h3>
              <p className="text-text-secondary">
                Our website may integrate third-party services (such as appointment scheduling). We are not responsible for the availability, accuracy, or policies of these third-party services.
              </p>

              <h3 className="text-lg font-semibold mb-2 mt-6">6.4 Disclaimer of Warranties</h3>
              <p className="text-text-secondary mb-3">
                Our website is provided "as is" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Freedom from viruses or harmful components</li>
              </ul>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Indemnification</h2>
              <p className="text-text-secondary">
                You agree to indemnify and hold harmless Himanshu Majithiya & Co., its partners, employees, and affiliates from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4 mt-3">
                <li>Your use of the website</li>
                <li>Your violation of these Terms of Use</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Your infringement of any third-party rights</li>
              </ul>
            </div>

            {/* Links to Third-Party Sites */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Third-Party Links</h2>
              <p className="text-text-secondary">
                Our website may contain links to third-party websites for your convenience. We do not endorse or control these websites and are not responsible for their content, privacy practices, or terms. Accessing third-party links is at your own risk.
              </p>
            </div>

            {/* Fees and Payment */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Fees and Payment</h2>
              <p className="text-text-secondary mb-3">
                Professional service fees will be agreed upon in writing through an engagement letter. Payment terms include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Fees are exclusive of applicable taxes (GST, etc.)</li>
                <li>Payment is due as specified in the engagement letter</li>
                <li>We reserve the right to suspend services for non-payment</li>
                <li>Out-of-pocket expenses may be billed separately</li>
              </ul>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
              <p className="text-text-secondary mb-3">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Suspend or terminate your access to the website at any time</li>
                <li>Remove or disable any content you submit</li>
                <li>Terminate professional engagements as per ICAI guidelines</li>
              </ul>
              <p className="text-text-secondary mt-3">
                Upon termination, your right to use the website ceases immediately. Provisions that by their nature should survive termination shall continue to apply.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Governing Law and Jurisdiction</h2>
              <p className="text-text-secondary">
                These Terms of Use shall be governed by and construed in accordance with the laws of India. Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts in {SITE_INFO.address.city}, {SITE_INFO.address.state}.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
              <p className="text-text-secondary">
                We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after changes constitutes acceptance of the modified terms. We encourage you to review these terms periodically.
              </p>
            </div>

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">13. Severability</h2>
              <p className="text-text-secondary">
                If any provision of these Terms of Use is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be replaced with a valid provision that most closely matches the intent of the original.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-bg-secondary p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
              <p className="text-text-secondary mb-4">
                If you have questions about these Terms of Use, please contact us:
              </p>

              <div className="space-y-2 text-text-secondary">
                <p><strong>Himanshu Majithiya & Co.</strong></p>
                <p><strong>Chartered Accountants</strong></p>
                <p className="mt-3">
                  <strong>Address:</strong><br />
                  {SITE_INFO.address.street}<br />
                  {SITE_INFO.address.city}, {SITE_INFO.address.state} {SITE_INFO.address.zip}
                </p>
                <p className="mt-2">
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${SITE_INFO.email.primary}`} className="text-primary hover:underline">
                    {SITE_INFO.email.primary}
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${SITE_INFO.phone.primary}`} className="text-primary hover:underline">
                    {SITE_INFO.phone.primary}
                  </a>
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-2">Important Notice</p>
                  <p className="text-sm text-yellow-700">
                    By using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you must discontinue use of our website immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
