"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Edit2, RefreshCw } from "lucide-react"
import { logger } from "@/app/lib/logger"

interface PromptOptimizerProps {
  initialPrompt: string
  onOptimize: (prompt: string, suggestions: Suggestion[], additionalContext: string) => Promise<void>
  onRegenerate: () => Promise<void>
  isOptimizing: boolean
  isRegenerating: boolean
}

export interface Suggestion {
  originalText: string
  replacementText: string
  startIndex: number
  endIndex: number
}

export function PromptOptimizer({
  initialPrompt,
  onOptimize,
  onRegenerate,
  isOptimizing,
  isRegenerating,
}: PromptOptimizerProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [highlightedRanges, setHighlightedRanges] = useState<{ start: number; end: number; color: string }[]>([])
  const [additionalContext, setAdditionalContext] = useState("")
  const textRef = useRef<HTMLPreElement>(null)

  // Update prompt when initialPrompt changes
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== "") {
      logger.debug("Initial prompt updated in optimizer", {
        data: { promptLength: initialPrompt.length },
        source: "PromptOptimizer",
      })

      setPrompt(initialPrompt)
      setSuggestions([])
      setHighlightedRanges([])
    }
  }, [initialPrompt])

  // Handle text selection
  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0 && textRef.current) {
      const range = selection.getRangeAt(0)

      // Calculate the start and end indices of the selection
      const preSelectionRange = range.cloneRange()
      preSelectionRange.selectNodeContents(textRef.current)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      const start = preSelectionRange.toString().length

      const selectedText = selection.toString()
      const end = start + selectedText.length

      logger.debug("User selected text", {
        data: {
          selectedText,
          start,
          end,
        },
        source: "PromptOptimizer",
      })

      setSelection({
        start,
        end,
        text: selectedText,
      })

      setDialogOpen(true)
    }
  }

  // Apply a suggestion
  const applySuggestion = () => {
    if (selection && suggestion.trim()) {
      logger.info("User applied suggestion", {
        data: {
          originalText: selection.text,
          replacementText: suggestion,
          start: selection.start,
          end: selection.end,
        },
        source: "PromptOptimizer",
      })

      const newSuggestion: Suggestion = {
        originalText: selection.text,
        replacementText: suggestion,
        startIndex: selection.start,
        endIndex: selection.end,
      }

      // Add to suggestions list
      setSuggestions([...suggestions, newSuggestion])

      // Add to highlighted ranges for visual feedback
      setHighlightedRanges([
        ...highlightedRanges,
        { start: selection.start, end: selection.end, color: getHighlightColor() },
      ])

      // Close dialog and reset
      setDialogOpen(false)
      setSuggestion("")
      setSelection(null)
    }
  }

  // Get a highlight color
  const getHighlightColor = () => {
    return "rgba(0, 0, 0, 0.1)"
  }

  // Render highlighted text
  const renderHighlightedText = () => {
    const result = []
    let lastIndex = 0

    // Sort highlighted ranges by start index
    const sortedRanges = [...highlightedRanges].sort((a, b) => a.start - b.start)

    for (const range of sortedRanges) {
      // Add text before the highlight
      if (range.start > lastIndex) {
        result.push(prompt.substring(lastIndex, range.start))
      }

      // Add highlighted text
      result.push(
        <span
          key={`highlight-${range.start}`}
          style={{ backgroundColor: range.color }}
          className="relative group transition-all duration-300"
        >
          {prompt.substring(range.start, range.end)}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Suggested change
          </span>
        </span>,
      )

      lastIndex = range.end
    }

    // Add remaining text
    if (lastIndex < prompt.length) {
      result.push(prompt.substring(lastIndex))
    }

    return result
  }

  // Handle optimize
  const handleOptimize = async () => {
    logger.info("User clicked optimize button", {
      data: {
        promptLength: prompt.length,
        suggestionCount: suggestions.length,
        additionalContextLength: additionalContext.length,
      },
      source: "PromptOptimizer",
    })

    await onOptimize(prompt, suggestions, additionalContext)

    // Reset suggestions after optimization
    setSuggestions([])
    setHighlightedRanges([])
  }

  // Check if initialPrompt is empty or undefined
  if (!initialPrompt || initialPrompt.trim() === "") {
    logger.warn("Empty initial prompt in optimizer", {
      source: "PromptOptimizer",
    })

    return (
      <div className="space-y-6">
        <div className="bg-accent/50 p-6 rounded-md flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground text-center">
            No prompt generated yet. Please go back to step 2 and complete your answers.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="additional-context">Suggest Improvement</Label>
        <Textarea
          id="additional-context"
          placeholder="Suggest how you want to improve the prompt. E.g., I want to only target the vegan audience."
          className="min-h-[100px] minimalist-input"
          value={additionalContext}
          onChange={(e) => {
            logger.debug("User updated additional context", {
              data: { length: e.target.value.length },
              source: "PromptOptimizer",
            })
            setAdditionalContext(e.target.value)
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center mb-2">
          <Label>Edit Prompt</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs minimalist-button md:hidden"
              onClick={() => {
                logger.debug("User opened edit dialog (mobile)", {
                  source: "PromptOptimizer",
                })
                setDialogOpen(true)
              }}
            >
              <Edit2 className="h-3 w-3" /> Tap to edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs minimalist-button hidden md:flex"
              onClick={() => {
                logger.debug("User opened edit dialog (desktop)", {
                  source: "PromptOptimizer",
                })
                setDialogOpen(true)
              }}
            >
              <Edit2 className="h-3 w-3" /> Select text to edit
            </Button>
          </div>
        </div>

        <div className="bg-accent/50 p-6 rounded-md relative">
          <pre
            ref={textRef}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            className="whitespace-pre-wrap font-mono text-sm cursor-text"
            role="textbox"
            aria-label="Prompt text that can be selected for editing"
            data-test-id="prompt-content"
          >
            {highlightedRanges.length > 0 ? renderHighlightedText() : prompt}
          </pre>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
          {suggestions.length === 0
            ? "Select text to suggest improvements"
            : `${suggestions.length} suggestion${suggestions.length !== 1 ? "s" : ""} added`}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => {
              logger.info("User clicked regenerate prompt button", {
                source: "PromptOptimizer",
              })
              onRegenerate()
            }}
            disabled={isRegenerating}
            className="minimalist-button w-full sm:w-auto"
          >
            {isRegenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate Prompt
              </>
            )}
          </Button>

          <Button onClick={handleOptimize} disabled={isOptimizing} className="minimalist-button w-full sm:w-auto">
            {isOptimizing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"></div>
                Optimizing...
              </>
            ) : (
              "Optimize with Suggestions"
            )}
          </Button>
        </div>
      </div>

      {/* Text Selection Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          logger.debug(`User ${open ? "opened" : "closed"} suggestion dialog`, {
            source: "PromptOptimizer",
          })
          setDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-md max-w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Suggest an improvement</DialogTitle>
            <DialogDescription>How would you like to improve this prompt?</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selection ? (
              <div className="space-y-3">
                <div className="bg-accent p-3 rounded text-sm">
                  <p className="font-medium text-xs mb-1 text-muted-foreground">Selected text:</p>
                  <p className="italic">{selection.text}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logger.debug("User cleared text selection", {
                      source: "PromptOptimizer",
                    })
                    setSelection(null)
                  }}
                  className="w-full text-xs"
                >
                  Change selection
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Select a part to improve</Label>
                <div className="bg-accent/50 p-3 rounded-md max-h-[30vh] overflow-y-auto">
                  <div className="font-mono text-sm">
                    {prompt.split("\n").map((line, i) => (
                      <div
                        key={i}
                        className="py-1 px-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => {
                          const start = prompt.indexOf(line)
                          const end = start + line.length

                          logger.debug("User selected line from list", {
                            data: {
                              lineIndex: i,
                              lineContent: line,
                              start,
                              end,
                            },
                            source: "PromptOptimizer",
                          })

                          setSelection({
                            start,
                            end,
                            text: line,
                          })
                        }}
                      >
                        {line || " "}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Textarea
              value={suggestion}
              onChange={(e) => {
                logger.debug("User typing suggestion", {
                  data: { length: e.target.value.length },
                  source: "PromptOptimizer",
                })
                setSuggestion(e.target.value)
              }}
              placeholder="Enter your suggested improvement..."
              className="min-h-[100px] minimalist-input"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                logger.debug("User cancelled suggestion", {
                  source: "PromptOptimizer",
                })
                setDialogOpen(false)
              }}
              className="minimalist-button w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={applySuggestion}
              disabled={!suggestion.trim() || !selection}
              className="minimalist-button w-full sm:w-auto"
            >
              Apply Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
