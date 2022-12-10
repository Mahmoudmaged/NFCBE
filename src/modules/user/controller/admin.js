
import { find } from "../../../../DB/DBMethods.js"
import userModel from "../../../../DB/model/User.model.js"
import { sendEmail } from "../../../services/email.js"
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
    console.log(user);
    if (!user) {
        return next(new Error("in-valid user ID", { cause: 404 }))
    } else {
        const message = `<section> 
        <div style="padding:  50px 100px;border-radius: 20px;background-color: white; text-align: center;">
            <div>
                <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/envelope-icon.png" width="100px" alt="">
                <p>We are sorry to inform you that the Link-It Owner have been blocked your account</p>
            
            </div>
    </div>
    </section> `;


        await sendEmail(user.email, 'Account Blocked', message)
        return res.status(200).json({ message: `Done` })
    }

})

export const unblockUser = asyncHandler(async (req, res, next) => {
    const { id } = req.body
    const user = await userModel.findByIdAndUpdate(
        { _id: id, role: 'User' },
        { blocked: false },
        { new: true })
    if (user) {
        const message = `<section> 
        <div style="padding:  50px 100px;border-radius: 20px;background-color: white; text-align: center;">
            <div>
                <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/envelope-icon.png" width="100px" alt="">
                <p>We are happy to inform you that the 
                Link-It Owner have been Un-blocked 
                your account you can access you profile now.</p>
            </div>
    </div>
    </section> `;


        await sendEmail(user.email, 'Account Blocked', message)
        return res.status(200).json({ message: "Done" })
    } else {
        return next(new Error('In-valid ID', { cause: 400 }))
    }
})

