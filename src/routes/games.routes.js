import { Router } from "express";
import { listGames, insertGame } from "../controllers/games.controller.js";
import { validateGame } from "../middlewares/game.middlewares.js";

const router = Router()

router.get('/games', listGames)
router.post('/games', validateGame, insertGame)

export default router