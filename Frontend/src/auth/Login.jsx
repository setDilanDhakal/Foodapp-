import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


function Login({  onAuthenticated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('api/users/profile', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        if (response.data.user) {
          navigate('/');
        }
      } catch (error) {
        // Not logged in
      }
    };
    checkLogin();
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    try {
      const response = await axios.post('api/users/login', {
        email: formData.get('email'),
        password: formData.get('password'),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      toast.success('Login verified. Welcome back.', { id: 'login-success' })
      
      window.dispatchEvent(new CustomEvent('user-login', { detail: response.data.user }))

      if (onAuthenticated) {
        onAuthenticated(response.data.user)
      }

      if (response.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Unable to verify your login. Please try again.', { id: 'login-error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='flex min-h-[calc(100vh-76px)] items-center justify-center bg-orange-50 px-5 py-16'>
      <section className='grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-orange-950/10 lg:grid-cols-[0.9fr_1.1fr]'>
        <div className='hidden bg-orange-950 p-10 text-white lg:flex lg:flex-col lg:justify-between'>
          <div>
            <button type='button' onClick={() => navigate('/')} className='flex items-center gap-3 text-left'>
              <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-orange-400'>
                <img src='images/bhojExpress.jpg' alt='Bhoj Express logo' className='h-full w-full rounded-full object-contain' />
              </div>
              <span className='text-xl font-bold'>Bhoj Express</span>
            </button>
            <p className='mt-20 text-4xl font-black leading-tight'>Welcome back to your table.</p>
          </div>
          <p className='max-w-xs text-sm leading-6 text-orange-200'>Sign in to reorder favorites, track deliveries, and discover something delicious.</p>
        </div>

        <div className='p-7 sm:p-12'>
          <button type='button' onClick={(() => navigate('/'))} className='text-sm font-bold text-orange-600 hover:text-orange-800'>← Back to home</button>
          <div className='mt-10'><p className='text-sm font-bold uppercase tracking-[0.2em] text-orange-600'>Good to see you</p><h1 className='mt-2 text-4xl font-black tracking-tight text-orange-950'>Sign in</h1><p className='mt-3 text-sm text-orange-950/60'>Continue your Bhoj Express journey.</p></div>
          <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
            <label className='block text-sm font-bold text-orange-950'>Email address<input type='email' name='email' autoComplete='email' required placeholder='you@example.com' className='mt-2 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200' /></label>
            <label className='block text-sm font-bold text-orange-950'>Password<div className='relative mt-2'><input type={showPassword ? 'text' : 'password'} name='password' autoComplete='current-password' required placeholder='Enter your password' className='w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 pr-12 font-normal outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200' /><button type='button' onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className='absolute inset-y-0 right-0 flex w-12 items-center justify-center text-orange-600 hover:text-orange-800'><svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='h-5 w-5'><path strokeLinecap='round' strokeLinejoin='round' d='M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z' /><circle cx='12' cy='12' r='2.5' /></svg></button></div></label>
            <div className='flex items-center justify-between text-xs'><label className='flex items-center gap-2 text-orange-950/60'><input type='checkbox' className='accent-orange-600' /> Remember me</label><button type="button" onClick={() => navigate('/forgot-password')} className='font-bold text-orange-600 hover:text-orange-800'>Forgot password?</button></div>
            <button type='submit' disabled={isSubmitting} aria-busy={isSubmitting} className='w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60'>{isSubmitting ? 'Verifying...' : 'Sign in'}</button>
          </form>
          <p className='mt-8 text-center text-sm text-orange-950/60'>New to Bhoj Express? <button type='button' onClick={() => navigate('/register')} className='font-bold text-orange-600 hover:text-orange-800'>Create an account</button></p>
        </div>
      </section>
    </main>
  )
}

export default Login