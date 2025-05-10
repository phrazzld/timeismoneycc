/**
 * Structured logging module
 *
 * Provides consistent JSON-formatted logging with standardized fields for better
 * observability and debugging. All logs include timestamp, level, and message,
 * along with any additional context provided.
 *
 * Usage:
 * ```
 * import { log } from './logger';
 *
 * // Basic usage
 * log('info', 'User signed in');
 *
 * // With additional context
 * log('error', 'Failed to process payment', {
 *   component: 'PaymentProcessor',
 *   orderId: 'order-123',
 *   errorCode: 'INVALID_CARD'
 * });
 * ```
 */

/**
 * Valid log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log context interface for structured logging
 * Allows for standard context fields plus any additional key-value pairs
 */
export interface LogContext {
  [key: string]: any;
  /** Component or module that generated the log */
  component?: string;
  /** Request/transaction ID for tracing across operations */
  correlationId?: string;
}

/**
 * Logs a message with specified level and optional context
 * Formats the log entry as JSON for easier parsing and analysis
 *
 * @param level - Severity level of the log message
 * @param message - Main log message
 * @param context - Additional structured context data
 */
export function log(level: LogLevel, message: string, context?: LogContext): void {
  // Create timestamp in ISO 8601 format
  const timestamp = new Date().toISOString();

  // Build log entry with standard required fields
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };

  // Output as JSON to appropriate console method based on level
  console[level](JSON.stringify(logEntry));
}
