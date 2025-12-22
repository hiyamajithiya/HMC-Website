import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Calendar } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_INFO.name}, a Chartered Accountant firm established in ${SITE_INFO.yearEstablished} in Ahmedabad, providing professional accounting and auditing services.`,
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            About the Firm
          </h1>
          <p className="text-xl text-white/90">
            {SITE_INFO.name}
          </p>
        </div>
      </section>

      {/* Professional Profile Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/10">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-heading font-bold text-primary mb-2">
                    {SITE_INFO.proprietor}
                  </h2>
                  <p className="text-lg text-text-secondary mb-4">
                    Proprietor, {SITE_INFO.name}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>Chartered Accountant</p>
                    <p>Ahmedabad, Gujarat</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {SITE_INFO.name} is a proprietorship firm of Chartered Accountants
                    established in {SITE_INFO.yearEstablished}, located in Ahmedabad, Gujarat.
                    The firm is registered with the Institute of Chartered Accountants of India (ICAI).
                  </p>

                  <h3 className="text-xl font-semibold text-primary mt-8 mb-4">
                    Areas of Practice
                  </h3>
                  <p className="text-text-secondary mb-4">
                    The firm provides professional services in the areas of:
                  </p>
                  <ul className="space-y-2 text-text-secondary">
                    <li>Income Tax advisory and compliance</li>
                    <li>Statutory and Internal Audit</li>
                    <li>FFMC Compliance as per RBI Guidelines</li>
                    <li>GST compliance and advisory</li>
                    <li>Company Law matters and ROC compliance</li>
                    <li>AI and Workflow Automation solutions</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-primary mt-8 mb-4">
                    Team Structure
                  </h3>
                  <p className="text-text-secondary mb-4">
                    The firm is equipped with a team comprising:
                  </p>
                  <ul className="space-y-2 text-text-secondary">
                    <li>{SITE_INFO.team.caInter} CA Inter qualified professional</li>
                    <li>{SITE_INFO.team.articledAssistants} Articled Assistants</li>
                    <li>{SITE_INFO.team.supportStaff} Support Staff</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Information Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Office Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Address</h3>
                      <p className="text-text-secondary">
                        {SITE_INFO.address.line1}<br />
                        {SITE_INFO.address.line2}<br />
                        {SITE_INFO.address.city}<br />
                        {SITE_INFO.address.state} - {SITE_INFO.address.pincode}<br />
                        {SITE_INFO.address.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Contact</h3>
                      <p className="text-text-secondary mb-2">
                        Phone: <a href={`tel:${SITE_INFO.phone.primary}`} className="text-primary hover:underline">{SITE_INFO.phone.primary}</a>
                      </p>
                      <p className="text-text-secondary">
                        Email: <a href={`mailto:${SITE_INFO.email.primary}`} className="text-primary hover:underline">{SITE_INFO.email.primary}</a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
                      <p className="text-text-secondary">
                        {SITE_INFO.officeHours}
                      </p>
                      <p className="text-text-muted text-sm mt-2">
                        Saturday & Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Social Media</h3>
                      <div className="space-y-2 text-text-secondary">
                        <p>
                          <a href={SITE_INFO.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            LinkedIn
                          </a>
                        </p>
                        <p>
                          <a href={SITE_INFO.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Facebook
                          </a>
                        </p>
                        <p>
                          <a href={SITE_INFO.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            YouTube
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Location
            </h2>
            <div className="rounded-lg overflow-hidden shadow-lg border-2 border-border-light">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.0869477824666!2d72.50884931496281!3d23.046858384941774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b4e5d5d5d5d%3A0x5d5d5d5d5d5d5d5d!2sMaple%20Trade%20Centre!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="300"
                className="w-full h-[300px] md:h-[450px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location - Maple Trade Centre, Thaltej, Ahmedabad"
              />
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://maps.google.com/?q=Maple+Trade+Centre+Thaltej+Ahmedabad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-light font-medium"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
