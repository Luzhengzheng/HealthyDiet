interface LogContext {
    [key: string]: any;
}

export class Logger {
    private isDev = process.env.NODE_ENV === 'development';

    // TODO: 参考error()和debug() 实现 info() 和 warn() 方法
    info(): void {}

    warn(message: string, context?: LogContext): void {}

    error(message: string, error?: Error | string): void {
        console.error(`[ERROR] ${message}`, error instanceof Error ? error.stack : error);
    }

    debug(message: string, context?: LogContext): void {
        console.warn(`[DEBUG] ${message}`, context ? JSON.stringify(context) : '');
    }
}

export const logger = new Logger();
