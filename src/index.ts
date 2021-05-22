import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import bodyParser from 'body-parser'

import Logger from './logger'

import { exceptionMiddleware } from './exceptions'

import {
  Get as GetAccount,
  List as ListAccounts,
  Create as CreateAccount,
  Delete as DeleteAccount
} from './routes/accounts'

import {
  Deposit,
  List as ListStatements,
  Transfer,
  Withdraw,
  GetBalance
} from  './routes/statements'


const logger = new Logger('app:main')

const app = express()

const loggerMiddleware = async (req: Request, _: Response, next: NextFunction) => {
  logger.info(`${new Date().toISOString()}: ${req.method}: ${req.originalUrl}`)
  next()
}

app.use(loggerMiddleware)
app.use(bodyParser.json())

app.get('/', async (_: Request, res: Response) => {
  res.json({
    message: 'Hello',
    status: 'OK',
    date: new Date().toISOString()
  })
})

app.get('/accounts', ListAccounts)
app.get('/accounts/:uuid', GetAccount)
app.delete('/accounts/:uuid', DeleteAccount)
app.get('/accounts/:uuid/balance', GetBalance)
app.post('/accounts', CreateAccount)

app.get('/statements', ListStatements)
app.post('/statements/deposit', Deposit)
app.post('/statements/withdraw', Withdraw)
app.post('/statements/transfer', Transfer)

app.use(exceptionMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  await logger.info(`Server listening on :${PORT}`)
})