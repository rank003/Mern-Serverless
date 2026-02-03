import { useState } from 'react'

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="wrap row between center">
        <div className="brand">
          <div className="logoBox">
            <img src="./assets/logo.png" alt="Logo" />
          </div>
          <div>
            <div className="brandTop">SUB-ZERO</div>
            <div className="brandSub">Viking Repair of Santa Monica</div>
          </div>
        </div>

        <button
          className="btn ghost"
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          ☰
        </button>

        <nav className="nav desktop">
          <a href="#home">Home</a>
          <a href="#booking">Book</a>
          <a href="#footer">Contact</a>
        </nav>
      </div>

      {mobileNavOpen && (
        <nav className="nav mobile">
          <div className="wrap nav mobile">
            <a href="#home">Home</a>
            <a href="#booking">Book</a>
            <a href="#footer">Contact</a>
          </div>
        </nav>
      )}
    </header>
  )
}
