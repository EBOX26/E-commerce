const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// GET request to retrieve all tags and associated product data
router.get("/", async (req, res) => {
  try {
    const tagsWithProducts = await Tag.findAll({
      include: { model: Product, through: ProductTag },
    });
    res.status(200).json(tagsWithProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET request to retrieve a single tag by its `id` and its associated product data
router.get("/:id", async (req, res) => {
  try {
    const tagWithProduct = await Tag.findByPk(req.params.id, {
      include: { model: Product, through: ProductTag },
    });

    if (!tagWithProduct) {
      res.status(404).json({ message: "Tag with this id not found!" });
      return;
    }
    res.status(200).json(tagWithProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST request to create a new tag
router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT request to update a tag by its `id`
router.put("/:id", async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE request to remove a tag by its `id`
router.delete("/:id", async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedTag) {
      res.status(404).json({ message: "Tag with this id not found!" });
      return;
    }

    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
