import {Request, Response} from 'express'

import Database from "../database"
import Logger from "../logger"
import AccountRepository from "../repositories/Account"
import { IAccountDTO } from '../models/Account'

const logger = new Logger('app:accounts')
const db = new Database(logger)
const repository = new AccountRepository(logger, db)

const Get = async (req: Request, resp: Response): Promise<Response> => {
  const uuid = req.params.uuid
  return resp.json(await repository.Get(uuid))
}

const Delete = async (req: Request, resp: Response): Promise<Response> => {
  const uuid = req.params.uuid
  return resp.json(await repository.Delete(uuid))
}

const List = async (_: Request, resp: Response): Promise<void> => {
  resp.json(await repository.List())
}

const Create = async (req: Request, resp: Response): Promise<void> => {
  const {name, cpf} = req.body

  const newAccount = await repository.NewAccount({name, cpf} as IAccountDTO)
  resp.status(201).json(newAccount)
}

export {Get, List, Create, Delete}