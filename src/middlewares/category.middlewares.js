import connection from "../database/db.js"
import categorySchema from "../schemas/category.schema.js"
import { TABLES } from "../enums/tables.js"
import { FIELDS } from "../enums/fields.js"


const { CATEGORIES: FIELD } = FIELDS

const validateCategory = async (req, res, next) => {
    const { name } = req.body

    const isValid = categorySchema.validate({ name })
    if (isValid.error){
        res.status(400).send(isValid.error.details.map(({ message }) => message))
        return
    }

    try {
        const { rows: category } = await connection.query(`
            SELECT * FROM ${TABLES.CATEGORIES} WHERE ${FIELD.NAME}=$1;
            `, [name])
        
        const isDuplicate = category.length !== 0
        if (isDuplicate){
            res.sendStatus(409)
            return
        }

        next()
        
    } catch (error) {
        res.status(500).send(error)
    }
}

export { validateCategory }