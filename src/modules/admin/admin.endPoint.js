import { roles } from "../../middleware/auth.js";



const endPoint = {
    add: [roles.Admin, roles.User],
    update:[roles.Admin, roles.User]
}

export default  endPoint