"use server"

import { generateText } from "ai"
import { deepseek } from "@ai-sdk/deepseek"
import { logger } from "@/app/lib/logger"
import type { PromptOptimizer } from "@/app/components/prompt-optimizer"
import { v4 as uuidv4 } from "uuid"

// Helper function to generate a unique request ID
function generateRequestId() {
  return uuidv4()
}

// Helper function to add retry logic
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 1000,
  requestId: string,
  operation: string,
): Promise<T> {
  try {
    const startTime = Date.now()
    const result = await fn()
    const duration = Date.now() - startTime

    logger.info(`Operation '${operation}' completed successfully`, {
      data: { duration },
      requestId,
      source: "withRetry",
    })

    return result
  } catch (error) {
    if (retries <= 0) {
      logger.error(`Operation '${operation}' failed after all retries`, {
        error,
        requestId,
        source: "withRetry",
      })
      throw error
    }

    logger.warn(`Retrying operation '${operation}' after ${delay}ms, ${retries} retries left`, {
      error,
      requestId,
      source: "withRetry",
    })

    await new Promise((resolve) => setTimeout(resolve, delay))
    return withRetry(fn, retries - 1, delay * 1.5, requestId, operation)
  }
}

export async function generateQuestions(initialPrompt: string): Promise<string[]> {
  const requestId = generateRequestId()

  logger.info("Generating questions for prompt", {
    data: { promptLength: initialPrompt.length },
    requestId,
    source: "generateQuestions",
  })

  try {
    // Log the user input (truncated for privacy/size)
    logger.info("User input for question generation", {
      data: {
        prompt: initialPrompt.length > 100 ? initialPrompt.substring(0, 100) + "..." : initialPrompt,
      },
      requestId,
      source: "generateQuestions",
    })

    // Use shorter system prompt to reduce token count
    const startTime = Date.now()

    logger.logApiRequest(
      "deepseek/generateText",
      {
        model: "deepseek-chat",
        promptLength: initialPrompt.length,
        systemPrompt: "Generate 3-5 follow-up questions...",
      },
      requestId,
      "generateQuestions",
    )

    const { text } = await withRetry(
      () =>
        generateText({
          model: deepseek("deepseek-chat"),
          system: `Generate 3-5 follow-up questions to refine a prompt. Questions should address gaps, clarify goals, identify constraints, and understand use cases. Return one question per line.`,
          prompt: `Initial prompt: "${initialPrompt.slice(0, 500)}"
    
    Generate 3-5 follow-up questions to help refine this prompt.`,
          temperature: 0.7, // Add temperature to make responses faster
          maxTokens: 300, // Limit token count for faster responses
        }),
      2,
      1000,
      requestId,
      "deepseek-generate-questions",
    )

    const duration = Date.now() - startTime

    logger.logApiResponse(
      "deepseek/generateText",
      {
        responseLength: text.length,
        firstLine: text.split("\n")[0],
      },
      duration,
      requestId,
      "generateQuestions",
    )

    logger.info("API Response for question generation", {
      data: { text },
      requestId,
      source: "generateQuestions",
    })

    // First try to parse as JSON
    try {
      const parsedResponse = JSON.parse(text)
      if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
        logger.info("Successfully parsed questions as JSON", {
          data: { questionCount: parsedResponse.length },
          requestId,
          source: "generateQuestions",
        })
        return parsedResponse
      }
    } catch (e) {
      logger.warn("JSON parsing failed, using text extraction fallback", {
        error: e,
        requestId,
        source: "generateQuestions",
      })
    }

    // If JSON parsing fails, extract questions by looking for lines ending with ?
    const questions = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.endsWith("?") && line.length > 5)

    // If we found questions with this method, return them
    if (questions.length > 0) {
      logger.info("Extracted questions using line ending with ? method", {
        data: { questionCount: questions.length },
        requestId,
        source: "generateQuestions",
      })
      return questions
    }

    // If we still don't have questions, try another extraction method
    // Look for numbered questions (1. What is...?)
    const numberedQuestionRegex = /\d+[.)]\s+([^\n]+\?)/g
    const numberedMatches = [...text.matchAll(numberedQuestionRegex)]

    if (numberedMatches.length > 0) {
      logger.info("Extracted questions using numbered question regex", {
        data: { questionCount: numberedMatches.length },
        requestId,
        source: "generateQuestions",
      })
      return numberedMatches.map((match) => match[1].trim())
    }

    // Final fallback: just split by question marks
    const questionMarkSplit = text
      .split("?")
      .map((q) => q.trim())
      .filter((q) => q.length > 10)
      .map((q) => q + "?")

    if (questionMarkSplit.length > 0) {
      logger.info("Extracted questions using question mark split method", {
        data: { questionCount: questionMarkSplit.length },
        requestId,
        source: "generateQuestions",
      })
      return questionMarkSplit
    }

    // If all extraction methods fail, return default questions
    logger.warn("All question extraction methods failed, using default questions", {
      requestId,
      source: "generateQuestions",
    })

    return [
      "What specific goal are you trying to achieve with this prompt?",
      "Who is the target audience for this output?",
      "What tone or style would you prefer in the responses?",
      "Are there any specific constraints or requirements to consider?",
    ]
  } catch (error) {
    logger.error("Error generating questions", {
      error,
      requestId,
      source: "generateQuestions",
    })

    return [
      "What specific goal are you trying to achieve with this prompt?",
      "Who is the target audience for this output?",
      "What tone or style would you prefer in the responses?",
      "Are there any specific constraints or requirements to consider?",
    ]
  }
}

export async function regenerateQuestion(initialPrompt: string, existingQuestions: string[]): Promise<string> {
  const requestId = generateRequestId()

  logger.info("Regenerating question", {
    data: {
      promptLength: initialPrompt.length,
      existingQuestionCount: existingQuestions.length,
    },
    requestId,
    source: "regenerateQuestion",
  })

  try {
    const startTime = Date.now()

    logger.logApiRequest(
      "deepseek/generateText",
      {
        model: "deepseek-chat",
        promptLength: initialPrompt.length,
        existingQuestionCount: existingQuestions.length,
      },
      requestId,
      "regenerateQuestion",
    )

    const { text } = await withRetry(
      () =>
        generateText({
          model: deepseek("deepseek-chat"),
          system: `Generate a new follow-up question different from existing ones. Return ONLY the question.`,
          prompt: `Initial prompt: "${initialPrompt.slice(0, 300)}"
    
    Existing questions:
    ${existingQuestions.slice(0, 3).join("\n")}
    
    Generate a new, different follow-up question.`,
          temperature: 0.7,
          maxTokens: 100,
        }),
      2,
      1000,
      requestId,
      "deepseek-regenerate-question",
    )

    const duration = Date.now() - startTime

    logger.logApiResponse(
      "deepseek/generateText",
      {
        responseLength: text.length,
        response: text,
      },
      duration,
      requestId,
      "regenerateQuestion",
    )

    // Clean up the response to ensure it's just a question
    let question = text.trim()

    // If the response doesn't end with a question mark, try to extract the question
    if (!question.endsWith("?")) {
      logger.warn("Response doesn't end with question mark, attempting to extract question", {
        data: { originalResponse: question },
        requestId,
        source: "regenerateQuestion",
      })

      const questionMatch = question.match(/([^.!?]+\?)/)
      if (questionMatch) {
        question = questionMatch[0].trim()
        logger.info("Successfully extracted question from response", {
          data: { extractedQuestion: question },
          requestId,
          source: "regenerateQuestion",
        })
      }
    }

    logger.info("Successfully regenerated question", {
      data: { question },
      requestId,
      source: "regenerateQuestion",
    })

    return question
  } catch (error) {
    logger.error("Error regenerating question", {
      error,
      requestId,
      source: "regenerateQuestion",
    })

    return "What other information would be helpful for refining this prompt?"
  }
}

// Add new function to generate questions with choices
export async function generateQuestionsWithChoices(initialPrompt: string) {
  const requestId = generateRequestId()
  try {
    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: `Generate 5 questions with multiple-choice options to help refine the following prompt: "${initialPrompt}". 
      
      For each question:
      1. Focus on different aspects of the prompt that could be improved or clarified
      2. Make sure the questions are diverse and don't overlap too much
      3. Provide 3-4 specific answer choices for each question
      4. Always include "Other (please specify)" as the last option
      
      Format your response as a JSON array with the following structure:
      [
        {
          "question": "Question text here?",
          "choices": ["Option 1", "Option 2", "Option 3", "Other (please specify)"]
        },
        ...
      ]
      
      Only return the JSON array, nothing else.`,
    })

    try {
      const parsedResponse = JSON.parse(text)
      const generatedQuestions = parsedResponse.map((item: any) => item.question)
      const generatedChoices = parsedResponse.map((item: any) => item.choices)

      return { generatedQuestions, generatedChoices }
    } catch (parseError) {
      logger.error("Error parsing questions response", {
        error: parseError,
        data: { text },
        source: "generateQuestionsWithChoices",
      })
      return { generatedQuestions: [], generatedChoices: [] }
    }
  } catch (error) {
    logger.error("Error generating questions", {
      error,
      source: "generateQuestionsWithChoices",
    })
    return { generatedQuestions: [], generatedChoices: [] }
  }
}

// Add new function to regenerate a question with choices
export async function regenerateQuestionWithChoices(initialPrompt: string, existingQuestions: string[]) {
  const requestId = generateRequestId()
  try {
    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: `Generate a new question with multiple-choice options to help refine the following prompt: "${initialPrompt}".
      
      The question should be different from these existing questions:
      ${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}
      
      For the new question:
      1. Focus on an aspect of the prompt that could be improved or clarified that hasn't been addressed yet
      2. Make sure the question is different from the existing ones
      3. Provide 3-4 specific answer choices
      4. Always include "Other (please specify)" as the last option
      
      Format your response as a JSON object with the following structure:
      {
        "question": "Question text here?",
        "choices": ["Option 1", "Option 2", "Option 3", "Other (please specify)"]
      }
      
      Only return the JSON object, nothing else.`,
    })

    try {
      const parsedResponse = JSON.parse(text)
      return {
        newQuestion: parsedResponse.question,
        newChoices: parsedResponse.choices,
      }
    } catch (parseError) {
      logger.error("Error parsing regenerated question response", {
        error: parseError,
        data: { text },
        source: "regenerateQuestionWithChoices",
      })
      return {
        newQuestion: "What other aspects of this prompt would you like to improve?",
        newChoices: ["Clarity", "Specificity", "Context", "Other (please specify)"],
      }
    }
  } catch (error) {
    logger.error("Error regenerating question", {
      error,
      source: "regenerateQuestionWithChoices",
    })
    return {
      newQuestion: "What other aspects of this prompt would you like to improve?",
      newChoices: ["Clarity", "Specificity", "Context", "Other (please specify)"],
    }
  }
}

export async function generateInitialPrompt(initialPrompt: string, questions: string[], answers: string[]) {
  const requestId = generateRequestId()
  try {
    const questionsAndAnswers = questions.map((question, index) => `Q: ${question}\nA: ${answers[index]}`).join("\n\n")

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: `I want to refine this initial prompt: "${initialPrompt}"
      
      Based on the following questions and answers, create an improved version of the prompt that incorporates all the details and clarifications:
      
      ${questionsAndAnswers}
      
      Generate a well-structured, detailed prompt that follows the RICCE framework:
      - Role: Who the AI should act as
      - Instruction: What the AI should do
      - Context: Relevant background information
      - Criteria: What makes a good response
      - Example: (if applicable)
      
      The refined prompt should be comprehensive but concise, and should incorporate all the information from the questions and answers.`,
    })

    return text
  } catch (error) {
    logger.error("Error generating initial prompt", {
      error,
      source: "generateInitialPrompt",
    })
    return "Error generating prompt. Please try again."
  }
}

export async function regeneratePrompt(initialPrompt: string, questions: string[], answers: string[]) {
  const requestId = generateRequestId()
  try {
    const questionsAndAnswers = questions.map((question, index) => `Q: ${question}\nA: ${answers[index]}`).join("\n\n")

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: `I want to refine this initial prompt: "${initialPrompt}"
      
      Based on the following questions and answers, create an improved version of the prompt that incorporates all the details and clarifications:
      
      ${questionsAndAnswers}
      
      Generate a well-structured, detailed prompt that follows the RICCE framework:
      - Role: Who the AI should act as
      - Instruction: What the AI should do
      - Context: Relevant background information
      - Criteria: What makes a good response
      - Example: (if applicable)
      
      The refined prompt should be comprehensive but concise, and should incorporate all the information from the questions and answers.
      
      IMPORTANT: Generate a completely different approach from any previous attempts, with a fresh structure and perspective.`,
    })

    return text
  } catch (error) {
    logger.error("Error regenerating prompt", {
      error,
      source: "regeneratePrompt",
    })
    return "Error regenerating prompt. Please try again."
  }
}

export async function optimizePromptWithSuggestions(
  prompt: string,
  suggestions: PromptOptimizer.Suggestion[],
  additionalContext: string,
) {
  const requestId = generateRequestId()
  try {
    const enabledSuggestions = suggestions.filter((s) => s.enabled)

    if (enabledSuggestions.length === 0 && !additionalContext.trim()) {
      return prompt
    }

    const suggestionsText = enabledSuggestions.map((s) => `- ${s.description}`).join("\n")

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: `I have a prompt that I want to optimize:
      
      "${prompt}"
      
      ${
        enabledSuggestions.length > 0
          ? `Please apply these specific improvements:
      ${suggestionsText}`
          : ""
      }
      
      ${
        additionalContext.trim()
          ? `Also consider this additional context:
      ${additionalContext}`
          : ""
      }
      
      Please provide an optimized version of the prompt that incorporates these suggestions while maintaining the original intent and structure. The optimized prompt should still follow the RICCE framework.`,
    })

    return text
  } catch (error) {
    logger.error("Error optimizing prompt with suggestions", {
      error,
      source: "optimizePromptWithSuggestions",
    })
    return "Error optimizing prompt. Please try again."
  }
}
