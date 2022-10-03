import connection from "../database/db.js"
import customerSchema from "../schemas/customer.schema.js"
import { TABLES } from "../enums/tables.js"
import { STATUS } from "../enums/status.js"


const validateCustomer = async (req, res, next) => {
    const { name, phone, cpf, birthday } = req.body

    const isValid = customerSchema.validate({ name, phone, cpf, birthday }, { abortEarly: false })
    if (isValid.error){
        console.log(isValid.error)
        res.status(STATUS.BAD_REQUEST).send(isValid.error.details.map(({message}) => message))
        return
    }

    next()
}


const customerExists = async (req, res, next) => {
    const id = req.params.id || req.body.customerId

    try {
        const { rows: customer } = await connection.query(`
            SELECT * FROM ${TABLES.CUSTOMERS} WHERE id=$1;
        `, [id])


        const notFound = customer.length === 0
        if (notFound){
            res.sendStatus(req.params.id ? STATUS.NOT_FOUND : STATUS.BAD_REQUEST)
            return
        }
        
        next()

    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


export { validateCustomer, customerExists }