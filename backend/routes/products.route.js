import express from "express";
import { createProduct, deleteProductCard, getProduct, getProductDetails, getAllProducts, updateProductCard } from "../controllers/products.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createProduct);
router.get("/get/:id", getProduct);
router.get("/details/:id", getProductDetails);
router.get("/all", getAllProducts);
router.delete("/delete/:id", verifyToken, deleteProductCard);
router.post("/update/:id", verifyToken, updateProductCard);

export default router;