import express from "express";
const router = express.Router();
import uploader from "./libs/utils/uploader";
import memberController from "./controllers/member.controller";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

/**MEMBER */
router.get("/member/homeData", memberController.getHomeData);
router.post("/member/signup", memberController.signup);
router.post("/member/login", memberController.login);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);
router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember
);

router.get("/member/top-users", memberController.getTopUsers)


/**Product */
router.get("/product/all", productController.getProducts)
router.get("/product/:id", memberController.retrieveAuth, productController.getProduct)


/**Order */
router.post("/order/create", memberController.verifyAuth, orderController.createOrder)

export default router;
