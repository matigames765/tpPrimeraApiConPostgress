import dotenv from 'dotenv'

dotenv.config()

import express from 'express'

import userRoutes from './routes/userRoutes'

const app = express()

app.use(express.json())


//Routes
//autenticacion
//user
app.use('/', userRoutes)

console.log("Esto esta siendo ejecutado")

export default app