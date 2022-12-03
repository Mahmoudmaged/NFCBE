import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./user.endPoint.js";
import * as user from './controller/user.js'
import { fileValidation, myMulter } from "../../services/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './user.validation.js'
const router = Router()




router.get('/profile', auth(endPoint.profile), user.userProfile)
router.get('/profile/:id/shared', user.userSharedProfile)


router.put('/',
    auth(endPoint.profile),
    myMulter(fileValidation.image).single('image'),
    validation(validators.basicInfo),
    user.basicInfo)


router.patch('/socialLinks',
    auth(endPoint.profile),
    validation(validators.socialLinks),
    user.socialLinks)


export default router