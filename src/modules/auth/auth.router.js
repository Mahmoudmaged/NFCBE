import * as registerController from './controller/registration.js'
import * as validators from './auth.validation.js'
import { Router } from "express";
import { validation } from '../../middleware/validation.js';

const router = Router()

//signup&confirmEmail
router.post('/signup', validation(validators.signup), registerController.signup)

router.get('/confirmEmail/:token', validation(validators.token), registerController.confirmEmail)
router.get('/refreshToken/:token', validation(validators.token), registerController.refreshToken)

//login
router.post('/login', validation(validators.login), registerController.login)


//forgetPassword
router.patch("/sendCode", validation(validators.sendCode), registerController.sendCode)
router.patch("/forgetPassword", validation(validators.forgetPassword), registerController.forgetPassword)


export default router