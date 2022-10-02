import connection from "../database/db.js";
import { TABLES } from "../enums/tables.js";
import { FIELDS } from "../enums/fields.js";


const { GAMES, CATEGORIES } = FIELDS

const listGames = async (req, res) => {
    const { name } = req.query
    let games

    try {
        if (name){
            const { rows } = await connection.query(`
                SELECT ${TABLES.GAMES}.*, ${TABLES.CATEGORIES}.${CATEGORIES.NAME} as "categoryName" FROM ${TABLES.GAMES} 
                    JOIN ${TABLES.CATEGORIES} ON ${TABLES.GAMES}.${GAMES.CATEGORY_ID}=${TABLES.CATEGORIES}.id
                        WHERE LOWER(${TABLES.GAMES}.${GAMES.NAME}) LIKE $1;
            `, [`${name.toLowerCase()}%`])

            games = rows
        
        } else {
            const { rows } = await connection.query(`
                SELECT ${TABLES.GAMES}.*, ${TABLES.CATEGORIES}.${CATEGORIES.NAME} as "categoryName" FROM ${TABLES.GAMES} 
                    JOIN ${TABLES.CATEGORIES} ON ${TABLES.GAMES}.${GAMES.CATEGORY_ID}=${TABLES.CATEGORIES}.id
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
            INSERT INTO ${TABLES.GAMES} (${GAMES.NAME}, ${GAMES.IMAGE}, ${GAMES.STOCK_TOTAL}, ${GAMES.CATEGORY_ID}, ${GAMES.PRICE_PER_DAY}) VALUES ($1, $2, $3, $4, $5);
        `, [name, image, stockTotal, categoryId, pricePerDay])
        
        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error)
    }
}

export { listGames, insertGame }