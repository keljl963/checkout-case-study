import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { Menu, User, LogIn } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">1Prompt</h1>
          </Link>

          <div className="hidden md:flex ml-6 space-x-4">
            <Link href="/refine">
              <Button variant="ghost">Refine</Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/tips">
              <Button variant="ghost">Tips</Button>
            </Link>
            <Link href="/pay">
              <Button variant="ghost">Subscribe</Button>
            </Link>
            <Link href="/#faq">
              <Button variant="ghost">FAQ</Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </Link>
          </div>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/refine">
                  <Button variant="ghost" className="w-full justify-start">
                    Refine
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" className="w-full justify-start">
                    Chat
                  </Button>
                </Link>
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
                <Link href="/privacy-policy">
                  <Button variant="ghost" className="w-full justify-start">
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/terms-of-service">
                  <Button variant="ghost" className="w-full justify-start">
                    Terms of Service
                  </Button>
                </Link>
                <div className="border-t my-2 pt-2">
                  <Link href="/login">
                    <Button variant="outline" className="w-full mb-2">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
