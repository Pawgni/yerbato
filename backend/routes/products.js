import express from 'express';
import { getProductDetails, getProducts,newProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReview, getAdminProducts, uploadProductImages } from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js';
const router = express.Router();

router.route("/products").get( getProducts);
router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles('admin'),newProduct);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles('admin'),getAdminProducts);

router.route("/products/:id").get(getProductDetails);

router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles('admin'),updateProduct);
router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRoles('admin'),deleteProduct);
router.route("/admin/products/:id/upload_images").put(isAuthenticatedUser, authorizeRoles('admin'),uploadProductImages);

router.route("/reviews").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

router.route("/admin/reviews").delete(isAuthenticatedUser,authorizeRoles('admin'), deleteReview);

export default router;