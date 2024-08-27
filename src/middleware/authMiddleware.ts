import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import jwt, { JwtPayload } from 'jsonwebtoken'

export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers

    if (!authorization) {
        return response.status(401).json({ message: 'Acesso não autorizado.' })
    }

    const token = authorization.split(' ')[1]

    const { id } = jwt.verify(token, process.env.SECRET || "") as JwtPayload

    const loggedUser = await prisma.user.findUnique({
        where: { id }
    })

    if (!loggedUser) {
        return response.status(401).json({ message: 'Acesso não autorizado' })
    }

    next()
}