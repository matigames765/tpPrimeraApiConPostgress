import {Request, Response} from 'express'
import prisma from '../models/user'
import { comparePasswords, hashPassword } from '../services/password.service'
import { generateToken } from '../services/auth.service'

export const getAllUsers = async(req: Request, res: Response): Promise<void> => {
    try{
        const users = await prisma.findMany()

        res.status(200).json(users)
    }catch(error){
        res.status(500).json({message: 'Error en getAllUsers: ' + error})
    }
}

export const getUserById = async(req: Request, res: Response): Promise<void> => {
    try{
        const {id} =  req.params

        const user = await prisma.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!user){
            res.status(404).json({message: "No se encontro el usuario con el id " + id})
            return
        }

        res.status(200).json(user)
    }catch(error){
        res.status(500).json({message:'Error en getUserById: ' + error})
    }
}

export const createUser = async(req: Request, res: Response) => {
    try{
        const {nombre, email, password} = req.body

        if(!nombre || !email || !password){
            res.status(400).json({message: "El nombre, email y contraseñas son obligatorios"})
            return
        }

        const hashPass = await hashPassword(password)
        const user = await prisma.create({
            data:{
                nombre,
                email,
                password: hashPass
            }
        })

        const token = generateToken(user)

        res.status(201).json(token)

    }catch(error: any){
        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({message: "El email ingresado ya esta en uso"})
            return
        }
        res.status(500).json({message:'Error en createUser: ' + error})
    }
}

export const loginUser = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({message: "El nombre, email y contraseñas son obligatorios"})
            return
        }

        const user = await prisma.findUnique({where: {email}})

        if(!user){
            res.status(404).json({message: 'El usuario no se encontro'})
            return
        }

        const passwordMatch = await comparePasswords(password, user!.password)

        if(!passwordMatch){
            res.status(401).json({message: 'El usuario y contraseña no coinciden'})
            return
        }

        const token = generateToken(user)

        res.status(200).json(user)

    }catch(error){
        res.status(500).json({message: 'Error en loginUser: ' + error})
    }
}

export const editUser = async(req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params
        const {nombre, email, password} = req.body

        const hashPass = await hashPassword(password)

        const updatedUser = await prisma.update({
            where: {
                id: Number(id)
            },
            data: {
                nombre,
                email,
                password: hashPass
            }
        })

        res.status(200).json(updatedUser)
    }catch(error){
        res.status(500).json({message:'Error en editUser: ' + error})
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    try{
        const {id} = req.params

        const deleteUser = await prisma.delete({
            where:{
                id: Number(id)
            }
        })

        res.status(200).json(deleteUser)
    }catch(error){
        res.status(500).json({message:'Error en deleteUser: ' + error})
    }
}