import IDatabase from "database/IDatabase"
import ILogger from "../../logger/ILogger"
import IAccount from "../../models/Account/IAccount"
import IAccountDTO from "../../models/Account/IAccountDTO"


interface IAccountRepository {
  logger: ILogger
  database: IDatabase

  Get(uuid: string): Promise<IAccount | null>
  List(): Promise<IAccount[]>
  NewAccount(account: IAccountDTO): Promise<IAccount | null>
  Delete(uuid: string): Promise<void>
  validateDTO(account: IAccountDTO): Promise<boolean>
}


export default IAccountRepository