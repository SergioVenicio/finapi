import { Request, Response } from 'express'
import { IAccount } from '../models/Account'
import { StatementType } from '../models/Statement'

import Database from '../database'
import Logger from '../logger'
import AppException from '../exceptions'

import AccountRepository from '../repositories/Account'
import StatementRepository from '../repositories/Statement'

const logger = new Logger('app:accounts')
const db = new Database(logger)
const accountRepository = new AccountRepository(logger, db)
const repository = new StatementRepository(logger, db, accountRepository)


const List = async(req: Request, resp: Response): Promise<void> => {
  const accountId = req.query.account as string
  const type = Number.parseInt(req.query.type as string) || null
  const account = await accountRepository.Get(accountId) || null
  const date = req.query.date as string || null
  resp.json(await repository.List(account, type, date))
}

const Deposit = async(req: Request, resp: Response): Promise<void> => {
  const accountId = req.body.account as string
  const amount = Number.parseFloat(req.body.amount)
  const account = await accountRepository.Get(accountId) as IAccount
  await repository.Deposit(account, amount)
  resp.status(201).json()
}

const Withdraw = async(req: Request, resp: Response): Promise<void> => {
  const accountId = req.body.account as string
  const amount = Number.parseFloat(req.body.amount)
  const account = await accountRepository.Get(accountId) as IAccount
  await repository.Withdraw(account, amount)
  resp.status(201).json()
}

const Transfer = async(req: Request, resp: Response): Promise<void> => {
  const accountFromId = req.body.accountFrom as string
  const accountToId = req.body.accountTo as string
  const amount = Number.parseFloat(req.body.amount)

  const accountFrom = await accountRepository.Get(accountFromId) as IAccount
  if (!accountFrom) {
    throw new AppException('Account From not found!', 404)
  }

  const accountTo = await accountRepository.Get(accountToId) as IAccount
  if (!accountTo) {
    throw new AppException('Account To not found!', 404)
  }

  await repository.Transfer(accountFrom, accountTo, amount)
  resp.status(201).json()
}

const GetBalance = async(req: Request, resp: Response): Promise<void> => {
  const accountId = req.params.uuid as string
  const account = await accountRepository.Get(accountId) as IAccount

  if (!account) {
    throw new AppException('Account not found!', 404)
  }

  resp.status(201).json({ balance: await repository.GetBalance(account) })
}


export { List, Deposit, Withdraw, Transfer, GetBalance}