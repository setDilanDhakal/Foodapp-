import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect if already logged in
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
        // User not logged in, remain here
      }
    };
    checkLogin();
  }, [navigate]);

  async function handleSendOtp(event) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await axios.post('api/users/forgot-password', { email })
      toast.success('Verification code sent to your email')
      setStep(2)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to process your request')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await axios.post('api/users/verify-forgot-password', { email, code })
      toast.success('Code verified successfully')
      setStep(3)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired code')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await axios.post('api/users/reset-password', { email, code, newPassword })
      toast.success('Password reset successfully. You can now log in.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
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
                <img src='/images/bhojExpress.jpg' alt='Bhoj Express logo' className='h-full w-full rounded-full object-contain' />
              </div>
              <span className='text-xl font-bold'>Bhoj Express</span>
            </button>
            <p className='mt-20 text-4xl font-black leading-tight'>Secure your account.</p>
          </div>
          <p className='max-w-xs text-sm leading-6 text-orange-200'>We will help you regain access to your favorite dishes.</p>
        </div>

        <div className='p-7 sm:p-12'>
          <button type='button' onClick={() => navigate('/login')} className='text-sm font-bold text-orange-600 hover:text-orange-800'>← Back to login</button>
          
          <div className='mt-10'>
            <p className='text-sm font-bold uppercase tracking-[0.2em] text-orange-600'>Recovery</p>
            <h1 className='mt-2 text-4xl font-black tracking-tight text-orange-950'>
              {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify Email' : 'Reset Password'}
            </h1>
            <p className='mt-3 text-sm text-orange-950/60'>
              {step === 1 ? "Enter your email to receive a reset code." : step === 2 ? "Enter the 6-digit code sent to your email." : "Enter your new password."}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendOtp} className='mt-8 space-y-5'>
              <label className='block text-sm font-bold text-orange-950'>
                Email address
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} required placeholder='you@example.com' className='mt-2 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200' />
              </label>
              <button type='submit' disabled={isSubmitting} className='w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60'>
                {isSubmitting ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className='mt-8 space-y-5'>
              <label className='block text-sm font-bold text-orange-950'>
                Verification Code
                <input type='text' value={code} onChange={e => setCode(e.target.value)} required placeholder='123456' maxLength={6} className='mt-2 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none tracking-[0.5em] transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200 text-center text-xl' />
              </label>
              <button type='submit' disabled={isSubmitting} className='w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60'>
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className='mt-8 space-y-5'>
              <label className='block text-sm font-bold text-orange-950'>
                New Password
                <input type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} placeholder='At least 8 characters' className='mt-2 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200' />
              </label>
              <button type='submit' disabled={isSubmitting} className='w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60'>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default ForgotPassword
