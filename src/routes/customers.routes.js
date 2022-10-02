import { Router } from "express";
import { listCustomers, listCustomer, insertCustomer, updateCustomer } from "../controllers/customers.controller.js"
import { validateCustomer, customerExists } from "../middlewares/customer.middlewares.js";

const router = Router()

router.get('/customers', listCustomers)
router.get('/customers/:id', listCustomer)
router.post('/customers', validateCustomer, insertCustomer)
router.put('/customers/:id', customerExists, validateCustomer, updateCustomer)

export default router