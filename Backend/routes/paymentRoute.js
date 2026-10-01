import { Router } from "express";
import { initiateKhaltiPayment, verifyKhaltiPayment, savePayment } from "../controllers/paymentController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const paymentRouter = Router();

paymentRouter.post("/khalti/initiate", verifyJWT, initiateKhaltiPayment);
paymentRouter.post("/khalti/verify", verifyJWT, verifyKhaltiPayment);
paymentRouter.post("/save", verifyJWT, savePayment);


export default paymentRouter;