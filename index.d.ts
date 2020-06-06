declare module "apollo-log" {
  type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "silent";

  export interface LoggerOptions {
    level?: LogLevel;
    mutate?: (level: LogLevel, data: Record<string, string> | string) => void;
    prefix?: string;
    timestamp?: boolean;
  }

  export class ApolloLogExtension {
    constructor(options: LoggerOptions);
  }
}
