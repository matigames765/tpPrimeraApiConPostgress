import { User } from "../interfaces/user.interface"
import jwt from 'jsonwebtoken'

const secret_key = process.env.JWT_SECRET || 'default-key'

export const generateToken = (user: User): string => {

    return jwt.sign({id: user.id, email: user.email}, secret_key, {expiresIn: '1h'})

}