import { User } from '../models/usermodel.js';
import { PendingRegistration } from '../models/pendingRegistrationModel.js';
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js';
import { UploadOnCloadinary } from '../utils/uploadOnCloudinary.js';
import { option } from '../utils/option.js';
import { createEmailOtp, hashEmailOtp, sendVerificationEmail } from '../utils/emailVerification.js';

const register = async (req, res) => {
    try {
        const { name, address, phone, email, password } = req.body;
        if (!name || !address || !phone || !email || !password) {
            return res.status(404).json({
                message: 'Name, address, phone, email, and password are required',
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long',
            })
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { phone }],
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email or phone number is already registered',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await User.create({
            name,
            address,
            phone,
            email: email.toLowerCase(),
            password: hashedPassword,
            emailVerified: true
        });

        res.status(201).json({
            message: 'Registration successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }

        res.status(500).json({
            message: 'Unable to create user', error
        })
    }
};

const verifyRegistrationEmail = async (req, res) => {
    try {
        const { email, code } = req.body
        if (!email || !/^\d{6}$/.test(code || '')) return res.status(400).json({ message: 'Enter a valid 6-digit verification code' })

        const pendingRegistration = await PendingRegistration.findOne({ email: email.trim().toLowerCase() }).select('+otpHash +otpExpiresAt +otpAttempts')
        if (!pendingRegistration) return res.status(404).json({ message: 'Registration was not found. Please register again.' })
        if (!pendingRegistration.otpExpiresAt || pendingRegistration.otpExpiresAt < new Date()) return res.status(400).json({ message: 'This code has expired. Register again to receive a new code.' })
        if (pendingRegistration.otpAttempts >= 5) return res.status(429).json({ message: 'Too many incorrect attempts. Register again to receive a new code.' })
        if (hashEmailOtp(code) !== pendingRegistration.otpHash) {
            pendingRegistration.otpAttempts += 1
            await pendingRegistration.save()
            return res.status(400).json({ message: 'Verification failed: the code is incorrect' })
        }

        const duplicateUser = await User.findOne({ $or: [{ email: pendingRegistration.email }, { phone: pendingRegistration.phone }] })
        if (duplicateUser) return res.status(409).json({ message: 'Email or phone number is already registered' })
        await User.create({
            name: pendingRegistration.name,
            address: pendingRegistration.address,
            phone: pendingRegistration.phone,
            email: pendingRegistration.email,
            password: pendingRegistration.password,
            emailVerified: true,
        })
        await pendingRegistration.deleteOne()
        return res.status(200).json({ message: 'Email verified successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Unable to verify email', error })
    }
}

const createAdmin = async (req, res) => {
    try {
        const { name, address, phone, email, password } = req.body;
        if (!name || !address || !phone || !email || !password) {
            return res.status(400).json({ message: 'Name, address, phone, email, and password are required' });
        }
        if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters long' });

        const existingUser = await User.findOne({ $or: [{ email: email.trim().toLowerCase() }, { phone }] });
        if (existingUser) return res.status(409).json({ message: 'Email or phone number is already registered' });

        const admin = await User.create({
            name,
            address,
            phone,
            email: email.trim().toLowerCase(),
            password: await bcrypt.hash(password, 10),
            role: 'admin',
            emailVerified: true,
        });
        return res.status(201).json({ message: 'Administrator created successfully', user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to create administrator', error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() })
        if (user && user.role !== 'admin' && !user.emailVerified) return res.status(403).json({ message: 'Verify your email before signing in' })
        const passwordMatches = user && await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = await generateToken(user);
        if (!token) {
            return res.status(404).json({
                message: "Token not provided"
            })
        }

        return res.status(200)
            .cookie("AccessToken", token, option)
            .json({
                message: 'Login successful',
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            })
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Unable to verify your login', error: error.message })
    }
}

const fetchUser = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json({ users });
    } catch (e) {
        return res.status(500).json({ message: 'Unable to fetch users' })
    }
}

const logout = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'User must be logged in to be logout' });
    }
    res.clearCookie("AccessToken", option);
    return res.status(200).json({ message: 'Logged out successfully' });
}

const profile = async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User profile fetched successfully', user });
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user?._id

        if (!userId) {
            return res.status(401).json({ message: 'You must be logged in to change your password' })
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long' })
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from the current password' })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        return res.status(200).json({ message: 'Password updated successfully' })
        
    } catch (error) {
        return res.status(500).json({ message: 'Unable to change password', error: error.message })
    }
}

// ─── Profile Update ───────────────────────────────────────────────────────────

/**
 * Directly update the logged-in user's profile details.
 * PUT /api/users/profile
 * Body: { name, email, phone, address }
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) return res.status(401).json({ message: 'Authentication required' })

        const { name, email, phone, address } = req.body

        if (!name?.trim()) return res.status(400).json({ message: 'Name is required' })
        if (!email?.trim()) return res.status(400).json({ message: 'Email is required' })

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        // Check uniqueness if email or phone changed
        const normalizedEmail = email.trim().toLowerCase()
        const newPhone = phone?.trim()
        const emailChanged = normalizedEmail !== user.email
        const phoneChanged = newPhone && newPhone !== user.phone

        if (emailChanged || phoneChanged) {
            const conflict = await User.findOne({
                _id: { $ne: userId },
                $or: [
                    ...(emailChanged ? [{ email: normalizedEmail }] : []),
                    ...(phoneChanged ? [{ phone: newPhone }] : []),
                ],
            })
            if (conflict) {
                return res.status(409).json({ message: 'Email or phone number is already in use by another account' })
            }
        }

        user.name    = name.trim()
        user.email   = normalizedEmail
        if (newPhone) user.phone = newPhone
        if (address?.trim()) user.address = address.trim()

        await user.save()

        const updated = await User.findById(userId).select('-password')
        return res.status(200).json({ message: 'Profile updated successfully', user: updated })
    } catch (error) {
        console.error('updateProfile error:', error)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: 'Unable to update profile', error: error.message })
    }
}

/**
 * Upload / replace the logged-in user's avatar via Cloudinary.
 * POST /api/users/profile/avatar
 * multipart/form-data  field name: avatar
 */
const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) return res.status(401).json({ message: 'Authentication required' })

        if (!req.file) return res.status(400).json({ message: 'No image file was provided' })

        const cloudinaryUrl = await UploadOnCloadinary(req.file.path)
        if (!cloudinaryUrl) {
            return res.status(500).json({ message: 'Failed to upload image to Cloudinary' })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: cloudinaryUrl },
            { new: true }
        ).select('-password')

        return res.status(200).json({ message: 'Avatar updated successfully', user })
    } catch (error) {
        console.error('uploadAvatar error:', error)
        return res.status(500).json({ message: 'Unable to upload avatar', error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(404).json({ message: 'User with this email does not exist' });

        const otp = createEmailOtp();
        user.passwordResetOtpHash = otp.hash;
        user.passwordResetOtpExpiresAt = otp.expiresAt;
        user.passwordResetOtpAttempts = 0;
        await user.save();

        await sendVerificationEmail({ email: user.email, name: user.name, code: otp.code });

        return res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (error) {
        console.error('forgotPassword error:', error);
        return res.status(500).json({ message: 'Unable to process request', error: error.message });
    }
}

const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !/^\d{6}$/.test(code || '')) return res.status(400).json({ message: 'Enter a valid 6-digit verification code' });

        const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (!user.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'This code has expired. Request a new one.' });
        }
        
        if (user.passwordResetOtpAttempts >= 5) {
            return res.status(429).json({ message: 'Too many incorrect attempts. Request a new code.' });
        }
        
        if (hashEmailOtp(code) !== user.passwordResetOtpHash) {
            user.passwordResetOtpAttempts += 1;
            await user.save();
            return res.status(400).json({ message: 'Verification failed: the code is incorrect' });
        }

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('verifyForgotPasswordOtp error:', error);
        return res.status(500).json({ message: 'Unable to verify OTP', error: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) return res.status(400).json({ message: 'Email, code, and new password are required' });
        if (newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters long' });

        const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (!user.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'This code has expired. Request a new one.' });
        }
        
        if (hashEmailOtp(code) !== user.passwordResetOtpHash) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetOtpHash = undefined;
        user.passwordResetOtpExpiresAt = undefined;
        user.passwordResetOtpAttempts = 0;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('resetPassword error:', error);
        return res.status(500).json({ message: 'Unable to reset password', error: error.message });
    }
}

export {
    register,
    verifyRegistrationEmail,
    createAdmin,
    login,
    fetchUser,
    logout,
    profile,
    changePassword,
    updateProfile,
    uploadAvatar,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
}
