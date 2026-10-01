import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const BRAND = '#F54900'
const CREAM = '#FFFCF4'

const initialForm = {
  name: '',
  address: '',
  phone: '',
  email: '',
  password: '',
  image: '',
}

const FIELDS = [
  {
    name: 'name',
    label: 'Full name',
    type: 'text',
    placeholder: 'e.g. Jane Doe',
    autoComplete: 'name',
    colSpan: 1,
  },
  {
    name: 'phone',
    label: 'Phone number',
    type: 'tel',
    placeholder: '98XXXXXXXX',
    autoComplete: 'tel',
    colSpan: 1,
  },
  {
    name: 'email',
    label: 'Email address',
    type: 'email',
    placeholder: 'admin@example.com',
    autoComplete: 'email',
    colSpan: 2,
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    placeholder: 'City, District, Province',
    autoComplete: 'street-address',
    colSpan: 2,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Minimum 8 characters',
    autoComplete: 'new-password',
    colSpan: 2,
  },
]

function CreateAdmin() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.values(form).some((v) => !v.trim())) {
      return toast.error('All fields are required')
    }
    if (form.password.length < 8) {
      return toast.error('Password must be at least 8 characters')
    }

    setIsSubmitting(true)
    const adminData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value) adminData.append(key, value)
    })

    try {
      const { data } = await axios.post('/api/users/admin', adminData, {
        withCredentials: true,
      })
      toast.success(data.message || 'Administrator created successfully')
      setForm(initialForm)
      setTimeout(() => navigate('/admin'), 900)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create administrator')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='mx-auto max-w-3xl'>
      {/* Card */}
      <div
        className='overflow-hidden rounded-3xl border bg-white shadow-sm'
        style={{ borderColor: `${BRAND}26` }}
      >
        {/* Header */}
        <div
          className='border-b px-6 py-6 sm:px-8'
          style={{ background: CREAM, borderColor: `${BRAND}26` }}
        >
          <p
            className='text-xs font-bold uppercase tracking-[0.2em]'
            style={{ color: BRAND }}
          >
            Team management
          </p>
          <h2 className='mt-1 text-2xl font-black text-orange-950'>
            Create administrator
          </h2>
          <p className='mt-1 text-sm text-orange-950/60'>
            Grant full admin access to a new team member. They can log in immediately with the credentials below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='px-6 py-6 sm:px-8 sm:py-8'>
          <div className='grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2'>
            {FIELDS.map((field) => {
              const isFocused = focusedField === field.name
              const isPassword = field.type === 'password'

              return (
                <div
                  key={field.name}
                  className={field.colSpan === 2 ? 'sm:col-span-2' : ''}
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <label
                      htmlFor={field.name}
                      className='text-xs font-bold uppercase tracking-wide text-orange-950/70'
                    >
                      {field.label}
                    </label>
                  </div>

                  <div className='relative'>
                    <input
                      required
                      id={field.name}
                      type={isPassword && showPassword ? 'text' : field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      className={`peer w-full rounded-xl border bg-white px-4 py-3 text-sm text-orange-950 outline-none transition-all duration-200 placeholder:text-orange-950/30 ${
                        isFocused
                          ? 'border-orange-400 ring-4 ring-orange-100'
                          : 'border-orange-200 hover:border-orange-300'
                      } ${isPassword ? 'pr-12' : ''}`}
                    />

                    {isPassword && (
                      <button
                        type='button'
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-orange-950/50 transition hover:text-orange-700 focus:outline-none'
                      >
                        {showPassword ? (
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
                        )}
                      </button>
                    )}
                  </div>

                  <p className='mt-2 text-[11px] font-medium text-orange-950/45'>
                    {field.hint}
                  </p>
                </div>
              )
            })}
            
            <div className='sm:col-span-2'>
              <div className='mb-2 flex items-center justify-between'>
                <label
                  htmlFor='image'
                  className='text-xs font-bold uppercase tracking-wide text-orange-950/70'
                >
                  Profile Image
                </label>
              </div>
              <div className='relative'>
                <input
                  id='image'
                  type='file'
                  name='image'
                  onChange={handleChange}
                  accept='image/*'
                  className='peer w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-orange-950 outline-none transition-all duration-200 border-orange-200 hover:border-orange-300 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:font-semibold file:text-orange-700'
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div
            className='mt-8 flex flex-col-reverse items-stretch gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between'
            style={{ borderColor: `${BRAND}26` }}
          >
            <p className='text-xs text-orange-950/50'>
              The new admin will receive full access to the dashboard.
            </p>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='flex-1 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50 sm:flex-initial'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex-1 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial'
                style={{ background: BRAND }}
              >
                {isSubmitting ? 'Creating...' : 'Create admin'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateAdmin