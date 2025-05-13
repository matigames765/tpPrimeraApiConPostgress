import express from 'express'
import { createUser, deleteUser, editUser, getAllUsers, getUserById } from '../controllers/userController'

const router = express.Router()


router.get('/usuarios', getAllUsers)

router.get('/usuarios/:id', getUserById)

router.post('/usuarios/register', createUser)

router.put('/usuarios/:id', editUser)

router.delete('/usuarios/:id', deleteUser)

export default router

