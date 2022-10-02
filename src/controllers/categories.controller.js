import connection from "../database/db.js";
import { TABLES } from "../enums/tables.js";
import { FIELDS } from "../enums/fields.js"
import { STATUS } from "../enums/status.js";


const { CATEGORIES: FIELD } = FIELDS

const listCategories = async (req, res) => {
    try {
        const { rows: categories } = await connection.query(`
            SELECT * FROM ${TABLES.CATEGORIES};
        `)
        res.status(STATUS.OK).send(categories)

    } catch (error) {
        res.status(STATUS.BAD_REQUEST).send(error)
    }
}

const insertCategory = (req, res) => {
    const { name } = req.body

    try {
        connection.query(`
            INSERT INTO ${TABLES.CATEGORIES} (${FIELD.NAME}) VALUES ($1);
        `, [name])
        res.sendStatus(STATUS.CREATED)

    } catch (error) {
        res.status(STATUS.BAD_REQUEST).send(error)
    }
}

export { listCategories, insertCategory }