import supertest from 'supertest'

import app, { loading } from '../src/app'
import db from '../src/db'

before(async () => {
    await loading
})

after(async () => {
    await db.disconnect()
})

describe("Register a new user", () => {
    const credentials = {
        email: 'test@test.com',
        password: 'testpass',
    }

    it("it should has status code 200", (done) => {
        supertest(app)
            .post("/auth/register")
            .send({
                firstname: 'Tester',
                lastname: 'Test',
                ...credentials,
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it("login should give a token", (done) => {
        supertest(app)
            .post("/auth/login")
            .send(credentials)
            .expect((res) => {
                if (!res.body?.token) throw new Error('No token in response body.')
            })
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
})
