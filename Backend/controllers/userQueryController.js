import { UserQuery } from '../models/userQuesy.js';


const createUserQuery = async (req, res) => {
    try {
        const {name, email, supportType, message } = req.body;
        if (!supportType || !message) {
            return res.status(400).json({
                message: 'Support type and message are required',
            })
        }

        await UserQuery.create({
            name,
            email,
            supportType,
            message
        });

        return res.status(201).json({
            message: 'Feedback submitted successfully',
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json(`Error submitting query: ${error.message}`);
        }

        return res.status(500).json({
            message: 'Error submitting query',
        });
    }
};

const getUserQueries = async (req, res) => {
    try {
        const queries = await UserQuery.find().sort({ _id: -1 });

        return res.status(200).json({
            queries
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to load feedback',
        });
    }
};

export {
    createUserQuery,
    getUserQueries
};