import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { Menu, ArrowLeft } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function TipsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold">1Prompt</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/tips">
              <Button variant="ghost">Tips</Button>
            </Link>
            <Link href="/pay">
              <Button variant="ghost">Subscribe</Button>
            </Link>
            <Link href="/#faq">
              <Button variant="ghost">FAQ</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/tips">
                    <Button variant="ghost" className="w-full justify-start">
                      Tips
                    </Button>
                  </Link>
                  <Link href="/pay">
                    <Button variant="ghost" className="w-full justify-start">
                      Subscribe
                    </Button>
                  </Link>
                  <Link href="/#faq">
                    <Button variant="ghost" className="w-full justify-start">
                      FAQ
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Prompt Engineering Tips</h1>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Be Specific and Clear</CardTitle>
                <CardDescription>Clarity is key to getting the results you want</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The more specific your prompt, the better the AI can understand what you're looking for. Vague prompts
                  lead to vague responses.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-destructive/10 p-4 rounded-md">
                    <p className="font-medium text-destructive mb-2">❌ Weak Prompt:</p>
                    <p className="text-sm">"Tell me about cars."</p>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-md">
                    <p className="font-medium text-green-500 mb-2">✅ Strong Prompt:</p>
                    <p className="text-sm">
                      "Explain the key differences between electric and hybrid cars, focusing on environmental impact,
                      cost of ownership, and performance."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provide Context</CardTitle>
                <CardDescription>Help the AI understand your background and needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Providing context about who you are, what you're trying to accomplish, and your level of familiarity
                  with the topic helps the AI tailor its response to your needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-destructive/10 p-4 rounded-md">
                    <p className="font-medium text-destructive mb-2">❌ Weak Prompt:</p>
                    <p className="text-sm">"How do I code a website?"</p>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-md">
                    <p className="font-medium text-green-500 mb-2">✅ Strong Prompt:</p>
                    <p className="text-sm">
                      "I'm a marketing professional with no coding experience. I need to create a simple portfolio
                      website to showcase my work. What are the easiest tools or platforms I could use, and what basic
                      steps should I follow?"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use the RICCE Framework</CardTitle>
                <CardDescription>A structured approach to crafting effective prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The RICCE framework helps you create comprehensive prompts that get better results:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Role:</strong> Specify who the AI should act as (e.g., "As a financial advisor...")
                  </li>
                  <li>
                    <strong>Instruction:</strong> Clearly state what you want the AI to do
                  </li>
                  <li>
                    <strong>Context:</strong> Provide relevant background information
                  </li>
                  <li>
                    <strong>Criteria:</strong> Define what makes a good response
                  </li>
                  <li>
                    <strong>Example:</strong> Show an example of what you're looking for (optional)
                  </li>
                </ul>
                <div className="bg-green-500/10 p-4 rounded-md mt-4">
                  <p className="font-medium text-green-500 mb-2">✅ RICCE Example:</p>
                  <p className="text-sm">
                    "<strong>Role:</strong> As a social media marketing expert
                    <br />
                    <strong>Instruction:</strong> Create a content calendar for a new coffee shop
                    <br />
                    <strong>Context:</strong> The shop is opening next month in a college town, targeting students and
                    young professionals
                    <br />
                    <strong>Criteria:</strong> Include 3 posts per week across Instagram and TikTok, with a mix of
                    promotional content and coffee education
                    <br />
                    <strong>Example:</strong> Similar to how Blue Bottle Coffee structures their social media presence"
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Iterate and Refine</CardTitle>
                <CardDescription>Treat prompting as a conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Don't expect perfect results from your first prompt. Use the AI's response to refine your next prompt,
                  gradually steering toward the outcome you want.
                </p>
                <p className="mb-4">If the response isn't what you expected, try:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Asking the AI to expand on specific parts</li>
                  <li>Requesting a different approach or perspective</li>
                  <li>Providing feedback on what was helpful and what wasn't</li>
                  <li>Adding constraints or additional criteria</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use Our Prompt Refiner</CardTitle>
                <CardDescription>Let our tool help you craft the perfect prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our Prompt Refiner tool can help you transform your rough ideas into well-structured prompts that get
                  better results from AI models.
                </p>
                <div className="flex justify-center mt-4">
                  <Link href="/refine">
                    <Button size="lg">Try the Prompt Refiner</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t mt-auto">
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
