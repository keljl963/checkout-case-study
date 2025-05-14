"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { Menu, Send, Plus, MessageSquare, Trash2, ChevronLeft } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { generateText } from "ai"
import { deepseek } from "@ai-sdk/deepseek"
import { logger, generateRequestId } from "@/app/lib/logger"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initialize or load chat sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions")
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions) as ChatSession[]
        // Convert string dates back to Date objects
        parsedSessions.forEach((session) => {
          session.createdAt = new Date(session.createdAt)
          session.updatedAt = new Date(session.updatedAt)
          session.messages.forEach((msg) => {
            msg.timestamp = new Date(msg.timestamp)
          })
        })
        setChatSessions(parsedSessions)

        // Set the most recent session as current if available
        if (parsedSessions.length > 0) {
          setCurrentSession(parsedSessions[0])
        } else {
          createNewSession()
        }
      } catch (error) {
        console.error("Error parsing saved chat sessions:", error)
        createNewSession()
      }
    } else {
      createNewSession()
    }
  }, [])

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions))
    }
  }, [chatSessions])

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateRequestId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setChatSessions((prev) => [newSession, ...prev])
    setCurrentSession(newSession)
    setIsMobileSidebarOpen(false)
  }

  const updateSessionTitle = (sessionId: string, messages: Message[]) => {
    if (messages.length === 0) return

    // Use the first user message as the title, truncated to 30 chars
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (firstUserMessage) {
      const title =
        firstUserMessage.content.length > 30
          ? firstUserMessage.content.substring(0, 30) + "..."
          : firstUserMessage.content

      setChatSessions((prev) => prev.map((session) => (session.id === sessionId ? { ...session, title } : session)))
    }
  }

  const deleteSession = (sessionId: string) => {
    setChatSessions((prev) => prev.filter((session) => session.id !== sessionId))

    // If the deleted session was the current one, set the first available session as current
    // or create a new one if no sessions remain
    if (currentSession?.id === sessionId) {
      const remainingSessions = chatSessions.filter((session) => session.id !== sessionId)
      if (remainingSessions.length > 0) {
        setCurrentSession(remainingSessions[0])
      } else {
        createNewSession()
      }
    }
  }

  const selectSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
      setIsMobileSidebarOpen(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !currentSession) return

    // Add user message
    const userMessage: Message = {
      id: generateRequestId(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    // Update current session with the new message
    const updatedMessages = [...currentSession.messages, userMessage]
    const updatedSession = {
      ...currentSession,
      messages: updatedMessages,
      updatedAt: new Date(),
    }

    setCurrentSession(updatedSession)
    setChatSessions((prev) => prev.map((session) => (session.id === currentSession.id ? updatedSession : session)))

    // Update the session title if this is the first message
    if (currentSession.messages.length === 0) {
      updateSessionTitle(currentSession.id, updatedMessages)
    }

    // Clear input
    setInput("")
    setIsLoading(true)

    try {
      // Generate AI response using DeepSeek
      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        prompt: input,
        messages: currentSession.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      })

      // Add assistant message
      const assistantMessage: Message = {
        id: generateRequestId(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }

      // Update current session with the assistant message
      const finalMessages = [...updatedMessages, assistantMessage]
      const finalSession = {
        ...updatedSession,
        messages: finalMessages,
        updatedAt: new Date(),
      }

      setCurrentSession(finalSession)
      setChatSessions((prev) => prev.map((session) => (session.id === currentSession.id ? finalSession : session)))

      // Log successful interaction
      logger.info("Chat message exchange completed", {
        requestId: currentSession.id,
        source: "handleSubmit",
      })
    } catch (error) {
      logger.error("Error generating AI response", {
        error,
        requestId: currentSession.id,
        source: "handleSubmit",
      })

      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-80 lg:w-96 border-r flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-medium">Chat History</h2>
          <Button variant="outline" size="icon" onClick={createNewSession}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-md cursor-pointer flex justify-between items-center group ${
                  currentSession?.id === session.id ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onClick={() => selectSession(session.id)}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <MessageSquare className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div className="overflow-hidden">
                    <p className="truncate">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(session.updatedAt)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center">
            {/* Mobile sidebar trigger */}
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-medium">Chat History</h2>
                  <Button variant="outline" size="icon" onClick={createNewSession}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-65px)]">
                  <div className="p-2 space-y-2">
                    {chatSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-md cursor-pointer flex justify-between items-center group ${
                          currentSession?.id === session.id ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                        onClick={() => selectSession(session.id)}
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <MessageSquare className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <div className="overflow-hidden">
                            <p className="truncate">{session.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(session.updatedAt)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(session.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Link href="/" className="text-xl font-medium ml-2 md:ml-0">
              1Prompt
            </Link>

            <div className="hidden md:flex ml-6 space-x-4">
              <Link href="/refine">
                <Button variant="ghost">Refine</Button>
              </Link>
              <Link href="/tips">
                <Button variant="ghost">Tips</Button>
              </Link>
              <Link href="/pay">
                <Button variant="ghost">Subscribe</Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-auto p-4">
          {currentSession && currentSession.messages.length > 0 ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {currentSession.messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8">
                      {message.role === "assistant" ? (
                        <>
                          <AvatarImage src="/deepseek-icon.svg" alt="DeepSeek" />
                          <AvatarFallback>DS</AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback>U</AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="max-w-md text-center space-y-4">
                <h2 className="text-2xl font-bold">Welcome to 1Prompt Chat</h2>
                <p className="text-muted-foreground">
                  Start a conversation with our AI assistant powered by DeepSeek. You can ask questions, get creative
                  content, or solve problems.
                </p>
                <div className="flex justify-center">
                  <Link href="/refine">
                    <Button variant="outline" className="flex items-center gap-2">
                      <ChevronLeft className="h-4 w-4" />
                      Go to Prompt Refiner
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
