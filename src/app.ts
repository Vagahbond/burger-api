import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'

import * as db from './db'

import * as middlewares from './middlewares'
import * as routes from './routes'
import * as models from './models'

dotenv.config()
db.connect()

const app = express()

app.use(helmet())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

async function main() {
    await models.config.update_setup_check()

    app.use(...Object.values(middlewares))
    app.use(...Object.values(routes))

    if (!process.env.TEST_RUN) {
        app.listen(process.env.PORT, () => console.log(`Listening on http://localhost:${process.env.PORT}/`))
    }
}

export const loading = main()

export default app
