import jwt from "jsonwebtoken";
import "dotenv/config";

const generateToken = async(user)=>{
    return jwt.sign(
  {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    address: user.address,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY_KEY,
  }
    )
};

export {
    generateToken
}