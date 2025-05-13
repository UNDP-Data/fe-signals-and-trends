/**
 * Logger levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  GROUP = 'group',
  GROUP_END = 'groupEnd',
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  useColors: boolean;
}

// Check if the ENABLE_LOGGING environment variable is provided
const isLoggingEnabled = process.env.ENABLE_LOGGING === 'true' || process.env.ENABLE_LOGGING === '1';

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  enabled: isLoggingEnabled, // Only enabled when ENABLE_LOGGING env var is set
  level: LogLevel.INFO,
  useColors: true,
};

/**
 * Color styles for different log types
 */
const COLORS = {
  // Log level colors
  [LogLevel.DEBUG]: 'color: #9b59b6',
  [LogLevel.INFO]: 'color: #3498db',
  [LogLevel.WARN]: 'color: #f39c12',
  [LogLevel.ERROR]: 'color: #e74c3c',
  [LogLevel.GROUP]: 'color: #3498db; font-weight: bold',
  
  // Special categories
  api: {
    call: 'color: #3498db; font-weight: bold',
    response: 'color: #2ecc71; font-weight: bold', 
    error: 'color: #e74c3c; font-weight: bold',
    endpoint: 'color: #27ae60',
    timing: 'color: #9b59b6',
    params: 'color: #f39c12',
    data: 'color: #f39c12',
    status: 'color: #f39c12',
  }
};

/**
 * Logger class
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    // Log a startup message if enabled
    if (this.isEnabled()) {
      console.info(`🔍 Logging is ENABLED (ENABLE_LOGGING=${process.env.ENABLE_LOGGING})`);
    }
  }

  /**
   * Update logger configuration
   */
  public configure(config: Partial<LoggerConfig>): void {
    const wasEnabled = this.isEnabled();
    this.config = { ...this.config, ...config };
    
    // Log status change if there was a change in enabled state
    if (!wasEnabled && this.isEnabled()) {
      console.info('🔍 Logging has been ENABLED');
    } else if (wasEnabled && !this.isEnabled()) {
      console.info('🔍 Logging has been DISABLED');
    }
  }

  /**
   * Check if logging is enabled
   */
  private isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Log a message with optional styling
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.isEnabled()) return;

    // For consistency in production builds, we'll skip this check
    if (console && typeof console[level] === 'function') {
      // Apply styling if colors are enabled
      if (this.config.useColors && typeof message === 'string' && message.includes('%c')) {
        console[level](message, ...args);
      } else {
        console[level](message, ...args);
      }
    }
  }

  /**
   * Start a collapsible group in the console
   */
  public group(label: string): void {
    if (!this.isEnabled()) return;
    
    if (this.config.useColors) {
      console.group(`%c${label}`, COLORS[LogLevel.GROUP]);
    } else {
      console.group(label);
    }
  }

  /**
   * End the current group
   */
  public groupEnd(): void {
    if (!this.isEnabled()) return;
    console.groupEnd();
  }

  /**
   * Log debug message
   */
  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * Log info message
   */
  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * Log warning message
   */
  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * Log error message
   */
  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
   * Log API call
   */
  public logApiCall(methodName: string, url: string, params?: any): void {
    if (!this.isEnabled()) return;
    
    this.group(`🌐 API Call: ${methodName}`);
    
    if (this.config.useColors) {
      this.info(`%c📍 Endpoint: ${url}`, COLORS.api.endpoint);
      if (params) {
        this.info('%c📦 Params:', COLORS.api.params, params);
      }
    } else {
      this.info(`📍 Endpoint: ${url}`);
      if (params) {
        this.info('📦 Params:', params);
      }
    }
    
    this.groupEnd();
  }

  /**
   * Log API response
   */
  public logApiResponse(methodName: string, url: string, response: any, timeMs: number): void {
    if (!this.isEnabled()) return;
    
    this.group(`✅ API Response: ${methodName}`);
    
    if (this.config.useColors) {
      this.info(`%c📍 Endpoint: ${url}`, COLORS.api.endpoint);
      this.info(`%c⏱️ Time: ${timeMs}ms`, COLORS.api.timing);
      this.info('%c📄 Response:', COLORS.api.data, response);
    } else {
      this.info(`📍 Endpoint: ${url}`);
      this.info(`⏱️ Time: ${timeMs}ms`);
      this.info('📄 Response:', response);
    }
    
    this.groupEnd();
  }

  /**
   * Log API error
   */
  public logApiError(methodName: string, url: string, error: any, timeMs: number): void {
    if (!this.isEnabled()) return;
    
    this.group(`❌ API Error: ${methodName}`);
    
    if (this.config.useColors) {
      this.info(`%c📍 Endpoint: ${url}`, COLORS.api.endpoint);
      this.info(`%c⏱️ Time: ${timeMs}ms`, COLORS.api.timing);
      
      if (error?.response) {
        this.info('%c🔍 Status:', COLORS.api.status, error.response?.status);
        this.info('%c📄 Error Data:', COLORS.api.data, error.response?.data);
      }
      
      this.error('%c🚨 Error:', COLORS.api.error, error);
    } else {
      this.info(`📍 Endpoint: ${url}`);
      this.info(`⏱️ Time: ${timeMs}ms`);
      
      if (error?.response) {
        this.info('🔍 Status:', error.response?.status);
        this.info('📄 Error Data:', error.response?.data);
      }
      
      this.error('🚨 Error:', error);
    }
    
    this.groupEnd();
  }
}

/**
 * Helper function to enable/disable logging
 * This can be used anywhere in the application to toggle logging programmatically
 */
export const enableLogging = (enable: boolean): void => {
  logger.configure({ enabled: enable });
}

// Export a singleton instance
export const logger = new Logger();

// Allow for importing specific functions directly
export const { 
  debug, 
  info, 
  warn, 
  error, 
  group,
  groupEnd,
  logApiCall,
  logApiResponse,
  logApiError,
  configure
} = logger;

/**
 * Logger Usage:
 * 
 * 1. Environment Configuration:
 *    - Set ENABLE_LOGGING=true in your environment to enable logging
 *    - Logging is disabled by default in production environments
 * 
 * 2. Programmatic Control:
 *    - Import { enableLogging } from './logger'
 *    - Call enableLogging(true) to enable logging
 *    - Call enableLogging(false) to disable logging
 * 
 * 3. Using the logger:
 *    - Import logger from './logger'
 *    - Use logger.info(), logger.error(), etc.
 *    - Or import { info, error } from './logger' for direct access
 */

export default logger;