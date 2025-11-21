interface LogContext {
    [key: string]: any;
}

export class Logger {
    info(): void {}

    warn(): void {}

    error(): void {}

    debug(): void {}
}

export const logger = new Logger();
