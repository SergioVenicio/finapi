import IDatabase from 'database/IDatabase'
import ILogger from 'logger/ILogger'
import AppException from '../../exceptions'
import Account, { IAccount } from '../../models/Account'
import IAccountDTO from '../../models/Account'
import IAccountRepository from './IAccount.repository'


class AccountRepository implements IAccountRepository {
  logger: ILogger
  database: IDatabase

  constructor(logger: ILogger, db: IDatabase) {
    this.logger = logger
    this.database = db
  }

  async validateDTO(account: IAccountDTO): Promise<boolean> {
    if (!account.name) {
      throw new AppException('Invalid account, name field is required!')
    }
    if (!account.cpf) {
      throw new AppException('Invalid account, cpf field is required!')
    }

    return true
  }

  async Get(uuid: string): Promise<IAccount | null> {
    const accounts = await this.List() 
    const account = await accounts.find(c => c.uuid === uuid) || null
    return account
  }

  async Delete(uuid: string): Promise<void> {
    const accounts = await this.List() 
    const account = await accounts.find(c => c.uuid === uuid) || null
    if (!account) {
      throw new AppException('Account not found!', 404)
    }
    this.database.Delete('accounts', 'uuid', uuid)
  }

  async List(): Promise<IAccount[]> {
    return await this.database.List('accounts') as IAccount[]
  }

  async NewAccount(account: IAccountDTO): Promise<IAccount | null> {
    if (!await this.validateDTO(account)) {
      return null
    }

    const accounts = await this.List()
    if (accounts.some(c => c.cpf === account.cpf)) {
      throw new AppException("This account already exists!")
    }
    
    const newAccount = new Account(account)
    await this.database.Save('accounts', newAccount)
    return newAccount
  }
}

export default AccountRepository