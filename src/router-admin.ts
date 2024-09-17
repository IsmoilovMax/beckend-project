import express from "express";
const routerAdmin = express.Router();
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import adminController from "./controllers/admin.controller";

/**Furniture Admin*/
routerAdmin.get("/", adminController.goHome);
routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin
  .get("/signup", adminController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    adminController.processSignup
  );

routerAdmin.get("/logout", adminController.logout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

/**User */
routerAdmin.get(
  "/user/all",
  adminController.verifyMember,
  adminController.getUser
);
routerAdmin.post(
  "/user/edit",
  adminController.verifyMember,
  adminController.updateChosenUser
);

/**Product */
routerAdmin.get(
  "/product/all",
  adminController.verifyMember,
  productController.getAllProducts
);
routerAdmin.post(
  "/product/create",
  adminController.verifyMember,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  adminController.verifyMember,
  productController.updateChosenProduct
);

export default routerAdmin;
