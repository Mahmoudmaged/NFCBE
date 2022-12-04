import joi from 'joi'



export const basicInfo = {

    body: joi.object().required().keys({
        userName: joi.string().min(2).max(20).messages({
            'any.required': "userName field is required",
            'any.empty': "empty userName is not acceptable"
        }),

        firstName: joi.string().min(2).max(20).messages({
            'any.required': "userName field is required",
            'any.empty': "empty userName is not acceptable"
        }),


        lastName: joi.string().min(2).max(20).messages({
            'any.required': "lastName field is required",
            'any.empty': "empty lastName is not acceptable"
        }),
        position: joi.string().min(2).max(80).messages({
            'any.required': "position field is required",
            'any.empty': "empty position is not acceptable"
        }),
        email: joi.string().email().messages({
        }),
        phone: joi.number().messages({
        }),
        age: joi.number().messages({
        }),
    })
}
export const login = {

    body: joi.object().required().keys({

        email: joi.string().email().required().messages({
        }),


        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required().messages({
        }),

    })
}



export const socialLinks = {
    body: joi.object().required().keys({

        links: joi.array().items(joi.object({
            accessLink: joi.string().required(),
            title: joi.string().required(),
            icon: joi.string().required(),
        }))
    })
}


export const updatePassword = {

    body: joi.object().required().keys({

        oldPassword: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required().messages({
        }),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required().messages({
        }),
        cPassword: joi.string().valid(joi.ref('newPassword')).required().messages({
        }),
    })
}