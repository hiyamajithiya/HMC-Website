import { Metadata } from "next"
import { AlertTriangle, Info, Shield } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Disclaimer | Himanshu Majithiya & Co.",
  description: "Important disclaimers regarding the use of our website and the information provided. Please read carefully.",
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Disclaimer
            </h1>
            <p className="text-xl text-white/90">
              Important information about our website and services
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

            {/* Important Notice */}
            <div className="mb-12 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-800 text-lg mb-2">Please Read Carefully</h3>
                  <p className="text-yellow-700">
                    The information contained on this website is for general information purposes only. By using this website, you acknowledge and accept the limitations and disclaimers set forth below.
                  </p>
                </div>
              </div>
            </div>

            {/* General Information Disclaimer */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">1. General Information Disclaimer</h2>
              </div>
              <p className="text-text-secondary mb-3">
                The information provided on this website is for general informational and educational purposes only. It is not intended to be, and should not be construed as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Professional accounting, tax, legal, or financial advice</li>
                <li>A substitute for professional consultation</li>
                <li>An offer or solicitation to provide specific services</li>
                <li>Comprehensive or complete coverage of any topic</li>
                <li>Current or up-to-date information in all cases</li>
              </ul>
              <p className="text-text-secondary mt-4">
                While we make every effort to ensure the information is accurate and current, laws, regulations, and professional standards change frequently. Information on this website may become outdated or may not apply to your specific circumstances.
              </p>
            </div>

            {/* No Professional Relationship */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. No Professional Relationship Created</h2>
              <p className="text-text-secondary mb-3">
                <strong>Important:</strong> Simply visiting this website, reading content, or using contact forms does NOT establish a chartered accountant-client relationship or any professional engagement with Himanshu Majithiya & Co.
              </p>
              <p className="text-text-secondary mb-3">
                A professional relationship is created only when:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>You and our firm execute a written engagement letter</li>
                <li>The scope of work and fees are mutually agreed upon</li>
                <li>We formally accept the engagement in writing</li>
                <li>All necessary conflict checks and compliance requirements are met</li>
              </ul>
              <p className="text-text-secondary mt-4">
                Until a formal engagement is established, any information you submit through this website is not protected by professional confidentiality obligations.
              </p>
            </div>

            {/* Tax and Legal Advice */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Tax, Legal, and Financial Advice Disclaimer</h2>
              <p className="text-text-secondary mb-3">
                The content on this website, including blog posts, articles, calculators, and resources, is NOT personalized tax, legal, or financial advice for your specific situation.
              </p>
              <p className="text-text-secondary mb-3">
                <strong>You should NOT:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Rely solely on website content for important decisions</li>
                <li>Take action based on general information without professional consultation</li>
                <li>Assume that information applies to your unique circumstances</li>
                <li>Use website content as a substitute for professional advice</li>
              </ul>
              <p className="text-text-secondary mt-4">
                <strong>Always consult</strong> with a qualified chartered accountant, tax professional, or legal advisor before making decisions affecting your taxes, finances, or legal matters.
              </p>
            </div>

            {/* Calculators and Tools */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Calculators and Tools Disclaimer</h2>
              <p className="text-text-secondary mb-3">
                The calculators, tools, and interactive features on this website are provided for <strong>estimation and informational purposes only</strong>.
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4 mb-4">
                <p className="text-red-700 font-semibold">
                  Important: Do NOT use calculator results for actual tax filing or financial planning without professional verification.
                </p>
              </div>

              <p className="text-text-secondary mb-3">
                <strong>Limitations:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Calculators use simplified formulas and assumptions</li>
                <li>Results may not account for all deductions, exemptions, or special circumstances</li>
                <li>Tax laws change frequently; calculators may not reflect latest amendments</li>
                <li>Individual tax situations vary significantly</li>
                <li>Calculators are not a substitute for professional tax preparation</li>
                <li>We are not responsible for decisions made based on calculator results</li>
                <li>We are not liable for any errors, inaccuracies, or omissions in calculator outputs</li>
              </ul>
            </div>

            {/* Accuracy and Completeness */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Accuracy and Completeness</h2>
              <p className="text-text-secondary mb-3">
                While we strive to provide accurate and current information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li><strong>No Guarantee of Accuracy:</strong> We make no representations or warranties about the accuracy, reliability, or completeness of any information on this website</li>
                <li><strong>Subject to Change:</strong> Laws, regulations, and interpretations change constantly. Information may become outdated without notice</li>
                <li><strong>Errors and Omissions:</strong> Despite our best efforts, errors or omissions may occur. We are not liable for any such errors</li>
                <li><strong>No Update Obligation:</strong> We are under no obligation to update information or notify users of changes</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-text-secondary mb-3">
                To the fullest extent permitted by law, Himanshu Majithiya & Co. and its partners, employees, and affiliates shall NOT be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Any direct, indirect, incidental, or consequential damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Damages arising from use or inability to use this website</li>
                <li>Reliance on information provided on this website</li>
                <li>Decisions made based on website content, calculators, or tools</li>
                <li>Third-party content, links, or services</li>
                <li>Website interruptions, errors, or technical issues</li>
                <li>Unauthorized access to or alteration of your data</li>
              </ul>
              <p className="text-text-secondary mt-4">
                <strong>Use this website at your own risk.</strong> You are solely responsible for any decisions or actions taken based on information from this website.
              </p>
            </div>

            {/* Third-Party Content */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Third-Party Links and Content</h2>
              <p className="text-text-secondary mb-3">
                Our website may contain links to third-party websites, resources, or services. These links are provided for convenience only.
              </p>
              <p className="text-text-secondary mb-3">
                <strong>We do NOT:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Endorse or approve third-party content</li>
                <li>Control or verify accuracy of external information</li>
                <li>Assume responsibility for third-party websites or services</li>
                <li>Guarantee availability or functionality of external links</li>
              </ul>
              <p className="text-text-secondary mt-3">
                Accessing third-party websites is at your own risk. Review their terms and privacy policies before use.
              </p>
            </div>

            {/* Professional Standards */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Professional Standards and Compliance</h2>
              <p className="text-text-secondary mb-3">
                Himanshu Majithiya & Co. is governed by the regulations and professional standards of the Institute of Chartered Accountants of India (ICAI).
              </p>
              <p className="text-text-secondary mb-3">
                When we provide professional services through a formal engagement:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>We adhere to ICAI Code of Ethics and professional standards</li>
                <li>Services are subject to applicable laws and regulations</li>
                <li>We may be required to report certain matters to authorities</li>
                <li>Professional liability is governed by the engagement letter</li>
              </ul>
            </div>

            {/* Jurisdiction-Specific Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Jurisdiction and Applicability</h2>
              <p className="text-text-secondary mb-3">
                Information on this website primarily pertains to Indian tax laws, regulations, and compliance requirements. If you are located outside India or subject to other jurisdictions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Information may not apply to your situation</li>
                <li>Different laws and regulations may govern your circumstances</li>
                <li>Consult with professionals in your jurisdiction</li>
                <li>We may not be authorized to provide services in your location</li>
              </ul>
            </div>

            {/* No Warranties */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. No Warranties</h2>
              <p className="text-text-secondary mb-3">
                This website is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Accuracy, reliability, or completeness of information</li>
                <li>Uninterrupted, timely, or error-free operation</li>
                <li>Freedom from viruses, malware, or harmful components</li>
                <li>Results that will be obtained from use of the website</li>
              </ul>
            </div>

            {/* Changes and Updates */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Changes to Disclaimer</h2>
              <p className="text-text-secondary">
                We reserve the right to modify this disclaimer at any time without prior notice. Changes are effective immediately upon posting. Your continued use of the website after modifications constitutes acceptance of the updated disclaimer. Please review this page periodically for changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-bg-secondary p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">12. Questions or Concerns</h2>
              <p className="text-text-secondary mb-4">
                If you have questions about this disclaimer or need professional assistance, please contact us:
              </p>

              <div className="space-y-2 text-text-secondary">
                <p><strong>Himanshu Majithiya & Co.</strong></p>
                <p><strong>Chartered Accountants</strong></p>
                <p className="mt-3">
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

            {/* Final Warning */}
            <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-800 text-lg mb-2">Critical Reminder</p>
                  <p className="text-red-700 mb-2">
                    <strong>DO NOT</strong> make important financial, tax, or legal decisions based solely on information from this website.
                  </p>
                  <p className="text-red-700">
                    <strong>ALWAYS</strong> consult with a qualified professional who can review your specific circumstances and provide personalized advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Consultation */}
            <div className="mt-8 p-6 bg-primary/5 border-l-4 border-primary rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary mb-2">Need Professional Advice?</p>
                  <p className="text-text-secondary mb-3">
                    For personalized consultation and professional services tailored to your specific needs, please schedule an appointment with us.
                  </p>
                  <a
                    href="/book-appointment"
                    className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                  >
                    Book a Consultation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
