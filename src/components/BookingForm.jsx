import { useState } from 'react'

export default function BookingForm({ selectedDate, selectedTime, onSubmit, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: ''
  })

  const dateStr = selectedDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const scheduleStr = `${dateStr} — ${selectedTime}`

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedDate: dateStr,
          selectedTime,
          ...formData
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Booking failed')
      }

      onSubmit(formData)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        notes: ''
      })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="row between center">
        <div className="muted small">
          Selected schedule: <b>{scheduleStr}</b>
        </div>
        <button className="btn ghost" type="button" onClick={onBack}>
          Back →
        </button>
      </div>

      {error && (
        <div className="banner error" style={{ marginBottom: '16px' }}>
          ❌ {error}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name*"
          required
          maxLength="80"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email*"
          required
          maxLength="120"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          maxLength="30"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address*"
          required
          maxLength="140"
          value={formData.address}
          onChange={handleChange}
        />

        <div className="grid3">
          <input
            type="text"
            name="city"
            placeholder="City*"
            required
            maxLength="60"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            maxLength="40"
            value={formData.state}
            onChange={handleChange}
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip"
            maxLength="20"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="notes"
          rows="4"
          placeholder="Notes"
          maxLength="1000"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>

        <button
          className="btn primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book this appointment'}
        </button>
        <p className="muted small">
          By submitting, you agree we can contact you about this booking.
        </p>
      </form>
    </div>
  )
}
