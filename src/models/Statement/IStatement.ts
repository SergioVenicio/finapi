import { IAccount } from "models/Account";


enum StatementType {
  'deposit',
  'withdraw',
  'transfer'
}

interface IStatement {
  account: IAccount
  amount: number
  type: StatementType
  date: string
}


export { StatementType }
export default IStatement