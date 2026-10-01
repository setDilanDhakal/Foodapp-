import { Router } from "express";
import { deleteFood, foodItem, getFoods, updateFood, getbycategory } from "../controllers/foodController.js";
import { upload } from "../upload/upload.js";
import verifyAdmin from "../middlewares/adminVerifyJWT.js"

const foodRoute = Router();

foodRoute.post("/additem", upload.single('image'), verifyAdmin, foodItem);
foodRoute.get("/getfood", getFoods);
foodRoute.patch("/:id", upload.single('image'), verifyAdmin, updateFood);
foodRoute.delete("/:id", verifyAdmin, deleteFood);
foodRoute.get("/getbycategory/:category",getbycategory )

export {
    foodRoute
}
