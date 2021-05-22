import debug from 'debug'

import ILogger from './ILogger'


class Logger implements ILogger {
  logger: debug.Debugger
  errorDebug: debug.Debugger

  constructor (namespace: string) {
    this.logger = debug(namespace)
    this.errorDebug = debug(`${namespace}:error`)
  }

  async info (message: string): Promise<void> {
    this.logger(message)
  }

  async error (message: string): Promise<void> {
    this.errorDebug(message)
  }
}

export default Logger