import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import body_parser from 'body-parser'

import * as routes from './routes'

dotenv.config()

const app = express()

app.use(helmet())

app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

app.use(...Object.values(routes))

app.listen(process.env.PORT, () => console.log(`Listening on http://localhost:${process.env.PORT}/`))