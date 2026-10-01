import cookieParser from 'cookie-parser'
import express from 'express'
import paymentRouter from './routes/paymentRoute.js'
import userRouter from './routes/user.routes.js'
import cors from 'cors'
import { restaurantRoute } from './routes/restaurantRoute.js'
import { foodRoute } from './routes/foodRoute.js'
import { userQueryRouter } from './routes/userQueryRoute.js'
import orderRouter from './routes/orderRoute.js'
import { categoryRoute } from './routes/categoryRoute.js'
import { UserOrderRoute } from "./routes/UserOrderRoute.js"
import { cartRoute } from './routes/cartRoute.js'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/users', userRouter) //userController routes
app.use('/api/payments', paymentRouter)
app.use('/api/restaurant', restaurantRoute) //restaurantController routes
app.use('/api/food', foodRoute) //foodController routes
app.use('/api/userquery', userQueryRouter) //userQueryController routes
app.use('/api/orders', orderRouter) //orderController routes
app.use('/api/categories', categoryRoute) // category management routes
app.use("/api/userorders", UserOrderRoute) // user ordered product details goes through this
app.use("/api/cart", cartRoute) // cart route
app.use("/api/payment", paymentRouter); //esewa khalti payment routes

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  })
})

export default app
