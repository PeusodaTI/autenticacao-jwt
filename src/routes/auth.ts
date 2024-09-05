import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z, { ZodError } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const authRouter = Router()

authRouter.post('/register', async(request, response) => {
    const bodySchema = z.object({
        name: z.string({
            required_error: 'O campo nome é obrigatório'
        }),
        email: z.string({
            required_error: 'O campo e-mail é obrigatório'
        }).email(),
        password: z.string({
            required_error: 'O campo password é obrigatório'
        }),
        confirmPassword: z.string({
            required_error: 'O campo confirmPassword é obrigatório'
        })
    })

    try {
        const { name, email, password, confirmPassword } = bodySchema.parse(request.body)

        if (password != confirmPassword) {
            return response.status(400).json({ message: 'Os campos password e confirmPassword devem ser iguais.' })
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (user) {
            return response.status(400).json({ message: 'Já existe um usuário cadastrado com este e-mail.' })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        
        const userCreate = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash
            }
        })

        return response.status(201).json({ message: 'Usuário criado com sucesso.' })

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json({ message: 'Error de validação.', error })
        }

        return response.status(500).json({ message: 'Internal Server Error.', error })
    }
})

authRouter.post('/login', async(request, response) => {
    const bodySchema = z.object({
        email: z.string({
            required_error: 'O campo e-mail é obrigatório.'
        }).email(),
        password: z.string({
            required_error: 'O campo password é obrigatório.'
        })
    })

    try {
        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return response.status(404).json({ message: 'Não existe usuário cadastrado com esse e-mail.' })
        }

        const checkedPassword = await bcrypt.compare(password, user.password)

        if (!checkedPassword) {
            return response.status(401).json({ message: 'Senha invalida.' })
        }

        const secret: string = process.env.SECRET || ""
        
        if (secret === "") {
            return response.status(400).json({ message: 'Erro ao tentar realizar login, tente novamente.' })
        }

        const token = jwt.sign(
            {
                id: user.id,
                userName: user.name,
                expiresIn: '30 days'
            },
            secret
        )

        return response.status(200).json({ message: 'Autenticação realizada com sucesso.', token })

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json({ message: 'Erro de validação.', error })
        }

        return response.status(500).json({ message: 'Internal Server Error.', error })
    }
})

export default authRouter