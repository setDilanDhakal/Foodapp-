import { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Order support',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post('/api/userquery/feedback', {
        name: formData.name,
        email: formData.email,
        supportType: formData.topic,
        message: formData.message,
      })
      console.log('response', response);

      setFormData({
        name: '',
        email: '',
        topic: 'Order support',
        message: '',
      })
      toast.success(response.data.message || 'Your message has been sent successfully.', {
        position: 'top-right',
        duration: 2000,
      })

    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send your message.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='bg-orange-50 px-5 py-16 text-orange-950 lg:px-8'>
      <Toaster />
      <div className='mx-auto max-w-7xl'>
        <div className='max-w-2xl'>
          <p className='text-sm font-bold uppercase tracking-[0.2em] text-orange-600'>
            We are here to help
          </p>
          <h1 className='mt-3 text-5xl font-black tracking-tight sm:text-6xl'>
            Let&apos;s talk food.
          </h1>
          <p className='mt-5 text-lg leading-8 text-orange-950/65'>
            Questions about an order, a partnership, or what to try next? Send us a note and our team will get back to you.
          </p>
        </div>

        <div className='mt-14 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]'>
          <aside className='rounded-[2rem] bg-orange-950 p-8 text-white'>
            <div className='flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-orange-400'>
              <img
                src='/bhojExpress(1).jpg'
                alt='Bhoj Express logo'
                className='h-full w-full rounded-full object-contain'
              />
            </div>
            <h2 className='mt-10 text-2xl font-black'>Reach Bhoj Express</h2>
            <div className='mt-8 space-y-6 text-sm'>
              <div>
                <p className='font-bold text-orange-300'>Email us</p>
                <a
                  href='mailto:hello@bhojexpress.com'
                  className='mt-1 block text-orange-100 hover:text-white'
                >
                  hello@bhojexpress.com
                </a>
              </div>
              <div>
                <p className='font-bold text-orange-300'>Call us</p>
                <a
                  href='tel:+15550142764'
                  className='mt-1 block text-orange-100 hover:text-white'
                >
                  +977 9801427644
                </a>
              </div>
              <div>
                <p className='font-bold text-orange-300'>Hours</p>
                <p className='mt-1 text-orange-100'>Every day, 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </aside>

          <section className='rounded-[2rem] bg-white p-7 shadow-lg shadow-orange-950/5 sm:p-10'>
            <div className='flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-2xl font-black'>Send a message</h2>
                <p className='mt-2 text-sm text-orange-950/60'>
                  We usually reply within one business day.
                </p>
              </div>
              <span className='hidden text-4xl sm:block' role='img' aria-label='Message'>
                💬
              </span>
            </div>


            <form onSubmit={handleSubmit} className='mt-8 grid gap-5 sm:grid-cols-2'>
              <label className='text-sm font-bold'>
                Name
                <input
                  type='text'
                  name='name'
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Your name'
                  className='mt-2 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200'
                />
              </label>

              <label className='text-sm font-bold'>
                Email address
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder='you@example.com'
                  className='mt-2 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200'
                />
              </label>

              <label className='text-sm font-bold sm:col-span-2'>
                What can we help with?
                <select
                  value={formData.topic}
                  onChange={handleChange}
                  name='topic'
                  className='mt-2 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200'
                >
                  <option>Order support</option>
                  <option>Partnerships</option>
                  <option>Feedback</option>
                  <option>Something else</option>
                </select>
              </label>

              <label className='text-sm font-bold sm:col-span-2'>
                Message
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  rows='5'
                  required
                  placeholder='Tell us what is on your mind...'
                  className='mt-2 w-full resize-none rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-normal outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200'
                />
              </label>

              <button
                type='submit'
                disabled={isSubmitting}
                className='rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-orange-700 sm:col-span-2 sm:w-fit'
              >
                {isSubmitting ? 'Sending...' : 'Send message'} <span aria-hidden='true'>→</span>
              </button>
            </form>

          </section>
        </div>
        <div className='mt-16'>
          <h2 className='text-2xl font-black mb-6'>Find us here</h2>
          <div className='w-full overflow-hidden rounded-[2.5rem] border border-orange-200 shadow-xl shadow-orange-950/5 h-[400px] md:h-[500px] bg-white'>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2423.9303486174267!2d84.12753693530289!3d27.644898196285325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39945044376c8489%3A0x7dc3b121e07eb13f!2sKawasoti%20Thana%20Chok%2C%20Kawasoti%2C%20Lumbini%20Province%2033000!5e1!3m2!1sen!2snp!4v1789969353851!5m2!1sen!2snp" 
              className='w-full h-full'  
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin">
            </iframe>
          </div>
        </div>

        <div className='pt-10 text-center'>
          <a href="/">
            <button
              type='button'
              className='text-sm font-bold text-orange-600 hover:text-orange-800'
            >
              ← Back to home
            </button>
          </a>
        </div>
      </div>
    </main>
  )
}

export default Contact