import moment from 'moment';
import IDatabase from '../../database/IDatabase';
import AppException from '../../exceptions';
import ILogger from '../../logger/ILogger';
import { IAccount } from '../../models/Account';
import Statement, { IStatement, StatementType } from '../../models/Statement';
import IAccountRepository from '../../repositories/Account/IAccount.repository';
import IStatementRepository from './IStatement.repository';

class StatementRepository implements IStatementRepository {
  logger: ILogger
  database: IDatabase
  accountRepository: IAccountRepository

  constructor(logger: ILogger, db: IDatabase, accountRepository: IAccountRepository) {
    this.logger = logger
    this.database = db
    this.accountRepository = accountRepository
  }

  async List(account?: IAccount, type?: StatementType, date?: string): Promise<IStatement[]> {
    let statements = await this.database.List('statements') as IStatement[]

    if (account) {
      statements = statements.filter(s => s.account.uuid === account.uuid)
    }

    if (type) {
      statements = statements.filter(s => s.type === type)
    }

    if (date) {
      statements = statements.filter(s => s.date === date)
    }

    return statements
  }

  async Deposit(account: IAccount, amount: number): Promise<boolean> {
    const accountExists = await this.accountRepository.Get(account.uuid as string)

    if (!amount) {
      throw new AppException('Invalid amount!')
    }

    if (!accountExists) {
      throw new AppException('Account not found!')
    }

    const newStatement = new Statement(
      account,
      amount,
      StatementType.deposit,
      moment().format('YYYY-MM-DD')
    )
    await this.database.Save('statements', newStatement)
    return true
  }

  async Withdraw(account: IAccount, amount: number): Promise<boolean> {
    const accountExists = await this.accountRepository.Get(account.uuid as string)

    if (!amount) {
      throw new AppException('Invalid amount!')
    }

    if (!accountExists) {
      throw new AppException('Account not found!')
    }

    if (await this.GetBalance(account) < amount) {
      throw new AppException('Insuficient funds!')
    }

    const newStatement = new Statement(
      account,
      amount,
      StatementType.withdraw,
      moment().format('YYYY-MM-DD')
    )
    await this.database.Save('statements', newStatement)
    return true
  }

  async Transfer(accountFrom: IAccount, accountTo: IAccount, amount: number): Promise<boolean> {
    const accounts = await this.accountRepository.List()
    const accountFromExists = accounts.find(a => a.uuid === accountFrom.uuid as string)
    const accountToExists = accounts.find(a => a.uuid === accountTo.uuid as string)

    if (!amount) {
      throw new AppException('Invalid amount!')
    }

    if (!accountFromExists) {
      throw new AppException('AccountFrom not found!')
    }

    if (!accountToExists) {
      throw new AppException('AccountTo not found!')
    }

    if (accountFrom.uuid === accountTo.uuid) {
      throw new AppException('Target account must be different from the source account!')
    }

    await this.Withdraw(accountFrom, amount)
    await this.Deposit(accountTo, amount)
    return true
  }

  async GetBalance(account: IAccount): Promise<number> {
    const statements = await this.List(account)
    const balance = statements.reduce((value, s) => {
      return s.type === StatementType.deposit ? value + s.amount: value - s.amount
    }, 0)
    return balance
  }
}

export default StatementRepository