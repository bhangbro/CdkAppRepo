package io.mycdkapp.common.debug

object Log {
    private val logLevel by lazy {
        if (System.getenv("LOG_LEVEL").isNullOrBlank())
            LogLevel.INFO
        else
            LogLevel.valueOf(System.getenv("LOG_LEVEL"))
    }

    enum class LogLevel(val value: Int) {
        DEBUG(1),
        INFO(2),
        ERROR(3)
    }

    private fun log(level: LogLevel, message: String) {
        if (logLevel.value <= level.value) println("[${level.name}] $message")
    }

    fun debug(message: String) {
        log(LogLevel.DEBUG, message)
    }

    fun info(message: String) {
        log(LogLevel.INFO, message)
    }

    fun error(message: String) {
        log(LogLevel.ERROR, message)
    }
}