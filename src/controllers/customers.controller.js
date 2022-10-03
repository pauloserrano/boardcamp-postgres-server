import connection from "../database/db.js"
import { TABLES } from "../enums/tables.js"
import { FIELDS } from "../enums/fields.js"
import { STATUS } from "../enums/status.js"


const { CUSTOMERS: FIELD } = FIELDS

const listCustomers = async (req, res) => {
    const { cpf } = req.query
    
    try {
        let customers

        if (!cpf){
            const { rows } = await connection.query(`
                SELECT * FROM ${TABLES.CUSTOMERS};
            `)
            customers = rows.map(row => ({
                ...row,
                birthday: row.birthday.toISOString().slice(0, 10)
            }))
        
        } else {
            const { rows } = await connection.query(`
                SELECT * FROM ${TABLES.CUSTOMERS}
                    WHERE ${FIELD.CPF} LIKE $1;
            `, [`${cpf}%`])
            
            customers = rows.map(row => ({
                ...row,
                birthday: row.birthday.toISOString().slice(0, 10)
            }))
        }


        res.send(customers)

    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


const listCustomer = async (req, res) => {
    const { id } = req.params

    try {
        const { rows: customer } = await connection.query(`
            SELECT * FROM ${TABLES.CUSTOMERS} WHERE id=$1;
        `, [id])


        const notFound = customer.length === 0
        if (notFound){
            res.sendStatus(STATUS.NOT_FOUND)
            return
        }

        res.send(customer.map(data => ({
            ...data,
            birthday: data.birthday.toISOString().slice(0, 10)
        })))

    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


const insertCustomer = async (req, res) => {
    const { name, phone, cpf } = req.body
    const birthday = new Date(req.body.birthday).toISOString().slice(0, 10)
    
    try {
        const { rows: customer } = await connection.query(`
            SELECT * FROM ${TABLES.CUSTOMERS} WHERE ${FIELD.CPF}=$1;
        `, [cpf])


        const isDuplicate = customer.length !== 0
        if (isDuplicate){
            res.sendStatus(STATUS.CONFLICT)
            return
        }

        connection.query(`
            INSERT INTO ${TABLES.CUSTOMERS} (${FIELD.NAME}, ${FIELD.PHONE}, ${FIELD.CPF}, ${FIELD.BIRTHDAY}) VALUES ($1, $2, $3, $4);
        `, [name, phone, cpf, birthday])

        res.sendStatus(STATUS.CREATED)
        
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


const updateCustomer = async (req, res) => {
    const { id } = req.params
    const { name, phone, cpf, birthday } = req.body

    try {        
        connection.query(`
            UPDATE ${TABLES.CUSTOMERS} SET ${FIELD.NAME}=$1, ${FIELD.PHONE}=$2, ${FIELD.CPF}=$3, ${FIELD.BIRTHDAY}=$4
                WHERE id=$5
        `, [name, phone, cpf, birthday, id])

        res.send(STATUS.OK)

    } catch (error) {
        res.status(STATUS.SERVER_ERROR).send(error)
    }
}


export { listCustomers, listCustomer, insertCustomer, updateCustomer }