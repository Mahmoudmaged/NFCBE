import jwt from 'jsonwebtoken'
import { findById } from '../../DB/DBMethods.js';
import userModel from '../../DB/model/User.model.js';
import { asyncHandler } from '../services/errorHandling.js';

export const roles = {
    Admin: "Admin",
    User: 'User',
    HR: "HR"
}
export const auth = (accessRoles = []) => {
    return asyncHandler(
        async (req, res, next) => {
            const { authorization } = req.headers
            if (!authorization?.startsWith(process.env.BearerKey)) {
                next(new Error("In-valid Bearer key", { cause: 400 }))
            } else {
                const token = authorization.split(process.env.BearerKey)[1]
                const decoded = jwt.verify(token, process.env.tokenSignature)
                if (!decoded?.id || !decoded?.isLoggedIn) {
                    next(new Error("In-valid token payload ", { cause: 400 }))
                } else {
                    const user = await findById({ model: userModel, filter: decoded.id, select: 'email userName role blocked' })
                    if (!user) {
                        next(new Error("Not register user", { cause: 401 }))
                    } else {
                        if (user.blocked) {
                            next(new Error("Blocked Account", { cause: 400 }))
                        } else {
                            if (!accessRoles.includes(user.role)) {
                                next(new Error("Not Auth User", { cause: 403 }))
                            } else {
                                req.user = user
                                next()
                            }
                        }
                    }
                }
            }
        }
    )
}