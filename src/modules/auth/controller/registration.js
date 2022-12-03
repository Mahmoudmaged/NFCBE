import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findOne, findOneAndUpdate, updateOne } from '../../../../DB/DBMethods.js'
import userModel from '../../../../DB/model/User.model.js'
import { sendEmail } from '../../../services/email.js'
// import asyncHandler from 'express-async-handler'
import { asyncHandler } from '../../../services/errorHandling.js'
export const signup = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password } = req.body
        const user = await findOne({ model: userModel, filter: { email }, select: 'email' })
        if (user) {
            next(Error('Email Exist', { cause: 409 }))
        } else {
            const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND))
            const newUser = new userModel({ userName, email, password: hash })

            const token = jwt.sign({ id: newUser._id }, process.env.emailToken, { expiresIn: '1h' })
            const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            const tokenRF = jwt.sign({ id: newUser._id }, process.env.emailToken)
            const linkRF = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshToken/${tokenRF}`

            const message = `
            <a href='${link}'>ConfirmEmail </a>
            <br>
            <a href='${linkRF}'>Request new confirmation email </a>
            `
            const info = await sendEmail(email, 'Confirm Email', message)
            console.log(info);
            if (info?.accepted?.length) {
                const savedUser = await newUser.save()
                res.status(201).json({ message: "Done", savedUerID: savedUser._id })
            } else {
                next(Error('Email rejected', { cause: 400 }))

            }

        }
    }
)

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.emailToken)
    if (!decoded?.id) {
        next(new Error('In-valid Payload', { cause: 400 }))
    } else {
        const user = await findOneAndUpdate({
            model: userModel,
            filter: { _id: decoded.id, confirmEmail: false },
            data: { confirmEmail: true },
            options: { new: true },
        })
        res.status(200).redirect(process.env.FEURL)
    }
})

export const refreshToken = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.emailToken)
    if (!decoded?.id) {
        next(new Error('In-valid Payload', { cause: 400 }))
    } else {
        const user = await findOne({
            model: userModel,
            filter: { _id: decoded.id },
        })
        if (user && !user.confirmEmail) {
            const token = jwt.sign({ id: user._id }, process.env.emailToken, { expiresIn: '1h' })
            const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            const message = `
            <a href='${link}'>ConfirmEmail </a>
            `
            const info = await sendEmail(user.email, 'Confirm Email', message)
            res.status(200).send("<h1>Check your Email now</h1>")
        } else {
            res.status(200).redirect(process.env.FEURL)
        }
    }
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await findOne({ model: userModel, filter: { email } })
    if (!user) {
        next(new Error("Email not Exist", { cause: 404 }))
    } else {
        if (!user.confirmEmail) {
            next(new Error("Email not confirmed yet", { cause: 400 }))
        } else {
            const match = bcrypt.compareSync(password, user.password)
            if (!match) {
                next(new Error("In-valid Password", { cause: 400 }))
            } else {
                const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature, { expiresIn: 60 * 60 * 24 })
                res.status(200).json({ message: "Done", token })
            }
        }
    }
})



export const sendCode = async (req, res) => {
    const { email } = req.body
    console.log({ email });
    const user = await userModel.findOne({ email }).select('email')
    if (!user) {
        return next(new Error('Not register user', { cause: 404 }))
    } else {
        const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        await updateOne({
            model: userModel,
            filter: { _id: user._id },
            data: { code }
        })
        await sendEmail(user.email,
            'forget password', `<h1> Please Use this code : ${code} to reset u password</h1>`)
        return res.status(200).json({ message: "Done" })
    }
}


export const forgetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        res.json({ message: "Not register account" })
    } else {
        if (user.code != code || code == null) {
            return next(new Error('In-valid Code', { cause: 400 }))
        } else {
            const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.SaltRound))
            await updateOne({
                model: userModel,
                filter: { _id: user._id },
                data: { password: hashPassword, code: null }
            })
            return res.status(200).json({ message: "Done" })
        }
    }
}