const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

router.get("/", (req, res) => {
  // find all products
  Product.findAll({
    attributes: ["id", "product_name", "price", "stock"],
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
      },
    ],
  })
    .then((productData) => res.json(productData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one product
router.get("/:id", (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
      },
    ],
  })
    .then((productData) => {
      if (!productData) {
        res.status(404).json({ message: "No product found with this ID" });
        return;
      }
      res.json(productData);
    })
    .catch((err) => {
      console.log(err), res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds,
  })
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }

      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    }
  })
  .then(productUpdate => {
    if(!productUpdate){
      res.status(404).json({message: "No product found with this id."})
      return;
    }
    res.json(productUpdate);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  
  })
});

router.delete("/:id", (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((productData) => {
      if (!productData) {
        res
          .status(404)
          .json({
            message: "Please try again There is no product found with this ID",
          });
        return;
      }
      res.json(productData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
