import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth'
import { authMiddleware } from './middleware/authMiddleware'
import userRouter from './routes/user'

const app = express()

app.use(express.json())

app.use(cors())

app.use('/v1/auth', authRouter)
app.use(authMiddleware)
app.use('/v1/users', userRouter)

app.get('/', (request, response) => {
    return response.send('Teste de Integridade Novamente')
})

app.listen(3333, () => {
    console.log('App em execução.')
})