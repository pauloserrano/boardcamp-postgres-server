import connection from "../database/db.js"
import gameSchema from "../schemas/game.schema.js"
import { TABLES } from "../enums/tables.js"
import { FIELDS } from "../enums/fields.js"


const { GAMES: FIELD } = FIELDS

const validateGame = async (req, res, next) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    const isValid = gameSchema.validate({ name, image, stockTotal, categoryId, pricePerDay })

    if (isValid.error){
        res.status(400).send(isValid.error.details.map(({message}) => message))
        return
    }

    try {
        const { rows: category } = await connection.query(`
            SELECT * FROM ${TABLES.CATEGORIES} WHERE id=$1;
        `, [categoryId])
    
        const isCategoryValid = category.length !== 0
        if (!isCategoryValid){
            res.sendStatus(400)
            return
        }

        const { rows: game } = await connection.query(`
            SELECT * FROM ${TABLES.GAMES} WHERE ${FIELD.NAME}=$1
        `, [name])

        const isDuplicate = game.length !== 0
        if (isDuplicate){
            res.sendStatus(409)
            return
        }

        next()
        
    } catch (error) {
        res.status(500).send(error)
    }
}

export { validateGame }