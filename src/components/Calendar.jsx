import { useState, useEffect } from 'react'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Calendar({ onSelectDate, selectedDate }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [localTime, setLocalTime] = useState('')

  useEffect(() => {
    updateLocalTime()
    const interval = setInterval(updateLocalTime, 15000)
    return () => clearInterval(interval)
  }, [])

  const updateLocalTime = () => {
    setLocalTime(new Date().toLocaleString())
  }

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const mondayFirstIndex = (jsDay) => (jsDay + 6) % 7

  const renderCalendar = () => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const startOffset = mondayFirstIndex(firstDay.getDay())
    const totalDays = daysInMonth(viewYear, viewMonth)

    const days = []

    // Empty cells
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="calEmpty"></div>)
    }

    // Day buttons
    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(viewYear, viewMonth, day)
      cellDate.setHours(0, 0, 0, 0)

      const isPast = cellDate < today
      const isSelected =
        selectedDate &&
        cellDate.getFullYear() === selectedDate.getFullYear() &&
        cellDate.getMonth() === selectedDate.getMonth() &&
        cellDate.getDate() === selectedDate.getDate()

      days.push(
        <button
          key={`day-${day}`}
          className={`dayBtn ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          disabled={isPast}
          onClick={() => !isPast && onSelectDate(cellDate)}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className="card">
      <div className="row between">
        <div>
          <h2>Select a date</h2>
          <div className="muted small">Local time: {localTime}</div>
        </div>

        <div className="monthYearSelector">
          <select 
            value={viewMonth} 
            onChange={(e) => setViewMonth(parseInt(e.target.value))}
            className="selector"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
          
          <select 
            value={viewYear} 
            onChange={(e) => setViewYear(parseInt(e.target.value))}
            className="selector"
          >
            {Array.from({ length: 50 }, (_, i) => {
              const year = today.getFullYear() + i
              return (
                <option key={year} value={year}>{year}</option>
              )
            })}
          </select>

          <button className="btn ghost" type="button" onClick={() => {
            setViewYear(today.getFullYear())
            setViewMonth(today.getMonth())
          }}>
            Today
          </button>
        </div>
      </div>

      <div className="dow">
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
        <div>Su</div>
      </div>

      <div className="calendar">{renderCalendar()}</div>

      <p className="muted">
        Selected date: <b>{selectedDate ? selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'None'}</b>
      </p>
    </div>
  )
}
