import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth'
import { authMiddleware } from './middleware/authMiddleware'
import userRouter from './routes/user'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'

const app = express()

app.use(express.json())

app.use(cors())

//Documentação SwaggerUi
app.use('/docs-api', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//Rotas públicas
app.use('/v1/auth', authRouter)

//Rotas privadas (token)
app.use(authMiddleware)
app.use('/v1/users', userRouter)

app.listen(3333, () => {
    console.log('App em execução.')
})