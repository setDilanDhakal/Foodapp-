import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { UserOrder } from "../controllers/UserOrderController.js";

const UserOrderRoute = Router();

UserOrderRoute.post("/order", verifyJWT, UserOrder);

export {
    UserOrderRoute
}