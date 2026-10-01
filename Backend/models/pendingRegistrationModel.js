import mongoose from 'mongoose'

const pendingRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  otpHash: { type: String, required: true, select: false },
  otpExpiresAt: { type: Date, required: true, select: false },
  otpAttempts: { type: Number, default: 0, select: false },
}, { timestamps: true })

pendingRegistrationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })

export const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema)
