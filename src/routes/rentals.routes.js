import { Router } from "express";
import { rentalExists, rentalReturned, validateRental } from "../middlewares/rental.middlewares.js";
import { insertRental, listRentals, returnRental, deleteRental } from "../controllers/rentals.controller.js";
import { customerExists } from "../middlewares/customer.middlewares.js";
import { gameAvailable, gameExists } from "../middlewares/game.middlewares.js";

const router = Router()

router.get('/rentals', listRentals)
router.post('/rentals', customerExists, gameExists, gameAvailable, validateRental, insertRental)
router.post('/rentals/:id/return', rentalExists, rentalReturned, returnRental)
router.delete('/rentals/:id', rentalExists, deleteRental)

export default router