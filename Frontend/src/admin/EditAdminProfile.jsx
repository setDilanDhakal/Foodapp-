import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const BRAND = '#F54900'
const CREAM = '#FFFCF4'

function EditAdminProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  // Profile image state
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
        setAvatarPreview(u?.avatar || u?.image || '')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load profile details')
        navigate('/admin/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [navigate])

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be smaller than 2 MB')
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
      const newAvatar = data.user?.avatar || data.user?.image || data.avatar
      if (newAvatar) {
        setUser((u) => ({ ...u, avatar: newAvatar, image: newAvatar }))
        setAvatarPreview(newAvatar)
      }
      setAvatarFile(null)
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload profile picture')
      setAvatarPreview(user?.avatar || user?.image || '')
      setAvatarFile(null)
      return false
    } finally {
      setUploadingAvatar(false)
    }
  }, [user])

  const handleSubmit = async (e) => {
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

      if (avatarFile) {
        await uploadAvatar(avatarFile)
      }

      toast.success('Admin details updated successfully!')
      setTimeout(() => navigate('/admin/dashboard'), 900)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update admin profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='h-9 w-9 animate-spin rounded-full border-4 border-orange-500 border-r-transparent' />
          <p className='text-xs font-semibold text-orange-950/60'>Loading admin profile...</p>
        </div>
      </div>
    )
  }

  const currentImageSrc = avatarPreview || user?.avatar || user?.image || '/images/bhojExpress.jpg'

  return (
    <section className='mx-auto max-w-2xl'>
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
            Account settings
          </p>
          <h2 className='mt-1 text-2xl font-black text-orange-950'>Edit admin details</h2>
          <p className='mt-1 text-sm text-orange-950/60'>
            Update your personal information and profile picture for your administrator account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='px-6 py-6 sm:px-8 sm:py-8 space-y-6'>
          {/* Profile Picture Section */}
          <div className='flex items-center gap-5 rounded-2xl border border-orange-100 bg-orange-50/50 p-4'>
            <div className='relative shrink-0'>
              <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-orange-200 bg-white p-1 shadow-sm'>
                <img
                  src={currentImageSrc}
                  alt='Admin Profile'
                  className='h-full w-full rounded-full object-cover'
                  onError={(e) => {
                    e.currentTarget.src = '/images/bhojExpress.jpg'
                  }}
                />
              </div>
              <button
                type='button'
                onClick={openFilePicker}
                aria-label='Upload profile picture'
                title='Upload profile picture'
                className='absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white shadow transition hover:bg-orange-600'
              >
                ✏️
              </button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleAvatarSelect}
                className='hidden'
              />
            </div>

            <div className='min-w-0 flex-1 space-y-2'>
              <p className='text-sm font-bold text-orange-950'>Profile Picture</p>
              <div className='flex flex-wrap items-center gap-2'>
                <button
                  type='button'
                  onClick={openFilePicker}
                  className='rounded-xl border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-50'
                >
                  📷 Choose image
                </button>
                {avatarPreview && avatarPreview !== '/images/bhojExpress.jpg' && (
                  <button
                    type='button'
                    onClick={handleRemoveAvatar}
                    className='rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100'
                  >
                    Remove
                  </button>
                )}
              </div>
              {avatarFile && (
                <p className='text-xs font-medium text-orange-600'>Selected: {avatarFile.name}</p>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
            <div className='sm:col-span-1'>
              <label className='mb-1.5 block text-xs font-bold uppercase tracking-wide text-orange-950/70'>
                Full name
              </label>
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
                required
                placeholder='Admin name'
                className='w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-orange-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
              />
            </div>

            <div className='sm:col-span-1'>
              <label className='mb-1.5 block text-xs font-bold uppercase tracking-wide text-orange-950/70'>
                Phone number
              </label>
              <input
                type='tel'
                name='phone'
                value={form.phone}
                onChange={handleChange}
                placeholder='Phone number'
                className='w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-orange-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
              />
            </div>

            <div className='sm:col-span-2'>
              <label className='mb-1.5 block text-xs font-bold uppercase tracking-wide text-orange-950/70'>
                Email address
              </label>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                required
                placeholder='admin@example.com'
                className='w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-orange-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
              />
            </div>

            <div className='sm:col-span-2'>
              <label className='mb-1.5 block text-xs font-bold uppercase tracking-wide text-orange-950/70'>
                Address
              </label>
              <textarea
                name='address'
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder='Office / Admin address'
                className='w-full resize-none rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-orange-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className='flex items-center justify-end gap-3 border-t pt-5'
            style={{ borderColor: `${BRAND}26` }}
          >
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={saving || uploadingAvatar}
              className='rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60'
              style={{ background: BRAND }}
            >
              {saving || uploadingAvatar ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default EditAdminProfile
