import { useState, useEffect } from 'react'
import Calendar from './Calendar'
import TimeSelector from './TimeSelector'
import BookingForm from './BookingForm'

export default function Booking() {
  const [slide, setSlide] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [message, setMessage] = useState('')

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setSlide(1)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setSlide(2)
  }

  const handleSubmit = (formData) => {
    setMessage('Submitted! We\'ll contact you shortly.')
    setTimeout(() => {
      setSlide(0)
      setSelectedDate(null)
      setSelectedTime(null)
      setMessage('')
    }, 2000)
  }

  return (
    <section id="booking" className="section">
      <div className="wrap">
        {message && (
          <div className="banner success">✅ {message}</div>
        )}

        <div className="slider">
          <div
            className="track"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {/* Slide 0: Calendar */}
            <section className="slide">
              <Calendar onSelectDate={handleDateSelect} selectedDate={selectedDate} />
            </section>

            {/* Slide 1: Time */}
            <section className="slide">
              <TimeSelector
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
                onBack={() => setSlide(0)}
              />
            </section>

            {/* Slide 2: Form */}
            <section className="slide">
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSubmit={handleSubmit}
                onBack={() => setSlide(1)}
              />
            </section>
          </div>
        </div>

        <p className="muted small center" style={{ marginTop: '12px' }}>
          Note: Technicians arrive within 3 hours of your appointment for inspection.
        </p>
      </div>
    </section>
  )
}
