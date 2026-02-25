import { Metadata } from "next"
import { Shield, Camera, Bell, FileText, Lock, Smartphone, Trash2, Mail } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "HMC Club App - Privacy Policy",
  description: "Privacy Policy for the HMC Club mobile application by Himanshu Majithiya & Co., Chartered Accountants.",
}

export default function AppPrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              HMC Club App - Privacy Policy
            </h1>
            <p className="text-xl text-white/90">
              Privacy Policy for the HMC Club Mobile Application
            </p>
            <p className="text-sm text-white/80 mt-4">
              Last Updated: February 25, 2026
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
                This Privacy Policy describes how <strong>Himanshu Majithiya & Co.</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your personal information when you use our <strong>HMC Club</strong> mobile application (the &quot;App&quot;). By downloading, installing, or using the App, you agree to this Privacy Policy.
              </p>
            </div>

            {/* App Overview */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">1. About the App</h2>
              </div>
              <p className="text-text-secondary mb-3">
                HMC Club is a client portal application that allows registered clients of Himanshu Majithiya & Co. to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>View and manage their documents securely</li>
                <li>Book appointments with our firm</li>
                <li>Receive push notifications for important updates</li>
                <li>Upload documents by taking photos using the device camera</li>
                <li>Access their profile and account information</li>
              </ul>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">2. Information We Collect</h2>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Account Information</h3>
              <p className="text-text-secondary mb-3">
                When you register or log in, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Password (stored securely as a hash, never in plain text)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Documents & Files</h3>
              <p className="text-text-secondary mb-3">
                When you upload documents or take photos within the App, we collect and store:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Document files (PDFs, images, etc.) that you upload</li>
                <li>Photos taken using the in-app camera for document upload purposes</li>
                <li>Document metadata (file name, type, upload date)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Device Information</h3>
              <p className="text-text-secondary mb-3">
                We may collect limited device information for the purpose of delivering push notifications:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Push notification token (Expo Push Token)</li>
                <li>Device platform (Android/iOS)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.4 Appointment Data</h3>
              <p className="text-text-secondary">
                When you book appointments, we collect the selected date, time slot, and any notes you provide.
              </p>
            </div>

            {/* Permissions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">3. App Permissions</h2>
              </div>

              <p className="text-text-secondary mb-4">
                The App requests the following device permissions:
              </p>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Camera Permission
                  </h3>
                  <p className="text-blue-700 mb-2">
                    <strong>Purpose:</strong> To allow you to take photos of documents directly within the App for uploading to your secure document folder.
                  </p>
                  <p className="text-blue-700">
                    <strong>Usage:</strong> Camera is only activated when you explicitly choose to take a photo for document upload. We do not access the camera in the background or for any other purpose. No photos are taken without your direct action.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Storage Permission (READ/WRITE_EXTERNAL_STORAGE)
                  </h3>
                  <p className="text-green-700 mb-2">
                    <strong>Purpose:</strong> To allow you to select and upload existing documents from your device, and to download/view documents shared by our firm.
                  </p>
                  <p className="text-green-700">
                    <strong>Usage:</strong> Storage access is only used when you choose to upload or download a document. We do not scan, read, or access any files beyond those you explicitly select.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Push Notifications
                  </h3>
                  <p className="text-purple-700 mb-2">
                    <strong>Purpose:</strong> To send you important updates about your documents, appointments, and account activity.
                  </p>
                  <p className="text-purple-700">
                    <strong>Usage:</strong> You can opt out of push notifications at any time through your device settings. We only send notifications relevant to your account and services.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. How We Use Your Information</h2>
              <p className="text-text-secondary mb-3">
                We use the collected information solely for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li><strong>Account Management:</strong> To authenticate your identity and provide access to your client portal</li>
                <li><strong>Document Management:</strong> To securely store, organize, and share documents between you and our firm</li>
                <li><strong>Appointment Booking:</strong> To schedule and manage appointments with our team</li>
                <li><strong>Notifications:</strong> To send you relevant updates about documents, appointments, and account activity</li>
                <li><strong>Service Delivery:</strong> To provide chartered accountancy services as agreed</li>
              </ul>
            </div>

            {/* Data Storage & Security */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">5. Data Storage & Security</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>All data is transmitted over secure HTTPS connections</li>
                <li>Passwords are hashed using industry-standard algorithms (bcrypt)</li>
                <li>Authentication tokens (JWT) are used for secure session management</li>
                <li>Documents are stored on secure servers with access controls</li>
                <li>We use refresh token rotation to prevent unauthorized access</li>
              </ul>
              <p className="text-text-secondary mt-3">
                Your data is hosted on secure servers in India. We implement appropriate technical and organizational measures to protect your information against unauthorized access, loss, or misuse.
              </p>
            </div>

            {/* Data Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Data Sharing</h2>
              <p className="text-text-secondary mb-3">
                We do <strong>not</strong> sell, trade, or share your personal information with third parties, except:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li><strong>Push Notification Service:</strong> We use Expo Push Notification service to deliver notifications. Only your device token is shared for this purpose.</li>
                <li><strong>Legal Requirements:</strong> If required by law, regulation, or legal proceedings</li>
                <li><strong>Professional Obligations:</strong> As chartered accountants, we may be required to share information with regulatory bodies (ICAI, tax authorities) as mandated by law</li>
              </ul>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-text-secondary">
                We retain your account data and documents for as long as your account is active and as required by professional and legal obligations. If you request account deletion, we will remove your personal data, except where retention is required by law (e.g., tax records that must be maintained for statutory periods).
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
              <p className="text-text-secondary mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li><strong>Access:</strong> View your personal data stored in the App</li>
                <li><strong>Correction:</strong> Update or correct your profile information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Withdraw Consent:</strong> Revoke camera, storage, or notification permissions at any time through your device settings</li>
                <li><strong>Data Export:</strong> Request a copy of your data</li>
              </ul>
              <p className="text-text-secondary mt-3">
                To exercise any of these rights, please contact us at the details provided below.
              </p>
            </div>

            {/* Account Deletion */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">9. Account Deletion</h2>
              </div>
              <p className="text-text-secondary mb-3">
                You can request deletion of your HMC Club account and all associated data by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Contacting us via email at <a href={`mailto:${SITE_INFO.email.primary}`} className="text-primary hover:underline">{SITE_INFO.email.primary}</a></li>
                <li>Calling us at <a href={`tel:${SITE_INFO.phone.primary}`} className="text-primary hover:underline">{SITE_INFO.phone.primary}</a></li>
              </ul>
              <p className="text-text-secondary mt-3">
                Upon receiving your request, we will delete your account and personal data within 30 days, except where retention is required by law.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-text-secondary">
                The HMC Club App is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
              </p>
            </div>

            {/* Changes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-text-secondary">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of the App after changes constitutes your acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-bg-secondary p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">12. Contact Us</h2>
              </div>
              <p className="text-text-secondary mb-4">
                If you have any questions about this Privacy Policy or how we handle your data in the HMC Club App, please contact us:
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
                <p className="mt-2">
                  <strong>Website:</strong>{" "}
                  <a href="https://www.himanshumajithiya.com" className="text-primary hover:underline">
                    www.himanshumajithiya.com
                  </a>
                </p>
              </div>
            </div>

            {/* App Details */}
            <div className="mt-8 p-6 bg-primary/5 border-l-4 border-primary rounded">
              <p className="text-text-secondary mb-2">
                <strong>App Details:</strong>
              </p>
              <ul className="text-text-secondary space-y-1 text-sm">
                <li><strong>App Name:</strong> HMC Club</li>
                <li><strong>Package Name:</strong> com.hmcclub.app</li>
                <li><strong>Developer:</strong> Himanshu Majithiya & Co., Chartered Accountants</li>
                <li><strong>Category:</strong> Business / Finance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
