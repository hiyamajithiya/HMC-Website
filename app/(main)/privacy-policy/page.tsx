import { Metadata } from "next"
import { Shield, Lock, Eye, FileText } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Privacy Policy | Himanshu Majithiya & Co.",
  description: "Our commitment to protecting your privacy and personal information. Learn how we collect, use, and safeguard your data.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90">
              Your privacy is important to us
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
                At <strong>Himanshu Majithiya & Co.</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.1 Personal Information</h3>
              <p className="text-text-secondary mb-3">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Fill out contact forms on our website</li>
                <li>Schedule appointments or consultations</li>
                <li>Subscribe to our newsletter or updates</li>
                <li>Request our services</li>
                <li>Communicate with us via email or phone</li>
              </ul>

              <p className="text-text-secondary mt-4 mb-3">
                This information may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Company or business details</li>
                <li>Tax identification numbers (PAN, GST, etc.)</li>
                <li>Financial information relevant to services requested</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Automatically Collected Information</h3>
              <p className="text-text-secondary mb-3">
                When you visit our website, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website or source</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
              </div>

              <p className="text-text-secondary mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li><strong>Service Delivery:</strong> To provide chartered accountancy services, tax filing, audits, and compliance assistance</li>
                <li><strong>Communication:</strong> To respond to your inquiries, send appointment confirmations, and provide updates</li>
                <li><strong>Website Improvement:</strong> To analyze website usage and improve user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and professional standards</li>
                <li><strong>Marketing:</strong> To send newsletters, updates, and promotional materials (with your consent)</li>
                <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security threats</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">3. How We Share Your Information</h2>
              </div>

              <p className="text-text-secondary mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>

              <h3 className="text-lg font-semibold mb-2 mt-4">3.1 Service Providers</h3>
              <p className="text-text-secondary mb-3">
                We may share information with trusted third-party service providers who assist us in:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Email delivery and communication services</li>
                <li>Payment processing</li>
                <li>Website hosting and analytics</li>
                <li>Appointment scheduling (e.g., Calendly)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">3.2 Legal Requirements</h3>
              <p className="text-text-secondary mb-3">
                We may disclose your information if required by law, court order, or government regulation, or to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Comply with legal processes</li>
                <li>Protect our rights and property</li>
                <li>Prevent fraud or security threats</li>
                <li>Protect the safety of our users or the public</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">3.3 Professional Obligations</h3>
              <p className="text-text-secondary">
                As chartered accountants, we may be required to share information with regulatory bodies such as ICAI (Institute of Chartered Accountants of India), tax authorities, or other government agencies as mandated by law.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-text-secondary mb-3">
                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Encryption of sensitive data during transmission (SSL/HTTPS)</li>
                <li>Secure storage of client information</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-text-secondary mt-3">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-text-secondary mb-3">
                We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve website functionality and performance</li>
                <li>Provide relevant content and features</li>
              </ul>
              <p className="text-text-secondary mt-3">
                You can control cookie preferences through your browser settings. However, disabling cookies may limit some website functionality. For more details, please see our <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a>.
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
              <p className="text-text-secondary mb-3">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Data Portability:</strong> Request transfer of your data in a machine-readable format</li>
                <li><strong>Object:</strong> Object to certain processing of your personal information</li>
              </ul>
              <p className="text-text-secondary mt-3">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-text-secondary">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. As a professional services firm, we may be required to retain certain client information for statutory periods as mandated by tax laws, company laws, and professional regulations.
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Third-Party Links</h2>
              <p className="text-text-secondary">
                Our website may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-text-secondary">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-text-secondary">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date. Your continued use of our website or services after such changes constitutes your acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-bg-secondary p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-text-secondary mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>

              <div className="space-y-2 text-text-secondary">
                <p><strong>Himanshu Majithiya & Co.</strong></p>
                <p><strong>Chartered Accountants</strong></p>
                <p className="mt-3">
                  <strong>Address:</strong><br />
                  {SITE_INFO.address.line1}<br />
                  {SITE_INFO.address.line2}<br />
                  {SITE_INFO.address.city}, {SITE_INFO.address.state} {SITE_INFO.address.pincode}
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

            {/* Professional Commitment */}
            <div className="mt-8 p-6 bg-primary/5 border-l-4 border-primary rounded">
              <p className="text-text-secondary">
                <strong>Professional Commitment:</strong> As chartered accountants registered with ICAI, we adhere to strict professional standards of confidentiality and data protection. Your trust is paramount, and we are committed to maintaining the highest standards of privacy and security in handling your information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
