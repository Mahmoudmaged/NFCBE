import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import * as indexRouter from './src/modules/index.router.js'
import connectDB from './DB/connection.js'
import { globalErrorHandling } from './src/services/errorHandling.js'
import morgan from 'morgan'
import cors from 'cors'
//convert Buffer Data
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
// setup port and the baseUrl
const port = process.env.PORT || 3000
const baseUrl = process.env.BASEURL


if (process.env.MOOD === 'DEV') {
    app.use(morgan("dev"))
} else {
    app.use(morgan("combined"))
}

//Setup API Routing 
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/user`, indexRouter.userRouter)

app.use('*', (req, res, next) => {
    res.status(404).json("In-valid Routing Plz check url  or  method")
})
app.use(globalErrorHandling)
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))