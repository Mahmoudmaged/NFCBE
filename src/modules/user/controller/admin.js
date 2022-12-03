import { date } from "joi"
import { find, findById, findByIdAndUpdate, findOneAndUpdate } from "../../../../DB/DBMethods.js"
import userModel from "../../../../DB/model/User.model.js"
import { asyncHandler } from "../../../services/errorHandling.js"


export const userList = asyncHandler(async (req, res) => {
    const users = await find({
        model: userModel,
        select: "-password"
    })
    return res.status(200).json({ message: `Done`, users })
})


export const blockUser = asyncHandler(async (req, res) => {
    const user = await findByIdAndUpdate({
        model: userModel,
        filter: req.params.id,
        date: { block: true }
    })
    return user ? res.status(200).json({ message: `Done`, user }) : next(new Error("in-valid user ID", { cause: 404 }))
})

export const unblockUser = asyncHandler(async (req, res) => {
    const user = await findByIdAndUpdate({
        model: userModel,
        filter: req.params.id,
        date: { block: false }
    })
    return user ? res.status(200).json({ message: `Done`, user }) : next(new Error("in-valid user ID", { cause: 404 }))
})

