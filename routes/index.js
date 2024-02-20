const routerCategory = require("./category.route");
const subCategoryRoute = require("./subCategory.route");
const brandRoute = require("./brand.route");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addresessRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", routerCategory);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
}

module.exports = mountRoutes;