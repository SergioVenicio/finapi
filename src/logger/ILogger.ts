import debug from 'debug'

interface ILogger {
  logger: debug.Debugger
  errorDebug: debug.Debugger
  info(message: string): void
  error(message: string): void
}

export default ILogger