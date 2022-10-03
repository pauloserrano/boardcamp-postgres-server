import joi from "joi"

const customerSchema = joi.object({
    name: joi.string().required(), 
    phone: joi.string().min(10).max(11).required(), 
    cpf: joi.string().pattern(/^\d{11}$/).required(), 
    birthday: joi.date().iso().max('now').required()
})


export default customerSchema