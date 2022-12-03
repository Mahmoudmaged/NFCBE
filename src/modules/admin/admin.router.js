import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import endPoint from "./brand.endPoint.js";
import * as brand from './controller/brand.js'

const router = Router({})


router.get('/', brand.Brands)






export default router