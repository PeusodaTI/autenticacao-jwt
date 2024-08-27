import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z, { ZodError } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userRouter = Router()

userRouter.get('/', async(request, response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return response.status(200).json( users )

    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error', error })
    }
})

userRouter.put('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O parâmetro id é obrigatório e do tipo uuid.'
        }).uuid()
    })

    const bodySchema = z.object({
        name: z.string({
            required_error: 'O campo nome é obrigatório'
        }),
        email: z.string({
            required_error: 'O campo e-mail é obrigatório'
        }).email(),
        password: z.optional(z.string()),
        confirmPassword: z.optional(z.string())
    })

    try {
        const { id } = paramsSchema.parse(request.params)
        const { name, email, password, confirmPassword } = bodySchema.parse(request.body)

        let passwordBody: string

        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) {
            return response.status(400).json({ message: 'Não existe usuário cadastrado com esse id.' })
        }

        if (password) {
            if (password != confirmPassword) {
                return response.status(400).json({ message: 'Os campos de senha e confirmação de senha devem ser iguais.' })
            }
            
            const salt = await bcrypt.genSalt(10)
            passwordBody = await bcrypt.hash(password, salt)

        } else {
            passwordBody = user.password
        }

        await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                password: passwordBody
            }
        })

        return response.status(200).json({ message: 'Usuário atualizado com sucesso.' })

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json({ message: 'Erro de validação.', error })
        }

        return response.status(500).json({ message: 'Internal Server Error.' })
    }
})

userRouter.delete('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O parâmetro id é obrigatório e do tipo uuid.'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) {
            return response.status(400).json({ message: 'Não existe usuário cadastrado com esse id.' })
        }

        await prisma.user.delete({
            where: { id }
        })

        return response.status(200).json({ message: 'Usuário excluído com sucesso.' })

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json({ message: 'Erro de validação.', error })
        }

        return response.status(500).json({ message: 'Internal Server Error.' })
    }
})

export default userRouter