const timeSlots = [
  { group: 'Morning', times: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
  { group: 'Afternoon', times: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
  { group: 'Evening', times: ['6:00 PM'] }
]

export default function TimeSelector({ selectedDate, selectedTime, onSelectTime, onBack }) {
  const dateStr = selectedDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="card">
      <div className="row between center">
        <div className="muted small">
          Select a time on <b>{dateStr}</b>
        </div>
        <button className="btn ghost" type="button" onClick={onBack}>
          Back →
        </button>
      </div>

      <div className="times">
        {timeSlots.map((slot) => (
          <div key={slot.group} className="timeCol">
            <h3>{slot.group}</h3>
            <div className="grid2">
              {slot.times.map((time) => (
                <button
                  key={time}
                  className={`timeBtn ${selectedTime === time ? 'selected' : ''}`}
                  type="button"
                  onClick={() => onSelectTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="muted">
        Selected time: <b>{selectedTime || 'None'}</b>
      </p>
    </div>
  )
}
