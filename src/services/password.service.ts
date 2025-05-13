import bcrypt from 'bcrypt'
import { PassThrough } from 'stream'

const SALT_ROUNDS: number = 10

export const hashPassword = async(password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}