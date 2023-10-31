const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// GET request to fetch all products, including associated Category and Tag data
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request to fetch a single product by its `id`, including associated Category and Tag data
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }],
    });

    if (!product) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST request to create a new product
router.post("/", async (req, res) => {
  try {
    const { product_name, product_price, product_stock, category_id, tagIds } = req.body;

    if (!product_name || !product_price || !product_stock || !category_id) {
      res.status(400).json({ message: "Invalid request. Please provide all required fields." });
      return;
    }

    const product = await Product.create({
      product_name,
      product_price,
      product_stock,
      category_id,
    });

    if (tagIds && tagIds.length) {
      const productTagIds = tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIds);
    }

    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT request to update a product by its `id`
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      const existingTagIds = productTags.map(({ tag_id }) => tag_id);

      const newTagIds = req.body.tagIds
        .filter((tag_id) => !existingTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const tagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: tagsToRemove } }),
        ProductTag.bulkCreate(newTagIds),
      ]);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE request to delete a product by its `id`
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
