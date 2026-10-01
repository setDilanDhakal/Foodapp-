import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// Eye / Eye-off SVG icons
const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='h-5 w-5'>
      <path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  ) : (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='h-5 w-5'>
      <path d='M3 3l18 18' />
      <path d='M10.6 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.1 4.2' />
      <path d='M6.2 6.3A17.3 17.3 0 0 0 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4.2-.8' />
      <path d='M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9' />
    </svg>
  )

function PasswordField({ name, label, value, onChange, placeholder, autoComplete, isVisible, onToggleVisible, hint }) {
  return (
    <div>
      <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-orange-600'>
        {label}
      </label>
      <div className='relative'>
        <input
          type={isVisible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className='w-full rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-3 pr-12 text-sm text-orange-950 placeholder-orange-300 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition'
        />
        <button
          type='button'
          onClick={onToggleVisible}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-orange-400 transition hover:text-orange-700 focus:outline-none'
        >
          <EyeIcon open={isVisible} />
        </button>
      </div>
      {hint && <p className='mt-1 text-xs text-slate-400'>{hint}</p>}
    </div>
  )
}

function UserChangePassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleVisible = (field) =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }))

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return toast.error('All fields are required')
    }
    if (form.newPassword.length < 8) {
      return toast.error('New password must be at least 8 characters')
    }
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('New passwords do not match')
    }
    if (form.currentPassword === form.newPassword) {
      return toast.error('New password must be different from the current one')
    }

    setIsSubmitting(true)
    try {
      const { data } = await axios.post(
        '/api/users/changepassword',
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { withCredentials: true }
      )
      toast.success(data.message || 'Password updated successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setVisible({ currentPassword: false, newPassword: false, confirmPassword: false })
      setTimeout(() => navigate('/profile'), 1200)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to change password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const mismatch =
    form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-lg'>

        {/* Back link */}
        <Link
          to='/profile'
          className='mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition'
        >
          ← Back to Profile
        </Link>

        <div className='overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_16px_48px_rgba(251,146,60,0.12)]'>

          {/* Card header */}
          <div className='bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 px-8 py-7'>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-100'>Account Security</p>
            <h1 className='mt-1 text-2xl font-black text-white'>Change Password</h1>
            <p className='mt-1.5 text-sm text-orange-100/80'>
              Enter your current password then choose a strong new one.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5 p-8'>
            <PasswordField
              name='currentPassword'
              label='Current Password'
              value={form.currentPassword}
              onChange={handleChange}
              placeholder='Enter your current password'
              autoComplete='current-password'
              isVisible={visible.currentPassword}
              onToggleVisible={() => toggleVisible('currentPassword')}
            />

            <PasswordField
              name='newPassword'
              label='New Password'
              value={form.newPassword}
              onChange={handleChange}
              placeholder='At least 8 characters'
              autoComplete='new-password'
              isVisible={visible.newPassword}
              onToggleVisible={() => toggleVisible('newPassword')}
              hint='Must be at least 8 characters and different from your current password.'
            />

            <div>
              <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-orange-600'>
                Confirm New Password
              </label>
              <div className='relative'>
                <input
                  type={visible.confirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder='Re-enter new password'
                  autoComplete='new-password'
                  required
                  className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-orange-950 placeholder-orange-300 outline-none transition focus:ring-2 ${
                    mismatch
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100'
                      : 'border-orange-200 bg-orange-50/40 focus:border-orange-400 focus:ring-orange-100'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => toggleVisible('confirmPassword')}
                  aria-label={visible.confirmPassword ? 'Hide password' : 'Show password'}
                  className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-orange-400 transition hover:text-orange-700'
                >
                  <EyeIcon open={visible.confirmPassword} />
                </button>
              </div>
              {mismatch && (
                <p className='mt-1 text-xs font-semibold text-rose-600'>Passwords do not match</p>
              )}
            </div>

            {/* Strength indicator */}
            {form.newPassword.length > 0 && (
              <div className='rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-xs space-y-1.5'>
                <p className='font-bold text-orange-700 mb-1'>Password strength</p>
                {[
                  { ok: form.newPassword.length >= 8, label: 'At least 8 characters' },
                  { ok: /[A-Z]/.test(form.newPassword), label: 'Contains uppercase letter' },
                  { ok: /[0-9]/.test(form.newPassword), label: 'Contains a number' },
                  { ok: /[^A-Za-z0-9]/.test(form.newPassword), label: 'Contains a special character' },
                ].map(({ ok, label }) => (
                  <div key={label} className='flex items-center gap-2'>
                    <span className={ok ? 'text-emerald-600' : 'text-slate-300'}>
                      {ok ? '✓' : '○'}
                    </span>
                    <span className={ok ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className='flex gap-3 pt-2'>
              <button
                type='submit'
                disabled={isSubmitting || mismatch}
                className='flex-1 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 transition'
              >
                {isSubmitting ? 'Updating…' : '🔒 Update Password'}
              </button>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='rounded-xl border border-orange-200 bg-white px-6 py-3 text-sm font-bold text-orange-700 hover:bg-orange-50 transition'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserChangePassword
