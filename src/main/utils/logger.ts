interface LogContext {
    [key: string]: any;
}

export class Logger {
    private isDev = process.env.NODE_ENV === 'development';

    info(message: string, context?: LogContext): void {
        console.info(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
    }

    warn(message: string, context?: LogContext): void {
        console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
    }

    error(message: string, error?: Error | string): void {
        console.error(`[ERROR] ${message}`, error instanceof Error ? error.stack : error);
    }

    debug(message: string, context?: LogContext): void {
        console.warn(`[DEBUG] ${message}`, context ? JSON.stringify(context) : '');
    }
}

export const logger = new Logger();
