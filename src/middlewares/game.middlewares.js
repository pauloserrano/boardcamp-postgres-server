import connection from "../database/db.js"
import gameSchema from "../schemas/game.schema.js"
import { TABLES } from "../enums/tables.js"
import { FIELDS } from "../enums/fields.js"
import { STATUS } from "../enums/status.js"


const { GAMES, RENTALS } = FIELDS

const validateGame = async (req, res, next) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    const isValid = gameSchema.validate({ name, image, stockTotal, categoryId, pricePerDay }, { abortEarly: false })

    if (isValid.error){
        res.status(STATUS.BAD_REQUEST).send(isValid.error.details.map(({message}) => message))
        return
    }

    try {
        const { rows: category } = await connection.query(`
            SELECT * FROM ${TABLES.CATEGORIES} WHERE id=$1;
        `, [categoryId])
    
        const isCategoryValid = category.length !== 0
        if (!isCategoryValid){
            res.sendStatus(STATUS.BAD_REQUEST)
            return
        }

        const { rows: game } = await connection.query(`
            SELECT * FROM ${TABLES.GAMES} WHERE ${GAMES.NAME}=$1
        `, [name])

        const isDuplicate = game.length !== 0
        if (isDuplicate){
            res.sendStatus(STATUS.CONFLICT)
            return
        }

        next()
        
    } catch (error) {
        res.status(STATUS.BAD_REQUEST).send(error)
    }
}


const gameExists = async (req, res, next) => {
    const id =  req.params.id || req.body.gameId
    
    try {
        const { rows: game } = await connection.query(`
            SELECT * FROM ${TABLES.GAMES} WHERE id=$1;
        `, [id])
        

        const notFound = game.length === 0
        
        if (notFound){
            res.sendStatus(req.params.id ? STATUS.NOT_FOUND : STATUS.BAD_REQUEST)
            return
        }
        
        res.locals.game = game[0]

        next()

    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


const gameAvailable = async (req, res, next) => {
    const { game: { id: gameId, stockTotal } } = res.locals
    
    try {
        const { rows: rentals } = await connection.query(`
            SELECT * FROM ${TABLES.RENTALS} WHERE ${RENTALS.GAME_ID}=$1;
        `, [gameId])
        
        if (rentals.length >= stockTotal){
            res.sendStatus(STATUS.BAD_REQUEST)
            return
        }
        
        next()
        
    } catch (error) {
        res.status(STATUS.BAD_REQUEST).send(error)
    }
}


export { validateGame, gameExists, gameAvailable }