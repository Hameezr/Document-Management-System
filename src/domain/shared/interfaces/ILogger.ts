export interface ILogger {
    setContext(ctx: string): void;
    debug(...data: any[]): void;
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
}
