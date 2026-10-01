import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateQuantity, clearCart } from "../controllers/cartController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const cartRoute = Router();

cartRoute.get("/", verifyJWT, getCart);
cartRoute.get("/getcart", verifyJWT, getCart);
cartRoute.post("/add", verifyJWT, addToCart);
cartRoute.post("/addtocart", verifyJWT, addToCart);
cartRoute.post("/remove", verifyJWT, removeFromCart);
cartRoute.post("/update", verifyJWT, updateQuantity);
cartRoute.delete("/clear", verifyJWT, clearCart);

export {
    cartRoute
};