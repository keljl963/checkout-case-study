"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "./components/theme-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">1Prompt</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/tips">
              <Button variant="ghost">Tips</Button>
            </Link>
            <Link href="/pay">
              <Button variant="ghost">Subscribe</Button>
            </Link>
            <Link href="#faq">
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
                  <Link href="#faq">
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Enhance Your AI Interactions</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-muted-foreground">
            Refine your prompts and chat with AI to get better results. Unlock the full potential of AI with 1Prompt.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/refine">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link
              href="#learn-more"
              scroll={false}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("learn-more")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="learn-more" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Tool</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/refine" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Refine</CardTitle>
                  <CardDescription>Optimize your prompts for better results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <p>Transform your ideas into well-structured prompts that get better responses from AI models.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Refining</Button>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/chat" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Chat</CardTitle>
                  <CardDescription>Interact with AI using optimized prompts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <p>Chat with AI using your refined prompts to get more accurate and helpful responses.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Chatting</Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section id="subscribe" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Subscription Plans</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Basic access to prompt refinement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Unlimited refinements per day
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-red-500"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Limited chat functionality
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-red-500"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    No prompt history
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-red-500"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    No support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            <Card className="h-full border-primary">
              <CardHeader className="bg-primary/10">
                <div className="py-1 px-3 rounded-full bg-primary text-primary-foreground text-xs font-medium w-fit mb-2">
                  Popular
                </div>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Enhanced features for regular users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Unlimited prompt refinements
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    1,000 chat messages per month
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    90-day prompt history
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-red-500"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Standard support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/pay?plan=pro" className="w-full">
                  <Button className="w-full">Upgrade to Pro</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Ultra</CardTitle>
                <CardDescription>Premium features for power users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$99.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Unlimited everything
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Advanced models supported
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    All upcoming new features
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/pay?plan=ultra" className="w-full">
                  <Button variant="outline" className="w-full">
                    Upgrade to Ultra
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is 1Prompt?</AccordionTrigger>
                <AccordionContent>
                  1Prompt is a platform designed to help you refine your prompts for AI interactions and chat with AI
                  using optimized prompts. Our goal is to help you get better results from AI models by improving the
                  way you communicate with them.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does the prompt refinement work?</AccordionTrigger>
                <AccordionContent>
                  Our prompt refinement tool analyzes your initial prompt and suggests improvements based on best
                  practices for AI interactions. It helps structure your prompt, add necessary context, and clarify your
                  instructions to get better responses from AI models.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Which AI models do you support?</AccordionTrigger>
                <AccordionContent>
                  We currently support interactions with several popular AI models including DeepSeek, ChatGPT, Claude,
                  and others. Our platform is designed to be model-agnostic, so the refined prompts should work well
                  with most text-based AI models.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take data security seriously. We do not store the content of your prompts or conversations
                  longer than necessary to provide our services. All data is encrypted in transit and at rest. For Pro
                  and Enterprise users, we only store prompt history for the specified retention period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I use 1Prompt for commercial purposes?</AccordionTrigger>
                <AccordionContent>
                  Yes, all subscription plans allow for commercial use. The Enterprise plan offers additional features
                  specifically designed for team collaboration and business use cases.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  You can start using 1Prompt immediately with our free plan. Simply click on the "Get Started" button,
                  and you'll be directed to our prompt refinement tool. No credit card is required for the free plan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
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
