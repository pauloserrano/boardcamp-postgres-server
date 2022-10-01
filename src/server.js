import express, { json } from "express";
import cors from "cors"
import dotenv from "dotenv"
import categoriesRouter from "./routes/categories.routes.js"
dotenv.config()


const PORT = process.env.PORT || 4000
const app = express()
app.use(cors(), json())
app.use(categoriesRouter)

app.get('/status', (req, res) => res.send('OK!'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))