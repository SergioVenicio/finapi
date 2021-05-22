import ILogger from "logger/ILogger";

interface IDatabase {
  location: string
  logger: ILogger

  Load(): void
  Save(table: string, data: unknown): Promise<boolean>
  List(table: string): Promise<any>
  Delete(table: string, idField: string, idValue: string): Promise<boolean>
  Sync(): Promise<void>
}

export default IDatabase
