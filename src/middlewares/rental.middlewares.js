import connection from "../database/db.js";
import rentalSchema from "../schemas/rental.schema.js";
import { TABLES } from "../enums/tables.js";
import { STATUS } from "../enums/status.js"

const validateRental = (req, res, next) => {
    const { customerId, gameId, daysRented } = req.body
    const [ returnDate, delayFee ] = [ null, null ]
    const originalPrice = (res.locals.game.pricePerDay * daysRented)
    const rentDate = new Date(Date.now()).toISOString().slice(0, 10)

    res.locals.rental = { customerId, gameId, daysRented, returnDate, delayFee, originalPrice, rentDate }
    
    const isValid = rentalSchema.validate(res.locals.rental, { abortEarly: false })
    if (isValid.error){
        res.status(STATUS.BAD_REQUEST).send(isValid.error.details.map(({message}) => message))
        return
    }

    next()
}


const rentalExists = async (req, res, next) => {
    const { id } = req.params
    
    try {
        const { rows: rental } = await connection.query(`
            SELECT * FROM ${TABLES.RENTALS} WHERE id=$1;
        `, [id])
        
        const notFound = rental.length === 0
        if (notFound){
            res.sendStatus(STATUS.NOT_FOUND)
            return
        }

        res.locals.rental = rental[0]

        next()
        
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}

const rentalReturned = async (req, res, next) => {
    const isReturned = res.locals.rental.returnDate
    
    if (isReturned !== null){
        res.sendStatus(STATUS.BAD_REQUEST)
        return
    }
    
    next()
}


export { validateRental, rentalExists, rentalReturned }