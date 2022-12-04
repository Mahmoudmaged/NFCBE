
import { find } from "../../../../DB/DBMethods.js"
import userModel from "../../../../DB/model/User.model.js"
import { asyncHandler } from "../../../services/errorHandling.js"


export const userList = asyncHandler(async (req, res, next) => {
    const users = await find({
        model: userModel,
        filter: { role: "User" },
        select: "-password"
    })
    return res.status(200).json({ message: `Done`, users })
})


export const blockUser = asyncHandler(async (req, res, next) => {

    const user = await userModel.findOneAndUpdate({ _id: req.params.id, role: 'User' }, { blocked: true }, { new: true })
    return user ? res.status(200).json({ message: `Done` }) : next(new Error("in-valid user ID", { cause: 404 }))
})

export const unblockUser = asyncHandler(async (req, res, next) => {
    const { id } = req.body
    const user = await userModel.findByIdAndUpdate(
        { _id: id, role: 'User' },
        { blocked: false },
        { new: true })
    if (user) {
        return res.status(200).json({ message: "Done" })
    } else {
        return next(new Error('In-valid ID', { cause: 400 }))
    }
})

