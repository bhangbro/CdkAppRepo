enum LogLevel {
    DEBUG,
    INFO,
    ERROR 
}
type LogLevelStrings = keyof typeof LogLevel;

const LOG_LEVEL_STRING: LogLevelStrings = <LogLevelStrings> process.env.LOG_LEVEL ?? "INFO";
const LOG_LEVEL: LogLevel = LogLevel[LOG_LEVEL_STRING];

export default {
    shouldLog(inputLevel: LogLevel): boolean {
        return inputLevel >= LOG_LEVEL;
    },
    debug(message?: any) {
        if (this.shouldLog(LogLevel.DEBUG)) { console.debug(message) }
    },
    info(message?: any) {
        if (this.shouldLog(LogLevel.INFO)) { console.info(message) }
    },
    error(message?: any) {
        if (this.shouldLog(LogLevel.ERROR)) { console.error(message) }
    }
}