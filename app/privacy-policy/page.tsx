import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/app/components/theme-toggle"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold">1Prompt</h1>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-sm sm:prose max-w-none">
          <p className="text-muted-foreground mb-4">Last Updated: April 15, 2025</p>

          <p>
            This Privacy Policy describes how 1Prompt, Inc. ("1Prompt," "we," "our," or "us") collects, uses, and shares
            your personal information when you use our website (1prompt.com), services, and applications (collectively,
            the "Services").
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>

          <h3 className="text-xl font-medium mt-6 mb-3">Personal Information</h3>
          <p>We may collect the following types of personal information when you use our Services:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Account Information:</strong> When you create an account, we collect your name, email address, and
              password.
            </li>
            <li>
              <strong>Payment Information:</strong> If you subscribe to our premium services, we collect payment
              details, billing information, and transaction history.
            </li>
            <li>
              <strong>User Content:</strong> We collect the prompts, responses, and other content you create, upload, or
              store while using our Services.
            </li>
            <li>
              <strong>Communication Data:</strong> We collect information when you contact us for customer support or
              communicate with us in any way.
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">Usage Information</h3>
          <p>We automatically collect certain information about your interaction with our Services:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Device Information:</strong> We collect information about your device, including IP address,
              browser type, operating system, and device identifiers.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you use our Services, including pages
              visited, features used, actions taken, time spent, and referring websites.
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to
              collect information about your browsing activities.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Providing, maintaining, and improving our Services</li>
            <li>Processing transactions and managing your account</li>
            <li>Personalizing your experience and delivering relevant content</li>
            <li>Communicating with you about our Services, updates, and promotions</li>
            <li>Responding to your requests and providing customer support</li>
            <li>Analyzing usage patterns and trends to enhance our Services</li>
            <li>Protecting the security and integrity of our Services</li>
            <li>Complying with legal obligations and enforcing our terms</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Share Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Service Providers:</strong> We share information with third-party vendors and service providers
              who perform services on our behalf, such as payment processing, data analysis, email delivery, and
              hosting.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we're involved in a merger, acquisition, or sale of assets, your
              information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required by law, regulation, or
              legal process, or to protect the rights, property, or safety of 1Prompt, our users, or others.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information with third parties when you have given
              us your consent to do so.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Accessing, updating, or deleting your personal information</li>
            <li>Objecting to or restricting certain processing activities</li>
            <li>Requesting a copy of your personal information</li>
            <li>Withdrawing consent where processing is based on consent</li>
          </ul>
          <p>To exercise these rights, please contact us at privacy@1prompt.com.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from
            unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the
            internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our Services, comply with legal
            obligations, resolve disputes, and enforce our agreements. When we no longer need your personal information,
            we will securely delete or anonymize it.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Children's Privacy</h2>
          <p>
            Our Services are not directed to children under the age of 13, and we do not knowingly collect personal
            information from children under 13. If you believe we have collected information from a child under 13,
            please contact us so we can delete this information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other
            operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated
            Privacy Policy on our website and updating the "Last Updated" date.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices,
            please contact us at:
          </p>
          <p className="mb-8">Email: privacy@1prompt.com</p>
        </div>
      </main>

      <footer className="py-10 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold mb-2">1Prompt</h2>
            <p className="text-muted-foreground mb-6">Enhance your AI interactions</p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Link href="/refine" className="text-muted-foreground hover:text-foreground">
                Refine
              </Link>
              <Link href="/chat" className="text-muted-foreground hover:text-foreground">
                Chat
              </Link>
              <Link href="/tips" className="text-muted-foreground hover:text-foreground">
                Tips
              </Link>
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>

            <div className="text-center text-muted-foreground text-sm">
              <p>&copy; {new Date().getFullYear()} 1Prompt, Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
