import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function Handle( req, res ) {
    const { method } = req;
    await mongooseConnect(); 

    if ( method === 'GET') {
        const categories = await Category.find({ parentCategory: null })
        .populate({
            path: "parentCategory",
            model: "Category",
        })
        .exec();

        const categoriesWithChildren = await Promise.all(
            categories.map(async (category) => {
                const children = await Category.find({ parentCategory: category._id });
                return {
                    ...category.toObject(),
                    children,
                };
            })
        );
        res.json(categoriesWithChildren);

    }
}