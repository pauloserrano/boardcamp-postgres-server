import connection from "../database/db.js"
import { TABLES } from "../enums/tables.js"
import { FIELDS } from "../enums/fields.js"
import { STATUS } from "../enums/status.js"


const { CATEGORIES, CUSTOMERS, GAMES, RENTALS } = FIELDS

const listRentals = async (req, res) => {
    const { customerId, gameId } = req.query

    try {
        const { rows } = await connection.query(`
            SELECT ${TABLES.RENTALS}.*, ${TABLES.CUSTOMERS}.${CUSTOMERS.NAME} as "customerName", ${TABLES.GAMES}.${GAMES.CATEGORY_ID}, ${TABLES.GAMES}.${GAMES.NAME} as "gameName", ${TABLES.CATEGORIES}.${CATEGORIES.NAME} as "categoryName" FROM ${TABLES.RENTALS}
                JOIN ${TABLES.CUSTOMERS} ON ${TABLES.RENTALS}."customerId"=${TABLES.CUSTOMERS}.id
                JOIN ${TABLES.GAMES} ON ${TABLES.RENTALS}."gameId"=${TABLES.GAMES}.id 
                JOIN ${TABLES.CATEGORIES} ON ${TABLES.GAMES}."categoryId"=${TABLES.CATEGORIES}.id;
        `)

        let rentals = rows.map((rental) => {
            const { id, categoryId, categoryName, customerId, customerName, gameId, gameName, rentDate, daysRented, returnDate, originalPrice, delayFee, } = rental

            return {
                id, customerId, gameId, daysRented, originalPrice, delayFee, 
                rentDate: rentDate.toISOString().slice(0, 10),
                returnDate: returnDate ? returnDate.toISOString().slice(0, 10) : returnDate,
                customer: { id: customerId, name: customerName },
                game: { id: gameId, name: gameName, categoryId, categoryName }
            }
        })

        if (customerId){
            rentals = rentals.filter(({ customer: { id } }) => +customerId === +id)
        }

        if (gameId){
            rentals = rentals.filter(({ game: { id } }) => +gameId === +id)
        }

        res.status(STATUS.OK).send(rentals)
        
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


const insertRental = (req, res) => {
    const { customerId, gameId, daysRented, returnDate, delayFee, originalPrice, rentDate } = res.locals.rental

    try {
        connection.query(`
            INSERT INTO ${TABLES.RENTALS} (${RENTALS.CUSTOMER_ID}, ${RENTALS.GAME_ID}, ${RENTALS.DAYS_RENTED}, ${RENTALS.RETURN_DATE}, ${RENTALS.DELAY_FEE}, ${RENTALS.ORIGINAL_PRICE}, ${RENTALS.RENT_DATE}) VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, daysRented, returnDate, delayFee, originalPrice, rentDate])
        
        res.sendStatus(STATUS.CREATED)
        
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


const returnRental = async (req, res) => {
    const { id } = req.params
    const { rental } = res.locals
    
    let delayFee = 0
    const rentDate = rental.rentDate.toISOString().slice(0, 10)
    const returnDate = new Date().toISOString().slice(0, 10)

    const MILISECONDS_TO_DAYS = (1000 * 3600 * 24)
    const daysSinceRent = Math.ceil((Date.parse(returnDate) - Date.parse(rentDate)) / MILISECONDS_TO_DAYS)

    try {
        if (daysSinceRent > rental.daysRented){
            const { rows } = await connection.query(`
                SELECT ${GAMES.PRICE_PER_DAY} FROM ${TABLES.GAMES}
                    WHERE id=$1;
            `, [rental.gameId])

            const pricePerDay = rows[0].pricePerDay
            delayFee = (daysSinceRent - rental.daysRented) * pricePerDay
        }
        
        connection.query(`
            UPDATE ${TABLES.RENTALS} SET ${RENTALS.RETURN_DATE}=$1, ${RENTALS.DELAY_FEE}=$2
                WHERE id=$3;
        `, [returnDate, delayFee, id])

        res.sendStatus(STATUS.OK)
        
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


const deleteRental = (req, res) => {
    const { id } = req.params
    const isReturned = res.locals.rental.returnDate !== null
    
    if (!isReturned){
        res.sendStatus(STATUS.BAD_REQUEST)
        return
    }

    try {
        connection.query(`
            DELETE FROM ${TABLES.RENTALS}
                WHERE id=$1;
        `, [id])

        res.sendStatus(STATUS.OK)

    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


export { listRentals, insertRental, returnRental, deleteRental }