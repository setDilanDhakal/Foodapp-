import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true
      },
      address: {
         type: String,
         required: true,
         trim: true
      },
      phone: {
         type: String,
         required: true,
         trim: true,
         unique: true
      },
      email: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         unique: true
      },
      // avatar / profile picture (Cloudinary URL)
      avatar: {
         type: String,
         default: ''
      },
      password: {
         type: String,
         required: true,
         minlength: 8,
      },
      role: {
         type: String,
         enum: ["admin", "user"],
         default: "user"
      },
      emailVerified: {
         type: Boolean,
         default: true
      },
      // OTP fields for profile-update confirmation
      profileUpdateOtpHash: { type: String, select: false },
      profileUpdateOtpExpiresAt: { type: Date, select: false },
      profileUpdateOtpAttempts: { type: Number, default: 0, select: false },

      // OTP fields for forgot-password
      passwordResetOtpHash: { type: String, select: false },
      passwordResetOtpExpiresAt: { type: Date, select: false },
      passwordResetOtpAttempts: { type: Number, default: 0, select: false },
   },
   { timestamps: true },
)

export const User = mongoose.model('User', userSchema)
