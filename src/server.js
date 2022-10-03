import express, { json } from "express";
import cors from "cors"
import dotenv from "dotenv"
import categoriesRouter from "./routes/categories.routes.js"
import gamesRouter from "./routes/games.routes.js"
import customersRouter from "./routes/customers.routes.js"
import rentalsRouter from "./routes/rentals.routes.js"
dotenv.config()


const PORT = process.env.PORT || 4000
const app = express()
app.use(cors(), json())
app.use(categoriesRouter, gamesRouter, customersRouter, rentalsRouter)

app.get('/status', (req, res) => res.send('OK!'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))