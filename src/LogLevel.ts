import { UniverseLogError } from "./error/UniverseLogError";

export enum LogLevel {
    error = "error",
    warn = "warn",
    info = "info",
    http = "http",
    verbose = "verbose",
    debug = "debug",
    silly = "silly",
}

export namespace LogLevel {
    export const LEVELS_VALUES: { [x: string]: number } = {
        [LogLevel.error]: 0,
        [LogLevel.warn]: 1,
        [LogLevel.info]: 2,
        [LogLevel.http]: 3,
        [LogLevel.verbose]: 4,
        [LogLevel.debug]: 5,
        [LogLevel.silly]: 6,
    };

    export const LEVELS_BY_NAME: { [x: string]: LogLevel } = {
        [LogLevel.error]: LogLevel.error,
        [LogLevel.warn]: LogLevel.warn,
        [LogLevel.info]: LogLevel.info,
        [LogLevel.http]: LogLevel.http,
        [LogLevel.verbose]: LogLevel.verbose,
        [LogLevel.debug]: LogLevel.debug,
        [LogLevel.silly]: LogLevel.silly,
    };

    export const DEFAULT_LEVEL: LogLevel = LogLevel.info;

    export function valueOf(name: string): LogLevel {
        if (typeof LEVELS_BY_NAME[name] === "undefined") {
            const availableLevels = Object.keys(LEVELS_BY_NAME).join(",");
            throw new UniverseLogError(
                `There is no such log level: '${name}'. Available levels: [ ${availableLevels} ]`,
            );
        }
        return LEVELS_BY_NAME[name];
    }

    export function moreVerbose(a: LogLevel, b: LogLevel): LogLevel {
        return LEVELS_VALUES[a] > LEVELS_VALUES[b] ? a : b;
    }

    export function lessVerbose(a: LogLevel, b: LogLevel): LogLevel {
        return LEVELS_VALUES[a] < LEVELS_VALUES[b] ? a : b;
    }
}
