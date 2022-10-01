import { Router } from "express";
import { listCategories, insertCategory } from "../controllers/categories.controller.js";
import { validateCategory } from "../middlewares/category.middlewares.js";

const router = Router()

router.get('/categories', listCategories)
router.post('/categories', validateCategory, insertCategory)

export default router