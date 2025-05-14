"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Check, CreditCard, Lock } from "lucide-react"

// Define plan types and details
const plans = {
  pro: {
    name: "Pro",
    price: 9.99,
    description: "Enhanced features for regular users",
    features: [
      "Unlimited prompt refinements",
      "1,000 chat messages per month",
      "90-day prompt history",
      "Standard support",
    ],
    billingCycle: "monthly",
  },
  ultra: {
    name: "Ultra",
    price: 99.99,
    description: "Premium features for power users",
    features: ["Unlimited everything", "Advanced models supported", "Dedicated support", "All upcoming new features"],
    billingCycle: "monthly",
  },
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const initialPlan = searchParams.get("plan") || "pro"

  const [selectedPlan, setSelectedPlan] = useState(initialPlan as "pro" | "ultra")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [nameOnCard, setNameOnCard] = useState("")
  const [email, setEmail] = useState("")

  // Calculate price based on plan and billing cycle
  const calculatePrice = () => {
    const basePrice = plans[selectedPlan].price
    return billingCycle === "yearly" ? basePrice * 10 : basePrice
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format card expiry date
  const formatCardExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert("Payment successful! You are now subscribed to the " + plans[selectedPlan].name + " plan.")
      window.location.href = "/"
    }, 2000)
  }

  // Update URL when plan changes
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("plan", selectedPlan)
    window.history.replaceState({}, "", url.toString())
  }, [selectedPlan])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold">1Prompt</h1>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Left column - Payment form */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Payment details</CardTitle>
                  <CardDescription>Enter your card information to complete your subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card number</Label>
                        <div className="relative">
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                          />
                          <CreditCard
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                            maxLength={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Name on card</Label>
                        <Input
                          id="name"
                          placeholder="J. Smith"
                          required
                          value={nameOnCard}
                          onChange={(e) => setNameOnCard(e.target.value)}
                        />
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={isProcessing}>
                          {isProcessing ? "Processing..." : `Pay $${calculatePrice().toFixed(2)}`}
                        </Button>
                      </div>

                      <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                        <Lock size={14} className="mr-1" />
                        <span>Payments are secure and encrypted</span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Order summary */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Plan selection */}
                    <div>
                      <Label className="mb-2 block">Select plan</Label>
                      <RadioGroup
                        value={selectedPlan}
                        onValueChange={(value) => setSelectedPlan(value as "pro" | "ultra")}
                        className="space-y-2"
                      >
                        <div
                          className={`flex items-center justify-between rounded-lg border p-4 ${selectedPlan === "pro" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pro" id="pro" />
                            <Label htmlFor="pro" className="font-medium cursor-pointer">
                              Pro
                            </Label>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">${billingCycle === "yearly" ? "99.90" : "9.99"}</span>
                            <span className="text-muted-foreground text-sm">
                              /{billingCycle === "yearly" ? "year" : "month"}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center justify-between rounded-lg border p-4 ${selectedPlan === "ultra" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ultra" id="ultra" />
                            <Label htmlFor="ultra" className="font-medium cursor-pointer">
                              Ultra
                            </Label>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">${billingCycle === "yearly" ? "999.90" : "99.99"}</span>
                            <span className="text-muted-foreground text-sm">
                              /{billingCycle === "yearly" ? "year" : "month"}
                            </span>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Billing cycle */}
                    <div>
                      <Label className="mb-2 block">Billing cycle</Label>
                      <RadioGroup
                        value={billingCycle}
                        onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
                        className="space-y-2"
                      >
                        <div
                          className={`flex items-center justify-between rounded-lg border p-4 ${billingCycle === "monthly" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly" className="font-medium cursor-pointer">
                              Monthly
                            </Label>
                          </div>
                        </div>
                        <div
                          className={`flex items-center justify-between rounded-lg border p-4 ${billingCycle === "yearly" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yearly" id="yearly" />
                            <Label htmlFor="yearly" className="font-medium cursor-pointer">
                              Yearly (Save 16%)
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Plan features */}
                    <div className="space-y-2">
                      <h3 className="font-medium">What's included:</h3>
                      <ul className="space-y-1">
                        {plans[selectedPlan].features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check size={16} className="mr-2 mt-1 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* Order total */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${calculatePrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${calculatePrice().toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {billingCycle === "monthly"
                          ? "You will be charged monthly until you cancel your subscription."
                          : "You will be charged annually until you cancel your subscription."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
