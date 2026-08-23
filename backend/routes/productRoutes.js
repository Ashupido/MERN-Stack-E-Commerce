const express = require("express");
const Product = require("../models/Product");

const cloudinary = require("cloudinary").v2;

const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Cloudinary Configuration
|--------------------------------------------------------------------------
*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


/*
|--------------------------------------------------------------------------
| Helper: Delete Image From Cloudinary
|--------------------------------------------------------------------------
*/

const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
      return;
    }

    /*
      Example Cloudinary URL:

      https://res.cloudinary.com/demo/image/upload/v1234567890/pido-products/iphone.jpg

      We need:

      pido-products/iphone
    */

    const uploadPart = imageUrl.split("/upload/")[1];

    if (!uploadPart) {
      return;
    }

    let publicId = uploadPart;

    // Remove Cloudinary version such as v1234567890/
    publicId = publicId.replace(/^v\d+\//, "");

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");

    console.log("Deleting Cloudinary image:", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    console.log("Cloudinary delete result:", result);

    return result;
  } catch (error) {
    console.error("Cloudinary image deletion error:", error.message);
  }
};


/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        price,
        discountPrice,
        description,
        category,
        brand,
        stock,
        sku,
      } = req.body;

      // Required fields
      if (!name || !price || !description || !category) {
        return res.status(400).json({
          error: "Missing required product fields",
        });
      }

      // Convert numeric fields
      const parsedPrice = Number(price);

      const parsedDiscount =
        discountPrice !== undefined &&
        discountPrice !== ""
          ? Number(discountPrice)
          : undefined;

      const parsedStock =
        stock !== undefined && stock !== ""
          ? Number(stock)
          : undefined;

      /*
      |--------------------------------------------------------------------------
      | Cloudinary Image
      |--------------------------------------------------------------------------
      |
      | req.file.path now contains the Cloudinary URL.
      |
      */

      console.log("REQ FILE:", req.file);
      console.log("REQ BODY:", req.body);

      if (!req.file) {
        return res.status(400).json({
          error: "Product image is required",
        });
      }

      const imageUrl =
        req.file?.path || req.file?.secure_url || req.file?.url;

      if (!imageUrl) {
        return res.status(400).json({
          error: "Image upload failed: Cloudinary URL not found",
        });
      }

      console.log("CLOUDINARY IMAGE URL:", imageUrl);

      const product = new Product({
        name,
        price: parsedPrice,
        discountPrice: parsedDiscount,
        description,
        category,
        brand,
        stock: parsedStock,
        sku,
        images: [imageUrl],
        seller: req.user.id,
        createdBy: req.user.id,
      });

      await product.save();
      console.log("SAVED IMAGES:", product.images);

      res.status(201).json(product);
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET PRODUCTS
| SEARCH + CATEGORY + PAGINATION + SORT
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      page,
      limit,
      sort,
    } = req.query;

    let filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category) {
      filter.category = category;
    }

    // Pagination
    const pageNum = Number(page) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};

    // Price low → high
    if (sort === "price_asc") {
      sortOption.price = 1;
    }

    // Price high → low
    else if (sort === "price_desc") {
      sortOption.price = -1;
    }

    // Newest
    else if (sort === "newest") {
      sortOption.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    products.forEach((product) => {
      console.log("PRODUCT IMAGE DEBUG", product.images);
    });

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      totalProducts,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      products,
    });
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT
|--------------------------------------------------------------------------
*/

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.status(500).json({
      error: err.message,
    });
  }
});


/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // Build update object
      const updateData = {};

      const fields = [
        "name",
        "price",
        "discountPrice",
        "description",
        "category",
        "brand",
        "stock",
        "sku",
      ];

      fields.forEach((field) => {
        if (
          req.body[field] !== undefined &&
          req.body[field] !== ""
        ) {
          if (
            ["price", "discountPrice", "stock"].includes(field)
          ) {
            updateData[field] = Number(req.body[field]);
          } else {
            updateData[field] = req.body[field];
          }
        }
      });


      /*
      |--------------------------------------------------------------------------
      | NEW IMAGE
      |--------------------------------------------------------------------------
      */

      if (req.file) {
        const newImageUrl = req.file.secure_url || req.file.path;

        console.log("UPLOAD DEBUG", {
          hasFile: !!req.file,
          fileName: req.file?.originalname,
          mimeType: req.file?.mimetype,
          uploadResult: newImageUrl,
        });

        if (product.images && product.images.length > 0) {
          const oldImage = product.images[0];
          await deleteCloudinaryImage(oldImage);
        }

        updateData.images = [newImageUrl];
      }


      /*
      |--------------------------------------------------------------------------
      | UPDATE DATABASE
      |--------------------------------------------------------------------------
      */

      const updatedProduct =
        await Product.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        );

      console.log("UPDATED PRODUCT IMAGES", updatedProduct?.images);
      res.json(updatedProduct);
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }


      /*
      |--------------------------------------------------------------------------
      | Delete Product Image From Cloudinary
      |--------------------------------------------------------------------------
      */

      if (
        product.images &&
        product.images.length > 0
      ) {
        for (const imageUrl of product.images) {
          await deleteCloudinaryImage(imageUrl);
        }
      }


      /*
      |--------------------------------------------------------------------------
      | Delete Product From MongoDB
      |--------------------------------------------------------------------------
      */

      await Product.findByIdAndDelete(req.params.id);

      res.json({
        message: "Product and Cloudinary image deleted successfully",
      });
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
);


module.exports = router;