import jwt from 'jsonwebtoken';
import { User } from '../models/usermodel.js';


const verifyAdmin = async(req, res, next) => {
    const token = req.cookies?.AccessToken || req.header('Authorization')?.replace('Bearer ', '') || req.headers?.authorization?.replace('Bearer ', '');
    if(!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!decodedToken) {
        return res.status(401).json({ message: 'Invalid access token' });
    }

    const user = await User.findById(decodedToken._id).select('-password');
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if(user.role !== "admin"){
        return res.status(400).json({
            message:"You arenot eligible to change food items"
        })
    }

    req.user = user;
    next();
};

export default verifyAdmin;