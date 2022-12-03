import { findById, findOneAndUpdate } from "../../../../DB/DBMethods.js"
import userModel from "../../../../DB/model/User.model.js"
import cloudinary from "../../../services/cloudinary.js"
import { asyncHandler } from "../../../services/errorHandling.js"


export const userProfile = asyncHandler(async (req, res) => {
    const user = await findById({
        model: userModel,
        filter: req.user._id
    })
    console.log(user);
    return user ? res.status(200).json({ message: `Done`, user }) : nex(new Error('In-valid user', { cause: 404 }))
})

export const userSharedProfile = asyncHandler(async (req, res) => {
    const user = await findById({
        model: userModel,
        filter: req.params.id,
        select: "-password"
    })
    return user ? res.status(200).json({ message: `Done`, user }) : nex(new Error('In-valid user', { cause: 404 }))
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
        console.log(user.imagePublicId);
        if (user.imagePublicId) {
            await cloudinary.uploader.destroy(user.imagePublicId)
        }
        return res.status(200).json({ message: `Done`, user })
    }

})

export const socialLinks = asyncHandler(async (req, res, next) => {
    console.log(req.body.links);
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