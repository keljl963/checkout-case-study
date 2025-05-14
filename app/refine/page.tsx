"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  X,
  RefreshCw,
  Plus,
  ExternalLink,
  Mail,
  MessageSquare,
  Menu,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  generateQuestionsWithChoices,
  generateInitialPrompt,
  optimizePromptWithSuggestions,
  regenerateQuestionWithChoices,
  regeneratePrompt,
} from "@/app/actions"
import { PromptOptimizer, type Suggestion } from "@/app/components/prompt-optimizer"
import { ChatbotIcons } from "@/app/components/chatbot-icons"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { useTheme } from "next-themes"
import { logger, generateRequestId } from "@/app/lib/logger"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function PromptRefiner() {
  const { theme } = useTheme()
  const [step, setStep] = useState(1)
  const [initialPrompt, setInitialPrompt] = useState("")
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [isRegeneratingQuestion, setIsRegeneratingQuestion] = useState<number | null>(null)
  const [questions, setQuestions] = useState<string[]>([])
  const [questionChoices, setQuestionChoices] = useState<string[][]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedChoices, setSelectedChoices] = useState<number[]>([])
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [refinedPrompt, setRefinedPrompt] = useState("")
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isOptimizingPrompt, setIsOptimizingPrompt] = useState(false)
  const [isRegeneratingPrompt, setIsRegeneratingPrompt] = useState(false)
  const [additionalContext, setAdditionalContext] = useState("")
  const [copied, setCopied] = useState(false)
  const [stepsCompleted, setStepsCompleted] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
  })
  const [isNavigating, setIsNavigating] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const { toast } = useToast()

  // Initialize session ID
  useEffect(() => {
    const newSessionId = generateRequestId()
    setSessionId(newSessionId)

    logger.info("Prompt Refiner session started", {
      data: { theme },
      requestId: newSessionId,
      source: "PromptRefiner",
    })

    return () => {
      logger.info("Prompt Refiner session ended", {
        requestId: newSessionId,
        source: "PromptRefiner",
      })
    }
  }, [theme])

  // Function to check if a step can be accessed
  const canAccessStep = (targetStep: number) => {
    // Step 1 is always accessible
    if (targetStep === 1) return true

    // For other steps, check if previous steps are completed
    if (targetStep === 2) return stepsCompleted[1]
    if (targetStep === 3) return stepsCompleted[1] && stepsCompleted[2]
    if (targetStep === 4) return stepsCompleted[1] && stepsCompleted[2] && stepsCompleted[3]

    return false
  }

  const handleStepClick = async (targetStep: number) => {
    // If trying to access a step that's not yet accessible, show a toast
    if (!canAccessStep(targetStep)) {
      logger.warn("User attempted to access locked step", {
        data: {
          currentStep: step,
          targetStep,
          stepsCompleted,
        },
        requestId: sessionId,
        source: "handleStepClick",
      })

      toast({
        title: "Complete previous steps first",
        description: "Please complete the previous steps before proceeding.",
        variant: "destructive",
      })
      return
    }

    logger.info("User navigating between steps", {
      data: {
        currentStep: step,
        targetStep,
      },
      requestId: sessionId,
      source: "handleStepClick",
    })

    setIsNavigating(true)

    try {
      // If going to step 2 and step 1 is completed but questions aren't generated yet
      if (targetStep === 2 && stepsCompleted[1] && questions.length === 0) {
        logger.info("Generating questions before navigating to step 2", {
          requestId: sessionId,
          source: "handleStepClick",
        })
        await generateQuestionsForPrompt()
      }

      // If going to step 3 and step 2 is completed but initial prompt isn't generated yet
      if (targetStep === 3 && stepsCompleted[2] && !generatedPrompt) {
        logger.info("Generating initial prompt before navigating to step 3", {
          requestId: sessionId,
          source: "handleStepClick",
        })
        await generateInitialPromptFromAnswers()
      }

      setStep(targetStep)
    } catch (error) {
      logger.error("Error during step navigation", {
        error,
        data: {
          currentStep: step,
          targetStep,
        },
        requestId: sessionId,
        source: "handleStepClick",
      })
    } finally {
      setIsNavigating(false)
    }
  }

  const generateQuestionsForPrompt = async () => {
    setIsGeneratingQuestions(true)

    logger.info("Generating questions for prompt", {
      data: {
        promptLength: initialPrompt.length,
        promptPreview: initialPrompt.substring(0, 50) + "...",
      },
      requestId: sessionId,
      source: "generateQuestionsForPrompt",
    })

    try {
      const { generatedQuestions, generatedChoices } = await generateQuestionsWithChoices(initialPrompt)

      if (generatedQuestions.length === 0) {
        logger.error("No questions were generated", {
          requestId: sessionId,
          source: "generateQuestionsForPrompt",
        })
        throw new Error("No questions were generated")
      }

      logger.info("Questions generated successfully", {
        data: {
          questionCount: generatedQuestions.length,
          questions: generatedQuestions,
        },
        requestId: sessionId,
        source: "generateQuestionsForPrompt",
      })

      setQuestions(generatedQuestions)
      setQuestionChoices(generatedChoices)
      setAnswers(new Array(generatedQuestions.length).fill(""))
      setSelectedChoices(new Array(generatedQuestions.length).fill(-1))
      return true
    } catch (error) {
      logger.error("Error generating questions", {
        error,
        requestId: sessionId,
        source: "generateQuestionsForPrompt",
      })

      toast({
        title: "Error",
        description: "Failed to generate questions. The server might be experiencing high load. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const generateInitialPromptFromAnswers = async () => {
    setIsGeneratingPrompt(true)

    logger.info("Generating initial prompt from answers", {
      data: {
        promptLength: initialPrompt.length,
        questionCount: questions.length,
        answerCount: answers.length,
      },
      requestId: sessionId,
      source: "generateInitialPromptFromAnswers",
    })

    try {
      const prompt = await generateInitialPrompt(initialPrompt, questions, answers)

      if (!prompt || prompt.includes("Error generating")) {
        logger.error("Failed to generate a valid prompt", {
          data: { prompt },
          requestId: sessionId,
          source: "generateInitialPromptFromAnswers",
        })
        throw new Error("Failed to generate a valid prompt")
      }

      logger.info("Initial prompt generated successfully", {
        data: {
          promptLength: prompt.length,
          promptPreview: prompt.substring(0, 50) + "...",
        },
        requestId: sessionId,
        source: "generateInitialPromptFromAnswers",
      })

      setGeneratedPrompt(prompt)
      setRefinedPrompt(prompt)
      return true
    } catch (error) {
      logger.error("Error generating initial prompt", {
        error,
        requestId: sessionId,
        source: "generateInitialPromptFromAnswers",
      })

      toast({
        title: "Error",
        description: "Failed to generate initial prompt. The server might be experiencing high load. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const handleRegeneratePrompt = async () => {
    setIsRegeneratingPrompt(true)

    logger.info("Regenerating prompt", {
      data: {
        promptLength: initialPrompt.length,
        questionCount: questions.length,
        answerCount: answers.length,
      },
      requestId: sessionId,
      source: "handleRegeneratePrompt",
    })

    try {
      const prompt = await regeneratePrompt(initialPrompt, questions, answers)

      if (!prompt || prompt.includes("Error")) {
        logger.error("Failed to regenerate prompt", {
          data: { prompt },
          requestId: sessionId,
          source: "handleRegeneratePrompt",
        })
        throw new Error("Failed to regenerate prompt")
      }

      logger.info("Prompt regenerated successfully", {
        data: {
          promptLength: prompt.length,
          promptPreview: prompt.substring(0, 50) + "...",
        },
        requestId: sessionId,
        source: "handleRegeneratePrompt",
      })

      setGeneratedPrompt(prompt)
      setRefinedPrompt(prompt)

      toast({
        title: "Prompt regenerated",
        description: "A new prompt has been generated with a different approach.",
      })

      return true
    } catch (error) {
      logger.error("Error regenerating prompt", {
        error,
        requestId: sessionId,
        source: "handleRegeneratePrompt",
      })

      toast({
        title: "Error",
        description: "Failed to regenerate prompt. The server might be experiencing high load. Please try again.",
      })
      return false
    } finally {
      setIsRegeneratingPrompt(false)
    }
  }

  const handleNext = async () => {
    logger.info("User clicked next button", {
      data: { currentStep: step },
      requestId: sessionId,
      source: "handleNext",
    })

    setIsNavigating(true)

    try {
      if (step === 1) {
        if (!initialPrompt.trim()) {
          logger.warn("Empty prompt submission", {
            requestId: sessionId,
            source: "handleNext",
          })

          toast({
            title: "Empty prompt",
            description: "Please enter an initial prompt to continue.",
            variant: "destructive",
          })
          setIsNavigating(false)
          return
        }

        // Mark step 1 as completed
        logger.info("Step 1 completed", {
          data: {
            promptLength: initialPrompt.length,
            promptPreview: initialPrompt.substring(0, 50) + "...",
          },
          requestId: sessionId,
          source: "handleNext",
        })

        setStepsCompleted({ ...stepsCompleted, 1: true })

        try {
          setIsGeneratingQuestions(true)
          await generateQuestionsForPrompt()
          setStep(2)
        } catch (error) {
          logger.error("Error generating questions during next step", {
            error,
            requestId: sessionId,
            source: "handleNext",
          })

          toast({
            title: "Error",
            description: "Failed to generate questions. The server might be experiencing high load. Please try again.",
            variant: "destructive",
          })
          setIsGeneratingQuestions(false)
        }
      } else if (step === 2) {
        // Check if all questions have been answered
        const unansweredQuestions = answers.filter(
          (answer, index) =>
            !answer.trim() &&
            (selectedChoices[index] === -1 || selectedChoices[index] === questionChoices[index].length - 1),
        ).length

        if (unansweredQuestions > 0) {
          logger.warn("Incomplete answers", {
            data: {
              unansweredCount: unansweredQuestions,
              totalQuestions: questions.length,
            },
            requestId: sessionId,
            source: "handleNext",
          })

          toast({
            title: "Incomplete answers",
            description: `Please answer all ${unansweredQuestions} remaining questions to continue.`,
            variant: "destructive",
          })
          setIsNavigating(false)
          return
        }

        // Mark step 2 as completed
        logger.info("Step 2 completed", {
          data: {
            questionCount: questions.length,
            answerCount: answers.length,
          },
          requestId: sessionId,
          source: "handleNext",
        })

        setStepsCompleted({ ...stepsCompleted, 2: true })

        try {
          setIsGeneratingPrompt(true)
          // Generate initial prompt
          await generateInitialPromptFromAnswers()
          setStep(3)
        } catch (error) {
          logger.error("Error generating prompt during next step", {
            error,
            requestId: sessionId,
            source: "handleNext",
          })

          toast({
            title: "Error",
            description: "Failed to generate prompt. The server might be experiencing high load. Please try again.",
            variant: "destructive",
          })
          setIsGeneratingPrompt(false)
        }
      } else if (step === 3) {
        // Mark step 3 as completed
        logger.info("Step 3 completed", {
          data: {
            promptLength: refinedPrompt.length,
            promptPreview: refinedPrompt.substring(0, 50) + "...",
          },
          requestId: sessionId,
          source: "handleNext",
        })

        setStepsCompleted({ ...stepsCompleted, 3: true })
        setStep(4)
      } else if (step < 4) {
        setStep(step + 1)
      }
    } catch (error) {
      logger.error("Unexpected error during next step", {
        error,
        data: { currentStep: step },
        requestId: sessionId,
        source: "handleNext",
      })
    } finally {
      setIsNavigating(false)
    }
  }

  const handlePrevious = () => {
    logger.info("User clicked previous button", {
      data: { currentStep: step },
      requestId: sessionId,
      source: "handlePrevious",
    })

    setStep(step - 1)
  }

  const handleAnswerChange = (index: number, value: string) => {
    logger.debug("User updated answer", {
      data: {
        questionIndex: index,
        answerLength: value.length,
      },
      requestId: sessionId,
      source: "handleAnswerChange",
    })

    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleRemoveQuestion = (index: number) => {
    logger.info("User removed question", {
      data: {
        questionIndex: index,
        question: questions[index],
      },
      requestId: sessionId,
      source: "handleRemoveQuestion",
    })

    const newQuestions = [...questions]
    const newAnswers = [...answers]
    const newQuestionChoices = [...questionChoices]
    const newSelectedChoices = [...selectedChoices]

    newQuestions.splice(index, 1)
    newAnswers.splice(index, 1)
    newQuestionChoices.splice(index, 1)
    newSelectedChoices.splice(index, 1)

    setQuestions(newQuestions)
    setAnswers(newAnswers)
    setQuestionChoices(newQuestionChoices)
    setSelectedChoices(newSelectedChoices)

    toast({
      title: "Question removed",
      description: "The question has been removed from the list.",
    })
  }

  const handleRegenerateQuestion = async (index: number) => {
    setIsRegeneratingQuestion(index)

    logger.info("Regenerating question", {
      data: {
        questionIndex: index,
        originalQuestion: questions[index],
      },
      requestId: sessionId,
      source: "handleRegenerateQuestion",
    })

    try {
      const { newQuestion, newChoices } = await regenerateQuestionWithChoices(initialPrompt, questions)

      logger.info("Question regenerated successfully", {
        data: {
          questionIndex: index,
          newQuestion,
        },
        requestId: sessionId,
        source: "handleRegenerateQuestion",
      })

      const newQuestions = [...questions]
      newQuestions[index] = newQuestion

      const newQuestionChoices = [...questionChoices]
      newQuestionChoices[index] = newChoices

      const newAnswers = [...answers]
      newAnswers[index] = "" // Reset the answer for the new question

      const newSelectedChoices = [...selectedChoices]
      newSelectedChoices[index] = -1 // Reset the selected choice

      setQuestions(newQuestions)
      setQuestionChoices(newQuestionChoices)
      setAnswers(newAnswers)
      setSelectedChoices(newSelectedChoices)

      toast({
        title: "Question regenerated",
        description: "A new question has been generated.",
      })
    } catch (error) {
      logger.error("Error regenerating question", {
        error,
        data: { questionIndex: index },
        requestId: sessionId,
        source: "handleRegenerateQuestion",
      })

      toast({
        title: "Error",
        description: "Failed to regenerate question. Please try again.",
      })
    } finally {
      setIsRegeneratingQuestion(null)
    }
  }

  const handleAddQuestion = async () => {
    setIsRegeneratingQuestion(-1) // Use -1 to indicate we're adding a new question

    logger.info("Adding new question", {
      data: { currentQuestionCount: questions.length },
      requestId: sessionId,
      source: "handleAddQuestion",
    })

    try {
      const { newQuestion, newChoices } = await regenerateQuestionWithChoices(initialPrompt, questions)

      logger.info("New question added successfully", {
        data: { newQuestion },
        requestId: sessionId,
        source: "handleAddQuestion",
      })

      setQuestions([...questions, newQuestion])
      setQuestionChoices([...questionChoices, newChoices])
      setAnswers([...answers, ""])
      setSelectedChoices([...selectedChoices, -1])

      toast({
        title: "Question added",
        description: "A new question has been added to the list.",
      })
    } catch (error) {
      logger.error("Error adding question", {
        error,
        requestId: sessionId,
        source: "handleAddQuestion",
      })

      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
      })
    } finally {
      setIsRegeneratingQuestion(null)
    }
  }

  const handleChoiceSelection = (questionIndex: number, choiceIndex: number) => {
    logger.debug("User selected choice", {
      data: {
        questionIndex,
        choiceIndex,
      },
      requestId: sessionId,
      source: "handleChoiceSelection",
    })

    const newSelectedChoices = [...selectedChoices]
    newSelectedChoices[questionIndex] = choiceIndex
    setSelectedChoices(newSelectedChoices)

    // If it's not the "Other" option, set the answer to the choice text
    if (choiceIndex < questionChoices[questionIndex].length - 1) {
      const newAnswers = [...answers]
      newAnswers[questionIndex] = questionChoices[questionIndex][choiceIndex]
      setAnswers(newAnswers)
    }
    // If it's the "Other" option, keep the current answer or set to empty
    else if (choiceIndex === questionChoices[questionIndex].length - 1) {
      // Keep the current answer if it exists, otherwise set to empty
      if (!answers[questionIndex]) {
        const newAnswers = [...answers]
        newAnswers[questionIndex] = ""
        setAnswers(newAnswers)
      }
    }
  }

  const handleOptimizePrompt = async (prompt: string, suggestions: Suggestion[], additionalContext: string) => {
    setIsOptimizingPrompt(true)
    setAdditionalContext(additionalContext)

    logger.info("Optimizing prompt with suggestions", {
      data: {
        promptLength: prompt.length,
        suggestionCount: suggestions.length,
        hasAdditionalContext: !!additionalContext.trim(),
      },
      requestId: sessionId,
      source: "handleOptimizePrompt",
    })

    try {
      const optimizedPrompt = await optimizePromptWithSuggestions(prompt, suggestions, additionalContext)

      if (!optimizedPrompt || optimizedPrompt.includes("Error optimizing")) {
        logger.error("Failed to optimize prompt", {
          data: { optimizedPrompt },
          requestId: sessionId,
          source: "handleOptimizePrompt",
        })
        throw new Error("Failed to optimize prompt")
      }

      logger.info("Prompt optimized successfully", {
        data: {
          originalLength: prompt.length,
          optimizedLength: optimizedPrompt.length,
        },
        requestId: sessionId,
        source: "handleOptimizePrompt",
      })

      setRefinedPrompt(optimizedPrompt)
      setGeneratedPrompt(optimizedPrompt) // Update the generated prompt to reflect changes

      toast({
        title: "Prompt optimized",
        description: "Your prompt has been optimized with your suggestions.",
      })
    } catch (error) {
      logger.error("Error optimizing prompt", {
        error,
        requestId: sessionId,
        source: "handleOptimizePrompt",
      })

      toast({
        title: "Error",
        description: "Failed to optimize prompt. The server might be experiencing high load. Please try again.",
      })
    } finally {
      setIsOptimizingPrompt(false)
    }
  }

  const copyToClipboard = () => {
    logger.info("User copied prompt to clipboard", {
      data: { promptLength: refinedPrompt.length },
      requestId: sessionId,
      source: "copyToClipboard",
    })

    navigator.clipboard.writeText(refinedPrompt)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Refined prompt copied to clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const redirectToService = (service: string) => {
    logger.info("User redirected to service", {
      data: { service },
      requestId: sessionId,
      source: "redirectToService",
    })

    let url = ""

    switch (service) {
      case "chatgpt":
        url = `https://chat.openai.com/?prompt=${encodeURIComponent(refinedPrompt)}`
        break
      case "poe":
        url = `https://poe.com/`
        break
      case "deepseek":
        url = `https://chat.deepseek.com/`
        break
      case "claude":
        url = `https://claude.ai/`
        break
      case "bard":
        url = `https://bard.google.com/`
        break
      default:
        url = ""
    }

    if (url) {
      window.open(url, "_blank")
    }
  }

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-sm z-50 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-medium mr-6">
            1Prompt
          </Link>
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
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/chat">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Go to Chat</span>
            </Button>
          </Link>
          <div className="hidden md:flex items-center gap-2">
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/chat">
                  <Button className="w-full flex items-center gap-2 justify-start">
                    <MessageSquare className="h-4 w-4" />
                    Go to Chat
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
      </header>

      <main className="container mx-auto py-24 px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-medium mb-4">Refine your AI prompts</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your rough ideas into optimized prompts for AI chatbots through a guided refinement process.
          </p>
        </div>

        <div className="my-12">
          <div className="flex justify-between items-center relative">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex flex-col items-center z-10 ${canAccessStep(s) ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                onClick={() => canAccessStep(s) && handleStepClick(s)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border 
                    ${
                      step === s
                        ? "step-indicator-active"
                        : step > s
                          ? "step-indicator-completed"
                          : "step-indicator-inactive"
                    }
                    transition-all duration-300`}
                >
                  {isNavigating && s === step ? (
                    <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  ) : (
                    s
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${step === s ? "text-primary" : "text-muted-foreground"}`}>
                  {s === 1 ? "Initial Prompt" : s === 2 ? "Answer Questions" : s === 3 ? "Optimize" : "Result"}
                </span>
              </div>
            ))}
            <div className="step-line">
              <div className="step-line-progress" style={{ width: `${(step - 1) * 33.33}%` }}></div>
            </div>
          </div>
        </div>

        <Card className="minimalist-card">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>What do you want help with?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="E.g., I want to create a chatbot that helps with recipe suggestions"
                  className="min-h-[150px] minimalist-input"
                  value={initialPrompt}
                  onChange={(e) => setInitialPrompt(e.target.value)}
                />
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Let's add some context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isGeneratingQuestions ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                      <p className="text-center text-muted-foreground mt-4">Generating relevant questions...</p>
                    </div>
                  ) : (
                    <>
                      {questions.map((question, index) => (
                        <div key={index} className="space-y-4 bg-accent/50 p-4 rounded-md relative">
                          <div className="absolute right-2 top-2 flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRegenerateQuestion(index)}
                              disabled={isRegeneratingQuestion !== null}
                            >
                              {isRegeneratingQuestion === index ? (
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleRemoveQuestion(index)}
                              disabled={questions.length <= 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <Label htmlFor={`question-${index}`} className="pr-16 font-medium">
                            {question}
                          </Label>

                          <div className="space-y-2">
                            {questionChoices[index]?.map((choice, choiceIndex) => (
                              <div key={choiceIndex} className="choice-container">
                                <input
                                  type="radio"
                                  id={`choice-${index}-${choiceIndex}`}
                                  name={`question-${index}`}
                                  checked={selectedChoices[index] === choiceIndex}
                                  onChange={() => handleChoiceSelection(index, choiceIndex)}
                                />
                                <label htmlFor={`choice-${index}-${choiceIndex}`} className="text-sm cursor-pointer">
                                  {choice}
                                </label>
                              </div>
                            ))}

                            {/* Show textarea if "Other" is selected */}
                            {selectedChoices[index] === questionChoices[index]?.length - 1 && (
                              <Textarea
                                id={`question-${index}-other`}
                                placeholder="Please specify your answer"
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                className="minimalist-input mt-2"
                              />
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 minimalist-button"
                        onClick={handleAddQuestion}
                        disabled={isRegeneratingQuestion !== null}
                      >
                        {isRegeneratingQuestion === -1 ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                            Adding Question...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Add Another Question
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Optimize Your Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                {isGeneratingPrompt ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-center text-muted-foreground mt-4">
                      Generating your initial prompt based on your inputs...
                    </p>
                  </div>
                ) : (
                  <PromptOptimizer
                    initialPrompt={generatedPrompt}
                    onOptimize={handleOptimizePrompt}
                    onRegenerate={handleRegeneratePrompt}
                    isOptimizing={isOptimizingPrompt}
                    isRegenerating={isRegeneratingPrompt}
                  />
                )}
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Your Refined Prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="bg-accent/50 p-6 rounded-md relative">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{refinedPrompt}</pre>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-3 right-3 minimalist-button"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Use this prompt with:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-auto py-3 platform-button"
                      onClick={() => redirectToService("chatgpt")}
                    >
                      <img src={ChatbotIcons.chatgpt || "/placeholder.svg"} alt="ChatGPT" className="h-5 w-5" />
                      <span>ChatGPT</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-auto py-3 platform-button"
                      onClick={() => redirectToService("deepseek")}
                    >
                      <img src={ChatbotIcons.deepseek || "/placeholder.svg"} alt="DeepSeek" className="h-5 w-5" />
                      <span>DeepSeek</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-auto py-3 platform-button"
                      onClick={() => redirectToService("claude")}
                    >
                      <img src={ChatbotIcons.claude || "/placeholder.svg"} alt="Claude" className="h-5 w-5" />
                      <span>Claude</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-auto py-3 platform-button"
                      onClick={() => redirectToService("poe")}
                    >
                      <img src={ChatbotIcons.poe || "/placeholder.svg"} alt="Poe" className="h-5 w-5" />
                      <span>Poe</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-auto py-3 platform-button"
                      onClick={() => redirectToService("bard")}
                    >
                      <img src={ChatbotIcons.bard || "/placeholder.svg"} alt="Gemini" className="h-5 w-5" />
                      <span>Gemini</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <Link href="/chat" className="w-full sm:w-auto">
                    <Button className="w-full flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Try this prompt in Chat
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Feedback Section */}
                <div className="mt-10 border-t pt-8 border-border">
                  <h3 className="text-lg font-medium mb-4">We'd Love Your Feedback</h3>
                  <p className="text-muted-foreground mb-6">
                    Have suggestions for improving this tool? Found a bug? Want to share your experience? We'd love to
                    hear from you!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="mailto:shaviralhk@gmail.com"
                      className="flex items-center gap-2 p-4 rounded-md border border-border hover:bg-accent/50 transition-colors"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">shaviralhk@gmail.com</p>
                      </div>
                    </a>

                    <a
                      href="https://www.instagram.com/shaviralhk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-4 rounded-md border border-border hover:bg-accent/50 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">@shaviralhk</p>
                      </div>
                    </a>

                    <a
                      href="https://discord.gg/Huwfr8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-4 rounded-md border border-border hover:bg-accent/50 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Discord</p>
                        <p className="text-sm text-muted-foreground">Join our community</p>
                      </div>
                    </a>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1 || isNavigating}
              className="minimalist-button w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  isNavigating ||
                  (step === 1 && (!initialPrompt.trim() || isGeneratingQuestions)) ||
                  (step === 2 &&
                    (answers.some((a) => !a.trim()) || isGeneratingPrompt || isRegeneratingQuestion !== null)) ||
                  (step === 3 && isOptimizingPrompt)
                }
                className="minimalist-button w-full sm:w-auto"
              >
                {isNavigating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    {step === 3 ? "Continue to Result" : "Continue"} <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  logger.info("User started over", {
                    requestId: sessionId,
                    source: "startOver",
                  })

                  setStep(1)
                  setInitialPrompt("")
                  setQuestions([])
                  setAnswers([])
                  setGeneratedPrompt("")
                  setRefinedPrompt("")
                  setAdditionalContext("")
                  setStepsCompleted({
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                  })
                }}
                className="minimalist-button w-full sm:w-auto"
              >
                Start Over
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
