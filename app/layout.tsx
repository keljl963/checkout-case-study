import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Prompt Refiner - Optimize Your AI Prompts",
  description: "Transform rough ideas into optimized prompts for AI chatbots through a guided refinement process.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="prompt-refiner-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
