import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const BRAND = '#F54900'

// Simple eye / eye-off icon pair
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

// Reusable field with an eye button inside
function PasswordField({
  name,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  isVisible,
  onToggleVisible,
}) {
  return (
    <div>
      <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-orange-950/70'>
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
          className='w-full rounded-xl border border-orange-200 px-4 py-3 pr-12 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
        />
        <button
          type='button'
          onClick={onToggleVisible}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          title={isVisible ? 'Hide password' : 'Show password'}
          className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-orange-950/50 transition hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200'
        >
          <EyeIcon open={isVisible} />
        </button>
      </div>
    </div>
  )
}

function ChangePassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 👁️ visibility per field
  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const toggleVisible = (field) =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }))

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { withCredentials: true }
      )
      toast.success(data.message || 'Password updated successfully', {
        position: 'top-center',
      })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setVisible({ currentPassword: false, newPassword: false, confirmPassword: false })
      setTimeout(() => navigate('/admin'), 900)
    } catch (error) {
        console.log(error.response?.data)
      toast.error(error.response?.data?.message || 'Unable to change password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='mx-auto max-w-xl rounded-3xl border border-orange-100 bg-white p-8 shadow-sm'>
      <p
        className='text-xs font-bold uppercase tracking-[0.2em]'
        style={{ color: BRAND }}
      >
        Account security
      </p>
      <h2 className='mt-1 text-2xl font-black text-orange-950'>Change password</h2>
      <p className='mt-2 text-sm text-orange-950/60'>
        Enter your current password to set a new one. You'll stay signed in.
      </p>

      <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
        <PasswordField
          name='currentPassword'
          label='Current password'
          value={form.currentPassword}
          onChange={handleChange}
          placeholder='Enter your current password'
          autoComplete='current-password'
          isVisible={visible.currentPassword}
          onToggleVisible={() => toggleVisible('currentPassword')}
        />

        <PasswordField
          name='newPassword'
          label='New password'
          value={form.newPassword}
          onChange={handleChange}
          placeholder='At least 8 characters'
          autoComplete='new-password'
          isVisible={visible.newPassword}
          onToggleVisible={() => toggleVisible('newPassword')}
        />

        <PasswordField
          name='confirmPassword'
          label='Confirm new password'
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder='Re-enter new password'
          autoComplete='new-password'
          isVisible={visible.confirmPassword}
          onToggleVisible={() => toggleVisible('confirmPassword')}
        />

        <div className='flex items-center gap-3 pt-2'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded-full px-5 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60'
            style={{ background: BRAND }}
          >
            {isSubmitting ? 'Updating...' : 'Update password'}
          </button>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-bold text-orange-700 hover:bg-orange-50'
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default ChangePassword