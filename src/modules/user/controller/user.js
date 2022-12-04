import { findById, findOne, findOneAndUpdate, updateOne } from "../../../../DB/DBMethods.js"
import userModel from "../../../../DB/model/User.model.js"
import cloudinary from "../../../services/cloudinary.js"
import { asyncHandler } from "../../../services/errorHandling.js"
import bcrypt from 'bcryptjs'
import e from "express"
export const userProfile = asyncHandler(async (req, res, next) => {
    const user = await findById({
        model: userModel,
        filter: req.user._id
    })
    return user ? res.status(200).json({ message: `Done`, user }) : next(new Error('In-valid user', { cause: 404 }))
})

export const userSharedProfile = asyncHandler(async (req, res, next) => {
    const user = await findById({
        model: userModel,
        filter: req.params.id,
        select: "-password"
    })
    if (!user) {
        return next(new Error('In-valid user', { cause: 404 }))
    } else {
        if (req.query.to == 'FE') {
            return res.status(200).redirect(`${process.env.FEURL}#/user/${user._id}/shared`)

        } else {
            return res.status(200).json({ message: `Done`, user })

        }
    }
})

export const basicInfo = asyncHandler(async (req, res, next) => {

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `NFC_CARD/user/${req.user._id}` })
        req.body.image = secure_url;
        req.body.imagePublicId = public_id
    }
    const user = await findOneAndUpdate({
        model: userModel,
        filter: req.user._id,
        data: req.body,
        options: { new: false }
    })
    if (!user) {
        await cloudinary.uploader.destroy(req.body.imagePublicId)
        return next(new Error('Fail to update', { cause: 400 }))
    } else {
        if (user.imagePublicId) {
            await cloudinary.uploader.destroy(user.imagePublicId)
        }
        return res.status(200).json({ message: `Done`, user })
    }

})

export const socialLinks = asyncHandler(async (req, res, next) => {

    const user = await findOneAndUpdate({
        model: userModel,
        filter: req.user._id,
        data: { socialLinks: req.body.links },
        options: { new: true }
    })
    if (!user) {
        return next(new Error('Fail to update', { cause: 400 }))
    } else {
        return res.status(200).json({ message: `Done`, user })
    }

})


export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const user = await findOne({
        model: userModel,
        filter: { _id: req.user._id }
    })
    if (!user) {
        return next(new Error('Not register user', { cause: 400 }))
    }

    const match = bcrypt.compareSync(oldPassword, user.password)
    if (!match) {
        return next(new Error('Wrong old Password', { cause: 400 }))
    }

    const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SaltRound))
    await updateOne({
        model: userModel,
        filter: { _id: user._id },
        data: { password: hashPassword }
    })
    return res.status(200).json({ message: "Done" })
})