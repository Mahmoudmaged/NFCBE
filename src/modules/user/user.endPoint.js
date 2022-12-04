import { roles } from "../../middleware/auth.js";




export const endPoint = {
    userList: [roles.Admin],
    block: [roles.Admin],
    unblock: [roles.Admin],
    profile: [roles.Admin, roles.User]
}