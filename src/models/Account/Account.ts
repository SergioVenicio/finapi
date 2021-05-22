import {v4 as uuidv4} from 'uuid'

import IAccount from './IAccount'
import IAccountDTO from './IAccountDTO'

class Account implements IAccount {
  uuid?: string
  cpf: string
  name: string

  constructor({cpf, name, uuid}: IAccountDTO) {
    this.cpf = cpf
    this.name = name
    this.uuid = uuid ? uuid: uuidv4()
  }
}

export default Account