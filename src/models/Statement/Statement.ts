import moment from "moment";

import { IAccount } from "models/Account";
import IStatement, { StatementType } from "./IStatement";


class Statement implements IStatement {
  account: IAccount;
  amount: number;
  type: StatementType;
  date: string

  constructor(account: IAccount, amount: number, type: StatementType, date: string) {
    this.account = account
    this.amount = amount
    this.type = type
    this.date = date ? date : moment().format('YYYY-MM-DD')
  }
}

export default Statement