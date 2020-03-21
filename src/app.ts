import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'

import * as db from './db'

import * as middlewares from './middlewares'
import * as routes from './routes'

dotenv.config()
db.connect()

const app = express()

app.use(helmet())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(...Object.values(middlewares))
app.use(...Object.values(routes))

app.listen(process.env.PORT, () => console.log(`Listening on http://localhost:${process.env.PORT}/`))
