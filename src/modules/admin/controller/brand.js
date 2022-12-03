import { create, find, findById, findByIdAndUpdate, findOne, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import slugify from 'slugify'
import { paginate } from "../../../services/pagination.js";
import brandModel from "../../../../DB/model/Brand.model.js";

export const createBrand = asyncHandler(
    async (req, res, next) => {
        if (!req.file) {
            next(new Error('Image is required', { cause: 400 }))
        } else {

            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `OnlineCommerce/Brand` })
            const { name } = req.body
            const brand = await create({
                model: brandModel,
                data: {
                    name,
                    slug: slugify(name),
                    image: secure_url,
                    imagePublicId: public_id,
                    createdBy: req.user._id,
                }
            })
            brand ? res.status(201).json({ message: "Done", brand }) :
                next(new Error('Fail to add new brand', { cause: 400 }))
        }

    }
)


export const updateBrand = asyncHandler(
    async (req, res, next) => {

        const { id } = req.params
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `OnlineCommerce/Brand` })
            req.body.image = secure_url;
            req.body.imagePublicId = public_id;
        }

        if (req.body.name) {
            req.body.slug = slugify(req.body.name)
        }

        req.body.updatedBy = req.user._id

        const category = await findOneAndUpdate({
            model: brandModel,
            filter: { _id: id },
            data: req.body,
            options: { new: false }
        })

        if (category) {
            if (req.file) {
                await cloudinary.uploader.destroy(category.imagePublicId)
            }
            res.status(200).json({ message: "Done", category })
        }
        else {
            await cloudinary.uploader.destroy(req.body.imagePublicId)
            next(new Error('Fail to update this subCategory', { cause: 400 }))
        }

    }
)



export const Brands = asyncHandler(
    async (req, res, next) => {

        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
        const brandsList = await find({
            model: brandModel,
            filter: {},
            populate: [
                {
                    path: "createdBy",
                    select: "userName email image"
                }
            ],
            skip,
            limit
        })

        res.status(200).json({ message: "Done", brandsList })
    }
)

//delete