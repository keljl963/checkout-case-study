import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/app/components/theme-toggle"

export default function TermsOfServicePage() {
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

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-sm sm:prose max-w-none">
          <p className="text-muted-foreground mb-4">Last Updated: April 15, 2025</p>

          <p>
            These Terms of Service ("Terms") govern your access to and use of the website, services, and applications
            (collectively, the "Services") provided by 1Prompt, Inc. ("1Prompt," "we," "our," or "us"). By accessing or
            using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not
            access or use the Services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Account Registration</h2>
          <p>
            To access certain features of our Services, you may need to create an account. When you create an account,
            you must provide accurate and complete information. You are responsible for maintaining the security of your
            account credentials and for all activities that occur under your account. You agree to notify us immediately
            of any unauthorized access to or use of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Conduct</h2>
          <p>When using our Services, you agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Violate any applicable law, regulation, or third-party rights</li>
            <li>Use the Services for any illegal, harmful, or unauthorized purpose</li>
            <li>
              Upload, transmit, or distribute any content that is unlawful, harmful, threatening, abusive, harassing,
              defamatory, vulgar, obscene, or otherwise objectionable
            </li>
            <li>
              Attempt to gain unauthorized access to any portion of the Services or any systems or networks connected to
              the Services
            </li>
            <li>
              Use any automated means, including bots, scrapers, or spiders, to access or use the Services, except as
              expressly permitted by 1Prompt
            </li>
            <li>Interfere with or disrupt the integrity or performance of the Services</li>
            <li>Attempt to circumvent any technological measure implemented by 1Prompt to protect the Services</li>
            <li>Encourage or enable any other individual to do any of the above</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Content</h2>
          <p>
            Our Services allow you to create, upload, store, and share content, including prompts, responses, and other
            materials (collectively, "User Content"). You retain ownership of your User Content, but you grant 1Prompt a
            worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create
            derivative works from, distribute, and display your User Content in connection with providing and improving
            our Services.
          </p>
          <p>
            You are solely responsible for your User Content and the consequences of posting or publishing it. By
            submitting User Content, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>You own or have the necessary rights to use and authorize 1Prompt to use your User Content</li>
            <li>
              Your User Content does not violate the privacy, publicity, intellectual property, or other rights of any
              third party
            </li>
            <li>
              Your User Content does not contain any material that is unlawful, harmful, threatening, abusive,
              harassing, defamatory, vulgar, obscene, or otherwise objectionable
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription and Payment</h2>
          <p>
            Some features of our Services may require a subscription. By subscribing to our Services, you agree to pay
            the applicable fees as they become due. All fees are non-refundable unless otherwise specified or required
            by law.
          </p>
          <p>
            We may change our fees at any time. If we change our fees, we will provide notice of the change on our
            website or by email. Your continued use of the subscription-based Services after the fee change becomes
            effective constitutes your agreement to pay the updated fees.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The Services and all content, features, and functionality thereof, including but not limited to text,
            graphics, logos, icons, images, audio clips, digital downloads, data compilations, software, and the
            compilation thereof, are owned by 1Prompt, our licensors, or other providers and are protected by copyright,
            trademark, and other intellectual property laws.
          </p>
          <p>
            These Terms do not grant you any right, title, or interest in the Services or any content, features, or
            functionality thereof, other than the limited right to use the Services as set forth in these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclaimer of Warranties</h2>
          <p>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, TITLE, AND NON-INFRINGEMENT. 1PROMPT DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR
            ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE
            FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, 1PROMPT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS,
            DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR
            USE THE SERVICES; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES; (III) ANY CONTENT OBTAINED
            FROM THE SERVICES; AND (IV) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT,
            WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT
            WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless 1Prompt and its officers, directors, employees, agents,
            and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees
            (including reasonable attorneys' fees) arising from or relating to (i) your use of the Services; (ii) your
            User Content; (iii) your violation of these Terms; or (iv) your violation of any rights of another.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Termination</h2>
          <p>
            We may terminate or suspend your access to the Services immediately, without prior notice or liability, for
            any reason, including, without limitation, if you breach these Terms. Upon termination, your right to use
            the Services will immediately cease.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
          <p>
            We may revise these Terms from time to time. The most current version will always be posted on our website.
            If a revision, in our sole discretion, is material, we will notify you via email or through the Services. By
            continuing to access or use the Services after revisions become effective, you agree to be bound by the
            revised Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California,
            without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or
            your use of the Services shall be subject to the exclusive jurisdiction of the state and federal courts
            located in San Francisco County, California.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mb-8">Email: legal@1prompt.com</p>
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
