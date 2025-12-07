import { Metadata } from "next"
import { Cookie, Settings, Eye, Shield } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Cookie Policy | Himanshu Majithiya & Co.",
  description: "Learn about how we use cookies and similar technologies on our website to improve your browsing experience.",
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Cookie className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-white/90">
              How we use cookies to improve your experience
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
                This Cookie Policy explains how <strong>Himanshu Majithiya & Co.</strong> uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
              </p>
            </div>

            {/* What Are Cookies */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">1. What Are Cookies?</h2>
              </div>
              <p className="text-text-secondary mb-3">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
              </p>
              <p className="text-text-secondary mb-3">
                Cookies typically contain:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>A unique identifier</li>
                <li>The website domain name</li>
                <li>Information about your preferences or actions</li>
                <li>An expiration date</li>
              </ul>
            </div>

            {/* Types of Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Essential Cookies</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                <p className="text-blue-800 font-semibold mb-2">Required for Website Functionality</p>
                <p className="text-blue-700 text-sm">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
              </div>
              <p className="text-text-secondary mb-3">
                <strong>Purpose:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Enable core website functionality</li>
                <li>Remember your cookie consent preferences</li>
                <li>Maintain security and prevent fraud</li>
                <li>Support essential features like forms and navigation</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Functional Cookies</h3>
              <p className="text-text-secondary mb-3">
                These cookies enhance your website experience by remembering your preferences and choices.
              </p>
              <p className="text-text-secondary mb-3">
                <strong>Purpose:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Remember your language preference</li>
                <li>Store your form inputs temporarily</li>
                <li>Maintain your session across pages</li>
                <li>Remember accessibility settings</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Analytics Cookies</h3>
              <p className="text-text-secondary mb-3">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <p className="text-text-secondary mb-3">
                <strong>Purpose:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Track number of visitors and page views</li>
                <li>Understand which pages are most popular</li>
                <li>Identify how users navigate the website</li>
                <li>Measure website performance and loading times</li>
                <li>Analyze traffic sources and user demographics</li>
              </ul>
              <p className="text-text-secondary mt-3">
                <strong>Third-Party Analytics:</strong> We may use services like Google Analytics, which use cookies to collect information about your use of our website.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.4 Marketing Cookies</h3>
              <p className="text-text-secondary mb-3">
                These cookies track your browsing activity to deliver relevant advertisements and measure campaign effectiveness.
              </p>
              <p className="text-text-secondary mb-3">
                <strong>Purpose:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Show relevant advertisements based on your interests</li>
                <li>Limit the number of times you see an ad</li>
                <li>Measure advertising campaign effectiveness</li>
                <li>Track conversions and user engagement</li>
              </ul>
            </div>

            {/* How We Use Cookies */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">3. How We Use Cookies</h2>
              </div>
              <p className="text-text-secondary mb-3">
                We use cookies for the following purposes:
              </p>

              <div className="space-y-4">
                <div className="bg-bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Improve User Experience</h4>
                  <p className="text-sm text-text-secondary">
                    Remember your preferences, language settings, and form inputs to provide a personalized experience.
                  </p>
                </div>

                <div className="bg-bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📊 Website Analytics</h4>
                  <p className="text-sm text-text-secondary">
                    Understand how visitors use our website, which pages are popular, and identify areas for improvement.
                  </p>
                </div>

                <div className="bg-bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🔒 Security</h4>
                  <p className="text-sm text-text-secondary">
                    Protect against fraudulent activity, ensure secure form submissions, and maintain session integrity.
                  </p>
                </div>

                <div className="bg-bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📧 Email Campaigns</h4>
                  <p className="text-sm text-text-secondary">
                    Track email open rates, link clicks, and campaign effectiveness (if you've subscribed to our newsletter).
                  </p>
                </div>

                <div className="bg-bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📅 Appointment Scheduling</h4>
                  <p className="text-sm text-text-secondary">
                    Enable appointment booking functionality through integrated services like Calendly.
                  </p>
                </div>
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
              <p className="text-text-secondary mb-3">
                Some cookies on our website are placed by third-party services we use. These may include:
              </p>

              <div className="space-y-3">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-1">Calendly</h4>
                  <p className="text-sm text-text-secondary">
                    Used for appointment scheduling and calendar management.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-1">Email Service (Resend)</h4>
                  <p className="text-sm text-text-secondary">
                    Used for contact form submissions and email communications.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-1">Google Analytics (if applicable)</h4>
                  <p className="text-sm text-text-secondary">
                    Used to analyze website traffic and user behavior.
                  </p>
                </div>
              </div>

              <p className="text-text-secondary mt-4">
                These third parties may have their own privacy and cookie policies. We recommend reviewing their policies for more information.
              </p>
            </div>

            {/* Managing Cookies */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">5. How to Manage Cookies</h2>
              </div>

              <h3 className="text-lg font-semibold mb-3">5.1 Cookie Consent Banner</h3>
              <p className="text-text-secondary mb-3">
                When you first visit our website, you'll see a cookie consent banner. You can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li><strong>Accept Cookies:</strong> Allow all cookies to be used</li>
                <li><strong>Decline Cookies:</strong> Only essential cookies will be used</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">5.2 Browser Settings</h3>
              <p className="text-text-secondary mb-3">
                You can control and delete cookies through your browser settings. Here's how:
              </p>

              <div className="space-y-3 ml-4">
                <div>
                  <p className="font-semibold text-text-primary">Google Chrome:</p>
                  <p className="text-sm text-text-secondary">Settings → Privacy and security → Cookies and other site data</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Mozilla Firefox:</p>
                  <p className="text-sm text-text-secondary">Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Safari:</p>
                  <p className="text-sm text-text-secondary">Preferences → Privacy → Manage Website Data</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Microsoft Edge:</p>
                  <p className="text-sm text-text-secondary">Settings → Privacy, search, and services → Cookies and site permissions</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
                <p className="text-yellow-800 font-semibold mb-2">⚠️ Important Note</p>
                <p className="text-yellow-700 text-sm">
                  Blocking or deleting cookies may limit website functionality. Some features may not work properly if cookies are disabled.
                </p>
              </div>
            </div>

            {/* Cookie Duration */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Cookie Duration</h2>
              <p className="text-text-secondary mb-3">
                Cookies can be classified by how long they remain active:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Session Cookies</h4>
                  <p className="text-sm text-text-secondary mb-2">
                    Temporary cookies that expire when you close your browser.
                  </p>
                  <p className="text-xs text-text-muted italic">
                    Example: Shopping cart contents, login sessions
                  </p>
                </div>

                <div className="bg-bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                  <p className="text-sm text-text-secondary mb-2">
                    Remain on your device for a set period or until you delete them.
                  </p>
                  <p className="text-xs text-text-muted italic">
                    Example: Language preferences, cookie consent choices
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">7. Your Rights</h2>
              </div>
              <p className="text-text-secondary mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                <li>Know what cookies are being used on our website</li>
                <li>Accept or decline non-essential cookies</li>
                <li>Delete cookies from your device at any time</li>
                <li>Change your cookie preferences</li>
                <li>Opt-out of third-party analytics and marketing cookies</li>
              </ul>
            </div>

            {/* Updates to Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Updates to This Policy</h2>
              <p className="text-text-secondary">
                We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. The "Last Updated" date at the top indicates when the policy was last revised. Please review this page periodically for updates.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-bg-secondary p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">9. Questions About Cookies?</h2>
              <p className="text-text-secondary mb-4">
                If you have questions about our use of cookies, please contact us:
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

            {/* More Information */}
            <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-blue-800 font-semibold mb-2">📚 Learn More About Cookies</p>
              <p className="text-blue-700 text-sm mb-2">
                For general information about cookies and how they work, visit:
              </p>
              <ul className="text-sm text-blue-700 ml-4">
                <li>• <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="underline">AllAboutCookies.org</a></li>
                <li>• <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="underline">YourOnlineChoices.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
