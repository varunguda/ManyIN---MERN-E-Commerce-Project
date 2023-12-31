import { Router } from "express";
import { isUser } from "../middleware/isUser.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isSeller } from "../middleware/isSeller.js";
import { isAdminOrSeller } from "../middleware/isAdminOrSeller.js"
import {
    cancelAllOrderOfMyProduct,
    cancelMyOrder,
    cancelOrderOfMyProduct,
    deleteAnyOrder,
    getAllOrders,
    getMyOrders,
    getMyProductsOrders,
    getOrderDetails,
    getOrderPriceDetails,
    placeNewOrder,
    updateAnyOrderStatus,
    updateMyProductOrderStatus
} from "../controllers/orderControllers.js";


const router = Router();


// All
router.route("/order/placeneworder").post(isUser, placeNewOrder);

router.route("/order/getOrderValue").post(isUser, getOrderPriceDetails);

router.route("/me/orders").get(isUser, getMyOrders);

router.route("/me/orders/:id").get(isUser, getOrderDetails);

router.route("/me/orders/:id").delete(isUser, cancelMyOrder )


// Admin
router.route("/orders/all").get(isAdmin, getAllOrders);

router.route("/orders/all").put(isAdmin, updateAnyOrderStatus);

router.route("/orders/all/:id").delete(isAdmin, deleteAnyOrder);


// Seller
router.route("/myproducts/orders/:product").put(isSeller, cancelAllOrderOfMyProduct);

router.route("/myproducts/order")
    .put(isSeller, updateMyProductOrderStatus)
    .delete(isSeller, cancelOrderOfMyProduct);


// Admin & Seller
router.route('/myproducts/orders').get(isAdminOrSeller, getMyProductsOrders);


export default router;