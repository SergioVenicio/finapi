import IDatabase from "../../database/IDatabase";
import ILogger from "../../logger/ILogger";
import { IAccount } from "../../models/Account";
import { IStatement, StatementType } from "../../models/Statement";
import IAccountRepository from "../Account/IAccount.repository";

interface IStatementRepository {
  logger: ILogger
  database: IDatabase
  accountRepository: IAccountRepository

  List(account?: IAccount, type?: StatementType, date?: string): Promise<IStatement[]>
  Deposit(account: IAccount, amount: number): Promise<boolean>
  Withdraw(account: IAccount, amount: number): Promise<boolean>
  Transfer(accountFrom: IAccount, accountTo: IAccount, amount: number): Promise<boolean>
  GetBalance(account: IAccount): Promise<number>
}

export default IStatementRepository