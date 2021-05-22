import fs from 'fs/promises'
import ILogger from 'logger/ILogger'

import IDatabase from "./IDatabase"

interface IData {
  [key: string]: any
}

class Database implements IDatabase {
  location: string
  logger: ILogger
  _data: IData  = {}

  constructor (logger: ILogger) {
    this.logger = logger
    this.location = './src/database/database.json'
    this._data = {}
  }

  async List(table: string): Promise<any> {
    this.logger.info(`Listing data from ${table}`)
    await this.Load()
    return this._data[`${table}`] || []
  }

  async Save(table: string, data: unknown): Promise<boolean> {
    this.logger.info(`Saving data on ${table}`)
    if (this._data[`${table}`]) {
      this._data[`${table}`].push(data)
    } else {
      this._data[`${table}`] = [data]
    }

    await this.Sync()
    this.logger.info(`Saving data done!`)
    return true
  }

  async Load(): Promise<void> {
    const data = await fs.readFile(this.location, 'utf-8')
    this._data = JSON.parse(data)
  }

  async Delete(table: string, idField: string, idValue: string): Promise<boolean> {
    await this.Load()
    const newData = this._data[`${table}`].filter((obj: any) => obj[`${idField}`] !== idValue)
    this._data[`${table}`] = newData
    await this.Sync()
    return true
  }

  async Sync(): Promise<void> {
    await fs.writeFile(
      this.location,
      JSON.stringify(this._data),
      {'encoding': 'utf-8'}
    )
  }

}

export default Database