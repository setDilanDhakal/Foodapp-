import { Router } from "express";
import { registerRestaurant } from "../controllers/restaurantController.js";

const restaurantRoute = Router();

restaurantRoute.post("/registerrestaurant", registerRestaurant);

export {
    restaurantRoute
}