import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  // Profile picture state
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/users/profile', { withCredentials: true })
        const u = data.user
        setUser(u)
        setForm({
          name: u?.name || '',
          email: u?.email || '',
          phone: u?.phone || '',
          address: u?.address || '',
        })
        setAvatarPreview(u?.avatar || '')
      } catch (e) {
        if (e.response?.status === 401) {
          toast.error('Please login to view your profile')
          navigate('/login')
        } else {
          toast.error('Failed to load profile')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [navigate])

  // Clean up object URL on unmount / change
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCancelEdit = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    })
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(null)
    setAvatarPreview(user?.avatar || '')
    setIsEditing(false)
  }

  // ── Avatar handlers ──────────────────────────────────────────────────────
  const openFilePicker = () => fileInputRef.current?.click()

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2 MB')
      return
    }

    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleRemoveAvatar = () => {
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(null)
    setAvatarPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadAvatar = useCallback(async (file) => {
    const fd = new FormData()
    fd.append('avatar', file)
    setUploadingAvatar(true)
    try {
      const { data } = await axios.post('/api/users/profile/avatar', fd, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const newAvatar = data.user?.avatar || data.avatar
      if (newAvatar) {
        setUser((u) => ({ ...u, avatar: newAvatar }))
        setAvatarPreview(newAvatar)
      }
      setAvatarFile(null)
      toast.success('Profile picture updated!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload picture')
      setAvatarPreview(user?.avatar || '')
      setAvatarFile(null)
      return false
    } finally {
      setUploadingAvatar(false)
    }
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.email.trim()) return toast.error('Email is required')

    setSaving(true)
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        },
        { withCredentials: true }
      )
      const updated = data.user
      setUser(updated)
      setForm({
        name: updated.name || '',
        email: updated.email || '',
        phone: updated.phone || '',
        address: updated.address || '',
      })
      setIsEditing(false)
      toast.success('Profile updated successfully!')

      // Upload avatar if a new one was selected
      if (avatarFile) {
        await uploadAvatar(avatarFile)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-orange-50'>
        <div className='flex flex-col items-center'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-r-transparent' />
          <p className='mt-4 text-sm font-semibold text-orange-900/60'>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-orange-50 px-4'>
        <div className='rounded-2xl border border-orange-100 bg-white p-10 text-center shadow-sm'>
          <p className='text-lg font-bold text-orange-950'>Unable to load profile</p>
          <Link
            to='/login'
            className='mt-4 inline-block rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-700'
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const initials = (user.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const avatarSrc = avatarPreview || user.avatar || ''

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl'>

        {/* Back link */}
        <Link
          to='/'
          className='mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition'
        >
          ← Back to Home
        </Link>

        <div className='overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_16px_48px_rgba(251,146,60,0.10)]'>

          {/* Header banner */}
          <div className='bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 px-8 py-8'>
            <div className='flex items-center gap-4'>

              {/* Avatar with upload overlay */}
              <div className='relative shrink-0'>
                <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white text-2xl font-black text-orange-600 shadow-md ring-4 ring-white/60'>
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={user.name || 'Profile'}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <span
                    className='h-full w-full items-center justify-center'
                    style={{ display: avatarSrc ? 'none' : 'flex' }}
                  >
                    {initials}
                  </span>
                </div>

                {/* Camera button — visible only while editing */}
                {isEditing && (
                  <button
                    type='button'
                    onClick={openFilePicker}
                    aria-label='Upload profile picture'
                    className='absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-600 text-white shadow-md transition hover:bg-orange-700'
                  >
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='h-4 w-4'>
                      <path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' />
                      <circle cx='12' cy='13' r='4' />
                    </svg>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarSelect}
                  className='hidden'
                />
              </div>

              <div className='min-w-0'>
                <p className='text-xs font-bold uppercase tracking-[0.2em] text-white/80'>
                  My Account
                </p>
                <h1 className='mt-0.5 truncate text-2xl font-black text-white'>
                  {user.name || 'User'}
                </h1>
                <p className='truncate text-sm text-white/85'>{user.email}</p>
              </div>
            </div>

            {/* Avatar controls while editing */}
            {isEditing && (
              <div className='mt-4 flex flex-wrap items-center gap-2'>
                <button
                  type='button'
                  onClick={openFilePicker}
                  disabled={uploadingAvatar}
                  className='rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-white disabled:opacity-60'
                >
                  📷 {avatarFile ? 'Change picture' : 'Upload picture'}
                </button>
                {avatarSrc && (
                  <button
                    type='button'
                    onClick={handleRemoveAvatar}
                    className='rounded-full border border-white/60 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/20'
                  >
                    Remove
                  </button>
                )}
                {avatarFile && (
                  <span className='rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white'>
                    📎 {avatarFile.name}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Details / Edit form */}
          <div className='p-8'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-black text-orange-950'>
                  {isEditing ? 'Edit Details' : 'Personal Details'}
                </h2>
                <p className='mt-0.5 text-xs text-orange-900/50'>
                  {isEditing
                    ? 'Update your info and save your changes.'
                    : 'Your account information.'}
                </p>
              </div>

              {!isEditing && (
                <button
                  type='button'
                  onClick={() => setIsEditing(true)}
                  className='inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-orange-700'
                >
                  ✏️ Edit Details
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className='space-y-4'>
              {/* Name */}
              <Field
                label='Full Name'
                name='name'
                value={form.name}
                onChange={handleChange}
                editable={isEditing}
                placeholder='Your full name'
              />

              {/* Email */}
              <Field
                label='Email'
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                editable={isEditing}
                placeholder='you@example.com'
              />

              {/* Phone */}
              <Field
                label='Phone Number'
                name='phone'
                value={form.phone}
                onChange={handleChange}
                editable={isEditing}
                placeholder='Not provided'
                emptyText='Not provided'
              />

              {/* Address */}
              <Field
                label='Delivery Address'
                name='address'
                value={form.address}
                onChange={handleChange}
                editable={isEditing}
                placeholder='Your default delivery address'
                emptyText='No address added yet'
                textarea
              />

              {/* Actions */}
              <div className='flex flex-wrap items-center gap-3 pt-2'>
                {isEditing ? (
                  <>
                    <button
                      type='submit'
                      disabled={saving || uploadingAvatar}
                      className='rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                      {saving ? 'Saving…' : uploadingAvatar ? 'Uploading…' : '✓ Save Changes'}
                    </button>
                    <button
                      type='button'
                      onClick={handleCancelEdit}
                      disabled={saving || uploadingAvatar}
                      className='rounded-xl border border-orange-200 bg-white px-6 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to='/my-orders'
                      className='rounded-xl border border-orange-200 bg-white px-6 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50'
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      to='/profile/changepassword'
                      className='rounded-xl border border-orange-200 bg-white px-6 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50'
                    >
                      🔒 Change Password
                    </Link>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>

        <p className='mt-6 text-center text-xs text-orange-900/40'>
          Your information is kept private and only used for order delivery.
        </p>
      </div>
    </div>
  )
}

/**
 * Simple field that renders as read-only text when not editing,
 * and as an input/textarea when editing.
 */
function Field({ label, name, value, onChange, editable, placeholder, emptyText, type = 'text', textarea = false }) {
  const displayValue = value?.trim() ? value : (emptyText || '—')

  return (
    <div>
      <label className='mb-1.5 block text-xs font-bold uppercase tracking-wide text-orange-600'>
        {label}
      </label>

      {editable ? (
        textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className='w-full resize-none rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-3 text-sm text-orange-950 placeholder-orange-300 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className='w-full rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-3 text-sm text-orange-950 placeholder-orange-300 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
          />
        )
      ) : (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${value?.trim()
              ? 'bg-orange-50/40 text-orange-950 font-medium'
              : 'bg-orange-50/40 text-orange-400 italic'
            }`}
        >
          {displayValue}
        </p>
      )}
    </div>
  )
}

export default Profile