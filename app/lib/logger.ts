// Logging levels
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

// Log entry interface
export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  error?: Error | unknown
  source?: string
  userId?: string
  requestId?: string
}

// Generate a unique request ID
export function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Format log entry for console output
function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, source, requestId } = entry
  const sourceInfo = source ? `[${source}]` : ""
  const requestInfo = requestId ? `[${requestId.substring(0, 8)}]` : ""
  return `${timestamp} ${level} ${sourceInfo}${requestInfo} ${message}`
}

// Main logger function
export function log(
  level: LogLevel,
  message: string,
  options?: {
    data?: any
    error?: Error | unknown
    source?: string
    userId?: string
    requestId?: string
  },
): void {
  const timestamp = new Date().toISOString()
  const entry: LogEntry = {
    timestamp,
    level,
    message,
    ...options,
  }

  // Log to console
  const formattedMessage = formatLogEntry(entry)

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMessage, options?.data || "", options?.error || "")
      break
    case LogLevel.INFO:
      console.info(formattedMessage, options?.data || "", options?.error || "")
      break
    case LogLevel.WARN:
      console.warn(formattedMessage, options?.data || "", options?.error || "")
      break
    case LogLevel.ERROR:
      console.error(formattedMessage, options?.data || "", options?.error || "")
      break
  }

  // In a production environment, you might want to send logs to a service
  // like Vercel Logs, LogRocket, Sentry, etc.
  if (process.env.NODE_ENV === "production" && level === LogLevel.ERROR) {
    // Example: send to error tracking service
    // sendToErrorTrackingService(entry);
  }
}

// Convenience methods
export const logger = {
  debug: (message: string, options?: Omit<LogEntry, "timestamp" | "level" | "message">) =>
    log(LogLevel.DEBUG, message, options),

  info: (message: string, options?: Omit<LogEntry, "timestamp" | "level" | "message">) =>
    log(LogLevel.INFO, message, options),

  warn: (message: string, options?: Omit<LogEntry, "timestamp" | "level" | "message">) =>
    log(LogLevel.WARN, message, options),

  error: (message: string, options?: Omit<LogEntry, "timestamp" | "level" | "message">) =>
    log(LogLevel.ERROR, message, options),

  // Log API request
  logApiRequest: (endpoint: string, payload: any, requestId: string, source: string) => {
    log(LogLevel.INFO, `API Request to ${endpoint}`, {
      data: { payload },
      source,
      requestId,
    })
  },

  // Log API response
  logApiResponse: (endpoint: string, response: any, duration: number, requestId: string, source: string) => {
    log(LogLevel.INFO, `API Response from ${endpoint} (${duration}ms)`, {
      data: { response },
      source,
      requestId,
    })
  },

  // Log user action
  logUserAction: (action: string, data: any, userId?: string, requestId?: string) => {
    log(LogLevel.INFO, `User Action: ${action}`, {
      data,
      userId,
      requestId,
      source: "UserAction",
    })
  },
}
