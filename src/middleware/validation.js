import { asyncHandler } from "../services/errorHandling.js"

const dataMethod = ['body', 'params', 'query', 'headers']


export const validation = (Schema) => {
    return (req, res, next) => {
        try {
            const validationArr = []
            dataMethod.forEach(key => {
                if (Schema[key]) {
                    const validationResult = Schema[key].validate(req[key], { abortEarly: false })
                    if (validationResult?.error) {
                        validationArr.push(validationResult.error.details)
                    }
                }
            })
            
            if (validationArr.length) {
                res.status(201).json({ message: "Validation error", validationArr })
            } else {
                next()
            }

        } catch (error) {
            next(new Error("validation err", { cause: 500 }))
        }
    }

}