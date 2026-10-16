import { Category } from "../model/categoryModel.js";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                status: false,
                message: "Category name is required",
            });
        }

        // Uploaded file Multer se milegi
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Category image is required",
            });
        }

        const imageUrl = await uploadImageToCloudinary(req.file.buffer);



        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const existcategory = await Category.findOne({ name });

        if (existcategory) {
            return res.status(400).json({
                status: false,
                message: "Category Already set"
            })
        }

        const category = await Category.create({
            name,
            slug,
            image: imageUrl,
            parentCategory: parentCategory || null
        });

        return res.status(201).json({
            status: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET ALL CATEGORIES — Parent + Child
export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();

        return res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET ONLY PARENT CATEGORIES
export const GetParentCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            $or: [
                { parentCategory: null },
                { parentCategory: { $exists: false } }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const existcategory = await Category.findByIdAndDelete(id);

        if (!existcategory) {
            return res.status(404).json({
                status: false,
                message: "category not found"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Category Delete Succesfully!",
            data: existcategory
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Delete Category Error :  ${error}`
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const existcategory = await Category.findById(id);

        if (!existcategory) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        // Name update
        if (name) {
            existcategory.name = name;

            existcategory.slug = name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        // New image select ki hai to upload karo
        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(
                req.file.buffer
            );

            existcategory.image = imageUrl;
        }

        await existcategory.save();

        return res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: existcategory
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error updating category",
            error: error.message
        });
    }
};


// BULK CREATE CATEGORIES
export const bulkCreateCategory = async (req, res) => {
    try {
        // Support both direct array payload and { categories: [...] } object payload
        const categoriesData = Array.isArray(req.body) ? req.body : req.body.categories;

        if (!categoriesData || !Array.isArray(categoriesData) || categoriesData.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Please provide a valid array of categories"
            });
        }

        const categoryMap = new Map(); // To resolve parent references in the same batch
        const categoriesToInsert = [];

        // First pass: Pre-fill map with existing categories from DB so children can reference them
        const existingCategories = await Category.find({});
        existingCategories.forEach(cat => {
            categoryMap.set(cat.name.toLowerCase(), cat._id);
            categoryMap.set(cat.slug, cat._id);
            categoryMap.set(cat._id.toString(), cat._id);
        });

        for (const item of categoriesData) {
            if (!item.name || !item.name.trim()) continue;

            const name = item.name.trim();
            const slug = (item.slug || name)
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            // Resolve parentCategory if provided (can be Name, Slug, or ObjectId)
            let parentCategoryId = null;
            if (item.parentCategory || item.parent) {
                const parentKey = String(item.parentCategory || item.parent).trim().toLowerCase();
                if (categoryMap.has(parentKey)) {
                    parentCategoryId = categoryMap.get(parentKey);
                }
            }

            // Check if already exists in DB or current batch list
            if (!categoryMap.has(slug)) {
                const newCategoryData = {
                    name,
                    slug,
                    image: item.image || "",
                    parentCategory: parentCategoryId
                };

                // Create temporarily in DB to get real ObjectId for children reference in same batch
                const created = await Category.create(newCategoryData);
                
                categoryMap.set(name.toLowerCase(), created._id);
                categoryMap.set(slug, created._id);
                categoryMap.set(created._id.toString(), created._id);

                categoriesToInsert.push(created);
            }
        }

        if (categoriesToInsert.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No new categories to add (All items already exist or invalid)"
            });
        }

        return res.status(201).json({
            status: true,
            message: `${categoriesToInsert.length} categories created successfully with hierarchy`,
            data: categoriesToInsert
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};