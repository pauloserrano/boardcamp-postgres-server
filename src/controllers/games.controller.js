import connection from "../database/db.js";
import { TABLES } from "../enums/tables.js";
import { FIELDS } from "../enums/fields.js";


const { GAMES: FIELD } = FIELDS

const listGames = async (req, res) => {
    const { name } = req.query
    let games

    try {
        if (name){
            const { rows } = await connection.query(`
                SELECT * FROM ${TABLES.GAMES} 
                    WHERE LOWER(${FIELD.NAME}) LIKE $1;
            `, [`${name.toLowerCase()}%`])

            games = rows
        
        } else {
            const { rows } = await connection.query(`
                SELECT * FROM ${TABLES.GAMES}
            `)
            
            games = rows
        }

        res.send(games)
        
    } catch (error) {
        res.status(500).send(error)
    }
}

const insertGame = (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    try {
        connection.query(`
            INSERT INTO ${TABLES.GAMES} (${FIELD.NAME}, ${FIELD.IMAGE}, ${FIELD.STOCK_TOTAL}, ${FIELD.CATEGORY_ID}, ${FIELD.PRICE_PER_DAY}) VALUES ($1, $2, $3, $4, $5);
        `, [name, image, stockTotal, categoryId, pricePerDay])
        
        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error)
    }
}

export { listGames, insertGame }